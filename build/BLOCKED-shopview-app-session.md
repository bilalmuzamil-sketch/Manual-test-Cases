# PARTIALLY RESOLVED — the ShopView app's authenticated surface

**Status: PARTIALLY RESOLVED as at 2026-09-02.** Raised 2026-08-21 by the PROJECT INDEX refresh
(`build/PROJECT-INDEX-REFRESH-2026-08-21.md`), re-confirmed live on staging 2026-08-31, and **rescoped
on 2026-09-02 under Rule 68 — a blocker blocks only what it actually blocks.**

**This file used to say that every stored cookie returns 401 and that this blocks *every live verdict*.
That is no longer true.** It was written before the QA-branch login route existed. Splitting it:

| Surface | Status as at 2026-09-02 |
|---|---|
| **`*.qa.shopview.com` QA branches** | 🟢 **NOT BLOCKED.** A proven, repeatable route exists and ran clean twice today. |
| **`app.staging.shopview.com`** | 🔴 **STILL BLOCKED.** No valid `sv_sso_session` is held; stored cookies 401. |

**⇒ Never cite this file to park a QA-branch verdict.** A QA-branch case that says "blocked, no
session" is wrong, and Rule 68 requires the work to be decomposed instead: do the branch half now.

---

## 🟢 NOT BLOCKED — QA branches (proven live 2026-09-02)

**The route:** `build/APP-ACTIONS-PLAYBOOK.md` §A **"THE AUTHENTIC QA-BRANCH LOGIN"**, harness
`build/testing-tools/qa-branch-boot.mjs`:

```
bash build/testing-tools/ensure_bridge.sh
node build/testing-tools/qa-branch-boot.mjs <branch> /customers admin
```

**Why the old blocker does not apply here, in one sentence:** the app logs *itself* in from the
sign-in screen's `DEV MODE — QUICK LOGIN` panel, so the only value you have to hold is
**`sv_sso_session`** — and that is the one cookie that does **not** rotate.

* **ONE cookie, not three.** `sv_sso_session` only, in `/tmp/qa-cookies/<branch>-sso.txt`, `chmod 600`,
  `/tmp` only, never committed (Rule 82). **No `PHPSESSID`** (quick-login mints a fresh one; a stored
  one is the whole "409 Session has expired" latch) and **no `cf_clearance`** (QA branches are
  CloudFront + nginx, with no Cloudflare in the path — measured A/B: `sv_sso_session` alone signs in,
  identically to `sv_sso_session` + `cf_clearance`).
* **Scope the cookie HOST-ONLY on both hosts** — `<branch>.qa.shopview.com` and
  `<branch>api.qa.shopview.com` as two entries, **never a leading dot / the parent domain**. A
  domain-scoped cookie sends two same-name cookies, the server reads the stale one, and
  `fe-permissions` answers 409 right after a 200 quick-login. **That 409 is duplicate cookies, never a
  dead session** — and misreading it is what produced a false "the QA lead's session is destroyed"
  report on 2026-09-02.
* **A mid-run 401 or 409 is a RE-BOOT, not a blocker, and not a reason to contact the QA lead.** Run
  the harness again and carry on. Eviction between two sessions on one branch is expected branch
  behaviour (Rule 83: one session per branch); the harness makes it cost seconds.
* **Judge the session by `template_slug` + `fe_permissions` count, never by `role.name`** — on sv9315
  the *correct* `admin` boot reports `role.name` = "Tech View".

**Today's two live proofs, both on `sv9315`, both against build marker `v26.35.6-0f8d60b`:**

| # | Run | Observed |
|---|---|---|
| 1 | 2026-09-02, commit `c44dc37e` — re-proof of the `bootOrigin()` refactor, exercised **three ways** (the CLI, the exported `boot()`, the exported `bootOrigin()`) | **exit 0** · `localStorage["user"]` **present** · landed `https://sv9315.qa.shopview.com/customers`, *not* `/login` · `GET /api/auth/me/fe-permissions` **200** · `fe_permissions.length` **40** · `template_slug` **`administrator`** |
| 2 | 2026-09-02 (later) — re-proof after `ensure_bridge.sh` and the harness summary line were edited (Rule 12: an edited file is not a proven file) | **exit 0** · `localStorage["user"]` **present** · landed `https://sv9315.qa.shopview.com/customers`, title `Customers | ShopView`, **2,867** body chars (sign-in form is 225) · `GET /api/auth/me/fe-permissions` **200** · `fe_permissions.length` **40** · `template_slug` **`administrator`** |

Both read-only: no ShopView record was created, modified or deleted; the only POST was the app's own
`/api/quick-login`. **Full confidence stamps and the traps live in playbook §A — read it, not this
summary, before driving a branch.**

**What is still true on a QA branch:** `sv_sso_session` itself expires (~24 h, or on a deploy), and
only the QA lead can re-mint it. **That is a routine re-supply, not this blocker.** Escalate only when
`sv_sso_session` itself is refused.

