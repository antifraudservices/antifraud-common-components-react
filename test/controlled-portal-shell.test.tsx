// Flow contract: domain-neutral shell renderers display host-supplied identity, navigation and preferences and emit exact intentions; they never read/write browser storage, apply document themes, authenticate, persist or fetch. Loading, elapsed status and collapsible form state retain their accessible behavior without becoming business authority.
import {afterEach,expect,it,vi} from 'vitest'
import {act,cleanup,fireEvent,render,screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {PortalHeader,PortalSettingsPanel,PortalLoadingSkeleton,ElapsedOperationStatus,CollapsiblePortalSection,ProfileIdentityTarget,type PortalShellCopy,type PortalSettingsCopy} from '../src/index.js'
import {unillustratedBrand,routedBrand} from './fixtures/portal-brand-consumer.js'
const themes={light:'Light',dark:'Dark',system:'System'}
const copy:PortalShellCopy={home:'Home',accountAndPreferences:'Account and preferences',notSignedIn:'Not signed in',appearance:'Appearance',textSize:'Text size',themes,language:'Language',chooseAccess:'Choose access',signOut:'Sign out'}
const settingsCopy:PortalSettingsCopy={title:'Preferences',description:'Device preferences',security:'Security',appearance:'Appearance',theme:'Theme',textSize:'Text size',language:'Language',legal:'Legal',themes,densities:{small:'Small',medium:'Medium',large:'Large'}}
afterEach(()=>{cleanup();vi.useRealTimers();vi.restoreAllMocks();vi.unstubAllGlobals();delete document.documentElement.dataset.theme;delete document.documentElement.dataset.density})
function forbidAdapters(){
 const read=vi.spyOn(Storage.prototype,'getItem').mockImplementation(()=>{throw new Error('renderer_must_not_read_storage')})
 const write=vi.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw new Error('renderer_must_not_write_storage')})
 const request=vi.fn(()=>{throw new Error('renderer_must_not_fetch')});vi.stubGlobal('fetch',request)
 document.documentElement.dataset.theme='host-theme';document.documentElement.dataset.density='host-density'
 return ()=>{expect(read).not.toHaveBeenCalled();expect(write).not.toHaveBeenCalled();expect(request).not.toHaveBeenCalled();expect(document.documentElement.dataset.theme).toBe('host-theme');expect(document.documentElement.dataset.density).toBe('host-density')}
}
it('emits theme and density intentions while keeping host-controlled selection until readback',async()=>{
 const unchanged=forbidAdapters(),onThemeChange=vi.fn(),onDensityChange=vi.fn()
 const props={brand:routedBrand,copy,guestActionHref:'/access',accountIdentifier:'signed-in-account',theme:'dark' as const,density:'medium' as const,onThemeChange,onDensityChange,currentSubject:<button>Selected subject</button>}
 const view=render(<PortalHeader {...props}/>);await userEvent.click(screen.getByRole('button',{name:copy.accountAndPreferences}))
 expect(screen.getByRole('button',{name:'Dark'})).toHaveAttribute('aria-pressed','true')
 await userEvent.click(screen.getByRole('button',{name:'Light'}));await userEvent.click(screen.getByRole('button',{name:'L'}))
 expect(onThemeChange).toHaveBeenCalledExactlyOnceWith('light');expect(onDensityChange).toHaveBeenCalledExactlyOnceWith('large')
 expect(screen.getByRole('button',{name:'Dark'})).toHaveAttribute('aria-pressed','true')
 view.rerender(<PortalHeader {...props} theme="light" density="large"/>)
 expect(screen.getByRole('button',{name:'Light'})).toHaveAttribute('aria-pressed','true');expect(screen.getByRole('button',{name:'L'})).toHaveAttribute('aria-pressed','true')
 expect(screen.getByRole('button',{name:'Selected subject'})).toBeVisible();unchanged()
})
it('keeps account selection, disabled accounts and sign-out as exact host callbacks',async()=>{
 const onSelectAccount=vi.fn(),onSignOut=vi.fn(),onSelectAction=vi.fn()
 render(<PortalHeader brand={routedBrand} copy={copy} guestActionHref="/access" accountIdentifier="signed-in-account" theme="system" density="medium" accountOptions={[{id:'active-profile',label:'Active profile',selected:true},{id:'another-profile',label:'Another profile'},{id:'unavailable-profile',label:'Unavailable profile',disabled:true}]} onSelectAccount={onSelectAccount} onSignOut={onSignOut} menuActions={[{id:'open-preferences',label:'Open preferences',onSelect:onSelectAction}]}/>)
 const open=()=>userEvent.click(screen.getByRole('button',{name:copy.accountAndPreferences}));await open()
 await userEvent.click(screen.getByRole('button',{name:'Unavailable profile'}));expect(onSelectAccount).not.toHaveBeenCalled()
 await userEvent.click(screen.getByRole('button',{name:'Another profile'}));expect(onSelectAccount).toHaveBeenCalledExactlyOnceWith('another-profile')
 await open();await userEvent.click(screen.getByRole('button',{name:'Open preferences'}));expect(onSelectAction).toHaveBeenCalledOnce()
 await open();await userEvent.click(screen.getByRole('button',{name:/Sign out/u}));expect(onSignOut).toHaveBeenCalledOnce()
})
it('preserves separate mark/home routes and guest language/access navigation without authenticating',async()=>{
 const onLanguageSelect=vi.fn(),onSignOut=vi.fn()
 render(<PortalHeader brand={routedBrand} copy={copy} guestActionHref="/access" theme="system" density="medium" onSignOut={onSignOut} onLanguageSelect={onLanguageSelect} languageOptions={[{id:'en',label:'English',href:'/en',current:true},{id:'es',label:'Spanish',href:'/es'}]}/>)
 expect(screen.getByRole('link',{name:routedBrand.productName})).toHaveAttribute('href',routedBrand.markHref)
 expect(screen.getByRole('link',{name:'Home'})).toHaveAttribute('href',routedBrand.homeHref)
 await userEvent.click(screen.getByRole('button',{name:copy.accountAndPreferences}));expect(screen.queryByRole('button',{name:/Sign out/u})).not.toBeInTheDocument()
 expect(screen.getByRole('link',{name:/Choose access/u})).toHaveAttribute('href','/access')
 await userEvent.selectOptions(screen.getByRole('combobox',{name:'Language'}),'/es');expect(onLanguageSelect).toHaveBeenCalledExactlyOnceWith('/es');expect(onSignOut).not.toHaveBeenCalled()
})
it('keeps a keyboard-dismissable account menu and permits headers without brand artwork',async()=>{
 render(<PortalHeader brand={unillustratedBrand} copy={copy} guestActionHref="/access" theme="light" density="small"/>)
 const trigger=screen.getByRole('button',{name:copy.accountAndPreferences});expect(trigger).toHaveAttribute('aria-expanded','false')
 trigger.focus();await userEvent.keyboard('{Enter}');expect(trigger).toHaveAttribute('aria-expanded','true')
 await userEvent.keyboard('{Escape}');expect(trigger).toHaveAttribute('aria-expanded','false')
 expect(screen.getByRole('link',{name:'Home'})).toHaveAttribute('href',unillustratedBrand.homeHref)
})
it('renders preferences as controlled intentions with supplied security, language, legal and extension controls',async()=>{
 const unchanged=forbidAdapters(),onThemeChange=vi.fn(),onDensityChange=vi.fn(),security=vi.fn()
 render(<PortalSettingsPanel copy={settingsCopy} theme="dark" density="medium" onThemeChange={onThemeChange} onDensityChange={onDensityChange} languageOptions={[{id:'en',label:'English',href:'/en',current:true}]} securityActions={[{id:'security',label:'Manage security',onSelect:security}]} legalLinks={[{id:'terms',label:'Terms',href:'/terms'}]}><button>Host preference</button></PortalSettingsPanel>)
 await userEvent.click(screen.getByRole('button',{name:'Light'}));await userEvent.click(screen.getByRole('button',{name:'Large'}));await userEvent.click(screen.getByRole('button',{name:'Manage security'}))
 expect(onThemeChange).toHaveBeenCalledExactlyOnceWith('light');expect(onDensityChange).toHaveBeenCalledExactlyOnceWith('large');expect(security).toHaveBeenCalledOnce()
 expect(screen.getByRole('button',{name:'Dark'})).toHaveAttribute('aria-pressed','true')
 expect(screen.getByRole('link',{name:'English'})).toHaveAttribute('aria-current','page');expect(screen.getByRole('link',{name:'Terms'})).toHaveAttribute('href','/terms');expect(screen.getByRole('button',{name:'Host preference'})).toBeVisible();unchanged()
})
it('announces host loading without displaying invented business records',()=>{
 render(<PortalLoadingSkeleton label="Reading selected workspace" rows={2}/>)
 expect(screen.getByRole('status')).toHaveAttribute('aria-busy','true');expect(screen.getByRole('status')).toHaveTextContent('Reading selected workspace')
})
it('counts only the current busy presentation and stops its interval when work ends',()=>{
 vi.useFakeTimers();const view=render(<ElapsedOperationStatus busy status="" fallback="Reading workspace"/>)
 act(()=>vi.advanceTimersByTime(2000));expect(screen.getByRole('status')).toHaveTextContent('Reading workspace (2s)')
 view.rerender(<ElapsedOperationStatus busy={false} status="Saved" fallback="Reading workspace"/>);expect(screen.getByRole('status')).toHaveTextContent('Saved');expect(screen.getByRole('status')).not.toHaveTextContent('(2s)');expect(vi.getTimerCount()).toBe(0)
})
it('collapses a mounted form without discarding an entered draft',async()=>{
 const {container}=render(<CollapsiblePortalSection title="Review draft"><input aria-label="Draft note" defaultValue=""/></CollapsiblePortalSection>)
 await userEvent.type(screen.getByLabelText('Draft note'),'Retained draft')
 const details=container.querySelector('details')!;details.open=false;fireEvent(details,new Event('toggle'))
 expect(screen.getByDisplayValue('Retained draft')).toBeInTheDocument();expect(details.open).toBe(false)
})
it('renders the same neutral target identity, badges and details without a second glyph implementation',()=>{
 const target={eyebrow:'Profile',title:'Selected profile',subtitle:'Host context',badges:['Assigned role'],details:[{label:'Organization',value:'Selected organization'}]}
 const {container,rerender}=render(<ProfileIdentityTarget target={target}/>);expect(container.querySelector('.uhcp-profile-target-default-icon svg')).not.toBeNull();expect(screen.getByText('Assigned role')).toBeVisible();expect(screen.getByText('Selected organization')).toBeVisible()
 rerender(<ProfileIdentityTarget target={{...target,icon:{src:'/profile.svg',alt:'Selected profile image',width:48,height:48}}}/>);expect(screen.getByAltText('Selected profile image')).toHaveAttribute('src','/profile.svg');expect(container.querySelector('.uhcp-profile-target-default-icon')).toBeNull()
})
