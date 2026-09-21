import json
B = """{panel:bgColor=#fffae6}
*QA STATUS: THE BEHAVIOUR IS CORRECT AND PASSES - TWO THINGS ARE STILL OUTSTANDING, SO THIS IS NOT A FULL QA PASS YET*

*1. The new button wording is not on the branch yet, so checks 4, 5 and 6 cannot be re-run.* [~accountid:712020:aa00b8d6-a71f-4259-8919-82a304227c20] asked on [21 September|https://shopview.atlassian.net/browse/SV-9697?focusedCommentId=76957] for the four blocked-button messages to be re-checked against his new copy. I checked today: the branch still shows the 14 September wording, word for word, and the deployed code contains no "Payments tab" and no "Remove" sentence at all. That is expected - he costed it himself as a string-only rebuild - so there is simply nothing to re-run against until that rebuild lands. Once it does, the three checks are about ten minutes and the test data is already sitting there.

*2. The portal is fixed, a payment went through, and ShopView has not received it.* [~accountid:712020:8f740284-c818-4164-82d3-e6f98ccbba71] is right that the portal now works - I signed in and paid a real invoice end to end with a card. The portal reports it as Succeeded. But the invoice in ShopView is still showing as unpaid forty minutes later, so the portal message still cannot be seen and check 7 is still not done. Details and numbers below.
{panel}

I tested this on the QA branch sv9697 against the eleven checks in the Ready-for-testing handoff, first on 18 September and again on 21 September. Nine pass on behaviour, one is the portal check above, and one the developer had already marked as not testable here. The branch has not changed since 18 September - same build, same code for these messages - so everything that passed then still stands today.

What it means in plain terms: a part sale that has a credit on it can now be reversed, which is the thing Colby could not do. Before the fix the Reverse option was greyed out whenever a credit had ever existed on the order - even a credit he had already cancelled himself - with no explanation and no way forward. Now an unused or cancelled credit lets the reverse through, the confirmation tells you exactly which credit it is about to cancel and for how much, and only a credit that has genuinely been spent still stops you, with a message naming that credit and what to do about it.

h3. Before and after

!EX1_before_after.png|width=900,height=1289!

_Left to right: the old behaviour on production, the same situation on the fix branch, and the new confirmation wording._

h3. What I checked

||#||Check||Status||
|1|Part sale with a credit, reversed WITHOUT cancelling the credit first - succeeds, confirmation names the credit, credit ends up cancelled|*PASSED*|
|2|Same, but the credit was cancelled by hand first - succeeds, and the already-cancelled credit is left alone|*PASSED*|
|3|Part sale with no credit at all - the confirmation is word for word what it was before|*PASSED*|
|4|A credit applied to another invoice - Reverse greyed out, message names the credit|*BEHAVIOUR PASSED - new wording not built yet, cannot re-run*|
|5|A credit cashed out as a refund - Reverse greyed out, message says it was refunded and what to do|*BEHAVIOUR PASSED - new wording not built yet, cannot re-run*|
|6|Two and three spent credits on one part sale - names up to two, counts the rest, always shows the combined total|*BEHAVIOUR PASSED - new wording not built yet, cannot re-run*|
|7|An invoice paid through the customer portal|*STILL NOT DONE - the payment succeeds in the portal but does not reach ShopView*|
|8|A service work order with an unused credit - the confirmation names the credit|*PASSED*|
|9|Reversing a credit and reversing a deposit elsewhere in the system - both unchanged|*PASSED*|
|10|The credited line stays on the order, and part and stock quantities return to where they were|*PASSED - re-checked on the Inventory screen*|
|11|Older part sales carrying empty credit records|*NOT TESTABLE HERE - developer's own note, and Chris has confirmed they stay blocked*|

h3. The wording change on the blocked button - and where it stands today

Chris has now settled this twice. His 18 September copy used "used" and "Void"; Nemanja then showed that neither of those words exists anywhere in the released app, and Chris agreed and replaced his own copy again on [21 September|https://shopview.atlassian.net/browse/SV-9697?focusedCommentId=76957]. *This is the version to build.* Nothing was built wrong - the branch carries the copy that was approved on 14 September.

||Situation||What the branch shows today||What Chris has now asked for||
|One credit, used on a payment|Credit CM-3956 ($231.00) has been applied. Unwind it before reversing.|Credit CM-4353 ($600.00) has been applied. Remove the payment that used it on the Payments tab before reversing this invoice.|
|One credit, refunded|has been refunded. Reverse the refund before reversing this invoice.|Credit CM-4353 ($600.00) was refunded. Remove that refund on the Payments tab before reversing this invoice.|
|Two credits|Credits CM-2190 and CM-2191 ($240.16 total) have been applied. Unwind them before reversing.|Credits CM-4353 and CM-4360 ($1,350.00 total) have been applied. Remove the payments that used them on the Payments tab before reversing this invoice.|
|Three or more|have been applied. Unwind them before reversing.|Credits CM-4353, CM-4360 and 2 more ($2,100.00 total) have been applied. Remove the payments that used them on the Payments tab before reversing this invoice.|

*I checked today whether the new copy is already on the branch. It is not.* I hovered the greyed-out Reverse button on two part sales and read what it actually says:

* P-193, one spent credit: _"Credit CM-3956 ($231.00) has been applied. *Unwind* it before reversing."_
* P-57, two spent credits: _"Credits CM-2190 and CM-2191 ($240.16 total) have been applied. *Unwind* them before reversing."_

Both still say *Unwind*, which is the word everyone has now agreed is not ours. The deployed code agrees with the screen - the file these four messages live in still contains both "Unwind" sentences, and contains no "Payments tab" and no "Remove" sentence at all. The branch itself has not been rebuilt since 18 September.

So there is nothing to re-run yet, and nothing to fail. *The moment the string-only rebuild lands, checks 4, 5 and 6 are quick* - the test data is already in place: P-193 has one spent credit, P-57 has two, and a refunded credit is one Cash Out away.

The confirmation message on the reverse itself is *not* affected - Chris has not touched it, so checks 1, 2, 3 and 8 stand as passed. The Support message for the older part sales is unchanged too.

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

!EX6b_inventory_screen.png|width=900,height=678!

_I re-ran this one today and read every figure straight off the Inventory screen rather than from the numbers behind it. A part sale was built with 2 units of MD668D, picked from stock, invoiced, credited and then reversed. Stock went 276, down to 274 when the part was picked, back to 276 when the credit was issued, and back to 274 when the invoice was reversed - exactly where it started. The credited part also stays on the order at quantity 0, so nothing disappears._

h3. The same confirmation window elsewhere in the system

!EX4_deposit_reverse.png|width=900,height=661!

_Reversing a deposit from the customer's Deposits tab still shows the deposit's own wording, with none of the new credit wording leaking into it._

h3. Where the portal check stands

*The portal is genuinely fixed.* Last week signing in returned a server error and there was no way through at all. Today it signs in first time and lists the invoices, so Nemanja's fix is real.

*And a payment went all the way through.* I paid invoice S-17303 (Tucson Truck Center, $326.55) from the portal with a card, on the test card details the sandbox accepts. The portal said _"Payment Successful - Your payment has been processed successfully."_, the invoice flipped to *Paid*, and the portal's own payments list records it as *Succeeded*, $337.63 charged, $323.85 net.

*But ShopView has not seen it.* Back in the app, the same invoice still shows a balance of *$326.55* with no payment against it at all. I checked four times over about forty minutes and it never changed. I also checked every invoice on both locations - 120 of them - and not one is marked as having been paid through the portal.

So the money moved and the portal knows about it, but the shop's own system does not, which means the portal message on the Reverse button still cannot be seen and *check 7 is still not done*. The blocker has simply moved: it is no longer the portal being down, it is that a successful portal payment is not reaching ShopView.

*To be clear, this is nothing to do with this fix* - the Reverse button is reading the invoice correctly, and the invoice genuinely is unpaid as far as ShopView is concerned. [~accountid:712020:8f740284-c818-4164-82d3-e6f98ccbba71] this one is for you: is there a sync job or a webhook for portal payments that is not running on this branch? Once a portal payment lands on a ShopView invoice, the check itself is ten minutes.

One useful thing I found while looking: *the portal strips the branch prefix from every number*, so our P9697-253 is simply "P-253" there and our S9697-17303 is "S-17303". Searching the portal for a full branch number will always come back empty, which is what made me think last week that part sales never reach the portal. They do - P-193, P-92, P-111 and P-103 are all in there.

h3. What I did not treat as a fault

* On the customer's Deposits tab, Reverse is greyed out for a deposit that came from an overpayment and for one that has already been applied. That is the deposit screen's own long-standing rule, each with its own explanation on screen, and it is not part of this change.
* The paid-invoice guard still comes first: on a paid part sale with an open credit, Reverse still gives "This invoice has been paid, please delete payment before reversing." The credit change has not displaced it.

h3. The mixed applied-or-refunded question is now closed

An earlier version of this comment flagged that there was no agreed wording for a part sale where some blocking credits had been used and others refunded. Chris has answered it, and his answer removes the problem rather than adding a sentence for it: "used" is true of a credit spent on an invoice and of one cashed out as a refund, and "Void" undoes both, so a mixed set needs no special case."""
json.dump({"body": B}, open('/tmp/sv9697/body3.json','w'))
print('chars', len(B))
