import json
B = """{panel:bgColor=#fffae6}
*QA STATUS: THE BEHAVIOUR IS CORRECT AND PASSES - BUT TWO THINGS ARE OUTSTANDING, SO THIS IS NOT A FULL QA PASS YET*

*1. The portal check has not been run.* The portal is enabled on this branch but its payment fails before it can be taken. [~accountid:712020:8f740284-c818-4164-82d3-e6f98ccbba71] said on [this comment|https://shopview.atlassian.net/browse/SV-9697?focusedCommentId=76830] that he will look at it on Monday and test the portal part himself. *This ticket should only be treated as QA passed once Nemanja confirms the portal is working and has verified the portal part.*

*2. The wording on the blocked button has been re-specified since the build.* [~accountid:712020:aa00b8d6-a71f-4259-8919-82a304227c20] replaced it on [18 September|https://shopview.atlassian.net/browse/SV-9697?focusedCommentId=76885], after this build was cut. The shipped messages are the ones approved on 14 September, so they are now out of date. That is a copy change to make, not a defect - the behaviour underneath is right. Details below.
{panel}

I tested this on the QA branch sv9697 on 18 September 2026, against the eleven checks in the Ready-for-testing handoff. Nine passed on behaviour, one is the portal check above, and one the developer had already marked as not testable here. The branch was redeployed part-way through my run when the portal was switched on, so I re-ran the main paths on the new build afterwards and they behave identically.

What it means in plain terms: a part sale that has a credit on it can now be reversed, which is the thing Colby could not do. Before the fix the Reverse option was greyed out whenever a credit had ever existed on the order - even a credit he had already cancelled himself - with no explanation and no way forward. Now an unused or cancelled credit lets the reverse through, the confirmation tells you exactly which credit it is about to cancel and for how much, and only a credit that has genuinely been spent still stops you, with a message naming that credit and what to do about it.

h3. Before and after

!EX1_before_after.png|width=900,height=1289!

_Left to right: the old behaviour on production, the same situation on the fix branch, and the new confirmation wording._

h3. What I checked

||#||Check||Status||
|1|Part sale with a credit, reversed WITHOUT cancelling the credit first - succeeds, confirmation names the credit, credit ends up cancelled|*PASSED*|
|2|Same, but the credit was cancelled by hand first - succeeds, and the already-cancelled credit is left alone|*PASSED*|
|3|Part sale with no credit at all - the confirmation is word for word what it was before|*PASSED*|
|4|A credit applied to another invoice - Reverse greyed out, message names the credit|*BEHAVIOUR PASSED - wording now superseded, see below*|
|5|A credit cashed out as a refund - Reverse greyed out, message says it was refunded and what to do|*BEHAVIOUR PASSED - wording now superseded, see below*|
|6|Two and three spent credits on one part sale - names up to two, counts the rest, always shows the combined total|*BEHAVIOUR PASSED - wording now superseded, see below*|
|7|An invoice paid through the customer portal|*NOT DONE - Nemanja is taking this on Monday*|
|8|A service work order with an unused credit - the confirmation names the credit|*PASSED*|
|9|Reversing a credit and reversing a deposit elsewhere in the system - both unchanged|*PASSED*|
|10|The credited line stays on the order, and part and stock quantities return to where they were|*PASSED*|
|11|Older part sales carrying empty credit records|*NOT TESTABLE HERE - developer's own note, and Chris has confirmed they stay blocked*|

h3. The wording change on the blocked button

Chris replaced this copy on 18 September, after the build. Nothing was built wrong - these are the messages that were approved on the 14th. The four messages on the greyed-out Reverse button all change:

||Situation||What the branch shows today||What Chris has now asked for||
|One credit, used|has been applied. Unwind it before reversing.|has been used. Void the payment that used it before reversing this invoice.|
|One credit, refunded|has been refunded. Reverse the refund before reversing this invoice.|was refunded. Void that refund before reversing this invoice.|
|Two credits|have been applied. Unwind them before reversing.|have been used. Void them before reversing this invoice.|
|Three or more|have been applied. Unwind them before reversing.|have been used. Void them before reversing this invoice.|

The confirmation message on the reverse itself is *not* affected - Chris did not change it, so checks 1, 2, 3 and 8 stand as passed.

His reason is that the words we shipped are not words the product uses anywhere else: a spent credit is shown as *used* (the column is Amount used, the empty state is No credits used), and undoing any financial document is *Void*. He also notes there is no way to un-apply a credit at all - it is spent by creating a zero-cash payment, and voiding that payment is the only way back, which is why the instruction has to name the payment.

*One thing for the developer to decide:* Chris points out that Void refund as a labelled button lives in the Accounting module, while in the core app the same undo is the *Remove* icon on the Payments tab. His preference is that the sentence match the button the shop is actually looking at - so if these shops are not on Accounting, that sentence should say Remove.

h3. What the confirmation says in each situation

!EX5_confirmation_wording.png|width=900,height=1705!

_Three different situations, three correct messages: only the credit it will really cancel is named; nothing extra is added when there is no credit; and service work orders get the new wording too. This is the confirmation, which Chris has not changed._

h3. A credit that has really been spent still stops the reverse

!EX2_spent_credit_tooltips.png|width=900,height=677!

_This is the part the handoff flagged as the highest-value check and as never having been tried through the real flow. I spent the credits properly - by paying an invoice with the credit selected alongside it - and then looked at the part sale. The behaviour is right in all three cases: the button is blocked, the correct credits are named, the count is right and the totals add up. The wording in these pictures is the copy approved on 14 September, which Chris has since replaced._

h3. A refunded credit, and the way out of it

!EX3_refunded_credit.png|width=900,height=702!

_The message tells the shop to undo the refund on the Payments tab. I followed that instruction exactly and it worked - the credit went back to unused and Reverse became available again. Only the wording of the message changes under Chris's ruling; the route out of it is the one shown here._

h3. Nothing is lost from the order, and stock comes back

!EX6_inventory_returns.png|width=900,height=604!

_The credited part is still on the order at quantity 0, and the stock count went 278 to 280 when the credit was issued and back to 278 when the invoice was reversed._

h3. The same confirmation window elsewhere in the system

!EX4_deposit_reverse.png|width=900,height=661!

_Reversing a deposit from the customer's Deposits tab still shows the deposit's own wording, with none of the new credit wording leaking into it._

h3. Where the portal check stands

The portal now opens from the core app and lists our invoices, and part sale P-253 is sitting there unpaid at $35.32 - which is the ideal one to use, because it already carries an unused credit, so paying it through the portal would put the portal message and the credit message directly against each other. Pressing Pay Now, choosing the contact and continuing to checkout returns "Unable to process payment at this time. Please try again later.", so the payment cannot be taken. There is also no invoice anywhere in this organisation that has already been paid through the portal, so there is nothing to look at instead.

Chris has since pointed at a likely cause, which is worth reading before Monday: that portal host is built from portal main dated 2026-08-28 and is 91 commits behind develop, and he found that endpoints which exist on develop are missing from it entirely. So this looks like a stale portal build rather than anything to do with this fix. Once the payment can be taken, the check itself is about ten minutes' work and P-253 is left ready for it.

h3. What I did not treat as a fault

* On the customer's Deposits tab, Reverse is greyed out for a deposit that came from an overpayment and for one that has already been applied. That is the deposit screen's own long-standing rule, each with its own explanation on screen, and it is not part of this change.
* The paid-invoice guard still comes first: on a paid part sale with an open credit, Reverse still gives "This invoice has been paid, please delete payment before reversing." The credit change has not displaced it.

h3. The mixed applied-or-refunded question is now closed

An earlier version of this comment flagged that there was no agreed wording for a part sale where some blocking credits had been used and others refunded. Chris has answered it, and his answer removes the problem rather than adding a sentence for it: "used" is true of a credit spent on an invoice and of one cashed out as a refund, and "Void" undoes both, so a mixed set needs no special case."""
json.dump({"body": B}, open('/tmp/sv9697/body2.json','w'))
print('chars', len(B))
