# WIP (Work In Progress) Report — Coverage Matrix

> **CONSOLIDATION UPDATE 2026-07-28 (user-authorized, pushed to TestRail):** the suite was
> consolidated to **76 active WIP cases**. Every case ID below still resolves:
> a merged-away ID's coverage now lives in its SURVIVOR (mapping below); cut cases' assertions
> were either duplicates of a survivor or dropped by the usefulness/sense audit. Detail:
> `consolidation-backup-2026-07-28/MANIFEST.md` + `quality-audit-2026-07-28/MERGE-PLAN.md`.
>
> Merged-away → survivor: WIP-TAB-04 → WIP-TAB-01; WIP-SCOPE-06 → WIP-SCOPE-05; WIP-PLACE-02 → WIP-PLACE-01; WIP-PLACE-04 → WIP-PLACE-03; WIP-SUM-06 → WIP-FLT-08; WIP-TOT-03 → WIP-FLT-08.
> Cut (retired, body kept locally): WIP-TOT-04 (duplicate of merged empty-state case).


> **Report Suite project — per-report coverage doc (authored 2026-07-22, spec revision `_1`,
> latest change-log entry 2026-07-21).**
> Source spec: `build/report-suite/specs/wip-work-in-progress.md` (verbatim-structured).
> Case source: `build/report-suite/cases/cases-wip-A..E-*.json` — **83 cases / 14 sections**,
> internal IDs `WIP-<AREA>-NN`, all `viu_status: VIU-Pending` (spec-only authoring; no design,
> no build access yet). TestRail placement: subsections `"WIP — <area>"` under the
> **Report Suite** main section; backend cases in **"WIP — API"** per Standing Rule 4.
> LOCAL ONLY — nothing pushed to TestRail.

## Case inventory (83 cases / 14 sections)

| Section | Cases | Count |
| --- | --- | --- |
| WIP — Tabs | WIP-TAB-01..05 | 5 |
| WIP — Scope & Loading | WIP-SCOPE-01..06 | 6 |
| WIP — Tab Placement | WIP-PLACE-01..04 | 4 |
| WIP — Columns & Rows | WIP-COL-01..08 | 8 |
| WIP — Earned & Remaining | WIP-CALC-01..09 | 9 |
| WIP — Sorting | WIP-SORT-01..04 | 4 |
| WIP — Summary Strip | WIP-SUM-01..07 | 7 |
| WIP — Totals Row | WIP-TOT-01..04 | 4 |
| WIP — Filters | WIP-FLT-01..08 | 8 |
| WIP — Column Selection & Persistence | WIP-PERS-01..04 | 4 |
| WIP — Exports | WIP-EXP-01..09 | 9 |
| WIP — Visual & Accessibility | WIP-VIS-01..07 | 7 |
| WIP — Permissions | WIP-PERM-01..02 | 2 |
| WIP — API | WIP-API-01..06 | 6 |
| **Total** | | **83** |

## Requirement → case map (every spec bullet)

### Story 1: Report Access and Tabs
| Requirement | Case(s) |
| --- | --- |
| Prereq: permission grants access to WIP reports (+ context note: one existing reporting permission covers report and downloads) | WIP-PERM-01 |
| S1-R1 nav under Performance, labeled "Work In Progress" | WIP-TAB-01 |
| S1-R2 four tabs, labeled in order | WIP-TAB-02 |
| S1-R3 "Approved - partially completed" default | WIP-TAB-02 |
| S1-R4 tab label counts in parentheses | WIP-TAB-03 |
| S1-R5 page title "Work In Progress - Report \| ShopView" | WIP-TAB-04 |
| S1-N1 no permission → not in navigation | WIP-PERM-02 |

### Story 2: Work-Order Scope, Loading, and Empty State
| Requirement | Case(s) |
| --- | --- |
| S2-R1 service + open status + selected location | WIP-SCOPE-01 |
| S2-R2 Invoiced/Paid/Declined never appear anywhere | WIP-SCOPE-02 |
| S2-R3 part-sale WOs never appear | WIP-SCOPE-02 |
| S2-R4 exactly once, exactly one tab; nothing-approved shows $0.00 | WIP-SCOPE-03 (also WIP-CALC-09) |
| S2-R5 loading indicator; rows replaced only when data returns | WIP-SCOPE-04 |
| S2-R6 reload on date range / location change | WIP-SCOPE-04 (also WIP-FLT-05/06) |
| S2-N1 nothing qualifies → no-data message each tab, no Totals row | WIP-SCOPE-05 |
| S2-N2 single empty tab; "(0)" count | WIP-SCOPE-06 (count also WIP-TAB-03) |

