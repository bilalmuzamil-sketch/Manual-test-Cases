# A/R + A/P figure checks on the rebuilt reports, sorting, and the Dashboard Technician Efficiency tile — staging, 16 Nov 2026

**Order:** QA lead 16 Nov, "5. OK 6. OK" (report-gaps hand-back, decisions 5 and 6); brief `WORKER-BRIEF.md`. **No writes to Jira, TestRail, Google Sheets or Slack.** Staging data: nothing created or changed (read-only pass; `seed-log.jsonl` not needed).

**Build:** `v26.45.4-f3d3d2d` read from `meta[name="app-version"]` at the start and end of every run, 09:21–09:58 UTC (unchanged). Code side (for dates only, never as expectation): the six reports were rebuilt by PR #4262 SV-11315 (merged 12 Nov), then SV-12663 (Past Due counted in the screen's zone, 13 Nov), SV-12723 (empty bucket cells sort last, 13 Nov) and SV-12545 (as-of after today, 13 Nov — merge `f3d3d2d17d`, the deployed build).

**Sources re-read 16 Nov ~09:40 UTC (Rule 59):** "A/R and A/P Report Sorting, Export and Location Filter", Confluence **947650561 v13** (13 Nov 2026, per its change log); A/R PRD 82083852 **v25** (last modified 19 Feb 2026, unchanged); Dashboard PRD 788430850 **v53** (last modified 22 Oct 2026, unchanged); Chris Ward's answers (SV-11441 comment 79846; `chris-answers-2026-10-29/` question 1).

**Locations and zones (Rule 99), recorded in every evidence JSON (`start`/`end`):** session `change-location`, browser `timezoneId`, process `TZ` and `localStorage['timezone']` all = the location's zone. Staging Heavy Duty - 9919 = **Asia/Karachi** (offsets agree, +05:00) · Staging Lethbridge - 4310 = **America/Edmonton** · QB Location = America/Vancouver · DVI Test = Pacific/Fiji (offsets agree). `tz_rules_check.py`: Karachi and Fiji MATCH; **Edmonton and Vancouver MISMATCH 1–16 Nov** (browser 1 h behind). Nothing below depends on the gap hour: every as-of figure was computed by the server (it receives the zone name and ends the day under its own rules — its Past Due values agree with the machine's rules on every document), my recompute uses the machine's rules (tz 2026e, same as Node and the server), and the CSV dates come from the server. The screen's own date cells at Lethbridge for 1–16 Nov were not compared (would be NOT VERIFIED in the gap hour).

