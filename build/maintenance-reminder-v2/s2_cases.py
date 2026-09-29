import importlib.util
spec=importlib.util.spec_from_file_location("mr_lib","build/maintenance-reminder-v2/mr_lib.py")
L=importlib.util.module_from_spec(spec); spec.loader.exec_module(L)

ADMIN='You are signed in as an Owner/Admin, or any user with "Settings Service" enabled; the maintenance_reminders feature is on.'
SCHED='Open a schedule in the editor (Settings > Maintenance > open or create a schedule). In the service list press "Add service" to open the service form.'
SRC='Epic SV-3780; story SV-10559 (S2, Add a routine service to a schedule); Chunk 1 MR spec (Confluence 886931488), S2; read 29 Sep 2026.'

CASES=[
{"anchors":["S2-R1","S2-R2","S2-R3","S2-N4"],"title":"Add service opens a blank form in a fixed order; the service has one name and it cannot be blank",
 "pre":[ADMIN,SCHED],
 "steps":['Press "Add service".','Read the order of the form sections.','Try to save the service with the name left blank.'],
 "results":[
   'Add service opens a blank service form.',
   'The form sequence is: name, "is this compliance", triggers and intervals, services also covered, canned lines, reminder timing — with no send switch anywhere in the form or the service table.',
   'A service carries exactly one name (there is no separate customer-facing name; the name the shop gives is what the customer reads in a reminder), and it cannot be saved with a blank name.'],
 "source":SRC,
 "quotes":[("S2-R1","Add service opens a blank service form"),
           ("S2-R2","The form sequence will be: name, is this compliance, triggers and intervals, services also covered, canned lines, reminder timing. There is no send switch anywhere in the form or in the service table"),
           ("S2-R3","A service will carry exactly one name. There is no customer facing name, so the name a shop gives a service is the name its customer reads in a reminder"),
           ("S2-N4","A service cannot be saved with a blank name")]},

{"anchors":["S2-R4","S2-R5","S2-N1","S2-N3","S2-E1"],"title":"Calendar interval is always present and required; distance and engine hours are optional extra triggers",
 "pre":[ADMIN,SCHED,'A routine (non-compliance) service form open.'],
 "steps":['Look at the calendar interval control and try to untick it.','Select distance, then engine hours, and watch the interval rows appear.','Try to save with the calendar interval empty.','Save a service with no additional trigger selected.','Select distance and engine hours together and count the calendar rows.'],
 "results":[
   'The calendar interval is always present, always editable and required — a ticked checkbox that cannot be unticked, with a hover explaining every service carries a calendar interval.',
   'Distance and engine hours are optional additional triggers; selecting each reveals its own interval row.',
   'A service cannot be saved with the calendar interval empty; selecting no additional trigger is valid (calendar alone is a complete service).',
   'Distance and engine hours selected together still produce one calendar row, not two.'],
 "source":SRC,
 "quotes":[("S2-R4","The calendar interval will always be present, always editable, and required. It shows as a ticked checkbox that cannot be unticked, with a hover explaining that every service carries a calendar interval"),
           ("S2-R5","Distance and engine hours will be optional additional triggers, each revealing its own interval row when selected"),
           ("S2-N1","A service cannot be saved with the calendar interval empty"),
           ("S2-N3","Selecting no additional trigger is valid. Calendar alone is a complete service"),
           ("S2-E1","Distance and engine hours selected together still produce one calendar row, not two")]},

{"anchors":["S2-R6","S2-R7","S2-R8"],"title":"Interval operator Every vs At; calendar At is a day-and-month picker",
 "pre":[ADMIN,SCHED,'A service form open with the calendar interval row visible.'],
 "steps":['On an interval row, switch the operator between "Every" and "At".','On the calendar row choose "At" and see how the value control changes.','On the calendar row choose "Every" and inspect the number and unit controls.'],
 "results":[
   'Each interval row has an operator "Every" or "At": "Every" repeats and counts again from each completion; "At" is a fixed point (on the calendar a day of the year that falls each year, e.g. winterizing; on a meter one reading).',
   'On the calendar row, choosing "At" turns the value into a day-and-month picker, e.g. 15 Nov ("At" is never a month on its own).',
   'The calendar "Every" interval carries a number and a unit (days or months) chosen from a list, not typed; months run 1 to 12 and days are whole numbers; either rebases on completion.'],
 "source":SRC,
 "quotes":[("S2-R6","Each interval row has an operator, Every or At. Every repeats and counts again from each completion. At is a fixed point: on the calendar it is a day of the year and falls on that day each year ... on a meter it is one reading"),
           ("S2-R7","On the calendar row, choosing At turns the value into a (calendar) day-and-month picker, for example 15 Nov. At is never a month on its own"),
           ("S2-R8","The calendar interval carries a number and a unit, days or months, both chosen from a list rather than typed. Months run 1 to 12 and days are whole numbers. Either rebases on completion per S2-R6")]},

{"anchors":["S2-R10","S2-R15"],"title":"The distance unit is 'mileage' in full and the meter unit is 'hours' in full",
 "pre":[ADMIN,SCHED,'A service form with distance and engine-hours triggers selected.'],
 "steps":['Read how the distance unit is named wherever it appears.','Read how the engine-hours unit is named wherever it appears.'],
 "results":[
   'The single distance unit is named "mileage", written in full wherever a unit is named; "mi" and "km" never appear (one unit covers both).',
   'Engine hours are written "hours" in full wherever the unit is named, never "hrs".'],
 "source":SRC,
 "quotes":[("S2-R10","There is one distance unit and its name is the word mileage, written in full wherever a unit is named. mi and km never appear: the single unit covers both, so an abbreviation would claim one of them"),
           ("S2-R15","Engine hours are written hours in full wherever the unit is named, never hrs, on the same rule as mileage in S2-R10")]},

{"anchors":["S2-R9","S2-N2","S2-N5","S2-N6","S2-N7"],"title":"Interval number fields accept whole numbers within caps only",
 "pre":[ADMIN,SCHED,'A service form open with calendar, distance and engine-hours interval rows visible.'],
 "steps":['Enter a decimal, a negative, and a zero into an interval value.','Type letters and symbols into a number field.','Enter values above the caps: mileage > 999,999, engine hours > 99,999, days > 999.','Set the calendar operator to "At" and try to save with no day and/or no month.'],
 "results":[
   'Interval values are whole numbers, minimum 1, no decimals and no negatives; mileage caps at 999,999, engine hours at 99,999 and days at 999.',
   'A decimal value is rejected inline; an interval of zero is rejected inline (same rule as decimal/negative).',
   'A number field accepts digits only — letters and symbols do not enter the field, so there is no error to show.',
   'A calendar "At" row cannot be saved without a day and a month.'],
 "source":SRC,
 "quotes":[("S2-R9","Interval values are whole numbers, minimum 1, with no decimals and no negatives. Mileage is capped at 999,999, engine hours at 99,999 and days at 999. An interval longer than 12 months is set in days"),
           ("S2-N2","A decimal interval value is rejected inline"),
           ("S2-N5","A number field accepts digits only. Letters and symbols do not enter the field, so there is no error to show"),
           ("S2-N6","An interval of zero is rejected inline, on the same rule as a decimal and a negative"),
           ("S2-N7","A calendar At row cannot be saved without a day and a month")]},

{"anchors":["S2-R11"],"title":"The service comes due at whichever trigger arrives first, stated once with no 'or'",
 "pre":[ADMIN,SCHED,'A service form with more than one trigger set (e.g. calendar plus mileage).'],
 "steps":['Read the line beneath the triggers block heading.'],
 "results":[
   'The service comes due at whichever trigger arrives first; the triggers block states this once, in one plain line beneath its heading.',
   'There is no "or" between the triggers and no warning panel.'],
 "source":SRC,
 "quotes":[("S2-R11","The service comes due at whichever trigger arrives first. The triggers block states this once, in one plain line beneath its heading. There is no or between the triggers and no warning panel")]},

{"anchors":["S2-R14","S2-E5","S2-E2","S2-E3"],"title":"Months land on the same day; days drift; a missing anchor day falls on the month's last day",
 "pre":[ADMIN,SCHED,'Services set up to compare a months interval against a days interval, and a service completed on 31 January set to a 1-month interval.'],
 "steps":['Set a service to a months interval and note the next due date after a completion.','Set a service to a days interval and note how the date drifts relative to the calendar.','Complete a "1 month" service on 31 January and read the next due date, then the cycle after.','Set up a service needed at two fixed points, and a one-off service.'],
 "results":[
   'A months interval resolves to the same day of a later month, counted from the last completion, producing a specific date (not a month); a days interval counts days and drifts relative to the calendar.',
   'Where the anchor day does not exist in the target month, the date falls on that month\'s last day — a service completed 31 January set to one month comes due 28 February, and the next cycle counts from that date.',
   'A service needed at two fixed points is set up as two "At" rows; there is no one-time flag (a meter "At" row covers the one-off case).'],
 "source":SRC,
 "quotes":[("S2-R14","A months interval resolves to the same day of a later month, counted from the last completion, and produces a specific date rather than a month. A days interval counts days and drifts relative to the calendar"),
           ("S2-E5","Where the anchor day does not exist in the target month, the date falls on that month's last day. A service completed on 31 January and set to one month comes due 28 February, and the following cycle counts from that date"),
           ("S2-E2","A service needed at two fixed points is set up as two At rows"),
           ("S2-E3","There is no one-time flag. A meter At row covers the one-off case")]},

{"anchors":["S2-R16","S2-R17","S2-R18","S2-R19","S2-N8","S2-N9","S2-E6"],"title":"Services also covered: a service names other services it covers, pre-filling their lines",
 "pre":[ADMIN,SCHED,'A schedule that already has at least two routine services (e.g. PM-A, PM-B), plus a compliance service, so the covers step and its exclusions can be seen.'],
 "steps":['On a service (e.g. PM-C) reach the "services also covered" step and pick PM-A and PM-B.','Move to the canned-lines step and inspect the pre-filled lines and their markers.','Add the first routine service on a fresh schedule and check whether the covers step shows.','Open a compliance service and look for the covers picker.','Try to make a service cover one that already covers it.'],
 "results":[
   'A service can name the schedule\'s other services it also covers (a multi-select), in a step before canned lines; PM-C covering PM-A and PM-B means doing PM-C does both. It may cover nothing (most will), and covering is never inferred from shared lines or interval length.',
   'The covered services\' canned lines arrive in the canned-lines step pre-filled and editable, each marked with the service it came from (e.g. "from PM-A"); changing or removing them here changes this service only. In the line count, "N absorbed" counts lines that came from covered services.',
   'The "services also covered" step shows only when the schedule already has at least one other routine service (not on the first service, not on any compliance service); it carries guidance "build the smallest service first" and only offers services that already exist.',
   'A compliance service is never offered in the picker and cannot name services of its own; a service cannot cover one that already covers it (directly or indirectly) and the list does not offer it.'],
 "source":SRC,
 "quotes":[("S2-R16","A service can name the other services on its schedule that it also covers, in a step before canned lines: a multi-select of the schedule's other services. PM-C covering PM-A and PM-B means that doing PM-C does both"),
           ("S2-R17","The covered services' canned lines arrive in the canned lines step pre-filled and editable, each marked with the service it came from, for example from PM-A. Changing or removing them here changes this service only, never the one they came from"),
           ("S2-R18","Services also covered shows only when the schedule already has at least one other routine service. On the first service, and on every compliance service, the step is not shown"),
           ("S2-N8","A compliance service is never offered in the picker and cannot name services of its own. It absorbs nothing and is absorbed by nothing"),
           ("S2-N9","A service cannot cover a service that already covers it, directly or through another; the list does not offer it ... In the canned-lines count, N absorbed counts the lines that came from covered services"),
           ("S2-E6","A service may cover nothing, and most will. Covering is never inferred from shared canned lines or from interval length; a shop states it")]},
]
L.run("S2",CASES,"build/maintenance-reminder-v2/created-log.json")
