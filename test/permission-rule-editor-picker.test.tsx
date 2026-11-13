// Flow contract: host-provided opaque section choices become removable selected tags only after an explicit add intent. Rendering and catalog changes never drop saved values, change a decision or grant authority; disabled fields emit no selection changes.
import {cleanup,fireEvent,render,screen,within} from '@testing-library/react'
import {afterEach,describe,expect,it,vi} from 'vitest'
import {useState} from 'react'
import {PermissionRuleEditor} from '../src/index.js'

afterEach(cleanup)
// These opaque values and copy are the generic renderer contract, not domain identifiers or policy fixtures.
const options=[{value:'first',label:'First choice'},{value:'second',label:'Second choice'}]
const other={value:'other',label:'Other group choice'}
const picker={addLabel:'Add section',removeLabel:'Remove section',unassignedLabel:'Unassigned sections',allAssignedLabel:'All sections assigned'}

function Example({initial=[],locked=false,busy=false,onChange=()=>{},onDecisionChange=()=>{}}:{
 initial?:string[];locked?:boolean;busy?:boolean;onChange?:(values:string[])=>void;onDecisionChange?:(value:string)=>void
}){
 const [values,setValues]=useState(initial)
 const sections={
  label:'Sections',values,onChange:(next:string[])=>{onChange(next);setValues(next)},picker,
  groups:[{id:'summary',label:'Summary',allLabel:'All summary sections',options},{id:'other-group',label:'Other group',options:[other]}],
 }
 return <PermissionRuleEditor title="Permission" purpose={{label:'Purpose',value:'first',options}}
  recipient={{label:'Recipient',value:'first',options}}
  decision={{label:'Decision',value:'first',options,onChange:onDecisionChange}}
  roles={{label:'Roles',options,values:[],onChange:()=>{}}}
  sections={sections} copy={{cancel:'Cancel',submit:'Save',required:'Choose'}}
  fieldsDisabled={locked} busy={busy} onSubmit={vi.fn()}/>
}

function openSections(){
 const panel=screen.getByText('Sections').closest('details')!
 fireEvent.click(within(panel).getByText('Sections'))
 return within(panel)
}

describe('optional controlled section tag picker',()=>{
 it('adds only the chosen section, removes it from the dropdown and advances to the next unassigned choice',()=>{
  const changed=vi.fn(),decisionChanged=vi.fn()
  render(<Example onChange={changed} onDecisionChange={decisionChanged}/>)
  const panel=openSections(),group=within(panel.getByRole('group',{name:'Summary'}))
  const select=group.getByRole('combobox',{name:picker.unassignedLabel})
  expect(select).toHaveValue('first')
  expect(group.getByRole('button',{name:picker.addLabel})).toHaveTextContent('+')
  expect(group.queryByRole('checkbox',{name:'First choice'})).toBeNull()
  expect(changed).not.toHaveBeenCalled()

  fireEvent.click(group.getByRole('button',{name:picker.addLabel}))
  expect(changed).toHaveBeenLastCalledWith(['first'])
  expect(group.getByRole('button',{name:`${picker.removeLabel} First choice`})).toBeEnabled()
  expect(group.getByRole('button',{name:`${picker.removeLabel} First choice`})).toHaveTextContent('−')
  expect(within(select).queryByRole('option',{name:'First choice'})).toBeNull()
  expect(select).toHaveValue('second')

  fireEvent.click(group.getByRole('button',{name:picker.addLabel}))
  expect(changed).toHaveBeenLastCalledWith(['first','second'])
  expect(group.getByRole('button',{name:picker.addLabel})).toBeDisabled()
  expect(select).toBeDisabled()
  expect(group.getByRole('option',{name:picker.allAssignedLabel})).toBeTruthy()
  expect(decisionChanged).not.toHaveBeenCalled()
 })

 it('lets the user choose a later option and returns a removed tag to the unassigned list',()=>{
  const changed=vi.fn()
  render(<Example onChange={changed}/>)
  const panel=openSections(),group=within(panel.getByRole('group',{name:'Summary'}))
  const select=group.getByRole('combobox',{name:picker.unassignedLabel})
  fireEvent.change(select,{target:{value:'second'}})
  fireEvent.click(group.getByRole('button',{name:picker.addLabel}))
  expect(changed).toHaveBeenLastCalledWith(['second'])
  expect(select).toHaveValue('first')
  expect(within(select).queryByRole('option',{name:'Second choice'})).toBeNull()

  fireEvent.click(group.getByRole('button',{name:`${picker.removeLabel} Second choice`}))
  expect(changed).toHaveBeenLastCalledWith([])
  expect(group.queryByRole('button',{name:`${picker.removeLabel} Second choice`})).toBeNull()
  expect(within(select).getByRole('option',{name:'Second choice'})).toBeTruthy()
 })

 it('preserves unknown saved values and selections in another group when adding or removing a tag',()=>{
  const changed=vi.fn()
  render(<Example initial={['saved-not-in-current-catalog',other.value]} onChange={changed}/>)
  const panel=openSections(),group=within(panel.getByRole('group',{name:'Summary'}))
  expect(changed).not.toHaveBeenCalled()
  fireEvent.click(group.getByRole('button',{name:picker.addLabel}))
  expect(changed).toHaveBeenLastCalledWith(['saved-not-in-current-catalog',other.value,'first'])
  fireEvent.click(group.getByRole('button',{name:`${picker.removeLabel} First choice`}))
  expect(changed).toHaveBeenLastCalledWith(['saved-not-in-current-catalog',other.value])
 })

 it.each([{label:'locked',locked:true,busy:false},{label:'busy',locked:false,busy:true}])('inherits the disabled fieldset for $label selection and removal controls',({locked,busy})=>{
  const changed=vi.fn()
  render(<Example initial={['first']} locked={locked} busy={busy} onChange={changed}/>)
  const panel=openSections(),group=within(panel.getByRole('group',{name:'Summary'}))
  expect(group.getByRole('combobox',{name:picker.unassignedLabel})).toBeDisabled()
  expect(group.getByRole('button',{name:picker.addLabel})).toBeDisabled()
  expect(group.getByRole('button',{name:`${picker.removeLabel} First choice`})).toBeDisabled()
  expect(group.getByRole('checkbox',{name:'All summary sections'})).toBeDisabled()
  expect(changed).not.toHaveBeenCalled()
 })

 it('selects and clears a complete group while retaining other-group and unknown saved values',()=>{
  const changed=vi.fn()
  render(<Example initial={['saved-not-in-current-catalog',other.value,'first']} onChange={changed}/>)
  const panel=openSections(),group=within(panel.getByRole('group',{name:'Summary'}))
  fireEvent.click(group.getByRole('checkbox',{name:'All summary sections'}))
  expect(changed).toHaveBeenLastCalledWith(['saved-not-in-current-catalog',other.value,'first','second'])
  expect(group.getByRole('button',{name:picker.addLabel})).toBeDisabled()
  fireEvent.click(group.getByRole('checkbox',{name:'All summary sections'}))
  expect(changed).toHaveBeenLastCalledWith(['saved-not-in-current-catalog',other.value])
  expect(group.getByRole('combobox',{name:picker.unassignedLabel})).toHaveValue('first')
  expect(group.queryByRole('button',{name:`${picker.removeLabel} First choice`})).toBeNull()
 })
})
