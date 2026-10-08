# Developer's reply — which other areas to regression-test because of SV-10043 (received 8 Oct 2026)

Shared by the QA lead (Bilal Muzamil) on 8 Oct 2026: *"I have asked the Dev of this feature to tell me which areas of the
app I need to check for regression and this is what he has said to me in his reply (his claude session told him this)."*
Verbatim below. It is a written statement from the feature's developer (Rule 57: any newer written statement counts as
a source; it informs regression scope, it never overrules the PRD).

---

Written for: Bilal (QA), who asked which other parts of the app to regression-test because of this feature.

Here's my ranking, based on what the change actually touches outside the Work Orders page.

**High: these share code that changed behavior**

1. **Work order detail page**
   - **Status card, Lead Technician select:** the lock rule is new (disabled on Invoiced and Paid). A refused change now shows an error and puts the old value back.
   - **Edit Work Order:** the lead now goes through the new shared path. If the lead change is refused, the other edits in the same save (mileage, engine hours, PO) are not saved either. Every lead change also adds a "Lead tech changed" history entry.
   - **Lines tab:** adding a line, editing a line's technician and assigning a technician now reject staff from another organization. The green check before the tech story is gone (intentional).
2. **Clock-in and labor moves**
   - Clock in as a technician on an unassigned line: the line should take that technician.
   - Move a labor task from one line to another: the target line takes the technician.
   - Both code paths were changed.
3. **Schedule page**
   - "Clear shifts" deletes or shortens the old lead's whole-work-order shifts. Check that `/schedule` shows the result.
   - Line shifts and other technicians' shifts must stay untouched.
   - Creating shifts by dragging onto the schedule should still work.
4. **Customer → asset → Work Orders tab, and the customer's Work Orders tab**
   - Both use the same work orders list API, which was refactored and is now scoped to the organization.
   - Check rows, counts, progress and sorting.
   - The asset-on-site toggle no longer sends the lead; the lead should stay unchanged after a toggle.

**Medium: shared plumbing**

5. **Part Sales**
   - The detail page's status card had props removed. Check that it renders and that changing the technician works.
   - The Part Sales list's part request and part return counts are now scoped to the organization.
6. **Pages that remember filters and settings:** Orders, Vendors, Return Requests, Return Credits, Part Sales, Deliveries, Parts Catalogue, Inventory, and the report pages. The saved-preferences code changed. Set a filter, reload, and check that it's kept.
7. **Report filters** (Work in Progress, Sales by Customer, Parts Velocity, Inventory Value, Technician Utilization, Sales by Rep). The filter option list now supports disabled options. Check that options toggle normally and that Select all and Clear selection work.
8. **Impersonation and session expiry, on any page.** Request cancelling changed for every request. Start and exit impersonation while a page is loading. There should be no stale data, and no error toasts from cancelled requests.
9. **Avatars everywhere** (header, Staff, Schedule, cards). Avatars are now cached. After someone uploads a new photo, a reload must show the new one.

**Low: one quick look each is enough**

- Any table page (Customers, Dashboard cards): the table component only gained an addition.
- Imported work orders: they open in List, and the lead stays locked.

**Safe to skip:** invoicing, payments, accounting and QuickBooks. None of that code changed.

If he only has time for a few, do 1–4. They're where a bug would reach users outside the new views.
