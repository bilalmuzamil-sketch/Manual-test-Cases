#!/usr/bin/env python3
"""GENERATE seed-manifest-prefix-parity.json — the SV-10279 PARTS PREFIX-RANKING comparison.

Ticket: https://shopview.atlassian.net/browse/SV-10279
  "Parts Tab Does Not Rank a Part Whose Name Begins With the Search Text Any Higher"
Cases:  C55707 (the rule, stated for ANY entity type) and C55724 (the same rule on Customers).

🔴 NEVER HAND-EDIT THE JSON. It is generated; a hand edit is lost on the next run.

WHY THIS UNIVERSE EXISTS — AND WHY IT IS BETTER THAN THE TICKET'S OWN REPRO
    The ticket demonstrates the fault with TWO searches: ZZTABQ on Parts (wrong) and ZZPREFIX on
    Customers (right). A developer can reasonably answer "those are different records, seeded at
    different times, with different fields - are you sure nothing else differs?"

    This universe removes that answer. ONE keyword, FOUR entity types, TWO records each, created
    in the same pass with every other signal held flat. The reviewer types ONE thing, and in a
    single response sees three entity types apply the prefix rule and Parts not apply it.

🔴 THE EVIDENCE IS THE MATCH KIND THE API ITSELF REPORTS. Measured on v26.36.8-d146c39 before
    this universe was built, and it is sharper than the ticket's own framing:

        ZZTABQ   'ZZTABQ Wheel Seal'        (begins with)  kind=WORD    score=1
        ZZTABQ   'Cooper ZZTABQ Cartridge'  (mid-name)     kind=word    score=1
        ZZPREFIX 'ZZPREFIX Freight Ltd'     (begins with)  kind=PREFIX  score=1
        ZZPREFIX 'Bolton ZZPREFIX Services' (mid-name)     kind=word    score=1

    For a CUSTOMER the product labels a begins-with match `prefix`. For a PART it labels the very
    same shape of match `word` - it does not recognise the prefix at all. That is the defect in
    the product's own words, and it needs no interpretation.

🔴 AND A SECOND THING THE TICKET DOES NOT SAY: THE SCORES TIE AT 1 ON CUSTOMERS TOO.
    The ticket reads "it works on Customers". By ROW ORDER it may; by SCORE it does not - the
    begins-with customer and the mid-name customer both come back on 1, exactly as the two parts
    do. So a prefix match is correctly RECOGNISED on customers but is not visibly separating the
    two rows there either, which leaves the order to fall to recency on customers as well.
    Do not assert that as a second defect from this file: the verifier MEASURES kind, score and
    order for all four entity types and prints what it finds. If customers and parts differ only
    in the label, the reviewer should see exactly that and decide.

THE DESIGN RULE
    Per type, exactly TWO records differing in ONE thing: WHERE the keyword sits in the name.
      A = the name BEGINS with the keyword      (prefix match, PRD +0.70)
      B = the keyword sits MID-NAME as a word   (whole-word match, PRD +0.50)
    Everything else is deliberately flat: same address, same city, same telephone, no contacts,
    no work orders, no sales, no recent views, and for the parts the SAME bin and ZERO stock -
    exactly the conditions the ticket says its own two parts were created under.

🔴 PARTS NEED A STOCK ROW TO BE SEARCHABLE AT ALL, AND THAT IS NOT THE SAME AS HAVING STOCK.
    A catalogue part with no inventory record is invisible to search - it has produced a false
    PASS in this project once already. Quantity ZERO with an inventory row is both searchable and
    faithful to the ticket's "created with no stock".

🔴 THE ASSET NAME FIELD IS MEASURED, NOT ASSUMED. An asset's displayed primary is "year make
    model", while unit, VIN, plate and customer name are all indexed. Which of those the product
    treats as the PRIMARY NAME for prefix scoring is not documented anywhere we hold, so the
    verifier REPORTS the matched field for every row rather than this file asserting one. If the
    asset pair does not show a prefix gap, that is a finding about assets - not a licence to
    quietly drop them from the comparison.
"""
import json, os

