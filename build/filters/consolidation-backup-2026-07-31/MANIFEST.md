# Filters — pre-edit backup + recovery manifest — 2026-07-31 consolidation

**What this folder is.** The complete pre-edit state of every case body touched by the
USER-AUTHORIZED **PARTIAL** execution of the 2026-07-31 Filters Ruthless Usefulness Audit
(`build/filters/quality-audit-2026-07-31/`). Nothing here is a deliverable — it exists so any
edit can be undone exactly.

- `pre-edit-bodies/<INTERNAL-ID>.json` — **33** individual case bodies, byte-for-byte as they
  were before the edit (the 3 direct wording repairs + the 2 merge survivors + the 27 merged-away
  members + the NONSENSE case whose retirement was later reverted).
- `cases-*.json.pre-edit` — whole-file copies of the **5** source files that were rewritten
  (`cases-A-bar-status-collapse.json`, `cases-B-people-asset-filters.json`,
  `cases-E-parts-filters.json`, `cases-F-reports-filters.json`, `cases-G-page-search.json`).
- The edit itself is a single deterministic script:
  `build/filters/quality-audit-2026-07-31/apply_consolidation_2026-07-31.py`
  (it refuses to run twice).

**Snapshot:** case bodies as at git `ecc5d69` (the commit that delivered the audit's adversarial
self-audit); suite = 137 authored, all active, before this pass.

---

## What was executed (authorized) vs held

| Item | Authorized? | Executed |
|---|---|---|
| (a) The 12 FIX-WORDING repairs | YES | 3 applied directly + 9 delivered by the MG15 merge |
| (b) PRESENCE-MATRIX merges MG14 (Parts) + MG15 (Reports) | YES | 27 members → 2 survivors, **LOCAL-ONLY** (all blank C-ids) |
| (c) The single NONSENSE case (FLT-SRCH-09) | YES, then **REVERTED** | Retired locally, then **restored to ACTIVE** the same day on a later user ruling (see below). No TestRail op either way. |
| (d) MG1 / MG2 / MG5 / MG6 dropdown merges — 19 cases | **HELD** | untouched — awaits live VIU of the "five dropdowns are one shared component" assumption |
| (e) **FLT-SRCH-01..09** cross-project CUTs — **9 cases** | **HELD (user ruling 2026-07-31)** | all nine stay in the Filters suite; do NOT delete unless Branko confirms Global-Search-only ownership (Q6 pending) |
| (f) The 39 over-80-char title trims | **HELD** | not applied |
| (g) Optional MG16 / MG17 / MG18 under-merge findings | **HELD** | untouched |
| Not in this authorization: the 2 in-suite duplicate CUTs (FLT-BAR-03 C29559, FLT-COLL-03 C29603) and merge groups MG3/MG4/MG7/MG8/MG10/MG11/MG12/MG13 | — | untouched |

**Tally:** 137 authored → **110 ACTIVE** (27 retired = the MG14 + MG15 merge members). The 28th retirement (FLT-SRCH-09) was reverted the same day — see the corrected NONSENSE-cut section below.

---

## Group → members → survivor → what the survivor gained

### MG14-PARTS-CHIP-MATRIX — **LOCAL-ONLY** (every case blank C-id, never in TestRail)

- **Survivor:** `FLT-PARTS-01` (new, no C-ID yet) — retitled
  *"Parts Inventory page shows Bin Location, Category, Supply and Vendor filters"* →
  **"Every Parts list page shows its designed filter buttons"** (55 chars, ≤80 bar).
