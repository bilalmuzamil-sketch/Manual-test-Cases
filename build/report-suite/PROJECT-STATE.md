# Report Suite — PROJECT-STATE (canonical resume doc)

> **READ THIS FIRST to resume the Report Suite project.** Single authoritative
> snapshot: status, per-report spec inventory, deliverables index, open
> questions, env/access facts, ordered how-to-resume.

Last updated: **2026-07-22** (PER-REPORT IMPORT SPLIT DELIVERED — six
per-report CSV/XLSX import files emitted for the user's per-folder import into
the manually-created TestRail group 4281 "Reports Suite" [subsections
4282–4287]; unified import unchanged; awaiting the user's case import →
read-only C-id mapping. Earlier same day: ADVERSARIAL REVIEW DONE — both
auditors CLEAN after fixes; import REGENERATED post-review).

---

## 0. STATUS

**ADVERSARIAL REVIEW DONE 2026-07-22 — both auditors CLEAN after fixes
(SBC/SBR/PV: 3 minor doc/note fixes, b410d29; TU/IV clean; WIP: 2 fixes incl.
one real coverage gap [WIP-TAB-02 no-status-filter expected item + WIP-SORT-03
reword], 82f1665). Independent bullet counts recorded: SBC 235/235 · SBR
230/230 · PV 69/69 · TU ~111 · WIP ~119 · IV ~110 — ALL MAPPED. Suite = 515
cases / 89 sections / 6 reports; import REGENERATED post-review (delta vs
pre-review CSV = exactly the two WIP rows, nothing else; id-map byte-identical;
full gate re-passed: 515==515==515, header 5/5 byte-identical, 0 VIU/flag
words, 0 internal-id leaks, no empty fields, XLSX==CSV, deterministic rerun).
STATUS = READY FOR USER IMPORT — PER-FOLDER WORKFLOW (2026-07-22): the user
MANUALLY CREATED TestRail group **4281 "Reports Suite"** with six EMPTY
per-report subsections — **4282 "Sales By Customer Report" · 4283 "Sales By
Representative Report" · 4284 "Parts Velocity Report" · 4285 "Technician
Utilization — Product Specification" · 4286 "Work In Progress — Product
Specification" · 4287 "Inventory Value — Product Specification"** — and will
import ONE report at a time targeting each folder (the CSV Section column
creates the "XXX — area" leaf sections inside that folder). Six per-report
split files EMITTED for this (see §0.6); folders 4282–4287 confirmed created,
AWAITING CASE IMPORT. The read-only C-id mapping step is staged as the next
resume action — map C-ids into `testrail-id-map.csv` once the cases land →
VIU when env/Epic arrive (ask Chris Ward: TU S8 video inconsistency + IV
export-cap value; Epic key ask-at-VIU; designs pending; specs-will-change →
Rule-11 reconciliation per update).**

- **Case inventory (515 total, per report / sections):** SBC 99 (18 sections) ·
  SBR 127 (23) · PV 70 (9) · TU 59 (12) · WIP 83 (14) · IV 77 (13). Source:
  `cases/*.json` (26 files, uniform schema; `area` = the "XXX — leaf" TestRail
  section value; 29 API cases, all in "<Report> — API" sections per Rule 4).
  All cases `viu_status: VIU-Pending` (spec-only authoring, no designs).
- **Coverage 6/6 COMPLETE:** `coverage-{sbc,sbr,pv,tu,wip,iv}.md` — every
  spec requirement/negative/edge bullet mapped to case IDs per report
  (bullet-by-bullet maps; explicit exclusions listed where applicable).
- **Import READY (Rule 16 pure 1:1):**
  `testrail-import/report-suite-v1-testrail-import.csv` + `.xlsx` via
  `gen_import.py` — header byte-identical to ALL FIVE prior imports
  (fees-discounts / simple-flow / global-search / filters / schedule; equality
  check run 5/5 True); 515 rows; Section = the "XXX — leaf" value (the user's
  import nests these under the "Report Suite" main section per §0.5);
  deterministic ordering (report order SBC, SBR, PV, TU, WIP, IV → authored
  section order → id); VIU-word-free + feature-flag-free (0 hits); 0
  internal-id leaks in reader-facing cells (14 "(see PV-PERM-01)"-style
  cross-refs rewritten generically by `clean()`, same fix as Schedule); no
  duplicate titles within a section; every row has non-empty
  Preconditions/Steps/Expected; XLSX matches CSV row-for-row; rerun is
  byte-identical (deterministic).
