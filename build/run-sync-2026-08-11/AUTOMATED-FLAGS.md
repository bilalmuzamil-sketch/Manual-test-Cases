# AUTOMATED FLAGS (`custom_atmstatus`) — census 2026-08-12

**QA lead, verbatim:** *"Make sure that we do not add any 'Automated marker' and remove if
we did. however if Vlad has added that 'Automated' marker, then dont touch that."*

## THE ANSWER: nothing needed clearing, and nothing was written.

**44 of our cases across the three active projects read `custom_atmstatus = 3` ("Automated").
`get_history_for_case` on all 44 shows EVERY ONE was set by Vladimir Tomovic (user 1).
Not one is our `add_case` default. So under his instruction — *"if Vlad has added that
'Automated' marker, then dont touch that"* — every one is left exactly alone.**

`custom_atmstatus`: `1` Not Automated · `2` Cannot be automated · `3` Automated · `4` Pending.

| Project | Ours at `3` | Set by Vlad | No history (ours) | Ambiguous | Cleared |
|---|---|---|---|---|---|
| Filters | 4 | 4 | 0 | 0 | **0** |
| Schedule | 0 | 0 | 0 | 0 | **0** |
| Report Suite | 40 | 40 | 0 | 0 | **0** |
| **Total** | **44** | **44** | **0** | **0** | **0** |

Schedule reads **0** because its 31 were corrected `3 → 1` on 2026-08-11; TestRail's history
confirms that correction was ours (user 3, 2026-08-11 09:39Z) — e.g. C43554, C43555, C38863,
C30615 all show `user 3 … 3->1`. All 176 Schedule cases now read `1`.

## Per case

