# Component integration

## Supply state and handle actions

The application authenticates the account, resolves eligible tenants and
providers, opens protected profiles and supplies controlled component props.
Callbacks carry user intentions to the application's BFF or SDK. The server
validates the actor, target and current permission before changing protected
state. Keep OTP delivery, WebAuthn ceremonies, PIN/key custody, sessions,
persistence and authorization in that application boundary.

The common components render controlled values. They do not read browser
storage, observe the system theme or apply document preferences. The host
selects theme and density, implements density effects and handles account,
language, security and legal actions. A header's `currentSubject` is an opaque
React slot. Browser passkey capability is a device signal; verify the actual
WebAuthn ceremony and profile authorization through the host.

## Integrate permission editing

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
JSON:API primary document.
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

## Validate the consuming journey

Shared interaction tests cover rendering, callbacks and local validation.
Each consuming portal also tests its BFF/SDK adapter, authoritative saved
readback, denial and revocation. Run browser and deployment checks for the
application and executable native-renderer checks before claiming Expo
support. Record a journey separately from its viewport, theme, flavour and
access-mode execution variants.
