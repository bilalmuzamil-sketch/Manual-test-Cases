# RE-CHECK QUEUE — Report Suite VIU on the NON-FINAL QA branch `sv8582`

## STATUS: **OPEN**

> **Why this file exists (CLAUDE.md Standing Rule 49).** The QA lead relayed engineering's
> position verbatim on **2026-08-03**: *"they have also told they this QA Branch is also not final
> they are still working on it. So whatever you change from it, make sure that you will have to
> recheck it in future to ensure that what you had learned from this QA branch is still true or if
> that has been changed."*
> Therefore **every** observation in this VIU pass is **PROVISIONAL**. Each row below must be
> re-confirmed against the build once it settles. **No Report Suite deliverable may be described as
> VIU-complete while this queue is OPEN.**

## THE BUILD THIS PASS OBSERVED (the thing that must be compared later)

| Marker | Value |
|---|---|
| App | `https://sv8582.qa.shopview.com` |
| API | `https://sv8582api.qa.shopview.com` |
| **App version (authoritative marker)** | **`v3.4.1-0ed4433`** |
| index.html `last-modified` | `Mon, 03 Aug 2026 13:40:38 GMT` |
| index.html `etag` | `02091e9dc11f187d7739b4efa166ea21` |
| API server banner | `nginx/1.30.4` / `PHP/8.5.7` |
| Org | `d55bc308-e61a-438d-b5f1-c7a73c89d49f` (shared) |
| Report Suite feature flag | **none exists** — the six reports are unflagged on this branch |
| Observed (UTC) | `2026-08-03 18:13 → 18:xx` |

**Re-read the marker (one command):**
```
curl -s https://sv8582.qa.shopview.com/ | grep app-version
```
**If the value is no longer `v3.4.1-0ed4433`, the build has moved and EVERY row below is due for
re-check.**

## HOW TO RE-RUN THIS QUEUE

1. Check the marker (command above). Also check it at **every session start** and **before/after any
   Report Suite work** (`ls build/*/viu-*/RECHECK-QUEUE.md`).
2. For each row: re-drive the same check live, then set **Re-check outcome** to
   **CONFIRMED** (unchanged — cite fresh evidence) or **CHANGED** (state the new observation; a
   CHANGED row is a reportable finding, not a silent correction).
3. Only set this file to **CLOSED** when **100% of rows** are re-verified (Rule 17 — no sampling).
4. Tooling is reusable and read-only: `tools/qa8582.mjs`, `tools/boot8582.mjs`, `tools/nav_map.mjs`,
   `tools/capture_report.mjs`.

## TRIGGERS THAT REOPEN / FORCE A RE-RUN

- The app-version marker changes (deploy).
- Cookies die earlier than ~24h (on this estate that usually means a deploy happened).
- Engineering or the QA lead declares the branch final.
- Any Report Suite spec version bump (Rule 31 pre-flight) — a re-check and a spec-diff then run
  together.

---

## ROWS — every case touched or verdicted in this pass

Legend for **Re-check obligation**: what specifically must be re-confirmed once the build settles.

<!-- RECHECK-ROWS-START -->

### A. Environment / navigation facts (not case verdicts, but everything below depends on them)

| # | Fact observed | Build | Re-check obligation | Re-check outcome |
|---|---|---|---|---|
| E1 | API host is `sv8582api.qa.shopview.com`; `quick-login {key:'admin'}` → 200 | `v3.4.1-0ed4433` 2026-08-03 | Confirm auth route still 200 | PENDING |
| E2 | No Report Suite feature flag exists; all six reports render unflagged | `v3.4.1-0ed4433` 2026-08-03 | Re-list `/api/feature-flags` — a flag may be added before release | PENDING |
| E3 | Six routes: `/reports/sales-by-customer`, `/reports/sales-by-representative`, `/reports/parts-velocity`, `/reports/technician-utilization`, `/reports/work-in-progress`, `/reports/inventory-value` | `v3.4.1-0ed4433` 2026-08-03 | Confirm routes unchanged | PENDING |
| E4 | Nav groups: WIP/TU/SBR under **PERFORMANCE**; PV/IV under **PARTS**; SBC under **SALES** | `v3.4.1-0ed4433` 2026-08-03 | **High-churn** — nav grouping is exactly the sort of thing still being worked on. Re-confirm every group heading. | PENDING |
| E5 | `/reports` redirects to `/reports/punch-clock-activities` (no neutral reports index) | `v3.4.1-0ed4433` 2026-08-03 | Confirm redirect target | PENDING |

### B. Case-level rows

Populated per VIU batch. Each row: internal ID · C-id · link · what was observed · what changed/
concluded · build + date · re-check obligation.

