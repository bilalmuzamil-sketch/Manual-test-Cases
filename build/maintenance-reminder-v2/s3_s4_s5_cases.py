import importlib.util
spec=importlib.util.spec_from_file_location("mr_lib","build/maintenance-reminder-v2/mr_lib.py")
L=importlib.util.module_from_spec(spec); spec.loader.exec_module(L)

ADMIN='You are signed in as an Owner/Admin, or any user with "Settings Service" enabled; the maintenance_reminders feature is on.'
SCHED='Open a schedule in the editor (Settings > Maintenance > open or create a schedule) and press "Add service" to open the service form.'
def SRC(j,s,name): return f'Epic SV-3780; story {j} ({s}); Chunk 1 MR spec (Confluence 886931488), {s.split(",")[0]}; read 29 Sep 2026.'
S3=SRC("SV-10560","S3, Add a compliance inspection service"); S4=SRC("SV-10561","S4, Attach canned lines to a service"); S5=SRC("SV-10562","S5, Reminder timing")

S3CASES=[
{"anchors":["S3-R1","S3-R2","S3-N1"],"title":"Is this a compliance inspection? is asked before the trigger and replaces it",
 "pre":[ADMIN,SCHED,'A blank service form open.'],
 "steps":['Find the "Is this a compliance inspection?" control and note where it sits relative to the trigger block.','Turn it on and watch the trigger block.'],
 "results":[
   'The form asks "Is this a compliance inspection?" before the trigger, because the answer changes the trigger.',
   'Turning it on replaces the trigger block with the compliance block; the two never appear together.',
   'A compliance service has no meter triggers and no calendar interval.'],
 "source":S3,
 "quotes":[("S3-R1","The service form will ask Is this a compliance inspection? before the trigger, because it changes the trigger"),
           ("S3-R2","Turning it on will replace the trigger block with the compliance block. The two never appear together"),
           ("S3-N1","A compliance service has no meter triggers and no calendar interval")]},
{"anchors":["S3-R3","S3-R12"],"title":"Compliance Type is required free text with examples; a type can be renamed but not deleted while referenced",
 "pre":[ADMIN,SCHED,'A compliance service form open (compliance turned on).'],
 "steps":['Read the Type field and open its (i) for examples; try to save with Type blank.','Rename an existing compliance type; then try to delete a type that a record still references.'],
 "results":[
   'Type is free text and required; an (i) beside it shows examples: Annual safety, Annual state, Annual federal, Emissions test.',
   'A compliance type that has been added can be renamed, and cannot be deleted while any record still references it.'],
 "source":S3,
 "quotes":[("S3-R3","Type is free text and required. An (i) beside it shows examples: Annual safety, Annual state, Annual federal, Emissions test"),
           ("S3-R12","A compliance type a shop has added can be renamed, and cannot be deleted while any record still references it")]},
{"anchors":["S3-R6","S3-R7","S3-R8","S3-E2"],"title":"Compliance Term and Remind before expiry are in months; remind cannot exceed the term",
 "pre":[ADMIN,SCHED,'A compliance service form open.'],
 "steps":['Choose the Term and confirm the Type filled nothing in.','Read the Term control (range, required) and try to save without it.','Read Remind before expiry: its default for a term up to 12 months and above 12, change it, then set it longer than the term.','Set the same type with different terms for a bus and a tractor.'],
 "results":[
   'The term is chosen on its own (the type fills in nothing); Term is in months, 1 to 60, from a list, and is required (without a term a compliance service cannot produce a due date).',
   'Remind before expiry is in months, defaults to 1 month for a term up to 12 months and 2 months above that, and can be changed.',
   'Remind before expiry cannot be longer than the term; a longer value is refused inline, e.g. "Remind before expiry cannot be longer than the 6-month term".',
   'The same type may carry different terms on different assets (a bus 6 months, a tractor 12).'],
 "source":S3,
 "quotes":[("S3-R6","The term is chosen on its own. The type fills in nothing"),
           ("S3-R7","Term will be in months, from 1 to 60, selected from a list, and is required. A compliance service without a term cannot produce a due date"),
           ("S3-R8","Remind before expiry ... It is in months, defaults to 1 month for a term up to 12 months and 2 months above that, and can be changed. It cannot be longer than the term; a longer value is refused inline: Remind before expiry cannot be longer than the 6-month term"),
           ("S3-E2","A bus and a tractor may carry the same type with different terms, 6 and 12 months")]},
{"anchors":["S3-R9","S3-R10","S3-N2"],"title":"No certificate date on the Settings form; a compliance service is orange and needs a record to come due",
 "pre":[ADMIN,SCHED,'A compliance service saved on a schedule, and an asset enrolled but with no matching certificate record.'],
 "steps":['Look at the compliance service form for any certificate date field.','On the asset, observe the compliance service colour and its state with no record.'],
 "results":[
   'No certificate date appears on the Settings form (certificate dates belong to the record on the asset, S8).',
   'A compliance service is orange, never red.',
   'A compliance service with no matching record on the asset cannot come due, reads "No record", and is excluded from every count.'],
 "source":S3,
 "quotes":[("S3-R9","No certificate date will appear on this form. Certificate dates belong to the record on the asset"),
           ("S3-R10","A compliance service will be orange, never red"),
           ("S3-N2","A compliance service with no matching record on the asset cannot come due, reads No record, and is excluded from every count")]},
]

