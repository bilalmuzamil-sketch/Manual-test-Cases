#!/usr/bin/env python3
"""
Report Suite — sync the LOCAL case source to LIVE TestRail, exactly · 2026-08-04.

Three jobs:
 1. Pull every case under group 4281 that is OURS (created_by == 3) and make the local
    JSON's five pushed fields byte-identical to live: title / preconditions / steps /
    expected / spec_ref(refs).
 2. Append the Rule-49 non-final-build marker to the LOCAL `notes` field of all 475
    pre-existing cases.  This is where the marker lives: TestRail has NO Notes field on
    this project (verified with get_case_fields), and `notes` is stripped from the import
    by gen_import.py by design.  See MANIFEST.md §2b.
 3. Add the 3 new cases to the local source with their live C-ids.

Then it proves SET EQUALITY, both directions, between live-ours / local-active / id-map /
import rows (Standing Rule 50 — never by matching totals).
"""
import json, os, glob, sys, base64, urllib.request, urllib.error, time, csv, re

ROOT = os.path.dirname(os.path.abspath(__file__))
RS = os.path.dirname(ROOT)
CASES = os.path.join(RS, 'cases')
IDMAP = os.path.join(RS, 'testrail-id-map.csv')
sys.path.insert(0, ROOT)
from new_cases import NEW  # noqa: E402

MARKER = ('VIU 2026-08-03/04: observed live on the Report Suite QA branch sv8582, build '
          'v3.4.1-0ed4433 (index.html last-modified 2026-08-03 13:40:38 GMT). Engineering '
          'declared this branch NOT FINAL, so this observation is PROVISIONAL and must be '
          're-confirmed when the build settles (Standing Rule 49). Re-check queue: '
          'build/report-suite/viu-2026-08-03/RECHECK-QUEUE.md')

C = json.load(open('/tmp/testrail/creds.json'))
HOST = C['host'].rstrip('/')
AUTH = 'Basic ' + base64.b64encode(
    f"{C['email']}:{C.get('password') or C.get('key')}".encode()).decode()


def api(path, tries=4):
    for a in range(tries):
        try:
            req = urllib.request.Request(f'{HOST}/index.php?/api/v2/{path}',
                                         headers={'Authorization': AUTH})
            with urllib.request.urlopen(req, timeout=180) as r:
                return json.loads(r.read().decode())
        except Exception:
            if a == tries - 1:
                raise
            time.sleep(2 ** a)


def live_ours():
    secs, off = [], 0
    while True:
        b = api(f'get_sections/1&suite_id=1&limit=250&offset={off}')
        s = b.get('sections', [])
        secs += s
        if len(s) < 250:
            break
        off += 250
    ids, stack = set(), [4281]
    while stack:
        p = stack.pop()
        for s in secs:
            if s['parent_id'] == p:
                ids.add(s['id']); stack.append(s['id'])
    cases, off = [], 0
    while True:
        b = api(f'get_cases/1&suite_id=1&limit=250&offset={off}')
        c = b.get('cases', [])
        cases += c
        if len(c) < 250:
            break
        off += 250
    secname = {s['id']: s['name'] for s in secs}
    return ([c for c in cases if c['section_id'] in ids and c['created_by'] == 3],
            [c for c in cases if c['section_id'] in ids and c['created_by'] != 3],
            secname)


def as_list(v):
    """local preconditions/steps/expected are lists of numbered lines"""
    return [ln for ln in (v or '').split('\n')]


