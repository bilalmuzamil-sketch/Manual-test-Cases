# Simple Flow — Design bundle 2026-07-17 (`68650a5d-Simple_Flow_Design.zip`) — inventory + verdict

> **Project:** Simple Flow ONLY (Epic SV-7301, PO = Milos, app `sv7301.qa.shopview.com`).
> **Input:** `/root/.claude/uploads/dd1d42ba-2c47-5229-9b17-b8f94e3eb99a/68650a5d-Simple_Flow_Design.zip`
> (uploaded 2026-07-17 alongside the `_4` spec doc; md5 `3496d809eee59663d1ddcea220d6c7bd`).
> Extracted to `/tmp/sf-design-new/`. Baseline compared: a fresh full unzip of
> `49bdacbe-Simple_Flow_Design_4.zip` (the 2026-07-14 design `_4`, md5
> `92ecd65af123c94a6de6e9bf9294be85`) to `/tmp/sf-design-4-ref/`.

## Verdict: CONTENT-IDENTICAL RE-DELIVERY of design `_4` — ZERO new/changed design files

**Method (complete population per Standing Rule 17):** both zips fully extracted; per-file
md5 computed for **ALL 135 files in each** (`find -type f -exec md5sum`, sorted, diffed).
**Result: `diff` of the two md5 manifests is EMPTY — all 135 files byte-identical**, same
paths, no additions, no deletions. The two ZIP containers differ only in archive metadata
(same 14,141,003-byte size, different zip-level md5) — the *contents* are the same bytes.

This mirrors the earlier byte-identical re-delivery precedents (design `_2` 2026-07-10;
Filters "ZIP=final" ruling 2026-07-17): a re-share is **not** an update. **No image
re-capture needed** — every file is already catalogued by the 2026-07-14 design `_4` pass
(`design-diff` in `spec-diff-2026-07-14.md` §B; preserved bundle
`build/simple-flow/design4-2026-07-14/`; earlier catalogs `design-notes.md`,
`design-latest-catalog.md`, `design3-2026-07-13/`).

## Inventory (135 files: 81 content files + 54 font files)

Content files (excl. `fonts/` — 54 Inter .ttf files, unchanged):

```
.design-canvas.state.json          .thumbnail
Core Resolution.html               HANDOFF.md
Inventory & Cores - Overview.html  PODetails.jsx
Pick Parts + Cores.html            Pick Parts Step.html
Purchase Order Details.html        Purchase Orders List.html
Receive Vendor Parts - v2.html     Resolve Cores Flow - Handoff.md
Resolve Cores Flow.html            Resolve Cores to Invoice.html
Simple Flow Design.html            WO Review Flow - Handoff.html
WO Review Flow - Handoff.md        WO Review Flow.html
Work Orders List.html              Workflow Settings v2.html
Workflow Settings.html             assets/symbol-primary.svg
check-wizard.png                   colors_and_type.css
components.jsx                     design-canvas.jsx
po-data.jsx                        po-details.css
screenshots/ (6 png)               uploads/ (44 Screenshot png, 2026-05-19 → 2026-07-13)
workflow-screenshot.png
```

(44 `uploads/` screenshots + 6 `screenshots/` pngs enumerated in `/tmp/design-inventory.txt`
during the compare; latest upload remains `Screenshot 2026-07-13 at 16.50.33.png`, the file
that was net-new in design `_4`.)

## What changes anyway — the spec `_4` STORY-18 LENS on the (unchanged) design

Although zero design files changed, the **spec `_4` Story 18 (SV-8353)** re-weights which
of the already-present design files is operative for cores, and exposes one stale branch:

1. **`Resolve Cores Flow.html` + `Resolve Cores Flow - Handoff.md` are now the operative
   core design** (Story 18's "dedicated resolve screen"). The handoff specifies the wizard
   step order `Details → Pick parts → Resolve cores → Receive → Complete`, the
   Resolve-cores step listing only core parts (Inventory + Special order groups, OK ·
   returned / Not OK · keep + charge, "N / M resolved" progress + "+$X to invoice" running
   total), Continue disabled until all cores decided, inline-line and wizard decisions
   sharing one state (step skipped if all resolved inline). Its optional-flow note —
   *"Because cores are resolved **before** Receive, the Receive step's 'Complete Without
   Receiving' is safe to leave unblocked"* — **matches Story 18 C-R1/C-R4 exactly**
   (gate only on UNDECIDED cores).
2. **STALE BRANCH vs spec `_4` C-R6:** `Resolve Cores Flow.html` line ~708-716 codes the
   **required-invoice** flow as *"Resolve cores comes AFTER Receive"* (steps push `receive`
   before `cores`). Spec `_4`'s 2026-07-16 change-log row unifies BOTH flows to
   **resolve-before-receive** (Story 18 C-R6). **Last-update-wins: the spec (2026-07-16)
   overrides this design branch (content dated ≤2026-07-14).** Flag for Milos/design
   cleanup; test cases follow the spec.
3. **`Resolve Cores to Invoice.html` / `WO Review Flow.html` (the two files that drove the
   2026-07-14 SF-CORE-03 flip — `coresWaiting()` disabling Complete Without Receiving with
   the "Receive the core part first…" tooltip) are likewise superseded on that point** by
   Story 18: completion is blocked only for **undecided** cores; once a core is pre-resolved
   the Complete-without-receiving path proceeds (C-R4), and the invoice-gate
   resolve-module/receive-first routing is replaced by pre-resolve (C-R1/C-R5).
   SF-CORE-03's current design-`_4`-worded expected result therefore needs the Story-18
   reword (see `spec-diff-v4-2026-07-17.md` §A Δ8 / §D1).

**Bottom line:** the design zip adds NOTHING new; all design-side case impact this round is
driven by the spec `_4` text (Story 18 reinterpreting existing design files), not by any
design-file change.
