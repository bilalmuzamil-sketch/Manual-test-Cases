#!/usr/bin/env python3
"""Seeds the PURCHASE ORDERS and VENDOR INVOICES half of the Fibridge universe, which the
declarative manifest cannot express because it is a STATEFUL CHAIN, not a set of records.

Nine cases live or die on this file: C44899 and C45130 (purchase orders), C44900, C45131 and
C45138 (vendor invoices and the payment badge), C45137 (PO ranking), and C44814/C44815/C44830
(the all-eight-types query, which is simply wrong if two of the eight groups are empty).

THE CHAIN, and the trap at every step (playbook §O6):
  1. a work order line          POST /api/work-orders/{wo}/lines/create-from-canned-line
                                🔴 pick a canned line with total_parts == 0, or the line can never
                                   complete ("Line can`t be completed with unfulfilled part requests")
  2. a VENDOR part request      POST /api/work-orders/part/make-request  (part_category_id required)
  3. 🔴 ASSIGN THE VENDOR       POST /api/work-orders/part/change-request {id, vendor_id}
                                WITHOUT THIS, STEP 4 ANSWERS 500 - not 400, not a message, a 500,
                                which reads exactly like a broken endpoint. Cost: the first hour of
                                this chain. The request is born with vendor_id null even though it
                                is already status authorized_to_order, so nothing on the record
                                warns you.
  4. order it                   POST /api/work-orders/part/perform-request-status-action
                                {part_request_id, action:'order'}  -> CREATES THE PURCHASE ORDER
  5. receive it                 POST /api/inventory/orders/accept    -> CREATES THE VENDOR INVOICE
                                (a delivery IS the vendor invoice; there is no /api/vendor-invoices)

  🔴 STEP 5 ANSWERS 500 FOR A PURCHASE ORDER RAISED FROM A WORK ORDER, AND 201 FOR A STANDALONE
     INVENTORY ONE. Measured 2026-09-16 on v26.36.7-21b4db9, five times, with the credit term
     corrected, real bin allocations supplied, and a part number that already existed in the
     catalogue - every work-order PO rolled back with a bare 500 and no delivery, while the very
     same payload against a PO created by POST /api/inventory/orders/create was accepted at once.
     The difference is the work order: the handler ends with refreshTouchedWorkOrders(), which a
     standalone inventory PO never reaches. RECORDED AS A SUSPECTED PRODUCT DEFECT, NOT WORKED
     AROUND SILENTLY - the seed takes the inventory route because it needs vendor invoices to
     exist, and the handoff names the work-order route as a thing to file.

  SO THE INVOICE ROUTE IS:
  5a. a standalone PO             POST /api/inventory/orders/create
                                  {vendor_id, note, items:[{id(a fresh uuid), is_core, part_number,
                                   quantity, price, description, category}]}
                                  🔴 the DTO property is `vendor` but the REQUEST KEY is `vendor_id`
  5b. receive it                  POST /api/inventory/orders/accept   -> 201
  6. pay it                     POST /api/parts-catalogue/vendor/payment/create
                                part of the balance -> partially_paid; all of it -> paid

Run:  python3 seed_po_and_invoices.py [--confirm]
      SEED_PROFILE=/tmp/prod/cookies.json SEED_WORKPLACE="Trucks Hill 2" python3 … --confirm
"""
import json, os, sys, runpy, datetime, uuid

HERE = os.path.dirname(os.path.abspath(__file__))
os.environ.setdefault('SEED_MANIFEST', 'seed-manifest-gs-v2.json')
_seed = runpy.run_path(f'{HERE}/seed.py', run_name='not_main')
call, ENV, IDS_FILE = _seed['call'], _seed['ENV_LABEL'], _seed['IDS_FILE']
CONFIRM = '--confirm' in sys.argv
STATE_PATH = f'{HERE}/po-invoices-gsv2-{ENV}.json'
VENDOR_NAME = 'ZZAUTOTEST Fibridge Mining'

