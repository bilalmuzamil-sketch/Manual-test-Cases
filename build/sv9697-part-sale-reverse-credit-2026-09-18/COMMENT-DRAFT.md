# SV-9697 — QA comment, ready to post (wiki markup, real attachments)

**Status: DRAFT — not posted.** Needs Atlassian cookies to upload the six exhibits as real Jira
attachments (playbook §V.0). No "Technical details for developers" section, per the QA lead's
instruction of 2026-09-18.

Images, in order, with the width/height to pass:

| # | file | markup |
|---|---|---|
| 1 | EX1_before_after.png | `!EX1_before_after.png\|width=900,height=1289!` |
| 2 | EX5_confirmation_wording.png | `!EX5_confirmation_wording.png\|width=900,height=1705!` |
| 3 | EX2_spent_credit_tooltips.png | `!EX2_spent_credit_tooltips.png\|width=900,height=677!` |
| 4 | EX3_refunded_credit.png | `!EX3_refunded_credit.png\|width=900,height=702!` |
| 5 | EX6_inventory_returns.png | `!EX6_inventory_returns.png\|width=900,height=604!` |
| 6 | EX4_deposit_reverse.png | `!EX4_deposit_reverse.png\|width=900,height=661!` |

---

## Body

{panel:bgColor=#e3fcef}
*OVERALL QA STATUS: PASSED*
{panel}

I tested this on the QA branch sv9697 (build v26.36.8-132baea) on 18 September 2026, against the
eleven checks in the Ready-for-testing handoff. Nine passed. One could not be run because the customer
portal is not available on this branch, and one the developer had already marked as not testable here.

What it means in plain terms: a part sale that has a credit on it can now be reversed, which is the
thing Colby could not do. Before the fix the Reverse option was greyed out whenever a credit had ever
existed on the order — even a credit he had already cancelled himself — with no explanation and no way
forward. Now an unused or cancelled credit lets the reverse through, the confirmation tells you exactly
which credit it is about to cancel and for how much, and only a credit that has genuinely been spent
still stops you — with a message naming that credit and what to do about it.

h3. Before and after

!EX1_before_after.png|width=900,height=1289!

_Left to right: the old behaviour on production, the same situation on the fix branch, and the new
confirmation wording._

h3. What I checked

||#||Check||Status||
|1|Part sale with a credit, reversed WITHOUT cancelling the credit first — succeeds, confirmation names the credit, credit ends up cancelled|*PASSED*|
|2|Same, but the credit was cancelled by hand first — succeeds, and the already-cancelled credit is left alone|*PASSED*|
|3|Part sale with no credit at all — the confirmation is word for word what it was before|*PASSED*|
|4|A credit applied to another invoice — Reverse greyed out, message names the credit|*PASSED*|
|5|A credit cashed out as a refund — Reverse greyed out, message says it was refunded and to reverse the refund first|*PASSED*|
|6|Two and three spent credits on one part sale — names up to two, counts the rest, always shows the combined total|*PASSED*|
|7|An invoice paid through the customer portal|*NOT RUN — see below*|
|8|A service work order with an unused credit — the confirmation names the credit|*PASSED*|
|9|Reversing a credit and reversing a deposit elsewhere in the system — both unchanged|*PASSED*|
|10|The credited line stays on the order, and part and stock quantities return to where they were|*PASSED*|
|11|Older part sales carrying empty credit records|*NOT TESTABLE HERE — developer's own note*|

h3. What the confirmation says in each situation

!EX5_confirmation_wording.png|width=900,height=1705!

_Three different situations, three correct messages: only the credit it will really cancel is named;
nothing extra is added when there is no credit; and service work orders get the new wording too._

h3. A credit that has really been spent still stops the reverse

!EX2_spent_credit_tooltips.png|width=900,height=677!

_This is the part the handoff flagged as the highest-value check and as never having been tried through
the real flow. I spent the credits properly — by paying an invoice with the credit selected alongside it
— and then looked at the part sale. One, two and three spent credits each give the wording that was
agreed, and the totals add up._

h3. A refunded credit, and the way out of it

!EX3_refunded_credit.png|width=900,height=702!

_The message tells the shop to reverse the refund on the Payments tab. I followed that instruction
exactly and it worked — the credit went back to unused and Reverse became available again._

h3. Nothing is lost from the order, and stock comes back

!EX6_inventory_returns.png|width=900,height=604!

_The credited part is still on the order at quantity 0, and the stock count went 278 → 280 when the
credit was issued and back to 278 when the invoice was reversed._

h3. The same confirmation window elsewhere in the system

!EX4_deposit_reverse.png|width=900,height=661!

_Reversing a deposit from the customer's Deposits tab still shows the deposit's own wording, with none
of the new credit wording leaking into it._

h3. What I did not treat as a fault

* On the customer's Deposits tab, Reverse is greyed out for a deposit that came from an overpayment
  and for one that has already been applied. That is the deposit screen's own long-standing rule, each
  with its own explanation on screen, and it is not part of this change.
* The paid-invoice guard still comes first: on a paid part sale with an open credit, Reverse still
  gives "This invoice has been paid, please delete payment before reversing." The credit change has not
  displaced it.

h3. What could not be tested, and why

* *The portal-paid invoice (check 7).* I read all 98 invoiced or paid work orders on this branch and
  none of them was paid through the customer portal, and the customer portal itself is not reachable
  from this branch — its sign-in returns a server error. So there is no way to create one here. This
  needs Portal and Billing enabled on a QA branch before it can be checked.
* *Older part sales with empty credit records (check 11).* The handoff says these do not exist on QA
  and asks that they not be created by hand, so this one is left as the developer intended.

h3. One thing still open with the PO

Nemanja's comment of 18 September proposes a different wording for the case where some blocking credits
were applied and others were refunded — "have been applied or refunded" — and says it is not built yet.
Chris has not answered that yet. Every set I tested was all-applied, so it did not come up, but it is
still an open question rather than something I can pass or fail.
