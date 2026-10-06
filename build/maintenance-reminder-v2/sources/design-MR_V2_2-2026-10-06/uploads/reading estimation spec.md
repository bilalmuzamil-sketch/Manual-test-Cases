# The current reading — how it is actually calculated

**SV-3780 · 2026-09-04.** Written because the field is drawn but the arithmetic behind it was never specified, and the numbers on the canvas do not survive checking.

---

## 1. The numbers on the canvas are wrong

The gallery shows one unit last recorded at **342,000 mi on 29 Aug**. Today is 4 September, so every projection runs **six days**.

| Card as drawn | Implied rate | Reality |
|---|---|---|
| `≈ 348,200 · estimated from 6 visits` | 6,200 mi / 6 days = **1,033 mi/day** | no truck does this |
| `≈ 349,000 · from the 2,000 mi/week they told us` | 7,000 mi / 6 days = **1,167 mi/day** | its own label says 286 mi/day |
| `≈ 351,000 · national average for long-haul` | 9,000 mi / 6 days = **1,500 mi/day** | long-haul is ~286 mi/day |

What those cards should read for this unit:

| Source | Rate | 6 days | Shows |
|---|---|---|---|
| Long-haul default | 104,000 mi/yr → 286/day | +1,714 | `≈ 343,700` |
| Regional default | 85,000 mi/yr → 233/day | +1,397 | `≈ 343,400` |
| Local default | 45,000 mi/yr → 123/day | +740 | `≈ 342,700` |
| Vocational default | 12,300 mi/yr → 34/day | +202 | `≈ 342,200` |
| Stated 2,000 mi/week | 286/day | +1,714 | `≈ 343,700` |
| Measured, unit runs 1,500/wk | 214/day | +1,286 | `≈ 343,300` |

**Every plausible value lands between 342,200 and 343,700.** The drawn numbers are out by 4,500–9,000 miles. The `Stated` card is the one that matters most, because its label states the rate, so the contradiction is checkable by anyone in the room.

---

## 2. There is one formula, not six

```
estimate = last_known_reading + ( rate × days_elapsed )
```

`last_known_reading` is the most recent **recorded** value and the date it was **taken** — not the date it was typed. Where no reading has ever been recorded, it is the enrolment baseline. Where there is neither, there is no estimate.

**The only thing that differs between the estimated states is where `rate` comes from.** One function, four rate sources, evaluated strongest first. Do not build four algorithms.

---

## 3. The four rate sources, strongest first

### 3.1 Measured from this unit's own history

Every past visit gives a `(date, reading)` pair. Sources that exist today: `work_order.mileage` / `.engine_hours` with `work_order.start_date` · `work_order_imported.vehicle_mileage` / `.vehicle_hours` with `.invoice_date` — so a shop that imported legacy history has a rate from day one · `maintenance_schedule_cycle` · inspection report `vehicleMileage`.

For each consecutive pair: `rate = Δmiles / Δdays`. Then a **weighted average with linearly increasing weights (1, 2, 3…)** so recent intervals count more and a customer whose usage changed gets a rate that follows. `weightedAverage()` on `origin/crm` already does exactly this.

**Guards, and all of them are needed:**

- **Discard any pair where Δmiles ≤ 0.** `positiveDelta` already returns null for these. A non-monotonic pair is a data-entry error, not a rate.
- **Discard intervals shorter than 7 days.** A unit that comes back the next day for a warranty fix produces a rate of thousands of miles a day from a rounding difference. This guard does not exist yet and it is the most likely source of a wild number in production.
- **Cap the contribution of very long intervals.** A three-year gap averages away every real change in the unit's duty. The linear weighting mostly handles it; a hard ceiling is not required for v1 but the interval length should be available for debugging.
- **Never cache the rate incrementally.** Always recompute from the stored pairs — because a corrected reading changes every interval that touched it (see §7).

**The floor.** Sasha asked for two visits minimum. `origin/crm`'s `confidence()` puts its lowest band at **two deltas**, which is three visits. These disagree.

**Recommendation: one interval is enough — two visits — and the label carries the count.** `Estimated from 2 visits` is self-describing; the advisor calibrates their own trust. Suppressing a real measurement and falling back to a national average is strictly worse, because a national average for a mixed fleet is wrong by up to tenfold.

### 3.2 The customer's stated average

Captured at enrolment, one question: *roughly how far does this unit run in a week?* Answerable from memory, which is the whole point — nobody has to walk out to the truck.

`rate = stated_weekly / 7`

It does not self-correct, so **the moment 3.1 is available, 3.1 wins.** Where the two disagree materially — say by more than 30% — surface it, because it is a free call opener: *"they told us 2,000 a week, we're seeing 3,400."*

### 3.3 Regional default by running type

One optional field at enrolment. `rate = annual / 365`.

| Running type | Annual | Rate |
|---|---|---|
| Long-haul / OTR | over 100,000 mi | ~286 mi/day |
| Regional | 70,000–100,000 | ~233 mi/day |
| Local / home-daily | 30,000–60,000 | ~123 mi/day |
| Straight truck / vocational | ~12,300 | ~34 mi/day |

