#!/usr/bin/env python3
"""Generate the exhaustive-audit deliverables deterministically from the verdict store.

Inputs  : verdict-batches/*.tsv (one row per case, hand-scored on all three dimensions)
          ../cases/*.json          (case bodies, active only)
          ../testrail-id-map.csv   (C-ids)
          ../viu-2026-08-03/batch-*/verdicts.csv (VIU outcome verdicts)
          ../defect-pack-2026-08-04/RECLASSIFIED.md (the 9-case reclassification)
Outputs : per-case-verdicts.csv, and the tallies the .md deliverables quote.

FAILS LOUDLY (non-zero exit) if:
  - the verdict store does not cover 100% of the population
  - any dimension's counts do not reconcile to the population
  - any CONTRADICTION row lacks a resolution or a PENDING flag
"""
import csv, glob, json, os, sys, collections

HERE = os.path.dirname(os.path.abspath(__file__))
RS = os.path.abspath(os.path.join(HERE, '..'))
LINK = 'https://shopview.testrail.io/index.php?/cases/view/'

RECLASSIFIED = ['SBR-API-06', 'SBR-DEACT-02', 'SBR-DEACT-03', 'SBR-DEACT-04', 'SBR-DEACT-05',
                'SBR-DEACT-06', 'SBR-DEACT-07', 'SBR-DEACT-08', 'SBR-DEACT-09']
# The three cases authored 2026-08-04, after the batch VIU passes closed.
# Status derived from the authoring evidence recorded in each case's own notes,
# NOT re-observed by this audit (Standing Rule 12 — stated, not implied).
NEW_CASE_STATUS = {
    'SBC-API-06': ('VIU-Observed-PASS',
                   'Authored from a live observation that matched: 8-atom reportsPageAccess role 200 on data and export; Foreman 403 on both.'),
    'PV-EXP-12':  ('DEVIATION',
                   'The build fails the expected result: the PDF of a few-hundred-row view returns HTTP 500 while the CSV of the same scope succeeds.'),
    'IV-EXP-10':  ('DEVIATION',
                   'The build fails to produce a large PDF (roughly 30 s timeout, HTTP 500). NOTE: the case text makes that failure the PASS condition, so as written it would read PASS - see the FIX-WORDING recommendation.'),
}

def load_cases():
    idmap = {r['internal_id']: r for r in csv.DictReader(open(os.path.join(RS, 'testrail-id-map.csv')))}
    out = {}
    for f in sorted(glob.glob(os.path.join(RS, 'cases', '*.json'))):
        for c in json.load(open(f)):
            if c['viu_status'] != 'VIU-Pending':
                continue
            c['cid'] = idmap.get(c['id'], {}).get('testrail_case_id', '')
            c['section'] = idmap.get(c['id'], {}).get('section', '')
            out[c['id']] = c
    return out

def load_verdicts():
    cols = ['d1', 'd1_reason', 'merge_group', 'merge_survivor', 'd2', 'd2_reason',
            'refs_ok', 'layman', 'layman_note']
    v = {}
    for f in sorted(glob.glob(os.path.join(HERE, 'verdict-batches', 'b*.tsv'))):
        for line in open(f):
            if not line.strip():
                continue
            p = line.rstrip('\n').split('\t')
            p += [''] * (10 - len(p))
            v[p[0]] = dict(zip(cols, p[1:10]))
    return v

def load_viu():
    out = {}
    for b in ('batch-sbc-sbr', 'batch-pv-tu', 'batch-wip-iv'):
        for r in csv.DictReader(open(os.path.join(RS, 'viu-2026-08-03', b, 'verdicts.csv'))):
            out[r['internal_id']] = r['verdict']
    return out

