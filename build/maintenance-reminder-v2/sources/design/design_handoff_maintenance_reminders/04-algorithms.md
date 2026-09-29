# 04 · Algorithms — confidence and estimates

**SV-3780 · Maintenance Reminders · review chunk 04 of 6**
**The calculation engine. Build this first, in isolation, with tests.**

| | |
|---|---|
| **Artboards** | 7 documentation boards — this is a logic review, not a design review |
| **PRD rules in scope** | `R-07`, `R-16`, `R-16.1`, `R-26`–`R-29`, `R-33.1`, `R-36`–`R-39`, `R-42`, `R-42.1` |
| **Read with** | `PRD.md` (normative) · `00-overview.md` (vocabulary, entry points, permissions) |

> Where this file and `PRD.md` disagree, the PRD wins. Gaps at the end of each section are **not** decisions — they are states the design does not cover.

---

## 0. Why this chunk is different

**Every screen in chunks 1, 2, 3 and 6 renders from this.** Nothing else can be right until it is. It has almost no artboards because it is arithmetic, not layout.

**It is also the chunk with the most open questions.** `OQ-10` (the confidence thresholds), `OQ-09` (the compliance due-date rule) and `OQ-21` (the bundling window) all gate **what the UI is allowed to claim**. Thresholds below marked ⚠ are provisional.

---

## 1. Readings

```
Reading { id, assetId, meter: 'mileage' | 'hours', value,
          takenAt, enteredBy, enteredAt,
          sourceWorkOrderId?, correctsReadingId? }
```

- A reading is **a fact with a timestamp and an author**.
- Recording one **re-evaluates every dependent threshold immediately**, not on an overnight run. The one moment the truck is physically present is now (`R-25`).
- A correction is a **new** Reading carrying `correctsReadingId`. The original is retained, never overwritten (`R-33`).
- ⭐ **Two things record a reading** (`R-33.1`, NEW): **a user changing the mileage on a work order, and the work order being invoiced.** Whatever the mileage reads at the moment of invoice becomes the new last recorded reading. Until then the value shows as entered, dated today, marked `In the shop`. **Invoicing is therefore a second entry point into the cascade** and easy to miss.
- **Nothing about a meter value is ever refused** (`R-30`). The position stands; the screens that dramatised it are cut for now (chunk 2 §3).

---

## 2. Rate estimation `R-26`

> Take the **two most recent recorded readings** for that meter, derive a rate from the delta in value over the delta in days, and carry the most recent reading forward at that rate. A new recorded reading **replaces** the estimate outright.

```
rate      = (value₂ − value₁) / (days₂ − days₁)
estimate  = value₂ + rate × (today − days₂)
```

**Per meter, independently.** Mileage and engine hours each get their own rate. A new mileage reading moves nothing measured from hours.

⚠ **Unspecified:** what happens when the two most recent readings are on the **same day**; when the delta is **negative** (`R-32` allows a lower reading); when they are years apart; whether a corrected reading is excluded from the pair.

### 2b. No rate is invented `R-27.1`

**73.3% of units never produce a usable reading pair.** Nothing is borrowed or guessed for them:

- **No rate from another unit.** Not by customer, not by make, not by model. Measured on production and rejected: **82.4% of units sit at customers whose own units disagree by more than 50%.**
- **No rate entered at enrolment.** The expected-running-rate control and its four running types were tested against production and **dropped** (revised 16 Sep 2026).
- A unit with no usable pair reads **`No data`** for that meter, **the calendar governs**, and no date is offered for the meter.

## 3. Confidence `R-27` — three levels

**Revised 16 September 2026.** Three levels, grading **the meter**:

| Level | Colour | Meaning | ⚠ threshold |
|---|---|---|---|
| `Low` | orange | a measured rate that is thin or stale | not set — `OQ-10` |
| `Medium` | blue | a measured rate, middling in visits or recency | not set — `OQ-10` |
| `High` | green | a measured rate from several recent visits | not set — `OQ-10` |

**`No data` is not a fourth level.** It is a **separate state**, for a unit with nothing to estimate from: the calendar governs, no date is offered for the meter, and the row says the meter has no basis yet. **It is the ordinary case, not an error** — 73.3% of units.

**They are deliberately not the words used for a reading's own state.** `recorded` and `estimated` stay reserved for readings. A **recorded** reading carries **no grade at all**: a fact needs no grading.

**Engine hours get the same treatment as mileage.**

`[p1]` draws all three levels, plus `No data`, plus the recorded case with no grade.

