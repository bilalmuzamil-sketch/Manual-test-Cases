# PO-DECISION TICKET BODIES - ready to file

**Date:** 2026-09-14 · **Epic:** SV-9160 · **Issue type:** `Task` · **Priority:** `Medium` · **Parent:** the OWNING STORY under SV-9160 (never the epic)

**What every one of these asks the PO, in one sentence:** *a customer could do this in V1 and cannot in
V2 — do you want it back, or is losing it acceptable?* Nothing more. We do not ask the PO to choose an
implementation, and we do not present the loss as a bug, because for most of these the V2 specification
removed the field deliberately. The PO's answer decides whether the test case is restored, narrowed, or
retired.

**The seven B tickets are OBSERVED** — we ran the query on the QA build and it returned nothing. **The
four C tickets are PREDICTED** — the V2 specification removes the behaviour by design, the test cases
exist, and the run will confirm them. Each C body says so explicitly, so nobody reads a prediction as a
measurement (Rule 12).

---


## B1 — Global Search V2 - PO decision: is losing catalogue-part search acceptable?

```
h2. What a user could do in V1

Every part in the parts CATALOGUE was searchable, whether or not the shop had ever stocked it. Typing a part name or part number found it.

h2. What happens in V2

V2 searches Parts (Inventory). A catalogue part with no inventory record appears to return nothing.

h2. Evidence

Observed on sv9160.qa.shopview.com, 14 Sep 2026. Seeded catalogue-only part "ZZAUTOTEST Airline Coupler Vernway" / ZZT-77-3300 returns no Parts result. A second, otherwise identical part that IS stocked is returned by its description - so the difference is the inventory record, not the data.

h2. Where the V1 behaviour is established

FetchDataQueryHandler.php:317-331 reads the CataloguePart table. Baseline 55767168.

This ticket is raised under Standing Rule 109: for the V1 regression suite the shipped V1 product IS the specification. The V2 document is recorded below for context only - it is not the reason this ticket exists.

h2. What the V2 specification says

PRD v1.5 section 4 names "Parts (Inventory)" as the source and does not mention the catalogue.

h2. **THE DECISION WE NEED FROM YOU.** In V1 a parts clerk could search any catalogue part. In V2 a part the shop has never stocked appears to be unfindable. Is that acceptable?

**Your options:**
1. **Restore it** — index the parts catalogue again so the V1 way of searching keeps working.
2. **Accept the loss** — confirm this is intended, and we close this ticket and retire the test case.
3. **Restore it in a narrower form** — if you want only part of it back, tell us which part.

We are not asking you to choose on technical grounds. We are asking whether a customer who did this in V1 and cannot do it in V2 is an acceptable outcome. Until you rule, the test case stays and is marked Blocked rather than Failed — we do not raise it as a bug against a deliberate decision.

h2. Why it matters

HIGHEST. A parts clerk who has searched the catalogue for years will type a part number for something never stocked and get nothing. This is the change most likely to come back as "this worked in V1".

h2. Test case

C53601 - https://shopview.testrail.io/index.php?/cases/view/53601
```


## B2 — Global Search V2 - PO decision: is losing customer postal-code search acceptable?

```
h2. What a user could do in V1

A customer could be found by typing their postal code.

h2. What happens in V2

Returns nothing.

h2. Evidence

Observed 14 Sep 2026. Query "44872-9931" on the seeded customer returns 0 results, while the same customer IS returned by name, address line 1, address line 2 and city.

h2. Where the V1 behaviour is established

FetchDataQueryHandler.php:230 folds c.postal_code into the customer search text. Baseline 55767168.

This ticket is raised under Standing Rule 109: for the V1 regression suite the shipped V1 product IS the specification. The V2 document is recorded below for context only - it is not the reason this ticket exists.

h2. What the V2 specification says

PRD v1.5 section 4 lists customer fields and does not include postal code.

h2. **THE DECISION WE NEED FROM YOU.** In V1 a customer could be found by postal code. In V2 they cannot. Is that acceptable?

**Your options:**
1. **Restore it** — index customer postal code again so the V1 way of searching keeps working.
2. **Accept the loss** — confirm this is intended, and we close this ticket and retire the test case.
3. **Restore it in a narrower form** — if you want only part of it back, tell us which part.

We are not asking you to choose on technical grounds. We are asking whether a customer who did this in V1 and cannot do it in V2 is an acceptable outcome. Until you rule, the test case stays and is marked Blocked rather than Failed — we do not raise it as a bug against a deliberate decision.

h2. Why it matters

Medium. Used by staff working from an address rather than a name.

h2. Test case

C53582 - https://shopview.testrail.io/index.php?/cases/view/53582
```