def main():
    cases, verds, viu = load_cases(), load_verdicts(), load_viu()
    pop = set(cases)
    problems = []
    if set(verds) != pop:
        problems.append(f'verdict store covers {len(verds)} of {len(pop)}; '
                        f'missing {sorted(pop - set(verds))[:5]}; extra {sorted(set(verds) - pop)[:5]}')

    # ---- authoritative status ledger --------------------------------------
    status, why = {}, {}
    for i in pop:
        if i in NEW_CASE_STATUS:
            status[i], why[i] = NEW_CASE_STATUS[i]
        elif i in RECLASSIFIED:
            status[i] = 'BLOCKED-BY-DEFECT'
            why[i] = 'Reclassified 2026-08-04: blocked by POST /api/invoices/create HTTP 500 (SV-8821), a defect in this branch - not an external dependency.'
        else:
            status[i] = viu.get(i, 'MISSING')
            why[i] = ''
    st = collections.Counter(status.values())
    if st.get('MISSING'):
        problems.append(f"{st['MISSING']} cases have no VIU outcome verdict")

    # ---- dimension tallies -----------------------------------------------
    d1 = collections.Counter(verds[i]['d1'] for i in pop)
    d2 = collections.Counter(verds[i]['d2'] for i in pop)
    lay = collections.Counter(verds[i]['layman'] for i in pop)
    refs = collections.Counter(verds[i]['refs_ok'] for i in pop)
    if sum(d1.values()) != len(pop):
        problems.append('D1 counts do not reconcile')
    if sum(d2.values()) != len(pop):
        problems.append('D2 counts do not reconcile')
    for i in pop:
        if verds[i]['d1'] not in ('KEEP', 'MERGE', 'WEAK-KEEP', 'CUT'):
            problems.append(f'{i}: bad D1 verdict {verds[i]["d1"]!r}')
        if verds[i]['d2'] not in ('SENSIBLE', 'FIX-WORDING', 'NONSENSE', 'CONTRADICTION'):
            problems.append(f'{i}: bad D2 verdict {verds[i]["d2"]!r}')
        if verds[i]['d1'] == 'MERGE' and not (verds[i]['merge_group'] and verds[i]['merge_survivor']):
            problems.append(f'{i}: MERGE without a group + survivor')
        if verds[i]['d2'] == 'CONTRADICTION' and not any(
                k in verds[i]['d2_reason'] for k in ('Winner', 'winner', 'PENDING', 'Resolution', 'Repair')):
            problems.append(f'{i}: CONTRADICTION with neither a resolution nor a PENDING flag')
        if verds[i]['d1'] == 'KEEP' and verds[i]['d2'] == 'NONSENSE':
            problems.append(f'{i}: KEEP-but-NONSENSE (the embarrassment check)')

    # ---- per-case CSV -----------------------------------------------------
    out = os.path.join(HERE, 'per-case-verdicts.csv')
    with open(out, 'w', newline='') as fh:
        w = csv.writer(fh)
        w.writerow(['internal_id', 'testrail_case_id', 'testrail_link', 'report', 'section', 'title',
                    'verdict', 'reason', 'merge_group', 'merge_survivor',
                    'sense_verdict', 'sense_reason',
                    'contradiction_group', 'contradiction_counterparts', 'contradiction_resolution',
                    'genuine_refs_ok', 'layman_runnable', 'layman_note',
                    'status_ledger', 'status_note', 'type', 'api_related'])
        for i in sorted(pop):
            c, v = cases[i], verds[i]
            cg = cc = cr = ''
            if v['d2'] == 'CONTRADICTION':
                cg = v['d2_reason'].split('Group ')[1].split('.')[0].split(',')[0].strip() \
                     if 'Group ' in v['d2_reason'] else 'intra-case'
                cc = 'see sense_reason'
                cr = 'PENDING' if 'PENDING' in v['d2_reason'] else 'aligned to the precedence winner (see sense_reason)'
            w.writerow([i, c['cid'], LINK + c['cid'].lstrip('C') if c['cid'] else '',
                        i.split('-')[0], c['section'], c['title'],
                        v['d1'], v['d1_reason'], v['merge_group'], v['merge_survivor'],
                        v['d2'], v['d2_reason'], cg, cc, cr,
                        v['refs_ok'], v['layman'], v['layman_note'],
                        status[i], why[i], c['type'], c.get('api_related', '')])

    # ---- machine-readable tally ------------------------------------------
    tally = {
        'population': len(pop),
        'cold_read': len(verds),
        'dimension_1_useful': dict(d1),
        'dimension_2_sense': dict(d2),
        'dimension_3_refs_ok': dict(refs),
        'dimension_3_layman': dict(lay),
        'status_ledger': dict(st),
        'recommended_count': d1['KEEP'] + d1['WEAK-KEEP'],
        'merge_groups': sorted({verds[i]['merge_group'] for i in pop if verds[i]['merge_group']}),
        'build_marker': 'v3.4.1-0ed4433',
        'blockers': problems,
    }
    json.dump(tally, open(os.path.join(HERE, 'audit-tally.json'), 'w'), indent=1, sort_keys=True)

    for k, v in tally.items():
        if k != 'blockers':
            print(f'{k}: {v}')
    if problems:
        print('\n*** DELIVERY BAR BLOCKERS ***')
        for p in problems:
            print('  -', p)
        return 1
    print('\nDELIVERY BAR: clear (population 100% scored; counts reconcile; '
          'every CONTRADICTION resolved or PENDING; no KEEP-but-NONSENSE).')
    return 0

if __name__ == '__main__':
    sys.exit(main())
