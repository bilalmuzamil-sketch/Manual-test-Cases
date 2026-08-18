# Automated Cases Register — `custom_atmstatus = 3` across the three active suites

**Purpose:** the durable list of every case carrying TestRail's OWN **"Automated"** status field
(`custom_atmstatus = 3`) in Schedule (4254), Report Suite (4281) and Filters (4110). This is the
**hand-off list for Vladimir Tomovic** (the automation engineer): after build verification, the
plain-text markers on our touched cases get lifted to `AUTOMATION: READY` / `... EXPECT FAIL` and
these case numbers are shared with him so he adjusts his automations (Standing Rule 65).

**Compiled read-only, 2026-08-18, from live TestRail.** id 3 = us (Bilal Muzamil), id 1 =
Vladimir Tomovic, id 7 = Ahtasham Amjad.

**Totals:** 56 cases at `custom_atmstatus = 3` — **44 ours** (all edited this session: **11 content
changed [A]**, **33 marker/provenance/refs only [B]**) + **12 foreign** (Vladimir Tomovic; **0
touched**). Schedule has **0** at `=3` (but 20 at `=4` Pending, set by Vladimir — listed at the end).

**Bucket key:** **A** = we changed real test content (title/preconditions/steps/expected body).
**B** = we changed only the automation marker / Rule-54 provenance line / refs; test content
byte-identical to before our write. **—** = we did not touch it this session.

---

## OURS (`created_by = 3`) — the `atmstatus=3` flag was set by Vladimir; we authored the case body

