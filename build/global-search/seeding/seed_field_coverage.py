#!/usr/bin/env python3
"""Seeds the SEVEN fields that no record on an environment happens to fill in.

WHY THIS EXISTS. Eleven rows of the result-integrity suite said "FIND THE DATA FIRST" on production,
not because the records were missing but because no record ANYWHERE filled in the field the case
tests — no part had a manufacturer, no work-order line had a distinctive part, no vendor contact had
a findable phone. A case like that is runnable but slow, and a tester hunting for data usually picks
a value that also appears in the name, which makes the case prove nothing.

Two of the eleven (CUST-B2, CUST-C9) already had data and only needed wiring, so they are not here.

WHAT IT CREATES, and which case each serves:
  SRI-PART-C2   a catalogue part with a distinctive MANUFACTURER   (resolveOrCreate by name)
  SRI-PART-C5   the same part with a distinctive TAG
  SRI-WO-C4     a work-order line whose part DESCRIPTION is distinctive  -> item_part_names
  SRI-WO-C5     the same line's PART NUMBER                              -> item_part_numbers
  SRI-PO-C1     a purchase order carrying that part number              -> item_part_numbers
  SRI-PO-C2     the same PO's part description                          -> item_part_names
  SRI-VEND-C3   a vendor contact with a distinctive TELEPHONE           -> contact_phones

🔴 EVERY ENDPOINT HERE WAS READ, NOT GUESSED (Rule 115):
  parts-catalogue/change-catalogue-part   — ChangeCommandHandler passes manufacturer_id through
                                            ManufacturerResolver::resolveOrCreate, so a NAME works
  work-orders/{id}/lines/create-from-canned-line, work-orders/part/make-request,
  inventory/orders/create, parts-catalogue/add-vendor-contact — all proven in
  seed_po_and_invoices.py and app/src/api/parts/index.ts.

Measures first, creates only the difference, and PROVES each one through the search itself — because
"the record exists" is not "the feature can find it".

    SEED_PROFILE=/tmp/prod/creds.json SEED_WORKPLACE="Trucks Hill 2" python3 seed_field_coverage.py --confirm
"""
import importlib.util, json, os, sys, time, uuid

HERE = os.path.dirname(os.path.abspath(__file__))
CONFIRM = '--confirm' in sys.argv
sys.argv = ['seed.py']
_s = importlib.util.spec_from_file_location('seedmod', f'{HERE}/seed.py')
m = importlib.util.module_from_spec(_s); _s.loader.exec_module(m)
call = m.call
ENV = m.ENV_LABEL
STATE = f'{HERE}/field-coverage-{ENV}.json'

# Distinctive values. Each lives in exactly ONE field of its record, so a hit is attributable.
PN     = 'ZZFIELDPN-7781'
PNAME  = 'ZZFIELDPART Alternator Housing'
MAKER  = 'ZZMAKERTON'
TAG    = 'ZZTAGWORD'
PHONE  = '(264) 777-0181'


def search_rows(q):
    r = call('/api/search?q=' + str(q).replace(' ', '%20').replace('&', '%26'))
    d = (r['json'] or {}).get('data') or {}
    return [(g['type'], (i.get('match') or {}).get('field'), i.get('primary'))
            for g in (d.get('groups') or []) for i in (g.get('items') or [])]


def already(term, group, field):
    return [x for x in search_rows(term) if x[0] == group and x[1] == field]


def step(label, fn):
    print(f'\n---- {label}')
    try:
        return fn()
    except SystemExit:
        raise
    except Exception as e:
        print(f'  🔴 {type(e).__name__}: {e}')
        return None


def catalogue_part():
    """The part SRI-PART-C2 and C5 need. Find-or-create, then set manufacturer and tag."""
    r = call(f'/api/parts-catalogue/catalogue-parts?search={PN}&limit=10')
    coll = ((r['json'] or {}).get('data') or {}).get('collection') or []
    hit = next((x for x in coll if x.get('part_number') == PN), None)
    if not hit:
        if not CONFIRM:
            print(f'  would create catalogue part {PN}'); return None
        c = call('/api/parts-catalogue/add-catalogue-part', 'POST',
                 {'name': PNAME, 'part_number': PN, 'tags': [TAG]})
        print(f'  add-catalogue-part -> {c["status"]}')
        r = call(f'/api/parts-catalogue/catalogue-parts?search={PN}&limit=10')
        coll = ((r['json'] or {}).get('data') or {}).get('collection') or []
        hit = next((x for x in coll if x.get('part_number') == PN), None)
    if not hit:
        print('  🔴 could not create or find the catalogue part'); return None
    print(f'  catalogue part {PN} = {hit["id"]}')
    if CONFIRM:
        # manufacturer_id is passed through ManufacturerResolver::resolveOrCreate, so a NAME works
        ch = call('/api/parts-catalogue/change-catalogue-part', 'POST',
                  {'id': hit['id'], 'name': PNAME, 'part_number': PN,
                   'manufacturer_id': MAKER, 'tags': [TAG]})
        print(f'  change-catalogue-part (manufacturer={MAKER!r}, tag={TAG!r}) -> {ch["status"]}'
              + ('' if ch['status'] in (200, 201) else f'  {str(ch["raw"])[:140]}'))
    return hit


