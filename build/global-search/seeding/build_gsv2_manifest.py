#!/usr/bin/env python3
"""Generates seed-manifest-gs-v2.json — the "Fibridge" universe for the 90 build-verified
Global Search V2 cases (TestRail sections 6721-6740, run R415).

WHY A GENERATOR AND NOT A HAND-WRITTEN JSON: the universe is repetitive (seven customers, six
assets, six parts, twenty-two work orders) and the repetition is exactly where a hand-written file
drifts - one asset pointing at the wrong owner is invisible in 1,200 lines of JSON and fatal to the
count targets. Re-run this to regenerate the manifest; never hand-edit the JSON.

THE DESIGN RULE, taken from the deployed indexer (playbook O5, branch SV-9160-global-search-v2 @
21b4db9): NAME THE CUSTOMER AND THE VENDOR AFTER THE SEARCH TERM AND EVERYTHING ELSE INHERITS IT.
A work order is indexed on its customer_name, an asset on its owner company_name, a part sale on its
customer_name, a purchase order and a vendor invoice on their vendor_name. So three "Fibridge"
customers and one "Fibridge" vendor make every record hanging off them match "Fib" without any of
those records carrying the word.
"""
import json

TAG = 'ZZAUTOTEST'
CUST_CONTROL = '4 Star Truck Repair'     # a record known to exist, so a 0-row read is diagnosable

def customer(key, name, addr, city='Fernvale', state='Ohio', postal='44872-1000',
             phone=None, serves=(), why=None, website=None):
    r = {
        'key': key, 'type': 'Customer', 'serves': list(serves),
        'find': {'mode': 'search', 'list': '/api/customers', 'coll': 'collection',
                 'field': 'name', 'value': name, 'control': CUST_CONTROL},
        'create': {'endpoint': '/api/customers/create',
                   'payload': {'name': name, 'address': addr, 'city': city,
                               'state_or_province': state, 'postal_code': postal,
                               'phone': phone or '(264) 555-0100', 'country_code': 'US'}},
        # website / address_2 / telephone / state are DROPPED by create - proven 2026-09-14.
        'patch': {'endpoint': '/api/customers/change',
                  'fields': {'telephone': phone or '(264) 555-0100', 'state_or_province': state}},
        'verify': ['name', 'city', 'postal_code'],
        'read_as': {'address': 'address_1', 'phone': 'telephone'},
        'write': {'endpoint': '/api/customers/change', 'whole_record': True},
        'skip_verify': ['tags'],
    }
    if website:
        r['patch']['fields']['website'] = website
        r['verify'].append('website')
    if why: r['_why'] = why
    return r

def contact(key, parent, first, last, title, tel, email, serves=(), why=None):
    r = {'key': key, 'type': 'Contact (a PERSON at a customer company)', 'depends_on': parent,
         'serves': list(serves),
         'find': {'mode': 'child', 'parent': parent, 'view': '/api/customers/view/{id}',
                  'path': 'company.contacts', 'field': 'first_name', 'value': first},
         'create': {'endpoint': '/api/contacts/create',
                    'payload': {'first_name': first, 'last_name': last, 'title': title,
                                'telephone': tel, 'email': email},
                    'inject': {'company_id': parent}},
         'verify': ['first_name', 'last_name', 'title', 'telephone', 'email'],
         'read_as': {}}
    if why: r['_why'] = why
    return r

def asset(key, company, contact_key, make, model, year, unit, vin, plate, serves=(), why=None):
    """🔴 THE BRANCH CANONICALIZES MAKE AND MODEL AGAINST ITS OWN LOOKUP TABLES. 'Kenworth' is
    stored as 'KEN WORTH' and 'VNL 760' as 'VNL760' (measured 2026-09-16). The declared value must
    therefore be what the branch STORES, not what reads nicely - otherwise every run reports a field
    gap that no repair can ever close, and a real gap gets lost among the noise.

    🔴 customer_id IS THE CONTACT, not the company (a 400 'customer_id: Not found' reads like a
    bad id rather than the wrong KIND of id). Every asset therefore needs its owner to have a
    contact first, which is why each Fibridge company carries one."""
    r = {'key': key, 'type': 'Vehicle', 'depends_on': company, 'serves': list(serves),
         'find': {'mode': 'search', 'list': '/api/vehicles', 'coll': 'collection',
                  'field': 'vin', 'value': vin, 'control': None},
         'create': {'endpoint': '/api/vehicles/create',
                    'payload': {'maker_name': make, 'model_name': model, 'year': year,
                                'unit': unit, 'vin': vin, 'licence_plate': plate},
                    'inject': {'company_id': company, 'customer_id': contact_key}},
         'verify': ['vin', 'year', 'licence_plate'] + (['unit'] if unit else []),
         'read_as': {'model_name': 'vehicle_model', 'maker_name': 'vehicle_make'},
         'write': {'endpoint': '/api/vehicles/change', 'whole_record': True,
                   'id_as': {'vehicle_id': 'id'}, 'also': {'company_id': '@' + company}}}
    if unit == '':
        r['_unit_is_deliberately_empty'] = ('C44831 needs a SECOND work order whose asset has NO '
            'unit number but DOES have a year/make/model, so the row shows the year/make/model '
            'standing alone. An asset with a unit cannot prove that.')
    if why: r['_why'] = why
    return r

