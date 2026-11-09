# Jira writes, 4 Nov 2026 (21:20–21:24 UTC): SV-11839 TESTING QA tickets

QA lead's instruction (4 Nov, verbatim): *"The tickets if they turn out to be QA passed, please move their starus to QA complete, assign Bilal Muzamil as a QA assignee and add the existing label to the ticket QAcomplete. Those whoch do not pass the QA move them to rejected from testing status and tye ricket comment should clearly state in clear comment for a layman to u derstand with the annotated screenshot why it failed."*

Verdicts were checked against the committed evidence before anything was written (Rule 86). SV-11826's same-instant reads and SV-11931's and SV-11826's screenshots were opened and checked by hand.

## What was written

For each ticket, three writes were made:

1. a "QA passed" comment
2. labels: the existing labels plus `QAcomplete`
3. QA Assignee (customfield_10385): Bilal Muzamil **added**; Mudassir Qamar was kept where he was already set

Then transition 10 (TESTING QA → QA Complete) was run.

The read-back at 21:24 UTC shows all 12 with status QA Complete, label QAcomplete and Bilal as a QA Assignee.

| Ticket | Comment id | Labels after | QA Assignee after | Status after |
|---|---|---|---|---|
| SV-11691 | 80141 | QA_found, QAcomplete, calculation, reports | Bilal Muzamil, Mudassir Qamar | QA Complete |
| SV-11820 | 80142 | QAcomplete | Bilal, Mudassir | QA Complete |
| SV-11821 | 80143 | QAcomplete | Bilal, Mudassir | QA Complete |
| SV-11823 | 80144 | QAcomplete | Bilal, Mudassir | QA Complete |
| SV-11824 | 80145 | QAcomplete | Bilal, Mudassir | QA Complete |
| SV-11825 | 80140 | QAcomplete | Bilal, Mudassir | QA Complete |
| SV-11826 | 80146 | QAcomplete | Bilal, Mudassir | QA Complete |
| SV-11827 | 80147 | QAcomplete | Bilal, Mudassir | QA Complete |
| SV-11828 | 80148 | QAcomplete | Bilal, Mudassir | QA Complete |
| SV-11829 | 80149 | QAcomplete | Bilal, Mudassir | QA Complete |
| SV-11931 | 80150 (edited once to fix the order of a worked sum) | QAcomplete | Bilal | QA Complete |
| SV-11934 | 80151 | QAcomplete | Bilal | QA Complete |

## Not written (left in TESTING QA, no comment)

- **SV-11822**: the ticket's own condition (DVI Test) does not exist on sv11839. It was neither a pass nor a fail, so it is held for the QA lead.
- **SV-11885**: 8 of the 11 downloads were checked and passed. Vendor Credit Memo, Journal Entry, Sales Representative Assignments, QuickBooks and the tab/carriage-return part were not verified. Partial scope, so it is held for the QA lead.

No ticket failed, so no Rejected from Testing transition was made and no failure picture was needed.

No new ticket was filed: the two separate issues need a source first (see `RESULTS.md`).

## Follow-up, 5 Nov 2026 (≈03:55 UTC): SV-11885

The QA lead pointed me at the "6. Test Tickets" session (facts only, Rule 98). Its notes plus the product code explained the three gaps:
- **Vendor Credit Memo** lists only credits made through Parts → Returns.
- **Sales rep:** the customer's rep is saved as first/last name text.
- **Journal Entry:** the description always starts "Inventory …", so only the Location cells can start with = + - @.

The worker re-tested on 5 Nov, 03:20–03:45 UTC. Every one of the 11 downloads guards with exactly one apostrophe, including Location columns and a leading tab or carriage return. No unguarded cell, no double apostrophe, no number touched.

Test Location was renamed for 79 s. The read-back after restore is identical to the original record. QuickBooks was skipped on the QA lead's instruction.

Verified from committed evidence before writing (Rule 86):
- `SV-11885/raw-bytes-test-records-2026-11-05.txt`
- `scan-test-location-2026-11-05.json` (0 unguarded / 0 double / 0 guarded numbers)
- `evidence-test-location-rename.json` (`record_identical_after_restore: true`)

