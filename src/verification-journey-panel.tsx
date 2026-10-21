import type { ReactNode } from 'react'

export type VerificationJourneyPhase = 'idle' | 'waiting-for-wallet' | 'presentation-verified' | 'issuance-pending' | 'credential-issued' | 'denied' | 'failed'
export interface VerificationJourneyLabels { startPresentation: string; checkPresentation: string; requestCredential: string; checkIssuance: string; retry: string }
export interface VerificationJourneyPanelProps { phase: VerificationJourneyPhase; requestedClaims: readonly string[]; authorizationUri?: string; credentialReference?: string; errorMessage?: string; labels?: Partial<VerificationJourneyLabels>; renderQr?(authorizationUri: string): ReactNode; onStartPresentation?(): void; onRefreshPresentation?(): void; onRequestCredential?(): void; onRefreshIssuance?(): void; onRetry?(): void; className?: string }

const DEFAULT_LABELS: VerificationJourneyLabels = { startPresentation: 'Start identity presentation', checkPresentation: 'Check presentation', requestCredential: 'Request signed credential', checkIssuance: 'Check credential issuance', retry: 'Try again' }
function ActionButton({ label, onClick }: { label: string; onClick: (() => void) | undefined }) { return onClick ? <button onClick={onClick} type="button">{label}</button> : null }

export function VerificationJourneyPanel(props: VerificationJourneyPanelProps) {
  const labels = { ...DEFAULT_LABELS, ...props.labels }
  return <section aria-live="polite" className={props.className}>
    {props.requestedClaims.length ? <div><h2>Requested information</h2><ul>{props.requestedClaims.map(claim => <li key={claim}>{claim}</li>)}</ul></div> : null}
    {props.phase === 'idle' ? <div><h2>Identity presentation</h2><p>A trusted verifier will ask the wallet for the displayed information.</p><ActionButton label={labels.startPresentation} onClick={props.onStartPresentation}/></div> : null}
    {props.phase === 'waiting-for-wallet' ? <div><h2>Waiting for wallet</h2><p>Review the requested information in the wallet and approve or deny the presentation.</p>{props.authorizationUri && props.renderQr ? props.renderQr(props.authorizationUri) : null}<ActionButton label={labels.checkPresentation} onClick={props.onRefreshPresentation}/></div> : null}
    {props.phase === 'presentation-verified' ? <div><h2>Presentation verified</h2><p>The trusted verifier accepted the presentation. This does not issue a new credential. The authorized provider must read its authoritative source before signing.</p><ActionButton label={labels.requestCredential} onClick={props.onRequestCredential}/></div> : null}
    {props.phase === 'issuance-pending' ? <div><h2>Credential request pending</h2><p>The authoritative provider is validating its source and issuance policy.</p><ActionButton label={labels.checkIssuance} onClick={props.onRefreshIssuance}/></div> : null}
    {props.phase === 'credential-issued' ? <div><h2>Credential issued</h2><p>The authoritative provider issued the signed credential.</p>{props.credentialReference ? <output>{props.credentialReference}</output> : null}</div> : null}
    {props.phase === 'denied' || props.phase === 'failed' ? <div role="alert"><h2>{props.phase === 'denied' ? 'Request denied' : 'Request failed'}</h2>{props.errorMessage ? <p>{props.errorMessage}</p> : null}<ActionButton label={labels.retry} onClick={props.onRetry}/></div> : null}
  </section>
}
