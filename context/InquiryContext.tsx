import React, { createContext, useContext, useState } from 'react';
import { X, Check, ArrowRight, ArrowLeft, Loader2, Phone, Mail, User, ShieldCheck, HelpCircle } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { motion, AnimatePresence } from 'motion/react';

interface InquiryContextType {
  openInquiry: (service: string, pkg?: string) => void;
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
  const [isOpen, setIsOpen] = useState(false);
  const [serviceName, setServiceName] = useState('');
  const [packageName, setPackageName] = useState('');
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Common fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [additionalMessage, setAdditionalMessage] = useState('');
  const [budget, setBudget] = useState('₹15,000 to ₹30,000');
  const [timeline, setTimeline] = useState('1-2 Months');

  // Service-specific answers
  const [customAnswers, setCustomAnswers] = useState<Record<string, string>>({});

  const openInquiry = (service: string, pkg: string = '') => {
    setServiceName(service);
    setPackageName(pkg);
    setStep(1);
    setIsSuccess(false);
    setIsSubmitting(false);
    // Reset fields
    setName('');
    setEmail('');
    setPhone('');
    setAdditionalMessage('');
    setCustomAnswers({});
    
    // Set default package pricing/budget if provided
    if (pkg) {
      if (service.toLowerCase().includes('wordpress')) {
        if (pkg.toLowerCase().includes('personal')) setBudget('₹9,000 to ₹15,000');
        else if (pkg.toLowerCase().includes('portfolio')) setBudget('₹10,000 to ₹17,000');
        else if (pkg.toLowerCase().includes('business')) setBudget('₹15,000 to ₹25,000');
        else if (pkg.toLowerCase().includes('ecommerce')) setBudget('₹25,000 to ₹50,000');
      } else if (service.toLowerCase().includes('branding')) {
        if (pkg.toLowerCase().includes('starter')) setBudget('₹10,000 to ₹15,000');
        else if (pkg.toLowerCase().includes('growth')) setBudget('₹20,000 to ₹30,000');
        else if (pkg.toLowerCase().includes('premium')) setBudget('₹40,000 to ₹70,000');
      }
    } else {
      setBudget('₹20,000 to ₹50,000');
    }
    
    setIsOpen(true);
  };

  const closeInquiry = () => {
    setIsOpen(false);
  };

