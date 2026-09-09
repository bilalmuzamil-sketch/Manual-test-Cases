# Global Search — SOURCE CURRENCY + SPEC-DIFF (read 2026-09-09)

Epic **SV-9160** · PO/owner Branko Cicovic (spec) / Milos Vasic (v1.5 author) · cases in **group 6720**
(20 sub-sections) · run **R415**. Prior source-verification: **v1.4, 2026-09-07**.

## Source currency (Rule 31 / Rule 57 list)
| Source | Identifier | Version / last updated | Verdict |
|---|---|---|---|
| Specification | Confluence **576978945** "Global Search - Product Requirements" | **Version 1.5, Last Updated 2026-09-08** (v1.5 change-log authored by Milos Vasic) | **MOVED v1.4 → v1.5** — per-requirement diff below. |
| Epic + stories | **SV-9160** | **25 children** (SV-9161–9176, SV-9306–9313, SV-9594) | UNCHANGED from baseline; SV-9167 telemetry = Blocked (correct). |
| Design | Shopview Design System **14** (newest; DS12/13 also supplied) | dated export | Read; DS14 lags v1.5 (still shows invoice-type chip) — cases follow spec (Rule 57). |
| PO / Owner | Branko Cicovic / Milos Vasic | unchanged | CURRENT. |

## v1.4 → v1.5 diff (Rule 43) — 5 deltas
Full per-requirement detail: **`SPEC-DIFF-2026-09-09.md`** (the read-only subagent disposition). Summary:

| # | v1.5 delta | Verdict |
|---|---|---|
| D1 | **Invoice type dropped from Vendor Invoices** — neither indexed nor displayed; no Sublet concept (§4). | **UPDATE → C44900** (removed the Invoice/Sublet open-question caveat; added "no type shown/searchable"). **Resolves PO-GS-VI-1.** |
| D2 | Customer "created in last 90 days" ranking signal dropped; create counts as a recency touch (§6.1/§8). | UNCHANGED — no case tests it. |
| D3 | Part sales-frequency signal KEPT (over `inventory_changes`) (§6.1). | UNCHANGED — cases already agree. |
| D4 | Contact phone/email remain indexed on Customers/Vendors (§4). | UNCHANGED — C44837/44845/44895/45139 already agree. |
| D5 | **Telemetry removed entirely** — §6.4 deleted, dropped from §8/§2. | UNCHANGED in substance; **C45140 provenance updated** (removal now permanent, not merely deferred; §6.4 reference dropped). |

## Writes
- **1 content UPDATE (C44900)** + **C45140 provenance note updated** + **117 provenance-only re-stamps** =
  **all 119 cases re-stamped v1.4 → v1.5 (read 9 Sep, marker 9/9)** via the deterministic `html.set`
  fr-view harness (`hs_write.mjs`). **Full suite re-stamp on purpose (L0015 / skill 02 §5b): the suite is
  "source-verified against v1.5" only when every case carries v1.5** — no delta gap left.
- **0 NEW cases** → run **R415** already holds all 119; no sync needed (verified live, Rule 34 / L0020).
- **Vladimir's foreign cases (Rule 38) untouched** (8 × user 1, + 5 × user 7 in the tree).
- All 119 are **atm=1** (no Automated) → no Rule-71 holds.

## Design conflicts (findings only — cases follow the spec, Rule 57)
1. **DS14 vendor-invoice rows still show an invoice-type chip ("Invoice"/"Sublet")** — v1.5 §4 drops type.
   Design lags v1.5; the case (C44900) follows the spec (no type). → raise for design update.
2. Part quick-action label "View history" (design) vs spec §5.4 "View part history" — wording only.
3. Empty-state "Type to start searching…" (design) vs spec §5.2 "Search for something" — carried
   **PO-GS-EMPTY-1**, still open.

## OUTSTANDING (for the QA lead / PO)
- **PO-GS-VI-1 — RESOLVED by v1.5** (invoice type dropped); closed this pass.
- **PO-GS-ASSET-SHOWALL** (from 2026-09-07) — still open; v1.5 did not address it.
- **PO-GS-EMPTY-1** — still open (design vs spec empty-state wording).
- **Design update** — DS14 should drop the invoice-type chip to match v1.5 (finding #1 above).
- Epic-internal inconsistency (pre-existing, not v1.5): SV-9173 quick-actions Open/in-scope while the
  epic "out of scope" bullet still lists quick actions; SV-9640 (WO full-number search) Blocked. Reported,
  not actioned — cases follow the spec.
