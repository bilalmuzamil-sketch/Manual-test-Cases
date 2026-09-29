# 07 · Consent

**SV-3780 · Maintenance Reminders · review chunk 07**
**One boolean on the customer. Three surfaces. Default ON, decided 16 September.**

| | |
|---|---|
| **Artboards** | `[cs0]` `[x1]` `[x1r]` on design page 2 · `[b1o]` on design page 3 |
| **PRD rules in scope** | `R-70` (rewritten), with `R-59`–`R-67` for what the email itself does |
| **Read with** | `PRD.md` (normative) · `05-auto-email.md` (the email) · `00-overview.md` (permissions) |

> ⛔ **New 16 September 2026.** This chunk replaces §3 of `05-auto-email.md`. Boards `[cs1]` and `[cs2]` from that section **no longer exist**. If you have read the earlier version, discard it.

---

## 0. The shape of it

One boolean, stored on the **customer**. Not on the asset, not on the enrolment, not per channel, not per service.

```
  Customer
      │
      └── send_preventive_maintenance_notifications : boolean   (default TRUE)
                │
                ├─ true  ─▶ the daily job emails this customer's preferred contact
                └─ false ─▶ no email. Every due date, status, worklist row,
                            estimate and compliance record is UNCHANGED.
```

**Why it is not on the asset.** A shop wants to see that a unit is coming due **even when that customer does not want email**. Tracking and notifying are two different acts, so they are two different switches. Enrolling a unit in a schedule never turns consent on.

**Why one boolean and not preferences.** Honouring per-channel choices, per-service choices or an unsubscribe link is consent management, which is its own feature. There is **no notification preferences page, no per-channel matrix and no unsubscribe control** anywhere in v1.

---

## 1. Where it lives — three surfaces

### 1.1 The customer info card — the switch `[cs0]`

The left-hand card on the customer page (`Address`, `Phone`, `Credit term`, `Credit limit`, `Sales Representative`, `Website`, `IBS`, then the `Contacts` / `Assets` counts).

- The setting sits **below `IBS`, above the divider and the counts**, as a **toggle**: label left, toggle right.
- Label: `Maintenance notifications`
- An info icon after the label. Its tooltip is the only place the rule is written:

  > Covers every asset this customer owns, including units enrolled later. Turning it off does not remove any unit from maintenance tracking.

- **No explanatory sentence under or beside the control.** The tooltip carries it.

⛔ **There is no `Notifications` card and no notifications tab on the customer page.** The customer page is a header plus its existing tabs — Work Orders, Part Sales, Contacts, Assets, Notes, Invoices, Payments, Deposits, Fees & Discounts. One boolean does not earn a new one.

### 1.2 The customer edit dialog — the same field · not drawn

The dialog behind the pencil on that card. The field appears as the **third checkbox in the trailing row**, beside the two already there:

```
  [ ] PO is required      [ ] Pin notes?      [ ] Send preventive maintenance notifications  (i)
```

- Same row, **same width, same size, same weight** as its two neighbours. It is a **checkbox**, not a toggle — match the neighbours exactly, not the card.
- Keep the info icon; its tooltip reads:

  > Preventive maintenance reminders are emailed to this customer's preferred contact. Turning this off does not remove any unit from maintenance tracking.

- **Not drawn, still binding.** No board — it is the same field in the form that edits every other customer property. The row wraps to one checkbox per line at phone width; labels and controls keep their size.

### 1.3 The enrolment modal — show and set in place `[x1]` `[x1r]`

`Enroll in a schedule`, opened from the asset. Showing the value is not enough: an advisor who sees `off` mid-enrolment must not have to close the modal, open the customer, edit, save and start again.

- A row above `Services on this schedule`, with the **same checkbox**, writing the **same customer field**.
- The row states whose setting it is: `CUSTOMER SETTING · <CUSTOMER NAME>`.
- **On** `[x1]`: neutral row, `--sv-grey-25` fill.
- **Off** `[x1r]`: **visible, not quiet** — `--sv-warning-fill` with a warning icon and the line `<Customer> receives no reminder emails`. An advisor finishing enrolment must know nothing will go out.

### 1.4 The worklist contact card — why send is unavailable `[b1o]`

When consent is off the customer's rows **still appear on the worklist**. Nothing is hidden internally.

