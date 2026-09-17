# Handoff run — Ranking 6726 · Fuzzy 6725 · Permissions 6734

**Run 2026-09-17 (evening), branch `sv9160`, build marker read first and unchanged: `v26.36.7-29ca209`.**
Run 415 — https://shopview.testrail.io/index.php?/runs/view/415

## What was actually outstanding

The handoff scopes **41 cases**. **25 of those 41 were already run earlier the same day** and are
recorded in the run with their evidence — Fuzzy 11, Ranking 8, Permissions 6. Rule 80: a check is not
silently repeated. **16 were genuinely new**, added to the sections after that pass, and those are
what this run covers.

| Section | Live cases | Already run today | New, run now |
|---|---|---|---|
| Fuzzy 6725 | 14 | 11 | **3** — C55713 · C55714 · C55715 |
| Ranking 6726 | 15 | 8 | **7** — C55707 · C55708 · C55709 · C55710 · C55711 · C55712 · C55716 |
| Permissions 6734 | 12 | 6 | **6** — C55702 · C55703 · C55704 · C55705 · C55706 · C55717 |

## Result: 12 Passed · 3 Blocked · 1 Failed (no new ticket needed)

| Case | Verdict | In one line |
|---|---|---|
| C55708 | ✅ Passed | the customer with an open work order ranks first |
| C55710 | ✅ Passed | the vendor with an open purchase order ranks first |
| C55712 | ✅ Passed | the part with recent activity ranks first, stock identical on both |
| C55716 | ✅ Passed | of two equal matches the one saved last ranks first |
| C55713 | ✅ Passed | `Ac` does **not** drag in `Ab Cartage`; `Abcdf` **does** return `Abcde Logistics` as a close match |
| C55714 | ✅ Passed | `I9160-1398` and `ZZT-INV-3` found and pinned; `I-1398`/`I91601398` normalise; `I9160-1399` and `ZZT-INV-9` return nothing |
| C55715 | ✅ Passed | `Altenator` finds the parts through their description, marked as close matches |
| C55702 | ✅ Passed | permitted user sees the Work orders group, count and tab |
| C55703 | ✅ Passed | one Customers permission opens **both** Customers (11) and Assets (6) |
| C55704 | ✅ Passed | permitted user sees the Part sales group and tab |
| C55705 | ✅ Passed | one permission opens **all three** — Vendors 6, Purchase orders 6, Vendor invoices 3 |
| C55717 | ✅ Passed | **run end to end** — see below |
| C55707 | 🔶 Blocked | the "typo" record also matches the query literally |
| C55709 | 🔶 Blocked | the seeded work order is an **Estimate**, not open |
| C55711 | 🔶 Blocked | the two part sales are identical in every way the case compares |
| C55706 | 🔴 Failed | part-sale total missing — **already SV-10163**, no new ticket |

## C55717 — the one that needed real work

The API exposes only `GET` and `DELETE` for staff, so the role had to be changed **through the
screen** (Rule 107, route 3): Settings → Staff → search the person → the `edit_note` icon → the
**Role** dropdown → **Save & Close** (not "Save" — that selector finds nothing).

1. As the technician, opened work order `S9160-17671`; the recent list then held 2 records including it.
2. As Admin, moved that technician onto `ZZAUTOTEST No Work Orders View`; read the change back.
3. As the technician again, the recent list is **empty** and the screen shows the first-time wording.
4. **Positive control:** the same session still returns Customers, Assets, Parts, Vendors, Part sales,
   Purchase orders and Vendor invoices — only Work orders is gone. The list did not empty because
   search broke.
5. **Restored** the technician to the `Technician` role and read that back.

## Why three are Blocked — the data, not the product

* **C55707.** The query is `ZZPREFIX`; the record meant to be reachable *only by a typo* is named
  `ZZPREFIXX Cartage`, which **starts with the query**, so the product reads it as an ordinary
  name match — none of the three rows came back marked as a close match. Two of the three records
  are competing on the same footing and any order proves nothing. **Fix: swap a letter instead of
  adding one** — `ZZPREFIY Cartage`.
* **C55709.** Work order `S9160-17682` is on the 2019 vehicle but is at **Estimate** and `isOpen`
  is false, so neither vehicle carries an open work order. The 2025 ranking above the 2019 is then
  just the newer year breaking a tie. **Fix: move that work order to Approved or In Progress.**
* **C55711.** The only two part sales carrying the keyword were both created by Admin, both
  yesterday, and neither is paid. No recency, creator or payment difference exists to rank on.
  **Fix: seed the set the case describes.**

## 🛑 What I overrode in the handoff, and why (Rule 111)

1. **The handoff contradicts itself.** §0 states all 15 ranking cases are ready and *"every pair's
   differing signal is applied and proven"*; an orphaned fragment at lines 81–93 (under a broken
   table header) says the same five are *not yet differentiated* and must be Blocked; the closing
   OUTSTANDING table repeats that and also says to block **all of Permissions 6734**, which §0
   explicitly contradicts. It reads as a newer draft merged over an older one.
   **Settled by measuring, not by choosing a side:** the ranking verifier passes all 10 checks on
   this build, so the signals are seeded — and four of the five named cases duly passed. The two
   that could not be judged failed for reasons the handoff never mentions.
2. **"Block all of Permissions 6734" was not followed.** All six new permission cases ran and passed.
3. **"C44880 is the one Blocked case — block it, do not fail it."** C44880 is already **Passed**,
   marked by the QA lead himself with a verification video earlier the same day. Left as it stands.
4. **"C55714 names a number that does not exist — treat it as Blocked."** Stale: §3 of the same
   document corrects it, and the case body now names `I9160-1398` and `ZZT-INV-3`, both of which
   exist and behave correctly. It passed.
5. **Two files the handoff instructs you to run were absent from this branch** —
   `verify_ranking.py` and `reseed_everything.sh`. Found on `origin/claude/slack-session-0sxnd9`
   (Rule 97) and brought across rather than reported as missing.

## Two traps that cost time, recorded so they do not again

* **A scope tab left selected silently narrows the next query.** Four checks came back empty
  because the previous case had left the Customers tab active — including the exact-identifier one,
  which looked like a serious failure. **Reset to the All tab before every query.** My own probe
  library documents this; I wrote a fresh helper without it.
* **Pick a one-character-off identifier that does not exist.** `I9160-1397` is a real purchase
  order on this branch, so using it as the "typo" reads as a failure of the no-fuzzy-identifier rule
  when it is nothing of the kind. `I9160-1399` is the correct choice.

## Run 415 after this pass

**152 Passed · 14 Failed · 11 Retest · 3 Blocked · 1 Untested = 181.**
