# Fees & Discounts V1 — Closeout Reconciliation (spec + designs + epic + PO answers)

> **Purpose:** reconcile the v1 closeout package against our current cases /
> findings / deviations. **INGEST + DIFF + RECONCILE + PROPOSE only.** No case
> JSON, no `requirements.md` body, and no TestRail were edited by this task.
> Everything below is a **proposal** for a later editing pass.
>
> **Inputs ingested (2026-07-09):**
> - Updated spec `d2d8b21d-FeesDiscountsV1_1.doc` → `spec-v1-source.md`
> - Design bundles (×3, byte-identical) → `design-v1-catalog.md`
> - PO answer sheet (Google Sheet, answered by Chris Ward, the F&D PO) → `data-sheet-source.(xlsx/csv/md)`
> - Epic SV-7387 → `epic-content.md`
>
> **Our findings read for this reconciliation:** `viu-qb-findings.md`,
> `viu-findings.md`, `bugs-log.md`, `Deviations-and-Questions-for-PO.md`,
> `PO-Questions-SIMPLE.md`, `cases/*.json` (182 cases), `PROJECT-STATE.md`.

---

## 0. Headline conclusions

1. **The "updated" spec is not new.** `FeesDiscountsV1_1.doc` differs from the
   spec our `requirements.md` was built on by exactly **one line** (Epic field
   `TBD` → `SV-7387`). No calculation-contract or story change. **No
   `requirements.md` body rewrite is warranted from the spec diff.**
2. **The design bundle is one bundle ×3** (identical). It confirms two design
   intents the LIVE BUILD regressed: **Statistics per-row layout** and **line-level
   show-more collapse**.
3. **The data sheet is the PO answer sheet** — it answers **6 of our 8 PO
   threads**, converting them from "awaiting ruling" to definite outcomes.
4. **US-tax-only is the biggest reclassifier.** We VIU'd on a **GST (Canadian)**
   org; the epic scopes v1 to **US SALES TAX ONLY** (Canada GST/PST is Phase 2,
   F&D-Phase2-3). Every GST-based money finding must be **re-evaluated under US
   tax** before it is called a v1 bug.
5. **QB is v1-generic-account only.** Per-template Product/Service mapping is
   **Phase 2 (out of scope)**. Our 16 FD-QB cases all target the v1 generic
   Fee/Discount-item behavior — **none** test per-template mapping, so no FD-QB
   case is out of scope; they just need the healthy-env retest that the 500
   incident blocked.

---

## 1. US-tax-only impact on our GST findings (re-evaluate before calling a v1 bug)

We ran VIU on `qb.qa.shopview.com`, a **Canadian GST org (5% GST)**. v1 is **US
sales-tax only**. Canada GST/PST is explicitly a Phase-2 follow-up
(F&D-Phase2-3). Therefore any finding whose numbers or root cause depend on the
GST tax model may be an **environment artifact out of v1 scope**, not a v1 defect.

