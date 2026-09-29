import importlib.util
spec=importlib.util.spec_from_file_location("mr_lib","build/maintenance-reminder-v2/mr_lib.py")
L=importlib.util.module_from_spec(spec); spec.loader.exec_module(L)
ADMIN='You are signed in as an Owner/Admin (Settings Service); the maintenance_reminders feature is on. These are numeric/date-accuracy cases (Rule 116): seed the exact inputs, then read the produced value back and compare it to the stated exact value — never eyeball, never accept "a number".'
S2='Epic SV-3780; story SV-10559 (S2); Chunk 1 MR spec (Confluence 886931488), S2; read 29 Sep 2026.'
S8='Epic SV-3780; story SV-10565 (S8); Chunk 1 MR spec (Confluence 886931488), S8; read 29 Sep 2026.'
S3='Epic SV-3780; story SV-10560 (S3); Chunk 1 MR spec (Confluence 886931488), S3; read 29 Sep 2026.'
S13='Epic SV-3780; story SV-10570 (S13); Chunk 1 MR spec (Confluence 886931488), S13; read 29 Sep 2026.'
S11='Epic SV-3780; Chunk 1 MR spec (Confluence 886931488), the confidence matrix (S11-R22/R23/R24/R25/E5), reproduced in the spec as the basis for the S9 asset-tab and S13 worklist confidence display; read 29 Sep 2026.'

