'use client'
import React,{useId} from 'react'
import type {PublicRegistryQuery,PublicRegistrySearchResult} from 'antifraud-data-utils-ts/public-registry-search'

export type PublicRegistryDirectoryCopy=Readonly<Record<'title'|'description'|'address'|'municipality'|'postalCode'|'identifier'|'query'|'search'|'searching'|'location'|'clearLocation'|'radius'|'nearbyActive'|'source'|'registration'|'missingName'|'noActions'|'empty'|'limit'|'distance'|'unlocated'|'nearbyUnavailable',string>>
export type PublicRegistryDirectoryProps=Readonly<{
  copy:PublicRegistryDirectoryCopy
  query:PublicRegistryQuery
  result?:PublicRegistrySearchResult
  busy:boolean
  error?:string
  onQueryChange:(query:PublicRegistryQuery)=>void
  onSearch:()=>void
  onRequestLocation:()=>void
  onClearLocation:()=>void
}>
/** Controlled discovery UI: emits intentions; never fetches, grants membership, or publishes services. */
export function PublicRegistryDirectory({copy,query,result,busy,error,onQueryChange,onSearch,onRequestLocation,onClearLocation}:PublicRegistryDirectoryProps){
  const id=useId()
  return <section className="app-panel panel public-registry-directory" aria-labelledby={`${id}-title`} aria-busy={busy}>
    <h2 id={`${id}-title`}>{copy.title}</h2><p>{copy.description}</p>
    <form onSubmit={event=>{event.preventDefault();onSearch()}} className="grid gap-3">
      {(['address','municipality','postalCode','identifier','query'] as const).map(key=><label key={key} className="grid gap-1" htmlFor={`${id}-${key}`}>{copy[key]}
        <input id={`${id}-${key}`} className="app-input" value={query[key]??''} maxLength={200} disabled={busy} onChange={event=>onQueryChange({...query,[key]:event.target.value})}/>
      </label>)}
      <div className="flex flex-wrap gap-3">
        <button type="button" className="app-secondary-action" disabled={busy||result?.nearbyAvailable===false} onClick={onRequestLocation}>{copy.location}</button>
        {query.near&&<><label htmlFor={`${id}-radius`}>{copy.radius}<select id={`${id}-radius`} className="app-input" disabled={busy} value={query.near.radiusKm} onChange={event=>onQueryChange({...query,near:{...query.near!,radiusKm:Number(event.target.value)}})}>{[1,5,10,25,50,100,200].map(radius=><option key={radius} value={radius}>{radius}</option>)}</select></label>
          <span role="status">{copy.nearbyActive}</span><button type="button" className="app-secondary-action" disabled={busy} onClick={onClearLocation}>{copy.clearLocation}</button></>}
        <button className="app-primary-action" type="submit" disabled={busy}>{busy?copy.searching:copy.search}</button>
      </div>
    </form>
    {error&&<p role="alert">{error}</p>}
    {result?.nearbyAvailable===false&&<p>{copy.nearbyUnavailable}</p>}
    {result&&<div aria-live="polite">
      <p>{result.total} {result.total>result.entries.length?copy.limit:''}</p>
      {!result.total&&<p>{copy.empty}</p>}
      {result.unlocatedCount>0&&query.near&&<p>{copy.unlocated}: {result.unlocatedCount}</p>}
      {result.entries.map(entry=><article key={entry.id} className="rounded-3xl border border-border p-4">
        <h3>{entry.name||`${copy.registration}: ${entry.registrationNumber}`}</h3>
        {!entry.name&&<p>{copy.missingName}</p>}
        <p>{[entry.address,entry.municipality,entry.postalCode].filter(Boolean).join(' · ')}</p>
        {entry.classification&&<p>{entry.classification}</p>}
        {entry.distanceKm!==undefined&&<p>{entry.distanceKm.toFixed(1)} {copy.distance}</p>}
        <p>{copy.noActions}</p>
        <a href={entry.source.url.startsWith('https://')?entry.source.url:undefined} target="_blank" rel="noopener noreferrer">{copy.source}: {entry.source.authority}</a>
        <p><time dateTime={entry.source.checkedAt}>{entry.source.checkedAt}</time></p>
      </article>)}
    </div>}
  </section>
}
