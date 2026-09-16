# HANDOFF → DATA-SEEDING SESSION — Global Search (Enhancement, Aug 2026), sv9160
### Seed the QA branch so every one of the 99 build-verified cases can actually be run. 2026-09-16.
### (90 core cases §1–§4, plus Quick Actions on Hover 6774 in §6 and the V1-Regression parity case 8056 in §7.)

**You are the seeding session.** The build-verify pass is done (90/90 runnable, stamped to `v26.36.7-21b4db9`,
render clean). What is missing is the *data* each case needs to be executed. Your job: create that data on the
**`sv9160` QA branch**, verify each search returns what the case expects, and **save a re-runnable seed
manifest so the data can be rebuilt after any branch redeploy.**

- **Suite:** Global Search — Enhancement (Aug 2026). **99 cases**: 90 core (sections 6721–6740 + 6768, §1–§4),
  8 Quick Actions on Hover (6774, §6), 1 V1-Regression parity case (8056 / C55684, §7). All in run **R415**.
- **EXCLUDED — do not seed for, do not touch:** C45140 (6767, Out of V1 Scope) · folder 6769 (V1 Regression
  Suite — not build-verified) · Vladimir Tomovic's cases in section 49.
- **Branch:** `https://sv9160.qa.shopview.com` — a **dummy QA branch; you have FULL CRUD authority** here
  (QA lead, 2026-09-16). Tag throwaway data `ZZAUTOTEST` where a name field allows it (Rule 6).
- **Access recipe:** `source build/testing-tools/ensure_bridge.sh` then
  `node build/testing-tools/qa-branch-boot.mjs sv9160 <route> admin`. Cookie: `sv_sso_session` in
  `/tmp/qa-cookies/sv9160-sso.txt` (chmod 600, /tmp only, never committed — Rule 82). Seed the search palette
  and per-type routes off the build's real labels (`build/OBSERVED-UI-LABELS-sv9160.md`).

## 🛑 READ FIRST — three things that will bite you if ignored
1. **V2 search runs on OpenSearch, not the app database.** A record you create is NOT findable the instant
   you save it — it is copied into the index with a short lag. After seeding, WAIT (seconds, occasionally
   longer) and re-search before concluding a record "isn't found". Search can also be **down while the rest
   of the app works** — if nothing at all returns, check the search service before assuming your seed failed.
2. **Counts are capped at 20 in the palette** (case C53476). "More than 20" only ever needs **21+**; you never
   need to create hundreds. "Five or fewer / more than five" is a real distinction the palette shows, so those
   targets must be exact.
3. **MEASURE, THEN FILL — never seed blind.** For every count target below, first search the term on the build
   and COUNT what already matches, then create only the DELTA to hit the target. The branch already carries
   data; blind seeding overshoots the "≤5" targets and breaks the cases that depend on them.

## §1 · THE SEED UNIVERSE (create these; every count is a measured target, not a floor)
One coherent fictional brand family — **"Fibridge"** — plus a set of exact-identifier records the cases name
verbatim. The cases search these exact terms, so the names must match exactly.

### A. Customers  (route: Customers → New)
| # | Customer name | Must carry | Serves |
|---|---|---|---|
| A1 | **Fibridge Commercial** | a real address; a distinctive **contact** whose phone `(264) 555-0142` and email `deshawn@fibridge-commercial.test` do NOT appear in the company name; ≥1 open work order (see WOs) | C44832, C44837, C44895, C45129, C45139, spine |
| A2 | **Fibridge Logistics** | address | spine (2nd "Fib" customer) |
| A3 | **Fibridge Retail** | address | spine (3rd "Fib" customer) — keep total "Fib" customers **≤5** |
| A4 | **Peterson Hauling** | — | C44839 (`Petersn`→Peterson), C44848 |
| A5 | **Aabridge Freight** | — | C44840 (`Abrige`→Aabridge) |
| A6 | **Toboro Industries** | — | C44836/C44849 (owns Part Sale P2-58) |
| A7 | a customer with telephone **`(264) 328-6723`** (may be A1 if you prefer, but keep the number exact) | phone digits exactly 2643286723 | C44845 |
> Keep the number of customers matching **"Fib"** at **3–5 total** (A1–A3). This is the "≤5 group" half of
> C44824/C44825. Measure first — if the branch already has "Fib" customers, add fewer.

