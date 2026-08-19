# DEFERRED-RUN — Sales By Customer cases not build-verifiable (feature absent)

**Build under test:** v3.8-2bf8d14 (2026-08-18).

## EMPTY — 0 Sales By Customer cases deferred.

The Sales By Customer report and ALL of its features are PRESENT on v3.8-2bf8d14 (report surface,
nav entry, date/product-type/location/customer filters, customer/asset/invoice tree, all financial
columns, sorting, the 10-column selector, all four exports, pagination, and the API). Every one of the
19 cases that previously carried "AUTOMATION: Not available on Build to test Yet" was live-verified this
pass and lifted to READY. No SBC case tests a feature that is absent from the build, so none goes to a
separate deferred build-verification run.

The 10 HOLD cases (listed in SBC-EXECUTION.md / FINDINGS.md 7) are NOT deferred for a missing feature -
they are blocked on data-state (seedable later), a destructive action, an un-forceable server error, or
an open PO question. They stay in the main run with their HOLD markers.

---

# Sales By Representative (SBR) — 2026-08-18, build v3.8-bd246fd

## 0 SBR cases deferred for an absent feature.

The Sales By Representative report and ALL of its features are PRESENT on v3.8-bd246fd (nav entry,
date/product-type/invoice-status/location filters, Show Unassigned toggle, rep/invoice tree with
expand-on-demand, all financial columns, payment-status badges, sorting, the 8-column selector, all
four exports, and the API). Every one of the 17 non-Automated cases that carried "AUTOMATION: Not
available on Build to test Yet" was live-verified this pass and lifted to READY. **No SBR case tests a
feature absent from the build.**

**One case keeps the deferred marker — but NOT for feature-absence:** C30221 (SBR-TREE-05,
expand-on-demand) is **Automated (custom_atmstatus = 3)**, so under Rule 71 it is HELD ask-first and
was not written. Its feature IS present (verified live); the intended lift to READY is recorded in
`SBR-HELD-AUTOMATED.md` for the QA lead's ratification. It does NOT go to a separate deferred
build-verification run.

---

# Parts Velocity (PV) — 2026-08-18, build v3.8-bd246fd

## 0 PV cases deferred for an absent feature.

The Parts Velocity report and ALL of its features are PRESENT on v3.8-bd246fd (nav under the new PARTS
group, This-Year default with auto-fetch, Type/Category/Vendor/Bin/Location filters + toolbar search,
inventory/special-order row model, all 20 picker columns, the full calc column set, sorting headers,
header info tooltips, the CSV export, and the API). Every one of the 9 non-Automated cases that carried
"AUTOMATION: Not available on Build to test Yet" was live-verified this pass and lifted to READY. **No PV
case tests a feature absent from the build.**

**Two cases keep the deferred marker — but NOT for feature-absence:** C30346 (PV-ROW-06, header info
icons) and C30353 (PV-COL-03, immediate column toggle) are **Automated (custom_atmstatus = 3)**, so under
Rule 71 they are HELD ask-first and were not written. Their features ARE present (verified live); the
intended lift to READY is recorded in `PV-HELD-AUTOMATED.md` for the QA lead's ratification. They do NOT
go to a separate deferred build-verification run.

**Note — a feature that is PRESENT but BROKEN, not absent:** the Parts Velocity **PDF export fails
(HTTP 500/502)** on a medium view (SV-8818, OPEN). That is a defect in a built feature, not an absent
feature, so its cases (C38885/C43547 kept EXPECT-FAIL; PDF-content cases C30379/C30381/C43834) are NOT
deferred here — see PV-FINDINGS §F5.

---

# Technician Utilization (TU) — 2026-08-18, build v3.8-bd246fd

## 4 TU cases deferred — the Total Hours LINK feature is NOT in the build.

The Technician Utilization report and nearly all of its features ARE present on v3.8-bd246fd (see
TU-EXECUTION.md). **ONE feature is not found in the build: the Total Hours link** (a real link on the
Total Hours cell that opens Timesheet Activities). The Total Hours cell carries no link/button/`role=link`
in any location scope tested — All locations and the single active shop (TU-FINDINGS §F7). The four cases
that test that link therefore could not be build-verified and stay deferred (`Not available on Build to
test Yet - Last checked 8/18/2026`, under-development line added). They are re-checked once the Total
Hours link ships (the trigger is the feature shipping, not a redeploy — Rule 49/61).

