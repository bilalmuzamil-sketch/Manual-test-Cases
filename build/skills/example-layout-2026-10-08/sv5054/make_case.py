# Sample case for SV-5054 (QA lead 2026-10-09: "Create a sample test case for this … I still want to see if you create it the best possible way for a manual QA tester can run it").
import sys, json; sys.path.insert(0, 'build/maintenance-reminder-v2')
from mr_lib import api
D = 'build/skills/example-layout-2026-10-08/sv5054'
DOC = sys.argv[1] if len(sys.argv) > 1 else '#'
pre = (f'<p><strong><a href="{DOC}">Setup (manual QA tester and Claude session)</a></strong></p><p></p><p><strong>Preconditions</strong></p><ul>'
 '<li>You are signed in as an Owner or Admin at {Location-A} (for example Staging Heavy Duty - 9919).</li>'
 '<li>Vendor {Vendor-A} (for example ZZAUTOTEST SV5054 Parts Supply) exists.</li>'
 '<li>Work order {Work-order-1} (for example S2-15440) has an approved line, {Line-1} (for example "Replace - Wiper blade").</li>'
 '<li>Special order part {Part-A} (for example ZZAUTOTEST-SV5054-01, a wiper blade) was ordered from {Vendor-A} on {Line-1} with quantity 1, and it has been received.</li>'
 '<li>{Part-A} has not been returned yet.</li></ul>')
steps = ('<ol><li>Open {Work-order-1} and go to its Lines tab.</li>'
 '<li>Return {Part-A} from {Line-1} with quantity 1.</li>'
 '<li>Change the return quantity of {Part-A} on {Line-1} to 2.</li>'
 '<li>Go to Parts &gt; Returns.</li>'
 '<li>Find the return line for {Part-A} from {Vendor-A}.</li>'
 '<li>Enter Accepted Qty 1.</li>'
 '<li>Process the credit for {Part-A}.</li>'
 '<li>Open {Work-order-1} again and go to its Lines tab.</li>'
 '<li>Change the return quantity of {Part-A} on {Line-1} back to 1.</li>'
 '<li>Go to Parts &gt; Returns.</li>'
 '<li>Look for {Part-A} from {Vendor-A}.</li></ol>')
exp = ('<p><strong>Expected results</strong></p><ul>'
 '<li>Step 7: the credit for quantity 1 of {Part-A} is processed.</li>'
 '<li>Step 11: there is no line for {Part-A} with Requested Return Qty 0.</li>'
 '<li>Step 11: if {Part-A} is still listed, its Requested Return Qty shows only the quantity still waiting to be returned. With the example data nothing is still waiting, so {Part-A} should not be listed.</li></ul>'
 '<p><strong>What you may see today</strong><br>'
 'SV-5054 was closed as Obsolete on 20 Aug 2026 without a fix. The reported problem: after step 11, {Part-A} is still listed with Requested Return Qty 0, and trying to credit it shows "Cannot return zero or less parts."<br>'
 '1. You see exactly that: mark the case Failed. Raise nothing new; it is the SV-5054 problem.<br>'
 '2. It fails in a different way: that is a new problem. Report it.<br>'
 '3. It passes: tell the QA lead.</p>'
 '<p><strong>Source &mdash; where this behaviour comes from</strong><br>'
 'Jira SV-5054 "Returns – Requested Return Qty Showing as 0 for Previously Returned Wiper Blade (Lordco Credit)" (Bug, OBSOLETE 20 Aug 2026, closed without a fix after the bug squad review): Expected Result; '
 'comment by Nebojsa Glavinic, 27 Nov 2025 (steps to reproduce and what should not happen). '
 'Read 9 Oct 2026. Source-verified 9 October 2026; not yet build-verified.</p>'
 '<p><strong>Exact quotes from the source (for reproducibility)</strong></p><ul>'
 '<li><strong>SV-5054 comment, Nebojsa Glavinic, 27 Nov 2025, results of the steps:</strong> &ldquo;A credit with qty 1 will be processed&rdquo;</li>'
 '<li><strong>SV-5054 comment, Nebojsa Glavinic, 27 Nov 2025:</strong> &ldquo;On returns page item with 0 qty should not exist at all&rdquo;</li>'
 '<li><strong>SV-5054 Expected Result:</strong> &ldquo;Requested Return Qty should accurately reflect the quantity still pending return.&rdquo; and &ldquo;If the item has already been fully returned/credited, it should not appear as an open return line, or Qty should clearly show the remaining quantity (if any).&rdquo;</li></ul>'
 '<p>AUTOMATION: HOLD - not yet build-verified</p>')
payload = {'title': 'Crediting a returned part leaves no zero-quantity line on the Returns page',
           'custom_preconds': pre, 'custom_steps': steps, 'custom_expected': exp}
try: cfg = json.load(open(f'{D}/ids.json'))
except FileNotFoundError: cfg = {}
if not cfg:
    sec = api('add_section/1', {'suite_id': 1, 'name': 'ZZ - Layout samples (to be retired)'})
    json.dump({'section': sec['id']}, open(f'{D}/ids.json', 'w'))
    c = api(f"add_case/{sec['id']}", dict(payload, template_id=1, type_id=7, priority_id=2, custom_automation_type=2, custom_atmstatus=1))
    cfg = {'section': sec['id'], 'case': c['id']}; json.dump(cfg, open(f'{D}/ids.json', 'w'))
else:
    before = api(f"get_case/{cfg['case']}"); assert before['created_by'] == 3
    api(f"update_case/{cfg['case']}", payload)
a = api(f"get_case/{cfg['case']}"); json.dump(a, open(f'{D}/C{a["id"]}.json', 'w'), indent=1)
print(cfg, all((a.get(k) or '') == v for k, v in payload.items()), len(payload['title']))