def stock_it(cat_part):
    """A catalogue part with no inventory row is invisible to search — documented behaviour."""
    r = call(f'/api/inventory/parts?search={PN}&limit=5')
    coll = ((r['json'] or {}).get('data') or {}).get('collection') or []
    if coll:
        print(f'  inventory row already present ({coll[0]["id"]})'); return coll[0]
    if not CONFIRM:
        print('  would create the inventory row'); return None
    # borrow a bin and a category off existing data — the lookup tables are not exposed
    b = call('/api/inventory/parts?limit=100')
    rows = ((b['json'] or {}).get('data') or {}).get('collection') or []
    binid = next((x.get('binLocations', [{}])[0].get('binLocationId')
                  for x in rows if (x.get('binLocations') or [{}])[0].get('binLocationId')), None)
    # 🔴 THE CATEGORY LIST IS /api/inventory/categories — /api/parts-catalogue/categories 404s.
    # Passing None for category_id does not fail politely: inventory/parts/create answers
    # "Missing required parameter", and work-orders/part/make-request answers the much more
    # confusing "Part request not found." Both were this one missing id.
    cats = call('/api/inventory/categories')
    catid = cat_part.get('category_id') or next(
        (x['value'] for x in (((cats['json'] or {}).get('data') or {}).get('collection') or [])), None)
    body = {'catalog_part_id': cat_part['id'], 'category_id': catid,
            'quantity': 4, 'cost': 25.5, 'sell_price': 49.99, 'min': 1, 'max': 9, 'tags': [TAG],
            'purchase_price': 25.5}
    if binid:
        body['bins'] = [{'id': binid, 'isDefault': True, 'quantity': 4}]
    c = call('/api/inventory/parts/create', 'POST', body)
    print(f'  inventory/parts/create -> {c["status"]}'
          + ('' if c['status'] in (200, 201) else f'  {str(c["raw"])[:160]}'))
    return c


def work_order_line():
    """SRI-WO-C4 / C5 — a work-order line carrying a distinctive part description and number.

    🔴 THE CANNED LINE MUST HAVE total_parts == 0, or the line can never be completed. Recorded in
    seed_po_and_invoices.py and repeated here rather than rediscovered.
    """
    if already(PNAME.split()[0], 'work_orders', 'item_part_names'):
        print('  a work order already answers on item_part_names'); return True
    ids = json.load(open(f'{HERE}/seed-ids-gsv2-{ENV}.json'))
    wo = (ids.get('work_orders_fib_main') or [None])[0]
    if not wo:
        print('  🔴 no seeded work order to attach a line to'); return None
    if not CONFIRM:
        print(f'  would add a line + part request to work order {wo}'); return None
    cl = call('/api/work-orders/canned-lines')
    free = [x for x in ((cl['json'] or {}).get('data') or {}).get('collection') or []
            if not x.get('total_parts')]
    if not free:
        print('  🔴 no canned line without parts'); return None
    ln = call(f'/api/work-orders/{wo}/lines/create-from-canned-line', 'POST',
              {'canned_line_id': free[0]['id'], 'status': 'authorized'})
    line = ((ln['json'] or {}).get('data') or {}).get('line_id') \
        or ((ln['json'] or {}).get('data') or {}).get('id')
    print(f'  create-from-canned-line -> {ln["status"]}  line={line}')
    if not line:
        print(f'   {str(ln["raw"])[:170]}'); return None
    cats = call('/api/inventory/categories')     # NOT parts-catalogue/categories, which 404s
    cat = (((cats['json'] or {}).get('data') or {}).get('collection') or [{}])[0].get('value')
    if not cat:
        print('  🔴 no category available — make-request would answer "Part request not found"')
        return None
    pr = call('/api/work-orders/part/make-request', 'POST',
              {'line': line, 'work_order': wo, 'description': PNAME, 'quantity': 1,
               'part_source_type': 'vendor', 'part_number': PN, 'sell_price': 49.99,
               'cost': 25.5, 'part_category_id': cat})
    print(f'  part/make-request -> {pr["status"]}'
          + ('' if pr['status'] in (200, 201) else f'  {str(pr["raw"])[:170]}'))
    return pr['status'] in (200, 201)


