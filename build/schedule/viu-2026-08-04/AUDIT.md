# Schedule — Ruthless Usefulness Audit, 2026-08-04 (Standing Rule 28)

**Scored 165 of 165 cases. Cold-read, every case, on all three dimensions. Not a sample.**
Run after the live pass, against the **live** case text (re-pulled from TestRail so the audit read
what a tester will actually read, not a local copy). Runner: `tools/audit.py`.

## The tally

| dimension | result |
|---|---|
| **1. USEFUL** | **KEEP 161 · WEAK-KEEP 4 · MERGE 0 · CUT 0** |
| **2. MAKES SENSE** | **SENSIBLE 165 · FIX-WORDING 0 · NONSENSE 0** (after 1 repair, below) |
| **3. GENUINE + LAYMAN-RUNNABLE** | **164 clean · 1 documented exception** |
| **cross-case consistency sweep** | 33 anchor clusters swept · **0 real contradictions** (1 candidate examined and dismissed, below) |
| **title-vs-expected check** | 165 checked · **0 mismatches** |

The four **WEAK-KEEP** cases are legitimate but low-value: SCH-EDGE-03 = C30087 (list stays smooth
with 50+ items), SCH-EDGE-04 = C30088 (grid renders at full load), SCH-EDGE-08 = C38866 (dark mode)
and SCH-KEY-05 = C30070 (focus trap). They are flagged, not cut — each one would catch a real
regression, they are simply not the cases that would find a scheduling bug.

There are **no merge groups and no cuts** because this suite was already consolidated on 2026-07-31
(190 → 165: 20 merge groups plus 2 cuts). The granularity explosions were removed then; nothing new
has grown back.

## Dimension 2 — the one repair this audit forced

**SCH-NAV-03 = C29927** ([link](https://shopview.testrail.io/index.php?/cases/view/29927)) ended with
*"The same shifts remain visible (**appropriately rendered**) in all three views."* — "appropriately"
is not something a tester can pass or fail. Replaced with what each view actually draws: *"positioned
on the hour line in Day, as a chip in the day column in Week, and as a compact chip in Month."*
Pushed and byte-verified.

## Dimension 3 — three repairs, and they were our own fault

The known-issue blocks this pass added to three non-API cases had leaked developer language into
tester-facing text (endpoint names, `data-test-id` values, an HTML tag). Rewritten in plain words,
with the technical detail left where it belongs — in the Jira ticket and in `FINDINGS.md`:

| case | what was wrong | now reads |
|---|---|---|
| SCH-SER-02 = [C29988](https://shopview.testrail.io/index.php?/cases/view/29988) | quoted a test-id and an icon name | "no arrows at the edges of the banner and no 'week N of M' wording anywhere" |
| SCH-MODAL-02 = [C30009](https://shopview.testrail.io/index.php?/cases/view/30009) | quoted `<input type="time">` | "the start and end time boxes accept and offer EVERY minute, not quarter-hours" |
| SCH-PERM-08 = [C30081](https://shopview.testrail.io/index.php?/cases/view/30081) | quoted two permission atom names and an endpoint | "a user who has the Schedule but has NOT been given Work Orders: View still sees the whole work order list" |

**The documented exception:** SCH-API-04 = [C38875](https://shopview.testrail.io/index.php?/cases/view/38875)
carries a ticket but **no spec anchor**, because no numbered Schedule requirement covers
location-scoping of a shift read. Its provenance line says exactly that in words rather than
inventing a reference. This is a recorded decision, not an oversight — see `DELIBERATE-DECISIONS.md`.

## The cross-case consistency sweep

Cases were grouped by the spec anchor they cite (33 clusters), and every pair inside a cluster was
diffed for opposite assertions on the same control — hidden vs shown, disabled vs enabled, real-time
vs on-Apply, editable vs read-only, skipped vs not-skipped, flagged vs not-flagged. Plus a
title-vs-expected check on **every** case.

**One candidate contradiction surfaced and was examined:**

> §14.1 — **SCH-PERM-04 = [C30077](https://shopview.testrail.io/index.php?/cases/view/30077)** says
> *"Modal fields are editable and save"*, while **SCH-PERM-13 =
> [C38926](https://shopview.testrail.io/index.php?/cases/view/38926)** says a user gets *"the
> read-only schedule"*.

**Dismissed — they cannot conflict, because they describe different users.** C30077 is about a user
who HAS Schedule: Edit; C38926 is about the view-only default roles. Both were verified live in the
same pass and both are true simultaneously. Recorded here so the next audit does not re-litigate it.

**Zero contradictions remain.** The suite may be delivered.

## Is the critic right?

Stefan Mitrovic's claim has two halves. Measured against this suite, honestly:

**"More than 70% of AI-made test cases are useless."** **No — 0% are useless here.** 161 of 165 are
KEEP and the other 4 are WEAK-KEEP, which is a flag, not waste. The stronger evidence is what the
suite *did*: run against a real build for the first time today, these cases **found ten defects
nobody had raised**, including one that makes the whole board unusable as a planning tool (every time
shown six hours late). A useless suite does not do that. And the number that matters most: **19 of
165 cases FAILED against the build.** A suite of restatements passes everything.

**"Some tests just do not make sense."** **He was right in spirit, and the audit is how we catch it.**
This pass found and fixed **one** vague expected result and **three** cases where our own new text
had leaked developer jargon into a manual tester's instructions — 4 of 165, or **2.4%**. Not the
majority he described, but not zero either, which is exactly why the cold read is mandatory rather
than optional. The residue after repair is **0 nonsense, 0 vague, 0 jargon in non-API cases**.

**Where he would still have a point:** the four WEAK-KEEP cases are honestly thin, and **two cases
(both HELD) cannot be automated at all** because the specification contradicts itself and no ruling
exists. We say so on the cases themselves rather than pretending otherwise.
