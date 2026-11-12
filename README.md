# Antifraud Common Components React

Domain-neutral controlled React screens shared by health, veterinary,
qualification, controller and marketplace applications.

The package owns entry navigation, sign-in presentation, PIN/passkey profile
protection, browser passkey capability helpers and neutral identity evidence.
Identity providers, OTP delivery, WebAuthn ceremonies, sessions, wallet/key
custody, BFF calls, tenant selection, persistence and authorization remain in
the consuming application.

`IndexProviderSelector` displays host-supplied eligible providers and emits their opaque identifier unchanged. Set `allowProviderOverride={false}` to display an inherited provider without offering a change; the server still enforces eligibility and authority.

`ActionFeedback` renders localized info, warning, error or success beside its triggering action. `resolveActionFeedback` maps only explicitly supplied identifiers and otherwise returns safe fallback text. The host owns localization and transport adapters. Import `antifraud-common-components-react/styles.css` after legacy component styles and before host theme overrides.

The provider selector and action feedback are composed by the Personal card-creation dialog and both care portals’ Demo unlock adapters. Entry, sign-in and profile-protection exports remain public compatibility contracts for existing controller and other portal consumers; this release does not migrate every legacy shell or consent editor.