| Finding | GST dependence | Assessment under US tax | Outcome |
|---|---|---|---|
| **FDBUG-1** (WO/estimate Subtotal & Total EXCLUDE net adjustment amounts while **GST** includes their tax) | **High** — the symptom is defined in terms of GST inclusion; also **did NOT reproduce in batch 4** on estimates | The *structural* half (subtotal excluding the adjustment amount) is tax-model-independent and would still be wrong under US tax IF it reproduces; the *tax* half is GST-specific. Given batch-4 non-repro + GST framing, treat as **inconclusive**. | **GST-artifact-re-eval** — re-run on a **US sales-tax org** with a controlled repro (fees-only WO + Financial Info surface, and a discount-heavy estimate) before filing. Keep FDBUG-1 draft open but flagged "GST-env, needs US repro." |
| **FDBUG-2** (Processing-fee % of Grand Total base wrongly **includes whole-WO fees + their tax**; observed `3% × (292.83 + 212.00) × 1.05`) | **Partial** — the `×1.05` is GST; the base-composition error (including the $212 whole-WO fees) is **NOT** tax-model dependent | The core defect — whole-WO adjustments leaking into the Processing-Fee base — violates §5-R4 regardless of tax rate. Only the exact dollar figure changes under US tax. | **Still-open (defect likely holds)** — re-verify the *number* on a US org, but the structural violation is real. Keep as a bug; note the repro figure is GST-rated. |
| **The 4 GST-worded cases**: **FD-EDIT-002, FD-DOC-011, FD-CALC-011, FD-CALC-014** | Expected results quote **GST / 5%** examples | v1 ships US sales tax; GST worked examples are off-model for v1. | **GST-artifact-re-eval** — propose re-expressing expected results with a **US sales-tax** worked example (single sales-tax rate), and re-verify on a US org. Do not treat GST-specific numeric mismatches as v1 bugs. |
| General **tax-base / taxable-shift** cases (§5-R11 rows across FD-CALC / FD-QB-016 / FD-DOC) | Behavior identical in structure; only the *rate* differs | Structure (taxable fee raises taxable amount, taxable discount lowers it) is the same in US and Canada. | **RESOLVED-verify** — safe under US tax; verify numbers with a US rate. |

**Net:** the two "money bug" headliners (FDBUG-1, FDBUG-2) are the ones most at
risk of being GST-env artifacts. **Recommendation: obtain / configure a US
sales-tax org and re-run the FDBUG-1 and FDBUG-2 repros before filing either as a
v1 defect.** The negative-total floor rules (S6-R10x) were themselves a
"tax-compliance correction for both US and Canada" per the spec Change Log, so the
FD-QB-012…015 floor/credit cases are model-safe (verify numbers).

---

## 2. QB sync — v1 vs Phase 2 re-scoping (FD-QB-*)

**v1 (in scope):** each fee/discount is its **own invoice line item** (fee +,
discount −) posting to the location's **generic Fee item / Discount item**, with
tax code following the taxable setting; a **mapping guard** blocks adds until the
Fee/Discount items are mapped; single-Class-applied-uniformly; net-subtotal $0.00
floor + capped discount lines + carried customer credit as a goodwill credit memo.

**Phase 2 (OUT of scope):** **per-template QB Product/Service mapping** (choosing
a specific item per template — F&D-Phase2-1) and **per-class allocation** of
fees/discounts across classes (spec §2).

| Case | Targets | v1 or Phase 2 | Outcome |
|---|---|---|---|
| FD-QB-001 own line item (fee +/discount −) | S6-R1 | **v1** | RESOLVED-verify |
| FD-QB-002 line description = name; **item = mapped generic Fee/Discount item** | S6-R3/R5 | **v1** (explicitly the *generic* item, NOT per-template) | RESOLVED-verify |
| FD-QB-003 $0.00 skipped | S6-R1/§5-R8 | **v1** | RESOLVED-verify |
| FD-QB-004/005/006 mapping guard blocks adds (per kind, all surfaces) | S6-R6…R6a | **v1** | RESOLVED-verify |
| FD-QB-007 auto-apply default blocked while item unmapped | S6-R6b | **v1** | RESOLVED-verify |
| FD-QB-008 non-auto template always allowed / no block when QB off | S6-R6c | **v1** | RESOLVED-verify |
| FD-QB-009 unmap → Unexported Items (recoverable) | S6-R7 | **v1** | RESOLVED-verify |
| FD-QB-010 **single Class** applied to every line | S6-R8 | **v1** (single-class is in scope; per-class *allocation* is Phase 2) | RESOLVED-verify |
| FD-QB-011 stale/deleted Class aborts sync | S6-R9 | **v1** | RESOLVED-verify |
| FD-QB-012 net-subtotal $0.00 floor worked example | S6-R10x | **v1** | RESOLVED-verify |
| FD-QB-013 capped discount lines, largest-remainder pennies | S6-R10d | **v1** | RESOLVED-verify |
| FD-QB-014 warn/confirm before carrying excess | S6-R12 | **v1** | RESOLVED-verify |
| FD-QB-015 excess → customer credit → goodwill credit memo | S6-R11/R13 | **v1** | RESOLVED-verify |
| FD-QB-016 synced line tax follows taxable setting | S6-R2 | **v1** | RESOLVED-verify (US rate) |