- **id-map:** `testrail-id-map.csv` — 515 rows, blank C-ids, schema
  `internal_id,testrail_case_id,title,section` (same as Filters/Schedule).
  ⚠️ GOTCHA (same as Filters/Schedule): rerunning `gen_import.py` BLANKS the
  C-id column — after C-ids are populated, RE-MERGE them after any rerun.
- ONE project, SIX reports, each with its own spec (see §1 inventory).
- **PO: Chris Ward** (same PO as Fees & Discounts — never mix attributions:
  Report Suite = Chris Ward; Global Search / Filters / Schedule = Branko;
  Simple Flow = Milos).
- **Epic / Jira key: NOT AVAILABLE — ⚠️ ASK THE USER when VIU begins** (do NOT
  invent). Every spec's header reads Epic = TBD.
- **Designs: NOT YET AVAILABLE** — every story's Design field is TBD (two specs
  mention a "companion video" as visual reference; not provided). SPEC-ONLY
  authoring: build-accurate wording (Rule 9) from the spec text (these specs are
  unusually label-rich — verbatim strings, filenames, column orders, colors);
  mark anything unpinned "VIU-confirm"; design-reconciliation later if designs
  arrive.
- **QA env / branch / feature-flag status: NOT AVAILABLE — ask at VIU.**
- **Ask Chris Ward at VIU:** TU S8 companion-video inconsistency (OQ-3), IV
  export-cap value (OQ-4); Epic key ask-at-VIU (OQ-1); designs pending (OQ-3).
- **Specs WILL keep changing** (user statement). On every spec update run
  `build/SPEC-RELEVANCE-RECONCILIATION-PROCESS.md`; per Standing Rule 11 ALWAYS
  ASK which process(es) to run before proceeding.
- **TestRail: NOTHING pushed** (no writes without explicit permission —
  Standing Rule 6). `testrail-id-map.csv` = 515 rows, C-ids blank until the
  user's import assigns them (then read-only map from the shared group URL).

## 0.5 TestRail structure (user-prescribed)

ONE main section **"Report Suite"** → one **SUBSECTION per report** (named after
the report) → that report's cases inside. For the import CSV this means the
Section column carries the report name; the user's import creates the parent
"Report Suite" group. Cases with API/backend content (HTTP, endpoints, status
codes — e.g. the nightly-snapshot backend stories) go in a **"<Report> — API"**
section per Standing Rule 4. Import format = **pure 1:1** with the established
`testrail-import/<project>-testrail-import.csv` layout (Standing Rule 16: 8
named columns + 2 trailing blank columns, header byte-identical, no ID columns;
traceability via `testrail-id-map.csv` per Rule 8; VIU-word-free +
feature-flag-free).

## 0.6 Per-report import split files (2026-07-22)

For the user's per-folder import workflow (§0 STATUS: group 4281, subsections
4282–4287), `gen_import.py` now ALSO emits **six per-report import files** —
the unified `report-suite-v1-testrail-import.csv`/`.xlsx` is UNCHANGED
(byte-verified against the pre-split file). **RENAMED 2026-07-22 to
HUMAN-READABLE filenames** (user rule: spell report names out in full — never
cryptic abbreviations like sbc/pv/tu; the old
`report-suite-v1-{sbc,sbr,pv,tu,wip,iv}-…` files were removed; CSV contents
byte-identical to the pre-rename files):