See `BATCH-LOG.md` for the running per-batch tally and `LABEL-DIFF.md` for the wording deltas each
row refers to.

| # | Case | C-id + link | Observed on `v3.4.1-0ed4433` (2026-08-03) | Conclusion / staged change | Re-check obligation | Re-check outcome |
|---|---|---|---|---|---|---|
| B1 | WIP-COL-02 | [C30467](https://shopview.testrail.io/index.php?/cases/view/30467) | Column Selection panel offers **Location** between VIN and Advisor, **off by default**; it did **not** appear automatically at two-location scope | Expected item 3 is **REFUTED**; edit staged (ledger row 1) | Re-open the panel and confirm Location is still a toggle and still off by default — the nav/columns area is exactly what an unfinished build changes | PENDING |
| B2 | WIP-COL-01 · WIP-PERS-02 | [C30466](https://shopview.testrail.io/index.php?/cases/view/30466) · [C30507](https://shopview.testrail.io/index.php?/cases/view/30507) | Their stated fixed column order **matches the selector order exactly**, Total last | CORRECT AS IS; they win the contradiction against C30467 | Re-confirm the order | PENDING |
| B3 | WIP-PERS-01 | [C30506](https://shopview.testrail.io/index.php?/cases/view/30506) | `Total` absent from the 16-item selector, always rendered; tooltip `Column Selection` | CORRECT AS IS | Re-confirm Total is still not offered | PENDING |
| B4 | WIP-EXP-07 | [C30516](https://shopview.testrail.io/index.php?/cases/view/30516) | Screen `Asset`/`Location`; CSV `Unit`/`Branch`; the `Unit` cell carries the **unit number** | CORRECT AS IS; its open item 4 answered | **High churn** — if the VIN-chain ruling lands, `Unit` may become the VIN. Re-read both surfaces | PENDING |
| B5 | WIP-EXP-02 · WIP-TOT-02 | [C30511](https://shopview.testrail.io/index.php?/cases/view/30511) · [C30495](https://shopview.testrail.io/index.php?/cases/view/30495) | `Inv. Hrs` is offered on screen but **rejected by the export** (`400 Invalid column`) | EDIT staged (ledger rows 8–9) | Re-probe the accepted export column list; this is likely to be completed before release | PENDING |
| B6 | WIP-COL-05 · WIP-SORT-03 · WIP-FLT-03 | [C30470](https://shopview.testrail.io/index.php?/cases/view/30470) · [C30485](https://shopview.testrail.io/index.php?/cases/view/30485) · [C30500](https://shopview.testrail.io/index.php?/cases/view/30500) | Export `Unit` column = unit number, VIN in its own column → build follows the **stale spec**, not Chris's VIN chain | DEVIATION, **no case change** (Rule 32) | Re-check whether the VIN chain has shipped. **Also still owed: read the on-screen Asset cell (virtualised grid defeated it this run)** | PENDING |
| B7 | SBC-NAV-01 | [C30096](https://shopview.testrail.io/index.php?/cases/view/30096) | Nav heading is **SALES**, not PERFORMANCE. Full live heading order captured | EDIT staged (ledger row 2) | **High churn** — nav grouping is prime unfinished-build territory. Re-read every heading | PENDING |
| B8 | SBC-DATE-01 · SBC-DATE-03 | [C30102](https://shopview.testrail.io/index.php?/cases/view/30102) · [C30104](https://shopview.testrail.io/index.php?/cases/view/30104) | **Nine** presets (`Last 12 Months … Last Week`) + inline calendar + `Range: N days` + `Apply`. No Today, no Yesterday, no `Custom`. "No All Time" **matches** | DEVIATION; C30104's steps **not executable** | Re-list the presets — a shared component may gain the missing options | PENDING |
| B9 | SBC-EXP-01 | [C30159](https://shopview.testrail.io/index.php?/cases/view/30159) | Four labels verbatim and in order; **no Print anywhere on the build** | CORRECT AS IS | Re-check no Print reappears (SV-8614 is still Open) | PENDING |
| B10 | SBC-COL-01 · SBC-COL-02 | [C30156](https://shopview.testrail.io/index.php?/cases/view/30156) · [C30157](https://shopview.testrail.io/index.php?/cases/view/30157) | Nine toggles in order; tooltip `Column Selection`; Customer/Subtotal/chevron absent from the selector | CORRECT AS IS | Re-confirm the nine | PENDING |
| B11 | SBC-EXP-03 | [C30161](https://shopview.testrail.io/index.php?/cases/view/30161) | **Exact** 13-column single-location order; 14 with `Location` immediately after `Date` | CORRECT AS IS — the best match in the suite | Re-read both header rows | PENDING |
| B12 | SBC-EXP-14 | [C30172](https://shopview.testrail.io/index.php?/cases/view/30172) | API returns the too-large message **verbatim** as asserted | CORRECT AS IS at the API layer | Re-check the string **and** observe the toast in the UI | PENDING |
| B13 | SBC-EXP-15 | [C30173](https://shopview.testrail.io/index.php?/cases/view/30173) | No download; toast `Empty export` / `Export didn't yield any results` / `Close` | **REFUTED**; edit staged (ledger row 3) | Re-confirm the toast text | PENDING |
| B14 | SBC-EXP-09 | [C30167](https://shopview.testrail.io/index.php?/cases/view/30167) | `"Locations: …"` is the **first line**; at full scope it reads `Locations: All locations` | EDIT staged (ledger row 4) | Re-confirm position and the all-locations wording | PENDING |
| B15 | SBR-COL-01 | [C30265](https://shopview.testrail.io/index.php?/cases/view/30265) | Seven toggles and five always-on columns **both exact** | CORRECT AS IS | Re-confirm both lists | PENDING |
| B16 | SBR-EXP-10 | [C30285](https://shopview.testrail.io/index.php?/cases/view/30285) | Summary CSV = **nine** headers led by `Representative`; `# Invoices`, `# Customers`, `Hrs Worked`, `Hrs Invoiced` **absent** though the payload carries them | DEVIATION, **no edit pending Chris** | **Highest-churn export row** — very likely to change before release. Re-read the header line | PENDING |
| B17 | SBR-EXP-11 | [C30286](https://shopview.testrail.io/index.php?/cases/view/30286) | `Representative, Invoice #, Date, Customer, Invoice Status, [Location,] Hrs Worked …` (15) | DEVIATION on order + two labels; **Location placement confirms the other author's assertion** | Re-read the header line | PENDING |
| B18 | SBR-LOC-04 · TU-LOC-05 · IV-LOC-04 · PV-FILT-13 | [C30216](https://shopview.testrail.io/index.php?/cases/view/30216) · [C30446](https://shopview.testrail.io/index.php?/cases/view/30446) · [C30577](https://shopview.testrail.io/index.php?/cases/view/30577) · [C30340](https://shopview.testrail.io/index.php?/cases/view/30340) | **Seeded a single-location user and observed live: the Location filter is STILL SHOWN on all six reports** → build follows the stale spec, not Chris's hidden ruling | DEVIATION, **no case change** | **The single most important row to re-check.** Re-seed a one-location user and look again | PENDING |
| B19 | TU-EXP-01 · TU-EXP-02 | [C30434](https://shopview.testrail.io/index.php?/cases/view/30434) · [C30435](https://shopview.testrail.io/index.php?/cases/view/30435) | Menu = **four** items `Summary (PDF)` · `Summary (CSV)` · `Expanded (PDF)` · `Expanded (CSV)`, no "Download" prefix | DEVIATION pending Chris | Re-read the menu | PENDING |
| B20 | TU-COL-01 | [C38859](https://shopview.testrail.io/index.php?/cases/view/38859) | Tooltip `Column Selection`; five toggles exact; Technician always-on | CORRECT AS IS | Re-confirm | PENDING |
| B21 | TU-LOC-01 | [C30442](https://shopview.testrail.io/index.php?/cases/view/30442) | Option reads `All locations` (lower-case L) + a `Clear all` action; filter labelled `Location` and rightmost | EDIT staged (ledger row 5) | Re-read the option text | PENDING |
| B22 | TU Location export position | TU-LOC / TU-EXP groups | Screen `Technician · Location · …` but CSV `Location · Technician · …` | DEVIATION (position) | Re-read both surfaces | PENDING |
| B23 | IV-COL-01 | [C30551](https://shopview.testrail.io/index.php?/cases/view/30551) | Header is **`Qty`** not `Qty on Hand`; everything else matches incl. Location between Vendor and Qty | EDIT staged (ledger row 6) | Re-read the header row | PENDING |
| B24 | IV-EXP-01 | [C30587](https://shopview.testrail.io/index.php?/cases/view/30587) | `Download (PDF)` / `Download (CSV)` exact | CORRECT AS IS | Re-read the menu | PENDING |
| B25 | IV-EXP-02 | [C30588](https://shopview.testrail.io/index.php?/cases/view/30588) | Export order differs from screen; `Total Cost` 9th, `Margin %` last; screen has `Total Cost` last. `"As of: …"` is line 1 | DEVIATION | Re-read the export header row | PENDING |
| B26 | PV-ROW-06 | [C30346](https://shopview.testrail.io/index.php?/cases/view/30346) | Header is `Turns/Yr` (no spaces); three info icons present as asserted; **tooltip texts not read** | EDIT staged (ledger row 7) | Re-read the header **and** capture the three tooltip texts | PENDING |
| B27 | PV-FILT-01 | [C30328](https://shopview.testrail.io/index.php?/cases/view/30328) | Type options exactly `Both` / `Inventory` / `Special Order` | CORRECT AS IS — Chris's rename is live | Re-confirm | PENDING |
| B28 | PV + IV PDF export | PV-EXP / IV-EXP groups | `format=pdf` → **HTTP 500** at whole-list scope; request ids `785df944-…`, `46899551-…`, `13edda95-…`, `1d2e0569-…`. CSV of the same scope succeeds; PDF succeeds when narrowed | **DEVIATION — believed a genuine defect**, not filed | **Re-test first.** An unfinished build may simply not have finished the PDF renderer | PENDING |
| B29 | The 16 one-permission cases | PV-PERM-01/03, PV-API-04, PV-NAV-01, TU-NAV-01/07, WIP-PERM-01/02, WIP-TAB-01, IV-PERM-01/02, IV-NAV-01, SBC-PERM-01/05, SBC-NAV-01/03 (incl. [C30327](https://shopview.testrail.io/index.php?/cases/view/30327), [C30391](https://shopview.testrail.io/index.php?/cases/view/30391)) | **Proven both ways.** Catalogue holds exactly one report atom `reportsPageAccess`; an 8-atom role with only it → **200** on all six data + all six export endpoints; Foreman without it → **403 `Access denied.`** on all twelve | CORRECT AS IS — the build follows the ruling, not the four stale specs | Re-check the atom catalogue for a newly-added per-report atom, and re-run both halves | PENDING |
| B30 | The WIP money contract | WIP-CALC group incl. [C30479](https://shopview.testrail.io/index.php?/cases/view/30479) | Recomputed over **all 178 live rows**: `Earned = Labor+Parts`, `Remaining` likewise, `Total = Earned+Remaining` — **0 mismatches**; 77 zero-value estimates present; 178 unique jobs in exactly one tab each; integer cents | CORRECT AS IS | Re-run the recomputation | PENDING |
| B31 | The IV money contract | IV-CALC group | `786.55 × $14.21 = $11,176.88`; `× $21.86 = $17,193.98`; margin `$6,017.10`; `35.0%` — all exact | CORRECT AS IS | Re-run | PENDING |
| B32 | PV has **no `totals`** object | PV-TOT / PV-CALC | PV returns only `collection` + `pagination`; SBC, SBR and IV all return `totals` | **CANDIDATE GAP** — any PV totals expectation is unsupported | Re-check whether `totals` was added | PENDING |
| B33 | Export parameter contract | the API groups | `format` → *"Invalid export format. Allowed values: csv, pdf."*; `variant` → *"…summary, expanded."*; WIP `tab` → *"Invalid tab"*, values `ApprovedNotStarted / ApprovedPartiallyCompleted / Completed / Estimates`; WIP `columns` **required** | **CANDIDATE GAP** — no negative case exists | Re-probe each validation message | PENDING |
| B34 | IV single-location Location column on screen | IV-LOC group | Still shown for the impersonated one-location user — **but that browser profile carried a persisted column selection, and IV's Location IS a selector toggle, so this is CONFOUNDED, not a finding.** The IV single-location **CSV has no Location column**, so the server-side rule is right | **NOT VERIFIED on screen** (honest) | Re-run with a clean browser profile and correct hydration | PENDING |
| B35 | PDF file **contents** | every `*-EXP-*` case asserting PDF layout | PDFs **generate** (170–220 KB, HTTP 200) for SBC, SBR, TU, WIP. **Contents unread** — no PDF text extractor in this container | **NOT VERIFIED** | Install/vendor a PDF text extractor, then read every PDF header row — including the Location column, the exact gap that caused the 2026-07-31 defect | PENDING |

<!-- RECHECK-ROWS-END -->

## SUMMARY OF THIS QUEUE

**35 rows · 0 re-checked · 35 PENDING.** Covering **86 CORRECT AS IS**, **13 DEVIATION**,
**9 EDIT NEEDED / REFUTED**, **4 candidate gaps** and **2 honest NOT-VERIFIED** items.

**Highest-churn rows to re-check first when the build moves:** **B18** (the single-location Location
filter — the riskiest open question), **B7** (nav grouping), **B16/B17** (the SBR export headers),
**B28** (the PDF 500s), **B6** (the VIN chain), **B5** (the exportable-column list).
