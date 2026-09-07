#!/usr/bin/env python3
"""Build intended-blocks-v1.4.json for the Global Search source-verify 2026-09-07 pass.

Start from the byte-identical 2026-09-02 authored bodies (v1.3), then:
  (1) re-stamp provenance on EVERY case: spec version 1.3 -> 1.4, read date -> 7 Sept 2026,
      AUTOMATION 'Last checked' 9/2/2026 -> 9/7/2026.  Historical notes that say
      'Spec v1.3 (2026-09-01) ...' are LEFT ALONE (they are accurate history).
  (2) fully rewrite the 11 cases the v1.3->v1.4 change log touches (Show-all -> in-modal
      scope tab; counts capped at 20; Part quick action = View part history only; drop the
      full-page hand-off / banner). Each rewritten case carries a divergence note (Rule 56).
text for every field is regenerated from blocks as '\n\n'.join('\n'.join(block)).
"""
import json, copy, sys

SRC = '/home/user/Manual-test-Cases/build/global-search/source-verify-2026-09-02/intended-blocks.json'
OUT = '/home/user/Manual-test-Cases/build/global-search/source-verify-2026-09-07/intended-blocks.json'

ib = json.load(open(SRC))
out = copy.deepcopy(ib)

PROV_OLD = 'specification version 1.3 (Confluence page 576978945)'
PROV_NEW = 'specification version 1.4 (Confluence page 576978945)'
DATE_OLD = 'read on 2 September 2026'
DATE_NEW = 'read on 7 September 2026'
STAMP_OLD = 'Last checked 9/2/2026'
STAMP_NEW = 'Last checked 9/7/2026'

def restamp_line(l):
    return (l.replace(PROV_OLD, PROV_NEW)
             .replace(DATE_OLD, DATE_NEW)
             .replace(STAMP_OLD, STAMP_NEW))

# ---- the 11 content rewrites (v1.4). Each maps field -> list of blocks (each block a list of lines).
MARK = "AUTOMATION: Not available on Build to test Yet - Last checked 9/7/2026"
def prov(*lines):
    return ["---"] + list(lines) + [MARK]