## B3 — Global Search V2 - PO decision: is losing customer website search acceptable?

```
h2. What a user could do in V1

A customer could be found by typing their website address.

h2. What happens in V2

Returns nothing.

h2. Evidence

Observed 14 Sep 2026. Query "bridgeporthauling-zzt.com" returns 0 results while the same customer is returned by name.

h2. Where the V1 behaviour is established

FetchDataQueryHandler.php:236 folds c.website into the customer search text. Baseline 55767168.

This ticket is raised under Standing Rule 109: for the V1 regression suite the shipped V1 product IS the specification. The V2 document is recorded below for context only - it is not the reason this ticket exists.

h2. What the V2 specification says

PRD v1.5 section 4 does not mention website.

h2. **THE DECISION WE NEED FROM YOU.** In V1 a customer could be found by their website. In V2 they cannot. Is that acceptable?

**Your options:**
1. **Restore it** — index customer website again so the V1 way of searching keeps working.
2. **Accept the loss** — confirm this is intended, and we close this ticket and retire the test case.
3. **Restore it in a narrower form** — if you want only part of it back, tell us which part.

We are not asking you to choose on technical grounds. We are asking whether a customer who did this in V1 and cannot do it in V2 is an acceptable outcome. Until you rule, the test case stays and is marked Blocked rather than Failed — we do not raise it as a bug against a deliberate decision.

h2. Why it matters

Low-medium. On production only 0 of 42 sampled customers had a website recorded, so real usage is probably small - but it is still a capability that existed.

h2. Test case

C53583 - https://shopview.testrail.io/index.php?/cases/view/53583
```


## B4 — Global Search V2 - PO decision: is losing contact job-title search acceptable?

```
h2. What a user could do in V1

A customer or vendor could be found by typing a contact person's job title.

h2. What happens in V2

Returns nothing.

h2. Evidence

Observed 14 Sep 2026. Query "Dispatch Supervisor" returns 0 results, while the same contact IS found by last name.

h2. Where the V1 behaviour is established

FetchDataQueryHandler.php:241 folds cu.title into the customer search text. Baseline 55767168.

This ticket is raised under Standing Rule 109: for the V1 regression suite the shipped V1 product IS the specification. The V2 document is recorded below for context only - it is not the reason this ticket exists.

h2. What the V2 specification says

PRD v1.5 section 4 lists contact names, phones and emails - not job title.

h2. **THE DECISION WE NEED FROM YOU.** In V1 a company could be found by a contact's job title. In V2 it cannot. Is that acceptable?

**Your options:**
1. **Restore it** — index contact job title again so the V1 way of searching keeps working.
2. **Accept the loss** — confirm this is intended, and we close this ticket and retire the test case.
3. **Restore it in a narrower form** — if you want only part of it back, tell us which part.

We are not asking you to choose on technical grounds. We are asking whether a customer who did this in V1 and cannot do it in V2 is an acceptable outcome. Until you rule, the test case stays and is marked Blocked rather than Failed — we do not raise it as a bug against a deliberate decision.

h2. Why it matters

Low. Plausibly a rarely used route, but it worked.

h2. Test case

C53603 - https://shopview.testrail.io/index.php?/cases/view/53603
```


## B5 — Global Search V2 - PO decision: is losing vendor postal-code search acceptable?