### B. Work Orders  (route: Work Orders → Create Work Order, on a Fibridge customer/asset)
| # | Requirement | Serves |
|---|---|---|
| B1 | **≥21 work orders** whose customer or asset text contains **"Fib"** (so "Fib" → Work orders group caps at 20 / ">20"). Spread them so **all seven statuses** appear at least once: Estimate, Approved, In Progress, Ready for Review, Completed, Declined, Invoiced. | C44823, C44824, C44822, C53476, C44838, C44851, C44816, C44815, C44830, C44898 |
| B2 | Among B1, some **open + recently updated** (Approved/In Progress/Review, updated in last days) and some **old + Completed/Invoiced** | C44851 (relevance ranking) |
| B3 | Work order **`S1-644`** for **Fibridge Commercial**, asset with **unit `TRK 412`**, a **2019 Freightliner Cascadia** | C44831, C44828 (`Fib`→"S1-644 Fibridge Commercial") |
| B4 | Work order **`S2-15276`** exists (exact). **Ensure NO `S2-15286` and NO `S2-15266` exist.** | C44843, C44847, C44850 (exact-match + pinned top hit) |
| B5 | Work orders in several statuses matching one term for badge colours | C44838 |

### C. Assets / vehicles  (route: created with a customer's vehicle, or Assets)
| # | Requirement | Serves |
|---|---|---|
| C1 | **≥1 asset "2025 Freightliner M2" owned by "Bryan Smith"** | C44833, C44841 (`frieghtliner`→Freightliner) |
| C2 | An asset with a **known VIN/serial** (record the exact VIN, e.g. `1FUJGLDR9CLBP8834`) | C44844 |
| C3 | Enough assets containing "Fib"/"Freightliner" that the **Assets group returns matches** for the spine term | C44818, C44815, C44830 |

### D. Parts (inventory)  (route: Parts → inventory → New)
| # | Requirement | Serves |
|---|---|---|
| D1 | A part with **part number `65547`** (exact) | C44846 |
| D2 | Parts matching **one common term** in **three stock states**: ≥1 **in stock** (well above reorder), ≥1 **low** (on-hand ≤ reorder level), ≥1 **out of stock** (on-hand 0) | C44834, C44852 |
| D3 | Enough parts matching the spine term that the **Parts group returns >5** (and >20 for the "All 8 types" cases) | C44819, C44815, C44830 |

### E. Vendors  (route: Vendors → New)
| # | Requirement | Serves |
|---|---|---|
| E1 | Vendor **"Fibridge Mining"** (address) | C44835, C44820 |

### F. Part Sales  (route: Part Sales → New)
| # | Requirement | Serves |
|---|---|---|
| F1 | Part Sale **`P2-58`** for **Toboro Industries** (has a status badge, total price, date). **Ensure NO `P2-59` exists.** | C44836, C44849, C44821 |
| F2 | Enough part sales matching the spine term that the Part Sales group returns matches | C44815, C44830 |

### G. Purchase Orders  (route: Vendor & Order Management → Purchase Orders)
| # | Requirement | Serves |
|---|---|---|
| G1 | Several POs matching one term: ≥1 **Ordered** (not received), ≥1 **Received**; some **recent**, some **weeks old**. Real PO number format. For the ">20 / All-types" cases, ensure the PO group returns matches. | C44899, C45130, C45137, C44815, C44830 |

### H. Vendor Invoices  (route: Vendor & Order Management → Vendor Invoices)
| # | Requirement | Serves |
|---|---|---|
| H1 | Several vendor invoices matching one term (e.g. against Fibridge Mining): **≥1 Unpaid, ≥1 Partially paid, ≥1 Paid**; some **recent** invoice dates, some **older**. | C44900, C45138, C45131, C44815, C44830 |
> H1 is the one gap the build-verify pass could not fully confirm — the branch currently has **only Unpaid**
> invoices. Record a **partial payment** and a **full payment** against two invoices so all three badge states
> exist; then the C44900 tri-state is fully testable.

