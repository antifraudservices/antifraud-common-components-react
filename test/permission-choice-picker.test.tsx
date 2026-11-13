// Flow contract: reuse shared test fixtures and canonical types; do not introduce duplicated literals.
// Filtering is presentation only: it preserves off-screen selections, emits opaque host values and never selects a tenant or resolves an identity.
import React from 'react'
import {expect,it,vi} from 'vitest'
import {render,screen,fireEvent} from '@testing-library/react'
import {PermissionChoicePicker} from '../src/permission-choice-picker'
it('filters supplied labels while keeping selected chips and removing only the chosen value',()=>{
 // These opaque choices deliberately test that the renderer contains no country or sector catalog.
 const onChange=vi.fn(),options=[{value:'first',label:'First choice'},{value:'second',label:'Second choice'}]
 render(<PermissionChoicePicker label="Choices" filterLabel="Find a choice" removeLabel="Remove" options={options} values={['second']} onChange={onChange}/>)
 fireEvent.change(screen.getByRole('searchbox',{name:'Find a choice'}),{target:{value:'First'}})
 expect(screen.queryByRole('checkbox',{name:'Second choice'})).toBeNull()
 expect(screen.getByRole('button',{name:'Remove Second choice'})).toBeTruthy()
 fireEvent.click(screen.getByRole('checkbox',{name:'First choice'}))
 expect(onChange).toHaveBeenLastCalledWith(['second','first'])
 fireEvent.click(screen.getByRole('button',{name:'Remove Second choice'}))
 expect(onChange).toHaveBeenLastCalledWith([])
})
