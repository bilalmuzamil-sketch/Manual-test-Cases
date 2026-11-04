#!/usr/bin/env python3
"""Layer C3b — independent worked hours (Billing Efficiency / Advisor Analysis) and Technician Efficiency.

Clock records come from each work order's OWN line records (task_records: staff, start, end), not from the
report queries. PRD v53 §4 + S3-R2:
  worked hours  = "the time technicians actually clocked, from their time records"
  Tech Eff.     = invoiced technician hours / clocked hours; "Each work order line's technician time is split across
                  the technicians who worked it, in proportion to each technician's share of the clocked time on that line."
Population for TE: work orders whose invoice (non-void, as listed by Sales) was created in the range — the PRD says
"for the selected range" and nothing narrower; any narrower rule the build applies shows up as a difference.
SECRET-FREE. Output /tmp/cln/dv/out/oracle_te.json + summary.
"""
import json, os, collections, datetime as dt

W = {'b3c8c820-f815-4cf1-8938-10956c5ee71a': 'Staging Heavy Duty - 9919', 'f8a8b802-7780-4b16-bf10-343caeb616b2': 'Staging Lethbridge - 4310',
     '25a0d576-b371-4b82-bef4-41ba977f31c2': 'QB Location', '39522bc6-abca-4f67-bd12-2840043c2d68': 'DVI Test'}
NOW = dt.datetime.now(dt.timezone.utc).timestamp()
out = {'worked': [], 'te': []}


def lines(wo):
    p = f'/tmp/cln/dv/wol/{wo}.json'
    if not os.path.exists(p): return None
    w = json.load(open(p)); d = w.get('data', w); ls = d.get('collection', d) if isinstance(d, dict) else d
    return ls


def recs(l):
    tr = l.get('task_records') or {}
    for r in (tr.values() if isinstance(tr, dict) else tr):
        s = r['start_date']['timestamp']; e = r['end_date']['timestamp'] if r.get('end_date') else NOW
        yield r['staff_id'], r.get('name'), max(0.0, (e - s) / 3600)


for wid, name in W.items():
    # ---------------- worked hours per SAA row (per work order) ----------------
    for lab in ('this_month', 'last_month', 'last_12_months'):
        saa = json.load(open(f'/tmp/cln/dv/rep/{wid}/{lab}__saa.json'))['body']['data']['collection']
        for r in saa:
            ls = lines(r['work_order_id'])
            if ls is None: continue
            mine = round(sum(round(h, 2) for l in ls if l['status'] != 'authorization_declined' for _, _, h in recs(l)), 2)
            out['worked'].append({'location': name, 'range': lab, 'invoice': r['invoice_number'], 'report': r['hours_worked'], 'oracle': mine,
                                  'result': 'PASS' if abs((r['hours_worked'] or 0) - mine) < 0.03 else 'FAIL'})
    # ---------------- Technician Efficiency per technician ----------------
    for lab in ('this_month', 'last_month', 'last_quarter', 'last_12_months'):
        sales = json.load(open(f'/tmp/cln/dv/rep/{wid}/{lab}__sales.json'))['body']['data']['collection']
        wos = {r['work_order_id'] for r in sales if not r['is_credit']}
        tech, clk, names = collections.Counter(), collections.Counter(), {}
        for wo in wos:
            ls = lines(wo)
            if not ls or ls[0]['work_order_status'] not in ('invoiced', 'paid'): continue
            for l in ls:
                if l['status'] == 'authorization_declined': continue
                per = collections.Counter()
                for sid, nm, h in recs(l): per[sid] += h; names[sid] = nm
                tot = sum(per.values())
                for sid, h in per.items():
                    clk[sid] += round(h, 2)
                    if tot >= 0.01: tech[sid] += round(h / tot * (l['tech_time'] or 0) / 60, 2)
        te = {r['technicianId']: r for r in json.load(open(f'/tmp/cln/dv/rep/{wid}/{lab}__te.json'))['body']['data']['collection']}
        for sid in set(tech) | set(clk) | set(te):
            r = te.get(sid)
            rt, rc = (r['technicianTechHours'], r['technicianClockedHours']) if r else (0, 0)
            ok = abs(rt - tech[sid]) < 0.05 and abs(rc - clk[sid]) < 0.05
            out['te'].append({'location': name, 'range': lab, 'technician': (r or {}).get('technician') or names.get(sid), 'report_tech': rt, 'oracle_tech': round(tech[sid], 2),
                              'report_clocked': rc, 'oracle_clocked': round(clk[sid], 2), 'result': 'PASS' if ok else 'FAIL'})

json.dump(out, open('/tmp/cln/dv/out/oracle_te.json', 'w'), indent=0)
for k in ('worked', 'te'):
    v = out[k]; print(k, len(v), collections.Counter(x['result'] for x in v))
    for x in [x for x in v if x['result'] == 'FAIL'][:10]: print('   ', {a: b for a, b in x.items() if a != 'result'})
