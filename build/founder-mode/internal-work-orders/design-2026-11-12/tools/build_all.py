#!/usr/bin/env python3
"""Internal Work Orders design drive (12 Nov 2026): reading record, figures list, text inventory (rendered boards, attributes, board titles,
page names, 198 canvas notes, source-only strings), PRD -> design table and the divergence register. Run from design-2026-11-12:
  python3 -I tools/build_all.py
Exits 1 while any inventory row is unclassified or any register quote is not found in its source."""
import os, sys, json, re, glob, hashlib, html
from collections import Counter, defaultdict
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE); sys.path.insert(0, HERE)
import prd as P, classify as C, register_data as RD, spec_verdicts as SV, library_rules as LR
PROJ = os.path.join(ROOT, 'files', 'project')
canvas = json.load(open(os.path.join(PROJ, 'canvas.json')))
PAGES = {p['id']: p['name'] for p in canvas['pages']}
B = {}
for f in sorted(glob.glob(os.path.join(ROOT, 'render', 'render-log-*.json'))): B.update(json.load(open(f))['boards'])
FULL = json.load(open(os.path.join(ROOT, 'render', 'full-and-widths.json')))
sha = lambda p: hashlib.sha256(open(p, 'rb').read()).hexdigest()
problems = []

# ------------------------------------------------------------------------------------------------ figures (one row per board)
order = sorted(B.items(), key=lambda kv: (list(PAGES).index(kv[1]['page']), kv[1]['nn']))
figs = []
for f, v in order:
    dr = v['drive']
    figs.append(dict(page=v['page'], page_name=PAGES[v['page']], nn=v['nn'], board_title=v['title'], file=f, size='%dx%d' % (v['w'], v['h']),
                     source_sha256=v['sha256'], picture=v['image'], picture_sha256=v['imageSha'], rendered='rendered locally (light theme, own size)',
                     visible_texts=len(v['rows']), runtime_errors=v['errors'], console=v['console'],
                     drive=('same source as %s (driven there)' % dr['sameAs']) if dr.get('sameAs') else dict(candidates=dr['candidates'], hovered=dr['hovered'], clicked=dr['clicked'], exposed=dr['exposed']),
                     cut_by_frame=[o['text'] for o in v['outside']][:12], frame_opened=FULL.get(f, {}).get('full', ''),
                     widths={W: dict(picture=x['picture'], overlaps=x['overlaps'], clipped=x['clipped']) for W, x in FULL.get(f, {}).get('widths', {}).items()},
                     interactive_flag=v['interactiveFlag']))
json.dump(dict(design='Internal Work Orders · All flows v6, https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo, version 1794484794-2031', made='12 Nov 2026',
               pages=len(PAGES), boards=len(figs), boards_rendered=sum(1 for x in figs if x['picture']), distinct_sources=len({x['source_sha256'] for x in figs}),
               driven_once=sum(1 for x in figs if isinstance(x['drive'], dict)), list=figs),
          open(os.path.join(ROOT, 'DESIGN-FIGURES-2026-11-12.json'), 'w'), indent=1, ensure_ascii=False)

# ------------------------------------------------------------------------------------------------------------ text inventory
rows = []
def add(src, page, board, kind, text, res, extra=None):
    r = dict(src=src, page=page, board=board, kind=kind, text=text)
    if res is None: r.update(cls='UNCLASSIFIED', codes=[], note='')
    else: r.update(cls=res[0], codes=res[1], note=res[2])
    if extra: r.update(extra)
    rows.append(r)

for f, v in order:
    for t in v['rows']:
        res = C.classify_text(t['text'])
        add('board', v['page'], f, 'visible text' + (' (cut by the frame)' if any(o['text'] == t['text'] for o in v['outside']) else ''), t['text'], res,
            dict(look=dict(size=t['size'], weight=t['weight'], color=t['color'], comp=t['comp'])))
    for a in v['attrs']:
        if not a['visible'] and a['attr'] != 'value': continue
        add('board', v['page'], f, 'attribute ' + a['attr'], a['text'], C.classify_text(a['text'], '@' + a['attr']))
    tt = v['title']
    add('board title', v['page'], f, 'board title', tt, ('SPEC-CONFLICT', [C.TITLE_CONFLICT[tt]], 'title does not match what the board draws') if tt in C.TITLE_CONFLICT
        else ('LOOK-ONLY', [], 'board name on the canvas'))
