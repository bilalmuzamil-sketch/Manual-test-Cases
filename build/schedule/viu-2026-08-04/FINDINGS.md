# Schedule — live VIU findings against QA branch `sv8685`

**Build marker (start):** `v3.5-4873abe` · `index.html` last-modified **Tue, 04 Aug 2026 14:47:39 GMT**
· etag `9b4b1fc776ebbfb04a9a0ca051d847f7` · observed from **2026-08-04T16:03Z**
**App:** `https://sv8685.qa.shopview.com/schedule` · **API:** `https://sv8685api.qa.shopview.com`
(host confirmed by probe, not assumed) · org `d55bc308…` · workplace **Staging Heavy Duty - 9919**
(`b3c8c820…`, America/Edmonton) · signed in as `admin@shopview.com`.

**The branch is NOT declared final** → every verdict below is PROVISIONAL and queued in
`RECHECK-QUEUE.md` (Standing Rule 49).

---

## 0. The grid is FullCalendar — the single most useful fact for automation

The schedule grid is **FullCalendar** (`fc-resourceTimelineWeek-view` / `fc-resourceTimelineDay-view`
/ `fc-dayGridMonth-view`). **There are no `data-testid` attributes anywhere on the Schedule page**
(the only one on the whole page is `active-notifications` in the header). Automation therefore hooks
the semantic classes:

| What | Selector |
|---|---|
| shift / event block | `.schedule-block` (+ `--conflict`, `--blue/violet/cyan/teal/amber/grey`) |
| grid day column | `th.fc-day-sun … th.fc-day-sat` |
| technician / department row | `.fc-datagrid-body tr` (cushion text = initials + name + job title) |
| capacity bar | `.capacity-bar` (`__track`, `__fill`, `__lane`) |
| conflict pill | `.conflicts-pill` |
| sidebar work-order card | `.sidebar-card` (`--approved`, `--draggable`, `--openable`) |
| mini calendar day | `.mini-calendar__day` (`--selected`, `--today`, `--outside`) |
| overflow affordance | `.fc-more-link` / `.fc-timeline-more-link` |
| modal / popover | `.q-dialog` / `.q-menu` (Quasar) |
| toast | `.q-notification` |

## 1. The API contract, captured live

| Call | Shape |
|---|---|
| `GET /api/schedule/board?from=<iso>&to=<iso>` | `{data:{board:{range, resources:{departments[{id,name,position,technicians[]}]}, shifts[], events[], series[], capacity[], workingWindows[], conflictsComputed}}}` |
| `GET /api/schedule/work-orders?pagination[page]=&pagination[rowsPerPage]=&pagination[sortBy]=&pagination[descending]=` | `{data:{workOrders[{id,number,status,statusLabel,priority,customerName,contactName,unit,vin,totalTimeEstimateMinutes,lines[{id,name,status,statusLabel,timeEstimateMinutes,techTimeMinutes,technicians[]}]}], pagination{page,rowsPerPage,total}, facetCounts{assignment,status,priority}}}` |
| `POST /api/schedule/shifts` → **201** | `{workOrderId, lineIds[], staffId, departmentId, startDate:"YYYY-MM-DD", startTime:"HH:MM", spreadMode:"single"\|"series", totalMinutes, perDayMinutes, color, note, isAllDay, acknowledgeLongSeries}` → `{data:{shifts[…], seriesId}}` |
| `GET /api/staff/{staffId}/working-hours` | `{data:{workingHours:{ranges:[{dayOfWeek,startMinute,endMinute}]}}}` — `PUT` writes it |

**A shift's `conflictReasons` is computed server-side** and is one or more of
`double_booked` · `non_working_day` · `before_hours` · `after_hours`.

## 2. DEFECT — every time on the Schedule is shown in UTC, six hours ahead of the shop

**This is new. It is not one of the twelve tickets already raised.**

