# 06 · The work order

**SV-3780 · Maintenance Reminders · review chunk 06 of 6**
**Where the feature turns into revenue. Not in the original review list.**

| | |
|---|---|
| **Artboards** | 26 — the largest band on the canvas |
| **PRD rules in scope** | `R-35`, `R-42`, `R-42.1`, `R-43`, `R-50`–`R-53`, `R-56`, `R-57`, `R-58.1` |
| **Read with** | `PRD.md` (normative) · `00-overview.md` |

> ⚠ **This chunk was not in the brief.** It has more artboards than any other band and it is the only place the feature produces money. Placed last because it depends on chunks 1–4, but it could equally sit after chunk 2. It needs a review slot either way.

---

## 1. The card, collapsed `[w7c]`

✅ **Confirmed: collapsed by default with a tag to expand.** The count carries the signal. **Neutral in tone** — an opportunity, not an alert. The advisor is mid-job; this is not the moment for a red banner.

---

## 2. Expanded states

| State | Board | What it says |
|---|---|---|
| Enrolled, nothing at criteria | `[wo1]` | the asset is tracked, nothing is due |
| One service due | `[y0]` `[w2x]` | one row, inline `+ Add` |
| Several due, **bundling** | `[w3]` | PM-B absorbs PM-A, one visit clears both |
| Compliance due | `[w4]` | `Compliance` tag, `+ Add certificate` if no record |

| On no schedule | `[w6]` | `Enroll` |
| Two schedules | `[w7]` | one row each, schedule as a column |
| Without permission | `[w2p]` | actions **muted**, reason available |

**Every due date is colour-coded and named.** A row made newly due by a fresh reading reads *"Due today · odometer updated 14:20"* — **light emphasis, not an alarm** (`R-51`).

**Reading entry is not offered inside the card.** Readings belong in the header, where the odometer already lives (`[w8]`).

---

## 3. Adding a service

| Control | Result |
|---|---|
| hover a service | `[y1h]` — description, parts, inspection form |
| `+ Add` inline | `··▶` `[y1a]` confirm → `[w2b]` the line and its sublines on the work order |
| `Create a new work order instead` | the second option, kept (`R-52`) |
| `+ Add certificate` | `··▶` `[k4]` — the same form as chunk 2 §4 |

### What the hover must show `R-50`

**Job description, any parts on it, and — if one is attached — which digital inspection form it uses.**

`[y1h]` now draws all three: the job description as prose, the parts with quantities and part numbers, and the named inspection form where one is attached. The hover sits **beside** the row, not over it.

⚠ Still undrawn: what the hover shows when a service has **no** parts and **no** inspection form.

### Every row offers two ways to satisfy it · NEW `R-56`

**A work order can satisfy a maintenance service however it was built** — by adding the service's canned lines, or by someone typing the lines by hand. So every row carries both:

| Action | What it does |
|---|---|
| **`Add`** | brings the service's canned lines onto the work order |
| **`Mark Complete`** | a plain statement by the advisor that the work is on this work order |

Either one marks the row **addressed on this work order**, and the service resets when the work order is **invoiced**, on the same rule as any other completion.

⚠ **Nothing infers a match.** Do **not** draw anything suggesting the system reads line text or recognises a canned line as a preventive-maintenance item. The advisor says so; the system does not guess. Getting clever here is how it breaks. **This closes `OQ-11`.**

### The row is one summary, not a list · NEW `R-57`

Where a service carries more canned lines than fit, the row reads **`4 lines · $412.60 · 2.1 hrs`**. That summary **is the main content of the row**; the individual lines come off.

### Newly due, live · NEW `R-51.1`

When a reading makes something newly due while the card is open, it changes **on the card, in real time** — a pulse or a tone change, **not an alarm**. `[w9]` draws it: an amber-tinted row with a dot beside the name and *"Due today · appeared just now, mileage updated 14:20"*.

### What adding writes `R-43` — P0, ✅ confirmed

