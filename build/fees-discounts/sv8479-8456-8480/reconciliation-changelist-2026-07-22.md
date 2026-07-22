# Fees & Discounts — Spec-Relevance Reconciliation Change-List: SV-8479 / SV-8456 / SV-8480

> **Date:** 2026-07-22 · **Project:** Fees & Discounts V1 (ShopView) · **Epic:** SV-7387 · **PO:** Chris Ward.
> **Method:** `build/SPEC-RELEVANCE-RECONCILIATION-PROCESS.md` (step 3 relevance/obsolescence audit of the WHOLE suite).
> **Scope of this pass:** READ-ONLY analysis of the existing 184-active-case suite against the three newly-ingested
> tickets. **NO case edits, NO TestRail writes, NO deliverable regeneration, NO commit** — this is the change-list only.
> **Baseline reconciled-to:** requirements.md V1_3 (2026-07-17) + SV-8456 staging VIU pass (2026-07-21).
> **Inputs:** `requirements-SV-8479.md`, `requirements-SV-8456.md`, `requirements-SV-8480.md`, `INGEST-SUMMARY-2026-07-22.md`;
> `cases/*.json` (184 active); `testrail-id-map.csv`.
> **Rule 15:** every call below is derived from the ticket/spec text quoted in the ingest files, not from memory.
> **Rule 20:** every required change cites its driving ticket + item/spec anchor.
> **Recommendation legend:** EDIT = reword existing case · EDIT (label-only) = navigation-step label swap only ·
> RETIRE-dup = retire as duplicate (needs user ruling + snapshot) · NO CHANGE · covered-by-new = new SV-84xx case
> already being authored covers it (avoid duplicating) · needs-confirm = ambiguity flagged for user/Chris.

---

## SUMMARY COUNTS

| Ticket | Existing cases affected | EDIT (primary) | EDIT (label-only sweep) | NO CHANGE | covered-by-new | needs-confirm / flags |
|---|---|---|---|---|---|---|
| **SV-8480** (S3-R18 line total) | **1** | 1 (FD-INLINE-004) | 0 | 0 contradicting/buggy | 1 new calc case (worked example) | overlap flag on FD-INLINE-004 |
| **SV-8479** (20 UI corrections) | **53 EDIT + 7 needs-confirm** | 18 | 35 | 3 (FD-PCOL-001, FD-FIN-003, FD-INLINE-003) | 5 items (6,15,17,19,20) | 7 FD-CUST (customer-tab, out of scope); 2 retire-candidate flags; item-1 re-open deviation; Picture-26 gap |
| **SV-8456** (Service pivot) | **0** | 0 | 0 | whole suite already consistent | 0 | 0 stragglers found |

**Headline:** No existing case asserts the OLD buggy line-total (SV-8480 aligns with the suite). SV-8479 is a broad
wording sweep — 18 cases carry stale UI assertions (badges, old menu labels, old modal titles/sublines, old card order,
old entry-point placement), plus a 35-case navigation label sweep; 5 SV-8479 items have no existing case (author new).
SV-8456 is fully reconciled — zero Finance-gate stragglers.

---

## SV-8480 — Line-total summation fix (spec anchor S3-R18)

**Rule that must hold (S3-R18):** collapsed line Total = Labor (gross) + Parts (gross) + every one of that line's own
signed fee/discount amounts (fees add, discounts subtract), using the amounts shown in the rows beneath. Worked example:
$250.00 + $50.00 + $20.00 + $2.20 = **$322.20**. No-fee line unchanged; documents' grand total unchanged (no double-count);
flag-off org = gross-only.

| Internal ID | C-id | Current expected (short) | Required change | Driver (ticket + anchor) | Recommendation |
|---|---|---|---|---|---|
| FD-INLINE-004 | C28457 | "The Total column stacks the base total and each fee/discount row, so the shown total matches the rows. This is display only and changes no stored value." | Strengthen to state the **explicit S3-R18 formula** (Line Total = Labor gross + Parts gross + each line fee/discount amount, signed; fees add, discounts subtract) and add the **$322.20 worked example** + the no-fee-line-unchanged sub-check. Wording already asserts the CORRECT (post-fix) rollup — this is a precision upgrade, not a contradiction. | SV-8480 (S3-R18; Story SV-8279) | **EDIT** (strengthen) — **overlap flag:** the NEW SV-8480 calc case being authored will cover the worked example directly; keep FD-INLINE-004 as the inline-display case and let the new case own the calc/document/flag-off ACs, to avoid duplication. |

