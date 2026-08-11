# Schedule labels-final — build and environment verification, 2026-08-11

## 1 · The build did not move — a SIXTH independent read

| | |
|---|---|
| **App version** | **`v3.5-65d6500`** |
| **`index.html` last-modified** | **Tue, 11 Aug 2026 09:33:33 GMT** |
| **etag** | `3250d285ffcf50626363a578fe273071` |
| **`index.html` sha256** | `9348ca09d6167375dc52bfc29bf3b9f8c4163dede2ea5ea62269b186c9cc5f6f` |
| **Read by THIS pass at** | **2026-08-11T18:05Z** |
| **Verdict** | **IDENTICAL on every marker** to the five reads taken by the build-VIU pass (13:16:21Z and 13:20:42Z) |

**This read was taken by this pass, unauthenticated.** `index.html` is served without a session, so
the build marker is verifiable even with the app session dead — which is exactly why it is the marker
we standardise on. **No redeploy has occurred since the labels were harvested**, so the observations
the 12 corrections rest on are observations of the build that is running now.

## 2 · The app session is DEAD, and Task 3 could not run

```
GET https://sv8685api.qa.shopview.com/api/auth/me/fe-permissions  ->  HTTP 401
{"error":"sso_required","sso_redirect_url":"https://auth.qa.shopview.com/login?..."}
```

**Probed on the API host, never the app host** — the app host answers 200 on any path (SPA shell) and
can therefore never tell you anything (playbook §A trap 2). **Probed twice**, ~17 minutes apart
(17:45Z and 18:04Z), and on **two** API hosts (`sv8685api`, `sv8582api`) — **401 every time**.

**The diagnosis is different from this morning's, and the distinction is the useful part.** The
build-VIU pass got **409 `Session has expired.`**, which is the signature of *our own `PHPSESSID`*
being invalidated while the **shared** token lived. **This is a 401 `sso_required`** — the signature
of the **shared `sv_sso_session` itself being dead**. So this is not a repeat of the staff-record-edit
trap; it is the ordinary ~24 h estate-wide expiry.

**Corroborated by what is on disk:** `/tmp/qa-cookies/` holds **only** `reports-cookie-header.txt`,
minted **2026-08-10 22:44** — roughly **19 hours** before this pass. **The Schedule cookie file this
container would need does not exist at all**; it lived in a container that is gone.

**`quick-login` and `switch-user` were NOT called.** Both rotate the shared token and would sign the
QA lead out of his own browser, and sibling workers with it. The brief bars them twice. **This is a
deliberate, costed decision, not an oversight** — one call would very probably have restored access.

## 3 · Environment — nothing touched, because nothing could be

| | |
|---|---|
| Records created | **0** |
| Records edited | **0** |
| `ZZAUTOTEST` artefacts | **0** — none exist from this pass |
| Settings changed | **0** |
| Roles changed | **0** |
| `change-location` calls | **0** |
| Shifts / events / series created, moved or deleted | **0** |
| `quick-login` / `switch-user` | **never called** |
| Jira calls of any kind | **0** — the Rule-62 creation hold stands untouched |

**Nothing was seeded and nothing needs restoring.** The seeding authorisation the QA lead gave was
never the constraint; the session was.

## 4 · TestRail

| | |
|---|---|
| **Writes** | **12 × `update_case`**, all HTTP 200 |
| `add_case` / `delete_case` / section writes | **0 / 0 / 0** |
| **Run writes** | **0** |
| Result writes | **0** |
| **Run 357, read-only re-check** | `include_all=false`, **174 tests**, **529 results**, **89 Passed / 6 Failed / 2 Blocked / 77 Untested** — exactly as `build/RECOVERY-2026-08-11/STATE.md` recorded it |
| **164 non-target Schedule cases** | proven **byte-identical BY CONTENT** across 9 fields — **0 differences** |

## 5 · Sources (Standing Rule 31 + 59)

| Source | Identifier | Version / marker | Checked | Verdict |
|---|---|---|---|---|
| **Specification** | Confluence `713031682` | **v27**, `2026-08-07T15:01:20.801Z`, 43,064 chars, sha256 `4c51fb72…` | **17:48:53Z and again at write start 17:50:09Z** | ✅ **CURRENT** — byte-identical to the committed mirror `raw-v27.xml` |
| **Build** | `sv8685.qa.shopview.com` | `v3.5-65d6500`, sha256 `9348ca09…` | 18:05Z | ✅ **CURRENT** — unmoved since the harvest |
| **Epic** | SV-8685 | — | **not re-read this pass** | ⚠️ **NOT CHECKED** — no epic-derived claim is made here; the 12 corrections are label-only and turn on no story text |
| **Design** | `build/schedule/design-2026-07-27/` | undated share link exists elsewhere | not re-read | ⚠️ **PARTIAL** — the standing Rule-57 gap, unchanged by this pass and not relied on |
| **Local case source** | `build/schedule/cases/` | — | recovery pass verified 176/176 byte-identical to live earlier today | ✅ **IN STEP** at that point; **re-sync before regenerating anything** now that 12 have changed |

**The spec was verified by BODY CHECKSUM, not by version number** — the in-body *"Version"* field on
that page reads `1.0` and lies (Rule 31 trap (a)).
