# Invoice Design Selection — Product Spec — STRUCTURED EXTRACTION

> Extracted for manual-test-suite authoring. Source: Confluence page id **845447188**,
> space `~7120207b6068952672480db1a06bd810e23ba1` (Sasha Grosman personal space),
> read live 2026-09-10. Read-only extraction; nothing edited.

---

## 1 · META

| Field | Value |
|---|---|
| **Page title** | Invoice Design Selection — Product Spec (title carries an em dash "—") |
| **Page id** | 845447188 |
| **Space** | `~7120207b6068952672480db1a06bd810e23ba1` — "Sasha Grosman" (personal space) |
| **Web URL** | https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845447188/Invoice+Design+Selection+Product+Spec |
| **Author / Owner** | Sasha Grosman (Owner listed as "Sasha") |
| **Status** | Draft |
| **Last Updated** | "about an hour ago" relative to 2026-09-10 read. Latest Change Log entry: **2026-09-10, Revision 3** by Sasha. |
| **Version number** | NOT returned by the API call used (`getConfluencePage`). The change log shows the document has gone: Initial draft (2026-09-09) → Revision 1 (2026-09-09) → Revision 2 (2026-09-09) → Chris W. review (2026-09-10) → Revision 3 (2026-09-10). The Confluence version integer must be confirmed separately if needed. |
| **Epic** | **TBD** (page header says "Epic: TBD"). No epic Jira key assigned yet. |
| **Story Jira keys** | All five stories show **Jira: TBD** — no story keys assigned yet. |

### Jira references cited in the body
- **SV-8218** — Invoice UI Refresh. The prior project that restyled all five documents; released in **v26.36.0 on 2026-09-09** ("the refresh release"). This spec's "new design" is the one SV-8218 introduced. https://shopview.atlassian.net/browse/SV-8218
- **SV-9870** — ticketed regression: a printed invoice now consumes **45% more paper** than before the refresh. https://shopview.atlassian.net/browse/SV-9870
- **SV-9193** — batch invoices and imported invoices were **deferred** (never got the new design). https://shopview.atlassian.net/browse/SV-9193

### Design links
- **Design Document (new design)** — https://claude.ai/code/artifact/c88ee207-3197-4f54-8cb9-bac3deb84354 — labelled "(SV-8218)". This is a Claude design artifact export, referenced from Stories 1, 2, 3 (Stories 4 & 5 say "As above"). **No specific view/frame/button names are given in the spec** — it is cited only as "Design Document"; the exact view→document→block anchors (Rule: Design Reference is a link AND a route) are NOT stated and must be read from the artifact itself.
- **Setting UI design** — Story 1 states "**Setting UI — TBD**". No design exists yet for the Invoice Design pick-list / dialogs / toasts screen.
- **Legacy design** — "the production templates in use before 2026-09-09" / "pre-2026-09-09 production templates". No link; it is the live pre-refresh template set.
- No Figma link is present anywhere in the spec.

### Spec section structure (headings, verbatim)
- (Header table: Epic / Owner / Status / Related / Documents covered)
- **1. Business Case**
- **2. Feature Overview** (sub-blocks: **Core**, **Out of scope**)
- **3. Jobs to be Done** (three JTBD quotes + **Goals**)
- **4. Key Decisions**
- **5. Terminology**
- **6. Assumptions**
- **7. Requirements**
  - Story 1: Choose the invoice design (Prerequisites; Requirements S1-R1..R10; Negative cases S1-N1..N4; Error handling S1-E1)
  - Story 2: Invoice-type documents capture their design when created (Prerequisites; Requirements S2-R1..R6; Edge cases S2-E1..E4)
  - Story 3: Estimate-type documents use the current setting (Prerequisites; Requirements S3-R1..R3; Negative cases S3-N1..N2; Edge cases S3-E1..E3)
  - Story 4: Documents created before this setting existed (Prerequisites; Requirements S4-R1..R5; Negative cases S4-N1..N2; Edge cases S4-E1..E2)
  - Story 5: Every surface renders the document's design (Prerequisites; Requirements S5-R1..R5; Negative cases S5-N1..N2; Edge cases S5-E1..E2)
- **8. Open Questions** (all 5 resolved, table)
- **9. User Feedback Summary** (toasts/dialogs/helper-text table)
- **10. Change Log**