| Ticket | Comment id | Labels after | QA Assignee after | Status after |
|---|---|---|---|---|
| SV-11885 | 80170 | QAcomplete | Ayesha Khan, Bilal Muzamil | QA Complete |

Read-back by JQL (`labels = QAcomplete AND cf[10385] = Bilal AND cf[10385] = Ayesha AND status = "QA Complete"`) returned SV-11885. The MCP read tools stopped echoing labels and custom fields on 5 Nov, so JQL is the check now.

**Totals for the 14:** 13 QA Complete, 1 held (SV-11822).

## 5 Nov 2026: questions to Chris Ward (QA lead's instruction: "Send a comment to Chris in Jira, in a layman non technical format ... very concise")
| Ticket | Comment id | Question |
|---|---|---|
| SV-11691 | 80171 | A credit given today shows as "1-30 Days" late in A/R Aging, while a same-day invoice shows "Current". Fix or leave? |
| SV-11885 | 80172 | Export Reports with nothing to export gives no file and no message. Fix or leave? |
Both @mention Chris Ward (712020:aa00b8d6-…). Checked before posting: the A/R Aging picture `SV-11691/5-ar-aging-summary-wellington.png` (row ZZAUTOTEST QA11839 Credit: Current $185.58, 1-30 Days $-25.00) and the empty-export repro of 4 and 5 Nov.

## 5 Nov 2026 (≈05:10 UTC): SV-11822 passed, plus a deploy request
- **SV-11822:** comment 80173; labels → QAcomplete; QA Assignee → Mudassir Qamar + Bilal Muzamil; transition 10 → QA Complete.
  - JQL read-back returned it.
  - Evidence (Rule 86 check): `SV-11822/evidence-DVI-1536x936.json` (all checks visible + on screen + 4 items), `evidence-DVI-1920x1080.json`, `evidence-LB-1536x936.json`, `rule99_at_checks_all_match: true`.
  - DVI Test copied from staging; created on sv11839 with id 93404b24-…, left in place.
- **SV-12199:** comment 80174 to Milomir. sv11839 still runs v26.45.0-aacb66c, which predates the SV-12199/12201/12202 fixes (c93ba940d, da8754eca, 277b24901 on branch SV-11839). Asked him to deploy.

**Totals for the original 14:** all 14 QA Complete.

## 5 Nov 2026 (≈06:39 UTC): Milomir's four new TESTING QA tickets, build v26.45.0-277b249
Verdicts checked against committed evidence first (Rule 86), from `../sv11839-ticket-qa-2026-11-05/`:
- 12199: `customer-invoice-today-extract.csv`, Terms COD.
- 12201: `payroll-timesheet-today-extract.csv`, 2.00.
- 12146: `step-read-after-pay2.json` (−$100.00 Applied twice), `remittance-after-payment-1-text.txt`, and `FAIL-annotated.png`, opened by hand.

| Ticket | Comment id | Labels after | QA Assignee after | Status after |
|---|---|---|---|---|
| SV-12199 | 80178 | QAcomplete | Bilal Muzamil | QA Complete |
| SV-12201 | 80179 | QAcomplete | Bilal Muzamil | QA Complete |
| SV-12146 | 80180, layman comment with the annotated picture embedded (upload size 254858 = file size) | unchanged | unchanged | REJECTED FROM TESTING (transition 15) |

Read-back by JQL (`labels = QAcomplete AND cf[10385] = Bilal AND status = "QA Complete"`) returned SV-12199 and SV-12201.
SV-12202 is pending: the after-midnight Last Sale read runs at 07:05 UTC.

## 5 Nov 2026: SV-11822 reopened by Mudassir Qamar (comment 80176)
- The QA lead deleted our "QA passed" comment 80173. The ticket is now REJECTED FROM TESTING.
- QAcomplete and QA Assignee from our 05:10 write are still on it. This was not changed: it is the QA lead's call.
- Retest: `../sv11839-ticket-qa-2026-11-05/SV-11822-retest/RESULT.md`. 24 checks at DPR 1.25 on sv11839 and staging opened the list every time.

