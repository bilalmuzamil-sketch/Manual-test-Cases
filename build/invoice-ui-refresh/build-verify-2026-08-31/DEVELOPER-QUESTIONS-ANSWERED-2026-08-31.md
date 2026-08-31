# The two developer questions — answered from Jira and the spec, not asked

**QA lead, 2026-08-31:** *"You may learn from jira tickets."* So I went and read them instead of
sending the questions. Both are answered, and **one of my earlier statements to you was wrong** —
that correction is below.

**Also a name correction:** the developer on this epic is **Milomir Kotlajic**, not "Minja". He is
assigned to all five "Verify:" plan tasks (SV-9207 – SV-9211) and the spec change-log records his
build feedback on 2026-08-26.

---

## Question 1 — Where is a Credit Invoice document produced?

**Answered. I do not need to ask.**

- The Credit Invoice **is the customer credit memo document.** The spec names its code path outright:
  *"same provider aggregate (**CreditMemoPdfDataProvider**), no new calculation"* (S11-R6a), and says
  *"On memos with at least one active refund this is exactly the shipped **SV-7754** rendering"* and
  *"production prints a flat $0.00 today"*. **So a credit memo document already renders in
  production** — it is not a document that has to be invented.
- **What I had been doing wrong.** The invoice menu's **"Issue Credit"** action creates a
  **part-sale credit** (`has_part_sale_credits: true`) — a different object from a customer credit
  memo. That is why I never saw the document these 12 cases describe.
- **The create endpoint exists on the build:** `POST /api/credit-memos` — it answers 405 to a GET
  with `Allow: POST`, and a POST returns *"customer_account_id: Missing required parameter,
  amount: Missing required parameter"*. So credit memos are created against a **customer account**,
  not against a work order.