**Open question that conditions item 1 (not mine to answer):** [SV-12853](https://shopview.atlassian.net/browse/SV-12853) (Bilal, 16 Nov, description tags Chris; **no comments, re-checked 16 Nov ~09:40 UTC**) asks whether Date/Due Date/Past Due should sit on the location's calendar day (this build) or the UTC day (production). My recompute reads dates on the **location's** day, as the build does; every Past Due/bucket PASS below means "consistent under that reading".

---

## Item 1 — A/R Aging Summary / Detail / Collection and A/P Aging Summary / Detail / Unpaid Invoices

**How.** (a) `collect.mjs` read every row of all six reports through the endpoints the screen calls, at Heavy Duty (Karachi) and Lethbridge (Edmonton), as of **16 Nov** (each zone's today) and **30 Sep 2026**, All locations and narrowed to the session's own location — 8 snapshots. (b) `check_reports.py` recomputed every Past Due, bucket, group, Summary row and Totals row from the documents' own dates. (c) `ledgers.mjs` + `ledgers_vendors2.mjs` read the **independent** sources: every customer's own account list (customer card Invoices tab) and Deposits list, every vendor's own Unpaid list at **every** location with that location's vendor account; `check_ledgers.py` compared document by document. (d) `check_history.py` replayed **30 Sep**: open then = open today + every payment applied after the as-of instant (customer payment lists; Export Reports "Vendor Bill Payment"). (e) `screen.mjs` / `check_screen.py`: the screen (Totals, "Total for …" rows, headings, chips, the screen's own request totals) and every CSV and PDF downloaded with the Export menu, at both zones, both dates, all locations and one location (the PDFs re-read in `pdf_extra.mjs`, run alone).

| What was checked | Source (verbatim, version) | Result | Evidence |
|---|---|---|---|
| Every Past Due = as-of day − due day; credit's due date = its own date; every document in its bucket (8 snapshots, both zones) | 947650561 v13 S1-R5a *"Its Past Due … is the number of days from the due date to the as-of date … A credit memo, deposit or vendor credit counts its own date as its due date"*; S5-R15 buckets | **PASS** — A/R 1,790 docs today / 1,126 on 30 Sep; A/P 14,732 / 14,102 (Karachi; 14,101 Edmonton); 0 wrong. Not-yet-due bills read negative (due 1 Oct as of 30 Sep → −1) | `evidence/results-reports.json` |
| Detail group = its rows; Totals = groups; Summary row = its documents per bucket; Summary Totals = rows = Detail open balance by bucket; Collection/Unpaid groups = rows, Totals = groups | S5-R18 *"The Totals row always adds up exactly the rows the filters leave"*; S5-R18a *"A/R Summary's Totals equal A/R Detail's Open Balance Totals bucket by bucket"* | **PASS** on all 8 snapshots. Recompute checks: A/R Summary 7,830 · A/R Detail 53,292 · A/R Collection 16,555 · A/P Summary 20,328 · A/P Detail 525,107 (6 = the two 2-cent bills below) · A/P Unpaid 189,418 | `results-reports.json` |
| Location column "Multiple" / one name; narrowed report = the All-locations documents at that location; Summary rows re-summed; Location list = locations with open documents | S6-R4; S5-R7 *"A row belongs to the location of its own document"*; S5-R8; S5-R3 | **PASS** (A/R 6,144 · A/P 58,191 checks; both locations, both dates) | `results-reports.json` (`own_vs_all`) |
| A/R Collection lists exactly the past-due documents **plus** credits dated on the as-of day (Past Due 0) | 82083852 v25 §6 *"If the calculated days are ≤ 0 … it's not shown"*; Chris, SV-11441 c79846 (29 Oct): *"The Collections report stays as it is: SV-5606 shows today's credits there on purpose"*; S1-R5a | **PASS / by design** — CM2-4462, CM2-4463 (30 Sep) listed with Past Due 0, in Current on Detail | `results-reports.json` |
| A/P Unpaid: vendor credits have no Due Date / Past Due | S2-R6 | **PASS** | same |
| **Independent, today — A/R:** every report document vs the customer's own account list | (the report must show the open documents, S1-E1) | **PASS 9,042/9,042**: 1,790/1,790 documents present with identical open balance, amount, date and due date to the second, own location; every account's buckets and the grand totals rebuilt from the account lists alone = report. 46 deposits **held on open work orders** ($60,975.52) are on the accounts but not the report — **by rule** (SV-11690: *"a held deposit is not an overdue credit — not subtracted from aged A/R"*); free-floating held deposits (e.g. "Excess Payment") are on the report | `results-ledgers.json` |
| **Independent, today — A/P:** every report document vs the vendor's own Unpaid list at its location | S1-E1, S5-R7 | **PASS 72,788**, 14,722/14,732 documents identical (balance, amount, date, due date, location). **NOT VERIFIED: 10 bills at QB Location** (4Refuel ×8, 123 Cannabis Forestlawn ×2, $453.40) — on no vendor list reachable: at QB Location the vendor record resolves to the Heavy Duty account. *Unblock:* open those two vendors' pages at QB Location on screen (Unpaid tab). Vendor-list items not on the report: 58 with a $0.00 balance, 2 vendor credits dated **9 Dec 2026** (after the as-of date) — both correct | `results-ledgers.json`, `ledgers-vendors-all.json` |
| **30 Sep replay** (both zones) | 82083852 v25 *"If an invoice was unpaid on the selected date but paid later, it must still appear"*; S5-R10b | **A/R PASS 1,040/1,040** invoices identical at both zones. **A/P 12,769/12,771** identical; the 2 = 055-541861 / 069-855902 (below). 15 bills paid after 30 Sep are not on the 30 Sep report — none is dated on or before 30 Sep (Vendor Bill export, bills dated 1 Oct 2025–30 Sep 2026): **PASS**. 1 bill paid on 30 Sep/1 Oct cannot be placed from a day-level file (E2E-INV-1788876755272): NOT VERIFIED, its replay still matched | `results-history.json` |
| Screen: "As of" chip, headings (Title Case, Location only with 2+ locations), Totals row, "Total for …" rows, the screen's own request totals = data | S5-R1, S2-R1, S2-R4a, S6-R2, S5-R18, S3-R7a screen format "$-11,111.00" | **PASS** (all six, both zones, both dates, all and one location) | `results-screen-downloads.json` |
| CSV (all six × 2 zones × 3 variants): As of / Locations lines, headings = screen, "Aging Bucket", Phone + Credit Term after Customer, money plain 2 decimals / empty bucket blank, dates YYYY-MM-DD, every row and value = data, one Totals row = data = sum of rows, opening order | S3-R4, S3-R5, S3-R8, S3-R8a, S3-R8b, S3-R3, S1-R1/R5/R6 | **PASS** (CSV checks 100%). Observation: a document number starting with "+" is written as `'+8989+` (spreadsheet formula guard; no written rule either way) | same |
| PDF: As of / Locations lines, "Subtotal" never printed, "Total for" per group, date format, Totals figures | S3-R4, S3-R5, S3-R7, S3-R7a, S3-R7b | **FAIL → D1** for A/R Detail (all PDFs), A/P Detail and A/P Unpaid (long-name vendor), A/R Collection (one location). **FAIL, already reported:** A/R and A/P Summary PDFs drop 61-90 Days / 91 And Over / Total at both zones and both dates = **SV-12831** (Open; Chris c81407 "fix") — not re-filed. A/R Collection PDF with all locations: PASS | `D1-…/D1-evidence.json` |
| PDF over 2,000 rows refused with the exact message | S3-N1 | **PASS** (A/P Detail 14,732 and A/P Unpaid, both zones) | `results-screen-downloads.json` |
| A/P bills whose open balance is 2 cents above the amount (055-541861 $643.36/$643.38, 069-855902 $4.29/$4.31); the 30 Sep report shows $643.36 / $4.29 | — | **Known: SV-12136** (TESTING STAGE) — not re-filed | `results-reports.json`, `results-history.json` |

**28 Oct findings re-checked on the rebuilt reports:** SV-11922 (A/P Past Due one day short, **Open**, re-checked 09:40 UTC) — **the symptom no longer reproduces**: every not-yet-due bill reads as-of minus due date (e.g. due 17 Nov 2026 as of 16 Nov → −1; 372 such bills at Heavy Duty and 360 at Lethbridge as of 16 Nov, 991 / 990 as of 30 Sep), as S1-R5a v13 now states (*"a bill due 9 days after the as-of date reads -9"*). RQ-1 / same-day credit → SV-11441 (Ready for Production) and its S1-R5a behaviour: PASS. RQ-2 (part-sale held deposit) — no part-sale mismatch found: every A/R document equals the account list.

**One transient, not a finding:** two A/R Detail PDFs gave no file and no message within 150 s while three other sessions were loading staging; run alone, the same PDFs arrived in 22 s and 34 s.

## Item 2 — Sorting on every A/R / A/P header (Heavy Duty, as of 16 Nov, all locations)

`sort.mjs` clicked every header label three times on each report (label-click method proven 16 Nov) and recorded aria-sort, the sort request and the server's answer; `sort_check.py` compared each answer with the PRD order computed from the **full** data (whole bucket / group, not only the page shown).

| Report | Headers × 3 clicks | Result | Source |
|---|---|---|---|
| A/R Aging Summary | Customer, Location, Current, 1-30, 31-60, 61-90, 91 And Over, Total | **PASS 63/63** | S2-R1, S2-R2 *"text … A to Z; money columns largest first … The second click reverses it. The third click repeats the first"*, S2-R3 *"A header that is already the sorted column reverses on its first click"*, S2-R6 blanks last, S1-R2–R4 name order |
| A/P Aging Summary | same with Vendor | **PASS 63/63** | same |
| A/R Aging Detail | Date, Location, Transaction Type, ID, Customer Full Name, Due Date, Amount, Open Balance (5 buckets each) | **PASS 103/103** | + S2-R4 number-aware, ties by number in both directions, dates by day; S2-R5 groups never move |
| A/R Aging Collection | Date, Location, Transaction Type, ID, Due Date, Past Due, Amount, Open Balance | **PASS 63/63** | + S1-R6, S2-R5 |
| A/P Aging Detail | 9 headers | **PASS 121/121** | same |
| A/P Unpaid Invoices | 9 headers; Vendor Name not clickable | **PASS 66/66** (incl. S2-N1: no request, no sort mark) | S2-N1 |
| Opening order on every CSV (all six, both zones) | — | **PASS** | S1-R1, S1-R5, S1-R6 |

Observation: for document numbers that start with punctuation or differ in prefix/case ("+8989+", ".0345", "C-13671" vs "c232"), the build orders character by character ignoring capitals, with digit runs by value. The PRD gives only "S1-99 before S1-100 before S1-101"; this reading satisfies it, so no question raised. Not covered: sorting at Lethbridge and on 30 Sep; S2-R7 (sort kept when filters change).

## Item 3 — Dashboard Technician Efficiency tile vs the Technician Efficiency report (28 Oct finding F2 / DQ-1)

**F2 is not "held" any more:** Chris answered DQ-1 on 28 Oct (*"(b) Only billed lines count … Defect."*) and F2 was filed on 29 Oct as **[SV-11931](https://shopview.atlassian.net/browse/SV-11931)** "Dashboard - Technician Efficiency counts a line the customer declined" (parent SV-11839), now **Ready for Production** (re-checked 16 Nov ~09:35 UTC).

| What was checked | Source | Result | Evidence |
|---|---|---|---|
| Tile headline (Invoiced Tech Hrs, Clocked, %) = report totals; every technician row on the tile = the report's row; every report row = its lines — 4 locations × 9 presets + the 25–28 Oct window, read back-to-back | Dashboard PRD v53 S3-R2 *"Invoiced technician hours divided by clocked hours, times 100"* | **PASS 587/587** (HD 276, LE 190, QB 40, DVI 81) | `results-te-tile.json` |
| SV-11931's own example: DVI Test, Last 12 Months, Fabian Bonjean, S1-38198 (line 2 declined) | Chris, DQ-1 answer | **PASS — fixed on this build:** tile and report both show **1.00 Clocked / 1.00 Invoiced Tech Hrs / 100 %** (28 Oct: 1.50 / 2.00 / 133.33 %); S1-38198 contributes only line 1. Headline **123.76 % = 5.00 / 4.04** (28 Oct 158.10 % = 8.00 / 5.06; 4.04 = the Billing Efficiency clocked figure SV-11931 cited) | same; screenshots `/tmp` only |
| On screen, zones matched (DVI Fiji, HD Karachi): tile at Last 12 Months and its View details table; the report at Last 12 months | — | **PASS**: DVI tile 123.76 %, Fabian 1.00/1.00/100.00 %; DVI report Totals 4.04 / 5 / 123.76 %, Fabian 1 / 1 / 100 %; HD tile 96.37 %, every drawn row = data | `te-DVI-screen.json`, `te-report-screen-DVI.json`, `te-HD-screen.json` |

**Plainly: F2 is now fixed on staging, and the tile and the report agree everywhere checked.** Nothing to raise; SV-11931 can be retested for QA Complete (not done here — no Jira writes).

## Candidates

| Folder | One line | Quote | Epic |
|---|---|---|---|
| `D1-aging-pdfs-drop-money-columns/` | A/R Aging Detail PDF leaves out Due Date, Amount and Open Balance; A/P Detail / A/P Unpaid Invoices PDFs leave out Amount and Open Balance; A/R Collection PDF with one location the same — whenever a name is one very long word (staging's ZZ test names). Screen and CSV correct. | 947650561 v13 S3-R7b *"each bucket, customer or vendor ends with a row that reads "Total for <name>" … with its Amount and Open Balance. A long name wraps inside that row."*; Chris, SV-12831 c81407 *"every column should always print on the page"* | SV-11936 |

No question candidates: the one open ambiguity (which calendar day) is already with Chris on SV-12853.

## Not covered, and why
- Past due filter and the customer/vendor filter's figures (S5-R16/R17) — not part of this order's figure check; only used to isolate D1.
- The 10 QB Location bills against a vendor list (above) — unblock on screen.
- Screen date cells at Lethbridge/QB in the 1–16 Nov gap hour (Rule 99 h) — not compared; server-side dates were.
- Sorting at a second location / second date.
- A/R Collection phone and credit-term values against each customer card (only the CSV columns were checked).

## Tools and evidence
`tools/`: probe, collect, ledgers, ledgers_vendors2, screen, sort, pdf_extra, te_tile, te_report_screen (.mjs); check_reports, check_ledgers, check_history, check_screen, sort_check, te_check (.py). `evidence/`: one JSON per run (Rule 99 `start`/`end` in each) and one results JSON per checker; `tz_rules_check.txt`; `dup-searches.txt`. Raw data, downloads and screenshots stay in `/tmp/cln/arap/` (customer and vendor names).
