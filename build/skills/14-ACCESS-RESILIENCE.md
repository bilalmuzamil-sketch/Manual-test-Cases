# 14 · ACCESS RESILIENCE — keep a working path to every source, and never corrupt a connector

> **🔴 READ [`00-COMMON-CORE.md`](00-COMMON-CORE.md) FIRST.** This file is the operator form of
> **Standing Rule 89**. It exists because of a real failure: in one session the **MCP connections
> broke, could not be reconnected, and the work only finished because workarounds were used**. Every
> session must (a) know the workaround for every system, and (b) **never leave a connector in a worse
> state than it found it.**

**Rule 89, QA-lead directive (2026-08-21, verbatim):** *"all the sessions will have to run unattended,
and they would need access to Jira/testrail/Shopview QA and Staging and Production environment and
other sources like Figma etc, it happene din this session that the MCP connection were broken and we
could not again reconnect and we had to use the workarounds, make sure that the other sessions remains
capable of using workarounds to connect to Jira/figma/Testrail and Shopview environments etc but at
the same time the MC connector method never goes corrupt in those sessions for any connection."*

**The two halves, and they are equally binding:**
1. **NEVER BE BLOCKED** — every system has a PRIMARY path and a FALLBACK ladder. If the primary dies,
   drop down the ladder and carry on.
2. **NEVER CORRUPT THE CONNECTOR** — no session may edit, delete or "repair" shared MCP configuration
   to fix a connection. A mutated config outlives your session and breaks every future one.

---

## 0 · SESSION-START PREFLIGHT (mandatory — do this before the work, not when it fails)

**Run the preflight for EVERY system you will need, at session start, and RECORD the result.** It is
cheap, it is one command per system, and it converts a mid-run surprise into a known starting
condition. Record the outcomes in the session's findings file (a table: system · path used · verdict ·
timestamp UTC).

| System | Preflight (one call) | PASS looks like |
|---|---|---|
| TestRail | `get_case` on a known case id | HTTP 200 with the case body |
| Jira | fetch a known issue key | HTTP 200, fields present |
| Confluence | fetch a known page id | HTTP 200, version number present |
| ShopView QA / staging / prod | `GET /index.html` | HTTP 200 + `<meta name="app-version">` captured |
| Figma | `/v1/files/<key>/nodes?ids=<one node>` | HTTP 200 with node JSON |
| Slack / Gmail / Drive / Calendar / Fireflies | list/search one item | any 200 — **absence is not a fault** |
| **Secret scanner (FULL mode)** | `python3 build/testing-tools/make_secret_fingerprints.py` | *"wrote N fingerprints to /tmp/secret-fingerprints.json"* |

**RUN `make_secret_fingerprints.py` AT SESSION START so the scanner runs in FULL mode.** Without
`/tmp/secret-fingerprints.json` the scanner matches **structural patterns only** — *"this looks like a
64-hex session cookie"* — and says so on every run: *"no /tmp/secret-fingerprints.json; structural
patterns only"*. With it, the scanner also matches the **SHA-256 of the actual credentials we hold**,
which is the only thing that catches a secret with no recognisable shape — a short password, a
hand-typed key. Proven, not asserted: the tool's `--selftest` plants a deliberately boring fake
password, and structural-only mode **misses it** while full mode **flags it**.

**The file lives in `/tmp` and is NEVER committed.** A SHA-256 of a short or weak secret is
brute-forceable offline, so even the hashes must stay out of this PUBLIC repo — the tool **refuses any
output path outside `/tmp`**, and `secret-fingerprints.json` is in `.gitignore` as a second guard.
**`/tmp` is ephemeral, so this is a per-container step: re-run it in every fresh session**, and re-run
it after the QA lead supplies new cookies (new credentials mean new fingerprints). If no credential
files exist in `/tmp` yet, the tool says so plainly and the scanner stays in structural-only mode —
that is the honest outcome, not a failure to work around.

**If a preflight FAILS:** do not retry-loop. Drop to the fallback ladder for that system. If the whole
ladder is exhausted, follow **§7 the unattended BLOCKED protocol** — and keep working on everything
that does not need that system.

---

## 1 · TESTRAIL — the most reliable path we have, and it needs no MCP

