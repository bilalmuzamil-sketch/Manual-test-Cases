# Staging seed — A/R and A/P "existing data stays the same" check (ZZAUTOTEST)

**One command** (resumable, idempotent; it skips whatever `seed-state.json` already records):
`cd scripts && python3 seed_staging.py ..` (cookies in `/tmp/staging/` only).
**Keyword:** `SEED A/R A/P STAGING BEFORE-FEATURE`. The only thing the QA lead supplies is his staging cookies
(`sv_sso_session`, `PHPSESSID`, `cf_clearance`).
🔴 Reseeding **after** the upgrade lands is pointless for this check: a new record has no "before". If one is lost, say so.

Endpoints come from the front-end code (Rule 115): `app/src/api/companies/index.ts` (`customers/create`,
`credit-memos`) and `app/src/api/parts/index.ts` (`parts-catalogue/add-vendor`, `parts-catalogue/vendor/credit/create`).
Vendors need a `tax_id`; "Exempt" (`0c47b1fb-38bb-4788-8719-6900c365e34c`) came from `GET /api/taxes`.

| Record | Number | Id | Amount | Dated | Seeded (UTC) | Serves | Proved on screen |
|---|---|---|---|---|---|---|---|
| Customer "ZZAUTOTEST SV11315 Staging CM" | — | `0fadcac2-658b-4fed-a15a-03f8cfb54b09` (account `92c57b6d-6878-4a33-9fd6-af4e497f4e6d`) | — | — | 06:29:00 | holds the two credit memos | A/R Aging Detail rows below |
| Credit memo | **CM2-4540** (API: CM-4540) | `1377cdeb-06be-4cc4-a989-84041bf79343` | $5.00 | **14 Nov 2026** 07:00 UTC | 06:29:06 | C1062590 (as of its own date, from 14 Nov) | A/R Aging Detail as of 2026-11-14: "1-30 days past due (384)" → `Nov 14, 2026 \| Credit \| CM2-4540 \| ZZAUTOTEST SV11315 Staging CM \| Staging Heavy Duty - 9919 \| Nov 14, 2026 \| $-5.00 \| $-5.00` |
| Credit memo | **CM2-4541** (API: CM-4541) | `47398225-4abd-4e59-bd70-b594529701b3` | $3.00 | **12 Nov 2026** 06:38:47 UTC | 06:43:51 | C1062590 and C715471 (as of 12 Nov, any day after the upgrade) | A/R Aging Detail as of 2026-11-12: "1-30 days past due (403)" → `Today \| Credit \| CM2-4541 \| … \| Today \| $-3.00 \| $-3.00` |
| Vendor "ZZAUTOTEST SV11315 Staging VC" | — | `20cb96c2-408f-48e9-bd23-3e7c7b1bca28` (account `c871c708-7309-405f-852c-e6c22588d17d`) | — | — | 06:29:36 | holds the vendor credit | A/P Aging Summary data: 1-30 Days $-7.00 |
| Vendor credit | **C-13911** | `01c19b8b-3dd4-48d8-89f1-07199951ffcc` | $7.00 | **12 Nov 2026** 06:29:54 | 06:29:55 | C715472 (a vendor credit dated on the as-of date) | A/P Aging Detail as of 2026-11-12: "1-30 days past due (496)" → `Today \| Credit \| C-13911 \| ZZAUTOTEST SV11315 Staging VC \| Staging Heavy Duty - 9919 \| Today \| 1 \| $-7.00 \| $-7.00` |

**Status board (read-only):** `GET /api/customer-account/list-unpaid-transaction?accountId=92c57b6d-6878-4a33-9fd6-af4e497f4e6d…`
must list CM2-4540 and CM2-4541 as "unapplied"; `GET /api/parts-catalogue/vendor/transactions/list-unpaid-by-vendor-account?accountId=c871c708-7309-405f-852c-e6c22588d17d…`
must list C-13911 as "unapplied". Proof on screen: `scripts/s2.js`.
