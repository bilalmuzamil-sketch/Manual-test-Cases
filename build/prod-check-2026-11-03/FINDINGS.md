# Production checks, 3 Nov 2026 — SV-9550, SV-10130, SV-10133, SV-11662, SV-11715 (all PASSED)
Production app.shopview.com, build v26.45.0-8e138e1 (index last-mod 03 Nov 09:59:25 GMT), read at start and again before posting (15:27 UTC).
All five tickets: Done, QA assignee Mudassir Qamar (SV-10130 also Bilal) — QA lead confirmed testing all five. SV-10132 skipped (needs QuickBooks,
QA lead: "Ignore the tickets which require the Quickbooks account"). Mode: quickest complete. No recording, no technical section.
Logins: bilal.muzamil+serviceadvisornoreports (scripts via common.mjs prod()) and bilal.muzamil@shopview.com (prod1()) in parallel — one session per login.

| Ticket | Comment | Checks | Evidence |
|---|---|---|---|
| SV-9550 | 80033 | anonymous + signed-in GET /admin/fe-be-permissions, /admin/fe-permission-mappings-generator, /admin/, /admin/anything on api.shopview.com → 404 (8/8); POST/DELETE /api/fe-be-permission-relations anonymous → 401; Roles & Permissions loads. app.shopview.com/admin/* = 200 but byte-identical to the SPA home page (md5 0698e16f…) | sv9550/anon.txt, loggedin.txt, roles-page.png, ex-SV-9550.png |
| SV-10130 | 80034 | New Line labels/placeholders/focus; typing clears placeholder; canned pick keeps "Title"; empty → "Title is a required field" (PRD v17 S1-R6, story text says "Title is required" — PRD newer); 256 chars → "Title cannot be longer than 255 characters", save blocked, 255 OK; Edit Line on S1-1913 and on older S1-979 values unchanged (API before = dialog = API after) | sv10130/*.png, result*.json, ex-SV-10130.png |
| SV-10133 | 80035 | column list + template header new names; new/old/mixA/mixB/case-space imported (ZZ10133-*144702), all under Status: Imported with title/description in place; empty *Line Title → "Line Title cannot be empty." (S4-R8); "*Line Name" → 400 Invalid file headers / "Failed to import all invoices." | sv10133/results.txt, imported.txt, *.png, ex-SV-10133.png |
| SV-11662 | 80036 | WO S2-1914 (no contact): both error toasts (captured by a MutationObserver — the first fades fast), dialog closes, reopen no "Already sent", audit log 0; contact assigned → "Successfully sent", audit log 1, reopen "Already sent" + disabled; part sale P2-91 success + Already sent | sv11662/*-result.json, *.png, ex-SV-11662.png |
| SV-11715 | 80037 | P2-90 part 1237944 qty 2 core $1: dialog "Return all 2 of Core for A158? … credited $2.00 …"; Cancel no request $602; confirm → POST …/cores/{id}/return, $600, Returned; stale tab → 409 "Core has already been actioned…", no double credit | sv11715/result.json, *.png, ex-SV-11715.png |

Disclosed set-up done outside the screens (SV-11662): the no-contact work order created and the contact assigned through the back end.
Observation, explained (SV-10130): after an empty save, picking a canned line leaves "Title is a required field" visible until Title loses focus
(Tab clears it) — normal blur validation, not reported.
Not run: SV-11662 request inside the Customer Portal (needs a portal login); SV-11715 partial-receive case (QA-branch extra, not in the ticket).
Test data left on production (rule): WOs S1-1913, S2-1914, part sales P2-90, P2-91, five imported invoices ZZ10133-*144702, contact email/portal access on
ZZAUTOTEST SV10130 (customer ZZAUTOTEST Aabridge Freight).
Learning check: playbook §BA added (Send to Portal needs a portal-access contact; Return Core shows only after Pick; toasts fade — observe; Edit Line via line_title).
