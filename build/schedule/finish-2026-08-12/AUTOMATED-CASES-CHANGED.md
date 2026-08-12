# Cases carrying an automation marker that this pass changed

**Three cases were edited, and all three carry `AUTOMATION: READY`.** The automation engineer should
know, because a locator built from the old wording will no longer match the case text.

| Case | Marker | What moved | Does it affect an automated script? |
|---|---|---|---|
| [C30008](https://shopview.testrail.io/index.php?/cases/view/30008) | `AUTOMATION: READY` | precondition names the dropdown `'Filter & display'` instead of `'Filter and Display'` | **Only if the script reads the case text.** The control is the same one; its test id is `schedule_filter_display_menu`. |
| [C29946](https://shopview.testrail.io/index.php?/cases/view/29946) | `AUTOMATION: READY` | step and expected result name the control `'Filters'` instead of `'Filter'` | Same. Test id `button_sidebar_filters`. **And a real hint for whoever automates it: `Clear all` only exists once a filter is applied**, so a script must apply one first. |
| [C30058](https://shopview.testrail.io/index.php?/cases/view/30058) | `AUTOMATION: READY` | step 1 names the scope `'This shift only'` instead of `'this shift only'` | The dialog option is capitalised exactly this way. **A case-sensitive text match against the old string would have failed.** |

**No marker changed value in this pass**, so nothing moved into or out of the automatable set.

## Two things the automation engineer will want that are not in a case

1. **Deleting a NON-series shift asks nothing** — `button_shift_detail_delete` destroys it on the
   first click. Any script that opens the shift modal must not press that control speculatively.
   It has cost this branch two shifts in two days.
2. **The cell menu is opened by a LEFT click on the time grid, not the technician column.** The lane
   elements are 199 px wide and are the label column; the menu opens when the click lands at roughly
   35–80 % of the calendar's width. **Right-click does nothing.**