```
h2. What a user could do in V1

A vendor could be found by typing their postal code.

h2. What happens in V2

Returns nothing.

h2. Evidence

Observed 14 Sep 2026. Query "43055-2210" returns 0 results while the same vendor is returned by name, address and city.

h2. Where the V1 behaviour is established

FetchDataQueryHandler.php:160 folds v.postal_code into the vendor search text. Baseline 55767168.

This ticket is raised under Standing Rule 109: for the V1 regression suite the shipped V1 product IS the specification. The V2 document is recorded below for context only - it is not the reason this ticket exists.

h2. What the V2 specification says

PRD v1.5 section 4 lists vendor fields and does not include postal code.

h2. **THE DECISION WE NEED FROM YOU.** In V1 a vendor could be found by postal code. In V2 they cannot. Is that acceptable?

**Your options:**
1. **Restore it** — index vendor postal code again so the V1 way of searching keeps working.
2. **Accept the loss** — confirm this is intended, and we close this ticket and retire the test case.
3. **Restore it in a narrower form** — if you want only part of it back, tell us which part.

We are not asking you to choose on technical grounds. We are asking whether a customer who did this in V1 and cannot do it in V2 is an acceptable outcome. Until you rule, the test case stays and is marked Blocked rather than Failed — we do not raise it as a bug against a deliberate decision.

h2. Why it matters

Medium. Same shape as B2, on the vendor side.

h2. Test case

C53585 - https://shopview.testrail.io/index.php?/cases/view/53585
```


## B6 — Global Search V2 - PO decision: is losing vendor state/province search acceptable?

```
h2. What a user could do in V1

A vendor could be found by typing their state or province.

h2. What happens in V2

Returns nothing.

h2. Evidence

Observed 14 Sep 2026. Query "Ohio" returns 0 vendor results. NOTE the asymmetry: the same query DOES return the customer, whose state is also Ohio - so state is indexed for customers but not for vendors.

h2. Where the V1 behaviour is established

FetchDataQueryHandler.php:159 folds v.state_or_province into the vendor search text. Baseline 55767168.

This ticket is raised under Standing Rule 109: for the V1 regression suite the shipped V1 product IS the specification. The V2 document is recorded below for context only - it is not the reason this ticket exists.

h2. What the V2 specification says

PRD v1.5 section 4 lists vendor fields and does not include state or province.

h2. **THE DECISION WE NEED FROM YOU.** In V1 a vendor could be found by state or province, and in V2 a CUSTOMER still can but a VENDOR cannot. Is that inconsistency intended?

**Your options:**
1. **Restore it** — index vendor state or province again so the V1 way of searching keeps working.
2. **Accept the loss** — confirm this is intended, and we close this ticket and retire the test case.
3. **Restore it in a narrower form** — if you want only part of it back, tell us which part.

We are not asking you to choose on technical grounds. We are asking whether a customer who did this in V1 and cannot do it in V2 is an acceptable outcome. Until you rule, the test case stays and is marked Blocked rather than Failed — we do not raise it as a bug against a deliberate decision.

h2. Why it matters

Medium. The customer/vendor inconsistency makes this look more like an oversight than a decision - worth asking whether it was deliberate at all.

h2. Test case

C53606 - https://shopview.testrail.io/index.php?/cases/view/53606
```


## B7 — Global Search V2 - PO decision: is losing licence-plate search acceptable?

```
h2. What a user could do in V1

An asset could be found by typing its licence plate.

h2. What happens in V2

Returns nothing.

h2. Evidence

Observed 14 Sep 2026. Query "OHZZT471" returns 0 results, while the same asset IS returned by its owner name.

h2. Where the V1 behaviour is established

FetchDataQueryHandler.php:292 folds v.licence_plate into the asset search text. Baseline 55767168.

This ticket is raised under Standing Rule 109: for the V1 regression suite the shipped V1 product IS the specification. The V2 document is recorded below for context only - it is not the reason this ticket exists.

h2. What the V2 specification says

PRD v1.5 section 4 lists asset fields and does not include licence plate.

h2. **THE DECISION WE NEED FROM YOU.** In V1 an asset could be found by licence plate. In V2 it cannot. Is that acceptable?

**Your options:**
1. **Restore it** — index asset licence plate again so the V1 way of searching keeps working.
2. **Accept the loss** — confirm this is intended, and we close this ticket and retire the test case.
3. **Restore it in a narrower form** — if you want only part of it back, tell us which part.

We are not asking you to choose on technical grounds. We are asking whether a customer who did this in V1 and cannot do it in V2 is an acceptable outcome. Until you rule, the test case stays and is marked Blocked rather than Failed — we do not raise it as a bug against a deliberate decision.

h2. Why it matters

Medium-high for yard and roadside work, where the plate is the thing physically visible on the vehicle.

h2. Test case

C53516 - https://shopview.testrail.io/index.php?/cases/view/53516
```


