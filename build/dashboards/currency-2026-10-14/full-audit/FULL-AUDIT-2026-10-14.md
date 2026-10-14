# Dashboard — independent full audit of all 106 live cases against the current PRD (14 Oct 2026)

Read-only audit. No TestRail, Jira, Confluence, Slack or Google write; no build sign-in. Owner = who holds the case today: **Vladimir** = created by Vladimir Tomovic; **Nebojsa** = created by us, last edited by Nebojsa Glavinic (the earlier "6 ours + 6 Nebojsa's" split uses the same rule); **us** = created and last edited by us. Automated? = TestRail automation status.

**Current spec: PRD Confluence 788430850 version 48** (fetched 14 Oct 2026, saved as `CONFLUENCE-788430850-v48-2026-10-14c.md`). v48 differs from v46 only in: **S9-R11 reworded** ("A chart has nothing to show when no point in the range has a value, or when every point is zero, the same test the tile uses (S4-R13). On Revenue that includes a range with no sales at all; a range with some sales still draws its $0.00 days as real points (S4-R11a)." — PO answer 16), a new header Status row, and two 14 Oct Change Log rows. Every other line is identical after markup normalisation (script diff).

Design canvas: the PO's re-shared canvas (`sources/design-2026-10-14b/`) was compared file by file with this morning's copy; the changed and removed boards drive verdict D below.

## 1 · Summary

| Owner | Cases | A (behaviour changed) | B (cannot be done as written) | Cases needing update + retest (A or B) | C (provenance / quote refresh) | D (cites a changed or removed design board) | OK |
|---|---|---|---|---|---|---|---|
| us | 66 | 7 | 2 | 8 | 66 | 48 | 0 |
| Nebojsa | 31 | 7 | 0 | 7 | 31 | 25 | 0 |
| Vladimir | 9 | 0 | 0 | 0 | 0 | 0 | 9 |
| **Total** | **106** | **14** | **2** | **15** | **97** | **73** | **9** |

A case can carry several letters. **The answer to the QA lead's question:** the earlier 12 were all correctly listed, but the list was **incomplete in two ways**: (1) **3 more cases** read the tile trend line's *level*, which S4-R11b (v45, 14 Oct) makes meaningless, and (2) **one listed case (C88606) was listed for only half its problem** (it also accepts a Revenue line that drops no-sale days, against S4-R11a, v43, 9 Oct). Separately, **every one of our 97 cases is stale in its provenance**: each Source line says "Confluence 788430850 v42, read 7 Oct 2026" while the page is now at v48, two cases quote the old S5-R9 sentence word for word, and 73 cite design boards that the PO has just changed or removed. So the suite *will* stay stale unless the provenance refresh (C) and board re-pointing (D) are done for all 97, not only the 15 behaviour updates.

## 2 · Cases that must be updated and retested (A and/or B) — 15