# What the cases need, and nothing more. Each row becomes one purchase order.
#   'leave_ordered' -> C45137 needs at least one PO still Ordered, never received
#   'pay' = None | 'partial' | 'full'  -> C44900 needs Unpaid, Partially paid AND Paid side by side
# 'route': 'work_order' raises the PO from a work-order part request (the only route that produces
# a PO carrying a work-order number, which C45137's ranking compares); 'stock' raises a standalone
# inventory PO, the only route that can be RECEIVED on this build.
PLAN = [
    {'tag': 'po_ordered',   'pn': 'ZZT-FIB-PO-A', 'route': 'work_order',
     'desc': 'ZZAUTOTEST Fibridge Mining Brake Kit',
     'qty': 4, 'cost': 60.0, 'sell': 120.0, 'receive': False, 'pay': None},
    {'tag': 'inv_unpaid',   'pn': 'ZZT-FIB-1001', 'route': 'stock',
     'desc': 'ZZAUTOTEST Fibridge Brake Shoe Kit',
     'qty': 2, 'cost': 45.0, 'sell': 90.0,  'receive': True,  'pay': None},
    {'tag': 'inv_partial',  'pn': 'ZZT-FIB-1002', 'route': 'stock',
     'desc': 'ZZAUTOTEST Fibridge Wheel Seal',
     'qty': 5, 'cost': 20.0, 'sell': 40.0,  'receive': True,  'pay': 'partial'},
    {'tag': 'inv_paid',     'pn': 'ZZT-FIB-1003', 'route': 'stock',
     'desc': 'ZZAUTOTEST Fibridge Air Dryer Cartridge',
     'qty': 3, 'cost': 30.0, 'sell': 60.0,  'receive': True,  'pay': 'full'},
]

def load():
    try: return json.load(open(STATE_PATH))
    except Exception: return {}

def save(d): json.dump(d, open(STATE_PATH, 'w'), indent=1)

def vendor_id():
    """🔴 AN UNFILTERED PAGE IS NOT THE WHOLE LIST. /api/parts-catalogue/vendors?limit=250 returns
    a PAGE - the branch holds far more vendors than that - so scanning it and finding nothing means
    'not on this page', never 'not on this branch'. The first version of this function concluded the
    vendor did not exist while it was sitting there (Rule 110b: identity, not a count)."""
    r = call('/api/parts-catalogue/vendors?search=Fibridge&limit=100')
    for x in (r['json'] or {}).get('data', {}).get('collection') or []:
        if x.get('name') == VENDOR_NAME: return x['id']
    # control: prove ?search= works here before believing the miss
    c = call('/api/parts-catalogue/vendors?search=Carolina&limit=10')
    if not ((c['json'] or {}).get('data', {}).get('collection') or []):
        sys.exit('PROBE BROKEN - ?search= on /api/parts-catalogue/vendors returned nothing even for '
                 'a vendor known to exist; the miss above proves nothing')
    return None

def work_order_ids():
    """🔴 ONE PURCHASE ORDER PER WORK ORDER + VENDOR. Every vendor part request raised on the SAME
    work order for the SAME vendor joins that work order's existing purchase order rather than
    opening a new one - measured 2026-09-16, when four plan rows all landed inside S-17630 and the
    script correctly reported 'ordered but no new PO appeared'. Four purchase orders therefore need
    four DIFFERENT work orders."""
    ids = json.load(open(f'{HERE}/{IDS_FILE}'))
    lst = ids.get('work_orders_fib_main') or []
    if not lst: sys.exit('no seeded work orders - run seed.py --confirm first')
    return lst

def zero_part_canned_line():
    r = call('/api/work-orders/canned-lines')
    cl = (r['json'] or {}).get('data', {}).get('collection') or []
    free = [c for c in cl if not c.get('total_parts')]
    if not free: sys.exit('no canned line without parts')
    return free[0]['id']

def category_id():
    r = call('/api/inventory/categories')
    return ((r['json'] or {}).get('data', {}).get('collection') or [{}])[0].get('value')

def orders_by_vendor(vid):
    r = call('/api/inventory/orders?limit=250')
    return [x for x in ((r['json'] or {}).get('data', {}).get('collection') or [])
            if x.get('vendor_id') == vid]

def deliveries_by_vendor(vid):
    r = call('/api/inventory/deliveries?limit=250')
    return [x for x in ((r['json'] or {}).get('data', {}).get('collection') or [])
            if x.get('vendor_id') == vid]

