# Are our Custom Roles test cases safe? — 2026-08-28

**Short answer: yes, on the thing you asked about — and the staging finding is our cases doing their
job, not our cases being wrong.**

One unrelated case (**C27776**) *is* out of date and should be corrected. Details below.

Prepared for the QA lead. Sources checked live today. **No changes were made to TestRail or Jira** —
everything below stops at the button.

---

## 1 · What was asked

Our QA automation engineer reported on 2026-08-28 that on staging a **Service Advisor**
(`qa_junior_service_advisor`) and a **Foreman** can both see and use **Delete** on a work order, when
neither should be able to. The question for us: **do any of our manual test cases still expect the
old behaviour, and would they therefore send a tester the wrong way?**

## 2 · What the documents say (and only the documents)

We take expected behaviour from the written sources, never from the build and never from the product
code (Rule 57).

The **Custom Roles and Permissions** spec — Confluence page **565116952**, **version 54**, last
modified **2026-07-16** — contains a table called **Permission Matrix**. Its legend, word for word:

> **V = View, E = Create and Edit, D = Delete, — = OFF**

and its Work Orders row, word for word:

| Area | Admin | Svc Mgr | Sr. SA | **Svc Advisor** | **Foreman** | Tech | Parts Mgr | Parts Tech | Office | Sales Rep | Time Clock |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Work Orders** | V/E/D | V/E/D | V/E/D | **V/E** | **V/E** | V | V/E | V | V | V | V |

**Service Advisor = V/E. Foreman = V/E. Neither has D. So neither should be able to delete a work
order.** The spec is clear, not silent and not self-contradictory on this point, so there is **no PO
question to ask here** (Rule 58 does not bite).

The staging user is named `qa_junior_service_advisor`. The spec's own migration table confirms that
is the right role to look at:

> | Legacy Role | New System Role | Migration Type |
> | Service Advisor | `system-ssa` — **Senior SA** | Renamed + expanded |
> | **SA Limited View** | **`system-jsa` — Service Advisor** | Mapped to new role — AP/AR OFF preserves restriction |

So the build's "Junior Service Advisor" is the spec's **"Svc Advisor"** column — the one reading
**V/E**. (The role the spec calls *Senior* SA is the separate column, and that one **does** get
Delete.)

**SV-7480** — *"[CRP-BE-05] Rewrite role→bundle defaults to the 12-role PRD matrix"*, **Done**,
fix version **v0.68 released 2026-07-27** — says nothing itself about Service Advisor or Foreman work
order delete. What it does is point at the matrix as the authority:

> **Acceptance criteria** — `RoleFePermissionMappings::getMappings()` matches the matrix for all 12
> roles · Golden-master test: each role's resolved bundle set == matrix
> **Reference** — Tech plan §3c. PRD matrix (565116952 / 573636610 S22).

So SV-7480 hands the question back to the spec, and the spec answers it.

> **A note on the code.** `IntentionalAtomChanges.php` is **product source code**. It can tell us what
> was *implemented*, and it happens to agree with the spec here — but it is **corroboration only, and
> never the expectation itself** (Rule 57; skill 17 §3). Nothing in this report rests on it.

## 3 · Are our cases correct?

