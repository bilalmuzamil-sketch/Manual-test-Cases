# Report Suite — groups C, D and E: STAGED, **AWAITING AUTHORISATION**

**Status: NOTHING EXECUTED.** 0 TestRail writes, 0 case-source edits, 0 Jira posts (Standing Rule 6).
Every "current wording" below was read **live** from TestRail today (`get_case`, read-only) — not
copied from the earlier plan. All 12 cases confirmed **ours** (`created_by = 3`, Bilal Muzamil).

**This supersedes buckets C, D and E of `staged-case-plan.md`.** Buckets A and B of that plan were
executed today — see `testrail-execution-log-2026-08-03.md`.

---

## THE RULING THAT UNFROZE THESE (Standing Rules 25 / 32 / 33)

**QA lead, 2026-08-03, verbatim:** **"Yes all the reports will be gated by ONE permission FOR NOW."**

Read together with the PO's own answers — Chris Ward's **Q2 = A** (*"Collapse all report access into a
single Reports permission"*) and his chat instruction (*"if it's already built, we just hide the new
permissions from FE (they can exist and not do anything for now -- no wasted time)"*) — the settled
position is:

1. **ONE ordinary Reports permission gates all six reports.**
2. **No report requires an additional permission of its own.**
3. **Extra / per-area permissions may still EXIST in the system but are hidden from the front end and
   enforce nothing** — inert artefacts. An inert artefact has no observable behaviour, so it gets no
   test case of its own; the one exception is the *"not offered in the role editor"* check, already
   authored as **SBC-PERM-05 = [C39447](https://shopview.testrail.io/index.php?/cases/view/39447)**.
4. **"FOR NOW" IS LOAD-BEARING.** This is explicitly a **current-state** ruling. Custom Roles was
   built to be modular and the permission model may expand later; Chris has already said the dropped
   SBC premium features *"SHOULD be gated behind an additional permission set"* if they return.
   **Every case below therefore carries the "for now" qualifier in its tester-facing wording**, so a
   future expansion is read as a planned change and **not as a regression**.

**Authority:** Rule 33 — the QA lead's ruling, consistent with the PO's Q2=A. Recorded on every case
with its source and date (Rules 20 / 32). **The scope question is therefore NOT asked of Chris.**

### The naming problem, stated honestly (Standing Rule 9)

**The exact on-screen name of the single reports permission is NOT established.** There is no QA
branch, and neither Chris nor the QA lead named a build label — Chris said only *"a single Reports
permission"*. Every proposal below therefore uses the plain phrase **"the ordinary reports access"**
already used by the live SBC cases, and **the real build label must be VIU-confirmed live when the
branch exists.** Nothing is invented.

---

## THE COMPLETENESS SWEEP — the true number is 12, not "the plan's 12 by assumption"

I was told not to assume the plan's 12 were the whole set, so the **entire 475-case source** was
swept field-by-field (title · preconditions · steps · expected) for any per-area or report-specific
permission reference, using a deliberately wide pattern (`inventory-reports`, `timesheet`,
`Inventory Reports`, `Work In Progress reports`, `report-specific permission`, `report View
permission`, `permission that controls…`, `permission that grants access…`, `per-area`,
`reports permission`, `reports access`).

| | Count |
|---|---|
| Raw pattern hits across all 475 active cases | **22** |
| **Genuine — assert a PER-AREA / report-specific permission → in scope** | **12** |
| Correctly already on the unified model → no change | **2** — SBC-PERM-01 [C30098](https://shopview.testrail.io/index.php?/cases/view/30098), SBC-PERM-05 [C39447](https://shopview.testrail.io/index.php?/cases/view/39447) |
| **False positives** — the pattern hit the *"Timesheet Activities"* **report name** or clocked-hours wording, not a permission | **8** — TU-NAV-06 [C30397](https://shopview.testrail.io/index.php?/cases/view/30397), TU-LINK-02 [C30429](https://shopview.testrail.io/index.php?/cases/view/30429), TU-LINK-03 [C30430](https://shopview.testrail.io/index.php?/cases/view/30430), TU-LINK-04 [C30431](https://shopview.testrail.io/index.php?/cases/view/30431), TU-LINK-05 [C30432](https://shopview.testrail.io/index.php?/cases/view/30432), TU-LINK-06 [C30433](https://shopview.testrail.io/index.php?/cases/view/30433), SBR-CALC-01 [C30229](https://shopview.testrail.io/index.php?/cases/view/30229) — plus SBC-NAV-02 below |
| **One retired case also carries the old wording** | **SBC-NAV-02** — precondition still reads *"You are signed in with the Sales By Customer report View permission."* **Retired 2026-07-28 and deleted from TestRail** (merged into SBC-NAV-01), so **no C-id and no live impact**. Flagged only so nobody re-imports it as-is |

**CONCLUSION: the true number of ACTIVE cases asserting a per-area report permission is 12 — exactly
the set the earlier plan named.** The sweep found no thirteenth. That is a verified result, not an
assumption.

---

## GROUP C — 6 permission-name edits · `update_case` ×6 · outcome unchanged

Each row shows the **live current wording** and the **proposed wording**. The pass/fail outcome does
not move in any of them; only the permission being named, plus the "for now" qualifier.

### C1 · PV-PERM-01 · **C30325** · https://shopview.testrail.io/index.php?/cases/view/30325

| Field | Current (live 2026-08-03) | Proposed |
|---|---|---|
| **Title** | *"A user with Inventory Reports View can load the report and export it"* | *"A user with ordinary reports access can load the report and export it"* (70 chars) |
| **Precond 2** | *"That user's role has the Inventory Reports → View permission."* | *"That user's role has the ordinary reports access (the standard "can this person see reports" setting)."* |
| **Expected 2** | *"The export downloads successfully (both loading the report and exporting it are allowed by the Inventory Reports → View permission)."* | *"The export downloads successfully — both opening the report and exporting it are allowed by the same ordinary reports access."* |
| **New expected item 3** | — | *"Note for the tester: for now every report in this suite opens with the one ordinary reports access; no report has a permission of its own. If you see a separate Parts or Inventory reports permission being required, mark this Failed and report it."* |
| **`refs`** | `SV-8641 (specs/parts-velocity.md S1-R4)` | `SV-8641 (PV spec S1-R4; one-permission model ruled by Chris Ward Q2=A + QA lead 2026-08-03 "ONE permission FOR NOW"; PV spec still describes a per-area permission — spec edit owed)` |

### C2 · IV-PERM-01 · **C30603** · https://shopview.testrail.io/index.php?/cases/view/30603

| Field | Current (live) | Proposed |
|---|---|---|
| **Title** | *"User with the existing inventory-reports permission can open the report"* | *"A user with ordinary reports access can open Inventory Value"* (60 chars) |
| **Precond 1** | *"A test user exists whose role has the existing inventory-reports permission (assign the Tech user a suitable role if needed; restore the original role afterward)."* | *"A test user exists whose role has the ordinary reports access (assign the Tech user a suitable role if needed; restore the original role afterward)."* |
| **Expected 1** | *"The report is listed and opens normally for a user holding the existing inventory-reports permission."* | *"The report is listed and opens normally for a user holding the ordinary reports access."* |
| **Expected 2** | *"No additional, report-specific permission is required — the report reuses the existing inventory-reports permission."* | *"No additional, report-specific permission is required — for now the one ordinary reports access covers all six of the new reports."* (**doubly true under the ruling**) |
| **`refs`** | `SV-8668 (specs/inventory-value.md Story 1 Prerequisites)` | `SV-8668 (IV spec Story 1 Prerequisites; one-permission model ruled by Chris Ward Q2=A + QA lead 2026-08-03 "ONE permission FOR NOW"; IV spec still names the inventory-reports permission — spec edit owed)` |

### C3 · IV-PERM-02 · **C30604** · https://shopview.testrail.io/index.php?/cases/view/30604

| Field | Current (live) | Proposed |
|---|---|---|
| **Title** | *"Without the permission Inventory Value is absent from the reports navigation"* | *"Without reports access Inventory Value is absent from the navigation"* (67 chars) |
| **Precond 1** | *"A test user exists whose role does NOT have the inventory-reports permission…"* | *"A test user exists whose role does NOT have reports access…"* (rest unchanged) |
| **Expected 1** | *"The report does not appear in the navigation for this user."* | **unchanged** |
| **`refs`** | `SV-8668 (specs/inventory-value.md Story 1 S1-N1)` | `SV-8668 (IV spec Story 1 S1-N1; the gate is the one ordinary reports access per Chris Ward Q2=A + QA lead 2026-08-03 "ONE permission FOR NOW")` |

### C4 · TU-NAV-07 · **C30398** · https://shopview.testrail.io/index.php?/cases/view/30398

| Field | Current (live) | Proposed |
|---|---|---|
| **Title** | *"Without the timesheet-reports permission Technician Utilization is hidden"* | *"Without reports access Technician Utilization is hidden"* (54 chars) |
| **Precond 1** | *"You are signed in as a user whose role lacks the permission that controls the Timesheet Activities report."* | *"You are signed in as a user whose role does NOT have reports access."* |
| **Expected 1** | *"The Technician Utilization report does NOT appear in the navigation."* | **unchanged** |
| **`refs`** | `SV-8648 (specs/technician-utilization.md S1-N1)` | `SV-8648 (TU spec S1-N1; the gate is the one ordinary reports access per Chris Ward Q2=A + QA lead 2026-08-03 "ONE permission FOR NOW"; TU spec still names the timesheet-reports permission — spec edit owed)` |

**Note:** this is the case whose old precondition pointed at *"the permission that controls the
**Timesheet Activities** report"* — a **different, pre-existing** report outside this suite. That
cross-report coupling is exactly what the one-permission ruling removes.

### C5 · WIP-PERM-01 · **C30526** · https://shopview.testrail.io/index.php?/cases/view/30526

| Field | Current (live) | Proposed |
|---|---|---|
| **Title** | *"The Work In Progress reports permission covers opening and downloading"* | *"Ordinary reports access covers opening and downloading Work In Progress"* (71 chars) |
| **Precond 1** | *"A test user exists whose role has the permission that grants access to Work In Progress reports (assign the Tech user a suitable role if needed; restore the original role afterward)."* | *"A test user exists whose role has the ordinary reports access (assign the Tech user a suitable role if needed; restore the original role afterward)."* |
| **Expected 2** | *"The download works with the same permission — the report reuses one existing reporting permission, adds no new one, and the same permission covers the report and its downloads."* | *"The download works with the same permission — for now the one ordinary reports access covers the report and its downloads, and no new permission is added for it."* |
| **`refs`** | `SV-8657 (specs/wip-work-in-progress.md Story 1 Prerequisites (+ context note))` | `SV-8657 (WIP spec Story 1 Prerequisites; one-permission model ruled by Chris Ward Q2=A + QA lead 2026-08-03 "ONE permission FOR NOW"; WIP spec still names a WIP-reports permission — spec edit owed)` |

### C6 · WIP-PERM-02 · **C30527** · https://shopview.testrail.io/index.php?/cases/view/30527

| Field | Current (live) | Proposed |
|---|---|---|
| **Title** | *"Without the permission Work In Progress is absent from the reports navigation"* | *"Without reports access Work In Progress is absent from the navigation"* (68 chars) |
| **Precond 1** | *"A test user exists whose role does NOT have the permission that grants access to Work In Progress reports (assign the Tech user such a role; restore the original role afterward)."* | *"A test user exists whose role does NOT have reports access (assign the Tech user such a role; restore the original role afterward)."* |
| **Expected 1** | *"The report does not appear in the navigation for this user."* | **unchanged** |
| **`refs`** | `SV-8657 (specs/wip-work-in-progress.md Story 1 S1-N1)` | `SV-8657 (WIP spec Story 1 S1-N1; the gate is the one ordinary reports access per Chris Ward Q2=A + QA lead 2026-08-03 "ONE permission FOR NOW")` |

---

## GROUP D — 4 precondition-only edits · `update_case` ×4

These four test navigation / placement, **not** the permission. Only the precondition line names a
per-area permission; nothing a tester checks changes.

| # | Internal ID | C-id | Link | Current precondition (live) | Proposed |
|---|---|---|---|---|---|
| D1 | **PV-NAV-01** | **C30322** | https://shopview.testrail.io/index.php?/cases/view/30322 | Precond 2: *"Your role has the Inventory Reports → View permission."* | *"Your role has the ordinary reports access."* |
| D2 | **IV-NAV-01** | **C30534** | https://shopview.testrail.io/index.php?/cases/view/30534 | Precond 2: *"Your role has the existing inventory-reports permission."* | *"Your role has the ordinary reports access."* |
| D3 | **TU-NAV-01** | **C30392** | https://shopview.testrail.io/index.php?/cases/view/30392 | Precond 1: *"You are signed in as a user whose role has the timesheet-reports permission."* | *"You are signed in as a user whose role has the ordinary reports access."* |
| D4 | **WIP-TAB-01** | **C30451** | https://shopview.testrail.io/index.php?/cases/view/30451 | Precond 2: *"Your role has the permission that grants access to Work In Progress reports."* | *"Your role has the ordinary reports access."* |

**Titles, steps and every expected result stay exactly as they are.** `refs` gains the ruling
citation only where the current `refs` mentions a permission model (D1, D3, D4 do not; D2 does not) —
so for these four the `refs` change is a one-clause append recording the ruling and its date, no
anchor change.

**⚠️ Rule 41 applies to all ten group C+D cases when they are actually touched:** each will be
re-read END-TO-END against its CURRENT live spec (PV, IV, TU, WIP — all four pages must be re-fetched
first, see the warning below) and the execution log will carry the per-case
*"re-verified whole against <spec + version>"* line plus any second finding.

**⚠️ A HARD PRE-REQUISITE FOR EXECUTING C AND D (Standing Rule 31).** The PV / IV / TU / WIP specs
were **last captured 2026-07-31** and have **not** been re-fetched since. Today's SBC work proved this
is a real risk, not a formality: **our local SBC spec copies were one version stale and still carried
the abolished dedicated-permission requirement.** The four pages **must be re-read live** before these
ten cases are written, because Chris may already have made the permission edit he owes — in which case
the `refs` should cite the corrected requirement rather than record a conflict.

---

## GROUP E — C30327 and C30391 · **RECOMMENDATION: RESCOPE, DO NOT RETIRE**

### The problem with both cases

Both test one specific state: **"the user HAS Reports-section access but does NOT have Inventory
Reports → View."** Under *one permission for all six reports*, **that state cannot be produced** —
either you have reports access (and see the data) or you do not (and see nothing). There is no third
state, so **as written, neither case is runnable.**

### Why RETIRE is the wrong call — three reasons

1. **The ruling is explicitly temporary.** *"ONE permission **FOR NOW**."* Deleting coverage on the
   strength of a current-state ruling means re-authoring it when the modular model expands — and Chris
   has already flagged that the dropped SBC premium features *"SHOULD be gated behind an additional
   permission set"* if they come back.
2. **The build has never been observed.** There is no QA branch. We would be deleting a test on the
   basis of two documents and zero observations (Rules 12 / 22).
3. **There is a real, valuable assertion left inside the old premise** — see below. Retiring would
   throw it away, and it happens to be the one thing that proves the inert-artefact half of the
   ruling actually holds.

### The surviving assertion, which is why rescope works

Chris ruled the extra permissions *"can exist and not do anything for now."* **That is observable, and
nothing in the 475 currently checks it.** SBC-PERM-05 (C39447) covers *"it must not be OFFERED in the
role editor"*; **it does not cover "if it does exist, it must not ENFORCE anything."** These two cases
are already sitting in exactly the right place — one at the UI layer, one at the API layer — to carry
that check.

### E1 · PV-PERM-03 · **C30327** · https://shopview.testrail.io/index.php?/cases/view/30327 — RESCOPE

| Field | Current (live) | Proposed |
|---|---|---|
| **Title** | *"Reports access without Inventory Reports View: entry shows; data denied"* | *"Ordinary reports access alone opens Parts Velocity and its export"* (65 chars) |
| **Precond 2** | *"That user's role does NOT have the Inventory Reports → View permission."* | *"That user's role has the ordinary reports access and NO other reports-related permission switched on."* |
| **Expected** | 1. entry still visible · 2. access-denied instead of data · 3. export denied | 1. *"The Parts Velocity entry is visible in the Reports navigation."*<br>2. *"Opening it shows the report data — not an access-denied screen."*<br>3. *"The export downloads."*<br>4. *"Note for the tester: for now ONE ordinary reports access opens all six of these reports. If any extra Parts or Inventory reports permission still appears and switching it OFF blocks this report or its export, that is wrong — mark this Failed and report it."* |
| **`refs`** | `SV-8641 (specs/parts-velocity.md S1-N2; S1-R4)` | `SV-8641 (PV spec S1-N2; S1-R4 — RESCOPED 2026-08-03: the old "Reports access without Inventory Reports View" state cannot exist under one permission; Chris Ward Q2=A + "they can exist and not do anything" + QA lead "ONE permission FOR NOW")` |

**What this buys us:** it becomes the **positive proof that an extra permission is inert**, and the
**regression guard** for the day the model expands.

### E2 · PV-API-04 · **C30391** · https://shopview.testrail.io/index.php?/cases/view/30391 — RESCOPE

Stays in section **4337 "PV — API"** (correct per Rule 4 — it names back-end request behaviour).

| Field | Current (live) | Proposed |
|---|---|---|
| **Title** | *"The backend denies report data AND export without Inventory Reports View"* | *"The back end serves report data and export on ordinary reports access"* (69 chars) |
| **Precond 1** | *"You are signed in as a Reports-section user whose role lacks the Inventory Reports → View permission."* | *"You are signed in as a user whose role has the ordinary reports access and no other reports-related permission switched on."* |
| **Expected** | 1. backend refuses data · 2. refuses export · 3. both gated by Inventory Reports → View | 1. *"The back end returns the report data — it is not refused."*<br>2. *"The back end returns the export file — it is not refused."*<br>3. *"For now both the report and its export are allowed by the single ordinary reports access; no second permission is consulted."*<br>4. *"Note for the tester: if the back end refuses either request for a user who has ordinary reports access, mark this Failed and report it."* |
| **`refs`** | `SV-8641 (specs/parts-velocity.md S1-R4; S1-N2)` | `SV-8641 (PV spec S1-R4; S1-N2 — RESCOPED 2026-08-03; same driver as C30327)` |

### If the QA lead prefers RETIRE instead

`delete_case` C30327 + C30391; bodies kept locally marked Retired; id-map −2; generators exclude
them; deliverables regenerated over **473**. **Run 359: 475 → 473** — deleted cases drop out of a run
automatically, so **no `update_run` is needed**, but the before→after test count must still be
recorded in the audit log (Rule 34). **The negative-coverage cost is that nothing would then check
that an extra permission fails to enforce anything.**

---

## TOTALS AND THE RUN CONSEQUENCE

| Bucket | Cases | Operation | Run 359 impact |
|---|---|---|---|
| **C** | 6 | `update_case` ×6 | **none** — no selection change |
| **D** | 4 | `update_case` ×4 | **none** |
| **E — as RESCOPE (recommended)** | 2 | `update_case` ×2 | **none** — count stays **475** |
| **E — as RETIRE (alternative)** | 2 | `delete_case` ×2 | **475 → 473**, automatic; record before→after |
| **TOTAL, recommended route** | **12** | **12 `update_case`** | **no run write at all** |

**Not in this plan, deliberately** (Standing Rule 46): no case for the inert back-end atom itself (no
observable behaviour); no second dev ticket for the one-permission change (the QA lead's call, and
SV-8780 is out of scope by his ruling *"Ignore this ticket."*); no edit to the PV/IV/TU/WIP spec
mirrors (Chris owes the spec change, and the pages must be re-fetched first).

---

## OUTSTANDING — what I need from you

| # | What I need | Which ruling froze it (verbatim) | When / what it answered | What it blocks | Was it right? | What unblocks it |
|---|---|---|---|---|---|---|
| 1 | **Authorisation for groups C + D** — 10 `update_case` | *"DO NOT EXECUTE them; the QA lead gets the plan first."* | 2026-08-03, answering how far to take the one-permission ruling | 10 cases across PV / IV / TU / WIP still tell a tester to set up a **per-area** permission that the ruling says will not gate anything: C30325, C30603, C30604, C30398, C30526, C30527, C30322, C30534, C30392, C30451 | **Yes** — the wording depends on a build label nobody has seen, so a review before writing is worth one round-trip | Your go-ahead **plus** a live re-read of the four specs (see the Rule-31 pre-requisite) |
| 2 | **A ruling on group E: RESCOPE (my recommendation) or RETIRE** | Same instruction | 2026-08-03 | C30327 + C30391 are **currently unrunnable** — their premise state cannot be produced | **Yes** — retiring on a *"FOR NOW"* ruling with no build observation would be a real coverage loss | Your choice of route |
| 3 | **Whether to add the QA-lead ruling citation to the 4 cases pushed today** | — | — | The 4 live cases (C30096, C30098, C30099, C39447) already carry *"for now"* in their tester note, but their `refs` cite **Chris Ward's** ruling only, not yours of 2026-08-03 | — | One word; it is 4 tiny `refs` appends, outside today's authorised scope so **not done** |
| 4 | **A live QA branch + fresh cookies** | — | — | **All 475 cases remain VIU-Pending.** Nothing in this plan — or in the suite — has ever been observed on a running build | — | The Report Suite QA branch `project/reports-suite-bravo` being made available |
