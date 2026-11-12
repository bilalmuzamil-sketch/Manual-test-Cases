# Aging Reports Test Progress — dashboard

https://claude.ai/artifact/E6MSrJDofWwCjyYii6tKTg (Dashboard type; private to the QA lead's account).

- Its only data is a CSV of run 557 (`case,title,status,area,area_order`; status Passed / Failed / Blocked / Retest / Not yet run;
  area = the case's TestRail folder as on 11 Nov). Snapshots here: `aging-run-results-<date>.csv`.
- To refresh: rebuild the CSV from `get_tests/557` (paged), upload it with the Artifact tool (`asset: true`), then update the
  `datasets/results` document's `source.url` + `updated` + `edit` (pin `if_version`), and the page's words in `files/index.html`
  (read it first — the QA lead may have edited words with the pencil).
- 12 Nov 2026 11:35 UTC: 470 tests (C1079045 left the run after 11 Nov): 459 Passed · 2 Failed · 7 Blocked · 2 Not yet run;
  page now shows Blocked (tile, chart, table), current findings, what is left; "Run so far" shows one decimal.
- 12 Nov 2026 11:13 UTC: after the QA lead's decisions (four tests retired, C715462 kept for production) — 466 tests: 459 Passed · 2 Failed ·
  3 Blocked · 2 Not yet run. Areas now come from each case's CURRENT TestRail folder (the 11 Nov file had an old folder name). The QA lead asked
  that the dashboard NOT mention the retired tests. Re-checked against the live run right after: no difference.
- 12 Nov 2026 ~13:40 UTC (earlier written as 14:45 — a guessed time, corrected from the commit time): after the staging run — 467 tests: 462 Passed · 4 Failed · 1 Blocked · 0 Not yet run (dataset v6 →
  aging-run-results-2026-11-12c.csv, page v13). New finding card (days counted from a different day than the date shown; ticket held),
  PDF card now green (staging), "what is left" updated. Data rebuilt with `build_csv.py <previous.csv> <out.csv>` (live, paged, current folders).
- 12 Nov 2026 ~15:28 UTC (earlier written as 16:15 — a guessed time, corrected): 467 tests: 463 Passed · 4 Failed · 0 Blocked (dataset v7 → aging-run-results-2026-11-12d.csv, page v14). SV-12663 named
  on the day-count card; the production card removed (C715462 passed on staging by another session); "what is left" = re-runs after SV-12663 / SV-12545.
- 12 Nov 2026 15:52 UTC: re-checked against the live run — no change (463 Passed · 4 Failed · 0 Blocked; e.csv identical to d.csv). Page v15:
  snapshot time corrected to the real clock, and the day-count card now links SV-12663 and its two tests (C715471, C715472). Dataset v8 (stamps only).
