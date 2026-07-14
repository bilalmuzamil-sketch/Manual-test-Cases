# Simple Flow — Design bundle #4 (preserved) — 2026-07-14

**Project:** Simple Flow ONLY (Epic SV-7301, PO = Milos, app `sv7301.qa.shopview.com`).

**Source:** `49bdacbe-Simple_Flow_Design_4.zip`
(upload dir `/root/.claude/uploads/dd1d42ba-…/`, uploaded 2026-07-14).
Unzipped to `/tmp/simple-flow/design4/` (135 files) and preserved here.

## Preservation note
- **`fonts/` (54 Inter TTF files) EXCLUDED** to avoid font bloat.
- **`.thumbnail`** (binary canvas thumbnail) and **`.design-canvas.state.json`**
  (editor state) EXCLUDED.
- Everything else preserved verbatim: 79 files (HTML mockups, MD hand-offs, JSX,
  CSS, PNG screenshots, `assets/`, `screenshots/`, `uploads/`).

## Verdict vs the prior bundle (design #3, `2f9d4f23-Simple_Flow_Design_3.zip`)
**NEWER — genuinely changed (NOT a byte-identical re-delivery).** `diff -rq` of the
full unzip (design #3 vs design #4) shows:

| Change | File | What changed |
|---|---|---|
| CHANGED | `Resolve Cores to Invoice.html` | Completion core-modal copy reworked. OLD: *"Completion isn't blocked — only the invoice is held until every core is resolved."* NEW: *"Receiving was optional at completion. A core charge can't be settled until its part is back — receive each one below, then mark Return or Keep to invoice."* Info line changed to *"Not received yet — receive this part to settle its core."* |
| CHANGED | `WO Review Flow.html` | New completion-wizard logic: a **waiting returnable-core part can no longer be skipped** — the **Skip button is DISABLED** with tooltip *"Receive the core part first — its core charge must be settled before you can complete."* plus a **Receive Parts** button; new `coresWaiting()` / adaptive `waitingTitle()`/`waitingDesc()`; new `.wiz-note-core` warning-card styling; sample data now includes a reman-alternator core line. |
| CHANGED (binary) | `.thumbnail` | canvas thumbnail re-render (excluded here) |
| NEW | `uploads/Screenshot 2026-07-13 at 16.50.33.png` | new screenshot (net-new file) |

All other 130 files are byte-identical to design #3.

## Case impact (proposal — see `spec-diff-2026-07-14.md` §B)
The core-blocking change affects the **core-at-completion** cases (SF-CORE-*, the
special-order-core-required path, and the Story-3/4 completion wizard cases that
assert "Complete Without Receiving" / skip behavior). Design now indicates a
**waiting special-order core cannot be skipped at completion** — re-VIU when
sv7301 cookies are refreshed.