**Cases checked and clean (no buggy assertion):** FD-CALC-001..017 (individual fee math + order-of-operations, not the
collapsed line-total display), FD-STACK-001/002, FD-FIN-001/002. None assert "Labor + Parts only" — **0 contradicting cases**.

---

## SV-8479 — 20 UI corrections (items 1–12 Work Order, 13–20 Parts Sale)

> Regression preserves (NOTES): the jurisdiction tax note ("Tax treatment varies by jurisdiction…") and the
> "Pass convenience fee to customer" banner must remain — already covered by FD-WO-016 / FD-TMPL-018 / FD-PSALE-001.

### A. Primary EDITs (stale UI behavior/expected wording is the subject)

| Internal ID | C-id | Current expected (short) | Required change | Driver (ticket + item) | Recommendation |
|---|---|---|---|---|---|
| FD-LABOR-001 | C28439 | Dialog "Add new fee/discount"; subtitle "Applying to: <line name>"; opens from the **labor line's ⋮ menu** | Entry point moves to a **three-dot on the LEFT of the first assigned technician / "Unassigned"**; menu item "**Add Labor Fee / Discount**"; modal title "**New Labor Fee / Discount**"; subline "**Applying To: Line {N} Labor — {line name}**" | SV-8479 items 1 + 8 | **EDIT** |
| FD-LABOR-003 | C28441 | "Each labor line row shows its own ⋮ menu on hover; each menu has an 'Add Fee/Discount' item for that line" | Rewrite: labor add entry point is the **three-dot to the LEFT of the first technician/"Unassigned"**, not the line-row ⋮; label "**Add Labor Fee / Discount**" | SV-8479 item 1 | **EDIT** |
| FD-LABOR-007 | C28445 | "'Add Fee/Discount' is not shown for the labor line" (permission-hidden) | Label → "**Add Labor Fee / Discount**" (behavior/permission unchanged) | SV-8479 item 1 | **EDIT (label-only)** |
| FD-PART-001 | C28446 | Dialog "Add new fee/discount"; subtitle "Applying to: <part name>"; from part ⋮ "Add Fee/Discount" | Menu item "**Add Part Fee / Discount**"; modal title "**New Part Fee / Discount**"; subline "**Applying To: Line {N} Part — {part name}**" | SV-8479 items 2 + 9 | **EDIT** |
| FD-PART-002 | C28447 | "The inline part row shows the name with a −$5.00 flat **rate badge** and a resolved amount of −$15.00" | Remove **badge** → plain text; per item-4 sign convention (fees "X%" no sign, % discounts "−X%"; flat = name only) | SV-8479 item 4 | **EDIT** |
| FD-INLINE-001 | C28454 | "…on a row **labelled 'Fees/Discounts'**"; "a signed rate **badge** (e.g. '−5%')" | **Blank the left-column label** (item 3); amounts render as **plain text, no badge** (item 4) | SV-8479 items 3 + 4 | **EDIT** |
| FD-INLINE-002 | C28455 | "…signed rate **badge** (a dollar amount for a flat, or a percentage)" | Remove badge → plain text; item-4 sign convention | SV-8479 item 4 | **EDIT** |
| FD-FIN-004 | C28467 | Card entry shows "name, a signed rate **badge** (e.g. '−8%' or a dollar amount) and resolved amount in grey" | Card renders **plain text**: name + percent in brackets inline — discount "**(−5%)**", fee "**(5%)**"; flat = name only (no brackets) (item 5). **Add the card disclaimer** "Applies to the whole work order, after all other fees & discounts." (item 6) | SV-8479 items 5 + 6 | **EDIT** |
| FD-FIN-001 | C28464 | "The row sits with the other money rows (Parts, Labor, Shop Supplies, Subtotal, GST, Total, Balance)" — position not pinned | Pin position: "Fees & Discounts (N)" line renders **directly above Subtotal** (was below Balance), amount in the same column; **hidden when zero** | SV-8479 item 7 | **EDIT** |
| FD-WO-001 | C28424 | Dialog "Add new fee/discount"; "There is no 'Applying to' line" | Toolbar menu item "**Add Work Order Fee / Discount**" (item 10); modal title "**New Work Order Fee / Discount**"; **ADD** subline "**Applying To: Entire Work Order**" (item 11 — reverses the "no Applying-to line" assertion) | SV-8479 items 10 + 11 | **EDIT** |
| FD-WO-013 | C28436 | "'Add Fee/Discount' is not shown" (permission-hidden) | Label → "**Add Work Order Fee / Discount**" (behavior unchanged) | SV-8479 item 10 | **EDIT (label-only)** |
| FD-STATS-001 | C28459 | "Each row shows the name, a value/percentage … and the signed resolved amount on the right" — no column headings | Add right-side column headings "**%**" and "**Amount**" (in that order); blank % cell for flat fees | SV-8479 item 12 | **EDIT** |
| FD-CALC-001 | C28568 | "It shows a '+10%' **rate badge** and +$15.00 in grey" | Remove "badge" → plain-text "+10%" (calc math unchanged) | SV-8479 item 4 | **EDIT (minor)** |
| FD-PCOL-002 | C28470 | "The cell shows the first fee/discount followed by a '+N' **badge**" | Values render as **plain text (no badge)**; overflow count "**+N**" stays (as plain text), item-16 sign convention | SV-8479 item 16 | **EDIT** |
| FD-PCOL-003 | C28471 | "The cell shows a '**+ Add**' button … Clicking it opens the Add fee/discount dialog" | **"+ Add" button REMOVED** (item 13); empty-part entry is now the **per-row three-dot → "Add Part Fee / Discount"** (item 14); modal title "**New Part Fee / Discount**" (item 18) | SV-8479 items 13 + 14 + 18 | **EDIT (rescope)** — see retire-candidate flag F2 |
| FD-PCOL-006 | C28474 | "The part's cell goes back to the '**+ Add**' empty state" | Empty state has **no "+ Add" button**; add via the per-row three-dot menu | SV-8479 item 13 | **EDIT** |
| FD-PCOL-007 | C28475 | "The '**+ Add**' button is disabled when the sale/work order cannot be edited" | "+ Add" no longer exists — rescope to: the **per-row three-dot add** is unavailable/blocked when the sale/WO cannot be edited | SV-8479 item 13 | **EDIT (rescope)** — see retire-candidate flag F2 |
| FD-PSALE-001 | C29918 | Navigates the parts-sale add dialog titled "Add new fee/discount"; "Add Fee / Discount" menu; "Applying to:" subline (jurisdiction-note case) | Update the surface wording it relies on: menu "**Add Part Fee / Discount**" (item 14); per-part modal title "**New Part Fee / Discount**" (item 18); whole-sale modal title "**New Parts Sale Fee / Discount**" + subline "**Applying To: Entire Parts Sale**" (item 19). Jurisdiction-note assertion itself unchanged. | SV-8479 items 14 + 18 + 19 | **EDIT** |

