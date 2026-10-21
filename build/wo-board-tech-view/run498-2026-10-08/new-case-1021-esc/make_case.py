"""21 Oct 2026 — QA lead: "Prepare defect if something is going against the PRD." PRD v73 S11-R5 (Escape closes an open menu) vs the build:
after clicking into the Technician list's "Search technician" box, Escape does not close the list. Every ticket ends with its test case
(Rule 120), so this test is written first, in section 13246 (S11 — Keyboard access and focus). Same payload builder as new-case-1020."""
import json, os, sys, html
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../../testing-tools'))
import tr_client as t, testrail_add_case as ac
Q = 'Escape closes an open menu, dialog or tooltip without changing anything.'
SETUP = ('<p><strong><a href="https://github.com/bilalmuzamil-sketch/Manual-test-Cases/blob/claude/slack-session-setup-7v5itm/build/wo-board-tech-view/'
         'v61-pass-2026-10-16/two-audience/WO-BOARD-SETUP-FILE.md">Setup file (for Claude sessions; a tester does not need it)</a></strong></p><p></p>')
PRE = SETUP + ('<p><strong>Preconditions</strong></p><ul>'
  '<li>You are signed in with the "Admin" role at {Location-A}, in a browser window at least 1024 px wide.<br>For example: {Location-A} is Staging Heavy Duty - 9919.</li>'
  '<li>{Location-A} has at least one technician.<br>For example: Ralph Edwards.</li>'
  '<li>Starting screen: "Work Orders" &gt; "All" tab, "Board View" shown, "Search" empty, no filter chosen.</li>'
  '<li>If any of the above is missing, mark this test Blocked: "setup not done".</li></ul>')
STEPS = ('<ol><li>Click the "Technician" filter.</li>'
  '<li>Press Escape.</li>'
  '<li>Click the "Technician" filter again, then click inside the "Search technician" box at the top of the list.</li>'
  '<li>Press Escape.</li>'
  '<li>Click the "Technician" filter (if the list is closed), click inside "Search technician" and type the first name of a technician (for example Ralph).</li>'
  '<li>Press Escape.</li>'
  '<li>Click "Tech View" in the display switcher and repeat steps 1 to 6.</li></ol>')
EXP = ('<p><strong>Expected results</strong></p><ul>'
  '<li>Step 1: the Technician list opens.</li>'
  '<li>Step 2: the list closes and nothing is ticked.</li>'
  '<li>Step 3: the list opens and the cursor is in "Search technician".</li>'
  '<li>Step 4: the list closes and nothing is ticked.</li>'
  '<li>Step 6: the list closes and nothing is ticked.</li>'
  '<li>Step 7: the same in Tech View.</li></ul>'
  '<p><strong>Exact quotes from the source (for reproducibility)</strong></p>'
  '<p>From: PRD "Work Orders — Board View &amp; Tech View Display Options", Confluence 845185030, version 73 (21 Oct 2026, Chris Ward), read 21 Oct 2026 &middot; Epic SV-10043, story SV-10054 (Story 11, Keyboard access and focus)</p>'
  '<ul><li><strong>S11-R5:</strong> &ldquo;' + html.escape(Q, quote=False) + '&rdquo;</li></ul><hr />'
  '<p>AUTOMATION: READY</p>')
s, cf = t.get('get_case_fields'); ac.assert_current(cf)
body = ac.add_case_payload('Escape closes the Technician list, also after clicking into its search box', refs='SV-10043,SV-10054',
    preconds=PRE, steps=STEPS, expected=EXP, type_id=7, priority_id=2, automation_type=ac.AUTOMATION_TYPE['Functional'])
body = {k.replace('preconds', 'custom_preconds').replace('steps', 'custom_steps').replace('expected', 'custom_expected') if k in ('preconds', 'steps', 'expected') else k: v for k, v in body.items()}
D = os.path.dirname(os.path.abspath(__file__))
json.dump({'payload': body}, open(os.path.join(D, 'payload.json'), 'w'), indent=1)
if '--write' in sys.argv:
    s, c = t.post('add_case/13246', body); print('add_case', s, c.get('id'), c.get('title'))
    json.dump(c, open(os.path.join(D, 'created.json'), 'w'), indent=1)
else:
    print(json.dumps({k: (v if not isinstance(v, str) else v[:80]) for k, v in body.items()}, indent=1))
