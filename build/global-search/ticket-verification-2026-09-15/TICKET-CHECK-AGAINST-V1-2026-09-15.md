# Were these six really possible in V1? — checked, not assumed

**Date:** 2026-09-15 · **Tickets:** SV-10055 to SV-10060 · **V1 baseline:** commit `55767168`
> ✅ **SUPERSEDED IN SCOPE, NOT IN CONTENT.** The six-ticket simulator here has grown into a
> complete, runnable register of **every** capability the old search had —
> `build/global-search/v1-capability-evidence/`. Use that one for anything new; this file stays as
> the record of the six-ticket check.

**Method:** V1's matching was re-implemented exactly from its own source and **run** against the
queries each ticket names — `v1_matching_simulator.py` in this folder. Nothing below is reasoning
about what V1 probably did.

## The verdict in one table

| Ticket | What it says | Was it really possible in V1? |
|---|---|---|
| **SV-10055** Vehicle by year + make **or model** | year with make **or** model | 🔶 **PARTLY.** Year + make **in that order** worked. Year + model did **not**. Reversed did **not**. |
| **SV-10056** New job takes ~85s (rule allows 30) | should be findable within 30s | ✅ **TRUE — and understated.** V1 had no index at all; a new job was findable **immediately**. |
| **SV-10057** Customer by its own phone | should work with or without brackets/spaces/dashes | 🔶 **PARTLY.** Findable by phone yes — but **only the dashed form**. Brackets and plain digits did **not** work. |
| **SV-10058** Vehicle by part of the chassis number | part of it should find the vehicle | ✅ **TRUE.** |
| **SV-10059** Recent list back after a no-match | it should come back | ✅ **TRUE.** |
| **SV-10060** Mid-word works on some fields, not others | it should be consistent | ✅ **TRUE — and stronger than written.** |

---

## How V1 actually matched, because both corrections come from it

V1 glued everything about a record into **one long piece of text with the spaces taken out**, then
asked one question: *does the text the user typed, with its spaces taken out, appear anywhere inside
it?*

The vehicle's text, in this exact order — **owner, year, make, model, unit, chassis number, plate**:

```
zzautotestbridgeporthauling2019freightlinercascadiazzt-44711fujgldr9klzz4471ohzzt471
```

Two consequences fall straight out of that, and they are the two corrections.

### 🔶 SV-10055 — only **year + make** worked, not year + model

| Typed | V1 |
|---|---|
| `2019 Freightliner` | ✅ matched — the year sits immediately before the make |
| `Freightliner Cascadia` | ✅ matched — make immediately before model |
| `2019 Cascadia` | ❌ **did not match** — the make sits between them |
| `Cascadia 2019` | ❌ **did not match** — wrong order |

The ticket lists all three failing forms together and asks for "year together with its make **or
model**". **Only the first is a V1 capability.** The other two never worked, so asking for them is a
new request, not a restoration — worth separating, or a developer will be held to a standard the old
product never met.

### 🔶 SV-10057 — findable by phone, but only in one written form

The old query stripped `(` and turned `)` into `-`, then removed spaces. So `(419) 555-0143` was
stored as `419-555-0143`. The typed text only had its **spaces** removed — nothing else.

| Typed | V1 |
|---|---|
| `419-555-0143` | ✅ matched |
| `555-0143` (part of it) | ✅ matched |
| `(419) 555-0143` — *as shown on the record* | ❌ **did not match** |
| `4195550143` — plain digits | ❌ **did not match** |
| `419 555 0143` | ❌ **did not match** |

So the **capability is real** — a customer could be found by its phone number — but the ticket's
expected behaviour, *"should match whether or not it is typed with brackets, spaces or dashes"*, is a
promise from the **V2 requirement**, not something V1 did. Both forms the ticket's own steps use
(as-shown, and plain digits) are the two that **never worked in V1**.

That does not make the ticket wrong to exist. It makes the *reason* different: restoring V1 means the
dashed form; making every format work is the V2 requirement going further. Both are reasonable asks —
they should just not be presented as one.

---

## The four that are right

### ✅ SV-10056 — true, and the case is stronger than written

**V1 had no search index.** It fetched everything in one go and rebuilt that list whenever a record
was created — five places in the old code do exactly this, including the work-orders page. A new job
was findable **as soon as that one request came back**: no waiting, no thirty-second allowance.

So the ticket compares 85 seconds against a 30-second requirement, when the thing being replaced was
effectively **instant**. The 30 seconds is already a concession V2 asked for; 85 is nearly three times
even that.

### ✅ SV-10058 — true

The chassis number is inside that one long text, and matching was "appears anywhere", so any part of
it matched. Confirmed by running it: the whole number, the last six characters, and a chunk from the
middle all matched.

### ✅ SV-10059 — true

It is an explicit instruction in the old code: when a search produced no results, hand back the
recently viewed list. Not a side effect — deliberate.

### ✅ SV-10060 — true, and stronger than written

The ticket says mid-word searching works on some details and not others, and asks for consistency.
**In V1 that inconsistency was impossible**: every detail of a record — name, street, town, county,
postcode, phone, website, contacts — went into the *same* piece of text and was matched by the *same*
single rule. Confirmed by running it: fragments from the middle of the name, the street, the town and
the postcode all matched.

So "it should behave the same way across a record's fields" is not just a reasonable preference — it
is **exactly what the old product did**, because it had no way to do anything else.

---

## What I would change, and what I would leave alone

| Ticket | Suggested change |
|---|---|
| **SV-10055** | Narrow it to **year + make**, and note that year + model and the reversed order never worked in V1 — so they are a new ask if wanted. |
| **SV-10057** | Split the reason: **restoring V1** means the dashed form; **all formats** is the V2 requirement going further. Keep both, label them. |
| **SV-10056** | Add that V1 was effectively instant, so the gap is bigger than 85-versus-30. |
| **SV-10058 / 10059 / 10060** | Nothing. Correct as filed. SV-10060 could gain the point that V1 *could not* be inconsistent. |

**Nothing was edited.** These are someone else's tickets; this is a report.
