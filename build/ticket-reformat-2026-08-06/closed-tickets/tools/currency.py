#!/usr/bin/env python3
"""Standing Rule 59: re-read the sources immediately before the writes begin, not only at
pass start. Cheap check -- the live Confluence version number of every spec a closed ticket
will cite, compared against the version the two reformat passes fetched this morning.

Writes snapshots/source-currency.json with BOTH timestamps and the verdict per source.
"""
import json, os, sys, datetime

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..', 'attachment-audit', 'tools'))
import jira as J

PAGES = {
    'filters':  ('572030978', 19, 'Filters'),
    'schedule': ('713031682', 25, 'Schedule'),
    'pv':       ('620888066', 5, 'Parts Velocity Report'),
}

out, moved = {}, []
for slug, (pid, expect, name) in PAGES.items():
    code, d = J.get(f'/wiki/api/v2/pages/{pid}?body-format=storage', f'/tmp/_cur_{slug}.json')
    if code != '200':
        out[slug] = {'error': f'HTTP {code}'}
        moved.append(slug)
        continue
    v = d['version']['number']
    out[slug] = {'pageId': pid, 'name': name, 'live_version': v, 'baseline_version': expect,
                 'version_created': d['version'].get('createdAt'),
                 'verdict': 'CURRENT' if v == expect else 'MOVED'}
    if v != expect:
        moved.append(slug)
    print(f'{slug:10} page {pid} live v{v} baseline v{expect} -> {out[slug]["verdict"]}')

rec = {'checked_at_utc': datetime.datetime.utcnow().isoformat() + 'Z',
       'baseline_fetched_at': '2026-08-06 ~13:17-13:18 UTC by the two reformat passes',
       'sources': out, 'moved': moved,
       'verdict': 'ALL CURRENT - no re-derivation needed' if not moved
                  else 'MOVED - re-diff before writing: ' + ', '.join(moved)}
json.dump(rec, open(os.path.join(HERE, '..', 'snapshots', 'source-currency.json'), 'w'), indent=1)
print('\n' + rec['verdict'])
