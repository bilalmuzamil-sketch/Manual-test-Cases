# Report Suite — PROJECT-STATE (canonical resume doc)

> **READ THIS FIRST to resume the Report Suite project.** Single authoritative
> snapshot: status, per-report spec inventory, deliverables index, open
> questions, env/access facts, ordered how-to-resume.

Last updated: **2026-07-30, third update** (COMPANION VIDEO INGESTED + DELTA PASS + AUTHORIZED
PUSH EXECUTED — Chris Ward's PRD companion video arrived (Loom e4a3ad0191…; transcript + 20-point
delta analysis in `chris-update-2026-07-29/`); 3 FIRM deltas → 7 update_case pushed under the
user's same-day authorization ("do update the test cases if you learn that the video is warranting
for that"), 7/7 HTTP 200 + re-GET MATCH, tally UNCHANGED 465, R359 untouched, live count under
group 4281 = 465 == id-map; 13 notes-only annotations local; 0 new cases; Q5 (Rep-label scope)
appended to the unsent Chris sheet; SPEC-WATCH: companion-video item CLOSED, new items #9–#12
added, changelog deadline 2026-08-04 stands; see §0 UPDATE 2026-07-30-C). Prior same day, second update (TECH-PLAN PUSH EXECUTED — the ChangeList-2026-07-30 §C
queue is LIVE under explicit user authorization "Push all three": 5 update_case [WIP-API-01 C30528 /
SBR-STAT-02 C30209 / PV-CALC-07 C30365 / SBC-API-02 C30191 / IV-EXP-07 C30593] + 5 add_case
[PV-EXP-11 = C38885 / TU-EXP-09 = C38887 / WIP-CALC-10 = C38890 / IV-DATE-09 = C38892 /
SBR-CALC-09 = C38894], 10/10 HTTP 200 + re-GET MATCH, 0 deletes, R359 untouched; **suite 465 active
LIVE under group 4281 == id-map 465/465, 0 blanks**; tech-plan push authorization CONSUMED; audit =
`reconciliation-2026-07-28/testrail-execution-log-2026-07-28.md` § "TECH-PLAN PUSH 2026-07-30"
ops 163–172; see §0 UPDATE 2026-07-30-B). Prior earlier same day: TECH-PLAN RECONCILIATION applied locally — 7 edits + 5 new cases, tally 465, push queue 5 update + 5 add awaiting authorization; see §0 UPDATE 2026-07-30. Prior: **2026-07-29, fourth update** (WAVE-2 PUSH EXECUTED — the 4 WIP VIN-chain
update_case [WIP-COL-05 C30470 / WIP-FLT-03 C30500 / WIP-SORT-03 C30485 / WIP-EXP-07 C30516]
pushed under explicit user authorization "Push", 4/4 HTTP 200 + re-GET MATCH, live count under
group 4281 = 460 == id-map, R359 untouched; **suite 460 active, ALL current with Chris's
rulings; wave-2 authorization CONSUMED**; audit =
`reconciliation-2026-07-28/testrail-execution-log-2026-07-28.md` § "WAVE-2 PUSH 2026-07-29";
see §0 UPDATE 2026-07-29-D). Prior same day, third update (CHRIS ANSWERED THE WIP-IDENTIFIER
QUESTION = **A**:
WIP also uses the **VIN → Unit # → plate** chain — the chain is now the STANDARD for all reports
and all future work; 3 WIP cases + the WIP-EXP-07 caveat flipped LOCALLY, wave-2 push queue = 4
update_case awaiting authorization; see §0 UPDATE 2026-07-29-C). Earlier same day: AUTHORIZED
CHRIS-UPDATE PUSH EXECUTED — 24 update_case
+ 1 add_case [TU-COL-01 = C38859], 25/25 HTTP 200 + re-GET MATCH; **460 active LIVE in TestRail ==
460 local**; see §0 LATEST block). Earlier same day: 3 authorized TestRail fixes executed + Chris
Ward group-message delta pass applied LOCALLY (change-list =
`chris-update-2026-07-29/ChangeList-2026-07-29.md`, now EXECUTED; see §0 second block). Prior 2026-07-28, second
update (FULL TESTRAIL PUSH EXECUTED — see §0 second block:
459 active cases live, SBC-EXP-16 = C38856, 57 deletions, R359 515→458 documented. Earlier same
day: VIDEO PROMOTED TO AUTHORITATIVE — 27 local case edits + 1 new case
SBC-EXP-16 + 1 retire-proposed SBC-EXP-13; backups in `video-promotion-backup-2026-07-28/`;
spec-watch `SPEC-WATCH-2026-07-28.md` deadline 2026-08-04; see §0 first block. Prior 2026-07-22:
CASES IMPORTED + C-IDs MAPPED READ-ONLY — all
515 cases now live in TestRail under group 4281 "Reports Suite"; run **R359
"Reports Suite - Nebojsa/Viktoria (VIU Pending)"** exists [515 tests, all
Untested]; `testrail-id-map.csv` fully populated with real C-ids, range
**C30096–C30610** [515/515 matched by exact section-leaf-name + exact title,
0 unmatched / 0 ambiguous / 0 leftover TR cases]; NO TestRail writes made —
read-only get_sections/get_cases only. Earlier same day: PER-REPORT IMPORT
SPLIT DELIVERED; ADVERSARIAL REVIEW DONE — both auditors CLEAN after fixes;
import REGENERATED post-review.)

---

## 0. STATUS

**TEST RUN SYNCED 2026-07-31 (Standing Rule 34, user-authorized):** run **R359 "Reports Suite -
Nebojsa/Viktoria (VIU Pending)"** now contains the COMPLETE active Reports Suite — **+7 cases,
458 → 465 tests**, result records unchanged (539 → 539, nothing lost), and the run's case set is
**EQUAL both ways** to the 465 live cases in `testrail-id-map.csv` (0 missing, 0 extra). This is
an add-only `update_run` union write; **no results were written to R359**. Evidence:
`build/testrail-run-sync-2026-07-31/run-sync-execution-log-2026-07-31.md`.

**UPDATE 2026-07-30-C (LATEST — COMPANION VIDEO INGESTED + DELTA PASS + AUTHORIZED PUSH
EXECUTED):** Chris Ward's promised **PRD/Spec Companion video** arrived 2026-07-30 (Loom
https://www.loom.com/share/e4a3ad01912048c0bba88f1a02677004 — canonical pointer; mp4 NOT
committed; transcript verbatim = `chris-update-2026-07-29/companion-video-transcript-2026-07-30.md`;
analysis TRANSCRIPT-based, visual-only details stay VIU-confirm). Per the user's standing ruling
his videos are authoritative product intent, newest-wins. **Delta analysis over the 465 cases**
(`chris-update-2026-07-29/companion-video-deltas-2026-07-30.md`): 20 points = **3 FIRM / 10
CONFIRMATION / 1 PENDING-SPEC / 3 VISUAL-VIU-CONFIRM / 1 CROSS-SQUAD / 2 NO-IMPACT**. FIRM
deltas applied + **PUSHED under the user's same-day authorization** ("do update the test cases
if you learn that the video is warranting for that") — **7 update_case, 7/7 HTTP 200 + re-GET
MATCH, 0 failures**: SBC-NAV-01 C30096 / TU-NAV-01 C30392 / SBR-NAV-01 C30195 / WIP-TAB-01
C30451 (Performance nav: the four anchor items NAMED — Sales, Technician Efficiency, Advisor
Analysis, Shop Efficiency — new reports added BELOW them; SBC's group was previously unknown;
SBR's "at the BOTTOM" re-based), PV-NAV-01 C30322 ("only Parts report" dropped — PV+IV both
under Parts; PV S1-R1 vs IV S1-R1 inconsistency flagged), SBR-WO-06 C30315 (customer-card row
label → **"Sales Representative"**, video-FIRM, supersedes spec S19-R7 "Sales Rep"), SBR-WO-02
C30311 (toggle path Settings → Staff → edit staff member tester-aid; titles >80 trimmed).
**0 adds / 0 deletes — TALLY UNCHANGED: 465 ACTIVE**; R359 untouched; live count under group
4281 = 465 == id-map (465/465 C-ids, 0 blanks). 13 notes-only annotations local (bold-vs-plain
hyperlinks VIU-watch; P/S prefix + customer-compare + export-reflects-page confirmations;
all-six-modeled-after-Technician-Efficiency styling reference; SBR-WO-01 label-pending;
IV-DATE-05 snapshot-indicator corroboration). **0 new cases** (both candidate gaps already
covered — Rule-28 no-slop; mini-audit on the touched 20: USEFUL 7/7 KEEP, SENSE 7/7 SENSIBLE,
GENUINE+LAYMAN 7/7; notes-only 13 unchanged). **Soft/pending NOT pushed:** C15 Rep-label scope
(how far "Representative, the full word" reaches — WO selector / Sales Rep Assignments export)
→ **Q5 appended** to the unsent `PO-Questions-Chris-ReportSuite-TechPlan_2026-07-30.md/.xlsx`;
C20 snapshot-indicator soft ruling ("if snapshot data is taken, we don't need to see this…
offline… or no snapshot") = CONFIRMS current IV S5-R5/R6 + the ratified PV/WIP label removal,
NO contradiction, SPEC-WATCH note only. **SPEC-WATCH:** companion-video expected-artifact item
CLOSED; new watch items #9 (S19-R7 label), #10 (SBC Performance group + anchors), #11 (PV S1-R1
"only report" inconsistency), #12 (Rep-label scope Q5); **spec changelog STILL AWAITED, deadline
2026-08-04 stands.** Deliverables regenerated over 465 (header byte-identical, hygiene clean).
Backups `chris-update-2026-07-29/backup/companion-2026-07-30/` + MANIFEST; apply
`apply_companion_2026-07-30.py`; executor `exec_companion_push_2026-07-30.py`; machine result
`testrail-execution-result-companion-2026-07-30.json`; audit =
`reconciliation-2026-07-28/testrail-execution-log-2026-07-28.md` § "COMPANION-VIDEO PUSH
2026-07-30" (ops 173–179); ChangeList = `ChangeList-companion-2026-07-30.md` header EXECUTED.
Honesty (Rule 12): all edited cases remain VIU-Pending — nothing live-verified this pass; the
video's visual content (which links are bolded, the exact screens) was NOT available in the
transcript and stays VIU-confirm. Still open: Chris changelog re-diff, Q1–Q5 answers, live VIU
pending the QA branch.
**STATUS 2026-07-30: the 5-question TechPlan sheet (incl. Q5 short-form labels) was SENT to Chris Ward by the user 2026-07-30 — awaiting his answers; on return, ingest verbatim + revisit cases per the standing workflow.**

