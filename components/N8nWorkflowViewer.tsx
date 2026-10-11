import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { 
  ReactFlow, 
  ReactFlowProvider,
  useReactFlow,
  useNodesInitialized,
  Background, 
  useNodesState, 
  useEdgesState, 
  BackgroundVariant,
  Panel,
  Handle,
  Position,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
  AlertCircle, 
  ClipboardList, 
  Braces, 
  Code2,
  Globe, 
  Bot, 
  Database, 
  Wrench, 
  SlidersHorizontal, 
  Briefcase, 
  Clock, 
  Filter, 
  ArrowDownUp, 
  Minimize2, 
  ImageIcon, 
  Facebook, 
  Instagram, 
  Twitter, 
  MessageCircle, 
  MessageSquare,
  Plus,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  SendHorizontal,
  Mail,
  Webhook,
  Zap,
  FileSpreadsheet,
  GitFork,
  GitMerge,
  Pause,
  Hash,
  Sparkles,
  Cpu,
  FileCode,
  CreditCard,
  Folder,
  Users,
  FileText,
  Lock
} from 'lucide-react';

const getIconForType = (type: string, name: string, className: string = 'w-8 h-8') => {
  const t = (type || '').toLowerCase();
  const n = (name || '').toLowerCase();
  
  // 1. Service Specific Matchers (Highest Priority)
  if (t.includes('telegram') || n.includes('telegram') || t.includes('tg') || n.includes('tg')) {
    return <SendHorizontal className={`${className} text-[#229ED9]`} strokeWidth={1.8} />;
  }
  if (t.includes('whatsapp') || n.includes('whatsapp') || n.includes('wa ')) {
    return <MessageCircle className={`${className} text-[#25D366]`} strokeWidth={1.8} />;
  }
  if (t.includes('gmail') || n.includes('gmail') || t.includes('email') || n.includes('email') || t.includes('mail') || n.includes('mail')) {
    return <Mail className={`${className} text-[#EA4335]`} strokeWidth={1.8} />;
  }
  if (t.includes('twitter') || n.includes('twitter') || n.includes('tweet') || n.includes('x.com')) {
    return <Twitter className={`${className} text-[#1DA1F2]`} strokeWidth={1.8} />;
  }
  if (t.includes('linkedin') || n.includes('linkedin')) {
    return <Briefcase className={`${className} text-[#0A66C2]`} strokeWidth={1.8} />;
  }
  if (t.includes('facebook') || n.includes('facebook')) {
    return <Facebook className={`${className} text-[#1877F2]`} strokeWidth={1.8} />;
  }
  if (t.includes('instagram') || n.includes('instagram')) {
    return <Instagram className={`${className} text-[#E1306C]`} strokeWidth={1.8} />;
  }
  if (t.includes('slack') || n.includes('slack')) {
    return <Hash className={`${className} text-[#E01E5A]`} strokeWidth={1.8} />;
  }
  if (t.includes('discord') || n.includes('discord')) {
    return <MessageSquare className={`${className} text-[#5865F2]`} strokeWidth={1.8} />;
  }
  if (t.includes('notion') || n.includes('notion')) {
    return <FileText className={`${className} text-gray-900 dark:text-[#FFFFFF]`} strokeWidth={1.8} />;
  }
  if (t.includes('stripe') || n.includes('stripe') || n.includes('payment')) {
    return <CreditCard className={`${className} text-[#635BFF]`} strokeWidth={1.8} />;
  }
  if (t.includes('hubspot') || n.includes('hubspot') || n.includes('crm') || n.includes('lead') || n.includes('salesforce')) {
    return <Users className={`${className} text-[#FF7A59]`} strokeWidth={1.8} />;
  }
  if (t.includes('drive') || n.includes('drive') || t.includes('s3') || n.includes('s3') || n.includes('storage') || n.includes('file')) {
    return <Folder className={`${className} text-[#4285F4]`} strokeWidth={1.8} />;
  }

  // 2. Data Sources & Spreadsheets
  if (t.includes('sheet') || n.includes('sheet') || t.includes('excel') || n.includes('excel') || n.includes('spreadsheet') || n.includes('csv') || n.includes('table')) {
    return <FileSpreadsheet className={`${className} text-[#0F9D58]`} strokeWidth={1.8} />;
  }
  if (t.includes('airtable') || n.includes('airtable') || t.includes('postgres') || n.includes('postgres') || t.includes('mysql') || n.includes('mysql') || t.includes('database') || n.includes('database') || t.includes('supabase') || n.includes('supabase') || n.includes('sql') || n.includes('record')) {
    return <Database className={`${className} text-[#FFBA00]`} strokeWidth={1.8} />;
  }

  // 3. AI & Models
  if (t.includes('agent') || n.includes('agent')) {
    return <Bot className={`${className} text-[#7B61FF]`} strokeWidth={1.8} />;
  }
  if (t.includes('openai') || n.includes('openai') || n.includes('gpt') || t.includes('gemini') || n.includes('gemini') || t.includes('claude') || n.includes('claude') || t.includes('model') || n.includes('model') || n.includes('llm')) {
    return <Sparkles className={`${className} text-[#10A37F]`} strokeWidth={1.8} />;
  }

  // 4. Triggers & Schedules
  if (t.includes('schedule') || n.includes('schedule') || t.includes('cron') || n.includes('cron') || t.includes('interval') || n.includes('interval')) {
    return <Clock className={`${className} text-[#FF6D00]`} strokeWidth={1.8} />;
  }
  if (t.includes('form') || n.includes('form') || t.includes('typeform') || n.includes('tally')) {
    return <ClipboardList className={`${className} text-[#00E5FF]`} strokeWidth={1.8} />;
  }
  if (t.includes('webhook') || n.includes('webhook')) {
    return <Webhook className={`${className} text-[#00E5FF]`} strokeWidth={1.8} />;
  }

  // 5. Logic, Data & Code Operations
  if (t.includes('httprequest') || n.includes('http') || n.includes('api') || n.includes('scrape') || n.includes('fetch')) {
    return <Globe className={`${className} text-[#7B61FF]`} strokeWidth={1.8} />;
  }
  if (t.includes('code') || n.includes('code') || t.includes('function') || n.includes('function') || t.includes('set') || n.includes('set') || n.includes('edit fields') || n.includes('js')) {
    return <Code2 className={`${className} text-[#FF6D00]`} strokeWidth={1.8} />;
  }
  if (t.includes('filter') || n.includes('filter')) {
    return <Filter className={`${className} text-[#00E5FF]`} strokeWidth={1.8} />;
  }
  if (t.includes('switch') || n.includes('switch') || t.includes('if') || n.includes('if') || t.includes('router') || n.includes('router')) {
    return <GitFork className={`${className} text-[#00E5FF]`} strokeWidth={1.8} />;
  }
  if (t.includes('sort') || n.includes('sort')) {
    return <ArrowDownUp className={`${className} text-[#7B61FF]`} strokeWidth={1.8} />;
  }
  if (t.includes('limit') || n.includes('limit')) {
    return <Minimize2 className={`${className} text-[#2ECC71]`} strokeWidth={1.8} />;
  }
  if (t.includes('merge') || n.includes('merge')) {
    return <GitMerge className={`${className} text-[#3498DB]`} strokeWidth={1.8} />;
  }
  if (t.includes('wait') || n.includes('wait') || t.includes('delay') || n.includes('delay')) {
    return <Pause className={`${className} text-gray-500 dark:text-[#A2A4A8]`} strokeWidth={1.8} />;
  }

  // 6. Generic Triggers & Messaging
  if (t.includes('trigger') || n.includes('trigger')) {
    return <Zap className={`${className} text-[#FF6D00]`} strokeWidth={1.8} />;
  }
  if (n.includes('image') || n.includes('photo')) {
    return <ImageIcon className={`${className} text-gray-900 dark:text-[#F1F2F4]`} strokeWidth={1.8} />;
  }
  if (n.includes('send') || n.includes('message') || n.includes('chat') || n.includes('notify')) {
    return <MessageSquare className={`${className} text-[#00E5FF]`} strokeWidth={1.8} />;
  }

  // 7. Helpers & Subnodes
  if (t.includes('tool') || n.includes('tool')) return <Wrench className={`${className} text-gray-900 dark:text-[#F1F2F4]`} strokeWidth={1.8} />;
  if (t.includes('memory') || n.includes('memory')) return <Cpu className={`${className} text-gray-900 dark:text-[#F1F2F4]`} strokeWidth={1.8} />;
  if (t.includes('parser') || n.includes('parser')) return <FileCode className={`${className} text-gray-900 dark:text-[#F1F2F4]`} strokeWidth={1.8} />;

  // Default fallback
  return <SlidersHorizontal className={`${className} text-gray-500 dark:text-[#A2A4A8]`} strokeWidth={1.8} />;
};