| Evidence | Value |
|---|---|
| shift `cea79194` stored | `startsAt 2026-08-02T16:01:00Z` (= **10:01 AM** in America/Edmonton, UTC−6) |
| tooltip shows | `Sun, Aug 2, 2026 · 4:01 PM – 5:13 PM` |
| browser timezone forced to `America/Edmonton` | tooltip **unchanged** — still 4:01 PM |
| shift created with `startTime 09:00` | stored `15:00Z`, modal time fields read **03:00 PM – 04:00 PM** |
| day-view "now" line label | `4:11 PM` while the shop clock read 10:11 AM |

So the **write path converts shop-local → UTC correctly**, and the **read path does not convert
back**. Input is local, display is UTC. It is not a browser artefact — proven by forcing the
browser into the shop's own timezone and getting the identical wrong value.

**Blast radius:** block text, hover tooltips, the detail modal's start/end fields, day-view block
positioning, the now line, and the "7:00 AM default start" of §4.2 (which displays as 1:00 PM).
A 07:00–19:00 local shift is stored `13:00Z→01:00Z` and therefore **renders as 1:00 PM – 1:00 AM,
spilling into the following day** in day view.

## 3. Conflict detection — all four types DO work; the labels differ from the spec

Seeded on **Ayesha Khan** (`1e81b8a0…`), the only technician with custom hours
(Mon 07:00–21:00, Tue–Fri 07:00–19:00, **no Saturday, no Sunday**), work order **S-15855
Vuchester Retail**, unit **10123073**, line *" Service - Mobile service call made by George Donald
403-369-7067"*:

| Seeded | API `conflictReasons` | Pill dropdown text (build) | Spec §4.11 name |
|---|---|---|---|
| Sun 9 Aug 09:00 | `non_working_day` | **"Not a working day"** | "Weekend shift" |
| Mon 10 Aug 05:00 | `before_hours` | **"Starts before working hours (7:00 AM)"** | "Before hours" |
| Mon 10 Aug 20:30 +90m | `after_hours` | **"Extends past working hours"** | "After hours" |
| pre-existing overlaps | `double_booked` | **"Double-booked with <customer>, <customer>"** | "Double-booked" |
| Tue 11 Aug 09:00 | `[]` — no conflict | not listed | — |

The pill reads **"N conflicts"** with a `warning_amber` icon; its dropdown is headed
**"SCHEDULE ISSUES"**. Conflicted blocks carry `schedule-block--conflict` and a `warning_amber`
icon on line 1. The modal shows a banner **"Scheduling conflict / <reason>"**.

### 3a. DEFECT — the conflict banner has no "Adjust" action
Spec §4.9: *"A conflict banner with an 'Adjust' action when the shift is conflicted."* The banner
renders, but the modal's only controls are the delete bin, close, the colour selector, **Add Note**
and **Open Work Order**. **There is no Adjust action anywhere.** New — not among the twelve.

## 4. View Options and Filter & Display — one default is wrong

**View Options** (`tune` icon, header **"VIEW OPTIONS"**), observed vs spec §9:

| Toggle (build label) | Spec default | Observed | Verdict |
|---|---|---|---|
| Business Hours | **Off** | **ON** | **DEFECT** |
| Tech Hours | Off | OFF | correct |
| Capacity Planning *(spec calls it "Capacity Bars")* | On | ON | correct, label differs |
| Events | On | ON | correct |
| Show Saturday *(spec "Saturday")* | On | ON | correct, label differs |
| Show Sunday *(spec "Sunday")* | On | ON | correct, label differs |

**Filter & Display** (`space_dashboard` icon, header **"FILTER & DISPLAY"**): department checkboxes
**Service**, **Work order status**, **Service/Parts** (all on) then **My Shifts** (off) and
**VIN Number** (off) — matching spec §9 defaults.

> **Data note:** *"Work order status"* is a real **department** in this org with **zero
> technicians**, so it appears in the checkbox list but produces no grid group. That is test-data
> pollution, not a product fault, and it is worth knowing before anyone reads the list as a bug.

