# 01 · Admin page + create a schedule

**SV-3780 · Maintenance Reminders · review chunk 01 of 6**
**Settings › Service › Maintenance. Where a shop defines its standards.**

| | |
|---|---|
| **Artboards** | 37 — the largest band after the work order |
| **PRD rules in scope** | `R-01`–`R-19`, `R-44`, `R-45`, `R-53` |
| **Read with** | `PRD.md` (normative) · `00-overview.md` (vocabulary, entry points, permissions) |

> Where this file and `PRD.md` disagree, the PRD wins. Gaps at the end of each section are **not** decisions — they are states the design does not cover.

---

## 1. The schedules list

| State | Board | What shows |
|---|---|---|
| Empty | `[s2b]` | Heading, one sentence, `New schedule`. No illustration. |
| One or more | `[s2]` `[e01]` | Table: name · services · assets enrolled · row menu |

**Controls**

| Control | Type | Result |
|---|---|---|
| `New schedule` | primary | `··▶` §2 |
| schedule name | link | `──▶` §3 editor `[s3]` |
| assets-enrolled count | link | `──▶` worklist filtered to that schedule ⚠ **no board** |
| row `⋮` | menu | `··▶` `[s2menu]` |
| tabs | — | `Maintenance schedules` \| `Reminder settings` `──▶` chunk 5 |

**Row menu `[s2menu]`** — `Edit` · `Duplicate` · divider · `Archive`.

- **There is no `Delete`.** A schedule with history can only be emptied and left archived. A reviewer should confirm no delete endpoint is exposed.
- `Apply to assets` **does not exist** — bulk enrolment needs cross-customer asset search, which does not exist (`OOS-06`).

**Archive `[s2arch]`** — one sentence, one action pair `Cancel` / `Archive`. Rewritten 16 Sep to plain language:
> Archiving deactivates the schedule. Eight assets are currently enrolled in it, and reminders will not be sent.

---

## 2. Creating a schedule

| Branch | Board | Then |
|---|---|---|
| Start blank | `[s2new]` | `──▶` `[s3new]` empty editor |
| From a template | `[p11]` | `──▶` `[s3skel]` seeded editor |

**The starter set** — four deliberately basic templates (`R-44`):

| Template | Shape |
|---|---|
| Annual inspection — truck | Compliance, 12-month term |
| Annual inspection — trailer | Compliance, 12-month term |
| Service inspection | The PM inspection. Routine. |
| 300-hour service | Routine, engine hours. Equipment customers. |

Regional variants (Ontario vs US) are **not** modelled in the starter set. Shops customise from here.

After seeding, a template is an ordinary schedule: every name, interval and canned line is editable and the link to the template is not retained.

⚠ **The canvas still shows `PM-A`…`PM-D` + `CVIP`.** Known divergence — see gap 1.1.

---

## 3. The schedule editor

| State | Board |
|---|---|
| Empty | `[s3new]` |
| One service | `[s3one]` |
| Seeded, five services | `[s3skel]` |
| In use, 42 assets | `[s3]` `[e02]` |
| With a compliance row | `[k03]` |

**Anatomy**
- Title carries an **inline pencil**. No Name field, no wizard, no numbered steps, **no schedule-level Save/Cancel**.
- **Triggers.** Calendar first, **required, no checkbox** (`R-01`) — distance and engine-hour data cannot be trusted even with telematics, so time is always the fallback. Distance and Engine hours below, optional, each with a one-line description. One grey line resolves the combination: *"Comes due at whichever trigger arrives first."*
- **Services**, unnumbered, drag-reorderable **by a handle on the row**, not a menu item. Compliance rows cannot be dragged.
- `+ Add service` `··▶` §4.

**Trigger variants**: `[t1]` calendar only · `[t2]` engine hours only · `[t3]` all three · `[t5]` calendar `every` vs `at`.

| Control | Result |
|---|---|
| pencil on title | inline edit, commits on blur ⚠ no error state for blank or duplicate |
| Distance checkbox | reveals the interval row on every service ⚠ see gap 1.2 |
| service row | `··▶` §4 edit mode `[c3]` `[p13]` `[k04]` |
| service row `⋮` | `··▶` `[c5]`: `Edit service` · `Duplicate` · divider · `Remove service` |
| lines count | `··▶` `[d4]` read-only |

