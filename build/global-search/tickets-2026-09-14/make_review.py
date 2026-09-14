#!/usr/bin/env python3
"""Put each case's Expected text beside what was actually observed, so a verdict is a reading
decision rather than a memory exercise.

Deliberately does NOT decide anything. Rule 12: a verdict is observed, and the observation here is
the rendered ROW -- the group counts are carried only as context. Any case whose three signals
disagreed (screen vs the server the screen was rendered from) is marked DIVERGENCE and must not be
given a verdict at all until it is re-observed."""
import json, sys, os
D = os.path.dirname(os.path.abspath(__file__))
cases = {c['id']: c for c in json.load(open(f'{D}/CASES-6769.json'))}
res = json.load(open(f'{D}/RUN-RESULTS2.json'))['cases']

out = []
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
