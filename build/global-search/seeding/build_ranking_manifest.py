#!/usr/bin/env python3
"""GENERATE seed-manifest-ranking.json — the RANKING (6726) + FUZZY-remainder (6725) universe.

🔴 NEVER HAND-EDIT THE JSON. It is generated; a hand edit is lost on the next run.

THE DESIGN RULE FOR THIS UNIVERSE
    ONE DISTINCTIVE KEYWORD PER CASE, carried in the NAME of that case's 2-3 records, and those
    records DIFFER IN EXACTLY ONE SIGNAL. Nothing else on the branch matches the keyword.

    That is what makes an ordering assertion trustworthy. A ranking check run against shared data
    cannot be read: if twenty rows match, the tester cannot tell whether the order is the ranking
    rule working or the rest of the estate's noise. With a private keyword and one varied signal,
    the expected order is the only order the rule can produce.

    Measured 2026-09-17 before writing this: every keyword below returns NOTHING on sv9160, so each
    one is genuinely private to its case.

    🔴 THE KEYWORDS MUST BE FAR APART IN EDIT DISTANCE, NOT MERELY DIFFERENT STRINGS.
    The first attempt used ZZRANKQ, ZZRANKC, ZZRANKV, ZZRANKN, ZZRANKT, ZZRANKI, ZZRANKP, ZZRANKF -
    which differ by ONE CHARACTER. The search is deliberately fuzzy, so every one of them matched
    every other one: each keyword returned the same eight customers and the same two vendors, and
    the "private keyword" property - the entire basis for reading a ranking result - was gone.
    It failed silently: the records were all created, all verified present, and all field-checked
    clean. Only searching for them exposed it, which is why "the record exists" is never "the search
    returns it".
    So the tokens below are whole distinct words. A scheme of <PREFIX><letter> is exactly wrong for
    a fuzzy search, however tidy it looks in a table.

SCOPE OF THIS FILE
    The records that can be created directly - customers, contacts, vehicles, vendors, parts.
    Work orders, purchase orders and vendor invoices are DEPENDENT records with their own proven
    chains (set_wo_statuses.py, seed_po_and_invoices.py) and are layered on top afterwards.
"""
import json, os

def customer(key, name, serves, why, phone=None, city='Fernvale'):
    r = {'key': key, 'type': 'Customer', 'serves': serves,
         'find': {'mode': 'search', 'list': '/api/customers', 'coll': 'collection',
                  'field': 'name', 'value': name, 'control': '4 Star Truck Repair'},
         'create': {'endpoint': '/api/customers/create',
                    'payload': {'name': name, 'address': '1 Ranking Way', 'city': city,
                                'state_or_province': 'Ohio', 'postal_code': '44872-2001',
                                'phone': phone or '(264) 400-0000', 'country_code': 'US'}},
         'verify': ['name', 'city'],
         # The record reads these back under different names; without the mapping the seeder
         # reports them as NOT COMPARED, which is honest but useless - it means the field was
         # written and never checked.
         'read_as': {'phone': 'telephone', 'address': 'address_1'},
         'write': {'endpoint': '/api/customers/change', 'whole_record': True},
         '_why': why}
    return r

def vehicle(key, vin, unit, maker, model, year, serves, why,
            owner='rank_owner', owner_contact='rank_owner_contact'):
    """🔴 AN ASSET NEEDS AN OWNER AT CREATE TIME. /api/vehicles/create answers
    400 {"customer_id":"Missing required parameter","company_id":"Missing required parameter"}
    without one. The existing gs-v2 manifest attaches the owner in its REPAIR step instead, which
    means those records were created before the API required it - so copying that manifest's create
    payload is not enough, and this is exactly why the seeder creates through the real endpoints and
    reads the refusal rather than assuming a shape still works."""
    return {'key': key, 'type': 'Vehicle', 'serves': serves,
            'find': {'mode': 'search', 'list': '/api/vehicles', 'coll': 'collection',
                     'field': 'vin', 'value': vin, 'control': None},
            'create': {'endpoint': '/api/vehicles/create',
                       'payload': {'maker_name': maker, 'model_name': model, 'year': year,
                                   'unit': unit, 'vin': vin, 'licence_plate': unit},
                       # 🔴 customer_id and company_id are DIFFERENT ENTITIES. The backend's
                       # CreateCommand maps customer_id to a `Customer` and company_id to a
                       # `Company` (api/src/VehicleService/Vehicles/Application/HTTP/Create/
                       # CreateCommand.php), so passing the company's id for both answers
                       # 400 {"customer_id":"Not found"} - a refusal that reads like a missing
                       # record when it is really a wrong TYPE of id. The Customer is the contact.
                       'inject': {'customer_id': owner_contact, 'company_id': owner}},
            'verify': ['vin', 'unit'],
            'write': {'endpoint': '/api/vehicles/change', 'whole_record': True},
            '_why': why}

