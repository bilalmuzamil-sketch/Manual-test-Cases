# Session state — 14 Oct 2026 (updated before the WO Board and Tech View currency check V2)

| Suite | State | Waiting on |
|---|---|---|
| Part Lifecycle | Up to date with PRD v29 + Chris's 12 answers (14 Oct) | Build verification |
| What/Why | Up to date (13 Oct); question doc for Chris shared by the QA lead | Chris's answers |
| Price/Category | Up to date with PRD v21 (14 Oct); question doc for Chris shared | Chris's answers; updated tech plan ("Not yet") |
| DVI V2 | Currency Check V2 done (14 Oct): gap sheet for Viktoria + Vladimir, question sheet for Milos, both shared | Milos's answers |
| Dashboard | Currency Check V2 done (14 Oct): QA sheet for Ayesha Khan, Vladimir Tomovic and Nebojsa Glavinic (4 to update, 3 new, 9 waiting on PO) https://docs.google.com/spreadsheets/d/1fC6Fn9664Rraf9NL7MPmitnwNsDeexowd7CHRBJVKUg/edit · PO sheet for Chris Ward (15 questions) https://docs.google.com/spreadsheets/d/10Bgu1k2Dzxd2kAvIlEBVWSDIIs00G55VgFoImMU9SjY/edit · record `build/dashboards/currency-2026-10-14/` | QA lead to share both sheets; Chris's answers |
| Maintenance Reminders | Handed to Vladimir and Nebojsa — do not touch | — |

New process: Rule 125 / skill 22 (Testing Suite Currency Check V2). QA lead: do not ask about the feature-squad policy until next week.
Outstanding on the QA lead: nothing urgent; come back later (his words, 14 Oct).
Next: WO Board and Tech View Currency Check V2 (QA lead chose V2, 14 Oct): TestRail run 498 / group 13204, PRD Confluence 845185030, epic SV-10043, design = upload Work_Orders_Page_3.zip (14 Oct). Project folder `build/wo-board-tech-view/`.

## Update 14 Oct 2026 (later) — QA lead's answers
- Jira tickets are another session's job: give him the bug DETAILS only (Dashboard S9-R10 legend "avg"; WO Board S5-R11b staff name).
- WO Board: "Yes" — update his own cases (created_by 3) in TestRail directly from Chris's answers; never Vladimir's.
- C368133 note to Ahtasham/Vladimir: already sent by the QA lead. The six run 498 tests: already build-verified (QA lead).
- Dashboard sheet already shared with Ayesha, Vladimir and Nebojsa (QA lead).
- Waiting on: Chris (What/Why, Price/Category), Milos (DVI V2), Milan (Price/Category tech plan) — the QA lead will say when.
- Feature-squad policy: do NOT ask or remind before next week.
- In progress: impact of Chris's answers (Dashboard 15, WO Board 11) on the test cases.

## QA lead, 14 Oct 2026 (evening) — standing instruction
- "Everything you do should be done keeping in mind that Human beings are involved with your work to keep things simple friendly
  understandable authentic and your work should never bite me."
- Dashboard: ONE sheet to work on = https://docs.google.com/spreadsheets/d/1fC6Fn9664Rraf9NL7MPmitnwNsDeexowd7CHRBJVKUg/edit
  reduced to one tab, same row format, ONLY cases whose behaviour changed and are not yet updated (Nebojsa/Ayesha/Vladimir),
  every such case included. The newer Nebojsa+Vladimir sheet (1NdmC6…) gets a note pointing to it.
- Our Dashboard cases: reference tidy-up approved (v48, boards, "remembers your choices" line). Nebojsa's/Vladimir's: don't touch.

## 14 Oct 2026, night — state saved before moving to WO Board / Tech View
- Dashboard: done for now. One sheet 1fC6… (7 of Nebojsa's cases, one tab). NV sheet 1NdmC6… points to it. PO sheet 10Bgu1k2…
  now 18 questions (17–18 pink, unanswered). C581906/C581907 design sentence corrected. Records: `build/dashboards/currency-2026-10-14/`.
- Waiting (no reminders): Chris's answers 17–18, What/Why + Price/Category answers, Milos (DVI V2), Milan's tech plan.
- NEXT: WO Board / Tech View. Chris (PO) filed 10 design defects SV-11317…SV-11326. QA lead asks: did our cases catch them; if not,
  root cause, prevention, take-away, and how the lesson is saved so it is not relearned.
