#!/usr/bin/env python3
"""GENERATE seed-manifest-result-integrity.json — data for the Search Results Integrity suite.

Suite: build/search-results-integrity/ (110 cases, all nine search tabs).
Tickets behind it: SV-10619, SV-10551, both on story SV-9170.

🔴 NEVER HAND-EDIT THE JSON. It is generated; a hand edit is lost on the next run.

THE DESIGN RULE, WRITTEN BEFORE THE RECORDS (skill 20, step 3)
    Every record here exists to make ONE row-display question answerable, and carries its
    distinctive value in EXACTLY ONE field — so when a row comes back, the match can be attributed
    to that field and to nothing else. A value that leaks into a second field destroys the case it
    was built for: the row then had another reason to appear, and Rule 110's attribution leg fails.

THE CENTRAL SHAPE: TWO RECORDS THAT DIFFER ONLY AT THE END OF A LONG NAME
    The QA lead stated the damage as: type 123786 and a row showing only 786 is indistinguishable
    from one for 185786. So the twin records carry a LONG name whose only difference is the trailing
    digits. If the row truncates — SV-10619's "9…" — the tester literally cannot tell them apart,
    and the defect proves itself. This one shape serves A1, A2, A3, B1, B2 and G2 on every tab.

🔴 KEYWORD CHOICE WAS MEASURED, NOT GUESSED, AND TWO CANDIDATES WERE REJECTED
    `ZZTWIN` already returned 2 customers and `ZZPAIRFOX` returned 3 — neither existed as a record,
    they were FUZZY hits against the estate's other ZZ… names. Short ZZ keywords collide with the
    existing seed estate by similarity, which is exactly how a "private" keyword stops being
    private. Every keyword below was measured at 0 rows on staging on 2026-09-29, against a live
    control ('Gibson' → 16 rows) proving the search was answering rather than silently empty.

🔴 THE CONTROL IN THE `find` BLOCKS IS A STAGING CONTROL, NOT THE QA BRANCH'S
    '4 Star Truck Repair' — the control the other manifests use — returns ZERO on staging. A control
    that returns nothing proves nothing, so this manifest uses one that exists here.
"""
import json, os

# All measured at 0 rows on staging, 2026-09-29.
TWIN   = 'ZZLONGROW'       # the long twin names, differing only in the trailing digits
HIDDEN = 'ZZHIDDEN'        # values that live ONLY in a field the row does not display
SOFT_A = 'ZZSOFTHIT'       # typed by the tester
SOFT_B = 'ZZSOFTHIY'       # the record that must come back as a SOFT match
NOUNIT = 'ZZNOUNIT'        # a vehicle carrying no unit number
PROV   = 'ZZQUEBEXA'       # a province value distinctive enough to be attributable
TAG    = 'ZZAUTOTEST'
CONTROL = 'Gibson'         # exists on staging; see the header note

A_NUM, B_NUM = '123786', '185786'
LONG_CUST = 'Heavy Haulage And Trailer Repair Services Of Greater Fernvale'
LONG_VEND = 'Industrial Parts And Equipment Supply Company Of Greater Fernvale'
LONG_PART = 'Heavy Duty Air Brake Chamber Kit For Tractor Trailer Applications'

FLAT = dict(city='Fernvale', addr='21 Result Row Way', postal='44872-9001',
            phone='(264) 400-0900')
R = []

def customer(key, name, serves, why, state='Ohio', address=None, phone=None, find_by=None):
    # 🔴 THE FINDER MUST KEY ON SOMETHING UNIQUE, AND FOR THE B2 PAIR THE NAME IS DELIBERATELY NOT.
    # Both halves of the identical-name pair searched on `name`, so the second one FOUND THE FIRST,
    # reported itself present, and was never created - leaving one record where the case needs two,
    # with the second's address written over the first's. `find_by` lets the name stay identical
    # while the finder keys on the address, which differs.
    ff, fv = (find_by or ('name', name))
    return {'key': key, 'type': 'Customer', 'serves': serves,
            'find': {'mode': 'search', 'list': '/api/customers', 'coll': 'collection',
                     'field': ff, 'value': fv, 'control': CONTROL},
            'create': {'endpoint': '/api/customers/create',
                       'payload': {'name': name, 'address': address or FLAT['addr'],
                                   'city': FLAT['city'], 'state_or_province': state,
                                   'postal_code': FLAT['postal'], 'phone': phone or FLAT['phone'],
                                   'country_code': 'US'}},
            'verify': ['name', 'city'],
            'read_as': {'phone': 'telephone', 'address': 'address_1'},
            'write': {'endpoint': '/api/customers/change', 'whole_record': True}, '_why': why}

