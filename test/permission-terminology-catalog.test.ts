// Flow contract: reuse shared test fixtures and canonical types; do not introduce duplicated literals.
// The synthetic reverse-DNS-shaped keys are opaque UI lookup keys under test, never operational role/section claims. JSON:API catalogs configure labels, not access policy.
import {describe,expect,it} from 'vitest'
import {createPermissionCatalogTranslator} from '../src/index.js'
const role='fixture.roles.first',section='fixture.sections.first',purpose='fixture.purposes.first'
const document={data:[
 {type:'catalog',id:'roles',attributes:{translations:{en:{[role]:'English role'},es:{[role]:'Rol traducido'}}}},
 {type:'catalog',id:'sections',attributes:{translations:{en:{[section]:'English section'}}}},
 {type:'catalog',id:'purposes',attributes:{translations:{en:{[purpose]:'English purpose'},es:{[purpose]:'Finalidad'}}}},
]}
describe('host terminology label catalogs',()=>{
 it('combines any number of catalogs with required English coverage and local-language fallback',()=>{
  const translate=createPermissionCatalogTranslator(document,{language:'es',requiredKeys:[role,section,purpose]})
  expect(translate(role)).toBe('Rol traducido');expect(translate(section)).toBe('English section');expect(translate(purpose)).toBe('Finalidad')
 })
 it('rejects a catalog without English or a required key instead of exposing raw keys',()=>{
  expect(()=>createPermissionCatalogTranslator({data:[{...document.data[0],attributes:{translations:{es:{[role]:'Rol'}}}}]},{requiredKeys:[role]})).toThrow(/English/)
  expect(()=>createPermissionCatalogTranslator(document,{requiredKeys:['fixture.missing']})).toThrow(/English/)
 })
 it('rejects conflicting or duplicate catalog identities without silently overwriting labels',()=>{
  expect(()=>createPermissionCatalogTranslator({data:[document.data[0],document.data[0]]},{requiredKeys:[role]})).toThrow(/duplicate/i)
  expect(()=>createPermissionCatalogTranslator({data:[...document.data,{type:'catalog',id:'conflicting',attributes:{translations:{en:{[role]:'Conflicting label'}}}}]},{requiredKeys:[role]})).toThrow(/conflict/i)
 })
 it('uses English for an unavailable language and offers bilingual reference only when requested',()=>{
  expect(createPermissionCatalogTranslator(document,{language:'fr',requiredKeys:[role]})(role)).toBe('English role')
  expect(createPermissionCatalogTranslator(document,{language:'es',requiredKeys:[role],showEnglishReference:true})(role)).toBe('Rol traducido (English role)')
 })
 it('rejects unknown keys without a human fallback and rejects translations absent from the English catalog',()=>{
  const translate=createPermissionCatalogTranslator(document,{requiredKeys:[role]})
  expect(()=>translate('fixture.missing')).toThrow(/English/)
  expect(translate('fixture.missing','Readable fallback')).toBe('Readable fallback')
  expect(()=>createPermissionCatalogTranslator({data:[{type:'catalog',id:'bad',attributes:{translations:{en:{[role]:'Role'},es:{[section]:'Unexpected'}}}}]},{requiredKeys:[role]})).toThrow(/English/)
 })
})
