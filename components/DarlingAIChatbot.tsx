import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowUp, ArrowUpRight, Trash2, Sparkles, Bot, MessageCircle, Check } from 'lucide-react';

const API_ENDPOINT = 'https://brandique-chatbot.vercel.app/api/chat';
const STORAGE_KEY = 'brandique_darling_chat_v4';
const PROFILE_KEY = 'brandique_darling_profile'; // personal details: kept in this browser permanently

type Profile = Partial<Record<'name' | 'business' | 'city' | 'phone' | 'email', string>>;

const loadProfile = (): Profile => {
  if (typeof window === 'undefined') return {};
  try {
    const p = JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}');
    return p && typeof p === 'object' && !Array.isArray(p) ? p : {};
  } catch {
    return {};
  }
};
const WHATSAPP = 'https://wa.me/917093320572';

interface ChatLink { path: string; label: string }
interface ChatMessage { role: 'user' | 'assistant'; content: string; links?: ChatLink[] }

const welcomeFor = (name?: string): ChatMessage => ({
  role: 'assistant',
  content: name
    ? `Welcome back, **${name}** 🙂 How can I help you today?`
    : "Hi, I'm **Darling**, BrandiQue's AI assistant 🙂 Ask me anything about **websites**, **AI agents & automations** or **graphic design**.",
});

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

// Every size inside the widget is in em, and the widget's font size follows the site's
// root scale on desktop, so browser zoom does not enlarge it (same behaviour as the site).
const SCALE = 'text-[11.5px] lg:text-[12px] desk:text-[0.8rem]';

