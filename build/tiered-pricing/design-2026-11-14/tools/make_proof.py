#!/usr/bin/env python3
"""Build inventory/visual-inventory.json, BOARD-COVERAGE.md and the generated sections of DESIGN-DRIVE-PROOF.md from the drive data.
Numbers in the proof come only from the files written by tools/render.js, tools/panels.js, tools/stress.js and tools/analyze.py.
The generated sections (3, 6b, 6c, 9) are written to render/proof-generated.md and were spliced into DESIGN-DRIVE-PROOF.md between
the hand-written sections (reading table, method, dialog list, flows, inconsistencies, notes for the case author); on a rerun, splice again."""
import json, os, re, collections
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
J = lambda *p: os.path.join(ROOT, *p)
L = json.load(open(J('render', 'render-log-all.json')))['boards']
bl = json.load(open(J('render', 'board-list.json')))
cov = json.load(open(J('inventory', 'coverage.json')))
ti = json.load(open(J('inventory', 'text-inventory.json')))
ov = json.load(open(J('inventory', 'overlays.json')))
panels = json.load(open(J('inventory', 'panels.json')))
moves = json.load(open(J('inventory', 'movement.json')))
flows = json.load(open(J('inventory', 'flows.json')))
stress = json.load(open(J('inventory', 'stress-probe.json')))
icons = json.load(open(J('inventory', 'icons.json')))
lib = json.load(open(J('inventory', 'library-sentences.json')))
ICON_NAMES = ['wrench (ShopHub switcher)', 'chevron-down', 'search', 'bell', 'ellipsis (three-dot menu)', 'info-outline 18 px (Material, the WIP report info icon)', 'pencil',
              'loader (spinner)', 'arrow-up-down (sortable column, not sorted)', 'chevron-right', 'x', 'circle-check (success toast)', 'trash-2', 'check (checkbox tick)', 'circle-x (clear search)',
              'layers (Category chip)', 'chevron-up', 'info (circle-i)', 'triangle-alert (below-cost warning)', 'search (field variant)', 'clock', 'arrow-up (sorted ascending)', 'package (Sales Type chip)',
              'users', 'check (picked row)', 'list', 'ShopView logo', 'timer (time clock)', 'plus', 'circle-alert (typed-price marker)', 'columns-3 (Columns button)', 'calendar (Date chip)',
              'tag (Priced By chip)', 'user (Customer chip)', 'store (Location chip)', 'arrow-down (sorted descending)']
sig2name = {ic['sig']: (ICON_NAMES[i] if i < len(ICON_NAMES) else 'icon-%d' % i) for i, ic in enumerate(icons)}

# ---------------------------------------------------------------- visual inventory: one entry per screen, its states (boards) and look facts
def skey(r):
    lk = r['look']
    if lk['phone']: return 'Phone: ' + (lk['dialogs'][0]['title'] if lk['dialogs'] else r['title'])
    crumbs = ' › '.join(lk['crumbs'][0]) if lk['crumbs'] else ''
    h1 = lk['h1'][0]['text'] if lk['h1'] else ''
    if not crumbs and not h1: return 'Board: ' + r['title']
    # record names make every page of a kind look different; group by the kind of page
    crumbs = re.sub(r'(Tiers|Matrices|Categories|Customers) › .*', r'\1 › <record>', crumbs)
    return (crumbs or h1)
