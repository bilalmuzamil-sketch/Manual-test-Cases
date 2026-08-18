# Chris Ward answers — Report Suite (Work In Progress) — RECONCILIATION PLAN

**Pass:** ingest Chris Ward's answers to the 2026-08-17 question sheet → produce a reconciliation
plan for the QA lead to approve. **READ + FETCH + PLAN ONLY.**
**Nothing was written to TestRail or Jira, and no case was edited.**

- **Project:** Report Suite · **report:** Work In Progress · **PO:** Chris Ward · **epic:** SV-8582 · **TestRail group:** 4281
- **Git base:** `origin/claude/slack-session-0sxnd9` @ `181b87b9` (fast-forwarded to remote HEAD before starting)
- **Question sheet reconciled:** `build/report-suite/questions-2026-08-17/Report-Suite_Questions-for-Chris-Ward_2026-08-17.md/.xlsx`
- **Chris's reply (verbatim):** `chris-answers-fetched-2026-08-18.txt` (this folder)

---

## SOURCE-CURRENCY (Standing Rule 31)

| Source | Identifier | Version / date | Read | Verdict |
|---|---|---|---|---|
| Chris's answers | Google Doc `1KN1Y4a…` | shared by QA lead | fetched LIVE 2026-08-18 (`/export?format=txt` → 307 → docstext CDN) | **CURRENT** |
| WIP spec | Confluence WIP report | **v21** | last verified in the question sheet on **2026-08-17** (not re-fetched this pass) | **CARRIED-FORWARD** — must be re-confirmed live immediately before any actual edit (Rule 59) |
| Epic | SV-8582 | 114 children | 2026-08-17 (question sheet) | CARRIED-FORWARD |
| Live TestRail cases | group 4281, WIP sections | 91 WIP cases | read LIVE 2026-08-18 (this pass) | CURRENT |
| Build | `sv8582` QA branch | — | **NOT observed** — build verification DEFERRED by instruction | N/A this pass |

**Because build verification is deferred, every planned action below is PROVISIONAL and no marker is
lifted to `AUTOMATION: READY` in this plan.** A separate build-verify sync does that later (Rule 69 / §15).

---

## CHRIS'S ANSWERS — VERBATIM