REWRITES = {
 "44822": {"custom_steps": [[
    "2. Type a term with many matches.",
    "3. Note that each group shows up to five rows with a 'Show all N' link on its heading.",
    "4. Click an entity's scope tab and scroll the scoped list."]],
   "custom_expected": [[
    "1. Selecting an entity scope tab scopes the query to that entity type only.",
    "2. The scoped tab shows up to 20 rows, scrolled inside the modal - there is no pagination, no further loading, and no 'Show all' link inside the tab.",
    "3. The scope tab's count never reads higher than 20; a query with more than 20 matches shows the count as 20.",
    "4. You stay inside the search modal - selecting a tab does not open a separate results page."],
    prov("This is the expected behaviour as per epic SV-9160 and the Global Search - Product Requirements specification version 1.4 (Confluence page 576978945), section 5.2 (scope tabs; counts capped at 20), read on 7 September 2026.",
         "Note: spec v1.4 (2026-09-04) drops the earlier full-page 'Show all' hand-off (term placed in the list's search box, filters reset) and caps every count at 20; 'Show all' now switches to an in-modal scope tab. This case follows the current spec.")]},

 "44823": {"custom_expected": [[
    "1. Each group heading shows the entity name and its match count in parentheses, for example 'Work Orders (12)' and 'Customers (2)'.",
    "2. The count never reads higher than 20 - a group with more than 20 matches shows the count as 20."],
    prov("This is the expected behaviour as per epic SV-9160 and the Global Search - Product Requirements specification version 1.4 (Confluence page 576978945), section 5.2 (results grouped by entity type with a count; counts capped at 20), read on 7 September 2026.",
         "Note: spec v1.4 (2026-09-04) caps every count in the modal at 20; earlier wording said the count reflected the true total. This case follows the current spec.")]},

 "44825": {"custom_expected": [[
    "1. When a result group has more than five matches, a 'Show all N' link appears on that group's heading (for example 'Show all 12').",
    "2. A group with five or fewer matches shows no 'Show all' link.",
    "3. N never reads higher than 20 - a group with more than 20 matches shows 'Show all 20'.",
    "4. The 'Show all' link is available for every entity group, including Assets."],
    prov("This is the expected behaviour as per epic SV-9160 and the Global Search - Product Requirements specification version 1.4 (Confluence page 576978945), section 5.2 (Show all; counts capped at 20), read on 7 September 2026.",
         "Note: earlier this case carried an Assets exception (no 'Show all' on Assets, per the designer's Slack answer, because there was no vehicles list page to open). Spec v1.4 (2026-09-04) makes 'Show all' switch to an in-modal scope tab rather than a list page, so the exception's reason is gone and every group gets 'Show all'. This reverses the earlier Slack answer and is raised for the PO on the question sheet; this case follows the current spec meanwhile.")]},

 "44826": {"custom_steps": [[
    "2. Click the 'Show all 12' link on the Work Orders group heading.",
    "3. Look at what happens: does the search modal stay open, and what does the Work Orders scope tab show?"]],
   "custom_expected": [[
    "1. The search modal stays open and switches to the Work Orders scope tab - you do not leave the modal, and no separate list page or full-page results screen opens.",
    "2. The scoped tab shows up to 20 matching rows, scrolled inside the modal.",
    "3. There is no pagination, no further loading, and no 'Show all' link inside the scoped tab - reaching a record beyond the 20 means narrowing the query.",
    "4. There is no results banner and no hand-off of the term to a list page's search box."],
    prov("This is the expected behaviour as per epic SV-9160 and the Global Search - Product Requirements specification version 1.4 (Confluence page 576978945), section 5.2 (Show all) and the v1.4 change log, read on 7 September 2026.",
         "Note: spec v1.4 (2026-09-04) replaced the earlier full-page hand-off (land on the list page, term in its search box, filters reset) with an in-modal scope tab; the full-page results screen, the query hand-off, the results banner and its Clear-search action are all dropped. This case follows the current spec.")]},

 "44869": {"custom_expected": [[
    "1. On hover, the Part row shows a single quick action: 'View part history'.",
    "2. 'Add to work order' and 'Add part' are not offered on the Part row.",
    "3. Clicking the Part row itself opens the INVENTORY part (on-hand quantity and stock status), not the catalogue entry.",
    "4. The action is non-destructive and is also reachable from the part's own record and by keyboard."],
    prov("This is the expected behaviour as per epic SV-9160 and the Global Search - Product Requirements specification version 1.4 (Confluence page 576978945), section 5.4 (quick actions) and the v1.4 change log, read on 7 September 2026.",
         "Note: spec v1.4 (2026-09-04) makes 'View part history' the Part row's only quick action and drops 'Add to work order' / 'Add part'. This case follows the current spec.")]},

 "44871": {"custom_steps": [[
    "1. Move the mouse pointer over the Part row while you are editing a work order elsewhere in the app.",
    "2. Look at the button(s) that appear on the right side of the row."]],
   "custom_expected": [[
    "1. Even while you are editing a work order elsewhere, the Part row's only quick action is 'View part history'.",
    "2. There is no 'Add to work order' button on the Part row - that action was dropped.",
    "3. The action is non-destructive and is also reachable from the part's own record and by keyboard."],
    prov("This is the expected behaviour as per epic SV-9160 and the Global Search - Product Requirements specification version 1.4 (Confluence page 576978945), section 5.4 (quick actions) and the v1.4 change log, read on 7 September 2026.",
         "Note: earlier this case asserted an 'Add to work order' action on the Part row while editing a work order; spec v1.4 (2026-09-04) drops it, leaving 'View part history' as the only Part quick action. This case follows the current spec.")]},

 "44873": {"custom_expected": [[
    "1. On hover, a quick-action button appears on the right of the row for each entity that has one - shown unconditionally (there is no state that hides the action for an entity that has one).",
    "2. The actions by entity are: Work Order to 'Add new line'; Customer to 'New work order' and 'New contact'; Asset to 'New work order' plus history and invoices icon buttons; Part to 'View part history'; Vendor to 'Add contact'; Part Sale to 'Add part'; Purchase Order to 'Receive'; Vendor Invoice to none.",
    "3. The action that needs a target work order ('Add new line') acts on the work order the user is currently editing elsewhere in the app.",
    "4. No quick action deletes or changes data destructively, and every action is also reachable from the entity's own record and by keyboard."],
    prov("This is the expected behaviour as per epic SV-9160 and the Global Search - Product Requirements specification version 1.4 (Confluence page 576978945), section 5.4 (quick actions) and the v1.4 change log, read on 7 September 2026.",
         "Note: spec v1.4 (2026-09-04) makes 'View part history' the Part row's only quick action, dropping 'Add to work order'. This case follows the current spec.")]},

 "44874": {"custom_expected": [[
    "1. The Work Orders list filters to only the rows matching the term.",
    "2. The term stays in the list's search box - there is no separate 'Showing N ... matching' banner.",
    "3. The list columns remain: On Site, Status, Number, Customer, Asset, Unit, VIN/Serial #, Progress, Service Advisor, Lead Technician, Clocked In, Lines, Total Price."],
    prov("This is the expected behaviour as per epic SV-9160 and the Global Search - Product Requirements specification version 1.4 (Confluence page 576978945), section 5.2 and the page-search cutover, read on 7 September 2026.",
         "Note: earlier this case said any saved filters are reset when landing here from the global-search 'Show all' hand-off; spec v1.4 (2026-09-04) drops that hand-off entirely ('Show all' now switches to an in-modal scope tab), so this case covers only the Work Orders list page's own in-place search. This case follows the current spec.")]},

 "44875": {"custom_expected": [[
    "1. The filter is removed and the full Work Orders list is shown again.",
    "2. There is no banner to dismiss - clearing the search box is what restores the list."],
    prov("This is the expected behaviour as per epic SV-9160 and the Global Search - Product Requirements specification version 1.4 (Confluence page 576978945), section 5.2 and the page-search cutover, read on 7 September 2026.",
         "Note: earlier this case referenced the global-search 'Show all' hand-off and reset filters; spec v1.4 (2026-09-04) drops that hand-off, so this case covers only the Work Orders list page's own in-place search. This case follows the current spec.")]},

 "45136": {"custom_steps": [[
    "2. Type a term that returns results across several groups and look for a 'Show all' overflow.",
    "3. Note that there is no physical keyboard on the phone for row navigation."]],
   "custom_expected": [[
    "1. On mobile there is no 'Show all' overflow: the All view shows the full grouped list (uncapped), and a chip-scoped list shows up to 20 rows. The web 'Show all' - which switches the desktop modal to a scope tab - has no mobile equivalent.",
    "2. Keyboard navigation does not apply on mobile in v1."],
    prov("This is the expected behaviour as per epic SV-9160 and the Global Search - Product Requirements specification version 1.4 (Confluence page 576978945), section 5.6 (mobile - deferred items), read on 7 September 2026.",
         "Note: in spec v1.4 (2026-09-04) the web 'Show all' is an in-modal scope tab (no longer a full-page hand-off); mobile has no such overflow. This case follows the current spec.")]},
}

