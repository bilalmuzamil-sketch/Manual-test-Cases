# The developer's challenge on SV-10277 is correct — the engine sorts by the real score

**His message:** *"Is there any mistake with the scoring, except for the number in the response that
looks the same? 1 is the maximum and can be reached easily, but the score in the engine still sorts
them by the actual number, which can be larger than one."*

## The experiment that settles it
Designed so the two hypotheses predict **opposite** results. Two parts, identical but for one signal,
and the tie-break deliberately pointed the other way:

| Part | Created | Stock | True score per PRD 6.1 |
|---|---|---|---|
| `Beta ZZSORTX Widget` | **first** (older) | **25** | 0.50 word + 0.50 name bonus + 0.20 in stock + 0.05 bin = **1.25** |
| `ZZSORTX Alpha Widget` | **second** (newer) | 0 | 0.50 word + 0.50 name bonus + 0.05 bin = **1.05** |

* If the engine sorted by the **clamped 1.00** and broke the tie by recency → **Alpha** first (it is newer).
* If the engine sorted by the **real number** → **Beta** first (its true score is higher).

**Result, twice: `Beta` first.** The older, in-stock part beat the newer one. **The engine sorts by the
real, unclamped score.** The developer is right.

## A second, independent confirmation from data already captured
Typing `shoe` returns 20 parts, every one of them reporting **1.00** — and the **seven that show
0 Available sit at the bottom, rows 14 to 20**. Under clamped-value sorting with a recency tie-break
they would be scattered through the list by last-changed date. Grouped at the bottom is exactly what
sorting by the true score predicts.

## What this does to SV-10277
**Its central claim is wrong.** The ticket says the other ranking signals *"stop making any
difference"* to the order. They do not: only the number in the response is capped. What I actually
proved was that **the returned number is clamped**, and I wrote that up as though it meant the ordering
was broken. It does not.

**My earlier "wrong order" examples do not survive either.** `tire` puts a part with 0 Available first —
but that row matched on its **description** (a primary-name match, which earns the bonus) while the
in-stock row below it matched on its **category** (a secondary field, no bonus). True scores 1.00
against 0.75: correct. Every one of the five stock examples and the six name examples resolves the same
way once the unclamped arithmetic is done. **I compared rows without holding match quality equal —
the very mistake I had recorded as L0174 the day before.**

## What survives, and is still worth the developer's time

| Finding | Status |
|---|---|
| **SV-10279** — the Parts tab records a name that **begins with** the query as a `word` match, where Customers, Vendors and Assets record it as `prefix` | **Stands.** The evidence is the match **label**, not the score, so clamping does not explain it. A begins-with part is genuinely credited 0.50 instead of 0.70. |
| **The documentation gap** — PRD 6.1 gives the primary-display-name bonus as **+0.10**; the measured value is **at least +0.50** | **Stands.** Independent of sorting. |
| **C44854** — searching from a work order page returns the identical rows in the identical order | **Observation stands, my explanation does not.** I said the −0.10 demotion could not show because of the clamp. That reasoning is void. Needs re-testing with the unclamped arithmetic in mind. |

## The lesson
**A clamped number in a response is not evidence about ordering.** Sorting can happen on a value the
response never shows. Before asserting that a signal has stopped working, run an experiment whose two
outcomes point in **opposite** directions — as above — rather than reading equal numbers and inferring
equal treatment. Learning **L0178**.
