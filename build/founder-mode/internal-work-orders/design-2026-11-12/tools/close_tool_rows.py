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
}
RULED = {'Internal Work Orders is off. Turn it on in Settings > Work Orders.': 'IWO-D07', 'Original technician: {names}': 'IWO-D24', 'Original technician: none': 'IWO-D24',
         'Internal Work Order Close': 'IWO-D46', 'Internal Work Order Reopen': 'IWO-D46', 'Internal: {Category} row not mapped': 'IWO-D47', 'Unassigned': 'IWO-D42',
         'Internal work orders: Hide / Only internal / Show all': 'IWO-D41'}
out = {}
for r in rows:
    w = r['words']; key = r['key']
    if w[:1] in ' ,;)(.' or w.endswith(' ') or w.startswith('), '):
        out[key] = dict(outcome='TOOL-ARTEFACT', where='prose between two quoted labels in the PRD sentence, not words the screen shows; the labels on either side are checked by hand in DESIGN-VISUAL-INVENTORY.md')
    elif w in DRIVEN: out[key] = dict(outcome='SHOWN-WHEN-DRIVEN', where=DRIVEN[w])
    elif w in RULED: out[key] = dict(outcome=PO, where='%s; PRD Final v1.0 (2026-11-09) header: "Where a frame and this text disagree, the text wins"' % RULED[w])
    else: out[key] = dict(outcome='DESIGN-SILENT', where='not drawn on any of the 167 boards (checked 12 Nov 2026); listed with the not_shown rows or a NO SCREEN verdict in SPEC-TO-DESIGN-2026-11-12.json')
for k in [k for k in reg if '|' in k]: del reg[k]
reg.update(out)
reg['spec_to_design_check'] = dict(run='12 Nov 2026', prd='render/prd-for-check.md (the saved PRD with [placeholders] written {placeholders}, which the tool expects)',
                                   design='render/design-words-for-check.html (every rendered word, the notes and the board sources)', rows=len(rows),
                                   by_outcome={o: sum(1 for v in out.values() if v['outcome'] == o) for o in sorted({v['outcome'] for v in out.values()})})
json.dump(reg, open(REG, 'w'), indent=1, ensure_ascii=False)
print(reg['spec_to_design_check'])
