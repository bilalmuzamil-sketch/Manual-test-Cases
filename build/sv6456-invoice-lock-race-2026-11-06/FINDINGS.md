# SV-6456 — OptimisticLockException on Create Invoice (6 Nov 2026)

Ticket: https://shopview.atlassian.net/browse/SV-6456 (Bug, TESTING QA, no assignee, labels BE/claude-fix-jira/sentry-sync, Product Area Platform Features). QA branch sv6456. No Powertools plan; fix notes in comments 80365-80367 (PR 4216, commits f911724 + 37e8586).
Sentry SHOPVIEW-API-1Y1: every recent event is route `invoices_create` (`POST /api/invoices/create`), latest 4 Nov on v26.45.0.
Mode: Board-2 defaults (API mode, no recording, no technical section).

## Builds
- Production v26.45.2-198e632 (test org 72b2cc90, Trucks Hill 2)
- QA branch sv6456 v26.45.2-fa8d378 (org d55bc308, Staging Heavy Duty - 9919)

## BEFORE — production (reproduced)
- API: Create Invoice for S2-918 + S2-810 (customer Ahsan) at the same moment → S2-918 **500** "An error occurred…" (requestId 31fdefb9-24e0-4078-969d-69419a164033), S2-810 201.
- Screen: two tabs, Create Invoice on S2-918 and S2-981 clicked together → tab 1 toast "Ooooops! An error occurred … request ID [8af33269-2c1b-4c23-9543-f7b0e7e50138]", no invoice; tab 2 invoiced, payment window opened.
- 2 of 2 rounds: one invoice failed each time.
- (S2-832/S2-830 of aqeel transport 56 refused with "no contact assigned" — not the race, not used.)

## AFTER — branch
| # | Round | Result |
|---|---|---|
| 1 | Screen: two tabs, Create Invoice on S2-16273 + S2-16271 (Los Lunas Diesel & Fleet Repair) together | both 201, both payment windows open — PASS |
| 2 | 5 rounds, two Create Invoice at once (ZZAUTOTEST SV6456 A, 10 work orders) | 10/10 created — PASS |
| 3 | Account after #2 | 10 open invoices x $174.04 = $1,740.40 = total due — PASS |
| 4 | 2 rounds with a $50 deposit on each work order (ZZAUTOTEST SV6456 B) | 4/4 created, each took its own $50 (balance $124.04 each) — PASS |
| 5 | 6 rounds: Create Invoice + Reverse deposit on the same work order at the same moment (B5, B6, C1-C4) | invoice created 6/6. Reversal won 3x → invoice unpaid $174.04, deposit "reversed", applied 0. Invoice won 3x → deposit "fully_consumed", reversedAt null, invoice $124.04. Never both — PASS (money) |
| 6 | Losing reversal in #5 (3 of 3 times the invoice won) | **500 "An error occurred"** (e.g. requestId 588fcf8c-4cb7-4363-8fba-22aa241dc916) instead of the clear 400 "Cannot reverse a deposit while it is in status "fully_consumed"." that the same reversal gives with no race. Money correct. Asked the QA lead whether it belongs on this ticket (Rule 97d). |

Accounting effect (Rule 121): deposits and invoice balances stayed consistent in every round; QuickBooks not connected on the branch, sync not observed.

Exhibit: ev/jira/01-two-tabs-before-after.png. Scripts: scripts/{race,uirace,race2,seed,bal,deps,deptab,rev,complete,exhibit}. Logs: ev/*-race-log.jsonl, ev/branch-race2-log.jsonl, ev/seed-*.json.
