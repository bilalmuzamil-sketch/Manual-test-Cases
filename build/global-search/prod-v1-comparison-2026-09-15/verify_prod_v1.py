#!/usr/bin/env python3
"""Run the REAL V1 filter over the REAL production collection.

Production runs V1. Its search endpoint - GET /api/global-search/fetch - returns the WHOLE
collection in one call (label + search text + type per row) and the BROWSER does the filtering.
That is V1's design, and it means the verdict does not need a browser at all: fetch the collection
the page would have fetched, then apply the same two passes the page applies.

The two passes are transcribed from the V1 product at commit 55767168
(app/src/composables/useGlobalSearch.ts:66-93):
  pass 1  label.toLowerCase().startsWith(query.toLowerCase())
  pass 2  search.toLowerCase().includes(query.toLowerCase().replace(/\\s+/g, ''))
Only SPACES are stripped from what the user typed - nothing else. That single detail is why a
phone number typed with brackets or as plain digits found nothing in V1.
"""
import sys, json
sys.path.insert(0, '/tmp/prod')
from prodclient import call

r = call('/api/global-search/fetch')
if r['status'] != 200:
    sys.exit(f"production search endpoint answered {r['status']}")
rows = (r['json'] or {}).get('data', {}).get('collection') or []
print(f"production collection: {len(rows)} rows\n")

MAX_PER_TYPE = 3          # V1 showed at most three rows per type

def v1(query):
    q = (query or '').lower()
    if len(q) < 2:
        return {}                              # V1 returned history below two characters
    squashed = ''.join(q.split())
    out = {}
    for pas in (1, 2):
        for row in rows:
            t = row.get('type') or '?'
            hit = ((row.get('label') or '').lower().startswith(q) if pas == 1
                   else squashed in (row.get('search') or '').lower())
            if not hit:
                continue
            bucket = out.setdefault(t, [])
            if row.get('label') in [x['label'] for x in bucket]:
                continue
            bucket.append({'label': row.get('label'), 'pass': pas})
    return out

def shown(groups):
    """What the user would actually SEE - V1 capped each type at three rows."""
    return {t: v[:MAX_PER_TYPE] for t, v in groups.items()}

SEEDED = ['ZZAUTOTEST Bridgeport Hauling', '2019 Freightliner Cascadia', 'ZZT-4471',
          'ZZAUTOTEST Kestrel Parts Supply', 'ZZT-88-4412']

print("=" * 78)
print("PART 1 - are the seeded records findable in production's own search?")
print("=" * 78)
for term in SEEDED:
    g = v1(term)
    total = sum(len(v) for v in g.values())
    print(f"\n  typed {term!r} -> {total} match(es) across {len(g)} group(s)")
    for t, v in shown(g).items():
        for x in v:
            print(f"        [{t}] {x['label']}   (pass {x['pass']})")

print()
print("=" * 78)
print("PART 2 - the behaviours the regression suite asserts, measured on production V1")
print("=" * 78)
CHECKS = [
 ("company phone, dashed",        "419-555-0143",  True),
 ("company phone, PART of it",    "555-0143",      True),
 ("company phone, brackets",      "(419) 555-0143", False),
 ("company phone, plain digits",  "4195550143",    False),
 ("contact phone, dashed",        "419-555-0177",  True),
 ("contact phone, PART of it",    "555-0177",      True),
 ("contact phone, plain digits",  "4195550177",    False),
 ("asset make alone",             "Freightliner",  True),
 ("asset year alone",             "2019",          True),
 ("asset model alone",            "Cascadia",      True),
 ("asset year AND make",          "2019 Freightliner", True),
 ("unit number",                  "ZZT-4471",      True),
 ("part of the unit number",      "4471",          True),
]
bad = []
for name, q, expect_ours in CHECKS:
    g = v1(q)
    allm = [x['label'] for v in g.values() for x in v]
    ours = [m for m in allm if 'ZZAUTOTEST' in m or 'Freightliner Cascadia' in m]
    got = bool(ours)
    mark = 'ok ' if got == expect_ours else '🔴 '
    if got != expect_ours:
        bad.append((name, q, expect_ours, got))
    print(f"  {mark}{name:28} typed {q!r:18} -> {len(allm):4} total, ours: {'YES' if got else 'no'}"
          f"   (expected ours: {'YES' if expect_ours else 'no'})")

print()
if bad:
    print("🔴 PRODUCTION V1 DID NOT BEHAVE AS THE SUITE ASSERTS, on:")
    for name, q, e, g in bad:
        print(f"     {name}: typed {q!r}, expected ours {e}, got {g}")
else:
    print("✅ Production V1 behaved exactly as the regression suite asserts, on every row above.")
sys.exit(1 if bad else 0)