def vendor(key, name, serves, why):
    return {'key': key, 'type': 'Vendor', 'serves': serves,
            'find': {'mode': 'search', 'list': '/api/parts-catalogue/vendors', 'coll': 'collection',
                     'field': 'name', 'value': name, 'control': 'Carolina Truck'},
            'create': {'endpoint': '/api/parts-catalogue/add-vendor',
                       'payload': {'name': name, 'address_1': '2 Ranking Road', 'city': 'Fernvale',
                                   'state_or_province': 'Ohio', 'postal_code': '44872-2001',
                                   'telephone': '(264) 400-0001', 'email': 'ap@zzrank.test',
                                   'credit_term': 'Net 30', 'credit_limit': 5000,
                                   },
                       # 🔴 tax_id is a UUID REFERENCE to a tax record, not a tax number: a plain
                       # string answers 400 {"tax_id":"Invalid UUID"}. Hardcoding the id would rot
                       # on the next redeploy, so take it off a vendor that already carries one -
                       # when the lookup table is not exposed, the existing data IS the lookup table.
                       'resolve_by_example': {'tax_id': {
                           'list': '/api/parts-catalogue/vendors', 'match_field': 'name',
                           'value': 'Carolina Truck & Trailer Repair',
                           'take': 'tax_id', 'take_as': 'tax_id'}}},
            'verify': ['name'],
            'write': {'endpoint': '/api/parts-catalogue/vendors/change', 'whole_record': True},
            '_why': why}

def cat_part(key, number, name, serves, why):
    return {'key': key, 'type': 'CataloguePart', 'serves': serves,
            'find': {'mode': 'search', 'list': '/api/parts-catalogue/catalogue-parts',
                     'coll': 'collection', 'field': 'part_number', 'value': number,
                     'control': '21-361'},
            'create': {'endpoint': '/api/parts-catalogue/add-catalogue-part',
                       'payload': {'name': name, 'part_number': number, 'tags': ['ZZAUTOTEST']}},
            'verify': ['part_number', 'name'],
            '_why': why}

def inv_part(key, cat_key, number, qty, serves, why):
    """🔴 A CATALOGUE PART IS NOT SEARCHABLE ON ITS OWN. Both ZZSTOCKPART and ZZPARTBUSY returned
    NOTHING after their catalogue parts were created and verified present - the search indexes the
    INVENTORY record, so a catalogue part with no stock row is invisible. Measured 2026-09-17.

    The bin location cannot be conjured by name either, so it is lifted off a part that already sits
    in one - the same "existing data is the lookup table" move the rest of the kit uses."""
    return {'key': key, 'type': 'InventoryPart', 'depends_on': cat_key, 'serves': serves,
            'find': {'mode': 'search', 'list': '/api/inventory/parts', 'coll': 'collection',
                     'field': 'part_number', 'value': number, 'control': 'P550848'},
            'create': {'endpoint': '/api/inventory/parts/create',
                       'payload': {'quantity': qty, 'cost': 19.5, 'tags': [],
                                   'min': 5, 'max': 200, 'sell_price': 39.99},
                       'resolve_by_example': {'catalog_part_id': {
                           'list': '/api/parts-catalogue/catalogue-parts', 'coll': 'collection',
                           'match_field': 'part_number', 'value': number,
                           'take': 'id', 'take_as': 'catalog_part_id',
                           'also_take': {'category_id': 'category'}}},
                       'resolve_nested': {'bins': {
                           'list': '/api/inventory/parts', 'coll': 'collection',
                           'search': 'P550848', 'take_path': 'binLocations.0.binLocationId',
                           'template': [{'id': '@', 'isDefault': True, 'quantity': qty}]}},
                       'id_from': 'data.part_id'},
            'verify': ['part_number'],
            'skip_verify': ['tags', 'bins', 'catalog_part_id', 'sell_price', 'cost',
                            'quantity', 'min', 'max'],
            '_why': why}