def cat_part(key, name, pn, serves=(), why=None):
    r = {'key': key, 'type': 'CataloguePart', 'serves': list(serves),
         'find': {'mode': 'search', 'list': '/api/parts-catalogue/catalogue-parts',
                  'coll': 'collection', 'field': 'part_number', 'value': pn, 'control': '21-361'},
         'create': {'endpoint': '/api/parts-catalogue/add-catalogue-part',
                    'payload': {'name': name, 'part_number': pn, 'tags': []}},
         'verify': ['part_number', 'name'], 'skip_verify': ['tags'],
         'write': {'endpoint': '/api/parts-catalogue/change-catalogue-part', 'whole_record': True,
                   'id_as': {'category_id': 'category', 'manufacturerId': 'manufacturer_id'}}}
    if why: r['_why'] = why
    return r

def inv_part(key, source_key, pn, qty, mn, mx, cost, sell, serves=(), why=None):
    r = {'key': key, 'type': 'InventoryPart', 'depends_on': source_key, 'serves': list(serves),
         'find': {'mode': 'search', 'list': '/api/inventory/parts', 'coll': 'collection',
                  'field': 'part_number', 'value': pn, 'control': 'P550848'},
         'create': {'endpoint': '/api/inventory/parts/create',
                    'payload': {'quantity': qty, 'cost': cost, 'tags': [], 'min': mn, 'max': mx,
                                'sell_price': sell},
                    'resolve_by_example': {'catalog_part_id': {
                        'list': '/api/parts-catalogue/catalogue-parts', 'coll': 'collection',
                        'match_field': 'part_number', 'value': pn, 'take': 'id',
                        'take_as': 'catalog_part_id',
                        'also_take': {'category_id': 'category'}}},
                    'resolve_nested': {'bins': {
                        'list': '/api/inventory/parts', 'coll': 'collection', 'search': 'P550848',
                        'take_path': 'binLocations.0.binLocationId',
                        'template': [{'id': '@', 'isDefault': True, 'quantity': qty}]}},
                    'id_from': 'data.part_id'},
         'verify': ['part_number'],
         'skip_verify': ['tags', 'bins', 'catalog_part_id', 'sell_price', 'cost',
                         'quantity', 'min', 'max'],
         '_why_prices_are_not_verified': '🔴 /api/inventory/parts/create ACCEPTS sell_price and '
             'then IGNORES it - it derives the sell price from the cost and the category margin '
             '(measured 2026-09-16: 22.50 asked for 47.99, got 64.28). And `cost` is not exposed '
             'on the read at all. Declaring either as a verified field produces a permanent '
             'false alarm on every run, which is worse than not checking - it trains the reader '
             'to skip the gaps list. No search case depends on the price, only on the part '
             'number, the description and the quantity chip.',
         'stock': {'quantity_on_hand': qty, 'min': mn}}
    if why: r['_why'] = why
    return r

R = []

# ── A · CUSTOMERS ────────────────────────────────────────────────────────────────────────────────
# 🔴 EXACTLY THREE names carry the token "Fibridge". C44825 needs the Customers group at FIVE OR
# FEWER on the same query that puts Work Orders above twenty, so a fourth Fib* customer breaks it.
R.append(customer('cust_fib_commercial', f'{TAG} Fibridge Commercial', '4120 Fibridge Commerce Way',
    postal='44872-2001', phone='(264) 328-6723', website='fibridge-commercial.test',
    serves=[44832, 44837, 44845, 44895, 45129, 45139, 44842, 44861, 44862, 44863],
    why='The spine customer. Its phone is the EXACT number C44845 types as 2643286723; its contact '
        'carries the distinctive detail C44837/C44895/C45129/C45139 search for; and its name is the '
        '"Fibridge" the C44842 fuzzy query (Filbridge) has to land on.'))
