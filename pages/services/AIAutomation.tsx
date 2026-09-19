import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Check, Bot, Cpu, Workflow, MessageSquare, Zap, Database, Network, Sparkles, TrendingUp, Globe, Server, Activity, Rocket, Webhook, FileText, Split, Send, Link2, Search, Settings, Trash2, Plus, Minus, Maximize, Target, Package, Layers, Code, LayoutTemplate, ShieldCheck } from 'lucide-react';
import ScrollReveal from '../../components/ScrollReveal';
import { useInquiry } from '../../context/InquiryContext';
import TextReveal from '../../components/TextReveal';

const WorkflowNode = ({ id, onNodeDrag, icon: Icon, title, x, y, active = false, color = "blue", hideInput = false, hideOutput = false, delay = 0, zoom = 1 }: any) => {
  const [isDragging, setIsDragging] = useState(false);

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

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    e.stopPropagation();
    // movementX and movementY are physical screen pixels, so divide by zoom
    onNodeDrag(id, e.movementX / zoom, e.movementY / zoom);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: isDragging ? 0 : delay, duration: isDragging ? 0 : 0.5, type: 'spring', stiffness: 100 }}
      whileHover={{ scale: 1.05 }}
      style={{ left: x, top: y }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`absolute z-20 group -translate-x-1/2 -translate-y-1/2 isolate ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
    >
      <div className={`p-3 rounded-2xl border bg-[#11141A]/95 backdrop-blur-xl flex items-center gap-3 w-[160px] transition-all duration-300 ${colorMap[color]} ${active ? glowMap[color] + ' border-current' : 'border-[#2A2E39] hover:border-current hover:' + glowMap[color]} ${isDragging ? 'ring-2 ring-white/20' : ''}`}>
        <div className={`w-10 h-10 rounded-xl bg-[#1D222E] flex items-center justify-center shrink-0`}>
          <Icon size={18} className="text-current" />
        </div>
        <div className="flex flex-col overflow-hidden select-none pointer-events-none">
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
        <div className="absolute -left-[5px] top-1/2 -translate-y-[50%] w-3 h-3 rounded-full border-2 border-[#11141A] bg-[#9CA3AF] group-hover:bg-[#E5E7EB] z-30 transition-colors pointer-events-none"></div>
      )}
      {/* Output Port (Right) */}
      {!hideOutput && (
        <div className="absolute -right-[5px] top-1/2 -translate-y-[50%] w-3 h-3 rounded-full border-2 border-[#11141A] bg-[#9CA3AF] group-hover:bg-[#E5E7EB] z-30 transition-colors pointer-events-none"></div>
      )}
    </motion.div>
  );
};

