# SCHEDULE — completion report, derived live at 2026-08-13 07:44:58 UTC

> Produced by a cold run of skill `05-PROJECT-REPORT` (read-only: TestRail `get_*` only · no Jira ·
> no application access · zero writes anywhere). Every figure was read from TestRail at the time
> stamped above — nothing carried from any earlier document. Working:
> `build/reports-2026-08-13/HOW-THE-NUMBERS-WERE-DERIVED.md` + `live-derivation.json` (same folder).
>
> The branch is FINAL (QA lead, 2026-08-11: *"The Branches are Final now."*) — a deviation below is a
> real defect in a finished feature. "Final" means handed off, not frozen: bug-fix-only deploys since
> a check do not make it stale.

## The table

| Measure | Figure | Note |
|---|---|---|
| Total cases | **ours 176 / live 176** | 0 foreign cases in group 4254 |
| Source-verified | **176 of 176** | every case carries a per-source read date (173 "11 August 2026", 3 "12 August 2026") AND a spec pin (Schedule specification version 27). ⚠️ Whether v27 is still the CURRENT Confluence version was NOT establishable this pass — no Confluence access; that check belongs to skill `02` and is owed |
| Build-verified — most recent build named in the suite | **151** | `v3.5-65d6500`, checked 12 August 2026 (140 + 11 date-format variants). ⚠️ The build NOW RUNNING could not be read this pass (no application session), so "running build" is asserted by the cases' own records, not by a live read of the branch |
| Build-verified — an earlier build | **25** | `v3.5-7ec992f` (6 Aug) → 15 · `v3.5-d122eef` (5 Aug) → 10. Bug-fix-only deploys since do not make these owed |
| Never checked against any build | **0** | Gate: 151 + 25 + 0 = 176 ✔ |
| Steps and preconditions actually walked | **not independently establishable from TestRail; ≤ 151 by the stamp record** | per core §14.2 a stamp dated 12 August 2026 or later records the full runnability walk → 151 carry one. But the skill's own correction note records that on 2026-08-12 the honest split was 76 build-verified / 28 steps-walked of 176, and the 151 stamps cannot be discriminated from labels-layer re-stamps — so the defensible figure is "≤ 151, not independently established" (cold-start defect D5 against the skill) |
| Runnable / held | **141 / 35** | 137 READY + 4 READY - EXPECT FAIL = 141 · 176 − 35 HOLD = 141 ✔ both ways |
| Created / updated / deleted this pass | **0 / 0 / 0** | report-only pass |
| Run 357 sync | **in sync** | `include_all` false · 176 tests · run-vs-suite case sets equal both directions (∅ / ∅) · current grading 90 passed / 11 failed / 7 blocked / 0 retest / 68 untested (= 176 ✔) · 549 result records |

Not the phrase "VIU complete" — the accurate claim for the verified cases is: **source-verified and
build-accurate in their preconditions, steps, navigation and labels, with the behaviour verdict
belonging to the tester.**

## What is left — itemised, with who each item waits on

1. **11 cases wait on a second sign-in as other role-holders — the QA lead** (access): 8 whole —
   C30076, C30077, C30078, C30079, C30081, C30084, C30614, C38926 — and 3 partial — C30044 (point 4
   only), C38872 (points 1 and 3), C38874 (point 2). Sequencing note from core §7.3: create and
   permission the users first, mint the sign-ins last — a role edit destroys every holder's session
   one way.
2. **8 cases wait on the Jira creation hold lifting — the QA lead** (register row H1): C29929, C29945,
   C29985, C30004, C30013, C30020, C30034, C30050 — each holds only because an observed fault has no
   ticket number to hang an expect-fail marker on. Rule 48's five fields: **(1)** the ruling, verbatim:
   *"Do not create anything until my next order."* (2026-08-10), re-stated *"However for now the Jira
   ticket creation is still on hold."* (2026-08-12); **(2)** given answering a request to file prepared
   defects, while the ticket-evidence bar was being raised; **(3)** it blocks the 8 C-ids above
   carrying `READY - EXPECT FAIL`, e.g.
   [C30013](https://shopview.testrail.io/index.php?/cases/view/30013); **(4)** reasonable because the
   eight-item evidence bar ensures the first ticket out of the door cannot be thrown back; **(5)**
   unblocked by his next order — each case is then one edit from `READY - EXPECT FAIL`.
3. **12 cases test product that does not exist in the build** (excluded from any readiness figure):
   panel button C43582–C43587 (6) · Unassigned row C29973–C29975 (3) · Dashboard C38868 · appointment
   at work-order creation C38869 · Priority field C38871. **⚠️ Discrepancy against the skill's own
   ruling:** core §15.1's worked example already ruled the six panel-button cases
   (C43582–[C43587](https://shopview.testrail.io/index.php?/cases/view/43587)) should carry plain
   `AUTOMATION: READY` — the control's absence is perfectly observable — yet live they still carry
   `HOLD`. An authorised `update_case` sweep is owed (QA lead's go-ahead; this report does not fix
   what it finds).
4. **3 cases wait on product-owner answers — and the questions have NOT been sent**: C43555 and C29983
   (question sheet owed by us, answer then owed by Branko) · C30089 (answer owed AND the shop-closure
   setting is not in the build).
5. **C38867 is impossible as written** — it needs shifts noted before a release that is already
   deployed. Decision owed (QA lead): reword or retire.
6. **Expect-fail backing not re-verified — 4 cases**: C29962 (SV-8957), C29967 (SV-8886), C29982
   (SV-9090), C29984 (SV-9006). §15.1 requires a LIVE open ticket; this pass made zero Jira calls by
   instruction. Owed: one Jira read per ticket; any closed one means the marker comes off.
7. **The spec-currency half of column 2** — a live Confluence read (skill `02`) to confirm v27 is
   still current. Waits on Atlassian access.
8. **The running-build identity** — waits on the QA lead for a fresh session; until then the column-3
   split rests on the cases' own stamps.

## AUTOMATED CASES CHANGED — FOR VLAD

**None.** This pass wrote to no case.

## OUTSTANDING — what I need from you

1. **Missing sources:** confirmation that Confluence v27 is still the current Schedule spec (needs
   Atlassian access).
2. **Unanswered questions:** the two unsent PO questions behind C43555/C29983 and the shop-closure
   question behind C30089 (item 4) — first step is ours (send the sheet), then Branko.
3. **Missing go-aheads:** the `update_case` sweep for the six panel-button cases item 3 flags (one
   marker edit each, per core §15.1's own ruling).
4. **Access / credentials:** the second sign-ins for the 11 permission cases (item 1) · a fresh
   QA-branch session (running-build marker) · Atlassian access (items 6–7).
5. **Decisions deferred or held:** the Jira creation hold (item 2 — its lift is your next order) ·
   C38867 reword-or-retire (item 5).
6. **Things another team owes:** nothing identified for Schedule this pass.
