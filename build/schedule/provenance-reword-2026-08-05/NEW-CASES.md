# Schedule — the three coverage-gap cases: sources, live observation, and the honesty limits

Authorised by the QA lead, verbatim: *"Yes authorized for Scheduling three coverage gaps."*
He also ruled, verbatim: *"No test cases for API only findings please"* — **none of the three is an
API case.** All three are driven entirely through the screen; not one names an endpoint, an HTTP verb
or a status code, so all three sit in ordinary functional sections and Standing Rule 4 does not bite.

Observed live on build **`v3.5-d122eef`** (marker read 17:11:48Z and 17:29:54Z, `index.html` sha256
identical both times).

## The internal IDs, and why they are safe to use

Today another project reused a retired internal ID and its re-sync **overwrote the retired record**.
So each ID was checked three ways before being taken:

| Internal ID | In the 192 case bodies? | On the 27-case retired list? | In `testrail-id-map.csv` (165 rows)? |
|---|---|---|---|
| **`SCH-NAV-08`** | **No** — SCH-NAV runs 01–07 (02 retired) | **No** | **No** |
| **`SCH-DND-09`** | **No** — SCH-DND runs 01–08, all active | **No** | **No** |
| **`SCH-REAS-07`** | **No** — SCH-REAS runs 01–06 (02, 04, 05 retired) | **No** | **No** |

They appear in exactly two places in the repository — `final-viu-2026-08-05/OUTSIDE-IN.md` and
`PROJECT-STATE.md` — and in both places only as **reserved, not yet authored**. **None has ever been
attached to a case, and none is a retired ID being recycled.**

---

## 1. SCH-NAV-08 — which view the Schedule opens on

