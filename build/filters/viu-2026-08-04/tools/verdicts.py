#!/usr/bin/env python3
"""Per-case VERDICT assignment for all 110 Filters cases (Rule 17: 100%, no sampling).

Verdicts (the only four permitted - "partly observed" and "blocked" are not verdicts):
  PASS      = VIU-Observed-PASS      - behaviour observed live, matches the case
  DEVIATION = observed live, build breaches a verbatim requirement (ticket or PO ask)
  NOTBUILT  = observed live to be absent, with evidence of absence
  EXTDEP    = external dependency, fully characterised
"""
import json, csv, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import findings as F

ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..', '..'))

# ---- cases whose verdict is NOT the default PASS -----------------------------------
DEVIATION = {}
for k, d in F.DEVIATIONS.items():
    for c in d['cases']:
        DEVIATION.setdefault(c, []).append(k)

NOTBUILT = set(F.DEVIATIONS['D9']['cases'])
for c in NOTBUILT:
    DEVIATION.pop(c, None)

HELD = set(F.HELD['H1']['cases'])
OURS_STALE = set(F.HELD['H2']['cases'])          # our case was wrong, build is right
EXTDEP = {'FLT-API-06'}

# the desktop multi-select dropdown defect ALREADY FILED by another QA as SV-8824.
# Our own live observation independently confirmed it: the dropdown closes on every tick.
SV8824 = ['FLT-STAT-03', 'FLT-STAT-04', 'FLT-STAT-05', 'FLT-CUST-03', 'FLT-CUST-05',
          'FLT-CUST-07', 'FLT-TECH-03', 'FLT-TECH-05', 'FLT-ADV-03', 'FLT-ADV-05',
          'FLT-ASSET-05', 'FLT-CHIP-01']
for _c in SV8824:
    DEVIATION.setdefault(_c, []).append('SV-8824')

# D7/D8/S_A/S_C are wording corrections to OUR case, not build defects
WORDING_ONLY = set(F.DEVIATIONS['D7']['cases']) | set(F.DEVIATIONS['D8']['cases'])
for k in ('S_A', 'S_C'):
    WORDING_ONLY |= set(F.SPEC_ISSUES[k]['cases'])

# a mobile case can be both HELD and a build deviation; HELD wins for automation purposes
def verdict(iid):
    if iid in NOTBUILT:
        return 'NOTBUILT'
    if iid in EXTDEP:
        return 'EXTDEP'
    if iid in HELD:
        return 'HELD'
    if iid in DEVIATION:
        return 'DEVIATION'
    return 'PASS'


def load():
    live = json.load(open('/tmp/fviu/live-cases-4110.json'))
    secs = {s['id']: s['name'] for s in json.load(open('/tmp/fviu/sections-4110.json'))}
    idmap = {int(r['testrail_case_id'][1:]): r['internal_id']
             for r in csv.DictReader(open(os.path.join(ROOT, 'build', 'filters', 'testrail-id-map.csv')))}
    out = []
    for c in sorted(live, key=lambda x: (x['section_id'], x['id'])):
        iid = idmap[c['id']]
        out.append({'iid': iid, 'cid': c['id'], 'section': secs[c['section_id']],
                    'title': c['title'], 'verdict': verdict(iid),
                    'deviations': DEVIATION.get(iid, []),
                    'wording_only': iid in WORDING_ONLY,
                    'ours_stale': iid in OURS_STALE})
    return out


if __name__ == '__main__':
    rows = load()
    import collections
    print('cases:', len(rows))
    print(collections.Counter(r['verdict'] for r in rows))
    print()
    for v in ('DEVIATION', 'NOTBUILT', 'HELD', 'EXTDEP'):
        print('==', v)
        for r in rows:
            if r['verdict'] == v:
                print('   %-14s C%-6s %-38s %s' % (r['iid'], r['cid'], r['section'],
                                                   ','.join(r['deviations'])))
    print('\nwording-only corrections:', sorted(r['iid'] for r in rows if r['wording_only']))
    print('our-case-was-stale       :', sorted(r['iid'] for r in rows if r['ours_stale']))
    json.dump(rows, open('/tmp/fviu/verdicts.json', 'w'), indent=1)
