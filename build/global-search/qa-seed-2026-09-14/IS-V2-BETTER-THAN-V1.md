# "Is V2 really better than V1?" — what this suite can and cannot answer

The product head's question and the QA lead's question are **different questions**, and the
regression suite only answers one of them.

## What the 19 regression cases answer
**"Has anything got WORSE?"** — can every search a V1 customer relied on still find the record.
That is a *no-loss* proof. It is the right instrument for *"the customer must not be negatively
surprised"*. **It cannot show that V2 is better**, because a suite of V1 behaviours has no way to
reward V2 for doing something V1 never did.

## What would answer "is V2 better?" — and where it stands
V2's claimed improvements are in the PRD. Coverage already exists for most of them in the **V2
functional sections (6721-6740, ~107 cases)** — that is the suite that proves *better*, not mine:

| V2 claim (PRD v1.5) | Where it is tested | Covered? |
|---|---|---|
| Typo tolerance — `Petersn` finds `Peterson` | `6725` Fuzzy Matching (11 cases) | ✅ |
| 8 entity types instead of 5, with scope tabs | `6722` Scope Tabs (12) | ✅ |
| Best result first; exact ID pinned above groups | `6726` Ranking (8) | ✅ |
| 5 results per group instead of 3, "Show all N" | `6723` (9) | ✅ |
| Recent activity on open; query persists | `6728` (5), `6729` (3) | ✅ |
| Keyboard-first (arrows, Enter, ⌘Enter, Esc) | `6721` (10) | ✅ |
| Quick actions on hover | `6774` (8) | ⚠️ **epic says out of scope, PRD v1.5 says in — unresolved** |
| Faster (150 ms debounce, p95 ≤ 250 ms, render ≤ 200 ms) | — | ❌ **nothing tests latency** |

## The honest gap in answering the product head
**Nobody is measuring "better" comparatively.** Three things are missing:

1. **No side-by-side comparison.** "Better" is a comparison, and no case runs the same query against
   V1 and V2 and contrasts the outcome. That is cheap to add now that both environments are reachable:
   take ~20 real queries a shop actually types, run each on `app.shopview.com` and
   `sv9160.qa.shopview.com`, and record *found / not found / position of the right answer*. That single
   table answers the product head directly.
2. **No latency evidence.** §9 sets p95 ≤ 250 ms and render ≤ 200 ms; no case checks it, so the
   headline "faster" claim is currently unevidenced.
3. **No success-on-first-try measure.** The real user benefit is "I find it without retyping" —
   measurable as *is the intended record in the top 3?* Ranking cases assert ordering rules, not
   outcomes.

## The uncomfortable early signal
From seed verification: free-text search works well in V2, but **exact identifiers — part number,
full VIN, unit number — did not return their records**, including on three real pre-existing stocked
parts. If that holds under formal execution, then on the searches a parts desk performs most often
**V2 is currently worse than V1, not better.** That is worth knowing before the "is it better?"
conversation, and it is exactly what the regression suite was built to catch.

**Recommendation:** run the regression suite first (it is ready). Treat "is V2 better" as a separate,
small piece of work — the 20-query side-by-side plus a latency check — rather than assuming the
functional suite answers it.
