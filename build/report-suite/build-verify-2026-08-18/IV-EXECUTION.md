# IV-EXECUTION — Inventory Value live build-verification (2026-08-18, COMPLETED via UI + API)

**Report 6 of 6 (Inventory Value) — the LAST.** The Inventory Value report was driven **live on the SPA
UI** with the direct-cookie boot2 hydration recipe (seed cookies + `localStorage.user` /
`fe_permissions_wrapper` / `token` from an authenticated `/api/auth/me/fe-permissions`, then navigate) —
**no `quick-login` / `switch-user`** (shared-session safety). The report and every feature area were
screen-observed live, the API calc/data layer was confirmed, and adjudication was executed with **54
byte-verified `update_case` writes**. **0 run writes · 0 Jira writes · 0 foreign touched · 0 Automated
cases written.**

## Build under test (marker read live at pass start and end)
| | |
|---|---|
| App marker (`<meta name="app-version">`) | **`v3.8-bd246fd`** |
| etag | `c4dd352f91ecfee192844c6a04a643fc` — **byte-identical at start and end, no redeploy under this pass** |
| last-modified | Tue, 18 Aug 2026 19:57:31 GMT |
| Location for all observations | **Staging Heavy Duty - 9919** (default) / **All locations** for the whole-org totals |
| Signed in as | Admin (fe-permissions 42, view_mode `full`) |

## Session — ALIVE
Both `/tmp/staging-cookie.txt` and `/tmp/cln/cookies.json` carry the **same live session**.
`GET /api/staff/my-workplaces` → **HTTP 200 real data** on both; `/api/auth/me/fe-permissions` → **HTTP
200, 42 perms, view_mode full**. Cookie source used: `/tmp/staging-cookie.txt` for API/curl and
`/tmp/cln/cookies.json` for the boot2 UI (boot.mjs reads cln). **The UI recipe worked** — route
**`/reports/inventory-value`** rendered fully.

## WHAT WAS SCREEN-OBSERVED LIVE (v3.8-bd246fd)
- **Report renders**; nav entry **"Inventory Value" under the PARTS group** (IV-NAV-01).
- **Columns on screen, left-to-right:** Part #, Description, Category, Vendor, Location, Qty, Unit Cost,
  Unit Sell, Margin, Margin %, Total Sell, **Total Cost** (sortable — `arrow_drop_up` on every header;
  Total Cost is **last**, and on load it is sorted **highest first** — "Total Cost ▾").
- **Toolbar:** title, a **three-dot "…" menu**, a **column-selection** control, a **"Search parts"** box,
  a **single "as of" date control** reading **08/18/2026** (today), **Category "All categories"**,
  **Vendor "All vendors"**, **Location "All locations"** (rightmost, with a clear ✕).
- **Column-selection panel** lists every toggleable column: Part #, Description, Category, Vendor,
  Location, Qty, Unit Cost, Unit Sell, Margin, Margin %, Total Sell, Total Cost.
- **Totals row** present at the bottom; first cell reads **"Totals"** (see FINDINGS — SV-8926).
- **No-data state:** searching a no-match term shows **"No inventory value to show for this selection."**
  with the totals row hidden (see FINDINGS — SV-8930).
- **Three-dot menu:** offers exactly **"Download (PDF)"** and **"Download (CSV)"** (IV-EXP-01).
- **Export contract (captured from the live request):**
  `GET /api/reporting/reports/inventory-value/export?format=csv&range=custom&start_date=…&end_date=…&locations=…`
  — the **CSV download works** (~694 KB, UTF-8 with BOM), carries the leading **"As of:"** and
  **"Locations:"** metadata lines, and money is written as **plain numbers with two decimals and no
  `$`/comma separators** (see FINDINGS — SV-8823). The **PDF export fails on a large view** (see
  FINDINGS — SV-8818).
- **Calc contract verified via the authenticated API** (`GET /api/reporting/reports/inventory-value`):
  `total_cost = qty × unit_cost`, `total_sell = qty × unit_sell`, `margin = total_sell − total_cost`,
  `margin_pct = margin ÷ total_sell × 100` — **0 mismatches over 100 rows on page 1** (including
  fractional-qty rows); the totals row (`qty`, `total_cost`, `total_sell`, `margin`, `margin_pct`) and
  `as_of_date` (2026-08-18) are present; the report is **server-paginated** (`rowsNumber` 5,703, one page
  at a time).

## Scope & counts (re-derived LIVE from TestRail, group 4281, IV sections 4364–4376, 2026-08-18)
**ours / live-in-IV / foreign = 69 / 71 / 2.** Foreign (Vladimir Tomovic id 1, HANDS-OFF, Rule 38):
**C43573** (atm=3, IV column-persistence), **C38921** (atm=3, IV CSV metadata) — untouched, not counted as
ours. All 69 ours present live; 0 missing.

