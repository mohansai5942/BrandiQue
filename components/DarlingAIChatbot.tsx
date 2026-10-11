import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowUp, ArrowUpRight, RotateCcw, Sparkles, MessageCircle } from 'lucide-react';

const API_ENDPOINT = 'https://brandique-chatbot.vercel.app/api/chat';
const STORAGE_KEY = 'brandique_darling_chat_v4';
const WHATSAPP = 'https://wa.me/917093320572';

interface ChatLink { path: string; label: string }
interface ChatMessage { role: 'user' | 'assistant'; content: string; links?: ChatLink[] }

const WELCOME: ChatMessage = {
  role: 'assistant',
  content:
    "- Hi, I'm **Darling**, BrandiQue's AI assistant 🙂\n- Ask me about **websites**, **AI agents & automations** or **graphic design**.\n- I can share prices, timelines and take you to the right page.",
  links: [
    { path: '/services', label: 'All services' },
    { path: '/pricing', label: 'Pricing & plans' },
  ],
};

const QUICK_PROMPTS = [
  { label: 'Website pricing', prompt: 'How much does a website cost?' },
  { label: 'AI chatbot', prompt: 'Tell me about your AI chatbots' },
  { label: 'Graphic design', prompt: 'What graphic design services do you offer?' },
  { label: 'Monthly plans', prompt: 'What monthly memberships do you have?' },
  { label: 'Free growth audit', prompt: 'What is the free growth audit?' },
  { label: 'Founder', prompt: 'Who is the founder of BrandiQue?' },
];

const loadHistory = (): ChatMessage[] => {
  if (typeof window === 'undefined') return [];
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(saved)) return [];
    return saved
      .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .slice(-40);
  } catch {
    return [];
  }
};

// Renders **bold** safely as React nodes.
const renderInline = (text: string, keyBase: string) =>
  text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={`${keyBase}-${i}`} className="font-semibold text-white">{part.slice(2, -2)}</strong>
    ) : (
      <React.Fragment key={`${keyBase}-${i}`}>{part}</React.Fragment>
    ),
  );

// Bot replies arrive as "- " bullets; anything else is shown as paragraphs.
const MessageBody: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.replace(/\r\n?/g, '\n').split('\n').map((l) => l.trim()).filter(Boolean);
  const bulletRe = /^([-*•]|\d+[.)])\s+/;
  const blocks: React.ReactNode[] = [];
  let bullets: string[] = [];
  const flush = (k: number) => {
    if (!bullets.length) return;
    blocks.push(
      <ul key={`ul-${k}`} className="space-y-1.5">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-400" />
            <span>{renderInline(b, `b-${k}-${i}`)}</span>
          </li>
        ))}
      </ul>,
    );
    bullets = [];
  };
  lines.forEach((line, i) => {
    if (bulletRe.test(line)) bullets.push(line.replace(bulletRe, ''));
    else {
      flush(i);
      blocks.push(<p key={`p-${i}`}>{renderInline(line, `p-${i}`)}</p>);
    }
  });
  flush(lines.length);
  return <div className="space-y-2">{blocks}</div>;
};

interface DarlingAIChatbotProps {
  isIntroFinished?: boolean;
}