## 5 Nov 2026 (≈07:08 UTC): SV-12202 passed
- Evidence checked (Rule 86): `../sv11839-ticket-qa-2026-11-05/SV-12202/pv-control-same-day.json` (Last Sale "0 days") and `pv-after-midnight.json` ("1 day"), both on v26.45.0-277b249.
- Comment 80182; labels → QAcomplete; QA Assignee → Bilal Muzamil; transition 10 → QA Complete.
- JQL read-back returned SV-12202.
- The comment gives no clock times on purpose. This machine's time-zone data puts Edmonton at UTC−6, while the test browser uses UTC−7 (DST ended 1 Nov 2026). So the sale was 10:23 or 11:23 PM on 4 Nov, and the read 12:06 or 1:06 AM on 5 Nov. The dates are the same either way.
- The 80179 comment on SV-12201 says "11:25 PM Edmonton time"; under UTC−7 it is 10:25 PM. Same date, verdict unaffected.

**Totals for Milomir's four:** 3 QA Complete (SV-12199, SV-12201, SV-12202), 1 Rejected from Testing (SV-12146).

## 5 Nov 2026 (≈07:55–08:05 UTC): QA lead's three instructions
QA lead, verbatim: *"1. Rather ask Mudassir thankfulky and respectfully on slack. Yes remove QA complete label and keep Mudassir and ayesha assigned as a QA assignee. 2. Create a ticket with all the evidences amd then in the comment ask. Bris ward to confirm the expected behavior and tell if we should fix it and keave it as is, be thankful and respectful to chris always. 3. Yes see if chris has responded."*

1. **SV-11822**
   - Labels set to none (QAcomplete removed). QA Assignee set to Mudassir Qamar + Ayesha Khan (Bilal removed).
   - JQL read-back confirms both.
   - Slack DM to Mudassir (user U0B7LKF4YJ2), 07:55 UTC: https://shopview.slack.com/archives/D0B80VBM789/p1793865304011389. It asks for the 5 Nov evidence, his Chrome version, and a Guest-window retest at 100% zoom.
   - At 07:57 UTC Mudassir attached 3 screenshots (attachments 63637/63638/63639). One is saved as `../sv11839-ticket-qa-2026-11-05/SV-11822-retest/mudassir-sv11839-TestLocation.jpg`: the Test Location chip is clicked and no list shows.
2. **New ticket SV-12207** (Bug, Medium, Product Area Parts, label QA_found, Relates to SV-12146): *"Vendor remittance slip shows the next day's date for payments and credits made in the evening"*.
   - Pictures embedded: slip, Payments tab "Yesterday", Unpaid Invoices "Nov 4". Upload sizes equal the file sizes.
   - The slip PDF is attached.
   - Chris Ward comment 80185 (@mention, thankful, asks to confirm the expected behaviour and fix or leave).
   - Evidence: `../sv11839-ticket-qa-2026-11-05/REMIT-DATE/` and `SV-12146/step-read-remitdate-recheck.json`. Fresh read at 07:56 UTC (Edmonton 00:56 on 5 Nov), build 277b249, Rule 99 all_match true. All 3 slips print Date and Credit Date Nov 5; on screen it is "Yesterday" / Nov 4.
   - The slip template and handler are byte-identical on main, develop and SV-11839.
3. **Chris Ward:** no reply yet on SV-11691 (80171) or SV-11885 (80172). The newest comment on each is still ours, checked 07:58 UTC.

## 5 Nov 2026 (≈08:12 UTC): annotated pictures added to every open question to Chris
QA lead, verbatim: *"Never post a question to chris wothout annotated screenshot to make it easier for him to understand what are we referring to"*.

| Ticket | Comment | Picture embedded | Source |
|---|---|---|---|
| SV-11691 | 80171 (edited) | `SV-11691-credit-aging-annotated.png` (199004 B) | A/R Aging Summary of 4 Nov |
| SV-11885 | 80172 (edited) | `SV-11885-empty-export-annotated.png` (364699 B) | fresh repro at 08:05 UTC, Test Location, Asia/Karachi, build 277b249, Rule 99 all_match true, export answered `{"data":[""]}`, no file, no message (`CHRIS-PICS/export-vcm-yesterday-empty-0805.json`) |
| SV-12207 | 80185 (edited) | the existing slip picture (attachment 63650), re-embedded without duplicating | — |

