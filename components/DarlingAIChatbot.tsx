import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const STORAGE_KEY = 'brandique_darling_chat_history';
const MEMORY_STORAGE_KEY = 'brandique_darling_user_memory';

const getEmbedChatbotHtml = (initialIsMobile: boolean) => `<!doctype html>
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
      padding: 12px 14px 6px;
      scrollbar-width: thin;
      scrollbar-color: rgba(255,255,255,0.18) transparent;
      display: flex;
      flex-direction: column;
      gap: 8px;
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
      flex-direction: column;
      animation: msgFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .message-row.user {
      align-items: flex-end;
    }
    .message-row.assistant {
      align-items: flex-start;
    }
    /* Desktop chat text sizes */
    .bubble {
      max-width: min(88%, 460px);
      padding: 8px 13px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px 14px 14px 4px;
      background: rgba(255, 255, 255, 0.05);
      color: #f1f5f9;
      line-height: 1.5;
      font-size: 12.8px;
      word-break: break-word;
    }
    .message-row.user .bubble {
      border: none;
      border-radius: 14px 14px 4px 14px;
      background: linear-gradient(135deg, #7c3aed, #2563eb);
      color: #ffffff;
      font-size: 12.8px;
      line-height: 1.5;
      box-shadow: 0 4px 14px rgba(124, 58, 237, 0.28);
    }
    .message-time {
      font-size: 10.5px;
      color: #94a3b8;
      opacity: 0.65;
      margin-top: 3px;
      line-height: 1;
      user-select: none;
      letter-spacing: 0.01em;
      display: block;
    }
    .message-row.user .message-time {
      text-align: right;
      margin-right: 2px;
    }
    .message-row.assistant .message-time {
      text-align: left;
      margin-left: 2px;
    }
    .welcome-row {
      width: 100%;
      align-items: stretch !important;
    }
    .welcome-row .bubble.welcome-card {
      max-width: 100% !important;
      width: 100%;
      padding: 12px 14px;
      border-radius: 14px;
      background: linear-gradient(140deg, rgba(124, 58, 237, 0.14) 0%, rgba(37, 99, 235, 0.08) 55%, rgba(15, 23, 42, 0.5) 100%);
      border: 1px solid rgba(168, 85, 247, 0.28);
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.12);
    }
    .welcome-card h2.welcome-title {
      font-family: 'Manrope', sans-serif;
      font-size: 15px;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 6px 0;
      letter-spacing: -0.015em;
      line-height: 1.35;
    }
    .welcome-card p.welcome-desc {
      font-size: 12.5px;
      color: #cbd5e1;
      line-height: 1.5;
      margin: 0;
    }
    .welcome-brand {
      color: #ffffff;
      font-weight: 700;
    }
    .welcome-chip {
      display: inline-block;
      padding: 0.5px 5.5px;
      margin: 1px 1px;
      border-radius: 5px;
      background: rgba(255, 255, 255, 0.07);
      border: 1px solid rgba(255, 255, 255, 0.11);
      color: #f1f5f9;
      font-size: 11px;
      font-weight: 500;
      white-space: nowrap;
    }
    .suggestions {
      display: flex;
      flex-wrap: nowrap;
      overflow-x: hidden;
      gap: 5px;
      padding: 2px 12px 6px;
      flex-shrink: 0;
      width: 100%;
      box-sizing: border-box;
      justify-content: center;
      align-items: center;
    }
    .suggestions button {
      flex: 0 0 auto;
      width: auto;
      padding: 4px 8px;
      border-radius: 999px;
      font-size: 10.5px;
      font-weight: 500;
      color: #cbd5e1;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.12);
      cursor: pointer;
      transition: all 0.18s ease;
      white-space: nowrap;
      text-align: center;
      letter-spacing: -0.015em;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .suggestions button:hover {
      border-color: rgba(6, 182, 212, 0.6);
      background: rgba(124, 58, 237, 0.18);
      color: #ffffff;
      transform: translateY(-1px);
    }
    .composer-form {
      display: flex;
      gap: 8px;
      align-items: center;
      margin: 4px 12px 12px;
      padding: 4px 6px 4px 12px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 15px;
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
      line-height: 1.45;
      font-size: 13.5px;
      font-family: inherit;
      padding: 5px 0;
    }
    #input::placeholder {
      color: #64748b;
      font-size: 13px;
    }
    #sendBtn {
      flex: 0 0 34px;
      width: 34px;
      height: 34px;
      min-width: 34px;
      min-height: 34px;
      display: grid;
      place-items: center;
      border: 0;
      border-radius: 10px;
      background: linear-gradient(135deg, #7c3aed, #2563eb, #06b6d4);
      color: #ffffff;
      cursor: pointer;
      transition: transform 0.15s ease, opacity 0.15s ease, box-shadow 0.15s ease;
      box-shadow: 0 2px 10px rgba(124, 58, 237, 0.35);
      padding: 0;
    }
    #sendBtn svg {
      display: block;
      margin-left: 2px;
      margin-top: 1px;
    }
    #sendBtn:hover:not(:disabled) {
      transform: scale(1.05);
      box-shadow: 0 3px 12px rgba(6, 182, 212, 0.45);
    }
    #sendBtn:active:not(:disabled) {
      transform: scale(0.95);
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

    /* Mobile view styles (applied ONLY when is-mobile class is present) */
    body.is-mobile .messages-area {
      padding: 8px 10px 4px;
      gap: 6px;
    }
    body.is-mobile .bubble {
      padding: 7px 11px;
      font-size: 12.2px;
      line-height: 1.48;
      border-radius: 13px 13px 13px 4px;
    }
    body.is-mobile .message-row.user .bubble {
      border-radius: 13px 13px 4px 13px;
      font-size: 12.2px;
      line-height: 1.48;
    }
    body.is-mobile .message-time {
      font-size: 9.5px;
      margin-top: 2px;
    }
    body.is-mobile .welcome-row .bubble.welcome-card {
      padding: 9px 11px;
      border-radius: 13px;
    }
    body.is-mobile .welcome-card h2.welcome-title {
      font-size: 12.5px;
      margin-bottom: 4px;
    }
    body.is-mobile .welcome-card p.welcome-desc {
      font-size: 11px;
      line-height: 1.45;
    }
    body.is-mobile .welcome-chip {
      padding: 0 4px;
      font-size: 10px;
      border-radius: 4px;
    }
    body.is-mobile .suggestions {
      padding: 0 6px 6px;
      gap: 3px;
      flex-wrap: nowrap;
      overflow-x: hidden;
      justify-content: center;
    }
    body.is-mobile .suggestions button {
      flex: 0 0 auto;
      width: auto;
      padding: 3px 5px;
      font-size: 8.5px;
      letter-spacing: -0.025em;
    }
    body.is-mobile .composer-form {
      margin: 2px 8px 8px;
      padding: 3px 4px 3px 10px;
      border-radius: 13px;
    }
    body.is-mobile #input {
      font-size: 12px;
      padding: 3px 0;
    }
    body.is-mobile #input::placeholder {
      font-size: 11px;
    }
    body.is-mobile #sendBtn {
      flex: 0 0 30px;
      width: 30px;
      height: 30px;
      min-width: 30px;
      min-height: 30px;
      border-radius: 9px;
    }
    body.is-mobile #sendBtn svg {
      width: 13px;
      height: 13px;
      margin-left: 1.5px;
      margin-top: 0.5px;
    }
  </style>
</head>
<body class="embed-mode ${initialIsMobile ? 'is-mobile' : 'is-desktop'}">
  <div class="embed-shell">
    <div id="messages" class="messages-area"></div>
    <div id="suggestions" class="suggestions">
      <button data-prompt="What services does BrandiQue offer?">Services</button>
      <button data-prompt="Tell me about BrandiQue's branding and design services.">Branding</button>
      <button data-prompt="I need a custom website for my business. What do you recommend?">Website</button>
      <button data-prompt="How can BrandiQue help with SEO & marketing?">SEO & Marketing</button>
      <button data-prompt="I want an AI chatbot or automation. What can you build?">AI & Automation</button>
    </div>
    <form id="chatForm" class="composer-form">
      <textarea id="input" rows="1" placeholder="Message BrandiQue…" autocomplete="off"></textarea>
      <button id="sendBtn" type="submit" aria-label="Send message">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
    </form>
  </div>
  <script>
    function detectAndSetViewport(forcedMobile) {
      var isMob = false;
      if (typeof forcedMobile === 'boolean') {
        isMob = forcedMobile;
      } else {
        try {
          if (window.parent && typeof window.parent.innerWidth === 'number') {
            isMob = window.parent.innerWidth < 640;
          } else if (window.screen && typeof window.screen.width === 'number') {
            isMob = window.screen.width < 640;
          }
        } catch(e) {
          isMob = false;
        }
      }
      if (isMob) {
        document.body.classList.add('is-mobile');
        document.body.classList.remove('is-desktop');
      } else {
        document.body.classList.add('is-desktop');
        document.body.classList.remove('is-mobile');
      }
    }
    detectAndSetViewport();
    window.addEventListener('resize', function() {
      detectAndSetViewport();
    });
    window.addEventListener('message', function(e) {
      if (!e.data) return;
      if (typeof e.data.isMobile === 'boolean') {
        detectAndSetViewport(e.data.isMobile);
      }
      if (e.data.type === 'CLEAR_CHAT') {
        try {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem("brandique_chat_history_v2");
          localStorage.removeItem(MEMORY_STORAGE_KEY);
        } catch(err) {}
        history = [];
        userMemory = {};
        messagesEl.innerHTML = "";
        if (suggestions) suggestions.style.display = "flex";
        if (input) {
          input.value = "";
          input.style.height = "auto";
        }
        restoreChat();
      }
      if (e.data.type === 'INIT_STORAGE') {
        if (e.data.memory && typeof e.data.memory === 'object' && Object.keys(e.data.memory).length > 0) {
          userMemory = Object.assign({}, userMemory, e.data.memory);
          saveMemory();
        }
        if (Array.isArray(e.data.history) && e.data.history.length > 0 && history.length === 0) {
          history = e.data.history;
          saveHistory();
          messagesEl.innerHTML = "";
          restoreChat();
        }
      }
    });

    const messagesEl = document.getElementById("messages");
    const input = document.getElementById("input");
    const form = document.getElementById("chatForm");
    const sendBtn = document.getElementById("sendBtn");
    const suggestions = document.getElementById("suggestions");
    const STORAGE_KEY = "brandique_darling_chat_history";
    const MEMORY_STORAGE_KEY = "brandique_darling_user_memory";
    const API_ENDPOINT = "https://brandique-chatbot.vercel.app/api/chat";

    let history = loadHistory();
    let userMemory = loadMemory();

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
          .slice(-50);
      } catch (e) {
        return [];
      }
    }

    function saveHistory() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-50)));
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: "SYNC_STORAGE", history: history.slice(-50), memory: userMemory }, "*");
        }
      } catch (e) {}
    }

    function loadMemory() {
      try {
        const raw = localStorage.getItem(MEMORY_STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
      } catch (e) {
        return {};
      }
    }

    function saveMemory() {
      try {
        localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(userMemory));
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: "SYNC_STORAGE", history: history.slice(-50), memory: userMemory }, "*");
        }
      } catch (e) {}
    }

    function extractMemory(text) {
      if (!text || typeof text !== "string") return;
      const clean = text.trim();

      // Extract user's name in English, Telugu, Tanglish
      const namePatterns = [
        /(?:my name is|i am|i'm|call me|this is)\s+([A-Za-z]{2,25})/i,
        /(?:na peru|naa peru|na name|peru(?:\s+vachi)?|nenu)\s+([A-Za-z]{2,25})/i
      ];

      for (let i = 0; i < namePatterns.length; i++) {
        const match = clean.match(namePatterns[i]);
        if (match && match[1]) {
          const candidate = match[1].trim();
          const skipWords = [
            "looking", "interested", "trying", "here", "ready", "asking",
            "wondering", "just", "from", "very", "planning", "searching",
            "brandique", "website", "good", "fine", "online", "developer",
            "boss", "darling", "user", "client", "hello", "okay", "yes", "need"
          ];
          if (!skipWords.includes(candidate.toLowerCase())) {
            const capitalized = candidate.charAt(0).toUpperCase() + candidate.slice(1).toLowerCase();
            userMemory.name = capitalized;
            userMemory.lastUpdated = new Date().toISOString();
            saveMemory();
            break;
          }
        }
      }
    }

    function scrollBottom() {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function formatTime(dateVal) {
      let d;
      if (dateVal instanceof Date) {
        d = dateVal;
      } else if (typeof dateVal === 'string' || typeof dateVal === 'number') {
        d = new Date(dateVal);
      } else {
        d = new Date();
      }
      if (isNaN(d.getTime())) d = new Date();

      let hours = d.getHours();
      const minutes = d.getMinutes();
      const ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const minutesStr = minutes < 10 ? '0' + minutes : minutes;
      return hours + ':' + minutesStr + ' ' + ampm;
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
      const timeStr = options.time || formatTime(options.timestamp);

      if (role === "assistant" && options.welcome) {
        row.className = "message-row assistant welcome-row";
        row.id = "welcomeMessage";
        row.innerHTML =
          '<div class="bubble welcome-card">' +
            '<h2 class="welcome-title">Hi 👋 How can I help you?</h2>' +
            '<p class="welcome-desc">' +
              'I’m <strong class="welcome-brand">Darling</strong>, BrandiQue’s AI assistant. Ask me about our <span class="welcome-chip">Branding</span>, <span class="welcome-chip">Services</span>, <span class="welcome-chip">Websites</span>, <span class="welcome-chip">SEO</span>, <span class="welcome-chip">AI Automation</span>, <span class="welcome-chip">Pricing</span> or <span class="welcome-chip">E-commerce</span>.' +
            '</p>' +
          '</div>';
      } else {
        row.className = "message-row " + role;
        row.innerHTML =
          '<div class="bubble">' + formatMessage(content) + '</div>' +
          '<span class="message-time">' + timeStr + '</span>';
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

      // Remove the welcome message card as soon as user sends a message
      const welcomeEl = document.getElementById("welcomeMessage");
      if (welcomeEl) {
        welcomeEl.remove();
      }
      const extraWelcome = document.querySelectorAll(".welcome-row, .welcome-card");
      extraWelcome.forEach(function(el) {
        const row = el.closest(".message-row") || el;
        row.remove();
      });

      // 1. Extract memory facts from user message
      extractMemory(trimmed);

      // 2. Add message to UI and history with timestamp
      const userTime = formatTime(new Date());
      addMessage("user", trimmed, { time: userTime });
      history.push({ role: "user", content: trimmed, time: userTime });
      saveHistory();

      input.value = "";
      input.style.height = "auto";
      setLoading(true);
      const typing = addTyping();

      try {
        // 3. Prepare message payload for API
        let recentSlice = history.slice(-20);

        // If user memory has name (e.g. Kishore), ensure Darling AI has the memory anchor across days/sessions
        if (userMemory && userMemory.name) {
          const hasName = recentSlice.some(function(m) {
            return m.role === "user" && m.content.toLowerCase().includes(userMemory.name.toLowerCase());
          });
          if (!hasName) {
            recentSlice = [
              { role: "user", content: "My name is " + userMemory.name },
              { role: "assistant", content: "Nice to meet you " + userMemory.name + "! How can I help you today?" }
            ].concat(recentSlice);
          }
        }

        const response = await fetch(API_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: recentSlice })
        });
        const data = await response.json();
        typing.remove();
        if (!response.ok) throw new Error(data && data.error ? data.error : "Unable to get a response.");

        const aiTime = formatTime(new Date());
        history.push({ role: "assistant", content: data.message, time: aiTime });
        saveHistory();
        addMessage("assistant", data.message, { time: aiTime });
      } catch (error) {
        typing.remove();
        const errTime = formatTime(new Date());
        addMessage("assistant", (error && error.message) || "Something went wrong. Please try again.", { time: errTime });
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
          "I’m Darling, BrandiQue’s AI assistant. Ask me about our branding, services, websites, SEO, AI automation, pricing or e-commerce.",
          { welcome: true }
        );
        return;
      }
      if (suggestions) suggestions.style.display = "none";
      for (let i = 0; i < history.length; i++) {
        addMessage(history[i].role, history[i].content, { time: history[i].time || formatTime() });
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
  const [clearedNotice, setClearedNotice] = useState(false);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 640;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      const mob = window.innerWidth < 640;
      setIsMobile(mob);
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage({ type: 'SET_VIEWPORT', isMobile: mob }, '*');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync storage events between parent page and iframe
  useEffect(() => {
    const handleStorageSync = (e: MessageEvent) => {
      if (e.data && e.data.type === 'SYNC_STORAGE') {
        try {
          if (Array.isArray(e.data.history)) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(e.data.history));
          }
          if (e.data.memory && typeof e.data.memory === 'object') {
            localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(e.data.memory));
          }
        } catch (err) {}
      }
    };
    window.addEventListener('message', handleStorageSync);
    return () => window.removeEventListener('message', handleStorageSync);
  }, []);

  const handleClearChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('brandique_chat_history_v2');
      localStorage.removeItem(MEMORY_STORAGE_KEY);
    } catch (err) {}

    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'CLEAR_CHAT' }, '*');
    }

    setClearedNotice(true);
    setTimeout(() => setClearedNotice(false), 2000);
  };

  // Initialize introFinished strictly checking props and DOM (default true)
  const [introFinished, setIntroFinished] = useState(() => {
    if (propIntroFinished !== undefined) return propIntroFinished;
    return true;
  });

  // Sync prop changes
  useEffect(() => {
    if (propIntroFinished !== undefined) {
      setIntroFinished(propIntroFinished);
    }
  }, [propIntroFinished]);

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
            className="fixed z-[99999] bottom-[68px] sm:bottom-[86px] right-3 sm:right-6 w-[calc(100vw-24px)] max-w-[325px] min-[380px]:max-w-[345px] sm:max-w-none sm:w-[385px] md:w-[400px] h-[430px] min-[380px]:h-[460px] sm:h-[545px] md:h-[565px] max-h-[70vh] sm:max-h-[calc(100vh-100px)] rounded-2xl bg-[#090C12] border border-white/10 shadow-[0_20px_45px_rgba(0,0,0,0.85),0_0_25px_rgba(176,38,255,0.22)] overflow-hidden flex flex-col font-sans"
            role="dialog"
            aria-modal="true"
            aria-label="Darling AI Assistant"
          >
            {/* Header bar - clean BrandiQue styling with Clear Chat and X close button */}
            <div className="relative px-3 py-2 sm:px-4 sm:py-2.5 bg-[#0F121C] border-b border-white/10 flex items-center justify-between shrink-0 select-none z-10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
                <div>
                  <h3 className="font-bold text-[14.5px] sm:text-base text-white tracking-wide leading-tight">Darling AI</h3>
                  <p className="text-[8.5px] sm:text-[11px] text-gray-400 font-normal leading-none mt-0.5">24/7 Support Online</p>
                </div>
              </div>

              {/* Action Buttons: Clear Chat & Close */}
              <div className="flex items-center gap-1 sm:gap-1.5">
                {/* Clear Chat Button */}
                <button
                  type="button"
                  onClick={handleClearChat}
                  title={clearedNotice ? "Chat & memory cleared!" : "Clear chat"}
                  aria-label="Clear chat history and memory"
                  className={`p-1 sm:p-1.5 rounded-lg transition-all focus:outline-none cursor-pointer flex items-center gap-1 relative ${
                    clearedNotice
                      ? "text-emerald-400 bg-emerald-500/15"
                      : "text-gray-400 hover:text-rose-400 hover:bg-rose-500/10"
                  }`}
                >
                  <Trash2 size={16} className={clearedNotice ? "text-emerald-400" : "transition-colors"} />
                  {clearedNotice && (
                    <span className="text-[10px] font-medium text-emerald-400 pr-0.5">Cleared</span>
                  )}
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Close chat"
                  aria-label="Close chat"
                  className="p-1 sm:p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none cursor-pointer"
                >
                  <X size={17} className="text-white" />
                </button>
              </div>
            </div>

            {/* Chatbot Iframe Container - Fills the entire popup */}
            <div className="relative flex-1 w-full h-full bg-[#090C12] overflow-hidden">
              <iframe
                ref={iframeRef}
                src="https://brandique-chatbot.vercel.app/?embed=1"
                srcDoc={getEmbedChatbotHtml(isMobile)}
                onLoad={() => {
                  if (iframeRef.current && iframeRef.current.contentWindow) {
                    const mob = typeof window !== 'undefined' ? window.innerWidth < 640 : false;
                    let savedHist = [];
                    let savedMem = {};
                    try {
                      const hRaw = localStorage.getItem(STORAGE_KEY);
                      if (hRaw) savedHist = JSON.parse(hRaw);
                      const mRaw = localStorage.getItem(MEMORY_STORAGE_KEY);
                      if (mRaw) savedMem = JSON.parse(mRaw);
                    } catch (e) {}

                    iframeRef.current.contentWindow.postMessage({
                      type: 'INIT_STORAGE',
                      isMobile: mob,
                      history: savedHist,
                      memory: savedMem
                    }, '*');
                  }
                }}
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
