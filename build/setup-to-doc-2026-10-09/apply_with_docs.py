# Put the doc link at the top of Preconditions and the new Preconditions body (QA lead 9 Oct 2026).
# usage: apply_with_docs.py <plan.json> <out dir> [--apply]   (doc ids read from <out dir>/doc-ids-*.jsonl)
import sys, json, glob, os
sys.path.insert(0, 'build/maintenance-reminder-v2')
from mr_lib import api
plan, O = json.load(open(sys.argv[1])), sys.argv[2]; APPLY = '--apply' in sys.argv
docs = {}
for f in glob.glob(f'{O}/doc-ids-*.jsonl'):
    for l in open(f):
        if l.strip(): r = json.loads(l); docs[int(r['id'])] = r['doc']
done = set()
if os.path.exists(f'{O}/apply-log.jsonl'):
    done = {int(json.loads(l)['case'][1:]) for l in open(f'{O}/apply-log.jsonl') if json.loads(l).get('ok')}
os.makedirs(f'{O}/cases', exist_ok=True); log = open(f'{O}/apply-log.jsonl', 'a')
n = 0
for p in plan:
    if p['id'] not in docs or p['id'] in done: continue
    link = f"https://docs.google.com/document/d/{docs[p['id']]}/edit"
    new = f'<p><strong><a href="{link}">Setup (manual QA tester and Claude session)</a></strong></p><p></p>' + p['new_pre_body']
    n += 1
    if not APPLY: continue
    live = api(f"get_case/{p['id']}")
    if live['updated_on'] != p['updated_on'] or live.get('updated_by') != 3 or live['created_by'] != 3:
        log.write(json.dumps({'case': f"C{p['id']}", 'skipped': 'changed since snapshot'}) + '\n'); continue
    json.dump(live, open(f"{O}/cases/C{p['id']}-before.json", 'w'), indent=1)
    api(f"update_case/{p['id']}", {'custom_preconds': new})
    a = api(f"get_case/{p['id']}"); json.dump(a, open(f"{O}/cases/C{p['id']}-after.json", 'w'), indent=1)
    ok = a['custom_preconds'] == new and all(a.get(k) == live.get(k) for k in ('title', 'custom_steps', 'custom_expected', 'section_id'))
    log.write(json.dumps({'case': f"C{p['id']}", 'doc': link, 'ok': ok}) + '\n'); log.flush()
print(n, 'cases ready to update', 'APPLIED' if APPLY else '(check only)')
