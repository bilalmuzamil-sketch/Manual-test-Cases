import importlib.util
spec=importlib.util.spec_from_file_location("mr_lib","build/maintenance-reminder-v2/mr_lib.py")
L=importlib.util.module_from_spec(spec); spec.loader.exec_module(L)
ADMIN='You are signed in as an Owner/Admin, or a user with "Settings Service" enabled, on the build under test. The Maintenance Reminders feature is on for the shop (it ships behind the maintenance_reminders flag).'
NAV='In the left sidebar under Settings choose "Maintenance" (it sits beneath "Inspection Templates"). Schedules here belong to the location chosen in the header.'
def seed_sched(n=1,archived=False):
    s=['Seed a maintenance schedule (standard steps):',
       '↳ In Settings > Maintenance click New schedule; the "Untitled schedule" editor opens.',
       '↳ Inline-edit the title to a test name (e.g. "Highway Tractor PM").',
       '↳ Click Add service, give it a name (e.g. "PM-A") and a calendar interval (e.g. Every 3 months), and save the service.',
       '↳ Click Save on the schedule.']
    if archived: s.append('↳ To seed an archived schedule, open its row menu and choose Archive.')
    return s
SRC='Epic SV-3780 (Maintenance Reminders); story SV-10558 (S1, Create a maintenance schedule); Chunk 1 MR spec (Confluence 886931488), Part 1 / S1; read 29 Sep 2026.'

