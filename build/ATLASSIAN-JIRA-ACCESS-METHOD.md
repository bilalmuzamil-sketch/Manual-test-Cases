# Atlassian / Jira / Confluence Access Method (shared infra, all projects)

> Reusable, success-proven method for reading Jira tickets and Confluence pages at
> `shopview.atlassian.net` when the user supplies login credentials + email OTP codes.
> **This SUPERSEDES the old "Jira/Confluence is SSO-walled → export/paste only" stance:**
> **live browser login is now the PRIMARY method** whenever the user provides creds +
> relays OTP codes; **export/paste is the FALLBACK** when login is unavailable.
> **NO SECRETS IN THIS REPO — EVER.** Passwords, cookies, tokens, and OTP codes live in
> `/tmp` only (chmod 600). This doc contains the METHOD, never a secret value.

---

## ⚠️ CORRECTION — 2026-08-26: **THERE IS NO OTP ON THIS ACCOUNT.** THE BLOCKER IS A "SECURITY REVIEW" SCREEN

**Proven live 2026-08-26 (`bilal.muzamil@shopview.com`): the account has two-step verification
switched OFF, so Atlassian NEVER SENDS AN EMAIL CODE.** A session that waits at
`/tmp/atlassian/otp.txt` for a code will wait forever, and asking the QA lead to relay one wastes
his time. **Check for the interstitial FIRST; treat the OTP path as the branch that may never fire.**

- After the password is accepted the browser parks on **`id.atlassian.com/login/security-screen`**
  showing **"Security review"** with three choices: *Enable two-step verification* /
  **"Continue without two-step verification"** / *Create a passkey*. The Jira board renders behind
  the modal, which makes it look like the login already succeeded. It has not.
- **CLICK "Continue without two-step verification".** It only DISMISSES the screen — it changes no
  account setting. **Until it is clicked the browser never reaches `shopview.atlassian.net`, so
  `cloud.session.token` is NEVER ISSUED** and every REST call afterwards fails. Selector:
  `button:has-text("Continue without two-step verification")`. Poll for it up to 3 times; it can
  also appear AFTER a code step on accounts that do challenge.
- **THE SECOND TRAP, and it reads like an auth failure but is not:** verifying with
  `page.evaluate(fetch('https://shopview.atlassian.net/...'))` **while the page is still on the
  `id.atlassian.com` origin** dies with a bare **`TypeError: Failed to fetch`** — that is the
  browser's cross-origin block, not a 401. **Navigate to `shopview.atlassian.net` first, THEN
  capture cookies and call the API.** Assert on a real endpoint: `/rest/api/3/myself` **and** a
  Confluence page (`/wiki/api/v2/pages/<id>?body-format=storage`), both **200**.
- Verified end to end on 2026-08-26: 18 cookies captured, `cloud.session.token` present,
  `myself` → **200**, Confluence page → **200**, and `jira.sh` + `cookies.txt` then works from the
  shell with no browser. The whole login took **35 seconds** and needed **no human in the loop**.

---

## ⚠️ CORRECTION — 2026-08-04: THE CODE IS **SIX ALPHANUMERIC CHARACTERS**, NOT "6-DIGIT"

**This doc previously said "6-digit OTP" throughout. That is WRONG, and it will break your login.**
Both codes relayed on 2026-08-04 mixed **digits and uppercase letters** (shape: `0AAA0A` — a digit, four
letters, a digit, a letter). The literal values are deliberately not recorded here. A wrong fact in the book is worse than a missing one, so it is corrected here first:

- **The code is 6 characters from `[0-9A-Za-z]`.** A `\d{6}` validator **never matches** and your held
  session will sit there until it times out. Use **`/\b([0-9A-Za-z]{6})\b/`**.
- **The prompt is SIX SEPARATE INPUT BOXES**, each `maxlength=1` — *not* one field. The selector is
  **`input[data-testid^="otp-input-index-"]`** (`aria-label` = *"Please enter OTP character 1…6"*).
  A single `fill(code)` on the first box does **not** work. **Click box 1, then `keyboard.type(code)`**
  and let the widget auto-advance; per-box `fill(code[i])` is the fallback. The submit button reads
  **`Verify`**.
