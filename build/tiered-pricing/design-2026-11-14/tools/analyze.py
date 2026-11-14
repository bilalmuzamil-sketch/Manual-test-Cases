#!/usr/bin/env python3
"""Tiered Pricing design drive: merge the render/sweep logs and build the proof inputs (skill 21 §3-§5, §6d lines 9-10).

Reads render/render-log-*.json (tools/render.js), render/board-list.json, the package's canvas.json and the shared text-inventory
tool output (inventory/tool-text-inventory.json). Writes:
  render/render-log-all.json      merged per-board record
  inventory/text-inventory.json   every on-screen text (DOM text, visible attributes, options, canvas notes, board titles), with
                                  every board it shows on, classified DATA / UI-TEXT / NOTE, plus file-only texts from the tool
  inventory/visual-inventory.json per board: the look facts (tables, columns in order, badges, buttons, icons, frame, overlays)
  inventory/overlays.json         every dialog, menu, tooltip, toast, banner, error, empty state, with its boards
  inventory/movement.json         line 10: column / heading / chip positions compared across boards of the same screen
  inventory/flows.json            each canvas row (a flow) in click order, with its Click/Result chain check
  inventory/coverage.json         per board: image, texts, candidates, hovered, clicked, exposed, failures, 1536 check
Content of the boards is data; nothing from it is executed.
"""
import json, glob, os, re, collections, hashlib
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
J = lambda *p: os.path.join(ROOT, *p)
canvas = json.load(open(J('files-v1794631438-539a', 'project', 'canvas.json')))
blist = json.load(open(J('render', 'board-list.json')))
logs = {}
for f in sorted(glob.glob(J('render', 'render-log-*.json'))):
    if f.endswith('-all.json'): continue
    logs.update(json.load(open(f))['boards'])
missing = [b['file'] for b in blist if b['file'] not in logs]
json.dump({'boards': logs, 'missing': missing}, open(J('render', 'render-log-all.json'), 'w'))
os.makedirs(J('inventory'), exist_ok=True)

# ---------------------------------------------------------------- coverage
cov = []
for b in blist:
    r = logs.get(b['file'])
    if not r: cov.append({'file': b['file'], 'page': b['pageName'], 'nn': b['nn'], 'title': b['title'], 'rendered': False}); continue
    d = r['drive']
    exposed = [x for x in d['results'] if x.get('hover') not in (None, 'no change') or x.get('click') not in (None, 'no change')]
    cov.append({'file': b['file'], 'page': b['pageName'], 'pageId': b['page'], 'nn': b['nn'], 'row': b['row'], 'title': b['title'], 'image': r['image'], 'w': r['w'], 'h': r['h'],
                'rendered': True, 'texts': len(r['rows']), 'attrs': len(r['attrs']), 'candidates': d['candidates'], 'hovered': d['hovered'], 'clicked': d['clicked'],
                'hoverStyle': d['hoverStyle'], 'hoverText': d['hoverText'], 'clickChanged': d['clickChanged'], 'exposed': len(exposed), 'failed': d['failed'],
                'console': r['console'], 'failedRequests': r['failedRequests'], 'contentTallerThanFrame': r['contentTallerThanFrame'], 'clipped': len(r['clipped']),
                'overlaps': r['overlaps'], 'outside': r['outside'][:5], 'w1536': r.get('w1536')})
json.dump(cov, open(J('inventory', 'coverage.json'), 'w'), indent=1)

# ---------------------------------------------------------------- overlays (dialogs, menus, tooltips, toasts, banners, errors, empty)
ov = collections.OrderedDict()
def addov(kind, key, payload, board):
    k = kind + '|' + json.dumps(key, ensure_ascii=False, sort_keys=True)
    if k not in ov: ov[k] = {'kind': kind, **payload, 'boards': []}
    ov[k]['boards'].append(board)