| internal | C-id | link | feature it waits on | last checked | build |
|---|---|---|---|---|---|
| TU-LINK-01 | C30428 | https://shopview.testrail.io/index.php?/cases/view/30428 | Total Hours as a real link (active-shop default view) | 8/18/2026 | v3.8-bd246fd |
| TU-LINK-03 | C30430 | https://shopview.testrail.io/index.php?/cases/view/30430 | Total Hours link ↔ Timesheet reconciliation | 8/18/2026 | v3.8-bd246fd |
| TU-LINK-05 | C30432 | https://shopview.testrail.io/index.php?/cases/view/30432 | reconciliation exception (b) — link passes no location | 8/18/2026 | v3.8-bd246fd |
| TU-LINK-06 | C30433 | https://shopview.testrail.io/index.php?/cases/view/30433 | day-row Total Hours link → single-day timesheet | 8/18/2026 | v3.8-bd246fd |

**Note — C30430 (TU-LINK-03)** previously carried `EXPECT FAIL (SV-8944)`. SV-8944 is OBSOLETE/Done (no
live backing), so the stale expect-fail was stripped; because the case's feature (the link) is absent, it
was set to the deferred marker rather than plain READY.

**NOT deferred, but LINK-related:** TU-LINK-02 (C30429) is **Automated** — HELD (TU-HELD-AUTOMATED.md),
its READY marker flagged for review since the link is absent; TU-LINK-04 (C30431) stays HOLD (needs an
open clock, and the link is absent anyway).

**Feature that is PRESENT but has open defects, NOT deferred:** the exports (Summary row omitted from
PDF/CSV, Expanded CSV holds per-day rows, wrong toast wording, Location column 2nd not leftmost) are
built-but-deviating — see TU-FINDINGS §F3/§F4/§F8/§F9; their cases were stripped to READY, not deferred.

---

# WIP (report 5 of 6) — 24 deferred cases: feature-presence now known via API; markers NOT changed (0 writes)

**Build-verify pass 2026-08-18 (RESUMED), build `v3.8-bd246fd`. The session recovered; the authenticated
report API was build-verified, but the SPA UI could not be driven (no `quick-login` — WIP-EXECUTION
§Access).** So the **feature-presence** question is now answered for the Adjustments cluster via the
API, but the **on-screen render** was not observed, and **no marker was changed** (0 TestRail writes).
The 24 stay deferred at their existing **`Last checked 8/17/2026`** date — **deliberately NOT bumped to
8/18** (bumping would claim an on-screen build check that did not happen, Rule 12).

**🔑 KEY UPDATE (API, WIP-FINDINGS §F4): the Adjustments column IS BUILT** — `adjustments` returns on
every row, in totals and in summary, with real signed values. So the **8 WIP-ADJ cases + the 2
ADJ-dependent SUM/TOT cases (C43818/C43819) are NO LONGER feature-absent** — on a UI-capable pass they
**LIFT to `AUTOMATION: READY`** once the column is confirmed to render on screen. The **line-state
SCOPE/PLACE cases stay deferred** — placement is NOT_ESTABLISHED (§F6) and needs a seeded multi-state WO
+ the UI. **Trigger to lift (Rule 49/61): the on-screen confirmation on a UI-capable pass, NOT a redeploy.**

| internal | C-id | area | waits on (feature) |
|---|---|---|---|
| WIP-SCOPE-01 | C30456 | Scope | line-state scope loading |
| WIP-SCOPE-02 | C30457 | Scope | open-only scope |
| WIP-SCOPE-03 | C30458 | Scope | line-state every-matching-tab |
| WIP-SCOPE-04 | C30459 | Scope | scope |
| WIP-PLACE-03 | C30464 | Placement | Approved started-boundary (line-state) |
| WIP-PLACE-05 | C43979 | Placement | per-tab money slice (line-state) |
| WIP-COL-05 | C30470 | Columns | column |
| WIP-ADJ-01 | C43814 | Columns | **Adjustments column** |
| WIP-CALC-06 | C30479 | Earned&Rem | calc |
| WIP-ADJ-02 | C43815 | Earned&Rem | **Adjustments** |
| WIP-ADJ-03 | C43816 | Earned&Rem | **Adjustments** |
| WIP-ADJ-04 | C43817 | Earned&Rem | **Adjustments** |
| WIP-ADJ-08 | C43821 | Earned&Rem | **Adjustments** |
| WIP-SUM-07 | C30493 | Summary | Estimates tooltip (Q1=A confirmation) |
| WIP-ADJ-05 | C43818 | Summary | **Adjustments** summary figure |
| WIP-TOT-02 | C30495 | Totals | totals row |
| WIP-ADJ-06 | C43819 | Totals | **Adjustments** totals |
| WIP-FLT-04 | C30501 | Filters | filter |
| WIP-FLT-05 | C30502 | Filters | filter |
| WIP-PERS-02 | C30507 | Persistence | column persistence |
| WIP-EXP-11 | C43836 | Exports | export header lines |
| WIP-VIS-07 | C30525 | Visual | visual |
| WIP-VIS-08 | C43838 | Visual | visual treatment |
| WIP-ADJ-07 | C43820 | API | **Adjustments** (API) |

