#!/usr/bin/env python3
"""Create 12 Global Search cases (2026-09-17): 5 positive-permission + 6 ranking + 1 fuzzy.
Mirrors C44877 fr-view-safe shape. Lands in escaping container via API; UI-repair to fr-view follows."""
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

def pre(lines):
    return "<p>" + "<br>".join(lines) + "</p>"
def steps(lines):
    return "<p>" + "<br>".join(lines) + "</p>"
def expected(body_paras, source_sentence, sec_note):
    paras = "".join(f"<p>{p}</p>" for p in body_paras)
    prov = (f"<hr><p>{source_sentence}</p>"
            f"<p>{sec_note}</p>"
            "<p>Newly authored on 17 September 2026 to close a coverage gap; not yet build-verified.</p>"
            "<p>AUTOMATION: READY</p>")
    return paras + prov

SRC9 = ("This is the expected behaviour as per epic SV-9160 and the Global Search - Product Requirements "
        "specification version 1.5 (Confluence page 576978945), section 9 (all result fields respect "
        "role-based-access checks), read on 17 September 2026.")
def SRC6(detail):
    return ("This is the expected behaviour as per epic SV-9160 and the Global Search - Product Requirements "
            f"specification version 1.5 (Confluence page 576978945), section 6.1 ({detail}), read on 17 September 2026.")
def SRC7(detail):
    return ("This is the expected behaviour as per epic SV-9160 and the Global Search - Product Requirements "
            f"specification version 1.5 (Confluence page 576978945), section 7 ({detail}), read on 17 September 2026.")

TYPE = 2  # Functional
cases = []

# ---------- 5 POSITIVE-PERMISSION (section 6734) ----------
cases.append((6734, {
 'title': "A user WITH Work Orders access sees Work Order results in the palette",
 'custom_preconds': pre([f"1. {TRIGGER}",
    "2. You are signed in as a user whose role includes 'Work Orders: View' access.",
    "3. Work Orders exist that match the query."]),
 'custom_steps': steps(["1. In the search box, open the palette and type a query that matches work orders.",
    "2. Read the results on the 'All' tab and open the 'Work Orders' scope tab."]),
 'custom_expected': expected([
    "A 'Work orders' group appears with matching work-order rows and its count.",
    "The 'Work Orders' scope tab shows the same results. A permitted user is NOT wrongly hidden their own work orders."],
    SRC9, "Note: this covers the POSITIVE direction (with the permission, the group must appear) for the Work Orders: View bundle.")}))

cases.append((6734, {
 'title': "A user WITH Customers access sees Customer and Asset results in the palette",
 'custom_preconds': pre([f"1. {TRIGGER}",
    "2. You are signed in as a user whose role includes 'Customers: View' access.",
    "3. Customers AND their vehicles (assets) exist that match the query."]),
 'custom_steps': steps(["1. In the search box, open the palette and type a query that matches customers and their vehicles.",
    "2. Read the 'All' tab, then open the 'Customers' and 'Assets' scope tabs."]),
 'custom_expected': expected([
    "A 'Customers' group AND an 'Assets' group both appear with matching rows and counts.",
    "Their scope tabs show the results. The 'Customers: View' bundle gates Customers and Assets together, so a permitted user must see BOTH."],
    SRC9, "Note: positive direction for the Customers: View bundle, which covers Customers and Assets together.")}))

cases.append((6734, {
 'title': "A user WITH Part Sales access sees Part Sale results in the palette",
 'custom_preconds': pre([f"1. {TRIGGER}",
    "2. You are signed in as a user whose role includes 'Part Sales: View' access.",
    "3. Part Sales exist that match the query."]),
 'custom_steps': steps(["1. In the search box, open the palette and type a query that matches part sales.",
    "2. Read the 'All' tab and open the 'Part Sales' scope tab."]),
 'custom_expected': expected([
    "A 'Part Sales' group appears with matching part-sale rows and its count.",
    "The 'Part Sales' scope tab shows the same results. A permitted user is not wrongly hidden their part sales."],
    SRC9, "Note: positive direction for the Part Sales: View bundle.")}))