S4CASES=[
{"anchors":["S4-R4","S4-R1","S4-R2","S4-R3","S4-E3"],"title":"Add canned lines opens a searchable picker showing hours, not prices",
 "pre":[ADMIN,SCHED,'A service form open on the canned-lines step; the shop has canned lines defined.'],
 "steps":['Read the empty state before any line is added.','Open Add canned lines and use its search; read what each line shows.','Select several lines and reorder them by drag.','Look for any option to create a new canned line from the picker.'],
 "results":[
   'The empty state reads "No lines on this service yet" on one line, with the button beside it; Add canned lines opens a picker with search.',
   'The picker shows hours per line and no price; selected lines are ordered and reorderable by drag.',
   'The picker does not offer creating a new canned line (that stays in Settings).'],
 "source":S4,
 "quotes":[("S4-R4","The empty state will read No lines on this service yet on one line, with the button beside it"),
           ("S4-R1","Add canned lines will open a picker with search"),
           ("S4-R2","The picker will show hours per line, and no price"),
           ("S4-R3","Selected lines will be ordered and reorderable by drag"),
           ("S4-E3","The picker does not offer creating a new canned line. That stays in Settings")]},
{"anchors":["S4-R6","S4-R5"],"title":"A service shows no value; the line count opens a hover card listing covered services then its lines",
 "pre":[ADMIN,SCHED,'A service with several canned lines, some absorbed from a covered service.'],
 "steps":['Look anywhere on the service for a price or estimated time.','Hover the line count and read the card, then move the pointer away.'],
 "results":[
   'A service invents no prices and estimates no time; its hours are the sum of its lines\' hours, and it shows no value anywhere in this feature.',
   'The line count is not a link and opens nothing; hovering it opens a card (styled as a small modal) that lists the services it covers and then its canned lines, one per row, closing when the pointer leaves.'],
 "source":S4,
 "quotes":[("S4-R6","A service will invent no prices and estimate no time. Its hours are the sum of its lines' hours, and it shows no value anywhere in this feature"),
           ("S4-R5","The line count is not a link and opens nothing. Hovering it opens a card styled as a small modal that lists the services it covers and then its canned lines, one per row, and closes when the pointer leaves")]},
{"anchors":["S4-N1","S4-N2","S4-E1","S4-E2"],"title":"Canned lines are optional; later edits and deletions in Settings flow through",
 "pre":[ADMIN,SCHED,'A service with no canned lines, and another with a canned line that will be edited/deleted in Settings.'],
 "steps":['Save a service with no canned lines and confirm it works.','Edit a canned line in Settings and check what the service adds afterwards.','Delete a canned line in Settings and re-open the service.'],
 "results":[
   'A service with no canned lines saves normally and is fully functional; a shop that types every line freeform never uses this and is not prompted to.',
   'A canned line edited later in Settings changes what the service adds from then on.',
   'A canned line deleted in Settings leaves the service with one fewer line, without error.'],
 "source":S4,
 "quotes":[("S4-N1","A service with no canned lines saves normally and is fully functional"),
           ("S4-N2","A shop that types every line freeform never uses this and is not prompted to"),
           ("S4-E1","A canned line edited later in Settings changes what the service adds from then on"),
           ("S4-E2","A canned line deleted in Settings leaves the service with one fewer line, without error")]},
]

