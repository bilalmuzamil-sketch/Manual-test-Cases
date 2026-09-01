# PO question sheet — Invoice UI Refresh (SV-8218)

**Project:** Invoice UI Refresh · **Feature:** Order Reference Fields (Story 3, SV-9142)
**Raised:** 1 September 2026 · **For:** Chris Ward (PO)
**Why this exists:** the specification and the technical plan disagree, and the build follows the
plan. Rule 30 says the technical plan **informs but never overrules**; Rule 96 says a
code-versus-document conflict is a **PO decision item, never a silent invariant.** Nothing has been
rewritten to match the build.

---

## Question — should an imported work order have an Authorizer row?

**Case affected:** [C45190](https://shopview.testrail.io/index.php?/cases/view/45190)
(*"Work order, imported work order and part sale customer cards still work after the Authorizer
change"*)

**What the specification says (S3-R5, verbatim):**

> *"The Authorizer is selected in the customer contact card on the left side of **every work order**,
> in an 'Authorizer' row directly below the Contact and Phone values, in the same label-and-value
> style."*

**What the build does.** On a **normal work order** and on a **parts sale**, the Authorizer row is
there and works. On an **imported work order** it is absent — and so are the Contact and Phone rows
it is supposed to sit below. The imported card shows only the customer name, `VIN/Serial #`, the
Financial Info block and the document preview.

**Why this is a question and not a defect.** An imported work order appears in the Work Orders list
under an **Imported** status chip, so on the spec's plain wording it is a work order and should have
the row. But it is a historical record imported from another system — there may be nothing to
authorise, which is presumably why the technical plan gates the row off. The specification does not
say either way, so the build is not demonstrably wrong and neither is the case.

**The question, in one line:**
> **Does "every work order" in S3-R5 include imported work orders — should the Authorizer row appear
> on an imported work order's customer card, or is leaving it off correct?**

**What we are doing meanwhile.** C45190 is **left exactly as written** (it asserts the row is absent
on the imported work order, and it passes) and this divergence is disclosed rather than resolved.
If you confirm the build is right, S3-R5 wants one clause added so the spec and the case agree; if
you confirm the spec is right, the case and the build both need changing and that is a defect.

**Testable either way now.** There were no imported work orders on the QA branch, so one was seeded
(`ZZAUTOTEST-IMP-001`) and the surface can be re-checked on demand.

---

## OUTSTANDING — what we need from you

1. An answer to the question above (one line is enough).
2. Nothing else on this sheet. The IBS Approval Code question is separate, in
   `PO-QUESTIONS-IBS.md`, and is still open.
