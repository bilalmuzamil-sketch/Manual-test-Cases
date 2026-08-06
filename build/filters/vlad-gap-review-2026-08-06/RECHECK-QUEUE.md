# RECHECK-QUEUE — Filters, Vlad gap review, 2026-08-06

## STATUS: **OPEN**

**Check this file at every session start** (`ls build/*/*/RECHECK-QUEUE.md`) and before and after any
Filters work. **A row closes only when it is re-verified — 100% of rows, no sampling (Rule 49).**

**BUILD MARKER FOR THIS PASS:** **`v3.4.2-280ca5a`** · `index.html` last-modified **Thu 06 Aug 2026
09:37:49 GMT** · etag `720a7f1f55332d16b2541429acf23b01` · sha256
`07cf9760c641e4eaf53ae6a7c788eb8d136d740971df07bf94946299e6e58adb` · read 2026-08-06 12:10Z.
**The branch redeployed this morning** (from `v3.4.2-d00239b`) and **is NOT declared final**, so an
OPEN queue is this project's **normal steady state** (Rule 60), not a failure.

**⚠️ THE HONEST HEADLINE: NOT ONE ROW BELOW WAS OBSERVED ON ANY BUILD.** The branch API returned
**HTTP 401 `sso_required`** for the whole session. Every verdict in this pass was settled from the
**specification, the epic and Branko's answers** — which is what a coverage question needs (Rule 57) —
but it means **all nine cases carry an expectation that has never been checked against a running
product**, and each says so in its own text in place of a build stamp.

**WHAT THE TRIGGER IS (Rule 61, and it is NOT "the next deploy").** Six of these nine rows are watched
by the **automated suite itself**: a `READY` case that starts failing, or the `EXPECT FAIL` case that
starts passing, is reported by the next run at no cost. **Only the rows whose trigger is a human answer
need chasing**, and their trigger is named per row.

**Scope of this queue: the 9 cases this pass wrote. The other 105 remain covered by the live queue
`build/filters/full-viu-2026-08-05/RECHECK-QUEUE.md`, which is also still OPEN.**

---

## THE ROWS

| # | Internal | C-id | Link | What was established | What changed | Build marker | Marker | **Re-check obligation — and its trigger** |
|---|---|---|---|---|---|---|---|---|
| 1 | FLT-TAB-02 | C29609 | [view](https://shopview.testrail.io/index.php?/cases/view/29609) | The spec's `S9-R2` "hidden" text is **unchanged since v4, 2026-05-14**, so Branko's 17 July answer and the QA lead's 30 July ruling are the later authority | Expectation restored to **shown greyed out and pre-filled**; marker READY → **HOLD** | `v3.4.2-280ca5a` (**not observed**) | HOLD | **Branko must confirm which behaviour is correct and correct the PRD.** Then set the marker, and if the build disagrees raise a defect. **Trigger: Branko's answer — NOT a deploy.** |
| 2 | FLT-TAB-03 | C29610 | [view](https://shopview.testrail.io/index.php?/cases/view/29610) | as row 1, for `S9-R3` / the Completed tab | as row 1 | `v3.4.2-280ca5a` (**not observed**) | HOLD | as row 1 |
| 3 | FLT-BAR-03 | C29559 | [view](https://shopview.testrail.io/index.php?/cases/view/29559) | as row 1; only this case's **point 3** was affected — its own assertion (the bar stays on the tab) is untouched | Point 3 restored to greyed/pre-filled; marker READY → **HOLD** | `v3.4.2-280ca5a` (**not observed**) | HOLD | as row 1. **If Branko rules for the PRD, this case returns to READY on its own merits** — its main assertion never depended on the answer |
| 4 | FLT-TAB-05 | C29612 | [view](https://shopview.testrail.io/index.php?/cases/view/29612) | as row 1; only the Estimates-tab sentence was affected — the retention assertion (`S9-R5`) is untouched | Expected 1 restored; marker READY → **HOLD** | `v3.4.2-280ca5a` (**not observed**) | as row 3 |
| 5 | FLT-BAR-02 | C29558 | [view](https://shopview.testrail.io/index.php?/cases/view/29558) | Ahtasham's leading-type-icon assertion (spec **v19** `S1-R3`) is correct and was kept; his edit had **removed** the provenance line and the marker | Converted out of raw HTML; contested Status-chip claim removed from precondition 3; provenance + **`READY - EXPECT FAIL (SV-8986)`** + the Rule-61 three outcomes restored | `v3.4.2-280ca5a` (**not observed**) | EXPECT FAIL | **The symptom is quoted from [SV-8986](https://shopview.atlassian.net/browse/SV-8986), not from our own observation — that must be confirmed once.** **Trigger: the automated suite** (outcome 3 reports the fix; outcome 2 reports a different failure) |
| 6 | FLT-PERS-07 | C43560 | [view](https://shopview.testrail.io/index.php?/cases/view/43560) | `S10-R2`'s **last-write-wins** assertion was covered by nothing | **New case** | none — **never observed** | READY | **Confirm once that two browsers signed in as one account actually behave this way.** **Trigger: the automated suite's first run** |
| 7 | FLT-PSRCH-14 | C43561 | [view](https://shopview.testrail.io/index.php?/cases/view/43561) | `S13-R19` names six surfaces; only one example page was exercised | **New case** | none — **never observed** | READY | **Confirm on a phone viewport across all six named pages, plus the single-icon control page.** **Trigger: the automated suite's first run** |
| 8 | FLT-PARTS-14 | C43562 | [view](https://shopview.testrail.io/index.php?/cases/view/43562) | Branko's Q5 promised parity on six things; **collapse, shareable URL and mobile** were covered by nothing | **New case** | none — **never observed** | HOLD | **Needs the filter bar to reach the remaining Parts views and report tabs.** **Trigger: the rollout — and Branko's Parts/Reports write-up, which is row 7 of Vlad's table** |
| 9 | FLT-MOB-11 | C43563 | [view](https://shopview.testrail.io/index.php?/cases/view/43563) | `S2-R7` names no screen size; the mobile sheet was tested for Imported nowhere | **New case** | none — **never observed** | READY | **Confirm on a phone viewport.** Separately, **Branko owes an answer** on the undocumented "strips imported when another status is toggled last" behaviour (`QUESTIONS-FOR-BRANKO.md` Q4) — if he confirms it, this case gains an assertion. **Trigger: the automated suite's first run, plus Branko for the extra assertion** |

---

## WHAT WOULD CLOSE THIS QUEUE

| Rows | Waiting on | Who |
|---|---|---|
| 1, 2, 3, 4 | **one sentence** confirming whether the Status chip is hidden or shown greyed out on the Estimates and Completed tabs | **Branko** (and the QA lead, whose 30 July ruling was reversed and is now reinstated) |
| 5, 6, 7, 9 | **the first automated run on a reachable branch** — plus a working sign-in for `.qa.shopview.com` if anyone wants to confirm manually first | **QA lead** (sign-in) / **Vlad** (the run) |
| 8 | **the Parts and Reports product write-up**, and the filter-bar rollout reaching the remaining views | **Branko** / engineering |

**Nothing here closes on a redeploy alone.** Under Rule 60(b) a redeploy invalidates the on-screen
labels, the pass/fail verdict and the `HOLD` half of the markers — and since **none of these nine rows
has a verdict yet**, there is nothing for a redeploy to invalidate.