| Project | C-id | Link | Title | Current plain-text marker | Touched this session | Bucket |
|---|---|---|---|---|---|---|
| Filters | C29600 | [open](https://shopview.testrail.io/index.php?/cases/view/29600) | Status and Asset on Site together show only work orders matching both | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | A — title, preconditions, steps, expected-BODY |
| Filters | C29614 | [open](https://shopview.testrail.io/index.php?/cases/view/29614) | Filters are remembered permanently, even after closing the browser | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Filters | C29623 | [open](https://shopview.testrail.io/index.php?/cases/view/29623) | On a phone, choices in a filter sheet apply only when you tap Apply filters | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | A — title, preconditions, steps, expected-BODY |
| Filters | C38877 | [open](https://shopview.testrail.io/index.php?/cases/view/38877) | Imported works alone: picking it greys out the other filters | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30107 | [open](https://shopview.testrail.io/index.php?/cases/view/30107) | Product Type multi-select: both toggles on by default; S/P prefix filtering | AUTOMATION: READY - EXPECT FAIL (SV-9074) | YES | B |
| Report Suite | C30114 | [open](https://shopview.testrail.io/index.php?/cases/view/30114) | Pinned control toggles All customers and Clear all; clearing shows empty state | AUTOMATION: READY - EXPECT FAIL (SV-8991) | YES | B |
| Report Suite | C30121 | [open](https://shopview.testrail.io/index.php?/cases/view/30121) | Each customer gets one summary row with its invoice count in parentheses | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30123 | [open](https://shopview.testrail.io/index.php?/cases/view/30123) | Expanding a customer reveals asset rows; chevrons toggle and are independent | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30138 | [open](https://shopview.testrail.io/index.php?/cases/view/30138) | The invoice number opens the invoice in the same browser tab | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30217 | [open](https://shopview.testrail.io/index.php?/cases/view/30217) | A rep row appears only when the rep has a matching non-reversed invoice | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30221 | [open](https://shopview.testrail.io/index.php?/cases/view/30221) | Expanding a rep loads its invoices on demand with a row-level spinner | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | A — expected-BODY |
| Report Suite | C30262 | [open](https://shopview.testrail.io/index.php?/cases/view/30262) | Show Unassigned adds one top-pinned Unassigned row that acts like a rep row | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30314 | [open](https://shopview.testrail.io/index.php?/cases/view/30314) | Invoice credit snapshot: WO rep, else customer rep, else unassigned | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30326 | [open](https://shopview.testrail.io/index.php?/cases/view/30326) | Without the Manager or Office User role the report entry is not shown | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30328 | [open](https://shopview.testrail.io/index.php?/cases/view/30328) | Type filter: single-select, first in row, three options, default Both; reloads | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30333 | [open](https://shopview.testrail.io/index.php?/cases/view/30333) | Toolbar search matches part number or description, case-insensitively | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30338 | [open](https://shopview.testrail.io/index.php?/cases/view/30338) | Empty state shows the standard no-data message when no parts match the filters | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30346 | [open](https://shopview.testrail.io/index.php?/cases/view/30346) | Info icons sit on Units Sold, Demand and Turns/Yr with descriptions | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | A — expected-BODY |
| Report Suite | C30352 | [open](https://shopview.testrail.io/index.php?/cases/view/30352) | First visit shows exactly the 14 default columns in the specified order | AUTOMATION: READY - EXPECT FAIL (SV-8938) | YES | A — expected-BODY |
| Report Suite | C30353 | [open](https://shopview.testrail.io/index.php?/cases/view/30353) | A re-enabled column returns to its canonical slot, with no reload | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | A — expected-BODY |
| Report Suite | C30390 | [open](https://shopview.testrail.io/index.php?/cases/view/30390) | Header-click sorting re-queries the server; nulls first asc and last desc | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30398 | [open](https://shopview.testrail.io/index.php?/cases/view/30398) | Without reports access Technician Utilization is hidden | AUTOMATION: HOLD - needs a second sign-in as a user without reports access, and there is one shared sign-in on this environment | YES | B |
| Report Suite | C30399 | [open](https://shopview.testrail.io/index.php?/cases/view/30399) | Standard no-data message when no time in scope or all technicians cleared | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30401 | [open](https://shopview.testrail.io/index.php?/cases/view/30401) | Headers in fixed order; Total, WO and Internal Hours show clocked hours (2 dp) | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30404 | [open](https://shopview.testrail.io/index.php?/cases/view/30404) | Est. Lost Labor values internal hours at each location's default rate | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30410 | [open](https://shopview.testrail.io/index.php?/cases/view/30410) | All six columns sort on screen: ascending first, toggling with no third state | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30424 | [open](https://shopview.testrail.io/index.php?/cases/view/30424) | Deselecting a technician hides the row and recalculates the Summary | AUTOMATION: READY - EXPECT FAIL (SV-8946) | YES | B |
| Report Suite | C30429 | [open](https://shopview.testrail.io/index.php?/cases/view/30429) | The Total Hours link opens Timesheet Activities in the same tab | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30449 | [open](https://shopview.testrail.io/index.php?/cases/view/30449) | The per-day breakdown is fetched only when a technician row is expanded | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30452 | [open](https://shopview.testrail.io/index.php?/cases/view/30452) | Four tabs in a fixed order with the partially-completed tab selected | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30460 | [open](https://shopview.testrail.io/index.php?/cases/view/30460) | No qualifying work orders: every tab shows the no-data message and no Totals | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | A — steps |
| Report Suite | C30462 | [open](https://shopview.testrail.io/index.php?/cases/view/30462) | Status-to-tab mapping: Estimate, Complete, In Progress and Review work orders | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | A — preconditions |
| Report Suite | C30488 | [open](https://shopview.testrail.io/index.php?/cases/view/30488) | Total Earned is the hero figure and equals the started-stage figures summed | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30498 | [open](https://shopview.testrail.io/index.php?/cases/view/30498) | The Advisor filter lists the advisors in the loaded jobs; screen only | AUTOMATION: READY - EXPECT FAIL (SV-8968) | YES | B |
| Report Suite | C30508 | [open](https://shopview.testrail.io/index.php?/cases/view/30508) | Remembers the "as of" date, filter selections, location, columns | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | A — title, steps, expected-BODY |
| Report Suite | C30510 | [open](https://shopview.testrail.io/index.php?/cases/view/30510) | Work In Progress: a three-dot menu holds Download (PDF) and Download (CSV) | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30515 | [open](https://shopview.testrail.io/index.php?/cases/view/30515) | The downloaded files are named "wip-2-report.pdf" and "wip-2-report.csv" | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30518 | [open](https://shopview.testrail.io/index.php?/cases/view/30518) | Export notifications: success caption, "Empty export" warning | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30527 | [open](https://shopview.testrail.io/index.php?/cases/view/30527) | Without reports access Work In Progress is absent from the navigation | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30535 | [open](https://shopview.testrail.io/index.php?/cases/view/30535) | One row per in-stock part at the selected locations valued at the resolved date | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | A — steps, expected-BODY |
| Report Suite | C30557 | [open](https://shopview.testrail.io/index.php?/cases/view/30557) | Totals row sums the FULL filtered set on the server, not just the visible page | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30563 | [open](https://shopview.testrail.io/index.php?/cases/view/30563) | The "as of" date today, with today not yet recorded, values live stock | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | A — title, steps, expected-BODY |
| Report Suite | C30569 | [open](https://shopview.testrail.io/index.php?/cases/view/30569) | Category and Vendor multi-selects reload the report to matching parts only | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |
| Report Suite | C30583 | [open](https://shopview.testrail.io/index.php?/cases/view/30583) | Rows are sorted by Total Cost highest first on load and after any reload | AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026 | YES | B |

---

## FOREIGN (`created_by != 3`) — authored AND flagged by the automation engineer; HANDS-OFF (Rule 38)

| Project | C-id | Link | Title | Current plain-text marker | Touched this session | Bucket |
|---|---|---|---|---|---|---|
| Report Suite | C38919 | [open](https://shopview.testrail.io/index.php?/cases/view/38919) | TU column selector hides Est. Lost Labor, persists across reload, and the export mirrors it | (none) | no | — |
| Report Suite | C38920 | [open](https://shopview.testrail.io/index.php?/cases/view/38920) | PV Location column is scope-governed — hidden at one location, Multiple on a merged special-order row | (none) | no | — |
| Report Suite | C38921 | [open](https://shopview.testrail.io/index.php?/cases/view/38921) | IV CSV export carries the As of and Locations metadata lines above the header, plus a scope-conditional Location column | (none) | no | — |
| Report Suite | C38922 | [open](https://shopview.testrail.io/index.php?/cases/view/38922) | WIP CSV export gains the Locations line while its column semantics stay exactly as shipped | (none) | no | — |
| Report Suite | C38923 | [open](https://shopview.testrail.io/index.php?/cases/view/38923) | SBR Summary and Expanded CSV exports carry the Location column at its designated slot | (none) | no | — |
| Report Suite | C43567 | [open](https://shopview.testrail.io/index.php?/cases/view/43567) | Filter-panel search keeps keyboard focus across the QSelect No-results swap | (none) | no | — |
| Report Suite | C43568 | [open](https://shopview.testrail.io/index.php?/cases/view/43568) | Manual Parts return counts toward Units Returned on Parts Velocity | (none) | no | — |
| Report Suite | C43569 | [open](https://shopview.testrail.io/index.php?/cases/view/43569) | Report route permission gate for Sales By Customer / Sales By Representative / Inventory Value | (none) | no | — |
| Report Suite | C43570 | [open](https://shopview.testrail.io/index.php?/cases/view/43570) | Select all / Clear all filter encoding does not overflow the request line | (none) | no | — |
| Report Suite | C43571 | [open](https://shopview.testrail.io/index.php?/cases/view/43571) | Report drill-through cells render plain text when the viewer cannot open the target | (none) | no | — |
| Report Suite | C43572 | [open](https://shopview.testrail.io/index.php?/cases/view/43572) | Work In Progress appends pages on scroll while the server summary stays constant | (none) | no | — |
| Report Suite | C43573 | [open](https://shopview.testrail.io/index.php?/cases/view/43573) | Remembered view restores Inventory Value category and vendor filters across a reload | (none) | no | — |

---

## Appendix — Schedule `custom_atmstatus = 4` (Pending), for awareness (NOT "Automated")

20 Schedule cases were moved `Not Automated → Pending` by **Vladimir Tomovic (user id 1)** at
**2026-08-17T10:15:33 UTC**, before our Schedule passes. "Pending" ≠ "Automated" (`3`), but it signals
Vlad has queued them for automation; our later edits preserved the value (we never sent the field). All 20 (all edited by us this session,
value untouched): C29925, C29927, C29928, C29931, C29932, C29936, C29937, C29939, C29943, C29944,
C29948, C29950, C29951, C29952, C29954, C30039, C30040, C30042, C30043, C30046.
