import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, Check, Bot, Cpu, Workflow, MessageSquare, Zap, 
  Database, Network, Sparkles, TrendingUp, Globe, Server, 
  Activity, Rocket, Webhook, FileText, Split, Send, Link2, 
  Search, Settings, Trash2 
} from 'lucide-react';
import ScrollReveal from '../../components/ScrollReveal';
import TextReveal from '../../components/TextReveal';

const WorkflowNode = ({ icon: Icon, title, x, y, active = false, color = "blue", hideInput = false, hideOutput = false, delay = 0 }: any) => {
  const colorMap: any = {
    blue: "text-[#00D4FF] border-[#00D4FF]/30",
    purple: "text-[#B026FF] border-[#B026FF]/30",
    green: "text-[#10B981] border-[#10B981]/30",
    orange: "text-[#F59E0B] border-[#F59E0B]/30"
  };

  const glowMap: any = {
    blue: "shadow-[0_0_20px_rgba(0,212,255,0.3)]",
    purple: "shadow-[0_0_20px_rgba(176,38,255,0.3)]",
    green: "shadow-[0_0_20px_rgba(16,185,129,0.3)]",
    orange: "shadow-[0_0_20px_rgba(245,158,11,0.3)]"
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, type: 'spring', stiffness: 100 }}
      whileHover={{ y: -5, scale: 1.05 }}
      style={{ left: x, top: y }}
      className="absolute z-20 group -translate-x-1/2 -translate-y-1/2 cursor-pointer isolate"
    >
      <div className={`p-3 rounded-2xl border bg-[#11141A]/95 backdrop-blur-xl flex items-center gap-3 w-[160px] transition-all duration-300 ${colorMap[color]} ${active ? glowMap[color] + ' border-current' : 'border-[#2A2E39] hover:border-current hover:' + glowMap[color]}`}>
        <div className={`w-10 h-10 rounded-xl bg-[#1D222E] flex items-center justify-center shrink-0`}>
          <Icon size={18} className="text-current" />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-[11px] font-bold text-[#E5E7EB] uppercase tracking-wide truncate">
            {title}
          </span>
          <span className="text-[8px] text-[#9CA3AF] truncate mt-0.5">
            Node logic
          </span>
        </div>
      </div>
      
      {/* Input Port (Left) */}
      {!hideInput && (
        <div className="absolute -left-[5px] top-1/2 -translate-y-[50%] w-3 h-3 rounded-full border-2 border-[#11141A] bg-[#9CA3AF] group-hover:bg-[#E5E7EB] z-30 transition-colors"></div>
      )}
      {/* Output Port (Right) */}
      {!hideOutput && (
        <div className="absolute -right-[5px] top-1/2 -translate-y-[50%] w-3 h-3 rounded-full border-2 border-[#11141A] bg-[#9CA3AF] group-hover:bg-[#E5E7EB] z-30 transition-colors"></div>
      )}
    </motion.div>
  );
};

