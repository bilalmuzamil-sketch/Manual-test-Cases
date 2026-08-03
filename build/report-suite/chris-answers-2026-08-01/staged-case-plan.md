# Report Suite — STAGED case plan from Chris Ward's 2026-08-01-round answers

**Staged 2026-08-03 · STAGED ONLY — NOTHING EXECUTED.** No TestRail write, no case-source edit, no
Jira post (Standing Rule 6). Every "current wording" below was read **live** today: TestRail
`get_case` (read-only) for the C-id'd cases, plus the local case source under
`build/report-suite/cases/`. Source of the answers: `answers-ingested.md` in this folder.

**Driving answers, verbatim (quoted in full on each row below):**

- **Q1 = A** — *"Gate SBC on ordinary reports access, like the other five reports"*
- **Q2 = A** — *"Collapse all report access into a single Reports permission"*
- **Chat ruling** — *"if it's already built, we just hide the new permissions from FE (they can exist
  and not do anything for now -- no wasted time)"*

---

## TOTALS AT A GLANCE

| Bucket | Count | TestRail operation |
|---|---|---|
| **A. SBC — metadata + tester-note edits** (Q1=A + FE-hide; observable expectation unchanged) | **3** | `update_case` ×3 |
| **B. NEW case** — the permission must not be offered in the front end | **1** | `add_case` ×1 → **triggers a Rule 34/47 run-359 UNION** |
| **C. Q2=A — permission-name edits, outcome unchanged** | **6** | `update_case` ×6 |
| **D. Q2=A — precondition-only edits** | **4** | `update_case` ×4 |
| **E. Q2=A — RETIRE-OR-RESCOPE candidates (premise abolished)** | **2** | **decision first**, then `update_case` **or** `delete_case` |
| **TOTAL cases touched** | **16** | 13 `update_case` + 1 `add_case` + 2 pending-decision |
| **Executed today** | **0** | — |

**Blocking dependency:** buckets **C, D and E depend on Chris answering ask A** (how far Q2=A
reaches — see `answers-ingested.md` §2). Bucket **A** does **not** depend on it and could be
authorised on its own today. Bucket **B** depends only on your authorisation.

---

## THE RUN CONSEQUENCE — Standing Rules 34 and 47 (read before any `add_case`)

**Verified live today, not repeated from a doc:**

| Run | Value | Read |
|---|---|---|
| Run **359** "Reports Suite - Nebojsa/Viktoria (VIU Pending)" | **`include_all = false`** | `get_run/359`, 2026-08-03 |
| Tests in the run | **474** | same call |
| Results recorded | **0 Passed · 0 Failed · 0 Blocked · 0 Retest · 474 Untested** | same call |

**What this means for bucket B (the one `add_case`):**

1. `include_all = false` ⇒ the run is a **FIXED SELECTION**. A newly added case will **NOT** appear
   in it automatically. Without a run sync, the new case is invisible to Nebojsa and Viktoria — and a
   reviewer would report it as a coverage gap that does not exist (exactly the Filters run-352
   incident that produced Rule 34).
2. The sync must be a **UNION**: `get_tests/359` → derive the current case_id list → send
   `update_run` with `sorted(set(current) | set(new))`.
3. **⚠️ `update_run` REPLACES the selection. A partial `case_ids` list DELETES the omitted tests AND
   THEIR RECORDED RESULTS.** Never send a partial list.
4. **Snapshot first:** `get_tests/359` + `get_results_for_run/359` **before** the write, then verify
   after — test count **474 → 475**, and every prior result still present. (Today that is 0 results,
   which lowers the risk but does **not** change the procedure — results could be logged between now
   and the authorised write, so the snapshot is taken at write time, not from this document.)
5. Run 359 is **in scope** for sync duty (Rule 47: the three active runs are Filters 352, Schedule
   357, Reports Suite 359) but it belongs to **other testers**, so the run write needs your
   **explicit authorisation** separately from the case write (Rule 6).
6. Buckets **A, C, D** are `update_case` only — **no run sync needed** (they change no selection).
   Bucket **E**, *if* a retire is authorised, uses `delete_case`; **deleted cases drop out of runs
   automatically**, so again no `update_run` — but the run's test count **before → after** must be
   recorded in the audit log (474 → 472 if both are deleted).

