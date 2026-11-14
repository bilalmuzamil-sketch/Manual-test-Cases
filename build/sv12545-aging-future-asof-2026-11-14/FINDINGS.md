# SV-12545 — Aging reports: an as-of date after today works again (staging retest, 14 Nov 2026)

**Verdict: PASSED — every item on Nemanja's QA handoff (comment 81174) observed on staging.** Mode: API mode (QA lead's choice),
silent screen recording (yes), no voice-over, no technical section.

- Environment: https://app.staging.shopview.com, build **v26.45.4-f3d3d2d** (last-modified Fri 13 Nov 2026 21:24:06 GMT), Admin,
  Staging Heavy Duty - 9919 (and Staging Lethbridge - 4310 for the location-switch check). Today on the screen = 11/14/2026.
- Source of the expectation: Chris Ward's ruling (comment 81138, 13 Nov) **and** PRD "A/R and A/P Report Sorting, Export and
  Location Filter", Confluence page 947650561 **version 13** (13 Nov 2026, Chris: "S5-R10b future as-of date (SV-12545)"),
  S5-R10b verbatim: "The as-of date can be any day, including a day after today, as today. For a day after today the report counts
  everything entered so far and counts days past due to the picked day; the chip, the PDF and the CSV all show the picked day.
  A link with an as-of date opens on that date." Ruling and PRD agree (Rule 109).
- Ticket fields: labels AP-AR-FM, QA_Found (no accounting); QA assignee empty; no Powertools plan.

## Checklist (handoff 81174) -> result
| # | Check | Result |
|---|---|---|
| 1 | A/R Summary from the Reports menu opens on today (chip As of: 11/14/2026) | PASSED |
| 2 | Date menu: none of the 30 November days greyed out; next-month (-> December) and next-year (-> 2027) arrows work | PASSED |
| 3 | Pick 31 Dec: chip "As of: 12/31/2026", address `?asOfDate=2026-12-31` | PASSED |
| 4 | Totals move out of Current: Current $43,985.93 -> $113.00; Total $741,764.53 -> $741,940.53 (+$176.00 = 3 documents dated Nov 14 entered but not yet counted "as of this moment": CM2-4540 -$5.00, S2-40375 $61.00, S2-40373 $120.00) | PASSED |
| 5 | 10 Trucking: $300.00 Current today -> 1-30 Days on 12/31, Total unchanged | PASSED |
| 6 | A/P Summary link `?asOfDate=2026-12-31` opens on that day, address kept; Current $0.00; Total moves by -$556.85 = vendor credits C-3845 -$595.35 and C-3846 -$220.50 (Willoughby, dated Dec 9) + 3 bills dated Nov 14 ($78 + $61 + $120) | PASSED |
| 7 | A/R Collection 12/31, 10 Trucking: S2-40221 due Dec 13 -> Past Due 18; not listed today (not past due) | PASSED |
| 8 | A/R Detail 12/31: S2-40221 under "1-30 days past due" | PASSED |
| 9 | A/P Detail 12/31, 123 Cannabis Forestlawn: ZZPV10282011 due Nov 28 (screen shows Nov 28; the handoff said Nov 27 - same instant in another timezone) -> group 31-60, Past Due 33 | PASSED |
| 10 | All six reports open from a later-day link and load (screen + server, 200) | PASSED |
| 11 | Drill-downs keep the day: A/R Summary -> 10 Trucking -> A/R Collection 12/31; A/P Summary -> 123 Cannabis Forestlawn -> A/P Unpaid 12/31 | PASSED |
| 12 | Downloads: PDF header "As of Dec 31, 2026", CSV "As of: Dec 31, 2026" - from the screen (A/R Summary) and on all 6 reports via export (12 PDFs + 12 CSVs, today and 12/31) | PASSED |
| 13 | Filters keep the later day: Past due 1-30, Location (one ticked), Customer | PASSED |
| 14 | Clear the Location chip -> "No record matches these filters" + Clear all filters -> chip stays 12/31, Past due Any, All locations | PASSED |
| 15 | Switch location (top right -> Staging Lethbridge - 4310) keeps 12/31; reload keeps 12/31 | PASSED |
| 16 | `?asOfDate=2026-11-31` and `9999-12-31` open on today, no error message, no failed request; `9999-12-30` opens on 12/30/9999 | PASSED |
| 17 | Earlier day 10/31/2026 works; screen Totals = server for today, 12/31 and 10/31 (same timezone) | PASSED |
| 18 | Every row on 12/31 and today (A/R Detail 1,784 / A/R Collection 1,783 / A/P Detail and A/P Unpaid 14,731 rows): Past Due = days from due date to the as-of day, bucket matches, nothing dated after the as-of day; Summary bucket totals = Detail bucket totals | PASSED (0 mismatches) |

