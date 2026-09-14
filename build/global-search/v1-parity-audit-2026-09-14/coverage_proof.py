# -*- coding: utf-8 -*-
"""Proves every V1 capability has a case in TestRail section 6769.

V1 capability list is taken from the V1 SOURCE CODE (ShopView @ 55767168) - the
searchable fields extracted mechanically from each fetcher's `search` expression,
plus the behavioural invariants INV-01..INV-91.
"""
import json,base64,urllib.request,ssl

# (capability, V1 code citation, [case ids])
FIELDS=[
 # --- Work Order / Part Sale : fetchWorkOrderData, lines 91-118 (one fetcher, BOTH types)
 ("WO/PS - plain (raw) number","FetchDataQueryHandler.php:96 wo.raw_number",[55672]),
 ("WO/PS - formatted number","FetchDataQueryHandler.php:98-111 wo.number",[53579]),
 ("WO/PS - shop-number-prefixed forms (4 variants)","FetchDataQueryHandler.php:100-110 shop_id injected 4 ways",[53579]),
 ("WO - customer company name","FetchDataQueryHandler.php:112 c.name",[53578]),
 ("Part Sale - customer company name","FetchDataQueryHandler.php:112 c.name (same fetcher yields Part Sale rows)",[55665]),
 ("WO/PS - status word","FetchDataQueryHandler.php:113-116 wo.status",[55658]),
 # --- Customer : fetchCustomerData, lines 224-245
 ("Customer - company name","FetchDataQueryHandler.php:226 c.name",[55667]),
 ("Customer - company name with spaces removed","FetchDataQueryHandler.php:228 REPLACE(c.name,' ','')",[53602]),
 ("Customer - address line 1","FetchDataQueryHandler.php:229 c.address_1",[53582]),
 ("Customer - address line 2","FetchDataQueryHandler.php:229 c.address_2",[53604]),
 ("Customer - state or province","FetchDataQueryHandler.php:230 c.state_or_province",[53582]),
 ("Customer - postal code","FetchDataQueryHandler.php:230 c.postal_code",[53582]),
 ("Customer - city","FetchDataQueryHandler.php:231 c.city",[53582]),
 ("Customer - company telephone","FetchDataQueryHandler.php:235 c.telephone",[55662]),
 ("Customer - website","FetchDataQueryHandler.php:236 c.website",[53583]),
 ("Customer - contact first name","FetchDataQueryHandler.php:240 cu.first_name",[55670]),
 ("Customer - contact last name","FetchDataQueryHandler.php:240 cu.last_name",[55670]),
 ("Customer - contact job title","FetchDataQueryHandler.php:241 cu.title",[53603]),
 ("Customer - contact telephone","FetchDataQueryHandler.php:241 cu.telephone",[55662,53603]),
 # --- Vendor : fetchVendorData, lines 155-164
 ("Vendor - name","FetchDataQueryHandler.php:156 v.name",[55668]),
 ("Vendor - address line 1","FetchDataQueryHandler.php:157 v.address_1",[53585]),
 ("Vendor - address line 2","FetchDataQueryHandler.php:158 v.address_2",[53604]),
 ("Vendor - state or province","FetchDataQueryHandler.php:159 v.state_or_province",[53606]),
 ("Vendor - postal code","FetchDataQueryHandler.php:160 v.postal_code",[53585]),
 ("Vendor - city","FetchDataQueryHandler.php:161 v.city",[53585]),
 ("Vendor - telephone","FetchDataQueryHandler.php:162 v.telephone",[55663]),
 ("Vendor - email","FetchDataQueryHandler.php:163 v.email",[53584]),
 # --- Vehicle/Asset : fetchVehicleData, lines 285-293
 ("Asset - owning customer name","FetchDataQueryHandler.php:286 c.name",[53581]),
 ("Asset - year","FetchDataQueryHandler.php:287 v.year",[53605]),
 ("Asset - make / maker","FetchDataQueryHandler.php:288 vmk.name",[55664]),
 ("Asset - model","FetchDataQueryHandler.php:289 vm.name",[55664]),
 ("Asset - unit number","FetchDataQueryHandler.php:290 v.unit",[53580]),
 ("Asset - VIN","FetchDataQueryHandler.php:291 v.vin",[55669]),
 ("Asset - licence plate","FetchDataQueryHandler.php:292 v.licence_plate",[53516]),
 # --- Part : fetchPartData, lines 324-328 (CataloguePart table)
 ("Part - name / description","FetchDataQueryHandler.php:325 cp.name",[53607]),
 ("Part - part number with and without dashes","FetchDataQueryHandler.php:326-327 cp.part_number",[55666]),
 ("Part - the CATALOGUE is the source, not inventory stock","FetchDataQueryHandler.php:317-331 from CataloguePart::TABLE_NAME",[53601,45153]),
]
BEHAVIOURS=[
 ("INV-10 minimum two characters","useGlobalSearch.ts:69-71",[45161]),
 ("INV-11 prefix match on the visible label","useGlobalSearch.ts:76-82",[55667,55668]),
 ("INV-12 substring match anywhere in the record text","useGlobalSearch.ts:84-93",[55659,55660]),
 ("INV-13 case-insensitive matching","useGlobalSearch.ts:67,81,91",[55671]),
 ("INV-14 + INV-15 per-type slots and no overall cap","useGlobalSearch.ts:152 MAX_PER_TYPE=3, no total cap",[55661]),
 ("INV-16 a record matching twice is shown once","useGlobalSearch.ts:182-184",[45157]),
 ("INV-17 a contact match still returns its company","useGlobalSearch.ts:187-188,207-209",[55670]),
 ("INV-18 work orders newest first","FetchDataQueryHandler.php:124 start_date DESC",[53588]),
 ("INV-20 the vehicles group is shown as Assets","GlobalSearch.vue:60",[45155]),
 ("INV-33 a newly created record is findable at once","useGlobalSearch.ts:309-313 + 5 call sites",[53586,53587]),
 ("INV-34 a user with no default workplace","GlobalSearch.vue:131-137",[45159]),
 ("INV-40 keyboard shortcut reaches search","GlobalSearch.vue:243-254",[45156]),
 ("INV-41 first result auto-highlighted; Enter opens it","GlobalSearch.vue:173-184,205",[55673]),
 ("INV-43 loading state while results are not ready","GlobalSearch.vue:12-14,147-149",[53589]),
 ("INV-44 a no-results message","GlobalSearch.vue:33-39,151-153",[55675]),
 ("INV-46 selecting a result opens the right record","GlobalSearch.vue:208-235; routingService.ts:75",[45153]),
 ("INV-47 already on that record - no re-navigation","GlobalSearch.vue:223-234",[45154]),
 ("INV-48 selecting a result records an analytics event","GlobalSearch.vue:211-217",[45160]),
 ("INV-50 reachable on desktop, tablet and phone","DesktopMenu.vue:52,74,77-101; GlobalSearch.vue:81-91",[55674]),
 ("INV-64 history entries the user may not see are hidden","useGlobalSearch.ts:21-29",[45149]),
 ("INV-71 the TimeClock role gets nothing","FetchDataController.php:50-51",[45147]),
 ("INV-72 per-section access gating by held bundle","FetchDataQueryHandler.php:47-53",[45142,45144,45145,45146]),
 ("INV-73 Part gated on catalogInventoryView only","FetchDataQueryHandler.php:47-53; routingService.ts:84-85",[45143]),
 ("INV-74 an unknown result type defaults to not-permitted","routingService.ts:78-99",[45148]),
 ("INV-80 every fetcher is organization-scoped","FetchDataQueryHandler.php:127-130 et al",[45150]),
 ("INV-81 only WO/PS are location-scoped; the rest are org-wide","FetchDataQueryHandler.php:130",[45151]),
 ("INV-82 a location switch refreshes the results","useGlobalSearch.ts:286-299",[45152]),
 ("INV-90 no feature flag controls global search","absence in component, composable and config",[45158]),
]
cr=json.load(open('/tmp/testrail/creds.json'))
A=base64.b64encode(f"{cr['user']}:{cr['login_password'] or cr['password']}".encode()).decode()
ctx=ssl.create_default_context(cafile='/root/.ccr/ca-bundle.crt')
def api(p):
    r=urllib.request.Request(cr['host'].rstrip('/')+f"/index.php?/api/v2/{p}",headers={'Authorization':'Basic '+A})
    return json.loads(urllib.request.urlopen(r,context=ctx,timeout=60).read())