**Editing a service `[e04e]` · NEW.** Same shape as remove-service: **a before, an after, and the outcome.** The diff lists what changed (interval, calendar, canned lines) as `before → after`; the outcome is that **assets already enrolled do not change**, and assets enrolled from now on get the new version.

**Remove service `[e04r]`** → confirm → leaves the schedule. **Assets already enrolled keep the service they were given** (`R-04`). `[e05]` states what happened after saving: a schedule edit never reaches back.

---

## 4. The service form

`[c0]` add · `[c1]` empty · `[c2b]` distance · `[c2]` distance + calendar · `[c2all]` all three · `[c3]` edit · `[p13]` a template service · `[c4]` `[k02]` `[k04]` compliance.

**Fields, in order:** `Name` → one interval row per trigger → `Canned lines` → `Is this a compliance inspection?`

**There is no customer-facing name** (`R-05`, withdrawn 10 Sep). One name, everywhere. Two names for one thing means the customer phones about "an oil service" while the shop works out that this is a PM-A. A shop that wants a customer-legible name types one as **the** name.

**There is no `Start from a template` control on this form** (`R-12`). Template choice happens in creation only.

**The `Compliance` tag stays here** (`R-53`, revised). It is removed from every *data* row — the worklist, the asset, the work-order panel — because the service name plus its due date already identify it. In the editor and the service form there is no due date to identify it by, so the tag earns its place.

### The interval row

Three aligned columns: operator · value · unit.

| Trigger | Operator | Value | Unit |
|---|---|---|---|
| Calendar | `every` \| `at` | `every` → whole number · `at` → **month picker** | `every`: `days` \| `months` · `at`: none, always a month |
| Mileage | `every` \| `at` | typed number | `mileage` |
| Engine hours | `every` \| `at` | typed number | `hrs` |

- `every` **rebases on the last completion**. `at` is a fixed point that **never moves**.
- The calendar case is why the operator exists there: a customer wants the inspection **every January**. If they come in during February, next year's is still January. `every 12 months` would drift the schedule a month later every time they are late. `[t5]` draws both.
- **One distance unit, the word `mileage`** (`R-10`). No picker, no conversion, and no abbreviation: `mi` and `km` never appear, because one unit covers both.
- ⛔ **v12:** the calendar `every` interval carries a **unit, `days` or `months`** (`R-08`), so *every 30 days from last completion* is expressible. `at` keeps its month picker whatever the unit shows. The one-line service row reads `15,000 mileage or 30 days` as readily as `or 3 months`, on one line. Board `[c6]`.
- **One `or`, after Calendar only.** It appears when Distance or Engine hours is also checked: whichever comes first. There is no `or` between Distance and Engine hours; they are independent checkboxes, and a service watching both still produces one calendar row.
- **Number list.** With `months`, the number dropdown offers **all twelve, 1 to 12** (was 1, 2, 3, 6, 12; a nine-month interval must be possible). With `days`, the number is a whole-number field. `every 30 days` drifts back through the calendar; `every 1 month` holds the day of the month. Both are deliberate choices.
- **Not a control.** Where the next due date lands after completion is behaviour. No date picker, anchor control or next-date preview on this form.

### The compliance branch

Replaces the interval block entirely.

| Field | Rule | Board |
|---|---|---|
| `Type` — **type-ahead**, not a dropdown | `R-13` | `[k6]` |
| `Term` — pre-filled by type, **editable**, tooltip on the label | `R-14` | `[k7]` |
| `Start reminders` — derived from the term, months only, 1–4 | `R-15` | `[k7]` |
| artefact number — **named by the type**, optional but always present | `R-17` | `[k8]` |
| `Attachment` — one optional file, DVI component | `R-18` | `[k9]` |

**Why the type is a type-ahead:** every state and province names its inspection differently, so the list runs past a hundred. Five generic types ship; no match offers `+ Add "…"`, saved **for that shop only**. The jurisdiction is secondary text on the option row, never in the name.