| TestRail folder (manually created by the user) | CSV (`testrail-import/`) + `.xlsx` twin | Rows |
| --- | --- | --- |
| 4282 Sales By Customer Report | `Report-Suite_Sales-By-Customer-Report_testrail-import.csv` | 99 |
| 4283 Sales By Representative Report | `Report-Suite_Sales-By-Representative-Report_testrail-import.csv` | 127 |
| 4284 Parts Velocity Report | `Report-Suite_Parts-Velocity-Report_testrail-import.csv` | 70 |
| 4285 Technician Utilization — Product Specification | `Report-Suite_Technician-Utilization-Report_testrail-import.csv` | 59 |
| 4286 Work In Progress — Product Specification | `Report-Suite_Work-In-Progress-Report_testrail-import.csv` | 83 |
| 4287 Inventory Value — Product Specification | `Report-Suite_Inventory-Value-Report_testrail-import.csv` | 77 |

Sum 515. VERIFIED programmatically 2026-07-22 (re-verified after the rename):
header byte-identical to the
canonical header in all six; every data row byte-identical to its unified-file
counterpart in the same per-report order (byte-level concatenation of the six,
minus repeated headers, == the unified CSV exactly); XLSX == CSV row-for-row
in all 7 files; Section values in each file all carry that report's prefix;
CSVs byte-identical across reruns (deterministic). Import each CSV targeting
its folder above — the Section column creates the "XXX — area" leaf sections
inside that folder.

## 1. Per-report spec inventory (6/6 ingested 2026-07-22)

| # | Report | Spec file (specs/) | Canonical Confluence URL (login-walled — pointer only, do NOT fetch) | Doc header | Latest change-log | Req-bullet count* |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | SBC Sales By Customer | `sbc-sales-by-customer.md` | https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/577634305/SBC+Sales+By+Customer+Report | Owner TBD · In review — 2026-07-16 | 2026-07-21 (Milan resolution) | 235 |
| 2 | SBR Sales By Representative | `sbr-sales-by-representative.md` | https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/585629698/SBR+Sales+By+Representative+Report | Owner TBD · In review — 2026-07-16 | 2026-07-21 (Milan re-review) | 224 |
| 3 | Parts Velocity | `parts-velocity.md` | https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/620888066/Parts+Velocity+Report | Owner TBD · In review — 2026-07-16 | 2026-07-16 (server-side model) | 69 |
| 4 | Technician Utilization | `technician-utilization.md` | https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/641400833/Technician+Utilization+Report | Owner Chris W. · In review — 2026-07-16 | 2026-07-16 (Milan review) | 109 |
| 5 | WIP Work In Progress | `wip-work-in-progress.md` | https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/703660034/WIP+Work+In+Progress+Report | Owner Chris W. · Draft — 2026-07-19 | 2026-07-21 (Milan + Chris override) | 118 |
| 6 | Inventory Value | `inventory-value.md` | https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/720142338/Inventory+Value+Report | Owner Chris W. · Draft — 2026-07-19 | 2026-07-21 (server-side model) | 108 |

\* Count of `S#-R/N/E` requirement bullets in the decoded spec (requirements +
negative + edge cases); a sizing signal, not a case count. Total ≈ **863**.

Extraction method (all 6, same): Confluence "Export to Word" MHTML /
quoted-printable `.doc` → Python `email` (MIME walk to `text/html`,
`get_payload(decode=True)`) + BeautifulSoup, all headings/lists/tables
preserved (tables → pipe tables). SBC arrived as export revision `_2`; the
other five as `_1`.

