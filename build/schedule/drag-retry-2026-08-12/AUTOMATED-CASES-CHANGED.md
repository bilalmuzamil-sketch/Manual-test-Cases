# For the automation engineer — Schedule cases whose marker moved, 2026-08-12

**Three cases become automatable that were not, and four keep a hold whose reason has changed.**

## Now `READY - EXPECT FAIL` — automate these, expecting the named failure

| Case | Ticket | The exact symptom to assert |
|---|---|---|
| [C29967](https://shopview.testrail.io/index.php?/cases/view/29967) | [SV-8886](https://shopview.atlassian.net/browse/SV-8886) *(In Progress)* | tick-box mode has **27 checkboxes** but **no `Select all`** and **no `Cancel`**; the tally reads `2 selected · 4h`, not the spec's shape. `button_line_picker_multi_select` toggles the mode both ways. |
| [C29982](https://shopview.testrail.io/index.php?/cases/view/29982) | [SV-9090](https://shopview.atlassian.net/browse/SV-9090) *(closed OBSOLETE — still reproduces)* | **no start-date control under any of the five `select_spread_option` values.** `Until a date…` yields `Finish by`, `Specific hours…` yields `Hours`; both bound the END. |
| [C29984](https://shopview.testrail.io/index.php?/cases/view/29984) | [SV-9006](https://shopview.atlassian.net/browse/SV-9006) *(open)* | the expanded preview lists **only working days**. A 13→24 Aug run crosses two weekends and none of the four dates appears — nothing is struck through because nothing is listed. |

## Still `HOLD`, and the reason is now specific

[C29985](https://shopview.testrail.io/index.php?/cases/view/29985) ·
[C30004](https://shopview.testrail.io/index.php?/cases/view/30004) ·
[C30013](https://shopview.testrail.io/index.php?/cases/view/30013) ·
[C30020](https://shopview.testrail.io/index.php?/cases/view/30020) — each has been driven and each
carries its observed symptom, but the fault has **no ticket number**, so no `EXPECT FAIL` marker can
name one. **One edit each once a ticket exists.**

## Selectors worth having — all read live off `v3.5-65d6500`

**Scope picker:** `sidebar_work_order_card` · `line_picker_whole_work_order` ·
`button_line_picker_multi_select` · `button_line_picker_scope_all` /
`button_line_picker_scope_unscheduled` · `input_line_picker_search` ·
`line_picker_line_<lineId>` / `checkbox_line_picker_<lineId>` · `text_line_picker_tally` ·
`button_line_picker_schedule` (**disabled at 0 selected**) · `button_line_picker_close`

**Spread step:** `button_spread_change_scope` · `text_spread_scope` · `select_spread_option` with
options `option_spread_option_{full,one_week,two_weeks,until_date,specific_hours}` ·
`button_spread_toggle_preview` · `text_spread_summary` · `text_spread_cadence` ·
`button_spread_until_date_{prev,next}` / `text_spread_until_date` · `button_spread_cancel` ·
`button_spread_confirm` (**label carries the count: `Create 8 shifts`**)

**Shift modal:** `schedule_shift_block` opens it · `button_shift_detail_delete` (**no confirmation
step for a non-series shift**) · `select_shift_detail_{start,end}_time` · `button_shift_detail_color` ·
`button_shift_detail_add_note` → `input_shift_detail_note` → `button_shift_detail_note_confirm`
(**an ICON, not a button labelled Save**) → then `button_shift_detail_note_edit` /
`button_shift_detail_note_delete`

**Series on the grid:** `schedule_series_block` · `schedule_block_series_cue` ·
`schedule_block_series_after`

## Two traps that cost time here

1. **The drop target must be inside the viewport.** A target computed at `y=2095` in a 1080-tall
   window lands on nothing and the picker never opens — which reads exactly like "the control is
   missing".
2. **A one-line work order opens no scope picker, and is not supposed to.** Pick the card with the
   most lines.

## Three actions produce no toast and no Undo

Creating a series, moving a shift sideways, and moving an event to another day. Checked by polling
every 350 ms for 11 s and, separately, by a `MutationObserver` over the whole document: **37 nodes
added, 0 with a notification class, 0 containing "Undo".** The specification asks for one on each.
**No ticket covers it.**