**Trigger to re-check (Rule 49/61):** the feature shipping / becoming observable — NOT a redeploy alone.
Re-check on the next live WIP build-verify run once staging access is restored.

---

# ⚠️ CORRECTION — 2026-08-18 (UI-COMPLETED PASS): NONE OF THESE 24 REMAIN DEFERRED

The list above was written by the earlier API-only attempt, which believed the SPA UI could not be driven
without `quick-login`. **That was wrong.** The resumed UI-completed pass drove the WIP report live on
`v3.8-bd246fd` (boot2 direct-cookie recipe, no `quick-login`) and found **every one of these 24
non-Automated features PRESENT and runnable** — most decisively the **Adjustments column cluster**
(WIP-ADJ-01..08), which is built on screen, in the API and in the CSV export.

**ALL 24 non-Automated cases above were LIFTED to `AUTOMATION: READY`** (byte-verified writes, see
`wip-write-oplog.jsonl`). **The `Not available on Build to test Yet` marker no longer sits on any
non-Automated WIP case.**

**What still carries a deferred/held marker (NOT written — Automated, Rule 71):** the 4 Automated cases
C30460 (WIP-SCOPE-05), C30462 (WIP-PLACE-01), C30508 (WIP-PERS-03), C30518 (WIP-EXP-09) — their intended
LIFT is recorded in `WIP-HELD-AUTOMATED.md` for ask-first ratification.

**Honest caveat (§C of WIP-FINDINGS):** C30458 (SCOPE-03) and C43979 (PLACE-05) were lifted to READY, but
the specific multi-tab appearance of a WO with lines in >1 state was **not directly observed** (no such WO
in current data). The feature is present and runnable by a tester who seeds it. **So there is effectively
NO WIP deferred-run backlog remaining among non-Automated cases** — only the 4 held Automated lifts and
the two multi-tab confirmations.

---

# INVENTORY VALUE (report 6 of 6) — 2026-08-18, build `v3.8-bd246fd`

**NO Inventory Value case remains on a `Not available on Build to test Yet` (deferred) marker among
non-Automated cases.** The IV report was driven live (boot2 direct-cookie recipe, no `quick-login`) and
**every one of the 4 non-Automated deferred cases was found PRESENT and runnable, so all 4 were LIFTED to
`AUTOMATION: READY`** (byte-verified writes, see `iv-write-oplog.jsonl`):

| C-id | internal | feature (all present live) |
|---|---|---|
| C30561 | IV-DATE-01 | single "as of" date control, defaults today, capped at today |
| C30570 | IV-FLT-02 | Category/Vendor/part-search are server-side; each change returns page 1 |
| C30573 | IV-FLT-05 | "as of" date + Location + Category + Vendor + search combine with AND |
| C43837 | IV-EXP-11 | CSV carries the PDF header's "As of:" / "Locations:" metadata lines |

**What still carries a deferred marker (NOT written — Automated, Rule 71):** the 2 Automated IV cases
**C30535 (IV-NAV-02)** and **C30563 (IV-DATE-03)** — their intended LIFT is in `IV-HELD-AUTOMATED.md`
for ask-first ratification.

**There is NO IV "feature not found" deferred-run backlog** — the Inventory Value report is fully built
on `v3.8-bd246fd`. The only re-check owed is the 2 Automated lifts (on approval, coupled with Vlad).

---
## SBC RE-VERIFY SWEEP (2026-08-19, build v3.8-da72171)

**No SBC "feature not found" deferred-run backlog** — the Sales By Customer report is fully built on
`v3.8-da72171`; every in-scope feature area was driven live present.