### Documents covered (the 5 refreshed documents — the scope set)
1. Estimate
2. Work Order Invoice
3. Credit Invoice
4. Parts Sale Estimate
5. Parts Sale Invoice

**Type split:** Invoice-type = Work Order Invoice, Credit Invoice, Parts Sale Invoice (capture design at creation). Estimate-type = Estimate, Parts Sale Estimate (live, no capture).

### Inline comments
Five inline comments exist (ids 845348908, 845152262, 845053974, 845381663, 845217798), all by Sasha's/Chris's review, all **open** status. Their content is identical to the five resolved rows in Section 8 (Credit Invoice inheritance, credit vs pre-refresh invoice, standalone/multi credit, customer portal rendering). No footer comments. **No new information beyond the spec body.**

---

## 2 · REQUIREMENTS (exhaustive, grouped by spec section)

> IDs: spec-native ids (S1-R1 …) are kept verbatim. Requirements stated in Feature
> Overview / Key Decisions / Terminology / Assumptions but not carrying a native id
> are given IDs FO-x / KD-x / TM-x / AS-x so nothing is dropped.

### 2.0 — FEATURE OVERVIEW & CROSS-CUTTING RULES (Section 2)

**FO-1** — Verbatim: *"A new organization-level setting lets a shop choose whether its customer documents use the **legacy design** or the **new design**."* Surface: Invoice Settings page. Enumerated design options: {legacy design, new design}.

**FO-2** — Verbatim: *"The setting appears at the top of the Invoice Settings page"*. Surface: Invoice Settings page (Settings → Settings → Invoice). Position: top of page.

**FO-3** — Verbatim: *"One setting for the whole organization. It applies to every location; there is no per-location, per-customer, or per-document choice."* Scope: organization-level, all locations. Branch/negative: no per-location, per-customer, per-document variant.

**FO-4** — Verbatim: *"The setting covers all five documents the refresh restyled: the Estimate, the Work Order Invoice, the Credit Invoice, the Parts Sale Estimate, and the Parts Sale Invoice."* Enumerated set (5 documents) as above.

**FO-5** — Verbatim: *"**Invoice-type documents capture their design when they are created and keep it for life.** Changing the setting afterwards never changes a document that already exists. An invoice reversed and recreated is a new creation and captures the setting in force at that moment."* Branch: capture-at-create; setting change never mutates existing doc; reverse+recreate = new capture.

**FO-6** — Verbatim: *"**Estimate-type documents use the current setting, until their work order is invoiced.** An estimate is a live view of a work order with no creation event, so it renders with whatever the setting says at the time it is viewed, printed, or sent. Once the work order has been invoiced, its estimate matches its invoice instead — switching the Finance tab between the two views never shows two different designs for the same job."* Branch: estimate follows live setting UNTIL WO invoiced → then follows invoice's design. Surface: Finance tab (Invoice view / Estimate view).

**FO-7** — Verbatim: *"Every surface that renders a document honours the design that document carries: the in-app preview, an in-app print or PDF, an emailed PDF, and the customer portal's view and PDF."* Enumerated surfaces: {in-app preview, in-app print/PDF, emailed PDF, customer portal view, customer portal PDF}.

**FO-8** — Verbatim: *"**Pinning the back catalogue is new behavior.** Invoices do not record which design they were issued under today, so a pre-refresh invoice currently reprints in the new design. Story 4 introduces the pinning that stops that."* Note: net-new behavior, not preservation of today's behavior.

**FO-9** — Verbatim: *"The default for every organization — existing and newly created — is the new design. No shop's documents change on the day this ships."* Default = new design (both existing & new orgs).

### 2.1 — KEY DECISIONS (Section 4) — design intent behind requirements

**KD-1** — Verbatim: *"**The default is the new design, for existing and new organizations alike.** Nobody's documents change on the day the setting ships. Shops that reject the new design opt out themselves; shops that are content take no action. Defaulting to legacy would have reversed the documents of every shop that is happy with the refresh."*

**KD-2** — Verbatim: *"**Invoice-type documents capture their design at creation; estimate-type documents do not.** The customer holds an issued copy of an invoice, and the shop's later preference must not change the document already in their hands. An estimate is a live preview of a work order — there is no single issued version to preserve, and pinning one would mean stamping and storing a design for a document that is re-rendered on every view."*

