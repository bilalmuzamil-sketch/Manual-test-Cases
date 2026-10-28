#!/usr/bin/env python3
"""Follow-up for the Sales and Advisor Analysis rows whose Labor / Parts Invoiced differ from TODAY's Stats tab:
compare those rows with the INVOICE RECORD itself (labor and parts on the invoice lines, plus line-level
fees/discounts, the same oracle check_sbc.py uses). Cached reads only. SECRET-FREE. Prints a summary."""
import sys, os, json, glob, collections
sys.path.insert(0, os.path.dirname(__file__))
from common import *
from records import invoice, stats, stat_totals, wo_view
out = {}
WO2INV = {}
for p in glob.glob('/tmp/cln/dv/rep/*/*__sales.json'):
    j = json.load(open(p))
    if j.get('status') == 200:
        for r in j['body']['data']['collection']:
            if not r.get('is_credit'): WO2INV[r['work_order_id']] = r['document_id']
for rep, fn, key in (('Sales', 'results-sales.json', 'labor_invoiced'), ('Advisor Analysis', 'results-saa.json', None)):
    rows = json.load(open(f'/tmp/cln/w2/full/{fn}'))
    bad = {(r['location'], r['detail'].split()[0]) for r in rows if r['result'] == 'FAIL' and ('Labor' in r['check'] or 'Parts Invoiced' in r['check'])}
    c = collections.Counter(); ex = []
    for wid, name, tz in WORKPLACES:
        seen = {}
        pat = f'/tmp/cln/dv/rep/{wid}/*__sales.json' if rep == 'Sales' else f'/tmp/cln/dv/rep/{wid}/*__saa.json'
        for p in glob.glob(pat):
            j = json.load(open(p))
            if j.get('status') != 200: continue
            for r in j['body']['data']['collection']:
                if r.get('is_credit'): continue
                num = r.get('invoice_number'); seen[(num, r.get('document_id') or r.get('invoice_id'))] = r
        for (num, iid), r in seen.items():
            if (name, num) not in bad: continue
            if not iid:
                iid = WO2INV.get(r['work_order_id'])   # the same work order's invoice id, from the Sales report rows
            if not iid: c['no invoice id'] += 1; continue
            v = invoice(iid, wid)
            if v is None: c['invoice unreadable'] += 1; continue
            st = stat_totals(stats(v['work_order']['id'] if isinstance(v.get('work_order'), dict) and v['work_order'].get('id') else r['work_order_id'], wid)) or {}
            adj = st.get('adjustments') or []
            lab = round(sum(l.get('labour_cost') or 0 for l in v['work_order']['lines']) + sum(a['resolvedAmount'] for a in adj if a.get('scope') == 'labor_line'), 2)
            prt = round(sum(l.get('parts_cost') or 0 for l in v['work_order']['lines']) + sum(a['resolvedAmount'] for a in adj if a.get('scope') == 'part_line'), 2)
            rl = r.get('labor_invoiced', r.get('labor_sold')); rp = r.get('parts_invoiced')
            ok = rl is not None and abs(rl - lab) <= 0.011 and (rp is None or abs(rp - prt) <= 0.011)
            c['matches the invoice record' if ok else 'differs from the invoice record'] += 1
            if not ok and len(ex) < 8: ex.append((name[:12], num, rl, lab, rp, prt))
    out[rep] = (dict(c), ex)
    print(rep, len(bad), dict(c), ex)
