#!/usr/bin/env python3
"""Writes DESIGN-CASE-PLAN.md (Internal Work Orders design cases, drafts for the case worker) from tools/cases_data.py.
Every PRD quote is copied verbatim from the saved PRD by code (a whole requirement, or the whole sentence that starts with the given words);
every design quote is checked word for word against the rendered board texts and the board source; pictures and page names come from the
figures list; titles, one-action steps and the step/result pairing are checked. Run: python3 -I tools/make_case_plan.py (exit 1 on any error)."""
import os, sys, json, re, glob, html
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE); sys.path.insert(0, HERE)
import prd as P
from cases_data import CASES
FIGS = json.load(open(os.path.join(ROOT, 'DESIGN-FIGURES-2026-11-12.json')))['list']
BYFILE = {f['file'].replace('.dc.html', ''): f for f in FIGS}
BYPN = {(f['page'], f['nn']): f for f in FIGS}
TXT = {}
for p in glob.glob(os.path.join(ROOT, 'render', 'render-log-[0-9].json')):
    for b in json.load(open(p))['boards'].values():
        f = BYPN.get((b['page'], b['nn']))
        if f: TXT[f['file'].replace('.dc.html', '')] = ' '.join(r['text'] for r in b['rows']) + ' ' + ' '.join(a['text'] for a in b['attrs'])
def src_text(name):
    s = open(os.path.join(ROOT, 'files', 'project', name + '.dc.html'), encoding='utf-8').read()
    return html.unescape(s)
norm = lambda s: re.sub(r'\s+', ' ', s).strip()
STORY = {1: 'SV-11758', 2: 'SV-11759', 3: 'SV-11760', 4: 'SV-11761', 5: 'SV-11762', 6: 'SV-11763', 7: 'SV-11764', 8: 'SV-11765',
         9: 'SV-11766', 10: 'SV-11767', 11: 'SV-11833', 12: 'SV-12226', 13: 'SV-12295'}
FROM = ('From: PRD "Internal Work Orders (PRD)", Confluence 942243841, Final v1.0 (2026-11-09, Milos Vasic, last modified 10 Nov 2026), '
        'read 12 Nov 2026 · Epic SV-11665, {stories}')
DESIGN = ('Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794484794-2031, '
          'read and rendered 12 Nov 2026')
HOLD = 'AUTOMATION: HOLD - the design differs from the PRD, waiting on the PO'
errs = []

def sentence(text, start):
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

def q(spec):
    if isinstance(spec, tuple):
        code, start = spec
        if code not in P.PIECES: errs.append('no PRD code ' + code); return ''
        s = sentence(P.PIECES[code], start)
        if not s: errs.append('sentence not found in %s: %s' % (code, start)); return ''
        assert s in P.TEXT or s in P.PIECES[code]
        return '- %s: “%s”' % (code, s.strip())
    if spec not in P.PIECES: errs.append('no PRD code ' + spec); return ''
    t = P.PIECES[spec].strip()
    if spec.startswith('§8'):
        cells = [c.strip() for c in t.strip('|').split('|')]
        return '- §8 User Feedback row (%s): “%s” — %s' % (cells[0], cells[1].strip('"'), cells[2] if len(cells) > 2 else '')
    return '- %s: “%s”' % (spec, t)