### Story 3: Tab Placement (Sectioning)
| Requirement | Case(s) |
| --- | --- |
| S3-R1 Estimate → Estimates | WIP-PLACE-01 |
| S3-R2 Complete → Completed | WIP-PLACE-01 |
| S3-R3 In Progress / Review → Approved - partially completed | WIP-PLACE-02 |
| S3-R4 Approved: started (clocked time OR received part) → partially completed; otherwise → not started (+ context note) | WIP-PLACE-03 (started), WIP-PLACE-04 (not started) |

### Story 4: Columns and Calculations
| Requirement | Case(s) |
| --- | --- |
| S4-R1 fixed column order | WIP-COL-01 (order stability also WIP-PERS-02) |
| S4-R2 first-visit visible columns | WIP-COL-02 |
| S4-R3 other columns off by default, in selector | WIP-COL-02 |
| S4-R4 column alignment | WIP-COL-01 |
| S4-R5 WO # link, same tab + back (+ context note: previously new tab) | WIP-COL-03 |
| S4-R6 status badge, label + standard colors | WIP-COL-04 |
| S4-R7 Asset two-line cell | WIP-COL-05 |
| S4-R8 "(no unit #)" / "— no VIN —" placeholders | WIP-COL-05 |
| S4-R9 Asset sorts by unit number | WIP-SORT-03 |
| S4-R10 VIN column separate, sortable, off by default | WIP-COL-05 |
| S4-R11 Customer company name / blank | WIP-COL-06 |
| S4-R12 Days Open floored, "X days", "0 days"/"1 days" not pluralized | WIP-COL-07 (documented limitation — do not file) |
| S4-R13 Last Activity Today / "Xd ago" / "—" | WIP-COL-08 |
| S4-R14 money format $ / 2dp / thousands / negative / $0.00 | WIP-CALC-01 |
| S4-R15 Labor Earned (capped clocked share per line) | WIP-CALC-02 |
| S4-R16 Labor Remaining | WIP-CALC-03 |
| S4-R17 Parts Earned | WIP-CALC-04 |
| S4-R18 Parts Remaining (outstanding qty × sell incl. core charge) | WIP-CALC-05 |
| S4-R19 Earned = Labor Earned + Parts Earned | WIP-CALC-06 |
| S4-R20 Remaining = Labor Remaining + Parts Remaining | WIP-CALC-06 |
| S4-R21 Total = Earned + Remaining, NOT the stored grand total | WIP-CALC-06 |
| S4-R22 Total pinned far right, bold, fixed on sideways scroll | WIP-VIS-03 |
| S4-R23 Inv. Hrs signed one-decimal; "0.0" unsigned | WIP-CALC-08 |
| S4-R24 Inv. Hrs colors green/red/default | WIP-CALC-08 |
| S4-R25 initial sort Days Open descending | WIP-SORT-01 |
| S4-R26 header click asc→desc, no third state, one column | WIP-SORT-02 |
| S4-R27 per-type sort semantics | WIP-SORT-03 |
| S4-R28 sort within active tab; Totals row stays bottom | WIP-SORT-04 |
| S4-E1 no-approved-work estimate all $0.00 | WIP-CALC-09 |
| S4-E2 overrun negative red / under positive green | WIP-CALC-08 |
| Context note: unapproved lines contribute nothing (§2/§4) | WIP-CALC-07 |
| Context note: Days Open live on screen vs frozen in download | WIP-EXP-05 |

### Story 5: Summary Strip
| Requirement | Case(s) |
| --- | --- |
| S5-R1 seven figures, fixed order | WIP-SUM-01 |
| S5-R2 Total Earned hero (larger, colored underline) = Started — Earned + Ready to Invoice | WIP-SUM-02 |
| S5-R3 Total Remaining = Not Started + Started — Remaining | WIP-SUM-03 |
| S5-R4 Not Started = approved value of not-started tab | WIP-SUM-04 |
| S5-R5 Started — Earned = partially-completed tab's Earned | WIP-SUM-04 |
| S5-R6 Started — Remaining = partially-completed tab's Remaining | WIP-SUM-04 |
| S5-R7 Ready to Invoice = Completed tab's Earned | WIP-SUM-04 |
| S5-R8 Estimates = Estimates tab's quoted value, muted | WIP-SUM-05 |
| S5-R9 Estimates excluded from Total Earned/Remaining | WIP-SUM-05 |
| S5-R10 currency format | WIP-SUM-01 |
| S5-R11 recompute on filter, no reload | WIP-SUM-06 |
| S5-R12 seven VERBATIM tooltips (hover/focus/tap) | WIP-SUM-07 (AT exposure WIP-VIS-06) |

