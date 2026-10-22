# SV-11527 — Plaid NO_ACCOUNTS pauses the feed + reconnect in place (21 Oct 2026) — BLOCKED, nothing posted

Branch `sv11527` woken, build **v26.40.20-3fe1a3e** (index.html last-modified Tue 20 Oct 2026 11:51:36 GMT, etag
`69c0c28ff28add56360726109d18d9f5`). Ticket TESTING QA, assignee Nikola Mitrovic; PRs ShopView/shopview-accounting#105 (hub)
and ShopView/shopview#3838 (core card warning + Reconnect), both open.

## Blocker 1 — AccountingHub is not switched on for the branch's organization
- Admin (quick-login) has all 15 `accounting*` fe-permissions, but every `/api/accounting/...` call → **403 "Access denied."**
  and AccountingHub opens the "explore accounting" sales page.
- The org (d55bc308…) flags lack **Accounting** (`1f6dd61c-2e0d-4115-b3fe-2f09c66e781b`); snapshot `e527-flags-before.json`.
- `POST /api/organization/feature-flags` → **403**. The controller now has
  `#[IsGranted(StaffAdminVoter::STAFF_ADMIN_VIA_ADMIN_PORTAL_TOKEN)]` (test `testStaffAdminOverACookieSessionIsRefused`):
  only a staff admin with an admin-portal token can change flags. Nothing was changed.

## Blocker 2 — a paused feed can't be produced from QA
- The hub only pauses on a Plaid answer (NO_ACCOUNTS etc.). `PlaidClient` has no sandbox call (`/sandbox/item/reset_login`)
  and no item removal; the Plaid secret is server-side. No screen creates the state.

## Needed (asked the QA lead)
From Nikola: Accounting on for the sv11527 org, and one sandbox bank feed paused (e.g. `/sandbox/item/reset_login` on its
item, or its status set to error), so AC2 (warning on the card) and AC3 (Reconnect in place, no duplicates) can be checked
on screen. AC1/AC4 are back-end behaviours (PR tests) — observable only via Sentry/job logs, which QA doesn't have.

## Asked Nikola (QA lead: "Yes if that makes sense", 21 Oct)
Comment **79215** (tags Nikola Mitrovic): (1) switch Accounting on for the sv11527 org, (2) pause one sandbox feed and name
the bank card. Picture `ev/SV-11527_accounting-not-enabled.png`; height corrected in place 10:33 CDT with a dated note.

## 22 Oct 2026 — dropped
QA lead, verbatim: "for 11527 ignore it and do not remind me again." No further work or reminders on SV-11527.
