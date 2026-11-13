// Flow contract: hosts control phone/code, confirmation state, copy and adapter intentions. The neutral renderer never authenticates, sends OTPs, mutates account claims or owns a verification service.
import {cleanup, fireEvent, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {PhoneSignInStep, PortalSignInPanel} from '../src/index.js'

afterEach(cleanup)
beforeEach(() => vi.clearAllMocks())
const copy = {number: 'Your mobile number', code: '6-digit code', send: 'Send Verification Code', verify: 'Verify Code', change: 'Change phone'}
// Opaque host inputs: phone normalization belongs to the host adapter, never this renderer.
const props = {number: 'host-contact', code: '', requested: false, copy,
  onNumberChange: vi.fn(), onCodeChange: vi.fn(),
  onRequest: vi.fn((event: {preventDefault(): void}) => event.preventDefault()),
  onVerify: vi.fn((event: {preventDefault(): void}) => event.preventDefault()), onCancel: vi.fn(),
  verifier: <div id="host-verification-element" data-testid="host-verifier"/>}
const portalCopy = {eyebrow: 'Access', title: 'Sign in', description: 'Use your account.', provider: 'Continue with provider', separator: 'or',
  email: 'Email', sendEmailCode: 'Send email code', emailCode: 'Email code', verifyEmailCode: 'Verify email code', changeEmail: 'Change email',
  emailCodeSent: 'Code sent to {email}', passkeyHint: 'Use enrolled passkey', passkey: 'Use passkey', demoEmail: 'Demo email', demoCode: 'Demo code',
  demoSubmit: 'Enter Demo', demoHint: 'Synthetic only', busy: 'Connecting'}

describe('neutral phone sign-in step', () => {
  it('renders only host copy and emits phone/send intentions without advancing itself', () => {
    render(<PhoneSignInStep {...props}/>)
    const number = screen.getByLabelText(copy.number)
    expect(number).toHaveAttribute('type', 'tel')
    expect(number).toHaveAttribute('autoComplete', 'tel')
    fireEvent.change(number, {target: {value: 'changed-contact'}})
    expect(props.onNumberChange).toHaveBeenCalledWith('changed-contact')
    fireEvent.click(screen.getByRole('button', {name: copy.send}))
    expect(props.onRequest).toHaveBeenCalledOnce()
    expect(screen.queryByLabelText(copy.code)).not.toBeInTheDocument()
    expect(screen.getByTestId('host-verifier')).toHaveAttribute('id', 'host-verification-element')
  })

  it('locks the requested number, sanitizes code intentions and requires six digits to verify', () => {
    const {rerender} = render(<PhoneSignInStep {...props} requested code="123"/>)
    expect(screen.getByLabelText(copy.number)).toBeDisabled()
    expect(screen.getByLabelText(copy.code)).toBeEnabled()
    expect(screen.getByLabelText(copy.code)).toHaveAttribute('autoComplete', 'one-time-code')
    expect(screen.getByRole('button', {name: copy.verify})).toBeDisabled()
    fireEvent.change(screen.getByLabelText(copy.code), {target: {value: '92x4618extra'}})
    expect(props.onCodeChange).toHaveBeenCalledWith('924618')
    rerender(<PhoneSignInStep {...props} requested code="924618"/>)
    fireEvent.click(screen.getByRole('button', {name: copy.verify}))
    expect(props.onVerify).toHaveBeenCalledOnce()
    fireEvent.click(screen.getByRole('button', {name: copy.change}))
    expect(props.onCancel).toHaveBeenCalledOnce()
    // A cancel intention cannot erase the host's still-pending confirmation on its own.
    expect(screen.getByLabelText(copy.code)).toHaveValue('924618')
  })

  it('keeps the pending code editable after a host-reported wrong OTP', () => {
    render(<PhoneSignInStep {...props} requested code="111111" error="That code was not accepted. Try again." notice="Use the code for this phone."/>)
    expect(screen.getByRole('alert')).toHaveTextContent('That code was not accepted. Try again.')
    expect(screen.getByRole('status')).toHaveTextContent('Use the code for this phone.')
    expect(screen.getByLabelText(copy.code)).toHaveValue('111111')
    expect(screen.getByLabelText(copy.code)).toBeEnabled()
    expect(props.onCancel).not.toHaveBeenCalled()
  })

  it.each([{busy: true}, {disabled: true}])('disables every edit and intention when unavailable (%o)', state => {
    render(<PhoneSignInStep {...props} {...state} requested code="924618"/>)
    expect(screen.getByLabelText(copy.number)).toBeDisabled()
    expect(screen.getByLabelText(copy.code)).toBeDisabled()
    expect(screen.getByRole('button', {name: copy.verify})).toBeDisabled()
    expect(screen.getByRole('button', {name: copy.change})).toBeDisabled()
    fireEvent.click(screen.getByRole('button', {name: copy.verify}))
    expect(props.onVerify).not.toHaveBeenCalled()
  })

  it('inherits a parent fieldset lock without emitting a request', async () => {
    render(<fieldset disabled><PhoneSignInStep {...props}/></fieldset>)
    expect(screen.getByLabelText(copy.number)).toBeDisabled()
    expect(screen.getByRole('button', {name: copy.send})).toBeDisabled()
    await userEvent.click(screen.getByRole('button', {name: copy.send}))
    expect(props.onRequest).not.toHaveBeenCalled()
  })

  it('composes through the optional portal phone slot as a sibling form, preserving existing methods', () => {
    const {container} = render(<PortalSignInPanel mode="trusted" copy={portalCopy} email="" emailCode=""
      onEmailChange={vi.fn()} onEmailCodeChange={vi.fn()} onProvider={vi.fn()} onRequestEmailCode={vi.fn()}
      phone={<PhoneSignInStep {...props}/>}/>)
    expect(screen.getByLabelText(copy.number)).toBeInTheDocument()
    expect(screen.getByLabelText(portalCopy.email)).toHaveValue('')
    expect(screen.getByRole('button', {name: portalCopy.provider})).toBeInTheDocument()
    expect(container.querySelectorAll('form')).toHaveLength(2)
    expect(container.querySelector('form form')).toBeNull()
  })
})
