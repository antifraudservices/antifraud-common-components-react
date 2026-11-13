# Changelog

## Unreleased

- Add a controlled progressive permission editor with host-supplied roles, purposes, recipient controls, section groups, optional expiry and nearby feedback.
- Validate multi-catalog JSON:API UI translations with mandatory English coverage, optional locale fallback and collision rejection; catalogs never confer authority.
- Add a searchable choice picker that retains off-screen selections and a pure UTC expiry helper with month/year day clamping.


## 1.1.0 - 2026-11-12

- Add controlled index-provider selection with optional inherited-provider presentation and theme-aware selected text. Hosts retain provider eligibility and override authority.
- Add localized action feedback and safe known-code resolution; unknown diagnostics use host-provided fallback copy.
- Associate rejected PIN feedback with its input, clear stale feedback on edits and contain unexpected unlock-adapter failures without opening protected content.

## 1.0.0 - 2026-10-21

- Extract domain-neutral portal entry, sign-in, biometric/PIN profile
  protection and identity-evidence screens for health, veterinary,
  qualification, controller and future marketplace consumers.
- Keep every provider, OTP, WebAuthn, session, wallet, tenant, BFF and
  authorization adapter outside the presentation package.