R.append(contact('contact_deshawn', 'cust_fib_commercial', 'Deshawn', 'Oyelaran', 'Fleet Manager',
    '(264) 555-0142', 'deshawn@fibridge-commercial.test',
    serves=[44837, 44895, 45129, 45139],
    why='🔴 THE CONTACT-MATCH FIXTURE, and the one every contact case turns on. Its phone, email and '
        'first name appear NOWHERE in the company name - that separation IS the test (the row must '
        'come back as the COMPANY, flagged "Contact match", with no Contacts group). It doubles as '
        'the C45139 ranking pair: search "Deshawn" and this company matches on a CONTACT field while '
        'ZZAUTOTEST Deshawn Freight Lines matches on its OWN name.'))
R.append(customer('cust_fib_logistics', f'{TAG} Fibridge Logistics', '77 Fibridge Yard Road',
    postal='44872-2002', phone='(264) 555-0143', serves=[44824, 44825, 44817]))
R.append(contact('contact_logistics', 'cust_fib_logistics', 'Ama', 'Boateng', 'Dispatcher',
    '(264) 555-0144', 'ama@fibridge-logistics.test'))
R.append(customer('cust_fib_retail', f'{TAG} Fibridge Retail', '9 Fibridge Market Street',
    postal='44872-2003', phone='(264) 555-0145', serves=[44825, 44817]))
R.append(contact('contact_retail', 'cust_fib_retail', 'Iris', 'Vandenberg', 'Owner',
    '(264) 555-0146', 'iris@fibridge-retail.test'))
R.append(customer('cust_peterson', f'{TAG} Peterson Hauling', '210 Peterson Ridge',
    postal='44872-3001', phone='(264) 555-0151', serves=[44839, 44848],
    why='C44839 types "Petersn" and C44848 checks the soft-match indicator. NOTE the branch ALREADY '
        'returns ~20 fuzzy "Peterson" customers off the word Peterson inside their ADDRESSES, so a '
        'result count proves nothing here - the tester must find THIS record by name (Rule 110b).'))
R.append(customer('cust_aabridge', f'{TAG} Aabridge Freight', '14 Aabridge Loop',
    postal='44872-3002', phone='(264) 555-0152', serves=[44840],
    why='C44840 types "Abrige". Nothing on the branch contained "Aabridge" before this record '
        '(measured 2026-09-16), so this one is genuinely load-bearing.'))
R.append(customer('cust_toboro', f'{TAG} Toboro Industries', '3300 Toboro Bend',
    postal='44872-3003', phone='(264) 555-0153', serves=[44836, 44849],
    why='C44836/C44849 name "P2-58 for Toboro Industries" as an EXAMPLE. The branch already carries a '
        'real Part Sale P2-58 (for Wellington Truck Repair) and no P2-59, so both cases are already '
        'runnable and P-numbers are server-assigned - this customer exists so the named brand is '
        'present, NOT to force the number onto it.'))
R.append(customer('cust_deshawn_named', f'{TAG} Deshawn Freight Lines', '88 Deshawn Crossing',
    postal='44872-3004', phone='(264) 555-0154', serves=[45139],
    why='The C45139 comparison half: a customer whose OWN company name contains "Deshawn", ranked '
        'against cust_fib_commercial which only matches it through a contact field.'))
R.append(customer('cust_bryan_smith', f'{TAG} Bryan Smith Hauling', '51 Smithfield Row',
    postal='44872-3005', phone='(264) 555-0155', serves=[44833, 44841],
    why='C44833 names "a 2025 Freightliner M2 owned by Bryan Smith" as its example; an asset row shows '
        'its OWNING CUSTOMER, so the owner has to be a company carrying that name.'))
R.append(contact('contact_bryan', 'cust_bryan_smith', 'Bryan', 'Smith', 'Owner',
    '(264) 555-0156', 'bryan@bryansmithhauling.test'))

