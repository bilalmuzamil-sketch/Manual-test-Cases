# SV-9658 — Duplicate part numbers with different descriptions can be added through purchase orders

**Verdict: PASS.** Tested 2026-09-29 on the QA branch `sv9658.qa.shopview.com`,
build **v26.39.1-2e57b93**, with production **v26.39.2-1aeb22d** captured as the before-state.

---

## 1. Sources read

| Source | What it says | Read |
|---|---|---|
| **SV-9658** (Bug · TESTING QA · Medium · reporter Ryan Fyfe · assignee Stefan Vukovic) | Customer Mahmoud Hosseini / Semi Serve LLC / 3 users, via Intercom. Two different products entered under the same part number; in inventory only one description survives. Links: **Blocks SV-9315**. | 2026-09-29 |
| **Slavcho Mitrov, 17 Sep (76724)** | Reproduced it and corrected the ticket: *nothing is duplicated*. Two lines **merge** into one part and the second product is discarded — 10 × "20 TON PINTLE HOOK" + 5 × "Hitch Lunette Ring 3 Inch" under `BUYPH20` gives one part, qty 15, blended cost. Blocking duplicate part numbers would not have prevented it, because nobody typed a duplicate. | 2026-09-29 |
| **Chris Ward, 18 Sep (76890)** | Direction set, withdrawing his 3 Sep call. Two things ship together: **lock the description to the part**, and **give people somewhere to go** — the create-a-new-part row must be reachable *when the search does return a match*, not only when it comes back empty. **No confirmation dialog.** | 2026-09-29 |
| **QA handoff — Stefan Vukovic, 28 Sep (77460)** | FE only, PR #3340. Six numbered checks (setup · lock · unlock · create row with matches · the same three on an existing PO · regressions). Out of scope: already-merged inventory, and `BUY-PH20` vs `BUYPH20` still matching. | 2026-09-29 |

## 2. Builds

| | Build | `last-modified` | etag |
|---|---|---|---|
| Branch `sv9658.qa.shopview.com` | **v26.39.1-2e57b93** | Tue, 29 Sep 2026 08:26:02 GMT | `afcdb32ae3d0e16032e30adcdaf3239c` |
| Production `app.shopview.com` | **v26.39.2-1aeb22d** | Tue, 29 Sep 2026 09:36:08 GMT | `631482bb64cdcb1ec1f15b23ba76f192` |

The branch marker was read at the start and at the end of the pass and was **unchanged**.
**Production redeployed during the day** (it read `v26.39.1-3ef6ade` earlier this morning), so the
before-state was captured on the newer production build — which **still shows the old behaviour**, so
production does not carry this fix and the comparison is valid.

## 3. Before — production reproduces both halves of the problem

On **production**, New Purchase Order:

* Picked part number **`1237944`**, whose catalogue name is **`A158`**. The Description field came back
  **editable** (`disabled: false`), and it was **retyped to "Hitch Lunette Ring 3 Inch"** and accepted.
  That is precisely the mechanism the customer hit.
* Typing a partial number that finds matches (**`1237`**) listed **24 matches and offered no way to
  create a new part** — confirmed by scrolling the dropdown to its end and re-reading the whole list
  (`hasAdd: false` both before and after scrolling, 20,968px of scroll height).

## 4. After — the fix branch, the handoff's six checks

### 4.1 Setup
Catalogue part **`SV9658-PART-A`** / description **"SV9658 product A"** created through
Administration → Parts → Catalog (`POST /api/parts-catalogue/add-catalogue-part`). Vendor
**"5 Star Truck Repair"** used throughout.

### 4.2 Lock — New Purchase Order — **PASS**
Picking `SV9658-PART-A` set Description to **"SV9658 product A"** and **disabled** it
(`q-field--dis`, `cursor: not-allowed`). Clicking the field does **not** focus it
(`document.activeElement` stayed null) and typing `TAMPER` changed nothing. Added at qty 3 / $12.50,
**Save & Close**, reopened as **`I9658-1395`** at `/order/{id}` — the item still reads
**`SV9658-PART-A · SV9658 product A · 3.00 · $12.50`**.

### 4.3 Unlock — **PASS**
With the part attached, retyping the number to **`SV9658-PART-B`** and pressing **Tab** made
Description **editable and empty**. Typed "SV9658 product B", saved — the item persists as
**`SV9658-PART-B · SV9658 product B · 1.00 · $5.00`**, a special-order part.

