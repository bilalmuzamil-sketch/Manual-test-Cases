#!/usr/bin/env python3
"""GENERATE seed-manifest-per-tab-prefix.json — the PER-TAB PREFIX cases C72120/72121/72122.

Stage 1 of SEQUENCED-HANDOFF-SEED-THEN-BUILDVERIFY-2026-09-20.md.
Cases: C72120 Parts tab · C72121 Vendors tab · C72122 Assets tab.
Related ticket: https://shopview.atlassian.net/browse/SV-10279 (Parts did not credit begins-with).

🔴 NEVER HAND-EDIT THE JSON. It is generated; a hand edit is lost on the next run.

THE DESIGN RULE, TAKEN FROM THE CASE BODIES AND NOT FROM THE HANDOFF SUMMARY (Rule 112)
    Each case wants THREE records of ONE entity type matching ONE query in three ways:
        A  the primary name BEGINS with the query      (prefix)
        B  the name CONTAINS it part-way through       (whole word)
        C  it matches only through a TYPO              (fuzzy)
    "IDENTICAL in every other respect" - so address, telephone, stock, bin, price, owner, year and
    activity are all held flat, and only the position/spelling of the keyword differs.

🔴 ONE KEYWORD PER CASE, AND THE THREE ARE FAR APART IN EDIT DISTANCE. The search is deliberately
    fuzzy, so keywords that differ by a character or two match EACH OTHER and the per-case privacy
    is gone - that is exactly how the first ranking scheme in this project broke. ZZKRYPTON /
    ZZMAGENTA / ZZOBSIDIAN share no stem. Each was measured to return ZERO rows before use, with a
    live control proving the search was answering rather than silently empty.

🔴 THE TYPO RECORD CARRIES A ONE-CHARACTER VARIANT, DELIBERATELY AT THE END
    ZZKRYPTOM / ZZMAGENTO / ZZOBSIDIAM. It must be close enough to be reached by fuzzy matching but
    never equal, or record C stops being a typo case and becomes a second exact match.

🔴 WHAT "THE NAME" IS DIFFERS BY ENTITY, AND THE CASES SAY SO
    · Parts   - the DESCRIPTION is the part's name (PRD section 4). The part NUMBER is therefore
                kept NEUTRAL here: a first attempt on the SV-10279 universe put the keyword in the
                part number too, and BOTH rows then matched on part_number as a prefix, hiding the
                description completely. Measured 2026-09-20.
    · Vendors - the vendor name.
    · Assets  - C72122 says "their displayed name (year/make/model)", so the keyword goes in the
                MAKE and MODEL, and the VIN and unit are kept neutral. This is NOT the same field
                the SV-10279 asset pair used (that one matched on `unit`), and the difference is
                the point: the product was observed to apply its prefix check to `unit`, so whether
                it also applies it to the displayed name is an OPEN MEASUREMENT this seed sets up
                rather than a foregone conclusion.
"""
import json, os

PART_KW, PART_TYPO = 'ZZKRYPTON', 'ZZKRYPTOM'     # C72120
VEND_KW, VEND_TYPO = 'ZZMAGENTA', 'ZZMAGENTO'     # C72121
ASST_KW, ASST_TYPO = 'ZZOBSIDIAN', 'ZZOBSIDIAM'   # C72122
TAG = 'ZZAUTOTEST'
FLAT = dict(city='Fernvale', address='11 Per Tab Lane', postal='44872-7001',
            phone='(264) 400-0700')
R = []

def customer(key, name, serves, why):
    return {'key': key, 'type': 'Customer', 'serves': serves,
            'find': {'mode': 'search', 'list': '/api/customers', 'coll': 'collection',
                     'field': 'name', 'value': name, 'control': '4 Star Truck Repair'},
            'create': {'endpoint': '/api/customers/create',
                       'payload': {'name': name, 'address': FLAT['address'], 'city': FLAT['city'],
                                   'state_or_province': 'Ohio', 'postal_code': FLAT['postal'],
                                   'phone': FLAT['phone'], 'country_code': 'US'}},
            'verify': ['name', 'city'],
            'read_as': {'phone': 'telephone', 'address': 'address_1'},
            'write': {'endpoint': '/api/customers/change', 'whole_record': True}, '_why': why}