All six specs share the suite-canonical PRD layout: §1 Business Case · §2
Feature Overview (+ Known Limitations/Out of Scope) · §3 Key Decisions · §4
Terminology · §5 Assumptions · §6 Requirements (Stories with S#-R/N/E) · §7
User Feedback Summary (verbatim message table) · §8 Change Log.

## 2. Per-report readiness snapshot (authoring-planning view)

Common suite patterns (appear in most/all six — author once per report, reuse
wording): Reports left-nav entry + permission gate; date-range presets +
366-day-capped Custom + NO "All Time"; multi-select Location filter (rightmost,
defaults to active location, constrained to accessible locations); per-browser
remembered view (filters/columns/sort) with DEFENSIVE restore; column selector
with a pinned un-hideable headline column (bold, right-pinned); server-side
pagination/sort/filters/exports (committed build target — several specs are
"spec ahead of current code by design"); ⋯ overflow export menu; verbatim
toast/empty-state strings ("Empty bays, endless possibilities. Get Going!" on
the Parts/ops reports; per-report strings on the sales reports); 10,000-row
export cap with a "too large… narrow the date range or filters" toast; dark
mode + accessibility blocks; half-up rounding computed-from-unrounded.

1. **SBC Sales By Customer** — three-level tree Customer → Asset → Invoice
   (per-customer "Parts Sales" bucket for no-vehicle work); filters: date
   range, Product Type (P/S invoice-number prefix), server-backed type-ahead
   multi-select Customer filter (explicit "all-customers state"), Location;
   columns Inv. Hrs / Labor+Parts Invoiced+Margin / Shop Supplies / Margin /
   Margin % / pinned bold Subtotal; asset-label derivation rules (unit → plate
   → VIN-suffix → "Unknown Asset", dedup "(#N)"); server sort/pagination + lazy
   drill-down; exports CSV + PDF + Print (flat, no asset layer; range-based
   filenames; 10k cap); URL-shareable range (saved view wins over link);
   dedicated SBC View permission. 21 stories (2 retired placeholders), 235
   bullets. Label-richness EXTREME (exact hex colors, date formats, filename
   map). API contract: none explicit (server-side behaviors described
   functionally). Est. ~55–75 cases.
2. **SBR Sales By Representative** — per-rep grouped rows (contributors-only,
   A→Z, "(Inactive)" tag, pinned "Unassigned" row via Show Unassigned toggle);
   5-state→3-value payment-status mapping (single source of truth for badge +
   Invoice Status filter); Inv. Hrs colored delta; pinned bold Subtotal +
   responsive grand-Totals (desktop merged row / mobile bar); 4 exports
   (Summary/Expanded × PDF/CSV, font-size tier table, 10k row cap); PLUS three
   beyond-the-report surfaces: Story 13 staff deactivation type-YES dialog,
   Story 15 Sales Rep Assignments CSV (Export Reports dialog), Story 19 WO/Part
   Sale "Sales Rep" selector + invoice-time snapshot fallback (WO rep →
   customer rep → Unassigned). 23 stories (no Story 7), 224 bullets.
   Label-richness EXTREME (verbatim §7 message table incl. the canonical
   "Ooooops! An error occured" typo-as-shipped). API contract: none explicit.
   Known build-deltas to expect at VIU: single-rep model vs shipped dual-field
   schema; contributors-only vs seeded-toggle-reps handler; Expanded-CSV hours
   columns. Est. ~60–80 cases.
3. **Parts Velocity** — introduces the Reports→Parts section; Inventory vs
   Catalogue row model (per-location inventory rows, merged catalogue rows); 20
   columns (14 default) with authoritative per-column calc/format/null table
   (Story 5: Demand ranking, movement-vs-billed bases, reversal netting,
   Turns/Yr, Last Sale all-time lookback); filters Type/date/Category/Vendor/
   Bin/Location + toolbar search; ⓘ header tooltips (verbatim); CSV/PDF (A3
   landscape, alignment differences documented). 7 stories, 69 bullets (dense —
   much of the spec is calc tables). Permission: Inventory Reports → View
   (shown-then-denied nav model to confirm — S1-N2 build-note). API contract:
   none explicit. Calc-heavy: needs seeded WO/parts-sale/return/reversal data
   at VIU. Est. ~45–60 cases.
4. **Technician Utilization** — one row per technician with clocked time; Total/
   WO/Internal Hours, Utilization %, pinned bold Est. Lost Labor (per-location
   rate valuation; "$0.00" vs "—" vs partial-valuation semantics); Summary row
   over VISIBLE technicians; lazy per-day breakdown; on-screen technician
   filter (deselected-set persistence) vs server-side Location filter; Total
   Hours deep-link to Timesheet Activities (reconciliation-to-the-cent
   guarantee S1-R9 with two documented scope exceptions); exports Summary/
   Expanded PDF + CSV (A→Z order, screen sort NOT exported). 9 stories, 109
   bullets. Permission: reuses timesheet-reports permission. API contract: none
   explicit. Known build-delta: shipped single-rate lost-labor rollup + old
   tooltip wording. Est. ~40–55 cases.
5. **WIP Work In Progress** — four tabs (Approved-partially completed /
   Approved-not started / Completed / Estimates) with derived tab placement;
   Earned/Remaining money model from APPROVED lines only (Total = Earned +
   Remaining ≠ WO grand total); seven-figure summary strip (verbatim tooltips);
   on-screen Advisor/Customer/Asset filters vs reloading date/Location; 17
   columns (9 default); per-tab Totals; CSV/PDF per tab ("wip-2-report.*";
   Unit/Branch export-header quirk; "1 days" non-pluralization — documented
   known limitations, NOT defects); Story 11 nightly WIP snapshot (backend, no
   reader this version → API-section candidates). 11 stories, 118 bullets.
   Permission: reuses a WIP-reports permission. API contract: none explicit
   (snapshot schema described). Est. ~50–65 cases.
6. **Inventory Value** — one row per in-stock, non-core part per location
   (50–60k-part scale → fully server-side); valuation rules (fixed sell price →
   pricing-matrix markup → cost fallback); pinned bold Total Cost headline +
   default sort; server-computed totals row; as-of date model (live fallback
   for today, closest snapshot on-or-before otherwise, "As of" indicator);
   Story 11 nightly snapshot capture + 13-month daily / then monthly retention
   (backend → API-section candidates); Category/Vendor/part-search filters;
   PDF/CSV exports (as-of line, 10k cap). 12 stories, 108 bullets. Permission:
   reuses inventory-reports permission. API contract: none explicit. OPEN in
   spec: export-cap value "10,000 is a proposed default — confirm the exact
   suite-standard value with the owner before dev" (S10-R12). Est. ~45–60
   cases.

**Rule-4 note:** no spec defines an explicit REST/API contract (no endpoints,
verbs, or status codes) — server-side behavior is specified functionally. API
sections will be needed mainly for the two nightly-snapshot backend stories
(WIP S11, Inventory Value S11) and any backend-check cases we author.

## 3. Open questions (carry to Chris Ward / ask-at-VIU)

- **OQ-1 (ask at VIU):** Epic/Jira key(s) — one epic for the suite or one per
  report? Not available yet; every spec says TBD.
- **OQ-2 (ask at VIU):** QA env/branch + feature-flag/settings status per
  report (are all six on one branch?).
- **OQ-3:** Designs/Figma — none yet; two specs (Inventory Value S12 context
  note, Technician Utilization S8 context note) defer visual detail to a
  "companion video" that was removed from the header / not provided. Ask
  whether videos/designs exist to reconcile against. (TU header-cleanup removed
  the Companion Video row while S8's note still references it — minor spec
  self-inconsistency to flag.)
- **OQ-4 (product, for Chris):** Inventory Value S10-R12 export-cap value —
  spec itself says confirm the suite-standard value with the owner before dev.
- **OQ-5 (product, for Chris):** permission-model inconsistency across the
  suite — SBC uses a DEDICATED "Sales By Customer report View" permission
  (S1-R2) while SBR rides the Performance-group access (S1-R1) and PV/TU/WIP/IV
  reuse existing report permissions. Confirm intended (affects the permission
  cases we author).
- **OQ-6 (expectation-setting):** several specs are explicitly "spec ahead of
  current code by design" (server-side model committed 2026-07-16/21) and carry
  named build-deltas (SBR single-rep schema + contributors-only; PV reversal
  netting; TU per-location lost-labor). At VIU these will surface as
  deviations until dev catches up — track, don't file as new bugs without
  checking the spec's build-delta notes.
- **OQ-7:** tech-plan tuning values intentionally not fixed by the SBR spec
  (per-rep detail page size; expand-all bound) — unpinnable until build exists.

## 4. Deliverables index

- `specs/sbc-sales-by-customer.md` · `specs/sbr-sales-by-representative.md` ·
  `specs/parts-velocity.md` · `specs/technician-utilization.md` ·
  `specs/wip-work-in-progress.md` · `specs/inventory-value.md` — the COMPLETE
  decoded specs (verbatim-structured, all tables), each with a metadata header
  (canonical URL, doc status, extraction method).
- `cases/*.json` — 26 files, 515 authored cases (SBC 99 / SBR 127 / PV 70 /
  TU 59 / WIP 83 / IV 77), uniform schema, `area` = TestRail leaf section.
- `coverage-sbc.md` · `coverage-sbr.md` · `coverage-pv.md` · `coverage-tu.md`
  · `coverage-wip.md` · `coverage-iv.md` — 6/6 per-report coverage docs,
  every spec bullet mapped to case IDs.
- `gen_import.py` — unified + per-report import + id-map generator (Rule 16
  pure 1:1; self-checking: dupes/leaks/VIU-words/empties/API-section routing).
- `testrail-import/report-suite-v1-testrail-import.csv` + `.xlsx` — 515 rows,
  header byte-identical to all five prior project imports.
- `testrail-import/Report-Suite_<Full-Report-Name>_testrail-import.csv`
  + `.xlsx` — the six per-report split files (§0.6; human-readable names
  2026-07-22: Sales-By-Customer-Report / Sales-By-Representative-Report /
  Parts-Velocity-Report / Technician-Utilization-Report /
  Work-In-Progress-Report / Inventory-Value-Report; SBC 99 / SBR 127 / PV 70 /
  TU 59 / WIP 83 / IV 77; each row byte-identical to its unified counterpart)
  for the user's per-folder import into group 4281 subsections 4282–4287.
- `testrail-id-map.csv` — 515 internal ids, blank C-ids (⚠️ rerunning
  gen_import.py blanks C-ids — re-merge after any rerun once populated).
- `PROJECT-STATE.md` — this file.
- (Not yet created: PO question sheet — the OQ-3/OQ-4/OQ-5 Chris items get
  sheeted per Rule 7 when the user asks / at VIU.)

## 5. Env / access facts

- Nothing project-specific yet (no QA env named). Reuse shared infra when VIU
  starts: `build/TESTING-RUNBOOK.md`, `build/APP-ACTIONS-PLAYBOOK.md`,
  `build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md`,
  `build/SPEC-RELEVANCE-RECONCILIATION-PROCESS.md`, TestRail API patterns
  (project 1 / suite 1 "Master").
- TestRail: NO writes made; none permitted without explicit user permission.

## 6. HOW TO RESUME (ordered)

1. Read this file top to bottom (§0 = the definitive current state: 515 cases
   authored + ADVERSARIALLY REVIEWED CLEAN 2026-07-22, import regenerated
   post-review, ready for user import).
2. ADVERSARIAL REVIEW: **DONE 2026-07-22** (Rule 15/17) — both auditors CLEAN
   after fixes (SBC/SBR/PV 3 minor doc/note fixes b410d29; TU/IV clean; WIP 2
   fixes incl. one real coverage gap 82f1665); independent bullet counts SBC
   235/235, SBR 230/230, PV 69/69, TU ~111, WIP ~119, IV ~110 — all mapped.
3. **Next step:** the USER imports PER REPORT — six split files (§0.6),
   each targeting its manually-created folder under group 4281 "Reports
   Suite" (4282–4287; the Section column creates the "XXX — area" leaf
   sections inside that folder). Folders confirmed created 2026-07-22,
   awaiting case import. Then: READ-ONLY C-id mapping populates
   `testrail-id-map.csv` (515 rows; ⚠️ re-merge C-ids after any gen_import.py
   rerun — it blanks them) — this mapping step is the staged resume action
   once the cases land. NO TestRail writes without explicit permission.
4. When a spec UPDATE arrives: ask which process(es) to run (Standing Rule 11)
   — expect SPEC-RELEVANCE-RECONCILIATION per update (specs will keep
   changing).
5. When VIU begins: ask for Epic key(s), QA env/branch, flag/settings status
   (OQ-1/2); ask which process(es) to run (Rule 11); raise the Chris Ward
   items (TU S8 video inconsistency OQ-3, IV export cap OQ-4, permission-model
   OQ-5); designs still pending; live-observed evidence only (Rules
   10/12/13/14).
6. Keep PO attribution straight: Report Suite = **Chris Ward**.
