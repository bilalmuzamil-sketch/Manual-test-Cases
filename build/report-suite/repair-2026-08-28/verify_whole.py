#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Rule 41 - after a repair, RE-VERIFY THE WHOLE CASE, not just the field touched."""
import json, os, sys, re, html
HERE = os.path.dirname(os.path.abspath(__file__)); RS = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(RS, 'repin-2026-08-28')); sys.path.insert(0, os.path.join(RS, 'writes-2026-08-26'))
from tr import call                                                    # noqa
from classify import login, field_containers, BASE, LITERALS, ENTITIES  # noqa
from repair import plain, lines_of, fetch_page, ORDER                   # noqa

op = login(); rows = []
for cid in ORDER:
    num = cid[1:]
    s, c = call('get_case/' + num); assert s == 200
    page = fetch_page(op, num); fc = field_containers(page)
    bad = []
    for label in ('Preconditions', 'Steps', 'Expected Result'):
        cls, htm = fc[label]
        if cls != 'markdown fr-view':
            bad.append('%s container %r' % (label, cls))
        for t in LITERALS:
            if t in htm: bad.append('literal %s in %s' % (t, label))
        for t in ENTITIES:
            if t in htm: bad.append('entity %s in %s' % (t, label))
        if not lines_of(htm): bad.append('%s is EMPTY' % label)
    exp = lines_of(fc['Expected Result'][1])
    nauto = sum(1 for l in exp if l.startswith('AUTOMATION: '))
    if nauto > 1: bad.append('AUTOMATION marker x%d' % nauto)
    if nauto == 1 and not exp[-1].startswith('AUTOMATION: '): bad.append('AUTOMATION not last')
    rows.append({'cid': cid, 'title': c['title'], 'title_len': len(c['title']),
                 'refs': c.get('refs'), 'atmstatus': c.get('custom_atmstatus'),
                 'automation_type': c.get('custom_automation_type'),
                 'precond_lines': len(lines_of(fc['Preconditions'][1])),
                 'step_lines': len(lines_of(fc['Steps'][1])),
                 'expected_lines': len(exp), 'automation_markers': nauto,
                 'provenance': 'This is the expected behaviour' in ' '.join(exp),
                 'problems': bad})
    print(json.dumps(rows[-1], ensure_ascii=False), flush=True)
json.dump(rows, open(os.path.join(HERE, 'WHOLE-CASE-VERIFY.json'), 'w'), indent=1)
print('\ncases with problems:', [r['cid'] for r in rows if r['problems']])
