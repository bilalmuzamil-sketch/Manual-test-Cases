# Resolve text-anchored marks to coordinates with the OCR cache, then call annotate_v2.py. Prints misses.
import json, os, re, subprocess, sys
S = '/tmp/claude-0/-home-user/ef40c1d4-3e84-5396-9a66-1a25d97a7768/scratchpad/'
E = '/home/user/Manual-test-Cases/build/ar-ap-report-sorting/v1-regression/live-run-2026-11-11/evidence/'
OUT = '/home/user/Manual-test-Cases/build/ar-ap-report-sorting/v1-regression/live-run-2026-11-11/testrail-results-v2/pics/'
sys.path.insert(0, S); from spec import K
R = {c['key']: c for c in json.load(open('/home/user/Manual-test-Cases/build/ar-ap-report-sorting/v1-regression/live-run-2026-11-11/results.json'))['cases']}
OCR = json.load(open(S + 'ocr.json'))
norm = lambda s: re.sub(r'\s+', '', s).lower()
def find(items, needle, region):
    n = norm(needle)
    for it in items:
        x0, y0, x1, y1, t = it
        if region == 'content' and x0 < 268: continue
        if region == 'nav' and x0 >= 268: continue
        if region == 'top' and y0 > 60: continue
        if region == 'below' and y0 < 60: continue
        if n in norm(t): return it
def resolve(items, needle, mode):
    reg = {'row': 'content', 'text': 'content', 'span': 'content', 'nav': 'nav', 'navspan': 'nav', 'top': 'top', 'any': 'below', 'anyspan': 'below'}[mode]
    if 'span' in mode:
        a, b = needle.split('||'); ia = find(items, a, reg); ib = find(items, b, reg)
        if not ia or not ib: return None
        x0 = min(ia[0], ib[0]); y0 = min(ia[1], ib[1]); x1 = max(ia[2], ib[2]); y1 = max(ia[3], ib[3])
        if reg == 'content': x0, x1 = 280, 1425
        return x0 - 6, y0 - 6, x1 + 6, y1 + 6
    it = find(items, needle, reg)
    if not it: return None
    if mode == 'row':
        cy0, cy1 = it[1], it[3]
        row = [i for i in items if i[0] >= 268 and i[1] < cy1 - 3 and i[3] > cy0 + 3]
        return 282, min(i[1] for i in row) - 6, 1425, max(i[3] for i in row) + 6
    return it[0] - 5, it[1] - 4, it[2] + 5, it[3] + 4
def main(only=None):
    os.makedirs(OUT, exist_ok=True); miss = []; made = {}
    for key, spec in K.items():
        if only and key not in only: continue
        if spec['p'] == 'FRESH': continue
        cid = R[key]['cid']; made[key] = []
        for n, (f, title, marks) in enumerate(spec['p'][:6], 1):
            items = OCR.get(f)
            if items is None: miss.append((key, f, 'NO OCR / no file')); continue
            args = []
            boxes = []
            for needle, kind, cap, mode in marks:
                b = resolve(items, needle, mode)
                if not b: miss.append((key, f, needle)); continue
                boxes.append((b, kind, cap))
            boxes.sort(key=lambda z: z[0][1])
            for (x0, y0, x1, y1), kind, cap in boxes:
                args += ['--mark', '%d,%d,%d,%d:%s:%s' % (x0, y0, x1 - x0, y1 - y0, kind, cap)]
            slug = re.sub(r'[^a-z0-9]+', '-', re.sub(r'^V1R-\d+ - ', '', f[:-4]).lower()).strip('-')[:48]
            out = OUT + '%s-%d-%s.png' % (cid, n, slug)
            r = subprocess.run(['python3', S + 'xtools/annotate_v2.py', E + f, out, '--title', title, '--scale', '1'] + args, capture_output=True, text=True)
            if r.returncode: miss.append((key, f, 'annotate failed ' + r.stderr[-200:]))
            made[key].append(out)
    json.dump(made, open(S + 'pics.json', 'w'), indent=1)
    print('cases', len(made), 'pictures', sum(len(v) for v in made.values()))
    for m in miss: print('MISS', m)
main(sys.argv[1:] or None)
