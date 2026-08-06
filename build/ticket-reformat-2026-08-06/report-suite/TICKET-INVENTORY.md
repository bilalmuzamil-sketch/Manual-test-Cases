# TICKET INVENTORY - every Report Suite ticket we created, and what happened to it

**Read `README.md` first.** Population established live today, five independent ways (see `snapshots/population.json`). **65 tickets** are ours under epic SV-8582 and its stories: **62 rewritten**, **3 left alone because they are closed**.

Every rewritten ticket was re-read live afterwards and checked against the required shape: the five parts and nothing else, an Environment line naming the QA branch before the steps, a Source paragraph at the end, every other Jira field byte-identical, and every attachment still in place. **65 read live / 65 PASS / 0 FAIL** (`snapshots/FINAL-VERIFICATION.json`).

| Ticket | Type | Status | Parent | Report | Outcome | Title |
|---|---|---|---|---|---|---|
| [SV-8780](https://shopview.atlassian.net/browse/SV-8780) | Story Defect | Ready to Fix | SV-8598 | Sales By Customer | **REWRITTEN** | SBC report gated by its own permission |
| [SV-8818](https://shopview.atlassian.net/browse/SV-8818) | Bug | Ready to Fix | SV-8582 | more than one report | **REWRITTEN** | PDF download fails with a server error on a medium-sized report view, on 5 of th |
| [SV-8819](https://shopview.atlassian.net/browse/SV-8819) | Bug | Done / Done | SV-8582 | Parts Velocity | **not rewritten - closed** | Parts Velocity: Turns / Yr is overstated on the "This Year" preset — it divides  |
| [SV-8820](https://shopview.atlassian.net/browse/SV-8820) | Bug | Ready to Fix | SV-8582 | Inventory Value | **REWRITTEN** | Inventory Value reports the stock value for one day AFTER the date asked for |
| [SV-8821](https://shopview.atlassian.net/browse/SV-8821) | Bug | OBSOLETE / Done | none | more than one report | **not rewritten - closed** | Creating an invoice from a completed work order fails with a server error |
| [SV-8822](https://shopview.atlassian.net/browse/SV-8822) | Bug | OBSOLETE / Done | none | more than one report | **not rewritten - closed** | Saving a customer returns a server error instead of a validation error when a sa |
| [SV-8823](https://shopview.atlassian.net/browse/SV-8823) | Bug | Ready to Fix | SV-8582 | Inventory Value | **REWRITTEN** | Inventory Value spreadsheet: money arrives as text, and the file ignores the cho |
| [SV-8879](https://shopview.atlassian.net/browse/SV-8879) | Bug | Open | SV-8582 | more than one report | **REWRITTEN** | Location chooser is shown to a user who has access to only one location, on all  |
| [SV-8880](https://shopview.atlassian.net/browse/SV-8880) | Bug | Open | SV-8582 | Sales By Representative | **REWRITTEN** | Sales By Representative Summary spreadsheet is missing four columns the screen s |
| [SV-8881](https://shopview.atlassian.net/browse/SV-8881) | Bug | Open | SV-8582 | Technician Utilization | **REWRITTEN** | Technician Utilization download menu drops the word Download from all four optio |
| [SV-8907](https://shopview.atlassian.net/browse/SV-8907) | Story Defect | Open | SV-8665 | Work In Progress | **REWRITTEN** | Work In Progress cannot be downloaded - a server error whenever the tab has any  |
| [SV-8908](https://shopview.atlassian.net/browse/SV-8908) | Story Defect | Open | SV-8663 | Work In Progress | **REWRITTEN** | Work In Progress Asset filter leaves out a vehicle that shares a unit number |
| [SV-8925](https://shopview.atlassian.net/browse/SV-8925) | Story Defect | Open | SV-8612 | Sales By Customer | **REWRITTEN** | Sales By Customer and Sales By Representative spreadsheets export money, percent |
| [SV-8926](https://shopview.atlassian.net/browse/SV-8926) | Story Defect | Open | SV-8671 | Inventory Value | **REWRITTEN** | Inventory Value totals row is labelled Totals on screen where the written descri |
| [SV-8927](https://shopview.atlassian.net/browse/SV-8927) | Story Defect | Open | SV-8670 | Inventory Value | **REWRITTEN** | Inventory Value opens with Margin and Total Sell already switched on; both shoul |
| [SV-8928](https://shopview.atlassian.net/browse/SV-8928) | Story Defect | Open | SV-8675 | Inventory Value | **REWRITTEN** | Inventory Value forgets the part search text between visits, though it remembers |
| [SV-8929](https://shopview.atlassian.net/browse/SV-8929) | Story Defect | Open | SV-8675 | Inventory Value | **REWRITTEN** | Inventory Value keeps a saved category that no longer exists, so the report open |
| [SV-8930](https://shopview.atlassian.net/browse/SV-8930) | Story Defect | Open | SV-8668 | Inventory Value | **REWRITTEN** | Inventory Value shows an empty table with no message when nothing matches |
| [SV-8931](https://shopview.atlassian.net/browse/SV-8931) | Story Defect | Open | SV-8674 | Inventory Value | **REWRITTEN** | Inventory Value opens on All locations instead of the user's current location |
| [SV-8932](https://shopview.atlassian.net/browse/SV-8932) | Story Defect | Open | SV-8679 | Inventory Value | **REWRITTEN** | Inventory Value: long text never shortens with an ellipsis, and column headings  |
| [SV-8934](https://shopview.atlassian.net/browse/SV-8934) | Story Defect | Open | SV-8646 | Parts Velocity | **REWRITTEN** | Parts Velocity PDF prints Description, Category and Vendor in full instead of sh |
| [SV-8935](https://shopview.atlassian.net/browse/SV-8935) | Story Defect | Open | SV-8646 | Parts Velocity | **REWRITTEN** | Parts Velocity spreadsheet prints Last Sale as the words "54 days" instead of a  |
| [SV-8936](https://shopview.atlassian.net/browse/SV-8936) | Story Defect | Open | SV-8646 | Parts Velocity | **REWRITTEN** | Parts Velocity download success message is a general one and does not name the r |
| [SV-8937](https://shopview.atlassian.net/browse/SV-8937) | Story Defect | Open | SV-8646 | more than one report | **REWRITTEN** | PDF heading shows an end date one day later than the range asked for, on three r |
| [SV-8938](https://shopview.atlassian.net/browse/SV-8938) | Story Defect | Open | SV-8643 | Parts Velocity | **REWRITTEN** | Parts Velocity Location column sits sixth, after Vendor, instead of first before |
| [SV-8939](https://shopview.atlassian.net/browse/SV-8939) | Story Defect | Open | SV-8642 | Parts Velocity | **REWRITTEN** | Parts Velocity opens on All locations instead of the location the user is workin |
| [SV-8940](https://shopview.atlassian.net/browse/SV-8940) | Story Defect | Open | SV-8643 | Parts Velocity | **REWRITTEN** | Parts Velocity never shortens long Description, Category or Vendor text, so the  |
| [SV-8943](https://shopview.atlassian.net/browse/SV-8943) | Story Defect | Open | SV-8648 | Technician Utilization | **REWRITTEN** | Technician Utilization opens on All locations instead of the location the user i |
| [SV-8944](https://shopview.atlassian.net/browse/SV-8944) | Story Defect | Open | SV-8648 | Technician Utilization | **REWRITTEN** | Technician Utilization total hours do not match Timesheet Activities for the sam |
| [SV-8945](https://shopview.atlassian.net/browse/SV-8945) | Story Defect | Open | SV-8649 | Technician Utilization | **REWRITTEN** | Sorting a Technician Utilization column reloads the report from the server inste |
| [SV-8946](https://shopview.atlassian.net/browse/SV-8946) | Story Defect | Open | SV-8652 | Technician Utilization | **REWRITTEN** | The Technician Utilization technician filter reloads the report from the server  |
| [SV-8947](https://shopview.atlassian.net/browse/SV-8947) | Story Defect | Open | SV-8652 | Technician Utilization | **REWRITTEN** | Technician Utilization technician filter and its select-all control are labelled |
| [SV-8948](https://shopview.atlassian.net/browse/SV-8948) | Story Defect | Open | SV-8654 | Technician Utilization | **REWRITTEN** | Technician Utilization downloads ignore the technician filter and include everyb |
| [SV-8949](https://shopview.atlassian.net/browse/SV-8949) | Story Defect | Open | SV-8654 | Technician Utilization | **REWRITTEN** | Technician Utilization downloads are not ordered by technician name A to Z |
| [SV-8950](https://shopview.atlassian.net/browse/SV-8950) | Story Defect | Open | SV-8654 | Technician Utilization | **REWRITTEN** | Technician Utilization downloads leave out the Summary row |
| [SV-8951](https://shopview.atlassian.net/browse/SV-8951) | Story Defect | Open | SV-8654 | Technician Utilization | **REWRITTEN** | The Technician Utilization Expanded spreadsheet contains per-day rows and the fi |
| [SV-8952](https://shopview.atlassian.net/browse/SV-8952) | Story Defect | Open | SV-8654 | Technician Utilization | **REWRITTEN** | Technician Utilization download messages: the success wording is generic and a f |
| [SV-8953](https://shopview.atlassian.net/browse/SV-8953) | Story Defect | Open | SV-8655 | Technician Utilization | **REWRITTEN** | Technician Utilization expand and collapse controls do not tell assistive techno |
| [SV-8954](https://shopview.atlassian.net/browse/SV-8954) | Story Defect | Open | SV-8656 | Technician Utilization | **REWRITTEN** | The Technician Utilization Location column disappears when one location is chose |
| [SV-8955](https://shopview.atlassian.net/browse/SV-8955) | Story Defect | Open | SV-8601 | Sales By Customer | **REWRITTEN** | Sales By Customer never puts the date range or Product Type in the page link, so |
| [SV-8956](https://shopview.atlassian.net/browse/SV-8956) | Story Defect | Open | SV-8612 | Sales By Customer | **REWRITTEN** | Sales By Customer download file names leave out the date range |
| [SV-8962](https://shopview.atlassian.net/browse/SV-8962) | Story Defect | Open | SV-8616 | Sales By Customer | **REWRITTEN** | Sales By Customer Customer filter: no search icon, wrong multi-select label, and |
| [SV-8963](https://shopview.atlassian.net/browse/SV-8963) | Story Defect | Open | SV-8608 | Sales By Customer | **REWRITTEN** | Sales By Customer sorting: the Location column cannot be sorted, and blank value |
| [SV-8964](https://shopview.atlassian.net/browse/SV-8964) | Story Defect | Open | SV-8613 | Sales By Customer | **REWRITTEN** | Sales By Customer Expanded View PDF comes out on A3 paper instead of A4 |
| [SV-8965](https://shopview.atlassian.net/browse/SV-8965) | Story Defect | Open | SV-8617 | Sales By Customer | **REWRITTEN** | Sales By Customer table uses the wrong row colours, too little side padding, and |
| [SV-8966](https://shopview.atlassian.net/browse/SV-8966) | Story Defect | Open | SV-8604 | Sales By Customer | **REWRITTEN** | Sales By Customer remembered view keeps a location and a customer the user can n |
| [SV-8967](https://shopview.atlassian.net/browse/SV-8967) | Story Defect | Open | SV-8660 | Work In Progress | **REWRITTEN** | Work In Progress: the WO number is plain text even for a user who does have Work |
| [SV-8968](https://shopview.atlassian.net/browse/SV-8968) | Story Defect | Open | SV-8663 | Work In Progress | **REWRITTEN** | Work In Progress Advisor, Customer and Asset filters reload from the server inst |
| [SV-8969](https://shopview.atlassian.net/browse/SV-8969) | Story Defect | Open | SV-8663 | Work In Progress | **REWRITTEN** | Work In Progress filters show a Clear action before anything is selected, and th |
| [SV-8970](https://shopview.atlassian.net/browse/SV-8970) | Story Defect | Open | SV-8666 | Work In Progress | **REWRITTEN** | Work In Progress table is pale blue-grey throughout instead of the all-white tab |
| [SV-8972](https://shopview.atlassian.net/browse/SV-8972) | Story Defect | Open | SV-8631 | Sales By Representative | **REWRITTEN** | Sales By Representative Expanded spreadsheet puts Invoice # before Date and head |
| [SV-8973](https://shopview.atlassian.net/browse/SV-8973) | Story Defect | Open | SV-8633 | Sales By Representative | **REWRITTEN** | Sales By Representative empty-state message uses different wording from the one  |
| [SV-8974](https://shopview.atlassian.net/browse/SV-8974) | Story Defect | Open | SV-8624 | Sales By Representative | **REWRITTEN** | Sales By Representative: invoices on the same day are not ordered by invoice num |
| [SV-8975](https://shopview.atlassian.net/browse/SV-8975) | Story Defect | Open | SV-8635 | Sales By Representative | **REWRITTEN** | Sales By Representative: three icon-only buttons announce the wrong name to a sc |
| [SV-8976](https://shopview.atlassian.net/browse/SV-8976) | Story Defect | Open | SV-8640 | Sales By Representative | **REWRITTEN** | Sales By Representative: a saved date range that is no longer valid leaves the r |
| [SV-8977](https://shopview.atlassian.net/browse/SV-8977) | Story Defect | Open | SV-8627 | Sales By Representative | **REWRITTEN** | Sales By Representative: the heading row and the Totals row both scroll away ins |
| [SV-8978](https://shopview.atlassian.net/browse/SV-8978) | Story Defect | Open | SV-8627 | Sales By Representative | **REWRITTEN** | Sales By Representative on a phone has no separate totals bar under the table |
| [SV-8979](https://shopview.atlassian.net/browse/SV-8979) | Story Defect | Open | SV-8634 | Sales By Representative | **REWRITTEN** | Sales By Representative expand and collapse chevrons are half the required touch |
| [SV-8980](https://shopview.atlassian.net/browse/SV-8980) | Story Defect | Open | SV-8635 | Sales By Representative | **REWRITTEN** | Sales By Representative table is the same pale grey as the page, and the title a |
| [SV-8981](https://shopview.atlassian.net/browse/SV-8981) | Story Defect | Open | SV-8631 | Sales By Representative | **REWRITTEN** | Sales By Representative Expanded View PDF is one flat table instead of a block p |
| [SV-8982](https://shopview.atlassian.net/browse/SV-8982) | Story Defect | Open | SV-8631 | Sales By Representative | **REWRITTEN** | Sales By Representative download file names have a date-range word added to them |
| [SV-8983](https://shopview.atlassian.net/browse/SV-8983) | Story Defect | Open | SV-8632 | Sales By Representative | **REWRITTEN** | Sales Rep Assignments spreadsheet does not start with the UTF-8 marker |
| [SV-8987](https://shopview.atlassian.net/browse/SV-8987) | Story Defect | Open | SV-8660 | Work In Progress | **REWRITTEN** | Work In Progress: the Last Activity column is left-aligned where the description |
| [SV-8988](https://shopview.atlassian.net/browse/SV-8988) | Story Defect | Open | SV-8661 | Work In Progress | **REWRITTEN** | Work In Progress: the Estimates figure in the summary strip is not shown in a mu |
| [SV-8989](https://shopview.atlassian.net/browse/SV-8989) | Story Defect | Open | SV-8660 | Work In Progress | **REWRITTEN** | Work In Progress: Inv. Hrs shows two decimal places where the description asks f |

## Excluded, and why

| Ticket | Why it is not in the population |
|---|---|
| [SV-8910](https://shopview.atlassian.net/browse/SV-8910) | Ownership unconfirmed and the QA lead has been asked, so it was skipped by instruction. It is also outside the population by structure: it has no parent and its only link is to SV-8781, not to this epic or any of its stories. |
| [SV-8871](https://shopview.atlassian.net/browse/SV-8871) | Parent SV-8795 is a FILTERS story under epic SV-8785, not a Report Suite story. It is the sibling worker's half. |

## Not ours, seen and left alone (Standing Rule 38)

| Ticket | Author | Title |
|---|---|---|
| [SV-8960](https://shopview.atlassian.net/browse/SV-8960) | Nebojsa Glavinic | WIP | Days Open column alignment is inconsistent with other text columns in Work |
| [SV-8961](https://shopview.atlassian.net/browse/SV-8961) | Nebojsa Glavinic | WIP | Work In Progress report displays "- No VIN -" instead of the standard "Unk |
| [SV-8984](https://shopview.atlassian.net/browse/SV-8984) | Nebojsa Glavinic | WIP | Custom date range filter is cleared after page refresh in Work In Progress |

No write of any kind was made to those three.

