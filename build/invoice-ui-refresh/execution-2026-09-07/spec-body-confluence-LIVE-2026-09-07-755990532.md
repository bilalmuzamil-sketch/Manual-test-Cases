|  |  |
| --- | --- |
| **Epic** | [SV-8218](https://shopview.atlassian.net/browse/SV-8218) |
| **Owner** | Chris W. |
| **Status** | Ready to build |
| **Documents covered** | Estimate, Invoice (a fully paid Invoice serves as the receipt), Credit Invoice |
| **Design** | [Design Document](https://claude.ai/code/artifact/c88ee207-3197-4f54-8cb9-bac3deb84354) |
| **Slack Channel** | <https://shopview.slack.com/archives/C0BRRDKH10W> |

# Customer Documents — Product Spec

## Visual design status

The design element for this spec is the [Design Document](https://claude.ai/code/artifact/c88ee207-3197-4f54-8cb9-bac3deb84354). It shows the layout, structure, and intent of every document covered here.

This spec defines the **information and the exact wording** that must appear on each document, and the rules for when each piece of content is shown or hidden. The Design Document is the **binding visual reference**: there is no separate designer on this build, so the appearance shown in the prototype is a requirement, not direction. Story 12 (Document Visual Standard) states the verifiable visual rules; the banner order (S8-R8) and the full-width address rule (S2-R3) remain called out as binding content rules.

**Where the prototype and this spec disagree on content or wording, this spec is the source of truth; on appearance, the Design Document is the source of truth.** A conflict that cannot be resolved by that split goes to Chris W.

## Shipped-behavior note

The Invoice and Credit Invoice content in this spec matches the **behavior already shipped** in ShopView (verified against the production codebase). Where a piece of content does **not** exist today and would be new work, it is marked **"net-new."** Number, date, currency, and percentage **formats** follow ShopView's existing document conventions (locale-aware for US and Canadian shops); this spec does not redefine them.

## 1. Business Case

ShopView issues customer documents: the Estimate, the Invoice (which, once fully paid, also serves as the customer's receipt), and the Credit Invoice. For customers and shop staff to read them confidently, each document must carry a consistent, well-defined set of information, use consistent wording, and make its most important figure the easiest number to find. This spec defines that content standard so every document is complete, predictable, and easy to read.

## 2. Feature Overview

**Core**

- One consistent content standard across the customer documents: the Estimate, the Invoice (including its paid state), the Credit Invoice, and the Parts Sale Estimate and Parts Sale Invoice (Story 13).
- The document type determines the type label, the candidate date labels, the work-section heading, the headline figure, and which sections can appear. Within the Invoice, paid state selects between "Due date" and "Paid date" (S10-R4), and data state shows or hides optional content (Section 5).
- The work breakdown, the financial summary, and the amounts owed are presented as clearly separated, consistently labeled sections.
- Each document carries a single headline figure as the boxed figure at the end of the totals block — never in the masthead (S1-R6). The Credit Invoice deliberately has no headline figure; its key figure, Total Credit, sits in the totals block (S11-R6).

**Payment Receipt**

- The receipt for an invoice **is the paid Invoice itself**: the same document, listing its payments, with a Balance of $0.00 and "Paid date: {date}" in place of "Due date: {date}" (S10-R4). The document label "Invoice: {number}" never changes — the date label is the only masthead change. This matches how the leading invoicing products behave.
- The **paid banner** appears only on the Invoice PDF the customer portal generates (Story 8); a PDF generated in the shop app never carries it. This is the behavior already in production; nothing portal-side changes in this spec.

**Out of scope**

- **How amounts are computed** — the calculation engine for totals, taxes, fees, and discounts. Where this spec states arithmetic (the Balance, credit item totals), it restates the display math already in production so QA can verify the visible numbers; it does not define new calculations.
- **Additional entry points for the Remit Payment To payee.** The payee comes from the shop's integrated-billing setup or from the location's own remit-to setting (S2-R2); when present it is displayed on the Estimate and Invoice (Section 3). No further entry points are added.
- **Batch invoices and imported invoices.** Separate templates, deferred to [SV-9193](https://shopview.atlassian.net/browse/SV-9193). Until that ships, a customer can receive a batch or imported invoice in the previous visual language while the documents in this spec carry the new one — a deliberate, temporary split.
- **The standalone portal Payment Receipt.** A separate receipt exists in the customer portal for portal-processed payments. It has a printable page and a shareable email, and covers single, batch, and Quick-Charge payments. It is out of spec, and its content is not specified by this spec.
- **Pixel-level polish.** Nudging spacing within the Story 12 token set may happen during build without a spec change. Changing the palette, the typography, the layout structure, or the visual hierarchy is a spec change and needs sign-off (Story 12).

## 3. Document composition

This matrix is the final rule for **which sections appear on which document**. If a story below disagrees with it, follow this matrix.

| Section | Estimate | Invoice | Credit Invoice |
| --- | --- | --- | --- |
| Masthead (shop identity, logo, label + number — no monetary figure) | Yes | Yes | Yes (no headline figure) |
| Masthead document label | "Estimate: {number}" | "Invoice: {number}" | "Credit: {number}" |
| Date(s) shown | "Estimate date: {date}" (net-new) | "Invoice date: {date}" and "Due date: {date}"; on a fully paid invoice, "Paid date: {date}" replaces "Due date: {date}" (S10-R4) | "Issue date: {date}" |
| Headline figure (boxed, end of totals block) | "Estimated Total" | "Balance" | None |
| Bill To | Yes | Yes | Yes — labeled "Credit To" |
| Remit Payment To (when a payee is present) | Yes | Yes | No |
| Asset section | Yes (asset attached — Story 4) | Yes (same condition) | No |
| Order reference fields | Yes | Yes | No |
| Work section | "Work Summary" | "Work Performed" | No |
| Declined Work (when applicable) | Yes | Yes | No |
| Financial summary (the Labor … Total block; the Credit Invoice's own totals block is listed separately below) | Yes | Yes | No |
| Paid banner (Story 8) | No | Yes — portal-generated PDFs only (S8-R8) | No |
| Payments and Balance | No | Yes | Yes (Payments section + Balance — S11-R6) |
| Credited Items and Total Credit | No | No | Yes |
| Standard note (disclaimer) | Shop disclaimer (when configured — S9-N1) | Shop disclaimer (when configured — S9-N1) | Shop disclaimer (when configured — S9-N1) |
| Signature area | Yes | Yes | Yes |
| Footer tax identifier | Yes (when configured — S9-N2) | Yes (when configured — S9-N2) | Yes (when configured — S9-N2) |

*\* Context note: a fully paid Invoice is not a separate column — it is the same Invoice with its payments listed and a Balance of $0.00. "Terms" appears only on the Estimate and Invoice (Story 3).*

## 4. Jobs to be Done

> **When** I hand a customer an estimate or invoice, **I want** the document to show the most important number first and most prominently and to be easy to read, **so** the customer immediately understands what they are approving or paying.

> **When** I open any customer document, **I want** each one to contain the same information in the same places with the same wording, **so** I always know where to look.

**Goals**

- Define the information and wording required on each document.
- Present the documents consistently.
- Make the headline figure and the balance the easiest numbers to find.

## 5. Key Decisions

- **The document type determines** the type label, the candidate date labels, the work-section heading, the headline figure, and which sections can appear. Within the Invoice, paid state selects between "Due date" and "Paid date" (S10-R4); data state shows or hides optional content.
- **A fully paid Invoice stays an Invoice.** Its label does not change to "Receipt"; the payments listed and the $0.00 Balance are the proof of payment. This matches every leading invoicing product surveyed; a receipt documents a payment, not an invoice, and the invoice is the tax and accounts-payable document in both the US and Canada. The one masthead change at full payment is the date: "Paid date: {date}" replaces "Due date: {date}" (S10-R4, net-new).
- **The masthead carries no status pill on any document.** Status appears only with the content that proves it: the Paid banner's pill (Story 8) and the status column in the Credit Invoice's status table (Story 11).
- **The masthead document label names the type before the number:** "Estimate: {number}", "Invoice: {number}", "Credit: {number}". The number always includes its type prefix (Story 1).
- **The Terms field is shown on the Estimate and Invoice, not on the Credit Invoice.** An estimate may cover work not yet performed, so payment terms are relevant on it.
- **Optional fields follow one rule: if the value is present, show it; if it is empty, hide it.** This applies to Customer PO, the Approval Code, the Authorizer (S3-N3), and the optional asset fields. Terms is the one deliberate exception (S3-R2).
- **Remit Payment To is shown only on the Estimate and Invoice, and only when a remit-to payee is present** through the integrated-billing setup or the location's own remit-to setting (S2-R2).
- **The Invoice's remaining figure is labeled "Balance," not "Amount Due"** (this matches the behavior already shipped in production). Balance equals the Total minus all applied payments (any method), applied deposits, and applied customer-account credits, and is floored at $0.00 — an overpaid invoice shows "Balance" with "$0.00", never a negative amount and never a hidden row.
- **The signature area carries no authorization or acknowledgment sentence** — only the signature, printed-name, and date lines.
- **One signature style on every document:** lines labeled exactly "Customer Signature", "Printed Name", and "Date", identical across all documents.
- **Parts sale documents are in scope; batch and imported invoices are deferred.** The parts sale estimate and invoice share the entire document chrome — only the body differs (a flat Parts section instead of jobs) — so deferring them would have left the most common non-service document in the old visual language. Batch and imported invoices are genuinely different templates and wait for [SV-9193](https://shopview.atlassian.net/browse/SV-9193). Restyling shared template partials must not half-restyle the deferred templates; dev confirms the three current templates' partials are forked or untouched. (Chris + Milan review, 2026-08-12; Story 13.)
- **Remit Payment To keeps both production mechanisms.** The payee resolves from integrated billing or from the location's own remit-to setting; only the fallback that printed the shop's own address is dropped (net-new). A location configured to remit elsewhere keeps printing it. (Milan review, 2026-08-12; S2-R2.)
- **Credit Invoice Balance preserves SV-7754.** Balance reads the remaining available credit, positive, rather than a flat $0.00 — flattening it would regress a recent PO-specced fix. (Milan review, 2026-08-12; S11-R6/S11-R6a.)
- **Authorizer entry extends to parts sales (net-new).** Same treatment as the work order: same "Approves Work" contact list, empty by default, locked at invoicing, printed on the document. (Chris, 2026-08-12; S13-R6.)

## 6. Terminology

- **Masthead** — the block of the document that carries the shop identity (name, address, phone, logo) and the document label with its number; its placement on the page follows the design prototype. The masthead carries no monetary figure. "Letterhead" refers to the shop-identity lines within the masthead.
- **Headline figure** — the single most important monetary amount, carried as the boxed figure at the end of the totals block (visual prominence follows the design prototype) — for example the Balance on an Invoice. It never appears in the masthead.
- **Status pill** — a short status label with fixed, required text (for example "PAID IN FULL"). It appears only in the Paid banner (Story 8), never in the masthead. Its shape is a visual choice shown in the design prototype. The banner's "Payment X of Y · Batch" marker is a count, not a status pill.
- **Payment Receipt** — three different things share this name; do not confuse them: (1) the customer's receipt for an invoice, which is simply the **fully paid Invoice** (payments listed, Balance $0.00, "Paid date: {date}" in the masthead — no separate document); (2) the **Paid banner's title string** "Payment Receipt - Payments by ShopView" (or its "(Batch)" variant — S8-R8), fixed wording that already exists in production and appears on portal-generated Invoice PDFs (S8-R8), including on a partially paid invoice — its presence does not change what the document is; (3) the **standalone portal receipt**, which is on pause and out of scope (Section 2).
- **Work Summary** — the heading over the work breakdown on an **Estimate**. An estimate may cover work not yet performed, so a neutral heading is used rather than "Work Performed." On an **Invoice** the same section is headed **Work Performed**.
- **Description** — a work line's own summary text (S5-R4).
- **Scope-of-work note** — a separate, per-line note describing the scope of that line's work, distinct from the Description (S5-R5). Shown below the description when present.
- **Shop supplies** — a single shop-wide charge, calculated as a percentage of labor, with an optional minimum charge amount and an optional maximum charge amount. It is its own charge row and is not an Adjustment.
- **Adjustments** — fees and discounts. A **work-order-wide** adjustment applies to the whole work order (for example a disposal fee or a fleet discount); a **line-level** adjustment is tied to a single labor or parts line.
- **Rollup row** — a single row whose amount is the sum of many line-level amounts (S7-R5).
- **Gross** — an amount before fees and discounts are applied. Not related to tax; taxes are always their own rows (S7-R8).
- **Applied** — used as payment against an invoice. The "applied amount" of a payment (S8-R2) is the portion of that payment used on this invoice; a payment can be applied across more than one invoice.
- **Deposit** — money collected on a work order before invoicing; when the invoice is created, the deposit is applied to it like a payment (S8-R4).
- **Customer-account credit** — a stored amount on the customer's account, usable as payment on invoices. Distinct from the Credit Invoice document, and distinct from credit-card payments.
- **Balance** — on an Invoice: the Total minus all applied payments, deposits, and customer-account credits, floored at $0.00 (S8-R6). On the Credit Invoice, "Balance" is the credit's open balance — the original credit total minus amounts refunded minus amounts applied to invoices — shown positive, reading $0.00 once nothing remains or the credit is voided (S11-R6a). It does not follow the Invoice formula.
- **Fully paid** — an Invoice is fully paid when its Balance is $0.00 **and** at least one payment, deposit, or customer-account credit is applied to it. An invoice with a $0.00 Total and nothing applied is not fully paid — it keeps "Due date: {date}" (S10-R4).
- **Portal-processed payment** — a payment the customer made through the customer portal (recorded with the "SHOPPAY" method code — S8-R3). Only these payments appear in the Paid banner, and the banner appears only on portal-generated PDFs (S8-R8).
- **Batch payment** — one portal checkout that pays multiple invoices in a single charge (S8-R9).
- **Integrated-billing setup** — the shop's configured billing integration; it is one source of a Remit Payment To payee; the other is the location's own remit-to setting.
- **Remit Payment To** — the address a customer sends payment to when it differs from the shop's own address. It is a payee address.
- **Declined Work** — work that was priced and offered to the customer, and the customer declined it. Shown for reference only.
- **Credited item** — a line on the Credit Invoice. Either a returned part (actual quantity and rate, matching the part on the original invoice) or a money-only credit line (a refund or goodwill amount — Quantity and Rate show "--") (Story 11).

---

## 7. Requirements

*Each story's **Design** link points to the *[*Design Document*](https://claude.ai/code/artifact/c88ee207-3197-4f54-8cb9-bac3deb84354)*, the design reference for every story. Requirements below are content and wording only. Section 3 (Document composition) governs which sections appear on each document; the stories below do not repeat that. Every rule for the Invoice applies unchanged whether the invoice is unpaid, partially paid, or fully paid, except where a rule itself states a paid-state condition (S1-R7, S8-R8, S10-R4). **Two standing principles decide any question this spec leaves open, and they are the reason most review items resolve the way they do.** First, **the Design Document is the source of visual truth**: on appearance, what it renders is binding, and a rule here that disagrees with it is the thing that is wrong. Second, **behaviour is the existing production behaviour unless a rule marks itself net-new**: this project restyles the customer documents, it does not redesign how they work, and the Authorizer (S3-R5 to S3-R8, S13-R6) is the one substantive behavioural addition. Where a rule in this spec is found to disagree with what production already does, and that rule is not marked net-new, the rule is amended to describe production rather than production being changed to match the rule.*

**G-R1 (date format, all stories):** Every {date} on every document renders as, for example, "Jan 5, 2026": abbreviated English month, day of the month without a leading zero, a comma, and the four-digit year (PHP format string "M j, Y"). This format is fixed: no shop or user setting controls it, and it is identical for US and Canadian shops. The one exception is the Paid banner's "Date / Time" field (S8-R9), which the portal supplies at generation time: the same date format, then " - ", then the time as a 12-hour clock with two-digit minutes and the shop timezone abbreviation, for example "Jan 5, 2026 - 2:41 PM MST".

**G-R3 (issued documents are frozen, all stories):** An issued document renders the values captured when it was issued, never the values current at the time it is re-opened, re-downloaded or re-printed. Renaming a location, editing a shop address, changing a customer contact or altering a setting does not change a document that has already been issued, and re-opening an old document is not expected to show the new value. This is the intended behaviour and never a defect: the document is the record of what the customer received. It is why the remit-to payee is read from the invoice itself once issued (D9), and why a snapshot shows the location name as it stood at issue time. Documents not yet issued render current values in the normal way. (Stefan, P7.)

**G-R2 (PDF filename, all stories):** A downloaded PDF is named with the document's own full document number exactly as it appears on the document, then ".pdf" (for example "INV-S2-4802.pdf", "EST-P2-1088.pdf"). The filename carries nothing else: no shop or location name, no customer name, no date, no document-type word, and no spaces. The name is the same however the PDF is produced, in the app or from the customer portal. (Milomir, SV-9646 item 6.)

### Story 1: Masthead and Letterhead

**As a** customer receiving a document, **I want** a header that tells me who issued it, what it is, and the headline amount, **so that** I can identify the document and know what to do with it.

**Design:** [Design Document](https://claude.ai/code/artifact/c88ee207-3197-4f54-8cb9-bac3deb84354)

**Jira:** [SV-9140](https://shopview.atlassian.net/browse/SV-9140)

**Prerequisites:**

- The document is an Estimate, Invoice, or Credit Invoice.

**Requirements:**

- **S1-R1:** The masthead shows the shop location's name, street address, city, state or province, postal code, and phone number.
- **S1-R2:** The masthead shows the shop's logo when the shop has set one; when no logo is set, no logo and no placeholder are rendered.
- **S1-R3:** The masthead shows the document label naming the type before the number: exactly "Estimate: {number}", "Invoice: {number}", or "Credit: {number}". The number always includes its type prefix — for example "Estimate: EST-4176", "Invoice: INV-4176", "Credit: CM-2202".
- **S1-R4:** The document number uses the shop's existing document numbering; the Credit Invoice's number carries the "CM-" prefix (Story 11).
- **S1-R5:** The masthead carries no status pill on any document. Status appears only with the content that proves it: the Paid banner's pill (Story 8) and the status column in the Credit Invoice's status table (Story 11).
- **S1-R6:** The masthead shows no monetary figure on any document. The document's single headline figure appears once, as the boxed figure at the end of the totals block, with a label matching the document type: "Estimated Total" on an Estimate (its value is the financial summary's "Total" — S7-R9), "Balance" on an Invoice (its value is the S8-R6 Balance). The Credit Invoice has no boxed figure — its masthead carries only "Credit: {number}" and "Issue date: {date}", and its key figure, Total Credit, sits in the totals block (S11-R6).
- **S1-R7:** The masthead date labels read exactly: "Invoice date: {date}" and "Due date: {date}" on an Invoice; on a fully paid Invoice, "Paid date: {date}" replaces "Due date: {date}" (S10-R4); "Issue date: {date}" on a Credit Invoice; "Estimate date: {date}" on an Estimate (net-new — S10-R2).

**Negative cases:**

- **S1-N1:** Within the masthead, the street address, city, state or province, postal code, and phone number are each hidden when empty.

---

### Story 2: Addresses

**As a** customer, **I want** to see who the document is billed to and, when applicable, where to send payment, **so that** I know my account and how to pay.

**Design:** [Design Document](https://claude.ai/code/artifact/c88ee207-3197-4f54-8cb9-bac3deb84354)

**Jira:** [SV-9141](https://shopview.atlassian.net/browse/SV-9141)

**Prerequisites:**

- The document has an associated customer.

**Requirements:**

- **S2-R1:** The document shows a block labeled exactly "Bill To" with the customer's name, street address, city, state or province, and postal code. The name is the customer's company name when present, otherwise the customer's personal name. On the Credit Invoice this block is labeled exactly "Credit To" (S11-R2); every other rule in this story applies to it unchanged.
- **S2-R2:** On the Estimate and Invoice (not the Credit Invoice), the document shows a block labeled exactly "Remit Payment To" when a remit-to payee is present for the document. The payee resolves from either production mechanism: the shop's integrated-billing remit-to, or the location's own remit-to setting (a location configured to remit to another location or to a custom address). When neither is configured, the block is not shown **(net-new: production previously fell back to printing the shop's own address as the remit-to)**. A location whose own remit-to setting points at that same location is not a configured payee: that is the dropped self-address case, so the block is not shown. When both are configured, integrated billing wins: the integrated-billing payee is used whenever the customer on the work order has an integrated-billing account number, and the location's own remit-to applies only to customers who do not.

> *\* Context note: this records existing behaviour rather than changing it. Two details matter for testing. The deciding condition is the CUSTOMER's integrated-billing account number, not anything set on the location; and the integrated-billing payee is held for the whole organization rather than per location. A location deliberately set to a custom address will therefore still show the integrated-billing payee for a customer who has an account number. (Mudassir, SV-9689.)*
- **S2-R3:** When the Remit Payment To block is not shown, the Bill To block spans the full width of the addresses area (it does not stay at half width). This width rule is binding on appearance, like the banner-order rule (S8-R8). On the Credit Invoice, Remit Payment To never appears (Section 3), so the Credit To block is always full width.

**Negative cases:**

- **S2-N1:** Within the Bill To block, the street address, city, state or province, and postal code are each hidden when empty. The name line is always shown.
- **S2-N2:** When no remit-to payee is present, the Remit Payment To block is not shown.

*\* Context note: a remit-to payee comes from the shop's integrated-billing setup or from the location's own remit-to setting (S2-R2).*

---

### Story 3: Order Reference Fields

**As a** shop, **I want** the order reference fields shown according to the per-field rules below (Terms is the one field that always shows), **so that** the document stays uncluttered.

**Design:** [Design Document](https://claude.ai/code/artifact/c88ee207-3197-4f54-8cb9-bac3deb84354)

**Jira:** [SV-9142](https://shopview.atlassian.net/browse/SV-9142)

**Prerequisites:**

- The document is an Estimate or Invoice.

**Requirements:**

- **S3-R1:** The order reference fields area can show five fields, in this order, labeled exactly "Work Order", "Customer PO", "Authorizer", "Approval Code", and "Terms". In this area, field labels render with no punctuation after them (no colon).
- **S3-R2:** The Terms field is always shown on the Estimate and Invoice — the one deliberate exception to the hide-when-empty rule (Section 5).
- **S3-R3:** The Authorizer field shows the full name of the work order's selected Authorizer (net-new). The Authorizer is selected on the work order per S3-R5.
- **S3-R4:** The Approval Code field shows the work order's integrated-billing approval code (net-new placement — see the context note). This is the approval code issued for that job, not the customer's integrated-billing account number; an account number never appears in this field. (Confirmed 2026-09-04; Stefan, P5.)
- **S3-R5 (entry point, net-new):** The Authorizer is selected in the customer contact card on the left side of every work order, in an "Authorizer" row directly below the Contact and Phone values, in the same label-and-value style. Selecting the row opens a list of the customer's contacts that have "Approves Work" enabled on the contact record; no other contact and no free-typed name can be chosen. This is the only entry point.
- **S3-R6 (net-new):** The Authorizer is not required and defaults to empty. The list carries a "No authorizer" option that clears the selection. **When no Authorizer is selected, the card's Authorizer row reads exactly "None"**, styled as a muted placeholder rather than as a value, in the same treatment the Design Document gives it. The two strings are different on purpose and are not interchangeable: "No authorizer" is the option inside the list that clears the selection, and "None" is what the row displays once it is cleared. Neither string reaches a customer document: an empty Authorizer prints nothing at all (S3-N3). (Stefan, P2.)
- **S3-R7 (net-new):** When the selected Authorizer's contact record has a phone number, the phone number is shown in the card directly below the Authorizer's name, styled like the Contact's phone. When the contact record has no phone number, no phone row is shown.
- **S3-R8 (net-new):** The Authorizer cannot be changed once the work order is invoiced; from that point the row is locked. If the invoice is later voided or reversed, the work order returns to Complete and the Authorizer row is re-enabled (E2E-covered, @C44922).
- **S3-R9 (net-new):** A new authorizer is created on the customer's contacts page: the user creates or edits a contact and enables "Approves Work". The change reflects immediately: the contact becomes selectable in the work order's Authorizer list without any refresh or re-save of the work order.

*\* Context note: the Terms field holds the customer's payment terms (for example "Net 30").*

**Negative cases:**

- **S3-N1:** The Work Order field is hidden when **the trailing digits of the work order number equal the trailing digits of the document number**. The trailing digits of a number are the unbroken run of digits at its end: "4176" in "INV-4176", "24914" in "INV-S-24914", "5468" in "S2-5468". The two runs are compared as text and must match exactly: runs of different lengths never match, so "5468" against "05468" shows the field. A number with no trailing digit run never matches anything, so the field shows. Examples: document "INV-S2-5468" with work order "S2-5468" hides the field; document "INV-S-24914" with work order "24914" hides it; work order "24915" shows it. (Revised 2026-09-04: the rule previously compared the whole work order number against the document number's trailing digits, which can never match a prefixed production work order number such as "S2-5468", so the field would always have shown. Trailing against trailing is the built behaviour and was confirmed in planning. Stefan, P4.)
- **S3-N2:** The Customer PO field is hidden when it is empty.
- **S3-N3:** The Authorizer field is hidden when the work order has no Authorizer selected: no label, no empty value area. An empty Authorizer never prints on any document.
- **S3-N4:** When no Terms value is configured, the rendered text is exactly "Terms" with an empty value area — no colon, no placeholder.
- **S3-N5:** The Approval Code field is hidden when the work order has no approval code — no label, no empty value area.

*\* Context note: "Authorizer" is the work order's selected authorizer: a customer contact with "Approves Work" enabled, chosen in the work order's customer contact card (S3-R5, the only entry point). The value is the contact's full name. "Approves Work" is the existing checkbox on the contact record (the is\_authorizer flag). "Approval Code" is the approval code issued through the shop's integrated-billing setup. Net-new: today's document prints the approval code under the "Authorizer" label and the work order has no authorizer selection; this spec moves the code to its own "Approval Code" field and points Authorizer at the selected authorizer's name.*

---

### Story 4: Asset Section

**As a** customer, **I want** to see which asset the work was done on, **so that** I can confirm the document is for the right vehicle or unit.

**Design:** [Design Document](https://claude.ai/code/artifact/c88ee207-3197-4f54-8cb9-bac3deb84354)

**Jira:** [SV-9143](https://shopview.atlassian.net/browse/SV-9143)

**Prerequisites:**

- The document is an Estimate or Invoice.
- The work order has an asset attached.

**Requirements:**

- **S4-R1:** When the asset section is shown, it shows the asset name, labeled exactly "Asset". When the asset has a VIN or a serial number, the section also shows one value labeled exactly "VIN / Serial": the VIN when the asset has a VIN, otherwise the serial number.
- **S4-R2:** The asset section can also show fields labeled exactly "Unit", "Plate", "Mileage", and "Eng Hrs".

**Negative cases:**

- **S4-N1:** The Unit, Plate, Mileage, and Eng Hrs fields are each hidden when empty.
- **S4-N2:** When the section is shown but the asset has no VIN or serial number, the "VIN / Serial" field is hidden; the Asset name still shows. An asset whose VIN or serial is the literal word "Unknown", in any casing, counts as having none and the field is hidden the same way.

> *\* Context note: "Unknown" is what the screen shows in place of an empty VIN, so an asset card reading "VIN/Serial # Unknown" has no VIN at all and the document correctly omits the field. The rule is written on the value the field holds, whatever produced it: a VIN or serial reading "Unknown" is treated as no VIN and the field is hidden, whether that word is the screen's placeholder for an empty value or a literal string that reached the record some other way. The word must never print on a customer document. (Mudassir, SV-9686; reworded 2026-09-04 per Stefan, P12, who is right that "Unknown" is the vehicle card's display placeholder rather than stored data. The rule itself stands, because it is keyed to the value the field holds and so holds under either account, and it needs no normalising in the DTO.)*
- **S4-N3:** When the work order has no asset attached, the asset section is hidden.

*\* Context note: the label "Asset" is used instead of "Vehicle" so it reads correctly for non-vehicle assets as well.*

*\* Context note: net-new — today the section shows only on a service work order, or when the asset has a VIN or serial number; this spec shows it whenever the work order has an asset attached, part sales included.*

---

### Story 5: Work Section

**As a** customer, **I want** the work laid out clearly with its charges, **so that** I understand what I am paying for.

**Design:** [Design Document](https://claude.ai/code/artifact/c88ee207-3197-4f54-8cb9-bac3deb84354)

**Jira:** [SV-9144](https://shopview.atlassian.net/browse/SV-9144)

**Prerequisites:**

- The document is an Estimate or Invoice.

**Requirements:**

- **S5-R1:** The work is presented under a single section heading, reading exactly "Work Summary" on an Estimate and "Work Performed" on an Invoice.
- **S5-R2:** Each work line shows a line number. Line numbers are sequential with no gaps and are zero-padded to two digits (01, 02 … 10, 11). Lines 1–99 stay two digits even when the document has 100 or more lines; lines 100 and above show three digits (100, 101 …).
- **S5-R3:** Each work line shows a name.
- **S5-R4:** Each work line shows its description when a description is present.

  **S5-R4a (where the description sits):** The description renders on the same line as the job name, immediately after it, in smaller muted text. It is not given its own line below the name. A long description wraps with the name rather than being shortened or cut off.

> *\* Context note: shops use this field as a short reason for the job - the three most common entries in production are "QC", "Annual inspection" and "Leaking" - which is why the Design Document places it beside the name and not beneath it. The rule is written down because the build currently renders it on its own line, and because a reader seeing the muted text beside a title could reasonably mistake it for a separate tag field, which is exactly what happened. (Mudassir, SV-9684.)*
- **S5-R5:** Each work line shows its scope-of-work note when a scope-of-work note is present.
- **S5-R6:** A labor entry within a line is labeled exactly "Labor"; a parts entry is labeled exactly "Parts".
- **S5-R6a (a zero entry on an itemized line):** On a line whose charges are itemized, an entry whose amount is $0.00 is still listed and its amount reads exactly "$0.00". It is never left blank. This governs the entry row inside the "Labor" or "Parts" group; the line footer deliberately behaves the other way and hides its "Labor" or "Parts" figure when that figure is $0.00 (S5-R9). On an itemized line a blank amount means one thing only: the matching S5-R7 setting is off. Fixed-price lines are the stated exception and are governed by S5-R6b. (Milomir, SV-9646 item 7 and SV-9645.)
- **S5-R6b (fixed-price lines: what is blank):** A line can carry a fixed price instead of itemized charges, in one of two forms, and on such a line the money that is not itemized is left **blank** rather than printed as a figure. Blank on these lines means "not itemized", and S5-R6a does not apply to them. **A fixed line total** (one price for the whole line) blanks the rate and the amount on every labor entry and on every parts entry, and its line footer shows neither a "Labor" figure nor a "Parts" figure, so the footer's vertical divider is not shown and "Line total" stands alone (S5-R9). The labor hours and the part quantities on those entries are still shown: they are quantities, not prices, and the fixed price does not restate them. "Line total" always shows its amount, including when it reads $0.00. **A fixed labor price** (one price for the line's labor, with parts still itemized) blanks the labor hours and the labor rate but still prints the labor amount, and leaves every parts figure and both line-footer figures unchanged. (@chris ruling, 2026-09-04, on SV-9645 / SV-9646 item 7.)
- \* *Context note (S5-R6b): the reported case (SV-9645) was a fixed-line-total line that happened to be worth $0.00, which read as a zero-suppression bug. It is not: the same cells are blank on a fixed-line-total line worth $10,000. Blanking is keyed to the line being fixed-price, never to the value being zero. The one place this rule is net-new against the build is the labor hours cell, which the current template also blanks on a fixed line total; per this ruling the hours stay visible there.*
- **S5-R7:** Labor hours, labor rate, labor price, part quantity, and part price are each shown or hidden by their own independent document setting — under Administration → Invoice Details, labeled "Labor hours", "Labor rate", "Labor price", "Part quantity", "Part price", "Part number", and "Part description". The "Part number" and "Part description" settings hide the part number and the part description on each parts entry. The five price and quantity settings hide the per-entry figures and the matching line-footer figure: "Labor price" off also hides the footer's "Labor" figure, and "Part price" off also hides the footer's "Parts" figure. Two further settings in the same list, labeled exactly "Summarize labor total" and "Summarize parts total", control whether the line footer shows its per-line "Labor" and "Parts" figures at all. No setting collapses or hides the itemized labor and parts entries themselves. "Line total" and the financial summary (Story 7) always show their amounts. **These settings appear on two surfaces.** Administration → Invoice Details holds the shop-wide value, which is saved and applies to every document. The same list is also offered as a per-view override on the work order's Finance tab, seeded from the shop-wide value; flipping it there changes only the document being viewed and saves nothing. Both surfaces drive the same rules above, and a document is scored against whichever value is in effect for the view being looked at.
- **S5-R8:** A fee or discount that applies to a single labor or parts line is shown with that line; a discount is shown in parentheses and a fee is shown as a plain amount.
- **S5-R9:** Each work line shows a footer with figures labeled exactly "Labor", "Parts", and "Line total". The Labor and Parts figures are that line's own totals after its line-level fees and discounts; "Line total" is their sum. A "Labor" or "Parts" footer figure is shown when its summarize setting (S5-R7) is on; it is hidden when that setting is off, when its value is $0.00, or when its matching price setting (S5-R7) is off (a negative value is shown with its sign). The footer's vertical divider before "Line total" is shown only when at least one "Labor" or "Parts" figure is visible; when neither is, "Line total" stands alone with no divider. "Line total" is always shown, including when it reads $0.00.
- **S5-R10:** The "Line total" figure appears once per line.

**Negative cases:**

- **S5-N1:** When the document has no work lines, the work section shows its heading with no lines, and the "Summary" divider (S7-R1) still precedes the financial summary.

*\* Context note: parentheses on a discount are an accounting convention indicating a subtraction; they are required wording, not styling. The in-job section label is "Parts", consistent with S12-R9 and the "Parts" total (S5-R9, S7-R2).*

---

### Story 6: Declined Work

**As a** shop, **I want** to show work the customer declined for reference, **so that** there is a record of the work that was offered.

**Design:** [Design Document](https://claude.ai/code/artifact/c88ee207-3197-4f54-8cb9-bac3deb84354)

**Jira:** [SV-9145](https://shopview.atlassian.net/browse/SV-9145)

**Prerequisites:**

- The document is an Estimate or Invoice.
- The document has one or more declined work lines.
- The "Show declined work" option is enabled for the document.

**Requirements:**

- **S6-R1:** Declined work is shown in its own section headed exactly "Declined Work", separate from the main work section.
- **S6-R2:** Each declined line shows its name, and its description when a description is present. A declined line never shows a scope-of-work note (the technician's write-up); that note is internal and does not print on any customer document for declined work.
- **S6-R3:** Declined lines show no prices, no labor totals, and no parts totals, and are never included in any total on the document.
- **S6-R4:** Declined lines do not show a line number.
- **S6-R5:** No status pill is shown on declined lines; the "Declined Work" heading is the only indicator of declined status.
- **S6-R6 (where the option lives and what it scopes):** The "Show declined work" option is a **per-view toggle on the work order**, labeled exactly "Show declined work", sitting inline on the Finance tab beside the "Estimate/Invoice" toggle. It is not a shop-wide setting and it is not in the Administration → Invoice Details list. Flipping it changes only the document being viewed: nothing is saved, and the choice does not carry to another work order or to a later visit to the same one. The toggle renders only when the work order has at least one declined line, and it is not offered in history mode or on a work order whose status is in the restricted set. It controls only whether the Declined Work section renders. It never changes a figure on the document, because declined lines are excluded from every total in every case (S6-R3), and it has no effect on the Parts Sale document, which has no Declined Work section (S13-R2). (Milomir, SV-9646 item 5; @chris confirmed the toggle is unchanged native behaviour, so the spec records it rather than relocating it.)

**Negative cases:**

- **S6-N1:** When there are no declined lines, or the "Show declined work" option is off, the Declined Work section is not shown.

---

### Story 7: Financial Summary

**As a** customer, **I want** a clear breakdown of charges leading to what I owe, **so that** I can verify the total.

**Design:** [Design Document](https://claude.ai/code/artifact/c88ee207-3197-4f54-8cb9-bac3deb84354)

**Jira:** [SV-9146](https://shopview.atlassian.net/browse/SV-9146)

**Prerequisites:**

- The document is an Estimate or Invoice.

**Requirements:**

- **S7-R1:** A divider labeled exactly "Summary" precedes the financial summary.
- **S7-R2:** The summary shows a row labeled exactly "Labor" and a row labeled exactly "Parts". Each shows the gross amount — before any fees or discounts. A row labeled exactly "Shop supplies" is shown only when a shop-supplies charge applies.
- **S7-R3:** When the location's "Show % on Estimates and Invoices" setting is enabled and shop supplies are charged as a percentage of labor, the percentage is shown with the shop supplies amount; otherwise the amount is shown alone.
- **S7-R4:** Fees and discounts are grouped under a heading labeled exactly "Adjustments", which is a label with no amount of its own.
- **S7-R5:** Under the Adjustments heading, in this order: a rollup row labeled exactly "Labor" totaling all line-level labor fees and discounts, a rollup row labeled exactly "Parts" totaling all line-level parts fees and discounts, then each work-order-wide fee or discount as its own named row; the work-order-wide rows appear in the order they were added to the work order. The "Labor" and "Parts" rollup rows are each shown only when their total is not zero; a rollup row whose total is negative is shown in parentheses like a discount, and a positive rollup row is shown as a plain amount. A work-order-wide discount is shown in parentheses and a work-order-wide fee is shown as a plain amount. The summary intentionally contains two rows labeled "Labor" and two labeled "Parts" — the pair under the Adjustments heading is distinguished by its position under that heading, not by its label.
- **S7-R6:** Shop supplies are shown as their own charge row and are not placed under the Adjustments heading.
- **S7-R7:** The summary shows a row labeled exactly "Subtotal".
- **S7-R8:** The summary shows one tax row per applicable tax, each labeled with the tax name and its rate.
- **S7-R9:** The summary shows the grand total, labeled exactly "Total".
- **S7-R10:** Every row of the financial summary that contributes to the Subtotal is displayed; no contributing summary row is hidden.

**Negative cases:**

- **S7-N1:** The Adjustments heading is not shown when there is nothing to list under it — no work-order-wide fees or discounts and both rollup totals at zero.
- **S7-N2:** When no tax applies, no tax row is shown.

*\* Context note: the Labor and Parts summary rows are gross, so line-level fees and discounts are counted only once — in the "Labor" and "Parts" rollup rows under Adjustments. A line-level fee or discount still shows beside its own line in the work section (S5-R8); that inline row is informational and is not added again. The visible math is: gross Labor + gross Parts + Shop supplies + all Adjustments rows = Subtotal.*

---

### Story 8: Paid Banner, Payments, and Balance (Invoice)

**As a** customer, **I want** to see payments applied and the balance remaining, **so that** I know what is still owed.

**Design:** [Design Document](https://claude.ai/code/artifact/c88ee207-3197-4f54-8cb9-bac3deb84354)

**Jira:** [SV-9147](https://shopview.atlassian.net/browse/SV-9147)

**Prerequisites:**

- The document is an Invoice.

**Requirements:**

- **S8-R1:** The Invoice shows a heading labeled exactly "Payments".
- **S8-R2:** When one or more payments have been applied, each payment is shown as a row with a label and an amount. The label reads "{date} - {method}" (for example "Jul 30, 2026 - Cash"), where {date} is the payment's own date and the hyphen is a literal character; the amount is the applied amount when present, otherwise the payment amount. The rows list applied payments only; a payment that was fully reversed is no longer applied and does not appear. **The rows are one chronological list, ordered from oldest to newest, with payments, deposits and applied credits interleaved rather than grouped by kind.** The value ordered on is the payment's stored date and time. **The date is the one the person taking the payment chose; the time is the moment the payment was entered**, stamped in the location's timezone. Two consequences follow and both are intended: two payments carrying the same date sort by the time they were entered, so the earlier entry appears first; and a payment back-dated to an earlier day sorts to that earlier day, ahead of payments entered before it. **Rows sharing an identical date and time list payments first, then deposits, then applied credits.** That is the only case in which the kind of a row affects its position, and it exists because the sort is stable: rows the timestamp cannot separate keep the order the provider assembled them in. The order is therefore chronological by the payment's own date and time, which is not the same thing as the order the payments were entered. (Revised 2026-09-04: this replaces two earlier wordings, one ordering same-date payments by the order they were recorded and one grouping them by kind. Both were wrong. The date column holds a time, the entry time is stamped into it, and the payments provider sorts the merged list on it, so a single chronological list is what the document has always shown. Milomir, SV-9646 item 3 and his 2026-09-04 correction.)
- **S8-R3:** The method name is the shop-configured payment-method name when configured; otherwise the payment code, with each underscore replaced by a space (for example, credit\_card → "credit card"). The "SHOPPAY" code is shown as "Online".
- **S8-R4:** A deposit is shown as a payment row labeled "(Deposit) {date} - {method}", where {date} is the date the deposit was collected. An applied customer-account credit is shown as a payment row labeled "(Credit) {date} - {credit number}", where {credit number} is the full CM-prefixed number and {date} is the date the credit was applied.
- **S8-R5:** **The sub-line is shown beneath a deposit row only.** When a deposit's amount exceeds the amount applied to this invoice, a sub-line is shown beneath that deposit's row. A plain payment row never carries a sub-line, whatever the relationship between its amount and the amount applied to this invoice. When the excess has become a customer-account credit with a number, the sub-line reads exactly "of {full amount} — {excess} → Credit {credit number}"; otherwise it reads exactly "of {full amount} — {excess} will be credited". {full amount} is the deposit's full amount; {excess} is the full amount minus the amount applied to this invoice. Worked example: a $500.00 deposit with $350.00 applied reads "of $500.00 — $150.00 → Credit CM-1042". The em dash and the arrow are literal separator characters, not subtraction.
- \* *Context note (S8-R5): this restores the deposit-only gate that production has always had. An earlier decision on 2026-08-26 widened the sub-line to any payment applied for less than its full amount; that is reversed. The widening made the sub-line reachable on a payment that had been split, part applied to this invoice and part held back as a new deposit, and there it was wrong twice: it described the held-back money as going to a credit when it had become a deposit, and where that deposit also printed its own row the same money appeared on the document twice. Deposit-only removes both without needing new wording. A payment spread across more than one invoice therefore shows no sub-line, as it does today. (@chris ruling, 2026-09-04, on Stefan's B5.)*
- **S8-R6:** The Invoice shows a row labeled exactly "Balance" with the amount remaining to be paid. Balance equals the Total minus all applied payments (any method), applied deposits, and applied customer-account credits, and is floored at $0.00: an overpaid invoice shows "Balance" with "$0.00" — never a negative amount and never a hidden row.
- **S8-R7:** A payment row whose amount is $0.00 is not shown.
- **S8-R8: Paid banner.** Behavior already in production, restated unchanged — this spec adds no new banner work: the paid banner appears only on the Invoice PDF generated by the customer portal, which supplies the payment data at generation time. An Invoice PDF generated in the shop app never carries the banner, whether or not portal payments exist. On a portal-generated PDF, the banner is shown before all other invoice content, including the masthead (this ordering is a deliberate content rule — a binding exception to the otherwise non-binding section order; see "Visual design status"). The banner lists only portal-processed payments; shop-recorded payments appear only in the Payments section (S8-R2). The banner shows a fixed status pill: exactly "PAID IN FULL" when the invoice is fully paid (Section 6) at generation time, otherwise exactly "PARTIALLY PAID". The banner shows a title: when every payment listed in the banner was made as part of a batch payment, the title reads exactly "Payment Receipt (Batch) - Payments by ShopView"; in every other case — including when any listed payment is a single payment — it reads exactly "Payment Receipt - Payments by ShopView".
- **S8-R9:** Each banner payment shows fields labeled exactly: "Date / Time" (the date and time the payment was made), "Paid By" (the payer name captured at payment), "Method" (named by the S8-R3 rule), "Invoice Amount" (the portion of this payment applied to this invoice, before any fees), and "Total Charged" (the amount actually charged to the customer for this payment, including any convenience and late fees; labeled "Total Charged (Batch)" for a batch payment, where it covers the whole batch). "Convenience Fee" and "Late Fee" are each shown only when the portal charged one (a non-zero amount). "Remaining Balance" is the invoice balance immediately after this payment, shown only when that balance was greater than $0.00. In a batch, each payment carries a "Payment X of Y · Batch" marker.

**Negative cases:**

- **S8-N1:** When no payments, deposits, or customer-account credits have been applied, the Payments heading is shown with no rows, and the Balance equals the Total.
- **S8-N2:** When the invoice has no portal-processed payment, the paid banner is not shown — a shop-recorded payment (for example cash at the counter) never produces the banner, and an Invoice PDF generated in the shop app shows no banner in any case.

*\* Context note: the banner title is a fixed string that already exists in production; its presence does not change what the document is. Quick-Charge portal payments are not tied to an invoice and never appear on an invoice PDF. The payment "reference" (for example a check (cheque) number or a transaction number) is stored but is not shown on the customer document today; adding it would be net-new.*

---

### Story 9: Disclaimer, Signature, and Footer

**As a** shop, **I want** my standard disclaimer, a signature area, and my tax identifier to appear consistently, **so that** the document is complete.

**Design:** [Design Document](https://claude.ai/code/artifact/c88ee207-3197-4f54-8cb9-bac3deb84354)

**Jira:** [SV-9148](https://shopview.atlassian.net/browse/SV-9148)

**Prerequisites:**

- The disclaimer, the signature area, and the footer tax identifier apply to every document (Section 3).

**Requirements:**

- **S9-R1:** The document shows the shop's configured disclaimer text, with no heading above it, identical on every document that carries it.
- **S9-R2:** The document shows a signature area with three lines labeled exactly "Customer Signature", "Printed Name", and "Date", identical on every document that carries it.
- **S9-R3:** The signature area contains no authorization or acknowledgment sentence.
- **S9-R4:** The footer shows the shop's tax identifier exactly as the shop entered it, with no label added in front of it.

**Negative cases:**

- **S9-N1:** When the shop has no configured disclaimer, the disclaimer area is not shown.
- **S9-N2:** When the shop has no tax identifier configured, the footer tax identifier is not shown.

*\* Context note: the shop types its own label into the tax identifier field, for example "GST# 812694966 RT0001", so the document must not prepend a label.*

---

### Story 10: Estimate and Invoice Specifics

**As a** customer, **I want** the estimate and invoice to differ only as needed, **so that** each reads correctly for its purpose.

**Design:** [Design Document](https://claude.ai/code/artifact/c88ee207-3197-4f54-8cb9-bac3deb84354)

**Jira:** [SV-9149](https://shopview.atlassian.net/browse/SV-9149)

**Prerequisites:**

- The document is an Estimate or Invoice.

**Requirements:**

- **S10-R1:** The Estimate and Invoice carry the same content, differing only as Section 3 specifies (document label, dates, work-section heading, headline figure, and the presence of the Paid banner and the Payments and Balance sections on the Invoice).
- **S10-R2:** On an Estimate, the work-section heading reads "Work Summary", the headline figure is labeled "Estimated Total", and the masthead shows "Estimate date: {date}" **(a relabel, not a new element: production estimates today print "Invoice Date" and "Due date" on the estimate; this renames the issued date, drops the due-date line, and retires the quirk where a null due date rendered as today's date)**. No validity or expiry date is shown. (The signature area's "Date" line, S9-R2, is unaffected.)
- **S10-R3:** On an Invoice, the work-section heading reads "Work Performed", the headline figure is labeled "Balance", and the masthead shows "Invoice date: {date}" and "Due date: {date}" (on a fully paid Invoice, "Paid date: {date}" replaces "Due date: {date}" — S10-R4).
- **S10-R4:** A fully paid Invoice (Section 6) remains "Invoice: {number}", lists its payments (Story 8), and shows a Balance of $0.00. It is the customer's receipt; no separate receipt document exists and the document label is never renamed. **One masthead change occurs at full payment (net-new):** "Paid date: {date}" replaces "Due date: {date}". The date label is decided by the invoice's state at render time: fully paid shows "Paid date"; not fully paid shows "Due date". The paid date is the most recent {date} among the applied payment, deposit, and credit rows (S8-R2, S8-R4). If a later change (for example a payment reversal, a voided credit, or an invoice edit) makes the Balance greater than $0.00, the invoice is no longer fully paid and "Due date: {date}" returns. A paid date may be earlier than the invoice date (a deposit collected before invoicing); it is shown as-is.

**Negative cases:**

- **S10-N1:** An Invoice with no due date set shows "Invoice date: {date}" and no "Due date" line. The S10-R4 swap is unaffected: when such an invoice becomes fully paid, "Paid date: {date}" is shown.

---

### Story 11: Credit Invoice

**As a** customer receiving a credit, **I want** a clear credit document, **so that** I understand what was credited.

**Design:** [Design Document](https://claude.ai/code/artifact/c88ee207-3197-4f54-8cb9-bac3deb84354)

**Jira:** [SV-9150](https://shopview.atlassian.net/browse/SV-9150)

*\* Context note: the customer credit document is titled "Credit Invoice". It credits returned parts and money-only amounts (refunds, goodwill), and is backed by a customer-account credit. A single Credit Invoice may mix returned-part lines and money-only lines.*

**Prerequisites:**

- The document is a Credit Invoice.

**Requirements:**

- **S11-R1:** The masthead shows "Credit: {number}" (the credit number carries the "CM-" prefix, for example "Credit: CM-2202") and "Issue date: {date}". The masthead shows no money figure.
- **S11-R2:** The customer address block is labeled exactly "Credit To".
- **S11-R3:** A status table shows three columns labeled exactly "Credit Number", "Status", and "Invoice Number". Status shows the credit's current state: "Unapplied", "Partially applied", "Applied", "Refunded", or "Voided". Invoice Number shows the originating invoice's full document number (for example "INV-S-24914"); the whole column is hidden for an account-level credit with no origin invoice. The five statuses are the complete set of credit states; the S11-R6 table has a row for each.

*\* Context note: the credit number and the invoice number come from independent numbering sequences. They are not expected to match, and no rule compares them.*

*\* Context note: a credit that is both partially refunded and partially applied takes the "Partially applied" status — it remains one of the five states, not a new one — and its refund rows still list in the Payments section (S11-R6a).*

- **S11-R4:** The credited items appear in a table with columns labeled exactly "Description", "Quantity", "Rate", "Restocking Fee", and "Total". A returned part shows its actual quantity (as a negative number) and rate; a money-only credit line shows "--" for Quantity and Rate. The Restocking Fee column is always shown, reading "$0.00" when there is no fee. Totals are negative, formatted with a leading minus — for example "-$100.00". (Credit Invoice amounts use a leading minus, not the parentheses convention used for discounts, S5-R8; the two conventions are intentional and must not be unified.)
- **S11-R5:** For a returned part, the restocking fee reduces the credit: quantity -2 at rate $50.00 with a $10.00 restocking fee produces Total -$90.00. For a money-only line, Total is the credited amount. A money-only line's Description depends on the path that produced the memo, and there are three. **On a memo with no refund** it is the credit's reason when one was entered, otherwise the credit's memo text, otherwise "Refund". **On a memo carrying at least one refund** there is one line per consumption event, reading "{label} — {date}", with "— {refund description}" appended when that refund has a description; {label} is the refund's payment-method label, or "Refund" when it has none, and "Applied" for an apply-to-invoice event. **On a portal refund that carries per-invoice data** there is one "Invoice {number}" line per invoice plus a line for the Stripe fee. A parts-backed memo prints its per-part lines on every one of the three paths. (Stefan, P8.)
- **S11-R6:** The totals block shows rows labeled exactly: "Subtotal" (sum of the item totals, negative), "Tax" (a single row; negative when tax applies, "$0.00" when none), "Total Credit" (negative, the document's most important figure — visual emphasis follows the design prototype), "Payments", and "Balance". The Payments and Balance content follows the credit's status:

| Status | Payments section shows | Balance reads |
| --- | --- | --- |
| Unapplied | The "Payments" label with no rows | The full credit amount, positive — its open balance; nothing applied or refunded yet (net-new, S11-R6a) |
| Partially applied | The "Payments" label with no rows when the memo carries no refund. When it carries at least one refund, one row per consumption event (S11-R6b) | The open balance, positive: original minus amounts applied to invoices (net-new, S11-R6a) |
| Applied | The "Payments" label with no rows when the memo carries no refund. When it was fully consumed by refunds plus applies, one row per consumption event (S11-R6b) | $0.00 — fully applied, nothing remains (S11-R6a) |
| Refunded | One row per refund payment: "{date} - {method}" with the refunded amount, negative | $0.00 once fully consumed; the open balance, positive, until then (SV-7754 / S11-R6a) |
| Voided | The "Payments" label with no rows | $0.00 |

- **S11-R6a:** Balance reads the credit's **open balance** in every status: the original credit total minus amounts refunded minus amounts applied to invoices, shown positive, reading $0.00 once nothing remains or when the credit is voided. On memos with at least one active refund this is exactly the shipped SV-7754 rendering. On memos with no refund (Unapplied, Partially applied), production prints a flat $0.00 today, so showing the open balance there is **deliberate net-new**, decided with engineering on 2026-08-12: same provider aggregate (CreditMemoPdfDataProvider), no new calculation, and a credit document that answers how much credit remains in every status.
- **S11-R6b (when the Payments section lists rows, and what they read):** The Credit Invoice's Payments section lists rows only when the memo carries at least one active refund. Three statuses can reach that state: "Refunded", "Partially applied" (partly refunded and partly applied), and "Applied" where the memo was fully consumed by refunds plus applies. A memo with no refund shows the "Payments" label and no rows. **When rows do list, there is one row per consumption event, in date order.** A refund reads "{date} - {payment-method label}", or "{date} - Refund" when the refund has no method. An apply-to-invoice event reads "{date} - Applied". **Every row carries its amount with a leading minus**, refunds and applies alike. (Stefan, P8. This replaces the earlier statement that applications to invoices are never listed, which described only the no-refund memo.)
- **S11-R7:** The Credit Invoice shows the shop's configured disclaimer and the standard signature area (S9-R2).

*\* Context note: the Credit Invoice does not carry the asset, order, or work information that an invoice carries; Section 3 governs those exclusions. A dedicated free-standing "reason" note is not printed; the reason surfaces only as a money-only line's Description (S11-R5). A Voided credit still renders with its figures unchanged; "Voided" in the status table is the only indicator.*

---

### Story 12: Document Visual Standard

**As a** developer building these documents without a designer, **I want** the visual rules stated as verifiable requirements, **so that** the built documents match the Design Document without a design review.

**Design:** [Design Document](https://claude.ai/code/artifact/c88ee207-3197-4f54-8cb9-bac3deb84354)

**Jira:** [SV-9151](https://shopview.atlassian.net/browse/SV-9151)

**Prerequisites:**

- Applies to every document this spec covers (Estimate, Invoice, Credit Invoice), on screen and in PDF output.

**Requirements:**

- **S12-R1 (layout):** The documents implement the Design Document's structure exactly: masthead with the shop letterhead left, the shop logo center, and the document block right over a 2px ink rule; a bordered Addresses row; the asset band; the order reference chips; numbered work lines; the "Summary" break bar; a two-column tail with the disclaimer left and the totals right; the boxed headline figure; the three-line signature row; the single-line footer.
- **S12-R2 (palette, closed set):** The only colors on the light printed document are: ink #121926, body text #364152, muted text #697586, faint labels #9AA4B2, hairlines #E3E8EF, row dividers #EEF2F6, paid-banner surface #F8FAFC, accent #257CFF, negative #B42318, paper #FFFFFF. No color outside this set appears on the printed document; the print / B&W output adds only the inks S12-R5 lists, and the Design Document's demo chrome and dark-mode preview (S12-R7) are not part of any document.
- **S12-R3 (accent discipline):** The accent #257CFF appears only on the work line numbers and on the word "ShopView" in the footer. On the Parts Sale document, which has no numbered work lines, the accent appears only on the word "ShopView" in the footer. Nothing else on the document uses the accent.
- **S12-R4 (typography):** The typeface is Inter with a system sans-serif fallback, applied identically on screen and in PDF output, so the on-screen preview and the PDF wrap line for line. Weight 400 for body text; 600 and 700 for emphasis and totals; 700 for the in-job section labels (S12-R9); 800 for the shop name, the document label, the headline figure, and the line numbers. **The shop name is 18px and the document label is 24px**, matching the Design Document's own `.shop` and `.docid` rules. The document label is deliberately the larger of the two: the document's own number is its headline identifier. Like every size in this story these are absolute page sizes (S12-R9). (Corrected 2026-09-04: an earlier version of this rule gave the document label as 18px, which is 24px times 0.75 and was read off the branch rather than the Design Document. It was the fourth size carrying the rescale fingerprint. Milomir, SV-9694.) Uppercase micro-labels carry letterspacing per the Design Document.
- **S12-R5 (print ink floor):** In print and PDF output, no text renders lighter than #4B5565; text smaller than 10px renders no lighter than #364152; hairline rules render no lighter than #CDD5DF. (Weak printers drop lighter values.)

  **S12-R5a (how px is measured in the PDF):** Every size in this story is stated in CSS pixels. In the PDF a pixel renders as three quarters of a point, so a 16px size measures 12pt and an 11px size measures 8.25pt. Sizes are compared in pixels, so the "smaller than 10px" floor in S12-R5 is judged on the stated pixel value and not on the measured point value.

> *\* Context note: the three quarters is not a setting anyone chose and it is not a scale applied to the document. CSS defines 96 pixels to the inch and PDF uses 72 points to the inch, so any pixel value in a print stylesheet lands at three quarters of its number. Stating it once here keeps one set of sizes covering both the screen and the PDF. (Mudassir, SV-9685.)*
- **S12-R6 (monochrome-safe):** Every document is fully legible printed in grayscale. Color is never the only signal: credit amounts also carry the leading minus (S11-R4), and discounts also carry parentheses (S5-R8).
- **S12-R7 (prototype chrome exclusion):** The Design Document's control strips (the document and field toggles, the settings menu, the theme controls) are demo tooling. They are not part of any document. The white sheet is the document.
- **S12-R8 (work-section rules and dividers):** The work section opens with a 2px ink rule under the section label. Numbered jobs are separated by a 1px ink (#121926) rule. Both widths, and every other width and size in Story 12, are stated in **CSS pixels**, so on paper the 2px rule measures 1.5pt and the 1px rule measures 0.75pt (S12-R5a). No width or size in this story is denominated in points. **Every charge row inside a job is ruled off with a 1px #EEF2F6 divider below it, including the last row of a "Labor" or "Parts" group and a group that contains exactly one row.** The divider is a rule under each row, not a separator between rows: a job whose "Labor" group holds one row and whose "Parts" group holds one row shows two dividers, not zero. Two consequences are intended, not defects: the divider under the final "Labor" row sits between that row and the "Parts" label, and the divider under the final "Parts" row (the last group in the line) sits between that row and the line footer. The "Labor" and "Parts" sub-section labels carry no underline rule. When a line has fee or discount adjustment rows, the divider is suppressed on the charge row directly above an adjustment row and follows the line's **last adjustment row** instead, never sitting between the line and its adjustments, so the line and its adjustments read as one group. (Same rule on the Parts Sale body, S13-R3.)
- **S12-R9 (section-label hierarchy):** Section labels are bold uppercase micro-labels in three fixed treatments: the document section label ("Work Summary" / "Work Performed" / "Parts") at 11px weight 700 in muted ink #697586; "Scope of work" at 10px weight 700 in body ink #364152; the in-job "Labor" and "Parts" labels at 10.5px weight 700 in full ink #121926. All three sit visually below the 16px weight-700 job titles. Letterspacing per the Design Document. **The sizes in this rule are absolute page sizes, not sizes relative to the Design Document's canvas.** The Design Document was drawn on a 960px sheet and the printed content box is narrower, but 16px means 16px on the printed page, and no global scale factor is applied to the document's type. Fit is solved by layout: margins, column widths, wrapping, and the page-break rules in S12-R10. It is never solved by rescaling the type. If a specific element cannot fit at its stated size, that element is raised as its own defect and ruled on by name rather than rescaled. (Milomir, SV-9694.)
- **S12-R10 (page breaks):** Long documents paginate using standard, globally accepted page-break behavior, not custom pagination. Every page after the first opens with a single identification line: the shop location's name on the left and the document number on the right (for example "Heavy Duty - 9919" and "Invoice: INV-S2-4802"). The full masthead does not repeat on later pages. The totals block is not split across a page break. A work line and its own footer stay together on the same page. The signature row does not land alone on a final page, and no single row is orphaned by itself on a page.
- **S12-R11 (viewport):** On screen the document fits within the viewport with no content clipped. Any element wider than the viewport (for example a wide table) scrolls horizontally within its own container rather than clipping or forcing the whole page to scroll sideways.
- **S12-R12 (what the Design Document binds, and what it does not):** The Design Document binds the document's **appearance**: its sizes, weights, inks, spacing, order, and the treatment of every element. **It does not bind where a line happens to break.** The design sheet holds about 876px of content and the printed page about 634px, so at the absolute type sizes S12-R9 requires, the same text wraps at a different point on paper than it does in the mock. That difference is expected and is not a defect. A wrap becomes a defect only when it produces a real fault: a value clipped or cut off, a figure pushed out of its column, a row orphaned on a page, or a work line separated from its own footer (S12-R10). Pagination follows the same rule: the number of pages and the point at which a page turns are consequences of the real page width, not properties the mock fixes. (@chris ruling, 2026-09-04, on Milomir's canvas-width question.)
- **S12-R13 (a stated deviation: masthead letterspacing):** The Design Document sets `letter-spacing: -0.01em` on the shop name and the document label. The documents deliberately omit it on those two elements. WeasyPrint under-measures the intrinsic width of a letterspaced line, so the masthead block was sized narrower than the text it then painted and the shop name broke onto a second line with most of the masthead standing empty. At 18px the declaration is worth about 0.18px per character, so its absence is not visible. This is the one place a Story 12 element deliberately departs from the Design Document, and it is written down here rather than left in a code comment. (Milomir, SV-9694.)

**Negative cases:**

- **S12-N1:** The PDF output carries no drop shadow and no rounded sheet corners; those are screen-prototype presentation only.

---

### Story 13: Parts Sale Estimate and Invoice

**As a** customer buying parts without service work, **I want** the parts sale estimate and invoice to look like the shop's other documents, **so that** every document I receive reads the same way.

**Design:** [Design Document](https://claude.ai/code/artifact/c88ee207-3197-4f54-8cb9-bac3deb84354) (the Parts Sale Estimate / Parts Sale Invoice views and the Authorizer Entry (Parts Sale) page)

**Jira:** [SV-9195](https://shopview.atlassian.net/browse/SV-9195)

**Prerequisites:**

- The document is a Parts Sale Estimate or a Parts Sale Invoice.

**Requirements:**

- **S13-R1:** The Parts Sale Estimate behaves as the Estimate, and the Parts Sale Invoice as the Invoice, throughout this spec — masthead and date labels (Stories 1 and 10, including "Estimate date" and the Due/Paid date swap), addresses and Remit Payment To (Story 2), asset section (Story 4), financial summary (Story 7), payments and Balance (Story 8), paid banner rule, disclaimer and signature (Story 9), and visual standard (Story 12) — except as this story states.
- **S13-R2:** The body is a single section headed "Parts": flat part lines showing part number, description, quantity, rate, and amount. No job blocks, no "Scope of work", no Labor section, and no Declined Work section exist on a parts sale document.
- **S13-R3:** Line-level fees and discounts render exactly as on the Invoice: indented under their part line, with the row divider suppressed on the part row directly above an adjustment row and following the part's last adjustment row rather than sitting between the part and its adjustments. Every other part row on the Parts Sale body is ruled off with a 1px #EEF2F6 divider below it, including the last row of the "Parts" group (S12-R8).
- **S13-R4:** The document number keeps the parts-sale numbering through the existing document numbering (for example "Estimate: EST-P2-1088", "Invoice: INV-P2-1088").
- **S13-R5:** Reference fields: Work Order and Approval Code are not shown. Customer PO and Terms are unchanged. Authorizer follows S13-R6.
- **S13-R6 (net-new):** The parts sale receives the work-order Authorizer treatment: an Authorizer field on the parts sale record, offering the customer's "Approves Work" contacts, empty by default, filled by the user, locked once the parts sale is invoiced, and printed in the document's Authorizer reference field when set. When nothing is selected the row reads exactly "None" as a muted placeholder, and the list's clearing option reads "No authorizer", both exactly as on the work order (S3-R6). If that invoice is voided or reversed, the Authorizer becomes editable again (mirrors S3-R8). **The Authorizer row is available to a user who can edit the record in front of them:** a user holding parts-sale edit rights can set it on a parts sale without also holding work-order edit rights. (Stefan, P2 and P11.)
- **S13-R7:** The financial summary shows no Labor row and no Shop supplies row; the Parts row, the adjustment rows, Subtotal, Tax, Total, Payments, and Balance are identical to the Invoice.

**Negative cases:**

- **S13-N1:** Batch invoices and imported invoices are not part of this story or this spec; they keep their current templates until [SV-9193](https://shopview.atlassian.net/browse/SV-9193) ships (§2, Out of scope).
- *\* Context note (S13-N1): the batch and imported templates share the document data provider, so two org-wide changes reach them before SV-9193 restyles them — they lose the shop's own-address remit-to fallback (S2-R2) and a null due date now renders blank instead of today's date. Both are known, accepted consequences until SV-9193 ships.*

## 8. Change Log

| Date | Reporter | Change | Notes |
| --- | --- | --- | --- |
| 2026-09-04 | @chris / @claude | **S8-R5 reverted to the deposit-only gate production has always had**, closing Stefan's B5. The excess sub-line is shown beneath a deposit row only; a plain payment row never carries one. This reverses the 2026-08-26 widening, which had extended the sub-line to any payment applied for less than its full amount. That widening is what made B5 reachable: on a payment split between this invoice and a new deposit, the sub-line described the held-back money as heading to a credit when it had become a deposit, and where the deposit also printed its own row the same money read twice. Reverting removes both faults and needs no new wording, no arithmetic change and no zero guard. The rule's reference to a payment spread across several invoices is dropped with it. | Stefan's B5, answered 2026-09-04; @chris ruling. Verified against origin/develop: api/templates/invoices/invoice.html.twig gates the sub-line on `payment.is_deposit` plus `applied_amount < amount`, so live has never rendered it under a plain payment and the wrong {full amount} at WorkOrderDetailsFetcher.php:717-720 was never reachable there. The branch dropped the is\_deposit gate, which is what surfaced it. B5's other two recommendations (deduct the new-deposit slice from the amount, suppress on a sibling deposit or credit row) fall away with the gate restored, and the unit test B5 asked for covering the mixed-row case is no longer owed. B1, B4 and B7 remain open on Stefan's list and are not addressed here. |
| 2026-09-04 | @chris / @claude | Closed out the SV-9694 and SV-9646 review threads with the answers Milomir and Stefan supplied. **S12-R4:** the document label is **24px**, not 18px. The earlier value was 24 times 0.75, read off the branch rather than the Design Document's own `.docid` rule, and was the fourth size carrying the rescale fingerprint; the shop name stays 18px and the two are deliberately different. **S8-R2:** rows sharing an identical date and time list payments, then deposits, then applied credits, which is the only case where a row's kind affects its position. **S11-R5:** the money-only Description is now given per path, all three of them. **S11-R6 and new S11-R6b:** the Payments section lists rows whenever the memo carries an active refund, one row per consumption event in date order, refunds reading the payment-method label or "Refund" and applies reading "Applied", every row carrying a leading minus. This replaces the statement that applications are never listed, which only ever described a memo with no refund. **New S12-R12:** the Design Document binds appearance but not where a line breaks; a wrap is a defect only when it clips, orphans or separates something. **New S12-R13:** the masthead's missing letterspacing is recorded as the one deliberate deviation from the design. | Milomir SV-9694 comment 76044 and Stefan's review answers, 2026-09-04; @chris calls. Verified independently: the Design Document's `.shop` is 18px and its `.docid` is 24px, and `.docid` renders the document number, which is what the branch's `.doc-label` renders. Payment order confirmed at four `usort` sites on `payment_date` in WorkOrderDetailsFetcher with a stable PHP 8 sort, so only identical timestamps fall through to assembly order. P8 answered from CreditMemoPdfDataProvider (`buildRefundDrivenDto`, `buildConsumptionEvents`, `buildConsumptionAuditItem`, `buildInvoiceBreakdownItems`) and the credit-invoice template's negative amount. Not amended and still open: B5's split-payment wording, which neither answer set covered. The 375px phone preview is confirmed as a zoom consequence, not a defect: InvoiceDisplay pins the sheet at 718px and zooms to about 0.51 on a 375px viewport, which renders the restored 14px body near 7.1px and the 10px micro-labels near 5.1px. Nothing clips, so S12-R11 holds; whether a 5.1px label is acceptable on a phone is a product question and belongs on its own ticket. |
| 2026-09-04 | @chris / @claude | Answered Milomir's four follow-up questions. **S8-R2 rewritten again, and this time to what ships:** the Payments rows are one chronological list oldest to newest with payments, deposits and applied credits interleaved, ordered on the payment's stored date and time, where the date is the one the person taking the payment chose and the time is the moment it was entered. The two intended consequences are stated: same-date payments sort by entry time, and a back-dated payment sorts to its earlier day. Both previous wordings were wrong, one claiming entry time is not stored and one grouping the rows by kind. **S12-R8** now says the rule widths, and every size in Story 12, are stated in CSS pixels, so the 2px rule measures 1.5pt on paper and nothing in the story is denominated in points. **S12-R4** now states that the shop name and the document label are both 18px, a size the spec had never given, which is why the shop name drifted to 13.5px on the branch. | Milomir's four questions, 2026-09-04; @chris calls. Verified in code before amending, having twice taken an account of this rule without checking: customer\_payment.payment\_date is DATETIME NOT NULL (Version20230821131546); TransactionsPaymentDialog.vue sends formatDateLocalToUTC(date, true), which stamps the current wall-clock time in the location's timezone onto the chosen date; WorkOrderDetailsFetcher usorts the merged payment and deposit rows ascending on payment\_date in both merge paths, and the repositories order by it too. The back-dating consequence follows from the date being user-chosen while only the time is stamped, and is stated because QA would otherwise read it as a sort defect. The shop-name size was confirmed against the Design Document's own .shop rule at 18px, with the branch value of 13.5px being exactly 18 times 0.75, the same fingerprint as the sizes already restored under SV-9694; its 800-weight twin, the document label, was already correct at 18px. No spec change was needed for the rule-width question, which S12-R5a already answered; the sentence added to S12-R8 only makes it explicit. |
| 2026-09-04 | @chris / @claude | Stefan's twelve-item spec review triaged; this row covers the six items that resolve in the spec. **S3-R6 and S13-R6 (P2):** record that an unselected Authorizer row reads "None" as a muted placeholder per the Design Document, and separate that string from the list's "No authorizer" clearing option; an empty Authorizer still prints nothing (S3-N3, unchanged). **S13-R6 (P11):** the Authorizer row is available to a user who can edit the record in front of them, so parts-sale edit rights are enough on a parts sale; the build gates it on work-order edit rights on both front and back end, which makes S13-R6 unusable for a parts-sale-only editor, and that gate is being fixed rather than documented. **S3-N1 (P4):** the Work Order field comparison is now trailing digits against trailing digits, with exact text matching and the no-digit-run and unequal-length cases stated; the previous wording compared the whole work order number and could never match a prefixed production number. **S3-R4 (P5):** confirmed as the per-job integrated-billing approval code and never the customer's account number. **New G-R3 (P7):** issued documents render the values captured at issue time and never current values, so a location rename does not alter documents already issued; intended behaviour, never a defect. **S4-N2 context note (P12):** reworded to stop asserting that imported records store the literal word "Unknown"; the rule is keyed to the value the field holds, so it holds either way and needs no DTO normalising. **Section 7 preamble:** the two standing principles written down, that the Design Document is the source of visual truth and that behaviour is existing production behaviour unless a rule marks itself net-new. | Stefan spec review, 2026-09-04; @chris calls. Verified before amending: the Design Document renders the empty Authorizer as a muted "None" and separately carries a "No authorizer" clearing option, so P2 was a silence rather than a conflict, and S3-N3 already covered the document case. Four of the twelve items needed no spec change because they were ruled earlier the same day (P1 type sizes, absolute per S12-R9 and already restored on the branch at 80fe3028460; P3 the divider, S12-R8; P6 fixed-price blanking, S5-R6b; P9 the payment tiebreak, S8-R2), and two of the review's recommendations would have reversed those rulings. **P8 is deliberately not in this pass:** the S11-R6 status table states that applications to invoices are not listed, and the review reports that refund-driven credit memos do list Applied rows, but an airtight amendment needs the exact row label, the status it appears under and the sign of the amount, plus the two S11-R5 description source chains named per path; those were asked for rather than guessed. P10 (performance) is pre-existing develop behaviour, verified identical on origin/develop, and carries no spec change. |
| 2026-09-04 | @chris / @claude | Answered Milomir's three follow-ups on the 2026-09-04 rulings, all resolved by recording native behaviour rather than changing it. **S6-R6 rewritten:** "Show declined work" is a per-view toggle on the work order's Finance tab beside the Estimate/Invoice toggle, saving nothing and carrying nowhere, shown only when the work order has a declined line; it is not a shop-wide Administration setting, which is what the first draft of S6-R6 wrongly specced. **S5-R6a narrowed and new S5-R6b added:** the $0.00-reads-$0.00 rule now applies only to itemized lines; fixed-price lines blank the money that is not itemized, with a fixed line total blanking the rate and amount on every labor and parts entry and showing no line-footer Labor or Parts figure (so no footer divider) while keeping labor hours and part quantities visible, and a fixed labor price blanking labor hours and rate but still printing the labor amount. This closes SV-9645 as working as designed apart from one net-new cell (labor hours on a fixed line total, which the build currently blanks and this rule now shows). **S8-R2 revised:** the "then by the order the payments were recorded" tiebreak is removed as unbuildable and replaced with the built grouping, plain payments then deposits then applied credits. **S5-R7 extended:** records that the nine settings exist on two surfaces, the saved shop-wide value in Administration and an unsaved per-view override on the Finance tab. | Milomir Slack follow-ups, 2026-09-04; @chris calls. Verified against origin/develop (native, pre-refresh): app/src/components/ts/billing/InvoiceContentSettings.vue carries the inline "Show declined work" toggle gated on workOrderHasDeclinedLines, and app/src/components/ts/administration/InvoiceDetails.vue holds ten saved org settings (the nine in S5-R7 plus Disclaimer) with no declined key; app/src/components/ts/billing/Invoice.vue carries the same nine as an unsaved per-view list. api/templates/invoices/invoice.html.twig gates the labor and parts money cells and both line-footer figures on line\_type not being fixed\_line\_total, and gates labor hours and labor rate on it not being fixed\_labour\_price either, which is where the two fixed forms in S5-R6b come from. Payment order: the template iterates the provider array unsorted, so the grouping wording is Milomir's account of the provider and should be confirmed against the sort site before QA treats it as exact. |
| 2026-09-04 | @chris / @claude | Answered [SV-9694](https://shopview.atlassian.net/browse/SV-9694) and [SV-9646](https://shopview.atlassian.net/browse/SV-9646). S12-R9 sizes ruled **absolute page sizes**, not sizes relative to the Design Document's 960px canvas: the uniform 0.75 rescale on the branch is reverted, and fit is solved by layout rather than by shrinking type. Four SV-9646 items were already answered in the spec and needed no change (credit both part-refunded and part-applied takes "Partially applied" with refund rows still listing, S11-R3; same-date payments tiebreak by the order recorded, S8-R2; Parts Sale lines carry no line numbers, S13-R2 and S12-R3; the Remit Payment To block hides when no payee is configured, S2-R2). Three gaps closed: S2-R2 now states that a location remitting to itself is not a configured payee so the block hides; new S6-R6 places the "Show declined work" option under Administration → Invoice Details, per shop, scoping the Declined Work section only; new G-R2 sets the PDF filename to the document number plus ".pdf"; new S5-R6a keeps a $0.00 entry listed reading "$0.00" while the footer still hides a $0.00 figure per S5-R9. | SV-9694 and SV-9646 rulings; @chris calls. On S12-R9: the 0.75 rescale put the section labels at 5.6pt to 6.2pt on a printed repair document, and S12-R5's "smaller than 10px" floor only reads correctly if the stated pixel values are the real page sizes. Accepted cost of reverting the rescale: [SV-9671](https://shopview.atlassian.net/browse/SV-9671) (work lines splitting from their footers) needs revisiting and masthead shop-name wrapping may reopen; both are layout work, not a reason to rescale. Supersedes SV-9692. |
| 2026-09-04 | @chris / @claude | S12-R8's "charge rows are separated by row dividers" was ambiguous between separators-between-rows and every-row-ruled-off; it now states the binding reading explicitly. Every charge row carries a #EEF2F6 divider below it, including the last row of a group and a group of exactly one row, and the divider under the final "Labor" row (before the "Parts" label) and under the final "Parts" row (before the line footer) are intended, not defects. Adjustment handling restated as the suppression rule it actually is: the divider is suppressed on the charge row directly above an adjustment row and follows the last adjustment row. S13-R3 aligned to the same wording. This closes SV-9598 as working as designed; no built behavior changes. | SV-9598 ruling; @chris call. The Design Document is binding on appearance (S12-R1) and it rules off every charge row: its fixDividers() routine sets a 1px #EEF2F6 bottom border on every visible charge row in a Labor or Parts group and suppresses it only when the next visible row is an adjustment row, and its .crow style carries that border with no last-row exception. The tr:last-child rule in invoices/invoice.html.twig and ChargeRowDividerGuardTest.php stay as built. |
| 2026-09-03 | @chris / @claude | New S5-R4a: the line description renders inline immediately after the job name in smaller muted text, not on its own line, and a long one wraps rather than being cut. This closes SV-9684, where the muted text beside a job title was reported as an undefined tag; it is the description, and the gap was that its placement was never written down. The build currently renders it below the name, so a build defect was raised to match the binding Design Document. | Mudassir SV-9684; @chris call. |
| 2026-09-03 | @chris / @claude | Answered Mudassir's five spec-gap findings. S4-N2 now names a literal "Unknown" VIN or serial as counting the same as none (SV-9686). S2-R2 gains the precedence it was missing: integrated billing wins when the customer has an integrated-billing account number, and the location's own remit-to applies to everyone else, which records existing behaviour rather than changing it (SV-9689). New S12-R5a states once that a CSS pixel renders as three quarters of a point in the PDF, so the S12-R5 floor is judged on pixels (SV-9685). SV-9687 (invoice preview on an un-invoiced work order) closed as out of scope: both components are unchanged versus develop, so it is pre-existing production behaviour. SV-9684 (the tag beside the job title) stays open pending a screenshot; the element IS in the binding Design Document but was never written into Story 5. | Mudassir spec-gap review, 2026-09-03; @chris calls. |
| 2026-08-28 | @chris / @claude | Answered Milomir's two build questions. S12-R10: the page-break rule no longer repeats the full masthead on later pages — every page after the first opens with a single identification line (shop name left, document number right), which keeps page counts unchanged; the footer already carries the document number and the page count. S12-R4: Inter now applies identically on screen and in PDF output, so the preview and the PDF wrap line for line — this reverses the 2026-08-26 scoping to PDF only, because the sanitiser constraint behind it no longer holds. Story 12's prerequisite ("on screen and in PDF output") needed no change. | Milomir build questions, 2026-08-28; @chris calls. |
| 2026-08-26 | @chris / @claude | Answered Milomir's Build feedback (Phases 1–3): S12-R9 and S12-R4 in-job section-label weight lowered from 750 to 700 (WeasyPrint drops the 750 value to 400); S5-R7 extended to nine Invoice Details settings (added "Part number" and "Part description"); S3-R8 gains the void/reversal unlock of the Authorizer row; S12-R4 scopes Inter to PDF output (on-screen preview uses the system-sans fallback); S13-N1 context note added for the batch/imported remit-to and null-due-date consequences. S2-R2 already covered the per-location remit-to (no change). Also widened S8-R5: the excess sub-line is not deposit-gated — it renders whenever a payment or deposit is applied for less than its full amount (Milomir Phase-4 question; @chris call). | Milomir build feedback; @chris calls. |
| 2026-08-12 | @chris / @claude | Masthead monetary figure removed on every document (CEO direction): the headline figure now appears only as the boxed figure at the end of the totals block. S1-R6 rewritten; Section 3 overview bullet, Section 3 matrix (Masthead and Headline figure rows), and the Masthead / Headline figure terminology entries updated. Labels and values unchanged ("Estimated Total" / "Balance"). | Matches the updated design prototype (2026-08-12). |
| 2026-08-11 | @chris / @claude | Asset section now shows whenever the work order has an asset attached — part sales treated the same as service work orders (drops the service-order / VIN-or-serial gate; net-new vs production). Story 4 prerequisite updated, old S4-N1 removed (remaining negative cases renumbered), Section 3 matrix and the Service work order terminology entry updated. | Per Sasha's review comments (2026-08-11). |
| 2026-08-11 | @chris / @claude | Section 3 matrix: dropped the Status pill row (the no-masthead-pill rule stays in Key Decisions and S1-R5); renamed the Financial summary row to state that the Credit Invoice's own totals block is listed separately. | Per Sasha's review comments (2026-08-11), round 2. |
| 2026-08-11 | @chris / @claude | Added G-R1 (Section 7): the exact date format for every {date} on every document ("Jan 5, 2026", PHP "M j, Y"; fixed, no setting, identical for US and Canadian shops), with the Paid banner's portal-supplied "Date / Time" as the stated exception ("Jan 5, 2026 - 2:41 PM MST"). Verified against the production code. | Per Sasha's review comments (2026-08-11), round 2. |
| 2026-08-11 | @chris / @claude | Added Story 12 (Document Visual Standard): the Design Document is now the binding visual reference (no separate designer on this build), with verifiable rules for layout, the closed palette set, accent discipline, typography, the print ink floor, grayscale legibility, and the prototype-chrome exclusion. Rewrote the Visual design status section (spec owns content and wording, Design Document owns appearance) and narrowed the "Final visual polish" out-of-scope bullet to pixel-level polish within the Story 12 token set. | Chris and Claude are the designers of record; the spec and artifact hand off to a developer directly. |
| 2026-08-11 | @chris / @claude | Declined work: a declined line never shows a scope-of-work note (the technician's write-up) – S6-R2 extended with the explicit exclusion; the Story 6 user story reworded from "what was recommended" to "the work that was offered". The Design Document's declined-line Recommendation block was removed to match. | Chris direction (2026-08-11). |
| 2026-08-11 | @chris / @claude | Authorizer rework: the Authorizer is now selected in the work order's customer contact card, below Contact and Phone (new S3-R5, the only entry point); the list offers only contacts with "Approves Work" enabled (the existing is\_authorizer flag); not required, defaults to empty, with a "No authorizer" clear option (S3-R6); the selected authorizer's phone shows below the name when entered (S3-R7); locked once the work order is invoiced (S3-R8); new authorizers are built on the customer contacts page and become selectable immediately (S3-R9). S3-N3 reversed from never-empty to hide-when-empty, S3-R3 and the context note repointed, and the Section 5 optional-fields decision updated. | Chris direction (2026-08-11). Matches the Design Document's Authorizer Entry page. |
| 2026-08-11 | @chris / @claude | S5-R7 and S5-R9 amended: the "Labor price" and "Part price" settings now also hide the matching line-footer figure; "Line total" and the financial summary always show their amounts. | Matches the Design Document's toggle behavior. |
| 2026-08-11 | @chris / @claude | Linked every story to Jira: stories SV-9140 through SV-9151 created under epic SV-8218 (one per spec story, S1 through S12); all twelve "Jira: TBD" placeholders replaced with the ticket links. | Epic SV-8218 description filled (goal, key points, spec + design links, ordered story list). |
| 2026-08-11 | @chris / @claude | S5-R7 and S5-R9 aligned to production's document settings: added the "Summarize labor total" and "Summarize parts total" settings, which control the line footer's per-line Labor and Parts figures (no setting collapses the itemized entries); the footer's vertical divider before "Line total" drops when no Labor or Parts figure is visible. Existing production behavior, not net-new. | Matches the Design Document's cog toggles. |
| 2026-08-12 | @chris / @claude | An Estimate now shows a masthead date: "Estimate date: {date}" (net-new). Updated S1-R7, S10-R2, and the §3 composition table, which previously stated an Estimate shows no masthead date. A validity/expiry date was considered and deliberately left out. | Matches the Design Document update of the same day. |
| 2026-08-12 | @chris / @claude | Milan's tech-planning review (SV-8218) folded in: S11-R6 Balance now preserves the SV-7754 remaining-available-credit rendering (new S11-R6a; status-table Balance column rewritten, one engineering confirmation noted on invoice applications); S2-R2 extended to both production remit-to mechanisms (integrated billing + location remit-to setting) with the self-address fallback dropped as net-new; S10-R2's net-new marker corrected to a relabel (production estimates print a mislabeled "Invoice Date" / "Due date" today, including the null-due-date-renders-today quirk this change retires). | Milan footer comment, 2026-08-12. |
| 2026-08-12 | @chris / @claude | Parts Sale Estimate and Parts Sale Invoice brought into scope as Story 13: full document chrome shared with the Estimate/Invoice, body swapped to a flat Parts section, parts-prefix numbering, Work Order and Approval Code fields dropped, and the work-order Authorizer treatment extended to parts sales (net-new, S13-R6). Batch and imported invoices explicitly deferred to a follow-up ticket (§2 Out of scope, S13-N1). Design Document updated with the Parts Sale views and the Authorizer Entry (Parts Sale) page. | Chris call after design review, 2026-08-12. |
| 2026-08-12 | @claude | Follow-up ticket for the batch and imported invoice templates created and linked: [SV-9193](https://shopview.atlassian.net/browse/SV-9193) (Story under SV-8218, spec-first with the shared-partials guardrail). | Closes the "follow-up ticket to come" loose end. |
| 2026-08-12 | @chris / @claude | Credit Invoice Balance finalized with engineering: Balance reads the open balance (original minus refunded minus applied) in every status, $0.00 once consumed or voided (S11-R6a and the status table rewritten; the engineering confirmation clause resolved). Showing the open balance on no-refund memos is deliberate net-new; production prints $0.00 there today. Story 13 Jira placeholder pointed at SV-9195. | Milan reply, 2026-08-12; option (b) chosen. |
| 2026-08-12 | @chris / @claude | Visual standard locked to the reviewed Design Document (CEO pass): new S12-R8 (work-section rules: 2px ink opener, 1px ink between jobs, #EEF2F6 row dividers, no underline under Labor/Parts labels, divider follows a line's last adjustment row) and S12-R9 (three-tier section-label hierarchy with exact sizes/weights/inks); S12-R2 palette gains the #EEF2F6 row-divider grey and S12-R4 gains the 750 label weight so both closed sets stay accurate. | Design review with CEO, 2026-08-12. |
| 2026-08-25 | @chris / @claude | Milomir's Design Document vs. spec conformance audit folded in. S5-R6 parts-entry label corrected from "Part" to "Parts" to match the binding Design Document and S12-R9 (the singular-entry rationale was moot – the design has no per-entry label); its context note revised. S12-R2 palette adds the paid-banner surface #F8FAFC and scopes the closed set to the light printed document (print / B&W governed by S12-R5; the Design Document's demo chrome and dark-mode preview excluded per S12-R7). Design Document brought into conformance on the content items: masthead date labels, Credit Invoice Balance ($225.92 open balance, S11-R6a), full Credit disclaimer (S9-R1), work-order fixture reconciliation, and removal of the proof-of-concept preamble. | Milomir conformance audit, 2026-08-25. |
| 2026-08-27 | @chris / @claude | Spec-review decisions folded in (Mudassir QA review, SV-8218): Terminology "Balance" for the Credit Invoice rewritten to the open-balance definition (S11-R6a); Remit Payment To corrected to two mechanisms in Key Decisions, Terminology, and the Story 2 context note (S2-R2); S13-R6 gains the void/reversal Authorizer unlock (mirrors S3-R8); S8-R2 payment ordering gains the "then by the order recorded" tiebreak; S12-R3 accent scope clarified for the un-numbered Parts Sale document; new S12-R10 (standard page-break behavior) and S12-R11 (small-viewport fit); context note added for the partially-refunded-and-partially-applied credit case (status = Partially applied, refund rows still list). | Mudassir spec review, 2026-08-27. |
| 2026-08-27 | @chris / @claude | Trivial cleanup from the spec review (no rule change): S5-R7 prose "labor cost" aligned to the "Labor price" setting label; S2-R3 stale "two deliberate binding layout rules" framing removed (Story 12 binds the whole Design Document on appearance); the unused "Service work order" Terminology entry removed; the stale "POC badge" reference dropped from S12-R7. | Mudassir spec review (minors), 2026-08-27. |
