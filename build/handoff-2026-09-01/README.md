# HANDOVER — 2026-09-01 · Inline Add and Edit Parts (6597) and Printer Friendly Work Orders (6617)

**Tester:** Viktoria Videnovic (TestRail user 4) — the QA lead's assignment of 2026-09-01, verbatim:
*"invoice refresh os for the manual QA tester Mudassir. 6597/6617 is for Viktoria."*
**Build verified against:** `v26.35.6-598cc8a` on https://sv9315.qa.shopview.com.
**Runs:** 418 (Inline, 119 tests) · 419 (Printer Friendly, 44 tests) — both set-equal to the cases in
both directions, both with **zero** results pre-recorded.

## What to read, in order

| # | File | Who it is for |
|---|---|---|
| 1 | `TESTER-BRIEF-Inline-Add-and-Edit-Parts-and-Printer-Friendly-Work-Orders-2026-09-01.md` | the tester — plain English, no case ids in prose, every skipped test with the reason and what to do instead |
| 2 | `Inline-Add-and-Edit-Parts_and_Printer-Friendly-Work-Orders_Defects-for-Testers_2026-09-01.xlsx` | the tester — everything that did not pass, a tab per kind, every row with a written next step |
| 3 | `HOW-THE-NUMBERS-WERE-DERIVED.md` | the QA lead — where every figure came from, the arithmetic gate shown both ways, and every gate with the command to re-run it |

## 🔑 Everything above is GENERATED. Nothing is transcribed.

Re-derive any figure rather than trusting it:

```
python3 build/handoff-2026-09-01/census.py                      # live marker census + run set-equality
python3 build/handoff-2026-09-01/handover_gates.py              # marker/provenance/formatting gates
python3 build/handoff-2026-09-01/check_self_explains.py         # every held case explains itself
python3 build/testing-tools/check_runnable_cases.py --cases …   # can a person follow it from the screen
node  build/inline-add-edit-parts/build-verify-2026-09-01/tools/served_page_scan.mjs   # what the tester SEES
python3 build/handoff-2026-09-01/gen_brief.py                   # rewrites the brief + the working
python3 build/handoff-2026-09-01/gen_defects_workbook.py        # rewrites the workbook
```

A stale brief is worse than none, so if a count moves, re-run `gen_brief.py` — do not edit the
markdown by hand.

## The one thing not to misread

**The marker count is a marker count, not a coverage claim.** "151 tests to run" says how many have
steps a person can follow on this build. It does not say 151 requirements are covered and it does not
say anything passed.

## What is still outstanding

Five items, in `build/OUTSTANDING-ITEMS-REGISTER.md` rows **HO-1 … HO-5**: a per-case go-ahead for
C45123, a ruling on Vladimir Tomovic's C45220, five product-owner answers, permission to file the one
C45068 defect, and five data states 6617 needs that sv9315 does not have.

## Subfolders

- `tester-note-write/` — the 2026-09-01 pass that put each held case's reason **inside the case**
  (skill 04 §4): the payload builder, the intended blocks, the pre-write snapshot, and the per-case
  applied log. 14 cases, 0 failures. It reuses the Inline suite's proven UI writer rather than a new
  one (Rule 27).