def contact(key, parent, first, serves, why, email=None):
    # 🔴 EVERY CONTACT GETS ITS OWN EMAIL. All three originally shared one default address, and the
    # search then answered a query for the twin's contact with the HIDDEN owner's company - three
    # records, one value, no way to attribute a hit to any of them. That is the very failure this
    # suite tests for, reproduced in its own fixtures; the verifier caught it on the first run.
    return {'key': key, 'type': 'Contact', 'depends_on': parent, 'serves': serves,
            'find': {'mode': 'child', 'parent': parent, 'view': '/api/customers/view/{id}',
                     'path': 'company.contacts', 'field': 'first_name', 'value': first},
            'create': {'endpoint': '/api/contacts/create',
                       'payload': {'first_name': first, 'last_name': 'RowCheck', 'title': 'Owner',
                                   'telephone': FLAT['phone'],
                                   'email': email or f'{first.lower()}@zzresultintegrity.test'},
                       'inject': {'company_id': parent}},
            'verify': ['first_name'], '_why': why}

def vendor(key, name, serves, why, email=None, address_2=None, address_1=None, find_by=None):
    # Same trap as customers above: the identical-name pair cannot be found by name.
    p = {'name': name, 'address_1': address_1 or FLAT['addr'], 'city': FLAT['city'],
         'state_or_province': 'Ohio', 'postal_code': FLAT['postal'],
         'telephone': FLAT['phone'], 'email': email or 'ap@zzresultintegrity.test',
         'credit_term': 'Net 30', 'credit_limit': 5000}
    if address_2: p['address_2'] = address_2
    return {'key': key, 'type': 'Vendor', 'serves': serves,
            'find': {'mode': 'search', 'list': '/api/parts-catalogue/vendors', 'coll': 'collection',
                     'field': (find_by or ('name', name))[0], 'value': (find_by or ('name', name))[1],
                     'control': CONTROL},
            'create': {'endpoint': '/api/parts-catalogue/add-vendor', 'payload': p,
                       # 🔴 BORROW tax_id FROM A VENDOR THAT ALREADY EXISTS, never from the one
                       # being created. Pointing this at `name` was a chicken-and-egg: the record
                       # whose tax_id we need is the record we are about to create, so it resolved
                       # to nothing and every vendor died on
                       # 400 {"tax_id":"Missing required parameter"}. Same example the working
                       # manifests use.
                       'resolve_by_example': {'tax_id': {
                           'list': '/api/parts-catalogue/vendors', 'match_field': 'name',
                           'value': 'Carolina Truck & Trailer Repair',
                           'take': 'tax_id', 'take_as': 'tax_id'}}},
            'verify': ['name'],
            'write': {'endpoint': '/api/parts-catalogue/vendors/change', 'whole_record': True},
            '_why': why}

def vehicle(key, owner, contact_key, vin, unit, maker, model, serves, why, year=2021):
    pay = {'maker_name': maker, 'model_name': model, 'year': year, 'vin': vin}
    if unit is not None:
        pay['unit'] = unit
        pay['licence_plate'] = unit
    return {'key': key, 'type': 'Vehicle', 'depends_on': owner, 'serves': serves,
            'find': {'mode': 'search', 'list': '/api/vehicles', 'coll': 'collection',
                     'field': 'vin', 'value': vin, 'control': None},
            'create': {'endpoint': '/api/vehicles/create', 'payload': pay,
                       'inject': {'customer_id': contact_key, 'company_id': owner}},
            'verify': ['vin'], 'skip_verify': ['maker_name', 'model_name', 'licence_plate'],
            'write': {'endpoint': '/api/vehicles/change', 'whole_record': True}, '_why': why}

