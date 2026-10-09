# QA lead 9 Oct 2026: "Dashboard -> Just remove the SETUP section keep the rest the way it is".
# Only our cases, last updated by us, not flagged Automated, unchanged since the 9 Oct snapshot.
import sys, json, os
sys.path.insert(0, 'build/maintenance-reminder-v2')
from mr_lib import api
D = 'build/setup-to-doc-2026-10-09'; APPLY = '--apply' in sys.argv
snap = {c['id']: c for c in json.load(open(f'{D}/snapshot-before.json'))}
secs = {s['id']: s for s in json.load(open(f'{D}/sections.json'))}
def under(sid, g):
    s = secs[sid]
    while s:
        if s['id'] == g: return True
        s = secs.get(s['parent_id'])
el = [c for c in snap.values() if under(c['section_id'], 12166) and c['created_by'] == 3 and c.get('updated_by') == 3 and c.get('custom_atmstatus') != 3]
os.makedirs(f'{D}/dashboard', exist_ok=True); log = open(f'{D}/dashboard/apply-log.jsonl', 'a')
M = '<p><strong>Setup</strong></p>'
for c in sorted(el, key=lambda c: c['id']):
    p = c['custom_preconds']; assert p.count(M) == 1
    new = p[:p.index(M)].rstrip()
    if not APPLY: continue
    live = api(f"get_case/{c['id']}")
    if live['updated_on'] != c['updated_on'] or live.get('updated_by') != 3:
        log.write(json.dumps({'case': f"C{c['id']}", 'skipped': 'changed since snapshot'}) + '\n'); continue
    json.dump(live, open(f"{D}/dashboard/C{c['id']}-before.json", 'w'), indent=1)
    api(f"update_case/{c['id']}", {'custom_preconds': new})
    a = api(f"get_case/{c['id']}"); json.dump(a, open(f"{D}/dashboard/C{c['id']}-after.json", 'w'), indent=1)
    ok = a['custom_preconds'] == new and all(a.get(k) == live.get(k) for k in ('title', 'custom_steps', 'custom_expected', 'section_id'))
    log.write(json.dumps({'case': f"C{c['id']}", 'op': 'remove Setup section', 'ok': ok}) + '\n'); log.flush()
print(len(el), 'eligible Dashboard cases', 'APPLIED' if APPLY else '(check only)')