KW = 'ZZVORTAC'          # verified private before use - see the seeding note
TAG = 'ZZAUTOTEST'
FLAT = dict(city='Fernvale', address='9 Parity Row', postal='44872-9001',
            phone='(264) 400-0900')
R = []

def customer(key, name, why):
    return {'key': key, 'type': 'Customer', 'serves': [55707, 55724],
            'find': {'mode': 'search', 'list': '/api/customers', 'coll': 'collection',
                     'field': 'name', 'value': name, 'control': '4 Star Truck Repair'},
            'create': {'endpoint': '/api/customers/create',
                       'payload': {'name': name, 'address': FLAT['address'], 'city': FLAT['city'],
                                   'state_or_province': 'Ohio', 'postal_code': FLAT['postal'],
                                   'phone': FLAT['phone'], 'country_code': 'US'}},
            'verify': ['name', 'city'],
            'read_as': {'phone': 'telephone', 'address': 'address_1'},
            'write': {'endpoint': '/api/customers/change', 'whole_record': True},
            '_why': why}

def vendor(key, name, why):
    return {'key': key, 'type': 'Vendor', 'serves': [55707],
            'find': {'mode': 'search', 'list': '/api/parts-catalogue/vendors', 'coll': 'collection',
                     'field': 'name', 'value': name, 'control': 'Carolina Truck'},
            'create': {'endpoint': '/api/parts-catalogue/add-vendor',
                       'payload': {'name': name, 'address_1': FLAT['address'], 'city': FLAT['city'],
                                   'state_or_province': 'Ohio', 'postal_code': FLAT['postal'],
                                   'telephone': FLAT['phone'], 'email': 'ap@zzparity.test',
                                   'credit_term': 'Net 30', 'credit_limit': 5000},
                       'resolve_by_example': {'tax_id': {
                           'list': '/api/parts-catalogue/vendors', 'match_field': 'name',
                           'value': 'Carolina Truck & Trailer Repair',
                           'take': 'tax_id', 'take_as': 'tax_id'}}},
            'verify': ['name'],
            'write': {'endpoint': '/api/parts-catalogue/vendors/change', 'whole_record': True},
            '_why': why}

def vehicle(key, vin, unit, owner, owner_contact, why):
    return {'key': key, 'type': 'Vehicle', 'depends_on': owner, 'serves': [55707],
            'find': {'mode': 'search', 'list': '/api/vehicles', 'coll': 'collection',
                     'field': 'vin', 'value': vin, 'control': None},
            'create': {'endpoint': '/api/vehicles/create',
                       'payload': {'maker_name': 'Freightliner', 'model_name': 'Cascadia',
                                   'year': 2019, 'unit': unit, 'vin': vin, 'licence_plate': unit},
                       'inject': {'customer_id': owner_contact, 'company_id': owner}},
            'verify': ['vin', 'unit'],
            'skip_verify': ['maker_name', 'model_name'],
            'write': {'endpoint': '/api/vehicles/change', 'whole_record': True},
            '_why': why}

def contact(key, parent, first, why):
    return {'key': key, 'type': 'Contact', 'depends_on': parent, 'serves': [55707],
            'find': {'mode': 'child', 'parent': parent, 'view': '/api/customers/view/{id}',
                     'path': 'company.contacts', 'field': 'first_name', 'value': first},
            'create': {'endpoint': '/api/contacts/create',
                       'payload': {'first_name': first, 'last_name': 'Parity', 'title': 'Owner',
                                   'telephone': FLAT['phone'], 'email': 'p@zzparity.test'},
                       'inject': {'company_id': parent}},
            'verify': ['first_name'], '_why': why}

