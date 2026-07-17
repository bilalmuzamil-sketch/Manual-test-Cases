# Filters (v1) — Coverage Matrix

> Proves completeness: every in-scope spec requirement (`requirements.md`, Stories
> 1–12, every S#-R#/N#/E#) and every FINAL-set Work Orders design frame
> (`design-notes.md` §Z, designer ruling 2026-07-17) maps to the FLT- case(s)
> covering it. Cases are authored LOCAL-ONLY (not in TestRail). TestRail Case IDs
> are "pending push" until the user grants explicit permission (Standing Rule 6).
>
> Total cases authored: **79** across **14 sections** (13 functional + 1 API).
> API cases (5) all live under the API-titled section (Standing Rule 4).
>
> **SCOPE RULING (recorded 2026-07-17):** cases are authored for the WORK ORDERS
> PAGE feature only — the feature the spec's 12 stories cover (18 final WO design
> frames, desktop + mobile). The 9 Parts and 22 Reports screens in the final design
> set show the same filter-bar pattern but are covered by NO spec story — per
> Standing Rules 1/9 no cases were invented for them; a PO question to Branko asks
> whether they are part of this release (see §C Excluded).

## A. Spec requirement coverage (requirements.md — 81 requirement lines, all mapped)

### Story 1 — Filter Bar Layout & Visibility
| Spec ref | Requirement | FLT- case(s) |
|---|---|---|
| S1-R1 | Filter bar below the tab navigation by default | FLT-BAR-01 |
| S1-R2 | Five chips in order: Status, Customer, Lead Technician, Service Advisor, Asset on Site | FLT-BAR-02 |
| S1-R3 | Each chip shows name + chevron | FLT-BAR-02 |
| S1-R4 | Toolbar toggle collapses/expands the bar | FLT-COLL-01 |
| S1-R5 | Collapse hides bar; table reclaims space | FLT-COLL-01 |
| S1-R6 | Expand restores previous state incl. active filters | FLT-COLL-02 |
| S1-R7 | Collapsed/expanded state persists across navigation | FLT-COLL-03 (also FLT-PERS-01) |
| S1-N1 | Bar still shows remaining chips when a filter is hidden for the tab | FLT-BAR-03 |

### Story 2 — Status Filter
| Spec ref | Requirement | FLT- case(s) |
|---|---|---|
| S2-R1 | Dropdown with checkbox list of all 9 statuses | FLT-STAT-01 |
| S2-R2 | Multi-select; table shows WOs matching ANY selected status | FLT-STAT-02, FLT-STAT-03 |
| S2-R3 | Selected statuses shown as filled checkboxes | FLT-STAT-02, FLT-STAT-03 |
| S2-R4 | "Clear selection" at the bottom deselects all | FLT-STAT-01, FLT-STAT-04 |
| S2-R5 | Clicking outside closes the dropdown | FLT-STAT-05 |
| S2-R6 | Real-time filtering, no apply button (desktop) | FLT-STAT-02 (also FLT-CUST-05) |
| S2-N1 | Status chip not shown on Estimates tab | FLT-TAB-02 (spec-vs-design conflict flagged; PO Q4) |
| S2-N2 | Status chip not shown on Completed tab | FLT-TAB-03 |
| S2-N3 | No matching WOs → empty state | FLT-STAT-06 |

### Story 3 — Customer Filter
| Spec ref | Requirement | FLT- case(s) |
|---|---|---|
| S3-R1 | Dropdown with search input + scrollable customer list | FLT-CUST-01 |
| S3-R2 | Typing filters the list | FLT-CUST-02 |
| S3-R3 | Multi-select; selected customers as tags in the input area | FLT-CUST-03 |
| S3-R4 | Selected customers get a checkmark in the list | FLT-CUST-03 |
| S3-R5 | Remove an individual customer via × on its tag | FLT-CUST-04 |
| S3-R6 | Table shows only WOs of any selected customer | FLT-CUST-05 |
| S3-R7 | "Clear selection" removes all selected customers | FLT-CUST-06 |
| S3-R8 | Click outside closes; tags remain | FLT-CUST-07 |
| S3-N1 | Search with no match → "No results" message | FLT-CUST-08 |
| S3-N2 | No matching WOs → empty state | FLT-CUST-09 |
| S3-E1 | Customer with no open WOs still listed; empty result when filtered | FLT-CUST-09 |

