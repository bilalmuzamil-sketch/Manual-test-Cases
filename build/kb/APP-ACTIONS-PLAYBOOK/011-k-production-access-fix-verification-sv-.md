## K. PRODUCTION access & fix-verification (SV-8721, proven 2026-07-29)
One indexed block for verifying a bug fix on PRODUCTION (`app.shopview.com` / `api.shopview.com`).
Terse entries; where the full detail already lives elsewhere in this playbook, this points there
(consolidated, not duplicated). All proven live 2026-07-27→29 on the SV-8721 5-decimal side project.
- **PROD login & session:** `POST /api/login {username, password}` → 200 + fresh `PHPSESSID`
  (PHPSESSID-only — NO SSO cookie on prod; quick-login 500s). **GOTCHA: a fresh login EXPIRES the
  same user's prior PHPSESSID** (old session → 409 "Session has expired") — log in ONCE per run,
  reuse for API + browser + cleanup. `cf_clearance` NOT needed via the agent proxy. Full entry: §A
  "PRODUCTION access". *(proven 2026-07-29)*
- **PROD browser automation:** boot2-style Chromium hydration works on prod — `PHPSESSID` cookie on
  `.shopview.com` + localStorage `user` = `{data:<login-response data>}` + `fe_permissions_wrapper`
  (+ `token`); Playwright. Full entry: §A. *(proven 2026-07-29)*
  **🔴 CORRECTION 2026-09-03:** Chromium can **no longer** TLS straight through `$HTTPS_PROXY` on prod —
  every navigation returns `net::ERR_CONNECTION_RESET`, exactly as on QA/staging. **The local MITM
  bridge is now REQUIRED** (`build/atlassian-login/bridge.mjs`; port in `/tmp/atlassian/bridge-port.txt`,
  rotates — never hard-code). Point Chromium at `http://127.0.0.1:<bridgePort>`. The rest of the recipe
  (login → fe-permissions → hydrate localStorage) is unchanged. Re-proven 2026-09-03 verifying C30354
  on `/reports/parts-velocity`.
- **PROD test org / workplace:** org `72b2cc90-6964-4429-a207-76e55f946936`; seed WOs in
  **"Trucks Hill 2" `b617914c-16e9-4485-8e8b-193cd86aa416`** (HAS canned lines; "QA Testing"
  `8badadec-…` has none). Full entry: §A. *(proven 2026-07-29)*
- **PROD API difference — WO line create:** `POST /api/work-orders/lines/create` → 400 "Labor or
  fixed prices must be set" even with a canned line → use
  **`POST /api/work-orders/{id}/lines/create-from-canned-line {canned_line_id, status:'authorized'}`
  → 201**. Full entry: §D. *(proven 2026-07-29)*
- **Node fetch proxy fix (this sandbox):** plain node `fetch` BYPASSES the egress proxy (403 "Host
  not in allowlist" while `curl` works) → run node with **`NODE_USE_ENV_PROXY=1`** (Node 22.22+,
  undici EnvHttpProxyAgent); confirm reachability with `curl` via `$HTTPS_PROXY` first. Full entry:
  §A. *(proven 2026-07-29)*
- **5-DECIMAL FIX-VERIFICATION RECIPE (works on staging AND prod, end-to-end):**
  (1) seed a throwaway WO (`work-orders/create`, §C; on prod use Trucks Hill 2) + a line
  (`create-from-canned-line`, §D);
  (2) add parts via `part/make-request` (§E) with **precision-stressing costs** — the customer trio
  `0.240 / 0.027 / 0.089` + a 4-decimal `45.6789` + a 5-decimal `124.96545`;
  (3) order them (`perform-request-status-action {action:'order'}`);
  (4) open the Receive screen `/order/{orderId}?receive=1&returnTo=WorkOrder&returnId={woId}` (§E);
  (5) check on-screen 5dp costs + line totals + Subtotal, AND the order-detail
  `GET /api/inventory/orders/{id}` **`price_decimal` / `total_cost_decimal` / `total_price_decimal`**
  fields vs the legacy rounded `price`/`total_price` (§E);
  (6) **Tax on the Receive screen = a manual dollar field** (defaults from the workplace tax rate —
  $0.00 on a 0%-rate org); typing a value live-recalculates Total = Subtotal + Tax (verified
  15.32 + 0.77 → 16.09);
  (7) clean up: `work-orders/delete` (§C — deleting the WO also removes its un-received PO).
  *(proven on staging 2026-07-27 + prod 2026-07-29, SV-8721)*
- **Jira evidence method (inline screenshots + editable comment):** attach PNGs to the issue first —
  `POST /rest/api/3/issue/{KEY}/attachments` with header `X-Atlassian-Token: no-check` (multipart
  `file=@…`) → then reference each as `!filename.png!` (optionally `|width=853`) in a **v2
  wiki-markup comment** (`POST /rest/api/2/issue/{KEY}/comment {"body":"<wiki markup>"}`) → renders
  inline. **Comments are editable in place:** `PUT /rest/api/2/issue/{KEY}/comment/{id}` with the
  full new body → 200; always re-GET to verify the text + `!refs!`. **Before/after evidence:** pull
  the ticket's ORIGINAL attachments for the "before" side instead of re-reproducing the bug.
  *(proven 2026-07-29, SV-8721 comment 74275)*
- **TestRail import gotcha (angle brackets):** `<placeholders>` get swallowed as HTML — full entry:
  §J. *(proven 2026-07-29)*
- **⚠️ TestRail `refs` (References) field — TWO hard gotchas, both cost a failed push:**
  **(1) MAX LENGTH 250 CHARACTERS.** Over it, `add_case`/`update_case` returns **HTTP 400
  `{"error":"Field :refs does not match the required pattern."}`** — a misleading message that
  looks like a charset problem but is purely length. Keep refs **≤240 chars** for margin; when a
  Rule-20 ref won't fit, trim it and move the overflow detail into the case's internal `notes`
  (never drop the ticket half or the spec anchor). **(2) TestRail NORMALIZES `refs` as a
  comma-separated reference list and STRIPS THE SPACE AFTER EVERY COMMA** — so a re-GET
  verification of a refs string containing `", "` will FALSELY MISMATCH (content identical,
  spacing only). **Write refs COMMA-FREE**: use `;` and ` + ` as separators. Check both before a
  batch push — `assert len(refs) <= 240 and "," not in refs` — rather than discovering them
  mid-run. Also: **`update_case` does NOT move a case between sections** — use
  `POST move_cases_to_section/{section_id}` with `{"suite_id":1,"case_ids":[...]}` and verify with
  a re-GET of `section_id`. And **`tr.paged` helpers must join the 2nd query param with `&`, not
  `?`** (`get_tests/352?` → HTTP 400 *"Invalid characters in URI"*).
  *(both refs gotchas proven on the Filters push 2026-07-31: the comma one on the morning pass,
  the 250-char one mid-run on FLT-PARTS-13 at 298 chars)*
  **SHARPENED (Report Suite push 2026-07-30): the boundary is EXCLUSIVE — a refs string of
  EXACTLY 250 chars is REJECTED (SBR-NAV-01 / C30195, HTTP 400), while 243 chars pushes fine
  (IV-EXP-02 / C30588). So the real ceiling is ≤249; the "≤240 for margin" rule above is the one
  to assert on, and asserting `<= 250` is NOT safe.**

