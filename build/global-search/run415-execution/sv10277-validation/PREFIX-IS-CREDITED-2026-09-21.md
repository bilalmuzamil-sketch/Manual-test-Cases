# The "door" question answered — and SV-10279's claim is wrong

Asked whether the `door` ordering deserved its own ticket. Before answering I tried to rule out the
innocent explanation, and it turned out to be the true one.

## The experiment
Two parts created for it, **both 0 Available, same bin location, neither ever sold**, and the search
token kept out of both part numbers:

| Part | Where the token sits | Part number | Created |
|---|---|---|---|
| `ZZPRXQ Alpha Widget` | **begins** the name | `PRX-9101` | first (older) |
| `Gamma ZZPRXQ Widget` | middle of the name | `PRX-9102` | second (newer) |

Then **Gamma alone** was given the *viewed recently* credit, worth **+0.10** under §6.1.

| | If a begins-with match IS credited 0.70 internally | If it is NOT (scored 0.50, as the label says) |
|---|---|---|
| Alpha | 0.70 + 0.50 bonus + 0.05 bin = **1.25** | 0.50 + 0.50 + 0.05 = **1.05** |
| Gamma | 0.50 + 0.50 + 0.05 + 0.10 viewed = **1.15** | **1.15** |
| Predicted order | **Alpha first** | **Gamma first** |

**Result: Alpha stayed first.** Note there is no tie in the second column — Gamma is strictly higher —
so a tie-break cannot rescue it. **The begins-with match is being credited.**

## The instrument check that nearly cost me the answer
My first attempt gave Gamma the view by **opening its page directly by URL**, and Alpha stayed first —
which looked like the same result. It was worthless: checking `/api/user/recent-entities` afterwards
showed **Gamma was not in the recently-viewed list at all**, so no credit had been applied and the test
proved nothing. Re-run by **clicking the row in the search panel**, the way a user does, the view
registered (`Gamma` present in the list) and the measurement became real.

**Without that check I would have reported a conclusion built on a signal that never landed.** Rule 104.

## What this means for the tickets

**The `door` case is explained. No ticket.** `Door Hold Back` begins with "door", so it is credited
0.70 internally; against `SEAL DOOR SEALOK`'s 0.50 + 0.20 in stock + 0.05 bin, the two land level and
the tie-break decides. Nothing is wrong.

**SV-10279's central claim is wrong and it must not stand as written.** It says the Parts tab *"does
not credit a begins-with match"* and that such a part *"receives no advantage"*. The advantage **is**
applied. What is actually wrong is narrower: the **match label in the response reads `word` where
Customers, Vendors and Assets read `prefix`** — a reporting inconsistency, not a ranking fault, and
nothing a user can see.

## The one soft spot, stated rather than hidden
The conclusion assumes *viewed recently* is credited to Parts at **+0.10**, as §6.1 says. Supporting
evidence from the same day: a tagged part moved **0.55 → 0.65** — exactly +0.10 — after the QA lead
opened it, with nothing else about it changed. If that signal were not applied to Parts at all, both
rows would sit level and the ordering would fall to the tie-break, and the experiment would not
separate the two explanations.