cases.append((6734, {
 'title': "A user WITH Vendor & Order Management access sees Vendor, Purchase Order and Vendor Invoice results",
 'custom_preconds': pre([f"1. {TRIGGER}",
    "2. You are signed in as a user whose role includes 'Vendor & Order Management: View' access.",
    "3. Vendors, Purchase Orders AND Vendor Invoices exist that match the query."]),
 'custom_steps': steps(["1. In the search box, open the palette and type a query that matches vendors, purchase orders and vendor invoices.",
    "2. Read the 'All' tab, then open the 'Vendors', 'Purchase Orders' and 'Vendor Invoices' scope tabs."]),
 'custom_expected': expected([
    "A 'Vendors' group, a 'Purchase Orders' group AND a 'Vendor Invoices' group all appear with rows and counts.",
    "Their scope tabs show the results. The one 'Vendor & Order Management: View' bundle gates all three, so a permitted user must see all three."],
    SRC9, "Note: positive direction for the Vendor & Order Management: View bundle, which covers Vendors, Purchase Orders and Vendor Invoices together.")}))

cases.append((6734, {
 'title': "A user WITH See Financial Data sees prices in search result rows",
 'custom_preconds': pre([f"1. {TRIGGER}",
    "2. You are signed in as a user whose role includes 'See Financial Data'.",
    "3. Records with prices exist that match the query: a part with a price, a part sale with a total, a work order with a total, a purchase order with a total, and a vendor invoice with a total."]),
 'custom_steps': steps(["1. In the search box, type a query that matches those priced records.",
    "2. Read the price fields in the result rows (part price, part-sale total, work-order total, purchase-order total, vendor-invoice total)."]),
 'custom_expected': expected([
    "Every price field shows its real value and none is masked: part purchase/sell price, part-sale total, work-order total, purchase-order total and vendor-invoice total are all visible.",
    "This is the positive inverse of the masking rule: with 'See Financial Data', prices ARE shown."],
    SRC9, "Note: 'See Financial Data' gates prices inside result rows; this covers the positive direction (with the permission, prices are shown), the inverse of the masked case.")}))

# ---------- 6 RANKING (section 6726) ----------
cases.append((6726, {
 'title': "A prefix name match ranks above a whole-word match, which ranks above a fuzzy match",
 'custom_preconds': pre([f"1. {TRIGGER}",
    "2. Seed three records of the SAME entity type that all match one query in different ways: (a) one whose primary name STARTS with the query (prefix match); (b) one where the query appears as a whole word somewhere other than the start of the name (whole-word match); (c) one that only matches through a typo (fuzzy match).",
    "3. None of the three is an exact identifier match, so match quality alone decides the order."]),
 'custom_steps': steps(["1. In the search box, type the shared query.",
    "2. Read the order of the three rows within the group."]),
 'custom_expected': expected([
    "The record whose name STARTS with the query ranks highest, the whole-word match ranks next, and the typo-only (fuzzy) match ranks lowest.",
    "This reflects match quality: a prefix name match is strongest, a whole-word match is weaker, and a fuzzy match is weakest. If an exact identifier match were present it would pin above all of them."],
    SRC6("match-quality component: prefix name match stronger than whole-word match, stronger than fuzzy match"),
    "Note: this is the core 'best result on top' ordering and the most sensitive ranking behaviour.")}))

cases.append((6726, {
 'title': "Customers with an open work order and recently viewed rank higher",
 'custom_preconds': pre([f"1. {TRIGGER}",
    "2. Seed two customers that match one query: one that has at least one open work order (and that you have opened recently), and one that has no open work order and you have not opened."]),
 'custom_steps': steps(["1. In the search box, type the shared query.",
    "2. Read the order of the two customer rows."]),
 'custom_expected': expected([
    "The customer that has an open work order and that you viewed recently ranks above the customer with neither.",
    "Having open work orders (and being recently opened by the signed-in user) lifts a customer up the list."],
    SRC6("Customers signals: open work orders and recent views boost a customer"),
    "Note: positive ranking coverage for the Customers entity, not previously tested.")}))

cases.append((6726, {
 'title': "Assets with an open work order (and recently viewed) rank higher",
 'custom_preconds': pre([f"1. {TRIGGER}",
    "2. Seed two vehicles (assets) that match one query: one attached to an open work order (and/or opened by you recently), and one with no open work order that you have not opened."]),
 'custom_steps': steps(["1. In the search box, type the shared query.",
    "2. Read the order of the two asset rows."]),
 'custom_expected': expected([
    "The asset attached to an open work order (and/or viewed recently) ranks above the other.",
    "A newer model year only breaks a tie; it does not by itself outrank an open-work-order asset."],
    SRC6("Assets signals: open work order and recent views boost; newer year is a tie-breaker only"),
    "Note: positive ranking coverage for the Assets entity, not previously tested.")}))

