import React, { useState } from 'react';
import { AlertCircle, ArrowRight, Building2, Loader2, Lock, Mail, MessageSquare, Phone, User } from 'lucide-react';
import { notifyAdmin } from '../notifyAdmin';
import { loadFirestore } from '../firestoreClient';
import { cleanText, isValidEmail, isValidPhone, LIMITS, SUBMIT_TIMEOUT_MS, withTimeout } from '../utils/security';

/**
 * Context a CTA button passes to the enquiry form. Every value is shown read-only at the top of the
 * form and saved with the lead (in `serviceDetails`, which the Firestore rules already allow), so the
 * visitor only types their contact details.
 */
export interface LeadContext {
  /** Plan or package name, e.g. "Voice Pro". */
  plan?: string;
  /** Display price, e.g. "₹6,999/month" or "₹15,000 one-time". */
  price?: string;
  /** Included minutes on a monthly voice plan, e.g. "1,000 mins/month". */
  minutes?: string;
  /** "Monthly subscription", "Pay as you go", "One-time project", "Free" ... */
  billingType?: string;
  /** Pay-as-you-go top-up minutes and amount. */
  paygMinutes?: string;
  paygAmount?: string;
  /** Per-minute or similar rate. */
  rate?: string;
  /** One-time setup fee, e.g. "₹1,999". */
  setupFee?: string;
  /** Tax note, e.g. "All-inclusive". */
  tax?: string;
  /** Where on the page the button sits, e.g. "Voice pricing · Monthly plans". */
  source?: string;
  /** Extra labelled facts (industry, monthly plan, ...). */
  extra?: Record<string, string>;
  /** Optional wording tweaks for this form. */
  businessLabel?: string;
  messageLabel?: string;
  messagePlaceholder?: string;
  submitLabel?: string;
}

const CONTEXT_LABELS: [keyof LeadContext, string][] = [
  ['plan', 'Plan'],
  ['price', 'Price'],
  ['minutes', 'Included minutes'],
  ['billingType', 'Billing'],
  ['paygMinutes', 'Top-up minutes'],
  ['paygAmount', 'Top-up amount'],
  ['rate', 'Rate'],
  ['setupFee', 'One-time setup'],
  ['tax', 'Tax'],
];

/** Label/value rows for the summary box, in display order. */
export function contextRows(ctx: LeadContext): { key: string; label: string; value: string }[] {
  const rows: { key: string; label: string; value: string }[] = [];
  CONTEXT_LABELS.forEach(([key, label]) => {
    const v = ctx[key];
    if (typeof v === 'string' && v.trim()) rows.push({ key, label, value: v });
  });
  Object.entries(ctx.extra ?? {}).forEach(([label, value]) => {
    if (value && value.trim()) rows.push({ key: label, label, value });
  });
  return rows;
}

const currentPage = () => (typeof window !== 'undefined' ? window.location.pathname + window.location.hash : '');

interface SubmitArgs {
  formSource: 'service' | 'contact';
  service: string;
  context: LeadContext;
  name: string;
  phone: string;
  email: string;
  businessName: string;
  message: string;
}

/** Validates the four typed fields. Returns an error message, or null when everything is fine. */
export function validateLead(name: string, phone: string, email: string): string | null {
  if (!cleanText(name, LIMITS.name)) return 'Please enter your name.';
  if (!isValidPhone(cleanText(phone, LIMITS.phone))) return 'Please enter a valid phone / WhatsApp number (7 to 15 digits).';
  if (!isValidEmail(cleanText(email, LIMITS.email))) return 'Please enter a valid email address.';
  return null;
}