**Re-checks owed once the TestRail write path is restored** (writes currently HTML-corrupt the markdown
fields — see SBC-SWEEP-EXECUTION.md headline; the re-stamp deliverable could not be applied):
- **Re-stamp (Rule-54 sentence 2 → v3.8-da72171) the 25 verified-PASS manual cases** listed in
  SBC-SWEEP-FINDINGS.md.
- **Demark-repair C30133** (collateral of the write bug — content intact, display `<p>`-wrapped).
- **Drive the 7 not-finished cases:** location-permission negatives **C30101, C43550** (need a
  single-location reports user), and seeds **C30131** (S-invoice no vehicle), **C30132** (reversed/voided
  invoice), **C30137** (duplicate asset labels), **C30141** (deleted-invoice not-found), **C43553**
  (broken-logo fallback).
- **Invoice-link PO question** (C30100, C30138, C30139, C30140, C43558) — trigger = Chris Ward's answer,
  not a redeploy.

---

## RESUME UPDATE 2026-08-19 — deferred set RESOLVED down to genuine dependencies
The interim-`<br>` write pass drove the previously-deferred cases live and cleared most of them:
- **RESOLVED → READY (written):** C30132 (reverse-invoice exclusion, seeded) · C30137 (duplicate-label
  `(#1)/(#2)`, seeded) · C30101 (location-access enforcement, verified via Parts-Manager impersonation) ·
  C43550 (Location never a column-selector toggle; verified structurally + accessible-locations mechanism).
- **STILL DEFERRED / HOLD (genuine dependencies, re-check trigger stated):**
  - **C30131** — no-vehicle service WO is **build-blocked** (`work-orders/create` → HTTP 500). Trigger =
    a build that permits a vehicle-less service WO (may never exist by design).
  - **C43553** — needs the org logo file **orphaned at the storage layer** (dev/infra). Trigger = a
    developer producing that state (case sanctions Blocked).
  - **C43550** — single-location **live LOGIN** not performed (fresh staff unconfirmed; yopmail
    unreadable via proxy). Trigger = a confirmed single-workplace reports login. Verdict already
    READY on structural + mechanism evidence.
  - **C30100/C30139/C30140/C30141/C43558** — invoice-link PO question. Trigger = Chris Ward's answer.
- **Build note:** redeployed mid-pass `v3.8-da72171` → `v3.8-b7d80dc`; all verdicts PROVISIONAL (Rule 60).

---

## SBR RE-VERIFY SWEEP 2026-08-19 — 1 genuinely-absent-feature case deferred (Rule 69)
Build `v3.8-b7d80dc`. The SBR report is fully built; the sweep re-stamped 57 cases and drove the report
live. **One case stays deferred** because its feature is not exercisable on this build/data:
- **C30311 (SBR-WO-02) — HOLD "this part of the report is not built yet".** The WO-sales-rep-assignment
  path needs invoices with an assigned rep; every invoice in this org is Unassigned and no rep-assignment
  surface was located from the report. **Re-check trigger = the WO-rep-assignment UI shipping / a
  rep-assigned invoice existing, NOT a redeploy.** FLAGGED for review (skill-03 G10): confirm truly
  absent vs merely unseeded before leaving it HOLD long-term.

