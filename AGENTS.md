# Antifraud Common Components agent contract

This public package owns domain-neutral controlled React screens shared by
health, veterinary, qualification, controller and marketplace applications.

Use red-green-refactor TDD and begin every test suite with a flow-contract
comment. Components may render and validate local presentation state and emit
intentions. They never authenticate, deliver OTPs, create sessions, fetch,
persist, sign, select tenants or grant authority. WebAuthn helpers may report
browser capability but never treat it as identity or authorization.
