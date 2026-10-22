# Design text inventory — A/R and A/P Report Sorting (22 Oct 2026)

Every on-screen text of the design canvas: the files (canvas.json, the 7 boards' titles, notes, badges, figure headings, alt texts and captions) and every word of the 43 screenshots (transcribed by viewing each picture: TRANSCRIPTS.md, screen_text.py). Each distinct text is one row, classified DATA / COVERED (case keys) / OUT-OF-SCOPE (reason) / SPEC-CONFLICT (question) / CASE-NEEDED. CASE-NEEDED rows found in this pass were written (D-50 to D-81) and are now COVERED. The design tool's own files (SKILL.md, index.html, reference/*.md, thumbnail.json) hold no ShopView screen text (DESIGN-READING-RECORD.md).

**Texts: 794** · COVERED: 248 · DATA: 478 · OUT-OF-SCOPE: 63 · SPEC-CONFLICT: 5 · **unclassified: 0**

| # | Text | Where | Class | Cases / note |
|---|---|---|---|---|
| 1 | $0.00 | I07; I35; I41 | SPEC-CONFLICT | D-78, D-68, S5-14 — in I35 the No locations empty state draws a Totals row of $0.00 (DD-03, question 13, drafted; PRD S5-R6a "no totals"); elsewhere an empty bucket's total in the Totals row (data) |
| 2 | Customer Full Name | I26 (before); I28 (after); I29 (after); I30 (after); I31 (before); I32 (after); +3 more | SPEC-CONFLICT | D-81, D-04, S6-01 — kept heading; PRD writes "Customer full name": DD-06, question 4 (sent 22 Oct 2026); A/P-style capitals elsewhere covered |
| 3 | Search vendor | I40 (after) | SPEC-CONFLICT | D-77, D-32, D-73, S5-29 — DD-02, question 12 (drafted); PRD S5-R13 "Search vendors" |
| 4 | Switch Location | I29 (after) | SPEC-CONFLICT | D-76, S7-03, D-39, D-64, S7-04, D-40 — DD-01, question 11 (drafted); PRD S7-R3 "Switch location" |
| 5 | × | I29 (after); I33 (after); I41 (after) | SPEC-CONFLICT | D-76, D-66, D-74 — In the switch-location dialog: DD-01, question 11 (not in PRD S7-R3's button list). In the Location chip, Customer tags and search box: native controls, DR-04 (covered by D-66, D-74). |
| 6 | "Clear selection" leaves no location chosen: the chip reads "Location: No locations" and stays visible, and the table shows the native empty state "No record… | Location.dc.html figure 38 caption | COVERED | S3-24, S5-14, S5-18, S6-03, D-19, D-20, D-21, D-22, +4 more — the design's own words, quoted under References from Design |
| 7 | "Select all" with "2 selected", every location in this report's own data named as in the top-right switcher, then "Clear selection". S5-R2, S5-R3, S5-R4, S5-… | Location.dc.html figure 36 caption | COVERED | S3-17, S5-02, S5-03, S5-05, S5-06, S5-07, S5-08, S5-09, +9 more — the design's own words, quoted under References from Design |
| 8 | "Switch location? This work order is in Staging Lethbridge - 4310. Switch your active location to view it?" on the report. Switch Location opens it there. S7… | Links.dc.html figure 32 caption | COVERED | S7-03, S7-04, D-39, D-40, D-64, D-76 — the design's own words, quoted under References from Design |
| 9 | "This report is too large for PDF. Export it as CSV, or narrow the filters, then try again." Exactly one message. CSV limit 50,000 rows. S3-N1, S3-N2, S3-N3. | Export.dc.html figure 5 caption | COVERED | DATA-18, DATA-19, DATA-20, DATA-21, D-38, D-55 — the design's own words, quoted under References from Design |
| 10 | "WorkOrder not found." and "Request failed with status code 400", then the user lands on the Work Orders list. | Links.dc.html figure 30 caption | COVERED | S5-26, S5-27 — the design's own words, quoted under References from Design |
| 11 | 1 selected | I34 (after) | COVERED | S5-07, D-67, S5-08 — the Location menu count |
| 12 | 1-30 Days | I01 (before); I06 (before); I03 (after); I08 (after); I04 (after); I07 (before); +7 more | COVERED | S2-02, S2-03, S2-05, S2-06, S3-18, S3-19, D-01, D-10, +4 more — used word for word in these cases' preconditions, steps or results |
| 13 | 1-30 days | I38 (after) | COVERED | S1-08, S1-09, S2-07, S2-08, S2-09, S2-10, S2-15, S2-16, +24 more — used word for word in these cases' preconditions, steps or results |
| 14 | 1-30 days past due | I02 (before); I05 (after); I11 (after); I34 (after) | COVERED | S1-08, S1-09, S2-07, S2-08, S2-09, S2-10, S2-15, S2-16, +8 more — used word for word in these cases' preconditions, steps or results |
| 15 | 1. Opening order and header sorting | Main.dc.html h2 | COVERED | S1-01, S1-02, S1-03, S1-04, S1-05, S1-06, S1-07, S1-08, +60 more — the design's own words, quoted under References from Design |
| 16 | 2 selected | I33 (after); I41 (after) | COVERED | S5-07, D-66, D-74, S5-08, D-29, D-30 — the Location and Customer menu count |
| 17 | 2. Export | Export.dc.html h2 | COVERED | S1-05, S1-06, S3-01, S3-02, S3-03, S3-04, S3-05, S3-06, +35 more — the design's own words, quoted under References from Design |
| 18 | 3. Collapse all, Expand all and pinned group rows | Grouped.dc.html h2 | COVERED | S2-25, S2-26, S2-27, S2-28, S4-01, S4-02, S4-03, S4-04, +24 more — the design's own words, quoted under References from Design |
| 19 | 31-60 Days | I01 (before); I06 (before); I03 (after); I08 (after); I04 (after); I07 (before); +7 more | COVERED | S2-02, S2-03, S2-05, S2-06, S3-18, S3-19, DATA-07, DATA-08, +6 more — used word for word in these cases' preconditions, steps or results |
| 20 | 31-60 days | I38 (after) | COVERED | S1-08, S1-09, S2-25, S2-27, S2-35, S3-09, S3-10, S3-11, +23 more — used word for word in these cases' preconditions, steps or results |
| 21 | 31-60 days and 91+ days ticked: the chip reads "Past due: 2 ranges" in blue. The Summary lists only customers with an amount in those ranges, at full balance… | Filters.dc.html figure 10 caption | COVERED | S2-35, S5-01, S5-22, S5-23, S5-30, S5-31, DATA-01, DATA-02, +16 more — the design's own words, quoted under References from Design |
| 22 | 31-60 days past due | I02 (before); I05 (after); I11 (after); I34 (after) | COVERED | S1-08, S1-09, S2-25, S2-27, S4-09, S4-11, D-52 — used word for word in these cases' preconditions, steps or results |
| 23 | 4. Location filter and Location column | Location.dc.html h2 | COVERED | S2-01, S2-04, S3-03, S3-04, S3-05, S3-06, S3-07, S3-08, +57 more — the design's own words, quoted under References from Design |
| 24 | 5. Document links and Switch location (SV-5706) | Links.dc.html h2 | COVERED | S5-26, S5-27, S5-33, S5-34, S7-01, S7-02, S7-03, S7-04, +23 more — the design's own words, quoted under References from Design |
| 25 | 6. Report descriptions and the pinned headline column | Layout.dc.html h2 | COVERED | S4-09, S4-10, S4-11, S4-12, S8-01, S8-02, S8-03, S8-04, +34 more — the design's own words, quoted under References from Design |
| 26 | 61-90 Days | I01 (before); I06 (before); I03 (after); I08 (after); I04 (after); I07 (before); +7 more | COVERED | S2-02, S2-03, S2-05, S2-06, S3-18, S3-19, D-01, D-10, +4 more — used word for word in these cases' preconditions, steps or results |
| 27 | 61-90 days | I38 (after) | COVERED | S1-08, S1-09, S5-25, S5-30, S5-31, S8-08, S8-09, DATA-16, +5 more — used word for word in these cases' preconditions, steps or results |
| 28 | 61-90 days past due | I02 (before); I05 (after); I11 (after); I28 (after); I29 (after); I30 (after); +4 more | COVERED | S1-08, S1-09, D-52 — used word for word in these cases' preconditions, steps or results |
| 29 | 7. Filters and call list | Filters.dc.html h2 | COVERED | S2-35, S3-09, S3-11, S3-12, S3-13, S3-14, S3-15, S3-16, +52 more — the design's own words, quoted under References from Design |
| 30 | 91 And Over | I01 (before); I06 (before); I03 (after); I08 (after); I04 (after); I07 (before); +7 more | COVERED | S2-02, S2-03, S2-05, S2-06, S3-18, S3-19, DATA-07, DATA-08, +6 more — used word for word in these cases' preconditions, steps or results |
| 31 | 91 or more days past due | I02 (before); I05 (after); I11 (after); I26 (before); I28 (after); I29 (after); +4 more | COVERED | S1-08, S1-09, S4-07, S4-08, DATA-05, DATA-06, D-52, D-61, +1 more — used word for word in these cases' preconditions, steps or results |
| 32 | 91+ days | I38 (after) | COVERED | S3-09, S3-10, S3-11, S3-12, S3-13, S3-14, S5-23, S5-26, +15 more — used word for word in these cases' preconditions, steps or results |
| 33 | A customer with open documents at two locations reads "Multiple"; sorted by Location here. S6-R4, S6-R5, S5-R8. | Location.dc.html figure 39 caption | COVERED | S2-01, S2-04, S6-04, S6-05, DATA-07, DATA-08, D-69 — the design's own words, quoted under References from Design |
| 34 | A number links only with the right permission and a location the user works at; otherwise plain text. Native link style. S7-R1, S7-R2, S7-R6, S7-R7, S7-N1, S… | Links.dc.html figure 31 caption | COVERED | S7-01, S7-02, S7-06, S7-07, S7-08, S7-11, S7-12, S7-13, +11 more — the design's own words, quoted under References from Design |
| 35 | A vendor credit’s number (C-1224) links to the vendor return it came from, under the bill rules; A/R credit memos and deposits stay plain text. S7-R9, S7-R10. | Filters.dc.html figure 14 caption | COVERED | S7-07, S7-08, S7-10, S7-17, D-58 — the design's own words, quoted under References from Design |
| 36 | A/P Aging Detail | I01 (before); I06 (before); I02 (before); I03 (after); I08 (after); I04 (after); +37 more | COVERED | S1-09, S1-14, S2-15, S2-16, S2-17, S2-18, S2-24, S2-27, +42 more — used word for word in these cases' preconditions, steps or results |
| 37 | A/P Aging Detail as it opens today | Main.dc.html figure 42 heading | COVERED | S1-08, S1-09, D-52 — the design's own words, quoted under References from Design |
| 38 | A/P Aging Detail opens by vendor name | Main.dc.html figure 45 heading | COVERED | S1-08, S1-09, S1-10, S1-11, S2-07, S2-08, S2-09, S2-10, +20 more — the design's own words, quoted under References from Design |
| 39 | A/P Aging Detail scrolled right in dark mode with Open Balance pinned | Layout.dc.html figure 27 alt | COVERED | S4-11, D-05, D-11, D-14, D-17, D-48, D-61 — the figure this text belongs to is attached to these cases |
| 40 | A/P Aging Detail scrolled right with Open Balance pinned | Layout.dc.html figure 26 alt | COVERED | S4-09, S4-10, S4-11, S4-12, D-13, D-15, D-27, D-47 — the figure this text belongs to is attached to these cases |
| 41 | A/P Aging Detail, vendor name order inside fixed buckets | Main.dc.html figure 45 alt | COVERED | S1-08, S1-09, S1-10, S1-11, S2-07, S2-08, S2-09, S2-10 — the figure this text belongs to is attached to these cases |
| 42 | A/P Aging Summary | I01 (before); I06 (before); I02 (before); I03 (after); I08 (after); I04 (after); +37 more | COVERED | S1-02, S1-04, S1-06, S1-14, S2-04, S2-05, S2-06, S2-32, +27 more — used word for word in these cases' preconditions, steps or results |
| 43 | A/P Aging Summary with the Export menu button | Export.dc.html figure 4 alt | COVERED | S3-01, S3-02, D-10, D-12, D-36, D-54 — the figure this text belongs to is attached to these cases |
| 44 | A/P Aging Summary with the Vendor menu open: Search vendor, All vendors and the helper line | Filters.dc.html figure 11 alt | COVERED | S3-12, S3-13, S3-14, S5-04, S5-24, S5-28, S5-29, DATA-20 — the figure this text belongs to is attached to these cases |
| 45 | A/P Detail scrolled sideways, light | Layout.dc.html figure 20 heading | COVERED | S4-11, S8-01, S8-02, S8-03, S8-04, S8-05, S8-06, S8-07, +26 more — the design's own words, quoted under References from Design |
| 46 | A/P gets the same menu | Export.dc.html figure 4 heading | COVERED | S3-01, S3-02, D-10, D-12, D-36, D-54 — the design's own words, quoted under References from Design |
| 47 | A/P Summary, Detail and Unpaid Invoices now export PDF and CSV. S3-R1. | Export.dc.html figure 4 caption | COVERED | S3-01, S3-02, D-10, D-12, D-36, D-54 — the design's own words, quoted under References from Design |
| 48 | A/P Unpaid Invoices | I01 (before); I06 (before); I02 (before); I03 (after); I08 (after); I04 (after); +37 more | COVERED | S1-11, S1-13, S1-14, S2-19, S2-20, S2-21, S2-22, S2-23, +41 more — used word for word in these cases' preconditions, steps or results |
| 49 | A/P Unpaid Invoices at 1440 pixels with every column visible and Open Balance pinned | Layout.dc.html figure 28 alt | COVERED | S4-12, D-16, D-18, D-28, D-62 — the figure this text belongs to is attached to these cases |
| 50 | A/P Unpaid Invoices at 1440: every column visible | Layout.dc.html figure 28 heading | COVERED | S4-12, D-16, D-18, D-28, D-62 — the design's own words, quoted under References from Design |
| 51 | A/P Unpaid Invoices Report | I16 (after); I25 (after); I43 (after) | COVERED | D-58, S1-11, S2-19, S2-20, S2-21, S2-22, S2-23, S2-28 — the page title of A/P Unpaid Invoices (starting screens name it) |
| 52 | A/P Unpaid Invoices scrolled, vendor row pinned | Grouped.dc.html figure 19 alt | COVERED | S2-25, S2-26, S2-27, S2-28, S4-09, S4-10, S4-12, D-16 — the figure this text belongs to is attached to these cases |
| 53 | A/P Unpaid Invoices with vendor credit C-1224 shown as a link | Filters.dc.html figure 14 alt | COVERED | S7-07, S7-08, S7-10, S7-17, D-58 — the figure this text belongs to is attached to these cases |
| 54 | A/P: no export at all | Export.dc.html figure 2 heading | COVERED | S3-02, D-35, D-36, D-53, D-54 — the design's own words, quoted under References from Design |
| 55 | A/R Aging Collection | I01 (before); I06 (before); I02 (before); I03 (after); I08 (after); I04 (after); +37 more | COVERED | S1-10, S1-14, S2-11, S2-12, S2-13, S2-14, S2-26, S2-31, +53 more — used word for word in these cases' preconditions, steps or results |
| 56 | A/R Aging Collection after Expand all | Grouped.dc.html figure 17 alt | COVERED | S2-25, S2-26, S2-27, S2-28, S4-01, S4-02, S4-03, S4-04 — the figure this text belongs to is attached to these cases |
| 57 | A/R Aging Collection description tooltip open in dark mode | Layout.dc.html figure 25 alt | COVERED | S8-07, D-08, D-42, D-60 — the figure this text belongs to is attached to these cases |
| 58 | A/R Aging Collection for one customer with Phone and Credit term on the group row | Filters.dc.html figure 13 alt | COVERED | S3-11, S3-15, S3-16, S9-01, S9-03, S9-04, DATA-01, DATA-02 — the figure this text belongs to is attached to these cases |
| 59 | A/R Aging Collection opened from A/R Aging Summary for 10 Trucking with As of 09/30/2026 | Location.dc.html figure 40 alt | COVERED | S5-26, S5-27, D-31, D-70 — the figure this text belongs to is attached to these cases |
| 60 | A/R Aging Collection scrolled, customer row pinned under the headings | Grouped.dc.html figure 18 alt | COVERED | S4-09, S4-10, S4-11, D-26, D-57, D-79 — the figure this text belongs to is attached to these cases |
| 61 | A/R Aging Collection title with the info icon closed | Layout.dc.html figure 22 alt | COVERED | S8-01, S8-02, S8-03, S8-04, S8-05, S8-06, S8-07, S8-13 — the figure this text belongs to is attached to these cases |
| 62 | A/R Aging Collection title with the info icon closed in dark mode | Layout.dc.html figure 24 alt | COVERED | S8-01, S8-02, S8-03, S8-04, S8-05, S8-06, S8-13, D-02 — the figure this text belongs to is attached to these cases |
| 63 | A/R Aging Collection with the description tooltip open | Layout.dc.html figure 23 alt | COVERED | S8-01, S8-02, S8-03, S8-04, S8-05, S8-06, S8-07, S8-13 — the figure this text belongs to is attached to these cases |
| 64 | A/R Aging Detail | I01 (before); I06 (before); I02 (before); I03 (after); I08 (after); I04 (after); +37 more | COVERED | S1-08, S1-14, S2-07, S2-08, S2-09, S2-10, S2-25, S2-30, +51 more — used word for word in these cases' preconditions, steps or results |
| 65 | A/R Aging Detail after Cancel, unchanged | Links.dc.html figure 33 alt | COVERED | S5-33, S5-34, S7-05, REL-10, D-39, D-64 — the figure this text belongs to is attached to these cases |
| 66 | A/R Aging Detail with Location: No locations and the No record matches these filters empty state | Location.dc.html figure 38 alt | COVERED | S3-24, S5-14, S5-18, S6-03, D-19, D-20, D-21, D-22 — the figure this text belongs to is attached to these cases |
| 67 | A/R Aging Detail with only Staging Lethbridge ticked in the Location menu, Location column hidden | Location.dc.html figure 37 alt | COVERED | S3-10, S3-17, S5-02, S5-07, S5-08, S5-13, S5-14, S5-15 — the figure this text belongs to is attached to these cases |
| 68 | A/R Aging Detail with the Location chip reading All locations and a Location column | Location.dc.html figure 35 alt | COVERED | S3-03, S3-04, S3-05, S3-06, S3-07, S3-08, S3-10, S5-02 — the figure this text belongs to is attached to these cases |
| 69 | A/R Aging Detail, links in the native report link style | Links.dc.html figure 31 alt | COVERED | S7-01, S7-02, S7-06, S7-07, S7-08, S7-11, S7-12, S7-13 — the figure this text belongs to is attached to these cases |
| 70 | A/R Aging Summary | I01 (before); I06 (before); I02 (before); I03 (after); I08 (after); I04 (after); +37 more | COVERED | S1-01, S1-03, S1-05, S1-07, S1-14, S1-15, S2-01, S2-02, +41 more — used word for word in these cases' preconditions, steps or results |
| 71 | A/R Aging Summary as it opens today | Main.dc.html figure 41 heading | COVERED | S1-01, S1-02, S1-03, S1-04, S1-15, DATA-01, DATA-03 — the design's own words, quoted under References from Design |
| 72 | A/R Aging Summary Export menu open | Export.dc.html figure 3 alt | COVERED | S1-05, S1-06, S3-01, S3-02, S3-03, S3-04, S3-05, S3-06 — the figure this text belongs to is attached to these cases |
| 73 | A/R Aging Summary filter row: As of, Customer All customers and Past due Any in grey, Location | Filters.dc.html figure 8 alt | COVERED | S3-09, S3-11, S3-12, S3-13, S3-14, S5-01, S5-03, S5-04 — the figure this text belongs to is attached to these cases |
| 74 | A/R Aging Summary in customer name order | Main.dc.html figure 43 alt | COVERED | S1-01, S1-02, S1-03, S1-04, S1-05, S1-06, S1-07, S1-08 — the figure this text belongs to is attached to these cases |
| 75 | A/R Aging Summary opens A to Z | Main.dc.html figure 43 heading | COVERED | S1-01, S1-02, S1-03, S1-04, S1-05, S1-06, S1-07, S1-08, +21 more — the design's own words, quoted under References from Design |
| 76 | A/R Aging Summary sorted by Location, Multiple at the top | Location.dc.html figure 39 alt | COVERED | S2-01, S2-04, S6-04, S6-05, DATA-07, DATA-08, D-69 — the figure this text belongs to is attached to these cases |
| 77 | A/R Aging Summary sorted by Total, largest first | Main.dc.html figure 44 alt | COVERED | S2-01, S2-02, S2-03, S2-04, S2-05, S2-06, S2-07, S2-08 — the figure this text belongs to is attached to these cases |
| 78 | A/R Aging Summary with Customer: 2 customers and the Customer menu open, 10 Trucking and 4 Star Truck Repair ticked | Filters.dc.html figure 12 alt | COVERED | S3-09, S5-23, S5-24, S5-28, S5-29, D-31, D-74 — the figure this text belongs to is attached to these cases |
| 79 | A/R Aging Summary with Past due: 2 ranges (31-60 and 91+ days), narrowed rows and Totals | Filters.dc.html figure 10 alt | COVERED | S2-35, S5-01, S5-22, S5-23, S5-30, S5-31, DATA-01, DATA-02 — the figure this text belongs to is attached to these cases |
| 80 | A/R and A/P Report Sorting | canvas.json title | COVERED | S1-01, S1-02, S1-03, S1-04, S1-05, S1-06, S1-07, S1-08, +281 more — quoted under References from Design |
| 81 | A/R Collection, groups opened one by one | Grouped.dc.html figure 15 heading | COVERED | S4-01, S4-02, S4-03, S4-04, S4-05, S4-06, D-25, D-26, +2 more — the design's own words, quoted under References from Design |
| 82 | A/R Collection: date and customer only | Filters.dc.html figure 7 heading | COVERED | S5-03, S9-01, DATA-10, DATA-12, D-43, D-56, D-57, D-59, +1 more — the design's own words, quoted under References from Design |
| 83 | A/R prints a PDF in database order, not the screen's. No CSV. | Export.dc.html figure 1 caption | COVERED | S3-01, REL-03 — the design's own words, quoted under References from Design |
| 84 | A/R Summary: date only | Filters.dc.html figure 6 heading | COVERED | S3-09, S3-11, S3-12, S3-13, S3-14, S5-01, S5-04, S5-05, +2 more — the design's own words, quoted under References from Design |
| 85 | A/R: a print icon only | Export.dc.html figure 1 heading | COVERED | S3-01, REL-03 — the design's own words, quoted under References from Design |
| 86 | All customers | I41 (after) | COVERED | S5-28, D-74, D-31 — the Customer menu row |
| 87 | All ranges are included. Pick one or more to narrow. | I38 (after) | COVERED | S5-30, S5-31, D-33, D-34, D-71 — used word for word in these cases' preconditions, steps or results |
| 88 | All vendors | I40 (after) | COVERED | S5-29, D-73, D-32 — the Vendor menu row |
| 89 | All vendors are included. Pick one or more to narrow. | I40 (after) | COVERED | S5-29, D-32, D-73 — used word for word in these cases' preconditions, steps or results |
| 90 | Amount | I02 (before); I05 (after); I11 (after); I12 (before); I13 (before); I14 (after); +23 more | COVERED | S2-09, S2-13, S2-17, S2-21, S3-20, S3-21, S3-22, S3-23, +17 more — used word for word in these cases' preconditions, steps or results |
| 91 | Another location asks first | Links.dc.html figure 32 heading | COVERED | S7-03, S7-04, D-39, D-40, D-64, D-76 — the design's own words, quoted under References from Design |
| 92 | Any | I38 (after) | COVERED | S5-30, D-71, S5-31, D-33, D-34 — the Past due menu row |
| 93 | As of, Customer (Vendor on A/P), Past due, Location. "Customer: All customers" and "Past due: Any" rest grey, Past due with the design system’s hourglass ico… | Filters.dc.html figure 8 caption | COVERED | S3-09, S3-11, S3-12, S3-13, S3-14, S5-01, S5-03, S5-04, +11 more — the design's own words, quoted under References from Design |
| 94 | As of: 09/30/2026 | I37 (after) | COVERED | D-70, S5-01, S5-02, S5-03, S5-04, S5-05, S5-06, REL-03 — the date chip with a picked date |
| 95 | As of: 10/19/2026 | I03 (after); I08 (after); I04 (after); I05 (after); I09 (after); I10 (after); +25 more | COVERED | S5-01, D-50, S3-09, S3-10, S3-11, S3-12, S3-13, S3-14 — the date chip (S5-R1 format) |
| 96 | At 1440 pixels every column fits without sideways scrolling: Date, Location, Transaction Type, No., Vendor Name, Due Date, Past Due, Amount and the pinned, b… | Layout.dc.html figure 28 caption | COVERED | S4-12, D-16, D-18, D-28, D-62 — the design's own words, quoted under References from Design |
| 97 | Buckets stay in fixed order; rows inside each bucket go by vendor name (was most overdue first). S1-R5, S2-R4, S2-R5. | Main.dc.html figure 45 caption | COVERED | S1-08, S1-09, S1-10, S1-11, S2-07, S2-08, S2-09, S2-10, +20 more — the design's own words, quoted under References from Design |
| 98 | Call list on A/R Collection | Filters.dc.html figure 13 heading | COVERED | S3-11, S3-15, S3-16, S9-01, S9-03, S9-04, DATA-01, DATA-02, +15 more — the design's own words, quoted under References from Design |
| 99 | Cancel | I29 (after) | COVERED | S7-03, S7-04, S7-05, REL-07, D-39, D-40, D-64, D-76 — used word for word in these cases' preconditions, steps or results |
| 100 | Cancel stays on the report | Links.dc.html figure 33 heading | COVERED | S5-33, S5-34, S7-05, REL-10, D-39, D-64 — the design's own words, quoted under References from Design |
| 101 | Clear all filters | I35 (after) | COVERED | S3-24, S5-14, S5-32, S8-08, S8-09, D-19, D-20, D-21, +4 more — used word for word in these cases' preconditions, steps or results |
| 102 | Clear selection | I33 (after); I34 (after) | COVERED | S3-24, S5-07, S5-08, S5-14, S6-03, D-29, D-30, D-66, +2 more — used word for word in these cases' preconditions, steps or results |
| 103 | Cleared: No locations | Location.dc.html figure 38 heading | COVERED | S3-24, S5-14, S5-18, S6-03, D-19, D-20, D-21, D-22, +4 more — the design's own words, quoted under References from Design |
| 104 | Click the Total header | Main.dc.html figure 44 heading | COVERED | S2-01, S2-02, S2-03, S2-04, S2-05, S2-06, S2-07, S2-08, +24 more — the design's own words, quoted under References from Design |
| 105 | Clicking one dead-ends | Links.dc.html figure 30 heading | COVERED | S5-26, S5-27 — the design's own words, quoted under References from Design |
| 106 | Close | I11 (after); I27 (before) | COVERED | D-55 — the toast's close control |
| 107 | COD | I14 (after); I15 (after); I19 (after); I20 (after); I21 (after); I22 (after); +1 more | COVERED | S9-01, D-43 — credit term shown when none is set |
| 108 | Collapse all and pinned group rows | canvas.json boards[Grouped.dc.html].title; Grouped.dc.html <title> | COVERED | S2-25, S2-26, S2-27, S2-28, S4-01, S4-02, S4-03, S4-04, +31 more — quoted under References from Design |
| 109 | Collection and Unpaid Invoices have a customer or vendor picker, and their Totals row ignores it. No phone or credit term on the customer rows. | Filters.dc.html figure 7 caption | COVERED | S5-03, S9-01, DATA-10, DATA-12, D-43, D-56, D-57, D-59, +1 more — the design's own words, quoted under References from Design |
| 110 | Credit | I14 (after); I15 (after); I16 (after); I17 (before); I18 (before); I25 (after); +8 more | COVERED | S2-11, D-56, S2-07, S2-25, S4-01, S5-15, S7-10, S8-01 — a Transaction type value (credit memo / vendor credit) |
| 111 | Credit term: | I14 (after); I15 (after); I19 (after); I20 (after); I21 (after); I22 (after); +2 more | COVERED | S9-01, D-56, D-43, D-46, D-59, D-75 — call list label |
| 112 | Current | I01 (before); I06 (before); I02 (before); I03 (after); I08 (after); I04 (after); +11 more | COVERED | S1-08, S1-09, S2-02, S2-03, S2-05, S2-06, S2-25, S2-27, +9 more — used word for word in these cases' preconditions, steps or results |
| 113 | Customer | I01 (before); I06 (before); I03 (after); I08 (after); I04 (after); I09 (after); +7 more | COVERED | D-50, S3-15, S9-03, S9-04, D-51, D-59, D-69 — the Summary's first heading, and today's Customer picker on A/R Collection |
| 114 | Customer menu with 10 Trucking and 4 Star Truck Repair ticked ("2 selected", shown as tags in the search box): the chip reads "Customer: 2 customers", and ro… | Filters.dc.html figure 12 caption | COVERED | S3-09, S5-23, S5-24, S5-28, S5-29, D-31, D-74 — the design's own words, quoted under References from Design |
| 115 | Customer name order the way QuickBooks sorts ("10 Trucking" before "2 Trucking"), marked on the Customer header. S1-R1, S1-R2, S1-R4, S1-R7, S1-R8. | Main.dc.html figure 43 caption | COVERED | S1-01, S1-02, S1-03, S1-04, S1-05, S1-06, S1-07, S1-08, +21 more — the design's own words, quoted under References from Design |
| 116 | Customer picked: the group row shows "Phone:" and, for users with View and Manage AP/AR Data, "Credit term:". The Totals row follows the customer filter. S9-… | Filters.dc.html figure 13 caption | COVERED | S3-11, S3-15, S3-16, S9-01, S9-03, S9-04, DATA-01, DATA-02, +15 more — the design's own words, quoted under References from Design |
| 117 | Customer: 10 Trucking | I37 (after) | COVERED | D-70, S3-15, S5-24, S5-28, D-46, D-75 — one customer ticked: prefix kept (DR-03) |
| 118 | Customer: 2 customers | I41 (after) | COVERED | S5-23, D-74, S3-09, S3-10, S3-11, S5-28 — two customers ticked |
| 119 | Customer: All customers | I03 (after); I08 (after); I04 (after); I09 (after); I14 (after); I15 (after); +14 more | COVERED | S5-01, S5-02, S5-03, S5-28, S5-32, S8-08, D-02, D-05, +4 more — used word for word in these cases' preconditions, steps or results |
| 120 | Customer: Andrews' Truck ... | I42 (after) | COVERED | D-75, S5-28, S3-15, S5-24, D-46, D-70 — one long-named customer ticked: shortened (DR-03) |
| 121 | Customers | I01 (before); I06 (before); I02 (before); I03 (after); I08 (after); I04 (after); +37 more | COVERED | S3-03, S3-04, S3-05, S3-09, S3-10, S3-11, S3-15, S5-23, +6 more — used word for word in these cases' preconditions, steps or results |
| 122 | Customers come back in no set order, and no column header can be clicked to sort. | Main.dc.html figure 41 caption | COVERED | S1-01, S1-02, S1-03, S1-04, S1-15, DATA-01, DATA-03 — the design's own words, quoted under References from Design |
| 123 | Date | I02 (before); I05 (after); I11 (after); I12 (before); I13 (before); I14 (after); +21 more | COVERED | S1-10, S1-11, S1-12, S1-13, S2-08, S2-12, S2-16, S2-18, +49 more — used word for word in these cases' preconditions, steps or results |
| 124 | Date: 2026-10-15 | I01 (before); I06 (before); I02 (before); I07 (before); I12 (before); I13 (before); +4 more | COVERED | S5-01, S5-02, S5-03, S5-04, S5-05, S5-06 — today's date chip label "Date" (What changes: now "As of") |
| 125 | Descriptions and pinned column | canvas.json boards[Layout.dc.html].title; Layout.dc.html <title> | COVERED | S4-09, S4-10, S4-11, S4-12, S5-32, S8-01, S8-02, S8-03, +40 more — quoted under References from Design |
| 126 | Document links and Switch location | canvas.json boards[Links.dc.html].title; Links.dc.html <title> | COVERED | S5-26, S5-27, S5-33, S5-34, S7-01, S7-02, S7-03, S7-04, +25 more — quoted under References from Design |
| 127 | Download (CSV) | I09 (after) | COVERED | S1-05, S1-06, S3-01, S3-02, S3-03, S3-04, S3-05, S3-06, +35 more — used word for word in these cases' preconditions, steps or results |
| 128 | Download (PDF) | I09 (after) | COVERED | S1-05, S1-06, S3-01, S3-02, S3-03, S3-04, S3-05, S3-06, +26 more — used word for word in these cases' preconditions, steps or results |
| 129 | Drill-down keeps the as-of date | Location.dc.html figure 40 heading | COVERED | S5-26, S5-27, D-31, D-70 — the design's own words, quoted under References from Design |
| 130 | Due Date | I02 (before); I05 (after); I11 (after); I12 (before); I13 (before); I14 (after); +22 more | COVERED | S2-24, D-13, D-81, S2-16, S2-18, S2-20, S2-22, S2-23 — A/P heading; on A/R see DD-06, question 4 |
| 131 | Each customer opens with its own arrow; there is no way to open or close them all. | Grouped.dc.html figure 15 caption | COVERED | S4-01, S4-02, S4-03, S4-04, S4-05, S4-06, D-25, D-26, +2 more — the design's own words, quoted under References from Design |
| 132 | Every invoice number is a link | Links.dc.html figure 29 heading | COVERED | S7-01, S7-02, S7-06, S7-11, S7-12, S7-13, S7-15, S7-16, +3 more — the design's own words, quoted under References from Design |
| 133 | Every location, no way to narrow | Location.dc.html figure 34 heading | COVERED | S3-10, S5-02, S6-01, S6-02, D-65 — the design's own words, quoted under References from Design |
| 134 | Expand all from the header | Grouped.dc.html figure 17 heading | COVERED | S2-25, S2-26, S2-27, S2-28, S4-01, S4-02, S4-03, S4-04, +13 more — the design's own words, quoted under References from Design |
| 135 | Export | canvas.json boards[Export.dc.html].title; Export.dc.html <title> | COVERED | S1-05, S1-06, S3-01, S3-02, S3-03, S3-04, S3-05, S3-06, +58 more — quoted under References from Design |
| 136 | Export menu: PDF and CSV | Export.dc.html figure 3 heading | COVERED | S1-05, S1-06, S3-01, S3-02, S3-03, S3-04, S3-05, S3-06, +26 more — the design's own words, quoted under References from Design |
| 137 | Filters and call list | canvas.json boards[Filters.dc.html].title; Filters.dc.html <title> | COVERED | S2-35, S3-09, S3-11, S3-12, S3-13, S3-14, S3-15, S3-16, +61 more — quoted under References from Design |
| 138 | First click gives the useful order: money largest first. Second click reverses, third repeats the first. S2-R1, S2-R2, S2-R3, S2-R7. | Main.dc.html figure 44 caption | COVERED | S2-01, S2-02, S2-03, S2-04, S2-05, S2-06, S2-07, S2-08, +24 more — the design's own words, quoted under References from Design |
| 139 | Four chips on every report | Filters.dc.html figure 8 heading | COVERED | S3-09, S3-11, S3-12, S3-13, S3-14, S5-01, S5-03, S5-04, +11 more — the design's own words, quoted under References from Design |
| 140 | Hover, keyboard focus or a tap shows the description; moving away or Escape closes it. The longest one: "Overdue invoices, unused credit memos and deposits f… | Layout.dc.html figure 23 caption | COVERED | S8-01, S8-02, S8-03, S8-04, S8-05, S8-06, S8-07, S8-13, +3 more — the design's own words, quoted under References from Design |
| 141 | ID | I12 (before); I13 (before); I14 (after); I15 (after); I19 (after); I20 (after); +13 more | COVERED | S2-10, S2-14, S6-01, D-04, D-07, D-56, D-63, D-67, +1 more — used word for word in these cases' preconditions, steps or results |
| 142 | Info icon beside the title, dark | Layout.dc.html figure 24 heading | COVERED | S8-01, S8-02, S8-03, S8-04, S8-05, S8-06, S8-13, D-02, +3 more — the design's own words, quoted under References from Design |
| 143 | Info icon beside the title, light | Layout.dc.html figure 22 heading | COVERED | S8-01, S8-02, S8-03, S8-04, S8-05, S8-06, S8-07, S8-13, +6 more — the design's own words, quoted under References from Design |
| 144 | Info icon open, dark | Layout.dc.html figure 25 heading | COVERED | S8-07, D-08, D-42, D-60 — the design's own words, quoted under References from Design |
| 145 | Info icon open, light | Layout.dc.html figure 23 heading | COVERED | S8-01, S8-02, S8-03, S8-04, S8-05, S8-06, S8-07, S8-13, +3 more — the design's own words, quoted under References from Design |
| 146 | Inside a bucket, rows open most overdue first. No sortable headers. | Main.dc.html figure 42 caption | COVERED | S1-08, S1-09, D-52 — the design's own words, quoted under References from Design |
| 147 | Inventory Value | I01 (before); I06 (before); I02 (before); I03 (after); I08 (after); I04 (after); +37 more | COVERED | S5-29, REL-05, D-32, D-73 — used word for word in these cases' preconditions, steps or results |
| 148 | Invoice | I12 (before); I14 (after); I15 (after); I16 (after); I17 (before); I18 (before); +11 more | COVERED | S2-11, D-56, D-63, S2-07, D-04, D-07, D-13, D-16 — a Transaction type value |
| 149 | Links only where they can open | Links.dc.html figure 31 heading | COVERED | S7-01, S7-02, S7-06, S7-07, S7-08, S7-11, S7-12, S7-13, +11 more — the design's own words, quoted under References from Design |
| 150 | Location | I03 (after); I08 (after); I04 (after); I05 (after); I09 (after); I10 (after); +24 more | COVERED | S1-01, S1-02, S1-03, S1-04, S1-05, S1-06, S1-07, S1-08, +277 more — used word for word in these cases' preconditions, steps or results |
| 151 | Location filter and Location column | canvas.json boards[Location.dc.html].title; Location.dc.html <title> | COVERED | S2-01, S2-04, S3-03, S3-04, S3-05, S3-06, S3-07, S3-08, +63 more — quoted under References from Design |
| 152 | Location Full Name | I12 (before); I13 (before); I26 (before); I31 (before) | COVERED | S6-01 — today's A/R heading as the screen writes it (PRD: "Location full name"), renamed "Location" |
| 153 | Location menu open with Select all, 2 selected, both locations ticked and Clear selection | Location.dc.html figure 36 alt | COVERED | S3-17, S5-02, S5-03, S5-05, S5-06, S5-07, S5-08, S5-09 — the figure this text belongs to is attached to these cases |
| 154 | Location Name | I02 (before); I17 (before); I18 (before) | COVERED | S6-02 — today's A/P heading, renamed "Location" |
| 155 | Location: All locations | I03 (after); I08 (after); I04 (after); I05 (after); I09 (after); I10 (after); +24 more | COVERED | S5-01, S5-02, S5-03, S5-04, S5-05, S5-06, S5-07, S5-08, +14 more — used word for word in these cases' preconditions, steps or results |
| 156 | Location: No locations | I35 (after) | COVERED | S5-07, S5-08, S5-13, S5-14, D-68, D-78 — used word for word in these cases' preconditions, steps or results |
| 157 | Location: Staging Lethbri... | I34 (after) | COVERED | D-67 — one location ticked: prefix kept, name shortened (DR-03) |
| 158 | Multiple | I04 (after); I10 (after); I36 (after); I39 (after) | COVERED | S2-01, S2-04, S6-04, S6-05, DATA-07, DATA-08, D-54, D-69 — used word for word in these cases' preconditions, steps or results |
| 159 | Native filter row: As of, Customer, Past due, then Location, which opens on "Location: All locations". Untouched, the report matches today. Column labelled "… | Location.dc.html figure 35 caption | COVERED | S3-03, S3-04, S3-05, S3-06, S3-07, S3-08, S3-10, S5-02, +20 more — the design's own words, quoted under References from Design |
| 160 | New in this build | Filters.dc.html figure 9 badge; Filters.dc.html figure 10 badge; Filters.dc.html figure 11 badge; Filters.dc.html figure 12 badge; Filters.dc.html figure 13 badge; Filters.dc.html figure 14 badge | COVERED | S2-35, S3-09, S3-11, S3-12, S3-13, S3-14, S3-15, S3-16, +45 more — quoted under References from Design |
| 161 | No description anywhere; no column stays in place. | Layout.dc.html figure 20 caption | COVERED | S4-11, S8-01, S8-02, S8-03, S8-04, S8-05, S8-06, S8-07, +26 more — the design's own words, quoted under References from Design |
| 162 | No record matches these filters | I35 (after) | COVERED | S5-14, S8-08, S8-09, D-19, D-20, D-21, D-22, D-23, +2 more — used word for word in these cases' preconditions, steps or results |
| 163 | No. | I02 (before); I05 (after); I11 (after); I16 (after); I17 (before); I18 (before); +4 more | COVERED | S2-18, S2-22, S6-02, D-13, D-16, D-52, D-61, D-62 — used word for word in these cases' preconditions, steps or results |
| 164 | On A/R Summary with As of 09/30/2026, clicking 10 Trucking opens A/R Collection for that customer with the same as-of date (and the same Past due and locatio… | Location.dc.html figure 40 caption | COVERED | S5-26, S5-27, D-31, D-70 — the design's own words, quoted under References from Design |
| 165 | One chevron in the top-left header cell: "Collapse all" while any group is open, "Expand all" when none is. Group toggles use the same chevron. S4-R1 to S4-R… | Grouped.dc.html figure 17 caption | COVERED | S2-25, S2-26, S2-27, S2-28, S4-01, S4-02, S4-03, S4-04, +13 more — the design's own words, quoted under References from Design |
| 166 | One location ticked | Location.dc.html figure 37 heading | COVERED | S3-10, S3-17, S5-02, S5-07, S5-08, S5-13, S5-14, S5-15, +13 more — the design's own words, quoted under References from Design |
| 167 | One location ticked ("1 selected"): the chip names it, rows, totals and exports narrow to it, and the Location column hides. S5-R6, S5-R7, S5-R10, S6-N1. | Location.dc.html figure 37 caption | COVERED | S3-10, S3-17, S5-02, S5-07, S5-08, S5-13, S5-14, S5-15, +13 more — the design's own words, quoted under References from Design |
| 168 | One message refusing a PDF over 2,000 rows | Export.dc.html figure 5 alt | COVERED | DATA-18, DATA-19, DATA-20, DATA-21, D-38, D-55 — the figure this text belongs to is attached to these cases |
| 169 | Open Balance | I02 (before); I05 (after); I11 (after); I12 (before); I13 (before); I14 (after); +21 more | COVERED | D-13, D-81, S2-17, S2-21, S2-27, S2-28, S2-33, S2-34 — A/P heading and the headline column; on A/R see DD-06, question 4 |
| 170 | Open Balance pinned, light | Layout.dc.html figure 26 heading | COVERED | S4-09, S4-10, S4-11, S4-12, D-13, D-15, D-27, D-47, +2 more — the design's own words, quoted under References from Design |
| 171 | Opening order and header sorting | canvas.json boards[Main.dc.html].title; Main.dc.html <title> | COVERED | S1-01, S1-02, S1-03, S1-04, S1-05, S1-06, S1-07, S1-08, +65 more — quoted under References from Design |
| 172 | Opens on All locations | Location.dc.html figure 35 heading | COVERED | S3-03, S3-04, S3-05, S3-06, S3-07, S3-08, S3-10, S5-02, +20 more — the design's own words, quoted under References from Design |
| 173 | Overdue invoices, unused credit memos and deposits for each customer to help you follow up on payments. Excludes invoices that aren’t due yet. | I20 (after); I22 (after) | COVERED | S8-03, S8-13, D-60 — used word for word in these cases' preconditions, steps or results |
| 174 | Past Due | I02 (before); I05 (after); I11 (after); I12 (before); I13 (before); I14 (after); +14 more | COVERED | D-13, D-81, S2-17, S2-21, S2-23, D-16, D-52, D-61 — A/P heading; on A/R see DD-06, question 4 |
| 175 | Past due checkbox menu open with Any ticked, the helper line and 1-30, 31-60, 61-90 and 91+ days | Filters.dc.html figure 9 alt | COVERED | S5-01, S5-22, S5-30, S5-31, DATA-16, DATA-17, D-33, D-34 — the figure this text belongs to is attached to these cases |
| 176 | Past due menu | Filters.dc.html figure 9 heading | COVERED | S5-01, S5-22, S5-30, S5-31, DATA-16, DATA-17, D-33, D-34, +1 more — the design's own words, quoted under References from Design |
| 177 | Past due ticked | Filters.dc.html figure 10 heading | COVERED | S2-35, S5-01, S5-22, S5-23, S5-30, S5-31, DATA-01, DATA-02, +16 more — the design's own words, quoted under References from Design |
| 178 | Past due: 2 ranges | I39 (after) | COVERED | S5-30, D-72, S5-31 — two ranges ticked |
| 179 | Past due: Any | I03 (after); I08 (after); I04 (after); I05 (after); I09 (after); I10 (after); +25 more | COVERED | S5-01, S5-02, S5-03, S5-04, S5-05, S5-06, S5-22, S5-23, +20 more — used word for word in these cases' preconditions, steps or results |
| 180 | PDF over 2,000 rows is refused | Export.dc.html figure 5 heading | COVERED | DATA-18, DATA-19, DATA-20, DATA-21, D-38, D-55 — the design's own words, quoted under References from Design |
| 181 | Phone: | I14 (after); I15 (after); I19 (after); I20 (after); I21 (after); I22 (after); +2 more | COVERED | S9-01, D-56, D-43, D-46, D-59, D-75 — call list label |
| 182 | Pinned cells and links use the native colors in dark mode. S8-R3, S7-R7. | Layout.dc.html figure 27 caption | COVERED | S4-11, D-05, D-11, D-14, D-17, D-48, D-61 — the design's own words, quoted under References from Design |
| 183 | Production (before) | Export.dc.html figure 1 badge; Export.dc.html figure 2 badge; Filters.dc.html figure 6 badge; Filters.dc.html figure 7 badge; Grouped.dc.html figure 15 badge; Grouped.dc.html figure 16 badge; +7 more | COVERED | S1-01, S1-02, S1-03, S1-04, S1-08, S1-09, S1-15, S3-01, +94 more — quoted under References from Design |
| 184 | Production A/P Aging Detail | Main.dc.html figure 42 alt | COVERED | S1-08, S1-09, D-52 — the figure this text belongs to is attached to these cases |
| 185 | Production A/P Aging Detail scrolled right in dark mode | Layout.dc.html figure 21 alt | COVERED | D-14 — the figure this text belongs to is attached to these cases |
| 186 | Production A/P Aging Detail scrolled right in light mode | Layout.dc.html figure 20 alt | COVERED | S4-11, S8-01, S8-02, S8-03, S8-04, S8-05, S8-06, S8-07 — the figure this text belongs to is attached to these cases |
| 187 | Production A/P Aging Summary with no export | Export.dc.html figure 2 alt | COVERED | S3-02, D-35, D-36, D-53, D-54 — the figure this text belongs to is attached to these cases |
| 188 | Production A/R Aging Collection scrolled, customer name out of view | Grouped.dc.html figure 16 alt | COVERED | S4-09, S4-10, S4-12, D-58 — the figure this text belongs to is attached to these cases |
| 189 | Production A/R Aging Collection with date and customer controls | Filters.dc.html figure 7 alt | COVERED | S4-01, S4-02, S4-03, S4-04, S4-05, S4-06, S5-03, S9-01 — the figure this text belongs to is attached to these cases |
| 190 | Production A/R Aging Collection with two customers expanded | Grouped.dc.html figure 15 alt | COVERED | S4-01, S4-02, S4-03, S4-04, S4-05, S4-06, S5-03, S9-01 — the figure this text belongs to is attached to these cases |
| 191 | Production A/R Aging Detail with a Location Full Name column and no location filter | Location.dc.html figure 34 alt | COVERED | S3-10, S5-02, S6-01, S6-02, D-65 — the figure this text belongs to is attached to these cases |
| 192 | Production A/R Aging Detail with links on invoices from another location | Links.dc.html figure 29 alt | COVERED | S7-01, S7-02, S7-06, S7-11, S7-12, S7-13, S7-15, S7-16 — the figure this text belongs to is attached to these cases |
| 193 | Production A/R Aging Summary toolbar with a print icon | Export.dc.html figure 1 alt | COVERED | S3-01, REL-03 — the figure this text belongs to is attached to these cases |
| 194 | Production A/R Aging Summary with only a date control | Filters.dc.html figure 6 alt | COVERED | S1-01, S1-02, S1-03, S1-04, S1-15, S3-09, S3-11, S3-12 — the figure this text belongs to is attached to these cases |
| 195 | Production A/R Aging Summary, customers in no set order | Main.dc.html figure 41 alt | COVERED | S1-01, S1-02, S1-03, S1-04, S1-15, S3-09, S3-11, S3-12 — the figure this text belongs to is attached to these cases |
| 196 | Production in dark mode, for comparison. | Layout.dc.html figure 21 caption | COVERED | D-14 — the design's own words, quoted under References from Design |
| 197 | Production Work Orders list with WorkOrder not found and status code 400 errors | Links.dc.html figure 30 alt | COVERED | S5-26, S5-27 — the figure this text belongs to is attached to these cases |
| 198 | Reports | I01 (before); I06 (before); I02 (before); I03 (after); I08 (after); I04 (after); +37 more | COVERED | S1-01, S1-02, S1-03, S1-04, S1-05, S1-06, S1-07, S1-08, +280 more — used word for word in these cases' preconditions, steps or results |
| 199 | Sales By Customer | I01 (before); I06 (before); I02 (before); I03 (after); I08 (after); I04 (after); +37 more | COVERED | S2-36, S2-37, S2-38, S4-15, S4-16, S5-13, S5-25, S5-28, +26 more — used word for word in these cases' preconditions, steps or results |
| 200 | Same filters, open groups and scroll position. S7-R5, S7-E1. | Links.dc.html figure 33 caption | COVERED | S5-33, S5-34, S7-05, REL-10, D-39, D-64 — the design's own words, quoted under References from Design |
| 201 | Same in dark mode. S8-R1. | Layout.dc.html figure 24 caption | COVERED | S8-01, S8-02, S8-03, S8-04, S8-05, S8-06, S8-13, D-02, +3 more — the design's own words, quoted under References from Design |
| 202 | Same on A/P Unpaid Invoices | Grouped.dc.html figure 19 heading | COVERED | S2-25, S2-26, S2-27, S2-28, S4-09, S4-10, S4-12, D-16, +2 more — the design's own words, quoted under References from Design |
| 203 | Same, dark | Layout.dc.html figure 21 heading; Layout.dc.html figure 27 heading | COVERED | S4-11, D-05, D-11, D-14, D-17, D-48, D-61 — the design's own words, quoted under References from Design |
| 204 | Scrolled into a long group, nothing on screen says whose rows these are. | Grouped.dc.html figure 16 caption | COVERED | S4-09, S4-10, S4-12, D-58 — the design's own words, quoted under References from Design |
| 205 | Scrolling loses the customer name | Grouped.dc.html figure 16 heading | COVERED | S4-09, S4-10, S4-12, D-58 — the design's own words, quoted under References from Design |
| 206 | Select all | I33 (after); I34 (after) | COVERED | S5-07, S5-08, S5-19, DATA-07, DATA-08, D-29, D-30, D-66, +1 more — used word for word in these cases' preconditions, steps or results |
| 207 | Signed in to Heavy Duty, the Lethbridge invoices (S3-) are links too. | Links.dc.html figure 29 caption | COVERED | S7-01, S7-02, S7-06, S7-11, S7-12, S7-13, S7-15, S7-16, +3 more — the design's own words, quoted under References from Design |
| 208 | Summaries show "Multiple" | Location.dc.html figure 39 heading | COVERED | S2-01, S2-04, S6-04, S6-05, DATA-07, DATA-08, D-69 — the design's own words, quoted under References from Design |
| 209 | Switch location prompt shown on the report | Links.dc.html figure 32 alt | COVERED | S7-03, S7-04, D-39, D-40, D-64, D-76 — the figure this text belongs to is attached to these cases |
| 210 | Switch location? | I29 (after) | COVERED | S7-03, S7-04, S7-05, D-39, D-40, D-64, D-76 — used word for word in these cases' preconditions, steps or results |
| 211 | The A/P reports have no print, PDF or CSV. | Export.dc.html figure 2 caption | COVERED | S3-02, D-35, D-36, D-53, D-54 — the design's own words, quoted under References from Design |
| 212 | The customer row stays pinned | Grouped.dc.html figure 18 heading | COVERED | S4-09, S4-10, S4-11, D-26, D-57, D-79 — the design's own words, quoted under References from Design |
| 213 | The headline column (Open Balance; Total on the Summaries) is bold and pinned right; the group label stays at the left. S8-R3, S8-R4, S4-R7. | Layout.dc.html figure 26 caption | COVERED | S4-09, S4-10, S4-11, S4-12, D-13, D-15, D-27, D-47, +2 more — the design's own words, quoted under References from Design |
| 214 | The native checkbox menu: "Any" ticked, "All ranges are included. Pick one or more to narrow.", then 1-30 days, 31-60 days, 61-90 days, 91+ days. S5-R15, S5-N3. | Filters.dc.html figure 9 caption | COVERED | S5-01, S5-22, S5-30, S5-31, DATA-16, DATA-17, D-33, D-34, +1 more — the design's own words, quoted under References from Design |
| 215 | The native Location menu | Location.dc.html figure 36 heading | COVERED | S3-17, S5-02, S5-03, S5-05, S5-06, S5-07, S5-08, S5-09, +9 more — the design's own words, quoted under References from Design |
| 216 | The native report info icon sits right of the title; title, icon and ⋯ stay on one line, filter row below. S8-R1, S8-R2. | Layout.dc.html figure 22 caption | COVERED | S8-01, S8-02, S8-03, S8-04, S8-05, S8-06, S8-07, S8-13, +6 more — the design's own words, quoted under References from Design |
| 217 | The native Vendor menu | Filters.dc.html figure 11 heading | COVERED | S3-12, S3-13, S3-14, S5-04, S5-24, S5-28, S5-29, DATA-20, +3 more — the design's own words, quoted under References from Design |
| 218 | The native ⋯ Export menu on all six reports. Files hold exactly the rows on screen, in screen order, with the as-of date and locations, then Past due and the… | Export.dc.html figure 3 caption | COVERED | S1-05, S1-06, S3-01, S3-02, S3-03, S3-04, S3-05, S3-06, +26 more — the design's own words, quoted under References from Design |
| 219 | The reports show the whole organization. The column is "Location Full Name" here and "Location Name" on A/P; the Summaries have none. | Location.dc.html figure 34 caption | COVERED | S3-10, S5-02, S6-01, S6-02, D-65 — the design's own words, quoted under References from Design |
| 220 | The Summaries and Detail reports have no customer, vendor or past due filter today. | Filters.dc.html figure 6 caption | COVERED | S3-09, S3-11, S3-12, S3-13, S3-14, S5-01, S5-04, S5-05, +2 more — the design's own words, quoted under References from Design |
| 221 | This build (after) | Export.dc.html figure 3 badge; Export.dc.html figure 4 badge; Export.dc.html figure 5 badge; Filters.dc.html figure 8 badge; Grouped.dc.html figure 17 badge; Grouped.dc.html figure 18 badge; +20 more | COVERED | S1-01, S1-02, S1-03, S1-04, S1-05, S1-06, S1-07, S1-08, +236 more — quoted under References from Design |
| 222 | This report is too large for PDF. Export it as CSV, or narrow the filters, then try again. | I11 (after) | COVERED | DATA-18, DATA-19, DATA-20, D-38, D-55 — used word for word in these cases' preconditions, steps or results |
| 223 | This work order is in Staging Lethbridge - 4310. Switch your active location to view it? | I29 (after) | COVERED | S7-03, D-64, D-39 — the dialog message with an example location |
| 224 | Tooltip in dark mode. Descriptions appear on screen only, not in the PDF or CSV. S8-R1, S8-N1. | Layout.dc.html figure 25 caption | COVERED | S8-07, D-08, D-42, D-60 — the design's own words, quoted under References from Design |
| 225 | Total | I01 (before); I06 (before); I02 (before); I03 (after); I08 (after); I04 (after); +26 more | COVERED | D-52, D-59, S2-03, S2-06, S2-29, S2-32, S2-36, S2-37 — the Summaries' headline column and the group rows' "Total" label |
| 226 | Total for | I14 (after); I15 (after); I16 (after); I25 (after); I43 (after) | COVERED | D-56, D-62, D-63 — the group subtotal row label (today's), shown under each open group |
| 227 | Total for 10 Trucking | I14 (after) | COVERED | D-56, D-62, D-63 — the subtotal row under an open group (today's label, kept), with the group's name |
| 228 | Total for 10 Trucking Parts | I25 (after) | COVERED | D-56, D-62, D-63 — the subtotal row under an open group (today's label, kept), with the group's name |
| 229 | Total for 2 Trucking | I14 (after) | COVERED | D-56, D-62, D-63 — the subtotal row under an open group (today's label, kept), with the group's name |
| 230 | Total for 2 Trucking Parts | I25 (after) | COVERED | D-56, D-62, D-63 — the subtotal row under an open group (today's label, kept), with the group's name |
| 231 | Total for 91 or more days past due | I28 (after); I31 (before) | COVERED | D-56, D-62, D-63 — the subtotal row under an open group (today's label, kept), with the group's name |
| 232 | Total for Abadi's Diesel Repair | I25 (after) | COVERED | D-56, D-62, D-63 — the subtotal row under an open group (today's label, kept), with the group's name |
| 233 | Total for Adams Diesel Repair | I16 (after); I43 (after) | COVERED | D-56, D-62, D-63 — the subtotal row under an open group (today's label, kept), with the group's name |
| 234 | Total for Akal's Mobile Truck Repair | I16 (after); I43 (after) | COVERED | D-56, D-62, D-63 — the subtotal row under an open group (today's label, kept), with the group's name |
| 235 | Total for Andrews' Truck & Trailer Repair LLC | I14 (after) | COVERED | D-56, D-62, D-63 — the subtotal row under an open group (today's label, kept), with the group's name |
| 236 | Total for Bancescu & Sons Truck & Trailer Repair | I15 (after) | COVERED | D-56, D-62, D-63 — the subtotal row under an open group (today's label, kept), with the group's name |
| 237 | Total for Carrick & Sons Truck & Trailer Repair | I15 (after) | COVERED | D-56, D-62, D-63 — the subtotal row under an open group (today's label, kept), with the group's name |
| 238 | Total for Inland Heavy Duty Truck Repair | I12 (before) | COVERED | D-56, D-62, D-63 — the subtotal row under an open group (today's label, kept), with the group's name |
| 239 | Total for Mobile Truck & Trailer Repair Island Lake | I12 (before) | COVERED | D-56, D-62, D-63 — the subtotal row under an open group (today's label, kept), with the group's name |
| 240 | Totals | I01 (before); I06 (before); I02 (before); I03 (after); I08 (after); I04 (after); +34 more | COVERED | S3-18, S3-19, S3-20, S3-21, S3-22, S3-23, S5-14, DATA-01 — the Totals row label |
| 241 | Transaction Type | I02 (before); I05 (after); I11 (after); I12 (before); I13 (before); I14 (after); +23 more | COVERED | D-13, D-81, S2-15, S2-19, D-16, D-52, D-61, D-62 — A/P heading as the PRD writes it; on A/R the PRD writes "Transaction type": DD-06, question 4 (sent) |
| 242 | Try changing filters to widen your results. | I35 (after) | COVERED | S5-14, S8-08, S8-09, D-19, D-20, D-21, D-22, D-23, +2 more — used word for word in these cases' preconditions, steps or results |
| 243 | Two customers ticked | Filters.dc.html figure 12 heading | COVERED | S3-09, S5-23, S5-24, S5-28, S5-29, D-31, D-74 — the design's own words, quoted under References from Design |
| 244 | Vendor | I07 (before); I10 (after); I40 (after) | COVERED | D-54, S1-09, S1-13, S2-15, S2-19, S2-38, S3-12, S3-13 — the A/P Summary's first heading |
| 245 | Vendor chip with the truck icon, as on Inventory Value. Its menu: a search box, "All vendors" ticked, "All vendors are included. Pick one or more to narrow."… | Filters.dc.html figure 11 caption | COVERED | S3-12, S3-13, S3-14, S5-04, S5-24, S5-28, S5-29, DATA-20, +3 more — the design's own words, quoted under References from Design |
| 246 | Vendor credits link | Filters.dc.html figure 14 heading | COVERED | S7-07, S7-08, S7-10, S7-17, D-58 — the design's own words, quoted under References from Design |
| 247 | Vendor Name | I02 (before); I05 (after); I11 (after); I16 (after); I17 (before); I18 (before); +4 more | COVERED | S1-09, S1-13, S2-15, S2-19, S2-38, S6-02, D-13, D-16, +3 more — used word for word in these cases' preconditions, steps or results |
| 248 | Vendor rows pin the same way; re-sorting never collapses an open group. S4-R6, S2-R9. | Grouped.dc.html figure 19 caption | COVERED | S2-25, S2-26, S2-27, S2-28, S4-09, S4-10, S4-12, D-16, +2 more — the design's own words, quoted under References from Design |
| 249 | Vendor: All vendors | I05 (after); I10 (after); I11 (after); I16 (after); I23 (after); I24 (after); +3 more | COVERED | S5-04, S5-05, S5-06, S5-25, S5-29, S8-09, D-11, D-14, +5 more — used word for word in these cases' preconditions, steps or results |
| 250 | While scrolling a group, its row stays under the column headings; the next group's row pushes it up and off. S4-R6. | Grouped.dc.html figure 18 caption | COVERED | S4-09, S4-10, S4-11, D-26, D-57, D-79 — the design's own words, quoted under References from Design |
| 251 | Work In Progress | I01 (before); I06 (before); I02 (before); I03 (after); I08 (after); I04 (after); +37 more | COVERED | REL-05, D-01, D-04, D-07, D-10, D-13, D-16, D-41, +1 more — used word for word in these cases' preconditions, steps or results |
| 252 | — | I16 (after); I25 (after); I43 (after) | COVERED | D-58, S2-23 — an empty Due Date / Past Due cell (DR-05) |
| 253 | ⋯ | I03 (after); I08 (after); I04 (after); I05 (after); I09 (after); I10 (after); +26 more | COVERED | S3-01, S1-05, S1-06, S3-02, S3-03, S3-04, S3-05, S3-06 — the Export menu button |
| 254 | $-1,050.00 | I07 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 255 | $-1,880.00 | I03; I08; I09; I15; I19; I20; +7 more | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 256 | $-10.00 | I10; I25 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 257 | $-100.00 | I03; I08; I09; I14; I19; I20; +9 more | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 258 | $-193.50 | I17; I18 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 259 | $-2,062.66 | I01; I06; I13; I26 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 260 | $-20.00 | I25 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 261 | $-200.00 | I14; I29; I30; I32; I33 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 262 | $-231.00 | I28 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 263 | $-30.00 | I25 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 264 | $-300.00 | I14; I29; I30; I32; I33 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 265 | $-400.00 | I03; I08; I09; I14; I19; I20; +7 more | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 266 | $-50.00 | I10; I25 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 267 | $-500.00 | I03; I08; I09; I14; I19; I20; +4 more | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 268 | $-55.03 | I17; I18 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 269 | $-735.00 | I17; I18 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 270 | $-75.20 | I03; I08; I09; I38 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 271 | $-812.34 | I13; I26; I28 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 272 | $-93.65 | I16; I43 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 273 | $0.55 | I39 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 274 | $1,040.11 | I34 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 275 | $1,066.43 | I16 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 276 | $1,113.83 | I01; I06; I13 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 277 | $1,179.44 | I12 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 278 | $1,195.80 | I04 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 279 | $1,200.00 | I04 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 280 | $1,206.33 | I28 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 281 | $1,241.58 | I29; I30; I32; I33 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 282 | $1,254.46 | I04; I26 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 283 | $1,260.00 | I15 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 284 | $1,270.34 | I01; I06; I12 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 285 | $1,391.84 | I39 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 286 | $1,392.39 | I39 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 287 | $1,455.23 | I29; I30; I32; I33 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 288 | $1,483.90 | I01; I06; I12 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 289 | $1,491.58 | I03; I08; I09; I13; I19; I20; +8 more | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 290 | $1,609.31 | I03; I08; I09; I19; I20; I21; +2 more | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 291 | $1,867.94 | I01; I06; I26; I28 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 292 | $1,874.40 | I13 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 293 | $1,895.79 | I26; I29; I30; I32; I33 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 294 | $10,074.14 | I34 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 295 | $10,640.79 | I04 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 296 | $100,953.40 | I01; I06 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 297 | $102,479.40 | I03; I08; I09; I38 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 298 | $109,512.83 | I03; I08; I09; I38 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 299 | $11,806.51 | I01; I06; I04 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 300 | $118,114.86 | I01; I06 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 301 | $12,489.08 | I04; I13 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 302 | $14,498.93 | I04 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 303 | $14,556.05 | I01; I06; I04; I12; I36 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 304 | $145,530.62 | I03; I08; I09; I38 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 305 | $147,056.62 | I01; I06 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 306 | $152.25 | I01; I06 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 307 | $16,136.37 | I34 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 308 | $16,757.05 | I29; I30; I32; I33 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 309 | $169.64 | I17; I18 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 310 | $19,831.23 | I04 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 311 | $2,100.00 | I07; I10; I16; I43 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 312 | $2,182.34 | I01; I06; I12 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 313 | $2,519.13 | I34 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 314 | $2,529.62 | I03; I08; I09; I13; I19; I20; +3 more | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 315 | $2,538.69 | I26 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 316 | $2,973.31 | I26 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 317 | $21,085.69 | I13 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 318 | $21,479.55 | I07; I10 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 319 | $215.25 | I07; I10; I25 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 320 | $22.44 | I16; I23; I24 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 321 | $23.51 | I17; I18 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 322 | $231,918.94 | I03; I08; I04; I09; I13; I19; +4 more | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 323 | $237,589.40 | I05; I10 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 324 | $238,082.87 | I05; I10 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 325 | $243,187.09 | I02; I07 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 326 | $245,080.58 | I02; I07 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 327 | $25,198.61 | I07; I10 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 328 | $25,210.55 | I04 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 329 | $256.20 | I07; I10 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 330 | $26,143.03 | I07; I10 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 331 | $26.10 | I07 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 332 | $262.50 | I23; I24; I25 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 333 | $27,454.37 | I12 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 334 | $272.17 | I07; I10 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 335 | $3,008.12 | I34 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 336 | $3,316.84 | I01; I06; I04 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 337 | $3,830,561.21 | I02 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 338 | $3,830,561.23 | I02; I07 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 339 | $3,882,781.90 | I05 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 340 | $3,882,781.92 | I05; I10 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 341 | $30,283.11 | I03; I08; I09; I38 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 342 | $304.46 | I12 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 343 | $306.60 | I17; I18 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 344 | $307.86 | I26 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 345 | $31.50 | I17; I18 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 346 | $310,152.63 | I05 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 347 | $310,152.65 | I05; I10 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 348 | $314.40 | I01; I06 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 349 | $32,833.58 | I07 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 350 | $327.56 | I16; I23; I24 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 351 | $34.61 | I17; I18 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 352 | $340,823.56 | I02 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 353 | $340,823.58 | I02; I07 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 354 | $35,684.63 | I34 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 355 | $35,900.72 | I01; I06 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 356 | $36,389.71 | I31 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 357 | $381,269.04 | I39 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 358 | $4,411.18 | I16; I23; I24 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 359 | $4,417.57 | I03; I08; I09; I19; I20; I21; +2 more | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 360 | $4,553.50 | I07; I10 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 361 | $4,734,647.89 | I05; I11; I16; I23; I24; I25; +1 more | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 362 | $4,734,647.93 | I05; I10; I11; I16; I23; I24; +3 more | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 363 | $4,734,707.89 | I02; I17; I18 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 364 | $4,734,707.93 | I02; I07; I17; I18 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 365 | $4,798.78 | I07; I10; I16; I43 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 366 | $4,973.89 | I01; I06; I04 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 367 | $400,525.60 | I14; I15; I19; I20; I21; I22 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 368 | $402,025.60 | I12; I13 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 369 | $412.62 | I17; I18 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 370 | $428,461.92 | I14; I15; I19; I20; I21; I22 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 371 | $429,961.92 | I12; I13 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 372 | $43,002.75 | I03; I08; I09; I28; I38 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 373 | $43,491.74 | I28 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 374 | $432.75 | I01; I06 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 375 | $451.89 | I01; I06 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 376 | $453.75 | I03; I08; I09; I19; I20; I21; +2 more | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 377 | $461,257.06 | I03; I08; I04; I09; I28; I29; +5 more | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 378 | $462,757.06 | I01; I06 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 379 | $487.53 | I01; I06; I13 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 380 | $489,193.38 | I28; I29; I30; I32; I33 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 381 | $49,488.75 | I39 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 382 | $490,693.38 | I26; I31 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 383 | $5,047.60 | I04 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 384 | $508.08 | I29; I30; I32; I33 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 385 | $51.96 | I17; I18 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 386 | $528.95 | I03; I08; I09; I38 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 387 | $54.78 | I01; I06 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 388 | $56,737.55 | I03; I08; I09; I38 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 389 | $56.42 | I16; I23; I24 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 390 | $57.79 | I17; I18 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 391 | $58,359.47 | I03; I08; I09; I38 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 392 | $590.55 | I07; I10 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 393 | $592.17 | I36 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 394 | $6,265.32 | I01; I06; I04 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 395 | $6,300.00 | I01; I06; I03; I08; I04; I09; +6 more | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 396 | $6,427.39 | I12; I26 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 397 | $6,564.73 | I04 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 398 | $60,731.46 | I01; I06; I03; I08; I04; I09; +1 more | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 399 | $604.14 | I01; I06; I13 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 400 | $65,454.38 | I34 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 401 | $65,943.37 | I34 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 402 | $66,041.09 | I05; I10 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 403 | $666.50 | I28 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 404 | $69.62 | I28 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 405 | $7,028.83 | I17; I18 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 406 | $7,298.24 | I01; I06; I04; I12 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 407 | $7.04 | I01; I06; I12 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 408 | $7.35 | I39 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 409 | $71,469.23 | I39 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 410 | $74.83 | I16; I23; I24 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 411 | $743.83 | I16; I43 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 412 | $75,055.45 | I02; I07 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 413 | $753.32 | I26 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 414 | $757.07 | I29; I30; I32; I33 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 415 | $782.70 | I28 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 416 | $8,593.88 | I04 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 417 | $8,600.85 | I01; I06; I03; I08; I04; I09; +8 more | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 418 | $8,953.54 | I03; I08; I04; I09; I15; I19; +5 more | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 419 | $81,817.15 | I04; I36 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 420 | $86,538.81 | I03; I08; I09; I38 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 421 | $86.89 | I17; I18 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 422 | $870.85 | I12; I26 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 423 | $9,440.79 | I04 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 424 | $901.46 | I13 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 425 | $921.94 | I04 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 426 | $97,100.20 | I39 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 427 | $98.26 | I28 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 428 | $990.48 | I07; I10 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 429 | (1) | I34 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 430 | (11234) | I02 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 431 | (11334) | I05; I11 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 432 | (161) | I05; I11 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 433 | (223) | I02 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 434 | (23) | I28 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 435 | (24) | I26 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 436 | (26) | I34 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 437 | (3) | I34 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 438 | (34) | I34 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 439 | (36) | I31 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 440 | (42) | I28; I29; I30; I32; I33 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 441 | (594) | I05; I11 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 442 | (6) | I34 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 443 | (604) | I02 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 444 | (658) | I05; I11 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 445 | (700) | I02 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 446 | (776) | I02 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 447 | (793) | I05; I11 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 448 | 0% | I27 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 449 | 10 Trucking | I03; I08; I09; I29; I30; I32; +4 more | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 450 | 10 Trucking (1) | I14; I19; I20; I21; I22; I37 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 451 | 10 Trucking Parts | I10; I25; I40 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 452 | 10 Trucking Parts (1) | I25 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 453 | 100 | I23; I24 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 454 | 106 | I23; I24 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 455 | 107 | I23; I24 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 456 | 110 | I23; I24 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 457 | 111 | I23; I24 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 458 | 116 | I23; I24 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 459 | 11966 | I16; I23; I24; I43 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 460 | 11967 | I16; I23; I24; I43 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 461 | 11989 | I16; I23; I24; I43 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 462 | 12887 | I16; I23; I24; I43 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 463 | 13286 | I16; I23; I24; I43 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 464 | 16% | I27 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 465 | 167 | I25 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 466 | 178 | I16; I23; I24 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 467 | 18 | I12 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 468 | 19 | I12 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 469 | 2 Trucking | I03; I08; I09; I29; I30; I32; +4 more | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 470 | 2 Trucking (1) | I14; I19; I20; I21; I22 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 471 | 2 Trucking (2) | I14; I19; I20; I21; I22 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 472 | 2 Trucking Parts | I10; I25; I40 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 473 | 2 Trucking Parts (2) | I25 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 474 | 2% | I27 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 475 | 23 | I14; I15 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 476 | 23% | I27 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 477 | 2312 | I17; I18 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 478 | 257-911-9306 | I14; I15; I19; I20; I21; I22; +1 more | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 479 | 282 | I23; I24 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 480 | 283-464-0262 | I19; I20; I21; I22 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 481 | 285 | I16; I23; I24 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 482 | 286-557-2913 | I19; I20; I21; I22 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 483 | 305 | I23; I24 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 484 | 311 | I23; I24 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 485 | 336 | I23; I24; I25 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 486 | 343-203-3967 | I14; I19; I20; I21; I22; I42 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 487 | 357 | I25 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 488 | 4 Star Truck Repair | I41 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 489 | 4172 | I17; I18 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 490 | 449 | I12 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 491 | 501 | I14; I15 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 492 | 543-029-3894 | I15; I19; I20; I21; I22 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 493 | 545086179-1 | I17; I18 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 494 | 545086179-2 | I17; I18 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 495 | 547740C | I17; I18 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 496 | 547769C | I17; I18 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 497 | 548037C | I17; I18 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 498 | 576 | I16 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 499 | 581 | I16; I23; I24 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 500 | 584 | I16 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 501 | 591 | I16; I23; I24 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 502 | 5956 | I25 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 503 | 605-175-8825 | I19; I20; I21; I22 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 504 | 640 | I17; I18 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 505 | 642 | I17; I18 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 506 | 643 | I17; I18 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 507 | 644 | I17; I18 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 508 | 646 | I17; I18 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 509 | 647 | I17; I18 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 510 | 66 | I15 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 511 | 665-284-6874 | I15; I19; I20; I21; I22 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 512 | 7 Star Truck Repair | I41 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 513 | 74% | I27 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 514 | 776-767-2768 | I19; I20; I21; I22 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 515 | 812-656-9196 | I19; I20; I21; I22 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 516 | 833-303-1757 | I15; I19; I20; I21; I22 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 517 | 91 or more days past due (11334) | I23; I24 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 518 | 92% | I27 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 519 | 98 | I23; I24; I25 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 520 | 99 | I23; I24; I25 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 521 | A & J Truck & Trailer Repair | I41 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 522 | Abadi's Diesel Repair | I07; I10; I25; I40 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 523 | Abadi's Diesel Repair (1) | I25 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 524 | Aberdeen Diesel Services LLC | I41 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 525 | Aberdeen Truck Repair | I41 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 526 | Abilene Mechanical Services | I41 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 527 | Adams Diesel Repair | I07; I10; I23; I24; I25; I40 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 528 | Adams Diesel Repair (8) | I16; I25; I43 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 529 | Akal's Mobile Truck Repair | I07; I10; I16; I23; I24 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 530 | Akal's Mobile Truck Repair (6) | I16; I43 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 531 | Alameda Mechanical Services | I07; I10; I16 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 532 | Alameda Mechanical Services (43) | I16; I43 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 533 | Alzuhairi Truck & Machine Service | I07; I10 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 534 | Amani & Sons Truck & Trailer Repair | I07; I10 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 535 | Amherst Truck Center | I07; I10 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 536 | Amimi Diesel Services Inc | I07; I10 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 537 | Andover Fleet Services | I07; I10 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 538 | Andrews' Truck & Trailer Repair LLC | I01; I06; I03; I08; I04; I09; +2 more | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 539 | Andrews' Truck & Trailer Repair LLC (1) | I13; I14; I19; I20; I21; I22; +1 more | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 540 | Antioch Diesel & Fleet Repair | I07; I10 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 541 | Apex Truck & Trailer Repair | I07; I10; I17; I18 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 542 | Apollo Beach Truck & Equipment Repair | I03; I08; I09; I26; I29; I30; +4 more | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 543 | Apollo Beach Truck & Equipment Repair (1) | I13; I15; I19; I20; I21; I22 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 544 | Apr 24, 2026 | I16; I23; I24 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 545 | Asbury Park Truck Repair | I07 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 546 | Athens Roadside Truck Repair | I07 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 547 | Aug 14, 2026 | I15 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 548 | Aug 27, 2026 | I12; I14; I15 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 549 | Aug 28, 2026 | I12 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 550 | Bancescu & Sons Truck & Trailer Repair | I03; I08; I09; I29; I30; I32; +3 more | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 551 | Bancescu & Sons Truck & Trailer Repair (1) | I15; I19; I20; I21; I22 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 552 | Becky Gonzales | I27 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 553 | C-100 | I25 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 554 | C-1224 | I16; I43 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 555 | C-3759 | I17; I18 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 556 | C-834 | I17; I18 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 557 | C-835 | I17; I18 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 558 | C-99 | I25 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 559 | CALINV134346 | I17; I18 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 560 | Cameron Johnston | I27 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 561 | Carolina Truck & Trailer Repair | I40 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 562 | Carrick & Sons Truck & Trailer Repair | I03; I08; I04; I09; I28; I38 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 563 | Carrick & Sons Truck & Trailer Repair (1) | I15; I19; I20; I21; I22 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 564 | CM2-100 | I14; I29; I30; I32; I33 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 565 | CM2-101 | I14; I29; I30; I32; I33 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 566 | CM2-2821 | I28; I31 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 567 | CM2-395 | I26 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 568 | CM2-418 | I26; I28 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 569 | CM2-552 | I15; I29; I30; I31; I32; I33 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 570 | CM2-99 | I14; I29; I30; I32; I33 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 571 | CMLZ Truck Repair - Talladega | I01; I06; I03; I08; I04; I09; +1 more | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 572 | CMLZ Truck Repair - Talladega (5) | I12; I15; I19; I20; I21; I22 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 573 | Colesville Diesel Repair | I03; I08; I09; I36; I38 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 574 | Colesville Diesel Repair (2) | I19; I20; I21; I22 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 575 | Cope Truck Center - Desloge | I03; I08; I09; I38 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 576 | Cope Truck Center - Desloge (2) | I13; I19; I20; I21; I22 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 577 | Coughlin & Sons Truck & Trailer Repair | I03; I08; I09; I36; I38; I39 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 578 | Coughlin & Sons Truck & Trailer Repair (2) | I19; I20; I21; I22 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 579 | Cummins QSX15-G9 | I27 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 580 | Daniel Montoya | I27 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 581 | Dec 12, 2025 | I23; I24 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 582 | Dec 18, 2025 | I23; I24 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 583 | Desert Edge Truck Service & Repair | I03; I08; I04; I09; I26; I28; +7 more | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 584 | Desert Edge Truck Service & Repair (74) | I13; I19; I20; I21; I22 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 585 | Doi Truck Center | I03; I08; I09; I38; I39 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 586 | Doi Truck Center (2) | I19; I20; I21; I22 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 587 | Dorr Truck Center | I01; I06; I36 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 588 | Dorr Truck Center (1) | I12 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 589 | Dunn Truck and Trailer Repair | I31; I39 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 590 | Duty - 9919 | I23; I24 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 591 | East Shoreham Truck & Equipment Repair | I17; I18 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 592 | Forrest City Diesel & Fleet Repair | I40 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 593 | Gerald Ortiz | I27 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 594 | Glendale Diesel & Fleet Repair | I36; I39 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 595 | Halfmoon Truck Repair | I01; I06; I04 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 596 | Hays Heavy Duty Truck & Equipment Repair | I40 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 597 | Henderson Mobile Truck Repair | I04; I39 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 598 | Hillcrest Heavy Truck Repair Inc | I40 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 599 | Hino Incomplete Vehicle | I27 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 600 | Holly Springs Mobile Truck Repair | I40 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 601 | IN00267805 | I16; I43 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 602 | IN00267944 | I16 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 603 | Inland Heavy Duty Truck Repair | I01; I06; I04; I26; I39 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 604 | Inland Heavy Duty Truck Repair (2) | I12 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 605 | INTERNATIONAL 7400 | I27 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 606 | Jan 10, 2025 | I17; I18 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 607 | Jan 10, 2026 | I23; I24 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 608 | Jan 11, 2025 | I17; I18 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 609 | Jan 13, 2025 | I16; I17; I18 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 610 | Jan 21, 2025 | I16 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 611 | Jan 6, 2025 | I17; I18 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 612 | Jan 7, 2025 | I17; I18 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 613 | Jan 7, 2026 | I16; I23; I24 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 614 | Jan 9, 2025 | I17; I18 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 615 | Jul 23, 2025 | I12 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 616 | Jul 30, 2026 | I15 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 617 | Jun 5, 2025 | I14; I15 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 618 | Kannapolis Truck & Equipment Repair | I17; I18 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 619 | Khaled's Diesel Repair | I40 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 620 | Kinder Truck Repair | I17; I18 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 621 | La Salle Truck Repair | I17; I18 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 622 | Lamkin Diesel Services Inc (1) | I13 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 623 | Lansing Truck & Trailer Repair | I01; I06 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 624 | Lansing Truck & Trailer Repair (1) | I13 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 625 | Lee Truck Center - Plainville | I40 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 626 | Leland Diesel & Fleet Repair | I04 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 627 | M & V Truck & Trailer Repair | I40 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 628 | Mar 14, 2025 | I16 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 629 | Mar 17, 2025 | I16; I23; I24 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 630 | Mar 22, 2025 | I16 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 631 | Mar 7, 2025 | I16; I23; I24 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 632 | May 28, 2026 | I25 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 633 | May 5, 2026 | I25 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 634 | McGarvie Mechanical Services | I31; I39 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 635 | Melanie Garner | I27 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 636 | Mobile Truck & Trailer Repair Blackfoot | I01; I06; I04; I26; I36; I39 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 637 | Mobile Truck & Trailer Repair Blackfoot (6) | I12 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 638 | Mobile Truck & Trailer Repair Island Lake | I01; I06 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 639 | Mobile Truck & Trailer Repair Island Lake (2) | I12 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 640 | Monroe Truck Service & Repair | I04; I26; I36; I39 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 641 | Monroe Truck Service & Repair (7) | I13 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 642 | Needles Truck & Equipment Repair | I01; I06; I39 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 643 | Needles Truck & Equipment Repair (2) | I13 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 644 | Net 15 | I15 (after); I19 (after); I20 (after); I21 (after); I22 (after) | DATA | a customer's credit term (example) |
| 645 | Net 30 | I14 (after); I15 (after); I19 (after); I20 (after); I21 (after); I22 (after); +1 more | DATA | a customer's credit term (example) |
| 646 | Net 45 | I19 (after); I20 (after); I21 (after); I22 (after) | DATA | a customer's credit term (example) |
| 647 | New Castle Diesel Performance | I17; I18 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 648 | Newman's Diesel Repair | I17; I18 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 649 | North Kensington Truck and Trailer Repair | I01; I06; I26 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 650 | North Kensington Truck and Trailer Repair (1) | I13 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 651 | Nov 17, 2025 | I23; I24; I25 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 652 | Oakland City Truck & Trailer Repair | I28; I39 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 653 | Oct 27, 2025 | I25 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 654 | Open Ba | I26 (before); I31 (before) | DATA | a heading cut at the window edge on a production picture (today's A/R Detail is wider than 1440 px) |
| 655 | Oxon Hill Truck Shop | I17; I18 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 656 | P77573 | I17; I18 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 657 | P77621 | I17; I18 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 658 | Rockaway Mobile Truck Repair | I01; I06 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 659 | Rockaway Mobile Truck Repair (3) | I13 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 660 | S2-14001 | I31 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 661 | S2-14129 | I26 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 662 | S2-14703 | I29; I30; I32; I33 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 663 | S2-14868 | I29; I30; I32; I33 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 664 | S2-14949 | I29; I30; I32; I33 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 665 | S2-15023 | I29; I30; I32; I33 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 666 | S2-15067 | I26 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 667 | S2-15086 | I26; I29; I30; I32; I33 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 668 | S2-15113 | I28 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 669 | S2-15192 | I26 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 670 | S2-15312 | I29; I30; I32; I33 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 671 | S2-15319 | I26 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 672 | S2-15356 | I28 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 673 | S2-15682 | I31 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 674 | S2-15887 | I27 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 675 | S2-16051 | I31 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 676 | S2-16146 | I31 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 677 | S2-16654 | I14 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 678 | S2-16747 | I27 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 679 | S2-16912 | I27 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 680 | S2-17095 | I27 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 681 | S2-17102 | I12 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 682 | S2-17277 | I27 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 683 | S2-17388 | I27 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 684 | S2-17415 | I27 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 685 | S2-17435 | I27 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 686 | S2-17477 | I27 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 687 | S2-17481 | I27 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 688 | S2-17530 | I12 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 689 | S2-17554 | I27 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 690 | S2-17578 | I27 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 691 | S2-17579 | I27 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 692 | S2-7302 | I26 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 693 | S2-8092 | I12; I26 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 694 | S2-8650 | I26; I28 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 695 | S2-8771 | I12; I26 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 696 | S3-14144 | I26; I29; I30; I32; I33 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 697 | S3-14690 | I15 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 698 | S3-14691 | I15 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 699 | S3-14692 | I15 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 700 | S3-14693 | I15 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 701 | S3-14900 | I28; I31 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 702 | S3-15401 | I28; I31 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 703 | S3-15628 | I28; I31 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 704 | S3-15660 | I15 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 705 | S3-16408 | I31 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 706 | S3-16679 | I15; I28 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 707 | S3-8848 | I28; I31 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 708 | Sarasota Truck Repair | I17; I18 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 709 | Sep 26, 2026 | I12; I14; I15 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 710 | Sep 27, 2026 | I12 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 711 | Sheppard Truck & Equipment Repair | I04 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 712 | Sheppard Truck & Equipment Repair (1) | I13 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 713 | Sledge Truck & Trailer Repair | I28; I31 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 714 | Spaulding Truck Center | I01; I06 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 715 | Spaulding Truck Center (1) | I12 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 716 | Staging H | I41 | DATA | a location name cut by the open menu |
| 717 | Staging Heavy | I23; I24 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 718 | Staging Heavy Duty - 9919 | I01; I06; I02; I03; I08; I04; +24 more | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 719 | Staging Lethbridge - 4310 | I03; I08; I04; I09; I10; I15; +15 more | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 720 | Tucson Truck Center | I04; I28 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 721 | Unassigned | I27 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 722 | Union Springs Truck Center | I26; I28 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 723 | Union Springs Truck Center (1) | I13 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 724 | Universal City Truck Repair (1) | I13 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 725 | Venice Gardens Truck Repair | I40 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 726 | Wellington Truck Repair | I01; I06; I26; I28 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 727 | Wellington Truck Repair (2) | I12 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 728 | Western Star 4700 | I27 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 729 | XCMG ES125PD | I27 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 730 | Zero Truck and Trailer Repair | I04 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 731 | Émile's Test Fleet | I36 | DATA | example record data (names, numbers, dates, amounts, counts, phones, locations) |
| 732 | 1 Opening order and header sorting | canvas.json pages | OUT-OF-SCOPE | canvas framing (page names, badges, the boards' notes on what the canvas compares); each picture case names its board and badge |
| 733 | 2 Export | canvas.json pages | OUT-OF-SCOPE | canvas framing (page names, badges, the boards' notes on what the canvas compares); each picture case names its board and badge |
| 734 | 3 Collapse all and pinned group rows | canvas.json pages | OUT-OF-SCOPE | canvas framing (page names, badges, the boards' notes on what the canvas compares); each picture case names its board and badge |
| 735 | 4 Location filter and Location column | canvas.json pages | OUT-OF-SCOPE | canvas framing (page names, badges, the boards' notes on what the canvas compares); each picture case names its board and badge |
| 736 | 5 Document links and Switch location | canvas.json pages | OUT-OF-SCOPE | canvas framing (page names, badges, the boards' notes on what the canvas compares); each picture case names its board and badge |
| 737 | 6 Descriptions and pinned column | canvas.json pages | OUT-OF-SCOPE | canvas framing (page names, badges, the boards' notes on what the canvas compares); each picture case names its board and badge |
| 738 | 7 Filters and call list | canvas.json pages | OUT-OF-SCOPE | canvas framing (page names, badges, the boards' notes on what the canvas compares); each picture case names its board and badge |
| 739 | ACCOUNTING | I01 (before); I06 (before); I02 (before); I03 (after); I08 (after); I04 (after); +37 more | OUT-OF-SCOPE | App chrome outside the six reports (top bar, other report menus): not changed by PRD v5; nothing on these reports depends on it. |
| 740 | ACCOUNTS PAYABLE | I01 (before); I06 (before); I02 (before); I03 (after); I08 (after); I04 (after); +37 more | OUT-OF-SCOPE | App chrome outside the six reports (top bar, other report menus): not changed by PRD v5; nothing on these reports depends on it. |
| 741 | ACCOUNTS RECEIVABLE | I01 (before); I06 (before); I02 (before); I03 (after); I08 (after); I04 (after); +37 more | OUT-OF-SCOPE | App chrome outside the six reports (top bar, other report menus): not changed by PRD v5; nothing on these reports depends on it. |
| 742 | Advisor Analysis | I01 (before); I06 (before); I02 (before); I03 (after); I08 (after); I04 (after); +37 more | OUT-OF-SCOPE | App chrome outside the six reports (top bar, other report menus): not changed by PRD v5; nothing on these reports depends on it. |
| 743 | All | I27 (before) | OUT-OF-SCOPE | the production Work Orders list a dead-end link lands on today (SV-5706, fixed by Story 7); not a screen of these reports. Covered by S7-03 and S7-18 (links open the document or ask to switch). |
| 744 | Approved | I27 (before) | OUT-OF-SCOPE | the production Work Orders list a dead-end link lands on today (SV-5706, fixed by Story 7); not a screen of these reports. Covered by S7-03 and S7-18 (links open the document or ask to switch). |
| 745 | AS | I01 (before); I06 (before); I02 (before); I03 (after); I08 (after); I04 (after); +37 more | OUT-OF-SCOPE | App chrome outside the six reports (top bar, other report menus): not changed by PRD v5; nothing on these reports depends on it. |
| 746 | Asset | I27 (before) | OUT-OF-SCOPE | the production Work Orders list a dead-end link lands on today (SV-5706, fixed by Story 7); not a screen of these reports. Covered by S7-03 and S7-18 (links open the document or ask to switch). |
| 747 | Asset on Site | I27 (before) | OUT-OF-SCOPE | the production Work Orders list a dead-end link lands on today (SV-5706, fixed by Story 7); not a screen of these reports. Covered by S7-03 and S7-18 (links open the document or ask to switch). |
| 748 | Assigned to me | I27 (before) | OUT-OF-SCOPE | the production Work Orders list a dead-end link lands on today (SV-5706, fixed by Story 7); not a screen of these reports. Covered by S7-03 and S7-18 (links open the document or ask to switch). |
| 749 | Clock In | I01 (before); I06 (before); I02 (before); I03 (after); I08 (after); I04 (after); +37 more | OUT-OF-SCOPE | App chrome outside the six reports (top bar, other report menus): not changed by PRD v5; nothing on these reports depends on it. |
| 750 | Clocked | I27 (before) | OUT-OF-SCOPE | the production Work Orders list a dead-end link lands on today (SV-5706, fixed by Story 7); not a screen of these reports. Covered by S7-03 and S7-18 (links open the document or ask to switch). |
| 751 | Completed | I27 (before) | OUT-OF-SCOPE | the production Work Orders list a dead-end link lands on today (SV-5706, fixed by Story 7); not a screen of these reports. Covered by S7-03 and S7-18 (links open the document or ask to switch). |
| 752 | Create Work Order | I27 (before) | OUT-OF-SCOPE | the production Work Orders list a dead-end link lands on today (SV-5706, fixed by Story 7); not a screen of these reports. Covered by S7-03 and S7-18 (links open the document or ask to switch). |
| 753 | Ctrl | I01 (before); I06 (before); I02 (before); I03 (after); I08 (after); I04 (after); +37 more | OUT-OF-SCOPE | App chrome outside the six reports (top bar, other report menus): not changed by PRD v5; nothing on these reports depends on it. |
| 754 | Dashboard | I03 (after); I08 (after); I04 (after); I05 (after); I09 (after); I10 (after); +26 more | OUT-OF-SCOPE | App chrome outside the six reports (top bar, other report menus): not changed by PRD v5; nothing on these reports depends on it. |
| 755 | Error fetching work order | I27 (before) | OUT-OF-SCOPE | the production Work Orders list a dead-end link lands on today (SV-5706, fixed by Story 7); not a screen of these reports. Covered by S7-03 and S7-18 (links open the document or ask to switch). |
| 756 | Estimates | I27 (before) | OUT-OF-SCOPE | the production Work Orders list a dead-end link lands on today (SV-5706, fixed by Story 7); not a screen of these reports. Covered by S7-03 and S7-18 (links open the document or ask to switch). |
| 757 | FINANCE | I01 (before); I06 (before); I02 (before); I03 (after); I08 (after); I04 (after); +37 more | OUT-OF-SCOPE | App chrome outside the six reports (top bar, other report menus): not changed by PRD v5; nothing on these reports depends on it. |
| 758 | K | I01 (before); I06 (before); I02 (before); I03 (after); I08 (after); I04 (after); +37 more | OUT-OF-SCOPE | App chrome outside the six reports (top bar, other report menus): not changed by PRD v5; nothing on these reports depends on it. |
| 759 | LABOR | I01 (before); I06 (before); I02 (before); I03 (after); I08 (after); I04 (after); +37 more | OUT-OF-SCOPE | App chrome outside the six reports (top bar, other report menus): not changed by PRD v5; nothing on these reports depends on it. |
| 760 | Lead Technician | I27 (before) | OUT-OF-SCOPE | the production Work Orders list a dead-end link lands on today (SV-5706, fixed by Story 7); not a screen of these reports. Covered by S7-03 and S7-18 (links open the document or ask to switch). |
| 761 | Left: production today, light and dark. Right: this build (round 13, 2026-10-19). PRD Story 8. All at 1440 pixels wide. | Layout.dc.html note | OUT-OF-SCOPE | canvas framing (page names, badges, the boards' notes on what the canvas compares); each picture case names its board and badge |
| 762 | Left: production today. Right: this build (round 13, 2026-10-19). PRD Story 1 and Story 2. | Main.dc.html note | OUT-OF-SCOPE | canvas framing (page names, badges, the boards' notes on what the canvas compares); each picture case names its board and badge |
| 763 | Left: production today. Right: this build (round 13, 2026-10-19). PRD Story 3. | Export.dc.html note | OUT-OF-SCOPE | canvas framing (page names, badges, the boards' notes on what the canvas compares); each picture case names its board and badge |
| 764 | Left: production today. Right: this build (round 13, 2026-10-19). PRD Story 4. Applies to A/R Detail, A/R Collection, A/P Detail and A/P Unpaid Invoices. | Grouped.dc.html note | OUT-OF-SCOPE | canvas framing (page names, badges, the boards' notes on what the canvas compares); each picture case names its board and badge |
| 765 | Left: production today. Right: this build (round 13, 2026-10-19). PRD Story 5 (filters and totals), Story 9 (call list), Story 7 (vendor credit links), Story… | Filters.dc.html note | OUT-OF-SCOPE | canvas framing (page names, badges, the boards' notes on what the canvas compares); each picture case names its board and badge |
| 766 | Left: production today. Right: this build (round 13, 2026-10-19). PRD Story 5 and Story 6. The filter only narrows; nobody's access changes. | Location.dc.html note | OUT-OF-SCOPE | canvas framing (page names, badges, the boards' notes on what the canvas compares); each picture case names its board and badge |
| 767 | Left: production today. Right: this build (round 13, 2026-10-19). PRD Story 7. The top-right location switcher is not changed. | Links.dc.html note | OUT-OF-SCOPE | canvas framing (page names, badges, the boards' notes on what the canvas compares); each picture case names its board and badge |
| 768 | Number | I27 (before) | OUT-OF-SCOPE | the production Work Orders list a dead-end link lands on today (SV-5706, fixed by Story 7); not a screen of these reports. Covered by S7-03 and S7-18 (links open the document or ask to switch). |
| 769 | On Site | I27 (before) | OUT-OF-SCOPE | the production Work Orders list a dead-end link lands on today (SV-5706, fixed by Story 7); not a screen of these reports. Covered by S7-03 and S7-18 (links open the document or ask to switch). |
| 770 | Parts | I01 (before); I06 (before); I02 (before); I03 (after); I08 (after); I04 (after); +37 more | OUT-OF-SCOPE | App chrome outside the six reports (top bar, other report menus): not changed by PRD v5; nothing on these reports depends on it. |
| 771 | PARTS | I01 (before); I06 (before); I02 (before); I03 (after); I08 (after); I04 (after); +37 more | OUT-OF-SCOPE | App chrome outside the six reports (top bar, other report menus): not changed by PRD v5; nothing on these reports depends on it. |
| 772 | Parts Velocity | I01 (before); I06 (before); I02 (before); I03 (after); I08 (after); I04 (after); +37 more | OUT-OF-SCOPE | App chrome outside the six reports (top bar, other report menus): not changed by PRD v5; nothing on these reports depends on it. |
| 773 | PERFORMANCE | I01 (before); I06 (before); I02 (before); I03 (after); I08 (after); I04 (after); +37 more | OUT-OF-SCOPE | App chrome outside the six reports (top bar, other report menus): not changed by PRD v5; nothing on these reports depends on it. |
| 774 | Please try to resolve this. | I27 (before) | OUT-OF-SCOPE | the production Work Orders list a dead-end link lands on today (SV-5706, fixed by Story 7); not a screen of these reports. Covered by S7-03 and S7-18 (links open the document or ask to switch). |
| 775 | Progress | I27 (before) | OUT-OF-SCOPE | the production Work Orders list a dead-end link lands on today (SV-5706, fixed by Story 7); not a screen of these reports. Covered by S7-03 and S7-18 (links open the document or ask to switch). |
| 776 | Request failed with status code 400 | I27 (before) | OUT-OF-SCOPE | the production Work Orders list a dead-end link lands on today (SV-5706, fixed by Story 7); not a screen of these reports. Covered by S7-03 and S7-18 (links open the document or ask to switch). |
| 777 | Sales | I01 (before); I06 (before); I02 (before); I03 (after); I08 (after); I04 (after); +37 more | OUT-OF-SCOPE | App chrome outside the six reports (top bar, other report menus): not changed by PRD v5; nothing on these reports depends on it. |
| 778 | Sales By Representative | I01 (before); I06 (before); I02 (before); I03 (after); I08 (after); I04 (after); +37 more | OUT-OF-SCOPE | App chrome outside the six reports (top bar, other report menus): not changed by PRD v5; nothing on these reports depends on it. |
| 779 | Sales Tax Collected | I01 (before); I06 (before); I02 (before); I03 (after); I08 (after); I04 (after); +37 more | OUT-OF-SCOPE | App chrome outside the six reports (top bar, other report menus): not changed by PRD v5; nothing on these reports depends on it. |
| 780 | Schedule | I01 (before); I06 (before); I02 (before); I03 (after); I08 (after); I04 (after); +37 more | OUT-OF-SCOPE | App chrome outside the six reports (top bar, other report menus): not changed by PRD v5; nothing on these reports depends on it. |
| 781 | Searc... | I03 (after); I08 (after); I04 (after); I05 (after); I09 (after); I10 (after); +26 more | OUT-OF-SCOPE | App chrome outside the six reports (top bar, other report menus): not changed by PRD v5; nothing on these reports depends on it. |
| 782 | Search | I27 (before) | OUT-OF-SCOPE | the production Work Orders list a dead-end link lands on today (SV-5706, fixed by Story 7); not a screen of these reports. Covered by S7-03 and S7-18 (links open the document or ask to switch). |
| 783 | Search customers, work... | I01 (before); I06 (before); I02 (before); I07 (before); I12 (before); I13 (before); +5 more | OUT-OF-SCOPE | App chrome outside the six reports (top bar, other report menus): not changed by PRD v5; nothing on these reports depends on it. |
| 784 | Service Advisor | I27 (before) | OUT-OF-SCOPE | the production Work Orders list a dead-end link lands on today (SV-5706, fixed by Story 7); not a screen of these reports. Covered by S7-03 and S7-18 (links open the document or ask to switch). |
| 785 | Shop Efficiency | I01 (before); I06 (before); I02 (before); I03 (after); I08 (after); I04 (after); +37 more | OUT-OF-SCOPE | App chrome outside the six reports (top bar, other report menus): not changed by PRD v5; nothing on these reports depends on it. |
| 786 | ShopHub | I01 (before); I06 (before); I02 (before); I03 (after); I08 (after); I04 (after); +37 more | OUT-OF-SCOPE | App chrome outside the six reports (top bar, other report menus): not changed by PRD v5; nothing on these reports depends on it. |
| 787 | Status | I27 (before) | OUT-OF-SCOPE | the production Work Orders list a dead-end link lands on today (SV-5706, fixed by Story 7); not a screen of these reports. Covered by S7-03 and S7-18 (links open the document or ask to switch). |
| 788 | Technician Efficiency | I01 (before); I06 (before); I02 (before); I03 (after); I08 (after); I04 (after); +37 more | OUT-OF-SCOPE | App chrome outside the six reports (top bar, other report menus): not changed by PRD v5; nothing on these reports depends on it. |
| 789 | Technician Utilization | I01 (before); I06 (before); I02 (before); I03 (after); I08 (after); I04 (after); +37 more | OUT-OF-SCOPE | App chrome outside the six reports (top bar, other report menus): not changed by PRD v5; nothing on these reports depends on it. |
| 790 | Timesheet Activities | I01 (before); I06 (before); I02 (before); I03 (after); I08 (after); I04 (after); +37 more | OUT-OF-SCOPE | App chrome outside the six reports (top bar, other report menus): not changed by PRD v5; nothing on these reports depends on it. |
| 791 | Unit | I27 (before) | OUT-OF-SCOPE | the production Work Orders list a dead-end link lands on today (SV-5706, fixed by Story 7); not a screen of these reports. Covered by S7-03 and S7-18 (links open the document or ask to switch). |
| 792 | VIN/Serial # | I27 (before) | OUT-OF-SCOPE | the production Work Orders list a dead-end link lands on today (SV-5706, fixed by Story 7); not a screen of these reports. Covered by S7-03 and S7-18 (links open the document or ask to switch). |
| 793 | Work Orders | I01 (before); I06 (before); I02 (before); I03 (after); I08 (after); I04 (after); +37 more | OUT-OF-SCOPE | App chrome outside the six reports (top bar, other report menus): not changed by PRD v5; nothing on these reports depends on it. |
| 794 | WorkOrder not found. | I27 (before) | OUT-OF-SCOPE | the production Work Orders list a dead-end link lands on today (SV-5706, fixed by Story 7); not a screen of these reports. Covered by S7-03 and S7-18 (links open the document or ask to switch). |
