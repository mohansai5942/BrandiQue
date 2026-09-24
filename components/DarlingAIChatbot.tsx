import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowUp, Trash2, AlertCircle, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface DarlingAIChatbotProps {
  isIntroFinished?: boolean;
}

const STORAGE_KEY = 'brandique_darling_chat_history';

// User's official Darling AI backend API endpoint
const BACKEND_URL = 'https://brandique-chatbot.vercel.app/api/chat';

const WELCOME_TEXT = "I’m Darling, BrandiQue’s AI assistant. Ask me about our services, websites, branding, SEO, AI automation or e-commerce solutions.";

const SUGGESTIONS = [
  'Tell me about BrandiQue',
  'What kind of websites do you build?',
  'I need a custom quote',
  'What services does BrandiQue offer?'
];

export const DarlingAIChatbot: React.FC<DarlingAIChatbotProps> = ({ isIntroFinished: propIntroFinished }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  // Initialize introFinished strictly checking props and DOM
  const [introFinished, setIntroFinished] = useState(() => {
    if (propIntroFinished !== undefined) return propIntroFinished;
    if (typeof document === 'undefined') return false;
    return (
      document.body.classList.contains('intro-finished') &&
      !document.body.classList.contains('intro-playing')
    );
  });

  // Sync prop changes
  useEffect(() => {
    if (propIntroFinished !== undefined) {
      setIntroFinished(propIntroFinished);
    }
  }, [propIntroFinished]);

  // Load history from the exact same storage key
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string');
        }
      }
    } catch {}
    return [{ id: 'init-1', role: 'assistant', content: WELCOME_TEXT }];
  });

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-40)));
    } catch {}
  }, [messages]);

  // Scroll to bottom without page jumping
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior
      });
    } else if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior, block: 'nearest' });
    }
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom('auto');
      const t1 = setTimeout(() => {
        scrollToBottom('auto');
        inputRef.current?.focus();
      }, 70);
      return () => clearTimeout(t1);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom('smooth');
    }
  }, [messages, isLoading]);

  // Watch video intro completion strictly
  useEffect(() => {
    const handleIntroEnd = () => setIntroFinished(true);
    window.addEventListener('videoIntroEnded', handleIntroEnd);

    const observer = new MutationObserver(() => {
      if (
        document.body.classList.contains('intro-finished') &&
        !document.body.classList.contains('intro-playing')
      ) {
        setIntroFinished(true);
      }
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => {
      window.removeEventListener('videoIntroEnded', handleIntroEnd);
      observer.disconnect();
    };
  }, []);

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const toggleChat = () => setIsOpen(prev => !prev);

  const handleClearHistory = () => {
    const defaultMsg: ChatMessage[] = [{ id: 'init-1', role: 'assistant', content: WELCOME_TEXT }];
    setMessages(defaultMsg);
    setErrorStatus(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  /**
   * Helper that executes the chat request against the user's Darling AI backend.
   * Uses simple CORS request headers (text/plain) which avoids browser preflight OPTIONS
   * failure on static CDN deployments like brandique.in and Vercel.
   */
  const requestChatFromBackend = async (payload: { messages: { role: string; content: string }[] }): Promise<string> => {
    const jsonString = JSON.stringify(payload);

    // Strategy 1: Simple CORS POST directly to the user's Darling AI Vercel backend
    // text/plain;charset=UTF-8 is an HTTP "simple request" content type — browsers do NOT emit
    // a preflight OPTIONS request, bypassing CORS block completely!
    try {
      const res = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        body: jsonString
      });
      if (res.ok) {
        const data = await res.json();
        const reply = data.message || data.reply || data.content;
        if (reply) return reply;
      }
    } catch (e) {
      console.warn('Direct simple-cors fetch attempt failed, trying fallback...', e);
    }

    // Strategy 2: Standard application/json POST to backend (for environments where CORS is accepted)
    try {
      const res = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonString
      });
      if (res.ok) {
        const data = await res.json();
        const reply = data.message || data.reply || data.content;
        if (reply) return reply;
      }
    } catch (e) {
      console.warn('Direct application/json fetch failed...', e);
    }

    // Strategy 3: Local proxy (/api/chat) for Vite dev server or Node full-stack
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonString
      });
      if (res.ok) {
        const data = await res.json();
        const reply = data.message || data.reply || data.content;
        if (reply) return reply;
      }
    } catch (e) {
      console.warn('Local proxy fetch failed...', e);
    }

    throw new Error('All connection attempts failed');
  };

  const sendMessage = async (textToSend?: string) => {
    const text = (textToSend !== undefined ? textToSend : inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    setInputMessage('');
    setIsLoading(true);
    setErrorStatus(null);

    const payload = {
      messages: updated.map(m => ({ role: m.role, content: m.content })).slice(-20)
    };

    try {
      const reply = await requestChatFromBackend(payload);

      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: reply
        }
      ]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorStatus('Connection issue. Retrying in a moment...');
      setMessages(prev => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          role: 'assistant',
          content: "Sorry, I'm having trouble connecting to the cloud right now. Please try sending again or reach out at hello@brandique.in."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!introFinished) {
    return null;
  }

  return (
    <>
      {/* Floating Chat Window Modal - 100% Reliable Native Embed matching BrandiQue Chatbot design */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="darling-native-chat-window"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.16 } }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed z-[99999] bottom-[72px] sm:bottom-[86px] right-3 sm:right-6 w-[285px] min-[360px]:w-[300px] min-[400px]:w-[325px] sm:w-[390px] md:w-[400px] h-[390px] min-[360px]:h-[415px] min-[400px]:h-[435px] sm:h-[620px] md:h-[660px] max-h-[calc(100vh-88px)] sm:max-h-[calc(100vh-100px)] rounded-2xl bg-[#090C12] border border-white/10 shadow-[0_20px_45px_rgba(0,0,0,0.85),0_0_25px_rgba(176,38,255,0.22)] overflow-hidden flex flex-col font-sans"
            role="dialog"
            aria-modal="true"
            aria-label="Darling AI Support"
          >
            {/* Header bar - clean BrandiQue styling */}
            <div className="relative px-3.5 py-2.5 sm:px-4 sm:py-3 bg-[#0F121C] border-b border-white/10 flex items-center justify-between shrink-0 select-none">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
                <div>
                  <h3 className="font-bold text-[15px] sm:text-base text-white tracking-wide leading-tight">Darling AI</h3>
                  <p className="text-[10px] sm:text-[11px] text-gray-400 font-normal leading-none mt-0.5">24/7 Support Online</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Clear Chat Button */}
                <button
                  type="button"
                  onClick={handleClearHistory}
                  title="Clear chat history"
                  aria-label="Clear chat history"
                  className="p-1 sm:p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none cursor-pointer"
                >
                  <Trash2 size={14} className="sm:w-[15px] sm:h-[15px]" />
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Close chat"
                  aria-label="Close chat"
                  className="p-1 sm:p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none cursor-pointer"
                >
                  <X size={16} className="sm:w-[17px] sm:h-[17px]" />
                </button>
              </div>
            </div>

            {/* Chat Messages Body */}
            <div
              ref={chatContainerRef}
              className="relative flex-1 w-full p-3 sm:p-3.5 overflow-y-auto overflow-x-hidden space-y-3 bg-[#090C12] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent overscroll-contain"
            >
              {messages.map((msg) => {
                const isAssistant = msg.role === 'assistant';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                  >
                    {isAssistant && (
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg bg-gradient-to-tr from-neon-purple to-neon-blue flex items-center justify-center shrink-0 mt-0.5 text-white font-bold text-[10px] sm:text-xs">
                        B
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed break-words whitespace-pre-wrap ${
                        isAssistant
                          ? 'bg-[#121622] text-gray-200 border border-white/10 rounded-tl-none shadow-sm'
                          : 'bg-gradient-to-r from-neon-purple to-neon-blue text-white font-medium rounded-tr-none shadow-md'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })}

              {/* Typing / Loading indicator */}
              {isLoading && (
                <div className="flex items-start gap-2 justify-start">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg bg-gradient-to-tr from-neon-purple to-neon-blue flex items-center justify-center shrink-0 mt-0.5 text-white font-bold text-[10px] sm:text-xs">
                    B
                  </div>
                  <div className="bg-[#121622] border border-white/10 rounded-xl rounded-tl-none px-3 py-2 flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 bg-neon-purple rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-neon-blue rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" />
                    <span className="text-[11px] text-gray-400 ml-1 font-medium">Replying...</span>
                  </div>
                </div>
              )}

              {/* Error notice */}
              {errorStatus && (
                <div className="flex items-center gap-2 p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                  <AlertCircle size={13} className="shrink-0 text-rose-400" />
                  <span className="flex-1 text-[11px]">{errorStatus}</span>
                  <button
                    type="button"
                    onClick={() => sendMessage()}
                    className="underline hover:text-white font-semibold cursor-pointer text-[11px]"
                  >
                    Retry
                  </button>
                </div>
              )}

              <div ref={messagesEndRef} className="h-0.5" />
            </div>

            {/* Quick Suggestions Chips - Clean WITHOUT any scrollbars */}
            {messages.length <= 2 && (
              <div className="px-3 py-1.5 bg-[#0C0F17] border-t border-white/5 flex items-center gap-1.5 overflow-x-auto no-scrollbar scrollbar-none shrink-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {SUGGESTIONS.map((sugg, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => sendMessage(sugg)}
                    className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white/5 hover:bg-neon-purple/20 hover:border-neon-purple/30 border border-white/10 text-[10px] sm:text-[11px] text-gray-300 hover:text-white transition-all cursor-pointer"
                  >
                    {sugg}
                  </button>
                ))}
              </div>
            )}

            {/* Chat Input & Composer (Vertically centered) */}
            <div className="p-2.5 sm:p-3 bg-[#0A0D14] border-t border-white/10 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="relative flex items-center gap-2 bg-[#121622] rounded-xl border border-white/10 px-3 h-10 sm:h-11 focus-within:border-neon-purple/60 transition-all shadow-inner"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent text-white text-xs sm:text-xs placeholder:text-gray-500 focus:outline-none leading-normal h-full py-0 my-auto"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  aria-label="Send message"
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all shrink-0 my-auto ${
                    inputMessage.trim() && !isLoading
                      ? 'bg-gradient-to-tr from-neon-purple to-neon-blue text-white shadow-sm hover:scale-105 active:scale-95 cursor-pointer'
                      : 'bg-white/5 text-gray-500 cursor-not-allowed opacity-50'
                  }`}
                >
                  <ArrowUp size={15} strokeWidth={2.5} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Chat Launcher Button (Bottom-Right) */}
      <div className="fixed z-[99998] bottom-4 right-4 sm:bottom-6 sm:right-6 flex items-center gap-3 pointer-events-auto">
        {/* Tooltip on Hover/Focus */}
        <AnimatePresence>
          {showTooltip && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 8, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 8, scale: 0.95 }}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0E121B]/95 border border-neon-purple/40 text-xs font-medium text-white shadow-[0_4px_20px_rgba(176,38,255,0.25)] pointer-events-none whitespace-nowrap backdrop-blur-md"
            >
              <span>Chat with us</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Button */}
        <button
          type="button"
          onClick={toggleChat}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onFocus={() => setShowTooltip(true)}
          onBlur={() => setShowTooltip(false)}
          aria-label={isOpen ? 'Close chat' : 'Open chat'}
          aria-expanded={isOpen}
          className="relative w-[52px] h-[52px] sm:w-[56px] sm:h-[56px] rounded-full p-[2px] bg-gradient-to-tr from-[#B026FF] via-[#00D4FF] to-[#B026FF] bg-[length:200%_200%] animate-gradient-x shadow-[0_8px_25px_rgba(176,38,255,0.38),0_0_15px_rgba(0,212,255,0.22)] hover:shadow-[0_10px_32px_rgba(176,38,255,0.55),0_0_22px_rgba(0,212,255,0.35)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-neon-purple focus:ring-offset-2 focus:ring-offset-[#05070A] cursor-pointer"
        >
          {/* Inner dark circle button */}
          <div className="w-full h-full rounded-full bg-[#0D1017] flex items-center justify-center text-white relative overflow-hidden group-hover:bg-[#121622] transition-colors">
            <div className="absolute inset-0 bg-gradient-to-tr from-neon-purple/20 to-neon-blue/20 opacity-0 group-hover:opacity-100 transition-opacity" />

            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close-icon"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X size={22} className="text-white" />
                </motion.div>
              ) : (
                <motion.div
                  key="chat-icon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="relative flex items-center justify-center text-cyan-400 group-hover:text-white transition-colors"
                >
                  <MessageSquare size={22} className="text-cyan-400 group-hover:text-white transition-colors" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#0D1017] rounded-full animate-pulse" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </button>
      </div>
    </>
  );
};

export default DarlingAIChatbot;
