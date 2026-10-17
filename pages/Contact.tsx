import React, { useState } from 'react';
import * as Sentry from '@sentry/react';
import { Mail, Phone, MapPin, CheckCircle, ArrowRight, Sparkles, Globe, Clock, Copy, Check, ExternalLink, Loader2, AlertCircle, LayoutTemplate, Code, PenTool, Megaphone, Bot, MessageCircle, PhoneCall } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { notifyAdmin } from '../notifyAdmin';
import { whatsappLink } from '../data/offers';
import { loadFirestore } from '../firestoreClient';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { cleanText, isValidEmail, LIMITS, SUBMIT_TIMEOUT_MS, telHref, withTimeout } from '../utils/security';

const Contact: React.FC = () => {
  const { settings, getRawPhone } = useSiteSettings();
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', budget: '', message: '' });
  const [selectedService, setSelectedService] = useState('Web Development');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState(''); // hidden from people; bots fill it

  const services = [
    { id: 'Web Development', icon: Code },
    { id: 'AI Agents & Automations', icon: Bot },
    { id: 'Graphic Design', icon: PenTool },
    { id: 'Voice Calling AI Agents', icon: PhoneCall },
  ];

  const budgets = [
    '< ₹10k', '₹10k - ₹50k', '₹50k - ₹1L', '₹1L+'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formStatus === 'submitting') return;
    setFormError(null);

    const name = cleanText(formData.name, LIMITS.name);
    const email = cleanText(formData.email, LIMITS.email);
    const message = cleanText(formData.message, LIMITS.message, { multiline: true });
    const budget = budgets.includes(formData.budget) ? formData.budget : '';
    const service = services.some((s) => s.id === selectedService) ? selectedService : 'Web Development';

    if (!name) {
      setFormError('Please enter your name.');
      return;
    }
    if (!isValidEmail(email)) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (message.length < 5) {
      setFormError('Please add a few details about your project.');
      return;
    }

    const finish = () => {
      setFormStatus('success');
      setFormData({ name: '', email: '', budget: '', message: '' });
      setSelectedService('Web Development');
      setHoneypot('');
      setTimeout(() => setFormStatus('idle'), 8000);
    };

    // Bots fill the hidden field: show success without sending anything.
    if (honeypot) {
      finish();
      return;
    }

    setFormStatus('submitting');
    const payload = { service, name, email, budget, message };

    // Saved to Firestore (shown in the BrandiQue Data Console, with a push alert to the admin).
    try {
      const docRef = await withTimeout(loadFirestore().then(({ db, addDoc, collection }) => addDoc(collection(db, 'messages'), {
        source: 'contact',
        ...payload,
        createdAt: new Date().toISOString()
      })), SUBMIT_TIMEOUT_MS);
      if (docRef && docRef.id) notifyAdmin('messages', docRef.id);
      finish();
    } catch (err) {
      Sentry.captureException(err);
      setFormStatus('idle');
      setFormError('Sorry, your request could not be sent. Please check your connection and try again, or email or WhatsApp us directly.');
    }
  };

  const copyToClipboard = (text: string, field: string) => {
      navigator.clipboard?.writeText(text).catch((err) => { Sentry.captureException(err); });
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="min-h-screen pt-[6.75rem] md:pt-36 desk:pt-40 pb-12 md:pb-20 px-5 md:px-8 desk:px-12 2xl:px-16 max-w-[100rem] mx-auto w-full relative overflow-hidden transition-colors duration-300">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-gray-50 dark:bg-[#05070A] transition-colors duration-300">
         <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-neon-purple/20 dark:bg-neon-purple/5 rounded-full blur-[120px] animate-pulse-glow"></div>
         <div className="absolute bottom-[20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 dark:bg-blue-600/5 rounded-full blur-[100px]"></div>
         <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-soft-light"></div>
      </div>

      <div className="grid desk:grid-cols-12 gap-6 md:gap-12 desk:gap-20 items-start">
        
        {/* Left Column: Contact Info */}
        <div id="contact-info" className="desk:col-span-5 relative z-10 flex flex-col justify-center h-full">
           <ScrollReveal>
               <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-yellow-700 dark:text-yellow-300 md:text-[11px]">
                   <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" /></span>
                   Contact · Replies within one working day
               </span>

               <h1 className="text-[2.4rem] sm:text-5xl desk:text-[4rem] font-bold mb-6 text-gray-900 dark:text-white leading-[1.06] tracking-tight">
                 Let&rsquo;s grow your <span className="bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">business together.</span>
               </h1>
               
               <p className="text-gray-600 dark:text-gray-400 mb-7 md:mb-10 text-base md:text-lg leading-relaxed max-w-md font-light">
                 Need a website, an AI agent or design work? Share a few details and we’ll reply with a clear recommendation and a fixed written quote. No obligation.
               </p>
           </ScrollReveal>

           <ScrollReveal delay="delay-100" className="space-y-4 mb-7 md:mb-10">
              {/* Contact Cards */}
              <div className="group relative bg-white dark:bg-[#0F1320] border border-gray-200 dark:border-white/5 hover:border-neon-purple/30 rounded-2xl p-5 transition-all duration-300 hover:shadow-[0_0_30px_rgba(234,179,8,0.1)] hover:-translate-y-1">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center text-neon-purple group-hover:scale-110 transition-transform">
                            <Mail size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">Email Us</p>
                            <a href={`mailto:${settings.email}`} className="text-gray-900 dark:text-white font-medium hover:text-neon-purple transition-colors break-all">{settings.email}</a>
                        </div>
                    </div>
                    <button type="button" aria-label="Copy email address" onClick={() => copyToClipboard(settings.email, 'email')} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 hover:text-black dark:hover:text-white transition-colors shrink-0">
                        {copiedField === 'email' ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                    </button>
                 </div>
              </div>

              <div className="group relative bg-white dark:bg-[#0F1320] border border-gray-200 dark:border-white/5 hover:border-blue-500/30 rounded-2xl p-5 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] hover:-translate-y-1">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform">
                            <Phone size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">Call Us</p>
                            <a href={telHref(getRawPhone())} className="text-gray-900 dark:text-white font-medium hover:text-blue-500 dark:hover:text-blue-400 transition-colors">{settings.phone}</a>
                        </div>
                    </div>
                    <button type="button" aria-label="Copy phone number" onClick={() => copyToClipboard(settings.phone, 'phone')} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 hover:text-black dark:hover:text-white transition-colors shrink-0">
                        {copiedField === 'phone' ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                    </button>
                 </div>
              </div>

              <div className="group relative bg-white dark:bg-[#0F1320] border border-gray-200 dark:border-white/5 hover:border-green-500/30 rounded-2xl p-5 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,197,94,0.1)] hover:-translate-y-1">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 dark:text-green-400 group-hover:scale-110 transition-transform">
                            <MapPin size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">Visit HQ</p>
                            <p className="text-gray-900 dark:text-white font-medium">{settings.location}</p>
                        </div>
                    </div>
                    <a href={`https://maps.google.com/?q=${encodeURIComponent(settings.location)}`} target="_blank" rel="noopener noreferrer" aria-label="Open location in Google Maps" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 hover:text-black dark:hover:text-white transition-colors shrink-0">
                        <ExternalLink size={18} />
                    </a>
                 </div>
              </div>
           </ScrollReveal>

           <ScrollReveal delay="delay-200">
               <div className="flex items-center gap-3 md:gap-6 pt-6 border-t border-gray-200 dark:border-white/5">
                   <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 group">
                       <Globe size={16} className="text-blue-500 dark:text-blue-400 group-hover:rotate-180 transition-transform duration-700" />
                       <span>Global Reach</span>
                   </div>
                   <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-white/10"></div>
                   <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 group">
                       <Clock size={16} className="text-neon-purple group-hover:rotate-12 transition-transform" />
                       <span>Replies during working hours</span>
                   </div>
               </div>
           </ScrollReveal>
        </div>

        {/* Right Column: FORM UI */}
        <div className="desk:col-span-7 relative">
           <ScrollReveal delay="delay-200" className="h-full">
               <div className="relative bg-white dark:bg-[#0A0C11] border border-gray-200 dark:border-white/10 rounded-3xl p-4 md:p-8 desk:p-10 shadow-2xl overflow-hidden group hover:border-gray-300 dark:hover:border-white/20 transition-colors">
                    {/* Ambient Glows */}
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-neon-purple/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-neon-purple/10 transition-colors"></div>
                    <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-blue-500/5 rounded-full blur-[60px] pointer-events-none group-hover:bg-blue-500/10 transition-colors"></div>

                    {formStatus === 'success' ? (
                        <div className="flex flex-col items-center justify-center text-center py-12 md:py-20 min-h-[500px]">
                            <div className="relative mb-8">
                                <div className="absolute inset-0 bg-green-500 blur-3xl opacity-20 animate-pulse"></div>
                                <div className="relative w-24 h-24 bg-white dark:bg-[#0A0C11] border border-green-500/30 rounded-full flex items-center justify-center text-green-500 shadow-2xl">
                                    <CheckCircle size={48} className="animate-bounce-custom" />
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Request Sent Successfully!</h3>
                            <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto mb-7 text-sm leading-relaxed">
                                Your request has been recorded. We’ll review the details and follow up using the contact information you provided.
                            </p>
                            <a
                                href={whatsappLink(settings.whatsapp, 'Hi BrandiQue, I just sent a request on your contact page.')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mb-3 inline-flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-5 py-3 text-sm font-bold text-green-600 transition-colors hover:bg-green-500/20 dark:text-green-400"
                            >
                                <MessageCircle size={16} /> Chat instantly on WhatsApp
                            </a>
                            <p className="mb-7 text-[11px] text-gray-400">Fastest reply — usually within minutes in working hours.</p>
                            <button 
                                onClick={() => setFormStatus('idle')}
                                className="px-5 md:px-8 py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold text-sm transition-all hover:scale-105 flex items-center gap-2"
                            >
                                Send Another Request <ArrowRight size={16} />
                            </button>
                        </div>
                    ) : (
                        <form id="contact-form" onSubmit={handleSubmit} className="space-y-8 relative z-10" noValidate>
                            <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }}>
                                <label>
                                    Company website
                                    <input type="text" name="company_website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
                                </label>
                            </div>
                            
                            {/* 1. Service Selection */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">What do you need help with?</label>
                                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                    {services.map((s) => (
                                        <button
                                            key={s.id}
                                            type="button"
                                            onClick={() => setSelectedService(s.id)}
                                            className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all duration-300 ${
                                                selectedService === s.id 
                                                ? 'bg-neon-purple/10 border-neon-purple text-neon-purple shadow-[0_0_15px_rgba(234,179,8,0.2)]' 
                                                : 'bg-gray-50 dark:bg-[#151A25]/50 border-gray-200 dark:border-white/5 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 hover:border-gray-300 dark:hover:border-white/10'
                                            }`}
                                        >
                                            <s.icon size={20} className={selectedService === s.id ? 'text-neon-purple' : 'text-gray-400'} />
                                            <span className="text-[10px] md:text-xs font-bold text-center">{s.id}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 2. Personal Info */}
                            <div className="grid md:grid-cols-2 gap-3 md:gap-6">
                                <div className="space-y-2 group">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 group-focus-within:text-black dark:group-focus-within:text-white transition-colors">Your Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.name}
                                        maxLength={LIMITS.name}
                                        autoComplete="name"
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full bg-gray-50 dark:bg-[#151A25]/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-neon-purple focus:bg-white dark:focus:bg-[#151A25] transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-2 group">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 group-focus-within:text-black dark:group-focus-within:text-white transition-colors">Email Address</label>
                                    <input 
                                        type="email" 
                                        required
                                        value={formData.email}
                                        maxLength={LIMITS.email}
                                        autoComplete="email"
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="w-full bg-gray-50 dark:bg-[#151A25]/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-neon-purple focus:bg-white dark:focus:bg-[#151A25] transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            {/* 3. Budget Selection */}
                            <div className="space-y-2 group">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 group-focus-within:text-black dark:group-focus-within:text-white transition-colors">Approximate Budget (optional)</label>
                                <select 
                                    value={formData.budget}
                                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                                    className="w-full bg-gray-50 dark:bg-[#151A25]/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-neon-purple focus:bg-white dark:focus:bg-[#151A25] transition-all appearance-none cursor-pointer"
                                >
                                    <option value="" className="text-gray-400">I’m not sure yet</option>
                                    {budgets.map(b => (
                                        <option key={b} value={b} className="bg-white dark:bg-[#0A0C11]">{b}</option>
                                    ))}
                                </select>
                            </div>

                            {/* 4. Project Details */}
                            <div className="space-y-2 group">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 group-focus-within:text-black dark:group-focus-within:text-white transition-colors">Project Details</label>
                                <textarea 
                                    rows={4}
                                    required
                                    value={formData.message}
                                    maxLength={LIMITS.message}
                                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                                    className="w-full bg-gray-50 dark:bg-[#151A25]/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-neon-purple focus:bg-white dark:focus:bg-[#151A25] transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 resize-none"
                                    placeholder="Tell us about your project goals, timeline, and requirements..."
                                />
                            </div>

                            {formError && (
                                <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400">
                                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                                    <span>{formError}</span>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button 
                                type="submit" 
                                disabled={formStatus === 'submitting'}
                                className="w-full py-4 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl text-sm md:text-base hover:bg-gray-800 dark:hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group relative overflow-hidden"
                            >
                                {formStatus === 'submitting' ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" /> Sending Request...
                                    </>
                                ) : (
                                    <>
                                        <span className="relative z-10">Send Request</span>
                                        <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700/50 dark:via-gray-100/50 to-transparent skew-x-12 -translate-x-full group-hover:animate-shine"></div>
                                    </>
                                )}
                            </button>
                            
                            <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500">
                                <Sparkles size={10} className="text-neon-purple" />
                                <span>Share only what you know so far. Budget can be decided later.</span>
                            </div>

                        </form>
                    )}
               </div>
           </ScrollReveal>
        </div>

      </div>
    </div>
  );
};

export default Contact;