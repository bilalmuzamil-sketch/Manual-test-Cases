# WIP authoring pass — 2026-08-28 · per-requirement verdict (Rule 43)

**Scope given:** the 33 WIP requirements the 2026-08-26 source-verify pass returned as
**NOT COVERED**, plus **S4-R9** (verdict SUPERSEDED, new sort rule with no case).
**Source of expectation:** the live WIP Confluence spec **version 28** (last modified 2026-08-24),
as captured on **2026-08-26** in `build/report-suite/source-verify-2026-08-26/specs/wip.json`.
No spec was re-fetched and no expectation was taken from the build (Rules 27, 57).

---

## 🔴 THE HEADLINE FINDING — the "NOT COVERED" count is mostly a TRACEABILITY gap, not a coverage gap

`source-verify-2026-08-26/tools/verify.py` derives NOT COVERED **purely from anchor citation**:

```python
n = len(cites.get(a, []))          # cites = anchors found in refs + expected text
if n == 0: verdict[a] = "NOT COVERED"
```

It is therefore a measurement of **whether an anchor string appears on a case**, not of whether the
behaviour is tested. **27 of the 33** are Rule-64 case **(b)** — *"a source EXISTS but was never
recorded on the case"* — overwhelmingly the **Summary Strip** cases, which cite *"WIP Story 5 + the
13 August 2026 design review"* and never the `S5-Rxx` anchors.

**Authoring new cases for those 27 would have produced 27 near-duplicates** and would have failed the
Rule-28 usefulness gate on its first named slop pattern. They are `update_case` (refs backfill)
candidates, not `add_case` candidates.

| Bucket | Count |
|---|---|
| Already covered in substance — needs **refs backfill only** | **25** |
| Already covered **but the covering case is short of the requirement** — needs **extend** | **3** (S2-R2, S5-R14, S11-R2) |
| **Genuinely uncovered → NEW CASE AUTHORED THIS PASS** | **4** (S4-E3, S4-R15a/R16a/R18a, S4-R9, S9-R14) |
| **HELD — cannot be authored cleanly** | **3** (S7-R7a, S9-E2, S10-R2) |
| *(S4-R15a/R16a/R18a are three requirements carried by one case)* | |

Requirement rows below: **34** (33 NOT COVERED + S4-R9). Reconciles: 25 + 3 + 5* + 3 = 34
(*S4-E3, S4-R15a, S4-R16a, S4-R18a, S9-R14 = 5 requirement rows carried by 4 new cases; S4-R9 is
split — its sort-key half is covered by C30485, its null-placement half is new).

---

## THE ROWS

Every "covered" verdict quotes **both** texts (Rule 45(e)). Case links:
`https://shopview.testrail.io/index.php?/cases/view/<id>`

### Story 2 — Scope & Loading

| Anchor | Spec v28 text (verbatim) | Verdict | Evidence |
|---|---|---|---|
| **S2-N2** | *"If a single tab has no work orders but others do, that tab shows the no-data message while the others show their rows; the tab label count is \"(0)\"."* | **covered by C30460** | C30460 §4: *"When only one tab is empty, that tab shows the no-data message, no Totals row, and a \"(0)\" count while the populated tabs still show their rows normally."* → **refs backfill only** |
| **S2-R2** | *"Work orders whose status is Invoiced, Paid, or Declined never appear, in any tab, any Totals row, the summary strip, or any download."* | **case extended (recommended)** | C30457 §1: *"The Invoiced and Paid work orders do not appear in any tab, any Totals row, the summary strip, or the download."* — **"Declined" is asserted nowhere.** C30457 also mis-anchors to `S2-R5`, which in v28 is the LOADING requirement. → **`update_case` C30457: add Declined + re-anchor to S2-R2/S2-R3** |
| **S2-R3** | *"Part-sale work orders never appear."* | **covered by C30457** | C30457 §2: *"The part-sale work order does not appear anywhere either."* → refs backfill only |

### Story 3 — Tab Placement

| Anchor | Spec v28 text | Verdict | Evidence |
|---|---|---|---|
| **S3-R2** | *"A work order whose status is Complete is placed in the Completed tab."* | **covered by C30462** | C30462 §2: *"The Complete work order appears in the \"Completed\" tab and nowhere else."* → refs backfill only |
| **S3-R3** | *"A work order whose status is In Progress or Review is placed in the Approved - partially completed tab."* | **covered by C30462** | C30462 §3: *"The In Progress and Review work orders appear in the \"Approved - Partially Completed\" tab and nowhere else."* → refs backfill only |

### Story 4 — Columns, Money, Sorting

