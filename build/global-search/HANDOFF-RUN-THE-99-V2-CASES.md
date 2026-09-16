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

### 🔴 THE THREE CASES WHOSE PRECONDITION NAMES A WORK ORDER THAT DOES NOT EXIST

**C44843, C44847 and C44850 name `S2-15276`. There is no such work order on this branch and there
cannot be** — work-order numbers are assigned by the branch, and new ones here come out as
`S9160-xxxxx`. Typing `S2-15276` returns nothing, which would produce a **false Failed**.

**Use `S2-15440` instead.** Verified live 2026-09-16: it exists, it is pinned as the top hit, and
`S215440`, `S2 15440`, `s2-15440` and even `15440` all return it. `S2-15441`, `S2-15442`, `S2-15445`,
`S2-15450`, `S2-15435` and `S2-15439` all return nothing, so any of them is the near-miss.

Do the same for **C44831/C44828**, which name `S1-644 Fibridge Commercial` — that one says *"for
example"*, and the real equivalent is any of the seeded `S9160-176xx Fibridge Commercial` rows.

**Record in your result which number you actually typed.** The cases themselves should probably be
corrected to name a real number; that is a `update_case` decision for the QA lead, and it is in the
OUTSTANDING list at the end.

---

## §3 · WHAT IS NOT SEEDED, AND WHY — DO NOT MARK THESE FAILED

Every item here is an **infrastructure or tester-technique precondition**, not missing data. If you
cannot satisfy one, the case is **Blocked with the reason**, never Failed (Rule 12, Skill 09).

| Cases | What is missing | What to do |
|---|---|---|
| **6774, all 8** (C44866–C44873) | **The hover quick-actions feature is not on the build** (epic SV-9173 deferred). Confirmed absent again 2026-09-16. | Leave **parked / Not available on Build**. No seed makes them runnable. Do not investigate again — this is recorded so nobody re-derives it. |
| **C44880** | a **second tenant/organisation** | Not seedable — the branch has one organisation (two *locations*, which is not the same thing). **Blocked, infra.** |
| **C44857, C44858, C44859, C45128, C45135** (6728) | recent activity in the **Yesterday / past-week / past-30-day** buckets | Per-user and time-based. "Today" you generate live by opening records. The older buckets cannot be produced by opening records now. **Test what you can, Block the rest with the reason.** |
| **C44877–C44882** (6734) | **role fixtures** | `/api/roles` is not readable by GET (405), so these were not created. Non-prod offers **quick-login `admin` and `tech`** on the login page, which covers *with* vs *without* Parts access (C44877/C44878). The five bundle-specific roles C44882 wants — no Work Orders View, no Part Sales View, no Customers View, no Catalog & Inventory View, no Financial — must be made in the roles UI. **Blocked, infra, with exactly that list.** 🔴 Rule 83: quick-login **evicts the other session on this branch**. |
| **C44876** (offline), **C44829** (screen reader), **6738** (mobile), **C44897** (rollout) | tester technique | No data needed. Use a narrow window / devtools offline / a real screen reader. |
| **C44855** | a user with **no** recent activity | Use a fresh profile or a private window. |
| **C44830** | two work orders tied on relevance but **different last-updated dates** | The API does not let us backdate `updated_at`. The 8 pre-existing `Fib` work orders are 4–17 months old and `paid`, and the 22 seeded ones are new and open — that contrast is real and serves **C44851** properly. For C44830's exact *tie*, judge what you can and say what you could not. |
| **C44838** | statuses **Completed** and **Invoiced** on a `Fib` work order | Five statuses are seeded and visible: **approved, in_progress, ready_for_review, declined, estimate**, plus 8 pre-existing `paid`. Complete and Invoiced need a completed line, a mileage and a tech story per work order and were not built. **Assess the five colours you have and say plainly that two were not exercised.** |

---

## §4 · SECTION 8056 — C55684, the "old location never flashes" case

The Bridgeport fixture is **intact**: customer `ZZAUTOTEST Bridgeport Hauling`, four work orders
**S9160-17625 / -17626 / -17627 / -17628** on the **Staging Heavy Duty** location, a 2019 Freightliner
Cascadia (unit ZZT-4471), and a second location **Staging Lethbridge** to switch to.

🔴 **Search `ZZAUTOTEST Bridgeport`, not bare `ZZAUTOTEST`.** The seeding done today added enough
`ZZAUTOTEST` work orders that the four Bridgeport ones no longer appear in the capped top 20 for the
bare tag. They are all still there and `Bridgeport` returns every one of them — verified 2026-09-16.
This is a change from what the case text assumes, and it is our doing, not a defect.

The assertion itself — that the old location's rows never flash for even a moment during the
re-fetch — is a sub-second human-eye observation. Watch the results closely as they load.

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

## §7 · TWO THINGS TO CARRY INTO YOUR REPORT (found while seeding, not yet filed)

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
| 1 | **C44843, C44847, C44850 name `S2-15276`, which does not exist and cannot be created.** Agree the `update_case` correction to `S2-15440` (near-miss `S2-15441`), or confirm the tester should substitute and note it in the result. | QA lead |
| 2 | **Role fixtures for 6734** — five roles each missing one view bundle, plus a no-financial role, each on a test login. Needs someone with the roles UI. | QA lead / dev |
| 3 | **A second tenant for C44880** — not seedable on this branch. | infra |
| 4 | **The two ticket candidates in §7** — the work-order receive 500, and the three-vs-four payment states. Filing is blocked by the Jira hold. | QA lead |
| 5 | **C44838 Completed/Invoiced** — confirm assessing five of seven badge colours is acceptable, or authorise building two fully invoiced work orders. | QA lead |