---

## BUCKET A — SBC: metadata + tester-note edits (Q1=A + the FE-hide ruling)

**Why these are not rewordings of what the tester checks:** all three already assert Chris's ruled
behaviour. Only the metadata and the tester note are stale. Caught by re-reading each case end to end
(Standing Rule 41).

### A1 · SBC-PERM-01 · **C30098** · https://shopview.testrail.io/index.php?/cases/view/30098

*"Ordinary reports access opens Sales By Customer — no separate permission"*

| | |
|---|---|
| **Driving answer** | Q1 = A, *"Gate SBC on ordinary reports access, like the other five reports"* · plus the chat ruling *"we just hide the new permissions from FE (they can exist and not do anything for now)"* |
| **Field 1: `refs` — current (live)** | `SV-8600 (SBC spec Story 1 S1-R2 — OVERRULED by Chris Ward answer 2026-07-31 Q4=A "the intention is to not hide these from normal reports access"; S1-R2 + the build still use a dedicated permission; dev change ticket raised)` |
| **Field 1: `refs` — proposed** | `SV-8600 (SBC spec Story 1 S1-R2, spec v-2026-07-31 — NOW ALIGNED: S1-R2 reads "gated by ordinary reports access, not by a report-specific permission"; ruled by Chris Ward 2026-07-28, 2026-07-31 Q4=A and again on the SV-8598 permissions sheet Q1=A; build change tracked as SV-8780, Ready to Fix — permission to be hidden from the FE and left inert, not removed)` |
| **Why** | The clause *"S1-R2 + the build still use a dedicated permission"* is **factually false as of 2026-07-31** — the spec was corrected (verified live). Leaving it tells the next reader the spec contradicts the case when it now agrees. |
| **Field 2: tester note (Expected item 4) — current** | *"Note for the tester: the product owner has ruled that every report in this suite opens with the ordinary reports access. If the build still demands a separate Sales By Customer permission, mark this test Failed and report it as the known pending change — do not change the test."* |
| **Field 2: tester note — proposed** | *"Note for the tester: the product owner has ruled that every report in this suite opens with the ordinary reports access, and the written description now says the same. If the build still demands a separate Sales By Customer permission, mark this test Failed and report it against the known pending change SV-8780 — do not change the test. You may also find a Sales By Customer permission still listed for administrators to switch on: that should have been hidden from the screen, so please report that too."* |
| **Steps / preconditions / expected 1–3** | **UNCHANGED.** Expected 3 (*"Ordinary reports access alone is enough — this report does NOT need a permission of its own"*) is his ruling word for word |
| **Operation** | `update_case` C30098 (`refs` + `custom_expected`) |
| **Run impact** | None |

### A2 · SBC-PERM-02 · **C30099** · https://shopview.testrail.io/index.php?/cases/view/30099

*"Without reports access, Sales By Customer is not listed and cannot open"*

| | |
|---|---|
| **Driving answer** | As A1 |
| **`refs` — current (live)** | `SV-8600 (SBC spec Story 1 S1-N1 — permission model RULED to the ordinary reports access by Chris Ward answer 2026-07-31 Q4=A; the build still ships a dedicated permission)` |
| **`refs` — proposed** | `SV-8600 (SBC spec Story 1 S1-N1, spec v-2026-07-31 — permission model ruled to ordinary reports access by Chris Ward 2026-07-28 / 2026-07-31 Q4=A / SV-8598 sheet Q1=A; the build's dedicated permission is tracked as SV-8780, Ready to Fix, to be hidden from the FE and left inert)` |
| **Tester note (Expected item 4)** | Same replacement text as A1 |
| **Expected items 1–3** | **UNCHANGED.** Item 3 (*"The gate is the ordinary reports access — there is no separate Sales By Customer permission to remove"*) remains correct under the FE-hide route: from the tester's side there is still no separate permission to remove |
| **Operation** | `update_case` C30099 (`refs` + `custom_expected`) |
| **Run impact** | None |