---

## 🔴 STILL BLOCKED — `app.staging.shopview.com`

**What is blocked:** anything on **staging** that needs to be signed in — driving the SPA, reading an
authenticated API response, observing a control, confirming a label, running a permission negative, or
producing any live PASS/FAIL verdict there. Under Rule 12 none of it may be inferred.

**Concretely still blocked by this:** the 28-row staging Navigation Map re-observation (playbook
*"RE-OBSERVATION ATTEMPT — 2026-08-31 · 0 of 28 rows re-observed"*) and the Custom Roles 4-layer
permission VIU, which is a staging process.

**What was probed, and the exact responses** (live 2026-08-31 unless dated otherwise; **no staging
login has been attempted since — the QA lead has asked not to be re-prompted for staging cookies**):

| Probe | Result |
|---|---|
| `GET https://app.staging.shopview.com/index.html` | **HTTP 200** · build marker **`v26.35.6-49e216a`** · `last-modified: Fri, 28 Aug 2026 08:31:04 GMT` · `etag: "7ee61447ee66167ad918fee664be24ea"` |
| `GET https://api.staging.shopview.com/` | **HTTP 200** `{"data":[]}` — the API host is up |
| `GET https://api.staging.shopview.com/api/auth/me/fe-permissions` (no cookies) | **HTTP 401** `{"error":"sso_required","sso_redirect_url":"https://auth.staging.shopview.com/login?return_to=…"}` |
| `GET https://api.staging.shopview.com/api/auth/me/fe-permissions` with the stored cookie header `/tmp/qa-cookies/reports-cookie-header.txt` (2026-08-21) | **HTTP 401** |
| `POST https://api.staging.shopview.com/api/quick-login {"key":"admin"}` | **HTTP 401** — the **identical** `sso_required` body. Quick-login is itself SSO-gated, so it is **not** a way in from a cold jar |
| `POST https://api.staging.shopview.com/api/login {username,password}` (2026-08-28) | **HTTP 401** `sso_required`. The §K `POST /api/login` recipe is **PROD-ONLY and does not transfer** — a ShopView username + password cannot mint a staging session |
| Following the `sso_redirect_url` to `https://auth.staging.shopview.com/login?...` | **HTTP 200 — the real Google sign-in page** (`accounts.google.com`, `hd=shopview.com`, `prompt=select_account`) |

**Root cause, and why nothing here can be self-minted:** the app authenticates via **Google SSO (OIDC
to `accounts.google.com` via `auth.<env>.shopview.com`)** and there is no Google-SSO automation in this
workspace. Corroborating observation: `build/viu-testrail/results-misc.json`
(`actual_ui_observation`) — a Tech quick-login in a separate cookie jar *"redirect[ed] to the real
Google sign-in page (accounts.google.com), which is out of scope (no Google SSO automation)."*

**⚠️ STAGING SITS BEHIND CLOUDFLARE**, unlike the CloudFront + nginx QA branches (`cf_clearance` at the
edge). **So the QA-branch finding that `cf_clearance` is inert does NOT transfer to staging** —
`cf_clearance` may well matter there.

---

## ✅ SETTLED FOR STAGING 2026-09-02 — THE `DEV MODE — QUICK LOGIN` PANEL IS THERE

**`https://app.staging.shopview.com/login` DOES render a `DEV MODE — QUICK LOGIN` panel with `Admin`
and `Tech` buttons**, visually identical in placement and labelling to the QA-branch panel. The
staging login card also carries a normal **email + password** sign-in form above the panel.

**PROVENANCE — read it before citing the fact (Rule 12): observed by the QA lead via a screenshot of
the live staging login page, 2026-09-02.** **Not** executed, clicked or reproduced by a session, and
**not** evidence that the staging quick-login *flow* works headlessly — only that the panel renders.

**This closes what this file used to list as open question 1**, which said *"No observation of a
`DEV MODE` panel on staging exists anywhere in this repo… Panel present? Unknown. Panel absent? Also
unknown."* **Panel present. Settled.** What remains true is only that **every recorded staging *use*
is the API endpoint** — `POST /api/quick-login {key:'admin'|'tech'}`, called from Node under the
**three cookies** and followed by hand-writing `localStorage`: `build/TESTING-RUNBOOK.md` §3,
`build/testing-tools/staging-admin.mjs` `login()`, `build/custom-roles-run/RUN331-STATE.md`,
`build/custom-roles-run/live-ui-2026-07-16/staging/approve-decline-TECH-PT.json`
(`"method": "quick-login tech (real session)"`), and as recently as 2026-08-19
`build/filters/build-verify-2026-08-19/tools/mobile.mjs`, which visits `/login` only as a same-origin
landing pad and **never clicks a button**.

