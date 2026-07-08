# Simple Flow — Spec Change Diff: V2.4 (Bulk Receiving) vs recorded V2.3

> **New spec parsed:** `dffd85b6-SimpleMode_StreamlinedWorkOrderCompletionBulkReceiving.doc`
> (MHTML; parsed OK — full 17 stories + §1–§9). Readable copy: `spec-current-source.md`.
> **Baseline:** `requirements.md` (our V2.3 extract; its source `31240e6d-…Receiving.doc`
> was diffed line-by-line and matches V2.3 exactly).
> **Doc version/status:** **Draft for build — V2.4** (was V2.3). Title changed
> **"…Completion & Receiving" → "…Completion & Bulk Receiving."** Epic SV-7301, Owner @Milos Vasic.
> **This is PARSE + DIFF + PROPOSE only — no case JSON / Excel / TestRail edits were made.**

---

## Summary

- **Version:** V2.3 → **V2.4**. Title gained **"Bulk"** ("Bulk Receiving"). The Bulk-Receive
  *scope itself* (Stories 7/8/9) is **unchanged** — the rename reflects the doc's framing, not
  a scope growth. (The one Bulk-Receive-adjacent change is the receive-screen **parity** work in
  D7/D8, not new Bulk-Receive requirements.)
- **Substantive deltas:** **8** (D2–D9), plus **2 metadata** (D1 version/title, D10 embedded
  change-log). V2.4 = V2.3 + the doc's **2026-07-08 change-log batch** (sell-price-at-save,
  orderable-from-line, order-before-receive, editable-cost parity, Part-Sales investigation).
- **Cases impacted (proposed):** ~**22** across SF-VPART (7), SF-VMIS (6), SF-COMP-12/13/14 +
  required-invoice completion, SF-PNFIX-02/03/04, SF-BULK-06, SF-RCV-04/06, SF-POSEL-05, plus
  **2 candidate ADD cases** (order-from-line; editable-cost-on-Accept-Delivery) and **1 note-only**
  (Part Sales investigation).
- **Round-2 Milos questions resolved by V2.4:** **only Q4 (partially)** — spec now makes
  **Sell Price mandatory at save (S5-R1)**, answering the "should Sell Price be required?" half;
  the **Category-required** half is still unaddressed. **Q1, Q2, Q3, Q5 = NOT resolved.**
- **⚠️ Two expected round-1 changes are NOT in V2.4 (spec still shows the OLD behavior):**
  the **Require-Review-default-ON** ruling (round-1 Q1) and the **No-PO-path-removed / POs-always-on**
  ruling (round-1 Q5). V2.4 still fully documents Story 2 (No-PO), S1-R2 "Off → no POs", §4
  "Create POs OFF ⇒ no PO", and S1-R4 "Default per cohort." **The doc contradicts Milos's own
  Google-sheet answers** — flag for confirmation (see "Queued items NOT confirmed" below).
- **VIU conflict:** V2.4 **S5-R1 (sell price mandatory at save)** conflicts with the live build
  (VIU **SF-VPART-02**: build does **not** enforce sell price; it requires **Category** instead).

---

## Delta table