### Story 6: Per-Tab Totals Row
| Requirement | Case(s) |
| --- | --- |
| S6-R1 Totals row pinned bottom, labeled "Totals" | WIP-TOT-01 |
| S6-R2 sums each visible money column | WIP-TOT-02 |
| S6-R3 Inv. Hrs sum, signed format + coloring | WIP-TOT-02 |
| S6-R4 Total cell pinned far right, bold | WIP-TOT-01 |
| S6-R5 same number formats as data rows | WIP-TOT-01 |
| S6-R6 recompute on advisor/customer/asset change | WIP-TOT-03 |
| S6-N1 empty tab → no Totals row | WIP-TOT-04 (also WIP-SCOPE-05) |

### Story 7: Filters
| Requirement | Case(s) |
| --- | --- |
| S7-R1 Advisor multi-select, on-screen only | WIP-FLT-01 |
| S7-R2 Customer type-ahead multi-select, on-screen only | WIP-FLT-02 |
| S7-R3 "All customers" + single "Clear" (shown once selected) | WIP-FLT-02 |
| S7-R4 Asset type-ahead; option shows unit + VIN; matches EITHER | WIP-FLT-03 |
| S7-R5 "All assets" + single "Clear" | WIP-FLT-03 |
| S7-R6 presets incl. Custom; default "This Week"; no "All Time" | WIP-FLT-04 (known-delta watch noted) |
| S7-R7 created-date basis; change reloads | WIP-FLT-05 |
| S7-R8 Custom capped at 366 days | WIP-FLT-05 |
| S7-R9 Location filter rightmost, All locations / Clear all, default active location | WIP-FLT-06 |
| S7-R10 selection reloads scoped | WIP-FLT-06 |
| S7-R11 accessible-only; empty resolve → active-location fallback | WIP-FLT-07 |
| S7-R12 advisor+customer+asset AND; feed strip + Totals rows | WIP-FLT-08 (also WIP-SUM-06, WIP-TOT-03) |
| S7-N1 combination leaves none → no-data + no Totals row | WIP-FLT-08 |

### Story 8: Column Selection and Persistence
| Requirement | Case(s) |
| --- | --- |
| S8-R1 icon button, tooltip "Column Selection" | WIP-PERS-01 |
| S8-R2 Total always shown, not offered | WIP-PERS-01 |
| S8-R3 first-visit columns per S4-R2 | WIP-COL-02 |
| S8-R4 others available, off by default | WIP-COL-02 |
| S8-R5 fixed order, never reorders, Total last | WIP-PERS-02 |
| S8-R6 selection applies to all four tabs | WIP-PERS-02 |
| S8-R7 per-browser persistence (range, filters, location, columns, active tab) | WIP-PERS-03 |
| S8-R8 defensive restore fallback | WIP-PERS-04 (location aspect also WIP-FLT-07) |

### Story 9: Export to PDF and CSV
| Requirement | Case(s) |
| --- | --- |
| S9-R1 three-dot menu, "Download (PDF)" / "Download (CSV)" | WIP-EXP-01 |
| S9-R2 shown columns only, screen order, Total last | WIP-EXP-02 |
| S9-R3 honors date/location; visible jobs only | WIP-EXP-02 |
| S9-R4 Totals row included, matching screen | WIP-EXP-02 |
| S9-R5 money / Inv. Hrs formats as on screen | WIP-EXP-03 |
| S9-R6 CSV comma values double-quoted | WIP-EXP-03 |
| S9-R7 Inv. Hrs colors screen+PDF only; CSV monochrome | WIP-EXP-04 |
| S9-R8 Days Open frozen at generation | WIP-EXP-05 |
| S9-R9 filenames "wip-2-report.pdf" / "wip-2-report.csv" | WIP-EXP-06 (documented behavior — do not file) |
| S9-R10 PDF logo when set; CSV never | WIP-EXP-08 |
| S9-E1 export headers "Unit"/"Branch" vs on-screen "Asset"/"Location" | WIP-EXP-07 (documented limitation — do not file) |
| S9-R11 success caption "Data exported successfully." | WIP-EXP-09 |
| S9-R12 "Empty export" / "Export didn't yield any results" | WIP-EXP-09 |
| S9-R13 failure error message | WIP-EXP-09 |

