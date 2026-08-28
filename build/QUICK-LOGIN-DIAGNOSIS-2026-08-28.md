# Quick-login "logs you out" — controlled diagnostic on `sv9500`

**Date:** 2026-08-28 · **Branch under test:** `https://sv9500.qa.shopview.com` ·
**API host:** `https://sv9500api.qa.shopview.com` (`sv<n>api…`, no dot — playbook §B naming, now
VERIFIED for this branch) · **Build marker:** `<meta name="app-version" content="v26.35.6-4b694be" />`
· `last-modified: Fri, 28 Aug 2026 11:08:02 GMT` · `etag: "23db2cea013342883de0659c23548593"`
**Cookies:** QA-lead set supplied 2026-08-28, held only in `/tmp/sv9500/cookies.txt` (`chmod 600`,
deleted at the end of the run). **No value appears in this file or anywhere in the repo.** Jars are
referred to as **cookie A** (as supplied), **cookie B**, **cookie C** (post-rotation), and are
identified only by a truncated SHA-256 fingerprint.

---

## The hypothesis under test

> `POST /api/quick-login` ROTATES the session: it issues a NEW session cookie and invalidates the
> previous one. A client that keeps using its PRE-quick-login cookie jar therefore appears logged out.

## VERDICT — **CONFIRMED**, with two corrections and one additional cause

| | |
|---|---|
| **Confirmed** | Every `POST /api/quick-login` issues a new session cookie and the previous one is dead from that instant (`409 Session has expired.`). A client that keeps its pre-quick-login jar is logged out. **Both calls rotated — including the one that returned an error status.** |
| **Correction 1 — which cookie rotates** | Only **`PHPSESSID`** rotates. **`sv_sso_session` NEVER changed** across the whole run (identical fingerprint at every step, 6 requests before and 12 after). The playbook's §A trap 5 wording — *"quick-login … ROTATES the shared `sv_sso_session`"* — is **wrong on this branch**; the cross-branch sign-out it warns about is real, but the mechanism is the per-branch `PHPSESSID`, not the shared SSO token. The warning still stands for anyone sharing that branch's jar. |
| **Correction 2 — a 403 quick-login is NOT a failed login** | `{"key":"tech"}` returned **HTTP 403 `Access denied.`** — and the session it left behind was a **fully working Technician session** (`view_mode: "tech"`, 6 permissions). The playbook's §A entry calls this "a FAILED quick-login BURNS THE SESSION" and prescribes an `admin` quick-login to recover. On `sv9500` there is nothing to recover from: **take the rotated `PHPSESSID` out of the 403's own `Set-Cookie` and carry on.** Calling `admin` to "fix" it costs you the tech session you just got. |
| **Additional cause — the sticky dead-session latch** | A `409` response **hands back a `PHPSESSID` of its own**, deterministically the same dead value every time, and **that value 409s forever**. Any client with ordinary cookie persistence (a browser, `requests.Session()`, `curl -c/-b`) that hits **one** 409 adopts the dead id and is then permanently "logged out" — even though a perfectly valid session exists. This is the second, independent way to appear logged out, and it is the one that looks least like the user's own doing. |
| **NOT a cause** | Idle timeout, short session lifetime, or concurrent use. See steps 6 and 7. |

---

## Evidence, step by step

Statuses are exactly as observed. `Set-Cookie` is reported by **name and whether the value changed**;
no value is recorded anywhere.

### 1 · Baseline

| # | Request | Result |
|---|---|---|
| 1.1 | `GET https://sv9500.qa.shopview.com/` | **200**, `Server: AmazonS3` via CloudFront. Build marker `v26.35.6-4b694be`, `last-modified 2026-08-28 11:08:02 GMT`, etag as above |
| 1.2 | `GET <api>/` | **200** `{"data":[]}`, `Server: nginx/1.30.4` |
| 1.3 | `GET <api>/api/auth/me` | **404** `'resource' was not found.` — **this path does not exist on this build**; do not use it as a liveness probe |
| 1.4 | **`GET <api>/api/auth/me/fe-permissions`** with **cookie A** | **200**, 1143 bytes, full admin permission set (`billingPortalPageAccess`, `catalogInventory*`, … ) |

**So the supplied cookies DID authenticate**, as supplied, with no quick-login needed. That is worth
stating plainly because playbook §N says a raw-cookie read "returns 409 … that is normal": **on
`sv9500` it does not — cookie A read 200 straight away.** The endpoint used for every auth check below
is `GET /api/auth/me/fe-permissions` on the **api** host.

### 2 · `POST /api/quick-login {"key":"tech"}`  (cookie A → cookie B)