# ── C · ASSETS ───────────────────────────────────────────────────────────────────────────────────
# SIX assets hang off Fibridge* companies. C44825 needs the Assets group ABOVE FIVE on "Fib" and an
# asset is indexed on its owner's company_name, so six owners named Fibridge* is the whole mechanism.
R.append(asset('asset_trk412', 'cust_fib_commercial', 'contact_deshawn', 'Freightliner', 'Cascadia',
    '2019', 'TRK 412', '1FUJGLDR9CLBP8834', 'OHZZT412',
    serves=[44831, 44844, 44828, 44818],
    why='Carries BOTH exact identifiers: the unit "TRK 412" and the YMM C44831 reads off the row, and '
        'the VIN C44844 types in full. Its work orders are the >20 group.'))
R.append(asset('asset_nounit', 'cust_fib_logistics', 'contact_logistics', 'KEN WORTH', 'T680',
    '2021', '', '1XKYDP9X1MJ441077', 'OHZZT413', serves=[44831]))
R.append(asset('asset_fib_3', 'cust_fib_commercial', 'contact_deshawn', 'Peterbilt', '579',
    '2022', 'TRK 413', '1XPBDP9X5ND441078', 'OHZZT414', serves=[44825, 44818]))
R.append(asset('asset_fib_4', 'cust_fib_commercial', 'contact_deshawn', 'Volvo', 'VNL760',
    '2020', 'TRK 414', '4V4NC9EH8LN441079', 'OHZZT415', serves=[44825, 44818]))
R.append(asset('asset_fib_5', 'cust_fib_logistics', 'contact_logistics', 'Mack', 'Anthem',
    '2023', 'TRK 415', '1M1AN07Y5PM441080', 'OHZZT416', serves=[44825, 44818]))
R.append(asset('asset_fib_6', 'cust_fib_retail', 'contact_retail', 'International', 'LT625',
    '2024', 'TRK 416', '3HSDJAPR5RN441081', 'OHZZT417', serves=[44825, 44818]))
R.append(asset('asset_m2_bryan', 'cust_bryan_smith', 'contact_bryan', 'Freightliner', 'M2',
    '2025', 'BSH 001', '1FVACWDT5SH441082', 'OHZZT418', serves=[44833, 44841],
    why='C44833 reads the row (year/make/model + owning customer); C44841 types "frieghtliner" and '
        'must still land on it.'))

# ── E · VENDOR ───────────────────────────────────────────────────────────────────────────────────
R.append({
    'key': 'vendor_fib_mining', 'type': 'Vendor', 'unique': True,
    'serves': [44835, 44820, 44900, 44899, 45130, 45131, 45137, 45138, 44815, 44830],
    '_why': 'One vendor does FIVE jobs. It is the C44835/C44820 vendor result in its own right, and '
            'because a purchase order and a vendor invoice are both indexed on their VENDOR NAME, '
            'every PO and invoice raised against it matches "Fib" without carrying the word itself. '
            'That is what puts the Purchase Orders and Vendor Invoices groups into the all-eight-types '
            'query (C44814/C44815/C44830) instead of leaving two tabs permanently empty.',
    'find': {'mode': 'search', 'list': '/api/parts-catalogue/vendors', 'coll': 'collection',
             'field': 'name', 'value': f'{TAG} Fibridge Mining', 'control': 'Carolina Truck'},
    'create': {'endpoint': '/api/parts-catalogue/add-vendor',
               'payload': {'name': f'{TAG} Fibridge Mining', 'address_1': '600 Fibridge Quarry Road',
                           'city': 'Marnston', 'state_or_province': 'Ohio',
                           'postal_code': '43055-4100', 'telephone': '(264) 555-0160',
                           'email': 'parts@fibridge-mining.test', 'credit_term': 'Net 30',
                           'credit_limit': 25000},
               'resolve': {'tax_id': '/api/taxes'},
               '_why_resolve': 'add-vendor REQUIRES tax_id; take the first tax from GET /api/taxes'},
    'read_as': {},
    'verify': ['name', 'city', 'email', 'credit_term'],
    'skip_verify': ['credit_limit', 'tax_id'],
    '_credit_term_is_a_STRING_CODE': '🔴 credit_term IS NOT A NUMBER OF DAYS. It is one of the '
        'CreditTerms constants - "COD", "Due on Receipt", "Net 7" … "Net 120", "Credit Hold". '
        'add-vendor ACCEPTS the integer 30, answers 201 and stores the string "30", and nothing '
        'complains until you try to RECEIVE a delivery from that vendor: accept-delivery computes '
        'the invoice due date through CreditTerms::getDueDate($date, $creditTerm) and dies, so the '
        'whole receive rolls back with a bare 500 and no delivery. Cost: an hour chasing bin '
        'allocations and the QuickBooks sync, neither of which was the problem. It is verified '
        'here BECAUSE a wrong value is silent until it is expensive.',
    'extra_fields': {'address_2': 'Gate 3'},
    '_no_website_on_purpose': '🔴 A VENDOR HAS AN EMAIL AND NO WEBSITE; a CUSTOMER has a website and '
        'no email. Declaring a website here is what produced the withdrawn SV-10110 (Rule 110a).',
    'write': {'endpoint': '/api/parts-catalogue/change-vendor', 'whole_record': True,
              'id_as': {'vendor_id': 'id'}},
})

