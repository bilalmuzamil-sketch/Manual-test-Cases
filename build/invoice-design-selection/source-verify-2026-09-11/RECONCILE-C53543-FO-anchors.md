# Reconciliation — C53543 (test 2924628) and the stale "FO-" provenance anchors

**Trigger:** QA lead, 2026-09-11 — "Check if this is per the specs:
https://shopview.testrail.io/index.php?/tests/view/2924628" (that test = case **C53543**).
**Method:** Rule 106 three-way — the CASE's Expected (read live from TestRail), the SOURCE as it
reads TODAY (Confluence page 845447188, fetched 2026-09-11, last modified ~2h before this read), the
BUILD observed (feature marked build-checked v26.36.2-12974d6 9/11/2026).

## 1. The behaviour — PER SPEC ✅
C53543 Expected (live): "The Invoice Design setting governs all six customer documents: the Estimate,
the Work Order Invoice, the Credit Invoice, the Parts Sale Estimate, the Parts Sale Invoice and the
Part Sale Credit (of which no new ones can be created). Each of the six renders in the current setting;
none carries a design of its own."

Live source, quoted verbatim (page 845447188, read 2026-09-11):
- **S2-R2:** "This applies to every document type: Estimate, Work Order Invoice, Credit Invoice, Parts
  Sale Estimate, Parts Sale Invoice and Part Sale Credit." → the six document types, exact match.
- **S2-R1:** "A document renders in the design the organization's Invoice Design setting holds at the
  moment it is rendered. That is the only input." → "each renders in the current setting".
- **S2-R4:** "Nothing is stored on a document about its design. There is no captured design, no cohort,
  no cutoff and no migration." → "none carries a design of its own".
- **Documents covered (metadata row):** the five refreshed docs "— and Part Sale Credit, included; no
  new ones can be created … (Q21, Q23)".
- **Q21 (answered):** "Agreed. Done: Section 2 and Section 4 now say six." → the sixth document is the
  Part Sale Credit, no new ones creatable.
**Verdict: the asserted behaviour is exactly what the current spec requires.**

## 2. The citation — NOT PER SPEC ❌ (case defect, Rule 106)
The provenance line cites **"section FO-4"** of page 845447188. **No "FO-" anchor exists anywhere in
the current spec** (full-body search of the 2026-09-11 page returns zero `FO-\d` matches; the spec
numbers requirements S1-R#…S5-R# under Stories 1–5, plus the Q-log). "FO-4" is a leftover from an
earlier revision's "Functional Outcomes" numbering that the 2026-09-10 Q23 rewrite replaced. Per Rule
106 this is a CASE defect (case cites a source id the source no longer contains), not a product defect
and not a Jira ticket: the fix is to **correct the case's provenance anchor**, not to file anything.

**Correct anchor for C53543:** section **S2-R1, S2-R2, S2-R4** (and Q21 for the sixth document).

## 3. Systemic — 11 cases in section 7800 carry stale FO- anchors
| Case | Title (short) | Cites | Correct current anchor(s) |
|---|---|---|---|
| C53518 | Invoice Design pick list at top | FO-1, FO-2 | Story 1 (S1-R#) |
| C53521 | one org-wide setting, no per-… | FO-3 | Section 2 / Key Decisions (org-wide, no per-location/customer/document) |
| C53522 | starts on Modern (organization) | FO-9 | Section 2 "Release changes nothing … every organization is on Modern" |
| C53523 | starts on Modern (new org) | FO-9 | Section 2 (default Modern) |
| C53531 | Changing design does not alter existing… | FO-5 | S2-R4 (nothing stored) — RE-CHECK title vs live-switch |
| C53534 | Work Order Invoice renders current | FO-5 | S2-R1, S2-R2 |
| C53541 | Reversed/recreated + maintenance re-invoice | FO-5 | S2-E2 / Q19 (follows current setting) |
| C53543 | governs all six documents | FO-4 | S2-R1, S2-R2, S2-R4 (+ Q21) |
| C53544 | Estimate always renders current | FO-6 | Story 3 (S3-R1) |
| C53545 | Invoice renders on preview/print/… | FO-7 | Story 5 (S5-R1…R4) |
| C53546 | [WITHDRAWN] pre-refresh reprint | FO-8 | withdrawn — anchor moot |

**Nearest apparently-contradicting rule, answered in advance:** Rule 57 (Expected comes from the
document, never the build) is NOT breached — the behavioural Expected is unchanged; only the *citation*
is corrected to name the section that actually carries the rule. Rule 62-b (a pass ends in a runnable
test, not a defect) is honoured — nothing is filed. This is the Rule 106 "case disagrees with source ⇒
correct the case, do not file" path, done with the go-ahead requested per case-set.
