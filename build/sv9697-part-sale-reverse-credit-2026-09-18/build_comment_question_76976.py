import json
B = """[~accountid:712020:aa00b8d6-a71f-4259-8919-82a304227c20] I flagged the wording ticket in my last comment but never actually put the question to you, so here it is plainly. It is one answer and it decides what I test.

*When I test [SV-10298|https://shopview.atlassian.net/browse/SV-10298], which wording should the four blocked-button messages say?*

*A - your 21 September wording* (what I am assuming):
_"Credit CM-4353 ($600.00) has been applied. Remove the payment that used it on the Payments tab before reversing this invoice."_

*B - your 18 September wording* (what the ticket is currently titled after):
_"Credit CM-4353 ($600.00) has been used. Void the payment that used it before reversing this invoice."_

*Your answer:* ______

I am assuming *A*, because you withdrew B yourself on [21 September|https://shopview.atlassian.net/browse/SV-9697?focusedCommentId=76957] once [~accountid:712020:8f740284-c818-4164-82d3-e6f98ccbba71] showed that "Void" and "used" appear nowhere in the released app. But SV-10298 is titled _"say 'used' and 'Void', not 'applied' and 'Unwind'"_, which is B - so whoever picks it up will build B unless someone changes it.

If the answer is A, the ticket title needs correcting too, otherwise it will be built to the version you replaced. [~accountid:712020:8f740284-c818-4164-82d3-e6f98ccbba71] that one is for you once Chris confirms.

One line back is all I need - I will test it word for word against whichever you pick."""
json.dump({"body": B}, open('/tmp/sv9697/body_q.json','w'))
print('chars', len(B))