### A3 · SBC-NAV-01 · **C30096** · https://shopview.testrail.io/index.php?/cases/view/30096

*"Sales By Customer listed under Performance, below existing links; titles correct"*

| | |
|---|---|
| **Driving answer** | As A1 |
| **`refs` — current (live)** | `SV-8600 (SBC spec Story 1 S1-R1; S1-R3; S1-R4 — Performance group + below-the-anchors placement per the PRD companion video 2026-07-30; access = ordinary reports permission per Chris Ward answer 2026-07-31 Q4=A)` |
| **`refs` — proposed** | Same, with the access clause extended: `… access = ordinary reports permission per Chris Ward 2026-07-31 Q4=A, re-confirmed on the SV-8598 permissions sheet Q1=A; SBC spec S1-R2 corrected 2026-07-31 to match` |
| **Tester note (Expected item 5)** | Same replacement text as A1 |
| **Everything else** | **UNCHANGED** — the navigation-placement assertions are untouched by this round |
| **Operation** | `update_case` C30096 (`refs` + `custom_expected`) |
| **Run impact** | None |

---

## BUCKET B — ONE NEW CASE: the permission must not be offered in the front end

### B1 · **SBC-PERM-03** · **no C-id yet** (needs `add_case`)

| | |
|---|---|
| **Driving answer** | The chat ruling, verbatim: *"But it's important that (if it's already built), we just hide the new permissions from FE (they can exist and not do anything for now -- no wasted time)"* |
| **Why this is a real, new, checkable assertion** | *"Hidden from the FE"* is **observable** — a tester can open the role/permission editor and look. Nothing in our 474 cases checks it. It is the **only** testable half of the FE-hide ruling: the inert back-end atom has no observable behaviour at all and correctly generates no case (reasoned in `answers-ingested.md` §1) |
| **Proposed section** | `SBC — Permissions` (TestRail section **4289**, the same section as C30098/C30099 — verified live) |
| **Proposed title** (≤80 chars, per the concise-title convention) | *"No Sales By Customer permission is offered in the role permission editor"* (72 chars) |
| **Proposed preconditions** | 1. You are signed in as an administrator who can edit roles and permissions.<br>2. Create a throwaway `ZZAUTOTEST` custom role to work in, and delete it afterwards. |
| **Proposed steps** | 1. Open the area where a role's permissions are switched on and off.<br>2. Look through the reports-related permissions.<br>3. Search the permission list for "Sales By Customer". |
| **Proposed expected** | 1. There is **no** "Sales By Customer" permission anywhere in the list for an administrator to switch on or off.<br>2. The reports permission that is offered is the ordinary reports access, which covers all six of the new reports.<br>3. Note for the tester: the product owner has decided this report must not have a permission of its own on screen. If you **do** find a "Sales By Customer" permission listed, mark this test Failed and report it against SV-8780 — do not change the test. |
| **Proposed `refs`** | `SV-8598 (SBC spec Story 1 S1-R2, spec v-2026-07-31; Chris Ward ruling on the SV-8598 permissions sheet Q1=A + his chat instruction to hide the new permission from the front end; build change SV-8780)` |
| **`viu_status`** | `VIU-Pending` (no QA branch — nothing live-observed) |
| **add_case required fields** | `custom_atmstatus: 3`, `custom_automation_type: 0` (non-API — the case is UI-only, so it stays out of an "API" section per Rule 4) |
| **Operation** | `add_case` into section 4289 |
| **⚠️ Run impact** | **YES.** Run 359 is `include_all = false` — see "THE RUN CONSEQUENCE" above. Requires a **UNION** `update_run` (474 → **475**), snapshot before, verify after, **separate authorisation** |
| **Honesty** | Proposed, **not authored.** It is not in the case source and not in the id-map. |

---

## BUCKET C — Q2=A: permission-name edits (outcome unchanged)

**⛔ All six depend on Chris answering ask A first** (does Q2=A merge the per-area permissions in
Custom Roles, or only mean the six reports read one Reports permission?). The **edit is the same
either way**; what is unresolved is whether the permission being named is *"the ordinary reports
access"* or *"the single Reports permission"* and whether the old per-area names survive elsewhere.

