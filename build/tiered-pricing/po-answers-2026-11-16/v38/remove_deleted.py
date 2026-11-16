"""Rule 130 (QA lead 16 Nov 2026, "Named set, write it (Recommended)"): the 25 held design-version cases the PO ruled out are removed from the
library. Each C(...) definition is cut from its file (ast positions) and kept word for word in po-answers-2026-11-16/v38/deleted-library-cases.py
with the question and the ruling. Idempotent: a key already gone is reported, not an error. Run from build/tiered-pricing."""
import ast, json, os
I = json.load(open('po-answers-2026-11-16/IMPACT-CASES.json'))
A = {a['number']: a for a in json.load(open('questions-2026-11-14/ANSWERS-2026-11-16.json'))['answers']}
DEL = {c['key']: c for c in I['cases'] if c['verdict'] == 'DELETE'}
assert len(DEL) == 25
OUT = 'po-answers-2026-11-16/v38/deleted-library-cases.py'
rec = open(OUT).read() if os.path.exists(OUT) else ('"""The 25 held design-version cases deleted on 16 Nov 2026 (Rule 130; QA lead: "Named set, write it (Recommended)").\n'
    'Word-for-word library source as it stood before deletion, each with the PO question, Matt Barge\'s chosen option and why the case went.\n'
    'Not imported by build.py (record only). TestRail before-copies: po-answers-2026-11-16/write/deleted/C<id>-before.json."""\n')
done = []
for f in sorted(os.listdir('authoring')):
    if not (f.startswith('cases_') and f.endswith('.py')): continue
    p = f'authoring/{f}'; src = open(p).read(); lines = src.split('\n')
    cut = []
    for node in ast.parse(src).body:
        if isinstance(node, ast.Expr) and isinstance(node.value, ast.Call) and getattr(node.value.func, 'id', '') == 'C':
            a0 = node.value.args[0]
            if isinstance(a0, ast.Constant) and a0.value in DEL: cut.append((node.lineno, node.end_lineno, a0.value))
    for lo, hi, k in sorted(cut, reverse=True):
        c = DEL[k]; a = A[c['question']]
        body = '\n'.join(lines[lo - 1:hi])
        rec += (f"\n# ---- {k} = C{c['case_id']} ({c['link']}) — from authoring/{f}\n# question {c['question']}: chosen ({a['chosen']}). {c['what_changes']}\n"
                f"# Matt Barge's answer (word for word): {a['answer_verbatim']}\n" + '\n'.join('# ' + x for x in body.split('\n')) + '\n')
        end = hi
        if end < len(lines) and lines[end].strip() == '': end += 1          # the blank line after the call
        del lines[lo - 1:end]; done.append(k)
    if cut: open(p, 'w').write('\n'.join(lines))
open(OUT, 'w').write(rec)
print('removed', len(done), sorted(done)); print('not found (already removed?)', sorted(set(DEL) - set(done)))
