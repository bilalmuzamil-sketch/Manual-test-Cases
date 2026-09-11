# Invoice Design Selection — FULL source verification 2026-09-11 (the Q23 "live switch" rewrite)

Ordered by the QA lead. Sources read live 2026-09-11 (Rule 108 — whole document + epic + 5 stories +
SV-9872 + the linked tickets already read 2026-09-10). Last full verify: 2026-09-10 (the roll-in revision).

## A. What the source says TODAY
- **Spec 845447188**, Status: *"Draft — rule changed 2026-09-10: the setting is a live organization-wide
  switch, nothing is captured or pinned. See Q23."* This SUPERSEDES the model our 54 cases were built on.
- **Q23 (Chris W., 2026-09-10)** — the setting is a **live switch**: a document has **no design of its own**;
  it renders in whatever the org has selected **at the moment it is rendered**. **No capture, no cohort, no
  cutoff, no migration.** Release changes nothing (all orgs on Modern); flipping to Legacy re-renders the
  **entire back catalogue** Legacy on every surface, and flipping back is symmetrical.
- **Story structure now:**
  - **Story 1 (SV-9893)** Choose the design — S1-R1..R10, S1-N1..N4, S1-E1. (S1-R3 helper + S1-R7 dialogs
    reworded; S1-N3 reworded — "stored record unchanged; appearance on next render is what changes".)
  - **Story 2 (NEW — "Every document follows the current setting")** — S2-R1..R7, S2-N1/N2, S2-E1/E2/E3.
    Replaces the withdrawn capture model. (Spec cites "Jira: SV-9872" for it.)
  - **Story 3 ("Estimates follow the current setting")** — reduced to S3-R1, S3-R2, S3-N1, S3-E1.
  - **Story 4 — WITHDRAWN IN FULL.** All S4-R1..R5 / S4-N1/N2 / S4-E1/E2 gone; migration reverted.
  - **Story 5 (SV-9897)** — S5-R1..R6 (**new S5-R6: history/snapshots follow the current setting**),
    S5-N1/N2, S5-E1/E2 (**S5-E2 flipped: a document list is always ONE design, no mix**).
- **Q7 ruled:** Legacy restores the LAYOUT not the DEFECTS — five wrong-figure defects fixed on Legacy too
  (no-logo wordmark, raw deposit, due-date-today, credit $0.00, missing disclaimer) + the part-sale-credit
  Balance/"Paid" fix; three layout items kept (remit-to fallback, Adjustments grouping, VIN placeholder).
  Templates stay byte-identical to v26.35.10; fixes are producer-side (in the data).
- **Cutoff discrepancy CLOSED:** 09:13:36 UTC is correct; SV-9872's 09:14:35 was corrected. (Cutoff now
  reference-only — no rule depends on it.)