| Case | Title | Owner | Automated? | Verdict | What changes and why (spec code · version · date) | In earlier 12? |
|---|---|---|---|---|---|---|
| [C88606](https://shopview.testrail.io/index.php?/cases/view/88606) | The small trend line uses days, weeks, months or quarters by range length | us | Yes (automated) | A,B | B: step 4 needs 731- and 732-day custom ranges; the tile calendar is capped at 366 days (S7-R2a, v45, 14 Oct). A: "31 days draws one point per day (up to 31 points)" lets a Revenue line that skips no-sale days pass; S4-R11a (v43, 9 Oct) makes every no-sale day a point at $0, so exactly 31. Quotes lack S4-R11a/S4-R11b. | yes |
| [C88610](https://shopview.testrail.io/index.php?/cases/view/88610) | At Risk count, its twelve-month trend line and the remembered window | Nebojsa | Yes (automated) | A | A (minor): "Its last point sits at the same level as the headline" cannot be judged under S4-R11b (v45, 14 Oct): the line shows direction, not level, and only the headline carries the value. Rest (S5-R13..R15, S6-R16) unchanged. | **NO — missed** |
| [C88619](https://shopview.testrail.io/index.php?/cases/view/88619) | Technician filter on the expanded technician charts | Nebojsa | Yes (automated) | A | S8-R5a (v44, 13 Oct): the table under each technician chart must list only the kept technicians; the case checks only the chart, so a build whose table ignores the filter passes. | yes |
| [C88620](https://shopview.testrail.io/index.php?/cases/view/88620) | Unticking every technician hides the technician chart | Nebojsa | Yes (automated) | A | S8-N1a (v44, 13 Oct): with every technician unticked the table under the chart must be hidden too; the case checks only the chart. Section 7 now names S8-N1a (v45). | yes |
| [C88628](https://shopview.testrail.io/index.php?/cases/view/88628) | Expanded Sales by Customer and At Risk tables show the expected columns | Nebojsa | Yes (automated) | A | S5-N3 (v45, 14 Oct): the At Risk panel has no inactivity control of its own; the case expects an "Inactive for" select at the panel top right, so a correct build fails. Also S6-R8a (v45): Revenue (12 Mo) amounts are links, walk-in/$0.00 plain text. | yes |
| [C88632](https://shopview.testrail.io/index.php?/cases/view/88632) | Sales and Advisor Analysis reports drop a voided invoice and keep its re-invoice | us | No (manual) | A | Step 14 expects the release note to say a voided-then-reinvoiced figure "can move up". The published notes (928121200 v5/v6 and 931069964 v6/v7, 14 Oct 15:07 UTC, PO answer 2) say totals "can change" and "A voided invoice that was invoiced again counts only the new amount" - not "move up", so a strict tester fails correct notes; the "not known where notes are published" escape is obsolete. | yes |
| [C88645](https://shopview.testrail.io/index.php?/cases/view/88645) | At Risk trend line has twelve monthly points and the last equals the count | us | Waiting to be automated | A | A (minor): its fallback "compare heights"/"judge from the two screenshots" no longer works under S4-R11b (v45): each tile rescales its line between its own lowest and highest point, so earlier points move on screen when only the last point changes - a build that recomputes only the last point could pass. S5-R13 itself unchanged. | **NO — missed** |
| [C88647](https://shopview.testrail.io/index.php?/cases/view/88647) | Trend line splits the range by day, week, month or quarter correctly | us | No (manual) | B | Step 4 needs 731- and 732-day custom ranges; the tile calendar is capped at 366 days (S7-R2a, v45, 14 Oct). Step 1 already expects exactly 31 points. | yes |
| [C351708](https://shopview.testrail.io/index.php?/cases/view/351708) | Revenue of $0.00 keeps its headline above an empty chart outline | Nebojsa | Waiting to be automated | A | Step 4 expects the expanded Revenue chart with "axis and month labels with no bars". S6-R3a (v45): This Month shows daily bars; S9-R11 reworded in v48 (14 Oct, PO answer 16): a Revenue range with no sales at all reads "No data for selected date range". Its quoted S4 context note ("unchanged") is superseded in effect. | yes |
| [C351714](https://shopview.testrail.io/index.php?/cases/view/351714) | Sales by Customer and At Risk at zero show an empty chart outline | Nebojsa | Waiting to be automated | A | S5-R9 (reworded v45, 14 Oct): with none at risk the line must read "$0.00 (12mo) · 0 customers"; the case only asks the tester to write the line down, so a build that drops it passes. (Sales by Customer's line at zero is still undefined - PO item.) | yes |
| [C351716](https://shopview.testrail.io/index.php?/cases/view/351716) | This Month's figure and trend line both include today's sales | us | Waiting to be automated | A | A (minor): "its last point has risen compared with before the invoice" relies on the line's level; under S4-R11b (v45) the line is scaled to its own min/max, so if today was already the highest day the dot stays at the top and a correct build fails. Use the headline (and hover value) instead. | **NO — missed** |
| [C351717](https://shopview.testrail.io/index.php?/cases/view/351717) | Advisor filter on the expanded Billing Efficiency chart | Nebojsa | Waiting to be automated | A | S8-R5a (v44, 13 Oct): the Advisor Analysis table must follow the Advisor filter; the case checks only the chart. | yes |
| [C351723](https://shopview.testrail.io/index.php?/cases/view/351723) | Hovering a name in a dashboard chart legend shows latest month and average | us | No (manual) | A | S9-R10 (v45, 14 Oct): the legend hover shows the latest value and month with no average; the case expects "· avg 107%", so it fails a correct build and passes today's build (PO: build still shows avg). | yes |
| [C351729](https://shopview.testrail.io/index.php?/cases/view/351729) | A report without the tile's preset opens on the same dates as Custom | us | Waiting to be automated | A | S7-R2a (v45, 14 Oct): the tile calendar must offer a custom range; the case lets a build without it be marked Blocked ("not reachable by hand") instead of Failed. | yes |
| [C351734](https://shopview.testrail.io/index.php?/cases/view/351734) | Hovering a name in a report chart legend shows latest month and average | us | No (manual) | A | S9-R10 (v45, 14 Oct) applies to report charts too: no average in the legend hover; the case expects "· avg". | yes |

### 2a · What the earlier 12 MISSED

- [C88610](https://shopview.testrail.io/index.php?/cases/view/88610) — At Risk count, its twelve-month trend line and the remembered window (Nebojsa, Yes (automated)). A (minor): "Its last point sits at the same level as the headline" cannot be judged under S4-R11b (v45, 14 Oct): the line shows direction, not level, and only the headline carries the value. Rest (S5-R13..R15, S6-R16) unchanged.
- [C88645](https://shopview.testrail.io/index.php?/cases/view/88645) — At Risk trend line has twelve monthly points and the last equals the count (us, Waiting to be automated). A (minor): its fallback "compare heights"/"judge from the two screenshots" no longer works under S4-R11b (v45): each tile rescales its line between its own lowest and highest point, so earlier points move on screen when only the last point changes - a build that recomputes only the last point could pass. S5-R13 itself unchanged.
- [C351716](https://shopview.testrail.io/index.php?/cases/view/351716) — This Month's figure and trend line both include today's sales (us, Waiting to be automated). A (minor): "its last point has risen compared with before the invoice" relies on the line's level; under S4-R11b (v45) the line is scaled to its own min/max, so if today was already the highest day the dot stays at the top and a correct build fails. Use the headline (and hover value) instead.
- [C88606](https://shopview.testrail.io/index.php?/cases/view/88606) — listed earlier only for the 731/732-day ranges (B). It is also **A**: its expected "up to 31 points" passes a Revenue trend line that leaves out no-sale days, which S4-R11a (v43, 9 Oct 2026) forbids (every no-sale day is a point at $0). The update must change both.

The three missed cases are **minor A**: each fails or passes wrongly only in a particular data situation (today already the highest day; the no-hover-values fallback; a judgement of "level"), but each asks the tester to read something S4-R11b explicitly says the trend line does not show ("The sparkline shows direction, not level ... The headline carries the actual value").

### 2b · Which of the earlier 12 are WRONG

**None.** Each of the 12 was re-read step by step against v48 and each still fails a correct build or passes a wrong one. Notes: C351708 is now settled by S9-R11 (v48): with no sales at all the expanded Revenue chart reads "No data for selected date range" (the PO question raised for it is answered). C88632 stays A: the published notes say totals "can change" and that a re-invoiced void "counts only the new amount", not that a figure "can move up", so the expected text must quote the published note. C88628's update should also add S6-R8a (amounts are links; walk-in and $0.00 are plain text). C351714's Sales by Customer supporting line at zero is still not defined by the spec (PO item).

### 2c · Looked at hard and kept OUT of A/B (adversarial pass in the other direction)

- C88612 — "monthly bars, e.g. Oct 2025 to Sep 2026" on Last 12 Months is right for a September run (S6-R3a, S10-R8); only the example drifts with the test date (C).
- C351718, C88615 — set a technician/advisor filter and check it is remembered; the table following it (S8-R5a) is covered by the earlier new test, not by changing these.
- C88609, C88630 — behaviour checked (one, or two or more at risk) is unchanged; only the S5-R9 quote is stale (C).
- C88611, C88598 — read the At Risk headline "0" only; the zero supporting line is C351714's job.
- C204097, C88650 — already expect daily bars on This Week / This Month, now backed by S6-R3a; C204097's week with one negative day is not "every point zero", so S9-R11 (v48) does not apply.
- C88617, C88648 — the nine presets are still exactly the preset list (S7-R2a: Today is inside the calendar, not a tenth preset); custom ranges need new tests.
- C540783 (Vladimir) — matches S6-R8a; watch item: step 2 changes the window after the panel opens, which must now be the tile pill (S5-N3).
- C88624, C351732, C351735 — assume monthly bars on the report-page charts; no rule (old or new) sets report-chart bucketing, so nothing changed; raised as an observation (section 6).

## 3 · C — provenance and quote refresh (Rule 113)

Every quote in the 97 cases that carry quotes (319 quotes) was checked by script against the v48 text: **315 are still verbatim**, 2 are tech-plan quotes (correct source), and **2 are the old S5-R9 sentence** (C88609, C88630). But every one of the 97 names "Confluence 788430850 v42, read 7 Oct 2026" as its source, so all 97 need the version and read date re-stamped, and the cases below also need a newer code added because the behaviour they test is now written in the spec.

### 3a · Quote no longer matches the source (S5-R9 reworded, v45) — 2

- [C88609](https://shopview.testrail.io/index.php?/cases/view/88609) (us, Yes (automated)) — Behaviour checked (1 and 2+ at risk, pill control) unchanged, but its S5-R9 quote is the v42 sentence; S5-R9 was reworded in v45 (14 Oct) to cover zero, so the quote no longer matches the source.
- [C88630](https://shopview.testrail.io/index.php?/cases/view/88630) (Nebojsa, Yes (automated)) — Behaviour (2+ customers, total over all rows) unchanged, but its S5-R9 quote is the v42 sentence, reworded in v45 (14 Oct).

### 3b · Behaviour unchanged but now governed by a new code that should be quoted (S6-R3a / S7-R2a) — 4

- [C88612](https://shopview.testrail.io/index.php?/cases/view/88612) (us, Yes (automated)) — S6-R1..R7 unchanged; "monthly bars, e.g. Oct 2025 to Sep 2026" is right for Last 12 Months tested in Sep 2026 (S6-R3a, S10-R8) but the example months shift with the test date; add S6-R3a. Panel pointer/arrow flip come from boards 04-08.
- [C88650](https://shopview.testrail.io/index.php?/cases/view/88650) (us, Waiting to be automated) — "The chart's bars add up to the headline" on This Month already assumes daily bars - now backed by S6-R3a (v45); Source cites only the board caption, so add S6-R3a.
- [C204097](https://shopview.testrail.io/index.php?/cases/view/204097) (us, No (manual)) — S9-R8 unchanged; "today's bar" on This Week already assumes daily bars (S6-R3a); a week with one negative day is not "every point zero", so S9-R11 (v48) does not apply. Add S6-R3a.
- [C351704](https://shopview.testrail.io/index.php?/cases/view/351704) (us, Waiting to be automated) — S3-E1 unchanged; picks a one-day range in the tile calendar, which S7-R2a (v45) now formally allows - add S7-R2a.

### 3c · Version stamp only (quotes verbatim in v48, Source says v42) — 76

[C88594](https://shopview.testrail.io/index.php?/cases/view/88594), [C88595](https://shopview.testrail.io/index.php?/cases/view/88595), [C88596](https://shopview.testrail.io/index.php?/cases/view/88596), [C88597](https://shopview.testrail.io/index.php?/cases/view/88597), [C88598](https://shopview.testrail.io/index.php?/cases/view/88598), [C88599](https://shopview.testrail.io/index.php?/cases/view/88599), [C88600](https://shopview.testrail.io/index.php?/cases/view/88600), [C88601](https://shopview.testrail.io/index.php?/cases/view/88601), [C88602](https://shopview.testrail.io/index.php?/cases/view/88602), [C88603](https://shopview.testrail.io/index.php?/cases/view/88603), [C88604](https://shopview.testrail.io/index.php?/cases/view/88604), [C88605](https://shopview.testrail.io/index.php?/cases/view/88605), [C88607](https://shopview.testrail.io/index.php?/cases/view/88607), [C88608](https://shopview.testrail.io/index.php?/cases/view/88608), [C88611](https://shopview.testrail.io/index.php?/cases/view/88611), [C88613](https://shopview.testrail.io/index.php?/cases/view/88613), [C88614](https://shopview.testrail.io/index.php?/cases/view/88614), [C88615](https://shopview.testrail.io/index.php?/cases/view/88615), [C88616](https://shopview.testrail.io/index.php?/cases/view/88616), [C88617](https://shopview.testrail.io/index.php?/cases/view/88617), [C88618](https://shopview.testrail.io/index.php?/cases/view/88618), [C88621](https://shopview.testrail.io/index.php?/cases/view/88621), [C88622](https://shopview.testrail.io/index.php?/cases/view/88622), [C88623](https://shopview.testrail.io/index.php?/cases/view/88623), [C88624](https://shopview.testrail.io/index.php?/cases/view/88624), [C88625](https://shopview.testrail.io/index.php?/cases/view/88625), [C88626](https://shopview.testrail.io/index.php?/cases/view/88626), [C88627](https://shopview.testrail.io/index.php?/cases/view/88627), [C88629](https://shopview.testrail.io/index.php?/cases/view/88629), [C88631](https://shopview.testrail.io/index.php?/cases/view/88631), [C88633](https://shopview.testrail.io/index.php?/cases/view/88633), [C88634](https://shopview.testrail.io/index.php?/cases/view/88634), [C88635](https://shopview.testrail.io/index.php?/cases/view/88635), [C88636](https://shopview.testrail.io/index.php?/cases/view/88636), [C88637](https://shopview.testrail.io/index.php?/cases/view/88637), [C88638](https://shopview.testrail.io/index.php?/cases/view/88638), [C88639](https://shopview.testrail.io/index.php?/cases/view/88639), [C88640](https://shopview.testrail.io/index.php?/cases/view/88640), [C88641](https://shopview.testrail.io/index.php?/cases/view/88641), [C88642](https://shopview.testrail.io/index.php?/cases/view/88642), [C88643](https://shopview.testrail.io/index.php?/cases/view/88643), [C88644](https://shopview.testrail.io/index.php?/cases/view/88644), [C88646](https://shopview.testrail.io/index.php?/cases/view/88646), [C88648](https://shopview.testrail.io/index.php?/cases/view/88648), [C88649](https://shopview.testrail.io/index.php?/cases/view/88649), [C88651](https://shopview.testrail.io/index.php?/cases/view/88651), [C88652](https://shopview.testrail.io/index.php?/cases/view/88652), [C204098](https://shopview.testrail.io/index.php?/cases/view/204098), [C351705](https://shopview.testrail.io/index.php?/cases/view/351705), [C351706](https://shopview.testrail.io/index.php?/cases/view/351706), [C351707](https://shopview.testrail.io/index.php?/cases/view/351707), [C351709](https://shopview.testrail.io/index.php?/cases/view/351709), [C351710](https://shopview.testrail.io/index.php?/cases/view/351710), [C351711](https://shopview.testrail.io/index.php?/cases/view/351711), [C351712](https://shopview.testrail.io/index.php?/cases/view/351712), [C351713](https://shopview.testrail.io/index.php?/cases/view/351713), [C351715](https://shopview.testrail.io/index.php?/cases/view/351715), [C351718](https://shopview.testrail.io/index.php?/cases/view/351718), [C351719](https://shopview.testrail.io/index.php?/cases/view/351719), [C351720](https://shopview.testrail.io/index.php?/cases/view/351720), [C351721](https://shopview.testrail.io/index.php?/cases/view/351721), [C351722](https://shopview.testrail.io/index.php?/cases/view/351722), [C351724](https://shopview.testrail.io/index.php?/cases/view/351724), [C351725](https://shopview.testrail.io/index.php?/cases/view/351725), [C351726](https://shopview.testrail.io/index.php?/cases/view/351726), [C351727](https://shopview.testrail.io/index.php?/cases/view/351727), [C351728](https://shopview.testrail.io/index.php?/cases/view/351728), [C351730](https://shopview.testrail.io/index.php?/cases/view/351730), [C351731](https://shopview.testrail.io/index.php?/cases/view/351731), [C351732](https://shopview.testrail.io/index.php?/cases/view/351732), [C351733](https://shopview.testrail.io/index.php?/cases/view/351733), [C351735](https://shopview.testrail.io/index.php?/cases/view/351735), [C351736](https://shopview.testrail.io/index.php?/cases/view/351736), [C351737](https://shopview.testrail.io/index.php?/cases/view/351737), [C351738](https://shopview.testrail.io/index.php?/cases/view/351738), [C351739](https://shopview.testrail.io/index.php?/cases/view/351739)

(The 15 A/B cases also carry C; their quotes are rewritten as part of the update.)

## 4 · D — cases that cite a design board the PO has changed or removed

Changed boards (text or screenshot, 14 Oct reshoot from SV-490 at 39fb049): 01_Opens_After, 02_Last12_After, 03_Range_After, 04_Revenue_After, 04_Revenue_Hover, 05/06/07_*_After, 05/06/07_*_Legend, 08_Customers_After, 09_AtRisk_After, 09_AtRisk_Window, 11/12/13_*_Legend, 14_Phone_After, Main. **Removed: 15_Empty_Design, 15_Empty_Now and before-empty-tiles.png, replaced by 15_Empty_After.** Unchanged: every *_Before board, 05/06/07 _Hover, 08_Customers_New, all 10–13 report boards except the three legends.

### 4a · Cite a REMOVED board (15_Empty_Design / 15_Empty_Now) — Source must be re-pointed to 15_Empty_After — 17

- [C88603](https://shopview.testrail.io/index.php?/cases/view/88603) (us) — cites removed board(s) 15_Empty_Design, 15_Empty_Now (now 15_Empty_After).
- [C88606](https://shopview.testrail.io/index.php?/cases/view/88606) (us) — cites removed board(s) 15_Empty_Design (now 15_Empty_After). D: cites changed board(s) 03_Range_After, 04_Revenue_After.
- [C88607](https://shopview.testrail.io/index.php?/cases/view/88607) (Nebojsa) — cites removed board(s) 15_Empty_Design (now 15_Empty_After).
- [C88611](https://shopview.testrail.io/index.php?/cases/view/88611) (Nebojsa) — cites removed board(s) 15_Empty_Design (now 15_Empty_After).
- [C88636](https://shopview.testrail.io/index.php?/cases/view/88636) (us) — cites removed board(s) 15_Empty_Design (now 15_Empty_After). D: cites changed board(s) 02_Last12_After.
- [C88640](https://shopview.testrail.io/index.php?/cases/view/88640) (us) — cites removed board(s) 15_Empty_Design (now 15_Empty_After). D: cites changed board(s) 06_TechEff_After.
- [C88646](https://shopview.testrail.io/index.php?/cases/view/88646) (us) — cites removed board(s) 15_Empty_Design, 15_Empty_Now (now 15_Empty_After).
- [C88647](https://shopview.testrail.io/index.php?/cases/view/88647) (us) — cites removed board(s) 15_Empty_Design (now 15_Empty_After). D: cites changed board(s) 03_Range_After.
- [C351706](https://shopview.testrail.io/index.php?/cases/view/351706) (Nebojsa) — cites removed board(s) 15_Empty_Design, 15_Empty_Now (now 15_Empty_After).
- [C351707](https://shopview.testrail.io/index.php?/cases/view/351707) (Nebojsa) — cites removed board(s) 15_Empty_Design (now 15_Empty_After).
- [C351708](https://shopview.testrail.io/index.php?/cases/view/351708) (Nebojsa) — cites removed board(s) 15_Empty_Design, 15_Empty_Now (now 15_Empty_After). D: cites changed board(s) 04_Revenue_After.
- [C351709](https://shopview.testrail.io/index.php?/cases/view/351709) (Nebojsa) — cites removed board(s) 15_Empty_Design (now 15_Empty_After).
- [C351710](https://shopview.testrail.io/index.php?/cases/view/351710) (Nebojsa) — cites removed board(s) 15_Empty_Design (now 15_Empty_After).
- [C351711](https://shopview.testrail.io/index.php?/cases/view/351711) (us) — cites removed board(s) 15_Empty_Design (now 15_Empty_After).
- [C351713](https://shopview.testrail.io/index.php?/cases/view/351713) (us) — cites removed board(s) 15_Empty_Design (now 15_Empty_After).
- [C351714](https://shopview.testrail.io/index.php?/cases/view/351714) (Nebojsa) — cites removed board(s) 15_Empty_Design, 15_Empty_Now (now 15_Empty_After).
- [C351715](https://shopview.testrail.io/index.php?/cases/view/351715) (Nebojsa) — cites removed board(s) 15_Empty_Design (now 15_Empty_After).

### 4b · Cite a CHANGED board only — re-check labels/examples against the new board — 56

- [C88594](https://shopview.testrail.io/index.php?/cases/view/88594) (us) — cites changed board(s) 01_Opens_After.
- [C88595](https://shopview.testrail.io/index.php?/cases/view/88595) (us) — cites changed board(s) 01_Opens_After.
- [C88597](https://shopview.testrail.io/index.php?/cases/view/88597) (us) — cites changed board(s) 14_Phone_After.
- [C88599](https://shopview.testrail.io/index.php?/cases/view/88599) (us) — cites changed board(s) 01_Opens_After.
- [C88602](https://shopview.testrail.io/index.php?/cases/view/88602) (us) — cites changed board(s) 05_Billing_After, 06_TechEff_After, 07_TechUtil_After.
- [C88604](https://shopview.testrail.io/index.php?/cases/view/88604) (Nebojsa) — cites changed board(s) 01_Opens_After, 02_Last12_After.
- [C88605](https://shopview.testrail.io/index.php?/cases/view/88605) (Nebojsa) — cites changed board(s) 01_Opens_After.
- [C88608](https://shopview.testrail.io/index.php?/cases/view/88608) (Nebojsa) — cites changed board(s) 01_Opens_After, 08_Customers_After.
- [C88609](https://shopview.testrail.io/index.php?/cases/view/88609) (us) — cites changed board(s) 09_AtRisk_After, 09_AtRisk_Window.
- [C88610](https://shopview.testrail.io/index.php?/cases/view/88610) (Nebojsa) — cites changed board(s) 09_AtRisk_After, 09_AtRisk_Window.
- [C88612](https://shopview.testrail.io/index.php?/cases/view/88612) (us) — cites changed board(s) 04_Revenue_After, 05_Billing_After, 06_TechEff_After, 07_TechUtil_After, 08_Customers_After.
- [C88613](https://shopview.testrail.io/index.php?/cases/view/88613) (Nebojsa) — cites changed board(s) 09_AtRisk_After.
- [C88614](https://shopview.testrail.io/index.php?/cases/view/88614) (Nebojsa) — cites changed board(s) 04_Revenue_After, 05_Billing_After, 06_TechEff_After, 07_TechUtil_After, 08_Customers_After, 09_AtRisk_After.
- [C88616](https://shopview.testrail.io/index.php?/cases/view/88616) (Nebojsa) — cites changed board(s) 14_Phone_After.
- [C88617](https://shopview.testrail.io/index.php?/cases/view/88617) (us) — cites changed board(s) 01_Opens_After, 03_Range_After, 05_Billing_After.
- [C88618](https://shopview.testrail.io/index.php?/cases/view/88618) (Nebojsa) — cites changed board(s) 01_Opens_After, 03_Range_After.
- [C88619](https://shopview.testrail.io/index.php?/cases/view/88619) (Nebojsa) — cites changed board(s) 06_TechEff_After, 07_TechUtil_After.
- [C88620](https://shopview.testrail.io/index.php?/cases/view/88620) (Nebojsa) — cites changed board(s) 06_TechEff_After.
- [C88621](https://shopview.testrail.io/index.php?/cases/view/88621) (us) — cites changed board(s) 05_Billing_After.
- [C88622](https://shopview.testrail.io/index.php?/cases/view/88622) (us) — cites changed board(s) 05_Billing_After.
- [C88623](https://shopview.testrail.io/index.php?/cases/view/88623) (us) — cites changed board(s) 02_Last12_After, 09_AtRisk_After.
- [C88626](https://shopview.testrail.io/index.php?/cases/view/88626) (us) — cites changed board(s) 01_Opens_After.
- [C88627](https://shopview.testrail.io/index.php?/cases/view/88627) (Nebojsa) — cites changed board(s) 05_Billing_After, 06_TechEff_After, 07_TechUtil_After.
- [C88628](https://shopview.testrail.io/index.php?/cases/view/88628) (Nebojsa) — cites changed board(s) 08_Customers_After, 09_AtRisk_After.
- [C88629](https://shopview.testrail.io/index.php?/cases/view/88629) (us) — cites changed board(s) 01_Opens_After, 02_Last12_After, 03_Range_After, 09_AtRisk_Window.
- [C88633](https://shopview.testrail.io/index.php?/cases/view/88633) (us) — cites changed board(s) 02_Last12_After, 03_Range_After.
- [C88634](https://shopview.testrail.io/index.php?/cases/view/88634) (us) — cites changed board(s) 02_Last12_After.
- [C88637](https://shopview.testrail.io/index.php?/cases/view/88637) (us) — cites changed board(s) 02_Last12_After, 05_Billing_After.
- [C88638](https://shopview.testrail.io/index.php?/cases/view/88638) (us) — cites changed board(s) 05_Billing_After.
- [C88639](https://shopview.testrail.io/index.php?/cases/view/88639) (us) — cites changed board(s) 06_TechEff_After.
- [C88641](https://shopview.testrail.io/index.php?/cases/view/88641) (us) — cites changed board(s) 07_TechUtil_After.
- [C88642](https://shopview.testrail.io/index.php?/cases/view/88642) (us) — cites changed board(s) 08_Customers_After.
- [C88643](https://shopview.testrail.io/index.php?/cases/view/88643) (us) — cites changed board(s) 09_AtRisk_After, 09_AtRisk_Window.
- [C88644](https://shopview.testrail.io/index.php?/cases/view/88644) (us) — cites changed board(s) 09_AtRisk_After, 09_AtRisk_Window.
- [C88645](https://shopview.testrail.io/index.php?/cases/view/88645) (us) — cites changed board(s) 01_Opens_After, 09_AtRisk_After.
- [C88648](https://shopview.testrail.io/index.php?/cases/view/88648) (us) — cites changed board(s) 02_Last12_After, 03_Range_After.
- [C88650](https://shopview.testrail.io/index.php?/cases/view/88650) (us) — cites changed board(s) 04_Revenue_After, 05_Billing_After, 06_TechEff_After, 07_TechUtil_After.
- [C88651](https://shopview.testrail.io/index.php?/cases/view/88651) (us) — cites changed board(s) 01_Opens_After.
- [C88652](https://shopview.testrail.io/index.php?/cases/view/88652) (us) — cites changed board(s) 02_Last12_After.
- [C204097](https://shopview.testrail.io/index.php?/cases/view/204097) (us) — cites changed board(s) 04_Revenue_After, 06_TechEff_After.
- [C351716](https://shopview.testrail.io/index.php?/cases/view/351716) (us) — cites changed board(s) 01_Opens_After.
- [C351717](https://shopview.testrail.io/index.php?/cases/view/351717) (Nebojsa) — cites changed board(s) 05_Billing_After.
- [C351718](https://shopview.testrail.io/index.php?/cases/view/351718) (Nebojsa) — cites changed board(s) 05_Billing_After, 06_TechEff_After.
- [C351719](https://shopview.testrail.io/index.php?/cases/view/351719) (us) — cites changed board(s) 07_TechUtil_After.
- [C351720](https://shopview.testrail.io/index.php?/cases/view/351720) (us) — cites changed board(s) 06_TechEff_After.
- [C351722](https://shopview.testrail.io/index.php?/cases/view/351722) (us) — cites changed board(s) 06_TechEff_After, 07_TechUtil_After.
- [C351723](https://shopview.testrail.io/index.php?/cases/view/351723) (us) — cites changed board(s) 05_Billing_Legend, 06_TechEff_Legend, 07_TechUtil_Legend.
- [C351724](https://shopview.testrail.io/index.php?/cases/view/351724) (us) — cites changed board(s) 04_Revenue_Hover.
- [C351726](https://shopview.testrail.io/index.php?/cases/view/351726) (us) — cites changed board(s) 03_Range_After.
- [C351728](https://shopview.testrail.io/index.php?/cases/view/351728) (us) — cites changed board(s) 03_Range_After.
- [C351729](https://shopview.testrail.io/index.php?/cases/view/351729) (us) — cites changed board(s) 03_Range_After.
- [C351734](https://shopview.testrail.io/index.php?/cases/view/351734) (us) — cites changed board(s) 11_saa_Legend, 12_te_Legend, 13_tu_Legend.
- [C351736](https://shopview.testrail.io/index.php?/cases/view/351736) (us) — cites changed board(s) 01_Opens_After.
- [C351737](https://shopview.testrail.io/index.php?/cases/view/351737) (us) — cites changed board(s) 01_Opens_After.
- [C351738](https://shopview.testrail.io/index.php?/cases/view/351738) (Nebojsa) — cites changed board(s) 14_Phone_After.
- [C351739](https://shopview.testrail.io/index.php?/cases/view/351739) (Nebojsa) — cites changed board(s) 04_Revenue_After, 06_TechEff_After.

What the new boards now say that matters to cases: 09_AtRisk_After "has no inactivity control of its own (S5-N3)" (backs the C88628 update); the 05/06/07 and 11/12/13 Legend captions now say the " · avg" figure "is removed by S9-R10 (build change pending)" (backs C351723/C351734); 02_Last12_After's caption now measures At Risk revenue "the way the Revenue tile and the Sales report do" (S5-R15; the old "like Sales By Customer" caption was the drift); Main now says "every report arrow kept" for row 15 (PO answer 7); 04_Revenue_Hover's example changed from $2,030,953 to $180,891 (C351724's "e.g." figure is now just an old example). Expected results must still come from the PRD, not the boards (Rule 57).

## 5 · OK — nothing to change — 9

- [C137997](https://shopview.testrail.io/index.php?/cases/view/137997) (Vladimir, Yes (automated)) — Already expects "No data for selected date range" on the report chart, now S11-E2 (v45).
- [C137998](https://shopview.testrail.io/index.php?/cases/view/137998) (Vladimir, Yes (automated)) — S1-R3 unchanged.
- [C137999](https://shopview.testrail.io/index.php?/cases/view/137999) (Vladimir, Yes (automated)) — S1-N1/R7/R8 unchanged.
- [C327128](https://shopview.testrail.io/index.php?/cases/view/327128) (Vladimir, Yes (automated)) — S10-R5/R7 unchanged.
- [C433976](https://shopview.testrail.io/index.php?/cases/view/433976) (Vladimir, Yes (automated)) — 1536x730 chart/table heights; consistent with S12-R7 (1536x864) and S11-E2.
- [C499827](https://shopview.testrail.io/index.php?/cases/view/499827) (Vladimir, Yes (automated)) — Already expects the table to follow the filter and to hide with the chart (S8-R5a/S8-N1a).
- [C540783](https://shopview.testrail.io/index.php?/cases/view/540783) (Vladimir, Yes (automated)) — Matches S6-R8a. Watch: step 2 changes the window after the panel opens - it must use the tile pill (S5-N3); an automation that uses a panel "Inactive for" box will break.
- [C557284](https://shopview.testrail.io/index.php?/cases/view/557284) (Vladimir, Yes (automated)) — Matches S12-R13 and Today inside the calendar (S7-R2a).
- [C573667](https://shopview.testrail.io/index.php?/cases/view/573667) (Vladimir, Yes (automated)) — Sales report customer filter and chart parity; not touched by the changes.

Vladimir's nine cases carry no Source or quote block, so C and D do not apply to them.

## 6 · Observations (no verdict letter)

- **Report-page chart bucketing is unspecified.** S6-R3a sets day/week/month/quarter bars for the *expanded* Revenue chart only. C88624 ("monthly revenue bars"), C351732 ("this month's point/bar" on This month) and C351735 assume monthly bars on the report pages. Jira (the Revenue-chart daily/monthly ticket in `jira-2026-10-14.md`) says the Sales report showed monthly bars on Last 12 months. Worth one PO question: does the report-page chart follow the same rule as S6-R3a?
- **Ten cases' Setup says "the dashboard remembers your choices" for date pills** (C88604, C88606, C88607, C88612, C88614, C88616, C88617, C88623, C88627, C88628) — contradicts S7-R8 (unchanged since v42). Harmless to the run but wrong; fix while updating.
- **Setup Google Docs were not read** (outside the inputs given). The PRD moved its test-site links from sv8311 to sv490; no case body names sv8311 as a site ("SV-8311 build" appears only as the provenance of design screenshots, in 39 cases), but the per-case setup docs should be grepped for sv8311 before release.
- **A V1-style apply is in progress in `currency-2026-10-14/apply/`** (commit 76132b8 "Dashboard: apply/audit work in progress", 24 setup docs incl. new C5818xx–C5819xx). This audit covers only the 106 snapshotted cases and did not touch that work.
- The quarter bucket (S4-R11, S6-R3a) cannot be reached from a tile any more (custom ranges stop at 366 days); spec tidy-up only.
- C88620 and several cases quote the same sentence two to four times (e.g. S8-N1 ×3, S11-R2a ×4) — a formatting defect worth fixing during the refresh.

## 7 · Reading coverage

- **106 of 106 cases read in full**: every case's preconditions, steps (or separated steps with their expected), and expected results, converted to plain text by script (356,548 characters) and read line by line in 15 consecutive batches; no sampling. Verdicts were judged per case against the spec text, then cross-checked by keyword search across all 106 (level/flat/rise/height, gap/dashed/no data, avg, Inactive for, Last updated, custom/366/731, scroll/phone, dark, table-under-chart, Revenue (12 Mo)).
- **PRD v46** (`CONFLUENCE-788430850-v46-2026-10-14b.md`, 552 lines, 54,253 bytes): read in full. **PRD v48** fetched live and diffed against v46 line by line by script (100% of lines compared; differences read). PRD v42: not re-read in full; compared through the two code-level diffs (v42→v44, v44→v46) and by script (every case quote checked against both v42 and v48).
- Read in full: `PRD-DIFF-v42-vs-now.md`, `PRD-DIFF-v44-vs-now.md`, `RELEASE-NOTES-DASHBOARD-2026-10-14b.md`, `PO-ANSWERS-CHRIS-WARD-2026-10-14.md`, PO answer 16 (coordinator, verbatim), the PO's Slack summary (in the brief), `FOLLOWUP-2026-10-14.md` §4 (4a, 4b) and §7–§9, the 4 "update" rows of `notify/sheet-data.json` and the 8 "update" rows of `answers-followup/followup-rows.json`, Skill 22 and the Token-Discipline Charter.
- Searched, not read whole: `jira-2026-10-14.md` (156 KB; grep for chart bucketing). Design canvas: all files of both extracts hashed and compared; the text of every changed board diffed by script; not driven (a separate worker runs the design gates).

## OUTSTANDING — what I need from you

1. Decide whether the three minor-A cases (C88610, C88645, C351716) join the update list (my recommendation: yes — each asks the tester to judge the trend line's level, which S4-R11b now rules out).
2. Decide whether the provenance refresh (C, all 97 of our cases) and board re-pointing (D, 73 cases; 17 cite the removed row-15 boards) is done now or recorded as known staleness — under Rule 113 the quotes must match the current source.
3. Optional PO question: do report-page charts bucket by range length like S6-R3a? (affects C88624, C351732, C351735).