export const DarlingAIChatbot: React.FC<DarlingAIChatbotProps> = ({ isIntroFinished = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(loadHistory);
  const [profile, setProfile] = useState<Profile>(loadProfile);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    try {
      if (messages.length) localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-40)));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* storage unavailable */
    }
  }, [messages]);

  useEffect(() => {
    try {
      if (!Object.keys(profile).length) {
        localStorage.removeItem(PROFILE_KEY);
        return;
      }
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch {
      /* storage unavailable */
    }
  }, [profile]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, loading, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false);
    window.addEventListener('keydown', onKey);
    const t = setTimeout(() => {
      if (window.innerWidth >= 768) inputRef.current?.focus();
    }, 250);
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
            profile,
            page: pathname,
          }),
        });
        const data = await res.json();
        if (!res.ok || typeof data?.message !== 'string') throw new Error('bad response');
        const links: ChatLink[] = Array.isArray(data.links)
          ? data.links.filter((l: ChatLink) => l && typeof l.path === 'string' && l.path.startsWith('/') && l.label)
          : [];
        if (data.profile && typeof data.profile === 'object') {
          setProfile((p) => {
            const merged = { ...p };
            for (const k of ['name', 'business', 'city', 'phone', 'email'] as const) {
              if (typeof data.profile[k] === 'string' && data.profile[k].trim()) merged[k] = data.profile[k].trim();
            }
            return merged;
          });
        }
        setMessages((m) => [...m, { role: 'assistant', content: data.message, links }]);
      } catch {
        setMessages((m) => [
          ...m,
          { role: 'assistant', content: "Sorry, I couldn't connect just now. Please try again, or message us on **WhatsApp** for a quick reply." },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [loading, messages, pathname, profile],
  );

  const goTo = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.innerWidth < 768) setIsOpen(false);
  };

  // Everything lives only in this browser (localStorage); nothing is stored on our servers.
  // "Delete chat" permanently removes the conversation; "everything" also forgets the visitor's details.
  const deleteChat = (everything = false) => {
    setMessages([]);
    if (everything) setProfile({});
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith('brandique_darling_chat') || k === 'brandique_chat_history_v2')
        .forEach((k) => localStorage.removeItem(k));
      sessionStorage.removeItem(STORAGE_KEY);
      if (everything) localStorage.removeItem(PROFILE_KEY);
    } catch {
      /* storage unavailable */
    }
    setConfirmDelete(false);
    setCleared(true);
    setTimeout(() => setCleared(false), 1800);
  };

  if (!isIntroFinished) return null;

  const shown = messages.length ? messages : [welcomeFor(profile.name)];

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
            className={`${SCALE} fixed z-[99999] right-[1.05em] bottom-[5.6em] desk:right-[1.8rem] desk:bottom-[5.6rem] w-[min(84vw,27em)] desk:w-[26.8rem] h-[min(37em,calc(100dvh-7.5em))] desk:h-[min(40.4rem,calc(100vh-9rem))] flex flex-col overflow-hidden rounded-[1.5em] border border-white/10 bg-[#0B0B0D]/95 text-gray-300 shadow-[0_2em_5em_-1.4em_rgba(0,0,0,0.9),0_0_0_1px_rgba(250,204,21,0.08)] backdrop-blur-2xl font-sans`}
          >
            <div className="pointer-events-none absolute -top-[7em] -right-[5em] h-[16em] w-[16em] rounded-full bg-yellow-400/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-[8em] -left-[6em] h-[16em] w-[16em] rounded-full bg-amber-500/10 blur-3xl" />

            {/* Header */}
            <div className="relative flex items-center justify-between gap-[0.8em] border-b border-white/[0.07] px-[1.1em] py-[0.8em]">
              <div className="flex min-w-0 items-center gap-[0.75em]">
                <div className="relative grid h-[2.6em] w-[2.6em] shrink-0 place-items-center rounded-[0.8em] bg-gradient-to-br from-yellow-300 to-amber-500 text-black shadow-[0_0.4em_1.4em_-0.4em_rgba(250,204,21,0.7)]">
                  <Bot className="h-[1.3em] w-[1.3em]" strokeWidth={2.3} />
                  <span className="absolute -bottom-[0.1em] -right-[0.1em] h-[0.85em] w-[0.85em] rounded-full border-[0.15em] border-[#0B0B0D] bg-emerald-400" />
                </div>
                <div className="min-w-0">
                  <div className="text-[1.08em] font-bold leading-tight text-white">Darling</div>
                  <div className="truncate text-[0.8em] leading-tight text-gray-400">AI assistant · Online 24/7</div>
                </div>
              </div>
              <div className="flex items-center gap-[0.25em]">
                <button
                  type="button"
                  onClick={() => (cleared ? null : setConfirmDelete((c) => !c))}
                  title="Delete chat from this browser"
                  aria-label="Delete chat history from this browser"
                  className={`flex h-[2.3em] items-center gap-[0.35em] rounded-[0.65em] px-[0.6em] transition ${
                    cleared ? 'bg-emerald-500/15 text-emerald-400' : 'text-gray-400 hover:bg-rose-500/10 hover:text-rose-400'
                  }`}
                >
                  {cleared ? <Check className="h-[1.1em] w-[1.1em]" /> : <Trash2 className="h-[1.1em] w-[1.1em]" />}
                  <span className="text-[0.85em] font-semibold">{cleared ? 'Deleted' : 'Delete'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Close"
                  aria-label="Close chat"
                  className="grid h-[2.3em] w-[2.3em] place-items-center rounded-[0.65em] text-gray-400 transition hover:bg-white/[0.06] hover:text-white"
                >
                  <X className="h-[1.25em] w-[1.25em]" />
                </button>
              </div>
            </div>

            <AnimatePresence initial={false}>
              {confirmDelete && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="relative overflow-hidden border-b border-white/[0.07] bg-rose-500/[0.05]"
                >
                  <div className="px-[1.1em] py-[0.75em]">
                    <div className="text-[0.86em] text-gray-300">Delete permanently from this browser?</div>
                    <div className="mt-[0.55em] flex flex-wrap gap-[0.4em]">
                      <button type="button" onClick={() => deleteChat(false)} className="rounded-full bg-rose-500 px-[0.9em] py-[0.38em] text-[0.84em] font-semibold text-white transition hover:bg-rose-400">
                        Delete chat
                      </button>
                      <button type="button" onClick={() => deleteChat(true)} className="rounded-full border border-rose-400/40 px-[0.9em] py-[0.38em] text-[0.84em] font-semibold text-rose-300 transition hover:bg-rose-500/10">
                        Chat + my details
                      </button>
                      <button type="button" onClick={() => setConfirmDelete(false)} className="rounded-full px-[0.8em] py-[0.38em] text-[0.84em] font-medium text-gray-400 hover:text-white">
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            <div ref={scrollRef} className="relative flex-1 space-y-[0.8em] overflow-y-auto overscroll-contain px-[1em] py-[1.1em] [scrollbar-width:thin]">
              {shown.map((m, i) =>
                m.role === 'user' ? (
                  <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
                    <div className="max-w-[82%] whitespace-pre-wrap break-words rounded-[1.1em] rounded-br-[0.35em] bg-yellow-400 px-[0.95em] py-[0.55em] font-medium leading-snug text-black">
                      {m.content}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-start gap-[0.5em]">
                    <div className="max-w-[92%] break-words rounded-[1.1em] rounded-bl-[0.35em] border border-white/[0.07] bg-white/[0.04] px-[0.95em] py-[0.7em] leading-relaxed">
                      <MessageBody content={m.content} />
                    </div>
                    {!!m.links?.length && (
                      <div className="flex max-w-[92%] flex-wrap gap-[0.4em]">
                        {m.links.map((l) => (
                          <button
                            key={l.path + l.label}
                            type="button"
                            onClick={() => goTo(l.path)}
                            className="group inline-flex items-center gap-[0.3em] rounded-full border border-yellow-400/25 bg-yellow-400/[0.06] px-[0.85em] py-[0.4em] text-[0.88em] font-semibold text-yellow-300 transition hover:border-yellow-400/60 hover:bg-yellow-400/15"
                          >
                            {l.label}
                            <ArrowUpRight className="h-[1.05em] w-[1.05em] transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ),
              )}

              {loading && (
                <div className="flex w-fit items-center gap-[0.4em] rounded-[1.1em] rounded-bl-[0.35em] border border-white/[0.07] bg-white/[0.04] px-[0.95em] py-[0.85em]">
                  {[0, 1, 2].map((d) => (
                    <motion.span
                      key={d}
                      className="h-[0.42em] w-[0.42em] rounded-full bg-yellow-400"
                      animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                      transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15 }}
                    />
                  ))}
                </div>
              )}

              {!messages.length && !loading && (
                <div className="pt-[0.2em]">
                  <div className="mb-[0.6em] text-[0.78em] font-bold uppercase tracking-[0.18em] text-gray-500">Popular questions</div>
                  <div className="flex flex-wrap gap-[0.4em]">
                    {QUICK_PROMPTS.map((q) => (
                      <button
                        key={q.label}
                        type="button"
                        onClick={() => send(q.prompt)}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-[0.85em] py-[0.42em] text-[0.88em] font-medium text-gray-300 transition hover:border-yellow-400/50 hover:text-white"
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
              className="relative border-t border-white/[0.07] p-[0.8em]"
            >
              <div className="flex items-end gap-[0.5em] rounded-[1.1em] border border-white/10 bg-white/[0.04] p-[0.35em] pl-[0.95em] transition focus-within:border-yellow-400/50">
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
                  placeholder="Type your message…"
                  aria-label="Type your message"
                  className="max-h-[8em] flex-1 resize-none bg-transparent py-[0.45em] text-[1em] leading-snug text-white placeholder:text-gray-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  aria-label="Send message"
                  className="grid h-[2.5em] w-[2.5em] shrink-0 place-items-center rounded-[0.8em] bg-yellow-400 text-black transition hover:bg-yellow-300 disabled:bg-white/10 disabled:text-gray-500"
                >
                  <ArrowUp className="h-[1.2em] w-[1.2em]" strokeWidth={2.6} />
                </button>
              </div>
              <div className="mt-[0.5em] flex items-center justify-between px-[0.2em] text-[0.78em] text-gray-500">
                <span>Saved only on your device · never on our servers</span>
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-400 hover:text-emerald-300">
                  WhatsApp ↗
                </a>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher */}
      <div className={`${SCALE} fixed z-[99998] bottom-[1.1em] right-[1.05em] desk:bottom-[1.6rem] desk:right-[1.8rem]`}>
        <motion.button
          type="button"
          onClick={() => setIsOpen((o) => !o)}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          aria-label={isOpen ? 'Close chat' : 'Chat with Darling, BrandiQue AI'}
          aria-expanded={isOpen}
          className="group relative grid h-[3.9em] w-[3.9em] place-items-center rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500 text-black shadow-[0_0.9em_2.2em_-0.6em_rgba(250,204,21,0.75)] focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300"
        >
          {!isOpen && <span className="absolute inset-0 rounded-full bg-yellow-400/50 animate-ping [animation-duration:2.6s]" />}
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <X className="h-[1.6em] w-[1.6em]" strokeWidth={2.5} />
              </motion.span>
            ) : (
              <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }} className="relative">
                <MessageCircle className="h-[1.7em] w-[1.7em]" strokeWidth={2.4} />
                <Sparkles className="absolute -right-[0.55em] -top-[0.4em] h-[0.8em] w-[0.8em]" strokeWidth={2.6} />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </>
  );
};

export default DarlingAIChatbot;
