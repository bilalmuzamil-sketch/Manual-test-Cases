# Two things the old search could find and the new one cannot

**16 September 2026.** Measured on both: the old version on production (`app.shopview.com`), the new
one on the QA branch `sv9160`, with the same records in each.

> ## 🔴 READ `WHAT-CHANGED-BETWEEN-THE-TWO-BUILDS.md` ALONGSIDE THIS
>
> An earlier version of this file listed **six** losses and then withdrew four of them as "the search
> index had not caught up". **The withdrawal was wrong.** The four were genuinely broken on build
> `v26.36.4-7869ff2`, already had tickets, and were **fixed in `v26.36.7-893d13a`**, which the branch
> was redeployed to overnight. The companion file has the full account.
>
> **The two below are the ones still broken on the current build**, and both already have a ticket —
> so there is nothing to file.

---

## 1 · What is actually lost — two things

| You type | Old version | New version | Case | Ticket |
|---|---|---|---|---|
| A **vendor's website** — `kestrelsupply-zzt.com` | ✅ finds ZZAUTOTEST Kestrel Parts Supply | 🔴 **nothing** | [C55692](https://shopview.testrail.io/index.php?/cases/view/55692) | [SV-10110](https://shopview.atlassian.net/browse/SV-10110) |
| A **catalogue part the shop has never stocked** — `ZZT-77-3300` | ✅ finds ZZAUTOTEST Airline Coupler Vernway | 🔴 **nothing** | [C53601](https://shopview.testrail.io/index.php?/cases/view/53601) | [SV-10001](https://shopview.atlassian.net/browse/SV-10001) |

**Both already have a test case AND a ticket, and both will fail when run. Nothing to write, nothing
to file.** SV-10110 was raised on 15 September and already carries a developer conversation; SV-10001
was raised on 14 September.

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
| **1** | **Nothing to file and nothing to author.** Both already have a case and a ticket. The duplicate check you asked for came back positive on both. |
| **2** | The vendor-website ticket **SV-10110** has a developer asking which workplace was used, and you have already answered. Nothing needed from this session. |
