# Antifraud Common Components React

Controlled React screens shared by health, veterinary, qualification,
controller and marketplace applications. The package provides entry navigation,
sign-in presentation, PIN/passkey profile protection, identity rendering and
permission editing. Applications supply state and handle actions through their
own authentication, storage and authorization adapters.

## Compose the portal shell

Use `PortalHeader` and `PortalSettingsPanel` with controlled `theme`, `density`
and change callbacks. Supply account, language, security and legal actions,
and place the selected subject in the header's `currentSubject` slot.
`PortalBrand` accepts optional artwork and `markHref` when its mark has a
separate destination. `PortalEntryHero` renders supplied artwork;
`ProfileIdentityTarget` and `ProfileIdentityIcon` provide the same decorative
placeholder as the PIN gate when an image is unavailable.

Use `PortalLoadingSkeleton`, `ElapsedOperationStatus` and
`CollapsiblePortalSection` to present progress and expandable content.

Import `antifraud-common-components-react/styles.css` after legacy component
styles and before host theme overrides. The public `--afcc-*` aliases expose
the existing light/dark surface, panel, text, border, accent and action colors.
The host chooses and persists the theme.

## Present provider choices and action results

`IndexProviderSelector` shows eligible providers supplied by the host and
returns their opaque identifiers unchanged. Set `allowProviderOverride={false}`
when the provider is inherited and fixed for the current flow.

`ActionFeedback` shows localized information, warnings, errors and success
beside the relevant action. `resolveActionFeedback` maps explicitly supplied
identifiers and uses safe fallback text for unknown results. The host supplies
localization and maps transport responses to those identifiers.

## Build a permission form

`PermissionRuleEditor` arranges controlled recipient, purpose, role, section,
expiry and review fields. `PermissionChoicePicker` filters host options while
preserving selections outside the current filter. Use
`createPermissionCatalogTranslator` for validated localized catalog labels and
`resolvePermissionExpiry` for reviewed UTC expiry values.

The [integration guide](docs/COMPONENT_INTEGRATION.md) describes callback
ownership, the catalog document format, validation, retry behavior and required
server checks. It also explains which checks belong in each consuming portal.

## Adoption status

The provider selector is composed in Personal card creation, and shared action
feedback is used in care-portal Demo unlock flows. Entry, sign-in and profile
protection remain public compatibility contracts for other consumers. Legacy
shells and consent editors still require migration in their owning applications.
### Public registry directory

`PublicRegistryDirectory` is a controlled renderer shared by downstream portal
audiences. Supply localized `copy`, `query`, `result`, `busy`/`error` state and
callbacks for search, filter changes, location requests and clearing location.
It renders real source provenance and optional straight-line distances. It
never fetches, obtains browser location itself or enables booking/enrollment.
