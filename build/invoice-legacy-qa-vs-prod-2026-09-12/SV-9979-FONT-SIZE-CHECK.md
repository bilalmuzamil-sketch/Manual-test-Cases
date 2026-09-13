# SV-9979 — "Legacy text renders ~2px larger" — measurement run, 2026-09-13

Nothing was posted to Jira. Nothing was changed on production (proof below).

## Build markers, read live at the start of this run

| Environment | Marker | Note |
|---|---|---|
| `sv9901.qa.shopview.com` | `v26.35.10-7b9a47d` | the ORIGINAL legacy build — Chris's own reference ("byte-identical to v26.35.10") |
| `app.shopview.com` | `v26.36.4-3e1c643` | unchanged from yesterday |
| `sv9872.qa.shopview.com` | unreachable | branch torn down |

## 1. How the Legacy document sizes its text — read from the live document

Fetched live: `GET /api/invoices/preview?invoice_id=…&type=html` from sv9901 (Legacy).
The template declares **exactly six** font sizes, and **five of the six are `rem`**:

| CSS rule | Size | Scales with root? | What it covers |
|---|---|---|---|
| `.info-title-new` | **1.2rem** | YES | shop name, Bill To, Remit payment to |
| `.info-text-new` | **0.9rem** | YES | address lines |
| `.totals-new` | **0.8rem** | YES | money summary |
| `.work-summary-table-new` | **0.8rem** | YES | Description / Quantity / Rate / Amount **cells** |
| `.disclaimer-font` | **0.54rem** | YES | small print |
| `.custom-table` | **14px** | **NO — fixed** | **Unit / VIN / Asset / Mileage row, Service Order / Terms / Due date row, column headings** |

There is **no `html { font-size }` rule anywhere in the document**. The only base declared is
`@page { font-size: 0.8rem }` — a paged-media rule, which the PDF renderer honours and a **browser
ignores**. So on screen the root is whatever the hosting context gives it.

## 2. The two surfaces measured

**PDF (both builds, files captured 2026-09-12):**

| | QA v26.35.10 | Production v26.36.4 |
|---|---|---|
| Sizes present | 6.48 / 9.6 / 10.5 / 10.8 / 14.399 pt | 6.48 / 9.6 / 10.5 / 10.8 / 14.399 pt |
| Font files | Nunito-Sans, Nunito-Sans-Bold | Nunito-Sans, Nunito-Sans-Bold |

Identical. The rem sizes resolve against a **16px / 12pt root** in print (0.8 × 12 = 9.6 ✓,
1.2 × 12 = 14.4 ✓, 0.9 × 12 = 10.8 ✓, 0.54 × 12 = 6.48 ✓) and `.custom-table` 14px = 10.5pt ✓.

**Screen (Legacy document rendered in Chromium, viewport 1280×1400, zoom 1, deviceScaleFactor 1):**

| Element | Screen | PDF | PDF converted (pt × 4/3) |
|---|---|---|---|
| `.info-title-new` (Bill To) | 19.2px | 14.399pt | 19.2px ✓ |
| `.info-text-new` (address) | 14.4px | 10.8pt | 14.4px ✓ |
| `.custom-table` (Service Order, Unit/VIN, col heads) | 14px | 10.5pt | 14.0px ✓ |
| `.totals-new` | 12.8px | 9.6pt | 12.8px ✓ |
| `.disclaimer-font` | 8.64px | 6.48pt | 8.64px ✓ |
| "Description" cell | 12.8px | 9.6pt | 12.8px ✓ |

Root font size measured: **16px**. Screen and print agree on **every single size**.

## 3. What this means for the report

A root-em change of **14px → 16px** produces almost exactly the reported shift:

| Element | root 14px | root 16px | Δ |
|---|---|---|---|
| 1.2rem (Bill To, shop name) | 16.8px | 19.2px | **+2.4px** |
| 0.9rem (addresses) | 12.6px | 14.4px | **+1.8px** |
| 0.8rem (totals, line cells) | 11.2px | 12.8px | **+1.6px** |
| 0.54rem (disclaimer) | 7.56px | 8.64px | +1.1px |
| **14px `.custom-table`** | **14px** | **14px** | **0 — unchanged** |

