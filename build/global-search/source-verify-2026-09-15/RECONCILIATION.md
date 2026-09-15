# Rule 106 reconciliation — six proposed defects, Global Search V1→V2 regression

**Read live on 2026-09-15** from Confluence page **576978945**, *Global Search — Product
Requirements*, **Version 1.5**, last updated 2026-09-08, author Product Team / Milos Vasic (v1.5).
Link: https://shopview.atlassian.net/wiki/spaces/shopviewapp/pages/576978945/Global+Search+-+Product+Requirements

This is the LIVE fetch required by Rule 106 — not `requirements.md`, not our own case text, not a
remembered version. Every quote below was taken from the body returned by that fetch today.

Three things are compared for each case: **the case's Expected**, **the source as it reads today**,
**the build observed**. Rule 106's verdicts: case agrees + build differs ⇒ real defect · case
disagrees with source ⇒ the CASE is the defect · source silent ⇒ hold and ask.

The complication here, and it is the whole point of this file: **these are V1 REGRESSION cases.**
Their stated authority is the shipped V1 product (Standing Rule 109), and the V2 specification is
context only. So a case can disagree with the V2 specification and still be right — but that
disagreement is a **PO decision item** (Rules 58 and 96), never something to file silently. The QA
lead answered all ten such questions on 2026-09-15 (`Global-Search-questions-ANSWERED-from-V1-2026-09-15.xlsx`),
every one **YES — log it as a fault and get it fixed**. That ruling is what authorises filing.

---

## A. Case, source and build ALL agree — a plain defect, nothing to decide

### C53605 — a vehicle cannot be found by its year together with its make or model

- **Case expects:** the year is one of the things a vehicle can be found by.
- **Source, §4 Scope: Entities & Indexed Fields, verbatim:**
  > **Assets (Vehicles).** Indexed: year, make, model, VIN/serial #, unit number, owning customer name.
- **Build:** `2019` alone returns 20 vehicles; `Freightliner` alone returns 20; `Freightliner Cascadia`
  returns 20 including ours. `2019 Freightliner`, `2019 Cascadia` and `Cascadia 2019` each return **0**.
- **Verdict: REAL DEFECT.** The year is indexed (it matches alone); combining it with any second word
  empties the result. Case and source agree; the build does not.

### C53587 — a newly created job is not findable within 30 seconds

- **Case expects:** each newly created record is returned by search, allowing up to 30 seconds.
- **Source, §9 Non-Functional Requirements, verbatim:**
  > Index refresh latency ≤ 30s for entity create/update — the data-freshness indicator is explicitly deferred (§2).
- **Also §8 Functional Requirements, verbatim:**
  > creating an entity counts as a view, so a record the user just created is immediately recent and recency-boosted for that user
- **Build:** a new job took about **85 seconds**. Controls in the same session: a new customer **17
  seconds**, a new part sale **9 seconds**.
- **Verdict: REAL DEFECT.** Case and source agree on 30 seconds; the build misses it for jobs only.

---

## B. The V2 specification CONTRADICTS the case — filed on the QA lead's explicit ruling, and each
## ticket says so in its own Sources section

### C55669 — part of a chassis number no longer finds the vehicle

- **Case expects (from V1):** part of a VIN finds the vehicle.
- **Source, §7 Fuzzy Matching, "What is not fuzzy", verbatim:**
  > Exact identifier fields — VIN, WO number, P-number, part number, PO number, invoice number — bypass
  > fuzzy logic and require exact match after normalization. A typo in a VIN is almost always a wrong
  > VIN, not a typo, and fuzzy matching here would surface confusing results.
- **Build:** the full chassis number returns the vehicle; its last six characters return nothing.
- **Verdict: THE V2 SPECIFICATION ASKS FOR TODAY'S BEHAVIOUR.** This is a deliberate V2 decision, not
  an oversight. It is filed because the QA lead ruled on 2026-09-15 that it should still work
  (question 8, answered YES). **The ticket must carry that quote**, so engineering sees it is a
  reversal of a written decision and not a bug report against their implementation of it.

### C55679 — the recently viewed list does not come back after a search that finds nothing

- **Case expects (from V1):** the recently viewed list returns.
- **Source, §5.2 States, "No results", verbatim:**
  > **No results.** "No results for '\<query\>'" — plus " in \<Tab\>" when a scope tab other than All
  > is active. Nothing else.
- **Build:** the message appears and nothing is listed. With the box empty, twenty recently viewed
  items do list, so the list itself works.
- **Verdict: THE V2 SPECIFICATION ASKS FOR TODAY'S BEHAVIOUR** — "Nothing else" is explicit. Filed on
  the QA lead's ruling (question 9, answered YES), with the quote in the ticket.

---

## C. The V2 specification is SILENT or only partly covers it — the V1 behaviour governs (Rule 96)

### C55662 — a customer cannot be found by its own telephone number

- **Case expects:** the customer's telephone finds the customer.
- **Source, §4 Customers, verbatim:**
  > **Customers.** Indexed: customer name, telephone (digits only, normalized), address 1/2, city,
  > state/province, plus the names, telephone numbers and email addresses of the customer's contacts.
- **And §7 Normalization, verbatim:**
  > for identifier fields (WO number, part number, VIN, phone) also strip non-alphanumerics so
  > `S2-15276` and `s215276` match, and `(264) 328-6723` and `2643286723` match.
- **Build:** the number returns nothing, written out or as plain digits. A supplier's number does work.
- **Verdict: REAL DEFECT — the source is NOT silent here, it requires it.** This belongs in section A
  on the source alone; it is listed here only because it was routed through the question sheet
  (question 3) before that was checked. The ruling and the specification agree.

### C55660 — a fragment from the middle of a word finds the record in some fields and not others

- **Case expects (from V1):** a mid-word fragment finds the record.
- **Source, §7 Fuzzy Matching, verbatim:**
  > Build trigram indexes on names (customer, contact, vendor, asset make/model), part descriptions,
  > and tags. The query is also trigrammed; candidates with Jaccard similarity ≥ 0.35 against the query
  > trigrams are eligible for fuzzy match.
- **Reading:** the source specifies a similarity threshold, not a guarantee about fragments, and says
  nothing about the INCONSISTENCY that was actually observed — a fragment of the company name matches
  while a fragment of the city does not, though both are indexed fields of the same record.
- **Verdict: SOURCE PARTLY SILENT; the inconsistency is the finding.** Filed on the QA lead's ruling
  (question 10, answered YES). The ticket asks for consistency across indexed fields and quotes §7.

---

## What this reconciliation changed

Nothing was filed that the source contradicts without that contradiction being quoted in the ticket
itself. Two of the six (C55669, C55679) are reversals of written V2 decisions and are labelled as
such. One (C55662) turned out to be required by the specification after all, so it needed no ruling.
