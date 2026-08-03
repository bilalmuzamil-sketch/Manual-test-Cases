#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Bring the LOCAL case source into line with the live TestRail state written by
execute.py, and append the Rule-41 re-verification line to each touched case's
local `notes` (notes are LOCAL-only; TestRail has no notes field).

Local -> TestRail field map: spec_ref->refs, preconditions->custom_preconds,
steps->custom_steps, expected->custom_expected, title->title.
"""
import json, os, sys, glob, csv, re

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from plan import PLAN  # noqa: E402

ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))       # build/report-suite
LOCAL = {'refs': 'spec_ref', 'title': 'title', 'preconds': 'preconditions',
         'steps': 'steps', 'expected': 'expected'}

rev = {}
with open(os.path.join(ROOT, 'testrail-id-map.csv')) as fh:
    for row in csv.DictReader(fh):
        rev[int(row['testrail_case_id'].lstrip('C'))] = row['internal_id']

files = {}
for p in sorted(glob.glob(os.path.join(ROOT, 'cases', 'cases-*.json'))):
    files[p] = json.load(open(p))

NOTE_TAG = '2026-08-03 verifier-fix'
touched_files, per_case = set(), []
for cid, spec in sorted(PLAN.items()):
    iid = rev[cid]
    hit = None
    for p, arr in files.items():
        for c in arr:
            if c['id'] == iid:
                hit = (p, c)
    assert hit, f'C{cid}/{iid} not found in the local case source'
    p, c = hit
    fields = []
    for f, v in spec['fields'].items():
        lf = LOCAL[f]
        newval = v if isinstance(v, list) else v
        if f in ('preconds', 'steps', 'expected'):
            assert isinstance(newval, list), f
        if c.get(lf) != newval:
            c[lf] = newval
            fields.append(lf)
    note = (f' | {NOTE_TAG} [{spec["group"]}]: {spec["why"]} '
            f'RULE 41: {spec["reverified"]}')
    if NOTE_TAG not in (c.get('notes') or ''):
        c['notes'] = (c.get('notes') or '').rstrip() + note
        fields.append('notes')
    if fields:
        touched_files.add(p)
    per_case.append((cid, iid, fields))

for p in sorted(touched_files):
    json.dump(files[p], open(p, 'w'), indent=1, ensure_ascii=False)
    open(p, 'a').write('\n')

print(f'local files rewritten: {len(touched_files)}')
for cid, iid, f in per_case:
    print(f'  C{cid} {iid:<14} {", ".join(f) or "no change"}')
