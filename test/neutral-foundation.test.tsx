// Flow contract: reuse shared test fixtures and canonical types; do not introduce duplicated literals.
// Flow contract: neutral hosts configure provider inheritance and action feedback; components emit opaque intentions without network, storage, subject creation or authority. PIN rejection stays nearby and clears on edits; unexpected adapter failure never opens protected content or exposes technical text.
import {render,screen,fireEvent,cleanup} from '@testing-library/react'
import {afterEach,describe,expect,it,vi} from 'vitest'
import {IndexProviderSelector,resolveActionFeedback,ActionFeedback,ProfileProtectionGateV2} from '../src/index.js'

const copy={legend:'Index provider',description:'The host supplies eligible providers.',unavailable:'The index provider is unavailable.'}
// These opaque values themselves are under test: the renderer must emit them unchanged and must not interpret them as identity or authority.
const providers=[{providerId:'first-provider',displayName:'First index'},{providerId:'second-provider',displayName:'Second index'}] as const
const pinCopy={checkingTitle:'Checking',checkingBody:'Checking profile',setupTitle:'Set up',setupBody:'Set up profile',unavailableTitle:'Unavailable',unavailableBody:'Try later',unlockTitle:'Unlock',unlockBody:'Use your profile PIN',pinLabel:'Profile PIN',pinRequired:'Enter a valid profile PIN.',invalidPin:'Incorrect PIN. Try again.',temporarilyLocked:'Wait before retrying.',unlockUnavailable:'The profile could not be opened.',unlock:'Open profile',retry:'Retry',unlockWithPasskey:'Use biometrics',usePinInstead:'Use PIN'}

afterEach(cleanup)

describe('neutral portal foundation',()=>{
 it('displays an inherited provider without a selector or provider-change intention',()=>{
  const changed=vi.fn()
  render(<IndexProviderSelector providers={providers} value={providers[0].providerId} onChange={changed} allowProviderOverride={false} copy={copy}/>)
  expect(screen.getByText(providers[0].displayName)).toBeVisible()
  expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
  expect(changed).not.toHaveBeenCalled()
 })
 it('permits an explicitly enabled provider choice and preserves the opaque selected id',()=>{
  const changed=vi.fn()
  render(<IndexProviderSelector providers={providers} value={providers[0].providerId} onChange={changed} allowProviderOverride copy={copy}/>)
  fireEvent.change(screen.getByRole('combobox',{name:copy.legend}),{target:{value:providers[1].providerId}})
  expect(changed).toHaveBeenCalledExactlyOnceWith(providers[1].providerId)
 })
 it('maps known error identifiers to supplied human copy and uses a safe fallback for unknown diagnostics',()=>{
  // A machine identifier is deliberately the input under test, not a newly defined protocol code.
  const fallback='The operation could not be completed.'
  expect(resolveActionFeedback('test_pin_invalid',{test_pin_invalid:pinCopy.invalidPin},fallback)).toBe(pinCopy.invalidPin)
  const message=resolveActionFeedback(new Error('internal_storage_diagnostic'),{},fallback)
  render(<ActionFeedback tone="error" message={message}/>)
  expect(screen.getByRole('alert')).toHaveTextContent(fallback)
  expect(screen.queryByText('internal_storage_diagnostic')).not.toBeInTheDocument()
 })
 it('contains unexpected adapter failures and permits a later successful unlock',async()=>{
  const unlock=vi.fn().mockRejectedValueOnce(new Error('internal_storage_diagnostic')).mockResolvedValueOnce('unlocked')
  render(<ProfileProtectionGateV2 state="locked" target={{eyebrow:'Profile',title:'Authorized subject'}} copy={pinCopy} onUnlock={unlock}><p>Protected content</p></ProfileProtectionGateV2>)
  fireEvent.change(screen.getByLabelText('Profile PIN'),{target:{value:'7'.repeat(6)}})
  fireEvent.click(screen.getByRole('button',{name:'Open profile'}))
  expect(await screen.findByRole('alert')).toHaveTextContent(pinCopy.unlockUnavailable)
  expect(screen.getByLabelText('Profile PIN')).toHaveAttribute('aria-invalid','false')
  expect(screen.getByRole('button',{name:'Open profile'})).toBeEnabled()
  expect(screen.queryByText('Protected content')).not.toBeInTheDocument()
  fireEvent.change(screen.getByLabelText('Profile PIN'),{target:{value:'8'.repeat(6)}})
  fireEvent.click(screen.getByRole('button',{name:'Open profile'}))
  await vi.waitFor(()=>expect(unlock).toHaveBeenCalledTimes(2))
  await vi.waitFor(()=>expect(screen.queryByRole('alert')).not.toBeInTheDocument())
 })
 it('keeps a rejected PIN associated with the field and clears stale feedback when it changes',async()=>{
  const unlock=vi.fn().mockResolvedValue('invalid-pin')
  render(<ProfileProtectionGateV2 state="locked" target={{eyebrow:'Profile',title:'Authorized subject'}} copy={pinCopy} onUnlock={unlock}><p>Protected content</p></ProfileProtectionGateV2>)
  fireEvent.change(screen.getByLabelText('Profile PIN'),{target:{value:'7'.repeat(6)}})
  fireEvent.click(screen.getByRole('button',{name:'Open profile'}))
  const alert=await screen.findByRole('alert')
  expect(alert).toHaveTextContent(pinCopy.invalidPin)
  expect(alert.closest('form')).toContainElement(screen.getByRole('button',{name:'Open profile'}))
  expect(screen.getByLabelText('Profile PIN')).toHaveAttribute('aria-invalid','true')
  fireEvent.change(screen.getByLabelText('Profile PIN'),{target:{value:'8'.repeat(6)}})
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  expect(screen.queryByText('Protected content')).not.toBeInTheDocument()
 })
})
