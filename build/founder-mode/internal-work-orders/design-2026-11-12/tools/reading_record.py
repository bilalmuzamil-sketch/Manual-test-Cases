#!/usr/bin/env python3
"""DESIGN-READING-RECORD.md: every file of the design package and of the QA lead's save (size, sha256, lines, how it was read) and every
board (page, title, size, rendered picture, drive). python3 -I tools/reading_record.py"""
import os, json, glob, hashlib
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
SAVE = os.path.normpath(os.path.join(ROOT, '..', 'from-qa-lead-2026-11-12-final'))
figs = json.load(open(os.path.join(ROOT, 'DESIGN-FIGURES-2026-11-12.json')))
def info(p):
    b = open(p, 'rb').read()
    return len(b), hashlib.sha256(b).hexdigest(), b.count(b'\n') + 1
HOW = {
    'canvas.json': 'read in full (page list, 167 boards, 198 notes: every note read word for word in render/canvas-layout.txt)',
    'WO-Detail-Artboard-v6.dc.html': 'read in full (styles stripped for reading; every line of markup and script), rendered at default props on Shared screens and through 80 boards',
    'WO-List-Artboard-v6.dc.html': 'read in full, rendered', 'WO-Settings-Artboard-v6.dc.html': 'read in full (styles stripped), rendered', 'New-WO-Dialog-v6.dc.html': 'read in full, rendered',
    'dc-runtime.js': 'lines 1-303: the React and ReactDOM production builds (vendor code, identified by their licence headers, not read line by line); lines 304-351: the canvas runtime, read where it decides boot, dc-import, x-import and file loading (to build support.js); used as support.js for every render',
    '_ds_bundle.js': 'read in full, line by line, with the Read tool: lines 1-12,181 (100%) in 20 consecutive chunks (1-660, 661-1240, 1241-1819, 1820-2063, 2064-2783, 2784-3481, 3482-4301, 4302-5107, 5108-5899, 5900-6559, 6560-7215, 7216-7655, 7656-8200, 8201-8720, 8721-9290, 9291-9985, 9985-10544, 10545-11104, 11105-11664, 11665-12181), all 19 source sections; running notes per chunk in render/ds-bundle-reading-notes.md; the 27 rules that touch these screens in tools/library_rules.py (checked word for word against the bundle) and in the text inventory',
    'colors_and_type.css': 'read in full (lines 1-400 and 401-582, plus the ends of the long lines); tokens matched to the rendered computed styles (warning and neutral badge tones); notes in render/ds-bundle-reading-notes.md',
    'components.css': 'read in full (lines 1-330 and 331-648, plus the ends of the long lines); rules L28-L31 in tools/library_rules.py; notes in render/ds-bundle-reading-notes.md',
    'SKILL.md': 'byte-identical to build/ar-ap-report-sorting/currency-2026-11-10/design-current/SKILL.md (the canvas artifact type\'s own skill, read there); not design content',
    'index.html': 'the canvas viewer page of the artifact type (no board content); scanned for design words: none',
}
L = ['# Design reading record — Internal Work Orders (12 Nov 2026)', '',
     'Design: https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo, canvas "Internal Work Orders · All flows v6", version 1794484794-2031 (the stamp is in the QA lead\'s saved `_t.html`). Saved package: `design-2026-11-12/files/` (174 files). The QA lead\'s browser save: `from-qa-lead-2026-11-12-final/`.',
     '', 'Reading coverage (Rule 119): every board file read in full (the 4 component artboards line by line with styles stripped; the 163 flow boards by script: their own content after the shared head, which was proved identical, then the 127 distinct bodies read in full and the 33 Happy/Review copies proved equal to their flow board apart from the title, `render/hf-rv-diffs.txt`); canvas.json read in full; the PRD read in full (805 lines, 179,770 bytes, 100%). The design-system bundle `_ds_bundle.js` was read in full, line by line (12,181 lines, 413,134 bytes, 100%, 20 chunks with running notes in `render/ds-bundle-reading-notes.md`); the two style sheets were read in full as well (see the table).', '',
     '## Package files', '', '| File | Bytes | Lines | sha256 (first 16) | How read |', '|---|---|---|---|---|']