- **Q1 (WIP Estimates info-icon help text — which wording governs, may we drop the other):**
  > "A :) you did the right thing!"

  ⇒ **Option A** — keep the **longer** design-review-locked wording ("The total value of all estimate
  lines that have not yet been approved, including lines awaiting authorization on open work orders")
  and drop the short S5-R12 leftover. **This is the wording our case already asserts.**

- **Q2 (WIP tab placement — one tab by work-order status, or every matching tab by line state):**
  > "B - we're treating WIP as a sum of lines, not work orders"

  ⇒ **Option B** — a work order appears in **EVERY matching tab, keyed on LINE STATE**; each tab shows
  only that tab's share. **This REVERSES the "exactly once / one tab by status" wording our current
  cases assert.**

Chris's reply covered nothing beyond the two questions.

---

## HOW THE ANSWERS WERE APPLIED (rules)

- **Q1 = A confirms the wording we already use** → under **Rule 56** this is a *confirmation*, **not a
  divergence**: the now-resolved divergence disclosure comes OUT and is replaced with a confirmation
  citation to Chris's 2026-08-18 answer. The tested assertion (the tooltip text) does **not** change.
- **Q2 = B is UNAMBIGUOUS and quotes back to option B** (Rule 58 quote-back gate passes) → the
  status-based "exactly once / one tab" wording is replaced with line-state placement, and a **Rule-56
  divergence note** is added (case follows Chris's 2026-08-18 answer B, which differs from spec S2-R4's
  "exactly once" text; the newest authoritative source wins — Rule 32).
- **Automated cases (`custom_atmstatus = 3`) are ask-first and build-verify-coupled (Rule 71).** Any
  affected Automated case is **HELD** — not edited in this or any plan-approval edit — until the QA lead
  permits AND the edit can be coupled to a live build-verify pass.
- **Marker handling (Rule 69 refinement):** the marker keys on **testable content**. A note/metadata-only
  refresh keeps the existing marker; a testable-content change with build deferred takes
  `AUTOMATION: Not available on Build to test Yet - Last checked <date>` — **but that form substitutes a
  plain `READY` only and must never overwrite an `EXPECT FAIL`/`HOLD`.** Two Q2 cases currently carry a
  `HOLD` whose *reason was the ambiguity itself*; that reason dissolves once Chris answers, so the marker
  decision on those is flagged for the QA lead rather than assumed.
- **Rule 58:** where B does not directly answer a question (the nightly-snapshot shape), it is **HELD +
  a follow-up question**, never guessed.

---

## PER-CASE PLAN

### Q1 — Estimates info-icon help text (answer A)

| C-id | Case | atm | Current expectation (quoted) | Chris's ruling | Planned change | Unambiguous+quotable? | Automated→HOLD? | Testable content changes? | Rule-56 note? | ACTION |
|---|---|---|---|---|---|---|---|---|---|---|
| **C30493** WIP-SUM-07 | Each summary figure's information icon reveals its plain explanation | 1 | item 7: *"Estimates — 'The total value of all estimate lines that have not yet been approved, including lines awaiting authorization on open work orders.'"* + a tester note saying the spec states this two ways and it *"has been raised with the product owner"* | A — keep this longer wording, drop the short S5-R12 | Assertion (item 7) UNCHANGED. Remove the now-resolved "raised with the PO / states it two ways" tester note; replace with a plain confirmation citing Chris's 2026-08-18 answer A. Re-stamp provenance/`refs` to cite Chris 2026-08-18 as confirming and record that the S5-R12 short wording is a spec leftover Chris agreed to drop. | **YES** ("A :) you did the right thing!" → option A) | No (atm=1) | **No** — the tooltip assertion is byte-identical; only the divergence note + provenance move | **No** — confirmation, not divergence (Rule 56) | **UPDATE-SAFE** (note/provenance only; marker `Not available on Build…` stays) |

*Related, not content-affected:* **C30524** (WIP info-icon keyboard/screen-read) `refs` cite S5-R12 (the
short wording Chris is dropping). It asserts *reachability*, not the wording, so **no content change**;
optional `refs` tidy to point at S5a-R2 when the case is next touched. Not planned as an edit here.

*Other six info-icon explanations in C30493* were re-verified against S5-R12 and match byte-for-byte
(Rule 41) — they are a different icon set and are unaffected by A.

### Q2 — tab placement (answer B: line-state, every matching tab)

| C-id | Case | atm | Current expectation (quoted) | Chris's ruling | Planned change | Unambiguous+quotable? | Automated→HOLD? | Testable content changes? | Rule-56 note? | ACTION |
|---|---|---|---|---|---|---|---|---|---|---|
| **C30458** WIP-SCOPE-03 | Each qualifying work order appears exactly once in exactly one tab | 1 | item 1: *"Each qualifying work order appears exactly once, in exactly one tab."* (marker currently `HOLD — spec states two rules, PO asked which governs`) | B — line state, every matching tab | Reword item 1 to line-state placement (drop "exactly once / one tab"): a work order appears in **each tab matching one of its line states**, each tab showing only that tab's share. Add Rule-56 divergence note (follows Chris B 2026-08-18, differs from spec S2-R4 "exactly once"). **Marker:** the `HOLD` reason (ambiguity) is now resolved → recommend replacing with `Not available on Build to test Yet - Last checked 8/18/2026` (content changed, build deferred). ⚠️ overwriting a `HOLD` — flagged for QA-lead confirmation. | **YES** (option B) | No (atm=1) | **Yes** — core assertion flips | **Yes** (B differs from S2-R4) | **UPDATE (content reword)** — plan for approval; marker decision flagged |
| **C30462** WIP-PLACE-01 | Status-to-tab mapping: Estimate, Complete, In Progress and Review work orders | **3** | items assert each WO appears in one tab *"and nowhere else"*, by status | B — line state, every matching tab | Would need reword to line-state placement — **but it is Automated.** | YES (option B) | **YES — HOLD** | Yes (would flip) | Yes | **HOLD — AUTOMATED** (ask QA-lead permission; edit only coupled to a live build-verify pass, Rule 71). *Confirmed: this is the known Automated + content-changed HELD case; kept HELD.* |
| **C30464** WIP-PLACE-03 | Approved started-boundary: time or part received vs neither decides the tab | 1 | item 3: the not-started Approved WO appears in "Approved - Not Started" *"and nowhere else"* (marker currently `HOLD — spec states two rules…`) | B — line state, every matching tab | Reword so an Approved WO with mixed line states appears in BOTH "Approved - Partially Completed" and "Approved - Not Started" (drop "nowhere else"). Add Rule-56 divergence note. Same marker decision as C30458 (HOLD reason dissolved → recommend `Not available on Build…`; flagged). | **YES** (option B) | No (atm=1) | **Yes** — "nowhere else" breaks under B | **Yes** | **UPDATE (content reword)** — plan for approval; marker decision flagged |
| **C30456** WIP-SCOPE-01 | Every open service WO at a selected location appears in the report | 1 | item 2: *"Each appears in the tab its status places it in (see the WIP — Tab Placement cases)."* (marker `Not available on Build…`) | B — line state | Reword item 2 to reference line-state placement (a WO can appear in several tabs). Add Rule-56 divergence note. Marker stays `Not available on Build…` (content changed, build deferred — clean, no HOLD to overwrite). | **YES** (option B) | No (atm=1) | **Yes** — "the tab its status places it in" is single-tab-by-status | **Yes** | **UPDATE (content reword)** — plan for approval |
| **C30452** WIP-TAB-02 | Four tabs in a fixed order with the partially-completed tab selected | **3** | item 3 parenthetical: *"(the tab a job lands in is derived from its status and whether any work has started)"* — singular, by status | B — line state | The parenthetical implies single-tab-by-status and would need softening under B; primary assertions (four tab labels/order/default/counts) unaffected. **Automated.** | YES (option B) | **YES — HOLD** | Partial — parenthetical only | Yes (if touched) | **HOLD — AUTOMATED** (ask permission + build-verify couple, Rule 71). Newly identified affected Automated case. |
| **C30528** WIP nightly snapshot (one row per open WO per date) | 1 | item 1: *"one row per then-open work order — one row per work order per calendar date."* (marker `HOLD — background process, nothing reads it back`) | B — WIP is *"a sum of lines, not work orders"* | Chris answered **tab placement**, not snapshot granularity. Whether "sum of lines" means the snapshot should record per-line-state / per-bucket rows rather than per-work-order is **NOT settled by his answer** — applying B here needs interpretation. | **NO — needs interpretation** | No (atm=1) | Unknown until clarified | Pending | **HOLD — AMBIGUOUS → follow-up question** (Rule 58). Keep existing background-process `HOLD`. **HIGH risk** — the snapshot feeds trend history. Do NOT guess. |

**Not affected (checked, ruled out):** C30451 (nav/page title), C30460 (empty-state; Automated but B does
not change empty-state logic), C30482 (all-estimate WO → Estimates tab under both models), C30490/C30494
(per-stage figure = matching tab total, and Totals row — internally consistent under B by construction),
C30509 (saved-setting fallback), C38916 (Location column), C43814/C43818 (column/strip composition),
C43838 (active-tab highlight visual). All examined live; none asserts placement in a way B breaks.

---

## NEW COVERAGE THAT B OPENS (no case today — follow-up authoring, not in this plan)

Under B the report shows a WORK ORDER's money **sliced per tab** by line state, and line-level vs
work-order-level ageing becomes meaningful. There is **no case covering the per-tab money slice** today.
This is **new authoring** (a `add_case` pass), flagged as a follow-up for the QA lead — separate from the
edits above.

---

## TALLY

| Bucket | Count | Cases |
|---|---|---|
| **UPDATE-SAFE** (note/provenance only, assertion unchanged) | 1 | C30493 |
| **UPDATE — content reword** (manual, B unambiguous; plan for approval) | 3 | C30458, C30464, C30456 |
| **HOLD — Automated** (`atm=3`; ask permission + build-verify couple, Rule 71) | 2 | **C30462** (the known one), C30452 |
| **HOLD — ambiguous → follow-up question** (Rule 58) | 1 | C30528 |
| Related refs-only tidy (optional, not planned as an edit) | 1 | C30524 |
| Examined, not affected | 9 | C30451, C30460, C30482, C30490, C30494, C30509, C38916, C43814, C43818, C43838 (10 listed; C30490/C30494 added on review) |

**Total distinct cases touched by the two answers: 7** (1 safe + 3 reword + 2 Automated-hold + 1
ambiguous-hold), plus 1 optional refs tidy.

---

## OUTSTANDING — what the QA lead needs to decide / provide

1. **Permission to edit the 4 manual cases** (C30493 safe; C30458/C30464/C30456 content reword) — Rule 6.
   All are PLANNED, none executed.
2. **Permission for the 2 Automated cases** C30462 + C30452 (`atm=3`) — Rule 71 ask-first; and they can be
   edited **only coupled to a live build-verify pass**, which is deferred.
3. **Marker decision** on C30458 + C30464: their current `HOLD` reason (the ambiguity) is now resolved by
   Chris's B — recommend replacing with `Not available on Build to test Yet` (build deferred), which means
   overwriting a `HOLD`. Confirm this is acceptable (it carries no ticket/blocker ref to preserve).
4. **Follow-up question to Chris** on C30528: does "WIP is a sum of lines" change the **nightly snapshot
   granularity** (per line-state / per bucket vs per work order)? HIGH risk — feeds trend history.
5. **New authoring** under B: the per-tab money slice (and line-level ageing) has no coverage today.
6. **Re-confirm WIP spec is still v21 live** immediately before any actual edit (Rule 59); this plan
   carried the 2026-08-17 read forward.
7. **Spec hygiene (Chris's side):** under A he drops the short S5-R12 wording; under B the spec's
   "exactly once" S2-R4 / status-based S3 wording must be reconciled to line-state. These are Chris's
   spec edits, tracked as outstanding.
