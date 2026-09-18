import json
B = """{panel:bgColor=#fffae6}
*OVERALL QA STATUS: PASSED ON EVERYTHING EXCEPT THE PORTAL CHECK - NOT A FULL QA PASS YET*

The one check I could not run is the invoice paid through the customer portal. The portal has been enabled on this branch, but its payment still fails before it can be taken, so that check is outstanding. [~accountid:712020:8f740284-c818-4164-82d3-e6f98ccbba71] said on [this comment|https://shopview.atlassian.net/browse/SV-9697?focusedCommentId=76830] that he will look at it on Monday and test the portal part himself.

*This ticket should only be treated as QA passed once Nemanja confirms the portal is working and has verified the portal part.* Everything else below is done and passed.
{panel}

I tested this on the QA branch sv9697 on 18 September 2026, against the eleven checks in the Ready-for-testing handoff. Nine passed, one is the portal check above, and one the developer had already marked as not testable here. The branch was redeployed part-way through my run when the portal was switched on, so I re-ran the main paths on the new build afterwards and they behave identically.

What it means in plain terms: a part sale that has a credit on it can now be reversed, which is the thing Colby could not do. Before the fix the Reverse option was greyed out whenever a credit had ever existed on the order - even a credit he had already cancelled himself - with no explanation and no way forward. Now an unused or cancelled credit lets the reverse through, the confirmation tells you exactly which credit it is about to cancel and for how much, and only a credit that has genuinely been spent still stops you, with a message naming that credit and what to do about it.

h3. Before and after

!EX1_before_after.png|width=900,height=1289!

_Left to right: the old behaviour on production, the same situation on the fix branch, and the new confirmation wording._

h3. What I checked

||#||Check||Status||
|1|Part sale with a credit, reversed WITHOUT cancelling the credit first - succeeds, confirmation names the credit, credit ends up cancelled|*PASSED*|
|2|Same, but the credit was cancelled by hand first - succeeds, and the already-cancelled credit is left alone|*PASSED*|
|3|Part sale with no credit at all - the confirmation is word for word what it was before|*PASSED*|
|4|A credit applied to another invoice - Reverse greyed out, message names the credit|*PASSED*|
|5|A credit cashed out as a refund - Reverse greyed out, message says it was refunded and to reverse the refund first|*PASSED*|
|6|Two and three spent credits on one part sale - names up to two, counts the rest, always shows the combined total|*PASSED*|
|7|An invoice paid through the customer portal|*NOT DONE - Nemanja is taking this on Monday*|
|8|A service work order with an unused credit - the confirmation names the credit|*PASSED*|
|9|Reversing a credit and reversing a deposit elsewhere in the system - both unchanged|*PASSED*|
|10|The credited line stays on the order, and part and stock quantities return to where they were|*PASSED*|
|11|Older part sales carrying empty credit records|*NOT TESTABLE HERE - developer's own note*|

h3. What the confirmation says in each situation

!EX5_confirmation_wording.png|width=900,height=1705!

_Three different situations, three correct messages: only the credit it will really cancel is named; nothing extra is added when there is no credit; and service work orders get the new wording too._

h3. A credit that has really been spent still stops the reverse

!EX2_spent_credit_tooltips.png|width=900,height=677!

_This is the part the handoff flagged as the highest-value check and as never having been tried through the real flow. I spent the credits properly - by paying an invoice with the credit selected alongside it - and then looked at the part sale. One, two and three spent credits each give the wording that was agreed, and the totals add up._

h3. A refunded credit, and the way out of it

!EX3_refunded_credit.png|width=900,height=702!

_The message tells the shop to reverse the refund on the Payments tab. I followed that instruction exactly and it worked - the credit went back to unused and Reverse became available again._

h3. Nothing is lost from the order, and stock comes back

!EX6_inventory_returns.png|width=900,height=604!

_The credited part is still on the order at quantity 0, and the stock count went 278 to 280 when the credit was issued and back to 278 when the invoice was reversed._

h3. The same confirmation window elsewhere in the system

!EX4_deposit_reverse.png|width=900,height=661!

_Reversing a deposit from the customer's Deposits tab still shows the deposit's own wording, with none of the new credit wording leaking into it._

h3. Where the portal check stands

The portal now opens from the core app and lists our invoices, and part sale P-253 is sitting there unpaid at $35.32 - which is the ideal one to use, because it already carries an unused credit, so paying it through the portal would put the portal message and the credit message directly against each other. Pressing Pay Now, choosing the contact and continuing to checkout returns "Unable to process payment at this time. Please try again later.", so the payment cannot be taken yet. There is also no invoice anywhere in this organisation that has already been paid through the portal, so there is nothing to look at instead. Once the payment goes through, this check is about ten minutes' work.

h3. What I did not treat as a fault

* On the customer's Deposits tab, Reverse is greyed out for a deposit that came from an overpayment and for one that has already been applied. That is the deposit screen's own long-standing rule, each with its own explanation on screen, and it is not part of this change.
* The paid-invoice guard still comes first: on a paid part sale with an open credit, Reverse still gives "This invoice has been paid, please delete payment before reversing." The credit change has not displaced it.

h3. One thing still open with the PO

Nemanja's comment of 18 September proposes a different wording for the case where some blocking credits were applied and others were refunded - "have been applied or refunded" - and says it is not built yet. Chris has not answered that yet. Every set I tested was all-applied, so it did not come up, but it is still an open question rather than something I can pass or fail."""
json.dump({"body": B}, open('/tmp/sv9697/body.json','w'))
print('chars', len(B))