def contact(key, parent, first, serves, why):
    return {'key': key, 'type': 'Contact', 'depends_on': parent, 'serves': serves,
            'find': {'mode': 'child', 'parent': parent, 'view': '/api/customers/view/{id}',
                     'path': 'company.contacts', 'field': 'first_name', 'value': first},
            'create': {'endpoint': '/api/contacts/create',
                       'payload': {'first_name': first, 'last_name': 'PerTab', 'title': 'Owner',
                                   'telephone': FLAT['phone'], 'email': 'pt@zzpertab.test'},
                       'inject': {'company_id': parent}},
            'verify': ['first_name'], '_why': why}

def vendor(key, name, serves, why):
    return {'key': key, 'type': 'Vendor', 'serves': serves,
            'find': {'mode': 'search', 'list': '/api/parts-catalogue/vendors', 'coll': 'collection',
                     'field': 'name', 'value': name, 'control': 'Carolina Truck'},
            'create': {'endpoint': '/api/parts-catalogue/add-vendor',
                       'payload': {'name': name, 'address_1': FLAT['address'], 'city': FLAT['city'],
                                   'state_or_province': 'Ohio', 'postal_code': FLAT['postal'],
                                   'telephone': FLAT['phone'], 'email': 'ap@zzpertab.test',
                                   'credit_term': 'Net 30', 'credit_limit': 5000},
                       'resolve_by_example': {'tax_id': {
                           'list': '/api/parts-catalogue/vendors', 'match_field': 'name',
                           'value': 'Carolina Truck & Trailer Repair',
                           'take': 'tax_id', 'take_as': 'tax_id'}}},
            'verify': ['name'],
            'write': {'endpoint': '/api/parts-catalogue/vendors/change', 'whole_record': True},
            '_why': why}

def vehicle(key, vin, unit, maker, model, serves, why):
    return {'key': key, 'type': 'Vehicle', 'depends_on': 'pertab_owner', 'serves': serves,
            'find': {'mode': 'search', 'list': '/api/vehicles', 'coll': 'collection',
                     'field': 'vin', 'value': vin, 'control': None},
            'create': {'endpoint': '/api/vehicles/create',
                       # SAME YEAR for all three - C72122 says "same year band", and the year is
                       # the first thing in the displayed name, so varying it would vary the name
                       # for a reason that has nothing to do with the match type under test.
                       'payload': {'maker_name': maker, 'model_name': model, 'year': 2019,
                                   'unit': unit, 'vin': vin, 'licence_plate': unit},
                       'inject': {'customer_id': 'pertab_contact', 'company_id': 'pertab_owner'}},
            'verify': ['vin', 'unit'],
            # maker_name / model_name are accepted on create but the record reads them back under
            # other keys, so comparing them reports a permanent false gap.
            'skip_verify': ['maker_name', 'model_name'],
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
                       # NO STOCK, same bin, same cost and price for all three - the case says so.
                       # A stock row is still required: a catalogue part with no inventory record
                       # is invisible to search, which has produced a false PASS here before.
                       'payload': {'quantity': 0, 'cost': 50.0, 'tags': [],
                                   'min': 5, 'max': 200, 'sell_price': 100.0},
                       'resolve_by_example': {'catalog_part_id': {
                           'list': '/api/parts-catalogue/catalogue-parts', 'coll': 'collection',
                           'match_field': 'part_number', 'value': number,
                           'take': 'id', 'take_as': 'catalog_part_id',
                           'also_take': {'category_id': 'category'}}},
                       'resolve_nested': {'bins': {
                           'list': '/api/inventory/parts', 'coll': 'collection',
                           'search': 'P550848', 'take_path': 'binLocations.0.binLocationId',
                           'template': [{'id': '@', 'isDefault': True, 'quantity': 0}]}},
                       'id_from': 'data.part_id'},
            'verify': ['part_number'], 'skip_verify': ['cost', 'sell_price'], '_why': why}

