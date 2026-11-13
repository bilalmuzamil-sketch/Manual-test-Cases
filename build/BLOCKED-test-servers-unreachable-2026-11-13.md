# BLOCKED 13 Nov 2026 ~13:55 UTC: QA branch sv11839 and staging unreachable; Jira connectors down

## What failed (measured)
- The proxy gateway reports `connect_unreachable` ("gateway answered 502 to CONNECT, host allowed, but the gateway could not connect to it") for:
  - sv11839.qa.shopview.com:443
  - sv11839api.qa.shopview.com:443
  - staging.shopview.com:443
  - stagingapi.shopview.com:443
- Reachable at the same time:
  - app.shopview.com (production) 200
  - sleep.qa.shopview.com 200
  - shopview.atlassian.net 302
  - shopview.testrail.io 302
  - the toggleQaEnv endpoint (404 to a GET, so it is up)
- So the network path works. The two ShopView test environments themselves did not accept connections.
- The Jira connectors failed to connect this session:
  - Atlassian_MCP: timeout / 503;
  - Atlassian and Atlassian_Rovo: 503.
- The browser-login fallback in ATLASSIAN-JIRA-ACCESS-METHOD.md needs the QA lead's Atlassian password. There is none in /tmp.

## Searches run (Rule 97)
- APP-ACTIONS-PLAYBOOK.md and skills/14-ACCESS-RESILIENCE.md for "Tunnel connection failed" / "502": no host-unreachable recipe.
  - The 502 hits are unrelated: TestRail counts.
  - The sleep recipe covers a 302 to sleep.qa, not this.
- ATLASSIAN-JIRA-ACCESS-METHOD.md: the REST fallback needs a password login.

## Blocks
- The SV-10702 re-check and comment (QA lead, 13 Nov: do it now, tag Chris, annotated screenshots).
- The reports-gap run and Dashboard S12-R7–R10 (QA lead: yes, 13 Nov).
- Any regression run (new request, 13 Nov).

## Unblock
- Either the test servers come back up, or the QA lead says whether they are down on purpose.
- Fresh cookies will be needed in any case: the sv11839 set dates from 9 Nov, and the staging set from 6 Nov is expired.
- The Jira connectors need to reconnect.
