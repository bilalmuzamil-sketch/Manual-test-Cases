# Invoice UI Refresh — Reconciliation 2026-08-25

**Trigger:** QA lead re-supplied the Invoice UI Refresh design zip (`Inovoice_refresh_Design.zip`)
and the Technical Implementation Plan (`InvoiceUIRefreshCustomerDocumentsTechnicalImplementationPlan.md`),
asking for a re-check of the existing 87-case suite against them.

## Inputs compared (this pass)

| Input | This pass | Authored against (21 Aug) | Result |
|---|---|---|---|
| **Confluence PRD 755990532** | live **v39** (fetched 2026-08-25) | v38 | **1-version delta — non-substantive** (below) |
| **Technical Implementation Plan** | `636ab367-…TechnicalImplementationPlan.md` | `94762548-Invoice_refresh_techical_plan.md` | **md5-IDENTICAL** — already folded in |
| **Design document (Claude artifact export)** | `7798084b-Inovoice_refresh_Design.zip` | `005d44b9-Ui_Refresh.zip` | **content byte-identical** (only share-frame avatars differ) |

## PRD v38 → v39 delta (verbatim diff, stored v38 body vs live v39 body)

Two lines only, both non-substantive:
1. **Added** a header-table row: `Slack Channel | https://shopview.slack.com/archives/C0BRRDKH10W`.
2. **Removed** one trailing blank line at the end of the change-log table.

**No story, rule ID, wording, format, or shown/hidden rule changed.** All S1–S13 + G-R1 rules that
the 87 cases anchor to are identical in v39. The v39 edit is also **not recorded in the spec's own
change log** (log still ends 2026-08-12) — folded into PO-2 as disclosure (it is cosmetic, so it is a
disclosure, not a new question).

## Actions taken

- **No case content changed** (nothing substantive to fold in).
- **Provenance re-stamped on all 87 cases** (Rule 54): "specification version 38 … read on 21 August
  2026" → "specification version 39 … read on 25 August 2026". `spec_ref` "spec v38" → "spec v39".
- **AUTOMATION marker date left at 8/21/2026** deliberately — no QA build was exercised this pass, so
  claiming a fresh build-availability check would be false (Rule 12). Still a Rule-85 project.
- **Import regenerated**: 87 rows, 0 shredded cells, one marker+provenance each, 0 internal-id leaks,
  0 VIU words. id-map refs 87/87.
- **v39 body stored** at `intake-2026-08-21/sources/spec-body-confluence-v39-755990532.md`.
- **PO questions refreshed** → `questions-2026-08-25/…_2026-08-25.xlsx` (PO-1 unchanged; PO-2 now
  names both un-logged edits and records the 25-Aug one as verified-cosmetic).

## Reconciliation counts (Rule 17 completeness)

authored cases **87** = import rows **87** = id-map rows **87**; set-equal both ways; 0 lost, 0 added.

## Still open (unchanged by this pass)
- **PO-1** — Credit Invoice Balance (S11-R6a vs Section 6 glossary).
- **PO-2** — what the 13 Aug (v37→v38) edit changed (v37 body not held, so un-diffable here).
- **TestRail target section** for Invoice UI Refresh — still UNCONFIRMED.
