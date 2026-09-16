# CORRECTION — HOW GLOBAL SEARCH V2 ACTUALLY WORKS

**Date:** 2026-09-14 · **Project:** Global Search V2 (epic **SV-9160**)
**Established from:** the product source at branch `SV-9160-global-search-v2`, commit `7869ff2a`
**Reproduced against:** the live V2 QA branch `sv9160.qa.shopview.com`, same day

---

## 🔴 WHAT WAS WRONG IN OUR NOTES

Our records said the V2 search matches text **in the database** — the PRD names PostgreSQL with a
trigram extension, and we had corrected that to "the stack is MySQL on Aurora, so it will be MySQL
text matching." **Both are wrong about the shipped build.**

**Global Search V2 does not match text in the application database at all. It runs on a separate
search engine — OpenSearch.** Records are copied into it as documents and the matching, scoring and
ranking all happen there.

**Why it matters, in plain terms — three things follow from this that did not follow from our old
understanding:**

1. **There is a delay between saving a record and being able to find it.** The record is written to
   the database first and copied to the search engine afterwards. Our "findable within 30 seconds"
   cases (C53586, C53587) are testing a real, deliberate lag, not a performance wobble.
2. **Search can be down while the rest of the product is fine.** The engine is a separate service
   with its own connection, timeout and circuit breaker. If it is unreachable the product answers
   "Search unavailable, retry" and keeps working. A tester seeing that must not record it as the
   feature being broken.
3. **Relevance is a set of switches, not code.** Every threshold and weight is an environment
   variable (`api/config/packages/search.yaml`). Two environments can legitimately return different
   result sets from the same data, and tuning needs no deploy.

**Where this is established:** `api/src/Search/Infrastructure/OpenSearch/` — the whole matching and
indexing tier, including the index definitions at `.../OpenSearch/mappings/*.json` (eight document
types: customers, assets, parts, part sales, vendors, vendor invoices, work orders, purchase orders).

---

## HOW A WORD IS DECIDED TO "MATCH"

Two stages, `api/src/Search/Domain/Matching/StringSimilarity.php`:

**Stage 1 — gather candidates.** Every word is cut into three-letter pieces and anything sharing
pieces with what you typed is pulled in. This stage is deliberately generous; it decides nothing.
🔴 The source carries a **measured caveat**: this stage currently admits any record sharing **one**
three-letter piece, not the 35 % overlap its setting implies. The author verified it, wrote it down
and left it alone. It costs work, not wrong answers.

**Stage 2 — decide.** Count the single-letter edits (insert, delete, change, or swap two neighbours)
needed to turn one word into the other, then score:

> **similarity = 1 − (edits ÷ length of the longer word)**

A word is accepted at **0.70 or higher** — or **0.80** for queries of three characters or fewer.

**The consequence nobody has written down anywhere else:** the bar is a fraction, so *how many letters
may differ depends on how long the word is.* At seven letters, 0.70 permits **two** letters different.
That is the whole explanation of the noise the QA lead found — see
`v1-parity-audit-2026-09-14/PO-TASK-TICKET-CANDIDATES.md` §4a (item D1).

---

## THE MEASUREMENT — reproducible, with a control

Query `marlene` against the live V2 QA branch, 2026-09-14. Control query `zzqqxxnothinghere`
returned **0 results**, proving the probe works (Rule 104).

| Row returned | Where it matched | Kind | Similarity |
|---|---|---|---|
| ZZAUTOTEST Marlene Freight Lines | name | whole word | exact |
| ZZAUTOTEST Bridgeport Hauling | contact email | prefix | exact |
| ZZAUTOTEST Darlene Cartage | name | near spelling | 0.857 |
| Darlene Russell · Wilson · Anderson · Jones (4 customers) | contact names | near spelling | 0.857 |
| Charlene Route · Charlene Station (2 customers) | street address | near spelling | 0.750 |
| Martens Truck & Machine · Martens' Diesel (2 customers) | company name | near spelling | 0.714 |
| 2005 Ford F-350 (asset) | its customer's name | near spelling | 0.714 |
| 4 battery-terminal parts containing MARINE | description | near spelling | 0.714 |
| Coeur d'Alene Truck & Equipment Repair | vendor name | near spelling | 0.714 |
| Purchase order I9160-139 | its item's part name | near spelling | 0.714 |

**18 rows, 2 of which genuinely contained the typed word.** (The QA lead saw 16 before this suite's
own two controlled records were seeded.)

**How to read the score the API reports:** for a near-spelling row it is the similarity multiplied by
0.40, so `0.3429 ÷ 0.40 = 0.857`. 🔴 **This back-calculation only holds where no other boost applies.**
Parts carry extra weight for being in stock, having a bin and having sold recently, so a part row can
report a number above 1.0 — that is a ranking score, **not** a similarity. Do not quote it as one.

---

## THE SETTINGS THAT DECIDE ALL OF THIS

`api/config/packages/search.yaml`, each overridable by an environment variable:

| Setting | Shipped value | What it does |
|---|---|---|
| `SEARCH_FUZZY_SIMILARITY_MIN` | 0.70 | how close a spelling must be to count |
| `SEARCH_FUZZY_SIMILARITY_MIN_SHORT` | 0.80 | the same, for queries of 3 characters or fewer |
| `SEARCH_FUZZY_SHORT_QUERY_LENGTH` | 3 | what counts as a short query |
| `SEARCH_GROUP_LIMIT` | 20 | rows per group (V1 showed **3** per type) |
| `SEARCH_CLIENT_TIMEOUT_SECONDS` | 2.0 | how long a search waits before failing |
| `SEARCH_CIRCUIT_FAILURE_THRESHOLD` | 5 | failures before search short-circuits to its banner |

**For comparison, the two typo examples the design is built around:** `petersn` → *Peterson* scores
**0.88**, `frieghtliner` → *Freightliner* scores **0.92**. The intended tolerance and the observed
noise are far apart, which is why the bar can be tightened without losing anything intended.

---

## WHAT THIS DOES *NOT* CHANGE

🔴 **Nothing here becomes an expectation.** Standing Rule 109 governs this suite: the **V1** product is
the specification, and V2's code — like V2's PRD — is context for *why* the build behaves as it does,
never the standard it is judged against. This file exists so nobody plans around the wrong technology
and so a tester reading "Search unavailable" knows what they are looking at. It settles no case.