**KD-3** — Verbatim: *"**A Credit Invoice captures the setting at creation, exactly like every other invoice-type document.** It does not inherit the design of an invoice it credits, because a credit does not always have one invoice to inherit from — it can be raised with no invoice at all, and a single credit can cover several. One rule for every invoice-type document, no exceptions. (Chris W., 2026-09-10.)"*

**KD-4** — Verbatim: *"**An estimate for an invoiced work order follows its invoice, not the setting.** Once a work order is invoiced, its estimate and its invoice are two views of the same finished job, reachable from the same Finance tab. Letting the estimate drift to the current setting while the invoice stays on its captured design would put two visual languages one click apart."*

**KD-5** — Verbatim: *"**Documents created before the refresh release (2026-09-09) always use the legacy design**, whatever the setting says. They were produced under the legacy design and their customers hold legacy copies."*

**KD-6** — Verbatim: *"**Documents created between the refresh release and this setting shipping always use the new design**, whatever the setting says. Same reasoning in reverse: those customers hold new-design copies. This is a small, closed cohort that stops growing the moment this ships."*

**KD-7** — Verbatim: *"**Pinning the back catalogue is net-new behavior, not preservation of what happens today.** Invoices carry no record of the design they were issued under, so a pre-refresh invoice reprints in the new design right now. Story 4 is the work that pins them; it should be estimated as new behavior. (Chris W., 2026-09-10.)"*

**KD-8** — Verbatim: *"**All five documents move together.** A shop that rejects the new look rejects it on its estimates too. Reverting only the invoice would send one customer two visual languages for the same job — an estimate in one design, its invoice in the other."*

### 2.2 — TERMINOLOGY (Section 5) — label-bearing definitions

**TM-1 — Legacy design** — Verbatim: *"the appearance ShopView's customer documents had before the Invoice UI Refresh. Still in production today for batch and imported invoices, which the refresh did not cover. **Shown in the Invoice Design setting as Legacy.**"* → UI label in pick list: **"Legacy"**.

**TM-2 — New design** — Verbatim: *"the appearance introduced by the Invoice UI Refresh on 2026-09-09. **Shown in the Invoice Design setting as Modern.**"* → UI label in pick list: **"Modern"**.

**TM-3 — Refresh release** — Verbatim: *"2026-09-09, the date the new design went live. Used throughout as the boundary for which documents were produced under which design."* Boundary date = **2026-09-09**.

**TM-4 — Invoice-type document** — Verbatim: *"the Work Order Invoice, the Credit Invoice, and the Parts Sale Invoice. Each is created as a record at a moment in time and issued to a customer."* Enumerated set (3).

**TM-5 — Credit Invoice** — Verbatim: *"a credit issued to a customer. It may be raised against one invoice, against several at once, or with no originating invoice at all. Because it has no single source document to follow, it captures the design setting at its own creation like any other invoice-type document (S2-R5)."*

**TM-6 — Estimate-type document** — Verbatim: *"the Estimate and the Parts Sale Estimate. Each is a live view of a work order or parts sale, re-rendered on every view, with no creation event of its own. Once its work order has been invoiced, it follows that invoice's design rather than the current setting."* Enumerated set (2).

**TM-7 — Captured design** — Verbatim: *"the design an invoice-type document recorded when it was created, and the design it renders for the rest of its life."*

### 2.3 — ASSUMPTIONS (Section 6)

**AS-1** — Verbatim: *"**The legacy templates for all five documents still exist in production and can still be rendered.** This is likely, since batch and imported invoices were never migrated off them. If the legacy templates for the five refreshed documents were removed as part of the refresh, rebuilding them is substantial work that this spec does not scope, and the size of this build changes considerably. Worth confirming with engineering before estimating."* (A build-feasibility assumption, not a UI behavior — but a test author should know the legacy render path must exist for any Legacy-design case to pass.)

---

### 2.4 — STORY 1: Choose the invoice design (Section 7)

**Story 1 user story (verbatim):** *"As a shop owner or administrator, I want to choose whether my customer documents use the legacy or the new design, so that my shop sends the document my customers expect."*
**Surface:** Invoice Settings page — Settings → Settings → Invoice.
**Prerequisite (verbatim):** *"The user has access to the shop's invoice settings (Settings → Settings → Invoice)."*

