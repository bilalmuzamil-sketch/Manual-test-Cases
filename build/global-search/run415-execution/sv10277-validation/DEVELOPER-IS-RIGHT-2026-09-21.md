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

---

## Second pass — before advising that the ticket be closed, I re-checked every flagged pair

The QA lead asked *"are you sure this ticket can be marked as obsolete then?"* — and he was right to.
My first answer conceded too much at once. Re-examined all ten flagged orderings with match quality in
view (`recheckpairs.mjs`, `finalcheck.mjs`).

**Eight of ten are fully explained** by the developer's point, once the unclamped arithmetic is done —
the higher row matched the record's own name while the lower matched a secondary field, or it simply
carries more signal credit. `tire`, `valve`, `bearing`, `diesel`, `fleet`, `service`, `mobile`, `truck`
all resolve.

**One does not.** Typing `door`, Parts tab:

| | Row | Match | Available | Bin | Last sold | Most PRD 6.1 can award on top |
|---|---|---|---|---|---|---|
| **higher** | 4 · `Door Hold Back, 3", Aluminium, Pair` | word / description | **0** | yes | 54 days ago | **0.05** (bin only) |
| lower | 6 · `SEAL DOOR SEALOK .500"` | word / description | **24** | yes | 286 days ago | **0.25** (in stock 0.20 + bin 0.05) |

Identical match quality, on the same field, both on the record's own name. **The lower row earns 0.20
more under §6.1 and still sits below.** The only remaining signal is *viewed recently → +0.10*, which
cannot close a 0.20 gap even if it applied to the higher row alone.

**Two possible explanations, and they lead to different places:**
1. Something outside PRD 6.1 is contributing to the order — which would be a real finding, and the
   developer's explanation does not cover it.
2. `Door Hold Back` **begins with** "door", so if the engine scores it internally as a prefix (0.70)
   while *labelling* it `word`, the two rows tie at 1.25 and the recency tie-break decides. That would
   make this **SV-10279's** territory — the Parts tab mislabelling a begins-with match — not a
   separate defect.

**I cannot tell which from outside the engine, and I will not guess.** It is one question for the
developer, and it is a fair one to ask him.

## So: can SV-10277 be marked obsolete?
**Not as it stands.** Two things would be lost:

1. **The documentation gap** — PRD 6.1 gives the primary-display-name bonus as **+0.10**; the applied
   value is **at least +0.50** (a whole-word match scores 0.50, and a name match reaches the 1.00 cap,
   so the bonus is ≥ 0.50 whatever the true figure is). **Entirely independent of sorting, still true,
   and it lives nowhere else.**
2. **The `door` ordering**, unexplained above.

The ticket's *headline claim* is wrong and must not stand. But closing it as obsolete deletes a live
documentation defect along with it.