S5CASES=[
{"anchors":["S5-R1","S5-R2","S5-R3","S5-R4","S5-R12"],"title":"Reminder timing rows are in days, with three defaults, a protected due-date row and a five-row ceiling",
 "pre":[ADMIN,SCHED,'A new routine service form open at the reminder-timing step.'],
 "steps":['Read the default reminder rows on a new service.','Read a row\'s controls ([before|after] [n] [days]).','Try to delete the due-date row; keep adding rows past five.','Add two identical rows, and a "before" row longer than the service\'s calendar interval.'],
 "results":[
   'Reminder timing is one list of rows, each reading [ before | after ] [ n ] [ days ] — in days and nothing else; timing is per service.',
   'Every new service starts with three default rows: 14 days before, on the due date, and 7 days after.',
   'The due-date row cannot be deleted (its delete control is disabled, not hidden); the ceiling is five rows, after which Add reminder disables.',
   'A row\'s days run 1 to 365; two identical rows cannot both be saved; a "before" row longer than the service\'s calendar interval is refused inline.'],
 "source":S5,
 "quotes":[("S5-R1","Reminder timing is set on each service, as one list of rows, each reading [ before | after ] [ n ] [ days ]. Rows are in days and nothing else"),
           ("S5-R2","Every new service starts with three default rows: 14 days before, on the due date, and 7 days after"),
           ("S5-R3","The due date row cannot be deleted. Its delete control is disabled, not hidden"),
           ("S5-R4","The ceiling is five rows, after which Add reminder disables"),
           ("S5-R12","A reminder row's days run 1 to 365. Two identical rows cannot both be saved, and a before row longer than the service's calendar interval is refused inline")]},
{"anchors":["S5-R8","S5-R11","S5-N1","S5-E1"],"title":"Reminder rows drive due-soon only (no email this release); compliance has none",
 "pre":[ADMIN,SCHED,'A routine service with reminder rows, and a compliance service.'],
 "steps":['Check what the reminder rows affect on the asset tab, the worklist and the panel.','Look for any send switch on the schedule or service.','Open a compliance service form and look for reminder rows.','Note the effect of rows dated after the due date.'],
 "results":[
   'The rows drive when a service reads "due soon" on the asset tab, the worklist and the panel; they do not decide whether a row is listed on the worklist (S13 does), and in this release they email nobody.',
   'Nothing in this release emails a customer automatically — there is no send switch on the schedule or a service; reminders are not labelled internal-only.',
   'A compliance service has no reminder rows; its form shows "Remind before expiry" in their place.',
   'Rows after the due date carry no internal effect this release (a service is overdue from its due date onward whatever they say); they are kept because the email chunk sends on them.'],
 "source":S5,
 "quotes":[("S5-R8","The rows drive when a service reads due soon on the asset tab, the worklist and the panel. They do not decide whether a row is listed on the worklist, which S13 does. In this release they email nobody"),
           ("S5-R11","A compliance service has no reminder rows. Its form shows Remind before expiry, per S3-R8, in their place"),
           ("S5-N1","Nothing in this release emails a customer automatically. There is no send switch on the schedule or on a service ... Reminders are not labelled internal-only"),
           ("S5-E1","Rows after the due date carry no internal effect in this release: a service is overdue from its due date onward whatever they say. They are kept because the email chunk sends on them")]},
]
L.run("S3",S3CASES,"build/maintenance-reminder-v2/created-log.json")
L.run("S4",S4CASES,"build/maintenance-reminder-v2/created-log.json")
L.run("S5",S5CASES,"build/maintenance-reminder-v2/created-log.json")
