# 03 · Customer level dashboard

**SV-3780 · Maintenance Reminders · review chunk 03 of 6**
**Customers › Maintenance reminders. Where the work gets sold.**

| | |
|---|---|
| **Artboards** | 18 |
| **PRD rules in scope** | `R-40`, `R-46`–`R-49`, `R-49.1`–`R-49.4`, `R-55` |
| **Read with** | `PRD.md` (normative) · `00-overview.md` (vocabulary, entry points, permissions) |

> Where this file and `PRD.md` disagree, the PRD wins. Gaps at the end of each section are **not** decisions — they are states the design does not cover.

---

## 1. Placement

A **tab under Customers**, beside Customers itself, alongside digital inspections. ✅ Confirmed. **Not under Reports.**

---

## 2. The worklist `[s1]`

### Four summary tiles, all styled alike

`Overdue` · `Due in a month` · `Due in three months` · `Not enough data`

**The numbers carry the urgency, not the colour.** No yellow tile, no red tile — all four look the same.

**Tiles are filters** (`R-46`, P0): clicking filters the list, **clicking again clears it**, **multi-select is possible**.

`Not enough data` is its own group. An asset seen once gives nothing to measure a rate from, so **no date is offered** and it is never guessed into another bucket.

### Sorting

**By clicking a column header** (`R-47`, P0). Never from a badge, never from a control inside a tile.

### Columns

`Asset` · `Customer` · `Service` · `Due` + provenance · `Status` · `Work Order` · `Actions`

- `Status` **mirrors the existing work-order statuses** (`R-40`, P0). Nothing new invented. Before a work order exists the row reads **`Open`** — a service is due and nothing has been raised for it. Once one exists the row shows **that work order's own status**.
- **There is no `View work order` button** (`R-49`, P0). The work order is reachable as a **link in its own column**, so a button repeating it is redundant. `Contact` occupies the Actions slot on every row.
- **No checkbox column, no bulk bar, no bulk estimate** (`OOS-07`).
- Every date carries its rule underneath, same as the asset panel.

### States drawn

| State | Board |
|---|---|
| Populated | `[s1]` |
| Nothing enrolled yet | `[s1b]` |
| Enrolled, nothing due | `[s1c]` |
| One tile selected | `[s1d]` |
| `Not enough data` filtered | `[s1f]` |
| Several workplaces | `[s1dl]` |
| One customer's own list | `[s1e]` |
| Compliance filtered | `[k3]` `[k3e]` |
| **Bulk enrol, from the asset list** | `[x4]` |
| Badge alternatives explored | `[s1n]` |

`[k3]` is defined as "`[s1]` with two filters on" and is a **candidate for deletion** — the only thing it carries that `[s1]` does not is the footer line *"None of these can be snoozed."*

---

## 2b. What the columns must handle

**Every tile carries a figure or says why it has none** (`R-49.3`, NEW). The type scale follows reports and the dashboard: label 15/22 semibold, count 32/38 semibold, secondary 14/20. `Not enough data` reads **`not priced`**, never a bare count, and the dollar sign never appears on some tiles and not others.

**The asset column handles no unit number** (`R-49.4`, NEW). Not every unit has one. The make and model stand alone with **`No unit number`** beneath, in grey.

**No `Compliance` tag on a row** (`R-53`, revised). The tags read wrong, and the service name plus its due date already identify it. Removed from the worklist row, the asset row and the work-order panel row.

**Every projected date shows a month**, not a day (`R-27.2`). `Nov 2026`, not `12 Nov 2026`. A snoozed date is user-set and stays exact.

## 3. Row actions

| Row kind | Actions column | Row menu `[b3]` |
|---|---|---|
| Open, contactable | `Contact` + `Create estimate` | `Mark complete` · `Snooze` · `Create estimate` · divider · `Open asset` |
| Has an estimate | `Contact` only — the work order is the column link, and an estimate already exists | as above |
| Not enough data | `Contact` only | `Open asset` only — readings are entered on the asset |
| Compliance | `Contact` + `Create estimate` | **no `Snooze`** |

`Create estimate` leaves the feature. ⚠ Nothing describes what returns, or what the row looks like while an estimate exists but a work order does not.

---

## 4. Contact `[b1]` `[b1r]` `[b1o]` `[b1e]` `[b1p]` `[b4]`

✅ **Confirmed as designed.** Three things it must do:

1. **A tappable phone number** — advisors work from a phone on the shop floor.
2. **An email address that is easy to copy.**
3. **`Resend`, with its confirmation step** (`R-49.2`, revised). The friction is deliberate, so nobody fires an email with one stray click. The `preferred contact` language and the separate send-a-reminder block are **both removed** — there is one email now, so composing does not arise.

**Resend shows the last-sent date.**

| State | Board |
|---|---|
| The hub | `[b1]` |
| Already sent, last-sent date shown | `[b1r]` `[b1o]` |
| No email address | `[b1e]` |
| No phone | `[b1p]` card 1 |
| Neither phone nor email | `[b1p]` card 2 |
| **No contact information at all** | `[b1p]` card 3 |
| **Add contact information** | `[b4]` · NEW |
| **Resend, with its confirmation** | `[b5]` · NEW |

