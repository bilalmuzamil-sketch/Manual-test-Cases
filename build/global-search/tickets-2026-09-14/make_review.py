#!/usr/bin/env python3
"""Put each case's Expected text beside what was actually observed, so a verdict is a reading
decision rather than a memory exercise.

Deliberately does NOT decide anything. Rule 12: a verdict is observed, and the observation here is
the rendered ROW -- the group counts are carried only as context. Any case whose three signals
disagreed (screen vs the server the screen was rendered from) is marked DIVERGENCE and must not be
given a verdict at all until it is re-observed."""
import json, sys, os
D = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, D)
from seed_index import lookup          # the positive control for every zero (Rule 104)
cases = {c['id']: c for c in json.load(open(f'{D}/CASES-6769.json'))}
_raw = json.load(open(f'{D}/RUN-RESULTS2.json'))
res = _raw['cases']
# A results file a run is still writing does not look partial -- it looks like an answer, and a
# verdict was written from one (L0095). Say so at the top rather than let it pass silently.
if not _raw.get('complete'):
    out_warn = ('!' * 78 + '\n'
                '!! THIS RESULTS FILE IS NOT MARKED COMPLETE -- a pass may still be writing it.\n'
                '!! Do not write verdicts from it until the run has finished.\n' + '!' * 78)
else:
    out_warn = None

out = []
if out_warn: out.append(out_warn)
for key in sorted(res, key=lambda k: int(k[1:])):
    cid = int(key[1:]); c = cases.get(cid, {}); r = res[key]
    out.append('=' * 78)
    out.append(f"{key}  {r['title']}")
    exp = (c.get('expected') or '').strip().replace('\n', ' ')
    out.append(f"  EXPECTED: {exp[:600]}")
    if r.get('instrumentTrouble'):
        out.append("  !! INSTRUMENT TROUBLE -- no verdict may be written from this pass")
    for o in r['obs']:
        out.append(f"  --- typed {o['query']!r}   section named by the case: {o.get('group') or '(none)'}")
        if o.get('instrument'):
            out.append(f"      INSTRUMENT: {o['instrument']}"); continue
        if o.get('divergence'):
            out.append(f"      DIVERGENCE (screen vs server): {o['divergence']}")
        out.append(f"      strip says: {o.get('countLine')}")
        nz = {k: v for k, v in (o.get('tabs') or {}).items() if v and k not in ('strip', 'all')}
        out.append(f"      types with a count: {nz}")
        api = o.get('api') or {}
        out.append(f"      server said      : { {k:v for k,v in (api.get('groups') or {}).items() if v} or api }")
        # A zero is only a finding if the thing searched for EXISTS. Say which seeded record
        # carries the value, on which field -- or say that nothing seeded carries it, in which case
        # the zero says nothing about the product and the case needs its data checked first.
        total = sum(v for k, v in (o.get('tabs') or {}).items() if v and k not in ('strip', 'all'))
        if not total:
            car = lookup(o['query'])
            if car['carriers']:
                who = ', '.join(f"{c['record']}.{c['field']}" for c in car['carriers'][:4])
                out.append(f"      ZERO -- and a seeded record carries this ({car['match']}): {who}")
            else:
                out.append("      ZERO -- but NOTHING SEEDED carries this value; check the data "
                           "before reading anything into the zero")
        rows = o.get('allRows') or []
        out.append(f"      rows rendered on All ({len(rows)}):")
        for x in rows[:12]:
            out.append(f"         [{x['type']}] {x['text'][:88]}")
        if o.get('scopedRows') is not None:
            sr = o['scopedRows']
            out.append(f"      rows in the '{o.get('group')}' section ({len(sr)}), section reads empty={o.get('scopedEmpty')}:")
            for x in sr[:8]:
                out.append(f"         [{x['type']}] {x['text'][:88]}")
        elif o.get('group'):
            out.append(f"      !! the '{o.get('group')}' section was never opened")
    out.append('  VERDICT: ____')
print('\n'.join(out))
