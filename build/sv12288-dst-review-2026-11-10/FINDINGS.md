# SV-12288 — review of Ammar's comment 80533 (10 Nov 2026)

QA lead asked: "I see ammar left a comment on it, I am not sure if ammar did it right or not, tell me." Nothing posted to the ticket.

## Ammar's claim
STL Truck Centers' location (East St. Louis, Illinois) has time zone **America/Winnipeg**. Manitoba stopped changing its
clocks, so Winnipeg stays at UTC-5 while Illinois went back to UTC-6 on 1 Nov 2026 -> every time shows one hour ahead.
Fix = set the location's time zone to America/Chicago. Durations are not affected (1.22 h both ways).

## Checked
- IANA time-zone database 2026e (Ubuntu tzdata changelog, read here): "Manitoba moves to permanent -05 on 2026-10-31 and
  will not fall back from -05 to -06 on 2026-11-01". Also 2026c: "Alberta moved to permanent -06 on 2026-06-18"; 2026b:
  British Columbia permanent -07; 2026e: Northwest Territories permanent -06.
- Ammar's example 22:11:51 UTC on 8 Nov: America/Winnipeg 17:11 (-05), America/Chicago 16:11 (-06). Matches his numbers.
- Production server time-zone list (`GET /api/workplaces/timezones`, ev/prod-timezones.json, 419 zones, read 10 Nov):
  America/Winnipeg offset -300, America/Chicago -360, America/Edmonton -360 -> the server already uses the new rules.
  The list shows raw zone names only (no "Central Time" label).
- The web app works out times in the BROWSER with `Intl.DateTimeFormat({timeZone})` (production bundle date.B7w6GZaW.js),
  so those pages follow the time-zone rules of the user's own browser.

## Verdict
Ammar is right on the cause and the fix. His duration point is consistent (an offset change does not change a duration).

Not covered by him (for the QA lead to decide whether to raise):
1. Any other US shop whose location uses a Canadian zone that stopped changing clocks this year is off by an hour the same way
   (Central shop on America/Winnipeg, Mountain shop on America/Edmonton, Pacific shop on America/Vancouver). A data check on
   locations by address vs zone would find them. Not verified (no customer data access).
2. Pages that turn times in the browser depend on the browser's own rules; a user whose browser has older rules sees the old
   offset, so two ShopView pages can disagree by an hour for these zones. Seen only in our own test browser (Chromium 153
   still has the old rules: Winnipeg 16:11 CST, Edmonton 15:11 MST for the same moment). Not seen on a customer machine.

## Correction to our own earlier note (SV-12193 FINDINGS, 6 Nov)
We wrote "Timesheet Activities shows times one hour ahead after 1 Nov; the WO Timesheets page is right" for Heavy Duty
(America/Edmonton). That was backwards: Alberta stopped changing clocks, so Edmonton is UTC-6 and Timesheet Activities
(server, new rules) was RIGHT; the other page was wrong only because our test browser had out-of-date time-zone rules.
It was never posted to SV-12288, so nothing in Jira needs correcting.