function N8nStandardNode({ data }: any) {
  const sourceHandles = data.sourceHandles && data.sourceHandles.length > 0 ? data.sourceHandles : ['main'];
  const targetHandles = data.targetHandles && data.targetHandles.length > 0 ? data.targetHandles : ['main'];

  return (
    <div className="relative flex flex-col items-center group w-[80px]">
      <Handle type="target" id="main" position={Position.Left} className="w-2.5 h-2.5 rounded border-[3px] border-white dark:border-[#17181c] bg-[#888c95] -ml-[5px]" />
      
      {targetHandles.map((h: string) => (
        h !== 'main' && <Handle key={`t-${h}`} type="target" id={h} position={Position.Left} className="w-1 h-1 opacity-0 absolute pointer-events-none z-0" />
      ))}
      
      <div className="w-[68px] h-[68px] bg-white dark:bg-[#23252a] rounded-[14px] flex items-center justify-center border border-[#d5d8de] dark:border-[#3a3d45] shadow-[0_4px_10px_rgba(0,0,0,0.5)] group-hover:border-[#62646a] transition-colors z-10">
        {getIconForType(data.type, data.label, 'w-7 h-7')}
      </div>
      
      <Handle type="source" id="main" position={Position.Right} className="w-2.5 h-2.5 rounded border-[3px] border-white dark:border-[#17181c] bg-[#888c95] -mr-[5px]" />
      
      {sourceHandles.map((h: string) => (
        h !== 'main' && <Handle key={`s-${h}`} type="source" id={h} position={Position.Right} className="w-1 h-1 opacity-0 absolute pointer-events-none z-0" />
      ))}
      
      <div className="absolute top-[76px] text-center w-[160px] z-20 pointer-events-none">
        <div className="text-[12px] font-bold text-gray-900 dark:text-[#f1f2f4] leading-tight drop-shadow-md">{data.label}</div>
        <div className="text-[10px] text-gray-500 dark:text-[#888c95] truncate mt-1">
          {data.label}
        </div>
      </div>
    </div>
  );
}

