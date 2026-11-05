# SV-12182 — Part create/edit: unbounded quantity and cost (QA, 5 Nov 2026)

- Ticket: https://shopview.atlassian.net/browse/SV-12182 (assignee Slavcho Mitrov; no labels; QA Assignee empty; QA Test Plan empty — no Powertools plan; no comments).
- Branch: https://sv12182.qa.shopview.com build **v26.45.2-ef57078** (read 5 Nov). Production: app.shopview.com build **v26.45.1-753355c**, test org, part **A158** (id 0085fddf…).
- Mode: API mode (reading by script, the edit/create dialogs driven on screen). No recording, no technical section (unattended).

## Production before (Edit Inventory Part on A158)
- Quantity typed `012345678901234567` → Save → **201, no message**; the response echoed quantity 12345678901234664; after reload the bin Location57 holds **99,999,999.99**, Total Qty **100000096.99 Available**. The value was silently changed.
- Average Cost typed `99,999,999,999` → Save → **201, no message**; after reload cost **21,474,836.47**, sell price **214,748,364.70**.
- So production does not 500 here (this org) but it has no validation and silently stores a different value. The ticket's 500 path (quantity × cost overflowing) was not reproduced on production; the ticket's root cause (no upper bound) is.
- Test data left on A158 (no cleanup on production, QA-lead ruling 2026-10-13).

## Branch (all on v26.45.2-ef57078 unless noted)
| # | Check | Result |
|---|---|---|
| 1 | Edit: quantity 012345678901234567 | 400 "Quantity must be between -99,999,999.99 and 99,999,999.99." + "Bin quantity must be between …" toasts; dialog stays; stored value unchanged (G-qty) |
| 2 | Edit: cost 99,999,999,999 | 400 "Cost cannot exceed 21,474,836.47."; stored unchanged (G-cost) |
| 3 | Create: quantity 012345678901234567 | 400, same two messages |
| 4 | Create: cost 99,999,999,999 | 400 "Cost cannot exceed 21,474,836.47." |
| 5 | Create normal (catalog part ZZ12182G3 made via Parts > Catalog > New Catalog Part; qty 5, cost 12.50) | 201, saved 5 / 12.50 |
| 6 | Two bins of 60M each (sum over the limit) | 400 "Quantity must be between…" (re-run on current build) |
| 7 | Boundaries (re-run on v26.45.2-ef57078) | cost 21,474,836.48 → 400; .47 and .46 saved. Qty 100,000,000 and −100,000,000 → 400; 99,999,999.99 and .98 saved |
| 8 | Max cost × max quantity on one part (P550848: 21,474,836.47 × 99,999,999.99) | saved, no error — the multiplication that caused the original 500 no longer fails |

Observations (not in the ticket's scope, for the QA lead only): Sell Price has no upper bound on the branch (sell 99,999,999,999 accepted earlier today; dialog shows 142,859,999,998.57 derived from a huge cost); each refusal also shows a second generic toast "Failed to save part. Please try again."

## Pre-post gate (16:13 CST)
- Branch marker re-read: v26.45.2-ef57078 (unchanged). Ticket re-read: TESTING QA, no comments, no labels, QA Assignee empty.
- Rows 5 and 7 re-run on the current build right after posting (both true). Text scan: no AI fingerprint.
- Posted comment **80275** (16:15 CST), read back: panel first, 2 images in order, 8 rows.
- Label `QAcomplete` added; moved TESTING QA → **QA Complete** (transition 10).
- Learning check: nothing new beyond "the ✓ shown in the Catalog Part picker is an icon, not 'already in inventory'" and "create a catalog part through Parts > Catalog when every catalog part already has inventory" (recorded in playbook).