| Anchor | Spec v28 text | Verdict | Evidence |
|---|---|---|---|
| **S4-R4** | *"WO #, Status, Customer, Asset, VIN, Location, and Advisor are left-aligned; every other column is right-aligned."* | **covered by C30466** | C30466 §2–3: *"WO #, Status, Customer, Asset, VIN, Location, and Advisor are left-aligned. Every other column … is right-aligned."* → refs backfill only |
| **S4-E3** | *"A work order whose work-order-level discounts exceed its Earned plus Remaining shows a negative Total, formatted per S4-R14 (leading minus)."* | **NEW CASE AUTHORED** — `WIP-ERN-NEG-01` | Nothing asserts it. C30474 only formats *"a negative money value if one exists"*; C43817 asserts `Total = Earned + Remaining + Adjustments` with no negative case; C43816 asserts a fee/discount moves only Adjustments and Total. The **discount-exceeds-value** edge is untested |
| **S4-R9** (a) sort key | *"The Asset column sorts by unit number."* | **covered by C30485** | C30485 §4: *"The Asset column sorts by the Unit #."* — and note C30485 already resolved the older 2026-07-29 VIN-chain answer in favour of the unit number, so **v28 and the live case AGREE**; no contradiction to escalate |
| **S4-R9** (b) null placement | *"Rows with no unit number sort last on an ascending sort (and first when the sort is reversed); they are never interleaved with the numbered rows (Chris, 2026-08-13)."* | **NEW CASE AUTHORED** — `WIP-SRT-NUL-03` | This clause is asserted by **no case in the suite**. It is the whole of the 2026-08-13 change |
| **S4-R15a** | *"On a work order in the Completed tab, Labor Earned is the full quoted value of every approved labor line, whatever hours were clocked to it."* | **NEW CASE AUTHORED** — `WIP-ERN-CMP-02` | C43821 asserts only `Earned = Total − Adjustments` and `Remaining = $0.00` at ROW level. Neither the **labor/parts column split** nor the **"whatever hours were clocked"** contract — the actual SV-9119 defect — is asserted anywhere |
| **S4-R16a** | *"On a work order in the Completed tab, Labor Remaining is always $0.00."* | **NEW CASE AUTHORED** — `WIP-ERN-CMP-02` | as above |
| **S4-R18a** | *"On a work order in the Completed tab, Parts Earned is the sell value of every approved-line part and Parts Remaining is always $0.00."* | **NEW CASE AUTHORED** — `WIP-ERN-CMP-02` | as above |

### Story 5 — Summary Strip (the traceability cluster)

| Anchor | Spec v28 text (abridged where long) | Verdict | Evidence |
|---|---|---|---|
| **S5-R1** | seven figures in three groups, in order, drawn as boxes with + and = signs; no Adjustments figure | **covered by C30487 + C30520** | C30487 §1 lists all seven in the same order; C30520 §2 gives the two boxed equations joined by "+" and "=" with Estimates apart |
| **S5-R2** | *"Total Completed Work … equals Completed Work on Open Work Orders plus Work Orders Ready to Invoice."* | **covered by C30488** | C30488 §2: *"Total Completed Work equals Completed Work on Open Work Orders plus Work Orders Ready to Invoice, to the cent."* ⚠️ the **hero-size + coloured-underline** half is not asserted — extend candidate, visual only |
| **S5-R3** | *"Remaining Work equals Work Orders Not Started plus Remaining Work on Open Work Orders."* | **covered by C30489** | C30489 §1, verbatim match. ⚠️ same visual half missing |
| **S5-R4** | Work Orders Not Started = total approved value (earned + remaining) of the "Approved - not started" tab | **covered by C30490** | C30490 §1, verbatim match |
| **S5-R5** | Completed Work on Open Work Orders = total Earned of the "Approved - partially completed" tab | **covered by C30490** | C30490 §2 |
| **S5-R6** | Remaining Work on Open Work Orders = total Remaining of that tab | **covered by C30490** | C30490 §2 |
| **S5-R7** | Work Orders Ready to Invoice = total Earned of the "Completed" tab | **covered by C30490** | C30490 §3 |
| **S5-R8** | Estimates = total quoted value of the Estimates tab, at full opacity | **covered by C30491** | C30491 §1–2 |
| **S5-R9** | *"The Estimates figure is excluded from Total Earned and from Total Remaining."* | **covered by C30491** | C30491 §3: *"excluded from Total Completed Work and from Remaining Work."* **Note:** the spec sentence still uses the **retired v22 figure names** ("Total Earned"/"Total Remaining"), which S5-R1 itself abolished. The case uses the current names. Flagged as a spec-hygiene item, not a coverage gap |
| **S5-R10** | *"Every figure shows US-dollar currency with a leading \"$\", two decimals, and thousands separators."* | **covered by C30487** | C30487 §2, verbatim match |
| **S5-R12** | the seven tooltip strings, verbatim | **covered by C30493** | C30493 §1–7 carry all seven strings verbatim |
| **S5-R13** | *"The summary strip shows no Adjustments figure."* | **covered by C43818** | C43818 §2–3, verbatim match |
| **S5-R14** | tab selection highlights the figures that tab feeds; *"The highlight is a **soft violet** fill and ring …; the active tab shows in the accent color at a bolder weight."* | **case extended (recommended)** | C43838 §2 carries the full mapping. But C43838 §4 still says *"the design review described this glow as \"amber\", but on the current build it renders in the app's accent colour (a faded violet) … for the design owner to confirm."* **v28 has now ruled: violet.** → **`update_case` C43838: drop the open colour question, assert violet, add the active-tab weight** |

