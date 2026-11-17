// Flow contract: public source listings remain real discovery evidence; controlled filters emit search/location intentions, distance is labelled, and no enrollment or booking action is inferred.
import React from 'react'
import {describe,it,expect,vi} from 'vitest'
import {render,screen,fireEvent} from '@testing-library/react'
import {PublicRegistryDirectory} from '../src/public-registry-directory'
const copy={title:'Real clinic directory',description:'Public registry listings',address:'Address',municipality:'Municipality',postalCode:'Postal code',identifier:'NIF (optional)',query:'Registration or text',search:'Search',searching:'Searching',location:'Use my location',clearLocation:'Clear location',radius:'Radius (km)',nearbyActive:'Location enabled',source:'Official source',registration:'Registration',missingName:'Commercial name unavailable',noActions:'Registry listing; service availability is not established.',empty:'No matches',limit:'Showing a limited result set',distance:'km in a straight line',unlocated:'Some entries have no reviewed coordinates',nearbyUnavailable:'Nearby search requires reviewed source coordinates'}
describe('controlled public registry directory',()=>{
 it('emits optional exact-identifier and address filters and keeps real entries free of booking actions',()=>{
  const onQueryChange=vi.fn(),onSearch=vi.fn(),onRequestLocation=vi.fn()
  render(<PublicRegistryDirectory copy={copy} query={{}} onQueryChange={onQueryChange} onSearch={onSearch} onRequestLocation={onRequestLocation} onClearLocation={()=>{}} busy={false} result={{total:1,unlocatedCount:0,nearbyAvailable:true,entries:[{id:'EX-1',registrationNumber:'EX-1',address:'Example street',municipality:'Example city',postalCode:'00000',source:{authority:'Example authority',url:'https://example.invalid/registry',checkedAt:'2026-11-17T00:00:00Z'},distanceKm:1.2}]}} />)
  fireEvent.change(screen.getByLabelText('Address'),{target:{value:'Example'}})
  expect(onQueryChange).toHaveBeenCalledWith({address:'Example'})
  fireEvent.click(screen.getByRole('button',{name:'Search'}));expect(onSearch).toHaveBeenCalledOnce()
  fireEvent.click(screen.getByRole('button',{name:'Use my location'}));expect(onRequestLocation).toHaveBeenCalledOnce()
  expect(screen.getByText('1.2 km in a straight line')).toBeTruthy()
  expect(screen.queryByRole('button',{name:/book/i})).toBeNull()
  expect(screen.getByText(copy.missingName)).toBeTruthy()
 })
})
