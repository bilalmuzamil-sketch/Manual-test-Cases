# Fees & Discounts V1 — Data Sheet Source (what it is + how it seeds/validates VIU)

> **Source:** Google Sheet `1AeklXEnAdIz2yatVFzfhXIxm3xyIio6b`, fetched via
> `curl -L …/export?format=xlsx` and `…/export?format=csv`. Saved as
> `data-sheet-source.xlsx` and `data-sheet-source.csv`.

## What this sheet IS
It is **NOT** test data, calc fixtures, or customer/template fixtures. It is the
**PO answer sheet** — answered by **Chris Ward, the Fees & Discounts PO**
(NOT Milos — Milos is the Simple Flow project's PO) — the completed responses
to our **6 layman PO questions**
(`PO-Questions-SIMPLE.md`). Columns: `# | Topic | What happens now | The question
| Options | Your answer`. It is a filled-in copy of our own PO questionnaire, so
it directly resolves the Part-1 PO threads.

## The 6 answers (verbatim, and what each resolves)

| # | Topic | PO answer | Resolves (our ref) |
|---|---|---|---|
| 1 | Stats page shows a combined total, not line-by-line | **B** — "This is actually a **story defect**. It was fixed originally in Branko's design, but appears to have regressed in the spec." | FD-STATS-001 (BUG-FD-2 / FDBUG-6); also FD-STATS-002/004 → **per-row is intended; live aggregate is a DEFECT** |
| 2 | Customer default fee adds only once — confirm | **A)** adding only once is correct, treat as settled | FD-CUST-016 / FD-VAL-007 (BUG-FD-1) → **single-add is intended; re-scope double-add EXPECTED → single** |
| 3 | "Processing Fee" not visible yet but partly ready | **B)** it should be part of this release — the visible option needs to be added | NOTE-FD-4 / Story 8 → **Processing-Fee builder UI is IN v1 scope; missing UI = build gap/defect** |
| 4 | "Add" button clickable before form valid | **B)** change so the button is greyed out until valid | FD-WO-005 / FD-VAL-001 (BUG-FD-4) → **disabled-until-valid is intended; error-on-submit is a DEFECT** |
| 5 | Multiple line fees/discounts all show at once (no show-more) | **B** — "similar to #1. It was **fixed in the design with a 'show more'** … apparently I didn't define this properly in the spec." | FD-INLINE-003 (BUG-FD-5) → **show-more collapse is intended; always-expanded is a DEFECT** |
| 6 | Customer-defaults added one at a time from a dropdown | **A)** keep as-is — "judgement call. There's higher risk that a user will inadvertently add multiples … the additional clicks are worthwhile." | FD-CUST-005 (NOTE-FD-5/FDBUG-7); also FD-CUST-003/004/006/007 → **single-select dropdown is ACCEPTED; rewrite cases to single-add** |

## How it seeds / validates VIU
- It **does not** provide data fixtures to seed a run (no customers, templates,
  amounts, or calc examples). Seeding stays self-service per the standing rules.
- Its value is **adjudication**: it converts 6 of our 8 open PO threads from
  "awaiting ruling" to "answered," so the corresponding cases move from
  Deviation/Pending to a definite outcome (defect-to-fix vs case-rewrite). See
  `spec-v1-reconciliation.md` for the per-item outcome + proposed case action.
- The 2 remaining PO threads (Part-1 #2 & #3 = BUG-FD-3 whole-WO permission
  enforcement) are **not** in this sheet — correctly, because they are dev/enforcement
  questions, not product decisions, and were intentionally kept out of the
  PO-facing document.