**PRIMARY — the REST API v2 with Basic auth.** No MCP server is involved, which is exactly why this is
the sturdiest access we own. Base `https://shopview.testrail.io/index.php?/api/v2`; **project 1, single
suite 1 ("Master")**. Credentials come from `/tmp` (never committed, never pasted into a log).
Reusable clients already exist — **use them, do not rewrite them (Rule 27):**
`build/testing-tools/tr_client.py`, `build/testing-tools/testrail-api.mjs`,
`build/testing-tools/testrail_add_case.py`.

**FALLBACK — the TestRail WEB UI driven by Playwright**, for the few things the API cannot do. The
known one: a case whose text TestRail stores as raw HTML is re-rendered to plain text only by opening
the case in the UI, typing a trivial edit (a single `.`) and saving — the API cannot trigger that
pipeline. Use the same MITM-bridge mechanics as §3.

**PREFLIGHT:** `get_case` on a known id returns HTTP 200.

**FAILURE SIGNATURES:** HTTP 401 ⇒ credentials wrong or expired (re-supply from `/tmp`). HTTP 403 ⇒
the account lacks that operation (e.g. `get_users` is admin-only for us — use `get_user/{id}`).
HTTP 429 ⇒ back off; do not hammer.

**KNOWN TRAPS — these are how sessions damage data by accident (full detail:
`build/APP-ACTIONS-PLAYBOOK.md` §J):**
- 🔴 **CORRECTED 2026-08-26 — IT IS THE OTHER WAY ROUND. SEND ONLY THE FIELDS YOU ARE CHANGING.**
  Proved on a throwaway case, both directions, byte-compared (`APP-ACTIONS-PLAYBOOK.md` §J,
  "CORRECTION, 2026-08-26"): **a field you OMIT is preserved BYTE-IDENTICAL; a field you SEND is put
  through the HTML pipeline and re-rendered** (wrapped in `<p>…</p>`, `—`→`&mdash;`, trailing `\n`).
  Sending an unchanged field "for safety" is the *only* way to damage it.
  **Before any text-field write, check the case's render container** on a logged-in UI session at
  `index.php?/cases/view/<id>`: `<div class="markdown fr-view">` = safe (value emitted raw); plain
  `<div class="markdown">` = **DO NOT WRITE via the API** — the wrapper is escaped and the tester
  literally reads `<p>`. 72 Report Suite cases are in that state from the 2026-08-26 writes.
  *(Superseded text, kept per Rules 32/33: "`update_case` RE-RENDERS ANY TEXT FIELD YOU OMIT FROM THE
  PAYLOAD through its HTML pipeline (wraps in `<p>`, converts `\n` to `\r\n`). ALWAYS send all four:
  `custom_preconds`, `custom_steps`, `custom_expected`, `refs`. A field sent explicitly is stored
  verbatim." — the first half is unreproducible and the instruction is now the wrong thing to do; the
  final sentence was already corrected on 2026-08-25.)*
  **⇒ SAY IT AS ONE RULE (recorded 2026-08-26): `update_case` RE-RENDERS ANY FIELD YOU SEND AND
  PRESERVES ANY FIELD YOU OMIT — SEND ONLY THE FIELD YOU ACTUALLY NEED TO CHANGE. Whether the
  re-render is VISIBLE depends on a per-case container flag (`markdown` escapes and shows literal
  tags; `markdown fr-view` renders correctly) which `get_case` DOES NOT EXPOSE. So NEVER bulk-write
  plain text via the API, and where a case's body must change and its container is unknown, PREFER
  THE UI EDITOR.** On 2026-08-26 this damaged 72 cases.
