// Flow contract: reuse shared test fixtures and canonical types; do not introduce duplicated literals.
// Hosts supply eligible opaque choices and verified context. One controlled form renders controller, professional, member and assisted views; collapsing never discards input or grants authority.
import {cleanup,fireEvent,render,screen,within} from '@testing-library/react'
import {afterEach,describe,expect,it,vi} from 'vitest'
import {useState} from 'react'
import {PermissionRuleEditor} from '../src/index.js'
afterEach(cleanup)
// These opaque values and exact human labels are deliberately the renderer's contract under test, not identity or policy fixtures.
const choices=[{value:'first',label:'First choice'},{value:'second',label:'Second choice'}]
function Example({controller=false,assisted=false,locked=false,actions=false}:{controller?:boolean;assisted?:boolean;locked?:boolean;actions?:boolean}){
 const [roles,setRoles]=useState<string[]>([]),[sections,setSections]=useState<string[]>([]),[expiry,setExpiry]=useState(''),[enabled,setEnabled]=useState(false)
 return <PermissionRuleEditor {...actions?{submitAction:'fixture-save',cancelAction:'fixture-cancel',onCancel:vi.fn()}: {}} fieldsDisabled={locked} title="Permission" description={assisted?'Controller approval required.':'Choose the access scope.'} sector={{label:'Sector',value:'first',options:[choices[0]!]}} purpose={{label:'Purpose',value:'first',options:choices,onChange:vi.fn()}} recipient={{label:'Recipient',value:'first',options:controller?choices:[choices[0]!],onChange:vi.fn(),fields:<label>Recipient address<input/></label>}} {...controller?{decision:{label:'Decision',value:'first',options:choices,onChange:vi.fn()}}:{}} roles={{label:'Roles',options:choices,values:roles,onChange:setRoles}} sections={{label:'Sections',values:sections,onChange:setSections,groups:[{id:'summary',label:'Complete summary',allLabel:'All summary sections',options:choices}]}} expiry={{label:'Add expiry',enabled,onEnabledChange:setEnabled,value:expiry,onChange:setExpiry,options:[{value:'hour',label:'One hour'},{value:'day',label:'One day'},{value:'month',label:'One month'},{value:'year',label:'One year'}],hint:'No expiry until revoked.'}} copy={{cancel:'Cancel',submit:'Save',required:'Complete the required choices.'}} onSubmit={vi.fn()}/>
}
describe('controlled permission editor',()=>{
 it('shows only the recipient choices supplied for a professional or member request',()=>{
  render(<Example/>);expect(screen.queryByLabelText('Decision')).not.toBeInTheDocument();expect(screen.getByLabelText('Recipient').querySelectorAll('option:not([disabled])')).toHaveLength(1);expect(screen.getByLabelText('Recipient')).toHaveValue('first')
 })
 it('shows a configurable controller decision and recipient fields',()=>{render(<Example controller/>);expect(screen.getByLabelText('Decision')).toBeVisible();expect(screen.getByLabelText('Recipient address')).toBeVisible()})
 it('retains selections across collapsed role and section panels and supports a complete group',()=>{
  render(<Example/>);const roles=screen.getByText('Roles').closest('details')!;fireEvent.click(within(roles).getByText('Roles'));fireEvent.click(within(roles).getByLabelText('First choice'));fireEvent.click(within(roles).getByText('Roles'));fireEvent.click(within(roles).getByText('Roles'));expect(within(roles).getByLabelText('First choice')).toBeChecked()
  const sections=screen.getByText('Sections').closest('details')!;fireEvent.click(within(sections).getByText('Sections'));fireEvent.click(within(sections).getByLabelText('All summary sections'));expect(within(sections).getByLabelText('First choice')).toBeChecked();expect(within(sections).getByLabelText('Second choice')).toBeChecked()
 })
 it('locks an ambiguous submitted intent while keeping retry available',()=>{render(<Example locked/>);expect(screen.getByLabelText('Recipient')).toBeDisabled();expect(screen.getByRole('button',{name:'Save'})).toBeEnabled()})
 it('offers optional expiry presets without silently setting expiry',()=>{render(<Example/>);expect(screen.getByText('No expiry until revoked.')).toBeVisible();expect(screen.queryByRole('combobox',{name:'Expiry'})).toBeNull();fireEvent.click(screen.getByLabelText('Add expiry'));expect(screen.getByRole('option',{name:'One hour'})).toBeTruthy();expect(screen.getByRole('option',{name:'One year'})).toBeTruthy()})
 it('uses host translation keys with readable fallbacks and refreshes host-filtered role and section catalogs',()=>{
  // The opaque reverse-DNS-shaped keys and fallback labels are the serialization/rendering behavior under test.
  const translate=vi.fn((key:string,fallback:string)=>key==='fixture.roles.first'?'Translated role':fallback)
  const props={title:'Permission',purpose:{label:'Purpose',value:'first',options:choices},recipient:{label:'Recipient',value:'first',options:choices},roles:{label:'Roles',options:[{value:'first',label:'Readable role',labelKey:'fixture.roles.first'}],values:[],onChange:vi.fn()},sections:{label:'Sections',values:[],onChange:vi.fn(),groups:[{id:'summary',label:'Summary',options:[{value:'second',label:'Readable section',labelKey:'fixture.sections.missing'}]}]},copy:{cancel:'Cancel',submit:'Save',required:'Choose'},onSubmit:vi.fn(),translate}
  const {rerender}=render(<PermissionRuleEditor {...props}/>)
  expect(screen.getByLabelText('Translated role')).toBeTruthy();expect(screen.getByLabelText('Readable section')).toBeTruthy();expect(screen.queryByText('fixture.sections.missing')).toBeNull()
  rerender(<PermissionRuleEditor {...props} roles={{...props.roles,options:[{value:'second',label:'Different sector role'}]}} sections={{...props.sections,groups:[]}}/>)
  expect(screen.queryByLabelText('Translated role')).toBeNull();expect(screen.getByLabelText('Different sector role')).toBeTruthy();expect(screen.queryByLabelText('Readable section')).toBeNull()
 })
 it('shows assisted approval context without implementing a sign-in or granting access',()=>{render(<Example assisted/>);expect(screen.getByText('Controller approval required.')).toBeVisible();expect(screen.queryByRole('button',{name:/approve/i})).toBeNull()})
})

it('retains host-owned stable action identifiers on its actual save and cancel controls',()=>{
 // These opaque action identifiers test presentation metadata only, never role or grant authority.
 render(<Example actions/>)
 expect(screen.getByRole('button',{name:'Save'})).toHaveAttribute('data-portal-action','fixture-save')
 expect(screen.getByRole('button',{name:'Cancel'})).toHaveAttribute('data-portal-action','fixture-cancel')
})
