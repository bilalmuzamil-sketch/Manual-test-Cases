# -*- coding: utf-8 -*-
"""Second update batch: untouched cases whose v19 language now contradicts v21 (found by the
reverse-coverage contradiction sweep, Rule 45)."""
import os,sys; sys.path.insert(0,os.path.dirname(__file__))
from bodies import exp,J
V='[spec v21 2026-08-14]'
U={}
def mk(cid,title,refs,pre,steps,ex): U[cid]=dict(title=title,refs=refs,preconds=pre,steps=steps,expected=ex)

mk(29560,"Status chip opens a checkbox list of all nine statuses plus Clear selection",
   f"SV-8787 (S2-R1; S16-R1; S16-R6) {V}",
   J("1. You are signed in on a desktop browser.","2. You are on the Work Orders page on the All tab (the Status chip is shown on the All tab only).","3. No filters are currently selected."),
   J("1. Click the Status filter chip.","2. Read the list of options from top to bottom.","3. Look at the bottom of the panel."),
   exp(["1. A checkbox-list panel opens under the Status chip (no search box).",
        "2. It lists all nine statuses as checkboxes, in this order: Estimate, Approved, In progress, Review, Complete, Invoiced, Paid, Declined, Imported.",
        "3. All checkboxes are unticked (nothing selected yet).",
        "4. A 'Clear selection' action is shown at the bottom of the panel."],
     "S2-R1; S16-R1; S16-R6","story SV-8787 (Status filter) and SV-9276 (panel types),"))

mk(29599,"Clear selection in one panel clears only that filter, leaving others",
   f"SV-9274 (S8-R2; S16-R6) {V}",
   J("1. You are signed in on a desktop browser.","2. You are on the Work Orders page, All tab.","3. Values are selected in at least two different filters (for example a status and Asset on Site)."),
   J("1. Open the Status panel and click 'Clear selection'.","2. Look at the Status chip, the Asset on Site chip and the table."),
   exp(["1. Only the Status filter is cleared - its chip returns to its plain appearance.",
        "2. The Asset on Site filter stays selected and active and keeps narrowing the table.",
        "3. There is no global 'Clear filters' button; each filter is cleared on its own from its chip or panel."],
     "S8-R2; S16-R6","story SV-9274 (clearing filters),"))

mk(29616,"A remembered filter value that was deleted is silently ignored",
   f"SV-8795 (S10-N1; S11-R3) {V}",
   J("1. You are signed in on a desktop browser.","2. You are on a page that has an entity filter (for example a customer or vendor filter - confirm live which pages carry one).","3. A throwaway ZZAUTOTEST value is selected in that filter alongside a real value, then the throwaway value is deleted while you are off the page."),
   J("1. Return to the page.","2. Look at the filter chip, its panel and the table."),
   exp(["1. The deleted value is silently ignored - no error or warning appears.",
        "2. The filter now reflects only the still-valid selection (the real value).",
        "3. The table is narrowed by the remaining valid selection only.",
        "4. The same applies when the value arrives from a shared link: an unknown value in the link is ignored and the page loads without it (Story 11)."],
     "S10-N1; S11-R3","story SV-8795 (persistence) and SV-9276 (entity filters),"))

mk(38881,"Filters saved before the redesign carry over after the update",
   f"SV-8795 (S10-R2; S9-R1) {V}",
   J("1. In one browser the account was used on the OLD Work Orders page with choices saved there (a tab, status selections, the asset-on-site choice) BEFORE the redesign was installed.","2. The redesign is then installed."),
   J("1. In that same browser, open the updated app and go to the Work Orders page.","2. Check the selected tab, the filter chips and the table.","3. Sign in as the same person on a different computer and open the Work Orders page."),
   exp(["1. The old saved choices carry over to the new toolbar chips on the first visit - the update does not lose them (old status choices show in the Status chip; the old asset choice shows as Asset on Site).",
        "2. The old 'My Work Orders' choice maps to the new 'Assigned to me' chip (the My Work Orders tab was removed and its job is now done by that chip).",
        "3. Those carried-over choices are now saved to the account, so the other computer shows them too (Story 10).",
        "4. Note: this one-off migration is not given a numbered requirement in the spec - confirm the exact migration mapping with the team."],
     "S10-R2; S9-R1","story SV-8795 (persistence) and SV-9272 (tab model),"))

mk(38907,"Parts filters allow several choices and are cleared one filter at a time",
   f"SV-9279 (S16-R6; S8-R1; S8-R2) {V}",
   J("1. You are signed in on a desktop browser.","2. You are on a Parts view that has filters, with some sample data present."),
   J("1. Open a Parts filter chip that shows a list of choices.","2. Select more than one choice, then look at the chip.","3. Use 'Clear selection', then look across the toolbar for any single button to clear all filters."),
   exp(["1. More than one value can be chosen inside the filter, and the chip shows what you picked.",
        "2. 'Clear selection' removes the choices for that one filter only.",
        "3. There is NO global 'Clear filters' button - on Parts pages too, each filter is cleared on its own (from its chip's X or 'Clear selection'), exactly as on the Work Orders page.",
        "4. The exact filters a Parts view offers are the ones it has today (the per-view list is pending from engineering) - confirm live."],
     "S16-R6; S8-R1; S8-R2","story SV-9279 (roll the filter layout out to all pages) and SV-9274 (no global clear),"))

mk(43562,"Parts and Reports filter chips share by link and work on a phone, no collapse",
   f"SV-9279 (S1-R4; S1-R7; S11-R1; S12-R17) {V}",
   J("1. You are signed in on a desktop browser.","2. You can also open the same pages on a phone (or a browser window narrowed to phone size).","3. You are on a Parts view or a report that has filters."),
   J("1. On the page, set a filter so the list is narrowed and look for any control to collapse or hide the chips.","2. Copy the page link and open it in a new tab.","3. Open the same page on a phone."),
   exp(["1. The filter chips are always visible in the toolbar row - there is NO collapse or hide control on Parts or Reports pages either (the collapse toggle was removed everywhere in the redesign).",
        "2. The active filters are reflected in the page link, so opening that link loads the page with the same filters applied (URL state, Story 11).",
        "3. On a phone the toolbar stacks into rows and the chips row is horizontally scrollable, each chip opening its own bottom sheet - the same model as Work Orders (Story 12).",
        "4. These behaviours match the Work Orders definitions on every page (Story 1 applies app-wide)."],
     "S1-R4; S1-R7; S11-R1; S12-R17","story SV-9279 (roll the filter layout out to all pages) and SV-9269 (no collapse),"))

if __name__=='__main__':
    for cid,u in U.items():
        assert len(u['title'])<=80,(cid,len(u['title']),u['title'])
        assert ',' not in u['refs'],(cid,u['refs'])
        assert '<' not in u['expected'] and '>' not in u['expected'],cid
        assert len(u['refs'])<=248,(cid,len(u['refs']))
    print("v2 updates:",len(U),"validated")