const WorkflowVisual = () => {
  const [zoom, setZoom] = useState(1);
  const [resetKey, setResetKey] = useState(0);
  const nodeOffset = 80; // 160px node width / 2

  const [nodes, setNodes] = useState([
    // Column 1
    { id: 'webhook', title: 'Webhook Start', icon: Webhook, x: 120, y: 300, color: 'blue', active: true, hideInput: true, delay: 0 },
    
    // Column 2
    { id: 'agent', title: 'Darling AI', icon: Bot, x: 340, y: 300, color: 'purple', active: true, delay: 0.2 },
    
    // Column 3
    { id: 'model', title: 'Google Gemini', icon: Sparkles, x: 560, y: 150, color: 'blue', delay: 0.4 },
    { id: 'api', title: 'External API', icon: Globe, x: 560, y: 300, color: 'green', delay: 0.6 },
    { id: 'switch', title: 'Condition / IF', icon: Split, x: 560, y: 450, color: 'orange', delay: 0.8 },
    
    // Column 4
    { id: 'output1', title: 'WhatsApp Out', icon: MessageSquare, x: 780, y: 150, color: 'green', hideOutput: true, delay: 1.0 },
    { id: 'output2', title: 'Return Data', icon: Send, x: 780, y: 300, color: 'blue', hideOutput: true, delay: 1.2 },
    { id: 'db', title: 'Data Store', icon: Database, x: 780, y: 450, color: 'purple', delay: 1.4 },
    
    // Column 5
    { id: 'docs', title: 'Knowledge Base', icon: FileText, x: 1000, y: 450, color: 'blue', hideOutput: true, delay: 1.6 },
  ]);

  const handleNodeDrag = (id: string, deltaX: number, deltaY: number) => {
    setNodes(prev => prev.map(node => 
      node.id === id 
        ? { ...node, x: node.x + deltaX, y: node.y + deltaY }
        : node
    ));
  };

  const connections = [
    { from: 'webhook', to: 'agent' },
    { from: 'agent', to: 'model' },
    { from: 'agent', to: 'api' },
    { from: 'agent', to: 'switch' },
    { from: 'model', to: 'output1' },
    { from: 'api', to: 'output2' },
    { from: 'switch', to: 'db' },
    { from: 'db', to: 'docs' },
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

      {/* INTERACTIVE DRAGGABLE & ZOOMABLE PANVAS */}
      <motion.div 
        key={resetKey}
        drag
        dragConstraints={{ left: -1000, right: 1000, top: -1000, bottom: 1000 }}
        dragElastic={0.1}
        className="absolute top-1/2 left-1/2 w-[4000px] h-[4000px] -ml-[2000px] -mt-[2000px] cursor-grab active:cursor-grabbing flex items-center justify-center z-10"
        animate={{ scale: zoom }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="relative w-[1120px] h-[600px] scale-[0.35] sm:scale-[0.55] md:scale-[0.65] lg:scale-[0.75] xl:scale-[0.85] 2xl:scale-[1] origin-center transform-gpu pointer-events-auto">
          
          {/* SVG Drawing Layer for Perfect Splines */}
        <svg width="1120" height="600" viewBox="0 0 1120 600" className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-10 transition-transform duration-700">
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
            <WorkflowNode key={node.id} onNodeDrag={handleNodeDrag} zoom={zoom} {...node} />
          ))}
        </div>
        </div>
      </motion.div>

      {/* Zoom / Pan Controls */}
      <div className="absolute bottom-6 right-6 flex items-center gap-1.5 px-3 py-2 bg-white/10 dark:bg-black/50 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-full shadow-2xl z-40">
        <button 
          onClick={() => setZoom(z => Math.max(0.4, z - 0.2))}
          className="p-1.5 rounded-full hover:bg-white/20 text-gray-800 dark:text-white transition-colors"
          title="Zoom Out"
        >
          <Minus size={16} />
        </button>
        <div className="w-[1px] h-4 bg-white/20 mx-1"></div>
        <button 
          onClick={() => {
            setZoom(1);
            setResetKey(prev => prev + 1);
          }}
          className="p-1.5 rounded-full hover:bg-white/20 text-gray-800 dark:text-white transition-colors"
          title="Reset Zoom & Pan"
        >
          <Maximize size={14} />
        </button>
        <div className="w-[1px] h-4 bg-white/20 mx-1"></div>
        <button 
          onClick={() => setZoom(z => Math.min(3, z + 0.2))}
          className="p-1.5 rounded-full hover:bg-white/20 text-gray-800 dark:text-white transition-colors"
          title="Zoom In"
        >
          <Plus size={16} />
        </button>
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


