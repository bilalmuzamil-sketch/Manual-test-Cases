# Dashboard — Testing Suite Currency Check V2, 14 Oct 2026

Run as **V2** (QA lead's choice, 14 Oct 2026). **No TestRail write.** Skill: `build/skills/22-TESTING-SUITE-CURRENCY-CHECK-V2.md`.

## Deliverables (Google Sheets, verified by read-back: 245 of 245 filled cells match `notify/*-values.json`)
- **QA file:** "Dashboard Feature Squad – Test cases with changed behaviour – for Ayesha Khan and Vladimir Tomovic (14 Oct 2026)"
  https://docs.google.com/spreadsheets/d/1fC6Fn9664Rraf9NL7MPmitnwNsDeexowd7CHRBJVKUg/edit
  Tabs: Read me (30 cells) · Test cases to update (4 rows, 60 cells) · New test cases needed (3 rows, 30 cells) ·
  Need product decision first (8 rows, 43 cells).
- **PO file:** "Dashboard Feature Squad – Questions on the Dashboard spec and design – for Chris Ward (14 Oct 2026)"
  https://docs.google.com/spreadsheets/d/10Bgu1k2Dzxd2kAvIlEBVWSDIIs00G55VgFoImMU9SjY/edit
  Tab "Questions for Chris": 14 questions (82 cells), colour guide (yellow answer, blue topic, grey source).
- Both are owned by the QA lead's Drive and **not yet shared** with anyone.
- Builder: `notify/build_dash_v2.py` → `notify/sheet-data.json`; "before" columns copied by script from `snapshots-before/`.

## Sources (all read 100%) — see `SOURCE-CHECK-2026-10-14.md`
- PRD Confluence 788430850: **v42 → v44** (13 Oct 18:37, Chris Ward). 3 codes added, 0 removed, 0 reworded, 146 identical.
  Change Log empty. Comments: 15, none after 7 Oct. Jira: 47 issues, no requirement text changed. Tech plan unchanged.
  Design: byte-identical to 7 Oct; Rule 124 triage and flows in `../design-drive-2026-10-14/`.
- Ownership: squad QA = Ayesha Khan (QA Assignee on SV-490); Feature Squad Development Model ("QA prepares test cases");
  automation tracks per Vladimir (Slack 2 Oct): Nebojsa Track A, Ayesha Track B. PO Chris Ward (Feature Squads page).

## Behaviour-first result (all 106 live cases)
| Change | When | Cases to update | New tests |
|---|---|---|---|
| S8-R5a table follows the filter | v44, 13 Oct (Slack p1791898668424119) | C88619 (Automated), C351717 (Pending) | remembered choice + table (next to C351718) |
| S8-N1a table hides with the chart | v44, 13 Oct | C88620 (Automated) | Technician Utilization untick-all (next to C88620) |
| S4-R11a no-sales day = point at 0 | 9–13 Oct (SV-11076 comment 9 Oct) | none (C351709/C351715/C88606/C88647 already right) | Revenue two sales days with $0 between |
| Release notes published (PO, 10 Oct) | 10 Oct | C88632 step 14 (manual, ours) | — |

**Adversarial check:** v42 says nothing about the table following the filter or hiding (only S6-R4..R6 name the tables) →
S8-R5a/N1a are new behaviour. S4-R11a is a clarification (v42's "no value" was the ratio "-" only; S4-E3 already treated
zero days as points), so no case changes; one new test because nothing checks interior $0 days on Revenue.
**Left out on purpose:** C88649 and C351718 (filter scenarios whose purpose is parity / remembering — the table rule is
checked by C88619/C351717 once updated; the remembered-table combination is a new test instead); the 10 cases whose
setup says "the dashboard remembers your choices" after resetting date pills (setup wording only; no expected result
depends on it; contradicts S7-R8 — recorded here, not sent).

## Others' edits since 7 Oct (`OTHERS-EDITS-2026-10-14.md`)
74 cases touched (Nebojsa 38, Vladimir 36); 71 automation-status only. Text edits by Vladimir: C499827 (already matches
v44 for Technician Efficiency), C137997 (adds a 60-day step), C573667 (chart equals table total after clearing the filter).

## PO questions (14) — Chris Ward
Flat trend line level (Slack 9 Oct) · release-note "can go up" line · "Today"/custom range on tiles · At Risk revenue
link (C540783) · expanded Revenue monthly bars (SV-10886) · expanded-chart empty month (design D-14) · report link on
technician tiles with no data (D-11) · At Risk revenue measure (D-12) · At Risk at zero (D-4) · two inactivity controls
(D-3) · "Last updated" footer (D-10) · legend average (D-1) · eight layout defects · two spec tidy-ups (§7, sv8311 header).

## Changes after the first build (14 Oct, later)
- QA lead: "Yes for dashboard Nebojsa should be there." QA file renamed in place (same link) to "Dashboard Feature Squad –
  Test cases with changed behaviour – for Ayesha Khan, Vladimir Tomovic and Nebojsa Glavinic (14 Oct 2026)"; Read me
  greeting and two sentences updated to address Nebojsa (read back).
- Design gates finished (`../design-drive-2026-10-14/DESIGN-COVERAGE-2026-10-14.md`): 102 files read, 437/437 canvas
  elements, 50/50 boards, 15/15 flows, 648 texts / 0 unclassified. One new item from its label check: Vladimir's
  C433976 and C137997 expect "No data for selected date range" — in neither PRD v44, Jira nor the design → **PO question 15**
  added (row 20, same formatting) and a 9th row on "Need product decision first"; Read me count now 9 and "15 questions"
  (read back).
- PO file now 15 questions; QA file: 4 to update · 3 new · 9 waiting on PO.

## After Chris Ward's answers (14 Oct 2026, later) — `answers-followup/`, `PO-ANSWERS-CHRIS-WARD-2026-10-14.md`
- PRD now v46 (v45 15:06 UTC = all rule changes; v46 = Change Log). 18 codes added, S5-R9 reworded; §7 and sv490 links.
- Impact (V2, no TestRail write): 8 cases to update (C88628, C351714, C351723, C351734, C88606, C88647, C351729, C351708),
  14 new tests, 9 hold rows resolved, 12 corrections to rows already sent.
- QA sheet (shared with Ayesha, Vladimir, Nebojsa by the QA lead): new tab "After Chris's answers (14 Oct)" (pink tab, 57 rows,
  first-column read-back matches row by row); "Need product decision first" got column F "Answered by Chris (14 Oct)".
- PO sheet: question 16 added as a pink row (QA lead: "Yes add and make the row pink") — expanded Revenue chart with no sales.
- Bug facts for the ticket session: legend " · avg" vs S9-R10, owning story SV-9581, no existing ticket.

## Sheet for Nebojsa and Vladimir (14 Oct 2026, evening)
- QA lead: "give me a new sheet for Nebojsa and Vladimir to tell them about the behavioral changes in their test cases that
  need to be updated and retested" → then "keep the same sheet … simplest for them to take action on" → "just One tab".
- "Dashboard Feature Squad – Test cases to update and retest after Chris's answers – for Nebojsa Glavinic and Vladimir
  Tomovic (14 Oct 2026)" https://docs.google.com/spreadsheets/d/1NdmC6fntiEctsxH3CzmnJWVKVI7glfqRND50Kh6V8Uo/edit
  — one tab "Update and retest": 6 rows (C88619, C88620, C351717, C88628, C351714, C351708 — all last updated by Nebojsa;
  live text re-checked unchanged at 17:00 UTC), exact new step/expected text, why + spec-change link, Done tick box.
  Read back: all 66 cells as written. Not shared yet. Vladimir's C540783 left out (its case text is still correct; only its
  automated script may use the removed "Inactive for" box — tell him separately if wanted).
- Our six with behaviour changes (C88632, C351723, C351734, C88606, C88647, C351729) + 17 new tests: being written to
  TestRail (record `apply/`).
