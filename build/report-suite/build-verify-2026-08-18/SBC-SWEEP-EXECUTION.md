# SBC RE-VERIFY SWEEP — execution (2026-08-19)

> ## ✅ COMPLETION UPDATE — 2026-08-19 (resume pass, interim `<br>` writes EXECUTED)
> The write blocker below is real but the QA lead **ACCEPTED the interim `<br>` format** (verified
> rendering on C30133). **ALL 36 atm=1 SBC cases have now been WRITTEN** in that format and
> render-verified live. **0 clean-form writes were possible (TestRail API still wraps markdown), so
> every write uses literal `<br>` line breaks — this is cleanup debt (demark to plain once the
> TestRail API is fixed).**
>
> **CANONICAL TEMPLATE:** C30133's stored `<br>` form (left correct by worker a7a161) — numbered items
> joined with `<br>`, `<br><br>---<br>` before the provenance, `<br><br>` before the marker.
>
> **WRITES (36 atm=1, every one HTTP 200 + normalization-aware re-verify: content words intact,
> `<br>` breaks present, NO `<ol>/<li>`, marker present):**
> - **29 READY** — 25 verified-PASS carried on same build marker (`v3.8-da72171`) + 4 newly driven live
>   this run: **C30132** (reverse-invoice exclusion, seeded), **C30137** (duplicate-label `(#1)/(#2)`,
>   seeded), **C30101** (location-access enforcement, verified via Parts-Manager impersonation),
>   **C43550** (Location never a column-selector toggle — verified on admin + mechanism).
> - **7 HOLD** — C30100/C30139/C30140/C30141/C43558 (invoice-link PO question, legitimate);
>   **C30131** (build blocks a no-vehicle service WO — create returns 500); **C43553** (broken-logo-file
>   is a storage/infra state, not app-seedable, org-level shared-env risk; case sanctions Blocked).
> - **Verification is NORMALIZATION-AWARE** (Rule 50 declared-normalization clause): the `<p>` wrapper,
>   trailing `\n`, and `&`/`<`/`>`/`—`→entity escaping are the documented block transform and are NOT
>   treated as mismatches; a batch halts only on a genuine CONTENT change or `<ol>/<li>` corruption.
>   Census of all 36: **0 `<ol>/<li>`, exactly 1 marker + 1 provenance + 1 `v3.8-da72171` stamp + `<br>`
>   present on every case.**
> - **10 Automated (atm=3) HELD — 0 writes** (Rule 71), see SBC-SWEEP-HELD-AUTOMATED.md.
>
> **🔴 BUILD REDEPLOYED MID-PASS:** start `v3.8-da72171` (last-mod 08:04:00 GMT, etag `7e51cdf1…`) →
> end **`v3.8-b7d80dc`** (last-mod 13:03:27 GMT, etag `5d27e507…`). Rule-54 sentence 2 names
> **`v3.8-da72171`** — the build confirmed at pass start and against which the live driving was done.
> Per Rule 60 this is the ordinary non-final-branch consequence; **all verdicts remain PROVISIONAL.**
>
> **Run 359 UNTOUCHED** (0 run writes; only `update_case`; include_all False; 6 passed/502 untested).
> **0 Jira. 0 foreign** (all 36 `created_by=3`; the 10 atm=3 not written).
> **Per-op log:** `sbc-sweep-oplog.jsonl`. Executor `/tmp/testrail/{sbc_exec,run_batch}.py`; seed
> helper `/tmp/seed.py`.

**Goal:** individually build-verify (Rule 74) every SBC case NOT already freshly re-stamped in the
2026-08-18 pass — the ~10 HOLD + the ~36 "present but not individually re-stamped" — so all are
runnable for the manual QA, seeding data / logging in as needed (no data/login skips).

## Session / render / build marker
- **Session:** `/tmp/staging-cookie.txt` (+ `/tmp/cln/cookies.json`) ALIVE. Probe
  `GET /api/staff/my-workplaces` → **HTTP 200** (cookie passed as a `Cookie:` header — a `-b <file>`
  form is mis-read by curl and 401s; header form works).
- **Render:** boot2 direct recipe — `staging-boot2.mjs` (quick-login → `POST /api/iam/change-location`
  Heavy Duty 9919 → seed `localStorage.user` + live `fe_permissions_wrapper` + `token` → navigate
  `/reports/sales-by-customer`). Chromium straight through `$HTTPS_PROXY`, no MITM bridge needed.
- **Build marker (START and END, no redeploy during the pass):** **`v3.8-da72171`**, `index.html`
  last-modified **Wed, 19 Aug 2026 08:04:00 GMT**, etag `7e51cdf10ae9a5b00cba629186fb41d4`. Read at
  pass start and pass end — identical.
- **SBC report API:** `GET /api/reporting/reports/sales-by-customer?range=…&start_date=…&end_date=…&productType=…&locations=…&pagination[…]&sortBy=…` (needs the SPA session; a raw-cookie curl 409s
  "Session has expired" — captured inside the boot2 page). Export:
  `GET /api/reporting/reports/sales-by-customer/export?variant=summary|expanded&format=csv|pdf&…`.

## Scope — the 46 SBC cases in this sweep (all `created_by = 3`, 0 foreign)
Derived from `SBC-EXECUTION.md` (the `touched = no` rows). **Live `custom_atmstatus` re-read for all 46
(authoritative — the EXECUTION-table `atm` column was stale): 10 Automated (atm=3, HELD, no write) +
36 manual (atm=1).**

- **atm=3 HELD (10, no write, Rule 71):** C30098, C30099, C38912, C30138, C30159, C30163, C30174,
  C30175, C30177, C30180 — see `SBC-SWEEP-HELD-AUTOMATED.md`.
