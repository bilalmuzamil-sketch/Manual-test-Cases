# Worker F2: the two side observations, checked (29 Oct 2026)

## The checks behind both observations

- **Build.** Staging was on `v26.43.3-8ad4001` for all of these checks. It changed twice today:
  - f8698cb, until about 09:27 UTC;
  - 9272076;
  - 8ad4001, first seen when this check started (before 11:20 UTC).
- **Rule 99 zones.** Each run records four places:
  - the session's change-location;
  - the browser timezoneId;
  - the process TZ;
  - the app's `localStorage['timezone']`.
- **Location key and header check.**
  - Each run also records `localStorage['location']`, and checks the header location at the start and the end of the run.
  - Runs whose end check was faulty are marked below.
  - The runs a verdict rests on all read `VALID: true`: `OBSA_IV_PDF all` (try 4), `OBSA_IV_PDF one`, and both `OBSB_PV_FIND` runs.
- **Writes.**
  - No Jira, TestRail or Google writes.
  - No new test data. The two parts used for OBS B, ZZAUTOTEST-PV1-10282011 and -A12, were only read.

## OBS A: the Inventory Value PDF for all locations fails. **Verdict: REAL** (draft: `SF-A-reports-inventory-value-pdf-fails-under-the-row-limit.md`)

### Filters (Amendment 1)

| Filter | Subject? | Reason |
|---|---|---|
| Location | NO, set to its widest choice | All locations is the widest choice. It gives the largest view, and single locations of 3,699 and 5,965 rows fail too. |
| As of | NO | Kept at its default, today. The report cannot run without a date. |
| Category, Vendor | NO | Left on "All". |
| Search | NO | Left empty. |
| Columns | NO | Left at the first-visit default, all 12 columns. |

### What the screen did

I clicked Download (PDF) 4 times, all on screen, all at 11:31–11:37 UTC.

| Run | Request | Server answer | Message on screen | File |
|---|---|---|---|---|
| 1 | inventory-value/export?format=pdf, All locations | HTTP 500 after about 24 s | **"This report is too large to export. Narrow the date range or filters, then try again."** | none |
| 2 | same | HTTP 500 | same | none |
| 3 | same | HTTP 500 | same | none |
| 4 | same | HTTP 500 after 29 s (requestId recorded in the meta) | same | none |

The body of each 500 was `"An error occurred. We're sorry for this inconvenience, please try again a bit later."` with a requestId.

- **Header check for these runs.**
  - Runs 1–3: the header location is confirmed at the start only. The end check fired before the page opened, a fault in my tool, since fixed.
  - Run 4: VALID at both start and end.
- **Control.** At one location (DVI Test, 2 rows) the PDF arrived in 1 s, and the message read "Success Data exported successfully."

### Where the boundary is

These are server data reads, using the same request the page sends (`evidence/f2/obsA_iv_export_run1.json`, `obsA_iv_pdf_boundary.json`).

| View | Rows | PDF | CSV |
|---|---|---|---|
| DVI Test | 2 | 200, 0.9 s | 200, 0.5 s |
| QB Location | 1 | 200, 1.3 s | 200 |
| Lethbridge, search "FILTER" | 229 | 200, 4 s | — |
| Lethbridge, search "20" | 469 | 200, 19 s | — |
| Lethbridge, search "10" | 767 | 200, 14 s | — |
| Lethbridge, search "2" | 2,305 | 200, **98 s** | — |
| Lethbridge | 3,699 | **500**, 146 s | 200, 1.6 s |
| Heavy Duty | 5,965 | **500**, 58 s | — |
| Heavy Duty, first try | 5,965 | 502 Bad Gateway (and its CSV also 502), right after the Lethbridge 500; not counted | 502 |
| Heavy Duty + Lethbridge | 9,664 | **500**, 53 s | 200, 2.3 s |
| All locations | 9,667 | **500**, 56 s | 200, 2.2 s |

- **The boundary sits between 2,305 and 3,699 rows.**
- It looks tied to how long the PDF takes to build rather than to the row count itself. This matches SV-8818, which found that the same rows with fewer columns succeed.
- **Parts Velocity, for comparison.** It refuses politely: All locations, Last 90 days gives HTTP 400 "This report is too large to export. Narrow the date range or filters, then try again." That view is over 10,000 rows (12,997).

### What the documents say

- **Source:** Inventory Value PRD, Confluence 720142338, last modified 13 Aug 2026. Read in full today through the Atlassian MCP, page by id.
- **S10-R12:** the cap is **10,000 rows**, set "to keep a single-shot export renderable". Above the cap the message reads "…Narrow the filters, then try again." (the date-range clause was dropped for this report on 13 Aug 2026).
- **S10-R14:** a failed download shows "Failed to export inventory value report (pdf)".
- **The build does not match.**
  - A view of 9,667 rows is under the cap, so it should export.
  - On failure the screen shows the "too large" text, worded with the date-range clause.
- **Searches recorded:**
  - CQL `text ~ "\"too large to export\"" AND type = page` returned 0 results. Chris Ward's personal-space pages are not returned by text search.
  - The PRD page was read by id instead.
- **Code facts** (read only for the mechanism, never as the expectation):
  - `ExportRowCapGuard::MAX_ROWS = 10_000` in the API.
  - `app/src/utils/reporting.ts` maps every export failure to the one "too large … date range or filters" string. Its comment cites SV-8818.

### Duplicate check (live, read-only)