| # | Internal ID | C-id | Link | Current wording (the permission-bearing line, read live) | Proposed | Op |
|---|---|---|---|---|---|---|
| C1 | **PV-PERM-01** | **C30325** | https://shopview.testrail.io/index.php?/cases/view/30325 | Title: *"A user with Inventory Reports View can load the report and export it"*<br>Precond 2: *"That user's role has the Inventory Reports → View permission."*<br>Expected 2: *"…both loading the report and exporting it are allowed by the Inventory Reports → View permission"* | Title → *"A user with ordinary reports access can load the report and export it"*<br>Precond 2 → *"That user's role has the ordinary reports access."*<br>Expected 2 → *"…both loading the report and exporting it are allowed by the same ordinary reports access."* | `update_case` |
| C2 | **IV-PERM-01** | **C30603** | https://shopview.testrail.io/index.php?/cases/view/30603 | Title: *"User with the existing inventory-reports permission can open the report"*<br>Precond 1: *"…whose role has the existing inventory-reports permission…"*<br>Expected 1–2: *"…for a user holding the existing inventory-reports permission"* / *"No additional, report-specific permission is required — the report reuses the existing inventory-reports permission."* | Title → *"A user with ordinary reports access can open Inventory Value"*<br>Precond/Expected → replace *"the existing inventory-reports permission"* with *"the ordinary reports access"* throughout; keep the *"no additional, report-specific permission is required"* sentence (it is now doubly true) | `update_case` |
| C3 | **IV-PERM-02** | **C30604** | https://shopview.testrail.io/index.php?/cases/view/30604 | Precond 1: *"…whose role does NOT have the inventory-reports permission…"* | Precond 1 → *"…whose role does NOT have reports access…"* · Title *"Without the permission Inventory Value is absent from the reports navigation"* still reads correctly; optionally → *"Without reports access Inventory Value is absent from the navigation"* | `update_case` |
| C4 | **TU-NAV-07** | **C30398** | https://shopview.testrail.io/index.php?/cases/view/30398 | Title: *"Without the timesheet-reports permission Technician Utilization is hidden"*<br>Precond 1: *"…whose role lacks the permission that controls the Timesheet Activities report."* | Title → *"Without reports access Technician Utilization is hidden"*<br>Precond 1 → *"…whose role does NOT have reports access."* | `update_case` |
| C5 | **WIP-PERM-01** | **C30526** | https://shopview.testrail.io/index.php?/cases/view/30526 | Title: *"The Work In Progress reports permission covers opening and downloading"*<br>Precond 1: *"…whose role has the permission that grants access to Work In Progress reports…"*<br>Expected 2: *"The download works with the same permission — the report reuses one existing reporting permission, adds no new one…"* | Title → *"Ordinary reports access covers opening and downloading Work In Progress"*<br>Precond 1 → *"…whose role has the ordinary reports access…"*<br>Expected 2 → keep the *"reuses one existing reporting permission, adds no new one"* sense, naming the ordinary reports access | `update_case` |
| C6 | **WIP-PERM-02** | **C30527** | https://shopview.testrail.io/index.php?/cases/view/30527 | Precond 1: *"…whose role does NOT have the permission that grants access to Work In Progress reports…"* | Precond 1 → *"…whose role does NOT have reports access…"* | `update_case` |

**Note on wording discipline (Rule 9):** the exact on-screen name of the unified permission is **not
established** — there is no QA branch, and Chris named it only as *"a single Reports permission"*. The
proposals above therefore use the plain phrase *"the ordinary reports access"* already used by the SBC
cases, and the exact build label must be **VIU-confirmed live** when the branch exists. Not invented.

---

## BUCKET D — Q2=A: precondition-only edits

Same dependency on ask A. These cases test navigation/placement, not the permission; only the
precondition line names a per-area permission.

