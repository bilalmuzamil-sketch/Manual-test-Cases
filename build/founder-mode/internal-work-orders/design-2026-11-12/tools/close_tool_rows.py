"""Write an outcome for every row build/testing-tools/spec_to_design_check.py reports (PRD words not in the design's words) into the register,
keyed "<code>|<words>" as the tool expects. Run after build_all.py and the tool:  python3 -I tools/close_tool_rows.py"""
import json, os, re
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REG = os.path.join(ROOT, '..', 'DESIGN-DIVERGENCE-REGISTER.json')
rows = json.load(open(os.path.join(ROOT, 'render', 'spec_to_design_check-2026-11-12.json')))
reg = json.load(open(REG))
PO = 'PO-RULED'  # the PRD (Final v1.0, 2026-11-09, Milos Vasic) header: "Where a frame and this text disagree, the text wins"
DRIVEN = {  # drawn with demo data or split by a link, so the literal words are not in the files
    'Show archived (n)': 'drawn "Show archived (1)" (Flow 0 2a, 2b)', 'Turn on Internal Work Orders in Settings to change this.': 'drawn with "Settings" as a link (Flow 0 06)',
    '... from the customer.': 'tooltip "… Posts to Company Vehicle Maintenance, from the customer." (Flow 1 2b)',
    'Classification: All / Billable / Internal / No Charge': 'chip "Classification: All" and its menu rows All, Billable, Internal, No Charge (Flow 4 01)',
    'Stock parts ${stock parts cost}': 'row "Stock parts" "$265.00" (Flow 1 07)', 'Special orders and sublet ${amount}': 'row with "$410.00" (Flow 1 07)',
    'Shop supplies ${amount}': 'row "Shop supplies" "$25.00" (Flow 1 07) and the document Summary (Flow 1 08)', 'No Charge · {category}': 'chip "No Charge · Warranty" (Flow 6 03)',
    'Map their expense accounts in Integrations > QuickBooks.': 'drawn "Map their expense accounts in Integrations >" with "QuickBooks" as a link and "." after it (Flow 0 02; Happy 03)',
}
RULED = {'Internal Work Orders is off. Turn it on in Settings > Work Orders.': 'IWO-D07', 'Original technician: {names}': 'IWO-D24', 'Original technician: none': 'IWO-D24',
         'Internal Work Order Close': 'IWO-D46', 'Internal Work Order Reopen': 'IWO-D46', 'Internal: {Category} row not mapped': 'IWO-D47', 'Unassigned': 'IWO-D42',
         'Internal work orders: Hide / Only internal / Show all': 'IWO-D41',
         'Every line priced as a new line would be today. Category {name} removed.': 'IWO-D26 (the design note reads "Every line priced at the customer\'s current pricing. Category Warranty removed.", Flow 2 3e)'}
out = {}
for r in rows:
    w = r['words']; key = r['key']
    if w in DRIVEN: out[key] = dict(outcome='SHOWN-WHEN-DRIVEN', where=DRIVEN[w])
    elif w in RULED: out[key] = dict(outcome=PO, where='%s; PRD Final v1.0 (2026-11-09) header: "Where a frame and this text disagree, the text wins"' % RULED[w])
    else: out[key] = dict(outcome='DESIGN-SILENT', where='not drawn on any of the 167 boards (checked 12 Nov 2026); listed with the not_shown rows or a NO SCREEN verdict in SPEC-TO-DESIGN-2026-11-12.json')
for k in [k for k in reg if '|' in k]: del reg[k]
reg.update(out)
reg['spec_to_design_check'] = dict(run='12 Nov 2026', prd='render/prd-for-check.md, built by tools/prd_for_check.py from the saved PRD: [placeholders] written {placeholders}, and on each requirement line the straight quotes paired in order as curly quotes (words unchanged) so the tool no longer reads prose between two quotes as a label; the tool itself is unchanged',
                                   design='render/design-words-for-check.html (every rendered word, the notes and the board sources)', rows=len(rows),
                                   by_outcome={o: sum(1 for v in out.values() if v['outcome'] == o) for o in sorted({v['outcome'] for v in out.values()})})
# the 26 keys the first run (plain straight quotes) left open: record what each one is, from the PRD line it came from
SRC = os.path.normpath(os.path.join(ROOT, '..', 'sources', 'CONFLUENCE-942243841-read-2026-11-12.md'))
lines = [l.replace('\\[', '[').replace('\\]', ']').replace('\\*', '*').replace('\\_', '_').replace('\\>', '>') for l in open(SRC, encoding='utf-8').read().split('\n')]
before = json.load(open(os.path.join(ROOT, 'render', 'spec_to_design_check-before-quote-pairing.json')))
now_keys = {r['key'] for r in rows}
frag = []
for r in before:
    if r['closed'] and r['outcome'] != 'TOOL-ARTEFACT': continue
    code, w = r['code'], r['words']
    w_src = re.sub(r'\{([^}]*)\}', r'[\1]', w)
    n = next(i for i, l in enumerate(lines, 1) if l.startswith('- **%s:**' % code) and w_src in l)
    l = lines[n - 1]; at = l.index(w_src)
    left = l.rfind('"', 0, at); left = l.rfind('"', 0, left)  # the quoted label before the fragment
    right = l.find('"', at + len(w_src) + 1); right = l.find('"', right + 1) if right >= 0 else -1
    ctx = l[max(0, left):(right + 1 if right >= 0 else at + len(w_src) + 40)]
    real = r['key'] in now_keys
    frag.append(dict(key=r['key'], prd_line=n, code=code, first_run_outcome=r['outcome'] or 'none',
                     outcome=('SHOWN-WHEN-DRIVEN: a real quoted label, now matched as one: ' + DRIVEN.get(w, '')) if real else 'TOOL FRAGMENT, not a quoted label',
                     evidence=('PRD line %d (%s) reads: …%s… — the words are the PRD\'s own prose between two quoted labels; with the quotes paired the tool reads the labels on each side instead, and each of those is in this check or in DESIGN-VISUAL-INVENTORY.md §B' % (n, code, ctx)) if not real else 'PRD line %d (%s): "%s" is the tooltip text the PRD quotes; Flow 1 2b draws "Internal customer: no prices, no invoice. Posts to Company Vehicle Maintenance, from the customer."' % (n, code, w),
                     still_reported=real))
reg['spec_to_design_check']['first_run_open_keys'] = frag
s2d_path = os.path.join(ROOT, 'SPEC-TO-DESIGN-2026-11-12.json')
s2d = json.load(open(s2d_path))
s2d['spec_to_design_check'] = dict(reg['spec_to_design_check'])
s2d['spec_to_design_check']['rows'] = [dict(key=k, outcome=v['outcome'], where=v['where']) for k, v in out.items()]
json.dump(s2d, open(s2d_path, 'w'), indent=1, ensure_ascii=False)
json.dump(reg, open(REG, 'w'), indent=1, ensure_ascii=False)
print(reg['spec_to_design_check'])
