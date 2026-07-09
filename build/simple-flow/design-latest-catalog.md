# Simple Flow — Design Latest Catalog (bundle 3 vs prior)

> **New bundle:** `a30380c8-Simple_Flow_Design_1.zip` → unzipped to
> `/tmp/simple-flow-design-3/` (2026-07-09; ephemeral — re-unzip if the sandbox
> resets). **Baselines:** `build/simple-flow/design-notes.md` (catalog from the
> ORIGINAL `Simple_Flow_Design.zip`) and `build/simple-flow/design-change-diff.md`
> (the prior refresh `Simple_Flow_Design_1.zip` → `/tmp/simple-flow-design-2/`,
> 2026-07-08). This is a filename/count diff + inspection of only the genuinely
> new artifacts (all zip entries share one export timestamp, so mtime can't flag
> per-file edits). **INGEST + DIFF + PROPOSE only** — no case/Excel/TestRail edits.

## Counts (this bundle)

| Category | This bundle | Prior refresh (design-change-diff) | Delta |
|---|---|---|---|
| HTML mockups | 15 | 15 | 0 |
| MD handoffs | 3 | 3 | 0 |
| JSX | 4 | 4 | 0 |
| CSS | 2 | 2 | 0 |
| PNG — top-level | 2 | 2 | 0 |
| PNG — `screenshots/` | 6 | 6 | 0 |
| PNG — `uploads/` | **45** | 43 | **+2** |
| Inter TTF fonts | 54 | 54 | 0 |
| `assets/symbol-primary.svg` | 1 | 1 | 0 |
| `.design-canvas.state.json` / `.thumbnail` | 2 | 2 | 0 |
| **Total files** | **134** | 132 | **+2** |

## NEW files (only genuinely new artifacts)

Both new files are `uploads/` PNG screenshots dated **2026-07-08**, later than the
prior refresh's single new capture (`...16.57.07.png`). They are captures of the
**Review-ON "Complete & Send to Review" completion modal** (Story 16 / SV-7870):

| File | What it shows | Bears on cases |
|---|---|---|
| `uploads/Screenshot 2026-07-08 at 17.00.26.png` | **"Complete & Send to Review"** modal, step **Details → Receive parts & invoice**. Info card **"2 parts waiting to receive — You can receive parts later from the purchase orders page."** Note: **"Inventory parts are picked automatically when the work order is completed."** Actions: **Back · Receive Parts · Send to Review**. | SF-REV-* (Send-to-Review flow), SF-COMP-* (Story 3/4 receive-later), SF-WOP-* (waiting-to-receive count). |
| `uploads/Screenshot 2026-07-08 at 17.06.49.png` | Same modal, **"1 part has no sell price"** warning: *"These parts will show as $0.00 on the invoice. **No action is needed to continue** — you can close this and set a sell price from the line items whenever you're ready."* Lists `(-) license plate light bulb · Line 2`. Actions unchanged. | **⚠️ SF-VAL-* / SF-VPART-* / Story 5.** See conflict note below. |

## CHANGED / REMOVED

- **CHANGED (content):** none materially detectable. The 15 HTML surfaces, 3 MD
  handoffs (`HANDOFF.md`, `WO Review Flow - Handoff.md`, `Resolve Cores Flow -
  Handoff.md`), 4 JSX, 2 CSS are the same filenames + (spot-checked) same content
  as `design-notes.md` / `design-change-diff.md` describe. `HANDOFF.md` still lists
  the same 6 setting cards with **Auto-approve ON / Create-POs ON / Vendor-invoice
  Optional-default** and still **omits the "Require review before completion"
  toggle** (the settings-default conflict — design-notes gap #3 — remains OPEN).
- **REMOVED:** none.

## ⚠️ New conflict surfaced by `...17.06.49.png` (PROPOSAL — do not edit cases)

The screenshot shows a part with **no sell price** being allowed to **continue**
completion ("No action is needed to continue… set a sell price later"), i.e.
**sell price OPTIONAL at completion, warned-not-blocked**.

This is in **tension** with the LATEST spec V2.4 **Story 5 (S5-R1)**: *"Sell price
is validated **at save** — the part cannot be saved/closed without it (inline
error), **not deferred to completion**."*

- Both artifacts are dated 2026-07-08, so last-update-wins does not cleanly settle
  it. Two readings are compatible: (a) sell is enforced **when adding the part**
  (S5-R1, save-time), and (b) the completion modal only *warns* about legacy parts
  that predate the enforcement. But the screenshot copy ("close this and set a sell
  price from the line items whenever you're ready") reads as a genuine **skip**,
  which would contradict S5-R1 if it applies to newly-added parts.
- **Proposed action (for the case-owning worker):** treat as an **open
  question / re-VIU item** for **SF-VAL-*** (sell-price validation) and
  **SF-VPART-*** (vendorless part add). Confirm on sv7301 whether sell price is
  blocked at part-save (S5-R1) or merely warned at completion (this screenshot).

## Bottom line

This bundle is a **design refresh**, not a design change: **0 new/changed/removed
design docs**; the only additions are **2 Story-16 completion-modal screenshots**.
No design-driven case rewrites are proposed. The 07-06.49 "$0.00 sell / continue"
screenshot is the one item worth a re-VIU vs Story 5, flagged above as a proposal.
