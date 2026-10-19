#!/usr/bin/env python3
import json, sys, collections
D = sys.argv[1]
R = json.load(open(f'{D}/design-text-inventory-2026-10-19.json'))
esc = lambda s: str(s).replace('|', '\\|').replace('\n', ' ')
c = collections.Counter(r['cls'] for r in R); cs = collections.Counter((r['src'][0], r['cls']) for r in R)
src = {'A': 'Canvas texts (page names, board titles, notes) from canvas.json', 'H': 'Hand-verified on-screen texts (read by eye from every board image)', 'O': 'Every distinct OCR line of the 68 board images'}
out = ['# Design text inventory — Splitting Sales Representatives (19 Oct 2026)', '',
 'Design: `sources/design-2026-10-19-upload/Splitting_Sales_Representatives.html` (Claude artifact 8MHqwyffAYtqZ6EccS5RUm). '
 'The design is IMAGE-ONLY: 68 boards, each one PNG screenshot, so the words were taken (1) from `canvas.json`, (2) by eye from every image, and (3) by OCR of every image as a completeness net. '
 'Compared against PRD Confluence 919928833 **v8** (14 Oct 2026). Built by `tools/build_text_inventory.py` from `tools/hand_transcription.json`; machine copy `design-text-inventory-2026-10-19.json`.', '',
 'Classes: **SAME** (the PRD says it; code given) · **DESIGN-ONLY** (not in the PRD, no conflict) · **SPEC-CONFLICT** (differs from the PRD; both sides in DESIGN-REVIEW) · **DATA** (names, amounts, dates, ids, record text). OCR rows that are the same words as a hand-verified row inherit its class. **Unclassified: ' + str(c.get('UNCLASSIFIED', 0)) + '.**', '',
 '## Counts', '', '| Source | SAME | DESIGN-ONLY | SPEC-CONFLICT | DATA | Total |', '|---|---|---|---|---|---|']
for s in 'AHO':
    out.append(f"| {src[s]} | {cs[(s,'SAME')]} | {cs[(s,'DESIGN-ONLY')]} | {cs[(s,'SPEC-CONFLICT')]} | {cs[(s,'DATA')]} | {sum(v for (a,b),v in cs.items() if a==s)} |")
out.append(f"| **All rows** | **{c['SAME']}** | **{c['DESIGN-ONLY']}** | **{c['SPEC-CONFLICT']}** | **{c['DATA']}** | **{len(R)}** |")
out += ['', 'OCR rows are noisy by nature (icons read as letters, clipped words); each one is still classified, and every feature-relevant word was confirmed by eye in section 2.', '']
for s in 'AHO':
    out += [f'## {"123"["AHO".index(s)]} · {src[s]}', '', '| # | Text | Where | Class | PRD | Note |', '|---|---|---|---|---|---|']
    rows = [r for r in R if r['src'][0] == s]
    if s == 'O': rows.sort(key=lambda r: (['SPEC-CONFLICT','SAME','DESIGN-ONLY','DATA'].index(r['cls']), r['text']))
    for i, r in enumerate(rows, 1):
        out.append(f"| {i} | {esc(r['text'])} | {esc(r['where'])} | {r['cls']} | {esc(r['prd'])} | {esc(r['note'])} |")
    out.append('')
open(f'{D}/design-text-inventory-2026-10-19.md', 'w').write('\n'.join(out) + '\n')
print(dict(c), len(R))
