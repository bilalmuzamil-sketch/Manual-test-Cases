#!/usr/bin/env python3
"""Purchase orders and vendor invoices declared in a MANIFEST's `purchase_orders` block.

seed_po_and_invoices.py does this for the Fibridge universe, with its vendor and plan written into
the script. This is the same chain, data-driven, so any manifest can declare the orders it needs
without another copy of the script. It uses ONLY the standalone route that file proved (playbook
§O6): a purchase order raised from a work order answers 500 on receive; a standalone inventory
order is accepted.

    1. POST /api/inventory/orders/create   {vendor_id, note, items:[{id, is_core, part_number, quantity, price, description, category}]}
    2. POST /api/inventory/orders/accept   receive it  -> this IS the vendor invoice
    3. POST /api/parts-catalogue/vendor/payment/create   only if the row asks to be paid

FIND-OR-CREATE, like everything here: an order is recognised by its NOTE, which carries the row's
key, so a second run finds the first run's order instead of raising another. Receiving and paying are
each skipped when already done.

Run:  SEED_MANIFEST=seed-manifest-e2e.json python3 seed_po_from_manifest.py [--confirm]
"""
import json, os, sys, runpy
HERE = os.path.dirname(os.path.abspath(__file__))
_seed = runpy.run_path(f'{HERE}/seed.py', run_name='not_main')
_po = runpy.run_path(f'{HERE}/seed_po_and_invoices.py', run_name='not_main')
call = _seed['call']
receive, pay = _po['receive'], _po['pay']
CONFIRM = '--confirm' in sys.argv
MANIFEST = os.environ.get('SEED_MANIFEST', 'seed-manifest-e2e.json')

def coll(r):
    return ((r['json'] or {}).get('data') or {}).get('collection') or []

def vendor_id(rec):
    """By the vendor's EMAIL, which is unique, through ?search= on its name — a page of the
    unfiltered list is not the whole list (see seed_po_and_invoices.vendor_id)."""
    p = rec['create']['payload']
    r = call(f"/api/parts-catalogue/vendors?search={p['name'].split()[0]}&limit=100")
    hit = next((x for x in coll(r) if (x.get('email') or '').lower() == p['email'].lower()), None)
    if hit: return hit['id']
    if not coll(call('/api/parts-catalogue/vendors?search=Carolina&limit=10')):
        sys.exit('PROBE BROKEN - vendor ?search= returned nothing even for a vendor known to exist')
    return None

def main():
    m = json.load(open(f'{HERE}/{MANIFEST}'))
    plan = (m.get('purchase_orders') or {}).get('rows') or []
    if not plan:
        print(f'{MANIFEST}: no purchase_orders block — nothing to do'); return
    _seed['ensure_session']()
    recs = {r['key']: r for r in m['records']}
    orders = coll(call('/api/inventory/orders?limit=250'))
    deliveries = coll(call('/api/inventory/deliveries?limit=250'))
    bad = 0
    for row in plan:
        tag = f"ZZSPEC {row['key']}"
        vid = vendor_id(recs[row['vendor']])
        if not vid:
            print(f"  {row['key']:20} 🔴 vendor {row['vendor']} not found — run seed.py --confirm first"); bad += 1; continue
        order = next((o for o in orders if o.get('vendor_id') == vid and tag in (o.get('note') or '')), None)
        if not order:
            if not CONFIRM:
                print(f"  {row['key']:20} MISSING (would create)"); continue
            cp = coll(call(f"/api/parts-catalogue/catalogue-parts?search={row['part_number']}&limit=10"))
            part = next((x for x in cp if x.get('part_number') == row['part_number']), None)
            if not part:
                print(f"  {row['key']:20} 🔴 catalogue part {row['part_number']} not found"); bad += 1; continue
            body = {'vendor_id': vid, 'note': tag,
                    'items': [{'id': str(__import__('uuid').uuid4()), 'is_core': False, 'part_number': row['part_number'],
                               'quantity': row['quantity'], 'price': row['price'],
                               'description': part['name'], 'category': part.get('category')}]}
            r = call('/api/inventory/orders/create', 'POST', body)
            oid = ((r['json'] or {}).get('data') or {}).get('order_id')
            if r['status'] not in (200, 201) or not oid:
                print(f"  {row['key']:20} 🔴 orders/create {r['status']} {str(r['raw'])[:140]}"); bad += 1; continue
            orders = coll(call('/api/inventory/orders?limit=250'))
            order = next((o for o in orders if o.get('id') == oid), {'id': oid})
            print(f"  {row['key']:20} purchase order created")
        invoice = f"ZZSH-{row['key'][-6:]}".upper()[:21]
        received = any(d.get('vendor_id') == vid and d.get('invoice_number') == invoice for d in deliveries)
        if row.get('receive') and not received:
            if not CONFIRM:
                print(f"  {row['key']:20} not received yet (would receive as {invoice})"); continue
            r, _ = receive(order, vid, invoice)
            if r['status'] not in (200, 201, 'SKIP'):
                print(f"  {row['key']:20} 🔴 receive {r['status']} {str(r['raw'])[:140]}"); bad += 1; continue
            print(f"  {row['key']:20} received -> vendor invoice {invoice}")
            deliveries = coll(call('/api/inventory/deliveries?limit=250'))
        if row.get('pay') and CONFIRM:
            r, msg = pay(vid, invoice, row['pay'])
            print(f"  {row['key']:20} payment: {msg if r is None else str(r['status']) + ' ' + msg}")
        print(f"  {row['key']:20} ✅ order present{', received' if row.get('receive') else ''}")
    if bad: sys.exit(f'{bad} purchase-order row(s) could not be completed')

if __name__ == '__main__':
    main()