- **Query 1, complete:** `project = SV AND text ~ "\"Inventory Value\"" AND (text ~ "PDF" OR text ~ "export" OR text ~ "download")` returned 42 issues, all read.
  - None is open for this failure.
  - **SV-8818** (Done, 24 Aug 2026) is the same symptom, now back.
  - SV-9284 (Done) changed the size-cap message wording.
- **Query 2, partial:** `project = SV AND statusCategory != Done AND (summary ~ "PDF" OR summary ~ "export" OR summary ~ "download" OR text ~ "\"Failed to export\"")`. I read the first 60 results; none matches. SV-11445 is about A/R and A/P background exports.
- Lists: `evidence/f2/side-obs/jql_A1_…txt`, `jql_A2_…txt`.

### Dashboard

Not affected. The Dashboard PRD (page 788430850, last modified 22 Oct 2026) never mentions Inventory Value or Parts Velocity (grep: 0 hits).

## OBS B: Parts Velocity Last Sale may count days in UTC. **Verdict: NOT REPRODUCED.** No ticket; one PO question is open.

**The idea that the count uses UTC dates is wrong.** Last Sale counts **full 24-hour periods since the sale**, the same in every time zone.

### Exact sale times

The API's `historyTimestamp` values are in UTC:

| Part | Sale (invoice created, UTC) | Same moment in the location's zone |
|---|---|---|
| ZZAUTOTEST-PV1-10282011 (DVI Test) | S1-38206, pick 2026-10-28 20:34:01Z | 4:34 PM 28 Oct, Toronto |
| -A12 (Staging Heavy Duty) | S2-38197, invoice.created 2026-10-28T19:14:24Z | **00:14 AM 29 Oct, Karachi** |

The S1-38206 invoice itself was created at 20:36:46Z, reversed and created again at 20:38:05Z.

### Read live on screen (VALID runs)

Both reads used Last 12 months, All locations, and the search box only as a finder.

| Part | Read at | Screen | Server | UTC-day reading | Location-day reading | Full 24 h periods |
|---|---|---|---|---|---|---|
| -A12 | 11:38 UTC = 4:38 PM 29 Oct, Karachi | **0 days** | 0 | 1 | 0 | **0** |
| ZZAUTOTEST-PV1 | 11:38 UTC = 7:38 AM 29 Oct, Toronto | **0 days** | 0 | 1 | 1 | **0** |

- **-A12 rules out the UTC reading.** The sale fell on 28 Oct in UTC, so a UTC count would say 1 day; the screen says 0.
- **ZZAUTOTEST-PV1 rules out the location-day reading.** The sale fell on 28 Oct in Toronto, so a Toronto-day count would say 1 day; the screen says 0.
- **Only "full 24-hour periods since the sale" fits both.**
- The server script (`side-obs/obsB_lastsale_*.json`) scanned all four locations for parts with a Last Sale of 0–3 days and found 3:
  - -A12 and ZZAUTOTEST-PV1 match the 24-hour reading only.
  - The third, N68SL-356, matches none of the three readings: its newest pick in the history is 22 Oct, so its last sale (2 days) came by another route. It was left out.
- The code agrees: `FLOOR((TO_SECONDS(now) − TO_SECONDS(last_sold_at)) / 86400)` in `DbalPartsVelocityFetcher.php`. That is a fact about the build, not the expectation.
- **The clock today.** At 11:38 UTC the Toronto and UTC dates were the same, so I could not read the screen at a moment when the two dates differ. The server data and the exact timestamps cover that case.

### What the documents say

- **Expected basis: NOT FOUND IN DOCUMENTS.**
- PV PRD (Confluence 620888066, last modified 14 Sep 2026; the local copy of 28 Oct is current):
  - S5-R4: "Whole days from today to the part's most recent sale at the selected location(s)".
  - Terminology: "Whole days between today and the part's most recent sale".
- No line says whether "today" is the location's day, or whether a sale yesterday afternoon counts as 1 day or 0.
- **Searches recorded:**
  - grep of the PV PRD for `time zone|timezone|UTC|location's day|midnight|today`: no time-zone rule.
  - The Technician Utilization PRD S1-R7 sets a time-zone rule for that report only.
  - Dashboard PRD S10-R8 ("in the workplace's timezone") covers the tiles and the reports the Dashboard links to. Parts Velocity is not one of them.
  - Chris's 39 answers: only Q18 is about Last Sale (no-stock sales), not about day counting.
- Under Rule 58 the build is not used to settle this. **PO question for Chris** (not sent):
  - *"Parts Velocity, Last Sale: a part sold yesterday at 4 PM shows '0 days' this morning, and turns to '1 day' only at 4 PM today, 24 hours after the sale. Should it count calendar days in the location's time zone (yesterday = 1 day), or full 24-hour periods (as built)?"*

### Duplicate check

JQL `project = SV AND (text ~ "\"Last Sale\"" OR text ~ "\"days since\"") AND text ~ "Velocity"` returned 16 issues, all read. None is about day counting or time zones.

### Knock-on for SV-11943

The Expected figure "91 days on 29 Oct" counts calendar days. Under the 24-hour rule as built, it would read 90 or 91, depending on the time of day of the 30 Jul sale. The defect is unaffected (161 against about 91). The fix is to state the Expected as "70 days fewer than the screen shows" (30 Jul − 21 May = 70 days); see `RESULT-f2-followup.md`.
