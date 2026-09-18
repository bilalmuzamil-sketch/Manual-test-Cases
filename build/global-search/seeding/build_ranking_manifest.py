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

def customer(key, name, serves, why, phone=None, city='Fernvale', address='1 Ranking Way'):
    r = {'key': key, 'type': 'Customer', 'serves': serves,
         'find': {'mode': 'search', 'list': '/api/customers', 'coll': 'collection',
                  'field': 'name', 'value': name, 'control': '4 Star Truck Repair'},
         'create': {'endpoint': '/api/customers/create',
                    'payload': {'name': name, 'address': address, 'city': city,
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
 customer('rank_q_typo', 'ZZPREFIY Cartage', [55707],
   'FUZZY: one edit from the keyword (X->Y), reachable only by fuzzy matching. Must rank LAST. '
   '🔴 It was ZZPREFIXX, which is the keyword PLUS a letter - so it STARTS with the keyword, '
   'prefix-matched, and ranked FIRST, inverting the very order the case asserts. A typo record '
   'must be one edit away AND not a prefix of, or prefixed by, the keyword.'),
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

# ══════════════════════════════════════════════════════════════════════════════════════════════
# 2026-09-18 · THE SIX NEW CASES (C55718-C55723)
#
# Read the real case bodies first (Rule 112). MOST OF WHAT THEY NEED ALREADY EXISTS, which is the
# payoff of building the kit rather than one-off records:
#
#   C55718  a work order with a known number + a role without Work Orders   -> S2-15430 + the role
#   C55719  a customer matched ONLY through a contact + no Customers access  -> ZZCONTACTONLY + role
#   C55721  a part a typo would match + no Catalog & Inventory access        -> Alternator + the role
#
# Only three things are genuinely new: a role missing TWO bundles at once, and the two ranking
# pairs below.
# ══════════════════════════════════════════════════════════════════════════════════════════════

# ── C55722 [ZZOPENCOUNT] MORE open work orders ranks above FEWER ───────────────────────────────
# The case says "many" vs "one or few", and notes the effect is log-scaled - so a gap of 5 vs 1 is
# deliberate. Two customers that would otherwise be indistinguishable: same keyword position in the
# name, same everything, differing ONLY in how many open jobs they carry.
R += [
 customer('cnt_busy', 'ZZOPENCOUNT Freight Busy', [55722],
   'FIVE open work orders. Must rank above its twin.'),
 customer('cnt_quiet', 'ZZOPENCOUNT Freight Quiet', [55722],
   'ONE open work order. Not zero - the case is "more beats fewer", not "some beats none", which '
   'C55708 already covers.'),
 {'key': 'cnt_busy_contact', 'type': 'Contact (a PERSON at a customer company)', 'serves': [55722],
  'find': {'mode': 'child', 'parent': 'cnt_busy', 'view': '/api/customers/view/{id}',
           'path': 'company.contacts', 'field': 'first_name', 'value': 'Busyowner'},
  'create': {'endpoint': '/api/contacts/create',
             'payload': {'first_name': 'Busyowner', 'last_name': 'Contact', 'title': 'Owner',
                         'telephone': '(264) 400-0010', 'email': 'busy@zzopencount.test'},
             'inject': {'company_id': 'cnt_busy'}},
  'verify': ['first_name'], '_why': 'A work order needs a contact as its customer_id.'},
 {'key': 'cnt_quiet_contact', 'type': 'Contact (a PERSON at a customer company)', 'serves': [55722],
  'find': {'mode': 'child', 'parent': 'cnt_quiet', 'view': '/api/customers/view/{id}',
           'path': 'company.contacts', 'field': 'first_name', 'value': 'Quietowner'},
  'create': {'endpoint': '/api/contacts/create',
             'payload': {'first_name': 'Quietowner', 'last_name': 'Contact', 'title': 'Owner',
                         'telephone': '(264) 400-0011', 'email': 'quiet@zzopencount.test'},
             'inject': {'company_id': 'cnt_quiet'}},
  'verify': ['first_name'], '_why': 'Same, for the quiet twin.'},
 vehicle('cnt_busy_vehicle', 'ZZCNTBUSY00000001', 'CNTB-01', 'Freightliner', 'Cascadia', 2021,
         [55722], 'Carries the five open work orders. 🔴 Its unit and VIN carry NO keyword - an '
         'asset is indexed under its OWNER\'S name, so it will answer ZZOPENCOUNT anyway; giving '
         'it the keyword too would add nothing and risk confusing the assets group.',
         owner='cnt_busy', owner_contact='cnt_busy_contact'),
 vehicle('cnt_quiet_vehicle', 'ZZCNTQUIET0000001', 'CNTQ-01', 'Freightliner', 'Cascadia', 2021,
         [55722], 'Carries the single open work order.',
         owner='cnt_quiet', owner_contact='cnt_quiet_contact'),
 {'key': 'wo_cnt_busy', 'type': 'WorkOrder', 'serves': [55722],
  'find': {'mode': 'ids', 'view': '/api/work-orders/view/{id}', 'coll': 'work_order',
           'field': 'number', 'ids': []},
  'create': {'endpoint': '/api/work-orders/create', 'payload': {'is_vehicle_here': False},
             'inject': {'company_id': 'cnt_busy', 'vehicle_id': 'cnt_busy_vehicle',
                        'customer_id': 'cnt_busy_contact'},
             'id_from': 'data.work_order_id', 'repeat': 5},
  'skip_verify': ['is_vehicle_here'],
  '_why': 'FIVE open work orders - the signal under test. Left in their created (estimate) state, '
          'which is open.'},
 {'key': 'wo_cnt_quiet', 'type': 'WorkOrder', 'serves': [55722],
  'find': {'mode': 'ids', 'view': '/api/work-orders/view/{id}', 'coll': 'work_order',
           'field': 'number', 'ids': []},
  'create': {'endpoint': '/api/work-orders/create', 'payload': {'is_vehicle_here': False},
             'inject': {'company_id': 'cnt_quiet', 'vehicle_id': 'cnt_quiet_vehicle',
                        'customer_id': 'cnt_quiet_contact'},
             'id_from': 'data.work_order_id'},
  'skip_verify': ['is_vehicle_here'],
  '_why': 'ONE open work order.'},
]

# ── C55723 [ZZNAMEBONUS] a NAME match ranks above a SECONDARY-FIELD match ──────────────────────
# 🔴 The B record's NAME must not contain the keyword, or the case proves nothing. It carries the
# keyword in its ADDRESS instead - a field the company index definitely covers (name, phone,
# address, website, plus its contacts). City was the case's "for example"; address is the one this
# estate is known to index, and the case says "for example its city or address".
R += [
 customer('nb_name', 'ZZNAMEBONUS Cartage', [55723],
   'Matched on its NAME. Must rank above the address-only match.'),
 customer('nb_secondary', 'Sterling Brothers Freight', [55723],
   'Matched ONLY on a secondary field: the keyword is in its ADDRESS and nowhere in its name. If '
   'this outranks the name match the primary-name bonus is not being applied.',
   address='40 ZZNAMEBONUS Road'),
]

# ══════════════════════════════════════════════════════════════════════════════════════════════
# 2026-09-18 · THE SEVEN ALGORITHM CASES (C55724-C55730)
#
# Read from the real case bodies, which differ from the seeding handoff's summary in two ways that
# matter:
#   · C55724 names NO records at all - it says "seed three customers, identical in every other
#     respect". The handoff's suggested names are the handoff's, not the case's. The ZZPREFIX trio
#     already satisfies it: same address, same telephone, no contacts, no open work orders.
#   · C55725 needs a record with a distinctive name and an UNRELATED query returning nothing.
#     Aabridge Freight already exists in the Fibridge universe, so this needs no new record - only
#     the negative proof, which belongs in the verifier.
# ══════════════════════════════════════════════════════════════════════════════════════════════

# ── C55726 [ZZACC] accents are ignored, both spellings find the one customer ───────────────────
R += [
 customer('acc_jose', 'ZZACC José Martínez', [55726],
   'Accents on the e and the i. BOTH the plain and the accented spelling must find this one row - '
   'so there must be exactly ONE record carrying the token, or "both find the same customer" '
   'cannot be read off the result.'),
]

# ── C55727 [ZZPUNC] a hyphen and an apostrophe are optional ────────────────────────────────────
R += [
 customer('punc_obrien', "ZZPUNC O'Brien Haulage", [55727],
   'APOSTROPHE. Must be found by ZZPUNC OBrien and by the punctuated form.'),
 customer('punc_smith', 'ZZPUNC Smith-Jones Motors', [55727],
   'HYPHEN. Must be found by ZZPUNC Smith Jones and by the punctuated form. Two records, one '
   'keyword, because the case asks for both punctuation kinds.'),
]

# ── C55728 [ZZPHON] phonetic matching is NAMES ONLY ────────────────────────────────────────────
# 🔴 The assertion is a NEGATIVE - the part must NOT come back for a sound-alike - so the control
# matters more than the record: without a customer proving the sound-alike DOES work on names, a
# miss on the part is indistinguishable from "the sound-alike simply matches nothing".
R += [
 cat_part('phon_part', 'ZZPHON-3001', 'ZZPHON Alternator Assembly', [55728],
   'The part whose DESCRIPTION carries the word. A sound-alike of "Alternator" must NOT return it.'),
 inv_part('phon_part_inv', 'phon_part', 'ZZPHON-3001', 8, [55728],
   'THE STOCK ROW. Without it the catalogue part is invisible to search - so the case would have '
   'read as "the part is correctly not returned" when the part was never findable at all, which is '
   'a pass for entirely the wrong reason.'),
 customer('phon_customer', 'ZZPHON Alternator Co', [55728],
   'THE CONTROL, and the case cannot be read without it: a NAME must still sound-alike match. If '
   'neither row comes back the sound-alike was simply wrong, not proof of names-only behaviour.'),
]

# ── C55729 [exact id beats a strong name match] ────────────────────────────────────────────────
# The customer's name must BEGIN with the same text as the work-order number, so the pinned row is
# competing against the strongest possible name match. Its real name is stamped in by the signals
# script, because the work-order number is assigned by the branch and cannot be known here.
R += [
 customer('pin_rival', 'S2-15430 Holdings', [55729],
   'Its NAME BEGINS with a real work-order number, so typing that number produces the strongest '
   'possible competing name match - and the case asserts the pinned exact-ID row still wins.\n'
   '   🔴 S2-15430 is PRE-EXISTING ESTATE DATA, deliberately: it survived the redeploy that wiped '
   'every seeded record, and it OPENS as the tester (both re-proved 2026-09-17). Naming this after '
   'one of OUR work orders would bake in a number the next redeploy changes - the stale-identifier '
   'trap this project already paid for once.'),
]

# ── C55730 [ZZBROAD] a record below the top 20 is unreachable until the query narrows ──────────
# 🔴 The scope tab caps at 20 rows with no pagination, so the broad query needs MORE than 20
# matches or the cap never bites and the case proves nothing. 21 filler + 1 target = 22.
#
# 🔴 NOT ONE of the filler names may contain "Target", or the narrowing step - which is the second
# half of the case - stops narrowing anything.
#
# Each part also needs a STOCK ROW: a catalogue part with no inventory record is not searchable at
# all, measured 2026-09-17. So this is 22 catalogue parts and 22 stock rows.
for _i in range(1, 22):
    R.append(cat_part(f'broad_{_i:02d}', f'ZZBROAD-{4000+_i}', f'ZZBROAD Widget {_i:02d}', [55730],
        'Filler. Stocked and therefore ranked ABOVE the out-of-stock target, which is what pushes '
        'the target past the 20-row cap.'))
R.append(cat_part('broad_target', 'ZZBROAD-4999', 'ZZBROAD Target Widget', [55730],
    'THE TARGET. Left OUT OF STOCK and with no activity so it ranks low and falls outside the top '
    '20 on the broad query. The narrow query "ZZBROAD Target" must then surface it - which is the '
    'half of the case that proves the record was reachable all along, just not shown.'))
for _i in range(1, 22):
    R.append(inv_part(f'broad_{_i:02d}_inv', f'broad_{_i:02d}', f'ZZBROAD-{4000+_i}', 12, [55730],
        'In stock, so it outranks the target.'))
R.append(inv_part('broad_target_inv', 'broad_target', 'ZZBROAD-4999', 0, [55730],
    'ZERO on hand - the signal that keeps the target below the fillers. It must still EXIST, or the '
    'narrowed query has nothing to surface and the case reads as a pass for the wrong reason.'))

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