function N8nAgentNode({ data }: any) {
  return (
    <div className="relative flex flex-col items-center group">
      <Handle type="target" id="main" position={Position.Left} className="w-2.5 h-2.5 rounded border-[3px] border-white dark:border-[#17181c] bg-[#888c95] -ml-[5px] !top-1/2" />
      
      <div className="w-[180px] h-[64px] bg-white dark:bg-[#23252a] rounded-xl flex items-center px-4 border border-[#d5d8de] dark:border-[#3a3d45] shadow-[0_4px_10px_rgba(0,0,0,0.5)] group-hover:border-[#62646a] transition-colors z-10">
        <div className="w-10 h-10 bg-gray-50 dark:bg-[#16171a] border border-gray-200 dark:border-[#2c2d31] rounded-lg flex items-center justify-center mr-3 shrink-0">
          {getIconForType(data.type, data.label, 'w-5 h-5')}
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="text-[13px] font-bold text-gray-900 dark:text-[#f1f2f4] truncate">{data.label}</div>
          <div className="text-[11px] text-gray-500 dark:text-[#888c95] truncate mt-0.5">Agent</div>
        </div>
      </div>

      <Handle type="source" id="main" position={Position.Right} className="w-2.5 h-2.5 rounded border-[3px] border-white dark:border-[#17181c] bg-[#888c95] -mr-[5px] !top-1/2" />
      
      <Handle type="target" id="ai_languageModel" position={Position.Bottom} className="w-2 h-2 rounded-sm border-[2px] border-white dark:border-[#17181c] bg-[#888c95] !left-[30%] -mb-[4px]" />
      <div className="absolute -bottom-4 text-[9px] text-gray-500 dark:text-[#888c95] font-semibold pointer-events-none" style={{ left: '30%', transform: 'translateX(-50%)' }}>Chat Model*</div>

      <Handle type="target" id="ai_memory" position={Position.Bottom} className="w-2 h-2 rounded-sm border-[2px] border-white dark:border-[#17181c] bg-[#888c95] !left-[55%] -mb-[4px]" />
      <div className="absolute -bottom-4 text-[9px] text-gray-500 dark:text-[#888c95] font-semibold pointer-events-none" style={{ left: '55%', transform: 'translateX(-50%)' }}>Memory</div>

      <Handle type="target" id="ai_tool" position={Position.Bottom} className="w-2 h-2 rounded-sm border-[2px] border-white dark:border-[#17181c] bg-[#888c95] !left-[75%] -mb-[4px]" />
      <div className="absolute -bottom-4 text-[9px] text-gray-500 dark:text-[#888c95] font-semibold flex items-center gap-1 pointer-events-none" style={{ left: '75%', transform: 'translateX(-50%)' }}>
         Tool <div className="w-3 h-3 rounded-sm bg-gray-300 dark:bg-[#3a3d45] flex items-center justify-center text-white"><Plus className="w-2 h-2" /></div>
      </div>
      
      <Handle type="target" id="ai_outputParser" position={Position.Bottom} className="w-2 h-2 opacity-0 absolute pointer-events-none" style={{ left: '90%' }} />
    </div>
  );
}

