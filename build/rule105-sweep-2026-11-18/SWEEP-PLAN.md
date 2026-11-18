# Rule 105 sweep — open tickets resting on a date / time-zone or environment-comparison claim (18 Nov 2026)
Ordered by the QA lead 18 Nov ("3. Yes"). Live JQL 18 Nov over tickets reported from his account, not Done.

## Re-check now (not yet acted on)
| Ticket | Status | Why it is in scope |
|---|---|---|
| SV-12207 | Open | "next day's date for payments made in the evening" — time-zone claim |
| SV-11940 | Open | "Last 90 days covers 91 days" — date-range edge, depends on which day "today" is |
| SV-11951 | Open | paid date shown = invoice date — date claim |
| SV-11950 | Open | $0 invoices shown Paid "with a paid date" — date part of the claim |
| SV-11952 | Open | invoices "on the same day" ordering — depends on which calendar day each falls on |
| SV-9977  | Board Backlog | production vs QA branch comparison — environment comparison |

## Re-check at their retest, before any QA Complete (already Ready for Production)
SV-12202 (24-hour periods vs calendar days), SV-12275 (date range ending after today), SV-12276 (midnight in Edmonton).

## Each ticket gets (Rule 105 (1)–(3))
stored timestamp · calendar day in the location's zone (worked out independently) · the same record on STAGING and on PRODUCTION in that zone, four zones + screenshots on both sides · verdict: stands / wrong (tell the QA lead before anything is changed) / cannot be checked (what is missing).

## Blocked on (18 Nov 2026)
- Staging sign-in: `/tmp/cln/cookies.json` now redirects to Google sign-in (quick-login 401) — needs fresh staging cookies.
- Production sign-in: none in this container (§K needs a production username/password, stored in /tmp only).
