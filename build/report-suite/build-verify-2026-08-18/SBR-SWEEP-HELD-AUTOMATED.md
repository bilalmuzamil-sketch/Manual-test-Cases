# SBR SWEEP — AUTOMATED CASES HELD (ask-first, Rule 71) — 2026-08-19, build v3.8-b7d80dc

Live `custom_atmstatus` was re-read for the whole SBR folder this sweep. **14 SBR cases are Automated
(`custom_atmstatus = 3`) on the live build** — NOT the 4 the 8/18 `SBR-HELD-AUTOMATED.md` recorded (the
8/18 atm column was stale; +10 more were flagged Automated since, ~5h before this pass by another
worker/pass). **All 14 were HELD: 0 writes** (Rule 71), byte-unchanged, `updated_on` predates this pass
(oldest touch 5.2h ago — a prior pass, not this run which ran minutes ago). All 14 are `created_by = 3`
(ours) but Automated-flagged. Recorded for the QA lead's ask-first ratification.

| C-id | title (short) | current marker | intended change (NOT applied) | affects automation? |
|---|---|---|---|---|
| [C30217](https://shopview.testrail.io/index.php?/cases/view/30217) | Rep row appears only with a matching invoice | `READY` | optional sentence-2 build-check | No (metadata) |
| [C30221](https://shopview.testrail.io/index.php?/cases/view/30221) | Expand rep loads invoices on demand | `Not available on Build to test Yet` | **Lift → READY** (expand-tree is built) + build-check | **Yes** — marker would change |
| [C30247](https://shopview.testrail.io/index.php?/cases/view/30247) | Detail-row invoice/customer links navigate | `READY` | optional build-check | No (metadata) |
| [C30255](https://shopview.testrail.io/index.php?/cases/view/30255) | Cancel/X/Escape dismiss Deactivate dialog | `READY` | optional build-check | No (metadata) |
| [C30256](https://shopview.testrail.io/index.php?/cases/view/30256) | Valid submit locks + deactivates | `READY` | optional build-check | No (metadata) |
| [C30262](https://shopview.testrail.io/index.php?/cases/view/30262) | Show Unassigned adds one top-pinned row | `READY` | optional build-check | No (metadata) |
| [C30271](https://shopview.testrail.io/index.php?/cases/view/30271) | Filter/view settings restored before first paint | `READY` | optional build-check | No (metadata) |
| [C30272](https://shopview.testrail.io/index.php?/cases/view/30272) | Expansion/scroll not remembered | `READY` | optional build-check | No (metadata) |
| [C30274](https://shopview.testrail.io/index.php?/cases/view/30274) | First visit / cleared storage = all defaults | `READY` | optional build-check | No (metadata) |
| [C30275](https://shopview.testrail.io/index.php?/cases/view/30275) | A-to-Z default is its own saved value | `READY` | optional build-check | No (metadata) |
| [C30276](https://shopview.testrail.io/index.php?/cases/view/30276) | ⋯ overflow menu lists exactly four downloads | `READY` | optional build-check | No (metadata) |
| [C30277](https://shopview.testrail.io/index.php?/cases/view/30277) | All four downloads respect filters/full set | `READY` | optional build-check | No (metadata) |
| [C30293](https://shopview.testrail.io/index.php?/cases/view/30293) | Sales Rep Assignments CSV: name/headers/BOM | `READY` | optional build-check | No (metadata) |
| [C30314](https://shopview.testrail.io/index.php?/cases/view/30314) | Invoice credit snapshot (WO rep → customer rep → unassigned) | `READY` | optional build-check | No (metadata) |

**Live verdicts (report-level, this sweep on `v3.8-b7d80dc`):** the SBR report is fully built and
populated — the rep/invoice tree, Show Unassigned roll-up, the ⋯ four-download export menu and the
report API (HTTP 200, 52 rows) are all live. C30221's expand-on-demand tree is **built and runnable**
(the only marker that should change). C30293 (assignments-export CSV) and C30314 (WO-rep / customer-rep
credit fallbacks) could not be deep-driven — the assignments-export endpoint was not located from the
report page and no invoices with an assigned rep exist in this org (all Unassigned).

**Recommendation for the QA lead:** ratify lifting **C30221 → `AUTOMATION: READY`** (coupled with the
recorded verification, skill-03 §6.4), then hand the case numbers to Vladimir Tomovic (id 1) via
`build/fabian-review-2026-08-17-CONSOLIDATED/AUTOMATED-CASES-REGISTER.md`. The other 13 are already
`READY` and correct; only a metadata build-check stamp was withheld.
