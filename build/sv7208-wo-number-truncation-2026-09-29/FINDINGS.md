# SV-7208 — Work Order number truncated to dots in desktop view when the location name is long

**Verdict: PASS.** Tested 2026-09-29 on the QA branch `sv7208.qa.shopview.com`,
build **v26.39.1-830ae4c**, against production **v26.39.1-3ef6ade** as the before-state.

---

## 1. Sources read

| Source | What it says | Read |
|---|---|---|
| **SV-7208** (Bug · TESTING QA · Medium · reporter Ryan Fyfe · assignee Stefan Mitrovic) | In desktop view the Work Order number truncates to dots when the location's Shop ID is more than 2–3 characters. Customer Mason Pawsey / KMS Mechanics Inc / 34 users. One attachment `image.png` (id 56239). Linked **SV-10607** (Relates). | 2026-09-29, Atlassian MCP |
| **QA handoff — comment 77477** (Stefan Mitrovic, 2026-09-28) | The desktop header used `ShortText :name-length="8"`. The number is `S{shop}-{number}`, so any Shop ID of 2+ characters showed dots, e.g. `SBAK-173..`. Branko's ruling from SV-6591: *"don't truncate, show full title, wrap it around in two lines"*. What changed: the desktop **Work Order and Part Sale** header now always shows the full number, and when it does not fit next to the status badge, **the badge moves below it**. Shop ID allows only **1–5 letters or digits**, so the longest possible number is **17 characters**; measured at **1024–1920px**. | 2026-09-29 |
| **His QA note** | *"Set a location's Shop ID to 3–5 characters, then create a NEW WO and a new part sale there. Since SV-10219 the displayed number is fixed when the WO is created, so older WOs keep their old number. Check the header at a few desktop window widths."* | — |
| **SV-10607** | Milan's findings — no upper bound on the WO start number, Shop ID validated only in the UI — **split out, explicitly out of scope**. | — |

## 2. Builds

| | Build | `last-modified` | etag |
|---|---|---|---|
| Branch `sv7208.qa.shopview.com` | **v26.39.1-830ae4c** | Mon, 28 Sep 2026 22:46:03 GMT | `W/"410d58546f0f9b292d54a4155c62bfeb"` |
| Production `app.shopview.com` | **v26.39.1-3ef6ade** | Fri, 25 Sep 2026 09:32:14 GMT | `W/"8b98909c3354f09d9a191839e6189b27"` |

The branch marker was read at the **start, middle and end** of the pass and was **identical all three times** — nothing redeployed underneath the testing.

## 3. Before — production reproduces the reported fault

Production location **"Import Test"** carries Shop ID **2500**. A work order seeded there
came out with the real number **`S2500-931`** (nine characters — read from the page title
`S2500-931 - aa | Work Order | ShopView`), and the header rendered:

| Window width | Header text | Position |
|---|---|---|
| 1680px | **`S2500-93..`** | x 41, y 102, w 106 |
| 1280px | **`S2500-93..`** | x 41, y 100, w 106 |
| 1024px | **`S2500-93..`** | x 41, y 157, w 106 |

Identical at all three widths, so this is a **hard cut after the eighth character**, not a
responsive overflow — which matches the `:name-length="8"` Stefan describes.

## 4. After — the fix branch

Branch location **"Staging Heavy Duty - 9919"** carries Shop ID **7208**.

### 4.1 New work order, 4-character Shop ID — `S7208-17580` (11 characters)

| Window | Number shown | Number box | Status pill |
|---|---|---|---|
| 1920px | `S7208-17580` — full | x 41, y 102 | beside it, x 252 |
| 1680px | `S7208-17580` — full | x 41, y 102 | beside it, x 212 |
| 1440px | `S7208-17580` — full | x 41, y 133 | **below it**, x 41, y 169 |
| 1280px | `S7208-17580` — full | x 41, y 100 | beside it, x 248 |
| 1024px | `S7208-17580` — full | x 41, y 133 | beside it, x 184 |

Every width was captured twice, in two separate runs, and the figures came back identical.

### 4.2 Longest Shop ID the app allows — 5 characters

Shop ID set to **`WXYZ9`** through Administration → Locations. A new work order came out
**`SWXYZ9-17581`** — twelve characters:

| Window | Number shown | Status pill |
|---|---|---|
| 1920px | `SWXYZ9-17581` — full | beside it |
| 1440px | `SWXYZ9-17581` — full | **below it** |
| 1024px | `SWXYZ9-17581` — full | **below it** |

### 4.3 Part sale — the same header, the same fix

