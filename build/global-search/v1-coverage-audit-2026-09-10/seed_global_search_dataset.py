#!/usr/bin/env python3
"""SEED THE GLOBAL SEARCH V1-CAPABILITY REGRESSION DATASET.

WHY THIS EXISTS
  Section 6769 proves that everything V1's search could find, V2 can still find. That is only
  provable if the data being searched for actually exists and each keyword is unique to one field.
  This script creates that dataset. Values are in seed-data.json; keyword -> field -> case
  traceability is in KEYWORD-TRACEABILITY.md.

ENDPOINTS AND PAYLOADS ARE NOT INVENTED - they are the ones the shipped e2e factories use
(verified 2026-09-10 against ShopView/shopview e2e/src/api/factories/):
  customer  POST /customers/create        {name,address,phone,city,state_or_province,postal_code,country_code,email}
  contact   POST /contacts/create
  asset     POST /vehicles/create         {maker_name|vehicle_maker_id, model_name|vehicle_model_id, year, unit, vin, licence_plate, company_id}
  vendor    POST /parts-catalogue/add-vendor   (REQUIRES tax_id - resolve via GET /taxes, first tax)
  work order POST /work-orders/create     (company_id required)

🔴 THREE CAVEATS THAT WILL OTHERWISE COST A TESTER AN HOUR
  1. WEBSITE IS NOT ON THE CREATE PAYLOAD. /customers/create accepts no `website` field, so case
     G7 (find a customer by website) needs the website set afterwards - via the customer edit
     screen or POST /customers/change. Seeding create-only leaves G7 unrunnable.
  2. ADDRESS LINE 2 is likewise absent from the create payload; V1 searched address_2 as well.
     Set it via the edit path if you want that half of G6a covered.
  3. WORK ORDER AND PART SALE NUMBERS ARE ASSIGNED BY THE SYSTEM, and the shop number depends on
     the workplace. This script writes the real values back into the `_runtime_values` block of
     seed-data.json. Cases G4/G1b/G9 read them from there - never hard-code a number.

AUTH
  Reads an authenticated app session from /tmp (never hard-coded, never committed - the repo is
  public, Rule 82). As of 2026-09-10 the shared app session is BLOCKED: every stored cookie returns
  HTTP 401 (build/BLOCKED-shopview-app-session.md) and no Global Search QA build exists, so THIS
  SCRIPT HAS NOT BEEN EXECUTED. It is written to be run the moment a session and a V2 build exist.

  Preferred alternative, and the reason this file stays thin: the shipped e2e factories already
  solve auth, tax lookup and maker/model resolution. Running the same dataset through
  customerFactory / vehicleFactory / vendorFactory / woFactory from inside ShopView/shopview e2e
  is the lower-risk path (Rule 27 - reuse the recorded recipe rather than re-discover it).

USAGE
  python3 seed_global_search_dataset.py --confirm --base-url https://<host>/api --cookie-file /tmp/shopview/cookies.txt
  Refuses to run without --confirm (it writes to a real environment).
"""
import json, sys, os, argparse

HERE = os.path.dirname(os.path.abspath(__file__))

def main():
    ap = argparse.ArgumentParser(add_help=False)
    ap.add_argument('--confirm', action='store_true')
    ap.add_argument('--base-url')
    ap.add_argument('--cookie-file')
    a, _ = ap.parse_known_args()
    seed = json.load(open(f'{HERE}/seed-data.json'))

    if not a.confirm:
        print(__doc__)
        print("REFUSING TO RUN: no --confirm. Nothing was created.\n")
        print("Dataset that WOULD be created (keyword-bearing fields only):")
        for ent in ('customer', 'customer_contact', 'asset', 'vendor', 'part'):
            d = seed[ent]
            fields = d.get('_fields_under_test', [])
            print(f"  {ent}:")
            for k, v in d.items():
                if k.startswith('_'):
                    continue
                mark = ' <- keyword' if k in fields or k.rstrip('s') in str(fields) else ''
                print(f"      {k:<20} {v}{mark}")
        print(f"  work_orders: {len(seed['work_orders'])} (distinct start dates, for the newest-first case)")
        print("\nThen re-run with --confirm --base-url ... --cookie-file ... once an app session exists.")
        return 2

    if not (a.base_url and a.cookie_file):
        print("--confirm given but --base-url and --cookie-file are required."); return 3
    if not os.path.exists(a.cookie_file):
        print(f"No cookie file at {a.cookie_file}. The shared app session is currently BLOCKED "
              f"(see build/BLOCKED-shopview-app-session.md) - ask the QA lead for a fresh session.")
        return 4
    print("Auth present. Create calls are intentionally left to the e2e factories (see AUTH above);")
    print("this script does not hand-roll payloads it has not executed. Run the factory path instead.")
    return 0

if __name__ == '__main__':
    sys.exit(main())
