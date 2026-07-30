# Reverse coverage diff - foreign assertions vs OUR suite

**Generated:** 2026-07-30T20:20:14Z · **READ-ONLY** (get_* only, zero writes) · **OURS = user id 3**

| Group | Name | Live total | Ours | Foreign | Foreign authors |
|---|---|---|---|---|---|
| 4281 | Reports Suite | 479 | 474 | 5 | {'Vladimir Tomovic': 5} |
| 4110 | Filters - (VIU Pending) | 110 | 110 | 0 | - |
| 4254 | Schedule - 2026 (VIU Pending) | 165 | 165 | 0 | - |

## C38923 - CONTRADICTS-OURS

*SBR Summary and Expanded CSV exports carry the Location column at its designated slot*  
Section: Reports Suite > Sales By Representative Report > SBR — Exports  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/38923)

**CLOSED-LIST COLLISIONS (read these first - Rule 42 shape):**

| Our case | Our title | Shared subject | Their term(s) absent from our closed list | Our refs |
|---|---|---|---|---|
| [C30204](https://shopview.testrail.io/index.php?/cases/view/30204) | An invoice sits in the range by its own invoice date; endpoints includ | `column expanded export summary` | **`csv designated location sbr slot`** | SV-8620 (specs/sbr-sales-by-representative.md Story 2 S2-R5; S2-R8; §3 |
| [C30218](https://shopview.testrail.io/index.php?/cases/view/30218) | Row layout: 12 columns in order, blanks in position, bold summary rows | `column expanded location summary` | **`csv designated export sbr slot`** | SV-8623; SV-8638 (SBR spec v15 2026-07-29 Story 5 S5-R2; S5-R3; S5-R6; |
| [C30285](https://shopview.testrail.io/index.php?/cases/view/30285) | Summary CSV: file name, UTF-8 BOM, verbatim headers, one row per rep | `column csv location summary` | **`designated expanded export sbr slot`** | SV-8631 (SBR spec v15 2026-07-29 Story 14 S14-R15; S14-R18; S14-R20 —  |
| [C30286](https://shopview.testrail.io/index.php?/cases/view/30286) | Expanded CSV: file name, verbatim headers, one row per invoice | `column csv expanded location` | **`designated export sbr slot summary`** | SV-8631 (SBR spec v15 2026-07-29 Story 14 S14-R16; S14-R20 — Expanded  |
| [C30249](https://shopview.testrail.io/index.php?/cases/view/30249) | Browser back from a drilldown restores expansion and scroll; no reload | `column expanded location` | **`csv designated export sbr slot summary`** | SV-8629 (specs/sbr-sales-by-representative.md Story 12 S12-R3a; Story  |
| [C30276](https://shopview.testrail.io/index.php?/cases/view/30276) | The ⋯ overflow menu lists exactly four download actions | `csv expanded summary` | **`column designated export location sbr slot`** | SV-8631 (specs/sbr-sales-by-representative.md Story 14 S14-R1; Story 1 |
| [C30211](https://shopview.testrail.io/index.php?/cases/view/30211) | Filters compose: a rep appears only with an invoice matching ALL activ | `location summary` | **`column csv designated expanded export sbr slot`** | SV-8622 (specs/sbr-sales-by-representative.md Story 4 S4-R7; S4-R6; S4 |
| [C30234](https://shopview.testrail.io/index.php?/cases/view/30234) | Money columns use the standardized labels and definitions | `column export` | **`csv designated expanded location sbr slot summary`** | SV-8582 (SBR spec §3 definitions; §4 Terminology — money-column labels |

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `workplac wos aggregat` | `wos` | - | ONE sales rep is credited on invoiced service WOs at BOTH workplaces, so the rep's summary row aggregates across locations and carries one invoice detail row per workplace (seeded via API) |
| 2 | COVERED-BY | STRONG | `scope single summary` | `-` | C30218 C30278 C30285 C38913 | At the default single-location scope, download Summary (CSV) |
| 3 | CANDIDATE GAP | STRONG | `refetch summary csv` | `summary` | - | Turn on All Locations, wait for the refetch, and download Summary (CSV) again |
| 4 | CANDIDATE GAP | STRONG | `widened scope expanded` | `scope` | - | Download Expanded (CSV) in the same widened scope |
| 5 | CONTRADICTS-OURS | STRONG | `footer expanded total` | `footer` | C30218 C30238 C30267 C30279 C30288 C30291 | Inspect the Expanded footer totals row |
| 6 | CANDIDATE GAP | PHRASING | `sbr permission` | `sbr` | - | Admin with the SBR view permission (reports project storage state) |
| 7 | CANDIDATE GAP | PHRASING | `workplac` | `workplac` | - | The org has at least two accessible workplaces |

## C38920 - CONTRADICTS-OURS

*PV Location column is scope-governed — hidden at one location, Multiple on a merged special-order row*  
Section: Reports Suite > Parts Velocity Report > PV — Row Model  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/38920)

**CLOSED-LIST COLLISIONS (read these first - Rule 42 shape):**

| Our case | Our title | Shared subject | Their term(s) absent from our closed list | Our refs |
|---|---|---|---|---|
| [C30352](https://shopview.testrail.io/index.php?/cases/view/30352) | First visit shows exactly the 14 default columns in the specified orde | `column hidden location order scope` | **`governed merged multiple row special`** | SV-8644; SV-8643 (PV spec v4 2026-07-29 S4-R2; S4-R3 + Story 3 S3-R10  |
| [C30328](https://shopview.testrail.io/index.php?/cases/view/30328) | Type filter: single-select, first in row, three options, default Both; | `column order row special` | **`governed hidden location merged multiple scope`** | SV-8642 (PV spec S2-R1; S3-R5 - 'Catalogue' RENAMED to the exact label |
| [C30337](https://shopview.testrail.io/index.php?/cases/view/30337) | Location filter is rightmost, defaults to the active location, accessi | `location row scope` | **`column governed hidden merged multiple order special`** | SV-8642 (PV spec S2-R9 — per-row location identifier in All-Locations  |
| [C30346](https://shopview.testrail.io/index.php?/cases/view/30346) | Info icons sit on Units Sold; Demand and Turns / Yr with descriptions | `column hidden order` | **`governed location merged multiple row scope special`** | SV-8643 (specs/parts-velocity.md S3-R6) |
| [C30365](https://shopview.testrail.io/index.php?/cases/view/30365) | Last Sale is whole days since the most recent sale over all-time histo | `location order special` | **`column governed hidden merged multiple row scope`** | SV-8645 (specs/parts-velocity.md S5-R4 (Last Sale); §4; S5-R5; tech-pl |
| [C38924](https://shopview.testrail.io/index.php?/cases/view/38924) | Units Sold keeps an exact part-of-a-unit quantity and is never rounded | `column order row` | **`governed hidden location merged multiple scope special`** | SV-8589 (PV spec S5-R1 Units Sold net stock movement + S5-R5 two-decim |
| [C30340](https://shopview.testrail.io/index.php?/cases/view/30340) | Parts Velocity: the Location filter is hidden for a one-location user | `hidden location` | **`column governed merged multiple order row scope special`** | SV-8642 (PV spec S2-E4 — RULED HIDDEN by Chris Ward answer 2026-07-31  |
| [C30371](https://shopview.testrail.io/index.php?/cases/view/30371) | Number formats match the spec per column; rounding is half away from z | `column` | **`governed hidden location merged multiple order row scope special`** | SV-8645 (specs/parts-velocity.md S5-R5; S5-R7 (rounding)) |

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `workplace sold invoiced` | `sold` | - | One inventory part sold on an invoiced WO at the active workplace (seeded via API) |
| 2 | COVERED-BY | STRONG | `scope single location` | `-` | C30352 C38914 | Open PV at the default single-location scope |
| 3 | CANDIDATE GAP | STRONG | `refetch server location` | `server` | - | Turn on All Locations and wait for the server refetch |
| 4 | COVERED-BY | STRONG | `merged special search` | `-` | C30342 | Set Type = Special Order and search the merged part number |
| 5 | COVERED-BY | STRONG | `search type number` | `-` | C30333 | Set Type = Inventory and search the seeded inventory part number |
| 6 | CONTRADICTS-OURS | STRONG | `menu selection column` | `menu` | C30328 C30352 C30358 C38914 | Open the Column Selection menu |
| 7 | CANDIDATE GAP | PHRASING | `workplac` | `workplac` | - | Owner/admin with PV access and at least two accessible workplaces |
| 8 | CANDIDATE GAP | PHRASING | `workplac merg wos` | `workplac` | - | The SAME vendor special-order part sold on invoiced WOs at BOTH workplaces, so PV merges them into one special-order row (seeded via API) |

## C38919 - CONTRADICTS-OURS

*TU column selector hides Est. Lost Labor, persists across reload, and the export mirrors it*  
Section: Reports Suite > Technician Utilization > TU — Visual & Accessibility  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/38919)

**CLOSED-LIST COLLISIONS (read these first - Rule 42 shape):**

| Our case | Our title | Shared subject | Their term(s) absent from our closed list | Our refs |
|---|---|---|---|---|
| [C30401](https://shopview.testrail.io/index.php?/cases/view/30401) | Headers in fixed order; Total, WO and Internal Hours show clocked hour | `column est labor lost` | **`export hid mirror persist selector`** | SV-8649; SV-8656 (TU spec v5 2026-07-29 S2-R1; S2-R2; S2-R3; S2-R4; S2 |
| [C30405](https://shopview.testrail.io/index.php?/cases/view/30405) | Est. Lost Labor, when shown, is pinned right and bold with the info ic | `column est labor lost` | **`export hid mirror persist selector`** | SV-8649 (TU spec v5 2026-07-29 S2-R10; S2-R11; S8-R4; S8-R6; S8-R7; S8 |
| [C30420](https://shopview.testrail.io/index.php?/cases/view/30420) | Day rows use the same columns and formats as the technician rows | `column est labor lost` | **`export hid mirror persist selector`** | SV-8651 (specs/technician-utilization.md S4-R3; S2-R8; §3) |
| [C30406](https://shopview.testrail.io/index.php?/cases/view/30406) | Zero internal hours - or a configured $0.00 rate - shows $0.00, never  | `est labor lost` | **`column export hid mirror persist selector`** | SV-8649 (specs/technician-utilization.md S2-E2; §5 Assumptions; S2 con |
| [C30399](https://shopview.testrail.io/index.php?/cases/view/30399) | Standard no-data message when no time in scope or all technicians clea | `hid` | **`column est export labor lost mirror persist selector`** | SV-8648 (specs/technician-utilization.md S1-N2; S9-N2; S5-N1; S3-N1; § |
| [C30434](https://shopview.testrail.io/index.php?/cases/view/30434) | Three-dot menu is leftmost, then Column Selection; three download opti | `column` | **`est export hid labor lost mirror persist selector`** | SV-8654 (TU spec v5 2026-07-29 S7-R1; S7-R2; S7-R3; S7-R4; S8-R2 — S8- |
| [C30443](https://shopview.testrail.io/index.php?/cases/view/30443) | Location changes reload with hours pooled into one row per technician | `` | **`column est export hid labor lost mirror persist selector`** | SV-8656 (specs/technician-utilization.md S9-R3; S9-R4; S9-R5 + on-scre |

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CONTRADICTS-OURS | STRONG | `calendar clock est` | `calendar` | C30401 C30420 | A technician with a 3h WO clock and a 1h internal clock exists in the current calendar month (seeded via API), so the report is non-empty and Est. |
| 2 | COVERED-BY | STRONG | `lost non zero` | `-` | C30401 | Lost Labor is non-zero |
| 3 | CANDIDATE GAP | STRONG | `five metric apply` | `five` | - | No saved TU view in this browser context, so the default five visible metric columns apply |
| 4 | CANDIDATE GAP | STRONG | `nav performance entry` | `performance` | - | Performance nav entry |
| 5 | COVERED-BY | STRONG | `menu selection column` | `-` | C30434 C30447 C38859 | Open the Column Selection menu |
| 6 | COVERED-BY | STRONG | `lost off labor` | `-` | C30405 C38859 | Lost Labor OFF (and only that one column) |
| 7 | CONTRADICTS-OURS | STRONG | `menu export summary` | `export` | C30434 | Download Summary (CSV) from the export menu |
| 8 | CANDIDATE GAP | STRONG | `est selector` | `est` | - | Re-open the selector and toggle Est. |
| 9 | COVERED-BY | STRONG | `lost back labor` | `-` | C30411 C38859 | Lost Labor back ON |
| 10 | CANDIDATE GAP | PHRASING | `logged` | `logged` | - | Owner/admin logged in with TU access (reports project storage state) |

## C38922 - CONTRADICTS-OURS

*WIP CSV export gains the Locations line while its column semantics stay exactly as shipped*  
Section: Reports Suite > Work In Progress > WIP — Exports  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/38922)

**CLOSED-LIST COLLISIONS (read these first - Rule 42 shape):**

| Our case | Our title | Shared subject | Their term(s) absent from our closed list | Our refs |
|---|---|---|---|---|
| [C38916](https://shopview.testrail.io/index.php?/cases/view/38916) | The Location column is automatic and never reads Multiple on a work-or | `column csv exactly location` | **`export gain line semantic shipped stay wip`** | SV-8663 (WIP spec v6 2026-07-29 S7-R13; S7-R14; S4-R3; S9-E1; S10-R5a; |
| [C38918](https://shopview.testrail.io/index.php?/cases/view/38918) | An over-cap Work In Progress download is refused with the too-large me | `csv exactly export location` | **`column gain line semantic shipped stay wip`** | SV-8665 (WIP spec Story 9 — the 10; 000-row export cap applies to ALL  |
| [C30458](https://shopview.testrail.io/index.php?/cases/view/30458) | Each qualifying work order appears exactly once in exactly one tab | `column exactly line` | **`csv export gain location semantic shipped stay wip`** | SV-8658 (specs/wip-work-in-progress.md Story 2 S2-R4; §3 Key Decisions |
| [C30475](https://shopview.testrail.io/index.php?/cases/view/30475) | Labor Earned is the clocked share of each approved line's quoted value | `column exactly line` | **`csv export gain location semantic shipped stay wip`** | SV-8660 (specs/wip-work-in-progress.md Story 4 S4-R15; §4 Terminology  |
| [C30481](https://shopview.testrail.io/index.php?/cases/view/30481) | Inv. Hrs shows quoted minus worked hours; signed to one decimal | `column exactly` | **`csv export gain line location semantic shipped stay wip`** | SV-8660 (specs/wip-work-in-progress.md Story 4 S4-R23; S4-R24; S4-E2) |
| [C30495](https://shopview.testrail.io/index.php?/cases/view/30495) | The Totals row sums each visible money column and the Inv. Hrs column | `column exactly` | **`csv export gain line location semantic shipped stay wip`** | SV-8662 (specs/wip-work-in-progress.md Story 6 S6-R2; S6-R3) |
| [C30503](https://shopview.testrail.io/index.php?/cases/view/30503) | Location filter: rightmost multi-select with All locations, reloads on | `exactly location` | **`column csv export gain line semantic shipped stay wip`** | SV-8663 (WIP spec Story 7 S7-R9; S7-R10 + on-screen location-scope ind |

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | COVERED-BY | STRONG | `wip` | `-` | C30456 C30515 | Owner/admin with WIP access (reports project storage state) |
| 2 | CANDIDATE GAP | STRONG | `vehicle week vin` | `week` | - | One approved WO with clocked time on a unique-VIN vehicle exists in the default (This Week) range, so it lands in the default "Approved |
| 3 | COVERED-BY | STRONG | `completed partially tab` | `-` | C30452 C30462 C30464 C30488 C30490 | partially completed" tab (seeded via API) |
| 4 | CONTRADICTS-OURS | STRONG | `wip hidden saved` | `wip` | C30467 | The browser context carries NO saved WIP view, so Location starts default-hidden |
| 5 | CANDIDATE GAP | STRONG | `nav wip performance` | `wip` | - | Open WIP from the Performance nav, isolate to the unique VIN via the asset filter, and download the CSV |
| 6 | CANDIDATE GAP | STRONG | `refetch location` | `location` | - | Turn on All Locations, wait for the refetch, and download again |
| 7 | CONTRADICTS-OURS | STRONG | `menu selection location` | `menu` | C30459 C30467 C30504 C30507 C30508 C30509 | Toggle Location ON in the Column Selection menu and download again |
| 8 | CANDIDATE GAP | PHRASING | `workplac` | `workplac` | - | The org has at least two accessible workplaces |

## C38921 - CONTRADICTS-OURS

*IV CSV export carries the As of and Locations metadata lines above the header, plus a scope-conditional Location column*  
Section: Reports Suite > Inventory Value > IV — Exports  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/38921)

**CLOSED-LIST COLLISIONS (read these first - Rule 42 shape):**

| Our case | Our title | Shared subject | Their term(s) absent from our closed list | Our refs |
|---|---|---|---|---|
| [C30540](https://shopview.testrail.io/index.php?/cases/view/30540) | A part appears only if not a core charge and on-hand quantity is above | `above location` | **`column conditional csv export header lin metadata plus scope`** | SV-8669 (specs/inventory-value.md Story 2 S2-R1; S2-R2; S2-N1; S2-N2;  |
| [C30575](https://shopview.testrail.io/index.php?/cases/view/30575) | Selecting one, several, or all locations reloads the report scoped to  | `location scope` | **`above column conditional csv export header lin metadata plus`** | SV-8674 (specs/inventory-value.md Story 7 S7-R3 + on-screen location-s |
| [C30574](https://shopview.testrail.io/index.php?/cases/view/30574) | The Location filter is a rightmost multi-select with an All locations  | `location` | **`above column conditional csv export header lin metadata plus scope`** | SV-8674 (specs/inventory-value.md Story 7 S7-R1; S7-R2; Story 12 S12-R |

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `workplace core valued` | `core` | - | One in-stock, non-core, fixed-price part valued at the active workplace (seeded via API) |
| 2 | CONTRADICTS-OURS | STRONG | `search scope single` | `search` | C30551 C30554 C38917 | Open the report at the default scope and search the seeded part number so the export is a single known row |
| 3 | CONTRADICTS-OURS | STRONG | `menu export csv` | `menu` | C30589 C30592 C30593 C30595 | Download the CSV from the export menu |
| 4 | CANDIDATE GAP | STRONG | `refetch location` | `location` | - | Turn on All Locations, wait for the refetch, and download again |
| 5 | CONTRADICTS-OURS | STRONG | `cell location data` | `cell` | C30536 C30539 C30570 C30575 C30593 C30607 | Inspect the data row's Location cell |
| 6 | CANDIDATE GAP | PHRASING | `workplac` | `workplac` | - | Owner/admin with IV access and at least two accessible workplaces |