**S1-R1** — Verbatim: *"A pick list labeled exactly \"Invoice Design\" appears at the top of the invoice settings page."* Surface: Invoice Settings page (top). UI element: a pick list. Exact label: **"Invoice Design"**.

**S1-R2** — Verbatim: *"The pick list offers exactly two options, labeled exactly \"Modern\" and \"Legacy\". Exactly one is selected at any time."* Enumerated options: {**"Modern"**, **"Legacy"**} — exactly two; exactly one selected always.

**S1-R3** — Verbatim: *"Explanatory text below the setting reads exactly: \"Estimates use the current selection until their work order is invoiced, then match the invoice. Invoices and credit invoices keep the design they had when they were created.\""* UI: static helper text below pick list. Exact string as quoted.

**S1-R4** — Verbatim: *"The setting applies to the entire organization, including every location. It appears once and there is no per-location variant."*

**S1-R5** — Verbatim: *"For every organization existing when this ships, the pick list starts on \"Modern\"."* Default for existing orgs = "Modern".

**S1-R6** — Verbatim: *"For every organization created after this ships, the pick list starts on \"Modern\"."* Default for new orgs = "Modern".

**S1-R7** — Verbatim: *"When the user changes the selection, a confirmation dialog is shown before the change is applied."* Two enumerated dialog variants (both verbatim):
- **Switching to Legacy** — title: **"Switch to the Legacy design?"**; body: **"Every estimate will use the Legacy design straight away. Invoices and credit invoices created from now on will use it too. Documents that already exist keep the design they were created with, and the estimate for a work order that has been invoiced matches its invoice. You can switch back at any time."**; buttons: **"Switch to Legacy"** and **"Cancel"**.
- **Switching to Modern** — title: **"Switch to the Modern design?"**; body: **"Every estimate will use the Modern design straight away. Invoices and credit invoices created from now on will use it too. Documents that already exist keep the design they were created with, and the estimate for a work order that has been invoiced matches its invoice. You can switch back at any time."**; buttons: **"Switch to Modern"** and **"Cancel"**.
(Note the body says "Documents that already exist", not "Invoices that already exist" — changed in Revision 3.)

**S1-R8** — Verbatim: *"On confirming, the change is saved and the user sees a success toast reading exactly: \"Invoice design updated.\" The toast fades on its own."* UI: success toast, exact string **"Invoice design updated."**, auto-fades.

**S1-R9** — Verbatim: *"The change takes effect immediately. The next invoice-type document created, and the next estimate-type document viewed, uses the new selection."*

**S1-R10** — Verbatim: *"The setting can be changed as often as the shop likes, in either direction, with no limit and no cooling-off period."*

**Negative cases:**
- **S1-N1** — Verbatim: *"A user without access to the invoice settings does not see the setting, exactly as they do not see the other settings on that page."* (Permission-gated visibility; no new permission is introduced — see Change Log "no new permission".)
- **S1-N2** — Verbatim: *"If the user cancels the confirmation dialog, the selection reverts to what it was and nothing is saved."*
- **S1-N3** — Verbatim: *"Changing the setting does not alter any invoice-type document that already exists, in any way — not its appearance, its content, or its totals."*
- **S1-N4** — Verbatim: *"Changing the setting does not alter any of the other settings on the invoice settings page. They keep their values and continue to apply to whichever design is selected."*

**Error handling:**
- **S1-E1** — Verbatim: *"If the change cannot be saved, the selection reverts to its previous value and the user sees an alert toast reading exactly: \"Could not update the invoice design. Please try again.\" The alert must be closed explicitly."* UI: alert toast, exact string **"Could not update the invoice design. Please try again."**, must be closed explicitly (does NOT auto-fade), selection reverts.

---

### 2.5 — STORY 2: Invoice-type documents capture their design when created (Section 7)

**Story 2 user story (verbatim):** *"As a shop, I want each invoice to keep the design it was created with, so that the copy my customer holds and the copy I reprint are always the same document."*
**Prerequisites (verbatim):** *"The document is a Work Order Invoice, a Credit Invoice, or a Parts Sale Invoice."* AND *"The document is created on or after the date this setting ships."*

