#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Read-only dossier for the 2026-08-28 approved batch.

For every case in the batch: fetch it live through the API AND read its RENDERED
view page, and record the facts a write decision depends on:
  custom_atmstatus (Rule 71) - the RENDERED container class per field (the flag
  get_case does not expose, and the cause of the 72 damaged cases on 2026-08-26) -
  the top-level block count - the cited specification version - the raw stored text.

Writes the whole dossier to /tmp (never the repo) and prints a compact table only.
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
RS = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(RS, 'writes-2026-08-26'))
sys.path.insert(0, os.path.join(RS, 'repin-2026-08-28'))
from tr import call                                                   # noqa: E402
from classify import login, field_containers, top_level_blocks, LITERALS, ENTITIES, BASE  # noqa: E402

OUT = '/tmp/job828/dossier.json'
CASES = [int(x) for x in sys.argv[1:]]

op = login()
rows, dump = [], {}
for cid in CASES:
    st, c = call('get_case/%d' % cid)
    if st != 200:
        rows.append((cid, 'HTTP %s' % st, '', '', '', ''))
        continue
    page = op.open('%s/index.php?/cases/view/%d' % (BASE, cid), timeout=90).read().decode('utf-8', 'replace')
    fc = field_containers(page)
    exp = c.get('custom_expected') or ''
    vers = sorted(set(re.findall(r'specification version (\d+)', exp)))
    dmg = []
    for label in ('Preconditions', 'Steps', 'Expected Result'):
        for t in LITERALS:
            if t in fc[label][1]:
                dmg.append('%s:%s' % (label[:4], t))
        for t in ENTITIES:
            if t in fc[label][1]:
                dmg.append('%s:%s' % (label[:4], t))
    dump[str(cid)] = {
        'title': c.get('title'), 'atmstatus': c.get('custom_atmstatus'),
        'refs': c.get('refs'), 'section_id': c.get('section_id'),
        'containers': {k: fc[k][0] for k in fc},
        'blocks': {f: top_level_blocks(c.get(f)) for f in ('custom_preconds', 'custom_steps', 'custom_expected')},
        'versions_cited': vers, 'damage': dmg,
        'custom_preconds': c.get('custom_preconds'), 'custom_steps': c.get('custom_steps'),
        'custom_expected': exp,
        'rendered_expected_html': fc['Expected Result'][1],
    }
    rows.append((cid, c.get('custom_atmstatus'), fc['Expected Result'][0],
                 dump[str(cid)]['blocks']['custom_expected'], ','.join(vers) or '-',
                 ('DAMAGE:' + ';'.join(dmg)) if dmg else 'clean'))
    print('%-7s atm=%-4s exp_container=%-16s blocks=%-3s vers=%-8s %s' % rows[-1], flush=True)

json.dump(dump, open(OUT, 'w'), indent=1)
print('\nwrote', OUT, len(dump), 'cases')
