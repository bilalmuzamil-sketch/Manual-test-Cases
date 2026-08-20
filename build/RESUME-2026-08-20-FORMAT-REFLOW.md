# RESUME — 2026-08-20, FORMAT REFLOW (Steps/Preconditions line-break repair)

Plain-language cold-resume snapshot. Read this first, then
`build/OUTSTANDING-ITEMS-REGISTER.md` (top block).

## DONE today

- **Filters format reflow COMPLETE — 124/124.** 61 cases fixed (line breaks
  restored in Steps/Preconditions), 60 already clean, 3 were false positives
  (already OK). All byte-verified; run 352 untouched.
- **Schedule format reflow COMPLETE.** 96 UI cases reflowed + 117 already clean
  + 10 API cases rewritten (the `\n`-variant form), all byte-verified. The 5
  "hardcoded skip" cases turned out to be false positives (already OK).
- **Report Suite** — C30162 and C30287 confirmed already OK (no reflow needed).
- **Standing Rule 75 recorded** — detached-process anti-thrash architecture
  (long-running work runs as a detached script + a pure-shell committer gated by
  a run-flag; the agent launches and exits; verification is a separate fresh
  one-pass agent). Also added to `build/skills/00-COMMON-CORE.md`
  session-survival section.
- **Committer self-match bug fixed** — the committer's self-exclusion now uses
  the run-flag form (was matching its own command line).
- **`push.err` removed and gitignored.**

## ROOT-CAUSE FIX (why this run finally finished)

Long-running work now runs as a **detached script** with a **pure-shell
committer** (run-flag gated), and the **agent launches-and-exits** instead of
babysitting. Verification is done by a **fresh one-pass agent**. This ended the
autocompact-thrash deaths that had been losing work mid-run.

## AWAITING QA LEAD (each with what it blocks)

1. **5 automated (atm=3) Schedule cases render collapsed in Steps + Preconditions**
   — C43811, C38847, C38848, C38849, C38850. *Blocks:* line-break reflow of
   those 5 (words unchanged). Needs A/B go-ahead. Would notify Vlad per Rule 65.
   Rule 71 holds them (ask-first for any edit to an Automated case).
2. **4 flagged automated cases needing decisions** — C30328, C30352, C30429,
   C43811 (C43811 overlaps item 1). *Blocks:* whatever change each needs; all
   ask-first under Rule 71.
3. **WIP v24 Confluence export** — needed to run the RS-WIP-6 spec-mirror diff.
   *Blocks:* WIP mirror currency (behind at v22).
4. **Parts Velocity + WIP spec changes** — need the current spec content to diff
   (Rules 31/43). *Blocks:* per-requirement reconciliation of those two.
5. **PO question sheets** — Chris Ward (2 Qs) + Branko (3 Qs) — WRITTEN, HELD
   until everything else is done (Rule 66). *Blocks:* nothing; ask before
   sending.
6. **SV-9069 marker-ordering fix on C30162/C30287** — the AUTOMATION marker is
   not last. *Blocks:* marker-position compliance; needs authorization.
7. **Jira ticket creation remains on hold (Rule 62)** — nothing filed.