# ── C72120 · PARTS TAB — the SV-10279 regression ─────────────────────────────────────────────
for key, num, desc, role in [
    ('a', 'PERTAB-7001', f'{PART_KW} Brake Kit',        'A: description BEGINS with the query.'),
    ('b', 'PERTAB-7002', f'Heavy Duty {PART_KW} Filter','B: query CONTAINED part-way through.'),
    ('c', 'PERTAB-7003', f'{PART_TYPO} Wheel Seal',     'C: reachable only by TYPO.')]:
    R += [cat_part(f'pt_part_{key}_cat', num, desc, [72120],
                   role + ' Part number deliberately neutral so the DESCRIPTION is what matches.'),
          inv_part(f'pt_part_{key}_inv', f'pt_part_{key}_cat', num, [72120],
                   'Stock row - required for the part to be searchable at all. Zero quantity, '
                   'same bin, same cost and price as its two siblings.')]

# ── C72121 · VENDORS TAB ─────────────────────────────────────────────────────────────────────
R += [
 vendor('pt_vend_a', f'{VEND_KW} Supply Co', [72121], 'A: name BEGINS with the query.'),
 vendor('pt_vend_b', f'Northgate {VEND_KW} Parts', [72121], 'B: query CONTAINED part-way.'),
 vendor('pt_vend_c', f'{VEND_TYPO} Traders', [72121],
   'C: TYPO only. Same address and telephone as A and B, and no purchase orders on any of the '
   'three, so "not used recently" holds equally.'),
]

# ── C72122 · ASSETS TAB ──────────────────────────────────────────────────────────────────────
R += [
 customer('pertab_owner', 'Per Tab Asset Holdings', [72122],
   'ONE owner shared by all THREE vehicles, so the customer-name signal is identical across them '
   'and cannot tilt the order. Its own name carries no keyword, so it cannot appear in the '
   'Customers group and muddy the comparison.'),
 contact('pertab_contact', 'pertab_owner', 'PerTab', [72122],
   'Required by /api/vehicles/create - customer_id there is the CONTACT, not the company.'),
 vehicle('pt_asset_a', 'PERTABAST0000001', 'PERTAB-A1', ASST_KW, 'Hauler', [72122],
   'A: the MAKE is the keyword, so the displayed name reads "2019 ZZOBSIDIAN Hauler" and the '
   'keyword is the first word after the year.'),
 vehicle('pt_asset_b', 'PERTABAST0000002', 'PERTAB-B2', 'Western', f'{ASST_KW} Hauler', [72122],
   'B: the keyword sits LATER in the displayed name - "2019 Western ZZOBSIDIAN Hauler".'),
 vehicle('pt_asset_c', 'PERTABAST0000003', 'PERTAB-C3', ASST_TYPO, 'Hauler', [72122],
   'C: TYPO only. Same owner, same year, same model and a neutral VIN and unit, so nothing but '
   'the spelling differs.'),
]

MANIFEST = {
 'environment': {'workplace_name_hint': 'Staging Heavy Duty'},
 '_UNIVERSE': 'Per-tab prefix ranking (C72120 Parts, C72121 Vendors, C72122 Assets)',
 '_KEYWORDS': {'C72120': PART_KW, 'C72121': VEND_KW, 'C72122': ASST_KW,
               'typo variants': [PART_TYPO, VEND_TYPO, ASST_TYPO]},
 '_THE_DESIGN_RULE': 'Three records per case matching one query three ways - begins-with, '
                     'contains, typo - identical in every other respect.',
 '_MEASURED_BEFORE_USE': 'All six tokens returned ZERO rows on 2026-09-20 before any record was '
                         'created, with a live control proving the search was answering.',
 'records': R,
}

if __name__ == '__main__':
    here = os.path.dirname(os.path.abspath(__file__))
    out = os.path.join(here, 'seed-manifest-per-tab-prefix.json')
    json.dump(MANIFEST, open(out, 'w'), indent=1)
    print(f"wrote {out} — {len(R)} records, "
          f"{len({s for r in R for s in r['serves']})} cases served")