for b in blist:
    r = logs.get(b['file']);
    if not r: continue
    L = r['look']; tag = b['nn'] + ' ' + b['title'] + ' [' + b['file'] + ']'
    for d in L['dialogs']:
        p = {'title': d['title'], 'aria': d['aria'], 'body': d['body'], 'fields': d['fields'], 'inputs': d['inputs'], 'buttons': [x['text'] + (' (disabled)' if x['disabled'] else '') for x in d['buttons']], 'close': d['close'], 'width': d['w']}
        addov('dialog', p, p, b['pageName'] + ' ' + tag)
    for m in L['menus']:
        p = {'aria': m['aria'], 'heading': m['heading'], 'items': [i['text'] + (' (disabled)' if i['disabled'] else '') + (' [' + i['checked'] + ']' if i['checked'] else '') + (' {tip: ' + i['tip'] + '}' if i['tip'] else '') for i in m['items']], 'text': m['text'], 'cls': m['cls']}
        addov('menu', p, p, b['pageName'] + ' ' + tag)
    for t in L['tooltips']: addov('tooltip', {'text': t['text']}, {'text': t['text']}, b['pageName'] + ' ' + tag)
    for t in L['toasts']:
        p = {'title': t['title'], 'support': t['support'], 'actions': t['actions'], 'close': t['close'], 'variant': t['cls'], 'timer': t['timer']}
        addov('toast', {k: v for k, v in p.items() if k != 'timer'}, p, b['pageName'] + ' ' + tag)
    for t in L['banners']: addov('banner', {'text': t['text']}, {'text': t['text'], 'cls': t['cls']}, b['pageName'] + ' ' + tag)
    for t in L['errors']:
        if t['text']: addov('error', {'text': t['text']}, {'text': t['text'], 'cls': t['cls']}, b['pageName'] + ' ' + tag)
    for t in L['empty']: addov('empty', {'text': t['text']}, {'text': t['text']}, b['pageName'] + ' ' + tag)
json.dump(list(ov.values()), open(J('inventory', 'overlays.json'), 'w'), indent=1, ensure_ascii=False)

# ---------------------------------------------------------------- text inventory
NUM = re.compile(r'^[\s$€£+\-−–(]*[\d.,]+[%)]?\s*(%|off|margin|markup)?$|^\$[\d,.]+|^[−-]\$|\d{1,2}/\d{1,2}/\d{2,4}|\b\d{1,2}:\d{2}\b|^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d|^[A-Z]\d-\d+|^\(\d{3}\)|^\d+ (rows?|matrices|customers?|categories|lines?)$', re.I)
texts = collections.OrderedDict()
def addt(text, source, board, ctx):
    t = re.sub(r'\s+', ' ', text).strip()
    if not t: return
    e = texts.setdefault(t, {'text': t, 'sources': set(), 'contexts': set(), 'boards': []})
    e['sources'].add(source); e['contexts'].add(ctx)
    if board and board not in e['boards']: e['boards'].append(board)
UI_CTX = {'th', 'button', 'label', 'option', 'optgroup', 'h1', 'h2', 'h3', 'aria-label', 'placeholder', 'data-tip', 'title', 'a', 'tab', 'menu', 'dialog', 'toast', 'tooltip', 'badge', 'crumbs', 'header-chrome'}
for b in blist:
    r = logs.get(b['file']);
    if not r: continue
    bid = b['file']
    for row in r['rows']:
        cls = row['cls']; tag = row['tag']
        ctx = tag
        if 'sv-toast' in cls: ctx = 'toast'
        elif 'sv-modal__title' in cls: ctx = 'dialog'
        elif 'sv-badge' in cls: ctx = 'badge'
        elif 'tp-tip' in cls: ctx = 'tooltip'
        elif 'sv-crumbs' in cls: ctx = 'crumbs'
        elif 'sv-menu__row' in cls or 'sv-dd-row' in cls: ctx = 'menu'
        elif 'sv-tab' in cls: ctx = 'tab'
        if 'tp-side' in cls or 'tp-nav' in cls or 'sv-menu__section' in cls or 'tp-header' in cls or 'sv-search__text' in cls: ctx = 'header-chrome'
        addt(row['text'], 'dom-text', bid, ctx)
    for a in r['attrs']:
        addt(a['text'], 'attr:' + a['attr'], bid, a['attr'] if a['attr'] not in ('value',) else 'value')
for k, n in canvas['notes'].items(): addt(n['text'], 'canvas-note', n.get('page', 'p00') + ':' + k, 'canvas-note')
for f, bd in canvas['boards'].items(): addt(bd['title'], 'board-title', f, 'board-title')
# file-only texts from the shared tool (texts in the files that no rendered board showed as text or attribute)
tool = json.load(open(J('inventory', 'tool-text-inventory.json')))
tool_rows = tool.get('rows') or tool.get('texts') or tool.get('items') or []
file_only = []
NORM = lambda x: re.sub(r'\s+', ' ', x.replace('’', "'").replace('‘', "'").replace('“', '"').replace('”', '"')).strip()
seen_norm = {NORM(t) for t in texts}
seen_blob = ' || '.join(seen_norm)
for tr in tool_rows:
    t = NORM(str(tr.get('text', '')))
    if not t or t in seen_norm: continue
    tr = dict(tr); tr['partOfShownText'] = t in seen_blob   # e.g. an aria-label piece "Tier 2 $10,000.01" inside "Tier 2 $10,000.01 +"
    file_only.append(tr)