## §2 · PER-CASE COVERAGE — what each case needs, and the exact term the tester searches
> "Search term" is what the tester types once the seed exists. Where it says *tester technique*, no data is
> needed — see §3. Every C-id below is accounted for; there is no case without a row.

**6721 Palette open/close/keyboard (10):** C44804, C44805 — *header search field visible* (no data).
C44806, C44807, C44808, C44813 — palette open, **any 1 record** so the box is usable. C44809, C44810, C44811 —
need **results grouped** (search **"Fib"**, ≥2 groups). C44812 — records sharing letters across **>1 type**
(search "Fib"). → covered by B1/A1/D3.

**6722 Scope tabs (12):** C44814, C44815 — one query (**"Fib"**) matching **all 8 types** at once (needs B1,
A1-3, C3, D3, E1, F2, G1, H1) as a user who can view every type. C44816 (Work Orders tab), C44817
(Customers tab), C44818 (Assets tab), C44819 (Parts tab), C44820 (Vendors tab), C44821 (Part Sales tab),
C44822 (any tab, count) — same "Fib" query, one tab each. C44822 & C53476 — one group **>20** (B1). C45129 — A1's contact detail (search the contact phone/email).
C45130 — POs + others on one term (G1). C45131 — vendor invoices + others on one term (H1).

**6723 Grouped results & counts (9):** C44823 (one group >20 → B1), C44824 (one group >5 → B1), C44825
(one group ≤5 = Fib customers A1-3 **and** one group >20 = Fib WOs B1, same query "Fib"), C44826 (WO group >5,
"Fib"), C44827/C44830 (all-types order, "Fib"), C44828 (`Fib` highlights "S1-644 Fibridge Commercial" → B3),
C44829 (*screen reader* + results across groups), C53476 (>20 capped → B1).

**6724 Per-entity result shape (9):** C44831 (WO S1-644 with unit+YMM → B3), C44832 (customer Fibridge
Commercial + open WO count → A1+its WOs), C44833 (asset 2025 Freightliner M2 / Bryan Smith → C1), C44834
(parts in 3 stock states → D2), C44835 (vendor Fibridge Mining → E1), C44836 (Part Sale P2-58 / Toboro → F1),
C44837 & C44895 (customer matched on a **contact** field not in its name → A1's contact), C44838 (WOs in
several statuses → B1/B5).

**6725 Fuzzy matching (11):** C44839 (`Petersn`→Peterson A4), C44840 (`Abrige`→Aabridge A5), C44841
(`frieghtliner`→Freightliner C1), C44842 (`Filbridge`→Fibridge A1), C44843 (`S2-15276` / `S215276` / `S2 15276`
→ B4), C44844 (VIN exact → C2), C44845 (`2643286723` etc. → A7 phone), C44846 (part `65547` exact → D1),
C44847 (`S2-15286` returns nothing; `S2-15276` exists → B4), C44848 (soft-match indicator, `Petersn` → A4),
C44849 (`P2-58` exists, `P2-59` does not → F1).

**6726 Ranking (8):** C44850 (exact `S2-15276` pinned top → B4), C44851 (WOs open+recent vs old+completed →
B2), C44852 (in-stock vs out-of-stock part, same term → D2), C44853 (*on a Customer page* — open A1's page,
its assets/WOs boosted; needs A1 to own assets+WOs and other customers to own similar-matching ones), C44854
(*on a Work Order page* that already has parts — open a WO with parts on it; other matching parts exist, some
same category → needs a WO with parts + D3), C45137 (POs Ordered vs Received, recent vs old → G1), C45138
(vendor invoices Unpaid-first, recency → H1), C45139 (customer matched only by a contact field → A1 contact).

**6727 Empty / first-time (2):** C44855 (**a user with NO recent activity** — a fresh user/incognito; no data),
C44856 (open palette; no data).

**6728 Recent activity (5):** C44857, C44858, C44859, C45128, C45135 — **tester technique + view history**:
the tester opens several records of different types at different times (Today/Yesterday/past-week/past-30-days).
This is per-user and time-based — **not shared seed data**. See §3 for the backdating note.

**6729 Persisting query (3):** C44861, C44862, C44863 — a query (**"Fibridge"**) that returns results → A1/B1.