### B. Label-only sweep (navigation steps reference the OLD menu label "Add Fee/Discount" or OLD modal title "Add new fee/discount"; behavior/expected unchanged — swap to the correct new label for that surface)

**Driver:** SV-8479 item 1 (labor → "Add Labor Fee / Discount"), item 2/14 (part → "Add Part Fee / Discount"),
item 10 (whole WO → "Add Work Order Fee / Discount"), items 8/9/11/18/19 (modal titles "New … Fee / Discount").
**Recommendation for all 35: EDIT (label-only).**

- **Whole-WO surface** (→ "Add Work Order Fee / Discount" menu / "New Work Order Fee / Discount" title): FD-WO-002 C28425, FD-WO-003 C28426, FD-WO-004 C28427, FD-WO-005 C28428, FD-WO-006 C28429, FD-WO-007 C28430, FD-WO-008 C28431, FD-WO-009 C28432, FD-WO-010 C28433, FD-WO-011 C28434, FD-WO-012 C28435, FD-WO-014 C28437, FD-WO-015 C28438, FD-WO-016 C29441, FD-STACK-003 C28484, FD-PROC-005 C28523, FD-PERM-011 C28595, FD-CALC-002 C28569, FD-CALC-003 C28570, FD-CALC-004 C28571, FD-CALC-005 C28572, FD-CALC-006 C28573, FD-CALC-007 C28574, FD-CALC-008 C28575
- **Labor-line surface** (→ "Add Labor Fee / Discount" / "New Labor Fee / Discount"): FD-LABOR-002 C28440, FD-LABOR-004 C28442
- **Part-line surface** (→ "Add Part Fee / Discount" / "New Part Fee / Discount"): FD-PART-003 C28448, FD-PART-004 C28449
- **Mixed labor+part navigation** (both labels): FD-TMPL-010 C28511
- **Modal-title only** (→ "New … Fee / Discount", surface per case): FD-VAL-001 C28599, FD-VAL-002 C28600, FD-VAL-003 C28601, FD-VAL-004 C28602, FD-VAL-005 C28603, FD-VAL-006 C28604

