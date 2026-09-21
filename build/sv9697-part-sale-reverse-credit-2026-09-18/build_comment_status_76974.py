import json
B = """{panel:bgColor=#e3fcef}
*QA STATUS: PASSED on everything this ticket still owns.* Two things are named rather than buried: check 7 is signed off on Nemanja's evidence, not mine, and the button wording has moved to a separate ticket on develop, so it is no longer tested here.
{panel}

h3. Check 7 - the customer portal

[~accountid:712020:8f740284-c818-4164-82d3-e6f98ccbba71] thank you, that explains exactly what I saw. You tested the portal part, then repointed the portal feature branch at a different feature and a different QA environment, which is why the payment I put through this afternoon never arrived on this branch. The portal side is unchanged for this feature and you have attached your evidence from this morning's run.

*I am taking check 7 as covered by your testing.* To be straight about it: I did not observe it myself, so it is signed off on your evidence rather than mine - which is the right basis, because you ran it against the environment it actually belonged to and I did not.

h3. Checks 4, 5 and 6 - the blocked-button wording has left this ticket

[~accountid:712020:8f740284-c818-4164-82d3-e6f98ccbba71] you have said the wording will be done on a different ticket against develop, as agreed in the meeting. That takes it out of scope here, so I am closing these three on *behaviour*, which is what this branch can show:

* the Reverse button is correctly blocked when a credit has genuinely been spent
* the right credits are named, the count is right, and the totals add up
* only the words themselves change

*One consequence worth having on the record before this goes out.* With the copy moving to another ticket, this branch ships with the 14 September wording - the one that says _"Unwind it before reversing."_ I re-checked it live on the branch a few minutes ago and it is still there:

!EX7_unwind_still_shipped.png|width=900,height=496!

_P2-193 (one spent credit) and P2-57 (two spent credits), both hovered on the branch today._

[~accountid:712020:aa00b8d6-a71f-4259-8919-82a304227c20] this is the outcome your 21 September comment argued against - your point was that "Unwind" is a word that appears nowhere in the product, and that the whole reason this ticket exists is a shop hitting a dead end with no explanation. Shipping this now means they get an explanation in a word they cannot find on any screen. *That is a product call and not mine to make* - the meeting decision is the later one and I am following it. I am only making sure the consequence is visible to you rather than discovered after release. If you are content, nothing needs to change.

[~accountid:712020:8f740284-c818-4164-82d3-e6f98ccbba71] could you drop the number of the wording ticket in here when it exists? I will pick the four messages up there and test them against Chris's copy word for word, and it keeps the coverage traceable from this ticket to that one.

h3. Full state of the eleven checks

||#||Check||State||
|1, 2, 3, 8|The reverse itself, and the confirmation wording on it|*PASSED* - verified live. Chris has not changed the confirmation|
|4, 5, 6|The four messages on the blocked Reverse button|*Behaviour PASSED.* Wording moved to a separate ticket on develop|
|7|Invoice paid through the customer portal|*PASSED on Nemanja's evidence* - portal side unchanged for this feature|
|9|The same reverse dialog elsewhere in the system|*PASSED* - verified live, none of the new wording leaked into it|
|10|Credited line stays on the order, stock returns to where it was|*PASSED* - re-verified today reading the figures off the Inventory screen|
|11|Older part sales carrying empty credit records|*Not reproducible on this branch* - the developer's own note, and Chris has confirmed those stay blocked|

h3. Where that leaves it

*There is no QA work left on this ticket.* Everything this branch can demonstrate has been demonstrated, and the only piece still to be tested now belongs to the wording ticket on develop.

From my side this is ready to move out of *Blocked*. The two items above are visibility, not blockers - unless [~accountid:712020:aa00b8d6-a71f-4259-8919-82a304227c20] wants the wording handled differently after seeing what ships without it."""
json.dump({"body": B}, open('/tmp/sv9697/body_status2.json','w'))
print('chars', len(B))