def make_stock_po(vid, row):
    """A PURCHASE ORDER WITH NO WORK ORDER. This is the only route on this build that can be
    received (see the 500 note at the top), so every row that needs a vendor invoice uses it."""
    cp = call(f"/api/parts-catalogue/catalogue-parts?search={row['pn']}&limit=10")
    match = next((x for x in (cp['json'] or {}).get('data', {}).get('collection') or []
                  if x.get('part_number') == row['pn']), None)
    if not match:
        return None, f"catalogue part {row['pn']} not found - run seed.py --confirm first"
    body = {'vendor_id': vid, 'note': f"ZZAUTOTEST Fibridge Mining stock order ({row['tag']})",
            'items': [{'id': str(uuid.uuid4()), 'is_core': False, 'part_number': row['pn'],
                       'quantity': row['qty'], 'price': row['cost'],
                       'description': match['name'], 'category': match.get('category')}]}
    r = call('/api/inventory/orders/create', 'POST', body)
    if r['status'] not in (200, 201):
        return None, f"orders/create {r['status']} {str(r['raw'])[:160]}"
    oid = ((r['json'] or {}).get('data') or {}).get('order_id')
    return oid, 'ok'


def make_po(wo, line, cat, vid, row):
    body = {'line': line, 'work_order': wo, 'description': row['desc'], 'quantity': row['qty'],
            'part_source_type': 'vendor', 'part_number': row['pn'],
            'sell_price': row['sell'], 'cost': row['cost'], 'part_category_id': cat}
    r = call('/api/work-orders/part/make-request', 'POST', body)
    if r['status'] not in (200, 201):
        return None, f"make-request {r['status']} {str(r['raw'])[:120]}"
    pr = ((r['json'] or {}).get('data') or {}).get('part_request') or {}
    prid = pr.get('id')
    # 🔴 the step whose absence answers 500 two calls later
    rv = call('/api/work-orders/part/change-request', 'POST', {'id': prid, 'vendor_id': vid})
    if rv['status'] not in (200, 201):
        return None, f"assign-vendor {rv['status']} {str(rv['raw'])[:120]}"
    ro = call('/api/work-orders/part/perform-request-status-action', 'POST',
              {'part_request_id': prid, 'action': 'order'})
    if ro['status'] not in (200, 201):
        return None, f"order {ro['status']} {str(ro['raw'])[:160]}"
    return prid, 'ok'

def receive(order, vid, invoice_number):
    """POST /api/inventory/orders/accept — the shape is NOT what it looks like, and every one of
    these was learned from the 400 body plus AcceptDeliveryRequestDto @ 21b4db9:

      * `items` is a **JSON STRING**, not an array (the DTO validates it with #[Json] and then
        json_decodes it). Sending a real array answers "Something went wrong with parts order data".
      * each item needs **`part_number`** and **`quantity_received`** — `delivered` is not a field,
        and a zero total answers "Nothing to receive."
      * `invoice_date` must match **`Y-m-d\TH:i:s.v\Z`** exactly, e.g. 2026-09-16T00:00:00.000Z.
        A plain date answers "This value is not a valid datetime."
      * `total` and `tax` are required floats; `id` is the ORDER id (MapEntity field 'id').
      * `order_status` must be `fulfilled` or `ordered` — which is also how a PARTIAL delivery is
        made, by receiving some quantity and leaving the status `ordered`.
      * the invoice number is capped at **21 characters**.

    🔴 AND THE ONE THAT IS NOT IN THIS CALL AT ALL: the VENDOR's `credit_term` must be a CreditTerms
    string code ("Net 30", "COD", …). add-vendor accepts the integer 30, answers 201 and stores
    "30"; nothing complains until accept-delivery computes the due date through
    CreditTerms::getDueDate and dies, rolling the whole receive back with a bare 500 and no
    delivery. An hour went into bin allocations and the QuickBooks sync before the actual cause,
    which was two calls earlier and in a different record.
    """
    d = call(f"/api/inventory/orders/{order['id']}")
    o = ((d['json'] or {}).get('data') or {}).get('order') or {}
    # A received part becomes an INVENTORY part, and an inventory part must land in a bin. The bin
    # cannot be created by name here, so it is read off an existing stocked part - the same trick
    # the manifest uses for its inventory records.
    b = call('/api/inventory/parts?search=P550848&limit=5')
    brow = ((b['json'] or {}).get('data', {}).get('collection') or [{}])[0]
    binid = ((brow.get('binLocations') or [{}])[0] or {}).get('binLocationId')
    items, total = [], 0.0
    for it in o.get('items') or []:
        qty = float(it.get('quantity_remaining') or it.get('quantity_ordered') or 0)
        if qty <= 0: continue
        price = float(it.get('price') or 0)
        total += qty * price
        items.append({'order_item_id': it.get('order_item_id'),
                      'part_number': it.get('part_number'),
                      'quantity_received': qty,
                      'price': price,
                      'price_decimal': str(it.get('price_decimal') or price),
                      'sell_price': str(it.get('sell_price') or price),
                      'core_charge': '0',
                      'category': it.get('category'),
                      'description': it.get('description'),
                      'binLocations': ([{'id': binid, 'isDefault': True, 'quantity': qty}]
                                       if binid else [])})
    if not items:
        return {'status': 'SKIP', 'raw': b'nothing left to receive'}, None
    body = {'id': order['id'],
            'invoice_number': invoice_number[:21],
            'note': 'ZZAUTOTEST seed',
            'total': round(total, 2),
            'tax': 0,
            'items': json.dumps(items),
            'invoice_date': datetime.datetime.now(datetime.timezone.utc)
                                     .strftime('%Y-%m-%dT%H:%M:%S.000Z'),
            'order_status': 'fulfilled'}
    r = call('/api/inventory/orders/accept', 'POST', body)
    return r, body

