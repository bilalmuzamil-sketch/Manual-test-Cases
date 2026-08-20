# Automated-case backlog — CLASSIFICATION under the QA lead's 2026-08-20 policy

**Pass date:** 2026-08-20. **Policy (skill 03 §6.4 / Standing Rule 71 refinement 2026-08-20):** an
Automated case (`custom_atmstatus = 3`) is UPDATED **only if BOTH** (a) it is build-verified
(live-observed, per our recorded evidence) **AND** (b) something in its **Title / Preconditions /
Steps / Expected** genuinely changed (a build-accurate LABEL/wording correction, or a documented-
source change). Build-verified + content unchanged → **LEAVE, do not churn.** Not build-verified →
**LEAVE + flag needs build-verify.** A marker→EXPECT-FAIL needing a NEW Jira ticket → **LEAVE + flag**
(Jira creation is on the QA-lead hold). **Never** change an expected RESULT to match the build (Rule 57).

**`custom_atmstatus` confirmed LIVE via `get_case` for every row** (records can be stale — Rule 38 tell).
**71 of 72 held cases are atm=3 live; C43838 is now atm=1** (reworked this session). All `created_by = 3` (ours).

## Verdict counts

| Verdict | Count | Meaning |
|---|---|---|
| **UPDATE (executed this pass)** | **0** | No held case had a clean build-accurate Title/Precond/Steps/Expected label/wording correction identified-and-held; every pending change is marker-only, metadata-only, contested, or unverified. |
| LEAVE — no change (do not churn) | 60 | Build-verified; only a marker lift / stale-marker strip / sentence-2 re-stamp was pending — none is a content change under the 2026-08-20 policy. |
| LEAVE — needs build-verify | 2 | Not build-verified this pass (observation-limited); cannot update per policy. |
| LEAVE — needs Jira (HELD) | 0 | None strictly; 2 REVIEW rows would need a NEW Jira ticket only if confirmed a deviation (creation is on hold). |
| REVIEW (do NOT write — unsure) | 4 | Contested / possible-deviation / truncated body; needs investigation or a dedicated coupled build-verify pass before any write. |
| Already done THIS session (→ FOR-VLAD) | 3 | C30488 updated, C43838 reworked, C43984 created earlier this session. |
| Already edited a PRIOR pass (ratification pending) | 4 | 4 SBC cases edited before the hold was in force; surfaced for retrospective ratification, not re-touched. |

**Total rows classified: 73.** **Writes executed this pass: 0** (conservative — Rule 71 / "better to under-write than churn a Vlad case").

## Full classification table