| C-id | Link | Project | Value | Who set it | Action | Evidence (from `get_history_for_case`) |
|---|---|---|---|---|---|---|
| C29600 | [view](https://shopview.testrail.io/index.php?/cases/view/29600) | Filters | 3 | Vladimir Tomovic (user 1) | **LEAVE ALONE** | `user 1 @ 2026-08-06 11:30Z 1->3; user 1 @ 2026-08-07 07:30Z 3->1; user 1 @ 2026-08-08 11:12Z 1->3` |
| C29614 | [view](https://shopview.testrail.io/index.php?/cases/view/29614) | Filters | 3 | Vladimir Tomovic (user 1) | **LEAVE ALONE** | `user 1 @ 2026-08-06 11:30Z 1->3` |
| C29623 | [view](https://shopview.testrail.io/index.php?/cases/view/29623) | Filters | 3 | Vladimir Tomovic (user 1) | **LEAVE ALONE** | `user 1 @ 2026-08-07 07:30Z 1->3` |
| C38877 | [view](https://shopview.testrail.io/index.php?/cases/view/38877) | Filters | 3 | Vladimir Tomovic (user 1) | **LEAVE ALONE** | `user 1 @ 2026-08-05 13:08Z 3->1; user 1 @ 2026-08-06 11:30Z 1->3` |
| C30107 | [view](https://shopview.testrail.io/index.php?/cases/view/30107) | Report Suite | 3 | Vladimir Tomovic (user 1) | **LEAVE ALONE** | `user 1 @ 2026-08-10 12:48Z 1->3` |
| C30114 | [view](https://shopview.testrail.io/index.php?/cases/view/30114) | Report Suite | 3 | Vladimir Tomovic (user 1) | **LEAVE ALONE** | `user 1 @ 2026-08-10 12:48Z 1->3` |
| C30121 | [view](https://shopview.testrail.io/index.php?/cases/view/30121) | Report Suite | 3 | Vladimir Tomovic (user 1) | **LEAVE ALONE** | `user 1 @ 2026-08-10 12:48Z 1->3` |
| C30123 | [view](https://shopview.testrail.io/index.php?/cases/view/30123) | Report Suite | 3 | Vladimir Tomovic (user 1) | **LEAVE ALONE** | `user 1 @ 2026-08-10 12:48Z 1->3` |
| C30138 | [view](https://shopview.testrail.io/index.php?/cases/view/30138) | Report Suite | 3 | Vladimir Tomovic (user 1) | **LEAVE ALONE** | `user 1 @ 2026-08-10 12:48Z 1->3` |
| C30217 | [view](https://shopview.testrail.io/index.php?/cases/view/30217) | Report Suite | 3 | Vladimir Tomovic (user 1) | **LEAVE ALONE** | `user 1 @ 2026-08-10 12:48Z 1->3` |
| C30221 | [view](https://shopview.testrail.io/index.php?/cases/view/30221) | Report Suite | 3 | Vladimir Tomovic (user 1) | **LEAVE ALONE** | `user 1 @ 2026-08-10 12:48Z 1->3` |
| C30262 | [view](https://shopview.testrail.io/index.php?/cases/view/30262) | Report Suite | 3 | Vladimir Tomovic (user 1) | **LEAVE ALONE** | `user 1 @ 2026-08-10 12:48Z 1->3` |
| C30314 | [view](https://shopview.testrail.io/index.php?/cases/view/30314) | Report Suite | 3 | Vladimir Tomovic (user 1) | **LEAVE ALONE** | `user 1 @ 2026-08-10 12:48Z 1->3` |
| C30326 | [view](https://shopview.testrail.io/index.php?/cases/view/30326) | Report Suite | 3 | Vladimir Tomovic (user 1) | **LEAVE ALONE** | `user 1 @ 2026-08-10 12:48Z 1->3` |
| C30328 | [view](https://shopview.testrail.io/index.php?/cases/view/30328) | Report Suite | 3 | Vladimir Tomovic (user 1) | **LEAVE ALONE** | `user 1 @ 2026-08-10 12:48Z 1->3` |
| C30333 | [view](https://shopview.testrail.io/index.php?/cases/view/30333) | Report Suite | 3 | Vladimir Tomovic (user 1) | **LEAVE ALONE** | `user 1 @ 2026-08-10 12:48Z 1->3` |
| C30338 | [view](https://shopview.testrail.io/index.php?/cases/view/30338) | Report Suite | 3 | Vladimir Tomovic (user 1) | **LEAVE ALONE** | `user 1 @ 2026-08-10 12:48Z 1->3` |
| C30346 | [view](https://shopview.testrail.io/index.php?/cases/view/30346) | Report Suite | 3 | Vladimir Tomovic (user 1) | **LEAVE ALONE** | `user 1 @ 2026-08-10 12:48Z 1->3` |
| C30352 | [view](https://shopview.testrail.io/index.php?/cases/view/30352) | Report Suite | 3 | Vladimir Tomovic (user 1) | **LEAVE ALONE** | `user 1 @ 2026-08-10 12:48Z 1->3` |
| C30353 | [view](https://shopview.testrail.io/index.php?/cases/view/30353) | Report Suite | 3 | Vladimir Tomovic (user 1) | **LEAVE ALONE** | `user 1 @ 2026-08-10 12:48Z 1->3` |
| C30390 | [view](https://shopview.testrail.io/index.php?/cases/view/30390) | Report Suite | 3 | Vladimir Tomovic (user 1) | **LEAVE ALONE** | `user 1 @ 2026-08-10 12:48Z 1->3` |
| C30398 | [view](https://shopview.testrail.io/index.php?/cases/view/30398) | Report Suite | 3 | Vladimir Tomovic (user 1) | **LEAVE ALONE** | `user 1 @ 2026-08-10 12:49Z 1->3` |
| C30399 | [view](https://shopview.testrail.io/index.php?/cases/view/30399) | Report Suite | 3 | Vladimir Tomovic (user 1) | **LEAVE ALONE** | `user 1 @ 2026-08-10 12:49Z 1->3` |
| C30401 | [view](https://shopview.testrail.io/index.php?/cases/view/30401) | Report Suite | 3 | Vladimir Tomovic (user 1) | **LEAVE ALONE** | `user 1 @ 2026-08-10 12:48Z 1->3` |
| C30404 | [view](https://shopview.testrail.io/index.php?/cases/view/30404) | Report Suite | 3 | Vladimir Tomovic (user 1) | **LEAVE ALONE** | `user 1 @ 2026-08-10 12:48Z 1->3` |
| C30410 | [view](https://shopview.testrail.io/index.php?/cases/view/30410) | Report Suite | 3 | Vladimir Tomovic (user 1) | **LEAVE ALONE** | `user 1 @ 2026-08-10 12:48Z 1->3` |
| C30424 | [view](https://shopview.testrail.io/index.php?/cases/view/30424) | Report Suite | 3 | Vladimir Tomovic (user 1) | **LEAVE ALONE** | `user 1 @ 2026-08-10 12:48Z 1->3` |
| C30429 | [view](https://shopview.testrail.io/index.php?/cases/view/30429) | Report Suite | 3 | Vladimir Tomovic (user 1) | **LEAVE ALONE** | `user 1 @ 2026-08-10 12:48Z 1->3` |
| C30449 | [view](https://shopview.testrail.io/index.php?/cases/view/30449) | Report Suite | 3 | Vladimir Tomovic (user 1) | **LEAVE ALONE** | `user 1 @ 2026-08-10 12:48Z 1->3` |
| C30452 | [view](https://shopview.testrail.io/index.php?/cases/view/30452) | Report Suite | 3 | Vladimir Tomovic (user 1) | **LEAVE ALONE** | `user 1 @ 2026-08-10 12:49Z 1->3` |
| C30460 | [view](https://shopview.testrail.io/index.php?/cases/view/30460) | Report Suite | 3 | Vladimir Tomovic (user 1) | **LEAVE ALONE** | `user 1 @ 2026-08-10 12:49Z 1->3` |
| C30462 | [view](https://shopview.testrail.io/index.php?/cases/view/30462) | Report Suite | 3 | Vladimir Tomovic (user 1) | **LEAVE ALONE** | `user 1 @ 2026-08-10 12:49Z 1->3` |
| C30488 | [view](https://shopview.testrail.io/index.php?/cases/view/30488) | Report Suite | 3 | Vladimir Tomovic (user 1) | **LEAVE ALONE** | `user 1 @ 2026-08-10 12:49Z 1->3` |
| C30498 | [view](https://shopview.testrail.io/index.php?/cases/view/30498) | Report Suite | 3 | Vladimir Tomovic (user 1) | **LEAVE ALONE** | `user 1 @ 2026-08-10 12:49Z 1->3` |
| C30508 | [view](https://shopview.testrail.io/index.php?/cases/view/30508) | Report Suite | 3 | Vladimir Tomovic (user 1) | **LEAVE ALONE** | `user 1 @ 2026-08-10 12:49Z 1->3` |
| C30510 | [view](https://shopview.testrail.io/index.php?/cases/view/30510) | Report Suite | 3 | Vladimir Tomovic (user 1) | **LEAVE ALONE** | `user 1 @ 2026-08-10 12:49Z 1->3` |
| C30515 | [view](https://shopview.testrail.io/index.php?/cases/view/30515) | Report Suite | 3 | Vladimir Tomovic (user 1) | **LEAVE ALONE** | `user 1 @ 2026-08-10 12:49Z 1->3` |
| C30518 | [view](https://shopview.testrail.io/index.php?/cases/view/30518) | Report Suite | 3 | Vladimir Tomovic (user 1) | **LEAVE ALONE** | `user 1 @ 2026-08-10 12:49Z 1->3` |
| C30527 | [view](https://shopview.testrail.io/index.php?/cases/view/30527) | Report Suite | 3 | Vladimir Tomovic (user 1) | **LEAVE ALONE** | `user 1 @ 2026-08-10 12:49Z 1->3` |
| C30535 | [view](https://shopview.testrail.io/index.php?/cases/view/30535) | Report Suite | 3 | Vladimir Tomovic (user 1) | **LEAVE ALONE** | `user 1 @ 2026-08-10 12:48Z 1->3` |
| C30557 | [view](https://shopview.testrail.io/index.php?/cases/view/30557) | Report Suite | 3 | Vladimir Tomovic (user 1) | **LEAVE ALONE** | `user 1 @ 2026-08-10 12:48Z 1->3` |
| C30563 | [view](https://shopview.testrail.io/index.php?/cases/view/30563) | Report Suite | 3 | Vladimir Tomovic (user 1) | **LEAVE ALONE** | `user 1 @ 2026-08-10 12:48Z 1->3` |
| C30569 | [view](https://shopview.testrail.io/index.php?/cases/view/30569) | Report Suite | 3 | Vladimir Tomovic (user 1) | **LEAVE ALONE** | `user 1 @ 2026-08-10 12:48Z 1->3` |
| C30583 | [view](https://shopview.testrail.io/index.php?/cases/view/30583) | Report Suite | 3 | Vladimir Tomovic (user 1) | **LEAVE ALONE** | `user 1 @ 2026-08-10 12:48Z 1->3` |
| C38919 | [view](https://shopview.testrail.io/index.php?/cases/view/38919) | Report Suite | 3 | Vladimir Tomovic (his own case) | **HANDS OFF** (Rule 38) | foreign case, `created_by=1` — history never read, case never touched |
| C38920 | [view](https://shopview.testrail.io/index.php?/cases/view/38920) | Report Suite | 3 | Vladimir Tomovic (his own case) | **HANDS OFF** (Rule 38) | foreign case, `created_by=1` — history never read, case never touched |
| C38921 | [view](https://shopview.testrail.io/index.php?/cases/view/38921) | Report Suite | 3 | Vladimir Tomovic (his own case) | **HANDS OFF** (Rule 38) | foreign case, `created_by=1` — history never read, case never touched |
| C38922 | [view](https://shopview.testrail.io/index.php?/cases/view/38922) | Report Suite | 3 | Vladimir Tomovic (his own case) | **HANDS OFF** (Rule 38) | foreign case, `created_by=1` — history never read, case never touched |
| C38923 | [view](https://shopview.testrail.io/index.php?/cases/view/38923) | Report Suite | 3 | Vladimir Tomovic (his own case) | **HANDS OFF** (Rule 38) | foreign case, `created_by=1` — history never read, case never touched |
| C43567 | [view](https://shopview.testrail.io/index.php?/cases/view/43567) | Report Suite | 3 | Vladimir Tomovic (his own case) | **HANDS OFF** (Rule 38) | foreign case, `created_by=1` — history never read, case never touched |
| C43568 | [view](https://shopview.testrail.io/index.php?/cases/view/43568) | Report Suite | 3 | Vladimir Tomovic (his own case) | **HANDS OFF** (Rule 38) | foreign case, `created_by=1` — history never read, case never touched |
| C43569 | [view](https://shopview.testrail.io/index.php?/cases/view/43569) | Report Suite | 3 | Vladimir Tomovic (his own case) | **HANDS OFF** (Rule 38) | foreign case, `created_by=1` — history never read, case never touched |
| C43570 | [view](https://shopview.testrail.io/index.php?/cases/view/43570) | Report Suite | 3 | Vladimir Tomovic (his own case) | **HANDS OFF** (Rule 38) | foreign case, `created_by=1` — history never read, case never touched |
| C43571 | [view](https://shopview.testrail.io/index.php?/cases/view/43571) | Report Suite | 3 | Vladimir Tomovic (his own case) | **HANDS OFF** (Rule 38) | foreign case, `created_by=1` — history never read, case never touched |
| C43572 | [view](https://shopview.testrail.io/index.php?/cases/view/43572) | Report Suite | 3 | Vladimir Tomovic (his own case) | **HANDS OFF** (Rule 38) | foreign case, `created_by=1` — history never read, case never touched |
| C43573 | [view](https://shopview.testrail.io/index.php?/cases/view/43573) | Report Suite | 3 | Vladimir Tomovic (his own case) | **HANDS OFF** (Rule 38) | foreign case, `created_by=1` — history never read, case never touched |

## What was NOT done, and why

**Zero `update_case` calls.** The instruction is to clear flags *we* set; we set none that
survive. Clearing a flag Vlad set would be the opposite of what he asked, and would corrupt
the signal Standing Rule 65 keys the whole tell-Vlad duty off.

The flag moves both ways in Vlad's hands — C29600 went `1→3→1→3` and C38877 `3→1→3` — which
is why the census records *who* set it rather than just the current value.

## Rule 65 — "Automated cases changed — for Vlad"

**None.** This pass wrote to no case at all. The three `update_run` calls changed run
membership only; no case title, text, marker, refs or automation status was altered, so
nothing an automated check asserts has moved.

The four cases added to runs (C43588–C43590 on Schedule/Filters, C43591–C43594 on Reports)
all read `custom_atmstatus = 1` and are not automated by anyone.

