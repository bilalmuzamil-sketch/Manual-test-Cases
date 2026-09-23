# Do we have test cases covering SV-10346 and SV-10385? — checked 23 September 2026

Searched the **whole Global Search suite**, not just run 415: every section under group 6720, every
case's title, preconditions, steps and expected.

## Short answer

**Traceably yes — one case. Effectively no — nothing would have caught either fault, and nothing
will confirm either fix.**

## What exists

| Case | What it asserts | In run 415 | Covers these tickets? |
|---|---|---|---|
| **C44848** *A soft (fuzzy) match is visually indicated* | the matched token is highlighted and a soft-match indicator is shown | **Failed** — its comment names **both** tickets | **The requirement, yes. The scenario, no** — see below |
| **C44837** *A customer or vendor matched on a contact field shows 'Contact match'* | the company row appears and its second line reads `Contact match` | Passed | **No — and it asserts the opposite**: that `Contact match` alone is correct |
| **C55670** *Finding a customer or vendor by a contact's name or phone number* | the company is found | Passed | no — findability, not how the row reads |
| **C45139** *A contact-field match scores as a secondary-field match on its company* | ranking | Passed | no |
| **C44842** *A phonetically-similar name still finds the record* | findability | Passed | no |
| **C55728** *Sound-alike matching applies to names only* | which fields sound-alike applies to | Passed | no |

## Why nothing caught it

**C44848's steps are generic:** *"type a fuzzy query (for example 'Petersn'). Look at how the
matched token is shown in the result row."* A tester following that lands on a **name** match, sees
the mark, and passes it — which is exactly what happened on **21 September**, while both faults were
live. It only turned red on 22 September because the sweep went looking at the contact rows
specifically. **A case that passes while the fault is live is the problem, not the fault.**

**C44837 cannot reach the failing path at all.** Its steps say to type *"the customer's contact
phone digits or email"* — and both of those were **proved on 23 September to be exact-only fields
that never match on a near spelling** (`PROVED-CORRECTED.json`). So every run of it exercises an
*exact* contact match, never a fuzzy one. Its Expected is correct for what it asserts and must not
be touched (Rule 114); it is simply narrower than this fault.

## The gap, concretely

Nothing in the suite **forces a near-spelling match on a contact's name** and then checks how the
row reads. Two cases are missing:

1. **Customer found by a near spelling of its contact's name** — the row shows the contact's name,
   picked out, with the close-match mark. Covers **SV-10346**.
2. **Supplier found by a near spelling of its contact's name** — same. Covers **SV-10385**.

Both would fail today and pass when the fix lands, which is what neither existing case does.

**And C44848 should be tightened** so it cannot pass on one lucky field: it should require a fuzzy
match to be checked on each kind of matched field — the record's own name, an address, and **a
contact name** — rather than "a fuzzy query".

## Not done without asking

Writing TestRail cases is permitted and expected (Rule 62-a), but these three changes are put to the
QA lead first rather than written on my own initiative. Nothing has been created or edited.

---

## DONE — 23 September, on the QA lead's go-ahead

> *"Yes please and make them the part of the test run too."*

### Two cases written, in section 6725 (Fuzzy Matching)

| Case | Covers | Example it names (all verified live before it was written) |
|---|---|---|
| **C96844** *A near spelling of a customer contact name is shown and marked as close* | **SV-10346** | type `Oknokwo` → the seeded customer **ZZAUTOTEST Bridgeport Hauling**, found through its contact **Marlene Okonkwo** |
| **C96845** *A near spelling of a Vendor contact name is shown and marked as close* | **SV-10385** | type `Petersn` → **Schwartz's Diesel Repair**, found through its contact **Sandra Peterson**, with a fallback instruction if that Vendor ever goes |

Both carry the source's sentence **verbatim** (§7 Highlighting), the provenance line, the three
outcomes, and `AUTOMATION: READY - EXPECT FAIL (<ticket>)`. `custom_automation_type: 2` (Functional)
— never left at None. The product's own word **Vendor** is used, not "supplier" (Rule 110).
The customer example deliberately uses **seeded** data so it survives a reseed.

