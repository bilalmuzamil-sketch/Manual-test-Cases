"""Assemble TECH-PLAN-TESTABLE.json from the running candidate files (cand/*.tsv).
Every quote is checked to be a verbatim substring of the cited plan line; a miss stops the build."""
import glob, json, re, sys, hashlib
PLAN = '../sources/TECH-PLAN-Internal-Work-Orders-upload-2026-11-12.md'
lines = open(PLAN, encoding='utf-8').read().split('\n')
rows, problems = [], []
for f in sorted(glob.glob('cand/c*.tsv')):
    for n, raw in enumerate(open(f, encoding='utf-8').read().split('\n'), 1):
        if not raw.strip(): continue
        parts = raw.split('\t')
        if len(parts) < 4:
            problems.append(f'{f}:{n} too few fields'); continue
        ln, verdict, prd, quote = parts[0], parts[1], parts[2], parts[3]
        note = parts[4] if len(parts) > 4 else ''
        ln = int(ln)
        text = lines[ln - 1]
        if quote not in text:
            problems.append(f'{f}:{n} line {ln}: quote not verbatim: {quote[:90]}')
        rows.append(dict(src=f'{f}:{n}', line=ln, raw_verdict=verdict, prd=prd, quote=quote, note=note))
if problems:
    print('\n'.join(problems)); sys.exit(1)
print('rows', len(rows), 'all quotes verbatim')
json.dump(rows, open('tools/_rows.json', 'w'), ensure_ascii=False, indent=0)
