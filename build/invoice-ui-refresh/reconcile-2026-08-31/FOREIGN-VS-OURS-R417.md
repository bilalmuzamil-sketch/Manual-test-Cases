# Foreign vs Ours — Run R417 overlap reconciliation (Invoice UI Refresh)

**Date:** 2026-08-31 · **Run:** R417 (119 tests) · **Ours (created_by=3):** 89 · **Foreign (created_by=6):** 30.
**Rule 38 posture: HANDS-OFF.** Foreign cases are identified and reported only — nothing was edited, moved,
or deleted. This is the Rule 39 "establish both sides" report; no contradiction was found, so no merge is
proposed. The 30 foreign cases were already in R417 before our 2026-08-31 v45 pass and the union sync
(Rule 34) preserved them untouched.

## Verdict
**All 30 foreign cases are COMPLEMENTARY to ours — 0 contradictions.** They cover the same rules from
different angles (API-level negatives, rendering edge cases, and cross-cutting / E2E regression) that our
UI-behaviour cases deliberately do not. Keeping both is correct; nothing needs changing on either side.
Two foreign cases are the closest conceptual neighbours of the two new cases this pass added — noted below
so the QA lead is aware, not because either is wrong.

## Same-rule overlaps (foreign ↔ our case on the identical rule)
| Foreign | Rule | Our same-rule case | Relationship |
|---|---|---|---|
| C45168 | S2-R3 | C44910 | Foreign = Credit Invoice never shows Remit-to (specific doc); ours = the rule in general. Complementary. |
| C45171 | S4-N3 | C44928 | Asset section hidden when no asset — foreign negative alongside our positive. Complementary. |
| C45169 | S3-R8 | C44922 | Foreign = **API** rejects Authorizer change while a non-voided invoice exists; ours = **UI** lock + void/reversal re-enable. FE+BE pair (Rule 24). Complementary. |
| C45170, C45190, C45191 | S3-R5 | C44919 | Foreign = API rejection + permission read-only + customer-card regression; ours = UI entry point. Complementary. |
| C45179–C45183 (5) | S11-R6a | C44969 | Foreign = five granular Credit-Invoice Balance states; ours = totals block + Balance-follows-status. **Both now agree on the v45 open-balance definition** — reinforces our 2026-08-31 update, no conflict. |
| C45184 | G-R1 | C44906, C44952 | Fixed date format — foreign cross-cutting sweep vs our per-document cases. Complementary. |
| C45193 | S5-R9 | C44935 | Four-digit amounts / no NaN — foreign rendering edge case. Complementary. |
| C45194 | S1-R1 | C44901 | Special characters render — foreign edge case. Complementary. |
| C45195 | S12-R1 | C44971 (+ our new S12-R10 **C45213**) | Multi-page PDF breaks cleanly. **Closest neighbour of our new S12-R10 page-break case** — foreign is a PDF break smoke test, ours enumerates the S12-R10 rules (single ID line on later pages, totals not split, line+footer together, no orphan). Complementary, both worth keeping. |
| C45196, C45176, C45177, C45178 | S10-R4 | C44962 | Paid-date edge cases (mixed tender, most-recent applied row, reversal→Due, zero-total). Complementary. |
| C45197 | S11-R3 | C44966 | Credit Invoice renders when originating invoice reversed. Complementary. |
| C45174 | S8-R2 | C44946 | Fully reversed payment not in Payments — foreign covers the "no longer applied" clause of S8-R2; ours covers row ordering. Complementary. |
| C45175 | S8-R8 | C44951 | Paid-banner pill/title wording. Complementary. |
| C45172 | S5-R7 | C44933, C44935 | "Summarize labor/parts total" footer control — foreign focuses the summarize toggles; ours the nine Invoice Details settings + footer. Complementary. |
| C45173 | S5-R2 | C44930 | Line numbers → three digits from line 100. Complementary edge case. |

## Foreign-only anchors (no rule-level overlap — E2E / regression, entirely additive)
- **C45185–C45189** — SV-8218 Plan/Shipped anchors: snapshot-before/after redesign, emailed PDF attach,
  preview-vs-PDF parity, US/CA currency conventions. Cross-cutting E2E; no matching rule ID in our suite.
- **C45192** — mobile-viewport fit (anchor SV-9441). **Closest neighbour of our new S12-R11 viewport case
  C45214**; foreign is mobile-specific, ours is the general S12-R11 no-clip / scroll-in-own-container rule.
  Complementary.

## Recommendation
- **No action on foreign cases** (Rule 38). No contradictions to reconcile (Rule 39 satisfied by this report).
- The two near-neighbours (C45195 ↔ C45213; C45192 ↔ C45214) are complementary; keep both. If the QA lead
  wants a single owner per concept later, that is a dedup decision for them — not a correctness issue.
- If the foreign author renumbers or retires any of these, our union sync keeps ours intact; theirs are
  theirs to manage.
