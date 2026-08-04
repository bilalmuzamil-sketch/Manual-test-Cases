#!/usr/bin/env python3
"""
Report Suite — re-merge the id-map C-ids (gen_import.py blanks them on every rerun)
and PROVE the four counts reconcile by SET EQUALITY IN BOTH DIRECTIONS.

Standing Rule 50: never by matching totals.  Four populations:
  A  live-ours   = cases under TestRail group 4281 with created_by == 3
  B  local       = active cases in build/report-suite/cases/*.json
  C  id-map      = rows of build/report-suite/testrail-id-map.csv
  D  import rows = data rows of testrail-import/report-suite-v1-testrail-import.csv
A/C are keyed by C-id; B/C/D are keyed by internal id (D by section+title, since the
import carries no id column by design).
"""
import json, os, glob, csv, sys, base64, urllib.request, time

ROOT = os.path.dirname(os.path.abspath(__file__))
RS = os.path.dirname(ROOT)
REPO = os.path.dirname(os.path.dirname(RS))
IDMAP = os.path.join(RS, 'testrail-id-map.csv')
IMPORT = os.path.join(REPO, 'testrail-import', 'report-suite-v1-testrail-import.csv')
BACKUP = '/tmp/rs/idmap-with-cids.csv'

C = json.load(open('/tmp/testrail/creds.json'))
HOST = C['host'].rstrip('/')
AUTH = 'Basic ' + base64.b64encode(
    f"{C['email']}:{C.get('password') or C.get('key')}".encode()).decode()


def api(p, tries=4):
    for a in range(tries):
        try:
            r = urllib.request.Request(f'{HOST}/index.php?/api/v2/{p}',
                                       headers={'Authorization': AUTH})
            with urllib.request.urlopen(r, timeout=180) as h:
                return json.loads(h.read().decode())
        except Exception:
            if a == tries - 1:
                raise
            time.sleep(2 ** a)


def paged(ep, key):
    out, off = [], 0
    while True:
        b = api(f'{ep}&limit=250&offset={off}')
        x = b.get(key, [])
        out += x
        if len(x) < 250:
            break
        off += 250
    return out


def main():
    # ---- re-merge the C-ids blanked by gen_import.py
    old = {r['internal_id']: r['testrail_case_id']
           for r in csv.DictReader(open(BACKUP)) if r['testrail_case_id'].strip()}
    rows = list(csv.DictReader(open(IDMAP)))
    restored = 0
    for r in rows:
        if not r['testrail_case_id'].strip() and r['internal_id'] in old:
            r['testrail_case_id'] = old[r['internal_id']]; restored += 1
    with open(IDMAP, 'w', newline='') as fh:
        w = csv.DictWriter(fh, fieldnames=['internal_id', 'testrail_case_id', 'title', 'section'])
        w.writeheader()
        for r in rows:
            w.writerow({k: r[k] for k in w.fieldnames})
    blanks = [r['internal_id'] for r in rows if not r['testrail_case_id'].strip()]
    print(f'id-map: {len(rows)} rows · {restored} C-ids re-merged · blanks {len(blanks)}')
    if blanks:
        print('BLANK C-IDS:', blanks); sys.exit(1)

    # ---- the four populations
    secs = paged('get_sections/1&suite_id=1', 'sections')
    ids, stack = set(), [4281]
    while stack:
        p = stack.pop()
        for s in secs:
            if s['parent_id'] == p:
                ids.add(s['id']); stack.append(s['id'])
    allc = paged('get_cases/1&suite_id=1', 'cases')
    live = [c for c in allc if c['section_id'] in ids and c['created_by'] == 3]
    foreign = [c for c in allc if c['section_id'] in ids and c['created_by'] != 3]
    secname = {s['id']: s['name'] for s in secs}

    A_cids = {c['id'] for c in live}
    B_iids, B = set(), []
    for f in sorted(glob.glob(os.path.join(RS, 'cases', '*.json'))):
        for x in json.load(open(f)):
            if str(x.get('viu_status', '')).startswith('VIU-'):
                B_iids.add(x['id']); B.append(x)
    C_iids = {r['internal_id'] for r in rows}
    C_cids = {int(r['testrail_case_id'].lstrip('C')) for r in rows}
    imp = list(csv.reader(open(IMPORT, newline='')))
    hdr, D_rows = imp[0], imp[1:]
    D_keys = [(r[1], r[0]) for r in D_rows]              # (Section, Title)
    A_keys = {(secname[c['section_id']], c['title']) for c in live}

    print(f'\nA live-ours   {len(A_cids)}   (+ {len(foreign)} foreign = {len(allc and live)+len(foreign)} live total under 4281)')
    print(f'B local       {len(B_iids)}')
    print(f'C id-map      {len(C_iids)} rows / {len(C_cids)} distinct C-ids')
    print(f'D import rows {len(D_rows)}')

    fail = []

    def eq(n1, s1, n2, s2):
        a, b = s1 - s2, s2 - s1
        ok = not a and not b
        print(f'  {n1} == {n2}: {"YES" if ok else "NO"}'
              + ('' if ok else f'   only in {n1}: {sorted(a)[:10]}   only in {n2}: {sorted(b)[:10]}'))
        if not ok:
            fail.append(f'{n1} != {n2}')

    print('\nSET EQUALITY, BOTH DIRECTIONS (Standing Rule 50):')
    eq('A(live C-ids)', A_cids, 'C(id-map C-ids)', C_cids)
    eq('B(local ids)', B_iids, 'C(id-map ids)', C_iids)
    eq('A(section+title)', A_keys, 'D(import section+title)', set(D_keys))
    dups = [k for k in set(D_keys) if D_keys.count(k) > 1]
    print(f'  D duplicate (section,title) rows: {dups if dups else "NONE"}')
    if dups:
        fail.append('duplicate import rows')

    # ---- import hygiene, exactly
    import hashlib
    peers = ['fees-discounts-v1', 'simple-flow-v1', 'filters-v1', 'schedule-v1',
             'global-search-v2', 'report-suite-v1']
    hashes = {}
    for p in peers:
        with open(os.path.join(REPO, 'testrail-import', p + '-testrail-import.csv'), 'rb') as fh:
            hashes[p] = hashlib.sha256(fh.readline()).hexdigest()
    uniq = set(hashes.values())
    print(f'\nimport header sha256 identical across all {len(peers)} projects: '
          f'{"YES" if len(uniq) == 1 else "NO"}  {sorted(uniq)[0][:16]}')
    if len(uniq) != 1:
        fail.append('import header hash drift'); print(hashes)

    blob = '\n'.join('\t'.join(r) for r in D_rows).lower()
    for w in ('viu', 'feature flag', 'flag on', 'flag off'):
        n = blob.count(w)
        print(f'  "{w}" occurrences in import cells: {n}')
        if n:
            fail.append(f'"{w}" leaked into the import')

    import re
    leaks = re.findall(r'(?:SBC|SBR|PV|TU|WIP|IV)-[A-Z]+-\d+', '\n'.join('\t'.join(r) for r in D_rows))
    print(f'  internal-id leaks in import cells: {leaks if leaks else "NONE"}')
    if leaks:
        fail.append('internal-id leak')

    print('\n' + ('RECONCILIATION FAILED: ' + '; '.join(fail) if fail
                  else 'ALL FOUR POPULATIONS RECONCILE BY SET EQUALITY IN BOTH DIRECTIONS.'))
    sys.exit(1 if fail else 0)


if __name__ == '__main__':
    main()
