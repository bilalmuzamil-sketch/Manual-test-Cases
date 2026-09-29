# 05 · Auto email

**SV-3780 · Maintenance Reminders · review chunk 05 of 6**
**One email, hardcoded. Ships a week behind the rest. Consent is `07-consent.md`.**

| | |
|---|---|
| **Artboards** | 4 emails · consent moved to `07-consent.md` |
| **PRD rules in scope** | `R-59`–`R-61`, `R-64`–`R-67`, `R-70` |
| **Read with** | `PRD.md` (normative) · `00-overview.md` (vocabulary, entry points, permissions) |

> ⛔ **Rewritten 16 September 2026.** Three shop-worded emails became **one hardcoded email**, and the entire Reminder settings screen is deleted. If you have read an earlier version of this chunk, discard it.

---

## 0. Why one email

**A unit can be upcoming, due today and past due at the same moment.** With three emails an owner opens three messages to find out about one truck.

That is the whole argument, and it is worth carrying, because the three-email design will otherwise be re-proposed.

---

## 1. The email `[r1]` `[r1p]` `[r1t]` `[r1u]`

Four artboards, rendered as they would look in a mail client, so they can be built. Same subject, same opening line, same closing, same footer in all four — only the table rows differ.

| Board | Case | Proves |
|---|---|---|
| `[r1]` | mixed: past due, due today, coming up, plus one `Soon` | the states coexist in one table |
| `[r1p]` | one unit, all past due | one row needs no singular wording |
| `[r1t]` | one unit, due today | the heading never names the state |
| `[r1u]` | six units, all coming up | many rows read the same as one |

| Part | Content |
|---|---|
| Subject | `Preventive maintenance coming up` |
| Header | shop logo, name, phone |
| Greeting | `Hi {customer},` |
| Opening line | *You have some preventive maintenance we want to remind you about.* |
| Table | one row per service: **unit · service · due**, with **its state on the row** |
| Closing | *Give us a call and we will find a time that suits your schedule.* |
| Sign-off | shop name and phone |
| Footer | why the customer received it, **and nothing else** |

### The rules that shape it

- **One consolidated email per customer** (`R-59`). A 50-unit fleet gets **one** email. ✅ Confirmed.
- **The wording is fixed and identical for every shop** (`R-65`). Nothing is editable, which is why there is no settings screen.
- **The opening line holds for any mix** (`R-67`), so it **never needs a singular and a plural version**. One row or forty, all past due or all upcoming: the same sentence works — `[r1p]` `[r1t]` `[r1u]` are the evidence.
- **The state sits on the row**, not in the heading and not in the subject. `Past due` · `Due today` · `Coming up`.
- **Only what is reasonably near** (`R-61`). Nothing due eleven months out.
- Low confidence renders **`Soon`**, not a date. A unit with `No data` never gets a date it would be held to.
- **No unsubscribe link** (`R-64`). Honouring one properly is consent management, which is its own feature.
- Sending uses the **same mechanism as work-order email**, so the reply address is the one customers already write to.

---

## 2. Deleted

The whole settings side. Boards `[r1]` (old overview) `[r2]` `[r1e]` `[r3p]` `[r4]` `[r5]` `[r5b]` `[r6]` are **gone**, and with them:

| Gone | Why |
|---|---|
| Three emails, one per state | One unit can be in all three states at once |
| The wording editor, per email | Nothing is editable |
| `Default` / `Edited` states, `Reset to default` | Nothing to reset |
| Per-email on/off toggles | Nothing to toggle |
| `Send a test` | Nothing to test-word |
| The `Sending` sub-tab | Empty in v1, and now homeless |
| Singular and plural opening lines | One line covers both |
| The unsubscribe link and its scope statement | Consent moved to the customer |

**Settings now carries one list, not two tabs.**

---

## 3. Consent · moved to `07-consent.md`

Consent is **one boolean on the customer**, `R-70`, and it now has four surfaces: the toggle on the customer info card `[cs0]`, the same field as a checkbox in the customer edit dialog, the row inside the enrolment modal `[x1]` `[x1r]`, and the disabled `Resend` on the worklist contact card `[b1o]`. Existing customers are turned on from the customer list `[cs5]` `[cs6]`.

⛔ The `Notifications` card on the customer page and its boards `[cs1]` `[cs2]` are **deleted**. Read `07-consent.md` for the whole of it.

For this chunk only two facts matter: **consent off means the daily job skips that customer entirely**, and **off changes nothing else** — every due date, status and worklist row is unchanged.

---

## 4. Transitions

| From | Trigger | Kind | To |
|---|---|---|---|
| `[s1]` | `Contact` | M | `[b1]` chunk 3 |
| `[b1r]` | `Resend` | M | `[b5]` confirm, chunk 3 |

There is no settings route to the email, because there is no settings screen. `[r1]` documents what gets sent.

---

## 5. Gaps in this chunk

| # | Gap | Severity |
|---|---|---|
| 5.1 | **`OQ-01`–`OQ-04` still gate the whole chunk:** who it comes from, whether we can mass-send at all, the daily calculation job, one global send time | **high, blocking** |
| 5.2 | **Turning consent off has no confirmation and no count.** Switching it off on a 50-unit fleet stops 50 units' emails silently. | **high** |
| 5.3 | **A customer with no email address** cannot receive anything. Whether they are silently skipped or reported is undrawn — the aggregate warning strip died with `[r1e]`. | **high** |
| 5.4 | **`Soon` versus a date** — `R-60` says "where confidence is low". Whether `Medium` also renders `Soon` is unstated. | **high** |
| 5.6 | **A 40-row email** is not drawn. Where the table stops, or whether it does. | medium |
| 5.8 | `OQ-15` — read receipts. Requested by the shop, nowhere to expose it, blocked by `OQ-02`. | low |
| 5.9 | `OQ-06` — whether `unit number · year make model` is right in **customer-facing** copy | medium |

---

## 6. Questions to test the spec

1. A customer has 5 units: 2 past due, 1 due today, 2 upcoming. How many emails do they get today, and what does the opening line say?
2. A customer has one unit, past due. Does the opening line still read naturally?
3. Consent is switched off for a 50-unit fleet. What does the worklist show tomorrow, and what does the contact card offer?
4. A unit's estimate sits at `Medium`. Does its row show a month or `Soon`?
5. A customer has no email address but 3 overdue units. What happens when the daily job runs?
6. Two services on one unit come due the same day, one routine and one compliance. One row or two?
7. A 50-unit fleet has 30 services due across the next 11 months. Which rows are in today's email?