const AI_AUTOMATION_PKG = {
  id: "ai-automation",
  title: "AI Automation",
  icon: Workflow,
  desc: "We design and implement smart automation systems that streamline your business processes and reduce manual work. By connecting different tools, APIs, and workflows, we create efficient systems that handle repetitive tasks, manage data flow, and improve overall productivity. Our solutions are customized to fit your operations, helping you save time, minimize errors, and scale smoothly.",
  price: { 
     basic: "20,000 to 40,000 (one-time)", 
     advanced: "40,000 to 80,000",
     enterprise: "80,000 to 1,80,000+",
     maintenance: "5,000 to 15,000 / month (optional)"
  },
  features: ["n8n workflow automation (multi-step pipelines)", "Task automation (notifications, operations, triggers)", "Data integration (APIs, Google Sheets, CRM sync)", "Lead management & auto-sync systems", "Webhooks & event-based automation", "Conditional logic & smart workflows", "Error handling & retry systems", "Scheduled automation (time-based)", "Hosting & API integration setup included"],
  deliverables: ["Fully configured n8n workflows (pipelines)", "Automation system setup (tasks, triggers, flows)", "API & data integration setup", "Webhooks & event-based automation configuration", "Hosting setup & deployment", "Tested & optimized automation system", "Documentation (basic workflow explanation)", "Access to workflows + admin control", "Initial support after delivery"],
  process: ["Requirement Analysis: Understand tasks & logic", "Workflow Planning: Design structure in n8n", "Integration Setup: Connect APIs & tools", "Development: Build flows & conditions", "Testing: Check for accuracy & errors", "Deployment: Setup hosting & go live", "Optimization & Handover"],
  requirements: ["Business workflow details", "Tools/platforms used (CRM, Sheets, etc.)", "API access / credentials", "Sample data (for testing)", "Expected output/results from automation"],
  tech: ["n8n (workflow automation & pipelines)", "APIs & Webhooks", "Google Sheets / Airtable", "Node.js / JavaScript", "Cloud Hosting (VPS)", "Databases (Firebase, Supabase, MySQL)", "GitHub"],
  promises: ["Fully functional automation systems", "Accurate workflow execution", "Secure API & data handling", "Scalable setup for future growth", "Proper testing before deployment", "On-time delivery", "Complete access & control after handover"]
};

const AI_CHATBOTS_PKG = {
  id: "ai-chatbots",
  title: "AI Chatbots",
  icon: Bot,
  desc: "We develop intelligent AI chatbots that handle customer interactions with speed and accuracy. These bots can respond instantly to queries, assist users, capture leads, and provide support across platforms like websites and messaging apps. Our chatbots are designed to improve user experience, ensure consistent communication, and support your business 24/7.",
  price: { 
     basic: "15,000 to 30,000", 
     advanced: "30,000 to 70,000",
     enterprise: "70,000 to 1,50,000+",
     maintenance: ""
  },
  features: ["WhatsApp bots (sales & customer support)", "Web chatbots (website visitor interaction)", "Telegram bots (group & channel automation)", "AI-powered auto-replies", "Lead capture & qualification system", "Multi-step conversation flows", "Integration with APIs & databases", "24/7 automated customer interaction", "Hosting & API setup included"],
  deliverables: ["Fully functional chatbot (WhatsApp / Web / Telegram)", "Conversation flow setup", "AI response configuration", "Lead capture & integration setup", "API & database connections", "Hosting setup & live deployment", "Tested bot (user interaction)", "Admin access / control panel", "Usage guidance + initial support"],
  process: ["Requirement Discussion: Use case & audience", "Flow Design: Plan conversation structure", "Bot Development: WhatsApp / Web / Telegram", "AI Setup: Configure smart responses", "Integration: Connect APIs / CRM", "Testing: Check responses & UX", "Deployment & Training"],
  requirements: ["Use case (sales, support, lead gen)", "Platform preference", "Common questions / FAQs", "API / CRM access", "Branding elements", "Contact / lead details to capture"],
  tech: ["WhatsApp API (Cloud API)", "Telegram Bot API", "Web chatbot frameworks", "OpenAI / LLMs", "Dialogflow / custom NLP", "Node.js / Python", "Cloud hosting", "Database (storing chats/leads)"],
  promises: ["100% custom-built chatbot", "Fast and accurate AI responses", "Smooth conversation flow & UX", "Multi-platform reliability", "Secure data handling", "Thorough testing before launch", "Post-launch support & guidance"]
};