| C-id | Project | atm (live) | build-verified? | change needed? | what change was pending | source ref | VERDICT | note |
|---|---|---|---|---|---|---|---|---|
| [C30328](https://shopview.testrail.io/index.php?/cases/view/30328) | RS/PV | atm=3 | yes | UNSURE | label 'Both' vs build 'All types'; single- vs multi-select; first vs after search/date | - | **REVIEW** | possible deviation vs label-correction; if deviation needs NEW Jira (HELD). Investigate before writing |
| [C30352](https://shopview.testrail.io/index.php?/cases/view/30352) | RS/PV | atm=3 | yes | no(marker only, contested) | strip stale EXPECT-FAIL(SV-8938 OBSOLETE)->READY | SV-8938 | **REVIEW** | Location-position is contested open PO question; confirm w/ Chris Ward first |
| [C30429](https://shopview.testrail.io/index.php?/cases/view/30429) | RS/TU | atm=3 | yes | UNSURE | case asserts Total Hours link that is ABSENT from build (F7) | - | **REVIEW** | should likely carry deferred marker; case may assert absent feature; investigate |
| [C43811](https://shopview.testrail.io/index.php?/cases/view/43811) | SCHED | atm=3 | yes | YES | custom_expected TRUNCATED ('...after the reload, and') - no steps-tail/provenance/marker; feature BUILT+runnable | SV-9242 (v30 §7/§4.10/§14.1) | **REVIEW** | genuine content defect but completing body = new authoring; needs dedicated coupled build-verify + ask-first; not a mechanical label fix |
| [C38848](https://shopview.testrail.io/index.php?/cases/view/38848) | SCHED | atm=3 | no | no | OBSERVATION-LIMITED: staff table did not render; per-tech tab not driven | SV-8699 | **LEAVE-needs-build-verify** | NOT build-verified -> cannot update per policy; needs build-verify |
| [C38849](https://shopview.testrail.io/index.php?/cases/view/38849) | SCHED | atm=3 | no | no | OBSERVATION-LIMITED: inherit behaviour not driven (staff table) | SV-8699 | **LEAVE-needs-build-verify** | NOT build-verified -> needs build-verify |
| [C29600](https://shopview.testrail.io/index.php?/cases/view/29600) | FILTERS | atm=3 | yes | no(marker only) | lift marker deferred->READY (PASS live) | - | **LEAVE-no-change** | marker-only lift -> do not churn |
| [C29614](https://shopview.testrail.io/index.php?/cases/view/29614) | FILTERS | atm=3 | yes | no | refresh sentence-2 only (marker already READY) | - | **LEAVE-no-change** | PASS live; content unchanged |
| [C29618](https://shopview.testrail.io/index.php?/cases/view/29618) | FILTERS | atm=3 | yes | no | refresh sentence-2 only (marker already READY) | - | **LEAVE-no-change** | PASS live; content unchanged |
| [C29623](https://shopview.testrail.io/index.php?/cases/view/29623) | FILTERS | atm=3 | yes | no(marker only) | lift marker deferred->READY (PASS live) | - | **LEAVE-no-change** | marker-only lift -> do not churn |
| [C38877](https://shopview.testrail.io/index.php?/cases/view/38877) | FILTERS | atm=3 | yes | no | refresh sentence-2 only (marker already READY) | - | **LEAVE-no-change** | PASS live; content unchanged |
| [C30534](https://shopview.testrail.io/index.php?/cases/view/30534) | RS/IV | atm=3 | yes | no | optional sentence-2 only | - | **LEAVE-no-change** | PASS/READY; content unchanged |
| [C30535](https://shopview.testrail.io/index.php?/cases/view/30535) | RS/IV | atm=3 | yes | no(marker only) | lift marker deferred->READY (feature present) | - | **LEAVE-no-change** | marker-only lift -> do not churn |
| [C30557](https://shopview.testrail.io/index.php?/cases/view/30557) | RS/IV | atm=3 | yes | no | optional sentence-2 only | - | **LEAVE-no-change** | PASS/READY; content unchanged |
| [C30563](https://shopview.testrail.io/index.php?/cases/view/30563) | RS/IV | atm=3 | yes | no(marker only) | lift marker deferred->READY (feature present) | - | **LEAVE-no-change** | marker-only lift -> do not churn |
| [C30569](https://shopview.testrail.io/index.php?/cases/view/30569) | RS/IV | atm=3 | yes | no | optional sentence-2 only | - | **LEAVE-no-change** | PASS/READY; content unchanged |
| [C30579](https://shopview.testrail.io/index.php?/cases/view/30579) | RS/IV | atm=3 | yes | no | optional sentence-2 only | - | **LEAVE-no-change** | PASS/READY; content unchanged |
| [C30580](https://shopview.testrail.io/index.php?/cases/view/30580) | RS/IV | atm=3 | yes | no | optional sentence-2 only | - | **LEAVE-no-change** | PASS/READY; content unchanged |
| [C30583](https://shopview.testrail.io/index.php?/cases/view/30583) | RS/IV | atm=3 | yes | no | optional sentence-2 only | - | **LEAVE-no-change** | PASS/READY; content unchanged |
| [C30588](https://shopview.testrail.io/index.php?/cases/view/30588) | RS/IV | atm=3 | partial | no | SV-8823 export sub-claim NOT re-verified this pass | SV-8823 | **LEAVE-no-change** | body READY unchanged; sub-claim re-verify owed before closing SV-8823 money portion |
| [C30603](https://shopview.testrail.io/index.php?/cases/view/30603) | RS/IV | atm=3 | partial | no | HOLD valid (needs 2nd sign-in) | - | **LEAVE-no-change** | HOLD marker correct |
| [C30604](https://shopview.testrail.io/index.php?/cases/view/30604) | RS/IV | atm=3 | partial | no | HOLD valid (needs 2nd sign-in) | - | **LEAVE-no-change** | HOLD marker correct |
| [C30322](https://shopview.testrail.io/index.php?/cases/view/30322) | RS/PV | atm=3 | yes | no | optional sentence-2 only | - | **LEAVE-no-change** | PASS/READY; content unchanged |
| [C30326](https://shopview.testrail.io/index.php?/cases/view/30326) | RS/PV | atm=3 | yes | no | optional sentence-2 only | - | **LEAVE-no-change** | PASS/READY; content unchanged |
| [C30333](https://shopview.testrail.io/index.php?/cases/view/30333) | RS/PV | atm=3 | yes | no | optional sentence-2 only | - | **LEAVE-no-change** | PASS/READY; content unchanged |
| [C30338](https://shopview.testrail.io/index.php?/cases/view/30338) | RS/PV | atm=3 | yes | no | optional sentence-2 only | - | **LEAVE-no-change** | PASS/READY; content unchanged |
| [C30346](https://shopview.testrail.io/index.php?/cases/view/30346) | RS/PV | atm=3 | yes | no(marker only) | lift marker deferred->READY (feature present) | - | **LEAVE-no-change** | marker-only lift, not a Title/Precond/Steps/Expected change -> do not churn |
| [C30351](https://shopview.testrail.io/index.php?/cases/view/30351) | RS/PV | atm=3 | yes | no | optional sentence-2 only | - | **LEAVE-no-change** | PASS/READY; content unchanged |
| [C30353](https://shopview.testrail.io/index.php?/cases/view/30353) | RS/PV | atm=3 | yes | no(marker only) | lift marker deferred->READY (feature present) | - | **LEAVE-no-change** | marker-only lift -> do not churn |
| [C30354](https://shopview.testrail.io/index.php?/cases/view/30354) | RS/PV | atm=3 | yes | no | optional sentence-2 only | - | **LEAVE-no-change** | PASS/READY; content unchanged |
| [C30375](https://shopview.testrail.io/index.php?/cases/view/30375) | RS/PV | atm=3 | yes | no | optional sentence-2 only | - | **LEAVE-no-change** | PASS/READY; content unchanged |
| [C30377](https://shopview.testrail.io/index.php?/cases/view/30377) | RS/PV | atm=3 | yes | no | optional sentence-2 only | - | **LEAVE-no-change** | PASS/READY; content unchanged |
| [C30390](https://shopview.testrail.io/index.php?/cases/view/30390) | RS/PV | atm=3 | yes | no | optional sentence-2 only | - | **LEAVE-no-change** | PASS/READY; content unchanged |
| [C30098](https://shopview.testrail.io/index.php?/cases/view/30098) | RS/SBC | atm=3 | yes | no | optional sentence-2 build re-stamp only | - | **LEAVE-no-change** | PASS live; content unchanged -> do not churn |
| [C30099](https://shopview.testrail.io/index.php?/cases/view/30099) | RS/SBC | atm=3 | yes | no | optional sentence-2 build re-stamp only | - | **LEAVE-no-change** | PASS live; content unchanged -> do not churn |
| [C30138](https://shopview.testrail.io/index.php?/cases/view/30138) | RS/SBC | atm=3 | partial | no | open PO question link-vs-plaintext; not touched | - | **LEAVE-no-change** | blocked on PO question; marker READY unchanged |
| [C30159](https://shopview.testrail.io/index.php?/cases/view/30159) | RS/SBC | atm=3 | yes | no | optional sentence-2 build re-stamp only | - | **LEAVE-no-change** | PASS live; content unchanged -> do not churn |
| [C30163](https://shopview.testrail.io/index.php?/cases/view/30163) | RS/SBC | atm=3 | yes | no | optional sentence-2 build re-stamp only | - | **LEAVE-no-change** | PASS live; content unchanged -> do not churn |
| [C30174](https://shopview.testrail.io/index.php?/cases/view/30174) | RS/SBC | atm=3 | yes | no | optional sentence-2 build re-stamp only | - | **LEAVE-no-change** | PASS live; content unchanged -> do not churn |
| [C30175](https://shopview.testrail.io/index.php?/cases/view/30175) | RS/SBC | atm=3 | yes | no | optional sentence-2 build re-stamp only | - | **LEAVE-no-change** | PASS live; content unchanged -> do not churn |
| [C30177](https://shopview.testrail.io/index.php?/cases/view/30177) | RS/SBC | atm=3 | yes | no | optional sentence-2 build re-stamp only | - | **LEAVE-no-change** | PASS live; content unchanged -> do not churn |
| [C30180](https://shopview.testrail.io/index.php?/cases/view/30180) | RS/SBC | atm=3 | yes | no | optional sentence-2 build re-stamp only | - | **LEAVE-no-change** | PASS live; content unchanged -> do not churn |
| [C38912](https://shopview.testrail.io/index.php?/cases/view/38912) | RS/SBC | atm=3 | yes | no | HOLD marker (Location rule deviation) stands; source-blocked | - | **LEAVE-no-change** | carried Location deviation; needs v-spec/PO; marker HOLD correct |
| [C30398](https://shopview.testrail.io/index.php?/cases/view/30398) | RS/TU | atm=3 | partial | no | HOLD valid (needs 2nd sign-in) | - | **LEAVE-no-change** | HOLD marker correct; positive verified |
| [C30399](https://shopview.testrail.io/index.php?/cases/view/30399) | RS/TU | atm=3 | yes | no | optional sentence-2 only | - | **LEAVE-no-change** | PASS/READY; content unchanged |
| [C30401](https://shopview.testrail.io/index.php?/cases/view/30401) | RS/TU | atm=3 | yes | no | optional sentence-2 only | - | **LEAVE-no-change** | PASS/READY; content unchanged |
| [C30404](https://shopview.testrail.io/index.php?/cases/view/30404) | RS/TU | atm=3 | yes | no | optional sentence-2 only | - | **LEAVE-no-change** | PASS/READY; content unchanged |
| [C30410](https://shopview.testrail.io/index.php?/cases/view/30410) | RS/TU | atm=3 | yes | no | optional sentence-2 only | - | **LEAVE-no-change** | PASS/READY; content unchanged |
| [C30424](https://shopview.testrail.io/index.php?/cases/view/30424) | RS/TU | atm=3 | yes | no(marker only) | strip stale EXPECT-FAIL(SV-8946 OBSOLETE)->READY | SV-8946 | **LEAVE-no-change** | marker-only strip; behaviour correct live -> do not churn |
| [C30449](https://shopview.testrail.io/index.php?/cases/view/30449) | RS/TU | atm=3 | yes | no | optional sentence-2 only | - | **LEAVE-no-change** | PASS/READY; content unchanged |
| [C38915](https://shopview.testrail.io/index.php?/cases/view/38915) | RS/TU | atm=3 | yes | no | optional sentence-2 only | - | **LEAVE-no-change** | PASS/READY; content unchanged |
| [C30451](https://shopview.testrail.io/index.php?/cases/view/30451) | RS/WIP | atm=3 | yes | no | optional sentence-2 only | - | **LEAVE-no-change** | PASS/READY; content unchanged |
| [C30452](https://shopview.testrail.io/index.php?/cases/view/30452) | RS/WIP | atm=3 | yes | no | optional sentence-2 only | - | **LEAVE-no-change** | PASS/READY; content unchanged |
| [C30460](https://shopview.testrail.io/index.php?/cases/view/30460) | RS/WIP | atm=3 | yes | no(marker only) | lift marker deferred->READY (feature present) | - | **LEAVE-no-change** | marker-only lift -> do not churn (C30462 also refs SV-8656->SV-8659, metadata) |
| [C30462](https://shopview.testrail.io/index.php?/cases/view/30462) | RS/WIP | atm=3 | yes | no(marker only) | lift marker deferred->READY (feature present) | - | **LEAVE-no-change** | marker-only lift -> do not churn (C30462 also refs SV-8656->SV-8659, metadata) |
| [C30498](https://shopview.testrail.io/index.php?/cases/view/30498) | RS/WIP | atm=3 | yes | no(marker only) | strip stale EXPECT-FAIL(SV-8968 OBSOLETE)->READY | SV-8968 | **LEAVE-no-change** | marker-only strip -> do not churn |
| [C30506](https://shopview.testrail.io/index.php?/cases/view/30506) | RS/WIP | atm=3 | yes | no | optional sentence-2 only | - | **LEAVE-no-change** | PASS/READY; content unchanged |
| [C30507](https://shopview.testrail.io/index.php?/cases/view/30507) | RS/WIP | atm=3 | yes | no | optional sentence-2 only | - | **LEAVE-no-change** | PASS/READY; content unchanged |
| [C30508](https://shopview.testrail.io/index.php?/cases/view/30508) | RS/WIP | atm=3 | yes | no(marker only) | lift marker deferred->READY (feature present) | - | **LEAVE-no-change** | marker-only lift -> do not churn (C30462 also refs SV-8656->SV-8659, metadata) |
| [C30510](https://shopview.testrail.io/index.php?/cases/view/30510) | RS/WIP | atm=3 | yes | no | optional sentence-2 only | - | **LEAVE-no-change** | PASS/READY; content unchanged |
| [C30511](https://shopview.testrail.io/index.php?/cases/view/30511) | RS/WIP | atm=3 | yes | no | optional sentence-2 only | - | **LEAVE-no-change** | PASS/READY; content unchanged |
| [C30515](https://shopview.testrail.io/index.php?/cases/view/30515) | RS/WIP | atm=3 | yes | no | optional sentence-2 only | - | **LEAVE-no-change** | PASS/READY; content unchanged |
| [C30518](https://shopview.testrail.io/index.php?/cases/view/30518) | RS/WIP | atm=3 | yes | no(marker only) | lift marker deferred->READY (feature present) | - | **LEAVE-no-change** | marker-only lift -> do not churn (C30462 also refs SV-8656->SV-8659, metadata) |
| [C30527](https://shopview.testrail.io/index.php?/cases/view/30527) | RS/WIP | atm=3 | yes | no | optional sentence-2 only | - | **LEAVE-no-change** | PASS/READY; content unchanged |
| [C38847](https://shopview.testrail.io/index.php?/cases/view/38847) | SCHED | atm=3 | yes | no(marker only) | add/lift marker->READY (confirmed present+runnable); no marker currently | SV-8699 | **LEAVE-no-change** | marker-add only -> do not churn |
| [C38850](https://shopview.testrail.io/index.php?/cases/view/38850) | SCHED | atm=3 | yes | no(marker only) | add/lift marker->READY (confirmed present+runnable) | SV-8699 | **LEAVE-no-change** | marker-add only -> do not churn |
| [C30488](https://shopview.testrail.io/index.php?/cases/view/30488) | RS/WIP | atm=3 | yes | YES(done) | WIP Story-5 design body updated (atm=3, QA-lead authorised) this session | design-review Aug-13 | **DONE (this session → FOR-VLAD)** | already updated + byte-verified this session; FOR-VLAD |
| [C43838](https://shopview.testrail.io/index.php?/cases/view/43838) | RS/WIP | atm=1 | yes | YES(done) | reworked to widget-glow this session; now atm=1 (no longer Automated) | design-review Aug-13 FLAG-2 | **DONE (this session → FOR-VLAD)** | reworked this session; FOR-VLAD (note: now atm=1) |
| [C43984](https://shopview.testrail.io/index.php?/cases/view/43984) | RS/WIP | C43984:atm=1(created) | yes | YES(created) | new case (label wrap) created this session | design-review Aug-13 | **DONE (this session → FOR-VLAD)** | created this session; FOR-VLAD (atm=1) |
| [C30107](https://shopview.testrail.io/index.php?/cases/view/30107) | RS/SBC | atm=3 | yes | no(marker done prior) | marker EXPECT-FAIL(SV-9074)->READY (SV-9074 QA Complete) | SV-9074 | **DONE (prior pass — ratify)** | edited before hold in force; ratification pending; changed conclusion |
| [C30114](https://shopview.testrail.io/index.php?/cases/view/30114) | RS/SBC | atm=3 | yes | no(marker done prior) | marker EXPECT-FAIL(SV-8991)->READY (SV-8991 OBSOLETE) | SV-8991 | **DONE (prior pass — ratify)** | edited before hold; ratification pending; changed conclusion |
| [C30121](https://shopview.testrail.io/index.php?/cases/view/30121) | RS/SBC | atm=3 | yes | no | metadata sentence-2 added prior | - | **DONE (prior pass — ratify)** | metadata only |
| [C30123](https://shopview.testrail.io/index.php?/cases/view/30123) | RS/SBC | atm=3 | yes | no | metadata sentence-2 added prior | - | **DONE (prior pass — ratify)** | metadata only |

## The 4 REVIEW rows (why each is NOT written)

- **C30328 (PV Type filter):** build shows label **"All types"** + **multi-select** after search/date; the case says **"Both"** + single-select + first control. This may be a build-accurate LABEL correction (allowed) OR a genuine deviation (needs a NEW Jira ticket, which is on the QA-lead hold). Unresolved → do not write.
- **C30352 (PV Location column position):** SV-8938 is OBSOLETE so the EXPECT-FAIL marker is stale, but the intended Location-column position is a **contested open PO question** (confirm with Chris Ward). A marker strip here would assert an unsettled conclusion → do not write.
- **C30429 (TU Total Hours link):** the case asserts a Total-Hours→Timesheet link that is **ABSENT from the build** (TU-FINDINGS §F7). It should likely carry a deferred marker, not READY; whether the link ships in an unreached scope is unconfirmed → do not write.
- **C43811 (Schedule Assign-work-order):** feature is BUILT + runnable, but the stored `custom_expected` is **TRUNCATED** ("...still on the technician's lane after the reload, and") with no steps-tail, no provenance line and no marker. Completing it is **new authoring**, not a mechanical label fix — it needs a dedicated coupled build-verify authoring pass + ask-first, so writing a guessed completion now would churn a Vlad case. → do not write.

## Why 0 UPDATE writes is the correct outcome

Every held case's pending change fell into one of: (i) a **marker lift** (deferred→READY) — an automation
annotation, not a Title/Precond/Steps/Expected change; (ii) a **stale-marker strip** (obsolete EXPECT-FAIL);
(iii) a **sentence-2 build re-stamp** (metadata/provenance); (iv) **contested / unverified / truncated** (REVIEW);
or (v) **already done** this or a prior session. Under the 2026-08-20 policy none of (i)-(iii) is a genuine
content change, so writing them would be exactly the churn the QA lead's refinement forbids. The stale deferred
markers on the lift candidates are **left as-is per policy** and remain available for a separate QA-lead-authorised
marker-only ratification pass if he wants them lifted.