**Why the field exists at all:** reporting. Counting how many of each compliance inspection a shop performed. Worth remembering if the field starts to look like decoration.

**`Certificate start date` is NOT on this form** (`R-19.1`). It is a property of one truck, not of the shop's policy.

---

## 5. Canned lines

| State | Board |
|---|---|
| Picker over the service modal | `[d1]` |

| Read-only, from the count | `[d4]` |

- Picker has **no count, no disabled rows, no drag, no row icons**; supports long lists.
- ⛔ **The empty state is removed** (16 Sep). Canned lines cannot be created from settings, so the shop is never asked. `[d3]` deleted.
- `Not priced`, never `$0.00`. A line deleted from the library reads `Not counted` at `0.0` hrs.
- **A maintenance service is never a line-search result** (`R-45`).

---

## 6. Transitions

| From | Trigger | Kind | To |
|---|---|---|---|
| `[s2b]` `[s2]` | New schedule | M | `[s2new]` / `[p11]` |
| `[s2new]` | Start blank | N | `[s3new]` |
| `[p11]` | pick a template | N | `[s3skel]` |
| `[s2]` | schedule name | N | `[s3]` |
| `[s2]` | row ⋮ | M | `[s2menu]` |
| `[s2menu]` | Archive | M | `[s2arch]` |
| `[s3*]` | + Add service | M | `[c0]` → `[c1]` |
| `[s3*]` | service row | M | `[c3]` `[p13]` `[k04]` |
| `[s3*]` | row ⋮ | M | `[c5]` |
| `[c5]` | Remove service | M | `[e04r]` |
| `[c3]` | Save changes | M | `[e04e]` |
| `[c*]` | Canned lines | M | `[d1]` |
| `[s3*]` | lines count | M | `[d4]` |

---

## 7. Gaps in this chunk

| # | Gap | Severity |
|---|---|---|
| 1.1 | **Template set disagrees:** the canvas shows `PM-A`…`PM-D` + `CVIP`; the spec says four basic templates (`OQ-12a`) | **high** |
| 1.2 | **Unchecking a schedule-level trigger** that services already use — silently drop those intervals, or block? Unspecified. | **high** |
| 1.8 | **The bundling window is set nowhere.** `R-42.1` collapses candidates inside a window; no screen offers the length, and it is not obviously a schedule-level setting either (`OQ-21`). | **high** |
| 1.3 | **Every validation state is missing:** blank name, blank interval, `0` as an interval, letters in a number, `at` month left unset, all three triggers on with every interval blank, duplicate schedule name, blank rename | **high** |
| 1.4 | **Shop-added compliance types have no lifecycle:** editing one, deleting one, deleting one that records reference, two shops colliding on a name | **high** |
| 1.5 | **Archived schedules have no un-archive path.** The row treatment exists (`[s2arch]` shows the `Archived` pill); reversing it does not. | **high** |
| 1.6 | `Duplicate` — where it lands, what the copy is named, whether it opens the copy | medium |
| 1.7 | The assets-enrolled count links to a filtered worklist with no board | low |

---

## 8. Questions to test the spec

1. A shop unchecks Distance on a schedule where three services carry a 15,000 mileage interval. What happens to those intervals, and to the 42 assets already enrolled?
2. A shop adds the compliance type "Manitoba Safety", uses it on 30 records, then renames it. What do existing records show?
3. Two admins open the same schedule. One removes PM-B; the other renames it. Last write wins, or a conflict?
4. A service is saved with all three triggers selected and every interval blank. Is that valid? What does the asset row show?
5. A schedule is archived with 42 assets enrolled. What does the list row look like the next day, and how does the shop reverse it?


## Save, remove and saved messages · one language (23 Sep)

All three say the same three things in the same words, and nothing more. No before/after table, no tooltip.

- **Remove `[e04r]`:** Assets already enrolled keep PM-C and its history. · Assets enrolled from now on do not get PM-C. · Work orders with a PM-C line keep it.
- **Save `[e04e]`:** Assets already enrolled keep PM-A as it is. · Assets enrolled from now on get the new version. · Work orders with a PM-A line keep it.
- **Saved `[e05]`:** Assets already enrolled keep PM-B as it is. Assets enrolled from now on get the new version.


