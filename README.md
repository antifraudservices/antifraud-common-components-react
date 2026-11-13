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


`PermissionRuleEditor` renders a host-controlled permission form in this order:
sector (optional), purpose, recipient and recipient fields, decision (optional),
collapsible roles and section groups, optional expiry, review and action feedback.
The host supplies eligible options and controls every selected value. Omit the
decision and country choices for a self-request. An invitation or assisted proposal
can use the same renderer with a different host-authorized catalog and adapter.
`fieldsDisabled` retains a failed request's exact body while leaving its retry
action enabled; `busy` disables submission too. Optional `submitAction` and
`cancelAction` preserve host-owned stable action identifiers on the actual controls.

`createPermissionCatalogTranslator(document, options)` validates a read-only
[JSON:API primary document](https://jsonapi.org/format/#document-top-level).
Its `data` array contains host-defined catalog resources with `type`, `id` and
`attributes.translations`. This is an application-defined UI projection, not
an operational FHIR record. A host may supply separate clinical-section,
purpose-of-use and professional-role resources (or catalogs from other sectors).
For example, the structure of one catalog is:

```json
{
  "data": [{
    "type": "terminology-labels",
    "id": "section-labels",
    "attributes": {
      "translations": {
        "en": {"example.sections.first": "Section label"},
        "es": {"example.sections.first": "Nombre de la sección"}
      }
    }
  }]
}
```

Those example keys illustrate UI lookup only. Hosts supply real, system-qualified
keys for their configured terminology; labels never alter the submitted codes.
English coverage is mandatory for every `requiredKeys` entry and every optional
translation. `language` selects the UI locale, then its base locale, then English.
`showEnglishReference` optionally adds the English label in parentheses. Conflicting
labels, missing English, duplicate resource identities and raw-key fallbacks fail
validation before the form is offered. Catalogs label choices; server policy still
selects which roles, purposes and sections the actor can request or grant.

`PermissionChoicePicker` filters host-supplied options and shows removable selected
chips without losing hidden selections. It contains no country or sector catalog.
`resolvePermissionExpiry(preset, now)` resolves hour/day/month/year into an explicit
UTC instant, clamping month/year changes to the last valid calendar day. The host
must show the result for review and the server must validate the period. Unchecked
expiry has no scheduled end; it does not remove revocation checks.

| Export | Consumer composition | Test owner | Real boundary requirement |
| --- | --- | --- | --- |
| PermissionRuleEditor | Personal controller editor, member requests and invitation defaults; Professional requests and assisted default-permission proposals | Shared interaction suite; portal policy/adapter suites | Normal UI, BFF, SDK and authoritative reload for each implemented flow |
| createPermissionCatalogTranslator | All five host adapters above | Shared catalog validation suite | Host offered-code coverage; no authorization inferred from labels |
| PermissionChoicePicker | Personal country-set editor | Shared filtering/selection suite | Exact selected jurisdictions returned by the contact/Consent adapter |
| resolvePermissionExpiry | All five permission adapters | Shared UTC calendar suite | Server period validation, saved expiry and subsequent authorization |

Browser, network-provider, native renderer and deployment evidence belongs in each
consuming portal. A shared DOM test does not establish Expo or production support.
