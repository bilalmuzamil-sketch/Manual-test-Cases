# LEARNINGS LOG — the continuous, retrievable ledger of everything we learn

> **PURPOSE.** One durable, append-only place where **every** learning is written the moment it happens,
> so any future session can retrieve **all** learnings in one read or one grep. This complements — does
> not replace — the rules (`build/rules/RULES-*.md`), the skills (`build/skills/`), the playbook
> (`build/APP-ACTIONS-PLAYBOOK.md`) and each `PROJECT-STATE.md`. A learning that hardens into a standing
> rule/skill is graduated there (Rule 72 records, Rule 93 proposes); this log keeps the **raw, dated,
> always-growing** record regardless.

## 🔁 THE CONTINUOUS PROCESS — how this stays current (do this every session)

1. **The moment you learn something durable** — a trap, a fix, a fact about the app/TestRail/access, a
   corrected mistake, a rule the QA lead states — **append an entry here in the SAME pass** (Rule 93/97:
   "solve something new ⇒ write it into the playbook/skill in the same pass" — this log is the front door).
2. **Never delete or rewrite an old entry.** If a learning is superseded, add a NEW entry that says so and
   link the old id (e.g. "supersedes L0007"). History is evidence.
3. **If the learning is important enough to be a standing behaviour**, ALSO graduate it: propose the
   rule/skill change (Rule 72) and record it in the right `RULES-*.md` / skill / playbook — then note the
   destination in the entry's **Graduated-to** field. This log is the index that points at where it lives.
4. **Commit this file with the work** (Rule 29). It is durable memory; `/tmp` and context are not.

## 🔎 HOW TO RETRIEVE — get ALL learnings, or just the ones you need

- **FIRST: `python3 build/testing-tools/recall.py "<words>"` (Rule 127, 2026-10-13).** Older entries live in `build/kb/LEARNINGS-LOG/`
  (Rule 128, split byte-verified 2026-10-13); the tool searches it (and the playbook, skills, rules, project files and tools) and prints
  `file:line` for the best matches. Since L0040 or so, entries are appended at the BOTTOM as `## L0nnn — date — title`;
  `grep -n "^## L0" build/LEARNINGS-LOG.md | tail` lists the newest.
- **By topic:** `git grep -n "#access" build/LEARNINGS-LOG.md build/kb/LEARNINGS-LOG/` — every entry carries `#tags`.
- **Common tags:** `#access` `#testrail` `#shopview-app` `#roles-permissions` `#build-verify`
  `#source-verify` `#cookies` `#deadlock` `#methodology` `#rule` `#mistake-corrected`.
- **From a cold start:** CLAUDE.md §4 (Skills index) and §5 point here; skill `00-COMMON-CORE.md` names it
  as a first-read. Search order when stuck (Rule 97): this log → the playbook → the skill → `RULES-*.md`.

---

## ENTRIES — newest first (id · date · tags · lesson → pointer)


> **Older entries moved (byte-verified) — 2026-10-13:** `build/kb/LEARNINGS-LOG/001-L0036-L0080.md`, `build/kb/LEARNINGS-LOG/002-L0081-L0164.md`, `build/kb/LEARNINGS-LOG/003-L0165-L0277.md`, `build/kb/LEARNINGS-LOG/004-L0278-L0300.md`. Titles: `build/kb/LEARNINGS-LOG/INDEX.md`. Search all of them: `python3 build/testing-tools/recall.py "<words>"`.


> **Older entries moved (byte-verified) — 2026-10-17:** `build/kb/LEARNINGS-LOG/005-L0301-L0365.md`. Titles: `build/kb/LEARNINGS-LOG/INDEX.md`. Search all of them: `python3 build/testing-tools/recall.py "<words>"`.


> **Older entries moved (byte-verified) — 2026-10-20:** `build/kb/LEARNINGS-LOG/006-L0366-L0420.md`. Titles: `build/kb/LEARNINGS-LOG/INDEX.md`. Search all of them: `python3 build/testing-tools/recall.py "<words>"`.


> **Older entries moved (byte-verified) — 2026-10-22:** `build/kb/LEARNINGS-LOG/007-L0421-L0484.md`. Titles: `build/kb/LEARNINGS-LOG/INDEX.md`. Search all of them: `python3 build/testing-tools/recall.py "<words>"`.


> **Older entries moved (byte-verified) — 2026-10-28:** `build/kb/LEARNINGS-LOG/008-L0485-L0541.md`. Titles: `build/kb/LEARNINGS-LOG/INDEX.md`. Search all of them: `python3 build/testing-tools/recall.py "<words>"`.


> **Older entries moved (byte-verified) — 2026-11-11:** `build/kb/LEARNINGS-LOG/009-L0542-L0593.md`. Titles: `build/kb/LEARNINGS-LOG/INDEX.md`. Search all of them: `python3 build/testing-tools/recall.py "<words>"`.


> **Older entries moved (byte-verified) — 2026-11-12:** `build/kb/LEARNINGS-LOG/010-L0594-L0629.md`. Titles: `build/kb/LEARNINGS-LOG/INDEX.md`. Search all of them: `python3 build/testing-tools/recall.py "<words>"`.