screens = collections.OrderedDict()
for b in bl:
    r = L[b['file']]; lk = r['look']
    k = skey(r)
    s = screens.setdefault(k, {'screen': k, 'boards': [], 'tables': {}, 'badges': set(), 'buttons': set(), 'icons': collections.Counter(), 'dialogs': set(), 'menus': set(), 'tooltips': [], 'toasts': set(),
                               'frame': None, 'h1Style': None, 'tabs': set(), 'sideActive': set(), 'inputs': set(), 'highlighted': []})
    s['boards'].append({'board': b['title'].split(' ')[0], 'title': b['title'], 'file': b['file'], 'image': r['image']})
    for t in lk['tables']:
        cols = tuple(c['label'] for c in t['cols'])
        e = s['tables'].setdefault(cols, {'columns': list(cols), 'boards': [], 'colX': [c['x'] for c in t['cols']], 'colW': [c['w'] for c in t['cols']],
                                          'header': ({k2: t['cols'][1][k2] for k2 in ('size', 'weight', 'color', 'transform', 'bg')} if len(t['cols']) > 1 else None),
                                          'cellKinds': {(c['label'] or '(col %d)' % i): c['cellKinds'] for i, c in enumerate(t['cols'])},
                                          'align': {(c['label'] or '(col %d)' % i): c['cellAlign'] for i, c in enumerate(t['cols'])}, 'rowHeights': t['rowHeights'], 'dashCells': 0, 'infoTips': {c['label']: c['info'] for c in t['cols'] if c['info']}, 'sortIcons': [c['label'] for c in t['cols'] if c['sortIcon']]})
        e['boards'].append(b['title'].split(' ')[0]); e['dashCells'] += t['dashCells']
    for x in lk['badges']: s['badges'].add((x['text'], x['cls'].replace('sv-badge', '').strip()[:40], x['bg'], x['color'], x['h']))
    for x in lk['buttons']: s['buttons'].add(((x['text'] or x['aria'])[:50], re.sub(r'\b(tpc-hl|sv-btn)\b', '', x['cls']).strip()[:40], x['disabled']))
    for i in lk['icons']: s['icons'][sig2name.get(i['sig'], '?') + ' ' + str(i['size']) + 'px @' + i['region']] += 1
    for d in lk['dialogs']: s['dialogs'].add((d['title'] or d['aria'] or d['cls'][:20], d['w']))
    for m in lk['menus']: s['menus'].add(' | '.join(i['text'] for i in m['items'])[:120])
    for t in lk['tooltips']:
        hl = lk['highlighted'][0] if lk['highlighted'] else None
        pos = ''
        if hl:
            dy = t['y'] - (hl['y'] + hl['h']); dx = t['x'] - hl['x']
            pos = ('below' if t['y'] >= hl['y'] + hl['h'] - 2 else 'above' if t['y'] + t['h'] <= hl['y'] + 2 else 'beside') + ' the outlined element, %d px gap, left edge %+d px' % (dy if dy >= 0 else hl['y'] - (t['y'] + t['h']), dx)
        s['tooltips'].append({'board': b['title'].split(' ')[0], 'text': t['text'], 'box': [t['x'], t['y'], t['w'], t['h']], 'position': pos})
    for t in lk['toasts']: s['toasts'].add((t['title'], t['support'], tuple(t['actions']), t['cls'].replace('sv-toast', '').strip(), t['x'], t['y'], t['w']))
    if lk['frame'] and not s['frame']: s['frame'] = lk['frame']
    if lk['h1'] and not s['h1Style']: s['h1Style'] = {k2: lk['h1'][0][k2] for k2 in ('size', 'weight', 'color')}
    for tl in lk['tabs']: s['tabs'].add(' | '.join(t['text'] + ('*' if t['selected'] else '') for t in tl))
    for x in lk['sideActive']: s['sideActive'].add(x)
    for i in lk['inputs']: s['inputs'].add(((i['aria'] or i['placeholder'].strip())[:40], i['type'], i['suffix'], i['prefix'], i['w']))
    for h in lk['highlighted']: s['highlighted'].append({'board': b['title'].split(' ')[0], 'outlined': (h['text'] or h['aria'] or h['tag'])[:60]})
vis_rows = []
for s in screens.values():
    vis_rows.append({**s, 'tables': list(s['tables'].values()), 'badges': sorted(s['badges']), 'buttons': sorted(s['buttons']), 'icons': s['icons'].most_common(), 'dialogs': sorted(s['dialogs']),
                     'menus': sorted(s['menus']), 'toasts': sorted(s['toasts']), 'tabs': sorted(s['tabs']), 'sideActive': sorted(s['sideActive']), 'inputs': sorted(s['inputs'])})
# tier column widths on the matrix grid at 1440 (tp-app.css: "136px at 1920 wide, down to 126px on smaller screens, never wider than 142px")
tierw = collections.Counter()
for b in bl:
    for t in L[b['file']]['look']['tables']:
        for c in t['cols']:
            if re.match(r'^\d(Default|Tier|Internal|Fleet)', c['label']): tierw[c['w']] += 1
# 1536
w1536 = [c for c in cov if c.get('w1536')]
same1536 = sum(1 for c in w1536 if c['w1536']['sameColumnPositions'] and c['w1536']['boardW'] == 1440)
# line 9
line9 = []
for s in stress:
    if s.get('missing'): continue
    agg = collections.Counter(); probs = []
    for h in s['hits']:
        agg['shortened with ...' if h['ellipsis'] else 'cut off without ...' if h['clipped'] else ('wraps to %d lines' % h['lines'] if h['lines'] > 1 else 'one line')] += 1
        if h['overflowCell']: probs.append('runs past its %s' % h['where'])
    line9.append({'board': s['title'].split(' ')[0], 'file': s['board'], 'variant': s['variant'], 'replaced': len(s['hits']), 'result': dict(agg), 'pageWider': s['pageWider'], 'columnsMoved': s['columnsMoved'],
                  'rowsTaller': s['rowsTaller'], 'overflow': sorted(set(probs))[:6], 'picture': s['shot']})
