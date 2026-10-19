#!/usr/bin/env python3
"""Text inventory for the image-only Splitting Sales Representatives design canvas (Rule 124, image-only clause).
Sources of rows: (A) canvas.json page names, artboard titles and notes; (H) the hand-verified transcription of every
feature-relevant on-screen text (read from the board images by eye); (O) every distinct OCR line of every board image
(tesseract, 2x upscale), auto-classified and mapped onto H rows where they are the same text.
Classes: SAME (the PRD says it) / DESIGN-ONLY (not in the PRD, no conflict) / SPEC-CONFLICT (differs from the PRD) / DATA.
Usage: python3 -I build_text_inventory.py <design-drive dir>"""
import sys, os, re, json, glob, difflib
D = sys.argv[1]
canvas = json.load(open(f'{D}/unpacked/files/canvas.json'))
rows = []
def add(src, text, where, cls, code, note=''):
    rows.append(dict(src=src, text=text, where=where, cls=cls, prd=code, note=note))
# ---------- (A) canvas texts
for p in canvas['pages']:
    add('A-page', p['name'], 'canvas "6 pages" menu', 'DESIGN-ONLY', '', 'page name; PRD Stories cite "page 1/2/4/5/6"; page 3 (part sale) is cited by no story')
for a in canvas['artboards']:
    add('A-title', a['title'], f"board title, page {a['page']}", 'DESIGN-ONLY', '', 'artboard caption')
H = json.load(open(f'{D}/tools/hand_transcription.json'))
for n in canvas['annotations']:
    c = H['note_classes'].get(n['id'], ['DESIGN-ONLY', '', ''])
    add('A-note', n['text'].replace('\n', ' / '), f"canvas note {n['id']}", c[0], c[1], c[2])
# ---------- (H) hand-verified on-screen texts
for h in H['rows']:
    add('H', h[0], h[1], h[2], h[3], h[4] if len(h) > 4 else '')
htexts = [r['text'] for r in rows if r['src'] == 'H']
# ---------- (O) OCR lines
ocr = {}
for f in sorted(glob.glob(f'{D}/ocr/*.txt')):
    for l in open(f):
        t = re.sub(r'\s+', ' ', l[13:].strip())
        if len(re.findall(r'[A-Za-z0-9]', t)) < 2: continue
        ocr.setdefault(t, []).append(os.path.basename(f)[:-4])
R = H['ocr_rules']
data_re = re.compile(R['data_regex'])
chrome = [c.lower() for c in R['chrome_phrases']]
names_re = re.compile('|'.join(r'(?<![A-Za-z])' + re.escape(n.strip()) + r'(?![A-Za-z])' for n in R['data_phrases']))
same_map = R['same_phrases']
unclassified = []
for t, boards in ocr.items():
    where = f"OCR · {len(boards)} board(s): {', '.join(sorted(set(boards))[:4])}{'…' if len(set(boards)) > 4 else ''}"
    tl = t.lower()
    if t in ('Stats', 'LABOR', 'PARTS', 'FINANCE', 'PERFORMANCE', 'ACCOUNTING'):
        add('O', t, where, 'DESIGN-ONLY', '', 'existing tab / Reports menu heading'); continue
    best = max(htexts, key=lambda h: difflib.SequenceMatcher(None, t, h).ratio())
    if difflib.SequenceMatcher(None, t, best).ratio() >= 0.88:
        hr = next(r for r in rows if r['src'] == 'H' and r['text'] == best)
        add('O', t, where, hr['cls'], hr['prd'], f'same text as hand-verified row "{best}"'); continue
    if '(Parts)' in t or '(Labor)' in t:
        add('O', t, where, 'SAME', 'S7-R3', 'fragment of a log entry naming both sides'); continue
    hit = next((k for k in same_map if k.lower() in tl), None)
    if hit:
        add('O', t, where, 'SAME', same_map[hit], f'contains "{hit}"'); continue
    if names_re.search(t) or data_re.search(t):
        add('O', t, where, 'DATA', '', 'record data (names, amounts, dates, ids, notes text, line content)'); continue
    if any(c in tl for c in chrome):
        add('O', t, where, 'DESIGN-ONLY', '', 'existing ShopView screen text, unchanged by this feature'); continue
    if len(re.findall(r'[A-Za-z]{3,}', t)) == 0:
        add('O', t, where, 'DATA', '', 'OCR fragment of an icon, badge or number (no word); the board was viewed by eye'); continue
    unclassified.append((t, boards))
    add('O', t, where, 'UNCLASSIFIED', '', '')
json.dump(rows, open(f'{D}/design-text-inventory-2026-10-19.json', 'w'), indent=1, ensure_ascii=False)
from collections import Counter
cnt = Counter((r['src'][0], r['cls']) for r in rows)
print('rows', len(rows)); print(sorted(cnt.items()))
print('UNCLASSIFIED', len(unclassified))
for t, b in unclassified[:400]: print('  ?', t, '|', b[0])
