# Work-Order DELETE — case audit, Custom Roles suite, 2026-08-28

Scope pulled by script, **fully paged** (`get_cases/1&suite_id=1`, 250 per page → **4,580 cases** in
the estate; **684 sections**). TestRail has **one project** (`ShopView - APP`, id 1) in
**single-suite mode**, so this is the complete estate — nothing is hiding in another project.

`Custom Roles - (Revised)` = section **3527**, 58 sections in the subtree:
**714 cases · 515 ours (`created_by = 3`, Bilal Muzamil) · 199 foreign.**
Matches the CLAUDE.md §3 figures exactly.

Authority for every verdict below: **Confluence 565116952 "Custom Roles and Permissions" v54
(2026-07-16)** — see `PERMISSION-MATRIX-v54.md`.

> **Work Orders row, v54:** Admin V/E/D · Svc Mgr **V/E/D** · Sr. SA V/E/D · **Svc Advisor V/E** ·
> **Foreman V/E** · Tech V · Parts Mgr V/E · Parts Tech V · Office V · Sales Rep V · Time Clock V
> *(V = View, E = Create and Edit, D = Delete, — = OFF)*

---

## A · Cases that assert a per-role WORK ORDER delete outcome

There are exactly **five**. All five are **ours**.

| C-id | Link | Title | Asserts | PRD v54 says | Verdict |
|---|---|---|---|---|---|
| C27783 | [view](https://shopview.testrail.io/index.php?/cases/view/27783) | Verify Senior Service Advisor **can** delete a work order | Sr. SA has WO Delete | Sr. SA = **V/E/D** | ✅ **CORRECT** |
| C27792 | [view](https://shopview.testrail.io/index.php?/cases/view/27792) | Verify Service Advisor **cannot** delete a work order | Svc Advisor has **no** WO Delete | Svc Advisor = **V/E** | ✅ **CORRECT** |
| C27805 | [view](https://shopview.testrail.io/index.php?/cases/view/27805) | Verify Foreman **cannot** delete a work order | Foreman has **no** WO Delete | Foreman = **V/E** | ✅ **CORRECT** |
| C27834 | [view](https://shopview.testrail.io/index.php?/cases/view/27834) | Verify Parts Manager **cannot** delete a work order | Parts Mgr has **no** WO Delete | Parts Mgr = **V/E** | ✅ **CORRECT** |
| C26384 | [view](https://shopview.testrail.io/index.php?/cases/view/26384) | Without Delete, no delete option is shown on a work order | generic toggle behaviour, role-agnostic | §1a Work Orders | ✅ **CORRECT** |

**No case anywhere in the estate asserts that Service Advisor or Foreman CAN delete a work order.**

C27792 precondition, verbatim — note it even pre-empts the build's different label:

> Log in to ShopView as a user assigned the Service Advisor role. (this role has Work Orders =
> View/Create and Edit, NO Delete).
> **Note: the role may display as 'Junior Service Advisor' in the build (the spec calls it 'Service
> Advisor').**
> The work order is in Uncomplete status (a work order must be Uncomplete before it can be deleted).

C27805 precondition, verbatim:

> Log in to ShopView as a user assigned the Foreman role. (this role has Work Orders = View/Create
> and Edit, NO Delete).
> The work order is in Uncomplete status (a work order must be Uncomplete before it can be deleted).

Both expectations require the delete to be **BLOCKED**. So on the staging behaviour our QA
automation engineer reports, **both cases would correctly FAIL.**

## B · Per-role permission-summary cases vs the v54 matrix

All eleven checked cell-by-cell against the matrix — full side-by-side in
`PER-ROLE-CASE-VS-MATRIX.md`. **All eleven agree with v54 on every CRUD area.**

| C-id | Role | Case says for Work Orders | v54 | Verdict |
|---|---|---|---|---|
| C26495 | Administrator | "every add/edit/delete area full" | V/E/D | ✅ |
| C26496 | Service Manager | "Work orders View/Create & Edit, Delete" | V/E/D | ✅ |
| C26497 | Senior Service Advisor | "Work orders full" | V/E/D | ✅ |
| **C26498** | **Service Advisor** | **"Work orders View/Create & Edit (no Delete)"** | **V/E** | ✅ |
| **C26499** | **Foreman** | **"Work orders View/Create & Edit (no Delete)"** | **V/E** | ✅ |
| C26500 | Technician | "Work orders View only" | V | ✅ |
| C26501 | Parts Manager | "Work orders View/Create & Edit (no Delete)" | V/E | ✅ |
| C26502 | Parts Technician | "Work orders View only" | V | ✅ |
| C26503 | Office User | "Work orders View only" | V | ✅ |
| C26504 | Sales Representative | "Work Order: View" | V | ✅ |
| C26505 | Time Clock User | "Work orders View, Schedule View, Timesheets View; everything else off" | V | ✅ |

C26328 (*Applying a template pre-fills the Create Role page*) also states verbatim:

> The permissions are pre-filled to match the **Service Advisor template (for example Work orders
> View and Create & Edit on, Delete off).**

✅ Correct.

## C · The one case that IS wrong — C27776

**C27776 — https://shopview.testrail.io/index.php?/cases/view/27776**
*"Verify Service Manager cannot reverse a work order invoice"* · ours (`created_by = 3`) ·
created 2026-07-03 · **never updated since** · refs `SV-5319, SV-8093`.

Precondition, verbatim:

> Log in to ShopView as a user assigned the Service Manager role. (reversing a work order invoice
> requires Work Orders: Delete **per spec v33**; **Service Manager has Work Orders = View/Create and
> Edit, NO Delete**).

Expected, verbatim:

> Reversing the invoice is BLOCKED: the Reverse action is hidden or disabled, or clicking it returns
> a permission error. (Known failure SV-8093 was raised when this was allowed - retest.)

**This is wrong on the current source, three ways over:**

1. **PRD v54 matrix:** Service Manager Work Orders = **V/E/D**. The role *does* have Delete. (It also
   had V/E/D in our own 2026-07-15 export, line 535 — so this case never matched the matrix.)
2. **PRD v54 §1a Work Orders → Delete**, verbatim: *"Delete work orders, **Reverse Invoices** as long
   as validation criteria is met (e.g. no payments made)."* And **Change Log 2026-06-28**, verbatim:
   *"Reversing an Invoice has been moved (for Work Orders and Part Sales). Previously: required
   Invoice & Payments → Delete. **Now: For WO requires Work Order → Delete.** For PS requires Part
   Sale → Delete."*
3. **Our own C26496** says Service Manager has *"Work orders View/Create & Edit, **Delete**"* — the
   two cases contradict each other. C26496 was corrected on **2026-07-20** in the amendment pass;
   C27776 sits in the *Regression Suite (Minja's API file)* tree and was missed.

**Jira agrees:** **SV-8093** *"Service Manager Template Incorrectly Grants Work Orders Delete
Permission Instead of Matching C…"* — the very ticket C27776 cites — is now **OBSOLETE**, and
**SV-8297** *"Service Manager template should have Work Orders → Delete enabled (per current spec)"*
is **Done** (2026-07-17). C27776 is chasing a finding that was reversed.

### A stale sentence in the PRD that helps explain it

PRD v54 *Migration Plan → Behavior Changes for Migrating Users* still reads:

> **Service Manager** | Loses Invoicing Delete **(cannot reverse)**. Loses Settings: Service, Parts,
> Finance, Data Import. Gains Billing Portal, Customer Portal. | Mixed

The parenthetical *"(cannot reverse)"* is **residue from before the 2026-06-28 move** — the change
log itself says reversal *"Previously: required Invoice & Payments → Delete"*. Latest-wins within the
same document (Rule 32) puts §1a + the matrix + the change log (three concordant statements, the
newest of them) ahead of one stale parenthetical. **Flagged to the PO as a documentation cleanup**,
not treated as a live contradiction — but the correction to C27776 should be made only after the PO
confirms, and **no write has been made** (Rule 6, Rule 58).

## D · The other 42 hits in the "work order + delete" sweep

48 cases in the subtree mention a work order and a delete (47 ours, 1 foreign). Beyond §A–§C the
remainder assert **something other than a per-role Work Order delete permission** and were each read:

- **Work Order LINE delete** (a different matrix row, where Svc Advisor and Foreman **do** have D):
  C26391, C27753, C27784, **C27806** *"Verify Foreman can delete a work order line"* — ✅ correct,
  matrix `WO Lines / Foreman = V/E/D`, and corroborated by the PRD's own *"Foreman | **Gains WOL
  Delete**"* behaviour-change row.
- **Work order NOTES** (gated by WO View for your own note, WO Delete for other people's):
  C27763, C27764, C27777, C27778, C27790, C27802, C27803, C27827, C27828, C27853, C27854 —
  all consistent with §1a (*"Delete any note, including notes created by other users"*).
- **Invoice reversal** (gated by WO Delete since 2026-06-28): C27760 ✅, C27788 ✅, C27800 ✅,
  C27812 ✅, C27837 ✅, **C27776 ✗ (see §C)**.
- **Generic permission-toggle behaviour**, role-agnostic: C26374, C26375, C26376, C26380, C26389,
  C26390, C26422, C26541, C26342, C26328.
- **Foreign**: **C29469** (`created_by = 1`, Vladimir Tomovic) — *"Custom role (WO Lines C&E on,
  Delete off): delete/reopen inspections on a Completed line"*. **Rule 38: report, never edit.**
  Its stated precondition grants the custom role WO View + C&E + **Delete**, which is a legitimate
  custom-role configuration (not a system-role template), so it does not conflict with the matrix.

## E · The four cases named in the automation report

| Case | Exists in TestRail? | `created_by` | Ownership | Assertion vs v54 |
|---|---|---|---|---|
| **C20957** | **NO** — `get_case/20957` → HTTP 400 *"Field :case_id is not a valid test case."* | n/a | n/a | n/a |
| **C20958** | **NO** — same 400 | n/a | n/a | n/a |
| **C27792** | Yes | **3 (Bilal Muzamil) = OURS** | ours | ✅ correct |
| **C27805** | Yes | **3 (Bilal Muzamil) = OURS** | ours | ✅ correct |

**On C20957 / C20958.** Live case IDs jump straight from **19563 to 22178** — the whole block is
absent. The same gap is present in our **2026-07-31 snapshot**
(`build/testrail-run-sync-2026-07-31/snapshot-2026-07-31/live-cases-index.json`, 4,085 cases), so
these IDs have not existed for at least a month, and TestRail runs one project in single-suite mode
so there is nowhere else for them to be. **The automation suite's `test.skip()` annotations point at
case IDs that do not exist.** That is a real traceability defect in the automation repo — not a
manual-suite problem, and not something to fix from here.

**On "new, PR #2819".** Our **2026-07-31 snapshot already contains C27792 *"Verify Service Advisor
cannot delete a work order"* and C27805 *"Verify Foreman cannot delete a work order"* under the same
titles.** They are **not new** — they date from the 2026-07-03 regression-suite authoring pass. What
*is* new is that **Vladimir Tomovic (`updated_by = 1`) edited both bodies on 2026-08-27 21:28 UTC**,
the day before this audit. Titles were unchanged; we hold no prior body snapshot, so **the content of
his edit is not diffable** (Rule 87 — we should have had one). The bodies as they stand today are
correct against v54.

Neither case is flagged **Automated** in TestRail (`custom_automation_type = 0`), so Rules 65 and 71
are not triggered.

## F · Broader sweep against the source deltas

**There were no source deltas since 2026-07-27** (see `SOURCE-VERIFICATION.md` §1–§2), so this sweep
found nothing driven by new sources.

Separately, our locally stored spec export
(`build/custom-roles-spec-update/current-spec-2026-07-15.md`) is **one version behind** the live PRD.
Diffing its matrix against v54 gives **five changed cells**:

| Area / role | Held export (2026-07-15) | Live v54 | Our case | Status |
|---|---|---|---|---|
| Work Orders / Office | — | **V** | C26503 says "Work orders View only" | ✅ already on v54 |
| WO Lines / Office | V | **—** | C26503 says "Work order lines off" | ✅ already on v54 |
| Part Sales / Office | — | **V** | C26503 says "Part sales View only" | ✅ already on v54 |
| Invoicing / Svc Advisor | V/E/D | **V/E** | C26498 says "Invoicing & payments View/Create & Edit" | ✅ already on v54 |
| Reports / Sr. SA | ON | **—** | C26497 says "Reports OFF" | ✅ already on v54 |

**All five were already absorbed into the cases** by the 2026-07-20 amendment pass — it is only the
local *export file* that was never refreshed. Low-risk bookkeeping, listed in §OUTSTANDING.

## G · Pre-existing hygiene gaps noticed (NOT acted on)

- **Provenance lines (Rule 54) are missing across most of this suite** — only **103 of 714** cases
  carry a source/provenance or `AUTOMATION:` marker (10 of the 116 Regression-Suite cases). This
  predates today's work and is out of scope; raised as a follow-up.
- **31 cases still cite "spec v33"**; the live spec is **v54**. Versions cited across the suite are
  v15, v33 and v39. Stale stamps are a finding under Rule 54.

---

## OUTSTANDING — what I need from you

1. **Approve the C27776 correction** (one `update_case`). Nothing has been written — stopped at the
   button per Rule 6.
2. **PO confirmation** on the stale *"(cannot reverse)"* parenthetical in the PRD's Service Manager
   behaviour-change row, so the source stops contradicting its own §1a.
3. **Who is the PO for Custom Roles?** Still recorded as unknown.