counts = {
    'boards': len(bl), 'rendered': sum(1 for c in cov if c.get('rendered')), 'pages': len({b['page'] for b in bl}),
    'candidates': sum(c['candidates'] for c in cov), 'hovered': sum(c['hovered'] for c in cov), 'clicked': sum(c['clicked'] for c in cov),
    'hoverStyle': sum(c['hoverStyle'] for c in cov), 'hoverText': sum(c['hoverText'] for c in cov), 'clickChanged': sum(c['clickChanged'] for c in cov), 'failed': sum(len(c['failed']) for c in cov),
    'w1536': len(w1536), 'w1536same': same1536, 'taller': sum(1 for c in cov if c['contentTallerThanFrame']),
    'text': ti['total'], 'textCounts': ti['counts'], 'unclassified': ti['unclassified'], 'screens': len(vis_rows), 'overlays': dict(collections.Counter(o['kind'] for o in ov)),
    'panels': sum(len(p['panels']) for p in panels), 'icons': len(icons), 'library': len(lib), 'movePairs': len(moves), 'moveSame': sum(1 for m in moves if m['sameColumns']),
    'moveSameMoved': sum(1 for m in moves if m['sameColumns'] and m['moved']), 'flows': len(flows), 'stressRuns': len(line9), 'tierColWidths': dict(tierw)}
json.dump({'made': '2026-11-14', 'design': 'v1794631438-539a', 'counts': counts,
           'note': 'Per screen (boards grouped by breadcrumb kind / title), every state (board) with its picture, tables (columns in order, x and width at 1440, header style, cell kinds, alignment, row heights, dash cells, info tooltips, sort icons), badges, buttons, icons by name, dialogs, menus, tooltips with position, toasts with position, frame, inputs, outlined click targets. Plus: library sentences, 1536 results, line 9 stress probe, line 10 movement, tier column widths.',
           'screens': vis_rows, 'librarySentences': lib, 'iconNames': [{'name': sig2name[ic['sig']], 'boards': ic['boards'], 'sizes': ic['sizes'], 'regions': ic['regions'], 'hosts': ic['hosts'][:5]} for ic in icons],
           'w1536': [{'file': c['file'], **c['w1536']} for c in w1536], 'line9StressProbe': line9, 'line10Movement': moves, 'tierColumnWidthsAt1440': dict(tierw)},
          open(J('inventory', 'visual-inventory.json'), 'w'), indent=1, ensure_ascii=False, default=list)

# ---------------------------------------------------------------- BOARD-COVERAGE.md (per board)
out = ['# Board coverage — Tiered Pricing design v1794631438-539a (driven 14 Nov 2026)', '',
       'One row per canvas board, in canvas order (page, then row by row, left to right). Texts = visible text pieces read from the rendered board; attrs = tooltip (data-tip), aria-label, title, placeholder, alt, value and option texts; candidates = interactive elements found (button, link, input, select, label, role, tabindex, tooltip, pointer cursor); every candidate was hovered and clicked from a fresh known state. "Exposed" = hover or click changed something (text, element count, page, or the element\'s own colour/border/opacity/shadow). Failures = actions that could not be performed.', '',
       '| Page | # | Board (canvas title) | Picture | W×H | Texts | Attrs | Cand. | Hovered | Clicked | Exposed (hover style / text / click) | Failed | Notes |', '|---|---|---|---|---|---|---|---|---|---|---|---|---|']
for c in cov:
    notes = []
    if c['contentTallerThanFrame']: notes.append('content %d px tall, canvas frame %d px: bottom cut on the canvas; full-height picture saved' % (c['contentTallerThanFrame'], c['h']))
    if c['failedRequests']: notes.append('image not available: ' + ', '.join(sorted(set(c['failedRequests'])))[:120])
    if c['clickChanged']: notes.append('%d clicks follow a link out of the design (Jira/Confluence/canvas page), blocked' % c['clickChanged'])
    out.append('| %s | %s | %s | `%s` | %d×%d | %d | %d | %d | %d | %d | %d (%d / %d / %d) | %d | %s |' % (c['page'].split(' · ')[0], c['nn'], c['title'].replace('|', '/'), os.path.basename(c['image']), c['w'], c['h'], c['texts'], c['attrs'], c['candidates'], c['hovered'], c['clicked'], c['exposed'], c['hoverStyle'], c['hoverText'], c['clickChanged'], len(c['failed']), '; '.join(notes)))