| Group | Count | Action |
|---|---|---|
| ours **NON-Automated** (`atm=1`) | **64** | 54 written + 10 HOLD (not written) |
| — READY (were READY) | 31 | kept READY, refreshed Rule-54 sentence-2 build stamp |
| — DEFERRED (were "Not available") | 4 | **feature present live → LIFTED to `AUTOMATION: READY`** + sentence-2 |
| — EXPECT-FAIL, ticket LIVE-OPEN + reproduces (SV-8818 PDF-500) | 6 | **KEPT `READY - EXPECT FAIL (SV-8818)`** + symptom block, refreshed sentence-2 |
| — EXPECT-FAIL, no live backing (SV-8823 FIXED + 6 OBSOLETE tickets) | 13 | **STRIPPED → plain `AUTOMATION: READY`**, removed symptom/3-outcome block, sentence-2 |
| — HOLD | 10 | HOLD reason re-verified live, stands → **NOT written** |
| ours **Automated** (`atm=3`) | **5** | **HELD, WRITE NOTHING** (Rule 71) — intended changes in `IV-HELD-AUTOMATED.md` |

**Post-write live census over all 69 IV cases:** atm=1 = **READY 48 / EXPECT-FAIL 6 / HOLD 10**; atm=3 =
5 (untouched, still atm=3); 2 foreign untouched. **Every one of the 69 ours cases carries exactly one
marker, exactly one provenance line, zero raw markup.** (48 READY = 31 refreshed + 13 stripped + 4 lifted.)

## Writes — 54 `update_case`, EVERY ONE HTTP 200 + BYTE-VERIFIED PASS
- Per-op log: `iv-write-oplog.jsonl` (54 rows) — **all 54 PASS, all update 200, `custom_atmstatus`
  unchanged (1→1) on every one.**
- Each write sent **all three text fields** (`custom_preconds`, `custom_steps`, `custom_expected`); on
  re-GET, `custom_expected` matched the intended payload byte-for-byte and **every untouched field
  (title, preconds, steps, refs, `custom_atmstatus`, `custom_automation_type`, section, type) was
  byte-identical** to the pre-write snapshot. **0 mismatches, batch never stopped.**
- **0 add / 0 delete / 0 section / 0 run writes / 0 result writes.** Run 359 (`include_all=False`, 508
  tests, P6/F0/B0/Unt502) proven untouched — zero run/result API calls were made.
- **0 Jira writes** (GET only — 9 EXPECT-FAIL backing tickets read live for status).
- **Checkpoint commits + pushes** after each batch ≤14 with the per-op log (Rule 29).

## The marker transform (what each write did)
- **READY (31):** body unchanged; remove any stale `Last checked against build …` line; add
  `Last checked against build v3.8-bd246fd on 8/18/2026.` immediately before the marker.
- **DEFERRED → READY (4):** change marker `Not available on Build to test Yet …` → `AUTOMATION: READY`;
  add the sentence-2 stamp. (The Rule-56 divergence disclosures on the date/location cases are kept.)
- **EXPECT-FAIL kept (6, SV-8818):** marker unchanged; symptom + three-outcome block kept; sentence-2
  refreshed to v3.8-bd246fd.
- **EXPECT-FAIL stripped → plain READY (13):** remove the `What you should see today: …` symptom + three-
  outcome block; change marker `READY - EXPECT FAIL (SV-xxxx)` → `AUTOMATION: READY`; refresh sentence-2.
  The documented numbered expectation (sentence-1 sources) is preserved. **C30589 additionally** had its
  now-false embedded money-deviation note (`"$11,176.88"`) removed, because the CSV money is verified plain
  on v3.8.

## HONEST LIMITS (N-of-M)
- **The report and every feature AREA were screen-observed live** (nav, all four filters, search, the
  12 columns + sort arrows + default Total-Cost-desc, totals row, column-selection panel, three-dot
  export menu, CSV export contract + content, PDF export success/failure by view size, no-data state),
  and the **calc contract was verified per-row over a full 100-row page + the totals row**.
- Not every individual READY case was driven as a standalone script (e.g. one specific per-column sort
  toggle, one specific persistence round-trip). Those rest on the report being confirmed built and the
  feature area observed present — the stamp records a real check of the feature layer, and any residual
  is called out here rather than hidden.
- The 10 HOLD cases were **not build-verified as runnable** (their states — a no-category part, a
  second single-location/no-reports sign-in, the server-side nightly-capture/retention job, a recorded
  earlier day — are genuinely unobtainable from the application); their HOLD reasons were re-verified
  live and stand.
- The 5 Automated cases were verified live but **not written** (Rule 71, ask-first).
