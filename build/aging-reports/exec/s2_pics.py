"""s2_pics.py — 11 Nov 2026: annotated pictures for S2 sort results from s2/<id>.json (each step: shot + boxes). For each wanted step it
marks the header that carries the sort arrow and up to three rows matched by regex. Usage: python3 s2_pics.py (edits the PLAN below)."""
import json, re, sys
sys.path.insert(0, '.'); from ann import ann
def step(id, label_re):
    o = json.load(open(f's2/{id}.json'))
    return next(s for s in o['steps'] if re.search(label_re, s['label']))
def pic(id, label_re, out, title, head, rows):
    st = step(id, label_re); b = st['boxes']
    marks = [(r'^\S*\s*' + re.escape(head) + r'\s*(arrow_drop_(up|down))?$', 'good', head + ' carries the sort arrow')] if head else []
    marks += rows
    return ann(st['shot'], 'pics/' + out, title, b, marks)
PLAN = json.load(open(sys.argv[1]))
for p in PLAN: pic(p['id'], p['step'], p['out'], p['title'], p.get('head'), [tuple(x) for x in p['rows']])
