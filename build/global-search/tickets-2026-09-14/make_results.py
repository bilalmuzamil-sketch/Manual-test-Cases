#!/usr/bin/env python3
"""Turn the judged verdicts into the RESULTS.json shape push_results_to_run.py expects.

Kept separate from the judging so the two can be checked independently: VERDICTS.json is a human
decision per case, this is a mechanical transform. It refuses to emit a non-Passed result without a
plain "what needs to be done" sentence (Rule 7), and refuses to emit any case the run did not
actually execute (Rule 12 -- a verdict is observed, never inferred)."""
import json, os, sys
D = os.path.dirname(os.path.abspath(__file__))
V = json.load(open(f'{D}/VERDICTS.json'))
obs = json.load(open(f'{D}/RUN-RESULTS2.json'))['cases']
special = {}
if os.path.exists(f'{D}/SPECIAL-RESULTS.json'):
    special = json.load(open(f'{D}/SPECIAL-RESULTS.json')).get('cases', {})
roles = {}
if os.path.exists(f'{D}/ROLES-RESULTS.json'):
    roles = (json.load(open(f'{D}/ROLES-RESULTS.json')) or {}).get('cases', {})

executed = set(obs) | set(special) | set(roles)
results, problems = {}, []
for cid, v in V['verdicts'].items():
    if cid not in executed:
        problems.append(f'{cid}: a verdict was written but the case was never executed')
        continue
    if v['verdict'] != 'Passed' and not v.get('todo'):
        problems.append(f'{cid}: {v["verdict"]} with no "what needs to be done"')
        continue
    results[cid] = {k: v[k] for k in ('verdict', 'observed', 'todo') if k in v}
    results[cid].setdefault('not_observed', v.get('not_observed'))

missing = sorted(executed - set(V['verdicts']))
if missing:
    problems.append(f'executed but unjudged: {", ".join(missing)}')

if problems:
    print('REFUSING TO EMIT:', file=sys.stderr)
    for p in problems:
        print('  -', p, file=sys.stderr)
    sys.exit(1)

out = {'pass_meta': V['pass_meta'], 'results': results}
open(f'{D}/RESULTS.json', 'w').write(json.dumps(out, indent=1))
from collections import Counter
print(f'{len(results)} results written to RESULTS.json')
print(dict(Counter(r['verdict'] for r in results.values())))
