#!/usr/bin/env python3
"""Every case created / updated on 11 or 12 August 2026, per project — LIVE, then
cross-checked against the committed execution logs. READ ONLY.

TestRail timestamps are Unix seconds UTC. The window is 2026-08-11T00:00:00Z to now.
"""
import json, datetime, sys, re, subprocess, os

P = json.load(open('/tmp/hand12/prov.json'))
START = int(datetime.datetime(2026, 8, 11, tzinfo=datetime.timezone.utc).timestamp())


def ts(x):
    return datetime.datetime.fromtimestamp(x, datetime.timezone.utc).strftime('%Y-%m-%d %H:%M:%SZ')


live = {}
for proj, rows in P.items():
    upd, crt = [], []
    for r in rows:
        if r['foreign']:
            continue
        if r.get('created_on') and r['created_on'] >= START:
            crt.append(r)
        elif r.get('updated_on') and r['updated_on'] >= START:
            upd.append(r)
    live[proj] = {'updated': sorted(upd, key=lambda x: x['updated_on']),
                  'created': sorted(crt, key=lambda x: x['created_on'])}
    print(f'{proj:14} created since 11 Aug = {len(crt):3}   updated (not new) = {len(upd):3}')
    for r in crt:
        print(f'    NEW  C{r["id"]}  {ts(r["created_on"])}  by {r["created_by"]}  {r["title"][:46]}')

print()
for proj in live:
    print(f'--- {proj}: updated ---')
    for r in live[proj]['updated']:
        print(f'    C{r["id"]}  {ts(r["updated_on"])}  by user {r["updated_by"]}  atm={r["atm"]}  '
              f'{r["title"][:44]}')

json.dump({k: {kk: [x['id'] for x in vv] for kk, vv in v.items()} for k, v in live.items()},
          open('/tmp/hand12/changed_ids.json', 'w'), indent=1)
json.dump(live, open('/tmp/hand12/changed_full.json', 'w'), indent=1)