def cat_part(key, number, description, why):
    return {'key': key, 'type': 'CataloguePart', 'serves': [55707],
            'find': {'mode': 'search', 'list': '/api/parts-catalogue/catalogue-parts',
                     'coll': 'collection', 'field': 'part_number', 'value': number,
                     'control': '21-361'},
            'create': {'endpoint': '/api/parts-catalogue/add-catalogue-part',
                       'payload': {'name': description, 'part_number': number, 'tags': [TAG]}},
            'verify': ['part_number', 'name'], '_why': why}

def inv_part(key, cat_key, number, why):
    return {'key': key, 'type': 'InventoryPart', 'depends_on': cat_key, 'serves': [55707],
            'find': {'mode': 'search', 'list': '/api/inventory/parts', 'coll': 'collection',
                     'field': 'part_number', 'value': number, 'control': 'P550848'},
            'create': {'endpoint': '/api/inventory/parts/create',
                       # ZERO stock, identical cost and price, identical min/max - the ticket's
                       # own two parts were made this way and the comparison must match it.
                       'payload': {'quantity': 0, 'cost': 50.0, 'tags': [],
                                   'min': 5, 'max': 200, 'sell_price': 100.0},
                       'resolve_by_example': {'catalog_part_id': {
                           'list': '/api/parts-catalogue/catalogue-parts', 'coll': 'collection',
                           'match_field': 'part_number', 'value': number,
                           'take': 'id', 'take_as': 'catalog_part_id',
                           'also_take': {'category_id': 'category'}}},
                       'resolve_nested': {'bins': {
                           'list': '/api/inventory/parts', 'coll': 'collection',
                           'search': 'P550848',
                           'take_path': 'binLocations.0.binLocationId',
                           'template': [{'id': '@', 'isDefault': True, 'quantity': 0}]}},
                       'id_from': 'data.part_id'},
            'verify': ['part_number'],
            'skip_verify': ['cost', 'sell_price'],
            '_why': why}

# ── A · CUSTOMERS — the control the ticket already shows working ─────────────────────────────
R += [
 customer('pfx_cust_a', f'{KW} Freight Ltd',
   'A: the name BEGINS with the keyword. PRD prefix rule, +0.70.'),
 customer('pfx_cust_b', f'Bolton {KW} Services',
   'B: the keyword sits MID-NAME as a whole word. PRD whole-word rule, +0.50. Identical to A in '
   'address, city, postcode and telephone, with no contacts and no work orders, so the ONLY '
   'difference between the pair is where the keyword sits.'),
]

# ── B · VENDORS — second working control ─────────────────────────────────────────────────────
R += [
 vendor('pfx_vend_a', f'{KW} Supply Co',   'A: name BEGINS with the keyword.'),
 vendor('pfx_vend_b', f'Northgate {KW} Parts', 'B: keyword MID-NAME. Same address and telephone.'),
]

# ── C · ASSETS — third working control ───────────────────────────────────────────────────────
# An asset needs an owner and a contact at create time; both assets share ONE owner so the
# customer-name signal is identical for the pair and cannot tilt the comparison.
R += [
 customer('pfx_asset_owner', 'Parity Asset Holdings',
   'ONE owner for BOTH assets. Sharing it keeps the customer-name signal identical across the '
   'pair - two different owners would introduce exactly the second variable this test removes. '
   'Deliberately does NOT carry the keyword, so it cannot appear in the Customers group and '
   'confuse the comparison.'),
 contact('pfx_asset_contact', 'pfx_asset_owner', 'Parity',
   'Required by /api/vehicles/create - customer_id there is the CONTACT, not the company.'),
# 🔴 THE VINs ARE NEUTRAL ON PURPOSE. First attempt put the keyword in the VIN as well, and the
 # match then landed on `vin` for one row and `unit` for the other - two different fields, which
 # is not a comparison. The keyword lives only in the UNIT.
 vehicle('pfx_asset_a', 'PARITYAST00000001', f'{KW}-A1', 'pfx_asset_owner', 'pfx_asset_contact',
   'A: the unit number BEGINS with the keyword.'),
 vehicle('pfx_asset_b', 'PARITYAST00000002', f'UNITB{KW}X2', 'pfx_asset_owner',
   'pfx_asset_contact',
   'B: the keyword sits MID-FIELD with NO delimiter before it. That detail matters: on assets '
   'the product called UNIT-ZZVORTAC-B2 a `prefix` match, so it appears to treat a token START '
   'as a prefix. Without the dash the keyword is genuinely mid-token, which is the honest '
   'equivalent of "Bolton ZZVORTAC Services" on a customer. Same owner, make, model and year '
   'as A, so only the keyword position differs.'),
]

