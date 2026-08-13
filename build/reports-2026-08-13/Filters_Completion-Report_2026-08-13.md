# FILTERS — completion report, derived live at 2026-08-13 07:44:58 UTC

> Produced by a cold run of skill `05-PROJECT-REPORT` (read-only: TestRail `get_*` only · no Jira ·
> no application access · zero writes anywhere). Every figure below was read from TestRail at the
> time stamped above — nothing carried from any earlier document. Working:
> `build/reports-2026-08-13/HOW-THE-NUMBERS-WERE-DERIVED.md` + `live-derivation.json` (same folder).
>
> The branch is FINAL (QA lead, 2026-08-11: *"The Branches are Final now."*) — so a deviation below
> is a real defect in a finished feature, not something provisional. "Final" means handed off, not
> frozen: the branch still redeploys to fix reported bugs, and bug-fix-only deploys do not make a
> prior check stale.

## The table

| Measure | Figure | Note |
|---|---|---|
| Total cases | **ours 115 / live 120** | 5 foreign cases in group 4110, all by Ahtasham Amjad (C43576–C43580) — counted separately, untouched |
| Source-verified | **115 of 115** | every case carries a per-source read date ("read on 11 August 2026") AND a spec pin (Filters specification at Confluence version 19). ⚠️ Whether v19 is still the CURRENT Confluence version was NOT establishable this pass — no Confluence access; that check belongs to skill `02` and is owed (see What is left) |
| Build-verified — most recent build named in the suite | **74** | `v3.7-20e801b`, checked 12 August 2026. ⚠️ The build NOW RUNNING could not be read this pass (no application session), so "running build" is asserted by the cases' own records, not by a live read of the branch |
| Build-verified — an earlier build | **35** | `v3.6-3e9dd6d` → 12 (11 on 12 Aug, 1 on 11 Aug) · `v3.4.2-d00239b` (5 Aug) → 23. Bug-fix-only deploys since do not make these owed |
| Never checked against any build | **6** | C29559, C29609, C29610, C29612 (held for Branko's Status-chip ruling — deliberate), C29621, C43562. Gate: 74 + 35 + 6 = 115 ✔ |
| Steps and preconditions actually walked | **not independently establishable from TestRail; ≤ 85 by the stamp record** | per core §14.2, a build stamp dated 12 August 2026 or later records the full runnability walk → 85 cases carry one (74 + 11). But that record cannot be discriminated from a labels-layer re-stamp, so the honest figure is "≤ 85, not independently established" — logged as cold-start defect D5 against the skill |
| Runnable / held | **97 / 18** | 90 READY + 7 READY - EXPECT FAIL = 97 · 115 − 18 HOLD = 97 ✔ both ways |
| Created / updated / deleted this pass | **0 / 0 / 0** | report-only pass |
| Run 352 sync | **in sync** | `include_all` false · 120 tests · run-vs-suite case sets equal both directions (∅ / ∅) · current grading 81 passed / 8 failed / 4 blocked / 0 retest / 27 untested (= 120 ✔) · 648 result records |

Not the phrase "VIU complete" — the accurate claim for the verified cases is: **source-verified and
build-accurate in their preconditions, steps, navigation and labels, with the behaviour verdict
belonging to the tester.**

## What is left — itemised, with who each item waits on

1. **4 Status-chip cases — C29559 ([link](https://shopview.testrail.io/index.php?/cases/view/29559)),
   C29609, C29610, C29612 — wait on Branko** to confirm whether the Status chip is hidden or shown
   greyed out on the Estimates and Completed tabs, and to correct the specification. **This blocks the
   VERDICT SOURCE only** — the steps were proven walkable on 12 August (core §11.4's own record,
   commits `e882d1c6`/`b3e3aeb6`), which is why these 4 carry no build stamp by design.
2. **10 Parts/Reports cases — C38882, C38904–C38911 — wait on Branko's Parts and Reports product
   write-up.** The filter bars are built; no source states what they should do. Blocks the verdict
   source, not the walking — the surfaces were walked on 12 August (core §11.4 group (a)).
3. **C38880 ([link](https://shopview.testrail.io/index.php?/cases/view/38880)) waits on the QA lead's
   ruling only** — its own text says the behaviour IS documented (S10-R4: each Parts view and each
   Report tab keeps its own separate filter set). Honesty note: the verbatim ruling holding it is not
   recoverable from the skill files this pass ran on, so Rule 48's five fields cannot be filled here —
   the case's own hold text is quoted instead, and completing the five fields is itself owed.
4. **C38881 is genuinely unrunnable by anyone** — it needs an account whose filters were saved before
   the redesign, and none exists. Decision owed (QA lead): retire, reword, or keep as a standing hold.
5. **3 rollout-dependent cases — C38891, C38901, C43562 — wait on engineering** finishing the
   page-search rollout / extending the new filter bar beyond some Parts views and one report tab.
6. **C29621 carries no build-check record** — owed one runnability check next time a session exists.
7. **Expect-fail backing not re-verified — 7 cases** citing SV-8832 (C29616, C29619, C29620, C29634),
   SV-8875 (C29624, C29625), SV-8912 (C38889). §15.1 requires a LIVE open ticket behind every
   expect-fail marker; this pass made zero Jira calls by instruction, so the backing is unconfirmed.
   Owed: one Jira read per ticket; any closed one means the marker comes off.
8. **The spec-currency half of column 2** — a live Confluence read (skill `02`) to confirm v19 is
   still current. Waits on Atlassian access.
9. **The running-build identity** — waits on the QA lead for a fresh session; until then the column-3
   split rests on the cases' own stamps.
10. **The 5 foreign cases (C43576–C43580) have empty expected results and no markers** — Ahtasham
    Amjad's to complete; reported here, not touched (Rule 38).

## AUTOMATED CASES CHANGED — FOR VLAD

**None.** This pass wrote to no case.

## OUTSTANDING — what I need from you

1. **Missing sources:** Branko's Parts/Reports product write-up (items 2 above — 10 cases; outstanding
   since 2026-08-05). Confirmation that Confluence v19 is still the current Filters spec (needs
   Atlassian access).
2. **Unanswered questions:** Branko's Status-chip ruling (item 1 — 4 cases).
3. **Missing go-aheads:** none for this pass (it wrote nothing). An authorised `update_case` sweep
   will be owed if any expect-fail ticket in item 7 turns out closed.
4. **Access / credentials:** a fresh QA-branch session (running-build marker + the walk owed on
   C29621); Atlassian access for items 7–8.
5. **Decisions deferred or held:** C38880 (your ruling) · C38881 (retire/reword/keep).
6. **Things another team owes:** engineering — the page-search / filter-bar rollout (item 5).
