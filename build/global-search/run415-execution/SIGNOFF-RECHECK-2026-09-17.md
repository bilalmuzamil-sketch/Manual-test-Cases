# The nine checks that had been passed on a sign-off, re-run by observation

**17 September 2026, evening · QA branch sv9160 · build `v26.36.7-29ca209` · run 415**

Nine results in run 415 carried the wording *"RECORDED FROM THE QA LEAD'S OWN VERIFICATION ON THE
REPORT — not from a run by this session"* and, in the same comment, *"Not observed this run … the
test branch cannot be signed in to at the moment."* The branch has been signed in to all evening, so
Rule 12 says these get watched rather than inherited. All nine were re-run through the screen.

| Check | Verdict now | What was seen |
|---|---|---|
| [C53606](https://shopview.testrail.io/index.php?/cases/view/53606) · [test](https://shopview.testrail.io/index.php?/tests/view/2959372) | **Passed, observed** | `Ohio` → six vendors, none carrying the word in its name; the seeded supplier is one of them |
| [C53604](https://shopview.testrail.io/index.php?/cases/view/53604) · [test](https://shopview.testrail.io/index.php?/tests/view/2959370) | **Passed, observed** | `Dock 7B` → the customer, alone; `Bay 12C` → the vendor |
| [C53585](https://shopview.testrail.io/index.php?/cases/view/53585) · [test](https://shopview.testrail.io/index.php?/tests/view/2959362) | **Passed, observed** | street, town and the V1-only postcode all return the vendor |
| [C53582](https://shopview.testrail.io/index.php?/cases/view/53582) · [test](https://shopview.testrail.io/index.php?/tests/view/2959359) | **Passed, observed** | street and postcode return the customer outright; town and state fill the 20-row cap with customers matched **by** town/state, the seeded one ranking behind them |
| [C53516](https://shopview.testrail.io/index.php?/cases/view/53516) · [test](https://shopview.testrail.io/index.php?/tests/view/2902696) | **Passed, observed** | `OHZZT471` → one result in the whole search, the right asset, plate shown as the match |
| [C55670](https://shopview.testrail.io/index.php?/cases/view/55670) · [test](https://shopview.testrail.io/index.php?/tests/view/2980692) | **Passed, observed** | contact first name, surname, full direct line and its last part all return the customer, labelled Contact match |
| [C55662](https://shopview.testrail.io/index.php?/cases/view/55662) · [test](https://shopview.testrail.io/index.php?/tests/view/2977474) | **Passed — and THE CASE needs correcting** | the company's own number finds it, whole and in part; but the case demands the row **not** be labelled *Contact match*, and §4 says it must be |
| [C53603](https://shopview.testrail.io/index.php?/cases/view/53603) · [test](https://shopview.testrail.io/index.php?/tests/view/2959369) | **Passed — and THE CASE needs correcting** | job title finds the customer; the case demands a *Contact match* label that §4 does not owe a job-title match |
| [C55658](https://shopview.testrail.io/index.php?/cases/view/55658) · [test](https://shopview.testrail.io/index.php?/tests/view/2977470) | **NOT CHANGED — conflict surfaced instead (Rule 63)** | see below |

## The two false defects this stopped (Rule 106, the 2026-09-15 extension)

Both would have been filed as product faults by anyone running the case as written.

**C55662.** The case's Expected: *"The result is matched on the COMPANY record, so it should not be
labelled as a contact match."* The live source — Confluence **576978945**, version **17**, read
17 September 2026, §4 *Contact-field matches* — says the opposite, verbatim:

> When a customer or vendor matches on a contact field (phone, email, contact name) rather than its
> own name, its secondary line shows "Contact match" … **This applies whether the matched field sits
> on the company record itself or on one of its contacts.**

The product's own payload for `419-555-0143` reads `match.field: "phone"`, `kind: "exact"`,
`contactInfoMatch: true` — matched on the company's own number and labelled exactly as §4 requires.
**The product is right; the case is wrong.** No ticket. Permission is asked to correct the case.

**C53603.** The case asks for the same label on a **job title** match. §4 gives the label to phone,
email and contact-name matches; a job title is none of those, and the row instead shows the matched
words. **The product is right; the case is wrong.** No ticket.

## C55658 — a conflict with the QA lead's own sign-off, surfaced not overridden

The check is *Finding a work order by typing its status still works*. Its result reads **Passed**,
recorded from his verification on 16 September with the words *"typing a job stage now returns the
jobs sitting at that stage"*, and states plainly that it was **not observed** by any session.

Three readings, taken tonight:

1. **The build** (`v26.36.7-29ca209`, observed through the screen and the product's own payload):
   typing `Estimate` returns **one** work order, matched on the wording of a line item, and that work
   order is at **Paid**. `In Progress` returns one, matched on the word "in" in a line item.
   `inprogress` and `Ready for Review` return nothing. This is the 15 September behaviour unchanged.
2. **The ticket** — [SV-10008](https://shopview.atlassian.net/browse/SV-10008), closed **Done** on
   16 September, last comment by Sinisa Nogic: *"In agreement with … Status will not be a searchable
   field,"* quoting the channel: *"We should add all of them except the two statuses (WO and PS).
   Status is a very weird thing to search for."* So the ticket was closed as a **decision not to do
   it**, not as a fix.
3. **The case** was written against V1 and instructs: *"failing is a fault and a ticket is raised
   against it."*

So the case now disagrees with the newest written decision, and the build agrees with that decision.
Under Rule 106 that makes the **case** the thing to correct, not the product — but the result on it is
**his own sign-off**, so Rule 63 says surface the conflict rather than overwrite it. **The result has
been left exactly as he set it.** The ask is in the report.