- **Members retired (8):** FLT-PARTS-02, -03, -04, -05, -06, -07, -08, -10 (all "new, no C-ID yet").
- **What the survivor gained:** one Parts walk — 9 steps (Inventory → Part Sales → Catalog →
  Returns tab → Credits tab → Purchase Orders → Vendor Invoices → Vendors → toolbar icons) with an
  11-line per-view checklist of the designed filter buttons; the shared Search/funnel/column
  toolbar-icon line from FLT-PARTS-10; the FLT-PARTS-08 **Vendors design conflict** carried over as
  a plain tester hedge ("the developers have not been given a design for the Vendors page filters
  yet … write down what you actually see instead of failing the whole test") plus the full
  engineering detail in the notes.
- **Demoted to reference notes (per the audit):** every per-view table-COLUMN list and every
  "New …" button assertion — filler outside the Filters scope. All of it is preserved verbatim in
  the survivor's internal `notes` (not emitted to the import), so nothing was lost.
- **Untouched siblings:** FLT-PARTS-09 (Part Type menu contents), FLT-PARTS-11 / FLT-PARTS-12
  (apply + multi-select behaviour; MG18 is HELD).

### MG15-REPORTS-CHIP-MATRIX — **LOCAL-ONLY** (every case blank C-id, never in TestRail)

- **Survivor:** `FLT-RPTS-01` (new, no C-ID yet) — retitled
  *"Timesheet Activities report shows Staff, Date, Status, Modified by filters"* →
  **"Every report page shows its designed filter buttons"** (51 chars, ≤80 bar).
- **Members retired (19):** FLT-RPTS-02 … FLT-RPTS-20.
- **What the survivor gained:** one Reports walk — 15 steps covering 19 report pages / 23 designed
  views, with a 22-line per-report checklist of the designed filter buttons; the aging reports'
  print icon; the Notes search/filter/sort icons; the Reminders empty message *"There are no
  reminders for selected date range"*; the IBS view tabs (Ready To Send / Sent / Payments); the QB
  Unexported per-tab first chip (Customer / Vendor / User).
- **It also delivers 9 of the 12 FIX-WORDING repairs**, exactly as the audit predicted:
  - repeated `2.` numbering (FLT-RPTS-09 / -11 / -12 / -13 / -14 / -15 / -16) → the survivor's
    expected list is a clean 1–22;
  - missing switch-tab steps (FLT-RPTS-04 Invoiced/Completed; FLT-RPTS-20 Customers/Vendors/Journal
    Entries; plus Sales Tax Collected/All Tax Rates) → explicit switch-tab steps 4, 9 and 15.
- **Demoted to reference notes:** all report table-COLUMN lists + the on-screen title notes
  ("Payroll Timesheet", "Work in Progress") + the "sample placeholder body" caveats — preserved
  verbatim in the survivor's internal `notes`.
- **Untouched siblings:** FLT-RPTS-21 (apply behaviour — separately repaired), FLT-RPTS-22 (new
  filter TYPES behaviour), FLT-RPTS-23 (date-range chip).

### The single NONSENSE cut — RETIRED, then **REVERTED** the same day (LOCAL-ONLY throughout)

- `FLT-SRCH-09` (new, no C-ID yet) — *"Page search scope belongs to Filters or Global Search (to
  decide)"*. The audit scored it NONSENSE + CUT (it asks a tester to execute a QA/PO scope
  agreement — fail conditions F6 not-actionable / F1 not-executable) and it was retired locally
  under item (c).
- **A later same-day USER RULING reversed that**, verbatim: *"OK do not delete those cases unless
  Branko confirms that they are related to Global search only."* The retirement was **UNDONE** —
  the exact pre-edit body was restored from `pre-edit-bodies/FLT-SRCH-09.json` (only the internal
  `notes` field gained an audit-trail paragraph) and the case is **ACTIVE** again.
- **All nine FLT-SRCH-01..09 now stay in the Filters suite** until Branko explicitly confirms
  Global-Search-only ownership. His answer to **Q6 ("The pop-up search box")** of
  `build/filters/PO-Questions-Branko-PartsReports-2026-07-27.md` decides move-vs-keep. The audit's
  CUT/NONSENSE verdicts stand as recommendations only, re-tabled on that answer.
- **No TestRail impact at any point** — no FLT-SRCH case has ever had a C-id.

### The 3 direct FIX-WORDING repairs

| Case | C-id | Repair applied |
|---|---|---|
| FLT-BAR-02 | C29558 (https://shopview.testrail.io/index.php?/cases/view/29558) | New precondition 3 pins the tab: *"You are on the All tab (on the Estimates and Completed tabs the Status chip is shown greyed out and already filled in, so the chips do not all look the same there)."* Nothing else changed — the MG10 merge that would also touch this case is NOT authorized. |
| FLT-ASSET-02 | C29590 (https://shopview.testrail.io/index.php?/cases/view/29590) | Dropped expected 3 (*"Choosing No instead shows only the not-on-site work orders"*) — the steps only choose Yes and the "No" direction is FLT-ASSET-07's subject (C38878). |
| FLT-RPTS-21 | new, no C-ID yet | Steps rewritten to actually choose a value (*"Open one of the filter buttons shown above the report table and choose one value"*) so expected 1 follows, and the grammar *"go to the any (for example Sales) report"* fixed. |

---

## Recovery steps

**Undo one case:**
```bash
# inspect the pre-edit body, then paste it back into the owning cases-*.json
cat build/filters/consolidation-backup-2026-07-31/pre-edit-bodies/FLT-RPTS-04.json
```

**Undo everything (whole-file restore):**
```bash
cd /home/user/Manual-test-Cases
for f in cases-A-bar-status-collapse cases-B-people-asset-filters \
         cases-E-parts-filters cases-F-reports-filters cases-G-page-search; do
  cp build/filters/consolidation-backup-2026-07-31/$f.json.pre-edit build/filters/cases/$f.json
done
python3 build/filters/gen_import.py          # regenerate import + id-map
# then re-merge the live C-ids into build/filters/testrail-id-map.csv (gen_import.py blanks them)
```

**Undo the TestRail side.** Only **2 `update_case` calls** were made this pass (FLT-BAR-02 =
C29558, FLT-ASSET-02 = C29590) — **no deletes, no adds, no run writes**. Pre-write `get_case`
snapshots of both are in
`build/filters/quality-audit-2026-07-31/pre-push-snapshot/`; re-`update_case` from those JSONs to
revert. Everything else in this pass was local-only because those cases have no C-id.

**Git:** the whole pass is a small number of commits on `claude/slack-session-0sxnd9` touching only
`build/filters/**` and `testrail-import/filters*` — see
`build/filters/quality-audit-2026-07-31/testrail-execution-log-2026-07-31.md` for the commit trail.
