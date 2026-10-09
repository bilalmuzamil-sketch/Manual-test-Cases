# Repoint a case's setup-doc link to its replacement doc (flat-list version). Changes only the link URL.
# usage: relink.py <out dir> [--apply]  reads <out dir>/relink-ids.jsonl and <out dir>/cases/C<id>-after.json
import sys, json, os, re
sys.path.insert(0, 'build/maintenance-reminder-v2')
from mr_lib import api
O = sys.argv[1]; APPLY = '--apply' in sys.argv
new = {int(json.loads(l)['id']): json.loads(l)['doc'] for l in open(f'{O}/relink-ids.jsonl') if l.strip()}
done = set()
if os.path.exists(f'{O}/relink-log.jsonl'):
    done = {int(json.loads(l)['case'][1:]) for l in open(f'{O}/relink-log.jsonl') if json.loads(l).get('ok')}
log = open(f'{O}/relink-log.jsonl', 'a')
for i, doc in sorted(new.items()):
    if i in done: continue
    after = json.load(open(f'{O}/cases/C{i}-after.json'))
    if not APPLY: continue
    live = api(f'get_case/{i}')
    if live['updated_on'] != after['updated_on'] or live.get('updated_by') != 3:
        log.write(json.dumps({'case': f'C{i}', 'skipped': 'changed since our update'}) + '\n'); continue
    p = live['custom_preconds']
    q = re.sub(r'https://docs\.google\.com/document/d/[\w-]+/edit', f'https://docs.google.com/document/d/{doc}/edit', p, count=1)
    assert q != p and q.count('docs.google.com') == 1
    api(f'update_case/{i}', {'custom_preconds': q})
    a = api(f'get_case/{i}'); json.dump(a, open(f'{O}/cases/C{i}-after-relink.json', 'w'), indent=1)
    ok = a['custom_preconds'] == q and all(a.get(k) == live.get(k) for k in ('title', 'custom_steps', 'custom_expected', 'section_id'))
    log.write(json.dumps({'case': f'C{i}', 'doc': doc, 'ok': ok}) + '\n'); log.flush()
print(len(new), 'replacement docs', 'APPLIED' if APPLY else '(check only)')
