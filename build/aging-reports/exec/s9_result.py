"""s9_result.py — 11 Nov 2026: pictures + RESULTS json for the s9/s9b/s9c totals tests. Each step picture marks the filter chips and the table
with the step's own reading (Totals row text from s9/<id>.json); exports become text pictures (PDF Totals line / CSV head + last rows).
Use from python: from s9_result import build; build('C715458', {'0-open': 'title', ...}, observed=[...], verdict='Passed', tag='x')."""
import json, subprocess, os
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def _txt(lines, out, title):
    f = PP + 's9/_tmp.txt'; open(f, 'w').write('\n'.join(lines)); subprocess.run(['python3.12', PP + 'textpic.py', f, out, str(len(lines)), title], capture_output=True); return out
def build(cid, titles, observed, verdict='Passed', tag='s9', exports=True, extra=None):
    o = json.load(open(PP + 's9/%s.json' % cid)); pics = []
    for st in o['steps']:
        if 'label' in st and st['label'] in titles:
            note = 'Totals row: ' + (st.get('totals') or 'not shown').replace('Totals ', '')
            out = PP + 'pics/%s-%s.png' % (cid, st['label'])
            ann(st['shot'], out, titles[st['label']], [], [], [(278, 115, 1132, 38, 'good', 'Filters: ' + ' · '.join(c.split(' keyboard')[0].split(' ', 1)[-1] for c in st['chips'] if ':' in c)), (278, 161, 1132, 690, 'good' if verdict == 'Passed' else 'bad', note)])
            pics.append(out)
        elif 'step' in st and exports:
            r = st['r']; f = r.get('file')
            if not f: continue
            if f.endswith('.pdf'):
                t = subprocess.run(['pdftotext', '-layout', f, '-'], capture_output=True, text=True).stdout.splitlines(); t = [l.rstrip() for l in t if l.strip()]
                lines = t[:4] + ['…'] + [l for l in t if l.strip().startswith('Totals')][-1:]
                pics.append(_txt([l[:150] for l in lines], PP + 'pics/%s-%s.png' % (cid, st['step']), 'PDF %s: first lines and the Totals row' % os.path.basename(f)))
            elif f.endswith('.csv'):
                raw = open(f, encoding='utf-8-sig').read().splitlines(); lines = raw[:5] + (['…'] if len(raw) > 8 else []) + raw[-2:] if len(raw) > 7 else raw
                pics.append(_txt([l[:150] for l in lines], PP + 'pics/%s-%s.png' % (cid, st['step']), 'CSV %s: top rows and the Totals row' % os.path.basename(f)))
    res = {'verdict': verdict, 'observed': observed, 'pictures': pics}
    if extra: res.update(extra)
    path = PP + 'RESULTS-%s-%s.json' % (tag, cid)
    json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, exact-amount totals (%s)' % tag}, 'results': {cid: res}}, open(path, 'w'), indent=1)
    return path
