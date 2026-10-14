# Addendum, 14 Oct 2026: the PRD moved to version 21 (read this first, then WORKER-BRIEF.md)

The PRD changed overnight (v20 → v21, status "Locked for build - 2026-10-13"). The full rewrite in `proposals-A.json`
(26 updated, 11 new) was written against v20 and validated. **Bring the WHOLE file to v21.** Every case is
re-checked against v21, not only the ones the change touches (Rule 122). Keep everything that is still right.

## What changed (read these in full)
- `../SOURCE-CHECK-2026-10-14.md` (summary of the change)
- `../sources/CONFLUENCE-578781186-2026-10-14.md`: the PRD, v21. **This is now the authority.** Read it in full.
- `../sources/prd-diff-2026-10-13-to-2026-10-14.txt` and `../sources/requirement-code-changes-2026-10-14.txt`
- `../sources/jira-2026-10-14/CHANGED-2026-10-14.md` and the three `SV-1013x-description-diff-*.txt` files (stories re-synced
  to v21, including new third-click acceptance criteria and, in SV-10136, S3-R18/S3-R19 and "$10.00 first on the first click")
- `anchor-quotes-current.json` has been REBUILT from v21 (67 codes). The v20 copy is `anchor-quotes-2026-10-13-v20.json`.
  Copy quotes programmatically from the rebuilt file only.

In short:
- **Fixed price now opens on the HIGHEST price** (S3-R4, S3-R8): first click highest first, second click lowest first (S3-R9).
  Part number and Category: first click A to Z. Second click on any header: the opposite direction (S3-R5).
- **No third state** (new codes): S1-R6a (Name), S1-R11a (QuickBooks Products and Services: third click = A to Z again),
  S2-R6a (Matrix Category), S3-R5a (Fixed rules headers: third click = first click's order). Every further click flips again.
  The "Sort arrows" section gains a bullet that no click clears the sort.
- Key Decisions gain two entries citing a ShopView-wide "Default Sorting" decision (2026-10-13 and 2026-10-06). That decision
  document could not be found in Confluence, Jira or Slack. The PRD states both rules in full: quote the PRD.
- Terminology gains a "Default category" entry ("Uncategorized", Default badge, cannot be edited). Check the Default-category
  cases against it.
- The tech plan (13 Oct, `../sources/tech-plan-Parts-Settings-Sorting-2026-10-13.md`) still says FR-018 "first click on an unsorted
  header sorts ascending" and FR-020 "Fixed price sorts by numeric value — lowest first ascending". **The PRD v21 (newer) wins**
  (Rule 30/57). In every case that tests Fixed price order, add one divergence sentence at the end of `source` (Rule 56):
  "The technical plan of 13 Oct 2026 (FR-018, FR-020) says the first click on Fixed price sorts lowest first; PRD version 21
  (14 Oct 2026, S3-R4, S3-R8) says highest first and is newer, so this case follows the PRD." Also add it to `notes`.

## What to do
1. Every case (updates and new): Source paragraph now says `PRD ... Confluence 578781186, version 21 (14 Oct 2026), <codes>,
   read 14 Oct 2026` and `Source-verified 14 October 2026; not yet build-verified (no Price/Category QA build exists).`
   Story texts: cite as re-synced 13 Oct.
2. C154742, C154745, C154751 and any other case (including setup docs and new cases) that expects or assumes ascending /
   lowest first on the first Fixed price click, or "descending" wording for a second click, or that a third click returns to
   an unsorted/opening order: correct the title, steps, results, quotes and doc parts to v21. Titles must not say
   "ascending/descending" where the PRD now speaks of A to Z / highest first / opposite direction. Use worked examples with
   arithmetic where prices are compared (e.g. prices (for example $9.00, $10.00 and $16.10): first click shows $16.10, $10.00,
   $9.00).
3. Cover the four new codes S1-R6a, S1-R11a, S2-R6a, S3-R5a. Prefer adding a third (and fourth) click to the existing toggle
   cases (C154727 Name, C154728 QuickBooks column, C154737 Matrix Category, C154742 fixed-rules headers), with its own
   "Step N:" results, if the case stays one behaviour and its title still fits (change the title if needed: "...flips on
   every click" style). Otherwise add a new case. Each case still checks ONE behaviour.
4. Re-read every remaining case against v21 for anything else that moved (diff file), and fix it.
5. `notes`: replace stale v20 notes; list every story-vs-PRD, design-vs-PRD and tech-plan-vs-PRD difference that remains.
6. Write the result to `proposals-A.json` (overwrite; the v20 copy is kept as `proposals-A-v20-2026-10-13.json`). Validate with
   `python3 build/testing-tools/apply_case_update.py --config build/founder-mode/price-category/update-2026-10-13/config.json --only build/founder-mode/price-category/update-2026-10-13/proposals-A.json`
   (run from the repo root) until it prints no PROBLEM, and coverage is 67/67.
7. Report: counts (updated, new, retire), which cases changed in substance and why, the new-code placement, notes, and your
   reading coverage.
