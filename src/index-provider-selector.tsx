export type IndexProviderChoice = Readonly<{providerId: string; displayName: string; available?: boolean}>
export type IndexProviderSelectorCopy = Readonly<{legend: string; description: string; unavailable: string}>
export type IndexProviderSelectorProps = Readonly<{
  providers: readonly IndexProviderChoice[]
  value: string
  copy: IndexProviderSelectorCopy
  onChange?: (providerId: string) => void
  allowProviderOverride?: boolean
  disabled?: boolean
}>

/** Controlled provider presentation for any subject or sector. Eligibility, inheritance and override authorization remain host-owned. */
export function IndexProviderSelector({providers, value, copy, onChange, allowProviderOverride = true, disabled = false}: IndexProviderSelectorProps) {
  const selected = providers.find(provider => provider.providerId === value)
  return <fieldset className="afcc-index-provider-selector" disabled={disabled}>
    <legend>{copy.legend}</legend>
    <p>{copy.description}</p>
    {allowProviderOverride ? <select className="afcc-index-provider-select" aria-label={copy.legend} value={value} onChange={event => onChange?.(event.target.value)}>
      <option value="" disabled>—</option>
      {providers.map(provider => <option key={provider.providerId} value={provider.providerId} disabled={provider.available === false}>{provider.displayName}{provider.available === false ? ` — ${copy.unavailable}` : ''}</option>)}
    </select> : <>
      {selected ? <output aria-label={copy.legend}>{selected.displayName}</output> : null}
      {!selected || selected.available === false ? <p role="alert">{copy.unavailable}</p> : null}
    </>}
  </fieldset>
}
