# Filters — RESUME (finish2), 2026-08-12

## STATE IN ONE LINE

**115 ours / 120 live. Build `v3.6-3e9dd6d`, unmoved. 10 `update_case`, every one byte-verified
(30 fields each, 0 mismatches, 0 collateral). 0 add / 0 delete / 0 run writes / 0 results / 0 Jira.
12 cases fully walked this pass; 22 across all Filters passes. The tester has already graded 84 of
120 tests himself.**

Read **`COMPLETION-REPORT.md`** first — it is the Rule-67 table. Then `FINDINGS.md` §1 (the one
thing that needs the QA lead), then `RUNNABILITY.md`, then `DIVERGENCES.md`.

## THE ONE THING TO ACT ON

**[C29603](https://shopview.testrail.io/index.php?/cases/view/29603) PASSES as written and is marked
FAILED.** Driven end to end today: collapsed survives a return, expanded survives a return, and the
saved preference carries `"collapsed": false`. The tester's own comment says the fault is on
**Parts/Reports** pages — ground this case never covers, **and no Filters case covers it**. So
SV-8905 may be a real defect standing on the wrong evidence, and there is a genuine coverage gap
behind it.

## WHAT THE NEXT PASS SHOULD DO, IN ORDER

1. **File the C38897 ticket the moment the creation hold lifts.** Still the only unticketed real
   deviation. Evidence and the rule-out are in the previous pass's `evidence/empty-state.json`.
2. **Re-run the two checks that failed as checks** — C38876 (last-used tab) and C43560 (last save
   wins). Neither status pick registered; the guard reported `check_could_fail: false`. **Use
   `pickStatus()` from `tools/probe_retry.cjs` but assert `updatedAt` moved before believing
   anything.**
3. **Finish the three part-walked cases** — C29614 steps 3–6, C29625 steps 1/2/4, C43563 steps 6–7.
4. **Then breadth**: 93 cases have not had their steps walked by us, though most have been executed
   by the tester.
5. **Only then consider re-stamping.** 83 cases still name `v3.4.2-d00239b`, and that is **correct**
   until someone actually walks them. An honest stale stamp beats an asserted check nobody made.

## THE HARNESS WORKS — DO NOT REDERIVE IT

`tools/harness.cjs` (from the previous pass, repointed at this evidence dir) plus
`probe_fails.cjs`, `probe_fails2.cjs`, `probe_fails3.cjs`, `probe_desk.cjs`, `probe_desk2.cjs`,
`probe_mob.cjs`, `probe_c29625.cjs`, `probe_last.cjs`, `probe_retry.cjs`, and `restamp.py`.
**0 bridge errors on every run today.**

## 🔴 THE SELECTOR THAT COST THREE ATTEMPTS ACROSS TWO PASSES

**Status / customer / any filter options are `DIV[data-test-id^="filter_option_"]`** —
`filter_option_status_imported`, `filter_option_company_id_<uuid>`, and so on.
**They are NOT `label` and NOT `.q-item`.** Both wrong selectors match nothing, so the check
**reports "no options" and CANNOT FAIL**. Found by dumping the menu's DOM (`/tmp/menudump.cjs`
pattern) rather than guessing a fourth selector. **Belongs in `APP-ACTIONS-PLAYBOOK.md` §J.**

## TRAPS THIS PASS PAID FOR — DO NOT PAY AGAIN

1. **A filter applied BY URL is not saved; applied BY THE CHIP it is.** Reading persistence off a
   URL-applied filter produces a false failure — it nearly corroborated a defect that does not exist
   on the tester's path.
2. **Do not blur by clicking the page.** A click at (700,400) on Work Orders opens a work order; the
   probe then read `null` four times and established nothing.
3. **`.q-dialog` is the full-screen wrapper, not the sheet card.** Measure against
   `.mobile-all-filters-sheet`, or you enumerate the backdrop and "find" no drag handle.
4. **Quasar's focus-helper carries hover as well as focus** — `0.15` appears in both states once the
   pointer rests on the button, so it distinguishes nothing on its own.
5. **Collapsed accordions stay MOUNTED in the phone sheet.** A card-wide
   `[data-test-id^="filter_option_"]` sweep picks up the Status options while you think you are
   reading Customers. Scope the reader to the section element.
6. **Selection in the customer list is a CHECK GLYPH, not a Quasar checkbox** — a
   `.q-checkbox__inner--truthy` detector returns false for every row, so "pick the first unchecked
   one" re-clicks the one you just selected.
7. **`tbody tr` counts 0 on the phone** (cards) and is page-capped at 30 on desktop — never read it
   as "no results" or as proof a list grew.
8. **Filter state persists per user and bleeds between probe blocks.** One block's search was still
   live in the next; clear it, or read the URL rather than the row count.

## SESSIONS

`/tmp/qa-cookies/filters-{admin,tech}.txt`, `chmod 600`, **never in the repository**. `/tmp` does not
survive a container restart — rewrite them from the brief. Both identities proven distinct this
session: **42 permissions / `full` / staff 200** against **6 / `tech` / 403**.

## WHAT ANOTHER ACTOR IS DOING RIGHT NOW

**The tester (user 7) is grading run 352 live.** It moved 636 → 639 results during this session:
C38893 Passed, C38891 Blocked, C38889 Failed. **Prove the run untouched BY CONTENT, never by
counts** — the counts change under you legitimately.