def cat_part(key, number, description, serves, why):
    return {'key': key, 'type': 'CataloguePart', 'serves': serves,
            'find': {'mode': 'search', 'list': '/api/parts-catalogue/catalogue-parts',
                     'coll': 'collection', 'field': 'part_number', 'value': number,
                     'control': '21-361'},
            'create': {'endpoint': '/api/parts-catalogue/add-catalogue-part',
                       'payload': {'name': description, 'part_number': number, 'tags': [TAG]}},
            'verify': ['part_number', 'name'], '_why': why}

def inv_part(key, cat_key, number, serves, why):
    return {'key': key, 'type': 'InventoryPart', 'depends_on': cat_key, 'serves': serves,
            'find': {'mode': 'search', 'list': '/api/inventory/parts', 'coll': 'collection',
                     'field': 'part_number', 'value': number, 'control': 'P550848'},
            'create': {'endpoint': '/api/inventory/parts/create',
                       'payload': {'quantity': 4, 'cost': 50.0, 'tags': [],
                                   'min': 5, 'max': 200, 'sell_price': 100.0},
                       'resolve_by_example': {'catalog_part_id': {
                           'list': '/api/parts-catalogue/catalogue-parts', 'coll': 'collection',
                           'match_field': 'part_number', 'value': number,
                           'take': 'id', 'take_as': 'catalog_part_id',
                           'also_take': {'category_id': 'category'}}},
                       'resolve_nested': {'bins': {
                           'list': '/api/inventory/parts', 'coll': 'collection',
                           'search': 'P550848', 'take_path': 'binLocations.0.binLocationId',
                           'template': [{'id': '@', 'isDefault': True, 'quantity': 4}]}},
                       'id_from': 'data.part_id'},
            'verify': ['part_number'], 'skip_verify': ['cost', 'sell_price'], '_why': why}

def work_order(key, owner, contact_key, veh, serves, why, count=1):
    return {'key': key, 'type': 'WorkOrder', 'count': count, 'depends_on': owner, 'serves': serves,
            'find': {'mode': 'ids', 'view': '/api/work-orders/view/{id}', 'coll': 'work_order',
                     'field': 'number', 'ids': [],
                     '_why': '?search= is BROKEN on /api/work-orders, so the ids the seeder records '
                             'as it creates them are the only handle. Starts EMPTY on purpose.'},
            'create': {'endpoint': '/api/work-orders/create',
                       'payload': {'is_vehicle_here': False},
                       'inject': {'company_id': owner, 'vehicle_id': veh,
                                  'customer_id': contact_key},
                       'id_from': 'data.work_order_id', 'repeat': count},
            'skip_verify': ['is_vehicle_here', 'company_id', 'vehicle_id', 'customer_id'],
            '_why': why}

def part_sale(key, owner, veh, owner_name, serves, why, find_unit=None):
    # 🔴 TWO PART SALES FOR ONE CUSTOMER CANNOT BE TOLD APART BY companyName, so the second reported
    # itself present having found the first and was never created. The list row also carries `unit`,
    # which differs per vehicle - keying on that gives a real pair for the SAME customer, which is
    # exactly what "two rows with an identical bold line" needs.
    finder = (('unit', find_unit) if find_unit else ('companyName', owner_name))
    return {'key': key, 'type': 'PartSale', 'depends_on': owner, 'serves': serves,
            'find': {'mode': 'search', 'list': '/api/part-sales', 'coll': 'partSales',
                     'field': finder[0], 'value': finder[1], 'control': CONTROL,
                     '_why': "🔴 THE LIST KEY IS 'partSales', NOT 'collection'."},
            'create': {'endpoint': '/api/part-sales', 'payload': {},
                       'inject': {'company_id': owner, 'vehicle_id': veh},
                       'id_from': 'data.0.id'},
            'skip_verify': ['company_id', 'vehicle_id'], '_why': why}