- **Release vehicle:** hotfix v26.36.x patch (NOT v26.38.0). SV-9872 **In Progress**; a QA build is
  "underway" (change log: PR #3004 / #3004 head, "QA build underway") — verify live before build-verify.
- **Jira lag (disclose, Rule 56):** SV-9894 (Story 2), SV-9895 (Story 3), SV-9896 (Story 4) descriptions
  STILL describe the OLD capture/pin model (updated 08:46, pre-Q23). The **spec is authoritative**; the
  story tickets are stale. SV-9892 epic first paragraph also still reads the old model (its eng-note has Q23).

## B. Verdict per case (all 54) — Rule 43 per-requirement coverage
**KEEP+REWORD** = behaviour still valid, only "captured design"→"current setting" wording.
**REWRITE** = behaviour changed by Q23. **RETIRE** = behaviour withdrawn. **ADD** = new requirement uncovered.

| Case | Was | Q23 verdict |
|---|---|---|
| C53518 S1-R1/FO-1/FO-2 pick list at top | KEEP |
| C53519 S1-R2 two options | KEEP |
| C53520 S1-R3 helper text | **REWRITE** — helper reworded: "Every estimate, invoice and credit invoice your shop shows, prints or sends uses the selected design, including documents created before you changed it." |
| C53521 S1-R4/FO-3 org-wide | KEEP |
| C53522 S1-R5/FO-9 existing org starts Modern | KEEP |
| C53523 S1-R6/FO-9 new org starts Modern | KEEP |
| C53524 S1-R7 Legacy dialog | **REWRITE** — new body ("…including documents your shop has already sent. Reprints and portal copies of older documents change too…") |
| C53525 S1-R7 Modern dialog | **REWRITE** — new body (Modern) |
| C53526 S1-R8 success toast | KEEP |
| C53527 S1-R9 takes effect immediately | KEEP |
| C53528 S1-R10 unlimited changes | KEEP |
| C53529 S1-N1 no access no setting | KEEP |
| C53530 S1-N2 cancel reverts | KEEP |
| C53531 S1-N3/S2-R3/FO-5 changing setting doesn't alter existing docs | **REWRITE** — S1-N3 reworded (stored record unchanged; appearance on next render is what changes). Drop the S2-R3 "capture" framing. |
| C53532 S1-N4 other settings unchanged | **REWRITE** — remove the Q7/SV-9790 "breaks on Legacy" note: that defect is now FIXED on Legacy (Q7 ruling). |
| C53533 S1-E1 alert toast | KEEP |
| C53534 S2-R1/FO-5 WO invoice CAPTURES | **RETIRE/REWRITE** → new S2-R1/R3: a WO invoice renders the current setting regardless of when created. |
| C53535 S2-R1 Parts Sale Invoice captures | **REWRITE** → current setting |
| C53536 S2-R5/E3 credit captures not credited invoice | **REWRITE** → credit follows current setting (S2-R2/E2) |
| C53537 S2-R5/E4 credit vs several invoices captures | **REWRITE** → current setting |
| C53538 S2-R5/E4 credit no origin captures | **REWRITE** → current setting |
| C53539 S2-R2 keeps captured design through lifecycle | **REWRITE** → renders current setting at every lifecycle state |
| C53540 S2-E2 paid invoice captured design | **REWRITE** → paid invoice renders current setting |
| C53541 S2-R4/E1 reversed+recreated captures | **REWRITE** → new S2-E2: reversed/recreated + maintenance re-invoicing render current setting (Q19 exception withdrawn) |
| C53542 S2-R6 no per-doc override | **KEEP+REWORD** → new S2-N2 (no per-document design choice) |
| C53543 FO-4 governs all five docs | **REWRITE** → six documents, all follow current setting |
| C53544 FO-6 estimate follows live until invoiced | **REWRITE** → estimate always follows current setting (drop "until invoiced") |
| C53545 FO-7 invoice renders captured design on surfaces | **REWRITE** → renders current setting on all surfaces |
| C53546 FO-8 pre-refresh reprints legacy | **RETIRE** → withdrawn; a pre-refresh doc follows the current setting (covered by new S2-R3) |
| C53547 S3-R1 un-invoiced estimate current setting | KEEP (this was already the rule) |
| C53548 S3-R2/N2 invoiced WO estimate matches invoice | **RETIRE** → withdrawn; new S3-R2 = both views show the current setting |
| C53549 S3-R3 changing setting re-renders old estimates | **KEEP+REWORD** → now S2-R5 (next render, every document) |
| C53550 S3-N1 downloaded PDF unchanged | KEEP (S3-N1) |
| C53551 S3-E1 re-sent estimate new design | **KEEP+REWORD** → S3-E1 now folds in the portal held-copy (Q9) |
| C53552 S3-E2 reversing invoice returns estimate to setting | **RETIRE** → S3-E2 withdrawn (estimate always follows setting; the invoiced special case is gone) |
| C53553 S3-E3 pre-refresh estimate follows current setting | **KEEP+REWORD** → covered by S2-R3 |
| C53554 S4-R1 pre-2026-09-09 → Legacy | **RETIRE** (Story 4 withdrawn) |
| C53555 S4-R2 gap window → Modern | **RETIRE** |
| C53556 S4-R3 cohorts fixed | **RETIRE** |
| C53557 S4-R4 pre-refresh Legacy on every surface (portal) | **RETIRE** |
| C53558 S4-R5 must reprint Legacy once pinning built | **RETIRE** |
| C53559 S4-N1 switch to Legacy doesn't convert Modern cohort | **RETIRE** (opposite is now true: switching DOES re-render everything) |
| C53560 S4-N2 switch to Modern doesn't convert Legacy cohort | **RETIRE** |
| C53561 S4-E1 reversed+recreated pre-refresh captures | **RETIRE** |
| C53562 S4-E2 gap-window cohort closed | **RETIRE** |
| C53563 S5-R1 preview | **KEEP+REWORD** (current setting) |
| C53564 S5-R2 print/PDF | **KEEP+REWORD** |
| C53565 S5-R3 emailed PDF | **KEEP+REWORD** |
| C53566 S5-R4 portal (portal) | **KEEP+REWORD** (+ Q9 exception) |
| C53567 S5-R5 paid banner (portal) | **KEEP+REWORD** |
| C53568 S5-N1 batch/imported unaffected | KEEP |
| C53569 S5-N2 payment receipt unaffected (portal) | KEEP |
| C53570 S5-E1 Legacy Authorizer = IBS code | KEEP (already corrected to Q14) |
| C53571 S5-E2 org on Legacy holds new-design invoices | **REWRITE** — FLIPPED: a document list is now always ONE design, no mix |
| — NEW — S5-R6 history/snapshots follow current setting | **ADD** (coverage gap) |
| — NEW — S2-R6 switch symmetry (Legacy↔Modern) | **ADD** (or fold into a rewrite) |
| — NEW — S2-R7 / S2-E3 figures identical; remit-to block per design | **ADD** |

## C. Tally
- **KEEP as-is:** ~13 · **KEEP+REWORD (current-setting language):** ~9 · **REWRITE (behaviour changed):** ~13
  · **RETIRE (withdrawn):** ~11 (all 9 Story-4 + C53548 + C53552; C53546 retire) · **ADD (new coverage):** ~3.
- Net: this is a **re-authoring to a new model**, not a re-stamp. Roughly **half the 54 cases change or go.**

## D. Markers / build
All 54 still "Not available on Build to test Yet" (no dated QA build; build "underway" per change log —
verify live before build-verify). Portal cases (C53566/67/69 and formerly C53557) stay staging-only HOLD.

## E. Outstanding (Rule 98/99)
1. **The model flipped (Q23)** — ~half the suite must be rewritten/retired to the live-switch model. Approach
   decision needed (rewrite-in-place + retire the withdrawn ones, vs retire-and-recreate), and whether to do
   it now given SV-9872 is still In Progress and the spec Status is still "Draft" (could move again).
2. **Jira stories SV-9894/9895/9896 lag the spec** (still the old capture/pin model) — flag to Chris to update.
3. **Q15 fee breakdown** — fixed on both designs but sequenced AFTER this ships (watch item).
4. **Setting UI still TBD** (G2) — S1 routes stay provisional.

## F. Two build-verify feedback fixes (2026-09-11)
Build-verify session (build v26.36.2-12974d6) flagged C53537 and C53543. Checked both vs the live spec:
- **C53537** (multi-invoice credit) — behaviour CORRECT per spec (Terminology: a Credit Invoice "may be
  raised … against several at once"; renders current setting, S2-R1/R2). Provenance had cited the withdrawn
  ids **S2-R5, S2-E4** → re-pointed to "the Credit Invoice definition in Terminology and section S2-R1, S2-R2".
  The run-blocker is a DATA gap (no credit spanning ≥2 invoices) → seed one (Rule 14); if the app cannot
  raise a multi-invoice credit, that is a finding, not a skip.
- **C53543** (all six documents) — Expected/title already said six, but preconds/steps still listed FIVE and
  omitted the Part Sale Credit. Fixed: preconds + steps now cover all six, and spell out that the Part Sale
  Credit must be an **existing** one (no new ones can be created). Verified fr-view, 0 literal tags.
Both remain in run R446 (57 cases, all Mudassir). Ready for a re-run of build verification.

## G. C53537 made runnable (2026-09-11) — data-creation route added
The QA lead supplied the concrete route to create the multi-invoice-credit data on the QA build
(sv9872.qa): Customers → customer → Invoices → tick a CM-credit + two or more open invoices → New Payment →
in the New Customer Payment dialog untick the credit, choose a card method (e.g. VISA), tick the credit
again → Make Payment (applies one credit across the selected invoices). Added to C53537's preconditions and
step 1 so the test is runnable (Rule 18) — it is no longer blocked on "no such data exists." Verified fr-view.
