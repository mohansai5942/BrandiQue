import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { X, Check, MessageCircle } from 'lucide-react';
import { whatsappLink } from '../data/offers';
import { useSiteSettings } from './SiteSettingsContext';
import { motion, AnimatePresence } from 'motion/react';
import LeadForm, { LeadContext, contextRows } from '../components/LeadForm';

export type { LeadContext } from '../components/LeadForm';

interface InquiryContextType {
  /**
   * Opens the single-step enquiry form. `pkg` is a short plan/package name (kept for older callers);
   * `ctx` carries everything else the button knows (price, minutes, billing type, setup fee, source).
   */
  openInquiry: (service: string, pkg?: string, ctx?: LeadContext) => void;
  closeInquiry: () => void;
  isOpen: boolean;
  serviceName: string;
  packageName: string;
}

const InquiryContext = createContext<InquiryContextType | undefined>(undefined);

export const useInquiry = () => {
  const context = useContext(InquiryContext);
  if (!context) {
    throw new Error('useInquiry must be used within an InquiryProvider');
  }
  return context;
};

export const InquiryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useSiteSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [serviceName, setServiceName] = useState('');
  const [packageName, setPackageName] = useState('');
  const [leadContext, setLeadContext] = useState<LeadContext>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [formKey, setFormKey] = useState(0);

  // Stable callbacks: the context value only changes when isOpen/serviceName/packageName do.
  const openInquiry = useCallback((service: string, pkg: string = '', ctx: LeadContext = {}) => {
    setServiceName(service);
    setPackageName(pkg);
    setLeadContext({ ...ctx, plan: ctx.plan ?? (pkg || undefined) });
    setIsSuccess(false);
    setFormKey(k => k + 1); // fresh, empty form every time
    setIsOpen(true);
  }, []);

  const closeInquiry = useCallback(() => setIsOpen(false), []);

  // Escape closes the dialog; body scroll is locked while it is open.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [isOpen]);

  const contextValue = useMemo(
    () => ({ openInquiry, closeInquiry, isOpen, serviceName, packageName }),
    [openInquiry, closeInquiry, isOpen, serviceName, packageName]
  );

  const waText = `Hi BrandiQue, I just sent an enquiry for ${serviceName}${leadContext.plan ? ` (${leadContext.plan})` : ''} on your website.${
    contextRows(leadContext).filter(r => r.key !== 'plan').map(r => `\n${r.label}: ${r.value}`).join('')}`;

  return (
    <InquiryContext.Provider value={contextValue}>
      {children}

      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 z-[200] flex items-end justify-center bg-black/70 backdrop-blur-md sm:items-center sm:p-4"
            onMouseDown={e => { if (e.target === e.currentTarget) closeInquiry(); }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="inquiry-title"
              data-inquiry-modal
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative flex max-h-[94vh] w-full flex-col overflow-hidden rounded-t-[28px] border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#0D1017] sm:max-w-2xl sm:rounded-[28px]"
            >
              <div className="h-1.5 w-full shrink-0 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500" />
              <div className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-gray-300 dark:bg-white/15 sm:hidden" aria-hidden="true" />
              <div className="flex shrink-0 items-start justify-between gap-4 px-5 pb-2 pt-4 sm:px-8 sm:pt-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-700 dark:text-yellow-300">BrandiQue · Quick enquiry</p>
                  <h3 id="inquiry-title" className="mt-1 text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
                    {isSuccess ? 'Request received' : 'Get started in under a minute'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={closeInquiry}
                  aria-label="Close"
                  className="rounded-full bg-black/5 p-2 text-gray-500 transition-colors hover:bg-black/10 hover:text-black focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400/40 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="custom-scrollbar flex-1 overflow-y-auto px-5 pb-6 pt-3 sm:px-8 sm:pb-8">
                {isSuccess ? (
                  <div className="flex flex-col items-center py-6 text-center">
                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-green-500/20 bg-green-500/10 text-green-500">
                      <Check size={32} strokeWidth={3} />
                    </div>
                    <p className="mb-6 max-w-sm text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                      Thanks! We have your enquiry for <strong className="text-gray-900 dark:text-white">{serviceName}{leadContext.plan ? ` · ${leadContext.plan}` : ''}</strong>. Our team will reach you shortly.
                    </p>
                    <a
                      href={whatsappLink(settings.whatsapp, waText)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mb-3 inline-flex items-center gap-2 rounded-2xl border border-green-500/30 bg-green-500/10 px-5 py-3 text-sm font-bold text-green-700 transition-colors hover:bg-green-500/20 dark:text-green-400"
                    >
                      <MessageCircle size={16} /> Chat instantly on WhatsApp
                    </a>
                    <p className="mb-6 text-[11px] text-gray-400">Fastest reply — usually within minutes in working hours.</p>
                    <button type="button" onClick={closeInquiry} className="rounded-2xl bg-gray-900 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-yellow-400 hover:text-black dark:bg-white dark:text-black dark:hover:bg-yellow-400">
                      Done
                    </button>
                  </div>
                ) : (
                  <LeadForm
                    key={formKey}
                    formSource="service"
                    service={serviceName}
                    context={leadContext}
                    idPrefix="inquiry"
                    onSuccess={() => setIsSuccess(true)}
                  />
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </InquiryContext.Provider>
  );
};