# ── D · PARTS ────────────────────────────────────────────────────────────────────────────────────
_c65547 = cat_part('cpart_65547', f'{TAG} Fibridge Air Filter Element', '65547',
    serves=[44846],
    why='C44846 types the part number "65547" exactly. 🔴 THIS CATALOGUE PART ALREADY EXISTS ON THE '
        'BRANCH, named "Rear Shock" - which is NOT what the first measurement said. The V2 search '
        'returned nothing for "65547" because the parts index reads INVENTORY parts, and this '
        'catalogue part had never been stocked. So the case did not need a new part number, it '
        'needed the existing one STOCKED. Find-or-create still applies (a redeploy could take it), '
        'but the name is deliberately NOT verified: renaming a record the branch already owns to '
        'suit our seed is gratuitous, and C44846 tests the NUMBER, not the description.')
_c65547['verify'] = ['part_number']
_c65547['skip_verify'] = ['tags', 'name']
_c65547.pop('write', None)
R.append(_c65547)
R.append(cat_part('cpart_fib_instock', f'{TAG} Fibridge Brake Shoe Kit', 'ZZT-FIB-1001',
    serves=[44834, 44852, 44838, 44819]))
R.append(cat_part('cpart_fib_low', f'{TAG} Fibridge Wheel Seal', 'ZZT-FIB-1002',
    serves=[44834, 44838, 44819]))
R.append(cat_part('cpart_fib_out', f'{TAG} Fibridge Air Dryer Cartridge', 'ZZT-FIB-1003',
    serves=[44834, 44852, 44838, 44819]))
R.append(cat_part('cpart_fib_4', f'{TAG} Fibridge Slack Adjuster', 'ZZT-FIB-1004', serves=[44819]))
R.append(cat_part('cpart_fib_5', f'{TAG} Fibridge King Pin Set', 'ZZT-FIB-1005', serves=[44819]))

# THE THREE STOCK STATES. C44834 and C44852 both hinge on ONE query returning all three at once, so
# the descriptions deliberately share the word "Fibridge" and the states are set by the numbers:
#   in stock      quantity_on_hand well ABOVE min
#   low           quantity_on_hand AT or BELOW min (but not zero)
#   out of stock  quantity_on_hand exactly 0
R.append(inv_part('part_instock', 'cpart_fib_instock', 'ZZT-FIB-1001', 40, 5, 200, 22.50, 47.99,
    serves=[44834, 44852, 44838],
    why='IN STOCK: 40 on hand against a reorder level of 5 - unambiguously above, so the quantity '
        'chip must render in the in-stock colour.'))
R.append(inv_part('part_low', 'cpart_fib_low', 'ZZT-FIB-1002', 2, 5, 100, 11.75, 24.99,
    serves=[44834, 44838],
    why='LOW: 2 on hand against a reorder level of 5. The case wording is "on hand AT OR BELOW its '
        'low/reorder level", so 2-of-5 sits clearly inside that and does not depend on whether the '
        'build treats the boundary as low or as in-stock.'))
R.append(inv_part('part_out', 'cpart_fib_out', 'ZZT-FIB-1003', 0, 5, 100, 31.00, 64.99,
    serves=[44834, 44852, 44838],
    why='OUT OF STOCK: exactly 0 on hand. C44852 also requires it to still be RETURNED - ranked below '
        'the in-stock part, never hidden - so this record is the one that proves a negative.'))
R.append(inv_part('part_65547', 'cpart_65547', '65547', 12, 2, 50, 18.25, 39.99, serves=[44846]))