# record names (DATA): values the design fills in as sample records, gathered from the filter lists, tier "N · Name" labels and the
# cells under record-name columns (Matrix, Customer, Category, User, Name/Description, Part Number, Vendor, Contact, Tier columns)
NAMES = set()
DATA_COLS = {'Matrix', 'Customer', 'Category', 'User', 'Name/Description', 'Part Number', 'Part #', 'Description', 'Vendor', 'Contact', 'Work Order Tier', 'Part Sales Tier', 'Tier', 'Name', 'Invoice', 'Document', 'Priced By', 'Location', 'Bin'}
try:
    for pb in json.load(open(J('inventory', 'panels.json'))):
        for pn in pb['panels']:
            if pn['aria'] in ('Customer filter', 'Category filter', 'Priced By filter', 'Location filter') or 'tierpick' in pn['cls']:
                for rw in pn['rows']: NAMES.add(rw['t'].split(' | ')[0])
except FileNotFoundError: pass
for b in blist:
    r = logs.get(b['file'])
    if not r: continue
    for t in r['look']['tables']:
        hy = min((c['y'] + c['h'] for c in t['cols']), default=0)
        for c in t['cols']:
            if c['label'] not in DATA_COLS: continue
            for row in r['rows']:
                if row['y'] > hy and c['x'] - 2 <= row['x'] < c['x'] + c['w'] and row['tag'] in ('strong', 'a', 'td', 'span', 'button', 'div') and 'tp-reason' not in row['cls'] and 'sv-badge' not in row['cls'] and 'sv-facts__empty' not in row['cls'] and 'tp2-prev' not in row['cls']:
                    NAMES.add(row['text'])
    for row in r['rows']:
        m = re.match(r'^\d+ · (.+)$', row['text'])
        if m: NAMES.add(row['text']); NAMES.add(m.group(1))
FIXED_WORDS = {'Default', 'Manual', 'Fixed price', 'Fixed line total', 'Before tiers', 'Internal', 'Active', 'Inactive', 'Archived', 'Clear selection', 'Uncategorized', 'General Matrix', 'Same as work orders', 'Same as previous tier', 'Uses previous tier', 'Mixed rules'}
NAMES -= FIXED_WORDS
CHROME = set()
for t, e in texts.items():
    if e['contexts'] == {'header-chrome'}: CHROME.add(t)
def classify(t, e):
    c = e['contexts']
    if c & {'canvas-note', 'board-title'} and not (c - {'canvas-note', 'board-title'}): return 'NOTE', 'canvas note or board title (designer annotation)'
    if t in ('Before · screenshot',) or t.startswith('Settings › ') and 'screenshot' in ' '.join(e['sources']): return 'NOTE', 'label of a "Today" screenshot board'
    if NUM.search(t) and not re.search(r'[A-Za-z]{4,}.*[A-Za-z]{4,}', t): return 'DATA', 'number, amount, date, time or document number'
    if t in NAMES and not (c & {'th', 'button', 'tab', 'dialog', 'toast', 'tooltip', 'data-tip'}): return 'DATA', 'sample record name (filter list, tier label or record-name column)'
    if 'attr:alt' in e['sources'] or re.match(r'^(Settings|Customers|Work Orders|Reports) › .*(today|list|page)', t) and 'span' in c and len(e['boards']) <= 2: return 'NOTE', 'caption or alt text of a "Today" screenshot board'
    if c & UI_CTX: return 'UI-TEXT', 'shown as ' + ', '.join(sorted(c & UI_CTX))
    if c <= {'value'}: return 'DATA', 'typed value in an input'
    if t in NAMES: return 'DATA', 'sample record name (filter list, tier label or record-name column)'
    parts = [x.strip() for x in re.split(r',(?![^(]*\))', t)]
    if len(parts) > 1 and all(x in NAMES or x in FIXED_WORDS for x in parts): return 'DATA', 'list of sample record names'
    if c & {'td', 'strong'} and re.search(r'\d', t) and len(t.split()) <= 6 and not t.endswith(('.', '?')): return 'DATA', 'sample value in a table cell'
    return 'UI-TEXT', 'words the design shows (label, phrase or message); may embed sample data'
rows = []
for t, e in texts.items():
    cl, why = classify(t, e)
    rows.append({'text': t, 'class': cl, 'basis': why, 'contexts': sorted(e['contexts']), 'sources': sorted(e['sources']), 'boardCount': len(e['boards']), 'boards': e['boards'][:40]})
