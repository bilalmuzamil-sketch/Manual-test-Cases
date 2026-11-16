# Independent recompute of an invoice from the inputs entered on screen, compared with the invoice's own data and the screen.
# Usage: python3 recompute.py <spec.json>   (spec lists the inputs; reads saved read-backs; writes <flow>/recompute.json). No secrets.
import json, sys
from decimal import Decimal as D, ROUND_HALF_UP
OUT = '/home/user/Manual-test-Cases/build/regression-wo-parts-invoices-2026-11/steps-1-2'
c = lambda x: D(str(x)).quantize(D('0.01'), ROUND_HALF_UP)
spec = json.load(open(sys.argv[1]))
rate = D(str(spec.get('tax_rate', 5))) / 100
items, checks = [], []
def chk(what, expected, how, seen, where):
    ok = (str(expected) == str(seen)) if not isinstance(expected, D) else (seen is not None and c(seen) == expected)
    checks.append({'what': what, 'expected': str(expected), 'how': how, 'seen': str(seen), 'where': where, 'match': ok})
labour = parts = D(0); taxes_item = []; taxes_line = []
for ln in spec['lines']:
    lab = c(D(str(ln['hours'])) * D(str(ln['rate']))) if ln.get('hours') is not None else D(0)
    taxable_lab = ln.get('labour_taxable', True)
    pl = []
    for p in ln.get('parts', []):
        t = c(D(str(p['qty'])) * D(str(p['price']))); pl.append((p, t)); parts += t
        taxes_item.append(c(t * rate) if p.get('taxable', True) else D(0))
    labour += lab
    taxes_item.append(c(lab * rate) if taxable_lab else D(0))
    line_taxable = (lab if taxable_lab else 0) + sum(t for p, t in pl if p.get('taxable', True))
    taxes_line.append(c(D(str(line_taxable)) * rate))
    items.append({'line': ln['name'], 'labour': f"{ln.get('hours')} h x ${ln.get('rate')} = {lab}", 'parts': [f"{p['pn']} {p['qty']} x ${p['price']} = {t}" for p, t in pl]})
sub = labour + parts
tax_item = sum(taxes_item, D(0)); tax_line = sum(taxes_line, D(0)); tax_total = c(sub * rate)
exp_tax = tax_item  # the build's line-by-line method is checked against all three readings below
total = sub + tax_item
inv = json.load(open(spec['invoice_view']))['data']['collection'] if spec.get('invoice_view') else None
snap = json.load(open(spec['snapshot']))['ui'] if spec.get('snapshot') else None
if inv:
    w = inv['work_order']
    # every source line and part appears on the invoice, once
    src = [(ln['name'], p['pn'], str(p['qty'])) for ln in spec['lines'] for p in ln.get('parts', [])]
    got = [(l['name'], p['part_number'], str(p['quantity'])) for l in w['lines'] for p in l['parts']]
    chk('Every WO line is on the invoice, once', sorted(l['name'] for l in spec['lines']), 'list of lines entered on the WO', sorted(l['name'] for l in w['lines']), 'invoice data: work_order.lines')
    chk('Every part (number, qty) is on the invoice, once', sorted(src), 'parts entered on the WO lines', sorted(got), 'invoice data: work_order.lines[].parts')
    for ln in spec['lines']:
        il = [l for l in w['lines'] if l['name'] == ln['name']]
        if il:
            il = il[0]; lab = c(D(str(ln['hours'])) * D(str(ln['rate'])))
            chk(f"{ln['name']}: labour", lab, f"{ln['hours']} h x ${ln['rate']}", il['labour_cost'], 'invoice data: line labour_cost')
            chk(f"{ln['name']}: hours", D(str(ln['hours'])), 'hours entered', il['time_estimate'], 'invoice data: line time_estimate')
            for p in ln.get('parts', []):
                ip = [x for x in il['parts'] if x['part_number'] == p['pn']]
                if ip: chk(f"{ln['name']}: {p['pn']} line total", c(D(str(p['qty'])) * D(str(p['price']))), f"{p['qty']} x ${p['price']}", ip[0]['total_cost'], 'invoice data: part total_cost')
    chk('Labour total', labour, 'sum of labour lines', w['total_labor_price'], 'invoice data: total_labor_price')
    chk('Parts total', parts, 'sum of part lines', w['total_parts_price'], 'invoice data: total_parts_price')
    chk('Subtotal', sub, 'labour + parts', inv['sub_total_display'], 'invoice data: sub_total_display')
    chk('Tax (GST 5 %)', exp_tax, f"rounded per labour/part item {tax_item}; per WO line {tax_line}; once on subtotal {tax_total}", inv['tax']['amountTotal'], 'invoice data: tax.amountTotal')
    chk('Total', total, 'subtotal + tax', inv['sub_total_with_tax'], 'invoice data: sub_total_with_tax')
    for k, v in spec.get('expect_invoice', {}).items(): chk(f'Invoice {k}', v, spec.get('expect_how', {}).get(k, 'from the payments entered'), inv.get(k), f'invoice data: {k}')
if snap:
    fc = snap.get('financial_card', {})
    for lab, val in [('Labor', labour), ('Parts', parts), ('Subtotal', sub), ('GST', exp_tax), ('Total', total)]:
        if lab in fc: chk(f'Screen Financial Info: {lab}', f'${val:,.2f}', 'recomputed above', fc[lab], 'WO left panel Financial Info card')
    for k, v in spec.get('expect_card', {}).items(): chk(f'Screen Financial Info: {k}', v, spec.get('expect_how', {}).get(k, 'from the payments entered'), fc.get(k), 'WO left panel Financial Info card')
    doc = snap.get('invoice_doc', {})
    for tid, lab, val in [('invoice-summary-labor', 'Labor', labour), ('invoice-summary-parts', 'Parts', parts), ('invoice-summary-subtotal', 'Subtotal', sub), ('invoice-summary-tax-row', 'GST (5%)', exp_tax), ('invoice-summary-total', 'Total', total)]:
        if tid in doc: chk(f'Screen invoice document: {lab}', f'{lab} ${val:,.2f}', 'recomputed above', doc[tid], 'Finance tab invoice')
res = {'flow': spec['flow'], 'inputs': items, 'expected': {'labour': str(labour), 'parts': str(parts), 'subtotal': str(sub), 'tax_per_item': str(tax_item), 'tax_per_wo_line': str(tax_line), 'tax_on_subtotal': str(tax_total), 'total': str(total)}, 'checks': checks}
json.dump(res, open(f"{OUT}/evidence/{spec['flow']}/recompute.json", 'w'), indent=1)
print(json.dumps(res['expected'])); [print(('OK  ' if x['match'] else 'DIFF') , x['what'], '| exp', x['expected'][:80], '| seen', x['seen'][:80]) for x in checks]
