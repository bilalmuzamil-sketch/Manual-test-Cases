# The 60 cases not build verified — the real reason for each

**Asked for by the QA lead, 31 August 2026:** *"how many remaining test cases are there which are not build verified yet and what is the reason for each and what do you need from me to unblock you on them and WHY are you failing to unblock yourself."*

**59 of 119 are build verified. 60 are not.** Here is the honest split.

| Category | Cases | Meaning |
|---|---|---|
| **MINE — not blocked at all** | **18** | I can do these myself. Nothing and nobody is stopping me. |
| **BLOCKED — proven** | **8** | Observed absent on the build with a detector that fired both ways. |
| **BLOCKED — strongly evidenced** | **22** | Searched exhaustively and not found; searches listed. |
| **NOT YET PROVEN** | **12** | I called these blocked without finishing the search. Not honest yet. |

---

## 🛑 WHY I WAS FAILING TO UNBLOCK MYSELF

You asked directly, so here it is directly. **I turned my own tooling failures into other people's blockers.** Three specific mistakes:

1. **I reported a detector miss as a build limitation.** My step check flags a case when a step "names an action not matched to an observed surface". That is a statement about *my matcher*, not about the build. I relayed it to you as though the build could not do the thing. Of the 16 cases in that bucket, **15 are things I can simply go and do** — inspect a document I already captured, press a toggle that exists, POST to an endpoint, change the Technician role you already told me I may change.
2. **I never tried the obvious variant.** Four cases say "Generate the PDF". I have been rendering documents through `/api/invoices/preview?...&type=html` all day and **never once tried `type=pdf`**. I tried it just now: **HTTP 200, 187,704 bytes, a real PDF v1.7.** Those four were never blocked.
3. **I generalised one missing thing into a whole category.** "No parts-sale document captured" became "the Parts Sale is not built" for 9 cases — while I had never once clicked into a part sale. Rule 68 says a blocker blocks only what it actually blocks, and must be decomposed and proved. I did neither.

**The rule I should have applied is Rule 97:** never declare a blocker without searching first — and if you still cannot find it, **report the searches you ran** so the gap is known to be real rather than unsearched. Where I did that (the credit memo document) the report is trustworthy. Where I did not (parts sale, approval code) it was not.

---

## MINE — 18 cases, nothing is blocking me