const WorkflowVisual = () => {
  const nodeOffset = 80; // 160px node width / 2

  const nodes = [
    // Column 1
    { id: 'schedule', title: 'CRON Schedule', icon: Activity, x: 150, y: 150, color: 'orange', hideInput: true, delay: 0 },
    { id: 'webhook', title: 'Webhook Start', icon: Webhook, x: 150, y: 450, color: 'blue', active: true, hideInput: true, delay: 0.1 },
    { id: 'email_in', title: 'Email Parser', icon: FileText, x: 150, y: 750, color: 'purple', hideInput: true, delay: 0.2 },
    
    // Column 2
    { id: 'enrich', title: 'Lead Enricher', icon: Settings, x: 420, y: 300, color: 'blue', delay: 0.3 },
    { id: 'agent', title: 'AI Agent Hub', icon: Bot, x: 420, y: 450, color: 'purple', active: true, delay: 0.4 },
    { id: 'vision', title: 'Vision Scanner', icon: Search, x: 420, y: 600, color: 'green', delay: 0.5 },
    
    // Column 3
    { id: 'crm', title: 'CRM Sync', icon: Network, x: 690, y: 150, color: 'blue', delay: 0.6 },
    { id: 'model', title: 'Google Gemini', icon: Sparkles, x: 690, y: 300, color: 'blue', delay: 0.7 },
    { id: 'api', title: 'Rest API Client', icon: Globe, x: 690, y: 450, color: 'green', delay: 0.8 },
    { id: 'switch', title: 'Condition Logic', icon: Split, x: 690, y: 600, color: 'orange', delay: 0.9 },
    { id: 'analytics', title: 'Log Analytics', icon: TrendingUp, x: 690, y: 750, color: 'purple', delay: 1.0 },
    
    // Column 4
    { id: 'slack', title: 'Slack Notify', icon: MessageSquare, x: 960, y: 150, color: 'green', hideOutput: true, delay: 1.1 },
    { id: 'output1', title: 'WhatsApp Out', icon: Zap, x: 960, y: 300, color: 'green', hideOutput: true, delay: 1.2 },
    { id: 'output2', title: 'Return Data', icon: Send, x: 960, y: 450, color: 'blue', hideOutput: true, delay: 1.3 },
    { id: 'db', title: 'Database Store', icon: Database, x: 960, y: 600, color: 'purple', delay: 1.4 },
    { id: 'dashboard', title: 'Client Dashboard', icon: Cpu, x: 960, y: 750, color: 'orange', hideOutput: true, delay: 1.5 },
    
    // Column 5
    { id: 'docs', title: 'Knowledge Base', icon: FileText, x: 1230, y: 600, color: 'blue', delay: 1.6 },
    
    // Column 6
    { id: 'archive', title: 'Cold Storage Vault', icon: Server, x: 1500, y: 600, color: 'purple', hideOutput: true, delay: 1.7 },
  ];

  const connections = [
    // Top flow
    { from: 'schedule', to: 'enrich' },
    { from: 'enrich', to: 'crm' },
    { from: 'crm', to: 'slack' },
    
    // Middle-top interlaces
    { from: 'webhook', to: 'agent' },
    { from: 'agent', to: 'enrich' }, 
    { from: 'agent', to: 'model' },
    { from: 'model', to: 'crm' },
    { from: 'model', to: 'output1' },
    
    // Middle standard
    { from: 'agent', to: 'api' },
    { from: 'api', to: 'output2' },
    
    // Bottom interlaces
    { from: 'email_in', to: 'vision' },
    { from: 'vision', to: 'switch' },
    { from: 'agent', to: 'switch' },
    
    { from: 'switch', to: 'db' },
    { from: 'switch', to: 'analytics' },
    
    { from: 'analytics', to: 'dashboard' },
    
    // Storage tail
    { from: 'db', to: 'docs' },
    { from: 'docs', to: 'archive' },
  ];

  return (
    <div className="relative w-full h-[450px] lg:h-[550px] bg-[#0A0D14] rounded-[32px] md:rounded-[40px] border border-white/5 shadow-2xl overflow-hidden group/wf flex items-center justify-center">
      {/* Global Background Grid */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #00D4FF 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }}>
      </div>
      
      {/* Animated Glow Backdrops */}
      <div className="absolute top-[20%] left-[20%] w-72 h-72 bg-neon-blue/10 rounded-full blur-[110px] animate-pulse"></div>
      <div className="absolute bottom-[20%] right-[20%] w-72 h-72 bg-neon-purple/10 rounded-full blur-[110px] animate-pulse" style={{ animationDelay: '1.5s' }}></div>

      {/* FIXED SIZE INNER WOKRFLOW CANVAS (SCALES TO FIT) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1650px] h-[900px] scale-[0.22] sm:scale-[0.35] md:scale-[0.45] lg:scale-[0.55] xl:scale-[0.65] 2xl:scale-[0.75] transform-gpu">
        
        {/* SVG Drawing Layer for Perfect Splines */}
        <svg width="1650" height="900" viewBox="0 0 1650 900" className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-10 transition-transform duration-700">
          <defs>
            <linearGradient id="wf-line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#B026FF" stopOpacity="0.5" />
            </linearGradient>
            <filter id="glow">
               <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
               <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
               </feMerge>
            </filter>
            <filter id="glow-intense">
               <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
               <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
               </feMerge>
            </filter>
          </defs>
          
          {connections.map((conn, i) => {
            const fromNode = nodes.find(n => n.id === conn.from);
            const toNode = nodes.find(n => n.id === conn.to);
            if (!fromNode || !toNode) return null;

            // PRECISE CONNECTION MATH: Output is +nodeOffset, Input is -nodeOffset
            const sX = fromNode.x + nodeOffset;
            const sY = fromNode.y;
            const eX = toNode.x - nodeOffset;
            const eY = toNode.y;
            
            // Proportional Bezier Control points for perfect horizontal flow
            const deltaX = Math.abs(eX - sX);
            const cp1X = sX + deltaX * 0.45;
            const cp2X = eX - deltaX * 0.45;
            
            const d = `M ${sX} ${sY} C ${cp1X} ${sY}, ${cp2X} ${eY}, ${eX} ${eY}`;

            const isIntense = ['agent', 'switch'].includes(conn.from) || ['agent', 'switch'].includes(conn.to);

            return (
              <g key={i} className="opacity-90 group-hover/wf:opacity-100 transition-opacity duration-500">
                <path
                  d={d}
                  fill="none"
                  stroke="url(#wf-line-gradient)"
                  strokeWidth="2.5"
                  className="transition-all duration-700"
                />
                <motion.circle 
                  r="3.5" 
                  fill="#00D4FF"
                  filter={isIntense ? "url(#glow-intense)" : "url(#glow)"}
                >
                  <animateMotion
                    dur="3s"
                    repeatCount="indefinite"
                    path={d}
                    begin={`${i * 0.3}s`}
                  />
                  <animate
                    attributeName="r"
                    values={isIntense ? "3.5; 6; 3.5" : "3.5; 4.5; 3.5"}
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values={isIntense ? "0.6; 1; 0.6" : "0.7; 1; 0.7"}
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                </motion.circle>
              </g>
            );
          })}
        </svg>

        {/* Nodes Layer */}
        <div className="absolute inset-0 z-20">
          {nodes.map((node) => (
            <WorkflowNode key={node.id} {...node} />
          ))}
        </div>
      </div>

      {/* Floating Status Badges - Unaffected by scaling */}
      <div className="absolute top-6 left-6 flex flex-col gap-3 z-30">
        <motion.div 
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center gap-2.5 px-4 py-2 bg-white/10 dark:bg-black/50 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-full shadow-2xl"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[10px] md:text-xs font-bold text-gray-900 dark:text-white/90 uppercase tracking-widest">Live Flow</span>
        </motion.div>
      </div>

      <div className="absolute bottom-6 left-6 flex flex-col gap-3 z-30">
        <motion.div 
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="flex items-center gap-2.5 px-4 py-2 bg-white/10 dark:bg-black/50 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-full shadow-2xl"
        >
          <Zap size={14} className="text-neon-blue" />
          <span className="text-[10px] md:text-xs font-bold text-gray-900 dark:text-white/90 uppercase tracking-widest">Efficiency +94%</span>
        </motion.div>
      </div>

      <motion.div 
        animate={{ x: [0, 8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-6 right-6 flex items-center gap-2.5 px-4 py-2 bg-white/10 dark:bg-black/50 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-full shadow-2xl z-30"
      >
        <Network size={14} className="text-neon-purple" />
        <span className="text-[10px] md:text-xs font-bold text-gray-900 dark:text-white/90 uppercase tracking-widest">n8n Linked</span>
      </motion.div>
    </div>
  );
};

const AIAutomation: React.FC = () => {
  const [code, setCode] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  
  const fullCode = `// AI Agent Configuration
const agent = new BrandiQueAI({
  capabilities: ["Automation", "NLP", "workflows"],
  platform: "WhatsApp + Web",
  integration: "n8n + OpenAI",
  status: "OPTIMIZING_BUSINESS"
});

await agent.deploy();`;

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullCode.length) {
        setCode(fullCode.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);

    const cursorInterval = setInterval(() => {
      setCursorVisible(v => !v);
    }, 500);

    return () => {
      clearInterval(interval);
      clearInterval(cursorInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#05070A] transition-colors duration-300">
      <div className="relative w-full overflow-hidden bg-transparent pt-24 md:pt-28 lg:pt-32 pb-8 md:pb-12 lg:pb-24">
         {/* Blending Fix: Smooth transition from header to hero */}
         <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-white dark:from-[#05070A] to-transparent z-10 pointer-events-none"></div>
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,212,255,0.05),transparent_50%)]"></div>
         <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-neon-purple/5 rounded-full blur-[120px] pointer-events-none"></div>

         {/* Animated Workflow Nodes & Lines (n8n style) */}
         <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {['n8n', 'API', 'AI', 'SQL', 'WebHook', 'Bot'].map((symbol, i) => (
               <div 
                 key={i} 
                 className="absolute text-neon-blue/20 dark:text-neon-blue/10 font-mono font-bold text-lg animate-float border border-neon-blue/20 px-3 py-1 rounded-lg backdrop-blur-sm"
                 style={{ 
                   top: `${20 + (i * 12)}%`, 
                   left: `${10 + (Math.random() * 80)}%`, 
                   animationDelay: `${i * 2}s`,
                   animationDuration: `${12 + i * 3}s`
                 }}
               >
                 {symbol}
                 <div className="absolute -right-4 top-1/2 w-4 h-[1px] bg-neon-blue/30"></div>
                 <div className="absolute -left-4 top-1/2 w-4 h-[1px] bg-neon-blue/30"></div>
               </div>
            ))}
            
            {/* AI Chat Bubbles Floating */}
            <div className="absolute top-[10%] right-[15%] w-12 h-12 bg-neon-purple/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-[20%] left-[20%] w-16 h-16 bg-neon-blue/10 rounded-full blur-xl animate-pulse"></div>
         </div>

         <div className="max-w-[1400px] mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-10 md:gap-12 lg:gap-16 items-center mb-20 md:mb-24 lg:mb-32">
               <div className="relative">
                  <ScrollReveal>
                     <WorkflowVisual />
                  </ScrollReveal>
               </div>
               <div>
                  <ScrollReveal>
                     <div className="overflow-hidden mb-2">
                        <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white tracking-tight leading-[1.1] animate-reveal-text">
                           AI Automation & Smart Chatbot Systems
                        </h2>
                     </div>
                     <div className="mb-4 md:mb-6">
                        <TextReveal text="Automate your business operations with powerful AI agents and intelligent workflows." className="text-base md:text-lg lg:text-xl text-neon-blue font-medium" delay={300} />
                     </div>
                     <p className="text-gray-600 dark:text-gray-400 text-sm md:text-sm lg:text-lg leading-relaxed mb-6 md:mb-8 font-light">
                        Transform how your business operates with custom-built AI agents. From WhatsApp chatbots that close sales to complex n8n workflows that sync your data, we build systems that save you thousands of manual hours.
                     </p>
                     <ul className="space-y-2 md:space-y-3 mb-8 md:mb-10">
                        {[
                          "AI-powered WhatsApp, Telegram & Web Bots",
                          "Automated workflows using n8n & Make",
                          "Smart auto-replies for 24/7 engagement",
                          "Google Sheets & API data sync",
                          "Lead generation & appointment agents"
                        ].map((feat, i) => (
                           <li key={i} className="flex items-center gap-3 opacity-0 animate-fade-up" style={{ animationDelay: `${500 + i * 100}ms`, animationFillMode: 'forwards' }}>
                              <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-neon-blue/20 flex items-center justify-center text-neon-blue shrink-0">
                                 <Check size={10} className="md:w-[12px]" strokeWidth={3} />
                              </div>
                              <span className="text-gray-700 dark:text-gray-300 text-xs md:text-xs lg:text-base">{feat}</span>
                           </li>
                        ))}
                     </ul>
                     <a 
                        href="https://wa.me/917093320572?text=Hi%20I%20am%20looking%20for%20a%20AI%20Automation%20or%20AI%20Agent%20Services!"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 md:gap-3 px-6 py-3 md:px-6 md:py-3 lg:px-8 lg:py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-xs md:text-xs lg:text-sm uppercase tracking-wider hover:bg-neon-blue hover:text-white dark:hover:bg-neon-blue dark:hover:text-white transition-all shadow-lg hover:shadow-neon-blue/40 group transform hover:-translate-y-1"
                     >
                        Start AI Project <ArrowRight size={16} className="md:w-[18px] group-hover:translate-x-1 transition-transform" />
                     </a>
                  </ScrollReveal>
               </div>
            </div>

            <div className="my-10">
              <ins
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-format="fluid"
                data-ad-layout-key="-ef+6k-30-ac+ty"
                data-ad-client="ca-pub-9587188804206049"
                data-ad-slot="2366860495"
              ></ins>
            </div>

            {/* ===== In-Article Ad ===== */}
            <div className="my-10 flex justify-center">
              <ins
                className="adsbygoogle"
                style={{ display: "block", textAlign: "center" }}
                data-ad-layout="in-article"
                data-ad-format="fluid"
                data-ad-client="ca-pub-9587188804206049"
                data-ad-slot="9328856681"
              />
            </div>

            {/* ===== Auto-relaxed Ad ===== */}
            <div className="my-10 flex justify-center">
              <ins
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-format="autorelaxed"
                data-ad-client="ca-pub-9587188804206049"
                data-ad-slot="2426738115"
              />
            </div>

            {/* WHAT I OFFER SECTION */}
            <div className="mb-20 md:mb-24 lg:mb-32">
               <ScrollReveal>
                  <div className="text-center mb-10 md:mb-16">
                     <h3 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">Intelligence <span className="text-neon-blue">In Action.</span></h3>
                     <p className="text-gray-500 max-w-xl mx-auto font-light">Custom automation solutions designed to grow with your business.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                     {[
                        { title: "WhatsApp Bots", desc: "AI-powered bots for sales & support on WhatsApp.", icon: MessageSquare, color: "text-green-500", bg: "bg-green-500/10" },
                        { title: "n8n Workflows", desc: "Complex multi-step automation using n8n pipelines.", icon: Workflow, color: "text-orange-500", bg: "bg-orange-500/10" },
                        { title: "Web Chatbots", desc: "Intelligent support agents for your website visitors.", icon: Bot, color: "text-neon-blue", bg: "bg-neon-blue/10" },
                        { title: "Data Integration", desc: "Auto-sync leads between APIs & Google Sheets.", icon: Database, color: "text-neon-purple", bg: "bg-neon-purple/10" },
                        { title: "Telegram Agents", desc: "Custom bots for groups and channels automation.", icon: Network, color: "text-blue-400", bg: "bg-blue-400/10" },
                        { title: "Auto-Replies", desc: "Instant AI responses for customer queries.", icon: Activity, color: "text-pink-500", bg: "bg-pink-500/10" },
                        { title: "Task Automation", desc: "Notifications, leads, and operational support bots.", icon: Cpu, color: "text-yellow-500", bg: "bg-yellow-500/10" },
                        { title: "And More...", desc: "Fully custom solutions built for your specific needs.", icon: Sparkles, color: "text-gray-400", bg: "bg-gray-400/10" }
                     ].map((item, i) => (
                        <div key={i} className="group p-8 rounded-[32px] bg-white dark:bg-[#0F1320] border border-gray-200 dark:border-white/5 hover:border-neon-blue/30 transition-all duration-300 hover:shadow-2xl hover:shadow-neon-blue/5">
                           <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center ${item.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                              <item.icon size={24} />
                           </div>
                           <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h4>
                           <p className="text-gray-500 dark:text-gray-400 text-sm font-light leading-relaxed">{item.desc}</p>
                        </div>
                     ))}
                  </div>
               </ScrollReveal>
            </div>

            {/* USE CASES SECTION */}
            <div className="mb-20 md:mb-24 lg:mb-32">
               <ScrollReveal>
                  <div className="text-center mb-10 md:mb-16">
                     <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">Real-World Use Cases</h3>
                     <div className="h-1 w-20 bg-neon-blue mx-auto rounded-full"></div>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
                     {[
                        { title: "Customer Support", desc: "Reduce support costs by 80% with 24/7 AI help." },
                        { title: "Lead Generation", desc: "Capture and qualify leads while you sleep." },
                        { title: "Appointment Booking", desc: "Automate scheduling without a personal assistant." },
                        { title: "FAQ Auto-Replies", desc: "Handle repetitive questions instantly via AI." },
                        { title: "Order Tracking", desc: "Automated status updates for your customers." }
                     ].map((item, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-neon-blue/5 border border-neon-blue/10 text-center hover:bg-neon-blue/10 transition-colors pointer-events-none">
                           <h4 className="font-bold text-gray-900 dark:text-white mb-2">{item.title}</h4>
                           <p className="text-xs text-gray-500 dark:text-gray-400 font-light leading-relaxed">{item.desc}</p>
                        </div>
                     ))}
                  </div>
               </ScrollReveal>
            </div>

            {/* FEATURES CHECKLIST SECTION */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-20 md:mb-24 lg:mb-32">
               <ScrollReveal>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">Powerful AI Capabilities</h3>
                  <div className="space-y-4">
                     {[
                        { title: "24/7 Automated Responses", desc: "Instant engagement for every customer, any time." },
                        { title: "Complete AI Replies", desc: "Smart, context-aware responses using advanced LLMs." },
                        { title: "Fully Customized Workflows", desc: "Designed around your specific business logic." },
                        { title: "Scalable & Secure System", desc: "Enterprise-grade security for your business data." }
                     ].map((item, i) => (
                        <div key={i} className="flex gap-4 p-4 rounded-xl bg-white dark:bg-[#0F1320] border border-gray-100 dark:border-white/5 shadow-sm">
                           <div className="w-10 h-10 rounded-full bg-neon-blue/20 flex items-center justify-center text-neon-blue shrink-0">
                              <Check size={20} strokeWidth={3} />
                           </div>
                           <div>
                              <h4 className="text-gray-900 dark:text-white font-bold">{item.title}</h4>
                              <p className="text-sm text-gray-500 font-light">{item.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </ScrollReveal>
               <ScrollReveal>
                  <div className="p-8 md:p-12 bg-white dark:bg-[#0F1320] rounded-[40px] border border-gray-200 dark:border-white/5 shadow-2xl relative overflow-hidden group">
                     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-blue to-neon-purple opacity-50"></div>
                     <h3 className="text-2xl md:text-3xl font-bold mb-6">Why Choose BrandiQue?</h3>
                     <div className="space-y-6">
                        {[
                           { title: "Custom Solutions", desc: "Every system is built specifically for your needs, not a template.", icon: Sparkles },
                           { title: "Affordable Pricing", desc: "Get high-end automation at startup-friendly price points.", icon: Zap },
                           { title: "Fast Delivery", desc: "From concept to live automation system in record time.", icon: Rocket },
                           { title: "Real Business Logic", desc: "We focus on solving actual business problems beyond basic bots.", icon: TrendingUp }
                        ].map((item, i) => (
                           <div key={i} className="flex gap-4 items-start">
                              <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-neon-blue shrink-0 border border-gray-200 dark:border-white/5">
                                 <item.icon size={20} />
                              </div>
                              <div>
                                 <h4 className="text-gray-900 dark:text-white font-bold mb-1">{item.title}</h4>
                                 <p className="text-sm text-gray-500 dark:text-gray-400 font-light">{item.desc}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </ScrollReveal>
            </div>

            {/* PRICING PLANS */}
            <div className="mb-20 md:mb-24 lg:mb-32">
               <ScrollReveal>
                  <div className="text-center mb-10 md:mb-16">
                     <h3 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">Simple, Transparent <span className="text-neon-blue">Pricing.</span></h3>
                     <p className="text-gray-500 max-w-xl mx-auto font-light">Choose a plan that fits your business automation goals.</p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-8">
                     {[
                        { 
                          name: "Basic Bot", 
                          price: "3,999", 
                          desc: "Simple WhatsApp bot with basic automation.",
                          features: ["WhatsApp Integration", "Basic Rule-based replies", "Contact Management", "5 Workflows"]
                        },
                        { 
                          name: "Advanced AI Agent", 
                          price: "7,999", 
                          desc: "AI-powered chatbot with smart responses.",
                          features: ["Smart AI Responses", "Database Integration", "Sentiment Analysis", "Unlimited Workflows", "Priority Support"],
                          popular: true
                        },
                        { 
                          name: "Full Automation System", 
                          price: "14,999+", 
                          desc: "Complete workflow automation for your business.",
                          features: ["n8n Multi-app Sync", "CRM & Google Sheets sync", "Payment Bot integration", "Custom API connectors", "Dedicated Consultant"]
                        }
                     ].map((item, i) => (
                        <div key={i} className={`relative p-8 md:p-10 rounded-[40px] bg-white dark:bg-[#0F1320] border ${item.popular ? 'border-neon-blue shadow-[0_0_40px_rgba(0,212,255,0.15)] scale-105 z-10' : 'border-gray-200 dark:border-white/5'} flex flex-col`}>
                           {item.popular && (
                              <div className="absolute top-0 right-0 transform translate-x-1 -translate-y-1/2 px-4 py-1.5 bg-neon-blue text-white text-[10px] font-bold uppercase tracking-widest rounded-full">Most Popular</div>
                           )}
                           <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{item.name}</h4>
                           <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-light leading-relaxed">{item.desc}</p>
                           <div className="mb-8">
                              <span className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">₹{item.price}</span>
                              <span className="text-gray-400 ml-2">/ one-time</span>
                           </div>
                           <ul className="space-y-4 mb-10 flex-1">
                              {item.features.map((f, idx) => (
                                 <li key={idx} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                    <Check size={16} className="text-neon-blue shrink-0" /> {f}
                                 </li>
                              ))}
                           </ul>
                           <a 
                              href="https://wa.me/917093320572?text=Hi%20I%20am%20looking%20for%20a%20AI%20Automation%20or%20AI%20Agent%20Services!"
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`w-full py-4 rounded-2xl font-bold text-center transition-all ${item.popular ? 'bg-neon-blue text-white shadow-lg shadow-neon-blue/20 hover:scale-105' : 'bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white hover:bg-neon-blue hover:text-white'}`}
                           >
                              Choose Plan
                           </a>
                        </div>
                     ))}
                  </div>
               </ScrollReveal>
            </div>

            {/* SPECIAL HIGHLIGHT SECTION */}
            <ScrollReveal>
               <div className="mb-24 py-16 md:py-24 bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-[48px] border border-neon-blue/30 text-center relative overflow-hidden group shadow-2xl animate-pulse-glow">
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                  <div className="relative z-10 px-6">
                     <h3 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">Start Automating Your Business Today.</h3>
                     <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light mb-10">Get your custom AI automation setup and save hours of manual work every single day.</p>
                     <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a 
                           href="https://wa.me/917093320572?text=Hi%20I%20am%20looking%20for%20a%20AI%20Automation%20or%20AI%20Agent%20Services!"
                           target="_blank"
                           rel="noopener noreferrer"
                           className="px-10 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold shadow-2xl hover:scale-105 transition-transform inline-flex items-center justify-center gap-3"
                        >
                           Contact Now <ArrowRight size={20} />
                        </a>
                        <a 
                           href="https://wa.me/917093320572?text=Hi%20I%20am%20looking%20for%20a%20AI%20Automation%20or%20AI%20Agent%20Services!"
                           target="_blank"
                           rel="noopener noreferrer"
                           className="px-10 py-4 border border-neon-blue/50 text-neon-blue bg-neon-blue/5 backdrop-blur-sm rounded-full font-bold hover:bg-neon-blue hover:text-white transition-all inline-flex items-center justify-center gap-3"
                        >
                           Let’s Build Your AI System <Zap size={20} />
                        </a>
                     </div>
                  </div>
               </div>
            </ScrollReveal>
         </div>
      </div>
    </div>
  );
};

export default AIAutomation;
