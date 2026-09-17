# HANDOFF → THE SESSION THAT RUNS THE 99 GLOBAL SEARCH V2 CASES

**Written 2026-09-16 by the seeding session. The data is in place on both estates and proven by
search; your job is to execute the cases and write a result for every one of them into run 415.**

| | |
|---|---|
| **Suite** | Global Search — Enhancement (Aug 2026), epic **SV-9160** |
| **Run** | **R415** — <https://shopview.testrail.io/index.php?/runs/view/415> |
| **Scope** | **99 cases**: 90 core (sections 6721–6740), 8 Quick Actions (6774), 1 V1-Regression parity (8056) |
| **Build to test** | `https://sv9160.qa.shopview.com` — marker at seeding time **`v26.36.7-29ca209`** |
| **🔴 Check the marker first** | `curl -s https://sv9160.qa.shopview.com/ \| grep app-version`. **If it has moved, the branch was redeployed and your data may be gone — reseed before you conclude anything** (see §6). |

> **🔴 THIS IS NOT HYPOTHETICAL. The branch was redeployed on 2026-09-16 while this handoff was
> being written** — `v26.36.7-21b4db9` → **`v26.36.7-29ca209`** — and **it wiped every seeded
> record**: 1 of 33 survived. It was rebuilt with one command and re-proven at 35/35, which is why
> §6 exists and why the ids in the inventory are the ones from *after* the redeploy. Earlier, on the
> same day, a different redeploy changed four behaviours overnight and blaming the search index
> instead withdrew four TRUE findings. **Read the marker before you believe anything about the data.**

## 🛑 DO NOT TOUCH

- **C45140** (section 6767, "Out of V1 Scope") — excluded.
- **Section 6769** (V1 Regression Suite, 66 cases) — a different lane owns it.
- **Vladimir Tomovic's cases in section 49** — foreign, hands-off (Rule 38). Report, never edit.
- **No TestRail *case* writes** without the QA lead's go-ahead. You are writing **results**, which is
  a different thing and is what this run is for.
- **No Jira tickets.** The creation hold is still active (Rule 62). Findings go in your report as
  *candidates*; the QA lead files them.

---

## §1 · WHAT IS SEEDED, AND THE TERM THAT REACHES IT

One fictional brand family — **Fibridge** — plus a few exact-identifier records. Everything is tagged
`ZZAUTOTEST`. **The full inventory with every real id is
`build/global-search/seeding/SEED-MANIFEST-GS-V2-qa.md`** (and `-prod.md` for production).

| Type | What exists | Type this |
|---|---|---|
| Customers | ZZAUTOTEST **Fibridge Commercial** / **Logistics** / **Retail**, plus Peterson Hauling, Aabridge Freight, Toboro Industries, Deshawn Freight Lines, Bryan Smith Hauling | `Fib` |
| Contact | **Deshawn Oyelaran**, Fleet Manager at Fibridge Commercial — phone **`(264) 555-0142`**, email **`deshawn@fibridge-commercial.test`**. Neither appears in the company name. | the phone or the email |
| Assets | 6 owned by Fibridge companies (units TRK 412–416, one **deliberately with no unit**), plus a **2025 Freightliner M2** owned by **Bryan Smith Hauling** | `Fib`, or **`Bryan Smith`** for the M2 |
| Work orders | **22** on Fibridge customers across **estimate, approved, in_progress, ready_for_review, declined**, plus 8 the branch already had, all `paid` and 4–17 months old | `Fib` |
| Parts | three stock states on one term — **40 on hand / 2 on hand against a reorder level of 5 / 0 on hand** — plus part number **`65547`** | `Fib`, and `65547` |
| Vendor | ZZAUTOTEST **Fibridge Mining** | `Fib` |
| Part sale | one, for Fibridge Commercial | `Fib` |
| Purchase orders | **10** on the Fibridge vendor — 6 `ordered`, 4 `fulfilled` | `Fib` |
| Vendor invoices | **4**: `ZZT-INV-1` and `ZZT-INV-S1` **Unpaid**, `ZZT-INV-2` **Partially paid**, `ZZT-INV-3` **Paid** | `Fib` |