Three writes, not one:

1. the **lines** on the work order
2. a **work-order note**
3. an **audit entry**

So someone reading the work order later can trace it back to the schedule it came from. **Required regardless of how `OQ-11` resolves.**

---

## 4. Line shapes — explored, partly undecided

| Board | Shape |
|---|---|
| `[v1]` | the service is one line |
| `[v2]` | four canned lines beneath it |
| `[v3]` | **three nesting treatments, none chosen** ⚠ |
| `[v6]` | three sublines closed, the service still open |
| `[v7]` | two compliance records listed together |
| `[v8]` | declined on the estimate |
| `[v9]` | the worklist, unchanged |
| `[v4]` | line search — **canned lines only**; a maintenance service is never a result (`R-45`) |
| `[v5]` | on work-order creation — what is coming up |

**Compliance stays a tag on the row. Do not recolour the service title** (`R-53`).

### The bundling rule · `R-42.1`, NEW

`[w3]` drew the effect; the rule is now stated:

- Candidates inside a **bundling window** collapse into **one event**, dated on the **earlier**, **showing both reasons**.
- Bundling groups **by unit, not by schedule** — a truck arrives once.
- **Within one schedule** the highest due service **absorbs every lower one.**
- **Across schedules there is no absorption.**
- **A compliance inspection is never absorbed.**

⚠ The window's length is not set (`OQ-21`), and "highest due" is not defined as interval size or ladder position.

---

## 5. Readings from the work order

`[w8]` → `[w9]` the moment after saving · `[w10]` a lower number than we hold · `[w11]` an implausible value.

**One component, both entry points** (`R-35`). Same behaviour as chunk 2 §3 — the validation path, the cascade, all of it.

⛔ **`[w10]` and `[w11]` are deleted**, along with the `Cannot be judged` state. The position stands — nothing about a meter value is refused — but the screens are cut until the validation behaviour is specified (`R-30`, revised 16 Sep).

⭐ **Invoicing records a reading** (`R-33.1`, NEW). Whatever the mileage reads at the moment of invoice becomes the new last recorded reading, so the work order is a recording surface in two ways: the field, and the invoice.

---

## 6. Completion

**The reset waits for the invoice** (`R-42`, revised). A service completed on a work order does not reset its interval until that work order is **invoiced**; until then the asset row keeps its old due point, with **no distinct status** for the interval. This makes invoicing a **second entry point into the recalculation cascade**.

| Board | What it covers |
|---|---|
| `[y3]` | the completion step — what gets marked complete when the work order closes |
| `[y4]` | the Work Orders list with its **Maintenance schedule** column, naming the schedule and linking to it |
| `[y1d]` | **a reminder satisfied by hand-typed lines** — now `Mark Complete` on every row (`R-56`) |

### Origin reporting · `R-58.1`, NEW

A work order created from a due service **carries the origin**. `[y4]` draws the column. What that column exists for: **origin and value are reportable together**, which is how a shop answers whether the feature earned anything. The report itself is not drawn.

`[y1d]` is the mirror of `Mark complete → on a work order`, driven from the work-order side: lines typed by hand satisfy the reminder as they stand, with nothing re-added.

---

## 7. Transitions

| From | Trigger | Kind | To |
|---|---|---|---|
| `[w7c]` | expand | — | `[wo1]` `[y0]` `[w3]` `[w4]` `[w5]` `[w6]` `[w7]` |
| `[w*]` | hover a service | — | `[y1h]` |
| `[w*]` | `+ Add` | M | `[y1a]` → `[w2b]` |
| `[y1a]` | `Create a new work order instead` | N | a new work order ⚠ no board |
| `[w4]` | `+ Add certificate` | M | `[k4]` |
| `[w*]` | `Enter a reading` | M | `[w8]` → `[w9]` |
| `[w6]` | `Enroll` | M | `[x1]` chunk 2 |
| `[w*]` | asset name | N | `[s4]` chunk 2 |
| work order closes | — | — | `[y3]` |

