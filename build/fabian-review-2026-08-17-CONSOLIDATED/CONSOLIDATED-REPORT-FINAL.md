# Fabian design-review + whole-case currency — FINAL CONSOLIDATED REPORT for the QA lead (2026-08-17 / 18)

Plain-English wrap-up of the whole effort across **Schedule**, **Report Suite** and **Filters**: the
2026-08-17 Fabian design-review authoring passes **plus** the 2026-08-17/18 whole-case currency passes
that followed them. **Every one of our cases in all three suites is now current to its latest spec** —
content, labels, references and provenance. This file supersedes the earlier `CONSOLIDATED-REPORT.md`
(kept for the record); the companion master list of every case is
**`FINAL-CURRENT-CASE-INDEX.md`** in this folder.

**Two things are true and worth saying up front:**
1. **The suites are runnable as written by a manual QA tester today** — internally consistent, current
   to the documents, byte-verified against their intended payloads, fully sourced.
2. **Build verification is the only deferred step.** The app was never opened on any pass
   (`quick-login`/`switch-user` never called), so **0 cases were build-verified**. Every touched case
   carries `AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026` (Standing Rule 69);
   a later build-verify sync lifts those markers to READY / EXPECT-FAIL.

**Already done since the first consolidation (no longer outstanding):**
- **All three execution runs are synced** — the 55 new cases were added to run 357 (Schedule), 359
  (Report Suite) and 352 (Filters) on 2026-08-18, union-only, 0 results lost, `include_all` still false
  (`run-sync-2026-08-17/RUN-SYNC-REPORT.md`).
- **The 55 Filters cases that still named spec v18/v19** were re-stamped to v21 by the currency pass.
- **The 3 Report Suite raw-markup cases** (C30458, C30588, C30606) were demarked to plain text and
  brought current on 2026-08-18 (`report-suite/currency-2026-08-17/demark-3-2026-08-18/`).

---

## CURRENCY — every case now matches the latest spec

Each project got a whole-suite currency pass (not just the Fabian-delta cases). The four buckets below
reconcile to each project's full suite count.

| Project | Content-updated | Reference-only re-stamped | Already-current (untouched) | Still "confirm live" / HELD | Suite total | Current to |
|---|---:|---:|---:|---|---:|---|
| **Schedule** | 5 | 143 | 47 | 1 PO-hold case (SCH-DND-09) + ~48 design labels marked VIU-confirm | 195 | Confluence **v30**, epic SV-8685 |
| **Report Suite** | 36 | 387 | 81 | C30458 HELD + 3 visual "confirm live" cases (+ PV-COL-02 spec contradiction) | 507 | **SBC v20 / SBR v22 / PV v10 / TU v9 / WIP v21 / IV v10**, epic SV-8582 |
| **Filters** | 0 | 55 | 69 | greyed-vs-hidden Status (C29609/C29610) + ~26 per-view "confirm live" + persistence C29614 | 124 | Confluence **v21**, epic SV-8785 |

- **Schedule** "reference-only" = 142 version-pin + 1 minimal PO-hold re-stamp. Content-updated 5 were
  rewritten to v30 wording (delete-scope hours model, per-shift notes, unassigned dept-header lane +
  chip); SCH-MODAL-06 was a genuine coverage gap the whole-suite re-read caught.
- **Report Suite** content-updated 36 = PV Avg Cost/Avg Sell rename + CSV null (13) · IV date-range →
  "as of" date model (16) · TU Total-Hours link scope-gate (3) · WIP Total = Earned+Remaining+
  Adjustments (1) · SBC/SBR toggleable-column counts (3). All documents-sourced (Rule 57), quote-back
  verified, nothing invented.
- **Filters** content changes for the v21 redesign were all completed by the Fabian pass earlier the
  same day; the currency pass found **0** content-stale cases and only owed the v19→v21 re-stamp (55).

### Live TestRail census (our cases vs foreign, group)
| Project | Ours | Live total | Foreign (author) | Group |
|---|---:|---:|---|---|
| Schedule | 195 | 195 | 0 | 4254 |
| Report Suite | 507 | 519 | 12 (Vladimir Tomovic — 0 touched) | 4281 |
| Filters | 124 | 129 | 5 (Ahtasham Amjad — 0 touched) | 4110 |

