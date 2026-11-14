import type {ProfileProtectionTargetV2} from './contracts.js'

/** Decorative placeholder only; it never represents reviewed identity evidence. */
export function ProfileIdentityIcon() {
 return <svg className="uhcp-person-icon" width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
  <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/>
  <path d="M4.5 21a7.5 7.5 0 0 1 15 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
 </svg>
}

/** Renders the exact host-selected target without choosing a profile or granting access. */
export function ProfileIdentityTarget({target}:Readonly<{target:ProfileProtectionTargetV2}>) {
 return <div className="uhcp-profile-target">
  {target.icon ? <img src={target.icon.src} alt={target.icon.alt} width={target.icon.width} height={target.icon.height}/> : <span className="uhcp-profile-target-default-icon"><ProfileIdentityIcon/></span>}
  <div className="uhcp-profile-target-content"><div className="uhcp-profile-target-copy"><strong>{target.title}</strong>{target.subtitle ? <span>{target.subtitle}</span> : null}</div>
   {target.badges?.length ? <ul className="uhcp-profile-target-badges uhcp-profile-target-badges-centered" aria-label={target.title}>{target.badges.map(badge=><li key={badge}>{badge}</li>)}</ul> : null}
   {target.details?.length ? <dl className="uhcp-profile-target-details">{target.details.map(detail=><div key={`${detail.label}:${detail.value}`}><dt>{detail.label}</dt><dd>{detail.value}</dd></div>)}</dl> : null}
  </div>
 </div>
}