- Everywhere below that still says "6-digit", read "6-character alphanumeric". The rest of the flow in
  §1–§7 is confirmed accurate.

**Also corrected the same day:** the *page* renders a moment AFTER `domcontentloaded`, and **both
`#username` and `#password` exist in the markup from the start** (password merely hidden). So an
instantaneous `isVisible()` check on the email field returns false and you will skip the email step.
**`waitFor({state:'visible'})` on the email field** — do not probe it instantly.

---

## 0a. THE FAST PATH — runnable, proven end-to-end on 2026-08-04

Committed, secret-free scripts (they read credentials from `/tmp` at runtime):
**`build/atlassian-login/bridge.mjs`** · **`build/atlassian-login/login.mjs`** ·
**`build/atlassian-login/jira.sh`**

```bash
# 0) secrets in /tmp ONLY, chmod 600 — and create otp.txt BEFORE the password is submitted
mkdir -p /tmp/atlassian && chmod 700 /tmp/atlassian
cat > /tmp/atlassian/creds.json <<'EOF'
{"email":"<email>","password":"<password>"}
EOF
chmod 600 /tmp/atlassian/creds.json
: > /tmp/atlassian/otp.txt && chmod 600 /tmp/atlassian/otp.txt

# 1) FRESH MITM bridge. Chromium CANNOT TLS through the egress proxy directly
#    (proven: --proxy-server=$HTTPS_PROXY -> net::ERR_CONNECTION_RESET on every navigation).
#    Read $HTTPS_PROXY LIVE — the port rotates between sessions. Needs a local cert:
#
# ⚠️ 2026-09-02 — YOU NO LONGER RUN THE openssl LINE BY HAND, AND THE SAN IS WIDER NOW.
#    `bash build/testing-tools/ensure_bridge.sh` generates the bridge cert itself, with FIVE hosts:
#    *.atlassian.net, *.atlassian.com, *.testrail.io, *.qa.shopview.com, *.staging.shopview.com
#    — so one bridge covers Atlassian, TestRail AND the ShopView estate. See that script and
#    `build/APP-ACTIONS-PLAYBOOK.md` §A prerequisite 1 ("A fresh MITM bridge").
#    The two-host command below is the ORIGINAL text and stays as the historical authority.
cd /tmp/atlassian
openssl req -x509 -newkey rsa:2048 -nodes -keyout mitm.key -out mitm.crt -days 30 \
  -subj "/CN=mitm" -addext "subjectAltName=DNS:*.atlassian.net,DNS:*.atlassian.com"
export NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt NODE_USE_ENV_PROXY=1
nohup node <repo>/build/atlassian-login/bridge.mjs > bridge.log 2>&1 &   # writes bridge-port.txt
curl -s -o /dev/null -w '%{http_code}\n' -x http://127.0.0.1:$(cat bridge-port.txt) -k \
  https://shopview.atlassian.net/rest/api/3/myself      # expect 401 = bridge works, not yet authed

# 2) ONE detached login session that holds at the code prompt and polls otp.txt
export PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers
export CHROME_BIN=$(ls -d /opt/pw-browsers/chromium-*/chrome-linux/chrome | head -1)
setsid nohup node <repo>/build/atlassian-login/login.mjs > run.log 2>&1 < /dev/null &

# 3) watch for the "AWAITING CODE" line, then SAY SO — the QA lead supplies the code
tail -f /tmp/atlassian/status.txt        # or: ls /tmp/atlassian/AWAITING_OTP
printf '<THE-6-CHAR-CODE>' > /tmp/atlassian/otp.txt   # relayed code; script types it within ~2s

# 4) verify + work
/tmp/atlassian/jira.sh GET /rest/api/3/myself     # expect HTTP 200 + the account JSON
```