## Reminder schedule · one set of rows for list and email (23 Sep)

- **`Customer email schedule` is renamed `Reminder schedule`.** Each row is one reminder: it puts the service on the maintenance reminders list (internal) and, when `Email the customer automatically` is on, emails the customer (external).
- **`Start reminders` is removed from compliance inspections.** When the first reminder fires already comes from the reminder schedule, so a second lead-time control was redundant. The services row no longer shows `reminders 1 month ahead`.


## Reminders and sending move to the schedule (24 Sep)

**Service form ends at canned lines.** Four sections: name, compliance, triggers and intervals, canned lines. `Reminder schedule` and `Email the customer automatically` are gone from every service modal.

**Reminder rows live once, on the schedule editor, in a section titled `Reminder schedule` below Services.** `[before | after] [n] days`, up to five. Default: 14 days before · on the due date · 7 days after. The due-date row cannot be deleted; its delete control is disabled, not hidden. **Days only** — no mileage or hours units. A row in days moves with each service's own due date, so one set serves every service; a row in mileage does not (`1,000 mileage before` is fair warning on a 15,000 service and almost none on a 120,000 one, and Highway Tractor spans exactly that range). Do not re-propose per-service or per-unit rows.

**Sending has a master and an exception.**
- **Schedule: `Email customers` master switch.** New schedules are created **off**. While off, nothing on the schedule sends, whatever any service says, and the editor states `Off: nothing on this schedule emails customers`.
- **Service: its own switch, default on**, shown as the **Email** column in the editor's service table (replacing `Reminders`), never in the modal. While the master is off the column reads inactive (disabled toggles, muted header).
- Boards: new schedules `P03` `P07` `P12` — master off, every service on, nothing sending. In use `P14` — master on, `PM-A` excluded.


## Empty list: one action (24 Sep)

With no schedules, the page header has **no `New Schedule` button**; the only action is `Create the first schedule` in the empty state (`P01`, and the empty page behind `P02` and `P11`). `New Schedule` appears in the header once at least one schedule exists (`E01`). Same pattern as DVI inspection templates.


## Spec v16 alignment (25 Sep)

Supersedes earlier notes on chunk one.
- **Service form** ends at canned lines (four sections). Done.
- **Reminder schedule** on the editor, days only, up to five, 14 before · due date · 7 after, due-date row delete disabled. Done.
- **Sending:** master `Email customers` off on a new schedule, with "Off: nothing on this schedule emails customers"; when on, "Customers on this schedule are emailed from now on". Per-service Email column, default on, inactive while master is off. Done.
- **Calendar interval:** number + unit (`days`/`months`), months 1 to 12. `T5` number menu now lists 1–12 plain numbers so "months" appears once. `at` keeps its month picker. No `or` between Distance and Engine hours. Done.
- **Compliance lead time:** `Lead time` beside Type and Term on `K01`/`K02`, 1 to 4 months, set from the term. A compliance service ignores the schedule's reminder rows. This reverses the 23 Sep removal of `Start reminders`.
- **No Customer email tab.** Settings → Maintenance is one list, no tabs (`P01`, `E01` and every page header).
- **Removed** "The choice is made once. It cannot be switched after." from `P04a`. No delete anywhere for schedules.
- **Service table days:** cells never wrap; `C6` shows `30,000 mileage or 30 days` on one line.
- **`S2m` schedule row menu:** live: Rename · Duplicate · Archive; archived: Duplicate · Restore. Duplicate is named with a numeric suffix (`Highway Tractor PM 2`), lands beside the original, opens in the editor, no enrolled assets.
- **Enrolled count** (`42 assets`) links to the worklist filtered to those assets (page 3 `s1`).
- **Validation `V1`:** blank schedule name or rename reverts · blank service name errors · digits only (no letters state) · zero rejected · decimal rejected · `at` needs a month.


## Per-service email switch in the service form too (25 Sep)