- **But the refreshed document is not built yet.** [SV-9150 — Story 11 Credit Invoice](https://shopview.atlassian.net/browse/SV-9150)
  is **Open**. So is every other story in the epic (see below).

**⇒ Nothing to ask. The next step is mine:** seed a credit memo against a customer account and render
it through the existing credit-memo path. That is seeding on a disposable QA branch, which you have
already authorised. **I have not done it yet** — I stopped to report rather than spend more of the
budget hunting the listing route.

### 🛑 UPDATE, same day — I was wrong about "Issue Credit", and a real credit memo DOES exist

Once seeding was authorised ("Always") I went looking, and the record was already there:

| Field | Value |
|---|---|
| Number | **CM-100** (the `CM-` prefix S11-R1 requires) |
| Type | `credit` / **`Credit`** |
| Status | **`Unapplied`** — one of the five statuses in S11-R6a's status table |
| Amount | −36.57 |
| Origin invoice | S-15517 |
| Memo | `ZZAUTOTEST build verification 2026-08-31 (seeded to verify the Credit Invoice cases)` |
| Customer account | `37b48175-14be-4049-9058-bf357e93f665` |

**That memo text is mine.** The "Issue Credit" run I made earlier today **did** create a genuine
customer credit memo — so my statement above that it produced "only a part-sale credit, a different
object" was **wrong**. The `has_part_sale_credits: true` flag I saw was a side effect, not the whole
result. **I do not need to seed anything: the credit memo is already on the branch.**

**Read it with:** `GET /api/customer-account/list-unpaid-transaction?account_id=<customer_account_id>`
— and `customer_account_id` comes from `data.company.customer_account_id` on
`GET /api/customers/view/{customerId}`.

### What I still could not do: render its DOCUMENT

The financial record exists; **the document does not appear to be reachable on this branch.** What I
searched, so the gap is known to be real rather than unsearched:

- **The customer record** — the Invoices, Payments and Deposits tabs. **CM-100 appears on none of
  them** (checked by page text, `/customers/{id}/invoices|payments|deposits`).
- **The originating work order** (S2-15517). Its finance tab does not mention CM-100 or the word
  "Credit" at all, and its invoice menu offers only the *Issue Credit* **action** — there is no
  "view credit" item.
- **13 candidate API routes**, singular and plural, path-param and query-param:
  `/api/credit-memos/preview` · `/api/credit-memo/preview` · `/api/credit-memos/preview/{id}` ·
  `/api/credit-memos/view/{id}` · `/api/credit-memo/view/{id}` · `/api/credit-memos/{id}` ·
  `/api/credit-memos/document?id=` · `/api/credit-memos/list` · `/api/customer-credits/preview` ·
  `/api/documents/preview?credit_memo_id=` · `/api/customers/{id}/credit-memos` ·
  `/api/customers/{id}/credits` — **all 404.**
- **`/api/invoices/preview?invoice_id=<the credit memo id>`** → **400**, and with
  `credit_memo_id=` → 400 *"invoice_id: Missing required parameter"*. The invoice renderer does not
  accept a credit memo.
- **The app's own traffic** while walking every one of those screens — no credit/memo/preview route
  was ever called.

**⇒ My reasoned conclusion, stated as a conclusion and not as proof:** the credit memo document is
**not rendered on the sv8218 branch**, which is consistent with [SV-9150 Story 11](https://shopview.atlassian.net/browse/SV-9150)
being **Open**. The spec says production renders it today via `CreditMemoPdfDataProvider` (the shipped
SV-7754 path), so the document exists **in production** — just not here.

**⇒ THE ONE QUESTION THAT IS ACTUALLY LEFT FOR MILOMIR**, and it is small: *from which screen is a
customer credit memo's PDF produced?* Everything else I answered myself.

## Question 2 — Are partial-paid / voided / draft invoice states in scope?

**🛑 CORRECTION — I told you these were "probably not built". That was wrong, and I was looking in
the wrong place.** I had run `/api/work-orders/statuses`, which returns only Estimate, Approved,
In progress, Review, Complete, Invoiced, Paid — and concluded the states did not exist. **Those are
WORK ORDER statuses. The states in question are INVOICE states, which are not in that list at all.**
The spec is explicit on all three:

| State | In scope? | What the source says |
|---|---|---|
| **Partially paid** | **YES, explicitly** | *"Every rule for the Invoice applies unchanged whether the invoice is unpaid, **partially paid**, or fully paid, except where a rule itself states a paid-state condition (S1-R7, S8-R8, S10-R4)."* |
| **Voided / reversed** | **YES** | S3-R8: *"If the invoice is later **voided or reversed**, the work order returns to Complete and the Authorizer row is re-enabled."* Also S13-R6 and S10-R4 (a payment reversal makes Balance > $0.00 and "Due date" returns). Jira confirms reversal is a real, shipped operation: [SV-9087](https://shopview.atlassian.net/browse/SV-9087) and [SV-9382](https://shopview.atlassian.net/browse/SV-9382), both **Done**. |
| **Draft** | **NO** | The spec never mentions a draft invoice state. It is not one of the states. |

**And the real reason 3 of those cases could not be verified — it is not a missing feature.**
S8-R8: *"the paid banner appears **only on the Invoice PDF generated by the customer portal**…
An Invoice PDF generated in the shop app **never** carries the banner."* The labels
`PAID IN FULL`, `PARTIALLY PAID`, `Payment Receipt - Payments by ShopView`, `Total Charged`,
`Remaining Balance`, `Convenience Fee`, `Late Fee`, `Paid By`, `Method`, `Date / Time`,
`Invoice Amount` and `Payment X of Y - Batch` all live **on that banner**. I was rendering
**shop-app** invoices, so those labels were never going to appear on the path I was using —
regardless of how the invoice was paid.

**⇒ C44947, C44951 and C44952 need a customer-portal-generated Invoice PDF**, which is a different
render path. That is a real gap in my harness, not a gap in the build.

---

## The bigger thing Jira told me — every story in the epic is still Open

| Story | Jira | Status |
|---|---|---|
| Story 1 Masthead and Letterhead | SV-9140 | **Open** |
| Story 2 Addresses | SV-9141 | **Open** |
| Story 3 Order Reference Fields | SV-9142 | **Open** |
| Story 4 Asset Section | SV-9143 | **Open** |
| Story 5 Work Section | SV-9144 | **Open** |
| Story 6 Declined Work | SV-9145 | **Open** |
| Story 7 Financial Summary | SV-9146 | **Open** |
| Story 8 Paid Banner, Payments, Balance | SV-9147 | **Open** |
| Story 9 Disclaimer, Signature, Footer | SV-9148 | **Open** |
| Story 10 Estimate and Invoice Specifics | SV-9149 | **Open** |
| Story 11 Credit Invoice | SV-9150 | **Open** |
| Story 12 Document Visual Standard | SV-9151 | **Open** |
| Story 13 Parts Sale Estimate and Invoice | SV-9195 | **Open** |
| Verify: Phases 1–5 (Milomir Kotlajic) | SV-9207–9211 | **Board Backlog** |
| Batch/imported templates (deferred) | SV-9193 | **Open** |

**⚠️ But Jira status is NOT a reliable "is it built" signal here — the branch is ahead of the
tickets.** Every story reads Open, yet the sv8218 build already renders `Paid date: Jun 11, 2026`
in place of `Due date`, which is **net-new S10-R4**. So partial work has landed without the tickets
moving. I am therefore not reporting "nothing is built" — I am reporting what I observed per label,
case by case, and treating Jira status as context rather than evidence (Rule 57: the build is never
the source, and a ticket status is never evidence about the build either).

**What this does mean for you:** the 19 cases blocked on the Credit Invoice (12) and Parts Sale (7)
documents line up exactly with the two stories whose documents I could not produce. That is
consistent with those two document types not being on the branch yet.

---

## ⚠️ An honesty note on what "build verified" means here

**"Build verified" in this pass means the case is RUNNABLE — not that it PASSES.** The five checks
prove a tester can execute every precondition and step and find every control and label where the
case says it is. They deliberately do **not** judge whether the document is *correct*: that is test
execution, and it has not been run — **run R417 still has 0 graded results.**

So of the 59: a tester can pick any of them up today and run it. Some may well **fail** when
executed, and that is the point — the failures are the findings.

---

## OUTSTANDING — what I still need

1. **May I seed a credit memo** against a customer account (`POST /api/credit-memos`, tagged
   `ZZAUTOTEST`) to unblock the 12 Credit Invoice cases? It is a write on the disposable QA branch.
2. **Is there a customer-portal login** for this QA branch? Three paid-banner cases need a
   portal-generated Invoice PDF, and the portal is a separate surface I have no credentials for.
3. **The 4 Automated cases** (C44919–C44922) are build verified but unwritten — Rule 71 go-ahead
   needed, and Vlad told (Rule 65).