const AIAutomation: React.FC = () => {
  const { openInquiry } = useInquiry();
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
                        <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white tracking-tight leading-[1.1] animate-reveal-text">
                           AI Automation & Smart Chatbot Systems
                        </h1>
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
                     <button onClick={() => openInquiry('AI Automation & Agents')} className="inline-flex items-center gap-2 md:gap-3 px-6 py-3 md:px-6 md:py-3 lg:px-8 lg:py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-xs md:text-xs lg:text-sm uppercase tracking-wider hover:bg-neon-blue hover:text-white dark:hover:bg-neon-blue dark:hover:text-white transition-all shadow-lg hover:shadow-neon-blue/40 group transform hover:-translate-y-1">
                        Start AI Project <ArrowRight size={16} className="md:w-[18px] group-hover:translate-x-1 transition-transform" />
                     </button>
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
                     <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">Intelligence <span className="text-neon-blue">In Action.</span></h2>
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
                           <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                           <p className="text-gray-500 dark:text-gray-400 text-sm font-light leading-relaxed">{item.desc}</p>
                        </div>
                     ))}
                  </div>
               </ScrollReveal>
            </div>

            {/* Detailed Services & Packages */}
            <div className="mb-20 md:mb-24 lg:mb-32">
               <div className="text-center mb-10 md:mb-16">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">Detailed Packages</h2>
                  <div className="h-1 w-20 bg-neon-blue mx-auto rounded-full mb-6"></div>
                  <p className="text-sm md:text-base text-gray-500 max-w-2xl mx-auto">Explore our extensive automation and chatbot solutions.</p>
               </div>


               <div className="space-y-32">
                  {[AI_AUTOMATION_PKG, AI_CHATBOTS_PKG].map((pkg, i) => (
                     <div key={i} id={pkg.id}>
                        {/* Package Title & Description */}
                        <ScrollReveal delay="delay-100">
                           <div className="mb-10 text-center">
                              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-neon-blue/10 text-neon-blue mb-6 relative group">
                                  <div className="absolute inset-0 bg-neon-blue/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100"></div>
                                  <pkg.icon size={32} className="relative z-10" />
                              </div>
                              <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6 uppercase tracking-tight">{pkg.title}</h3>
                              <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base leading-relaxed max-w-4xl mx-auto">{pkg.desc}</p>
                           </div>
                        </ScrollReveal>

                        {/* Bento Grid Layout */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
                           
                           {/* Pricing Card - spans 1 col */}
                           <ScrollReveal delay="delay-200" className="lg:row-span-2">
                              <div className="bg-gradient-to-br from-blue-500 to-indigo-700 rounded-[32px] p-8 h-full flex flex-col shadow-xl relative overflow-hidden group">
                                 <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform group-hover:scale-110 transition-transform duration-700"></div>
                                 <div className="absolute -top-4 -right-4 p-6 opacity-20 pointer-events-none transform group-hover:rotate-12 transition-transform duration-500">
                                    <TrendingUp size={120} className="text-white" />
                                 </div>
                                 <div className="relative z-10 flex-grow">
                                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Pricing Tiers</h3>
                                    <p className="text-blue-100 text-sm mb-8 leading-relaxed">
                                       Flexible plans tailored to your technical needs. We deliver robust automated capabilities.
                                    </p>
                                    
                                    <div className="space-y-4">
                                       <div className="bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md rounded-2xl p-5 border border-white/20">
                                          <p className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-1">Basic Setup</p>
                                          <div className="flex flex-col gap-1">
                                             <p className="text-white text-xl md:text-2xl font-black">₹{pkg.price.basic}</p>
                                          </div>
                                       </div>
                                       <div className="bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md rounded-2xl p-5 border border-white/20 relative overflow-hidden">
                                          <div className="absolute top-0 right-0 bg-white text-blue-600 text-[10px] font-bold px-3 py-1 rounded-bl-xl z-20">Advanced</div>
                                          <p className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-1">Pro System</p>
                                          <div className="flex flex-col gap-1">
                                             <p className="text-white text-xl md:text-2xl font-black">₹{pkg.price.advanced}</p>
                                          </div>
                                       </div>
                                       <div className="bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md rounded-2xl p-5 border border-white/20">
                                          <p className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-1">Enterprise</p>
                                          <div className="flex flex-col gap-1">
                                             <p className="text-white text-xl md:text-2xl font-black">₹{pkg.price.enterprise}</p>
                                          </div>
                                       </div>
                                       {pkg.price.maintenance && (
                                       <div className="bg-white/5 pb-2">
                                          <p className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-1">Maintenance</p>
                                          <p className="text-white text-sm font-bold">₹{pkg.price.maintenance}</p>
                                       </div>
                                       )}
                                    </div>
                                 </div>
                              </div>
                           </ScrollReveal>

                           {/* Features Card */}
                           <ScrollReveal delay="delay-300">
                              <div className="bg-white dark:bg-[#151A25] rounded-[32px] p-8 md:p-10 border border-gray-200 dark:border-white/5 shadow-xl h-full flex flex-col group hover:border-blue-500/30 transition-colors">
                                 <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                                       <Sparkles size={24} />
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Features</h3>
                                 </div>
                                 <ul className="space-y-3 flex-grow text-sm text-gray-600 dark:text-gray-400">
                                    {pkg.features.map((item, i) => (
                                       <li key={i} className="flex items-start gap-3"><Check size={16} className="text-blue-500 shrink-0 mt-0.5" /> <span>{item}</span></li>
                                    ))}
                                 </ul>
                              </div>
                           </ScrollReveal>

                           {/* Deliverables Card */}
                           <ScrollReveal delay="delay-400">
                              <div className="bg-white dark:bg-[#151A25] rounded-[32px] p-8 md:p-10 border border-gray-200 dark:border-white/5 shadow-xl h-full flex flex-col group hover:border-indigo-500/30 transition-colors">
                                 <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0">
                                       <Package size={24} />
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Deliverables</h3>
                                 </div>
                                 <ul className="space-y-3 flex-grow text-sm text-gray-600 dark:text-gray-400">
                                    {pkg.deliverables.map((item, i) => (
                                       <li key={i} className="flex items-start gap-3"><Check size={16} className="text-indigo-500 shrink-0 mt-0.5" /> <span>{item}</span></li>
                                    ))}
                                 </ul>
                              </div>
                           </ScrollReveal>

                           {/* Process Card - spans 2 cols on lg */}
                           <ScrollReveal delay="delay-500" className="md:col-span-2">
                              <div className="bg-[#0A0C11] rounded-[32px] p-8 md:p-10 border border-gray-800 shadow-xl relative overflow-hidden h-full flex flex-col">
                                 <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[80px]"></div>
                                 <div className="flex items-center gap-4 mb-8 relative z-10">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white shrink-0">
                                       <LayoutTemplate size={24} />
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-bold text-white">Full Cycle Process</h3>
                                 </div>
                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 relative z-10 flex-grow">
                                    {pkg.process.map((item, i) => (
                                       <div key={i} className="flex gap-4 items-start group">
                                          <span className="w-6 h-6 rounded-full bg-gray-800 text-gray-400 group-hover:bg-blue-500 group-hover:text-white transition-colors flex items-center justify-center text-[10px] sm:text-xs font-bold shrink-0 mt-0.5">{i+1}</span>
                                          <div>
                                             <p className="text-sm md:text-base font-bold text-gray-200 mb-1">{item}</p>
                                          </div>
                                       </div>
                                    ))}
                                 </div>
                              </div>
                           </ScrollReveal>

                           {/* Requirements Card */}
                           <ScrollReveal delay="delay-600">
                              <div className="bg-white dark:bg-[#151A25] rounded-[32px] p-8 md:p-10 border border-gray-200 dark:border-white/5 shadow-xl h-full flex flex-col group hover:border-amber-500/30 transition-colors">
                                 <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                                       <Layers size={24} />
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Requirements</h3>
                                 </div>
                                 <ul className="space-y-3 flex-grow text-sm text-gray-600 dark:text-gray-400">
                                    {pkg.requirements.map((item, i) => (
                                       <li key={i} className="flex items-start gap-3"><Check size={14} className="text-amber-500 shrink-0 mt-0.5" /> <span>{item}</span></li>
                                    ))}
                                 </ul>
                              </div>
                           </ScrollReveal>

                           {/* Tech & Tools Card */}
                           <ScrollReveal delay="delay-700">
                              <div className="bg-white dark:bg-[#151A25] rounded-[32px] p-8 md:p-10 border border-gray-200 dark:border-white/5 shadow-xl h-full flex flex-col group hover:border-cyan-500/30 transition-colors">
                                 <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 shrink-0">
                                       <Code size={24} />
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Tech & Tools</h3>
                                 </div>
                                 <div className="flex flex-wrap gap-2 flex-grow">
                                    {pkg.tech.map((item, i) => (
                                       <span key={i} className="px-3 py-1.5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-lg text-xs md:text-sm text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap">
                                          {item}
                                       </span>
                                    ))}
                                 </div>
                              </div>
                           </ScrollReveal>

                           {/* Promises Card */}
                           <ScrollReveal delay="delay-800" className="md:col-span-2">
                              <div className="bg-white dark:bg-[#151A25] rounded-[32px] p-8 md:p-10 border border-gray-200 dark:border-white/5 shadow-xl h-full flex flex-col group hover:border-emerald-500/30 transition-colors">
                                 <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                                       <ShieldCheck size={24} />
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Our Promises</h3>
                                 </div>
                                 <div className="grid md:grid-cols-2 gap-y-3 gap-x-6 flex-grow text-sm text-gray-600 dark:text-gray-400">
                                    {pkg.promises.map((item, i) => (
                                       <div key={i} className="flex items-start gap-3"><Check size={16} className="text-emerald-500 shrink-0 mt-0.5" /> <span>{item}</span></div>
                                    ))}
                                 </div>
                              </div>
                           </ScrollReveal>

                        </div>
                        
                        <div className="mt-12 md:mt-16 text-center flex justify-center w-full">
                           <button onClick={() => openInquiry('AI Automation & Agents', pkg.title)} className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-neon-blue text-white rounded-full font-bold text-base md:text-lg hover:bg-black transition-colors shadow-[0_10px_30px_rgba(0,212,255,0.3)] hover:shadow-black/30 group">
                              Get Quote for {pkg.title} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                           </button>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
{/* USE CASES SECTION */}
            <div className="mb-20 md:mb-24 lg:mb-32">
               <ScrollReveal>
                  <div className="text-center mb-10 md:mb-16">
                     <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">Real-World Use Cases</h2>
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
                           <h3 className="font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                           <p className="text-xs text-gray-500 dark:text-gray-400 font-light leading-relaxed">{item.desc}</p>
                        </div>
                     ))}
                  </div>
               </ScrollReveal>
            </div>

            {/* FEATURES CHECKLIST SECTION */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-20 md:mb-24 lg:mb-32">
               <ScrollReveal>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">Powerful AI Capabilities</h2>
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
                              <h3 className="text-gray-900 dark:text-white font-bold">{item.title}</h3>
                              <p className="text-sm text-gray-500 font-light">{item.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </ScrollReveal>
               <ScrollReveal>
                  <div className="p-8 md:p-12 bg-white dark:bg-[#0F1320] rounded-[40px] border border-gray-200 dark:border-white/5 shadow-2xl relative overflow-hidden group">
                     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-blue to-neon-purple opacity-50"></div>
                     <h2 className="text-2xl md:text-3xl font-bold mb-6">Why Choose BrandiQue?</h2>
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
                                 <h3 className="text-gray-900 dark:text-white font-bold mb-1">{item.title}</h3>
                                 <p className="text-sm text-gray-500 dark:text-gray-400 font-light">{item.desc}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </ScrollReveal>
            </div>

            
            {/* SPECIAL HIGHLIGHT SECTION */}
            <ScrollReveal>
               <div className="mb-24 py-16 md:py-24 bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-[48px] border border-neon-blue/30 text-center relative overflow-hidden group shadow-2xl animate-pulse-glow">
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                  <div className="relative z-10 px-6">
                     <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">Start Automating Your Business Today.</h2>
                     <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light mb-10">Get your custom AI automation setup and save hours of manual work every single day.</p>
                     <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button onClick={() => openInquiry('AI Automation & Agents')} className="inline-flex items-center gap-2 md:gap-3 px-6 py-3 md:px-6 md:py-3 lg:px-8 lg:py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-xs md:text-xs lg:text-sm uppercase tracking-wider hover:bg-neon-blue hover:text-white dark:hover:bg-neon-blue dark:hover:text-white transition-all shadow-lg hover:shadow-neon-blue/40 group transform hover:-translate-y-1">
                           Contact Now <ArrowRight size={20} />
                        </button>
                        <button onClick={() => openInquiry('AI Automation & Agents')} className="inline-flex items-center gap-2 md:gap-3 px-6 py-3 md:px-6 md:py-3 lg:px-8 lg:py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-xs md:text-xs lg:text-sm uppercase tracking-wider hover:bg-neon-blue hover:text-white dark:hover:bg-neon-blue dark:hover:text-white transition-all shadow-lg hover:shadow-neon-blue/40 group transform hover:-translate-y-1">
                           Let’s Build Your AI System <Zap size={20} />
                        </button>
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
