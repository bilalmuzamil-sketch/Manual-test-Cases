# Phase 6 — Rule-28 three-dimension audit (Schedule coverage re-derivation, 2026-07-31)

**Scope:** the 2 new/changed cases (**SCH-PERM-13** new · **SCH-DND-07** extended) **and their
neighbours** — 26 adjacent cases across the Permissions and roster/drag control groups.
Re-runnable: `tools/rule28_sweep.py`.

| Dimension | Result |
|---|---|
| **1 — USEFUL** | **2 KEEP · 0 MERGE · 0 WEAK-KEEP · 0 CUT** |
| **2 — MAKES SENSE** | **2 SENSIBLE · 0 FIX-WORDING · 0 NONSENSE** |
| **2b — CROSS-CASE CONSISTENCY** | **0 contradictions · 1 near-miss pre-empted (clarified) · X1–X7 all STILL RESOLVED** |
| **3 — GENUINE + LAYMAN-RUNNABLE** | **2 of 2 traceable (ticket + v23 anchor + spec date) and layman-runnable** |

**Zero unresolved contradictions before the push** — the gate is met.

---

## Dimension 1 — USEFUL

| Case | Verdict | Why it is load-bearing |
|---|---|---|
| **SCH-PERM-13** (new) | **KEEP** | Asserts a distinct observable fact nothing else asserts — which **default role** sits at which Schedule level. Failure = a real, high-severity reportable bug (e.g. Technicians shipped with edit rights over the shop's schedule). Not covered elsewhere: the 9 role names appear in **no** other case; SCH-PERM-01..06 test the levels abstractly. Not a merge candidate — merging it into any abstract-tier case would bury a permission-default check inside a behaviour case. |
| **SCH-DND-07** (extended) | **KEEP** | Already load-bearing (schedule↔work-order roster sync). The extension adds the *no-swap* half of §4.3 — a real failure mode (silently replacing the incumbent technician) that **no** case could previously catch. Extended rather than duplicated, so no near-duplicate was created. |

**Slop patterns actively checked and avoided:** no per-role explosion (9 roles → 1 case, not 9);
no near-duplicate of SCH-PERM-02/04; no "permission cases reducing to one gate" (this one asserts
the *mapping*, not the gate); no new empty-state/tooltip/sort filler.

---

## Dimension 2 — MAKES SENSE (cold read, 6 fail conditions)

| Fail condition | SCH-PERM-13 | SCH-DND-07 (extended) |
|---|---|---|
| Steps not executable in order / precondition unreachable | Pass — admin roles screen → read defaults → sign in as a holder of each role. Preconditions require admin access + the ability to sign in as a role holder, and require recording/restoring the prior state. | Pass — the extra steps continue the same work order and line already set up. |
| Expected doesn't follow from the steps | Pass — E1/E2 follow steps 2/3 (reading the defaults); E3/E4 follow steps 4/5 (driving as each role). | Pass — E4/E5 follow steps 3/4 exactly. |
| Internal contradiction | Pass — the view-only list and the edit list are disjoint; E3/E4 mirror them. | Pass — "adds… stays on it" and "nothing asks you to swap" agree; E1 (first technician added) is consistent with E4 (second added alongside). |
| References a control in no source | Pass — role names and the three permission levels are **verbatim §14.1/§14**; "Reset To Template" is the proven ShopView control (Custom Roles playbook). **No prototype string is quoted as a build label** (today's X7 lesson) and the exact roles-screen wording is left as an explicit live VIU-confirm in notes rather than invented (Rule 9). | Pass — "labor roster", "avatar stack", "Needs techs" are all existing pinned labels. |
| Domain nonsense | Pass — a role default is either on or off; nothing impossible is asserted. Deliberately asserts **nothing** about Schedule: Delete for the edit roles, because the spec is silent (Rule 15). | Pass — a labor roster with no cap can hold two technicians. |
| Not actionable | Pass — the tester knows exactly what to read and what PASS looks like per role list. | Pass. |

---

## Dimension 2b — CROSS-CASE CONSISTENCY SWEEP (the mandatory one)

**Control groups diffed** (grouped by the control/behaviour asserted, then expected results
compared line by line):

**A. "default role → Schedule level"** — SCH-PERM-13 alone; diffed against the abstract-tier
group **SCH-PERM-01/02/03/04/05/06/07** and **SCH-API-01**. No pair can both be false:
PERM-13 says the named view-only roles have Edit OFF and cannot drag; PERM-02 says a view-only
user has every editing affordance hidden — **agreeing**, one at the role-default level and one at
the behaviour level. PERM-03 ("View OFF → nav hidden") is not contradicted: PERM-13 asserts the
named roles have View **ON**. PERM-10/NAV-04 ("any department-assigned staff appears as a grid
**row** regardless of role") concerns row presence, not editing — no clash.

**B. "who is on the line's labor roster"** — SCH-DND-07 · DND-01 · DND-03 · SCOPE-02 · SCOPE-05 ·
LINE-04 · LINE-05 · START-07 · REAS-01. All nine say **"the technician is added to the roster"**;
none says "replaced". **LINE-04's "there is no cap on how many technicians a line can have"**
independently corroborates DND-07's new E5.

**The one near-miss, pre-empted (not a contradiction):**
**SCH-DND-07 E4** ("the technician who was already there **stays** on it") vs
**SCH-REAS-01 E3** ("Technician B is added… and technician A **is removed** from it").
Both are correct and both are in v23 — they describe **different actions**: dragging the **line**
from the sidebar creates a *second shift* and only adds (§4.3 "simply adds them"), while dragging
an existing **shift block** to another technician *reassigns* it and removes the source (§7).
A cold reader could still conflate them, so **step 3 of SCH-DND-07 now spells it out**: *"drag the
line from the sidebar again — do NOT drag the shift block you just created, that would move it
instead"*, with the rationale recorded in the case notes. **0 contradictions remain.**

**Opposite-assertion keyword sweep** (hidden↔shown/visible, disabled↔editable, removed↔stays,
replace↔adds, cannot↔can, no-limit↔cap, off↔on) across the new/changed cases and all 26
neighbours: no semantic hit beyond the pre-empted pair above.

**TITLE-vs-EXPECTED, both new/changed cases:** PERM-13's title ("Default roles start at the
Schedule level the spec names (view-only vs edit)") = exactly E1+E2 with E3/E4 as the behavioural
proof. DND-07's title ("Scheduling a technician onto a line **adds** them to its labor roster")
now covers the extension even better than before — "adds" is precisely the no-swap assertion.

**Same-anchor clustering:** §14.1 cluster (PERM-01..06, PERM-13, REAS-03) and §4.3 cluster
(DND-02, SCOPE-01/02/03/05, DND-07) each diffed — internally consistent.

### X1–X7 re-verified (the morning pass's resolutions held)

| # | Check | Result |
|---|---|---|
| X1 | No "break around skipped/booked days" assertion in SCH-SER-01/02 | **STILL RESOLVED** |
| X2 | SER-01's empty weekend columns stay conditioned on "when no business hours are set" | **STILL RESOLVED** |
| X3 | No case tells the tester to **right-click** the cell menu | **STILL RESOLVED** |
| X4 | SCH-EVT-08 keeps "events DO consume capacity, but raise no conflict" | **STILL RESOLVED** |
| X5 | SCH-CONF-03 carries no hardcoded 8:00 AM / 5:00 PM | **STILL RESOLVED** |
| X6 | SCH-EVT-02 routes day-view creation through the cell menu | **STILL RESOLVED** |
| X7 | SCH-CONF-02 says "(outside working days)", never "(outside Mon-Fri)" | **STILL RESOLVED** |

**The 2 new/changed cases introduce none of these failure modes** — no invented label, no
hardcoded hours, no right-click, no unconditioned absolute.

---

## Dimension 3 — GENUINE + LAYMAN-RUNNABLE

| Check | Result |
|---|---|
| Rule 20 traceability | **2/2.** PERM-13 → `SV-8685 [epic - cross-cutting - no single-story owner] (§14.1 default role tiers…; spec v23 2026-07-30)`; DND-07 → `SV-8688 (§1.2 … · §4.3 roster add + no swap flow · §7; spec v23 2026-07-30)`. Both name the ticket **and** the v23 anchor **and** the spec date. The epic key is used only where there is genuinely no owning story, and says so. |
| Rules 7/9 plain wording | **2/2.** No jargon, no HTTP/enum/§-numbers in tester-facing fields, numbered Preconditions/Steps/Expected, build labels only where pinned; anything unpinned sits in `notes` as a live VIU-confirm. |
| Titles ≤80 chars | PERM-13 = **76** · DND-07 = **65**. Suite-wide: **0 titles over 80**, **0 duplicate titles**. |
| Rule 4 (API placement) | Neither case contains API content; both correctly sit outside "API — Schedule". |
| No VIU / feature-flag words in tester-facing fields | **Clean** on both. |

---

## Is the critic right? (both halves, honestly)

* **"Mostly useless"** — no. This pass added **1 case and 2 steps** to a 164-case suite and can
  name, for each, the exact bug it catches that nothing else caught (a default role shipped with
  edit rights; a technician silently swapped off a line). The re-derivation also produced the
  evidence for the *rest* of the suite: **158 of 165 cases are cited by a v23 statement**, and the
  other 6 trace to the engineering tech plan — **0 orphans**.
* **"Some tests just don't make sense"** — the honest count for this pass is **0 nonsense out of
  2**, and **1 near-miss that a cold reader could genuinely have misread** (the line-drag vs
  shift-drag pair), which we found in the Stage-2b sweep and fixed **before** pushing. That is the
  sweep doing its job, not a clean sheet by luck.
