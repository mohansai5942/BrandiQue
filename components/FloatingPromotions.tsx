import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { useInquiry } from '../context/InquiryContext';

// A single, dismissible nudge towards the free growth audit (BrandiQue's main lead magnet).
const STORAGE_KEY = 'brandique_audit_nudge_closed';

const FloatingPromotions: React.FC = () => {
  const [show, setShow] = useState(false);
  const { openInquiry, isOpen } = useInquiry();
  const { pathname } = useLocation();
  const hiddenOnPage = pathname === '/contact' || pathname === '/admin' || pathname === '/login';

  useEffect(() => {
    let closed = false;
    try { closed = localStorage.getItem(STORAGE_KEY) === 'true'; } catch (_) { closed = false; }
    if (closed) return;
    const timer = window.setTimeout(() => setShow(true), 12000);
    return () => window.clearTimeout(timer);
  }, []);

  const close = () => {
    setShow(false);
    try { localStorage.setItem(STORAGE_KEY, 'true'); } catch (_) { /* storage unavailable */ }
  };

  const startAudit = () => {
    close();
    openInquiry('Free Growth Audit');
  };

  return (
    <div className="fixed bottom-24 right-4 sm:bottom-24 sm:right-6 z-[9990] flex flex-col gap-4 items-end pointer-events-none w-full sm:w-auto px-4 sm:px-0 left-0 sm:left-auto">
      <AnimatePresence>
        {show && !isOpen && !hiddenOnPage && (
          <motion.div
            key="floating-audit-popup"
            initial={{ opacity: 0, x: 50, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="pointer-events-auto w-full sm:w-80 rounded-2xl p-4 shadow-2xl border border-yellow-400/30 bg-[#0D1017] relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400"></div>
            <button type="button" aria-label="Close" onClick={close} className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
              <X size={16} />
            </button>
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-yellow-400/15 flex items-center justify-center text-yellow-300 shrink-0">
                <Sparkles size={20} />
              </div>
              <div className="space-y-1 pr-4">
                <h4 className="font-bold text-sm text-white">Free growth audit</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  We review your website, WhatsApp and social presence and send 3 practical fixes. No cost, no obligation.
                </p>
                <div className="pt-2">
                  <button type="button" onClick={startAudit} className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-400 text-black text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-yellow-300 transition-colors">
                    Get my audit <ArrowRight size={12} />
                  </button>
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
