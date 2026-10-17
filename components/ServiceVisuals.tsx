import React from 'react';
import { Bot, CheckCheck, FileSpreadsheet, BellRing, CalendarClock, MessageCircle, Gauge, Smartphone, Search, Star, PhoneCall, AudioLines, FileText } from 'lucide-react';

export type ServiceKey = 'web' | 'ai' | 'design' | 'voice';

const stagger = (i: number, base = 120) => ({ animationDelay: `${base + i * 140}ms` });

/** Animated browser building a high-converting business website. */
export const WebVisual: React.FC = () => (
  <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[24px] border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#0B0E14]">
    <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
      <span className="h-2.5 w-2.5 rounded-full bg-red-400" /><span className="h-2.5 w-2.5 rounded-full bg-yellow-400" /><span className="h-2.5 w-2.5 rounded-full bg-green-400" />
      <div className="ml-3 flex-1 truncate rounded-md bg-white px-3 py-1 text-[10px] font-medium text-gray-500 dark:bg-white/5 dark:text-gray-400">yourbusiness.in</div>
    </div>
    <div className="space-y-3 p-4">
      <div className="flex items-center justify-between opacity-0 animate-fade-up" style={stagger(0)}>
        <div className="h-3 w-20 rounded-full bg-gray-900 dark:bg-white" />
        <div className="flex gap-2"><div className="h-2 w-8 rounded-full bg-gray-200 dark:bg-white/15" /><div className="h-2 w-8 rounded-full bg-gray-200 dark:bg-white/15" /><div className="h-2 w-8 rounded-full bg-gray-200 dark:bg-white/15" /></div>
      </div>
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 p-4 opacity-0 animate-fade-up" style={stagger(1)}>
        <div className="h-3 w-3/4 rounded-full bg-white/90" />
        <div className="mt-2 h-3 w-1/2 rounded-full bg-white/70" />
        <div className="mt-3 h-2 w-2/3 rounded-full bg-white/40" />
        <div className="mt-4 flex gap-2">
          <div className="flex items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-[9px] font-bold text-white shadow-lg animate-pulse"><MessageCircle size={10} /> WhatsApp us</div>
          <div className="rounded-full bg-white/20 px-3 py-1.5 text-[9px] font-bold text-white">Call now</div>
        </div>
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map(i => (
          <div key={i} className="rounded-xl border border-gray-200 p-2.5 opacity-0 animate-fade-up dark:border-white/10" style={stagger(2 + i)}>
            <div className="h-5 w-5 rounded-md bg-cyan-500/20" />
            <div className="mt-2 h-1.5 w-full rounded-full bg-gray-200 dark:bg-white/15" />
            <div className="mt-1 h-1.5 w-2/3 rounded-full bg-gray-200 dark:bg-white/10" />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 opacity-0 animate-fade-up" style={stagger(5)}>
        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={11} className="fill-yellow-400 text-yellow-400" />)}
        <div className="h-1.5 flex-1 rounded-full bg-gray-200 dark:bg-white/10" />
      </div>
    </div>
    <div className="mx-4 mb-4 mt-auto grid grid-cols-3 gap-2 opacity-0 animate-fade-up" style={stagger(6)}>
      {[{ icon: Gauge, t: 'Fast' }, { icon: Smartphone, t: 'Mobile-first' }, { icon: Search, t: 'SEO-ready' }].map(c => (
        <div key={c.t} className="flex items-center justify-center gap-1 rounded-lg bg-gray-900/90 px-2 py-1.5 text-[9px] font-bold text-white dark:bg-white/10"><c.icon size={10} className="text-cyan-300" />{c.t}</div>
      ))}
    </div>
  </div>
);

const CHAT = [
  { from: 'c', text: 'Hi, what are the Class 10 fees? Any evening batch?' },
  { from: 'b', text: 'Fees are ₹18,000 a year, evening batch 6 to 8 PM. Book a free demo?' },
  { from: 'c', text: 'Yes, Saturday please' },
  { from: 'b', text: 'Booked for Saturday 10 AM ✅ Reminder coming the day before.' },
];