### 4.4 Create row when the search returns matches — **PASS**

| Typed | Dropdown | Create row |
|---|---|---|
| `SV9658` | 1 match (`SV9658 product A`) | **"Add new special order part: SV9658"** |
| `SV9658-PART` | 1 match | **"Add new special order part: SV9658-PART"** |
| `Pintle` | 11 matches | **"Add new special order part: Pintle"** |
| `SV9658-PART-A` (an exact existing number) | 1 match | none |
| `SV9658-PART-A2` | **0 matches** | "Add new special order part: SV9658-PART-A2" |

**Two honest notes.** The handoff's example for this check is `SV9658-PART-A2`, described as *"the
dropdown still lists PART-A"* — it does **not**; the search is a contains match, so a longer string
finds nothing and that string actually exercises the empty-search case. The behaviour Chris asked for
is nevertheless proven, by the three strings above. And an **exact** existing part number shows the
match with no create row, which is sensible — that is the duplicate the original ticket wanted
prevented.

Clicking the create row sets the line's part number to the full typed string and makes Description
editable; a part created that way saves and persists (`POST /api/inventory/orders/add-item` → 200,
item `Hitch Lunette Ring 3 Inch · 5.00 · $63.17`).

### 4.5 The same three checks on an existing purchase order — **PASS**
All three repeated through **Add Order Item** on `I9658-1395`: lock, unlock and the create row all
behave identically.

### 4.6 Regressions

| Check | Result |
|---|---|
| Editing an existing PO item keeps Description editable | **PASS** — `disabled: false`, value "SV9658 product A" |
| Work Order → Add Part: no create row while matches exist | **PASS** — `Pintle` gave 11 matches, no create row |
| Work Order → Add Part: "Create … as a new part" with no matches | **Shows "No results" instead** — see below |
| Parts → Returns → Create Return: no-match shows "No results" | **PASS** |

**On the work-order picker:** the New Part Request dialog shows **"No results"** for a string with no
matches, not a create row. **Production behaves exactly the same** (`hasCreate: false` on both), so
**nothing regressed here** — the handoff's wording for that one line does not describe either build.
It is also not a dead end for the user: with **Source = Vendor** the part number and description are
typed directly on that dialog.

## 5. The customer's own scenario — **the merge mechanism is gone**

Reproducing Slavcho's repro on the branch: picked **`BUYPH20`**, Description locked to
**"20 TON PINTLE HOOK"**, and typing **"Hitch Lunette Ring 3 Inch"** into it did nothing. The way out
works — typing the second product's name offers **"Add new special order part"**, and it saves as its
own line with its own description and price.

## 6. What I could not check

* **Receiving into inventory was not driven end to end.** The fix removes the mechanism at the point
  of entry, and that is what was tested; I did not receive a purchase order and re-confirm that two
  products stay separate in inventory afterwards.
* **Out of scope by the ticket:** stock already merged in customers' inventories, and `BUY-PH20`
  matching `BUYPH20` as the same number.
* Only the screens named in the handoff were exercised. The part picker is shared and has other
  callers (Chris counted nineteen), which SV-9315 is rewriting.

## 7. Two things that looked like defects and were my own harness

Recorded so they are not mistaken for findings. A `price: null` on one add-item call was my cost value
never reaching the field — the **Add Order Item** modal labels its cost field **`$`** with
`data-test-id="input_base"`, not "Cost", so a label match found nothing. And an attempt to type into
the locked Description put the characters in the **Part Number** box, because a disabled input cannot
take focus — which, read properly, is itself evidence the lock works.

## 8. Environment

**Branch** (per-ticket QA branch — no cleanup required): left in place are catalogue part
`SV9658-PART-A`, purchase order `I9658-1395` with three items, and work order `dc495f71…` with one
free-text line.

**Production** (restore-after discipline): one work order created and **deleted** (`delete => 201`).
No purchase order was saved — the New Purchase Order dialog was opened and abandoned, so no
`orders/create` call was ever made. Nothing else was changed.

## 9. Evidence

* `ev/01-description-lock.png` — production, description retyped on part `1237944`; beside the branch,
  greyed out and holding the part's own name.
* `ev/02-create-new-part.png` — production, 24 matches and no way to create a new part; beside the
  branch, the same situation with "Add new special order part" under the matches.
* `ev/03-customer-case.png` — `BUYPH20` locked to "20 TON PINTLE HOOK" on the branch.
