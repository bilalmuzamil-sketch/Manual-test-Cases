#!/usr/bin/env python3
"""Add 6 Global Search cases (2026-09-18): PERM-A..D (6734) + SL-1, SL-2 (6726)."""
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
def expected(body, source, note):
    paras = "".join(f"<p>{p}</p>" for p in body)
    prov = (f"<hr><p>{source}</p><p>{note}</p>"
            "<p>Newly authored on 18 September 2026 to close a coverage gap; not yet build-verified.</p>"
            "<p>AUTOMATION: READY</p>")
    return paras + prov
def SRC(secs, d):
    return ("This is the expected behaviour as per epic SV-9160 and the Global Search - Product Requirements "
            f"specification version 1.5 (Confluence page 576978945), {secs} ({d}), read on 18 September 2026.")
TYPE=2
cases=[]

# PERM-A
cases.append((6734, {
 'title':"Typing the exact number of a record you cannot access does not surface it (no pinned top hit)",
 'custom_preconds':pre([f"1. {TRIGGER}",
   "2. You are signed in as a user whose role does NOT include Work Orders access.",
   "3. A work order exists (visible to a permitted user) whose exact number you know."]),
 'custom_steps':steps(["1. Type that work order's exact number.",
   "2. Look at the very top of the results (the single pinned row area) and at the grouped results."]),
 'custom_expected':expected([
   "The work order you are not allowed to see is NOT shown: it is not pinned as the single row at the top, and it is not in any group.",
   "The exact-number match still obeys access. Typing the exact number of a record you cannot see does not surface it (you get no results, or only other records you are allowed to see)."],
   SRC("section 9 and section 6.2","the pinned exact-identifier top hit must still respect role-based access"),
   "Note: the exact-identifier path pins a result above the groups, so it needs its own access check.")}))

# PERM-B
cases.append((6734, {
 'title':"A contact-field match is hidden when you cannot access its parent company",
 'custom_preconds':pre([f"1. {TRIGGER}",
   "2. A customer exists that matches a query ONLY through one of its contacts (the contact's phone or email), not through the company's own name.",
   "3. You are signed in as a user whose role does NOT include Customers access. (The same idea applies to a vendor contact match and Vendor & Order Management access.)"]),
 'custom_steps':steps(["1. Type the contact's phone number or email value that matches only that customer's contact.",
   "2. Read the results."]),
 'custom_expected':expected([
   "No customer row appears for that contact match. A contact match returns the COMPANY row, and because you cannot see customers, that company is hidden — the contact does not leak it.",
   "A user WHO CAN see customers would see that company row labelled as a contact match."],
   SRC("section 4 and section 9","a contact-field match returns the parent company row and rides the parent company's view permission"),
   "Note: a contact match must be filtered by the parent company's access, not by the matched field alone.")}))

# PERM-C
cases.append((6734, {
 'title':"A role missing several access areas hides all of them together and keeps the rest",
 'custom_preconds':pre([f"1. {TRIGGER}",
   "2. You are signed in as a role that is missing MORE THAN ONE view area at once (for example no Work Orders access AND no Vendor & Order Management access).",
   "3. Records of many types match one query, including the areas the role lacks and areas it still has."]),
 'custom_steps':steps(["1. Type the shared query.",
   "2. Read the groups, their counts and the scope tabs."]),
 'custom_expected':expected([
   "Every area the role lacks is hidden together: no group, no count and no scope tab appears for any of them (for the example, neither Work Orders nor Vendors / Purchase Orders / Vendor Invoices).",
   "The areas the role still has appear normally, with correct counts."],
   SRC("section 9","results, counts and scope tabs are all filtered by the user's permissions"),
   "Note: real roles remove several areas at once; this tests a combination, not one area at a time.")}))

# PERM-D
cases.append((6734, {
 'title':"A typo search does not leak a record you cannot access",
 'custom_preconds':pre([f"1. {TRIGGER}",
   "2. A part exists (visible to a permitted user) whose name a typo query would match.",
   "3. You are signed in as a user whose role does NOT include Catalog & Inventory (parts) access."]),
 'custom_steps':steps(["1. Type a misspelled version of that part's name (a typo the fuzzy match would normally catch).",
   "2. Read the results."]),
 'custom_expected':expected([
   "The part you are not allowed to see is NOT returned by the typo match. Access is applied to fuzzy matches too, not only to exact matches.",
   "Records you ARE allowed to see still fuzzy-match normally."],
   SRC("section 9 and section 7","role-based access applies to fuzzy matches as well as exact matches"),
   "Note: fuzzy matching widens what is found, so it needs its own access check.")}))

# SL-1 (Ranking)
cases.append((6726, {
 'title':"A customer with more open work orders ranks above one with fewer",
 'custom_preconds':pre([f"1. {TRIGGER}",
   "2. Seed two customers that match one query equally by name, but one has MANY open work orders and the other has only one (or few), all else equal."]),
 'custom_steps':steps(["1. Type the shared query.",
   "2. Read the order of the two customer rows."]),
 'custom_expected':expected([
   "The customer with more open work orders ranks higher. The open-work-order count lifts a customer up the list, so more open jobs ranks above fewer when everything else is equal.",
   "(The effect is scaled, so a large gap in count matters more than a tiny one.)"],
   SRC("section 6.1","Customers signal: total open work-order count, log-scaled, lifts ranking"),
   "Note: extends the customer ranking coverage from 'has open work' to 'more open work ranks higher'.")}))

# SL-2 (Ranking)
cases.append((6726, {
 'title':"A result matched on its name ranks above one matched only on a secondary field",
 'custom_preconds':pre([f"1. {TRIGGER}",
   "2. Seed two customers that match one query: customer A's NAME contains the query; customer B matches only on a secondary field (for example its city or address), not on its name, all else equal."]),
 'custom_steps':steps(["1. Type the shared query.",
   "2. Read the order of the two customer rows."]),
 'custom_expected':expected([
   "Customer A, matched on its name, ranks above customer B, matched only on a secondary field.",
   "A match on the primary display name carries a small bonus that a match on a secondary field does not."],
   SRC("section 6.1","match-quality: a match on the primary display name gets a small bonus over a match on a secondary indexed field"),
   "Note: proves the primary-vs-secondary bonus for a normal record, beyond the contact-match case already covered.")}))

created=[]
for sec,payload in cases:
    payload['custom_automation_type']=TYPE; payload['custom_atmstatus']=1
    r=post(f"add_case/{sec}",payload)
    created.append({'id':r['id'],'section':sec,'title':payload['title']})
    print(f"C{r['id']} <- {sec} | {payload['title']}")
json.dump(created, open('/home/user/Manual-test-Cases/build/global-search/audit-cases-2026-09-18.json','w'), indent=2)
print("IDS", [c['id'] for c in created])