## 5. Week and month grids start on Sunday; the mini calendar starts on Monday

Week header order is **Sunday Aug 2 → Saturday Aug 8** (`fc-day-sun` first); month view header is
**Sunday → Saturday**; the mini calendar weekday strip is **M T W T F S S**. Spec §3.2: *"Week
view. A 7-column grid **Mon to Sun** (Saturday and Sunday each toggleable)…"*. Already raised as
**SV-8826**.

## 6. Drag-and-drop works; there is no drag feedback and no create toast

Dragging `.sidebar-card` **S-15855** onto the Ayesha × Sunday cell issued
`POST /api/schedule/shifts` → **201** and the block appeared. During the drag,
`.fc-highlight` count was **0** and no ghost/mirror element carrying the line name existed —
spec §7 *"Drop-target cells highlight, and a ghost block shows the line name and hours."*
Already raised as **SV-8840**.

**Additionally: no toast appeared after the create.** Spec §7: *"Every create, delete, move, and
reassign action produces a toast with an Undo option. The toast persists for 4 to 7 seconds."*
Checked 3.5 s after the drop — `.q-notification` count 0.

A **single-line** work order created the shift immediately with **no scope picker**, exactly as
§4.1 requires, and defaulted to `startTime 07:00`.

## 7. Sidebar

- Card anatomy observed: `S-9379` · `11 lines · 33h Est.` · customer · unit · technician avatar
  initials · lead technician name · status chip (`Approved`, or **`Needs Techs`** when no
  technician is on any line).
- **Search:** `S-9379` **matches**, `9379` **matches**, `S8685-9379` **does not** →
  *"No schedulable work orders match this filter."* Note the card itself displays **`S-9379`**, so
  the number as shown *does* match. Already raised as **SV-8841** (whose premise names the
  `S8685-` form).
- **Filters popover** header **"FILTERS"**, with live counts:
  Unassigned 30 · Assigned 62 · Estimate 0 · Approved 91 · In Progress 0 · Declined 0 ·
  Ready for Review 1 · Complete 0 · Invoiced 0 · Paid 0 · High 0 · Medium 0 · Low 0.
  These match `facetCounts` from the work-orders endpoint exactly.
- Mini calendar: month label + `expand_more` month/year picker, `chevron_left`/`chevron_right`,
  and an `expand_less` collapse chevron. Selected and today states carry
  `--selected` / `--today`.

## 8. Capacity

Week header capacity bars render (`.capacity-bar`), month view too (42 bars). Hover tooltip:

```
Sunday, Aug 2
39.7h assigned / 168h capacity
1 tech in overtime · +12h
Colleen   12h / 12h
Jose      1.2h / 12h
William   2.5h / 12h
Kellie    24h / 12h · +12h
```

`OT` tags appear in every day header. **168h = 14 technicians × 12h** — and Ayesha, who has
custom hours with no Sunday, is correctly **excluded**. The technicians who count on a Sunday are
those with **no custom hours at all**, who inherit the §4.2 general default of 7:00 AM–7:00 PM
with **no weekday restriction**. See §12 below for why this matters to **SV-8839**.

## 9. Shift detail modal — contents observed

`Customer name` · status chip · `S-15855 · 10123073` · **VIN always shown** (spec §4.9 —
independent of the VIN toggle, confirmed) · delete bin · close · optional conflict banner ·
**SCHEDULED** date · **TIME** two fields · **TECHNICIAN** avatar + name · **Work Order Lines** with
a count and a scope chip (`Single line · 1h`) · one row per line showing line number, name,
hours-or-`—`, and status badge (`Authorized`) · colour selector (`Blue`/`Violet` + `expand_more`) ·
**Notes** with **Add Note** · **Open Work Order**.

**Absent:** any money figure (labor/total) on the line rows, an inline editor on the estimated
hours, and the **Adjust** action. `TIME LOGGED` appears on shifts that have logged time.

