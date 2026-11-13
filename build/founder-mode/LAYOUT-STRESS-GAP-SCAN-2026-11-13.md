# Layout stress gap scan: Bill To and Internal Work Orders (13 Nov 2026)

Read-only scan, ordered after lesson L-21 (A/R and A/P, 13 Nov 2026: SV-12722, SV-12763, SV-12764) against the two permanent
checklist lines 9 and 10 of skill 21 §6d. Nothing was written to TestRail, Jira, Slack or Google, and nothing was committed. This
file is the only thing written.

Pixel numbers come from the design's own pictures. **Bill To** pictures are 1200 px wide; its visual inventory gives 1440 px for
these screens, so if the pictures are scaled, multiply by 1.2 to get screen pixels. **Internal Work Orders** pictures are rendered at
their real size (1280 or 1440 px). Positions are the left edge of a heading's text, measured by script (`words.py`: runs of dark or
coloured pixels in one horizontal band), and checked against the picture by eye where noted.

## Summary

| | Bill To | Internal Work Orders |
|---|---|---|
| Places where typed text shows | 26 | 33 |
| covered with stress data | 0 | 0 |
| partly covered | 4 (T06, T11, T15, T20) | 2 (T08, T25) |
| missing | 22 | 31 |
| Screen state changes | 16 | 17 |
| covered (layout checked before and after) | 3 (C07a, C14, C15) | 0 |
| missing | 13 | 17 |
| Design moves found (the design's own pictures of one screen in two states) | 4 (C03, C07, C09, plus the Bill To column on two assets) | 4 (C07, C08, C09, C10) |
| Pairs checked where nothing moves | 5 (C01, C05, C06, C08, C14) | 4 (C03, C06, C12, and C01 apart from the inserted line) |
| New cases proposed | 34 (24 typed-text, 10 state-change) | 53 (36 typed-text, 17 state-change) |
| of which held on a question | 3 | 6 |
| Held cases to extend (no new question) | 5 | 0 |
| New questions needed (after §6.0 checks a–h) | 2 | 2 |

**Neither suite has a single case with a long name that has no spaces, or a name with `" ' < >`.** In 1,010 case bodies (345 Bill
To, 665 Internal Work Orders), every case was scanned by script for "no spaces", "special character", `<`, `>`, and quotes inside a
name. There were no matches. The only `<`/`>` were `<unit>`-style placeholders in Bill To D-36 and D-40, and "Settings > Work Orders"
in Internal Work Orders. Ampersands occur only because the design's sample customers have them ("Valders Diesel & Fleet Repair",
"A & J Truck & Trailer Repair").

### The gaps that match the A/R and A/P pattern most closely

