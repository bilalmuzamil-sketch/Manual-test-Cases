import importlib.util
spec=importlib.util.spec_from_file_location("mr_lib","build/maintenance-reminder-v2/mr_lib.py")
L=importlib.util.module_from_spec(spec); spec.loader.exec_module(L)
ADMIN='You are signed in as an Owner/Admin, or any user with "Settings Service" enabled; the maintenance_reminders feature is on.'
SET='Open Settings > Maintenance and open a schedule; for asset-side steps open the asset\'s Maintenance tab (last tab on the asset page).'
SRC='Epic SV-3780; story SV-10563 (S6, Edit and archive a schedule); Chunk 1 MR spec (Confluence 886931488), S6; read 29 Sep 2026.'
CASES=[
{"anchors":["S6-R1","S6-R2","S6-R3","S6-R4","S6-N1","S6-N2"],"title":"Editing a schedule is silent and never touches assets already enrolled",
 "pre":[ADMIN,SET,'A schedule with at least one asset enrolled, and one not-yet-enrolled asset.'],
 "steps":['Edit the schedule (change a service or interval) and Save; watch for any interstitial, affected-asset count or conflict preview.','Open an already-enrolled asset and check its services are unchanged.','Enrol the second asset now and confirm it gets the current schedule.','Look for any re-apply or refresh action.'],
 "results":[
   'Applying a schedule to an asset copies its services onto that asset; editing the schedule afterwards does not touch assets already carrying it — they are not notified, recalculated or migrated.',
   'Editing is silent: no interstitial, no affected-asset count, no conflict preview.',
   'Assets enrolled later receive whatever the schedule says at that time; there is no re-apply or refresh action for already-enrolled assets.',
   'A change does not reach assets already on the schedule; removing the asset and enrolling again, or archiving the schedule, moves it to the schedule\'s current form.'],
 "source":SRC,
 "quotes":[("S6-R1","Applying a schedule to an asset copies its services onto that asset"),
           ("S6-R2","Editing a schedule afterwards will not touch assets already carrying it. They are not notified, not recalculated, not migrated"),
           ("S6-R3","Editing will be silent. No interstitial, no affected asset count, no conflict preview"),
           ("S6-N1","There is no re-apply or refresh action for already enrolled assets"),
           ("S6-N2","In this release a change to a schedule does not reach assets already on it. Removing the asset and enrolling it again, or archiving the schedule, moves it to the schedule's current form")]},
{"anchors":["S6-R11","S6-N3"],"title":"Editing or removing a service asks for confirmation and never touches assets already enrolled",
 "pre":[ADMIN,SET,'A schedule where one service (PM-B) is covered by another (PM-C), with an asset already enrolled.'],
 "steps":['Edit a service and read the confirmation that opens over the editor.','Remove PM-B and read how the confirmation names PM-C.','Check an already-enrolled asset after removing the service.'],
 "results":[
   'Editing or removing a service asks for confirmation over the service editor, naming the service and the outcome: assets already enrolled are untouched, assets enrolled from now on get the schedule as it now stands.',
   'Removing a service that another covers names that service (e.g. "PM-C covers PM-B"); removing PM-B takes it off PM-C, but the lines already copied into PM-C stay.',
   'Removing a service never removes it from an asset already carrying it — there is no retroactive path and nothing warns as though there were.'],
 "source":SRC,
 "quotes":[("S6-R11","A service can be edited or removed from a schedule. Both ask for confirmation over the service editor, naming the service and the outcome: assets already enrolled are untouched, assets enrolled from now on get the schedule as it now stands. Removing a service that another covers names that service ... the lines already copied into PM-C stay"),
           ("S6-N3","Removing a service never removes it from an asset already carrying it. There is no retroactive path, by design, and nothing warns as though there were")]},
{"anchors":["S6-R12"],"title":"An active schedule can be duplicated; the copy carries no enrolled assets",
 "pre":[ADMIN,SET,'One active schedule with assets enrolled, and one archived schedule.'],
 "steps":['Duplicate the active schedule and observe the copy\'s name, where it lands, and whether it opens.','Confirm the copy carries no enrolled assets.','Open an archived schedule\'s menu.'],
 "results":[
   'An active schedule can be duplicated; the copy is named after the original with a numeric suffix, lands in the list beside it, opens for editing, and carries no enrolled assets.',
   'An archived schedule offers Restore alone (no Duplicate).'],
 "source":SRC,
 "quotes":[("S6-R12","An active schedule can be duplicated. The copy is named after the original with a numeric suffix, lands in the list beside it, opens for editing, and carries no enrolled assets. An archived schedule offers Restore alone")]},
{"anchors":["S6-R5","S6-R6","S6-R7","S6-R8"],"title":"Archiving deactivates a schedule and unenrols every asset; restoring puts none back",
 "pre":[ADMIN,SET,'An active schedule with several assets enrolled.'],
 "steps":['Archive the schedule and read the confirmation wording and its action colour.','After archiving, try to apply the schedule to a new asset.','Restore the schedule and check whether any assets are re-enrolled.'],
 "results":[
   'A schedule can be archived, never deleted; archiving deactivates it and unenrols every asset on it.',
   'The confirmation reads exactly: "Archiving deactivates the schedule. All assets enrolled in the schedule will be unenrolled." and its action is red.',
   'An archived schedule cannot be applied to new assets; restoring makes it available to enrol again but enrols nothing — the assets it unenrolled stay unenrolled until someone enrols them again.'],
 "source":SRC,
 "quotes":[("S6-R5","A schedule can be archived, never deleted"),
           ("S6-R6","Archiving deactivates the schedule and unenrols every asset on it. The confirmation says so in these words: Archiving deactivates the schedule. All assets enrolled in the schedule will be unenrolled. Its action is red"),
           ("S6-R7","An archived schedule cannot be applied to new assets"),
           ("S6-R8","Restoring an archived schedule makes it available to enrol again. It enrols nothing: the assets archiving unenrolled stay unenrolled until someone enrols them again")]},
{"anchors":["S6-R13","S6-R14"],"title":"Remove from schedule takes one asset off one schedule; history stays",
 "pre":[ADMIN,'On an asset\'s Maintenance tab, the asset is enrolled on a schedule (e.g. Highway Tractor PM) and has an open work order and certificates. You hold the enrol permission.'],
 "steps":['On the asset\'s Maintenance tab, open the schedule\'s menu and choose "Remove from schedule".','Read the confirmation and its action colour, then confirm.','Check the asset tab, the worklist, the asset\'s history, certificates and the open work order afterwards.'],
 "results":[
   '"Remove from schedule" (in the schedule\'s menu on the asset\'s Maintenance tab) takes that one asset off that schedule; it asks first, e.g. "Remove 402 from Highway Tractor PM?", the action is red and needs the same permission as enrolling.',
   'After removal, that schedule\'s rows leave the asset tab and the worklist; the maintenance history is kept, the asset\'s certificates stay, and an open work order is not changed.',
   'Enrolling the asset again later counts from its last completion; changing an asset\'s schedule is "Remove from schedule", then "Enrol".'],
 "source":SRC,
 "quotes":[("S6-R13","Remove from schedule, in the schedule's menu on the asset's Maintenance tab, takes that one asset off that schedule. It asks first: Remove 402 from Highway Tractor PM? Its maintenance history is kept. Its reminders from this schedule stop. The action is red and needs the same permission as enrolling"),
           ("S6-R14","After Remove from schedule, that schedule's rows leave the asset tab and the worklist. History stays ... the asset's certificates stay ... an open work order is not changed. Enrolling the asset again later counts from its last completion ... Changing an asset's schedule is Remove from schedule, then Enrol")]},
{"anchors":["S6-E1","S6-E2","S6-E4","S6-E3"],"title":"History survives removal and archiving; re-enrolling anchors from the last completion",
 "pre":[ADMIN,SET,'An asset with completed maintenance cycles that is removed from a schedule (or whose schedule is archived), then enrolled again later.'],
 "steps":['Remove the schedule from the asset (or archive the schedule) and check the asset\'s cycle history.','Enrol the asset on a schedule again and check where each service anchors from.'],
 "results":[
   'Removing a schedule from an asset does not destroy history — cycles belong to the asset-and-service pair.',
   'Applying a new schedule afterwards anchors each service from the last completion of the service of the same name on that asset, otherwise from now.',
   'Archiving unenrols without destroying history, so enrolling again later anchors from the last completion.',
   'A new regulatory requirement is the known weak point: the shop must apply the schedule again per unit and nothing warns it.'],
 "source":SRC,
 "quotes":[("S6-E1","Removing a schedule from an asset does not destroy history. Cycles belong to the asset and service pair"),
           ("S6-E2","Applying a new schedule afterwards anchors each service from the last completion of the service of the same name on that asset, otherwise from now"),
           ("S6-E4","Archiving unenrols without destroying history. Each asset keeps its completed cycles ... so enrolling it again later anchors from the last completion"),
           ("S6-E3","A new regulatory requirement is the known weak point. The shop must apply the schedule again per unit and nothing warns it")]},
]
L.run("S6",CASES,"build/maintenance-reminder-v2/created-log.json")
