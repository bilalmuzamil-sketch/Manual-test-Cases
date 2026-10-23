"""23 Oct 2026 — QA lead: "check if the test cases which we have moved to fast follow ... steps/preconditions needed to be updated because of
the changes in the PRD" (L0562). Review of all 45 Fast-follow cases against PRD 845185030 v74 (ff_review.json beside this file). This applies
the preconditions/steps changes only (Rule 114(b)); Expected is untouched. Automated cases (C96969, C97008) are NOT changed here — held for
the QA lead (Rule 71). C97028's density changes are held with its Expected question; only its Assign-lead line is changed. --write applies."""
import json, os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../../testing-tools'))
import tr_client as t
D = os.path.dirname(os.path.abspath(__file__))
OLD = "&gt; Reassign lead technician &gt; pick the technician &gt; Reassign.)"
NEW = "&gt; Assign lead technician &gt; click the technician; it is assigned at once.)"
CH = {c: {'custom_preconds': [(OLD, NEW)]} for c in (96953, 96954, 96955, 96957, 154889, 97002, 97028)}
CH[97022] = {'custom_steps': [('<li>In the window, choose {Technician-B} with the keyboard and confirm with the keyboard.</li>',
                               '<li>In the window, choose {Technician-B} with the arrow keys and press Enter.</li>')]}
for cid, ch in CH.items():
    s, c = t.get(f'get_case/{cid}'); assert c['created_by'] == 3 and c.get('custom_atmstatus') != 3, (cid, c['created_by'], c.get('custom_atmstatus'))
    new = {}
    for f, pairs in ch.items():
        v = c[f]
        for o, n in pairs:
            assert v.count(o) >= 1, (cid, f, o[:50]); v = v.replace(o, n)
        new[f] = v
    json.dump({k: c[k] for k in new}, open(os.path.join(D, f'C{cid}-before.json'), 'w'), indent=1)
    if '--write' in sys.argv:
        s, r = t.post(f'update_case/{cid}', new); s2, c2 = t.get(f'get_case/{cid}')
        same = all(c2[k] == v for k, v in new.items()) and all(c2[k] == c[k] for k in ('custom_preconds', 'custom_steps', 'custom_expected', 'title') if k not in new)
        print(cid, 'update', s, 'read back ok', same); json.dump({k: c2[k] for k in new}, open(os.path.join(D, f'C{cid}-after.json'), 'w'), indent=1)
    else: print(cid, 'dry run ok', list(new))
