"""Assemble split.json from per-chunk decision files in split_parts/.
Each part file defines D = {id: (pre_list, setup_specs, note)}; id absent or pre_list None => change false.
setup spec: str (exact substring of some item) | int j (item j minus leading arrow) |
            (j, start, end) -> item[j] from `start` (inclusive) to `end` (inclusive; None = to end of item).
pre entry: str | int j (item j verbatim)."""
import json, glob, runpy, sys
D_ = 'build/setup-to-doc-2026-10-09/five-suites'
cases = json.load(open(f'{D_}/eligible.json'))
D = {}
for f in sorted(glob.glob(f'{D_}/split_parts/part*.py')):
    D.update(runpy.run_path(f)['D'])
def strip(s): return s[2:] if s.startswith('↳ ') else s
out = []; errs = []
for c in cases:
    it = c['items']; e = D.get(c['id'])
    if e is None:
        errs.append(f"missing decision {c['id']}"); continue
    pre, setup, note = e
    if pre is None:
        out.append({'id': c['id'], 'change': False, 'preconditions': [], 'setup': [], 'note': note}); continue
    P = [strip(it[p]) if isinstance(p, int) else p for p in pre]
    S = []
    for s in setup:
        if isinstance(s, int): S.append(strip(it[s]))
        elif isinstance(s, tuple):
            j, a, b = s; t = it[j]; i0 = t.index(a)
            i1 = len(t) if b is None else t.index(b, i0) + len(b)
            S.append(t[i0:i1])
        else:
            if not any(s in x for x in it): errs.append(f"{c['id']}: literal not substring: {s[:60]}")
            S.append(s)
    out.append({'id': c['id'], 'change': True, 'preconditions': P, 'setup': S, 'note': note})
for e in errs: print('ERR', e)
if not errs:
    json.dump(out, open(f'{D_}/split.json', 'w'), indent=1, ensure_ascii=False)
    print('written', len(out))
