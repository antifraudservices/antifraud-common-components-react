// Flow contract: neutral entry/profile controls preserve absent host artwork and explicit identity artwork, retain the default identity affordance, and keep required passkey enrollment ahead of wallet opening; none of these UI choices authenticates a subject or changes its authority.
import {afterEach,expect,it,vi} from 'vitest'
import {cleanup,render,screen} from '@testing-library/react'
import {PortalEntryHero,ProfileProtectionGateV2,openWalletAfterRequiredPasskey,isUserVerifyingPlatformPasskeyAvailable} from '../src/index.js'
import {unillustratedBrand,routedBrand} from './fixtures/portal-brand-consumer.js'
const copy={checkingTitle:'Checking',checkingBody:'Checking profile',setupTitle:'Set up',setupBody:'Set up profile',unavailableTitle:'Unavailable',unavailableBody:'Try later',unlockTitle:'Unlock',unlockBody:'Use your profile PIN',pinLabel:'Profile PIN',pinRequired:'Enter a valid profile PIN.',invalidPin:'Incorrect PIN. Try again.',temporarilyLocked:'Wait before retrying.',unlockUnavailable:'The profile could not be opened.',unlock:'Open profile',retry:'Retry',unlockWithPasskey:'Use biometrics',usePinInstead:'Use PIN'}
afterEach(()=>{cleanup();vi.unstubAllGlobals()})
it('renders the configured entry without inventing artwork when the host provides none',()=>{
 const {container}=render(<PortalEntryHero brand={unillustratedBrand} eyebrow="Access" title="Choose access" description="Use your portal."/>)
 expect(screen.getByRole('heading',{name:'Choose access'})).toBeVisible()
 expect(container.querySelector('img')).toBeNull();expect(container.querySelector('.uhcp-hero-orbit')).toBeNull()
})
it('retains both host-supplied artwork variants and its distinct navigation metadata',()=>{
 const {container}=render(<PortalEntryHero brand={routedBrand} eyebrow="Access" title="Choose access" description="Use your portal."/>)
 expect(Array.from(container.querySelectorAll('img')).map(image=>image.getAttribute('src'))).toEqual(['/mark-light.svg','/mark-dark.svg'])
 expect(routedBrand.homeHref).toBe('/professional');expect(routedBrand.markHref).toBe('/professional/current-profile')
})
it('keeps the default identity icon when a protected target supplies no private or public image',()=>{
 const {container}=render(<ProfileProtectionGateV2 state="locked" target={{eyebrow:'Profile',title:'Selected profile'}} copy={copy}><p>Protected content</p></ProfileProtectionGateV2>)
 expect(container.querySelector('.uhcp-profile-target-default-icon svg')).not.toBeNull()
 expect(screen.getByText('Selected profile')).toBeVisible();expect(screen.queryByText('Protected content')).not.toBeInTheDocument()
})
it('uses an explicit target image without adding a second default identity icon',()=>{
 const {container}=render(<ProfileProtectionGateV2 state="locked" target={{eyebrow:'Profile',title:'Selected profile',icon:{src:'/profile.svg',alt:'Selected profile image',width:48,height:48}}} copy={copy}><p>Protected content</p></ProfileProtectionGateV2>)
 expect(screen.getByAltText('Selected profile image')).toHaveAttribute('src','/profile.svg')
 expect(container.querySelector('.uhcp-profile-target-default-icon')).toBeNull()
})
it('never opens wallet custody after rejected required enrollment and preserves successful ordering',async()=>{
 const order:string[]=[],open=vi.fn(async()=>{order.push('open');return 'opaque-session'})
 await expect(openWalletAfterRequiredPasskey({passkeyRequired:true,enroll:async()=>{throw new Error('synthetic_enrollment_rejected')},open})).rejects.toThrow('synthetic_enrollment_rejected')
 expect(open).not.toHaveBeenCalled()
 await expect(openWalletAfterRequiredPasskey({passkeyRequired:true,enroll:async()=>{order.push('enroll')},open})).resolves.toBe('opaque-session')
 expect(order).toEqual(['enroll','open'])
})
it('reports only an explicit browser capability claim and fails closed for unavailable capability',async()=>{
 vi.stubGlobal('PublicKeyCredential',undefined);await expect(isUserVerifyingPlatformPasskeyAvailable()).resolves.toBe(false)
 vi.stubGlobal('PublicKeyCredential',{isUserVerifyingPlatformAuthenticatorAvailable:async()=>{throw new Error('synthetic_browser_failure')}});await expect(isUserVerifyingPlatformPasskeyAvailable()).resolves.toBe(false)
 vi.stubGlobal('PublicKeyCredential',{isUserVerifyingPlatformAuthenticatorAvailable:async()=>true});await expect(isUserVerifyingPlatformPasskeyAvailable()).resolves.toBe(true)
})
