'use client'
import {useId,useState} from 'react'
import type {PermissionEditorSelection} from './permission-rule-editor.js'

/** Search only filters rendering. Hidden host-selected values remain selected. */
export function PermissionChoicePicker({label,filterLabel,removeLabel,options,values,onChange}:PermissionEditorSelection&Readonly<{filterLabel:string;removeLabel:string}>){
 const [filter,setFilter]=useState(''),id=useId(),query=filter.trim().toLocaleLowerCase()
 const visible=options.filter(option=>!query||`${option.label} ${option.value}`.toLocaleLowerCase().includes(query))
 return <fieldset className="afcc-permission-picker"><legend>{label}</legend>
  <label htmlFor={id}>{filterLabel}</label><input id={id} type="search" value={filter} onChange={event=>setFilter(event.currentTarget.value)}/>
  <ul className="afcc-permission-chips">{options.filter(option=>values.includes(option.value)).map(option=><li key={option.value}><button type="button" disabled={option.disabled} aria-label={`${removeLabel} ${option.label}`} onClick={()=>onChange(values.filter(value=>value!==option.value))}>{option.label} ×</button></li>)}</ul>
  <div className="afcc-permission-picker-options">{visible.map(option=><label key={option.value}><input type="checkbox" value={option.value} checked={values.includes(option.value)} disabled={option.disabled} onChange={event=>onChange(event.currentTarget.checked?[...new Set([...values,option.value])]:values.filter(value=>value!==option.value))}/>{option.label}</label>)}</div>
 </fieldset>
}
