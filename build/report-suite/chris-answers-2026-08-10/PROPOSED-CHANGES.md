# Proposed case changes — STAGED, NOT EXECUTED

**STATUS: NOTHING HAS BEEN WRITTEN. Zero `update_case`, zero `add_case`, zero `delete_case`, zero run
writes, zero results.** Every row below awaits the QA lead's explicit go-ahead (Standing Rule 6).

**11 cases** are affected across **6 changes**. Ordered **handed-off reports first**.

**Two rules govern every row here:**
- **Rule 58 quote-back gate.** No proposed expectation appears below unless it can be **quoted back to a
  document** — Chris's answer or the specification. Where it cannot, the case is **held and asked**, not
  edited. One proposed change (C30100) is therefore deliberately left as *re-derive*, not as finished
  wording.
- **Rule 56.** A **confirmation is cited as a confirmation**. Only **one** change (P5) earns a divergence
  sentence, because only one follows an answer against a current spec. Adding a divergence sentence
  anywhere else would manufacture a conflict that does not exist, and that is itself a defect.

**When these are executed, the sources must be re-read first (Rule 59)** — all six specs moved once
already this week, and the versions cited below are as at 2026-08-10.

---

## PRIORITY 1 — the three handed-off reports

### P1 · Work In Progress — C43551 · plain unhold

| | |
|---|---|
| Case | WIP-PERS-05 · **C43551** · https://shopview.testrail.io/index.php?/cases/view/43551 |
| Driving answer | Tab 1 item 1 = **`A`** |
| Change | Remove `AUTOMATION: HOLD - the written description contradicts itself about the Location column and the product owner has not yet ruled (Q5 on the question sheet)`; replace with **`AUTOMATION: READY`**. Delete the tester note about the unresolved contradiction. |
| Body | **No change needed.** Its assertions (the Location toggle choice is remembered, off stays off, on stays on) are exactly right under the access-gated toggleable model. |
| Rule 56 | **Confirmation — NO divergence sentence.** WIP v10 §3 already states the model his answer confirms. |
| Provenance (Rule 54) | Re-stamp to name **Work In Progress specification version 10** and cite Chris's answer of **2026-08-10** as a confirmation, with this folder's link. **No build date** — nothing was observed. |

### P2 · Work In Progress — C30467 · unhold **plus a correction**

| | |
|---|---|
| Case | WIP-COL-02 · **C30467** · https://shopview.testrail.io/index.php?/cases/view/30467 |
| Driving answer | Tab 1 item 1 = **`A`** |
| **The defect** | Expected item 2 currently reads: *"Every other column (VIN, **Location**, Last Activity, Labor Earned, Labor Remaining, Parts Earned, Parts Remaining, Inv. Hrs) is available in the column-selection control…"* — i.e. it puts Location among the **off-by-default** columns. |
| Why that is now wrong | **WIP v10 S4-R3**, quoted: *"Every other column (VIN, Last Activity, Labor Earned, Labor Remaining, Parts Earned, Parts Remaining, Inv. Hrs) is available in the column selector and **off by default**. The **Location** column is offered in the column selector to any user with access to more than one location; **for that user it is shown by default**…"* |
| Proposed | Remove `Location` from the off-by-default list; add a separate line stating that for a user with access to more than one location the Location column **is shown by default** and can be toggled, and a user with access to one location never sees it and is not offered it. Delete the contradiction note. Marker → **`AUTOMATION: READY`**. |
| Rule 56 | **Confirmation — NO divergence sentence.** |

### P3 · Sales By Customer — C38912 · unhold **plus a rewrite**

| | |
|---|---|
| Case | SBC-LOC-04 · **C38912** · https://shopview.testrail.io/index.php?/cases/view/38912 |
| Driving answer | Tab 1 item 1 = **`A`** |
| **The defect** | **The title itself asserts the overturned model:** *"The Location column shows **only with more than one location**; Multiple on totals"*, and expected item 1 reads *"With more than one location **in scope** a Location column is shown."* That is visibility by **selection scope** — option **B**, which he rejected. |
| Why that is now wrong | **SBC v16 S4-R12**, quoted: *"The Location column applies only to a user who **has access to** more than one location… For a user with access to more than one location, the column is **shown by default** and can be toggled on or off from the column selector, **regardless of how many locations are currently selected**."* |
| Proposed | Retitle to the access-gate model (≤ 80 characters, per the standing title rule) and rewrite expected item 1 to turn on **what the user may see**, not what is selected. Keep items 2–3 — the *"Multiple"* rules for customer/asset rows are unchanged and still match S4-R12a. Marker → **`AUTOMATION: READY`**. |
| Rule 56 | **Confirmation — NO divergence sentence.** The spec and his answer agree; it is **our case** that was behind. |