out, table = [], []
for c in CASES:
    t = c['title']
    if not t.startswith('Design: ') or len(t) > 80 or ';' in t: errs.append('title rule: %s (%d)' % (t, len(t)))
    figs = []
    for b in c['boards']:
        if b not in BYFILE: errs.append('%s unknown board %s' % (c['id'], b)); continue
        figs.append(BYFILE[b])
    pics = [f['picture'].split('/')[-1] for f in figs]
    hay = norm(' '.join(TXT.get(b, '') + ' ' + src_text(b) for b in c['boards'] if b in BYFILE))
    for w in c.get('words', []):
        if norm(w) not in hay: errs.append('%s design quote not on its boards: %s' % (c['id'], w[:70]))
    for s in c['steps']:
        if re.search(r'\b(and then|, then)\b', s) or s.count(' and click') or s.count(', click'): errs.append('%s step bundles actions: %s' % (c['id'], s))
    if len(c['results']) != len(c['steps']): errs.append('%s results/steps mismatch' % c['id'])
    for p in c['pre']:
        if re.search(r'mark this test Blocked|ask your QA lead|\{', p, re.I): errs.append('%s forbidden precondition: %s' % (c['id'], p))
    held = c.get('held')
    marker = HOLD if held else c.get('hold', 'AUTOMATION: READY')
    table.append('| %s | %s | %s | %s |' % (c['id'], t, ', '.join(pics), marker))
    L = ['## %s · %s' % (c['id'], t), '', '**Title:** ' + t, '', '**Preconditions**']
    L += ['- ' + p for p in c['pre']] + ['- Open the attached picture%s %s at 100%% zoom beside the screen.' % ('s' if len(pics) > 1 else '', ', '.join(pics))]
    L += ['', '**Steps**'] + ['%d. %s' % (i, s) for i, s in enumerate(c['steps'], 1)] + ['', '**Expected Result**']
    for i, res in enumerate(c['results'], 1):
        L.append('Step %d:' % i); L += ['- ' + r for r in res]
    L += ['', 'Exact quotes from the source (for reproducibility)', FROM.format(stories=', '.join('story %s (Story %d)' % (STORY[n], n) for n in c['stories']))]
    L += [q(x) for x in c['quotes']] + ['Not yet checked against a build.', '', 'References from Design']
    pages = []
    for f in figs:
        if f['page_name'] not in pages: pages.append(f['page_name'])
    L.append('- %s: page%s %s, board%s %s.' % (DESIGN, 's' if len(pages) > 1 else '', ' / '.join('"%s"' % p for p in pages),
             's' if len(figs) > 1 else '', ', '.join('"%s" (%s)' % (f['board_title'], f['page_name']) for f in figs)))
    L.append('- Pictures to attach: %s.' % ', '.join(pics))
    if c.get('words'): L += ["- The design's own words:"] + ['  - “%s”' % w for w in c['words']]
    if c.get('diff'): L.append('- Difference: ' + c['diff'])
    if held: L.append('- Held design version (Rule 130): not run and not added to the run until the PO answers; released or removed that day.')
    L += ['', marker, '']
    out += L
dc = sum(1 for c in CASES if not c.get('held')); dv = len(CASES) - dc
ids = [c['id'] for c in CASES]
if len(set(ids)) != len(ids): errs.append('duplicate ids')
head = ['# Design-case plan — Internal Work Orders (12 Nov 2026, drafts for the case worker)', '',
 'For the TestRail section **"Design — how it looks"** under section 136701 "Internal Work order (11/12/2026)" (Rule 126). Written in the QA lead\'s pattern (Rule 117 tenth, eleventh, twelfth, fourteenth and fifteenth amendments, model C665915): title starting "Design: " (at most 80 characters, no semicolons), plain "Sign in as … / Use a … / Have a …" preconditions, numbered steps with one action each, "Step N:" results with bullets, a blank line, the exact PRD quotes under their "From:" line and the build sentence, then **References from Design** (page, board, picture, the design\'s own words, the difference with its register row), the AUTOMATION line last. No "mark this test Blocked" line. Expected behaviour and wording come from PRD Final v1.0 (its header: "Where a frame and this text disagree, the text wins"); the design gives the look where the PRD is silent (Rule 126). Generated by `tools/make_case_plan.py` from `tools/cases_data.py`: every PRD quote is copied from the saved PRD by code (whole requirement or whole sentence), every design quote is checked word for word against the rendered boards and their source, and titles, one-action steps and the step/result pairing are checked by script.', '',
 'Notes for the case worker: pictures to attach are in `design-2026-11-12/images/` (each board at its own size, light theme; the design draws no dark theme). Boards are 1280 px wide (lists 1440, phone 390): the cases run at 1440 px and add 1536 px where a line could wrap (settings hints, categories table, work orders list, report). Names and numbers in the pictures (Staging Heavy Duty Fleet, Hilltop Logistics, S2-34918, $675.00 …) are the designer\'s data, never preconditions. Each case that changes a record has its own new record in its preconditions (Rule 137). Held cases (DV-xx) wait for Milos Vasic\'s answers (NEW-QUESTIONS.py) and are not added to the run until then (Rule 130). Where the design differs from the PRD and the PRD settles it, the case follows the PRD and names the register row (`../DESIGN-DIVERGENCE-REGISTER.json`).', '',
 '**Count: %d look cases (DC, %d of them held on a sheet question) + %d held design-version cases (DV) = %d.**' % (dc, sum(1 for c in CASES if c.get('hold')), dv, len(CASES)), '', '| Id | Title | Pictures | Marker |', '|---|---|---|---|']
open(os.path.join(ROOT, 'DESIGN-CASE-PLAN.md'), 'w').write('\n'.join(head + table + [''] + out))
print('cases', len(CASES), 'DC', dc, 'DV', dv, 'errors', len(errs)); [print(' ', e) for e in errs]
sys.exit(1 if errs else 0)
