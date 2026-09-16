#!/usr/bin/env python3
"""Correct the 12 pushed cases against PRD v1.5 (page 576978945, 2026-09-08).

CLAUDE.md: "update_case on EXISTING cases CONTINUES - that is correction, not creation."
Three cases asserted behaviour v1.5 deliberately changes and would have caused FALSE FAILURES.
Refuses without --confirm. Read-back verified (Rule 50).
"""
import json,sys,base64,urllib.request,urllib.error,os,datetime,time
HERE=os.path.dirname(os.path.abspath(__file__))
if '--confirm' not in sys.argv:
    print(__doc__); print("REFUSING: no --confirm."); sys.exit(2)
C=json.load(open('/tmp/testrail/creds.json'))
AUTH=base64.b64encode(f"{C['email']}:{C['login_password']}".encode()).decode()
def call(path,payload=None):
    req=urllib.request.Request(f"{C['host']}/index.php?/api/v2/{path}",
        data=json.dumps(payload).encode() if payload is not None else None,
        headers={'Authorization':f'Basic {AUTH}','Content-Type':'application/json'})
    with urllib.request.urlopen(req,timeout=60) as f: return f.status,json.loads(f.read().decode())

SPEC="Global Search V2 PRD v1.5 (Confluence page 576978945, last modified 2026-09-08)"
TAIL="\n\nNot yet checked against any V2 build - no Global Search QA build exists.\n\nAUTOMATION: READY\n"
def prov_backed(sec,quote,ref):
    return (f"Based on the {SPEC} {sec}, which explicitly indexes this field: \"{quote}\". "
            f"V1 did the same - code baseline 55767168 ({ref})."+TAIL)
def prov_conflict(ref,absent):
    return (f"Based on the ShopView code baseline 55767168 ({ref}), where V1 indexed this field. "
            f"The {SPEC} section 4 does NOT list {absent}. Standing Rule 96 keeps the V1 behaviour as "
            f"the default (silence means must not change), and Rule 58 makes a code-vs-document "
            f"conflict a PO DECISION ITEM rather than a silent invariant."+TAIL)

U={}
# --- spec-backed: strengthen provenance only ---
U[53578]={'custom_expected':"1. The seeded customer's work orders are listed under the Work Orders group.\n2. You did not need to know any work order number to find them.\n\n"+prov_backed("section 4","Work Orders. Indexed: WO number, customer name, asset (year/make/model), unit number, VIN/serial #...","FetchDataQueryHandler.php:91-118")}
U[53580]={'custom_expected':"1. The seeded asset is listed under the Assets group.\n2. This is about SEARCHING by unit number, not the unit number merely appearing on a result row.\n\n"+prov_backed("section 4","Assets (Vehicles). Indexed: year, make, model, VIN/serial #, unit number, owning customer name","FetchDataQueryHandler.php:285-293")}
U[53581]={'custom_expected':"1. The seeded asset appears under the Assets group, found by its owner's name.\n\n"+prov_backed("section 4","Assets (Vehicles). Indexed: ... owning customer name","FetchDataQueryHandler.php:285-293")}
U[53584]={'custom_expected':"1. The seeded vendor is returned under the Vendors group.\n\n"+prov_backed("section 4","Vendors. Indexed: name, telephone, email, address, city...","FetchDataQueryHandler.php:155-164")}
# --- FALSE-FAILURE corrections ---
U[53588]={'title':"More recent work orders rank above older ones of equal relevance",
 'custom_steps':"1. Confirm the four seeded work orders exist for the same customer, all in the same status, each last updated on a clearly different date.\n2. Open global search.\n3. Type: Bridgeport\n4. Read the order of the rows in the Work Orders group.",
 'custom_expected':("1. Among work orders that match equally well and share the same status, the more recently updated one is listed above the older one.\n"
  "2. A closed or invoiced work order older than 90 days is pushed down the list.\n"
  "3. Do NOT expect a strict newest-first date order. Other signals legitimately outrank recency - an open/active status, being assigned to you, and having viewed it in the last 7 days.\n\n"
  f"Based on the {SPEC} section 6.1, where work order recency is ONE ranking signal (exponential decay, 14-day half-life, up to +0.25) alongside open status (+0.30), assigned-to-current-user (+0.15) and viewed-in-last-7-days (+0.10), with closed/invoiced older than 90 days demoted by -0.20; and section 6.2, where rows within a group are sorted by score descending with ties broken by recency.\n\n"
  "CORRECTED 2026-09-10: this case previously asserted a strict newest-first order, carried over from V1 "
  "(code baseline 55767168, FetchDataQueryHandler.php:124, ordered by start date descending). V2 "
  "deliberately replaces strict date ordering with scored ranking, so the old assertion would have "
  "produced a FALSE FAILURE against intended behaviour."+TAIL)}
