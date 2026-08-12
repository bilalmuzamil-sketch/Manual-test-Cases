# CHANGES MADE — Report Suite, 12 August 2026

**Build `v3.6-8c28eed` · 8 cases changed of our 480 · every change byte-verified.**

## The whole change set

| Case | Report | Change | Why |
|---|---|---|---|
| [C30511](https://shopview.testrail.io/index.php?/cases/view/30511) | Work In Progress | removed the *“the download fails outright whenever the tab has any rows”* block + its 3 outcome bullets; marker `READY - EXPECT FAIL (SV-8907)` → **`READY`**; build line re-stamped | the block is false on this build — 8 of 8 download attempts succeeded |
| [C30512](https://shopview.testrail.io/index.php?/cases/view/30512) | Work In Progress | removed the *“Nothing downloads”* block + 3 bullets; marker → **`READY`**; build line re-stamped | same, and its own three assertions were then confirmed from the CSV |
| [C30513](https://shopview.testrail.io/index.php?/cases/view/30513) | Work In Progress | removed the *“Nothing downloads”* block + 3 bullets; marker → **`READY`**; build line re-stamped | same |
| [C30514](https://shopview.testrail.io/index.php?/cases/view/30514) | Work In Progress | removed the *“Nothing downloads”* block + 3 bullets; marker → **`READY`**; build line re-stamped | same |
| [C30518](https://shopview.testrail.io/index.php?/cases/view/30518) | Work In Progress | removed the *“Nothing downloads”* block + 3 bullets; marker → **`READY`**; build line re-stamped | same, and its item 1 caption was confirmed word for word |
| [C30510](https://shopview.testrail.io/index.php?/cases/view/30510) | Work In Progress | build line `v3.5-4795eee` → **`v3.6-8c28eed`, 12 August 2026** | flipped to `READY` yesterday **with no build session**; now actually observed — the menu holds exactly `Download (PDF)` and `Download (CSV)` |
| [C30515](https://shopview.testrail.io/index.php?/cases/view/30515) | Work In Progress | build line re-stamped | same; the filenames really are `wip-2-report.pdf` / `wip-2-report.csv` |
| [C30516](https://shopview.testrail.io/index.php?/cases/view/30516) | Work In Progress | build line re-stamped | same; the CSV header really reads `Unit` |

**No title, no `refs`, no precondition and no step was changed on any case.** Only
`custom_expected` moved, and only in the ways listed.

## What the marker change means for tomorrow

**`READY - EXPECT FAIL` → `READY` on five cases changes what a tester is told to do.** Before: *“this
will fail, mark it FAILED, raise nothing.”* Now: *“run it and expect it to work.”* If any of the five
now fails, that is a **genuine new finding** and the tester should report it — which is the whole
point of taking a stale expect-fail note off a case.

**Suite-wide marker tally moved: `READY` 338 → 343, `READY - EXPECT FAIL` 100 → 95, `HOLD` 42
unchanged** — both figures re-read from live TestRail after the writes, not computed from these
notes. The gate still closes both ways: **343 + 95 = 438 = 480 − 42.**

**Four counts reconcile, set-equal in both directions: live ours 480 · id-map 480 · import 480 ·
run 359 tests 480** (live total 492, the extra 12 being Vladimir Tomovic's).

## What was deliberately NOT changed

- **[C30517](https://shopview.testrail.io/index.php?/cases/view/30517)** — the PDF logo case. The
  PDF holds one embedded JPEG, consistent with a logo but **not an observed logo**. Build line left
  exactly as found.
- **[C30511](https://shopview.testrail.io/index.php?/cases/view/30511) item 1's Inv. Hrs sentence**
  — the toggle did not take in the harness, so **nothing is claimed either way**. Outstanding item.
- **The five WIP tab-name cases** (C30452, C30462, C30464, C30488, C30490) — they look miscased
  against `textContent` and are **right against what the tester sees**. See `LABEL-DIFF.md`.
- **The other 472 cases' build lines** — not observed this session, so not re-stamped.
- **The Location-column question** — already open with Chris Ward, already covered by three `HOLD`
  cases; not reopened.
- **The 12 foreign cases** — never read for verdicts, never written, proven byte-identical.

## Operations that were NOT performed

`0 add_case` · `0 delete_case` · `0` section writes · `0` run writes · `0` results logged ·
`0 update_run` · **`0` Jira calls of any kind** (the creation hold is active — `SV-8907` should be
closed and that is reported, not done) · `custom_atmstatus` **never sent on any payload**.