### Story 4 — Lead Technician Filter
| Spec ref | Requirement | FLT- case(s) |
|---|---|---|
| S4-R1 | Dropdown with search input + technician list | FLT-TECH-01 |
| S4-R2 | Typing filters the list | FLT-TECH-02 |
| S4-R3 | Multi-select with filled checkboxes | FLT-TECH-03 |
| S4-R4 | Table shows only WOs where selected users are LEAD technician | FLT-TECH-03 |
| S4-R5 | "Clear selection" at the bottom | FLT-TECH-04 |
| S4-R6 | Click outside closes | FLT-TECH-05 |
| S4-N1 | No matching WOs → empty state | FLT-TECH-06 |
| S4-E1 | Inactive technician not shown in the list | FLT-TECH-07 |

### Story 5 — Service Advisor Filter
| Spec ref | Requirement | FLT- case(s) |
|---|---|---|
| S5-R1 | Dropdown with search input + advisor list | FLT-ADV-01 |
| S5-R2 | Typing filters the list | FLT-ADV-02 |
| S5-R3 | Multi-select with filled checkboxes | FLT-ADV-03 |
| S5-R4 | Table shows only WOs assigned to selected advisors | FLT-ADV-03 |
| S5-R5 | "Clear selection" at the bottom | FLT-ADV-04 |
| S5-R6 | Click outside closes | FLT-ADV-05 |
| S5-N1 | No matching WOs → empty state | FLT-ADV-06 |
| S5-E1 | Inactive advisor not shown in the list | FLT-ADV-07 |

### Story 6 — Asset on Site Filter
| Spec ref | Requirement | FLT- case(s) |
|---|---|---|
| S6-R1 | Dropdown with two options: Yes and No | FLT-ASSET-01 |
| S6-R2 | Selecting an option filters by on-site status | FLT-ASSET-02 |
| S6-R3 | Single-select (one option at a time) | FLT-ASSET-03 |
| S6-R4 | "Clear selection" removes the filter | FLT-ASSET-04 |
| S6-R5 | Click outside closes | FLT-ASSET-05 |
| S6-N1 | No matching WOs → empty state | FLT-ASSET-06 |
| §4 Key Decision | Dropdown NOT toggle | FLT-ASSET-01 |

### Story 7 — Active Filter Chip Appearance
| Spec ref | Requirement | FLT- case(s) |
|---|---|---|
| S7-R1 | Active chip = blue pill showing selected value(s) | FLT-CHIP-01 |
| S7-R2 | Multi-value chip: first value + truncation ("Status: Estimate, In progress, Approved…") | FLT-CHIP-02 |
| S7-R3 | "Clear filters" appears right of chips when ≥1 active | FLT-CHIP-03 |
| S7-R4 | Collapsed + active → toolbar toggle shows blue indicator | FLT-COLL-04 |
| S7-R5 | Filters keep applying while bar collapsed | FLT-COLL-05 |
| S7-N1 | No active filters → no "Clear filters" button | FLT-CHIP-03 |
| S7-N2 | No active filters + collapsed → no indicator | FLT-COLL-04 |

### Story 8 — Clearing Filters & Empty State
| Spec ref | Requirement | FLT- case(s) |
|---|---|---|
| S8-R1 | "Clear filters" clears ALL filters at once | FLT-CHIP-04 (mobile: FLT-MOB-08) |
| S8-R2 | Per-dropdown "Clear selection" clears only that filter | FLT-CHIP-05 (also FLT-STAT-04, FLT-CUST-06, FLT-TECH-04, FLT-ADV-04, FLT-ASSET-04) |
| S8-R3 | Combined filters, no match → empty state message | FLT-EMPTY-01 (also FLT-STAT-06, FLT-CUST-09, FLT-TECH-06, FLT-ADV-06, FLT-ASSET-06, FLT-API-05) |
| S8-R4 | Empty state includes clear-filters prompt | FLT-EMPTY-02 |
| S8-N1 | No active filters → "Clear filters" not visible/clickable | FLT-CHIP-03 |
| (implied) | Across-filter combination narrows (AND across, ANY within) | FLT-CHIP-06, FLT-API-02 |

### Story 9 — Tab Behaviour
| Spec ref | Requirement | FLT- case(s) |
|---|---|---|
| S9-R1 | All tab: all 5 filters shown and active | FLT-TAB-01 |
| S9-R2 | Estimates tab: Status hidden; 4 filters on top of pre-filter | FLT-TAB-02 |
| S9-R3 | Completed tab: Status hidden; 4 filters on top of pre-filter | FLT-TAB-03 |
| S9-R4 | My Work Orders tab: 5 filters on top of user scope | FLT-TAB-04 |
| S9-R5 | Selections maintained across tabs; incompatible ones retained in memory | FLT-TAB-05 |
| S9-N1 | Status selection not carried visually to Estimates/Completed but not lost | FLT-TAB-05 |

