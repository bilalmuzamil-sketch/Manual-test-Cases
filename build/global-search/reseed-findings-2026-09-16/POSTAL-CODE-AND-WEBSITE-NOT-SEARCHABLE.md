# Four things you could search for before, and cannot now — and it is the SPEC, not the build

**Found 2026-09-16 while reseeding the QA branch.** You spotted the postal code. Chasing it turned up
two more fields, and then reading the specification turned the whole thing on its head.

> ## 🔴 THE HEADLINE: THE BUILD IS CORRECT. THE SPECIFICATION DROPPED THESE FIELDS.
>
> Specification v1.5 §4 lists, field by field, what a typed query is matched against. **Postal code
> and website are not in either list, and state/province is not in the supplier list.** The build does
> exactly what §4 says — every field it lists is searchable and every field it omits is not, with no
> exceptions. **So this is not a developer defect and must not be filed as one.** It is a deliberate
> scope reduction that costs three things the old version could do, and whether that is acceptable is
> the Product Owner's call, not engineering's (Standing Rules 58 and 96).

Measured on both sides with the same records in each: the old version on production
(`app.shopview.com`), the new one on the QA branch `sv9160`.

---

## 1 · What was lost

| You type | Old version | New version | In spec v1.5 §4? |
|---|---|---|---|
| A customer's **postal code** — `44872-9931` | ✅ finds it | 🔴 nothing | **not listed** |
| A customer's **website** — `bridgeporthauling-zzt.com` | ✅ finds it | 🔴 nothing | **not listed** |
| A supplier's **postal code** — `43055-2210` | ✅ finds it | 🔴 nothing | **not listed** |
| A supplier's **website** — `kestrelsupply-zzt.com` | ✅ finds it | 🔴 nothing | **not listed** |
| A supplier's **state** — `Ohio` | ✅ finds it | 🔴 nothing | **not listed** (it *is* listed for customers) |
| A **catalogue part the shop has never stocked** — `ZZT-77-3300` | ✅ finds it | 🔴 nothing | §4 indexes **"Parts (Inventory)"** — catalogue-only parts are not in it |

### The fourth one is a whole record type, not a field

The old search read the **parts catalogue** and never looked at inventory at all, so a part the shop
had never carried was still findable — which is how you check whether a part exists before ordering it.
The new search indexes **inventory** parts. §4 says *"Parts (Inventory)"*, and §5.3 confirms the intent:
*"A Part row opens the inventory part, not the catalogue entry — the row shows on-hand quantity and
stock status, which only exist on inventory."*

Proved with a matched pair, both created by the seeder minutes apart:

| Part | In inventory? | Old version | New version |
|---|---|---|---|
| `ZZT-88-4412` ZZAUTOTEST Brake Chamber Kestrel | yes | ✅ found | ✅ found |
| `ZZT-77-3300` ZZAUTOTEST Airline Coupler Vernway | **no** | ✅ found | 🔴 **nothing**, by part number or by name |

Not index lag: polled for 90 seconds (the specification allows 30), and the record is confirmed
present on the branch with the right name and deliberately absent from inventory.

## 2 · The build follows the spec exactly — which is how we know it is the spec's doing

Every field §4 lists, tested one by one. Not a sample.

| Record | Field | Spec §4 | New version |
|---|---|---|---|
| Customer | name, telephone, address 1, address 2, city, state | listed | ✅ all searchable |
| Customer | postal code, website | **omitted** | 🔴 neither searchable |
| Supplier | name, telephone, email, address, city | listed | ✅ all searchable |
| Supplier | postal code, website, state | **omitted** | 🔴 none searchable |

**Not one exception in either direction.** A build that merely had a bug would not line up with a
document this precisely.

§4's own words for customers: *"customer name, telephone (digits only, normalized), address 1/2, city,
state/province, plus the names, telephone numbers and email addresses of the customer's contacts."*
For suppliers: *"name, telephone, email, address, city, plus the names, telephone numbers and email
addresses of the vendor's contacts."*

## 3 · "I added the postal code by hand" — checked, and it is not the explanation

Fair challenge, and it had to be tested: the new search reads an index, so a hand-edited field could be
missing from the **index** rather than from what the search reads. Different fault, different owner.