for pid, name in PAGES.items():
    add('page name', pid, '', 'dropdown page name', name, ('SPEC-CONFLICT', [C.PAGE_CONFLICT[name]], 'stale page name') if name in C.PAGE_CONFLICT else ('LOOK-ONLY', [], 'page of the dropdown'))
first = {}
for k in canvas['noteOrder']:
    first.setdefault(canvas['notes'][k]['text'], k)
for k in canvas['noteOrder']:
    n = canvas['notes'][k]; rep = first[n['text']]
    res = C.NOTE_CLASS.get(rep)
    add('canvas note', n['page'], '', 'note' + ('/' + n['kind'] if n.get('kind') else '') + ' ' + k + ('' if rep == k else ' (same text as %s)' % rep), n['text'], res)

# design-library rules (full read of _ds_bundle.js, render/ds-bundle-reading-notes.md; Rule 126)
for lid, lf, lines, words, lcls, lcodes, meaning in LR.LIB:
    add('design library', '', lf, 'library rule %s (bundle lines %s)' % (lid, lines), words, (lcls, lcodes, meaning))
if LR.check(): problems.append('library sentences not found in the bundle: %s' % LR.check())

# source-only strings: words in the board files that no board draws
rendered = set(r['text'] for r in rows if r['src'] == 'board')
blob = '\n'.join(rendered)
src_rows = 0
for f in sorted(glob.glob(os.path.join(PROJ, '*.dc.html'))):
    s = open(f, encoding='utf-8').read(); name = os.path.basename(f)
    body = re.sub(r'<style[\s\S]*?</style>|<title>[\s\S]*?</title>', '', s)
    cand = set()
    for m in re.finditer(r'>([^<>{}]+)<', body):
        t = html.unescape(m.group(1)).strip()
        if re.search(r'[A-Za-z]{2}', t) and 'class Component' not in t: cand.add(t)
    for m in re.finditer(r'\b(?:label|value|title|aria-label|change-cust-tip|nc-tip|internal-category|nc-reason|asset)="([^"{]+)"', body):
        cand.add(html.unescape(m.group(1)).strip())
    js = body[body.find('<script type="text/x-dc"'):] if '<script type="text/x-dc"' in body else ''
    for m in re.finditer(r"'((?:[^'\\\n]|\\.)*)'|\"((?:[^\"\\\n]|\\.)*)\"|`([^`]*)`", js):  # every string token in turn, so no text between two strings is taken
        t = m.group(1) if m.group(1) is not None else (m.group(2) if m.group(2) is not None else m.group(3)); t = t.replace("\\'", "'")
        if len(t) < 4: continue
        if ' ' in t and re.search(r'[A-Za-z]{3}', t) and not re.search(r'[{}$;=]|var\(|px|\.dc|=>', t): cand.add(t)
    for t in sorted(cand):
        if len(t) < 3 or t in rendered or t in blob or t.startswith('#') or re.fullmatch(r'[\w-]+', t) and not re.search(r'[A-Z]', t): continue
        res = C.classify_text(t)
        if res is None or res[0] in ('PRD-MATCH', 'LOOK-ONLY', 'OUT-OF-SCOPE'):
            res = ('OUT-OF-SCOPE', res[1] if res else [], 'in the board source only: a prop value or switched-off variant that no board of the canvas draws' + (' (would be ' + res[0] + ')' if res else ''))
        add('source only', '', name, 'source string', t, res); src_rows += 1

cnt = Counter(r['cls'] for r in rows); unc = [r for r in rows if r['cls'] == 'UNCLASSIFIED']
if unc: problems.append('%d unclassified inventory rows' % len(unc))
# letter case of PRD-MATCH labels (L-04)
case_flags = sorted({r['text'] for r in rows if r['cls'] == 'PRD-MATCH' and len(r['text']) < 60 and r['text'] not in P.TEXT and r['text'].lower() in P.TEXT.lower()})
by_src = Counter(r['src'] for r in rows)
summ = dict(made='12 Nov 2026', rows=len(rows), by_source=dict(by_src), by_class=dict(cnt), unclassified=len(unc),
            distinct_texts=len({r['text'] for r in rows}), letter_case_flags=case_flags, notes=sum(1 for r in rows if r['src'] == 'canvas note'))
