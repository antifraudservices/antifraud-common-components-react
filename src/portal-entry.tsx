import type { PortalAccessOption, PortalBrand } from './contracts.js'
import { PortalBrandArtwork } from './portal-brand-artwork.js'

export function PortalEntryHero({ brand, eyebrow, title, description }: Readonly<{ brand: PortalBrand; eyebrow: string; title: string; description: string }>) {
  const artwork = brand.heroArtwork ?? brand.mark
  return <section className="uhcp-entry-hero" style={brand.variables}>{artwork ? <div className="uhcp-hero-orbit" aria-hidden="true"><PortalBrandArtwork artwork={artwork} className="uhcp-hero-logo"/></div> : null}<div className="uhcp-entry-copy"><div className="uhcp-badge">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div></section>
}

export function PortalAccessChooser({ label, options }: Readonly<{ label: string; options: readonly PortalAccessOption[] }>) {
  return <nav className="uhcp-access-grid" aria-label={label}>{options.map((option, index) => <a className="uhcp-access-card" href={option.href} key={option.id}><span className="uhcp-access-number">{String(index + 1).padStart(2, '0')}</span><strong>{option.title}</strong><span>{option.description}</span><small>{option.requirement}</small></a>)}</nav>
}