| # | Internal ID | C-id | Link | Current precondition line | Proposed | Op |
|---|---|---|---|---|---|---|
| D1 | **PV-NAV-01** | **C30322** | https://shopview.testrail.io/index.php?/cases/view/30322 | Precond 2: *"Your role has the Inventory Reports → View permission."* | → *"Your role has the ordinary reports access."* | `update_case` |
| D2 | **IV-NAV-01** | **C30534** | https://shopview.testrail.io/index.php?/cases/view/30534 | Precond 2: *"Your role has the existing inventory-reports permission."* | → *"Your role has the ordinary reports access."* | `update_case` |
| D3 | **TU-NAV-01** | **C30392** | https://shopview.testrail.io/index.php?/cases/view/30392 | Precond 1: *"You are signed in as a user whose role has the timesheet-reports permission."* | → *"You are signed in as a user whose role has the ordinary reports access."* | `update_case` |
| D4 | **WIP-TAB-01** | **C30451** | https://shopview.testrail.io/index.php?/cases/view/30451 | Precond 2: *"Your role has the permission that grants access to Work In Progress reports."* | → *"Your role has the ordinary reports access."* | `update_case` |

---

## BUCKET E — Q2=A: RETIRE-OR-RESCOPE candidates (premise abolished) — YOUR DECISION

**⛔ Do not act on these without both Chris's answer to ask A and your authorisation.** Retiring them
is a genuine reduction in coverage if reading (ii) of Q2 turns out to be wrong.

### E1 · PV-PERM-03 · **C30327** · https://shopview.testrail.io/index.php?/cases/view/30327

*"Reports access without Inventory Reports View: entry shows; data denied"*

| | |
|---|---|
| **Current expectation (live)** | 1. *"The Parts Velocity navigation entry is still visible (the entry follows Reports-section access, not the report permission)."*<br>2. *"On opening the report, the standard access-denied state is shown instead of data."*<br>3. *"The export is likewise denied - no file downloads."* |
| **Current precondition 2** | *"That user's role does NOT have the Inventory Reports → View permission."* |
| **Current `refs` (live)** | `SV-8641 (specs/parts-velocity.md S1-N2; S1-R4)` |
| **Why Q2=A abolishes it** | The case tests one specific state: **has Reports-section access but NOT Inventory Reports → View.** Under *"a single Reports permission"* **that state cannot exist** — you either have reports access (and see data) or you do not (and see nothing). There is no third state left to observe |
| **Option 1 — RETIRE** | `delete_case` C30327. Body kept locally marked Retired, id-map −1, generators exclude it. **Run 359: 474 → 473** (deleted cases drop out automatically; record before→after) |
| **Option 2 — RESCOPE** | Keep the case, repointed at the surviving distinction (navigation-entry visibility vs data access under the single reports permission) — but only if such a distinction still exists in the build, which **cannot be confirmed without a QA branch** |
| **My recommendation** | **HOLD.** Do not delete a case on the strength of a reading Chris has not confirmed, when the build has never been observed. Re-derive once ask A is answered |

### E2 · PV-API-04 · **C30391** · https://shopview.testrail.io/index.php?/cases/view/30391

*"The backend denies report data AND export without Inventory Reports View"*

| | |
|---|---|
| **Current expectation (live)** | 1. *"The backend REFUSES the report data request…"*<br>2. *"The backend likewise refuses the export request - no file is produced."*<br>3. *"Both loading and exporting are gated by the same Inventory Reports → View permission."* |
| **Current precondition 1** | *"You are signed in as a Reports-section user whose role lacks the Inventory Reports → View permission."* |
| **Current `refs` (live)** | `SV-8641 (specs/parts-velocity.md S1-R4; S1-N2)` |
| **Why Q2=A abolishes it** | Same abolished state as E1, at the back end. It is the API-layer twin of C30327 and lives in section **`PV — API`** (correct per Rule 4 — it names HTTP-layer behaviour) |
| **Options** | As E1: `delete_case`, or rescope to *"the back end denies report data and export to a user without reports access"* — which would then **duplicate** the negative already covered by the bucket-C cases, so a **MERGE** into C30325's negative twin is the more likely honest outcome |
| **My recommendation** | **HOLD**, decided together with E1 |

### ⚠️ A CORRECTION TO ONE OF OUR OWN DOCUMENTS (Rule 12 — verified, not repeated)

