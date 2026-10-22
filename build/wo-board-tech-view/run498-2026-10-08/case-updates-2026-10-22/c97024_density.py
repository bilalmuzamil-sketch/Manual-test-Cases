"""22 Oct 2026 — QA lead, on C97024 (named, answered "a"): remove "There is also one work_orders_density_load event for Board View." from
the Expected and mark the test Passed on today's production readings. Rule 114(c): this case only, this sentence only. A source line is
added quoting PRD v73 (21 Oct 2026, Chris Ward) S3-R11, read live 22 Oct 2026, with the dated decision. Before/after beside this file."""
import json, os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../../testing-tools'))
import tr_client as t
D = os.path.dirname(os.path.abspath(__file__)); CID = 97024
OLD = ' There is also one work_orders_density_load event for Board View.'
QUOTES = '<p><strong>Exact quotes from the source (for reproducibility)</strong></p>'
SRC = ('<p>Step 2: PRD &ldquo;Work Orders &mdash; Board View &amp; Tech View Display Options&rdquo;, Confluence 845185030, version 73 (21 Oct 2026, Chris Ward), '
       'S3-R11, read 22 Oct 2026: &ldquo;Board View shows no Density control in this release (SV-11580).&rdquo; QA lead, 22 Oct 2026: Board View records no '
       'density event in this release, so that sentence was removed from Step 2.</p>')
s, c = t.get(f'get_case/{CID}'); assert s == 200 and c['created_by'] != 1 and c.get('custom_atmstatus') != 3
ex = c['custom_expected']; assert ex.count(OLD) == 1 and ex.count(QUOTES) == 1
json.dump({'custom_expected': ex}, open(os.path.join(D, f'C{CID}-before.json'), 'w'), indent=1)
ex2 = ex.replace(OLD, '').replace(QUOTES, SRC + QUOTES)
if '--write' in sys.argv:
    s, r = t.post(f'update_case/{CID}', {'custom_expected': ex2}); s2, c2 = t.get(f'get_case/{CID}')
    print('update', s, 'read back ok', c2['custom_expected'] == ex2 and c2['custom_steps'] == c['custom_steps'] and c2['title'] == c['title'])
    json.dump({'custom_expected': c2['custom_expected']}, open(os.path.join(D, f'C{CID}-after.json'), 'w'), indent=1)
else: print('dry run ok')