---

## 8. Gaps in this chunk

| # | Gap | Severity |
|---|---|---|
| 6.1 | **The validation screens are cut and nothing replaces them.** No board shows what an implausible or lower value does on the work order. | **high** |
| 6.2 | **The hover has no empty variant.** `R-50` is satisfied for a fully-specified service; a service with no parts and no form has no board. | medium |
| 6.3 | **Line nesting: three treatments drawn, none chosen** (`[v3]`) | **high — undecided** |
| 6.4 | **`OQ-11` is closed** by `R-56`. What remains open: whether the `Mark Complete` statement is itself visible on the work order afterwards, or only in the audit log. | **high** |
| 6.5 | **`Mark Complete` has no confirmation and no undo.** One click marks a service satisfied, and the reset follows at invoice. | **high** |
| 6.6 | `Create a new work order instead` has no destination board | medium |
| 6.7 | Adding a service whose lines are **already on** this work order — duplicate, or dedupe? | **high** |
| 6.8 | A service added, then its **lines deleted** from the work order. Is the reminder still satisfied? `[w2b]` mentions the case, no rule states it. | **high** |
| 6.9 | The work order is **voided** after a service was marked complete against it. Sharper now that the reset waits for the invoice (`R-42`): a voided work order is never invoiced, so the service may never reset, with nothing on the row to say so. | **high** |
| 6.12 | **Nothing anywhere shows that a completion is pending an invoice** — the `Awaiting invoice` status was removed 16 Sep, so neither the asset row nor the work order distinguishes it. | **high** |
| 6.13 | **The origin report is specified but not drawn** (`R-58.1`). Which numbers, at what grain, and where it lives. | medium |
| 6.10 | No permission state for entering a reading from the work order | medium |
| 6.11 | An asset added to a work order that belongs to **another customer** — does the card render? | medium |

---

## 9. Questions to test the spec

1. An advisor adds PM-B to a work order, then deletes all four of its lines. Is PM-B still satisfied when the work order is invoiced?
2. A service's canned lines are already on the work order from a previous line-search. The advisor clicks `+ Add`. What happens?
3. A work order is closed with PM-A marked complete, then voided a day later. What does the asset panel show?
4. PM-A and PM-B are both due and PM-B absorbs PM-A. The advisor adds only PM-A. What is PM-B's status afterwards?
5. A compliance inspection is added and performed, but no certificate number is entered. Does the reminder reset?
6. Two advisors have the same work order open. One adds PM-B; the other adds it thirty seconds later.
7. A technician without work-order edit permission expands the card. What exactly is muted, and what reason do they see?
8. PM-A and PM-B are due 4 days apart, on two different schedules, inside the bundling window. How many rows does the card show, and how many events are created?
9. A work order with three completed services is voided. What do the three asset rows read the next morning, and what is each asset's last recorded reading?
10. An advisor clicks `Mark Complete` by mistake. How do they undo it?
11. A service is both `Add`-ed and marked `Mark Complete`. What happens?

---

## 10. Why this chunk matters most for revenue

Chunks 1–3 tell the shop what is due. **This is the only chunk where that becomes a sold job.** Three of its gaps (6.7, 6.8, 6.9) are about whether a reminder is correctly satisfied — get those wrong and the system either double-sells a service or forgets one was done. Both erode trust in the whole feature faster than any layout problem.


## After invoice · when was the work done `[i1]`–`[i5]`

Agreed in review, 22 Sep 2026. The cycle resets from the day the work was done, and the invoice date is routinely not that day (truck sits after the work, shop invoices late, order left open for a return visit, inspection on 30 Sep invoiced 1 Oct). The system proposes; a person corrects.