**S2-R1** — Verbatim: *"When an invoice-type document is created, it captures the organization's current \"Invoice Design\" selection."*

**S2-R2** — Verbatim: *"The document renders in its captured design for the rest of its life, on every surface and at every point in its lifecycle — unpaid, partially paid, fully paid, reversed, or voided."* Enumerated lifecycle states: {unpaid, partially paid, fully paid, reversed, voided}.

**S2-R3** — Verbatim: *"Changing the setting after a document is created never changes that document."*

**S2-R4** — Verbatim: *"When an invoice is reversed and a new invoice is later created for the same work order, the new invoice captures the setting in force at the moment it is created — which may differ from the design the reversed invoice carried."*

**S2-R5** — Verbatim: *"A Credit Invoice captures the setting at its own creation, exactly like every other invoice-type document. It never inherits the design of an invoice it credits, whether it was raised against one invoice, several, or none."* Enumerated credit scenarios: {against one invoice, against several, against none}.

**S2-R6** — Verbatim: *"A user cannot change the captured design of an existing document. There is no per-document override."*

**Edge cases:**
- **S2-E1** — Verbatim: *"An invoice created, reversed, and recreated on the same day may end up in a different design from the one the customer first received, if the setting changed in between. This is intended: the recreated invoice is a new document."*
- **S2-E2** — Verbatim: *"A fully paid invoice — which serves as the customer's receipt — renders in its captured design, including its payments and its $0.00 balance."* (UI detail: shows payments and $0.00 balance.)
- **S2-E3** — Verbatim: *"A Credit Invoice raised against an invoice in the other design does not match that invoice. A shop on Modern crediting a legacy-design invoice sends a Modern credit. This is the accepted consequence of S2-R5 and is not a defect."*
- **S2-E4** — Verbatim: *"A Credit Invoice raised with no originating invoice, or covering several invoices at once, captures the current setting like any other — there is no source document it could follow."*

---

### 2.6 — STORY 3: Estimate-type documents use the current setting (Section 7)

**Story 3 user story (verbatim):** *"As a shop, I want my estimates to reflect the design I have chosen right now, so that the choice takes effect on the documents I am about to send."*
**Prerequisite (verbatim):** *"The document is an Estimate or a Parts Sale Estimate."*

**S3-R1** — Verbatim: *"An estimate-type document whose work order or parts sale has not been invoiced renders in whichever design the organization's setting reads at the moment it is viewed, printed, sent, or downloaded. Nothing is captured."* Enumerated render triggers: {viewed, printed, sent, downloaded}.

**S3-R2** — Verbatim: *"Once the work order or parts sale has been invoiced, its estimate renders in the same design as that invoice, whatever the organization's setting reads. Switching the Finance tab between its Invoice and Estimate views therefore shows both documents in the same design."* Surface: Finance tab (Invoice view / Estimate view).

**S3-R3** — Verbatim: *"When the setting changes, every estimate whose work order has not been invoiced renders in the new selection from that moment on — including estimates created long before the change. Estimates are not limited to newly created ones."*

**Negative cases:**
- **S3-N1** — Verbatim: *"A PDF of an estimate that was already downloaded or emailed is a file the recipient holds; it does not change. Only what ShopView renders from this point on follows these rules."*
- **S3-N2** — Verbatim: *"An estimate whose work order has been invoiced does not follow the organization's current setting. It follows its invoice (S3-R2)."*

**Edge cases:**
- **S3-E1** — Verbatim: *"An estimate sent to a customer before its work order was invoiced, and re-sent after the setting changed, reaches the customer in the other design. This is an accepted consequence of estimates being live: a shop that switches design mid-approval may want to note it when re-sending."*
- **S3-E2** — Verbatim: *"If the invoice for a work order is reversed, the work order has no invoice again and its estimate returns to following the current setting, until a new invoice is created."*
- **S3-E3** — Verbatim: *"An estimate created before the refresh release renders in whichever design the setting currently reads, unless its work order has been invoiced. The cohort rules in Story 4 apply to invoice-type documents only, because only those capture a design."*

---

### 2.7 — STORY 4: Documents created before this setting existed (Section 7)

**Story 4 user story (verbatim):** *"As a shop, I want my back catalogue of invoices to look the way it looked when each one was issued, so that every document I reprint matches the copy my customer has on file."*
**Prerequisite (verbatim):** *"The document is an invoice-type document created before this setting shipped."*