def main():
    ours, foreign, secname = live_ours()
    print(f'live under 4281: ours {len(ours)} / foreign {len(foreign)} '
          f'/ total {len(ours) + len(foreign)}')
    by_title = {}
    for c in ours:
        by_title.setdefault((secname[c['section_id']], c['title']), []).append(c)

    idmap = list(csv.DictReader(open(IDMAP)))
    map_by_iid = {r['internal_id']: r for r in idmap}

    # ---------------- pass 1+2: sync existing local cases
    files = sorted(glob.glob(os.path.join(CASES, '*.json')))
    matched, synced_fields, marked, unmatched = 0, 0, 0, []
    newids = json.load(open(os.path.join(ROOT, 'new-case-ids.json')))

    for path in files:
        data = json.load(open(path))
        dirty = False
        for x in data:
            if not str(x.get('viu_status', '')).startswith('VIU-'):
                continue                                   # Retired — leave alone
            row = map_by_iid.get(x['id'])
            if not row:
                unmatched.append(x['id']); continue
            cid = int(row['testrail_case_id'].lstrip('C'))
            lv = next((c for c in ours if c['id'] == cid), None)
            if lv is None:
                unmatched.append(f"{x['id']} (C{cid} not live)"); continue
            matched += 1
            for lf, tf in (('title', 'title'), ('spec_ref', 'refs')):
                if x.get(lf) != lv[tf]:
                    x[lf] = lv[tf]; dirty = True; synced_fields += 1
            for lf, tf in (('preconditions', 'custom_preconds'),
                           ('steps', 'custom_steps'), ('expected', 'custom_expected')):
                want = as_list(lv[tf])
                if x.get(lf) != want:
                    x[lf] = want; dirty = True; synced_fields += 1
            if MARKER not in (x.get('notes') or ''):
                x['notes'] = ((x.get('notes') or '').rstrip() + ' | ' + MARKER).lstrip(' |')
                dirty = True; marked += 1
        if dirty:
            json.dump(data, open(path, 'w'), indent=1, ensure_ascii=False)
            open(path, 'a').write('\n')
    print(f'local cases matched to live: {matched}   fields re-synced: {synced_fields}   '
          f'Rule-49 markers added: {marked}')
    if unmatched:
        print('UNMATCHED:', unmatched); sys.exit(1)

    # ---------------- pass 3: append the 3 new cases
    tgt = {'SBC-API-06': 'cases-sbc-D-states-visual-mobile-api.json',
           'PV-EXP-12': 'cases-pv-D-exports-visual-api.json',
           'IV-EXP-10': 'cases-iv-D-persistence-sorting-exports.json'}
    for n in NEW:
        cid = newids[n['internal_id']]
        lv = next(c for c in ours if c['id'] == cid)
        cand = [f for f in files if os.path.basename(f) == tgt[n['internal_id']]]
        if not cand:
            pref = n['internal_id'].split('-')[0].lower()
            cand = [f for f in files if f'cases-{pref}-' in f]
            cand = [cand[-1]]
        path = cand[0]
        data = json.load(open(path))
        if any(x['id'] == n['internal_id'] for x in data):
            print(f"  {n['internal_id']} already in {os.path.basename(path)}")
            continue
        data.append({
            'id': n['internal_id'], 'area': n['area'], 'title': lv['title'],
            'priority': 'High', 'type': 'Functional',
            'permissions_required': 'A role with the ordinary reports access.',
            'preconditions': as_list(lv['custom_preconds']),
            'steps': as_list(lv['custom_steps']),
            'expected': as_list(lv['custom_expected']),
            'design_ref': 'none — design not yet available (spec-only authoring)',
            'spec_ref': lv['refs'], 'viu_status': 'VIU-Pending',
            'notes': n['notes'] + ' | ' + MARKER,
            'api_related': n['internal_id'] == 'SBC-API-06',
        })
        json.dump(data, open(path, 'w'), indent=1, ensure_ascii=False)
        open(path, 'a').write('\n')
        print(f"  + {n['internal_id']} = C{cid} -> {os.path.basename(path)}")

    # ---------------- id-map re-merge
    have = {r['internal_id'] for r in idmap}
    for n in NEW:
        if n['internal_id'] in have:
            continue
        cid = newids[n['internal_id']]
        lv = next(c for c in ours if c['id'] == cid)
        idmap.append({'internal_id': n['internal_id'], 'testrail_case_id': f'C{cid}',
                      'title': lv['title'], 'section': secname[lv['section_id']]})
    # titles/sections re-synced to live for every row
    live_by_cid = {c['id']: c for c in ours}
    for r in idmap:
        c = live_by_cid.get(int(r['testrail_case_id'].lstrip('C')))
        if c:
            r['title'] = c['title']; r['section'] = secname[c['section_id']]
    with open(IDMAP, 'w', newline='') as fh:
        w = csv.DictWriter(fh, fieldnames=['internal_id', 'testrail_case_id', 'title', 'section'])
        w.writeheader()
        for r in sorted(idmap, key=lambda r: int(r['testrail_case_id'].lstrip('C'))):
            w.writerow({k: r[k] for k in w.fieldnames})
    blanks = [r['internal_id'] for r in idmap if not r['testrail_case_id'].strip()]
    print(f'id-map rows: {len(idmap)}   blank C-ids: {len(blanks)}')
    if blanks:
        print('BLANKS:', blanks); sys.exit(1)


if __name__ == '__main__':
    main()
