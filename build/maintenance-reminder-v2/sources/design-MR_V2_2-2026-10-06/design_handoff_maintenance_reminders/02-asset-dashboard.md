# 02 · Asset level dashboard

**SV-3780 · Maintenance Reminders · review chunk 02 of 6**
**Asset › Maintenance. Where an asset is enrolled, read, and tracked.**
**Aligned to spec v12, 23 Sep 2026.**

| | |
|---|---|
| **Artboards** | 16 |
| **PRD rules in scope** | `R-20`–`R-28`, `R-30`, `R-33`, `R-33.1`, `R-36`–`R-43`, `R-70` |
| **Read with** | `PRD.md` (normative) · `00-overview.md` (vocabulary, entry points, permissions) |

> Where this file and `PRD.md` disagree, the PRD wins. Gaps at the end of each section are **not** decisions — they are states the design does not cover.

---

## 1. The panel `[s4]`

**Readings live in the asset header**, where the mileage already does. **There is no `Readings` section title** — it is obvious what is being looked at — and each card title matches the title of the table below it. Engine hours are added beside it. **The duplicate mileage and engine hours at the top right of the asset header are removed (v12)** — the cards are the one place. Each meter card shows `Last recorded` (value, date, source work order) and `Current estimate` (`Estimated` badge, rate, **source**, and a three-segment confidence bar).

**Confidence is three levels grading the meter:** `Low` orange, `Medium` blue, `High` green. They are **not** the reading's own state — `recorded` and `estimated` stay reserved for that. **`No data` is a separate state, not a fourth level:** with nothing to estimate from the calendar governs and no date is offered for the meter.

`[p1]` draws all three levels side by side, plus a recorded reading, which carries **no grade** at all — there is nothing to grade when the value is a fact.

**Every estimate names its source**, not just its rule:

```
346,050 mileage · measured from 4 visits · last read 6 days ago
```

**A rate never names a unit:** `640 a week`, not `640 mileage a week`. And **an exact date belongs to a recorded reading alone** — every projected due date shows a month.

**One flat list for the whole asset**, ordered by what comes due first. **Schedule is a column, not a heading** — two schedules never split the order.

Columns: `Service` (with its status badge) · `Schedule` · `Interval` · `Due` · `⋮`. **No status column (v12)** — a column would read as the work-order status family.

### Status is exactly three

`Overdue` · `Due today` · `Due soon`, as a **badge beside the service**. `Upcoming` is gone (v12). **`Active` and `Paused` do not exist** (`R-36`).

`Due soon` **begins at the first reminder**, e.g. 14 days before due — not at enrolment. Before that point a service carries **a date and no badge** (`R-37`).

```
              ┌──────── no badge ────────┐
  enrolled ──▶│ date exists, first        │
              │ reminder not reached      │
              └────────────┬─────────────┘
                           ▼
                     ╔═══════════╗
                     ║ Due soon  ║
                     ╚═════╤═════╝
                           ▼
                     ╔═══════════╗
                     ║ Due today ║
                     ╚═════╤═════╝
                           ▼
                     ╔═══════════╗
                     ║  Overdue  ║  one row however many
                     ╚═════╤═════╝  cycles pass  (R-38)
                           │
    Mark complete ─────────┤───────── Snooze
    resets the interval    │          moves dueDate only,
    (R-42)                 │          no status, no reason (R-39)
                           ▼
                  back to no badge / Due soon
```

**Status is derived on read, never stored.**

### Every due date names its rule

`Based on mileage estimate` · `Based on engine hours estimate` · `Based on the certificate term` · `Based on the calendar` (`R-28`, P0).

**An overdue row never shows a number (v12).** No `overdue by 1,400 mileage`, no `one cycle missed`. Confidence stays on the meter card at the top; it is not repeated per row or moved into the column header. The reader sees `estimate` and looks up.

**A date known only to the month shows a month** (`R-36.1`). Compliance and term-based rows print `Aug 2026`, not `31 Aug 2026`; `Due today` holds for the whole month.

### Controls

| Control | Result |
|---|---|
| `Enter a reading` | `··▶` §3 |
| `Enroll in a schedule` | `··▶` §2 |
| row `⋮` | `··▶` `[m1]` |
| schedule header `⋮` | `Pause` · divider · `Remove` |