**Yes.** We pulled every Custom Roles case — the full estate, properly paged (4,580 cases, 684
sections; **714** in the Custom Roles tree, **515 ours**, 199 someone else's) — and read every case
that says anything about a work order and a delete (**48** of them).

- **Five cases** assert a per-role *work order* delete outcome. **All five match the spec.**
- **Eleven cases** list a whole role's expected permission set. **All eleven match the spec**, on
  every area, not just work orders.
- **Zero cases anywhere assert that Service Advisor or Foreman CAN delete a work order.**

The two cases most directly on point read as follows today:

- **C20957** — *does not exist in TestRail.* See §5.
- **C20958** — *does not exist in TestRail.* See §5.
- **C27792** — *"Verify Service Advisor cannot delete a work order"* — expects the delete to be
  **BLOCKED**. Correct.
- **C27805** — *"Verify Foreman cannot delete a work order"* — expects the delete to be **BLOCKED**.
  Correct.

## 4 · So which is it — our cases, or the environment?

**(ii) Our cases are RIGHT, and they are correctly exposing an environment/data gap.**

On the behaviour reported from staging, C27792 and C27805 would both **fail** — which is exactly what
a correct test case is supposed to do when the environment is wrong. Nothing in our suite would tell
a tester that the delete button is expected.

The written record also explains *how* a correct build can still behave that way on one environment.
**SV-7485** — *"[CRP-BE-10] Legacy→v2 role migration rework"*, **Done** — describes the reconciliation
command, word for word:

> Rewrite `AssignV2RolesToExistingUsers` to migrate all existing users 15→12 correctly. … Idempotent
> (`WHERE role_v2_id IS NULL`); **org-scoped**; never reassign users already on a custom role.

**Org-scoped** means it has to be run **once per organization**. An organization it was never run
against keeps its old role wiring, and its users keep permissions the current model says they should
have lost. That is a per-environment data gap, and it is entirely consistent with the report that the
E2E staging org was never reconciled.

**We have not verified that ourselves.** This was a source-and-cases audit; nobody logged in to
staging, and the last build verification for this project was **2026-07-27**. So the environment
explanation is *supported by the documents and consistent with the report* — it is **not** an
observation we made (Rule 12).

**What this is not:** it is not evidence that the permission model changed, and it is not a reason to
touch C27792 or C27805.

## 5 · The four cases named in the report — ownership

| Case | In TestRail? | Created by | Ours or someone else's? | What to do |
|---|---|---|---|---|
| **C20957** | **No** | — | — | Nothing here. See below. |
| **C20958** | **No** | — | — | Nothing here. See below. |
| **C27792** | Yes | **Bilal Muzamil (`created_by = 3`)** | **OURS** | Nothing — it is correct |
| **C27805** | Yes | **Bilal Muzamil (`created_by = 3`)** | **OURS** | Nothing — it is correct |

**C20957 and C20958 do not exist.** The API returns *"Field :case_id is not a valid test case."* for
both. Live case IDs jump straight from 19563 to 22178, and the same gap is in our **2026-07-31
snapshot**, so they have not existed for at least a month. TestRail runs a single project in
single-suite mode, so there is nowhere else they could be. **The automation suite is skipping tests
against case IDs that no longer exist** — worth telling the automation engineer, but it is an
automation-repo bookkeeping problem, not ours to fix.

**"C27792, C27805 (new, PR #2819)" is not accurate either.** Both were already present, under exactly
these titles, in our 2026-07-31 snapshot; they date from the 2026-07-03 authoring pass. What is new
is that **Vladimir Tomovic edited both case bodies on 2026-08-27 at 21:28 UTC**, the day before this
audit. The titles did not change and the bodies as they stand today are correct. We hold no earlier
copy of the bodies, so we cannot show what he changed — a gap in our own snapshotting we should
close.

## 6 · The one case that DOES need updating

Found while sweeping — unrelated to Service Advisor and Foreman, but it would genuinely misdirect a
tester.

| C-id | Link | Role | What it says now | What the spec says | What needs to be done |
|---|---|---|---|---|---|
| **C27776** | [view](https://shopview.testrail.io/index.php?/cases/view/27776) | Service Manager | *"Verify Service Manager **cannot** reverse a work order invoice"* — precondition asserts *"Service Manager has Work Orders = View/Create and Edit, **NO Delete**"*, expects reversal **BLOCKED** | Service Manager Work Orders = **V/E/D** (has Delete). §1a: *"Delete work orders, **Reverse Invoices** …"*. Change Log 2026-06-28: *"**Now: For WO requires Work Order → Delete**"* | **Rewrite so Service Manager CAN reverse a work order invoice.** Flip the title to "can reverse", correct the precondition to *"this role has Work Orders: Delete"*, change Expected to the reversal succeeding, drop the *"Known failure SV-8093 … retest"* note (SV-8093 is **OBSOLETE**; **SV-8297** *"Service Manager template should have Work Orders → Delete enabled (per current spec)"* is **Done**), and re-stamp the provenance to spec **v54** instead of the "spec v33" it cites. **Awaiting your go-ahead — no write made.** |

Why it slipped: our own **C26496** (*Service Manager: role permissions match the expected set*)
already says *"Work orders View/Create & Edit, **Delete**"* — it was corrected on **2026-07-20**.
C27776 lives in the *Regression Suite (Minja's API file)* tree, was created **2026-07-03** and has
**never been updated**, so that pass missed it. The two cases currently contradict each other.

**One thing for the PO.** The spec's *Behavior Changes for Migrating Users* table still reads
*"Service Manager | Loses Invoicing Delete **(cannot reverse)**"*. That parenthetical is left over
from before invoice reversal moved out of Invoicing on **2026-06-28** — the change log says so
itself (*"Previously: required Invoice & Payments → Delete"*). Three newer statements in the same
document all say Service Manager can reverse, so we are treating the parenthetical as stale text; we
would still like the PO to confirm and tidy it, and **we have not written the C27776 fix in the
meantime.**

## 7 · Anything else contradicted by newer sources?

**No.** Every Custom Roles source is **unchanged since our last check on 2026-07-27**:

| Source | Version now | Last changed | Changed since 2026-07-27? |
|---|---|---|---|
| Spec — Confluence 565116952 | **v54** | 2026-07-16 | **No** |
| Its 6 child pages | v1–v7 | 2026-05-12 → 2026-07-15 | **No** |
| Jira epic SV-7388 | **269 children** | — | **No** — 0 added, 0 removed |
| SV-7480 | Done, v0.68 | 2026-07-27 | **No** |

Only one epic child moved at all since 2026-07-27: **SV-8078** (Done 2026-08-03), about Vendor &
Order Management showing Total Cost — nothing to do with work order delete.

Our locally stored copy of the spec is one version stale (taken 2026-07-15, live is v54 from
2026-07-16). We diffed the two: **five cells changed**, and **all five are already reflected in the
cases** — it is only the stored copy that needs refreshing.

## 8 · Verdict

> **SAFE on work order delete.** No test case of ours tells a tester that Service Advisor or Foreman
> should be able to delete a work order. C27792 and C27805 assert the correct expectation, and if
> they fail on staging they are working as designed — the evidence points to an un-reconciled
> organization, not to a wrong test case.
>
> **One exposure, elsewhere: C27776** wrongly says Service Manager cannot reverse a work order
> invoice. A tester running it today would record a false failure. One case, correction drafted,
> awaiting your go-ahead.

---

### Evidence

All in `build/custom-roles/source-verify-2026-08-28/`:
`SOURCE-VERIFICATION.md` (badges, versions, SV-7480 in full) ·
`PERMISSION-MATRIX-v54.md` (the matrix as extracted from the live page) ·
`PER-ROLE-CASE-VS-MATRIX.md` (all 11 roles, side by side) ·
`WO-DELETE-CASE-AUDIT.md` (all 48 cases, each judged) ·
`raw/` (the fetched JSON the above was derived from).

---

## OUTSTANDING — what I need from you

1. **Go-ahead to correct C27776** — one `update_case`, drafted in §6. Nothing written yet (Rule 6).
2. ~~**Confirm the PO for Custom Roles.** Still recorded as unknown; needed before any question sheet
   can go out. The spec's *owner* is Sasha Grosman, which is not the same thing.~~
   **✅ SUPERSEDED LATER THE SAME DAY (2026-08-28), struck through rather than deleted per Rules
   32/33.** The PO is recorded as **Sasha Grosman — surname unconfirmed; TestRail user 9 spells it
   *Grossman***. **All that is still owed is the spelling of the surname**, and it must be confirmed
   before his name goes on anything he reads.
3. **A PO question to raise once (2) is answered:** tidy the stale *"(cannot reverse)"* text in the
   spec's Service Manager behaviour-change row.
4. **Do you want a build re-verification?** The last one for this project was **2026-07-27**, 32 days
   ago (🔴). Rule 80 — telling you the date and asking rather than just re-running it. This would also
   let us confirm the staging role wiring first-hand instead of inferring it.
5. **For the automation engineer, via you:** the `test.skip()` annotations reference **C20957 and
   C20958, which do not exist in TestRail**; and C27792/C27805 are not new. Worth correcting in the
   automation repo so the skip list stays traceable.
6. **A gap on our side:** Vladimir edited C27792 and C27805 on 2026-08-27 and we had no prior body
   snapshot, so his change is not diffable (Rule 87). Suggest we start snapshotting the Custom Roles
   bodies — happy to do it on your word.