export const DarlingAIChatbot: React.FC<DarlingAIChatbotProps> = ({ isIntroFinished = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(loadHistory);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-40)));
    } catch {
      /* storage unavailable */
    }
  }, [messages]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, loading, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false);
    window.addEventListener('keydown', onKey);
    const t = setTimeout(() => inputRef.current?.focus(), 250);
    return () => {
      window.removeEventListener('keydown', onKey);
      clearTimeout(t);
    };
  }, [isOpen]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;
      const next: ChatMessage[] = [...messages, { role: 'user', content: trimmed }];
      setMessages(next);
      setInput('');
      if (inputRef.current) inputRef.current.style.height = 'auto';
      setLoading(true);
      try {
        const res = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: next.slice(-16).map(({ role, content }) => ({ role, content })),
            page: pathname,
          }),
        });
        const data = await res.json();
        if (!res.ok || typeof data?.message !== 'string') throw new Error('bad response');
        const links: ChatLink[] = Array.isArray(data.links)
          ? data.links.filter((l: ChatLink) => l && typeof l.path === 'string' && l.path.startsWith('/') && l.label)
          : [];
        setMessages((m) => [...m, { role: 'assistant', content: data.message, links }]);
      } catch {
        setMessages((m) => [
          ...m,
          {
            role: 'assistant',
            content: "- I couldn't connect just now.\n- Please try again, or message us on **WhatsApp** for a quick reply.",
            links: [{ path: '/contact', label: 'Contact us' }],
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [loading, messages, pathname],
  );

  const goTo = (path: string) => {
    navigate(path);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
    if (typeof window !== 'undefined' && window.innerWidth < 640) setIsOpen(false);
  };

  const resetChat = () => setMessages([]);

  if (!isIntroFinished) return null;

  const shown = messages.length ? messages : [WELCOME];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="darling-chat"
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.97, transition: { duration: 0.16 } }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="false"
            aria-label="Darling, BrandiQue AI assistant"
            className="fixed z-[99999] inset-x-2 bottom-[72px] sm:inset-x-auto sm:right-6 sm:bottom-[92px] sm:w-[400px] h-[min(560px,calc(100dvh-92px))] sm:h-[min(620px,calc(100vh-120px))] flex flex-col overflow-hidden rounded-[22px] border border-white/10 bg-[#0B0B0D]/95 text-[13.5px] text-gray-300 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9),0_0_0_1px_rgba(250,204,21,0.08)] backdrop-blur-2xl font-sans"
          >
            <div className="pointer-events-none absolute -top-24 -right-16 h-56 w-56 rounded-full bg-yellow-400/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 -left-20 h-56 w-56 rounded-full bg-amber-500/10 blur-3xl" />

            {/* Header */}
            <div className="relative flex items-center justify-between gap-3 border-b border-white/[0.07] px-4 py-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-yellow-300 to-amber-500 text-black shadow-[0_6px_20px_-6px_rgba(250,204,21,0.7)]">
                  <Sparkles size={17} strokeWidth={2.4} />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0B0B0D] bg-emerald-400" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-[14.5px] leading-tight text-white">Darling</div>
                  <div className="text-[11px] leading-tight text-gray-400 truncate">BrandiQue AI assistant · replies instantly</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={resetChat}
                  title="New chat"
                  aria-label="Start a new chat"
                  className="grid h-8 w-8 place-items-center rounded-lg text-gray-400 transition hover:bg-white/[0.06] hover:text-white"
                >
                  <RotateCcw size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Close"
                  aria-label="Close chat"
                  className="grid h-8 w-8 place-items-center rounded-lg text-gray-400 transition hover:bg-white/[0.06] hover:text-white"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="relative flex-1 space-y-3 overflow-y-auto overscroll-contain px-3.5 py-4 [scrollbar-width:thin]">
              {shown.map((m, i) =>
                m.role === 'user' ? (
                  <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
                    <div className="max-w-[82%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-yellow-400 px-3.5 py-2 font-medium text-black">
                      {m.content}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-start gap-2">
                    <div className="max-w-[92%] break-words rounded-2xl rounded-bl-md border border-white/[0.07] bg-white/[0.04] px-3.5 py-2.5 leading-relaxed">
                      <MessageBody content={m.content} />
                    </div>
                    {!!m.links?.length && (
                      <div className="flex max-w-[92%] flex-wrap gap-1.5">
                        {m.links.map((l) => (
                          <button
                            key={l.path + l.label}
                            type="button"
                            onClick={() => goTo(l.path)}
                            className={`group inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition ${
                              pathname.replace(/\/+$/, '') === l.path.replace(/\/+$/, '')
                                ? 'border-yellow-400/60 bg-yellow-400/15 text-yellow-200'
                                : 'border-yellow-400/25 bg-yellow-400/[0.06] text-yellow-300 hover:border-yellow-400/60 hover:bg-yellow-400/15'
                            }`}
                          >
                            {l.label}
                            <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ),
              )}

              {loading && (
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-white/[0.07] bg-white/[0.04] px-3.5 py-3 w-fit">
                  {[0, 1, 2].map((d) => (
                    <motion.span
                      key={d}
                      className="h-1.5 w-1.5 rounded-full bg-yellow-400"
                      animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                      transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15 }}
                    />
                  ))}
                </div>
              )}

              {!messages.length && !loading && (
                <div className="pt-1">
                  <div className="mb-2 text-[10.5px] font-bold uppercase tracking-[0.18em] text-gray-500">Popular questions</div>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_PROMPTS.map((q) => (
                      <button
                        key={q.label}
                        type="button"
                        onClick={() => send(q.prompt)}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] font-medium text-gray-300 transition hover:border-yellow-400/50 hover:text-white"
                      >
                        {q.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="relative border-t border-white/[0.07] p-3"
            >
              <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-1.5 pl-3.5 transition focus-within:border-yellow-400/50">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 110) + 'px';
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      send(input);
                    }
                  }}
                  placeholder="Ask about websites, AI or design…"
                  aria-label="Type your message"
                  className="max-h-[110px] flex-1 resize-none bg-transparent py-1.5 text-[16px] sm:text-[13.5px] text-white placeholder:text-gray-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  aria-label="Send message"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-yellow-400 text-black transition hover:bg-yellow-300 disabled:bg-white/10 disabled:text-gray-500"
                >
                  <ArrowUp size={17} strokeWidth={2.6} />
                </button>
              </div>
              <div className="mt-2 flex items-center justify-between px-1 text-[10.5px] text-gray-500">
                <span>Powered by BrandiQue AI</span>
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-400 hover:text-emerald-300">
                  Talk on WhatsApp ↗
                </a>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher */}
      <div className="fixed z-[99998] bottom-4 right-4 sm:bottom-6 sm:right-6">
        <motion.button
          type="button"
          onClick={() => setIsOpen((o) => !o)}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          aria-label={isOpen ? 'Close chat' : 'Chat with Darling, BrandiQue AI'}
          aria-expanded={isOpen}
          className="group relative grid h-[52px] w-[52px] sm:h-14 sm:w-14 place-items-center rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500 text-black shadow-[0_12px_30px_-8px_rgba(250,204,21,0.75)] focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          {!isOpen && <span className="absolute inset-0 rounded-full bg-yellow-400/50 animate-ping [animation-duration:2.6s]" />}
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <X size={22} strokeWidth={2.5} />
              </motion.span>
            ) : (
              <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }} className="relative">
                <MessageCircle size={23} strokeWidth={2.4} />
                <Sparkles size={11} strokeWidth={2.6} className="absolute -top-1.5 -right-2" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </>
  );
};

export default DarlingAIChatbot;
