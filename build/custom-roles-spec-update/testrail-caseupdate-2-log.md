# TestRail Case-Update Audit Log — Custom Roles Spec Update (Phase 1, pass 2)

**Date:** 2026-07-09
**Actor:** worker agent (bilal.muzamil@shopview.com)
**Scope:** cases in TestRail RUN 331 (project 1 / suite 1).
**API:** `POST index.php?/api/v2/update_case/{id}` (Basic auth). Only the fields
listed per case were sent; all other case fields (section, type, refs, template)
were left untouched. Nothing was deleted.

All three updates returned **HTTP 200** and were **re-fetched and verified**
(new text present, old text removed).

---

## C2528 — "Customer Portal hidden for non-admin roles" (section 303, Roles and Permissions)

- **HTTP:** 200 · **Verified:** YES
- **Fields changed:** `custom_preconds`, `custom_expected`
- **Reason:** Spec now grants Customer Portal to Service Advisor, Senior SA, Service
  Manager, Parts Manager (+ Administrator). The case wrongly listed SM/SA/PM as
  roles where Customer Portal is hidden.
- **Preconds — old:** "User is logged in as Service Manager, Service Advisor,
  Foreman, Technician, Parts Manager, Parts Technician, Office, or Time Clock User"
- **Preconds — new:** "User is logged in as Foreman, Technician, Parts Technician,
  Office, or Time Clock User"
- **Expected — old:** "Customer Portal option is not visible / Non-admin roles
  cannot access customer portal settings"
- **Expected — new:** "Customer Portal option is not visible for these roles / Per
  the updated spec, the Customer Portal page-access toggle is ON only for
  Administrator, Service Manager, Senior Service Advisor, Service Advisor, and Parts
  Manager; the roles checked here (Foreman, Technician, Parts Technician, Office,
  Time Clock User) do not have it and cannot access customer portal settings"

## C26424 — "Enabling Invoicing & Payments → Delete While Manage AP/AR Is OFF SHOULD Prompt the User to Enable AP/AR" (section 3539, Invoicing and Payments Permissions)

- **HTTP:** 200 · **Verified:** YES
- **Fields changed:** `custom_expected`
- **Reason:** AP/AR setting was renamed (10 Jun) from "View and Manage AP/AR" to
  "Manage Accounts Payable and Receivable"; the expected still named the old label
  (with a pasted inline-style span).
- **Expected — old:** "The System should prompt the user to enable *View and Manage
  AP/AR Data*" (with a large pasted inline style span)
- **Expected — new:** "The system should prompt the user to enable **Manage
  Accounts Payable and Receivable** (this is the setting formerly labelled 'View and
  Manage AP/AR')."
- **Behaviour tested (unchanged):** enabling Invoicing → Delete with Manage AP/AR
  OFF prompts to enable Manage AP/AR — matches spec §1i.

## C26475 — "Turning See Financial OFF …" (section 3544, See Financial Data)

- **HTTP:** 200 · **Verified:** YES
- **Fields changed:** `title`, `custom_steps`, `custom_expected`
- **Reason:** Spec §5a (Change Log 01 Jul) changed the mechanic from a **silent
  auto-clear** of dependent CRUDs to a **prompt** that lists the dependent settings
  to disable (Invoicing CRUD, Part Sales CRUD, Order Parts, Manage AP/AR); confirm
  disables, cancel keeps SFD ON.
- **Title — old:** "Turning See Financial OFF auto-clears Part sales, Invoicing and
  Payments CRUDs"
- **Title — new:** "Turning See Financial Data OFF prompts the user to disable the
  dependent settings (Part Sales, Invoicing & Payments, Order Parts, Manage AP/AR)"
- **Steps — old:** turn SFD OFF → inspect Part Sales checkboxes → inspect Invoicing
  checkboxes.
- **Steps — new (numbered):** 1. turn SFD OFF · 2. observe the confirmation prompt ·
  3. read the list of dependent settings named in the prompt · 4. confirm to disable
  the listed settings, then inspect the Part Sales / Invoicing rows.
- **Expected — old:** "All 6 checkboxes … auto-uncheck."
- **Expected — new (numbered):** 1. SFD OFF does NOT silently uncheck dependents;
  a prompt appears · 2. the prompt lists the dependents that must be disabled
  (Invoicing CRUD, Part Sales CRUD, Order Parts, Manage AP/AR — whichever are ON) ·
  3. confirming disables them; cancelling keeps SFD ON with no change.

---

## Integrity checks
- **Only in-scope (RUN 331) cases touched:** yes — the 3 case IDs are all members
  of run 331 (`run331-tests.json`).
- **No case deleted / no section/type/refs moved.** Only text fields updated.
- **All three re-fetched:** new strings present, superseded strings absent.