Read back: comment 80185's renderedBody holds `<img …/attachment/content/63650>`. For the other two, the API confirmed `inlineMediaEmbedded: true`.
The rule is recorded as an amendment to Rule 103 (`build/rules/RULES-61-97.md`) and in the CLAUDE.md index.

## 5 Nov 2026 (≈09:55 UTC): same-day credit aging question moved to its own ticket, SV-12208
QA lead, verbatim: *"For this comment since the ticket is now ready for production, do you think that woild be a good idea to reat a separate ticket for this and then in the comment ask chris if this is an expected behavior or we want to improve it 80171 … make sure in the main ticket you edit the comment and post the link of the new ticket"*.

- **New ticket SV-12208**: *"A/R Aging: a customer credit given today shows under "1-30 Days" instead of "Current""*.
  - Bug, Medium, label QA_found, Product Area "Reports & Dashboards", Relates to SV-11691.
  - Annotated picture embedded (upload 199004 B = file size).
  - JQL read-back confirms the fields and the link.
- **Evidence:**
  - `SV-11691/evidence-ar.json`: build aacb66c, read 4 Nov 13:42 Edmonton, Rule 99 all_match true.
  - `seed-log.jsonl` line 31: CM-4190, $25.00, created 19:21 UTC = 12:21 PM Edmonton the same day.
  - No front-end or A/R file changed between aacb66c and 277b249 (`git diff --stat`: export and Parts Velocity files only).
  - Confluence search (title or text "A/R Aging" + credit) found no document on credit aging.
- **Chris Ward comment 80193** on SV-12208: @mention, thankful, picture inside the comment, asks "expected behaviour, or improve it?".
- **SV-11691 comment 80171** edited: an "Update (5 Nov 2026)" line at the top links SV-12208 and asks for replies there. The original question and its picture are kept below.

## 5 Nov 2026 (≈10:40 UTC): SV-11885 question moved to SV-12209; epics set
QA lead, verbatim: *"yes do the same for 11885 too"*, plus the epic instruction (Reports → SV-11936, Dashboard → SV-11839).

- **New ticket SV-12209**: *"Reports - Export Reports: clicking Export when there is nothing to export gives no file and no message"*.
  - Bug, Medium, QA_found, Product Area "Reports & Dashboards", **parent SV-11936**, Relates to SV-11885.
  - Picture embedded (upload 364699 B = file size).
  - Evidence: `../sv11839-ticket-qa-2026-11-05/CHRIS-PICS/export-vcm-yesterday-empty-0805.json` (277b249, Test Location, Asia/Karachi, Rule 99 all_match true).
  - The Confluence search found no document on empty exports. The A/R-A/P PRD (page 947650561) covers only those reports' own export.
- **Chris Ward comment 80196** on SV-12209: thankful, picture inside the comment, asks "expected, or improve it, and which option?".
- **SV-11885 comment 80172** edited: an "Update (5 Nov 2026)" line links SV-12209. The original question and picture are kept below.
- **SV-12208:** parent set to **SV-11936**.
- **Read-back:** JQL `key in (SV-12208, SV-12209) AND parent = SV-11936` returned both.
- **Not changed, asked instead:**
  - SV-12207 (vendor remittance slip) is neither a report nor the dashboard.
  - SV-12199/12201/12202 are already under SV-11839 and QA Complete.

## 5 Nov 2026 (≈19:25 UTC check-in): Chris Ward answered all three (14:01–14:09 UTC)
- **SV-12207** (comment 80223): *"Please fix it. The Remittance Slip prints every date in the location's own time zone, the same date the screen shows …"*
  - The description's Expected is rewritten to his answer.
  - All 3 pictures are kept (same media ids).
- **SV-12209** (comment 80225): *"Please fix it: … Export shows the same warning the newer reports already use, "Empty export" with "Export didn't yield any results". No file downloads, and the Export Report window stays open …"*
  - The description's Expected is rewritten to his answer.
  - The picture is kept.
- **SV-12208** (comment 80224): closed by Chris as **OBSOLETE**, a duplicate of **SV-11441**, already decided and built in SV-11315 (PRD S1-R5a).
  - He asked: *"Please check it on SV-11315."*
  - **Not yet done:** the cookies have expired (see `build/BLOCKED-sv11839-and-staging-cookies-2026-11-05.md`), and SV-11315's own QA branch needs its own cookie set.
