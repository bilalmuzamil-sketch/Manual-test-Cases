## ⛔ CORRECTION 2026-09-17 — `sv_sso_session` **DOES** EXPIRE. THE PLAYBOOK SAID IT DOES NOT.

§A records, in bold: *"the only value you carry is the one that never rotates"*, and the 2026-09-16
entry repeats it. **Measured today: it expires.** One value worked all morning (search 200, boot as
administrator with 43 permissions) and then answered
`401 {"error":"sso_required","sso_redirect_url":"https://auth.qa.shopview.com/login?..."}`
on every call about forty minutes later, with the branch still up and the build marker unchanged
(`v26.36.7-29ca209`). A fresh value from the QA lead's browser restored everything immediately.

**"It does not rotate" was true of the value; "it never goes stale" is not.** Those are different
claims and conflating them costs a session real time, because a stale sign-in cookie presents
exactly as *the branch removed quick-login and now demands Google SSO* (that is learning L0133, and
it was wrong for this reason).

### The diagnosis, in order — 30 seconds, no browser

```
curl -s -o /dev/null -w '%{http_code}\n' https://<branch>.qa.shopview.com/           # 200 = branch is up
curl -s -H "Cookie: sv_sso_session=$SSO" https://<branch>api.qa.shopview.com/api/quick-login/users
```
* **200 + a users list** → the sign-in cookie is good; any failure is elsewhere.
* **401 `sso_required`** → **the sign-in cookie is stale. Ask for a fresh one. Nothing else fixes it.**

### What does NOT fix it — all four tried and measured on 2026-09-17

| Route | Result |
|---|---|
| `POST /api/login` with the recorded account | **401 `sso_required`** — the branch defers to SSO, there is no password door |
| the app-session cookie (`PHPSESSID`) alone | 401 `sso_required` |
| both cookies together | 401 — a `PHPSESSID` minted against a dead SSO session dies with it |
| `auth.qa.shopview.com/callback` directly | `400 Missing code or state parameter`; `/session` and `/me` are 404 — the callback needs an OAuth code and state only a real Google sign-in produces |

**⇒ A stale `sv_sso_session` is the one QA-branch blocker that Rule 107 cannot self-serve.** Say so
in one line and ask for a fresh value; do not spend a pass re-deriving these four dead ends.

**AND REFRESH THE APP SESSION AFTER SWAPPING IT IN:** the old `PHPSESSID` is tied to the dead SSO
session. `POST /api/quick-login {"key":"admin"}` with the new cookie mints a live one — take the
`PHPSESSID` from its `Set-Cookie` and write it into the profile, or every later call answers 409.

---

