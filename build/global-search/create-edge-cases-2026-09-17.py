#!/usr/bin/env python3
"""Complete the Global Search permissions + search-logic suites (2026-09-17).
4 grounded edge cases: SL1/SL2 (Fuzzy 6725), SL3 (Ranking 6726), P1 (Permissions 6734)."""
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
def expected(body, source, note, marker="AUTOMATION: READY"):
    paras = "".join(f"<p>{p}</p>" for p in body)
    prov = f"<hr><p>{source}</p><p>{note}</p><p>Newly authored on 17 September 2026 to close a coverage gap; not yet build-verified.</p><p>{marker}</p>"
    return paras + prov
def SRC6(d): return ("This is the expected behaviour as per epic SV-9160 and the Global Search - Product Requirements "
    f"specification version 1.5 (Confluence page 576978945), section 6.1 ({d}), read on 17 September 2026.")
def SRC7(d): return ("This is the expected behaviour as per epic SV-9160 and the Global Search - Product Requirements "
    f"specification version 1.5 (Confluence page 576978945), section 7 ({d}), read on 17 September 2026.")

TYPE=2
cases=[]

# SL1 — PO number + Vendor Invoice number are exact-only (Fuzzy 6725)
cases.append((6725, {
 'title':"A Purchase Order number and a Vendor Invoice number require an exact match (no fuzzy tolerance)",
 'custom_preconds':pre([f"1. {TRIGGER}",
    "2. A Purchase Order exists with a known number (for example PO-3241) and a Vendor Invoice exists with a known number (for example S9-25987)."]),
 'custom_steps':steps([
    "1. Type the exact Purchase Order number and read the result; then type that number with one wrong character and read the result.",
    "2. Type the exact Vendor Invoice number and read the result; then type that number with one wrong character and read the result."]),
 'custom_expected':expected([
    "1. The exact Purchase Order number finds the matching purchase order (the dash or a space is ignored). A one-character-off Purchase Order number does NOT return it as a typo match.",
    "2. The exact Vendor Invoice number finds the matching vendor invoice. A one-character-off invoice number does NOT return it as a typo match.",
    "These numbers are exact-only identifiers, like a work order number or a VIN: a near miss is treated as a different number, not a typo."],
    SRC7("what is not fuzzy: Purchase Order number and invoice number bypass fuzzy logic and require an exact match after normalization"),
    "Note: extends the exact-only identifier coverage (work order number, VIN, part number, part-sale number) to purchase order and vendor invoice numbers.")}))

# SL2 — fuzzy matching works on a part's description text (Fuzzy 6725)
cases.append((6725, {
 'title':"A misspelled word in a part's description still finds the part",
 'custom_preconds':pre([f"1. {TRIGGER}",
    "2. A part exists whose description contains a distinctive word (for example a part described as 'Alternator assembly')."]),
 'custom_steps':steps([
    "1. Type a misspelled version of a word from the part's description (for example 'Altenator', missing an 'r').",
    "2. Read the result rows."]),
 'custom_expected':expected([
    "The part is still found through its description despite the typo, and the matched part of the text is highlighted.",
    "Typo tolerance applies to a part's description text, not only to names."],
    SRC7("trigram indexes are built on part descriptions, so a typo in a description word still matches"),
    "Note: fuzzy coverage previously exercised names only; this covers description text.")}))

# SL3 — recency tie-break (Ranking 6726)
cases.append((6726, {
 'title':"When two results are otherwise equal, the most recently updated one ranks first",
 'custom_preconds':pre([f"1. {TRIGGER}",
    "2. Seed two records of the same entity type that match one query equally well (same kind of match, and neither has any ranking advantage over the other) EXCEPT that one was updated more recently than the other."]),
 'custom_steps':steps([
    "1. Type the shared query.",
    "2. Read the order of the two rows within the group."]),
 'custom_expected':expected([
    "The record that was updated more recently appears first. When everything else is equal, the more recently updated record wins the tie."],
    SRC6("ties are broken by recency: the most recently updated record wins"),
    "Note: covers the final tie-break rule on its own.")}))

# P1 — recent-searches list respects current access (Permissions 6734)
cases.append((6734, {
 'title':"The recent-searches list only shows records the person can currently access",
 'custom_preconds':pre([f"1. {TRIGGER}",
    "2. As a person with access to an area (for example work orders), open a record of that type so it enters the recent-searches list.",
    "3. Then change that person's role so they no longer have access to that area (or sign in as a comparable person who lacks it), and open global search with the box empty so the recent list shows."]),
 'custom_steps':steps([
    "1. Open global search with an empty box so the recent-searches list is shown.",
    "2. Look for the record whose area the person can no longer access."]),
 'custom_expected':expected([
    "The record the person can no longer access does NOT appear in the recent-searches list. The recent list obeys the person's current access, exactly as live search results do."],
    ("This is the expected behaviour as per epic SV-9160 and the Global Search - Product Requirements "
     "specification version 1.5 (Confluence page 576978945), section 9 (all result fields respect role-based-access checks) "
     "together with section 8 (recent views are shown using the same result rows), read on 17 September 2026."),
    "Note: a derived safety invariant. The spec states that result fields respect access (section 9) and that recent views reuse the result rows (section 8); this case asserts the recent list applies the same access check, to stop a now-forbidden record leaking there. Worth a quick product-owner confirmation.")}))

created=[]
for sec,payload in cases:
    payload['custom_automation_type']=TYPE; payload['custom_atmstatus']=1
    r=post(f"add_case/{sec}",payload)
    created.append({'id':r['id'],'section':sec,'title':payload['title']})
    print(f"C{r['id']} <- section {sec} | {payload['title']}")
json.dump(created, open('/home/user/Manual-test-Cases/build/global-search/edge-cases-2026-09-17.json','w'), indent=2)
print("\nCREATED", [c['id'] for c in created])
