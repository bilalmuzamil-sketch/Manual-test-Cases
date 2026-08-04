# RE-CHECK QUEUE — Report Suite VIU on the NON-FINAL QA branch `sv8582`

## 🔴 THE TRIGGER CONDITION IN THIS FILE HAS FIRED — THE BUILD MOVED, 2026-08-04 10:41:58 UTC

> **Read this before anything else in this file.** The marker check below says *"if the value is no
> longer `v3.4.1-0ed4433`, the build has moved and EVERY row below is due for re-check."*
> **It is no longer that value.** Read live at **2026-08-04 11:30 UTC**:
>
> | Marker | This pass observed | Live now |
> |---|---|---|
> | App version | `v3.4.1-0ed4433` | **`v3.4.1-3d03023`** |
> | `ETag` | `02091e9dc11f187d7739b4efa166ea21` | `9875201c58ba78d9851c37f7039c16e1` |
> | `Last-Modified` | `Mon, 03 Aug 2026 13:40:38 GMT` | **`Tue, 04 Aug 2026 10:41:58 GMT`** |
>
> **EVERY ROW BELOW IS DUE FOR RE-CHECK, and none can be closed today** — the deploy also killed the
> session (`quick-login` → **HTTP 401 `sso_required`**), so nothing live can be observed until the QA
> lead supplies fresh cookies. **The 469 provenance lines still say "the build tested on 8/4/2026",
> which is now ambiguous: two builds existed that day.** Re-stamping is queued, not done.
>
> Full write-up and raw probe: `../build-change-2026-08-04/BUILD-MOVED-2026-08-04.md`.

## STATUS: **OPEN — ACCEPTED-AS-FINAL-FOR-NOW (2026-08-04), NOW ALSO BUILD-SUPERSEDED**

> ### THE QA LEAD'S RULING, 2026-08-04 — verbatim
>
> *"Since the automation developers are going to automate the test cases today, for now consider
> the branch verification as final for now and make the required changes in the test cases."*
>
> **What this changes.** The corrections that had been withheld *only* because the branch was
> declared non-final were applied to TestRail on **2026-08-04**
> (`../final-push-2026-08-04/testrail-execution-log.md`). The branch's observations are treated as
> **final FOR NOW** so the automation engineers have a stable target today.
>
> **What this does NOT change — this queue stays OPEN and must remain retrievable.**
> Engineering's 2026-08-03 position (*"this QA Branch is also not final they are still working on
> it"*) has **not** been withdrawn; the QA lead's ruling is an instruction to proceed, **not** a
> statement that the build stopped moving. So **every row below keeps its re-check obligation**,
> the build marker below is still the thing to compare against, and **no Report Suite deliverable
> may be described as VIU-complete while this file is OPEN** (Standing Rule 49). Do **not** delete
> or archive this file.
>
> **Added obligation from the same day — re-stamp the attestation date.** Every one of the 478
> cases now carries a plain build-date line at the end of its Expected Results:
> *"This is the expected behaviour as per the build tested on 8/4/2026, and as per the &lt;report&gt;
> report specification version &lt;N&gt; (&lt;anchors&gt;)."*
> When the build changes, **re-stamping that date is a required step of the re-check** — it is a
> single constant (`BUILD_DATE`) in `../final-push-2026-08-04/build_plan.py`, with the spec
> versions in the `SPEC` map beside it. **A stale attestation date, or a stale spec version, is
> itself a finding.**

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


## MERGED BATCH ROWS (2026-08-04)

The three per-report batches and the authorised push of 2026-08-04 add **394 further rows** to this queue. They are appended here rather than folded into the 35 rows above, so the provenance of each row stays readable. **This queue stays OPEN.**

### MERGED Sales By Customer + Sales By Representative — 46 rows

*Source `batch-sbc-sbr/RECHECK-ROWS.md`, merged 2026-08-04. Build marker `v3.4.1-0ed4433`, unchanged at the start and the end of that pass. Every row PENDING.*