json.dump(dict(summary=summ, rows=rows), open(os.path.join(ROOT, 'DESIGN-TEXT-INVENTORY.json'), 'w'), indent=0, ensure_ascii=False)
md = ['# Design text inventory — Internal Work Orders (12 Nov 2026)', '',
      'Every visible text of every rendered board (all 167 boards of the 10 pages of the dropdown), the visible attribute texts, the 167 board titles, the 10 page names, all 198 canvas notes, and every word in the board files that no board draws (source only). Built by `tools/build_all.py` with the rules in `tools/classify.py`; every row with its board, look (size, weight, colour, component) and codes in `DESIGN-TEXT-INVENTORY.json`. Classes: DATA · PRD-MATCH (PRD code, exact letter case) · OUT-OF-SCOPE (reason) · SPEC-CONFLICT (register id in `../DESIGN-DIVERGENCE-REGISTER.json`) · LOOK-ONLY (design words where the PRD is silent and nothing conflicts).', '',
      '## Counts', '', '| | rows |', '|---|---|'] + ['| %s | %d |' % (k, v) for k, v in sorted(by_src.items())] + ['| **all rows** | **%d** |' % len(rows), ''] + \
     ['| class | rows |', '|---|---|'] + ['| %s | %d |' % (k, v) for k, v in sorted(cnt.items())] + ['| **Unclassified** | **%d** |' % len(unc), '',
      'Letter case: PRD-MATCH labels found in the PRD only in other letter case: %s.' % (', '.join(case_flags) if case_flags else 'none (the one case difference, "to no charge?", is IWO-D25)'), '',
      '## Distinct texts on the boards, by class (pages and boards where each shows)', '', '| Text | Class | Codes / register | Boards | Note |', '|---|---|---|---|---|']
agg = defaultdict(set); meta = {}
for r in rows:
    if r['src'] != 'board': continue
    agg[r['text']].add(r['board'].replace('.dc.html', '')); meta[r['text']] = r
for t in sorted(agg, key=lambda x: (meta[x]['cls'], x)):
    r = meta[t]; bs = sorted(agg[t])
    md.append('| %s | %s | %s | %s | %s |' % (t.replace('|', '/'), r['cls'], ', '.join(r['codes']), (', '.join(bs[:6]) + (' +%d' % (len(bs) - 6) if len(bs) > 6 else '')), r['note'].replace('|', '/')))
md += ['', '## Canvas notes (all 198)', '', '| Note | Page | Text | Class | Codes / register | Note |', '|---|---|---|---|---|---|']
for r in rows:
    if r['src'] == 'canvas note':
        md.append('| %s | %s | %s | %s | %s | %s |' % (r['kind'][5:], r['page'], r['text'].replace('\n', ' ').replace('|', '/'), r['cls'], ', '.join(r['codes']), r['note'].replace('|', '/')))
md += ['', '## Board titles and page names', '', '| Page | Board | Title | Class | Register |', '|---|---|---|---|---|']
for r in rows:
    if r['src'] in ('board title', 'page name'):
        md.append('| %s | %s | %s | %s | %s |' % (r['page'], r['board'], r['text'], r['cls'], ', '.join(r['codes'])))
md += ['', '## Source-only strings (in the board files, drawn by no board)', '', '| File | Text | Class | Note |', '|---|---|---|---|']
for r in rows:
    if r['src'] == 'source only':
        md.append('| %s | %s | %s | %s |' % (r['board'], r['text'].replace('|', '/').replace('\n', ' ')[:300], r['cls'] + (' ' + ','.join(r['codes']) if r['codes'] else ''), r['note']))
md += ['', '## Design-library rules that apply to these screens (full read of `_ds_bundle.js`, lines 1-12,181; notes in `render/ds-bundle-reading-notes.md`)', '',
       '| Id | File (bundle lines) | The library\'s words | Class | Case / register | Meaning here |', '|---|---|---|---|---|---|']
md += ['| %s | %s (%s) | %s | %s | %s | %s |' % (l[0], l[1], l[2], l[3].replace('|', '/'), l[4], ', '.join(l[5]), l[6]) for l in LR.LIB]
open(os.path.join(ROOT, 'DESIGN-TEXT-INVENTORY.md'), 'w').write('\n'.join(md) + '\n')

# ------------------------------------------------------------------------------------------------- register (with checks)
alltext = html.unescape(blob + '\n' + '\n'.join(n['text'] for n in canvas['notes'].values()) + '\n' + '\n'.join(open(f, encoding='utf-8').read() for f in glob.glob(os.path.join(PROJ, '*.dc.html'))))
def in_prd(q):
    q = P._clean(q)
    return q in P.TEXT
