# Report Suite — the QuickBooks / fractional-quantity coverage gap, CLOSED (2026-07-31)

> **One line: SV-8589 (In Progress since 2026-07-29) names two tests verbatim and NEITHER was
> covered by any of our 472 cases — 2 new cases now cover exactly those two, and only those two.**

## 1. The gap, proven not assumed

`build/epic-recheck-2026-07-31/REPORT-SUITE-EPIC-DELTA.md` §4 flagged SV-8589 as the single
genuine coverage gap in the whole epic. Re-verified this pass over all 529 local case bodies:

| Search | Hits before | Hits now |
|---|---|---|
| `quickbooks` (case-insensitive, all case bodies) | **0** | 2 (the new pair) |
| `fractional` / part-of-a-unit quantity in any PV case | **0** | 2 (the new pair) |

Nearest existing neighbours — **PV-CALC-01 = [C30359](https://shopview.testrail.io/index.php?/cases/view/30359)**
(net stock movement) and **PV-ROW-10 = [C30350](https://shopview.testrail.io/index.php?/cases/view/30350)**
(a reversal takes Units Sold to 0.00) — are both whole-unit scenarios and say nothing about
precision or about QuickBooks.

## 2. The driver, verbatim (Rule 25 — quote, never paraphrase)

From SV-8589, live-fetched 2026-07-31 (`build/epic-recheck-2026-07-31/raw/reopened-stories-verbatim.txt`,
ingest copy `build/report-suite/epic-sv8582/requirements-SV-8589.md`):

> **Goal:** Fix the live QuickBooks-corruption bug caused by `inventory_changes.old_quantity`/`new_quantity`
> being mapped `integer` while the domain types them `float` — fractional units are truncated at
> hydrate/persist and QB journal-entry sync multiplies these into dollar amounts.

> **Tests:** fractional-quantity round-trip regression; QB journal amount exact from fractional movement.

> **Depends on:** nothing. **Blocks:** B3 (PV — Units Sold precision).

> Verify QB sync read paths (`JournalEntry/Services/ReportGenerator.php`, `JournalEntrySyncService.php`)
> receive un-truncated quantities.

> Forward-only (historical truncation unreconstructible).

## 3. The 2 cases authored

| Internal ID | TestRail | Section | Title |
|---|---|---|---|
| PV-PREC-01 | (new — no C-ID yet) | PV — Columns & Calculations | Units Sold keeps an exact part-of-a-unit quantity and is never rounded off |
| PV-PREC-02 | (new — no C-ID yet) | PV — API | QuickBooks amount for a part-of-a-unit sale is exact and never inflated |

Both `VIU-Pending`. Both titles ≤ 80 chars. Both `refs` ≤ 250 chars and comma-free.

## 4. Why exactly TWO — no padding (Standing Rule 28)

1. **The story lists exactly two tests**, and they are two genuinely different observable
   behaviours in two different systems:
   - PV-PREC-01 — the **ShopView** side: the fraction survives storage and reaches the Units Sold
     column un-truncated (the "round-trip regression").
   - PV-PREC-02 — the **QuickBooks** side: the journal-entry **dollar amount** built from that same
     fractional movement is exact rather than inflated.
2. **Neither absorbs the other.** The truncation can be fixed at the persistence layer and still be
   wrong in the QB read paths (which is why the story calls those out as a separate scope bullet), and
   vice versa. A tester passing one tells you nothing about the other.
3. **A third case was considered and REJECTED as padding:** a "negative / reversed fractional
   quantity" variant. Reversal netting is already owned by PV-CALC-01 (C30359) and PV-ROW-10 (C30350),
   and PV-PREC-01 proves the stored precision regardless of sign. Adding it would be exactly the
   over-granular filler the usefulness audit hunts.

## 5. Rule compliance notes

- **Rule 4 (API placement):** PV-PREC-02 sits in **"PV — API"**. It is a back-end/integration
  regression spanning two systems, not a UI-only check, so an API-titled section is required.
  PV-PREC-01 is UI-only and stays in its functional section.
- **Rule 9 (build-accurate wording):** only labels the current PV spec pins are used —
  **Units Sold** and **On Hand** (S5-R5 formats both to two decimals with thousands separators).
  Everything the spec does NOT pin is marked **VIU-confirm in the NOTES**, never in tester-facing
  text: whether the part-line quantity field accepts a fractional value and its exact label; the
  column-picker label; the QuickBooks journal-entry account/line labels; and how the sync is
  triggered in this build.
- **Rule 20 (traceability):** PV-PREC-01 anchors on PV spec S5-R1 + S5-R5 plus the story.
  PV-PREC-02 has **no report-spec anchor at all** — none of the six specs mention QuickBooks — so its
  `refs` says so explicitly and anchors on SV-8589 plus the engineering tech plan
  (`tech-plan-2026-07-29` Phase 0 / PR-1, decision D2). That is stated, not hidden.
- **Rule 6 (disposable envs):** the NOTES tell the tester to actually exercise the QuickBooks sync
  end-to-end and read the real journal entry — QuickBooks is a disposable test account, so the
  verification must not be skipped because it writes to a third party.
- **Forward-only caveat** captured in the NOTES: the fix cannot reconstruct history, so the tester
  must use a movement made AFTER the migration, never pre-migration data.

## 6. Honesty

Nothing here is live-verified. SV-8589 is **In Progress**, not Done, and the Report Suite has no QA
branch yet, so both cases are `VIU-Pending` and every unpinned label is flagged VIU-confirm. They are
regression cases written to the story's own stated tests, ready to run the moment PR-1 lands.
