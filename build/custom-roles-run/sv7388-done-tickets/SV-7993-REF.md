# SV-7993 — Office User: Legacy Role Specs vs Legacy role verification in one ticket.

> REFERENCE ticket (Bug, **STILL OPEN** — not Done). Fetched because SV-8345's obsolete
> ruling points to its comment 73184. **The Office invoices/payments contradiction is
> UNRESOLVED with Sasha as of 2026-07-15.**

- **Type:** Bug
- **Status:** Open (assigned to Sasha Grosman to document clarifications)
- **Created:** 2026-06-28  **Updated:** 2026-07-15T01:22
- **Link:** https://shopview.atlassian.net/browse/SV-7993

## Description (Office legacy-vs-custom gaps, with Sasha's inline "SG:" rulings)

| Legacy Office could | Custom Office cannot | Blocking permission — Sasha ruling |
| --- | --- | --- |
| Edit/See Engine Hours | ✗ | WO Lines View-only — **SG: should be fixed by SV-7929** |
| Edit/See Mileage | ✗ | WO Lines View-only — **SG: should be fixed by SV-7929** |
| Edit/See License Plate | ✗ | WO Lines View-only — **SG: should be fixed by SV-7929** |
| Fault Code lookup | ✗ | WO View-only (needs C&E) — **SG: OK (accepted loss)** |
| Add line note | ✗ | WO Lines C&E gate — **SG: OK** |
| Save as canned line | ✗ | WO Lines C&E gate — **SG: OK** |
| Story history (line) | ✗ | WO Lines C&E gate — **SG: OK** |
| Audit log (line) | ✗ | WO Lines C&E gate — **SG: OK** |
| Send to Portal | ✗ | depends on WO Lines C&E — **SG: I'm looking into it** |
| Add Deposit | ✗ | Invoicing C&E — **SG: I'm looking into it** |
| Delete Payments | ✗ | Invoicing Delete — **SG: I'm looking into it** |
| Vendors Payments | ✗ | Vendor&Order Mgmt C&E — **SG: I'm looking into it** |
| Customer Payments | ✗ | Invoicing C&E — **SG: I'm looking into it** |

## Comments (4 of 4)

### Sasha Grosman — 2026-07-03T09:02

Updated with my comments in the "What's blocking it" column. Looking into a few items to
sanity check the default permissions are correct.

### Sasha Grosman — 2026-07-07T17:40 (edited 07-07T23:31)

Office user cannot create an invoice, but can make deposits and payments and credits.

New requirement:
* The Create Invoice button is disabled for users assigned to the Office User role
* This is true on Work Orders and Part Sales

Spec is updated.

### parth fadadu — 2026-07-10T01:08 (comment 73184)

Office should not create invoices but should create deposits/payments/credits — yet all these
actions are controlled by the same permission (Invoicing & Payments → Create & Edit), which
Office lacks. Granting it would also allow invoice creation. Please clarify. Also: Send to
Portal exists for legacy roles but not custom roles — how to handle?

### Sasha Grosman — 2026-07-13T08:19

FS Triage: parth is clear, but Sasha wants to ensure alignment. Assigned to Sasha to review
and document clarifications before ready-to-fix.

## Status for reconciliation

- The hard rule "Office cannot create invoices" (spec 7/7, Key Decisions) still stands in the
  spec, but HOW Office makes payments without Invoicing C&E is an OPEN question with Sasha
  (comment 73184 unanswered as of 2026-07-15; SV-8345 closed OBSOLETE deferring here).
- Office-related invoice/payment cases should be flagged OPEN-QUESTION, not rewritten to a
  definitive expected result.
