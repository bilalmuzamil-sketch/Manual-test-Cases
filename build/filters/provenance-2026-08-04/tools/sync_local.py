#!/usr/bin/env python3
"""
Standing Rule 54 provenance retrofit — mirror the executed TestRail state back into
the LOCAL case source, so a regenerated import carries the provenance line too.

Reads the executed plan.json (the intended payload IS what is live, proven by the
byte verification in exec-log.jsonl) and writes:
  * cases/*.json  ->  `expected` gains the provenance block; `spec_ref` refreshed
  * testrail-id-map.csv -> `refs` column refreshed where the project has one

usage: python3 sync_local.py <project>
"""
import json, os, sys, csv, glob, re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..', '..'))
sys.path.insert(0, HERE)
from classify import SEP, LEAD                                     # noqa: E402


def strip_local(lines):
    """Drop a previously appended provenance block from a local `expected` list."""
    out = []
    for ln in lines:
        if isinstance(ln, str) and (ln.strip() == SEP or ln.lstrip().startswith(LEAD)):
            continue
        out.append(ln)
    return out


def main():
    project = sys.argv[1]
    proj_dir = os.path.join(ROOT, 'build', project)
    plan = json.load(open(os.path.join(HERE, '..', 'plan.json')))
    log = [json.loads(l) for l in open(os.path.join(HERE, '..', 'exec-log.jsonl'))]
    verified = {r['case_id'] for r in log if r['verify'] == 'MATCH'}
    by_cid = {e['case_id']: e for e in plan if e['case_id'] in verified}

    # internal id -> C-id
    idmap_path = os.path.join(proj_dir, 'testrail-id-map.csv')
    rows = list(csv.DictReader(open(idmap_path)))
    hdr = list(rows[0].keys())
    to_cid = {r['internal_id']: int(r['testrail_case_id'].lstrip('C')) for r in rows}

    touched = files = 0
    for f in sorted(glob.glob(os.path.join(proj_dir, 'cases', '*.json'))):
        data = json.load(open(f))
        changed = False
        for c in data:
            cid = to_cid.get(c.get('id'))
            if cid not in by_cid:
                continue
            e = by_cid[cid]['intended']
            # expected: rebuild the list from the stripped body + the block
            body = strip_local(c.get('expected') or [])
            block = e['custom_expected'].split(f'\n{SEP}\n')
            sentence = block[-1].strip() if len(block) > 1 else ''
            c['expected'] = body + [SEP, sentence]
            if 'refs' in e:
                c['spec_ref'] = e['refs']
            if 'custom_preconds' in e:
                c['preconditions'] = [ln for ln in
                                      e['custom_preconds'].split('\n') if ln.strip()]
            changed = True
            touched += 1
        if changed:
            json.dump(data, open(f, 'w'), indent=1, ensure_ascii=False)
            files += 1

    # id-map refs column
    if 'refs' in hdr:
        n = 0
        for r in rows:
            cid = int(r['testrail_case_id'].lstrip('C'))
            if cid in by_cid and 'refs' in by_cid[cid]['intended']:
                r['refs'] = by_cid[cid]['intended']['refs']; n += 1
        with open(idmap_path, 'w', newline='') as fh:
            w = csv.DictWriter(fh, fieldnames=hdr); w.writeheader(); w.writerows(rows)
        print(f'   id-map refs column refreshed on {n} rows')
    else:
        print(f'   id-map has no refs column ({hdr}) — nothing to refresh there')

    print(f'{project}: {touched} local cases synced across {files} files')
    blanks = [r['internal_id'] for r in rows if not r['testrail_case_id'].strip()]
    print(f'   id-map rows {len(rows)} · blank C-ids {len(blanks)}')


if __name__ == '__main__':
    main()
