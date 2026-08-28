# SV-8814 / SV-8769 — production-vs-staging verification, running log

**Ask (QA lead, 2026-08-10):** replicate both bugs **on production** (where they are unfixed), then
confirm they are **fixed on staging**. Both are **API-only** — the UI locks every money-moving field
once an unpaid invoice exists, which the QA lead and Ahtasham already proved on 31 July and the
developer accepted. One ticket at a time; **SV-8814 first** (agreed) because the one-edit lag changes
how SV-8769 reproduces — a single edit can show nothing and be misread as "not reproducible".

## The two tickets

| | SV-8814 | SV-8769 |
|---|---|---|
| Summary | Invoice rebuild **runs one edit behind** | Processing fee recalculated against the **wrong tax base** |
| Priority | Medium | High |
| Status | Merged to Staging | Merged to Staging |
| QA plan | SV-8768 combined plan, **section 5** | SV-8768 combined plan, **sections 1–2 and 5** |

Both fixes shipped on one branch with **SV-8768** and **SV-8813**. SV-8769's own fix was
**superseded by SV-8813's**, same outcome. The developer's plan says *"skip hands-on testing"* for
this path because he verified it himself; **this pass deliberately goes further** — his earlier note
said *"every number in this thread was measured on my local environment"*, so an independent
production-vs-staging comparison is worth having, and the ticket write-up will say plainly that we
went beyond the plan.

## Environment / setup (production)

| | |
|---|---|
| Org | `72b2cc90-6964-4429-a207-76e55f946936` — "Bilal-Trucks" (test org) |
| Workplace | **Trucks Hill 2** `b617914c-16e9-4485-8e8b-193cd86aa416` |
| Customer (QA lead's instruction: use only this one) | `01de15df-5651-4704-9450-0b94f4375f6b` — *aqeel transport 56* |
| Labor rate (his instruction) | **"4226"** `e9e21aac-b79b-4cba-b7cb-8419c6610f9a`, **$118/hr** |
| Tax | **"15 percent"** `dfac6587-…`, labor + parts + shop supplies all enabled — the customer's default |
| Signed in as | Admin |

**Staging** (next phase): customer `80e9f596-5293-4dd3-a56d-170eb48175c1`, labor rate **"Bilal"**,
default tax 15%.

## Where the run stands

**PAUSED** — the QA lead is turning off some invoicing requirements to make Create Invoice reachable.
That kills our session, so a re-login is expected. Nothing is lost: the seed is scripted and the
recipe is recorded in `build/APP-ACTIONS-PLAYBOOK.md` **§R**.

### Done
- Production login, workplace switch, and full reference-data discovery.
- Seeded WO on the right customer, right labor rate, right tax, and confirmed the numbers on screen:

| Item | Value |
|---|---|
| Parts | $20.00 |
| Labor (1 h @ $118, rate 4226) | $118.00 |
| Shop Supplies | $11.80 |
| **Subtotal** | **$149.80** |
| **15 percent** | **$22.47** |
| **Total / Balance** | **$172.27** |

Arithmetic checks: 118 + 20 + 11.80 = 149.80; 15% × 149.80 = 22.47; total 172.27. ✅
- Work order driven to **Complete** (line complete → WO complete).

### Blocked on
**Create Invoice is disabled with no tooltip** while the org has `requireReview: true`. There is no
API review transition (`review`/`reviewed` are rejected status names; `/api/work-orders/review` is
404), so this is the QA lead's change to make.

### Next, once he's done
1. Re-login (one login only).
2. Re-verify the seeded WO still completes and **Create Invoice** is enabled.
3. Invoice it and **leave it unpaid** — every listener filters on `Status::PENDING`, so a paid
   invoice rebuilds nothing.
4. Record invoice Subtotal / Tax / Total / Balance.
5. Fire **ONE** `POST /api/work-orders/lines/change` → re-read the invoice → **expect it not to move**
   (that is the bug). **Screenshot at this moment.**
6. Fire a **SECOND** edit → re-read → **expect the first edit to land**.
7. Repeat the identical sequence on staging → expect one edit to be enough.

## Standing rules being applied

- **Screenshot proof of replication is mandatory** (QA lead, 2026-08-10) — captured at the moment it
  reproduces, showing the wrong value on screen, annotated. Now recorded in `CLAUDE.md`.
- **Jira comment format** — status line → table of everything tested → inline images → technical
  details after a rule.
- **Rule 12** — only what is observed live gets reported as fact.

## Test data seeded on production (tagged ZZAUTOTEST)

| Thing | Id |
|---|---|
| WO #1 (abandoned — vehicle had an invalid VIN) | `83873634-403e-4ccd-a08d-674f1bc59aba` |
| WO #2 (abandoned — created before the customer was specified) | `2b50818c-e350-4e36-8c33-e4991bbe980d` |
| **WO #3 (live)** | `80a3bf4d-36d7-4c3c-904f-15c8fc6a8453`, line `6b910286-b76d-4002-962a-3fb409f58aa2` |

The QA lead has confirmed this production org is a test account and data may be added freely.

## Corrections to our own books, made today

- **§K was wrong about the browser**: it says Playwright can point straight at `$HTTPS_PROXY` on
  production. Today that gave `ERR_CONNECTION_RESET` every time and the **MITM bridge was required**.
  §R records both, try-direct-then-bridge.
- **A white/blank SPA on production is almost always the localStorage seed**, specifically
  `fe_permissions_wrapper` — it must be the real `GET /api/auth/me/fe-permissions` **object**, not a
  list of permission names. A name list crashes the app with
  `Cannot read properties of undefined (reading 'length')`, which reads like a proxy failure and
  isn't one.
