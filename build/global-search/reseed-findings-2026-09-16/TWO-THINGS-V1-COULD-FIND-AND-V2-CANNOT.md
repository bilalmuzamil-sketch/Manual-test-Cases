# Two things the old search could find and the new one cannot

**16 September 2026.** Measured on both: the old version on production (`app.shopview.com`), the new
one on the QA branch `sv9160`, with the same records in each.

> ## 🔴 THIS FILE REPLACES AN EARLIER VERSION THAT WAS WRONG
>
> The earlier version listed **six** losses. **Four of them were not real.** Customer postal code,
> customer website, vendor postal code and vendor state are all searchable in the new version. I
> measured them within a minute or two of the seeder writing those values, and the search index had
> not caught up yet — so I recorded "not found" and built an argument on top of it.
>
> **The reseed writes and the index catches up afterwards. A search run straight after a reseed is
> measuring the index, not the product.** That is now written into the reseed runbook so it does not
> happen again.
>
> The QA lead caught it: he saw `Ohio` returning vendors and said so.

---

## 1 · What is actually lost — two things

| You type | Old version | New version | Case |
|---|---|---|---|
| A **vendor's website** — `kestrelsupply-zzt.com` | ✅ finds ZZAUTOTEST Kestrel Parts Supply | 🔴 **nothing** | [C55692](https://shopview.testrail.io/index.php?/cases/view/55692) |
| A **catalogue part the shop has never stocked** — `ZZT-77-3300` | ✅ finds ZZAUTOTEST Airline Coupler Vernway | 🔴 **nothing** | [C53601](https://shopview.testrail.io/index.php?/cases/view/53601) |

**Both already have a test case, and both will fail when run.** Nothing needs writing.

Each was measured against a control on the same record or record type, so neither is index lag:

| The one that fails | Its control | Why the control proves it |
|---|---|---|
| vendor **website** → not found | vendor **email** → found | Same vendor, same single write, same moment. |
| catalogue-only **part** → not found | stocked **part** → found | Same record type, created minutes apart, both confirmed present. |

The vendor website was re-checked repeatedly over several minutes, and both were re-checked long after
the writes settled.

## 2 · Everything else checks out

Every other field, re-measured properly and confirmed by the identity of what came back, not by a
result count:

| Record | Fields confirmed searchable in BOTH versions |
|---|---|
| Customer | name, address line 1, address line 2, city, state, **postal code**, telephone, **website**, contact name, contact phone |
| Vendor | name, address, city, **state**, **postal code**, telephone, email |
| Asset | year, make, model, unit number, chassis number, licence plate, owner |
| Part (stocked) | part number, description |

---

## 3 · The two are different in kind, and that changes who they go to

**The vendor website looks like a genuine defect.** A customer's website *is* searchable in the new
version. A vendor's is not. The specification lists a website for neither, so the specification does
not explain the difference — one works and the other does not, on the same kind of field. That is the
shape of a bug, not a decision.

**The catalogue-only part looks deliberate.** Specification v1.5 §4 heads that section **"Parts
(Inventory)"**, and §5.3 says *"A Part row opens the inventory part, not the catalogue entry — the row
shows on-hand quantity and stock status, which only exist on inventory."* The old search read the
parts catalogue and never joined inventory, so a part the shop had never carried was still findable —
which is how you check a part exists before ordering it. **That capability is gone by design**, so it
is a question for the Product Owner rather than a bug for engineering.

## 4 · What the old version did, from its own code

`FetchDataQueryHandler.php` at commit `55767168`: the vendor block (lines 153–164) folds in
`COALESCE(v.website, "")`; `fetchPartData` (lines 317–340) reads **CataloguePart** with **no inventory
join anywhere in the query**, so stock level made no difference to whether a part could be found.

For this comparison suite **the shipped old product is the specification** (Standing Rule 109), and a
V2 document that deliberately removes a capability **never subtracts a case** — so both cases stay as
they are and are expected to fail.

---

## 5 · Reproducing it

1. Open global search on the QA branch and type **ZZAUTOTEST** to confirm the test data is there.
2. Open the vendor **ZZAUTOTEST Kestrel Parts Supply** and read its website off the record.
3. Search that website — nothing comes back. Search its email address — the vendor comes back. Same
   record, so it is that one field.
4. Search **ZZT-77-3300** (a part in the catalogue that the shop has never stocked) — nothing comes
   back. Search **ZZT-88-4412** (a part that is in stock) — it comes back.

For the old behaviour, do the same on `https://app.shopview.com` (workplace Trucks Hill 2), which runs
the old search and holds the same records.

**Wait a couple of minutes after any reseed before judging any of this** — see the warning at the top.

---

## OUTSTANDING — what I need from you

| # | What I need |
|---|---|
| **1** | **The vendor website — may I file it?** It behaves differently from the customer website, which works, and the specification does not explain the difference. That reads as a genuine defect. I have filed nothing. |
| **2** | **The catalogue-only part — shall I put it to the Product Owner?** *"The old search could find a part the shop had never stocked; the new one only searches parts that are in inventory — is that intended?"* It matches the specification, so it is a question, not a bug. |
| **3** | **Nothing to author.** Both already have cases — C55692 and C53601 — and both will fail when run. |
