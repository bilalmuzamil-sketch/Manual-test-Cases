"""Seeding helpers for the A/R and A/P aging live run (QA = V2 branch sv11315, PROD = V1).
Every endpoint here was read from the front-end API module (Rule 115):
  app/src/api/companies/index.ts, app/src/api/work-orders/index.ts, app/src/api/billing/index.ts,
  app/src/api/parts/index.ts at 8e35ee0d02 (QA) — see FINDINGS in SEEDED.md for the payload traps.
Every record is named ZZAUTOTEST. A JSON ledger (seeded-<env>.json) is the resumable checkpoint."""
import json, os, sys, time
from api import call
HERE = os.path.dirname(os.path.abspath(__file__))
EXEMPT_TAX = {'qa': '0c47b1fb-38bb-4788-8719-6900c365e34c'}
LABOUR_TYPE = {'qa': 'a2296198-4fdd-4e99-8829-a3bef455939a'}
class Ledger:
    def __init__(self, env):
        self.env = env; self.path = f'{HERE}/seeded-{env}.json'
        self.d = json.load(open(self.path)) if os.path.exists(self.path) else {}
    def get(self, k): return self.d.get(k)
    def put(self, k, v):
        self.d[k] = v; json.dump(self.d, open(self.path, 'w'), indent=1, sort_keys=True)
def ok(r, what):
    if r['status'] not in (200, 201):
        raise RuntimeError(f"{what}: HTTP {r['status']} {r['raw'][:300]}")
    return (r['json'] or {}).get('data')
def customer(env, L, key, name):
    """customer + contact + vehicle. Returns dict(id, contact, vehicle, account)."""
    c = L.get(f'cust:{key}')
    if c: return c
    d = ok(call(env, '/api/customers/create', 'POST', {"name": name, "address": "1 ZZAUTOTEST Way", "city": "Calgary",
        "state_or_province": "Alberta", "postal_code": "T2C 4M5", "phone": "(403) 555-0100", "country_code": "CA"}), 'customer')
    cid = d['company_id']
    ct = ok(call(env, '/api/contacts/create', 'POST', {"first_name": "Zed", "last_name": "Aging", "title": "AP",
        "telephone": "(403) 555-0101", "email": f"zed.{key.lower()}@zzautotest.test", "company_id": cid}), 'contact')['contact_id']
    vin = ('1ZZAT' + ''.join(ch for ch in key.upper() if ch.isalnum()) + '0000000000000')[:17]
    v = ok(call(env, '/api/vehicles/create', 'POST', {"maker_name": "Freightliner", "model_name": "Cascadia", "year": "2019",
        "unit": f"ZZT {key}"[:20], "vin": vin, "licence_plate": ("ZZ" + key)[:8], "company_id": cid, "customer_id": ct}), 'vehicle')['id']
    view = ok(call(env, f'/api/customers/view/{cid}'), 'view')['company']
    c = {'id': cid, 'name': name, 'contact': ct, 'vehicle': v, 'account': view.get('customer_account_id')}
    L.put(f'cust:{key}', c); return c
def work_order(env, c, workplace=None):
    body = {"is_vehicle_here": False, "company_id": c['id'], "vehicle_id": c['vehicle'], "customer_id": c['contact']}
    return ok(call(env, '/api/work-orders/create', 'POST', body), 'wo')['work_order_id']
def invoice(env, L, key, c, amount, created_on):
    """A tax-exempt, no-shop-supplies work order with one fixed-price line, completed and invoiced with
    created_on (the invoice's business date) = created_on (a 'YYYY-MM-DD HH:MM:SS' UTC string)."""
    rec = L.get(f'inv:{key}')
    if rec and rec.get('invoice_id'): return rec
    wo = (rec or {}).get('wo') or work_order(env, c)
    L.put(f'inv:{key}', {'wo': wo})
    ok(call(env, f'/api/work-orders/{wo}/tax', 'POST', {'tax': {'id': EXEMPT_TAX[env]}}), 'tax')
    ok(call(env, '/api/work-orders/change-shop-supplies-charge', 'POST', {'work_order_id': wo, 'shop_supplies_charge_amount': 0}), 'ss')
    line = ok(call(env, '/api/work-orders/lines/create', 'POST', {"work_order_id": wo, "line_name": f"ZZAUTOTEST {key}",
        "description": "ZZAUTOTEST aging seed", "is_diagnosis": False, "is_warranty": False, "is_authorized_to_repair": False,
        "is_parts_required_are_authorized": False, "assigned_techs": [], "logged_techs": [], "time_estimate": "60",
        "tech_time": "60", "status": "authorized", "another": False, "labour_type_id": LABOUR_TYPE[env],
        "fixed_price": str(amount)}), 'line')['line_id']
    ok(call(env, '/api/work-orders/change-mileage', 'POST', {'work_order_id': wo, 'mileage': '184320'}), 'mileage')
    ok(call(env, '/api/work-orders/lines/change-story', 'POST', {'line_id': line, 'tech_story': 'ZZAUTOTEST', 'work_order_id': wo}), 'story')
    ok(call(env, '/api/work-orders/lines/change-status', 'POST', {'line_id': line, 'status': 'complete', 'workOrderId': wo}), 'line complete')
    for s in ('approved', 'in_progress', 'ready_for_review', 'complete'):
        call(env, '/api/work-orders/change-status', 'POST', {'id': wo, 'status': s})
    d = ok(call(env, '/api/invoices/create', 'POST', {'work_order_id': wo, 'created_on': created_on}), 'invoice')
    w = ok(call(env, f'/api/work-orders/view/{wo}'), 'wo view')['work_order']
    rec = {'wo': wo, 'wo_number': w.get('number'), 'invoice_id': d.get('invoice_id') or w.get('invoice_id'),
           'account': d.get('customer_account_id') or w.get('customer_account_id'), 'total': w.get('total_cost'),
           'created_on': created_on, 'resp': {k: d.get(k) for k in ('invoice_id', 'invoice_number', 'remaining_balance') if isinstance(d, dict)}}
    L.put(f'inv:{key}', rec); return rec
