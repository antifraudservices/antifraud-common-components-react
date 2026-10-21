import type { ChangeEvent } from 'react'

export interface CredentialProfileOption { id: string; label: string; disabled?: boolean }
export interface CredentialProfileSelectorProps { label: string; value: string; options: readonly CredentialProfileOption[]; onChange(value: string): void; disabled?: boolean; className?: string }

export function CredentialProfileSelector({ label, value, options, onChange, disabled = false, className }: CredentialProfileSelectorProps) {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => onChange(event.currentTarget.value)
  return <label className={className}><span>{label}</span><select disabled={disabled} onChange={handleChange} value={value}>{options.map(option => <option disabled={option.disabled} key={option.id} value={option.id}>{option.label}</option>)}</select></label>
}
