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

## Update 13 Nov 15:43–15:50 UTC: CORRECTION. Staging was never down; only sv11839 is
- **My mistake:** the staging probes used `staging.shopview.com` / `stagingapi.shopview.com`. Those are wrong hosts.
  - The real staging hosts are **app.staging.shopview.com** and **api.staging.shopview.com**, as in staging-boot2.mjs, staging-admin.mjs and the playbook.
  - Re-probed: app 200 (build **v26.45.4-881ac93**); API `fe-permissions` 401 (`sso_required`).
  - So staging is UP. The stored staging sign-in (6 Nov) has expired; fresh cookies are needed.
- **sv11839** (sv11839.qa.shopview.com / sv11839api.qa.shopview.com, the hosts used successfully up to 10 Nov) is **still unreachable**.
  - Gateway `connect_unreachable` at 15:43 UTC.
  - It may have been torn down after its tickets moved on. Ask the QA lead.
- **Jira:** the Atlassian MCP is back (SV-10702 read OK at 15:43 UTC).
- **Lesson:** before calling a host down, take the host name from the recorded tools, never from memory. Recorded in APP-ACTIONS-PLAYBOOK.md the same day.
