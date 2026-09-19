#!/usr/bin/env python3
"""GENERATE seed-manifest-toggle.json — the SAME-RECORD PERMISSION TOGGLE universe (6734).

Serves C55731-C55737, the seven "flip only one access and re-run the SAME query" cases.

🔴 NEVER HAND-EDIT THE JSON. It is generated; a hand edit is lost on the next run.

THE DESIGN RULE FOR THIS UNIVERSE
    ONE RECORD PER BUNDLE, FOUND BY A KEYWORD THE CASE ITSELF NAMES, and nothing else on the
    branch matching that keyword. The assertion is "the SAME record disappeared", so the record
    must be identifiable by NAME across two runs - a count cannot carry this case, because a
    count of 0 after a count of 1 does not prove the row that vanished was OURS.

🔴 THE KEYWORDS ARE NOT MINE TO CHOOSE. Each case body names its own keyword verbatim
    (ZZTOGPART, ZZTOGWO, ZZTOGCUST, ZZTOGPS, ZZTOGVEN, ZZTOGPRICE, ZZCOUNT). Rule 112: the case
    is what the tester reads, so the seed matches the case rather than the case being bent to a
    tidier keyword. They share a 'ZZTOG' stem, which my own ranking-universe lesson says is
    risky - so the verifier checks each keyword returns ITS OWN record and not a sibling's,
    and a collision is reported as a finding rather than quietly renamed away.

🔴 A CATALOGUE PART IS NOT SEARCHABLE WITHOUT A STOCK ROW. Measured 2026-09-17 and again on
    2026-09-18, where a missing stock row turned C55728 into a false PASS. Every part below
    therefore gets an inventory record, and the verifier checks the PART, not the catalogue entry.
"""
import json, os

TAG = 'ZZAUTOTEST'
R = []

# ── helpers, copied rather than imported: each generator in this kit is self-contained, so one
#    universe's edit cannot silently change another's records. ────────────────────────────────
def customer(key, name, serves, why, phone=None, city='Fernvale', address='3 Toggle Street'):
    return {'key': key, 'type': 'Customer', 'serves': serves,
            'find': {'mode': 'search', 'list': '/api/customers', 'coll': 'collection',
                     'field': 'name', 'value': name, 'control': '4 Star Truck Repair'},
            'create': {'endpoint': '/api/customers/create',
                       'payload': {'name': name, 'address': address, 'city': city,
                                   'state_or_province': 'Ohio', 'postal_code': '44872-3001',
                                   'phone': phone or '(264) 400-0300', 'country_code': 'US'}},
            'verify': ['name', 'city'],
            'read_as': {'phone': 'telephone', 'address': 'address_1'},
            'write': {'endpoint': '/api/customers/change', 'whole_record': True},
            '_why': why}

def contact(key, parent, first, last, serves, why):
    return {'key': key, 'type': 'Contact', 'depends_on': parent, 'serves': serves,
            'find': {'mode': 'child', 'parent': parent, 'view': '/api/customers/view/{id}',
                     'path': 'company.contacts', 'field': 'first_name', 'value': first},
            'create': {'endpoint': '/api/contacts/create',
                       'payload': {'first_name': first, 'last_name': last, 'title': 'Owner',
                                   'telephone': '(264) 400-0301', 'email': 'toggle@zztog.test'},
                       'inject': {'company_id': parent}},
            'verify': ['first_name', 'last_name'],
            '_why': why}

def vehicle(key, vin, unit, owner, owner_contact, serves, why):
    return {'key': key, 'type': 'Vehicle', 'depends_on': owner, 'serves': serves,
            'find': {'mode': 'search', 'list': '/api/vehicles', 'coll': 'collection',
                     'field': 'vin', 'value': vin, 'control': None},
            'create': {'endpoint': '/api/vehicles/create',
                       'payload': {'maker_name': 'Freightliner', 'model_name': 'Cascadia',
                                   'year': 2019, 'unit': unit, 'vin': vin, 'licence_plate': unit},
                       # customer_id is the CONTACT, company_id is the BUSINESS - different
                       # entities, and swapping them answers 400 {"customer_id":"Not found"}.
                       'inject': {'customer_id': owner_contact, 'company_id': owner}},
            'verify': ['vin', 'unit'],
            'skip_verify': ['maker_name', 'model_name'],
            'write': {'endpoint': '/api/vehicles/change', 'whole_record': True},
            '_why': why}