cases.append((6726, {
 'title': "Vendors with open purchase orders (and recently used) rank higher",
 'custom_preconds': pre([f"1. {TRIGGER}",
    "2. Seed two vendors that match one query: one with open purchase orders (and/or used in the last 30 days), and one with none."]),
 'custom_steps': steps(["1. In the search box, type the shared query.",
    "2. Read the order of the two vendor rows."]),
 'custom_expected': expected([
    "The vendor with open purchase orders (and/or used recently) ranks above the vendor with none."],
    SRC6("Vendors signals: open purchase orders and recent use boost a vendor"),
    "Note: positive ranking coverage for the Vendors entity, not previously tested.")}))

cases.append((6726, {
 'title': "Recent part sales, yours, and paid ones rank higher",
 'custom_preconds': pre([f"1. {TRIGGER}",
    "2. Seed several part sales that match one query: a very recently created one and an older one; one created by you; and one that is Paid."]),
 'custom_steps': steps(["1. In the search box, type the shared query.",
    "2. Read the order of the part-sale rows."]),
 'custom_expected': expected([
    "Recency dominates: a recently created part sale ranks well above an old one (the boost fades over roughly a week).",
    "A part sale you created gets a small extra lift, and a Paid part sale gets a small lift."],
    SRC6("Part Sales signals: recency dominates (about a 7-day half-life), created-by-you and Paid give small lifts"),
    "Note: positive ranking coverage for the Part Sales entity, not previously tested.")}))

cases.append((6726, {
 'title': "Recently sold and recently viewed parts rank higher",
 'custom_preconds': pre([f"1. {TRIGGER}",
    "2. Seed two in-stock parts that match one query: one that was sold or used on a work order in the last 30 days (and/or that you opened recently), and one with no recent activity."]),
 'custom_steps': steps(["1. In the search box, type the shared query.",
    "2. Read the order of the two part rows."]),
 'custom_expected': expected([
    "The part sold or used recently (and/or viewed recently) ranks above an equally-matching part with no recent activity; a part that has a bin location gets a small extra lift.",
    "This is separate from the in-stock-above-out-of-stock rule, which is covered elsewhere."],
    SRC6("Parts signals: recent sales/use frequency, recent views and a present bin location boost a part"),
    "Note: extends Parts ranking coverage beyond the in-stock rule already tested.")}))

# ---------- 1 FUZZY (section 6725) ----------
cases.append((6725, {
 'title': "A very short query does not produce noisy fuzzy matches",
 'custom_preconds': pre([f"1. {TRIGGER}",
    "2. Seed a record whose short name is one letter away from a 2 to 3 letter query, and a record whose longer name (4 or more letters) is the same single edit away from a longer query."]),
 'custom_steps': steps(["1. In the search box, type a 2 to 3 letter query that is one letter off the short name; read the results.",
    "2. Clear the input, type the longer query that is the same single edit off the longer name; read the results."]),
 'custom_expected': expected([
    "The 2 to 3 letter query does NOT surface the loose typo match: short queries need a closer match to count, so noisy 2 to 3 letter fuzzy matches are avoided.",
    "The longer query (4 or more letters) with the same single edit DOES return its fuzzy match."],
    SRC7("edit-distance thresholds: a closer match is required for queries shorter than 4 characters than for longer ones, to avoid noisy short matches"),
    "Note: closes the short-query threshold gap in fuzzy matching.")}))

created = []
for sec, payload in cases:
    payload['custom_automation_type'] = TYPE
    payload['custom_atmstatus'] = 1
    r = post(f"add_case/{sec}", payload)
    created.append({'id': r['id'], 'section': sec, 'title': payload['title']})
    print(f"C{r['id']} <- section {sec} | {payload['title']}")

json.dump(created, open('/home/user/Manual-test-Cases/build/global-search/new-cases-2026-09-17.json','w'), indent=2)
print("\nCREATED", len(created), "cases; ids:", [c['id'] for c in created])