### Story 6 — Totals Row

| Anchor | Spec v28 text | Verdict | Evidence |
|---|---|---|---|
| **S6-N1** | *"If a tab has no visible jobs, it shows no Totals row."* | **covered by C30460** | C30460 §2 *"No tab shows a Totals row"* + §4 (the single-empty-tab case) → refs backfill only |

### Story 7 — Filters

| Anchor | Verdict | Reason |
|---|---|---|
| **S7-R7a** | **🛑 HELD — not a requirement** | **There is no `S7-R7a:` definition anywhere in v28.** The string occurs exactly once, inside the §5 change-log prose (*"…S7-R7a and reworded the §3 Key Decision…"*). The anchor regex matched a change-log mention and the verdict engine then scored a non-existent requirement as uncovered. **Nothing to author.** Fix belongs in `verify.py` (require a `ANCHOR:` definition before scoring) |

### Story 8 — Column Selection & Persistence

| Anchor | Spec v28 text | Verdict | Evidence |
|---|---|---|---|
| **S8-R5** | *"Whatever columns are shown, they appear in the fixed left-to-right order of S4-R1 … with Total always last."* | **covered by C30507** | C30507 §1–2, near-verbatim, and it enumerates the S4-R1 order |
| **S8-R6** | *"The column selection applies to every tab at once — the four tabs always show the same set of columns."* | **covered by C30507** | C30507 §3: *"The column selection applies to every tab at once — all four tabs show the same set of columns."* → refs backfill only |

### Story 9 — Exports

| Anchor | Spec v28 text | Verdict | Evidence |
|---|---|---|---|
| **S9-E2** | — | **🛑 HELD — not a requirement** | Same defect as S7-R7a: **no `S9-E2:` definition in v28**; the only occurrence is change-log prose (*"…S9-E2 and its Known-Limitations entry…"*). Nothing to author |
| **S9-R2** | *"Both downloads include only the columns currently shown, in the same left-to-right order as the screen, with Total last."* | **covered by C30511** | C30511 §1, verbatim match |
| **S9-R4** | *"Both downloads include a Totals row matching the on-screen Totals row for the tab."* | **covered by C30511** | C30511 §3, verbatim match |
| **S9-R14** | *"The Unit and VIN cells in both downloads carry exactly what the screen shows for that row, including the placeholders … Neither cell is ever blank where the screen showed text."* | **NEW CASE AUTHORED** — `WIP-EXP-UNI-04` | C30516 covers only the **column headings** ("Unit"/"Branch"). **No case asserts the cell CONTENTS or the placeholder carry-through.** This is a 2026-08-20 ruling |

### Story 10 — Visual Conformance

| Anchor | Spec v28 text | Verdict | Reason |
|---|---|---|---|
| **S10-R2** | *"The summary strip is shown as a bold band delineated by a top and bottom rule, above the tabs — not as separate cards."* | **🛑 HELD — source conflict, PO decision needed** | C30520 asserts the **opposite shape** and says so explicitly: *"The earlier specification described the strip as a bold band ruled top and bottom; the 13 August 2026 design review changed it to two grouped equations joined by + and = signs with Estimates apart, and we have taken the latest design review as prevailing."* Spec **v28 page last modified 2026-08-24** — later than the 13 Aug design review — but S10-R2 **still says band**, while S5-R1 in the SAME version describes the grouped boxes. Latest-wins cannot be applied because the two live sources disagree **inside the same document version**. Rule 58: hold and ask, never resolve from the build |

### Story 11 — Nightly Snapshot

| Anchor | Spec v28 text | Verdict | Evidence |
|---|---|---|---|
| **S11-R2** | *"Each snapshot row captures, at minimum: the work order; the tab …; the work order's status; that tab's Earned and Remaining values, **with the underlying Labor and Parts earned/remaining amounts**; **its Adjustments value**; the location and organization …; and the snapshot's calendar date."* | **case extended (recommended)** | C30528 §5 lists *"the work order, the tab (line-state bucket), its status, that tab's Earned value, that tab's Remaining value, the location and organization, and the calendar date"* — the **Labor/Parts breakdown is missing from the list**, and Adjustments appears only as the §3 placement rule. → **`update_case` C30528: add the Labor/Parts earned/remaining amounts and the Adjustments value to the field list.** Not authored as a second case: it would be a near-duplicate of C30528's own enumeration |

---

## RECONCILIATION

| | Count |
|---|---|
| Requirement rows in scope | **34** |
| Rows with a verdict | **34** |
| Un-verdicted rows | **0** |
| New cases authored | **4** (covering 5 requirement rows + the new half of S4-R9) |
| Held | **3** |
| `update_case` recommendations raised (NOT executed — out of this pass's scope) | **3** (C30457, C43838, C30528) |
| `refs` backfill recommendations raised (NOT executed) | **25 anchors across 12 cases** |