- **Mistake (Rule 101):** the 17:33 UTC report said "waiting on Chris" for these three without re-checking. He had already answered at 14:01–14:09 UTC.

## 6 Nov 2026 (10:43–10:47 UTC): Dashboard bug hunt, four tickets filed
Every ticket: Bug, Medium, label QA_found, Product Area "Reports & Dashboards", **parent SV-11839**, annotated picture embedded in the description (inline upload, size checked) and the same picture inside the Chris comment.
| Ticket | What | Chris comment | Picture (bytes) | Other |
|---|---|---|---|---|
| SV-12275 | Dashboard chart runs past today on a custom range that ends in the future (worker candidate D1) | 80316 | D1-annotated.png 222,692 | Relates to SV-11468 |
| SV-12276 | Revenue tile vs Sales report disagree for credit memo CM11839-4189 dated 11 PM local (coordinator finding D2) | 80317 | D2-annotated.png 453,109 | |
| SV-12277 | Tile date buttons blue; PRD S12-R2 near-black (worker question Q1; Expected: to be confirmed) | 80318 | Q1-annotated.png 141,685 | |
| SV-12278 | Long custom date label sticks out of the tile at 1024 px (worker question Q2; Expected: to be confirmed) | 80319 | Q2-annotated.png 168,854 | |
- **Duplicate search before filing:** text/summary JQL over credit memo + dashboard/Sales report/time zone (90 days), `parent in (SV-11839, SV-11936)` plus "custom range"/"after today" (60 days), and all of SV-11839 before 28 Oct. No duplicate; nearest are SV-11468 (report chart, Done) and SV-11255 (small screen label, fixed).
- **Read-back:** JQL `key in (SV-12275..SV-12278) AND parent = SV-11839 AND labels = QA_found AND priority = Medium AND "Product Area[Dropdown]" = "Reports & Dashboards"` returned all four, each with exactly one attachment of the uploaded size.
- **D2 evidence (Rule 86, verified by me):** `dashboard-bug-hunt-2026-11-05/evidence/D2-cm-day/` (on-screen run 10:40 UTC, Rule 99 all_match true, Edmonton). The memo's stamp was found by narrowing the Sales report window: present from 2026-11-03T06:00:00Z, absent from 06:00:01Z.

## 6 Nov 2026 (12:10–12:13 UTC): SV-12276 corrected

| Ticket | Write | Result |
|---|---|---|
| SV-12276 | Summary changed to "Dashboard - Revenue tile and Sales report disagree for sales made just after midnight in Edmonton (browser time-zone rules)". Description rewritten (cause, corrected example, steps, correction note); same embedded picture (media f2a0f98f…) | 200; read back |
| SV-12276 | Correction comment tagging Chris Ward, picture embedded, asks fix or leave | comment **80326** |

- **Why:** the worker's cross-check (`dashboard-bug-hunt-2026-11-05/evidence/D2-cm-day-crosscheck/requests.json`) showed the Sales report sends browser-built UTC boundaries (`2026-11-03T07:00Z`, offset 420), while the Dashboard sends plain dates.
- **My own check (Rule 86):** Sales API custom range with UTC−6 boundaries puts CM11839-4189 on **Nov 3** and leaves Nov 2 empty; with UTC−7 boundaries it lands on Nov 2 (`evidence/D2-cm-day-crosscheck/api-boundaries-coordinator-2026-11-06.txt`). System `zdump` (tzdata 2026e) and Node 22 (tz 2026e) both give Edmonton UTC−6 on 6 Nov 2026.
- The as-filed texts are kept as `D2-…/TICKET-as-filed-2026-11-06.html` and `CHRIS-COMMENT-as-filed-2026-11-06.html`.
- **Read-back:** JQL `key = SV-12276 AND parent = SV-11839 AND labels = QA_found AND priority = Medium AND "Product Area[Dropdown]" = "Reports & Dashboards"` returned the ticket with the new summary.

## 6 Nov 2026 (~14:40 UTC): Rule 99 amendment approved; audit of tickets filed or passed since 1 Nov
QA lead, verbatim: *"RUle 99: DO what ensures that the results of your testing/tickets which you create are accurte and your work does not cause me to loose my job."*

