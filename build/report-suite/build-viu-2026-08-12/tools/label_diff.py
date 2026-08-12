"""Diff the labels our cases QUOTE against the labels the build actually shows.

Playbook I traps this obeys:
  - visible TEXT NODES only for the verdict; aria-label is diagnostic, never the label
  - a placeholder ("N Lines", "<name>") is not a mismatch
  - a NEGATIVE assertion ("there is no 'View Day' item") is not a mismatch
"""
import json, re
from collections import Counter

H = json.load(open('build/report-suite/build-viu-2026-08-12/evidence/harvest-all.json'))
R = json.load(open('/tmp/rs812/rows.json'))['rows']
MAP = {'Work In Progress': 'wip', 'Technician Utilization': 'tu',
       'Sales By Customer Report': 'sbc', 'Sales By Representative Report': 'sbr',
       'Parts Velocity Report': 'pv', 'Inventory Value': 'iv'}
ICON = re.compile(r'arrow_drop_(up|down)|keyboard_double_arrow_down|info_outline')


def corpus(k):
    h = H.get(k) or {}
    vis = set()
    for t in h.get('texts', []):
        vis.add(t)
    for x in h.get('headers', []):
        vis.add(ICON.sub('', x).strip())
    for b in h.get('buttons', []):
        if b.get('txt'):
            vis.add(ICON.sub('', b['txt']).strip())
    for t in h.get('tabs', []):
        vis.add(ICON.sub('', t.get('txt', '')).strip())
    for p in h.get('placeholders', []):
        vis.add(p)
    for m in (h.get('menus') or {}).values():
        if isinstance(m, dict):
            for it in (m.get('items') or []):
                vis.add(it.get('txt', '').strip())
            for r in (m.get('raw') or []):
                vis.add(r.strip())
    return vis, set(h.get('aria', []) or []), set(h.get('testids', []) or [])


Q = re.compile(r'"([^"\n]{2,45})"')
NEG = re.compile(r'\b(no|not|never|absent|does not|is no|there is no|without|hidden|'
                 r'missing|instead of|rather than|used to|neither|nor|removed)\b', re.I)
PLACE = re.compile(r'(?<![A-Za-z])[NX](?![A-Za-z])|<[^>]+>|\{[^}]+\}|\.\.\.|…')
STOP = {'Locations:', 'Date Range:', 'Yes', 'No', 'OK', 'Cancel', 'Close', 'Save', '$', '-'}

out, tot, miss = {}, 0, 0
for row in R:
    k = MAP.get(row['report'])
    if not k or k not in H or 'err' in H[k]:
        continue
    vis, aria, tids = corpus(k)
    visj = '  '.join(vis)
    body = row['expected'].split('\n---\n')[0]
    txt = '\n'.join([row['title'] or '', row['preconds'] or '', row['steps'] or '', body])
    labels = set()
    for line in txt.splitlines():
        if NEG.search(line):
            continue
        for m in Q.findall(line):
            s = m.strip()
            if not s or s in STOP or PLACE.search(s):
                continue
            labels.add(s)
    for s in sorted(labels):
        tot += 1
        if s in vis or s in visj:
            continue
        miss += 1
        out.setdefault(row['report'], []).append({
            'case': row['id'], 'title': (row['title'] or '')[:70], 'label': s,
            'in_aria_only': any(s in a for a in aria),
            'in_testid': any(s.lower().replace(' ', '_') in t for t in tids)})

print('quoted labels checked: %d   not found in harvested visible text: %d' % (tot, miss))
json.dump(out, open('/tmp/rs812/labeldiff.json', 'w'), indent=1)
for rep, items in sorted(out.items()):
    c = Counter(i['label'] for i in items)
    print('\n== %s  (%d hits, %d distinct)' % (rep, len(items), len(c)))
    for lab, n in c.most_common(20):
        ex = [i for i in items if i['label'] == lab][0]
        flag = ' [ARIA-ONLY]' if ex['in_aria_only'] else (' [testid]' if ex['in_testid'] else '')
        print('   %3dx  %r%s   e.g. C%s' % (n, lab, flag, ex['case']))