| Case | C-id | Verdict now | What to re-confirm |
|---|---|---|---|
| `SBC-CALC-03` | [C30151](https://shopview.testrail.io/index.php?/cases/view/30151) | DEVIATION | Re-run once invoiced-hours data exists: the +green / -red colouring on Inv. Hrs. |
| `SBR-CALC-01` | [C30229](https://shopview.testrail.io/index.php?/cases/view/30229) | DEVIATION | Re-run once hours exist: Inv. Hrs = hours invoiced - hours worked, half-up to one decimal. |
| `SBR-CALC-02` | [C30230](https://shopview.testrail.io/index.php?/cases/view/30230) | DEVIATION | Re-run once hours exist: colouring and rollups from unrounded deltas. |
| `SBR-CALC-03` | [C30231](https://shopview.testrail.io/index.php?/cases/view/30231) | DEVIATION | Re-run once hours exist: the negative clocked-unbilled case. |
| `SBR-CALC-09` | [C38894](https://shopview.testrail.io/index.php?/cases/view/38894) | DEVIATION | Re-run once hours exist: a clock-record edit after invoicing moves Inv. Hrs but not money. |
| `SBR-DEACT-02` | [C30253](https://shopview.testrail.io/index.php?/cases/view/30253) | EXTERNAL-DEPENDENCY | Re-run once invoice creation works: the counted, pluralised dialog headline and focus trap. |
| `SBR-DEACT-03` | [C30254](https://shopview.testrail.io/index.php?/cases/view/30254) | EXTERNAL-DEPENDENCY | Re-run: the type-YES gate (auto-focus, case-insensitive, Enter submits). |
| `SBR-DEACT-04` | [C30255](https://shopview.testrail.io/index.php?/cases/view/30255) | EXTERNAL-DEPENDENCY | Re-run: Cancel/X dismiss, Escape and outside-click do not. |
| `SBR-DEACT-05` | [C30256](https://shopview.testrail.io/index.php?/cases/view/30256) | EXTERNAL-DEPENDENCY | Re-run: valid submit locks the dialog then deactivates, keeping assignments. |
| `SBR-DEACT-06` | [C30257](https://shopview.testrail.io/index.php?/cases/view/30257) | EXTERNAL-DEPENDENCY | Re-run the dialog half; the report-credit half is already proven (F41). |
| `SBR-DEACT-07` | [C30258](https://shopview.testrail.io/index.php?/cases/view/30258) | EXTERNAL-DEPENDENCY | Re-run through the staff-administration UI, not the API — that was the correction made this pass. |
| `SBR-DEACT-08` | [C30259](https://shopview.testrail.io/index.php?/cases/view/30259) | EXTERNAL-DEPENDENCY | Re-run: a deactivation failure shows the error toast and leaves status alone. |
| `SBR-DEACT-09` | [C30260](https://shopview.testrail.io/index.php?/cases/view/30260) | EXTERNAL-DEPENDENCY | Re-run: a failed pre-check still opens the warning dialog. |
| `SBR-API-06` | [C30321](https://shopview.testrail.io/index.php?/cases/view/30321) | EXTERNAL-DEPENDENCY | Re-run: the pre-check request fires first and its count matches the dialog headline. |
| `SBC-TREE-11` | [C30131](https://shopview.testrail.io/index.php?/cases/view/30131) | NOT-BUILT | Re-check when a service invoice with no vehicle exists — no 'Parts Sales' bucket appeared at all. |
| `SBC-TREE-06` | [C30126](https://shopview.testrail.io/index.php?/cases/view/30126) | VIU-Observed-PASS | Re-check the 'Parts Sales bucket always last' half — no such bucket existed. |
| `SBC-LBL-01` | [C30134](https://shopview.testrail.io/index.php?/cases/view/30134) | VIU-Observed-PASS | Re-check the Unit # and plate fallbacks — every asset had a VIN. |
| `SBC-LBL-04` | [C30137](https://shopview.testrail.io/index.php?/cases/view/30137) | NOT-BUILT | Re-check when two assets share a label — no duplicate existed, so no (#1)/(#2) suffix. |
| `SBC-LOC-04` | [C38912](https://shopview.testrail.io/index.php?/cases/view/38912) | VIU-Observed-PASS | Re-check the 'Multiple' cell — no SBC customer spanned two locations. |
| `SBR-ROW-03` | [C30219](https://shopview.testrail.io/index.php?/cases/view/30219) | NOT-BUILT | Re-check once a toggled-off or deleted rep holds an invoice — the (Inactive) tag was unobservable. |
| `SBR-CALC-07` | [C30235](https://shopview.testrail.io/index.php?/cases/view/30235) | NOT-BUILT | Re-check when a negative dollar value exists — accounting parentheses were unobservable. |
| `SBR-EXP-05` | [C30280](https://shopview.testrail.io/index.php?/cases/view/30280) | NOT-BUILT | Re-check when an invoice number exceeds 18 characters. |
| `SBR-EXP-07` | [C30282](https://shopview.testrail.io/index.php?/cases/view/30282) | NOT-BUILT | Re-check both clauses (negative money, (Inactive) tag). |
| `SBR-EXP-08` | [C30283](https://shopview.testrail.io/index.php?/cases/view/30283) | VIU-Observed-PASS | Re-check the PDF font step-down thresholds — they were never forced. |
| `SBR-VIS-05` | [C30309](https://shopview.testrail.io/index.php?/cases/view/30309) | VIU-Observed-PASS | Re-check the (Inactive) tag's contrast — only the (N) count was measurable. |
| `SBR-WO-01` | [C30310](https://shopview.testrail.io/index.php?/cases/view/30310) | VIU-Observed-PASS | Re-check on a Part Sale WO and an imported WO — only a standard WO was driven. |
| `SBR-WO-05` | [C30314](https://shopview.testrail.io/index.php?/cases/view/30314) | VIU-Observed-PASS | Re-check the customer-rep fallback leg — it only applies at invoice creation. |
| `SBR-WO-06` | [C30315](https://shopview.testrail.io/index.php?/cases/view/30315) | VIU-Observed-PASS | Re-check the 'Unassigned' empty text on a customer with no rep. |
| `SBR-MOB-03` | [C30304](https://shopview.testrail.io/index.php?/cases/view/30304) | DEVIATION | Re-check the hover-only-tooltip clause — it could not be forced separately. |
| `SBC-EXP-09` | [C30167](https://shopview.testrail.io/index.php?/cases/view/30167) | VIU-Observed-PASS | Re-confirm the PDF Date Range end date (off by one day this run). |
| `SBR-ASGN-01` | [C30292](https://shopview.testrail.io/index.php?/cases/view/30292) | NOT-BUILT | Re-check whether the Sales Representative Assignments export has been built. |
| `SBC-EXP-14` | [C30172](https://shopview.testrail.io/index.php?/cases/view/30172) | DEVIATION | Re-check on a bigger org whether the 10,000-row refusal message exists at all, AND whether the Expanded PDF still 500s at scale. |
| `SBR-EXP-15` | [C30290](https://shopview.testrail.io/index.php?/cases/view/30290) | DEVIATION | Same as SBC-EXP-14. |
| `SBC-API-05` | [C30194](https://shopview.testrail.io/index.php?/cases/view/30194) | DEVIATION | Same as SBC-EXP-14 - the cap-counted-first half is still unverified. |
| `SBR-API-05` | [C30320](https://shopview.testrail.io/index.php?/cases/view/30320) | DEVIATION | Same as SBC-EXP-14. |
| `SBC-EXP-15` | [C30173](https://shopview.testrail.io/index.php?/cases/view/30173) | DEVIATION | Re-check whether a zeroed totals row has been added to empty exports. |
| `SBR-EXP-16` | [C30291](https://shopview.testrail.io/index.php?/cases/view/30291) | DEVIATION | Same as SBC-EXP-15. |

| Case | C-id | Read as | Re-confirm |
|---|---|---|---|
| `SBC-DATE-04` | [C30105](https://shopview.testrail.io/index.php?/cases/view/30105) | not-built-yet | whether shareable URL state has been added |
| `SBC-PERS-06` | [C30179](https://shopview.testrail.io/index.php?/cases/view/30179) | not-built-yet | same — depends on URL state existing |
| `SBC-EMPTY-01` | [C30181](https://shopview.testrail.io/index.php?/cases/view/30181) | not-built-yet | whether an empty-state message has been added |
| `SBC-EMPTY-02` | [C30182](https://shopview.testrail.io/index.php?/cases/view/30182) | not-built-yet | same |
| `SBR-STATE-01` | [C30298](https://shopview.testrail.io/index.php?/cases/view/30298) | not-built-yet | same, on the SBR side |
| `SBR-STATE-04` | [C30301](https://shopview.testrail.io/index.php?/cases/view/30301) | not-built-yet | whether an inline could-not-load message with Retry has been added |
| `SBR-TOT-03` | [C30239](https://shopview.testrail.io/index.php?/cases/view/30239) | not-built-yet | whether the mobile totals bar has been added |
| `SBC-NAV-01` | [C30096](https://shopview.testrail.io/index.php?/cases/view/30096) | PO question | whether SALES is the intended nav group |
| `SBR-LOC-04` | [C30216](https://shopview.testrail.io/index.php?/cases/view/30216) | spec-vs-ruling | whether the Location filter should hide for one-location users |


### MERGED Parts Velocity + Technician Utilization — 144 rows

*Source `batch-pv-tu/RECHECK-ROWS.md`, merged 2026-08-04. Build marker `v3.4.1-0ed4433`, unchanged at the start and the end of that pass. Every row PENDING.*

| Case | C-id | What is still owed |
|---|---|---|
| PV-FILT-04 | [C30331](https://shopview.testrail.io/index.php?/cases/view/30331) | Re-drive the over-cap span from the calendar UI once the branch is final, to confirm the on-screen rejection wording. |
| PV-FILT-12 | [C30339](https://shopview.testrail.io/index.php?/cases/view/30339) | Re-check the no-category third once a part with a genuinely unassigned category exists. |
| PV-COL-06 | [C30356](https://shopview.testrail.io/index.php?/cases/view/30356) | Re-drive with two real sign-ins in one browser profile once the branch is final. |
| PV-CALC-03 | [C30361](https://shopview.testrail.io/index.php?/cases/view/30361) | Cross-read the return records once a returns endpoint or the Returns screen is drivable. |
| PV-CALC-04 | [C30362](https://shopview.testrail.io/index.php?/cases/view/30362) | Seed a return whose initiation date falls in a different window from its sale and re-check. |
| PV-CALC-11 | [C30369](https://shopview.testrail.io/index.php?/cases/view/30369) | Reverse a known invoice and re-measure the same part once an invoice endpoint or screen is drivable. |
| PV-CALC-12 | [C30370](https://shopview.testrail.io/index.php?/cases/view/30370) | Seed a revenue-with-zero-billed-quantity adjustment to exercise the mirror case. |
| PV-PREC-01 | [C38924](https://shopview.testrail.io/index.php?/cases/view/38924) | Seed a fractional-quantity part line, invoice it, and re-check Units Sold specifically. |
| TU-NAV-04 | [C30395](https://shopview.testrail.io/index.php?/cases/view/30395) | Re-drive the over-cap span from the calendar UI once the branch is final. |
| TU-ELL-03 | [C30406](https://shopview.testrail.io/index.php?/cases/view/30406) | Re-check the explicit $0.00-rate variant once the branch is final. |
| TU-SUM-04 | [C30417](https://shopview.testrail.io/index.php?/cases/view/30417) | Re-check the all-em-dash Summary clause once a location with no default labor rate exists. |
| TU-LINK-03 | [C30430](https://shopview.testrail.io/index.php?/cases/view/30430) | Re-reconcile a high-volume technician once the branch is final. |
| TU-EXP-06 | [C30439](https://shopview.testrail.io/index.php?/cases/view/30439) | Re-check the bundled-default fallback on an organisation with no uploaded logo. |

| Internal ID | C-id | Link | Verdict this run | Observed on | Re-check obligation |
|---|---|---|---|---|---|
| PV-NAV-01 | C30322 | [open](https://shopview.testrail.io/index.php?/cases/view/30322) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-NAV-02 | C30323 | [open](https://shopview.testrail.io/index.php?/cases/view/30323) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-NAV-03 | C30324 | [open](https://shopview.testrail.io/index.php?/cases/view/30324) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-PERM-01 | C30325 | [open](https://shopview.testrail.io/index.php?/cases/view/30325) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-PERM-02 | C30326 | [open](https://shopview.testrail.io/index.php?/cases/view/30326) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-PERM-03 | C30327 | [open](https://shopview.testrail.io/index.php?/cases/view/30327) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-FILT-01 | C30328 | [open](https://shopview.testrail.io/index.php?/cases/view/30328) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-FILT-03 | C30330 | [open](https://shopview.testrail.io/index.php?/cases/view/30330) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-FILT-04 | C30331 | [open](https://shopview.testrail.io/index.php?/cases/view/30331) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-drive the over-cap span from the calendar UI once the branch is final, to confirm the on-screen rejection wording. |
| PV-FILT-05 | C30332 | [open](https://shopview.testrail.io/index.php?/cases/view/30332) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-FILT-06 | C30333 | [open](https://shopview.testrail.io/index.php?/cases/view/30333) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-FILT-07 | C30334 | [open](https://shopview.testrail.io/index.php?/cases/view/30334) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-FILT-08 | C30335 | [open](https://shopview.testrail.io/index.php?/cases/view/30335) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-FILT-09 | C30336 | [open](https://shopview.testrail.io/index.php?/cases/view/30336) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-FILT-10 | C30337 | [open](https://shopview.testrail.io/index.php?/cases/view/30337) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-FILT-11 | C30338 | [open](https://shopview.testrail.io/index.php?/cases/view/30338) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-FILT-12 | C30339 | [open](https://shopview.testrail.io/index.php?/cases/view/30339) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-check the no-category third once a part with a genuinely unassigned category exists. |
| PV-FILT-13 | C30340 | [open](https://shopview.testrail.io/index.php?/cases/view/30340) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-FILT-14 | C38914 | [open](https://shopview.testrail.io/index.php?/cases/view/38914) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-ROW-01 | C30341 | [open](https://shopview.testrail.io/index.php?/cases/view/30341) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-ROW-02 | C30342 | [open](https://shopview.testrail.io/index.php?/cases/view/30342) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-ROW-03 | C30343 | [open](https://shopview.testrail.io/index.php?/cases/view/30343) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-ROW-04 | C30344 | [open](https://shopview.testrail.io/index.php?/cases/view/30344) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-ROW-05 | C30345 | [open](https://shopview.testrail.io/index.php?/cases/view/30345) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-ROW-06 | C30346 | [open](https://shopview.testrail.io/index.php?/cases/view/30346) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-ROW-07 | C30347 | [open](https://shopview.testrail.io/index.php?/cases/view/30347) | DEVIATION | v3.4.1-0ed4433 | Re-measure at a narrow viewport once the branch is final. |
| PV-ROW-08 | C30348 | [open](https://shopview.testrail.io/index.php?/cases/view/30348) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-ROW-09 | C30349 | [open](https://shopview.testrail.io/index.php?/cases/view/30349) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-ROW-10 | C30350 | [open](https://shopview.testrail.io/index.php?/cases/view/30350) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-COL-01 | C30351 | [open](https://shopview.testrail.io/index.php?/cases/view/30351) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-COL-02 | C30352 | [open](https://shopview.testrail.io/index.php?/cases/view/30352) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-COL-03 | C30353 | [open](https://shopview.testrail.io/index.php?/cases/view/30353) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-COL-04 | C30354 | [open](https://shopview.testrail.io/index.php?/cases/view/30354) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-COL-05 | C30355 | [open](https://shopview.testrail.io/index.php?/cases/view/30355) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-COL-06 | C30356 | [open](https://shopview.testrail.io/index.php?/cases/view/30356) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-drive with two real sign-ins in one browser profile once the branch is final. |
| PV-COL-08 | C30358 | [open](https://shopview.testrail.io/index.php?/cases/view/30358) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-CALC-01 | C30359 | [open](https://shopview.testrail.io/index.php?/cases/view/30359) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-CALC-02 | C30360 | [open](https://shopview.testrail.io/index.php?/cases/view/30360) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-CALC-03 | C30361 | [open](https://shopview.testrail.io/index.php?/cases/view/30361) | VIU-Observed-PASS | v3.4.1-0ed4433 | Cross-read the return records once a returns endpoint or the Returns screen is drivable. |
| PV-CALC-04 | C30362 | [open](https://shopview.testrail.io/index.php?/cases/view/30362) | VIU-Observed-PASS | v3.4.1-0ed4433 | Seed a return whose initiation date falls in a different window from its sale and re-check. |
| PV-CALC-05 | C30363 | [open](https://shopview.testrail.io/index.php?/cases/view/30363) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-CALC-06 | C30364 | [open](https://shopview.testrail.io/index.php?/cases/view/30364) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-CALC-07 | C30365 | [open](https://shopview.testrail.io/index.php?/cases/view/30365) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-CALC-08 | C30366 | [open](https://shopview.testrail.io/index.php?/cases/view/30366) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-CALC-09 | C30367 | [open](https://shopview.testrail.io/index.php?/cases/view/30367) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-CALC-10 | C30368 | [open](https://shopview.testrail.io/index.php?/cases/view/30368) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-CALC-11 | C30369 | [open](https://shopview.testrail.io/index.php?/cases/view/30369) | VIU-Observed-PASS | v3.4.1-0ed4433 | Reverse a known invoice and re-measure the same part once an invoice endpoint or screen is drivable. |
| PV-CALC-12 | C30370 | [open](https://shopview.testrail.io/index.php?/cases/view/30370) | VIU-Observed-PASS | v3.4.1-0ed4433 | Seed a revenue-with-zero-billed-quantity adjustment to exercise the mirror case. |
| PV-CALC-13 | C30371 | [open](https://shopview.testrail.io/index.php?/cases/view/30371) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-CALC-14 | C30372 | [open](https://shopview.testrail.io/index.php?/cases/view/30372) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-CALC-15 | C30373 | [open](https://shopview.testrail.io/index.php?/cases/view/30373) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-CALC-16 | C30374 | [open](https://shopview.testrail.io/index.php?/cases/view/30374) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-PREC-01 | C38924 | [open](https://shopview.testrail.io/index.php?/cases/view/38924) | VIU-Observed-PASS | v3.4.1-0ed4433 | Seed a fractional-quantity part line, invoice it, and re-check Units Sold specifically. |
| PV-EXP-01 | C30375 | [open](https://shopview.testrail.io/index.php?/cases/view/30375) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-EXP-02 | C30376 | [open](https://shopview.testrail.io/index.php?/cases/view/30376) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-EXP-03 | C30377 | [open](https://shopview.testrail.io/index.php?/cases/view/30377) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-EXP-04 | C30378 | [open](https://shopview.testrail.io/index.php?/cases/view/30378) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-EXP-05 | C30379 | [open](https://shopview.testrail.io/index.php?/cases/view/30379) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-EXP-06 | C30380 | [open](https://shopview.testrail.io/index.php?/cases/view/30380) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-EXP-07 | C30381 | [open](https://shopview.testrail.io/index.php?/cases/view/30381) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-EXP-08 | C30382 | [open](https://shopview.testrail.io/index.php?/cases/view/30382) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-EXP-10 | C30384 | [open](https://shopview.testrail.io/index.php?/cases/view/30384) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-EXP-11 | C38885 | [open](https://shopview.testrail.io/index.php?/cases/view/38885) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-VIS-01 | C30385 | [open](https://shopview.testrail.io/index.php?/cases/view/30385) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-VIS-02 | C30386 | [open](https://shopview.testrail.io/index.php?/cases/view/30386) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-VIS-03 | C30387 | [open](https://shopview.testrail.io/index.php?/cases/view/30387) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-API-01 | C30388 | [open](https://shopview.testrail.io/index.php?/cases/view/30388) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-API-02 | C30389 | [open](https://shopview.testrail.io/index.php?/cases/view/30389) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-API-03 | C30390 | [open](https://shopview.testrail.io/index.php?/cases/view/30390) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-API-04 | C30391 | [open](https://shopview.testrail.io/index.php?/cases/view/30391) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-PREC-02 | C38925 | [open](https://shopview.testrail.io/index.php?/cases/view/38925) | EXTERNAL-DEPENDENCY | v3.4.1-0ed4433 | Re-run once a QuickBooks-connected company is available on the QA branch. |
| TU-NAV-01 | C30392 | [open](https://shopview.testrail.io/index.php?/cases/view/30392) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-NAV-02 | C30393 | [open](https://shopview.testrail.io/index.php?/cases/view/30393) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-NAV-03 | C30394 | [open](https://shopview.testrail.io/index.php?/cases/view/30394) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-NAV-04 | C30395 | [open](https://shopview.testrail.io/index.php?/cases/view/30395) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-drive the over-cap span from the calendar UI once the branch is final. |
| TU-NAV-05 | C30396 | [open](https://shopview.testrail.io/index.php?/cases/view/30396) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-NAV-06 | C30397 | [open](https://shopview.testrail.io/index.php?/cases/view/30397) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-NAV-07 | C30398 | [open](https://shopview.testrail.io/index.php?/cases/view/30398) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-NAV-08 | C30399 | [open](https://shopview.testrail.io/index.php?/cases/view/30399) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-HRS-02 | C30401 | [open](https://shopview.testrail.io/index.php?/cases/view/30401) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-HRS-03 | C30402 | [open](https://shopview.testrail.io/index.php?/cases/view/30402) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-HRS-04 | C30403 | [open](https://shopview.testrail.io/index.php?/cases/view/30403) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-ELL-01 | C30404 | [open](https://shopview.testrail.io/index.php?/cases/view/30404) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-ELL-02 | C30405 | [open](https://shopview.testrail.io/index.php?/cases/view/30405) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-ELL-03 | C30406 | [open](https://shopview.testrail.io/index.php?/cases/view/30406) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-check the explicit $0.00-rate variant once the branch is final. |
| TU-ELL-04 | C30407 | [open](https://shopview.testrail.io/index.php?/cases/view/30407) | EXTERNAL-DEPENDENCY | v3.4.1-0ed4433 | Re-run once an administrator provides a location with no default labor rate, or once the default can be cleared. |
| TU-ELL-05 | C30408 | [open](https://shopview.testrail.io/index.php?/cases/view/30408) | EXTERNAL-DEPENDENCY | v3.4.1-0ed4433 | Re-run once a location with no default labor rate exists. |
| TU-SORT-01 | C30409 | [open](https://shopview.testrail.io/index.php?/cases/view/30409) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-SORT-02 | C30410 | [open](https://shopview.testrail.io/index.php?/cases/view/30410) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-SORT-03 | C30411 | [open](https://shopview.testrail.io/index.php?/cases/view/30411) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-SORT-04 | C30412 | [open](https://shopview.testrail.io/index.php?/cases/view/30412) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-SORT-05 | C30413 | [open](https://shopview.testrail.io/index.php?/cases/view/30413) | EXTERNAL-DEPENDENCY | v3.4.1-0ed4433 | Re-run the both-directions em-dash sort once a location with no default labor rate exists. |
| TU-SUM-01 | C30414 | [open](https://shopview.testrail.io/index.php?/cases/view/30414) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-SUM-02 | C30415 | [open](https://shopview.testrail.io/index.php?/cases/view/30415) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-SUM-03 | C30416 | [open](https://shopview.testrail.io/index.php?/cases/view/30416) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-SUM-04 | C30417 | [open](https://shopview.testrail.io/index.php?/cases/view/30417) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-check the all-em-dash Summary clause once a location with no default labor rate exists. |
| TU-DAY-01 | C30418 | [open](https://shopview.testrail.io/index.php?/cases/view/30418) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-DAY-02 | C30419 | [open](https://shopview.testrail.io/index.php?/cases/view/30419) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-DAY-03 | C30420 | [open](https://shopview.testrail.io/index.php?/cases/view/30420) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-DAY-04 | C30421 | [open](https://shopview.testrail.io/index.php?/cases/view/30421) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-DAY-05 | C30422 | [open](https://shopview.testrail.io/index.php?/cases/view/30422) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-TECH-01 | C30423 | [open](https://shopview.testrail.io/index.php?/cases/view/30423) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-TECH-02 | C30424 | [open](https://shopview.testrail.io/index.php?/cases/view/30424) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-TECH-03 | C30425 | [open](https://shopview.testrail.io/index.php?/cases/view/30425) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-TECH-04 | C30426 | [open](https://shopview.testrail.io/index.php?/cases/view/30426) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-LINK-01 | C30428 | [open](https://shopview.testrail.io/index.php?/cases/view/30428) | DEVIATION | v3.4.1-0ed4433 | Drive Enter-key activation and re-check the at-rest affordance once the branch is final. |
| TU-LINK-02 | C30429 | [open](https://shopview.testrail.io/index.php?/cases/view/30429) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-LINK-03 | C30430 | [open](https://shopview.testrail.io/index.php?/cases/view/30430) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-reconcile a high-volume technician once the branch is final. |
| TU-LINK-04 | C30431 | [open](https://shopview.testrail.io/index.php?/cases/view/30431) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-LINK-05 | C30432 | [open](https://shopview.testrail.io/index.php?/cases/view/30432) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-LINK-06 | C30433 | [open](https://shopview.testrail.io/index.php?/cases/view/30433) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-EXP-01 | C30434 | [open](https://shopview.testrail.io/index.php?/cases/view/30434) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-EXP-02 | C30435 | [open](https://shopview.testrail.io/index.php?/cases/view/30435) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-EXP-03 | C30436 | [open](https://shopview.testrail.io/index.php?/cases/view/30436) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-EXP-04 | C30437 | [open](https://shopview.testrail.io/index.php?/cases/view/30437) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-EXP-05 | C30438 | [open](https://shopview.testrail.io/index.php?/cases/view/30438) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-EXP-06 | C30439 | [open](https://shopview.testrail.io/index.php?/cases/view/30439) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-check the bundled-default fallback on an organisation with no uploaded logo. |
| TU-EXP-07 | C30440 | [open](https://shopview.testrail.io/index.php?/cases/view/30440) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-EXP-08 | C30441 | [open](https://shopview.testrail.io/index.php?/cases/view/30441) | DEVIATION | v3.4.1-0ed4433 | Provoke a genuine TU download failure once the branch is final, to read the failure toast. |
| TU-EXP-09 | C38887 | [open](https://shopview.testrail.io/index.php?/cases/view/38887) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-LOC-01 | C30442 | [open](https://shopview.testrail.io/index.php?/cases/view/30442) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-LOC-02 | C30443 | [open](https://shopview.testrail.io/index.php?/cases/view/30443) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-LOC-03 | C30444 | [open](https://shopview.testrail.io/index.php?/cases/view/30444) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-LOC-04 | C30445 | [open](https://shopview.testrail.io/index.php?/cases/view/30445) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-LOC-05 | C30446 | [open](https://shopview.testrail.io/index.php?/cases/view/30446) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-LOC-06 | C38915 | [open](https://shopview.testrail.io/index.php?/cases/view/38915) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-VIS-01 | C30447 | [open](https://shopview.testrail.io/index.php?/cases/view/30447) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-VIS-02 | C30448 | [open](https://shopview.testrail.io/index.php?/cases/view/30448) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-COL-01 | C38859 | [open](https://shopview.testrail.io/index.php?/cases/view/38859) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-API-01 | C30449 | [open](https://shopview.testrail.io/index.php?/cases/view/30449) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-API-02 | C30450 | [open](https://shopview.testrail.io/index.php?/cases/view/30450) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |


### MERGED Work In Progress + Inventory Value — 164 rows

*Source `batch-wip-iv/RECHECK-ROWS.md`, merged 2026-08-04. Build marker `v3.4.1-0ed4433`, unchanged at the start and the end of that pass. Every row PENDING.*

| # | Internal ID | C-id | Link | Verdict on build `v3.4.1-0ed4433` | What must be re-confirmed |
|---:|---|---|---|---|---|
| 1 | WIP-TAB-01 | C30451 | [open](https://shopview.testrail.io/index.php?/cases/view/30451) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 2 | WIP-TAB-02 | C30452 | [open](https://shopview.testrail.io/index.php?/cases/view/30452) | DEVIATION | Re-confirm the on-screen label text on the final build before adopting it permanently. |
| 3 | WIP-TAB-03 | C30453 | [open](https://shopview.testrail.io/index.php?/cases/view/30453) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 4 | WIP-TAB-05 | C30455 | [open](https://shopview.testrail.io/index.php?/cases/view/30455) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 5 | WIP-SCOPE-01 | C30456 | [open](https://shopview.testrail.io/index.php?/cases/view/30456) | VIU-Observed-PASS | Re-run once an In progress work order exists (or seed one through the UI) to observe the fifth status branch. Also re-confirm on the final build. |
| 6 | WIP-SCOPE-02 | C30457 | [open](https://shopview.testrail.io/index.php?/cases/view/30457) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 7 | WIP-SCOPE-03 | C30458 | [open](https://shopview.testrail.io/index.php?/cases/view/30458) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 8 | WIP-SCOPE-04 | C30459 | [open](https://shopview.testrail.io/index.php?/cases/view/30459) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 9 | WIP-SCOPE-05 | C30460 | [open](https://shopview.testrail.io/index.php?/cases/view/30460) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 10 | WIP-PLACE-01 | C30462 | [open](https://shopview.testrail.io/index.php?/cases/view/30462) | VIU-Observed-PASS | Re-run when an In progress work order exists to observe that branch. Also re-confirm on the final build. |
| 11 | WIP-PLACE-03 | C30464 | [open](https://shopview.testrail.io/index.php?/cases/view/30464) | VIU-Observed-PASS | Re-run against a purpose-seeded trio (clocked time / received part / neither) to attribute each branch to its specific cause. Also re-confirm on the final build. |
| 12 | WIP-COL-01 | C30466 | [open](https://shopview.testrail.io/index.php?/cases/view/30466) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 13 | WIP-COL-02 | C30467 | [open](https://shopview.testrail.io/index.php?/cases/view/30467) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 14 | WIP-COL-03 | C30468 | [open](https://shopview.testrail.io/index.php?/cases/view/30468) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 15 | WIP-COL-04 | C30469 | [open](https://shopview.testrail.io/index.php?/cases/view/30469) | DEVIATION | Re-confirm the on-screen label text on the final build before adopting it permanently. |
| 16 | WIP-COL-05 | C30470 | [open](https://shopview.testrail.io/index.php?/cases/view/30470) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 17 | WIP-COL-06 | C30471 | [open](https://shopview.testrail.io/index.php?/cases/view/30471) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 18 | WIP-COL-07 | C30472 | [open](https://shopview.testrail.io/index.php?/cases/view/30472) | VIU-Observed-PASS | Re-run against a work order created today and one created exactly one day ago to observe the "0 days" / "1 days" endpoints specifically. Also re-confirm on the final build. |
| 19 | WIP-COL-08 | C30473 | [open](https://shopview.testrail.io/index.php?/cases/view/30473) | VIU-Observed-PASS | Re-run against a work order touched today ("Today") and one with no recorded activity ("—") to observe those two branches. Also re-confirm on the final build. |
| 20 | WIP-CALC-01 | C30474 | [open](https://shopview.testrail.io/index.php?/cases/view/30474) | VIU-Observed-PASS | A negative WIP money value did not occur in the data; re-run if one becomes producible. Also re-confirm on the final build. |
| 21 | WIP-CALC-02 | C30475 | [open](https://shopview.testrail.io/index.php?/cases/view/30475) | VIU-Observed-PASS | Re-run with a purpose-seeded work order (one approved labor line, known quote, known clocked time, plus an over-clocked line) to observe the per-line cap directly. Also re-confirm on the final build. |
| 22 | WIP-CALC-03 | C30476 | [open](https://shopview.testrail.io/index.php?/cases/view/30476) | VIU-Observed-PASS | Re-run with a seeded known-quote work order to check the arithmetic against a hand-computed quoted value. Also re-confirm on the final build. |
| 23 | WIP-CALC-04 | C30477 | [open](https://shopview.testrail.io/index.php?/cases/view/30477) | VIU-Observed-PASS | Re-run with a seeded partly-received parts line to attribute the figure to a known quantity x sell price. Also re-confirm on the final build. |
| 24 | WIP-CALC-05 | C30478 | [open](https://shopview.testrail.io/index.php?/cases/view/30478) | VIU-Observed-PASS | The core-charge half (outstanding quantity valued INCLUDING the core charge) needs a seeded cored part on an approved unreceived line - re-run for that. Also re-confirm on the final build. |
| 25 | WIP-CALC-06 | C30479 | [open](https://shopview.testrail.io/index.php?/cases/view/30479) | VIU-Observed-PASS | Re-run the "differs from the work order's stored grand total" comparison against a seeded work order carrying tax/fee/discount. Also re-confirm on the final build. |
| 26 | WIP-CALC-07 | C30480 | [open](https://shopview.testrail.io/index.php?/cases/view/30480) | VIU-Observed-PASS | Re-run the before/after variant - add an unapproved line to a valued work order and confirm no figure moves. Also re-confirm on the final build. |
| 27 | WIP-CALC-08 | C30481 | [open](https://shopview.testrail.io/index.php?/cases/view/30481) | VIU-Observed-PASS | The green/red/zero colouring and the exact +2.0 / -14.0 / 0.0 rendering still need a screen read with the column on and rows of each sign - the toggle click was flaky in the scripted run (a tooling artefact; the toggle itself is proven by colsel-work-in-progress.json). Re-run on the final build. |
| 28 | WIP-CALC-09 | C30482 | [open](https://shopview.testrail.io/index.php?/cases/view/30482) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 29 | WIP-SORT-01 | C30483 | [open](https://shopview.testrail.io/index.php?/cases/view/30483) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 30 | WIP-SORT-02 | C30484 | [open](https://shopview.testrail.io/index.php?/cases/view/30484) | VIU-Observed-PASS | The exact asc -> desc -> asc cycle with no third cleared state, and the single-active-sort rule, need one more careful click sequence per column. Re-run on the final build. |
| 31 | WIP-SORT-03 | C30485 | [open](https://shopview.testrail.io/index.php?/cases/view/30485) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 32 | WIP-SORT-04 | C30486 | [open](https://shopview.testrail.io/index.php?/cases/view/30486) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 33 | WIP-CALC-10 | C38890 | [open](https://shopview.testrail.io/index.php?/cases/view/38890) | VIU-Observed-PASS | The running-clock behaviour (a technician clocked in, time accruing between refreshes) needs a live clock-in on a seeded quoted line and could not be driven this run. Re-run on the final build with an open clock. |
| 34 | WIP-SUM-01 | C30487 | [open](https://shopview.testrail.io/index.php?/cases/view/30487) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 35 | WIP-SUM-02 | C30488 | [open](https://shopview.testrail.io/index.php?/cases/view/30488) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 36 | WIP-SUM-03 | C30489 | [open](https://shopview.testrail.io/index.php?/cases/view/30489) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 37 | WIP-SUM-04 | C30490 | [open](https://shopview.testrail.io/index.php?/cases/view/30490) | VIU-Observed-PASS | The Not Started tie needs the Approved - Not Started tab Totals read in the same window (the scripted tab click did not land on that tab). Re-run on the final build. |
| 38 | WIP-SUM-05 | C30491 | [open](https://shopview.testrail.io/index.php?/cases/view/30491) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 39 | WIP-SUM-07 | C30493 | [open](https://shopview.testrail.io/index.php?/cases/view/30493) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 40 | WIP-TOT-01 | C30494 | [open](https://shopview.testrail.io/index.php?/cases/view/30494) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 41 | WIP-TOT-02 | C30495 | [open](https://shopview.testrail.io/index.php?/cases/view/30495) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 42 | WIP-FLT-01 | C30498 | [open](https://shopview.testrail.io/index.php?/cases/view/30498) | VIU-Observed-PASS | The screen-only narrowing (no new /reporting call, no loading indicator) needs one clean selection with data present. Re-run on the final build. |
| 43 | WIP-FLT-02 | C30499 | [open](https://shopview.testrail.io/index.php?/cases/view/30499) | VIU-Observed-PASS | Confirm the Clear action is absent until at least one customer is selected, and that narrowing does not reload. Re-run on the final build. |
| 44 | WIP-FLT-03 | C30500 | [open](https://shopview.testrail.io/index.php?/cases/view/30500) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 45 | WIP-FLT-04 | C30501 | [open](https://shopview.testrail.io/index.php?/cases/view/30501) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 46 | WIP-FLT-05 | C30502 | [open](https://shopview.testrail.io/index.php?/cases/view/30502) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 47 | WIP-FLT-06 | C30503 | [open](https://shopview.testrail.io/index.php?/cases/view/30503) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 48 | WIP-FLT-07 | C30504 | [open](https://shopview.testrail.io/index.php?/cases/view/30504) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 49 | WIP-FLT-08 | C30505 | [open](https://shopview.testrail.io/index.php?/cases/view/30505) | VIU-Observed-PASS | The AND-combination and the "strip + Totals recompute with no reload" half need one clean three-filter selection with data present. Re-run on the final build. |
| 50 | WIP-FLT-09 | C38916 | [open](https://shopview.testrail.io/index.php?/cases/view/38916) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 51 | WIP-PERS-01 | C30506 | [open](https://shopview.testrail.io/index.php?/cases/view/30506) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 52 | WIP-PERS-02 | C30507 | [open](https://shopview.testrail.io/index.php?/cases/view/30507) | VIU-Observed-PASS | Confirm the four tabs share one column set by switching tabs with a non-default selection. Re-run on the final build. |
| 53 | WIP-PERS-03 | C30508 | [open](https://shopview.testrail.io/index.php?/cases/view/30508) | VIU-Observed-PASS | Confirm the advisor/customer/asset/location selections and the active tab restore too, and that a different browser profile shows the defaults. Re-run on the final build. |
| 54 | WIP-PERS-04 | C30509 | [open](https://shopview.testrail.io/index.php?/cases/view/30509) | VIU-Observed-PASS | Confirm the same fallback for a stale advisor/customer/asset selection. Re-run on the final build. |
| 55 | WIP-EXP-01 | C30510 | [open](https://shopview.testrail.io/index.php?/cases/view/30510) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 56 | WIP-EXP-02 | C30511 | [open](https://shopview.testrail.io/index.php?/cases/view/30511) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 57 | WIP-EXP-03 | C30512 | [open](https://shopview.testrail.io/index.php?/cases/view/30512) | VIU-Observed-PASS | The Inv. Hrs format in a file cannot be checked because the export rejects that column (see WIP-TOT-02). Re-run on the final build. |
| 58 | WIP-EXP-04 | C30513 | [open](https://shopview.testrail.io/index.php?/cases/view/30513) | NOT-BUILT | Re-run once the export accepts invoiced_hours. Until then this case is not executable. |
| 59 | WIP-EXP-05 | C30514 | [open](https://shopview.testrail.io/index.php?/cases/view/30514) | VIU-Observed-PASS | Observe the screen-vs-file one-day difference directly by generating a file either side of a day boundary. Re-run on the final build. |
| 60 | WIP-EXP-06 | C30515 | [open](https://shopview.testrail.io/index.php?/cases/view/30515) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 61 | WIP-EXP-07 | C30516 | [open](https://shopview.testrail.io/index.php?/cases/view/30516) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 62 | WIP-EXP-08 | C30517 | [open](https://shopview.testrail.io/index.php?/cases/view/30517) | VIU-Observed-PASS | This org has no shop logo set, so the logo-present branch is not observed. Set a logo and re-run, and re-confirm on the final build. |
| 63 | WIP-EXP-09 | C30518 | [open](https://shopview.testrail.io/index.php?/cases/view/30518) | VIU-Observed-PASS | The success caption "Data exported successfully." and the failure text still need a UI toast read. Re-run on the final build. |
| 64 | WIP-EXP-10 | C38918 | [open](https://shopview.testrail.io/index.php?/cases/view/38918) | EXTERNAL-DEPENDENCY | Re-run on an organisation with 10,000+ open work orders in one tab, or once a dev can lower the cap for a test. Also re-confirm on the final build. |
| 65 | WIP-VIS-01 | C30519 | [open](https://shopview.testrail.io/index.php?/cases/view/30519) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 66 | WIP-VIS-02 | C30520 | [open](https://shopview.testrail.io/index.php?/cases/view/30520) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 67 | WIP-VIS-03 | C30521 | [open](https://shopview.testrail.io/index.php?/cases/view/30521) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 68 | WIP-VIS-04 | C30522 | [open](https://shopview.testrail.io/index.php?/cases/view/30522) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 69 | WIP-VIS-05 | C30523 | [open](https://shopview.testrail.io/index.php?/cases/view/30523) | VIU-Observed-PASS | The visible focus indicator still needs a keyboard-driven screenshot. Re-run on the final build. |
| 70 | WIP-VIS-06 | C30524 | [open](https://shopview.testrail.io/index.php?/cases/view/30524) | VIU-Observed-PASS | Confirm the tooltip actually renders on keyboard focus with a focus-driven capture. Re-run on the final build. |
| 71 | WIP-VIS-07 | C30525 | [open](https://shopview.testrail.io/index.php?/cases/view/30525) | VIU-Observed-PASS | NOT observed in dark mode this run - the dark-mode toggle was not driven. Re-run with dark mode on and read the table, strip, link, Inv. Hrs colours and the two-line asset cell. |
| 72 | WIP-PERM-01 | C30526 | [open](https://shopview.testrail.io/index.php?/cases/view/30526) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 73 | WIP-PERM-02 | C30527 | [open](https://shopview.testrail.io/index.php?/cases/view/30527) | VIU-Observed-PASS | The navigation-absence half still needs a UI read as the unpermitted user. Re-run on the final build. |
| 74 | WIP-API-01 | C30528 | [open](https://shopview.testrail.io/index.php?/cases/view/30528) | EXTERNAL-DEPENDENCY | Re-run once the developers expose a read route for the stored WIP snapshot rows (or provide a DB/inspection route). Also re-confirm on the final build. |
| 75 | WIP-API-02 | C30529 | [open](https://shopview.testrail.io/index.php?/cases/view/30529) | EXTERNAL-DEPENDENCY | Re-run once the developers expose a read route for the stored WIP snapshot rows (or provide a DB/inspection route). Also re-confirm on the final build. |
| 76 | WIP-API-03 | C30530 | [open](https://shopview.testrail.io/index.php?/cases/view/30530) | EXTERNAL-DEPENDENCY | Re-run once the developers expose a read route for the stored WIP snapshot rows (or provide a DB/inspection route). Also re-confirm on the final build. |
| 77 | WIP-API-04 | C30531 | [open](https://shopview.testrail.io/index.php?/cases/view/30531) | EXTERNAL-DEPENDENCY | Re-run once the developers expose a read route for the stored WIP snapshot rows (or provide a DB/inspection route). Also re-confirm on the final build. |
| 78 | WIP-API-05 | C30532 | [open](https://shopview.testrail.io/index.php?/cases/view/30532) | EXTERNAL-DEPENDENCY | Re-run once the developers expose a read route for the stored WIP snapshot rows (or provide a DB/inspection route). Also re-confirm on the final build. |
| 79 | WIP-API-06 | C30533 | [open](https://shopview.testrail.io/index.php?/cases/view/30533) | EXTERNAL-DEPENDENCY | Re-run once the developers expose a read route for the stored WIP snapshot rows (or provide a DB/inspection route). Also re-confirm on the final build. |
| 80 | IV-NAV-01 | C30534 | [open](https://shopview.testrail.io/index.php?/cases/view/30534) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 81 | IV-NAV-02 | C30535 | [open](https://shopview.testrail.io/index.php?/cases/view/30535) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 82 | IV-NAV-03 | C30536 | [open](https://shopview.testrail.io/index.php?/cases/view/30536) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 83 | IV-NAV-05 | C30538 | [open](https://shopview.testrail.io/index.php?/cases/view/30538) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 84 | IV-NAV-06 | C30539 | [open](https://shopview.testrail.io/index.php?/cases/view/30539) | VIU-Observed-PASS | Confirm the empty-location and impossible-filter branches too. Re-run on the final build. |
| 85 | IV-SCOPE-01 | C30540 | [open](https://shopview.testrail.io/index.php?/cases/view/30540) | VIU-Observed-PASS | A true is_core part with positive stock was not located to prove the exclusion directly; the evidence is that no is_core row appears. Re-run against a seeded core-charge part on the final build. |
| 86 | IV-SCOPE-02 | C30541 | [open](https://shopview.testrail.io/index.php?/cases/view/30541) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 87 | IV-SCOPE-05 | C30544 | [open](https://shopview.testrail.io/index.php?/cases/view/30544) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 88 | IV-COL-01 | C30551 | [open](https://shopview.testrail.io/index.php?/cases/view/30551) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 89 | IV-COL-02 | C30552 | [open](https://shopview.testrail.io/index.php?/cases/view/30552) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 90 | IV-CALC-01 | C30545 | [open](https://shopview.testrail.io/index.php?/cases/view/30545) | VIU-Observed-PASS | Attribute a specific row to a known FIXED sell price (rather than a markup) with a seeded part. Re-run on the final build. |
| 91 | IV-CALC-02 | C30546 | [open](https://shopview.testrail.io/index.php?/cases/view/30546) | VIU-Observed-PASS | Attribute one row to a known matrix markup with a seeded part and a known matrix. Re-run on the final build. |
| 92 | IV-CALC-03 | C30547 | [open](https://shopview.testrail.io/index.php?/cases/view/30547) | EXTERNAL-DEPENDENCY | Re-run if the build ever permits a category-less part, or ask a developer to create one directly. Also re-confirm on the final build. |
| 93 | IV-CALC-04 | C30548 | [open](https://shopview.testrail.io/index.php?/cases/view/30548) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 94 | IV-CALC-05 | C30549 | [open](https://shopview.testrail.io/index.php?/cases/view/30549) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 95 | IV-CALC-06 | C30550 | [open](https://shopview.testrail.io/index.php?/cases/view/30550) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 96 | IV-COL-03 | C30553 | [open](https://shopview.testrail.io/index.php?/cases/view/30553) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 97 | IV-COL-04 | C30554 | [open](https://shopview.testrail.io/index.php?/cases/view/30554) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 98 | IV-COL-05 | C30555 | [open](https://shopview.testrail.io/index.php?/cases/view/30555) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 99 | IV-TOT-01 | C30556 | [open](https://shopview.testrail.io/index.php?/cases/view/30556) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 100 | IV-TOT-02 | C30557 | [open](https://shopview.testrail.io/index.php?/cases/view/30557) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 101 | IV-TOT-03 | C30558 | [open](https://shopview.testrail.io/index.php?/cases/view/30558) | VIU-Observed-PASS | The "—" branch (total Total Sell zero or negative) needs a filter whose whole set sums to zero sell. Re-run on the final build. |
| 102 | IV-DATE-01 | C30561 | [open](https://shopview.testrail.io/index.php?/cases/view/30561) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 103 | IV-DATE-02 | C30562 | [open](https://shopview.testrail.io/index.php?/cases/view/30562) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 104 | IV-DATE-03 | C30563 | [open](https://shopview.testrail.io/index.php?/cases/view/30563) | VIU-Observed-PASS | Attribute the live values to a quantity changed TODAY, after last night's capture, with a seeded part. Re-run on the final build. |
| 105 | IV-DATE-04 | C30564 | [open](https://shopview.testrail.io/index.php?/cases/view/30564) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 106 | IV-DATE-05 | C30565 | [open](https://shopview.testrail.io/index.php?/cases/view/30565) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 107 | IV-DATE-06 | C30566 | [open](https://shopview.testrail.io/index.php?/cases/view/30566) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 108 | IV-DATE-08 | C30568 | [open](https://shopview.testrail.io/index.php?/cases/view/30568) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 109 | IV-FLT-01 | C30569 | [open](https://shopview.testrail.io/index.php?/cases/view/30569) | VIU-Observed-PASS | The Vendor filter's server-side narrowing was not proven by API - the vendor parameter name was not established (GET /api/vendors is 404 on this build). Drive it through the UI dropdown and re-run on the final build. |
| 110 | IV-FLT-02 | C30570 | [open](https://shopview.testrail.io/index.php?/cases/view/30570) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 111 | IV-FLT-03 | C30571 | [open](https://shopview.testrail.io/index.php?/cases/view/30571) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 112 | IV-FLT-04 | C30572 | [open](https://shopview.testrail.io/index.php?/cases/view/30572) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 113 | IV-FLT-05 | C30573 | [open](https://shopview.testrail.io/index.php?/cases/view/30573) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 114 | IV-LOC-01 | C30574 | [open](https://shopview.testrail.io/index.php?/cases/view/30574) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 115 | IV-LOC-02 | C30575 | [open](https://shopview.testrail.io/index.php?/cases/view/30575) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 116 | IV-LOC-03 | C30576 | [open](https://shopview.testrail.io/index.php?/cases/view/30576) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 117 | IV-LOC-04 | C30577 | [open](https://shopview.testrail.io/index.php?/cases/view/30577) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 118 | IV-DATE-09 | C38892 | [open](https://shopview.testrail.io/index.php?/cases/view/38892) | EXTERNAL-DEPENDENCY | Re-run once history is several days deep and a developer confirms the snapshot read route. Also re-confirm on the final build. |
| 119 | IV-LOC-06 | C38917 | [open](https://shopview.testrail.io/index.php?/cases/view/38917) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 120 | IV-PERS-01 | C30579 | [open](https://shopview.testrail.io/index.php?/cases/view/30579) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 121 | IV-PERS-02 | C30580 | [open](https://shopview.testrail.io/index.php?/cases/view/30580) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 122 | IV-PERS-03 | C30581 | [open](https://shopview.testrail.io/index.php?/cases/view/30581) | VIU-Observed-PASS | Confirm each remembered setting individually - date range, category, vendor, search text, location, columns and sort - and that a different browser profile shows the defaults. Re-run on the final build. |
| 123 | IV-PERS-04 | C30582 | [open](https://shopview.testrail.io/index.php?/cases/view/30582) | VIU-Observed-PASS | Confirm a stale saved CATEGORY or VENDOR is specifically dropped. Re-run on the final build. |
| 124 | IV-SORT-01 | C30583 | [open](https://shopview.testrail.io/index.php?/cases/view/30583) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 125 | IV-SORT-02 | C30584 | [open](https://shopview.testrail.io/index.php?/cases/view/30584) | VIU-Observed-PASS | The exact asc -> desc -> asc click cycle with no third state needs one more careful UI sequence. Re-run on the final build. |
| 126 | IV-SORT-03 | C30585 | [open](https://shopview.testrail.io/index.php?/cases/view/30585) | VIU-Observed-PASS | The case-insensitivity of the text sort was NOT established - the sampled data did not give a clean mixed-case pair. Re-run against seeded parts named "apple" and "Apple". |
| 127 | IV-SORT-04 | C30586 | [open](https://shopview.testrail.io/index.php?/cases/view/30586) | VIU-Observed-PASS | Confirm the sort is restored after leaving and returning. Re-run on the final build. |
| 128 | IV-EXP-01 | C30587 | [open](https://shopview.testrail.io/index.php?/cases/view/30587) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 129 | IV-EXP-02 | C30588 | [open](https://shopview.testrail.io/index.php?/cases/view/30588) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 130 | IV-EXP-03 | C30589 | [open](https://shopview.testrail.io/index.php?/cases/view/30589) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 131 | IV-EXP-04 | C30590 | [open](https://shopview.testrail.io/index.php?/cases/view/30590) | VIU-Observed-PASS | This org has no shop logo set, so the logo-present branch is not observed; and the "no snapshot available for the period" header variant was not reachable. Set a logo and re-run on the final build. |
| 132 | IV-EXP-05 | C30591 | [open](https://shopview.testrail.io/index.php?/cases/view/30591) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 133 | IV-EXP-06 | C30592 | [open](https://shopview.testrail.io/index.php?/cases/view/30592) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 134 | IV-EXP-07 | C30593 | [open](https://shopview.testrail.io/index.php?/cases/view/30593) | EXTERNAL-DEPENDENCY | Re-run on an organisation with more than 10,000 in-stock part rows, or once a developer can lower the cap for a test. Also re-confirm on the final build. |
| 135 | IV-EXP-09 | C30595 | [open](https://shopview.testrail.io/index.php?/cases/view/30595) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 136 | IV-VIS-01 | C30596 | [open](https://shopview.testrail.io/index.php?/cases/view/30596) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 137 | IV-VIS-02 | C30597 | [open](https://shopview.testrail.io/index.php?/cases/view/30597) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 138 | IV-VIS-04 | C30599 | [open](https://shopview.testrail.io/index.php?/cases/view/30599) | VIU-Observed-PASS | The ellipsis glyph and the hover-reveal of the full value need a narrowed-window capture with a deliberately over-long value. Re-run on the final build. |
| 139 | IV-VIS-05 | C30600 | [open](https://shopview.testrail.io/index.php?/cases/view/30600) | VIU-Observed-PASS | NOT observed in dark mode this run - the dark-mode toggle was not driven. Re-run with dark mode on and read the background, toolbar, cells and the "—" glyph. |
| 140 | IV-VIS-06 | C30601 | [open](https://shopview.testrail.io/index.php?/cases/view/30601) | VIU-Observed-PASS | The assistive-technology half was not established - the headers did not expose an aria-sort attribute in the reads taken, so this needs an accessibility-inspector pass. Re-run on the final build. |
| 141 | IV-VIS-07 | C30602 | [open](https://shopview.testrail.io/index.php?/cases/view/30602) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 142 | IV-PERM-01 | C30603 | [open](https://shopview.testrail.io/index.php?/cases/view/30603) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 143 | IV-PERM-02 | C30604 | [open](https://shopview.testrail.io/index.php?/cases/view/30604) | VIU-Observed-PASS | The navigation-absence half still needs a UI read as the unpermitted user. Re-run on the final build. |
| 144 | IV-API-01 | C30605 | [open](https://shopview.testrail.io/index.php?/cases/view/30605) | EXTERNAL-DEPENDENCY | Re-run once the developers expose a read route for the stored inventory snapshot rows. History at this organisation currently starts around 2026-08-01, so the retention cases additionally need months of accrued history or dev-seeded dates. Also re-confirm on the final build. |
| 145 | IV-API-02 | C30606 | [open](https://shopview.testrail.io/index.php?/cases/view/30606) | EXTERNAL-DEPENDENCY | Re-run once the developers expose a read route for the stored inventory snapshot rows. History at this organisation currently starts around 2026-08-01, so the retention cases additionally need months of accrued history or dev-seeded dates. Also re-confirm on the final build. |
| 146 | IV-API-03 | C30607 | [open](https://shopview.testrail.io/index.php?/cases/view/30607) | EXTERNAL-DEPENDENCY | Re-run once the developers expose a read route for the stored inventory snapshot rows. History at this organisation currently starts around 2026-08-01, so the retention cases additionally need months of accrued history or dev-seeded dates. Also re-confirm on the final build. |
| 147 | IV-API-04 | C30608 | [open](https://shopview.testrail.io/index.php?/cases/view/30608) | EXTERNAL-DEPENDENCY | Re-run once the developers expose a read route for the stored inventory snapshot rows. History at this organisation currently starts around 2026-08-01, so the retention cases additionally need months of accrued history or dev-seeded dates. Also re-confirm on the final build. |
| 148 | IV-API-05 | C30609 | [open](https://shopview.testrail.io/index.php?/cases/view/30609) | EXTERNAL-DEPENDENCY | Re-run once the developers expose a read route for the stored inventory snapshot rows. History at this organisation currently starts around 2026-08-01, so the retention cases additionally need months of accrued history or dev-seeded dates. Also re-confirm on the final build. |
| 149 | IV-API-06 | C30610 | [open](https://shopview.testrail.io/index.php?/cases/view/30610) | EXTERNAL-DEPENDENCY | Re-run once the developers expose a read route for the stored inventory snapshot rows. History at this organisation currently starts around 2026-08-01, so the retention cases additionally need months of accrued history or dev-seeded dates. Also re-confirm on the final build. |

| Internal ID | C-id | Link | The question to answer |
|---|---|---|---|
| WIP-COL-02 | C30467 | [open](https://shopview.testrail.io/index.php?/cases/view/30467) | Is the Location column still a manual toggle, or has the automatic behaviour the spec requires been built? |
| WIP-FLT-09 | C38916 | [open](https://shopview.testrail.io/index.php?/cases/view/38916) | Same question, from the location-scope side. |
| IV-LOC-06 | C38917 | [open](https://shopview.testrail.io/index.php?/cases/view/38917) | Same question on Inventory Value, where the column is ON by default and does not auto-hide. |
| IV-COL-04 | C30554 | [open](https://shopview.testrail.io/index.php?/cases/view/30554) | Are Margin and Total Sell hidden by default yet? |
| IV-DATE-02 | C30562 | [open](https://shopview.testrail.io/index.php?/cases/view/30562) | Is the as-of date still resolving ONE DAY LATE than the end of the selected range? |
| IV-DATE-04 | C30564 | [open](https://shopview.testrail.io/index.php?/cases/view/30564) | Same off-by-one, from the history-replay side. |
| IV-EXP-09 | C30595 | [open](https://shopview.testrail.io/index.php?/cases/view/30595) | Does the large PDF still time out at ~30 s with a raw 500? |
| IV-EXP-03 | C30589 | [open](https://shopview.testrail.io/index.php?/cases/view/30589) | Does the CSV still write money with a dollar sign and thousands separators? |
| IV-EXP-02 | C30588 | [open](https://shopview.testrail.io/index.php?/cases/view/30588) | Does the export still ignore the column selection and re-order the columns? |
| IV-NAV-05 | C30538 | [open](https://shopview.testrail.io/index.php?/cases/view/30538) | Has a pagination control appeared? |
| WIP-SUM-05 | C30491 | [open](https://shopview.testrail.io/index.php?/cases/view/30491) | Does the Estimates figure still read $0.00 instead of the quoted value? |
| WIP-FLT-04 | C30501 | [open](https://shopview.testrail.io/index.php?/cases/view/30501) | Has the date control gained Today / Yesterday / Custom? |
| IV-NAV-03 | C30536 | [open](https://shopview.testrail.io/index.php?/cases/view/30536) | Does a fresh visit default to the active location yet, or still to All locations? |
| IV-LOC-04 | C30577 | [open](https://shopview.testrail.io/index.php?/cases/view/30577) | Is the Location filter hidden for a one-location user yet? |
| WIP-COL-05 | C30470 | [open](https://shopview.testrail.io/index.php?/cases/view/30470) | Does the Asset cell lead with the VIN yet? |


### MERGED the 2026-08-04 authorised push — 40 rows

*Every case CHANGED or CREATED on 2026-08-04 was changed **on the strength of a non-final build**, so each carries its own re-check obligation: when the build settles, confirm the wording we adopted is still what the build shows. A row that flips to CHANGED is a reportable finding, not a silent correction. Audit: `../viu-push-2026-08-04/testrail-execution-log.md`.*

| Internal ID | C-id | What was changed on the strength of this build | Re-check obligation | Re-check outcome |
|---|---|---|---|---|
| `SBC-DATE-03` | [C30104](https://shopview.testrail.io/index.php?/cases/view/30104) | steps rewritten: a custom range is picked on the calendar inside the picker (no "Custom" item exists) | Re-read the same surface on the settled build and confirm the adopted wording still matches | **PENDING** |
| `SBR-DATE-02` | [C30202](https://shopview.testrail.io/index.php?/cases/view/30202) | same steps fix | Re-read the same surface on the settled build and confirm the adopted wording still matches | **PENDING** |
| `SBR-WO-04` | [C30313](https://shopview.testrail.io/index.php?/cases/view/30313) | Standing Rule 24 tester note added — the back end still accepts the sales-rep change | Re-read the same surface on the settled build and confirm the adopted wording still matches | **PENDING** |
| `PV-ROW-06` | [C30346](https://shopview.testrail.io/index.php?/cases/view/30346) | header label "Turns / Yr" -> "Turns/Yr" | Re-read the same surface on the settled build and confirm the adopted wording still matches | **PENDING** |
| `PV-COL-01` | [C30351](https://shopview.testrail.io/index.php?/cases/view/30351) | same label | Re-read the same surface on the settled build and confirm the adopted wording still matches | **PENDING** |
| `PV-COL-03` | [C30353](https://shopview.testrail.io/index.php?/cases/view/30353) | same label | Re-read the same surface on the settled build and confirm the adopted wording still matches | **PENDING** |
| `PV-VIS-02` | [C30386](https://shopview.testrail.io/index.php?/cases/view/30386) | made layman-runnable: no devtools, no pixel measurement | Re-read the same surface on the settled build and confirm the adopted wording still matches | **PENDING** |
| `TU-TECH-01` | [C30423](https://shopview.testrail.io/index.php?/cases/view/30423) | filter label "Filter by Technician" -> "Technician" | Re-read the same surface on the settled build and confirm the adopted wording still matches | **PENDING** |
| `TU-TECH-03` | [C30425](https://shopview.testrail.io/index.php?/cases/view/30425) | "Select all" -> "All technicians" (no Select all control exists) | Re-read the same surface on the settled build and confirm the adopted wording still matches | **PENDING** |
| `TU-LOC-01` | [C30442](https://shopview.testrail.io/index.php?/cases/view/30442) | "All Locations" -> "All locations" + "Clear all"; the Rule-42 hedge replaced with the observed Location column and "Multiple" | Re-read the same surface on the settled build and confirm the adopted wording still matches | **PENDING** |
| `WIP-TAB-02` | [C30452](https://shopview.testrail.io/index.php?/cases/view/30452) | tab labels title-cased and each shown with its count | Re-read the same surface on the settled build and confirm the adopted wording still matches | **PENDING** |
| `WIP-SCOPE-02` | [C30457](https://shopview.testrail.io/index.php?/cases/view/30457) | the Declined status dropped — the build has no such status | Re-read the same surface on the settled build and confirm the adopted wording still matches | **PENDING** |
| `WIP-COL-01` | [C30466](https://shopview.testrail.io/index.php?/cases/view/30466) | precondition: Location is a column-selector toggle, not automatic | Re-read the same surface on the settled build and confirm the adopted wording still matches | **PENDING** |
| `WIP-COL-02` | [C30467](https://shopview.testrail.io/index.php?/cases/view/30467) | Location IS in the column selector, off by default (also resolved an internal contradiction with C30466/C30507) | Re-read the same surface on the settled build and confirm the adopted wording still matches | **PENDING** |
| `WIP-COL-04` | [C30469](https://shopview.testrail.io/index.php?/cases/view/30469) | status label "In Progress" -> "In progress" | Re-read the same surface on the settled build and confirm the adopted wording still matches | **PENDING** |
| `WIP-TOT-02` | [C30495](https://shopview.testrail.io/index.php?/cases/view/30495) | tester note — the Inv. Hrs total cannot be checked in a download on this build | Re-read the same surface on the settled build and confirm the adopted wording still matches | **PENDING** |
| `WIP-FLT-05` | [C30502](https://shopview.testrail.io/index.php?/cases/view/30502) | steps made executable + the build's refusal message quoted; the 366-vs-367 cap deliberately not asserted | Re-read the same surface on the settled build and confirm the adopted wording still matches | **PENDING** |
| `WIP-EXP-02` | [C30511](https://shopview.testrail.io/index.php?/cases/view/30511) | the Location mechanism corrected + the Inv. Hrs export refusal noted | Re-read the same surface on the settled build and confirm the adopted wording still matches | **PENDING** |
| `IV-NAV-05` | [C30538](https://shopview.testrail.io/index.php?/cases/view/30538) | steps made executable — no pagination control exists; S1-R8 KEPT | Re-read the same surface on the settled build and confirm the adopted wording still matches | **PENDING** |
| `IV-COL-01` | [C30551](https://shopview.testrail.io/index.php?/cases/view/30551) | "Qty on Hand" -> "Qty" + the Location mechanism | Re-read the same surface on the settled build and confirm the adopted wording still matches | **PENDING** |
| `IV-COL-02` | [C30552](https://shopview.testrail.io/index.php?/cases/view/30552) | "Qty on Hand" -> "Qty" | Re-read the same surface on the settled build and confirm the adopted wording still matches | **PENDING** |
| `IV-COL-04` | [C30554](https://shopview.testrail.io/index.php?/cases/view/30554) | the Location mechanism only (items 1-2 held as a build defect) | Re-read the same surface on the settled build and confirm the adopted wording still matches | **PENDING** |
| `IV-COL-05` | [C30555](https://shopview.testrail.io/index.php?/cases/view/30555) | tester note — no part exists without a category on this build | Re-read the same surface on the settled build and confirm the adopted wording still matches | **PENDING** |
| `IV-TOT-01` | [C30556](https://shopview.testrail.io/index.php?/cases/view/30556) | totals label "Total" -> "Totals" | Re-read the same surface on the settled build and confirm the adopted wording still matches | **PENDING** |
| `IV-TOT-02` | [C30557](https://shopview.testrail.io/index.php?/cases/view/30557) | the server sums unrounded values, so a hand sum can differ by a few cents; also "Qty on Hand" -> "Qty" | Re-read the same surface on the settled build and confirm the adopted wording still matches | **PENDING** |
| `IV-TOT-02` | [C30557](https://shopview.testrail.io/index.php?/cases/view/30557) | the server sums unrounded values, so a hand sum can differ by a few cents; also "Qty on Hand" -> "Qty" | Re-read the same surface on the settled build and confirm the adopted wording still matches | **PENDING** |
| `IV-DATE-06` | [C30566](https://shopview.testrail.io/index.php?/cases/view/30566) | steps: dates are picked on the inline calendar | Re-read the same surface on the settled build and confirm the adopted wording still matches | **PENDING** |
| `IV-FLT-02` | [C30570](https://shopview.testrail.io/index.php?/cases/view/30570) | steps made executable (scrolling, not pages) | Re-read the same surface on the settled build and confirm the adopted wording still matches | **PENDING** |
| `IV-PERS-02` | [C30580](https://shopview.testrail.io/index.php?/cases/view/30580) | "Qty on Hand" -> "Qty" + the Location mechanism | Re-read the same surface on the settled build and confirm the adopted wording still matches | **PENDING** |
| `IV-SORT-03` | [C30585](https://shopview.testrail.io/index.php?/cases/view/30585) | "Qty on Hand" -> "Qty" (found by the Rule-28 sweep, in no batch list) | Re-read the same surface on the settled build and confirm the adopted wording still matches | **PENDING** |
| `IV-EXP-02` | [C30588](https://shopview.testrail.io/index.php?/cases/view/30588) | the Location mechanism only (item 1 held as a build defect) | Re-read the same surface on the settled build and confirm the adopted wording still matches | **PENDING** |
| `IV-EXP-04` | [C30590](https://shopview.testrail.io/index.php?/cases/view/30590) | tester note — the PDF and the CSV phrase the as-of line differently | Re-read the same surface on the settled build and confirm the adopted wording still matches | **PENDING** |
| `IV-EXP-07` | [C30593](https://shopview.testrail.io/index.php?/cases/view/30593) | tester note — the cap is unreachable on this estate | Re-read the same surface on the settled build and confirm the adopted wording still matches | **PENDING** |
| `IV-EXP-09` | [C30595](https://shopview.testrail.io/index.php?/cases/view/30595) | tester note — a large PDF fails with a plain error after ~30 s | Re-read the same surface on the settled build and confirm the adopted wording still matches | **PENDING** |
| `WIP-FLT-09` | [C38916](https://shopview.testrail.io/index.php?/cases/view/38916) | the Location mechanism corrected | Re-read the same surface on the settled build and confirm the adopted wording still matches | **PENDING** |
| `IV-LOC-06` | [C38917](https://shopview.testrail.io/index.php?/cases/view/38917) | the Location mechanism corrected (added by the Rule-28 sweep) | Re-read the same surface on the settled build and confirm the adopted wording still matches | **PENDING** |
| `WIP-EXP-10` | [C38918](https://shopview.testrail.io/index.php?/cases/view/38918) | tester note — the cap is unreachable on this estate | Re-read the same surface on the settled build and confirm the adopted wording still matches | **PENDING** |
| `SBC-API-06` | [C43546](https://shopview.testrail.io/index.php?/cases/view/43546) | NEW case authored from this build's behaviour | Re-drive it end to end; if the behaviour it describes is fixed, the case becomes a regression guard | **PENDING** |
| `PV-EXP-12` | [C43547](https://shopview.testrail.io/index.php?/cases/view/43547) | NEW case authored from this build's behaviour | Re-drive it end to end; if the behaviour it describes is fixed, the case becomes a regression guard | **PENDING** |
| `IV-EXP-10` | [C43548](https://shopview.testrail.io/index.php?/cases/view/43548) | NEW case authored from this build's behaviour | Re-drive it end to end; if the behaviour it describes is fixed, the case becomes a regression guard | **PENDING** |


<!-- AUDIT-COMPLETION-BLOCK-START -->

### COMPLETION BLOCK — the remaining cases, added 2026-08-04 by the exhaustive audit

The hand-written rows above cover **341** of the **478** active cases. Standing Rule 49 requires
EVERY case observed on this non-final build to carry a re-check obligation, so the remaining
**137** are listed here with the obligation recorded per case in the three batch
`verdicts.csv` files. Together the queue now represents **all
478** active cases. **The queue stays OPEN.**

| Case | C-id | Status now | What to re-confirm | Re-check outcome |
|---|---|---|---|---|
| `SBC-API-01` | [C30190](https://shopview.testrail.io/index.php?/cases/view/30190) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-API-02` | [C30191](https://shopview.testrail.io/index.php?/cases/view/30191) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-API-03` | [C30192](https://shopview.testrail.io/index.php?/cases/view/30192) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-API-04` | [C30193](https://shopview.testrail.io/index.php?/cases/view/30193) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-CALC-01` | [C30149](https://shopview.testrail.io/index.php?/cases/view/30149) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-CALC-02` | [C30150](https://shopview.testrail.io/index.php?/cases/view/30150) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-CALC-04` | [C30152](https://shopview.testrail.io/index.php?/cases/view/30152) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-CALC-05` | [C30153](https://shopview.testrail.io/index.php?/cases/view/30153) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-CALC-06` | [C30154](https://shopview.testrail.io/index.php?/cases/view/30154) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-CALC-07` | [C30155](https://shopview.testrail.io/index.php?/cases/view/30155) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-CUST-01` | [C30112](https://shopview.testrail.io/index.php?/cases/view/30112) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-CUST-02` | [C30113](https://shopview.testrail.io/index.php?/cases/view/30113) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-CUST-03` | [C30114](https://shopview.testrail.io/index.php?/cases/view/30114) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-CUST-04` | [C30115](https://shopview.testrail.io/index.php?/cases/view/30115) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-CUST-05` | [C30116](https://shopview.testrail.io/index.php?/cases/view/30116) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-CUST-06` | [C30117](https://shopview.testrail.io/index.php?/cases/view/30117) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-CUST-09` | [C30120](https://shopview.testrail.io/index.php?/cases/view/30120) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-EMPTY-04` | [C30184](https://shopview.testrail.io/index.php?/cases/view/30184) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-EXP-02` | [C30160](https://shopview.testrail.io/index.php?/cases/view/30160) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-EXP-04` | [C30162](https://shopview.testrail.io/index.php?/cases/view/30162) | DEVIATION | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-EXP-05` | [C30163](https://shopview.testrail.io/index.php?/cases/view/30163) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-EXP-06` | [C30164](https://shopview.testrail.io/index.php?/cases/view/30164) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-EXP-08` | [C30166](https://shopview.testrail.io/index.php?/cases/view/30166) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-EXP-10` | [C30168](https://shopview.testrail.io/index.php?/cases/view/30168) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-EXP-11` | [C30169](https://shopview.testrail.io/index.php?/cases/view/30169) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-EXP-16` | [C38856](https://shopview.testrail.io/index.php?/cases/view/38856) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-LINK-01` | [C30138](https://shopview.testrail.io/index.php?/cases/view/30138) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-LINK-02` | [C30139](https://shopview.testrail.io/index.php?/cases/view/30139) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-LINK-03` | [C30140](https://shopview.testrail.io/index.php?/cases/view/30140) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-LINK-04` | [C30141](https://shopview.testrail.io/index.php?/cases/view/30141) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-LOC-01` | [C30109](https://shopview.testrail.io/index.php?/cases/view/30109) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-LOC-03` | [C30111](https://shopview.testrail.io/index.php?/cases/view/30111) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-MOB-01` | [C30188](https://shopview.testrail.io/index.php?/cases/view/30188) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-MOB-02` | [C30189](https://shopview.testrail.io/index.php?/cases/view/30189) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-PERM-02` | [C30099](https://shopview.testrail.io/index.php?/cases/view/30099) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-PERM-03` | [C30100](https://shopview.testrail.io/index.php?/cases/view/30100) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-PERM-04` | [C30101](https://shopview.testrail.io/index.php?/cases/view/30101) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-PERM-05` | [C39447](https://shopview.testrail.io/index.php?/cases/view/39447) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-PERS-01` | [C30174](https://shopview.testrail.io/index.php?/cases/view/30174) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-PERS-02` | [C30175](https://shopview.testrail.io/index.php?/cases/view/30175) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-PERS-03` | [C30176](https://shopview.testrail.io/index.php?/cases/view/30176) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-PERS-04` | [C30177](https://shopview.testrail.io/index.php?/cases/view/30177) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-PERS-05` | [C30178](https://shopview.testrail.io/index.php?/cases/view/30178) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-PERS-07` | [C30180](https://shopview.testrail.io/index.php?/cases/view/30180) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-SORT-01` | [C30142](https://shopview.testrail.io/index.php?/cases/view/30142) | DEVIATION | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-SORT-02` | [C30143](https://shopview.testrail.io/index.php?/cases/view/30143) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-SORT-03` | [C30144](https://shopview.testrail.io/index.php?/cases/view/30144) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-SORT-04` | [C30145](https://shopview.testrail.io/index.php?/cases/view/30145) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-TREE-01` | [C30121](https://shopview.testrail.io/index.php?/cases/view/30121) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-TREE-02` | [C30122](https://shopview.testrail.io/index.php?/cases/view/30122) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-TREE-03` | [C30123](https://shopview.testrail.io/index.php?/cases/view/30123) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-TREE-04` | [C30124](https://shopview.testrail.io/index.php?/cases/view/30124) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-TREE-05` | [C30125](https://shopview.testrail.io/index.php?/cases/view/30125) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-TREE-08` | [C30128](https://shopview.testrail.io/index.php?/cases/view/30128) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-TREE-09` | [C30129](https://shopview.testrail.io/index.php?/cases/view/30129) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-TREE-10` | [C30130](https://shopview.testrail.io/index.php?/cases/view/30130) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-TREE-12` | [C30132](https://shopview.testrail.io/index.php?/cases/view/30132) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-TREE-13` | [C30133](https://shopview.testrail.io/index.php?/cases/view/30133) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-TYPE-02` | [C30107](https://shopview.testrail.io/index.php?/cases/view/30107) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-VIS-01` | [C30185](https://shopview.testrail.io/index.php?/cases/view/30185) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-VIS-02` | [C30186](https://shopview.testrail.io/index.php?/cases/view/30186) | DEVIATION | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBC-VIS-03` | [C30187](https://shopview.testrail.io/index.php?/cases/view/30187) | DEVIATION | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-API-01` | [C30316](https://shopview.testrail.io/index.php?/cases/view/30316) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-API-02` | [C30317](https://shopview.testrail.io/index.php?/cases/view/30317) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-API-03` | [C30318](https://shopview.testrail.io/index.php?/cases/view/30318) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-API-04` | [C30319](https://shopview.testrail.io/index.php?/cases/view/30319) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-ASGN-02` | [C30293](https://shopview.testrail.io/index.php?/cases/view/30293) | NOT-BUILT | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-ASGN-03` | [C30294](https://shopview.testrail.io/index.php?/cases/view/30294) | NOT-BUILT | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-ASGN-04` | [C30295](https://shopview.testrail.io/index.php?/cases/view/30295) | NOT-BUILT | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-ASGN-05` | [C30296](https://shopview.testrail.io/index.php?/cases/view/30296) | NOT-BUILT | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-ASGN-06` | [C30297](https://shopview.testrail.io/index.php?/cases/view/30297) | NOT-BUILT | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-BADGE-01` | [C30226](https://shopview.testrail.io/index.php?/cases/view/30226) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-BADGE-02` | [C30227](https://shopview.testrail.io/index.php?/cases/view/30227) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-CALC-05` | [C30233](https://shopview.testrail.io/index.php?/cases/view/30233) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-CALC-06` | [C30234](https://shopview.testrail.io/index.php?/cases/view/30234) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-CALC-08` | [C30236](https://shopview.testrail.io/index.php?/cases/view/30236) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-COL-03` | [C30267](https://shopview.testrail.io/index.php?/cases/view/30267) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-COL-04` | [C30268](https://shopview.testrail.io/index.php?/cases/view/30268) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-COL-05` | [C30269](https://shopview.testrail.io/index.php?/cases/view/30269) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-DATE-01` | [C30201](https://shopview.testrail.io/index.php?/cases/view/30201) | DEVIATION | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-DATE-04` | [C30204](https://shopview.testrail.io/index.php?/cases/view/30204) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-EXP-01` | [C30276](https://shopview.testrail.io/index.php?/cases/view/30276) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-EXP-02` | [C30277](https://shopview.testrail.io/index.php?/cases/view/30277) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-EXP-03` | [C30278](https://shopview.testrail.io/index.php?/cases/view/30278) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-EXP-04` | [C30279](https://shopview.testrail.io/index.php?/cases/view/30279) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-EXP-06` | [C30281](https://shopview.testrail.io/index.php?/cases/view/30281) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-EXP-12` | [C30287](https://shopview.testrail.io/index.php?/cases/view/30287) | DEVIATION | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-EXP-13` | [C30288](https://shopview.testrail.io/index.php?/cases/view/30288) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-EXP-14` | [C30289](https://shopview.testrail.io/index.php?/cases/view/30289) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-LINK-01` | [C30247](https://shopview.testrail.io/index.php?/cases/view/30247) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-LINK-03` | [C30249](https://shopview.testrail.io/index.php?/cases/view/30249) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-LINK-04` | [C30250](https://shopview.testrail.io/index.php?/cases/view/30250) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-LINK-05` | [C30251](https://shopview.testrail.io/index.php?/cases/view/30251) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-LOC-01` | [C30213](https://shopview.testrail.io/index.php?/cases/view/30213) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-LOC-03` | [C30215](https://shopview.testrail.io/index.php?/cases/view/30215) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-LOC-05` | [C38913](https://shopview.testrail.io/index.php?/cases/view/38913) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-MOB-01` | [C30302](https://shopview.testrail.io/index.php?/cases/view/30302) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-MOB-02` | [C30303](https://shopview.testrail.io/index.php?/cases/view/30303) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-NAV-01` | [C30195](https://shopview.testrail.io/index.php?/cases/view/30195) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-NAV-03` | [C30197](https://shopview.testrail.io/index.php?/cases/view/30197) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-PERM-01` | [C30198](https://shopview.testrail.io/index.php?/cases/view/30198) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-PERM-02` | [C30199](https://shopview.testrail.io/index.php?/cases/view/30199) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-PERM-03` | [C30200](https://shopview.testrail.io/index.php?/cases/view/30200) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-PERS-01` | [C30271](https://shopview.testrail.io/index.php?/cases/view/30271) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-PERS-02` | [C30272](https://shopview.testrail.io/index.php?/cases/view/30272) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-PERS-03` | [C30273](https://shopview.testrail.io/index.php?/cases/view/30273) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-PERS-04` | [C30274](https://shopview.testrail.io/index.php?/cases/view/30274) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-PERS-05` | [C30275](https://shopview.testrail.io/index.php?/cases/view/30275) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-ROW-01` | [C30217](https://shopview.testrail.io/index.php?/cases/view/30217) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-ROW-02` | [C30218](https://shopview.testrail.io/index.php?/cases/view/30218) | DEVIATION | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-SORT-01` | [C30241](https://shopview.testrail.io/index.php?/cases/view/30241) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-SORT-02` | [C30242](https://shopview.testrail.io/index.php?/cases/view/30242) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-SORT-03` | [C30243](https://shopview.testrail.io/index.php?/cases/view/30243) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-SORT-04` | [C30244](https://shopview.testrail.io/index.php?/cases/view/30244) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-SORT-05` | [C30245](https://shopview.testrail.io/index.php?/cases/view/30245) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-STAT-01` | [C30208](https://shopview.testrail.io/index.php?/cases/view/30208) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-STAT-02` | [C30209](https://shopview.testrail.io/index.php?/cases/view/30209) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-STAT-04` | [C30211](https://shopview.testrail.io/index.php?/cases/view/30211) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-STAT-05` | [C30212](https://shopview.testrail.io/index.php?/cases/view/30212) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-STATE-03` | [C30300](https://shopview.testrail.io/index.php?/cases/view/30300) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-TOT-01` | [C30237](https://shopview.testrail.io/index.php?/cases/view/30237) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-TOT-02` | [C30238](https://shopview.testrail.io/index.php?/cases/view/30238) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-TREE-05` | [C30221](https://shopview.testrail.io/index.php?/cases/view/30221) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-TREE-06` | [C30222](https://shopview.testrail.io/index.php?/cases/view/30222) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-TREE-07` | [C30223](https://shopview.testrail.io/index.php?/cases/view/30223) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-TREE-08` | [C30224](https://shopview.testrail.io/index.php?/cases/view/30224) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-TREE-09` | [C30225](https://shopview.testrail.io/index.php?/cases/view/30225) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-TYPE-02` | [C30206](https://shopview.testrail.io/index.php?/cases/view/30206) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-UNAS-01` | [C30261](https://shopview.testrail.io/index.php?/cases/view/30261) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-UNAS-02` | [C30262](https://shopview.testrail.io/index.php?/cases/view/30262) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-UNAS-04` | [C30264](https://shopview.testrail.io/index.php?/cases/view/30264) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-VIS-01` | [C30305](https://shopview.testrail.io/index.php?/cases/view/30305) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-VIS-02` | [C30306](https://shopview.testrail.io/index.php?/cases/view/30306) | DEVIATION | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-VIS-03` | [C30307](https://shopview.testrail.io/index.php?/cases/view/30307) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-VIS-04` | [C30308](https://shopview.testrail.io/index.php?/cases/view/30308) | DEVIATION | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-WO-02` | [C30311](https://shopview.testrail.io/index.php?/cases/view/30311) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |
| `SBR-WO-03` | [C30312](https://shopview.testrail.io/index.php?/cases/view/30312) | VIU-Observed-PASS | Re-observe against the next build; this verdict is PROVISIONAL against v3.4.1-0ed4433 observed 2026-08-04 (Rule 49). | **PENDING** |

<!-- AUDIT-COMPLETION-BLOCK-END -->

<!-- RECHECK-ROWS-END -->

## SUMMARY OF THIS QUEUE

**35 rows in the original table + 394 merged batch/push rows = 429 rows · 0 re-checked · ALL PENDING.** Covering **86 CORRECT AS IS**, **13 DEVIATION**,
**9 EDIT NEEDED / REFUTED**, **4 candidate gaps** and **2 honest NOT-VERIFIED** items.

**Highest-churn rows to re-check first when the build moves:** **B18** (the single-location Location
filter — the riskiest open question), **B7** (nav grouping), **B16/B17** (the SBR export headers),
**B28** (the PDF 500s), **B6** (the VIN chain), **B5** (the exportable-column list).

---

# QUEUE COVERAGE RECONCILIATION — 2026-08-04 (Step 6)

**Checked programmatically against the live suite, not by eye.** The queue names **477** distinct
C-ids; live ours is **469**.

## The 9 the queue names that NO LONGER EXIST — closed by deletion, not by re-check

These were absorbed by the QA-lead-authorised merges/cut on 2026-08-04 **after their content was
folded into their survivors**, so their re-check obligation transfers to the survivor named beside
each. Evidence: `../count-reconciliation-2026-08-04.md`.

| Deleted | Its obligation now belongs to |
|---|---|
| C30182 | SBC-EMPTY-01 = [C30181](https://shopview.testrail.io/index.php?/cases/view/30181) |
| C30350 | PV-CALC-06 = [C30364](https://shopview.testrail.io/index.php?/cases/view/30364) |
| C30445 | TU-LOC-03 = [C30444](https://shopview.testrail.io/index.php?/cases/view/30444) |
| C30453 | WIP-TAB-02 = [C30452](https://shopview.testrail.io/index.php?/cases/view/30452) |
| C30529 | WIP-API-01 = [C30528](https://shopview.testrail.io/index.php?/cases/view/30528) |
| C30532 | WIP-API-03 = [C30530](https://shopview.testrail.io/index.php?/cases/view/30530) |
| C30544 | IV-SCOPE-01 = [C30540](https://shopview.testrail.io/index.php?/cases/view/30540) |
| C30586 | IV-TOT-01 = [C30556](https://shopview.testrail.io/index.php?/cases/view/30556) |
| C30608 | IV-API-03 = [C30607](https://shopview.testrail.io/index.php?/cases/view/30607) |

## The 1 live case the queue had NEVER named — now added

**SBC-PERM-06 = [C30098](https://shopview.testrail.io/index.php?/cases/view/30098)** — *"Ordinary
reports access opens Sales By Customer — no separate permission"*. **This was a real coverage hole in
the queue**, found by set-differencing the queue's C-ids against the live suite rather than trusting
the count. Its re-check obligation is the same as every other case's: re-confirm the observation
against the settled build, and **re-stamp its provenance line** (Rule 54).

## Coverage now

**469 live cases, 469 named in this queue, 0 unaccounted for — set-equal both directions.**
The queue **stays OPEN**, and is now open for two independent reasons: engineering has not withdrawn
the not-final declaration, **and** the build has moved to `v3.4.1-3d03023`.
