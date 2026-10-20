"""20 Oct 2026 — QA lead: add a test for the 50-value limit message (PRD v69 S1-R15c), add it to run 498 and mark it Blocked on SV-11575,
naming the ticket in the result comment, NOT in the test case. Created through the canonical payload builder; the three text fields are then
re-saved through TestRail's editor (ui_write_all3.mjs) so they render (fr-view)."""
import json, os, sys, html
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../../testing-tools'))
import tr_client as t, testrail_add_case as ac
Q = open(os.path.join(os.path.dirname(__file__), 'S1-R15c-quote.txt')).read().strip()
SETUP = ('<p><strong><a href="https://github.com/bilalmuzamil-sketch/Manual-test-Cases/blob/claude/slack-session-setup-7v5itm/build/wo-board-tech-view/'
         'v61-pass-2026-10-16/two-audience/WO-BOARD-SETUP-FILE.md">Setup file (for Claude sessions; a tester does not need it)</a></strong></p><p></p>')
PRE = SETUP + ('<p><strong>Preconditions</strong></p><ul>'
  '<li>You are signed in with the "Admin" role at {Location-A}, in a browser window at least 1024 px wide.<br>For example: {Location-A} is Staging Heavy Duty - 9919.</li>'
  '<li>{Location-A} has at least one technician.<br>For example: Esther Howard.</li>'
  '<li>Starting screen: "Work Orders" &gt; "All" tab, "Tech View" shown, "Search" empty, no filter chosen, "Assigned to me" off.</li>'
  '<li>If any of the above is missing, mark this test Blocked: "setup not done".</li></ul>')
STEPS = ('<ol><li>Click the "Technician" filter.</li>'
  '<li>Look at the bottom of the list that opens, above "Clear selection".</li>'
  '<li>Tick "Unassigned".</li>'
  '<li>Press Escape. Click "Board View" in the display switcher, then click the "Technician" filter.</li>'
  '<li>Untick "Unassigned" and look at the bottom of the list again.</li></ol>')
EXP = ('<p><strong>Expected results</strong></p><ul>'
  '<li>Step 1: the list opens, starting with "Unassigned".</li>'
  '<li>Step 2: the message "This change would exceed the 50-value limit across all filters" does not show.</li>'
  '<li>Step 3: "Unassigned" is ticked and the message does not show.</li>'
  '<li>Step 4: the Board View list opens with "Unassigned" still ticked, and the message does not show.</li>'
  '<li>Step 5: nothing is ticked and the message does not show.</li></ul>'
  '<p><strong>Exact quotes from the source (for reproducibility)</strong></p>'
  '<p>From: PRD "Work Orders — Board View &amp; Tech View Display Options", Confluence 845185030, version 69 (20 Oct 2026), read 20 Oct 2026 &middot; Epic SV-10043, story SV-10044 (Story 1, Switch between display options)</p>'
  '<ul><li><strong>S1-R15c:</strong> &ldquo;' + html.escape(Q, quote=False) + '&rdquo;</li></ul><hr />'
  '<p>AUTOMATION: READY</p>')
s, cf = t.get('get_case_fields'); ac.assert_current(cf)
body = ac.add_case_payload('The 50-value limit message never shows just from opening the Technician list', refs='SV-10043,SV-10044',
    preconds=PRE, steps=STEPS, expected=EXP, type_id=7, priority_id=2, automation_type=ac.AUTOMATION_TYPE['Functional'])
body = {k.replace('preconds', 'custom_preconds').replace('steps', 'custom_steps').replace('expected', 'custom_expected') if k in ('preconds', 'steps', 'expected') else k: v for k, v in body.items()}
json.dump({'payload': body}, open('payload.json', 'w'), indent=1)
if '--write' in sys.argv:
    s, c = t.post('add_case/13236', body); print('add_case', s, c.get('id'), c.get('title'))
    json.dump(c, open('created.json', 'w'), indent=1)
    new = {str(c['id']): {'custom_preconds': PRE, 'custom_steps': STEPS, 'custom_expected': EXP}}; json.dump(new, open('new-fields.json', 'w'), indent=1)
else:
    print(json.dumps({k: (v if not isinstance(v, str) else v[:80]) for k, v in body.items()}, indent=1))