The old negative remark about staging buttons (*"the DEV login BUTTONS don't reliably work"*,
`build/custom-roles-run/WORDING-VIU-STATE-2026-07-13.md`) **can no longer mean the panel is absent**.
The selector bug that explains it on a QA branch (`getByRole('button',{name:/^Admin$/})` not matching
a Quasar `q-btn`; `button:has-text("Admin")` does) was proven on a **QA branch**; now that staging is
known to render the same panel, that explanation is **more likely — and still not demonstrated on
staging.** Do not state it stronger than that.

---

## 🟡 STILL UNOBSERVED FOR STAGING — unsettled, not decided

Recorded so the next session does not treat either as settled in **either** direction:

1. **Whether clicking that panel HEADLESSLY on staging completes the login** the way it does on a QA
   branch. The panel **rendering** is settled (above); the **click-through is not**. Every recorded
   staging use to date is the API route plus hand-hydration, so the click route on staging has never
   been executed by anyone. ⇒ **Hand-hydration remains the recorded staging fallback** until someone
   proves the click route with a valid staging session — not because staging lacks a panel, but
   because that route there is unexercised.
2. **Whether `sv_sso_session` alone suffices on staging.** Proven on QA branches, **unproven here**
   because of Cloudflare (above): **the QA-branch finding that `cf_clearance` is inert does NOT
   transfer** — QA branches are CloudFront + bare nginx, staging is behind Cloudflare. Do not assume
   either way.

Neither can be settled from what is held: we have **no staging `sv_sso_session`**, and probing further
is not authorised. **Do not attempt a staging login to settle them, and do not re-prompt the QA lead
for a staging cookie.**

---

## What still works on any host without a session

Unauthenticated `GET /index.html`, which serves `<meta name="app-version">`, `last-modified` and
`etag`. That is enough for a **build marker** (Rule 49) and nothing more.

---

## ORIGINAL EVIDENCE AND ASK, kept as written on 2026-08-21

Preserved rather than deleted, so the rescoping above is auditable. **The "three values" table below
is the STAGING shape; on a QA branch it is superseded — `sv_sso_session` alone, host-only.**

> ## Evidence
>
> * `GET https://api.staging.shopview.com/api/auth/me/fe-permissions` with the stored cookie header
>   from `/tmp/qa-cookies/reports-cookie-header.txt` → **HTTP 401**.
> * The stored cookie sets in `/tmp` are dated **2026-08-04** and **2026-08-10** — 11 to 17 days old,
>   against a documented lifetime of about **24 hours, or less if a deploy lands**.
>
> ## Exactly what is needed
>
> A fresh cookie set for the host to be driven — **three values**:
>
> | Cookie | Shape |
> |---|---|
> | `sv_sso_session` | 64-hex |
> | `PHPSESSID` | 32-hex |
> | `cf_clearance` | Cloudflare clearance string |
>
> Domain `.shopview.com` for staging, `.qa.shopview.com` for a QA branch. Supplied into `/tmp` only,
> **never committed** (Rule 6 secrets bar). Name the host they belong to — a Filters-branch cookie does
> not authenticate the Schedule API.

---

## Who can clear the remaining half

The QA lead — **for staging only**, and it is now a much smaller ask than the original. **Two options
exist; both need HIM, and only he can choose between them.**

**Option 1 — a fresh cookie (the standing ask).** A fresh **`sv_sso_session` for
`app.staging.shopview.com`** (plus `cf_clearance` if Cloudflare demands it), into `/tmp` only, naming
the host. Tracked in `build/OUTSTANDING-ITEMS-REGISTER.md` row **R1**. **Clears the blocker for one
session's lifetime only** — the cookie dies in ~24 h or on a deploy, so the ask recurs.

**Option 2 — NEW, and only a POSSIBILITY: a staging account whose credentials a session may use.**
The QA lead's 2026-09-02 screenshot shows the staging login card carries a normal **email + password**
sign-in form above the DEV MODE panel. **That is a potential route to a staging session that does not
depend on him pasting a cookie**, and it would **clear the staging blocker permanently rather than for
one session's lifetime**.

**🛑 IT NEEDS HIS EXPLICIT AUTHORISATION, AND NOTHING HAS BEEN TRIED.** A credential is for a system
he has **not** authorised us to log into, so:
* **Not attempted.** No credential has been used, sought or assumed; **do not assume such an account
  exists.** Recording the option is not permission to exercise it.
* **Never in the repo.** If he ever authorises it, the values are `/tmp` only, `chmod 600`, never
  committed — this repo is PUBLIC (Rule 82).
* **Not known to work even if authorised.** `POST https://api.staging.shopview.com/api/login
  {username,password}` was probed on 2026-08-28 and answered **HTTP 401 `sso_required`** (table
  above), so the *API* credential route is already refused there. The **UI form** is a different path
  and may hand off to `auth.staging.shopview.com` / Google SSO instead — **unknown, and it stays
  unknown until he rules.**

**Do not re-prompt him for either option unbidden** — he has asked not to be re-prompted on staging
cookies. Raise it only when a piece of work genuinely needs staging, and say which piece.
