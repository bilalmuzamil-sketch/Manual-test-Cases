import json,sys
from trlib import api

MODAL = ("1. Sign in to ShopView. In the app header click the <strong>Search</strong> box (it is a BUTTON, "
 "data-test-id <em>global_search_trigger</em>, not a typeable field) or press &#8984;K / Ctrl+K. Global search opens "
 "as a CENTRED MODAL over the page: a text input at the top, then a scope tab strip - All, Work orders, Customers, "
 "Assets, Parts, Vendors, Part sales, Purchase orders, Vendor invoices - each showing its own result count, then "
 "results grouped by type with a count beside each heading (e.g. \"Work orders (4)\"). Esc closes the modal. NOTE: "
 "group headings are SENTENCE case in the build (\"Work orders\", \"Part sales\"). If a group shows nothing, click "
 "that entity's scope tab to confirm it really is 0 rather than scrolling. <em>Modal behaviour verified on the V2 QA "
 "branch sv9160 on 14 September 2026.</em>")

DATA = ("<br>1. Two customers exist, both created by the seeding script "
 "(<em>build/global-search/seeding/seed.py</em> - run it after every redeploy or this test is meaningless): "
 "<strong>ZZAUTOTEST Marlene Freight Lines</strong> and <strong>ZZAUTOTEST Darlene Cartage</strong>."
 "<br>2. These two names differ by exactly ONE letter - M against D. That is the whole point of the pair: one of "
 "them contains the word you are going to type and the other does not."
 "<br>3. Wait about 30 seconds after seeding before searching, so both records are in the search index.")

FAILBLOCK = ("<strong>IF THIS FAILS:</strong> it is a real V1-to-V2 capability loss. Mark the test Blocked with the "
 "exact query you typed and what came back, and flag it - a task ticket goes to the Product Owner to confirm whether "
 "the loss is acceptable. Do not raise it as a defect until the PO has ruled, and do not pass the test just because "
 "the V2 specification allows the new behaviour.")

def source(v1line, v2line):
    return ("<p>---<br><strong>SOURCE - THIS CASE IS TESTED AGAINST V1, NOT AGAINST THE V2 SPECIFICATION.</strong><br>"
     "This is the expected behaviour as per <strong>the V1 product itself</strong>: the ShopView product repository at "
     "commit <strong>55767168</strong>, " + v1line +
     "<br>For this V1 regression suite the shipped V1 product IS the specification (Standing Rule 109). "
     "<strong>Epic SV-9160 is the project this work belongs to, not the source of this expectation</strong>, and "
     "anything quoted below from the V2 requirements is context only - never the authority for this case. " + v2line +
     "<br>Standing Rule 96 makes a V1 capability the default expectation and Standing Rule 58 makes a "
     "code-versus-document conflict a PO DECISION ITEM, so this case asserts the V1 behaviour and tells you to record "
     "and flag rather than guess.<br><br>AUTOMATION: READY - Last checked against the V2 QA branch sv9160 on 14/9/2026</p>")

cases=[]