### The count targets, measured live after seeding

| Group on `Fib` | Count | Why it is that number |
|---|---|---|
| customers | **3** | C44825 needs a group at **five or fewer** |
| assets | **6** | C44825 needs a group **above five** |
| work orders | **20** | the palette **caps every count at 20** (C53476). 30 match; 20 is the cap, and seeing 20 IS the pass |
| purchase orders | 12 | |
| vendor invoices | 4 | |

🔴 **Measure on `Fib`, never on `Fibridge`.** The long form fuzzy-matches the word **"Bridge"** inside
hundreds of staging addresses and returns 7 customers and 5 vendors that have nothing to do with us.
`Peterson` does the same. **A group total is never evidence your record is there — look for the
record** (Rule 110b).

---

## §2 · THE EXACT TERMS, ALL 35 RE-PROVEN THE DAY THIS WAS WRITTEN

`python3 build/global-search/seeding/verify_gsv2.py` re-runs every one of these against the live
branch in about a minute. **Run it before you start.** If it passes, the data is good and any failure
you then see is the product. If it does not, reseed (§6) before writing a single result.

| You type | You must get |
|---|---|
| `Fib` | all eight groups, our records in each |
| `Fibridge` | results (for the persisted-query cases) |
| `TRK 412` | the 2019 Freightliner Cascadia |
| `1FUJGLDR9CLBP8834` | the same asset, by VIN |
| `Bryan Smith` | the **2025 Freightliner M2** |
| `frieghtliner` (typo) | Freightliner assets |
| `Petersn` / `Abrige` / `Filbridge` | Peterson Hauling / Aabridge Freight / Fibridge |
| `deshawn@fibridge-commercial.test` | **Fibridge Commercial**, flagged *Contact match*, with **no Contacts group** |
| `(264) 555-0142` · `264-555-0142` · `2645550142` | the same customer — all three forms work in V2 |
| `2643286723` | Fibridge Commercial, on its **own** telephone |
| `Deshawn` | **Deshawn Freight Lines first** (own name), **Fibridge Commercial second** (contact field) — that ordering is C45139 |
| `65547` | the part |
| `P2-58` | the part sale · **`P2-59` returns nothing** |

🔴 **`P2-59` IS FRAGILE AND YOU MUST RE-CHECK IT BEFORE RUNNING C44849.** A part-sale number matches
**across shop prefixes** — typing `P2-59` will return a part sale numbered `P9160-259`, from a
completely different shop. Part-sale numbers are assigned sequentially, so **any reseed of any suite
can create one and silently break this case's precondition.** It happened on 2026-09-16 and the
verifier caught it. If `P2-59` returns a row: a part sale is a work order underneath, so
`POST /api/work-orders/delete {work_order_id}` removes it and the seeder issues the next number.
Work-order numbers do **not** behave this way — `S2-15441` is safe.
| `S2-15440` · `S215440` · `S2 15440` | the same work order, **pinned at the top** |
| `S2-15441`, `S2-15450` | **nothing** |
| `S1- 56438` | **nothing** (the no-results case) |

### ✅ THE THREE EXACT-NUMBER CASES ARE CORRECTED — nothing for you to do

**C44843, C44847 and C44850 used to name `S2-15276`, which does not exist and cannot** (work-order
numbers are branch-assigned). They now name **`S2-15430`**, near miss **`S2-15431`**, corrected on
the QA lead's approval under Standing Rule 111 — **the number only; every other word is byte-identical
to the original.**

