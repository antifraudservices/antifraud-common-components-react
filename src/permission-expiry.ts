/** UI presets produce an explicit instant for controller review. The server independently validates periods and authority. */
export type PermissionExpiryPreset='hour'|'day'|'month'|'year'
export function resolvePermissionExpiry(preset:PermissionExpiryPreset,now:Date):string{
 if(!Number.isFinite(now.getTime()))throw new TypeError('A valid expiry reference time is required.')
 const end=new Date(now.getTime())
 if(preset==='hour')end.setTime(end.getTime()+60*60*1000)
 else if(preset==='day')end.setTime(end.getTime()+24*60*60*1000)
 else if(preset==='month'||preset==='year'){
  const day=end.getUTCDate();end.setUTCDate(1)
  if(preset==='month')end.setUTCMonth(end.getUTCMonth()+1)
  else end.setUTCFullYear(end.getUTCFullYear()+1)
  const lastDay=new Date(Date.UTC(end.getUTCFullYear(),end.getUTCMonth()+1,0)).getUTCDate()
  end.setUTCDate(Math.min(day,lastDay))
 }else throw new TypeError('Unknown permission expiry preset.')
 return end.toISOString()
}