def purchase_order():
    """SRI-PO-C1 / C2 — a purchase order whose line carries the part number and description."""
    if already(PN, 'purchase_orders', 'item_part_numbers'):
        print('  a purchase order already answers on item_part_numbers'); return True
    if not CONFIRM:
        print('  would create a stock purchase order carrying the part'); return None
    v = call('/api/search?q=ZZSOFTHIT')
    vid = next((i.get('id') for g in (((v['json'] or {}).get('data') or {}).get('groups') or [])
                if g['type'] == 'vendors' for i in (g.get('items') or [])), None)
    if not vid:
        print('  🔴 no seeded vendor to raise the order against'); return None
    body = {'vendor_id': vid, 'note': f'ZZAUTOTEST field-coverage stock order ({PN})',
            'items': [{'id': str(uuid.uuid4()), 'is_core': False, 'part_number': PN,
                       'quantity': 2, 'price': 25.5, 'description': PNAME, 'category': None}]}
    r = call('/api/inventory/orders/create', 'POST', body)
    print(f'  inventory/orders/create -> {r["status"]}'
          + ('' if r['status'] in (200, 201) else f'  {str(r["raw"])[:170]}'))
    return r['status'] in (200, 201)


def vendor_contact_phone():
    """SRI-VEND-C3 — a vendor contact whose TELEPHONE is findable."""
    if already(PHONE, 'vendors', 'contact_phones'):
        print('  a vendor already answers on contact_phones'); return True
    v = call('/api/search?q=ZZHIDDEN')
    vid = next((i.get('id') for g in (((v['json'] or {}).get('data') or {}).get('groups') or [])
                if g['type'] == 'vendors' for i in (g.get('items') or [])), None)
    if not vid:
        print('  🔴 no seeded vendor found'); return None
    if not CONFIRM:
        print(f'  would add a contact with telephone {PHONE} to vendor {vid}'); return None
    # endpoint and required fields read from app/src/api/parts/index.ts (Rule 115):
    # department and telephone are REQUIRED even though the TS type marks them optional
    r = call('/api/parts-catalogue/add-vendor-contact', 'POST',
             {'vendor_id': vid, 'first_name': 'ZZPHONEREP', 'last_name': 'RowCheck',
              'email': 'zzphonerep@zzresultintegrity.test', 'telephone': PHONE,
              'title': 'Parts Rep', 'department': 'preferred'})
    print(f'  add-vendor-contact -> {r["status"]}'
          + ('' if r['status'] in (200, 201) else f'  {str(r["raw"])[:170]}'))
    return r['status'] in (200, 201)


def prove():
    """Nothing counts until the SEARCH returns it on the right field."""
    print('\n=== PROOF — through the feature\'s own interface ===')
    want = [('SRI-PART-C2', MAKER, 'parts', 'manufacturer'),
            ('SRI-PART-C5', TAG, 'parts', 'tags'),
            ('SRI-WO-C4', PNAME.split()[0], 'work_orders', 'item_part_names'),
            ('SRI-WO-C5', PN, 'work_orders', 'item_part_numbers'),
            ('SRI-PO-C1', PN, 'purchase_orders', 'item_part_numbers'),
            ('SRI-PO-C2', PNAME.split()[0], 'purchase_orders', 'item_part_names'),
            ('SRI-VEND-C3', PHONE, 'vendors', 'contact_phones')]
    proven, out = 0, {}
    for case, term, grp, fld in want:
        hit = None
        for attempt in range(4):          # production indexes slowly; wait before condemning
            hit = already(term, grp, fld)
            if hit:
                break
            time.sleep(15)
        if hit:
            proven += 1
            out[case] = {'term': term, 'group': grp, 'field': fld, 'primary': hit[0][2]}
            print(f'  ✅ {case:13} type {term!r:32} -> {str(hit[0][2])[:34]}  ({fld})')
        else:
            print(f'  🔴 {case:13} type {term!r:32} -> still nothing on {fld}')
    json.dump(out, open(STATE, 'w'), indent=1)
    print(f'\n  {proven} of {len(want)} field(s) now answer on {ENV}; written to '
          f'{os.path.basename(STATE)}')
    return proven == len(want)


def main():
    # 🔴 SET THE WORKPLACE FIRST. Without it, work-orders/part/make-request answers
    # 400 "Part request not found." — which reads like a payload problem and is not one: it is
    # PartRequestNotAccessibleError, raised when the work order is not in the session's CURRENT
    # workplace, and worded opaquely ON PURPOSE so a caller cannot tell "exists in a sibling
    # workplace" from "does not exist" (api/.../MovePartSaleRequestDto.php). The PO and the vendor
    # contact are not scoped that way, which is why they succeeded while this one did not.
    m.ensure_session()
    print(f'=== FIELD COVERAGE — {ENV} ===' + ('' if CONFIRM else '   (DRY RUN — pass --confirm)'))
    cp = step('catalogue part + manufacturer + tag', catalogue_part)
    if cp:
        step('stock it, or search cannot see it', lambda: stock_it(cp))
    step('work-order line with a distinctive part', work_order_line)
    step('purchase order carrying that part', purchase_order)
    step('vendor contact with a findable telephone', vendor_contact_phone)
    if CONFIRM:
        ok = prove()
        sys.exit(0 if ok else 1)
    print('\nDRY RUN — nothing written.')


if __name__ == '__main__':
    main()