for tr in file_only:
    wh = str(tr.get('where') or '')
    fcl = 'NOTE' if ('canvas.json' in wh or 'tokens.json' in wh or '/ds/' in wh or re.search(r'\.dc\.html:5$', wh)) else ('DATA' if re.search(r'\d', str(tr.get('text'))) else 'UI-TEXT')
    rows.append({'text': str(tr.get('text')), 'class': fcl, 'basis': ('a piece of a longer text that IS shown' if tr.get('partOfShownText') else 'in the files, not shown as text on any rendered board') + ' (tool row: ' + str(tr.get('where') or '').split('project/')[-1][:80] + ')',
                 'contexts': ['file-only'], 'sources': ['design_text_inventory.py'], 'boardCount': 0, 'boards': []})
cnt = collections.Counter(r['class'] for r in rows)
json.dump({'made': '2026-11-14', 'design': 'v1794631438-539a', 'counts': dict(cnt), 'total': len(rows), 'unclassified': sum(1 for r in rows if r['class'] not in ('DATA', 'UI-TEXT', 'NOTE')),
           'fileOnly': len(file_only), 'toolDistinct': len(tool_rows), 'rows': rows}, open(J('inventory', 'text-inventory.json'), 'w'), indent=1, ensure_ascii=False)

# ---------------------------------------------------------------- visual inventory (per board)
vis = []
for b in blist:
    r = logs.get(b['file']);
    if not r: continue
    L = r['look']
    vis.append({'file': b['file'], 'page': b['pageName'], 'nn': b['nn'], 'title': b['title'], 'image': r['image'], 'size': [r['w'], r['h']],
                'crumbs': L['crumbs'], 'h1': [h['text'] for h in L['h1']], 'h1Style': L['h1'][0] if L['h1'] else None, 'sideActive': L['sideActive'], 'tabs': L['tabs'],
                'tables': [{'columns': [c['label'] for c in t['cols']], 'colX': [c['x'] for c in t['cols']], 'colW': [c['w'] for c in t['cols']], 'headerStyle': ({k: t['cols'][1][k] for k in ('size', 'weight', 'color', 'transform')} if len(t['cols']) > 1 else None),
                            'headerBg': t['headerBg'], 'cellKinds': {c['label'] or '(col %d)' % i: c['cellKinds'] for i, c in enumerate(t['cols'])}, 'cellAlign': {c['label'] or '(col %d)' % i: c['cellAlign'] for i, c in enumerate(t['cols'])},
                            'infoTips': {c['label']: c['info'] for c in t['cols'] if c['info']}, 'rows': t['rows'], 'rowHeights': t['rowHeights'], 'dashCells': t['dashCells'], 'tfoot': t['tfoot'], 'groupRows': t['groupRows'], 'x': t['x'], 'w': t['w']} for t in L['tables']],
                'badges': sorted({(x['text'], x['cls'], x['bg'], x['color'], x['h']) for x in L['badges']}), 'buttons': [(x['text'] or x['aria'], x['cls'], x['disabled'], x['tip']) for x in L['buttons']],
                'inputs': L['inputs'], 'highlighted': L['highlighted'], 'frame': L['frame'], 'images': L['images'], 'phone': L['phone'],
                'iconSigs': collections.Counter(i['sig'][:60] + '…@' + i['region'] for i in L['icons']).most_common(), 'clipped': r['clipped'], 'overlaps': r['overlaps']})
json.dump(vis, open(J('inventory', 'visual-inventory-boards.json'), 'w'), indent=1, ensure_ascii=False)

# icons: distinct signatures with where they show
icons = collections.OrderedDict()
for b in blist:
    r = logs.get(b['file']);
    if not r: continue
    for i in r['look']['icons']:
        e = icons.setdefault(i['sig'], {'sig': i['sig'], 'sizes': set(), 'hosts': collections.Counter(), 'regions': set(), 'boards': 0, 'colors': set()})
        e['sizes'].add(i['size']); e['hosts'][i['host']] += 1; e['regions'].add(i['region']); e['colors'].add(i['color'])
    for s in {i['sig'] for i in r['look']['icons']}: icons[s]['boards'] += 1
json.dump([{**v, 'sizes': sorted(v['sizes']), 'regions': sorted(v['regions']), 'colors': sorted(v['colors']), 'hosts': v['hosts'].most_common(8)} for v in icons.values()], open(J('inventory', 'icons.json'), 'w'), indent=1, ensure_ascii=False)