function N8nSubNode({ data }: any) {
  const t = (data.type || '').toLowerCase();
  const n = (data.label || '').toLowerCase();
  
  let outputId = 'main';
  if (t.includes('model') || n.includes('gpt') || n.includes('gemini')) outputId = 'ai_languageModel';
  else if (t.includes('memory') || n.includes('memory')) outputId = 'ai_memory';
  else if (t.includes('tool') || n.includes('tool')) outputId = 'ai_tool';
  else if (t.includes('parser') || n.includes('parser')) outputId = 'ai_outputParser';
  
  const sourceHandles = data.sourceHandles && data.sourceHandles.length > 0 ? data.sourceHandles : [outputId];

  return (
    <div className="relative flex flex-col items-center group w-[80px]">
      <Handle type="source" id={outputId} position={Position.Top} className="w-2 h-2 rounded-sm border-[2px] border-white dark:border-[#17181c] bg-[#888c95] -mt-[4px]" />
      
      {sourceHandles.map((id: string) => (
        id !== outputId ? <Handle key={id} type="source" id={id} position={Position.Top} className="w-1 h-1 opacity-0 absolute top-0 pointer-events-none" /> : null
      ))}
      
      <div className="w-[68px] h-[68px] bg-white dark:bg-[#23252a] rounded-[14px] flex items-center justify-center border border-[#d5d8de] dark:border-[#3a3d45] shadow-[0_4px_10px_rgba(0,0,0,0.5)] group-hover:border-[#62646a] transition-colors z-10 mt-1">
        {getIconForType(data.type, data.label, 'w-7 h-7')}
      </div>
      
      <div className="absolute top-[80px] text-center w-[160px] pointer-events-none z-20">
        <div className="text-[12px] font-bold text-gray-900 dark:text-[#f1f2f4] leading-tight drop-shadow-md">{data.label}</div>
        <div className="text-[10px] text-gray-500 dark:text-[#888c95] truncate mt-1">
          {data.label}
        </div>
      </div>
    </div>
  );
}