### Story 10: Visual Conformance and Accessibility
| Requirement | Case(s) |
| --- | --- |
| S10-R1 all-white table, no alternating shading | WIP-VIS-01 |
| S10-R2 summary strip band (rules), above tabs, not cards | WIP-VIS-02 |
| S10-R3 Total header bold + pinned | WIP-VIS-03 |
| S10-R4 Totals row visible while scrolling | WIP-VIS-04 |
| S10-R5 fills height; only tab body scrolls; no second scrollbar | WIP-VIS-04 |
| S10-R6 WO # link keyboard focus + activation | WIP-VIS-05 |
| S10-R7 info icons keyboard-reachable, AT-exposed | WIP-VIS-06 |
| S10-R8 badge meaning by text, not color alone | WIP-COL-04 |
| S10-R9 dark mode legibility | WIP-VIS-07 |

### Story 11: Nightly WIP Snapshot Capture (→ "WIP — API", Standing Rule 4)
| Requirement | Case(s) |
| --- | --- |
| S11-R1 once daily, one row per open WO per calendar date | WIP-API-01 |
| S11-R2 captured fields (WO, status, Earned, Remaining, location, org, date) | WIP-API-02 |
| S11-R3 identical computation to on-screen report | WIP-API-03 |
| S11-R4 same service/open-status scope; every location; no user filter | WIP-API-04 |
| S11-R5 stored to the cent | WIP-API-05 |
| S11-R6 nothing-approved captured with $0.00/$0.00, not skipped | WIP-API-06 |
| S11-R7 no screen reads the snapshot; no Trend tab | WIP-TAB-05 (UI-observable side) |

### §2 Feature Overview / Out of scope / Known Limitations (v1)
| Item | Coverage |
| --- | --- |
| One row per open WO; four tabs; row contents; strip; per-tab table + Totals; columns/filters/downloads (overview bullets) | Covered by the per-story cases above (Stories 1–9) |
| Earned/Remaining context note (definition) | WIP-CALC-02..06 |
| Reads live, stores nothing, never changes a WO | Implicit in all cases; no dedicated case (not independently observable manually beyond the approved-lines checks WIP-CALC-07) — EXCLUSION, reason: unobservable-as-stated |
| Money only from approved lines | WIP-CALC-07 |
| Out of scope: trend view | WIP-TAB-05 (documented — do not file) |
| Out of scope: fees/discounts/tax not shown | WIP-CALC-06 (Total excludes them) |
| Out of scope: scheduled exports | EXCLUSION — out of scope per spec; no case (nothing to verify beyond absence; absence of an unspecified control is not testable without inventing labels) |
| KL: no trend view | WIP-TAB-05 |
| KL: "1 days" grammar | WIP-COL-07 |
| KL: Unit/Branch export headers | WIP-EXP-07 |

### §3 Key Decisions
| Decision | Coverage |
| --- | --- |
| Total = Earned + Remaining, not grand total | WIP-CALC-06 |
| Default "This Week"; no All Time | WIP-FLT-04 |
| Every open job listed incl. nothing-approved | WIP-SCOPE-03, WIP-CALC-09 |
| Four tabs replace a status filter (no on-screen status filter) | WIP-PLACE-01..04 (tab derivation); the status-filter ABSENCE is asserted in WIP-TAB-02 (expected 3) |
| Strip recomputes from visible jobs | WIP-SUM-06 |
| Advisor/customer/asset on-screen; date/location reload | WIP-FLT-01..06 |
| Per-browser memory of setup | WIP-PERS-03 |
| Est. hours as measuring stick (Inv. Hrs) | WIP-CALC-08 |
| Nightly snapshot in scope | WIP-API-01..06 |

### §4 Terminology / §5 Assumptions
Encoded inside the relevant cases: Earned/Remaining/Total definitions (WIP-CALC-02..06),
approved-line definition (WIP-CALC-07), Days Open (WIP-COL-07), Inv. Hrs (WIP-CALC-08),
Asset unit+VIN (WIP-COL-05), open-WO statuses incl. Invoiced/Paid/Declined exclusion
(WIP-SCOPE-01/02), Snapshot (WIP-API-01..06), created-date anchor (WIP-FLT-05,
WIP-COL-07), fees/discounts/tax not shown (WIP-CALC-06). Definitions and assumptions,
not standalone behaviors — no separate cases needed.

