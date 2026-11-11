"""s78_result.py — 11 Nov 2026: pictures for s78 runs (exec/s78/<id>.json, shots [{name, f, boxes}]). pics(cid, {name: (title, [box text regex], kind)})
boxes every on-screen element whose text matches one of the regexes (thead headings, rows, chips). Returns the picture paths."""
import json, re
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def pics(cid, spec, folder='s78'):
    o = json.load(open(PP + '%s/%s.json' % (folder, cid))); out = []
    for sh in o.get('shots', []):
        if sh['name'] not in spec: continue
        title, pats, kind = spec[sh['name']]; bx = []
        for pat in pats:
            m = [b for b in sh.get('boxes', []) if re.search(pat, re.sub(r'(keyboard_arrow_\w+|arrow_drop_\w+)', '', b[0]).strip()) and b[4] > 10]
            if m: b = m[0]; bx.append((b[1], b[2], b[3], b[4], kind, re.sub(r'(keyboard_arrow_\w+|arrow_drop_\w+)', '', b[0]).strip()[:60]))
        f = PP + 'pics/%s-%s.png' % (cid, sh['name']); ann(sh['f'].replace('//', '/'), f, title, [], [], bx); out.append(f)
    return out
