# Session probe evidence — 2026-08-13

All probes `GET`. No `Cookie` or `Authorization` header value is recorded here.

| # | Host | Path | Cookies used | Result |
|---|---|---|---|---|
| 1 | `sv8685api.qa.shopview.com` | `/api/auth/me/fe-permissions` | the supplied set | **401** `{"error":"sso_required"}` |
| 2 | `sv8685api.qa.shopview.com` | `/api/organizations` | the supplied set | **401**, identical body |
| 3 | `sv8685api.qa.shopview.com` | `/api/auth/me/fe-permissions` | **control: `deadbeef` values** | **401**, byte-identical body |
| 4 | `sv8685api.qa.shopview.com` | `/api/auth/me/fe-permissions` | **control: no Cookie header** | **401** |
| 5 | `sv8685.qa.shopview.com` | `/this-path-does-not-exist-xyz` | the supplied set | **200** — app host answers 200 on any path |

Re-probed at four points across the pass: **all 401**.

## Build marker — static asset, no session needed

| Read | app-version | `index.html` sha256 (first 16) | last-modified |
|---|---|---|---|
| 1 | `v3.5-84846fa` | `adeae89352c17a27` | Wed, 12 Aug 2026 21:44:48 GMT |
| 2 | `v3.5-84846fa` | `adeae89352c17a27` | same |
| 3 | `v3.5-84846fa` | `adeae89352c17a27` | same |

etag `f689bc07afb51892df7b253c08838bfb`. **The build did not move under this pass.**
