# SV-11026 — Edit window: Reload keeps typing; matched row stated in the window (8 Oct 2026)

**Verdict: PASSED** — comment 78249 (green), posted 06:30:57 CDT, read back (success panel first, 3 media type `file` in order 01/02/03, 11 table rows = header + 10).
**Environment:** QA branch `sv10360`, build `v26.40.8-e20f5ff` (index.html last-modified Thu 08 Oct 2026 11:05:42 GMT, etag `0d373d1a…`, unchanged start → posting). Fix = core PR ShopView/shopview#3509 commit `e34da5c99` "[SV-11026] Keep the Edit dialog's typed fields on Reload and state a matched row in it" (PR open, head `e34da5c9`); build commit `e20f5ff` is 110 ahead / 0 behind → fix is in the build. Front-end only (6 FE files).
**BEFORE:** the ticket's own exhibits, same branch, build `v26.40.8-3e5c1df`, captured 8 Oct (raw copies in ev/raw/BEFORE-*). Production has no versioned Edit save at all (SV-10903 not released), so the production state is not a comparable "before" for these two behaviours.
**Sources:** SV-11026 description + comment 78245 (Nikola: Reload keeps typed, untouched fields show latest; failed Reload keeps banner + edits; matched → message in window with Dismiss, Save disabled; other save errors shown in window; re-check SV-10903 on the same build). Re-read at posting: TESTING QA, Medium, last comment 78245.
**QA-lead answers this ticket:** no recording; no technical section; SV-10903 regression folded into this comment (nothing posted on SV-10903).

## Variant matrix (fresh rows ZZ11026-1…10, -$201…-$210, imported on screen into `ZZAUTOTEST SV-10903 bank`)
| # | Variant | Row | Evidence | Result |
|---|---|---|---|---|
| 1 | Other tab: Account → 6100. Dialog typed Memo + Payee. Save → 409 stale banner, typing kept, Save disabled, Enter sends nothing | 1 | T1.json | PASS |
| 2 | Reload → Memo/Payee kept, Account shows 6100; Save → 200, row = 6100 + memo + payee (v4) | 1 | T1.json | PASS |
| 3 | Other tab: Memo + Account (5100). Dialog typed Memo only → Reload: my memo kept, Account 5100; Save → row memo = mine, 5100 | 2 | T2.json | PASS |
| 4 | Dialog picked Account 6100 + Memo; other tab Account 5100 + Payee → Reload: 6100 + my memo kept, other tab's payee shown; Save → all three | 3 | T2.json | PASS |
| 5 | Matched in other tab → Save: 422 "Only pending transactions can be edited; this one is matched." inside the window, Dismiss, Save disabled, no toast, Enter nothing; Dismiss closes window; row leaves For review. 3/3 (memo / account / memo+payee) | 7, 8, 9 | T3.json | PASS |
| 6 | Excluded in other tab → Save: 422 "…this one is excluded." in window + Dismiss, Save disabled | 2 | T6.json (c) | PASS |
| 7 | Grid-locked row (inline save held then refused 409 while dialog open); Reload with the list refresh forced to 500 (**induced**) → banner + typed payee stay; real Reload → re-based (6100 shown), Save 200 | 4 | T5.json | PASS |
| 8 | Dialog Save forced to 500 (**induced**) → "Couldn't save the transaction. Please try again." in window + Dismiss, Save enabled, typing kept; Dismiss → Save 200. App's global "Ooooops! An error occurred" toast also shows (global 500 handler) | 5 | T4c.json | PASS |
| 9 | SV-10903: inline memo held 8 s (**induced delay**), Edit opened, Account 6100, Save → dialog PUT sent after memo, v3 → both kept (v4) | 10 | T6.json (a) | PASS |
| 10 | SV-10903: inline save refused → row notice, Edit/Split DISABLED, Match enabled; row Reload → all enabled | 6 | T6.json (b) | PASS |
| — | Long memo (1,202 chars) saved 200 — no real server refusal reachable this way, so "other errors" was proven with the induced 500 | 6 | T4c.json | noted |
| — | Network drop on Save (induced `connectionreset`) redirects the page to `sleep.qa.shopview.com/?app=sv10360` — the QA-branch idle page, i.e. QA environment infrastructure, not app logic. Not in the comment; mentioned to the QA lead | 5 | T4.mjs run | noted |

## Reproduction data left on sv10360 (named in the comment)
ZZ11026-11 (-$211.00, pending) for Reload; ZZ11026-12 (-$212.00, pending) with JE #13762 (`ZZAUTOTEST SV-11026 match target 12`) for Match. Both verified pending at the gate, and JE #13762 verified offered in Match transaction (read only).
Other data: rows ZZ11026-1…10 (7, 8, 9 matched to JE #13759–13761; 2 excluded). No cleanup needed (per-ticket branch).

## Pre-post gate
Build marker re-read identical; PR head `e34da5c9`; ticket TESTING QA / Medium / last comment 78245 (Nikola 06:06); rows 11/12 pending; text scan clean (no AI wording, no technical section); posted; read back as above.

## Learning check
- Harness trap hit again: `pkill -f "bash bridge.sh"` killed my own shell (§U.0b) and the proxy port rotated after a container restart — both already in the playbook; nothing new.
- New fact recorded in playbook §AL: the dialog's Reload only refetches when the row is grid-locked; a stale 409 re-bases from the 409 body (no request). To test "Reload fails", lock the row with a held-then-refused inline save while the dialog is open, then fail the list GET. A network drop on a QA branch sends the page to the sleep page, so use an HTTP 500 to test save errors, not an abort.