**Result: all 16 FD-QB cases are v1.** None test per-template mapping, so **no
FD-QB case needs to be marked out-of-scope.** They were blocked only by the
sv7387api **HTTP 500 incident** (NOTE-FD-8), not by scope. **Proposed action:**
retest FD-QB-* on a healthy env **that uses US sales tax** (so FD-QB-016 / the
floor cases resolve with US numbers).

**NOTE-FD-4 (`kind:processing_fee` accepted by BE):** unrelated to QB mapping —
it is the Processing-Fee data-model note (Story 8), resolved by PO Q3 below, not a
Phase-2 QB item.

**Explicit Phase-2 note for the record:** if we later add any case that expects a
fee/discount to post to a **template-specific** QB item (rather than the generic
Fee/Discount item), that case is **Phase 2 (F&D-Phase2-1)** and must be marked
out-of-v1-scope. We currently have **none**.

---

## 3. The 6 PO questions — answered by the PO answer sheet

| Q# (sheet) | Our thread | PO answer | Outcome | Affected cases | Proposed action (NO edit made) |
|---|---|---|---|---|---|
| 1 Stats combined vs per-row | Part-1 #1 (BUG-FD-2 / FDBUG-6) | **B — story defect; per-row was in Branko's design, regressed in spec** | **RESOLVED → CONFIRMED DEFECT.** Our cases already expect per-row = correct. | FD-STATS-001 (+002/004) | Keep spec expected (per-row). Re-class BUG-FD-2 from "deviation/confirm" to **confirmed defect**; add a dev ticket. Design evidence: `stats-table.png`. |
| 2 Customer default adds once | Part-1 #4 (BUG-FD-1) | **A — once is correct, settled** | **RESOLVED.** Single-add is intended (S9 dedupe effectively confirmed). | FD-CUST-016, FD-VAL-007 | Re-scope the double-add EXPECTED → **exactly one adjustment**. Close BUG-FD-1 as fixed/settled. |
| 3 Processing Fee not visible but partly ready | Part-1 #5 (NOTE-FD-4, Story 8) | **B — should be part of this release; add the visible option** | **RESOLVED → IN-SCOPE build gap.** BE accepts it; **builder UI is a v1 requirement that is missing.** | FD-PROC-001…014 | Keep Story-8 cases as v1. File the **missing Processing-Fee builder UI** as an in-scope defect (do NOT descope to Phase 2). Note the epic's "what shipped" list omits it, but the PO ruling makes it in-scope. |
| 4 Add button clickable before valid | Part-1 #6 (BUG-FD-4) | **B — grey out until valid** | **RESOLVED → CONFIRMED DEFECT.** Our expected (disabled-until-valid) = correct. | FD-WO-005, FD-VAL-001 | Keep spec expected (disabled-until-valid). Re-class BUG-FD-4 to confirmed defect; dev ticket. |
| 5 Multiple line fees show at once, no show-more | Part-1 #7 (BUG-FD-5) | **B — show-more; was in the design, under-specified in spec** | **RESOLVED → CONFIRMED DEFECT.** Our expected (show-more) = correct. | FD-INLINE-003 | Keep spec expected (show-more). Re-class BUG-FD-5 to confirmed defect; dev ticket. Design evidence: `*show-more*.png`. |
| 6 Customer-defaults one-at-a-time dropdown | Part-1 #8 (NOTE-FD-5 / FDBUG-7) | **A — keep single-at-a-time (deliberate judgement call)** | **RESOLVED → ACCEPTED behavior.** The single-select dropdown is intended. | FD-CUST-005; also FD-CUST-003/004/006/007 | Adopt the **case-update proposals** (rewrite to single-select dropdown + Save; single-add toast; "No results" empty state; direct trash remove). Drop the "checkbox multi-select" spec wording. Close FDBUG-7 as won't-fix (accepted). |

