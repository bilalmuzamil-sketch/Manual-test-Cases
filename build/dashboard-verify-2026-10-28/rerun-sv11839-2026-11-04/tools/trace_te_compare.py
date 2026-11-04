#!/usr/bin/env python3
"""Per-line comparison: report expanded clockedTime vs the work order's own clock records for the same technician. SECRET-FREE."""
import json, glob, collections, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from oracle_te_prd import recs, lines
summary = []
for f in sorted(glob.glob('/tmp/cln/dvqa/out/te_expanded_*.json')):
    row = json.load(open(f))['data']['collection'][0]; sid_t = row['technicianId']
    diffs = []; tot_rep = tot_mine = 0
    for ln in row['lines']:
        ls = lines(ln['workOrderId']) or []
        l = next((x for x in ls if x.get('id') == ln['lineId'] or x.get('line_id') == ln['lineId']), None)
        mine = None
        if l is not None:
            mine = 0.0; staff = None
            for sid, nm, h in recs(l):
                # technicianId is the technician record id; recs() yields staff_id — match by name as fallback
                if nm == row['technician'] or sid == sid_t: mine += h
            mine = round(mine, 2)
        tot_rep += ln['clockedTime']; tot_mine += (mine or 0)
        if mine is None or abs(ln['clockedTime'] - mine) > 0.005:
            diffs.append({'wo': ln['invoiceDisplayNumber'], 'line': ln['lineName'].strip()[:40], 'status': (l or {}).get('status'), 'report': ln['clockedTime'], 'mine': mine, 'invoiceDate': ln['invoiceDate']})
    summary.append({'technician': row['technician'], 'report_total': row['technicianClockedHours'], 'sum_report_lines': round(tot_rep, 2), 'sum_mine_lines': round(tot_mine, 2), 'n_lines': len(row['lines']), 'diffs': diffs})
    print(row['technician'], 'total', row['technicianClockedHours'], 'Σrep', round(tot_rep, 2), 'Σmine', round(tot_mine, 2), 'diff lines', len(diffs))
    for d in diffs[:6]: print('   ', d)
json.dump(summary, open('/tmp/cln/dvqa/out/trace_te_compare.json', 'w'), indent=1)
