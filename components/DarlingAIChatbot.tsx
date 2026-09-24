import React, { useState, useEffect } from 'react';
import { X, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
            <div className="relative flex-1 w-full h-full bg-[#0a0a0f] overflow-hidden">
              <iframe
                src="https://brandique-chatbot.vercel.app/?embed=1"
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
