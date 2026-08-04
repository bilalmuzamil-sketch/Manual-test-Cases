#!/usr/bin/env python3
"""Filters coverage re-derivation, BOTH directions, per ASSERTION (Rules 43/45e/50).

Reads the CURRENT spec (v17 storage XML) and the CURRENT live case bodies, and emits
  1. requirement -> case(s)   : finds UNCOVERED requirements
  2. case -> requirement      : finds ORPHANED / stale anchors
Totals must reconcile with zero remainder.
"""
import json, re, os, sys, csv, io, html

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import spec_parse as sp

ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..', '..'))
SPEC = os.path.join(HERE, '..', 'evidence', 'raw', 'spec-v17-storage.xml')
ANCHOR = re.compile(r'\b(S\d+-[RN]\d+)\b')


def load_cases():
    live = json.load(open('/tmp/fviu/live-cases-4110.json'))
    idmap = {}
    for r in csv.DictReader(open(os.path.join(ROOT, 'build', 'filters', 'testrail-id-map.csv'))):
        idmap[int(r['testrail_case_id'][1:])] = r['internal_id']
    secs = {s['id']: s['name'] for s in json.load(open('/tmp/fviu/sections-4110.json'))}
    out = []
    for c in live:
        txt = ' '.join(str(c.get(k) or '') for k in
                       ('title', 'custom_preconds', 'custom_steps', 'custom_expected', 'refs'))
        out.append({'cid': c['id'], 'iid': idmap.get(c['id'], '?'), 'title': c['title'],
                    'section': secs.get(c['section_id']), 'section_id': c['section_id'],
                    'refs': c.get('refs') or '',
                    'anchors': sorted(set(ANCHOR.findall(c.get('refs') or ''))),
                    'anchors_anywhere': sorted(set(ANCHOR.findall(txt))),
                    'expected': c.get('custom_expected') or '',
                    'steps': c.get('custom_steps') or '',
                    'preconds': c.get('custom_preconds') or ''})
    return out


def assertions(expected):
    """Split an Expected Results field into its numbered assertions, excluding the
    provenance line (Rule 54) which is not an assertion."""
    t = re.sub(r'<[^>]+>', '\n', expected)
    t = html.unescape(t)
    out = []
    for ln in t.split('\n'):
        s = ln.strip()
        if not s or s == '---':
            continue
        if s.lower().startswith('this is the expected behaviour'):
            continue
        if s.lower().startswith('do not automate yet'):
            continue
        out.append(re.sub(r'^\d+[.)]\s*', '', s))
    return out


def main():
    spec = sp.run(SPEC)
    reqs = spec['reqs']
    cases = load_cases()
    by_anchor = {}
    for c in cases:
        for a in c['anchors']:
            by_anchor.setdefault(a, []).append(c)
    rows = []
    for q in reqs:
        cs = by_anchor.get(q['anchor'], [])
        rows.append({'anchor': q['anchor'], 'story': q['story'], 'text': q['text'],
                     'cases': [{'iid': c['iid'], 'cid': c['cid']} for c in cs],
                     'covered': bool(cs)})
    spec_anchors = set(q['anchor'] for q in reqs)
    orphans = []
    for c in cases:
        bad = [a for a in c['anchors'] if a not in spec_anchors]
        if bad:
            orphans.append({'iid': c['iid'], 'cid': c['cid'], 'stale': bad})
    noanchor = [{'iid': c['iid'], 'cid': c['cid'], 'refs': c['refs']} for c in cases if not c['anchors']]
    res = {'spec_nonblank': spec['nonblank'], 'spec_reqs': len(reqs),
           'spec_nonreq': len(spec['nonreq']),
           'reconciles': len(reqs) + len(spec['nonreq']) == spec['nonblank'],
           'cases': len(cases),
           'rows': rows,
           'uncovered': [r['anchor'] for r in rows if not r['covered']],
           'orphan_anchors': orphans,
           'cases_without_anchor': noanchor,
           'assertion_count': sum(len(assertions(c['expected'])) for c in cases)}
    json.dump(res, open('/tmp/fviu/coverage.json', 'w'), indent=1)
    print('spec non-blank lines :', res['spec_nonblank'])
    print('  requirements       :', res['spec_reqs'])
    print('  non-requirement    :', res['spec_nonreq'])
    print('  reconciles         :', res['reconciles'])
    print('cases                :', res['cases'])
    print('assertions in cases  :', res['assertion_count'])
    print('COVERED requirements :', sum(1 for r in rows if r['covered']))
    print('UNCOVERED            :', len(res['uncovered']))
    print(' ', res['uncovered'])
    print('cases citing a NON-EXISTENT anchor:', len(orphans), orphans)
    print('cases with NO spec anchor in refs :', len(noanchor))
    for n in noanchor:
        print('  ', n['iid'], 'C%s' % n['cid'], '|', n['refs'][:110])


if __name__ == '__main__':
    main()