### Story 10 — Filter Persistence
| Spec ref | Requirement | FLT- case(s) |
|---|---|---|
| S10-R1 | Navigate away + back → selections + bar state restored exactly | FLT-PERS-01 |
| S10-R2 | Persist for the browser session | FLT-PERS-02 (OQ-5 tension flagged in-case; PO Q2) |
| S10-R3 | Saved per user | FLT-PERS-03 |
| S10-N1 | Deleted value silently ignored | FLT-PERS-04 (backend: FLT-API-03) |

### Story 11 — URL State & Shareable Links
| Spec ref | Requirement | FLT- case(s) |
|---|---|---|
| S11-R1 | URL updates to reflect active filter state | FLT-URL-01 |
| S11-R2 | Opening a filter URL pre-applies the filters | FLT-URL-02 |
| S11-R3 | Deleted value in URL ignored | FLT-URL-03 (backend: FLT-API-03) |
| S11-N1 | Malformed URL state → unfiltered page, no error | FLT-URL-04 (backend: FLT-API-04) |

### Story 12 — Mobile Filter Bar
| Spec ref | Requirement | FLT- case(s) |
|---|---|---|
| S12-R1 | Horizontally scrollable chip row below tabs | FLT-MOB-01 |
| S12-R2 | Chips behave like desktop (open, active state, Clear filters) | FLT-MOB-03, FLT-MOB-05, FLT-MOB-06, FLT-MOB-07, FLT-MOB-08 |
| S12-R3 | Dropdowns open as bottom sheets | FLT-MOB-02, FLT-MOB-03, FLT-MOB-04, FLT-MOB-07 |
| S12-R4 | No collapse toggle on mobile; bar always visible | FLT-MOB-09 |
| S12-N1 | Same empty state as desktop | FLT-MOB-10 |

### Feature Overview / Key Decisions (cross-cutting)
| Spec ref | Requirement | FLT- case(s) |
|---|---|---|
| §2 / §4 | No selection limit on multi-selects | FLT-STAT-03, FLT-CUST-03 |
| §2 | Multi-criteria in one interaction (combined filters) | FLT-CHIP-06, FLT-API-02 |
| §2 | Desktop and mobile supported | FLT-MOB-01..10 |
| Backend behavior (Rule 4 section) | List request carries filters / combined / invalid / empty | FLT-API-01..05 |

## B. Final-set Work Orders design frame coverage (18 frames, design-notes §Z #1–#18)

| §Z # | Node | Frame | FLT- case(s) |
|---|---|---|---|
| 1 | 11854:24657 | WO filters default (desktop) | FLT-BAR-01, FLT-BAR-02, FLT-CHIP-03, FLT-TAB-01 |
| 2 | 11854:25927 | WO filters default, bar collapsed | FLT-COLL-01, FLT-COLL-03, FLT-COLL-04 |
| 3 | 11854:26246 | WO filters selected | FLT-CHIP-01, FLT-CHIP-02, FLT-CHIP-03, FLT-CHIP-04, FLT-STAT-03, FLT-PERS-01 |
| 4 | 11854:26564 | WO filters selected, bar collapsed | FLT-COLL-02, FLT-COLL-04, FLT-COLL-05 |
| 5 | 11972:32318 | Estimates tab (pre-applied Status chip, disabled style) | FLT-BAR-03, FLT-TAB-02 (+ FLT-TAB-03 mirror; spec-vs-design conflict → PO Q4) |
| 6 | 11857:31046 | Mobile WO list | FLT-MOB-01, FLT-MOB-09 |
| 7 | 11884:20807 | Mobile WO list (chip scroll arrow) | FLT-MOB-01 |
| 8 | 11884:13689 | Mobile All Filters sheet | FLT-MOB-02 |
| 9 | 11884:13719 | Mobile sheet, Status open | FLT-MOB-03 |
| 10 | 11884:16160 | Mobile sheet, Status selected "All Filters (1)" | FLT-MOB-03 |
| 11 | 11884:21065 | Mobile single-filter Status sheet ("Apply filter") | FLT-MOB-04 |
| 12 | 11884:15582 | Mobile sheet, Asset on site (Yes/No) | FLT-MOB-07 |
| 13 | 11884:13940 | Mobile sheet, Customer open | FLT-MOB-05 |
| 14 | 11884:21271 | Mobile single-filter Customer sheet ("Apply filter") | FLT-MOB-04, FLT-MOB-05 |
| 15 | 11884:16695 | Mobile sheet "All Filters (1)", Customer open | FLT-MOB-05 |
| 16 | 11884:16383 | Mobile sheet "All Filters (2)", Customer tokens | FLT-MOB-05 |
| 17 | 11884:14296 | Mobile sheet, Lead Technician open (design typo "Tehnician") | FLT-MOB-06 |
| 18 | 11884:14811 | Mobile sheet, Service Advisor open | FLT-MOB-06 |