Browser vs machine offsets (`build/testing-tools/tz_rules_check.py`, Chromium 153 vs tz database 2026e): Edmonton, Vancouver and Winnipeg are one hour apart from 1 Nov 2026 to 13 Mar 2027. Toronto, Karachi and Fiji match.

| Ticket | Zone / when tested | Inside the gap hour? | Outcome |
|---|---|---|---|
| SV-12276 | Edmonton, credit memo just after midnight 3 Nov | Yes | Already corrected (comment 80326) |
| SV-12207 | Edmonton, payments 05:00–05:20 UTC 5 Nov (11:00–11:20 PM under server rules, 10:00–10:20 PM under browser rules) | Example no; step 2's "after about 5:00 PM" yes | Finding stands. **Comment 80351** corrects step 2 to "after 6:00 PM". Description not edited (it holds embedded pictures) |
| SV-12202 (QA Complete) | Edmonton, sale 05:23 UTC, read 07:06 UTC | Checked under both rules (sale before midnight, read after midnight under both) | Unaffected |
| SV-12201 (QA Complete) | Edmonton, 05:23–05:26 UTC | Only a stray 0.00 row, already explained in RESULT.md | Unaffected |
| SV-12146 (QA Complete) | Edmonton, money amounts | Amounts don't depend on the day | Unaffected |
| SV-12275 | Edmonton, 09:57–10:00 UTC | No (about 3 to 4 AM under either rule) | Unaffected |
| SV-12277, SV-12278 | Visual only | n/a | Unaffected |

Filed under the QA lead's account by another session, not on my branch: SV-12193, SV-12267, SV-12268, SV-12269. None is about a time of day by its title. I didn't check them (Rule 98).

## 6 Nov 2026 (~20:00 UTC): worker hand-back checked (Rule 86); no Jira write

- **Money edge cases (part-sale-only invoice P11839-248, $50 deposit, refund of the $10 credit memo):** PASS, confirmed from `dashboard-bug-hunt-2026-11-05/evidence/area8-money/*.json`. Revenue $172.27 → $202.27 (+$30); deposit and refund move no tile; the tile ($202.27) equals the Sales report for 6 Nov. Read 12:20–12:28 UTC, away from Edmonton's gap hour (06:00–07:00 UTC), so these results stand under Rule 99(i).
- **Which reports build their day in the browser:** confirmed from `evidence/part4-report-ranges/report-ranges.json`.
  - Technician Utilization and Sales By Customer send browser-built start/end times even on a preset (Last Quarter: 2026-07-01T06:00Z, which is right for summer).
  - All five reports do so on a Custom range.
  - Sales By Customer, Custom 4 Nov, sent **start 07:00 UTC**: the browser's older rule; the newest rules give 06:00 UTC.
- **Decision: SV-12276 not updated yet.** The only part observed is what the browser *sends*. A wrong figure *on screen* in Technician Utilization or Sales By Customer has not been seen: no record was made in the gap hour. Rule 94 needs an on-screen reproduction, and Rule 99(h) says a gap-hour result stays NOT VERIFIED until it is checked on the server side. The note is held until a record is seeded in the gap hour and the report is seen on screen to leave it out. That needs fresh sv11839 sign-in cookies; the session ended at 19:05 UTC with 401 `sso_required`.
- **Re-check of the four questions to Chris (Rule 101):** no reply on any of them.
  - SV-12275, comment 80316
  - SV-12276, comments 80317 and 80326
  - SV-12277, comment 80318
  - SV-12278, comment 80319
  - All four are now **In Progress**, updated about 16:42 UTC; not by us.
- **Karachi day-boundary test:** NOT VERIFIED; blocked by the expired sign-in. The set-up is ready: S11839-17606 is completed and not invoiced. Re-run steps are in `dashboard-bug-hunt-2026-11-05/RESULTS.md`.

## 6 Nov 2026: SV-12277 comment 80318 edited
- QA lead's instruction, 6 Nov: questions to Chris Ward never ask him to change the PRD.
- Comment 80318's closing question was edited from "…or leave it as it is (blue pill), with S12-R2 updated?" to "…or leave it as it is (blue pill)?".
- Read back: the picture (media b0aeeb28…) and the @mention are still in place.
- Searched every open question to Chris and every ticket description since 4 Nov: no other open ask for a PRD change. The "S… gets updated" lines elsewhere quote Chris's own answers, not our asks.

