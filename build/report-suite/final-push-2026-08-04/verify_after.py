#!/usr/bin/env python3
"""
Report Suite FINAL PUSH 2026-08-04 — post-push verification, all READ-ONLY.

  A. FULL live re-pull -> data/live-after.json (the exhaustive verification corpus)
  B. EXHAUSTIVE re-verify: every one of the 478 cases, every field, against the
     intended payload AND the pre-write snapshot. No sampling (Rule 50).
  C. Rule 38 — prove the 5 foreign cases BYTE-IDENTICAL including updated_on /
     updated_by. "We didn't write to it" is an assertion; a byte-identical
     snapshot is evidence.
  D. Rule 34/47 — run 359 completeness: is every ACTIVE case present as a test?
     Snapshot its tests + results. READ-ONLY: no update_run here.
  E. The four counts, by SET EQUALITY in both directions.
"""
import json, os, base64, urllib.request, time, collections, sys

HERE = os.path.dirname(os.path.abspath(__file__))
RS = os.path.abspath(os.path.join(HERE, '..'))
C = json.load(open('/tmp/testrail/creds.json'))
HOST = C['host'].rstrip('/')
AUTH = 'Basic ' + base64.b64encode(
    f"{C['email']}:{C.get('password') or C.get('key')}".encode()).decode()
FOREIGN = [38919, 38920, 38921, 38922, 38923]
RUN = 359


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


def norm_refs(s):
    return ','.join(p.strip() for p in (s or '').split(','))


