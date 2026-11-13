# Internal Work Orders: design republish for PRD v1.2 / v1.3 (12 Nov 2026)

Assessment only. Nothing was written to TestRail, Jira, Slack or Google, nothing was committed, and `authoring/` was not edited.

- **Design:** "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), read with the Artifact tool (`read`, then `list` with scope files, then `read` with paths). No bot check was met.
- **Previous check:** version **1794507512-2fc4** (`DESIGN-CHANGE-2026-11-12.md`, files in `v2-1794507512/files/`).
- **Current version:** **1794510020-d4ec**, 210 published files. Saved in `v3-1794510020-d4ec/files/` at the same paths.
- **PRD:** v1.3 calls this design "All flows v6.2 (Claude Design canvas, Nov 12, 2026)" and says the Close frames were redrawn for v1.2. The PRD side is in `../po-answers-2026-11-12/PRD-CHANGES-v1.1-to-v1.3.md`.

## 1. Verdict

**The design changed.** It changed in the places the PRD named, plus the Settings hint.

- **11 Close boards were redrawn.** The Close confirmation is gone. The Finance tab now carries "Posting date", the posting summary and the closing sentence. Only two Close dialogs remain: the original work order dialog and the new vendor bill cost-move dialog.
- **4 Settings boards show one hint line instead of two.** The change comes from the shared Settings artboard, so the four board files themselves did not change.
- **152 boards are unchanged:** same on-screen text, 0 changed pixels.

## 2. File comparison (sha256 / byte compare against `v2-1794507512/files/`)

| Group | Files | Result |
|---|---|---|
| `project/` board files, components, `canvas.json` (168) and `_ds/` bundle and CSS (3) | 171 | **14 changed**, 157 identical |
| `index.html`, `SKILL.md`, `artifact-type/dc-runtime.js` | 3 | `index.html` changed: the build stamp only (`832bee79…` → `5eff8556…`). The other two are identical |
| other `artifact-type/` viewer files (31) and `_ds/…/fonts/` (5) | 36 | not downloaded; they are the viewer runtime and fonts, not design. Listing sizes: the 5 fonts are the same size; `app.js` (5,123,690 → 5,126,127) and `capture.js` (870,818 → 872,220) changed size |

The 14 changed project files:

- **`WO-Detail-Artboard-v6.dc.html`** (82,705 → 87,873 bytes) gains a `summary` property (none / default / noaccount / nointegration / nocost / qbnoinv). It draws the Finance tab posting summary. Every variant is used by a board below, and no undrawn variant is hidden in the source.
- **`WO-Settings-Artboard-v6.dc.html`**: `hintAccounts` is now always false, so the second hint line is never drawn.
- **`canvas.json`**: 9 board titles and 13 notes changed (§4). No page, board, position or order changed.
- **11 board files:**
  - `flow1-6b`, `6c`, `6d`, `6e`, `6g`, `flow2-4`, `hf-17` and `rv-5-2` now import the detail artboard with the Finance tab and a `summary`, instead of drawing a dialog;
  - `flow1-6f` is now the cost-move dialog;
  - `flow2-4b` and `rv-5-1` draw the original work order dialog without the old confirmation rows behind it.

## 3. On-screen text (all 167 boards rendered from both versions)

**Tool:** `tools/v3_text_diff.js`, output `v3-1794510020-d4ec/render/v3-text-diff.json`.

- Both packages are rendered the same way: light theme, fonts mapped to the system Inter as in pass A of the earlier check.
- For each board the tool compares two things: the visible text (`innerText`) plus the aria-label, title and placeholder attributes, and the pixels.
- The new pictures of all boards are in `render/v3/`. Old pictures are kept in `render/v2/` only for the 15 changed boards; the others match their v3 picture with 0 changed pixels.

**Result:** 15 boards changed their text, and the same 15 changed pixels (60,326 to 882,432 pixels each). No board changed pixels without changing text.

### 3a. Settings hint (S1-R3, S1-R4, S1-R10)