**Two PO threads NOT in the sheet** (correctly — dev/enforcement questions, not
product): **Part-1 #2 & #3 = BUG-FD-3** whole-WO permission BE-enforcement.
→ **still-open (dev decision).** Cases FD-PERM-002, FD-WO-013. Consistent with the
project's documented enforcement model (granular perms are FE display gates). No
PO answer; route to dev. Note the spec Key Decisions confirm F&D adds **no new
permission** (reuses Custom Roles SV-7388; remove uses "Create and Edit", add/edit
also needs "See Financial Data") — so the *mapping* is confirmed correct; only
whether the backend should enforce the FE gate remains open.

---

## 4. Epic-confirmed shipped behaviors vs our cases

| Epic "shipped" item | Our coverage | Outcome |
|---|---|---|
| **post-invoice lock** (no edit/delete after invoiced) | FD-WO-012, FD-PERM-011 | **RESOLVED-verify** — cases match shipped behavior (S1-N1/S3-R1b). |
| **cross-tenant isolation** | **No dedicated case** | **Coverage gap** — propose a NEW case (see §5). |
| **cascade cleanup** (delete template/customer removes default rows) | FD-TMPL-008 (+002/007), and the S9 dedupe behind PO-Q2 | **RESOLVED-verify** — matches S7-R4. This also *explains* PO-Q2: cascade cleanup + dedupe = no orphan/double default rows. |
| **standardized delete confirmation** (same dialog as pricing matrices) | NOTE-FD-7 / FD-TMPL-008 flagged our spec wording as "differs" | **RECLASSIFY → the live dialog IS correct.** Epic says the standardized (pricing-matrix) dialog is intended, so our spec-quoted wording ("Are you sure you want to delete this fee/discount?") is the **stale text**; the live "Delete Template / This template is set as a default for N customer(s)…" is the intended standardized dialog. **Adopt the FD-TMPL-008 case-update.** |
| **taxable/non-taxable toggle with correct tax-base shifting in ShopView AND QB** | FD-CALC (taxable rows), FD-QB-016 | **RESOLVED-verify** (US rate). The toggle-vs-dropdown control drift (NOTE-FD-7a) is a benign case-update. |
| **QB = each fee/discount its own line with correct tax code** | FD-QB-001/002/016 | **RESOLVED-verify** (see §2). |
| **5 calc types incl. "% labor+parts"** | FD-CALC / FD-WO method cases | **Caveat:** spec §5-R4 says "% of Labor + Parts" is **removed from the dropdown** (legacy-only). Confirm **no new-adjustment case selects "% Labor+Parts" from a dropdown**; only a legacy-resolution case may reference it. Propose an audit of FD-CALC method-picker cases. |

---

## 5. Proposed case-impact list (NO edits made — proposals only)

**A. Keep spec expected + re-class the finding to a CONFIRMED DEFECT (PO said fix it):**
- FD-STATS-001 (+ FD-STATS-002, FD-STATS-004) — per-row Statistics (PO Q1=B).
- FD-WO-005, FD-VAL-001 — Add button disabled-until-valid (PO Q4=B).
- FD-INLINE-003 — line-level show-more collapse (PO Q5=B).
- FD-PROC-001…014 — keep as v1; **file missing Processing-Fee builder UI as an
  in-scope defect** (PO Q3=B).

**B. Re-scope EXPECTED (PO settled the behavior):**
- FD-CUST-016, FD-VAL-007 — change EXPECTED from double-add → **exactly one**
  adjustment (PO Q2=A). Close BUG-FD-1.

**C. Adopt case-update wording (behavior accepted / standardized dialog):**
- FD-CUST-003/004/005/006/007 — single-select dropdown + Save; single-add;
  "No results" empty state; direct trash remove (PO Q6=A). Close FDBUG-7.
