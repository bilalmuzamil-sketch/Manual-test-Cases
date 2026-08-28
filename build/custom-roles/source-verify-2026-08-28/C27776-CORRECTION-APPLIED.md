# C27776 — the drafted correction APPLIED, 2026-08-28

**Case:** C27776 — <https://shopview.testrail.io/index.php?/cases/view/27776> · section 3668
(Custom Roles - (Revised) > Regression Suite (Minja's API file) > Service Manager) · `created_by = 3`
(ours) · `custom_atmstatus = 1` (**not** Automated — Rules 65 / 71 not triggered).

**Authority:** the QA lead's explicit go-ahead for this single `update_case`, which was the exact ask
in `TESTRAIL-UPDATE-CANDIDATES.md` §"Gate before writing". **One case. No ticket was created — the
Rule-62 hold is untouched.**

---

## 1 · Container check BEFORE the write

All three text fields rendered in the **bare `markdown`** container (the escaping one), so an API
write would have stored `<p>…</p>` and printed the tags on the tester's page. **The correction was
therefore made through the TestRail UI editor**, not the API.

## 2 · What the case now says

| Field | Before | After |
|---|---|---|
| Title | Verify Service Manager **cannot** reverse a work order invoice | Verify Service Manager **can** reverse a work order invoice |
| Refs | `SV-5319,SV-8093` | `SV-5319,SV-8297` (SV-8093 is **OBSOLETE**; SV-8297 is the story that agrees) |
| Preconditions | *"…requires Work Orders: Delete per spec v33; Service Manager has Work Orders = View/Create and Edit, NO Delete"* | *"…this role has Work Orders = View/Create and Edit/Delete, and reversing a work order invoice is controlled by Work Orders: Delete"*, plus the reversal validation precondition |
| Steps | *"Look for a Reverse option; if present, click it"* | *"Click Reverse on the invoice and confirm"* |
| Expected | *"Reversing the invoice is BLOCKED… (Known failure SV-8093…)"* | *"The invoice is reversed successfully…"* + Rule-54 provenance + a disclosure note |
| AUTOMATION marker | **absent** | `AUTOMATION: READY` (last line) |

Rule 41 was honoured: **all four fields were re-derived and rewritten** — there was no surgical edit.

## 3 · The source, re-read immediately before the write (Rule 59)

Confluence **565116952 — "Custom Roles and Permissions" — version 54**, confirmed live on
**2026-08-28**. Three statements in that version, verbatim:

1. **Permission Matrix**, Work Orders row, `Svc Mgr` cell = **`V/E/D`** (legend: V = View, E = Create
   and Edit, D = Delete).
2. **§1a Work Orders → Delete:** *"Delete work orders, **Reverse Invoices** as long as validation
   criteria is met (e.g. no payments made)."*
3. **Change Log, 2026-06-28:** *"Reversing an Invoice has been moved (for Work Orders and Part Sales).
   Previously: required Invoice & Payments → Delete. **Now: For WO requires Work Order → Delete.**
   For PS requires Part Sale → Delete."*

Jira **SV-8297** (Done, 2026-07-17) agrees. Jira **SV-8093**, the ticket the old case cited, is
**obsolete**.

## 4 · The one contradiction inside the source — disclosed, not resolved from the build

The same v54 page still carries, in the *Behavior Changes for Migrating Users* table:

> *"Service Manager **Loses Invoicing Delete (cannot reverse)**. Loses Settings: Service, Parts,
> Finance, Data Import. Gains Billing Portal, Customer Portal."*

Under the 2026-06-28 model, **Invoicing: Delete** governs deleting/reversing **payments**, while
reversing a **work order invoice** moved to **Work Orders: Delete** — so that row reads as residue
from before the move. **It was NOT resolved by looking at the build (Rule 58).** The case now carries
a plain-English note telling the tester exactly this, and it is logged as a PO question.

## 5 · Verification AFTER the write

| Check | Result |
|---|---|
| Anonymous `markdown*` containers on the view page | **3** |
| `custom_preconds` / `custom_steps` / `custom_expected` container | **`markdown fr-view`** on all three (was bare `markdown`) |
| Literal tags visible to the tester | **none** |
| HTML entities visible as text | **none** |
| Rendered text vs intended text | **matches** on all three fields |
| `AUTOMATION` marker | present exactly once, **last**: `AUTOMATION: READY` |
| Provenance line | present, **PRD version 54, read on 28 August 2026** |
| Title applied | yes |
| `refs` applied | `SV-5319,SV-8297`, byte-verified by API re-GET |
| `custom_atmstatus` | **1 — unchanged** |

## 6 · The contradiction with C26496 is GONE — and C26496 needs NO change

| | Says |
|---|---|
| **C26496** — <https://shopview.testrail.io/index.php?/cases/view/26496> (Automated, `atm = 3`, untouched) | *"The Service Manager permissions match the expected set: Work orders View/Create & Edit, **Delete**; … Invoicing & payments View/Create & Edit (no Delete)…"* |
| **C27776** (as corrected today) | Service Manager **can** reverse a work order invoice, **because** reversal is controlled by Work Orders: Delete |

Both now assert that Service Manager **has Work Orders: Delete**. They agree. **C26496 was already
right, so it was not edited** — and because it is Automated, editing it would have needed a separate
go-ahead anyway (Rules 65 / 71). Its rendered page was read on 2026-08-28 and is clean
(`markdown fr-view`, no literal tags).

## OUTSTANDING — what I need from you

1. **A PO question for Sasha (Custom Roles):** please confirm the *"Service Manager … (cannot reverse)"*
   line in the migrating-users table of PRD v54 is leftover text from before the 28 June 2026 move, so
   the page can be tidied. The case is correct either way; the note in it is what would come out.
2. Nothing else — no ticket was created, and no second case was edited.
