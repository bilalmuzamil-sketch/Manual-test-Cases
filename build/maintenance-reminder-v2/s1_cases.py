import importlib.util
spec=importlib.util.spec_from_file_location("mr_lib","build/maintenance-reminder-v2/mr_lib.py")
L=importlib.util.module_from_spec(spec); spec.loader.exec_module(L)

ADMIN='You are signed in as an Owner/Admin, or any user with "Settings Service" enabled. The Maintenance Reminders feature is on for the shop (it ships behind the maintenance_reminders flag).'
SETNAV='Open Settings > Maintenance: in the left sidebar under Settings choose "Maintenance" (it sits beneath "Inspection Templates"). Schedules here belong to the location chosen in the header, as canned lines do.'
SRC='Epic SV-3780 (Maintenance Reminders); story SV-10558 (S1, Create a maintenance schedule); Chunk 1 MR spec (Confluence 886931488), Part 1 / S1; read 29 Sep 2026.'

CASES=[
{"anchors":["S1-R1","S1-N2"],"title":"Settings > Maintenance shows one schedule list; only Settings Service can reach it",
 "pre":[ADMIN,SETNAV],
 "steps":['As a user WITH Settings Service, open Settings and look for the Maintenance entry and where it sits.','Sign in as a user WITHOUT Settings Service and try to reach the Maintenance tab.'],
 "results":[
   'Settings carries a "Maintenance" entry, beneath Inspection Templates, holding a single list of maintenance schedules; each schedule belongs to the location it was built at.',
   'There is no separate reminder-settings tab (the email carries no shop-editable content).',
   'A user without "Settings Service" cannot reach the Maintenance tab.'],
 "source":SRC,
 "quotes":[("S1-R1","Settings will carry a Maintenance entry with a single list of maintenance schedules. A schedule belongs to the location it was built at, as canned lines and inspection templates do ... There is no reminder settings tab, because the email carries no shop-editable content"),
           ("S1-N2","A user without Settings Service cannot reach the tab")]},

{"anchors":["S1-N1"],"title":"The first empty Maintenance screen prompts the first schedule; a schedule with no services cannot be saved",
 "pre":[ADMIN,SETNAV,'The shop has no maintenance schedules yet (the state every shop starts in).'],
 "steps":['Open Settings > Maintenance with no schedules defined.','Start a new schedule and try to save it before adding any service.'],
 "results":[
   'The first screen shows an empty state with one thing to press, prompting the first schedule/service.',
   'A schedule with no services cannot be saved; the empty state prompts the first service.'],
 "source":SRC,
 "quotes":[("S1-N1","A schedule with no services cannot be saved. It shows an empty state prompting the first service")]},

{"anchors":["S1-R3","S1-R4"],"title":"New schedule opens an empty 'Untitled schedule' editor; it exists only from the first Save",
 "pre":[ADMIN,SETNAV],
 "steps":['Press New schedule.','Observe the editor that opens (title, whether any modal or template appears).','Leave the editor without saving, then return to the schedule list.'],
 "results":[
   'New schedule opens straight into an empty editor titled "Untitled schedule" — there is no modal and no template to choose.',
   'The schedule exists only from its first Save; leaving the editor before that leaves nothing behind (no draft in the list).'],
 "source":SRC,
 "quotes":[("S1-R3","New schedule opens an empty editor titled Untitled schedule. There is no modal and no template"),
           ("S1-R4","A schedule exists from its first Save. Leaving the editor before that leaves nothing behind")]},

{"anchors":["S1-R6","S1-R7","S1-R8"],"title":"The schedule editor carries a name and services; Save is disabled until one service exists",
 "pre":[ADMIN,SETNAV,'A new schedule editor is open ("Untitled schedule").'],
 "steps":['Look at what the editor contains (top to bottom).','Click the title and try to rename it inline.','Note the Save button state before and after adding one service.','Make a change, then press Cancel.'],
 "results":[
   'The editor carries only a name at the top and an ordered list of services beneath it (reminder timing lives on each service, not here).',
   'The title reads "Untitled schedule" with inline edit (the DVI pattern). The editor has Cancel and Save.',
   'Save is disabled until the schedule has at least one service; the name, services and their order are saved only when Save is pressed.',
   'Cancel discards every unsaved change, asking first when there are any.'],
 "source":SRC,
 "quotes":[("S1-R6","The editor will carry only a name and an ordered list of services"),
           ("S1-R7","The title will read Untitled schedule with inline edit, following the DVI pattern"),
           ("S1-R8","The editor will carry Cancel and Save. Save is disabled until the schedule has at least one service. The name, the services and their order are saved only when Save is pressed; Cancel discards every unsaved change, asking first when there are any")]},

{"anchors":["S1-N3","S1-E2"],"title":"A schedule name cannot be blank or duplicated",
 "pre":[ADMIN,SETNAV,'One schedule already exists with a known name; a second schedule open in the editor.'],
 "steps":['Try to save a schedule with a blank name.','Inline-rename a schedule to blank and move focus away.','Try to save/name a schedule with the same name as an existing one.'],
 "results":[
   'A schedule cannot be saved with a blank name, and an inline rename cannot be left blank — both revert to the previous name rather than showing an error.',
   'Two schedules may not carry the same name (a "vi1"-style suffix is added, as for DVI).'],
 "source":SRC,
 "quotes":[("S1-N3","A schedule cannot be saved with a blank name, and an inline rename cannot be left blank. Both revert to the previous name rather than erroring"),
           ("S1-E2","Two schedules may not carry the same name. Adding vi1 to the name as we do for DVI")]},

{"anchors":["S1-R9","S1-R10"],"title":"The service table shows Service / Interval / Canned Lines and is reorderable",
 "pre":[ADMIN,SETNAV,'A schedule open in the editor with at least two services, one whose interval has several triggers and whose lines include absorbed lines (e.g. from a covered service).'],
 "steps":['Read the service table columns and how the Interval and Canned Lines cells render.','Reorder services by drag, and by Move up / Move down.'],
 "results":[
   'Services are listed as a table with columns Service, Interval and Canned Lines.',
   'The Interval cell renders each trigger separated by a dot (never "or"), e.g. "15,000 mileage · 3 months" or "30 days"; the Canned Lines cell shows the line count and any absorption, e.g. "4 lines · 3 absorbed".',
   'Services are reorderable by drag and by Move up / Move down.'],
 "source":SRC,
 "quotes":[("S1-R9","Services are listed as a table: Service, Interval and Canned Lines. The interval renders each trigger separated by a dot, never by or, for example 15,000 mileage · 3 months, or 30 days, and the canned-lines cell carries the line count and any absorption, for example 4 lines · 3 absorbed"),
           ("S1-R10","Services will be reorderable by drag and by Move up / Move down")]},

{"anchors":["S1-R2","S1-R12","S1-R13","S1-E1"],"title":"The schedule list: Active/Archived tabs, sortable columns, search, per-row menu; archived opens read-only",
 "pre":[ADMIN,SETNAV,'Several schedules exist, at least one active and one archived; some have assets enrolled.'],
 "steps":['Read the list: its tabs and counts, its columns and default sort, and the search above it.','Open the row menu on an active schedule, and on an archived schedule.','Click an archived schedule and try to change something.','Look at how the enrolled-asset count is shown.'],
 "results":[
   'The list has two tabs, Active and Archived, each with a count; columns are Schedule, Services and Assets, each sortable from its header, default Schedule A to Z; a search above the table matches schedule and service names.',
   'An active schedule\'s menu offers Edit, Duplicate and Archive; an archived schedule\'s offers Restore.',
   'Each schedule shows how many assets are enrolled as plain read-only text (like inspection templates), never a badge; the count opens nothing.',
   'Clicking an archived schedule opens it read-only all the way down (services, triggers, lines), so a shop can see what it archived before restoring; there is no delete anywhere — a schedule made by mistake is archived, not deleted.'],
 "source":SRC,
 "quotes":[("S1-R2","The schedule list has two tabs, Active and Archived, each with a count. Its columns are Schedule, Services and Assets, and each sorts from its header; the default is Schedule, A to Z. A search above the table matches schedule and service names. An active schedule's menu offers Edit, Duplicate and Archive; an archived schedule's offers Restore"),
           ("S1-R12","Each schedule shows how many assets are enrolled on it as plain read-only text, as the inspection templates list does, never as a badge. The count opens nothing"),
           ("S1-R13","An archived schedule opens read-only all the way down, its services, triggers and lines, so a shop can find what it archived and see it before restoring it"),
           ("S1-E1","A schedule created by mistake is archived, like any other. There is no delete anywhere in the feature and no draft state to abandon")]},
]
L.run("S1",CASES,"build/maintenance-reminder-v2/created-log.json")