**THE DISCRIMINATOR, and it is a one-minute check:** measure the **"Service Order" heading** on both.

- If it is **14px on both** → the cause is the **root font size** of the hosting context, and only the
  rem-based text moved. The Service Order row, the Unit/VIN row and the column headings did **not**
  change, whatever the eye says.
- If it **differs** → the cause is **whole-document scaling** (browser zoom, a CSS `transform: scale`
  or `zoom` on the preview container, or a different print scale), because that is the only thing that
  moves a fixed 14px value.

SV-9979 lists the Service Order row and the column headings as affected, which points at the second
explanation — or at the first with the eye grouping the block together. **It cannot be both.**

**Worth considering, because it reverses the ticket:** the document renders at *exactly* its PDF size
when the root is 16px. If the old app hosted the preview at a **14px** root, then the "original legacy"
people remember was rendering **smaller than the printed page**, and the current size is the correct
one. That possibility should be ruled in or out before a developer changes anything.

## 4. What I could NOT do, and why

- **Production could not render a Legacy document today.** `documentDesign` reads **`modern`**.
  Yesterday it was left on **Legacy** (QA lead's ruling, 2026-09-12) — so **somebody changed it back
  since**. Not reversed by me (a change made under our shared account is somebody's deliberate action).
- **The "Legacy invoice layout" toggle would not respond.** It is present, enabled
  (`aria-disabled` null, `input.disabled` false, `pointer-events: auto`, nothing covering it — its own
  `.q-toggle__thumb` is the element at its centre point). I activated it five ways — precise thumb
  click at its measured centre, `.q-toggle__inner.click()`, `input.click()`, a Space keydown, and a
  mouse click after `scrollIntoView` — and **`aria-checked` stayed `false` every time**. Save Details
  then fired **zero** application requests (only Google Analytics and Sentry). **This may well be my
  automation rather than a defect** — I am not calling it one without a human trying it by hand.
- The preview endpoint does **not** accept a design override (`design` / `documentDesign` /
  `document_design` / `template` = legacy all returned the Modern document, byte-identical length).
- So the screen measurement above is of the **v26.35.10 Legacy document**, not of production's own
  Legacy render. The production **template** is proven identical on the PDF surface; what remains
  unmeasured is whether production's **host** gives the document a different root or a zoom.

## 5. Production left untouched — proven

| Setting | Yesterday's pre-flip snapshot | Today, after this run |
|---|---|---|
| all nine display toggles | true | true |
| `documentDesign` | modern | modern |

One save did fire on the first attempt, writing the identical nine values; the comparison above is the
proof that nothing moved. No Jira write of any kind.

## What would finish this

Chris's exact path — the **customer portal / Account Access Mode** view of INV-S-7029 — measured for
the root font size and for the "Service Order" heading, against the same two on the old build. That
splits the two explanations in one minute and tells the developer which layer to fix.

---

# ADDENDUM — logo, and a full stylesheet diff (2026-09-13, production on Legacy)

Production was switched to Legacy (`POST /api/organizations/invoice-settings/change-design`) and its
real Legacy document fetched, so this compares **like with like**.

## Logo — size and placement

| | QA v26.35.10 | PROD v26.36.4 |
|---|---|---|
| Logo box, on screen | **238 × 120 px** | **238 × 120 px** |
| Logo box, in print | 178.50 pt wide (= 238 px), x 217.93–396.43 | 178.50 pt wide (= 238 px), x 217.93–396.43 |
| Vertical centre, in print | 81.0 pt | 81.0 pt |
| Drawn image height, in print | 87.58 pt | 89.25 pt |
| The shop's own logo file | 320 × 157 px (ratio 2.038) | 1200 × 600 px (ratio 2.000) |
| Horizontal placement, on screen | left-aligned in its column | **centred** (`margin: 0 78.33px`) |

The drawn-height difference is **not the template** — it is the two shops' own logo files having
different aspect ratios inside an unchanged 238 × 120 box (`background-size: contain`).
**Size is identical everywhere. Print placement is identical. On screen, production centres the logo
about 78px further right.**

## The stylesheet diff — and the premise in SV-9979 is wrong

83 rules on QA, 84 on production. **Three differ; two of those are just per-document data** (the footer
document number and the shop's tax registration number). **Two are real template changes:**

**1. The logo rule**

```
QA   .organization-logo-new { width: 238px;                          height: 120px; … }
PROD .organization-logo-new { width: 100%; max-width: 238px;          height: 120px; … margin: 0 auto; }
```

This looks like the **SV-9975 fix and it does what it should**: a hard `238px` can overflow a container
narrower than itself; `width:100%` capped at `238px` cannot. It never makes the logo bigger.

**2. A new screen-only rule that production has and v26.35.10 does not**

```css
@media screen {
  .custom-table th,
  .custom-table td:nth-child(2),
  .custom-table td:nth-child(1):not(.description-cell) { white-space: nowrap; }
}
```

Its own code comment says it makes the preview reproduce the PDF's line breaks cell for cell, and that
"print is untouched — this is `@media screen`, which WeasyPrint never reads."

**Measured live:** the "Service Order" cell computes `white-space: normal` on QA and **`nowrap` on
production**.

### Why this matters to SV-9979

The ticket's stated expectation is *"the Legacy templates are byte-identical to v26.35.10, so the type
should match v26.35.10 exactly, not approximately."* **The templates are not byte-identical** — there
are two deliberate, commented changes on production. **Neither of them touches font-size**, so the
reported 2px is still unexplained by the template; but the premise the ticket rests on should be
corrected before anyone reasons from it.

### And it refines SV-9976 (the Service Order heading wrap)

Production already carries the screen-only `nowrap` fix, so that heading does **not** wrap on screen
there — it still wraps **in the PDF**, which is the surface SV-9976 measures and the steps exercise.
The QA branch wraps on both surfaces. So SV-9976 is a **print-path** issue, and should say so.

### One honest caveat

The two documents come from different shops as well as different builds, so strictly this compares
build-and-org together. Both changed rules carry developer comments describing the change, which makes
the build the obvious explanation rather than org data — but it is worth one look at a second shop.

---

# SECOND SHOP — the caveat is closed (2026-09-13)

Both environments have a second shop. Switched to each (`POST /api/iam/change-location`), pulled a
Legacy document from it, and diffed. Four documents, two shops per build.

| | QA shop 1 (Heavy Duty) | QA shop 2 (Lethbridge) | PROD shop 1 (Trucks Hill 2) | PROD shop 2 (Truck Hill 1) |
|---|---|---|---|---|
| Page base size | 16px | 16px | 16px | 16px |
| Shop name / Bill To | 19.2px | 19.2px | 19.2px | 19.2px |
| Address lines | 14.4px | 14.4px | 14.4px | 14.4px |
| Service Order / Unit / headings | 14px | 14px | 14px | 14px |
| Totals | 12.8px | 12.8px | 12.8px | 12.8px |
| Small print | 8.64px | 8.64px | 8.64px | 8.64px |
| Logo box | 238×120 | 238×120 | 238×120 | 238×120 |
| Logo margin | 0px | 0px | **0 78.33px (centred)** | **0 78.33px (centred)** |
| Service Order wrap | normal | normal | **nowrap** | **nowrap** |

**CSS rule diff:**

- **Within QA, shop 1 vs shop 2 — IDENTICAL** (77 rules each)
- **Within production, shop 1 vs shop 2 — IDENTICAL** (78 rules each)
- **Across builds — exactly 2 rules differ, and they are the SAME 2 rules on both shops**

So the stylesheet **does not vary by shop**. The two differences are the **build**, definitively:
`.organization-logo-new` (fixed 238px → `width:100%; max-width:238px; margin:0 auto`) and the new
screen-only `white-space: nowrap` on the `.custom-table` heading/first/second cells.

**Every type size is identical across all four documents, and so is the logo box.** No font size
anywhere differs between builds or between shops.

Locations were switched back afterwards (production → Trucks Hill 2, QA → Staging Heavy Duty).
