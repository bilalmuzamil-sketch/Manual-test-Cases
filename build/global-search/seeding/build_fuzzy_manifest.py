#!/usr/bin/env python3
"""SV-10740 — short-word typo tolerance ("Short Words Lose Their Record On A One-Letter Typo").

The ticket measured nine tabs on STAGING with words that happened to exist there. A QA branch is a
copy of staging, but three of the nine words have no record on sv10740 (measured 2026-10-05 by
../sv10740-fuzzy/measure_ticket_words.py): Part Sales 'Adrian', Purchase Orders 'Adams' and
Vendor Invoices 'Abadi' - the correct word finds NOTHING there, so the typo row cannot be tested.
This universe adds exactly those three, under the ticket's own words, so the tester types what the
ticket says. The other six words already exist on the staging estate and are measured, not seeded.

Each word is the record's NON-identifier field the ticket exercises: a part sale is indexed on its
CUSTOMER name, and purchase orders / vendor invoices on their VENDOR name (see the gsv2 manifest).
The purchase order and the invoice are a stateful chain, seeded by seed_po_and_invoices.py with
SEED_PO_PLAN=fuzzy_adams / fuzzy_abadi.
"""
import json, os
TAG = 'ZZAUTOTEST'
CONTROL_CUST, CONTROL_VEND = '4 Star Truck Repair', 'Carolina Truck'
R = [
 {'key': 'cust_fz_adrian', 'type': 'Customer', 'serves': ['SV-10740 Part sales: Adrian / Adrxan'],
  '_why': "Part Sales is indexed on the customer's name; the part sale below makes 'Adrian' a "
          "Part Sales word. 'Adrian' must be a whole word so the one-letter typo 'Adrxan' is the "
          "ticket's exact slip.",
  'find': {'mode': 'search', 'list': '/api/customers', 'coll': 'collection', 'field': 'name',
           'value': f'{TAG} Adrian Cartage', 'control': CONTROL_CUST},
  'create': {'endpoint': '/api/customers/create', 'payload': {
      'name': f'{TAG} Adrian Cartage', 'address': '17 Typo Lane', 'city': 'Fernvale',
      'state_or_province': 'Ohio', 'postal_code': '44872-7401', 'phone': '(264) 555-0741',
      'country_code': 'US'}},
  'verify': ['name', 'city'], 'read_as': {'address': 'address_1', 'phone': 'telephone'},
  'write': {'endpoint': '/api/customers/change', 'whole_record': True}},
 # 🔴 A PART SALE NEEDS A CONTACT ON THE COMPANY. CreateCommandHandler looks the customer up with
 # getCustomerByCompanyId and answers 400 "Customer not found" for a company with no contact person
 # (measured on sv10740). The contact's name shares nothing with 'Adrian', so a hit stays attributable.
 {'key': 'contact_fz_adrian', 'type': 'Contact (a PERSON at a customer company)',
  'depends_on': 'cust_fz_adrian', 'serves': [],
  'find': {'mode': 'child', 'parent': 'cust_fz_adrian', 'view': '/api/customers/view/{id}',
           'path': 'company.contacts', 'field': 'first_name', 'value': 'Tovah'},
  'create': {'endpoint': '/api/contacts/create', 'payload': {
      'first_name': 'Tovah', 'last_name': 'Kellerby', 'title': 'Dispatcher',
      'telephone': '(264) 555-0743', 'email': 'tovah@zzfuzzy-cartage.test'},
      'inject': {'company_id': 'cust_fz_adrian'}},
  'verify': ['first_name', 'last_name'], 'read_as': {}},
 {'key': 'part_sale_fz_adrian', 'type': 'PartSale', 'depends_on': 'cust_fz_adrian',
  'serves': ['SV-10740 Part sales: Adrian / Adrxan'],
  '_why': 'The record the Part Sales row of SV-10740 must find - by customer name.',
  'find': {'mode': 'search', 'list': '/api/part-sales', 'coll': 'partSales', 'field': 'companyName',
           'value': f'{TAG} Adrian Cartage', 'control': CONTROL_CUST},
  'create': {'endpoint': '/api/part-sales', 'payload': {}, 'inject': {'company_id': 'cust_fz_adrian'},
             'id_from': 'data.0.id'},
  'skip_verify': ['company_id']},
]
for key, word, street, serves in (
        ('vendor_fz_adams', 'Adams', '5 Adams Freight Way', 'SV-10740 Purchase orders: Adams / Adxms'),
        ('vendor_fz_abadi', 'Abadi', '9 Abadi Supply Road', 'SV-10740 Vendor invoices: Abadi / Abxdi')):
    R.append({'key': key, 'type': 'Vendor', 'unique': True, 'serves': [serves],
      '_why': f"Purchase orders and vendor invoices are indexed on their VENDOR name, so '{word}' "
              f"reaches the tab through this vendor's PO / invoice (seed_po_and_invoices.py).",
      'find': {'mode': 'search', 'list': '/api/parts-catalogue/vendors', 'coll': 'collection',
               'field': 'name', 'value': f'{TAG} {word} Brake Supply', 'control': CONTROL_VEND},
      'create': {'endpoint': '/api/parts-catalogue/add-vendor', 'payload': {
          'name': f'{TAG} {word} Brake Supply', 'address_1': street, 'city': 'Marnston',
          'state_or_province': 'Ohio', 'postal_code': '43055-7400', 'telephone': '(264) 555-0742',
          'email': f'parts@{word.lower()}-brake.test', 'credit_term': 'Net 30', 'credit_limit': 25000},
          'resolve': {'tax_id': '/api/taxes'}},
      'read_as': {}, 'verify': ['name', 'city'], 'skip_verify': ['credit_limit', 'tax_id']})
# The stock purchase orders below order ONE catalogue part each, which must exist first. Their names
# are NEUTRAL on purpose: a part called 'Adams ...' would let the PO match on its item name instead
# of its vendor name, and the row would no longer test what SV-10740 reports (Rule 110 attribution).
for key, pn, name in (('cpart_fz_adams', 'ZZFZ-ADAMS-01', 'ZZAUTOTEST Brake Drum FZ1'),
                      ('cpart_fz_abadi', 'ZZFZ-ABADI-01', 'ZZAUTOTEST Brake Lining FZ2')):
    R.append({'key': key, 'type': 'CataloguePart', 'serves': [],
      'find': {'mode': 'search', 'list': '/api/parts-catalogue/catalogue-parts', 'coll': 'collection',
               'field': 'part_number', 'value': pn, 'control': '21-361'},
      'create': {'endpoint': '/api/parts-catalogue/add-catalogue-part',
                 'payload': {'name': name, 'part_number': pn, 'tags': []}},
      'verify': ['part_number', 'name'], 'skip_verify': ['tags'],
      'write': {'endpoint': '/api/parts-catalogue/change-catalogue-part', 'whole_record': True,
                'id_as': {'category_id': 'category', 'manufacturerId': 'manufacturer_id'}}})
json.dump({'_README': __doc__,
           'environment': {'tag': TAG, 'workplace_name_hint': 'Heavy Duty',
                           '_note': 'environment-agnostic; ids and state are keyed per environment'},
           'records': R},
          open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'seed-manifest-fuzzy.json'), 'w'), indent=1)
print(f'seed-manifest-fuzzy.json: {len(R)} records')
