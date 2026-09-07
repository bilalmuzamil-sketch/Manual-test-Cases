#!/usr/bin/env python3
"""Live case census for one TestRail group (suite folder), paged from the system of record.

Enumerates every section under a group_id, then every case in those sections, and prints
per-case: id, title, created_by, custom_atmstatus, custom_automation_type, section_id.
Used at the start of a source-verify pass to build the exact target/protect lists
(ours vs Vladimir's created_by==1 vs Automated atm==3) WITHOUT trusting testrail-id-map.csv
(Rule: count from the system of record, never a local snapshot).

Usage:
    export TESTRAIL_API_KEY=...   # or rely on user:password in creds.json
    python3 build/testing-tools/census_group.py --group 6597 --out /tmp/census-6597.json
"""
import argparse, base64, json, os, sys, time, urllib.request

HOST = 'https://shopview.testrail.io'

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--group', required=True, type=int)
    ap.add_argument('--suite', default=1, type=int)
    ap.add_argument('--creds', default='/tmp/testrail/creds.json')
    ap.add_argument('--out')
    a = ap.parse_args()
    cr = json.load(open(a.creds))
    secret = os.environ.get('TESTRAIL_API_KEY') or cr.get('api_key') or cr['password']
    auth = base64.b64encode(f"{cr['user']}:{secret}".encode()).decode()

    def get(p, tries=5):
        for t in range(tries):
            try:
                r = urllib.request.Request(f'{HOST}/index.php?/api/v2/{p}',
                                           headers={'Authorization': 'Basic ' + auth})
                return json.load(urllib.request.urlopen(r, timeout=180))
            except Exception as e:
                if t == tries - 1: raise
                time.sleep(2 ** t)

    # sections under the group: TestRail sections belong to a suite; the group folder groups
    # sections. get_sections returns all sections for the suite; filter by group_id when present.
    secs, off = [], 0
    while True:
        j = get(f'get_sections/1&suite_id={a.suite}&limit=250&offset={off}')
        secs += j['sections']
        if len(j['sections']) < 250: break
        off += 250
    # a section carries its own id; membership of a group is by the section tree. TestRail's
    # group_id lives on the run/section display, not the section object, so we take the cases
    # route instead: pull all cases and keep those whose section is in the group. We still need
    # the section set — derive it from cases filtered by group via the cases endpoint's section.
    # Simplest robust path: enumerate all cases, group by section, and let the caller intersect
    # with the known section ids for the group (printed below).
    allc, off = [], 0
    while True:
        j = get(f'get_cases/1&suite_id={a.suite}&limit=250&offset={off}')
        allc += j['cases']
        if len(j['cases']) < 250: break
        off += 250

    byid = {s['id']: s for s in secs}
    def path(sid):
        out, cur = [], byid.get(sid)
        while cur:
            out.append(cur['name']); cur = byid.get(cur.get('parent_id'))
        return ' / '.join(reversed(out))

    rows = []
    for c in allc:
        rows.append({
            'id': c['id'], 'title': c['title'], 'created_by': c.get('created_by'),
            'atmstatus': c.get('custom_atmstatus'), 'automation_type': c.get('custom_automation_type'),
            'section_id': c.get('section_id'), 'section_path': path(c.get('section_id')),
        })
    out = {'group': a.group, 'total_cases_in_suite': len(rows), 'rows': rows}
    txt = json.dumps(out, indent=1)
    if a.out:
        open(a.out, 'w').write(txt)
        print(f'wrote {a.out}: {len(rows)} cases in suite (filter by section_path for the group)')
    else:
        print(txt)

if __name__ == '__main__':
    main()