**Never run `playwright install`** — the browser is already at `/opt/pw-browsers`.
**Do not `pkill -f "…login.mjs"`** — the pattern matches your own shell's command line and kills the
bash call (observed: exit 144). Kill by PID from `pgrep -f`.

**Emergency channel if cookie extraction ever fails:** the login script's browser is launched with
`--remote-debugging-pipe` (no TCP port), so you cannot attach a CDP client — but the **Node** process
responds to **`kill -SIGUSR1 <pid>`**, which opens the inspector on `127.0.0.1:9229`. From there
`Debugger.setBreakpointByUrl` on the poll loop → `Debugger.evaluateOnCallFrame` to stash
`globalThis.__page = page` → `Debugger.resume` → `Runtime.evaluate` drives the live page. This is how
the 2026-08-04 session recovered when the code turned out to be alphanumeric and the running script
could only match digits — **without** re-submitting the password. Keep it as the last resort; the
right fix is the corrected regex above.

---

## 0. Context — why Basic-auth cookies do NOT work

- Jira and Confluence at `shopview.atlassian.net` sit behind **Atlassian SSO + an email
  one-time-code (OTP) MFA challenge**.
- The ShopView app cookies (`sv_sso_session` / `PHPSESSID` / `cf_clearance`, domain
  `.staging.shopview.com` etc.) authenticate ShopView **staging/QA only**. They do **NOT**
  authenticate `atlassian.net`.
- Consequences observed (2026-07-22):
  - Atlassian REST v3 Basic auth with those cookie values as the token →
    `GET /rest/api/3/myself` **HTTP 401** (`Client must be authenticated…`);
    `GET /rest/api/3/issue/<KEY>` **HTTP 404** (`Issue does not exist or you do not have
    permission to see it.`). The 64/32-hex values are ShopView session cookies, NOT
    Atlassian API tokens.
  - `curl` of `/browse/<KEY>` with those cookies → HTTP 200 but only the unauthenticated
    Jira SPA shell (`<title>Jira</title>`, ~732 KB, no ticket data).
  - `WebFetch` of a browse URL → HTTP 403 (SSO wall).
- Therefore: **we log in as a real browser session** to obtain genuine Atlassian session
  cookies, then call the REST API with those.

---

## 1. Login flow (headless Chromium via a FRESH MITM bridge)

Chromium cannot TLS through the egress proxy directly, so build a **FRESH local MITM
bridge per run** (see `build/TESTING-RUNBOOK.md` §"Chromium UI automation" — read
`$HTTPS_PROXY` LIVE each run; the port rotates; do not hard-code or reuse an old bridge).
Browser binary is pre-installed at `/opt/pw-browsers` — **NEVER run `playwright install`**.

Steps the automated session drives:

1. Navigate a browse URL, e.g. `https://shopview.atlassian.net/browse/SV-XXXX`.
2. Atlassian redirects to `id.atlassian.com` with a **two-step login form**:
   a. Enter **EMAIL** (`bilal.muzamil@shopview.com`) → click **Continue**.
   b. Enter **PASSWORD** → click **Log in**.
3. Submitting the password triggers Atlassian to **email a fresh code** and shows the prompt
   **"We've emailed you a code"** with **six single-character boxes** and a **`Verify`** button.
   ⚠️ **The code is SIX ALPHANUMERIC CHARACTERS — see the CORRECTION at the top of this doc.**
4. The session **holds AT the code prompt**, polling a file for the code (see §3).

