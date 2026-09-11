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

---
## UPDATE 2026-09-11 — 7 citation-only fixes applied; a BIGGER issue found

**Done (pure citation fixes, behaviour already per spec, verified fr-view / marker last):**
| Case | Old anchor | New anchor |
|---|---|---|
| C53531 | S1-N3, S2-R3, FO-5 | S1-N3, S2-R4, S2-R5 |
| C53534 | S2-R1, FO-5 | S2-R1, S2-R2, S2-R4 |
| C53541 | S2-R4, S2-E1, FO-5 | S2-R1, S2-R4, S2-E2 |
| C53543 | FO-4 | S2-R1, S2-R2, S2-R4 (Part Sale Credit per Q21) |
| C53544 | FO-6 | S3-R1, S3-R2 |
| C53545 | FO-7 | S5-R1, S5-R2, S5-R3 |
| C53546 | FO-8 (withdrawn) | Story 4 (withdrawn in full, Q23); S2-R3 |

**HELD — the other 4 FO cases overlap a deeper defect (do NOT fix citation alone):**
C53518, C53521, C53522, C53523 describe the setting as an **"Invoice Design" pick list at the top**.
The spec CHANGED this on 2026-09-10 (change log): **"The setting is a toggle at the bottom of the
list, not a pick list at the top."** Current S1-R1: a toggle row titled exactly **"Legacy invoice
layout"**, the **last** row on the Invoice settings page; S1-R2: **"There is no third state and no pick
list"**, off = Modern, on = Legacy. Confirmed still current by the 2026-09-11 change-log entry.
Fixing only the citation on C53518 would cite S1-R1 (a toggle) as the source for "a pick list at the
top" — a contradiction. These need a CONTENT rewrite to the toggle model, not a citation edit.

**Scope of the pick-list model in the suite (scanned live 2026-09-11):** 14 cases mention a pick
list / dropdown — C53518, C53519, C53520, C53521, C53522, C53523, C53524, C53525, C53526, C53528,
C53530, C53532, C53533, C53547. C53518 is the one that TESTS the control itself (title + expected =
"pick list labeled Invoice Design at the top"); the rest reference it in preconditions/steps as the
way to change the setting. All should move to: the **"Legacy invoice layout" toggle**, last row on
Settings → Invoice; **off = Modern, on = Legacy**; helper text S1-R3; confirm dialog S1-R7.

**Not a product defect — a CASE defect (Rule 106).** The build may already show the toggle; our cases
lag the spec. Awaiting the QA lead's go-ahead to rewrite the 14 pick-list cases to the toggle model
(and fold in the 4 held FO citations in the same pass).

---
## UPDATE 2 — 2026-09-11: all 14 pick-list cases rewritten to the toggle (QA lead go-ahead)

QA lead: "Rewrite all 14 tests to the new 'Legacy invoice layout' on/off switch." Done via
`regen_toggle.py` (committed). All 14 (C53518, C53519, C53520, C53521, C53522, C53523, C53524,
C53525, C53526, C53528, C53530, C53532, C53533, C53547) now describe the toggle: last row on
Settings → Invoice, titled exactly "Legacy invoice layout", off = Modern / on = Legacy, no pick list
(S1-R1/S1-R2). Behaviour taken from the documents (Rule 57): helper text S1-R3, dialogs S1-R7, toast
S1-R8, cancel S1-N2, other-settings S1-N4, failed-save S1-E1, org-wide S1-R4, defaults S1-R5/S1-R6,
unlimited S1-R10, estimate S3-R1/S3-R2. The 4 held FO anchors folded in (C53518→S1-R1/S1-R2,
C53521→S1-R4, C53522→S1-R5, C53523→S1-R6). Two retitled (C53518, C53519 — they asserted the pick-list
control). All verified `fr-view` / 0 literal tags / marker last; entities clean (no double-escape).

**Build status flagged, NOT silently resolved.** All 14 still carried "AUTOMATION: READY" + "Last
checked against build v26.36.2-12974d6 9/11/2026". The QA build could not be reached this pass (SSO
login ceremony), so the toggle was NOT observed on the build. Per Rule 12/54, the unsupportable
build-checked stamp was replaced with an honest note: the control changed in the spec 2026-09-10 and
the case is pending re-check on the build. The READY marker was LEFT AS-IS (not flipped) — the settings
page is runnable, so a tester runs it and, if the build still shows a pick list, marks it Failed, which
is the correct signal that the build lags the spec. Open item for the build-verify lane: confirm on the
QA build whether the toggle or the old pick list is present, and re-stamp accordingly.

---
## UPDATE 3 — 2026-09-11: build CONFIRMS the toggle (QA lead screenshot)

The QA lead shared a screenshot of **sv9872.qa.shopview.com → Settings → Invoice**. The build matches
the spec: the **"Legacy invoice layout"** toggle is the **last row** (below "Summarize labor total",
above the Disclaimer), a two-state on/off switch (no pick list), with the helper text **exactly**:
"Every estimate, invoice and credit invoice your shop shows, prints or sends uses the legacy design
while this is on, including documents created before you changed it." — verbatim what S1-R3 and the
rewritten C53520 carry. So the rewrite is confirmed against the real build, not only the spec.
The per-case note on all 14 was upgraded from "pending re-check" to "confirmed on the sv9872 QA build
(QA lead screenshot, 11 September 2026)". Directly build-confirmed by the screenshot: the control's
label, position and helper text (C53518, C53519, C53520, and the toggle-route preconditions on all 14).
Still tester-to-run on the build: the dialogs (C53524/C53525), toast (C53526), cancel (C53530),
failed-save (C53533), defaults (C53522/C53523), org-wide (C53521), unlimited (C53528), other-settings
(C53532), estimate rendering (C53547).
