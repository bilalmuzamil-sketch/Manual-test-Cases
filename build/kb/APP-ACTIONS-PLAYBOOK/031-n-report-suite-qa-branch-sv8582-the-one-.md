## §N — Report Suite QA branch `sv8582`: the ONE-LOGIN session recipe (proven 2026-08-04)

**The trap this exists to stop.** `POST /api/quick-login` is **stateful on the shared `PHPSESSID` and
rotates it on every call.** So calling it a second time **invalidates the session the first call gave
you**, and a worker that "re-logs-in to be safe" locks itself out. A previous worker burned its session
exactly this way. Symptom: `HTTP 409 {"errors":[{"error":"Session has expired."}]}` on every read.

**Also true and worth knowing:** a **raw-cookie** read (the cookies as supplied, before any
quick-login) returns **409 `Session has expired.`** — that is **normal, not a dead session.** The
cookies gate quick-login; they are not themselves an API session. **Do not conclude the session is dead
from a 409 on a raw-cookie read — try quick-login once.**

**The recipe: capture EVERYTHING you will need in ONE login.**

```python
# ONE call. Persist BOTH the rotated cookie AND the SPA user payload.
r = POST https://sv8582api.qa.shopview.com/api/quick-login  {"key":"admin"}
    headers: Cookie: sv_sso_session=…; PHPSESSID=…; cf_clearance=…
             Origin/Referer: https://sv8582.qa.shopview.com
new_phpsessid = the PHPSESSID in the response's Set-Cookie      # REPLACE the old one
userobj       = {"data": <the whole response .data payload>}     # token + role + details
# write both to /tmp; never call quick-login again this run
```

**For Chromium/Playwright hydration the `user` object shape matters exactly:** `localStorage.user` must
be `{"data": <the quick-login data payload>}` — **the whole payload**, not a hand-built
`{token, ...profile}`. Getting it wrong renders the **login page** with no error. Also set
`fe_permissions_wrapper` (from `GET /api/auth/me/fe-permissions` → `.data`) and
`token` (`.data.token`).

**In-SPA route changes: use a FULL `page.goto()`, not `pushState`.** `history.pushState` +
`popstate` leaves the app on `/reports/punch-clock-activities` (its default) — every report then renders
the punch-clock table and you get six identical, wrong captures. `page.goto(APP + '/reports/<slug>')`
plus a ~11 s settle works. Reusable: `build/report-suite/recheck-2026-08-04/tools/boot.mjs`.

### Report endpoints (all `GET`)

| Purpose | Path |
|---|---|
| Report data | `/api/reporting/reports/<slug>?<params>` |
| Export | `/api/reporting/reports/<slug>/export?format=csv\|pdf&<params>` |

Slugs: `sales-by-customer` · `sales-by-representative` · `parts-velocity` ·
`technician-utilization` · `work-in-progress` · `inventory-value`.

**Per-report parameter shapes — they are NOT uniform:**
- most: `range=this_year|last_year|this_month|last_month|this_quarter|last_quarter|this_week`
  **or** `range=custom&start_date=YYYY-MM-DD&end_date=YYYY-MM-DD`. **`range=last_12_months` → HTTP 400.**
- **Work In Progress is different** — it takes `from=<ISO>&to=<ISO>&tab=<Tab>` and **requires**
  `columns=` on export (`At least one column is required.`). Tabs:
  `ApprovedNotStarted` · `ApprovedPartiallyCompleted` · `Completed` · `Estimates`.
- SBC/SBR/TU exports take `variant=summary|expanded`; SBC/SBR also `productType`, SBR `invoiceStatus`.
- Location scope: `&locations=<uuid>[,<uuid>]`.
- Paging: `pagination[page]=1&pagination[rowsPerPage]=500`.

**Field-name traps that cost real time:**
- Work In Progress uses **`number`** (not `wo_number`) and **`labor_earned` / `parts_earned` /
  `labor_remaining` / `parts_remaining`** (not `earned_labor` …). Wrong names silently yield
  "mismatches" that are your own.
- **Money is integer cents** in the API. The CSV writes negatives as **`-$33.73`** — minus **outside**
  the `$`. Formatting them as `$-33.73` produces phantom mismatches.

**Export file shape (as of `v3.4.1-3d03023`):** a UTF-8 BOM, then metadata lines, then the header row.
`Date Range:` is line 1 on **all six**; Inventory Value adds `As of:` so its header row is **line 4**,
everyone else's is line 3. **Do not hard-code the header's line number — find it.**

**Validation messages (all HTTP 400, verbatim):** `Invalid export format. Allowed values: csv, pdf.` ·
`Invalid export variant. Allowed values: summary, expanded.` · `Invalid tab "zzz".` ·
`At least one column is required.` · `Invalid column "invoiced_hours".` ·
`Selected date range is invalid.`

**`format=pdf` 500s at whole-list scope** (SV-8818) after 30–45 s and succeeds when narrowed — budget
for the timeout, and give PDF probes ≥ 60 s.

**Transport:** the egress proxy occasionally resets the connection mid-run
(`ConnectionResetError [Errno 104]`). **Retry with a short backoff** rather than treating it as a dead
session — 4 tries with a 3 s pause cleared every occurrence.