Superseded-but-retained API renders of the desktop dropdown popovers
(11854:24280, 11854:24194, 11854:24452, 11854:24553, 11842:14236, 11854:19595,
11880:12460) are used as label evidence for the desktop dropdown cases
(FLT-STAT-01, FLT-TECH-01, FLT-ADV-01, FLT-CUST-01/03, FLT-ASSET-01) — the option
lists are identical in the final mobile sheets; the build's real desktop dropdowns
get captured live at VIU (design-notes §D authoring note).

## C. Excluded — explicitly NOT covered by cases (with reasons; Standing Rule 17)

| Item | Count | Reason |
|---|---|---|
| Parts screens in the final ZIP set (Inventory, Part Sales, Catalog, Returns, Credits, Purchase Orders, Vendor Invoices, Vendors list, Part-Type dropdown — design-notes §B.5, §Z #19–27) | 9 | NO spec story covers Parts filtering — the spec's 12 stories are all Work Orders page. Authoring cases would be invention (Standing Rules 1/9). **PO question 1 to Branko** asks whether Parts/Reports filtering is part of this release and where its write-up is. Cases will be authored when a spec arrives. |
| Reports screens in the final ZIP set (Timesheet Activities, Payroll Timesheet, Sales, Technician Efficiency ×2, Advisor Analysis, Shop Efficiency, Work In Progress, Sales Follow Up, Sales Tax ×2, A/R Aging ×3, A/P Aging ×2, A/P Unpaid Invoices, Notes, Reminders, IBS Batch Transactions, QB Unexported ×2 — design-notes §B.6, §Z #28–49) | 22 | Same: NO spec story covers Reports filtering. Same PO question 1. |
| Superseded design frames (WO-14.4 exploration section, Components sets, page-level frames, desktop dropdown popovers as separate frames, label strips, QB Journal-Entries tab) | — | Ruled OUT of the final design set by the designer 2026-07-17 (design-notes §A/§D) — not part of the deliverable design, not chased. |
| "Sorting (Work In Progress)" Figma section (4 Step frames) | 4 | A separate work-in-progress feature (column sorting), explicitly WIP-titled, not in the final ZIP set, and not in the Filters spec — out of scope for this suite; will be its own project/spec if it ships. |
| Permissions/role-based cases | — | The spec has NO permissions section (OQ-4); only prerequisite is "access to the Work Orders page". No role matrix exists to author against — flagged, not invented. |
| Feature-flag / rollout cases | — | Spec has no flag/rollout section (OQ-7 env/flag unknown). Import is flag-free per user rule anyway. |

## D. Open items affecting cases (tracked in requirements.md OQs + PO questions)

- **PO Q1 (scope):** Parts + Reports filter screens in the final design vs a WO-only spec (→ §C).
- **PO Q2 (persistence, OQ-5):** session-only vs remembered-across-sessions — FLT-PERS-02 authored to the common ground.
- **PO Q3 (spelling):** design "Lead Tehnician" typo — cases use "Lead Technician"; build must ship the correct spelling (FLT-BAR-02, FLT-TECH-01, FLT-MOB-02, FLT-MOB-06 notes).
- **PO Q4 (Estimates/Completed tab Status chip):** spec says hidden, design shows a disabled pre-filled "Status: Estimate" chip — FLT-TAB-02/03 + FLT-BAR-03 authored to the spec's intent, conflict flagged.
- **VIU-confirm inventory:** 24 cases carry explicit VIU-confirm notes (unconfirmable-from-design labels: empty-state texts, "No results" message, chip truncation composition, URL/API parameter shapes, on-site data source, scroll-arrow affordance, mobile Clear-filters placement, auto-focus, indicator styling, capitalisation of "In progress"/"Asset on site").
