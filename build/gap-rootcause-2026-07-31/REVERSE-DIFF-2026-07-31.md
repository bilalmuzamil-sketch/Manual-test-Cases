# Reverse coverage diff - foreign assertions vs OUR suite

**Generated:** 2026-07-30T20:17:40Z · **READ-ONLY** (get_* only, zero writes) · **OURS = user id 3**

| Group | Name | Live total | Ours | Foreign | Foreign authors |
|---|---|---|---|---|---|
| 4281 | Reports Suite | 479 | 474 | 5 | {'Vladimir Tomovic': 5} |
| 4110 | Filters - (VIU Pending) | 110 | 110 | 0 | - |
| 4254 | Schedule - 2026 (VIU Pending) | 165 | 165 | 0 | - |

## C38923 - CONTRADICTS-OURS

*SBR Summary and Expanded CSV exports carry the Location column at its designated slot*  
Section: Reports Suite > Sales By Representative Report > SBR — Exports  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/38923)

| # | Verdict | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | `admin project sbr storage` | `admin` | - | Admin with the SBR view permission (reports project storage state) |
| 2 | CANDIDATE GAP | `workplaces org accessible least` | `workplaces` | - | The org has at least two accessible workplaces |
| 3 | CANDIDATE GAP | `workplaces api wos aggregates` | `workplaces` | - | ONE sales rep is credited on invoiced service WOs at BOTH workplaces, so the rep's summary row aggregates across locations and carries one invoice detail row per workplace (seeded via API) |
| 4 | COVERED-BY | `scope single summary default` | `-` | C30218 C30278 | At the default single-location scope, download Summary (CSV) |
| 5 | CANDIDATE GAP | `refetch wait turn locations` | `refetch` | - | Turn on All Locations, wait for the refetch, and download Summary (CSV) again |
| 6 | CONTRADICTS-OURS | `widened scope expanded csv` | `widened` | C30286 C38913 | Download Expanded (CSV) in the same widened scope |
| 7 | CONTRADICTS-OURS | `footer inspect expanded totals` | `footer` | C30291 C30318 | Inspect the Expanded footer totals row |

## C38920 - CONTRADICTS-OURS

*PV Location column is scope-governed — hidden at one location, Multiple on a merged special-order row*  
Section: Reports Suite > Parts Velocity Report > PV — Row Model  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/38920)

| # | Verdict | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | `admin workplaces accessible owner` | `admin` | - | Owner/admin with PV access and at least two accessible workplaces |
| 2 | CANDIDATE GAP | `api workplace seeded sold` | `api` | - | One inventory part sold on an invoiced WO at the active workplace (seeded via API) |
| 3 | CANDIDATE GAP | `workplaces api merges wos` | `workplaces` | - | The SAME vendor special-order part sold on invoiced WOs at BOTH workplaces, so PV merges them into one special-order row (seeded via API) |
| 4 | COVERED-BY | `scope single default location` | `-` | C30352 | Open PV at the default single-location scope |
| 5 | CANDIDATE GAP | `refetch wait turn server` | `refetch` | - | Turn on All Locations and wait for the server refetch |
| 6 | CONTRADICTS-OURS | `merged special search number` | `number` | C30342 | Set Type = Special Order and search the merged part number |
| 7 | CONTRADICTS-OURS | `seeded search number type` | `seeded` | C30333 | Set Type = Inventory and search the seeded inventory part number |
| 8 | CONTRADICTS-OURS | `menu selection column` | `menu` | C30328 C30352 C30358 C38914 | Open the Column Selection menu |

## C38919 - CONTRADICTS-OURS

*TU column selector hides Est. Lost Labor, persists across reload, and the export mirrors it*  
Section: Reports Suite > Technician Utilization > TU — Visual & Accessibility  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/38919)

| # | Verdict | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | `admin logged project storage` | `admin` | - | Owner/admin logged in with TU access (reports project storage state) |
| 2 | CANDIDATE GAP | `api calendar clock est` | `api` | - | A technician with a 3h WO clock and a 1h internal clock exists in the current calendar month (seeded via API), so the report is non-empty and Est. |
| 3 | COVERED-BY | `lost non zero labor` | `-` | C30401 | Lost Labor is non-zero |
| 4 | CANDIDATE GAP | `context five metric apply` | `context` | - | No saved TU view in this browser context, so the default five visible metric columns apply |
| 5 | CONTRADICTS-OURS | `nav performance entry` | `nav` | C30392 | Performance nav entry |
| 6 | COVERED-BY | `menu selection column` | `-` | C30434 C30447 C38859 | Open the Column Selection menu |
| 7 | COVERED-BY | `lost off labor column` | `-` | C30405 C38859 | Lost Labor OFF (and only that one column) |
| 8 | CONTRADICTS-OURS | `menu export summary csv` | `export` | C30434 | Download Summary (CSV) from the export menu |
| 9 | CONTRADICTS-OURS | `est selector toggle` | `selector` | C30410 C38859 | Re-open the selector and toggle Est. |
| 10 | COVERED-BY | `lost back labor` | `-` | C30411 C38859 | Lost Labor back ON |

## C38922 - CANDIDATE GAP

*WIP CSV export gains the Locations line while its column semantics stay exactly as shipped*  
Section: Reports Suite > Work In Progress > WIP — Exports  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/38922)

| # | Verdict | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | `admin project wip storage` | `admin` | - | Owner/admin with WIP access (reports project storage state) |
| 2 | CANDIDATE GAP | `workplaces org accessible least` | `workplaces` | - | The org has at least two accessible workplaces |
| 3 | CANDIDATE GAP | `unique lands vehicle week` | `unique` | - | One approved WO with clocked time on a unique-VIN vehicle exists in the default (This Week) range, so it lands in the default "Approved |
| 4 | CANDIDATE GAP | `api completed partially seeded` | `api` | C30462 | partially completed" tab (seeded via API) |
| 5 | CANDIDATE GAP | `context wip starts hidden` | `context` | - | The browser context carries NO saved WIP view, so Location starts default-hidden |
| 6 | CANDIDATE GAP | `isolate unique nav wip` | `isolate` | - | Open WIP from the Performance nav, isolate to the unique VIN via the asset filter, and download the CSV |
| 7 | CANDIDATE GAP | `refetch wait turn locations` | `refetch` | - | Turn on All Locations, wait for the refetch, and download again |
| 8 | CANDIDATE GAP | `menu toggle selection download` | `menu` | - | Toggle Location ON in the Column Selection menu and download again |

## C38921 - CONTRADICTS-OURS

*IV CSV export carries the As of and Locations metadata lines above the header, plus a scope-conditional Location column*  
Section: Reports Suite > Inventory Value > IV — Exports  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/38921)

| # | Verdict | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | `admin workplaces accessible owner` | `admin` | - | Owner/admin with IV access and at least two accessible workplaces |
| 2 | CANDIDATE GAP | `api workplace core valued` | `api` | - | One in-stock, non-core, fixed-price part valued at the active workplace (seeded via API) |
| 3 | CANDIDATE GAP | `seeded search scope export` | `seeded` | - | Open the report at the default scope and search the seeded part number so the export is a single known row |
| 4 | CONTRADICTS-OURS | `menu export csv download` | `menu` | C30589 C30592 C30593 C30595 | Download the CSV from the export menu |
| 5 | CANDIDATE GAP | `refetch wait turn locations` | `refetch` | - | Turn on All Locations, wait for the refetch, and download again |
| 6 | CONTRADICTS-OURS | `inspect cell location data` | `cell` | C30607 | Inspect the data row's Location cell |