/** Saves the lead to Firestore (messages collection) and pings the admin. Throws on failure. */
export async function submitLead(a: SubmitArgs): Promise<void> {
  const name = cleanText(a.name, LIMITS.name);
  const email = cleanText(a.email, LIMITS.email).toLowerCase();
  const phone = cleanText(a.phone, LIMITS.phone);
  const businessName = cleanText(a.businessName, LIMITS.short);
  const note = cleanText(a.message, LIMITS.message, { multiline: true });
  const service = cleanText(a.context.plan ? `${a.service} (${a.context.plan})` : a.service, LIMITS.short) || 'General enquiry';

  // Context values come from our own buttons, but they are still cleaned and capped before saving.
  const details: Record<string, string> = {};
  contextRows(a.context).slice(0, 14).forEach(r => {
    const k = cleanText(r.key, 60);
    const v = cleanText(r.value, 200);
    if (k && v) details[k] = v;
  });
  if (businessName) details.businessName = businessName;
  details.whatsapp = phone;
  const source = cleanText(a.context.source ?? '', 120);
  if (source) details.source = source;
  const page = cleanText(currentPage(), 200);
  if (page) details.page = page;

  const summary = contextRows(a.context).map(r => `${r.label}: ${r.value}`).join('\n');
  const header = [
    `Service: ${service}`,
    summary,
    businessName ? `Business: ${businessName}` : '',
    `Phone / WhatsApp: ${phone}`,
    source || page ? `Source: ${[source, page].filter(Boolean).join(' · ')}` : '',
  ].filter(Boolean).join('\n');
  const message = `${header}\n\nMessage:\n${note || 'None'}`;

  const budget = cleanText(a.context.price || a.context.paygAmount || '', 50);

  const docRef = await withTimeout(loadFirestore().then(({ db, addDoc, collection }) => addDoc(collection(db, 'messages'), {
    source: a.formSource,
    name,
    email,
    phone,
    service,
    ...(budget ? { budget } : {}),
    message: cleanText(message, LIMITS.message + 2000, { multiline: true }) || service,
    serviceDetails: details,
    createdAt: new Date().toISOString(),
  })), SUBMIT_TIMEOUT_MS);
  if (docRef && docRef.id) notifyAdmin('messages', docRef.id);
}

/* ---------------- UI ---------------- */

export const leadInputClass =
  'peer w-full rounded-2xl border border-gray-200 bg-white py-3.5 pl-11 pr-4 text-[15px] text-gray-900 placeholder:text-gray-400 shadow-sm transition-all focus:border-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-400/20 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-white/30 dark:focus:border-yellow-400';

const Field: React.FC<{ id: string; label: string; icon: React.ElementType; optional?: boolean; children: React.ReactNode }> = ({ id, label, icon: Icon, optional, children }) => (
  <div>
    <label htmlFor={id} className="mb-1.5 flex items-center justify-between text-[13px] font-semibold text-gray-800 dark:text-white/85">
      <span>{label}</span>{optional && <span className="text-[11px] font-medium text-gray-400 dark:text-white/40">Optional</span>}
    </label>
    <div className="relative">
      <Icon aria-hidden="true" size={17} className="pointer-events-none absolute left-4 top-[1.05rem] text-gray-400 dark:text-white/40" />
      {children}
    </div>
  </div>
);