A new part sale created while Shop ID was `WXYZ9` came out **`PWXYZ9-248`** and showed in
full at 1920, 1440 and 1024px, with the status pill dropping below the number at 1440 and
1024.

### 4.4 Older records keep their old numbers (SV-10219)

Part sale **`P2-247`**, created before the Shop ID was touched, still reads `P2-247` and
renders in full. So the number really is fixed at creation and the fix does not restate it.

### 4.5 Mobile is not regressed

At **390 × 844** the header reads `S7208-17580 · Estimate` in full — the SV-6591 mobile fix
is intact.

## 5. What was checked

| # | Check | Result |
|---|---|---|
| 1 | The reported fault reproduces on the build customers are running | **PASS** — `S2500-931` renders `S2500-93..` |
| 2 | New work order in a location with a multi-character Shop ID shows the whole number | **PASS** |
| 3 | Whole number holds at 1024, 1280, 1440, 1680 and 1920px | **PASS** |
| 4 | Longest Shop ID the app allows (5 characters) | **PASS** — `SWXYZ9-17581`, twelve characters, nothing cut |
| 5 | Status pill moves below the number when there is no room beside it | **PASS** — observed at 1440 and 1024px |
| 6 | New part sale header | **PASS** — `PWXYZ9-248` in full |
| 7 | Older work orders and part sales keep their old numbers | **PASS** — `P2-247` unchanged |
| 8 | Mobile view not regressed | **PASS** — full number at 390 × 844 |

## 6. Honest limits

* **The 17-character worst case was not produced.** Seventeen characters needs a 5-character
  Shop ID *and* a ten-digit work-order number. The branch's counter is at five digits and the
  app offers no way to set a work-order start number, so the longest number actually put on
  screen was **twelve** characters. The unbounded start number is **SV-10607**, out of scope
  for this ticket.
* **No production before-picture exists for the part sale header.** Production part-sale
  numbers do not use the location's Shop ID — a part sale created in "Import Test"
  (Shop ID 2500) came out `P2-73`, not `P2500-73` — so no production part sale is long
  enough to truncate. The branch side is verified; the production comparison is only
  available for the work order.
* **Shop ID validation is not part of this verdict.** The field accepted six characters while
  typing (`ABCDEF`); that was not saved, and Shop ID validation is explicitly split to
  SV-10607.
* Only the work order and part sale headers were examined — those are the two surfaces the
  change touches.

## 7. Environment changes, and their restoration

**Branch** (per-ticket QA branches need no cleanup; done anyway): Heavy Duty Shop ID
7208 → `WXYZ9` → **7208**, read back and verified on both locations.

**Production** (restore-after discipline applies):

| Change | Restored | Proof |
|---|---|---|
| 4 work orders created in "Import Test" | all deleted | `delete => 201` on each |
| 2 part sales created in "Import Test" | both deleted | `Delete` + confirm through the UI; neither appears in the list |
| **"For Ryan" Shop ID changed 55 → 2500 by a mis-click** | restored to **55** | full location list re-read: `For Ryan=55`, `Import Test=2500`, all nine others unchanged |
| Session workplace moved to "Import Test" | restored to **Trucks Hill 2** | `change-location => 200` |
| Import Test location record saved (same values re-typed) | no change | all 24 fields byte-compared before/after — `wp-diff => []` |

## 8. Two things worth keeping (added to the playbook)

1. **Row index ≠ button index on the Locations table.** The table carries an empty
   virtual-scroll spacer row at index 0, so the *n*th `tbody tr` and the *n*th
   `[data-test-id=button_edit_workplace]` are **different rows**. This opened "For Ryan"
   when I meant "Import Test". Always scope the click to the matched row:
   `tr.querySelector('[data-test-id=button_edit_workplace]').click()`.
2. **On production the SPA re-asserts its own stored location on load.** Calling
   `/api/iam/change-location` before the app has hydrated is overwritten, and a work order
   in another location then redirects to the list. Load the app first, then switch, then
   navigate.

## 9. Evidence

* `ev/01-work-order-before-after.png` — production `S2500-93..` beside the branch's
  `S7208-17580`, both annotated on the pixels.
* `ev/02-five-character-shop-id.png` — `SWXYZ9-17581` at 1024px with the pill wrapped below.
* `ev/03-part-sale.png` — `PWXYZ9-248` at 1440px.

Both halves of exhibit 1 carry the New Line dialog's dimming, which is simply what a
brand-new empty work order looks like when you open it; the state is identical on both
sides, so the comparison is like for like.
