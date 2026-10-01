#!/usr/bin/env python3
"""Classify production failures from the FAILURE DETAIL blocks, not from console notes.

The first attempt classified on whatever the test happened to print to stdout, and called 14 checks
"regressions" that were only missing data. The detail block carries the actual assertion message -
and these specs were written with guards that SAY so: 'ZZLONGROW returns no Parts rows - nothing
below would be about the product'. Reading that is the difference between a real finding and a
fabricated one.
"""
import re, json, sys, collections

raw = re.sub(r'\x1b\[[0-9;]*m', '', open(sys.argv[1], encoding='utf8', errors='replace').read())

# each failure detail block starts "  N) tests/<file> › C<id> — <title>"
blocks = re.split(r'\n(?=\s{0,3}\d+\)\s+tests/)', raw)
# 🔴 WIDENED TWICE. These specs were written with POSITIVE CONTROLS that refuse to judge without
# data, and each one says so in its own words. Reading those words is the whole difference between
# a real finding and a fabricated one - every phrase below is a spec telling me it had nothing to
# measure, and the first two patterns I wrote recognised only a third of them.
MISSING = re.compile(
    r'returns no .* rows|no \w+ rows|\b0 rows\b|does not exist|nothing below would be about the product'
    r'|CONTROL FAILED'                    # the spec's own control could not be established
    r'|needs more than one row'           # a comparison with nothing to compare
    r'|finds nothing'                     # the term is not present on this environment
    r'|cannot be run'                     # the spec saying so outright
    r'|no \S+ (work order|customer|part|vendor|record) exists',
    re.I)

staging = json.load(open('build/global-search/retest-2026-09-30/NEW-VERDICTS.json'))
out = {}
for b in blocks:
    m = re.search(r'›\s*C(\d{6})\s*—\s*([^\n]+)', b[:400])
    if not m: continue
    cid, title = m.group(1), m.group(2).strip()
    em = re.search(r'\n\s*Error:\s*([^\n]+)', b)
    err = em.group(1).strip() if em else ''
    was = staging.get(cid, {}).get('v', 'not run on staging')
    # A bare `expect(rows.length).toBeGreaterThan(0)` with Received: 0 is the same thing said
    # without words - the search returned nothing, so there was nothing to judge. Three checks
    # failed exactly this way and would otherwise have been reported as production regressions.
    bare_zero = bool(re.search(r'expect\(rows\.length\)\.toBeGreaterThan', b) and
                     re.search(r'Received:\s*0\b', b))
    if MISSING.search(err) or bare_zero:
        bucket = 'no data on production'
    elif was == 'Passed':
        bucket = 'REGRESSION - passed on staging, fails on production'
    else:
        bucket = 'fails on staging too'
    out[cid] = {'bucket': bucket, 'title': title, 'error': err, 'staging': was}

# anything that passed
for m in re.finditer(r'✓\s+\d+\s+tests/\S+\s*›\s*C(\d{6})\s*—\s*([^\n(]+)', raw):
    cid = m.group(1)
    if cid not in out:
        out[cid] = {'bucket':'passed', 'title':m.group(2).strip(), 'error':'',
                    'staging': staging.get(cid,{}).get('v','not run on staging')}

json.dump(out, open(sys.argv[2],'w'), indent=1, ensure_ascii=False)
for k,n in collections.Counter(v['bucket'] for v in out.values()).most_common(): print(f'  {k:<52} {n}')
print()
reg = {c:v for c,v in out.items() if v['bucket'].startswith('REGRESSION')}
if reg:
    print('WORSE ON PRODUCTION THAN STAGING:')
    for c,v in sorted(reg.items()):
        print(f"  C{c}  {v['title'][:60]}")
        print(f"        {v['error'][:150]}")
else:
    print('No check passed on staging and failed on production for a product reason.')