### P4 · Sales By Customer — C30100 · **RE-DERIVE, do not simply unhold**

| | |
|---|---|
| Case | SBC-PERM-04 · **C30100** · https://shopview.testrail.io/index.php?/cases/view/30100 |
| Driving answer | Tab 2 item 2 = **`A`** — no link at all; the invoice number is plain text |
| **The problem** | The case is titled *"Opening an invoice you lack permission for shows access-denied; back works"* and expects *"The destination page shows the application's standard access-denied state."* **Under answer A that user has no link to press, so the journey this case tests should not be reachable from the report.** |
| Governing text | **SBC v16 S9-R1a:** *"The invoice number is rendered as a link **only when** the user has permission to open the target… a user without that permission sees the invoice number as **plain text**."* |
| The complication | **S9-N2 still exists in v16** and still describes the access-denied landing page. Under answer A it is dead text — but it is **still in the ratified document**, and it is Chris's to remove (`FOLLOW-UP-QUESTIONS.md` Q4). |
| **Proposed** | **Do NOT write finished wording in this pass.** Re-derive the case against S9-R1a — most likely it becomes *"the invoice number is plain text and there is nothing to click"*, which is what **C43558** already covers, so **the honest options are re-scope or retire, and that is a QA-lead decision.** |
| Why it is left open | Rule 58's quote-back gate: any wording I invent here would be **my** resolution of a spec that still says two things, not his. **`delete_case` is irreversible and is not proposed.** |
| Marker | Stays **`AUTOMATION: HOLD`** until re-derived — but the **reason must change**, because the reason it currently gives (*"waiting on one answer from the product owner"*) **is now false**. He answered. |

### P5 · Sales By Customer — C43558 · **hold reason narrows, hold REMAINS**

| | |
|---|---|
| Case | SBC-LINK-05 · **C43558** · https://shopview.testrail.io/index.php?/cases/view/43558 |
| Driving answer | Tab 2 item 2 = **`A`** |
| Change | Expected item 2 (*"the invoice's contents stay out of reach"*) can now be made precise: **the invoice number is shown as plain text and is not clickable.** Quotable directly to S9-R1a. |
| **Marker** | **STAYS `AUTOMATION: HOLD`** — narrowed to *"needs a second sign-in that cannot open work orders or part sales"*. **The product half is answered; the access half is not.** |
| Rule 56 | **Confirmation — NO divergence sentence.** |

---

## PRIORITY 2 — Sales By Representative (NOT handed off, lower priority)

**One exception on sequencing: P6 should be done early despite the lower priority**, because that case
is `AUTOMATION: READY` and asserts the wrong thing — automating it would bake the error in.

### P6 · C30278 · **the one change that carries a divergence sentence**

| | |
|---|---|
| Case | SBR-EXP-01 · **C30278** · https://shopview.testrail.io/index.php?/cases/view/30278 |
| Driving answer | Tab 2 item 4 = **`A`** — A4 landscape |
| Current | Asserts *"The PDF is A4 portrait"*, taken word for word from the spec. Marker **`AUTOMATION: READY`**. |
| The conflict | **SBR v18 S14-R3 still says:** *"Both PDFs are server-rendered and delivered as a file attachment, in **A4 portrait**, edge-to-edge…"* |
| Resolution | **Rule 32 — newest authoritative source wins.** His answer is **2026-08-10**; SBR v18 was last edited **2026-08-07**. **Landscape prevails.** |
| Proposed | Change the assertion to **A4 landscape**. |
| **Rule 56 divergence sentence — REQUIRED here, and only here** | Draft: *"The product owner asked for this in his answers of 10 August 2026, in this file: `build/report-suite/chris-answers-2026-08-10/`. This differs from the Sales By Representative description, which still says the printable downloads are A4 portrait. We are following his most recent instruction."* |
| **Not included** | His caveat *"It must all fit on screen"* is **NOT** written into the case. It is ambiguous for a printable download and goes back to him (`FOLLOW-UP-QUESTIONS.md` Q2). Inventing a testable meaning for it is exactly what Rule 58 forbids. |