function AutoFitView({ 
  workflowJson, 
  fitPadding = 0.2, 
  containerRef,
  isInternalDragRef,
  readOnly
}: { 
  workflowJson: string; 
  fitPadding?: number; 
  containerRef: React.RefObject<HTMLDivElement | null>;
  isInternalDragRef: React.MutableRefObject<boolean>;
  readOnly?: boolean;
}) {
  const { fitView } = useReactFlow();
  const nodesInitialized = useNodesInitialized();
  const fittedForJsonRef = useRef<string>('');

  const doFit = useCallback(() => {
    try {
      fitView({ padding: fitPadding, duration: 0 });
    } catch (e) {
      // Ignore
    }
  }, [fitView, fitPadding]);

  // Handle workflowJson changes from parent
  useEffect(() => {
    if (!isInternalDragRef.current) {
      fittedForJsonRef.current = '';
    }
  }, [workflowJson, isInternalDragRef]);

  // When nodes are initialized or workflowJson changes
  useEffect(() => {
    if (!nodesInitialized) return;

    // For cards (readOnly=true), ALWAYS ensure it fits and centers nicely
    // For full modal (readOnly=false), fit ONCE when json changes or on mount
    if (readOnly || fittedForJsonRef.current !== workflowJson) {
      if (!isInternalDragRef.current) {
        doFit();
        fittedForJsonRef.current = workflowJson;
      }
    }
  }, [nodesInitialized, workflowJson, readOnly, doFit, isInternalDragRef]);

  // ResizeObserver for card container resizes or layout shifts
  useEffect(() => {
    if (!containerRef.current) return;

    let timer: any;
    const observer = new ResizeObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (readOnly || fittedForJsonRef.current === workflowJson) {
          if (!isInternalDragRef.current) {
            doFit();
          }
        }
      }, 50);
    });

    observer.observe(containerRef.current);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [readOnly, workflowJson, containerRef, doFit, isInternalDragRef]);

  return null;
}

function CustomCanvasToolbar({ fitPadding = 0.2 }: { fitPadding?: number }) {
  const { fitView, zoomIn, zoomOut } = useReactFlow();

  return (
    <Panel position="bottom-right" className="m-2 sm:m-4 z-30">
      <div className="flex items-center gap-0.5 sm:gap-1 bg-white/90 dark:bg-[#191b22]/90 backdrop-blur-md p-1 sm:p-1.5 rounded-lg sm:rounded-xl border border-gray-200 dark:border-white/10 shadow-2xl">
        <button
          onClick={() => fitView({ padding: fitPadding, duration: 300 })}
          className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-300 hover:text-orange-400 hover:bg-black/5 dark:hover:bg-white/10 rounded-md sm:rounded-lg transition-all flex items-center gap-1 text-[10px] sm:text-xs font-semibold"
          title="Fit to Screen"
        >
          <Maximize2 size={13} className="sm:hidden" />
          <Maximize2 size={15} className="hidden sm:block" />
          <span className="hidden sm:inline">Fit Screen</span>
        </button>
        <div className="w-[1px] h-3.5 sm:h-4 bg-white/10 mx-0.5 sm:mx-1" />
        <button
          onClick={() => zoomIn({ duration: 200 })}
          className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-300 hover:text-orange-400 hover:bg-black/5 dark:hover:bg-white/10 rounded-md sm:rounded-lg transition-all"
          title="Zoom In (+)"
        >
          <ZoomIn size={13} className="sm:hidden" />
          <ZoomIn size={16} className="hidden sm:block" />
        </button>
        <button
          onClick={() => zoomOut({ duration: 200 })}
          className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-300 hover:text-orange-400 hover:bg-black/5 dark:hover:bg-white/10 rounded-md sm:rounded-lg transition-all"
          title="Zoom Out (-)"
        >
          <ZoomOut size={13} className="sm:hidden" />
          <ZoomOut size={16} className="hidden sm:block" />
        </button>
        <button
          onClick={() => fitView({ padding: 0.1, duration: 300 })}
          className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-300 hover:text-orange-400 hover:bg-black/5 dark:hover:bg-white/10 rounded-md sm:rounded-lg transition-all"
          title="Reset Zoom"
        >
          <RotateCcw size={13} className="sm:hidden" />
          <RotateCcw size={15} className="hidden sm:block" />
        </button>
      </div>
    </Panel>
  );
}

