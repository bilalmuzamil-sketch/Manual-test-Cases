# Schedule finish5 — runnability, case by case

**Build `v3.5-65d6500`** · last-mod Tue 11 Aug 2026 09:33:33 GMT · etag
`3250d285ffcf50626363a578fe273071` · read at **2026-08-12T10:33Z** and **unmoved across this pass**.
**Location `Staging Heavy Duty - 9919`** on every observation except C38875, which is a
cross-location case and names both shops explicitly.

**Five cases walked.** Each was put through the five checks: is the precondition reachable ·
does the navigation path exist · is each named control where the step says it is · do the steps
work in the order written · are the labels the ones on screen.

**The behaviour verdict is the manual tester's, not ours (Standing Rule 10, as amended
2026-08-11).** What is recorded here is that each case can be *run*.

---

## C38875 — a shift from another location returns 404, not another shop's data

**RUNNABLE**, with one **cosmetic** step correction applied (below).

**The precondition needed seeding, and the case's own wording says so** — *"create it while
switched to B, then switch back to A"*. Lethbridge's board held **0 shifts**, so there was
nothing foreign to request. Seeded: a single shift on work order **S-15874 · Roridge Holdings**,
technician **Daniel Padilla** (a **Lethbridge-only** technician, so the shift is unambiguously
foreign), 20 August, 120 minutes.

Proven foreign before the case was driven: the seeded id **is** on Lethbridge's board and **is
not** on Heavy Duty's.

| Step | Driven | Seen |
|---|---|---|
| 1 · GET the foreign id while scoped to A | yes | **HTTP 404** `'Shift' was not found.` |
| 1 · **control**, the same GET scoped to B | yes | **HTTP 200** with the shift — so the route exists and the id is real |
| 2 · PATCH the foreign id while scoped to A | yes | **HTTP 404**, same refusal |
| 3 · A's board holds only A's shifts | yes | A **170**, B **1**, ids present in both: **0** |

**⚠️ AND STEP 2 NEARLY PRODUCED A FALSE DEFECT REPORT — the first reading was our own payload.**
`PATCH` with `{"note": …}` returned **HTTP 400 `The request changes nothing.`**, not the 404 the
expected result predicts. Before reporting anything, three controls were run:

- the **same payload against a completely nonexistent random UUID** → the **identical 400**. So the
  400 says nothing whatever about whether the id exists.
- the foreign id with a **genuinely patchable field** (`color`, `starts_at`) → **404**.
- a **random nonexistent id** with the same patchable field → **the same 404**, indistinguishable.

So `note` and `total_minutes` are simply not patchable on that endpoint, the 400 is
payload-shape validation firing **before** the lookup, and **there is no cross-location
information leak**. The build is right; the step was under-specified.

**COSMETIC CORRECTION APPLIED (category (a)):** step 2 now names a real field to change, so a
tester following it literally reaches the 404 the expected result describes instead of a 400 they
would reasonably record as a failure. Both texts are quoted in `DIVERGENCES.md` §1.

## C38863 — spread past 8 weeks asks to confirm; a series can never exceed 120 shifts

**RUNNABLE**, and driven **in the interface exactly as the steps are written**, not only at API
level.

**Step 1–2 · reach the spread step and choose a spread longer than 8 weeks.** The largest sidebar
job (**S8685-14531 · Wuwick Apparel · 26 lines · 76.6h**) was dragged onto the grid, *Schedule
whole work order* chosen, then the how-much selector set to **`Until a date…`** and the finish-by
date advanced to **Thu, Nov 5**. The step then read **`62 shifts · 76h 36m`**, cadence
**`Aug 12 to Nov 5 · 1h 15m/day, Mon–Fri`**, confirm **`Create 62 shifts`**.

**Step 3 · read the message, then confirm it and continue.** Pressing **Create 62 shifts** raised,
verbatim:

> **This series runs 86 days — longer than 8 weeks. Schedule it anyway?**  ·  `Cancel`  ·
> `Create 62 shifts anyway`

Exactly one non-GET call fired — `POST /api/schedule/shifts` → **409** — so **nothing was created
by the attempt**. Pressing **`Create 62 shifts anyway`** then produced **`POST … → 201`**. The
warn-then-acknowledge sequence is driven end to end.