def pay(vid, invoice_number, how):
    v = call(f'/api/parts-catalogue/vendor/{vid}')
    acc = (((v['json'] or {}).get('data') or {}).get('vendor') or {}).get('vendor_account_id')
    if not acc: return None, 'no vendor_account_id'
    u = call(f'/api/parts-catalogue/vendor/transactions/list-unpaid-by-vendor-account'
             f'?accountId={acc}&pagination[page]=1&pagination[rowsPerPage]=100')
    rows = (((u['json'] or {}).get('data') or {}).get('response') or {}).get('collection') or []
    row = next((x for x in rows if x.get('invoice_number') == invoice_number), None)
    if not row: return None, f'no unpaid transaction for invoice {invoice_number}'
    bal = float(row.get('balance') or 0)
    amount = round(bal / 2, 2) if how == 'partial' else bal
    if amount <= 0: return None, f'balance is {bal}, nothing to pay'
    pm = call('/api/parts-catalogue/vendor/transactions/payment-methods')
    methods = (pm['json'] or {}).get('data', {}).get('collection') or []
    if not methods: return None, 'no payment methods'
    today = datetime.date.today().isoformat()
    body = {'account_id': acc, 'primary_id': None, 'ibs_batch_id': None, 'payment_date': today,
            'payment_method': methods[0].get('code') or methods[0].get('id'),
            'reference_number': f'ZZT-{how.upper()}-{invoice_number}',
            'description': 'ZZAUTOTEST seed payment', 'new_credit': 0, 'new_deposit': 0,
            'payment_amount': amount,
            'transactions': [dict(row, transaction_payment_amount=amount, index=0)],
            'applied_deposits': [], 'applied_credits': []}
    r = call('/api/parts-catalogue/vendor/payment/create', 'POST', body)
    return r, f'paid {amount} of {bal} ({how})'

def finish(st, tag, rec, row, order, vid):
    """The receive-and-pay tail, shared by the create path and the resume path."""
    if row['receive'] and not rec.get('invoice_number'):
        invno = f"ZZT-INV-{row['pn'][-1]}"
        r, _ = receive(order, vid, invno)
        ok = r['status'] in (200, 201)
        print(f"       receive -> {r['status']}" + ('' if ok else f"  {str(r['raw'])[:220]}"))
        if ok: rec['invoice_number'] = invno
    if row['pay'] and rec.get('invoice_number') and not rec.get('pay_result'):
        pr, msg = pay(vid, rec['invoice_number'], row['pay'])
        rec['pay_result'] = (f"{pr['status']} {msg}" if pr else f'FAILED {msg}')
        print(f"       pay({row['pay']}) -> {rec['pay_result']}"
              + ('' if (pr and pr['status'] in (200, 201)) else f"  {str((pr or {}).get('raw'))[:220]}"))
    st[tag] = rec; save(st)


