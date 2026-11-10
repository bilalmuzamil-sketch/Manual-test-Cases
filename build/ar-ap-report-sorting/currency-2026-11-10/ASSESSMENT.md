# A/R and A/P Report Sorting — V1 currency assessment against the sources of 10 Nov 2026 (ASSESSMENT ONLY)

Brief: `WORKER-BRIEF.md` (QA lead, 10 Nov 2026: "Source verify them", V1). Nothing was written to TestRail, Jira, Slack or Google;
no authoring file was edited; nothing was committed. Reads only. Per-case verdicts for all 356 cases: `verdicts.csv` / `verdicts.json`
(key, C-id, link, verdict, parts, reasons, the evidence for every CONFIRMED case, and the stamp lines every case carries).
Scripts: `scripts/` (fetch_live.py, drift.py, prd_diff.py, story_diff.py, assess.py, classify.py, show.py, snip.py).

## 0. Headline

| | Count |
|---|---|
| Cases in TestRail section 90418 (12 subsections), all created and last updated by us | 356 |
| **CONFIRMED** (behaviour, steps, results, quotes and design block still right) | **224** |
| **CHANGE** (at least one part must change; Rule 134 rewrite top to bottom) | **131** |
| — of which the steps or results change | 12 |
| — of which only the quotes (a changed requirement re-quoted) | 41 |
| — of which only "References from Design" (5 Nov design) | 65 |
| — of which quotes and the design block | 13 |
| **RETIRE** | **1** (REL-08 C715478) |
| **NEW cases needed** | **25** (N-01 to N-25, section 4) |
| Live text different from the library | 9 cases, all our own 4 Nov 2026 expect-fail writes (section 5) |

