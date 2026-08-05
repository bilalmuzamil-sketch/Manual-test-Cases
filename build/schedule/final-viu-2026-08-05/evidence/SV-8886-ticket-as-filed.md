## Description

When a manager schedules only *some* of the jobs on a work order, the schedule offers a
"Select multiple" mode with tick boxes. That mode is missing two of the controls it is
supposed to have, and a third reads differently from what was asked for.

There is no **"Select all"** shortcut, so a manager who wants every job on the order has to
tick each one by hand instead of pressing one button. And there is no **"Cancel"** button, so
once you are in tick-box mode there is no way back to the quick single-tap list — the only
way out is the small X, which throws away the whole window and you have to start again by
placing the work order a second time.

It matters because picking part of a work order is the everyday case for a multi-job order,
and both missing controls are the ones that make it quick and forgiving. Losing the whole
window when you only wanted to step back one screen is the kind of thing that makes people
avoid the feature.

## Branch / Environment

- Application: `https://sv8685.qa.shopview.com`
- API host: `https://sv8685api.qa.shopview.com`
- Build marker (`<meta name="app-version">`): **`v3.5-be42149`**
- `index.html` last-modified: Wed, 05 Aug 2026 08:09:19 GMT
- Location / workplace: **Staging Heavy Duty - 9919**
- Observed: **2026-08-05, 14:0x UTC**

## Steps to reproduce

1. Sign in as a user who is allowed to change the schedule (an Admin is fine) and pick the
   location **Staging Heavy Duty - 9919**.
2. Open **Schedule** from the top navigation.
3. In the left-hand panel, find work order **S-12876**, customer **Pamill Paving**, unit
   **713**. It has **2 lines**: **"Replace - Rear ramp handles"** (estimate 1h) and
   **"Quality control check over"** (no estimate). Its lead technician shows as
   **Brittany Anderson**.
   *If that work order is gone, any work order with two or more approved lines behaves the
   same way — the fault does not depend on which one. Proven by repeating it on the
   whole-order row of the same picker, which is unaffected.*
4. Click the small calendar button on that work order's card (its label reads
   **"Schedule S-12876 by click"**).
5. Click an empty day cell on the row for technician **MQ Test Tech Qamar** — for example
   **Thursday, Aug 6**.
6. The picker opens, headed **"dropped on MQ Test Tech Qamar · Thu, Aug 6"**.
7. Click **"Select multiple"**.
8. Tick one line, for example **"Replace - Rear ramp handles"**.
9. Look along the bottom bar of the picker, and look for a way to go back to the ordinary
   single-tap list.

## Expected behaviour

In tick-box mode the bottom bar should offer a running tally, a **"Select all"** shortcut
that is the same as choosing the whole work order, and a **"Cancel"** that returns you to the
quick single-tap list.

The Schedule specification asks for exactly that:

> "'Select multiple' is an opt-in control that switches the line rows into checkboxes and
> shows a confirm bar with a running tally ("Create shift · 2 lines · 6h"), a "Select all"
> shortcut (equivalent to whole order), and Cancel (returns to the fast single-tap list)."

## Current behaviour

- The tick boxes appear correctly, one per line.
- The bottom bar shows a tally, but it reads **"1 selected · 1h"** rather than the
  "Create shift · 2 lines · 6h" shape the specification gives.
- The confirm button reads **"Schedule"**.
- **There is no "Select all" button anywhere in the picker.** The only "All" control is the
  **"All 2"** chip higher up, which is the filter that switches between all lines and
  unscheduled lines — it does not tick anything.
- **There is no "Cancel" button.** The only way out is the **X** in the top corner, which
  closes the whole picker rather than returning to the single-tap list.

## Images

No screenshot is attached. The finding was taken by reading the picker's own rendered text
and its controls directly from the running page, and the exact strings are reproduced above
and in the technical section, so an image would add nothing a reader cannot already check by
following the steps.

## Technical details for developers

Observed in the live DOM with the picker open in multi-select mode.

Controls present inside the picker (`data-test-id`):

```
text_line_picker_dropped_on      button_line_picker_close
text_line_picker_title           line_picker_whole_work_order
button_line_picker_multi_select  input_line_picker_search
button_line_picker_scope_all     button_line_picker_scope_unscheduled
line_picker_line_<lineId>        checkbox_line_picker_<lineId>
line_picker_techs_<lineId>       line_picker_footer
text_line_picker_tally           button_line_picker_schedule
```

- `text_line_picker_tally` rendered **`1 selected · 1h`** after one line was ticked.
- `button_line_picker_schedule` rendered **`Schedule`**.
- There is **no** `button_line_picker_select_all` and **no** `button_line_picker_cancel`.
- `button_line_picker_scope_all` renders as **`All 2`** and is the All / Unscheduled scope
  filter, not a selection shortcut.
- Full button label set read from the open popover: `close`,
  `content_paste Schedule whole work order All 2 lines · 1h total chevron_right`,
  `Select multiple`, `All 2`, `Unscheduled 0`, `Schedule`.

Governing requirement: Schedule specification, Confluence page `713031682`, **version 23**,
section **4.3 Scope picker** (quoted verbatim above).

Work order used: `582a8993-793d-4e6f-8dd0-abec5b4a3be0` (S-12876). Lines
`32bb5deb-a207-4501-bc8f-31b775d79b73` and `935e36d9-2dc1-4639-b39d-de2d00dbd289`.
Technician lane `01ddd277-e1fc-41c8-acb5-94bc575f2722`.

Nothing was created during the observation: the schedule board for 2 – 9 Aug held 34 shifts,
9 events and 6 series before and after, every record byte-identical and the id sets equal in
both directions.