TWIN_A_CUST = f'{TWIN} {LONG_CUST} {A_NUM}'
TWIN_B_CUST = f'{TWIN} {LONG_CUST} {B_NUM}'
TWIN_A_VEND = f'{TWIN} {LONG_VEND} {A_NUM}'
TWIN_B_VEND = f'{TWIN} {LONG_VEND} {B_NUM}'

# ── the twin pair, on every entity that can carry it ─────────────────────────────────────────
R += [
 customer('ri_cust_twin_a', TWIN_A_CUST, ['CUST-A1','CUST-A2','CUST-A3','CUST-B1','ALL-G2'],
   'TWIN A. A long name whose ONLY difference from its sibling is the trailing digits. If the row '
   'truncates, the tester cannot tell it from TWIN B - which is the defect, demonstrating itself.'),
 customer('ri_cust_twin_b', TWIN_B_CUST, ['CUST-A1','CUST-A2','CUST-A3','CUST-B1','ALL-G2'],
   'TWIN B. Identical to A up to the last six characters.'),
 contact('ri_contact_twin_a', 'ri_cust_twin_a', 'RowTwin',
   ['WO-B1','WO-B2','PS-B1','PS-B2'],
   'Required by /api/vehicles/create - customer_id there is the CONTACT, not the company.'),
 # 🔴 THERE IS NO 'ri_cust_same_a'. THE PRODUCT FORBIDS TWO CUSTOMERS WITH THE SAME NAME —
 # /api/customers/create answers 400 {"error":"Company with provided name already exists."}.
 # So the 'two rows with an identical bold line' case CANNOT EXIST for Customers, and CUST-B2 is
 # not a gap in the data but a case that does not apply. Vendors have no such rule: the two
 # ZZLONGROW Identical Name Supply records below were both created, 201 each. Measured on staging
 # 2026-09-29. For customers the realistic version of this risk is the TWIN pair, whose names
 # differ only past the point where the row runs out of width.
 customer('ri_cust_same_b', f'{TWIN} Identical Name Cartage', ['CUST-B2'],
   'Kept as a single record. Its sibling cannot be created - see the note above - so this one '
   'serves only as a normal customer; CUST-B2 is marked not-applicable rather than unseeded.',
   address='88 Different Street', find_by=('address_1', '88 Different Street')),
 vendor('ri_vend_twin_a', TWIN_A_VEND, ['VEND-A1','VEND-A2','VEND-A3','VEND-B1'], 'TWIN A, vendors.'),
 vendor('ri_vend_twin_b', TWIN_B_VEND, ['VEND-A1','VEND-A2','VEND-A3','VEND-B1'], 'TWIN B, vendors.'),
 vendor('ri_vend_same_a', f'{TWIN} Identical Name Supply', ['VEND-B2'],
   'B2 pair, vendors: same name, different address. Found by ADDRESS for the same reason.',
   address_1='4 Sameface Road', find_by=('address_1', '4 Sameface Road')),
 vendor('ri_vend_same_b', f'{TWIN} Identical Name Supply', ['VEND-B2'],
   'B2 pair, vendors: the second one.',
   address_1='88 Different Street', find_by=('address_1', '88 Different Street')),
]

# ── parts: identical DESCRIPTION (the part's displayed name), twin part NUMBERS ──────────────
for half, num in (('a', A_NUM), ('b', B_NUM)):
    R += [cat_part(f'ri_part_twin_{half}_cat', f'{TWIN}-{num}', f'{TWIN} {LONG_PART}',
            ['PART-A1','PART-A2','PART-A3','PART-B1','PART-B2'],
            'The DESCRIPTION is identical to its sibling and the PART NUMBER is the only '
            'difference - so the bold line cannot tell them apart and the second line must.'),
          inv_part(f'ri_part_twin_{half}_inv', f'ri_part_twin_{half}_cat', f'{TWIN}-{num}',
            ['PART-A1','PART-B1','PART-B2'],
            'Stock row. A catalogue part with NO inventory row is invisible to search, which has '
            'produced a false PASS in this estate before.')]