- **🖥️ THE UI EDITOR ROUTE NEEDS PLAYWRIGHT, AND PLAYWRIGHT NEEDS THE LOCAL MITM BRIDGE (proven
  2026-08-26).** Chromium **cannot TLS through the egress proxy directly**: every navigation returns
  `net::ERR_CONNECTION_RESET` (with `proxy:`, with `--proxy-server`, and with no proxy at all) while
  `curl` through the same proxy returns 200. **Start a FRESH `build/atlassian-login/bridge.mjs` per run
  — the port rotates and is written to `/tmp/atlassian/bridge-port.txt`** (`build/ATLASSIAN-JIRA-ACCESS-METHOD.md`
  §1) — then launch chromium with `proxy: { server: 'http://127.0.0.1:<port>' }` and
  `ignoreHTTPSErrors` on the context only. **Import playwright as
  `/opt/node22/lib/node_modules/playwright/index.js` (or `index.mjs`); a bare `import 'playwright'`
  fails outside `/opt/node22`.** **Never disable TLS verification and never unset `HTTPS_PROXY`.**
  In the editor, **PASTE with `keyboard.insertText` — never re-type**, which introduces curly
  apostrophes. Working script: `build/report-suite/damage-2026-08-26/ui_repair_batch.mjs`.
- **`refs` normalisation:** TestRail splits on commas, trims each entry and rejoins with a bare comma,
  and **rejects any single entry over 248 characters** with HTTP 400 *"Field :refs does not match the
  required pattern."* — a **pattern** error, not a length error. House style: one comma-free entry
  ≤ 248 chars. Verify under `','.join(p.strip() for p in s.split(','))`.
- **`get_sections` NEEDS PAGING.** 625 sections exist; an unpaged call returns 250 and **silently finds
  ZERO** of a project's sections. Page it, always.
- **`add_case` MUST SEND** `custom_atmstatus: 1` (= "Not Automated") + `custom_automation_type: 0`.
  **NEVER `3`** — `3` is *Automated*, Vladimir Tomovic's own flag, and a case born `3` corrupts the
  Rule-65 tell-Vlad signal. (Corrected 2026-08-21; this line previously said `3`, matching the wrong
  instruction the playbook corrected on 2026-08-11.)
