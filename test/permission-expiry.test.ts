// Flow contract: reuse shared test fixtures and canonical types; do not introduce duplicated literals.
// Fixed dates are the calendar-boundary values being tested, not identity fixtures. A preset computes an explicit instant for review; it never grants access.
import {describe,expect,it} from 'vitest'
import {resolvePermissionExpiry} from '../src/index.js'
describe('reviewable permission expiry presets',()=>{
 it('adds an hour or day without mutating the supplied clock',()=>{
  const now=new Date('2026-01-31T12:00:00.000Z')
  expect(resolvePermissionExpiry('hour',now)).toBe('2026-01-31T13:00:00.000Z');expect(resolvePermissionExpiry('day',now)).toBe('2026-02-01T12:00:00.000Z');expect(now.toISOString()).toBe('2026-01-31T12:00:00.000Z')
 })
 it('clamps month and year presets to the last valid day instead of silently rolling into another month',()=>{
  expect(resolvePermissionExpiry('month',new Date('2026-01-31T12:00:00.000Z'))).toBe('2026-02-28T12:00:00.000Z')
  expect(resolvePermissionExpiry('year',new Date('2024-02-29T12:00:00.000Z'))).toBe('2025-02-28T12:00:00.000Z')
 })
 it('rejects invalid clocks and unknown presets',()=>{expect(()=>resolvePermissionExpiry('month',new Date(NaN))).toThrow();expect(()=>resolvePermissionExpiry('unsupported' as never,new Date())).toThrow()})
})
