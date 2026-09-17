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
         'read_as': {'phone': 'telephone'},
         'write': {'endpoint': '/api/customers/change', 'whole_record': True},
         '_why': why}
    return r

def vehicle(key, vin, unit, maker, model, year, serves, why):
    return {'key': key, 'type': 'Vehicle', 'serves': serves,
            'find': {'mode': 'search', 'list': '/api/vehicles', 'coll': 'collection',
                     'field': 'vin', 'value': vin, 'control': None},
            'create': {'endpoint': '/api/vehicles/create',
                       'payload': {'maker_name': maker, 'model_name': model, 'year': year,
                                   'unit': unit, 'vin': vin, 'licence_plate': unit}},
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
                                   'credit_term': 'Net 30', 'credit_limit': 5000}},
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

R = []

# ── C55707 [ZZRANKQ] prefix > whole-word > fuzzy ──────────────────────────────────────────────
# Three customers, ONE keyword, differing ONLY in where/how the keyword sits in the name.
R += [
 customer('rank_q_prefix', 'ZZRANKQ Freight Ltd', [55707],
   'PREFIX: the name STARTS with the keyword. Must rank first.'),
 customer('rank_q_whole', 'Bolton ZZRANKQ Services', [55707],
   'WHOLE WORD mid-name. Must rank below the prefix match and above the typo.'),
 customer('rank_q_typo', 'ZZRANKQQ Cartage', [55707],
   'FUZZY: one edit from the keyword, so it is reachable only by fuzzy matching. Must rank last.'),
]

# ── C55708 [ZZRANKC] a customer with an open work order outranks one without ───────────────────
R += [
 customer('rank_c_open', 'ZZRANKC Haulage Open', [55708],
   'Gets an OPEN work order attached in the dependent pass. Must rank above its twin.'),
 customer('rank_c_none', 'ZZRANKC Haulage Quiet', [55708],
   'Deliberately NO work order and never opened. The control.'),
]

# ── C55709 [ZZRANKV] an asset on an open work order outranks a newer one that is idle ──────────
R += [
 vehicle('rank_v_open', 'ZZRANKV0000000001', 'ZZRANKV-01', 'Freightliner', 'Cascadia', 2019, [55709],
   'Older model year ON AN OPEN WORK ORDER. Must still outrank the newer idle one - which is the '
   'whole point: the open-work-order lift beats the model-year tiebreak.'),
 vehicle('rank_v_idle', 'ZZRANKV0000000002', 'ZZRANKV-02', 'Freightliner', 'Cascadia', 2025, [55709],
   'NEWER model year, no work order, never opened. If this ranks first the lift is not applied.'),
]

# ── C55710 [ZZRANKN] a vendor with open purchase orders outranks one with none ─────────────────
R += [
 vendor('rank_n_open', 'ZZRANKN Supply Open', [55710],
   'Gets OPEN purchase orders in the dependent pass. Must rank above its twin.'),
 vendor('rank_n_none', 'ZZRANKN Supply Quiet', [55710],
   'Deliberately NO purchase orders. The control.'),
]

# ── C55716 [ZZRANKT] a tie broken by which was updated more recently ───────────────────────────
R += [
 customer('rank_t_older', 'ZZRANKT Transport One', [55716],
   'Created first and NOT touched again. Otherwise identical to its twin.'),
 customer('rank_t_newer', 'ZZRANKT Transport Two', [55716],
   'Identical match quality, but UPDATED LAST by the seeder, so it must win the tie.'),
]

# ── C44852 [ZZRANKI] in stock ranks above out of stock (out of stock NOT hidden) ───────────────
R += [
 cat_part('rank_i_instock', 'ZZRANKI-1001', 'ZZRANKI Brake Drum In Stock', [44852],
   'Stocked to a positive quantity in the dependent pass. Must rank above the out-of-stock twin.'),
 cat_part('rank_i_outstock', 'ZZRANKI-1002', 'ZZRANKI Brake Drum Out Of Stock', [44852],
   'Left at zero on hand. 🔴 It must still APPEAR - the case asserts out-of-stock is ranked lower, '
   'NOT hidden. A missing row here is a different (and reportable) behaviour from a low row.'),
]

# ── C55712 [ZZRANKP] a part with recent activity outranks a quiet one ──────────────────────────
R += [
 cat_part('rank_p_active', 'ZZRANKP-2001', 'ZZRANKP Alternator Active', [55712],
   'Sold/used and viewed in the dependent pass. Must rank above the quiet twin.'),
 cat_part('rank_p_quiet', 'ZZRANKP-2002', 'ZZRANKP Alternator Quiet', [55712],
   'Same stock state, no activity. Isolates recent-activity from in-stock-vs-out.'),
]

# ── C45139 [ZZRANKF] a customer matched ONLY through its contact ───────────────────────────────
# 🔴 The company name must NOT contain the searched value, or the case proves nothing.
R += [
 customer('rank_f_company', 'Northgate Cartage Company', [45139],
   'The COMPANY NAME deliberately contains neither ZZRANKF nor the contact phone. The only route '
   'to this record is its contact - which is exactly what the case measures.',
   phone='(264) 400-0002'),
 {'key': 'rank_f_contact', 'type': 'Contact (a PERSON at a customer company)', 'serves': [45139],
  'find': {'mode': 'child', 'parent': 'rank_f_company', 'view': '/api/customers/view/{id}',
           'path': 'company.contacts', 'field': 'first_name', 'value': 'Zzrankf'},
  'create': {'endpoint': '/api/contacts/create',
             'payload': {'first_name': 'Zzrankf', 'last_name': 'Oyelaran', 'title': 'Fleet Manager',
                         'telephone': '(264) 400-0199', 'email': 'zzrankf@northgate-cartage.test'}},
  'verify': ['first_name', 'telephone'],
  '_why': 'Carries the ZZRANKF token and a distinctive phone. Searching either must return the '
          'COMPANY, flagged as a contact match.'},
]

# ── C55713 [ZZFZ] a very short query must not produce noisy fuzzy matches ──────────────────────
# The case needs BOTH halves or it cannot distinguish "short queries are stricter" from "nothing
# matched anyway": a 2-3 letter name one edit from the query, and a 4+ letter name one edit from it.
R += [
 customer('fz_short', 'ZZFZ Ab Cartage', [55713],
   'SHORT token "Ab" - two letters. Querying "Ac" (one edit) must NOT drag it in.'),
 customer('fz_long', 'ZZFZ Abcde Logistics', [55713],
   'LONG token "Abcde" - five letters. Querying "Abcdf" (one edit) SHOULD find it. The contrast '
   'between these two rows is the whole case.'),
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
