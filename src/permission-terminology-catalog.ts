/** Read-only UI label projection carried in a JSON:API primary document.
 * Resource type/id are supplied by the host. `translations` is this UI projection's
 * application-defined attribute, not a FHIR resource field or an operational claim.
 * Terminology catalogs label choices; they never choose eligibility or grant access.
 */
export type PermissionTerminologyCatalogDocument = Readonly<{data:readonly Readonly<{
 type:string;id:string;attributes:Readonly<{translations:Readonly<Record<string,Readonly<Record<string,string>>>>}>
}>[]}>
export function createPermissionCatalogTranslator(document:unknown,options:Readonly<{requiredKeys:readonly string[];language?:string;showEnglishReference?:boolean}>){
 const record=(value:unknown):value is Record<string,unknown>=>typeof value==='object'&&value!==null&&!Array.isArray(value)
 if(!record(document)||!Array.isArray(document.data)||!document.data.length||document.data.length>100||'errors' in document)throw new TypeError('Invalid terminology catalog document.')
 const language=Intl.getCanonicalLocales(options.language||'en')[0]!,baseLanguage=new Intl.Locale(language).language
 const catalogs=new Set<string>(),english=new Map<string,string>(),localized=new Map<string,string>()
 for(const resource of document.data){
  if(!record(resource)||typeof resource.type!=='string'||!resource.type.trim()||typeof resource.id!=='string'||!resource.id.trim()||!record(resource.attributes)||!record(resource.attributes.translations))throw new TypeError('Invalid terminology catalog resource.')
  const identity=JSON.stringify([resource.type,resource.id]);if(catalogs.has(identity))throw new TypeError('Duplicate terminology catalog identity.');catalogs.add(identity)
  const translations=resource.attributes.translations,en=translations.en
  if(!record(en)||!Object.keys(en).length)throw new TypeError('An English terminology catalog is required.')
  for(const [locale,terms] of Object.entries(translations)){
   if(Intl.getCanonicalLocales(locale)[0]!==locale||!record(terms))throw new TypeError('Invalid terminology language catalog.')
   for(const [key,label] of Object.entries(terms))if(!Object.hasOwn(en,key)||typeof label!=='string'||!label.trim()||label===key)throw new TypeError('Every translated key requires a readable English label.')
  }
  const local=translations[language]??translations[baseLanguage]
  for(const [key,label] of Object.entries(en)){
   if(!key.trim()||typeof label!=='string'||!label.trim()||label===key)throw new TypeError('A readable English label is required.')
   if(english.has(key)&&english.get(key)!==label)throw new TypeError('Conflicting English terminology labels.')
   english.set(key,label)
   if(record(local)&&typeof local[key]==='string'){
    if(localized.has(key)&&localized.get(key)!==local[key])throw new TypeError('Conflicting localized terminology labels.')
    localized.set(key,local[key])
   }
  }
 }
 for(const key of options.requiredKeys)if(!english.has(key))throw new TypeError('English coverage is required for every offered terminology key.')
 return (key:string,fallback?:string):string=>{
  const reference=english.get(key)??fallback
  if(typeof reference!=='string'||!reference.trim()||reference===key)throw new TypeError('A readable English fallback is required.')
  const text=localized.get(key)??reference
  return options.showEnglishReference&&text!==reference?`${text} (${reference})`:text
 }
}