### P7 · C30310 and C30315 · unhold on the "Representative" wording

| | |
|---|---|
| Cases | SBR-WO-01 · **C30310** · https://shopview.testrail.io/index.php?/cases/view/30310 · SBR-WO-06 · **C30315** · https://shopview.testrail.io/index.php?/cases/view/30315 |
| Driving answer | Tab 2 item 5 = **`A`** — use the full word everywhere, not only in the downloaded files |
| Change | Assert **"Representative"** in full on screen and on the customer's card; remove the *"waiting on an answer from the product owner"* hold. Marker → **`AUTOMATION: READY`**. |
| Rule 56 | **NOT a divergence — an EXTENSION.** On 2026-08-05 he answered the download-heading question `A)` and **left the screen question blank**. Today is his **first** answer on the screen, so there is nothing to diverge from. Cite as his answer of 2026-08-10. |
| Note | SBR v18 still uses **"Sales Rep" 27 times**; the spec edit is owed by Chris and does not block these two. |

### P8 · C43559 · SBR invoice/customer links

| | |
|---|---|
| Case | SBR-LINK-06 · **C43559** · https://shopview.testrail.io/index.php?/cases/view/43559 |
| Driving answer | Tab 2 item 3 = **`A`** — update the numbered requirements to match Sales By Customer |
| Change | Assert that an invoice number and a customer name are links **only** when the user may open the target, and plain text otherwise. |
| Rule 56 | **Confirmation** of his 2026-08-05 suite-wide rule, which SBR v18 §2 already carries. **No divergence sentence.** |
| Caution | SBR v18 **S12-R1** and **S12-R3** still state the unqualified rule. Chris agreed to fix them; until he does, the case follows §2 and his answer. |

---

## PRIORITY 3 — Inventory Value (NOT handed off, lower priority)

### P9 · C30551, C30554, C30588, C38917 · unhold on the Location ruling

Driving answer: **Tab 1 item 1 = `A`**. All four carry the Location-contradiction hold.

- **C30551** https://shopview.testrail.io/index.php?/cases/view/30551 — body compatible; unhold.
- **C30554** https://shopview.testrail.io/index.php?/cases/view/30554 — body compatible; unhold.
- **C30588** https://shopview.testrail.io/index.php?/cases/view/30588 — body compatible; unhold.
- **C38917** https://shopview.testrail.io/index.php?/cases/view/38917 — ⚠️ opens *"With more than one
  location **involved**, a Location column is shown"* — **scope wording; needs the same correction as
  C38912** before the hold comes off.

**⚠️ Do not execute P9 as written without one extra check.** **Inventory Value v5 is one of the two
specs whose tidy-up is incomplete** — **S3-R1** and **§4 Terminology** still state the scope model while
**S7-R6** states the access model (`ANSWERS-INGESTED.md` §3). His answer settles which side is right, so
the cases are safe to correct — but the document still argues with itself, and that is on the follow-up
list (Q3). **Two observations worth flagging when someone picks this up:** C30551 asserts the Location
column is *"right-aligned like the other non-identity columns"*, while **IV v5 S12-R10** places it *"in
the left-hand identifier group"* — that looks like a genuine conflict inside our own case and needs a
proper look, **not** a drive-by edit during an unhold.

---

## Summary

| Priority | Cases | Comes off hold | Needs a body change | Divergence sentence |
|---|---|---|---|---|
| 1 — handed off | C43551, C30467, C38912, C30100, C43558 | **3** (C43551, C30467, C38912) | 3 | none |
| 2 — Sales By Representative | C30278, C30310, C30315, C43559 | 2 | 4 | **C30278 only** |
| 3 — Inventory Value | C30551, C30554, C30588, C38917 | 4 | 1 | none |
| **TOTAL** | **13 case-slots across 11 distinct cases** | **9** | **8** | **1** |

**Nothing above is authorised. Nothing above has been written.**
