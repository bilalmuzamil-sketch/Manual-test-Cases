"""22 Oct 2026 — QA lead, on C368154 (named): "Yes, rewrite step 4 to Tech View and never the PRD" (asked: Board View has no density
control in this release, PRD v73 S3-R11 / S6-R1, so step 4 cannot be run; move the reading to Tech View). Rule 114(c): only this case.
Step 4 now reads the density in Tech View and returns to Board View for step 5; the Expected sentences stay word for word ("Step 4:
Regular is selected (the default density)" — S6-R5 is unchanged in v73). One source line is added for step 4 quoting PRD v73 (21 Oct 2026,
Chris Ward) S6-R1, read live 22 Oct 2026 (source-verify-2026-10-21/prd-845185030-v73-read-1022.txt). Before/after beside this file; --write applies."""
import json, os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../../testing-tools'))
import tr_client as t
D = os.path.dirname(os.path.abspath(__file__)); CID = 368154
OLD_S4 = '<li>Open the density control and read the selected value.</li>'
NEW_S4 = ('<li>Click Tech View in the display switcher (tooltip "Tech View"), open the density control (the button just right of '
          '"Asset on Site") and read the selected value. Close the menu and click Board View again.</li>')
OLD_SRC = '<p>Last checked against build v26.40.8-7a95011 on 10/8/2026.</p>'
NEW_SRC = ('<p>Step 4: PRD &ldquo;Work Orders &mdash; Board View &amp; Tech View Display Options&rdquo;, Confluence 845185030, version 73 '
           '(21 Oct 2026, Chris Ward), S6-R1, read 22 Oct 2026: &ldquo;Offer Compact, Regular, and Comfortable density in Tech View. Board View has no '
           'Density control in this release (S3-R11).&rdquo; QA lead, 22 Oct 2026: step 4 reads the density in Tech View, because Board View has no '
           'density control in this release.</p>' + OLD_SRC)
s, c = t.get(f'get_case/{CID}'); assert s == 200 and c['created_by'] != 1 and c.get('custom_atmstatus') != 3
st, ex = c['custom_steps'], c['custom_expected']
assert st.count(OLD_S4) == 1 and ex.count(OLD_SRC) == 1
json.dump({'custom_steps': st, 'custom_expected': ex}, open(os.path.join(D, f'C{CID}-before.json'), 'w'), indent=1)
st2 = st.replace(OLD_S4, NEW_S4); ex2 = ex.replace(OLD_SRC, NEW_SRC)
if '--write' in sys.argv:
    s, r = t.post(f'update_case/{CID}', {'custom_steps': st2, 'custom_expected': ex2}); print('update_case', s)
    s, c2 = t.get(f'get_case/{CID}')
    print('read back ok', c2['custom_steps'] == st2 and c2['custom_expected'] == ex2 and c2['custom_preconds'] == c['custom_preconds'] and c2['title'] == c['title'])
    json.dump({'custom_steps': c2['custom_steps'], 'custom_expected': c2['custom_expected']}, open(os.path.join(D, f'C{CID}-after.json'), 'w'), indent=1)
else: print('dry run ok')
