#!/usr/bin/env python3
"""7 new Global Search algorithm cases (2026-09-18): NEW-1 strict prefix regression (SV-10211),
F-a..F-d fuzzy edges (6725), R-a/R-b ranking edges (6726)."""
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

# NEW-1 strict prefix regression (Ranking 6726)
cases.append((6726, {
 'title':"Prefix name match ranks above a whole-word match with all other signals held equal",
 'custom_preconds':pre([f"1. {TRIGGER}",
   "2. Seed THREE customers that match one query in three different ways: (A) the name BEGINS with the query; (B) the name CONTAINS the query as a whole word part-way through; (C) the name matches only through a typo.",
   "3. Make the three customers IDENTICAL in every other respect: same address, same telephone, no contacts, no open work orders, none opened/viewed recently. Only the kind of name match differs, so nothing else can decide the order."]),
 'custom_steps':steps(["1. Type the shared query and open the 'Customers' tab.",
   "2. Read the order of the three customer rows."]),
 'custom_expected':expected([
   "Row 1 is customer A (name begins with the query). Row 2 is customer B (name contains the query as a whole word). Row 3 is customer C (typo-only match).",
   "Because the three are identical in every other respect, the order is decided purely by match strength: begins-with beats contains, which beats a typo."],
   SRC("section 6.1","match-quality: prefix match on the primary name is stronger than a whole-word match, which is stronger than a fuzzy match"),
   "Note: strict regression for the fix on story defect SV-10211, where a begins-with match and a contains match were scored identically. All other signals are held equal on purpose so this can only pass if the begins-with rule truly works.")}))

# F-a unrelated returns nothing (Fuzzy 6725)
cases.append((6725, {
 'title':"A clearly unrelated query returns no close (fuzzy) match",
 'custom_preconds':pre([f"1. {TRIGGER}",
   "2. A record exists with a distinctive name (for example a customer named 'Aabridge Freight')."]),
 'custom_steps':steps(["1. Type a query that is clearly UNRELATED to that name, not just a small typo of it (for example 'Zqwxpol').",
   "2. Read the results."]),
 'custom_expected':expected([
   "The record is NOT returned. Close (typo) matching only catches near-misses; a query that is too different returns no results, or only genuinely related records.",
   "The search does not return unrelated records just because a few letters overlap."],
   SRC("section 7","fuzzy eligibility thresholds: only sufficiently similar candidates match; a too-different query is not a fuzzy match"),
   "Note: guards against over-greedy matching (the 'search suddenly returns garbage' failure). We test that typos DO match; this proves non-matches do NOT.")}))

# F-b diacritics (Fuzzy 6725)
cases.append((6725, {
 'title':"An accented name matches with or without the accent",
 'custom_preconds':pre([f"1. {TRIGGER}",
   "2. A customer exists whose name contains accented letters (for example 'Jose Martinez' spelled with accents on the e and the i)."]),
 'custom_steps':steps(["1. Type the name WITHOUT the accents (for example 'Jose Martinez') and read the results.",
   "2. Clear the box, type it WITH the accents, and read the results."]),
 'custom_expected':expected([
   "Both forms find the same customer. Accents are ignored for matching, so the accented and plain spellings match each other."],
   SRC("section 7","normalization strips diacritics from both the query and the indexed text"),
   "Note: accent handling is a common breakage point and was not exercised by any existing case.")}))

# F-c hyphen/apostrophe (Fuzzy 6725)
cases.append((6725, {
 'title':"A name with a dash or apostrophe matches with or without it",
 'custom_preconds':pre([f"1. {TRIGGER}",
   "2. A record exists whose name contains an apostrophe or a hyphen (for example a customer 'O'Brien Haulage' or 'Smith-Jones Motors')."]),
 'custom_steps':steps(["1. Type the name WITHOUT the apostrophe/hyphen (for example 'OBrien Haulage' or 'Smith Jones Motors') and read the results.",
   "2. Clear the box, type it WITH the apostrophe/hyphen, and read the results."]),
 'custom_expected':expected([
   "Both forms find the same record. Hyphens and apostrophes are optional in name matching, so 'OBrien' finds 'O'Brien' and 'Smith Jones' finds 'Smith-Jones'."],
   SRC("section 7","name normalization treats hyphens and apostrophes as optional"),
   "Note: name punctuation normalization was not exercised by any existing case.")}))

