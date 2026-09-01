# BLOCKED — the shared ShopView `sv_sso_session` is dead (1 September 2026, ~08:25 UTC)

**What is blocked:** every further LIVE observation on any `.qa.shopview.com` branch — so the rest of
the 6597 build verification, and all of 6617.
**What is NOT blocked:** TestRail (a different system, still answering), the repo, and all the
offline work — verdict write-up, case content generation, reports.

## The exact ask

**A fresh `sv_sso_session` cookie value for `*.qa.shopview.com`** — by that name. Nothing else is
needed: this estate has no Cloudflare in front of it (`build/QUICK-LOGIN-DIAGNOSIS-2026-08-28.md` §8),
so there is no `cf_clearance` to refresh, and `PHPSESSID` is minted per branch by `quick-login` once
the SSO session is alive again.

## Why this is the shared sign-in and not my own mistake

`build/skills/00-COMMON-CORE.md` §6.1 gives the signature of a genuinely dead shared sign-in as three
things together. All three hold:

| Check | Result |
|---|---|
| Both branches refuse at once, on a byte-identical shared token | `sv8218api` **401** and `sv9315api` **401**; the `sv_sso_session` value is the same string in both cookie files |
| The refusal arrives from the application as JSON | `{"error":"sso_required","sso_redirect_url":"https://auth.qa.shopview.com/login?…"}` |
| Nothing returns 409 | no branch returned 409 `Session has expired.`, which would have meant only a per-branch `PHPSESSID` was wrong |

And `quick-login` is **not** a recovery route in this state — it is itself SSO-gated and answers 401,
which it did.

## The searches I ran before calling it blocked (Rule 97)

1. `grep -rn "sso_required" build/ --include=*.md` — 20 hits; read
   `build/skills/00-COMMON-CORE.md` §6 (the five traps and the 401/409 table),
   `build/skills/14-ACCESS-RESILIENCE.md` §3 (failure signature), and
   `build/QUICK-LOGIN-DIAGNOSIS-2026-08-28.md` (which proves no `cf_clearance` is involved on QA).
2. Tried the **original** cookie pair the QA lead supplied this morning, unmodified — 401.
3. Tried `sv_sso_session` **alone**, and the sv8218 token against the sv9315 `PHPSESSID` — 401 both.
4. `POST /api/exit-switch-user` and `POST /api/quick-login {admin}` — 401 both, as §6.1 predicts.
5. Re-read the build markers, because §6.3 says cookies also die on a deploy:
   **sv8218 has moved from `v26.35.5-8c3cc21` to `v26.35.5-baf205d` since this morning**, so a deploy
   did happen on the estate. **sv9315 has NOT moved** (`v26.35.6-598cc8a` at the start of the probing
   and again now), so every verdict recorded today is against one single build.
6. `ls build/BLOCKED-*.md` and the register — the prior `BLOCKED-shopview-app-session.md` is the same
   failure on the older estate and carries no self-service recovery either.

There is no self-service route: minting a new SSO session means authenticating against
`auth.qa.shopview.com`, which per §6 trap 5 and the 2026-08-28 diagnostic would rotate the QA lead's
own session out from under him. That is not mine to do.

## Where 6597 stands at the moment of the block

- **48 of 119 cases have a live PASS verdict**, 1 a live FAIL, 1 is foreign and untouched
  (C45220, Vladimir Tomovic's, Automated). 69 remain.
- All seven areas of the suite had their backbone verified BEFORE the block, so nothing about "is the
  feature built" is outstanding.
- Nothing has been written to TestRail for this suite yet. The content is being prepared offline so
  the write pass can run the moment the cookie arrives.
