#!/usr/bin/env python3
"""Check every keyword preset's DECLARED expectation against the rebuilt old search.

Run this after editing keyword-presets.json. A preset whose stated expectation does not match what
the old search actually returns is worse than no preset at all - it would be shown in a meeting and
contradicted on the spot.

    python3 check_presets.py        # exits non-zero if any preset disagrees
"""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'v1-capability-evidence'))
from v1_search import work_order, vendor, customer, vehicle, part, search   # noqa: E402

CUST = customer('ZZAUTOTEST Bridgeport Hauling', '1450 Kestrelway Industrial', 'Dock 7B', 'Ohio',
                '44872-9931', 'Fernvale', '(419) 555-0143', 'bridgeporthauling-zzt.com',
                contacts=[('Marlene', 'Okonkwo', 'Dispatch Supervisor', '(419) 555-0177')])
NEAR = customer('ZZAUTOTEST Darlene Cartage', '77 Ridgeway Spur', '', 'Ohio', '44872-4411', 'Fernvale')
VEND = vendor('ZZAUTOTEST Kestrel Parts Supply', '88 Halbrook Trace', 'Bay 12C', 'Ohio',
              '43055-2210', 'Marnston', '(614) 555-0188', 'parts@kestrelsupply-zzt.com')
VEH  = vehicle('2019', 'Freightliner', 'Cascadia', 'ZZT-4471', '1FUJGLDR9KLZZ4471', 'OHZZT471',
               owner='ZZAUTOTEST Bridgeport Hauling')
WO   = work_order('S-17611', 'ZZAUTOTEST Bridgeport Hauling', 'estimate', shop_id='9160',
                  kind='service', raw_number='17611')
WOQ  = work_order('S-17612', 'ZZAUTOTEST Bridgeport Hauling', 'quality_check', shop_id='9160',
                  kind='service', raw_number='17612')
PS   = work_order('P-253', 'ZZAUTOTEST Bridgeport Hauling', 'open', shop_id='9160',
                  kind='parts', raw_number='253')
PART = part('ZZAUTOTEST Airline Coupler Vernway', 'ZZT-77-3300')
RECORDS = [CUST, NEAR, VEND, VEH, WO, WOQ, PS, PART]
HISTORY = [{'group': 'Recent', 'label': 'something opened earlier', 'type': 'Customer'}]
# the page names two groups slightly differently from the engine
RENAME = {'Work Orders': 'Work orders', 'Part Sales': 'Part sales'}

rows = json.load(open(os.path.join(HERE, 'keyword-presets.json')))
bad = 0
for area, q, what, app, where, field, expect, expsent, verify, now in rows:
    r = search(q, RECORDS, history=HISTORY)
    actual = [] if r['showing_history'] else sorted({RENAME.get(x['group'], x['group']) for x in r['rows']})
    if sorted(expect) != actual:
        bad += 1
        print(f"  MISMATCH  {q!r:<34} declared {sorted(expect)}   actual {actual}")
print(f"\n{len(rows)} presets checked · {bad} mismatch(es)")
sys.exit(1 if bad else 0)