# F-d phonetic names-only (Fuzzy 6725)
cases.append((6725, {
 'title':"Sound-alike matching applies to names only, not to part numbers or descriptions",
 'custom_preconds':pre([f"1. {TRIGGER}",
   "2. A part exists whose description contains a distinctive word (for example 'Alternator')."]),
 'custom_steps':steps(["1. Type a word that merely SOUNDS LIKE the description word but is not a close spelling of it (a sound-alike, not a one- or two-letter typo).",
   "2. Read the results."]),
 'custom_expected':expected([
   "The part is NOT returned by the sound-alike. Sound-alike (phonetic) matching is reserved for customer, vendor and contact NAMES; it is never applied to part numbers or descriptions.",
   "A genuine close-spelling typo of the description would still match (that is ordinary typo tolerance); only the sound-alike-on-a-non-name path is excluded here."],
   SRC("section 7","the phonetic fallback applies to names only, as a last resort; it does not apply to descriptions or identifiers"),
   "Note: guards against phonetic matching being over-applied to non-name fields.")}))

# R-a exact-ID always wins / pinned above a strong name match (Ranking 6726)
cases.append((6726, {
 'title':"An exact identifier match is pinned at the very top even when a strong name match exists",
 'custom_preconds':pre([f"1. {TRIGGER}",
   "2. Seed a record with a known exact identifier (for example a work order with a known number).",
   "3. Also seed one or more OTHER records that strongly match the SAME typed text by name (for example a customer whose name begins with that same text), so there is a strong competing name match."]),
 'custom_steps':steps(["1. Type the exact identifier.",
   "2. Look at the very top of the results (the single pinned row) and at the groups below."]),
 'custom_expected':expected([
   "The record matched on its exact identifier is pinned as the single row at the very top, above all the groups, even though a strong name match for the same text also exists.",
   "An exact identifier match effectively always wins and is shown first."],
   SRC("section 6.1 and section 6.2","an exact identifier match scores highest and is pinned as a single row above the groups"),
   "Note: strengthens the pinned-top-hit coverage by adding a strong competing name match, the situation a ranking regression would disturb.")}))

# R-b beyond-20 unreachable (Ranking 6726)
cases.append((6726, {
 'title':"A matching record ranked below the top 20 is not shown until the query is narrowed",
 'custom_preconds':pre([f"1. {TRIGGER}",
   "2. Seed MORE THAN 20 records of one type that all match a broad query, with one specific target record that ranks low (below the top 20) for that broad query.",
   "3. Ensure a NARROWER query exists that matches the target and only a few others."]),
 'custom_steps':steps(["1. Type the broad query and open that type's scope tab (it shows at most 20 rows).",
   "2. Confirm the target record is NOT in the list.",
   "3. Narrow the query so far fewer records match, and read the list again."]),
 'custom_expected':expected([
   "On the broad query the scope tab shows at most 20 rows and the low-ranked target is not shown (there is no pagination or load-more).",
   "After narrowing the query, the target record appears. Reaching a record beyond the top 20 means narrowing the query; ranking decides what is reachable."],
   SRC("section 5.2 and section 6.1","a scope tab shows up to 20 rows with no pagination; ranking decides whether a record is reachable"),
   "Note: covers the cap-and-ranking interaction, where a low-ranked record can be unreachable.")}))

created=[]
for sec,payload in cases:
    payload['custom_automation_type']=TYPE; payload['custom_atmstatus']=1
    r=post(f"add_case/{sec}",payload)
    created.append({'id':r['id'],'section':sec,'title':payload['title']})
    print(f"C{r['id']} <- {sec} | {payload['title']}")
json.dump(created, open('/home/user/Manual-test-Cases/build/global-search/algo-regression-cases-2026-09-18.json','w'), indent=2)
print("IDS", [c['id'] for c in created])