Verified live before the edit and again after: `S2-15430` is pinned as the top hit, `S215430`,
`S2 15430`, `s2-15430` and `15430` all return it, `S2-15431` returns nothing, and the record **opens**
(`S-15430`, status Paid, Staging Heavy Duty). It is pre-existing estate data that survived the
redeploy which wiped every seeded record, so it should still be there when you run.

🔴 **The trap that nearly went into the case, so you do not repeat it:** the first replacement chosen
was `S2-15440`, which the palette returns, pinned, with every variant working — and which **cannot be
opened**, because the search index is organisation-scoped while the record is workplace-scoped and it
lives at a workplace this login cannot reach. **A row in the palette is not proof the record is
reachable.**

`S1-644` still appears in C44828, C44831, C44858, C44859 and C44866 — those say *"like"* or *"for
example"* and the tester never types them, so they cannot cause a false Failed and were deliberately
left alone.

---

## §3 · WHAT IS NOT SEEDED, AND WHY — DO NOT MARK THESE FAILED

Every item here is an **infrastructure or tester-technique precondition**, not missing data. If you
cannot satisfy one, the case is **Blocked with the reason**, never Failed (Rule 12, Skill 09).

| Cases | What is missing | What to do |
|---|---|---|
| **6774, all 8** (C44866–C44873) | **The hover quick-actions feature is not on the build** (epic SV-9173 deferred). Confirmed absent again 2026-09-16. | Leave **parked / Not available on Build**. No seed makes them runnable. Do not investigate again — this is recorded so nobody re-derives it. |
| **C44880** | a **second tenant/organisation** | Not seedable — the branch has one organisation (two *locations*, which is not the same thing). **Blocked, infra.** |
| **C44857, C44858, C44859, C45128, C45135** (6728) | recent activity in the **Yesterday / past-week / past-30-day** buckets | Per-user and time-based. "Today" you generate live by opening records. The older buckets cannot be produced by opening records now. **Test what you can, Block the rest with the reason.** |
| ~~**C44877–C44882** (6734)~~ | **✅ NOW RUNNABLE — see §4a** | The roles exist. Nothing blocked. |
| **C44876** (offline), **C44829** (screen reader), **6738** (mobile), **C44897** (rollout) | tester technique | No data needed. Use a narrow window / devtools offline / a real screen reader. |
| **C44855** | a user with **no** recent activity | Use a fresh profile or a private window. |
| **C44830** | two work orders tied on relevance but **different last-updated dates** | The API does not let us backdate `updated_at`. The 8 pre-existing `Fib` work orders are 4–17 months old and `paid`, and the 22 seeded ones are new and open — that contrast is real and serves **C44851** properly. For C44830's exact *tie*, judge what you can and say what you could not. |
| **C44838** | **✅ ALL SEVEN badge colours now exist** | 🔴 **Search `Fibridge Commercial`, NOT `Fib`.** Thirty work orders match `Fib` and the palette caps every group at 20, so the two `declined` ones rank out of sight and no scope tab or limit brings them back. `Fibridge Commercial` returns 18 rows carrying **approved, estimate, in_progress, ready_for_review, complete, declined and invoiced** — all seven. |

---

## §4 · SECTION 8056 — C55684, the "old location never flashes" case

The Bridgeport fixture is **intact**: customer `ZZAUTOTEST Bridgeport Hauling`, four work orders
**S9160-17625 / -17626 / -17627 / -17628** on the **Staging Heavy Duty** location, a 2019 Freightliner
Cascadia (unit ZZT-4471), and a second location **Staging Lethbridge** to switch to.

**Re-measured 2026-09-17 on `v26.36.7-29ca209`: the case is runnable exactly as written.** Typing
`ZZAUTOTEST` returns a Work orders group of 20 (the palette cap) and **all four Bridgeport work
orders are among the rows shown**, and **all 20 rows are Staging Heavy Duty work orders** — so
"write down the number of any one of them and use THAT number" is safe whichever row the tester
picks. `ZZAUTOTEST Bridgeport` narrows it to exactly the four if you want them on their own.