R = []

# ── C55707 [ZZPREFIX] prefix > whole-word > fuzzy ──────────────────────────────────────────────
# Three customers, ONE keyword, differing ONLY in where/how the keyword sits in the name.
R += [
 customer('rank_q_prefix', 'ZZPREFIX Freight Ltd', [55707],
   'PREFIX: the name STARTS with the keyword. Must rank first.'),
 customer('rank_q_whole', 'Bolton ZZPREFIX Services', [55707],
   'WHOLE WORD mid-name. Must rank below the prefix match and above the typo.'),
 customer('rank_q_typo', 'ZZPREFIXX Cartage', [55707],
   'FUZZY: one edit from the keyword, so it is reachable only by fuzzy matching. Must rank last.'),
]

# ── C55708 [ZZCUSTOPEN] a customer with an open work order outranks one without ───────────────────
R += [
 customer('rank_c_open', 'ZZCUSTOPEN Haulage Open', [55708],
   'Gets an OPEN work order attached in the dependent pass. Must rank above its twin.'),
 customer('rank_c_none', 'ZZCUSTOPEN Haulage Quiet', [55708],
   'Deliberately NO work order and never opened. The control.'),
]

# The asset cases need an owner, and the owner's NAME must NOT carry the keyword - otherwise the
# keyword stops being private to the two assets and the assets group is no longer the only thing the
# query can rank. Declared before the vehicles because `inject` resolves through seeded state.
R += [customer('rank_owner', 'Fernvale Asset Holdings', [55709],
   'Owner for the ZZASSETLIFT assets. Deliberately carries NO keyword, so searching ZZASSETLIFT returns the '
   'two assets and nothing else.')]

R += [{'key': 'rank_owner_contact', 'type': 'Contact (a PERSON at a customer company)',
       'serves': [55709],
       'find': {'mode': 'child', 'parent': 'rank_owner', 'view': '/api/customers/view/{id}',
                'path': 'company.contacts', 'field': 'first_name', 'value': 'Fernvale'},
       'create': {'endpoint': '/api/contacts/create',
                  'payload': {'first_name': 'Fernvale', 'last_name': 'Holder',
                              'title': 'Fleet Manager', 'telephone': '(264) 400-0003',
                              'email': 'fleet@fernvale-asset.test'},
                  'inject': {'company_id': 'rank_owner'}},
       'verify': ['first_name'],
       '_why': 'The Customer entity the asset create requires. Its name carries no keyword, so it '
               'cannot pollute the ZZASSETLIFT assets group.'}]

# ── C55709 [ZZASSETLIFT] an asset on an open work order outranks a newer one that is idle ──────────
R += [
 vehicle('rank_v_open', 'ZZASSETLIFT000001', 'ZZASSETLIFT-01', 'Freightliner', 'Cascadia', 2019, [55709],
   'Older model year ON AN OPEN WORK ORDER. Must still outrank the newer idle one - which is the '
   'whole point: the open-work-order lift beats the model-year tiebreak.'),
 vehicle('rank_v_idle', 'ZZASSETLIFT000002', 'ZZASSETLIFT-02', 'Freightliner', 'Cascadia', 2025, [55709],
   'NEWER model year, no work order, never opened. If this ranks first the lift is not applied.'),
]

# ── C55710 [ZZVENDORPO] a vendor with open purchase orders outranks one with none ─────────────────
R += [
 vendor('rank_n_open', 'ZZVENDORPO Supply Open', [55710],
   'Gets OPEN purchase orders in the dependent pass. Must rank above its twin.'),
 vendor('rank_n_none', 'ZZVENDORPO Supply Quiet', [55710],
   'Deliberately NO purchase orders. The control.'),
]

# ── C55716 [ZZTIEBREAK] a tie broken by which was updated more recently ───────────────────────────
R += [
 customer('rank_t_older', 'ZZTIEBREAK Transport One', [55716],
   'Created first and NOT touched again. Otherwise identical to its twin.'),
 customer('rank_t_newer', 'ZZTIEBREAK Transport Two', [55716],
   'Identical match quality, but UPDATED LAST by the seeder, so it must win the tie.'),
]

