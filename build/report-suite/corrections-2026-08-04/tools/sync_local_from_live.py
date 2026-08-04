#!/usr/bin/env python3
"""Re-sync the LOCAL case source from LIVE TestRail — job 1 only.

WHY THIS RUNS BEFORE ANY REGENERATION: the local source's provenance lines were STALE
(they lacked the "(build v3.4.1-3d03023)" marker that live carries), so regenerating the
import from local would have silently reverted all 469 provenance lines — the same class
of silent regression that once wiped the DO-NOT-AUTOMATE warnings.

Makes the local JSON byte-identical to live on the pushed reader-facing fields:
title / preconditions / steps / expected / spec_ref(refs). Nothing else is touched.
"""
import json, os, glob, sys, collections

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RS = os.path.dirname(HERE)
CASES = os.path.join(RS, 'cases')
LIVE = os.path.join(HERE, 'data', 'live-4281-START.json')

import csv
IDMAP = os.path.join(RS, 'testrail-id-map.csv')


def lines(s):
    return (s or '').split('\n')


def main():
    apply = '--apply' in sys.argv
    # live, refreshed for the 4 we just wrote
    sys.path.insert(0, os.path.join(HERE, 'tools'))
    import tr
    live = {c['id']: c for c in json.load(open(LIVE)) if c.get('created_by') == 3}
    for cid in (30162, 30287, 30588, 30589):
        s, c = tr.api(f'get_case/{cid}')
        assert s == 200, (cid, s)
        live[cid] = c
    c2i = {r['testrail_case_id'].lstrip('C'): r['internal_id']
           for r in csv.DictReader(open(IDMAP))}
    i2c = {v: k for k, v in c2i.items()}

    changed = collections.Counter()
    per_file = {}
    for f in sorted(glob.glob(os.path.join(CASES, 'cases-*.json'))):
        arr = json.load(open(f))
        dirty = False
        for c in arr:
            iid = c.get('id')
            cid = i2c.get(iid)
            if not cid or int(cid) not in live:
                continue
            L = live[int(cid)]
            pairs = [('title', L.get('title'), 'scalar'),
                     ('preconditions', L.get('custom_preconds'), 'list'),
                     ('steps', L.get('custom_steps'), 'list'),
                     ('expected', L.get('custom_expected'), 'list'),
                     ('spec_ref', L.get('refs'), 'scalar')]
            for key, val, kind in pairs:
                want = lines(val) if kind == 'list' else val
                if key not in c and kind == 'scalar' and key == 'spec_ref':
                    # some files use a different key name; skip silently
                    continue
                if c.get(key) != want:
                    c[key] = want
                    dirty = True
                    changed[key] += 1
        if dirty:
            per_file[f] = arr
    print('fields that differed from live:', dict(changed))
    print('files needing update:', len(per_file))
    if apply:
        for f, arr in per_file.items():
            json.dump(arr, open(f, 'w'), indent=1, ensure_ascii=False)
            print('  wrote', os.path.basename(f))
    else:
        print('(dry run — pass --apply)')
    return 0


if __name__ == '__main__':
    sys.exit(main())
