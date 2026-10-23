"""23 Oct 2026 — QA lead: "While you are updating the test cases, make sure you do not update any test case BASED on a ticket which is not
deployed to production". The 'Assign lead technician / one click' wording (PRD v74 S3-R14/S4-R13) is SV-11524's change, still in Code
Review and NOT on production, so every such edit made today is put back to its earlier words. Kept: 'Column Selection' (SV-11580 is on
production v26.43.0-ffea43c: Board View's button aria-label "Column Selection", no density button — c698884-1021.json). --write applies."""
import glob, json, os, re, sys, time
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../../testing-tools'))
import tr_client as t
D = os.path.dirname(os.path.abspath(__file__))
OLD = "&gt; Reassign lead technician &gt; pick the technician &gt; Reassign"
NEWS = ["&gt; Assign lead technician &gt; click the technician; it is assigned at once",
        "&gt; Assign lead technician (an older screen shows Reassign lead technician) &gt; click the technician (if the window still shows a Reassign button, click it)"]
STEP_NEW = '<li>In the window, choose {Technician-B} with the arrow keys and press Enter.</li>'
STEP_OLD = '<li>In the window, choose {Technician-B} with the keyboard and confirm with the keyboard.</li>'
ids = set()
for d in ('../case-updates-2026-10-23b', '../case-updates-2026-10-23c'):
    ids |= {int(re.search(r'C(\d+)-before', f).group(1)) for f in glob.glob(os.path.join(D, d, 'C*-before.json'))}
log = {}
def get(cid):
    for k in range(6):
        s, c = t.get(f'get_case/{cid}')
        if isinstance(c, dict) and 'id' in c: return c
        time.sleep(4 * (k + 1))
    raise SystemExit(f'cannot read {cid}')
for cid in sorted(ids):
    c = get(cid); new = {}
    p = c.get('custom_preconds') or ''; p2 = p
    for n in NEWS: p2 = p2.replace(n, OLD)
    if p2 != p: new['custom_preconds'] = p2
    st = c.get('custom_steps') or ''
    if STEP_NEW in st and cid == 97022: new['custom_steps'] = st.replace(STEP_NEW, STEP_OLD)
    if not new: log[cid] = 'no SV-11524 wording'; continue
    json.dump({k: c[k] for k in new}, open(os.path.join(D, f'C{cid}-before.json'), 'w'), indent=1)
    if '--write' in sys.argv:
        for k in range(5):
            s, r = t.post(f'update_case/{cid}', new)
            if s == 200: break
            time.sleep(5 * (k + 1))
        c2 = get(cid); ok = all(c2.get(k) == v for k, v in new.items()) and c2['custom_expected'] == c['custom_expected']
        log[cid] = f'reverted {s} read back {ok} {list(new)}' + (' AUTOMATED' if c.get('custom_atmstatus') == 3 else '')
    else: log[cid] = f'dry {list(new)}'
json.dump(log, open(os.path.join(D, 'log-write.json' if '--write' in sys.argv else 'log-dry.json'), 'w'), indent=1)
from collections import Counter; print(len(ids), Counter(v.split(' ')[0] for v in log.values()), [k for k, v in log.items() if 'False' in v])