If any step throws (bridge fails, Chromium won't start, the login page markup changed),
capture a screenshot + the exact error and report — do NOT spin/retry blindly.

**SUCCESS-PROVEN AGAIN (2026-08-04):** same flow, with the two corrections above, logged in live and
**filed six Jira defect tickets** (SV-8818…SV-8823) with descriptions, labels, priority, Severity,
Product Area, parents, issue links and **23 attachments** — then read back and byte-verified every
write. Record: `build/report-suite/defect-pack-2026-08-04/FILED.md`.

**SUCCESS-PROVEN (2026-07-22):** this exact flow LOGGED IN LIVE and ingested the
SV-8479 / SV-8480 / SV-8456 tickets — headless Chromium via a fresh MITM bridge →
`id.atlassian.com` two-step (email → **Continue** → password → **Log in**) → 6-digit
**EMAIL OTP** relayed by the user → authenticated Atlassian session captured →
`GET /rest/api/3/myself` **200** → REST v3 ingest per §5. Live login is confirmed
working, not theoretical.

---

## 2. Secret handling

- Credentials, codes and cookies live in `/tmp` ONLY. **Canonical layout (2026-08-04):**
  - `/tmp/atlassian/creds.json` — `{"email","password"}` (chmod 600).
  - `/tmp/atlassian/otp.txt` — the newest code the QA lead relays (chmod 600). **Create it EMPTY
    before the password is submitted**, so the poll target exists and no stale code can win.
  - `/tmp/atlassian/cookies.json` — captured session cookies (chmod 600).
  - `/tmp/atlassian/cookies.txt` — the same cookies as a Netscape jar for `curl -b` (chmod 600).
  - (Older runs used `/tmp/fd-tickets/…`; either layout works, the scripts use `/tmp/atlassian`.)
- **NEVER** commit, echo, or log any password, cookie, token, or code.
- Before every commit, `grep -F` the **staged diff** for the password, the code(s), and
  `cloud.session.token` / `tenant.session.token` / `eyJ` (a JWT prefix), and refuse on a hit.
- ⚠️ **Watch what you PRINT, not just what you commit.** `cloud.session.token` is a full JWT and it
  will land in your terminal if you dump a cookie array or log response headers. On 2026-08-04 one
  debug print emitted it (into the transcript, never a file); a sibling worker had to redact a live
  session cookie captured the same way. **Write cookies straight to a file — never through stdout.**
- ⚠️ **`/tmp` IS WIPED WHEN THE CONTAINER RESETS — this bit us.** A working session simply vanishes,
  and there is no way to recover it: the credentials, the cookies and the codes are all gone, so a
  **fresh login (and one new code from the QA lead) is required**. That is exactly why the
  2026-08-04 Tier-2 epic re-read had to fall back to a committed 2026-07-31 snapshot and shipped
  with a **4-day blind spot**. **Git is the only durable store (Rule 29)** — so commit the
  *findings* as you go, and treat the session as disposable. On a fresh container, **ASK for the
  credentials again** rather than assuming `/tmp` survived.

---

## 3. THE MFA RACE (the crux — read this)

**Every password submission emails a NEW code and INVALIDATES all prior codes.** Only the
code from the **NEWEST** email works.

**PROVEN AGAIN 2026-08-04, and the sharper half of it: A NEWER CODE KILLS AN OLDER ONE even when you
did nothing.** Two codes arrived that run, the second superseding the first, because an extra send happened while the
first was still in flight. **So always use the LAST code you were given and
discard the earlier one**, and if you are handed a second code mid-entry, stop and use the new one.

The winning pattern:

- Launch ONE **persistent, DETACHED** headless Chromium session and drive it to the OTP
  prompt, then **hold it there**, polling a file (e.g. `/tmp/fd-tickets/otp.txt`) on a
  short interval.
- When the user relays the newest code, write it to that file; the HELD session types +
  submits it **instantly**.
- **NEVER start a fresh login run to "retry."** A fresh run submits the password again,
  which emails yet another code and **invalidates the one the user is currently reading** —
  the classic race that never converges.
- Codes **expire in a few minutes** — relay and submit fast.
- The detached poller **survives across orchestrator/worker turns** (it is a background OS
  process), but the **held browser session + the MITM bridge do NOT survive a container
  restart** — a restart kills both, so an in-flight OTP challenge cannot be resumed and must
  be re-driven.
- **NUANCE (observed 2026-07-22, corrects the older "restart wipes /tmp" note):** `/tmp`
  FILES can PERSIST across a container restart — this session's authenticated Atlassian
  session cookies **and** the already-downloaded ticket bundles were still present after a
  restart, so **re-login was NOT needed** (re-verify with `GET /rest/api/3/myself` → 200 to
  confirm the cookie is still live). **Do NOT rely on it:** the held session + bridge are
  gone regardless. So always **RE-CHECK `/tmp` (cookies + bundles) BEFORE re-triggering an
  OTP** — only start a fresh login (which emails a new code) if the cookie is actually
  stale/absent. This avoids needlessly burning the user's OTP.

- **Give the poll a GENEROUS window — at least 15 minutes** (the committed script uses 25). A human
  has to read an email and relay six characters; a 2-minute timeout guarantees a second run, and a
  second run is the race.
- **SAY PLAINLY, THE MOMENT YOU ARE WAITING.** Nobody can fetch a code they do not know you need.
  The script writes an **`AWAITING CODE`** line to `/tmp/atlassian/status.txt` and touches
  **`/tmp/atlassian/AWAITING_OTP`** — report it immediately and then keep the session alive.
- **The one time it IS safe to restart:** *before* any code has been relayed to anyone. On
  2026-08-04 the first run reached the prompt and only then was the 6-box/alphanumeric problem
  spotted; restarting **at that instant cost nothing**, because no human was holding a code yet.
  Once the QA lead has a code in his hand, restarting is forbidden.

Detach pattern: launch the login script with `run_in_background` (or `setsid nohup … &` inside a
single bash command) so it outlives the turn; have it write status/screenshots to `/tmp`
and poll `/tmp/atlassian/otp.txt` in a loop.

---

## 4. After login — capture cookies & verify

1. Once the OTP is accepted, capture the **Atlassian session cookies** from the browser
   context to `/tmp` (chmod 600). The key cookies are:
   - `cloud.session.token`
   - `tenant.session.token`
   - `atlassian.account.*`
2. Verify the session is authenticated:
   `GET https://shopview.atlassian.net/rest/api/3/myself` with those cookies → **HTTP 200**
   (returns the account JSON). A 401 means the session did not stick — re-check cookie
   capture / domain.

Node `fetch` ignores the proxy → use **undici `ProxyAgent`** for REST calls (read
`$HTTPS_PROXY` live), or `curl --cacert /root/.ccr/ca-bundle.crt` honoring `$HTTPS_PROXY`.

---

## 5. Ingest via REST v3 (with the captured cookies)

For each ticket KEY:

1. `GET /rest/api/3/issue/KEY?expand=renderedFields,names,changelog&fields=*all`
   — full fields, rendered HTML, field display names, and change history.
2. `GET /rest/api/3/issue/KEY/comment` — all comments (author + date + full body), in order.
3. **Download every attachment** via its `content` URL
   (`GET /rest/api/3/attachment/content/<id>` or the `content` link from the issue JSON) to
   `/tmp`, then **open/analyze each image** (the VIU depends on the visuals — per Standing
   Rule 17, get the COMPLETE attachment set, not a sample).
4. Save one **`requirements-KEY.md` per ticket** (summary/status/type/fields + full
   description + all comments in order + a complete attachment inventory with a description
   of each image/video).

For Confluence pages, the same cookies work against the Confluence REST API
(`/wiki/rest/api/content/<pageId>?expand=body.storage,body.view`); export/paste of the
page remains the fallback.

---

## 5a. API GOTCHAS — all confirmed live on 2026-08-04

| Gotcha | The working fix |
| --- | --- |
| **`/rest/api/3/search` returns HTTP 410 Gone** | Use **`/rest/api/3/search/jql`**. It pages with **`nextPageToken`** (not `startAt`) — follow it until `isLast`, or you silently truncate at 100 (Rule 17). |
| **Every POST/PUT returns `403 "XSRF check failed"`** with cookie auth | Send **`Origin: https://shopview.atlassian.net`** *and* a **`Referer`** on the same host. `X-Atlassian-Token: no-check` alone is **not** enough. This one header pair is the difference between "cookies can only read" and "cookies can write". |
| **Attachments** | `POST /rest/api/3/issue/{KEY}/attachments`, multipart `-F file=@…`, header **`X-Atlassian-Token: no-check`** (mandatory). Returns an array with `id`/`size` — **compare `size` against the source file** to prove the upload is whole. 23/23 uploaded this way. |
| **A `Bug` cannot be the child of a `Story`** | Check `/rest/api/3/issue/createmeta/SV/issuetypes`: `Bug` is **hierarchyLevel 0**, so its `parent` may only be an **Epic** (level 1). The project's story-level defect type is **`Story Defect`** (id 10007, **subtask**, level −1) — that is the only way to hang a defect off a Story. |
| **Issue create rejected as invalid** | `/rest/api/3/issue/createmeta/SV/issuetypes/{typeId}` lists the **required** fields. On SV, **`customfield_10153` "Product Area" is REQUIRED** for a Bug. Others worth knowing: `customfield_10418` Severity (High/Medium/Low), `priority` (Highest/High/Medium/Low), `customfield_10318` QA Branch. |
| **`PUT` description fails `400 INVALID_INPUT` with an empty `errors` object** | Your ADF violates the schema. **The `code` mark cannot combine with `strong`/`em`.** Note **create is LENIENT and update is STRICT** — so a document that posted fine on `POST /issue` can be rejected on the next `PUT`. Validate before you rely on it. |
| **ADF comes back not byte-equal to what you sent** | Three *declared* server normalisations, proven by node-by-node diff: **(1)** empty `attrs: {}` is **dropped** on `orderedList`/`codeBlock`; **(2)** `tableCell`/`tableHeader` **always carry `attrs: {}`**; **(3)** an empty paragraph's `content: []` is **dropped**. Emit exactly that shape and the re-GET is **byte-identical** (Rule 50). |
| **JQL child count two ways** | `parent = <EPIC>` **and** `"Epic Link" = <EPIC>` — compare the **key sets in both directions**, never the counts (Rule 50). Both returned 101 and were set-equal for SV-8582 on 2026-08-04. |
| **A ticket's `updated` date lies** | It moves for admin-only edits — **your own issue link bumps it**. Five report-suite stories looked "changed" on 2026-08-04 purely because this session linked new bugs to them. **Read the `changelog`, not `updated`** (Rule 31). |
| **ShopView / Cloudflare cookies do NOT authenticate atlassian.net** | `sv_sso_session` / `PHPSESSID` / `cf_clearance` are ShopView-only → REST gives **401** on `/myself` and **404** on an issue. They are session cookies, **not** Atlassian API tokens. Log in properly (§1). |

## 5b. Is the Atlassian MCP available? CHECK — never assume

Earlier sessions had an Atlassian MCP (`getConfluencePage` etc.) and CLAUDE.md Rule 23 refers to it,
but **on 2026-08-04 there were ZERO MCP servers configured.** Check before planning around it:

```bash
python3 -c "import json,os; d=json.load(open(os.path.expanduser('~/.claude.json'))); \
print('global:', list((d.get('mcpServers') or {}).keys())); \
[print(' proj',k,list((v.get('mcpServers') or {}).keys())) for k,v in (d.get('projects') or {}).items()]"
ls ~/.mcp.json .mcp.json 2>/dev/null
```

Empty lists mean **no MCP**. That is not a blocker: **REST v3 with a live session cookie is the
reliable fallback and does everything the MCP does** (issues, changelogs, attachments, and Confluence
via `/wiki/rest/api/content/...`). Say which one you used, so the next reader knows.

## 5c. WHEN NOTHING WORKS — the exact ask to hand the QA lead

Diagnose in this order and report the step that failed with its evidence (Rule 12 — never fabricate
a result to look complete):

| Symptom | What it means | What to ask for |
| --- | --- | --- |
| Navigation dies `net::ERR_CONNECTION_RESET` | The bridge is not up, or you pointed Chromium at `$HTTPS_PROXY` directly | Nothing — rebuild the bridge (§0a step 1) and re-read `$HTTPS_PROXY` live |
| `/myself` → **401** | No session, or the cookie expired | *"Please send the Atlassian password again so I can log in, and be ready to relay one 6-character code from the verification email."* |
| Stuck at the code prompt until timeout | The code never arrived, or a `\d{6}` validator ate it | *"I am holding the login at the code prompt. Please send the newest 6-character code from the email — letters and digits."* |
| Second code arrives mid-entry | An extra send superseded the first | Use the **newest**; discard the older silently |
| `403 XSRF check failed` on a write | Missing `Origin`/`Referer` | Nothing — fix the headers (§5a) |
| `404` on an issue you can see in the browser | Permission scope, or you are unauthenticated | *"Can you confirm my account can see `<KEY>`?"* |
| `/tmp` is empty on a fresh container | The container reset | *"The container reset and wiped the session. Please re-send the credentials and be ready with one code."* |

**Never** substitute a snapshot, memory, or inference for a live read and present it as live — say
plainly what could not be verified and what you need (Rules 12/22/36).

---

## 6. Roles / who supplies what

- **The user (`bilal.muzamil@shopview.com`) supplies the email codes on request** — they read the
  newest verification email and relay the **6 alphanumeric characters**; we write them to the poll
  file and the held session submits them. **The onus is on US to say we are waiting, immediately.**
- Credentials (email + password) are provided by the user and stored in `/tmp` only.
- The authenticated account is **Bilal Muzamil**, `accountId 712020:6d590212-5c9b-4135-ae11-277f3826110e`
  (non-secret). Confirm it on `/myself` so you know whose name will appear on any write.

## 7. Fallback

If live login is unavailable (no creds, OTP not relayable, login page changed and blocks
automation), fall back to the **export/paste** method: the user exports/pastes each
ticket's full content (title/status/type/fields, complete description, ALL comments in
order, and every attachment/screenshot/video with the files) and it is ingested into
`build/<project>/…/requirements-KEY.md`.