**PRIOR UPDATE 2026-07-30-B (TECH-PLAN PUSH EXECUTED; explicit user authorization "Push all
three" 2026-07-30):** the staged ChangeList-2026-07-30 §C queue is now LIVE in TestRail —
**5 update_case** (WIP-API-01 C30528 re-run idempotency; SBR-STAT-02 C30209 deposit-seeding
precondition; PV-CALC-07 C30365 Last-Sale re-anchor on reversal; SBC-API-02 C30191 sort-whitelist
safety; IV-EXP-07 C30593 title trim 128→83) + **5 add_case** with new C-ids: **PV-EXP-11 = C38885**
(sec 4335 PV — Exports), **TU-EXP-09 = C38887** (sec 4346 TU — Exports), **WIP-CALC-10 = C38890**
(sec 4354 WIP — Earned & Remaining), **IV-DATE-09 = C38892** (sec 4368 IV — As-of Date &
Snapshots), **SBR-CALC-09 = C38894** (sec 4314 SBR — Inv. Hrs & Calculations), all
custom_atmstatus:3 + custom_automation_type:0. **10/10 HTTP 200 + re-GET verified MATCH, 0
failures; 0 deletes, 0 section writes, run R359 untouched (458 tests all Untested before AND
after). Live count under group 4281 = 465 == id-map.** SBR-BADGE-01 C30226 + WIP-FLT-05 C30502 =
notes-only, NOT pushed (per the ChangeList). Pre-push live snapshots of the 5 update targets:
`tech-plan-2026-07-29/pre-push-snapshot/` (a desired-vs-live diff confirmed each update changes
ONLY its ChangeList fields). Executor `tech-plan-2026-07-29/exec_techplan_push_2026-07-30.py`;
machine result `testrail-execution-result-techplan-2026-07-30.json`; audit log =
`reconciliation-2026-07-28/testrail-execution-log-2026-07-28.md` § "TECH-PLAN PUSH 2026-07-30"
(ops 163–172); ChangeList header = EXECUTED. **Reconciled deliverables:** id-map 465/465 C-ids
(0 blanks); unified import + 6 splits regenerated over 465 (SBC 82 / SBR 110 / PV 68 / TU 59 /
WIP 77 / IV 69; header byte-identical; hygiene clean — 0 VIU/flag words, 0 internal-id leaks,
29 API cases in API sections, no dup titles); coverage addenda ×6 appended (tech-plan section).
Push authorization CONSUMED. Still open: Chris changelog re-diff (SPEC-WATCH 2026-08-04),
Questions-for-Chris-dev.md Q1–Q3 (drafts, not sent), live VIU pending the QA branch. Honesty note
(Rule 12): all 12 tech-plan-touched cases remain VIU-Pending — every engineering-plan-sourced
expectation is labeled VIU-confirm, nothing live-verified this pass.

**PRIOR UPDATE 2026-07-30 (TECH-PLAN RECONCILIATION APPLIED LOCALLY; NO TestRail writes; read
`tech-plan-2026-07-29/TECH-PLAN-DELTAS.md` + `tech-plan-2026-07-29/ChangeList-2026-07-30.md`
first):** the engineering tech plan (user upload 2026-07-29; verbatim copy =
`tech-plan-2026-07-29/TechPlan-Reports-Suite-Full-Implementation.md`) was reconciled against the
460 cases. **Applied LOCALLY:** 7 case edits (WIP-API-01 C30528 snapshot re-run idempotency;
SBR-STAT-02 C30209 deposit-covered-prepaid seeding + SBR-BADGE-01 C30226 note; PV-CALC-07 C30365
Last-Sale re-anchor on reversal; SBC-API-02 C30191 sort-whitelist safety; WIP-FLT-05 C30502
created=start-date seeding note [local-only]; IV-EXP-07 C30593 title trim — cap 10,000 locked by
Chris 07-21 per plan) + **5 NEW cases** (PV-EXP-11 + TU-EXP-09 over-cap export refusal [spec-silent,
tech-plan-sourced, flagged]; WIP-CALC-10 running-clock counts toward Labor Earned [legacy code
dropped open clocks]; IV-DATE-09 recorded day survives category/vendor rename/delete; SBR-CALC-09
post-invoice clock edit updates Inv. Hrs, billed sell unchanged). Backups
`tech-plan-2026-07-29/backup/` + MANIFEST; apply script `apply_tech_plan_2026-07-30.py`.
**PERMISSION-MODEL FINDING (Q2):** the tech plan CONFIRMS the mixed model as deliberate design
(SBC dedicated atom `ROLE_SALES_BY_CUSTOMER_REPORT::VIEW` — bundle placement explicitly "a
product-level decision to surface"; PV Inventory Reports→View; IV ROLE_REPORT_VIEW; SBR/TU/WIP
existing report access) — sharpens but does NOT settle Chris's Q2 ("normal reports access");
Q2 note QA-internal section updated with citations; permission cases stay AS AUTHORED (Ruling 1).
**Conflicts flagged, NOT rewritten** (`Questions-for-Chris-dev.md`, DRAFT not sent): Q1
single-location Location-filter (plan says visible, video P33 says hidden — cases stay
video-authoritative), Q2 two different too-large messages (SBC spec vs IV spec/plan), Q3 cap
missing from PV/TU/WIP spec pages; SBR-Esc + permission-model questions already open elsewhere.
**14 VIU-prep facts** recorded in TECH-PLAN-DELTAS §5 (backfill-NULL on historical SBC/SBR money;
SBR credit forward-only → historical = Unassigned; snapshot crons; localStorage key
`report_view:<slug>`; location switch clears cache; WIP client-side architecture; etc. — READ
BEFORE the QA-branch VIU). **NEW TALLY: 465 ACTIVE authored** (460 live in TestRail + 5 new blank
C-ids); deliverables regenerated over 465 (unified + 6 splits, header byte-identical, hygiene
clean: 0 VIU/flag words, 29 API cases all in API sections); id-map 465 rows, 460 C-ids re-merged.
**Rule-28 audit on the touched/new 12: USEFUL 12/12 KEEP · SENSE 12/12 SENSIBLE · GENUINE+LAYMAN
12/12.** **PUSH QUEUE AWAITING AUTHORIZATION: 5 update_case (C30528, C30209, C30365, C30191,
C30593) + 5 add_case (the new cases); 0 deletes; R359 untouched** — manifest = ChangeList
2026-07-30 §C. SPEC-WATCH 2026-08-04 unchanged (Chris changelog still pending; the WIP snapshot
re-run + cap items feed the re-diff).

**PRIOR 2026-07-29 (session complete — state-save):** wave-2 pushed (commit e2201e2; see UPDATE
2026-07-29-D), leadership process doc delivered (commit 75ad986:
`build/Test-Case-Creation-and-Refinement-Process_2026-07-29.docx` + simple guide commit 3e18b3e),
QA meeting notes ingested (`build/meetings/Daily-QA-Meetup-2026-07-29-notes.md`),
execution-discipline convention recorded. **Awaiting:** Chris spec changelog (re-diff incl. WIP
VIN text; SPEC-WATCH 2026-08-04), companion video, QA branch for VIU. **NEW active thread
2026-07-29: Simple Flow sell-price bug investigation** (Fabian/founder concern — sell stays 0
when cost changes on the Receive Parts screen; coverage check in progress).

**SESSION CHECKPOINT 2026-07-29 (pre-limit #2) — COLD-RESUME ANCHOR (read this first on resume).**
- **Suite = 460 active** (459 live in TestRail + wave-2 pending). Chris answer A APPLIED LOCALLY
  (commit 858479d). **PENDING: a 4-case wave-2 TestRail push queue AWAITING USER "push"
  AUTHORIZATION: WIP-COL-05 C30470, WIP-FLT-03 C30500, WIP-SORT-03 C30485, WIP-EXP-07 C30516**
  (VIN → Unit # → plate chain per Chris 2026-07-29; the manifest = the "Push queue — wave 2"
  section of `chris-update-2026-07-29/ChangeList-2026-07-29.md`; condense refs to the 250-char
  cap at push time; run R359 untouched — never write to it).
- **VIN chain = durable cross-report standard** (VIN → Unit # → plate; recorded in CLAUDE.md);
  the VIN-vs-serial terminology caution is ACTIVE (build label stays "VIN"; non-vehicle assets
  effectively show the serial number — plain tester note where the label is read).
- **SV-8721 side project FULLY CLOSED** (staging + prod verified; Jira comment 74275 upgraded
  with 4 inline screenshots; production recipes recorded in build/APP-ACTIONS-PLAYBOOK.md §K).
- **SPEC-WATCH:** Chris's spec changelog expected imminently — his edit was NOT hand-reviewed, so
  the re-diff must confirm the WIP identifier text too; deadline **2026-08-04**
  (`build/report-suite/SPEC-WATCH-2026-07-28.md`).
- **QA-QUALITY-PIPELINE-EXPLAINER.md + Blocked-revisit standing loop:** check whether the
  explainer worker's files landed (expected: build/QA-QUALITY-PIPELINE-EXPLAINER.md +
  build/RUTHLESS-USEFULNESS-AUDIT-PROCESS.md + PROCESS-CATALOG.md + CLAUDE.md updates — committed
  b3d241c as of this checkpoint); if absent/incomplete on resume, re-create per the user's
  2026-07-29 instruction (the 9-step pipeline doc ending with the tester-Blocked manual-revisit
  loop; instruction quoted in the session transcript).
- **Awaiting:** Chris's spec changelog + companion video; the QA branch/env for live VIU.
  (Wave-2 push authorization was granted + CONSUMED 2026-07-29 — see UPDATE 2026-07-29-D.)

**UPDATE 2026-07-29-D (LATEST — WAVE-2 PUSH EXECUTED):** the wave-2 queue is LIVE — exactly 4
update_case (WIP-COL-05 C30470, WIP-FLT-03 C30500, WIP-SORT-03 C30485, WIP-EXP-07 C30516; the
VIN → Unit # → plate chain edits per Chris's answer A), executed under explicit user
authorization "Push" 2026-07-29, **4/4 HTTP 200 + re-GET byte-verified MATCH, 0 failures;
NOTHING else written** (no adds/deletes/section/run writes; R359 untouched); refs condensed to
the 250-char cap at push (full text stays in local spec_ref); pre-push live snapshots saved
(`chris-update-2026-07-29/pre-push-snapshot/*.pre-wave2-push-2026-07-29.json`); live count under
group 4281 = **460 == id-map — suite 460 active, ALL current; wave-2 authorization CONSUMED.**
Executor `chris-update-2026-07-29/exec_wave2_push_2026-07-29.py`; audit
`reconciliation-2026-07-28/testrail-execution-log-2026-07-28.md` § "WAVE-2 PUSH 2026-07-29";
ChangeList wave-2 header = EXECUTED.

**UPDATE 2026-07-29-C (CHRIS ANSWERED THE WIP-IDENTIFIER QUESTION: "A is the correct
answer"; applied LOCALLY, NO TestRail writes; read this first).**
- **Answer = A (verbatim, user-relayed):** the Work In Progress report **ALSO uses VIN, falling
  back to Unit #, then plate** — same chain as Sales By Customer. Verbatim answer + his two
  standing notes: `chris-update-2026-07-29/wip-identifier-answer-2026-07-29.md`.
- **DURABLE STANDING RULING (Chris, verbatim): "Not just for these specs though -- really good to
  keep this in mind for all actions moving forward."** = the **VIN → Unit # → plate identifier
  chain is the STANDARD for all reports and ALL future work.** Plus his terminology caution: VIN =
  VEHICLE identification number — for non-vehicle assets (e.g. a generator) the value is
  effectively the unit's **serial number**; keep the build label "VIN" (Rule 9) and carry a short
  plain tester note where the label is read.
- **Applied LOCALLY (backups `chris-update-2026-07-29/backup/` + MANIFEST wave-2 section; script
  `apply_wip_answer_2026-07-29.py`):** WIP-COL-05 C30470 (Asset cell), WIP-FLT-03 C30500 (asset
  filter options + type-ahead), WIP-SORT-03 C30485 (Asset sort key) flipped serial → VIN chain,
  mirroring the SBC-LBL-01 C30134 wording pattern, + tester VIN-terminology note on COL-05/FLT-03.
  Full 6-report serial sweep found ONE more remnant: **WIP-EXP-07 C30516** expected-#4 caveat
  re-based on the VIN chain (caveat still reads correctly — export header text stays unpinned).
  SBC-LBL-01 notes-only residue closed (local metadata, not pushed). No other case in any report
  uses "serial" as an asset identifier (SBC-LBL-02/03 mentions = Retired-case history, untouched).
- **Push queue WAVE 2 = 4 × update_case (WIP-COL-05 C30470 / WIP-FLT-03 C30500 / WIP-SORT-03
  C30485 / WIP-EXP-07 C30516), AWAITING fresh push authorization** (Rule 6) — queue in
  `chris-update-2026-07-29/ChangeList-2026-07-29.md` § "Push queue — wave 2".
- Rule-28 mini-audit on the 4 flipped: USEFUL 4/4 KEEP · MAKES SENSE 4/4 SENSIBLE · GENUINE +
  LAYMAN-RUNNABLE 4/4. Deliverables regenerated over 460 (unified + 6 splits, header
  byte-identical, hygiene clean); id-map C-ids re-merged 460/460.
- **SPEC-WATCH:** Chris updated the spec before bed but has **NOT hand-reviewed it** — when the
  changelog lands (~2026-07-30), the re-diff must confirm the **WIP identifier text** too
  (`SPEC-WATCH-2026-07-28.md` item #1 updated; deadline 2026-08-04 stands).

**UPDATE 2026-07-29-B (AUTHORIZED CHRIS-UPDATE PUSH EXECUTED).**
- **The Chris-update push queue is EXECUTED (explicit user authorization 2026-07-29): exactly
  24 update_case + 1 add_case per `chris-update-2026-07-29/ChangeList-2026-07-29.md`, NOTHING
  else.** All 25 ops HTTP 200 + re-GET verified MATCH (title/preconds/steps/expected/refs; the
  add also section + atm fields), 0 failures. **TU-COL-01 = C38859** (section 4348 "TU — Visual
  & Accessibility"; custom_atmstatus:3 + custom_automation_type:0). No deletes, no section
  writes, no run writes — **R359 untouched**; only group 4281 touched.
- **Live count under group 4281 = 460 == id-map (460/460 rows, 0 blank C-ids).** Deliverables
  regenerated over 460: unified import + 6 per-report splits (header byte-identical 7/7; 0 VIU
  words, 0 feature-flag words, 0 internal-id leaks, 0 dup section+title; 29 API cases all in
  "— API" sections; splits row-set == unified) + coverage addenda ×6 updated to C38859.
- **Refs-cap convention applied** (same as SBC-EXP-01/SBR-LOC-03 on 2026-07-28): 14 of the 25
  refs condensed to the TestRail 250-char cap at push; full ticket+anchor text stays in local
  `spec_ref` / import References.
- Audit: execution log § "CHRIS-UPDATE PUSH 2026-07-29" (ops 134–158) in
  `reconciliation-2026-07-28/testrail-execution-log-2026-07-28.md`; executor
  `chris-update-2026-07-29/exec_chris_push_2026-07-29.py`; pre-push live snapshots of all 24
  update targets in `chris-update-2026-07-29/pre-push-snapshot/`; change-list header = EXECUTED.
- **Push authorization CONSUMED.** Open threads: **VIU-time corrections expected later per the
  user ruling** (label/placement hedges in the pushed bodies get confirmed live at VIU);
  **WIP identifier question (VIN vs serial) still PENDING with Chris** (WIP-COL-05 C30470 /
  WIP-FLT-03 C30500 / WIP-SORT-03 C30485 untouched, on serial); **SPEC-WATCH unchanged** —
  Chris's spec changelog + companion video expected ~2026-07-30, reminder deadline 2026-08-04
  stands (`SPEC-WATCH-2026-07-28.md`); filters cross-squad sweep (Branko/Milos) still to land.
- **Status update (state-save, later 2026-07-29):**
  - **WIP identifier question SENT to Chris Ward by the user 2026-07-29** (VIN vs serial for the
    WIP report — affects WIP-COL-05 C30470 / WIP-FLT-03 C30500 / WIP-SORT-03 C30485). AWAITING
    his answer. On answer: **A (VIN)** = a 3-case VIN edit pass on those cases (needs fresh push
    authorization, Rule 6); **B (serial)** = no-op (cases already on the video's serial ruling).
  - **QA branch still PENDING** — the user will notify when it exists; then run the full live VIU
    (including the VIU-time label/placement confirmations noted above).
  - **NEW Side Project #2 started 2026-07-29 (separate from Report Suite): SV-8721 5-decimal fix
    verification on PRODUCTION (`app.shopview.com`)** — devs believe the fix is deployed to prod.
    Work folder: `build/side-projects/SV-8721-5decimal-PROD-2026-07-29/`. (The staging
    verification was `build/side-projects/SV-8721-5decimal-2026-07-27/`, result = FIXED on
    staging.)

**UPDATE 2026-07-29 (second block — AUTHORIZED 3-CASE FIX + CHRIS-MESSAGE DELTA PASS).**
- **Part 1 — 3 user-authorized TestRail fixes EXECUTED** (the exact 3 drifts flagged in the
  2026-07-28 checkpoint; explicit authorization 2026-07-29; NOTHING else written, R359 untouched):
  **TU-DAY-01 C30418** import angle-bracket artifact repaired (live read "Expand 's daily
  breakdown"; rewritten plain, no angle brackets), **PV-API-02 C30389** title 100→71, **PV-FILT-09
  C30336** title 96→77 — all HTTP 200 + re-GET MATCH; pre-op live snapshots in
  `testrail-pre-push-snapshot-2026-07-28/*.pre-authorized-fix-2026-07-29.json`; audit =
  execution log § "AUTHORIZED FIXES 2026-07-29". Angle-bracket sweep of ALL bodies: TU-DAY-01 was
  the ONLY one. Gotcha recorded in APP-ACTIONS-PLAYBOOK §J (TestRail swallows `<placeholders>`).
- **Part 2 — Chris Ward group message (8:53 AM 2026-07-29) INGESTED + applied LOCALLY (NO TestRail
  writes; Rule 6):** verbatim message + ingest = `chris-update-2026-07-29/` (backups in `backup/` +
  MANIFEST). Message = NEWEST source (last-update-wins over the video AND the specs); Chris is
  updating all six specs with changelogs, **spec changelog + companion video expected ~2026-07-30**;
  summary written by his assistant "pending a human-eye-pass" → verify vs the real changelog on
  arrival. Deltas applied: **SBC identifier re-ruled to VIN → Unit # → plate** (supersedes the
  video's serial ruling FOR SBC ONLY — SBC-LBL-01 C30134 + SBC-LBL-04 C30137; **WIP stays serial,
  VIN-or-serial question QUEUED for Chris**, WIP-COL-05 C30470/WIP-FLT-03 C30500/WIP-SORT-03 C30485
  untouched); **SBC exports = Summary + Expanded for BOTH PDF and CSV, four exact menu items**
  (SBC-EXP-01 C30159, SBC-EXP-16 C38856, SBC-EXP-03 C30161, SBC-EXP-11 C30169 — the old
  no-asset-layer rule superseded); **"Locations:" line in every CSV+PDF + on-screen scope
  indicator, all 6 reports** (12 existing cases extended, no new cases needed: SBC-EXP-09 C30167
  [old "location not shown" REVERSED] + the 5 other export cases + the 6 location-scoping cases);
  **"Catalogue" → exact label "Special Order" CONFIRMED** (PV-FILT-01 C30328, PV-FILT-09 C30336,
  PV-ROW-05 C30345, PV-EXP-08 C30382; Parts Sales dropdown rename = out of scope, FYI only);
  **TU column selector ADDED → 1 NEW case TU-COL-01** (now C38859 per the 2026-07-29-B push; refs SV-8655 + the message);
  **same logo treatment** (only PV lacked coverage → PV-EXP-05 C30379 extended). Also: 8 touched
  overlong titles trimmed locally + 11 story tickets backfilled into touched cases' refs (Rule 20).
  **NEW TALLY: 460 ACTIVE authored (459 in TestRail + TU-COL-01).** Deliverables regenerated over
  460 (import + 6 splits header byte-identical, hygiene clean; id-map 459 C-ids re-merged +
  TU-COL-01 blank; coverage addenda ×6). **Change-list / push-approval gate =
  `chris-update-2026-07-29/ChangeList-2026-07-29.md` + `.xlsx` (EXECUTED 2026-07-29-B: 24
  update_case + 1 add_case, TU-COL-01 = C38859).** Rule-28 three-dimension audit on all 26 touched: 26 KEEP / 26 SENSIBLE / 26
  genuine+layman. SPEC-WATCH updated (ratification IN PROGRESS; deadline 2026-08-04 stands).
- **FILTERS CROSS-SQUAD (Chris message, second part):** Branko + Milos's app-wide Filters project
  WILL cross over with the report filters; build to spec for now but EXPECT the filter portion to
  change once something workable is on staging (Branko/Milos to sweep our report filters; Chris
  awaiting their response). Re-reconcile the filter cases when that sweep lands.

**SESSION CHECKPOINT 2026-07-28 (pre-limit) — COLD-RESUME ANCHOR (read this first on resume).**
- **COMPLETION PASS DONE 2026-07-29:** the 2 manifest-omitted Chris Q1=B Esc cases **SBR-DEACT-04 =
  C30255 + SBR-DEACT-05 = C30256** are now pushed + live-verified MATCH (2 update_case, HTTP 200,
  pre-op snapshots; independently re-verified on resume after a usage-limit kill) — Push-ALL scope
  COMPLETE (72 update / 1 add / 57 delete, suite 459 ACTIVE, R359 = 458 untouched). Remaining known
  live drifts, **AWAITING user authorization** (NOT in the consumed Push-ALL scope): TU-DAY-01
  C30418 (import `<technician>` placeholder artifact) + 2 overlong titles PV-API-02 C30389 /
  PV-FILT-09 C30336. Audit: `reconciliation-2026-07-28/testrail-execution-log-2026-07-28.md`
  § COMPLETION PASS.
- **PUSH ALL EXECUTED + VERIFIED BY EXECUTOR** (commits 93723bf / 98debf5 / ba0c043): **70
  update_case + 1 add_case (SBC-EXP-16 = C38856) + 57 delete_case**, all HTTP 200 + re-GET
  verified. **Suite now 459 ACTIVE, live == local**; run R359 = 458 tests (deletions only —
  NO run writes, R359 is Nebojsa/Viktoria's, never ours). Recovery sets:
  `testrail-pre-push-snapshot-2026-07-28/` + `consolidation-backup-2026-07-28/` +
  `video-promotion-backup-2026-07-28/`.
- **INDEPENDENT POST-PUSH VERIFICATION was IN-FLIGHT at checkpoint** (a background read-only
  worker running 7 checks vs live TestRail; output =
  `reconciliation-2026-07-28/POST-PUSH-VERIFICATION-2026-07-28.md`). **If that file is absent or
  incomplete on resume, RE-RUN the verification:** (1) live count under group 4281 == 459 ==
  id-map == import; (2) all 57 manifest deletes gone; (3) C38856 correct; (4) 12 live-vs-local
  spot-checks; (5) other groups untouched (Schedule 4254 / Filters 4110 / F&D 3894); (6) R359 ==
  458 with zero results added; (7) import hygiene.
- **THE THREE-DIMENSION AUDIT GATE (Rule 28) is live**; audit deliverables in
  `quality-audit-2026-07-28/` incl. `EXEC-NOTE-for-Stefan.md` (ready to send).
- **OPEN THREADS:** (a) SPEC-WATCH deadline **2026-08-04** — remind the user if Chris Ward
  hasn't ratified the video items into the 6 specs (`SPEC-WATCH-2026-07-28.md`); (b) Q2
  permission-discrepancy note ready to send
  (`chris-answers-2026-07-28/Q2-permission-discrepancy-for-Chris-dev.md`); (c) Chris's condensed
  PRD-companion video pending → delta pass on arrival; (d) LIVE VIU pending QA branch (ask
  Chris/user; fresh staging cookies needed); (e) suggest the user give Nebojsa/Viktoria a
  heads-up that R359 went 515→458 due to consolidation; (f) **NO further TestRail writes
  authorized — the Push-ALL authorization is CONSUMED.**

**UPDATE 2026-07-28-B (LATEST — AUTHORIZED FULL TESTRAIL PUSH EXECUTED, "Push ALL" user ruling
2026-07-28).** The whole staged bundle is now LIVE in TestRail (group 4281 ONLY): **70 update_case**
(24 video-promotion edits still active + the 9 sense-check FIX-WORDING repairs + the 41 merge
survivors — one final body per case, deduplicated) + **1 add_case: SBC-EXP-16 = C38856** (section
4300 "SBC — Exports", atmstatus 3 / automation_type 0) + **57 delete_case** (SBC-EXP-13 C30171
Print retire + 6 usefulness/sense-audit CUTs [C30148, C30246, C30284, C30357, C30497, C30560] +
50 merged-away members). ALL HTTP 200, ALL verified (re-GET MATCH on title/preconds/steps/expected/
refs; deletes verified gone), **0 failures, 0 HELD merge groups**. **NEW TALLY: 459 ACTIVE cases**
(515 − 57 + 1), live-verified: exactly 459 cases under group 4281 (96 sections, C30096–C38856),
id-map 459/459 C-ids populated (== live set). **Run R359 (Nebojsa/Viktoria, NOT ours, never written
to): 515 tests before → 458 after** (case deletions removed their tests; C38856 not in the run).
Deliverables regenerated over 459 (unified import + 6 splits, header byte-identical, 0 VIU/flag
words, 0 internal-id leaks, no dup titles, 29 API cases all in "— API" sections; per-report
SBC 82 / SBR 109 / PV 67 / TU 57 / WIP 76 / IV 68). gen_import.py now EXCLUDES Retired bodies
(kept in cases/*.json marked "Retired 2026-07-28 …" — never lost). Merge/consolidation detail +
what each survivor gained: `consolidation-backup-2026-07-28/MANIFEST.md` (106 pre-edit bodies).
Authoritative live recovery set: `testrail-pre-push-snapshot-2026-07-28/` (127 pre-push live bodies
+ R359 pre-push counts). Manifest (EXECUTED header): `reconciliation-2026-07-28/
testrail-push-manifest-2026-07-28.md`; per-case audit: `reconciliation-2026-07-28/
testrail-execution-log-2026-07-28.md`; executor scripts archived in the same folder. Refs note:
SBC-EXP-01 C30159 + SBR-LOC-03 C30215 carry condensed refs in TestRail (length cap) — full text in
local spec_ref/import. Survivor priorities/types deliberately unchanged. NEXT = live VIU on the QA
branch when it exists + Chris's spec ratification watch (SPEC-WATCH deadline 2026-08-04).

**PRIOR UPDATE 2026-07-28-A (VIDEO PROMOTED TO AUTHORITATIVE; LOCAL EDITS APPLIED; superseded by
-B for the tally and the push status).** USER RULING 2026-07-28: Chris Ward's kickoff video is AUTHENTIC + AUTHORITATIVE product
intent (made for Chris Amani, company VP) and NEWER than the six specs (last updated 2026-07-21) —
by last-update-wins the **video overrides the spec where they conflict**. Applied LOCALLY (cases/
*.json only): **27 cases edited** (20 tester-facing + 7 notes/refs-only — P24 serial-number
identifier ×8, P25 SBC Print removal ×3, P33 location-filter-hidden flips ×4, P10 All-locations
per-row location-identifier adds ×5, P3 TU nav placement ×1, and the OPEN-DECISION items per
LATEST info: P31 Catalogue special-order rewording ×4, P12 asset-dropdown native+toggle note,
P30 pagination-stands notes ×2), **1 NEW case authored: SBC-EXP-16** (compressed SBC download,
video P21 — no C-ID yet, needs authorized add_case), **1 RETIRE-PROPOSED: SBC-EXP-13 C30171**
(Print-only case — NOT deleted, awaiting authorization). **NEW TOTAL: 516 authored (515 in
TestRail + 1 new).** Per-case audit log (video quote + overridden spec wording, Rules 20/25):
`reconciliation-2026-07-28/video-promotion-edit-log-2026-07-28.md`; appliers
`apply_video_promotion_2026-07-28.py` + `apply_open_decision_2026-07-28.py`. **BACKUPS (recovery
requirement):** every touched case's verbatim PRE-EDIT body =
`video-promotion-backup-2026-07-28/` (27 files + MANIFEST.md; SBC-EXP-16 = delete-to-recover) —
if Chris never ratifies the video items into the specs, recover from there. **SPEC-WATCH (read on
ANY Report Suite touch): `SPEC-WATCH-2026-07-28.md`** — checklist of all 8 video-driven items
awaiting Chris's spec ratification, **DEADLINE 2026-08-04** (if still unratified, REMIND THE USER
+ offer backup recovery). Change-list regenerated (21 rows: 2 APPLIED-NOW / 14 APPLIED-LOCALLY /
1 RETIRE-PROPOSED / 1 NO-CHANGE-CONFIRMED / 2 OPEN-DECISION / 1 LIVE-VIU-PENDING) — it remains
the approval gate for the eventual authorized push (update_case ×26 + add_case ×1 + delete_case
×1). Deliverables regenerated over 516 (import + 6 splits, header byte-identical, 0 VIU/flag
words, no dup titles, API cases in "— API" sections); id-map re-merged 515/515 C-ids +
SBC-EXP-16 blank; coverage-*.md addenda appended. Run R359 untouched; ZERO TestRail writes.
NEXT = authorized TestRail push, then live VIU on the QA branch (Rule 22).

**Session wrap-up 2026-07-28 (Report Suite reconciliation, unattended) — all phases done, tree clean, HEAD pushed.**
Phase 1 specs captured + diffed (`b22d2af`), Phase 2 reconciliation + change-list (`16485ca`), Phase 3 Filters
cross-squad mirror (`173addd`), Phase 4 adversarial audit = CLEAN (`75d615e`). No TestRail writes, no secrets.

**UPDATE 2026-07-28 (PHASE 2) — VIDEO-DRIVEN SPEC-RELEVANCE RECONCILIATION DONE + CHANGE-LIST
DELIVERED (2 local case edits only; NO TestRail writes — Rule 6 needs explicit permission later).**
All **515** cases reconciled against the combined source of truth: the RATIFIED current Confluence
spec (primary; Phase-1 diff = unchanged since 2026-07-22 ingest,
`spec-current-2026-07-28/SPEC-DIFF-SUMMARY.md`), Chris's Q1/Q2/Q3 answers, and the 40 kickoff-video
deltas. **Deliverable:** `reconciliation-2026-07-28/Report-Suite_Spec-Reconciliation_ChangeList_2026-07-28.md`
+ `.xlsx` (generator `gen_changelist.py`); 19 change-list rows, Tab 2 = items blocked on Chris's spec update.

- **APPLIED-NOW (2 local edits, firmly confirmed by Chris Q1 = B):** **SBR-DEACT-04 (C30255)** reworded so
  pressing Esc does NOT close the "deactivate a sales rep" confirm dialog (Cancel + X only; app house rule
  wins over spec S13-R8); refs set to `SV-8630 (S13-R8)` per Rule 20; title 78 chars. **SBR-DEACT-05 (C30256)**
  consistency edit (Esc never closes at any time) + overlong title shortened to ≤80. Both still VIU-Pending
  (live-confirm on QA branch later).
- **PENDING-CHRIS (11 rows — NOT edited, spec still contradicts the video, Rule 23):** serial-number asset
  identifier (P24 → SBC-LBL-01 C30134 + WIP-COL-05 C30470 families); remove SBC Print (P25 → SBC-EXP-01 C30159,
  SBC-EXP-13 C30171); add SBC compressed download (P21 → new case to author); per-row location label on the 5
  non-WIP reports (P10 → SBC-LOC-03 C30111 family); Catalogue rename (P31 → PV-FILT-01 C30328 family);
  location-filter hide-when-≤1-location (P33 → SBR-LOC-04 C30216, TU-LOC-05 C30446, IV-LOC-04 C30577, PV-FILT-13
  C30340 — currently assert the OPPOSITE straight from spec).
- **OPEN-DECISION (4):** asset-dropdown stays-open vs native+toggle (P12, WIP-FLT-03 C30500); IV column-selector
  scope (P18/P36, IV-PERS-01 C30579); PV pagination vs infinite-scroll (P30, PV-API-01 C30388); TU column
  selector (P18 — none authored, correct).
- **LIVE-VIU-PENDING (2):** WIP labor-delta basis — spec S4-R23 uses QUOTED−worked (case matches spec, NOT
  edited), video P14 says invoiced−worked; confirm live (WIP-CALC-08 C30481). TU nav "move down" (P3, TU-NAV-01
  C30392) — spec is order-agnostic, confirm placement live.
- **Confirmed already-matching (no edit):** All-Time removal (P9, ~365-day backend cap = data caveat); "Sales
  By Representative" naming (P5); "Parts" nav group PV+IV (P2 → PV-NAV-01 C30322/IV-NAV-01 C30534); no "snapshot
  taken X days ago" label (P32; IV "As of" kept); labor-delta green/black/red colors (P14).
- **Q2 permissions:** all permission cases KEPT as the shipped MIXED model (user ruling 2026-07-28); discrepancy
  captured for Chris/dev in `chris-answers-2026-07-28/Q2-permission-discrepancy-for-Chris-dev.md`; not edited.

**Counts: 515 total / 2 edited-now / ~30 cases flagged across 19 change-list rows (11 pending-Chris + 4
open-decision + 2 live-VIU) / remainder clean no-op.** Deliverables regenerated: import CSV/XLSX + 6 per-report
splits (515 rows, header byte-identical, VIU/flag-word-free, no dup titles, API cases in "— API" sections);
`testrail-id-map.csv` C-ids re-merged 515/515 (0 blank). Run R359 untouched; NO TestRail API calls this pass.
**NEXT:** live VIU on the QA branch (Rule 22 — no QA branch yet) + Chris's spec update to unblock the 11
PENDING-CHRIS items, then an authorized TestRail push.

---

**UPDATE 2026-07-28 — CHRIS ANSWERS INGESTED + USER RULINGS (NO TestRail writes, NO
case edits — documentation + a draft note only). ON HOLD.** Chris Ward answered all 3
PO questions (source `chris-answers-2026-07-28/answers-ingested.md`): Q1 = **B** (Esc must
NOT close the SBR deactivate confirm dialog — Golden Rule wins), Q2 = **B** ("these should
be gated by normal reports access"), Q3 = **B** (a kickoff video exists — pinned in chat,
has visual issues — plus a condensed click-through Chris will film). **Two user rulings
recorded 2026-07-28:**
- **RULING 1 (Q2 permission model) — KEEP cases as authored to the SHIPPED build's MIXED
  model** (Sales By Customer = its own dedicated permission; Parts Velocity + Inventory
  Value = inventory-reports access; Sales By Rep = performance group; etc.). Do NOT reword
  them to Chris's "normal reports access" answer. Instead **RAISE the discrepancy** (PO
  wants one single normal-reports permission vs the build shipped a mixed model) back to
  Chris/dev for a decision. **Cases stay as-is until they rule.** Reader-facing draft note
  = `chris-answers-2026-07-28/Q2-permission-discrepancy-for-Chris-dev.md` (draft, NOT sent).
- **RULING 2 (process choice) — best approach delegated to us; recorded plan:** when we
  proceed (AFTER the Loom video is accessible AND the QA branch exists), run
  **SPEC-RELEVANCE-RECONCILIATION first** — fold Chris's Q1/Q2/Q3 answers + the kickoff
  video + the forthcoming condensed click-through across all 515 cases to decide which need
  a change — **THEN BUILD-ACCURATE-WORDING + live VIU on the QA branch.** The **Q1
  SBR-deactivate-dialog edit** (SBR-DEACT-04 = C30255: pressing Escape must NOT close the
  confirm dialog — Golden Rule wins) is **QUEUED for that reconciliation pass, to be
  VIU-confirmed live, NOT edited now.**

**STATUS: ON HOLD** pending (a) Loom kickoff video access (user is making it public),
(b) the condensed click-through Chris will film, (c) the Report Suite QA branch. **No case
edits / no TestRail writes until then.** Tally unchanged: 515 cases in TestRail.

**KICKOFF-VIDEO TRANSCRIPT INGESTED 2026-07-28 (documentation only — NO TestRail writes, NO
case edits):** the Loom kickoff video transcript is saved verbatim at
`chris-answers-2026-07-28/loom-kickoff-transcript.md` and a structured deltas/clarifications
doc extracted to `chris-answers-2026-07-28/video-deltas-2026-07-28.md` (40 points: 7 FIRM
DELTA · 3 PENDING-SPEC · 6 OPEN DECISION · 1 CROSS-SQUAD · 2 VISUAL-REFERENCE · 21
CONFIRMATION; per-report roll-up + the Filters-squad persistence CROSS-SQUAD clash inside).
**Ingested + on-hold pending the process decision (RULING 2 reconciliation pass);** feeds the
eventual SPEC-RELEVANCE-RECONCILIATION → build-accurate wording → live VIU. FIRM headlines:
new "Parts" nav subsection (PV+IV); TU nav must move down (additive-not-interruptive);
"Sales by Representative" label (not "Associate"); "All locations" + a location identifier on
EVERY report; ADD a compressed download view to Sales By Customer; asset identifier UNIT
NUMBER→SERIAL/BIN; REMOVE the Print button from Sales By Customer.

**UPDATE 2026-07-27 — EPIC SV-8582 INGESTED + RECONCILED (NO TestRail writes, NO
authoring):** the Jira epic is now known = **SV-8582** (ingested via Atlassian MCP;
epic Open, 97 child stories SV-8583→SV-8679 contiguous, branch
`project/reports-suite-bravo`, QA Nebojsa + Viktoria). **Reconciliation: the 97
stories MATCH our 515 authored cases 1:1** — the 80 per-report stories are thin
wrappers pointing at the same Confluence specs we already ingested (0 comments/0
attachments across all 97 → no designs/video), the 9 engineering stories (PR-1/A2–A5
Open, B1–B6 OBSOLETE) change no cases. Inventory Value (added to the epic 2026-07-26)
already authored. Sources: `epic-sv8582/INGEST-SUMMARY.md` + `epic-sv8582/RECONCILIATION.md`.
**Chris PO-questions doc READY (not sent by us): `PO-Questions-Chris-ReportSuite-2026-07-27.md/.xlsx`**
(SBR Esc vs Golden-Rule #9; per-report permission-model confirm; confirm no designs/video).
**~3–6 backend/regression cases deferred to the QA branch** (PV×QB fractional-qty precision
from PR-1 INT→DECIMAL, IV nightly-snapshot retention/prune, exact permission names/themes).
OPEN = QA branch/env + flag state + Chris's answers. Tally unchanged: 515 cases in TestRail.

**IMPORTED + MAPPED 2026-07-22 (READ-ONLY):** All 515 cases were imported into
TestRail under group **4281 "Reports Suite"** (six report folders 4282–4287,
each holding its per-area leaf subsections 4288–4376 = 89 leaves). Live read
confirmed exactly **515 cases** under 4281. Execution run **R359 "Reports Suite
- Nebojsa/Viktoria (VIU Pending)"** exists (515 tests, all Untested — NOT
created by us; do not write results without permission). `testrail-id-map.csv`
is now **fully populated**: 515/515 rows matched to real C-ids by exact
(section-leaf-name + exact title), **0 unmatched / 0 ambiguous / 0 leftover
TestRail cases**; observed **C-id range C30096–C30610**. Mapping done with
read-only get_sections + get_cases only — **NO TestRail writes**. Note per
project rule: `gen_import.py` BLANKS the id-map C-id column on rerun — re-merge
C-ids after any regeneration; deliverables with C-id/link columns can be
regenerated next.

**ADVERSARIAL REVIEW DONE 2026-07-22 — both auditors CLEAN after fixes
(SBC/SBR/PV: 3 minor doc/note fixes, b410d29; TU/IV clean; WIP: 2 fixes incl.
one real coverage gap [WIP-TAB-02 no-status-filter expected item + WIP-SORT-03
reword], 82f1665). Independent bullet counts recorded: SBC 235/235 · SBR
230/230 · PV 69/69 · TU ~111 · WIP ~119 · IV ~110 — ALL MAPPED. Suite = 515
cases / 89 sections / 6 reports; import REGENERATED post-review (delta vs
pre-review CSV = exactly the two WIP rows, nothing else; id-map byte-identical;
full gate re-passed: 515==515==515, header 5/5 byte-identical, 0 VIU/flag
words, 0 internal-id leaks, no empty fields, XLSX==CSV, deterministic rerun).
STATUS = READY FOR USER IMPORT — PER-FOLDER WORKFLOW (2026-07-22): the user
MANUALLY CREATED TestRail group **4281 "Reports Suite"** with six EMPTY
per-report subsections — **4282 "Sales By Customer Report" · 4283 "Sales By
Representative Report" · 4284 "Parts Velocity Report" · 4285 "Technician
Utilization — Product Specification" · 4286 "Work In Progress — Product
Specification" · 4287 "Inventory Value — Product Specification"** — and will
import ONE report at a time targeting each folder (the CSV Section column
creates the "XXX — area" leaf sections inside that folder). Six per-report
split files EMITTED for this (see §0.6); folders 4282–4287 confirmed created,
AWAITING CASE IMPORT. The read-only C-id mapping step is staged as the next
resume action — map C-ids into `testrail-id-map.csv` once the cases land →
VIU when env/Epic arrive (ask Chris Ward: TU S8 video inconsistency + IV
export-cap value; Epic key ask-at-VIU; designs pending; specs-will-change →
Rule-11 reconciliation per update).**

- **Case inventory (515 total, per report / sections):** SBC 99 (18 sections) ·
  SBR 127 (23) · PV 70 (9) · TU 59 (12) · WIP 83 (14) · IV 77 (13). Source:
  `cases/*.json` (26 files, uniform schema; `area` = the "XXX — leaf" TestRail
  section value; 29 API cases, all in "<Report> — API" sections per Rule 4).
  All cases `viu_status: VIU-Pending` (spec-only authoring, no designs).
- **Coverage 6/6 COMPLETE:** `coverage-{sbc,sbr,pv,tu,wip,iv}.md` — every
  spec requirement/negative/edge bullet mapped to case IDs per report
  (bullet-by-bullet maps; explicit exclusions listed where applicable).
- **Import READY (Rule 16 pure 1:1):**
  `testrail-import/report-suite-v1-testrail-import.csv` + `.xlsx` via
  `gen_import.py` — header byte-identical to ALL FIVE prior imports
  (fees-discounts / simple-flow / global-search / filters / schedule; equality
  check run 5/5 True); 515 rows; Section = the "XXX — leaf" value (the user's
  import nests these under the "Report Suite" main section per §0.5);
  deterministic ordering (report order SBC, SBR, PV, TU, WIP, IV → authored
  section order → id); VIU-word-free + feature-flag-free (0 hits); 0
  internal-id leaks in reader-facing cells (14 "(see PV-PERM-01)"-style
  cross-refs rewritten generically by `clean()`, same fix as Schedule); no
  duplicate titles within a section; every row has non-empty
  Preconditions/Steps/Expected; XLSX matches CSV row-for-row; rerun is
  byte-identical (deterministic).
- **id-map:** `testrail-id-map.csv` — 515 rows, blank C-ids, schema
  `internal_id,testrail_case_id,title,section` (same as Filters/Schedule).
  ⚠️ GOTCHA (same as Filters/Schedule): rerunning `gen_import.py` BLANKS the
  C-id column — after C-ids are populated, RE-MERGE them after any rerun.
- ONE project, SIX reports, each with its own spec (see §1 inventory).
- **PO: Chris Ward** (same PO as Fees & Discounts — never mix attributions:
  Report Suite = Chris Ward; Global Search / Filters / Schedule = Branko;
  Simple Flow = Milos).
- **Epic / Jira key: NOT AVAILABLE — ⚠️ ASK THE USER when VIU begins** (do NOT
  invent). Every spec's header reads Epic = TBD.
- **Designs: NOT YET AVAILABLE** — every story's Design field is TBD (two specs
  mention a "companion video" as visual reference; not provided). SPEC-ONLY
  authoring: build-accurate wording (Rule 9) from the spec text (these specs are
  unusually label-rich — verbatim strings, filenames, column orders, colors);
  mark anything unpinned "VIU-confirm"; design-reconciliation later if designs
  arrive.
- **QA env / branch / feature-flag status: NOT AVAILABLE — ask at VIU.**
- **Ask Chris Ward at VIU:** TU S8 companion-video inconsistency (OQ-3), IV
  export-cap value (OQ-4); Epic key ask-at-VIU (OQ-1); designs pending (OQ-3).
- **Specs WILL keep changing** (user statement). On every spec update run
  `build/SPEC-RELEVANCE-RECONCILIATION-PROCESS.md`; per Standing Rule 11 ALWAYS
  ASK which process(es) to run before proceeding.
- **TestRail: NOTHING pushed** (no writes without explicit permission —
  Standing Rule 6). `testrail-id-map.csv` = 515 rows, C-ids blank until the
  user's import assigns them (then read-only map from the shared group URL).

## 0.5 TestRail structure (user-prescribed)

ONE main section **"Report Suite"** → one **SUBSECTION per report** (named after
the report) → that report's cases inside. For the import CSV this means the
Section column carries the report name; the user's import creates the parent
"Report Suite" group. Cases with API/backend content (HTTP, endpoints, status
codes — e.g. the nightly-snapshot backend stories) go in a **"<Report> — API"**
section per Standing Rule 4. Import format = **pure 1:1** with the established
`testrail-import/<project>-testrail-import.csv` layout (Standing Rule 16: 8
named columns + 2 trailing blank columns, header byte-identical, no ID columns;
traceability via `testrail-id-map.csv` per Rule 8; VIU-word-free +
feature-flag-free).

## 0.6 Per-report import split files (2026-07-22)

For the user's per-folder import workflow (§0 STATUS: group 4281, subsections
4282–4287), `gen_import.py` now ALSO emits **six per-report import files** —
the unified `report-suite-v1-testrail-import.csv`/`.xlsx` is UNCHANGED
(byte-verified against the pre-split file). **RENAMED 2026-07-22 to
HUMAN-READABLE filenames** (user rule: spell report names out in full — never
cryptic abbreviations like sbc/pv/tu; the old
`report-suite-v1-{sbc,sbr,pv,tu,wip,iv}-…` files were removed; CSV contents
byte-identical to the pre-rename files):

| TestRail folder (manually created by the user) | CSV (`testrail-import/`) + `.xlsx` twin | Rows |
| --- | --- | --- |
| 4282 Sales By Customer Report | `Report-Suite_Sales-By-Customer-Report_testrail-import.csv` | 99 |
| 4283 Sales By Representative Report | `Report-Suite_Sales-By-Representative-Report_testrail-import.csv` | 127 |
| 4284 Parts Velocity Report | `Report-Suite_Parts-Velocity-Report_testrail-import.csv` | 70 |
| 4285 Technician Utilization — Product Specification | `Report-Suite_Technician-Utilization-Report_testrail-import.csv` | 59 |
| 4286 Work In Progress — Product Specification | `Report-Suite_Work-In-Progress-Report_testrail-import.csv` | 83 |
| 4287 Inventory Value — Product Specification | `Report-Suite_Inventory-Value-Report_testrail-import.csv` | 77 |

Sum 515. VERIFIED programmatically 2026-07-22 (re-verified after the rename):
header byte-identical to the
canonical header in all six; every data row byte-identical to its unified-file
counterpart in the same per-report order (byte-level concatenation of the six,
minus repeated headers, == the unified CSV exactly); XLSX == CSV row-for-row
in all 7 files; Section values in each file all carry that report's prefix;
CSVs byte-identical across reruns (deterministic). Import each CSV targeting
its folder above — the Section column creates the "XXX — area" leaf sections
inside that folder.

## 1. Per-report spec inventory (6/6 ingested 2026-07-22)

| # | Report | Spec file (specs/) | Canonical Confluence URL (login-walled — pointer only, do NOT fetch) | Doc header | Latest change-log | Req-bullet count* |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | SBC Sales By Customer | `sbc-sales-by-customer.md` | https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/577634305/SBC+Sales+By+Customer+Report | Owner TBD · In review — 2026-07-16 | 2026-07-21 (Milan resolution) | 235 |
| 2 | SBR Sales By Representative | `sbr-sales-by-representative.md` | https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/585629698/SBR+Sales+By+Representative+Report | Owner TBD · In review — 2026-07-16 | 2026-07-21 (Milan re-review) | 224 |
| 3 | Parts Velocity | `parts-velocity.md` | https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/620888066/Parts+Velocity+Report | Owner TBD · In review — 2026-07-16 | 2026-07-16 (server-side model) | 69 |
| 4 | Technician Utilization | `technician-utilization.md` | https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/641400833/Technician+Utilization+Report | Owner Chris W. · In review — 2026-07-16 | 2026-07-16 (Milan review) | 109 |
| 5 | WIP Work In Progress | `wip-work-in-progress.md` | https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/703660034/WIP+Work+In+Progress+Report | Owner Chris W. · Draft — 2026-07-19 | 2026-07-21 (Milan + Chris override) | 118 |
| 6 | Inventory Value | `inventory-value.md` | https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/720142338/Inventory+Value+Report | Owner Chris W. · Draft — 2026-07-19 | 2026-07-21 (server-side model) | 108 |

\* Count of `S#-R/N/E` requirement bullets in the decoded spec (requirements +
negative + edge cases); a sizing signal, not a case count. Total ≈ **863**.

Extraction method (all 6, same): Confluence "Export to Word" MHTML /
quoted-printable `.doc` → Python `email` (MIME walk to `text/html`,
`get_payload(decode=True)`) + BeautifulSoup, all headings/lists/tables
preserved (tables → pipe tables). SBC arrived as export revision `_2`; the
other five as `_1`.

All six specs share the suite-canonical PRD layout: §1 Business Case · §2
Feature Overview (+ Known Limitations/Out of Scope) · §3 Key Decisions · §4
Terminology · §5 Assumptions · §6 Requirements (Stories with S#-R/N/E) · §7
User Feedback Summary (verbatim message table) · §8 Change Log.

## 2. Per-report readiness snapshot (authoring-planning view)

Common suite patterns (appear in most/all six — author once per report, reuse
wording): Reports left-nav entry + permission gate; date-range presets +
366-day-capped Custom + NO "All Time"; multi-select Location filter (rightmost,
defaults to active location, constrained to accessible locations); per-browser
remembered view (filters/columns/sort) with DEFENSIVE restore; column selector
with a pinned un-hideable headline column (bold, right-pinned); server-side
pagination/sort/filters/exports (committed build target — several specs are
"spec ahead of current code by design"); ⋯ overflow export menu; verbatim
toast/empty-state strings ("Empty bays, endless possibilities. Get Going!" on
the Parts/ops reports; per-report strings on the sales reports); 10,000-row
export cap with a "too large… narrow the date range or filters" toast; dark
mode + accessibility blocks; half-up rounding computed-from-unrounded.

1. **SBC Sales By Customer** — three-level tree Customer → Asset → Invoice
   (per-customer "Parts Sales" bucket for no-vehicle work); filters: date
   range, Product Type (P/S invoice-number prefix), server-backed type-ahead
   multi-select Customer filter (explicit "all-customers state"), Location;
   columns Inv. Hrs / Labor+Parts Invoiced+Margin / Shop Supplies / Margin /
   Margin % / pinned bold Subtotal; asset-label derivation rules (unit → plate
   → VIN-suffix → "Unknown Asset", dedup "(#N)"); server sort/pagination + lazy
   drill-down; exports CSV + PDF + Print (flat, no asset layer; range-based
   filenames; 10k cap); URL-shareable range (saved view wins over link);
   dedicated SBC View permission. 21 stories (2 retired placeholders), 235
   bullets. Label-richness EXTREME (exact hex colors, date formats, filename
   map). API contract: none explicit (server-side behaviors described
   functionally). Est. ~55–75 cases.
2. **SBR Sales By Representative** — per-rep grouped rows (contributors-only,
   A→Z, "(Inactive)" tag, pinned "Unassigned" row via Show Unassigned toggle);
   5-state→3-value payment-status mapping (single source of truth for badge +
   Invoice Status filter); Inv. Hrs colored delta; pinned bold Subtotal +
   responsive grand-Totals (desktop merged row / mobile bar); 4 exports
   (Summary/Expanded × PDF/CSV, font-size tier table, 10k row cap); PLUS three
   beyond-the-report surfaces: Story 13 staff deactivation type-YES dialog,
   Story 15 Sales Rep Assignments CSV (Export Reports dialog), Story 19 WO/Part
   Sale "Sales Rep" selector + invoice-time snapshot fallback (WO rep →
   customer rep → Unassigned). 23 stories (no Story 7), 224 bullets.
   Label-richness EXTREME (verbatim §7 message table incl. the canonical
   "Ooooops! An error occured" typo-as-shipped). API contract: none explicit.
   Known build-deltas to expect at VIU: single-rep model vs shipped dual-field
   schema; contributors-only vs seeded-toggle-reps handler; Expanded-CSV hours
   columns. Est. ~60–80 cases.
3. **Parts Velocity** — introduces the Reports→Parts section; Inventory vs
   Catalogue row model (per-location inventory rows, merged catalogue rows); 20
   columns (14 default) with authoritative per-column calc/format/null table
   (Story 5: Demand ranking, movement-vs-billed bases, reversal netting,
   Turns/Yr, Last Sale all-time lookback); filters Type/date/Category/Vendor/
   Bin/Location + toolbar search; ⓘ header tooltips (verbatim); CSV/PDF (A3
   landscape, alignment differences documented). 7 stories, 69 bullets (dense —
   much of the spec is calc tables). Permission: Inventory Reports → View
   (shown-then-denied nav model to confirm — S1-N2 build-note). API contract:
   none explicit. Calc-heavy: needs seeded WO/parts-sale/return/reversal data
   at VIU. Est. ~45–60 cases.
4. **Technician Utilization** — one row per technician with clocked time; Total/
   WO/Internal Hours, Utilization %, pinned bold Est. Lost Labor (per-location
   rate valuation; "$0.00" vs "—" vs partial-valuation semantics); Summary row
   over VISIBLE technicians; lazy per-day breakdown; on-screen technician
   filter (deselected-set persistence) vs server-side Location filter; Total
   Hours deep-link to Timesheet Activities (reconciliation-to-the-cent
   guarantee S1-R9 with two documented scope exceptions); exports Summary/
   Expanded PDF + CSV (A→Z order, screen sort NOT exported). 9 stories, 109
   bullets. Permission: reuses timesheet-reports permission. API contract: none
   explicit. Known build-delta: shipped single-rate lost-labor rollup + old
   tooltip wording. Est. ~40–55 cases.
5. **WIP Work In Progress** — four tabs (Approved-partially completed /
   Approved-not started / Completed / Estimates) with derived tab placement;
   Earned/Remaining money model from APPROVED lines only (Total = Earned +
   Remaining ≠ WO grand total); seven-figure summary strip (verbatim tooltips);
   on-screen Advisor/Customer/Asset filters vs reloading date/Location; 17
   columns (9 default); per-tab Totals; CSV/PDF per tab ("wip-2-report.*";
   Unit/Branch export-header quirk; "1 days" non-pluralization — documented
   known limitations, NOT defects); Story 11 nightly WIP snapshot (backend, no
   reader this version → API-section candidates). 11 stories, 118 bullets.
   Permission: reuses a WIP-reports permission. API contract: none explicit
   (snapshot schema described). Est. ~50–65 cases.
6. **Inventory Value** — one row per in-stock, non-core part per location
   (50–60k-part scale → fully server-side); valuation rules (fixed sell price →
   pricing-matrix markup → cost fallback); pinned bold Total Cost headline +
   default sort; server-computed totals row; as-of date model (live fallback
   for today, closest snapshot on-or-before otherwise, "As of" indicator);
   Story 11 nightly snapshot capture + 13-month daily / then monthly retention
   (backend → API-section candidates); Category/Vendor/part-search filters;
   PDF/CSV exports (as-of line, 10k cap). 12 stories, 108 bullets. Permission:
   reuses inventory-reports permission. API contract: none explicit. OPEN in
   spec: export-cap value "10,000 is a proposed default — confirm the exact
   suite-standard value with the owner before dev" (S10-R12). Est. ~45–60
   cases.

**Rule-4 note:** no spec defines an explicit REST/API contract (no endpoints,
verbs, or status codes) — server-side behavior is specified functionally. API
sections will be needed mainly for the two nightly-snapshot backend stories
(WIP S11, Inventory Value S11) and any backend-check cases we author.

## 3. Open questions (carry to Chris Ward / ask-at-VIU)

- **OQ-1 (ask at VIU):** Epic/Jira key(s) — one epic for the suite or one per
  report? Not available yet; every spec says TBD.
- **OQ-2 (ask at VIU):** QA env/branch + feature-flag/settings status per
  report (are all six on one branch?).
- **OQ-3:** Designs/Figma — none yet; two specs (Inventory Value S12 context
  note, Technician Utilization S8 context note) defer visual detail to a
  "companion video" that was removed from the header / not provided. Ask
  whether videos/designs exist to reconcile against. (TU header-cleanup removed
  the Companion Video row while S8's note still references it — minor spec
  self-inconsistency to flag.)
- **OQ-4 (product, for Chris):** Inventory Value S10-R12 export-cap value —
  spec itself says confirm the suite-standard value with the owner before dev.
- **OQ-5 (product, for Chris):** permission-model inconsistency across the
  suite — SBC uses a DEDICATED "Sales By Customer report View" permission
  (S1-R2) while SBR rides the Performance-group access (S1-R1) and PV/TU/WIP/IV
  reuse existing report permissions. Confirm intended (affects the permission
  cases we author).
- **OQ-6 (expectation-setting):** several specs are explicitly "spec ahead of
  current code by design" (server-side model committed 2026-07-16/21) and carry
  named build-deltas (SBR single-rep schema + contributors-only; PV reversal
  netting; TU per-location lost-labor). At VIU these will surface as
  deviations until dev catches up — track, don't file as new bugs without
  checking the spec's build-delta notes.
- **OQ-7:** tech-plan tuning values intentionally not fixed by the SBR spec
  (per-rep detail page size; expand-all bound) — unpinnable until build exists.

## 4. Deliverables index

- `specs/sbc-sales-by-customer.md` · `specs/sbr-sales-by-representative.md` ·
  `specs/parts-velocity.md` · `specs/technician-utilization.md` ·
  `specs/wip-work-in-progress.md` · `specs/inventory-value.md` — the COMPLETE
  decoded specs (verbatim-structured, all tables), each with a metadata header
  (canonical URL, doc status, extraction method).
- `cases/*.json` — 26 files, 515 authored cases (SBC 99 / SBR 127 / PV 70 /
  TU 59 / WIP 83 / IV 77), uniform schema, `area` = TestRail leaf section.
- `coverage-sbc.md` · `coverage-sbr.md` · `coverage-pv.md` · `coverage-tu.md`
  · `coverage-wip.md` · `coverage-iv.md` — 6/6 per-report coverage docs,
  every spec bullet mapped to case IDs.
- `gen_import.py` — unified + per-report import + id-map generator (Rule 16
  pure 1:1; self-checking: dupes/leaks/VIU-words/empties/API-section routing).
- `testrail-import/report-suite-v1-testrail-import.csv` + `.xlsx` — 515 rows,
  header byte-identical to all five prior project imports.
- `testrail-import/Report-Suite_<Full-Report-Name>_testrail-import.csv`
  + `.xlsx` — the six per-report split files (§0.6; human-readable names
  2026-07-22: Sales-By-Customer-Report / Sales-By-Representative-Report /
  Parts-Velocity-Report / Technician-Utilization-Report /
  Work-In-Progress-Report / Inventory-Value-Report; SBC 99 / SBR 127 / PV 70 /
  TU 59 / WIP 83 / IV 77; each row byte-identical to its unified counterpart)
  for the user's per-folder import into group 4281 subsections 4282–4287.
- `testrail-id-map.csv` — 515 internal ids, blank C-ids (⚠️ rerunning
  gen_import.py blanks C-ids — re-merge after any rerun once populated).
- `PROJECT-STATE.md` — this file.
- (Not yet created: PO question sheet — the OQ-3/OQ-4/OQ-5 Chris items get
  sheeted per Rule 7 when the user asks / at VIU.)

## 5. Env / access facts

- Nothing project-specific yet (no QA env named). Reuse shared infra when VIU
  starts: `build/TESTING-RUNBOOK.md`, `build/APP-ACTIONS-PLAYBOOK.md`,
  `build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md`,
  `build/SPEC-RELEVANCE-RECONCILIATION-PROCESS.md`, TestRail API patterns
  (project 1 / suite 1 "Master").
- TestRail: NO writes made; none permitted without explicit user permission.

## 6. HOW TO RESUME (ordered)

1. Read this file top to bottom (§0 = the definitive current state: 515 cases
   authored + ADVERSARIALLY REVIEWED CLEAN 2026-07-22, import regenerated
   post-review, ready for user import).
2. ADVERSARIAL REVIEW: **DONE 2026-07-22** (Rule 15/17) — both auditors CLEAN
   after fixes (SBC/SBR/PV 3 minor doc/note fixes b410d29; TU/IV clean; WIP 2
   fixes incl. one real coverage gap 82f1665); independent bullet counts SBC
   235/235, SBR 230/230, PV 69/69, TU ~111, WIP ~119, IV ~110 — all mapped.
3. **Next step:** the USER imports PER REPORT — six split files (§0.6),
   each targeting its manually-created folder under group 4281 "Reports
   Suite" (4282–4287; the Section column creates the "XXX — area" leaf
   sections inside that folder). Folders confirmed created 2026-07-22,
   awaiting case import. Then: READ-ONLY C-id mapping populates
   `testrail-id-map.csv` (515 rows; ⚠️ re-merge C-ids after any gen_import.py
   rerun — it blanks them) — this mapping step is the staged resume action
   once the cases land. NO TestRail writes without explicit permission.
4. When a spec UPDATE arrives: ask which process(es) to run (Standing Rule 11)
   — expect SPEC-RELEVANCE-RECONCILIATION per update (specs will keep
   changing).
5. When VIU begins: ask for Epic key(s), QA env/branch, flag/settings status
   (OQ-1/2); ask which process(es) to run (Rule 11); raise the Chris Ward
   items (TU S8 video inconsistency OQ-3, IV export cap OQ-4, permission-model
   OQ-5); designs still pending; live-observed evidence only (Rules
   10/12/13/14).
6. Keep PO attribution straight: Report Suite = **Chris Ward**.