## C1 — Global Search V2 - PO decision: work orders can no longer be found by status

```
h2. What a user could do in V1

Typing a status word found work orders in that status - "Estimate", "In Progress", and "quality check" matched too, with the underscore removed.

h2. What happens in V2

Status was removed from the indexed work-order fields at specification version 12, so typing a status returns no work orders.

h2. Evidence

NOT YET OBSERVED ON THE BUILD - predicted from the specification change. Test case C55658 exists and will confirm it on the run.

h2. Where the V1 behaviour is established

FetchDataQueryHandler.php:113-116 folds wo.status into the work order search text. Baseline 55767168.

This ticket is raised under Standing Rule 109: for the V1 regression suite the shipped V1 product IS the specification. The V2 document is recorded below for context only - it is not the reason this ticket exists.

h2. What the V2 specification says

PRD v1.5 section 4 does not list status among the indexed Work Order fields; it was dropped at spec v12.

h2. **THE DECISION WE NEED FROM YOU.** In V1 a dispatcher could type "Estimate" into search and get the estimates back. V2 removed that deliberately. Is that acceptable, or should status come back?

**Your options:**
1. **Restore it** — index work order status again so the V1 way of searching keeps working.
2. **Accept the loss** — confirm this is intended, and we close this ticket and retire the test case.
3. **Restore it in a narrower form** — if you want only part of it back, tell us which part.

We are not asking you to choose on technical grounds. We are asking whether a customer who did this in V1 and cannot do it in V2 is an acceptable outcome. Until you rule, the test case stays and is marked Blocked rather than Failed — we do not raise it as a bug against a deliberate decision.

h2. Why it matters

Medium. There are other ways to filter by status (the work orders list has its own filters), so this may be a fair trade - but it should be a decision, not a side-effect.

h2. Test case

C55658 - https://shopview.testrail.io/index.php?/cases/view/55658
```


## C2 — Global Search V2 - PO decision: a partial number no longer finds a record

```
h2. What a user could do in V1

Typing any FRAGMENT of a number found the record - the last few digits of a work order, part of a part number, part of a unit number. V1 matched the typed text anywhere inside the record.

h2. What happens in V2

Identifier fields are exact-match-only and bypass the fuzzy logic, so a fragment no longer matches.

h2. Evidence

NOT YET OBSERVED ON THE BUILD - predicted from the specification. Test case C55659 exists and will confirm it on the run.

h2. Where the V1 behaviour is established

useGlobalSearch.ts:92 - the second matching pass used .includes(), i.e. the typed text anywhere inside the search text. Baseline 55767168.

This ticket is raised under Standing Rule 109: for the V1 regression suite the shipped V1 product IS the specification. The V2 document is recorded below for context only - it is not the reason this ticket exists.

h2. What the V2 specification says

PRD v1.5 section 7: identifier fields require an exact match after normalization and bypass fuzzy logic.

h2. **THE DECISION WE NEED FROM YOU.** In V1 someone could type the last four digits of a work order number and find it. V2 requires the whole number. Is that acceptable?

**Your options:**
1. **Restore it** — index partial identifiers again so the V1 way of searching keeps working.
2. **Accept the loss** — confirm this is intended, and we close this ticket and retire the test case.
3. **Restore it in a narrower form** — if you want only part of it back, tell us which part.

We are not asking you to choose on technical grounds. We are asking whether a customer who did this in V1 and cannot do it in V2 is an acceptable outcome. Until you rule, the test case stays and is marked Blocked rather than Failed — we do not raise it as a bug against a deliberate decision.

h2. Why it matters

HIGH, and this is the one we most want you to look at. Typing the tail of a number is how the shop floor actually searches. V1 supported it as a by-product of substring matching; V2 removes it by design, and as far as we can see the trade-off was never weighed explicitly.

h2. Test case

C55659 - https://shopview.testrail.io/index.php?/cases/view/55659
```


