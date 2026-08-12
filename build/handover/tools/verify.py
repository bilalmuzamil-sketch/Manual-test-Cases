#!/usr/bin/env python3
"""Source-verified / build-verified analysis, per project — offline over prov.json."""
import json, re
from collections import Counter

P = json.load(open('/tmp/hand12/prov.json'))

# Build now running per project — read LIVE by today's passes (each BUILD-VERIFICATION.md)
RUNNING = {'Filters': 'v3.6-3e9dd6d', 'Schedule': 'v3.5-65d6500',
           'Report Suite': 'v3.7-4626299'}

# Live Confluence versions read 2026-08-11 (each read-dates-2026-08-11/SOURCE-CURRENCY.md)
CURRENT_SPEC = {
    'Filters': {'filters': 19},
    'Schedule': {'schedule': 27},
    'Report Suite': {'sales by customer': 17, 'sales by representative': 18,
                     'parts velocity': 6, 'technician utilization': 7,
                     'work in progress': 11, 'inventory value': 5},
}

READ_ON = re.compile(r'read on \d{1,2} \w+ \d{4}', re.I)
BUILDLINE = re.compile(r'[Ll]ast checked against build\s+([A-Za-z0-9._-]+)')
# capture the spec NAME preceding "specification ... version N"
VERPIN = re.compile(
    r'([A-Za-z][A-Za-z ]{0,45}?)\s*(?:report\s+)?specification\s+'
    r'(?:at\s+Confluence\s+)?version\s+(\d+)', re.I)

summary = {}
for proj, rows in P.items():
    ours = [r for r in rows if not r['foreign']]
    cur = CURRENT_SPEC[proj]
    n_read = n_pin = n_pin_cur = n_both = 0
    b_cur = b_old = b_none = 0
    stale, nopin, noread, nobuild, older = [], [], [], [], []
    for r in ours:
        prov = r['prov']
        has_read = bool(READ_ON.search(prov))
        pins = VERPIN.findall(prov)
        # normalise: last word-run of the captured name, matched against known spec names
        norm = []
        for nm, v in pins:
            nm = nm.strip().lower()
            hit = None
            for k in cur:
                if nm.endswith(k) or k in nm:
                    hit = k
                    break
            norm.append((hit, int(v)))
        has_pin = bool(norm)
        # current iff EVERY resolvable pin equals the live version
        resolvable = [(k, v) for k, v in norm if k]
        pin_current = bool(resolvable) and all(cur[k] == v for k, v in resolvable)
        if has_read:
            n_read += 1
        else:
            noread.append(r['id'])
        if has_pin:
            n_pin += 1
        else:
            nopin.append(r['id'])
        if pin_current:
            n_pin_cur += 1
        elif has_pin:
            stale.append((r['id'], norm))
        if has_read and pin_current:
            n_both += 1

        bm = BUILDLINE.search(prov)
        if not bm:
            b_none += 1
            nobuild.append(r['id'])
        elif bm.group(1) == RUNNING[proj]:
            b_cur += 1
        else:
            b_old += 1
            older.append((r['id'], bm.group(1)))

    summary[proj] = {
        'ours': len(ours), 'live': len(rows), 'foreign': len(rows) - len(ours),
        'read_date': n_read, 'pin': n_pin, 'pin_current': n_pin_cur,
        'source_verified': n_both,
        'build_current': b_cur, 'build_older': b_old, 'build_none': b_none,
        'no_read_date': noread, 'no_pin': nopin, 'stale_pin': stale,
        'no_build_line': nobuild,
        'older_builds': Counter(b for _, b in older).most_common(),
        'running': RUNNING[proj],
    }
    s = summary[proj]
    print(f"\n=== {proj}  (ours {s['ours']} / live {s['live']}, foreign {s['foreign']})")
    print(f"  per-source read-date present : {s['read_date']}/{s['ours']}"
          f"   missing: {s['no_read_date'][:12]}")
    print(f"  spec version pin present     : {s['pin']}/{s['ours']}   missing: {s['no_pin'][:12]}")
    print(f"  pin matches the LIVE version : {s['pin_current']}/{s['ours']}"
          f"   stale: {[x[0] for x in s['stale_pin']][:12]}")
    print(f"  SOURCE-VERIFIED (both)       : {s['source_verified']}/{s['ours']}")
    print(f"  build line = running {s['running']:16}: {s['build_current']}")
    print(f"  build line names an EARLIER build      : {s['build_older']}  {s['older_builds']}")
    print(f"  no build line at all                   : {s['build_none']}  {s['no_build_line']}")

json.dump(summary, open('/tmp/hand12/verify.json', 'w'), indent=1, default=str)
