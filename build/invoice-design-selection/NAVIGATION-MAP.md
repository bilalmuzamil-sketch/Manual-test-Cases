# Invoice Design Selection — NAVIGATION MAP (observed, not guessed)

Observed live on **sv9872**, build **v26.36.2-12974d6**, 2026-09-11. Evidence:
`build-verify-2026-09-11/evidence/P03-invoice-tab.png`, `P03-options.png`, `P03.json`.

| To reach | The clicks | Route it lands on |
|---|---|---|
| **The Invoice Design setting** | the menu behind your name → **Settings** → the **Invoice** tab across the top of the page | `/administration/settings` — **the route does NOT change when you switch tabs** |

The Settings page has **three tabs across the top**: **Organization · Invoice · Work Orders**.
Invoice Design is the **first control on the Invoice tab**.

## What is on it, read off the screen

| Thing | Exactly as displayed |
|---|---|
| Control label | **Invoice Design** |
| Value when first seen | **Legacy** |
| The two choices | **Modern** · **Legacy** (one tick, on the selected one) |
| Helper text under it | *"Every estimate, invoice and credit invoice your shop shows, prints or sends uses the selected design, including documents created before you changed it."* |

⚠️ That helper text describes a **LIVE SWITCH** — documents created before the change follow the new
design too. That matches the rewrite the 12 withdrawn cases were withdrawn for, and contradicts the
capture-at-creation and back-catalogue-pinning model in the Rev 3 extraction. Treat Rev 3's Stories 2
and 4 as superseded until the current spec is re-read.

## 🛑 THE TRAP THAT COST THREE PROBES HERE

**The tabs across the top of Settings are a surface of their own, and none of the usual selectors find
them.** On this page:
- `a.q-item`, `.q-drawer a`, `.q-list a` enumerate the LEFT SIDEBAR only — and on this page returned
  **0 rows**, so a "walk every row" loop walked nothing and reported nothing found.
- `[role=tab]`, `.q-tab` returned the sidebar's own container text, not the three tabs.
- Guessed routes (`/administration/invoice-settings`, `/finance`, `/documents`, `/organization`,
  `/app`) all render a 2-control not-found page that looks like an empty settings page.
- **Grepping the shipped code before clicking the tab finds nothing** — the tab's code is loaded only
  when the tab is clicked, so "the words are not even in the build" was false.

**What works:** click by visible text — find the element whose trimmed `innerText` is exactly
`Invoice` and click it. Then read the control from the `.q-field` whose text contains "Invoice Design",
taking the label from `.q-field__label` and the value from its `input`.
