'use client'

import type { FormEvent, ReactNode } from 'react'

export type PhoneSignInStepProps = Readonly<{
  number: string
  code: string
  requested: boolean
  busy?: boolean
  disabled?: boolean
  error?: string
  notice?: string
  verifier?: ReactNode
  copy: Readonly<{number: string; code: string; send: string; verify: string; change: string}>
  onNumberChange(value: string): void
  onCodeChange(value: string): void
  onRequest(event: FormEvent<HTMLFormElement>): void | Promise<void>
  onVerify(event: FormEvent<HTMLFormElement>): void | Promise<void>
  onCancel(): void
}>

/** The host owns verification, confirmation state and all account operations. */
export function PhoneSignInStep({number, code, requested, busy = false, disabled = false,
  error, notice, verifier, copy, onNumberChange, onCodeChange, onRequest, onVerify, onCancel}: PhoneSignInStepProps) {
  const unavailable = busy || disabled
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (unavailable || (requested && !/^\d{6}$/.test(code))) return
    return requested ? onVerify(event) : onRequest(event)
  }
  return <form onSubmit={submit} aria-busy={busy || undefined}>
    <fieldset disabled={unavailable} className="uhcp-phone-sign-in-fields">
      <label>{copy.number}<input type="tel" autoComplete="tel" value={number} required
        disabled={requested} onChange={event => onNumberChange(event.target.value)}/></label>
      {requested ? <label>{copy.code}<input type="text" inputMode="numeric" autoComplete="one-time-code"
        pattern="[0-9]{6}" minLength={6} maxLength={6} required value={code}
        onChange={event => onCodeChange(event.target.value.replace(/\D/g, '').slice(0, 6))}/></label> : null}
      {verifier}
      {notice ? <p role="status">{notice}</p> : null}
      {error ? <p className="uhcp-error" role="alert">{error}</p> : null}
      <button type="submit" disabled={requested && !/^\d{6}$/.test(code)}>{requested ? copy.verify : copy.send}</button>
      {requested ? <button type="button" className="uhcp-secondary" onClick={onCancel}>{copy.change}</button> : null}
    </fieldset>
  </form>
}