# ── assets: identical year/make/model, twin unit numbers ─────────────────────────────────────
R += [
 vehicle('ri_asset_twin_a', 'ri_cust_twin_a', 'ri_contact_twin_a', 'ZZRIASSETVIN00001',
   f'{TWIN}-{A_NUM}', 'Rowcheck Trucks', 'Longhauler',
   ['ASSET-A1','ASSET-A2','ASSET-A3','ASSET-B1','ASSET-B2','WO-B1','WO-B2','PS-B1','PS-B2'],
   'Same year/make/model as its sibling, so the bold line is IDENTICAL and only the unit number '
   'separates them - the exact shape SV-10551 complains about.'),
 vehicle('ri_asset_twin_b', 'ri_cust_twin_a', 'ri_contact_twin_a', 'ZZRIASSETVIN00002',
   f'{TWIN}-{B_NUM}', 'Rowcheck Trucks', 'Longhauler',
   ['ASSET-B1','ASSET-B2','WO-B1','WO-B2','PS-B1','PS-B2'],
   'The second twin. Two work orders and two part sales hang off this pair so the Work Orders and '
   'Part Sales tabs get the story SV-9170 actually tells: two jobs for ONE customer, told apart '
   'only by the vehicle.'),
]

# ── the hidden-field records: a value that lives in ONE field the row does not display ────────
R += [
 customer('ri_cust_hidden_owner', 'Rowcheck Hidden Fields Holdings', ['PS-C1','PS-C2','ALL-G1'],
   'A deliberately NEUTRAL name: it must not appear in the Customers group, or a tester cannot '
   'tell which record answered.'),
 contact('ri_contact_hidden', 'ri_cust_hidden_owner', 'RowHidden', ['PS-C1','PS-C2','ALL-G1'],
   'Required by /api/vehicles/create.'),
 vehicle('ri_asset_hidden_vin', 'ri_cust_hidden_owner', 'ri_contact_hidden',
   f'{HIDDEN}VIN0000001', None, 'Rowcheck Motors', 'Quietline', ['PS-C2','ASSET-C1'],
   'Carries the keyword ONLY in its VIN, and no unit number at all, so a hit can be attributed to '
   'the VIN and to nothing else. The Assets row does not display a VIN - that is the point.'),
 vehicle('ri_asset_nounit', 'ri_cust_hidden_owner', 'ri_contact_hidden', 'ZZRINOUNITVIN0001',
   None, f'{NOUNIT} Trucks', 'Plainline', ['ALL-G1'],
   'NO unit number, so the work order row must fall back to year/make/model standing alone - the '
   'one fallback PRD section 4 actually states.'),
 vendor('ri_vend_hidden', 'Rowcheck Quiet Fields Supply', ['VEND-C1','VEND-C2','VEND-C4','VEND-C5'],
   'ONE vendor carrying four values that each live in a field the vendor row does not display: its '
   'own email, its address line 2, and its contact\'s name and email. Its NAME is neutral so every '
   'hit is attributable.',
   email=f'{HIDDEN.lower()}.vendor@staging.shopview.local',
   address_2=f'{HIDDEN}SUITE 12'),
 customer('ri_cust_province', 'Rowcheck Provincial Cartage', ['CUST-C7'],
   'The PROVINCE carries the keyword and the name does not, so a hit is attributable to the '
   'province. Province is matchable per PRD section 4 and is not displayed on the row.',
   state=PROV),
]

# ── the soft-match pair, for the four identifier-led tabs ────────────────────────────────────
R += [
 customer('ri_cust_soft_hit', f'{SOFT_A} Cartage', ['WO-I1','PS-I1'],
   'The tester types THIS spelling. It exists so the query is a real word in the estate.'),
 customer('ri_cust_soft_near', f'{SOFT_B} Cartage', ['WO-I1','PS-I1'],
   'ONE character different, deliberately at the end. Its work order and part sale are what must '
   'come back drawn as a SOFT match when the tester types the other spelling.'),
 contact('ri_contact_soft', 'ri_cust_soft_near', 'RowSoft', ['WO-I1','PS-I1'],
   'Required by /api/vehicles/create.'),
 vehicle('ri_asset_soft', 'ri_cust_soft_near', 'ri_contact_soft', 'ZZRISOFTVIN000001',
   'ZZRI-SOFT-01', 'Rowcheck Trucks', 'Softline', ['WO-I1','PS-I1'],
   'The vehicle the soft-matched work order and part sale hang off.'),
 vendor('ri_vend_soft_hit', f'{SOFT_A} Supply', ['PO-I1','VINV-I1'], 'Typed by the tester.'),
 vendor('ri_vend_soft_near', f'{SOFT_B} Supply', ['PO-I1','VINV-I1'],
   'One character out. Its purchase order and vendor invoice are the soft-matched rows.'),
]