Bad dates at the server: 2026-11-31 -> 400 "This value is not a valid datetime."; 9999-12-31 -> 400 "Invalid as-of date"; 9999-12-30 -> 200.

## Observations, bucketed (Rule 93)
- (c) explained, not a defect: documents dated today (Nov 14) are not on today's report until their time passes - today's report is
  read "as of this moment" (decision D20), unchanged by this fix (AgingAsOfResolver.php in PR #4400: `$cutoff = $requestedDay === $today ? $now : end of day`).
  Seen only because the pass started minutes after local midnight; also my test browser's built-in Edmonton timezone is UTC-7 while the
  server's is UTC-6, so around midnight the browser chip and the server disagreed by a day. Not reproducible with matching clocks.
- (d) NOT this ticket, asked to the QA lead: **A/R Aging Summary PDF - the 61-90 Days, 91 And Over and Total columns run off the right
  edge of every page** when the customer list includes "ZZBREAK <b>bold</b> ... Superlongunbrokencustomername..." (102 characters, no
  spaces). Same on today's PDF and on 12/31 (date-independent). Jira search: SV-12764 covers the A/R Collection *screen* only; SV-12722 the
  customer filter menu only. Not filed. Files: ev/ui/screen-arsum-1231.pdf, ev/side-arsum-today-all.pdf.

## Recording
ev/sv-12545-staging-recording.mp4 - 1 min 54 s, two parts joined (part 1: 96.0 s -> 51.2 s, 44.8 s idle removed; part 2: 127.7 s ->
62.7 s, 65.0 s idle removed), decoded end to end OK, frame grid checked.

## Accounting effect (Rule 121)
None: the aging reports only read data; no document, balance or sync is created or changed by this fix.

## Data / environment
Nothing created. Location switched to Lethbridge for check 15 and switched back to Staging Heavy Duty - 9919 (shared staging).

## Posted (14 Nov 2026)
- Gate: build marker re-read live at 06:31 UTC = v26.45.4-f3d3d2d (unchanged); newest comment still 81174 (Nemanja); fingerprint scan clean; no technical section.
- Comment **81186**: green PASSED panel first, 18-row table, 6 pictures (EX1/EX3 before-after with the ticket's own QA-branch pictures as before) + the recording last; echo read back in order. All 7 uploads' sizes equal the local files.
- Label `QAcomplete` added (kept AP-AR-FM, QA_Found); QA Assignee set to Bilal Muzamil (was empty). **Status left at "Merged to Staging"** - the only transitions offered are Blocked, Close (OBSOLETE), Testing in Staging / Back (TESTING STAGE); neither QA Complete nor Ready for Production is available. Asked the QA lead.
- Side question to the QA lead (not filed): A/R Summary PDF columns off the page - exhibits/SIDE-arsum-pdf-columns-off-page.png.

## Learning check
- New fact for the playbook: on staging the screen sends the BROWSER's timezone with every aging request (`timezone=Asia/Karachi` from a Karachi browser), and Chromium's built-in tz data puts America/Edmonton at UTC-7 while this machine/server use UTC-6 - test a day-boundary behaviour with a browser timezone whose offset matches the server, or results flip around local midnight.

## Follow-up ticket filed — SV-12831 (14 Nov 2026, QA lead said "Yes please")
- https://shopview.atlassian.net/browse/SV-12831 "Aging Summary PDFs: a long name with no spaces pushes the last columns off the page"
- Story Defect, parent SV-11533, priority Medium, labels AP-AR-FM + QA_Found, Product Area Reports & Dashboards, Relates SV-12545. Milos + Chris tagged for the exact fix.
- Staging only (production has no Download (PDF) on these reports). Build re-read before writing: v26.45.4-f3d3d2d, last-modified Fri 13 Nov 21:24:06 GMT, etag 63a39ad9… (unchanged).
- Re-checked before writing: `61-90` / `And Over` appear on 0 of 28 pages of the A/R Summary PDF and 0 of 47 pages of the A/P Summary PDF; `31-60` appears on every page.
- Pictures: exhibits/PIC1-ar-summary-pdf-columns-off-page.png, exhibits/PIC2-ap-summary-pdf-columns-off-page.png (uploaded as Jira attachments 64495/64496; read back in order).
- SV-12545 status: moved to Done by the QA lead.
- Learning check: nothing new (the ticket followed the standard; picture-render fixes in side_ex.py already noted above).