- **BARE `\n` INSIDE `<p>` WITH NO `<br>` RENDERS AS ONE COLLAPSED RUN-ON PARAGRAPH** — unreadable to
  the tester. **The fix is `<br>` tags**, by either API `update_case` (rewrite the breaks only, never
  the wording) or the **UI "." trick** (edit the case, append `.` to the Title, Save, reopen, remove
  the `.`, Save — which puts the text through TestRail's HTML pipeline). **⚠️ The "." trick COLLAPSES a
  field that is already bare-`\n`-in-`<p>`-with-no-`<br>`, so those must be API-rewritten first**;
  detect on **mid-text** newlines — **but NOT with the old one-liner
  `('\n' in text and '<p' in text.lower() and '<br' not in text.lower())`, which is WRONG (corrected
  2026-08-25).** It flags any field holding a `<p>` anywhere plus a newline anywhere, i.e. **the normal
  block-HTML shape the CSV import produces**, and over the 428 August cases it claimed **16** collapsed
  fields where there are **0**. **Use the refined test — a newline inside ONE `<p>`'s own inner text:**
  `any('\n' in inner.strip() and '<br' not in inner.lower() for inner in re.findall(r'<p\b[^>]*>(.*?)</p>', t, re.S|re.I))`.
  *The scar: a batch on the old detector damaged C44506's block structure irreversibly-by-API.*
  **⚠️ A lone TRAILING `\n`
  after `</p>` on a single-line field is HARMLESS — rewriting it injects a spurious blank line, so
  leave it.** Full recipe: `build/APP-ACTIONS-PLAYBOOK.md` §J "REPAIR RECIPE — THE BARE-`\n`-INSIDE-`<p>`
  COLLAPSE".
- **`update_run` REPLACES the run's selection** — a partial `case_ids` list **DELETES the omitted tests
  AND their recorded results**. **Union only** (Rule 34/47), snapshot `get_tests` +
  `get_results_for_run` before, verify every prior result present BY ID after.
- **Declared read-time echoes on run results:** `case_title` and `case_refs` move when the underlying
  case's title/refs change. That is display data, not a graded field — assert it explicitly, never
  wave it away.
- **`delete_case` is irreversible.** Nothing is deleted without the QA lead's go-ahead (Rule 6), and a
  retired internal ID is **never reused** (a resync once overwrote a retired record).

**PERMISSION GATE:** TestRail is the only real production system in this workspace. **No write of any
kind without explicit permission (Rule 6)**, and the active creation hold bars `add_case` entirely
until it lifts (Rule 62 / register row H1) — while `update_case` on existing cases continues.

---

## 2 · JIRA AND CONFLUENCE

**PRIMARY — the Atlassian MCP tools** (`mcp__Atlassian__getJiraIssue`,
`searchJiraIssuesUsingJql`, `getConfluencePage`, `editJiraIssue`, `createJiraIssue`, …). If they are
not in your tool list, **re-discover them with `ToolSearch` before concluding they are gone** —
deferred tools are listed by name only until their schema is fetched.

**FALLBACK — REST with a live browser login.** The full, proven method is
**`build/ATLASSIAN-JIRA-ACCESS-METHOD.md`** — read it rather than re-deriving:
- headless Chromium through a **fresh MITM bridge** → `id.atlassian.com` → email + password →
  **6-digit EMAIL OTP**, which the **QA lead supplies on request**.
- **🛑 CORRECTED 2026-08-26 — THERE IS NO OTP ON THIS ACCOUNT, AND THE OTP WORDING ABOVE IS
  SUPERSEDED.** `build/BLOCKED-confluence-source-verify.md` is marked **RESOLVED 2026-08-26**: the
  Atlassian login failure was **an undismissed "Security review" interstitial swallowing the login**,
  **never a credential problem**, and the account has **no OTP because two-step verification is off**.
  **THE FIX: dismiss the "Security review" interstitial during login, then proceed normally — no OTP
  is issued, none is needed, and none should be requested from the QA lead.** Recorded in commit
  `55b3e979`; all six Report Suite specs were then fetched live
  (`build/report-suite/source-verify-2026-08-26/reports/`). **The two bullets above are kept visible
  and dated rather than deleted (the Rules 32/33 pattern) — do not apply them, and do not ask him for
  a 6-digit code.**
- **THE MFA RACE IS THE CRUX:** each password submit emails a NEW code and **invalidates all prior
  ones**. Hold **ONE detached session parked at the OTP prompt**, polling the code file in `/tmp`.
  **NEVER start a fresh run to retry** — that invalidates the code the QA lead just sent you.
- Then `GET /rest/api/3/issue/<KEY>`, `/rest/api/3/search`,
  `/wiki/api/v2/pages/<id>?body-format=…` with the resulting session.
- **ShopView / Cloudflare cookies do NOT authenticate `atlassian.net`** — Basic auth there returns
  401/404. They are separate estates.

**PREFLIGHT:** fetch a known issue key (or a known Confluence page id) and assert HTTP 200.

**FAILURE SIGNATURES:** 401/403 on `atlassian.net` ⇒ no valid Atlassian session (ladder down to the
browser login). A Confluence page fetch returning an unexpectedly old version ⇒ suspect you read a
cached mirror, not live (Rule 31: **use the Confluence VERSION NUMBER, never the in-body "Version"
field**, which sits at 1.0 forever).

**WRITE GATE:** **no Jira ticket may be created without explicit permission, and a creation hold is
ACTIVE** (Rule 62). Editing an existing ticket is not creating one. Never convert someone else's
ticket — conversion is UI-only and silently wipes Product Area (Rule 52).

---

## 3 · SHOPVIEW — QA BRANCHES, STAGING, PRODUCTION

**PRIMARY — session cookies from `/tmp` plus the DEV quick-login.**
- Cookies: **`sv_sso_session`, `PHPSESSID`, `cf_clearance`** (domain `.qa.shopview.com` for QA
  branches). **Lifetime ~24 hours OR until a deployment** — whichever comes first.
- `POST /api/quick-login {key:'admin'|'tech'}` is gated by those cookies and is **stateful on the
  shared `PHPSESSID`** — probe roles strictly **sequentially**.
- **On a shared estate, `quick-login` and `switch-user` ROTATE THE SESSION.** If a sibling worker
  shares the login, calling either will break them. **Say so and do not call them** rather than
  stealing the session (Rule 83 lane locks).
- **🔑 "QUICK-LOGIN LOGS ME OUT" — MEASURED AND SETTLED 2026-08-28 on `sv9500`. Read the recipe before
  you call it: `build/QUICK-LOGIN-DIAGNOSIS-2026-08-28.md`, mirrored in
  `build/APP-ACTIONS-PLAYBOOK.md` §A.** In one line each: **rotation is CONFIRMED** (old jar → 409
  `Session has expired.` seconds later, on *every* call) · **only `PHPSESSID` rotates —
  `sv_sso_session` does NOT** · a **403 `Access denied.` still logged you in**, so take the new
  `PHPSESSID` from its `Set-Cookie` instead of "recovering" · a **409 hands back a DEAD `PHPSESSID`
  that 409s forever**, so turn cookie persistence OFF and re-read the jar from `/tmp` after any 409 ·
  **probe `GET /api/auth/me/fe-permissions` FIRST and if it 200s do NOT call quick-login at all** ·
  **idle timeout is not a cause** (5 minutes of paging with 60 s gaps: zero 401/409) · on `sv9500`
  **`cf_clearance` is not needed and there is no Cloudflare in the path** (CloudFront/S3 + bare nginx).
- Topology: `app.staging.shopview.com` (SPA) / `api.staging.shopview.com` (Symfony JSON). QA branches
  follow `<branch>.qa.shopview.com` / `<branch>api.qa.shopview.com` (**note: no dot before `api`**).
- **Production** (`app.shopview.com`, prod test org): its own login/session gotchas, canned-line
  workplace and evidence method are in **`build/APP-ACTIONS-PLAYBOOK.md` §K** (proven 2026-07-29).

**PLAYWRIGHT / UI AUTOMATION — two non-negotiable mechanics:**
- Chromium **cannot TLS through the egress proxy directly**. Build a **FRESH MITM bridge per run**; the
  **port rotates**, so read **`$HTTPS_PROXY` live** — never hard-code it.
  (`build/testing-tools/staging-bridge.mjs`.)
- Use the **`boot2` hydration pattern**: seed cookies + `localStorage` (`user`,
  `fe_permissions_wrapper`, `token`) and **then** navigate. The DEV login **buttons do not reliably
  work**. (`build/testing-tools/staging-boot2.mjs`.)
- Quasar UI: click by **element-centre coordinate** (`page.mouse.click`) rather than Playwright
  actionability clicks, which time out on backdrops. If a control is below the fold,
  `scrollIntoViewIfNeeded()` **then** click — a coordinate click on an off-screen control lands on
  nothing and looks exactly like a broken feature. (That mistake once produced a false "the service is
  broken" report.)

**FALLBACK LADDER when the UI will not cooperate:** UI → direct API call → the other one. Discover an
endpoint by POSTing an empty/partial body and reading the validation error. All the proven recipes
(create a WO, add a part, adjustments, switch workplace, reset a role to template) are in
**`build/APP-ACTIONS-PLAYBOOK.md`** — **read it before any staging action (Rule 27)**.

**PREFLIGHT — and it doubles as the Rule-49 build marker, so always do it:** fetch `index.html` and
record **`<meta name="app-version">` + `last-modified` + `etag`** (and the `sha256` of the body if you
will compare later). Re-read it at the END of the pass: if it moved, the branch redeployed under you
and your verdicts span two builds — say which case was seen on which (Rule 54 sentence 2).

**FAILURE SIGNATURE — read this one carefully:** **HTTP 401 `sso_required` means EITHER the cookies
died (~24 h) OR a deploy happened.** **Check the build marker before assuming expiry** — the whole
`.qa.shopview.com` estate dies together, so a Filters cookie failing against the Schedule API is
ordinary expiry, not a Schedule problem. A **409** on raw-cookie API use ⇒ prefer quick-login SSO.

**ENVIRONMENT ETIQUETTE:** everything except TestRail is disposable (Rule 6) — seed what you need
(Rule 14), tag it `ZZAUTOTEST`, and **restore byte-identically** what you changed (roles to template,
settings, workplace, borrowed staff). A restore is not restored until compared **field by field**.

---

## 4 · FIGMA

**PRIMARY — the Figma MCP tools** (`mcp__Figma__get_metadata`, `get_design_context`, `get_screenshot`,
`download_assets`). Re-discover with `ToolSearch` before declaring them missing.

**FALLBACK — the REST API** with the token from **`/tmp/figma-token`**:
`GET /v1/files/<key>/nodes?ids=…` for the node tree, `GET /v1/images/<key>?ids=…` for renders.

**THE TWO FACTS THAT MATTER MOST:**
- **The `nodes` endpoint is a SEPARATE BUDGET from `images`** — when image renders are capped, the node
  tree usually still works, so a frame can still be described from its own visible TEXT layers,
  component/variant names and layer names (**described, never guessed** — Rule 12).
- **`scale=1` is capped by the SAME budget as any other scale** — it is not a workaround.

**RATE LIMIT — HTTP 429 `{"err":"Rate limit exceeded"}`:** this is **not** a dead end and **not**
something to ask permission about. Open (or append to) the **Rule-35 queue**
`PENDING-FIGMA-FETCH.md` in that project's design folder: record the missing node ids, the **UTC error
timestamp**, the fresh `retry-after`, and **DUE-AT = error time + 9 hours**; re-attempt at or after
DUE-AT **automatically**; on another 429 append the attempt and **re-arm DUE-AT = new error time + 9 h**;
repeat until **100 %** of the needed frames are down. **A design pass may not be reported complete
while a queue is OPEN**, and the deliverable must name the exact shortfall. The canonical resumable
fetcher is `build/filters/design-2026-07-31/tools/fetch_all.py` (exit 0 = complete / 2 = rate-limited,
queue re-armed / 3 = short for another reason); method in `build/APP-ACTIONS-PLAYBOOK.md` §M.

**PREFLIGHT:** one `nodes` call on a known file key + node id returns HTTP 200.

**CHECK THE QUEUE AT EVERY SESSION START:** `ls build/*/design-*/PENDING-FIGMA-FETCH.md` — if one is
OPEN and past its DUE-AT, **run its fetch command immediately, no authorisation needed**.

---

## 5 · SLACK · GMAIL · DRIVE · CALENDAR · FIREFLIES

**Use them if present; if absent, SAY SO and continue.** These connectors are convenience inputs, not
QA sources of truth. **NEVER BLOCK A QA TASK ON THEM.** A missing Slack or Gmail tool is a note in the
findings file, not a blocker — and in an unattended run their absence is **expected**, because they are
interactively authenticated (see §6 point 4).

If a source only exists behind one of them (a message, a meeting transcript, a shared file) and the
connector is unavailable, that becomes an **OUTSTANDING item** for the QA lead to supply (Rule 36) —
never a guess, never a paraphrase from memory.

---

## 6 · MCP HYGIENE — the part that keeps a connector from going corrupt

**These are HARD RULES. A broken connection is recoverable; a corrupted config is not.**

1. **NEVER EDIT, DELETE OR "REPAIR" SHARED MCP CONFIGURATION TO FIX A CONNECTION.** Not
   `.mcp.json`, not `settings.json`, not a server definition, not an env var that a connector reads —
   **a mutated config is how a connector goes corrupt and STAYS corrupt for every future session.**
   Your session ends; the damage does not. If you believe a config is genuinely wrong, **report it with
   the evidence and let the QA lead decide** (Rules 6/72 — propose, never self-authorise).
2. **IF AN MCP TOOL IS MISSING OR ERRORING: re-discover it with `ToolSearch` FIRST**
   (`select:<tool_name>` or a keyword query — deferred tools are name-only until their schema is
   fetched, and "not in my list" usually means "not yet loaded"). **THEN fall back** to the documented
   workaround in §1–§5. **DO NOT RETRY-LOOP** — repeated identical calls burn quota for nothing and
   can trip rate limits that then block the fallback too.
3. **NEVER DISABLE TLS VERIFICATION. NEVER UNSET `HTTPS_PROXY`.** On a TLS failure or a 403 / 405 /
   407 from the proxy, read **`/root/.ccr/README.md`** and run
   **`curl -sS "$HTTPS_PROXY/__agentproxy/status"`** for per-tool fixes and proxy state. Weakening
   transport security to make a call succeed is never an acceptable workaround.
4. **AN INTERACTIVELY-AUTHENTICATED MCP SERVER MAY SIMPLY BE ABSENT IN A HEADLESS / UNATTENDED RUN.
   THAT IS EXPECTED, NOT A FAULT.** Do not attempt to re-authenticate it, do not try to script an OAuth
   flow, and do not report it as breakage. **The fallback path is the answer.**
5. **RECORD EVERY CONNECTOR FAILURE AND THE WORKAROUND USED** in the session's findings file — system ·
   what failed · the exact error · which fallback was used · whether it worked · UTC timestamp. This is
   how the main session learns which paths are currently reliable, and it is how a genuinely broken
   connector gets fixed by the person who is allowed to fix it. **The books are the only channel
   between sessions (Rule 27) — an unrecorded failure will be re-hit by the next session.**

---

## 7 · UNATTENDED-SESSION PROTOCOL

A session nobody is watching must degrade honestly instead of stalling or inventing.

1. **PREFLIGHT EVERY SYSTEM YOU WILL NEED AT SESSION START** (§0) and record the results before
   starting the work.
2. **IF A CREDENTIAL IS MISSING OR EXPIRES MID-RUN:** write **`BLOCKED-<system>.md`** in the pass
   folder naming (a) exactly what is needed — e.g. *"a fresh `sv_sso_session` / `PHPSESSID` /
   `cf_clearance` for `.qa.shopview.com`"* — (b) what it blocks, concretely, with the named cases
   (internal ID + C-id + link, Rule 8), (c) what is NOT blocked, and (d) the exact steps to resume.
   **COMMIT IT** (git is the only durable store, Rule 29).
3. **THEN CONTINUE WITH THE WORK THAT DOES NOT NEED THAT SYSTEM.** A blocker blocks only what it
   actually blocks — decompose the work and prove the blocker rather than downing tools (Rule 68).
4. **REPORT IT UNDER "OUTSTANDING — what I need from you"** at the end, with the five Rule-48 fields
   where the QA lead himself is the blocker.
5. **NEVER FABRICATE A RESULT. NEVER INFER AN OBSERVATION. NEVER MARK VERIFIED WHAT WAS NOT OBSERVED**
   (Rule 12). An unobserved row stays unobserved and says so on itself. *"N of M observed on build
   `<marker>`; the remaining M−N carry their last recorded check"* is the honest sentence — never
   *"the suite is current"* (Rule 60).
6. **SECRETS: `/tmp` only, `chmod 600`, NEVER committed — not in a log, not in an error paste, not in a
   `BLOCKED-*.md`** (Rule 82). Name the credential you need; never quote its value. Run
   **`python3 build/testing-tools/scan_secrets.py --staged`** before every commit and refuse on exit 1.
7. **CHECKPOINT-COMMIT AFTER EVERY STEP** (Rule 29), path-scoped (`git add -- <paths>`, never
   `git add -A`), so a death loses at most the step in flight.

---

## 8 · ONE-PAGE LADDER SUMMARY

| System | PRIMARY | FALLBACK | Preflight | Failure signature |
|---|---|---|---|---|
| **TestRail** | REST API v2, Basic auth from `/tmp` (**no MCP — most reliable**) | Playwright on the web UI (HTML re-render "." save) | `get_case` → 200 | 401 creds · 403 not permitted · unpaged `get_sections` silently returns 0 |
| **Jira / Confluence** | Atlassian MCP tools | browser login per `ATLASSIAN-JIRA-ACCESS-METHOD.md` (email OTP; hold ONE session at the prompt) | known key/page → 200 | 401/403 on `atlassian.net`; ShopView cookies do NOT work there |
| **ShopView QA / staging / prod** | `/tmp` cookies + `POST /api/quick-login` | direct API ⇄ UI, either way round; prod per playbook §K | `index.html` → 200 + app-version | **401 `sso_required` = cookies dead OR a deploy — check the build marker** |
| **Figma** | Figma MCP tools | REST `/v1/files/.../nodes` + `/v1/images` with `/tmp/figma-token` | one `nodes` call → 200 | **429 ⇒ open the Rule-35 queue, DUE-AT = +9 h, repeat to 100 %** |
| **Slack / Gmail / Drive / Calendar / Fireflies** | their MCP tools | none needed | list/search one item | **absent in an unattended run is EXPECTED — never a blocker** |

---

**Ties to Standing Rules:** 6 (nothing written to a system of record without permission) · 12
(observed, never inferred) · 22 (ask for the live-build check and the access it needs UP FRONT) · 27
(reuse the recorded recipe; record a new one immediately) · 29 (no work loss — commit the
`BLOCKED-*.md`) · 35 (the Figma retry queue) · 36 (an access gap is an OUTSTANDING item) · 49 (the
build marker is captured by the same preflight) · 50 (verify exhaustively and exactly) · 62 (the
creation hold) · 68 (a blocker blocks only what it actually blocks) · 76 (do not spend spawns
retry-looping) · 82 (the real secret-scan gate) · 83 (lane write locks — do not steal a shared login) ·
**89 (this skill is that rule's operator form)** · 90 (report the quota spend).

## 🆕 THE BRIDGE PORT GOES STALE ON A CONTAINER RESTART, AND IT LOOKS LIKE DEAD CREDENTIALS (2026-09-01)

**Symptom, in the order you meet it.** Playwright answers
`page.fill: Timeout 60000ms exceeded — waiting for locator('#name')` on the TestRail login page, or
`page.goto: net::ERR_CONNECTION_RESET`. Nothing is wrong with the credentials, the site or the account.

**Cause.** `/tmp/atlassian/bridge-port.txt` still holds the port from before the restart, and the MITM
bridge that was listening there is gone. Worse, `$HTTPS_PROXY` has ALSO moved, so the bridge's own
egress target is stale even if you restart it by hand — and pointing the file straight at
`$HTTPS_PROXY`'s port does not work either: the browser needs the bridge, not the raw agent proxy, and
you get `ERR_CONNECTION_RESET`.

**Fix, and it is one line, already in the repo:**

```
bash build/testing-tools/ensure_bridge.sh
```

It detects the stale egress (`bridge: STALE egress — logged 'http://127.0.0.1:42811' but HTTPS_PROXY is
'http://127.0.0.1:44607'`), restarts the bridge against the current proxy, and rewrites
`bridge-port.txt`. **Run it after ANY container restart, before the first Playwright call** — every UI
writer and the served-page scanner read that file at startup.

**Do not** edit `bridge-port.txt` by hand, and do not conclude the session's credentials died: a
Playwright timeout on a login form is a fact about the transport, not about the account (Rule 68).

---

## CREDENTIALS LIVE IN THREE PLACES — CHECK ALL THREE BEFORE SAYING YOU HAVE NONE (2026-09-02)

A session reported *"this container came up with no TestRail credentials"* and stood a whole pass down
as blocked. **`/tmp/testrail/creds.json` was on disk the whole time and worked on the first call.** The
QA lead's reply was one line: *"You already had those credentials."* That is a Rule-97 false blocker,
and it cost a report cycle.

**The three sources, in order — `build/testing-tools/load_creds.py` now tries all three and raises a
message naming them if all three miss:**

| # | Source | Shape |
|---|---|---|
| 1 | environment variables | `TESTRAIL_EMAIL` (or `CLAUDE_USERNAME`) + `TESTRAIL_API_KEY` |
| 2 | `/tmp/shopview-creds.env` | materialized from those by `build/testing-tools/init_creds.sh` |
| 3 | **`/tmp/testrail/creds.json`** | `{"host","user","email","password"}` — **`password` IS the API key**. This is what the Playwright/Node writers (`apply_cases.mjs`) read, so it survives when the env vars do not |

Also on disk and easy to overlook: **`/tmp/testrail/creds-ui.json`** (the TestRail *web* password, for
the Froala/`fr-view` UI writes) and **`/tmp/qa-cookies/`** (`sv9315.json`,
`sv9315-live-session.txt`, and the sv8218 pair) for the ShopView build.

**A 400 is not an auth failure.** After the creds resolved, `get_sections/1&suite_id=6597` answered
**HTTP 400** — because project 1 is **single-suite mode (`suite_mode 1`)**, so `suite_id` is rejected
outright, and **6597 is a top-level SECTION id, not a suite id**. Page `get_sections/1` and
`get_cases/1` whole and filter to the descendants of the root section. Verified live 2026-09-02:
**686 sections / 4,622 cases** in the estate; root **6597 → 8 sections, 122 cases** · **6617 → 7
sections, 44 cases** · **6559 → 17 sections, 119 cases**. Working fetcher: `/tmp/dx/fetch2.py`.
