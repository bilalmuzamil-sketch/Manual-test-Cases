#!/usr/bin/env python3
"""7 strict permission cases (2026-09-18): PC-1..PC-6 same-record toggle + PC-7 count precision. Folder 6734."""
import json, urllib.request, base64
creds = json.load(open('/tmp/testrail/creds.json'))
AUTH = base64.b64encode(f"{creds['user']}:{creds['password']}".encode()).decode()
def post(path, payload):
    req = urllib.request.Request(f"https://shopview.testrail.io/index.php?/api/v2/{path}",
        data=json.dumps(payload).encode(), headers={'Authorization':f'Basic {AUTH}','Content-Type':'application/json'}, method='POST')
    return json.load(urllib.request.urlopen(req))
TRIGGER = ("Sign in to ShopView. In the app header, click the search field (or press ⌘K / Ctrl+K) "
           "to open the global search, which searches across work orders, customers, parts and more; "
           "results appear grouped by type under a tab strip.")
def pre(lines):  return "<p>" + "<br>".join(lines) + "</p>"
def steps(lines): return "<p>" + "<br>".join(lines) + "</p>"
def expected(body, note):
    src=("This is the expected behaviour as per epic SV-9160 and the Global Search - Product Requirements "
         "specification version 1.5 (Confluence page 576978945), section 9 (results, group counts and scope "
         "tabs are all filtered by the user's permissions), read on 18 September 2026.")
    paras="".join(f"<p>{p}</p>" for p in body)
    return paras + f"<hr><p>{src}</p><p>{note}</p><p>Newly authored on 18 September 2026 to close a coverage gap; not yet build-verified.</p><p>AUTOMATION: READY</p>"

def toggle_case(thing_seed, bundle, view_step_extra, appears, hidden, note):
    return {
     'custom_preconds':pre([f"1. {TRIGGER}",
        f"2. Seed ONE specific {thing_seed} tagged ZZAUTOTEST that matches a unique query.",
        f"3. Have TWO roles that are identical in every way EXCEPT the '{bundle}' access: one WITH it, one WITHOUT it (or one user whose '{bundle}' access you can turn off between the two runs). Use the SAME query for both runs so only the permission differs."]),
     'custom_steps':steps([
        f"1. As the role WITH '{bundle}' access, type the query{view_step_extra} and confirm the seeded record appears.",
        f"2. Switch to the identical role WITHOUT '{bundle}' access (or turn that access off for the same user), type the SAME query, and look for the SAME record.",
        "3. Allow a moment for the index if the record was just seeded before deciding it is absent."]),
     'custom_expected':expected([appears, hidden,
        "Nothing else changed between the two runs, so the record can only have disappeared because the permission was removed."], note)}
TYPE=2
cases=[]

cases.append((6734, dict(title="Flipping only Parts access shows then hides the same part in search",
  **toggle_case("part","Catalog & Inventory: View","",
    "With access, the seeded part appears in the 'Parts' group and its scope tab.",
    "Without access, the SAME part is gone: no 'Parts' group, no row, no count for it.",
    "Same-record toggle: rules out 'the part did not exist / did not match / had not indexed' as the reason it was hidden."))))

cases.append((6734, dict(title="Flipping only Work Orders access shows then hides the same work order",
  **toggle_case("work order","Work Orders: View","",
    "With access, the seeded work order appears in the 'Work orders' group and its scope tab.",
    "Without access, the SAME work order is gone: no group, no row, no count for it.",
    "Same-record toggle for the Work Orders bundle."))))

cases.append((6734, dict(title="Flipping only Customers access shows then hides the same customer and its vehicle",
  **toggle_case("customer that also has one vehicle (asset)","Customers: View","",
    "With access, BOTH the seeded customer (Customers group) AND its vehicle (Assets group) appear.",
    "Without access, BOTH the SAME customer and the SAME vehicle are gone — the one bundle gates them together.",
    "Same-record toggle proving the Customers bundle gates Customers AND Assets together."))))

cases.append((6734, dict(title="Flipping only Part Sales access shows then hides the same part sale",
  **toggle_case("part sale","Part Sales: View","",
    "With access, the seeded part sale appears in the 'Part Sales' group and its scope tab.",
    "Without access, the SAME part sale is gone: no group, no row, no count for it.",
    "Same-record toggle for the Part Sales bundle."))))

cases.append((6734, dict(title="Flipping only Vendor & Order Management access hides the same vendor, PO and invoice",
  **toggle_case("vendor that has one purchase order and one vendor invoice","Vendor & Order Management: View","",
    "With access, the seeded vendor, its purchase order AND its vendor invoice all appear in their three groups.",
    "Without access, all THREE of the SAME records are gone — the one bundle gates all three together.",
    "Same-record toggle proving the Vendor & Order Management bundle gates Vendors, Purchase Orders and Vendor Invoices together."))))

# PC-6 See Financial Data price toggle (same row)
cases.append((6734, {
 'title':"Flipping only See Financial Data shows then masks the price on the same row",
 'custom_preconds':pre([f"1. {TRIGGER}",
   "2. Seed ONE specific priced record (for example a part with a price) tagged ZZAUTOTEST that matches a unique query.",
   "3. Have TWO roles identical except for 'See Financial Data': one WITH it, one WITHOUT it (or one user you can toggle). Use the SAME query for both runs."]),
 'custom_steps':steps([
   "1. As the role WITH 'See Financial Data', type the query and read the price on the seeded record's row.",
   "2. Switch to the identical role WITHOUT 'See Financial Data', type the SAME query, and read the SAME row."]),
 'custom_expected':expected([
   "With the permission, the row shows the real price.",
   "Without the permission, the SAME row appears but its price is masked (the row itself is still shown; only the price is hidden).",
   "Only the 'See Financial Data' permission changed between the two runs, so the price masking can only be that permission at work."],
   "Same-row toggle: proves See Financial Data gates the PRICE specifically, while the row still shows.")}))

# PC-7 count precision
cases.append((6734, {
 'title':"A restricted record is not counted in any visible group's count",
 'custom_preconds':pre([f"1. {TRIGGER}",
   "2. Seed records matching one query such that, for a chosen role, SOME records of a type are accessible and at least one matching record of that type is NOT accessible to that role.",
   "3. Know the exact number the role is allowed to see."]),
 'custom_steps':steps([
   "1. As that role, type the query.",
   "2. Read the count shown on the group heading and on the scope tab for that type, and count the rows actually shown."]),
 'custom_expected':expected([
   "The count on the group heading and scope tab equals exactly the number of records the role may see; the restricted record is neither counted nor shown.",
   "A record the role cannot access does not inflate or leak into any visible count."],
   "Guards the count path: a hidden record must not still be counted (the count is filtered by permission, not just the rows).")}))

created=[]
for sec,payload in cases:
    payload['custom_automation_type']=TYPE; payload['custom_atmstatus']=1
    r=post(f"add_case/{sec}",payload)
    created.append({'id':r['id'],'section':sec,'title':payload['title']})
    print(f"C{r['id']} | {payload['title']}")
json.dump(created, open('/home/user/Manual-test-Cases/build/global-search/perm-strict-cases-2026-09-18.json','w'), indent=2)
print("IDS", [c['id'] for c in created])
