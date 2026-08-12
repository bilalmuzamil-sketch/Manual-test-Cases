# Filters — RESUME (finish2), 2026-08-12

## STATE IN ONE LINE

**115 ours / 120 live. Build `v3.6-3e9dd6d`, unmoved (sha256 identical to the 11:04Z read).
0 writes so far. The five plain-READY cases the tester failed today have been walked and
one of them — C29603 — PASSES as written.**

## WHAT IS DONE THIS PASS

- Census, foreign snapshot (C43576–C43580), run 352 PRE — all read-only.
- **C29601, C29603, C29614, C29622, C29628 walked** (the five plain-`READY` cases the tester
  marked FAILED today, each with a fresh ticket).
- C29601 pressed-look question **closed with a proper blur control**; the first attempt clicked
  at (700,400), landed on a work-order row and navigated away, so it established **nothing** and
  is recorded that way.

## WHAT THE NEXT PASS SHOULD DO

1. The **10 control-verified cases that are still Untested** — the tester opens these tomorrow:
   C38877, C38893, C38895, C38896, C38897, C38898, C38900, C38902, C43561, C43563.
2. **C29625** is an `EXPECT FAIL` case the tester marked **PASSED** — Rule 61 outcome 3, the fix
   may have shipped. Verify and report.
3. The 5 attempted-not-walked: C29581, C29588 (need a staff deactivation — **tester work, barred
   for us**), C38876, C38879, C43560.

## HARNESS

`tools/harness.cjs` (copied from the previous pass, repointed at this evidence dir), plus
`probe_fails.cjs`, `probe_fails2.cjs`, `probe_fails3.cjs`. **0 bridge errors on every run.**

## TRAPS PAID FOR AGAIN THIS PASS

1. **Do not blur by clicking the page.** A click at (700,400) on Work Orders opens a work order.
   Use `document.activeElement.blur()`.
2. **`.q-dialog` is the full-screen wrapper, not the sheet card.** Measuring a "top band" against
   it measures the backdrop and finds nothing — that is a harness failure, not an absent control.
3. **Quasar's focus-helper carries hover as well as focus** — 0.15 appeared in the expanded state
   too once the pointer was left over the button, so it distinguishes nothing on its own.
4. `tbody tr` counts **0 on the phone**, which uses cards. Never read it as "no results".