**S4-R1** — Verbatim: *"Every invoice-type document created **before the refresh release (2026-09-09)** renders in the legacy design, whatever the organization's setting reads."*

**S4-R2** — Verbatim: *"Every invoice-type document created **on or after the refresh release and before this setting ships** renders in the new design, whatever the organization's setting reads."*

**S4-R3** — Verbatim: *"Both cohorts are fixed. No setting change and no user action alters them."*

**S4-R4** — Verbatim: *"The rules in S4-R1 and S4-R2 apply on every rendering surface listed in Story 5, and govern the estimate view of those work orders under S3-R2."*

**S4-R5** — Verbatim: *"This is new behavior, not preservation of what happens today. Right now an invoice created before the refresh reprints in the new design, because no invoice records which design it was issued under. S4-R1 and S4-R2 must both be built."*

**Negative cases:**
- **S4-N1** — Verbatim: *"Switching the setting to \"Legacy\" does not convert the S4-R2 cohort to the legacy design. Those customers already hold new-design copies."*
- **S4-N2** — Verbatim: *"Switching the setting to \"Modern\" does not convert the S4-R1 cohort to the new design."*

**Edge cases:**
- **S4-E1** — Verbatim: *"An invoice created before the refresh release, reversed, and recreated after this setting ships is a new creation. It captures the current setting under S2-R1 and is no longer part of the S4-R1 cohort."*
- **S4-E2** — Verbatim: *"The S4-R2 cohort is closed: it stops growing the moment this setting ships, and covers only invoices created in the window between the two releases."*

**Three date cohorts implied (for test data seeding):**
1. Created **before 2026-09-09** → always Legacy (S4-R1).
2. Created **on/after 2026-09-09 and before this setting ships** → always Modern (S4-R2), closed cohort.
3. Created **on/after this setting ships** → captures the setting at creation (S2-R1).

---

### 2.8 — STORY 5: Every surface renders the document's design (Section 7)

**Story 5 user story (verbatim):** *"As a shop, I want every place ShopView renders a document to show the design that document carries, so that the copy I reprint and the copy my customer received are the same document."*
**Prerequisite (verbatim):** *"A document exists and has a design determined by Story 2, Story 3, or Story 4."*

**S5-R1** — Verbatim: *"The in-app document preview renders the document's design."* Surface: in-app preview.

**S5-R2** — Verbatim: *"A PDF generated or printed from the shop app renders the document's design."* Surface: shop-app print/PDF.

**S5-R3** — Verbatim: *"A PDF emailed to a customer renders the document's design."* Surface: emailed PDF.

**S5-R4** — Verbatim: *"The customer portal renders the document's design, both on screen and in any PDF the portal generates. The portal shows the same document the shop app does, so it follows whatever design that document carries."* Surface: customer portal on-screen + portal PDF. (NB: Rule 82/03 — portal screens can only be tested on staging, not a QA branch.)

**S5-R5** — Verbatim: *"The paid banner continues to appear only on portal-generated Invoice PDFs, exactly as it does today, and appears in whichever design the invoice carries."* Surface: portal-generated Invoice PDFs only. UI element: the paid banner.

**Negative cases:**
- **S5-N1** — Verbatim: *"Batch invoices and imported invoices are unaffected by the setting. They render their own templates, as they do today."*
- **S5-N2** — Verbatim: *"The standalone portal Payment Receipt is unaffected by the setting."*

**Edge cases:**
- **S5-E1** — Verbatim: *"The Authorizer is not printed on a legacy-design document, because the legacy design has no place for it. It is still selected on the work order and still locked once the work order is invoiced; it simply does not appear on the printed document. If the organization later returns to the new design, Authorizer values recorded during the legacy period print on documents created after the switch."* UI element: the Authorizer field (present on WO, absent on legacy printed doc, present on new-design printed doc).
- **S5-E2** — Verbatim: *"An organization on the legacy design can still hold invoices that render in the new design — the S4-R2 cohort, and any invoice created during an earlier period on the new design. A shop's document list can legitimately contain both designs."*

---

### 2.9 — USER FEEDBACK / STRINGS (Section 9) — consolidated string table (all verbatim)

