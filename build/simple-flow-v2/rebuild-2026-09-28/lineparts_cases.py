import importlib.util
spec=importlib.util.spec_from_file_location("rebuild_lib","rebuild-2026-09-28/rebuild_lib.py")
L=importlib.util.module_from_spec(spec); spec.loader.exec_module(L)

ADMIN='You are signed in as an Owner or Admin with "WO Lines: Create & Edit" and (for part actions) "Order Parts" and "Pick Parts", in Full View.'
WO='Open a work order you can still change: top menu "Work Orders" > open a work order by clicking its row > its "Lines" tab. A line\'s actions live behind the three-dot (more) button at the right of the line row; a part\'s actions sit on the part row and behind the part\'s own three-dot menu.'
SRC='Epic SV-8683; story SV-9252 (Story 6, Which actions appear on a line and on a part); Simple Flow V2 spec (Confluence 771391574, revision of 11 Sep 2026), Story 6; read 28 Sep 2026.'

CASES=[
{"id":44566,"title":"Line actions offered match the line's status",
 "pre":[ADMIN,WO,'Reach each status: a new line via "New Line" starts Needs Approval; "Approve" it to make it Approved; Decline it (line three-dot menu) to make it Declined; "Complete" an Approved line to make it Complete.'],
 "steps":['Open the three-dot menu of a Needs Approval line and read its actions.','Repeat for an Approved line, a Declined line and a Complete line.'],
 "results":[
   'Needs Approval offers: Approve, Decline, Request part, Delete line.',
   'Approved offers: Decline, Authorization required, Complete, Request part, Delete line.',
   'Declined offers: Approve, Authorization required, Request part, Delete line (a declined line can still be approved from its own menu — deliberate).',
   'Complete offers: Decline, Authorization required, Uncomplete.',
   'Any action not listed for a status is not visible (line or bulk bar): Complete is not offered on Needs Approval, and Approve is not offered on an already-Approved line.'],
 "source":SRC,
 "quotes":[("Story 6","Needs Approval: Approve, Decline, Request part, Delete line"),
           ("Story 6","Approved: Decline, Authorization required, Complete, Request part, Delete line"),
           ("Story 6","Declined: Approve, Authorization required, Request part, Delete line"),
           ("Story 6","Complete: Decline, Authorization required, Uncomplete"),
           ("Story 6","Where an action is not listed it is not visible, on the line or in the bulk action bar")]},

{"id":44567,"title":"Decline is disabled while a line holds received or picked parts",
 "pre":[ADMIN,WO,'An Approved line that holds at least one part which has already been received or picked (a part that has genuinely arrived).'],
 "steps":['Open that line\'s three-dot menu and look at "Decline".','Read the reason shown on the disabled Decline.'],
 "results":[
   'Decline is still visible but disabled while the line holds parts that were received or picked.',
   'The disabled Decline shows the reason: "Return this line\'s received parts before declining it."'],
 "source":SRC+' (PO-confirmed correct 2026-09-24: Decline stays blocked in this case; the v3 design that said "always allowed" is superseded.)',
 "quotes":[("Story 6","Decline stays visible but disabled while the line holds parts that were received or picked, with the reason Return this line's received parts before declining it")]},

{"id":44568,"title":"Part row action matches the part's state — all seven states",
 "pre":[ADMIN,WO,'Turn Require ordering and Require receiving ON. On approved lines, set up a part in each of the seven states: Requested (typed with no pricing), Quoted, Auth to order, In Stock (not picked), Awaiting, Received later, Received/picked, Returned.'],
 "steps":['For a part in each state, read the single action on its row, and note what the bulk bar "Order (n)" count includes.'],
 "results":[
   'Requested: nothing on the row (no price yet) — but it IS counted in the bulk bar\'s "Order (n)". This "counted but no button" is deliberate.',
   'Quoted: Order. Auth to order: Order.',
   'In Stock and not picked: Pick.',
   'Awaiting: Receive (with "Received later" behind its caret when receiving is required).',
   'Received later: nothing on the row; Receive sits in the part\'s ... menu.',
   'Received or picked: nothing (finished). Returned: nothing (sent back; stays visible on the line and in returns).'],
 "source":SRC,
 "quotes":[("Story 6","Requested ... Nothing on the row ... It is still counted in the bulk bar's Order (n)"),
           ("Story 6","Quoted: Order ... Auth to order: Order ... In Stock and not picked: Pick ... Awaiting: Receive, with Received later behind its caret when receiving is required"),
           ("Story 6","Received or picked: nothing. The part is finished ... Returned: nothing. The part has been sent back and stays visible on the line and in returns")]},

{"id":44569,"title":"Ordering precedes receiving; Receive placement follows the setting",
 "pre":[ADMIN,WO,'One approved vendor part not yet ordered. Test with Require receiving ON, then OFF.'],
 "steps":['With ordering required, look at the part before and after you order it — note when "Receive" appears.','Turn Require receiving OFF and check where "Receive" is for an ordered part.','Order a Requested part that is vendor-sourced, then try one that is inventory/found/no-source.'],
 "results":[
   'With ordering required, Receive does not appear until the part has been ordered, and Order and Receive are never offered at once for the same part.',
   'With receiving NOT required, Receive moves from the part row into the part\'s ... menu — it is never removed outright.',
   'Ordering a Requested part only does something when it is vendor-sourced (including a vendorless part marked "Vendor missing"); an inventory or found part, or one with no source, needs its details completed first.'],
 "source":SRC,
 "quotes":[("Story 6","With ordering required, Receive does not appear until the part has been ordered, and the two are never offered at once for the same part"),
           ("Story 6","With receiving not required, Receive moves from the part row into the part's … menu. It is never removed outright"),
           ("Story 6","Ordering a Requested part only does something when the part is vendor-sourced, which includes a vendorless part marked Vendor missing")]},

{"id":44570,"title":"Declining or sending back a line returns only the not-yet-arrived parts to Quoted",
 "pre":[ADMIN,WO,'An Approved line with a mix of parts: a Requested part; a Quoted / Auth to order / In Stock / Awaiting part; a Received part; a Returned part; a picked part.'],
 "steps":['Decline the line (or send it back with "Authorization required").','Check each part\'s state afterwards, then approve the line again and re-check.'],
 "results":[
   'Only In Stock, Quoted, Auth to order and Awaiting parts are moved back to Quoted.',
   'A Requested part is left where it is, and so are Received and Returned parts; parts that were received or picked are not touched and no stock moves.',
   'Declining does not remove parts from a purchase order (only deleting a part does); approving the declined line again restores its parts to where they were.',
   'An action the role does not carry is absent even when the state qualifies (Pick follows Pick Parts, Order follows Order Parts).'],
 "source":SRC,
 "quotes":[("Story 6","Only In Stock, Quoted, Auth to order and Awaiting parts are moved back to Quoted"),
           ("Story 6","Parts that were received or picked are not touched by a line status change, and no stock moves because of one"),
           ("Story 6","Declining a line does not remove its parts from a purchase order. Only deleting a part does that"),
           ("Story 6","A part action the user's role does not carry is absent even when the part's state qualifies. Pick follows Pick Parts, Order follows Order Parts")]},
]
L.run(CASES,"rebuild-2026-09-28/update-log.jsonl")
