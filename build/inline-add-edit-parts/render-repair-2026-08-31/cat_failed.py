import json, collections
DIR = 'build/inline-add-edit-parts/render-repair-2026-08-31'
kinds = collections.Counter()
edit_url_fn = []
other = []
seen = {}
for line in open(f'{DIR}/FAILED.jsonl'):
    line = line.strip()
    if not line:
        continue
    j = json.loads(line)
    seen[j['cid']] = j  # last entry per cid wins
for cid, j in seen.items():
    if j.get('skipped'):
        kinds['skipped_automated'] += 1
        continue
    err = j.get('error', '')
    probs = j.get('problems', [])
    if 'still on edit page' in err:
        kinds['false_neg_edit_url'] += 1
        edit_url_fn.append(cid)
    elif probs:
        kinds['verify_problems'] += 1
        other.append((cid, probs))
    else:
        kinds['other_error'] += 1
        other.append((cid, err))
print('FAILED kinds:', dict(kinds))
print('false-neg edit-url cids (%d):' % len(edit_url_fn), sorted(edit_url_fn, key=int))
print('OTHER:')
for c in other:
    print('  ', c)
