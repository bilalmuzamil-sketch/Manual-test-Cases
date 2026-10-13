## §N.1 — `gen_import.py` blanks the id-map C-ids (Report Suite too)

Running `build/report-suite/gen_import.py` **blanked all 469 C-ids** in
`build/report-suite/testrail-id-map.csv`. Same gotcha already recorded for Filters and Schedule.
**Fix: `git checkout -- build/report-suite/testrail-id-map.csv` after any regeneration, then verify
`0 blanks`.** The import file itself is fine.


---

