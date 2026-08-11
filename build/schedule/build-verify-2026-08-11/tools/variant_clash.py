"""Find labels our OWN 174 cases spell more than one way.

A clash is a defect regardless of which spelling the build uses: at most one can be
right, so at least one case is sending the tester after a control that does not exist
under that name. Which one wins is decided by CLASS (build for A/C, spec for B).
"""
import json, re, collections, itertools

rows = json.load(open('/tmp/sched-bv/labels.json'))
lab = collections.defaultdict(set)          # normalised -> {actual spellings}
for r in rows:
    key = re.sub(r'[^a-z0-9]', '', r['label'].lower())
    lab[key].add(r['label'])

byactual = collections.defaultdict(list)
for r in rows:
    byactual[r['label']].append(r)

clashes = {k: sorted(v) for k, v in lab.items() if len(v) > 1}
print('NORMALISED-EQUAL CLASHES (same control, different spelling):', len(clashes))
for k, v in sorted(clashes.items()):
    print(f'\n  [{k}]')
    for s in v:
        cs = sorted({f"C{r['case']}({r['field'].replace('custom_','')})" for r in byactual[s]})
        print(f'      {s!r:42s} {", ".join(cs)}')

# near-clashes: one label is a strict prefix/subset word-wise of another
print('\n\nNEAR CLASHES (one is a word-subset of another):')
keys = sorted({r['label'] for r in rows})
seen = set()
for a, b in itertools.combinations(keys, 2):
    wa, wb = set(a.lower().split()), set(b.lower().split())
    if wa and wb and wa != wb and (wa < wb or wb < wa) and abs(len(wa)-len(wb)) <= 2:
        if len(min(wa, wb, key=len)) >= 1 and (a.lower() in b.lower() or b.lower() in a.lower()):
            pair = tuple(sorted((a, b)))
            if pair in seen: continue
            seen.add(pair)
            ca = sorted({f"C{r['case']}" for r in byactual[a]})
            cb = sorted({f"C{r['case']}" for r in byactual[b]})
            print(f'  {a!r} {ca}  <->  {b!r} {cb}')