- **When:** **after** the invoice is created. `Create Invoice` → invoice created (toast) → `When was the maintenance done?`. Invoicing is never blocked or delayed by this step. **Only** on a work order that completed one or more maintenance services. Otherwise absent `[i4]`.
- **Name:** `When was the maintenance done?`, a question naming the one thing asked and the kind of work it covers, so it cannot be read as the whole work order. Replaces `Work dates`, which did not say whose dates or why.
- **Rows:** one per completed maintenance service: service, schedule, and **Work done**, a past date proposed as the invoice date and editable with the date picker. **No next-due figure is shown** (revised 23 Sep): the step asks only when the work was done; the system derives the next due from it.
- **What is edited:** the date the work was done. Nothing else.
- **Changed date:** the field keeps focus styling and `Invoice date 1 Oct 2026 · Reset` appears under it `[i2]`.
- **Absorbed services:** the absorbing service is the row with the one date; `Also resets: PM-B · PM-A` sits beneath it `[i3]`.
- **Excluded:** compliance inspections (next due comes from the certificate expiry).
- **Actions:** `Save Dates` (primary) and `Keep Invoice Date`. Closing the step keeps the invoice date for every service. The invoice already exists either way.
- **Phone** `[i5]`: bottom sheet, one block per service, `Work done` field full width, `Next due` beneath it, buttons stacked.


## Chunk 4 revision (25 Sep)

**Hard rule: the work order does not change.** No nesting, parent row, indent, progress count or new column. Adding a service appends its canned lines as ordinary lines at the bottom, like a canned job. The Maintenance column and "Added by hand" are gone from every board. The service↔lines link is stored, never shown on the lines table.

1. **After adding** `W2b`: lines 3–6 are PM-A's canned lines as ordinary lines; panel reads "PM-A on this work order · 4 lines". `V1`, `V2`, `V3`, `V6` removed.
2. **Panel rows** (`W1`–`W4`, `W7`, `W9`): one row component — name · due text · "4 lines · $412.60 · 2.1 hrs" (i) · Add · Mark complete. Colour only in the due text: overdue red, due today amber, due soon blue. **Compliance is orange, never red, even overdue** (`W4o`). No tint, no dot, no tag. Absorbed services fold into the absorbing one. A schedule with nothing due shows its next service (`W7b`). The due text carries state and month only (`Overdue · Aug 2026`, `Due today`, `Due Sep 2026`); no distance, hours or basis on the panel. **Add** is a link-style `+ Add`; **Mark complete** stays a secondary button.
3. **Hover** `W2h` kept; **tap** at phone width opens the same card as a sheet (`W2t`).
4. **Mark complete** everywhere. On a work order it only confirms: "Mark CVIP complete on this work order? The date is set when the work order is invoiced." (`W13`). After: "Marked complete on this work order · Undo", available while the work order is open (`W13b`).
5. **Reading** `W8`: no "What this changes"; 4 visits · 34 days is **Medium**.
6. **Creation** `V5`: due/overdue ticked, later unticked; PM-A "Overdue · Sep 2026"; month for estimates, exact date where precise.
7. **Completing the work order** shows no maintenance step. `V7`, `W12` removed.
8. **After the invoice** `I1`–`I3`, `I5`: proposed date = when that service's lines were all closed; under it "Lines closed 4 Sep · Use invoice date (1 Oct)". Each service has a checkbox, ticked, with its reason ("Lines added from PM-A" / "Marked complete on this work order"); unticked = no reset; deleted lines stay ticked. One primary **Confirm dates**; closing accepts every date. Absorbed: "Also resets: PM-B · PM-A".
9. **Compliance certificates** in the same step (`I6`, phone `I7`): compliance services are not in the date list. Per record: Type · Number · Effective · Expiry · Term; any two fill the third; at least one date; "Add another certificate"; optional.
10. **Enroll** `W6` opens the existing enrollment modal with the asset filled in.

Kept: `W7c`, `W2a`, `V8`, `I4`. Held for chunk 5: `W14`.

- **25 Sep:** units are written **mileage** in full, never "mi".