**Stamp lines on every one of the 356 cases are now out of date, CONFIRMED ones included** (see section 6): the "From:" line names PRD
version 9 (now 11); the line "The build is not yet available to check this case against." is no longer true (a QA build has existed
since 10 Nov 2026: https://sv11315.qa.shopview.com, build v26.45.2-6a8b89c, tested by Bilal Muzamil on SV-11441); 333 cases carry
`AUTOMATION: HOLD - not yet build-verified (no build yet)`, whose reason is gone (Rule 61: HOLD only for something truly unobtainable);
and every "References from Design" block says "read 22 Oct 2026" while the design was republished on 5 Nov 2026.

## 1. Reading coverage (Rule 119)

| Source | File(s) | Size | Read |
|---|---|---|---|
| PRD, Confluence 947650561 | `sources/CONFLUENCE-947650561-2026-11-05-read-2026-11-10.md` | 58,699 bytes, 479 lines | 100%, lines 1-479, by me |
| | `…-2026-11-05-read-2026-11-10.html` (raw) | 99,325 bytes, 429 text blocks | 100% by script: every block diffed against the v9 HTML (403 blocks), all 54 diff lines read; md vs HTML checked (the 19 HTML blocks not word for word in the md are only the "Design:"/"Jira:" link lines and the "Core:" heading split by markdown bold) |
| | version | — | **Confirmed live: version 11**, 5 Nov 2026 13:21 UTC, Chris Ward, message "QA answers" (Confluence summary read, 10 Nov) |
| PRD v9 (our cases' quotes) | `sources/CONFLUENCE-947650561-v9-2026-10-26.html/.md` | 95,256 / 64,317 bytes | diff base (read in full 26 Oct); own diff `PRD-DIFF-own-html-v9-to-current.txt` agrees with the brief's 52-line diff |
| Jira, 9 stories SV-11531..SV-11539 | `sources/JIRA-stories-SV-11531-11539-2026-11-10.json` | 126,071 bytes | descriptions: normalised text diff against the 26 Oct copy = **0 lines on all 9** (so the 26 Oct full read covers them); each story's one comment (Nemanja Djuric, 10 Nov) read 100% |
| Jira, epic + 16 other tickets (SV-11315, SV-7192, SV-10798, SV-11441, SV-11595..SV-11600, SV-12135..SV-12141) | `sources/JIRA-epic-bugs-tasks-SV-11315-2026-11-10.json` | 167,548 bytes | descriptions and every comment read 100% (SV-7192 and SV-10798 descriptions = the 26 Oct copy, 0 diff lines, no comments) |
| Readable form of all 26 | `sources/JIRA-READING-2026-11-10.md` | 151,539 bytes, 2,030 lines | 100%, lines 1-2030, by me |
| SV-11442..SV-11447 | JQL read 10 Nov | — | no longer under SV-11315: moved to epic **SV-12125 "Report Modernization"** on 4 Nov 2026 (all Open) |
| Chris Ward's answers | `questions-2026-10-22/chris-answers-2026-10-26.json`, `po-answers-2026-11-04/ANSWER-17-Chris-Ward.md` | 3,806 / 902 bytes | 100% |
| Tech plan | `sources/Tech-Plan-AR-AP-2026-10-22-upload.md` | 88,174 bytes | not re-read line by line this round (unchanged file, committed 22 Oct, read in full then); its 32 distinct quotes in 37 cases were re-checked against PRD v11: no conflict. **No ticket or comment names a newer tech plan** (the verify tasks still say "Phase N of the tech plan") |
| Design canvas BRYCdjKwGRSgGPC9xxkgF4 | `design-2026-11-05/` (canvas.json + 7 boards + SKILL.md, index.html, thumbnail.json) | 8 project files 48,734 bytes | **the design changed**: version 1793886208-34e0, published 5 Nov 2026 13:43 UTC. All 8 project files read and diffed against the 22 Oct copy (section 2.3). The 3 replaced pictures could **not** be fetched (served only as `/_blob/` uploads; this account can open the artifact but is not a writer, so its assets cannot be listed or read). The other 29 published files are the design tool's own runtime and reference files (no ShopView screen text; SKILL.md and index.html grew 451 / 6,972 bytes, no ShopView words in either) |
| Live cases | `live-before/live-cases-2026-11-10.json` | 1,854,655 bytes | all 356 read by script (every field compared with the library); about 45 cases read in full by me, the rest through bounded snippets of each trigger hit |

## 2. Per-source verdict (Rules 115, 43)

### 2.1 PRD version 9 → version 11 (Change Log 2026-11-04 "v10" and 2026-11-05)

New requirements (each needs new cases, section 4):

- **S1-R5a:** "A document is Current when its due date is on or after the as-of date. Its Past Due, where the report shows one, is the number of days from the due date to the as-of date: negative while the document is not yet due (a bill due 9 days after the as-of date reads -9, as today) and 0 on its due date. A credit memo, deposit or vendor credit counts its own date as its due date, so one dated exactly on the as-of date is in Current with Past Due 0, not in "1-30 days past due". This is how QuickBooks ages them (SV-11441)."
- **S2-R1a:** "Date and Due Date show plain dates on screen, for example "Nov 4, 2026". The PDF and the CSV keep their own date formats (S3-R7a, S3-R8). They never read "Today", "Yesterday" or "2 days ago"."
- **S2-R1b:** "Transaction Type reads "Invoice" for invoices and bills, as today, and names each kind of credit: "Credit Memo" and "Deposit" on A/R, "Vendor Credit" on A/P. The same names appear in the PDF and the CSV, and Transaction Type sorts A to Z by these names (S2-R2)."
- **S2-R7a:** "If the report is sorted by Location and the Location column then hides (Story 6), whether the Location filter is narrowed to one location or a new as-of date leaves only one location in the list, the sort returns to the opening order (Story 1), so a sorted header is always visible."
- **S3-R7a:** "The PDF uses the app-wide report PDF format, the same as Sales By Customer and Inventory Value: a negative amount prints in brackets with a minus sign, for example "(-$11,111.00)", and dates print as "Nov 04 2026". On screen a negative amount reads "$-11,111.00", as today."
- **S5-E3:** "Changing the as-of date keeps every ticked location that is still in the new list (S5-R3). If none of the ticked locations is still in the list, the filter returns to All locations, and the chip reads "Location: All locations". A user who chose No locations keeps No locations."
- **Story 4 Error Handling** (and the two matching section 8 rows): "If a bucket's lines fail to load when it is expanded, the bucket shows "Something went wrong loading this bucket. Collapse and expand it to try again." in place of its lines." / "If a bucket's later lines stop loading while the user scrolls, the lines already shown stay and the bucket shows "Not every line loaded. Collapse and expand this bucket to try again." under them."

Changed requirements (cases that quote them: CHANGE):

- **S1-R8** gains: "On A/R Collection and A/P Unpaid Invoices, an open customer or vendor shows its first 100 documents, then the next 100 as the user scrolls; its document count, its subtotals, the Totals row and the exports always cover all of its documents." (20 cases quote S1-R8)
- **S2-R7** ends "…keep it, except as in S2-R7a." (7 cases)
- **S3-R8a** and **S9-N2**: "Credit term" → "Credit Term" (CSV column heading). (S9-03, S9-04)
- **S8-R3**: "Location wraps only on A/P Detail (nine columns) and A/P Unpaid Invoices" (was "only on A/P Detail (nine columns)"). (35 cases)
- **Out of Scope**: the SV-11441 item ("a credit dated on the as-of date landing in 1-30 instead of Current …") is removed. (REL-08, REL-09)
- **Section 2 "What changes for existing users"** gains three lines (credit on the as-of date in Current; plain dates; credit names). No case quotes the changed section-2 text, but REL-01 and REL-02 expect "only the order may differ".

Everything else in the PRD (business case, goals, key decisions, terminology, assumptions, all other requirements, the rest of section 8)
is unchanged block for block. **All other PRD quotes in our cases (UFS rows and key decisions checked piece by piece) are word for word
in v11.**

### 2.2 Jira (26 tickets under SV-11315, read 10 Nov 2026)

- **Story descriptions SV-11531..SV-11539 did not change since 26 Oct**: they still carry the v9 wording (no S1-R5a, S2-R1a, S2-R1b,
  S2-R7a, S3-R7a, S5-E3, "Credit Term"). Chris Ward's answer 10 ("The PRD wins") stands, so the PRD v11 text governs.
- **New on 10 Nov:** a QA handoff comment from Nemanja Djuric on the epic, every story, SV-11441, the 7 bugs and the verify tasks. They
  describe the build on https://sv11315.qa.shopview.com (PR #4262, head 8e35ee0d02). They are build descriptions, not sources of expected
  behaviour (Rule 57), with these facts we use: a QA build exists; the dev records Product decisions of 4 and 5 Nov that PRD v11 already
  carries (negative Past Due for not-yet-due bills, PDF negatives in brackets, three date formats, S8-R3, S5-E3, S2-R7a, S1-R5a); and
  second-hand "Product answers" 1, 2, 4, 8, 10 that are **not** in the PRD (ticket closing, letters outside the accent table sort after
  z, a Summary bucket that nets to $0.00 is blank while Total and the Totals row show $0.00, "Open Balance never above Amount" is per row).
  None of those changes a case (our DATA-14/15 and D-74 already show $0.00 in the Totals row; no case tests the others).
- **The epic shows one comment only (10 Nov)**: the 4 and 5 Nov "Nemanja's build questions" with Chris Ward's answers, which the PRD
  Change Log names, are not on SV-11315 now; we hold them only through the PRD and the dev's relay.
- **SV-11441** (QA Complete, 10 Nov): now in scope (S1-R5a). Bilal Muzamil passed it on the QA build on 10 Nov and checked QuickBooks.
  Our REL-08 expects the opposite (RETIRE).
- **SV-11442..SV-11447** moved to epic SV-12125 "Report Modernization" on 4 Nov; the PRD's Out of Scope line still says "each a separate
  ticket on SV-11315". No case change (REL-09 checks they do not appear); a wording point for Chris, not a test question.
- **SV-11600** closed OBSOLETE (duplicate of SV-11597) on 4 Nov.
- **Bugs SV-12135..SV-12141:** section 7.

### 2.3 Design (republished 5 Nov 2026, version 1793886208-34e0; last driven 22 Oct)

canvas.json, Main, Export and Layout are byte-identical to 22 Oct. Four boards changed, each in one or two figures:

| Board / figure | Change | Closes |
|---|---|---|
| Grouped "The customer row stays pinned" | caption adds "Known build bug: invoices on the same date show in time-of-day order here; the PRD puts them in invoice-number order (S1-R6)." | DD-04 (now SV-12138) |
| Location "Cleared: No locations" | **picture reshot** (105bf478… → 94d10194…); caption adds "No Totals row and no Location column. Reshot 2026-10-23 (round 15)." | DD-03 (Chris answer 13) |
| Links "Links only where they can open" | **picture reshot** (cdefada1… → 34cfb529…); caption "Native link style: the Work In Progress blue, semi-bold, no underline. Reshot 2026-10-23 (round 15)." | DD-05 (answer 15) |
| Links "Another location asks first" | caption now names "Cancel" left, "Switch location" right, the close ×, and "Known build bug: this build labels the button "Switch Location" with a capital L; the PRD wording "Switch location" stands." | DD-01 (now SV-12139) |
| Filters "The native Vendor menu" | **picture reshot** (749cad0a… → 18f2c076…); caption "a search box reading "Search vendors" (shown when there are more than 8 vendors) … then the vendors A to Z. Reshot 2026-10-23 (round 15)." | DD-02 (answer 12/PRD v9) |

So every open-picture promise ("the design picture will be corrected", answers 13-15) is now kept. **New difference DD-07:** the
"this build" pictures still show Transaction Type "Credit" for credits (A/R Collection after Expand all, A/P Unpaid pinned row, A/P
Unpaid at 1440, A/R Detail after Cancel, the vendor credit link figure), while PRD v10 S2-R1b names them "Credit Memo", "Deposit" and
"Vendor Credit" and states "today all three read "Credit"". Closed by that later PRD ruling of the design authority (Chris Ward, 4 Nov);
no question and no held design-version case needed; the 3 cases that compare credit rows with those pictures (D-18, D-58, D-63) need the
note. **Not verified:** the content of the 3 reshot pictures (they could not be fetched); their captions were read. The pictures show
plain dates (for example "Aug 27, 2026"), so S2-R1a raises no design difference.

### 2.4 Tech plan

CONFIRM: no newer plan exists or is named; none of its 32 quotes in our cases conflicts with v11.

### 2.5 Chris Ward's answers

CONFIRM: answers 1-17 are already in the cases (v9 pass 26 Oct; expect-fail lines 4 Nov). Answers 13-15's promised picture corrections
arrived (2.3).

## 3. Every case: CHANGE and RETIRE (the 224 CONFIRMED, each with its evidence, are in `verdicts.csv`)

Parts follow Rule 134 (title, preconditions, steps, results, quotes and From lines, build line, References from Design, notes, marker,
refs, setup recipe, run). Only the parts named below change in substance; the stamp lines of section 6 change in every case.

### 3.1 Steps or results change (12)

| Key | C-id | What changes | PRD / source line |
|---|---|---|---|
| S5-18 | C715392 | step-3 hedge ("If step 3 keeps location B unticked in the address, tick every location before step 3") is settled: location A stays ticked, the one-location list shows no chip; quote S5-E3 | S5-E3 |
| S9-03 | C715447 | CSV heading is "Credit Term" (results say "Credit term" column); re-quote S3-R8a | S3-R8a |
| S9-04 | C715448 | "no Credit Term column"; re-quote S3-R8a and S9-N2 | S3-R8a, S9-N2 |
| REL-01 | C715471 | "only the order may differ" must now also allow plain dates, credit names, and a credit dated on the as-of date moving from 1-30 to Current; add the 3 section-2 lines | §2, S1-R5a, S2-R1a, S2-R1b |
| REL-02 | C715472 | same as REL-01 for A/P; also its last result talks about the A/R Summary overpaid-invoice Totals (copied from REL-01; found while reading) | §2, S1-R5a, S2-R1a, S2-R1b |
| REL-03 | C715473 | the result "the day without a leading zero" has no source sentence, and S3-R7a now says PDF dates print "Nov 04 2026"; draft question Q1 | S3-R4, S3-R7a |
| D-16 | C715496 | "Location does not wrap" on A/P Unpaid Invoices now contradicts S8-R3 (it wraps there) | S8-R3 |
| D-17, D-18, D-58, D-62 | C715497, C715498, C715540, C715544 | A/P Unpaid Invoices layout cases: add or confirm that a long location wraps; D-18 and D-58 also get the DD-07 note | S8-R3 |
| D-68 | C715550 | result says "the picture also draws a Totals row of $0.00 … will be corrected"; the 5 Nov picture is reshot | design 5 Nov, S5-R6a |

### 3.2 Quotes only (41) — a changed requirement re-quoted as its whole v11 line

S2-29 C715316, S2-30 C715317, S2-31 C715318, S2-32 C715319, S2-33 C715320, S2-34 C715321, S2-35 C715322 (S2-R7; S2-29/31/32/34 also
S1-R8) · S4-05 C715358, S4-06 C715359, S4-07 C715360, S4-08 C715361, S4-13 C715366, S4-14 C715367, DATA-01 C715450, DATA-02 C715451,
DATA-03 C715452, DATA-04 C715453, DATA-05 C715454, DATA-06 C715455, DATA-01b C715612, DATA-02b C715613, DATA-03b C715614, DATA-04b
C715615 (S1-R8) · S4-09b C715599, S4-10b C715600, S4-11b C715601, S4-12b C715602, D-01 C715481, D-07 C715487, D-10 C715490, D-13
C715493, D-47 C715527, D-48 C715528, D-50 C715532, D-56 C715538, D-01b C715621, D-07b C715625, D-10b C715627, D-13b C715629, D-16b
C715631 (S8-R3) · REL-09 C715479 (Out of Scope line). Results stay; quotes and From line change.

### 3.3 References from Design only (65) — 5 Nov design

- Vendor menu reshot (attached picture, caption, DD-02 note): S3-12 C715338, S3-13 C715339, S3-14 C715340, S5-04 C715378, S5-24
  C715398, S5-28 C715402, S5-29 C715403, S5-35 C715577, S5-36 C715578, S5-39 C797943, DATA-20 C715469, REL-11 C715582, D-32 C715512,
  D-73 C715555.
- No locations reshot (picture, caption, DD-03 note): S3-24 C715350, S5-14 C715388, S6-03 C715411, D-19 C715499, D-20 C715500, D-21
  C715501, D-22 C715502, D-23 C715503, D-24 C715504 (S5-18 and D-68 are in 3.1).
- Links picture reshot (picture, caption, DD-05 note): S7-01 C715414, S7-02 C715415, S7-06 C715419, S7-07 C715420, S7-08 C715421,
  S7-11 C715424, S7-12 C715425, S7-13 C715426, S7-14 C715427, S7-15 C715428, S7-16 C715429, S7-17 C715430, S7-18 C715431, S7-19
  C715432, S7-18b C715610, D-25 C715505, D-63 C715545 (+DD-07), D-81 C715563, D-04c C715624.
- Prompt caption (DD-01): S7-03 C715416, S7-04 C715417, S7-20 C797944, D-39 C715519, D-40 C715520, D-64 C715546.
- Pinned customer row caption (DD-04): S4-09 C715362, S4-10 C715363, S4-11 C715364, S4-12 C715365, D-26 C715506, D-57 C715539.
- "Will be corrected" note only (DD-04 / DD-05): S1-10 C715282, S1-11 C715283, S2-12 C715299, S2-20 C715307, S2-19b C715590, D-59
  C715541, D-01c C715622, D-07c C715626, D-10c C715628, D-13c C715630, D-16c C715632.

### 3.4 Quotes and design block (13)

D-02 C715482, D-03 C715483, D-04 C715484, D-05 C715485, D-06 C715486, D-08 C715488, D-09 C715489, D-11 C715491, D-12 C715492, D-14
C715494, D-15 C715495, D-61 C715543, D-04b C715623 (S8-R3 re-quote + DD-05 "will be corrected" note / Links picture).

### 3.5 RETIRE (1)

| Key | C-id | Why |
|---|---|---|
| REL-08 | C715478 https://shopview.testrail.io/index.php?/cases/view/715478 | "A credit dated on the as-of date stays in the same bucket as before" expects "1-30 days past due" because SV-11441 was out of scope; v10/v11 moves SV-11441 into scope (S1-R5a: Current, Past Due 0) and drops it from Out of Scope. Replaced by N-25 and the S1/DATA cases. Delete only on the QA lead's go-ahead (Rule 134.4). |

## 4. NEW cases needed (25)

| New | Section | What it checks | Source |
|---|---|---|---|
| N-01 | S1 90419 | A/R Detail: a credit memo and a deposit dated on the as-of date are in "Current"; a credit memo dated the day before is in "1-30 days past due" | S1-R5a |
| N-02 | S1 | A/P Detail: a vendor credit dated on the as-of date is in Current with Past Due 0; one dated the day before is in 1-30 with Past Due 1 | S1-R5a |
| N-03 | S1 | A/R Collection: a credit dated on the as-of date shows its own date as Due Date and Past Due 0 | S1-R5a |
| N-04 | S1 | A/P Detail (and A/P Unpaid Invoices): a bill due 9 days after the as-of date is Current with Past Due -9; a bill due on the as-of date reads 0 | S1-R5a |
| N-05 | S1 | A/R Collection: an open customer with more than 100 documents shows 100, then the next 100 on scroll, none repeated or skipped | S1-R8 (new sentence) |
| N-06 | S1 | A/P Unpaid Invoices: same for a vendor (the QA organization has a vendor with over 2,000 bills) | S1-R8 |
| N-07 | S2 90420 | A/R reports: Date and Due Date of documents dated today, yesterday and 2 days ago read as plain dates ("Nov 10, 2026"), never "Today"/"Yesterday"/"2 days ago" | S2-R1a |
| N-08 | S2 | A/P reports: same | S2-R1a |
| N-09 | S2 | A/R: Transaction Type reads "Invoice", "Credit Memo", "Deposit"; first click sorts Credit Memo → Deposit → Invoice | S2-R1b, S2-R2 |
| N-10 | S2 | A/P: "Invoice" and "Vendor Credit" (never "Credit"); first click sorts Invoice → Vendor Credit | S2-R1b, S2-R2 |
| N-11 | S2 | The PDF and CSV carry the same Transaction Type names | S2-R1b |
| N-12 | S2 | A/R Summary sorted by Location: narrowing the Location filter to one location hides the column and the sort returns to name order (header marked) | S2-R7a, S2-R7 |
| N-13 | S2 | A/R Collection (grouped) sorted by Location: same fallback, to Date oldest first | S2-R7a, S1-R7 |
| N-14 | S2 | Sorted by Location: a new as-of date that leaves one location in the list gives the same fallback | S2-R7a |
| N-15 | S3 90421 | PDF prints a credit's negative amount as "(-$150.00)" while the screen reads "$-150.00" | S3-R7a |
| N-16 | S3 | PDF date cells print as "Nov 04 2026" (screen "Nov 4, 2026", CSV "2026-11-04") | S3-R7a, S2-R1a, S3-R8 |
| N-17 | S4 90422 | A/R Detail: with the network off, expanding a bucket shows "Something went wrong loading this bucket. Collapse and expand it to try again."; network on, collapse and expand loads it (the same lost-connection method as S8-10) | Story 4 Error Handling, §8 |
| N-18 | S4 | A/P Detail: a bucket over 100 lines, network off, scroll to its end: the shown lines stay and "Not every line loaded. Collapse and expand this bucket to try again." shows under them | Story 4 Error Handling, §8 |
| N-19 | S5 90423 | Ticked locations A and C, new as-of date on which C has nothing open: only A stays ticked | S5-E3 |
| N-20 | S5 | Only C ticked, same date change: the filter returns to "Location: All locations" | S5-E3 |
| N-21 | S5 | "Location: No locations", as-of date changed: stays No locations | S5-E3 |
| N-22 | DATA 90428 | Rule 116: A/R Summary and A/R Detail with a credit memo dated on the as-of date: the exact Current figure includes it on both, Totals equal bucket by bucket | S1-R5a, S5-R18a |
| N-23 | DATA | Rule 116: same for A/P with a vendor credit | S1-R5a, S5-R18a |
| N-24 | DATA | Rule 116: a group over 100 documents: its "(N)" count, its subtotal, the Totals row and the CSV row count equal the exact sum and number of all its documents before they are all drawn | S1-R8 |
| N-25 | REL 90429 | Release day: a credit dated on the as-of date that was in "1-30 days past due" before the release is in "Current" after it (needs a before-release note, as REL-08 did) | §2, S1-R5a |

No new design case: the 5 Nov design adds no figure and no screen state.

## 5. Live vs library drift (Rule 87)

- Snapshot of all 356 live bodies: `live-before/live-cases-2026-11-10.json` (every case created_by and updated_by user 3 = us; 347 last
  updated 26 Oct 2026, 9 on 4 Nov 2026).
- Compared field by field (title, preconditions, steps, expected, refs, section, type, priority, automation type) with
  `authoring/proposals.json` + `testrail-id-map.csv` (356 keys = 356 ids, no orphan either way): **347 identical; 9 differ, only in
  custom_expected**: S1-10 C715282, S1-11 C715283 (SV-12138), S7-03 C715416, S7-04 C715417, D-39 C715519, D-40 C715520, D-64 C715546
  (SV-12139), S1-16 C715573 (SV-12140), S3-17 C715343 (SV-12141).
- All 9 are **our own** writes of 4 Nov 2026 04:21 UTC (updated_by 3), byte-identical to `build/answers-2026-11-04/proposals.json`: the
  Rule 61 expect-fail block replaced the "Where the build is expected to differ … no ticket number is known yet" note and the marker
  became `AUTOMATION: READY - EXPECT FAIL (SV-1213x)`. **No foreign edit.**
- **The library never took these in**: a rebuild from `authoring/` today would silently remove the 9 expect-fail blocks. Whatever pass
  follows must first fold them into the authoring layer. Detail: `drift-live-vs-library.json`.

## 6. Stamp lines (every case)

| Line | Cases | Now |
|---|---|---|
| "From: PRD … version 9 (23 Oct 2026 …), read 26 Oct 2026" | 356 | version 11 (5 Nov 2026), read 10 Nov 2026 |
| "The build is not yet available to check this case against." | 356 | untrue since 10 Nov (QA build sv11315); say "Not yet checked against a build." |
| `AUTOMATION: HOLD - not yet build-verified (no build yet)` | 333 | reason gone (Rule 61): `AUTOMATION: READY` unless another real hold applies |
| `AUTOMATION: HOLD - needs records and screenshots captured before the release is installed on the test site` | 13 | still true; the release is 19 Nov 2026, so the "before" records must be captured on production before then |
| `AUTOMATION: HOLD - needs more rows than any test site holds …` (DATA-19 C715468) | 1 | unchanged (dev notes: S3-N2 "covered by tests; not practical by hand") |
| "References from Design … read 22 Oct 2026" | 356 | design version of 5 Nov 2026 (content unchanged for the CONFIRMED cases) |

## 7. The 7 bug tickets (filed 3 Nov 2026)

| Ticket | Cases it touches | Expect-fail line |
|---|---|---|
| SV-12138 same-day rows by time of day | S1-10 C715282, S1-11 C715283 (named in the ticket) | present since 4 Nov; still backed (ticket open, TESTING QA). The dev says it is fixed on the QA build; ticket status is not evidence (Rule 61): outcome (3) will report it |
| SV-12139 "Switch Location" capital L | S7-03 C715416, S7-04 C715417, D-39 C715519, D-40 C715520, D-64 C715546 (named) | present, backed; same note |
| SV-12140 punctuation before digits | S1-16 C715573 (named) | present, backed |
| SV-12141 Locations line in tick order | S3-17 C715343 (named) | present, backed |
| SV-12135 no column sorts, inconsistent opening order (old reports on staging and sv10647) | the opening-order and sort cases: S1-01..S1-16 and S2-01..S2-42 (all of S1 and S2) | **none owed**: filed against the old reports; the dev says the rebuild fixes it; our cases already fail if it is still there. No open ticket describes a failure on the build under test, so no marker (Rule 61) |
| SV-12136 A/P Open Balance a few cents above Amount on bucket totals | the A/P Totals cases DATA-08 C715457, DATA-11 C715460, DATA-12 C715461, DATA-15 C715464, DATA-24 C797946, DATA-02b C715613, DATA-04b C715615 | **none owed**: the dev relays Product's answer that "Open Balance never above Amount" is per row; no case compares bucket Amount with bucket Open Balance (S5-R18a: Amount "is not compared") |
| SV-12137 A/P columns cut off at 1400 px, no loading state, no A/P Print (old reports) | fit at 1440: D-13 C715493, D-16 C715496, D-61 C715543, D-62 C715544, D-13b C715629, D-16b C715631, D-48 C715528; loading bar: D-19..D-24 (C715499-C715504); A/P Export menu: S3-02 C715328, S3-02b C715597, S3-02c C715598 | **none owed**: old-report symptoms, fixed by the rebuild per the dev; the PRD guarantees the fit at 1440 only (our cases test 1440) |

Ledger rows to add or refresh in `TICKET-LEDGER.json` (not edited in this assessment): SV-12135, SV-12136, SV-12137 → COVERED (the cases
above); SV-12138..SV-12141 → COVERED, expect-fail present; SV-11441 → NEW-CASES (N-01..N-04, N-22, N-23, N-25), REL-08 to retire;
SV-11442..SV-11447 → moved to SV-12125 (no longer under the epic); all 26 tickets updated 10 Nov → re-read 10 Nov 2026.

## 8. Held cases and design-version cases

- No design-version case exists (D-76..D-80 deleted 26 Oct, D-81 released). DD-07 is closed by the PRD v10 ruling, so none is owed.
- Held markers: the 13 "before the release" cases and DATA-19 stay held; nothing in the new sources releases them. REL-08 (one of the
  13) retires. The 333 "no build yet" holds lose their reason (section 6).
- Run 557 holds all 356 cases; a retirement or new cases would change it (Rule 123, union only).

## 9. Points the sources leave open — draft PO questions (skill 07 §6 applied; not sent)

**Q1 (A/R and A/P Report Sorting — the date printed at the top of the PDF).** What happens now: the PDF's top line reads "As of" and the
date you picked (S3-R4: "As of Oct 15, 2026", "three-letter month, day, four-digit year"); the new S3-R7a says PDF dates print as
"Nov 04 2026". Question: for a date before the 10th, does the top line read (a) "As of Nov 4, 2026" (the S3-R4 format; S3-R7a covers the
dates in the table only) or (b) "As of Nov 04, 2026" or (c) "As of Nov 04 2026"? **Recommended: (a)**, because S3-R4 is the rule written
for that line and its example has a comma, which S3-R7a's format does not. Why it needs Chris: REL-03 C715473 says "the day without a
leading zero", and no sentence says so; until he answers, REL-03 can be run on a date from the 10th onward, or that clause dropped. §6
check: decomposed (only the day 1-9 verdict depends on it), our documents do not settle it, the build may not decide it.

**Q2 (A/R and A/P Report Sorting — A/R Collection and A/P Unpaid Invoices, a big customer or vendor that stops loading; optional).**
What happens now: v10 made an open customer or vendor load 100 documents at a time (S1-R8), and Story 4 gives messages only for an A/R
Detail or A/P Detail bucket that fails to load. Question: if the next 100 documents of an open customer or vendor fail to load, should
it (a) show the same kind of message as a bucket ("Not every line loaded. Collapse and expand … to try again.") or (b) something else?
**Recommended: (a)**, the same words as the bucket so the user knows to collapse and expand. Why it needs Chris: no sentence covers it,
and no case can expect anything until he says; no existing case is held on it, so it can wait if he prefers.

Waiting on the PO for this suite before this assessment: nothing (questions 1-17 answered; `build/PO-QUESTIONS-OPEN.md`).

## 10. Evidence that a named set (instead of a full pass) would be safe

**For the 224 CONFIRMED cases** (`verdicts.csv`, column confirmed_evidence, one line per case):
1. Every PRD quote they carry is word for word in v11, and none quotes a line that v10/v11 changed (S1-R8, S2-R7, S3-R8a, S8-R3, S9-N2,
   the Out of Scope line). The changed lines are known exactly from the block-level HTML diff (all 54 lines read).
2. A keyword scan of their title, preconditions, steps and plain results for every new rule's screen (credit on the as-of date, Past Due
   of a credit or a not-yet-due bill, relative dates, the word "Credit" as a type, Location sort with the column hiding, PDF dates and
   negatives, an as-of change after narrowing locations, 100 documents in a group, Location wrapping, "Credit term" in a CSV, bucket
   errors). Every hit in a CONFIRMED case was reviewed and is a false hit (the Past due filter, "dated 40 days ago" in a precondition,
   the PDF's as-of header, positive Totals in a PDF, a 1440 px window line); only S5-18 changes the as-of date after narrowing locations.
3. Their design references point only to boards that are byte-identical (Main, Export, Layout, canvas.json) or to unchanged figures of
   the four changed boards, and none carries a DD-01..05 "will be corrected" note.
4. Story texts are unchanged; the tech plan is unchanged; Chris's answers are already in the cases.

**Where the evidence is weaker — be aware:**
- The scan is by words, not meaning (lesson L-13). I read about 45 cases in full and every trigger hit's lines, not all 224 cases line
  by line. Most exposed: S2 and DESIGN (sort and look cases with credits in their data), and REL (before/after comparisons).
- The 3 reshot design pictures were not seen. Their captions are read; every case that attaches them is already CHANGE.
- DD-07 (pictures showing "Credit") was found by a heuristic (cases that compare rows with a picture that shows a credit): 3 cases.
  Other design cases compare "layout, labels and styles, not the names and amounts", so the word "Credit" in a row should not fail them.
- A named set still leaves all 356 cases with stale stamp lines (section 6). Leaving the 224 un-stamped means their From line says
  version 9 while they are correct against version 11, their build line says no build exists, and 333 automation markers say HOLD for a
  reason that has gone. That is a traceability and automation-count cost, not a wrong expected result.

**My recommendation (for the coordinator to put to the QA lead, Rule 139):** a named set of 132 cases (131 CHANGE + REL-08 retired) plus
the 25 new cases, **plus a mechanical stamp-only pass on the other 224** (From line to v11, build line, `AUTOMATION: READY` instead of the
"no build yet" HOLD, design read date), all in one write with the 4 Nov expect-fail lines folded into the library first. Reason: the
evidence shows the 224 are right in substance, so a full rewrite would spend most of its effort re-confirming them, while the stamps are
cheap, scriptable and stop 333 cases from being reported as held. A full pass would add value mainly by reading every S2, DESIGN and REL
case in full; if the QA lead wants that certainty, those three sections (164 cases) are where to spend it.

## OUTSTANDING — what is needed (for the coordinator)

1. The QA lead's decision: full pass, or the named set (with or without the stamp-only pass) — Rule 122 as amended.
2. The 3 reshot design pictures (ids 94d10194dfa450b51a5cd126c6b75c4f, 34cfb5290472e952126292c7d61fbad2,
   18f2c0767682c831d42bbcc911243a84): this account cannot read the canvas's uploads. Fastest fix: the QA lead re-shares the canvas
   link with its share key (as on 22 Oct), or downloads the three pictures. Needed before the 65 + 13 design-block changes can attach them.
3. Go-ahead to delete REL-08 C715478 (Rule 134.4) and to add the 25 new cases (TestRail writes need his permission, Rule 6).
4. Whether Q1 (and the optional Q2) go to Chris Ward's sheet (rows at the bottom, new colour, Rule 131).
5. Time-critical: the 13 "before the release" cases need their records captured on production before the 19 Nov 2026 release.

Waiting on the PO (A/R and A/P): nothing open before this assessment.