def vendor(key, name, serves, why):
    return {'key': key, 'type': 'Vendor', 'serves': serves,
            'find': {'mode': 'search', 'list': '/api/parts-catalogue/vendors', 'coll': 'collection',
                     'field': 'name', 'value': name, 'control': 'Carolina Truck'},
            'create': {'endpoint': '/api/parts-catalogue/add-vendor',
                       'payload': {'name': name, 'address_1': '3 Toggle Street', 'city': 'Fernvale',
                                   'state_or_province': 'Ohio', 'postal_code': '44872-3001',
                                   'telephone': '(264) 400-0302', 'email': 'ap@zztog.test',
                                   'credit_term': 'Net 30', 'credit_limit': 5000},
                       # tax_id is a UUID REFERENCE, not a tax number: a plain string answers
                       # 400 {"tax_id":"Invalid UUID"}. Lift it off a vendor that has one.
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
                       'payload': {'name': name, 'part_number': number, 'tags': [TAG]}},
            'verify': ['part_number', 'name'],
            '_why': why}

def inv_part(key, cat_key, number, qty, serves, why, cost=19.5, sell=39.99):
    """🔴 A CATALOGUE PART IS NOT SEARCHABLE ON ITS OWN - search indexes the INVENTORY record.

    🔴 AND THE CREATE NEEDS FOUR RESOLVED VALUES, NOT ONE. A payload carrying only
    catalog_part_id answers 400 {"category_id":"Missing required parameter","bins":"Missing
    required parameter"} - measured on this manifest's first run. The category rides along with
    the catalogue part (also_take), and `bins` is a LIST OF OBJECTS, not an id, so it is built
    from a template around a bin id lifted off a part that already sits in one. When the lookup
    table is not exposed, the existing data IS the lookup table."""
    return {'key': key, 'type': 'InventoryPart', 'depends_on': cat_key, 'serves': serves,
            'find': {'mode': 'search', 'list': '/api/inventory/parts', 'coll': 'collection',
                     'field': 'part_number', 'value': number, 'control': 'P550848'},
            'create': {'endpoint': '/api/inventory/parts/create',
                       'payload': {'quantity': qty, 'cost': cost, 'tags': [],
                                   'min': 5, 'max': 200, 'sell_price': sell},
                       'resolve_by_example': {'catalog_part_id': {
                           'list': '/api/parts-catalogue/catalogue-parts', 'coll': 'collection',
                           'match_field': 'part_number', 'value': number,
                           'take': 'id', 'take_as': 'catalog_part_id',
                           'also_take': {'category_id': 'category'}}},
                       'resolve_nested': {'bins': {
                           'list': '/api/inventory/parts', 'coll': 'collection',
                           'search': 'P550848',
                           'take_path': 'binLocations.0.binLocationId',
                           'template': [{'id': '@', 'isDefault': True, 'quantity': qty}]}},
                       'id_from': 'data.part_id'},
            'verify': ['part_number'],
            '_why': why}

# ── C55731 · ZZTOGPART — the Catalog & Inventory bundle ──────────────────────────────────────
R += [
 cat_part('tog_part_cat', 'ZZTOGPART-1001', 'ZZTOGPART Brake Kit', [55731],
   'The case names this record verbatim: "the seeded part ZZTOGPART Brake Kit".'),
 inv_part('tog_part_inv', 'tog_part_cat', 'ZZTOGPART-1001', 12, [55731],
   'THE STOCK ROW. Search indexes the inventory record, so without this the part is invisible and '
   'the "without access it is gone" half of the case passes while the "with access it appears" '
   'half fails - which reads as a permission bug and is not one.'),
]