| Board (page) | Old title → new title | Gone | New on-screen words |
|---|---|---|---|
| `flow0-2` "02 Settings · setting on" (Flow 0 · Turn it on) | unchanged | the QuickBooks mark ("qb", aria-label "QuickBooks") and the line "Map their expense accounts in Integrations > QuickBooks." | One hint line: "Manage categories in Internal Work Orders (Administration > Service). Their expense accounts are set there or in Integrations > QuickBooks." |
| `flow0-3` "03 Settings · setting on, no flagged customer" (Flow 0) | unchanged | the same second line | The same one hint line. It still does **not** show S1-R4's "No internal customer yet. …", so IWO-D03 stands |
| `hf-03` "03 Setting on" (Happy flow v6) | unchanged | the same | the same |
| `rv-1-3` "1.3 · 03 Setting on" (Review · What changed after the CEO review) | unchanged | the same | the same |

The remaining line now matches S1-R3 v1.3 word for word ("…are set there or in Integrations > QuickBooks."). IWO-D02 called this design sentence a difference from v1.1. **It now matches the PRD, so IWO-D02 closes.**

### 3b. Close boards (S3-R1, S3-R2, S3-N4, S3-E2, S3-E4, S3-E5, S7-N5, S10-R3)

Gone from every Finance-tab board:

- the dialog "Close work order S2-34918?" / "S2-35102?", with its "Cancel" and close (X) controls;
- the "Customer PO" and "Invoice Date" fields;
- the old sentence "This posts the parts cost … Closed · No Charge …" (which was wrong on an internal work order; IWO-D20).

