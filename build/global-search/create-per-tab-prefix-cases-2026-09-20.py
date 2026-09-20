#!/usr/bin/env python3
"""3 per-tab prefix-ranking cases (2026-09-20) for SV-10279 blind spot: Parts, Vendors, Assets.
Strict all-signals-equal shape like C55724, each on its own scope tab. Section 6726."""
import json, urllib.request, base64
c=json.load(open("/tmp/testrail/creds.json"))
AUTH=base64.b64encode(f"{c['user']}:{c['password']}".encode()).decode()
def post(path,payload):
    req=urllib.request.Request(f"https://shopview.testrail.io/index.php?/api/v2/{path}",
        data=json.dumps(payload).encode(),headers={'Authorization':f'Basic {AUTH}','Content-Type':'application/json'},method='POST')
    return json.load(urllib.request.urlopen(req))
TRIGGER=("Sign in to ShopView. In the app header, click the search field (or press ⌘K / Ctrl+K) "
         "to open the global search, which searches across work orders, customers, parts and more; "
         "results appear grouped by type under a tab strip.")
def pre(l): return "<p>"+"<br>".join(l)+"</p>"
def steps(l): return "<p>"+"<br>".join(l)+"</p>"
def expected(body,src,note):
    return "".join(f"<p>{p}</p>" for p in body)+f"<hr><p>{src}</p><p>{note}</p><p>Newly authored on 20 September 2026 to close a coverage gap; not yet build-verified.</p><p>AUTOMATION: READY</p>"
def SRC(d): return ("This is the expected behaviour as per epic SV-9160 and the Global Search - Product Requirements "
    f"specification version 1.5 (Confluence page 576978945), section 6.1 and section 4 ({d}), read on 20 September 2026.")
TYPE=2
cases=[]

# PARTS (direct SV-10279 regression)
cases.append((6726,{
 'title':"Parts tab: a part whose name begins with the query ranks above one that only contains it",
 'custom_preconds':pre([f"1. {TRIGGER}",
   "2. Seed THREE inventory parts that match one query in three ways by their DESCRIPTION (the part's name): (A) description BEGINS with the query; (B) description CONTAINS the query part-way through; (C) matches only through a typo.",
   "3. Make the three IDENTICAL in every other respect: no stock, same bin location, never sold, never opened/viewed. Only the kind of name match differs."]),
 'custom_steps':steps(["1. Type the shared query and open the 'Parts' tab.",
   "2. Read the order of the three part rows."]),
 'custom_expected':expected([
   "Row 1 is part A (description begins with the query). Row 2 is part B (description contains it). Row 3 is part C (typo-only).",
   "The begins-with part is credited more strongly than the contains part, exactly as on the other tabs; nothing else differs, so match strength alone decides the order."],
   SRC("a part's description is its primary name; a prefix match on it scores +0.70 vs +0.50 for a whole-word match"),
   "Note: direct regression for story defect SV-10279 (the Parts tab did not credit a begins-with match, while Customers/Vendors/Assets did).")}))

# VENDORS
cases.append((6726,{
 'title':"Vendors tab: a vendor whose name begins with the query ranks above one that only contains it",
 'custom_preconds':pre([f"1. {TRIGGER}",
   "2. Seed THREE vendors that match one query three ways by NAME: (A) name BEGINS with the query; (B) name CONTAINS it part-way; (C) typo-only.",
   "3. Make the three IDENTICAL otherwise: no open purchase orders, not used recently. Only the match type differs."]),
 'custom_steps':steps(["1. Type the shared query and open the 'Vendors' tab.",
   "2. Read the order of the three vendor rows."]),
 'custom_expected':expected([
   "Row 1 begins-with, row 2 contains, row 3 typo-only. The begins-with vendor is ranked highest; match strength alone decides the order."],
   SRC("prefix match on the vendor's primary name scores +0.70 vs +0.50 for a whole-word match"),
   "Note: proves the prefix rule on the Vendors tab in its own right (SV-10279 showed the rule can break per entity).")}))

# ASSETS
cases.append((6726,{
 'title':"Assets tab: a vehicle whose name begins with the query ranks above one that only contains it",
 'custom_preconds':pre([f"1. {TRIGGER}",
   "2. Seed THREE vehicles (assets) that match one query three ways by their displayed name (year/make/model): (A) the name BEGINS with the query; (B) it CONTAINS the query part-way; (C) typo-only.",
   "3. Make the three IDENTICAL otherwise: no open work orders, not viewed recently, same year band. Only the match type differs."]),
 'custom_steps':steps(["1. Type the shared query and open the 'Assets' tab.",
   "2. Read the order of the three asset rows."]),
 'custom_expected':expected([
   "Row 1 begins-with, row 2 contains, row 3 typo-only. The begins-with vehicle is ranked highest; match strength alone decides the order."],
   SRC("prefix match on the asset's primary name scores +0.70 vs +0.50 for a whole-word match"),
   "Note: proves the prefix rule on the Assets tab in its own right (SV-10279 showed the rule can break per entity).")}))

created=[]
for sec,payload in cases:
    payload['custom_automation_type']=TYPE; payload['custom_atmstatus']=1
    r=post(f"add_case/{sec}",payload)
    created.append({'id':r['id'],'section':sec,'title':payload['title']})
    print(f"C{r['id']} | {payload['title']}")
json.dump(created, open('/home/user/Manual-test-Cases/build/global-search/per-tab-prefix-cases-2026-09-20.json','w'), indent=2)
print("IDS",[c['id'] for c in created])