**6730 No-results (2):** C44864 (query that matches nothing, e.g. `S1- 56438` — ensure nothing matches),
C44865 (scope a tab, search a term with no match in that scope). No positive data; just confirm the chosen
no-match term truly matches nothing.

**6732 In-page WO list search (2):** C44874 (Work Orders list page, WOs containing "Fib" → B1), C44875 (same).

**6733 Error state (1):** C44876 — *tester technique*: simulate a search failure (offline / block the search
endpoint). No data.

**6734 Permissions & role scoping (6):** C44877 (role WITH Parts access + matching parts → D3), C44878
(technician WITHOUT Parts access), C44879 (role WITHOUT Work Orders access), C44880 (**second tenant** with
matching text — tenant isolation), C44881 (a type with **zero** accessible records — e.g. a role/tenant with no
Part Sales), C44882 (roles each missing one **view bundle** in turn: Work Orders View, Part Sales View,
Customers View, Catalog & Inventory View, and a **no-financial** role for masked prices). → see §3 role fixtures.

**6737 Page-search cutover (2):** C44896 (reach WO / Inventory Parts / Customers list pages; know a term with
known matches in each → "Fib"), C44897 (signed in after v2 rollout, no flag — environment, no data).

**6738 Mobile (6):** C44898, C45132, C45133, C45134, C45135, C45136 — *tester technique*: a phone or a narrow
browser window below the small breakpoint. Data is the same "Fib" universe (C45133 needs a multi-type match).

**6739 Purchase Orders entity (1):** C44899 (POs exist, Vendor & Order Management access → G1).

**6740 Vendor Invoices entity (1):** C44900 (invoices in **Unpaid, Partially paid, Paid** → H1).

## §3 · PRECONDS THAT ARE NOT SHARED DATA — set these up per the note, don't over-seed
- **Recent activity (6728, C45135):** per-user + time-based. "Today" the tester generates live by opening
  records. The older buckets (Yesterday / Past week / Past 30 days) cannot be produced by opening records now —
  **investigate the recent-entities API** (named in C44860: it records views) to insert **backdated** view rows
  for a dedicated test user; if the API cannot backdate, record that these buckets are tester-generated over
  time and flag it. Provide the test user + the records to open.
- **Roles / permission bundles (6734):** on this QA branch you may create and assign roles (Rule 107). Create
  named test roles, each missing exactly one view bundle — **"QA No Work Orders View", "QA No Parts View",
  "QA No Part Sales View", "QA No Customers View", "QA No Financial"** — plus use the stock **technician** (no
  Parts). Assign each to a test staff login and record the login → role map in the manifest.
- **Second tenant (C44880, C44860):** needs a second organization carrying matching text. If the branch has
  only one org, this is **not seedable** — record it as a tester/infra item and say so plainly; do not fake it.
- **Simulation-only (C44876 offline, C44829 screen reader, 6738 mobile, C44897 rollout):** no data — list them
  in the manifest as "tester technique, no seed".

## §4 · 🛑 SAVE THE SEED SO IT SURVIVES A REDEPLOY (the whole point of this handoff)
A QA branch can be **redeployed and wiped at any time**, taking every record above with it. So the seed must be
**reproducible in one step**, and the artefacts must be **committed** (git is the only durable store — the
container and /tmp are not):
1. Write an **idempotent seed script** — `build/global-search/seed/seed_gs.mjs` — that **measures then fills**:
   for each target it searches/queries the branch, counts what exists, and creates only the delta, so re-running
   it after a redeploy rebuilds exactly this universe without duplicating. Drive creation through the app's real
   endpoints (boot recipe above); tag names `ZZAUTOTEST` where possible.
2. Write a **seed manifest** — `build/global-search/seed/SEED-MANIFEST.md` — listing **every record actually
   created** with its real identifier as the branch assigned it (customer ids, the WO numbers, P-number, PO
   numbers, invoice ids, VIN, the exact contact phone/email, the role→login map). This is what lets the next
   person (or you, post-redeploy) confirm the universe is intact, and what the tester reads.
3. **Commit both** to `claude/slack-session-0sxnd9` after every chunk (Rule 29, path-scoped). Run the secret
   scan first (`python3 build/testing-tools/scan_secrets.py --staged`). **Never commit a cookie or token.**
