"""22 Oct 2026 — QA lead, on C590120 (named): "YES (Rewrite the test case and never the PRD)" to the ask "rewrite only steps 6 and 7 and
their expected lines to the current spec". Rule 114(c): the Expected may change only for the case he names, and only those lines.
Steps 6-7 asked for Board View's density button, removed by PRD v73 S3-R11; the new lines quote PRD v73 (21 Oct 2026, Chris Ward),
read live 22 Oct 2026: S3-R11 and S6-E1. Nothing else in the case changes. Before/after snapshots beside this file; --write applies."""
import json, os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../../testing-tools'))
import tr_client as t
D = os.path.dirname(os.path.abspath(__file__)); CID = 590120
OLD_S6 = '<li>Change density to Compact and inspect WO1.</li><li>Change density to Comfortable and inspect WO1.</li>'
NEW_S6 = ('<li>Look at the Board View toolbar between the filters and the display switcher.</li>'
          '<li>Click Tech View in the display switcher, choose Compact and then Comfortable from its density button, click Board View again and inspect WO1.</li>')
OLD_E6 = ('<p><strong>Step 6:</strong> Spacing decreases, while the same fields and values remain visible, including progress and total. Text stays at 14 px, '
          'secondary text at 12 px, Board avatars at 24 px and status pills at 22 px.</p><p><strong>Step 7:</strong> Spacing increases, with the same fields, values '
          'and text sizes retained. Board avatars remain 24 px and status pills 22 px.</p>')
NEW_E6 = ('<p><strong>Step 6:</strong> &ldquo;Board View shows no Density control in this release (SV-11580).&rdquo; (PRD v73, S3-R11)</p>'
          '<p><strong>Step 7:</strong> &ldquo;Density applies to Tech View rows on Work Orders; Board View cards keep their current spacing in this release.&rdquo; '
          '(PRD v73, S6-E1) In plain words (our restatement): WO1&rsquo;s card looks the same as at step 2.</p>')
OLD_SRC = 'S6-R2/R4/R6, S7-R1 and S2-R23; attached Board Detailed/Compact design images.</p>'
NEW_SRC = ('S6-R2/R4/R6, S7-R1 and S2-R23; attached Board Detailed/Compact design images.</p>'
           '<p>Steps 6 and 7: PRD &ldquo;Work Orders &mdash; Board View &amp; Tech View Display Options&rdquo;, Confluence 845185030, version 73 '
           '(21 Oct 2026, Chris Ward), S3-R11 and S6-E1, read 22 Oct 2026. QA lead, 22 Oct 2026: steps 6 and 7 follow the current PRD (Board View has no density button).</p>')
s, c = t.get(f'get_case/{CID}'); assert s == 200 and c['created_by'] != 1 and c.get('custom_atmstatus') != 3
st, ex = c['custom_steps'], c['custom_expected']
for old, txt in ((OLD_S6, st), (OLD_E6, ex), (OLD_SRC, ex)): assert txt.count(old) == 1, 'text not found exactly once: ' + old[:60]
json.dump({'custom_steps': st, 'custom_expected': ex}, open(os.path.join(D, f'C{CID}-before.json'), 'w'), indent=1)
st2 = st.replace(OLD_S6, NEW_S6); ex2 = ex.replace(OLD_E6, NEW_E6).replace(OLD_SRC, NEW_SRC)
if '--write' in sys.argv:
    s, r = t.post(f'update_case/{CID}', {'custom_steps': st2, 'custom_expected': ex2}); print('update_case', s)
    s, c2 = t.get(f'get_case/{CID}')
    print('read back ok', c2['custom_steps'] == st2 and c2['custom_expected'] == ex2 and c2['custom_preconds'] == c['custom_preconds'] and c2['title'] == c['title'])
    json.dump({'custom_steps': c2['custom_steps'], 'custom_expected': c2['custom_expected']}, open(os.path.join(D, f'C{CID}-after.json'), 'w'), indent=1)
else: print('dry run ok')