**The supplier settles it.** Nothing about it was hand-edited — the seeder created it from nothing and
wrote all nine fields in **one API call**, minutes before this was measured. From that single write:
street, town, email and telephone come back; postal code, website and state do not. One record, one
write, one moment — and the index plainly took the write in, because four of the seven fields from it
are searchable. Same for the customer's website, written by the same call that wrote its street, town,
state and second address line.

## 4 · What the old version did, from its own code

`FetchDataQueryHandler.php` at commit `55767168`: the customer block (lines 228–236) folds in
`COALESCE(c.postal_code, "")` and `COALESCE(c.website, "")`; the supplier block (lines 153–160) folds
in `COALESCE(v.postal_code, "")` and `COALESCE(v.state, "")`. For this comparison suite **the shipped
old product is the specification** (Standing Rule 109), and **a V2 document that deliberately removes a
capability never subtracts a case** — so the cases below stay exactly as they are and are expected to
fail. A case rewritten to match the thing it tests cannot fail.

---

## 5 · Five existing cases fail on this. Nothing needs authoring.

| Case | The step that fails | The steps that still pass |
|---|---|---|
| [C53582](https://shopview.testrail.io/index.php?/cases/view/53582) — customer by address, city or postal code | step 5, `44872-9931` | street, city and state all pass |
| [C53583](https://shopview.testrail.io/index.php?/cases/view/53583) — customer by their website | the whole case | — |
| [C53585](https://shopview.testrail.io/index.php?/cases/view/53585) — vendor by address, city or postal code | step 4, `43055-2210` | street and city pass |
| [C53606](https://shopview.testrail.io/index.php?/cases/view/53606) — vendor by state or province | the whole case | — |
| [C55692](https://shopview.testrail.io/index.php?/cases/view/55692) — vendor by their website | the vendor-website step | — |
| [C53601](https://shopview.testrail.io/index.php?/cases/view/53601) — a catalogue part that is not in inventory can still be found | the whole case | — |

Run 415: https://shopview.testrail.io/index.php?/runs/view/415

> ### ⚠️ THE TRAP IN C53606 — it will be marked passed by mistake
> It types **`Ohio`** and expects the **supplier**. Typing `Ohio` **does** return results — because a
> **customer** matches on its state, which is still searchable. A tester glancing at a non-empty
> result list will pass this case. **The case passes only if ZZAUTOTEST Kestrel Parts Supply appears
> under Vendors.** It does not.

**A case that fails on one step is a failing case** — two of these have passing steps around the
failing one, so the tester must say which step.

---

## 5a · A correction to what I reported yesterday

On 15 September I checked this same part and called it findable. **That was wrong, and the way it was
wrong is worth recording.** I searched `ZZT-77-3300`, saw the result count was 1, and took that as a
pass — without checking that the one result was actually our part. Today's check compares the
returned record's identity, and the part is not there at all.

**A result count is not a verdict.** A search that returns something is not a search that returned the
right thing, and on a busy dataset almost every query returns something. Every check in this document
now asserts the identity of what came back, not how many rows there were.

---

## 6 · Reproducing it

1. Open global search on the QA branch and type **ZZAUTOTEST** to confirm the test data is there.
2. Open **ZZAUTOTEST Bridgeport Hauling** and read its postal code and website off the record.
3. Search each one exactly as the record shows it — nothing comes back.
4. Search its town instead — it comes back, which shows the record is findable and it is those fields
   that are not being read.
5. Repeat with **ZZAUTOTEST Kestrel Parts Supply**, and also search its state.

For the old behaviour do the same on `https://app.shopview.com` (workplace Trucks Hill 2), which runs
the old search and holds the same records.

---

## OUTSTANDING — what I need from you

| # | What I need |
|---|---|
| **1** | **This goes to the Product Owner as a question, not to engineering as a bug.** The build matches the specification, so a defect ticket would be closed "works as specified" and would cost us credibility. The question is: *the old search matched a postal code, a website, and a supplier's state; v1.5 §4 drops all three — is that intended?* **Say the word and I will draft it for the PO sheet. I have filed nothing.** |
| **2** | **If the PO says the loss is intended**, these five cases are superseded and should be retired or rewritten, not left failing forever (Standing Rule 94). That is your call once the answer is in. |
| **3** | **Nothing to author either way** — all five cases already exist. They need running, and C53606 needs the trap above pointed out to whoever runs it. |
