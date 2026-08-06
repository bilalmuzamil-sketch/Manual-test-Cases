# Tickets FILED - Report Suite VIU, third session, 2026-08-06

**12 new Story Defects, all on Sales By Representative.** Every one: `issuetype` **Story Defect** (10007)
- `parent` = **the owning story** (which is itself a child of epic SV-8582, so the defect still rolls up
to the epic) - **`priority` Medium** - the owning story also linked **`relates to`** - **no Product Area**
(the field does not exist on this type). **11 field checks read back live on each: 12 x 11 = 132 checks,
132 PASS, 0 FAIL.**

**Priority is `Medium`, not `Low`.** The QA lead changed the rule mid-session, verbatim: *"One thing which
I want to correct, please keep the priority of the tickets which you create to Medium instead of keeping
them to LOW."* These twelve are the first tickets filed under it. **Nothing already filed was altered.**

**Every one carries a plain-language source block** naming the specification, its **Confluence page
version 17**, the requirement reference and the requirement's own words quoted verbatim. **No ticket was
filed without an identifiable source** - `NO-SOURCE-DEFECTS.md` gained no new rows.

| Ticket | Parent story | What it reports | Field checks |
|---|---|---|---|
| [SV-8972](https://shopview.atlassian.net/browse/SV-8972) | SV-8631 | Sales By Representative Expanded spreadsheet puts Invoice # before Date and heads the column "Invoice Status" | 11/11 PASS |
| [SV-8973](https://shopview.atlassian.net/browse/SV-8973) | SV-8633 | Sales By Representative empty-state message uses different wording from the one written down | 11/11 PASS |
| [SV-8974](https://shopview.atlassian.net/browse/SV-8974) | SV-8624 | Sales By Representative: invoices on the same day are not ordered by invoice number | 11/11 PASS |
| [SV-8975](https://shopview.atlassian.net/browse/SV-8975) | SV-8635 | Sales By Representative: three icon-only buttons announce the wrong name to a screen reader | 11/11 PASS |
| [SV-8976](https://shopview.atlassian.net/browse/SV-8976) | SV-8640 | Sales By Representative: a saved date range that is no longer valid leaves the report empty | 11/11 PASS |
| [SV-8977](https://shopview.atlassian.net/browse/SV-8977) | SV-8627 | Sales By Representative: the heading row and the Totals row both scroll away instead of staying put | 11/11 PASS |
| [SV-8978](https://shopview.atlassian.net/browse/SV-8978) | SV-8627 | Sales By Representative on a phone has no separate totals bar under the table | 11/11 PASS |
| [SV-8979](https://shopview.atlassian.net/browse/SV-8979) | SV-8634 | Sales By Representative expand and collapse chevrons are half the required touch size | 11/11 PASS |
| [SV-8980](https://shopview.atlassian.net/browse/SV-8980) | SV-8635 | Sales By Representative table is the same pale grey as the page, and the title and Location filter are out of line | 11/11 PASS |
| [SV-8981](https://shopview.atlassian.net/browse/SV-8981) | SV-8631 | Sales By Representative Expanded View PDF is one flat table instead of a block per representative, and comes out on A3 | 11/11 PASS |
| [SV-8982](https://shopview.atlassian.net/browse/SV-8982) | SV-8631 | Sales By Representative download file names have a date-range word added to them | 11/11 PASS |
| [SV-8983](https://shopview.atlassian.net/browse/SV-8983) | SV-8632 | Sales Rep Assignments spreadsheet does not start with the UTF-8 marker | 11/11 PASS |

## Duplicate search ran FIRST, and it stopped one of these being filed

Nine JQL queries were run before anything was created. **One finding was dropped as a duplicate:** the
spreadsheets writing money as `"$1,979.40"` and percentages as `100.0%` is **already
[SV-8925](https://shopview.atlassian.net/browse/SV-8925)**, filed by the first session today, and its description quotes Sales By Representative
requirement S14-R17 - the very requirement we had reached independently. So C30277 was marked
`READY - EXPECT FAIL (SV-8925)` and **no thirteenth ticket exists.**

Two more findings were **deliberately not filed as new tickets** because they widen existing ones:

- **[SV-8937](https://shopview.atlassian.net/browse/SV-8937)** - "PDF heading shows an end date one day later than the range asked for, **on three
  reports**" - also affects **Sales By Representative**, making four. Controlled on three different end
  dates including a month boundary (31 March reads as 1 April). **Not edited:** the QA lead is retrofitting
  that ticket's mechanism and scope in a pass of his own.
- **[SV-8964](https://shopview.atlassian.net/browse/SV-8964)** - the Expanded View PDF on A3 - is written against Sales By Customer. Sales By
  Representative's Expanded PDF is A3 too. Our own SV-8981 reports the SBR file, and its A3 paper size is
  named inside it, so the fact is captured without touching anyone else's ticket.

## One finding NOT filed, on purpose - Rule 51

The server accepts a custom date range of **367 inclusive days** when the documented cap is 366; 368 is
refused. The boundary was pinned exactly. **It was not shown to be reachable from the calendar**, so it
may be an API-only matter, and Rule 51 forbids filing an API-related finding without asking first. It is
written up in `API-ASK.md`.

## Nothing was created or deleted on the branch

No test data was seeded and none was removed. The `ZZAUTOTEST` representatives and their invoices already
existed. See `CHANGES-MADE-SESSION3.md`.
