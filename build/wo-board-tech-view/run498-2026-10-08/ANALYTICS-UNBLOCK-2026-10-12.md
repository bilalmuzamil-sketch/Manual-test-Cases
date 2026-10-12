# Analytics tests C97026 / C97033 / C97034 — unblock attempt (12 Oct 2026)

QA lead: "I want you to be able to UNBLOCK yourself on them and do whatever you need."

What each test needs that only Google Analytics holds: the Story 12 REPORTS (built by Milos Vasic, the report owner;
"Engineering's part of this story ends at sending the events"). The event half is already checked from the page's own
requests (C97023–C97025 passed; C97026 steps 1–2 seen 9 Oct).

Routes tried (Rule 107), each with its result:
1. Repo search (Rule 97): no Google Analytics access recorded anywhere. Found the property: QA and staging share
   G-CMYCXL13C9; production is G-Q8V1RLY7LK (Confluence 865894403 "Feature Insights v2", §5).
2. Read the refusal: Google Analytics and PowerTools both need a company Google sign-in. Google rejects sign-in from an
   automated browser ("This browser or app may not be secure" — ENVIRONMENT-CREDENTIALS.md, 2026-09-03).
3. Other surface: PowerTools "Feature Insights" reads GA through Google's reporting API. https://powertools.shopview.com/
   answers 302 -> /auth/google/redirect (positive control: the host is reachable). No test copy exists
   (powertools.staging / .qa / sv10043 hosts: no such host).
4. Seed the state: done. Day 1 for C97033/C97034 sent 12 Oct (users ZZAUTOTEST GA FS1–FS4 / WK1–WK4 878767), each event
   carrying that user's own user id. Day 2 runs 13 Oct; from now on each user also gets a separate Google browser id
   (viewas.mts WOB_FRESH_GA, set in ga-week.mts).
5. Neighbouring feature: DebugView replaced by reading the page's own analytics requests (done for the event half).
6. Change a role / permission in our way: not applicable — the permission is a Google Analytics one, outside ShopView.
7. Instrument proved: PowerTools reachable (302 to Google), Confluence/Jira reads work.
Also searched: Confluence (no page defines or links the Story 12 reports), Google Drive (no report file), Jira SV-10593
(no report link).

What would unblock it (only someone with Google access can give it):
- A Google service-account key with Viewer on the GA property, placed in /tmp (chmod 600, never committed): then the
  three reports are queried directly through Google's reporting API, today and on 19 Oct, with no person reading screens.
- Or a one-off PowerTools session cookie (only useful if Feature Insights shows these Story 12 figures — not confirmed).
- Or Milos (report owner) confirms the reports exist and shares them / reads them.
- Or the QA lead reads them (checklist already sent).

## 12 Oct 2026, 17:15 UTC — read-only Google key from the QA lead
The QA lead made a read-only Analytics key (OAuth Playground, analytics.readonly). Key proven valid (tokeninfo: scope
analytics.readonly, ~55 min left; Admin API answered 200). Result: accountSummaries and accounts both EMPTY — the Google
account behind the key has no access to any Google Analytics account or property. Key deleted from /tmp right after.
Tool kept for next time: build/testing-tools/ga_api.py (token only ever in /tmp/google/ga-token.json).
Next: ticket to Stefan Mitrovic (QA lead's instruction) asking to set the three checks aside or give read access.
