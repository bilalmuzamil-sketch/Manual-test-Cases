# Fabian design-review reconciliation — CONSOLIDATED REPORT for the QA lead (2026-08-17)

Plain-English wake-up summary of the three Fabian-review authoring passes — **Schedule**, **Report
Suite** and **Filters**. All three are **complete within their authorised scope**. Build verification
was **deliberately deferred by your instruction** on all three: the app was never opened,
`quick-login`/`switch-user` were never called, **0 cases were build-verified and 0 steps were walked
live**. Every touched case carries `AUTOMATION: Not available on Build to test Yet - Last checked
8/17/2026` (Standing Rule 69) and a documented-source provenance line; a later build-verify sync lifts
those markers.

The companion index of every case is **`ALL-CASES-CREATED.md`** in this folder.

---

## 🔴 DECISIONS / AUTHORIZATIONS NEEDED FROM YOU (aggregated across all three projects)

Nothing below blocks the QAs from running the suites today (see the last section). These are the things
only you (or another team) can clear.

**1 — Sync the three execution runs (three separate go-aheads).** Each run was built from a fixed case
selection (`include_all: false`), so it is frozen and the new cases will not appear until synced. A run
write needs your explicit **per-ask** permission (Rules 6/34), and a union-only sync (a partial list
would delete other testers' results). Staged and ready:
- **Schedule run 357** (Ayesha's) — frozen at **176**, union to **195** = **19 new cases** to add
  (C43795–C43813). `build/schedule/fabian-review-2026-08-17/STAGED-RUN-357-SYNC.md`.
- **Report Suite run 359** (Nebojsa/Viktoria's) — **9 new cases** to add (C43832–C43840); staged, not
  executed. *(The prior pass's 18 new Adjustments cases, C43814–C43831, are not documented as synced
  either — please confirm whether they too are still absent.)*
- **Filters run 352** (Ahtasham's) — union to **129** = **9 new cases** to add (C43841–C43849).
  `build/filters/fabian-review-2026-08-17/STAGED-RUN-352-SYNC.md`.
- *Owner:* you. *Blocks:* the new cases appearing in the execution runs (a run-only reviewer would
  otherwise see a false coverage gap). *Since:* 2026-08-17.

**2 — `add_case` automation-status value: confirm `1` is correct going forward.** The task brief said to
create new cases with `custom_atmstatus:3`. All three passes deliberately used **`1`** ("Not Automated")
instead, because **`3` is the "Automated" flag Vladimir Tomovic's automation keys off** — writing `3`
onto fresh manual cases would corrupt his signal. `1` matches common-core §3.1. *Owner:* you. *Blocks:*
nothing now; needs a one-line confirmation so future passes are consistent. *Since:* 2026-08-17.

**3 — Two design artifacts could not be fetched (needed to pin exact visual styling).** Both are undated,
editable Claude share links, not reachable from the container:
- **Report Suite Fabian Claude artifact** — needed to pin the **3 new Report visual cases** (WIP-VIS-08
  amber active-tab glow / SBR-VIS-06 two-row header wrap / SBC-VIS-04 grouped-totals math strip,
  C43838–C43840). The testable behaviour is asserted; the exact colour/layout/threshold is marked
  "confirm live".
- **Filters primary Claude design (`Filters.html`)** — the redesign's primary design; the cases were
  authored from the spec prose (complete for labels), but a rendering link would let us pin a few
  "confirm live" labels.
- *Owner:* you / engineering — a dated export or screenshots. *Blocks:* pinning exact styling on those
  cases (they remain behaviourally correct). *Since:* 2026-08-17.

**4 — Jira ticket creation is still on HOLD, so defect findings are written up but nothing is filed.**
Standing Rule 62 + your 2026-08-10 "create nothing until my next order" ruling remain active. Findings
this scope produced (e.g. Schedule's SCH-DAY-04 no-move-toast observation, the SCH-PANEL not-built
observations, held for the build-verify sync) are recorded in
`build/schedule/fabian-review-2026-08-17/KNOWN-FAILURES-FOR-SYNC.md` — **0 tickets created, 0 closed.**
*Owner:* you. *Blocks:* filing any defect; also blocks lifting a not-built case to `EXPECT FAIL` with a
ticket number. *Since:* 2026-08-10 (still active).

**5 — Chris Ward: two Report Suite product/spec-hygiene answers.**
- **WIP duplicate tooltip:** the WIP Estimates info-icon tooltip is stated two ways in the spec — S5-R12
  (short) vs S5a-R2 (locked). The cases follow **S5a-R2**; please ask Chris to **drop the S5-R12
  leftover** so the spec stops contradicting itself.
- **C30458 (WIP tab placement) is HELD** — the spec states two different tab-placement rules (whole-WO-
  by-status vs per-line-state) and Chris has been asked which governs. C30458 was deliberately **not
  touched** so the genuine PO-question HOLD and its raw-markup note are not clobbered; it gets a
  dedicated pass once Chris answers. *Owner:* Chris Ward. *Blocks:* finalising C30458 and the tooltip
  wording. *Since:* this pass (tooltip carried from the prior pass).

**6 — Branko: the greyed-vs-hidden Status chip, plus engineering's per-view filter list (Filters).**
- **Greyed-vs-hidden Status chip (C29609/C29610), HELD.** Filters spec v21 S9-R5 says the Status chip is
  **hidden** on Estimates/Completed; your recorded **QA-lead ruling of 30 July 2026** said
  greyed-out/pre-filled. Per Rule 33 the ruling was **not silently reversed** — the verdict is held and
  flagged for you. *Owner:* you (and/or Branko). *Blocks:* the Status-visibility verdict on 2 cases.
- **Per-view filter list is PENDING from engineering** (spec S1-R8 / S13-R23). Until it lands, QA has no
  baseline for exactly which chips belong on which Parts view / Report, so those cases stay behavioural
  + "confirm live". *Owner:* engineering. *Blocks:* precise Parts/Reports chip coverage. *Since:* spec
  v20, 14 Aug.

**7 — Schedule: the tech-plan-vs-v30 shop-closures conflict (a decision, and this is the report your
ruling requires).** Spec v30 §4.5/§12 now say the multi-day spread **skips weekends only** and **shop
closures/public holidays receive shifts** — resolving the oldest Schedule question (open since 22 July).
This **contradicts the 2026-07-29 engineering tech plan**, which built real closure-skipping. Per your
2026-08-12 tech-design ruling the **spec wins** (Rule 32) and the cases follow v30; **reporting the
contradiction to you is the action your ruling requires.** Cases affected: SCH-SPREAD-07 (C29983),
SCH-EDGE-05 (C30089), SCH-SPREAD-08 (C29984). *Owner:* you. *Since:* this pass.

**8 — The technical-design-vs-PRD authority question (still open, all projects).** Standing Rule 57's
2026-08-06 follow-up put the **technical design** on the authoritative source list, while Rule 30 says a
tech plan "informs but never overrules" product truth. **You have not ruled on which prevails**, and our
reading (Rule 30's subordination still holds for product behaviour) is ours, pending your confirmation.
*Owner:* you. *Blocks:* any case that would turn on the difference (held). *Since:* 2026-08-06.

**9 — The later BUILD-VERIFY sync (all three projects).** Every case this scope touched is
documents-verified only and carries the Rule-69 "Not available on Build to test Yet" marker. A future
pass, once a fresh `.qa.shopview.com` sign-in is available, must build-verify each and lift the marker to
**READY** (or **READY - EXPECT FAIL (SV-xxxx)** where a live-backed ticket exists — see Schedule's
`KNOWN-FAILURES-FOR-SYNC.md` for the observations to re-establish). *Owner:* you (a sign-in) + a future
worker. *Blocks:* any "ready to automate" figure for the new/updated cases. *Since:* 2026-08-17.

**Lower-priority / tidy items (also outstanding, non-blocking):**
- **Schedule C30075** (view-only "no Assign work order" line — a 1-line touch when next authorised) and
  **C30015** (modal-Reassign open PO question — a product decision, left flagged).
- **Filters provenance re-stamp:** the 55 unchanged Filters cases still name spec v18/v19 in their
  provenance — a version-only re-stamp to v21 is owed (behaviourally correct; currency tidy). Do it now,
  or fold it into the build-verify sync — your call.
- **Design finality (Schedule):** is Sasha's design final? If so, re-ingest and confirm the ~48 labels
  currently marked "VIU-confirm".
- **Tech plans / technical design for the Fabian scope** — none supplied for Schedule, Report Suite or
  Filters (Rule 30 reminder).

**Aggregated outstanding items: 13** (9 numbered decisions/authorizations above + 4 lower-priority tidy
items).

---

## Per-project status

**Schedule** — **Complete within scope.** The v25→v30 spec re-ingest is **done** (`requirements.md`
promoted to the v30 baseline, 0 orphaned anchors), the 14 new Fabian stories are covered, and every
existing case they touched is aligned. New authored: **19** (C43795–C43813). Updated: **28**. Reconciled
to: **spec Confluence v30**, **epic SV-8685 (39 children)**. Build-verified: **0** (deferred);
steps-walked: **0**. Live TestRail census: **ours 195 / live 195 / foreign 0** (group 4254), sets equal
both ways. Two named out-of-scope caveats (C30075 incomplete, C30015 open PO question) are flagged, not
acted on. 0 live contradictions across all 195 cases.

**Report Suite** — **Substantially complete.** All 7 staged Loom review items executed and byte-verified;
suite internally consistent (0 live contradictions, 0 cases still show "Inv. Hrs"). New authored: **27**
(18 prior Adjustments-column + 9 this pass, C43814–C43840). Updated: **54** (1 prior + 53 this pass).
Reconciled to: **SBC v20 / SBR v22 / PV v10 / TU v9 / WIP v21 / IV v10**, **epic SV-8582 (114 children)**.
Build-verified: **0** (deferred); steps-walked: **0**. Live TestRail census: **ours 507 / live 519 /
foreign 12** (group 4281; foreign = Vladimir Tomovic, 0 touched), four counts set-equal both ways.
Remaining: C30458 HELD on Chris's tab-placement answer; items 2/3/4 exact visual styling "confirm live"
pending the design artifact.

**Filters** — **Complete against spec v21 for everything the redesign changed or added.** The redesign
was a fundamental one (chips into the toolbar row, collapse toggle removed, WO reduced to three chips,
new "Assigned to me" toggle chip, shared-link banner, mobile per-filter sheets). New authored: **9**
(C43841–C43849). Updated / repurposed: **60**. Reconciled to: **spec Confluence v21**, **epic SV-8785
(33 children)**. Build-verified: **0** (deferred); steps-walked: **0**. Live TestRail census: **ours 124
/ live 129 / foreign 5** (group 4110; foreign = Ahtasham Amjad, 0 touched), four counts set-equal both
ways. Three honest qualifiers: build verification deferred; the 55 unchanged cases still name spec
v18/v19 in provenance (re-stamp owed); the greyed-vs-hidden Status question is held for you.

---

## WHAT THE QAs CAN DO NOW

**The suites are internally consistent, current to the documents (spec / epic / stories / PO answers),
and runnable as written by a manual tester.** Contradiction sweeps came back clean on all three
(0 live contradictions), every case is byte-verified against its intended payload, and every touched
case is fully sourced. **Build verification is the only deferred step** — once a QA-branch sign-in is
available, the build-verify sync confirms each case against the running build and lifts the Rule-69
markers to READY / EXPECT FAIL. Until then, QAs can execute the cases and mark anything off as Blocked
for the standard revisit loop.
