"""Make C614719 (run 498 test 4007027) runnable by a manual tester (QA lead, 20 Oct 2026: "We need to correct it to make it
runnable by a manual QA tester"). Keeps every condition Vladimir added on 19 Oct (four technicians, Technician C last and not
pinned, Customer-C / WO-4, window sizes) and writes the steps 8-13 his preconditions refer to. Steps 1-7 and their expected
results are kept word for word. Run: python3 fix_c614719.py  (writes payload; the push is done separately)."""
import json, html
D = '/home/user/Manual-test-Cases/build/sv11466-11467-11422-2026-10-19/testcases-2026-10-19/'
c = json.load(open(D + 'C614719-pre-edit.json'))
e = html.escape

pre = ['Needs: 1 user · 1 browser · about 15 minutes (plus setup, if the records below do not exist yet).',
       'Sign in as an Admin user (on staging or a QA branch: the Admin quick-login button on the sign-in page; you appear as "Admin ShopView") at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919 (shown in the top bar next to the bell; to change it click your initials at the top right > Change Location).',
       'At least four technicians are active at {Location-A} with the "Technician" role and Time Clock on: {Technician-A}, {Technician-B} and at least two more. For example: {Technician-A} is ZZAUTOTEST C614719 Ana and {Technician-B} is ZZAUTOTEST C614719 Ben.',
       '{Technician-C} is the technician whose column is the LAST one on the Board View (scroll the board all the way to the right to see who it is), and who is not pinned. Their group is also the last one in Tech View.',
       'Customer {Customer-A} has two Approved work orders: {Work-order-1} led by {Technician-A} and {Work-order-2} led by {Technician-B}. Customer {Customer-B} has one Approved work order with no lead technician, {Work-order-3}. Both customer names start with the same text, {Search-A}. For example: {Customer-A} is ZZAUTOTEST C614719 Keyboard A, {Customer-B} is ZZAUTOTEST C614719 Keyboard B and {Search-A} is ZZAUTOTEST C614719 Keyboard.',
       'Customer {Customer-C}, whose name does NOT contain {Search-A}, has one Approved work order, {Work-order-4}, led by {Technician-C}.',
       '{Technician-A} is pinned first and {Technician-B} second (pin icon on their column or group heading), and no other technician is pinned.',
       'Starting screen: Work Orders > "All" tab, "Tech View" shown, {Search-A} in "Search", no filter chosen, "Assigned to me" off, every group expanded, the page freshly opened so nothing has had keyboard focus yet.',
       'Window size: for steps 1 to 7 a normal full-screen desktop or laptop window. Steps 8 and 11 tell you when to make it smaller.',
       'If any record above is missing, mark this test Blocked: "setup not done".']
pre_html = '<p><strong>Preconditions</strong></p><ul>' + ''.join(f'<li>{e(x)}</li>' for x in pre) + '</ul>'

old_steps = c['custom_steps']
assert old_steps.count('<li>') == 7 and old_steps.endswith('</ol>'), 'steps 1-7 changed since the snapshot'
new_steps = ['Make the browser window narrower, about the width of a small laptop screen (1024 px). Board View is still shown.',
             'Replace the text in "Search" with the name of {Customer-C}, then click once in the "Search" box.',
             'Press Tab until something on the board shows a focus ring.',
             'Click "Tech View" in the display switcher. Then make the browser window shorter, so that only about two and a half technician headings show in the table.',
             'Click once in the "Search" box (it still shows the name of {Customer-C}).',
             'Press Tab until something in the table shows a focus ring.']
steps_html = old_steps[:-len('</ol>')] + ''.join(f'<li>{e(x)}</li>' for x in new_steps) + '</ol>'

exp = c['custom_expected']
anchor = "first card in {Technician-A}'s column, not on a column header.</li>"
anchor = e(anchor, quote=False)
if exp.count(anchor) != 1:   # stored form may use &#039; or ' for the apostrophe
    anchor = "first card in {Technician-A}&#039;s column, not on a column header.</li>"
    if exp.count(anchor) != 1:
        anchor = "first card in {Technician-A}'s column, not on a column header.</li>"
assert exp.count(anchor) == 1, 'step 7 expected text not found'
add = ['Step 9: only {Work-order-4} shows, as a card in {Technician-C}’s column, which is off to the right, out of sight. The "Unassigned" column has no cards.',
       'Step 10: the board scrolls sideways to {Technician-C}’s column and the focus ring lands on {Work-order-4}’s card, which is fully on the screen. It does not land on the "Unassigned" column header.',
       'Step 11: Tech View shows "Unassigned" (no work orders) and the first technicians’ groups; {Technician-C}’s group, with {Work-order-4}, is further down, out of sight.',
       'Step 13: the list moves down to {Technician-C}’s group. {Work-order-4}’s row sits just below {Technician-C}’s heading and has the blue focus ring; the whole row and its ring can be seen and the heading does not cover them. The ring is not on the "Unassigned" heading or any other heading.']
exp = exp.replace(anchor, anchor + ''.join(f'<li>{e(x)}</li>' for x in add))

S11R1 = ('Each view is a single Tab stop. Tab lands on one work order row (Tech View) or card (Board View), the one last focused, or, '
         'when none has been, the first work order shown in on-screen order: the first row or card in Unassigned, or the first technician’s '
         'first row or card when Unassigned is collapsed or empty (never a group or column header while a work order is shown; when every group '
         'is collapsed, Tab lands on the first group header; after the user arrows onto a header and tabs out and back in, Tab returns to a work '
         'order row while any row is shown; on Board View, if the last-focused card has scrolled out of view in its column, Tab lands on the first '
         'card in view); the focused row or card shows a visible focus ring.')
json.dump({'S11R1': S11R1}, open(D + 'c614719-s11r1-v68.json', 'w'), ensure_ascii=False)

src_old = 'version 62 (16 Oct 2026, Chris Ward), S11-R1, S2-R2 and S2-R17, read 16 Oct 2026.'
assert exp.count(src_old) == 1, 'source line changed'
exp = exp.replace(src_old, 'version 62 (16 Oct 2026, Chris Ward), S11-R1, S2-R2 and S2-R17, read 16 Oct 2026; S11-R1 re-read at version 68 on 20 Oct 2026 (unchanged). '
                  'Steps 8 to 13 (added 20 Oct 2026): Chris Ward in SV-11422, comment 79047 (19 Oct 2026), on a row hidden under its heading: '
                  '“not acceptable: the user has to be able to see which row they’re on”, asking for the whole row to sit just below the sticky heading with its blue focus ring visible, as Board View does with its card.')
json.dump({'custom_preconds': pre_html, 'custom_steps': steps_html, 'custom_expected': exp}, open(D + 'C614719-update-payload.json', 'w'), indent=1, ensure_ascii=False)
print('payload written; steps', steps_html.count('<li>'), '| expected bullets', exp.count('<li>'))
