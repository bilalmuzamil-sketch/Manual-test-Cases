# Build verification — Report Suite QA branch `sv8582`, 12 August 2026

## The marker, read at the start of the session

| | value |
|---|---|
| `<meta name="app-version">` | **`v3.6-8c28eed`** |
| `last-modified` on `index.html` | Tue, 11 Aug 2026 05:15:49 GMT |
| `etag` | `68041643da19d1e525c3e1e31cf09d35` |
| sha256 of `index.html` | `441a150cdc514aedf8cb7de260c9d21b5d38794dedcfa2bfdfc3fcde0b944983` |
| read at | 2026-08-12T03:19:07Z |

## 🔴 THE BUILD HAS MOVED SINCE THE LAST REPORT SUITE PASS — AND IT IS A MINOR-VERSION BUMP

The 10 August pass (`build/report-suite/build-verify-2026-08-10/`) recorded **`v3.5-4795eee`**,
last-modified Fri 07 Aug 2026 13:10:42 GMT. The branch is now on **`v3.6-8c28eed`**, built
**Tue 11 Aug 05:15:49 GMT**.

So **every verdict recorded before this session predates the build now running**. Under Standing
Rule 60 that is the ordinary consequence of a branch under continuous deployment, not an alarm: it
touches **layer 1** (on-screen labels and navigation) and **layer 2** (the pass/fail verdict) and the
`HOLD` half of layer 3. It invalidates **no expectation**, because expectations come from documents
(Rule 57).

## Session

**ALIVE.** `GET https://sv8582api.qa.shopview.com/api/auth/me/fe-permissions` → **HTTP 200**, 42
front-end permissions, role **Admin**, default workplace **Staging Heavy Duty - 9919**
(`b3c8c820-…`). The `sv8582` `PHPSESSID` did **not** 409 — unlike the two Filters values a sibling
found dead. `quick-login` and `switch-user` were **never called**.

Tested on the **api** host, never the app host, which returns 200 on any path.