### C44848 tightened — STEPS ONLY

⚠️ **Rule 63, surfaced rather than done quietly.** "Tighten the third" could be read as changing its
Expected. **It was not touched, and must not be:** Rule 114 bars editing `custom_expected` at all,
explicitly including with his go-ahead. It also did not need it — its Expected already states the
requirement correctly. **All of the looseness was in the steps**, which are fixable.

- **Was:** *"1. In the search box, type a fuzzy query (for example 'Petersn'). 2. Look at how the
  matched token is shown in the result row."*
- **Now:** six steps requiring a near spelling in **a record's own name**, **an address**, *and*
  **a contact person's name**, checking **both** halves of the requirement on each, and stating that
  checking one kind and stopping is what let this case be passed on 21 September while two faults
  were live.
- Verified after the write: **Expected byte-identical**, title unchanged.

### Gates cleared on every write

- **Rule 38** — all three are `created_by = 3`. None is Vladimir's.
- **Rule 71** — all three `custom_atmstatus = 1`; none is flagged Automated.
- **Block tags only** in every field written (no `<br>`, no `<strong>`) — playbook §J.
- **Post-write render self-check**: `check_case_render.py` clean on all three.
- **Served-page container scan**: all three cases show every field in `markdown fr-view` on the
  served page. **⚠️ Worth recording: the playbook says an API write leaves the field in the
  escaping container and only a UI save flips it. That did not happen here** — these API writes
  landed in `fr-view` directly. The scan is still required; the assumption behind it has moved.

### Added to run 415 — union only

`update_run` sent **202 case ids = the 200 already in the run ∪ the 2 new ones**, with a guard that
refused to send anything that was not a strict superset (Rule 34 — a partial list deletes tests and
their results). Read back afterwards: **202 tests, no case lost, every earlier result intact.**

### Both then run, so they are not left untested

Executed through the screen by following their own steps. Both **Failed**, outcome 1 of their three
— exactly the known fault, nothing new raised. C96845's evidence is especially clean: in the same
list a Vendor matched on its *address* and another on its own *name* both carry the mark, which
proves the mark renders and is absent on contact rows specifically.

**Run 415 now: 202 tests — 181 passed, 13 failed, 8 retest, 0 blocked.**

---

## RESTYLED — 23 September, on his note about how C44848 reads

> *"here in steps of reproduction it is saying … 'Type a misspelling of a record OWN NAME - for
> example Petersn for Peterson' … Which means it is also giving the exact steps at the same time
> giving the example too. The two tests which you have created should also be like this."*

Right, and the two new cases did not read that way: their step 2 was a bare **"Type: Oknokwo"** — the
example with no general instruction, so a tester learns what to type but not *what kind of thing*
they are typing, and cannot adapt it when the data moves.

**Both rewritten so every step states the general action and carries its example in the same
sentence**, matching C44848:

> *"2. Type a misspelling of a CONTACT PERSON name - a person who is a contact on a customer, not
> the customer own name - for example Oknokwo for Marlene Okonkwo, who is the contact on the
> customer ZZAUTOTEST Bridgeport Hauling."*

The preconditions got the same treatment — they now say *what you need* and then *for example this
record*, rather than naming only the record:

> *"3. You need a customer that has a contact person whose name is NOT similar to the customer's own
> name, so that a misspelling of the person can only match through the contact - for example the
> customer ZZAUTOTEST Bridgeport Hauling, whose contact is Marlene Okonkwo."*

C96845 also gained a final step making the contrast explicit — look at the rows in the same list
matched on an address or on the Vendor's own name, which *do* carry the mark. That is the single
strongest piece of evidence in the case and it should be something the tester is told to look at,
not something they have to notice.

### Checks after the edit

- **`custom_expected` byte-identical on both**, titles unchanged (Rule 114).
- `check_case_render.py` clean; served page shows every field in `markdown fr-view`.
- **Rule 41 — re-verified whole, not just the edited part.** Both re-run through the screen against
  the rewritten steps: followable exactly as written, both still Failed, outcome 1. Results posted
  into run 415 recording the re-verification and answering the fifth step's two checks one at a time.
