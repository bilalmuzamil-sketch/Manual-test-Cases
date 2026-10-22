"""22 Oct 2026 — QA lead, on the three usage-tracking cases C97025, C97027, C97035 (named in the question, answered "Question 1: a"):
option (a) = "Change the spacing step in all three tests to Tech View, and in the third test change the expected number from 2 to 1."
Rule 114(c): only these cases; C97025 / C97027 Expected text unchanged; C97035 Expected: work_orders_density_load 2 -> 1 and the grand
total that sums it (41 -> 40) — the arithmetic consequence of his number, said in the report. Source line added to each: PRD v73
(21 Oct 2026, Chris Ward) S3-R11 + S6-R1, read live 22 Oct 2026 (source-verify-2026-10-21/prd-845185030-v73-read-1022.txt).
Before/after JSON beside this file; --write applies."""
import json, os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../../testing-tools'))
import tr_client as t
D = os.path.dirname(os.path.abspath(__file__))
SRC = ('<p>Spacing (density) steps: PRD &ldquo;Work Orders &mdash; Board View &amp; Tech View Display Options&rdquo;, Confluence 845185030, version 73 '
       '(21 Oct 2026, Chris Ward), read 22 Oct 2026 &mdash; S3-R11: &ldquo;Board View shows no Density control in this release (SV-11580).&rdquo; '
       'S6-R1: &ldquo;Offer Compact, Regular, and Comfortable density in Tech View. Board View has no Density control in this release (S3-R11).&rdquo; '
       'QA lead, 22 Oct 2026: the density step is done in Tech View.%s</p>')
QUOTES = '<p><strong>Exact quotes from the source (for reproducibility)</strong></p>'
CH = {
 97025: {'steps': [('<li>Open the Density control and pick Compact.</li>', '<li>Click Tech View in the display switcher, open the Density control and pick Compact.</li>'),
                   ('<li>Open the density control again and pick Compact again (the value it already has).</li>', '<li>In Tech View, open the density control again and pick Compact again (the value it already has).</li>'),
                   ('<li>Open Fields to display and close it without changing anything.</li>', '<li>Click Board View, open Fields to display and close it without changing anything.</li>')],
         'exp': [(QUOTES, SRC % '' + QUOTES)]},
 97027: {'steps': [('<li>Open Fields to display and turn VIN/Serial on, then change the density.</li>', '<li>Open Fields to display and turn VIN/Serial on. Then click Tech View and change the density.</li>')],
         'exp': [(QUOTES, SRC % '' + QUOTES)]},
 97035: {'steps': [('<li>Click Tech View in the display switcher at the right of the toolbar (tooltip "Tech View").</li><li>In Board View', '<li>Click Tech View in the display switcher at the right of the toolbar (tooltip "Tech View"), then pick Compact density from its density button.</li><li>In Board View'),
                   ('<li>Pick Compact density.</li>', '<li>Leave the density as it is (Compact was picked in Tech View at step 4).</li>')],
         'exp': [('<li>work_orders_density_load = 2 (once for each of the two displays).</li>', '<li>work_orders_density_load = 1 (Tech View only; Board View has no density in this release).</li>'),
                 ('Grand total = 5 + 30 + 2 + 3 + 1 = 41 events.', 'Grand total = 5 + 30 + 1 + 3 + 1 = 40 events.'),
                 ('<p>Last checked against build v26.40.8-7a95011 on 10/8/2026.</p>', SRC % ' QA lead, 22 Oct 2026: work_orders_density_load is 1 (was 2), so the grand total is 40 (was 41).' + '<p>Last checked against build v26.40.8-7a95011 on 10/8/2026.</p>')]},
}
for cid, ch in CH.items():
    s, c = t.get(f'get_case/{cid}'); assert s == 200 and c['created_by'] != 1 and c.get('custom_atmstatus') != 3
    st, ex = c['custom_steps'], c['custom_expected']
    for o, n in ch['steps']: assert st.count(o) == 1, (cid, o[:60]); st = st.replace(o, n)
    for o, n in ch['exp']: assert ex.count(o) == 1, (cid, o[:60]); ex = ex.replace(o, n)
    json.dump({'custom_steps': c['custom_steps'], 'custom_expected': c['custom_expected']}, open(os.path.join(D, f'C{cid}-before.json'), 'w'), indent=1)
    if '--write' in sys.argv:
        s, r = t.post(f'update_case/{cid}', {'custom_steps': st, 'custom_expected': ex}); s2, c2 = t.get(f'get_case/{cid}')
        print(cid, 'update', s, 'read back ok', c2['custom_steps'] == st and c2['custom_expected'] == ex and c2['custom_preconds'] == c['custom_preconds'] and c2['title'] == c['title'])
        json.dump({'custom_steps': c2['custom_steps'], 'custom_expected': c2['custom_expected']}, open(os.path.join(D, f'C{cid}-after.json'), 'w'), indent=1)
    else: print(cid, 'dry run ok')