| Trigger | Kind | Exact string | Behavior |
|---|---|---|---|
| User selects "Legacy" | Confirmation dialog | Title "Switch to the Legacy design?" · Body "Every estimate will use the Legacy design straight away. Invoices and credit invoices created from now on will use it too. Documents that already exist keep the design they were created with, and the estimate for a work order that has been invoiced matches its invoice. You can switch back at any time." · Buttons "Switch to Legacy", "Cancel" | Must be confirmed or cancelled |
| User selects "Modern" | Confirmation dialog | Title "Switch to the Modern design?" · Body "Every estimate will use the Modern design straight away. Invoices and credit invoices created from now on will use it too. Documents that already exist keep the design they were created with, and the estimate for a work order that has been invoiced matches its invoice. You can switch back at any time." · Buttons "Switch to Modern", "Cancel" | Must be confirmed or cancelled |
| Change saved | Success toast | "Invoice design updated." | Fades on its own |
| Change could not be saved | Alert toast | "Could not update the invoice design. Please try again." | Must be closed explicitly; selection reverts |
| Setting helper text (always shown) | Static text | "Estimates use the current selection until their work order is invoiced, then match the invoice. Invoices and credit invoices keep the design they had when they were created." | Static text below the pick list |

---

## 3 · AMBIGUITIES / GAPS (Rule 58 candidates — PO clarification)

**G1 — "The date this setting ships" is undefined.** Requirements S2 prerequisite, S4-R2, S4-E1, S4-E2, S1-R5/R6 all pivot on "the date this setting ships" / "when this ships", but no ship date is given (Status = Draft, all Jira TBD). The S4-R2 cohort (created on/after 2026-09-09 and before the setting ships) cannot be bounded without it. Test author cannot seed the closed-cohort boundary date. *Exact wording:* "created **on or after the refresh release and before this setting ships**".

**G2 — Setting UI design is TBD.** Story 1 says "**Setting UI — TBD**". The exact pick-list control type, placement details, dialog styling, and toast styling have no design artifact. S1-R1..R10 give labels and strings but no visual/layout reference — the "Design Reference is a link AND a route" cannot be satisfied for the setting screen. Cases must be authored PROVISIONAL on UI specifics.

**G3 — Epic and all story Jira keys are TBD.** No traceability anchor (Rule 20/64: every case needs a source). Header "Epic: TBD" and every story "Jira: TBD". A case's provenance line cannot cite a story key. PO/QA lead must supply keys.

**G4 — Assumption AS-1 is unconfirmed and gates the whole build.** Verbatim: "If the legacy templates for the five refreshed documents were removed as part of the refresh, rebuilding them is substantial work that this spec does not scope... Worth confirming with engineering before estimating." If legacy templates do NOT exist/render, every "Legacy" render case is untestable. Must confirm with engineering before authoring Legacy-render cases.

**G5 — Permission model for S1-N1 is implicit.** S1-N1 says a user "without access to the invoice settings does not see the setting, exactly as they do not see the other settings on that page," and the Change Log confirms "no new permission." But it does not state which existing permission/role gates the Invoice Settings page. Test author needs the exact role(s) that can/cannot see it to seed users.

**G6 — "Voided" vs "reversed" vs "reversed and recreated" — lifecycle vocabulary not fully defined.** S2-R2 lists "reversed, or voided" as lifecycle states; S2-R4/S2-E1/S4-E1 discuss "reversed and recreated". The spec does not define what "voided" means operationally in ShopView vs "reversed", nor whether a voided invoice can be recreated. Ambiguous for building the reverse/recreate flows. *Exact wording:* "unpaid, partially paid, fully paid, reversed, or voided".

**G7 — Parts Sale Estimate "invoiced" trigger unclear.** S3-R2 says "Once the work order **or parts sale** has been invoiced, its estimate renders in the same design as that invoice." For a Parts Sale, what constitutes "invoiced" and which document is "that invoice" (the Parts Sale Invoice) is implied but not spelled out — confirm the parts-sale → parts-sale-invoice linkage and where its Finance/estimate view lives.

