# Aging Reports Test Progress — dashboard

https://claude.ai/artifact/E6MSrJDofWwCjyYii6tKTg (Dashboard type; private to the QA lead's account).

- Its only data is a CSV of run 557 (`case,title,status,area,area_order`; status Passed / Failed / Blocked / Retest / Not yet run;
  area = the case's TestRail folder as on 11 Nov). Snapshots here: `aging-run-results-<date>.csv`.
- To refresh: rebuild the CSV from `get_tests/557` (paged), upload it with the Artifact tool (`asset: true`), then update the
  `datasets/results` document's `source.url` + `updated` + `edit` (pin `if_version`), and the page's words in `files/index.html`
  (read it first — the QA lead may have edited words with the pencil).
- 12 Nov 2026 11:35 UTC: 470 tests (C1079045 left the run after 11 Nov): 459 Passed · 2 Failed · 7 Blocked · 2 Not yet run;
  page now shows Blocked (tile, chart, table), current findings, what is left; "Run so far" shows one decimal.
