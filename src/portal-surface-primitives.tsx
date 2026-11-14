'use client'

import {useEffect,useState,type ReactNode,type SyntheticEvent} from 'react'

export type PortalLoadingSkeletonProps=Readonly<{label:string;rows?:number;compact?:boolean}>
/** Loading is presentation only; no domain resource or authority is invented. */
export function PortalLoadingSkeleton({label,rows=3,compact=false}:PortalLoadingSkeletonProps){
 return <section className={`uhcp-loading-skeleton${compact?' uhcp-loading-skeleton-compact':''}`} role="status" aria-busy="true" aria-live="polite"><span className="uhcp-loading-label">{label}</span><div className="uhcp-loading-heading" aria-hidden="true"/><div className="uhcp-loading-copy" aria-hidden="true"/><div className="uhcp-loading-grid" aria-hidden="true">{Array.from({length:Math.max(1,rows)},(_,index)=><div className="uhcp-loading-row" key={index}><span/><span/><span/></div>)}</div></section>
}
export type ElapsedOperationStatusProps=Readonly<{busy:boolean;status:string;fallback:string;tone?:'info'|'warning'|'success'|'error';testId?:string}>
/** The interval measures this mounted busy indication; it schedules no provider work. */
export function ElapsedOperationStatus({busy,status,fallback,tone='warning',testId}:ElapsedOperationStatusProps){
 const [seconds,setSeconds]=useState(0)
 useEffect(()=>{setSeconds(0);if(!busy)return;const start=Date.now();const timer=window.setInterval(()=>setSeconds(Math.floor((Date.now()-start)/1000)),1000);return()=>window.clearInterval(timer)},[busy])
 const message=status||(busy?fallback:'');if(!message)return null
 return <p role={tone==='error'?'alert':'status'} data-testid={testId} className={`uhcp-operation-status notice notice-${tone}`}>{message}{busy?` (${seconds}s)`:''}</p>
}
export type CollapsiblePortalSectionProps=Readonly<{title:string;description?:string;children:ReactNode;className?:string;initiallyOpen?:boolean}>
/** Preserve child form state while disclosure changes; the host owns its save action. */
export function CollapsiblePortalSection({title,description,children,className='',initiallyOpen=true}:CollapsiblePortalSectionProps){
 const [open,setOpen]=useState(initiallyOpen)
 const changed=(event:SyntheticEvent<HTMLDetailsElement>)=>setOpen(event.currentTarget.open)
 return <details className={`uhcp-disclosure research-import-disclosure ${className}`.trim()} open={open} onToggle={changed}><summary><strong>{title}</strong>{description?<span>{description}</span>:null}</summary><div className="uhcp-disclosure-content research-import-disclosure-content">{children}</div></details>
}