for x in RD.D:
    x['prd_words_found'] = [in_prd(q) for q in x['prd_words']] if x['prd_words'] != ['see those rows'] else []
    if not all(x['prd_words_found']): problems.append('%s: PRD words not found word for word: %s' % (x['id'], [q for q, ok in zip(x['prd_words'], x['prd_words_found']) if not ok]))
    x['design_words_checked'] = [(w in alltext) for w in x['design_words']]
    for p in x['pictures']:
        if not os.path.exists(os.path.join(ROOT, p)): problems.append('%s: picture missing %s' % (x['id'], p))
open_q = [x for x in RD.D if x['outcome'].startswith('QUESTION')]
reg = dict(project='Internal Work Orders (Founder Mode), epic SV-11665', design='https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo, canvas "Internal Work Orders · All flows v6", version 1794484794-2031',
           prd='Confluence 942243841, Final v1.0 (2026-11-09, Milos Vasic, last modified 10 Nov 2026), saved build/founder-mode/internal-work-orders/sources/CONFLUENCE-942243841-read-2026-11-12.md',
           prd_header_rule='The PRD header (Design row) says: "Where a frame and this text disagree, the text wins". Differences the PRD words settle are closed by that sentence plus the named requirement; the rest go to Milos Vasic as questions.',
           made='12 Nov 2026, design drive build/founder-mode/internal-work-orders/design-2026-11-12/',
           how='Rule 130: both directions (DESIGN-TEXT-INVENTORY design -> PRD; SPEC-TO-DESIGN-2026-11-12.json PRD -> design; every dialog, menu, toast and tooltip listed by hand in DESIGN-VISUAL-INVENTORY.md)',
           counts=dict(differences=len(RD.D), settled_by_prd=sum(1 for x in RD.D if x['outcome'].startswith('SETTLED')), questions=len(open_q), not_shown=len(RD.NOT_SHOWN)),
           unsent_questions=len(RD.QUESTIONS), unsent_note='%d new questions (rows 8-13) are drafted in design-2026-11-12/NEW-QUESTIONS.py and NOT sent; one more difference (IWO-D19) rides on question 3 and the held DC-50 on question 4 of the existing draft ../PO-QUESTIONS-DRAFT.md, also not sent (the QA lead sends the one sheet). Rule 126.6: unsent must reach 0 before the suite is called complete.' % len(RD.QUESTIONS),
           question_sheet='none yet for Internal Work Orders (checked 12 Nov 2026); these rows and the PRD case worker\'s questions go into one sheet (Rule 131)',
           differences=RD.D, questions=RD.QUESTIONS, existing_sheet_questions=RD.SHEET_QUESTIONS,
           not_shown=[dict(id='IWO-N%02d' % (i + 1), prd_code=c, prd_words_or_state=w, outcome='DESIGN-SILENT: nothing drawn, so no held case (Rule 130.5); the PRD-following case is the only case', checked='12 Nov 2026, all 167 boards') for i, (c, w) in enumerate(RD.NOT_SHOWN)])
# keys for build/testing-tools/spec_to_design_check.py ("<code>|<words>"): filled after its first run below
json.dump(reg, open(os.path.join(ROOT, '..', 'DESIGN-DIVERGENCE-REGISTER.json'), 'w'), indent=1, ensure_ascii=False)

# ------------------------------------------------------------------------------------------------------ PRD -> design table
sp = []
for code, txt in P.PIECES.items():
    if not re.match(r'S\d+-[RNE]\d+', code): continue
    v = SV.V.get(code)
    if not v: problems.append('no PRD->design verdict for ' + code); continue
    sp.append(dict(code=code, prd=txt[:400], verdict=v[0], register=v[1], design=v[2]))
for i in range(1, 43):
    v = SV.S8[i]; sp.append(dict(code='§8-%02d' % i, prd=P.PIECES['§8-%02d' % i][:400], verdict=v[0], register=v[1] if v[1].startswith('IWO') else '', design=v[1]))
vc = Counter(r['verdict'] for r in sp)
json.dump(dict(made='12 Nov 2026', prd='Final v1.0', rows=len(sp), by_verdict=dict(vc), table=sp), open(os.path.join(ROOT, 'SPEC-TO-DESIGN-2026-11-12.json'), 'w'), indent=1, ensure_ascii=False)

# words file for spec_to_design_check.py (rendered words + notes + titles)
open(os.path.join(ROOT, 'render', 'design-words-for-check.html'), 'w').write(html.escape(alltext))
print(json.dumps(dict(figures=len(figs), inventory=summ, spec=dict(vc), register=reg['counts'], problems=problems), indent=1, ensure_ascii=False)[:4000])
sys.exit(1 if problems else 0)
