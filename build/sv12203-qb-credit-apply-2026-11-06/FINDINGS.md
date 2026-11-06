# SV-12203 — QB Unexported: credit apply fails with "Enter a transaction amount to continue" (6 Nov 2026)
Picked from the Board 2 Testing QA queue. Labels: ai-unverified-repro, bug-report, powertools-unassigned, source-intercom (no `accounting`); Product Area not Accounting; QA assignee empty. Powertools plan read and saved (POWERTOOLS-PLAN.md, 8 scenarios + hotspots).
NOT STARTED — two blockers, both asked of the QA lead:
1. The QA branch does not answer: https://sv12203.qa.shopview.com refused by the egress proxy (connect_rejected), 6 Nov ~12:00 UTC.
2. Every scenario needs actions inside QuickBooks Online (use up a credit, pay an invoice, turn Automatically apply credits on/off) on the sandbox company connected to the branch. We hold no QuickBooks Online sandbox login for this.
Also: the ticket is QuickBooks-sync work (Rule 121 / the "no Accounting tickets for now" instruction) — asked whether to test it at all.
Nothing posted on the ticket.

## 6 Nov 2026 ~12:50 UTC — QA lead: test it. Asked Dipesh what's needed (Rule 122)
Woke the branch (toggleQaEnv wake → "sv12203 is waking up"; API answered 200 after ~90 s). Front end sv12203.qa.shopview.com has no DNS record (proxy connect_rejected). QuickBooks NOT connected on the branch: GET /api/bookkeeping/integration → Intuit OAuth authUrl; /api/bookkeeping/products-and-services → 400 "Bookkeeping is not configured"; adjustment-item-mapping-status says quickBooksConnected:true (known misleading signal, playbook). Comment 80329 tagging Dipesh: front-end address, sandbox connected, QBO login, which location.
Moved to Blocked (transition 7) 6 Nov 2026 07:54 (UTC−5), per QA lead; re-read: status Blocked.

## 6 Nov 2026 ~13:10 UTC — Dipesh answered (80330, 80331)
- Test address = **https://qb.qa.shopview.com** (it was already in the ticket's QA Branch field, customfield_10318 — my miss: I never read that field before asking). Verified: qb front end build v26.45.2-2a69b44 and its JS calls https://sv12203api.qa.shopview.com, so qb → this ticket's back end. quick-login admin on sv12203api = 200 with the shared .qa.shopview.com cookies.
- Connect QuickBooks myself from qb (location → QuickBooks settings → Connect), company **QA US** (US location) or **QA CA** (Canadian); not his local SV12203-A/C data.
- QuickBooks sandbox login: in **1Password** (per Dipesh) / personal Intuit account (per Confluence page 924123137 "QuickBooks QA Environments (qb, qb1, qb2)", v3). sandbox.qbo.intuit.com answers 301 through the proxy (reachable).
- Any one location; turn OFF "Automatically apply credits" and "Automatically apply payments" first.
- **Remaining blocker: the Intuit sandbox login — only the QA lead can give it (1Password).** Ticket left in Blocked until then.

## Handed over (6 Nov 2026, about 09:00 CDT)
- The QA lead: "OK I have given the ticket SV-12203 to do." Read as: the ticket now belongs to someone else, so we stopped. No test was run and nothing was posted after comment 80329.
- He also gave the Intuit sandbox login for future QuickBooks work. The password is stored in /tmp/intuit/ only, never in git or Jira.
- Ticket state when we stopped: Blocked, assignee Dipesh Changawala, QA Assignee empty, last comment 80331 (Dipesh).
- Learning check: nothing new.