| # | Change | OLD (V2.3) | NEW (V2.4) | Affected cases | Proposed impact | Relation to open items |
|---|---|---|---|---|---|---|
| D1 | **Version + title** | V2.3, "…Completion & **Receiving**" | V2.4, "…Completion & **Bulk Receiving**"; status line adds "sell-price mandatory at save + orderable-from-line; editable cost on Accept-Delivery" | — (metadata) | **NO-CHANGE** to cases; update requirements.md header | — |
| D2 | **§4 Key Decisions — new bullet: sell price = only mandatory financial field to add a part** | Not present (§4 said sell mandatory only implicitly via Story 5) | "Sell price is the only mandatory financial field to add a part (enforced **at save**; cost never mandatory — edited later). A **sell-price-only part** (missing vendor and/or cost) is **orderable from the line** → Order creates the Vendor-Missing PO → **waiting-to-receive**." | SF-VPART-01/02, SF-VMIS-01..06, SF-POSEL-05 | **UPDATE-expected** (anchor the sell-at-save + orderable-from-line rule; cases below carry the concrete edits) | Underpins round-2 **Q4** (sell required) — partially answered |
| D3 | **S3-R1 strengthened — order-before-receive** | "order the parts and create the POs in the background (a vendorless part → WO's PO flagged Vendor Missing)" | "**actually order all approved-line parts**…(a vendorless **/ sell-price-only** part…). **Parts must reach waiting-to-receive** so 'Receive parts' always has something to receive — a part left in **requested** must never be routed to an empty receive screen." + new AC bullet | SF-COMP-12 (optional-invoice modal), SF-COMP-13 | **UPDATE-expected** on SF-COMP-12: add "sell-price-only / requested parts are ordered first → waiting-to-receive; Receive parts is never empty." **Candidate ADD-new-case** for the negative (requested part must not open an empty receive screen). | New requirement; not previously queued |
| D4 | **S4-R1 — sell-price-only part ordered too** | "Background order + POs (vendorless → WO's PO, Vendor Missing)" | adds: "A **sell-price-only part (missing vendor and/or cost) is ordered too → waiting-to-receive (Story 6, S6-R7)**; parts must not remain in 'requested' with nothing to receive." | Required-invoice completion cases (SF-COMP-15..18 range) | **UPDATE-expected**: required-invoice completion orders sell-price-only parts too (→ waiting-to-receive) before the receive gate | New requirement |
| D5 | **S5-R1 — sell price validated AT SAVE** | "requestable with description + qty + sell mandatory; PN/cost/vendor optional" (AC: "missing desc/qty/sell → blocked") | "**Sell price is validated at save — the part cannot be saved/closed without it (inline error), not deferred to completion.**" + AC "blocked **inline at save** (not deferred to completion)." | **SF-VPART-01, SF-VPART-02** | **UPDATE-expected**: sell price is enforced **inline at save** (not at completion). | **⚠️ CONFLICTS with VIU** (see below). **Partially ANSWERS round-2 Q4** (sell-required half). Overlaps BUG-9 queue. |
| D6 | **Story 6 — NEW S6-R7: orderable from the line** | Story 6 ended at S6-R6 | "**S6-R7 — Orderable from the line (sell-price-only parts).** A part with a sell price but no cost and/or vendor can be **ordered from the line's Order action** — creating/joining the WO's Vendor-Missing PO and moving it **requested → waiting-to-receive** (same order path as completion, not completion-only). At receive, vendor + PN still required (cost editable — Story 10)." + new AC bullet | SF-VMIS-01..06 (esp. the Order path); **no existing case covers "Order from line"** | **ADD-new-case** `SF-VMIS-07` (proposed): "Verify a sell-price-only part is orderable from the line's Order action → creates/joins the Vendor-Missing PO → moves to waiting-to-receive, without completing the WO." | New requirement; not previously queued |
| D7 | **Story 10 restructured — S10-R2 promoted + S10-R3 parity** | S10-R1 (PN mandatory to receive); S10-R2 = "field rules per S8-R7"; the "PN added → first-class part; existing links / new creates" lived **only in AC** | S10-R1 same; **NEW S10-R2 requirement**: "PN added → **first-class inventory/catalog part**; **existing** number **links**; **new** number **creates**." **S10-R3 (UPDATED)**: field rules "apply on **BOTH the Bulk Receive page AND the single / Accept-Delivery receive screen — parity**"; cost "**editable when $0/missing on either receive surface**." | SF-PNFIX-02, SF-PNFIX-03 (now backed by an explicit requirement, not just AC), SF-PNFIX-04, SF-BULK-06 | **UPDATE-expected**: SF-PNFIX-04 / SF-BULK-06 note the field rules are **parity across both receive surfaces**; cost editable when $0/missing on either. SF-PNFIX-02/03 unchanged in substance (promotion only). | New requirement (parity); overlaps BUG-11 (WO-PO receive 500 still blocks live verify) |
| D8 | **Story 12 — NEW S12-R5: editable cost on Accept Delivery (parity)** | Story 12 ended at S12-R4 | "**S12-R5 — Editable cost (parity with Bulk Receive).** On the Accept-Delivery screen, **cost is editable when $0/missing** (pulled from WO/PO when available) — matching Story 8 (S8-R7)/Story 10. Quantity stays editable; **sell-price lock rule unchanged**." + new AC bullet | SF-RCV-04, SF-RCV-06 | **UPDATE-expected** on SF-RCV-06 (add "cost editable when $0/missing on Accept Delivery; sell-lock unchanged"); **candidate ADD-new-case** `SF-RCV-10` "editable cost on Accept Delivery ($0/missing)" if not covered | New requirement. VIU: cost-editable confirmed on receive tooling ($0 & $25), but **WO-PO receive still blocked by BUG-11** → verify-pending, **not** a conflict |
| D9 | **§8 Open Questions — NEW item: Part Sales impact (investigation — BE)** | Not present | "**Part Sales impact (investigation — BE).** The shared order/status logic (requested → orderable/waiting-to-receive; PO-on-order without vendor/cost) may touch **Part Sales**… Keep Part Sales unchanged unless the shared logic forces a change — confirm & report." | No existing Part-Sales case (out of current SF scope) | **NOTE-only** (track). Optionally **ADD** an investigation case `SF-QB-09` "Part Sales unaffected by the shared order/status logic" once dev confirms. | New open question; not previously queued |
| D10 | **§9 Change Log embedded in the doc** | Not in the doc (our requirements.md kept its own) | 4 dated entries (2026-07-03…2026-07-08) now inside the spec | — (metadata) | **NO-CHANGE**; captured in the appended spec-update section | — |

---

## VIU conflicts (spec V2.4 vs verified behavior)