**Recommendation: do not show a mileage for this source.** The spread across running types is nearly tenfold, and the spread *within* long-haul alone runs from 94,000 to 160,000 mi/yr. A number carrying that error bar is wrong by more than a whole service interval, and printing `≈ 351,000 mi` claims a precision that does not exist.

Show a **month** instead:

> `Probably due around October · national average for long-haul, we've seen this unit once`

Still actionable — it says *call Bob* — without inviting anyone to trust a figure to the mile. The underlying rate is still used for **ordering the worklist**, which is what it is genuinely good for.

### 3.4 Telematics

**Not an estimate.** A telematics value is a recorded reading with a fresh timestamp, so it is the *Recorded* state with a different provenance line, not a sixth kind of guess. Sasha's *as of* requirement applies because the sync is batched: `342,880 mi · Samsara · as of 06:14 today`.

---

## 4. Six labels, three behaviours

Build three, label six.

| Behaviour | Visual | Provenance varies by |
|---|---|---|
| **Known** — a recorded reading exists | exact number, no `≈` | manual entry · work order · intake · telematics |
| **Projected** — no recent reading, but a rate exists | `≈` and a rounded number | measured · stated · regional |
| **Unknown** — no rate at all | no number | never seen · seen once with no stated average |

Six code branches for what is one formula and three renderings is how the wild numbers in §1 get shipped.

---

## 5. "As of today" is the field's biggest error

Every projected card reads `as of today`. It is technically true — the projection is computed for today — and it hides the only thing that decides whether the number is worth anything: **how far the projection has run from real evidence.**

A projection running six days from a real reading is trustworthy. One running six months is fiction. Both currently read identically.

**Replace the calculation date with the projection distance:**

> `≈ 343,700 mi · estimated from 6 visits · last read 6 days ago`
> `≈ 358,000 mi · estimated from 6 visits · last read 94 days ago`

The second one tells the advisor to stop trusting it without a word of explanation. `as of` stays where it belongs — on **recorded** values, including telematics, where it means when the reading was taken.

---

## 6. Where a projection stops

Two separate mechanisms, and they are currently conflated.

**The field never expires.** It keeps projecting and keeps saying how far it has run. There is no cliff at which the asset page goes blank.

**A due service goes blocked**, and that is per service, because shelf life is proportional to the service interval and not to a fixed number of days:

- **Fresh** — the projection has run less than about a third of one interval → full confidence
- **Stale** — up to a full interval → the projection stands, marked, confidence reduced
- **Expired** — beyond a full interval → **that service falls into the needs-a-reading group**

For a 15,000-mile service on a unit doing 2,000/week — a 7.5-week interval — a 34-day-old reading is already **half an interval gone.**

**Also cap the projection itself.** Beyond one full interval, stop showing a projected number at all and show the last recorded value with its age plus the prompt to get a reading. Projecting 400 days from a national average produces a number nobody should see.

---

## 7. Rounding is an uncertainty signal, and it is free

Precision implies confidence. Use it deliberately:

- **Recorded** values show exactly as recorded. A real odometer reads `342,417`, not `342,000` — the drawn value looks synthetic and should not be rounded.
- **Projections round, and the rounding coarsens as the projection lengthens.** Under 30 days → nearest 100. Beyond that → nearest 500. Beyond one interval → no number at all (§6).

This communicates the error bar without a word of copy, which is exactly what Branko asked for.

---

## 8. Engine hours

**Same machinery, its own rate, never derived from miles.** The two do not correlate for vocational units — a refuse truck logs ~2,000 hours and ~18,000 miles a year, so an idle hour is roughly 25–30 miles of engine wear with zero odometer movement.

The asset carries **two independent fields** where it has both meters. Do not merge them and do not infer one from the other.

**Plausibility rejection, which the current build lacks.** The real case from QA data: a 2004 Ford F-350 reading 217,649 mi and **11 engine hours**. Hours are refused when they imply an average outside a realistic band for the asset's age. Without this the system concludes the engine is nearly new and never warns.

---

## 9. Corrections, and why the rate cannot be cached

A reading **lower** than the one on record is confirmed, never refused. The new number is normally the truth — usually someone typed the earlier one wrong.

On confirmation, **both intervals that touched the corrected value change**, so every rate derived from that history changes with them. The rate must be recomputed from the stored `(date, reading)` pairs, and every threshold and queued reminder for that asset recalculated — including queued ones, which may move or disappear.

This is why §3.1 forbids an incrementally cached rate.

---

## 10. Decisions this leaves open

1. **Does the regional default survive at all?** Sasha has never been shown it. §3.3's recommendation — keep the rate for ordering, show a month rather than a mileage — is the version worth defending. If it goes entirely, a unit seen once on a distance-only service is invisible, and the calendar-backstop offer becomes the only safety net.
2. **The floor: one interval or two?** §3.1 recommends one, with the visit count on the label.
3. **The short-interval guard.** Seven days is a proposal, not a measured figure. Worth checking against real work-order data before it ships, because it is the guard that stops a wild number reaching a customer-facing estimate.
4. **Whether the disagreement signal (§3.2) ships in v1** or waits. It is nearly free and it is the best call opener in the feature.