## C3 — Global Search V2 - PO decision: a mid-word fragment no longer finds a record

```
h2. What a user could do in V1

Typing a fragment from the MIDDLE of a word found the record - "ernva" found the city Fernvale, "idgepor" found Bridgeport.

h2. What happens in V2

V2 scores similarity instead of matching substrings, and a short fragment can score below the cut-off and return nothing.

h2. Evidence

NOT YET OBSERVED ON THE BUILD - predicted from the matching model. Test case C55660 exists and will confirm it on the run.

h2. Where the V1 behaviour is established

useGlobalSearch.ts:84-93 - the second pass matched the haystack with .includes(). Baseline 55767168.

This ticket is raised under Standing Rule 109: for the V1 regression suite the shipped V1 product IS the specification. The V2 document is recorded below for context only - it is not the reason this ticket exists.

h2. What the V2 specification says

PRD v1.5 section 7 replaces substring matching with trigram similarity, Damerau-Levenshtein distance and Double Metaphone scoring against a threshold. It is SILENT on whether a mid-word fragment still matches.

h2. **THE DECISION WE NEED FROM YOU.** In V1 a fragment from the middle of a word found the record. V2 is silent on whether it still does. Should it?

**Your options:**
1. **Restore it** — index mid-word fragments again so the V1 way of searching keeps working.
2. **Accept the loss** — confirm this is intended, and we close this ticket and retire the test case.
3. **Restore it in a narrower form** — if you want only part of it back, tell us which part.

We are not asking you to choose on technical grounds. We are asking whether a customer who did this in V1 and cannot do it in V2 is an acceptable outcome. Until you rule, the test case stays and is marked Blocked rather than Failed — we do not raise it as a bug against a deliberate decision.

h2. Why it matters

Medium-high. Fuzzy matching is NOT automatically a superset of substring matching - people assume it is, and that assumption is what makes this easy to miss.

h2. Test case

C55660 - https://shopview.testrail.io/index.php?/cases/view/55660
```


## C4 — Global Search V2 - PO decision: a matching record type can be squeezed out of the results

```
h2. What a user could do in V1

Each result type got its own slots (up to three) and there was NO overall limit, so if six types matched, all six were shown.

h2. What happens in V2

The whole result list is capped at 20 with no pagination, so a type that matches often can crowd out a type with fewer matches - which then shows nothing at all.

h2. Evidence

NOT YET OBSERVED ON THE BUILD - predicted from the cap. Test case C55661 exists and will confirm it on the run.

h2. Where the V1 behaviour is established

useGlobalSearch.ts:152 - MAX_PER_TYPE = 3 applied PER TYPE, with no overall cap anywhere in the filter. Baseline 55767168.

This ticket is raised under Standing Rule 109: for the V1 regression suite the shipped V1 product IS the specification. The V2 document is recorded below for context only - it is not the reason this ticket exists.

h2. What the V2 specification says

PRD v1.5 section 5.2 caps counts and the result list at 20; section 2 rules out pagination. It is SILENT on whether a matching type may be shown zero rows because of that cap.

h2. **THE DECISION WE NEED FROM YOU.** In V1 every type that had a match was always shown. In V2 a type with real matches can show nothing because a busier type filled the 20 slots. Is that acceptable, or should each type keep a guaranteed slot?

**Your options:**
1. **Restore it** — index per-type representation again so the V1 way of searching keeps working.
2. **Accept the loss** — confirm this is intended, and we close this ticket and retire the test case.
3. **Restore it in a narrower form** — if you want only part of it back, tell us which part.

We are not asking you to choose on technical grounds. We are asking whether a customer who did this in V1 and cannot do it in V2 is an acceptable outcome. Until you rule, the test case stays and is marked Blocked rather than Failed — we do not raise it as a bug against a deliberate decision.

h2. Why it matters

HIGH and quiet. The user is not told anything was hidden - they simply conclude the record does not exist. That is the worst failure mode a search can have.

h2. Test case

C55661 - https://shopview.testrail.io/index.php?/cases/view/55661
```