`build/report-suite/PO-Questions-Chris-ReportSuite-2026-07-31.md`, QA Internal Mapping row for
Question 5, lists **"PV-API-04 (C30388)"**. **That C-id is wrong.**

| Verified live today | |
|---|---|
| **PV-API-04** = **C30391** | *"The backend denies report data AND export without Inventory Reports View"* — the permission case |
| **C30388** = **PV-API-01** | *"The report is server-paginated - the backend returns one page of rows at a time"* — **nothing to do with permissions** |

Confirmed both ways: `testrail-id-map.csv` rows 262 and 265, and a live `get_case` on C30388 and
C30391. **Anyone acting on that mapping row would have edited the wrong case.** The correct id is
used throughout this plan. The stale row in the question sheet is **left unedited** (it is a sent
question sheet; correcting it is a separate authorised change) — flagged here and in the register.

---

## WHAT IS **NOT** IN THIS PLAN, AND WHY (Standing Rule 46 — a deliberate omission must be visible)

| Not staged | Why |
|---|---|
| **Any SBC case retirement for "descoped features"** | **Zero candidates found.** Every feature the live SBC change log records as dropped (customer comparison, side-by-side asset comparison, global-search narrowing, "All Time", Print) has already been swept from the spec body and the suite; the one affected case (SBC-EXP-13, Print) was retired 2026-07-28. Full evidence in `answers-ingested.md` §3. **Not manufacturing a retire list to fill a section.** |
| **A test case for the inert back-end atom** | It has **no observable behaviour** — invisible in the FE, enforcing nothing in the BE. Nothing for a tester to pass or fail. Recorded so the absence is never read as a coverage gap |
| **Any change to SBR / logo / VIN / row-cap / "Representative" cases** | Those belong to the 5-question sheet's Q1–Q4 and his earlier answers. **This document did not touch them** |
| **A second dev ticket for Q2=A** | It is a different change with a Custom-Roles blast radius. It should wait for ask A, and filing is your call |
| **Any edit to `SPEC-WATCH-2026-07-28.md` or `DEV-TICKET-SBC-permissions.md`** | Deliberately left alone this pass; the corrections they need are recorded in `answers-ingested.md` §5/§6 |
| **Anything under `build/filters/**`, `build/schedule/**`, `build/qa-preemptive-answers-2026-07-31/`** | Out of this pass's ownership |

---

## OUTSTANDING — what I need from you

| # | What I need | Which ruling froze it (verbatim) | When / what it answered | What it blocks | Was it right? | What unblocks it |
|---|---|---|---|---|---|---|
| 1 | **Authorisation for bucket A** (3 `update_case`: C30096, C30098, C30099) | *"EXECUTE NOTHING: no TestRail writes, no case-source edits, no Jira posts."* | This pass, 2026-08-03, answering how far to take Chris's answers | Two `refs` fields state a spec conflict that no longer exists, and the tester note omits SV-8780 and the new "should be hidden from the screen" fact | **Yes** in general — but bucket A is the one part with **no dependency on Chris**, so it is safe to release early | Your go-ahead. Independent of everything else |
| 2 | **Authorisation for bucket B** (1 `add_case`) **and separately for the run-359 UNION `update_run`** (474 → 475) | Same instruction, plus Rule 6 on runs owned by other testers | This pass, 2026-08-03 | The FE-hide ruling has no coverage at all until this exists; and without the run sync it would be invisible to Nebojsa/Viktoria | **Yes** — run 359 holds other testers' tests, and a partial `case_ids` list would destroy them | Two go-aheads (case, then run). Snapshot + union procedure already written above |
| 3 | **Chris's answer to ask A, then authorisation for buckets C, D, E** | No prior ruling — the blocker is Chris, not you | — | 10 case edits + 2 retire-or-rescope decisions across PV, IV, TU, WIP | — | Chris answers how far Q2=A reaches (`answers-ingested.md` §2), then your call |
| 4 | **A decision on the stale C-id in the sent question sheet** | — | — | Nothing today; but the wrong id (C30388 for PV-API-04) is in a document that has been sent, so someone could act on it | — | Your say-so to correct that one row |

**Nothing has been executed. 0 TestRail writes, 0 case-source edits, 0 Jira posts.**
