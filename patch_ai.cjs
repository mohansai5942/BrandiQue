const fs = require('fs');

const file = 'pages/services/AIAutomation.tsx';
let content = fs.readFileSync(file, 'utf8');

// Ensure all required icons are imported
// In AIAutomation.tsx, we have lucide-react imports:
// ArrowRight, Check, Bot, Cpu, Workflow, MessageSquare, Zap, Database, Network, Sparkles, TrendingUp, Globe, Server, Activity, Rocket, Webhook, FileText, Split, Send, Link2, Search, Settings, Trash2, Plus, Minus, Maximize

content = content.replace(
  "import { \n  ArrowRight, Check, Bot, Cpu, Workflow, MessageSquare, Zap, \n  Database, Network, Sparkles, TrendingUp, Globe, Server, \n  Activity, Rocket, Webhook, FileText, Split, Send, Link2, \n  Search, Settings, Trash2, Plus, Minus, Maximize\n} from 'lucide-react';",
  "import { \n  ArrowRight, Check, Bot, Cpu, Workflow, MessageSquare, Zap, \n  Database, Network, Sparkles, TrendingUp, Globe, Server, \n  Activity, Rocket, Webhook, FileText, Split, Send, Link2, \n  Search, Settings, Trash2, Plus, Minus, Maximize, Target, Package, Layers, Code, LayoutTemplate, ShieldCheck\n} from 'lucide-react';"
);
// Also it might match single line import if it was re-formatted. Let's just do a robust regex or simple append.
content = content.replace(
    /import {([\s\S]*?)} from 'lucide-react';/,
    (match, p1) => {
        const icons = ["ArrowRight", "Check", "Bot", "Cpu", "Workflow", "MessageSquare", "Zap", "Database", "Network", "Sparkles", "TrendingUp", "Globe", "Server", "Activity", "Rocket", "Webhook", "FileText", "Split", "Send", "Link2", "Search", "Settings", "Trash2", "Plus", "Minus", "Maximize", "Target", "Package", "Layers", "Code", "LayoutTemplate", "ShieldCheck"];
        // Just return all of those to be safe.
        return `import { ${icons.join(', ')} } from 'lucide-react';`;
    }
);

const PACKAGES_CODE = `
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
     enterprise: "70,000 to 1,50,000+"
  },
  features: ["WhatsApp bots (sales & customer support)", "Web chatbots (website visitor interaction)", "Telegram bots (group & channel automation)", "AI-powered auto-replies", "Lead capture & qualification system", "Multi-step conversation flows", "Integration with APIs & databases", "24/7 automated customer interaction", "Hosting & API setup included"],
  deliverables: ["Fully functional chatbot (WhatsApp / Web / Telegram)", "Conversation flow setup", "AI response configuration", "Lead capture & integration setup", "API & database connections", "Hosting setup & live deployment", "Tested bot (user interaction)", "Admin access / control panel", "Usage guidance + initial support"],
  process: ["Requirement Discussion: Use case & audience", "Flow Design: Plan conversation structure", "Bot Development: WhatsApp / Web / Telegram", "AI Setup: Configure smart responses", "Integration: Connect APIs / CRM", "Testing: Check responses & UX", "Deployment & Training"],
  requirements: ["Use case (sales, support, lead gen)", "Platform preference", "Common questions / FAQs", "API / CRM access", "Branding elements", "Contact / lead details to capture"],
  tech: ["WhatsApp API (Cloud API)", "Telegram Bot API", "Web chatbot frameworks", "OpenAI / LLMs", "Dialogflow / custom NLP", "Node.js / Python", "Cloud hosting", "Database (storing chats/leads)"],
  promises: ["100% custom-built chatbot", "Fast and accurate AI responses", "Smooth conversation flow & UX", "Multi-platform reliability", "Secure data handling", "Thorough testing before launch", "Post-launch support & guidance"]
};
`;

const NEW_SECTION_JSX = `
            {/* Detailed Services & Packages */}
            <div className="mb-20 md:mb-24 lg:mb-32">
               <div className="text-center mb-10 md:mb-16">
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">Detailed Packages</h3>
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
                              <h4 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6 uppercase tracking-tight">{pkg.title}</h4>
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
                                    <h4 className="text-2xl md:text-3xl font-bold text-white mb-4">Pricing Tiers</h4>
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
                                    <h4 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Features</h4>
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
                                    <h4 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Deliverables</h4>
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
                                    <h4 className="text-xl md:text-2xl font-bold text-white">Full Cycle Process</h4>
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
                                    <h4 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Requirements</h4>
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
                                    <h4 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Tech & Tools</h4>
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
                                    <h4 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Our Promises</h4>
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
                           <a 
                              href={\`https://wa.me/917093320572?text=Hi,%20I%20am%20interested%20in%20your%20\${encodeURIComponent(pkg.title)}%20services.\`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-neon-blue text-white rounded-full font-bold text-base md:text-lg hover:bg-black transition-colors shadow-[0_10px_30px_rgba(0,212,255,0.3)] hover:shadow-black/30 group"
                           >
                              Get Quote for {pkg.title} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                           </a>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
`;

content = content.replace('const AIAutomation: React.FC = () => {', PACKAGES_CODE + '\nconst AIAutomation: React.FC = () => {');

// Remove the old PRICING PLANS section completely
const oldPricingStart = content.indexOf('{/* PRICING PLANS */}');
if (oldPricingStart !== -1) {
    const endStr = '{/* SPECIAL HIGHLIGHT SECTION */}';
    const oldPricingEnd = content.indexOf(endStr);
    
    if (oldPricingEnd !== -1) {
        content = content.substring(0, oldPricingStart) + NEW_SECTION_JSX + content.substring(oldPricingEnd);
        fs.writeFileSync(file, content);
        console.log('Patched AI Automation page successfully');
    } else {
        console.log('Error: Could not find end of PRICING PLANS section');
    }
} else {
    console.log('Error: Could not find PRICING PLANS section');
}