> Note: each label-only case must be checked at edit-time for which surface it drives (labor / part / whole-WO) so the
> correct new label is applied — the surface is stated per group above.

### C. NO CHANGE (checked against SV-8479, still correct)

| Internal ID | C-id | Why no change |
|---|---|---|
| FD-PCOL-001 | C28469 | Cell shows name + rate as "Military Discount −10%" — already plain text with the correct discount "−" sign (item-16 convention); no badge asserted. |
| FD-FIN-003 | C28466 | Already asserts the "Fees & Discounts" row is hidden with no fees/discounts — consistent with item 7 "hidden when zero". |
| FD-INLINE-003 | C28456 | "Show N more" toggle behavior — SV-8479 does not change this control. |
| FD-TMPL-002 | C28503 | Already asserts "All columns are plain text with no coloured badges, left-aligned" — this is the correct post-SV-8456 state; SV-8479 item 5/16 badge removal does not regress it. |

### D. Covered-by-new (no existing case asserts this — author a NEW SV-8479 case; do NOT duplicate)

| SV-8479 item | Surface / requirement | Existing coverage | Recommendation |
|---|---|---|---|
| item 6 | WO Fees & Discounts card disclaimer "Applies to the whole work order, after all other fees & discounts." | none (can be folded into FD-FIN-004 EDIT above) | covered-by-new OR fold into FD-FIN-004 |
| item 15 | Parts Sale Fees & Discounts **card** renders plain text (brackets/sign, flat name-only; "$" inline) | none (FD-FIN-* are WO-only; no parts-sale card case) | covered-by-new |
| item 17 | Parts Sale **Financial Info** card "Fees & Discounts (N)" line directly above Subtotal, hidden when zero | none (FD-FIN-* are WO-only) | covered-by-new |
| item 19 | Parts-sale **whole-sale modal** title "New Parts Sale Fee / Discount" + subline "Applying To: Entire Parts Sale" | partial (FD-PSALE-001 edit touches title) — no dedicated whole-sale-modal case | covered-by-new (+ FD-PSALE-001 edit) |
| item 20 | Parts Sale **Statistics** "%" and "Amount" column headings | none (FD-STATS-* are WO-only) | covered-by-new |

---

## SV-8456 — Settings→Service permission pivot (verification pass)

**Task:** confirm no existing case still contradicts the Settings→Service pivot (F&D gated by Settings → Service, not Finance).

**Result: 0 stragglers.** Every gating case already asserts the correct Service gate:

| Internal ID | C-id | Assertion (already correct) |
|---|---|---|
| FD-PERM-007 | C28591 | "create/edit/delete of a fee/discount template needs Settings → Service … Settings → Finance alone does NOT grant access" |
| FD-TMPL-016 | C28517 | "admin Fees & Discounts page needs the Settings → Service permission … Settings → Finance alone does not grant access" |
| FD-PERM-012 | C29922 | "Fees & Discounts settings page gated by settingsService (not settingsFinance)" (dev-authored, reconciled 2026-07-21) |
| FD-PERM-013 | C29923 | Service admin can complete the template delete flow (dev-authored) |

The five "Finance" grep hits (FD-WO-016, FD-TMPL-016, FD-TMPL-018, FD-PERM-007, FD-PERM-012) are all correct usages:
"See Financial Data" / "Manage Finance Settings" (distinct permissions) or explicit "Service-not-Finance" assertions.
**No case gates F&D by Settings → Finance.** SV-8456 = NO DELTA confirmed (matches INGEST-SUMMARY verdict).