NEW_MSG=("1. The record you just created is returned by search.\n"
 "2. Allow up to 30 seconds for it to appear - that is the specified index refresh window, not a bug.\n"
 "3. No sign-out and no re-login is needed.\n"
 "4. The record also appears under Recent searches, because creating a record counts as viewing it.\n\n"
 f"Based on the {SPEC} section 9 (\"Index refresh latency <= 30s for entity create/update\") and "
 "section 8 (\"creating an entity counts as a view, so a record the user just created is immediately "
 "recent and recency-boosted\"). V1 refreshed its cached search data on create, so the record appeared "
 "at once - code baseline 55767168, useGlobalSearch.ts:309-313.\n\n"
 "CORRECTED 2026-09-10: this case previously demanded the record appear IMMEDIATELY with no wait. V2 "
 "specifies an index refresh of up to 30 seconds, so the old assertion would have produced a FALSE "
 "FAILURE."+TAIL)
U[53586]={'custom_expected':NEW_MSG}
U[53587]={'custom_expected':NEW_MSG}
# --- code-vs-document conflicts ---
U[53582]={'custom_steps':"1. Confirm the seeded customer has all four address values.\n2. Open global search and search for: Kestrelway   (street address)\n3. Search again for: Fernvale   (city)\n4. Search again for: Ohio   (state or province)\n5. Search again for: 44872-9931   (postal code)",
 'custom_expected':("1. Steps 2, 3 and 4 each return the seeded customer. These three fields are indexed by the V2 spec, so a miss here is a defect.\n"
  "2. Step 5 (postal code) returned the customer in V1. If it does NOT return the customer in V2, do NOT raise a defect - record it and flag it, because the V2 spec does not list postal code as indexed. See the note below.\n\n"
  +prov_conflict("FetchDataQueryHandler.php:224-245","postal code among the Customer indexed fields (it lists customer name, telephone, address 1/2, city, state/province and contact details)"))}
U[53583]={'custom_expected':("1. The seeded customer is returned when searching their website.\n"
  "2. If the customer is NOT returned, do NOT raise a defect - record it and flag it. The V2 spec omits website entirely from the Customer indexed fields, so this may be a deliberate scope cut. See the note below.\n\n"
  +prov_conflict("FetchDataQueryHandler.php:224-245","website anywhere in the Customer indexed fields"))}
U[53585]={'custom_steps':"1. Confirm the seeded vendor has all three address values.\n2. Open global search and search for: Halbrook   (street address)\n3. Search again for: Marnston   (city)\n4. Search again for: 43055-2210   (postal code)",
 'custom_expected':("1. Steps 2 and 3 each return the seeded vendor. Vendor address and city are indexed by the V2 spec, so a miss there is a defect.\n"
  "2. Step 4 (postal code) returned the vendor in V1. If it does not in V2, record and flag it rather than raising a defect - the V2 spec does not list postal code or state for Vendors. See the note below.\n\n"
  +prov_conflict("FetchDataQueryHandler.php:155-164","postal code or state/province among the Vendor indexed fields (it lists name, telephone, email, address and city)"))}

log=[]
print(f"Correcting {len(U)} cases against PRD v1.5 ...")
for cid,payload in U.items():
    try:
        st,_=call(f"update_case/{cid}",payload)
        vst,vb=call(f"get_case/{cid}")
        ok=all(vb.get(k)==v for k,v in payload.items())
        log.append({'case_id':cid,'http':st,'readback':vst,'verified':ok,'fields':list(payload)})
        print(f"  C{cid} HTTP {st} readback {vst} verified={ok} fields={list(payload)}")
    except urllib.error.HTTPError as e:
        log.append({'case_id':cid,'error':e.code,'body':e.read().decode()[:200]})
        print(f"  C{cid} FAILED HTTP {e.code}")
    time.sleep(0.3)
stamp=datetime.datetime.utcnow().strftime('%Y-%m-%dT%H%M%SZ')
json.dump(log,open(f'{HERE}/correction-audit-{stamp}.json','w'),indent=1)
print(f"\nAudit: correction-audit-{stamp}.json")