  const handleCustomAnswerChange = (question: string, value: string) => {
    setCustomAnswers(prev => ({ ...prev, [question]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Build clean service title
      const fullServiceTitle = packageName ? `${serviceName} (${packageName})` : serviceName;

      // Map answers to a readable message block
      let formattedMsg = additionalMessage.trim();
      const detailsList: string[] = [];
      Object.entries(customAnswers).forEach(([q, a]) => {
        detailsList.push(`${q}: ${a}`);
      });
      
      const promptDetails = detailsList.join('\n');
      const finalMessage = `Phone: ${phone}\nTimeline: ${timeline}\nService Specifics:\n${promptDetails || 'None provided'}\n\nAdditional Details:\n${formattedMsg || 'None'}`;

      const createdAtISO = new Date().toISOString();
      let createdDocId = 'msg-' + Date.now();

      try {
        const docRef = await addDoc(collection(db, 'messages'), {
          source: 'service',
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          service: fullServiceTitle,
          budget: budget,
          message: finalMessage,
          serviceDetails: {
            ...customAnswers,
            timeline,
            phone
          },
          createdAt: createdAtISO
        });
        if (docRef && docRef.id) {
          createdDocId = docRef.id;
        }
      } catch (fbErr) {
        console.error("Firestore error in InquiryContext:", fbErr);
      }

      const newMsg = {
        id: createdDocId,
        source: 'service' as const,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        service: fullServiceTitle,
        budget: budget,
        message: finalMessage,
        serviceDetails: {
          ...customAnswers,
          timeline,
          phone
        },
        createdAt: createdAtISO
      };

      try {
        const existingRaw = localStorage.getItem('brandique_messages');
        const existing = existingRaw ? JSON.parse(existingRaw) : [];
        const updated = Array.isArray(existing) ? [newMsg, ...existing] : [newMsg];
        localStorage.setItem('brandique_messages', JSON.stringify(updated));
      } catch (lsError) {
        console.error("localStorage save error in InquiryContext:", lsError);
      }

      setIsSuccess(true);
      setStep(4);
    } catch (error) {
      console.error('Error submitting service inquiry to Firestore: ', error);
      alert('Something went wrong. Please check your internet connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Define service-specific fields/questions
  const renderServiceSpecificFields = () => {
    const sNameLower = serviceName.toLowerCase();

    if (sNameLower.includes('growth audit') || sNameLower.includes('growth plan')) {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Type of Business</label>
            <div className="grid grid-cols-2 gap-2">
              {['Coaching / School', 'Clinic / Healthcare', 'Shop / Restaurant', 'Services / Other'].map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => handleCustomAnswerChange('Business Type', type)}
                  className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                    customAnswers['Business Type'] === type
                      ? 'bg-blue-500/10 border-blue-500 text-blue-500 dark:text-blue-400'
                      : 'bg-gray-50 dark:bg-[#05070A] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Biggest Goal Right Now</label>
            <div className="grid grid-cols-2 gap-2">
              {['More enquiries', 'Faster replies on WhatsApp', 'Less manual work', 'Better brand look'].map((goal) => (
                <button
                  type="button"
                  key={goal}
                  onClick={() => handleCustomAnswerChange('Main Goal', goal)}
                  className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                    customAnswers['Main Goal'] === goal
                      ? 'bg-blue-500/10 border-blue-500 text-blue-500 dark:text-blue-400'
                      : 'bg-gray-50 dark:bg-[#05070A] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Website or Instagram Link (optional)</label>
            <input
              type="text"
              maxLength={200}
              placeholder="e.g., yourbusiness.com or @yourbusiness"
              value={customAnswers['Current Link'] || ''}
              onChange={(e) => handleCustomAnswerChange('Current Link', e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>
        </div>
      );
    }

    if (sNameLower.includes('wordpress')) {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Website Type</label>
            <div className="grid grid-cols-2 gap-2">
              {['Business Website', 'E-Commerce Store', 'Portfolio/Personal', 'Blog / Magazine'].map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => handleCustomAnswerChange('Website Type', type)}
                  className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                    customAnswers['Website Type'] === type
                      ? 'bg-blue-500/10 border-blue-500 text-blue-500 dark:text-blue-400'
                      : 'bg-gray-50 dark:bg-[#05070A] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-white/20'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Need Domain & Hosting?</label>
            <div className="flex gap-3">
              {['Yes, help me set up', 'No, I have my own'].map((option) => (
                <button
                  type="button"
                  key={option}
                  onClick={() => handleCustomAnswerChange('Hosting Assistance', option)}
                  className={`flex-1 p-3 rounded-xl border text-xs font-semibold transition-all ${
                    customAnswers['Hosting Assistance'] === option
                      ? 'bg-blue-500/10 border-blue-500 text-blue-500 dark:text-blue-400'
                      : 'bg-gray-50 dark:bg-[#05070A] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (sNameLower.includes('full-stack') || sNameLower.includes('web development') || sNameLower.includes('software')) {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Platform Required</label>
            <div className="grid grid-cols-2 gap-2">
              {['Custom Web App (React/Next)', 'Mobile App (Android/iOS)', 'Full SaaS Platform', 'API & Integration'].map((plat) => (
                <button
                  type="button"
                  key={plat}
                  onClick={() => handleCustomAnswerChange('Platform', plat)}
                  className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                    customAnswers['Platform'] === plat
                      ? 'bg-blue-500/10 border-blue-500 text-blue-500 dark:text-blue-400'
                      : 'bg-gray-50 dark:bg-[#05070A] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-white/20'
                  }`}
                >
                  {plat}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Primary Development Goal</label>
            <input
              type="text"
              placeholder="e.g., Build a fast rental dashboard"
              value={customAnswers['Primary Goal'] || ''}
              onChange={(e) => handleCustomAnswerChange('Primary Goal', e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>
        </div>
      );
    }

    if (sNameLower.includes('branding') || sNameLower.includes('design')) {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Design Deliverables</label>
            <div className="grid grid-cols-2 gap-2">
              {['Logo & Brand Guidelines', 'Social Media Templates', 'Stationery / Business Cards', 'Complete Custom Package'].map((deliv) => (
                <button
                  type="button"
                  key={deliv}
                  onClick={() => handleCustomAnswerChange('Deliverables', deliv)}
                  className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                    customAnswers['Deliverables'] === deliv
                      ? 'bg-blue-500/10 border-blue-500 text-blue-500 dark:text-blue-400'
                      : 'bg-gray-50 dark:bg-[#05070A] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  {deliv}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Brand Vibe / Style</label>
            <input
              type="text"
              placeholder="e.g., Minimalist, modern, playful, professional"
              value={customAnswers['Brand Style'] || ''}
              onChange={(e) => handleCustomAnswerChange('Brand Style', e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>
        </div>
      );
    }

    if (sNameLower.includes('marketing') || sNameLower.includes('seo') || sNameLower.includes('digital')) {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Primary Marketing Target</label>
            <div className="grid grid-cols-2 gap-2">
              {['Lead Generation', 'E-Commerce Sales Boost', 'Social Media Presence', 'Google Search (SEO)'].map((tgt) => (
                <button
                  type="button"
                  key={tgt}
                  onClick={() => handleCustomAnswerChange('Target', tgt)}
                  className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                    customAnswers['Target'] === tgt
                      ? 'bg-blue-500/10 border-blue-500 text-blue-500 dark:text-blue-400'
                      : 'bg-gray-50 dark:bg-[#05070A] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  {tgt}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Target Audience Niche</label>
            <input
              type="text"
              placeholder="e.g., Young adults, local homeowners, developers"
              value={customAnswers['Target Niche'] || ''}
              onChange={(e) => handleCustomAnswerChange('Target Niche', e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>
        </div>
      );
    }

    if (sNameLower.includes('ai') || sNameLower.includes('automation') || sNameLower.includes('agent')) {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Automation Focus</label>
            <div className="grid grid-cols-2 gap-2">
              {['Custom AI Agents/Bots', 'n8n Workflow Automation', 'Lead Qualification Pipeline', 'Data Sync & Webhooks'].map((foc) => (
                <button
                  type="button"
                  key={foc}
                  onClick={() => handleCustomAnswerChange('AI Focus', foc)}
                  className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                    customAnswers['AI Focus'] === foc
                      ? 'bg-blue-500/10 border-blue-500 text-blue-500 dark:text-blue-400'
                      : 'bg-gray-50 dark:bg-[#05070A] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  {foc}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Preferred Integrations</label>
            <input
              type="text"
              placeholder="e.g., WhatsApp, Discord, Google Sheets, CRM"
              value={customAnswers['AI Integrations'] || ''}
              onChange={(e) => handleCustomAnswerChange('AI Integrations', e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>
        </div>
      );
    }

    // Default fallback simple questions
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Project Classification</label>
          <input
            type="text"
            placeholder="e.g., Web redesign, mobile prototype"
            value={customAnswers['Project Classification'] || ''}
            onChange={(e) => handleCustomAnswerChange('Project Classification', e.target.value)}
            className="w-full bg-gray-50 dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>
      </div>
    );
  };

  return (
    <InquiryContext.Provider value={{ openInquiry, closeInquiry, isOpen, serviceName, packageName }}>
      {children}

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="bg-white dark:bg-[#0F1320] w-full max-w-xl rounded-[28px] border border-gray-200 dark:border-white/10 shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh]"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-[#0A0C11]/50 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-extrabold uppercase bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full tracking-wider">
                      Project Request
                    </span>
                    {packageName && (
                      <span className="text-[10px] font-extrabold uppercase bg-neon-purple/10 text-neon-purple px-2 py-0.5 rounded-full tracking-wider">
                        {packageName}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                    {serviceName} Inquiry
                  </h3>
                </div>
                <button
                  onClick={closeInquiry}
                  className="p-1.5 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Progress Bar (Only steps 1-3) */}
              {step <= 3 && (
                <div className="h-1 w-full bg-gray-100 dark:bg-white/5">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${(step / 3) * 100}%` }}
                  ></div>
                </div>
              )}

              {/* Scrollable Form Content */}
              <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                {step === 1 && (
                  <div className="space-y-4 animate-fade-in">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
                      Let's start with your contact information:
                    </h4>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
                        <input
                          type="text"
                          required
                          placeholder="Your full name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-gray-50 dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
                        <input
                          type="email"
                          required
                          placeholder="name@company.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-gray-50 dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
                        <input
                          type="tel"
                          required
                          placeholder="e.g., +91 98765 43210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-gray-50 dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4 animate-fade-in">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
                      Tell us about your project specifics:
                    </h4>
                    {renderServiceSpecificFields()}
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-5 animate-fade-in">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
                      Budget, Timeline & Extra details:
                    </h4>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Estimated Budget Range</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['₹10,000 - ₹20,000', '₹20,000 - ₹40,000', '₹40,000 - ₹80,000', '₹80,000+ / Custom'].map((val) => (
                          <button
                            type="button"
                            key={val}
                            onClick={() => setBudget(val)}
                            className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                              budget === val
                                ? 'bg-blue-500/10 border-blue-500 text-blue-500 dark:text-blue-400'
                                : 'bg-gray-50 dark:bg-[#05070A] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                            }`}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Timeline</label>
                      <div className="flex gap-2">
                        {['< 1 Month', '1-2 Months', '3+ Months'].map((val) => (
                          <button
                            type="button"
                            key={val}
                            onClick={() => setTimeline(val)}
                            className={`flex-1 p-3 rounded-xl border text-xs font-semibold transition-all ${
                              timeline === val
                                ? 'bg-blue-500/10 border-blue-500 text-blue-500'
                                : 'bg-gray-50 dark:bg-[#05070A] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                            }`}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Additional Requirements or Comments</label>
                      <textarea
                        rows={3}
                        placeholder="Tell us any special features or details you'd like to include..."
                        value={additionalMessage}
                        onChange={(e) => setAdditionalMessage(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all resize-none"
                      />
                    </div>
                  </div>
                )}

                {step === 4 && isSuccess && (
                  <div className="py-8 flex flex-col items-center text-center animate-scale-in">
                    <div className="w-16 h-16 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full flex items-center justify-center mb-6">
                      <Check size={32} strokeWidth={3} />
                    </div>
                    <h4 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3">
                      Thanks for submitting!
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6 leading-relaxed">
                      We have received your service inquiry. Our team will review the details and reach you shortly to discuss.
                    </p>
                    <button
                      onClick={closeInquiry}
                      className="px-6 py-2.5 bg-blue-500 text-white font-bold text-sm rounded-xl hover:bg-black transition-colors shadow-lg shadow-blue-500/15"
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>

              {/* Footer Actions (Only steps 1-3) */}
              {step <= 3 && (
                <div className="p-5 border-t border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-[#0A0C11]/50 flex justify-between items-center">
                  <div>
                    {step > 1 ? (
                      <button
                        type="button"
                        onClick={() => setStep(step - 1)}
                        className="px-4 py-2.5 rounded-xl bg-white dark:bg-[#05070A] border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-700 dark:text-gray-300 hover:border-gray-300 hover:text-black dark:hover:text-white transition-all flex items-center gap-1.5"
                      >
                        <ArrowLeft size={14} /> Back
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                        <ShieldCheck size={12} /> Secure & Private
                      </span>
                    )}
                  </div>

                  <div>
                    {step < 3 ? (
                      <button
                        type="button"
                        disabled={step === 1 && (!name || !email || !phone)}
                        onClick={() => setStep(step + 1)}
                        className={`px-5 py-2.5 rounded-xl bg-blue-500 text-white font-bold text-xs hover:bg-black transition-all flex items-center gap-1.5 shadow-lg shadow-blue-500/10 ${
                          step === 1 && (!name || !email || !phone) ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        Next <ArrowRight size={14} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-6 py-2.5 rounded-xl bg-blue-500 text-white font-bold text-xs hover:bg-black transition-all flex items-center gap-1.5 shadow-lg shadow-blue-500/20"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="animate-spin" size={14} /> Submitting...
                          </>
                        ) : (
                          <>
                            Submit Inquiry <Check size={14} />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </InquiryContext.Provider>
  );
};
