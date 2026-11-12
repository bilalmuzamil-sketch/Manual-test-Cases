"""Which design-case drafts quote a PRD sentence that changed between Final v1.0 and v1.1 (12 Nov 2026)?
Runs the same quote rule as make_case_plan.py (whole requirement, or whole sentence from its opening words) against both saved PRDs.
python3 -I tools/v11_quote_check.py  -> v2-1794507512/v11-quote-check.json"""
import os, sys, json, types
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE); sys.path.insert(0, HERE)
SRC = open(os.path.join(HERE, 'prd.py'), encoding='utf-8').read().replace("if __name__ == '__main__':", "if False:")
def load(fname):
    m = types.ModuleType('prd_' + fname); m.__file__ = os.path.join(HERE, 'prd.py')
    exec(SRC.replace("'CONFLUENCE-942243841-read-2026-11-12.md'", repr(fname)), m.__dict__); return m
V10 = load('CONFLUENCE-942243841-read-2026-11-12.md'); V11 = load('CONFLUENCE-942243841-v1.1-read-2026-11-12.md')

def sentence(text, start):   # copied from make_case_plan.py (importing it would rewrite the plan)
    i = text.find(start)
    if i < 0: return None
    inq = False; j = i
    while j < len(text):
        c = text[j]
        if c == '"': inq = not inq
        if c == '.' and not inq and (j + 1 == len(text) or text[j + 1] == ' '): return text[i:j + 1]
        if c == '"' and not inq and j > 0 and text[j - 1] == '.' and (j + 1 == len(text) or (text[j + 1] == ' ' and j + 2 < len(text) and text[j + 2].isupper())):
            return text[i:j + 1]
        j += 1
    return text[i:]
def q(P, spec):
    if isinstance(spec, tuple):
        code, start = spec
        return sentence(P.PIECES.get(code, ''), start) if code in P.PIECES else None
    return P.PIECES.get(spec, '').strip() if spec in P.PIECES else None
from cases_data import CASES
out = {'changed': {}, 'missing_in_v11': {}, 'section8_rows': {}}
for c in CASES:
    for spec in c.get('quotes', []):
        a, b = q(V10, spec), q(V11, spec)
        key = spec if isinstance(spec, str) else spec[0] + ' "' + spec[1] + '"'
        if b is None: out['missing_in_v11'].setdefault(c['id'], []).append(key)
        elif a != b: out['changed'].setdefault(c['id'], []).append(key)
s8a = {k: v for k, v in V10.PIECES.items() if k.startswith('§8')}; s8b = {k: v for k, v in V11.PIECES.items() if k.startswith('§8')}
out['section8_rows'] = {'v1.0': len(s8a), 'v1.1': len(s8b), 'renumbered_or_changed': [k for k in s8a if s8a[k] != s8b.get(k)], 'new': [k for k in s8b if k not in s8a]}
out['changed_codes'] = sorted(k for k in set(V10.PIECES) | set(V11.PIECES) if V10.PIECES.get(k) != V11.PIECES.get(k))
json.dump(out, open(os.path.join(ROOT, 'v2-1794507512', 'v11-quote-check.json'), 'w'), indent=1, ensure_ascii=False)
print(json.dumps(out, indent=1, ensure_ascii=False))