export interface N8nWorkflowViewerProps {
  workflowJson: string;
  onWorkflowJsonChange?: (updatedJson: string) => void;
  height?: string;
  className?: string;
  readOnly?: boolean;
  showControls?: boolean;
  fitPadding?: number;
}

function N8nWorkflowViewerInner({ 
  workflowJson, 
  onWorkflowJsonChange, 
  height = '100%', 
  className = '',
  readOnly = false,
  showControls = true,
  fitPadding = 0.2
}: N8nWorkflowViewerProps) {
  const isDark = useIsDark();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInternalDragRef = useRef<boolean>(false);
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const [error, setError] = useState<string | null>(null);

  const nodeTypes = useMemo(() => ({ 
    'n8n-standard': N8nStandardNode,
    'n8n-agent': N8nAgentNode,
    'n8n-sub': N8nSubNode
  }), []);

  const handleNodeDragStop = useCallback((_event: any, draggedNode: any) => {
    isInternalDragRef.current = true;
    if (!onWorkflowJsonChange || !workflowJson) return;
    try {
      const parsed = JSON.parse(workflowJson);
      const n8nNodes = parsed.nodes || (Array.isArray(parsed) ? parsed : []);

      let modified = false;
      n8nNodes.forEach((n8nNode: any) => {
        if (n8nNode.name === draggedNode.id || n8nNode.id === draggedNode.id) {
          n8nNode.position = [Math.round(draggedNode.position.x), Math.round(draggedNode.position.y)];
          modified = true;
        }
      });

      if (modified) {
        const updatedJson = JSON.stringify(parsed, null, 2);
        onWorkflowJsonChange(updatedJson);
      }
    } catch (err) {
      /* invalid workflow JSON: keep the visual position only */
    }
  }, [onWorkflowJsonChange, workflowJson]);

  const parseAndRender = useCallback(() => {
    if (!workflowJson || !workflowJson.trim()) {
      setNodes([]);
      setEdges([]);
      setError(null);
      return;
    }

    try {
      const parsed = JSON.parse(workflowJson);
      const n8nNodes = parsed.nodes || (Array.isArray(parsed) ? parsed : []);
      const n8nConnections = parsed.connections || {};

      const rfEdges: any[] = [];
      const requiredHandles: Record<string, { source: Set<string>, target: Set<string> }> = {};

      Object.entries(n8nConnections).forEach(([sourceName, connectionTypes]: [string, any]) => {
        if (!connectionTypes || typeof connectionTypes !== 'object') return;

        Object.entries(connectionTypes).forEach(([type, targetGroups]: [string, any]) => {
          if (!Array.isArray(targetGroups)) return;

          targetGroups.forEach((targets: any, sourceIndex: number) => {
            const targetList = Array.isArray(targets) ? targets : [targets];
            
            targetList.forEach((target: any) => {
              if (!target || !target.node) return;

              let resolvedType = type;
              if (type.includes('ai_model')) resolvedType = 'ai_languageModel';
              
              const isAI = resolvedType.startsWith('ai_');
              const sHandle = resolvedType || 'main';
              const tHandle = resolvedType || 'main';

              if (!requiredHandles[sourceName]) requiredHandles[sourceName] = { source: new Set(), target: new Set() };
              requiredHandles[sourceName].source.add(sHandle);

              if (!requiredHandles[target.node]) requiredHandles[target.node] = { source: new Set(), target: new Set() };
              requiredHandles[target.node].target.add(tHandle);

              rfEdges.push({
                id: `e-${sourceName}-${target.node}-${sHandle}-${sourceIndex}-${target.index || 0}`,
                source: sourceName,
                target: target.node,
                sourceHandle: sHandle,
                targetHandle: tHandle,
                type: isAI ? 'smoothstep' : 'bezier',
                animated: false,
                style: { 
                  stroke: isAI ? '#62646a' : '#888c95', 
                  strokeWidth: isAI ? 1.5 : 2,
                  strokeDasharray: isAI ? '5 5' : 'none'
                },
                markerEnd: isAI ? undefined : {
                  type: MarkerType.ArrowClosed,
                  width: 15,
                  height: 15,
                  color: '#888c95',
                },
              });
            });
          });
        });
      });

      const rfNodes = n8nNodes.map((node: any, idx: number) => {
        const t = (node.type || '').toLowerCase();
        const n = (node.name || '').toLowerCase();
        
        let rfType = 'n8n-standard';
        if (t.includes('agent')) rfType = 'n8n-agent';
        else if (
          t.includes('model') || 
          t.includes('memory') || 
          t.includes('tool') || 
          t.includes('parser') ||
          n.includes('parser') ||
          n.includes('model') ||
          n.includes('memory') ||
          n.includes('gpt') ||
          n.includes('gemini')
        ) {
          rfType = 'n8n-sub';
        }

        const handles = requiredHandles[node.name || node.id] || { source: new Set(), target: new Set() };

        let posX = node.position?.[0];
        let posY = node.position?.[1];

        // Auto layout fallback if position array missing
        if (posX === undefined || posY === undefined) {
          posX = (idx % 4) * 220 + 80;
          posY = Math.floor(idx / 4) * 180 + 80;
        }

        return {
          id: node.name || node.id,
          position: { x: posX, y: posY },
          data: { 
            label: node.name || node.type || 'Node', 
            type: node.type || 'unknown',
            sourceHandles: Array.from(handles.source),
            targetHandles: Array.from(handles.target)
          },
          type: rfType,
        };
      });

      setNodes(rfNodes);
      setEdges(rfEdges);
      setError(null);
    } catch (e: any) {
      setError(e.message || 'Invalid JSON format');
    }
  }, [workflowJson, setNodes, setEdges]);

  useEffect(() => {
    parseAndRender();
  }, [parseAndRender]);

  return (
    <div ref={containerRef} className={`w-full relative bg-[#f4f5f7] dark:bg-[#17181c] overflow-hidden rounded-xl ${className}`} style={{ height }}>
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center p-4 bg-[#f4f5f7]/90 dark:bg-[#17181c]/90 backdrop-blur-sm z-30">
          <div className="bg-red-950/90 border border-red-800/80 text-red-200 text-xs px-4 py-3 rounded-lg flex items-center gap-2 max-w-md shadow-2xl">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
            <span>Invalid n8n JSON syntax: {error}</span>
          </div>
        </div>
      ) : null}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStop={handleNodeDragStop}
        nodesDraggable={!readOnly}
        panOnDrag={!readOnly}
        zoomOnScroll={!readOnly}
        zoomOnPinch={!readOnly}
        zoomOnDoubleClick={!readOnly}
        fitView
        fitViewOptions={{ padding: fitPadding, includeHiddenNodes: true }}
        colorMode={isDark ? "dark" : "light"}
        proOptions={{ hideAttribution: true }}
        minZoom={0.05}
        maxZoom={2.5}
      >
        <AutoFitView 
          workflowJson={workflowJson} 
          fitPadding={fitPadding} 
          containerRef={containerRef} 
          isInternalDragRef={isInternalDragRef} 
          readOnly={readOnly}
        />
        <Background variant={BackgroundVariant.Dots} gap={24} size={2} color={isDark ? "#2c2e35" : "#d3d6dc"} />
        
        {showControls && <CustomCanvasToolbar fitPadding={fitPadding} />}
      </ReactFlow>
    </div>
  );
}


function useIsDark() {
  const [dark, setDark] = useState(() => typeof document === 'undefined' || document.documentElement.classList.contains('dark'));
  useEffect(() => {
    const el = document.documentElement;
    const obs = new MutationObserver(() => setDark(el.classList.contains('dark')));
    obs.observe(el, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);
  return dark;
}

export function N8nWorkflowViewer(props: N8nWorkflowViewerProps) {
  return (
    <ReactFlowProvider>
      <N8nWorkflowViewerInner {...props} />
    </ReactFlowProvider>
  );
}
