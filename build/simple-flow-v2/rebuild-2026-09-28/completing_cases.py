import importlib.util
spec=importlib.util.spec_from_file_location("rebuild_lib","rebuild-2026-09-28/rebuild_lib.py")
L=importlib.util.module_from_spec(spec); spec.loader.exec_module(L)

ADMIN='You are signed in as an Owner or Admin with "Work Orders: Create & Edit" and "WO Lines: Create & Edit", in Full View (top-right shows your name and the shop "Trucks Hill 2").'
WO='Open a work order you can still change: in the top menu click "Work Orders", open a work order by clicking its row, then open its "Lines" tab. A line\'s own actions live behind the three-dot (more) button at the right of the line row.'
SRC='Epic SV-8683; story SV-9251 (Story 5, Parts no longer block completing a line); Simple Flow V2 spec (Confluence 771391574, revision of 11 Sep 2026), Story 5; read 28 Sep 2026.'

CASES=[
{"id":44561,"title":"An Approved line completes whatever the state of its parts",
 "pre":[ADMIN,WO,
   'Turn Require ordering, Require picking and Require receiving ON (Settings > Work Orders). On one Approved line set up three parts: (a) a vendor part not yet ordered, (b) an inventory part not yet picked, (c) a part ordered but not yet received.'],
 "steps":['Press "Complete" on that Approved line.','Re-open the line and check each part\'s status; then open the work order\'s finish/invoice path.'],
 "results":[
   'The line completes — unordered, unpicked and unreceived parts do not block it, in any combination.',
   'Each part keeps its status: the never-ordered part still waits to be ordered, the unpicked part still needs picking, the ordered part still needs receiving; completing the line changed nothing about them.',
   'The outstanding work has only moved to the work order: review and invoicing still require those parts to be ordered / picked / received (or deferred with Received later).'],
 "source":SRC,
 "quotes":[("Story 5","A line completes whatever the state of its parts. Unordered, unpicked and unreceived parts do not prevent it, in any combination"),
           ("Story 5","Every parts requirement stays at work order level, so review and invoicing still require parts to be resolved. The requirement is not removed, it is moved to where the money is"),
           ("Story 5","Completing a line changes nothing about its parts. They keep whatever status the settings gave them")]},

{"id":44562,"title":"The other line requirements still apply on completion when their setting is on",
 "pre":[ADMIN,WO,
   'In Settings turn ON Require Tech Story, Require Mileage, Require Engine Hours and Parts Have Core Charges. Put one Approved line with a part that has an unresolved core, and leave the line\'s tech story empty.'],
 "steps":['Press "Complete" on that Approved line while its tech story is empty and its core unresolved.'],
 "results":[
   'Completion still asks for the line-level requirements that are switched on: tech story, mileage and engine hours (each only when its setting is on).',
   'An unresolved core is asked before the line completes even where receiving is not required (a cored part may never pass a receive and the invoice must still be right) — unchanged V1 behaviour.',
   'Only the PARTS ordered/picked/received requirements were lifted off the line; these other requirements remain.'],
 "source":SRC,
 "quotes":[("Story 5","The other line-level requirements stay: tech story, mileage, engine hours, each only when its setting is on, and core resolution"),
           ("Story 5","Where receiving is not required, an unresolved core is asked before the line completes, because such a part may never pass through a receive and the invoice still has to be right. This is V1 behaviour and is unchanged")]},

{"id":44563,"title":"A line reaches Complete only through the defined paths",
 "pre":[ADMIN,WO,'The work order has at least one Approved line and at least one Needs Approval line.'],
 "steps":['Try each completion path on an Approved line: "Complete" on the line; "Complete lines" / "Complete all lines" in the bulk action bar; "Create invoice"; "Clock out and complete".','Try to complete a Needs Approval line by every path.'],
 "results":[
   'A line reaches Complete only through: Complete (on the line), Complete lines and Complete all lines (bulk bar), Create invoice, and Clock out and complete — and nothing else (no timer, no background job).',
   '"Mark as reviewed" never completes a line — it only becomes available once every line is already complete.',
   'Nothing completes a line that is not Approved: a Needs Approval line must be approved first, and Create invoice is refused while any line is still in Needs Approval.'],
 "source":SRC,
 "quotes":[("Story 5","A line reaches Complete only through these paths, and nothing else completes a line"),
           ("Story 5","Mark as reviewed is not on that list. It only becomes available once every line is already complete, so there is never an open line for it to close"),
           ("Story 5","Nothing completes a line that is not approved, and nothing approves a line on the way to completing it")]},

{"id":44564,"title":"Clock-out modal: two complete buttons, and the line-completed tick box is hidden",
 "pre":['You are clocked into a work order line (press "Start" on the line, then "Stop"/"Clock Out" to open the clock-out modal). You have "WO Lines: Create & Edit". The Require Review setting decides the primary button\'s wording.'],
 "steps":['In the clock-out modal, read the buttons and look for the old "line completed" tick box.','With a required tech story left empty, use the complete button.'],
 "results":[
   'The modal offers two actions: "Clock Out" (secondary) and, per the Review setting, "Clock out and complete" or "Clock out and send to review" (primary).',
   'The old "line completed" tick box is hidden — there is one way to complete from clock out, not two, so you cannot tick the box and press the wrong button.',
   'If a tech story is required and empty it is required here before completing; the rest of the clock-out modal is unchanged.'],
 "source":SRC,
 "quotes":[("Story 5","The line completed tick box is hidden"),
           ("Story 5","If a tech story is required and empty, it is required at clock out. Entering it needs WO Lines: Create & Edit"),
           ("Story 5","The clock out modal is otherwise unchanged")]},

{"id":44565,"title":"Complete is never disabled for a parts reason; reopening returns the line to Approved",
 "pre":[ADMIN,WO,'One Approved line holding outstanding (unordered / unpicked / unreceived) parts, and one line already Complete.'],
 "steps":['Look at the Complete control on the line with outstanding parts.','Uncomplete the Complete line (from its three-dot menu) and check its status and its parts.'],
 "results":[
   'Complete is never disabled for a parts reason, anywhere — there is no disabled-with-tooltip state on it for parts.',
   'No timer and no background job ever completes a line.',
   'A line reopened (uncompleted) returns to Approved with its parts unchanged.'],
 "source":SRC,
 "quotes":[("Story 5","Complete is never disabled for a parts reason, anywhere"),
           ("Story 5","No timer and no background job completes a line"),
           ("Story 5","A line reopened after completion returns to Approved with its parts unchanged")]},
]
L.run(CASES,"rebuild-2026-09-28/update-log.jsonl")
