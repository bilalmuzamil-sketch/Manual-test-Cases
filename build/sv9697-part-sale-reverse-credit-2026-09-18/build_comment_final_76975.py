import json
B = """{panel:bgColor=#e3fcef}
*Correction and upgrade to my last comment: check 7 is now verified by me on the branch, not taken on trust. And there is one thing to fix on the follow-up ticket before anyone builds it.*
{panel}

[~accountid:712020:8f740284-c818-4164-82d3-e6f98ccbba71] your screenshot did more than settle the argument - it told me where to look. It shows the payment landing on *P9697-253*, which is one of ours on this branch, so I went and opened it.

h3. Check 7 - verified live, by me

!EX8_portal_blocks_reverse.png|width=900,height=233!

Part sale *P9697-253* on the QA branch: Paid date *21 September*, payment row *"Online $35.32"*, balance *$0.00*. The *Reverse* option is greyed out and reads, word for word:

_"This invoice was paid through the customer portal. Credits and refunds must be handled through the portal."_

That is exactly the message that was specified, and it is the last check I had never seen with my own eyes. *Check 7 is PASSED on my own observation now* - my previous comment recorded it as accepted on your evidence, and it no longer needs to rest on that.

*One honest limit:* P9697-253 carries no credits, so what I have proven is that a portal payment blocks the reverse and shows the right message. I have not seen the portal message compete against a blocking-credit message on the same order, because no order has both. The order the code applies puts the portal message first, but I am not claiming to have watched it happen.

h3. The follow-up ticket needs a correction before it is built

[~accountid:712020:8f740284-c818-4164-82d3-e6f98ccbba71] apologies for asking you for the ticket number - [SV-10298|https://shopview.atlassian.net/browse/SV-10298] was already linked in your comment and I missed it.

Having opened it, there is something worth fixing now rather than after it is built. Its title reads:

_"Reverse-blocked tooltip copy: say 'used' and 'Void', not 'applied' and 'Unwind'"_

*That is the 18 September wording, which Chris replaced on [21 September|https://shopview.atlassian.net/browse/SV-9697?focusedCommentId=76957].* You were the one who showed why: "Void" and "used" are nowhere in the released frontend, and Chris agreed and rewrote his copy to use *"applied"* and *"Remove ... on the Payments tab"* instead. If SV-10298 is built to its own title, it ships the words you both already ruled out.

[~accountid:712020:aa00b8d6-a71f-4259-8919-82a304227c20] it is your copy, so it is your call how you want that ticket worded - but as it stands it points at the version you withdrew.

h3. Where SV-9697 stands

||#||Check||State||
|1, 2, 3, 8|The reverse itself, and the confirmation wording on it|*PASSED* - verified live|
|4, 5, 6|The four messages on the blocked Reverse button|*Behaviour PASSED.* Wording moved to SV-10298 on develop|
|7|Invoice paid through the customer portal|*PASSED - verified live today on P9697-253*|
|9|The same reverse dialog elsewhere in the system|*PASSED* - verified live, no wording leaked into it|
|10|Credited line stays on the order, stock returns to where it was|*PASSED* - re-verified reading the figures off the Inventory screen|
|11|Older part sales carrying empty credit records|*Not reproducible on this branch* - the developer's own note, and Chris has confirmed those stay blocked|

*Every check this ticket owns has now been verified on the branch.* The only testing still to come belongs to SV-10298, and I will run the four messages there against whatever copy Chris confirms.

From my side SV-9697 is ready to leave *Blocked*. The point above about SV-10298's title is the one thing I would want settled before that ticket is picked up."""
json.dump({"body": B}, open('/tmp/sv9697/body_final.json','w'))
print('chars', len(B))