| Field | Observed |
|---|---|
| Status | **403** `{"errors":[{"error":"Access denied."}]}` |
| `Set-Cookie` | **`PHPSESSID` — CHANGED** (sent twice, same value, once with `HttpOnly` capitalised and once lower-cased; `expires` +24 h, `Max-Age=86400`, `path=/`, `secure`, `SameSite=none`) |
| `sv_sso_session` | **not re-sent, not changed** |

**Answer to the question asked: `PHPSESSID` changed; `sv_sso_session` did not.**

### 3 · The decisive test — cookie A immediately afterwards

`GET /api/auth/me/fe-permissions` with **cookie A** → **409** `{"errors":[{"error":"Session has
expired."}]}` — 7 seconds after the same jar returned 200. **The old jar is dead.** The response also
carried a `Set-Cookie: PHPSESSID` with a third, different value (see the latch, below).

### 4 · Cookie B

Same endpoint with **cookie B** → **200**, 345 bytes,
`view_mode: "tech"`, permissions `customersView, scheduleView, woPickParts, workOrderLinesCreateAndEdit,
workOrdersView, woTechViewMode`. **The 403 had in fact logged us in as the Technician.**

### 5 · Second rotation — `{"key":"admin"}` (cookie B → cookie C)

| # | Request | Result |
|---|---|---|
| 5.1 | `POST /api/quick-login {"key":"admin"}` with cookie B | **200**, 170,141-byte payload (`data.token` = a serialised Symfony `UsernamePasswordToken`), `Set-Cookie: PHPSESSID` **CHANGED**, `sv_sso_session` untouched |
| 5.2 | fe-permissions with **cookie B** | **409 Session has expired.** |
| 5.3 | fe-permissions with **cookie C** | **200**, 1143 bytes, admin permission set again |

**Every call rotates — the 403 one and the 200 one alike.** Two calls, two rotations, two dead jars.

### 5a · The dead-session latch (extra, not in the brief)

| Request | Result |
|---|---|
| fe-permissions with `sv_sso_session` only, **no `PHPSESSID`** | **409 Session has expired.** + `Set-Cookie: PHPSESSID` |
| fe-permissions with a deliberately bogus `PHPSESSID` | **409** + `Set-Cookie: PHPSESSID` — **the same value** the step-3 409 handed back |
| fe-permissions **reusing the `PHPSESSID` the 409 handed back** | **409** again |

So the SSO token alone is **not** an API session, and the id issued on a 409 is a dead one that never
becomes live. A cookie-persisting client latches onto it and stays logged out until the jar is reset.

### 6 · Five-minute realistic session on cookie C

Cookie C fixed for the whole run (responses' `Set-Cookie` ignored — the 200s re-sent the same value
unchanged anyway). App root, work orders pages 1–3, customers pages 1–2, users, with 20–65 s idle gaps.

| Clock | Status | Action | Cookie changed? |
|---|---|---|---|
| 16:01:13 | **200** | **AUTH CHECK (start)** — fe-permissions, 1143 B | no |
| 16:01:13 | **200** | app root (SPA), 3547 B | no |
| 16:01:14 | **200** | work orders page 1 (83,608 B) | no |
| 16:01:35 | **200** | work orders page 2 *(after 20 s idle)* | no |
| 16:01:36 | **200** | customers page 1 (81,697 B) | no |
| 16:02:42 | **200** | **AUTH CHECK** *(after 65 s idle)* | no |
| 16:02:45 | **200** | customers page 2 | no |
| 16:03:50 | **200** | users page 1 *(after 65 s idle)* | no |
| 16:03:51 | **200** | work orders page 3 | no |
| 16:04:12 | **200** | **AUTH CHECK (middle)** *(after 20 s idle)* | no |
| 16:05:18 | **200** | app root again *(after 65 s idle)* | no |
| 16:05:19 | **200** | work orders page 1 again | no |
| 16:06:24 | **200** | customers page 1 again *(after 65 s idle)* | no |
| 16:06:25 | **200** | **AUTH CHECK (end)** | no |

**14 requests, 312 seconds, 14 × HTTP 200, zero cookie changes.**

**Were we logged out during the five minutes? NO.** Not one 409, not one 401; every auth check
returned 200 and no response changed a cookie. **Nothing on this branch logs an idle client out inside
five minutes** — the cookie's own `Max-Age` is 86400 (24 h), consistent with the playbook's "~24 hours".

### 7 · Concurrency

- **Tested and safe:** four simultaneous requests sharing cookie C → **200 / 200 / 200 / 200**.
  **Concurrent use of one jar does not evict anything.**
