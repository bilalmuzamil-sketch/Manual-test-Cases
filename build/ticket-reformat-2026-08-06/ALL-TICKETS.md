# Every ticket we created — the working list

**This is the list the QA lead asked for.** One row per ticket, with the link, what it is about in one line, whether its description has been rewritten into the new five-part shape, what state it is in, and whether it carries a picture or a recording.

**Read live from Jira on 2026-08-06** — the status, resolution and attachment columns are what Jira held at that moment, not what our notes said.

## The counts

| | Tickets | Rewritten |
|---|---|---|
| Report Suite (SV-8582) | 65 | 65 |
| Filters (SV-8785) | 7 | 7 |
| Schedule (SV-8685) | 20 | 20 |
| **Total** | **92** | **92** |

**Every ticket we created now carries the five-part description — 84 were rewritten in the two earlier passes today and the remaining 8, all of them closed, were rewritten afterwards on the QA lead's instruction that all of them be corrected.**

Two counting notes, said plainly so the total can be checked:

- **[SV-8871](https://shopview.atlassian.net/browse/SV-8871) is counted once, under Filters.** It came up in the Report Suite sweep as well, because that sweep looks at every ticket this account created, but it belongs to a Filters story (its parent is SV-8795, Filter Persistence) and it was rewritten by the Filters and Schedule pass. So it is a Filters ticket and it is counted there only.
- **[SV-8910](https://shopview.atlassian.net/browse/SV-8910) is not in this list.** It was created under our account but whose work it is has never been confirmed, and the QA lead asked for it to be left out until that is settled. It is a Bug, Open, priority Low, with no parent, titled *"Vendor invoice total is duplicated onto every purchase order when one receive spans two POs"*. **Its description has NOT been rewritten.** If it is ours, it needs one more write and a parent.

## Report Suite — 65 tickets (epic SV-8582)

| Ticket | What it is about | Rewritten | Type | Status | Picture or recording |
|---|---|---|---|---|---|
| [SV-8780](https://shopview.atlassian.net/browse/SV-8780) | SBC report gated by its own permission | yes | Story Defect | Ready to Fix | no |
| [SV-8818](https://shopview.atlassian.net/browse/SV-8818) | PDF download fails with a server error on a medium-sized report view, on 5 of the 6 reports | yes | Bug | Ready to Fix | yes — 1 attached, 1 shown in the body (one pasted image was destroyed — see the note below) |
| [SV-8819](https://shopview.atlassian.net/browse/SV-8819) | Parts Velocity: Turns / Yr is overstated on the "This Year" preset — it divides by one day too few | yes (as a closed ticket, 6 Aug) | Bug | Done / Done | yes — 1 attached, none shown in the body |
| [SV-8820](https://shopview.atlassian.net/browse/SV-8820) | Inventory Value reports the stock value for one day AFTER the date asked for | yes | Bug | Ready to Fix | yes — 3 attached, 2 shown in the body |
| [SV-8821](https://shopview.atlassian.net/browse/SV-8821) | Creating an invoice from a completed work order fails with a server error | yes (as a closed ticket, 6 Aug) | Bug | OBSOLETE / Done | yes — 2 attached, 2 shown in the body |
| [SV-8822](https://shopview.atlassian.net/browse/SV-8822) | Saving a customer returns a server error instead of a validation error when a sales-rep id is supplied | yes (as a closed ticket, 6 Aug) | Bug | OBSOLETE / Done | no |
| [SV-8823](https://shopview.atlassian.net/browse/SV-8823) | Inventory Value spreadsheet: money arrives as text, and the file ignores the chosen columns and re-orders them | yes | Bug | Ready to Fix | yes — 1 attached, 1 shown in the body |
| [SV-8879](https://shopview.atlassian.net/browse/SV-8879) | Location chooser is shown to a user who has access to only one location, on all six new reports | yes | Bug | Open | yes — 1 attached, 1 shown in the body |
| [SV-8880](https://shopview.atlassian.net/browse/SV-8880) | Sales By Representative Summary spreadsheet is missing four columns the screen shows, and adds a Totals row | yes | Bug | Open | no |
| [SV-8881](https://shopview.atlassian.net/browse/SV-8881) | Technician Utilization download menu drops the word Download from all four options, unlike the other reports | yes | Bug | Open | no |
| [SV-8907](https://shopview.atlassian.net/browse/SV-8907) | Work In Progress cannot be downloaded - a server error whenever the tab has any rows | yes | Story Defect | Open | no |
| [SV-8908](https://shopview.atlassian.net/browse/SV-8908) | Work In Progress Asset filter leaves out a vehicle that shares a unit number | yes | Story Defect | Open | no |
| [SV-8925](https://shopview.atlassian.net/browse/SV-8925) | Sales By Customer and Sales By Representative spreadsheets export money, percentages and dates as text instead of plain numbers | yes | Story Defect | Open | no |
| [SV-8926](https://shopview.atlassian.net/browse/SV-8926) | Inventory Value totals row is labelled Totals on screen where the written description asks for Total | yes | Story Defect | Open | no |
| [SV-8927](https://shopview.atlassian.net/browse/SV-8927) | Inventory Value opens with Margin and Total Sell already switched on; both should start hidden | yes | Story Defect | Open | no |
| [SV-8928](https://shopview.atlassian.net/browse/SV-8928) | Inventory Value forgets the part search text between visits, though it remembers every other setting | yes | Story Defect | Open | no |
| [SV-8929](https://shopview.atlassian.net/browse/SV-8929) | Inventory Value keeps a saved category that no longer exists, so the report opens empty instead of dropping it | yes | Story Defect | Open | no |
| [SV-8930](https://shopview.atlassian.net/browse/SV-8930) | Inventory Value shows an empty table with no message when nothing matches | yes | Story Defect | Open | no |
| [SV-8931](https://shopview.atlassian.net/browse/SV-8931) | Inventory Value opens on All locations instead of the user's current location | yes | Story Defect | Open | no |
| [SV-8932](https://shopview.atlassian.net/browse/SV-8932) | Inventory Value: long text never shortens with an ellipsis, and column headings announce no sort state | yes | Story Defect | Open | no |
| [SV-8934](https://shopview.atlassian.net/browse/SV-8934) | Parts Velocity PDF prints Description, Category and Vendor in full instead of shortening them to 18 characters | yes | Story Defect | Open | no |
| [SV-8935](https://shopview.atlassian.net/browse/SV-8935) | Parts Velocity spreadsheet prints Last Sale as the words "54 days" instead of a plain number | yes | Story Defect | Open | no |
| [SV-8936](https://shopview.atlassian.net/browse/SV-8936) | Parts Velocity download success message is a general one and does not name the report or the file type | yes | Story Defect | Open | no |
| [SV-8937](https://shopview.atlassian.net/browse/SV-8937) | PDF heading shows an end date one day later than the range asked for, on three reports | yes | Story Defect | Open | no |
| [SV-8938](https://shopview.atlassian.net/browse/SV-8938) | Parts Velocity Location column sits sixth, after Vendor, instead of first before Type | yes | Story Defect | Open | no |
| [SV-8939](https://shopview.atlassian.net/browse/SV-8939) | Parts Velocity opens on All locations instead of the location the user is working in | yes | Story Defect | Open | no |
| [SV-8940](https://shopview.atlassian.net/browse/SV-8940) | Parts Velocity never shortens long Description, Category or Vendor text, so the table runs far wider than the window | yes | Story Defect | Open | no |
| [SV-8943](https://shopview.atlassian.net/browse/SV-8943) | Technician Utilization opens on All locations instead of the location the user is working in | yes | Story Defect | Open | no |
| [SV-8944](https://shopview.atlassian.net/browse/SV-8944) | Technician Utilization total hours do not match Timesheet Activities for the same technician, range and location | yes | Story Defect | Open | no |
| [SV-8945](https://shopview.atlassian.net/browse/SV-8945) | Sorting a Technician Utilization column reloads the report from the server instead of reordering the rows on screen | yes | Story Defect | Open | no |
| [SV-8946](https://shopview.atlassian.net/browse/SV-8946) | The Technician Utilization technician filter reloads the report from the server instead of hiding rows on screen | yes | Story Defect | Open | no |
| [SV-8947](https://shopview.atlassian.net/browse/SV-8947) | Technician Utilization technician filter and its select-all control are labelled differently from the specification | yes | Story Defect | Open | no |
| [SV-8948](https://shopview.atlassian.net/browse/SV-8948) | Technician Utilization downloads ignore the technician filter and include everybody | yes | Story Defect | Open | no |
| [SV-8949](https://shopview.atlassian.net/browse/SV-8949) | Technician Utilization downloads are not ordered by technician name A to Z | yes | Story Defect | Open | no |
| [SV-8950](https://shopview.atlassian.net/browse/SV-8950) | Technician Utilization downloads leave out the Summary row | yes | Story Defect | Open | no |
| [SV-8951](https://shopview.atlassian.net/browse/SV-8951) | The Technician Utilization Expanded spreadsheet contains per-day rows and the file names differ from the specification | yes | Story Defect | Open | no |
| [SV-8952](https://shopview.atlassian.net/browse/SV-8952) | Technician Utilization download messages: the success wording is generic and a failed download says nothing at all | yes | Story Defect | Open | no |
| [SV-8953](https://shopview.atlassian.net/browse/SV-8953) | Technician Utilization expand and collapse controls do not tell assistive technology whether a row is open | yes | Story Defect | Open | no |
| [SV-8954](https://shopview.atlassian.net/browse/SV-8954) | The Technician Utilization Location column disappears when one location is chosen, and cannot be turned on again | yes | Story Defect | Open | no |
| [SV-8955](https://shopview.atlassian.net/browse/SV-8955) | Sales By Customer never puts the date range or Product Type in the page link, so the report cannot be shared | yes | Story Defect | Open | no |
| [SV-8956](https://shopview.atlassian.net/browse/SV-8956) | Sales By Customer download file names leave out the date range | yes | Story Defect | Open | no |
| [SV-8962](https://shopview.atlassian.net/browse/SV-8962) | Sales By Customer Customer filter: no search icon, wrong multi-select label, and the typed text never shows in the field | yes | Story Defect | Open | no |
| [SV-8963](https://shopview.atlassian.net/browse/SV-8963) | Sales By Customer sorting: the Location column cannot be sorted, and blank values sort to the wrong end | yes | Story Defect | Open | no |
| [SV-8964](https://shopview.atlassian.net/browse/SV-8964) | Sales By Customer Expanded View PDF comes out on A3 paper instead of A4 | yes | Story Defect | Open | no |
| [SV-8965](https://shopview.atlassian.net/browse/SV-8965) | Sales By Customer table uses the wrong row colours, too little side padding, and does not indent invoice rows | yes | Story Defect | Open | no |
| [SV-8966](https://shopview.atlassian.net/browse/SV-8966) | Sales By Customer remembered view keeps a location and a customer the user can no longer use, and loses the date range entirely | yes | Story Defect | Open | no |
| [SV-8967](https://shopview.atlassian.net/browse/SV-8967) | Work In Progress: the WO number is plain text even for a user who does have Work Order permission | yes | Story Defect | Open | no |
| [SV-8968](https://shopview.atlassian.net/browse/SV-8968) | Work In Progress Advisor, Customer and Asset filters reload from the server instead of narrowing on screen | yes | Story Defect | Open | no |
| [SV-8969](https://shopview.atlassian.net/browse/SV-8969) | Work In Progress filters show a Clear action before anything is selected, and the Advisor filter has no All advisors item | yes | Story Defect | Open | no |
| [SV-8970](https://shopview.atlassian.net/browse/SV-8970) | Work In Progress table is pale blue-grey throughout instead of the all-white table the description asks for | yes | Story Defect | Open | no |
| [SV-8972](https://shopview.atlassian.net/browse/SV-8972) | Sales By Representative Expanded spreadsheet puts Invoice # before Date and heads the column "Invoice Status" | yes | Story Defect | Open | no |
| [SV-8973](https://shopview.atlassian.net/browse/SV-8973) | Sales By Representative empty-state message uses different wording from the one written down | yes | Story Defect | Open | no |
| [SV-8974](https://shopview.atlassian.net/browse/SV-8974) | Sales By Representative: invoices on the same day are not ordered by invoice number | yes | Story Defect | Open | no |
| [SV-8975](https://shopview.atlassian.net/browse/SV-8975) | Sales By Representative: three icon-only buttons announce the wrong name to a screen reader | yes | Story Defect | Open | no |
| [SV-8976](https://shopview.atlassian.net/browse/SV-8976) | Sales By Representative: a saved date range that is no longer valid leaves the report empty | yes | Story Defect | Open | no |
| [SV-8977](https://shopview.atlassian.net/browse/SV-8977) | Sales By Representative: the heading row and the Totals row both scroll away instead of staying put | yes | Story Defect | Open | no |
| [SV-8978](https://shopview.atlassian.net/browse/SV-8978) | Sales By Representative on a phone has no separate totals bar under the table | yes | Story Defect | Open | no |
| [SV-8979](https://shopview.atlassian.net/browse/SV-8979) | Sales By Representative expand and collapse chevrons are half the required touch size | yes | Story Defect | Open | no |
| [SV-8980](https://shopview.atlassian.net/browse/SV-8980) | Sales By Representative table is the same pale grey as the page, and the title and Location filter are out of line | yes | Story Defect | Open | no |
| [SV-8981](https://shopview.atlassian.net/browse/SV-8981) | Sales By Representative Expanded View PDF is one flat table instead of a block per representative, and comes out on A3 | yes | Story Defect | Open | no |
| [SV-8982](https://shopview.atlassian.net/browse/SV-8982) | Sales By Representative download file names have a date-range word added to them | yes | Story Defect | Open | no |
| [SV-8983](https://shopview.atlassian.net/browse/SV-8983) | Sales Rep Assignments spreadsheet does not start with the UTF-8 marker | yes | Story Defect | Open | no |
| [SV-8987](https://shopview.atlassian.net/browse/SV-8987) | Work In Progress: the Last Activity column is left-aligned where the description asks for right-aligned | yes | Story Defect | Open | no |
| [SV-8988](https://shopview.atlassian.net/browse/SV-8988) | Work In Progress: the Estimates figure in the summary strip is not shown in a muted style | yes | Story Defect | Open | no |
| [SV-8989](https://shopview.atlassian.net/browse/SV-8989) | Work In Progress: Inv. Hrs shows two decimal places where the description asks for one | yes | Story Defect | Open | no |

## Filters — 7 tickets (epic SV-8785)

| Ticket | What it is about | Rewritten | Type | Status | Picture or recording |
|---|---|---|---|---|---|
| [SV-8843](https://shopview.atlassian.net/browse/SV-8843) | Filter bar sits on the same row as the tabs, so collapsing it frees no space | yes (as a closed ticket, 6 Aug) | Bug | OBSOLETE / Done | no |
| [SV-8844](https://shopview.atlassian.net/browse/SV-8844) | Page Search is not working Anymore | yes (as a closed ticket, 6 Aug) | Bug | OBSOLETE / Done | yes — 3 attached, 2 shown in the body |
| [SV-8845](https://shopview.atlassian.net/browse/SV-8845) | On a phone, a shared filter link shows the filters as on but lists the wrong work orders | yes | Bug | In Progress | yes — 3 attached, 2 shown in the body |
| [SV-8846](https://shopview.atlassian.net/browse/SV-8846) | On a phone there is no Clear Filters button, so filters cannot all be cleared at once | yes | Story Defect | Ready to Fix | yes — 2 attached, 2 shown in the body |
| [SV-8847](https://shopview.atlassian.net/browse/SV-8847) | When only a page search is active the empty screen offers Clear Filters, which does not help | yes (as a closed ticket, 6 Aug) | Bug | OBSOLETE / Done | yes — 1 attached, none shown in the body |
| [SV-8871](https://shopview.atlassian.net/browse/SV-8871) | A saved Customer, Lead Technician or Service Advisor filter comes back without its name on the button | yes | Story Defect | Ready to Fix | yes — 2 attached, none shown in the body |
| [SV-8912](https://shopview.atlassian.net/browse/SV-8912) | On a phone there is no page search: the magnifier opens global search, which does not narrow the list (S13-R17/R18) | yes | Story Defect | Ready to Fix | no |

## Schedule — 20 tickets (epic SV-8685)

| Ticket | What it is about | Rewritten | Type | Status | Picture or recording |
|---|---|---|---|---|---|
| [SV-8848](https://shopview.atlassian.net/browse/SV-8848) | Every time on the Schedule is shown six hours later than the time it was scheduled for | yes | Bug | Open | no |
| [SV-8849](https://shopview.atlassian.net/browse/SV-8849) | A shift that is part of a multi-day series cannot be opened from the Week view | yes | Story Defect | Ready for QA | no |
| [SV-8850](https://shopview.atlassian.net/browse/SV-8850) | The '+N more' link on a crowded day opens an empty box - the hidden shifts are never listed | yes | Story Defect | Ready for QA | no |
| [SV-8851](https://shopview.atlassian.net/browse/SV-8851) | Turning on the Tech Hours option in View Options changes nothing on the screen | yes | Story Defect | Ready for QA | no |
| [SV-8852](https://shopview.atlassian.net/browse/SV-8852) | The shift window warns about a scheduling clash but gives no way to fix it | yes | Story Defect | Open | no |
| [SV-8853](https://shopview.atlassian.net/browse/SV-8853) | The Escape and Enter keys do not work on the delete and reassign confirmation windows | yes | Story Defect | Open | no |
| [SV-8854](https://shopview.atlassian.net/browse/SV-8854) | A user who is not allowed to see work orders can still read the whole work order list on the Schedule | yes | Story Defect | Open | no |
| [SV-8855](https://shopview.atlassian.net/browse/SV-8855) | The spread window has no start date, so a second technician's run of days cannot be made to follow the first | yes | Story Defect | Open | no |
| [SV-8856](https://shopview.atlassian.net/browse/SV-8856) | Dragging a shift sideways in Day view jumps it a whole hour instead of a quarter of an hour | yes | Story Defect | Open | no |
| [SV-8857](https://shopview.atlassian.net/browse/SV-8857) | The Schedule sidebar filters have no 'Clear all' and the Filters button does not show how many are on | yes | Story Defect | TESTING QA | yes — 2 attached, none shown in the body |
| [SV-8886](https://shopview.atlassian.net/browse/SV-8886) | Schedule scope picker: tick-box mode has no Select all and no Cancel, and the tally text differs from the spec | yes | Story Defect | Open | no |
| [SV-8902](https://shopview.atlassian.net/browse/SV-8902) | ZZAUTOTEST disposable probe - checking whether a Story Defect can be parented to a Story | yes (as a closed ticket, 6 Aug) | Story Defect | OBSOLETE / Done | no |
| [SV-8923](https://shopview.atlassian.net/browse/SV-8923) | Schedule: the Business Hours switch shades nothing - out-of-hours time looks identical to the working day | yes (as a closed ticket, 6 Aug) | Story Defect | OBSOLETE / Done | no |
| [SV-8924](https://shopview.atlassian.net/browse/SV-8924) | Schedule: assigning an unassigned job to a technician moves its saved start time six hours earlier | yes | Story Defect | Open | no |
| [SV-8933](https://shopview.atlassian.net/browse/SV-8933) | Working hours cannot be opened for a staff member who belongs to another location | yes | Story Defect | Open | no |
| [SV-8941](https://shopview.atlassian.net/browse/SV-8941) | Month view shows the VIN on shift blocks although the spec says it is omitted there | yes | Story Defect | Open | no |
| [SV-8942](https://shopview.atlassian.net/browse/SV-8942) | Schedule: at 960px and below the whole page scrolls sideways and the work order panel never collapses | yes | Story Defect | Open | no |
| [SV-8957](https://shopview.atlassian.net/browse/SV-8957) | Schedule: the click alternative to dragging a job onto the grid has disappeared from the build | yes | Story Defect | Open | no |
| [SV-8958](https://shopview.atlassian.net/browse/SV-8958) | Schedule: Month view series bar does not name the technician it belongs to | yes | Story Defect | Open | no |
| [SV-8959](https://shopview.atlassian.net/browse/SV-8959) | Schedule: hover tooltip puts the conflict warning at the bottom, not beside the customer name | yes | Story Defect | Open | no |

## The one thing that went wrong, and it is not recoverable

**[SV-8818](https://shopview.atlassian.net/browse/SV-8818) lost a pasted screenshot** (`image-20260804-061644.png`) on the very first write of the day. The new description did not carry the picture's reference, and Jira deletes a pasted image the moment its last reference disappears. The file is gone and we do not hold a copy. Jira's own history does not record it — it logs only that the description changed — so this is provable only because the write was compared against a snapshot taken beforehand.

**Every write after that carried the pictures forward, and that is now proven rather than asserted.** All 92 tickets were compared attachment by attachment, by id, against snapshots taken before any write: **91 unchanged, 1 loss, and it is the one above.** The full evidence is in `attachment-audit/ATTACHMENT-VERIFICATION.md`.

## What is owed

1. **One screenshot for SV-8818** — the PDF download failing on Parts Velocity — the next time a QA session is available.
2. **A decision on SV-8910** — is it ours? If yes it needs its description rewritten and a parent set.
3. **A decision on SV-8843 and SV-8847** — both closed as OBSOLETE, and our records say the behaviour they describe still happens on the branch. Reopening somebody else's closure is your call, not ours, so nothing was reopened and no status was touched. (SV-8845 was in the same position but reads **In Progress** now, so somebody has already picked it up and it needs nothing from you.)