4. **After a redeploy:** re-run `seed_gs.mjs`, allow OpenSearch to index, re-verify a sample of the §2 searches,
   and update the manifest with the new identifiers the branch assigns.

## §6 · QUICK ACTIONS ON HOVER (folder 6774) — 8 cases C44866–C44873
**🛑 The feature is NOT on the build today** (confirmed absent on v26.36.7-21b4db9, 2026-09-16 — the epic
SV-9173 is deferred/"later release"). So these 8 cases are correctly **parked** ("Not available on Build") and
**cannot be run until the hover quick-actions ship**. There is **no seed you can add that makes them runnable
now** — do not try. When the feature ships, the data they need is **the same core universe from §1** (a
searchable result of each entity type), so no NEW records are required beyond §1. Record this in the manifest
so nobody re-investigates it.

The quick action each case expects (PRD §5.4), and what makes it observable once built:
| Case | Entity → quick action | Data (all from the §1 universe) |
|---|---|---|
| C44866 | Work Order → "Add new line" | a Work Order result (§1 B1); tester is **editing a work order** elsewhere (the action targets it) |
| C44867 | Asset → "New work order" + history/invoices icons | an Asset result (§1 C1/C3) |
| C44868 | Customer → "New work order" + "New contact" | a Customer result (§1 A1) |
| C44869, C44871 | Part → "View part history" only | a Part result (§1 D3); C44871 also while **editing a work order** |
| C44870 | Vendor → "Add contact" | a Vendor result (§1 E1) |
| C44872 | quick actions never destructive | any entity type that has a quick action (§1) |
| C44873 | a quick action per entity that has one (Part Sale → Add part, PO → Receive; Vendor Invoice → none) | one result of each entity type (§1 F/G/H) |
> Until the feature ships: keep parked, don't seed. When it ships: the §1 universe already covers the data; the
> only extra setup is that C44866/C44871 need the tester to be **editing a work order at the same time**.

## §7 · V1-REGRESSION PARITY CASE (folder 8056) — C55684 "old location never flashes"
This one needs a **very specific fixture** and it is **already seeded** on `sv9160` by the parity lane —
confirmed present on the current build (2026-09-16). Your job is to **record it in the manifest and make it
re-creatable**, so it survives a redeploy.

**The fixture (verify present; re-create only if a redeploy wiped it):**
- A customer **"Bridgeport"** (`ZZAUTOTEST`), belonging to the whole company (so it appears at **every**
  location).
- **Exactly four work orders** for that customer **on the Heavy Duty location** (observed: S9160-17625, -17626,
  -17627, -17628, all "ZZAUTOTEST Bridgeport Hauling"). Their asset is a 2019 Freightliner Cascadia (unit ZZT-4471).
- A **second location "Lethbridge"** exists to switch to, where the **customer still appears but its Heavy-Duty
  work orders do NOT** (work orders belong to a location; customers belong to the company).
- Seed check the case itself prescribes: open global search, type `ZZAUTOTEST` — you must get several groups. If
  nothing returns, the build wiped the data — re-run the seed, do NOT hand-create (hand-made records come out
  slightly different and make the test lie).
**Not seedable:** the assertion itself — that the old location's rows never flash for even a moment during the
re-fetch — is a **sub-second human-eye observation** ("watch the results closely as they load"), not a data
state. The data above makes the test *runnable*; a human runs it.

## §5 · DONE means
Every §2 search returns what its case expects on `sv9160` (allowing index lag); the §6 note records that Quick
Actions stay parked until the feature ships (no seed makes them runnable now); the §7 Bridgeport/two-location
fixture is present (or re-created) and in the manifest; the manifest lists every created record by its real id;
`seed_gs.mjs` re-creates the universe idempotently; both are committed; and the non-seedable items (§3 second
tenant, backdated recent activity if the API can't do it, the simulation-only cases, and §7's no-flash
observation) are named plainly as tester/infra items — not faked, not silently dropped.

**Standing holds still apply (Rule 107 does not move them):** no Jira/external artefact, no TestRail *case*
writes without the QA lead, Vladimir's cases never, secrets never committed, production is not a test
environment. This handoff is all on the `sv9160` QA branch and its committed manifest — nothing else.
