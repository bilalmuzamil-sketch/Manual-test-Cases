import json, sys, os
sys.path.insert(0,'.')
import jiralib as J

KEYS = []
# Report Suite
KEYS += ['SV-8818','SV-8819','SV-8820','SV-8821','SV-8822','SV-8823']
KEYS += ['SV-8879','SV-8880','SV-8881']
KEYS += ['SV-8907','SV-8908']
KEYS += [f'SV-{n}' for n in list(range(8925,8933))+list(range(8934,8941))+list(range(8943,8955))+[8955,8956]]
# Schedule
KEYS += [f'SV-{n}' for n in range(8848,8858)]
KEYS += ['SV-8886','SV-8924','SV-8933','SV-8941','SV-8942','SV-8957','SV-8958','SV-8959']
# Filters
KEYS += ['SV-8843','SV-8844','SV-8845','SV-8846','SV-8847','SV-8871','SV-8912']
KEYS = sorted(set(KEYS))
print(len(KEYS),'keys')
out = {}
os.makedirs('../snapshots', exist_ok=True)
for k in KEYS:
    code, d = J.issue(k, out=f'../snapshots/{k}.json')
    if code != '200':
        out[k] = {'http': code, 'err': str(d)[:200]}
        print(k, code, 'ERR'); continue
    f = d['fields']
    desc_txt = json.dumps(f.get('description') or {})
    rendered = (d.get('renderedFields') or {}).get('description') or ''
    out[k] = {
        'http': code,
        'summary': f['summary'],
        'type': f['issuetype']['name'],
        'typeid': f['issuetype']['id'],
        'status': f['status']['name'],
        'resolution': (f.get('resolution') or {}).get('name'),
        'priority': (f.get('priority') or {}).get('name'),
        'parent': (f.get('parent') or {}).get('key'),
        'creator': (f.get('creator') or {}).get('displayName'),
        'creator_id': (f.get('creator') or {}).get('accountId'),
        'reporter': (f.get('reporter') or {}).get('displayName'),
        'created': f.get('created'),
        'updated': f.get('updated'),
        'has_source_block': ('Where this expected behaviour comes from' in desc_txt) or ('Where this expected behaviour comes from' in rendered),
        'desc_len': len(desc_txt),
    }
    print(k, f['issuetype']['name'], '|', f['status']['name'], '|', (f.get('creator') or {}).get('displayName'), '|', f.get('created','')[:19], '| block:', out[k]['has_source_block'])
json.dump(out, open('../census.json','w'), indent=1)