## L0630 — 2026-11-11 — Aging reports on sv11315: the PDF limit at exactly 2,000 lines, overpaying is refused, and a queue race
- **Exact 2,000 lines on A/P Detail (C715469):** `p48_pdf2000.mjs` picks the fewest vendors (name not contained in any other vendor name) whose open lines today add up to exactly 2,000 (subset-sum over the A/P Unpaid Invoices answer, read to an EMPTY page) and checks it on the server (`ap-aging-detail?vendors=a,b,c` totals.rowsNumber). 11 Nov: Fate Roadside 715 + New Castle Diesel 707 + Grand Haven Diesel 578. The CSV holds 2,000 rows; the PDF export answers HTTP 500 after ~32 s and no file arrives; 2,001 lines → "This report is too large for PDF…" (400) at once. 444 lines export fine, so the generator works: it is a size/time failure, not a missing generator.
- **`exportAs()` notes include a toast left over from the PREVIOUS export** (the CSV "Success" was still on screen when the PDF was clicked) — never read "Success" in `notes` as the PDF's own answer; check `file` and the export call's status. For the message that appears at ~31 s take pictures every second 20-45 s (`p48b_pdf2000_msg.mjs`).
- **An invoice cannot be overpaid through the payment call:** `customer-account/create-customer-payment` answers 400 "Transaction cannot be overpaid." (p46 R15, for C715462's "$100 invoice paid $120"). Try the payment screen / a credit applied before calling the setup unreachable.
- **Queue race:** a new waiter is only safe if every LATER waiter's pgrep pattern matches it AND it waits for every EARLIER job. `queue19` first waited only for queues 11-13 while `queue14` waited for 11-13 too — both would have signed in at once when 13 ended. Re-slotted to wait for queues 11-18.
- **`exec/s9_result.py build(cid, titles, observed)`** makes the step pictures (chips + table marked with the step's own Totals reading), PDF/CSV text pictures, and `RESULTS-<tag>-<cid>.json` for the totals tests.

## L0631 — 2026-11-11 — QA lead ruling made permanent, and A/R totals facts on sv11315
- **Ruling (QA lead, 11 Nov, permanent):** test continuously until the work is done; CRUD any test environment to unblock myself without asking; NO data cleanup after testing on any environment. Recorded as Rule 107 fifth amendment (107.M/107.N, `build/rules/RULES-61-ONWARD.md`) and in the CLAUDE.md index row. "Are you working?" is answered with the running step, the queue and the last recorded result.
- **A/R Summary/Detail/Collection totals (C715456/458/459/463):** a credit memo is kept under ANY Past due choice and sits in the bucket of its own date (5 days old → "1-30 days past due"); unticking a location to leave one hides the Location column and the chip reads "Location: Staging Heavy D..."; a customer at two locations shows "Multiple"; A/R Detail's 31-60 bucket shows Amount (original) and Open Balance separately ($1,100 / $900 after a $200 part payment).
- **The exported A/R Summary CSV carries the filters as top lines:** "As of: …", "Locations: …", "Past due: 91+ days", "Customers: A, B", then the heading row, then rows and "Totals". A "find the Totals row" that matches any cell equal to "Total" hits the HEADING row (it has a "Total" column) — match the FIRST cell == "Totals" instead (fixed reading in s9_result pictures; the s9 json field `totalsRow` for C715456 is the heading — read the file).
- **Overpay route 2 queued:** `p50_overpay.mjs` (New Payment screen, $120 on the $100 invoice, row box then total box) for C715462 after the API refused it.

## L0632 — 2026-11-11 — sv11315: the Google sign-in expired mid-run; one gated chain instead of many waiters
- The `sv_sso_session` value set at 01:33 UTC answered `401 sso_required` at 10:46 UTC (about 9 h 15 min) in the middle of s9b: a PDF export showed "Unauthorized" then "We couldn't export this report" (C1062580 — a symptom of the dead sign-in, not of the product), a seed got 401, and the next boot landed on accounts.google.com. Diagnosis per playbook part 050: site 200 + `quick-login/users` 401 = stale cookie; only a fresh value from the QA lead's browser fixes it.
- **Do not let a queue of waiters run into a dead sign-in** — each job fails in 30 s and is lost. `exec/chain.sh` holds every remaining job in order and runs `curl …/api/quick-login/users` (200 = good) before EACH job, waiting while it answers 401. A fresh value in `/tmp/qa-cookies/sv11315-sso.txt` restarts the work with no other action.
- A result taken after the sign-in died is void: discard it and re-run (C1062580, C1062581, C1062587 added to the chain as s9b2).

## L0633 — 2026-11-11 — Filing a prepared Story Defect end to end, and who files when the QA lead says "file now"
- **A delegated worker will not file on a relayed approval** — correctly: his "File all ready drafts now" was HIS answer to the coordinating session's question, so the coordinating session files. Give a worker the PREPARATION (draft, owning story + live status, reconcile, duplicate search, link-results json, dry run); keep the Jira create and the TestRail link in the session that holds his answer.
- **The route that worked (SV-12540):** `jira.sh POST /rest/api/2/issue` (wiki description, parent = owning story, Story Defect, Medium, label QA_Found) → attach each picture with `curl -F file=@/tmp/atlassian/<name>.png` to `/rest/api/3/issue/<KEY>/attachments` (same cookie + `X-Atlassian-Token: no-check` + Origin/Referer headers as jira.sh) → `jira.sh PUT /rest/api/2/issue/<KEY>` with the same description so `!name.png|width=1000!` binds → `size_pics.py <KEY> <FULL PATHS of the pngs>` (bare names fail: it opens the files) → `POST /rest/api/2/issueLink` Relates to the story → read back renderedFields: 2 `<img`, 0 `blob:`, no literal `h2.`/`{quote}`.
- **Duplicate check paid off:** SV-12539 (Mudassir Qamar, 10:25 UTC same day) already reported the large-PDF export failure (1,133 rows); C715469 (2,000 rows) was linked to it instead of a new ticket.
- Linking a ticket to failed tests = re-post the same Failed result with `ticket` set via push_results_to_run.py `--allow-non-passed`: it adds "Follow the status here" and the `KEY - ` title prefix (Rule 123/133).

## L0634 — 2026-11-11 — sv11315: two users CAN stay signed in together; the second lane runs as Tech with the Administrator role
- `exec/p53_twousers.mjs` (11:09 UTC): Admin (administrator, 57 permissions) and Tech (technician, 6) signed in on one `sv_sso_session`, both answered 200 on `/api/auth/me/fe-permissions` every 10 s for 90 s, Admin still 200 after → a second sign-in as a DIFFERENT user does not end the first. (A second sign-in as the SAME user still does.)
- Tech as technician cannot open the reports (lands on /workorders). `exec/p54_tech_admin.mjs` gives the Tech user the Administrator role (standing rule: only Tech's role is ever changed, never the Admin's) via `POST /api/staff/{staff_id}/change` with the staff_id read from the Tech session's fe-permissions answer; Tech signs in again to pick it up.
- `lib.mjs` takes `QL_KEY=tech` to run a runner as Tech; `lane2.sh` runs the read-only design captures (d1) in parallel with the Admin chain (`chain3.sh`). Keep the second lane to work that changes no shared data the first lane reads.
- Vendor account id for a payment comes from the request the vendor's Unpaid Invoices page makes; once it did not arrive in 4 s (V3) — the lookup now reloads up to three times.

## L0635 — 2026-11-11 — sv11315 vendor seeding facts (p49), and stopping a chain without losing the running job
- **Vendor part payment works on sv11315** with `POST /api/parts-catalogue/vendor/payment/create` and payment method key `10000_CALGARY_CHEQUING` (the playbook's key carried over): $300 bill paid $250 read back as $50 open (V2); $700 paid $200 → $500 (V8).
- **Vendor credit on a chosen day** via the manual return of inventory part P550848 (`part/manual-return-request/create` → `part/manual-return/<id>/create {creditDate}`): dated today 08:00 UTC it reads back in Current as $-120.00 (V14); dated 15 days ago it sorts between two bills (V16).
- **101 vendor bills** (PO + receive each) took about 2 minutes (V15: 1-30 bucket, 101 lines, $1,010.00).
- **Killing a chain's bash (`pkill -f chain.sh$`) does NOT stop the node job it started** — the job runs to the end (nohup); a replacement chain must wait for that job by name (`pgrep -f "node p49_seed_ap\.mjs"`) before its first step, or two sign-ins overlap. Note the killed chain never logs that job's "end" line.
- **(L0635 addendum, race seen 11:15 UTC)** Replacing a chain WHILE it is between jobs is a race: chain3 ended p49v3 and started s2y in the same second it was killed; chain4 waited only for p49 and started p54 (an Admin sign-in) four seconds later, overlapping s2y. Fix applied: stop the orphan, let the new chain re-run it. Rule: before starting a replacement chain, `pgrep -af "node [a-z0-9_]+\.mjs"` and make the new chain wait for EVERY running node job, not one by name.

## L0636 — 2026-11-11 — Another session tests the same QA site: check before relying on one sign-in; who authored a test
- **Before a long QA-site run, look for other sessions on the same site:** `git for-each-ref --sort=-committerdate refs/remotes/origin | head` then `git grep -l "<site or case ids>" <branch> -- build`. On 11 Nov the branch `claude/global-search-v1-baseline-6ax9ul` (build/ar-ap-report-sorting/v1-regression) ran a live run on sv11315 that stopped on a 401 at 10:43:36 UTC, the same minute ours died. Two sessions on one site can end each other's sign-ins; tell the QA lead and keep one site to one session at a time.
- **TestRail `created_by` cannot tell sessions apart** (every session uses user 3). To know whether a case was authored by THIS session, search the branches' files/commits for its C-id (`git grep` per branch; `git log -S` over all history is too slow here — moved to background at 120 s).
- **The QA app keeps the signed-in user in `localStorage.user` as `{role, details}`** — staff/user fields are under `details` (fe-permissions has none). Used by p54 for the Tech staff id.
- The other session's playbook note (commit 0f92e2ca4, 11:15 UTC): "QA-branch SSO session lasts a fixed 24 hours" — ours stopped after about 9 h, so a cross-session collision is the likelier cause of the 10:46 expiry; verify before trusting either figure.

## L0637 — 2026-11-11 — sv11315: the quick-login Tech user's role cannot be changed through the staff API (as on sv9160)
- p54 third try: `localStorage.user.details` holds `staff_id` and `user_id`; `POST /api/staff/{id}/change` with each of the four candidate ids (staff_id, user_id, …) answered **404 "'Staff' was not found."** — the same result playbook §GS.4 recorded on sv9160 (2026-09-14). Tech stayed technician (6 permissions, lands on /workorders).
- ⇒ On these QA branches a second lane as Tech can only do what a Technician may do. Do not spend more admin slots on this route; design/report work stays in the Admin lane (chain5 runs d1 at the end when p54 is not OK). Untried routes, for when a second lane matters: the Staff screen's Edit Staff Member dialog (UI save may use another id), or `POST /api/switch-user` impersonation from the Admin session (risks the Admin lane — test on an idle site only).

## L0638 — 2026-11-11 — Aging report column headings: the heading text runs into the sort icon's name
- On the aging reports (sv11315) a column heading's text reads like `Due Datearrow_drop_up` to a Playwright `hasText` filter (no space before the sort icon's ligature name), so a pattern ending in `\b` after the label never matches and the click times out after 15 s. That is a fault in the script, not the product.
- Match `^\s*(keyboard_arrow_\w+\s*)?<label>\s*(arrow_drop_(up|down))?\s*$`, or simply use `clickTh` from `build/aging-reports/exec/sortlib.mjs`, which already does. Fixed in `s9c_ap.mjs` `sortSteps`; C715310/C715311 re-queued by `chain6.sh`.

## L0639 — 2026-11-11 — Building a replacement chain from an old one: copy the run() line too
- chain7.sh was cut from chain5.sh with `sed -n '1,8p'`, which stopped one line short of `run() { … }`; every `run` line then failed with "command not found" and the chain "finished" in 40 s. Check a new chain with `grep -n '^run() ' chain*.sh` and `bash -n` before starting it, and watch queue.log for the first "start" line.

## L0640 — 2026-11-11 — Sales By Customer / Inventory Value export menus differ from the aging reports'; SBC PDF date form
- The aging reports' ⋯ menu offers "Download (PDF)" / "Download (CSV)". Sales By Customer offers "Download Summary (PDF)", "Download Expanded View (PDF)", "Download Summary (CSV)", "Download Expanded View (CSV)" (same `aria-label="Export report"` button). A script asking for "Download (PDF)" there times out — read the menu items first (`p55b_sbc_pdf.mjs`).
- On sv11315 (v26.45.2-6a8b89c) the Sales By Customer expanded PDF prints document dates as "Nov 04 2026" and its header range as "Date Range: Nov 1, 2026 - Nov 12, 2026". This is the control for any "PDF uses the app-wide report format" requirement.

## L0641 — 2026-11-11 — sv11315: an invoice cannot be overpaid on any route; where the customer payment window lives
- The customer's **New Payment** is on the customer page's **Invoices** tab (`/customers/{id}/work-orders` lands on the tabs; tick the invoice row, then New Payment), and on the work order's **Finance** tab (`[data-test-id=link_finance_tab]`, button New Payment). Not on the customer's header.
- Typing more than the balance in the invoice's Payment box shows "Payment cannot be higher than <balance>" and disables Make Payment; the window offers **Amount to credit** for any extra (it becomes customer credit). The API refuses too ("Transaction cannot be overpaid."). So an "overpaid invoice" precondition cannot be built on this build — mark Blocked with the three refusals (p50b_overpay_ui.mjs), never fake it behind the product (Rule 115).

## L0642 — 2026-11-11 — Aging Detail buckets: where the lines come from, and the offline trap
- A Detail bucket's lines load from `GET /api/reporting/reports/<ar-aging-detail|ap-aging-detail>/buckets/<bucket>/rows?asOfDate=…&pagination[page]=N&pagination[rowsPerPage]=100&pagination[sortBy]=…` (p56 control, sv11315).
- **Collapsing and re-opening a bucket reuses the lines already loaded** — no new request. So "go offline, then expand" only tests the error path if that bucket has NOT been opened on this page yet; otherwise nothing is asked and nothing can fail. To force a real failed load, block the `/rows` call (`page.route(... abort)`) and reload the report first, or open a bucket for the first time while blocked (p56/p56b).

## L0643 — 2026-11-11 — Aging Detail scroll paging: offline, the next page is never asked for
- Online, scrolling an A/P Detail bucket loads lines 101+ with `…/buckets/<bucket>/rows?…pagination[page]=2…` (and 3, 4 …); a 496-line bucket ends at 496 lines (p56b control).
- With the browser set offline (Playwright `setOffline(true)`, proved by an `ERR_INTERNET_DISCONNECTED` on the page's own `index.html`), scrolling to the end leaves 100 lines and sends **no** page-2 request at all — so no request "fails". To test a "lines stopped loading" message, also block only the page-2 call while online (`page.route` on `pagination%5Bpage%5D=[2-9]`), which does make the request fail.

## L0644 — 2026-11-11 — sv11315 fell asleep mid-run; a watcher now wakes it
- At ~12:20 UTC p56b's page turned into "Environment Sleeping … Wake Up" (pictures p56b/05, 06) and the step timed out on `locator('main')`. A chain's `wait_ok` only sees "not 200" and would wait for ever as if the sign-in had expired.
- `build/aging-reports/exec/wake_watch.sh` (background, every 60 s) curls quick-login; on a redirect to `sleep.qa.shopview.com` it runs `wake_sv11315.mjs` (opens `https://sleep.qa.shopview.com/?app=sv11315&api=sv11315`, clicks Wake Up, polls quick-login to 200). The same sv_sso_session keeps working after the wake (L0599).

## L0645 — 2026-11-11 — In this container `from PIL import Image` can fail; crop with ImageMagick
- `python3 -c "from PIL import Image"` raised `ImportError: cannot import name '_imaging'` (system PIL in /usr/lib/python3/dist-packages). `ann.py` does not need PIL (it shells out). To crop or resize a picture use `convert <in> -crop WxH+X+Y +repage <out>` (ImageMagick is at /usr/bin/convert).

## L0646 — 2026-11-11 — QA sites: an ABORTED API call sends the page to the "Environment Sleeping" screen
- On sv11315, making one API call fail with `page.route(..., r => r.abort('failed'))` shows a red "QA env is sleeping — Redirecting…" toast and then the "Environment Sleeping / Wake Up" page (p56b, p56c B, twice). The site was NOT asleep: quick-login answered 200 throughout and nothing needed waking. The QA wrapper treats any network-level API failure as "asleep".
- So to simulate a server-side failure on a QA site, answer the call with `route.fulfill({ status: 500, … })`, not `abort()`. Supersedes the reading in L0644 that the site fell asleep on its own at 12:20 (the wake watcher is still harmless and stays).

## L0647 — 2026-11-11 — Editing a running chain script: insert at least TWO lines past the job now running
- bash reads a script file ahead of the command it is running. A line inserted directly after the running job's line (p56b3 before `run s5i`, while s5h ran) was SKIPPED; an `env P56B_OUT=` edit to the next line was also ignored (p56b2 wrote into p56b/). Lines inserted two or more jobs ahead (p56, p56b, p56c, p50b) ran.
- Rule: never edit lines at or before the next job; insert two or more jobs ahead, then confirm in queue.log that the inserted job actually started. If it was skipped, insert it again further down.

## L0648 — 2026-11-11 — A seeded bill stamped 06:00Z in winter shows the previous day but sorts and ages by the UTC day
- Bill ZZB1519526 (vendor ZZAUTOTEST SEEDTEST V, an early seedlib test before the T18:00Z fix) shows Date/Due "Nov 10, 2026" on A/P Detail but sits in "Current" with Past Due 0 and sorts after the Nov 11 lines when sorting by Date. Its stored time is 06:00Z = 23:00 the previous evening in Edmonton (MST, UTC-7): the screen shows the local day, the bucket/sort use the UTC day.
- Bills entered through the screen are stamped at local midnight (playbook: invoiceDate "…T06:00:00.000Z" in summer = MDT midnight), so their UTC day equals the local day — this does not reach real users. Treat such a row as our own data artefact; seed with T18:00Z (seedlib already does). It explained the single "order break" in C715314 step 3.

## L0649 — 2026-11-11 — Unticking a name in the aging reports' Customer/Vendor menu: click the CHECKED checkbox in the list row
- Clicking the name (`.q-item` / `label` filtered by text, as `filt.mjs` pick and s5's untick did) leaves a ticked customer ticked when the menu is reopened — the first element with that text is the selected-name tag at the top of the menu, not the list row. Search the name, then click `.q-item` filtered by the name AND having `[aria-checked="true"]`, on that checkbox (`p59_untick.mjs`). After unticking all, the chip reads "Customer: All customers" with a transparent background and grey text (resting style).

## L0650 — 2026-11-11 — Design measurements on the aging reports: heading "lines" and the dark-mode switch
- Counting a heading's lines from a Range over the whole `th` gave 2 for EVERY heading (light, 1440 and 1536) although the pictures show one line: the sort arrow icon (`arrow_drop_up`, hidden until hover) sits on its own line box. Count only the label's text nodes, skipping text inside `i` / `.q-icon` (d1_design.mjs fixed 11 Nov). Always check a "wraps" claim against the picture before using it.
- The user menu (avatar, top right) ends with two options "light_mode Light" and "dark_mode Dark". A filter `hasText: /dark/i` on `.q-item, label, button` matched a container and did nothing; click `getByText('Dark', { exact: true })` inside the open menu. Read back `body.classList.contains('body--dark')`.

## L0651 — 2026-11-11 — "Your current location" on sv11315 is set on screen only; the change-location API does not move the page
- `POST /api/iam/change-location {workplace_id, workplace_timezone}` answers 200, but after an on-screen switch to Lethbridge (C715407/08) the header and every link check kept Lethbridge: s78's C715414 then clicked a Heavy Duty invoice and got "Switch location?" — a false result. Any test that depends on the current location must switch THROUGH THE SCREEN and read the header back: `build/aging-reports/exec/locsw.mjs` `ensureLoc(page, name)`; s78_run now calls it before every test.
- When building an ONLY list from a runner, collect every `C\d{6,7}` in the file, not only `T.Cxxxxx` — tests defined in `for (const [id …] of [['C715418', …]])` loops are otherwise left out.

## L0652 — 2026-11-11 — sv11315 now has a THIRD A/R location (another session's), so "untick location B" no longer leaves one
- **What changed:** "ZZAUTOTEST V1R-87 Location C" (workplace `19abb244-4c5d-460a-86bb-e515d4eda24d`) was made by the parallel regression session; it holds A/R documents (customer "ZZAUTOTEST AR V1R-87 Location C") but no A/P documents (p61, 14:04 UTC). The Location menu on the A/R reports reads "3 selected".
- **Effect on our cases:** every case written for two locations ("untick location B" → one location left → Location column hidden, a Location sort returns to Date) now leaves TWO ticked unless Location C is unticked too. Runners s82/s84 untick it as part of "untick location B" (`F.menuClick('Location', 'ZZAUTOTEST V1R-87 Location C')` when the menu lists it) and say so in the result.
- **It also unblocks** the three-location cases (C715387, C715394, C715411–13, C1062584/85): Location C is the long-named location C. A/P needs a bill there first (p69: sign in at Location C with `S.loc(a, '19abb244…')`, then `S.bill`).
- #aging #sv11315 #locations #parallel-session → L0651

## L0653 — 2026-11-11 — A blank full-width table heading on the aging reports is the LOADING BAR, not a column
- d1b measured A/P Detail while its 91+ bucket (11,936 lines) was still loading: the progress bar is an extra `th` the width of the table with no text, so the measure read a 10th blank heading and "headings overlap". Picture 44-apd-light-1536-top shows the bar under the headings and the "•••" loader row.
- **Fix:** before measuring, wait until no `main thead th` is blank and wider than 600 px and no `.q-linear-progress` is visible, and move the mouse off the top-left chevron (its "Collapse all" tooltip covers the As of chip). `d1_design.mjs` now does both; `D1OUT=<dir> ONLY=<key>` re-measures one report into its own folder.
- #aging #design #measure #loader → L0650

## L0654 — 2026-11-11 — A tooltip's words in the page are NOT a tooltip on screen: check the picture before "Passed"
- p63 read `.q-tooltip` text within 3 s of a TAP on A/R Collection's info icon (touch context) and C715449 was recorded Passed — but none of the pictures taken after the tap shows the tooltip. The element existed in the page (perhaps for a flash, or not yet visible) and the reader counted it as shown.
- **Rule 12 in practice:** for any "X shows" verdict read from the page, require the element's box (width/height > 0), opacity > 0.5, visibility not hidden, AND look at the picture taken at that moment. The Passed was withdrawn within minutes with a Retest result saying so; p63b re-measures every 100 ms with pictures.
- The hover and keyboard tooltip passes (C715433-C715438) were checked against their pictures the same hour: the tooltip is visible in them.
- #aging #tooltip #rule12 #touch → L0653

## L0655 — 2026-11-11 — After a session worker restart, CHECK THE BRIDGE FIRST: the egress proxy port moves, the bridge does not
- At ~14:20 UTC the agent worker restarted (the container kept running: chains, node jobs and /tmp all survived). `$HTTPS_PROXY` moved from `:38033` to `:33511`, but the running bridge (`build/atlassian-login/bridge.mjs`) still sent everything to `:38033`, so every page the test browsers loaded was "bridge error: TypeError: fetch failed" (s83 C715356/C715363/C715600 timed out on it; the production sign-in got 502).
- **Check:** `curl -x http://127.0.0.1:$(cat /tmp/atlassian/bridge-port.txt) -k https://sv11315.qa.shopview.com/index.html` must answer 200; compare the `egress=` in `/tmp/atlassian/bridge.log` with `$HTTPS_PROXY`. **Fix:** playbook line 116 recipe (kill, `rm` the port file, `NODE_EXTRA_CA_CERTS` + `NODE_USE_ENV_PROXY=1`, `setsid nohup node …bridge.mjs`). Jobs already running keep the OLD port in their browser — stop and re-run them.
- Production probes are now run as `node ./x.mjs` so the QA chains' wait (`node [a-z0-9_]+\.mjs`) does not hold up on them.
- #bridge #proxy #restart #aging → L0654

## L0656 — 2026-11-11 — sv11315 data shape for the paging tests, and states the app will not build
- **p67 census (as of 11 Nov):** A/R Detail buckets Current 15 · 1-30 290 · 31-60 185 · 61-90 54 · 91+ 70 (two buckets fit the "101-400 lines" cases). A/P Detail buckets 28 · 520 · 724 · 708 · 5,900 — **none in 101-400**, so C715455 needs a vendor/location filter or seeded bills first. A/R Summary 142 customers, A/R Collection 140, A/P Summary / Unpaid 502 vendors (all above the cases' "31-90").
- **Not buildable through the app (p66):** an A/R invoice sent with `due_date: null` is stored WITH a due date (invoice date + the customer's term); a vendor with credit term `''` gives bills due on the bill date; a vendor with `credit_term: null` is refused ("Missing required parameter"); paying a bill more than its balance is refused ("Vendor transaction cannot be overpaid."). Screen routes are checked by p66b before any Blocked.
- **Production (v26.45.3) Reports page has no `aside`/`.q-drawer`/`nav` wrapper** around its left list — click report names with `page.getByText(name, {exact:true})`.
- #aging #sv11315 #data #production → L0655

## L0657 — 2026-11-11 — Sales By Customer / Inventory Value / Work In Progress open on YOUR CURRENT LOCATION, not "All locations"
- d2 ran while the test admin's current location was Staging Lethbridge - 4310; all three reports opened with "Location: Staging Lethbri..." (1 selected). That is their default, not a remembered filter — the six aging reports open on "All locations" instead.
- **For the filter-memory checks (C715583/C715619/C715620) and anything read off these three reports:** note the current location first (header), and judge "kept or forgotten" only from a chip that CHANGED after the untick (pr1b does).
- Also 11 Nov ~14:25 UTC: the developer re-corrected the SV-11533 handoff — aging PDF dates must read "Nov 04 2026" (PRD v11 S3-R7a); "Nov 4, 2026" is the open defect SV-12544 (In Progress). Recorded in `build/aging-reports/PROJECT-STATE.md`.
- #aging #reports #location #handoff → L0656

## L0658 — 2026-11-11 — Sales By Customer does not empty with "Location: No locations"; the aging empty state and loading bar, measured
- On sv11315, Sales By Customer with **Location: No locations** (Clear selection) still lists every row and the Totals — so it cannot be the control for "empty state matches Sales By Customer's". Use another filter that leaves nothing (s84b tries Product Type = parts only, then an older Date range).
- The six aging reports' empty state (s84): magnifier icon (24 px, rgb(105,117,134)), "No record matches these filters" (17 px, weight 600), "Try changing filters to widen your results." (14 px), a "Clear all filters" button; no Totals row. Their loading bar is `q-linear-progress q-table__linear-progress`, 2 px high, the table's full width under the headings, plus the page-top `q-loading-bar`.
- #aging #design #sales-by-customer #empty-state → L0657

## L0659 — 2026-11-11 — Production's old A/R Aging Detail: one reply, location-prefixed credit numbers, a dated credit in 1-30
- Production (v26.45.3, before the release) loads A/R Aging Detail from ONE reply: `GET /api/reporting/account-receivable/aging-detail-report?asOfDate=<day>T23:59:59.999Z` → `data.buckets.{current,days1to30,days31to60,days61to90,days91Plus}.transactions[]` (`transactionNumber`, `type` invoice|credit, `locationName`, `date`, `dueDate`, `balance`).
- **Credit numbers carry a location number there:** the API's `CM-4412` is listed as `CM1-4412` (Truck Hill 1). Search the reply by customer name, not by the number the create call returned.
- **Before-release fact (C1062590):** a credit memo dated on the as-of date sits in `days1to30` ("1-30 days past due"); on the QA site with the release it is "Current". `exec/pr2d_bucket.mjs`.
- #aging #production #before-release → L0658

## L0660 — 2026-11-11 — sv11315 has a vendor named "Total Truck & Trailer Repair - Indian Lake": never find the Totals row with /^Totals?\b/
- s86 read A/P Summary as 503 vendors against the CSV's 504; the missing one was "Total Truck & Trailer Repair - Indian Lake" — the reader dropped every row whose text starts with "Total", meant for the Totals row. The same pattern would also pick that vendor's row as "the Totals row".
- **Match the Totals row exactly:** `/^\s*Totals(\s|$)/` (and group subtotals by `/^Total for /`). Fixed in `exec/s86_paging.mjs`; earlier runners using `/^Totals?\b/` (s85, s82, sortlib callers) only read A/R Summary or one-vendor lists where it did not bite, but check before reusing them on A/P lists.
- Also: CSV exports prefix names that start with "-", "=", "@" with an apostrophe ("'-1 Diesel") — compare CSV names to the screen after stripping one leading apostrophe.
- #aging #reader-trap #csv → L0659

## L0661 — 2026-11-11 — QA lead's note "how to avoid reporting a bug that isn't there", and the ticket it caught (SV-12540)
- His note (verbatim in `build/skills/06-DEFECT-PREP.md`, last section) is now the standing checklist before any defect is drafted, asked for or answered: measure the claim on the page before/after and quote numbers; "didn't see it" ≠ "didn't happen"; data that makes pass and fail look different (show N then more ⇒ well over 2×N); one check per clause; try to prove yourself wrong; when a developer says "it works", re-measure THEIR way and answer with numbers; keep settling evidence.
- **Caught:** SV-12540 (filed 11 Nov on his go-ahead) said an open group "shows every document at once" — measured on the SERVER reply (105 of 105 in one answer) with a 105-document group. PRD S1-R8 says the group "shows its first 100 documents, then the next 100 as the user scrolls" — a statement about what is SHOWN. Developer (comment 80909): the page draws 100 and adds 100 at the end, from one fetch; with 105 the last 5 appear just before you reach them. Re-measure queued first (p72: largest real group, DOM rows before/after each scroll, plus a 105 control).
- #defect #method #aging #SV-12540 → L0660

## L0662 — 2026-11-11 — SV-12540 re-measured on the page: the developer was right (100 drawn, the rest added on scroll)
- `exec/p72_grouprows.mjs` counted the group's rows ON THE PAGE (DOM rows between the group row and its "Total for" row) after opening and after each scroll to the end. **A/P Unpaid, "Willoughby Mechanical Services" (2145 bills): 100 on opening, then 200 › 300 › … › 900 after eight scrolls — exactly +100 per scroll. A/R Collection, "ZZAUTOTEST OVER100 C" (113): 100 on opening, 113 after one scroll, "Total for" then shows. Control "ZZAUTOTEST OVER100 V" (105): 100 › 105.**
- So the server reply carrying all 105 (what the ticket measured) is not what the page shows: the page itself draws 100 at a time. Measure the screen state, never the reply, for any "shows/loads" claim (L0661). Full end-to-end re-run with no-repeat check: `exec/s91_grouppaging.mjs` (C1062570/C1062571).
- When counting rows below an open group, the table's own **Totals** row is counted unless excluded (`^Totals( |$)`): p72's "101" on opening = 100 documents + the Totals row.
- **Queue-name trap:** `git checkout -- queueN.sh` on a REUSED queue name restores the OLD committed queue of that name, not "undoes my sed". Give new queues new names (queue5, queue6 …) and never `git checkout` one that is running.
- #defect #method #aging #SV-12540 #queue → L0661, L0647

## L0663 — 2026-11-11 — A/R and A/P suite: every ticket carries the label `AP-AR-FM` (QA lead's standing instruction)
- QA lead, 11 Nov ~15:30 UTC: *"ALl the tickets which you have created and will create in the future for the A/R and A/P testing suite please apply the label on those ticket as AP-AR-FM"*. Suite-scoped (aging reports, run 557), past and future tickets.
- Done: SV-12540 → labels `AP-AR-FM`, `QA_Found` (read back). SV-12544–SV-12547 already had it. Held drafts 01/03/04/05 `FIELDS.json` now carry it, so a filing on his per-ticket yes includes it.
- The Jira label field is REPLACED, not appended, on edit: send the full list (existing + `AP-AR-FM`).
- #jira #label #aging → L0661, `build/aging-reports/PROJECT-STATE.md` (standing instruction block)

## L0664 — 2026-11-11 — sv11315 aging reports: number pattern at Location C, grouped-sort judging, and two positive-control gaps
- **Invoice numbers at "ZZAUTOTEST V1R-87 Location C" read `S-17887`** (no location digits), unlike `S11315-17887` at Heavy Duty. A matcher `/^S\d+-\d+$/` silently finds nothing there; use `/^S\d*-\d+$/` (s87 C715424 missed its row this way).
- **Grouped reports (A/R Collection, A/P Unpaid): judge "sorted" INSIDE the open group** — PRD S2-R5: a heading click sorts rows inside each group, the groups never move. A group-order check reading "not descending" is expected, not a fault (s82 C715318/C715321).
- **A/R Collection hides its Location column when only one location is ticked**; prove "only location A" by the chip + the drop in the group count (23 → 21), not by reading Location cells.
- **"Phone:" absence needs a PDF that prints a phone at all**: the collection PDFs we held (C715446, C715459) only had phoneless customers, so 0 "Phone:" proved nothing. Control: `exec/p73_phonectl.mjs` with "Andrews' Truck & Trailer Repair LLC" (Phone 343-203-3967).
- **The Admin's enrolled locations are listed behind the avatar menu's "Change Location"**, not in the menu itself.
- **The left report menu has no `aside`, `.q-drawer` or `nav` on the QA build either** (q1 timed out on it, as pr1 did on production): click menu entries with `page.getByText(label, {exact:true})`.
- #aging #trap #positive-control → L0654, L0660

## L0665 — 2026-11-11 — sv11315 aging: tests whose own data cannot tell pass from fail (enrolment, 1200 px, location count)
- **"Every location is listed, whatever your enrollment" (C715384/C715385):** the Admin is enrolled at BOTH Heavy Duty and Lethbridge, so Lethbridge rows prove nothing. The only fair non-enrolled location is "ZZAUTOTEST V1R-87 Location C" (another session's; A/R invoices from Nov 1, A/P bill ZZYLC8872344). Confirm enrolment from the "Change Location" list first, then judge on Location C.
- **"Group label stays at the left on a sideways scroll" (C715600) at 1200 px:** the A/R Collection table overflows only ~23 px there, so a pinned label and a scrolling one both stay visible. Also measure at 1000 px (s83c) before any verdict; S4-R7 + design SR-2 say the name and count stay, the chevron scrolls away.
- **The site has THREE locations** (A, B and another session's C), so design tests written for "two locations" ("2 selected", two menu rows) cannot match literally; untick C where the step allows (L0652), otherwise put it to the QA lead rather than editing anyone's data.
- **Before-release ("as today") checks:** production is the "before" side (behaviour only); "evening at the location" tests must actually run after 00:00 UTC (s94 refuses outside 00:00–06:59 UTC; scheduled check-in 00:40 UTC).
- #aging #edge-data #positive-control → L0661, L0664, L0652

## L0666 — 2026-11-11 — sv11315 aging: Location menu order on reopen, catching a loading bar, and the empty-state twin
- **The Location menu re-orders when it is REOPENED:** after unticking Lethbridge and reopening, it read "Staging Heavy Duty - 9919, ZZAUTOTEST V1R-87 Location C, Staging Lethbridge - 4310" (ticked first, unticked last); a later reopen with all ticked was A-Z again (s84 C715389 m2c/m4). C715549 asks that rows NOT move while the menu stays OPEN - judge it on the open menu only, and say which state a menu text came from.
- **Sales By Customer's table loading bar is never seen at normal speed** (s84b sampled 30 × 100 ms: only the page-top `q-loading-bar`). To compare loading bars, hold every `/reporting/` reply ~3 s with `page.route` + delayed `continue()` (never abort, L0646) and sample — `exec/p74_loadbar.mjs`.
- **The aging empty state is the Sales By Customer empty state to the pixel** (magnifier 24 px rgb(105,117,134) at 832,293; title 17 px/600; helper 14 px; "Clear all filters" 14 px/500 at the same boxes) — use Product Type = Services-only ("ptnone") on Sales By Customer as the control (Location: No locations does not empty it, L0658).
- #aging #design #location-menu #loading → L0658, L0665

## L0667 — 2026-11-11 — sv11315 location codes and link behaviour on the aging reports
- Location codes (for `locationIds=` links): **Staging Heavy Duty - 9919 = b3c8c820-f815-4cf1-8938-10956c5ee71a**, **Staging Lethbridge - 4310 = f8a8b802-7780-4b16-bf10-343caeb616b2**, **ZZAUTOTEST V1R-87 Location C = 19abb244-4c5d-460a-86bb-e515d4eda24d** (Location C's A/R documents start Nov 1, so 10/31/2026 is a date with A and B only).
- The app writes ticked locations as repeated `locationIds=` entries; a hand-edited comma list (`locationIds=a,b`) opens the same selection and stays in the address as typed; a link naming every location opens as "All locations" and the address drops the parameter.
- Group "Location" cell: one location's name, or "Multiple"; it recomputes from the ticked locations only (LOC MIX: Multiple → Staging Heavy Duty - 9919 when Lethbridge is unticked; totals drop to the Heavy Duty documents).
- #aging #location #links → L0665, L0666

## L0668 — 2026-11-11 — Create Role: "Invoicing & payments" / "Part sales" View open an "Enable See Financial Data?" dialog
- On sv11315 Settings > Roles & Permissions > Create Custom Role, ticking View on **Part sales** (and, from p71's log, **Invoicing & payments**) does not tick at once: a dialog "Enable See Financial Data?" — "Part Sales requires See Financial Data. Enable it to grant this permission?" — with Cancel / Enable. Until **Enable** is pressed the box stays unticked and the dialog blocks every later click (p71: 3 of 7 roles failed with click timeouts). `p71_roles.mjs` now presses Enable after each tick.
- So those roles carry See Financial Data ON by design; a test needing "Invoicing View with financial data off" cannot be built.
- Roles made (p71, sv11315): ZZAUTOTEST P71 Reports only `2551b1bb-…`, VOM view `5b89f5ff-…`, VOM create-edit `269548a7-…`, Customers view `9711d3a3-…` ("Similar role already exists" → Create Anyway).
- #roles #permissions #aging → L0637

## L0669 — 2026-11-11 — never pipe push_results_to_run.py through a filter you then "re-run because nothing printed"
- `push_results_to_run.py ... | grep -E "run now|..."` printed nothing for a Blocked batch (the grep matched nothing it wrote in that mode), the push HAD succeeded, and running it again posted every result twice (C1078998/C1078999/C1079000: results 616868-70 and 616871-73, 18 s apart; TestRail results cannot be deleted through the API). Run it with `| tail -6`, and before any re-run read `get_results/<test_id>` to see whether the first one landed.
- The three were recorded Blocked with `exec/claims/<id>.json` passing `blocker_gate.py --check`: the app will not create an invoice or bill without a due date, nor overpay a bill (p66, p66b, p66c).
- #testrail #push #duplicate → L0654

## L0670 — 2026-11-11 — Production's test sign-in: one location until 11 Nov; how it was enrolled at a second
- The production login in `/tmp/shopview/prod-login.env` is **"Service Advisor No Reports (Admin)"** (bilal.muzamil+serviceadvisornoreports@…), role Admin, at **"Truck Hill 1"**. Its user menu ("S(" avatar, top right) holds "Change Location:" with ONE button — it was enrolled at one location only, so any "work order / document at another location" check on production was impossible.
- ⛔ CORRECTED 16:30: the Edit Staff Member **Location box is SINGLE-select** — it is the person's location, NOT enrolment; picking "Trucks Hill 2" REPLACED Truck Hill 1 (pr4). Restored to Truck Hill 1 at 16:27 (`pr4b_restore.mjs`) and read back (`pr4c_readback.mjs`: Location = Truck Hill 1). Enrolment at several locations is not set from this box. The superseded line, kept: 11 Nov 16:05 UTC (Rule 107, production in scope): enrolled it at **"Trucks Hill 2"** as well — Settings > Staff > **Search** "serviceadvis" > the row's **edit_note** icon > Edit Staff Member > **Location** (multi-select: Truck Hill 1, Trucks Hill 2, ZZAUTOTEST C614715 Empty Location, SANKAN) > tick > **Save & Close** (`exec/pr4_enrol.mjs`). Nothing else changed.
- Production staff list: 216 active rows; always search, never scroll-match by name.
- #production #login #location → L0659, L0665

## L0671 — 2026-11-11 — Two runner traps: a group-row click does not open the group; the fixed return part is gone
- On A/R Collection / A/P Unpaid, clicking a customer's/vendor's group ROW does not expand it; only its own chevron does. Use `sortlib.expand(/^<name> \(/)` (s90 missed P11315-248 and P3-188 because of this; fixed in s90b).
- vseed's fixed inventory part `000657fe-…` (P550848) now answers "Inventory part not found." on `part/manual-return-request/create`; pick a stocked part at the CURRENT location from `GET /api/inventory/parts` each time (`s89_vcredit.mjs` `credit2()`).
- #aging #runner #seed → L0635, L0670

## L0672 — 2026-11-11 — sv11315 data facts for "every document once" checks
- **Grand Haven Diesel Services LLC** (A/P, 578 unpaid bills) holds two pairs of separate bills with the SAME vendor invoice number, date and amount: **979569** (2025-05-21, $2,765.24) and **1008064** (2026-04-29, $1,592.59) — each appears twice in the A/P Unpaid CSV too. A "no number repeated" check on this vendor must compare against the CSV's multiset, not demand unique numbers (s91 C1062571).
- Phone control for "no Phone:" checks: **Andrews' Truck & Trailer Repair LLC** prints "Phone: 343-203-3967" on its A/R Collection group row and PDF line (p73); **ZZAUTOTEST S1R5 Alpha** has no phone.
- #aging #data #positive-control → L0664, L0672

## L0673 — 2026-11-11 — Before/after-release facts: old drill-down links, Select-all address, offline on QA
- **Production's (pre-release) drill-down addresses** (pr5): A/R Summary customer click → `/reports/ar-aging-collection?customerName=<name>&customerId=<id>`; A/P Summary vendor click → `/reports/ap-unpaid-invoices?vendorName=<name>&vendorId=<id>`. The old summaries make the whole ROW clickable (no `<a>`): click the name text with `getByText(name, {exact:true})`. The new build writes `?asOfDate=…&customerIds=…` / `vendorIds=…` (q1). C715582 pastes the OLD form into the QA site (q2).
- **Sales By Customer, Location "Clear selection" then "Select all":** production's address stays `/reports/sales-by-customer`; the QA site writes `?locationIds=<all three codes>`. The QA reports open on the CURRENT location (L0657) while production's opened on All locations with a one-location user — so the two defaults differ and the address difference may follow from that; not judged without a production user enrolled at 2+ locations.
- **Offline on a QA site shows "QA env is sleeping Redirecting…"** (its own sleep detector) instead of the app's error, so "offline export message" checks (C715476) cannot be observed on a QA branch; production shows "Network Error".
- #aging #before-release #production → L0659, L0670

## L0674 — 2026-11-11 — "Offline, no load-error message" may be no failure at all: check the figures and the requests first
- p62b (offline, as-of changed to YESTERDAY on six reports) saw no "Something went wrong loading this report" message — but the page made NO report request while offline, and A/P Summary's Totals changed to $4,763,410.45 under "As of: 11/10/2026" (today's $4,763,441.95). Yesterday's figures appear without the network (prefetched or held by the page), so nothing failed — not evidence of a missing message. Results HELD (not posted).
- The fair offline test uses a date the page cannot already hold (p62 used the 3rd: today's Totals stayed under the new date = a real failure to load). `exec/p62c_cache.mjs` compares online-yesterday vs offline-yesterday Totals and tries the 6th.
- ⚠️ 16:45 follow-up: A/P Summary/Detail TODAY now read Totals $4,763,410.45 online (d3a C715528 at 16:40) - the site's data moved during the day - so p62b's offline $4,763,410.45 may be TODAY's rows left on screen (a real failure), not yesterday's. p62c (online-yesterday vs offline-yesterday, and the 6th) decides; compare against a reading taken minutes before, never one from hours earlier.
- Rule: for any "fails to load / no message" claim, record (a) whether a request was made, (b) whether the shown data matches the new date, before judging (QA lead's note, L0661).
- #aging #offline #method → L0661, L0673

## L0675 — 2026-11-11 — PDF checks: word positions prove "on one line"; pdftoppm names pages by page-count width
- "Heading on one line" in a PDF: `pdftotext -bbox -f 1 -l 1 <pdf> -` and compare the yMin of the words ("91", "And", "Over" all at 139 = one line) — exact, no picture reading needed (d3a C715524/C715525).
- `pdftoppm -png -f 1 -l 1 x.pdf out` names the page `out-1.png` for a PDF under 10 pages but `out-01.png` for 10-99 pages (A/P Summary PDF: 22 pages). Glob for `out-*1.png`, never hard-code `-1`.
- #pdf #tool → L0664

## L0676 — 2026-11-11 — Aging reports below ~1000 px: filters open as a full dialog; 1200 px barely scrolls sideways
- At 1000 px wide the app switches to the compact layout (hamburger menu) and the Customer filter opens as a centred **dialog** ("Customer", search box, "Apply Filters"), not a `.q-menu` — `filt.mjs` pick() waits for `.q-menu input` and times out (s83c C715600).
- Workaround: set filters and open groups at 1440, then `setViewportSize` to the narrow width WITHOUT reloading (`exec/s83d_side.mjs`).
- At 1200 px A/R Collection overflows by only ~6 px (scrollWidth 898 vs clientWidth 892): a "label stays at the left" check there cannot tell a pinned label from one that scrolls (label moved 388→382 = the scroll). Measure at 1000/900 px too, with a column moving as the positive control (L0661).
- Pinned group row (C715363): s83c's numeric geometry was unreliable; the scroll pictures (header strip, pinned strip, Totals strip) settled it — Passed.
- #aging #layout #tool → L0661, L0671

## L0677 — 2026-11-11 — A design runner that resets scroll before a dark-theme picture never shows the pinned row in dark
- d3b's chevron step 7 ("switch to dark, the pinned row is readable") ran `scrollTop = 0` before the dark picture, so the picture showed the top of the table, not a pinned row: step 7 unobserved for C715505-508. Fix: switch theme WITHOUT scrolling and read the row under the headings with `elementFromPoint` (`exec/d3c_darkpin.mjs`).
- `sortlib.find(/^Willoughby/)` on A/P Unpaid Invoices (vendor groups of 2,000+ documents, 100 per scroll) found nothing, so no pinned picture was taken. For "a pinned group row" checks, scroll into whichever group is at the top and match any label with a count (`/\(\d+\)/`) instead of naming a huge group.
- Sales By Customer's ⋯ menu reads "Download Summary (PDF)", "Download Expanded View (PDF)", "Download Summary (CSV)", "Download Expanded View (CSV)" — not the aging reports' "Download (CSV)". `explib.exportAs(kind, tag, wait, label)` now takes the menu text; and it pictures a message still showing after a fast download (`-toast-late.png`).
- #aging #design #tool → L0671, L0676

## L0678 — 2026-11-11 — A failed "back to light theme" silently turns every later picture dark
- d3b C715519 took a dark-theme picture of the "Switch location?" dialog, pressed Escape (the dialog stayed open) and called setDark(false): the user-menu click was blocked, so C715546, C715520 and C715532 (all "light theme" cases) were pictured DARK, and every later case would have been. Caught only because the C715532 picture was dark beside the light design picture.
- Fix in `exec/d3b_design.mjs`: close a dialog with its own Cancel before switching theme, and every case's `go()` asserts light (`setDark(false)` must return true or the case errors). Re-run as d3b2 (runq35).
- Rule: any runner that switches theme must re-assert the theme at the start of EVERY case, and a result builder should check the picture's theme (header pixel ~255 light, ~24 dark) before judging.
- #aging #design #tool #trap → L0677

## L0679 — 2026-11-11 — Aging permission tests on sv11315: new staff + switch-user, not "change Tech's role"
- The cases say "change Tech ShopView's role", but the staff role-change route 404s on sv11315 (L0637, p75). Route used (`exec/pm1_perms.mjs`): make a new staff member with the p71 role (`POST /api/iam/create`, department Service), enrol at Heavy Duty (`/api/staff/enrollment/create`), `POST /api/switch-user`, then a NEW browser context with the switched person's own `user` + `fe_permissions_wrapper` in localStorage (the admin context rewrites them — wo-board `viewas.mts`, L0583). Always `exit-switch-user` in a finally.
- The aging exec `api.mjs` returns `{ st, j }`, not `{ status, body }` like the wo-board helpers — copying wo-board code needs `.st` / `.j`.
- p71b made all seven roles (names "ZZAUTOTEST P71 …", ids in `exec/p71/out.json`).
- CONFIRMED 11 Nov ~22:40 (pm1b): with `workPlaceId` added, the new staff + switch-user + own-context route works on sv11315 - the Inv+WO role sees work-order invoice numbers as links, the WO+Part-sales role (no Invoicing) sees them as plain text.
- `POST /api/iam/create` on sv11315 needs `workPlaceId` (400 "Workplace ID is missing." without it) - the wo-board `person()` body lacks it; pm1's first run created nobody.
- #aging #permissions #route → L0637, L0583

## L0680 — 2026-11-11 — A/P reports list a vendor credit by its CREDIT number (C-nnnnn), not the vendor return's number
- s89b searched the No. column for the vendor-return numbers it created (ZZYCM6825104…) and found nothing; the reports show the vendor credit's own number ("C-13686"). Map credit A/B/C by location and amount from the rows (Heavy Duty $-31.50 = C-13686 from the Heavy Duty return; Lethbridge $-42.75 = C-13687; direct credit $-23.45 = C-13688). Follow-up `exec/s89c_click.mjs`.
- Already visible on s89b's picture: C-13686 (return at the current location) is blue (a link), C-13687 (return at the other location) is plain text.
- Queue ordering: runq35/36 wait patterns had to be widened when runq37 was added — a new waiter that two others don't wait for can start at the same tick.
- #aging #ap #seed #trap → L0672, L0662

## L0681 — 2026-11-11 — "Stays visible at the left" ≠ "pinned"; elementFromPoint under the headings can come back empty
- C715600 (S4-R7 "each group row's label stays visible at the left"): on sv11315 the label moves WITH the columns (td position relative), but the table scrolls only 6 px at 1200 px and 58 px at 900 px while the label starts ~110 px in, so it never leaves view. Judged Passed on the PRD's own words (Rule 137: nothing stricter) with the measurement stated; if a later build widens the table, re-measure.
- At 900 px the filter row and the bottom "Totals" word also scroll sideways out of view (seen, not judged by any test).
- d3c's "row just under the headings" read via `document.elementFromPoint(700, theadBottom + 20)` returned "" in light theme on all reports and in dark on A/R Collection — judge those from the pictures; when writing such a probe, sample several x positions and fall back to the first `tbody tr` whose top is within 5 px of the header's bottom.
- #aging #layout #tool → L0676, L0677

## L0682 — 2026-11-11 — sv11315: a work order at another location shows the switch prompt only when its address carries ?locationId=
- `/workorders/<id>?locationId=<other location>` (the developer's own form, SV-11597 checklist) opened while at Heavy Duty shows the existing "Switch location?" prompt (box 416,345 608x201; button "Switch Location", capital L, kept on that page); Cancel goes to `/workorders?tab=estimate` with "Switch cancelled. Returning to work orders." (`exec/d3e_prompt.mjs`).
- The address bar copied from an open work order has NO `?locationId=` (`/workorders/<id>/lines`); pasted at another location it gives "WorkOrder not found" + "Request failed with status code 400" and no prompt (p65b). Bears on C715477 ("as before the release") - compare production the same way before calling it a fault.
- For "same as the existing prompt" comparisons, open it with `?locationId=`.
- #aging #route #location → L0673, L0680

## L0683 — 2026-11-11 — Design-picture tests: a "default view" picture rarely holds every state the case names
- The d3b design runner pictured each report's opening view only, so cases that name a specific row type failed to be judgeable from it: C715538 (a credit memo row inside an expanded A/R Collection group - opening groups are invoice-only), C715544 (a bill made at ANOTHER location, plain number - Abadi's Diesel Repair 5956 at Lethbridge sits below the fold), C715545 (the "Total for 91 or more…" subtotal at the END of a 70-line bucket). Before writing a design runner, list each Expected line's required row/state and filter or scroll to it (one customer/vendor that has it), not just the default screen.
- `exec/d3b2_design.py` holds the by-eye verdicts per case (observed lines + pictures) so later additions are one dict entry; `exec/d3g_cm.mjs` collects the missing states.
- The title's info icon is a Quasar icon whose text is "info_outline" - `getByText('info', {exact:true})` never matches (C715542).
- #aging #design #method → L0677, L0678

## L0684 — 2026-11-11 — Summaries load 30 names at a time: a "ZZ…" customer/vendor is not on screen unless ticked first
- pm1b C715610 / C715432 looked for "ZZAUTOTEST AR Customer A" (A/R Summary) and "ZZY Types P92" (A/P Summary) on the opening page: the Summaries show 30 rows per batch in A to Z order, so names starting "ZZ…" are far below - the cell search returned nothing and the click timed out. For any check on one named row of a Summary, tick it in the Customer/Vendor filter first (the row is then the only one), or use a seed name near the top of the alphabet (e.g. "AAA ZZAUTOTEST …").
- #aging #permissions #trap → L0679

## L0685 — 2026-11-11 — "Link with the filter" checks: tick a location that is NOT already the default, and give big PDFs minutes
- q3 (C715475/617/618): on sv11315, Inventory Value / Sales By Customer / Work In Progress opened with the CURRENT location (Staging Heavy Duty - 9919) already ticked; "Clear selection + tick Heavy Duty" therefore left the address bare (/reports/inventory-value) and the copied link proved nothing. Production writes `?locationIds=<id>` when a location is ticked. Re-run with Lethbridge (q3d, `LOC=`).
- The QA Inventory Value PDF (~6,000 parts, CSV 986 KB) did not download inside 90 s and no message was caught; `q3_common.dl()` now waits `DL_WAIT` (300 s) and reads messages every second.
- Production's "Change Location:" location and sv11315's are plain text in the user menu, not buttons — click `getByText(<location>, { exact: true })` (a `button, .q-btn` filter times out). The production test account was enrolled at ONE location, so its list never opened (pr3); pr6 enrols it at Trucks Hill 2 via `POST /api/staff/enrollment/create` first.
- `POST /api/parts-catalogue/add-vendor` needs `tax_id` = the tax UUID (`seedlib.TAX`); with an 82-character name it answered without a vendor id (p49 V40 now logs the raw answer and falls back to shorter names).
- QA site offline export (C715476): the first message is the site's own "QA env is sleeping - Redirecting…" (L0317), the report's own message ("This report is too large to export…") still shows — compare that one with production.
- #aging #export #location #trap → L0317, L0682

## L0686 — 2026-11-11 — Before-release comparisons on production: three traps, and never commit a downloaded bundle
- **The browser's stored "location" decides the reports' default Location filter.** The QA site's own sign-in leaves `localStorage.location = "<current location id>"`, so Sales By Customer / Inventory Value / Work In Progress open on the CURRENT location there; `prod-login-boot.mjs` (API sign-in) leaves none, so production opened "All locations" — a false difference. Set `localStorage.location` to the header's location on production before comparing (pr8 proved both sides then behave the same, incl. "Select all" writing every `locationIds=` into the address).
- **Production's location list keeps the session's FIRST location ticked after a switch** (header changes, the user menu does not, even after a reload). Switching back to that location is ignored; go to a THIRD location when the test only needs "not location B" (pr6e).
- **Report CSVs are made by the server** (`GET /api/reporting/reports/<report>/export?format=csv…`), so a front-end code search cannot answer CSV questions; prove server behaviour with data. The apostrophe guard (`'-…`, `'=…`) is PRE-EXISTING: a production part described "-ZZAUTOTEST P98 apostrophe check" exports as `"'-ZZAUTOTEST P98 apostrophe check"` (pr12). Production's export refuses ranges over 366 days.
- **Inventory Value PDF size:** production printed 2,856 rows (103 pages, ~90 s); the QA site refused 3,627 rows ("This report is too large to export…") and printed 2 rows — bracket with Category filters (q6).
- **Never commit a code dump:** pr10 saved the QA site's 79 JS chunks under `exec/pr10/qa-js/` and they were pushed (removed next commit; still in history at 660143414). Dumps now go to the scratchpad. A public repo is no place for company code even without keys.
- `POST /api/parts-catalogue/add-vendor` now answers `201 {"data":[]}` — the vendor IS created; find its id with `GET /api/parts-catalogue/vendors?search=<name>`.
- #aging #production #compare #trap #csv → L0685, L0682

## L0687 — 2026-11-11 — "This report is too large to export" can be a plain server error, not a size rule
- sv11315 Inventory Value PDF: the export call (`GET /api/reporting/reports/inventory-value/export?format=pdf…`) answered **HTTP 500 after ~31 s** for 1,194 rows, and the screen showed "This report is too large to export. Narrow the date range or filters, then try again." — the app shows that message for ANY failed export, so the wording proves nothing about a limit. Production printed 2,856 rows (~90 s).
- Before calling it a size limit or a regression: record the export call's status, time and error body (`q6_ivlimit.mjs` listens for `/export?`), and bracket sizes down until one prints. A failure pinned near 30 s points at a time limit on the QA site's server, which must be ruled in or out (Rule 104) before any ticket.
- #aging #export #pdf #trap → L0686

## L0688 — 2026-11-12 — Overnight: the container restarts, the bridge dies, the build changes — check all three before posting
- **A container restart kills every background runner and the MITM bridge.** runq49 (waiting for 00:06 UTC to run s94) vanished without a log line; the scheduled check-in (send_later) survived and woke the session. For any time-of-day test, schedule the WAKE (send_later), not only a sleeping shell loop, and on waking: `source build/testing-tools/ensure_bridge.sh` first (else `net::ERR_PROXY_CONNECTION_FAILED` at the first `page.goto`), then run the test directly.
- **The QA site's build can change overnight** (sv11315: v26.45.2-6a8b89c on 11 Nov → v26.45.3-34788b2 by 12 Nov 00:30 UTC). Read the marker BEFORE posting (`exec/ver_check.mjs`: it is in the page's script names; `/api/version` says only "0.1"), pass it as `--build-marker`, and before any defect ask re-verify every held candidate on the new build (Rule 62(c)): `exec/runq60.sh` runs `rv_*` copies into `rv1112/`.
- **`apply_edits.mjs` (UI comment edit, L0475) reads the new text from `new`** — an `edits.json` with any other key saves an EMPTY comment (it did, once, on C715473; fixed by re-applying with `new`). Always read the result back after an edit: same result id, status, attachments, and the comment text.
- #testrail #environment #build #trap #overnight → L0475, L0687

## L0689 — 2026-11-12 — Before setting a time-of-day check-in, list the ones already set
- Two one-shot check-ins existed for the same late-day test (C715473): one set on 11 Nov ("Aging C715473 evening run", 00:40 UTC) and one set later (00:25 UTC). The first to fire ran the test; the second asked to run it again — running it would have posted a duplicate result (cf. L0669). Before `send_later`/`create_trigger` for a test, `list_triggers` and reuse or delete the existing one; when a fired check-in asks for work already recorded, skip it and say so.
- #scheduling #duplicates #testrail → L0669, L0688

## L0690 — 2026-11-12 — On the QA site a network failure is not the product's: the site's own "Environment Sleeping" handler takes over
- Offline, OR one request aborted as a network error while online (`route.abort('failed'|'internetdisconnected')`), on sv11315: the site shows "QA env is sleeping – Redirecting…" and moves the page to its "Environment Sleeping" screen (`rv1112/p56c_bucket_first_load/04-error.png`). Production has no such handler. A script waiting on `main` then hangs silently (g1 hung 4+ min with an empty log — every `innerText` waited its full timeout).
- To test a "fails to load" message on a QA site, fail the request on the SERVER side instead: `route.fulfill({ status: 500 })` — the aging reports then show "Something went wrong loading this report…" / "…this bucket…" / "Not every line loaded…" (g2, rv1112/p62*). What the product does on a real dropped connection can only be judged on staging/production.
- Consequence (Rule 140): drafts 04/05 (offline, no message) were NOT filed; the ten tests went Blocked "run after the release". The earlier Failed results had blamed the product for the QA site's behaviour.
- Expand a bucket with `sortlib.expand(/^Current/)` (the chevron) — clicking the bucket's text does nothing.
- Never start a second copy of a runner while one is still going (a second admin sign-in can end the first; I did it once with g1/g1b).
- Two of this lane's earlier tickets are on the team's Obsolete list (SV-12540 "not a bug: documents load 100 at a time, as S1-R8 asks"; SV-12546 product owner "OK as built"). Rule 140 now gates every ticket.
- #aging #offline #qa-site #rule140 #trap → L0317, L0687

## L0691 — 2026-11-12 — Read the existing ticket's comments before re-diagnosing: the QA PDF 30-second limit was already confirmed there
- I spent several runs (q6–q9) proving that every QA PDF dies at ~31 s; the developer had already written it on SV-12539 (comments 80813/80903, 11 Nov): "QA's PDF service … stops any PDF that takes more than 30 seconds … shared by every QA environment … The report code isn't the cause … re-test on staging". From ~800 rows up every PDF fails on QA; staging/production allow 120 s.
- Before measuring a failure that resembles an open ticket: `listJiraIssueComments` on that ticket first (Rule 140 check 5 is also where the cause is often written).
- PDF tests above ~800 rows are Blocked on QA sites ("run on staging"), never Failed.
- Parallel staging lanes: `build/aging-reports/STAGING-LANES.md` (one sign-in per lane, different users, coordinator-only TestRail/Jira writes).
- #aging #pdf #qa-site #duplicate #lanes → L0687, L0690

## L0692 — 2026-11-12 — Don't ask for a later stage's prerequisites before that stage can start
- I asked the QA lead for a staging sign-in and a staging TestRail run while the aging work was still only on the QA site (epic SV-11315 + stories in TESTING QA). His answer: "why do you want the staging related stuff at this moment when this feature is not on staging yet?" Both asks withdrawn.
- Before asking for anything for a next environment: prove the feature is THERE first (release notes / story status "on staging" / a page that only the new build has), and only then ask. Until then, keep the plan written (`STAGING-LANES.md`) and say nothing more.
- #asks #staging #timing → L0691

## L0693 — 2026-11-12 — "Works as the requirement says" means the PRD line, read live — I wrote "the requirement does not say" when it did
- C715555 (aging Vendor menu order): I passed it saying the requirement was silent on where names starting with a symbol or accented letter go. Wrong: PRD v11 (Confluence 947650561) S1-R2/S1-R3 set exactly that order ("#1 Diesel", "-1 Diesel", "10 Trucking", "@Home Towing"; accents fold, æ→ae, ø→o), and the aging menu follows it (SV-12140, QA Complete). S5-R13 separately says the menu is "exactly as Inventory Value's Vendor filter", and Inventory Value's older menu orders those six names differently — so the build meets S1 and not S5-R13's literal wording.
- Before writing "the requirement does not say" in any result: grep the saved live PRD copy for the topic words (Rule 137 amendment: find by TOPIC, not by rule id) and quote the line or quote the search that found nothing.
- A posted result comment that misstates the source is corrected IN PLACE (apply_edits.mjs, key `new`), with a dated "Correction" bullet, never by adding a second result.
- #aging #prd #sorting #result-comment → L0692

## L0694 — 2026-11-12 — sv11315: making extra locations with open invoices, the report's link form, and two runner traps
- **New location (screen):** Settings > Locations > New Location — Name, Address 1, City, State/Province, ZIP/Postal Code, Telephone required; Country defaults to Canada; Timezone America/Edmonton picked by typing "Edmonton". A yellow note says "Setting up a new location may result in additional billing." The creating admin can switch to it at once. Recipe: `build/aging-reports/exec/q10_locs.mjs newLocation()`; made "ZZAUTOTEST Q10 Loc 1"…"Loc 7" (ids in `exec/q10/out.json`), so A/R Summary lists 10 locations from 12 Nov.
- **Invoice at a new location:** switching with `/api/iam/change-location` is not enough — the page must hold the same location (`localStorage.location = "<id>"`), else `/workorders/<id>/lines` sits behind "Switch location?", Mark Reviewed is never pressed, and `/api/invoices/create` answers 400 "Work order is not complete." (q10_diag).
- **The aging reports' document link** is `/workorders/<id>/finance?locationId=<location>` (right-click the invoice number in A/R Aging Detail → Copy link address). With `?locationId=` both production (before the release) and the QA build show the existing "Switch location?" box, and Cancel gives "Switch cancelled. Returning to work orders."; an address-bar link without it gives "WorkOrder not found" on both. C715477's preconditions now name the report link.
- **TestRail editor save re-writes untouched fields' bytes:** writing only the preconditions through the UI turned the Expected's `&ldquo;`/`&middot;` into the characters and `<p></p>` into `<p><br></p>`; the rendered text is identical (playbook J, normalisation #3a). Compare Expected on rendered text, keep the before-copy, and report it.
- **Runner traps:** (1) a chain `bash -c 'while pgrep -f q10_locs.mjs …'` matches its OWN shell and never ends — wait on the PID (`kill -0 <pid>`). (2) Report chips' text starts with the icon name ("local_shipping\nVendor: …", "place\nLocation: …") — match `/Vendor:/`, never `/^Vendor/`.
- #aging #sv11315 #locations #seeding #links #testrail-editor #runner → L0693

## L0695 — 2026-11-12 — "Offline" on ShopView reports: the app does not send the request at all; how to test a failed load honestly
- **The app's data library pauses report requests while the browser is offline** (an online/offline listener in `vue-vendor.*.js`): change the as-of date with Wi-Fi off and NO request is sent, no error and no message shows; when the connection returns the report loads by itself. Production's current A/R Aging Summary and Inventory Value do the same (prod/pr17) — they show an empty "No record matches these filters" table, the new aging reports keep the previous rows. So "switch Wi-Fi off" does NOT make a load fail; it is not a defect of this release (Rule 140 check 4).
- **A failed load is made by failing the request itself**: `route.abort('internetdisconnected')` on the app's own hosts while "off", plus answering only the QA site's redirect navigation (`sleep.qa.shopview.com`) with 204 so the page stays (`exec/g8_offline.mjs`). Then all ten aging offline tests show the PRD messages exactly; a server 500 shows them with the standard notice "Ooooops! An error occurred" (rv1112/p62).
- **Instrument traps (Rule 104), each found by a request log:** (1) ANY Playwright route — even one matching only the sleep host — or a CDP `Fetch.enable` makes Chrome ignore `setOffline`: requests answered 200 while "offline". (2) Prove the drop with a fresh `fetch` probe AND the app's own request outcome; a probe failing while the app's call succeeds means the app is not asking (paused), not that the network is up.
- **The QA site's "QA env is sleeping" handler** is one QA-only branch of the axios error interceptor: on a no-response "Network Error" it toasts and redirects after a timeout, then rejects the error as usual — the report still receives it.
- **Build v26.45.3-34788b2:** `POST /api/parts-catalogue/add-vendor` answers 201 `{"data":[]}` (no vendor_id) — `seedlib.vendor()` now looks the new vendor up by exact name.
- **QA PDF timing varies:** the 614-part Inventory Value PDF printed in 23 s on 12 Nov (stopped at 30 s on 11 Nov); the 2,000-line A/P PDF still stops at 31.6 s.
- **Overpayment is refused on production too** ("Transaction cannot be overpaid.", prod/pr16 — read the payment window's own `accountId=` request to get the account): long-standing payment rule, not this release.
- #aging #offline #instrument #qa-site #rule140 #seeding → L0690, L0694

## L0696 — 2026-11-12 — The QA lead's testing-specialist session ("6. Test Tickets") is a source of testing FACTS
- QA lead, 12 Nov 2026: "If you need to learn something related to testing, you can learn from the other session which is specialized for testing called 'Test Tickets'".
- Where: session "6. Test Tickets" (`session_014ZFsNoTP2SkbapuXd4xY8v`), branch `origin/claude/heic-upload-iphone-test-sz7h5p` (latest 12 Nov: SV-12547 passed on v26.45.3-34788b2, comment 81011, label QAcomplete; SV-12540 closed Obsolete after comment 80923; SV-12405 QA Complete). Read with `git grep` / `git show` on the remote branch after `git fetch origin`; never check it out.
- Rule 119 still holds: read it for FACTS (routes, sign-ins, site quirks, ticket histories, how a check was measured), never as rules or a ticket/picture standard. Row added to `build/KNOWLEDGE-MAP.md`.
- #sessions #facts #rule119 → L0692

## L0697 — 2026-11-12 — Aging reports: stale rows appear only with NO connection; testers cut data with Chrome's request blocking; three settled items
- **q15/q15s (all six reports, every action):** on a working connection — even 5 s slow — every date / Past due / Location / customer-vendor / sort / bucket expand shows the table's loading bar (`q-linear-progress`, plus dots in an opening bucket) until the new data arrives: no wrong data. With the connection OFF, date, Past due, Location and sort changes leave the previous rows under the new choice with no sign; customer/vendor cannot be picked (its search needs the connection); a bucket opens empty. Production's current reports show an empty "No record matches these filters" table offline instead. PRD silent on offline.
- **Tester route for "a load fails":** Chrome F12 > ⋮ > More tools > Network request blocking > tick "Enable network request blocking" > + > `*reporting/reports*` > Add (= CDP `Network.setBlockedURLs`, not interception). On a QA site the message shows ~2 s after the action and the site's "QA env is sleeping" handling moves the page to "Environment Sleeping" ~5 s later (q16), so only the first steps can be judged there — run on staging. The ten offline tests' preconditions/steps now say this (case-edits-1112c; Expected untouched — its "The computer is offline/online again" lines now differ from the steps, reported).
- **Sorting in a runner:** clicking a header by text did nothing (q15 run 1, void); `sortlib.clickTh('Total'|'Amount')` works.
- **Rule 136 applied (QA lead "Do what is scientifically correct", 12 Nov):** 11 cases (C715282 C715283 C715416 C715519 C715546 C715343 C715417 C715520 C715573 C1079009 C1095436) lost their "What you should see today… known problem" paragraph and `EXPECT FAIL` marker after SV-12138/39/40/41/44/47 passed QA (case-edits-1112b, BEFORE snapshot kept; quoted sources untouched). The L0565 "not on production" question was weighed: the whole feature is unreleased and the fixes ship with it, so the markers were simply false.
- **C715555 vendor order settled:** S5-R13 lists what is copied from Inventory Value (icon, "Search vendors", box above 8, the rows) and says nothing about name order; S1-R2/R3 is the only name-order rule → Passed stands (comment edited in place).
- **Commit 660143414 (QA front-end code) — no history rewrite:** the repo's scanner finds only the Sentry library's "%filtered%" placeholder for passwords; no keys/tokens; the code becomes public with the release (production's front end is served to anyone; the QA copy answers 403 without sign-in); a rewrite would not purge GitHub's cached commits or existing clones.
- #aging #offline #devtools #rule136 #rule140 #history → L0695, L0696

## L0698 — 2026-11-12 — `scan_secrets.py --staged | tail -1 && git commit` does NOT gate the commit
- The pipe's exit status is tail's (0), so a FAILED scan still let commit 712fcad5f through (its one finding was a quoted library placeholder in a learning note, reworded in 448ac15f1; no secret). Gate on the scanner itself: `python3 build/testing-tools/scan_secrets.py --staged > <file>; rc=$?; [ $rc -eq 0 ] && git commit …` (or `set -o pipefail`).
- #secrets #git #gate → L0697

## L0699 — 2026-11-12 — The QA lead's empty organization on sv11315: sign-in, bulk seeding at 2,000 customers, and two facts it proved
- **Org:** account `bilal.muzamil+reportsFM` (password + QA gate values in `/tmp/qa-cookies/sv11315-reportsFM.json`, chmod 600, never committed), one location "Loc1" (time zone Africa/Abidjan = UTC), category "Uncategorized" `20140573-…`, tax "Exempt" `45b970d3-…`. Sign-in with email + password: `build/aging-reports/exec/orgboot.mjs`; any runner via `ORG_LOGIN=1` (lib.start uses it and skips the Heavy Duty reset). The quick-login buttons open the MAIN test org, not this one.
- **Seeded (keep):** "ZZORG Vendor A" (bills ZZORG-BILL-A1 12:00 UTC and -A2 06:00 UTC today); 2,000 customers with a $1.00 credit memo dated 10 Nov ("ZZORG C0001…C2000" minus 5 failed + "ZZORG D0020…D0024") and "ZZORG C2001 Late" dated 11 Nov → A/R Summary 2,000 (11/10) / 2,001 (11/11). D0001–D0019 exist with no documents.
- **Bulk route:** customers/create → customers/view (`data.customer_account_id` OR `data.company.customer_account_id` — reading only the first gave 19 × 400) → credit-memos; 10 at a time in the page ≈ 2.6 customers/s (2,001 in ~13 min); ~0.3 % "Failed to fetch" (one still got its memo) → always read the count back from the report and top up one at a time (`q17_orgseed.mjs`, `q17b_topup.mjs`).
- **A document stamped later today is not in "as of today" until that time** (bill at 12:00 UTC invisible at 10:00 UTC) — stamp seeds early in the day.
- **Facts proved:** with 8 vendors or fewer the native Vendor menu (Inventory Value's, A/P Detail's, A/P Unpaid's, A/P Summary's) has NO search box AND NO "All vendors" row — it starts with "All vendors are included. Pick one or more to narrow." (C797943 Passed on PRD S5-R13 "exactly as Inventory Value's"; the case's "All vendors row" wording reported). A 2,000-row A/R Summary PDF prints in ~20 s on the QA site (under its 30 s limit, unlike 2,000 detail lines); 2,001 is refused at once (C715468 Passed).
- #aging #org #seeding #sv11315 #pdf → L0694, L0697

## L0700 — 2026-11-12 — The five "cannot be set up" aging tests: what each protects, and the last overpay route ruled out
- **No screen can make an overpaid invoice:** payments refuse it (L0641, q13, production pr16); on a FULLY PAID invoice the Finance tab's invoice menu (`button_wo_invoice_menu`) offers Reverse · Issue Credit, and Issue Credit is a parts-return dialog (Credit Date, Outcome "Issue Store Credit"/"Issue Refund", Payment Method, Reason, "Parts to return — No parts on this invoice are available for credit.") whose "Issue Refund" stays disabled for a labour-only invoice (q19, S11315-17913 paid $100 first). Reverse undoes the invoice. The 16 overpaid production invoices (PRD v11) are older data.
- **Facts from session "5. V1 vs V2" (INVARIANT-REGISTER.md, facts only):** INV-036 (C1078998) V2 ages a no-due-date invoice from its own date, not the credit term — "POSSIBLY LOST", PO question PO-2; the developer's note says no open production invoice lacks a due date (21 Oct). INV-037 (C1078999) and INV-039 (C1079000): V2 keeps V1's rule (`due_date IS NOT NULL`, `open_cents <> 0`). INV-038/055 (C715462, C1095432 duplicate): the PRD-announced Totals change, 16 invoices / 13 accounts in production.
- #aging #overpaid #retire #invariants → L0699

## L0701 — 2026-11-12 — Aging suite folders: which "after release" folder is ours, and the dashboard's area names
- The aging suite group is section **90418**. Its release folders are **133628 "Run on Staging After the Feature Is Deployed"** (C715471, C715472, C715475 …) and **90429 "Release day and what must not change"** (now also C715462, a production-after-release check). **133625 "Run on Production After Release" belongs to "Bill To" (parent 132467) — not aging**, though the 11 Nov dashboard file used that name for aging tests (stale folder name).
- Retired folder **134653** now holds C715277 C715279 (11 Nov) + C1078998 C1078999 C1079000 C1095432 (12 Nov), reasons in its description; removal from run 557 via `update_run {case_ids: live list minus the retired}`, read back (470 → 466). Recipe and evidence: `exec/retire-1078998-1078999-1079000-1095432.json`.
- Dashboard data must take each test's area from its CURRENT folder (`get_section` of the case's `section_id`), not from the previous file. The QA lead asked that the dashboard not mention retired tests.
- #aging #testrail #folders #dashboard → L0624, L0700

## L0702 — 2026-11-12 — Staging after the aging release: the QA lead's own session without signing in, how to compare "same as before", and the day-count split
- **Staging with the QA lead's cookies only (never a sign-in):** `aging-reports/staging/stglib.mjs` adds the three cookies from `/tmp/qa-cookies/staging-full.json` to app + api hosts, hydrates `localStorage` (user from `view-profile`, `my-workplaces`, `fe-permissions`), BLOCKS login/logout/quick-login/change-location (a new sign-in would end his session), and now opens the browser in **Asia/Karachi** (Rule 125; `BROWSER_TZ` overrides). Read-only GETs go through `ctx.request` with Origin/Referer of the app.
- **"Same rows and amounts as before the release" done properly:** page every report's own data call (Detail buckets `…/buckets/<b>/rows`, 100 a page; Summaries; Collection/Unpaid groups 30 a page), match document by document with the before copy (A/R key = number + customer; A/P key = document id), and sort every difference: intended (credit dated on the as-of date → Current) · new (customer/vendor absent before, or dated after the copy) · gone · balance · bucket. Then require untouched customers/vendors identical column by column (262 + 471 were). `s1_compare.mjs` + `s1_classify.py`.
- **Finding (C715471/C715472 Failed, ticket held `tickets-held/02-…`):** the new aging counts each document's day in the **signed-in location's time zone** (16,457/16,457 documents' Past Due = as-of minus the due date's day in Asia/Karachi) but SHOWS Date/Due Date as the **Greenwich day** (S2-17154 "Oct 12", CM3-4400 "Sep 22", CM1-4535 "Oct 28" — each the UTC day, not its location's, with the browser proved on Asia/Karachi). The old report used the Greenwich day for both (14,662/14,663 A/P Past Due = whole days from the due time to 23:59:59.999 UTC of the as-of date, cut toward zero). Our 10 Nov SV-11441 pass checked the COUNT only, on a single-zone QA site; it never set the shown Due Date beside the Past Due.
- **Trap:** a headless browser defaults to UTC, so dates on screen can differ from what the QA lead sees — always open in his zone and prove it (`Intl.DateTimeFormat().resolvedOptions().timeZone`).
- **Trap (push tool, fixed):** a held ticket's line that links the OWNING STORY made `push_results_to_run.py` prefix the titles with the story keys and post a "Follow the status here" comment for the story. A `ticket_held` result now gets neither (Rule 133). The two titles were restored the same minute.
- **Staging PDF limit is long enough:** A/P Detail PDF of exactly 2,000 lines downloaded in ~70 s (84 pages); 2,001 refused with the one message. The QA site's shared PDF service stops at 30 s (SV-12539 developer note) — PDF size tests belong on staging.
- `new URL('./x y.tsv', import.meta.url).pathname` is percent-encoded — wrap it in `decodeURIComponent` before `fs.readFileSync`.
- #aging #staging #time-zone #past-due #compare #push-tool → L0697, L0699, L0701

## L0703 — 2026-11-12 — A QA site is DESTROYED once its feature is deployed to staging (QA lead: "Remember that always"); SV-12663 filed; where the aging day count takes its time zone from
- **QA lead, 12 Nov 2026 (verbatim): "The QA environment gets auto destroyed once the feature gets deployed on staging. -> Remember that always."** So once a feature is on staging, never plan work on, or ask for a sign-in to, its QA site (`sv<ticket>.qa.shopview.com`): it no longer exists. A "QA sign-in expired" / "no Admin button" there after the staging deploy means the site is gone, not that the session needs renewing. All later checks for that feature run on staging (then production after release).
- **Where the aging day count takes its zone from (staging v26.45.4):** NOT the location being viewed — the app sends `x-location-id` from `localStorage.location`, and viewing from Lethbridge (Edmonton) with the browser on Edmonton still counted CM3-4400 on the Pakistan day (Past Due 51, s8). The profile has no zone field (s9). It follows the SESSION's location (set by `POST /api/iam/change-location {workplace_id, workplace_timezone}`). Switching the QA lead's staging session to observe a Mountain-time count was refused by the permission system — do not try other routes; record it as an open gap.
- **SV-12663 FILED** on the QA lead's "A, file it if this is a genuine defect" (https://shopview.atlassian.net/browse/SV-12663, Open; Story Defect, parent SV-11531, Medium, labels AP-AR-FM + QA_Found, Relates SV-11531 + SV-11441; 2 inline pictures full width). Rule 140: PRD v12 (Milos Vasic, 12 Nov) re-read — S1-R5a and the "exactly today's numbers" sentence unchanged, no time-zone text; the screen contradicts its own Due Date, so it cannot be "not a bug".
- **Push tool, second fix:** title prefixes now take only keys that are LINKED in the ticket line (`browse/SV-n`); a story merely named there ("under SV-11531") no longer lands in the title.
- C715462 (production-only overpaid Totals) was re-run on staging build v26.45.4-d07623f and PASSED by another session at ~13:30 UTC with a seeded overpaid invoice (S-40181, $100 with $120 paid) — so staging can hold an overpaid invoice; staging's build moved on after my b8c04e2 run.
- #qa-site #staging #aging #time-zone #ticket #push-tool → L0702

## L0704 — 2026-11-12 — Never write a clock time from memory: read `date -u` first
- I stamped the aging dashboard "16:15 UTC" and my notes "~16:00/~16:05 UTC" when the real time was 15:24–15:30 (ticket SV-12663 created 15:24 UTC; commit 15:30 UTC) — the dashboard showed a snapshot time in the future. Fixed to the real times (dashboard page v15, README, PROJECT-STATE, FIELDS.json), each correction marked in place.
- **Rule for every stamp (dashboard, result comment, notes, ticket):** run `date -u +%H:%M` (or take the time from the system you wrote to — commit time, Jira `created`, TestRail `created_on`) immediately before writing it. A remembered or estimated time is not a time.
- #time #stamps #dashboard → L0703

## L0705 — 2026-11-12 — Mudassir's "Possible Gaps (PRD v11)" sheet was answered by Milos in PRD v12: what it changes for our run-557 tests
- Source: Slack https://shopview.slack.com/archives/C0C454MLP0T/p1794489893034679 (Mudassir → Milos, "Open questions on the A/R & A/P aging reports"; Milos: "answered in PRD") + Google Doc "A/R & A/P Aging – Possible Gaps (PRD v11)" (7 questions). PRD v12 change-log row 2026-11-12, Milos Vasic, saved `aging-reports/sources/prd-947650561-v12-read-1112.md`.
- Answers: Q1 2,000-row PDF limit stays "pending a timing check on staging (SV-12539)" — our C715469 on staging IS that check (2,000 lines in ~70 s, 84 pages; 2,001 refused). Q2 S3-R7b "Total for <name>", never "Subtotal" (no test of ours expects "Subtotal"). Q3 S1-R8 rows may arrive in one request, only how many SHOW at a time is set (C1062570/C1062571/C1095446 Passed, compatible). Q4 S5-E3 one location left → chip hidden (C1062585 compatible). Q5 S8-R3 exception: on A/P Unpaid a very long vendor name (78 chars still fit) may scroll sideways, as today (C715496/C715544 use >40-char names and passed; their quoted v11 sentence lacks the new exception — wording only). Q6 S4-R1 header chevron BLUE — **C715534's Expected still says "A grey chevron"; staging v26.45.4 measures the header chevron rgb(34,118,218) = the bucket chevrons (s11_chevron.mjs)** → the CASE now disagrees with the source; Expected is not edited without the QA lead naming it (114(c)). Q7 S1-R4 unchanged; C715277/C715279 already retired.
- Script: `aging-reports/v12_impact.py` (run-557 tests touching changed rules, live).
- #aging #prd-v12 #po-answers #chevron → L0703, L0704

## L0706 — 2026-11-12 — QA lead: comment only on tickets WE created; a PRD-decided design change is passed, not failed
- **"Do not post anything if that is not related to the ticket created by us/bilal Muzamil/you. But tell me if it is failing any test case run"** (12 Nov, about SV-12539, Mudassir's ticket): never comment on another person's ticket, even with useful evidence; instead report whether it fails any test in our runs (search every run-557 test's results for the key, plus open runs whose names match the suite).
- **"keep the test passed if this is just a minor design issue. So that when the test is rerun in the future after this issue is fixed as per milos answer the test does not fail"**: when the PRD settles a design difference (C715534 chevron grey→blue), change the named case's line to the PRD's sentence (114(c)), re-run the WHOLE case, keep it Passed with pictures.
- #rulings #tickets #design → L0705

## L0707 — 2026-11-12 — Story status moves on the aging epic: Merged to Staging has no "QA Complete" move; the QA lead changed statuses himself
- From **Merged to Staging** Jira offers only Board Backlog, Blocked, OBSOLETE, Done and "Start testing in Staging" (TESTING STAGE) (`GET /rest/api/2/issue/<KEY>/transitions`, SV-11531, 12 Nov). QA Complete is an earlier stage.
- Story check recipe ("no ticket pending on developers or QA"): `parent in (<stories>)` for Story Defects + each story's `issuelinks` with live statuses. 12 Nov: clean = SV-11532, SV-11534, SV-11536, SV-11537, SV-11538, SV-11539; pending = SV-11531 (SV-12663), SV-11533 (SV-12539), SV-11535 (SV-12545); epic-level SV-12538 Open (not linked to a story).
- QA lead then made the status changes manually: "I have manually made the changes, you need not to change anything" — do not move these stories.
- #jira #workflow #aging → L0706

## L0708 — 2026-11-13 — Demo Day findings on the aging reports were filed by Mudassir, not us: why we missed them
- Slack https://shopview.slack.com/archives/C0C454MLP0T/p1794593840375719 (Chris Ward after Demo Day): #1 long customer name wrap in the filter; #2/#3 tables jump on expand/collapse. Mudassir filed SV-12722 (filter menu, Ready to Fix), SV-12763 (columns shift on expand/collapse, Open), SV-12764 (A/R Collection, unbroken name pushes Past Due/Amount off screen, Open), all 13 Nov.
- **Column shift:** we knew it — the epic's developer notes list it under "Kept by the developer" ("A/R Detail's columns shift about 34 px sideways when you click Expand all"), so a ticket would have failed Rule 140 (accepted as built). Chris has now asked for it; that decision was his, not ours to pre-empt — **when the developer keeps a visible oddity, mention it to the QA lead as a "kept, not filed" item rather than staying silent.**
- **Long names:** our layout tests used long names WITH spaces (they wrap correctly); a name with NO spaces (staging's "ZZBREAK … Superlongunbroken…" customer) was never in our set — a coverage gap. Layout/overflow tests must include one unbroken long name.
- None of our run-557 tests fails on these tickets.
- #aging #demo-day #coverage-gap #missed → L0706, L0707

## L0709 — 2026-11-13 — The "columns shift on Expand all" note was the DEVELOPER's, in QA handoff comments — not the PRD, not Product
- Where it is (read live 13 Nov): Nemanja Djuric's QA handoff comments of 10 Nov — SV-11315 comment 80616 under "KNOWN MISMATCHES AND KNOWN GAPS (not bugs — do not file)" → sub-heading "*Kept by the developer*" (a separate list from "*Decided by Product (Chris, 2026-11-04 / 2026-11-05)*"); also SV-11534 comment 80620, SV-11538 comment 80637 and SV-11598 comment 80635 under "Known mismatches (not bugs)". PRD v12 says nothing about columns staying put or moving.
- Correction to L0708: "kept by the developer" is NOT product acceptance. Rule 140 check 2 ("not accepted as built") means accepted by Product (PO / PRD / QA lead), and a developer's handoff is facts only (Rules 57, 111, 119). With the PRD silent, the right move was a question to the QA lead / PO (Rule 58), not silence.
- #aging #handoff #rule140 #correction → L0708

## L0710 — 2026-11-13 — PRD v13 (Chris Ward, 13 Nov 14:36 UTC): S5-R10b future as-of date — backs SV-12545 and our two failing tests
- v13 change-log row: "S5-R10b added: any as-of date can be picked, including a day after today, as on production; a later day is aged to that day and the exports print it; a link with an as-of date opens on it." Source: SV-12545 (Bilal; QA sheet question 19). So C1078980/C1078981 stay correctly Failed on SV-12545 (Ready to Fix). Saved `aging-reports/sources/prd-947650561-v13-read-1113.md`.
- v13 still has no sentence about columns moving or staying put on expand/collapse (searched shift/jump/column width/stay); the only "kept" wording is the developer's handoff (L0709).
- PRD link: https://shopview.atlassian.net/wiki/pages/viewpage.action?pageId=947650561
- #aging #prd-v13 #sv-12545 → L0709

## L0711 — 2026-11-13 — QA lead: "you must not make the same mistakes which stopped you from reporting these tickets, it was an embarrassing mistake"
- The mistake (Demo Day, SV-12763/SV-12764 found by Chris and filed by Mudassir): I treated a DEVELOPER'S handoff note ("Kept by the developer" / "Known mismatches (not bugs — do not file)") as if the product had accepted it, and so neither filed nor raised the visible column jump; and our layout tests never used a long name with NO spaces.
- **Standing checks from now on, every suite:**
  1. A developer's "kept", "known mismatch", "not a bug", "do not file" note is a FACT, never acceptance (Rules 57, 111, 119). Acceptance comes only from the PRD, the PO/Product, or the QA lead. For each such item: if the PRD covers it → judge it as a test; if the PRD is silent → put it to the QA lead as a question (with my recommendation) the same day. Never stay silent on a visible oddity.
  2. Every layout/overflow test includes one long value with NO spaces (names, numbers, locations), as well as one long value with spaces.
  3. Before calling a suite done, list every "kept by the developer" item from the handoffs and say what was decided for each.
- #mistake #handoff #layout #rule140 #must-not-repeat → L0708, L0709

## L0712 — 2026-11-14 — 22 new aging tests for staging; the QA lead's staging session lasts about 2 days; finding "new" tests in a run
- Run 557 grew 467 → 489: 22 Untested tests whose cases were created 14 Nov 03:50–05:24 UTC (Demo Day follow-ups: columns stay put SV-12763, long no-space names SV-12722/SV-12764, PDF "Total for", future as-of exports SV-12545, one-location chip, blank cell sort). Find them with `get_tests` (paged) filtered to Untested/Retest, then `get_case` + `get_section` — list in `aging-reports/new-tests-1114.json`, plan in `aging-reports/staging/PREP-NEW-TESTS-2026-11-14.md`.
- The QA lead's staging cookies (sso, PHPSESSID, cf_clearance) given 12 Nov answered 401 on 14 Nov (`stglib` throws "staging session not valid: profile 401"). Expect to ask for a fresh set (Rule 138: https://app.staging.shopview.com) when a staging pass starts more than ~1 day after the last one; ask at the START of prep, not after the scripts are written.
- Staging and sv11315 share workplace ids (Heavy Duty b3c8c820…, Lethbridge f8a8b802…) because the QA site was cloned from staging data — seedlib's ids are worth trying on staging first.
- #aging #staging #session #new-tests → L0711
