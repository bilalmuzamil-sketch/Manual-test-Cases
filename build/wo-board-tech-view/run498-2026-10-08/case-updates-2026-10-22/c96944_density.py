"""22 Oct 2026 — QA lead, on C96944 (named, answered "a"): remove step 6 ("Change the density (Density control) to each available option
and look again.") and "at every density" from the Expected; re-run. Rule 114(c): this case only. A source line quotes PRD v73
(21 Oct 2026, Chris Ward) S3-R11, read live 22 Oct 2026, with the dated decision. Before/after beside this file; --write applies."""
import json, os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../../testing-tools'))
import tr_client as t
D = os.path.dirname(os.path.abspath(__file__)); CID = 96944
S_OLD = '<li>Change the density (Density control) to each available option and look again.</li>'
E_OLD = 'It stays in that place at every density and while the card is hovered'
E_NEW = 'It stays in that place while the card is hovered'
QUOTES = '<p><strong>Exact quotes from the source (for reproducibility)</strong></p>'
SRC = ('<p>PRD &ldquo;Work Orders &mdash; Board View &amp; Tech View Display Options&rdquo;, Confluence 845185030, version 73 (21 Oct 2026, Chris Ward), '
       'S3-R11, read 22 Oct 2026: &ldquo;Board View shows no Density control in this release (SV-11580).&rdquo; QA lead, 22 Oct 2026: the density step and '
       '&ldquo;at every density&rdquo; were removed from this test.</p>')
s, c = t.get(f'get_case/{CID}'); assert s == 200 and c['created_by'] != 1 and c.get('custom_atmstatus') != 3
st, ex = c['custom_steps'], c['custom_expected']; assert st.count(S_OLD) == 1 and ex.count(E_OLD) == 1 and ex.count(QUOTES) == 1
json.dump({'custom_steps': st, 'custom_expected': ex}, open(os.path.join(D, f'C{CID}-before.json'), 'w'), indent=1)
st2 = st.replace(S_OLD, ''); ex2 = ex.replace(E_OLD, E_NEW).replace(QUOTES, SRC + QUOTES)
if '--write' in sys.argv:
    s, r = t.post(f'update_case/{CID}', {'custom_steps': st2, 'custom_expected': ex2}); s2, c2 = t.get(f'get_case/{CID}')
    print('update', s, 'read back ok', c2['custom_steps'] == st2 and c2['custom_expected'] == ex2 and c2['title'] == c['title'] and c2['custom_preconds'] == c['custom_preconds'])
    json.dump({'custom_steps': c2['custom_steps'], 'custom_expected': c2['custom_expected']}, open(os.path.join(D, f'C{CID}-after.json'), 'w'), indent=1)
else: print('dry run ok')