The one stale word: the precondition says the group "lists our four test jobs", and it now lists 20,
because this session's seeding added 22 more `ZZAUTOTEST` work orders. That does not block the test —
it is a count in a sentence, not a record identifier — and it is in the OUTSTANDING list rather than
silently edited.

The assertion itself — that the old location's rows never flash for even a moment during the
re-fetch — is a sub-second human-eye observation. Watch the results closely as they load.

---

## §4a · PERMISSIONS AND ROLES (section 6734) — what to sign in as

The search decides which of the eight groups you see from the **role's permission bundle**, not from
the section names in the UI. The mapping (read from the product source, `SearchSectionAccess.php`):

| Group | Needs |
|---|---|
| Work orders | `Work Orders: View` |
| **Customers AND Assets** | `Customers: View` — **one permission, two groups** |
| Parts | `Catalog & Inventory: View` |
| Part Sales | `Part Sales: View` **AND** `See Financial Data` — **three conditions, not two** |
| Vendors, Purchase Orders, Vendor Invoices | `Vendor & Order Management: View` |
| — | the **Time Clock** role sees **nothing at all**, whatever its bundles say |

**Sign in as these. Six of the seven already shipped with the branch; two were created for you.**

| Case | Sign in as | Sees |
|---|---|---|
| C44877 (WITH parts) | **Admin** (or Office User, Foreman, Service Advisor…) | everything |
| C44878 (technician WITHOUT parts) | **Technician** | work orders, customers, assets only |
| C44879 (WITHOUT work orders) | **ZZAUTOTEST No Work Orders View** ← created | everything except work orders |
| C44881 (a type with zero accessible records) | **Technician** | Parts / Part Sales / Vendors groups are **absent**, not empty |
| C44882 (bundles hide groups + masked prices) | **Technician** (no parts, no part sales, no financial) · **Sales Representative** (no parts, no vendor management) · **ZZAUTOTEST No Work Orders View** · **ZZAUTOTEST No Customers View** ← created · **Time Clock User** (nothing) | one bundle missing in each |

**A hidden group must leak neither rows NOR its count.** "Vendors (14)" tells a technician the shop
has 14 matching vendors — which is exactly what the bundle withholds. Check the count is gone too.

🔴 **Rule 83: quick-login evicts whoever else is working on this branch.** Coordinate before using it.

---

## §5 · HOW TO RECORD A RESULT (Skill 09)

1. **Status honestly.** Passed / Failed / Blocked. **Never Skipped, never a guess.** Anything you did
   not observe is **Blocked with the reason**, and a Blocked case names what would unblock it.
2. **Every result carries the build marker** you read at the start, and the date.
3. **Every Failed or Blocked comment carries a plain "what needs to be done"** a non-technical QA can
   act on. Never a bare status (Rule 7).
4. 🔴 **Before you call anything a regression, do the three checks of Rule 110.**
   **(a) Attribution** — is it really the field you think? Blank it and search again.
   **(b) Identity** — is OUR record in the list? A count is not a verdict; a count of 1 once produced
   a false PASS on a real regression. **(c) Provenance** — record the build marker; a QA branch
   redeploys unannounced.
   Then **search Jira for an existing ticket before reporting any loss** — on 2026-09-16 all six
   reported losses already had one.
5. **Union-only when syncing the run** (Rule 34): a partial `case_ids` list **DELETES** tests and
   their results.
6. **Report `ours N / live total M`** wherever you quote a case count — the run holds foreign cases.

---

## §6 · IF THE BRANCH WAS REDEPLOYED (or anything looks missing)

Say **`RESEED GSV2 QA`** and it is rebuilt. The full runbook is
`build/global-search/seeding/RESEED.md`; the sequence is:

```bash
cd build/global-search/seeding
export SEED_MANIFEST=seed-manifest-gs-v2.json
python3 seed.py --check && python3 seed.py --confirm
python3 set_wo_statuses.py --confirm
python3 seed_po_and_invoices.py --confirm
python3 verify_gsv2.py          # ← the run is not reseeded until THIS passes
```

**A reseed is finished when the verifier passes, not when the seeder prints 33/33.** "The record
exists" is not "the search returns it".

**Two things that will mislead you if you do not know them:**
- **V2 indexes asynchronously.** A record you create is not findable the instant you save it. Wait,
  then re-search, before concluding anything is absent.
- **Search can be down while the rest of the app is fine.** If *nothing at all* returns, that is the
  search service, not your data.

---

## §7 · TWO TICKET CANDIDATES — **YOU file these, and you RE-CHECK them first**

**The QA lead's instruction, 2026-09-17: this session runs the tests and files a ticket for every
defect found — and 🔴 CHECKS EACH OF MY FINDINGS AGAIN BEFORE TRUSTING IT.**

I am a different session with no more authority than you. Everything below was measured on
`v26.36.7-29ca209` and could be stale, environment-specific, or simply wrong — one finding in this
project was already withdrawn after a vendor's *email* was mistaken for its *website*, and four true
findings were wrongly withdrawn by blaming a search index for a redeploy. **So before you file:
reproduce it, apply Rule 110's three checks (attribution, identity, provenance), and search Jira for
an existing ticket — on 2026-09-16 all six reported losses already had one.** If it does not
reproduce, say so; that is a useful result, not an awkward one.

1. **Receiving a purchase order raised from a WORK ORDER answers HTTP 500.** The identical payload
   against a standalone inventory purchase order succeeds. Measured five times on
   `v26.36.7-21b4db9` with the vendor credit term corrected, real bin allocations supplied and a part
   number already in the catalogue. `AcceptDeliveryCommandHandler` ends with
   `refreshTouchedWorkOrders()`, which a standalone order never reaches. **Suspected product defect —
   a ticket candidate, not filed (Rule 62 hold).**
2. **The vendor-invoice payment badge has FOUR states, not the three the PRD and C44900 describe.**
   `vendor_transaction_status` declares `unpaid`, `partially_paid`, `paid` **and `credit`** (rendered
   "Unapplied"), plus `null` before any transaction exists. The product's own code comment says so and
   calls it *"correcting D19"*. **Document says three, code says four → a PO decision item under Rule
   96, never a silent assumption.** C44900 as written tests three; test those three and note the
   fourth.

---

## OUTSTANDING — what I need from you (Rule 36)

| # | Item | Who |
|---|---|---|
| 1 | **File the two ticket candidates in §7** — after re-checking each one yourself. | you |
| 2 | **A second tenant for C44880** — not seedable; the branch has one organisation, and two *locations* is not the same thing. **Blocked, infra.** | infra |
| 3 | **The older recent-activity buckets (6728)** — Yesterday / past week / past 30 days cannot be produced by opening records now, and the API cannot backdate a view. Test "Today" live, Block the rest with the reason. | tester |
| 4 | **Rule 65 notice:** C44843, C44847, C44850 and C55684 carry `automation_type = Functional` and were edited (identifier and count only). Tell Vlad. | QA lead |

---

## APPENDIX · IF YOU NEED THE DATA REBUILT

Say **`RESEED GSV2 QA`**, or run it yourself — one command, seven steps, about ten minutes:

```bash
cd build/global-search/seeding && ./reseed_gsv2.sh qa
```

**It is safe to run any number of times**: every step measures first and creates only the difference,
and a third consecutive run changes nothing. **A reseed is finished when the verifier passes, not
when the seeder prints 33/33** — *"the record exists"* is not *"the search returns it"*.

Everything known about this data — every trap with the symptom it presents as, the exact count
targets, the permission map, and what is not seedable and never will be — is on one page:
**`build/global-search/seeding/RESEED-KNOWLEDGE.md`**. Read it before debugging anything.
