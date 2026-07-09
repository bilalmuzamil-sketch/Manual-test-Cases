# FAQ — Custom Roles and Permissions (pre-approved support answers)

Draft answers for the questions this release is expected to generate. Written
in customer-ready plain English. The bot should prefer these when they match,
and adapt names/details to the ticket.

---

## A. General / getting started

**A1. What changed with roles in this release?**
ShopView replaced its fixed set of roles with a flexible permission system.
You now get 12 built-in "system roles" as sensible defaults, and admins can
create custom roles: pick a built-in role as a starting point, then switch
any individual permission on or off. Everyone was automatically moved from
their old role to the closest new one.

**A2. Where do I manage roles?**
Administration > Roles and Permissions. You need a role that has Settings
access with the App Settings section enabled (Admin has this by default).

**A3. Can a user have two roles?**
No. Each user has exactly one role. If someone needs a mix of two roles'
abilities, create a custom role with exactly the permissions they need.

**A4. Can I edit the built-in (system) roles?**
Mostly yes — you can adjust a system role's settings for your shop. Two
exceptions: Office and Time Clock cannot be edited (you can view their
permissions read-only). Also, the Admin role can't be edited in a way that
would remove its access to the admin pages, so you can't lock yourself out.
System roles can never be deleted.

**A5. How do I see exactly what a role allows before assigning it?**
Use "View Permissions" — it's on each role in the Roles and Permissions list,
and next to the role selector on the Staff page. It shows a read-only summary
of everything the role can and can't do.

**A6. Why can't I delete this custom role?**
A role that still has users assigned can't be deleted — you'll see a message
telling you how many users are on it. Reassign those users to another role
first, then delete. (Built-in system roles can never be deleted.)

**A7. I changed someone's role but nothing changed for them.**
Changing a role signs that user out automatically, and the new permissions
take effect when they sign back in. If they still seem to have old
permissions, have them fully log out and log in again.

---

## B. Migration ("it worked before the update")

**B1. Where did the Owner role go?**
The Owner role was retired and merged into Admin. Anyone who was an Owner is
now an Admin with full access — nothing was lost.

**B2. Our Service Advisors suddenly have more access (deleting, reports,
invoicing). Why?**
The old "Service Advisor", "SA Technician", and "SA No Reports" roles were
consolidated into the new **Senior Service Advisor** role, which is broader.
If that's too much access for some staff, either assign them the (junior)
**Service Advisor** role, or create a custom role starting from Senior
Service Advisor and turn off what you don't want.

**B3. Our Service Manager can no longer delete payments / reach some
settings.**
That's part of the new Service Manager defaults: it no longer includes
Invoicing Delete, and its Settings access is limited to App Settings and
Wages. If your manager needs those abilities back, an admin can edit the
Service Manager role for your shop, or create a custom role with them
enabled.

**B4. Our Foreman can no longer edit timesheets.**
Correct — the new Foreman role doesn't include Timesheets editing (it gained
several parts-related abilities instead). If your foreman should edit
timesheets, create a custom role based on Foreman with Timesheets "Create and
Edit" turned on.

**B5. Our technician says the "Send to Portal" button disappeared.**
That's intentional: technicians now use the simplified Tech View, which
doesn't include Send to Portal. If a specific person should send work orders
to the portal, give them a role with Full View (e.g. a custom role based on
Technician with view mode set to Full).

**B6. Our Parts Manager can't delete work orders anymore.**
The new Parts Manager defaults no longer include deleting work orders or
lines. An admin can create a custom role based on Parts Manager with those
enabled if needed.

**B7. Our Office user can no longer edit the parts catalog.**
Office now has view-only catalog access by default (it gained full customer
management instead). A custom role based on Office can restore catalog
editing.

**B8. Can we just get our exact old role back?**
Yes, in effect: create a custom role starting from the closest system role
and toggle the differences. Your shop is notified of what changed per role,
and support can walk you through the specific toggles.

---

## C. "User can't see / can't do something"

**C1. A user can't see the Work Orders / Customers / Schedule menu at all.**
When a role has no View access to an area, the menu item is hidden entirely
(not greyed out). Check the user's role and enable View for that area, or
assign a role that has it.

**C2. A user sees no prices anywhere — no totals, no rates, no costs.**
Their role has "See Financial Data" turned off. That single switch hides ALL
financial information across the app (except the Customer Portal, Billing
Portal, and Settings pages). Turn it on in their role if they should see
pricing. Note: turning it on/off affects everyone with that role.

**C3. A user can see prices but can't open invoices.**
Seeing prices is "See Financial Data"; opening invoices is the separate
"Invoicing and Payments: View" permission. Enable Invoicing View on their
role. (They also need access to the place they open invoices from — work
orders, part sales, or customers.)

**C4. The Unpaid Invoices / Payments / Credits tabs are missing on a
customer (or vendor) page.**
Those tabs are controlled by "Manage Accounts Payable and Receivable". When
it's off, the tabs are hidden, along with sensitive fields like credit terms
and credit limits. Enable it on the role if the user should see them. (It
also requires "See Financial Data" to be on.)