/** Animated WhatsApp AI assistant conversation with the automations it triggers. */
export const AIVisual: React.FC = () => (
  <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[24px] border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#0B0E14]">
    <div className="flex items-center gap-3 bg-[#075E54] px-4 py-3 text-white">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15"><Bot size={16} /></div>
      <div className="min-w-0 flex-1"><div className="truncate text-xs font-bold">AI Assistant · Example</div><div className="text-[10px] text-white/70">online · replies in seconds</div></div>
    </div>
    <div className="flex-1 space-y-2 bg-[#ECE5DD] px-3 py-3 dark:bg-[#0F141B]">
      {CHAT.map((m, i) => (
        <div key={i} className={`flex ${m.from === 'b' ? 'justify-start' : 'justify-end'}`}>
          <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-[11px] leading-snug shadow-sm opacity-0 animate-fade-up ${m.from === 'b' ? 'rounded-tl-sm bg-white text-gray-800 dark:bg-[#1C232D] dark:text-gray-100' : 'rounded-tr-sm bg-[#DCF8C6] text-gray-800 dark:bg-[#005C4B] dark:text-white'}`} style={stagger(i, 200)}>
            {m.text}{m.from === 'c' && <CheckCheck size={11} className="ml-1 inline text-sky-500" />}
          </div>
        </div>
      ))}
    </div>
    <div className="grid grid-cols-3 divide-x divide-gray-200 border-t border-gray-200 dark:divide-white/10 dark:border-white/10">
      {[{ icon: FileSpreadsheet, l: 'Lead saved' }, { icon: BellRing, l: 'Owner alerted' }, { icon: CalendarClock, l: 'Reminder set' }].map((x, i) => (
        <div key={x.l} className="flex flex-col items-center gap-1 px-1 py-2.5 opacity-0 animate-fade-in" style={stagger(i, 900)}>
          <x.icon size={14} className="text-violet-500 dark:text-violet-300" /><span className="text-[9px] font-semibold text-gray-600 dark:text-gray-300">{x.l}</span>
        </div>
      ))}
    </div>
  </div>
);

/** Animated design canvas: social post, logo mark, palette and type. */
export const DesignVisual: React.FC = () => (
  <div className="relative h-full w-full overflow-hidden rounded-[24px] border border-gray-200 bg-[#F4F1EA] shadow-2xl dark:border-white/10 dark:bg-[#0E0D0B]">
    <div className="absolute inset-0 bg-[radial-gradient(#00000012_1px,transparent_1px)] bg-[size:14px_14px] dark:bg-[radial-gradient(#ffffff10_1px,transparent_1px)]" />
    <div className="relative flex h-full flex-col gap-3 p-4">
    <div className="grid min-h-0 flex-1 grid-cols-5 gap-3">
      <div className="col-span-3 flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 p-4 text-white shadow-xl opacity-0 animate-scale-in" style={stagger(0)}>
        <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/80">Festive offer</div>
        <div className="mt-2 text-2xl font-black leading-none">FLAT<br />30% OFF</div>
        <div className="mt-auto flex items-center justify-between">
          <div className="rounded-full bg-black/80 px-2.5 py-1 text-[9px] font-bold">Shop now</div>
          <div className="h-8 w-8 rounded-full border-2 border-white/70" />
        </div>
      </div>
      <div className="col-span-2 flex flex-col gap-3">
        <div className="flex flex-1 items-center justify-center rounded-2xl bg-white shadow-lg opacity-0 animate-scale-in dark:bg-[#1A1814]" style={stagger(1)}>
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full border-4 border-gray-900 dark:border-white animate-spin-slow" style={{ borderRightColor: 'transparent' }} />
            <div className="absolute inset-3 rounded-full bg-amber-400" />
          </div>
        </div>
        <div className="rounded-2xl bg-white p-2.5 shadow-lg opacity-0 animate-scale-in dark:bg-[#1A1814]" style={stagger(2)}>
          <div className="flex gap-1.5">{['bg-gray-900', 'bg-amber-400', 'bg-orange-500', 'bg-rose-500', 'bg-[#F4F1EA]'].map(c => <div key={c} className={`h-5 flex-1 rounded-md border border-black/5 ${c}`} />)}</div>
          <div className="mt-2 flex items-end justify-between"><span className="text-xl font-black leading-none text-gray-900 dark:text-white">Aa</span><span className="text-[8px] font-bold uppercase tracking-wider text-gray-400">Brand kit</span></div>
        </div>
      </div>
    </div>
    <div className="flex items-center justify-between gap-2 opacity-0 animate-fade-up" style={stagger(4)}>
      {['Post 1:1', 'Story 9:16', 'Ad 4:5', 'Print A4'].map(f => <span key={f} className="flex-1 rounded-full bg-gray-900 px-2 py-1.5 text-center text-[9px] font-bold text-white shadow dark:bg-white dark:text-black">{f}</span>)}
    </div>
    </div>
  </div>
);

const CALL = [
  { from: 'a', text: 'Namaskaram! BrandiQue Clinic nundi call chestunnam. Mee appointment enquiry gurinchi.' },
  { from: 'c', text: 'Haa, Saturday morning slot unda?' },
  { from: 'a', text: 'Saturday 10:30 AM free undi. Book cheyyamantara?' },
  { from: 'c', text: 'Yes, please book it.' },
];

/** Animated AI voice call: live waveform, bilingual transcript and the actions it triggers. */
export const VoiceVisual: React.FC = () => (
  <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[24px] border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#0B0E14]">
    <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 text-white">
      <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/15"><PhoneCall size={15} /><span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-green-300 animate-pulse" /></div>
      <div className="min-w-0 flex-1"><div className="truncate text-xs font-bold">AI Voice Agent · Example call</div><div className="text-[10px] text-white/75">Live · Telugu + English · 00:42</div></div>
      <div className="flex h-6 items-end gap-[3px]" aria-hidden="true">
        {[0, 1, 2, 3, 4, 5].map(i => <span key={i} className="w-[3px] rounded-full bg-white/80 animate-pulse" style={{ height: `${[10, 18, 12, 22, 14, 8][i]}px`, animationDelay: `${i * 120}ms` }} />)}
      </div>
    </div>
    <div className="flex-1 space-y-2 bg-gray-50 px-3 py-3 dark:bg-[#0F141B]">
      {CALL.map((m, i) => (
        <div key={i} className={`flex ${m.from === 'a' ? 'justify-start' : 'justify-end'}`}>
          <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-[11px] leading-snug shadow-sm opacity-0 animate-fade-up ${m.from === 'a' ? 'rounded-tl-sm bg-white text-gray-800 dark:bg-[#1C232D] dark:text-gray-100' : 'rounded-tr-sm bg-emerald-100 text-gray-800 dark:bg-emerald-900/60 dark:text-white'}`} style={stagger(i, 200)}>
            {m.from === 'a' && <AudioLines size={11} className="mr-1 inline text-emerald-500" />}{m.text}
          </div>
        </div>
      ))}
    </div>
    <div className="grid grid-cols-3 divide-x divide-gray-200 border-t border-gray-200 dark:divide-white/10 dark:border-white/10">
      {[{ icon: CalendarClock, l: 'Slot booked' }, { icon: MessageCircle, l: 'WhatsApp sent' }, { icon: FileText, l: 'Call summary' }].map((x, i) => (
        <div key={x.l} className="flex flex-col items-center gap-1 px-1 py-2.5 opacity-0 animate-fade-in" style={stagger(i, 900)}>
          <x.icon size={14} className="text-emerald-500 dark:text-emerald-300" /><span className="text-[9px] font-semibold text-gray-600 dark:text-gray-300">{x.l}</span>
        </div>
      ))}
    </div>
  </div>
);

export const SERVICE_VISUALS: Record<ServiceKey, React.FC> = { web: WebVisual, ai: AIVisual, design: DesignVisual, voice: VoiceVisual };
