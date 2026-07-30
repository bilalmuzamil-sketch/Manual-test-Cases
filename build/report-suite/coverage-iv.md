# Inventory Value (IV) Report — Coverage Matrix

> **CONSOLIDATION UPDATE 2026-07-28 (user-authorized, pushed to TestRail):** the suite was
> consolidated to **68 active IV cases**. Every case ID below still resolves:
> a merged-away ID's coverage now lives in its SURVIVOR (mapping below); cut cases' assertions
> were either duplicates of a survivor or dropped by the usefulness/sense audit. Detail:
> `consolidation-backup-2026-07-28/MANIFEST.md` + `quality-audit-2026-07-28/MERGE-PLAN.md`.
>
> Merged-away → survivor: IV-NAV-04 → IV-FLT-02; IV-DATE-07 → IV-NAV-06; IV-LOC-05 → IV-NAV-06; IV-SCOPE-03 → IV-SCOPE-01; IV-SCOPE-04 → IV-SCOPE-01; IV-TOT-04 → IV-TOT-02; IV-EXP-08 → IV-EXP-09; IV-VIS-03 → IV-TOT-01.
> Cut (retired, body kept locally): IV-TOT-05 (duplicate of merged no-data case).


> **Report Suite project — per-report coverage doc (authored 2026-07-22, spec revision `_1`,
> latest change-log entry 2026-07-21 — server-side data model per Milan's review).**
> Source spec: `build/report-suite/specs/inventory-value.md` (verbatim-structured).
> Case source: `build/report-suite/cases/cases-iv-A..E-*.json` — **77 cases / 13 sections**,
> internal IDs `IV-<AREA>-NN`, all `viu_status: VIU-Pending` (spec-only authoring; no design,
> no build access yet). TestRail placement: subsections `"IV — <area>"` under the
> **Report Suite** main section; backend cases in **"IV — API"** per Standing Rule 4.
> LOCAL ONLY — nothing pushed to TestRail.

## Case inventory (77 cases / 13 sections)

| Section | Cases | Count |
| --- | --- | --- |
| IV — Access & Display | IV-NAV-01..06 | 6 |
| IV — Row Scope | IV-SCOPE-01..05 | 5 |
| IV — Valuation & Columns | IV-COL-01..05, IV-CALC-01..06 | 11 |
| IV — Totals Row | IV-TOT-01..05 | 5 |
| IV — As-of Date & Snapshots | IV-DATE-01..08 | 8 |
| IV — Filters & Part Search | IV-FLT-01..05 | 5 |
| IV — Location Filter | IV-LOC-01..05 | 5 |
| IV — Column Selection & Persistence | IV-PERS-01..04 | 4 |
| IV — Sorting | IV-SORT-01..04 | 4 |
| IV — Exports | IV-EXP-01..09 | 9 |
| IV — Visual & Accessibility | IV-VIS-01..07 | 7 |
| IV — Permissions | IV-PERM-01..02 | 2 |
| IV — API | IV-API-01..06 | 6 |
| **Total** | | **77** |

## Requirement → case map (every spec bullet)

### Story 1: Report Access and Display
| Requirement | Case(s) |
| --- | --- |
| Prereq: existing inventory-reports permission (no new permission) | IV-PERM-01 |
| S1-R1 nav under Parts, labeled "Inventory Value" | IV-NAV-01 |
| S1-R2 one row per in-stock part, valued as-of resolved date | IV-NAV-02 |
| S1-R3 first-visit defaults: current calendar month + active location | IV-NAV-03 |
| S1-R4 date range / location changeable via controls | IV-NAV-04 (also IV-DATE-06, IV-LOC-02) |
| S1-R5 server reload on date/location/Category/Vendor/search/sort change | IV-NAV-04 |
| S1-R6 data for selected location(s), default active | IV-NAV-02 (default IV-NAV-03) |
| S1-R7 loading state (standard indicator; rows replaced on return) | IV-NAV-04 |
| S1-R8 server pagination; any change → first page | IV-NAV-05 (first-page behavior also IV-FLT-02, IV-SORT-02) |
| S1-N1 no permission → not in navigation | IV-PERM-02 |
| S1-N2 no in-stock part → no-data message | IV-NAV-06 (also IV-LOC-05, IV-TOT-05) |

### Story 2: Row Scope
| Requirement | Case(s) |
| --- | --- |
| S2-R1 not a core charge AND qty > 0 | IV-SCOPE-01 |
| S2-R2 one row per qualifying part at a location | IV-SCOPE-01 (also IV-NAV-02) |
| S2-R3 multi-location part = one row per location, not merged | IV-SCOPE-02 (documented limitation — do not file) |
| S2-N1 core-charge part never shown | IV-SCOPE-03 |
| S2-N2 zero/negative qty never shown | IV-SCOPE-04 |
| Context note: no dead-stock exclusion | IV-SCOPE-05 |

### Story 3: Columns and Calculations
| Requirement | Case(s) |
| --- | --- |
| S3-R1 fixed column order | IV-COL-01 (order stability also IV-PERS-02) |
| S3-R2 alignment | IV-COL-01 |
| S3-R3 Qty on Hand 2dp, no currency | IV-COL-02 |
| S3-R4 Unit Cost currency | IV-COL-02 |
| S3-R5 Unit Sell fallback chain (fixed price → matrix markup → cost) | IV-CALC-01 (fixed), IV-CALC-02 (matrix), IV-CALC-03 (no-category = cost); display format IV-COL-02 |
| S3-R6 Total Sell = qty × Unit Sell | IV-CALC-04 |
| S3-R7 Total Cost = qty × Unit Cost | IV-CALC-04 |
| S3-R8 Margin = Total Sell − Total Cost (extended) | IV-CALC-05 |
| S3-R9 Margin % one decimal + "%" (e.g. "39.7%") | IV-CALC-06 |
| S3-R10 money format $ / 2dp / thousands / negative / $0.00 | IV-COL-02 |
| S3-R11 Total Cost pinned far right, bold, fixed on horizontal scroll | IV-COL-03 |
| S3-R12 first-visit visible columns | IV-COL-04 |
| S3-R13 Margin + Total Sell hidden by default, can be turned on | IV-COL-04 |
| S3-R14 Category / Vendor names | IV-COL-05 |
| S3-E1 no category → "—" | IV-COL-05 |
| S3-E2 no vendor → "—" | IV-COL-05 |
| S3-E3 Margin % "—" when Total Sell ≤ 0; negative shows signed | IV-CALC-06 |
| Context note: no-category/no-price part valued at cost ($0.00 / 0.0% margin) | IV-CALC-03 |

### Story 4: Totals Row
| Requirement | Case(s) |
| --- | --- |
| S4-R1 totals row, literal "Total" label in Part # cell | IV-TOT-01 |
| S4-R2 server-computed sums (Qty, Margin, Total Sell, Total Cost) over the FULL filtered set | IV-TOT-02 |
| S4-R3 totals Margin % recomputed from totals, not row-average; "—" rule | IV-TOT-03 |
| S4-R4 Unit Cost / Unit Sell cells blank | IV-TOT-01 |
| S4-R5 Description / Category / Vendor cells blank | IV-TOT-01 |
| S4-R6 totals Total Cost pinned far right, bold | IV-TOT-01 |
| S4-R7 same number formats as data rows | IV-TOT-01 |
| S4-R8 totals recompute server-side on Category/Vendor/search, page-independent | IV-TOT-04 |
| S4-N1 no qualifying parts → no totals row | IV-TOT-05 |

### Story 5: As-Of Date and History
| Requirement | Case(s) |
| --- | --- |
| S5-R1 standard presets + Custom; NO "All Time" | IV-DATE-01 (documented limitation — do not file) |
| S5-R2 valued as of the END of the selected range (+ as-of anchor context note) | IV-DATE-02 |
| S5-R3 window reaches today, today unrecorded → live stock | IV-DATE-03 |
| S5-R4 otherwise replay closest recorded day on or before range end | IV-DATE-04 (thinned-history bridging IV-API-06) |
| S5-R5 "As of" indicator names the day actually shown | IV-DATE-05 (also IV-API-06) |
| S5-R6 indicator hidden when displayed day matches | IV-DATE-05 |
| S5-R7 Custom start/end; end capped at today | IV-DATE-06 |
| S5-R8 changing range reloads | IV-DATE-06 (also IV-NAV-04) |
| S5-N1 no recorded day on/before → no-data + no totals | IV-DATE-07 (pruned-range variant IV-API-06) |
| S5-E1 forward-only history, no reconstruction before recording began | IV-DATE-08 (documented limitation — do not file; backend side IV-API-04) |

### Story 6: Category, Vendor, and Part Search Filters
| Requirement | Case(s) |
| --- | --- |
| S6-R1 Category filter labeled "Category", one or more | IV-FLT-01 |
| S6-R2 Vendor filter labeled "Vendor", one or more | IV-FLT-01 |
| S6-R3 category selection reloads to matching parts | IV-FLT-01 |
| S6-R4 vendor selection reloads to matching parts | IV-FLT-01 |
| S6-R5 filters + search server-side, first page, not page-local | IV-FLT-02 |
| S6-R6 totals recompute on filter/search change | IV-TOT-04 |
| S6-R7 empty selections/search = no narrowing | IV-FLT-03 |
| S6-R8 part search: page-local toolbar pattern; part # OR description; case-insensitive; server-side | IV-FLT-04 |
| S6-R9 Date + Location + Category + Vendor + search combine with AND | IV-FLT-05 |
| Context note: every filter server-side; only column selection client-side | IV-NAV-04, IV-PERS-01 |

### Story 7: Location Filter
| Requirement | Case(s) |
| --- | --- |
| S7-R1 "Location" multi-select, rightmost, accessible locations, All locations / Clear all | IV-LOC-01 |
| S7-R2 first-visit default = active location | IV-LOC-01 (also IV-NAV-03) |
| S7-R3 selection reloads scoped | IV-LOC-02 |
| S7-R4 never includes an inaccessible location | IV-LOC-03 |
| S7-R5 none-resolve → active-location fallback | IV-LOC-03 |
| S7-N1 single-location user still sees the filter | IV-LOC-04 |
| S7-N2 empty selected locations → no-data message | IV-LOC-05 |

### Story 8: Column Selection and Persistence
| Requirement | Case(s) |
| --- | --- |
| S8-R1 icon button, tooltip "Column Selection" | IV-PERS-01 |
| S8-R2 Total Cost always shown, cannot be turned off | IV-PERS-01 |
| S8-R3 Margin/Total Sell off by default, rest on | IV-COL-04 |
| S8-R4 fixed order, never reorders, Total Cost last | IV-PERS-02 |
| S8-R5 per-browser persistence (range, category, vendor, search, location, columns, sort) | IV-PERS-03 |
| S8-R6 defensive restore; stale category/vendor dropped | IV-PERS-04 |

### Story 9: Sorting
| Requirement | Case(s) |
| --- | --- |
| S9-R1 default sort Total Cost descending, server-applied | IV-SORT-01 |
| S9-R2 asc→desc toggle, no third state, server re-fetch → first page | IV-SORT-02 |
| S9-R3 numeric by value; text case-insensitive | IV-SORT-03 |
| S9-R4 totals row stays at the bottom | IV-SORT-04 |
| S9-R5 sort remembered per browser | IV-SORT-04 (also IV-PERS-03) |

### Story 10: Export to PDF and CSV
| Requirement | Case(s) |
| --- | --- |
| S10-R1 three-dot menu | IV-EXP-01 |
| S10-R2 "Download (PDF)" / "Download (CSV)" labels | IV-EXP-01 |
| S10-R3 shown columns, screen order, Total Cost last | IV-EXP-02 |
| S10-R4 honors date/category/vendor/location/search | IV-EXP-02 |
| S10-R5 applies current sort | IV-EXP-02 |
| S10-R6 totals row labeled "Totals", full-filtered-set totals | IV-EXP-02 |
| S10-R7 formats: money 2dp, Margin % 1dp, "—" undefined (+ CSV plain-number context note) | IV-EXP-03 |
| S10-R8 PDF header: "Inventory Value", org, period, as-of line / no-snapshot message | IV-EXP-04 |
| S10-R9 PDF logo when set; CSV never | IV-EXP-04 |
| S10-R10 filenames "inventory-value-report.pdf" / ".csv" | IV-EXP-05 |
| S10-R11 server-side generation over the full filtered set | IV-EXP-06 |
| S10-R12 export row cap → no file + verbatim message (cap value = OQ) | IV-EXP-07 |
| S10-R13 success notifications, verbatim per format | IV-EXP-08 |
| S10-R14 failure notifications, verbatim per format | IV-EXP-09 |

### Story 11: Nightly Snapshot Capture (→ "IV — API", Standing Rule 4)
| Requirement | Case(s) |
| --- | --- |
| S11-R1 nightly rows per location per in-stock non-core part; fields; to the cent; day's date | IV-API-01 |
| S11-R2 same scope (Story 2) + same valuation (Story 3) as live report | IV-API-02 |
| S11-R3 re-run replaces the date's rows; idempotent, self-healing | IV-API-03 |
| S11-R4 no-stock location has no rows (valid) | IV-API-01 |
| S11-R5 forward-only; re-run records current truth under the current date | IV-API-04 |
| S11-R6 retention: 0–13 months daily; older → monthly last-capture; pruning nightly; as-of serves thinned history; pruned range → nearest earlier retained or empty state | IV-API-05 (retention bands), IV-API-06 (as-of over thinned history) |
| S11-E1 up-to-a-month gaps handled by closest-on-or-before + "As of" indicator | IV-API-06 |
| Context note: recompute-from-live-truth, cross-tenant capture as reviewed exception; read paths tenant-scoped | IV-API-01 (note), IV-API-02 |

### Story 12: Visual Conformance and Accessibility
| Requirement | Case(s) |
| --- | --- |
| S12-R1 all-white table on soft blue-grey backdrop | IV-VIS-01 |
| S12-R2 action cluster: three-dot leftmost, then Column Selection | IV-VIS-02 |
| S12-R3 filter order: date range, part search, Category, Vendor, Location | IV-VIS-02 (Location-rightmost also IV-LOC-01) |
| S12-R4 Total Cost header bold + pinned | IV-COL-03 |
| S12-R5 totals row visible while scrolling | IV-VIS-03 |
| S12-R6 ellipsis truncation + hover; Part # never truncated | IV-VIS-04 |
| S12-R7 dark mode (background, toolbar, cells, "—" glyph) | IV-VIS-05 |
| S12-R8 sort state exposed to AT + visual indicator | IV-VIS-06 |
| S12-R9 icon-only controls carry accessible names | IV-VIS-07 |

### §2 Feature Overview / Out of scope / Known Limitations (v1)
| Item | Coverage |
| --- | --- |
| One row per in-stock part; row contents; pinned Total Cost; totals row; as-of; filters/search/sort/downloads (overview bullets) | Covered by the per-story cases above (Stories 1–10) |
| Scale & data model (server-paginated; server totals; ~50–60k parts) | IV-NAV-05, IV-TOT-02, IV-FLT-02, IV-SORT-02, IV-EXP-06 |
| Total cost / total sell context note | IV-CALC-04 |
| Relationship to nightly history (recorded day = live valuation) | IV-API-02, IV-DATE-04 |
| Out of scope: scheduled exports | EXCLUSION — out of scope per spec; no UI specified, absence not assertable without inventing labels |
| Out of scope: no backfill before recording began | IV-DATE-08, IV-API-04 |
| Out of scope: zero/negative qty + core charges not valued | IV-SCOPE-03, IV-SCOPE-04 |
| KL: no "All Time" option | IV-DATE-01 |
| KL: forward-capture history only | IV-DATE-08 |
| KL: one row per part per location | IV-SCOPE-02 |

### §3 Key Decisions
| Decision | Coverage |
| --- | --- |
| Values only real, sellable on-hand stock | IV-SCOPE-01..04 |
| Unit sell resolved like the parts list (fallback chain) | IV-CALC-01..03 |
| Margin is extended, Margin % share of Total Sell | IV-CALC-05, IV-CALC-06 |
| Total Cost pinned bold headline + default sort | IV-COL-03, IV-SORT-01 |
| As-of = latest recorded day on/before, live fallback for today | IV-DATE-03, IV-DATE-04 |
| Server-side at scale (paging/sort/filters/search/totals); only column selection client-side | IV-NAV-04/05, IV-FLT-02, IV-SORT-02, IV-TOT-02, IV-PERS-01 |
| Per-browser persistence of filters/columns/sort | IV-PERS-03 |

### §4 Terminology / §5 Assumptions
Encoded in the calculation and scope cases above (fractional quantity IV-COL-02; filtered-set
definition IV-TOT-02; matrix-per-organization + no-category-no-markup IV-CALC-02/03; nightly
recording to the cent IV-API-01). No separate cases needed — definitions, not behaviors.

### §7 User Feedback Summary (messages)
| Message | Case(s) |
| --- | --- |
| "Empty bays, endless possibilities. Get Going!" (no parts / no snapshot) | IV-NAV-06, IV-DATE-07, IV-LOC-05, IV-TOT-05 |
| "This report is too large to export. Narrow the date range or filters, then try again." | IV-EXP-07 |
| "Inventory Value report exported (PDF)" / "(CSV)" | IV-EXP-08 |
| "Failed to export inventory value report (pdf)" / "(csv)" | IV-EXP-09 |

## Documented-limitation cases (EXPECTED behavior — QA must NOT file)
- **IV-DATE-01** — no "All Time" date option (S5-R1, §2 KL).
- **IV-DATE-08** — forward-capture history only, no backfill (S5-E1, §2 KL).
- **IV-SCOPE-02** — one row per part per location, not merged (S2-R3, §2 KL).
- Related expected-behavior notes: **IV-CALC-03** (no-category part valued at cost, $0.00/0.0% margin is correct).

## Known-delta watch (spec ahead of build — record deviations at VIU)
- **IV-FLT-01 / IV-FLT-02** — Category/Vendor filters moved SERVER-side by the 2026-07-21 change (earlier draft was "on-screen only"); a client-side build is a deviation from the current spec.
- **IV-SORT-02** — server-side sorting is also the 2026-07-21 change.
- **IV-TOT-02 / IV-EXP-06** — server-computed full-set totals and server-generated exports likewise stem from the 2026-07-21 server-side data model.

## VIU-confirm register / open questions (unpinned — confirm live, never invent)
- Exact reports-navigation structure and Parts group label (IV-NAV-01).
- Loading-indicator appearance; page size + pagination control appearance (IV-NAV-04, IV-NAV-05).
- "As of" indicator's exact on-screen wording (IV-DATE-05); PDF as-of line + no-snapshot message wording (IV-EXP-04).
- Today-cap enforcement UI on the Custom picker (IV-DATE-06).
- Part-search placeholder/label text (IV-FLT-04).
- **Export row cap VALUE — OPEN QUESTION for the owner (Chris Ward): the spec's 10,000 is a proposed default, explicitly pending owner confirmation (S10-R12). IV-EXP-07 verifies the behavior + verbatim message only and does NOT assert a number.**
- On-screen totals label "Total" (S4-R1) vs export totals label "Totals" (S10-R6) — spec states both; VIU-confirm and flag to the owner if the build unifies them (IV-TOT-01, IV-EXP-02).
- WHICH permission is "the existing inventory-reports permission" (exact label) (IV-PERM-01); direct-URL behavior without permission (IV-PERM-02).
- Story 11 capture mechanics: trigger/inspection/re-run route; the 13-month retention band is owner-decided per the spec's bracketed note (IV-API-01..06 — NO endpoints invented).
- Icon-only controls' accessible-name strings (IV-VIS-07).
- Epic/Jira key NOT AVAILABLE — ask the user at VIU (do not invent).

## Exclusions (with reasons)
- **Scheduled/automatic exports** — §2 Out of scope; no UI specified, absence not assertable without inventing labels.
- **§8 Change Log entries** — process history, not testable requirements; the 2026-07-21 server-side model's behavioral outcomes are covered by the known-delta cases above.
- **Companion video / screenshots styling details** (Story 12 context note) — no design assets exist yet; finer styling deferred to design-reconciliation when assets arrive (per-project convention).
- **50–60k-row real-scale load/perf measurement** — performance benchmarking is not a manual functional case; the spec's user-observable scale behaviors (server pagination, full-set totals, first-page returns, export cap) ARE covered (IV-NAV-05, IV-TOT-02, IV-FLT-02, IV-SORT-02, IV-EXP-06/07).

## Completeness statement (Standing Rule 17)
- In scope: every requirement/negative/edge bullet of Stories 1–12 (S1-R1..S12-R9 incl. N/E items), §2 overview + Known Limitations, §3 Key Decisions, §4/§5 definitions, §7 messages = ALL mapped above.
- Processed: 77 cases authored, 13 sections; 0 requirement bullets unmapped.
- Excluded-with-reason: 4 items (listed above).

## ADDENDUM 2026-07-28 — video-promotion (user ruling: video overrides spec)
- **IV-LOC-04 C30577 FLIPPED** (video P33): single-location user now expects NO Location
  filter — S7-N1 is overridden.
- **IV-LOC-01 C30574** now also covers the All-locations per-row location identifier (video P10).
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
2026-07-29); WIP = identifier flipped to the VIN chain per Chris's answer A 2026-07-29 ("A is the correct
answer" — wip-identifier-answer-2026-07-29.md; WIP-COL-05 C30470 / WIP-FLT-03 C30500 / WIP-SORT-03
C30485 + WIP-EXP-07 C30516 caveat; the VIN → Unit # → plate chain is now the STANDARD for all
reports going forward, with the non-vehicle VIN-vs-serial terminology tester note); SBR/IV = the
all-reports items only. Spec changelog expected ~2026-07-30 — re-verify then (Chris's spec edit is
NOT hand-reviewed; confirm the WIP identifier text too).

## Addendum 2026-07-30 — tech-plan reconciliation (PUSHED)
Source: `tech-plan-2026-07-29/TECH-PLAN-DELTAS.md` + `ChangeList-2026-07-30.md` (engineering plan reconciliation; push executed 2026-07-30, user authorization "Push all three"). Every tech-plan-only expectation is labeled engineering-plan-sourced and VIU-confirm; spec-silent items flagged to Chris (Questions-for-Chris-dev.md Q3).
- **IV-EXP-07 C30593 title trimmed** — dropped "(exact cap value pending owner confirmation)"; the
  plan records 10,000 as the suite-wide cap locked by Chris 2026-07-21 (still VIU-confirm live).
  Pushed 2026-07-30.
- **NEW IV-DATE-09 = C38892** (SV-8678, S11-R2; plan B4.1 denormalized names): a recorded day keeps
  its category/vendor names after a rename or delete — history unchanged, live view shows the new
  name. Section "IV — As-of Date & Snapshots" (4368).
