import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import type { N8nWorkflowViewerProps } from './N8nWorkflowViewer';
const Viewer = lazy(() => import('./N8nWorkflowViewer').then(m => ({ default: m.N8nWorkflowViewer })));
export function N8nWorkflowViewer(props: N8nWorkflowViewerProps) {
 const ref = useRef<HTMLDivElement>(null); const [visible,setVisible]=useState(false);
 useEffect(()=>{ const observer=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){setVisible(true);observer.disconnect();}},{rootMargin:'150px'}); if(ref.current) observer.observe(ref.current);return ()=>observer.disconnect();},[]);
 return <div ref={ref} style={{height:props.height || 400,width:'100%'}}>{visible ? <Suspense fallback={<p className="p-4 text-sm">Loading workflow preview…</p>}><Viewer {...props}/></Suspense> : <p className="p-4 text-sm">n8n workflow preview</p>}</div>;
}