# ── the work orders and part sales ───────────────────────────────────────────────────────────
R += [
 work_order('ri_wo_twin_1', 'ri_cust_twin_a', 'ri_contact_twin_a', 'ri_asset_twin_a',
   ['WO-A1','WO-A2','WO-A3','WO-B1','WO-B2','ALL-E7','ALL-F1','ALL-H3'],
   'TWO work orders for the SAME customer on DIFFERENT vehicles - the situation SV-9170 names in '
   'so many words: "what tells two of the same customer\'s work orders apart".'),
 work_order('ri_wo_twin_2', 'ri_cust_twin_a', 'ri_contact_twin_a', 'ri_asset_twin_b',
   ['WO-B1','WO-B2'], 'The second of the pair, on the twin vehicle.'),
 work_order('ri_wo_nounit', 'ri_cust_hidden_owner', 'ri_contact_hidden', 'ri_asset_nounit',
   ['ALL-G1'], 'The work order whose vehicle has no unit number.'),
 work_order('ri_wo_soft', 'ri_cust_soft_near', 'ri_contact_soft', 'ri_asset_soft',
   ['WO-I1'], 'The work order that must come back as a soft match.'),
 part_sale('ri_ps_twin_1', 'ri_cust_twin_a', 'ri_asset_twin_a', TWIN_A_CUST,
   ['PS-A1','PS-A2','PS-A3','PS-B1','PS-B2','PS-D1'],
   why='The Part Sales tab had NO usable data at all on this environment - nine of its cases could '
       'not be run. This pair fixes that.',
   find_unit=f'{TWIN}-{A_NUM}'),
 part_sale('ri_ps_twin_2', 'ri_cust_twin_a', 'ri_asset_twin_b', TWIN_A_CUST,
   ['PS-B1','PS-B2'], find_unit=f'{TWIN}-{B_NUM}',
   why='The SECOND part sale for the SAME customer, on the twin vehicle - so the two rows carry '
       'an identical bold line and are separated only by the vehicle. Found by UNIT: companyName '
       'cannot tell one of a customer\'s part sales from another, and keying on it left this '
       'record uncreated while reporting itself present.'),
 part_sale('ri_ps_hidden', 'ri_cust_hidden_owner', 'ri_asset_hidden_vin',
   'Rowcheck Hidden Fields Holdings', ['PS-C1','PS-C2'],
   'A part sale whose only distinctive value is the VIN of the vehicle it is for - neither the '
   'asset nor the VIN is displayed on a Part Sales row.'),
 part_sale('ri_ps_soft', 'ri_cust_soft_near', 'ri_asset_soft', f'{SOFT_B} Cartage',
   ['PS-I1'], 'The part sale that must come back as a soft match.'),
]

MANIFEST = {
 'environment': {'workplace_name_hint': 'Staging Heavy Duty - 9919',
                 '_why': 'Overridden by SEED_WORKPLACE; this is the hint for staging.'},
 'keyword_register': {'twin': TWIN, 'hidden': HIDDEN, 'soft_typed': SOFT_A,
                      'soft_near_miss': SOFT_B, 'no_unit': NOUNIT, 'province': PROV,
                      '_measured': 'each returned 0 rows on staging 2026-09-29, against a live '
                                   "control ('Gibson' -> 16 rows)"},
 'records': R,
}
out = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                   'seed-manifest-result-integrity.json')
json.dump(MANIFEST, open(out, 'w'), indent=1)
print(f"{len(R)} records -> {os.path.basename(out)}")
from collections import Counter
for t, n in Counter(r['type'] for r in R).most_common(): print(f"  {t:16} {n}")
