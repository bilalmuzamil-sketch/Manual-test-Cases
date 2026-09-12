# Tickets filed — 12 Sep 2026

Both under epic **SV-9892 "Invoice Design Selection"**, both **priority Medium**,
Product Area **Work Orders**, linked to each other as **Relates**.

| Ticket | Type | What it is |
|---|---|---|
| [SV-9977](https://shopview.atlassian.net/browse/SV-9977) | Task | The QA verification record: production Legacy invoice vs the QA branch, all 15 areas of the document, with the 15 annotated comparison screenshots embedded. |
| [SV-9976](https://shopview.atlassian.net/browse/SV-9976) | Bug | The one remaining issue: the "Service Order" heading prints on two lines when the order number is short. Full technical cause, reproduction steps and two suggested fixes. |

## What SV-9977 says

- 14 of 15 areas IDENTICAL; 1 DIFFERENT and raised as SV-9976.
- 70 of 70 design measurements identical at 0.05 pt tolerance.
- 35 of 35 template labels present on production (checked against the empty QA estimate as the skeleton, in both directions).
- Embedded font subset tags match exactly.
- Method, documents, builds, the Legacy/Modern guard, and the honest limits are in the "Technical details for developers" section at the end.
- 15 embedded images from `ev/areas/`, in order 01→15.

## What SV-9976 says

- First line credits where it was found (SV-9977), per the follow-up-ticket rule.
- Plain description, then PO-runnable reproduction steps on the QA branch (S2-4219 wraps, S99999-16518 does not), then production's INV-S2-194.
- Two embedded images: `ev/areas/06-service-order-table.png` and `ev/EX7-the-QA-build-wraps-too.png`.
- States honestly that it reproduces on the QA branch too, so it is a template limitation, not a production regression.
- Technical details: `.column-width-15 { width: 15% }` + `padding: 4px 6px` → 62.29 pt of text space vs the 69.21 pt the heading needs (short by 6.92 pt); `table-layout` auto makes 15% a minimum; threshold ≥ 69.21 pt of order number; predictor 3 of 3; the 695 CSS px screen threshold vs the print path's 634 px; all 100 sampled production numbers are 6 characters; two suggested fixes.

## Pre-post gate (Standing Rule 72)

- Build markers re-read live immediately before filing: production `v26.36.4-3e1c643`, QA `sv9901 v26.35.10-7b9a47d` — both unchanged from the pass.
- All 15 `ev/areas/*.png` URLs and the 3 top-level exhibit URLs curled: **HTTP 200** each.
- Priority Medium on both, parent SV-9892 on both, Product Area Work Orders on both — read back from Jira after writing.
- Relates link read back from Jira (link id 32588).
- No AI/Claude fingerprint anywhere in either ticket body.

## Outstanding

- Production is currently on the **Legacy** invoice layout (it was on Modern when this work started and was switched for the comparison). Decide whether it stays on Legacy or goes back to Modern.