- The email row is `--sv-warning-25` tinted, with `Notifications off for this customer` under the address.
- **`Resend` is disabled** (40% opacity, `cursor: not-allowed`) with the tooltip: *Send is unavailable while Send preventive maintenance notifications is off on the customer.*
- Footer: the last-sent date if there is one, and a `Turn on for this customer` link to the customer record.
- Without this, an advisor presses send, nothing happens, and nobody can tell why.

---

## 2. Turning it on in bulk — withdrawn

Consent **defaults on**, so there is nothing to turn on in bulk. Boards `[cs5]` the customer-list selection and `[cs6]` the counted confirmation are **deleted**, along with the `MAINT. NOTIFICATIONS` column on the Customers list.

What remains is the reverse case: a shop that wants a customer to receive nothing switches that customer off on the record. One customer at a time, deliberately — see gap 6.1, which now matters more than it did.

---

## 3. Constraints

| | |
|---|---|
| **Default** | **`on`**, decided 16 September, for existing and new customers alike. No bulk action exists, and none is needed |
| **Permission** | follows **editing a customer**. It is **not** financial data, so it does **not** sit behind the AP/AR visibility gate the way `PO is required` does. Without that permission the trailing row and `Save` are disabled |
| **Scope** | one value per customer, covering every unit they own, including units enrolled later |
| **Off** | stops the email and nothing else |
| **Copy** | no explanatory sentences beside the control; the rule lives in the info tooltip |

---

## 4. Deleted

| Gone | Why |
|---|---|
| The standalone `Notifications` card on the customer page (old `[cs1]` `[cs2]`) | The customer page is a header plus tabs. One checkbox does not earn a card |
| A notification preferences page | Consent is one boolean |
| A per-channel matrix | Same |
| The unsubscribe control | Consent management is its own feature (`R-64`) |
| The blue pill switch in the customer edit dialog | That form uses checkboxes. Match `PO is required` and `Pin notes?` |

---

## 5. Transitions

| From | Trigger | Kind | To |
|---|---|---|---|
| `[cs0]` | pencil on the info card | M | customer edit dialog (not drawn) |
| `[cs0]` | toggle | — | writes immediately ⚠ no confirmation drawn, see 6.1 |
| edit dialog | `Save` | — | `[cs0]` with the new value |
| `[x1]` `[x1r]` | the checkbox on the consent row | — | writes the customer field from inside enrolment |
| `[b1o]` | `Turn on for this customer` | N | the customer record |
| `[b1o]` | `Resend` | — | **nothing.** Disabled |

---

## 6. Gaps in this chunk

| # | Gap | Severity |
|---|---|---|
| 6.1 | **Turning consent off has no confirmation and no count.** Switching it off on a 50-unit fleet stops 50 units' emails silently. Drawn nowhere, on any of the three surfaces that can write the field | **high** |
| 6.2 | **A customer with no email address** is consented by default and still receives nothing. Nothing states this on `[cs0]`, in enrolment, or on the daily job — and with default on it is now the common case (~55% of customers have no email) | **high** |
| 6.3 | **No audit trail.** Who turned consent off, and when | **high** |
| 6.4 | **Default on means the first daily job after release emails every consented customer with anything due.** Whether release needs a quiet period, or a first-run cap, is undecided — this is now the biggest open risk | **high** |
| 6.5 | **The edit-dialog checkbox, the no-permission state and the phone-width reflow have no board.** Specified in 1.2 and §3; a build will need one screenshot of the real dialog to place the row | medium |
| 6.6 | **Does the worklist filter or flag consent?** A shop with 200 opted-out customers sees no difference on `[s1]` today | medium |
| 6.7 | **Bulk turn-*off*** is not drawn. The selection bar offers one action | low |
| 6.8 | `OQ-15` read receipts — still nowhere to expose, still blocked by `OQ-02` | low |

---

## 7. Questions to test the spec

1. A unit is enrolled while the customer's consent is off. What does the worklist show tomorrow, and what does the contact card offer?
2. An advisor turns consent on from inside the enrolment modal, then cancels the enrolment. Is the customer still consented?
3. A user without permission to edit customers opens the customer page. What do they see on the info card, and what happens if they click the pencil?
4. Release day: 1,284 customers are on by default and 300 have something overdue. What goes out in the first daily job?
5. Consent is switched off for a 50-unit fleet mid-week. What, if anything, is the user told?
6. A customer owns 10 units, 4 enrolled. Consent is on. How many emails, and covering which units?
7. A unit is transferred to a different customer. Which consent value governs it?
