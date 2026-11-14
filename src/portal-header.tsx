'use client'

import {useEffect,useId,useRef,useState,type ReactNode} from 'react'
import {portalUiThemes,portalUiDensities,type PortalBrand,type PortalShellCopy,type PortalAccountOption,type PortalLanguageOption,type PortalMenuAction,type PortalUiTheme,type PortalUiDensity} from './contracts.js'
import {PortalBrandArtwork} from './portal-brand-artwork.js'
import {ProfileIdentityIcon} from './profile-identity-target.js'

export type PortalHeaderProps=Readonly<{
 brand:PortalBrand;copy:PortalShellCopy;guestActionHref:string;accountIdentifier?:string|null
 theme:PortalUiTheme;density:PortalUiDensity;onThemeChange?:(theme:PortalUiTheme)=>void;onDensityChange?:(density:PortalUiDensity)=>void
 languageHref?:string;languageOptions?:readonly PortalLanguageOption[];languageInPreferences?:boolean;onLanguageSelect?:(href:string)=>void
 accountOptions?:readonly PortalAccountOption[];onSelectAccount?:(id:string)=>void;menuActions?:readonly PortalMenuAction[]
 onSignOut?:()=>void|Promise<void>;currentSubject?:ReactNode
}>

/** Controlled account/preferences presentation; persistence and browser theme effects belong to the host. */
export function PortalHeader({brand,copy,guestActionHref,accountIdentifier,theme,density,onThemeChange,onDensityChange,languageHref,languageOptions=[],languageInPreferences=false,onLanguageSelect,accountOptions=[],onSelectAccount,menuActions=[],onSignOut,currentSubject}:PortalHeaderProps){
 const [open,setOpen]=useState(false),container=useRef<HTMLDivElement>(null),menuId=useId()
 const signedIn=Boolean(accountIdentifier)
 useEffect(()=>{
  const outside=(event:MouseEvent)=>{if(!container.current?.contains(event.target as Node))setOpen(false)}
  const escape=(event:KeyboardEvent)=>{if(event.key==='Escape'){setOpen(false)}}
  document.addEventListener('mousedown',outside);document.addEventListener('keydown',escape)
  return()=>{document.removeEventListener('mousedown',outside);document.removeEventListener('keydown',escape)}
 },[])
 const brandCopy=<span><strong>{brand.productName}</strong><small className={accountIdentifier?'uhcp-brand-account':undefined}>{accountIdentifier||brand.organizationName}</small></span>
 return <header className="uhcp-header" style={brand.variables}>
  {brand.mark&&brand.markHref ? <div className="uhcp-brand"><a className="uhcp-brand-mark-link" href={brand.markHref} aria-label={brand.productName}><PortalBrandArtwork artwork={brand.mark} className="uhcp-brand-mark"/></a><a className="uhcp-brand-copy" href={brand.homeHref} aria-label={copy.home}>{brandCopy}</a></div>
   :<a className="uhcp-brand" href={brand.homeHref} aria-label={copy.home}>{brand.mark?<PortalBrandArtwork artwork={brand.mark} className="uhcp-brand-mark"/>:null}{brandCopy}</a>}
  {currentSubject}
  <div className="uhcp-account-menu" ref={container}><button type="button" className="uhcp-trigger" aria-label={copy.accountAndPreferences} aria-expanded={open} aria-controls={menuId} onClick={()=>setOpen(value=>!value)}><ProfileIdentityIcon/></button>
   {open?<section id={menuId} className="uhcp-menu" aria-label={copy.accountAndPreferences}>
    <div className="uhcp-account-state"><strong>{copy.accountAndPreferences}</strong><small>{accountIdentifier||copy.notSignedIn}</small></div>
    {signedIn&&accountOptions.length?<div className="uhcp-account-options">{accountOptions.map(option=><button type="button" key={option.id} disabled={option.disabled} aria-pressed={Boolean(option.selected)} onClick={()=>{onSelectAccount?.(option.id);setOpen(false)}}><span>{option.label}</span>{option.description?<small>{option.description}</small>:null}</button>)}</div>:null}
    <fieldset className="uhcp-preferences"><legend>{copy.appearance}</legend><div>{portalUiThemes.map(value=><button type="button" key={value} aria-pressed={theme===value} onClick={()=>onThemeChange?.(value)}><span aria-hidden="true">{value==='light'?'\u2600':value==='dark'?'\u263e':'\u25eb'}</span>{copy.themes[value]}</button>)}</div></fieldset>
    <fieldset className="uhcp-preferences"><legend>{copy.textSize}</legend><div>{portalUiDensities.map(value=><button type="button" key={value} aria-pressed={density===value} onClick={()=>onDensityChange?.(value)}>{value==='small'?'S':value==='medium'?'M':'L'}</button>)}</div></fieldset>
    <div className="uhcp-menu-actions">
     {!signedIn||languageInPreferences ? languageOptions.length ? <label className="uhcp-language-select"><span>{copy.language}</span><select aria-label={copy.language} value={languageOptions.find(option=>option.current)?.href??languageOptions[0]?.href} onChange={event=>{onLanguageSelect?.(event.currentTarget.value);setOpen(false)}}>{languageOptions.map(option=><option key={option.id} value={option.href}>{option.label}</option>)}</select></label> : languageHref?<a href={languageHref} onClick={()=>setOpen(false)}>{copy.language}</a>:null : null}
     {signedIn?menuActions.map(action=>action.href?<a key={action.id} href={action.href} onClick={()=>setOpen(false)}>{action.label}</a>:<button type="button" key={action.id} onClick={()=>{setOpen(false);void action.onSelect?.()}}>{action.label}</button>):null}
     {signedIn&&onSignOut?<button type="button" onClick={()=>{setOpen(false);void onSignOut()}}>{copy.signOut}</button>:<a href={guestActionHref} onClick={()=>setOpen(false)}><ProfileIdentityIcon/>{copy.chooseAccess}</a>}
    </div>
   </section>:null}
  </div>
 </header>
}