## D1 — Global Search V2 - PO decision: how close a spelling should count as a match

```
h2. What a user could do in V1

Typing somebody's name gave you that person. V1 compared the letters you typed against the letters in the record, so a record came back only if it actually contained what you typed. A name spelled differently was never returned.

h2. What happens in V2

V2 also returns records whose wording is merely CLOSE to what you typed - close enough that two letters may differ. Typing "Marlene" returned 16 rows. One was the person wanted. The other fifteen were five words nobody typed: Darlene (contact names), Charlene (street addresses), Martens (company names), Marine (battery terminal parts) and Alene (from the vendor Coeur d'Alene).

h2. Evidence

OBSERVED LIVE on the V2 QA branch on 14 September 2026 by the QA lead, and reproduced from the API the same day with a control query that correctly returned nothing.

V2 accepts a word when the number of single letter edits needed to turn it into the typed word, divided by the length of the longer word, leaves a score of 0.70 or higher. "Marlene" is seven letters, so 0.70 lets through anything within TWO letters of it.

Scores computed with the product's own formula and confirmed against the live build:

* Marlene - the genuine hit - 0 letters different - 1.000 - ranked first
* Darlene - 1 letter - 0.857 - accepted
* Charlene - 2 letters - 0.750 - accepted
* Martens - 2 letters - 0.714 - accepted by 0.014
* Marine - 2 letters - 0.714 - accepted by 0.014
* Alene - 2 letters - 0.714 - accepted by 0.014

Three of the five clear the bar by fourteen thousandths.

h2. Where the V1 behaviour is established

useGlobalSearch.ts:76-92 at baseline 55767168. The first pass asks whether the record name STARTS WITH the typed text; the second asks whether the record's combined text CONTAINS it. Both are literal letter for letter comparisons.

This is not because V1 searched fewer fields. V1 searched street address, city, postal code, phone, website and contact names too - FetchDataQueryHandler.php:224-245. The only thing that changed is how close a word has to be.

This ticket is raised under Standing Rule 109: for the V1 regression suite the shipped V1 product IS the specification. The V2 document is recorded below for context only - it is not the reason this ticket exists.

h2. What the V2 specification says

PRD v1.5 section 7 introduces tolerant matching so a typed mistake still finds the record. It does not say how far from the typed word a record may be and still be shown. The 0.70 setting is an implementation choice, not a stated requirement.

h2. **THE DECISION WE NEED FROM YOU.** How close should a spelling have to be before search shows it? Today two letters out of seven is close enough, which is why one search for a person returned five unrelated words.

**Your options:**
1. **Tighten it to about 0.80.** This removes Martens, Marine, Coeur d'Alene and Charlene from the example above and leaves every intended typo case untouched - the two typo examples the design is built around score 0.88 and 0.92, so there is a wide gap to work in. It is an environment setting, so no code change and no deploy.
2. **Leave it as it is.** Confirm that a noisier result list is an acceptable price for catching more typing mistakes, and we close this and keep the test case as a record of the decision.
3. **Change the idea rather than the number.** Stop offering near spellings at all when an exact match already exists. This is the only option that also removes Darlene, which is genuinely one letter from Marlene and will survive any workable setting.

We are not asking you to choose on technical grounds. We are asking what a service advisor should see when they type a customer's name.

h2. What is NOT wrong

The record actually wanted was found and was ranked top - 0.9 against 0.44 for the near spellings. Ranking is working. Nothing has been lost. This is about what else arrives with it.

h2. Why it matters

Medium. Nobody is blocked. But search is used dozens of times a day by every service advisor, and a result list where most rows are irrelevant trains people to stop trusting it.

h2. Test cases

C55685 - https://shopview.testrail.io/index.php?/cases/view/55685 - records the noise
C55686 - https://shopview.testrail.io/index.php?/cases/view/55686 - guards the ranking so the real hit cannot be buried while this is decided
```