def main():
    st = load()
    vid = vendor_id()
    if not vid: sys.exit(f'vendor {VENDOR_NAME!r} not found - run seed.py --confirm first')
    print(f'vendor {VENDOR_NAME} = {vid}')
    have_orders = orders_by_vendor(vid)
    have_invs = deliveries_by_vendor(vid)
    print(f'MEASURED: {len(have_orders)} purchase order(s), {len(have_invs)} vendor invoice(s) '
          f'already on this vendor')
    for o in have_orders: print(f"   PO  {o.get('order_number'):12} {o.get('status')}")
    for d in have_invs:   print(f"   INV {str(d.get('invoice_number')):16} {d.get('order_number')}")

    wos, cat, used = work_order_ids(), category_id(), 0
    for row in PLAN:
        tag = row['tag']
        rec = st.get(tag) or {}
        # 🔴 RESUME, DO NOT SKIP. "The purchase order exists" is not "the row is finished" - a row
        # that wants receiving and paying is only done when it HAS an invoice number and a recorded
        # payment. The first version skipped on order_number alone, so a run that created five POs
        # and failed every receive reported all five rows "already seeded" on the retry and the
        # vendor-invoice group stayed empty. Same shape as the "6 of 7 present" report this whole
        # seeder exists to prevent.
        done = bool(rec.get('order_number')) \
            and (not row['receive'] or rec.get('invoice_number')) \
            and (not row['pay'] or rec.get('pay_result'))
        if done:
            print(f"  {tag:14} complete -> PO {rec['order_number']} "
                  f"inv {rec.get('invoice_number')} pay={rec.get('pay_result')}")
            continue
        if rec.get('order_number') and CONFIRM:
            # the PO half is done; pick up at receive/pay
            order = next((o for o in orders_by_vendor(vid) if o['id'] == rec.get('order_id')), None)
            if order is None:
                print(f"  {tag:14} 🔴 recorded PO {rec.get('order_number')} is gone - clearing "
                      f"the row so the next run rebuilds it")
                st.pop(tag, None); save(st); continue
            print(f"  {tag:14} resuming at receive  (PO {rec['order_number']})")
            finish(st, tag, rec, row, order, vid)
            continue
        if not CONFIRM:
            print(f'  {tag:14} would create'); continue
        if row['route'] == 'stock':
            before = {o['id'] for o in orders_by_vendor(vid)}
            oid, how = make_stock_po(vid, row)
            if not oid: print(f'  {tag:14} 🔴 {how}'); continue
            order = next((o for o in orders_by_vendor(vid) if o['id'] == oid), None)
            if order is None: print(f'  {tag:14} 🔴 created {oid} but it is not in the list'); continue
            rec = {'order_id': oid, 'order_number': order.get('order_number'),
                   'status': order.get('status'), 'route': 'stock'}
            print(f"  {tag:14} ✅ PO {rec['order_number']} ({rec['status']}, standalone inventory)")
            finish(st, tag, rec, row, order, vid)
            continue
        # a fresh work order per purchase order - see work_order_ids()
        existing = {o.get('workOrderId') for o in orders_by_vendor(vid)}
        wo = next((w for w in wos[used:] if w not in existing), None)
        used = (wos.index(wo) + 1) if wo else used
        if wo is None: print(f'  {tag:14} 🔴 no unused work order left'); continue
        lr = call(f'/api/work-orders/{wo}/lines/create-from-canned-line', 'POST',
                  {'canned_line_id': zero_part_canned_line(), 'status': 'authorized'})
        line = ((lr['json'] or {}).get('data') or {}).get('line_id')
        if not line:
            print(f"  {tag:14} 🔴 line create {lr['status']} {str(lr['raw'])[:120]}"); continue
        print(f'  {tag:14} work order {wo[:8]}  line {str(line)[:8]}')
        before = {o['id'] for o in orders_by_vendor(vid)}
        prid, how = make_po(wo, line, cat, vid, row)
        if not prid: print(f'  {tag:14} 🔴 {how}'); continue
        after = orders_by_vendor(vid)
        new = [o for o in after if o['id'] not in before]
        if not new: print(f'  {tag:14} 🔴 ordered but no new PO appeared'); continue
        order = new[0]
        rec = {'part_request_id': prid, 'order_id': order['id'],
               'order_number': order.get('order_number'), 'status': order.get('status'),
               'route': 'work_order'}
        print(f"  {tag:14} ✅ PO {rec['order_number']} ({rec['status']}, from work order)")
        finish(st, tag, rec, row, order, vid)

    print('\n=== READ BACK from the search index (never from what we just POSTed) ===')
    s = call('/api/search?q=Fib')
    for g in ((s['json'] or {}).get('data') or {}).get('groups') or []:
        if g['type'] in ('purchase_orders', 'vendor_invoices'):
            ours = [i for i in g['items'] if VENDOR_NAME in str(i.get('secondary'))]
            print(f"  {g['type']:18} total={g['total']:3}  ours={len(ours)}")
            for i in ours:
                f = i.get('fields') or {}
                print(f"      {str(i.get('primary')):18} {f.get('status') or f.get('paymentStatus')}")
    if CONFIRM: print(f'\nstate: {STATE_PATH}')

main()
