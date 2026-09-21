import json
B = """{panel:bgColor=#fffae6}
*QA RETEST - 21 September. Still not a full QA pass. Nine checks pass on behaviour, two cannot be completed yet, and neither of them is waiting on me.*
{panel}

I retested this today on the QA branch sv9697. My comment of 18 September stands as it was written - nothing that passed then has changed, and the branch has not been rebuilt since (same build, same code). This is just today's position on the two open items, plus one check I re-did to a better standard.

h3. 1. The new button wording is not on the branch yet, so checks 4, 5 and 6 cannot be re-run

[~accountid:712020:aa00b8d6-a71f-4259-8919-82a304227c20] you asked on [21 September|https://shopview.atlassian.net/browse/SV-9697?focusedCommentId=76957] for the four blocked-button messages to be re-checked against your new copy. I went and looked at the branch today and the new copy is not there.

!EX7_unwind_still_shipped.png|width=900,height=496!

_Hovering the greyed-out Reverse button on two part sales. P2-193 (one spent credit) and P2-57 (two spent credits) both still show the wording approved on 14 September, with "Unwind" in it._

The code agrees with the screen: the file these four messages live in still contains both "Unwind" sentences, and contains no "Payments tab" and no "Remove" sentence anywhere. The branch has not been rebuilt since 18 September.

*Nothing is wrong here* - you costed it yourself as a string-only rebuild, and that rebuild has not happened yet. So there is nothing to test against and nothing to fail. [~accountid:712020:8f740284-c818-4164-82d3-e6f98ccbba71] once you push the string change, checks 4, 5 and 6 take about ten minutes - the test data is already sitting there: P2-193 has one spent credit, P2-57 has two, and a refunded credit is one Cash Out away.

h3. 2. The portal is fixed - but a payment made through it does not reach ShopView

[~accountid:712020:8f740284-c818-4164-82d3-e6f98ccbba71] you are right that the portal is working now. Last week the sign-in returned a server error and there was no way in at all; today it signs in first time and lists the invoices.

I took a payment all the way through to prove it. Invoice S-17303 (Tucson Truck Center, $326.55), paid from the portal with a card. The portal said *"Payment Successful"*, the invoice flipped to *Paid*, and the portal's own payments list records it as *Succeeded* - $337.63 charged, $323.85 net.

*But ShopView has not received it.* Back in the app the same invoice still shows a balance of *$326.55* with no payment against it at all. I checked four times over about forty minutes and it never changed. I also went through every invoiced or paid work order the app lists on both locations - 98 on Staging Heavy Duty and 97 on Lethbridge, 195 in all - and not one of them is marked as having been paid through the portal. (The work order list hands back at most 100 per location, so that is everything the app shows rather than every row in the database.)

So the money moved and the portal knows about it, but the shop's own system does not - which means the portal message on the Reverse button still cannot be seen, and *check 7 is still not done*. The blocker has moved rather than cleared: it is no longer the portal being down, it is that a successful portal payment is not arriving in ShopView.

*This is not about this fix* - the Reverse button is reading the invoice correctly, and as far as ShopView is concerned that invoice genuinely is unpaid. [~accountid:712020:8f740284-c818-4164-82d3-e6f98ccbba71] my question for you: is there a sync job or a webhook for portal payments that is not running on this branch? Once one portal payment lands on a ShopView invoice, the check itself is ten minutes.

One thing worth knowing if you go looking: *the portal shows these numbers without the prefix the app puts on them* - our part sale P2-193 is simply "P-193" in the portal, and the invoice I paid is "S-17303" there. Searching the portal for a number exactly as the app writes it comes back empty. Part sales do reach the portal - P-193, P-92, P-111 and P-103 are all listed - though part sales created this week are not appearing there under any spelling I tried, which is a separate question and not this ticket.

h3. 3. Check 10 re-done properly - stock returns to where it was

On 18 September I confirmed this from the figures behind the screen rather than from the screen itself. I have redone it today reading every number off Parts - Inventory, which is where a shop would actually look.

!EX6b_inventory_screen.png|width=900,height=678!

_A part sale built with 2 units of MD668D, picked from stock, invoiced, credited and then reversed. Stock went 276, down to 274 when the part was picked, back to 276 when the credit was issued, and back to 274 when the invoice was reversed - exactly where it started. The credited part also stays on the order at quantity 0, so nothing is lost._

The result is the same as before; it is now evidenced on the screen the requirement is about.

h3. Where that leaves the ticket

||#||Check||Today||
|1, 2, 3, 8|The reverse itself and its confirmation wording|*PASSED* - unchanged, and Chris has not altered the confirmation|
|4, 5, 6|The blocked-button messages|*Behaviour passed. Wording cannot be re-run until the string rebuild lands*|
|7|Invoice paid through the customer portal|*Not done - portal payment does not reach ShopView*|
|9|Reverse elsewhere in the system|*PASSED* - unchanged|
|10|Credited line stays, stock returns|*PASSED* - re-verified on the Inventory screen today|
|11|Older part sales with empty credit records|*Not testable here* - developer's own note|

*What I need, and from whom:* [~accountid:712020:aa00b8d6-a71f-4259-8919-82a304227c20] nothing further from you on the wording - your 21 September copy is clear and I will test it exactly as written. [~accountid:712020:8f740284-c818-4164-82d3-e6f98ccbba71] the string rebuild, and an answer on the portal payments not reaching ShopView. As soon as either lands I will pick it straight up."""
json.dump({"body": B}, open('/tmp/sv9697/body_new.json','w'))
print('chars', len(B))
