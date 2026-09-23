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