# ── C44852 [ZZSTOCKPART] in stock ranks above out of stock (out of stock NOT hidden) ───────────────
R += [
 cat_part('rank_i_instock', 'ZZSTOCKPART-1001', 'ZZSTOCKPART Brake Drum In Stock', [44852],
   'Stocked to a positive quantity in the dependent pass. Must rank above the out-of-stock twin.'),
 cat_part('rank_i_outstock', 'ZZSTOCKPART-1002', 'ZZSTOCKPART Brake Drum Out Of Stock', [44852],
   'Left at zero on hand. 🔴 It must still APPEAR - the case asserts out-of-stock is ranked lower, '
   'NOT hidden. A missing row here is a different (and reportable) behaviour from a low row.'),
]

# ── C55712 [ZZPARTBUSY] a part with recent activity outranks a quiet one ──────────────────────────
R += [
 cat_part('rank_p_active', 'ZZPARTBUSY-2001', 'ZZPARTBUSY Alternator Active', [55712],
   'Sold/used and viewed in the dependent pass. Must rank above the quiet twin.'),
 cat_part('rank_p_quiet', 'ZZPARTBUSY-2002', 'ZZPARTBUSY Alternator Quiet', [55712],
   'Same stock state, no activity. Isolates recent-activity from in-stock-vs-out.'),
]

# ── C45139 [ZZCONTACTONLY] a customer matched ONLY through its contact ───────────────────────────────
# 🔴 The company name must NOT contain the searched value, or the case proves nothing.
R += [
 customer('rank_f_company', 'Northgate Cartage Company', [45139],
   'The COMPANY NAME deliberately contains neither ZZCONTACTONLY nor the contact phone. The only route '
   'to this record is its contact - which is exactly what the case measures.',
   phone='(264) 400-0002'),
 {'key': 'rank_f_contact', 'type': 'Contact (a PERSON at a customer company)', 'serves': [45139],
  'find': {'mode': 'child', 'parent': 'rank_f_company', 'view': '/api/customers/view/{id}',
           'path': 'company.contacts', 'field': 'first_name', 'value': 'Zzrankf'},
  'create': {'endpoint': '/api/contacts/create',
             'payload': {'first_name': 'Zzrankf', 'last_name': 'Oyelaran', 'title': 'Fleet Manager',
                         'telephone': '(264) 400-0199', 'email': 'zzrankf@northgate-cartage.test'},
             'inject': {'company_id': 'rank_f_company'}},
  'verify': ['first_name', 'telephone'],
  '_why': 'Carries the ZZCONTACTONLY token and a distinctive phone. Searching either must return the '
          'COMPANY, flagged as a contact match.'},
]

# ── C55713 [ZZFUZZLEN] a very short query must not produce noisy fuzzy matches ──────────────────────
# The case needs BOTH halves or it cannot distinguish "short queries are stricter" from "nothing
# matched anyway": a 2-3 letter name one edit from the query, and a 4+ letter name one edit from it.
R += [
 customer('fz_short', 'ZZFUZZLEN Ab Cartage', [55713],
   'SHORT token "Ab" - two letters. Querying "Ac" (one edit) must NOT drag it in.'),
 customer('fz_long', 'ZZFUZZLEN Abcde Logistics', [55713],
   'LONG token "Abcde" - five letters. Querying "Abcdf" (one edit) SHOULD find it. The contrast '
   'between these two rows is the whole case.'),
]

# ── the stock rows that make the parts findable at all ────────────────────────────────────────
R += [
 inv_part('rank_i_instock_inv', 'rank_i_instock', 'ZZSTOCKPART-1001', 40, [44852],
   'POSITIVE quantity. Must rank above the zero-quantity twin.'),
 inv_part('rank_i_outstock_inv', 'rank_i_outstock', 'ZZSTOCKPART-1002', 0, [44852],
   'ZERO on hand. 🔴 It must still be RETURNED - the case asserts out-of-stock ranks lower, not '
   'that it disappears. A missing row here is a different and reportable behaviour.'),
 inv_part('rank_p_active_inv', 'rank_p_active', 'ZZPARTBUSY-2001', 25, [55712],
   'Same stock state as its twin, so stock cannot explain any ordering difference. The activity '
   'signal is applied in the dependent pass.'),
 inv_part('rank_p_quiet_inv', 'rank_p_quiet', 'ZZPARTBUSY-2002', 25, [55712],
   'Identical stock, no activity. The control that isolates recent-activity from in-stock.'),
]