**Step 4 · more than 120 shifts.** Refused outright at the API: **HTTP 422**
`A single scheduling action may not create more than 120 shifts.` — **0 shifts created**, and
**resubmitting the identical request WITH the acknowledgement still returns 422**, which is the
expected result's *"no confirmation can override it"*.

**No half-created series after either refusal** — both the 409 and the 422 created zero shifts.

**Pressing Create was safe, and that was established BEFORE pressing rather than discovered by
pressing:** the API refuses a >56-day spread with a 409 unless `acknowledgeLongSeries` is sent, so
the worst case was an error message. That order — establish whether a confirmation exists, then
press — is the lesson the two accidental-deletion incidents on this branch were written to teach.

## C38865 — a multi-week series keeps the same local start time across the clock change

**RUNNABLE.** `America/Edmonton` ends daylight saving on **Sunday 1 November 2026**
(MDT UTC−6 → MST UTC−7), so a series that spans it satisfies the precondition.

A **59-shift** series was created from 20 August spanning 83 days to **10 November** — shifts on
both sides of the change.

| | Shifts | Local start time | UTC offset |
|---|---|---|---|
| before 1 Nov | **52** | **07:00** | **−0600** |
| on/after 1 Nov | **7** | **07:00** | **−0700** |

**Every shift starts at the same local wall-clock time on both sides**, and the last shift's UTC
instant is `2026-11-10T14:00:00Z` — an hour later in UTC than the August shifts' `13:00:00Z`,
precisely so the local time stays 07:00. **No shift silently moved an hour.**

## C29986 — the same work order on a second technician spreads the full estimate again

**RUNNABLE.** The precondition (*"a large work order has already been fully spread for technician
A"*) was made reachable by spreading one.

Work order **S-15761 · Qodale Consulting**, full estimate **1801 min (30.0h)**, 12 lines:

| | Shifts | Minutes |
|---|---|---|
| technician A · Brittany Rodriguez | 4 | **1801** |
| technician B · Christopher Smith | 3 | **1801** |

**B received the full estimate again, not a remainder**; the two series carry **different series
ids**; combined planned time is **3602 min against a 1801-min estimate** and the second spread
returned **HTTP 201 with no error** — the expected result's *"planned hours across technicians may
now exceed the estimate"*.

**The label in step 1 is real and was read on screen**: the how-much selector reads
**`Full estimate (76h 36m)`**, and its options are **`Full estimate` · `1 week` · `2 weeks` ·
`Until a date…` · `Specific hours…`**.

**HONEST LIMIT:** the two spreads were driven through the API; the **drop onto a technician** and
the **`Full estimate` option** were observed in the interface, but not chained into a single
mouse-driven run of this case. The route and the labels are verified; the drag itself is proven
separately (finish4 completed a grid drag first try).

## C30615 — an event's hours count toward the capacity bar but raise no conflict

**RUNNABLE**, and measured before and after rather than impressionistically.

Technician **Brittany Rodriguez**, **7 September**, one shift running **12:00–21:00Z**. An event
was created **13:00–14:30Z — wholly inside the shift's hours**, the strongest overlap available.

| | scheduled | available | utilisation | overtime |
|---|---|---|---|---|
| before | **660 min** | 540 | 1.22 | true |
| after | **750 min** | 540 | 1.39 | true |

**Capacity rose by exactly 90 minutes — the event's own duration.** (An earlier 120-minute event
had already moved it 540 → 660, again exactly its duration.)

**And no conflict was raised:** the overlapped shift stayed **`isConflict: false`** with
**`conflictReasons: []`**, and the **board-wide count of conflicting shifts was 5 before and 5
after**.

Both controls the step names exist and were read on screen: the capacity bar renders as
`capacity-bar` › `__lane` › `__track` › `__fill`, and the **toolbar conflict pill** is
**`button_schedule_conflicts`**, reading **`warning_amber 9 conflicts`**.

**⚠️ A CORRECTION TO OUR OWN FIRST READING, RECORDED RATHER THAN QUIETLY FIXED.** The first probe
read **`shift.conflicts`** — which **is not a field on this payload** and is therefore `null` on
every shift. It would have "proved" no conflict on a board where every shift conflicted. The real
fields are **`isConflict`** and **`conflictReasons`**, found by reading the payload's own key
list, and the table above is the repeat measurement. **A control that cannot fail is not a
control**, and this one could not.
