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

## The marker read three times — the build did NOT move under this pass

| read | UTC | app-version | etag | sha256 of `index.html` |
|---|---|---|---|---|
| start | 2026-08-12T03:19:07Z | `v3.6-8c28eed` | `68041643da19d1e525c3e1e31cf09d35` | `441a150c…b944983` |
| mid-run (after the writes) | 2026-08-12T03:56:52Z | `v3.6-8c28eed` | `68041643da19d1e525c3e1e31cf09d35` | `441a150c…b944983` |
| end | 2026-08-12T04:05:22Z | `v3.6-8c28eed` | `68041643da19d1e525c3e1e31cf09d35` | `441a150c…b944983` |

**Byte-identical all three times**, so nothing was redeployed under this session and every
observation here belongs to one build. Session still returning **HTTP 200** at the end.

Developers are still deploying, so this will not stay true — but nothing read in this session needs
re-reading on account of a mid-pass deploy.

## What this means for the 480 cases

**Not one of the 480 carried a `v3.6-8c28eed` build line before this session.** The build lines
across the suite stood at:

| build named in Rule-54 sentence 2 | cases |
|---|---:|
| `v3.5-16cf83f` (8/6) | 213 |
| `v3.5-7168d14` (8/6) | 129 |
| `v3.4.1-3d03023` (8/4) | 64 |
| `v3.5-f77875c` (8/6) | 48 |
| `v3.5-4795eee` (8/10) | 13 |
| `v3.5-16cf83f` (8/5) | 4 |
| **no build line at all** | **9** |

**8 cases now name `v3.6-8c28eed`** — the eight this session actually observed. The other 472 were
left exactly as found, because a build line is a record of a check that happened, and inventing one
would make every honest line in the suite worthless.

**The 9 with no build line are NOT a defect.** Each says in its own words that it has not been
checked against any build, which is exactly what Rule 60 requires: C30169, C30288, C43550, C43558,
C43559, C43591, C43592, C43593, C43594.