def text_of(blocks):
    return '\n\n'.join('\n'.join(b) for b in blocks)

missing_prov = []
for cid, rec in out.items():
    fields = rec['fields']
    if cid in REWRITES:
        for f, blocks in REWRITES[cid].items():
            if f not in fields:
                fields[f] = {}
            fields[f]['blocks'] = blocks
            fields[f]['text'] = text_of(blocks)
        # re-stamp any field NOT explicitly rewritten (e.g. preconds) too
        for f, v in fields.items():
            if f in REWRITES[cid]:
                continue
            v['blocks'] = [[restamp_line(l) for l in b] for b in v['blocks']]
            v['text'] = text_of(v['blocks'])
    else:
        found = False
        for f, v in fields.items():
            newblocks = [[restamp_line(l) for l in b] for b in v['blocks']]
            if newblocks != v['blocks']:
                found = True
            v['blocks'] = newblocks
            v['text'] = text_of(newblocks)
        if not found:
            missing_prov.append(cid)

json.dump(out, open(OUT, 'w'), ensure_ascii=False, indent=1)
print(f"wrote {OUT}: {len(out)} cases")
print(f"rewritten (content): {sorted(int(c) for c in REWRITES)}")
print(f"cases where NO provenance substring was found to restamp: {sorted(int(c) for c in missing_prov)}")
