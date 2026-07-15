# Simple Flow — Design Diff (2026-07-10 bundle vs baseline)

> **New bundle:** `890a4d0a-Simple_Flow_Design_2.zip` (uploaded 2026-07-10 by QA
> lead) → unzipped to `/tmp/simple-flow/design2/` (ephemeral; re-unzip if the
> sandbox resets). Preserved copy in-repo at
> `build/simple-flow/design2-2026-07-10/` (fonts + tooling metadata excluded —
> see that dir's `README.txt`).
> **Baselines compared against:** `build/simple-flow/design-notes.md` (original
> `Simple_Flow_Design.zip` catalog), `build/simple-flow/design-change-diff.md`
> (the 2026-07-08 `Simple_Flow_Design_1.zip` refresh), and
> `build/simple-flow/design-latest-catalog.md` (the 2026-07-09
> `a30380c8-Simple_Flow_Design_1.zip` bundle → prior unzip `/tmp/simple-flow-design-3/`).
> Scope: **INGEST + DIFF + PROPOSE only** — no case/Excel/TestRail/requirements/
> PROJECT-STATE edits.

## VERDICT: SAME — byte-identical re-delivery (NOT newer content)

A full recursive byte-level compare of this bundle against the prior 2026-07-09
bundle is **clean**:

```
diff -rq /tmp/simple-flow-design-3  /tmp/simple-flow/design2   →  exit 0, ZERO differences
```

Every one of the 134 entries (15 HTML, 3 MD, 4 JSX, 2 CSS, 2 top-level PNG,
6 `screenshots/` PNG, 45 `uploads/` PNG, 54 Inter TTF, `assets/symbol-primary.svg`,
`.design-canvas.state.json`, `.thumbnail`) is identical in name AND content to the
already-cataloged 2026-07-09 bundle. This is a **pure re-delivery** of the design
set already captured in `design-latest-catalog.md`, re-zipped under a new filename
(`..._Design_2.zip`). There is **no new, changed, or removed** design artifact.

For completeness, comparing against the older 2026-07-08 refresh
(`/tmp/simple-flow-design-2/`) shows exactly the deltas already recorded in
`design-latest-catalog.md` and nothing more:

```
diff -rq /tmp/simple-flow-design-2  /tmp/simple-flow/design2
  Only in .../design2/uploads: Screenshot 2026-07-08 at 17.00.26.png
  Only in .../design2/uploads: Screenshot 2026-07-08 at 17.06.49.png
  Files ... WO Review Flow.html differ
  Files ... .thumbnail differ
```

Those two 07-08 completion-modal screenshots and the `WO Review Flow.html` change
are **already in the baseline** (documented in `design-latest-catalog.md`). Nothing
in this 2026-07-10 delivery is new relative to that baseline.

## Counts (this bundle vs baseline)

| Category | 2026-07-10 bundle | Baseline (2026-07-09 catalog) | Delta |
|---|---|---|---|
| HTML mockups | 15 | 15 | 0 |
| MD handoffs | 3 | 3 | 0 |
| JSX | 4 | 4 | 0 |
| CSS | 2 | 2 | 0 |
| PNG — top-level | 2 | 2 | 0 |
| PNG — `screenshots/` | 6 | 6 | 0 |
| PNG — `uploads/` | 45 | 45 | 0 |
| Inter TTF fonts | 54 | 54 | 0 |
| `assets/symbol-primary.svg` | 1 | 1 | 0 |
| tooling metadata | 2 | 2 | 0 |
| **Total files** | **134** | **134** | **0** |

## Catalog (1-line per design file)

Design docs (HTML / MD / JSX / CSS) — unchanged from `design-notes.md`:

| File | 1-line description |
|---|---|
| `Simple Flow Design.html` | Master design canvas / index tying all artboards together. |
| `WO Review Flow.html` | Primary interactive prototype: completion wizard (Details→Receive→Success), optional review gate (Review→Reviewed→Complete), tech-story modal, parts receiving (Stories 2/3/4/15/16/17). |
| `WO Review Flow - Handoff.html` | HTML render of the WO review-flow developer handoff (mirrors the .md). |
| `WO Review Flow - Handoff.md` | Developer handoff for review & completion: 6 driving settings, WO state/badge table, completion wizard, review gate §7, 9-row case matrix, test IDs, open items. |
| `Resolve Cores Flow.html` | Interactive prototype for the Resolve-cores gate step (Details→Pick→Resolve cores→Receive→Complete); OK/Not-OK per core, live "+$ to invoice". |
| `Resolve Cores Flow - Handoff.md` | Developer handoff for the cores flow: step order, gate logic, line-level OK/Not-OK reuse, 12-row `?screen=` matrix, open items. |
| `Core Resolution.html` | Core-resolution UI detail (OK·returned / Not-OK·keep+charge), inline line-level toggle + resolved chips. |
| `Resolve Cores to Invoice.html` | Optional-invoice Create-Invoice gate resolve module (route to receive cored line → resolve → invoice proceeds). |
| `Pick Parts Step.html` | Auto-pick-off pick step in the completion modal (Pick all from default bins / Review individually). |
| `Pick Parts + Cores.html` | Combined pick + inventory-core-resolution step. |
| `Inventory & Cores - Overview.html` | Overview screen tying inventory picking and core handling together. |
| `Workflow Settings.html` | Story 1 (SV-7696) Workflow settings page — 6 setting cards + Create-POs / vendor-invoice subsection (v1). |
| `Workflow Settings v2.html` | Revised v2 Workflow Settings page — fuller admin sidebar; surfaces vendor-invoice Required-state copy. |
| `Purchase Orders List.html` | PO multi-select list (Story 7). |
| `Purchase Order Details.html` | PO detail — Receive / Vendor-Missing surface. |
| `Receive Vendor Parts - v2.html` | Bulk / Accept-Delivery receive screen grouped by vendor (invoice #, qty/cost/sell, assign-vendor) — Stories 7/8/9. |
| `Work Orders List.html` | Work Orders list — "Waiting on Parts" column, Create-Work-Order button, Ready-for-Review affordances (Stories 14/15). |
| `HANDOFF.md` | Workflow-settings developer handoff — 6 setting cards + defaults (Auto-approve ON, Create-POs ON, vendor-invoice Optional-default; omits Require-review toggle). |
| `design-canvas.jsx` / `components.jsx` / `PODetails.jsx` / `po-data.jsx` | React source powering the canvas/prototypes (not test-relevant). |
| `colors_and_type.css` / `po-details.css` | ShopView design-system tokens + PO-detail styles (not test-relevant). |

PNGs — top-level (2): `check-wizard.png` (completion-wizard check step),
`workflow-screenshot.png` (workflow-settings capture). `screenshots/` (6):
`combined-2-4.png`, `combined-4.png`, `cores-p2.png`, `cores-p2b.png`,
`cores-p2c.png`, `overview-full.png` — composite/cores/overview reference captures.
`uploads/` (45): dated POC/live captures 2026-05-19 … 2026-07-08; the three most
recent (`2026-07-08 at 16.57.07 / 17.00.26 / 17.06.49`) are the Review-confirm
dialog and the two "Complete & Send to Review" completion-modal screenshots —
**all three already cataloged in the baseline.**

Design-system assets (not test-relevant, EXCLUDED from the repo copy):
54 Inter TTF fonts (`fonts/`) + `assets/symbol-primary.svg` + `.design-canvas.state.json`
+ `.thumbnail`.

## Substantive design changes vs baseline

**NONE.** No new screens, no removed screens, no changed layouts/labels/states,
no trivial re-exports beyond the whole-bundle re-zip. The delivery is
bit-for-bit identical to the design already ingested on 2026-07-09.

## Affected test cases (PROPOSAL)

**NONE.** Because there is zero new/changed design content, no SF-* case needs an
expected-result or precondition change on account of this delivery. All prior
design-driven observations already stand as recorded (see
`design-latest-catalog.md` and `design-change-diff.md`); this bundle neither adds
to nor retracts any of them.

## Open questions this design resolves

**NONE newly resolved by this delivery.** Because it is identical to the 2026-07-09
bundle, it cannot answer anything the baseline didn't already show. Explicitly,
against the currently-open Round-3 PO questions and open design tensions:

| Open item | Resolved by this bundle? | Note |
|---|---|---|
| Round-3 Q1 — review/approval required before invoicing (distinct Reviewed state) | **No** | Design shows the review gate exists, but does not settle whether it is mandatory / gates invoicing. Still a PO decision. |
| Round-3 Q2 — Require-Review default ON/OFF for new orgs | **No** | `HANDOFF.md` still omits the "Require review before completion" toggle (settings-default gap #3 remains OPEN). |
| Round-3 Q3 — close/cancel confirmation modal (was "still to be added") | **No** | No confirm-modal artboard is present in this bundle; the modal remains "to be added". Still a PO decision. |
| Round-3 Q4 — vendor-missing group ordering (top vs bottom) | **No** | `Receive Vendor Parts - v2.html` is unchanged; the vendor-missing ordering ambiguity stands. Still a PO decision. |
| Round-3 Q5 — $0 sell price allowed at completion vs spec S5-R1 | **No (unchanged tension)** | The `2026-07-08 17.06.49` "$0.00 sell — no action needed to continue" screenshot is already in the baseline; it is NOT new here, so it neither newly resolves nor newly creates the S5-R1 tension. Remains the same open re-VIU / PO item already flagged in `design-latest-catalog.md`. |
| Round-3 Q6 — who may add a vendorless part (See-Financial-Data gate) | **No** | No design change bearing on the permission gate. Still a PO decision. |
| Review / Reviewed-state flow | **No** | Same `WO Review Flow` prototype as baseline; behavior already cataloged; live VIU deviations #3/#4 stand as build gaps. |

Net: do **not** drop or pre-answer any Round-3 PO question on the strength of this
delivery — it introduces no new information.

## Bottom line

This 2026-07-10 upload is a **re-delivery of the identical 2026-07-09 design
bundle** (byte-for-byte). Verdict: **SAME, not newer.** 0 new / 0 changed / 0
removed design docs; 0 case impacts proposed; 0 open questions resolved. The files
are preserved at `build/simple-flow/design2-2026-07-10/` for the record; no
downstream action is warranted.
