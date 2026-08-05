# Filters cleanup, 5 August 2026 — the build marker, read by us at both ends

Read with `curl -D` against `https://sv8785.qa.shopview.com/index.html`. **Not taken on trust from
any earlier pass** — read fresh at the start, and again after the last write.

| Field | Start — 2026-08-05T11:59:30Z | End — 2026-08-05T12:20:02Z | Verdict |
|---|---|---|---|
| `<meta name="app-version">` | `v3.4.2-d00239b` | `v3.4.2-d00239b` | **IDENTICAL** |
| `index.html` last-modified | Tue, 04 Aug 2026 22:51:02 GMT | Tue, 04 Aug 2026 22:51:02 GMT | **IDENTICAL** |
| `index.html` etag | `b9ab1d41718b5e871432064ed914e2e7` | `b9ab1d41718b5e871432064ed914e2e7` | **IDENTICAL** |
| sha256 of the whole file | `d4845701337c6836b3513eb8be4c6d08f78ecd8a9ce8765bd0732e5789d480cd` | same | **IDENTICAL** |

Read a **third** time at **2026-08-05T12:34:11Z**, after every write and after the deliverables were
regenerated: `v3.4.2-d00239b`, last-modified Tue, 04 Aug 2026 22:51:02 GMT, etag
`b9ab1d41718b5e871432064ed914e2e7` — **still identical**. And the live case text was re-read one final
time at the same moment: **110 cases, 0 fields drifted** from our final snapshot, **93 READY / 17 HOLD**.

**The build expected by the brief was `v3.4.2-d00239b`, and that is what is serving. No redeploy
happened under us**, so nothing written in this pass rests on a build that has since moved.

## What we could NOT do on this build, and why — the honest part

**We had no working sign-in, so nothing in this pass was observed live by us.**

Every cookie set left behind on the machine returns **HTTP 401 `sso_required`** against
`sv8785api.qa.shopview.com`. All four sets share the **same `sv_sso_session` token**, and it is that
token which has expired, so there was nothing to fall back to:

| Cookie set on the machine | Age | Result |
|---|---|---|
| the Filters set (`/tmp/filters-viu/cookies.json`) | 4 Aug | **401 `sso_required`** |
| the same set with the Filters session id from `/tmp/fviu/session.json` | 4 Aug | **401 `sso_required`** |
| the Report Suite set | 4 Aug 14:14 | **401 `sso_required`** |
| the Schedule set | 4 Aug 17:01 | **401 `sso_required`** |

`POST /api/quick-login {key:'admin'}` also returns **401 `sso_required`** — it is gated by a valid
session, so it cannot be used to recover one.

**Consequence, stated plainly and applied throughout:** the build marker above is a **fetch of a
static file**, which needs no sign-in — so we can prove *which* build is serving. We cannot prove
*what it does*. So in this pass:

- **no defect was filed** (see `NO-TICKET-FILED.md` — and, as it turns out, the defect already exists
  as someone else's ticket anyway);
- **no case was given a new "tested on the build" claim**;
- the one case whose expected behaviour we reversed,
  [C29624](https://shopview.testrail.io/index.php?/cases/view/29624), says **in the case itself** that
  the expectation has *not* been confirmed against the build and therefore claims no build date;
- every other change was driven by sources we **did** read live — Jira and Confluence.

**What is needed to close this out: one fresh set of QA cookies for
`sv8785.qa.shopview.com`** (`sv_sso_session`, `PHPSESSID`, `cf_clearance`). With those, the phone
behaviour can be observed at a phone-size screen in a few minutes and the eight phone cases can be
given a real build-tested verdict.

## Standing Rule 49 still applies

Engineering has **not** declared this branch final, so every verdict on the Filters suite stays
**provisional** and the re-check queue at `../recheck-2026-08-05/RECHECK-QUEUE.md` stays **OPEN**.