open(J('BOARD-COVERAGE.md'), 'w').write('\n'.join(out) + '\n')

# ---------------------------------------------------------------- generated proof sections
g = []
g.append('## 3 · Boards rendered, per page (coverage proof; per-board detail in BOARD-COVERAGE.md)\n')
g.append('| Page | Boards on the canvas | Rendered | Pictures | Candidates | Hovered | Clicked | Exposed | Failed |')
g.append('|---|---|---|---|---|---|---|---|---|')
bypage = collections.OrderedDict()
for c in cov: bypage.setdefault(c['page'], []).append(c)
for p, cs in bypage.items():
    g.append('| %s | %d | %d | %d | %d | %d | %d | %d | %d |' % (p, len(cs), sum(1 for c in cs if c['rendered']), len(cs), sum(c['candidates'] for c in cs), sum(c['hovered'] for c in cs), sum(c['clicked'] for c in cs), sum(c['exposed'] for c in cs), sum(len(c['failed']) for c in cs)))
g.append('| **All** | **%d** | **%d** | **%d** | **%d** | **%d** | **%d** | **%d** | **%d** |\n' % (counts['boards'], counts['rendered'], counts['boards'], counts['candidates'], counts['hovered'], counts['clicked'], sum(c['exposed'] for c in cov), counts['failed']))
g.append('## 6b · Movement found by comparing the design\'s own pictures of the same screen (checklist line 10)\n')
g.append('Method: boards were grouped by screen (same breadcrumb, title and selected tab); for each pair with the SAME column headings the left edge (x), width and top (y) of every heading were compared at 1440 px. %d pairs compared, %d with identical headings, %d of those with movement. Pairs whose headings differ (a column hidden, edit mode adds a picker row) are in inventory/movement.json too.\n' % (counts['movePairs'], counts['moveSame'], counts['moveSameMoved']))
g.append('| Screen | From (board) | To (board) | What moves (heading: dx / dwidth / dy px) |')
g.append('|---|---|---|---|')
for m in moves:
    if not (m['sameColumns'] and m['moved']): continue
    g.append('| %s | %s | %s | %s |' % (m['screen'][:60], m['base'][:60], m['other'][:70], '; '.join('%s: %+d / %+d / %+d' % (d['column'][:24], d['dx'], d['dw'], d['dy']) for d in m['moved'][:6]) + (' …' if len(m['moved']) > 6 else '')))
g.append('')
g.append('## 6c · Stress data probe (checklist line 9) — harness result, not a design statement\n')
g.append('The design draws no long or special-character names. To show the case author what the design\'s own styles do, every occurrence of a typed record name (tier, matrix, category, customer) on 32 representative boards was replaced in the rendered page with: (spaces) "Northern Alberta Heavy Equipment Fleet Services Preferred Customer Pricing", (nospaces) "NorthernAlbertaHeavyEquipmentFleetServicesPreferredCustomerPricingTier", (special) `A&B "Fleet" O\'Neil <Tier> & Co.`. Pictures in render/stress/. The expected look for these cases must still come from a source (PRD, design library, PO answer).\n')
g.append('| Board | Value | Names replaced | How they show | Page wider | Columns moved | Rows taller | Runs past its box |')
g.append('|---|---|---|---|---|---|---|---|')
for s in line9:
    g.append('| %s %s | %s | %d | %s | %s | %s | %d | %s |' % (s['board'], s['file'], s['variant'], s['replaced'], ', '.join('%s %d' % kv for kv in s['result'].items()), 'yes' if s['pageWider'] else '', 'yes' if s['columnsMoved'] else '', s['rowsTaller'], '; '.join(s['overflow'])[:140]))
g.append('')
g.append('## 9 · Pictures per page (file names for case attachments, folder `images/`)\n')
for p, cs in bypage.items():
    g.append('**%s** (%d)  ' % (p, len(cs)))
    g.append(', '.join('`%s`' % os.path.basename(c['image']) for c in cs) + '\n')
full = sorted(f for f in os.listdir(J('images')) if f.endswith('-full-height.png') or f.startswith('orphan'))
g.append('Extra pictures: ' + ', '.join('`%s`' % f for f in full) + '\n')
open(J('render', 'proof-generated.md'), 'w').write('\n'.join(g) + '\n')
json.dump(counts, open(J('render', 'proof-counts.json'), 'w'), indent=1)
print(json.dumps(counts, indent=1))