# ── THE SIGNALS: the second half of five ranking cases ────────────────────────────────────────
# Records alone do not make a ranking case runnable. Two rows that match a keyword identically
# cannot pass or fail - only the DIFFERENCE between them is under test, so these apply it.
R += [
 {'key': 'rank_c_open_contact', 'type': 'Contact (a PERSON at a customer company)', 'serves': [55708],
  'find': {'mode': 'child', 'parent': 'rank_c_open', 'view': '/api/customers/view/{id}',
           'path': 'company.contacts', 'field': 'first_name', 'value': 'Custopen'},
  'create': {'endpoint': '/api/contacts/create',
             'payload': {'first_name': 'Custopen', 'last_name': 'Contact', 'title': 'Owner',
                         'telephone': '(264) 400-0004', 'email': 'open@zzcustopen.test'},
             'inject': {'company_id': 'rank_c_open'}},
  'verify': ['first_name'],
  '_why': 'A work order needs a contact as its customer_id. Named without the keyword so it cannot '
          'add a row to the customers group the case counts.'},

 vehicle('rank_c_open_vehicle', 'ZZWOVEH0000000001', 'WOVEH-01', 'Freightliner', 'Cascadia',
         2020, [55708],
         'The open work order needs an asset. Deliberately NOT a ZZASSETLIFT vehicle - giving one '
         'of those an open work order would break C55709, whose whole point is that only ONE of '
         'its two assets has one. 🔴 And its unit/VIN carry NO keyword either: named CUSTOPEN-01 '
         'at first, it matched ZZCUSTOPEN and added an asset row to a customers-ranking case.',
         owner='rank_c_open', owner_contact='rank_c_open_contact'),

 {'key': 'wo_custopen', 'type': 'WorkOrder', 'serves': [55708],
  'find': {'mode': 'ids', 'view': '/api/work-orders/view/{id}', 'coll': 'work_order',
           'field': 'number', 'ids': [],
           '_why': '?search= is broken on /api/work-orders, so these are verified by the ids the '
                   'seeder captured at create time.'},
  'create': {'endpoint': '/api/work-orders/create',
             'payload': {'is_vehicle_here': False},
             'inject': {'company_id': 'rank_c_open', 'vehicle_id': 'rank_c_open_vehicle',
                        'customer_id': 'rank_c_open_contact'},
             'id_from': 'data.work_order_id'},
  'skip_verify': ['is_vehicle_here'],
  '_why': 'THE SIGNAL for C55708: an OPEN work order on ZZCUSTOPEN Haulage Open and none on its '
          'twin. Left in its created (estimate) state, which is open.'},

 {'key': 'wo_assetlift', 'type': 'WorkOrder', 'serves': [55709],
  'find': {'mode': 'ids', 'view': '/api/work-orders/view/{id}', 'coll': 'work_order',
           'field': 'number', 'ids': []},
  'create': {'endpoint': '/api/work-orders/create',
             'payload': {'is_vehicle_here': False},
             'inject': {'company_id': 'rank_owner', 'vehicle_id': 'rank_v_open',
                        'customer_id': 'rank_owner_contact'},
             'id_from': 'data.work_order_id'},
  'skip_verify': ['is_vehicle_here'],
  '_why': 'THE SIGNAL for C55709: the 2019 asset is on an open work order, the 2025 is not. The '
          'case asserts that lift beats the newer model year.'},
]

MANIFEST = {
 '_README': 'Global Search RANKING (6726) + fuzzy remainder (6725) on sv9160. Everything ZZAUTOTEST-'
            'adjacent and disposable. Generated by build_ranking_manifest.py - never hand-edited.',
 'environment': {'workplace_name_hint': 'Staging Heavy Duty'},
 '_THE_DESIGN_RULE': 'One distinctive keyword per case, carried by that case\'s 2-3 records only, '
                     'which differ in EXACTLY ONE signal. Verified private: every keyword returned '
                     'NOTHING on sv9160 on 2026-09-17 before these records were created.',
 '_DEPENDENT_PASS': 'Work orders, purchase orders, vendor invoices and stock levels are layered on '
                    'afterwards by the chain scripts; the records here are their anchors.',
 'records': R,
}

if __name__ == '__main__':
    here = os.path.dirname(os.path.abspath(__file__))
    out = os.path.join(here, 'seed-manifest-ranking.json')
    json.dump(MANIFEST, open(out, 'w'), indent=1)
    print(f"wrote {out} — {len(R)} records, "
          f"{len({s for r in R for s in r['serves']})} cases served")