# ---------------------------------------------------------------- movement (line 10): same screen, different state
def screen_key(r):
    L = r['look']
    return ' › '.join(L['crumbs'][0]) if L['crumbs'] else ''
groups = collections.defaultdict(list)
for b in blist:
    r = logs.get(b['file'])
    if not r or not r['look']['tables']: continue
    groups[(screen_key(r), tuple(r['look']['h1'][0]['text'] for _ in [0]) if r['look']['h1'] else ('',), tuple(json.dumps(t['selected']) for tl in r['look']['tabs'] for t in tl if t['selected']))].append(b)
moves = []
for key, bs in groups.items():
    if len(bs) < 2: continue
    base = logs[bs[0]['file']]
    for other in bs[1:]:
        o = logs[other['file']]
        for ti, (t1, t2) in enumerate(zip(base['look']['tables'], o['look']['tables'])):
            l1 = [c['label'] for c in t1['cols']]; l2 = [c['label'] for c in t2['cols']]
            shared = [l for l in l1 if l in l2 and l1.count(l) == 1 and l2.count(l) == 1]
            d = []
            for l in shared:
                c1 = t1['cols'][l1.index(l)]; c2 = t2['cols'][l2.index(l)]
                dx, dw, dy = c2['x'] - c1['x'], c2['w'] - c1['w'], c2['y'] - c1['y']
                if abs(dx) > 1 or abs(dw) > 1 or abs(dy) > 1: d.append({'column': l or '(checkbox/blank)', 'dx': dx, 'dw': dw, 'dy': dy})
            moves.append({'screen': ' / '.join(str(k) for k in key[:2]), 'table': ti, 'base': bs[0]['nn'] + ' ' + bs[0]['title'], 'other': other['nn'] + ' ' + other['title'],
                          'baseFile': bs[0]['file'], 'otherFile': other['file'], 'columnsBase': l1, 'columnsOther': l2, 'sameColumns': l1 == l2, 'moved': d})
json.dump(moves, open(J('inventory', 'movement.json'), 'w'), indent=1, ensure_ascii=False)

# ---------------------------------------------------------------- flows: each canvas row in click order
flows = []
pages = {p['id']: p['name'] for p in canvas['pages']}
titles1 = {(n.get('page'), n['y']): n['text'] for n in canvas['notes'].values() if n.get('kind') == 'title1'}
byrow = collections.OrderedDict()
for b in blist: byrow.setdefault((b['page'], b['row']), []).append(b)
for (pid, row), bs in byrow.items():
    t1 = sorted([(y, t) for (p, y), t in titles1.items() if p == pid])
    name = t1[row - 1][1] if row - 1 < len(t1) else ''
    chain = [{'nn': b['nn'], 'title': b['title'], 'file': b['file'], 'kind': ('click' if re.search(r'^\S+ (Click|Type|Pick|Hover|Check|Uncheck|Search|Open|Change|Delete|Archive|Save|Edit|Sort|Hide|Tap|Point|Turn|Rename|Duplicate|Quick Add|Receive|Download|Set|Pick|Uncheck)', b['title']) and 'Result' not in b['title'] else 'result' if 'Result' in b['title'] else 'state')} for b in bs]
    unfinished = []
    for i, c in enumerate(chain):
        r = logs.get(c['file'])
        hl = r['look']['highlighted'] if r else []
        c['highlighted'] = [h['text'] or h['aria'] or h['tag'] for h in hl]
        if re.search(r'^\S+ Click ', c['title']) and i == len(chain) - 1: unfinished.append(c['nn'] + ' ' + c['title'] + ' (last board of the row is a click with no result board after it)')
    flows.append({'page': pages[pid], 'row': row, 'name': name, 'boards': len(bs), 'chain': chain, 'unfinished': unfinished})
json.dump(flows, open(J('inventory', 'flows.json'), 'w'), indent=1, ensure_ascii=False)

print('boards', len(blist), 'rendered', len(logs), 'missing', missing)
print('text rows', len(rows), dict(cnt), 'file-only', len(file_only), 'tool distinct', len(tool_rows))
print('overlays', collections.Counter(v['kind'] for v in ov.values()))
print('icons distinct', len(icons))
print('movement pairs', len(moves), 'with movement', sum(1 for m in moves if m['moved']))
print('flows', len(flows), 'unfinished', sum(len(f['unfinished']) for f in flows))
print('sweep', {k: sum(c.get(k, 0) for c in cov if c.get('rendered')) for k in ('candidates', 'hovered', 'clicked', 'hoverStyle', 'hoverText', 'clickChanged', 'exposed')}, 'failed', sum(len(c.get('failed', [])) for c in cov))
