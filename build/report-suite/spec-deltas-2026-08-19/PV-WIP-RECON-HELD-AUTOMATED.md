# PV + WIP reconciliation — HELD cases (Automated atm=3 + source-blocked) — 2026-08-20

**Rule 71 (Automated cases are ask-first, HELD on a docs/currency pass) + Rules 57/58 (source not in
hand → HOLD, never write from the build).** No write was performed to any case listed here.

## HELD — Automated (custom_atmstatus = 3), verified live, WRITTEN NOTHING (Rule 71)

| Case | C-id | atm (read live) | Live observation | Why held |
|---|---|---|---|---|
| WIP-SUM-02 | [C30488](https://shopview.testrail.io/index.php?/cases/view/30488) | **3** | Live strip shows TWO "=" totals (TOTAL COMPLETED WORK $1,091,117.27, REMAINING WORK $748,133.11), not a single distinct hero; figure styles uniform (no coloured underline observed). The case asserts the OLD v22 "Total Earned is the hero". | **atm=3 Automated (Rule 71 ask-first)** AND source-blocked (B.3 below). Any content edit must couple with build-verify + Vlad hand-off (skill 03 §6.4) AND be sourced from the v24/design-review doc, which is not in hand. |

**For Vladimir Tomovic (id 1) when B.3 is unblocked:** C30488's figure name/hero assertion will change
(old "Total Earned" hero → v24 design). No change made yet — flagged so his automation is not handed a
moving target (Rule 65/71). Register: `build/fabian-review-2026-08-17-CONSOLIDATED/AUTOMATED-CASES-REGISTER.md`.

## HELD — source-blocked (Story-5 design adoption, v24/design-review SSO-walled) — Rules 57/58

The build has fully adopted a NEW Summary-Strip design (new figure names + grouped +/= math + reworded
tooltips — full evidence in `EXECUTION.md` Delta B.3). The six new figure names and six of the seven
tooltips are in **NO document held** (repo / Chris rulings file / v22 baseline) — only on the build and
the SSO-walled v24 spec / Aug-13 design review. The **Estimates** tooltip is the one exception: it is
byte-identical to C30493's already-locked S5a-R2 wording. Writing the new names/tooltips from the build
fails the Rule 58(b) quote-back test → **HELD, no writes:**

| Case | C-id | atm | Element | Status |
|---|---|---|---|---|
| WIP-SUM-01 | [C30487](https://shopview.testrail.io/index.php?/cases/view/30487) | 1 | figure names/order + currency | HELD — asserts old v22 names; new names undocumented |
| WIP-SUM-03 | [C30489](https://shopview.testrail.io/index.php?/cases/view/30489) | 1 | grouped math | HELD — old names; new grouped +/= math undocumented |
| WIP-SUM-04 | [C30490](https://shopview.testrail.io/index.php?/cases/view/30490) | 1 | per-stage = tab total | HELD — old names |
| WIP-SUM-05 | [C30491](https://shopview.testrail.io/index.php?/cases/view/30491) | 1 | Estimates figure, muted | HELD — old names |
| WIP-SUM-07 | [C30493](https://shopview.testrail.io/index.php?/cases/view/30493) | 1 | locked tooltips (7) | HELD — Estimates tooltip MATCHES build; other 6 names+tooltips undocumented |
| WIP-ADJ-05 | [C43818](https://shopview.testrail.io/index.php?/cases/view/43818) | 1 | seven figures, no Adjustments tile | HELD — figure-name list is old v22 wording |
| WIP-VIS-02 | [C30520](https://shopview.testrail.io/index.php?/cases/view/30520) | 1 | strip visual band | HELD — spot-checked; defer to the v24 design consistency pass |
| WIP-VIS-06 | [C30524](https://shopview.testrail.io/index.php?/cases/view/30524) | 1 | tooltip a11y | HELD — tooltip wording sourcing blocked |
| WIP-VIS-08 | [C43838](https://shopview.testrail.io/index.php?/cases/view/43838) | 1 | tab highlight (amber glow) | HELD — already flags "confirm colour live"; the NEW tab-to-figure highlight is separate (recommend a new case, Rule 62 hold) |

**Unblock:** QA lead supplies the WIP v24 Confluence page + Aug-13 design-review export (ratified figure
names + locked tooltip wording). Then a single coupled build-verify pass writes all of B.3, lifts/sets
markers, and hands changed Automated cases to Vlad.
