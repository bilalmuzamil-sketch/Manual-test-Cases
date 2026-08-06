#!/usr/bin/env python3
"""Final live re-read of the 8 closed tickets: shape, status, source quotes, attachments.
Nothing here trusts the write log -- it reads Jira again and checks the stored text.
"""
import json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.abspath(os.path.join(HERE, '..'))
ROOT = os.path.abspath(os.path.join(BASE, '..'))
sys.path.insert(0, os.path.join(ROOT, 'attachment-audit', 'tools'))
sys.path.insert(0, os.path.join(ROOT, 'report-suite', 'tools'))
sys.path.insert(0, HERE)
import jira as J
import adf
import content

SPECS = {
    'filters': os.path.join(ROOT, 'filters-schedule', 'snapshots', 'specs', 'filters-v19.txt'),
    'schedule': os.path.join(ROOT, 'filters-schedule', 'snapshots', 'specs', 'schedule-v25.txt'),
    'pv': os.path.join(ROOT, 'report-suite', 'specs', 'pv-v5.txt'),
}
TEXT = {k: open(v).read() for k, v in SPECS.items()}
WHICH = {'SV-8819': 'pv', 'SV-8843': 'filters', 'SV-8844': 'filters', 'SV-8847': 'filters',
         'SV-8923': 'schedule'}
BANNED = ['as per the build tested on', 'VIU', 'feature flag', 'AUTOMATION:']
HEADS = ['Description', 'Steps to reproduce', 'Current behaviour', 'Expected behaviour']

rows, fails = [], 0
for key in sorted(content.TICKETS, key=lambda k: int(k.split('-')[1])):
    rec = content.TICKETS[key]
    code, live = J.issue(key, out=os.path.join(BASE, 'snapshots', 'final', f'{key}.json'))
    f = live['fields']
    doc = f['description']
    txt = adf.flatten(doc)
    pre = json.load(open(os.path.join(BASE, 'snapshots', 'pre-write', f'{key}.json')))['fields']
    heads = [n['content'][0]['text'] for n in doc['content'] if n['type'] == 'heading']
    probe = rec.get('shape') == 'probe'
    checks = {
        'http': code == '200',
        'five_part_shape': (heads == HEADS) if not probe else (heads == []),
        'env_line_present': ('Environment: QA branch' in txt) if not probe else True,
        'has_numbered_list': any(n['type'] == 'orderedList' for n in doc['content'])
                             if not probe else True,
        'ends_rule_then_source': any(n['type'] == 'rule' for n in doc['content'])
                                 and 'Source' in txt,
        'says_it_is_closed': any(w in txt.lower() for w in
                                 ('closed as obsolete', 'closed as done', 'withdrawn',
                                  'is closed', 'closed as a', 'closed probe')),
        'banned_absent': not any(b in txt for b in BANNED),
        'status_unchanged': f['status']['name'] == pre['status']['name'],
        'resolution_unchanged': ((f.get('resolution') or {}).get('name') ==
                                 (pre.get('resolution') or {}).get('name')),
        'type_unchanged': f['issuetype']['name'] == pre['issuetype']['name'],
        'parent_unchanged': ((f.get('parent') or {}).get('key') ==
                             (pre.get('parent') or {}).get('key')),
        'priority_unchanged': f['priority']['name'] == pre['priority']['name'],
        'attachments_unchanged': (sorted(a['id'] for a in (f.get('attachment') or [])) ==
                                  sorted(a['id'] for a in (pre.get('attachment') or []))),
    }
    # every quoted requirement must be findable in the live spec text
    quotes = []
    slug = WHICH.get(key)
    for e in rec['source']:
        if e[0] in ('spec', 'same'):
            q = e[3] if e[0] == 'spec' else e[2]
            core = q.rstrip('.').split(' … ')[0][:90]
            ok = slug is not None and core in TEXT[slug]
            quotes.append({'quote_head': core[:70], 'found_in_live_spec': ok})
    checks['all_quotes_found'] = all(q['found_in_live_spec'] for q in quotes)
    bad = [k for k, v in checks.items() if not v]
    if bad:
        fails += 1
    rows.append({'ticket': key, 'status': f['status']['name'],
                 'resolution': (f.get('resolution') or {}).get('name'),
                 'headings': heads, 'checks': checks, 'quotes': quotes,
                 'verdict': 'PASS' if not bad else 'FAIL', 'failed': bad})
    print(f"{key:9} {f['status']['name']:10} {'PASS' if not bad else 'FAIL ' + str(bad):20} "
          f"quotes {sum(1 for q in quotes if q['found_in_live_spec'])}/{len(quotes)}")

json.dump({'tickets': len(rows), 'pass': len(rows) - fails, 'fail': fails, 'rows': rows},
          open(os.path.join(BASE, 'snapshots', 'FINAL-VERIFICATION.json'), 'w'), indent=1)
print(f'\n{len(rows)} tickets, {len(rows) - fails} PASS, {fails} FAIL')