With **neither** contact method, the reminder **stays on the worklist only** until a contact is added.

### No contact information at all · NEW `R-49.1`

A third case, distinct from a contact who lacks a phone or an email: **nothing at all is on record.**

- Measured: **roughly 55% of customers have neither a phone nor an email**, and **deleting a contact nulls it silently** on every unit it was set on. So this is common, and it arrives without warning.
- The card shows an **empty state** whose action opens a **small add-contact-information modal** (`[b4]`), reusing the existing field rather than sending the advisor to the customer record.
- **No send action exists until one is set.** Not disabled — absent.

---

## 5. Transitions

| From | Trigger | Kind | To |
|---|---|---|---|
| `[s1]` | tile | — | `[s1d]` `[s1f]` `[k3]` |
| `[s1]` | tile again | — | clears ⚠ **undrawn** |
| `[s1]` | second tile | — | multi-select ⚠ **undrawn** |
| `[s1]` | column header | — | re-sorts ⚠ **undrawn** |
| `[s1]` | `Contact` | M | `[b1]` |
| `[b1p]` | `Add contact information` | M | `[b4]` |
| `[b1r]` `[b1o]` | `Resend` | M | `[b5]` confirm |
| customer asset list | `Enroll in a schedule` | M | `[x4]` bulk |
| `[s1]` | Work Order link | N | that work order |
| `[s1]` | row ⋮ | M | `[b3]` |
| `[b3]` | `Open asset` | N | `[s4]` chunk 2 |
| `[s1]` | `Maintenance schedules` | N | `[s2]` chunk 1 |

---

## 6. Gaps in this chunk

| # | Gap | Severity |
|---|---|---|
| 3.1 | **Send hidden without permission is P0 and undrawn** (`R-55`). A tech should see the list but not send. It must be **hidden, not disabled** — and `OQ-13` has not decided which permission. | **high** |
| 3.2 | **Multi-select tiles and click-again-to-clear are promised by `R-46` and undrawn.** Only single-select `[s1d]` exists. | **high** |
| 3.3 | **`R-48` calls for the new filter component; the canvas still uses the old chips.** | **high** |
| 3.4 | **Sorting has no drawn state** — no sort indicator, no ascending/descending treatment, no default sort stated | medium |
| 3.6 | A row with an estimate but no work order; what returns from `Create estimate` | medium |
| 3.7 | Send failure — no state | medium |
| 3.8 | Pagination — a shop with 800 assets enrolled | medium |
| 3.9 | The filter-chip row does not include a `Compliance only` chip, though `[k3]` is defined as that filter applied | low |
| 3.10 | **Bulk enrol has no result state** (`[x4]`) — what the advisor lands on after enrolling 3 units | medium |
| 3.11 | A unit whose contact is deleted **while the worklist is open** | medium |
| 3.12 | **Consent off is invisible on the worklist.** A row for a customer who declined email looks identical to one who did not, and `Contact` still offers `Resend`. | **high** |
| 3.13 | **The tile figures have no stated source.** `$3,100` against 2 overdue assets — priced from the canned lines, or from something else? | medium |

---

## 7. Questions to test the spec

1. A technician without send permission opens the contact card. Describe exactly what they see.
2. `Overdue` and `Not enough data` are both selected. What does the table show, and what do the tile counts show?
3. The list is sorted by `Customer`, then a reading comes in that moves three rows. Does the sort hold?
4. A customer has 60 assets on the worklist. How is that paginated, and do the tile totals cover the page or the whole list?
5. An advisor sends a reminder, then the service is marked complete elsewhere ten minutes later. What does `[b1r]` `[b1o]` show?
6. A row's asset is deleted from the customer while the worklist is open. What happens on the next interaction?
7. A customer's only contact is deleted. It was on 14 units, 3 of them overdue. What do the tiles show, and what does each row offer?
8. A customer has notifications switched off. What does their worklist row look like, and what does `Contact` offer?
9. An advisor bulk-enrols 12 units from a customer's asset list. What do their rows read the next morning, given none has a last-service date?


## Spec v16 alignment (25 Sep)

**One worklist, one column set.** Asset · Customer · Service · Due · Status · Work Order · Actions, plus **Location** only for organizations with more than one location. Every filtered state is the `S1` table with a filter: `S1d` Overdue, `S1x` two tiles (Overdue + Not enough data → intersection; clicking an active tile clears it), `S1f` Not enough data, `S1e` one customer (Customer filter), `S1dl` several locations, `S1c` tiles at zero with an empty table. Cut and not to return: Bundled, Last Contact, Last Done At, Why It Is Here, Value, Asset on site, Group by customer, cohort, the Expires this month / Ready to book / Needs a reading tiles.

**What a row may claim.** Overdue rows print no figure: month + `Based on mileage estimate` / `Based on engine hours estimate`. Compliance dates are a month. A compliance service with **no record** reads `No record`, offers `+ Add record`, has no status and stays out of every tile (`K3` FL-118). A snoozed row shows only its new date.

