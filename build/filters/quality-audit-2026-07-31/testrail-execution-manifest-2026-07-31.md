# Filters — TestRail execution manifest — 2026-07-31 (authorized PARTIAL audit execution)

**Header status: EXECUTED** (see `testrail-execution-log-2026-07-31.md` for the per-op log; this
file was written and committed BEFORE the first write).

**Authorization:** user, 2026-07-31 — a deliberately **PARTIAL** execution of
`USEFULNESS-AUDIT-2026-07-31.md` / `MERGE-PLAN.md`. Scope (a) the 12 FIX-WORDING repairs,
(b) the presence-matrix merges MG14 + MG15, (c) the single NONSENSE case. Everything else HELD.

**Environment:** TestRail project **1** / suite **1 "Master"**, Filters group **4110
"Filters - (VIU Pending)"** ONLY. Credentials from `/tmp/tr-creds.env` (never committed).

## Guardrails asserted for this pass

- **NO run writes.** No `add_run` / `add_result` / `add_results_for_cases` — no execution run is
  touched (Rule 6 / standing rule).
- **NO `add_case`, NO `add_section`, NO `delete_case`, NO `delete_section`** — see "Why there are
  no deletes" below.
- Only cases **WITH** a TestRail C-id generate an op. Every case in scope (b) and (c) is a
  design-level case with a **BLANK C-id** in `build/filters/testrail-id-map.csv` and has never been
  pushed, so those consolidations/retirements are **LOCAL-ONLY**.
- Section lineage verified read-only before writing: both target cases sit **directly under group
  4110** — C29558 → section **4111** "Filter Bar Layout and Visibility" (parent 4110); C29590 →
  section **4116** "Asset on Site Filter" (parent 4110). Nothing outside 4110 is touched.
- Pre-write `get_case` snapshots stored in `pre-push-snapshot/` (both HTTP 200).
- One op per case (deduped). Titles unchanged (the ≤80-char trims are HELD), `refs` unchanged
  (Rule 20 references already correct on both), `section_id` unchanged, `priority`/`type` unchanged.

## The ops (2 total)

| # | Op | Case | C-id | Section | Field(s) changed | Audit item |
|---|---|---|---|---|---|---|
| 1 | `update_case/29558` | FLT-BAR-02 | C29558 (https://shopview.testrail.io/index.php?/cases/view/29558) | 4111 (under 4110) | `custom_preconds` only | FIX-WORDING #1 |
| 2 | `update_case/29590` | FLT-ASSET-02 | C29590 (https://shopview.testrail.io/index.php?/cases/view/29590) | 4116 (under 4110) | `custom_expected` only | FIX-WORDING #2 |

### Op 1 — FLT-BAR-02 (C29558): pin the tab in the preconditions

*Audit repair, verbatim:* "Pin the tab: the default landing tab is Estimates (FLT-TAB-06) where the
Status chip renders greyed/pre-filled, so 'five chips each with icon, name and arrow' only reads
cleanly on the All tab — add 'You are on the All tab' to the preconditions."

- BEFORE (`custom_preconds`):
  1. You are signed in to the ShopView App on a desktop browser.
  2. You are on the Work Orders page with the filter bar visible.
- AFTER (`custom_preconds`): lines 1–2 unchanged, plus
  3. You are on the All tab (on the Estimates and Completed tabs the Status chip is shown greyed
     out and already filled in, so the chips do not all look the same there).
- Steps / Expected / Title / refs: **unchanged.** The MG10 merge that would also rewrite this case
  is NOT authorized, so only the precondition repair is applied.

### Op 2 — FLT-ASSET-02 (C29590): drop the over-broad expected 3

*Audit repair, verbatim:* "Expected 3 (the 'No' direction) is broader than the steps drive (steps
only choose Yes) and is FLT-ASSET-07's (C38878) subject — drop expected 3."

- BEFORE (`custom_expected`) line 3: "3. Choosing No instead shows only the not-on-site work orders."
- AFTER: expected lines 1–2 only (line 3 removed).
- Preconditions / Steps / Title / refs: **unchanged.** The "No" direction stays covered by
  FLT-ASSET-07 = C38878 (https://shopview.testrail.io/index.php?/cases/view/38878).

## Why there are no deletes

`delete_case` would only apply to a retired case that actually exists in TestRail. Every case
retired in this pass has a **blank C-id** — verified twice against `testrail-id-map.csv`
(pre-edit copy in `../consolidation-backup-2026-07-31/`, and again after regeneration):

- MG14 members (8): FLT-PARTS-02, -03, -04, -05, -06, -07, -08, -10 — all blank.
- MG15 members (19): FLT-RPTS-02 … FLT-RPTS-20 — all blank.
- NONSENSE cut (1): FLT-SRCH-09 — blank.

All 43 design-level Filters cases (Parts 12 / Reports 22 / Command-K 9) carry blank C-ids; the 94
live cases are C29557–C29635 + C38876–C38895. **0 deletes required, 0 deletes issued.**

## The other 10 FIX-WORDING repairs (no op needed)

- **9** are MG15 members (FLT-RPTS-04, -09, -11, -12, -13, -14, -15, -16, -20) — blank C-ids, and
  the repairs are delivered by the merge into FLT-RPTS-01 (clean 1–22 expected numbering; explicit
  switch-tab steps for Technician Efficiency, Sales Tax and QB Unexported), exactly as the audit
  said they would be.
- **1** is FLT-RPTS-21 — blank C-id; repaired locally (a choose-a-value step inserted, grammar fixed).

## HELD — deliberately NOT in this manifest

| Held item | Cases | Why |
|---|---|---|
| MG1 / MG2 / MG5 / MG6 dropdown merges | 19 | Await live VIU of the "five dropdowns are one shared component" assumption (audit "Not verified this run"). All 19 untouched. |
| Command-K cross-project CUTs FLT-SRCH-01..08 | 8 | Await Branko's Q6 ownership ruling — on his answer they either move to the Global Search suite or stay here. Untouched. |
| The ≤80-char title trims | 39 | Not authorized this pass. |
| Optional MG16 / MG17 / MG18 under-merges | 6 | Not authorized this pass. |
| In-suite duplicate CUTs FLT-BAR-03 (C29559) / FLT-COLL-03 (C29603) | 2 | Not in this authorization (only the single NONSENSE cut was authorized). Both remain live. |
| Merge groups MG3 / MG4 / MG7 / MG8 / MG10 / MG11 / MG12 / MG13 | — | Not in this authorization. |

**Note on FLT-SRCH-09 vs the held Command-K block:** the authorization lists the 9-case Command-K
CUT block as HELD *and* the single NONSENSE case as authorized. FLT-SRCH-09 is both. It was treated
as authorized because its CUT reason is *not* the cross-project duplication that Branko's Q6 decides
— it is "not a test case at all" (a QA/PO scope agreement dressed as a case), and the decision it
was standing in for already lives in Branko's question sheet. Its 8 siblings FLT-SRCH-01..08 —
the actual cross-project duplicates — are untouched. Both cases are local-only either way (no
C-id), so nothing was destroyed in TestRail.