Also carried (kept markers, not deferred): C30290/C30320 (SV-8818 over-cap PDF/API row-cap — state not
reachable at 88 invoices, EXPECT-FAIL kept) and the PO-dependency HOLDs C30310/C30315/C43559
(invoice-link plain-text-vs-link — trigger = Chris Ward's answer).

---

## PV RE-VERIFY SWEEP 2026-08-19 — 0 genuinely-absent features; 1 HOLD + 3 characterized data/integration limits
Build `v3.8-d0e135e`. The Parts Velocity report is **fully built** — 0 "feature-not-found" deferrals.
The sweep re-stamped 36 cases and drove the report live. Cases not driven to their edge state (all
RUNNABLE; characterized, not skipped — Rule 74 §8.5):
- **C30372 (PV-CALC-14) — HOLD "no `is_core=true` part exists".** The org has 0 core parts (the 2
  core-*charge* parts 84-2005/58-12 are `is_core=0` and correctly DO appear); `POST /api/inventory/parts`
  = 405, `/api/catalog/parts` = 404 (no create endpoint found). **Re-check trigger = a seeded core SKU
  with movement, NOT a redeploy.**
- **C38924** — no fractional-unit `units_sold` row in current data. Trigger = a seeded fractional sale
  (WO/parts-sale line with a fractional qty, invoiced). Kept READY (decimal-preservation feature present).
- **C38925** — QuickBooks not confirmably connected (`/api/quickbooks/status` + `/api/integrations/
  quickbooks` = 404). Trigger = a QB-connected org + fractional sale. Kept READY.
- **C30340 (negative branch)** — no single-location user (admin=8 / tech=5 workplaces; switch-user 400).
  Trigger = a user with exactly one accessible location. Positive (filter shown) confirmed; kept READY.

Also carried (kept markers, not deferred): C38885/C43547 (SV-8818 PDF-500 — re-confirmed live, ticket
OPEN "TESTING QA", EXPECT-FAIL kept). PDF-content cases (C30382 + PDF sides of exported-content) blocked
by the SV-8818 PDF-500 build defect — CSV sides verified.
- **Build note:** `v3.8-bd246fd` (8/18) → **`v3.8-d0e135e`** (this pass); byte-stable across the pass;
  all verdicts PROVISIONAL (Rule 60).

## TU RE-VERIFY SWEEP 2026-08-19 — 1 genuinely-absent feature (Total Hours link); characterized limits
Build `v3.8-d0e135e`. The Technician Utilization report is **fully built** EXCEPT the **Total Hours link**
(→ Timesheet Activities), which is **still absent** (Total Hours cells carry no anchor/button, cursor auto,
on every row). Deferred (marker `Not available on Build to test Yet`, date → 8/19/2026; re-check trigger =
the link feature/SV-9064 shipping, NOT a redeploy):
- **C30428 (TU-LINK-01), C30430 (TU-LINK-03), C30432 (TU-LINK-05), C30433 (TU-LINK-06)** — Total Hours link absent.

Cases kept HOLD as characterized limits (RUNNABLE-in-principle, not skipped — Rule 74 §8.5), re-driven live:
- **C30407/C30408/C30413 (TU-ELL-04/05, TU-SORT-05)** — em-dash ELL needs a location with **no** default
  labor rate; 0 em-dash rows across all 8 locations; the rate is a per-location config not settable via any
  endpoint reached. Trigger = a rate-less location + a tech with internal hours there.
- **C30431 (TU-LINK-04)** — blocked by the absent Total Hours link (+ needs an open clock). Marker kept HOLD
  (Rule 69 no-overwrite); reason refreshed. Trigger = the link shipping.
- **C30446 (TU-LOC-05)** — Location filter hidden for a one-location user: **0 of 19 roster staff are
  single-workplace**; switch-user = HTTP 400 here; tech quick-login is a hidden dev user. Positive half
  (filter shown for multi-location users) confirmed live. Trigger = a provisioned one-location test user.
- **C38887 (TU-EXP-09)** — over-cap export refusal: the report is one-row-per-technician (11), so it cannot
  structurally reach the export row cap. Exports verified working at actual size. Trigger = thousands of techs.
- **Build note:** `v3.8-bd246fd` (8/18) → **`v3.8-d0e135e`** (this pass); byte-stable; verdicts PROVISIONAL.

## WIP RE-VERIFY SWEEP 2026-08-19 — 0 genuinely-absent features; 2 deviation-pending-ticket + 5 characterized limits
Build `v3.8-d0e135e`. The Work In Progress report is **fully built** (4 tabs, Adjustments column, Column
Selection, exports) — 0 "feature-not-found" deferrals. 7 HOLD cases re-driven live (RUNNABLE-in-principle,
characterized, not skipped — Rule 74 §8.5):
- **C30467 (WIP-COL-02), C43551 (WIP-PERS-05)** — Location is NOT toggleable in the Column Selection control
  = deviation from the ratified Location rule. HOLD pending a ticket (Jira creation on hold, register H1).
  One edit from EXPECT-FAIL once authorised.
- **C30528/C30530/C30531/C30533** — nightly-capture snapshot rows; snapshot-read endpoints all 404, nothing
  in the product reads the capture back. Trigger = a product surface that reads the snapshot.
- **C38918** — over-cap download: largest tab is Estimates ~1067 rows, no tab nears the export cap. Trigger =
  a tab exceeding the export row cap.
- **Build note:** `v3.8-bd246fd` (8/18) → **`v3.8-d0e135e`** (this pass); byte-stable; verdicts PROVISIONAL.