# ── D · PARTS — THE DEFECT ───────────────────────────────────────────────────────────────────
# Section 4 of the PRD names the part's DESCRIPTION as the field displayed as its name, so the
# prefix rule has to be tested on the description - which is what `name` carries here.
R += [
# 🔴 THE PART NUMBERS MUST NOT CARRY THE KEYWORD. First attempt numbered them ZZVORTAC-9001 and
 # ZZVORTAC-9002, and BOTH rows then came back matched on `part_number` with kind=prefix - which
 # masked the description entirely and made the pair look identical for the wrong reason. The
 # ticket is about the DESCRIPTION, so the part number is deliberately neutral and the keyword
 # lives only in the description. Measured 2026-09-20.
 cat_part('pfx_part_a_cat', 'PARITYPN-9001', f'{KW} Brake Kit',
   'A: the DESCRIPTION begins with the keyword. PRD section 4 names the description as the field '
   'displayed as a part\'s name, so this is the prefix case the rule is about.'),
 inv_part('pfx_part_a_inv', 'pfx_part_a_cat', 'PARITYPN-9001',
   'Stock row so the part is searchable at all. ZERO quantity, matching the ticket.'),
 cat_part('pfx_part_b_cat', 'PARITYPN-9002', f'Heavy Duty {KW} Filter',
   'B: the keyword sits MID-DESCRIPTION as a whole word - the weaker match under the PRD.'),
 inv_part('pfx_part_b_inv', 'pfx_part_b_cat', 'PARITYPN-9002',
   'Stock row. Same zero quantity, same bin, same cost and price as A.'),
]

MANIFEST = {
 'environment': {'workplace_name_hint': 'Staging Heavy Duty'},
 '_UNIVERSE': 'SV-10279 prefix-ranking parity across entity types',
 '_TICKET': 'https://shopview.atlassian.net/browse/SV-10279',
 '_KEYWORD': KW,
 '_THE_CLAIM': 'One keyword, four entity types, two records each, every other signal flat. '
               'Customers, Vendors and Assets should show a SCORE GAP between the begins-with '
               'row and the mid-name row; Parts should show the same gap and does not.',
 '_WHY_KIND_NOT_ORDER': 'The ticket notes that when two rows tie the winner is whichever was '
                        'changed most recently, so ROW ORDER is a recency artefact a developer can '
                        'dismiss. The match KIND the API returns is not: a customer beginning with '
                        'the text is labelled `prefix`, a part beginning with the text is labelled '
                        '`word`. Measured 2026-09-20 on v26.36.8-d146c39.',
 '_MEASURED_NOT_ASSERTED': 'Scores tie at 1 on customers as well as on parts, so a score GAP is '
                           'not the evidence and this manifest does not claim one. The verifier '
                           'prints kind, score and order per type and lets the reviewer read it.',
 'records': R,
}

if __name__ == '__main__':
    here = os.path.dirname(os.path.abspath(__file__))
    out = os.path.join(here, 'seed-manifest-prefix-parity.json')
    json.dump(MANIFEST, open(out, 'w'), indent=1)
    print(f"wrote {out} — {len(R)} records, keyword {KW}")
