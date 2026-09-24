import React, { useState, useEffect } from 'react';
import { X, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const EMBED_CHATBOT_HTML = `<!doctype html>
<html lang="en" class="embed-mode">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Darling AI Assistant</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    html, body {
      width: 100%;
      height: 100%;
      min-height: 100%;
      overflow: hidden;
      background: #090C12;
      color: #e2e8f0;
      font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    .embed-shell {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      background: #090C12;
    }
    .messages-area {
      flex: 1 1 auto;
      min-height: 0;
      overflow-y: auto;
      padding: 14px 16px 8px;
      scrollbar-width: thin;
      scrollbar-color: rgba(255,255,255,0.18) transparent;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .messages-area::-webkit-scrollbar {
      width: 5px;
    }
    .messages-area::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.18);
      border-radius: 4px;
    }
    .message-row {
      display: flex;
      gap: 8px;
      animation: msgFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .message-row.user {
      justify-content: flex-end;
    }
    .bubble {
      max-width: min(85%, 440px);
      padding: 10px 14px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px 16px 16px 4px;
      background: rgba(255, 255, 255, 0.05);
      color: #f1f5f9;
      line-height: 1.55;
      font-size: 13.5px;
      word-break: break-word;
    }
    .message-row.user .bubble {
      border: none;
      border-radius: 16px 16px 4px 16px;
      background: linear-gradient(135deg, #7c3aed, #2563eb);
      color: #ffffff;
      font-size: 13.5px;
      box-shadow: 0 4px 14px rgba(124, 58, 237, 0.28);
    }
    .welcome-card {
      padding: 2px 0 4px;
    }
    .welcome-card h2 {
      font-family: 'Manrope', sans-serif;
      font-size: 15px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 5px;
      letter-spacing: -0.01em;
    }
    .welcome-card p {
      font-size: 13px;
      color: #94a3b8;
      line-height: 1.5;
    }
    .suggestions {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      padding: 2px 16px 8px;
      flex-shrink: 0;
    }
    .suggestions button {
      padding: 6px 12px;
      border-radius: 999px;
      font-size: 11.5px;
      font-weight: 500;
      color: #cbd5e1;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.12);
      cursor: pointer;
      transition: all 0.18s ease;
      white-space: nowrap;
    }
    .suggestions button:hover {
      border-color: rgba(6, 182, 212, 0.6);
      background: rgba(124, 58, 237, 0.16);
      color: #ffffff;
      transform: translateY(-1px);
    }
    .composer-form {
      display: flex;
      gap: 8px;
      align-items: center;
      margin: 4px 14px 14px;
      padding: 5px 6px 5px 14px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 16px;
      background: #0f131e;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      flex-shrink: 0;
    }
    .composer-form:focus-within {
      border-color: rgba(176, 38, 255, 0.5);
      box-shadow: 0 0 0 1px rgba(176, 38, 255, 0.25), 0 4px 14px rgba(0, 0, 0, 0.5);
    }
    #input {
      flex: 1 1 auto;
      width: 100%;
      max-height: 100px;
      resize: none;
      border: 0;
      outline: 0;
      background: transparent;
      color: #ffffff;
      line-height: 1.4;
      font-size: 14px;
      font-family: inherit;
      padding: 6px 0;
    }
    #input::placeholder {
      color: #64748b;
      font-size: 13.5px;
    }
    #sendBtn {
      flex: 0 0 40px;
      width: 40px;
      height: 40px;
      min-width: 40px;
      min-height: 40px;
      display: grid;
      place-items: center;
      border: 0;
      border-radius: 12px;
      background: linear-gradient(135deg, #7c3aed, #2563eb, #06b6d4);
      color: #ffffff;
      font-size: 17px;
      font-weight: 700;
      cursor: pointer;
      transition: transform 0.15s ease, opacity 0.15s ease;
      box-shadow: 0 2px 10px rgba(124, 58, 237, 0.35);
    }
    #sendBtn:hover:not(:disabled) {
      transform: scale(1.05);
    }
    #sendBtn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      transform: none;
    }
    .typing {
      display: inline-flex;
      gap: 4px;
      align-items: center;
      min-width: 48px;
    }
    .typing i {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: #94a3b8;
      animation: typingBounce 1s infinite;
    }
    .typing i:nth-child(2) {
      animation-delay: 0.15s;
    }
    .typing i:nth-child(3) {
      animation-delay: 0.3s;
    }
    @keyframes typingBounce {
      0%, 80%, 100% { transform: translateY(0); opacity: 0.45; }
      40% { transform: translateY(-4px); opacity: 1; }
    }
    @keyframes msgFadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }
  </style>
</head>
<body class="embed-mode">
  <div class="embed-shell">
    <div id="messages" class="messages-area"></div>
    <div id="suggestions" class="suggestions">
      <button data-prompt="What services does BrandiQue offer?">Services</button>
      <button data-prompt="I need a custom website for my business. What do you recommend?">Website</button>
      <button data-prompt="How can BrandiQue help with SEO & marketing?">SEO & Marketing</button>
      <button data-prompt="I want an AI chatbot or automation. What can you build?">AI & Automation</button>
    </div>
    <form id="chatForm" class="composer-form">
      <textarea id="input" rows="1" placeholder="Message BrandiQue…" autocomplete="off"></textarea>
      <button id="sendBtn" type="submit" aria-label="Send message">
        <span>↑</span>
      </button>
    </form>
  </div>
  <script>
    const messagesEl = document.getElementById("messages");
    const input = document.getElementById("input");
    const form = document.getElementById("chatForm");
    const sendBtn = document.getElementById("sendBtn");
    const suggestions = document.getElementById("suggestions");
    const STORAGE_KEY = "brandique_darling_chat_history";
    const API_ENDPOINT = "https://brandique-chatbot.vercel.app/api/chat";

    let history = loadHistory();

    function loadHistory() {
      try {
        let raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
          raw = localStorage.getItem("brandique_chat_history_v2");
        }
        const saved = JSON.parse(raw || "[]");
        if (!Array.isArray(saved)) return [];
        return saved
          .filter(function(m) {
            return m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string";
          })
          .slice(-40);
      } catch (e) {
        return [];
      }
    }

    function saveHistory() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-40)));
      } catch (e) {}
    }

    function scrollBottom() {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function formatMessage(value) {
      const div = document.createElement("div");
      div.textContent = value;
      const escaped = div.innerHTML;
      return escaped
        .replace(/\\*\\*([^\\*\\n]+)\\*\\*/g, "<strong>$1</strong>")
        .replace(/(^|\\n)\\s*[•*]\\s+/g, "$1");
    }

    function addMessage(role, content, options) {
      options = options || {};
      const row = document.createElement("div");
      row.className = "message-row " + role;
      if (role === "assistant" && options.welcome) {
        row.innerHTML = '<div class="bubble welcome-card"><h2>Hi 👋 How can I help you?</h2><p>' + formatMessage(content) + '</p></div>';
      } else {
        row.innerHTML = '<div class="bubble">' + formatMessage(content) + '</div>';
      }
      messagesEl.appendChild(row);
      scrollBottom();
      return row;
    }

    function addTyping() {
      const row = document.createElement("div");
      row.className = "message-row assistant";
      row.innerHTML = '<div class="bubble typing"><i></i><i></i><i></i></div>';
      messagesEl.appendChild(row);
      scrollBottom();
      return row;
    }

    function setLoading(loading) {
      sendBtn.disabled = loading;
      input.disabled = loading;
    }

    async function sendMessage(text) {
      const trimmed = (text || "").trim();
      if (!trimmed || sendBtn.disabled) return;
      if (suggestions) suggestions.style.display = "none";
      addMessage("user", trimmed);
      history.push({ role: "user", content: trimmed });
      saveHistory();
      input.value = "";
      input.style.height = "auto";
      setLoading(true);
      const typing = addTyping();
      try {
        const response = await fetch(API_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history.slice(-20) })
        });
        const data = await response.json();
        typing.remove();
        if (!response.ok) throw new Error(data && data.error ? data.error : "Unable to get a response.");
        history.push({ role: "assistant", content: data.message });
        saveHistory();
        addMessage("assistant", data.message);
      } catch (error) {
        typing.remove();
        addMessage("assistant", (error && error.message) || "Something went wrong. Please try again.");
      } finally {
        setLoading(false);
        input.focus();
      }
    }

    form.addEventListener("submit", function(e) {
      e.preventDefault();
      sendMessage(input.value);
    });

    input.addEventListener("keydown", function(e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        form.requestSubmit();
      }
    });

    input.addEventListener("input", function() {
      input.style.height = "auto";
      input.style.height = Math.min(input.scrollHeight, 100) + "px";
    });

    document.querySelectorAll("[data-prompt]").forEach(function(btn) {
      btn.addEventListener("click", function() {
        sendMessage(btn.getAttribute("data-prompt"));
      });
    });

    function restoreChat() {
      if (!history.length) {
        addMessage(
          "assistant",
          "I’m Darling, BrandiQue’s AI assistant. Ask me about our services, pricing, websites, SEO, AI automation or e-commerce.",
          { welcome: true }
        );
        return;
      }
      if (suggestions) suggestions.style.display = "none";
      for (let i = 0; i < history.length; i++) {
        addMessage(history[i].role, history[i].content);
      }
    }

    restoreChat();
  </script>
</body>
</html>`;

interface DarlingAIChatbotProps {
  isIntroFinished?: boolean;
}

export const DarlingAIChatbot: React.FC<DarlingAIChatbotProps> = ({ isIntroFinished: propIntroFinished }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

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

  // Keyboard accessibility: ESC closes modal
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

  if (!introFinished) {
    return null;
  }

  return (
    <>
      {/* Floating Chat Window Modal with Vercel Chatbot Iframe */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="darling-iframe-chat-window"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12, transition: { duration: 0.16 } }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed z-[99999] bottom-[72px] sm:bottom-[86px] right-3 sm:right-6 w-[calc(100vw-24px)] max-w-[360px] sm:max-w-none sm:w-[410px] md:w-[420px] h-[520px] min-[360px]:h-[540px] sm:h-[640px] md:h-[670px] max-h-[calc(100vh-88px)] sm:max-h-[calc(100vh-100px)] rounded-2xl bg-[#090C12] border border-white/10 shadow-[0_20px_45px_rgba(0,0,0,0.85),0_0_25px_rgba(176,38,255,0.22)] overflow-hidden flex flex-col font-sans"
            role="dialog"
            aria-modal="true"
            aria-label="Darling AI Assistant"
          >
            {/* Header bar - clean BrandiQue styling with X close button */}
            <div className="relative px-3.5 py-2.5 sm:px-4 sm:py-3 bg-[#0F121C] border-b border-white/10 flex items-center justify-between shrink-0 select-none z-10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
                <div>
                  <h3 className="font-bold text-[14px] sm:text-base text-white tracking-wide leading-tight">Darling AI</h3>
                  <p className="text-[10px] sm:text-[11px] text-gray-400 font-normal leading-none mt-0.5">24/7 Support Online</p>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                aria-label="Close chat"
                className="p-1 sm:p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none cursor-pointer"
              >
                <X size={18} className="text-white" />
              </button>
            </div>

            {/* Chatbot Iframe Container - Fills the entire popup */}
            <div className="relative flex-1 w-full h-full bg-[#090C12] overflow-hidden">
              <iframe
                src="https://brandique-chatbot.vercel.app/?embed=1"
                srcDoc={EMBED_CHATBOT_HTML}
                title="Darling AI Assistant"
                className="w-full h-full border-0 block"
                allow="clipboard-write"
              />
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