1. **IWO, report: the PRD states the layout, but the cases use only short, friendly names (L-21's SV-12764 shape).** PRD v1.3 S9-R2:
   *"work order numbers and dates stay on one line at 1440 and 1536 pixels wide."* S9-48 C1128859 and D-92 C1112409 test it with
   "customer A" and the standard categories. Customer, Category, Line and Original technician sit in the same row; a category can be
   60 characters (S1-R14), and the design already wraps "Company Vehicle Maintenance" onto three lines. Proposed: I-P25.
2. **Bill To, Customer chip panel on the asset Work Orders tab: the same list as SV-12722.** It is a multi-select list of customer
   names. D-56 C1062551 and S14-04 C1062422 use two ordinary names. No case puts a long name with no spaces in a row. Proposed: B-P21.
3. **Bill To, Service For column on the payer's Invoices tab, and Bill To column on the asset tab: the SV-12764 pattern.** In the
   design, the 35-character "Phillipsburg Truck & Trailer Repair" ends 12–14 px (picture) before Memo. D-47 C1062542 checks "stays on
   one line and does not overlap Memo" only with friendly names. Proposed: B-P15, and extend held D-67 C1062562.
4. **Columns that appear or disappear with the rows: the SV-12763 pattern.**
   - Bill To's Service For and Bill To columns show only when a row bills someone else, so the columns after them jump when the
     column comes or goes.
   - The Internal Work Orders work orders list resizes its columns to their content. The design draws headings moving by up to 214
     px when Classification leaves no rows.
   - The lines table moves 72–85 px when a line is marked No Charge.
   - Four questions: Q-BT-1, Q-BT-2, Q-IWO-1, Q-IWO-2.
5. **IWO: a 60-character category name is never shown where it is used.**
   - S1-61 C1111896 only proves the 61st character is refused.
   - The PRD's own helper says the name shows *"in the badge tooltip on the work order, on the NO CHARGE document and in the Internal
     Work Orders report."* No case puts a long name in any of those three places.
   - The NO CHARGE document carries a PRD layout sentence too: the stamp sits *"on the left and never over the logo"* (S3-R5).
   - Proposed: I-P12, I-P21a/b, I-P25.

### Stress data used by every proposal below

All three records go in the same list or table, so one setup covers each place. The tester creates them by hand with the product's
own New Customer, New Category, New Line or Edit Contact windows.

- **Long, with spaces:** `ZZAUTOTEST Northern Plains Heavy Truck and Trailer Repair Services` (66 characters)
- **Long, no spaces:** `ZZAUTOTESTNorthernPlainsHeavyTruckTrailerRepairServicesLtd` (58 characters). For a category, use 60
  characters, the PRD limit (S1-R14).
- **Special characters:** `ZZAUTOTEST A&B "Fleet" O'Neil <Parts> & Sons`

Neither PRD gives a length limit for customer, contact, line or user names. Each case says: "if the field stops before the end, use
the longest name it takes". Where the limit is shorter than the place's width, that is itself worth writing down.

### What every stress case checks

The expected result comes from the design picture of that place. For the look, Rule 126 makes the design the source where the PRD is
silent. Each case checks:

- the name stays inside its own row, cell, chip or window and never covers the next element;
- every column, button and control of the place is still visible;
- the name shows exactly as saved: `& " ' < >` are not changed or turned into codes.

Whether the name wraps or is shortened with "..." is left out (skill 07 §6.0 check g, behaviour first), unless the PRD or the design
says which. So no question is needed for the stress cases. Where the design itself cuts a name (Bill To card, BT-D06), the open
question 9 already covers it.

---

## Bill To

### B1. Places where typed text shows

| # | Text and place | Element | Cases found (all with ordinary names) | Verdict |
|---|---|---|---|---|
| T01 | Payer name on the customer page, "Bill Invoices To" line (S1-R1) | card line, Change link below | S1-01 C1061212, D-07 C1062502 | MISSING |
| T02 | Same line on a phone: name and Change on one line (V16) | card line | D-15 C1062510, D-51 C1062546 | MISSING |
| T03 | Bill Invoices To window: field value and list rows (S1-R4, S1-R5) | dialog field, menu rows | S1-02 C1061213, S1-03 C1061214, D-09 C1062504 | MISSING |
| T04 | New and Edit Customer: field, list rows, "[name typed so far] (this customer)" (S2-R1, S2-R4) | dialog field, menu rows | S2-04 C1061869, S2-05 C1062125, D-02 C1062497 to D-05 C1062500 | MISSING |
| T05 | Pays for window: title "[customer] pays for", bulleted links (S1-R9) | dialog title, list rows | S1-07 C1061218, S1-09 C1061220 (a long list, not long names), D-12 C1062507 | MISSING |
| T06 | Work order and part sale Customer card: Bill To value (S3-R2) | card field | S3-32 C1062292 (held q9; at least 30 characters, with spaces), D-19 C1062514 (more than 25 characters, with spaces and &), D-66 C1062561 (held q9) | PARTLY |
| T07 | Bill To list on the card (S3-R3) | menu rows (list 295 px, wider than the 215 px card) | S3-04 C1062266, D-17 C1062512 (held), D-18 C1062513 | MISSING |
| T08 | Customer card on a phone (design: "full name fits") | card field | S3-31 C1062291, D-24 C1062519 | MISSING |
| T09 | Authorizer list: contact name, customer name on a second line (S4-R2) | menu rows | S4-01 C1062293, S4-08 C1062300, D-20 C1062515 | MISSING |
| T10 | Deposit lock: M1 "…a [$amount] deposit from [customer]…" as tooltip and as toast | tooltip (one line, about 850 px), toast | S5-06 C1062306, S5-09 C1062309, D-28 C1062523, D-29 C1062524 | MISSING |
| T11 | Credit Hold: M2 "…The Bill To customer, [Bill To], is on Credit Hold" as banner, Create Invoice tooltip and toast | banner, tooltip, toast | S7-09 C1062343, S7-13 C1062347, D-32 C1062527 (asserts "The banner text stays on one line and nothing overlaps", ordinary name) | PARTLY |
| T12 | Payment refusals M3 and M5 "…billed to [customer]." | toast | S10-07 C1062386, S10-08 (held) | MISSING |
| T13 | Service For band: name in bold, "Unit [unit]", "[year] [make] [model]" (S8-R1 to S8-R6); modern, legacy, estimate, part sale, batch, PDF | printed document | S8-01 C1062359 to S8-12, D-36 C1062531 to D-46 | MISSING |
| T14 | Invoice Bill To block: name, address, phone and "(IBS#: [number])" after the name (S7-R1, S19-R3) | printed document | S7-01 C1062335, S19-01 C1062459 | MISSING |
| T15 | Payer's Invoices tab, "Service For" column (S10-R6) | table cell (12–14 px before Memo in the design) | S10-09 C1062387, D-47 C1062542 (asserts "The Service For text stays on one line and does not overlap Memo", ordinary names) | PARTLY |
| T16 | Sending invoice: Bill To contact rows, name and bold email (S9-R1) | dialog list rows | S9-01 C1062374, D-50 C1062545 | MISSING |
| T17 | Delete Customer window: D8 "…default Bill To for [names, comma separated]…" and bulleted links | dialog | S12-01 C1062400, S12-02 C1062401, D-52 C1062547 | MISSING |
| T18 | Remove as default Bill To: "Remove [customer] as the default Bill To for…" | dialog | S12-04 C1062403, S12-05 C1062404, D-53 C1062548 | MISSING |
| T19 | Work Order Log "Bill To changed": old → new name as links (S13-R2) | log row | S13-01 C1062413, D-25 C1062520 | MISSING |
| T20 | Asset tab Customer chip label "Customer: [name]" | chip | D-57 C1062552 (says the label is "cut with "..." when long", but sets up no long name), S14-05 C1062423 | PARTLY |
| T21 | Asset tab Customer chip panel rows (S14-R3) | multi-select list rows | S14-04 C1062422, D-56 C1062551 | MISSING (SV-12722 pattern) |
| T22 | Customer chip search results with more than 8 options (S14-R5) | list rows | S14-07 C1062425 | MISSING |
| T23 | Asset tab "Bill To" column (S14-R6) | table cell | S14-09 C1062427, D-59 C1062554, D-67 C1062562 (held q10: sideways scroll at 1440) | MISSING (SV-12764 pattern) |
| T24 | Invoice CSV export: "Customer" (the Bill To) and "Service Customer" (S19-R5, S19-R6) | export | S19-06 C1062464, S19-07 C1062465 | MISSING |
| T25 | Customer portal "Billed to [Bill To]" (S16-R2) | portal page | S16-02 C1062439 (held) | MISSING |
| T26 | QB Unexported reason Q1 "QuickBooks customer [name] is already linked…" | report row | S17-04 C1062449 | MISSING |

**Design statements that cases test only with friendly data.** The Bill To PRD has no wrap, cut or "one line" sentence; S1-R9's
"a long list scrolls inside the window" is about list length and is covered by S1-09 C1061220. The design's own look statements are
tested with ordinary names only:

- D-47 C1062542: Service For not over Memo
- D-32 C1062527: banner on one line
- D-57 C1062552: chip "..."
- D-55 C1062550 and D-58 C1062553: toolbar on one line, never with a long name picked in the chip

### B2. Screen state changes

| # | State change | Cases | Verdict | Design's pictures compared |
|---|---|---|---|---|
| C01 | New / Edit Customer: Bill Invoices To list opens, narrows, picks | D-02 C1062497, D-05 C1062500 (look of the list only) | MISSING | p1-02 → p1-03 → p1-04 → p1-05: the window's Save button keeps its bottom edge at y 725; p1-07 → p1-08 → p1-09 at y 1013. **No move.** |
| C02 | Address 2 shown with + and hidden with x (S2-R6, S2-R7) | S2-09 C1062255, S2-10 C1062256 (behaviour only) | MISSING | not drawn as a pair |
| C03 | Pays for counter appears or goes (S1-R7, S1-N4) | S1-06 C1061217, S1-14 C1061225, D-10 C1062505 (end state only) | MISSING | p1-12 → p1-16: **moves.** Contacts 62 → 48 px, Assets 148 → 107 px when the third counter appears. |
| C04 | Bill Invoices To line appears after a default is saved | D-07 C1062502 (end state) | MISSING | p1-11 → p1-12: counters pushed down about 56 px, the expected insert; nothing moves sideways |
| C05 | Work order card: Bill To list opens, searches, picks | D-17 C1062512, D-18 C1062513, D-19 C1062514 | MISSING | p2-02 → p2-03 → p2-06: card rows and the lines table headings are identical; the list floats over the table. **No move.** |
| C06 | Credit Hold banner shows | D-32 C1062527 | MISSING | p3-13 → p3-14: all 8 lines-table headings keep their x (334, 629, 725, 819, 928, 1004, 1069, 1142); the table drops 71 px; tabs identical. **No sideways move.** |
| C07a | Invoices tab: search narrows the rows; Service For stays | S10-11 C1062389 | COVERED (column stays) | — |
| C07b | Invoices tab: Service For column comes and goes with the rows; Open only switched | S10-10 C1062388 | MISSING | p5-01 → p5-02 (column added): **moves.** Date 314 → 295, Type 428 → 367, No. 595 → 506, Memo 687 → 741; Total, Balance, Status, Action stay. p5-05 → p5-06 the same. |
| C08 | Asset tab: Customer chip panel opens over the table | D-56 C1062551 | MISSING | p7-02 → p7-03: every visible heading keeps its x. **No move.** |
| C09 | Asset tab: a customer picked in the chip; Bill To column may come or go (S14-R4, S14-R6) | D-57 C1062552, S14-05 C1062423 | MISSING | p7-03 → p7-04 / p7-05: **moves.** The chip widens 17 px to the left; Search 679 → 662, Status 787 → 770; headings unchanged on that asset. Bill To column absent (p7-02) or present (p7-10, a different asset): Asset 606 → 683, Unit 670 → 814, VIN 716 → 859, Progress 801 → 1014; the last columns run off the right edge. |
| C10 | Asset tab: Status includes Imported, Customer chip disabled and cleared (S14-N1) | S14-12 C1062430 | MISSING | not drawn |
| C11 | Asset tab: the payer's row is on a later page (more rows) | S14-13 C1062431 (held) | MISSING | not drawn |
| C12 | Asset tab: sorted by a column | none | MISSING | not drawn |
| C14 | Printed document with and without the Service For band | S8-13 C1062371 (address row keeps the same blocks in the same places) | COVERED | p4 pairs: content below the band moves down about 50 px, the drawn insert (V36) |
| C15 | Delete Customer → Remove as default → back to Confirmation | D-52 C1062547, D-53 C1062548, D-54 C1062549 | COVERED | stacked windows, each checked |
| C17 | Sending invoice: loading state, then the Bill To contacts (S9-R5) | S9-06 (held, no id) | MISSING | not drawn |

**Bill To design moves to report** (findings, not cases to write):

1. **Pays for counter (C03).** When it appears, the Contacts and Assets counters re-space by 14 and 41 px. This is consistent with
   S1-R7 "beside Contacts and Assets"; D-10 C1062505 already checks the end state.
2. **Service For column (C07b).** Inserting it moves the first four headings by 19–89 px. Whether it shows is decided by the rows
   (S10-N1), so on a live tab the columns jump between a payer with and without such rows.
3. **Customer chip (C09).** A picked customer widens the chip and pushes Search and Status 17 px left.
4. **Asset tab Bill To column.** Two assets, one with the column and one without, place every later heading 77–213 px apart. The
   design itself notes the last columns run off at 1440 (held q10).

### B3. Proposed cases: Bill To

All are runnable by hand unless noted. "Picture" means the design picture to attach under "References from Design". Every
typed-text case sets up the three stress names from the Summary.

**Typed text (24 new):**

| Id | Title | Expected backed by | Set up by hand? |
|---|---|---|---|
| B-P01 | Design: Long and unusual payer names fit the Bill Invoices To line on the card | S1-R1 *"the customer page left card shows "Bill Invoices To" with the payer's name."* + picture bt-p1-12 (name under the label, Change on its own line, counters below) | yes |
| B-P02 | Design: A long payer name on the phone customer page keeps Change visible | S1-R2 *"Users who may set the default see "Change" beside the name"* + picture bt-p1-26 | yes (phone or 390 px window) |
| B-P03 | Design: Long and unusual names stay in their rows in the Bill Invoices To window | S1-R5 *"The field's first option is "[customer] (this customer)""* + pictures bt-p1-13, bt-p1-14 | yes |
| B-P04 | Design: A long typed name keeps the (this customer) row inside the list | S2-R4 *"In New Customer, the first option reads "[name typed so far] (this customer)""* + picture bt-p1-03 | yes |
| B-P05 | Design: Pays for window with long names keeps its title, links and Close inside | S1-R9 *"opens a window titled "[customer] pays for", listing each customer A to Z as a link"*, S1-R10 *"a "Close" button"* + picture bt-p1-18 | yes |
| B-P07 | Design: Long and unusual names stay in their rows in the work order Bill To list | S3-R3 *"the first option is always "[customer] (this customer)"."* + picture bt-p2-03 | yes |
| B-P08 | Design: A long payer name shows in full on the phone Customer card | design register BT-D06 note *"On the phone and on the invoiced (read-only) card the whole name shows."* + picture bt-p2-21 | yes |
| B-P09 | Design: Long contact and payer names stay in their Authorizer list rows | S4-R2 *"Each contact shows its customer's name on a second line."* + pictures bt-p2-10, bt-p2-11 | yes |
| B-P10 | Design: Deposit tooltip and toast show a long customer name inside the window | §8 M1 *"This work order has a [$amount] deposit from [customer]. Reverse it, change the Bill To, then take the deposit again under the new Bill To."* + pictures bt-p3-07, bt-p3-08 | yes (deposit taken by hand) |
| B-P11 | Design: Credit Hold banner with a long payer name keeps Change Bill To visible | §8 M2 *"Cannot invoice. The Bill To customer, [Bill To], is on Credit Hold"* + S7-R6 *"with a "Change Bill To" button"* + picture bt-p3-14. Does not repeat D-32's "one line", which cannot hold for a 58-character name with no spaces. | yes |
| B-P12 | Design: Payment refusal toasts show a long customer name in full | §8 M3 *"This payment can only be applied to invoices billed to [customer]."* (no picture: NOT SHOWN, BT-N13) | yes |
| B-P13a | Design: Service For band with long names stays inside the band on the modern invoice | S8-R1 *"A full-width band prints directly under the address row, reading "SERVICE FOR", then the customer's name in bold."*, S8-R2, S8-R7 *"The band leaves the address row free for a future Ship To block."* + picture bt-p4-02. Screen, Print and PDF. | yes |
| B-P13b | Design: Service For band with long names stays inside the band on the legacy invoice | same quotes + picture bt-p4-04 | yes |
| B-P14 | Design: Invoice Bill To block prints a long payer name with its IBS number | S7-R1 *"The invoice's Bill To block prints the Bill To's name, address and phone"*, S19-R3 *"the "(IBS#: [number])" after the Bill To's name"* | yes (IBS account by hand) |
| B-P15 | Design: Long Service For names never cover Memo on the payer's Invoices tab | S10-R6 *"The Bill To's Invoices tab shows a "Service For" column naming the customer the work was for."* + picture bt-p5-02 (every column visible, text ends before Memo). At 1440 and 1536. | yes |
| B-P16 | Design: Long contact names stay in their rows in Sending invoice | S9-R1 *"The send window lists the Bill To's contacts."* + picture bt-p5-12 | yes |
| B-P17 | Design: Delete Customer window lists long dependent names inside the window | §8 D8 *"This customer is the default Bill To for [names, comma separated]. Remove it from [that customer / those customers] first."* + picture bt-p6-05 | yes |
| B-P18 | Design: Remove as default question with a long name keeps Remove and Cancel visible | §8 D8 *"Remove [customer] as the default Bill To for [N] [customer / customers]? Open work orders keep their Bill To."* + picture bt-p6-06 | yes |
| B-P19 | Design: Work Order Log shows long Bill To names inside the Details cell | S13-R2 *"The entry shows "Bill To" with the old and new customer, each as a link."* + picture bt-p2-15 | yes |
| B-P20 | Design: Customer chip with a long name is shortened and keeps the toolbar on one line | S14-R2 *"A "Customer" filter chip sits beside Status"* + picture bt-p7-05 (chip "Customer: Quartzsite Truc...") + bt-p7-07 (toolbar one line at 1600) | yes |
| B-P21 | Design: Long and unusual names stay in their own rows in the Customer chip panel | S14-R3 *"Its options are every customer on the asset's work orders, as customer or Bill To, A to Z."* + picture bt-p7-03 | yes |
| B-P22 | Design: Customer chip search shows long names in their own rows | S14-R5 *"With more than 8 options, the chip offers search ("Search customers")."* + picture bt-p7-03 for the row look (the search panel is not drawn) | yes (9 customers) |
| B-P24 | Invoice CSV export keeps long and unusual names whole in their cells | S19-R5 *"In the invoice CSV export, "Customer" is the Bill To"*, S19-R6 *"The export's last column, "Service Customer", names the customer the work was for when someone else is billed."* | yes (open the CSV in a spreadsheet) |
| B-P26 | Design: QB Unexported shows a long QuickBooks customer name in its reason | §8 Q1 *"QuickBooks customer [name] is already linked to another ShopView customer."* | only with a QuickBooks sandbox company |

**Held cases to extend with the no-space and special-character names when their question is answered** (no new question):

- T06: S3-32 C1062292 and D-66 C1062561 (question 9)
- T23: D-67 C1062562 (question 10)
- T25: S16-02 C1062439
- C11: S14-13 C1062431
- C17: the held S9-06

**State changes (10 new, 3 of them held):**

| Id | Title | Expected backed by | Set up by hand? |
|---|---|---|---|
| B-S01 | Design: Opening the Bill Invoices To list leaves the New Customer fields in place | pictures bt-p1-02 → bt-p1-05 (Save fixed at its place) | yes |
| B-S02 | Design: Showing Address 2 moves only the fields below it | S2-R6 *"An empty Address 2 is hidden; a + button beside Address 1 (tooltip "Add Address 2") shows it."* + pictures bt-p1-02, bt-p1-07 | yes |
| B-S04 | Design: Saving a default adds the Bill Invoices To line without moving the card's other lines | S1-R1 + pictures bt-p1-11 → bt-p1-12 | yes |
| B-S05 | Design: Opening the Bill To list leaves the card and the lines table in place | pictures bt-p2-02 → bt-p2-03 → bt-p2-06 | yes |
| B-S06 | Design: Lines table headings keep their place when the Credit Hold banner shows | S7-R6 + pictures bt-p3-13 → bt-p3-14 | yes (Credit Hold term by hand) |
| B-S08 | Design: Opening the Customer chip panel leaves the table headings in place | pictures bt-p7-02 → bt-p7-03 | yes |
| B-S12 | Design: Sorting the asset Work Orders tab keeps the Bill To column and its place | S14-R6 *"A "Bill To" column shows when at least one row bills someone else"* (a sort changes no row) | yes |
| B-S07b | Design: Service For column keeps its place when Open only is switched | **held, Q-BT-1** | yes |
| B-S09 | Design: Picking a customer in the chip keeps the table headings in place | **held, Q-BT-2** | yes |
| B-S10 | Design: Choosing Imported in Status keeps the table headings in place | **held, Q-BT-2** | yes (an imported work order is needed; if the account has none, mark it as setup the tester cannot do) |

C03 has no case: the move is drawn by the design and agrees with S1-R7. It is reported above as a finding.

### B4. Questions for Chris Ward (Bill To)

Each passed the eight pre-send checks of skill 07 §6.0. Rule 131 applies: add them at the bottom of the existing Bill To sheet, in a
new colour.

- **Q-BT-1 (C07b): Should the Service For column stay when Open only is switched off or on?**
  - Why it matters: the column decides where Date, Type, No. and Memo sit. The design moves them 19–89 px when it appears.
  - What the PRD says: S10-N1 *"The "Service For" column is hidden when no row on the tab, before any search, is billed for someone
    else."* It names search but not the Open only switch.
  - Checks:
    - a: no precedence statement covers it
    - b: no source backs either answer
    - c: the design draws one Open only state (bt-p5-04)
    - d: no library rule covers it
    - e: testable
    - f: PO-owned
    - g: the behaviour itself is unsettled
  - **Recommendation:** "decided once from every row of the tab, whatever Open only shows". It mirrors the search rule and keeps the
    columns still.
- **Q-BT-2 (C09, C10): On the asset Work Orders tab, does the Bill To column stay when the Customer or Status filter leaves only
  self-billed rows?**
  - Why it matters: S14-R6 *"A "Bill To" column shows when at least one row bills someone else"* does not say before or after
    filtering. If it follows the filtered rows, every later column jumps about 150 px.
  - Checks a–g: none settles it. The design draws no filtered state with the column.
  - **Recommendation:** decide it from the unfiltered list, as S10-N1 does for Service For.

---

## Internal Work Orders

### I1. Places where typed text shows

| # | Text and place | Element | Cases found (all with ordinary names) | Verdict |
|---|---|---|---|---|
| T01 | Turn-on window: customer picker, up to 50 chips with a remove control (S1-R2) | dialog chips, options | S1-02 C1111834, D-02 C1112320, S1-90 C1112417 (50 chips, checks the 51st refusal only) | MISSING |
| T02 | Make internal window: "[n] open work orders for [customer] are billable…", rows "number, location, unit, status" (S1-R11) | dialog title/body, list rows | S1-27 C1111862, S1-28 C1111863, D-15 C1112333 | MISSING |
| T03 | Remove the Internal flag window: "Remove the Internal flag from [customer]?" (S1-R12) | dialog title/body | S1-23 C1111858, D-16 C1112334 | MISSING |
| T04 | Customers list: name with the "Internal" badge right after it (S1-R8) | table cell + badge | D-11 C1112329 | MISSING |
| T05 | Customer page header: name + badge | page header + badge | D-12 C1112330 | MISSING |
| T06 | Customers list mobile card: name + badge | card + badge | S1-18 C1111853 | MISSING |
| T07 | Categories page tables: Category (+ "Default" badge), Internal customers, QuickBooks expense account (S1-R13) | table cells | D-06 C1112324, D-07 C1112325 | MISSING |
| T08 | Category window Name, 60 characters (S1-R14) | dialog field | S1-61 C1111896 (refuses the 61st; never looks at where the name shows) | PARTLY |
| T09 | "[name] (archived)" with its hint; Show archived list (S1-R16) | select value, list rows | S1-69 C1111904, S1-51 C1111886 | MISSING |
| T10 | Edit Customer "Default internal category"; Edit Asset "Internal category" with "[customer's default]" in its helper (S1-R7, S1-R15) | dialog selects | D-13 C1112331, D-17 C1112335 | MISSING |
| T11 | QuickBooks ShopView Accounts: one row per category; "Not set. Parts cost of [category] work orders…" (S5-R4) | settings rows | D-18 C1112336, D-19 C1112337, S5-01 C1112074 | MISSING |
| T12 | New Work Order: customer name + Internal badge + tooltip "Internal customer: no prices, no invoice. Posts to [category], from the asset." (S2-R1) | field + badge + tooltip | D-21 C1112339, D-22 C1112340 | MISSING |
| T13 | No Charge selects: Category; Original work order (number, date and first line); Original line (number, title, technician); "Original technician: [names]" (S2-R2) | dialog selects, menu rows | D-23 C1112341, D-24 C1112342, D-54 C1112371, D-57 C1112374, D-61 C1112378, S2-15 C1111928 | MISSING |
| T14 | Mark this line window: line summary (hours · title × qty · technician · price) | dialog line | D-67 C1112384 | MISSING |
| T15 | Work orders list: customer name with the badge after it (design), Status column badge (PRD) | table cell + badge | D-25 C1112343 (status words only; ordinary names) | MISSING |
| T16 | Board card, Schedule card, Tech View, global search: badge next to number or status, with the customer name | cards | D-78 C1112395, D-79 C1112396, D-80 C1112397, S2-70 C1111984 | MISSING |
| T17 | Chip "No Charge · [category]" next to the line title: lines table, Tech View, mobile, Print Work Order (S12-R3, S12-E8) | chip in a table row | D-68 C1112385, S12-43 C1112252 | MISSING |
| T18 | Close and Create invoice windows: "Moved from [account] to [account]", "Posted to [account]", "[Category] requires the original work order…", "No account set for [category]…" (S3-R2, S3-N4) | dialog rows | D-38 C1112356, D-39 C1112357, D-60 C1112377, D-61 C1112378, S3-40 C1112049 | MISSING |
| T19 | Cost move window: "The vendor bill for [part] ($[amount]) was posted to [account]…" (S2-R8) | dialog | D-36 C1112354, D-93 C1128863 | MISSING |
| T20 | Notes and Audit Log: "Category [name]", "Line '[title]' marked No Charge by [user]…" (S2-R18, S12-R6) | note rows | D-58 C1112375, D-59 C1112376, D-70 C1112387 | MISSING |
| T21 | INTERNAL / NO CHARGE document (screen, PDF, Print, Email): stamp "Category: [name] · Original work order [number]", Bill to block, asset block, line titles (S3-R5) | printed document | D-45 C1112362, D-62 C1112379, D-64 C1112381, D-88 C1112405 (held) | MISSING (PRD layout sentence, see below) |
| T22 | Portal no-charge estimate: stamp and category line | portal page | D-65 C1112382 | MISSING |
| T23 | Invoice with a no-charge line: "[Category]" under the line title | document | D-72 C1112389 | MISSING |
| T24 | Refusal "Line '[title]' needs its original work order (or Not in ShopView) before…" (S12-R9) | toast | S12-18 C1112228 | MISSING |
| T25 | Internal Work Orders report table: Line, Customer, Category, Original technician (S9-R2) | table cells | S9-10 C1112163, S9-48 C1128859, D-74 C1112391, D-92 C1112409 (the one-line sentence, ordinary names) | PARTLY (closest A/R match) |
| T26 | Report summary strip: one card per category (S9-R2) | cards | S9-11 C1112164 | MISSING |
| T27 | Report filters: Category (archived under a heading), Original technician (S9-R2) | menu rows | S9-08 C1112161, S9-13 C1112166 | MISSING |
| T28 | By technician tab: technician name rows (S9-R2) | table cells | S9-16 C1112169, D-75 C1112392 | MISSING |
| T29 | Report PDF and CSV export | export | S9-19 C1112172 | MISSING |
| T30 | Customer Invoice export: Category column; category in the description of a no-charge line (S9-R6, S9-R13) | export | S9-33 C1112186, S9-35 C1112188 | MISSING |
| T31 | AccountingHub: Held reason "No Charge: [Category] row not mapped", closed record, Sales Invoices (S8-R3, S8-N2) | hub table rows, definition list | D-82 C1112399, D-83 C1112400, D-84 C1112401, D-85 C1112402 | MISSING |
| T32 | QB Unexported: journal entry row with the badge | report row | D-81 C1112398 | MISSING |
| T33 | Asset Invoices tab: customer and badge (S9-R10) | table cell | D-50 C1112367 | MISSING |

**PRD sentences that state the layout, while our cases use only friendly data** (step 5; the closest match to the A/R miss):

1. **S9-R2:** *"work order numbers and dates stay on one line at 1440 and 1536 pixels wide."* S9-48 C1128859 and D-92 C1112409 use "customer
   A" and the standard categories. The report's columns size to their content, and the design wraps Customer ("Staging Heavy Duty
   Fleet", three lines) and Category ("Company Vehicle Maintenance", three lines). A 60-character category with no spaces is the case
   most likely to break the one-line rule.
2. **S3-R5:** *"under the masthead line, on the left and never over the logo, the INTERNAL or NO CHARGE stamp with the line "Category:
   [name]""*. D-45 C1112362 and D-62 C1112379 use General Internal and Warranty.
3. **S1-R14:** *"60 characters; helper "It shows in the badge tooltip on the work order, on the NO CHARGE document and in the Internal Work
   Orders report.""* No case puts a 60-character name in any of the three places it names.
4. **S1-R2:** *"each shown as a chip with a remove control; up to 50"*. S1-90 C1112417 builds 50 chips but checks only the 51st refusal, never
   that the chips, Save and "Do this later" stay visible.

### I2. Screen state changes

| # | State change | Cases | Verdict | Design's pictures compared |
|---|---|---|---|---|
| C01 | Settings: Internal Work Orders turned on (hint line appears) | D-03 C1112321, D-05 C1112323 | MISSING | flow0-01 → flow0-03 (v13): only the inserted hint and the rows below it change (an insert). flow0-03 v13 and flow0-09 v13 are pixel-identical (known IWO-D03). |
| C02 | Turn-on window: chips added | D-02 C1112320 | MISSING | one state drawn |
| C03 | Categories page: Internal ↔ No Charge tab | D-06 C1112324, D-07 C1112325 | MISSING | flow0-04 → flow0-05: title, tabs and the four column headings keep their x (292, 541, 842, 1070). The New button's left edge goes 1010 → 990 (longer label, right edge fixed). **No move.** |
| C04 | Categories: Show archived (n) opens the archived rows | S1-51 C1111886 | MISSING | not drawn |
| C05 | Edit Customer: ticking Internal customer adds the select | D-13 C1112331 | MISSING | not drawn as a pair |
| C06 | New Work Order: No Charge ticked, then an original picked | D-20 C1112338, D-23 C1112341, D-24 C1112342 | MISSING | flow1-02 → flow1-07: identical above y 352; the window grows down, Save's bottom edge 442 → 816 (an insert). **No move above the insert.** |
| C07 | Work orders list: Classification changed, including no results | D-26 C1112344, D-27 C1112345, D-28 C1112346 | MISSING | flow4-01 (All) → flow4-02 (Internal): headings move 1–4 px. → flow4-03 (no results): **moves.** Customer 340 → 379, Unit # 675 → 569, Asset 797 → 711, Lead Technician 1064 → 850, Lines 1245 → 1122, Total price 1328 → 1259. Toolbar: Search 510 → 476 when the chip reads "Classification: Internal". |
| C08 | Work orders list: All tab with Status Closed | D-29 C1112347 | MISSING | flow4-01 → flow1-23: **moves.** Unit # +12, Asset −9, Lead Technician heading −42; Search 510 → 454 |
| C09 | A line marked No Charge (and back) | D-68 C1112385, D-69 C1112386 | MISSING | flow6-01 → flow6-03 (same work order S2-34918): **moves.** The three-dots column is gone at rest, and Actual/Estimate 709 → 794, Status 833 → 918, Rate 1029 → 1105, Total 1142 → 1214. S12-R5 and flow6-04 still give the no-charge line a menu. |
| C10 | Work order converted to No Charge (and back to Billable) | D-55 C1112372, D-56 C1112373 | MISSING | flow2-01 → flow2-05 (same lines, "Replace turbo actuator"): **moves.** The Rate heading moves about 52 px left; Total stays; Rate and Total cells blank (crop `iwo-lines-headers.png` in the scratchpad, rows 1–2) |
| C11 | Close → Closed; Reopen → Complete | D-45 C1112362, D-48 C1112365, D-49 C1112366 | MISSING | header swaps button for the "Closed on…" line; not compared |
| C12 | Report: By work order and line ↔ By technician | D-74 C1112391, D-75 C1112392 | MISSING | flow4-05 → flow4-06: above the table, only the two tab pills differ (1,288 pixels, box x 277–541, y 372–385); filters, cards and title identical. **No move.** |
| C13 | Report: a filter changed (cards and rows change) | S9-08 C1112161 to S9-13 C1112166 | MISSING | one filter state drawn |
| C14 | Report: more rows (scroll or next page; totals row for the whole range) | S9-15 C1112168 | MISSING | not drawn; library L18 *"Tables in the product scroll."* |
| C15 | Technician Efficiency chip: Hide / Only internal / Show all | D-73 C1112390 | MISSING | one state drawn |
| C16 | Line and work-order three-dots menus open over the table | D-66 C1112383, D-51 C1112368 | MISSING | flow6-01: the menu floats over the rows |
| C17 | Setting off: categories page notice, tables greyed | D-10 C1112328 | MISSING | not compared |

**IWO design moves to report:**

1. **Work orders list (C07, C08).** The columns size to their content. The library fixes only On Site (56 px) and Status (120 px):
   `w: c.key === 'onsite' ? 56 : c.key === 'status' ? 120 : undefined`. So headings jump with every filter or tab change, by up to
   214 px when no row is left. The list is a production component reused here, which is L-21 point 3: test a reused part at its
   edges.
2. **Mark as No Charge (C09).** The three-dots column disappears in the after picture, and four headings move 72–85 px. This
   contradicts the PRD's own menu for no-charge lines (S12-R5) and the next picture (flow6-04).
3. **Convert to No Charge (C10).** Rate moves about 52 px.
4. **Report.** It does not move between tabs. Its cells wrap inside content-sized columns, which is the root of the S9-R2 risk above.

### I3. Proposed cases: Internal Work Orders

Every typed-text case uses the three stress names from the Summary. For a category, use the 60-character version without spaces.

**Typed text (36 new):**

| Id | Title | Expected backed by | Set up by hand? |
|---|---|---|---|
| I-P01 | Design: Long and unusual customer names stay inside their chips in the turn-on window | S1-R2 *"several customers can be picked, each shown as a chip with a remove control; up to 50"* + picture iwo-flow0-02 | needs an organization where the setting was never turned on (as S1-02) |
| I-P02 | Design: Make internal window with a long customer name keeps both buttons visible | S1-R11 *"a dialog reads "[n] open work orders for [customer] are billable. Make them internal?…""* + picture iwo-flow0-13 | yes |
| I-P03 | Design: Remove the Internal flag window with a long name stays readable | S1-R12 *"opens the dialog "Remove the Internal flag from [customer]?""* + picture iwo-flow0-14 | yes |
| I-P04 | Design: Internal badge stays beside a long customer name in the Customers list | S1-R8 *"a flagged customer shows an "Internal" badge next to its name in the customer header, in the customers list and on the customers list mobile card."* + picture iwo-flow0-10 | yes |
| I-P05 | Design: Internal badge stays visible beside a long name in the customer header | same quote + picture iwo-flow0-11 | yes |
| I-P06 | Design: Internal badge stays visible on the mobile customer card with a long name | same quote (no picture of this card) | yes (phone) |
| I-P07 | Design: Long category and customer names stay inside the categories table | S1-R13 columns + S1-R14 *"60 characters"* + pictures iwo-flow0-04, iwo-flow0-05 | yes (QuickBooks account column only with QuickBooks) |
| I-P09 | Design: A long archived category reads in full with (archived) | S1-R16 *"shown as "[name] (archived)" with the hint"* | yes |
| I-P10a | Design: A long category fits the Default internal category select on Edit Customer | S1-R7 *"the select "Default internal category" appears under it"* + picture iwo-flow0-17 | yes |
| I-P10b | Design: A long category fits the Internal category select on Edit Asset | S1-R15 + picture iwo-flow0-18 | yes |
| I-P11 | Design: Long category names keep their own rows in QuickBooks ShopView Accounts | S5-R4 *"Not set. Parts cost of [category] work orders posts to the ShopView Review account until you…"* + picture iwo-flow0-15 | only with a QuickBooks-connected location |
| I-P12 | Design: New Work Order tooltip with a long category stays readable | S2-R1 *"the tooltip reads "Internal customer: no prices, no invoice. Posts to [category], from the asset.""* + picture iwo-flow1-04 | yes |
| I-P13a | Design: Long categories and line titles fit the No Charge selects in New Work Order | S2-R2 *"the select "Original work order" appears under it (… each as number, date and first line …)"* and *"the optional select "Original line" lists its lines (number, title, technician)"* + picture iwo-flow1-07 | yes |
| I-P13b | Design: Long names fit the selects of Convert to No Charge and Change category | S2-R5, S2-R6 + pictures iwo-flow2-04, iwo-flow2-07 | yes |
| I-P14 | Design: Mark this line window shows a long line title and technician inside the window | S12-R2 + picture iwo-flow6-02 | yes (technician name: a user, made in Settings > Users) |
| I-P15 | Design: Work orders list keeps every column visible with a long customer name and badge | S2-R10 *"The work orders list shows the badge in the status column"* + picture iwo-flow4-01 + library `status ? 120` (at 1440 and 1536) | yes |
| I-P16 | Design: Board card keeps the badge with a long customer name (split for Schedule card, Tech View) | S2-R10 *"Board cards show the badge"*, *"Schedule cards show the badge next to the work order number"* + pictures iwo-flow4-10, -11, -09 | yes |
| I-P17a | Design: A long category in the No Charge chip keeps the line's columns in place | S12-R3 *"A no-charge line shows the chip "No Charge · [category]" next to its title on the lines table, in Tech View and on mobile"* + picture iwo-flow6-03 | yes |
| I-P17b | Print Work Order prints a long No Charge chip beside its line | S12-E8 *"Print Work Order prints the "No Charge · [category]" chip next to the line."* | yes |
| I-P18 | Design: Close window rows with long category and account names stay inside the window | S3-R2, S3-N4 *"No account set for [category]. The entry posts to the ShopView Review account until you set one."* + pictures iwo-flow1-16, -17 | category yes; account names need QuickBooks |
| I-P19 | Design: Cost move window with a long part name keeps Cancel and Continue visible | S2-R8 *"The vendor bill for [part] ($[amount]) was posted to [account]."* + picture iwo-flow1-05 | yes, if the location has an accounting integration |
| I-P20 | Design: System notes with a long category and line title wrap inside the note | S12-R6 *"Line '[title]' marked No Charge by [user]. Category [name], original work order [number], original line [number]."* + picture iwo-flow6-05 | yes |
| I-P21a | Design: NO CHARGE document keeps a long category line on the left, clear of the logo | S3-R5 *"under the masthead line, on the left and never over the logo, the INTERNAL or NO CHARGE stamp with the line "Category: [name]""* + picture iwo-flow2-12; screen, PDF and Print | yes |
| I-P21b | Design: INTERNAL document keeps a long category line on the left, clear of the logo | same quote + picture iwo-flow1-22 | yes |
| I-P22 | Design: Portal no-charge estimate shows a long category line inside the page | S2-R4 *"the line "Category: [Category]" under the stamp"* + picture iwo-flow2-15 | needs a portal contact login |
| I-P23 | Design: Invoice shows a long category under the no-charge line title | §8 *"[Category]" under the line title; the line at $0.00* + picture iwo-flow6-07 | yes |
| I-P24 | Design: Original work order refusal with a long line title stays readable | S12-R9 *"the message "Line '[title]' needs its original work order (or Not in ShopView) before…"* | yes |
| I-P25 | Report keeps work order numbers and dates on one line with long names | S9-R2 *"work order numbers and dates stay on one line at 1440 and 1536 pixels wide."* and *"an empty cell shows a dash"*, with long Customer, 60-character Category, Line title and technician | yes |
| I-P26 | Design: Report summary cards with long category names stay readable | S9-R2 *"a summary strip shows one card per category in the range"* + picture iwo-flow4-05 | yes |
| I-P27 | Design: Report Category and Original technician filters show long names in their rows | S9-R2 *"Category (All or one, archived under a heading), Original technician (All or one)"* | yes |
| I-P28 | Design: Long technician names stay in their rows on the By technician tab | S9-R2 *"By technician", one row per technician* + picture iwo-flow4-06 | yes (users) |
| I-P29 | Report PDF and CSV keep long and unusual names whole | S9-R2 export as in S9-19 C1112172 | yes |
| I-P30 | Customer Invoice export keeps a long category with quotes and commas in one cell | S9-R6 *"the file adds the columns Classification (Billable, Internal, No Charge) and Category"*, S9-R13 | yes |
| I-P31 | Design: AccountingHub Held reason with a long category stays in its row | S8-N2 *"No Charge: [Category] row not mapped"* + picture iwo-flow5-04 | needs AccountingHub |
| I-P32 | Design: QB Unexported row with a long customer name keeps the Internal badge | picture iwo-flow5-01 | needs QuickBooks |
| I-P33 | Design: Asset Invoices tab keeps a long customer name and the badge in place | S9-R10 *"The asset's Invoices tab lists the closed internal and no-charge work orders with the badge"* + picture iwo-flow1-24 | yes |

**State changes (17 new, 6 of them held):**

| Id | Title | Expected backed by | Set up by hand? |
|---|---|---|---|
| I-S01 | Design: Turning Internal Work Orders on adds the hint without moving the toggles above | pictures iwo-flow0-01 → iwo-flow0-03 (v13) | yes |
| I-S02 | Design: Adding customers in the turn-on window keeps Save and Do this later in place | S1-R2 + picture iwo-flow0-02 | needs a fresh organization |
| I-S03 | Design: Switching category tabs keeps the title, tabs and columns in place | pictures iwo-flow0-04 → iwo-flow0-05 | yes |
| I-S04 | Design: Show archived adds the archived rows without moving the columns | S1-R13 *"a "Show archived (n)" link lists them with Restore"* + the fixed columns of iwo-flow0-04 | yes |
| I-S05 | Design: Ticking Internal customer adds the select without moving the fields above | S1-R7 + picture iwo-flow0-17 | yes |
| I-S06 | Design: Ticking No Charge adds the category fields below without moving those above | S2-R2 + pictures iwo-flow1-02 → iwo-flow1-07 | yes |
| I-S11 | Design: Closing and reopening keeps the lines table headings in place | S3-R6, S4-R2 + pictures iwo-flow1-14, iwo-flow1-22, iwo-flow3-03 | yes |
| I-S12 | Design: Switching report tabs keeps the filters, cards and tabs in place | pictures iwo-flow4-05 → iwo-flow4-06 | yes |
| I-S13 | Design: Changing a report filter keeps the filters, tabs and table headings in place | S9-R2 filters + picture iwo-flow4-05 | yes |
| I-S16 | Design: Opening a three-dots menu leaves the table headings in place | picture iwo-flow6-01 | yes |
| I-S17 | Design: Turning the setting off keeps the categories table columns in place | picture iwo-flow0-08 | yes |
| I-S07 | Design: Work orders list columns keep their place when Classification changes | **held, Q-IWO-1** | yes |
| I-S08 | Design: Work orders list columns keep their place across tabs and Status Closed | **held, Q-IWO-1** | yes |
| I-S14 | Design: Report headings stay in place when more rows show | **held, Q-IWO-1** | yes (needs enough closed work orders to scroll) |
| I-S15 | Design: Technician Efficiency columns keep their place when the chip changes | **held, Q-IWO-1** | yes |
| I-S09 | Design: Lines table columns keep their place when a line is marked No Charge | **held, Q-IWO-2**. The menu itself is settled by S12-R5 *"Change category" and "Mark as Billable"* and can be checked now. | yes |
| I-S10 | Design: Lines table columns keep their place when the work order is converted | **held, Q-IWO-2** | yes |

### I4. Questions for Milos Vasic (Internal Work Orders)

Each passed the eight pre-send checks of skill 07 §6.0. Rule 131 applies: add them at the bottom of the existing sheet, in a new
colour.

- **Q-IWO-1 (C07, C08, C14, C15): Should the columns of the work orders list, and of the reports this feature touches, keep their
  place when a filter, a tab or the number of rows changes?**
  - What the design does: it draws headings moving by up to 214 px when Classification leaves no rows, and by 9–56 px for Status
    Closed.
  - Checks:
    - a: no precedence statement
    - b: no source backs "stay"
    - c: the PRD is silent, and the library sizes these columns to their content (only On Site and Status are fixed), so the library
      allows the move
    - d: the library line is code, not an always/never sentence
    - e: testable
    - f: PO-owned
    - g: the behaviour is the point
  - Why ask anyway: after A/R and A/P (SV-12763) the PO treats moving columns as a defect.
  - **Recommendation:** "keep their place". Otherwise the cases follow the library and the move is accepted.
- **Q-IWO-2 (C09, C10): When a line is marked No Charge, or the work order is converted, should the lines table columns stay where
  they were?**
  - What the design does: the three-dots column disappears in flow6-03, and the headings move 72–85 px (about 52 px on Convert).
  - What the PRD says: S12-R5 still gives the no-charge line a menu, and flow6-04 draws it.
  - Checks a–g: the PRD settles that the menu exists, but not where the columns sit. The design contradicts itself.
  - **Recommendation:** "columns and the menu column stay"; the flow6-03 picture is an artefact.

---

## Notes

- **No case was written or changed.**
- **New questions: 4** (Q-BT-1, Q-BT-2, Q-IWO-1, Q-IWO-2). They are drafts in this file only. Bill To question 11 was withdrawn on
  13 Nov 2026 by check (d); none of these repeats it.
- **The proposals are many because the gap is everywhere.** Neither suite has stress data anywhere.
  - Cheapest first pass: one shared setup per suite (the three names, created once) and the 6 A/R-pattern cases: B-P15, B-P21, B-P23
    (extending D-67), I-P25, I-P21a, I-P17a.
  - Then the rest.
  - Rule 122 (amended 16 Oct): the QA lead decides between a full pass and a named set before any update starts.

## Reading coverage

| File | Size | Lines read | How |
|---|---|---|---|
| build/LESSONS-REGISTER.md, row L-21 | — | line 29 (whole row) | read |
| build/skills/21-DESIGN-DRIVE-PROTOCOL.md §6d | — | 96–122 (all of §6d, lines 1–10) | read |
| build/skills/07-PO-QUESTIONS.md §6.0 | — | 252–300 | read |
| bill-to/sources/CONFLUENCE-1003585538-v0.5-2026-11-09.md (PRD v0.5) | 53,054 B, 1,050 lines | 1–1,050 (100%); blank lines and the per-story "Design:"/"Jira:" link lines hidden from view | read |
| bill-to/design-2026-11-09/DESIGN-VISUAL-INVENTORY.md | 17,496 B, 141 lines | 1–141, each line up to 600 characters | read |
| bill-to/design-2026-11-09/DESIGN-TEXT-INVENTORY.md | 268,763 B, 1,682 lines | grep only (cut, ellipsis, wrap) | grep |
| bill-to/DESIGN-DIVERGENCE-REGISTER.json | — | grep (wrap, overlap, cut, ellipsis) | grep |
| bill-to/authoring/proposals.json | 1,039,047 B, 345 cases | 100% scanned by script. Case bodies read (preconditions, steps, results up to the quotes): S3-32, D-66, D-57, D-47, S1-09, S10-11, S14-09, D-56, D-59, D-10, D-32, D-12, D-52 | script + read |
| bill-to/testrail-id-map.csv | 48,864 B, 335 lines | 100% | script |
| bill-to/design-2026-11-09/images | 126 pictures | 126 sized. 8 viewed (p1-03, p2-03, p3-14, p5-01, p5-02, p7-03, p7-05, p7-10). 41 measured by script (p1-02 to -05, -07 to -09, -11, -12, -15, -16; p2-01 to -03, -06, -08; p3-13 to -16; p5-01 to -06, -09, -10; p7-01 to -05, -10) | view + script |
| internal-work-orders/sources/CONFLUENCE-942243841-v1.3-read-2026-11-12.md (PRD v1.3) | 185,670 B, 810 lines | 1–810 scanned by script twice (layout words; every bracketed value inside quoted text). Read in context: 202–220, 257–259, 263–264, 266, 270, 274, 278, 296, 322, 325, 334, 409, 491, 529, 533, 538, 549–596 (all Story 9 lines), 616, 691–698, 719, 765–800 | script + read |
| internal-work-orders/design-2026-11-12/DESIGN-VISUAL-INVENTORY.md | 33,785 B, 179 lines | 1–179, each line up to 420–500 characters | read |
| internal-work-orders/design-2026-11-12/v4-1794561577-f903/…/_ds_bundle.js | 12,180 lines | grep (ellipsis, nowrap, truncate) plus 5,570–5,582, 10,300–10,315, 10,505–10,520 | grep + read |
| internal-work-orders/design-2026-11-12/DESIGN-CHANGE-v1.3-2026-11-12.md | 151 lines | 146–151 (v4 is byte-identical to v3) | read |
| internal-work-orders/DESIGN-DIVERGENCE-REGISTER.json | — | grep (wrap, overlap, column moves) | grep |
| internal-work-orders/authoring/proposals.json | 3,018,984 B, 665 cases | 100% scanned by script. Case bodies read: S1-61, S9-48, D-92, D-25, D-11, D-06, D-68 | script + read |
| internal-work-orders/testrail-id-map.csv | 94,278 B, 644 lines | 100% | script |
| internal-work-orders/design-2026-11-12/images | 182 pictures | all names listed, 28 sized. 6 viewed (flow4-01, -02, -05, -06; flow6-01, -03) plus a crop of 5 lines-table headers. 20 measured by script (flow0-01, -03, -04, -05, -09; flow1-01, -02, -07, -08, -23; flow2-01, -05; flow4-01 to -03, -05, -06; flow6-01, -03; happy-38) | view + script |
| build/PO-QUESTIONS-OPEN.md | — | lines 8 and 10 | read |

**Not opened by this scan:**

- the two suites' Jira ticket files and sweeps
- the Internal Work Orders tech plan (842 KB)
- the earlier PRD versions
- DESIGN-CASE-PLAN.md
- the text inventories beyond grep

The task named the PRD, the inventories and the boards as the sources for this scan, so no claim of full coverage is made for these
files. A typed-text place mentioned only in a ticket or the tech plan would not appear above.

Scripts (scratchpad, not committed): `dump.py`, `stress.py`, `show.py`, `words.py`, `shift.py`. PIL ran under Python 3.13.