### §7 User Feedback Summary (messages)
| Message | Case(s) |
| --- | --- |
| "Empty bays, endless possibilities. Get Going!" | WIP-SCOPE-05, WIP-SCOPE-06, WIP-FLT-08 |
| "Data exported successfully." | WIP-EXP-09 |
| "Empty export" / "Export didn't yield any results" | WIP-EXP-09 |
| "An error occurred while exporting the report. Please try again." | WIP-EXP-09 |

## Documented-limitation cases (EXPECTED behavior — QA must NOT file)
- **WIP-COL-07** — "0 days" / "1 days" not pluralized (S4-R12, §2 KL).
- **WIP-EXP-07** — export headers "Unit"/"Branch" for Asset/Location (S9-E1, §2 KL).
- **WIP-EXP-06** — filenames "wip-2-report.pdf/.csv" (S9-R9).
- **WIP-TAB-05** — no Trend view/tab in this version (§2 Out of scope/KL, S11-R7).
- Related expected-difference notes: **WIP-CALC-06** (Total ≠ grand total), **WIP-EXP-05** (download Days Open may be one higher than screen).

## Known-delta watch (spec ahead of build — record deviations at VIU)
- **WIP-COL-03** — WO # drill-through changed to SAME-tab (2026-07-21 change log); older build may open a new tab.
- **WIP-FLT-04** — "All Time" removed / default "This Week" (2026-07-21 change log); older build may still offer All Time.

## VIU-confirm register (unpinned by the spec — confirm live, never invent)
- Exact reports-navigation structure and Performance group label (WIP-TAB-01).
- Appearance of the "standard reports loading indicator" (WIP-SCOPE-04).
- Standard status badge colors (WIP-COL-04).
- On-screen rendering of the em dash in "Started — Earned"/"Started — Remaining" (WIP-SUM-01).
- Total Earned underline color (WIP-SUM-02).
- 366-day Custom-cap enforcement UI (WIP-FLT-05).
- Whether the sort choice is shared across tabs or per-tab (WIP-SORT-04).
- WHICH existing reporting permission gates the report — spec does not name it (WIP-PERM-01); behavior on direct-URL access without permission (WIP-PERM-02).
- Story 11 capture mechanics: schedule time, storage shape, inspection/re-run route (WIP-API-01..06 — spec defines job behavior only; NO endpoints invented).
- Epic/Jira key NOT AVAILABLE — ask the user at VIU (do not invent).

## Exclusions (with reasons)
- **Scheduled/automatic exports** — §2 Out of scope; no UI is specified, so absence cannot be asserted without inventing labels.
- **"Stores nothing of its own / never changes a work order"** (§2) — not independently observable in manual UI testing; the observable half (approved-lines-only money) is covered by WIP-CALC-07.
- **Trend view behavior** — out of scope for v1; only its ABSENCE is covered (WIP-TAB-05).
- **§8 Change Log entries** — process history, not testable requirements; their behavioral outcomes are covered by the current-requirement cases (same-tab link WIP-COL-03, This-Week default WIP-FLT-04, Story 11 WIP-API-01..06).

## Completeness statement (Standing Rule 17)
- In scope: every requirement/negative/edge bullet of Stories 1–11 (S1-R1..S11-R7 incl. N/E items), §2 overview + Known Limitations, §3 Key Decisions, §4/§5 definitions, §7 messages = ALL mapped above.
- Adversarial review 2026-07-22 (TU/WIP/IV auditor): independent bullet walk confirmed 0 unmapped; one coverage misstatement fixed (the §3 "no on-screen status filter" decision was cited to WIP-FLT-04 where nothing asserted it — now asserted in WIP-TAB-02 expected 3) + one WIP-SORT-03 wording clarification.
- Processed: 83 cases authored, 14 sections; 0 requirement bullets unmapped.
- Excluded-with-reason: 4 items (listed above).

## ADDENDUM 2026-07-28 — video-promotion + latest-info (user ruling)
- **WIP-COL-05 C30470 / WIP-FLT-03 C30500 / WIP-SORT-03 C30485** now cover the SERIAL-NUMBER
  asset identifier (video P24; S4-R7/S4-R9/S7-R4/S7-R5 overridden); **WIP-EXP-07 C30516** got a
  serial-number data caveat on the Unit/Branch header limitation.
- **WIP-FLT-03** note updated to the native+toggle asset-dropdown latest info (video P12).
- WIP needs NO per-row location-label edit (P10) — its Location column already exists (S4-R1).
- Detail: reconciliation-2026-07-28/video-promotion-edit-log-2026-07-28.md; watch:
  ../SPEC-WATCH-2026-07-28.md (deadline 2026-08-04).