**Status.** `Open` = due, no work order. Once a work order exists the row shows that work order's status as it is (Estimate, Approved, In progress, Completed, Declined). A **Completed, not invoiced** work order keeps the row and offers **`Invoice`** as the primary row action, opening the work order at invoicing (`S1` T-140); invoicing resets the service.

**Row menu** (`B3`). Routine: Mark complete · Snooze · Create estimate · Open asset. Compliance: Mark complete · Create estimate · **Skip** · Open asset (no Snooze). Not enough data: Open asset.

**Contact card.** Never sent: `Send reminder` where Resend sits (`B1`). Notifications off: Resend shown **disabled** with the reason beside it (`B1o`). `B1p` is "no phone number"; the nothing-at-all state is the Halden Grading card. Without send permission (technicians) Send reminder and Resend are **hidden** (`B1t`). `B5` reads "1 unit · PM-B overdue".

**Controls.** Sort by clicking a column header (`sv-table__sort`); no Sort dropdown. Filters use the app's FilterChip in a filter row: Status, Customer, Location (multi-location only), Compliance, Expires. The list is organization-wide and never narrowed by the header's location.

**No badge** on the Customers nav or the tab. `S1n` removed.

**Empty state** `S1b`: headline and Maintenance schedules action only.


## 25 Sep design review (hand-off Monday)

- **Header:** no assets/customers indicator, no Maintenance schedules link, no New Customer.
- **Filters:** none. The four summary cards are the only filters (several at once = intersection); every column sorts by its header.
- **No money** on cards or rows.
- **Columns:** Asset · Customer · (Location, multi-location only) · Service · **Confidence** (same meter as the asset tab: High, Medium, Low, No data) · **Due** (Overdue / Due today / Due soon badge beside the date or month) · **Work Order** (number + its status badge; "—" when none) · Actions. No Status column.
- **Actions:** Contact · Create estimate (no work order) or **Invoice** (completed, not invoiced) · three-dot menu: Mark complete, Snooze (routine) or Skip (compliance) (`S1m`). Rows are not clickable.
- **Contact card:** always **Send reminder** (manual). No Resend; nothing sends automatically in this release.
- Removed: `S1e`, `K3`, `K3e` (filters gone).

### Confidence and Due cell (25 Sep, later)
1. **Confidence grades a meter estimate only.** Compliance (certificate term) and calendar-only rows show "—". With two meters, show the confidence of the meter that produced the due date.
2. **Meter** reuses the asset tab exactly: High 3 bars (success), Medium 2 (accent), Low 1 (warning), No data none.
3. **Ahead of time:** High and Medium show the month ("Nov 2026"); Low shows a **Due soon** badge and no date.
4. **Due or overdue:** badge plus trigger, no month, no figure: "Overdue · based on mileage estimate", "Due today · based on engine hours estimate". Compliance is exact: "Overdue · certificate expired 31 Aug 2026".
5. **No data:** Due reads "Mar 2027 · based on calendar", no warning styling. Only action **Open asset**.

### Confidence moves into Due (25 Sep)
No Confidence column. The meter sits as a second line under the Due text (badge + month or trigger). Compliance, calendar-only rows show no meter; No data rows show the empty meter labelled No data. Columns: Asset · Customer · (Location) · Service · Due · Work Order · Actions.

### Due cell rethink (25 Sep, latest — supersedes the two notes above)
Two lines, always the same shape.
- **Line 1 · when:** the badge if due (Overdue, Due soon) and the date. Exact sources print their date: certificate "31 Aug 2026", calendar "Jan 2027". Estimates print a month ahead of time and nothing once due.
- **Line 2 · how we know:** "Certificate" / "Calendar" for exact dates; for estimates the meter plus the words "High confidence · mileage estimate". Confidence is spelled out, so the bars never stand alone.
- **No "Due today" on an estimate.** An estimate cannot name a day; it reads **Due soon**. Due today is kept for exact dates only.
- **Low confidence ahead** still shows no month (the Due soon badge carries it).
- **No data:** "Mar 2027" / "Calendar · no readings yet", Open asset only.
- The Due header info icon defines High, Medium and Low.

### Status + Due (25 Sep, final — supersedes the Due notes above)
- **Status column**, same badges as the asset tab: **Overdue** (past due) · **Due today** (exact certificate or calendar date only) · **Due soon** (inside the first reminder, 14 days by default) · "—" when not yet due.
- **Due column** always says when, and how it is known: line 1 the date or month (exact date for certificates, month for calendar and estimates); line 2 "Certificate", "Calendar", or the meter with "High confidence · mileage estimate". Every row has a date; no row hides it.
- **No data:** Status "—", Due "Mar 2027" / "Calendar · no readings yet", Open asset only.
- Columns: Asset · Customer · (Location) · Service · Status · Due · Work Order · Actions.
- **Line 2 for estimates** reads only the meter and "Medium confidence"; hovering it shows "Based on mileage estimate" / "Based on engine hours estimate", as on the asset tab.

### Review of all-boards (25 Sep)
- Row menus: routine = Mark complete · Snooze · Open asset; compliance = Mark complete · Skip · Open asset.
- Compliance due dates show month and year only: "Aug 2026" / "Certificate".