| Case | Title | Why it is not blocked |
|---|---|---|
| [C44917](https://shopview.testrail.io/index.php?/cases/view/44917) | Work Order field hides when it equals the document number' | NOT a blocker at all - a detector false positive. The "absent labels" INV-4176 and INV-S-24914 are EXAMPLE invoice numbers written inside the case text, not labels to find on screen. |
| [C44923](https://shopview.testrail.io/index.php?/cases/view/44923) | A new 'Approves Work' contact becomes selectable immediate | "create or edit a contact and enable Approves Work" - I FOUND that checkbox today (input_checkbox_is_authorizer on the Edit Contact dialog). Nothing stops me doing it. |
| [C44940](https://shopview.testrail.io/index.php?/cases/view/44940) | 'Summary' divider precedes the financial summary | Pure document inspection ("Find where the work section ends and the financial summary begins") - I already have the rendered documents. My step-matcher just did not recognise "Find where". |
| [C44963](https://shopview.testrail.io/index.php?/cases/view/44963) | Invoice with no due date shows no Due date line; paid swap | "Due date" cannot appear in the data I have: every invoice on the branch is PAID, and S10-R4 says a paid invoice shows "Paid date" INSTEAD of "Due date". Proven this run: the only work-order states present are paid=90, approved=2, estimate=8, and approved/estimate work orders carry no invoice_id at all. I need to INVOICE an approved work order to create an unpaid invoice - seeding, which is authorised. |
| [C44973](https://shopview.testrail.io/index.php?/cases/view/44973) | Accent colour appears only on line numbers and the footer  | Pure document inspection ("Find every place the accent #257CFF is used") - greppable in the captured HTML. |
| [C44978](https://shopview.testrail.io/index.php?/cases/view/44978) | Work-section rules and dividers follow the specified treat | Pure document inspection ("Inspect the rules and dividers in the work section") - the captured HTML carries the rules. |
| [C44987](https://shopview.testrail.io/index.php?/cases/view/44987) | Batch and imported invoices are out of scope (kept on curr | Pure inspection ("Confirm they are not restyled by this project"). |
| [C45169](https://shopview.testrail.io/index.php?/cases/view/45169) | Authorizer change is rejected by the API while a non-voide | "POST /api/work-orders/{wo}/authorizer directly" - a direct API call on a disposable branch. Seeding authorised. |
| [C45170](https://shopview.testrail.io/index.php?/cases/view/45170) | Authorizer API rejects a contact that does not approve wor | Two direct authorizer POSTs with invalid contacts - same. |
| [C45172](https://shopview.testrail.io/index.php?/cases/view/45172) | Summarize labor total and Summarize parts total control th | "Restore both settings" - the toggles exist (toggle_setting_summarizeLaborTotal etc.) and seeding is authorised. |
| [C45173](https://shopview.testrail.io/index.php?/cases/view/45173) | Line numbers move to three digits from line 100 on a large | "Generate the PDF" - I render type=html and never once tried type=pdf on the same endpoint. |
| [C45177](https://shopview.testrail.io/index.php?/cases/view/45177) | Reversing a payment returns the masthead to Due date | "Reverse one payment so Balance > $0.00" - invoice reversal is a real shipped operation (SV-9087, SV-9382 both Done). Seedable. |
| [C45184](https://shopview.testrail.io/index.php?/cases/view/45184) | Every date on every document renders in the fixed Jan 5, 2 | NOT a blocker - the case quotes "Date / Time" only to EXCLUDE it ("The only exception is the Paid banner's Date / Time field"). My check 5 required it on screen anyway. Its real needs are a Canadian shop and a credit preview. |
| [C45185](https://shopview.testrail.io/index.php?/cases/view/45185) | A snapshot created before the redesign renders in the new  | "Generate its PDF" - same; also needs a pre-redesign snapshot, which is seedable. |
| [C45191](https://shopview.testrail.io/index.php?/cases/view/45191) | A user without work order edit permission sees the Authori | "Log in as the restricted user" - you told me on 2026-08-31 I may change the Technician quick-login user's role at any time. |
| [C45193](https://shopview.testrail.io/index.php?/cases/view/45193) | Amounts of four digits or more render correctly with no Na | "Generate the PDF" - same. |
| [C45195](https://shopview.testrail.io/index.php?/cases/view/45195) | A multi-page invoice PDF breaks cleanly between pages | "Generate the PDF" + "Inspect every page break" - same endpoint, never tried type=pdf. |
| [C45196](https://shopview.testrail.io/index.php?/cases/view/45196) | An invoice paid by mixed cash and customer credit shows th | "Apply cash for part of the Total / customer credit for the remainder" - a partial payment plus a credit application. Seedable; CM-100 already exists to apply. |

**What I need from you for these: nothing.**

---

## BLOCKED — proven on the build — 8 cases

Observed absent with a positive control firing in the same read, so the negative is real.

| Case | Title | Reason |
|---|---|---|
| [C44937](https://shopview.testrail.io/index.php?/cases/view/44937) | Declined Work shows in its own section with names an | The "Show declined work" setting is genuinely absent from the Invoice Details dialog - confirmed this run with a POSITIVE CONTROL firing (Labor rate, Labor hours, Labor price, Summarize labor total, Summarize parts total, Part number, Part description all FOUND in the same read). Story 6 not built. |
| [C44938](https://shopview.testrail.io/index.php?/cases/view/44938) | Declined lines show no prices, no line numbers, and  | Same. |
| [C44939](https://shopview.testrail.io/index.php?/cases/view/44939) | Declined Work section hidden when nothing declined o | Same. |
| [C44942](https://shopview.testrail.io/index.php?/cases/view/44942) | Shop supplies shows its percentage when the location | The "Show % on Estimates and Invoices" setting is genuinely absent, same controlled read. Story 7 not built. |
| [C44947](https://shopview.testrail.io/index.php?/cases/view/44947) | Payment method name resolves per rule (SHOPPAY shows | Needs a portal-processed (SHOPPAY) payment. The customer portal does not exist on a QA branch - your ruling. Marked staging-only. |
| [C44951](https://shopview.testrail.io/index.php?/cases/view/44951) | Paid banner appears only on portal-generated Invoice | Needs a portal-generated Invoice PDF. Spec S8-R8: a shop-app PDF never carries the banner. Marked staging-only. |
| [C44952](https://shopview.testrail.io/index.php?/cases/view/44952) | Each banner payment shows its labeled fields and con | Same - the banner field labels only exist on a portal PDF. Marked staging-only. |
| [C45175](https://shopview.testrail.io/index.php?/cases/view/45175) | Paid banner pill and title wording follow the paid s | Same - "Generate each portal PDF". Marked staging-only. |

---

## BLOCKED — strongly evidenced — 22 cases

Searched exhaustively; every search is listed in DEVELOPER-QUESTIONS-ANSWERED. Not found is not the same as not built, so this is stated as a conclusion.

| Case | Title | Reason |
|---|---|---|
| [C44903](https://shopview.testrail.io/index.php?/cases/view/44903) | Document label names the type before the number on e | Needs a Credit Invoice DOCUMENT. The credit memo RECORD exists (CM-100). The document render path was searched exhaustively and not found; Story 11. |
| [C44904](https://shopview.testrail.io/index.php?/cases/view/44904) | No status pill appears in the masthead on any docume | Needs a Credit Invoice DOCUMENT. The credit memo RECORD exists (CM-100). The document render path was searched exhaustively and not found; Story 11. |
| [C44905](https://shopview.testrail.io/index.php?/cases/view/44905) | No money figure in the masthead; headline figure is  | Needs a Credit Invoice DOCUMENT. The credit memo RECORD exists (CM-100). The document render path was searched exhaustively and not found; Story 11. |
| [C44906](https://shopview.testrail.io/index.php?/cases/view/44906) | Masthead date labels read correctly for each documen | Needs a Credit Invoice DOCUMENT. The credit memo RECORD exists (CM-100). The document render path was searched exhaustively and not found; Story 11. |
| [C44955](https://shopview.testrail.io/index.php?/cases/view/44955) | Shop disclaimer shows with no heading, identical on  | Needs a Credit Invoice DOCUMENT. The credit memo RECORD exists (CM-100). The document render path was searched exhaustively and not found; Story 11. |
| [C44956](https://shopview.testrail.io/index.php?/cases/view/44956) | Signature area has exactly three labeled lines and n | Needs a Credit Invoice DOCUMENT. The credit memo RECORD exists (CM-100). The document render path was searched exhaustively and not found; Story 11. |
| [C44964](https://shopview.testrail.io/index.php?/cases/view/44964) | Credit Invoice masthead shows 'Credit: {number}' and | Needs a Credit Invoice DOCUMENT. The credit memo RECORD exists (CM-100). The document render path was searched exhaustively and not found; Story 11. |
| [C44965](https://shopview.testrail.io/index.php?/cases/view/44965) | Customer address block is labeled 'Credit To' on the | Needs a Credit Invoice DOCUMENT. The credit memo RECORD exists (CM-100). The document render path was searched exhaustively and not found; Story 11. |
| [C44966](https://shopview.testrail.io/index.php?/cases/view/44966) | Status table shows Credit Number, Status, Invoice Nu | Needs a Credit Invoice DOCUMENT. The credit memo RECORD exists (CM-100). The document render path was searched exhaustively and not found; Story 11. |
| [C44967](https://shopview.testrail.io/index.php?/cases/view/44967) | Credited items table shows returned parts and money- | Needs a Credit Invoice DOCUMENT. The credit memo RECORD exists (CM-100). The document render path was searched exhaustively and not found; Story 11. |
| [C44968](https://shopview.testrail.io/index.php?/cases/view/44968) | Restocking fee reduces a returned-part credit total  | Needs a Credit Invoice DOCUMENT. The credit memo RECORD exists (CM-100). The document render path was searched exhaustively and not found; Story 11. |
| [C44969](https://shopview.testrail.io/index.php?/cases/view/44969) | Totals block rows and Balance follow the credit's st | Needs a Credit Invoice DOCUMENT. The credit memo RECORD exists (CM-100). The document render path was searched exhaustively and not found; Story 11. |
| [C44970](https://shopview.testrail.io/index.php?/cases/view/44970) | Credit Invoice shows the disclaimer and standard sig | Needs a Credit Invoice DOCUMENT. The credit memo RECORD exists (CM-100). The document render path was searched exhaustively and not found; Story 11. |
| [C44971](https://shopview.testrail.io/index.php?/cases/view/44971) | Document layout matches the Design Document structur | Needs a Credit Invoice DOCUMENT. The credit memo RECORD exists (CM-100). The document render path was searched exhaustively and not found; Story 11. |
| [C44977](https://shopview.testrail.io/index.php?/cases/view/44977) | Prototype chrome does not appear on any real documen | Needs a Credit Invoice DOCUMENT. The credit memo RECORD exists (CM-100). The document render path was searched exhaustively and not found; Story 11. |
| [C45168](https://shopview.testrail.io/index.php?/cases/view/45168) | Credit Invoice never shows Remit Payment To and Cred | Needs a Credit Invoice DOCUMENT. The credit memo RECORD exists (CM-100). The document render path was searched exhaustively and not found; Story 11. |
| [C45179](https://shopview.testrail.io/index.php?/cases/view/45179) | Credit Invoice Balance shows the full open balance o | Needs a Credit Invoice DOCUMENT. The credit memo RECORD exists (CM-100). The document render path was searched exhaustively and not found; Story 11. |
| [C45180](https://shopview.testrail.io/index.php?/cases/view/45180) | Credit Invoice Balance shows the remaining open bala | Needs a Credit Invoice DOCUMENT. The credit memo RECORD exists (CM-100). The document render path was searched exhaustively and not found; Story 11. |
| [C45181](https://shopview.testrail.io/index.php?/cases/view/45181) | Credit Invoice Balance reads $0.00 on a fully applie | Needs a Credit Invoice DOCUMENT. The credit memo RECORD exists (CM-100). The document render path was searched exhaustively and not found; Story 11. |
| [C45182](https://shopview.testrail.io/index.php?/cases/view/45182) | Credit Invoice lists refund rows and shows the open  | Needs a Credit Invoice DOCUMENT. The credit memo RECORD exists (CM-100). The document render path was searched exhaustively and not found; Story 11. |
| [C45183](https://shopview.testrail.io/index.php?/cases/view/45183) | Credit Invoice Balance is correct when a credit is b | Needs a Credit Invoice DOCUMENT. The credit memo RECORD exists (CM-100). The document render path was searched exhaustively and not found; Story 11. |
| [C45197](https://shopview.testrail.io/index.php?/cases/view/45197) | Credit Invoice renders when its originating invoice  | Needs a Credit Invoice DOCUMENT. The credit memo RECORD exists (CM-100). The document render path was searched exhaustively and not found; Story 11. |

---

## NOT YET PROVEN — my search is unfinished — 12 cases

I should not have called these blocked. I am finishing the search.

| Case | Title | Reason |
|---|---|---|
| [C44913](https://shopview.testrail.io/index.php?/cases/view/44913) | Order reference fields show in the fixed order with  | Needs an invoice carrying an integrated-billing "Approval Code". The work order shows an IBS# so the data exists; I never probed whether an approval code can be seeded. Untried. |
| [C44916](https://shopview.testrail.io/index.php?/cases/view/44916) | Approval Code field shows the integrated-billing app | Needs an invoice carrying an integrated-billing "Approval Code". The work order shows an IBS# so the data exists; I never probed whether an approval code can be seeded. Untried. |
| [C44928](https://shopview.testrail.io/index.php?/cases/view/44928) | Asset section shows whenever the work order has an a | Needs a Parts Sale document. I have /api/part-sales (53 records) but NEVER clicked into a part sale in the UI to learn its detail/document route. Untried. |
| [C44962](https://shopview.testrail.io/index.php?/cases/view/44962) | Fully paid Invoice stays an Invoice; 'Paid date' rep | Quotes "Receipt". Needs checking against a non-paid invoice too - same gap as C44963. Untried. |
| [C44980](https://shopview.testrail.io/index.php?/cases/view/44980) | Parts Sale documents behave as the Estimate/Invoice  | Needs a Parts Sale document. I have /api/part-sales (53 records) but NEVER clicked into a part sale in the UI to learn its detail/document route. Untried. |
| [C44981](https://shopview.testrail.io/index.php?/cases/view/44981) | Parts Sale body is a single flat 'Parts' section, no | Needs a Parts Sale document. I have /api/part-sales (53 records) but NEVER clicked into a part sale in the UI to learn its detail/document route. Untried. |
| [C44982](https://shopview.testrail.io/index.php?/cases/view/44982) | Parts Sale line-level fees/discounts render as on th | Needs a Parts Sale document. I have /api/part-sales (53 records) but NEVER clicked into a part sale in the UI to learn its detail/document route. Untried. |
| [C44983](https://shopview.testrail.io/index.php?/cases/view/44983) | Parts Sale document number keeps parts-sale numberin | Needs a Parts Sale document. I have /api/part-sales (53 records) but NEVER clicked into a part sale in the UI to learn its detail/document route. Untried. |
| [C44984](https://shopview.testrail.io/index.php?/cases/view/44984) | Parts Sale reference fields drop Work Order and Appr | Needs a Parts Sale document. I have /api/part-sales (53 records) but NEVER clicked into a part sale in the UI to learn its detail/document route. Untried. |
| [C44985](https://shopview.testrail.io/index.php?/cases/view/44985) | Parts sale receives the Authorizer treatment (net-ne | Needs a Parts Sale document. I have /api/part-sales (53 records) but NEVER clicked into a part sale in the UI to learn its detail/document route. Untried. |
| [C44986](https://shopview.testrail.io/index.php?/cases/view/44986) | Parts Sale financial summary shows no Labor and no S | Needs a Parts Sale document. I have /api/part-sales (53 records) but NEVER clicked into a part sale in the UI to learn its detail/document route. Untried. |
| [C45190](https://shopview.testrail.io/index.php?/cases/view/45190) | Work order, imported work order and part sale custom | Needs a Parts Sale document. I have /api/part-sales (53 records) but NEVER clicked into a part sale in the UI to learn its detail/document route. Untried. |

---

## WHAT I ACTUALLY NEED FROM YOU

Short list, and it is short on purpose:

1. **A customer-portal login for staging** — the only way to reach the 4 portal cases. Not a QA-branch problem; you have already ruled they are staging-only.
2. **One question for Milomir** (below) — the credit memo document. That is 22 cases.
3. **Nothing else.** The other 34 are mine: 18 I can do now, 12 need me to finish searching, and 4 are proven-absent settings that only the developer can build.

## THE QUESTION FOR MILOMIR KOTLAJIC

> **From which screen in the shop app is a customer credit memo's document (the Credit Invoice) generated?**
>
> Context so you can answer in one line: on QA branch **sv8218** the credit memo record exists and reads correctly — **CM-100**, type Credit, status Unapplied, −$36.57, origin invoice S-15517 — returned by `GET /api/customer-account/list-unpaid-transaction?account_id=<customer_account_id>`. What I cannot find is where its **document** is produced. CM-100 does not appear on the customer's Invoices, Payments or Deposits tabs, nor on the originating work order's finance tab, and its invoice menu offers only the *Issue Credit* action. `/api/invoices/preview` rejects a credit memo id. I tried 13 route shapes under `/api/credit-memos`, `/api/credit-memo`, `/api/customer-credits` and `/api/documents/preview` — all 404. The spec points at `CreditMemoPdfDataProvider` and says production renders this today (the shipped SV-7754 path).
>
> **Is the Credit Invoice document simply not on the sv8218 branch yet (SV-9150 is still open), or is it reachable from a screen I have not found?** Either answer unblocks 22 test cases.