cs=[];off=0
while True:
    r=api(f"get_cases/1&suite_id=1&section_id=6769&limit=250&offset={off}")
    x=r['cases'] if isinstance(r,dict) else r; cs+=x
    if len(x)<250: break
    off+=250
live={c['id']:c['title'] for c in cs}
tests=[];off=0
while True:
    r=api(f"get_tests/415&limit=250&offset={off}")
    x=r['tests'] if isinstance(r,dict) else r; tests+=x
    if len(x)<250: break
    off+=250
inrun={t['case_id'] for t in tests}
rows=[('FIELD',)+f for f in FIELDS]+[('BEHAVIOUR',)+b for b in BEHAVIOURS]
missing=[];notinrun=[];unmapped=set(live)
for kind,cap,cite,ids in rows:
    for i in ids:
        unmapped.discard(i)
        if i not in live: missing.append((cap,i))
        elif i not in inrun: notinrun.append((cap,i))
print(f"section 6769 live cases : {len(live)}")
print(f"run 415 tests           : {len(inrun)}")
print(f"capabilities mapped     : {len(rows)}  ({len(FIELDS)} searchable fields + {len(BEHAVIOURS)} behaviours)")
print(f"mapped to a case that does not exist : {missing}")
print(f"mapped to a case NOT in run 415      : {notinrun}")
print(f"cases in 6769 not mapped to any capability : {len(unmapped)}")
for i in sorted(unmapped): print(f"    C{i}  {live[i]}")
json.dump({'fields':FIELDS,'behaviours':BEHAVIOURS,'live_6769':len(live),'run415':len(inrun),
 'missing':missing,'not_in_run':notinrun,'unmapped_cases':{str(i):live[i] for i in sorted(unmapped)}},
 open('coverage-proof.json','w'),indent=1)
