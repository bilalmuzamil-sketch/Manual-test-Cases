# Invoice UI Refresh — Requirements (ingested)

**Source:** Confluence page 755990532, **version 38** (last edited 2026-08-13), read 2026-08-21.
**Epic:** SV-8218 · **PO:** Chris Ward · **Tech plan:** built against v36 (2026-08-12) — v36→v38 delta reconciled at authoring start.
**Design:** Claude Design Document artifact c88ee207-3197-4f54-8cb9-bac3deb84354 (binding visual reference; static export held in intake-2026-08-21/sources/).

The complete spec body as ingested at v38 follows verbatim.

---

|  |  |
| --- | --- |
| **Epic** | [SV-8218](https://shopview.atlassian.net/browse/SV-8218) |
| **Owner** | Chris W. |
| **Status** | Ready to build |
| **Documents covered** | Estimate, Invoice (a fully paid Invoice serves as the receipt), Credit Invoice |
| **Design** | [Design Document](https://claude.ai/code/artifact/c88ee207-3197-4f54-8cb9-bac3deb84354) |

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

* One consistent content standard across the customer documents: the Estimate, the Invoice (including its paid state), the Credit Invoice, and the Parts Sale Estimate and Parts Sale Invoice (Story 13).
* The document type determines the type label, the candidate date labels, the work-section heading, the headline figure, and which sections can appear. Within the Invoice, paid state selects between "Due date" and "Paid date" (S10-R4), and data state shows or hides optional content (Section 5).
* The work breakdown, the financial summary, and the amounts owed are presented as clearly separated, consistently labeled sections.
* Each document carries a single headline figure as the boxed figure at the end of the totals block — never in the masthead (S1-R6). The Credit Invoice deliberately has no headline figure; its key figure, Total Credit, sits in the totals block (S11-R6).

**Payment Receipt**

* The receipt for an invoice **is the paid Invoice itself**: the same document, listing its payments, with a Balance of $0.00 and "Paid date: {date}" in place of "Due date: {date}" (S10-R4). The document label "Invoice: {number}" never changes — the date label is the only masthead change. This matches how the leading invoicing products behave.
* The **paid banner** appears only on the Invoice PDF the customer portal generates (Story 8); a PDF generated in the shop app never carries it. This is the behavior already in production; nothing portal-side changes in this spec.

**Out of scope**

* **How amounts are computed** — the calculation engine for totals, taxes, fees, and discounts. Where this spec states arithmetic (the Balance, credit item totals), it restates the display math already in production so QA can verify the visible numbers; it does not define new calculations.
* **Additional entry points for the Remit Payment To payee.** The payee comes from the shop's integrated-billing setup or from the location's own remit-to setting (S2-R2); when present it is displayed on the Estimate and Invoice (Section 3). No further entry points are added.
* **Batch invoices and imported invoices.** Separate templates, deferred to [SV-9193](https://shopview.atlassian.net/browse/SV-9193). Until that ships, a customer can receive a batch or imported invoice in the previous visual language while the documents in this spec carry the new one — a deliberate, temporary split.
* **The standalone portal Payment Receipt.** A separate receipt exists in the customer portal for portal-processed payments. It has a printable page and a shareable email, and covers single, batch, and Quick-Charge payments. It is out of spec, and its content is not specified by this spec.
* **Pixel-level polish.** Nudging spacing within the Story 12 token set may happen during build without a spec change. Changing the palette, the typography, the layout structure, or the visual hierarchy is a spec change and needs sign-off (Story 12).

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

_\* Context note: a fully paid Invoice is not a separate column — it is the same Invoice with its payments listed and a Balance of $0.00. "Terms" appears only on the Estimate and Invoice (Story 3)._

## 4. Jobs to be Done

> **When** I hand a customer an estimate or invoice, **I want** the document to show the most important number first and most prominently and to be easy to read, **so** the customer immediately understands what they are approving or paying.

> **When** I open any customer document, **I want** each one to contain the same information in the same places with the same wording, **so** I always know where to look.

**Goals**

* Define the information and wording required on each document.
* Present the documents consistently.
* Make the headline figure and the balance the easiest numbers to find.

## 5. Key Decisions

* **The document type determines** the type label, the candidate date labels, the work-section heading, the headline figure, and which sections can appear. Within the Invoice, paid state selects between "Due date" and "Paid date" (S10-R4); data state shows or hides optional content.
* **A fully paid Invoice stays an Invoice.** Its label does not change to "Receipt"; the payments listed and the $0.00 Balance are the proof of payment. This matches every leading invoicing product surveyed; a receipt documents a payment, not an invoice, and the invoice is the tax and accounts-payable document in both the US and Canada. The one masthead change at full payment is the date: "Paid date: {date}" replaces "Due date: {date}" (S10-R4, net-new).
* **The masthead carries no status pill on any document.** Status appears only with the content that proves it: the Paid banner's pill (Story 8) and the status column in the Credit Invoice's status table (Story 11).
* **The masthead document label names the type before the number:** "Estimate: {number}", "Invoice: {number}", "Credit: {number}". The number always includes its type prefix (Story 1).
* **The Terms field is shown on the Estimate and Invoice, not on the Credit Invoice.** An estimate may cover work not yet performed, so payment terms are relevant on it.
* **Optional fields follow one rule: if the value is present, show it; if it is empty, hide it.** This applies to Customer PO, the Approval Code, the Authorizer (S3-N3), and the optional asset fields. Terms is the one deliberate exception (S3-R2).
* **Remit Payment To is shown only on the Estimate and Invoice, and only when a remit-to payee is present** through the integrated-billing setup.
* **The Invoice's remaining figure is labeled "Balance," not "Amount Due"** (this matches the behavior already shipped in production). Balance equals the Total minus all applied payments (any method), applied deposits, and applied customer-account credits, and is floored at $0.00 — an overpaid invoice shows "Balance" with "$0.00", never a negative amount and never a hidden row.
* **The signature area carries no authorization or acknowledgment sentence** — only the signature, printed-name, and date lines.
* **One signature style on every document:** lines labeled exactly "Customer Signature", "Printed Name", and "Date", identical across all documents.
* **Parts sale documents are in scope; batch and imported invoices are deferred.** The parts sale estimate and invoice share the entire document chrome — only the body differs (a flat Parts section instead of jobs) — so deferring them would have left the most common non-service document in the old visual language. Batch and imported invoices are genuinely different templates and wait for [SV-9193](https://shopview.atlassian.net/browse/SV-9193). Restyling shared template partials must not half-restyle the deferred templates; dev confirms the three current templates' partials are forked or untouched. (Chris + Milan review, 2026-08-12; Story 13.)
* **Remit Payment To keeps both production mechanisms.** The payee resolves from integrated billing or from the location's own remit-to setting; only the fallback that printed the shop's own address is dropped (net-new). A location configured to remit elsewhere keeps printing it. (Milan review, 2026-08-12; S2-R2.)
* **Credit Invoice Balance preserves SV-7754.** Balance reads the remaining available credit, positive, rather than a flat $0.00 — flattening it would regress a recent PO-specced fix. (Milan review, 2026-08-12; S11-R6/S11-R6a.)
* **Authorizer entry extends to parts sales (net-new).** Same treatment as the work order: same "Approves Work" contact list, empty by default, locked at invoicing, printed on the document. (Chris, 2026-08-12; S13-R6.)

## 6. Terminology

* **Masthead** — the block of the document that carries the shop identity (name, address, phone, logo) and the document label with its number; its placement on the page follows the design prototype. The masthead carries no monetary figure. "Letterhead" refers to the shop-identity lines within the masthead.
* **Headline figure** — the single most important monetary amount, carried as the boxed figure at the end of the totals block (visual prominence follows the design prototype) — for example the Balance on an Invoice. It never appears in the masthead.
* **Status pill** — a short status label with fixed, required text (for example "PAID IN FULL"). It appears only in the Paid banner (Story 8), never in the masthead. Its shape is a visual choice shown in the design prototype. The banner's "Payment X of Y · Batch" marker is a count, not a status pill.
* **Payment Receipt** — three different things share this name; do not confuse them: (1) the customer's receipt for an invoice, which is simply the **fully paid Invoice** (payments listed, Balance $0.00, "Paid date: {date}" in the masthead — no separate document); (2) the **Paid banner's title string** "Payment Receipt - Payments by ShopView" (or its "(Batch)" variant — S8-R8), fixed wording that already exists in production and appears on portal-generated Invoice PDFs (S8-R8), including on a partially paid invoice — its presence does not change what the document is; (3) the **standalone portal receipt**, which is on pause and out of scope (Section 2).
* **Work Summary** — the heading over the work breakdown on an **Estimate**. An estimate may cover work not yet performed, so a neutral heading is used rather than "Work Performed." On an **Invoice** the same section is headed **Work Performed**.
* **Description** — a work line's own summary text (S5-R4).
* **Scope-of-work note** — a separate, per-line note describing the scope of that line's work, distinct from the Description (S5-R5). Shown below the description when present.
* **Shop supplies** — a single shop-wide charge, calculated as a percentage of labor, with an optional minimum charge amount and an optional maximum charge amount. It is its own charge row and is not an Adjustment.
* **Adjustments** — fees and discounts. A **work-order-wide** adjustment applies to the whole work order (for example a disposal fee or a fleet discount); a **line-level** adjustment is tied to a single labor or parts line.
* **Rollup row** — a single row whose amount is the sum of many line-level amounts (S7-R5).
* **Gross** — an amount before fees and discounts are applied. Not related to tax; taxes are always their own rows (S7-R8).
* **Applied** — used as payment against an invoice. The "applied amount" of a payment (S8-R2) is the portion of that payment used on this invoice; a payment can be applied across more than one invoice.
* **Deposit** — money collected on a work order before invoicing; when the invoice is created, the deposit is applied to it like a payment (S8-R4).
* **Customer-account credit** — a stored amount on the customer's account, usable as payment on invoices. Distinct from the Credit Invoice document, and distinct from credit-card payments.
* **Balance** — on an Invoice: the Total minus all applied payments, deposits, and customer-account credits, floored at $0.00 (S8-R6). On the Credit Invoice, "Balance" is a fixed "$0.00" row in every status (S11-R6); it does not follow the Invoice formula.
* **Fully paid** — an Invoice is fully paid when its Balance is $0.00 **and** at least one payment, deposit, or customer-account credit is applied to it. An invoice with a $0.00 Total and nothing applied is not fully paid — it keeps "Due date: {date}" (S10-R4).
* **Portal-processed payment** — a payment the customer made through the customer portal (recorded with the "SHOPPAY" method code — S8-R3). Only these payments appear in the Paid banner, and the banner appears only on portal-generated PDFs (S8-R8).
* **Batch payment** — one portal checkout that pays multiple invoices in a single charge (S8-R9).
* **Service work order** — a work order for service/repair work performed on an asset, as opposed to a counter/parts-only sale.
* **Integrated-billing setup** — the shop's configured billing integration; it is the only source of a Remit Payment To payee.
* **Remit Payment To** — the address a customer sends payment to when it differs from the shop's own address. It is a payee address.
* **Declined Work** — work that was priced and offered to the customer, and the customer declined it. Shown for reference only.
* **Credited item** — a line on the Credit Invoice. Either a returned part (actual quantity and rate, matching the part on the original invoice) or a money-only credit line (a refund or goodwill amount — Quantity and Rate show "--") (Story 11).

---

## 7. Requirements

_Each story's **Design** link points to the_ [_Design Document_](https://claude.ai/code/artifact/c88ee207-3197-4f54-8cb9-bac3deb84354)_, the design reference for every story. Requirements below are content and wording only. Section 3 (Document composition) governs which sections appear on each document; the stories below do not repeat that. Every rule for the Invoice applies unchanged whether the invoice is unpaid, partially paid, or fully paid, except where a rule itself states a paid-state condition (S1-R7, S8-R8, S10-R4)._

**G-R1 (date format, all stories):** Every {date} on every document renders as, for example, "Jan 5, 2026": abbreviated English month, day of the month without a leading zero, a comma, and the four-digit year (PHP format string "M j, Y"). This format is fixed: no shop or user setting controls it, and it is identical for US and Canadian shops. The one exception is the Paid banner's "Date / Time" field (S8-R9), which the portal supplies at generation time: the same date format, then " - ", then the time as a 12-hour clock with two-digit minutes and the shop timezone abbreviation, for example "Jan 5, 2026 - 2:41 PM MST".

### Story 1: Masthead and Letterhead

**As a** customer receiving a document, **I want** a header that tells me who issued it, what it is, and the headline amount, **so that** I can identify the document and know what to do with it.

**Design:** [Design Document](https://claude.ai/code/artifact/c88ee207-3197-4f54-8cb9-bac3deb84354)

**Jira:** [SV-9140](https://shopview.atlassian.net/browse/SV-9140)

**Prerequisites:**

* The document is an Estimate, Invoice, or Credit Invoice.

**Requirements:**

* **S1-R1:** The masthead shows the shop location's name, street address, city, state or province, postal code, and phone number.
* **S1-R2:** The masthead shows the shop's logo when the shop has set one; when no logo is set, no logo and no placeholder are rendered.
* **S1-R3:** The masthead shows the document label naming the type before the number: exactly "Estimate: {number}", "Invoice: {number}", or "Credit: {number}". The number always includes its type prefix — for example "Estimate: EST-4176", "Invoice: INV-4176", "Credit: CM-2202".
* **S1-R4:** The document number uses the shop's existing document numbering; the Credit Invoice's number carries the "CM-" prefix (Story 11).
* **S1-R5:** The masthead carries no status pill on any document. Status appears only with the content that proves it: the Paid banner's pill (Story 8) and the status column in the Credit Invoice's status table (Story 11).
* **S1-R6:** The masthead shows no monetary figure on any document. The document's single headline figure appears once, as the boxed figure at the end of the totals block, with a label matching the document type: "Estimated Total" on an Estimate (its value is the financial summary's "Total" — S7-R9), "Balance" on an Invoice (its value is the S8-R6 Balance). The Credit Invoice has no boxed figure — its masthead carries only "Credit: {number}" and "Issue date: {date}", and its key figure, Total Credit, sits in the totals block (S11-R6).
* **S1-R7:** The masthead date labels read exactly: "Invoice date: {date}" and "Due date: {date}" on an Invoice; on a fully paid Invoice, "Paid date: {date}" replaces "Due date: {date}" (S10-R4); "Issue date: {date}" on a Credit Invoice; "Estimate date: {date}" on an Estimate (net-new — S10-R2).

**Negative cases:**

* **S1-N1:** Within the masthead, the street address, city, state or province, postal code, and phone number are each hidden when empty.

---

### Story 2: Addresses

**As a** customer, **I want** to see who the document is billed to and, when applicable, where to send payment, **so that** I know my account and how to pay.

**Design:** [Design Document](https://claude.ai/code/artifact/c88ee207-3197-4f54-8cb9-bac3deb84354)

**Jira:** [SV-9141](https://shopview.atlassian.net/browse/SV-9141)

**Prerequisites:**

* The document has an associated customer.

**Requirements:**

* **S2-R1:** The document shows a block labeled exactly "Bill To" with the customer's name, street address, city, state or province, and postal code. The name is the customer's company name when present, otherwise the customer's personal name. On the Credit Invoice this block is labeled exactly "Credit To" (S11-R2); every other rule in this story applies to it unchanged.
* **S2-R2:** On the Estimate and Invoice (not the Credit Invoice), the document shows a block labeled exactly "Remit Payment To" when a remit-to payee is present for the document. The payee resolves from either production mechanism: the shop's integrated-billing remit-to, or the location's own remit-to setting (a location configured to remit to another location or to a custom address). When neither is configured, the block is not shown **(net-new: production previously fell back to printing the shop's own address as the remit-to)**.
* **S2-R3:** When the Remit Payment To block is not shown, the Bill To block spans the full width of the addresses area (it does not stay at half width). This width rule is one of the spec's two deliberate binding layout rules, like the banner-order rule (S8-R8). On the Credit Invoice, Remit Payment To never appears (Section 3), so the Credit To block is always full width.

**Negative cases:**

* **S2-N1:** Within the Bill To block, the street address, city, state or province, and postal code are each hidden when empty. The name line is always shown.
* **S2-N2:** When no remit-to payee is present, the Remit Payment To block is not shown.

_\* Context note: a remit-to payee comes only from the shop's integrated-billing setup._

---

### Story 3: Order Reference Fields

**As a** shop, **I want** the order reference fields shown according to the per-field rules below (Terms is the one field that always shows), **so that** the document stays uncluttered.

**Design:** [Design Document](https://claude.ai/code/artifact/c88ee207-3197-4f54-8cb9-bac3deb84354)

**Jira:** [SV-9142](https://shopview.atlassian.net/browse/SV-9142)

**Prerequisites:**

* The document is an Estimate or Invoice.

**Requirements:**

* **S3-R1:** The order reference fields area can show five fields, in this order, labeled exactly "Work Order", "Customer PO", "Authorizer", "Approval Code", and "Terms". In this area, field labels render with no punctuation after them (no colon).
* **S3-R2:** The Terms field is always shown on the Estimate and Invoice — the one deliberate exception to the hide-when-empty rule (Section 5).
* **S3-R3:** The Authorizer field shows the full name of the work order's selected Authorizer (net-new). The Authorizer is selected on the work order per S3-R5.
* **S3-R4:** The Approval Code field shows the work order's integrated-billing approval code (net-new placement — see the context note).
* **S3-R5 (entry point, net-new):** The Authorizer is selected in the customer contact card on the left side of every work order, in an "Authorizer" row directly below the Contact and Phone values, in the same label-and-value style. Selecting the row opens a list of the customer's contacts that have "Approves Work" enabled on the contact record; no other contact and no free-typed name can be chosen. This is the only entry point.
* **S3-R6 (net-new):** The Authorizer is not required and defaults to empty. The list carries a "No authorizer" option that clears the selection.
* **S3-R7 (net-new):** When the selected Authorizer's contact record has a phone number, the phone number is shown in the card directly below the Authorizer's name, styled like the Contact's phone. When the contact record has no phone number, no phone row is shown.
* **S3-R8 (net-new):** The Authorizer cannot be changed once the work order is invoiced; from that point the row is locked.
* **S3-R9 (net-new):** A new authorizer is created on the customer's contacts page: the user creates or edits a contact and enables "Approves Work". The change reflects immediately: the contact becomes selectable in the work order's Authorizer list without any refresh or re-save of the work order.

_\* Context note: the Terms field holds the customer's payment terms (for example "Net 30")._

**Negative cases:**

* **S3-N1:** The Work Order field is hidden when the work order number equals the trailing digits of the document number. The trailing digits are the unbroken digits at the end of the number: "4176" in "INV-4176"; "24914" in "INV-S-24914". Example: document number "INV-S-24914" with work order number "24914" hides the field. Work order number "24915" shows it.
* **S3-N2:** The Customer PO field is hidden when it is empty.
* **S3-N3:** The Authorizer field is hidden when the work order has no Authorizer selected: no label, no empty value area. An empty Authorizer never prints on any document.
* **S3-N4:** When no Terms value is configured, the rendered text is exactly "Terms" with an empty value area — no colon, no placeholder.
* **S3-N5:** The Approval Code field is hidden when the work order has no approval code — no label, no empty value area.

_\* Context note: "Authorizer" is the work order's selected authorizer: a customer contact with "Approves Work" enabled, chosen in the work order's customer contact card (S3-R5, the only entry point). The value is the contact's full name. "Approves Work" is the existing checkbox on the contact record (the is_authorizer flag). "Approval Code" is the approval code issued through the shop's integrated-billing setup. Net-new: today's document prints the approval code under the "Authorizer" label and the work order has no authorizer selection; this spec moves the code to its own "Approval Code" field and points Authorizer at the selected authorizer's name._

---

### Story 4: Asset Section

**As a** customer, **I want** to see which asset the work was done on, **so that** I can confirm the document is for the right vehicle or unit.

**Design:** [Design Document](https://claude.ai/code/artifact/c88ee207-3197-4f54-8cb9-bac3deb84354)

**Jira:** [SV-9143](https://shopview.atlassian.net/browse/SV-9143)

**Prerequisites:**

* The document is an Estimate or Invoice.
* The work order has an asset attached.

**Requirements:**

* **S4-R1:** When the asset section is shown, it shows the asset name, labeled exactly "Asset". When the asset has a VIN or a serial number, the section also shows one value labeled exactly "VIN / Serial": the VIN when the asset has a VIN, otherwise the serial number.
* **S4-R2:** The asset section can also show fields labeled exactly "Unit", "Plate", "Mileage", and "Eng Hrs".

**Negative cases:**

* **S4-N1:** The Unit, Plate, Mileage, and Eng Hrs fields are each hidden when empty.
* **S4-N2:** When the section is shown but the asset has no VIN or serial number, the "VIN / Serial" field is hidden; the Asset name still shows.
* **S4-N3:** When the work order has no asset attached, the asset section is hidden.

_\* Context note: the label "Asset" is used instead of "Vehicle" so it reads correctly for non-vehicle assets as well._

_\* Context note: net-new — today the section shows only on a service work order, or when the asset has a VIN or serial number; this spec shows it whenever the work order has an asset attached, part sales included._

---

### Story 5: Work Section

**As a** customer, **I want** the work laid out clearly with its charges, **so that** I understand what I am paying for.

**Design:** [Design Document](https://claude.ai/code/artifact/c88ee207-3197-4f54-8cb9-bac3deb84354)

**Jira:** [SV-9144](https://shopview.atlassian.net/browse/SV-9144)

**Prerequisites:**

* The document is an Estimate or Invoice.

**Requirements:**

* **S5-R1:** The work is presented under a single section heading, reading exactly "Work Summary" on an Estimate and "Work Performed" on an Invoice.
* **S5-R2:** Each work line shows a line number. Line numbers are sequential with no gaps and are zero-padded to two digits (01, 02 … 10, 11). Lines 1–99 stay two digits even when the document has 100 or more lines; lines 100 and above show three digits (100, 101 …).
* **S5-R3:** Each work line shows a name.
* **S5-R4:** Each work line shows its description when a description is present.
* **S5-R5:** Each work line shows its scope-of-work note when a scope-of-work note is present.
* **S5-R6:** A labor entry within a line is labeled exactly "Labor"; a parts entry is labeled exactly "Part".
* **S5-R7:** Labor hours, labor rate, labor cost, part quantity, and part price are each shown or hidden by their own independent document setting — under Administration → Invoice Details, labeled "Labor hours", "Labor rate", "Labor price", "Part quantity", and "Part price". These settings hide the per-entry figures and the matching line-footer figure: "Labor price" off also hides the footer's "Labor" figure, and "Part price" off also hides the footer's "Parts" figure. Two further settings in the same list, labeled exactly "Summarize labor total" and "Summarize parts total", control whether the line footer shows its per-line "Labor" and "Parts" figures at all. No setting collapses or hides the itemized labor and parts entries themselves. "Line total" and the financial summary (Story 7) always show their amounts.
* **S5-R8:** A fee or discount that applies to a single labor or parts line is shown with that line; a discount is shown in parentheses and a fee is shown as a plain amount.
* **S5-R9:** Each work line shows a footer with figures labeled exactly "Labor", "Parts", and "Line total". The Labor and Parts figures are that line's own totals after its line-level fees and discounts; "Line total" is their sum. A "Labor" or "Parts" footer figure is shown when its summarize setting (S5-R7) is on; it is hidden when that setting is off, when its value is $0.00, or when its matching price setting (S5-R7) is off (a negative value is shown with its sign). The footer's vertical divider before "Line total" is shown only when at least one "Labor" or "Parts" figure is visible; when neither is, "Line total" stands alone with no divider. "Line total" is always shown, including when it reads $0.00.
* **S5-R10:** The "Line total" figure appears once per line.

**Negative cases:**

* **S5-N1:** When the document has no work lines, the work section shows its heading with no lines, and the "Summary" divider (S7-R1) still precedes the financial summary.

_\* Context note: parentheses on a discount are an accounting convention indicating a subtraction; they are required wording, not styling. "Part" (singular) is intentional for an individual entry; the "Parts" total (S5-R9, S7-R2) is plural on purpose._

---

### Story 6: Declined Work

**As a** shop, **I want** to show work the customer declined for reference, **so that** there is a record of the work that was offered.

**Design:** [Design Document](https://claude.ai/code/artifact/c88ee207-3197-4f54-8cb9-bac3deb84354)

**Jira:** [SV-9145](https://shopview.atlassian.net/browse/SV-9145)

**Prerequisites:**

* The document is an Estimate or Invoice.
* The document has one or more declined work lines.
* The "Show declined work" option is enabled for the document.

**Requirements:**

* **S6-R1:** Declined work is shown in its own section headed exactly "Declined Work", separate from the main work section.
* **S6-R2:** Each declined line shows its name, and its description when a description is present. A declined line never shows a scope-of-work note (the technician's write-up); that note is internal and does not print on any customer document for declined work.
* **S6-R3:** Declined lines show no prices, no labor totals, and no parts totals, and are never included in any total on the document.
* **S6-R4:** Declined lines do not show a line number.
* **S6-R5:** No status pill is shown on declined lines; the "Declined Work" heading is the only indicator of declined status.

**Negative cases:**

* **S6-N1:** When there are no declined lines, or the "Show declined work" option is off, the Declined Work section is not shown.

---

### Story 7: Financial Summary

**As a** customer, **I want** a clear breakdown of charges leading to what I owe, **so that** I can verify the total.

**Design:** [Design Document](https://claude.ai/code/artifact/c88ee207-3197-4f54-8cb9-bac3deb84354)

**Jira:** [SV-9146](https://shopview.atlassian.net/browse/SV-9146)

**Prerequisites:**

* The document is an Estimate or Invoice.

**Requirements:**

* **S7-R1:** A divider labeled exactly "Summary" precedes the financial summary.
* **S7-R2:** The summary shows a row labeled exactly "Labor" and a row labeled exactly "Parts". Each shows the gross amount — before any fees or discounts. A row labeled exactly "Shop supplies" is shown only when a shop-supplies charge applies.
* **S7-R3:** When the location's "Show % on Estimates and Invoices" setting is enabled and shop supplies are charged as a percentage of labor, the percentage is shown with the shop supplies amount; otherwise the amount is shown alone.
* **S7-R4:** Fees and discounts are grouped under a heading labeled exactly "Adjustments", which is a label with no amount of its own.
* **S7-R5:** Under the Adjustments heading, in this order: a rollup row labeled exactly "Labor" totaling all line-level labor fees and discounts, a rollup row labeled exactly "Parts" totaling all line-level parts fees and discounts, then each work-order-wide fee or discount as its own named row; the work-order-wide rows appear in the order they were added to the work order. The "Labor" and "Parts" rollup rows are each shown only when their total is not zero; a rollup row whose total is negative is shown in parentheses like a discount, and a positive rollup row is shown as a plain amount. A work-order-wide discount is shown in parentheses and a work-order-wide fee is shown as a plain amount. The summary intentionally contains two rows labeled "Labor" and two labeled "Parts" — the pair under the Adjustments heading is distinguished by its position under that heading, not by its label.
* **S7-R6:** Shop supplies are shown as their own charge row and are not placed under the Adjustments heading.
* **S7-R7:** The summary shows a row labeled exactly "Subtotal".
* **S7-R8:** The summary shows one tax row per applicable tax, each labeled with the tax name and its rate.
* **S7-R9:** The summary shows the grand total, labeled exactly "Total".
* **S7-R10:** Every row of the financial summary that contributes to the Subtotal is displayed; no contributing summary row is hidden.

**Negative cases:**

* **S7-N1:** The Adjustments heading is not shown when there is nothing to list under it — no work-order-wide fees or discounts and both rollup totals at zero.
* **S7-N2:** When no tax applies, no tax row is shown.

_\* Context note: the Labor and Parts summary rows are gross, so line-level fees and discounts are counted only once — in the "Labor" and "Parts" rollup rows under Adjustments. A line-level fee or discount still shows beside its own line in the work section (S5-R8); that inline row is informational and is not added again. The visible math is: gross Labor + gross Parts + Shop supplies + all Adjustments rows = Subtotal._

---

### Story 8: Paid Banner, Payments, and Balance (Invoice)

**As a** customer, **I want** to see payments applied and the balance remaining, **so that** I know what is still owed.

**Design:** [Design Document](https://claude.ai/code/artifact/c88ee207-3197-4f54-8cb9-bac3deb84354)

**Jira:** [SV-9147](https://shopview.atlassian.net/browse/SV-9147)

**Prerequisites:**

* The document is an Invoice.

**Requirements:**

* **S8-R1:** The Invoice shows a heading labeled exactly "Payments".
* **S8-R2:** When one or more payments have been applied, each payment is shown as a row with a label and an amount. The label reads "{date} - {method}" (for example "Jul 30, 2026 - Cash"), where {date} is the payment's own date and the hyphen is a literal character; the amount is the applied amount when present, otherwise the payment amount. The rows list applied payments only, ordered by {date}; a payment that was fully reversed is no longer applied and does not appear.
* **S8-R3:** The method name is the shop-configured payment-method name when configured; otherwise the payment code, with each underscore replaced by a space (for example, credit_card → "credit card"). The "SHOPPAY" code is shown as "Online".
* **S8-R4:** A deposit is shown as a payment row labeled "(Deposit) {date} - {method}", where {date} is the date the deposit was collected. An applied customer-account credit is shown as a payment row labeled "(Credit) {date} - {credit number}", where {credit number} is the full CM-prefixed number and {date} is the date the credit was applied.
* **S8-R5:** When a payment's or deposit's amount exceeds its amount applied to this invoice, a sub-line is shown beneath that row. When the excess has become a customer-account credit with a number, the sub-line reads exactly "of {full amount} — {excess} → Credit {credit number}"; otherwise it reads exactly "of {full amount} — {excess} will be credited". {full amount} is the payment's or deposit's full amount; {excess} is the full amount minus the amount applied to this invoice. Worked example: a $500.00 deposit with $350.00 applied reads "of $500.00 — $150.00 → Credit CM-1042". The em dash and the arrow are literal separator characters, not subtraction.
* **S8-R6:** The Invoice shows a row labeled exactly "Balance" with the amount remaining to be paid. Balance equals the Total minus all applied payments (any method), applied deposits, and applied customer-account credits, and is floored at $0.00: an overpaid invoice shows "Balance" with "$0.00" — never a negative amount and never a hidden row.
* **S8-R7:** A payment row whose amount is $0.00 is not shown.
* **S8-R8: Paid banner.** Behavior already in production, restated unchanged — this spec adds no new banner work: the paid banner appears only on the Invoice PDF generated by the customer portal, which supplies the payment data at generation time. An Invoice PDF generated in the shop app never carries the banner, whether or not portal payments exist. On a portal-generated PDF, the banner is shown before all other invoice content, including the masthead (this ordering is a deliberate content rule — a binding exception to the otherwise non-binding section order; see "Visual design status"). The banner lists only portal-processed payments; shop-recorded payments appear only in the Payments section (S8-R2). The banner shows a fixed status pill: exactly "PAID IN FULL" when the invoice is fully paid (Section 6) at generation time, otherwise exactly "PARTIALLY PAID". The banner shows a title: when every payment listed in the banner was made as part of a batch payment, the title reads exactly "Payment Receipt (Batch) - Payments by ShopView"; in every other case — including when any listed payment is a single payment — it reads exactly "Payment Receipt - Payments by ShopView".
* **S8-R9:** Each banner payment shows fields labeled exactly: "Date / Time" (the date and time the payment was made), "Paid By" (the payer name captured at payment), "Method" (named by the S8-R3 rule), "Invoice Amount" (the portion of this payment applied to this invoice, before any fees), and "Total Charged" (the amount actually charged to the customer for this payment, including any convenience and late fees; labeled "Total Charged (Batch)" for a batch payment, where it covers the whole batch). "Convenience Fee" and "Late Fee" are each shown only when the portal charged one (a non-zero amount). "Remaining Balance" is the invoice balance immediately after this payment, shown only when that balance was greater than $0.00. In a batch, each payment carries a "Payment X of Y · Batch" marker.

**Negative cases:**

* **S8-N1:** When no payments, deposits, or customer-account credits have been applied, the Payments heading is shown with no rows, and the Balance equals the Total.
* **S8-N2:** When the invoice has no portal-processed payment, the paid banner is not shown — a shop-recorded payment (for example cash at the counter) never produces the banner, and an Invoice PDF generated in the shop app shows no banner in any case.

_\* Context note: the banner title is a fixed string that already exists in production; its presence does not change what the document is. Quick-Charge portal payments are not tied to an invoice and never appear on an invoice PDF. The payment "reference" (for example a check (cheque) number or a transaction number) is stored but is not shown on the customer document today; adding it would be net-new._

---

### Story 9: Disclaimer, Signature, and Footer

**As a** shop, **I want** my standard disclaimer, a signature area, and my tax identifier to appear consistently, **so that** the document is complete.

**Design:** [Design Document](https://claude.ai/code/artifact/c88ee207-3197-4f54-8cb9-bac3deb84354)

**Jira:** [SV-9148](https://shopview.atlassian.net/browse/SV-9148)

**Prerequisites:**

* The disclaimer, the signature area, and the footer tax identifier apply to every document (Section 3).

**Requirements:**

* **S9-R1:** The document shows the shop's configured disclaimer text, with no heading above it, identical on every document that carries it.
* **S9-R2:** The document shows a signature area with three lines labeled exactly "Customer Signature", "Printed Name", and "Date", identical on every document that carries it.
* **S9-R3:** The signature area contains no authorization or acknowledgment sentence.
* **S9-R4:** The footer shows the shop's tax identifier exactly as the shop entered it, with no label added in front of it.

**Negative cases:**

* **S9-N1:** When the shop has no configured disclaimer, the disclaimer area is not shown.
* **S9-N2:** When the shop has no tax identifier configured, the footer tax identifier is not shown.

_\* Context note: the shop types its own label into the tax identifier field, for example "GST# 812694966 RT0001", so the document must not prepend a label._

---

### Story 10: Estimate and Invoice Specifics

**As a** customer, **I want** the estimate and invoice to differ only as needed, **so that** each reads correctly for its purpose.

**Design:** [Design Document](https://claude.ai/code/artifact/c88ee207-3197-4f54-8cb9-bac3deb84354)

**Jira:** [SV-9149](https://shopview.atlassian.net/browse/SV-9149)

**Prerequisites:**

* The document is an Estimate or Invoice.

**Requirements:**

* **S10-R1:** The Estimate and Invoice carry the same content, differing only as Section 3 specifies (document label, dates, work-section heading, headline figure, and the presence of the Paid banner and the Payments and Balance sections on the Invoice).
* **S10-R2:** On an Estimate, the work-section heading reads "Work Summary", the headline figure is labeled "Estimated Total", and the masthead shows "Estimate date: {date}" **(a relabel, not a new element: production estimates today print "Invoice Date" and "Due date" on the estimate; this renames the issued date, drops the due-date line, and retires the quirk where a null due date rendered as today's date)**. No validity or expiry date is shown. (The signature area's "Date" line, S9-R2, is unaffected.)
* **S10-R3:** On an Invoice, the work-section heading reads "Work Performed", the headline figure is labeled "Balance", and the masthead shows "Invoice date: {date}" and "Due date: {date}" (on a fully paid Invoice, "Paid date: {date}" replaces "Due date: {date}" — S10-R4).
* **S10-R4:** A fully paid Invoice (Section 6) remains "Invoice: {number}", lists its payments (Story 8), and shows a Balance of $0.00. It is the customer's receipt; no separate receipt document exists and the document label is never renamed. **One masthead change occurs at full payment (net-new):** "Paid date: {date}" replaces "Due date: {date}". The date label is decided by the invoice's state at render time: fully paid shows "Paid date"; not fully paid shows "Due date". The paid date is the most recent {date} among the applied payment, deposit, and credit rows (S8-R2, S8-R4). If a later change (for example a payment reversal, a voided credit, or an invoice edit) makes the Balance greater than $0.00, the invoice is no longer fully paid and "Due date: {date}" returns. A paid date may be earlier than the invoice date (a deposit collected before invoicing); it is shown as-is.

**Negative cases:**

* **S10-N1:** An Invoice with no due date set shows "Invoice date: {date}" and no "Due date" line. The S10-R4 swap is unaffected: when such an invoice becomes fully paid, "Paid date: {date}" is shown.

---

### Story 11: Credit Invoice

**As a** customer receiving a credit, **I want** a clear credit document, **so that** I understand what was credited.

**Design:** [Design Document](https://claude.ai/code/artifact/c88ee207-3197-4f54-8cb9-bac3deb84354)

**Jira:** [SV-9150](https://shopview.atlassian.net/browse/SV-9150)

_\* Context note: the customer credit document is titled "Credit Invoice". It credits returned parts and money-only amounts (refunds, goodwill), and is backed by a customer-account credit. A single Credit Invoice may mix returned-part lines and money-only lines._

**Prerequisites:**

* The document is a Credit Invoice.

**Requirements:**

* **S11-R1:** The masthead shows "Credit: {number}" (the credit number carries the "CM-" prefix, for example "Credit: CM-2202") and "Issue date: {date}". The masthead shows no money figure.
* **S11-R2:** The customer address block is labeled exactly "Credit To".
* **S11-R3:** A status table shows three columns labeled exactly "Credit Number", "Status", and "Invoice Number". Status shows the credit's current state: "Unapplied", "Partially applied", "Applied", "Refunded", or "Voided". Invoice Number shows the originating invoice's full document number (for example "INV-S-24914"); the whole column is hidden for an account-level credit with no origin invoice. The five statuses are the complete set of credit states; the S11-R6 table has a row for each.

_\* Context note: the credit number and the invoice number come from independent numbering sequences. They are not expected to match, and no rule compares them._

* **S11-R4:** The credited items appear in a table with columns labeled exactly "Description", "Quantity", "Rate", "Restocking Fee", and "Total". A returned part shows its actual quantity (as a negative number) and rate; a money-only credit line shows "--" for Quantity and Rate. The Restocking Fee column is always shown, reading "$0.00" when there is no fee. Totals are negative, formatted with a leading minus — for example "-$100.00". (Credit Invoice amounts use a leading minus, not the parentheses convention used for discounts, S5-R8; the two conventions are intentional and must not be unified.)
* **S11-R5:** For a returned part, the restocking fee reduces the credit: quantity -2 at rate $50.00 with a $10.00 restocking fee produces Total -$90.00. For a money-only line, Total is the credited amount. A money-only line's Description comes from the credit's reason when one was entered, otherwise the credit's memo text, otherwise "Refund".
* **S11-R6:** The totals block shows rows labeled exactly: "Subtotal" (sum of the item totals, negative), "Tax" (a single row; negative when tax applies, "$0.00" when none), "Total Credit" (negative, the document's most important figure — visual emphasis follows the design prototype), "Payments", and "Balance". The Payments and Balance content follows the credit's status:

| Status | Payments section shows | Balance reads |
| --- | --- | --- |
| Unapplied | The "Payments" label with no rows | The full credit amount, positive — its open balance; nothing applied or refunded yet (net-new, S11-R6a) |
| Partially applied | The "Payments" label with no rows (applications to invoices are not listed) | The open balance, positive: original minus amounts applied to invoices (net-new, S11-R6a) |
| Applied | The "Payments" label with no rows (applications to invoices are not listed) | $0.00 — fully applied, nothing remains (S11-R6a) |
| Refunded | One row per refund payment: "{date} - {method}" with the refunded amount, negative | $0.00 once fully consumed; the open balance, positive, until then (SV-7754 / S11-R6a) |
| Voided | The "Payments" label with no rows | $0.00 |

* **S11-R6a:** Balance reads the credit's **open balance** in every status: the original credit total minus amounts refunded minus amounts applied to invoices, shown positive, reading $0.00 once nothing remains or when the credit is voided. On memos with at least one active refund this is exactly the shipped SV-7754 rendering. On memos with no refund (Unapplied, Partially applied), production prints a flat $0.00 today, so showing the open balance there is **deliberate net-new**, decided with engineering on 2026-08-12: same provider aggregate (CreditMemoPdfDataProvider), no new calculation, and a credit document that answers how much credit remains in every status.
* **S11-R7:** The Credit Invoice shows the shop's configured disclaimer and the standard signature area (S9-R2).

_\* Context note: the Credit Invoice does not carry the asset, order, or work information that an invoice carries; Section 3 governs those exclusions. A dedicated free-standing "reason" note is not printed; the reason surfaces only as a money-only line's Description (S11-R5). A Voided credit still renders with its figures unchanged; "Voided" in the status table is the only indicator._

---

### Story 12: Document Visual Standard

**As a** developer building these documents without a designer, **I want** the visual rules stated as verifiable requirements, **so that** the built documents match the Design Document without a design review.

**Design:** [Design Document](https://claude.ai/code/artifact/c88ee207-3197-4f54-8cb9-bac3deb84354)

**Jira:** [SV-9151](https://shopview.atlassian.net/browse/SV-9151)

**Prerequisites:**

* Applies to every document this spec covers (Estimate, Invoice, Credit Invoice), on screen and in PDF output.

**Requirements:**

* **S12-R1 (layout):** The documents implement the Design Document's structure exactly: masthead with the shop letterhead left, the shop logo center, and the document block right over a 2px ink rule; a bordered Addresses row; the asset band; the order reference chips; numbered work lines; the "Summary" break bar; a two-column tail with the disclaimer left and the totals right; the boxed headline figure; the three-line signature row; the single-line footer.
* **S12-R2 (palette, closed set):** The only colors on any document are: ink #121926, body text #364152, muted text #697586, faint labels #9AA4B2, hairlines #E3E8EF, row dividers #EEF2F6, accent #257CFF, negative #B42318, paper #FFFFFF. No color outside this set appears.
* **S12-R3 (accent discipline):** The accent #257CFF appears only on the work line numbers and on the word "ShopView" in the footer. Nothing else on the document uses the accent.
* **S12-R4 (typography):** The typeface is Inter with a system sans-serif fallback. Weight 400 for body text; 600 and 700 for emphasis and totals; 750 for the in-job section labels (S12-R9); 800 for the shop name, the document label, the headline figure, and the line numbers. Uppercase micro-labels carry letterspacing per the Design Document.
* **S12-R5 (print ink floor):** In print and PDF output, no text renders lighter than #4B5565; text smaller than 10px renders no lighter than #364152; hairline rules render no lighter than #CDD5DF. (Weak printers drop lighter values.)
* **S12-R6 (monochrome-safe):** Every document is fully legible printed in grayscale. Color is never the only signal: credit amounts also carry the leading minus (S11-R4), and discounts also carry parentheses (S5-R8).
* **S12-R7 (prototype chrome exclusion):** The Design Document's control strips (the document and field toggles, the settings menu, the POC badge, the theme controls) are demo tooling. They are not part of any document. The white sheet is the document.
* **S12-R8 (work-section rules and dividers):** The work section opens with a 2px ink rule under the section label. Numbered jobs are separated by a 1px ink (#121926) rule. Charge rows inside a job are separated by #EEF2F6 row dividers. The "Labor" and "Parts" sub-section labels carry no underline rule. When a line has fee or discount adjustment rows, the row divider follows the line's **last adjustment row**, never sitting between the line and its adjustments — the line and its adjustments read as one group. (Same rule on the Parts Sale body, S13-R3.)
* **S12-R9 (section-label hierarchy):** Section labels are bold uppercase micro-labels in three fixed treatments: the document section label ("Work Summary" / "Work Performed" / "Parts") at 11px weight 700 in muted ink #697586; "Scope of work" at 10px weight 750 in body ink #364152; the in-job "Labor" and "Parts" labels at 10.5px weight 750 in full ink #121926. All three sit visually below the 16px weight-700 job titles. Letterspacing per the Design Document.

**Negative cases:**

* **S12-N1:** The PDF output carries no drop shadow and no rounded sheet corners; those are screen-prototype presentation only.

---

### Story 13: Parts Sale Estimate and Invoice

**As a** customer buying parts without service work, **I want** the parts sale estimate and invoice to look like the shop's other documents, **so that** every document I receive reads the same way.

**Design:** [Design Document](https://claude.ai/code/artifact/c88ee207-3197-4f54-8cb9-bac3deb84354) (the Parts Sale Estimate / Parts Sale Invoice views and the Authorizer Entry (Parts Sale) page)

**Jira:** [SV-9195](https://shopview.atlassian.net/browse/SV-9195)

**Prerequisites:**

* The document is a Parts Sale Estimate or a Parts Sale Invoice.

**Requirements:**

* **S13-R1:** The Parts Sale Estimate behaves as the Estimate, and the Parts Sale Invoice as the Invoice, throughout this spec — masthead and date labels (Stories 1 and 10, including "Estimate date" and the Due/Paid date swap), addresses and Remit Payment To (Story 2), asset section (Story 4), financial summary (Story 7), payments and Balance (Story 8), paid banner rule, disclaimer and signature (Story 9), and visual standard (Story 12) — except as this story states.
* **S13-R2:** The body is a single section headed "Parts": flat part lines showing part number, description, quantity, rate, and amount. No job blocks, no "Scope of work", no Labor section, and no Declined Work section exist on a parts sale document.
* **S13-R3:** Line-level fees and discounts render exactly as on the Invoice: indented under their part line, with the row divider following the part's last adjustment row rather than sitting between the part and its adjustments.
* **S13-R4:** The document number keeps the parts-sale numbering through the existing document numbering (for example "Estimate: EST-P2-1088", "Invoice: INV-P2-1088").
* **S13-R5:** Reference fields: Work Order and Approval Code are not shown. Customer PO and Terms are unchanged. Authorizer follows S13-R6.
* **S13-R6 (net-new):** The parts sale receives the work-order Authorizer treatment: an Authorizer field on the parts sale record, offering the customer's "Approves Work" contacts, empty by default, filled by the user, locked once the parts sale is invoiced, and printed in the document's Authorizer reference field when set.
* **S13-R7:** The financial summary shows no Labor row and no Shop supplies row; the Parts row, the adjustment rows, Subtotal, Tax, Total, Payments, and Balance are identical to the Invoice.

**Negative cases:**

* **S13-N1:** Batch invoices and imported invoices are not part of this story or this spec; they keep their current templates until [SV-9193](https://shopview.atlassian.net/browse/SV-9193) ships (§2, Out of scope).

## 8. Change Log

| Date | Reporter | Change | Notes |
| --- | --- | --- | --- |
| 2026-08-12 | @chris / @claude | Masthead monetary figure removed on every document (CEO direction): the headline figure now appears only as the boxed figure at the end of the totals block. S1-R6 rewritten; Section 3 overview bullet, Section 3 matrix (Masthead and Headline figure rows), and the Masthead / Headline figure terminology entries updated. Labels and values unchanged ("Estimated Total" / "Balance"). | Matches the updated design prototype (2026-08-12). |
| 2026-08-11 | @chris / @claude | Asset section now shows whenever the work order has an asset attached — part sales treated the same as service work orders (drops the service-order / VIN-or-serial gate; net-new vs production). Story 4 prerequisite updated, old S4-N1 removed (remaining negative cases renumbered), Section 3 matrix and the Service work order terminology entry updated. | Per Sasha's review comments (2026-08-11). |
| 2026-08-11 | @chris / @claude | Section 3 matrix: dropped the Status pill row (the no-masthead-pill rule stays in Key Decisions and S1-R5); renamed the Financial summary row to state that the Credit Invoice's own totals block is listed separately. | Per Sasha's review comments (2026-08-11), round 2. |
| 2026-08-11 | @chris / @claude | Added G-R1 (Section 7): the exact date format for every {date} on every document ("Jan 5, 2026", PHP "M j, Y"; fixed, no setting, identical for US and Canadian shops), with the Paid banner's portal-supplied "Date / Time" as the stated exception ("Jan 5, 2026 - 2:41 PM MST"). Verified against the production code. | Per Sasha's review comments (2026-08-11), round 2. |
| 2026-08-11 | @chris / @claude | Added Story 12 (Document Visual Standard): the Design Document is now the binding visual reference (no separate designer on this build), with verifiable rules for layout, the closed palette set, accent discipline, typography, the print ink floor, grayscale legibility, and the prototype-chrome exclusion. Rewrote the Visual design status section (spec owns content and wording, Design Document owns appearance) and narrowed the "Final visual polish" out-of-scope bullet to pixel-level polish within the Story 12 token set. | Chris and Claude are the designers of record; the spec and artifact hand off to a developer directly. |
| 2026-08-11 | @chris / @claude | Declined work: a declined line never shows a scope-of-work note (the technician's write-up) – S6-R2 extended with the explicit exclusion; the Story 6 user story reworded from "what was recommended" to "the work that was offered". The Design Document's declined-line Recommendation block was removed to match. | Chris direction (2026-08-11). |
| 2026-08-11 | @chris / @claude | Authorizer rework: the Authorizer is now selected in the work order's customer contact card, below Contact and Phone (new S3-R5, the only entry point); the list offers only contacts with "Approves Work" enabled (the existing is_authorizer flag); not required, defaults to empty, with a "No authorizer" clear option (S3-R6); the selected authorizer's phone shows below the name when entered (S3-R7); locked once the work order is invoiced (S3-R8); new authorizers are built on the customer contacts page and become selectable immediately (S3-R9). S3-N3 reversed from never-empty to hide-when-empty, S3-R3 and the context note repointed, and the Section 5 optional-fields decision updated. | Chris direction (2026-08-11). Matches the Design Document's Authorizer Entry page. |
| 2026-08-11 | @chris / @claude | S5-R7 and S5-R9 amended: the "Labor price" and "Part price" settings now also hide the matching line-footer figure; "Line total" and the financial summary always show their amounts. | Matches the Design Document's toggle behavior. |
| 2026-08-11 | @chris / @claude | Linked every story to Jira: stories SV-9140 through SV-9151 created under epic SV-8218 (one per spec story, S1 through S12); all twelve "Jira: TBD" placeholders replaced with the ticket links. | Epic SV-8218 description filled (goal, key points, spec + design links, ordered story list). |
| 2026-08-11 | @chris / @claude | S5-R7 and S5-R9 aligned to production's document settings: added the "Summarize labor total" and "Summarize parts total" settings, which control the line footer's per-line Labor and Parts figures (no setting collapses the itemized entries); the footer's vertical divider before "Line total" drops when no Labor or Parts figure is visible. Existing production behavior, not net-new. | Matches the Design Document's cog toggles. |
| 2026-08-12 | @chris / @claude | An Estimate now shows a masthead date: "Estimate date: {date}" (net-new). Updated S1-R7, S10-R2, and the §3 composition table, which previously stated an Estimate shows no masthead date. A validity/expiry date was considered and deliberately left out. | Matches the Design Document update of the same day. |
| 2026-08-12 | @chris / @claude | Milan's tech-planning review (SV-8218) folded in: S11-R6 Balance now preserves the SV-7754 remaining-available-credit rendering (new S11-R6a; status-table Balance column rewritten, one engineering confirmation noted on invoice applications); S2-R2 extended to both production remit-to mechanisms (integrated billing + location remit-to setting) with the self-address fallback dropped as net-new; S10-R2's net-new marker corrected to a relabel (production estimates print a mislabeled "Invoice Date" / "Due date" today, including the null-due-date-renders-today quirk this change retires). | Milan footer comment, 2026-08-12. |
| 2026-08-12 | @chris / @claude | Parts Sale Estimate and Parts Sale Invoice brought into scope as Story 13: full document chrome shared with the Estimate/Invoice, body swapped to a flat Parts section, parts-prefix numbering, Work Order and Approval Code fields dropped, and the work-order Authorizer treatment extended to parts sales (net-new, S13-R6). Batch and imported invoices explicitly deferred to a follow-up ticket (§2 Out of scope, S13-N1). Design Document updated with the Parts Sale views and the Authorizer Entry (Parts Sale) page. | Chris call after design review, 2026-08-12. |
| 2026-08-12 | @claude | Follow-up ticket for the batch and imported invoice templates created and linked: [SV-9193](https://shopview.atlassian.net/browse/SV-9193) (Story under SV-8218, spec-first with the shared-partials guardrail). | Closes the "follow-up ticket to come" loose end. |
| 2026-08-12 | @chris / @claude | Credit Invoice Balance finalized with engineering: Balance reads the open balance (original minus refunded minus applied) in every status, $0.00 once consumed or voided (S11-R6a and the status table rewritten; the engineering confirmation clause resolved). Showing the open balance on no-refund memos is deliberate net-new; production prints $0.00 there today. Story 13 Jira placeholder pointed at SV-9195. | Milan reply, 2026-08-12; option (b) chosen. |
| 2026-08-12 | @chris / @claude | Visual standard locked to the reviewed Design Document (CEO pass): new S12-R8 (work-section rules: 2px ink opener, 1px ink between jobs, #EEF2F6 row dividers, no underline under Labor/Parts labels, divider follows a line's last adjustment row) and S12-R9 (three-tier section-label hierarchy with exact sizes/weights/inks); S12-R2 palette gains the #EEF2F6 row-divider grey and S12-R4 gains the 750 label weight so both closed sets stay accurate. | Design review with CEO, 2026-08-12. |

