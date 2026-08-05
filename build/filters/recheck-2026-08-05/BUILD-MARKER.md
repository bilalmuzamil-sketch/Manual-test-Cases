# Filters re-check, 5 August 2026 — the build marker, read independently

**The redeploy is confirmed by our own reading, not taken on trust.**

| Field | Value | When we read it |
|---|---|---|
| branch | `sv8785.qa.shopview.com` | 2026-08-05 |
| `<meta name="app-version">` | **`v3.4.2-d00239b`** | 03:38 UTC (start) |
| `index.html` last-modified | Tue, 04 Aug 2026 22:51:02 GMT | 03:38 UTC |
| `index.html` etag | `b9ab1d41718b5e871432064ed914e2e7` | 03:38 UTC |

The build the 4 August verdicts were measured on was **`v3.4.2-4f8211c`** (last-modified
Mon, 03 Aug 2026 20:09:32 GMT, etag `cf3ffbad546f569b2b86c36b53d87514`). So **every one of the
110 rows, and every one of the 110 provenance lines, names a build that is gone.**

Marker re-read at the mid-point and at the end of this pass — see `marker-MID.json` and
`marker-END.json` in `evidence/raw/`.

The session supplied on 4 August was **still alive** — `GET /api/auth/me/fe-permissions` → HTTP 200
and `GET /api/work-orders` → HTTP 200 on the first attempt, so we logged in once and reused it.
