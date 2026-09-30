# Part Sales Update v1 — verbatim source copy

Source: Confluence page **867434569** "Part Sales Update v1" (space ~Chris Ward), last modified
2026-09-28, read 2026-09-30. Epic: **SV-9667** (Founder Mode Batch #1). Design canvas:
https://claude.ai/artifact/JRh7EY87SWcHC9i3sm85K9 . Status: Ready for dev - 2026-09-22.

---

## 1. Business Case

A part sale is the counter transaction: somebody walks in or phones in, buys parts, pays and leaves. Underneath it is the same object as a work order, but the screen a parts person works on has been treated as the poor relation for years, and the gaps are not cosmetic.

A core received on a part sale bills the customer immediately, with nobody ever asked whether the old unit came back over the counter; on a work order the same core waits for an answer. Tax cannot be changed at all, so a sale that crosses a jurisdiction has to be rebuilt elsewhere or invoiced wrong. There is no log, so when a number changes nobody can say who changed it. There is no sales representative, so counter sales never reach the reporting a shop pays people from. And a part sale cannot take a deposit, which is the ordinary way a counter handles a special-order part.

Every one of these is something a work order already does. The parts person is not asking for new capability so much as asking to stop being the only person in the building who cannot do their job on their own screen.

## 2. Feature Overview

**Core ShopView**

- A core on a part sale is charged to the customer from the moment the part is quoted, which is the ordinary outcome at a counter: the estimate assumes the customer keeps the old unit until proven otherwise. The row offers one action, **Return Core**, for the case where the customer brought the old unit back.
- Returning a core does not make the charge disappear. The charge stays and a second row, **Core credit**, credits it, so the customer can see they were charged for the core and then credited for bringing it back.
- Tax can be changed on the part sale Financial Info card, and locks once the sale is invoiced.
- The part sale carries an audit log, reached from its own menu, which is reordered so that Delete is no longer the first item - and a completed part sale can now actually be deleted.
- A part sale can be attributed to a Sales Representative.
- The Actions column reads down a single line: the primary action on the left, the utility icons on the right.
- The part sale tab bar reads Parts, Notes, Stats, Finance, in the order a work order uses.
- A part sale can take a deposit from its Finance tab before it is invoiced, either recorded in ShopView or collected through the Customer Portal.

**Customer Portal**

- The Create Deposit dialog asks the Customer Portal whether it can take the payment for this part sale, and offers the handoff only when the portal says yes. ShopView holds no separate opinion: the portal owns the connected accounts, the document lookup and the rules.
- When the portal declines, the action stays visible but disabled and shows the portal's own reason, so the counter can see the path exists and read why it is closed.

**QuickBooks**

- Nothing about the integration changes. A part sale invoice already syncs, and a deposit taken on a part sale syncs exactly as a deposit on a work order does: as an unapplied payment, behind the same one-time bookkeeping consent, and applied when the invoice is created.
- The standing constraint is unchanged: QuickBooks' own **Automatically Apply Credits/Payments** setting must be off, or deposits and credits are allocated twice.
- A sync that fails does so quietly and lands in the Unexported report, as today.

**Permissions and enforcement**

- Every action below is offered on screen to a user holding **Part Sales → Create & Edit** unless its story says otherwise. That is what a story means when it lists the permission as a prerequisite.
- The server enforces the work-order edit permission, not a part-sale-only one. **Part Sales → Create & Edit** grants it and so does **Work Orders → Create & Edit**, so a user holding either is allowed through when the request reaches the server. This project does not tighten the server to the part sales permission.
- No permission a user holds today is narrowed by this project. The server enforces the work-order permission on a part sale's tax, sales representative and deposit changes today, and it continues to grant them after the release. Nothing that is allowed today is refused afterwards.
- Adding a deposit also requires **Invoicing & Payments → Create & Edit**, exactly as it does on a work order. That requirement is unchanged.
- Returning a core, and cancelling that return, are also available to a user holding vendor or work-order part permissions. Those are the same controls a work order uses and they are deliberately not re-gated here.
- The part sale log is read through a part-sale-only address that refuses anything which is not a part sale, so parts staff never gain sight of a service work order's log.

**Form factor**

- **Desktop first, usable to tablet width.** The parts counter is a desk and this is a detailed grid, so no phone layout is owed. The Return Core action and the Actions column must stay usable at tablet width, because counter staff do carry one.

**Out of scope**

- Any change to a service work order. Every behavior in this document is reached only from a part sale.
- Core handling on a service work order, which keeps its existing controls on the Lines tab.
- The Customer Portal's own part-sale eligibility, which is tracked separately and is what currently keeps the portal handoff closed for a part sale.

## 3. Jobs to be Done

- **When** a customer brings a core back over the counter, **I want to** say so on the sale, **so I can** take the charge off before they pay.
- **When** I am selling parts across a jurisdiction line, **I want to** set the tax on the sale itself, **so I can** invoice it correctly the first time.
- **When** a number on a part sale is not what I expect, **I want to** see who changed it and when, **so I can** settle it without guessing.
- **When** a customer orders a part that has to be paid for up front, **I want to** take a deposit on the sale, **so I can** order it.
- **When** I run the counter, **I want** my sales attributed to me, **so I can** be paid for them.

**Goals**

- Stop billing customers for cores nobody asked about.
- Remove the reasons a parts person has to leave their own screen to finish a sale.
- Make every money-moving action on a part sale traceable to a person.

## 4. Key Decisions

The rule these were decided against: **a part sale behaves as a work order does**, and a divergence needs a reason from the part sale's own shape rather than a preference.

- **A deposit is never gated on a core.** Money taken up front has nothing to do with whether the old pump came back. Unchanged by the 18 September rework, and now trivially true because a core is never unanswered. **Rejected:** gating deposits on the same answer, which would stop a counter taking money it is entitled to take.
- **A part sale whose lines are all declined keeps its deposit.** The status is derived rather than set: a sale reads Declined only when every line on it is declined. The held deposit already blocks deleting the sale and changing its customer, so the money cannot be lost track of. **Rejected:** blocking the decline, and prompting for what to do with the deposit - both invent a part-sale-only rule for something the work order does not do either.
- **Release day changes nothing for a sale that already exists.** A sale that already charged a core keeps it, unchanged. An open sale started BEFORE the release also keeps what it was quoting: charging its core from the quote would raise a number a shop has already put in front of a customer. Only sales started on or after the release charge the core early (S1-R21). An invoiced or paid sale prints from the rows already written to it, so no document that has been issued changes, and no migration runs. **Rejected:** applying it to every open sale - a new default is not allowed to change what existing customers already see. The cost of the alternative is accepted with eyes open: for a while two sales at one counter follow different rules, and the Started date is what tells them apart.
- **A part sale with no sales representative is attributed to the customer's rep.** Exactly as a work order is. **Rejected:** treating unset as Unassigned on a part sale only, and pre-filling the rep with whoever creates the sale - a rep is an attribute of the customer relationship, not a record of who typed.
- **Returning a core and changing the sales representative are both written to the log.** Returning a core, or cancelling that return, adds or removes a credit, so it is the one action in this work that moves money and it cannot be the one action nobody can trace. Both entries appear on service work orders too; that is additive and changes no behavior. **Rejected:** matching the work order by logging neither, which keeps a money action untraceable on both objects.
- **A core with no vendor can still be returned.** Its return lands in the Returns list with no vendor assigned, as any vendorless return does today. **Rejected:** requiring a vendor first - the return is created by shared behavior, so the requirement would land on service work orders as well.
- **The Customer Portal decides whether a deposit can be collected in it.** ShopView asks before offering the handoff and hides nothing behind a guess of its own. A portal that cannot answer is treated as a refusal, so staff are never sent into a checkout that cannot complete. **Rejected:** keeping ShopView's own blanket refusal of a part-sale portal deposit, which duplicated a rule ShopView does not own and would drift from it.
- **A core is billed by default, and returning one is a deliberate action.** Ok / Not Ok is a technician's question: they removed the old unit and can say whether it is any good. The person at a counter is not replacing anything, so there is no judgement for them to make and forcing one every time is friction carrying no information. The charge stands unless somebody returns the core. **Rejected:** keeping the two answers for consistency with the work order - it is consistency of mechanism over consistency of meaning, and the meaning is what differs. *Raised by the CEO, 2026-09-18.*
- **A returned core credits itself on the document rather than vanishing.** The charge stays and a Core credit row offsets it. A customer who brings a core back should be able to see both halves of that on their copy, and a charge that silently disappears is a number nobody can check. It is built as an **ordinary part row carrying a negative sell price**, on the row the pricing engine already emits for every return, so it reaches the invoice, the printed copy and QuickBooks through the same path every other part row uses. It is deliberately **not** the pricing engine's PART_TYPE_RETURN row: that type is excluded from every parts total by design, so it can hold a description but never money. The first build of this used it and the credit was rendered nowhere and subtracted from nothing (corrected 2026-09-21, found by rendering the document rather than reading the code). **Rejected:** a discount adjustment, which would have made the action depend on a QuickBooks item mapping the shop may not have done; and removing the charge quietly, which is what it did before. *Raised by the CEO, 2026-09-18.*
- **Returning a core moves no stock.** **Return Core** leaves the core charge in place, adds a **Core credit** row that offsets it, and creates a return in the Returns list; the stock movement and the vendor credit happen afterwards, through the returns workflow that already exists. **Rejected:** restocking at the moment of the return - the returns workflow already reduces stock when a return is saved, so the part would be counted twice.
- **The design canvas' before boards hold for production.** They were captured from staging, which is 1,226 commits ahead of production. The files behind all eight boards were compared between the two: two are identical, and in the other six every difference is behavioral rather than visible - none of them changes what the boards depict. **Rejected:** recapturing from production anyway, which would cost a day to produce the same eight pictures.
- **The core row keeps the word Returned.** It is the word a work order already shows for the same fact, on shared code with no part-sale branch, and the governing rule is to match the work order. The ambiguity is real and is recorded in Terminology instead: to the counter it means the customer handed the unit back, and the vendor side has not happened yet. **Rejected:** renaming it on the part sale only, which would put two words on one fact and make the shared row read differently depending on which screen it is on.
- **Returning a core keeps the work order's permission, not the part sales one.** The control is shared and already open to vendor, work-order-part and work-order-edit holders; this project did not touch that gate. A part sales user reaches it because their bundle grants the third. **Rejected:** narrowing the part sale path to the part sales permission alone - the gate is one piece of shared code, so narrowing it would change who can answer a core on a work order too.
- **The two new log entries are not backfilled.** A core returned before this ships, and every sales rep change ever made, have no entry; the entries start from release. This is the same call as leaving already-charged cores alone. **Rejected:** reconstructing entries from the existing return records - it would invent a time and an actor for something nobody recorded, which is worse than an honest absence in a log.
- **Only the Customer Portal decides which location a deposit charges.** It charges the account of the location that owns the sale rather than the one the user has selected, and ShopView asserts nothing of its own. **Rejected:** asserting it in ShopView as well - two owners of one rule is how the two drift apart, which is the same reasoning that removed our duplicate opinion about whether a part sale can collect at all.

## 5. Terminology

- **Answered / unanswered core** - a core is answered when somebody has said Ok or Not Ok to it. It says nothing about whether the core has gone back to the vendor. On a part sale the pair no longer applies: nobody is asked, the core is charged, and **Return Core** is the only move. The terms are kept here because a service work order still uses them and the two screens are compared throughout this document.
- **Returned** - the badge a core row shows after **Return Core** on a part sale, or after **Ok** on a service work order. It means the customer brought the old unit back over the counter. It does *not* mean the core has been returned to the vendor or that a credit has been claimed; that is a later, separate step in the Returns list.
- **Part sale** - the counter transaction. Where this document says a behavior is part-sale only, it means it is not reachable from a service work order.

> *\* Context note: "Return" carries two meanings in a shop: to the counter it means the customer handed something back, to a parts manager it means the part went back to the vendor. The badge uses the counter's meaning because that is what the person answering the core just did.*

## 6. Assumptions

- **Cores are a minority of part sales.** In the reference organization, 9 of 165 part sales carry a core at all, and 5 of the 40 uninvoiced ones hold a core that was charged under the old behavior. *Verify:* the same counts against a production organization.
- **A part sale spends its life at Complete.** Receiving its parts takes it straight there, and it waits there to be invoiced. Every status window in this document is built on that. *Verify:* the status distribution of part sales in a production organization.

## 7. Open Questions

- When will the Customer Portal accept a deposit on a part sale? It currently declines one, so the handoff is visible but disabled. The answer is written when the portal work itself is built, not before. - **Owner:** engineering, on SV-10261. **Blocks:** S8-R8 to S8-R11 only; the rest of Story 8 ships without it.

## 8. Requirements

Every story below is reachable only from a part sale. No behavior on a service work order changes.

### Story 1: Return a core on a part sale — Jira SV-10262

**As a** parts person, **I want** to give the customer their core charge back when they bring the old unit in **so that** the sale shows both the charge and the credit

**Prerequisites**

- The part sale is not invoiced or paid. Like the two below, this gates **Return Core** and **Cancel Return** only. The core charge itself (S1-R1, S1-R13) has no prerequisite beyond a part carrying a core charge
- The line carries a core charge
- A special-order core has been received, or an inventory core has been picked. This is a prerequisite for **Return Core** only: the charge itself applies from the moment the core is quoted
- User holds one of the permissions that already offer Return Core on a work order: Vendors → Create & Edit, Work Order Parts → Create, or Work Orders → Create & Edit. A user with Part Sales → Create & Edit reaches it through the last one. The control is shared with work orders (see the Key Decision on core permission), so nobody who can use it today loses it.

**Requirements**

- S1-R1: A part sale charges its core to the customer **from the moment the part is quoted**. Nobody is asked anything. The estimate assumes the customer keeps the old unit until proven otherwise, so the charge is on the document before the part is received and stays on it after receipt.
- S1-R13: On a part sale started on or after the release (S1-R21), before the part is received, the core prints on the estimate as its own row directly beneath the part it belongs to, labeled **Core charge**, at the core charge amount, and it counts toward the parts total, the tax base and the sale total exactly as it does after receipt. A $517.55 part carrying a $79.99 core reads $517.55 then $79.99, and totals $597.54 of parts, $29.88 of GST at 5 percent and $627.42.
- S1-R2: The core row offers one action, **Return Core**, in the same cell every other primary action on that row uses.
- S1-R3: **Return Core** means the customer brought the old unit back. The core charge **stays on the sale** and a second row, **Core credit**, credits the same amount against it. The row reads **Returned** and a return is created in the Returns list.
- S1-R11: On the customer document the core row is labeled **Core charge** and its credit **Core credit**. Both print as **children of the part they belong to**, indented beneath it behind the same ↳ the fees and discounts rows already use, in that order, and neither repeats the part number the row above already shows. The credit prints as a negative amount: a $79.99 core returned reads **-$79.99**, which is how a credit memo already shows a credit. A part sale with a $517.55 part and a $79.99 core reads $517.55, then ↳ $79.99, then ↳ -$79.99, and totals $517.55 of parts, $25.88 of GST at 5 percent and $543.43.
- S1-R21: **Only sales started on or after the release charge a core from the quote.** A part sale started before the release keeps the total it was quoted at: its core appears when the part is received, exactly as it does today. A part sale started on or after the release shows the core from the moment it is quoted. What decides is when the sale was created: every part sale created from the release onward is marked as such when it is created, and no sale that existed before the release is. There is nothing to configure and no date setting to check. A sale split from another sale follows the sale it was split from, not when it was itself created. A split never changes whether a line's core is charged from the quote. Move Part works the same way between part sales: a moved line keeps the core treatment of the part sale it came from, whichever part sale it lands on, so moving a line never adds or removes a core charge. A move onto a service work order follows S1-R25.
- S1-R25: **Moving a charged core onto a service work order.** When Move Part takes a part with a charged core from a part sale onto a service work order, the core arrives unanswered, so the technician is asked Ok / Not Ok exactly as on any other work order core. This applies only to a move from a part sale onto a service work order; it is the same result a split already gives.
- S1-R17: **QuickBooks.** The **Core credit** row syncs as an ordinary negative invoice line: the same product and service mapping and the same class as the part row above it, a unit price and amount of -$79.99 on a $79.99 core, and the same parts tax treatment. It is a negative line on the invoice, not a QuickBooks credit memo, so it reduces the same revenue the part row increases. Only fee and discount rows are held back from the sync; a core row is a part row and is not.
- S1-R19: **Reversal.** Reversing a part sale invoice deletes the invoice and its customer transaction, and the sale returns to the rows it was carrying: the core charge stands and, if the return still stands, so does its credit. The **Core credit** row does not block the reversal, because reversal is refused only when a payment is applied. It is a row on the document, not a customer credit.
- S1-R20: **Where the treatment appears.** The parent and child rendering and the negative amount reach every surface the part sale document is produced on: the estimate and invoice previews on the Finance tab, the emailed or downloaded PDF, the batch print run, the Customer Portal copy, and any later reprint, in both the current and the legacy document designs. There is no surface where a core prints flat.
- S1-R16: The figures a part sale reports move with the charge. The Stats tab, the sales report and the financial snapshot taken at invoice all read the same requested-parts value the Financial Info card does, so from release day an open part sale holding a core it has not received reports that core as well as showing it. Nothing historical is recalculated and no figure already reported changes.
- S1-R14: The child rows keep a part row's size and weight rather than an adjustment row's. A fee or discount row is informational and prints smaller and greyer because the total already reflects it; a core charge is money in the total and reads like the part above it.
- S1-R22: The parent and child rendering is the customer document only. On the parts grid the core stays its own row alongside the part, as it is today. The **Core credit** row is not drawn on the grid at all; once the core has been returned, the grid's core row carries the **Returned** badge and nothing else changes there. The grid has no totals row, so there is no figure on it to reconcile against the document. The grid is where the counter works all day and it is out of scope for this project; the document is what the customer reads, and that is where the relationship needed drawing.
- S1-R23: **A fee or discount on a returned core.** While the core is charged, a per-item fee or discount on it applies as it does today. Once the core is returned, that fee or discount nets to $0, so a flat fee is not counted twice and a percentage one is not canceled out by the Core credit row. Cancel Return brings it back. This is what a service work order does to a fee on a core answered Ok.
- S1-R24: **Receiving a part-sale core from the vendor.** When a special-order part from a part sale is received, the Receive parts dialog tags its core **Charged**, with the hover text "Charged to the customer until the core is returned." A service work order keeps its tags, **OK · returned** and **Not OK · charged**, unchanged.
- S1-R26: **Returns count.** The returns count on the part sale list does not count Core credit rows, so it matches the grid, where a returned core keeps its full quantity with the Returned badge (S1-R22).
- S1-R12: The label is a document label only. The core part keeps its own stored description (*Core for \<part\>*), which the parts grid, inventory and QuickBooks continue to use. Because the label is applied when the document renders, a reprint of an older document also reads Core charge; no amount changes.
- S1-R4: If the customer never returns the core, nothing else happens. The core charge stays on the sale, no credit row is added, and nothing is left waiting for an answer.
- S1-R5: After a return, the row menu offers **Cancel Return**, which removes the credit row and leaves the core **charged** again, on exactly the total the sale carried before the return. It does not return the core to an unanswered state, because on a part sale there is no question to return to.
- S1-R5a: **Cancel Return** is never refused and shows no error or warning, even when the return has already been worked in the Returns list. Like a work order, it first asks for confirmation: "This will put that part back onto the part sale." with a **Put Back** button. Nothing changes unless the user confirms. If none of the returned quantity has been credited by the vendor or returned to inventory, the return is deleted. If any of it has, the return is kept and its quantity is reduced to the quantity already settled, so a vendor credit is never left without a return behind it. In both cases the credit row is removed and the core charge is restored. This is exactly what Cancel Return does on a service work order.
- S1-R6: The credit equals the core charge exactly, including its tax, so returning a core leaves the sale total and the tax base where they started.
- S1-R7: Both the return and any later cancellation are recorded in the part sale log, with who did it and when.
- S1-R8: Returning a core changes no inventory quantity. It creates the return and the credit row; stock moves later, when that return is worked in the Returns list.
- S1-R9: The return is not itself a vendor credit. A vendor credit exists once the return is posted with its credit memo number, which is the existing returns workflow and is unchanged by this feature. The credit row on the sale is the CUSTOMER's, and is a separate thing.
- S1-R10: A return covers the whole quantity of a core. A core for three units returns once, for all three; there is no way to return two and keep one. The established way to handle a genuine partial is to return the whole quantity and then split.

> *\* Context note on credit limit and credit hold: charging the core earlier changes neither. Credit hold is a credit term on the customer and is read as a flag. The stored credit limit is shown but never compared against a sale total anywhere in ShopView, so a bigger pre-receipt total cannot trip a hold that a smaller one would not.*

**Negative cases**

- S1-N1: Before the core is received or picked, **Return Core** is not offered and the core row carries no action, because there is nothing yet to bring back. The charge itself is already on the estimate (S1-R13).
- S1-N9: A part sale can never reach an invoice while a part is still unreceived, so the pre-receipt core charge never leaves the estimate. Invoicing refuses anything that is not Complete, and a part sale reaches Complete only when none of its parts is still quoted, requested, authorized to order, in stock or awaiting receipt. QuickBooks therefore sees the same received core row it has always seen; an estimate does not sync.
- S1-N8: A core charge of zero cannot be created or left behind. The server refuses one with "Core Charge must be greater than 0", and a part carrying no core charge has no core row at all, so a $0.00 core can never print. Removing a core a parts person added by mistake means removing the part and adding it again, which is the behavior the product had before this project; what changes is that the mistake is now visible on the estimate rather than only after receipt.
- S1-N7: The only thing that keeps a core off a part sale estimate is a stored answer that the old unit is coming back. A part sale offers no way to give that answer, so in practice every core on a part sale is charged until it is returned.
- S1-N2: A user who holds none of the permissions above sees the core row and its charge, but is offered neither Return Core nor Cancel Return.
- S1-N3: Once the part sale is invoiced or paid, neither action is offered.
- S1-N4: No data is migrated and no amount already billed is rewritten. A sale that has already charged its core keeps exactly the charge it had, and an invoiced or paid sale prints exactly the rows it was issued with. Nothing an existing sale shows changes on release day: a sale started before the release keeps quoting the way it did (S1-R21). The new behavior reaches sales started from the release onwards.
- S1-N5: Not applicable. **See Financial Data** gates the whole part sale screen, so a user without it never reaches the parts grid and never sees a core row. This project does not open part sales to those users.
- S1-N6: Returning a core writes nothing to the inventory part's own history. The record lives in the part sale log.
- S1-N10: The core amount quoted on the estimate comes from the pricing rules, while picking an inventory core bills that core's own price. When the two differ, the sale total changes at the moment the core is picked, exactly as it does today. The estimate figure is indicative and the picked inventory core's price is what is billed; neither price is made to win over the other.

**Edge cases**

- S1-E1: If two people return the same core at once, the second is refused with "Core has already been actioned. Please refresh and try again."
- S1-E2: If the core carries no vendor, the return is still created and lands in the Returns list with no vendor assigned.
- S1-E3: If a deposit has already been taken and returning a core drops the sale total below the deposit, the surplus becomes a customer credit when the sale is invoiced. No money is lost and nothing is refused.
- S1-E4: If a core is returned, the vendor settles part of that return, the return is canceled (S1-R5a keeps the settled quantity) and the core is then returned again, the Returns list shows two returns for it: the kept, settled one and a new return for the full quantity. This matches a service work order.

> *\* Context note: S1-R1 and S1-R13 are the point of the story. Today the customer is charged the moment the core is RECEIVED and never before, so the estimate quotes a total the invoice then exceeds, and there is no way to hand the charge back when the old unit comes in.*

### Story 3: Change the tax on a part sale — Jira SV-10264

**As a** parts person, **I want** to set the tax rate on the sale **so that** a sale delivered across a jurisdiction line is invoiced correctly

**Prerequisites**

- The part sale is not invoiced or paid
- User must have 'Part Sales → Create & Edit' enabled

**Requirements**

- S3-R1: The Financial Info card on a part sale offers **Edit tax rate**.
- S3-R2: It opens the same tax picker a work order uses, listing the shop's own rates.
- S3-R3: Saving recalculates the sale total immediately.
- S3-R4: The change is recorded in the part sale log.
- S3-R5: Because tax locks at invoicing, a rate change can never alter an invoice that already exists, and the Sales Tax report is never restated for a past period.

**Negative cases**

- S3-N1: Once the part sale is invoiced or paid, the card is read-only and the action is not offered.
- S3-N2: A user without the permission above does not see the action.

### Story 4: Read the part sale log, and a menu that stops putting Delete first — Jira SV-10265

**As a** parts manager, **I want** to see who changed what on a part sale **so that** I can settle a question about a number without guessing

**Prerequisites**

- User must have 'Part Sales → Create & Edit' enabled - the same shape the work order log uses, where the log is offered to someone who can edit the object

**Requirements**

- S4-R1: The part sale menu offers **Audit Log**, opening a searchable dialog titled **Part Sale Log**.
- S4-R2: The log shows who did what, on which line, and when - the same entries the work order log shows, for this sale.
- S4-R3: The menu order is **Audit Log**, **Add Parts Sale Fee / Discount**, **Set Status**, **Delete Part Sale**.
- S4-R4: **Delete Part Sale** is last and is no longer shown in red, matching the work order menu.
- S4-R5: A part sale can be deleted while it is **Complete**. Complete means something different on a part sale - it is reached the moment the parts are received, and the sale then waits there to be invoiced - so refusing to delete a Complete document made every received part sale permanently undeletable.
- S4-R6: The first entry on every part sale is **Created**, whether the sale was started from the Part Sales screen or produced by a split.
- S4-R7: Splitting a part sale writes a matched pair: the new part sale records **Split from** and the sale the parts came from records **Split to**. Each entry names the other part sale by its number and links to it.

**Negative cases**

- S4-N1: A user who cannot edit part sales is not offered the log, and is refused if they reach its address directly.
- S4-N2: The log never shows entries from another part sale or from a service work order.
- S4-N3: A part sale holding received parts still cannot be deleted. It is refused with "Part sale cannot be deleted because it has received parts. Please return or reassign all received parts before deleting." That rule is unchanged; it was simply unreachable behind the Complete check.
- S4-N4: A service work order is unchanged. A Complete one still cannot be deleted.
- S4-N5: Nothing is backfilled. A part sale started before the release has no **Created** entry, and a split made before the release has no **Split from** or **Split to** pair.
- S4-N6: A service work order's log is unchanged. Its **Split from** and **Split to** entries read exactly as they did, without a linked number.

> *\* Context note: The two middle items keep the positions they already had. Delete sitting first was the problem, not their order.*

### Story 5: Attribute a part sale to a sales representative — Jira SV-10266

**As a** shop owner, **I want** counter sales credited to the person who made them **so that** I can pay people for the business they bring in

**Prerequisites**

- The part sale is not invoiced or paid
- User must have 'Part Sales → Create & Edit' enabled

**Requirements**

- S5-R1: The part sale header card carries a **Sales Representative** field.
- S5-R2: It offers the shop's active sales representatives, and can be cleared.
- S5-R3: The choice is captured on the invoice when the sale is invoiced, and the sale appears in Sales By Representative under that person.
- S5-R4: The change is recorded in the part sale log, showing the previous and the new name.

**Negative cases**

- S5-N1: If no representative is set on the sale, the invoice is attributed to the customer's assigned representative, exactly as a work order is.
- S5-N2: If neither is set, the sale appears as Unassigned.
- S5-N3: Once the sale is invoiced or paid the field is read-only, and the attribution captured at invoicing does not change afterwards.
- S5-N4: A staff member who is not marked as a sales representative cannot be selected.

### Story 6: Read the Actions column down one line — Jira SV-10267

**As a** parts person, **I want** the action buttons to line up under their heading **so that** I can work down a long sale without hunting for the button

**Prerequisites**

- The user is looking at a part sale

**Requirements**

- S6-R1: The Actions column shows the primary action for the row - **Order**, **Receive**, **Pick**, or **Return Core** on a core row - aligned under the **Actions** heading.
- S6-R2: The utility icons and the row menu sit in their own column, pinned to the right.
- S6-R3: The heading stays in the same place whatever the length of the button label beneath it.

**Negative cases**

- S6-N1: A service work order's parts grid is unchanged in every respect.
- S6-N2: A row with no primary action leaves that cell empty rather than shifting the icons left.

### Story 7: Call a part sale a part sale — Jira SV-10268

**As a** parts person, **I want** the menu to name the thing I am looking at **so that** I am not asked to split an "order" on a screen titled Part Sale

**Prerequisites**

- The user has selected one or more lines on a part sale
- User must have 'Part Sales → Create & Edit' enabled

**Requirements**

- S7-R1: The bulk menu reads **Split Part Sale**, not "Split parts order".
- S7-R2: The bulk menu reads **Move Part**, not "Move part".
- S7-R3: The row menu entry reads **Set Status**.
- S7-R4: Both bulk items are capitalized the way every other menu on the screen is.
- S7-R5: The part sale tab bar reads **Parts, Notes, Stats, Finance**, in that order, which is the order and the wording a work order uses. **Stats** is the label; Statistics is retired.
- S7-R6: Labels and order only. The tabs themselves, their addresses and what each one shows are unchanged, and the parts count still prints beside Parts.

**Negative cases**

- S7-N1: The wording on a service work order is unchanged.
- S7-N2: What the actions do is unchanged; only their labels move.
- S7-N3: Splitting a part sale does not move a deposit. The deposit stays with the original sale, as it does when a work order is split.
- S7-N4: A split moves each selected line together with its parts and returns, so a core and its charge travel with the line they sit on and are returned, if they are returned at all, on whichever sale that line ends up in. A sale that has already been invoiced cannot be split.
- S7-N5: The **Notes** tab on a part sale is delivered by the Notifications Center project, not by this one. Where it is present it sits second, directly after Parts; until it ships the bar reads Parts, Stats, Finance.
- S7-N6: The work order tab bar is unchanged. It already reads Lines, Parts, Notes, Timesheets, History, Stats, Finance, and Stats is the wording this story adopts.

### Story 8: Take a deposit on a part sale — Jira SV-10269

**As a** parts person, **I want** to take money up front on a counter sale **so that** I can order a special part that has to be paid for before it is ordered

**Prerequisites**

- The part sale status is Estimate, Approved or Complete
- User must have 'Part Sales → Create & Edit' enabled
- User must also have 'Invoicing & Payments → Create & Edit' enabled, exactly as on a work order
- For the portal handoff only: the shop takes online payments, and the Customer Portal confirms it can collect for this sale

**Requirements**

- S8-R1: The part sale Finance tab offers **Add Deposit**.
- S8-R2: The dialog is the one a work order uses, worded for a part sale, and the memo pre-fills with "Deposit for Part Sale" and the sale number.
- S8-R3: A deposit can be added while the sale is Estimate, Approved or Complete.
- S8-R4: The deposit shows in the sale's payment history immediately.
- S8-R5: When the sale is invoiced, the deposit is applied to the invoice automatically.
- S8-R6: A deposit is never gated on a core; it can be added whatever state the cores on the sale are in.
- S8-R7: **Record Deposit** captures a deposit taken by any of the shop's own methods, exactly as it does on a work order.
- S8-R8: **Collect in Portal** hands the customer to the Customer Portal to pay, on a card reader or online, on whatever device is already open.
- S8-R9: ShopView asks the Customer Portal whether it can collect for this sale before offering the handoff, and offers it only on a yes.
- S8-R10: When the portal declines, **Collect in Portal** stays visible, is disabled, and shows the portal's own reason on hover.
- S8-R11: A deposit collected through the portal lands on the correct part sale and shows in its payment history.
- S8-R12: A deposit on a part sale syncs to QuickBooks on the same terms as a deposit on a work order: as an unapplied payment, behind the same one-time consent, applied when the invoice is created.
- S8-R13: While a part sale holds a deposit, its customer cannot be changed and the sale cannot be deleted. Both are refused until the deposit is removed.
- S8-R14: A deposit is charged to the account of the location that owns the part sale, not the location the user happens to have selected.

**Negative cases**

- S8-N1: Once the sale is invoiced or paid, **Add Deposit** refuses with "A deposit can only be added to a part sale that has not been invoiced." Money against an invoice is a payment, not a deposit.
- S8-N2: A user without either permission above is not offered **Add Deposit**. A user without Invoicing & Payments → Create & Edit is refused by the server as well, as on a work order.
- S8-N3: If the Customer Portal cannot be reached, the handoff is treated as declined and stays disabled. Recording the deposit is unaffected.
- S8-N4: Until the Customer Portal accepts part sales, S8-R8 and S8-R11 are unreachable and the action shows the portal's reason. Every other requirement in this story is live.
- S8-N5: **Collect in Portal** is not rendered at all when the shop does not take online payments, or when the user has no Customer Portal access. Both cases match the work order, which hides the action. S8-R10's disabled-with-reason state is only for a portal that is asked and actively declines.

**Edge cases**

- S8-E1: If the deposits on a sale exceed its total - including when returning a core reduces the total afterwards - the invoice is settled to zero, it is marked Paid rather than Partially Paid, and the surplus becomes a customer credit.

**Error handling**

- If the portal cannot be asked, hovering the disabled action shows "The Customer Portal could not confirm this location can take a payment right now. Try again, or record the deposit instead."

## 9. User Feedback Summary

| Trigger | Message | Behavior |
| --- | --- | --- |
| Two people return the same core at once | Core has already been actioned. Please refresh and try again. | Error, the second answer is not applied |
| Adding a deposit to an invoiced or paid part sale | A deposit can only be added to a part sale that has not been invoiced. | Error |
| Hovering Collect in Portal while the portal declines | The portal's own reason, shown verbatim | Tooltip on a disabled action |
| Hovering Collect in Portal when the portal cannot be reached | The Customer Portal could not confirm this location can take a payment right now. Try again, or record the deposit instead. | Tooltip on a disabled action |

## 10. Change Log (abbreviated — see page history)

Story keys: SV-10262 to SV-10269 under SV-9667. Story 2 was withdrawn in place; its ids are retired
and Stories 3-8 keep their keys. All requirement ids are carried by a story.
