# Technician Utilization (TU) — Coverage Matrix

> **CONSOLIDATION UPDATE 2026-07-28 (user-authorized, pushed to TestRail):** the suite was
> consolidated to **57 active TU cases**. Every case ID below still resolves:
> a merged-away ID's coverage now lives in its SURVIVOR (mapping below); cut cases' assertions
> were either duplicates of a survivor or dropped by the usefulness/sense audit. Detail:
> `consolidation-backup-2026-07-28/MANIFEST.md` + `quality-audit-2026-07-28/MERGE-PLAN.md`.
>
> Merged-away → survivor: TU-HRS-01 → TU-HRS-02; TU-TECH-05 → TU-NAV-08.


> Report Suite project — per-report coverage doc. Spec source:
> `build/report-suite/specs/technician-utilization.md` (revision `_1`, ingested
> 2026-07-22; latest change-log entry 2026-07-16 — All-Time removed, 366-day cap,
> lazy per-day breakdown, single report-level timezone, per Milan's review).
> Cases: `build/report-suite/cases/cases-tu-*.json` — **59 cases / 12 sections**,
> all `viu_status: VIU-Pending` (SPEC-ONLY authoring; no designs yet).
> LOCAL ONLY — nothing pushed to TestRail.

## ⚠️ Spec self-inconsistency flag (for Chris — already an OQ; do not block)
Story 8's context note still cites **"the companion video (linked in the header)"**
as the visual reference — but the 2026-07-16 header cleanup **removed the Companion
Video row** from the header (see the change log). The visual reference the note
points at no longer exists in the doc. Consequence for QA: anything S8's
requirements do not state explicitly has NO design source at all and is treated as
VIU-confirm (noted in TU-VIS-01). Flagged for Chris Ward; authoring did not block
on it.

## Case inventory (59)

| Section (TestRail subsection under "Report Suite") | IDs | Count |
| --- | --- | --- |
| TU — Access & Display | TU-NAV-01..08 | 8 |
| TU — Hours & Utilization | TU-HRS-01..04 | 4 |
| TU — Est. Lost Labor | TU-ELL-01..05 | 5 |
| TU — Sorting | TU-SORT-01..05 | 5 |
| TU — Summary | TU-SUM-01..04 | 4 |
| TU — Per-Day Breakdown | TU-DAY-01..05 | 5 |
| TU — Technician Filter | TU-TECH-01..05 | 5 |
| TU — Deep Links | TU-LINK-01..06 | 6 |
| TU — Exports | TU-EXP-01..08 | 8 |
| TU — Location Filter | TU-LOC-01..05 | 5 |
| TU — Visual & Accessibility | TU-VIS-01..02 | 2 |
| TU — API (Standing Rule 4; generic wording, no invented endpoints) | TU-API-01..02 | 2 |

## Requirement → case map

### §2 Feature Overview / §3 Key Decisions
| Requirement | Case(s) |
| --- | --- |
| One row per technician for range + locations | TU-NAV-02 |
| Row columns (hours, rate, Est. Lost Labor) | TU-HRS-01..03, TU-ELL-01 |
| Pinned Summary over VISIBLE technicians | TU-SUM-01..04 |
| Expandable per-day breakdown | TU-DAY-01..05 |
| Sortable / tech-filtered (on-screen) / location-scoped (server) | TU-SORT-02, TU-TECH-02, TU-LOC-02, TU-API-02 |
| Total Hours deep link | TU-LINK-01..06 |
| PDF (summary/expanded) + CSV downloads | TU-EXP-01..08 |
| Reconciliation with Timesheet Activities to the cent | TU-LINK-03 (guarantee), TU-LINK-04/05 (the 2 documented exceptions, encoded as EXPECTED behavior) |
| Out of scope: scheduled exports | Excluded — out of scope by spec §2 (no cases) |
| Key decision: tech filter on-screen / location server-side | TU-TECH-02, TU-LOC-02, TU-API-02 |
| Key decision: remembered range/tech/location; sort NOT remembered | TU-TECH-04, TU-SORT-03, TU-NAV-03 |
| Key decision: Est. Lost Labor pinned bold headline | TU-ELL-02 |
| Key decision: per-location valuation | TU-ELL-01 (KNOWN BUILD-DELTA) |
| Key decision: compute-from-unrounded, round-half-up, once | TU-HRS-02/03, TU-ELL-01, TU-SUM-02 (incl. the expected penny drift context note) |

### §4 Terminology / §5 Assumptions
Encoded inside the relevant cases: internal vs WO vs total hours definitions
(TU-HRS-02), utilization definition (TU-HRS-03), Est. Lost Labor definition
(TU-ELL-01), per-location rate model + $0-rate-vs-no-rate distinction (TU-ELL-03/04,
§5 assumption 1), record-carries-location but single report-level timezone
(TU-NAV-06, §5 assumption 2), shared rounding with Timesheet Activities
(TU-LINK-03, §5 assumption 3).

### Story 1 — Report Access and Display
| Req | Case(s) |
| --- | --- |
| Prereq (timesheet-reports permission, no new permission) | TU-NAV-01 (precondition), TU-NAV-07 |
| S1-R1 | TU-NAV-01 |
| S1-R2 | TU-NAV-02 |
| S1-R3 | TU-NAV-03 |
| S1-R4 | TU-NAV-04 |
| S1-R5 | TU-NAV-04, TU-API-02 |
| S1-R6 | TU-NAV-03, TU-LOC-02 |
| S1-R7 | TU-NAV-06 |
| S1-R8 | TU-TECH-04 (+ TU-LOC-03 defensive half) |
| S1-R9 | TU-LINK-03 (guarantee), TU-LINK-04 (exception a), TU-LINK-05 (exception b) |
| S1-R10 | TU-NAV-05 |
| S1-N1 | TU-NAV-07 |
| S1-N2 | TU-NAV-08 |
| S1-E1 | TU-LINK-04 |
| S1 context notes (partial-range / midnight split / report-level TZ) | TU-NAV-06 |

### Story 2 — Columns and Calculations
| Req | Case(s) |
| --- | --- |
| S2-R1 | TU-HRS-01 |
| S2-R2 / S2-R3 / S2-R4 | TU-HRS-02 |
| S2-R5 | TU-HRS-02 |
| S2-R6 / S2-R7 | TU-HRS-03 (unreachable "—" state: TU-HRS-04) |
| S2-R8 | TU-ELL-01 (KNOWN BUILD-DELTA: single-rate rollup) |
| S2-R9 | TU-ELL-01 |
| S2-R10 / S2-R11 | TU-ELL-02 |
| S2-R12 | TU-SORT-01 |
| S2-R13 | TU-SORT-02 |
| S2-R14 | TU-SORT-02 |
| S2-R15 | TU-SORT-03 |
| S2-R16 | TU-SORT-04 |
| S2-R17 | TU-SORT-05 |
| S2-E1 | TU-HRS-04 |
| S2-E2 | TU-ELL-03 |
| S2-E3 | TU-ELL-04 |
| S2-E4 | TU-ELL-05 (encoded as EXPECTED known limitation, no partial indicator) |
| S2 context note ($0.00 vs — states; ≤100%) | TU-ELL-03/04, TU-HRS-04 |

### Story 3 — Summary Totals Row
| Req | Case(s) |
| --- | --- |
| S3-R1 / S3-R2 | TU-SUM-01 |
| S3-R3 | TU-SUM-02 |
| S3-R4 | TU-SUM-03 |
| S3-R5 | TU-SUM-04 |
| S3-R6 / S3-R7 | TU-SUM-01 |
| S3-N1 | TU-TECH-05 (Summary hidden when no rows visible) |
| S3 context note (visible = selected in filter) | TU-SUM-02 notes |

### Story 4 — Per-Day Breakdown
| Req | Case(s) |
| --- | --- |
| S4-R1 | TU-DAY-01 |
| S4-R2 | TU-DAY-02 (UI), TU-API-01 (backend on-demand fetch) |
| S4-R3 | TU-DAY-03 |
| S4-R4 | TU-DAY-04 |
| S4-R5 | TU-DAY-05 (+ TU-API-01 reset consequence) |
| S4-N1 | TU-DAY-02 |

### Story 5 — Technician Filter
| Req | Case(s) |
| --- | --- |
| S5-R1 / S5-R2 | TU-TECH-01 |
| S5-R3 / S5-R4 / S5-R5 | TU-TECH-02 |
| S5-R6 / S5-R7 | TU-TECH-03 |
| S5-R8 / S5-R9 | TU-TECH-03 |
| S5-R10 | TU-TECH-04 |
| S5-N1 | TU-TECH-05 |
| S5-E1 | TU-SUM-02 |
| S5 context note (on-screen only, no reload) | TU-TECH-02, TU-API-02 |

### Story 6 — Total Hours Links to Timesheet Activities
| Req | Case(s) |
| --- | --- |
| S6-R1 | TU-LINK-01 |
| S6-R2 / S6-R3 / S6-R4 | TU-LINK-02 |
| S6-R5 | TU-LINK-06 |
| S6-R6 | TU-LINK-05 (encoded as EXPECTED drill-through limitation) |
| S6-N1 | TU-LINK-01 |

### Story 7 — Export to PDF and CSV
| Req | Case(s) |
| --- | --- |
| S7-R1 / S7-R2 / S7-R3 / S7-R4 | TU-EXP-01 |
| S7-R5 / S7-R6 | TU-EXP-02 |
| S7-R7 | TU-EXP-03 |
| S7-R8 / S7-R9 | TU-EXP-04 |
| S7-R10 | TU-EXP-05 (formats + "—"), TU-EXP-03 (CSV comma-quoting) |
| S7-R10a | TU-EXP-05 (A→Z always; on-screen sort NOT carried into the export — expected) |
| S7-R11 | TU-EXP-06 |
| S7-R12 | TU-EXP-02/03 (filenames incl. the shipped casing note) |
| S7-N1 | TU-EXP-07 (silent no-op — expected) |
| S7-N2 / S7-N3 | TU-EXP-06 |
| S7-E1 | TU-EXP-04 |
| Story 7 Error Handling | TU-EXP-08 |

### Story 8 — Visual Conformance and Accessibility
| Req | Case(s) |
| --- | --- |
| S8-R1 | TU-VIS-01 |
| S8-R2 | TU-EXP-01 |
| S8-R3 | TU-VIS-01 |
| S8-R4 | TU-ELL-02 |
| S8-R5 | TU-SUM-01 |
| S8-R6 / S8-R7 | TU-ELL-02 (KNOWN BUILD-DELTA: shipped single-rate tooltip wording) |
| S8-R8 | TU-SORT-01 |
| S8-R9 | TU-VIS-02 |
| S8-R10 | TU-SORT-01 |
| S8-R11 | TU-ELL-04 |
| S8-R12 | TU-DAY-01 (per-row), TU-DAY-04 (all-rows) |
| S8-R13 | TU-VIS-02 |
| S8-R14 | TU-LINK-01, TU-VIS-02 |
| S8-N1 | TU-ELL-02 |
| S8 context note (companion video) | ⚠️ Spec self-inconsistency — see flag at top; TU-VIS-01 notes |

### Story 9 — Location Filter
| Req | Case(s) |
| --- | --- |
| S9-R1 | TU-LOC-01 |
| S9-R2 | TU-NAV-03 |
| S9-R3 / S9-R4 / S9-R5 | TU-LOC-02 (+ TU-DAY-02 day-row pooling, TU-API-02 server reload) |
| S9-R6 | TU-LOC-03 |
| S9-R7 | TU-LOC-04 |
| S9-R8 | TU-EXP-04 |
| S9-N1 | TU-LOC-05 |
| S9-N2 | TU-NAV-08 |

### §7 User Feedback Summary (messages)
| Trigger/message | Case(s) |
| --- | --- |
| No-data "Empty bays, endless possibilities. Get Going!" (all three causes: no clocked time / cleared technicians / empty location) + Summary hidden + shared copy | TU-NAV-08 (no data, location), TU-TECH-05 (cleared filter) |
| "Download started" | TU-EXP-08 |
| "Failed to download report" | TU-EXP-08 |
| Silent no-op with no technician selected | TU-EXP-07 |

## Encoded expected-behavior (NOT defects) register
Cases that deliberately assert documented quirks as PASS behavior:
- **TU-LINK-04** — open-clock snapshot difference (reconciliation exception a).
- **TU-LINK-05** — multi-location drill-through shows active shop only (exception b).
- **TU-ELL-05** — partial Est. Lost Labor valuation with no indicator (S2-E4 known limitation).
- **TU-SUM-02** — displayed rows may eye-sum a cent off the Summary (compute-from-unrounded).
- **TU-SUM-04** — Summary understates when any visible tech is "—"/partial.
- **TU-EXP-05** — export ignores the on-screen sort (always A→Z).
- **TU-EXP-07** — silent no-op download with no technician selected.
- **TU-NAV-08 / TU-TECH-05** — one shared no-data string for all causes.
- **TU-EXP-02/03** — mixed Title-Case/lower-case filenames and "(PDF)"-label wording as shipped.

## Exclusions (with reasons)
- **§2 Out of scope — scheduled/automatic exports:** no cases (feature absent by spec).
- **"All Time" date range:** deleted from the spec 2026-07-16 (former Story 10) — no
  cases author it; the 366-day cap that replaced it is TU-NAV-04.
- **No REST/API contract exists in the spec** — TU-API-01..02 are generic
  backend-behavior cases (Standing Rule 4 placement) asserting observable server
  behavior only; no endpoints invented; actual requests recorded at VIU.

## Known-delta register (author-to-spec; expect build deviations until dev ships)
| Case | Delta |
| --- | --- |
| TU-ELL-01 | S2-R8 per-location valuation: current rollup applies a single (first-encountered) location rate to the total internal hours (owner decision 2026-07-11; single-location views already exact) |
| TU-ELL-02 | S8-R7 tooltip: shipped text reads "Default labor rate multiplied by internal hours"; spec requires "Internal hours valued at each location's default labor rate" |
| TU-NAV-04 | 366-day Custom cap + All-Time removal (2026-07-16 round) may not be in the build yet |
| TU-NAV-06 | Single report-level timezone model (2026-07-16, Milan option 1) may lag in the build |
| TU-DAY-02 / TU-API-01 | Lazy on-expand per-day loading (2026-07-16) may lag — build may ship day rows with the initial payload |

## VIU-confirm register (labels/states the spec does not pin — never invented)
| Case | To confirm live |
| --- | --- |
| TU-NAV-01 / TU-NAV-07 | Exact timesheet-reports permission name in the roles screen |
| TU-NAV-04 | Date-picker preset labels; how the >366-day rejection is presented |
| TU-NAV-05 | Standard reports loading indicator appearance |
| TU-DAY-01 | Rendered accessible name with a real technician name (spec prints "Expand 's daily breakdown" with the name interpolated) |
| TU-VIS-01 | All icon/styling details S8 does not state (visual reference gap — see the companion-video flag) |
| TU-EXP-08 | Failure-induction method |
| TU-API-01/02 | The actual backend requests/responses (no contract in spec) |

## Heavy data-seeding needs (flagged in case notes for VIU planning)
- Controlled clock records: WO + internal time per technician; a tie-producing
  duration (.x5) for the round-half-up proof (TU-HRS-02/03).
- Two locations with DIFFERENT default labor rates + one technician clocking
  internal time at both (TU-ELL-01, TU-LOC-02, TU-LINK-05); a location with NO
  rate and one with a $0.00 rate (TU-ELL-03/04/05, TU-SORT-05) — restore all rate
  settings afterwards (shared env).
- Cross-midnight and range-straddling clock records; locations in two time zones
  (TU-NAV-06).
- An open (not clocked-out) record during the check (TU-LINK-04).
- Skewed-hours technician pair for the weighted-average proof (TU-SUM-03).
- Est. Lost Labor above $1,000 for the CSV comma-quoting check (TU-EXP-03).
- Shop logo set/unset toggling (TU-EXP-06); location-access removal/restore
  (TU-LOC-03); single-location ZZAUTOTEST staff (TU-LOC-05).

## Open questions / flags
- The S8 companion-video citation vs the removed header row (top of this doc) —
  for Chris; already an OQ; authoring did not block.
- Epic/Jira key + QA env/flag status: NOT AVAILABLE — ask the user when VIU begins.

## ADDENDUM 2026-07-28 — video-promotion (user ruling: video overrides spec)
- **TU-LOC-05 C30446 FLIPPED** (video P33): single-location user now expects NO Location
  filter — S9-N1 is overridden.
- **TU-LOC-01 C30442** now also covers the All-Locations location identifier (video P10;
  pooled-rows wording). **TU-NAV-01 C30392** now also covers below-existing-links placement
  (video P3). TU column selector: latest info confirms the veto stands — no case needed (no-op).
- Detail: reconciliation-2026-07-28/video-promotion-edit-log-2026-07-28.md; watch:
  ../SPEC-WATCH-2026-07-28.md (deadline 2026-08-04).

## Addendum 2026-07-29 — Chris Ward group-message deltas (LOCAL only, awaiting push)
Source: `chris-update-2026-07-29/chris-message-2026-07-29.md` (newest, last-update-wins). All-reports:
"Locations:" line in every CSV+PDF export + on-screen location-scope indicator (covered by extending
this report's existing export + location-scoping cases — no new cases needed) + same logo treatment
(only PV lacked coverage → PV-EXP-05 extended). Per-report deltas mapped in
`chris-update-2026-07-29/ChangeList-2026-07-29.md`: SBC = VIN→Unit #→plate identifier (SBC-LBL-01/04)
+ Summary/Expanded exports, four menu items (SBC-EXP-01/03/09/11/16); PV = "Special Order" rename
confirmed (PV-FILT-01/09, PV-ROW-05, PV-EXP-08); TU = NEW column-selector case TU-COL-01 (= C38859, pushed
2026-07-29); WIP = identifier stays serial, VIN-or-serial question queued for Chris; SBR/IV = the all-reports
items only. Spec changelog expected ~2026-07-30 — re-verify then.
