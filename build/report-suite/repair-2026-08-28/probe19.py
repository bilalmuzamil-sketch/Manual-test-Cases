#!/usr/bin/env python3
import json, os, sys, re, time
HERE = os.path.dirname(os.path.abspath(__file__)); RS = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(RS, 'repin-2026-08-28'))
sys.path.insert(0, os.path.join(RS, 'writes-2026-08-26'))
from classify import login, field_containers, BASE       # noqa
ALL = ['C26427','C26489','C29946','C29948','C29950','C29951','C29952','C29953','C29954',
       'C29955','C29963','C30008','C30016','C30034','C30052','C30057','C30066','C30071','C38872']
op = login(); out = {}
for cid in ALL:
    num = cid[1:]
    page = op.open(f'{BASE}/index.php?/cases/view/{num}', timeout=90).read().decode('utf-8','replace')
    open(f'/tmp/rspin/repair/page-{cid}.html','w').write(page)
    fc = field_containers(page)
    out[cid] = {k: fc[k][0] for k in fc}
    exp = re.sub(r'<br\s*/?>|</p>|</li>', '\n', fc['Expected Result'][1])
    exp = re.sub(r'<[^>]+>', '', exp)
    lines = [l.strip() for l in exp.split('\n') if l.strip()]
    out[cid]['expected_rendered_lines'] = len(lines)
    print(cid, out[cid], flush=True)
    time.sleep(0.3)
json.dump(out, open('/tmp/rspin/repair/CONTAINERS.json','w'), indent=1)
