# Inline Add & Edit Parts — SOURCE CURRENCY + SPEC-DIFF (read 2026-09-07)

| Source | Identifier | Version / last updated | Verdict |
|---|---|---|---|
| Specification | Confluence **782761986** | **Last Updated 2026-09-04** (was v16, 2026-08-31); Change Log now populated through 2026-09-04 | **MOVED** — two 2026-09-04 entries; diff below. |
| Epic + stories | **SV-9315** (SV-9316–9321 + **Story 7 = SV-9724**, was TBD) | Story 7 Jira ticket now assigned | CURRENT — Story 7 ticket resolved. |
| Design | Claude Design "Add Part" `561657da` (undated share link) | linked in header | PARTIAL (undated share link); spec explicit, cases follow spec (Rule 57). |
| Tech plan | held (behind PRD; informs only, Rule 30) | — | reference only. |
| PO / Owner | **Sasha Grosman** | unchanged | CURRENT. |

## v16 → current diff (Rule 43) — the 2026-09-04 changes
| # | Rule | Change | Verdict → case |
|---|---|---|---|
| D1 | **S4-R12 + §4 Key Decision + Story 6 Resolved Question** | **Modal cancel REVERSED** (2026-09-04, reversing 2026-08-24): cancelling the part details modal (Cancel/X/Esc) now shows **no confirmation and discards nothing** — the modal closes and returns to the inline row with its data intact; values changed inside the modal are not carried back. | **rewritten** — C45047 (title changed, divergence note). Build-check line removed (behaviour changed since the 2026-09-01 build). |
| D2 | **S2-R5** | Description overwrite is for a **catalog part only**; for an **inventory part** it is read-only; after save, description/cost/core charge/vendor become read-only (SV-9766). | **rewritten** — C45001 (title changed). |
| D3 | **S4-R4** | Cost is **read-only for an inventory part**; for a **Found part**, vendor/cost/core charge/margin are fixed, empty and read-only. | **rewritten** — C45039 (title changed). |
| D4 | **S7-R12** | Bin Locations modal now also serves **Full View users WITHOUT the See Financial Data permission**; the part details modal serves only Full View **with** it. Dropped the earlier per-bin-allocation-table detail. | **rewritten** — C45232; refs updated **TBD → SV-9724**. |
| D5 | **S4-R21 (new, ×2 in the spec)** | (a) Changing category recalculates Sell Price from Cost via the Pricing Matrix (**SV-9673**). (b) A Full View user **without** the See Financial Data permission gets the **three-field row** (no cost/sell/More Options). | (a) **already covered** by manually-added **C45253** (category→sell recalc). (b) **new case authored** — **C53477** "Full View without See Financial Data gets the three-field row". |
| — | **S2-EH1** | Core unchanged; spec added a note that a **deleted inventory part** surfaces a raw backend string "Inventory part is required when source type is inventory." (**SV-9677**) and that "a separate rule is needed." | No rule to cover yet (spec says one is needed) → **reported, not authored.** C45022 core unchanged. |
| — | S2-R4, S2-R6, Keyboard model chip, §5, §8, §9 bin rows | Already captured in our v16 baseline (2026-08-31). | No change. |

## Handling notes
- The 4 rewritten cases (C45047, C45001, C45039, C45232) had their **"Last checked against build" line
  removed** because their expected behaviour changed after the 2026-09-01 build check — they are
  source-current but **not re-build-verified against the new expected** (the separate build-verify
  session will re-check). **C45047 especially:** the 2026-09-01 build predates the 2026-09-04 reversal,
  so it may still show the old modal-cancel behaviour — flagged for build verification.
- All 4 edited + 1 new are **atm=1 (not Automated)** — Rule 71 did not bite.
- **Automated cases NOT touched** (rules unchanged for them): C45005, C45026, C45223, C45224, C45227,
  C45237, and manually-added C45252/C45253/C45254. **Vladimir Tomovic's 4 cases untouched (Rule 38):**
  C45220, **C45268, C53474, C53475** (three new since our last look).
- Other ~114 cases re-verified against the 2026-09-04 spec, unchanged → provenance left as-is (project
  precedent: non-substantive bump not re-stamped suite-wide).

## Writes: html.set (fr-view), 5 cases fixed, 0 failures; runnable 5/5; R418 union-synced 123 → 124.

## OUTSTANDING (for the QA lead)
- **SV-9677** (spec-flagged): deleted inventory part surfaces a raw backend string; the spec says "a
  separate rule is needed." No case authored (behaviour not yet specified). Flag: do you want a case
  once the rule is written?
- **SV-9673 / SV-9766**: referenced by the spec; SV-9673 (category→sell recalc) is covered by C45253;
  SV-9766 (read-only after save) folded into C45001. These are existing tickets — reported, none created.
- Story 7 Jira is now **SV-9724** (was TBD) — the other Story-7 cases still ref the epic SV-9315; a
  follow-up could re-point all 22 Story-7 cases' refs to SV-9724 (not done this pass to stay in the
  changed-rule scope).
