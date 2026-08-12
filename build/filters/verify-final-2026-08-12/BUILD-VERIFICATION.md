# Filters — build verification, 2026-08-12

> **⚠️ PARTIAL — this pass was stood down during orientation. The build and both sign-ins WERE
> verified live; no page of the application was opened and no label was read.**

## 1 · The build, and it has not moved

| | |
|---|---|
| `app-version` | **`v3.6-3e9dd6d`** |
| `last-modified` | **Tue, 11 Aug 2026 07:45:44 GMT** |
| `etag` | `b1b2623f07bec03883f57a0e17204431` |
| `index.html` sha256 | `fa01a52544d9fc96113f6785bec26bb43771af57fe2bc8c6120d4b6fbb11d4cb` |
| read at | **2026-08-12T06:11:01Z** |

This is the **same build the 11 August pass checked 106 of 114 cases against**, unmoved since
11 August 07:45 GMT. That is what makes the re-stamp both owed and legitimate — and it is the single
premise the next worker must re-confirm before writing anything.

**Read once, at session start.** A second read at write time was not taken because no write was ever
reached; the next pass owes both reads (Rule 59).

## 2 · Both sign-ins, proven to be different people BEFORE any observation

Checked on the **api** host `sv8785api.qa.shopview.com`. The **app** host returns 200 on any path,
so it cannot prove an identity or a permission.

| Check | Administrator | Technician |
|---|---|---|
| `GET /api/auth/me/fe-permissions` — count | **42** | **6** |
| — `view_mode` | `full` | **`tech`** |
| `GET /api/iam/view-profile/` — email | `admin@shopview.com` | **`bilal.muzamil+filters@shopview.com`** |
| `GET /api/staff?limit=5` | **HTTP 200** | **HTTP 403** |

**The contrast is the proof.** The administrator reaches the resource; the technician is refused
before it, with a clean `403` rather than a server error.

Separate cookie jars, separate files, `chmod 600`, under `/tmp/qa-cookies/`. **Never merged, never
written into the repository or into any evidence file.**
**`quick-login` and `switch-user` were never called.**

## 3 · What was NOT verified — stated plainly

- **No page of the application was opened.** No harness was run; no browser context was created.
- **No on-screen label was read**, so no label claim in this folder rests on this session.
- **No precondition, step or navigation path was walked.** 0 of 115.
- **No case verdict was established or re-established.** 0 of 115.

## 4 · Suite counts, read live and reconciled

| | |
|---|---|
| Ours / live under group 4110 | **115 / 120** |
| Foreign — Ahtasham Amjad, user 7 | C43576, C43577, C43578, C43579, C43580 |
| Foreign proven byte-identical | **yes** — 30 shared fields each, 0 differ, `updated_on`/`updated_by` included |
| Run 352 | **115 tests · 473 results · `include_all` false** |
| Run case-id set vs our 115 | **equal in both directions** |

Baseline snapshots for the next worker to diff against: `evidence/run352-snapshot.json` and
`evidence/case-census-2026-08-12.json`.