### The ticket, read live
**[SV-8863](https://shopview.atlassian.net/browse/SV-8863)** · Story Defect · **Ready to Fix** ·
parent story SV-8686 · raised by **Ayesha Khan**, 2026-08-04T15:01:54-0500. Verbatim:

> *"When the Schedule page loads, it opens in Week view. Per SV-8686, it should open in Day view by
> default."* … *"Expected Result: Schedule loads in Day view by default."* … *"Reference: SV-8686 AC —
> 'the grid displays with day view as default.'"*

### The documented requirement (Standing Rule 57 — the source is the document)
**Story SV-8686 "Schedule Grid Layout & Navigation", acceptance criterion, read live and quoted
verbatim:**

> *"Given the schedule page loads, when the user has Schedule: View permission, then the grid displays
> with **day view as default** showing all department-grouped technician rows."*

**HONEST LIMIT, and it is written onto the case: specification version 23 does NOT state which view
the module opens on.** A full-text search of the live body finds no default-view sentence; the only
adjacent text is §4.8's *"On initial day-view load … the timeline auto-scrolls…"*, which **presupposes**
day view without requiring it. So the expectation rests on **the epic's story**, which Rule 57 lists as
a legitimate source, and the provenance line says exactly that rather than implying a spec anchor that
does not exist.

### What was observed live
Opening `/schedule` fresh on `v3.5-d122eef`:
- the three view buttons read exactly **`Day`**, **`Week`**, **`Month`** (no `data-test-id` on any of them);
- **`Week` carries `aria-pressed="true"`; `Day` and `Month` both `aria-pressed="false"`**;
- the rendered grid is `fc-resourceTimelineWeek-view`.

**The build opens on Week view. The story requires Day.** So the case is born a **DEVIATION** and its
marker is `AUTOMATION: READY - EXPECT FAIL (SV-8863)` — SV-8863 is already accepted as **Ready to Fix**,
so a tester marking this Failed is doing the right thing and must not re-raise it.

Evidence: `evidence/01-default-view-on-load.png`.

---

## 2. SCH-DND-09 — creating a shift by dragging onto a day in Month view

### The ticket, read live
**[SV-8870](https://shopview.atlassian.net/browse/SV-8870)** · Story Defect · **Open** · parent story
SV-8688 · **Ayesha Khan**, 2026-08-04T19:24:07-0500. Verbatim:

> *"In Month view, dragging a work order from the sidebar onto a day does nothing — no shift is
> created. Month view even shows the prompt 'Nothing is scheduled in this range. Drag a work order from
> the list to book it,' so drag-to-create is expected here. It works in Day and Week view."*

And, critically, **the ticket's own author says the documents do not settle it**:

> *"**Clarification Needed: The PRD is silent on whether Month view supports drag-to-create.** If
> dragging a work order onto a day in Month view is intended to work, this is a bug and should be
> fixed. If it is intended that Month view does not support drag-to-create, then the empty-state line
> … should not appear in Month view … Please confirm which behavior is intended."*

### What the documents actually say — checked myself rather than taken on trust
- **Spec §4.1:** *"Users drag a work order card (or an individual line) from the sidebar and drop it
  onto a technician x day/time cell in the grid."* — **no view is named.**
- **Spec §4.2:** *"In day view, the start time instead comes from where the shift is dropped on the
  timeline."* — so a drop **outside** day view is contemplated, taking its start time from the
  hierarchy.
- **Spec §3.2:** *"Month view. A compact calendar with per-day capacity bars and shift chips."* —
  Month view is described as a **calendar**, and unlike Day and Week it is **not** described as having
  technician rows.
- **Story SV-8688's acceptance criterion names only WEEK:** *"Given a single-line WO is dragged onto a
  technician row **in week view**, when dropped, then a shift is created immediately…"*

**So the ticket's author is right: neither the specification nor the story says whether Month view
supports drag-to-create.** Standing Rules 57 and 58 govern what happens next — an ambiguous source is
**never** resolved by looking at the build. The case therefore:
- asserts the §4.1/§4.2 reading (the same reading the ticket takes) as its expectation, **and**
- states in plain words that the specification does not settle the point, that the question is open on
  SV-8870 and **addressed to the product owner**, and
- carries **`AUTOMATION: HOLD - waiting on the product owner's answer on whether Month view supports drag-to-create (SV-8870)`**, so it is excluded from the ready-to-automate figure until Branko rules.

This mirrors exactly how SCH-SPREAD-07 and SCH-EDGE-05 already handle the shop-closure contradiction.
**Inventing a definite requirement here — in either direction — would be precisely the failure Rule 58
was written for.**

### What was observed live

**The empty-state text, captured verbatim from the running build** (Month view, November 2026, no
shifts in range):

> **"Nothing is scheduled in this range. Drag a work order from the list to book it."**

**The drag itself**, work order **S-12876 · Pamill Paving · unit 713 · 2 lines · 1h Est.** dragged from
the sidebar onto the **10 November 2026** day cell:

| | Result |
|---|---|
| Mid-drag | a **drag ghost appeared** — so the drag starts |
| Drop-target highlight | **none** (0 elements) |
| On release | **no scope picker, no dialog, no toast, no chip** |
| Schedule API calls during the whole drag | **ZERO** |

**THE CONTROL THAT MAKES THIS AN OBSERVATION RATHER THAN A TOOLING ARTEFACT.** The identical drag of
the identical work order in **Week view**, onto technician **Brittany Anderson**'s lane, produced a
`fc-event-mirror` mid-drag and, on release, **the scope picker**, headed verbatim:

> *"dropped on Brittany Anderson · Wed, Aug 5 — S-12876 · Pamill Paving — Schedule whole work order —
> All 2 lines · 1h total — or pick a line"*

**So the harness can create a drop in this build. Month view genuinely does not accept one.** Nothing
was written in either case: the picker's confirm was never pressed and it was closed with
`button_line_picker_close`.

Also confirmed live, and relevant to the case's wording: **Month view has no technician rows at all** —
0 resource labels, a weekday-column calendar (Sunday…Saturday) of day cells with per-day capacity bars
and shift chips, `+N more` overflow, and series banners reading `Week 1 of 2 ›` / `‹ continues`.

Evidence: `evidence/02-month-view-empty-range-prompt.png`, `evidence/03-month-view-after-drop-nothing.png`,
`evidence/04-week-view-control-scope-picker.png`.

---

## 3. SCH-REAS-07 — reassigning a member of a linked series

### The ticket, read live
**[SV-8867](https://shopview.atlassian.net/browse/SV-8867)** · Story Defect · **Open** · parent story
SV-8692 · **Ayesha Khan**, 2026-08-04T16:28:08-0500. Verbatim:

> *"In Week and Month view, a recurring series shift cannot be reassigned by drag-and-drop. The drag
> appears to work — the block moves against other technician rows — but on releasing the mouse it snaps
> back to its original technician and date. This works correctly in Day view. Per SV-8692 / PRD §7,
> dragging a shift to another technician should reassign it."*

### The documented requirement
- **Spec §7:** *"**Shift reassignment.** Dragging a shift block from one technician row to another
  reassigns it: the target technician is added to the affected line's roster and the source technician
  is removed. A confirmation modal handles cross-tech moves."* — **no view is excluded.**
- **Spec §12 (invariants):** *"Dragging a shift between technicians reassigns it, adding the target
  technician to the affected line's roster and removing the source technician."*
- **Spec §4.6, and this is the sentence that makes the series case follow from §7 rather than needing
  its own requirement:** a series *"**is a grouping over ordinary daily shifts, not a distinct
  persisted entity** beyond the shared id, and each daily shift carries its own hours for capacity
  math."* **A series member IS an ordinary shift, so §7 applies to it unchanged.**

**HONEST SCOPING, and it is on the case.** §7 says *"from one technician row to another"*. **Week view
has technician rows** (confirmed live: a resource lane per technician, grouped by department). **Month
view does not** — so in Month view the spec's reassignment mechanic has no counterpart to exercise, and
the case **deliberately scopes its assertion to Week view** rather than asserting a Month-view
behaviour no document describes. The Month half of SV-8867 is recorded as an open product question, not
as an expectation of ours. **Story SV-8692 documents series-aware *deletion* only and says nothing
about reassignment**, which is stated on the case too.

### What was observed live, with the control that proves it

Series member: `data-test-id="schedule_series_block"`, `data-series-id=1bb9ffbb-7d5c-4f67-bfb6-5ea1996694d6`,
aria-label *"Series (conflict: Extends past working hours, Double-booked): Xiriver Apparel, 16604, 11
Lines, continues"*, sitting in **Jose Young (Parts Technician)**'s lane. Its `fc-event` wrapper carries
**`fc-event-draggable`**.

| Drag, Week view, Jose Young → MQ Test Tech Qamar | Ordinary (non-series) shift — CONTROL | **Series member** |
|---|---|---|
| Mid-drag mirror | **present** | **present** — the block does move |
| On release | **"Reassign shift" dialog**: *"S-9379 · Xiriver Apparel — Move this shift to MQ Test Tech Qamar on Sun, Aug 2? Cancel / Reassign"* | **no dialog, no toast** |
| Write requests | **0** (Cancelled) | **0** |
| Where the block ended up | offered for reassignment | **back in Jose Young's lane** |

**Same view, same two technician lanes, same harness: an ordinary shift is offered for reassignment and
a series member silently bounces back. SV-8867 reproduces on `v3.5-d122eef`.** Marker:
`AUTOMATION: READY - EXPECT FAIL (SV-8867)`.

Evidence: `evidence/05-week-view-series-drag-bounced.png`.

---

## The environment: one thing was changed by accident, and it was restored and proven restored

**Told plainly rather than buried.** During an early, imprecisely-targeted drag attempt, the pointer
grabbed an **all-day event** overlapping the series block instead of the block itself, and the event
was reassigned. Exactly one field of exactly one record changed:

| Record | Field | Before | After the accident |
|---|---|---|---|
| event `f43279e9-4438-4956-8411-6d91f9801e67` *"test test"* | `staffId` | `57378c17…` (Jose Young) | `01ddd277…` (MQ Test Tech) |

It was **restored through the interface by dragging it back**, and then verified **field by field, not
by count**:

| | Before | After all observation |
|---|---:|---:|
| shifts | 366 | 366 |
| events | 33 | 33 |
| series | 7 | 7 |

**0 added · 0 removed · 0 changed**, id sets **equal in both directions**, every record
**byte-identical**. Nothing else was seeded, so nothing else needed removing, and **no role was
changed, so none needed resetting to template**.

Two things learned in the process, worth recording because they cost time:
- `PATCH /api/schedule/events/{id}` **ignores a lone `staffId`** and answers `400 {"error":"The request
  changes nothing."}`. A reassignment needs the full shape
  `{startsAt, endsAt, reassign: true, staffId, departmentId, changeNote}`.
- An **event** block reassigns **immediately with no confirmation**, whereas a **shift** block raises
  the *"Reassign shift"* confirmation. That asymmetry is not covered by any of our cases and is
  reported, not acted on.

## No Jira ticket was filed, and none was needed

All three gaps already have tickets, raised by Ayesha Khan on 4 August. **This pass created zero Jira
issues; every Jira call it made was a read.** Nothing new was found that would warrant a ticket, so
there is no staged draft to hand over.