1. **D5 / S5-R1 (sell price mandatory at save) ⟷ VIU SF-VPART-02.**
   VIU verified (`viu-findings.md` line 376, evidence VP-11): the live "New Part Request" form's
   empty-save error is **"Description / Quantity / *Category* is a required field"** — **Sell Price
   is NOT flagged required**, and **Category IS required** (Category is not in S5-R1 at all).
   V2.4 now makes **Sell Price mandatory at save** → the build **does not yet enforce** it.
   **Impact:** SF-VPART-01/02 expected should follow V2.4 (sell required at save); the build's
   failure to enforce sell — and its extra Category requirement — is a **spec-vs-build gap**
   (this is round-2 **Q4 / BUG-9**). Keep the expected per spec; the deviation is a bug/PO item.
   Also relevant: VIU **SF-PERM-09** — a Technician's New-Part-Request form hides all financial
   fields (incl. Sell Price), so a Technician cannot satisfy the now-mandatory sell (consistent
   with the §9.2 Technician "No add vendorless" row; FE-only gate).

2. **D7/D8 (editable cost on receive surfaces) — NOT a conflict, but verify-pending.**
   VIU confirmed cost is editable in the receive tooling on both $0 and $25 parts, but the
   **WO-originated-PO receive round-trip returns HTTP 500 (BUG-11)**, so the Accept-Delivery
   parity path (S12-R5) and the PNFIX field-rule verifications remain **blocked on the BUG-11 fix**
   (SF-COMP-13/19, SF-VAL-05/06, SF-PNFIX-02..06, SF-RCV-08, SF-VPART-07, SF-REV-04/14, SF-CORE-03..07).

---

## Relation to queued items

### Confirms / reinforces (already queued)
- **Round-2 Q4 (sell-price required) — PARTIALLY CONFIRMED by V2.4 S5-R1.** Spec now *requires*
  sell at save. The Category-required half of Q4 is still **not** in the spec → keep Q4 open for
  the Category ruling; update its sell-price half to "answered by V2.4."
- **BUG-9 (VPART Category/sell)** — same as Q4: V2.4 confirms sell-required (spec side); Category
  still unresolved. Keep BUG-9 open for Category only.

### New (not previously queued) — introduced by V2.4
- **D2/D3/D4/D6 — order-before-receive + orderable-from-line** (sell-price-only parts ordered →
  waiting-to-receive; new S6-R7 line-Order path). None of this was in V2.3 or in the round-1/round-2
  sheets. → UPDATE SF-COMP-12 + required-invoice completion; **ADD SF-VMIS-07**.
- **D7/D8 — receive-screen field-rule parity** across Bulk Receive + Accept Delivery (cost editable
  when $0/missing on either). → UPDATE SF-PNFIX-04 / SF-BULK-06 / SF-RCV-06; candidate ADD SF-RCV-10.
- **D9 — Part Sales investigation.** New §8 open question → note-only / candidate SF-QB-09.

### ⚠️ Queued items NOT confirmed by V2.4 (spec still shows OLD behavior — the doc lags Milos's answers)
- **Round-1 Q1 (Require Review default = ON for all orgs).** V2.4 **still** says S1-R4 "Default
  **per cohort** (see §8)" and §8 still asks "Require-review default — on for bigger/existing shops?"
  → our queued SF-REV-15 / SF-SET-14 rewrite is backed **only** by Milos's Google-sheet answer, **not**
  by V2.4. **Flag:** confirm whether the spec will be updated, or the answer supersedes the doc.
- **Round-1 Q5 (No-PO path removed / POs always ON).** V2.4 **still fully documents** Story 2
  "No-PO (Skip) Flow", S1-R2 "Off → no POs. Default ON", §4 "Create POs OFF ⇒ no PO at all."
  → our queued **retire of SF-COMP-06 / SF-QB-02** and **rewrite of SF-SET-03** is backed **only**
  by the Google-sheet answer and is now **contradicted by the V2.4 doc text**. **Flag as a
  spec-vs-answer inconsistency** — do NOT retire those cases until Milos reconciles the doc.

### Reclassified EXPECTED findings (unaffected by V2.4)
- **BUG-3 (no review note), BUG-4 (no distinct Reviewed state), BUG-10 (no Resolve-Cores step)** —
  V2.4 touches none of these; the shortcut-principle reclassifications stand. (Round-2 Q1 review-note
  is still just a confirm; not addressed by V2.4.)
- **BUG-11 (WO-PO receive 500)** — still a real defect; V2.4's editable-cost parity does not fix it.

---

## Round-2 Milos questions — resolution status after V2.4

| R2 Q | Topic | Resolved by V2.4? |
|---|---|---|
| 1 | Mark-Reviewed review-note field | **No** — not addressed. |
| 2 | Tech-story entry points (Story 17 vs S15-R2) | **No new info** — Story 17 unchanged (still supersedes S15-R2 via its Decision note); same as before. |
| 3 | Inventory decrement on completion (No-PO removed) | **No** — and note V2.4 **still contains** the No-PO path, contradicting the round-2 premise; inventory-decrement invariant unchanged (§5 as-was). |
| 4 | New-Part-Request required fields (Category / Sell Price) | **Partially** — **Sell Price now mandatory at save (S5-R1)**; **Category** still unaddressed. |
| 5 | BE enforcement of completion/review permissions | **No** — not addressed. |

**Net: 1 of 5 (Q4) partially resolved; 0 fully resolved.**
