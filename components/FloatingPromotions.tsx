import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Sparkles, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const FloatingPromotions: React.FC = () => {
  const [showDeals, setShowDeals] = useState(false);

  useEffect(() => {
    const dealsClosed = localStorage.getItem('brandique_deals_closed');

    if (!dealsClosed) {
      setTimeout(() => setShowDeals(true), 2000);
    }
  }, []);

  const closeDeals = () => {
    setShowDeals(false);
    localStorage.setItem('brandique_deals_closed', 'true');
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-4 items-end pointer-events-none w-full sm:w-auto px-6 sm:px-0 left-0 sm:left-auto bottom-20 sm:bottom-6">
      <AnimatePresence>
        {showDeals && (
          <motion.div
            key="floating-deals-popup"
            initial={{ opacity: 0, x: 50, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="pointer-events-auto w-full sm:w-80 glass-morphism rounded-2xl p-4 shadow-2xl border border-white/10 relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-purple to-neon-blue"></div>
            
            <button 
              onClick={closeDeals}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-neon-purple/20 flex items-center justify-center text-neon-purple shrink-0">
                <Zap size={20} />
              </div>
              <div className="space-y-1 pr-4">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  🔥 BrandiQue Deals
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Daily updated offers & exclusive discounts from top platforms.
                </p>
                <div className="pt-2">
                  <a 
                    href="https://deals.brandique.in" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-1.5 bg-neon-purple text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:scale-105 transition-transform"
                  >
                    Explore Deals <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingPromotions;
