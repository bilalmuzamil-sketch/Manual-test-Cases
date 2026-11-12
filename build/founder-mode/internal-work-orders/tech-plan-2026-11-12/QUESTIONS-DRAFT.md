# Questions for Milos Vasic (draft, not sent): Internal Work Orders, PRD Final v1.0 vs the tech plan

Drafted 12 Nov 2026 from a full read of the PRD (v1.0, 2026-11-09) and the engineering tech plan (revision 5, 2026-11-10, built on
PRD v1.0 page 39). The QA lead is travelling; these go into the colour-coded question sheet when the sheet is built, not before.
Only items where the plan and the PRD disagree, or where the PRD is silent on something that can hurt a shop, are here. Everything
else in the plan matches the PRD (539 statements confirm it) or adds harmless detail (131).

---

Hi sir, a few small things came up while we lined the tech plan up against the final PRD. Each has a suggested answer, so a
one-letter reply is plenty.

**Q1. Internal Work Orders: the "Create invoice [number]?" confirmation when vendor bill cost moves (S7-R8)**
The PRD says the confirmation shows one "Moved from [account] to [account]" row per move. The tech plan groups them: one row per
pair of accounts, so two lines whose bill cost both moves from Cost of Parts to Warranty show as a single row (with the total).
Which do you want testers to expect?
- (a) One row per pair of accounts, with the amounts added up, as the plan builds it. **Suggested.** It reads cleaner and the
  accounts are what the accountant cares about.
- (b) One row per line or vendor bill that moves, as the PRD can be read.
- (c) One row per pair of accounts, plus the line names under it.

**Q2. Internal Work Orders: "Closed" in the work orders Status chip (S2-R10)**
The PRD adds "Closed" to the Status chip on the All tab. The plan only shows that option once the shop has turned the setting on or
has closed at least one work order, so a shop that never uses the feature sees no change in that list. Is that all right?
- (a) Yes, hide "Closed" until the shop has turned the setting on or closed a work order. **Suggested.** It matches the "no change
  until they turn it on" release-day rule.
- (b) No, show "Closed" in the Status chip for every shop from the release.

**Q3. Internal Work Orders: the message when Close stops at a completion step (Story 3 error handling)**
When a work order is not yet Complete, Close first runs the usual completion steps (tech stories, cores, VIN, mileage). If one of
those steps fails, the plan shows today's completion error, the same one Create invoice shows. The PRD says a Close failure before
the internal invoice is created shows "Could not close the work order. Try again." Which should the tester expect in that case?
- (a) Today's completion error for a failed completion step, and "Could not close the work order. Try again." for a failure in the
  Close itself. **Suggested.** It tells the advisor which step to fix.
- (b) Always "Could not close the work order. Try again."

**Q4. Internal Work Orders: imported work orders (S2-E3)**
S2-E3 says an imported work order takes its customer's classification at import. Engineering found that ShopView has no live
work-order import today, so nothing is built for it and a tester has no screen to try it on. How should we treat it?
- (a) Leave S2-E3 as a rule for when an import is added; no test case now. **Suggested.**
- (b) There is an import we have missed; please tell us where it is and we will test it.
- (c) Remove S2-E3 from the PRD in a v1.x note.

**Q5. Internal Work Orders: a portal deposit paid after the work order became no charge (PRD silent)**
The PRD blocks Convert to No Charge while a deposit exists, and the plan refuses portal deposits on internal and no-charge work
orders. One gap remains: a customer opens the deposit checkout on the portal while the work order is billable, the advisor converts
it to No Charge, then the customer pays. ShopView refuses the deposit, but the card has already been charged and the money stays in
Stripe until someone refunds it by hand (no automatic refund in this release). Is that acceptable for v1?
- (a) Yes for v1: the refused deposit is logged with its own reason and the shop refunds it with the existing refund action; an
  automatic refund can come later. **Suggested**, as the plan proposes; it is rare and visible.
- (b) No: Convert to No Charge should also be blocked while a portal deposit checkout is open.
- (c) No: refund automatically in this release.

**Q6. Internal Work Orders: a mapped AccountingHub account made inactive (S6-E1)**
S6-E1 says events are held when a mapped account is made inactive. In the hub today an account that any mapping row points at
cannot be made inactive (the hub refuses it), and the plan adds the category rows to that check, so the case can only happen
through direct database changes. May we test the refusal instead?
- (a) Yes: test that deactivating an account used by a category row is refused, and keep S6-E1 as a safety rule we do not test by
  hand. **Suggested.**
- (b) No: the hub should allow deactivating it and then hold events as S6-E1 says.

**Q7. Internal Work Orders: line marks after Convert to No Charge and then Convert to Billable (S2-R5, PRD silent on the way back)**
When a billable work order already has no-charge lines and the whole work order is converted to No Charge, the plan clears each
line's own mark and category (the work order's category covers every line, as S2-R5 says). If the advisor later converts it back to
billable, those lines come back as ordinary billable lines; their earlier Warranty or Comeback marks do not return. Is that right?
- (a) Yes: after Convert to Billable every line is billable, and the advisor marks lines No Charge again if needed. **Suggested.**
  It matches "Every line is priced as a new line would be today."
- (b) No: lines that were No Charge before the conversion should get their own marks and categories back.

---

**For the QA lead only (no question to the PO):** five smaller differences need no answer from Milos, because the PRD wins and the
plan's own build sections already follow it or no tester sees the difference: "No charge" vs "No Charge" in decision D39 (hub Closed
record) and in an old answer row (asset Invoices tab), an old report name and the old account 6510 in the plan's answer history, and
the release-run order (an extra early hub seeding run). Details in `TECH-PLAN-DIVERGENCES.md` §B.
