# Printer Friendly Work Orders — Requirements (ingested)

**Source:** Confluence page 519176194, **version 8** (live as of 2026-08-25), read 2026-08-25.
**Epic:** SV-9383 · **PO / Owner:** **TBD** (spec drafted by Sasha Grosman; requirements from Fabian —
PO must be confirmed, see questions-2026-08-25/). **Design:** TBD on every story (none exists yet).
**Tech plan:** none supplied. **QA env:** none → **Rule 85 SOURCE-VERIFIED ONLY**.

**Rule inventory (45 rule IDs):** Story 1 = 8 (R1–R6, N1, E1) · Story 2 = 7 (R1–R5, N1–N2) ·
Story 3 = 14 (R1–R8, N1–N4, E1–E2) · Story 4 = 5 (R1–R4, N1) · Story 5 = 6 (R1–R5, E1) ·
Story 6 = 5 (R1–R3, N1, E1).

The authoring-relevant PRD sections follow verbatim.

---

## 1. Business Case
Mechanics/technicians frequently need a physical copy of a work order to carry around the shop floor. Today the only way to reference work order details is on-screen. This feature provides a paper-friendly print.

## 4. Key Decisions
* No new permission required — printing is a read-only view of data the user already has access to.
* No feature flag — low risk, additive.
* Browser print only (no PDF download).
* **Pricing is always excluded** — per Fabian, the printout is for mechanics, not billing. Pricing is never shown regardless of the user's permissions.
* No notes section on printout (mechanics use back of page; keep it compact).
* Print lives in the More menu (audit log, timesheets, delete).
* Print disabled until lines data loads — disabled while fetching and when no line items exist; does not enable on the UI skeleton.

## 5. Assumptions
* The browser's native print dialog provides sufficient formatting control (page size, orientation, margins); no custom print preview UI.
* All data needed for the printout is already loaded on the work order detail page.

## 7. Requirements

### Story 1: Print Option in More Menu — Jira SV-9384
Prerequisites: user on work order detail view; user has permission to view the work order.
* **S1-R1:** A "Print Work Order" option will appear in the More menu (the overflow/actions menu on the work order toolbar).
* **S1-R2:** The menu item will display the label "Print Work Order" (text only, no icon — consistent with other menu items).
* **S1-R3:** The menu item will be positioned below the Timesheets option and above the Delete Work Order option.
* **S1-R4:** When the user selects "Print Work Order," the browser's native print dialog will open.
* **S1-R5:** The print option will be available on all work order statuses: Estimate, Approved, In Progress, Review, Complete, Invoiced, Paid, Hold, Declined, and Imported.
* **S1-R6:** The print option will be available on both desktop and mobile views.
* **S1-N1:** If the user does not have permission to view the work order, they cannot access the work order detail page and therefore cannot reach the print option (enforced by existing access control).
* **S1-E1:** The print option is disabled (grayed out and non-clickable) until line item data has finished loading from the server. The option does not enable when the UI skeleton appears — it waits for the actual data to arrive.

### Story 2: Print Layout — Work Order Header — Jira SV-9385
Prerequisites: user has triggered the print action from the work order detail view.
* **S2-R1:** The printed page will display the work order number prominently at the top.
* **S2-R2:** The work order status will be displayed next to the work order number.
* **S2-R3:** The following work order details will be displayed in the header area: customer name (and company name, if present); vehicle: year, make, model, VIN, license plate, unit number (if present), mileage, engine hours (if present); service advisor name; lead technician name; work order start date.
* **S2-R4:** Fields that have no value (e.g., no engine hours, no license plate) will be omitted from the printout rather than displayed as blank.
* **S2-R5:** The shop name or organization name will appear in the header area to identify the source of the printout.
* **S2-N1:** If the work order has no customer assigned, the customer section will display "No customer assigned".
* **S2-N2:** If the work order has no vehicle assigned, the vehicle section will display "No vehicle assigned".