The service form regains a last section, **Email the customer automatically**, a toggle defaulted on. It is the same value as the service's switch in the editor's Email column, editable in either place. It only takes effect while the schedule's `Email customers` master is on. The form is now five sections: name · compliance · triggers and intervals · canned lines · email.


## Reminders back on the service; no schedule master (25 Sep)

Supersedes the schedule-level Reminder schedule and the `Email customers` master switch.
- **Schedule editor:** no Reminder schedule section and no Email customers switch. The service table keeps its **Email** column, one switch per service, always active.
- **Service form (routine):** name · compliance · triggers and intervals · canned lines · **Reminder schedule** (`[before|after] [n] days`, up to five, default 14 before · on the due date · 7 after; due-date row cannot be deleted) · **Email the customer automatically** (default on).
- **Compliance services** keep their Lead time (1 to 4 months) beside Type and Term instead of reminder rows.

- **25 Sep, later:** `Email the customer automatically` is removed from the service form. The per-service switch lives only in the editor's **Email** column. Routine service form: name · compliance · triggers and intervals · canned lines · Reminder schedule.

- **25 Sep:** `Duplicate` removed from the schedule row menu (`S2m`). Live: Rename · Archive. Archived: Restore.


## 25 Sep design review (hand-off Monday)

Boards `R1`–`R8` at the top of page 1.
1. **Schedule list** with **Live / Archived** tabs, as DVI templates (`R1`, `R2`). Live menu: Rename · Duplicate · Archive. Archived menu: Restore. An archived schedule opens read-only all the way down; only action Restore (`R3`). `E01` and `S2m` removed.
2. **Enrolled count** is plain text, top right: "42 assets enrolled". Not a badge, not a link.
3. **Reminder timing is per service.** Every new service starts with 14 before · on the due date · 7 after, editable per service. Nothing on the schedule.
4. **No customer-email controls** in the builder: no Email column, no master switch. Reminders are internal; not labelled so.
5. **Triggers** (`R5`): no `or`. Calendar is a ticked, read-only checkbox with a hover ("always applies"). Distance and engine hours use Every / At. Every = number + unit (calendar: days or months). **At (calendar) = day and month picker, e.g. 15 Nov.** Distance unit written **mileage**.
6. **Compliance** (`R6`): Type · Term (select, e.g. 6 or 12 months) · Lead time; lead time longer than the term shows an inline error.
7. **Services also covered** (`R4`, `R7`): multi-select of the schedule's other services, before Canned lines, helper "Build the smallest service first." Covered lines arrive pre-filled and editable, tagged "from PM-A". On the service row the canned-lines count is not clickable; hover lists covered services, then lines (`R8`).
8. **Remove service** confirmation opens over the service editor (`E04r`). The "saved" confirmation (`E05`) is removed.
9. **Archive** (`E06`): "Archiving deactivates the schedule. All assets enrolled in the schedule will be unenrolled." Red **Archive Schedule**. Restore does not re-enroll.

### Review of all-boards (25 Sep)
- Canned-lines count is hover-only, plain text (not a link). Hover lists COVERS then the lines. Board D4 removed.
- Services also covered: compliance services never appear in the picker.
- E03 Edit PM-B: step 4 covers PM-A; canned lines = 3 from PM-A + Fuel filter replacement (4 lines · 3 absorbed).
- E06: Live tab behind the archive confirmation. After archiving, the schedule sits in Archived with 0 assets.
- Interval summary: "15,000 mileage · 3 months" — no "or".
- Engine hours unit is "hours", never "hrs".
- K01: open question banner removed; compliance stays a separate service type.

### Last fixes (25 Sep)
- C6 service row: no per-service send switch; count is plain dark text.
- Calendar every · months: 1 to 60.
- Canned-lines counts read total lines · lines from covered services, and match the hover everywhere: PM-A 3 lines · PM-B 4 lines · 3 absorbed · PM-C 7 lines · 4 absorbed · PM-D 11 lines · 7 absorbed · CVIP 1 line.
- Count hover is a white card (modal surface), opens on hover, closes on leave; lists COVERS, then every line with "from PM-x" on covered ones.