### Row menu `[m1]` — three actions and no more

| Row kind | Menu |
|---|---|
| Routine | `Mark complete` · `Snooze` · `Create estimate` |
| Compliance | `Mark complete` · `Create estimate` — **Snooze absent, not disabled** (`R-03`) |
| Schedule header | `Pause` · divider · `Remove` |

`Ignore` and `Pause` are **not** row actions. `View recent work history` and `Activity` are the Work Orders tab's job.

**Removing a schedule and adding another keeps every cycle:** the new schedule's services anchor from the last completion of a matching service where one exists, otherwise from now.

**Other states:** `[m4]` asset on no schedule.

---

## 2. Enrolment `[x1]`

**The only way in.** No bulk path from the schedule side (`OOS-06`).

**Order of fields:** schedule → **both current readings** → **expected running rate** → **one optional last-service date per service**.

### What it no longer collects

**Removed 16 September 2026** (`R-20`):

| Removed | Why |
|---|---|
| Both current-reading fields | The asset header and the work order carry them already. Collecting them here raises the question of whether that counts as a new recorded reading, and it should not arise. |
| The live `Comes due` column | The advisor does not need the arithmetic while filling the form; the asset page does it immediately afterwards. |
| The expected running rate and its running-type control | It belonged to an idea that was tested against production and dropped. |

### What it gains

**`Not enough data`, per meter** (`R-23`). Where a service watches a meter the asset has no reading for, its row carries the badge — **mileage and engine hours separately**, so one badge never speaks for the other. Reuses the existing badge.

**The customer's notification consent** (`R-70`): a **plain checkbox with an info tooltip** (v12). It writes the customer's own setting; the tooltip carries the rule. No highlighted row, no customer-setting tag, no warning line.

| State | Board |
|---|---|
| Populated, consent on | `[x1]` |
| **No readings, consent off** | `[x1r]` |
| **Bulk, from a customer's asset list** | `[x4]` |

### Bulk enrol `[x4]` · NEW `R-24.1`

Reached from **a customer's own asset list**. It is **a selection of which units go on which schedule**, not an enrol-the-whole-fleet action, because a fleet holds different kinds of unit.

- **One schedule per pass.** Tractors and trailers are enrolled separately.
- Units already on another schedule are **shown and not selectable**.
- Last-service dates are set **per unit afterwards**, on each unit's own Maintenance tab.

One date for the whole asset is wrong: brakes done last week and an oil service long overdue cannot be described by a single date (`R-21`).

- A blank last-service date means **counting starts today** (`R-22`).
- A live `Comes due` column resolves per service as the advisor types (`R-23`).
- A compliance service shows either its record's number and expiry with the **standard edit icon**, or `Add history record` `··▶` §4 (`R-24`).
- Footer: `Cancel` / `Enroll`. On `Enroll` `◀··` to `[s4]` with rows present.

**Asset search** `[x3]` — unit number, customer unit number, or VIN.

---

## 3. Enter a reading `[n5]`

**One component, two entry points** — the asset and the work order (`R-35`). Not a separate design.

**Layout:** `CURRENT` | `NEW` side by side, top-aligned, equal height (`R-34`). Under the current value: `Last recorded 29 Aug 2026 · WO S3780-15211` — the work order is not a link and truncates before the date ever does; the modal does not widen. No `mileage` or `hours` word beside either value.

**No `WHAT THIS CHANGES` panel (v12).** Enter, save, land on the maintenance tab, which shows every consequence. Button label stays `Enter a reading` (open: `Enter mileage` may be too narrow).

### Recording a reading · NEW `R-33.1`

**Two things count as recording a reading:**

```
  a user changes the mileage on a work order
            │
            ▼
  shows as entered, dated today, marked "In the shop"
            │
  the work order is INVOICED
            │
            ▼
  whatever the mileage reads at that moment becomes
  the new LAST RECORDED READING
```

`[p3]` draws it: the before card at `342,417` `Recorded` `High`, the after card at `346,900` `In the shop`. What moved shows on the maintenance list, not on the card.

### Validation · cut for now `R-30`

