# Source-verification reconciliation — C45275 (Work Order Lines / Authorizer) — CORRECTED THIS SESSION

- **Case:** C45275 "Changing the customer clears the Authorizer; changing only the contact does not"
  https://shopview.testrail.io/index.php?/cases/view/45275 · **created_by 1 = Vladimir Tomovic.**
  Normally HANDS-OFF (Rule 38); **corrected 2026-09-10 under Vladimir Tomovic's explicit permission for
  this session only** (relayed by the QA lead; conflict with Rule 38 surfaced per Rule 63 before editing).
  Flagged **Automated** (`custom_atmstatus = 3`) → FOR-VLAD note filed (Rule 65).
- **Reconciled 2026-09-10, three ways (Rule 106):** the CASE's Expected (live from TestRail) · the SOURCE
  as it reads today (fetched live) · the BUILD (NOT observed this pass — assessed against sources only).

## 1. The case's Expected (live, after correction — separated-steps format, 5 steps)
1. The Authorizer row shows customer A's flagged ("Approves Work") contact.
2. Changing only the contact (customer stays A) does NOT clear the Authorizer.
3. Changing the customer (A → B) clears the Authorizer to "None".
4. The Authorizer picker offers only customer B's contacts flagged "Approves Work", plus a "No authorizer"
   row; none of A's contacts and none of B's unflagged contacts appear.
5. Picking B's flagged contact saves the Authorizer against customer B.

## 2. The source, quoted (read live 2026-09-10)
- **Invoice UI Refresh spec**, Confluence page **755990532**, Story 3 (Authorizer):
  - **S3-R5:** the Authorizer picker offers only contacts flagged "Approves Work" for the work order's
    current customer; a "No authorizer" option clears the selection.
  - **S3-R6:** when there is no eligible/selected authorizer the row reads "None".
- **Story 3 is SILENT** on what happens to the Authorizer when the work order's **customer is changed** vs
  when only the **contact** is changed. There is no requirement text either way.

## 3. Three-way verdict (Rule 106 / §1d)
- **The picker rules (steps 1, 4, 5)** — CASE AGREES WITH SOURCE (S3-R5/S3-R6). Kept; wording aligned to the
  spec's own labels ("Approves Work", "No authorizer", "None").
- **The customer-change-clears / contact-change-keeps behaviour (steps 2, 3)** — SOURCE SILENT. Per §1d this
  is "hold and ask", not a defect. The QA lead was asked how to record it and chose **product-knowledge**:
  it is now labelled **"Manually added (QA lead, 2026-09-10) from product knowledge"** in the provenance, so
  the build-verification session knows it is asserted from product knowledge, not from a written source, and
  can raise a PO question if the build disagrees.

## 4. What was corrected (all traceability/structure — the tested behaviours are unchanged)
- **Redistributed the five expected outcomes one-per-step.** They previously sat lumped so a step's own
  expected did not match the action on that line (a five-dimension "steps cover Expected" gap). Now each of
  the 5 steps carries exactly the outcome its action produces.
- **Aligned wording to the spec labels** ("Approves Work", "No authorizer", "None"); dropped an unsupported
  "always first" ordering claim the source does not state.
- **Added the split provenance** (picker rules → SV-8218 / page 755990532 / S3-R5, S3-R6; customer-change →
  Manually added, product knowledge) + the Vladimir-permission note + `AUTOMATION: READY`.
- **Automation type** kept **E2E (1)** (cross-feature journey: change-customer + picker + save).
- Rendered clean on the served page: **0 literal tags**, 5 separate step rows, provenance + marker last.

## 5. What did NOT change
The tested behaviours (picker eligibility, customer-change clears, contact-change keeps). `custom_atmstatus`
stays **3** (still Automated). Title unchanged. The build-verification session runs it and confirms the
source-silent behaviour against the build (raise a PO question if it diverges).