---

## AMBIGUITIES / FLAGS FOR USER OR CHRIS

- **F1 — Item 1 is REJECTED FROM TESTING (live deviation).** SV-8479 item 1 requires the labor three-dot on the **LEFT**
  of "Unassigned", but QA (2026-07-22) found it landed to the **RIGHT** on staging; the ticket is re-opened for this one
  fix. A case written to the spec ("left of Unassigned") will currently **FAIL / show a live deviation** on staging until
  Nikola re-fixes. Recommendation: write FD-LABOR-001/003 expected to spec (LEFT) and mark **VIU-pending / expect-deviation**
  until the refix ships. **Confirm with user how to hold this** (author-to-spec-and-flag vs wait for refix).
- **F2 — FD-PCOL-003 / FD-PCOL-007 retire-candidate.** Both are built around the "+ Add" button that item 13 REMOVES.
  I recommend **EDIT (rescope)** to the new three-dot entry point (the underlying "add a fee to a fee-less part" and
  "blocked when uneditable" behaviors still need coverage), **but** if the user prefers, they could be **RETIRED as obsolete**
  and folded into the new SV-8479 parts-sale cases. Retirement needs an explicit user ruling + snapshot (process step 4).
- **F3 — FD-PCOL section naming vs Parts Sale.** The FD-PCOL cases are titled "Parts page 'Fees & Discounts' column" but
  map to Story 11 (Parts Sale). SV-8479 items 13/14/16 target the **Parts Sale parts table** — the SAME column. To avoid
  duplication, **EDIT the existing FD-PCOL cases** for items 13/14/16 and author NEW cases only for items 15/17/19/20
  (card, financial-info line, whole-sale modal, statistics) which have no existing coverage.
- **F4 — 7 FD-CUST cases reference an "Add Fee/Discount" button (customer tab), OUT of SV-8479 scope.** SV-8479's 20 items
  are Work Order + Parts Sale only; the customer Fees & Discounts tab is not in scope. FD-CUST-002 C28486, FD-CUST-003 C28487,
  FD-CUST-004 C28488, FD-CUST-005 C28489, FD-CUST-006 C28490, FD-CUST-008 C28492, FD-CUST-015 C28499 keep their current
  "Add Fee/Discount" button label. **needs-confirm:** does Chris want the customer-tab button renamed for consistency, or
  is it intentionally left as-is? (Not changing them for now.)
- **F5 — Picture 26 gap (item 19).** The SV-8479 description references "Picture 26" (parts-sale whole-sale three-dot
  context) that was **not attached**. The whole-sale entry-point label "Add Parts Sale Fee / Discount" comes from prose
  only — flag for live VIU confirmation, do not invent.
- **F6 — Item 5 Picture 6 shows "(5%)" for a discount.** The ticket NOTE resolves this: the sign rule wins — a discount
  must render "(−5%)". FD-FIN-004 edit should use the **sign-rule** wording, not the Picture-6 literal.

---

## Traceability (Rule 20)
- **SV-8480** — Story Defect (Done) · Parent SV-8279 (Story 3) · Epic SV-7387 · spec anchor **S3-R18**.
- **SV-8479** — Story Defect (Rejected from Testing) · Parent SV-8288 (Story 12) · Epic SV-7387 · Predecessor SV-8456 ·
  spec anchors = items 1–20 + NOTES.
- **SV-8456** — Story Defect (Done) · Parent SV-8288 · Epic SV-7387 · anchors = 8 corrections + Settings→Service pivot
  (C29922/C29923 = FD-PERM-012/013).

## Next steps (NOT executed here — require separate user authorization per Standing Rules 6 & 11)
1. Confirm which process(es) to run for the SV-8479/SV-8480 edits (BUILD-ACCURATE-WORDING-VIU and/or full reconciliation).
2. Resolve flags F1–F6 (esp. item-1 deviation handling and the FD-PCOL retire-vs-rescope ruling).
3. Apply approved EDITs to `cases/*.json`; author new cases for SV-8480 (worked example) + SV-8479 items 6/15/17/19/20.
4. Live staging VIU of every touched case (Rule 10/12/13).
5. Regenerate ALL deliverables + grep-verify stale phrases = 0 (process steps 5–6); then push to TestRail under fresh authorization.
