import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X } from 'lucide-react';

const ChatBotHighlight: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show after 3 seconds of initial load
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    // Hide after 15 seconds
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 15000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ 
            opacity: { duration: 0.4 },
            scale: { type: "spring", stiffness: 300, damping: 25 },
            y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
          className="fixed bottom-[90px] right-4 md:bottom-[105px] md:right-6 z-[9998] flex items-end flex-col gap-2 pointer-events-none origin-bottom-right"
        >
          <div className="bg-[#11141A]/90 backdrop-blur-xl border border-neon-blue/30 p-4 rounded-2xl shadow-[0_10px_30px_rgba(0,212,255,0.2)] relative pointer-events-auto max-w-[280px]">
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple p-0.5 flex-shrink-0 mt-0.5">
                <div className="w-full h-full bg-[#11141A] rounded-full flex items-center justify-center text-white">
                  <Sparkles size={14} className="text-neon-blue" />
                </div>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm mb-1">Meet Darling ✨</h4>
                <p className="text-gray-300 text-xs leading-relaxed">
                  Our new AI Chat Assistant is here! Ask about our services, pricing, or process.
                </p>
              </div>
            </div>
            
            {/* Arrow pointing down to the chat widget */}
            <div className="absolute -bottom-2 right-[20px] md:right-6 w-4 h-4 bg-[#11141A] border-b border-r border-neon-blue/30 transform rotate-45 backdrop-blur-xl"></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatBotHighlight;
