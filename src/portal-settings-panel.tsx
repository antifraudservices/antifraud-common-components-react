'use client'

import type {ReactNode} from 'react'
import {portalUiThemes,portalUiDensities,type PortalLanguageOption,type PortalMenuAction,type PortalUiTheme,type PortalUiDensity} from './contracts.js'

export type PortalSettingsCopy=Readonly<{title:string;description:string;security:string;appearance:string;theme:string;textSize:string;language:string;legal:string;themes:Readonly<Record<PortalUiTheme,string>>;densities:Readonly<Record<PortalUiDensity,string>>}>
export type PortalSettingsLink=Readonly<{id:string;label:string;href:string}>
export type PortalSettingsPanelProps=Readonly<{
 copy:PortalSettingsCopy;theme:PortalUiTheme;density:PortalUiDensity;onThemeChange:(theme:PortalUiTheme)=>void;onDensityChange:(density:PortalUiDensity)=>void
 languageOptions:readonly PortalLanguageOption[];securityActions?:readonly PortalMenuAction[];legalLinks:readonly PortalSettingsLink[];children?:ReactNode
}>

/** Displays host-controlled preferences; no browser storage, session or theme observation. */
export function PortalSettingsPanel({copy,theme,density,onThemeChange,onDensityChange,languageOptions,securityActions=[],legalLinks,children}:PortalSettingsPanelProps){
 return <main className="uhcp-settings"><header><h1>{copy.title}</h1><p>{copy.description}</p></header>
  <section><h2>{copy.security}</h2><div className="uhcp-settings-links">{securityActions.map(action=>action.href?<a key={action.id} href={action.href}>{action.label}</a>:<button type="button" key={action.id} onClick={()=>void action.onSelect?.()}>{action.label}</button>)}</div></section>
  {children}
  <section><h2>{copy.appearance}</h2><fieldset><legend>{copy.theme}</legend>{portalUiThemes.map(value=><button type="button" key={value} aria-pressed={theme===value} onClick={()=>onThemeChange(value)}>{copy.themes[value]}</button>)}</fieldset><fieldset><legend>{copy.textSize}</legend>{portalUiDensities.map(value=><button type="button" key={value} aria-pressed={density===value} onClick={()=>onDensityChange(value)}>{copy.densities[value]}</button>)}</fieldset></section>
  <section><h2>{copy.language}</h2><div className="uhcp-settings-links">{languageOptions.map(option=><a key={option.id} href={option.href} hrefLang={option.id} aria-current={option.current?'page':undefined}>{option.label}</a>)}</div></section>
  <section><h2>{copy.legal}</h2><div className="uhcp-settings-links">{legalLinks.map(link=><a key={link.id} href={link.href}>{link.label}</a>)}</div></section>
 </main>
}