- FD-TMPL-008 (and NOTE-FD-7b) — adopt the live "Delete Template / default for N
  customer(s)" standardized dialog wording (epic: standardized delete confirm).
- The 13 pure label/copy Part-2 rows (FD-WO-001, FD-LABOR-001, FD-FIN-004,
  FD-REMOVE-001, FD-TMPL-001/003/004/006, FD-CUST-007, FD-PROC-008, etc.) stay as
  previously proposed in `Deviations-and-Questions-for-PO.md` Part 2 — spec diff
  doesn't change them.

**D. GST → US tax re-evaluation (re-verify on a US sales-tax org; re-word GST examples):**
- FD-EDIT-002, FD-DOC-011, FD-CALC-011, FD-CALC-014 — replace GST/5% worked
  examples with US sales-tax examples; re-verify.
- FDBUG-1 (FD-DOC-011 dependent) — controlled US-tax repro before filing.
- FDBUG-2 (FD-PROC-009/013 dependents) — re-verify the number on US tax; the
  structural base-composition defect likely stands.

**E. QB retest (v1, healthy US-tax env):**
- FD-QB-001…016 — all v1; retest once the sv7387api 500 incident is cleared and on
  a US sales-tax org (NOTE-FD-8).

**F. Coverage gap — propose a NEW case:**
- **cross-tenant isolation** (epic-shipped, no case): propose e.g. `FD-SEC-001`
  "Verify a location's F&D templates / customer defaults / WO adjustments are not
  visible or usable from another tenant/organization." Place in an **API section**
  if it asserts API status/isolation, else a functional Security/Permissions
  section (standing rule #4).

**G. Still-open (route to dev, no PO answer):**
- FD-PERM-002, FD-WO-013 (BUG-FD-3) — whether whole-WO adjustment writes should be
  BE-enforced or remain FE-gated. Permission *mapping* confirmed by spec Key
  Decisions; only enforcement depth open.
- FDBUG-9 (FD-TMPL-011, maxCap 0), FDBUG-11 (FD-HIST-002, missing Type line),
  FDBUG-13 (FD-TMPL-010, line-scope picker), FDBUG-3 (auto-applied adjustments not
  logged) — unchanged by the closeout package; remain dev bugs.

---

## Spec update (v1 closeout, from FeesDiscountsV1_1.doc + Epic)

> This pointer records the `requirements.md` edits to make **later** (not made now,
> to stay rebase-safe while another worker may be active). The spec BODY is
> unchanged vs our current `requirements.md`; these are annotations, not rewrites.

**requirements.md changes to make later:**
1. Update the **Epic reference** from `TBD` → **`SV-7387 — Fees & Discounts`**
   (the only literal spec-text change).
2. Add a **"v1 scope banner"** near the top: **US SALES TAX ONLY**; Canada
   GST/PST, EU VAT, AU GST are **Phase 2 (F&D-Phase2-3)**. All GST worked examples
   in the doc/cases are off-model for v1.
3. Add a **QB scope note** to the §Story-6 area: v1 posts every fee → **generic
   Fee item**, every discount → **generic Discount item**; **per-template QB
   Product/Service mapping is Phase 2 (F&D-Phase2-1)**; **per-class allocation is
   Phase 2**. Single-class-applied-uniformly IS in v1.
4. Add a **calc-method note** to §5: "% of Labor + Parts" is **removed from the
   dropdown** (legacy-resolution only) — new adjustments have **4** selectable
   methods; the epic's "5 calc types" counts the legacy method.
5. Add a **PO-rulings block** recording the 6 answers (Q1/Q4/Q5 = fix-the-defect;
   Q2 = single-add settled; Q3 = Processing-Fee UI in scope; Q6 = single-select
   dropdown accepted).
6. Add an **epic-shipped checklist** (post-invoice lock, cross-tenant isolation,
   cascade cleanup, standardized delete dialog) and note the **cross-tenant
   coverage gap** (propose FD-SEC-001).

**Do NOT** rewrite the calculation contract or story bodies — they are unchanged.
