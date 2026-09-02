# DEVELOPER ANSWER — "what is a Credit Invoice?" · relayed by the QA lead, 2026-09-01

**Status of this document as a source.** It is a **newer written statement shared with us**, so it is a
legitimate input (Rule 57's list is open-ended, Rule 32 latest-wins). **But most of its content
describes PRODUCT SOURCE CODE** — Twig templates and PHP providers. **Rule 96 is explicit: documents
establish INTENT; code establishes FACT and is NEVER a source of expectation.** So:

* where it AGREES with spec v45, it is **corroboration** and nothing changes;
* where it adds something the spec does not say, it is an input to **coverage and preconditions**,
  never a new Expected Result;
* where it might CONFLICT with the spec, it is a **PO decision item**, and the case is held (Rule 58).

No case was rewritten from this answer. The two actions it produced are listed at the foot and are
waiting on the QA lead.

---

## The answer, verbatim

> "Credit Invoice" = the printed credit document, not an invoice that was paid with credit.
>
> It's the customer-facing PDF a shop issues when money moves back toward the customer — a credit memo
> or a part-sale credit (return/refund). In this codebase it's a first-class document type alongside
> the regular invoice: `api/templates/invoices/credit-invoice.html.twig`, sitting next to
> `invoice.html.twig`, `part-sale-invoice.html.twig`, `batch-invoice.html.twig`.
>
> Two producers render into that one template (`docs/tech-plans/2026-08-25-invoice-ui-refresh.md:106`):
> - `CreditMemoPdfDataProvider` — the unified `Customer\Customers\Domain\CreditMemo` flow: refunds,
>   account-level credits, portal refunds, void-invoice credits. May have no origin invoice and no
>   parts at all (money-only).
> - `PartSaleCreditPdfDataProvider` — the legacy `part_sale_credit` from a part-sale return, which is
>   where restocking fees come from (`Inventory\Returns\Domain\RestockingFee`).
>
> What Story 11 covers on that document (all present in the template today, tagged S11-R*):
> - Masthead — `Credit: CM-2202` + issue date only; no boxed headline figure.
> - Addresses — the customer block is labeled "Credit To", always full width; a credit never carries a
>   "Remit Payment To".
> - Status table — Credit Number / Status / Invoice Number, where the Invoice Number column disappears
>   entirely for account-level credits with no origin invoice (SV-7772).
> - Credited items — Description / Quantity / Rate / Restocking Fee / Total. Returned parts show
>   negative qty + rate; money-only lines show `--`. Restocking Fee always renders, $0.00 when none.
>   Credit amounts use a leading minus, deliberately not the parentheses convention used for discounts.
> - Totals block — Subtotal / Tax / Total Credit (the emphasized figure) / Payments rows / Balance. Its
>   own block, not the Story 7 financial summary.
>
> The one semantic decision worth knowing: Balance on a credit is the credit's open balance — original
> − refunded − applied — and per Chris's 2026-08-12 answer (option b, plan line 74/126) it renders in
> every non-voided status, including no-refund memos where it previously printed 0.00. That's applied
> to both producers (D10).

---

## Point-by-point against spec v45 and the seven Credit Invoice cases

| # | What he said | Our position | Verdict |
|---|---|---|---|
| 1 | "Credit Invoice" = the printed credit document, not an invoice paid with credit | The whole of Story 11 is written about the printed document; no case anywhere treats it as an invoice settled with credit | ✅ **already right** |
| 2 | Masthead: `Credit: {number}` + issue date, **no** boxed headline figure | S11-R1 + S1-R6; **INV-CRED-01** | ✅ matches |
| 3 | "Credit To", always full width, **never** a "Remit Payment To" | **INV-CRED-02** expected line 3, verbatim: *"Remit Payment To never appears on the Credit Invoice, so the Credit To block is always full width."* Also Section 3 matrix: Remit Payment To → **No** on the Credit Invoice | ✅ matches, including the full-width consequence |
| 4 | Status table columns; Invoice Number column **disappears entirely** for account-level credits | S11-R3; **INV-CRED-03** expected line 4 | ✅ matches. **He adds the ticket: SV-7772** — we cite SV-7754 elsewhere but never SV-7772 |
| 5 | Credited items columns; negative qty + rate; `--` for money-only; Restocking Fee always shown, $0.00 when none; **leading minus, not parentheses** | S11-R4; **INV-CRED-04** expected lines 1–5 | ✅ matches word for word, the minus-vs-parentheses distinction included |
| 6 | Totals block rows, Total Credit emphasized, **its own block, not the Story 7 financial summary** | S11-R6; **INV-CRED-06**. Section 3 matrix row: *"Financial summary … the Credit Invoice's own totals block is listed separately below"* → **No** for the Credit Invoice | ✅ matches |
| 7 | Balance = original − refunded − applied; Chris's 2026-08-12 answer, **option b**; previously printed 0.00 on no-refund memos | S11-R6a and **INV-CRED-06** lines 2–7; our change log line for 2026-08-12 literally records *"option (b) chosen"* | ✅ **independent corroboration of the one thing we had a PO question about** |
| 8 | Two producers render the same template; restocking fees come only from the part-sale side; the balance decision applies to **both** (D10) | **Nowhere in our spec or cases.** `PartSaleCreditPdfDataProvider` / `part_sale_credit` appears in neither `requirements.md` nor any case. S11-R6a names only `CreditMemoPdfDataProvider` | 🔴 **NEW — see Action 1 and 2** |

**Nothing he wrote contradicts a single Expected Result.** Six of the eight points confirm the cases as
written; one adds a ticket reference; one is genuinely new.

---

## 🔴 Action 1 — a precondition that may describe a state the product cannot produce

**INV-CRED-04 (C44967) precondition 2, verbatim:**

> *"A Credit Invoice exists mixing a returned-part line (with a restocking fee) and a money-only credit
> line."*

If restocking fees exist **only** on the `part_sale_credit` path and money-only lines come from the
`CreditMemo` flow, **one document may not be able to carry both**, and that precondition is
unreachable — the same shape of problem as an unreachable printout state.

**This is NOT asserted as a finding.** He said the two providers feed one template and that restocking
fees come from the part-sale side; he did **not** say a single document cannot hold both. There is no
QA build for this project (Rule 85), so it cannot be checked by looking. **Rule 58: an ambiguous source
is not resolved by guessing.** It is a question, below.

**If the answer is "they cannot mix", the fix is a split, not a rewrite:** one case for the returned-part
credit (restocking fee present, negative qty and rate) and one for the money-only credit (`--` for
Quantity and Rate, Restocking Fee reading `$0.00`) — the same treatment C44996 got. The Expected
Results do not change; only which document each is read on.

## 🔴 Action 2 — the two producers are a coverage question, and it is a real one

One template, two providers, is a classic place for behaviour to diverge — and he tells us the balance
decision was **deliberately applied to both (D10)**, which is exactly the kind of thing that gets
applied to one and missed on the other.

Our seven cases say "a Credit Invoice" throughout and never say **which kind**. So today a tester could
run all seven against credit memos and never touch the part-sale credit path at all.

**Proposed, pending the QA lead's go-ahead:**

1. Each Credit Invoice case's preconditions name **which credit to open** — a credit memo, a part-sale
   credit, or "either" — and say how to produce it.
2. **INV-CRED-06 (Balance, C44969) is run on both** — a credit memo and a part-sale credit. That is the
   D10 claim, and it is the one worth testing twice.
3. **INV-CRED-05 (restocking fee, C44968)** is anchored to a **part-sale return**, since that is where a
   restocking fee can exist at all.

## 🟡 Action 3 — one ticket reference to add

S11-R3 / **INV-CRED-03 (C44966)**: the hidden Invoice Number column traces to **SV-7772**. We cite
SV-7754 for the Balance rendering but have never recorded SV-7772. A one-line `refs` addition.

## ❓ Question back to the developer — two lines, and worth asking before anything is changed

1. **Can one Credit Invoice carry a returned-part line *and* a money-only line at the same time?** Our
   INV-CRED-04 precondition assumes yes; your split of the two providers suggests no.
2. **On a *voided* credit, is the Balance row still printed showing `$0.00`, or is the row absent?**
   You wrote *"renders in every non-voided status"*. Our S11-R6a and INV-CRED-06 say the row is present
   and reads `$0.00` when voided. If the row disappears instead, INV-CRED-06 line 6 is wrong.

---

## What was NOT done, and why

* **No case was edited.** This suite is the manual tester **Mudassir Qamar**'s, no write was authorised
  for it, and the two real actions both depend on an answer that has not come back yet.
* **No Expected Result was changed from this answer.** It describes code. Code is fact, never
  expectation (Rules 57 and 96).
* **No defect was raised** — per the QA lead's 2026-09-01 instruction, this lane makes tests runnable
  and does not create defects.

---

# ADDENDUM — the developer's follow-up, 2026-09-01

> "it is just a design improvement - and there is authorizer added in the sidebar in the workorder page."

## The Authorizer half: he confirms us exactly, and corrects nothing

**S3-R5 already reads:** *"The Authorizer is selected in the customer contact card **on the left side of
every work order**, in an 'Authorizer' row directly below the Contact and Phone values."* — that is his
sidebar. **C44919 (INV-AUTH-01)** step 2 says *"Look at the customer contact card on the left side of
the work order, below the Contact and Phone values."*

All five Authorizer cases stand as written: **C44919, C44920, C44921, C44922, C44923**, plus the two
printed-document fields **C44915** (Authorizer name) and **C44916** (Approval Code).

## The "just a design improvement" half: accurate for most of the suite, and it understates the spec

He is right that the bulk of Invoice UI Refresh is the printed documents' visual standard — that is
Story 12 and the label/date rules, and nothing there needs changing.

**But spec v45 marks a number of rules as behaviour that does not exist today, beyond the work-order
Authorizer.** If the build being written is "design + the work-order authorizer", these cases will fail
on their first run — not because the cases are wrong (the spec governs, Rule 57), but because scope may
have drifted between the spec and what is being built. Worth settling before a tester finds it.

| Rule | Case | What it asserts that is NOT a visual change |
|---|---|---|
| **S13-R6** | **C44985** | The **parts sale** gets the same Authorizer treatment — its own field, the "Approves Work" list, locked at invoicing. He mentioned only the work order page. Key Decisions line: *"Authorizer entry extends to parts sales (net-new)"* |
| **S11-R6a** | **C44969** | Credit Invoice **Balance** shows the open balance on no-refund memos, where **production prints a flat $0.00 today**. A value change, decided with engineering 2026-08-12 (option b) — and he confirmed this decision himself in his first answer |
| **S2-R2** | **C44909**, **C44911** | Remit Payment To resolves from two mechanisms, with the shop-self-address fallback **dropped** |
| **S5-R7 / S5-R9** | **C44933**, **C44935** | The Invoice-Details settings, including "Summarize labor total" / "Summarize parts total", control what prints |
| **S8-R2 / S8-R4 / S8-R5** | **C44946**, **C44948**, **C44949** | Payment ordering with its tiebreak, deposits and applied account credits as labeled payment rows, and the excess-payment sub-line |
| **S4 asset section** | **C44924**, **C44925** | The asset section shows whenever the work order **has an asset**, broader than today's service-order / VIN-or-serial condition |

## Suggested question back — one line

*"Besides the work-order Authorizer, spec v45 also specs behaviour that isn't in production today:
the parts-sale Authorizer (S13-R6), the Credit Invoice open balance on no-refund memos (S11-R6a), the
Remit Payment To fallback being dropped (S2-R2), the payment rows and ordering (S8-R2/R4/R5), the
Invoice-Details summarize settings (S5-R7/R9) and the widened asset-section condition (Story 4). Are
those in this build, or design-only for now?"*

**Nothing changed in any case on the strength of this.** The spec is the source of expectation; a
developer's scope description is a signal about the build, and the build is never a source (Rule 57).
If he answers "design-only for now", the right response is Rule 69's marker on the affected cases —
`AUTOMATION: Not available on Build to test Yet` — not a rewrite of what they expect.
