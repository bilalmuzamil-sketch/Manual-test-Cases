# Automated cases changed — for Vlad (Standing Rule 65)

**Plain summary, and it is the whole story: this pass changed only the *References* field on these cases — the pointer that says which version of the written specification each case comes from. Not one step, not one expected result, not one automation marker changed on any of them. Nothing an automated check runs on has moved, so no automation should need adjusting.**

**26 of the 40 cases TestRail flags as Automated were touched.** The flag reported here is `custom_atmstatus = 3`, captured **at write time** — Rule 65 requires that, because the flag moves and reading it afterwards can give a different answer from the truth at the moment of the write.

## Does this change what an automated check should conclude?

**No — for every case in the list below.** The reasoning, stated plainly so it can be overruled: `refs` is a traceability field. It is not shown to the tester as an instruction, it is not part of any assertion, and no automated check reads it. A version pin moving from `v15` to `v18` records that the specification has been republished; it does not change what the product is expected to do.

**We have never seen the automation scripts, so this is our judgement, not a guarantee.** If any check matches on the References field — for instance to group or filter cases by their source document — these edits would be visible to it. That is the one way this could matter, and it is worth a glance.

## The cases

| Case | Report | What the case covers | What changed |
|---|---|---|---|
| [C30114](https://shopview.testrail.io/index.php?/cases/view/30114) | Sales By Customer Report | Pinned control toggles All customers and Clear all; clearing shows emp | specification pin moved from version 16 to 17 |
| [C30121](https://shopview.testrail.io/index.php?/cases/view/30121) | Sales By Customer Report | Each customer gets one summary row with its invoice count in parenthes | specification pin moved from version 16 to 17 |
| [C30123](https://shopview.testrail.io/index.php?/cases/view/30123) | Sales By Customer Report | Expanding a customer reveals asset rows; chevrons toggle and are indep | specification pin moved from version 16 to 17 |
| [C30138](https://shopview.testrail.io/index.php?/cases/view/30138) | Sales By Customer Report | The invoice number opens the invoice in the same browser tab | specification pin moved from version 16 to 17 |
| [C30262](https://shopview.testrail.io/index.php?/cases/view/30262) | Sales By Representative Report | Show Unassigned adds one top-pinned Unassigned row that acts like a re | specification pin moved from version 15 to 18 |
| [C30314](https://shopview.testrail.io/index.php?/cases/view/30314) | Sales By Representative Report | Invoice credit snapshot: WO rep, else customer rep, else unassigned | specification pin moved from version 15 to 18 |
| [C30326](https://shopview.testrail.io/index.php?/cases/view/30326) | Parts Velocity Report | Without the Manager or Office User role the report entry is not shown | specification pin moved from version 4 to 6 |
| [C30328](https://shopview.testrail.io/index.php?/cases/view/30328) | Parts Velocity Report | Type filter: single-select, first in row, three options, default Both; | specification pin moved from version 4 to 6 |
| [C30333](https://shopview.testrail.io/index.php?/cases/view/30333) | Parts Velocity Report | Toolbar search matches part number or description, case-insensitively | specification pin moved from version 4 to 6 |
| [C30338](https://shopview.testrail.io/index.php?/cases/view/30338) | Parts Velocity Report | Empty state shows the standard no-data message when no parts match the | specification pin moved from version 4 to 6 |
| [C30346](https://shopview.testrail.io/index.php?/cases/view/30346) | Parts Velocity Report | Info icons sit on Units Sold, Demand and Turns/Yr with descriptions | specification pin moved from version 4 to 6 |
| [C30353](https://shopview.testrail.io/index.php?/cases/view/30353) | Parts Velocity Report | A re-enabled column returns to its canonical slot, with no reload | specification pin moved from version 4 to 6 |
| [C30390](https://shopview.testrail.io/index.php?/cases/view/30390) | Parts Velocity Report | Header-click sorting re-queries the server; nulls first asc and last d | specification pin moved from version 4 to 6 |
| [C30398](https://shopview.testrail.io/index.php?/cases/view/30398) | Technician Utilization | Without reports access Technician Utilization is hidden | a comma removed from the References field |
| [C30460](https://shopview.testrail.io/index.php?/cases/view/30460) | Work In Progress | No qualifying work orders: every tab shows the no-data message and no  | specification pin moved from version 10 to 11 |
| [C30488](https://shopview.testrail.io/index.php?/cases/view/30488) | Work In Progress | Total Earned is the hero figure and equals the started-stage figures s | specification pin moved from version 10 to 11 |
| [C30498](https://shopview.testrail.io/index.php?/cases/view/30498) | Work In Progress | The Advisor filter lists the advisors in the loaded jobs; screen only | specification pin moved from version 10 to 11 |
| [C30508](https://shopview.testrail.io/index.php?/cases/view/30508) | Work In Progress | Remembers the date range, filter selections, location, columns | specification pin moved from version 10 to 11 |
| [C30510](https://shopview.testrail.io/index.php?/cases/view/30510) | Work In Progress | Work In Progress: a three-dot menu holds Download (PDF) and Download ( | specification pin moved from version 10 to 11 |
| [C30515](https://shopview.testrail.io/index.php?/cases/view/30515) | Work In Progress | The downloaded files are named "wip-2-report.pdf" and "wip-2-report.cs | specification pin moved from version 10 to 11 |
| [C30518](https://shopview.testrail.io/index.php?/cases/view/30518) | Work In Progress | Export notifications: success caption, "Empty export" warning | specification pin moved from version 10 to 11 |
| [C30535](https://shopview.testrail.io/index.php?/cases/view/30535) | Inventory Value | One row per in-stock part at the selected locations valued at the reso | specification pin moved from version 3 to 5 |
| [C30557](https://shopview.testrail.io/index.php?/cases/view/30557) | Inventory Value | Totals row sums the FULL filtered set on the server, not just the visi | specification pin moved from version 3 to 5 |
| [C30563](https://shopview.testrail.io/index.php?/cases/view/30563) | Inventory Value | A window reaching today with today not yet recorded values live stock | specification pin moved from version 3 to 5 |
| [C30569](https://shopview.testrail.io/index.php?/cases/view/30569) | Inventory Value | Category and Vendor multi-selects reload the report to matching parts  | specification pin moved from version 3 to 5 |
| [C30583](https://shopview.testrail.io/index.php?/cases/view/30583) | Inventory Value | Rows are sorted by Total Cost highest first on load and after any relo | specification pin moved from version 3 to 5 |

## Who actually set the Automated flag

Rule 65 requires this to be checked rather than assumed, because on the Schedule project nobody ever set the flag — our own `add_case` tooling hardcoded it — and reporting those cases as Vlad's own would pad the list and cost it credibility.

- **26 of the 26** have a recorded change of `custom_atmstatus` in their TestRail history, so a person set the flag deliberately.
- **0** have no recorded change — none of these is a case whose flag was born Automated by our own tooling.
- **All 40 Automated cases in the suite** (not just the 26 touched) were checked, and **every one was flipped from *Not Automated* to *Automated* by user id 1 — Vladimir Tomovic himself.** So this list is genuinely his own work, and nothing in it is padding.

Per-case history: `logs/atm-history.json`.

## Cases NOT in this list

**[C30288](https://shopview.testrail.io/index.php?/cases/view/30288) gained an automation marker in this pass** — the kind of change that genuinely does affect what an automated run should conclude. **It is not in the list above because TestRail does not flag it as Automated** (`custom_atmstatus = 1`). It is named here anyway so the omission is visible rather than silent: it is a Sales By Representative CSV-download case, it now reads `AUTOMATION: READY`, and it was the last case in the suite without a marker.
