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
- NONSENSE cut (1): FLT-SRCH-09 — blank. (Retirement later REVERTED — see the addendum; it is ACTIVE again.)

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
| Command-K cross-project CUTs **FLT-SRCH-01..09** | **9** | **USER RULING 2026-07-31: do NOT delete unless Branko confirms they are Global-Search-only** (Q6 pending) — all nine stay in the Filters suite. None has a C-id, so no TestRail op exists either way. See the addendum. |
| The ≤80-char title trims | 39 | Not authorized this pass. |
| Optional MG16 / MG17 / MG18 under-merges | 6 | Not authorized this pass. |
| In-suite duplicate CUTs FLT-BAR-03 (C29559) / FLT-COLL-03 (C29603) | 2 | Not in this authorization (only the single NONSENSE cut was authorized). Both remain live. |
| Merge groups MG3 / MG4 / MG7 / MG8 / MG10 / MG11 / MG12 / MG13 | — | Not in this authorization. |

## ADDENDUM — FLT-SRCH-09 retirement REVERTED (same day, user ruling)

The authorization listed the 9-case Command-K CUT block as HELD *and* the single NONSENSE case as
authorized; FLT-SRCH-09 is both, and it was initially treated as authorized (its CUT reason is "not
a test case at all", not the cross-project duplication that Branko's Q6 decides). **A later
same-day USER RULING settled it the other way, verbatim:**

> "OK do not delete those cases unless Branko confirms that they are related to Global search only."

**Action taken: the FLT-SRCH-09 retirement was REVERTED.** Its exact pre-edit body was restored from
`../consolidation-backup-2026-07-31/pre-edit-bodies/FLT-SRCH-09.json` (only the internal `notes`
field carries the added audit-trail paragraph) and the case is **ACTIVE** again. All nine
FLT-SRCH-01..09 now stay in the Filters suite until Branko explicitly confirms Global-Search-only
ownership (Q6 of `../PO-Questions-Branko-PartsReports-2026-07-27.md`).

**TestRail impact: NONE.** No FLT-SRCH case has ever had a C-id, so nothing was ever deleted, and
the revert needed no TestRail op. The 2 `update_case` ops above are unaffected and remain the only
writes of this pass. **Final tally: 137 authored → 110 ACTIVE** (27 retired = the MG14 + MG15 merge
members only).
