# -*- coding: utf-8 -*-
"""Writes the ready-to-file body for every PO-decision ticket."""
ASK = ("**THE DECISION WE NEED FROM YOU.** {q}\n\n"
 "**Your options:**\n"
 "1. **Restore it** — index {field} again so the V1 way of searching keeps working.\n"
 "2. **Accept the loss** — confirm this is intended, and we close this ticket and retire the test case.\n"
 "3. **Restore it in a narrower form** — if you want only part of it back, tell us which part.\n\n"
 "We are not asking you to choose on technical grounds. We are asking whether a customer who did this "
 "in V1 and cannot do it in V2 is an acceptable outcome. Until you rule, the test case stays and is "
 "marked Blocked rather than Failed — we do not raise it as a bug against a deliberate decision.\n")

ROWS=[
 dict(id='B1', title='Global Search V2 - PO decision: is losing catalogue-part search acceptable?',
  v1='Every part in the parts CATALOGUE was searchable, whether or not the shop had ever stocked it. Typing a part name or part number found it.',
  v2='V2 searches Parts (Inventory). A catalogue part with no inventory record appears to return nothing.',
  ev='Observed on sv9160.qa.shopview.com, 14 Sep 2026. Seeded catalogue-only part "ZZAUTOTEST Airline Coupler Vernway" / ZZT-77-3300 returns no Parts result. A second, otherwise identical part that IS stocked is returned by its description - so the difference is the inventory record, not the data.',
  code='FetchDataQueryHandler.php:317-331 reads the CataloguePart table. Baseline 55767168.',
  spec='PRD v1.5 section 4 names "Parts (Inventory)" as the source and does not mention the catalogue.',
  q='In V1 a parts clerk could search any catalogue part. In V2 a part the shop has never stocked appears to be unfindable. Is that acceptable?',
  field='the parts catalogue',
  case='C53601', risk='HIGHEST. A parts clerk who has searched the catalogue for years will type a part number for something never stocked and get nothing. This is the change most likely to come back as "this worked in V1".'),
 dict(id='B2', title='Global Search V2 - PO decision: is losing customer postal-code search acceptable?',
  v1='A customer could be found by typing their postal code.',
  v2='Returns nothing.', ev='Observed 14 Sep 2026. Query "44872-9931" on the seeded customer returns 0 results, while the same customer IS returned by name, address line 1, address line 2 and city.',
  code='FetchDataQueryHandler.php:230 folds c.postal_code into the customer search text. Baseline 55767168.',
  spec='PRD v1.5 section 4 lists customer fields and does not include postal code.',
  q='In V1 a customer could be found by postal code. In V2 they cannot. Is that acceptable?',
  field='customer postal code', case='C53582', risk='Medium. Used by staff working from an address rather than a name.'),
 dict(id='B3', title='Global Search V2 - PO decision: is losing customer website search acceptable?',
  v1='A customer could be found by typing their website address.',
  v2='Returns nothing.', ev='Observed 14 Sep 2026. Query "bridgeporthauling-zzt.com" returns 0 results while the same customer is returned by name.',
  code='FetchDataQueryHandler.php:236 folds c.website into the customer search text. Baseline 55767168.',
  spec='PRD v1.5 section 4 does not mention website.',
  q='In V1 a customer could be found by their website. In V2 they cannot. Is that acceptable?',
  field='customer website', case='C53583', risk='Low-medium. On production only 0 of 42 sampled customers had a website recorded, so real usage is probably small - but it is still a capability that existed.'),
 dict(id='B4', title="Global Search V2 - PO decision: is losing contact job-title search acceptable?",
  v1="A customer or vendor could be found by typing a contact person's job title.",
  v2='Returns nothing.', ev='Observed 14 Sep 2026. Query "Dispatch Supervisor" returns 0 results, while the same contact IS found by last name.',
  code='FetchDataQueryHandler.php:241 folds cu.title into the customer search text. Baseline 55767168.',
  spec='PRD v1.5 section 4 lists contact names, phones and emails - not job title.',
  q='In V1 a company could be found by a contact\'s job title. In V2 it cannot. Is that acceptable?',
  field="contact job title", case='C53603', risk='Low. Plausibly a rarely used route, but it worked.'),
 dict(id='B5', title='Global Search V2 - PO decision: is losing vendor postal-code search acceptable?',
  v1='A vendor could be found by typing their postal code.',
  v2='Returns nothing.', ev='Observed 14 Sep 2026. Query "43055-2210" returns 0 results while the same vendor is returned by name, address and city.',
  code='FetchDataQueryHandler.php:160 folds v.postal_code into the vendor search text. Baseline 55767168.',
  spec='PRD v1.5 section 4 lists vendor fields and does not include postal code.',
  q='In V1 a vendor could be found by postal code. In V2 they cannot. Is that acceptable?',
  field='vendor postal code', case='C53585', risk='Medium. Same shape as B2, on the vendor side.'),
 dict(id='B6', title='Global Search V2 - PO decision: is losing vendor state/province search acceptable?',
  v1='A vendor could be found by typing their state or province.',
  v2='Returns nothing.', ev='Observed 14 Sep 2026. Query "Ohio" returns 0 vendor results. NOTE the asymmetry: the same query DOES return the customer, whose state is also Ohio - so state is indexed for customers but not for vendors.',
  code='FetchDataQueryHandler.php:159 folds v.state_or_province into the vendor search text. Baseline 55767168.',
  spec='PRD v1.5 section 4 lists vendor fields and does not include state or province.',
  q='In V1 a vendor could be found by state or province, and in V2 a CUSTOMER still can but a VENDOR cannot. Is that inconsistency intended?',
  field='vendor state or province', case='C53606', risk='Medium. The customer/vendor inconsistency makes this look more like an oversight than a decision - worth asking whether it was deliberate at all.'),
 dict(id='B7', title="Global Search V2 - PO decision: is losing licence-plate search acceptable?",
  v1="An asset could be found by typing its licence plate.",
  v2='Returns nothing.', ev='Observed 14 Sep 2026. Query "OHZZT471" returns 0 results, while the same asset IS returned by its owner name.',
  code='FetchDataQueryHandler.php:292 folds v.licence_plate into the asset search text. Baseline 55767168.',
  spec='PRD v1.5 section 4 lists asset fields and does not include licence plate.',
  q='In V1 an asset could be found by licence plate. In V2 it cannot. Is that acceptable?',
  field='asset licence plate', case='C53516', risk='Medium-high for yard and roadside work, where the plate is the thing physically visible on the vehicle.'),
 dict(id='C1', title='Global Search V2 - PO decision: work orders can no longer be found by status',
  v1='Typing a status word found work orders in that status - "Estimate", "In Progress", and "quality check" matched too, with the underscore removed.',
  v2='Status was removed from the indexed work-order fields at specification version 12, so typing a status returns no work orders.',
  ev='NOT YET OBSERVED ON THE BUILD - predicted from the specification change. Test case C55658 exists and will confirm it on the run.',
  code='FetchDataQueryHandler.php:113-116 folds wo.status into the work order search text. Baseline 55767168.',
  spec='PRD v1.5 section 4 does not list status among the indexed Work Order fields; it was dropped at spec v12.',
  q='In V1 a dispatcher could type "Estimate" into search and get the estimates back. V2 removed that deliberately. Is that acceptable, or should status come back?',
  field='work order status', case='C55658', risk='Medium. There are other ways to filter by status (the work orders list has its own filters), so this may be a fair trade - but it should be a decision, not a side-effect.'),
 dict(id='C2', title='Global Search V2 - PO decision: a partial number no longer finds a record',
  v1='Typing any FRAGMENT of a number found the record - the last few digits of a work order, part of a part number, part of a unit number. V1 matched the typed text anywhere inside the record.',
  v2='Identifier fields are exact-match-only and bypass the fuzzy logic, so a fragment no longer matches.',
  ev='NOT YET OBSERVED ON THE BUILD - predicted from the specification. Test case C55659 exists and will confirm it on the run.',
  code='useGlobalSearch.ts:92 - the second matching pass used .includes(), i.e. the typed text anywhere inside the search text. Baseline 55767168.',
  spec='PRD v1.5 section 7: identifier fields require an exact match after normalization and bypass fuzzy logic.',
  q='In V1 someone could type the last four digits of a work order number and find it. V2 requires the whole number. Is that acceptable?',
  field='partial identifiers', case='C55659', risk='HIGH, and this is the one we most want you to look at. Typing the tail of a number is how the shop floor actually searches. V1 supported it as a by-product of substring matching; V2 removes it by design, and as far as we can see the trade-off was never weighed explicitly.'),
 dict(id='C3', title='Global Search V2 - PO decision: a mid-word fragment no longer finds a record',
  v1='Typing a fragment from the MIDDLE of a word found the record - "ernva" found the city Fernvale, "idgepor" found Bridgeport.',
  v2='V2 scores similarity instead of matching substrings, and a short fragment can score below the cut-off and return nothing.',
  ev='NOT YET OBSERVED ON THE BUILD - predicted from the matching model. Test case C55660 exists and will confirm it on the run.',
  code='useGlobalSearch.ts:84-93 - the second pass matched the haystack with .includes(). Baseline 55767168.',
  spec='PRD v1.5 section 7 replaces substring matching with trigram similarity, Damerau-Levenshtein distance and Double Metaphone scoring against a threshold. It is SILENT on whether a mid-word fragment still matches.',
  q='In V1 a fragment from the middle of a word found the record. V2 is silent on whether it still does. Should it?',
  field='mid-word fragments', case='C55660', risk='Medium-high. Fuzzy matching is NOT automatically a superset of substring matching - people assume it is, and that assumption is what makes this easy to miss.'),
 dict(id='C4', title='Global Search V2 - PO decision: a matching record type can be squeezed out of the results',
  v1='Each result type got its own slots (up to three) and there was NO overall limit, so if six types matched, all six were shown.',
  v2='The whole result list is capped at 20 with no pagination, so a type that matches often can crowd out a type with fewer matches - which then shows nothing at all.',
  ev='NOT YET OBSERVED ON THE BUILD - predicted from the cap. Test case C55661 exists and will confirm it on the run.',
  code='useGlobalSearch.ts:152 - MAX_PER_TYPE = 3 applied PER TYPE, with no overall cap anywhere in the filter. Baseline 55767168.',
  spec='PRD v1.5 section 5.2 caps counts and the result list at 20; section 2 rules out pagination. It is SILENT on whether a matching type may be shown zero rows because of that cap.',
  q='In V1 every type that had a match was always shown. In V2 a type with real matches can show nothing because a busier type filled the 20 slots. Is that acceptable, or should each type keep a guaranteed slot?',
  field='per-type representation', case='C55661', risk='HIGH and quiet. The user is not told anything was hidden - they simply conclude the record does not exist. That is the worst failure mode a search can have.'),
]
def body(r):
    return f"""h2. What a user could do in V1

{r['v1']}

h2. What happens in V2

{r['v2']}

h2. Evidence

{r['ev']}

h2. Where the V1 behaviour is established

{r['code']}

This ticket is raised under Standing Rule 109: for the V1 regression suite the shipped V1 product IS the specification. The V2 document is recorded below for context only - it is not the reason this ticket exists.

h2. What the V2 specification says

{r['spec']}

h2. {ASK.format(q=r['q'], field=r['field'])}
h2. Why it matters

{r['risk']}

h2. Test case

{r['case']} - https://shopview.testrail.io/index.php?/cases/view/{r['case'][1:]}
"""
out=["# PO-DECISION TICKET BODIES - ready to file\n",
"**Date:** 2026-09-14 · **Epic:** SV-9160 · **Issue type:** `Task` · **Priority:** `Medium` · **Parent:** the OWNING STORY under SV-9160 (never the epic)\n",
"""**What every one of these asks the PO, in one sentence:** *a customer could do this in V1 and cannot in
V2 — do you want it back, or is losing it acceptable?* Nothing more. We do not ask the PO to choose an
implementation, and we do not present the loss as a bug, because for most of these the V2 specification
removed the field deliberately. The PO's answer decides whether the test case is restored, narrowed, or
retired.\n""",
"""**The seven B tickets are OBSERVED** — we ran the query on the QA build and it returned nothing. **The
four C tickets are PREDICTED** — the V2 specification removes the behaviour by design, the test cases
exist, and the run will confirm them. Each C body says so explicitly, so nobody reads a prediction as a
measurement (Rule 12).\n""","---\n"]
for r in ROWS:
    out.append(f"\n## {r['id']} — {r['title']}\n\n```\n{body(r)}```\n")
open('PO-TICKET-BODIES.md','w').write('\n'.join(out))
print(f"{len(ROWS)} bodies written to PO-TICKET-BODIES.md")
for r in ROWS: print(f"  {r['id']}  {r['case']}  {r['title'][:70]}")