**C5. Some fields are missing when editing a customer (credit limit, labor
rate, taxes…).**
Same switch as C4 — those are the financially sensitive customer fields,
shown only when "Manage Accounts Payable and Receivable" is on. The user can
still edit ordinary details (name, address, contacts).

**C6. A user with parts permissions can't see any parts pages.**
Check the "Parts Department" master switch on their role. When it's off, all
three parts areas (Part Sales, Catalog and Inventory, Vendor and Order
Management) are hidden no matter what their individual settings say. Turning
it back on restores the previous settings.

**C7. The Parts tab is missing on a work order.**
The Parts tab on a work order is controlled by the "Order Parts" setting
under Work Orders. Enable Order Parts on the role (it also requires "See
Financial Data" — you'll be prompted to enable that too).

**C8. A user can't find the Review option on work orders.**
Reviewing is its own setting: "Review Work Orders" under the Work Orders
area. It only requires Work Orders View — but it must be switched on for the
role.

**C9. A technician can't edit a work order line they created earlier.**
In Tech View, a line can only be edited while it's awaiting authorization.
Once the line is approved, it becomes read-only for that user. Existing lines
created by others are also read-only in Tech View — techs can add new lines.
This is the intended simplified technician experience.

**C10. The "Estimate" column shows the wrong number for a technician.**
In Tech View the Estimate column intentionally shows the Tech Time value
rather than the customer-facing estimate. Users in Full View see the actual
estimate.

**C11. A user can't delete a payment even though they can delete work
orders.**
Deleting payments is separate from deleting work orders: it requires
"Invoicing and Payments: Delete" (which in turn requires "Manage Accounts
Payable and Receivable"). Work Orders: Delete covers deleting WOs and
reversing invoices, not deleting payments.

**C12. Who can reverse an invoice?**
Reversing an invoice on a work order requires Work Orders: Delete; on a part
sale it requires Part Sales: Delete. Reversal also has business checks — for
example, an invoice with payments on it can't be reversed until the payments
are handled.

**C13. An Office user can't create an invoice even though their role shows
invoicing edit access.**
That's a built-in rule: Office users can take payments but not create
invoices — the Create Invoice button is disabled for the Office role on work
orders and part sales, regardless of the invoicing permission. If this person
must create invoices, assign a different (or custom) role not based on the
Office hard-coded rule.

**C14. A user can't clock in / see their timesheet.**
Clocking in and out is always available to every user, and anyone who can
clock in/out can see "My Timesheets" — no permission controls that. If clock
in/out genuinely isn't working, that's a problem to escalate, not a
permissions setting.

**C15. A user doesn't appear on the technician schedule.**
That's not a role permission. Appearing on the dispatch board is controlled
by the user's DEPARTMENT on their staff record — anyone in a
schedule-visible department appears. Similarly, clocking into work order
line tasks is controlled by the "Time Clock" setting on the staff record.

**C16. Can I let someone see only THEIR OWN work orders / appointments?**
Not in this release. Permissions control access to features, not which
records are visible: a user with Work Orders View sees all work orders, and
the schedule always shows all technicians. "Only my records" scoping is a
separate future capability — we can log your interest as feedback.

**C17. Can I give someone just ONE report instead of all reports?**
No — Reports is all-or-nothing. A role either sees all reports or none.
(This includes the AR/AP aging reports.)

---

## D. Role editor behavior

**D1. Why did checking "Delete" also check View and Edit?**
By design: Delete requires Edit, and Edit requires View, so the editor keeps
them consistent automatically — enabling a higher level switches on the ones
below, and disabling a lower level switches off the ones above.

**D2. Why did a popup ask me to enable "See Financial Data"?**
You enabled something that needs financial visibility to work (Part Sales,
Invoicing, or Order Parts). Confirming enables See Financial Data along with
your change; cancelling reverts the checkbox.

**D3. I turned off "See Financial Data" and got a list of settings to
disable.**
Some settings can't work without financial visibility (Invoicing, Part
Sales, Order Parts, Manage AP/AR). When you switch See Financial Data off,
ShopView lists which of those are on so you can turn them off knowingly.

**D4. The parts / settings sections disappeared from the role editor.**
When the "Parts Department" or "Settings" master switch is off, their child
sections are hidden in the editor (not greyed out). Turn the master switch
back on and the children reappear with their previous values preserved.

**D5. Can I rename a custom role or change its description?**
Yes — edit the role; the name must stay unique.

**D6. Can I reset a role back to its original template?**
Escalate this one — resetting to template is still being finalized and we
should not promise specific behavior yet. Workaround: create a fresh custom
role from the same template.

---

## E. Digital Inspections

**E1. Who can add or fill in an inspection on a work order line?**
Anyone whose role has Work Order Lines: Create and Edit.

**E2. Who can delete or reopen a completed inspection?**
Deleting a COMPLETED inspection or reopening it requires Work Order Lines:
Delete. Deleting an inspection that isn't finished yet only needs Work Order
Lines: Create and Edit.

**E3. Who can create inspection templates?**
Roles with Settings access plus the Service sub-section enabled.