**The position stands: nothing about a meter value is refused.** But the screens that dramatised it are **out of the design for now** — `[w10]` (lower reading), `[w11]` (implausible value) and the `Cannot be judged` state (`[w5]` `[w5x]`) are all **deleted**, pending a specification of the validation behaviour.

| State | Board | Status |
|---|---|---|
| Before/after | `[n5]` | drawn |
| Recorded value just moved | `[p3]` | drawn |
| Lower than we hold | — | **cut for now** |
| Implausible value | — | **cut for now** |
| Undo toast | — | `‹undrawn›` — and it is **P0** |
| Correcting a saved reading | — | `‹undrawn›` |

**On save the cascade runs immediately**, not on an overnight job. The one moment the truck is physically present is now. Full cascade in chunk 4.

---

## 4. The compliance record `[k4]`

**One form, three entry points** (`R-19`): `Add history record` in enrolment, the same on the asset's compliance service, `+ Add certificate` on the work order. Not three forms. Titled **`Add history record`** — *history* makes plain the user is entering something from the past.

Fields: `Type` (type-ahead) · `Term` · `Effective date` · **`Expiry date`** — the same calendar picker as the effective date; for a certificate that expires within a month, pick the last day of that month · type-labelled number `(optional)` · attachment `(optional)`. No sentence explaining optional.

Field widths follow **one scale**: half or full, nothing between.

Where a record exists, the surface shows the record and the **standard edit icon**, not a labelled button (`R-19.3`).

⚠ **The due date rule is `OQ-09`** — the design assumes **the last day of the expiry month**. Implement behind one function.

**The term is mandatory, so the date always resolves** (`R-16.1`, revised 16 Sep). There is no state where a compliance service has no term, so `No record` in a `Comes due` cell is wrong. The cell shows what the term produces and the missing certificate is noted **on the row**:

```
Sep 2027
Based on the 12-month term · no certificate on file
```

---

## 5. Certificates tab — descoped (v12)

**Not built.** `[cert1]` and `[cert2]` are deleted. The asset carries many tabs and is about to gain digital inspections and maintenance; a third that most shops will not open is not worth the crowding. Records stay reachable from the compliance service that owns them. A better home for the list comes later.

`[k2]` stays: a compliance service whose record is missing, headed by the service, with `Add history record`.

---

## 6. Mark complete and Snooze

**Mark complete — two branches** (`R-41`):

| Branch | Board | Collects |
|---|---|---|
| On a work order | `[m2]` | Dropdown or search over work orders **from any location** — this is org-level. Date and readings come from the work order. |
| Completed elsewhere | `[m2e]` | Date + location, kept. **Readings optional** — nobody remembers the engine hours from two weeks ago. |

**The two branches reset on different dates** (`R-42`):

| Branch | Resets from | Until then |
|---|---|---|
| On a work order | that work order's **invoice date** | the row keeps its old due point |
| Completed elsewhere | the **date entered**, immediately | — |

A work order can be completed days before it is invoiced, and the invoice date is what the rest of the application treats as the transaction. **There is no distinct status for the interval between** — the row simply keeps its old due point. Readings left empty → the next due point is measured from the date alone.

**Snooze `[m5]`** — moves the due date and **nothing else**. Not a status, no reason recorded, interval and history untouched. Like putting off an alarm. `[n6]` documents the rules. **Absent on compliance rows** — a deadline set by an agency is exactly the thing that cannot be deferred.

---

## 7. Transitions

| From | Trigger | Kind | To |
|---|---|---|---|
| `[s4]` | Enroll in a schedule | M | `[x1]` |
| `[x1]` `[x1r]` | Add history record / edit icon | M | `[k4]` → back into the modal |
| `[s4]` | Enter a reading | M | `[n5]` |
| `[s4]` | row ⋮ | M | `[m1]` |
| `[m1]` | Mark complete | M | `[m2]` / `[m2e]` |
| `[m1]` | Snooze | M | `[m5]` |
| `[m1]` | Create estimate | N | an estimate — leaves the feature |
| `[k2]` | Add history record | M | `[k4]` |
| `[s4]` | back arrow | N | the customer record `[x2]` |

---

## 7a. Coming in chunk four — not designed here

At invoice, where a work order completed maintenance services, the user sees the dates those services reset to and can adjust them before continuing. Nothing on the asset tab is drawn as though the reset happens silently.