# ── B · WORK ORDERS ──────────────────────────────────────────────────────────────────────────────
# 🔴 THE NUMBERS ARE ASSIGNED BY THE BRANCH AND CANNOT BE CHOSEN. New work orders here come out as
# S9160-xxxxx. The handoff's "S1-644" and "S2-15276" are NOT seedable - see _exact_identifier_note
# at the foot of this manifest for the real, verified substitutes.
R.append({
    'key': 'work_orders_fib_main', 'type': 'WorkOrder', 'count': 18, 'depends_on': 'cust_fib_commercial',
    'serves': [44823, 44824, 44825, 44822, 53476, 44838, 44851, 44816, 44815, 44830, 44826,
               44874, 44875, 44809, 44812, 44828, 44831, 44898],
    '_why': 'THE ">20 GROUP", which five separate cases depend on. A work order is indexed on its '
            'CUSTOMER NAME, so eighteen work orders for ZZAUTOTEST Fibridge Commercial all match '
            '"Fib" without any of them being edited. Eighteen here plus four on Logistics plus the '
            'eight the branch already carries (which match through a part named "GLASS FIBER") is '
            'thirty - comfortably over twenty, and the palette caps the displayed count at 20.',
    'find': {'mode': 'ids', 'view': '/api/work-orders/view/{id}', 'coll': 'work_order',
             'field': 'number', 'ids': [],
             '_why': '?search= is BROKEN on /api/work-orders and ?page= is IGNORED, so the only '
                     'reliable route is the ids the seeder records as it creates them. The id list '
                     'starts EMPTY on purpose - a hardcoded list survives a redeploy as a list of '
                     'ids that point at nothing, which is how four work orders were reported '
                     '"created but NOT FINDABLE" on every single redeploy.'},
    'create': {'endpoint': '/api/work-orders/create', 'payload': {'is_vehicle_here': False},
               'inject': {'company_id': 'cust_fib_commercial', 'vehicle_id': 'asset_trk412',
                          'customer_id': 'contact_deshawn'},
               '🔴 _THE_TRAP': 'is_vehicle_here is REQUIRED IN PRACTICE. Omit it and the server '
                               'answers 500, not 400 - which reads like a broken endpoint.',
               '_customer_id_is_the_contact': 'company_id is the BUSINESS and customer_id is the '
                   'CONTACT PERSON. Passing the contact here also sets the work order contact, '
                   'without which invoicing later answers 500.',
               'id_from': 'data.work_order_id', 'repeat': 18},
    'skip_verify': ['is_vehicle_here', 'company_id', 'vehicle_id', 'customer_id'],
})
R.append({
    'key': 'work_orders_fib_nounit', 'type': 'WorkOrder', 'count': 4, 'depends_on': 'cust_fib_logistics',
    'serves': [44831, 44838, 44816],
    '_why': 'Work orders on the asset with NO unit number. C44831 compares a row whose second line '
            'reads "unit · year make model" against one where the year/make/model stands alone, and '
            'that comparison needs both kinds present under the SAME query.',
    'find': {'mode': 'ids', 'view': '/api/work-orders/view/{id}', 'coll': 'work_order',
             'field': 'number', 'ids': []},
    'create': {'endpoint': '/api/work-orders/create', 'payload': {'is_vehicle_here': False},
               'inject': {'company_id': 'cust_fib_logistics', 'vehicle_id': 'asset_nounit',
                          'customer_id': 'contact_logistics'},
               'id_from': 'data.work_order_id', 'repeat': 4},
    'skip_verify': ['is_vehicle_here', 'company_id', 'vehicle_id', 'customer_id'],
})

# ── F · PART SALES ───────────────────────────────────────────────────────────────────────────────
R.append({
    'key': 'part_sale_fib', 'type': 'PartSale', 'depends_on': 'cust_fib_commercial',
    'serves': [44821, 44815, 44830, 44814],
    '_why': 'A part sale is indexed on its CUSTOMER NAME, so one raised for Fibridge Commercial puts '
            'the Part Sales group into the "Fib" query - which is what the Part Sales tab case and '
            'both all-eight-types cases need. The P-number is server-assigned (P9160-xxx here).',
    'find': {'mode': 'search', 'list': '/api/part-sales', 'coll': 'partSales',
             'field': 'companyName', 'value': f'{TAG} Fibridge Commercial',
             'control': CUST_CONTROL,
             '_why': "🔴 THE LIST KEY IS 'partSales', NOT 'collection'."},
    'create': {'endpoint': '/api/part-sales', 'payload': {},
               'inject': {'company_id': 'cust_fib_commercial', 'vehicle_id': 'asset_trk412'},
               'id_from': 'data.0.id',
               '_why_this_route': "🔴 POST /api/part-sales - the SAME path as the list, a different "
                                  "verb. Every /part-sales/create spelling answers 404."},
    'skip_verify': ['company_id', 'vehicle_id'],
})