# ── C55736 · ZZTOGPRICE — See Financial Data masks the PRICE, the row stays ──────────────────
R += [
 cat_part('tog_price_cat', 'ZZTOGPRICE-1002', 'ZZTOGPRICE Filter', [55736],
   'The case names this record verbatim: "the seeded priced part ZZTOGPRICE Filter".'),
 inv_part('tog_price_inv', 'tog_price_cat', 'ZZTOGPRICE-1002', 9, [55736],
   'A NON-ROUND, DISTINCTIVE PRICE so the tester can tell a real price from a placeholder or a '
   'zero. This case is the one where a HIDDEN ROW would be the WRONG outcome: the row must stay '
   'and only the price may disappear.', cost=137.45, sell=289.95),
]

# ── C55733 · ZZTOGCUST — one bundle gates Customers AND Assets together ──────────────────────
R += [
 customer('tog_cust', 'ZZTOGCUST Freight', [55733],
   'The case names it verbatim: "the seeded customer ZZTOGCUST Freight and its vehicle".'),
 contact('tog_cust_contact', 'tog_cust', 'Toggle', 'Cust', [55733],
   'A vehicle cannot be created without a contact - customer_id on /api/vehicles/create is a '
   'Customer (the person), not the company.'),
 vehicle('tog_cust_vehicle', 'ZZTOGCUST0000000001', 'ZZTOGCUST-V1', 'tog_cust',
   'tog_cust_contact', [55733],
   'THE SECOND HALF OF THE ASSERTION. The case is not "a customer disappears" - it is that ONE '
   'permission takes the customer AND its vehicle together, so the asset is not optional here.'),
]

# ── C55732 · ZZTOGWO — the Work Orders bundle ────────────────────────────────────────────────
R += [
 customer('tog_wo_cust', 'ZZTOGWO Haulage', [55732],
   'A work order is indexed on its CUSTOMER NAME, so the keyword has to live on the customer for '
   'the work order to be reachable by it at all. The case says so: "the seeded work order and its '
   'customer ZZTOGWO".'),
 contact('tog_wo_contact', 'tog_wo_cust', 'Toggle', 'Work', [55732],
   'Required by the work-order create: customer_id is the contact, and invoicing later 500s '
   'without one.'),
 vehicle('tog_wo_vehicle', 'ZZTOGWO00000000001', 'ZZTOGWO-V1', 'tog_wo_cust',
   'tog_wo_contact', [55732], 'A work order needs a vehicle.'),
]
R.append({
 'key': 'tog_work_order', 'type': 'WorkOrder', 'count': 1, 'depends_on': 'tog_wo_cust',
 'serves': [55732],
 '_why': 'THE RECORD THE CASE TOGGLES. One is enough - the assertion is identity ("the SAME work '
         'order is gone"), not volume.',
 'find': {'mode': 'ids', 'view': '/api/work-orders/view/{id}', 'coll': 'work_order',
          'field': 'number', 'ids': [],
          '_why': '?search= is BROKEN on /api/work-orders and ?page= is IGNORED, so the only '
                  'reliable route is the ids the seeder records as it creates them. The list '
                  'starts EMPTY on purpose - a hardcoded id survives a redeploy pointing at '
                  'nothing, which is how work orders kept reading as "created but NOT FINDABLE".'},
 'create': {'endpoint': '/api/work-orders/create', 'payload': {'is_vehicle_here': False},
            'inject': {'company_id': 'tog_wo_cust', 'vehicle_id': 'tog_wo_vehicle',
                       'customer_id': 'tog_wo_contact'},
            '🔴 _THE_TRAP': 'is_vehicle_here is REQUIRED IN PRACTICE - omit it and the server '
                            'answers 500, not 400, which reads like a broken endpoint.',
            'id_from': 'data.work_order_id', 'repeat': 1},
 'skip_verify': ['is_vehicle_here', 'company_id', 'vehicle_id', 'customer_id'],
})