CASES=[
{"anchors":["S1-R1","S1-N2"],"title":"Maintenance settings sit under Settings and need Settings Service",
 "pre":[ADMIN,NAV,'A second test user WITHOUT "Settings Service" (set under Settings > Staff / Roles).'],
 "steps":['As a user WITH Settings Service, open Settings and find the Maintenance entry; note where it sits and what it lists.',
   'Look for any separate reminder-settings tab.',
   'Sign in as the user WITHOUT Settings Service and try to reach the Maintenance tab.'],
 "results":[
   'Settings shows a "Maintenance" entry beneath "Inspection Templates", holding a single list of maintenance schedules; each schedule belongs to the location it was built at.',
   'There is no separate reminder-settings tab.',
   'The user without "Settings Service" cannot reach the Maintenance tab.'],
 "source":SRC,
 "quotes":[("S1-R1","Settings will carry a Maintenance entry with a single list of maintenance schedules. A schedule belongs to the location it was built at, as canned lines and inspection templates do ... There is no reminder settings tab, because the email carries no shop-editable content"),
           ("S1-N2","A user without Settings Service cannot reach the tab")]},
{"anchors":["S1-N1"],"title":"The empty Maintenance screen prompts the first schedule",
 "pre":[ADMIN,NAV,'The shop has no maintenance schedules yet. If any exist, archive them, or use a fresh test location so the list is empty.'],
 "steps":['Open Settings > Maintenance with no schedules defined and read the screen.',
   'Start a new schedule and, before adding any service, try to Save it.'],
 "results":[
   'The empty screen shows a single call to action prompting the first schedule/service.',
   'A schedule with no services cannot be saved - Save stays disabled and the empty state prompts the first service.'],
 "source":SRC,
 "quotes":[("S1-N1","A schedule with no services cannot be saved. It shows an empty state prompting the first service")]},
{"anchors":["S1-R3","S1-R4"],"title":"New schedule opens an empty Untitled schedule editor",
 "pre":[ADMIN,NAV],
 "steps":['In Settings > Maintenance click New schedule.',
   'Read the editor that opens - its title and whether any modal or template chooser appears.',
   'Leave the editor without saving, return to the schedule list, and look for a draft.'],
 "results":[
   'New schedule opens straight into an empty editor titled "Untitled schedule" - no modal and no template to choose.',
   'The schedule exists only from its first Save; leaving before that leaves nothing in the list (no draft).'],
 "source":SRC,
 "quotes":[("S1-R3","New schedule opens an empty editor titled Untitled schedule. There is no modal and no template"),
           ("S1-R4","A schedule exists from its first Save. Leaving the editor before that leaves nothing behind")]},
{"anchors":["S1-R6","S1-R7","S1-R8"],"title":"Save is disabled until the schedule has one service",
 "pre":[ADMIN,NAV,'A new schedule editor is open (click New schedule).'],
 "steps":['Read the editor top to bottom (what it contains).',
   'Click the title and try to rename it inline.',
   'Note the Save button state before adding any service, then after adding one service (Add service -> name it -> set an interval -> save the service).',
   'Make a change and press Cancel.'],
 "results":[
   'The editor carries only a name at the top and an ordered list of services beneath it (reminder timing lives on each service, not here).',
   'The title reads "Untitled schedule" and edits inline; the editor has Cancel and Save.',
   'Save is disabled until at least one service exists, then becomes enabled; name, services and order save only on Save.',
   'Cancel discards unsaved changes, asking first when there are any.'],
 "source":SRC,
 "quotes":[("S1-R6","The editor will carry only a name and an ordered list of services"),
           ("S1-R7","The title will read Untitled schedule with inline edit, following the DVI pattern"),
           ("S1-R8","The editor will carry Cancel and Save. Save is disabled until the schedule has at least one service. The name, the services and their order are saved only when Save is pressed; Cancel discards every unsaved change, asking first when there are any")]},
{"anchors":["S1-N3","S1-E2"],"title":"A schedule name cannot be blank or duplicated",
 "pre":[ADMIN,NAV,'One schedule already exists with a known name (e.g. "Highway Tractor PM").']+seed_sched(),
 "steps":['Open a new schedule editor and try to Save with the name left blank.',
   'Inline-rename a schedule to blank and move focus away.',
   'Name a schedule the same as an existing one (e.g. "Highway Tractor PM") and save.'],
 "results":[
   'A schedule cannot be saved with a blank name, and an inline rename cannot be left blank - both revert to the previous name rather than showing an error.',
   'Two schedules may not carry the same name; a "vi1"-style suffix is added (as for DVI).'],
 "source":SRC,
 "quotes":[("S1-N3","A schedule cannot be saved with a blank name, and an inline rename cannot be left blank. Both revert to the previous name rather than erroring"),
           ("S1-E2","Two schedules may not carry the same name. Adding vi1 to the name as we do for DVI")]},
{"anchors":["S1-R9","S1-R10"],"title":"The service table shows Service, Interval, Canned Lines and reorders",
 "pre":[ADMIN,NAV,
   'A schedule open in the editor with at least two services - one with several triggers, one whose lines include absorbed lines. Seed it:',
   '↳ New schedule -> Add service "PM-A" (calendar Every 3 months + a mileage trigger e.g. 15,000 mileage) with several canned lines.',
   '↳ Add service "PM-C" that covers PM-A (so some of its lines are absorbed).'],
 "steps":['Read the service table columns and how the Interval and Canned Lines cells render.',
   'Reorder services by drag, then by Move up / Move down.'],
 "results":[
   'Services are listed as a table with columns Service, Interval and Canned Lines.',
   'The Interval cell shows each trigger separated by a dot, never "or" (e.g. "15,000 mileage - 3 months" or "30 days"); the Canned Lines cell shows the line count and any absorption (e.g. "4 lines - 3 absorbed").',
   'Services reorder by drag and by Move up / Move down.'],
 "source":SRC,
 "quotes":[("S1-R9","Services are listed as a table: Service, Interval and Canned Lines. The interval renders each trigger separated by a dot, never by or, for example 15,000 mileage · 3 months, or 30 days, and the canned-lines cell carries the line count and any absorption, for example 4 lines · 3 absorbed"),
           ("S1-R10","Services will be reorderable by drag and by Move up / Move down")]},
{"anchors":["S1-R2","S1-R12","S1-R13","S1-E1"],"title":"The schedule list: Active/Archived tabs, search, row menu",
 "pre":[ADMIN,NAV,
   'Several schedules exist - at least one active with assets enrolled and one archived. Seed them:']+seed_sched(archived=True)+[
   '↳ Seed a second schedule and enrol an asset on it (asset Maintenance tab -> Enrol) so its Assets count is non-zero.'],
 "steps":['Read the list: its tabs and counts, its columns and default sort, and the search above it.',
   'Open the row menu on an active schedule, then on an archived one.',
   'Click an archived schedule and try to change something.',
   'Read how the enrolled-asset count is shown, and click it.'],
 "results":[
   'The list has two tabs, Active and Archived, each with a count; columns are Schedule, Services and Assets, each sortable from its header (default Schedule A-Z); the search above matches schedule and service names.',
   'An active schedule\'s row menu offers Edit, Duplicate and Archive; an archived schedule\'s offers Restore.',
   'Each schedule shows its enrolled-asset count as plain read-only text (never a badge), and the count opens nothing.',
   'Clicking an archived schedule opens it read-only all the way down (services, triggers, lines); there is no delete anywhere - a mistaken schedule is archived, not deleted.'],
 "source":SRC,
 "quotes":[("S1-R2","The schedule list has two tabs, Active and Archived, each with a count. Its columns are Schedule, Services and Assets, and each sorts from its header; the default is Schedule, A to Z. A search above the table matches schedule and service names. An active schedule's menu offers Edit, Duplicate and Archive; an archived schedule's offers Restore"),
           ("S1-R12","Each schedule shows how many assets are enrolled on it as plain read-only text, as the inspection templates list does, never as a badge. The count opens nothing"),
           ("S1-R13","An archived schedule opens read-only all the way down, its services, triggers and lines, so a shop can find what it archived and see it before restoring it"),
           ("S1-E1","A schedule created by mistake is archived, like any other. There is no delete anywhere in the feature and no draft state to abandon")]},
]
L.update_by_anchors("S1",CASES)
