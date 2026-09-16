# Two things you could search for before, and cannot now

**Found on 2026-09-16 while reseeding the QA branch.** You spotted the postal code yourself. Chasing it
turned up a second field with the same problem, and the same thing is true of suppliers as well as
customers.

**Measured on both sides, not argued from one:** the old version on production
(`app.shopview.com`), the new version on the QA branch `sv9160`. Same records in both.

---

## 1 · What is wrong

| You type | The OLD version | The NEW version |
|---|---|---|
| **A customer's postal code** — `44872-9931` | ✅ finds ZZAUTOTEST Bridgeport Hauling | 🔴 **nothing at all** |
| **Part of it** — `44872` | ✅ finds it | 🔴 nothing of ours |
| **A customer's website** — `bridgeporthauling-zzt.com` | ✅ finds it | 🔴 **nothing at all** |
| **A supplier's postal code** — `43055-2210` | ✅ finds ZZAUTOTEST Kestrel Parts Supply | 🔴 **nothing at all** |
| **A supplier's website** — `kestrelsupply-zzt.com` | ✅ finds it | 🔴 **nothing at all** |

**It is exactly two fields — the postal code and the website — and they are missing for customers and
suppliers alike.** Everything around them still works, which is what makes it look like nothing is
wrong until you try those two:

| You type | Old | New |
|---|---|---|
| the town — `Fernvale` / `Marnston` | ✅ | ✅ |
| the state — `Ohio` | ✅ | ✅ |
| the street — `1450 Kestrelway Industrial` / `Halbrook` | ✅ | ✅ |
| the second address line — `Dock 7B` | ✅ | ✅ |
| the email — `parts@kestrelsupply-zzt.com` | ✅ | ✅ |
| the phone, with dashes — `419-555-0143` | ✅ | ✅ |

---

## 2 · Why it matters on a shop floor

A postal code is how you tell two businesses with similar names apart, and it is often the only thing
written on a delivery note. A website is how a service advisor confirms they have the right company
before quoting. Both were there before; neither is there now.

---

## 3 · The test data is not the explanation

Both values are **on the records**, read back off them today:

* ZZAUTOTEST Bridgeport Hauling — postal code `44872-9931`, website `bridgeporthauling-zzt.com`
* ZZAUTOTEST Kestrel Parts Supply — postal code `43055-2210`, website `kestrelsupply-zzt.com`

The seeder reports **11 of 11 records present, 0 field gaps**. So this is the search not looking at
those fields, not data missing from the records.

## 3a · "I added that by hand" — checked, and it is not the explanation

The QA lead pointed out that he had added the customer's postal code (and some other fields) **by
hand** before asking for the reseed. That is a fair challenge and it had to be tested: the new search
reads from an index, so a hand-edited field could be missing from the **index** rather than missing
from what the search looks at. Those are different faults with different owners.

**It is not that.** The supplier settles it, because nothing about it was hand-edited:

> **ZZAUTOTEST Kestrel Parts Supply was created from nothing by the seeder, and all nine of its fields
> were written in ONE API call, minutes before this was measured.**

From that single write:

| Field, all written by the same call | Searchable? |
|---|---|
| street — `88 Halbrook Trace` → typed `Halbrook` | ✅ found |
| town — `Marnston` | ✅ found |
| email — `parts@kestrelsupply-zzt.com` | ✅ found |
| **postal code — `43055-2210`** | 🔴 **not found** |
| **website — `kestrelsupply-zzt.com`** | 🔴 **not found** |

One record, one write, one moment — and the index clearly took that write in, because three of the
five fields from it come back. **So the index is not stale and the edit route makes no difference. Those
two fields are simply not in the text the search looks at.**

The same holds for the customer's website, which the seeder wrote by API in the same call that wrote
its street, town, state and second address line — and those four are findable while the website is not.

---

## 4 · What the old version did, from its own code

The old product folded both fields into the text it searched, for customers and suppliers alike —
`FetchDataQueryHandler.php` at commit `55767168`: the customer block at lines 228–236 includes
`COALESCE(c.postal_code, "")` and `COALESCE(c.website, "")`; the supplier block at lines 153–160
includes `COALESCE(v.postal_code, "")`. For this comparison suite **the shipped old product is the
specification** (Standing Rule 109), so this is a loss against the standard, not a preference.

---

## 5 · Four existing cases will fail on this — no new cases needed

The suite already covers all four. They have not been re-run since the branch was reseeded.

| Case | What it types | Expected result |
|---|---|---|
| [C53582](https://shopview.testrail.io/index.php?/cases/view/53582) — Finding a customer by address, city or postal code still works | step 5 searches `44872-9931` | **will fail at the postal-code step** (the address and town steps pass) |
| [C53583](https://shopview.testrail.io/index.php?/cases/view/53583) — Finding a customer by their website still works | `bridgeporthauling-zzt.com` | **will fail** |
| [C53585](https://shopview.testrail.io/index.php?/cases/view/53585) — Finding a vendor by address, city or postal code still works | step 4 searches `43055-2210` | **will fail at the postal-code step** |
| [C55692](https://shopview.testrail.io/index.php?/cases/view/55692) — Finding a vendor by their website still works | `kestrelsupply-zzt.com` | **will fail** |

Run 415: https://shopview.testrail.io/index.php?/runs/view/415

**A case that fails only on one of its steps is still a failing case** — the tester should say which
step, and the two postal-code cases each have passing steps around the failing one.

---

## 6 · Reproducing it

1. Open global search on the QA branch and type **ZZAUTOTEST** to confirm the test data is there.
2. Open the customer **ZZAUTOTEST Bridgeport Hauling** and note its postal code and website off the
   record.
3. Search the postal code exactly as the record shows it — nothing comes back.
4. Search the website exactly as the record shows it — nothing comes back.
5. Search the town instead — the customer comes back, which shows the record is findable and it is
   these two fields that are not being looked at.
6. Repeat 2–5 with the supplier **ZZAUTOTEST Kestrel Parts Supply**.

To see the old behaviour, do the same on `https://app.shopview.com` (workplace Trucks Hill 2), which
runs the old search and holds the same records.

---

## OUTSTANDING — what I need from you

| # | What I need |
|---|---|
| **1** | **May I file this?** It is one defect with two fields and two record types, or two defects split by field — your call which shape. **I have filed nothing** (the creation hold of 2026-08-10 stands, and permission is per ask anyway). Evidence is measured on both sides and ready. |
| **2** | **Nothing to author.** All four affected cases already exist, so this needs no new cases — only a run. The execution session's handoff covers them. |