/** Read-only summary of what the visitor clicked (service, plan, price, minutes ...). */
export const LeadSummary: React.FC<{ service: string; context: LeadContext }> = ({ service, context }) => {
  const rows = contextRows(context);
  return (
    <div data-lead-summary className="rounded-2xl border border-yellow-400/40 bg-gradient-to-br from-yellow-50 to-white p-4 dark:from-yellow-400/[0.08] dark:to-transparent">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-yellow-700 dark:text-yellow-300">You selected</p>
      <p className="mt-1 text-base font-bold text-gray-900 dark:text-white">{service}{context.plan ? <span className="text-gray-500 dark:text-white/60"> · {context.plan}</span> : null}</p>
      {rows.filter(r => r.key !== 'plan').length > 0 && (
        <dl className="mt-3 flex flex-wrap gap-2">
          {rows.filter(r => r.key !== 'plan').map(r => (
            <div key={r.key} className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs dark:border-white/10 dark:bg-white/5">
              <dt className="text-gray-500 dark:text-white/50">{r.label}</dt>
              <dd className="font-bold text-gray-900 dark:text-white">{r.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
};

interface LeadFormProps {
  formSource: 'service' | 'contact';
  service: string;
  context: LeadContext;
  idPrefix?: string;
  onSuccess: () => void;
  /** Rendered between the summary and the fields (e.g. a service picker on the contact page). */
  before?: React.ReactNode;
  hideSummary?: boolean;
}

/** Single-step enquiry form: name, phone/WhatsApp, email, business name and an optional message. */
export const LeadForm: React.FC<LeadFormProps> = ({ formSource, service, context, idPrefix = 'lead', onSuccess, before, hideSummary }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [business, setBusiness] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState(''); // hidden from people; bots fill it
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const problem = validateLead(name, phone, email);
    if (problem) { setError(problem); return; }
    setError(null);
    if (honeypot) { onSuccess(); return; } // bot: pretend it worked, store nothing
    setSubmitting(true);
    try {
      await submitLead({ formSource, service, context, name, phone, email, businessName: business, message });
      onSuccess();
    } catch (err) {
      console.error('Lead could not be saved:', err);
      setError('Sorry, your request could not be sent. Please check your connection and try again, or message us on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  const id = (s: string) => `${idPrefix}-${s}`;

  return (
    <form onSubmit={handleSubmit} noValidate data-lead-form className="space-y-5">
      {!hideSummary && <LeadSummary service={service} context={context} />}
      {before}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }}>
        <label>Company website<input type="text" name="company_website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={e => setHoneypot(e.target.value)} /></label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id={id('name')} label="Your name" icon={User}>
          <input id={id('name')} name="name" type="text" required autoComplete="name" maxLength={LIMITS.name} placeholder="Full name" value={name} onChange={e => setName(e.target.value)} className={leadInputClass} />
        </Field>
        <Field id={id('phone')} label="Phone / WhatsApp" icon={Phone}>
          <input id={id('phone')} name="phone" type="tel" required inputMode="tel" autoComplete="tel" maxLength={LIMITS.phone} placeholder="+91 98765 43210" value={phone} onChange={e => setPhone(e.target.value)} className={leadInputClass} />
        </Field>
        <Field id={id('email')} label="Email" icon={Mail}>
          <input id={id('email')} name="email" type="email" required autoComplete="email" maxLength={LIMITS.email} placeholder="you@business.com" value={email} onChange={e => setEmail(e.target.value)} className={leadInputClass} />
        </Field>
        <Field id={id('business')} label={context.businessLabel ?? 'Business name'} icon={Building2} optional>
          <input id={id('business')} name="business" type="text" autoComplete="organization" maxLength={LIMITS.short} placeholder="Your business" value={business} onChange={e => setBusiness(e.target.value)} className={leadInputClass} />
        </Field>
      </div>
      <Field id={id('message')} label={context.messageLabel ?? 'Anything we should know?'} icon={MessageSquare} optional>
        <textarea id={id('message')} name="message" rows={3} maxLength={LIMITS.message} placeholder={context.messagePlaceholder ?? 'Goals, timeline, languages, call volume ...'} value={message} onChange={e => setMessage(e.target.value)} className={`${leadInputClass} resize-none`} />
      </Field>
      {error && (
        <div role="alert" className="flex items-start gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-400">
          <AlertCircle size={16} className="mt-0.5 shrink-0" /><span>{error}</span>
        </div>
      )}
      <button type="submit" disabled={submitting} className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-6 py-4 text-base font-bold text-black shadow-[0_12px_32px_rgba(234,179,8,0.30)] transition-all hover:-translate-y-0.5 hover:bg-yellow-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400/40 disabled:translate-y-0 disabled:opacity-70">
        {submitting ? <><Loader2 size={18} className="animate-spin" /> Sending…</> : <>{context.submitLabel ?? 'Send request'} <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" /></>}
      </button>
      <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-gray-500 dark:text-white/45"><Lock size={12} /> Private and secure. We reply within one working day, usually much sooner on WhatsApp.</p>
    </form>
  );
};

export default LeadForm;