- **atm=1 (36):** C30100, C30101, C30104, C30109, C30111, C30113, C30115, C30120, C30122, C30125,
  C30126, C30128, C30129, C30131, C30132, C30133, C30134, C30137, C30139, C30140, C30141, C43558,
  C30145, C30150, C30153, C43550, C30164, C43553, C30179, C30181, C30184, C30187, C30188, C30189,
  C43546, C39447.

## 🔴 HEADLINE BLOCKER — TestRail `update_case` now HTML-CORRUPTS the markdown fields on write
**No re-stamp write could be performed cleanly. This is an environment change since the 08-18 pass, not
a method error.**
- Every `update_case` to `custom_expected` / `custom_preconds` / `custom_steps` (field
  `format = markdown`, confirmed via `get_case_fields`) now comes back **wrapped in `<p>…</p>\n` with
  em-dashes escaped to `&mdash;`** — even a trivial plain string `"plain test line"` stores as
  `"<p>plain test line</p>\n"`. This is the raw-markup form this project **renders LITERALLY to the
  tester** (CLAUDE.md Report-Suite "raw HTML … marker wrapped in `<p>`" = defect).
- **Proof it is a current environment change, not our method:** prior-pass 08-18 writes **C30096 and
  C30124 remain CLEAN markdown right now** (no `<p>`), written with the identical helper/method; only
  new writes wrap. Matches playbook §J DECLARED HAZARD #5 / normalisation #3 ("`update_case`
  re-renders … `<p>`, `&mdash;`; CONDITIONAL OR INTERMITTENT") — currently firing 100% on-write.
- **Action taken (Rule 50 / Rule 6):** the canary write (C30133) failed byte-verify → **batch HALTED
  immediately**; no further writes attempted. Writing would corrupt 25+ cases' tester display.
- **C30133 collateral:** the canary + diagnostics dirtied C30133; its **word-for-word CONTENT was
  restored** (matches the pre-write snapshot), but TestRail still stores it `<p>`-wrapped while the
  wrap condition is active. **It needs a formatting-only demark repair
  (`build/markup-regression-2026-08-10/demark.py`) once `update_case` stores clean markdown again.**
  Recorded in `sbc-sweep-oplog.jsonl`.

## Runnability is intact despite 0 writes
The SBC report is **fully built and functional on `v3.8-da72171`** (all features driven live below),
and the case bodies from the 08-18 pass are already build-accurate — so the cases **remain runnable by
a manual QA**. What could not be applied is the metadata re-stamp (Rule-54 sentence 2 build/date +
marker refresh), because the write path corrupts. Re-stamping is a currency update, not a runnability
blocker.

## What was DRIVEN LIVE on v3.8-da72171 (evidence for the verdicts in SBC-SWEEP-FINDINGS.md)
- **Nav + open:** SBC under **Performance** group (`report_nav_sales_by_customer`); page title "Sales By
  Customer". Route `/reports/sales-by-customer`.
- **Columns (13, `header_sbc_*`):** Customer, Date, Location, Labor Delta, Labor Invoiced, Labor Margin,
  Parts Invoiced, Parts Margin, Shop Supplies, Adjustments, Margin, Margin %, Subtotal.
- **Filters:** Date range (`date-range-selector_sbc_trigger`, default "This Month"), Product Type
  (`select_multiple_sbc_product_type`, "All products"), Customer (`select_sbc_customer_filter`,
  contains-match verified: typing "Credits" → only "E2E Credits Customer"), Location
  (`select_multiple_report_location_filter`, lists all accessible locations + "All locations", selecting
  one sends `locations=` scoped request).
- **Tree:** expand-all (`button_sbc_expand_all`) 19→59 rows; customer → asset rows (`local_shipping`
  VIN labels) → invoice detail (`text_sbc_invoice_*`); **Parts Sales bucket always LAST** within a
  customer; "Multiple" shown in Location on aggregation rows.
- **Sorting:** `header_sbc_date` fires `sortBy=date`.
- **Calc (source of truth = live API):** Margin % = Margin / (Subtotal − Shop Supplies) × 100 →
  **24/24 rows + totals match** (totals 98.62 exact). Totals row = Σ collection for every money column.
- **Column selector (`button_column_selection`):** 10 toggleable columns (Date, Labor Delta, Labor
  Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Adjustments, Margin, Margin %);
  Location NOT a toggle (fixed, multi-loc only).
- **Exports (`btn_dropdown_sbc_export`):** exactly **4** items — Download Summary (PDF) / Expanded View
  (PDF) / Summary (CSV) / Expanded View (CSV); **no Print**. CSV download fires
  `…/export?variant=summary&format=csv&…`.
- **Dark mode:** profile menu Light/Dark toggle → `body--dark` applied (reverted to `body--light`).
- **Empty state:** far-future range → empty table body, toolbar interactive.
- **Mobile:** 390px viewport → all 6 toolbar controls render, table present.
- **Failed fetch (route abort):** "Network Error" toast shown.
- **Permissions:** permission catalog has exactly **one** reports permission `reportsPageAccess` — **no
  per-report permission** (C39447). Tech user (12 perms, no `reportsPageAccess`) → `/reports` bounces to
  `/workorders`, SBC not in nav, direct SBC route bounces (C30099).

## Env cleanup
- C30133 content restored (residual wrap flagged, needs demark repair when writes store clean).
- Dark mode reverted to light. No role-swaps left active (Tech user never had its role changed — the
  Tech-login check used the existing Technician-role user via `quick-login`, not a role assignment).
- Run 359 untouched. 0 Jira. 0 foreign cases touched.
