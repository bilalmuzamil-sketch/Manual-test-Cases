# SBC RE-VERIFY SWEEP — Automated cases HELD (Rule 71), 2026-08-19

**10 of the 46 in-scope SBC cases carry live `custom_atmstatus = 3` (Automated).** Per Rule 71 these
are **HELD — verified live where observable, but WRITE NOTHING** (no re-stamp, no marker change) until
the QA lead ratifies with the automation engineer (Vlad). **0 writes were made to any of these.**
(Note: `update_case` is environmentally blocked this pass anyway — see SBC-SWEEP-EXECUTION.md — so no
Automated case could have been written even if authorised.)

**Live `custom_atmstatus` re-read for all 46 in scope was authoritative** — the 2026-08-18
`SBC-EXECUTION.md` `atm` column was stale (it showed several of these as atm=1). The correct current
set of atm=3 in scope is the 10 below.

| C-id | title (short) | live-verified on v3.8-da72171 | verdict (observed, NOT written) |
|---|---|---|---|
| [C30098](https://shopview.testrail.io/index.php?/cases/view/30098) | Ordinary reports access opens SBC — no separate permission | Admin (has `reportsPageAccess`) opens SBC; catalog has only `reportsPageAccess`, no per-report perm | PASS |
| [C30099](https://shopview.testrail.io/index.php?/cases/view/30099) | Without reports access, SBC not listed / cannot open | Tech user (no `reportsPageAccess`): `/reports` bounces to `/workorders`, SBC absent from nav, direct route bounces | PASS |
| [C38912](https://shopview.testrail.io/index.php?/cases/view/38912) | Location column shown to multi-location user; "Multiple" on aggregation | Location column present; "Multiple" shown on aggregation rows | Location column BUILT; **known Location-rule deviation carried from 08-18 pass** — unchanged, still HOLD per prior finding |
| [C30138](https://shopview.testrail.io/index.php?/cases/view/30138) | Invoice number opens invoice in same tab | Invoice number is a **plain non-clickable span** (no nav) → collides with the open invoice-link PO question | BLOCKED on PO question (link vs plain text) — see FINDINGS |
| [C30159](https://shopview.testrail.io/index.php?/cases/view/30159) | Overflow menu holds exactly 4 downloads, no Print | Export menu = Summary/Expanded × PDF/CSV, **no Print** | PASS |
| [C30163](https://shopview.testrail.io/index.php?/cases/view/30163) | CSV/PDF hold exactly the filtered+sorted customers | Export request fires with active filters/sort (`variant`/`format`/`range`/`sortBy`) | PASS (structure verified; row-for-row content manual-observable) |
| [C30174](https://shopview.testrail.io/index.php?/cases/view/30174) | Filters/sort/columns restored on next visit | Reload restores filters/sort/columns | PASS |
| [C30175](https://shopview.testrail.io/index.php?/cases/view/30175) | Search text/expansion/scroll NOT saved | Reload collapses expansion (59→27) | PASS |
| [C30177](https://shopview.testrail.io/index.php?/cases/view/30177) | Saved view specific to this report | Persistence is per-report (SBC view URL/prefs distinct) | PASS (per-report scope observed) |
| [C30180](https://shopview.testrail.io/index.php?/cases/view/30180) | Customer filter restore: all stays all; id-set intersected | Customer filter + persistence observed | PASS (all-customers restore observed; intersect detail manual-observable) |

**For Vlad / QA-lead ratification:** none of these 10 need a content change from this sweep — they are
already build-accurate and PASS live (except C38912's carried Location deviation and C30138's PO
question). When the write path is restored and Rule-71 ratification is given, only a Rule-54 sentence-2
build re-stamp (`v3.8-da72171`) is owed; no marker or wording change.
