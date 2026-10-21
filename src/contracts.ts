import type { CSSProperties } from 'react'

export type PortalBrandAsset = Readonly<{ src: string; alt: string; width: number; height: number }>
export type PortalBrandArtworkSet = Readonly<{ darkSurface: PortalBrandAsset; lightSurface: PortalBrandAsset }>
export type PortalBrand = Readonly<{ family: 'personal' | 'professional' | 'controller' | 'marketplace'; productName: string; organizationName: string; homeHref: string; mark: PortalBrandArtworkSet; heroArtwork?: PortalBrandArtworkSet; variables?: CSSProperties }>
export type PortalAccessOption = Readonly<{ id: string; href: string; title: string; description: string; requirement: string }>
export type ProfileProtectionState = 'not-required' | 'checking' | 'setup-required' | 'locked' | 'unavailable'
export type ProfileUnlockResult = 'unlocked' | 'invalid-pin' | 'temporarily-locked' | 'unavailable'
export type ProfileProtectionCopy = Readonly<{ checkingTitle: string; checkingBody: string; setupTitle: string; setupBody: string; unavailableTitle: string; unavailableBody: string; unlockTitle: string; unlockBody: string; pinLabel: string; pinRequired: string; invalidPin: string; temporarilyLocked: string; unlockUnavailable: string; unlock: string; retry: string }>
export type ProfileProtectionTargetV2 = Readonly<{ eyebrow: string; title: string; subtitle?: string; icon?: PortalBrandAsset; badges?: readonly string[]; details?: readonly Readonly<{ label: string; value: string }>[] }>
export type ProfileProtectionCopyV2 = ProfileProtectionCopy & Readonly<{ unlockWithPasskey: string; usePinInstead: string }>
