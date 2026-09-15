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
    # A verdict may instead name the file its observation lives in -- the role sweep is keyed by role
    # name and the location case carries the scoping evidence, so not every observation sits under its
    # own case id. The requirement is unchanged: a verdict must point at something that was observed.
    if v.get('evidence_file'):
        if not os.path.exists(f'{D}/{v["evidence_file"]}'):
            problems.append(f'{cid}: names evidence in {v["evidence_file"]}, which does not exist')
            continue
    elif cid not in executed and v['verdict'] != 'Blocked':
        # A case that was never executed may carry ONLY "Blocked" -- that is the honest record of a
        # check that could not be run. Passed or Failed for a case nobody ran is the thing this
        # refuses, and it stays refused.
        problems.append(f'{cid}: {v["verdict"]} was written but the case was never executed '
                        f'(only Blocked is admissible for a case that could not be run)')
        continue
    if v['verdict'] != 'Passed' and not v.get('todo'):
        problems.append(f'{cid}: {v["verdict"]} with no "what needs to be done"')
        continue
    results[cid] = {k: v[k] for k in ('verdict', 'observed', 'todo') if k in v}   # evidence_file is internal
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