⚠ **`OQ-10` is still the highest-risk unknown.** The levels are settled; the boundaries are not, and the boards render a grade in five places.

### 3b. Provenance carries the source · `R-28`

Every projected value names **where the rate came from**, not only which meter it used:

```
≈ 346,050 mileage · measured from 4 visits · last read 6 days ago
```

**No new state, no new chip.** Origin goes in the line, exactly as `stated` and `national average` were handled elsewhere in the product.

## 4. Resolving a due point

### Precision · `R-27.2`

**An exact date belongs to a recorded reading alone. Everything computed shows a month.** A projected due date reads `Sep 2026`, never `15 Sep 2026`, so the design never claims a day the arithmetic cannot support. A user-set snooze date stays exact.

### Per trigger

| Trigger | `every` | `at` |
|---|---|---|
| Calendar | last completion + N months | the next occurrence of month M, never rebased |
| Mileage | last completion's reading + N | the fixed meter value N, fires once |
| Engine hours | last completion's reading + N | the fixed meter value N, fires once |

A meter-based due point is converted to a **date** by projecting through the rate (§2). That date **moves as readings come in** — which is why provenance is mandatory.

### Whichever comes first `R-07`

Where a service carries more than one interval, the due point is the **earliest** of the resolved dates. The UI states this once, in one grey line. The deciding trigger is what provenance names.

### Compliance `R-16` — 🚫 blocked on `OQ-09`

Runs on the **certificate term**, not a meter. The design assumes the due date is **the last day of the expiry month**. Described by Chris Ward, **not confirmed by the shop side**. Implement behind a single function.

**A compliance service with no record cannot come due** — excluded from every count and total.

**`Start reminders`** (`R-15`) derives from the term: one month before a 12-month certificate, one month before a 6-month one. Editable, months only, 1–4.

---

## 5. Status `R-36`–`R-39`

Derived on read, **never stored**.

| Status | Condition |
|---|---|
| *(no badge)* | due date exists, first reminder not yet reached |
| `Upcoming` | first reminder reached (e.g. 14 days before) |
| `Due today` | the due date is today |
| `Overdue` | the due date has passed |

- **A missed service appears once**, however many cycles have passed (`R-38`).
- **Snooze moves the due date and nothing else** (`R-39`). Not a status, no reason recorded, interval and history untouched.
- `Active` and `Paused` **do not exist**.

---

## 6. Completion `R-42`

Completing **resets the recurring interval; tracking restarts from that point** — a full interval from the completion date and readings. Readings left empty (the "completed elsewhere" branch) → the next due point is measured from the date alone.

**Supersession:** a larger service absorbs a smaller one when they land together — PM-B absorbs PM-A, so one visit clears both. Compliance inspections **absorb nothing and are absorbed by nothing** (`R-02`). Boards `[w3]` `[v1]`.

⚠ **Unspecified:** the exact supersession rule. Is it interval size, ladder position, or an explicit "absorbs" relation on the service? The canvas shows the effect, not the rule.

---

## 7. The recalculation cascade

One reading fans out. This is the highest-risk path in the build.

```
  a Reading is saved                                          (R-25)
        │
        ├─▶ rate recomputed from the two most recent readings  (R-26)
        ├─▶ confidence re-evaluated for that meter             (R-27)
        └─▶ for every ServiceState measured from that meter:
                dueReading / dueDate re-resolved
                    ├─ more than one interval? earliest wins   (R-07)
                    ├─ status re-derived                       (R-36)
                    └─ provenance line re-rendered             (R-28)
                          │
        ┌─────────────────┼─────────────────┬──────────────────┐
        ▼                 ▼                 ▼                  ▼
  Asset header      Asset list        Worklist            WO card
  both meters       dates, status,    rows, tile counts,  count on the tag,
  estimate, rate    provenance        DOLLAR TOTALS,      "due today ·
  confidence bar                      sort order          odometer updated"
                                          │
                                          ▼
                                    Email queue —
                                    which rows land in
                                    which state's email
```

**Nothing waits for a job.** The daily job only queues the email chunk (`OQ-03`).

**One thing does wait: invoicing.** A service completed on a work order does not reset until that work order is invoiced (`R-42`), so the reset is triggered by an invoice event, not by the completion. That is a second entry point into the cascade and it is easy to miss.

⚠ **Unspecified:** whether the cascade is synchronous with the save (the user waits) or optimistic (UI updates, server reconciles). With no loading states drawn anywhere, this has not been decided. See `00-overview.md` gap 00.2.

---

## 8. Worked fixture — use this as the test case

