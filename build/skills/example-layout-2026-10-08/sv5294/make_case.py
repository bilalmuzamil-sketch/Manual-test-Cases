# Sample case for SV-5294 (QA lead 2026-10-08: "Make a sample test case for this I just want to see how good you are making them").
import sys, json; sys.path.insert(0, 'build/maintenance-reminder-v2')
from mr_lib import api
D = 'build/skills/example-layout-2026-10-08/sv5294'
DOC = sys.argv[1] if len(sys.argv) > 1 else '#'
pre = (f'<p><strong><a href="{DOC}">Setup (manual QA tester and Claude session)</a></strong></p><p></p><p><strong>Preconditions</strong></p><ul>'
 '<li>You are signed in as an Owner or Admin at {Location-A} (for example Staging Heavy Duty - 9919).</li>'
 '<li>Work order {Work-order-1} (for example S2-15440) has an approved line, {Line-1} (for example "Replace - Brake pot").</li>'
 '<li>Part {Part-A} (for example ZZAUTOTEST-SV5294-01) is requested on {Line-1} with Source "Found".</li>'
 '<li>{Part-A} shows a Pick button.</li></ul>')
steps = ('<ol><li>Open {Work-order-1} and go to its Lines tab.</li>'
 '<li>Find {Part-A} on {Line-1}.</li>'
 '<li>Click Pick on {Part-A}.</li>'
 '<li>If a window opens, click its button to confirm the pick. Do not change anything in it.</li>'
 '<li>Refresh the page.</li></ol>')
exp = ('<p><strong>Expected results</strong></p><ul>'
 '<li>Step 3: no error message appears (for example, no message saying an error occurred and giving a request ID).</li>'
 '<li>Step 4: the pick completes and {Part-A} is picked. It no longer offers the Pick button.</li>'
 '<li>Step 5: after the refresh, {Part-A} still shows as picked, and no error message appears.</li></ul>'
 '<p><strong>Source &mdash; where this behaviour comes from</strong><br>'
 'Jira SV-5293 "BUG: App shows error when we try to pick found part" (Bug, Done 13 Jan 2026; fix verified on staging 24 Dec 2025): Steps and Expected. '
 'Jira SV-5294 "Error Occurs When Picking a Found Part on Work Order Line" (Bug, OBSOLETE, closed as a duplicate of SV-5293): Steps to Reproduce and Observed Result. '
 'Related: SV-6952 "Error Occurs When Requesting a Found Part on Work Order Line" (Bug, Done 5 May 2026), used for the setup only. '
 'Read 8 Oct 2026. Source-verified 8 October 2026; not yet build-verified.</p>'
 '<p><strong>Exact quotes from the source (for reproducibility)</strong></p><ul>'
 '<li><strong>SV-5293 Steps, step 3:</strong> &ldquo;Click Pick button on Found part&rdquo;</li>'
 '<li><strong>SV-5294 Observed Result (the failure this case must not show):</strong> &ldquo;System throws an error when attempting to pick the Found Part.&rdquo;</li>'
 '<li><strong>SV-5293 Expected:</strong> &ldquo;Part is picked&rdquo;</li>'
 '<li><strong>SV-5294 Observed Result (the failure this case must not show):</strong> &ldquo;The pick action does not complete.&rdquo;</li></ul>'
 '<p>AUTOMATION: HOLD - not yet build-verified</p>')
payload = {'title': 'Picking a Found part on a work order line completes without an error',
           'custom_preconds': pre, 'custom_steps': steps, 'custom_expected': exp}
cfg = json.load(open(f'{D}/ids.json')) if len(sys.argv) > 1 else {}
if not cfg:
    sec = {'id': 55301}  # created by the first attempt (add_section/1 'ZZ - Layout samples (to be retired)')
    c = api(f"add_case/{sec['id']}", dict(payload, template_id=1, type_id=7, priority_id=2, custom_automation_type=2, custom_atmstatus=1))
    cfg = {'section': sec['id'], 'case': c['id']}; json.dump(cfg, open(f'{D}/ids.json', 'w'))
else:
    before = api(f"get_case/{cfg['case']}"); assert before['created_by'] == 3
    api(f"update_case/{cfg['case']}", payload)
a = api(f"get_case/{cfg['case']}"); json.dump(a, open(f'{D}/C{a["id"]}.json', 'w'), indent=1)
print(cfg, all((a.get(k) or '') == v for k, v in payload.items()))