Four counts (live / local / id-map / import) set-equal both ways on every project; import header sha256
identical to all six peers; 0 shredded cells; 0 foreign cases touched; 0 live contradictions
(Rule-28 sweep clean on all three).

### Marker distribution per project (post-pass, live)
| Project | Rule-69 "Not available on Build to test Yet" | READY - EXPECT FAIL | HOLD | plain READY |
|---|---:|---:|---:|---:|
| Schedule | 194 | 0 | 1 | 0 |
| Report Suite | 387 | 83 | 37 | 0 |
| Filters | 110 | 4 | 10 | 0 |

The **build-verify sync** (outstanding item #5 below) is what lifts the Rule-69 markers to `READY` — or
to `READY - EXPECT FAIL (SV-xxxx)` where a live-backed defect ticket exists. Live-backed EXPECT-FAIL and
genuine HOLD markers were **preserved**, not overwritten, so no ticket link or HOLD reason was lost; the
folded-in reasons are kept per-C-id in each project's `KNOWN-FAILURES-FOR-SYNC*.md` for the sync to
re-establish.

---

## REMAINING OUTSTANDING — what only you (or another team) can clear

Action-first. Nothing here blocks the QAs from running the suites today.

| # | What it is (plain) | What you do | Why it matters | Priority |
|---|---|---|---|---|
| 1 | **The 2026-08-05 "newest wins" design decision needs its screenshots re-attached.** The Report Suite / Schedule design is an **undated, editable Claude share link** that can't be fetched from the container; you said screenshots are the substitute. | Attach dated screenshots (or a dated export) of the design. | Until they land, the 3 Report visual cases (WIP-VIS-08 / SBR-VIS-06 / SBC-VIS-04, C43838–C43840) and Schedule's ~48 VIU-confirm labels can't be pinned to exact colour/layout/label — they stay "confirm live" (behaviour is asserted). | **High** |
| 2 | **Two PO question sheets are written and ready to send.** Chris (Report Suite) and Branko (Filters + Schedule). | Send them, or tell me to. Chris: `build/report-suite/questions-2026-08-17/Report-Suite_Questions-for-Chris-Ward_2026-08-17.md` / `.xlsx`. Branko: `build/filters/questions-2026-08-17/Filters-and-Schedule_Questions-for-Branko_2026-08-17.md` / `.xlsx`. | Their answers settle every held product question below (tab placement, greyed-vs-hidden chip, Month-view drag, shop closures). Until answered those cases stay hedged/held, not asserted. | **High** |
| 3 | **Engineering owes the per-view filter list** (Filters spec S1-R8 / S13-R23). | Ask engineering for the list of which chips each Parts view / Report / entity page carries today. | Without it QA has no baseline for the Parts/Reports/entity per-view chip cases (C38904–11, C29566–88) — they stay HOLD / "confirm live". | **High** |
| 4 | **Build-verify sync (all three projects).** Every touched case is documents-verified only and carries the "Not available on Build to test Yet" marker. | Provide a fresh `.qa.shopview.com` sign-in; a future worker then build-verifies each case and lifts the marker. | This is the single thing standing between the suites and an "Automation Ready" figure — Schedule 194, Report 387, Filters 110 markers wait on it. | **High** |
| 5 | **Jira ticket creation is on HOLD** (Standing Rule 62 + your 2026-08-10 "create nothing until my next order"). Defect findings are **written up, nothing filed** (0 created, 0 closed). | When ready, lift the hold — the hold stays in force through **and beyond** build verification, per your ruling, until you say otherwise. | Blocks filing any defect and blocks lifting a not-built case to `EXPECT FAIL` with a real ticket number. | **Medium** |
| 6 | **Chris: WIP tab-placement (C30458) is HELD**, and the WIP Estimates tooltip is stated two ways in the spec (S5-R12 short vs S5a-R2 locked). | Ask Chris which tab-placement rule governs, and to drop the S5-R12 tooltip leftover. (Both are in the Chris sheet, item 2.) | C30458 keeps a valid HOLD + divergence note until answered; the tooltip contradiction stays in the spec. | **Medium** |
| 7 | **Branko: greyed-vs-hidden Status chip (C29609 / C29610) is HELD.** Filters v21 S9-R5 says the chip is **hidden** on Estimates/Completed; your recorded **30 July 2026 QA-lead ruling** said greyed/pre-filled. | Rule which governs. Per Rule 33 the ruling was **not silently reversed** — held for you. | Settles the Status-visibility verdict on 2 cases. | **Medium** |
| 8 | **Schedule shop-closures conflict (a reporting-required decision).** Spec v30 §4.5/§12 now say the spread **skips weekends only** and **shop closures receive shifts** — contradicting the 2026-07-29 engineering tech plan, which built closure-skipping. | Note it. Per your 2026-08-12 tech-design ruling the **spec wins** (Rule 32); cases already follow v30 (SCH-SPREAD-07/C29983, SCH-EDGE-05/C30089, SCH-SPREAD-08/C29984). **Reporting it is the action your ruling requires.** | Nothing changes in the cases; this is the surfaced contradiction you asked always to be told about. | **Medium** |
| 9 | **The technical-design-vs-PRD authority question (all projects, open).** Rule 57's 2026-08-06 follow-up put the technical design on the authoritative list; Rule 30 says a tech plan "informs but never overrules". | Rule which prevails on product behaviour. Our reading (Rule 30 subordination still holds) is ours, pending your confirmation. | Any case that would turn on the difference is held. | **Medium** |
| 10 | **`add_case` automation-status value.** The brief said `custom_atmstatus:3`; all passes deliberately used **`1`** ("Not Automated") because `3` is the "Automated" flag Vladimir's automation keys off. | One-line confirmation that `1` is correct going forward. | Nothing now; keeps future passes consistent. | **Low** |
| 11 | **Schedule tidy-ups.** SCH-PERM-02 / C30075 (view-only "no Assign work order" line — a 1-line touch) and SCH-MODAL-08 / C30015 (modal-Reassign open PO question). | Authorise the C30075 touch; decide the C30015 product question (in the Branko sheet). | Small completeness items, non-blocking. | **Low** |
| 12 | **Design finality + tech plans (Rule 30).** Is Sasha's newer Schedule design final? No tech plan / technical design was supplied for the Fabian scope on any of the three projects. | Confirm design finality (then we re-ingest and confirm the ~48 VIU-confirm labels); supply the tech plans if they exist. | Pinning unconfirmed labels; strengthening edge/API coverage. | **Low** |

**Two optional provenance-consistency tidy decisions** (flagged by the demark worker — recommendation given, your call, neither blocks anything):

| # | The small inconsistency | Recommendation |
|---|---|---|
| A | The 3 demarked Report cases (C30458, C30588, C30606) name **epic + owning story** in provenance sentence 1; the other 504 name **epic only**. | Harmless — naming the owning story is *more* precise, not wrong. **Recommend: leave as-is**, or fold "add owning story to sentence 1" into the build-verify sync so all 507 match. Do **not** run a standalone write pass just for this. |
| B | The 3 demarked cases carry a read-date of **18 Aug 2026** (done a day later) while their `AUTOMATION` marker keeps the literal **8/17/2026** (the pass's marker string). | Cosmetic. **Recommend: leave as-is** — the 8/17 marker literal is the pass identifier, and the 18 Aug read-date is honestly the day they were read; the build-verify sync will re-stamp both anyway. |

**Outstanding count: 12 numbered items + 2 optional tidy decisions.**

---

## WHAT THE QAs CAN DO NOW

**All three suites are current to their latest specs, internally consistent (0 live contradictions),
fully sourced, byte-verified, and runnable as written by a manual tester.** The execution runs already
contain every new case. **Build verification is the only deferred step** — once a QA-branch sign-in is
available, the build-verify sync confirms each case against the running build and lifts the Rule-69
markers to READY / EXPECT FAIL. Until then, QAs execute the cases as written and mark anything that
looks off as **Blocked** for the standard revisit loop.