# ── C55734 · ZZTOGPS — the Part Sales bundle ─────────────────────────────────────────────────
R += [
 customer('tog_ps_cust', 'ZZTOGPS Motors', [55734],
   'A part sale is indexed on its CUSTOMER NAME, so the keyword lives on the customer. The case '
   'says "the seeded part sale for customer ZZTOGPS".'),
 contact('tog_ps_contact', 'tog_ps_cust', 'Toggle', 'Sale', [55734], 'Required by the create chain.'),
 vehicle('tog_ps_vehicle', 'ZZTOGPS000000000001', 'ZZTOGPS-V1', 'tog_ps_cust',
   'tog_ps_contact', [55734], 'The part-sale create injects a vehicle.'),
]
R.append({
 'key': 'tog_part_sale', 'type': 'PartSale', 'depends_on': 'tog_ps_cust', 'serves': [55734],
 '_why': 'THE RECORD THE CASE TOGGLES. Note the Part Sales group needs partSalesView AND '
         'seeFinancialData, so a tester who removes the wrong one still sees the group vanish and '
         'may credit the wrong permission - the handoff says to check which was changed.',
 'find': {'mode': 'search', 'list': '/api/part-sales', 'coll': 'partSales',
          'field': 'companyName', 'value': 'ZZTOGPS Motors', 'control': '4 Star Truck Repair',
          '_why': "🔴 THE LIST KEY IS 'partSales', NOT 'collection'."},
 'create': {'endpoint': '/api/part-sales', 'payload': {},
            'inject': {'company_id': 'tog_ps_cust', 'vehicle_id': 'tog_ps_vehicle'},
            'id_from': 'data.0.id'},
 'skip_verify': ['company_id', 'vehicle_id'],
})

# ── C55735 · ZZTOGVEN — one bundle gates Vendors, POs AND Vendor Invoices ────────────────────
R += [
 vendor('tog_vendor', 'ZZTOGVEN Supply', [55735],
   'The case names it verbatim: "the seeded vendor ZZTOGVEN with its purchase order and vendor '
   'invoice". The PO and the invoice are layered on afterwards by seed_po_and_invoices.py - a '
   'declarative manifest cannot express that stateful chain.'),
]

# ── C55737 · ZZCOUNT — a restricted record is not counted ────────────────────────────────────
# 🔴 READ THIS BEFORE TRUSTING THE SEED. The case wants, for ONE record type, some rows the role
# MAY see and at least one it MAY NOT. Every permission measured in this project is TYPE-level,
# not row-level: a role either sees all Customers or none. So the only mechanism that can hide
# ONE row of a type from a role is WORKPLACE scoping - and Rule 111 already recorded that the
# search index is organisation-scoped while records are workplace-scoped, which is exactly this
# shape. The rows below are the visible side; whether a genuinely hidden sibling can exist at all
# is MEASURED by verify_toggle.py and reported, never assumed.
R += [
 customer('count_visible_1', 'ZZCOUNT Alpha Freight', [55737],
   'Visible side of the count assertion.'),
 customer('count_visible_2', 'ZZCOUNT Beta Freight', [55737],
   'Visible side of the count assertion - two rows so the tester reads a count of 2, not 1. A '
   'count of 1 has already produced a false PASS on a real regression in this project.'),
]

MANIFEST = {
 'environment': {'workplace_name_hint': 'Staging Heavy Duty'},
 '_UNIVERSE': 'Same-record permission toggle (6734) - C55731-C55737',
 '_THE_DESIGN_RULE': 'One record per bundle, found by the keyword the CASE names, unique on the '
                     'branch. The assertion is identity across two runs, so the record must be '
                     'nameable - a count cannot carry these cases.',
 '_KEYWORDS_ARE_THE_CASES': 'ZZTOGPART ZZTOGWO ZZTOGCUST ZZTOGPS ZZTOGVEN ZZTOGPRICE ZZCOUNT - '
                            'taken verbatim from the case bodies (Rule 112), not chosen here.',
 '_DEPENDENT_PASS': "ZZTOGVEN's purchase order and vendor invoice are added by "
                    'seed_po_and_invoices.py after these records exist.',
 '_ROLES_ALREADY_EXIST': 'The six single-bundle ZZAUTOTEST roles created for section 6734 are '
                         'exactly the "identical except one access" pairs these cases need. Do '
                         'not create more - reset them to template before applying (QA lead, '
                         '2026-09-17).',
 'records': R,
}

if __name__ == '__main__':
    here = os.path.dirname(os.path.abspath(__file__))
    out = os.path.join(here, 'seed-manifest-toggle.json')
    json.dump(MANIFEST, open(out, 'w'), indent=1)
    print(f"wrote {out} — {len(R)} records, "
          f"{len({s for r in R for s in r['serves']})} cases served")
