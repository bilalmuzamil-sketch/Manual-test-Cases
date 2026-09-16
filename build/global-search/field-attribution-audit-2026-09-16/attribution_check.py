#!/usr/bin/env python3
"""DID THE MATCH COME FROM THE FIELD WE CLAIM IT CAME FROM?

    python3 attribution_check.py        # exits non-zero if any claim is unattributable

WHY THIS EXISTS.

On 2026-09-15 a defect was filed saying the old search could find a vendor by its WEBSITE and the
new one could not. The old search never could. Typing kestrelsupply-zzt.com on the old product
returned the vendor - but it matched the vendor's EMAIL, parts@kestrelsupply-zzt.com, which
CONTAINS that string. The old version's vendor query has no website column at all.

A search returning the right record is NOT evidence that the field you have in mind was searched.
Any other field whose value contains your query will return the same record, and the second pass of
the old search matches anywhere inside the text, which makes substrings dangerous.

THE TEST. For each claim "typing <value> finds this record because of field X", rebuild the record
with field X BLANKED and search again. If the record is STILL found, the match never depended on X
and the claim is unproven. This is the disconfirming test - it tries to break the claim rather than
confirm it.
"""
import sys, copy
sys.path.insert(0, '/home/user/Manual-test-Cases/build/global-search/v1-capability-evidence')
from v1_search import customer, vendor, vehicle, part, work_order, finds

CUSTF = dict(name="ZZAUTOTEST Bridgeport Hauling", address_1="1450 Kestrelway Industrial",
             address_2="Dock 7B", state="Ohio", postal="44872-9931", city="Fernvale",
             telephone="(419) 555-0143", website="bridgeporthauling-zzt.com",
             contacts=[("Marlene", "Okonkwo", "Dispatch Supervisor", "(419) 555-0177")])
VENDF = dict(name="ZZAUTOTEST Kestrel Parts Supply", address_1="88 Halbrook Trace",
             address_2="Bay 12C", state="Ohio", postal="43055-2210", city="Marnston",
             telephone="(614) 555-0188", email="parts@kestrelsupply-zzt.com")
VEHF  = dict(year="2019", maker="Freightliner", model="Cascadia", unit="ZZT-4471",
             vin="1FUJGLDR9KLZZ4471", plate="OHZZT471", owner="ZZAUTOTEST Bridgeport Hauling")

def blanked(build, fields, key):
    f = copy.deepcopy(fields)
    if key not in f:
        return None                       # the field does not exist in this V1 query at all
    f[key] = [] if key == 'contacts' else ""
    return build(**f)

CLAIMS = [
 ("customer", customer, CUSTF, "name",       "ZZAUTOTEST Bridgeport Hauling"),
 ("customer", customer, CUSTF, "address_1",  "Kestrelway"),
 ("customer", customer, CUSTF, "address_2",  "Dock 7B"),
 ("customer", customer, CUSTF, "state",      "Ohio"),
 ("customer", customer, CUSTF, "postal",     "44872-9931"),
 ("customer", customer, CUSTF, "city",       "Fernvale"),
 ("customer", customer, CUSTF, "telephone",  "419-555-0143"),
 ("customer", customer, CUSTF, "website",    "bridgeporthauling-zzt.com"),
 ("customer", customer, CUSTF, "contacts",   "Marlene"),
 ("customer", customer, CUSTF, "contacts",   "Okonkwo"),
 ("customer", customer, CUSTF, "contacts",   "Dispatch Supervisor"),
 ("customer", customer, CUSTF, "contacts",   "419-555-0177"),
 ("vendor",   vendor,   VENDF, "name",       "ZZAUTOTEST Kestrel"),
 ("vendor",   vendor,   VENDF, "address_1",  "Halbrook"),
 ("vendor",   vendor,   VENDF, "address_2",  "Bay 12C"),
 ("vendor",   vendor,   VENDF, "state",      "Ohio"),
 ("vendor",   vendor,   VENDF, "postal",     "43055-2210"),
 ("vendor",   vendor,   VENDF, "city",       "Marnston"),
 ("vendor",   vendor,   VENDF, "telephone",  "614-555-0188"),
 ("vendor",   vendor,   VENDF, "email",      "parts@kestrelsupply-zzt.com"),
 ("vendor",   vendor,   VENDF, "website",    "kestrelsupply-zzt.com"),   # the one that was wrong
 ("asset",    vehicle,  VEHF,  "year",       "2019"),
 ("asset",    vehicle,  VEHF,  "maker",      "Freightliner"),
 ("asset",    vehicle,  VEHF,  "model",      "Cascadia"),
 ("asset",    vehicle,  VEHF,  "unit",       "ZZT-4471"),
 ("asset",    vehicle,  VEHF,  "vin",        "1FUJGLDR9KLZZ4471"),
 ("asset",    vehicle,  VEHF,  "plate",      "OHZZT471"),
 ("asset",    vehicle,  VEHF,  "owner",      "ZZAUTOTEST Bridgeport"),
]

bad = []
print(f"{'RECORD':10} {'CLAIMED FIELD':12} {'TYPED':32} VERDICT")
for rec, build, fields, field, q in CLAIMS:
    full = build(**fields)
    found_full = finds(q, [full])
    without = blanked(build, fields, field)
    if without is None:
        print(f"{rec:10} {field:12} {q!r:32} 🔴 THE FIELD IS NOT IN V1's QUERY AT ALL")
        bad.append((rec, field, q, "field absent from the V1 query"))
        continue
    found_without = finds(q, [without])
    if not found_full:
        print(f"{rec:10} {field:12} {q!r:32} 🔴 not found even WITH the field")
        bad.append((rec, field, q, "not found at all"))
    elif found_without:
        print(f"{rec:10} {field:12} {q!r:32} 🔴 STILL FOUND WITH THE FIELD BLANK "
              f"- another field carries it")
        bad.append((rec, field, q, "match not attributable to this field"))
    else:
        print(f"{rec:10} {field:12} {q!r:32} ok  attributable")

print()
if bad:
    print(f"🔴 {len(bad)} CLAIM(S) NOT ATTRIBUTABLE TO THE FIELD THEY NAME:")
    for rec, field, q, why in bad:
        print(f"     {rec}.{field} via {q!r}: {why}")
else:
    print("✅ every claim is attributable to the field it names")
sys.exit(1 if bad else 0)
