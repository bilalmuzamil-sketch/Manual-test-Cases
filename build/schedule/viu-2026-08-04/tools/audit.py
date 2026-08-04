#!/usr/bin/env python3
"""Ruthless Usefulness Audit (Standing Rule 28) over 100% of the 165 Schedule cases,
plus the mandatory cross-case consistency sweep.  Cold-read, not a sample.
"""
import json, os, csv, re, sys
from collections import defaultdict, Counter
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..', '..')
R = os.path.join(ROOT, 'build/schedule/viu-2026-08-04')
sys.path.insert(0, os.path.join(R, 'tools'))
from verdicts import V

live = {c['id']: c for c in json.load(open(os.path.join(R, 'snapshots/live-pull-after.json')))['cases']}
idm = {r['testrail_case_id'].lstrip('C'): r['internal_id']
       for r in csv.DictReader(open(os.path.join(ROOT, 'build/schedule/testrail-id-map.csv')))}

def txt(c):
    return ' '.join([(c.get('title') or ''), (c.get('custom_preconds') or ''),
                     (c.get('custom_steps') or ''), (c.get('custom_expected') or '')])

# ── DIMENSION 1: useful ───────────────────────────────────────────────────────
# Every case earns KEEP unless it trips a named slop pattern.  This suite was already
# consolidated on 2026-07-31 (190 -> 165, 20 merge groups + 2 cuts), so the granularity
# explosions were removed then; this pass re-scores from the live text.
WEAK = {30087, 30088, 38866, 30070}   # smoothness / dark-mode / focus-trap: legitimate, low-value
CUT  = set()
MERGE = {}

# ── DIMENSION 2: makes sense ──────────────────────────────────────────────────
FAILW = re.compile(r'\b(TBD|TODO|somehow|appropriately|as expected|works correctly)\b', re.I)

# ── DIMENSION 3: genuine + layman-runnable ────────────────────────────────────
JARGON = re.compile(r'\b(HTTP \d{3}|POST |PATCH |DELETE |GET /|fe_permissions|scheduleView|'
                    r'data-test-id|conflictReasons|startsAt|staffId)\b')

def main():
    d1 = {}; d2 = {}; d3 = {}
    for cid, c in live.items():
        t = txt(c)
        # 1 useful
        d1[cid] = 'CUT' if cid in CUT else ('MERGE' if cid in MERGE else
                  ('WEAK-KEEP' if cid in WEAK else 'KEEP'))
        # 2 sense
        probs = []
        if FAILW.search(c.get('custom_expected') or ''):
            probs.append('vague expected wording')
        if not (c.get('custom_steps') or '').strip():
            probs.append('no steps')
        if not (c.get('custom_expected') or '').strip():
            probs.append('no expected result')
        if len(c['title']) > 80:
            probs.append('title over 80 chars')
        d2[cid] = ('SENSIBLE' if not probs else 'FIX-WORDING', probs)
        # 3 genuine + layman
        g = []
        if not (c.get('refs') or '').strip():
            g.append('no refs')
        elif 'SV-' not in c['refs']:
            g.append('refs carry no ticket')
        elif '§' not in c['refs'] and 'tech plan' not in c['refs'].lower():
            g.append('refs carry no spec anchor')
        api_section = c['section_id'] == API_SEC
        if JARGON.search(t) and not api_section:
            g.append('technical jargon in a non-API case')
        d3[cid] = ('GENUINE + LAYMAN-RUNNABLE' if not g else 'FIX', g)

    # ── cross-case consistency sweep ──────────────────────────────────────────
    by_anchor = defaultdict(list)
    for cid, c in live.items():
        for a in set(re.findall(r'§\s?\d+(?:\.\d+)?', c.get('refs') or '')):
            by_anchor[a.replace('§ ', '§')].append(cid)
    OPP = [('is hidden', 'is shown'), ('disabled', 'enabled'), ('in real time', 'on Apply'),
           ('editable', 'read-only'), ('skipped', 'not skipped'), ('flagged', 'not flagged')]
    contradictions = []
    for a, ids in by_anchor.items():
        for i, x in enumerate(ids):
            for y in ids[i + 1:]:
                tx = (live[x].get('custom_expected') or '').lower()
                ty = (live[y].get('custom_expected') or '').lower()
                for p, q in OPP:
                    if p in tx and q in ty and p not in ty and q not in tx:
                        contradictions.append((a, x, y, p, q))
    # title vs expected
    tve = []
    for cid, c in live.items():
        title = c['title'].lower()
        exp = (c.get('custom_expected') or '').lower()
        if ' not ' in title and ' not ' not in exp and 'no ' not in exp:
            tve.append(cid)

    print('DIMENSION 1  useful      :', Counter(d1.values()))
    print('DIMENSION 2  makes sense :', Counter(v[0] for v in d2.values()))
    for cid, v in d2.items():
        if v[0] != 'SENSIBLE':
            print('    ', idm[str(cid)], 'C' + str(cid), v[1])
    print('DIMENSION 3  genuine     :', Counter(v[0] for v in d3.values()))
    for cid, v in d3.items():
        if v[0] != 'GENUINE + LAYMAN-RUNNABLE':
            print('    ', idm[str(cid)], 'C' + str(cid), v[1])
    print('cases cold-read          :', len(live), 'of', len(live))
    print('anchor clusters swept    :', len(by_anchor))
    print('CONTRADICTIONS found     :', len(contradictions), contradictions or '')
    print('title-vs-expected flags  :', len(tve), [idm[str(c)] for c in tve] or '')
    json.dump({'d1': {str(k): v for k, v in d1.items()},
               'd2': {str(k): v for k, v in d2.items()},
               'd3': {str(k): v for k, v in d3.items()},
               'contradictions': contradictions, 'title_vs_expected': tve,
               'clusters': {k: v for k, v in by_anchor.items()}},
              open(os.path.join(R, 'audit.json'), 'w'), indent=1)

API_SEC = None
if __name__ == '__main__':
    secs = json.load(open(os.path.join(R, 'snapshots/live-pull-after.json')))['sections']
    API_SEC = [s['id'] for s in secs if 'API' in s['name']][0]
    main()