Asset `402`. Mileage recorded **342,417 mileage** on 29 Aug 2026 (WO S3780-15211). Previous reading gives a rate of **640 a week**. Today is 9 Sep 2026.

| Claim | Expected |
|---|---|
| Estimate today | `≈ 346,050 mileage · measured from 4 visits · last read 6 days ago` · `High` |
| `PM-A`, `every 15,000`, last completed 18 Jun 2026 | due at 346,000 → **Sep 2026**, "Based on mileage" |

**Then enter `346,900`:**

| Claim | Expected |
|---|---|
| Rate | becomes **710 a week** |
| `PM-A` | becomes due **today** (from 15 Sep) |
| `PM-D` | overdue by **4,500 mileage** (from 1,400) |
| Engine hours | **unchanged** — nothing measured from them moves |

Reproduce this exactly, including the deltas. It is `V-35` in the PRD.

---

## 9. Gaps in this chunk

| # | Gap | Severity |
|---|---|---|
| 4.1 | **`OQ-10` — the confidence matrix is unfinished.** It gates what the UI may claim, and the UI already claims it. | **high, blocking** |
| 4.2 | **`OQ-09` — is the compliance due date the last day of the expiry month?** Every compliance date depends on it. | **high, blocking** |
| 4.3 | **The bundling window has no length** (`OQ-21`), and `R-42.1` does not say whether "highest due" means largest interval or furthest ladder position. | **high** |
| 4.4 | **Rate edge cases:** two readings on the same day, a negative delta, readings years apart, whether a corrected reading counts | **high** |
| 4.5 | **Synchronous or optimistic cascade?** Undecided, and no loading state exists either way. | **high** |
| 4.6 | Timezone for "today" — shop-local, org-level, or UTC? A due-today row is a date comparison. | **high** |
| 4.7 | Whether confidence decays continuously or steps at 90 days | medium |
| 4.8 | What the estimate shows for an asset with **one** reading and a known interval — nothing, or the interval alone? | medium |
| 4.9 | Rounding: dates from a projected meter value, and the meter value itself | medium |
| 4.10 | Whether the rate is capped. A 400,000 jump from a typo produces an enormous rate, and `R-30` forbids refusing it. | **high** |
| 4.11 | **The `Comes due` cell shows every candidate and marks the earliest** (`[p4]`). Nothing states how many candidates a cell may show before it stops. | medium |
| 4.12 | **The pricing behind the tile figures** is unstated — priced from the canned lines, or from something else? | medium |
| 4.13 | **Invoicing is now both a reset trigger (`R-42`) and a recording trigger (`R-33.1`).** No rule states the order, or what happens if the work order is voided rather than invoiced. | **high** |
| 4.14 | `Low` covers two unlike cases: a rate measured from few visits, and one whose last reading has aged. Whether the UI must distinguish them is unstated. | medium |

---

## 10. Questions to test the spec

1. An asset has exactly two readings, taken on the **same day**, with different values. What is the rate?
2. A technician types 3,462,417 instead of 342,417 and saves. `R-30` forbids refusal. What does the asset panel show, and what does the customer email say?
3. A service has a 12-month calendar interval and a 15,000 mileage interval. The asset has **one** recorded reading. What status, what date, what provenance?
4. A reading is corrected three days later. Which two readings form the rate?
5. It is 23:30 in Calgary and 01:30 in Toronto. Which assets are `Due today`?
6. PM-A (15,000), PM-B (30,000) and PM-D (90,000) all land within 500 miles of each other. How many rows, and which absorbs which?
7. An asset's last reading is 200 days old. It has six readings. What does the header show, what does the worklist show, and what does the email say?
8. A unit has one reading. What does its meter card read, what does each due cell read, and what does the worklist bucket say?
9. PM-A and PM-B are due 4 days apart and the bundling window is 7 days. One is on Highway Tractor PM, the other on a customer-specific schedule. Bundled or not?
10. A service is completed on a work order that is voided before invoicing. When does the interval reset, and what is the last recorded reading?
11. A work order is invoiced. Does the reading get recorded before or after the interval resets, and does the order change the next due point?

### 25 Sep corrections
- No money in the maintenance panel, hover/tap card or add confirmation: rows read "4 lines · 2.1 hours". Parts keep part numbers only.
- Engine hours written "hours" in full (panel rows, W8 6,388 hours, V5 500 hours, line search).
- V4 panel: "PM-A · Overdue".
- W13: compliance due shows month and year only ("Due Sep 2026").
- V8: PM-A appears as its four canned lines (3–6), each Declined.
- W14 Status column uses real work order statuses (Estimate, In progress, Complete).
