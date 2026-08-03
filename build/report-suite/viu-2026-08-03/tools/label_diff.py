#!/usr/bin/env python3
"""label_diff.py — diff what our 475 cases ASSERT about on-screen wording against what the
LIVE sv8582 build shows (evidence/label-glossary.json + evidence/location-matrix/).

Read-only over build/report-suite/cases/*.json. Emits a machine-readable candidate list;
every candidate is then judged by hand in LABEL-DIFF.md (a script cannot decide intent).
"""
import json, glob, os, re, sys, csv

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))  # build/report-suite
VIU = os.path.join(ROOT, 'viu-2026-08-03')

idmap = {}
with open(os.path.join(ROOT, 'testrail-id-map.csv')) as f:
    for row in csv.DictReader(f):
        idmap[row['internal_id']] = row['testrail_case_id']

glossary = json.load(open(os.path.join(VIU, 'evidence', 'label-glossary.json')))

cases = []
for p in sorted(glob.glob(os.path.join(ROOT, 'cases', '*.json'))):
    for c in json.load(open(p)):
        if str(c.get('viu_status', '')).startswith('Retired'):
            continue
        c['_file'] = os.path.basename(p)
        cases.append(c)

def text_of(c):
    return ' \n '.join(c.get('preconditions', []) + c.get('steps', []) + c.get('expected', []) + [c.get('title', '')])

# --- every quoted string our cases assert, per report prefix ---
quoted = {}
for c in cases:
    pre = c['id'].split('-')[0]
    for q in re.findall(r'"([^"]{1,60})"', text_of(c)):
        quoted.setdefault(pre, {}).setdefault(q, []).append(c['id'])

# --- build vocabulary per report: every literal label the build showed ---
buildvocab = {}
for pre, g in glossary.items():
    v = set()
    for k in ('onScreenColumns', 'columnSelector', 'exportMenu', 'controlLabels', 'tabs'):
        for s in (g.get(k) or []):
            s = re.sub(r'(info_outline|arrow_drop_up|arrow_drop_down|keyboard_double_arrow_down)', '', s).strip()
            if s:
                v.add(s)
    for fk, items in (g.get('filters') or {}).items():
        for s in items:
            for part in re.split(r'\s*\|\s*', s):
                part = part.replace('check', '').strip()
                if part:
                    v.add(part)
    buildvocab[pre] = v

# words that are prose, not build labels — never flag these
IGNORE = re.compile(r'^(\$|-|—|\d|Today|Yes|No|N/A|0\.0|\+|\(|and|or|the)|^\s*$', re.I)

report = {}
for pre in sorted(quoted):
    vocab = buildvocab.get(pre, set())
    vlow = {v.lower() for v in vocab}
    unmatched = []
    for q, ids in sorted(quoted[pre].items()):
        if IGNORE.match(q):
            continue
        if q.lower() in vlow:
            continue
        # a phrase that merely CONTAINS a build label is prose, not a label claim
        if any(v.lower() == q.lower().rstrip('.:,') for v in vocab):
            continue
        unmatched.append({'asserted': q, 'cases': [{'id': i, 'cid': idmap.get(i, '')} for i in sorted(set(ids))]})
    report[pre] = {'buildVocabulary': sorted(vocab), 'assertedNotFoundInBuildVocab': unmatched,
                   'assertedQuotedTotal': len(quoted[pre])}

out = os.path.join(VIU, 'evidence', 'label-diff-candidates.json')
json.dump(report, open(out, 'w'), indent=1)
for pre, r in report.items():
    print(f"{pre}: {r['assertedQuotedTotal']} quoted strings asserted, "
          f"{len(r['assertedNotFoundInBuildVocab'])} not present in the captured build vocabulary")
print('wrote', out)
