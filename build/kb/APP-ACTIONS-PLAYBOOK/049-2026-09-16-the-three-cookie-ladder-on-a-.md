## 🆕 2026-09-16 — THE THREE-COOKIE LADDER ON A QA BRANCH API HOST, MEASURED (sv9160, build `v26.36.7-21b4db9`)

**NAMES ONLY — no values here, ever (Rule 82; this repo is public).**

Handed a fresh cookie set from a browser, the question is always *"which of these actually
authenticates, and which are noise?"* Measured as a controlled ladder against
`GET https://sv9160api.qa.shopview.com/api/auth/me/fe-permissions`:

| Cookies sent | Result | What it means |
|---|---|---|
| nothing | **401** `{"error":"sso_required", "sso_redirect_url":"https://auth.qa.shopview.com/login?…"}` | no session at all |
| `PHPSESSID` alone | **401** `sso_required` | the app session without the SSO session is worthless |
| `sv_sso_session` alone | **409** `{"errors":[{"error":"Session has expired."}]}` | **SSO is valid; the APP session is missing.** This is NOT an expired SSO cookie |
| **`sv_sso_session` + `PHPSESSID`** | **200** `{"data":{"fe_permissions":[…]}}` | ✅ authenticated |
| + `cf_clearance` | **200**, identical | `cf_clearance` is inert here (app host = CloudFront, API host = nginx; no Cloudflare in path) |

**⇒ THE TWO TRAPS THIS CLOSES.**

1. **`409 Session has expired.` DOES NOT MEAN THE SSO COOKIE IS DEAD.** §A already records one cause
   (duplicate domain-scoped cookies). There is a second, and it looks identical from the outside:
   **a valid `sv_sso_session` with no `PHPSESSID` alongside it.** Over `curl` there is no cookie
   scoping at all, so the duplicate-cookie explanation cannot apply — if you see 409 on a plain
   `curl`, **you are missing `PHPSESSID`, not holding a dead session.** Ask for both, or let
   quick-login mint the `PHPSESSID` for you.
2. **`401 sso_required` + a redirect to `auth.qa.shopview.com` IS NOT "the branch now requires
   Google SSO and quick-login has been removed".** That is precisely what I concluded on 2026-09-15
   and recorded as L0133, and it was **wrong**. With a live `sv_sso_session` in place,
   `GET /api/quick-login/users` answers **200** and the DEV MODE panel (Admin / Tech) is on the
   sign-in page exactly as always. **A 401 on the API host is a statement about your cookie jar,
   never about the product (Rule 104, proof 1: positive control).**

**THE SPA STILL DOES NOT SELF-HYDRATE FROM COOKIES — this part of §A is unchanged and was re-proven
today.** Cookies set host-only on both hosts + a navigation to `/customers` lands on
`/login?redirect=/customers` (225-char sign-in page, `fe_permissions_wrapper` absent), even though
the very same cookies return 200 from the API over `curl`. **The browser needs the login RESPONSE.**
So do not hand-assemble a browser session from cookies; carry the `sv_sso_session` and let the
recorded launcher perform the quick-login:

```bash
source build/testing-tools/ensure_bridge.sh                 # exports BRIDGE_PORT, generates the cert
printf 'sv_sso_session=%s\n' "$VALUE" > /tmp/qa-cookies/<branch>-sso.txt && chmod 600 "$_"
node build/testing-tools/qa-branch-boot.mjs <branch> /customers admin
```

Observed end to end on sv9160 today: `POST /api/quick-login` **200** → `fe-permissions` **200** →
`template_slug=administrator`, **43** permissions → landed `https://sv9160.qa.shopview.com/customers`
(3,286 body chars), **not** `/login`.

**DO NOT WRITE A SECOND BOOT SCRIPT.** A cookie-only launcher was written today, proven to land on
`/login`, and **deleted** — `qa-branch-boot.mjs` is the one implementation and the §A warning about
forking it stands.

**Production, re-proven the same day:** `node build/testing-tools/prod-login-boot.mjs` via the same
bridge → `https://app.shopview.com/customers`, `app-version=v26.36.7-cf5012e`, 43 permissions, on the
recorded production TEST account from `/tmp/shopview/prod-login.env`. **Never log in as the QA lead's
own production account** — a second login for the same user expires his PHPSESSID and signs him out
(§K trap 2). He supplied his own credentials on 2026-09-16; they were stored `chmod 600` in `/tmp`
and deliberately **not** used for this reason.


---