CASES=[
{"anchors":["S2-R14","S2-E5"],"title":"Calendar month intervals land on the same day and roll back to the month's last day",
 "pre":[ADMIN,'A schedule with a routine service set to a 1-month calendar interval, and another set to a 90-day interval; assets you can complete on specific dates.','Compute each expected date by hand before reading the build.'],
 "steps":['Complete the 1-month service on 15 Jan 2026 and read the next due date; complete it again on 15 Feb 2026 and read the next.','Complete the 1-month service on 31 Jan 2026 and read the next due date; then read the cycle after that.','Complete the 1-month service on 31 Jan 2028 (a leap year) and read the next due date.','Complete the 90-day service on 1 Jan 2026 and read the next due date; complete it on 1 Feb 2026 and read the next, comparing the day-of-month against the month version.','Confirm the same due date appears on the asset Maintenance tab and on the worklist row.'],
 "results":[
   'A months interval resolves to the same day of a later month, counted from the last completion, producing a specific date: 15 Jan 2026 → 15 Feb 2026, and 15 Feb 2026 → 15 Mar 2026.',
   'Where the anchor day does not exist in the target month the date falls on that month\'s last day: 31 Jan 2026 + one month → 28 Feb 2026, and the following cycle counts from 28 Feb 2026 (→ 28 Mar 2026); 31 Jan 2028 + one month → 29 Feb 2028 (leap year).',
   'A days interval counts days and drifts relative to the calendar: 90 days from 1 Jan 2026 → 1 Apr 2026, but 90 days from 1 Feb 2026 → 2 May 2026 (not the 1st), showing the drift a months interval does not have.',
   'The same computed due date shows identically on the asset Maintenance tab and the worklist row (parity).'],
 "source":S2,
 "quotes":[("S2-R14","A months interval resolves to the same day of a later month, counted from the last completion, and produces a specific date rather than a month. A days interval counts days and drifts relative to the calendar"),
           ("S2-E5","Where the anchor day does not exist in the target month, the date falls on that month's last day. A service completed on 31 January and set to one month comes due 28 February, and the following cycle counts from that date")]},
{"anchors":["S8-R10","S8-E2","S8-E1"],"title":"Certificate term, effective and expiry derive exactly and expiry is the last day of its month",
 "pre":[ADMIN,'A compliance service on an asset, ready to add a record; compute each expected value by hand first.'],
 "steps":['Enter effective month Oct 2026 and term 6 months; read the derived expiry.','Enter effective month Mar 2026 and term 12 months; read the derived expiry date.','Enter expiry month Feb 2027 and term 12 months; read the derived effective month.','Type an expiry month that conflicts with the derived one and see which is kept.','Enter a certificate whose effective month is months in the past (issued by another shop) and confirm the effective month is entered by hand.'],
 "results":[
   'Term, effective month and expiry month derive from one another (any two give the third): effective Oct 2026 + 6-month term → expiry month Apr 2027; effective Mar 2026 + 12-month term → expiry month Mar 2027; expiry Feb 2027 + 12-month term → effective month Feb 2026.',
   'A certificate always expires on the last day of its expiry month, not the last working day: the Apr 2027 expiry resolves to 30 Apr 2027, the Mar 2027 expiry to 31 Mar 2027, the Feb 2027 expiry to 28 Feb 2027.',
   'A month a person typed wins over a derived one; a certificate that arrives already months old has its effective date entered manually.'],
 "source":S8,
 "quotes":[("S8-R10","Term, effective month and expiry month derive from one another: any two give the third. Certificate dates are months, never days, and a certificate always expires on the last day of its expiry month. A month a person typed always wins over a derived one"),
           ("S8-E2","A certificate expires on the last day of its expiry month, not the last working day"),
           ("S8-E1","A certificate arrives already months old, issued by another shop. The effective date is entered manually")]},
{"anchors":["S3-R8"],"title":"Remind before expiry: the default by term band and the cannot-exceed-term cap",
 "pre":[ADMIN,'A compliance service form open; compute each expected value by hand first.'],
 "steps":['Set the term to 12 months and read the default Remind before expiry.','Set the term to 24 months and read the default Remind before expiry.','With a 6-month term, set Remind before expiry to 6 months (equal to the term), then to 7 months.'],
 "results":[
   'Remind before expiry is in months and defaults to 1 month for a term up to 12 months (so a 12-month term defaults to 1) and 2 months above that (a 24-month term defaults to 2).',
   'Remind before expiry cannot be longer than the term: with a 6-month term, 6 is accepted and 7 is refused inline, e.g. "Remind before expiry cannot be longer than the 6-month term".'],
 "source":S3,
 "quotes":[("S3-R8","Remind before expiry ... It is in months, defaults to 1 month for a term up to 12 months and 2 months above that, and can be changed. It cannot be longer than the term; a longer value is refused inline: Remind before expiry cannot be longer than the 6-month term")]},
{"anchors":["S11-R22","S11-R23","S11-R24"],"title":"Confidence grade — usable-pair count and reading age, the lower of the two winning",
 "pre":[ADMIN,'An enrolled unit with a meter-driven service, seeded with reading histories to hit each band; compute the expected grade by hand first.','Usable pairs are consecutive readings that survive the guards; where a guard discards a pair the count drops with it.'],
 "steps":['Seed a clean history of 2 visits (1 usable pair) with the last reading recent, and read the grade; then 3 visits (2 pairs); then 4 visits (3 pairs); then 5 visits (4 pairs).','Seed a unit with no usable pair and read the state.','Hold the count at 5+ visits and set the last recorded reading to 60 days old, then 120 days old, then 200 days old; read the grade each time.','Seed 5 visits where one pair is discarded by a guard and read the grade.'],
 "results":[
   'By count of usable pairs (in a clean history): none is No data, one pair (2 visits) is Low, two or three pairs (3 or 4 visits) is Medium, four or more pairs (5+ visits) is High.',
   'By age of the most recent recorded reading: up to and including 90 days leaves the grade where the count put it; 91 to 180 days caps it at Medium; 181 days or more caps it at Low — so a High-by-count unit reads High at 60 days, Medium at 120 days and Low at 200 days.',
   'Confidence is the lower of the two inputs; where a guard discards a pair the count drops with it, so a unit with five visits and one bad pair has three pairs and reads Medium.'],
 "source":S11,
 "quotes":[("S11-R22","Confidence is set by two inputs, graded separately, and the lower of the two wins: how many usable readings the unit has, and how old the last recorded one is"),
           ("S11-R23","By count of usable pairs ... none is No data; one is Low; two or three is Medium; four or more is High. In a clean history that is two visits for Low, three or four for Medium and five or more for High. Where a guard discards a pair the count drops with it, so a unit with five visits and one bad pair has three pairs and reads Medium"),
           ("S11-R24","By age of the most recent recorded reading, by date: up to and including 90 days leaves the grade where the count put it; from 91 to 180 days caps it at Medium; 181 days or more caps it at Low")]},
{"anchors":["S11-E5","S11-R10","S11-R25","S11-R17"],"title":"Confidence worked examples, independent meters, the N-visits count and the No-data state",
 "pre":[ADMIN,'A unit whose mileage and engine-hours histories can be seeded independently; compute every expected value by hand first.'],
 "steps":['Seed six visits with five usable pairs, the last reading 120 days old, and read the grade.','Seed two visits read yesterday with one usable pair, and read the grade.','Seed a strong mileage history and a weak engine-hours history on one unit and read both meters\' grades.','On a card that shows "from N visits", seed a visit whose only pairs were discarded and read N.','Seed a unit with nothing to estimate from and read the state, and which basis governs the due date.'],
 "results":[
   'Six visits, five usable pairs, the last reading 120 days old: the count says High, the age caps it at Medium, and Medium is what the unit shows. Two visits read yesterday, one usable pair: the age allows High, the count says Low, and Low is what it shows.',
   'Distance and engine hours each carry their own confidence, computed independently, so one unit can show a strong grade on mileage and a weaker grade on hours at the same time.',
   'Where a card shows "from N visits", N counts the readings that took part in at least one usable pair; a visit whose only pairs were discarded does not count.',
   'No data is a separate state, not a confidence level: it applies where there is nothing to estimate from, the calendar governs, and the row says the meter has no basis yet.'],
 "source":S11,
 "quotes":[("S11-E5","Six visits, five usable pairs, the last reading 120 days old: the count says High, the age caps it at Medium, and Medium is what the unit shows. Two visits read yesterday, one usable pair: the age allows High, the count says Low, and Low is what it shows"),
           ("S11-R10","Distance and engine hours will each carry their own confidence, computed independently"),
           ("S11-R25","Measured from N visits, where a card shows it, counts the readings that took part in at least one usable pair. A visit whose only pairs were discarded does not count"),
           ("S11-R17","No data is a separate state, not a confidence level. It applies where there is nothing to estimate from, the calendar governs, and the row says the meter has no basis yet")]},
{"anchors":["S13-R2","S13-R36"],"title":"Worklist tile day-windows: the exact boundaries between Overdue, a month, three months and out-of-window",
 "pre":[ADMIN,'Enrolled assets with services due at fixed offsets from a known "today": -1, 0, +30, +31, +91 and +92 days, plus a Needs-readings service due +200 days; compute which tile each falls in by hand first.'],
 "steps":['With no tile active, read which of the seeded rows appear and which are excluded.','Read which tile each seeded row counts toward at each offset boundary.','Confirm the +92 row is excluded from the no-tile list, and the +200 Needs-readings row is included.'],
 "results":[
   'Overdue is due before today (the -1 row); Due in a month is today up to 30 days ahead (the 0 and +30 rows); Due in 3 months is 31 to 91 days ahead (the +31 and +91 rows); a service further out (+92) is not listed.',
   'With no tile active the list shows every row overdue, due today or due within the next 91 days, plus every Needs readings row whatever its date — so the +200 Needs-readings row is listed and the +92 routine row is not.'],
 "source":S13,
 "quotes":[("S13-R2","The header has four tiles. Overdue: due before today. Due in a month: today up to 30 days ahead. Due in 3 months: 31 to 91 days ahead. Needs readings: per S13-R22"),
           ("S13-R36","With no tile active the list shows every row that is overdue, due today or due within the next 91 days, plus every Needs readings row whatever its date. A service further out is not listed")]},
{"anchors":["S13-R2","S13-R29","S13-N3"],"title":"Worklist tile counts: assets counted once per tile, no total, and location-filtered",
 "pre":[ADMIN,'An asset with one row Overdue and one row Due in 3 months; a service that has missed several cycles; a two-workplace org with assets at each workplace; compute each expected count by hand first.'],
 "steps":['Read each tile\'s count and the table row count, and check whether the tiles sum to the table total.','Confirm the asset with rows in two tiles is counted once in each tile.','Find the multi-cycle-overdue service and confirm it is one row counted once.','Apply the location filter to one workplace and re-read every tile count.'],
 "results":[
   'Each tile counts assets; an asset with rows in two tiles counts once in each, so the tiles do not add up to a total (the sum of the tile counts is not the table row count).',
   'A service appears once however many cycles it has missed, and is counted once.',
   'With the location filter applied, each tile counts only what that filter shows.'],
 "source":S13,
 "quotes":[("S13-R2","Each counts assets; an asset with rows in two tiles counts once in each, so the tiles do not add up to a total"),
           ("S13-R29","With the location filter applied, each tile counts only what that filter shows"),
           ("S13-N3","A service appears once however many cycles it has missed")]},
{"anchors":["S2-R9"],"title":"Interval fields accept whole numbers within the exact caps only",
 "pre":[ADMIN,'A routine service form with calendar (days/months), distance and engine-hours interval rows visible; know each cap before testing.'],
 "steps":['In the mileage interval enter 999,999, then 1,000,000.','In the engine-hours interval enter 99,999, then 100,000.','In a days interval enter 999, then 1,000.','Read the calendar months list and try 1 and 12.','Enter 0, a decimal, and a negative in any interval; try to type letters and symbols.'],
 "results":[
   'Interval values are whole numbers with a minimum of 1: mileage caps at 999,999 (1,000,000 refused), engine hours at 99,999 (100,000 refused) and days at 999 (1,000 refused); calendar months run 1 to 12.',
   'A value of 0, a decimal and a negative are each refused inline; a number field accepts digits only, so letters and symbols do not enter the field and there is no error to show.'],
 "source":S2,
 "quotes":[("S2-R9","Interval values are whole numbers, minimum 1, with no decimals and no negatives. Mileage is capped at 999,999, engine hours at 99,999 and days at 999. An interval longer than 12 months is set in days")]},
]
L.run("DATA",CASES,"build/maintenance-reminder-v2/created-log.json")
