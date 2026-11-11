"""s2d3_result.py — 11 Nov 2026: pictures for the s2d3 sort runs (C715299, C715307, C715312, C715314): one annotated picture per click
step from s2/<id>.json, the sorted header boxed. Usage: from s2d3_result import pics; pics('C715312', {'click Date #3': 'Step 3: ...'})."""
import json, re
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def pics(cid, titles):
    o = json.load(open(PP + 's2/%s.json' % cid)); out = []
    for st in o['steps']:
        if st['label'] not in titles: continue
        hdr = [b for b in st.get('boxes', []) if re.sub(r'(keyboard_arrow_\w+|arrow_drop_\w+)', '', b[0]).strip() in [t['t'] for t in st.get('ths', []) if t.get('aria')]]
        boxes = [(b[1], b[2], b[3], b[4], 'good', 'Sorted column (' + [t['aria'] for t in st['ths'] if t.get('aria')][0] + ')') for b in [h for h in hdr if h[4] > 30][:1]]
        f = PP + 'pics/%s-%s.png' % (cid, st['label'].replace(' ', '_').replace('#', ''))
        ann(st['shot'].replace('s2//', 's2/'), f, titles[st['label']], [], [], boxes); out.append(f)
    return out