## 10. Events

Event blocks carry `schedule-block--grey` and render as `event / James Off / 12:00 PM – 1:00 AM`
— structurally distinct from shift cards and grey by default (spec §10).

## 11. Working hours

`GET /api/staff/{id}/working-hours` returns `{ranges:[{dayOfWeek,startMinute,endMinute}]}`.
**Exactly one of the 15 technicians has custom hours** (Ayesha Khan). Everyone else returns
`ranges: []` and therefore inherits the general default, which the board renders as
`isWorking:true, availableMinutes:720, ranges:[{420,1140}]` for **all seven days**.

## 12. Two of the twelve existing tickets do not reproduce as written

These are reported to their author as questions. **Their tickets are not touched** (Standing
Rule 38).

### SV-8830 "Weekend shift is not flagged as a conflict" — NOT REPRODUCIBLE
It reproduces only for a technician with **no custom hours**. Its steps use **Jose Young**, whose
`working-hours` is `ranges: []`, so nothing in his record says he does not work Sunday — he
inherits the §4.2 default that has no weekday restriction. With **Ayesha Khan**, who genuinely has
Mon–Fri hours, a Sunday shift **is** flagged (`non_working_day`, pill text *"Not a working day"*,
warning icon on the block, banner in the modal). The open product question is whether the general
default should exclude weekends — that is a Branko question, not a code defect as described.

### SV-8827 "Business Hours and Tech Hours default to ON" — HALF REPRODUCIBLE
**Business Hours is ON and should be Off** — that half is real. **Tech Hours is OFF**, which is
already correct, and the ticket's claim that *"all six toggles are ON"* does not hold on this
build.

### SV-8835 "Hover tooltip shows VIN even when the VIN toggle is off" — CONTRADICTS A PO RULING
The tooltip does show the VIN with the toggle off — observed. But **Branko ruled on 2026-07-31
(Q6 = A) that "VIN is always visible on hover regardless of the toggle"**, and spec §4.13 lists
the tooltip's VIN unconditionally. Our cases **SCH-TIP-01 = C30034** and **SCH-VIEW-04 = C30045**
already assert the build's behaviour on the strength of that ruling. Under Standing Rule 33 the PO
ruling outranks a reviewer's spec reading, so this needs Branko to settle before anyone "fixes" it.

### SV-8829 "line labor/total figures are missing" — CONTRADICTS A PO RULING
Same shape. Spec §4.9 still says *"the scheduled line(s) with labor/total figures"*, but Branko
ruled on **2026-07-22**: *"We do not show total $ anywhere in the schedule."* Our
**SCH-MODAL-04 = C30011** asserts no money in the modal. The **estimated-hours inline edit** half
of his ticket is a genuine gap against §4.9 and is confirmed: no inline editor exists.

## 13. Confirmed as written (independently reproduced)

| Ticket | Verdict |
|---|---|
| **SV-8826** week starts Sunday | CONFIRMED — header order `fc-day-sun` first, mini calendar Monday-first on the same screen |
| **SV-8831** Jose Young has no staff record | CONFIRMED — renders as a `Service/Parts` row (staff id `57378c17…`, job title *Parts Technician*) but `GET /api/staff?limit=300` returns 67 staff with **no Young**, and `search=Jose` returns only Joseph Richardson and Jose Chambers |
| **SV-8837** day view does not auto-scroll | CONFIRMED — scroller `scrollLeft` is **3** on load and still **3** after navigating a day; first slot is `12 AM` |
| **SV-8839** capacity counts non-working days | CONFIRMED as an outcome (Sunday capacity 168h, same as a weekday) — but see §8/§12 for the real cause |
| **SV-8840** no drag feedback | CONFIRMED — 0 highlight cells, no ghost |
| **SV-8841** full work-order number finds nothing | CONFIRMED for the `S8685-` form |