### Story 3: Print Layout — Line Items — Jira SV-9386
Prerequisites: user has triggered print; the work order has at least one line item.
* **S3-R1:** Each line item will display: line number; line description (name); line status; actual time / estimated time; tech story (if one exists for the line); assigned technician(s) (if assigned).
* **S3-R2:** Parts associated with each line will be listed, showing: part description; part number; quantity.
* **S3-R3:** Pricing is never shown on the printout — no labor rates, margins, line totals, part sell prices, or part margins. The Rate, Margin, and Total columns are removed entirely.
* **S3-R4:** The Action column (Approve, Decline, Complete buttons) and Progress column (progress bars) are removed from the printout. The line status text column is sufficient.
* **S3-R5:** Lines will be printed in the same order they appear on screen (by line number).
* **S3-R6:** Line items with a status of "Cancelled" will still appear on the printout if they are visible on screen, with their status clearly indicated.
* **S3-R7:** Each work order line group (main line + its sub-rows for tech story, labor, parts, inspections) will be visually separated from the next line by a thick border and blank space below, giving technicians room to write notes per line.
* **S3-R8:** If a line has no tech story, the tech story row will be omitted entirely — no placeholder text will appear.
* **S3-N1:** If the work order has no line items, the line items section will display "No lines on this work order".
* **S3-N2:** If a line has no parts, no parts section will appear for that line.
* **S3-N3:** If a line has no tech story, the tech story row will be omitted entirely — no placeholder text (e.g., "Add tech story for this line") will appear.
* **S3-N4:** If a line has no assigned technicians, the technician area will be omitted for that line.
* **S3-E1:** If a work order has a large number of lines (10+), the printout will flow across multiple pages with line items continuing naturally. No line item will be split mid-way across a page break if avoidable.
* **S3-E2:** If a tech story is very long (500+ characters), it will wrap and print in full — it will not be truncated.

### Story 4: Print Layout — Summary and Footer — Jira SV-9387
Prerequisites: user has triggered the print action.
* **S4-R1:** A summary section will appear after all line items, displaying total actual time / total estimated time across all lines.
* **S4-R2:** Pricing is never shown in the summary — no parts subtotal, labor subtotal, shop supplies, tax, or grand total. Only time totals are displayed.
* **S4-R3:** The print timestamp (date and time of printing) will appear at the bottom of the printout.
* **S4-R4:** The work order number will repeat in the footer of each printed page for multi-page printouts.
* **S4-N1:** If there are no line items, the summary will show zero totals rather than being hidden.

### Story 5: Print Formatting — Screen Elements Hidden — Jira SV-9388
Prerequisites: user has triggered the print action.
* **S5-R1:** The following elements will be hidden on the printout: application navigation (sidebar, top bar, breadcrumbs); all action buttons (Print, New Line, Reviewed, Send to Portal, etc.); tab navigation (Lines, Part Requests, Notes, Time Sheets, etc.); context menus and dropdown triggers; status change buttons and workflow actions on line items; clock in/out buttons; progress column and progress bars; action column (Approve, Decline, Complete buttons); any floating UI elements (tooltips, popovers, modals).
* **S5-R2:** The printout will use black text on a white background regardless of the user's theme (dark mode, etc.).
* **S5-R3:** Text will be sized for comfortable reading on paper (no smaller than 10pt equivalent).
* **S5-R4:** The layout will be optimized for portrait orientation on US Letter or A4 paper.
* **S5-R5:** Status badges will print as plain text labels (not colored chips) to ensure readability on black-and-white printers.
* **S5-E1:** If the user manually selects landscape orientation in the browser print dialog, the layout will still be readable (content will not overflow or clip).

### Story 6: Audit Trail — Jira SV-9389
Prerequisites: user has triggered the print action.
* **S6-R1:** When the user selects the Print Work Order option, the system will log a "Work Order Printed" event in the work order's audit history.
* **S6-R2:** The audit log entry will record the user who triggered the print and the date/time.
* **S6-R3:** The audit log entry will be visible in the work order's History tab, consistent with how estimate and invoice print events are displayed today.
* **S6-N1:** If the user opens the browser print dialog but cancels without printing, the event will still be logged (the system cannot detect whether the user completed the print from the browser dialog).
* **S6-E1:** If the user prints the same work order multiple times, each print action will create a separate audit log entry.

## 8. User Feedback Summary
No user-facing messages are introduced by this feature. The browser's native print dialog handles all user interaction after the button click.