**G8 — Emailed-PDF design source timing for estimates.** S3-R1 says an estimate renders in the setting at "the moment it is viewed, printed, sent, or downloaded." For an emailed PDF (S5-R3), the design is that of "the document it carries" — but an estimate carries none until invoiced. So an emailed estimate PDF's design = setting at send time; a snapshot the customer holds does not change (S3-N1). This is consistent but the interaction between S5-R3 ("renders the document's design") and S3-R1 (estimate has no captured design) is only reconcilable by reading both — worth a confirmation that "emailed estimate PDF = setting at send-moment".

**G9 — Confluence version integer not retrievable via the tool used.** Not a spec-content gap, but flagged for Rule 31/100: the exact version number/Last-Updated timestamp must be confirmed from the page history if a precise provenance stamp is required. Latest logged revision is Revision 3, 2026-09-10.

**G10 — No internal contradiction found, but note the Revision-2 fix.** The Change Log records that S1-R3 helper text previously contradicted the invoiced-estimate rule and was corrected in Revision 2; and Revision 3 restored the credit clause dropped in Revisions 1–2. The current body appears internally consistent (helper text, both dialog bodies, and User Feedback Summary all now carry the credit clause and the "match the invoice" clause). Test author should verify the LIVE build strings match the *current* (Revision 3) strings, not any earlier cached copy.

---

## 4 · NON-UI / OUT-OF-SCOPE / DEFERRED

**Out of scope (Section 2 "Out of scope", verbatim):**
- **OOS-1 — Batch invoices and imported invoices.** *"These never received the new design (deferred under SV-9193) and are unaffected by this setting; they continue to render their own templates."* (Also S5-N1.)
- **OOS-2 — The standalone portal Payment Receipt.** *"Out of scope in the refresh, out of scope here."* (Also S5-N2.)
- **OOS-3 — Per-location, per-customer, or per-document selection.** *"One choice per organization."*
- **OOS-4 — Any change to the content, wording, or calculations of either design.** *"This spec selects between two designs that already exist; it does not modify either one. Defects in the new design are fixed on their own tickets."*
- **OOS-5 — Further invoice customization** *"— layout control, column structure, logo sizing, and the rest of the customization roadmap this setting is the first step of."*

**Backend / non-directly-observable (test via UI consequence, not directly):**
- The design **capture / pinning storage** on invoice-type documents (FO-5, S2-R1, S4-R5) is a data-layer behavior. Observable only through render output on the surfaces (Story 5). S4-R5 explicitly states this pinning is net-new and "must both be built" — so it is not observable in the current build until built.
- The **default-value seeding** (S1-R5/R6: existing and new orgs start on "Modern") is a data/migration behavior, observable via the pick-list initial state.

**Deferred / dependency notes:**
- **SV-9193** — batch/imported invoices' new design was deferred (dependency context, not in this scope).
- **SV-9870** — the 45%-more-paper regression is ticketed separately (motivating context; not fixed here — OOS-4 says defects in the new design are fixed on their own tickets).
- **AS-1 (Assumptions)** — legacy templates must still exist/render; unconfirmed with engineering; if false, build size changes materially (also G4).

---

## COUNT

**Native spec requirement/case ids: 62.** Story 1: R1–R10 (10) + N1–N4 (4) + E1 (1) = 15. Story 2: R1–R6 (6) + E1–E4 (4) = 10. Story 3: R1–R3 (3) + N1–N2 (2) + E1–E3 (3) = 8. Story 4: R1–R5 (5) + N1–N2 (2) + E1–E2 (2) = 9. Story 5: R1–R5 (5) + N1–N2 (2) + E1–E2 (2) = 9. Plus 5 User-Feedback string rows (Section 9). = 15+10+8+9+9 = 51 story-level ids, +5 string rows = 56, +5 open-question resolutions (Section 8, informational) = 61… (see below for the authoritative testable count).

**Testable requirement count for suite authoring: 51 native story-level requirements/cases** (S1: 15, S2: 10, S3: 8, S4: 9, S5: 9), **PLUS 9 cross-cutting rules** captured from Feature Overview (FO-1…FO-9) that are not separately id'd in the stories but must each be covered, **PLUS the 5 UI-string rows** (Section 9) — several of which map onto S1-R3/R7/R8/E1 but include the exact verbatim strings a case must assert. Terminology (TM-1…TM-7) and Key Decisions (KD-1…KD-8) are design-intent/label sources, not independently testable, but TM-1/TM-2 pin the exact pick-list labels ("Legacy"/"Modern").