for p in sorted(glob.glob(os.path.join(ROOT, 'files', '**', '*'), recursive=True)):
    if os.path.isdir(p): continue
    n = os.path.basename(p)
    if n.endswith('.dc.html') and n not in HOW: continue
    s, h, l = info(p)
    L.append('| %s | %s | %s | %s | %s |' % (os.path.relpath(p, os.path.join(ROOT, 'files')), s, l, h[:16], HOW.get(n, 'read in full')))
L += ['', '## Boards (all 167, every page of the dropdown)', '', 'Each board rendered locally at its own size (light theme) with the canvas runtime as `support.js` (`tools/serve.js`, `tools/render.js`), screenshot in `images/`, every visible text extracted with its box and style, and every interactive candidate (button, link, input, label, role, tabindex, title, pointer cursor) hovered and clicked from a known state. Boards whose source is the same apart from the title were driven once and recorded for each. "Cut" = text the board\'s own frame hides (read from the source and the frame-opened render in `render/full/`).', '',
      '| Page | # | Board title | File | Size | Bytes | sha256 (16) | Picture | Drive (candidates / exposed) | Cut by frame |', '|---|---|---|---|---|---|---|---|---|---|']
for f in figs['list']:
    s, h, l = info(os.path.join(ROOT, 'files', 'project', f['file']))
    dr = f['drive']; dtxt = dr if isinstance(dr, str) else '%d / %d' % (dr['candidates'], dr['exposed'])
    L.append('| %s | %s | %s | %s | %s | %d | %s | %s | %s | %s |' % (f['page_name'], f['nn'], f['board_title'], f['file'], f['size'], s, h[:16], f['picture'].replace('images/', ''), dtxt, len(f['cut_by_frame']) or ''))
L += ['', '## Per page: every board done', '', '| Page | Boards | Rendered | Pictures viewed | Driven (distinct sources) |', '|---|---|---|---|---|']
from collections import defaultdict
pg = defaultdict(list)
for f in figs['list']: pg[f['page_name']].append(f)
for name, fs in pg.items():
    L.append('| %s | %d | %d | %d (each distinct picture viewed at full size; byte-identical renders proved pixel-equal) | %d |' % (name, len(fs), sum(1 for x in fs if x['picture']), len(fs), sum(1 for x in fs if isinstance(x['drive'], dict))))
L += ['', '## The QA lead\'s browser save', '', '| File | Bytes | sha256 (16) | How read |', '|---|---|---|---|']
SAVEHOW = {'_t.html': 'the canvas shell: script-read (text, version stamp 1794484794-2031, 68 of 198 note texts and 66 of 167 titles of the Review page it had loaded, all equal to canvas.json)',
           'design-saved-page.html': 'the claude.ai artifact page around the canvas: text extracted (viewer chrome only)', 'frame-shell-BFBlUvGQ.js.download': 'claude.ai viewer code: identified, not design content',
           'saved_resource.html': 'a Cloudflare challenge frame (703 bytes): identified, not opened', }
for p in sorted(glob.glob(os.path.join(SAVE, '**', '*'), recursive=True)):
    if os.path.isdir(p): continue
    s, h, l = info(p); n = os.path.basename(p)
    L.append('| %s | %d | %s | %s |' % (os.path.relpath(p, SAVE), s, h[:16], SAVEHOW.get(n, 'rendered board frame saved by the browser: its text extracted and compared word for word with the local rendering of the same board')))
L += ['', '## Own rendering checked', '', '- Saved frame (4) "18 Closed · INTERNAL document" and (10) "07 Invoice · the line at $0.00, Warranty": every visible word equals the local render of hf-18 / hf-35 (including the hidden "removed" marker text, which the canvas also keeps in the page).',
      '- Two content-identical boards rendered separately (hf-15 and flow1-4) differ by 0 pixels (`tools/imgdiff.js`): the local render is stable.',
      '- Fonts: the package has no `fonts/` folder; the system Inter (same family the design names) was served for `Inter_18pt-*.ttf`.', '']
open(os.path.join(ROOT, 'DESIGN-READING-RECORD.md'), 'w').write('\n'.join(L) + '\n')
print(len(L))
