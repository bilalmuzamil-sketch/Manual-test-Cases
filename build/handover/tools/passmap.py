#!/usr/bin/env python3
"""Which pass WROTE which case, on 11-12 August — parsed from the committed
per-operation tables only (a bare mention in prose is not a write).

A row counts as a write only if it is a markdown table row whose cells contain a
case link/id AND the row carries an HTTP status or an explicit op marker.
"""
import re, glob, os, json, collections

ROOT = '/home/user/Manual-test-Cases'
LOGS = sorted(glob.glob(f'{ROOT}/build/*/*2026-08-1[12]*/testrail-execution-log.md'))

CASE = re.compile(r'/cases/view/(\d{5})|\bC(\d{5})\b')
row_written = collections.defaultdict(set)   # pass -> {case ids}

for f in LOGS:
    passname = os.path.relpath(f, ROOT).rsplit('/', 1)[0]
    for line in open(f):
        if not line.lstrip().startswith('|'):
            continue
        cells = [c.strip() for c in line.strip().strip('|').split('|')]
        if len(cells) < 3:
            continue
        joined = ' '.join(cells)
        # a write row must show an HTTP 200 (or an explicit update_case/add_case op)
        if not re.search(r'\b200\b|update_case|add_case', joined):
            continue
        ids = set()
        for m in CASE.finditer(joined):
            ids.add(int(m.group(1) or m.group(2)))
        # a row naming exactly one case is that case's op row
        if len(ids) == 1:
            row_written[passname] |= ids

for p in sorted(row_written):
    print(f'{len(row_written[p]):4}  {p}')

json.dump({k: sorted(v) for k, v in row_written.items()},
          open('/tmp/hand12/passmap.json', 'w'), indent=1)