---

## Cross-references
- **Runnable scripts (secret-free, credentials read from `/tmp` at runtime):
  `build/atlassian-login/bridge.mjs` · `build/atlassian-login/login.mjs` ·
  `build/atlassian-login/jira.sh`.**
- MITM bridge + Chromium automation details: `build/TESTING-RUNBOOK.md` (§Chromium UI
  automation / §SPA hydration).
- Action recipes: `build/APP-ACTIONS-PLAYBOOK.md` (§"Jira/Confluence access" points here;
  §K "Jira evidence method" covers attaching evidence + inline images to a ticket).
- Per-project spec pointers + PO attributions: `CLAUDE.md`.
- **Worked example of a full write session** (six tickets filed, byte-verified, 23 attachments):
  `build/report-suite/defect-pack-2026-08-04/FILED.md`.

## Change log for this doc
- **2026-08-04** — Corrected the code format to **6 ALPHANUMERIC characters** (was wrongly "6-digit")
  and recorded the **6-box `otp-input-index-` prompt**; added §0a the runnable fast path + the three
  committed scripts; added the **newer-code-supersedes-older** half of the MFA race, the ≥15-minute
  poll and the say-it-immediately duty; recorded that **`/tmp` is wiped on a container reset** (the
  cause of the epic re-read's 4-day blind spot); added §5a **API gotchas** (search 410 → `/search/jql`,
  the `Origin`/`Referer` XSRF fix for all writes, attachments, Bug-vs-Story hierarchy, required
  Product Area, the ADF `code`-mark rule and the three ADF normalisations, JQL both directions, the
  lying `updated` date), §5b **check whether the MCP exists**, §5c **when nothing works**, and the
  `SIGUSR1` inspector recovery route.
- **2026-07-22** — First live login proven; supersedes the export/paste-only stance.