## 9 Nov 2026: SV-12276 retest PASS, comment 80448
- Fresh sv11839 sign-in from the QA lead (stored in /tmp only). The branch was asleep; I woke it with toggleQaEnv.
- Build v26.45.2-1a211d8 carries the fix (shopview commit 1a211d8: the reports send the picked day as a date and the server works out the day).
- Run 08:18 UTC in Chromium 153, which still has the older Edmonton rule (browser UTC−7; machine and server UTC−6), so this is the condition the bug needs. Rule 99: the four zone settings matched and were recorded. The day is now worked out on the server, which the result shows: the 06:xx UTC credit memo lands on Nov 3 in both the tile and the report.
- Results:
  - Revenue: Nov 3 tile $1,625.23 = report $1,625.23 (CM11839-4189 listed); Nov 2 tile $0.00 = report empty.
  - Technician Utilization, Sales By Customer and Advisor Analysis match their tiles on both days.
  - Technician Efficiency: empty on both days.
  - None of the report requests sent a browser-built time (0 of 10).
- Picture media id d2837cd0-bc70-41d0-831a-6721f40cfda4 (266,527 bytes, matches the local file). Evidence: `sv12276-retest-2026-11-09/`.
- Re-checked just before posting (08:24 UTC): status TESTING QA, no new comments.
- Status not changed. Waiting for the QA lead's go-ahead.
- Same day: the earlier claim that SV-12275, SV-12277 and SV-12278 were "waiting for Chris" was wrong.
  - Chris had answered all three on 6 Nov: comments 80372, 80373 and 80374, plus 80389 and 80390.
  - Rule 101 amended (commit 88bf94189).

## 9 Nov 2026 (~09:18 UTC): SV-12276 moved TESTING QA → QA Complete
- The QA lead approved it ("yes if that does not bite me").
- Checks before the move:
  - No comments since 80448.
  - The deployed build is still v26.45.2-1a211d8.
  - The only later commit on origin/SV-11839 (05c56a0, merge of main) touches none of the fix's 22 files.
- Transition id 10. The result returned status QA Complete.

## 9 Nov 2026: Sales By Customer total leaves out credit memos — not raised (documents silent)
- What was seen (SV-12276 retest, Nov 3, Heavy Duty):
  - The Sales By Customer report total is $1,630.23, without the $5.00 credit memo.
  - The Sales report total is $1,625.23, with it.
- Source checked LIVE on 9 Nov:
  - Confluence page 577634305, "SBC (Sales By Customer) Report", version 22, last changed 19 Oct 2026.
  - It never mentions credit memos (0 hits for "credit" and "refund").
  - It is an invoice tree (Customer → Asset → Invoice) whose Subtotal = Labor + Parts + Shop Supplies + Adjustments.
  - It excludes only reversed and voided invoices.
- No document says Sales By Customer should take credit memos off, so per the QA lead's 9 Nov "Ok" this is NOT raised.
- It is already listed as open question 1 in `report-suite/ShopView-Reports-What-Every-Column-Calculates-2026-10-28.md`. That document is code-derived, not an expectation source.
- Side finding: our local SBC copy (v20, 12 Aug) is behind the live page (v22, 19 Oct).

## 9 Nov 2026 (~10:04 UTC): SV-12276 close-out corrected
- The QA lead pointed out that the 4 Nov QA-pass procedure was not followed when SV-12276 was moved to QA Complete. That procedure is at the top of this file and in APP-ACTIONS-PLAYBOOK "Jira read-back".
- Two steps were missed:
  - the `QAcomplete` label;
  - Bilal as QA Assignee. The QA lead set this by hand.
- Corrected:
  - Comment 80448 now opens "QA passed." (was "Retest: PASS."). The rest is unchanged, and the picture is kept.
  - Labels set to `QA_found` + `QAcomplete`.
- Read-back: JQL `key = SV-12276 AND labels = QAcomplete AND labels = QA_found AND cf[10385] = "<Bilal>" AND status = "QA Complete"` returns 1 hit.