MANIFEST = {
    '_README': (
        'THE "FIBRIDGE" UNIVERSE - seed data for the 90 build-verified Global Search V2 cases '
        '(TestRail sections 6721-6740, run R415). Generated by build_gsv2_manifest.py; DO NOT HAND-EDIT. '
        'Run with:  SEED_MANIFEST=seed-manifest-gs-v2.json python3 seed.py --check | --confirm. '
        'Ids and state are keyed by manifest AND environment, so this never collides with the '
        'V1-regression universe in seed-manifest.json.'),
    'environment': {'app': 'sv9160.qa.shopview.com', 'api': 'sv9160api.qa.shopview.com',
                    'workplace_name_hint': 'Heavy Duty', 'tag': TAG,
                    '_production': 'SEED_PROFILE=/tmp/prod/cookies.json SEED_WORKPLACE="Trucks Hill 2"'},
    '_THE_DESIGN_RULE': (
        'Name the CUSTOMER and the VENDOR after the search term and everything else inherits it. '
        'From the deployed indexer (playbook O5, SV-9160-global-search-v2 @ 21b4db9): a work order is '
        'indexed on customer_name, an asset on its owner company_name, a part sale on customer_name, '
        'a purchase order and a vendor invoice on vendor_name. Three Fibridge customers and one '
        'Fibridge vendor therefore make ~30 work orders, 6 assets, a part sale, the POs and the '
        'vendor invoices all match "Fib" without any of them carrying the word.'),
    '_COUNT_TARGETS_AND_WHY_THEY_ARE_EXACT': {
        'measured_baseline_2026-09-16_before_seeding': {
            'Fib': {'work_orders': 8, 'customers': 0, 'assets': 0, 'parts': 1, 'vendors': 0,
                    'part_sales': 0, 'purchase_orders': 2, 'vendor_invoices': 0}},
        'customers on "Fib"': 'MUST STAY AT 3-5. C44825 needs one group at five or fewer on the same '
            'query that puts another group over twenty. Only three names carry the token "Fibridge".',
        'assets on "Fib"': 'MUST EXCEED 5. C44825 explicitly asks for "the Assets group has MORE THAN '
            'FIVE matches (6+ vehicles)" so its own Show all link appears - six are seeded.',
        'work_orders on "Fib"': 'MUST EXCEED 20 (C44823, C44822, C53476). 18 + 4 + the 8 already there.',
        '🔴 measure on "Fib", never on "Fibridge"': 'The long form already returns 7 customers and 5 '
            'vendors on this branch by FUZZY matching the word "Bridge" inside their addresses. '
            'Counting on the long term makes the "five or fewer" target impossible and unrepeatable.'},
    '_exact_identifier_note': {
        '🔴 NOT SEEDABLE': 'Work-order numbers are assigned by the branch (S9160-xxxxx here), so the '
            'handoff\'s "S1-644" and "S2-15276" cannot be created. S2-15276 does not exist on this '
            'branch and never will.',
        'VERIFIED SUBSTITUTES (measured live 2026-09-16, build v26.36.7-21b4db9)': {
            'a work order that EXISTS and is pinned as the top hit': 'S2-15440',
            'its normalization variants, all confirmed to return it': ['S215440', 'S2 15440',
                                                                       's2-15440', '15440'],
            'near-miss numbers confirmed to return NOTHING': ['S2-15441', 'S2-15442', 'S2-15450',
                                                              'S2-15435', 'S2-15439'],
            'affects': [44843, 44847, 44850]},
        'the Part Sale pair needs no seed at all': 'P2-58 exists (for Wellington Truck Repair) and '
            'P2-59 does not - both halves of C44849 are already true, and C44836 names its customer '
            'only as an example.'},
    'records': R,
}

with open('seed-manifest-gs-v2.json', 'w') as f:
    json.dump(MANIFEST, f, indent=1)
print(f'wrote seed-manifest-gs-v2.json  ({len(R)} records)')
for r in R:
    print(f"  {r['key']:26} {r['type'][:34]:36} x{r.get('count', 1)}")
