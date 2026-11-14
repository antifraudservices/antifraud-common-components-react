// Flow contract: a neutral host may supply no artwork, or a distinct destination for its supplied mark; configuration does not fabricate assets, change the product home or grant profile authority.
import type {PortalBrand} from '../../src/index.js'
export const unillustratedBrand:PortalBrand={family:'personal',productName:'Personal portal',organizationName:'Organization',homeHref:'/personal'}
export const routedBrand:PortalBrand={family:'professional',productName:'Professional portal',organizationName:'Organization',homeHref:'/professional',markHref:'/professional/current-profile',
 mark:{lightSurface:{src:'/mark-light.svg',alt:'Organization mark',width:48,height:48},darkSurface:{src:'/mark-dark.svg',alt:'Organization mark',width:48,height:48}}}
