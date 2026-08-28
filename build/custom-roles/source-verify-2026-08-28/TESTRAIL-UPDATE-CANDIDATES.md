# TestRail update candidates — Custom Roles, 2026-08-28

**NOTHING HAS BEEN WRITTEN.** No `add_case`, no `update_case`, no run write, no result write.
Stopped at the button per Rule 6 — this list needs the QA lead's explicit go-ahead.
The Jira creation hold (Rule 62, register row H1) is untouched: **no ticket is proposed here.**

Audit basis: Confluence **565116952 v54 (2026-07-16)**, verified live **2026-08-28**.

---

## Candidate 1 of 1 — C27776

- **Case:** C27776 — https://shopview.testrail.io/index.php?/cases/view/27776
- **Title now:** *Verify Service Manager cannot reverse a work order invoice*
- **Section:** Custom Roles - (Revised) > Regression Suite (Minja's API file) > Service Manager
- **Ours?** Yes — `created_by = 3` (Bilal Muzamil). Created 2026-07-03, never updated.
- **Automated flag?** No (`custom_automation_type = 0`) — Rules 65 / 71 not triggered.
- **Refs now:** `SV-5319, SV-8093`

### Why it changes

| Source | Verbatim | Effect |
|---|---|---|
| PRD v54, Permission Matrix | Work Orders row, `Svc Mgr` cell = **`V/E/D`** (legend: *V = View, E = Create and Edit, D = Delete*) | Service Manager **has** Work Orders Delete |
| PRD v54 §1a Work Orders → Delete | *"Delete work orders, **Reverse Invoices** as long as validation criteria is met (e.g. no payments made)."* | Reversal is gated by WO Delete |
| PRD v54 Change Log, **2026-06-28** | *"Reversing an Invoice has been moved (for Work Orders and Part Sales). Previously: required Invoice & Payments → Delete. **Now: For WO requires Work Order → Delete.** For PS requires Part Sale → Delete."* | Confirms the move, and dates it |
| Jira **SV-8297** (Done, 2026-07-17) | *"Service Manager template should have Work Orders → Delete enabled (per current spec)"* | Agrees |
| Jira **SV-8093** (**OBSOLETE**) | *"Service Manager Template Incorrectly Grants Work Orders Delete Permission Instead of Matching C…"* | The ticket C27776 cites has been withdrawn |
| Our own **C26496** (updated 2026-07-20) | *"The Service Manager permissions match the expected set: Work orders View/Create & Edit, **Delete**…"* | Our suite already contradicts C27776 |

### Proposed new content

**Title**
> Verify Service Manager can reverse a work order invoice

**Preconditions**
> Log in to ShopView as a user assigned the Service Manager role. (this role has Work Orders =
> View/Create and Edit/Delete, and reversing a work order invoice is controlled by Work Orders:
> Delete).
> The work order already has an invoice created on its Finance tab.
> The invoice meets the validation criteria for reversal — for example, no payments have been made
> against it.

**Steps**
> 1. Open the work order's Finance tab.
> 2. Click Reverse on the invoice and confirm.

**Expected Results**
> The invoice is reversed successfully. The Finance tab shows the invoice as reversed and the work
> order returns to its pre-invoice financial state.
>
> Based on the Custom Roles and Permissions specification version 54 (Permission Matrix, Work Orders
> row; section 1a Work Orders, Delete; Change Log entry of 28 June 2026) and story SV-8297.
>
> AUTOMATION: READY

**Refs:** change `SV-5319, SV-8093` → **`SV-5319, SV-8297`** (SV-8093 is OBSOLETE).

### Rule 41 note

Touching this case means **re-verifying the whole case**, not just the changed sentence — there are no
surgical edits. The wording above is a full replacement of all four fields, drafted on that basis.

### Gate before writing

1. QA lead's go-ahead for the `update_case`.
2. Preferably PO confirmation that the stale *"(cannot reverse)"* parenthetical in the PRD's
   *Behavior Changes for Migrating Users → Service Manager* row is indeed residue from the 2026-06-28
   move. Three newer statements in the same document say Service Manager can reverse; that one line
   still says it cannot. We have **not** resolved it from the build or the code (Rules 57, 58).

---

## Explicitly NOT proposed for change

- **C27792** (*Service Advisor cannot delete a work order*) and **C27805** (*Foreman cannot delete a
  work order*) — **correct as they stand.** Do not change them because staging behaves differently;
  the build is not a source of expectation (Rule 57).
- **C29469** — foreign (`created_by = 1`). **Report, never edit** (Rule 38). Nothing wrong with it
  anyway.
- The **31 cases citing "spec v33"** — stale provenance stamps, a real Rule-54 finding, but a
  separate batch of work and not part of this audit's mandate.

---

## OUTSTANDING — what I need from you

1. Go-ahead for the single `update_case` on **C27776**.
2. Confirmation of the Custom Roles PO, so the spec-cleanup question can be routed.
