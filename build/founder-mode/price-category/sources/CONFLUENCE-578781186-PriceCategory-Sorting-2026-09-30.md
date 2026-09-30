# Settings "Pricing" and "Categories" Sorting — source capture

**Confluence page:** 578781186 (space ~Chris Ward) · **Title:** "Settings "Pricing" And "Categories"
Sorting" · **PO:** Chris Ward · **Status:** *Locked for build — 2026-09-15* · **Last modified:**
Sep 23 2026 · **Epic:** SV-9667 · **Design:** artifact UMNdojKWhYhRyJrjdgZa4P ·
**Companion video:** loom.com/share/262e61485be24d07984b571b3350635b · **Read/captured:** 2026-09-30.

> Verbatim requirement quotes for all 63 anchors (S1-R1 … S3-N2) are in `../anchor-quotes.json` and
> quoted unchanged in each case's "Exact quotes" block (Rule 113). This file records currency (Rule
> 31/32) and the shaping context.

## Stories & Jira
- **S1 Categories, sort by name** — SV-10134 (R1–R21, N1, N5, N2, N3 = 25 anchors)
- **S2 Pricing Matrices, sortable column** — SV-10135 (R1–R13, N1, N2 = 15 anchors)
- **S3 Fixed Rules, sortable columns** — SV-10136 (R1–R19 incl R12a/R12b, N1, N2 = 23 anchors)

## Nature of the feature — PRESENTATION ONLY (fully manual-runnable)
Nothing changes what the server sends. Every rule is about row order and which header shows an arrow,
decided in the browser from already-loaded records. No new endpoint/parameter. QA test shape: "put the
list in this state and read the order." **Desktop only** (Settings → Parts); no mobile pass owed.

## Key decisions (shape Expected results)
- **Categories** loads all records at once, opens Name A→Z; Name and QuickBooks Products And Services
  columns sortable; **Default category pinned first under every sort** (deliberately unlike Pricing
  Matrices). QuickBooks column has **no empty state** — unmapped shows the word "Parts" and sorts
  under P (S1-R17, corrected 2026-09-15: leave production alone).
- **Pricing Matrices**: Matrix Category sortable, opens matrix-name A→Z; **default matrix NOT pinned**
  (sorts by its name).
- **Fixed Rules** loads all listed records at once, opens Part number ascending; Part number /
  Category / Fixed price sortable; **search now works** (S3-R18; was dead); loading indicator while
  loading (S3-R19); lists only rules whose part has a category (S3-R12b).
- Sorts are **case-insensitive and numeric-aware** (BRK-9 < BRK-10 < BRK-100; empty sorts last).
- A sort **belongs to the user until they leave the page**: survives a reload-in-place (create/edit/
  delete, or a new search term); a fresh open resets to the default. This is the one release-note
  behaviour change.
- Tab labels carry **one space before the count**: `Pricing matrices (N)` / `Fixed rules (N)` (design
  system may show them in capitals — expected, not a defect).

## Out of scope (no cases claiming these)
Sorting any column not named; sorting Fixed Rules on the server; changing how much data loads beyond
what the sorts need; changing the Categories/Pricing-Matrices search boxes (Fixed Rules search is the
one exception — it is made to work).

## Manual-runnability (Rule 114)
Every case is UI-only (seed rows, set the list state, read the order/arrow/label). The QuickBooks
column cases (S1-R9…R14, R17, N1, N5) need a QuickBooks-connected shop / a connection-check failure
state. No QA branch yet → all `AUTOMATION: HOLD`, source-verified only.