# ---------------- Case 1 : precision -------------------------------------------------------------
cases.append({
 "title":"Typing a name does not bring back other differently spelled names",
 "template_id":1,"type_id":7,"priority_id":2,"custom_automation_type":0,"custom_atmstatus":1,
 "refs":"SV-9160 (V1 baseline 55767168 useGlobalSearch.ts:76-92; V2 near-spelling bar 0.70 - PO DECISION)",
 "custom_preconds":"<p>"+MODAL+DATA+"</p>",
 "custom_steps":("<p>1. Open global search."
   "<br>2. Type: Marlene"
   "<br>3. Wait for the results to finish loading, then read EVERY row in EVERY group - scroll the whole list."
   "<br>4. Write down each row that does NOT contain the word you typed, and which group it was in."
   "<br>5. Click the Customers tab and check that list too.</p>"),
 "custom_expected":("<p>Every record that comes back contains the word you typed. "
   "<strong>ZZAUTOTEST Marlene Freight Lines</strong> is there. <strong>ZZAUTOTEST Darlene Cartage</strong> is NOT - "
   "you did not type Darlene."
   "<br>In V1 search compared the letters you typed against the letters in the record. A record came back only if it "
   "actually contained what you typed, so a name spelled differently was never returned. Typing a person's name gave "
   "you that person."
   "<br><strong>THIS IS EXPECTED TO DIFFER ON THE CURRENT BUILD.</strong> V2 also returns records whose wording is "
   "merely CLOSE to what you typed - close enough that two letters may differ. Measured live on the V2 QA branch on "
   "14 September 2026, typing Marlene returned 18 rows and only TWO of them genuinely contained the word. "
   "The other sixteen were <em>Darlene</em> (contact names), <em>Charlene</em> (street addresses), "
   "<em>Martens</em> (company names), <em>Marine</em> (battery terminal parts) and <em>Alene</em> (from the "
   "vendor Coeur d'Alene) - five words nobody typed. <strong>ZZAUTOTEST Darlene Cartage will be one of them, "
   "and its appearing is exactly the symptom this case exists to record.</strong>"
   "<br><strong>WHAT TO DO:</strong> record the exact list of rows that did not contain what you typed and flag it. "
   "Do NOT raise a defect - the Product Owner has a decision item open on how close a spelling has to be before it "
   "counts as a match. Your list is the evidence for that decision."
   "<br>"+FAILBLOCK+
   source("useGlobalSearch.ts:76-92, where the first pass asks whether the record's name STARTS WITH the typed text "
          "and the second asks whether the record's combined text CONTAINS it. Both are literal letter-for-letter "
          "comparisons - there is no allowance in V1 for a near spelling.",
          "Version 1.5 of the specification (Confluence page 576978945) section 7 introduces tolerant matching for "
          "typed mistakes; it does not say how far from the typed word a record may be and still be shown.")),
})

# ---------------- Case 2 : ranking ---------------------------------------------------------------
cases.append({
 "title":"The record that actually matches what you typed is listed first",
 "template_id":1,"type_id":7,"priority_id":2,"custom_automation_type":0,"custom_atmstatus":1,
 "refs":"SV-9160 (V1 baseline 55767168 useGlobalSearch.ts:156-180 two-pass order)",
 "custom_preconds":"<p>"+MODAL+DATA+"</p>",
 "custom_steps":("<p>1. Open global search."
   "<br>2. Type: Marlene"
   "<br>3. Wait for the results to finish loading."
   "<br>4. Read the Customers group from the top and note the ORDER of the rows."
   "<br>5. Press Enter without pressing any arrow key and note which record opens. Then go back.</p>"),
 "custom_expected":("<p><strong>ZZAUTOTEST Marlene Freight Lines</strong> - the record that genuinely contains what "
   "you typed - is at the TOP of the Customers group, above <strong>ZZAUTOTEST Darlene Cartage</strong> and above any "
   "other near-spelling. Pressing Enter opens Marlene Freight Lines."
   "<br>In V1 the results were built in two passes and the passes decided the order: every record whose name STARTED "
   "WITH what you typed was added first, and only then were the looser matches added underneath. The thing you "
   "actually asked for could never be pushed below something you did not ask for."
   "<br>This case is the safety net on the one above. Even while the Product Owner is deciding how much near-spelling "
   "to allow, the record you actually typed must never end up buried."
   "<br>"+FAILBLOCK+
   source("useGlobalSearch.ts:156-180, where the first pass pushes the records whose label starts with the typed text "
          "and the second pass appends the looser matches afterwards, so exact-start matches always precede them.",
          "Version 1.5 of the specification (Confluence page 576978945) section 7 ranks a stronger kind of match above "
          "a weaker one; this case pins the V1 ordering that requirement has to preserve.")),
})

if '--confirm' not in sys.argv:
    print("DRY RUN — pass --confirm to write. Cases:")
    for c in cases: print(" -",c['title'])
    sys.exit(0)

audit=[]
for c in cases:
    r=api('add_case/6769',c)
    audit.append({"op":"add_case","section":6769,"title":c['title'],"new_id":r.get('id'),"http":"200 (urllib raises otherwise)"})
    print(f"CREATED C{r['id']}  {c['title']}")
json.dump(audit,open('audit-add-cases.json','w'),indent=1)
