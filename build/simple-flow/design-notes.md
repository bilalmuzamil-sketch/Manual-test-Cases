# Simple Flow — Design Assets Catalog

> **Source zip:** `9a899fa3-Simple_Flow_Design.zip` → unzipped to
> `/tmp/simple-flow-design/` (ephemeral; re-unzip if the sandbox resets).
> Design set = "Simple Flow Design (Claude Design)" · QA env **sv7301 (POC)**.
> Design handoffs reference **Spec V1.4** (note: product .doc header says V2.3 —
> version drift; see requirements.md gap #2).

## Contents summary

- **15 HTML mockups/prototypes** (interactive screens — several are the source of
  truth prototypes referenced by the handoffs).
- **3 Markdown developer handoffs** (`HANDOFF.md`, `WO Review Flow - Handoff.md`,
  `Resolve Cores Flow - Handoff.md`).
- **4 JSX files** (`design-canvas.jsx`, `components.jsx`, `PODetails.jsx`,
  `po-data.jsx`) — React source powering the canvas/prototypes.
- **2 CSS files** (`colors_and_type.css` = ShopView design system tokens;
  `po-details.css`).
- **~50 PNG screenshots** (2 top-level, 42 in `uploads/`, 6 in `screenshots/`) —
  reference captures of live/POC screens (see note below on VIU value).
- **54 Inter font TTFs** (`fonts/`) + `assets/symbol-primary.svg` — design-system
  assets, not test-relevant.
- `.design-canvas.state.json`, `.thumbnail` — tooling metadata.

## HTML mockups — per-file (title + what it shows)

| File | Title | Screen / UI it depicts |
|---|---|---|
| `Simple Flow Design.html` | Simple Flow Design — ShopView | Master design canvas / index tying all artboards together (the "Simple Flow Design" referenced throughout the spec's UI/UX lines). |
| `WO Review Flow.html` | Work Order — Review Flow | **Primary interactive prototype** for Stories 2/3/4 + 15 + 16 + 17: the completion wizard (Details → Receive → Success), the optional review gate (Review → Reviewed → Complete), tech-story modal, and parts receiving. Driven by a bottom-right Prototype settings panel. Source of truth per `WO Review Flow - Handoff.md`. |
| `WO Review Flow - Handoff.html` | WO Review & Completion Flow — Developer Handoff | HTML render of the review-flow handoff doc (same content as the .md). |
| `Resolve Cores Flow.html` | Resolve Cores — Completion Flow | Interactive prototype for the **Resolve cores** gate step inside the completion wizard (Details → Pick → Resolve cores → Receive → Complete); OK/Not OK per core, progress + live "+$ to invoice"; `?screen=` deep links per the handoff case matrix. Stories 3/4/16. |
| `Core Resolution.html` | Core Resolution — ShopView Simple Mode | Core resolution UI detail (OK · returned / Not OK · keep + charge), inline line-level toggle + resolved chips. |
| `Resolve Cores to Invoice.html` | Resolve Cores to Invoice | The optional-invoice **Create Invoice gate** resolve module (S3-C3/C4): route to receive the cored line → resolve → invoice proceeds; "cores pending" indicator. |
| `Pick Parts Step.html` | Pick Parts Step — Complete Work Order | The auto-pick-off pick step in the completion modal (Pick all from default bins / Review individually). Stories 2/3/4 (S*-R2). |
| `Pick Parts + Cores.html` | Pick parts + cores — Combined inventory step | Combined pick + inventory-core-resolution step (Pick then Resolve inventory cores). |
| `Inventory & Cores - Overview.html` | Inventory & Cores — Full Overview | Overview screen tying inventory picking and core handling together. |
| `Workflow Settings.html` | Workflow Settings - Shopview | **Story 1 (SV-7696)** Work Order / Workflow settings page — the 6 setting cards with toggles + Create-POs vendor-invoice subsection. |
| `Workflow Settings v2.html` | Workflow Settings - Shopview | Revised (v2) Workflow Settings page — later iteration of the settings design. |
| `Work Orders List.html` | Work Orders — Completed | **Story 14/15** Work Orders list: "Waiting on Parts" column, "Create Work Order" button, Ready-for-Review queue affordances. |
| `Purchase Orders List.html` | Purchase Orders | **Story 7 (SV-7702)** PO list with multi-select (select-all + per-PO checkboxes), "N selected" bar, Clear, Receive Selected; Vendor Missing indication. |
| `Purchase Order Details.html` | Purchase Order Details — Receive | **Story 6/11** PO detail card with the Receive action on WO-originated POs + Vendor Missing flag / resolve options. |
| `Receive Vendor Parts - v2.html` | Receive Vendor Parts | **Story 8/12 (Bulk Receive / Accept Delivery)** receive screen: grouped by vendor, per-vendor expand/collapse, invoice #, apply-invoice, qty/cost/sell field locking, assign-vendor for vendor-missing. |

## Markdown handoffs — key contents

- **`HANDOFF.md`** — *Workflow Settings Page implementation guide* (Story 1). Full
  layout, 6 setting cards with ON/OFF state copy, toggle CSS, Save button, and
  **default states**. ⚠️ **Design defaults contradict the spec:** design shows
  **Auto-approve ON, Create POs ON, Vendor invoice = Optional (default), Tech
  Story OFF, Mileage OFF, Engine Hours OFF, Auto-pick ON.** Spec §4/S1 says
  Auto-approve OFF and Vendor invoice REQUIRED. Design's settings list also
  **omits "Require review before completion" (S1-R4)**. Resolve before writing
  settings cases.

- **`WO Review Flow - Handoff.md`** — source of truth for the completion wizard,
  review gate, tech-story flow, receiving. Includes: 6 org settings that drive the
  flow; WO states/badges table; tech-story modal behavior; completion wizard step
  table (Details → Receive → Success); Details review-mode split (review on =
  mileage + hours only, VIN at Mark Reviewed); parts/receiving optional vs
  required; review sign-off; **full 9-row case matrix** (review × PO × invoice ×
  fields × story); **element test IDs** (`input_tech_story`,
  `button_mark_reviewed`, `input_review_vin`, `input_review_note`,
  `button_confirm_review`); and an **"Open items / not yet built"** list (tech-
  story placement confirm; close/cancel confirmation design pending; Story 4
  inline invoice entry + delete-line-from-modal not built [routes to receive page
  instead]; Require-review & VIN toggles not yet in Workflow Settings; Story 16
  "Ready for Review" queue).

- **`Resolve Cores Flow - Handoff.md`** — source of truth for the **Resolve
  cores** gate step. Step order (Details → Pick → Resolve cores → Receive →
  Complete); what the step does (lists only cores, grouped Inventory / Special-
  order, OK/Not OK, live "+$ to invoice"); blocking logic (Continue disabled until
  all resolved; also gates the optional "Complete Without Receiving"); reuse of the
  line-level OK/Not OK; prototype panel mapping; a **12-row case matrix** with
  `?screen=` deep links; open items (wire to real core data model; whether special-
  order cores need a vendor-return reference; option copy; surface unresolved-core
  count on the WO action bar).

## JSX / CSS / assets

- `design-canvas.jsx` (~53 KB) — the React canvas assembling all artboards.
- `components.jsx` (~11 KB) — shared UI components used by the prototypes.
- `PODetails.jsx` (~12 KB) + `po-data.jsx` (~4 KB) + `po-details.css` — Purchase
  Order details/receive screen source + mock data.
- `colors_and_type.css` (~15 KB) — ShopView design tokens (colors, type). Primary
  blue `#257CFF`, grey scale, Inter font family.
- `assets/symbol-primary.svg`, `fonts/*` (54 Inter TTFs) — brand assets.

## Screenshots (PNG) — ~50 files

- **Top-level:** `check-wizard.png` (completion wizard capture),
  `workflow-screenshot.png` (settings page capture).
- **`screenshots/`** (6): `overview-full.png`, `combined-2-4.png`, `combined-4.png`,
  `cores-p2.png`, `cores-p2b.png`, `cores-p2c.png`, `cores-p2c.png` — composed
  captures of the cores/pick flows.
- **`uploads/`** (42): dated `Screenshot 2026-05-19 … 2026-07-06 …` PNGs —
  reference captures of live/POC ShopView screens gathered during design (WO,
  receiving, cores, PO, settings). Filenames are timestamps only; open individually
  in a viewer if a specific screen needs confirming during VIU. Not individually
  described here (timestamp names carry no semantic label).

## Design ↔ story coverage (quick map)

- Story 1 (Settings): `Workflow Settings.html`, `Workflow Settings v2.html`,
  `HANDOFF.md`, `workflow-screenshot.png`.
- Stories 2/3/4 (Completion): `WO Review Flow.html` + handoff, `Pick Parts
  Step.html`, `check-wizard.png`.
- Stories 3/4/8/16 (Cores): `Resolve Cores Flow.html` + handoff,
  `Core Resolution.html`, `Resolve Cores to Invoice.html`, `Pick Parts +
  Cores.html`, `Inventory & Cores - Overview.html`, `screenshots/cores-*`.
- Story 6/7/11 (POs): `Purchase Orders List.html`, `Purchase Order Details.html`.
- Stories 8/9/10/12/13 (Receiving): `Receive Vendor Parts - v2.html`,
  `PODetails.jsx`.
- Stories 14/15 (List/UX): `Work Orders List.html`.
- Story 16 (Review): `WO Review Flow.html` + handoff.
- Story 17 (Tech story): `WO Review Flow.html` + handoff (tech-story modal).

## Design gaps / not-yet-built (from handoffs)

- Close-vs-Cancel confirmation (S15-R4) — **design pending**.
- Require-review + VIN-required toggles — **not yet on the Workflow Settings
  page** (live only in the prototype panel).
- Story 4 inline invoice entry inside the required-invoice modal +
  delete-line-from-modal — **not built** (routes to receive page instead).
- Story 16 "Ready for Review" queue (list filter/column) — pending.
- Tech-story placement (modal vs on-the-line) — **confirm** (Story 17 vs S15-R2).
- Settings design defaults conflict with spec defaults (see `HANDOFF.md` note).

---

## Design update (from Simple_Flow_Design_1.zip)

> **Ingested 2026-07-08** from `Simple_Flow_Design_1.zip`
> (→ `/tmp/simple-flow-design-2/`). Full delta table + case-impact proposals live
> in `build/simple-flow/design-change-diff.md`. **This bundle is a REFRESH /
> re-export of the same design set, not a design change.**

**What's the same (verified):**
- **Filename set is identical** to the original catalog above — all 15 HTML
  mockups, 3 MD handoffs, 4 JSX, 2 CSS present; **0 new / 0 removed** design docs.
- The **3 MD handoffs are content-consistent** with the descriptions above: same
  6 driving/settings toggles + same defaults (Auto-approve ON, Create-POs ON,
  Vendor-invoice **Optional** default, Tech/Mileage/Engine OFF, Auto-pick ON,
  "Require review" still omitted from the settings page), same WO state/badge
  table, same completion-wizard + review-gate + tech-story-modal behavior, same
  Resolve-cores step order and gate logic, same 9-row and 12-row case matrices,
  same element test IDs, same open-items lists.
- Key HTML surfaces render the same screens: **Workflow Settings v1** (6 cards,
  Optional/Required vendor-invoice radios, no Require-review toggle);
  **Workflow Settings v2** (fuller admin sidebar; surfaces the vendor-invoice
  **Required** state copy "Advisors must enter vendor invoice number before
  completing WO"; still no Require-review toggle); **Work Orders List**
  ("Waiting On Parts" column + "Create Work Order"); **Receive Vendor Parts - v2**
  (Bulk / Accept-Delivery, grouped by vendor); **Purchase Orders List / Details**;
  **Resolve Cores** family.
- All zip entries share one export timestamp (2026-07-08 14:59), so mtime cannot
  flag individual edits; pixel-level HTML/PNG tweaks can't be ruled out, but
  **no semantic/behavioral change was found**, so no cases are impacted.

**What's new:**
- **1 new screenshot** — `uploads/Screenshot 2026-07-08 at 16.57.07.png` (upload
  count 42 → 43; dated after the prior range end of 2026-07-06). It captures the
  **Review "Mark work order reviewed" confirm dialog** (artboard "9 · Review —
  Confirm sign-off dialog, 9/12"): **VIN / Serial # (REQUIRED)** + **Review note
  (optional)** + Cancel / **Confirm Reviewed** (disabled until VIN); WO shows a
  `Review` badge and an amber "Ready for Review" banner. This **confirms** the
  optional-review-note field and the VIN-required-at-review behavior already
  documented in `WO Review Flow - Handoff.md` §7 (test IDs `input_review_vin`,
  `input_review_note`, `button_confirm_review`) and already reflected in SF-REV /
  SF-VAL cases — so **NO case change** is needed.

**Still open (unchanged by this bundle):** the settings-default conflict (gap #3)
and the four VIU deviations (missing Create-POs toggle, always-enabled Save,
missing optional review note **on live**, review→Complete jump) all persist — the
07-08 screenshot confirms the review note is intended by design, so its live
absence remains a build gap, not a design change.
