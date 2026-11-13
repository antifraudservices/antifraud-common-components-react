'use client'

import {useId,type FormEvent,type ReactNode} from 'react'
import {ActionFeedback} from './action-feedback.js'

/** Opaque host-owned choices: rendering a value never resolves identity or grants access. */
export type PermissionEditorChoice = Readonly<{value:string;label:string;labelKey?:string;disabled?:boolean}>
export type PermissionEditorField = Readonly<{label:string;value:string;options:readonly PermissionEditorChoice[];onChange?:(value:string)=>void}>
export type PermissionEditorSelection = Readonly<{label:string;options:readonly PermissionEditorChoice[];values:readonly string[];onChange:(values:string[])=>void}>
export type PermissionRuleEditorProps = Readonly<{
 title:string;description?:string;sector?:PermissionEditorField;purpose:PermissionEditorField
 recipient:PermissionEditorField&Readonly<{fields?:ReactNode}>
 decision?:PermissionEditorField
 roles:PermissionEditorSelection
 sections:Readonly<{label:string;values:readonly string[];onChange:(values:string[])=>void;groups:readonly Readonly<{id:string;label:string;allLabel?:string;options:readonly PermissionEditorChoice[]}>[]}>
 expiry?:Readonly<{label:string;periodLabel?:string;enabled:boolean;onEnabledChange:(enabled:boolean)=>void;value:string;options:readonly PermissionEditorChoice[];onChange:(value:string)=>void;hint:string}>
 copy:Readonly<{cancel:string;submit:string;required:string}>
 translate?:(key:string,fallback:string)=>string
 onSubmit:(event:FormEvent<HTMLFormElement>)=>void;onCancel?:()=>void
 submitAction?:string;cancelAction?:string
 busy?:boolean;fieldsDisabled?:boolean;disabled?:boolean;error?:string;notice?:string;children?:ReactNode
}>

/** One controlled form. Hosts supply permitted controls, catalogs, localization and adapters; no auth, storage, policy evaluation or network calls live here. */
export function PermissionRuleEditor({title,description,sector,purpose,recipient,decision,roles,sections,expiry,copy,onSubmit,onCancel,busy=false,fieldsDisabled=false,disabled=false,error,notice,children,translate,submitAction,cancelAction}:PermissionRuleEditorProps){
 const titleId=useId(),feedbackId=useId()
 const label=(choice:PermissionEditorChoice)=>{const translated=choice.labelKey?translate?.(choice.labelKey,choice.label):undefined;return translated&&translated!==choice.labelKey?translated:choice.label}
 function field(item:PermissionEditorField){return <label className="afcc-permission-field"><span>{item.label}</span>{item.onChange?<select aria-label={item.label} value={item.value} onChange={event=>item.onChange?.(event.currentTarget.value)}><option value="" disabled>{copy.required}</option>{item.options.map(option=><option key={option.value} value={option.value} disabled={option.disabled}>{label(option)}</option>)}</select>:<output>{item.options.find(option=>option.value===item.value)?label(item.options.find(option=>option.value===item.value)!):''}</output>}</label>}
 function choices(options:readonly PermissionEditorChoice[],values:readonly string[],change:(values:string[])=>void){return <div className="afcc-permission-choices">{options.map(option=><label key={option.value}><input type="checkbox" value={option.value} checked={values.includes(option.value)} disabled={option.disabled} onChange={event=>change(event.currentTarget.checked?[...new Set([...values,option.value])]:values.filter(value=>value!==option.value))}/><span>{label(option)}</span></label>)}</div>}
 return <form className="afcc-permission-editor" aria-labelledby={titleId} aria-busy={busy} onSubmit={event=>{event.preventDefault();if(!busy&&!disabled)onSubmit(event)}}>
  <h3 id={titleId}>{title}</h3>{description?<p className="afcc-permission-description">{description}</p>:null}
  <fieldset disabled={busy||fieldsDisabled} className="afcc-permission-fields">
   {sector?field(sector):null}{field(purpose)}{field(recipient)}{recipient.fields}{decision?field(decision):null}
   <details className="afcc-permission-group"><summary>{roles.label}</summary>{choices(roles.options,roles.values,roles.onChange)}</details>
   <details className="afcc-permission-group"><summary>{sections.label}</summary>{sections.groups.map(group=>{
    const eligible=group.options.filter(option=>!option.disabled),all=eligible.length>0&&eligible.every(option=>sections.values.includes(option.value))
    return <fieldset key={group.id}><legend>{group.label}</legend>{group.allLabel?<label className="afcc-permission-select-all"><input type="checkbox" checked={all} disabled={!eligible.length} onChange={()=>{const ids=new Set(eligible.map(option=>option.value));sections.onChange(all?sections.values.filter(value=>!ids.has(value)):[...new Set([...sections.values,...ids])])}}/>{group.allLabel}</label>:null}{choices(group.options,sections.values,sections.onChange)}</fieldset>
   })}</details>
   {expiry?<div className="afcc-permission-expiry"><label><input type="checkbox" checked={expiry.enabled} onChange={event=>expiry.onEnabledChange(event.currentTarget.checked)}/>{expiry.label}</label>{expiry.enabled?field({label:expiry.periodLabel??expiry.label,value:expiry.value,options:expiry.options,onChange:expiry.onChange}):<p>{expiry.hint}</p>}</div>:null}
   {children}
  </fieldset>
   <ActionFeedback id={feedbackId} tone="error" message={error??''}/><ActionFeedback message={notice??''}/>
   <div className="afcc-permission-actions">{onCancel?<button type="button" data-portal-action={cancelAction} onClick={onCancel}>{copy.cancel}</button>:null}<button type="submit" data-portal-action={submitAction} disabled={disabled||busy} aria-describedby={error?feedbackId:undefined}>{copy.submit}</button></div>
 </form>
}