- **NOT tested:** whether a genuinely *separate* sign-in for the same account evicts the first. Creating
  one requires a second SSO authentication against `auth.qa.shopview.com`, which is exactly the action
  that would rotate the QA lead's own session out from under him. Per the brief, **not forced —
  UNTESTED**. Note that the eviction the brief was chasing is already fully explained without it.

### 8 · Was `cf_clearance` needed on this host?

**No — and there is no Cloudflare in the path at all.**

- App host: `Server: AmazonS3`, `Via: … cloudfront.net`, `X-Amz-Cf-Id` present. **CloudFront, not
  Cloudflare.** `GET /` with **no cookies at all** → **200**.
- API host: `Server: nginx/1.30.4`, no `cf-*` headers. With **no cookies** it returns the application's
  own JSON **401 `{"error":"sso_required","sso_redirect_url":"https://auth.qa.shopview.com/logi…"}`** —
  an app refusal, not an edge challenge.
- Every 200 in this diagnostic was obtained with **`sv_sso_session` + `PHPSESSID` only**.

⚠️ This contradicts nothing in §A trap 1 (*"a 401 is usually an expired `cf_clearance`"*) for the
branches where Cloudflare is in front, but on **`sv9500` a 401 cannot be a `cf_clearance` problem** —
there is no `cf_clearance` to expire. Do not ask the QA lead for one for this host.

---

## THE CORRECT RECIPE — use quick-login without logging yourself out

Copy this verbatim. Endpoint host is `https://sv<branch>api.qa.shopview.com` (no dot before `api`).

1. **Check whether you need quick-login at all.** `GET /api/auth/me/fe-permissions` on the **api** host
   with the supplied jar. **200 ⇒ you are already signed in — do not call quick-login**, you would only
   throw that session away. (Use this path, not `/api/auth/me`, which 404s.) Only a **409** means you
   need a login; a **401 `sso_required`** means the SSO token itself is dead — ask the QA lead for a new
   `sv_sso_session` by name, quick-login cannot help.
2. **Call `POST /api/quick-login {"key":"admin"|"tech"}` AT MOST ONCE PER RUN, and only when you need to
   *change role*.** Send `Cookie: sv_sso_session=…; PHPSESSID=…` plus `Origin`/`Referer` =
   `https://sv<branch>.qa.shopview.com`, `Content-Type: application/json`.
3. **Take the `PHPSESSID` from the response's `Set-Cookie` and overwrite it in your jar — *even if the
   status is 403*.** A 403 `Access denied.` still rotated the session and still logged you in; verify
   with one fe-permissions call rather than believing the status. Leave `sv_sso_session` exactly as it
   was — it never rotates. Every request after this point uses the NEW jar; the old one is dead.
4. **Never re-send a jar after a 409, and never keep the `PHPSESSID` a 409 gave you.** That id is dead
   on arrival and permanently 409s. Turn cookie persistence OFF (`requests.request`, not
   `requests.Session()`; `curl -b` without `-c`) or reset the jar from `/tmp` on every 409.
5. **Do not call quick-login while a sibling worker is live on the same branch** (Rule 83). One call
   rotates that branch's `PHPSESSID` and every worker holding the old value is logged out instantly —
   that, and not any timeout, is the whole of the reported symptom.

**No `cf_clearance` on `sv9500`. Cookie file: one line, `name=value; name=value`, `/tmp` only,
`chmod 600` in a `chmod 700` dir, deleted at end of run.**

## OUTSTANDING — what I need from you

- **Step 7's true concurrency question is UNTESTED** — a second independent sign-in for the same account
  would have risked the QA lead's live session. Say the word (and confirm nobody else is on `sv9500`)
  and it can be settled in one call.
- **The `{"key":"tech"}` 403 is a candidate defect** — the endpoint performs the login, rotates the
  session and returns a working Technician session while answering `HTTP 403 Access denied.` No Jira
  ticket has been created (Rule 62 hold, and the API-ticket ask of Rule 51 both apply): **this needs
  your explicit go-ahead before anything is filed.**
- **The `PHPSESSID` you supplied on 2026-08-28 is now DEAD — that is the experiment working, not a
  mistake.** Proving rotation requires rotating. **Your `sv_sso_session` is untouched and still valid**,
  so the fix is one `POST /api/quick-login {"key":"admin"}` and keep the `PHPSESSID` it returns; the
  session was left in the **admin** role, and the live jar was deleted with `/tmp/sv9500` as instructed.
  **No data was created or modified on `sv9500` — every request in this diagnostic was a `GET` except
  the two `quick-login` calls, so there is no `ZZAUTOTEST` data and nothing to restore.**
- Nothing else outstanding.