## 8. Gaps in this chunk

| # | Gap | Severity |
|---|---|---|
| 2.1 | **The validation screens are cut, and nothing replaces them.** `R-30` still forbids refusal, but with `[w10]` and `[w11]` deleted no board shows what an implausible or lower value does. | **high** |
| 2.2 | **The undo toast and later correction are P0 and undrawn** (`R-33`) | **high** |
| 2.3 | **`Pause` sits on the schedule header menu but `Paused` was removed as a status.** What does a paused row render as? | **high** |
| 2.4 | **Re-enrolling on the same schedule** — blocked, ignored, or duplicated? | **high** |
| 2.5 | **Two schedules carrying a same-named service** — one row or two? What happens when one is completed? | **high** |
| 2.6 | **`Comes due` shows every candidate and marks the earliest** on `[p4]`, but `[s4]`'s own rows still show one line each. The two need to agree. | **high** |
| 2.7 | **A work order completed but never invoiced.** With no status for it, the row is indistinguishable from one that was never completed. Sharper now that `R-33.1` makes invoicing a recording event too. | **high** |
| 2.8 | **Consent is display-only in enrolment** (`R-70`) but nothing states what happens if it is switched off mid-enrolment by someone else | medium |
| 2.9 | Asset on a schedule **archived afterwards**; asset whose service was **removed afterwards** | medium |
| 2.10 | A last-service date typed **in the future** | medium |
| 2.11 | Snoozing **past the next cycle's** due point | medium |
| 2.12 | Marking complete with a date **earlier than the last completion** | medium |
| 2.13 | An asset with 40+ tracked services — does the list paginate? | low |
| 2.14 | No permission state for entering a reading | medium |
| 2.15 | **Bulk enrol has no result state** (`[x4]`) — what the advisor sees after enrolling 3 units | medium |

## 9. Questions to test the spec

1. A reading is saved, then the advisor marks the same service complete on a work order dated **before** that reading. What is the next due point?
2. A service has a 12-month calendar interval **and** a 15,000 mileage interval. The asset has exactly **one** recorded reading. What status and date does the row show?
3. Two advisors open the same asset. One enters 346,900; the other enters 344,000 thirty seconds later. What is the rate, and what does each see?
7. A unit is enrolled with no readings at all. What does every row's date read, and what does the meter card show?
8. A service is completed on a work order that is then voided before invoicing. What does the row show, and what is the last recorded reading?
9. A work order's mileage is edited three times before invoicing. How many readings exist afterwards?
10. A service has all three triggers. What does its `Comes due` cell show on `[s4]`, and does it match `[p4]`?
4. An asset is enrolled on two schedules both carrying `Annual inspection`. How many rows? What happens when one is completed?
5. A compliance record's expiry month passes with no new record. What is the row's status, and can it be snoozed?
6. A schedule is archived while this asset is enrolled. What does the panel show tomorrow?


## Spec v15 alignment (24 Sep)

- **No Pause.** Schedule header menu has `Remove` only (`M1`). A shop archives the schedule or unenrols the unit.
- **Due cell holds one line** (`S4`): the earliest candidate's date and the trigger that produced it (`Aug 2026 · Based on mileage estimate`). The other candidates are never going to happen (the service resets when the earliest fires), so they are collapsed behind the row menu → `Other triggers` (`P4`), never printed on the row. The Interval column already names everything watched.
- **`Soon` is future only.** At low confidence a date still ahead reads `Soon` with its reason beneath. Once due or overdue, the badge carries it and the cell names the trigger alone: `TIRES [Due today] Based on engine hours estimate`. Confidence changes how the date renders, never which trigger wins.
- **Mark complete (`M2`) has no "what this changes" panel.** The reset date is set at invoice (`When was the maintenance done?`, page 4), counted from when the work finished, invoice date only as fallback.
- **`K4`: two entry points** — enrolment record row and the work order.
- **`Skip` on the compliance row menu** (`M1`), replacing the "no snooze" note. The escape hatch for an inspection waiting on a date.
- **Button reads `Enter mileage`** (captures engine hours too).
- Kept: `In the shop` reading state and `fixed on invoice`; the confidence cards (numbers unchanged, being reconciled); telematics marked `LATER`.