| Board (page) | Old title → new title | New on-screen words of the Finance tab (in order) |
|---|---|---|
| `flow1-6b` (Flow 1 · Create and close), `hf-17` (Happy flow v6), `rv-5-2` (Review) | "07 Close · confirm" / "17 Close confirmation" / "5.2 · 17 Close confirmation" → "07 Finance tab · Close Work Order" / "17 Finance tab · Close Work Order" / "5.2 · 17 Finance tab · Close Work Order" | Close Work Order · Posting date · Close Work Order · Stock parts $265.00 "Posted to 6500 Vehicle Expenses" · Special orders and sublet $410.00 "Already posted to 6500 Vehicle Expenses at the vendor bill" · Labor 3.0 h "Hours only, nothing posted" · Shop supplies $25.00 "Posted to 6500 Vehicle Expenses, credited to 4300 Shop Supplies Income" · "Closing posts the parts cost and shop supplies to your books and marks the work order Closed · Internal. You can reopen it later." Then the document preview: "Internal Work Order S2-34918", INTERNAL, "Category: General Internal", Summary "Parts cost $675.00", "Labor 3.0 h" |
| `flow1-6c` (Flow 1) | "7b Close · no account set" → "7b Finance tab · no account set" | As 07, but the Stock parts note is "No account set for General Internal. The entry posts to the ShopView Review account until you set one." with "Set account". Special orders and sublet has no note. Shop supplies "Posted to ShopView Review, credited to 4300 Shop Supplies Income". The Labor note "Hours only, nothing posted" is now drawn |
| `flow1-6d` (Flow 1) | "7c Close · no accounting integration" → "7c Finance tab · no accounting integration" | Posting date (now drawn) · Stock parts $265.00 · Special orders and sublet $410.00 · Labor 3.0 h · Shop supplies $25.00, with no notes at all, not even "Hours only, nothing posted" · "Closing marks the work order Closed · Internal. Parts cost, shop supplies and hours are available in the Internal Work Orders report." |
| `flow1-6e` (Flow 1) | "7d Close · parts with no cost" → "7d Finance tab · parts with no cost" | As 07, plus "Parts with no cost" · "Gasket kit" · "Skipped, nothing posted" before the closing sentence |
| `flow1-6g` (Flow 1) | "7f Close · QuickBooks without inventory accounts" → "7f Finance tab · QuickBooks without inventory accounts" | As 07, but Stock parts and Special orders and sublet both carry "Parts cost is not posted to QuickBooks at this location: inventory accounts are not mapped." |
| `flow1-6f` (Flow 1) | "7e Close · work order changed" → "**7e Close · vendor bill cost moves**" | The Finance tab as 07, and over it the dialog "Close work order S2-34918?": "A vendor bill on this work order was posted to another account. Closing moves that cost." · "Moved from Cost of Parts to 6500 Vehicle Expenses" $410.00 · "Caliper (special order), vendor bill VB-2041" · Cancel · Close Work Order. **The message "This work order changed. Review and close again." is no longer drawn on any board** |
| `flow2-4` (Flow 2 · No charge on a customer's work order) | "04 Close · confirm" → "04 Finance tab · Close Work Order" | Close Work Order · the existing note "No charge. This work order closes without an invoice. Parts cost posts to Customer No-Charge Expense." · Posting date · Close Work Order · Stock parts $180.00 "Posted to 6430 Warranty & Goodwill Expense" · Labor 2.0 h "Hours only, nothing posted" · "Closing posts the parts cost and shop supplies to your books and marks the work order Closed · No Charge. You can reopen it later." Then the document preview: "Estimate S2-35102", "Date: Oct 22, 2026", NO CHARGE (no "Category:" line), Summary "Parts cost $180.00", "Labor 2.0 h"; Download and Print controls. The lines table is no longer shown on this board |
| `flow2-4b` (Flow 2), `rv-5-1` (Review) | unchanged ("4b Close · original work order required" / "5.1 · 27 Close · original work order required") | The dialog is unchanged: "Close work order S2-35102?", "Original work order *", the S2-31207 / S2-30455 options, OTHER "Not in ShopView", "Warranty requires the original work order. Pick the earlier work order this job comes from, or Not in ShopView.", "Original line", "Then the line on it, if you know it: it sets the original technician.", Cancel, Close Work Order. Only the background changed: the old confirmation rows (Posting date, Stock parts, "Posted to 6430 Warranty & Goodwill Expense", "Hours only, nothing posted") are gone and the lines table shows instead |

## 4. Canvas notes that changed (`canvas.json`)

| Note | New text (verbatim) |
|---|---|
| c-flow0-2, c-hf-03 | "…The tab stays light: one hint line with a link to the Internal Work Orders page where the categories live and their accounts are set (frame 2a)…" |
| c-rv-1-3 | "Setting on. One hint line with a link to the Internal Work Orders page where the categories are managed and their accounts are set; the second line (Map their expense accounts) is dropped (Nov 12)." |
| c-flow1-6b | "No confirmation: Close Work Order posts and closes on the press, like Create invoice (SV-10312). Before it, the Finance tab shows the posting date and what will post, for users with See Financial Data; the summary is information, not a step." |
| c-hf-17 | "One press, like Create invoice: no confirmation. The Finance tab shows the posting date and what will post; Close Work Order posts and closes." |
| c-flow1-6c | "When the account is not mapped: the warning sits in the Finance tab summary with Set account. Close is not blocked; the entry posts to ShopView Review." |
| c-flow1-6d | "Shops without QuickBooks or AccountingHub. Nothing is posted; the summary has no account notes." |
| c-flow1-6e | "Costed parts post; parts with no cost are listed in the summary and skipped." |
| c-flow1-6f | "The only other Close dialog: a vendor bill posted to another account moves at Close. One row per pair of accounts, amounts added up, same as the Create invoice cost move. Shown only with an accounting integration. If the work order changes while this dialog is open, Close is refused with "This work order changed. Review and close again."" |
| c-flow1-6g | "…Shop supplies still posts. The note sits in the Finance tab summary." |
| c-flow2-4 | "Clicks Close Work Order on the Finance tab: no confirmation. Stock parts post to the account of the category (Warranty: 6430)." |
| c-flow2-4b | "…Goodwill never shows this. This and the vendor bill cost move are the only Close dialogs." |
| c-rv-5-1 | "…Optional Original line select under it. This dialog opens only when the original is missing; it and the vendor bill cost move are the only Close dialogs." |
| c-rv-5-2 | "No Close confirmation (Nov 12): the posting summary and the posting date sit on the Finance tab; Close Work Order posts on the press. The category's account is named in the summary." |

## 5. Cases each change touches

**Method:** design cases (keys "D-…") and every case whose "References from Design" block names a changed board by its old title or its attached picture file.

**Shared change for all cases:** every case with a "References from Design" block names version 1794507512-2fc4, which becomes 1794510020-d4ec. For the 152 unchanged boards this is a re-stamp only.

| Board change | Design cases (C-id) | Other cases naming the board |
|---|---|---|
| Settings one hint line (`flow0-2`, `hf-03`; `rv-1-3` is named by no case) | **D-03** [C1112321](https://shopview.testrail.io/index.php?/cases/view/1112321), "…show two hint lines": title, results, quote and picture change to one line. IWO-D02 closes | S1-01, S1-10, S1-10b, S1-11, S1-12, S1-13, S1-87 |
| `flow0-3` no flagged customer | **D-04** [C1112322](https://shopview.testrail.io/index.php?/cases/view/1112322), "…the first hint says none is flagged yet": "first hint" becomes "the hint" (S1-R4 v1.3), and the picture changes. The board still lacks the S1-R4 text, so IWO-D03 stands | none |
| 07 / 17 / 5.2 Finance tab | **D-38** [C1112356](https://shopview.testrail.io/index.php?/cases/view/1112356), "Close Work Order window lists posting date and the cost rows": no window any more. It becomes the Finance tab posting summary (title, steps, results, pictures, quotes) | S3-07…S3-17, S3-49, S3-50, S3-55, S10-10, DATA-01, DATA-02, DATA-03 |
| 7b no account | **D-39** [C1112357](https://shopview.testrail.io/index.php?/cases/view/1112357): "Close window" becomes the summary. The design now says "No account set for General Internal.", so the IWO-D22 wording part closes; the missing Special orders note stays (IWO-D22) | S3-39, S3-40, S3-41, S3-42 |
| 7c no integration | **D-40** [C1112358](https://shopview.testrail.io/index.php?/cases/view/1112358): the summary; "Closing marks …" sentence; Posting date now drawn, so IWO-D21 closes | S3-46 |
| 7d no cost | **D-41** [C1112359](https://shopview.testrail.io/index.php?/cases/view/1112359): the summary instead of the window | S3-45 |
| 7e changed → cost move | **D-42** [C1112360](https://shopview.testrail.io/index.php?/cases/view/1112360), "Close refused when the work order changed shows the message": **its board no longer shows the message**. Recommendation: rewrite D-42 to the cost-move dialog (S3-R2 (2), §8 "Close with a cost move"), and move the "work order changed" message to the design-silent list. S3-E5 now applies only while a dialog is open | S3-47, S3-48 (they quote the old design words) |
| 7f no inventory accounts | **D-43** [C1112361](https://shopview.testrail.io/index.php?/cases/view/1112361): the summary instead of the window | S3-39…S3-42, S7-29 |
| Flow 2 04 | **D-60** [C1112377](https://shopview.testrail.io/index.php?/cases/view/1112377), "Close window of a no-charge work order names the category account": the summary on the Finance tab | S3-07…S3-17, S3-49, S3-50, S3-55, DATA-01, DATA-03 |
| Flow 2 4b / Review 5.1 | **D-61** [C1112378](https://shopview.testrail.io/index.php?/cases/view/1112378), "Close window asks for the original work order when required": the dialog is unchanged, but it is now one of only two dialogs, and the PRD quote (S3-R2 (1)) and the picture change | the same S3 / DATA list as Flow 2 04 |

**Totals:** 10 design cases and 34 other cases, 44 cases in all, name a changed board. They are listed per board in the table above. The full PRD-side list is `../po-answers-2026-11-12/AFFECTED-CASES-v1.3.json`; it includes D-35 and D-37 for S3-R1, D-01, D-05, D-33 and others whose boards did not change but whose quotes did.

## 6. New differences between the redrawn design and PRD v1.3 (for the register; not yet raised)

1. **7e cost-move dialog adds words the PRD does not have.** The dialog shows the lead sentence "A vendor bill on this work order was posted to another account. Closing moves that cost." and the item line "Caliper (special order), vendor bill VB-2041". S3-R2 (2) and §8 give only the title, one "Moved from [account] to [account] $[amount]" row per pair of accounts, and the buttons.
2. **7e is not consistent with itself.** Behind the dialog, the Finance tab summary says Special orders "Already posted to 6500 Vehicle Expenses at the vendor bill", while the dialog moves that $410.00 from Cost of Parts. S3-R2 gives a moved item the note "Moved from [account] to [account]".
3. **7c Labor row has no "Hours only, nothing posted".** S3-E4 removes only the *account* notes. Whether "Hours only, nothing posted" counts as an account note is not said.
4. **7b Shop supplies note reads "Posted to ShopView Review, credited to …".** S3-N4 replaces the account note of an unmapped row with the "No account set …" warning.
5. **Flow 2 04 preview of an open no-charge work order is headed "Estimate S2-35102" with NO CHARGE and no "Category:" line.** S3-R2 calls this preview "the preview of the NO CHARGE document (S3-R5)", and S3-R5 gives "No Charge Work Order [number]" and the "Category: [name]" line. The internal preview (07) does show "Internal Work Order S2-34918" and "Category: General Internal".
6. **Not drawn (design-silent):**
   - the "This work order changed. Review and close again." refusal;
   - the posting summary for a user without 'See Financial Data';
   - the dialog when both cases apply (selects above the "Moved from" rows);
   - the AccountingHub and both-integration notes (IWO-N26 stands);
   - the S1-R3 hint for AccountingHub, both and neither (IWO-N05: reword, because there is no second line any more).
   - IWO-N25 is now partly drawn: the "Moved from" row appears in the 7e dialog, but not as a note in the summary.

**Register rows to update:**

- **Close:** IWO-D02 (design now equals S1-R3), IWO-D20 (sentence now says Closed · Internal), IWO-D21 (Posting date drawn; sentence matches S3-E4).
- **Narrow:** IWO-D22 (only the missing Special orders note is left) and IWO-D23 (no closing sentence is expected in the 4b dialog any more; the Flow 2 card wording part stands).
- **Stands:** IWO-D03.
- **Reword:** IWO-N05, IWO-N25.
- **Add:** rows for points 1–5.

## 7. Reading coverage

- All 174 downloaded files were byte-compared.
- The 36 files not downloaded are viewer runtime and fonts (§2).
- All 167 boards were rendered from both versions and their full on-screen text compared.
- `canvas.json` boards and notes were compared field by field.
- The detail artboard's added and removed strings were listed from the source, to make sure no undrawn variant is missed.

## 8. Version 1794561577-f903 (checked 13 Nov 2026, case worker)

- Published listing: still 210 files. Read with the Artifact tool (`read`, `paths`, two batches): every `project/*.dc.html` (168), `project/canvas.json`, the three `project/_ds/` css and js files, `SKILL.md`, `index.html` and `artifact-type/dc-runtime.js`: 174 files, saved in `v4-1794561577-f903/files/`.
- Byte compare with `v3-1794510020-d4ec/files/`: **173 identical, 1 changed: `index.html`**, and only its build stamp (`<meta name="mega-build-stamp">` `5eff8556…` → `82d73203…`). No board, `canvas.json` or design-library file changed, so no board needed `tools/v3_text_diff.js`, and no case content changes.
- Viewer runtime only (listing sizes, not downloaded): `artifact-type/app.js` 5,126,127 → 5,156,007 and `capture.js` 872,220 → 874,391 bytes. These are the canvas viewer, not design.
- Case references re-stamped to "version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, …; checked 13 Nov 2026)", because the From and References lines cite the current version of each source (Rules 31, 54 and 59). Every picture and design word stays the same.
