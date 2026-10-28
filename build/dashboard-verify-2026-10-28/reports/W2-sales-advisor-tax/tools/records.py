"""Independent record readers (invoice view, WO statistics) with read-through caches. SECRET-FREE."""
import json, os
from concurrent.futures import ThreadPoolExecutor
from common import get, RAW
INV_RO = '/tmp/cln/dv/inv'          # dashboard pass cache (read-only)
INV = os.path.join(RAW, 'inv'); os.makedirs(INV, exist_ok=True)
STATS = os.path.join(RAW, 'stats'); os.makedirs(STATS, exist_ok=True)

def invoice(iid, wid):
    for d in (INV_RO, INV):
        p = os.path.join(d, iid + '.json')
        if os.path.exists(p):
            j = json.load(open(p)); b = j.get('body', j)
            return b['data']['collection']
    c, b = get(f'/api/invoices/{iid}/view', [], wid)
    if c != 200: return None
    json.dump({'status': c, 'body': b}, open(os.path.join(INV, iid + '.json'), 'w'))
    return b['data']['collection']

def stats(wo, wid):
    p = os.path.join(STATS, wo + '.json')
    if os.path.exists(p):
        return json.load(open(p))['data']['collection']
    c, b = get(f'/api/work-orders/statistics/{wo}', [], wid)
    if c != 200: return None
    json.dump(b, open(p, 'w'))
    return b['data']['collection']

def stat_totals(s):
    """Totals row of each Stats-tab table -> dict."""
    if not s: return None
    t = {}
    for k in ('hours_data', 'labor_data', 'parts_data', 'total_data'):
        rows = s.get(k) or []
        tot = [r for r in rows if r.get('name') == 'Total' and not r.get('line_id')]
        t[k] = tot[0] if tot else None
        t[k + '_lines'] = [r for r in rows if r.get('line_id')]
    t['adjustments'] = s.get('adjustments')
    return t

def prefetch(pairs, fn, n=8):
    with ThreadPoolExecutor(n) as ex:
        return list(ex.map(lambda a: fn(*a), pairs))

def money(x):
    return float(str(x).replace(',', '')) if x not in (None, '') else 0.0

WOV = os.path.join(RAW, 'wov2'); os.makedirs(WOV, exist_ok=True)
CUS = os.path.join(RAW, 'cus'); os.makedirs(CUS, exist_ok=True)

def wo_view(wo, wid):
    p = os.path.join(WOV, wo + '.json')
    if os.path.exists(p): return json.load(open(p))
    c, b = get(f'/api/work-orders/view/{wo}', [], wid)
    if c != 200: return None
    d = b['data']['work_order']; keep = {k: d.get(k) for k in ('id', 'display_number', 'sales_rep_id', 'sales_rep_name', 'sales_rep_is_inactive', 'service_advisor_id', 'service_advisor_name', 'company_id', 'start_date', 'status', 'vehicle')}
    json.dump(keep, open(p, 'w')); return keep

def customer_view(cid, wid):
    p = os.path.join(CUS, cid + '.json')
    if os.path.exists(p): return json.load(open(p))
    c, b = get(f'/api/customers/view/{cid}', [], wid)
    if c != 200: return None
    s = json.dumps(b)
    d = (b.get('data') or {}).get('company') or {}
    keep = {k: d.get(k) for k in ('id', 'name', 'sales_rep_id', 'sales_rep_first_name', 'sales_rep_last_name')} if isinstance(d, dict) else {}
    json.dump(keep, open(p, 'w')); return keep

WOL_RO = '/tmp/cln/dv/wol'
WOL = os.path.join(RAW, 'wol'); os.makedirs(WOL, exist_ok=True)

def wo_lines(wo, wid, fresh=False):
    """WO lines incl. clock records (task_records) — GET /api/work-orders/lines/{woId}."""
    for d in ((WOL,) if fresh else (WOL_RO, WOL)):
        p = os.path.join(d, wo + '.json')
        if os.path.exists(p): return json.load(open(p))['data']['collection']
    c, b = get(f'/api/work-orders/lines/{wo}', [], wid)
    if c != 200: return None
    json.dump(b, open(os.path.join(WOL, wo + '.json'), 'w'))
    return b['data']['collection']

PAY = os.path.join(RAW, 'pay'); os.makedirs(PAY, exist_ok=True)

def account_payments(acc, wid):
    """Every payment on a customer account — GET /api/customer-payment/list?accountId= (paged)."""
    p = os.path.join(PAY, acc + '.json')
    if os.path.exists(p): return json.load(open(p))
    out, pg = [], 1
    while True:
        c, b = get('/api/customer-payment/list', [('accountId', acc), ('pagination[page]', pg), ('pagination[rowsPerPage]', 100)], wid)
        if c != 200: return None
        col = b['data']['collection']; out += col
        if len(col) < 100: break
        pg += 1
    json.dump(out, open(p, 'w')); return out