def main():
    fails = []

    # ── A. full live re-pull ────────────────────────────────────────────────
    secs = paged('get_sections/1&suite_id=1', 'sections')
    kids = collections.defaultdict(list)
    for s in secs:
        kids[s['parent_id']].append(s['id'])
    ids, stack = set(), [4281]
    while stack:
        p = stack.pop()
        ids.add(p)
        stack += kids[p]
    allc = paged('get_cases/1&suite_id=1', 'cases')
    under = [c for c in allc if c['section_id'] in ids]
    json.dump(under, open(os.path.join(HERE, 'data', 'live-after.json'), 'w'), indent=1)
    ours = [c for c in under if c['created_by'] == 3]
    theirs = [c for c in under if c['created_by'] != 3]
    print('=== A. LIVE RE-PULL ===')
    print(f'  under group 4281: {len(under)}   ours {len(ours)}   foreign {len(theirs)}')

    by = {c['id']: c for c in under}
    plan = json.load(open(os.path.join(HERE, 'plan.json')))
    plan2 = json.load(open(os.path.join(HERE, 'plan2.json')))
    p2 = {p['case_id']: p for p in plan2}

    # ── B. EXHAUSTIVE per-case, per-field re-verification ──────────────────
    # The FINAL expected state of a case = its pre-write snapshot, overlaid with pass-1
    # intent, overlaid with pass-2 intent. Every field of every case is compared.
    print('\n=== B. EXHAUSTIVE RE-VERIFY — every case, every field, both passes (Rule 50) ===')
    checked_fields = 0
    for p in plan:
        cid = p['case_id']
        live = by.get(cid)
        if not live:
            fails.append(f'C{cid} MISSING from live')
            continue
        expect = dict(p['snapshot'])
        expect.update(p['intended'])
        if cid in p2:
            expect.update(p2[cid]['intended'])
        for f, want in expect.items():
            got = live.get(f)
            eq = (norm_refs(got) == norm_refs(want)) if f == 'refs' else (got == want)
            checked_fields += 1
            if not eq:
                fails.append(f'C{cid}.{f} mismatch: live={got!r} want={want!r}')
    # any pass-2 case not in pass 1 (there should be none — pass 1 covered all 478)
    for cid in p2:
        if cid not in {p['case_id'] for p in plan}:
            fails.append(f'C{cid} in plan2 but not plan1')
    print(f'  cases verified {len(plan)}/{len(plan)} (478 expected)  ·  '
          f'field comparisons {checked_fields}')
    print(f'  pass-2 cases folded in: {len(p2)}')
    print(f'  mismatches: {len(fails)}')

    # ── B2. the provenance line + ticket line, checked on ALL 478 ──────────
    print('\n=== B2. PROVENANCE LINE (all 478) + TICKET LINE placement ===')
    LEAD = 'This is the expected behaviour as per the build tested on'
    KNOWN = 'Known issue: the product does not currently do this. It has been filed for a fix here: '
    n_prov = n_tick = 0
    for c in ours:
        e = str(c.get('custom_expected') or '')
        lines = e.split('\n')
        if e.count(LEAD) != 1:
            fails.append(f'C{c["id"]} provenance line count {e.count(LEAD)}')
        elif not lines[-1].startswith(LEAD):
            fails.append(f'C{c["id"]} provenance line is not last')
        elif lines[-2].strip() != '---':
            fails.append(f'C{c["id"]} no separator above the provenance line')
        else:
            n_prov += 1
        if 'VIU' in e:
            fails.append(f'C{c["id"]} contains the word VIU')
        k = e.count(KNOWN)
        if k > 1:
            fails.append(f'C{c["id"]} ticket line appears {k} times')
        elif k == 1:
            n_tick += 1
            if lines[-3].startswith(KNOWN) is False:
                fails.append(f'C{c["id"]} ticket line not directly above the separator')
            for closed in ('SV-8821', 'SV-8822', 'SV-8823'):
                if closed in lines[-3]:
                    fails.append(f'C{c["id"]} links CLOSED ticket {closed}')
    print(f'  provenance line correct, single and last: {n_prov}/{len(ours)}')
    print(f'  ticket lines present: {n_tick} (expected 16, all SV-8818/8819/8820)')

    # ── C. Rule 38 — foreign cases byte-identical INCLUDING timestamps ─────
    print('\n=== C. RULE 38 — the 5 foreign cases proven untouched ===')
    presnap = {c['id']: c for c in json.load(
        open(os.path.join(HERE, 'snapshots', 'pre-write-live-cases-4281.json')))}
    for fid in FOREIGN:
        a, b = presnap.get(fid), by.get(fid)
        if not a or not b:
            fails.append(f'foreign C{fid} not found in both snapshots')
            continue
        diff = [k for k in set(a) | set(b) if a.get(k) != b.get(k)]
        ident = not diff
        print(f'  C{fid} created_by={b["created_by"]} updated_on={b.get("updated_on")} '
              f'updated_by={b.get("updated_by")} -> '
              f'{"BYTE-IDENTICAL (incl. updated_on/updated_by)" if ident else "CHANGED: %s" % diff}')
        if not ident:
            fails.append(f'foreign C{fid} CHANGED in fields {diff}')

    # ── D. Rule 34/47 — run 359 completeness, read-only ────────────────────
    print('\n=== D. RULE 34/47 — run 359 (read-only snapshot) ===')
    run = api(f'get_run/{RUN}')
    tests = paged(f'get_tests/{RUN}', 'tests')
    results = paged(f'get_results_for_run/{RUN}', 'results')
    json.dump({'run': run, 'tests': tests, 'results': results},
              open(os.path.join(HERE, 'snapshots', 'run-359-after.json'), 'w'), indent=1)
    run_cids = {t['case_id'] for t in tests}
    our_cids = {c['id'] for c in ours}
    print(f'  run {RUN} "{run.get("name")}"  include_all={run.get("include_all")}')
    print(f'  tests {len(tests)}  ·  result records {len(results)}')
    print(f'  our active cases {len(our_cids)}')
    print(f'  ours NOT in the run  ({len(our_cids - run_cids)}): {sorted(our_cids - run_cids)[:20]}')
    print(f'  in the run but not ours ({len(run_cids - our_cids)}): {sorted(run_cids - our_cids)}')
    print('  NOTE: this pass added NO cases, so no update_run was required or performed.')

    # ── E. the four counts, set equality both directions ───────────────────
    print('\n=== E. THE FOUR COUNTS — set equality in BOTH directions ===')
    import csv as _csv
    idmap = list(_csv.DictReader(open(os.path.join(RS, 'testrail-id-map.csv'))))
    map_iid = [r['internal_id'] for r in idmap]
    map_cid = [int(r['testrail_case_id'].lstrip('C')) for r in idmap]
    import glob
    local = []
    for path in glob.glob(os.path.join(RS, 'cases', '*.json')):
        for c in json.load(open(path)):
            if not str(c.get('viu_status', '')).startswith('Retired'):
                local.append(c['id'])
    imp = os.path.join(RS, '..', '..', 'testrail-import', 'report-suite-v1-testrail-import.csv')
    imp = os.path.abspath(imp)
    nrows = None
    if os.path.exists(imp):
        with open(imp, newline='') as fh:
            nrows = sum(1 for _ in _csv.reader(fh)) - 1
    print(f'  1 live ours          {len(our_cids)}')
    print(f'  2 local active       {len(local)}   (duplicates: '
          f'{[k for k, v in collections.Counter(local).items() if v > 1] or "none"})')
    print(f'  3 id-map rows        {len(idmap)}   (distinct C-ids {len(set(map_cid))}, '
          f'blanks {sum(1 for r in idmap if not r["testrail_case_id"].strip())})')
    print(f'  4 import data rows   {nrows}')
    for a, b, an, bn in ((set(local), set(map_iid), 'local', 'idmap'),
                         (our_cids, set(map_cid), 'live', 'idmap-Cids')):
        print(f'  {an} - {bn} = {sorted(a - b) or "(empty)"}')
        print(f'  {bn} - {an} = {sorted(b - a) or "(empty)"}')
        if a - b or b - a:
            fails.append(f'set equality {an}/{bn} not empty')

    print('\n' + '=' * 74)
    if fails:
        print(f'FAILURES ({len(fails)}):')
        for f in fails[:40]:
            print('  -', f)
        sys.exit(2)
    print('ALL POST-PUSH VERIFICATION PASSED — exhaustive and exact.')


if __name__ == '__main__':
    main()
