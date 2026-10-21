// Flow contract: health, veterinary, qualification, controller and marketplace hosts reuse identical entry, sign-in, profile protection and identity-evidence presentation while every adapter, tenant and authority decision remains in the host.
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { IdentityEvidenceEditor, PortalAccessChooser, PortalEntryHero, PortalSignInPanel, ProfileProtectionGateV2, type IdentityEvidenceEditorCopy, type PortalBrand } from '../src/index.js'

const artwork = { lightSurface: { src: '/mark.svg', alt: 'Mark', width: 48, height: 48 }, darkSurface: { src: '/mark.svg', alt: 'Mark', width: 48, height: 48 } }
const brand = (family: PortalBrand['family']): PortalBrand => ({ family, productName: 'Portal', organizationName: 'Organization', homeHref: '/', mark: artwork })

describe('common portal flows', () => {
  it('supports every host family with real access routes', () => {
    for (const family of ['personal', 'professional', 'controller', 'marketplace'] as const) {
      const { unmount } = render(<><PortalEntryHero brand={brand(family)} eyebrow="Access" title="Choose access" description="Separate environments."/><PortalAccessChooser label="Access modes" options={[{ id: 'demo', href: '/demo', title: 'Demo', description: 'Example', requirement: 'Demo identity' }]}/></>)
      expect(screen.getByRole('link', { name: /Demo/u })).toHaveAttribute('href', '/demo')
      unmount()
    }
  })

  it('emits provider and biometric unlock intentions without implementing either adapter', async () => {
    const provider = vi.fn(); const passkey = vi.fn()
    render(<><PortalSignInPanel mode="trusted" copy={{ eyebrow: 'Access', title: 'Sign in', description: 'Use a verified identity.', provider: 'Continue with provider', separator: 'or', email: 'Email', sendEmailCode: 'Send code', emailCode: 'Code', verifyEmailCode: 'Verify', changeEmail: 'Change', emailCodeSent: 'Sent to {email}', passkeyHint: 'Use enrolled passkey', passkey: 'Use passkey', demoEmail: 'Demo email', demoCode: 'Demo code', demoSubmit: 'Enter demo', demoHint: 'Synthetic only', busy: 'Connecting' }} email="" emailCode="" busy={false} providerEnabled onEmailChange={vi.fn()} onEmailCodeChange={vi.fn()} onProvider={provider} onRequestEmailCode={vi.fn()} onPasskey={passkey}/><ProfileProtectionGateV2 state="locked" target={{ eyebrow: 'Profile', title: 'Organization controller' }} copy={{ checkingTitle: 'Checking', checkingBody: 'Checking profile', setupTitle: 'Set up', setupBody: 'Set up profile', unavailableTitle: 'Unavailable', unavailableBody: 'Try later', unlockTitle: 'Unlock', unlockBody: 'Use biometrics', pinLabel: 'PIN', pinRequired: 'PIN required', invalidPin: 'Invalid PIN', temporarilyLocked: 'Locked', unlockUnavailable: 'Unavailable', unlock: 'Unlock', retry: 'Retry', unlockWithPasskey: 'Unlock with biometrics', usePinInstead: 'Use PIN instead' }} onPasskeyUnlock={passkey}><p>Protected</p></ProfileProtectionGateV2></>)
    await userEvent.click(screen.getByRole('button', { name: 'Continue with provider' }))
    await userEvent.click(screen.getByRole('button', { name: 'Unlock with biometrics' }))
    expect(provider).toHaveBeenCalledOnce(); expect(passkey).toHaveBeenCalledOnce()
    expect(screen.queryByText('Protected')).not.toBeInTheDocument()
  })

  it('emits a neutral identity-evidence statement', async () => {
    const onSubmit = vi.fn(); const copy: IdentityEvidenceEditorCopy = { title: 'Evidence', description: 'Record review', subject: 'Subject', selectSubject: 'Select', target: 'Target', subjectIdentity: 'Identity', relationship: 'Relationship', ageOver: 'Age over', relationshipEvidence: 'Relationship evidence', relatedSubject: 'Related subject', selectRelatedSubject: 'Select related', relationshipType: 'Relationship type', agePredicate: 'Age predicate', ageThreshold: 'Threshold', meetsThreshold: 'Meets threshold', ageProfileHint: 'Age rule', checkReference: 'Check reference', submit: 'Record evidence' }
    render(<IdentityEvidenceEditor copy={copy} subjects={[{ reference: 'subject-1', label: 'Subject One' }]} onSubmit={onSubmit}/>)
    await userEvent.selectOptions(screen.getByLabelText('Subject'), 'subject-1')
    await userEvent.type(screen.getByLabelText('Check reference'), 'check-1')
    await userEvent.click(screen.getByRole('button', { name: 'Record evidence' }))
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ subjectReference: 'subject-1', checkReference: 'check-1' }))
  })
})
