# SBR (Sales By Representative) Report

> **VERBATIM CAPTURE — current Confluence spec**
> - pageId: 585629698
> - Page title: SBR (Sales By Representative) Report
> - Current version: v15
> - Last updated: 2026-07-29T06:38:33.469Z by Chris Ward
> - Confluence space: ~712020aa00b8d6a71f4259891982a304227c20
> - Captured: 2026-07-31 (REST storage-format -> markdown via html2text, unicode-preserving; escape-normalized to match the 2026-07-28 capture pipeline — validated 6/6 byte-identical on the prior versions)

---
|
---|---
**Epic**|  TBD
**Owner**|  TBD
**Status**|  In review — 2026-07-16
**Branch**|  TBD

# Sales By Representative Report

## 1. Business Case

Shop owners and managers need to see, at a glance, **how each sales rep is performing over a chosen time window** — what they sold, what they earned, which customers they touched, and how their billed hours compared to their worked hours. Today, this answer is reconstructed by hand from invoice exports and pivot tables, and it is gated by the fact that the "sales rep toggle" on staff records was effectively unused. Without a clean per-rep view, shop managers can't see who's driving revenue and can't catch labor-billing drift early.

The Sales By Representative report makes the per-rep view a single click. It pairs the screen view with four download formats (a Summary PDF, an Expanded View PDF, a Summary CSV, and an Expanded View CSV), shows payment status, and uses a consistent reporting layout so a manager moving between reports does not have to relearn anything. Reps are credited on the Work Order (Story 19), so the numbers are already correct at invoice time without post-hoc correction.

A secondary goal is durability. The report's underlying behavior — particularly which reps appear and how the Sales Rep Assignments export is built — is hardened against missing or stale staff records so the views never silently render empty.

> _* Naming note (for the build team): the report's user-facing name is**" Sales By Representative"** — the full word, not the "Rep" shorthand. In the Reports left-navigation the longer label currently renders with tight padding; the navigation entry's padding must be adjusted so the full name is not visually cramped (S1-R7). This is a layout fix, not a reason to shorten the name._

## 2. Feature Overview

### Core ShopView

  * A report called **Sales By Representative** is available under the Performance section of the Reports navigation.
  * The report shows revenue grouped by sales rep over a chosen date range. **Each sales rep who contributed at least one invoice in the current filtered view occupies one summary row** ; the user can expand a rep's row with a chevron to reveal every invoice that contributed to that rep's totals.
  * For each invoice on an expanded row, the user sees: the invoice's date and number (a clickable link to the underlying work order or parts sale in the same tab); the customer name (also clickable, styled as plain text); the invoice's **payment status** as a colored badge; the per-invoice **Inv. Hrs** (Labor Delta) value with green/red coloring; and the per-invoice money columns (Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Margin, Margin %, Subtotal). (The authoritative left-to-right column order is S5-R2.)
  * A **grand Totals indicator** is shown at the bottom of the report whenever there is at least one summary row (a rep row or the Unassigned row) (desktop: a full Totals row inside the table; mobile: a Subtotal-only bar below the table — see S10-R5).
  * The user can filter the on-screen report by **date range** , **product type** (Parts & Service / Parts only / Service only), **invoice payment status** (All Statuses / Unpaid / Partially Paid / Paid), and **location** (one, several, or all of the locations the user has access to). A **Show Unassigned** toggle adds a rolled-up "Unassigned" row for invoices with no assigned rep.
  * The report shows a per-row **Location** column whenever the current view spans more than one location; the column is hidden when the view is scoped to a single location. A rep summary row that spans more than one location reads **Multiple** ; an invoice detail row reads its own exact location. Every export names the location scope on a "Locations:" line.
  * The user can sort the report by any of the financial columns.
  * The user can download the report in four formats via the â‹¯ overflow menu: **Download Summary (PDF)** , **Download Expanded View (PDF)** , **Download Summary (CSV)** , and **Download Expanded View (CSV)**. Both PDF formats adapt their font size to the data in the export.
  * Work Orders include a **Sales Rep** field (Story 19) that lets service writers assign the correct rep before the WO is invoiced. This WO-level assignment determines whose totals the resulting invoice contributes to.
  * Managers can **deactivate a sales rep** from staff administration (Story 13); when the rep still has customer assignments, a type-to-confirm warning is shown before the change commits.
  * The **customer record** shows the customer's assigned sales rep (S19-R7).
  * A standalone, snapshot-style **Sales Rep Assignments** export (Story 15) is available from the Reports section's Export dialog — a flat CSV of every current customer→rep assignment in the organization.
  * A **column selector** button lets the user show or hide any of the seven metric columns. The five always-visible columns (Date, Invoice, Customer, Status, Subtotal) cannot be hidden.
  * The report **remembers the user's filter and view settings** (date range, product type, invoice status, location, Show Unassigned, column visibility, and sort) and restores them on the next visit (Story 23).



### Out of Scope

  * Per-line-item rep splits. The report classifies whole invoices by their assigned Sales Rep, not by individual line items.
  * A bulk customer→rep reassignment tool. Rep assignment happens on the Work Order (Story 19); this report does not provide a reassignment surface.
  * Mobile-optimized layout. The report is functional on phones (every filter, control, and export works on touch), but the dense table is not redesigned for small screens.
  * Aging or "days since" logic on dates. Dates are shown as plain calendar dates.
  * Persisting the user's **expanded-rep set** or **scroll position** across a page reload. Filters, column visibility, and sort ARE remembered (Story 23); expansion state and scroll position reset on reload. (Browser back-navigation from a drilldown is a separate case that restores everything — S12-R3a.)
  * Backfilling historical data. The report is a "moving forward from now" feature.
  * A separate data feed or API for third parties, or QuickBooks sync of any data displayed here.



## 3. Key Decisions

  * **The report is grouped per-rep, not flat per-invoice.** Each contributing rep occupies one summary row with chevron-expanded invoice detail rows underneath. Each invoice appears under exactly one rep — the Sales Rep credited to the invoice at the time of invoicing — or under the "Unassigned" row when it has no rep.
  * **Contributors only.** A rep row appears if and only if the rep has at least one non-reversed invoice matching the _current_ filter set (date range, product type, invoice status, and location together). Reps with no matching invoices do not appear — there are no blank placeholder rows. When no rep matches (and there is no Unassigned row to show), the report shows its empty state (Story 16).
  * **A currently-inactive sales rep who still has matching invoices is shown, credited, and marked "(Inactive)".** A rep is "active" for this report when their sales-rep toggle is currently on. If a rep's toggle has since been turned off (or their staff record deleted) but they have matching invoices in the period, their row still appears with their credit intact, and their name is tagged "(Inactive)" (S5-R9). This keeps the grand Totals reconciled to the period's invoices — no revenue silently disappears — while making the toggled-off state visible. The toggle still governs who is offered for a _new_ assignment (Story 19) and A→Z is the only ordering (no active/inactive tiers).
  * **Single sales-rep model.** A customer has one sales rep; a Work Order has one Sales Rep; an invoice carries one rep. At invoice creation the WO's rep is snapshotted onto the invoice; when the WO has no rep, the snapshot falls back to the customer's assigned rep; when that is also absent, the invoice is unassigned (Story 22). _(Build note: the shipped database currently stores a separate parts-side and service-side rep; this spec locks the single-rep model, which requires collapsing those two fields into one and reworking invoice crediting.)_
  * **The money columns use the standardized report labels:** billed labor/parts = **Labor Invoiced** / **Parts Invoiced** ; per-category profit = **Labor Margin** / **Parts Margin** ; combined profit dollars = **Margin** ; profit percentage = **Margin %**.
  * **Definitions of the numbers** (business-level; the same values everywhere they appear):
    * **Subtotal** = Labor Invoiced + Parts Invoiced, **before tax**. It is the row's headline revenue figure.

    * **Labor Margin** = Labor Invoiced − the shop's labor cost; **Parts Margin** = Parts Invoiced − the shop's parts cost; **Margin** = Labor Margin + Parts Margin.

    * **Margin %** = Margin ÷ Subtotal × 100, to one decimal, rendered on screen and in both PDFs with a trailing `%` — e.g., `45.2%`; a negative renders `-8.4%` (leading minus, no parentheses, no `+` on positives). It renders **" —"** when Subtotal ≤ 0 (never "0.0%" or a divide-by-zero result). (In the CSVs it is a plain number with no `%` — S14-R17.) On every rolled-up row (rep summary rows and every totals row), Margin % is **recomputed** as (that row-set's total Margin ÷ that row-set's total Subtotal) — it is never the sum or average of the child percentages.

    * **Inv. Hrs** (Labor Delta) = hours invoiced − hours worked, where **hours invoiced** = the billed labor hours on the invoice's work-order labor lines, and **hours worked** = the technician clocked (timesheet) hours recorded against that work order.

    * **Payment status.** Every invoice carries exactly one of **five** canonical system payment states — `unpaid`, `prepaid`, `partially_paid`, `paid`, `overpaid` — which this report maps to one of **three** display values (**Paid** , **Partially Paid** , **Unpaid**). This mapping is the single source of truth for both the on-screen/PDF status badge (Story 8) and the Invoice Status filter predicate (Story 4):

      * `paid` → **Paid**.
      * `overpaid` → **Paid**.
      * `partially_paid` → **Partially Paid**.
      * `unpaid` → **Unpaid**.
      * `prepaid` → **Paid** when the invoice's balance owed is zero; **Partially Paid** when a balance is still owed. _(Prepaid is the only state whose display value depends on the balance owed, because a prepayment can fully cover the invoice or only cover part of it.)_

A zero-total invoice with no payment applied is `unpaid` and maps to **Unpaid**. A negative-total invoice (e.g., a net credit/return) carries its own canonical system state and follows the same mapping; when its balance owed is zero (no balance owed), it maps to **Paid**.

    * **An invoice's date** for the date-range filter is the invoice's own date (the value shown in the Date column). **An invoice's location** for the location filter is the location of its originating work order / parts sale.

    * **Reversed** is determined by the canonical ShopView invoice-status ruleset; reversed invoices are excluded everywhere in this report. When that ruleset evolves, this report follows it.

    * All displayed numeric values round **half-up** (away from zero) at their stated precision (money to cents; Inv. Hrs and Margin % to one decimal). Rolled-up values are computed from unrounded components and then rounded, so a totals cell may differ from the eye-summed displayed rows by one unit in the last decimal — this is expected.

  * **Subtotal is the headline column:** bolded across the header, every rep summary row, every invoice detail row, and the grand Totals indicator; pinned to the right edge on screen (Story 10).
  * **" Inv. Hrs" is color-coded** (green positive / red negative / default zero) on screen and in both PDFs; the CSVs stay monochrome.
  * **Negative dollar values use accounting-convention parentheses** — `($1,234.56)` — on screen and in both PDFs, across every money column (Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Margin, Subtotal). Inv. Hrs (a signed time value) and Margin % (a signed percentage) are excluded. The CSVs use plain signed numbers (see S14-R15/R16).
  * **Rep ordering is plain A →Z** by display name (case-insensitive), with the "Unassigned" row pinned to the top when shown. There are no active/inactive tiers. A user column-sort replaces the default A→Z (Story 11).
  * **Invoice and customer links navigate in the same tab; browser back restores full state** (Story 12).
  * **The report has no on-screen search bar.** Drilldown is via chevron expansion.
  * **Placement: additive at the bottom of the "Performance" group** in the Reports left sidebar (S1-R2).
  * **Location is surfaced per row, not as a standalone scope stamp.** A **Location** column is shown only when the current view spans more than one location; when the view is scoped to a single location the column is hidden, because that one location is already unambiguous. On a rep summary row the cell reads the location's name when all of that rep's matching invoices are at one location, or the literal **Multiple** when they span more than one; on an invoice detail row the cell reads that invoice's own exact location. Every export additionally carries a "Locations:" line naming the scope (or "All locations" when the full accessible set is selected), so a multi-location export is never ambiguous about which locations it covers.



## 4. Terminology

  * **Sales rep toggle** — The flag on a staff member that marks them as a sales representative. It governs who is offered for a new rep assignment. For this report, a rep whose toggle is currently on is "active"; a rep whose toggle is off is "(Inactive)" but still shown if they have matching invoices.
  * **Inv. Hrs (Labor Delta)** — hours invoiced minus hours worked (see §3). Positive means the shop billed more time than it spent. Rendered "Inv. Hrs" with green/red/default coloring.
  * **Subtotal** — Labor Invoiced + Parts Invoiced, pre-tax (§3). The headline revenue column.
  * **Margin / Margin %** — combined profit dollars / that profit as a percentage of Subtotal (§3).
  * **Rep summary row** — the collapsed row representing one rep, rolling up their matching invoices. The **Unassigned row** is a special summary row (shown only when Show Unassigned is on) that rolls up matching invoices with no assigned rep.
  * **Invoice detail row** — a row inside a rep's expanded view, representing one contributing invoice.
  * **Parts invoice / Service invoice** — the Product Type classification, by invoice number prefix (`P` = Parts, `S` = Service).
  * **Snapshot** — the rep captured onto the invoice at creation time — the Work Order's rep, or (when the WO has no rep) the customer's assigned rep — stored as the rep's id **and a denormalized rep display name**. Immutable on past invoices. The denormalized name is what the report displays (and sorts on) for a rep whose staff record is later deleted (S5-R9).
  * **Location (column)** — A per-row column showing the location a row belongs to, displayed only when the current view spans more than one location (hidden for a single-location view). On a rep summary row it reads the single location's name, or the literal **Multiple** when that rep's matching invoices span more than one location; on an invoice detail row it reads that invoice's own exact location (the location of its originating work order / parts sale, §3).



## 5. Assumptions

  * The sales rep toggle on staff records is the canonical "is this person a sales rep" flag. Enabling it makes a staff member selectable as a rep; existing staff are not retroactively swept.
  * A Work Order carries a single Sales Rep assignment, settable/changeable before invoicing. At invoice creation the WO's rep is snapshotted onto the invoice; when the WO has no rep, the snapshot falls back to the customer's assigned rep; when that is absent, the invoice is unassigned.
  * Reversed invoices are excluded everywhere in this report (rep totals, detail rows, both PDF tables, and the contributor gate). "Reversed" defers to the canonical ShopView invoice-status ruleset.
  * Invoice numbers always start with `P` (Parts) or `S` (Service) — a system invariant the Product Type filter relies on.
  * Staff `active` status and the sales-rep toggle are independent flags: a staff member can be inactive but still be a tracked sales rep, and vice-versa.



## 6. Requirements

> _* Numbering note: story and requirement numbers are stable across revisions. Some numbers were retired when their content was removed in earlier rounds and are intentionally not reused (there is no Story 7); this keeps existing cross-references valid. Gaps are deliberate, not dropped content._

### Story 1: Access the Sales By Representative Report

**As a** shop manager, **I want** to find the report from the Reports navigation, **so that** I can open it the same way I open every other report.

**Design:** TBD **Jira:** TBD

**Requirements:**

  * **S1-R1:** "Sales By Representative" appears as an entry in the Reports left-side navigation for every user who can see any other report in the same Performance group. The label is the full word "Representative," not the "Rep" shorthand.
  * **S1-R2:** The entry is placed within the **Performance** group, at the **bottom** of the group — immediately below whichever report currently sits last in that group at the time the report is built. Additive: no existing entry is moved, replaced, or reordered.
  * **S1-R3:** The relative order of every other navigation entry is unchanged.
  * **S1-R4:** Selecting the entry opens the report in the main content area.
  * **S1-R5:** The page title displayed at the top of the report reads "Sales By Representative".
  * **S1-R6:** The browser tab title reads "Sales By Representative - Report | ShopView".
  * **S1-R7:** The navigation entry's horizontal padding must be sized so the full "Sales By Representative" label renders without crowding against the entry's edges and without truncation. This is a layout adjustment; the label is not shortened to fit.



**Negative cases:**

  * **S1-N1:** If the user lacks permission to access Reports, the entire Reports navigation (including this entry) is not shown.



* * *

### Story 2: Filter the report by date range

**As a** user reviewing a specific period, **I want** to set a date range, **so that** the report only includes invoices dated in that period.

**Design:** TBD **Jira:** TBD

**Prerequisites:** The user is on the report.

**Requirements:**

  * **S2-R1:** A date range picker is visible in the report toolbar.
  * **S2-R2:** The user can select any standard preset (Today, Yesterday, This Week, This Month, Last Month, This Year, Last Year, This Quarter, Last Quarter, Custom).
  * **S2-R3:** The user can select a custom range via the date picker dialog.
  * **S2-R4:** Changing the date range re-fetches and re-renders the report (a loading indicator is shown per S16-R4).
  * **S2-R5:** The chosen date range is reflected in both PDF exports' header strips.
  * **S2-R6:** The **Custom** range is capped at a maximum span of **366 days** (start and end dates inclusive), matching the largest preset. A custom selection whose start-to-end span exceeds 366 days is not accepted; the picker holds the user to a range of 366 days or fewer.
  * **S2-R7:** On first load (no remembered setting — Story 23), the date range defaults to **This Month**.
  * **S2-R8:** The date used to place an invoice in the range is the invoice's own date (§3), compared with inclusive endpoints.



**Negative cases:**

  * **S2-N1:** If the chosen range produces no matching invoices for any rep, the report shows the empty state (Story 16).



* * *

### Story 3: Filter the report by product type

**As a** user, **I want** to limit the report to parts-only or service-only invoices, **so that** I can analyze each side of the business in isolation.

**Design:** TBD **Jira:** TBD

**Prerequisites:** The user is on the report.

**Requirements:**

  * **S3-R1:** A "Product Type" dropdown is visible in the toolbar.
  * **S3-R2:** The dropdown offers exactly three options: "Parts & Service," "Parts only," "Service only."
  * **S3-R3:** "Parts & Service" is the default on first load (no remembered setting — Story 23).
  * **S3-R4:** "Parts only" includes only invoices whose number starts with `P`.
  * **S3-R5:** "Service only" includes only invoices whose number starts with `S`.
  * **S3-R6:** "Parts & Service" applies no product-type filter.
  * **S3-R7:** Changing the selection re-fetches and re-renders the report.
  * **S3-R8:** **The Product Type filter is part of the contributor gate and narrows every metric.** A rep appears only if they have ≥1 matching invoice after this filter (Story 5). For rendered reps, summary totals, invoice detail rows, the grand Totals indicator, and the (N) count all reflect only matching invoices.



**Negative cases:**

  * **S3-N1:** If no invoices match, the report shows the empty state (Story 16).



* * *

### Story 4: Filter the report by invoice payment status

**As a** user, **I want** to limit the report to a specific payment status, **so that** I can focus on outstanding receivables or completed sales.

**Design:** TBD **Jira:** TBD

**Prerequisites:** The user is on the report.

**Requirements:**

  * **S4-R1:** An "Invoice Status" dropdown is visible in the toolbar.
  * **S4-R2:** The dropdown offers exactly four options: "All Statuses," "Unpaid," "Partially Paid," "Paid."
  * **S4-R3:** "All Statuses" is the default on first load (no remembered setting — Story 23).
  * **S4-R4:** A specific status (Unpaid / Partially Paid / Paid) includes only invoices whose **display payment status** matches, using the five-state → three-value mapping in §3. Because that mapping collapses five system states into three display values, the filter matches on the mapped value: **" Paid"** includes `paid`, `overpaid`, and `prepaid` with zero balance owed; **" Partially Paid"** includes `partially_paid` and `prepaid` with a balance still owed; **" Unpaid"** includes `unpaid`.
  * **S4-R5:** Changing the selection re-fetches and re-renders the report.
  * **S4-R6:** **The Invoice Status filter is part of the contributor gate and narrows every metric** — same rule as S3-R8.
  * **S4-R7:** **Filters compose.** When multiple filters are active, every metric reflects the intersection — only invoices matching ALL active filters (date range, product type, invoice status, location) contribute, and a rep appears only if ≥1 invoice matches all of them.
  * **S4-R8:** The money columns always show the **invoiced** amounts, not the outstanding balance. Filtering to "Unpaid" or "Partially Paid" does not net out payments — a Partially Paid invoice still shows its full Subtotal.



**Negative cases:**

  * **S4-N1:** If no invoices match, the report shows the empty state (Story 16).



* * *

### Story 5: View per-rep summary rows

**As a** user, **I want** a single summary row per contributing sales rep, **so that** I can scan top-down without drowning in invoice detail.

**Design:** TBD **Jira:** TBD

**Prerequisites:** The user is on the report.

**Requirements:**

  * **S5-R1:** A sales rep occupies a summary row **if and only if they have at least one non-reversed invoice matching the current filter set** (date range, product type, invoice status, and location, together). Reps with no matching invoices do not appear — there is no blank placeholder row. A rep's current active/inactive (toggle) state does not affect whether they appear, only how they are labeled (S5-R9).
  * **S5-R2:** The columns appear left-to-right: Date, Invoice, Customer, Status, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Margin, Margin %, Subtotal. (12 columns: four leading identifier columns, seven metric columns, and Subtotal.)
  * **S5-R3:** On a rep summary row, the **Date** cell holds the chevron expand/collapse control followed by the rep's display name (format "First Last"). The date value for that row is intentionally blank.
  * **S5-R4:** The number of invoices contributing to that rep in the current filtered view is displayed in parentheses after the rep's name, in a smaller, subdued grey font — e.g., `Mary Smith (12)`. Because a rep only appears when they have ≥1 matching invoice (S5-R1), the count is always ≥1.
  * **S5-R6:** The Invoice, Customer, and Status cells are blank on rep summary rows. The metric cells carry that rep's totals across all their matching invoices.
  * **S5-R8:** Rep summary rows are visually emphasized with bold text so they read as parent rows above their detail rows.
  * **S5-R9:** **Inactive-rep marker.** When a rendered rep's sales-rep toggle is currently off (or their staff record has been deleted) but they have matching invoices, their display name is followed by a subdued "(Inactive)" tag — e.g., `Mary Smith (Inactive) (12)` — rendered in the same muted grey as the count. A rep whose toggle is currently on shows no tag. The tag is a display marker only; it does not change the rep's metrics, position in the A→Z order, or expandability. For a rep whose staff record has been **deleted** , both the display name and the A→Z sort position come from the denormalized rep-name snapshot on the rep's **most recent matching invoice** (by invoice date, ties broken by invoice number per S6-R9), so a name that drifted across invoices resolves deterministically and the row still shows a historical name and sorts correctly.
  * **S5-R10:** **Column alignment is a hard invariant.** Every rep summary row and every invoice detail row renders exactly the report's column count in the declared left-to-right order; a cell with nothing to show is rendered blank in its position, never shifted or wrapped. **Both forms of the grand Totals indicator are exempt** (the desktop Totals row merges the four leading identifier columns; the mobile bar is not a table row — see S10-R5).



**Negative cases:**

  * **S5-N1:** A staff member with no matching invoice in the current filtered view does not appear, regardless of toggle state or historical activity.
  * **S5-N2:** No row renders with fewer or more cells than the report's column count; a drifted row is a defect (S5-R10).



* * *

### Story 6: Expand a rep to view their invoices

**As a** user, **I want** to expand a rep's row, **so that** I can see the individual invoices that contributed to their totals.

**Design:** TBD **Jira:** TBD

**Prerequisites:** The user is on the report. The rep (or the Unassigned row) is present.

**Requirements:**

  * **S6-R1:** Each rep summary row (and the Unassigned row, Story 22) has a chevron control in the Date cell that toggles its expanded view.
  * **S6-R2:** Activating the chevron **lazily fetches** that rep's matching invoices from the server and reveals them as detail rows beneath the summary row. Invoice detail rows are **not** delivered with the initial summary payload (S10-R5) — they load on the first expand of that rep (with a brief row-level loading indicator) and are paginated per rep when that rep's matching-invoice count is large. _(Context note: the per-rep detail page size, and the bound on how many reps the header expand-all control (S6-R5) opens at once, are build tuning values defined in the tech plan, not fixed by this spec.)_
  * **S6-R3:** Each detail row shows, left to right: the invoice's date, the invoice number, the customer name, the payment status badge, and the per-invoice values for Inv. Hrs and the money columns.
  * **S6-R4:** Detail rows use the default font weight (400); rep summary rows use bold (700). Row type is distinguished by font weight, not background color.
  * **S6-R5:** A header-row chevron in the same column expands every visible rep in one action, and collapses them all on a second activation.
  * **S6-R6:** The header chevron shows the "expand" glyph when at least one rep is collapsed and the "collapse" glyph when every rep is expanded.
  * **S6-R7:** Each invoice appears under exactly one rep (or the Unassigned row) — never more than one.
  * **S6-R8:** Expanded state is preserved across filter and sort changes within the same session; it resets on a full page reload.
  * **S6-R9:** Within an expanded rep (and within the Unassigned row), invoice detail rows are ordered by **invoice date descending** (newest first), tie-broken by **invoice number ascending by the numeric portion after the`P`/`S` prefix** (numeric, not lexical — so `S999` precedes `S1000`); if both the date and the numeric portion tie (e.g., `P100` and `S100` on the same day), `P` (Parts) sorts before `S` (Service). This order is independent of the rep-row column sort (Story 11, which reorders rep summary rows only) and is the same order used in the Expanded View PDF per-rep tables (S14-R6) and the Expanded CSV (S14-R16).



**Negative cases:**

  * **S6-N1:** If a filter change removes a rep from the result set (they no longer have a matching invoice), the rep and its expansion state are gone; if a later filter change brings the rep back, the row renders collapsed (it does not auto-re-expand).
  * **S6-N2:** If the Show Unassigned toggle is turned off while the Unassigned row is expanded, the row is removed; turning the toggle back on renders it collapsed.



**Edge cases:**

  * **S6-E1:** A rep with a single matching invoice can still be expanded; one detail row is shown.



* * *

### Story 8: Invoice payment status badge

**As a** user, **I want** to see at a glance whether each invoice is paid, partially paid, or unpaid, **so that** I do not have to drill into individual invoices.

**Design:** TBD **Jira:** TBD

**Prerequisites:** The user has expanded at least one rep row.

**Requirements:**

  * **S8-R1:** A **Status** column sits between the Customer column and the Inv. Hrs column.
  * **S8-R2:** On every invoice detail row, the Status cell renders a small colored badge reading "Paid," "Partially Paid," or "Unpaid," derived from the invoice's payment status via the five-state → three-value mapping in §3 (so `prepaid` shows **Paid** when the balance owed is zero and **Partially Paid** otherwise; `overpaid` shows **Paid**).
  * **S8-R3:** Paid = dark teal text on light teal; Partially Paid = dark orange on light orange; Unpaid = dark red on light red. These use the application's canonical payment-status color tokens (the same tokens the invoice list uses) so the treatment is consistent app-wide and in both light and dark mode.
  * **S8-R4:** The badge is vertically centered within its cell.
  * **S8-R5:** On rep summary rows, the Status cell is blank.
  * **S8-R6:** The badge's text ("Paid"/"Partially Paid"/"Unpaid") is the accessible label — status is never conveyed by color alone.



**Negative cases:**

  * **S8-N1:** Every invoice on a detail row has a payment status; badge rendering is unconditional on detail rows.



* * *

### Story 9: Inv. Hrs (Labor Delta) column display

**As a** user, **I want** to see whether a rep or invoice was billed for more time than was worked, **so that** I can spot trends without doing math.

**Design:** TBD **Jira:** TBD

**Prerequisites:** The user is on the report.

**Requirements:**

  * **S9-R1:** The column heading reads "Inv. Hrs" (verbatim, including the period after "Inv").
  * **S9-R2:** The value is hours invoiced − hours worked (§3), rounded half-up to one decimal.
  * **S9-R3:** Positive values show a leading `+` in green (e.g., `+1.5`).
  * **S9-R4:** Negative values show a leading `-` in red (e.g., `-1.5`).
  * **S9-R5:** Zero/break-even shows `0.0` in the default text color.
  * **S9-R6:** The same calculation, label, format, and coloring apply to rep summary rows, invoice detail rows, and the totals row (S10-R5, S14-R5/R6). A rep-summary/totals value is round(Σ unrounded per-invoice deltas).



**Negative cases:**

  * **S9-N1:** An invoice with **neither billed labor hours nor clocked technician hours** (e.g., a parts-only invoice with no labor and no time logged) shows Inv. Hrs `0.0` in the default color — never blank, "N/A," or "—". An invoice with **clocked technician hours but no billed labor line** shows the resulting negative delta per §3 (e.g., `-3.0` in red) — this worked-but-unbilled signal is not suppressed to `0.0`.



**Edge cases:**

  * **S9-E1:** A value that rounds to `0.0` (e.g., `+0.04`) shows `0.0` in the default color, not `+0.0` in green.
  * **S9-E2:** Negative values always use an explicit minus and one decimal (e.g., `-0.5`).



* * *

### Story 10: Subtotal column and grand Totals indicator

**As a** user, **I want** the Subtotal column and grand total to be unmistakable and always visible, **so that** I can read the headline numbers no matter how I scroll.

**Design:** TBD **Jira:** TBD

**Prerequisites:** The user is on the report.

**Requirements:**

  * **S10-R1:** Subtotal is the rightmost column on every row type; nothing renders to its right (S5-R10).
  * **S10-R2:** On screen, the Subtotal column is pinned to the right edge and stays visible during horizontal scroll, on every rep summary row and invoice detail row. PDFs do not scroll.
  * **S10-R3:** Subtotal values are bold across the header, every rep summary row, every invoice detail row, and the grand Totals indicator.
  * **S10-R4:** The pinned Subtotal column matches the row's background color (white on body rows, S18-R7.5) — not a contrasting strip.
  * **S10-R5: Grand Totals indicator — responsive.** Present whenever at least one summary row exists (a rep row or the Unassigned row); hidden only during loading (S16-R4) and in the empty state (Story 16). The grand totals are **server-computed over the full filtered result set** — every matching non-reversed invoice across every rep, independent of which rep rows are currently expanded or loaded — and are delivered with the summary payload; the client does not derive them by summing loaded rows.
    * **Desktop ( ≥ 1024px):** a **Totals row** as the last row inside the table. Its first cell is a single merged cell spanning the **four leading identifier columns** (Date, Invoice, Customer, Status) with the label "Totals," followed by an individual cell for each metric column: Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Margin, Margin %, and its own **Subtotal** cell (pinned right, S10-R2). Money uses accounting parentheses for negatives; Margin % is recomputed (§3); values are round(Σ unrounded). The row is sticky at the bottom of the scroll area, on the white card surface with a thin top border.
    * **Mobile ( < 1024px):** a simplified **external totals bar** directly below the table and outside its horizontal scroll container, showing "Totals" left and the grand Subtotal right (no other metrics). Because it is outside the scroll container it is always fully visible horizontally; because the table height is viewport-bounded it sits at the bottom of the report. White card surface, thin top border. During vertical page scroll the bar sits after the table in normal flow (it is not pinned to the viewport bottom).
  * **S10-R6:** On screen, the column-header row is sticky to the top during vertical scroll; the Subtotal header cell is sticky in both axes (top per this rule and right per S10-R2). PDFs have no scroll.



**Negative cases:**

  * **S10-N1:** The Subtotal column is unconditionally present, pinned, and bold on every data row. The grand Totals indicator is present whenever at least one summary row exists (a rep row or the Unassigned row).



* * *

### Story 11: Sort the report

**As a** user, **I want** to sort by any financial column, **so that** I can rank reps by the metric I care about.

**Design:** TBD **Jira:** TBD

**Prerequisites:** The user is on the report with at least one rep row.

**Requirements:**

  * **S11-R1:** The user can sort by any financial column (Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Margin, Margin %, Subtotal).
  * **S11-R2:** Sorting reorders rep summary rows only; invoice detail rows stay grouped under their parent rep, and the Unassigned row (when shown) stays pinned to the top regardless of sort.
  * **S11-R4:** On first load (no remembered sort — Story 23, and before any header click), rows render in **A →Z order** by display name (case-insensitive), with no active/inactive tiers. This is the default.
  * **S11-R5:** **Sort interaction.** Clicking an unsorted financial column header sorts that column **ascending** and shows an ascending direction indicator on it; clicking the same column again toggles to **descending** ; there is no third "cleared" state. Via the column headers there is no way back to A→Z; the report shows the A→Z default whenever a session carries no valid saved financial sort (S23-R3/R5). Sorting is performed **server-side** : changing the sort re-fetches the rep summary rows from the server in the requested order (a loading indicator is shown per S16-R4). Invoice detail rows continue to load lazily per rep on expand (S6-R2).
  * **S11-R6:** **Identifier columns are not sortable** (Date, Invoice, Customer, Status do not respond to header clicks). The Date header carries the expand/collapse-all chevron, not a sort affordance.
  * **S11-R7:** **Tie-break.** When two reps have equal values in the sorted column, they retain the default A→Z order. A Margin % cell rendered "—" (undefined) sorts as zero.



**Negative cases:**

  * **S11-N1:** With only one rep row visible, the sort affordances are present but produce no observable change.



* * *

### Story 12: Navigate to an invoice or customer

**As a** user, **I want** to click into an invoice and press back to return exactly where I was, **so that** I can investigate without resetting my filters, expansion, or scroll.

**Design:** TBD **Jira:** TBD

**Prerequisites:** The user has expanded a rep row.

**Requirements:**

  * **S12-R1:** Each invoice number on a detail row is a clickable link.
  * **S12-R2:** Activating it navigates the current tab to the underlying invoice (work order or parts sale).
  * **S12-R3:** Each customer name on a detail row is a clickable link that navigates the current tab to the customer's record.
  * **S12-R3a:** Pressing the browser back button from either destination returns the user to the report with **all** state intact — date range, product type, invoice status, location, Show Unassigned, every rep's expansion state, and scroll position — exactly as they were. Back-navigation must not trigger a full report reload. (This differs from a deliberate page reload, which restores the persisted filters/columns/sort but resets expansion and scroll — Story 23.)
  * **S12-R4:** **Invoice-number link:** theme-primary color, no underline at rest; an underline appears on hover and on keyboard focus (a visible focus indicator); it does not recolor to browser-purple after a click. Identical in light and dark mode.
  * **S12-R5:** **Customer-name link:** inherits the cell's body text color (never theme-blue), no underline at rest; an underline appears on hover and on keyboard focus; it does not recolor to browser-purple after a click.
  * **S12-R6:** S12-R4/R5 hold across light and dark mode and across return visits.



**Negative cases:**

  * **S12-N1:** If the target invoice is deleted/reversed/unavailable at click time, the tab navigates to the application's standard not-found/access-denied state; back still returns to the report.
  * **S12-N2:** Same for an unavailable customer record.
  * **S12-N3:** Underlined-at-rest links, browser-blue customer names, purple post-click links, and opening destinations in a new tab (`target="_blank"`) are all defects.



* * *

### Story 13: Deactivate a sales rep with customer assignments

**As a** manager removing a sales rep from the active roster, **I want** a clear warning when they still have customer assignments, **so that** I do not silently strand a customer's rep relationship.

**Design:** TBD **Jira:** TBD

**Prerequisites:** The user is editing a staff member from staff administration, in the Owner/Administrator/Manager profile (or a custom role with equivalent access). The staff member is currently active and has the sales-rep toggle on.

**Requirements:**

  * **S13-R1:** When the user toggles the staff member's active status off, the system first runs a precondition check returning the count of distinct customers currently assigned to that staff member as their sales rep, plus a flag indicating whether any assignments exist.
  * **S13-R2:** If there are no assignments, the deactivation applies silently — no dialog.
  * **S13-R3:** If there are assignments, a warning dialog titled "Deactivate {Staff Name}?" opens before any change is applied; the deactivation does not commit until confirmed.
  * **S13-R4:** The dialog body shows "{Staff Name} is the sales rep on {N} customer{s}." — where the noun is singular for N=1 ("1 customer") and plural otherwise ("3 customers") — followed by the reassurance line "Their customer assignments will stay where they are."
  * **S13-R6:** Below the reassurance copy, instruction text reads "Type YES to confirm" (with "YES" emphasized) and a single auto-focused text input.
  * **S13-R7:** The primary action is a "Deactivate" button, disabled until the input matches the confirmation word case-insensitively and ignoring leading/trailing whitespace (`yes`, `YES`, `Yes`, `yes` all enable it). Pressing Enter while valid submits. While disabled, hovering it shows the tooltip "Type YES above to enable."
  * **S13-R8:** The dialog also has a "Cancel" button (red outline) and an "X" close icon. It dismisses (without deactivating) on Cancel, X, or Escape. Clicking outside the dialog does **not** dismiss it. Any dismissal leaves the staff member's active status unchanged.
  * **S13-R9:** On a valid submit, the "Deactivate" button enters the standard in-flight loading state (non-interactive, in-progress indicator) while the request is in flight; the dialog stays open, and Cancel/X/Escape are all non-interactive during the request. On success the dialog closes and the change applies.
  * **S13-R10:** Customer assignments are **not modified** by deactivation. Every customer stays assigned to this rep; denormalized rep names and past invoice snapshots are preserved.
  * **S13-R11:** After deactivation, the staff member's sales-rep toggle state is unchanged by this flow. Because the deactivation set their **staff-active status** to inactive, they appear in the Sales Rep Assignments CSV with "Rep is active?" = "No" (S15-R6) — that column is driven by staff-active status, not the toggle. Separately, if their sales-rep toggle is later turned off, they render with the "(Inactive)" marker (S5-R9) in this report while retaining their credit.
  * **S13-R12:** Focus is trapped within the dialog while open and returns to the invoking control on dismiss.



**Negative cases:**

  * **S13-N1:** A user without staff-administration access cannot reach this flow.
  * **S13-N2:** If the staff member does not have the sales-rep toggle on, the precondition check is skipped and no warning is shown.
  * **S13-N3:** If the staff member is already inactive, this flow does not apply (reactivation has no assignment implications and never shows the dialog).
  * **S13-N4:** If the precondition check itself fails, the system falls back to showing the warning dialog (so the type-to-confirm gate still applies); it never silently deactivates. In this check-failed path the customer count is unavailable, so the dialog **omits the count headline** (S13-R4) and shows only the reassurance line "Their customer assignments will stay where they are." above the "Type YES to confirm" gate.
  * **S13-N5:** If the deactivation request fails server-side, an error toast is shown (§7) and the active status is unchanged; each fresh dialog open requires a fresh confirmation entry (the input clears on open).



**Edge cases:**

  * **S13-E1:** Deactivation never forces reassignment, blocks on assignments, or auto-reassigns; the customer's rep relationship is preserved exactly.
  * **S13-E3:** A deactivated rep can be reactivated anytime via the standard toggle; assignments re-surface immediately with no extra action. Reactivation never shows the warning dialog.



* * *

### Story 14: PDF and CSV exports

**As a** user, **I want** to download the report as a summary or expanded PDF, or as CSV, **so that** I can hand off a polished view or re-pivot the data outside the application.

**Design:** TBD **Jira:** TBD

**Prerequisites:** The user is on the report.

**Requirements:**

  * **S14-R1:** The toolbar's â‹¯ overflow menu lists exactly four actions: "Download Summary (PDF)", "Download Expanded View (PDF)", "Download Summary (CSV)", "Download Expanded View (CSV)".

  * **S14-R2:** All four downloads respect the currently-active filters (date range, product type, invoice status, location, Show Unassigned) and reflect the full result set for those filters, not the on-screen expansion state.

  * **S14-R2a:** All four downloads render rep rows in the report's **currently-active order** — the active on-screen column sort (column + direction) if one is set, otherwise the A→Z default (S11-R4) — with the Unassigned row (when shown) pinned first (S22-R4). All four exports are **generated server-side** and receive the active filters and sort, so their contents and order match the screen.

  * **S14-R3:** Both PDFs are server-rendered and delivered as a file attachment, in A4 portrait, edge-to-edge, with a header strip (on the first page, and on every per-rep page in the Expanded View) showing the workplace name and address, the organization logo, the report title "Sales By Representative," and the selected date range.

  * **S14-R3a:** When the organization has no configured logo, the logo region falls back to the default ShopView logo; the PDF still generates normally.

  * **S14-R4:** A footer reading "Software Powered by ShopView" appears on every page of both PDFs.

  * **S14-R5:** **Summary PDF** — one rolled-up row per rep, in the report's currently-active order (S14-R2a), with an "(Inactive)" tag on toggled-off contributors (S5-R9). Columns: Rep / Inv. Hrs / Labor Invoiced / Labor Margin / Parts Invoiced / Parts Margin / Margin / Margin % / Subtotal. Subtotal bolded across header, body, and the grand totals row; Inv. Hrs colored. The **grand totals row** reads "Totals" in the Rep cell and shows, for each metric column, the grand aggregate across all summary rows in the document — rep rows plus the Unassigned row when Show Unassigned is on (money and Inv. Hrs summed from unrounded values; **Margin % recomputed** as total Margin ÷ total Subtotal, "—" when ≤ 0).

  * **S14-R6:** **Expanded View PDF** — one page-block per rep, in the currently-active order (S14-R2a), page break before each new rep after the first, each with the header strip (which already includes the selected date range per S14-R3), the rep's name, and a per-invoice table: Date / Invoice / Customer / Status / Inv. Hrs / Labor Invoiced / Labor Margin / Parts Invoiced / Parts Margin / Margin / Margin % / Subtotal. Each block ends with a **per-rep totals row** ("Totals" in the Date cell; Invoice/Customer/Status blank; each metric column aggregated as in S14-R5, Margin % recomputed). There is no grand-totals row across all reps.

  * **S14-R7:** In the Expanded View PDF, invoice numbers longer than 18 characters are truncated to the first 18 characters followed by an ellipsis (not counted toward the 18); numbers of 18 characters or fewer are shown in full with no ellipsis. On screen, invoice numbers are never truncated.

  * **S14-R8:** The Expanded View Status column renders the same colored badge as on screen, vertically centered.

  * **S14-R9:** Negative dollar values in either PDF render in accounting parentheses — `($1,234.56)`. No extra color treatment.

  * **S14-R10:** The on-screen `(N)` invoice count does not appear in either PDF (it is an on-screen annotation). The "(Inactive)" tag (S5-R9) **does** render on toggled-off contributors' rep names in both PDFs — consistent with S14-R5 and the CSV (S14-R17). Rep names otherwise render plainly.

  * **S14-R11:** PDF filenames are deterministic: `sales-by-representative-summary.pdf` and `sales-by-representative-expanded.pdf`.

  * **S14-R12:** Both PDFs adapt body font size to the data on this exact scale. Scan **every formatted _positive_ dollar value in the document, including the totals-row values**, take the longest, and map its character count to the **base** body font size below. Negative values do not set the base tier — they are handled solely by the one-tier fit rule in S14-R14. If the document contains no positive dollar value (e.g., the all-`$0.00` empty export per S14-E3, or an all-negative result), the base tier is the **11px** ceiling; because the S14-R14 shift is defined relative to the largest positive value, it does not apply when no positive value exists, so the tier stays 11px:

Longest formatted dollar value | Body font size
---|---
9 characters or fewer (e.g., `$1,234.56`) | **11px**
10 characters (e.g., `$12,345.67`) | **10px**
11 characters (e.g., `$100,000.00`) | **9px**
12 characters or more (e.g., `$1,000,000.00`) | **8px**

8px is the floor and 11px the ceiling.

  * **S14-R13:** Column widths are fixed for the worst-case value range regardless of tier; the layout never breaks.

  * **S14-R14:** Tier selection uses the longest formatted **positive** value (per S14-R12). If a negative value's parenthesized rendering is longer than the largest positive, the export shifts the base tier **one step smaller** to better accommodate the negative, **clamped at the 8px floor** (if already at 8px, it stays 8px). This one-step shift is a readability courtesy, not the overflow guarantee — the fixed column widths (S14-R13) prevent overflow in all cases regardless of the chosen tier.

  * **S14-R15:** **Summary CSV** — file `sales-by-representative-summary.csv`, UTF-8 BOM, one header row + one row per rep in the current filtered view, in the currently-active order (S14-R2a). Headers, in order: `Sales Rep`, `# Invoices`, `# Customers`, `Hrs Worked`, `Hrs Invoiced`, `Inv. Hrs`, `Labor Invoiced`, `Labor Margin`, `Parts Invoiced`, `Parts Margin`, `Margin`, `Margin %`, `Subtotal`. Generated server-side against the current filters and active sort (S14-R2a).

  * **S14-R16:** **Expanded CSV** — file `sales-by-representative-expanded.csv`, UTF-8 BOM, one header row + one row per invoice flattened across all reps in the currently-active order (S14-R2a), for the current filtered view. Headers, in order: `Sales Rep`, `Date`, `Invoice #`, `Customer`, `Status`, `Hrs Worked`, `Hrs Invoiced`, `Inv. Hrs`, `Labor Invoiced`, `Labor Margin`, `Parts Invoiced`, `Parts Margin`, `Margin`, `Margin %`, `Subtotal`. Generated server-side against the current filters and active sort (S14-R2a). (Build note: the current build populates a single mislabeled hours column here; align it to these three hours columns to match the Summary CSV and the screen.)

  * **S14-R17:** **CSV cell formatting** (both CSVs): numeric columns are emitted as plain numbers for re-pivoting — **no** currency symbol, thousands separators, or parentheses; a negative value uses a leading minus (`-1234.56`). Money values carry two decimals; `Hrs Worked` / `Hrs Invoiced` / `Inv. Hrs` carry their full stored precision; `Inv. Hrs` keeps its leading `+`/`-` sign. `Margin %` is a number to one decimal (e.g., `45.2`), left **empty** when Margin % is undefined (Subtotal ≤ 0). `Sales Rep` names carry the "(Inactive)" tag when applicable; the on-screen `(N)` count is not embedded in the name. Text fields are quoted per standard CSV escaping.

  * **S14-R18:** **# Invoices** = the count of the rep's matching invoices in the current filtered view (same as the on-screen `(N)`). **# Customers** = the count of distinct customers across those matching invoices (de-duplicated across locations when several are selected).

  * **S14-R19:** **Unassigned row in exports.** When Show Unassigned is on, the Unassigned row is emitted in all four downloads exactly as it appears on screen: in the Summary PDF and Summary CSV as one rolled-up row whose Rep / `Sales Rep` cell reads the literal "Unassigned" (sorted to the top per S22-R4); in the Expanded CSV, its invoices carry `Sales Rep` = "Unassigned"; in the Expanded View PDF as its own top page-block titled "Unassigned". The Summary PDF grand-totals row aggregates across all summary rows including Unassigned (S14-R5); in the Summary CSV, the Unassigned row is simply one of the data rows (the CSV has no totals row, S14-R15). When Show Unassigned is off, no Unassigned row or unassigned invoices appear in any export.

  * **S14-R20:** **Location in exports.** Whenever the Location column is shown on screen (S21-R7), it is included in all four exports in the same position it occupies on screen — Summary and Expanded, PDF and CSV: a Summary (rolled-up) row carries the rep's location, reading **Multiple** when that rep spans more than one location; an Expanded (per-invoice) row carries that invoice's own exact location. In addition, every export (each PDF and each CSV, Summary and Expanded) includes a "Locations:" line naming the location or locations the report is scoped to, or "All locations" when every location the user has access to is selected — matching the on-screen scope. In a PDF the "Locations:" line appears in the header strip; in a CSV it appears as a leading metadata line above the column-header row.




**Negative cases:**

  * **S14-N1:** If a PDF fails to generate, an error toast is shown (§7).
  * **S14-N2:** All four exports are generated **server-side** against the active filters and sort, not from loaded screen data, so the former client-side "export from unloaded or partially-loaded data" failure mode no longer exists. A genuine server-side export failure (no file produced) shows an error toast (§7) and downloads nothing — never a malformed file. (This is distinct from an empty-but-loaded result, which produces a valid header-row-only file — S14-E3.)
  * **S14-N3:** Users without Reports-section access do not see the â‹¯ menu.



**Edge cases:**

  * **S14-E1:** While a PDF is generating, the action shows a loading state and is non-interactive until delivered.
  * **S14-E2:** The Expanded View PDF is server-generated and **row-capped**. When the current filter set would produce more invoice detail rows than the export's row cap of 10,000 data rows, the server does **not** produce a truncated file — it declines to generate and an error toast is shown reading "This export is too large to generate. Narrow the date range or filters and try again." (§7). Below the cap, the Expanded View PDF may still be large for many reps × many invoices, and that is expected. _(Context note: the row cap is 10,000 data rows.)_
  * **S14-E3:** **Empty-data export still generates.** Triggering any of the four downloads against a filter set with zero matching invoices produces a file, not an error (S14-N2 applies only to a genuine load failure where no result returned, not to an empty-but-loaded result). The Summary PDF renders the header strip, no data rows, and a grand-totals row showing zeros for the money and Inv. Hrs columns and "—" for Margin % (Subtotal ≤ 0, per §3). The Expanded View PDF (no grand-totals row, S14-R6) renders just the header strip with no per-rep blocks. Both report CSVs generate a header-row-only file (with the UTF-8 BOM). No special "empty" treatment.



* * *

### Story 15: Sales Rep Assignments CSV export

**As a** manager, **I want** a snapshot of every current customer→rep assignment, **so that** I can review who is assigned to whom without compiling it by hand.

**Design:** TBD **Jira:** TBD

**Prerequisites:** The user has Reports access and has opened the Export Reports dialog from the Reports left sidebar (Accounting header → "Export Reports" entry; the dialog is titled "Export Report").

**Requirements:**

  * **S15-R1:** The dialog's Report Name dropdown includes "Sales Rep Assignments," appended at the bottom of the list (additive).
  * **S15-R2:** Selecting it hides the date range picker and shows the note: "Snapshot of current sales rep assignments. Both active and inactive reps with assignments are listed."
  * **S15-R3:** The Export action downloads `sales-rep-assignments.csv` and shows a success toast (§7).
  * **S15-R4:** The CSV has a header row + one row per customer. Headers, in order: `Customer Name`, `Sales Rep`, `Rep is active?`. UTF-8 BOM prepended.
  * **S15-R5:** Every customer in the organization with an assigned sales rep produces one row. (Single-rep model: one rep per customer, so one row per customer.)
  * **S15-R6:** `Rep is active?` = `Yes` when the rep's staff record is currently **active** ; `No` when the staff record is **inactive** (e.g., deactivated via Story 13) or has been deleted while the customer still references it. This column reflects the staff member's **active status** — a distinct flag from the sales-rep toggle that drives the report's "(Inactive)" marker (S5-R9). The two can differ (a rep can be staff-active but toggle-off, or toggle-on but staff-inactive); this column tracks staff-active status only.
  * **S15-R7:** Rows are sorted by customer name A→Z (primary), then rep name A→Z (secondary).
  * **S15-R8:** The export is robust to legacy data: a customer whose assigned rep's staff record was cleared or deleted still produces a row, sourced from the customer-side denormalized rep name, with `Rep is active?` = `No`.
  * **S15-R9:** When the denormalized rep-name snapshot differs across customers for the same underlying rep (name drift over time), the export uses each customer's own stored snapshot in that customer's row; drift never adds extra rows for a customer (still one row per customer, S15-R5) and never overwrites one customer's snapshot with another's.
  * **S15-R10:** Customers with no assigned rep are not included.
  * **S15-R11:** If generation errors out, an error toast is shown (§7).



**Negative cases:**

  * **S15-N1:** Users without Reports access cannot reach the dialog or trigger this download.
  * **S15-N2:** With zero assigned customers, the CSV downloads with a header row and no data rows, and the dialog shows its empty-export warning: "There is no data to export for the selected report." (§7).



* * *

### Story 16: Loading, empty, and error states

**As a** user, **I want** clear feedback while the report loads, when it's empty, or when it fails, **so that** I never mistake one state for another.

**Design:** TBD **Jira:** TBD

**Prerequisites:** The user is on the report.

**Requirements:**

  * **S16-R1:** **Empty state.** When the current filter set produces no rep rows (no rep has a matching invoice and — if Show Unassigned is on — there are no matching unassigned invoices either), the table shows no data rows and the empty-state message "No sales activity matches the current filters." The grand Totals indicator is not shown.
  * **S16-R2:** The same empty state is shown when no staff member has ever been credited with an invoice in the current view — there is no separate "no reps configured" message; the report is contributor-driven.
  * **S16-R3:** The toolbar (filters, column selector, exports) stays visible and interactive in the empty state.
  * **S16-R4:** **Loading state.** On the initial load and on every filter-triggered re-fetch, the table shows the standard reports loading indicator (a centered spinner over the data area); the grand Totals indicator is hidden during loading. The toolbar stays interactive so the user can change filters. A re-fetch replaces the previous data only when the new data returns (no flash of blank table mid-fetch beyond the spinner overlay).
  * **S16-R5:** **Error state.** If the initial load or a re-fetch fails (network or server error), the data area shows an inline error message "Couldn't load the report. Please try again." with a "Retry" action that re-runs the current request. Filters and toolbar remain interactive; the failure does not clear the user's filter selections.



**Negative cases:**

  * **S16-N1:** When at least one rep row (or the Unassigned row) is in the result set, the rep list renders and none of the empty/error messages are shown.



* * *

### Story 17: Mobile usability

**As a** user on a phone, **I want** every filter, control, and export to work on touch, **so that** I can use the report away from a desk.

**Design:** TBD **Jira:** TBD

**Prerequisites:** The user opens the report on a phone-sized viewport.

**Requirements:**

  * **S17-R1:** All toolbar controls (â‹¯ exports, column selector, Show Unassigned toggle, date range picker, Product Type, Invoice Status, Location) are visible and operable on touch.
  * **S17-R2:** Below 1024px the toolbar controls stack vertically at full width; at 1024px and above the desktop layout applies.
  * **S17-R3:** The â‹¯ exports button is the first control in the toolbar's action cluster (leftmost of the actions). On mobile it wraps to a partial row above the stacked controls.
  * **S17-R4:** The data table scrolls horizontally to expose all columns; the pinned Subtotal column stays visible at the right edge during horizontal scroll. The mobile external totals bar is outside the horizontal scroll container and does not scroll horizontally (S10-R5).
  * **S17-R5:** The chevron expand/collapse control works on touch.
  * **S17-R6:** All interactive controls in the dense table (chevrons, toggles, the â‹¯ button, the dialog's X) present a touch target of at least 44×44 px.



**Negative cases:**

  * **S17-N1:** Hover-only tooltips are not shown on touch; the icons communicate the action, and each icon-only control carries an accessible name (S18-R9).



* * *

### Story 18: Visual conformance and accessibility

**As a** user, **I want** the report to use a clean, consistent, accessible layout, **so that** I do not have to re-learn it and can use it with assistive technology.

**Design:** TBD **Jira:** TBD

**Prerequisites:** The user is on the report.

**Requirements — layout/theme:**

  * **S18-R1:** The toolbar has a solid white background with padding **32px top / 24px bottom / 2rem left and right**. The title's left edge aligns with the leftmost data column; the rightmost toolbar control (the Location filter) aligns its right edge with the rightmost data column.
  * **S18-R2:** The data area sits on the application's standard blue-grey page background.
  * **S18-R3:** A thin horizontal separator line sits between the toolbar and the column headers.
  * **S18-R4:** Row types are differentiated by font weight and color, not background color.
  * **S18-R5:** The table extends edge-to-edge against the side navigation.
  * **S18-R6:** Status badges are vertically centered on detail rows.
  * **S18-R6a:** Column alignment holds on every table row type (S5-R10); Subtotal is always rightmost. Both forms of the grand Totals indicator are exempt.
  * **S18-R7:** Normative visual rules (self-contained; no external lookup):
    * **S18-R7.1:** Page background = standard blue-grey (light) / standard dark (dark); zero horizontal page padding so the toolbar and table are edge-to-edge.
    * **S18-R7.2:** Toolbar surface white (light) / dark (dark); toolbar contents padded per S18-R1. Toolbar control order, left to right within the action cluster: â‹¯ exports, Column Selection, Show Unassigned, Date Range, Product Type, Invoice Status, Location.
    * **S18-R7.3:** A thin separator between toolbar and column-header row.
    * **S18-R7.4:** Column-header cells and all body cells render on white (dark equivalents in dark mode); the grand Totals indicator also renders on the white/dark card surface with a thin top border.
    * **S18-R7.5:** The pinned Subtotal column matches the row background (white on body rows), not a contrasting strip.
    * **S18-R7.6:** These rules are the normative spec for this report. If app-wide report styling evolves later, this report's treatment is updated in a new spec round; this spec is the source of truth.
  * **S18-R8: Dark mode.** Page, toolbar, header, body cells, and the grand Totals indicator switch to their dark equivalents; status badges keep the same tokens (S8-R3) and stay legible in both modes; Inv. Hrs green/red use the app's positive/negative tokens (mode-appropriate). PDFs always render in light-mode colors.



**Requirements — accessibility:**

  * **S18-R9:** Every icon-only control has an accessible name: â‹¯ exports = "Report actions"; column selector = "Show or hide columns"; per-row chevron = "Expand {rep name}" / "Collapse {rep name}"; header chevron = "Expand all reps" / "Collapse all reps"; dialog X = "Close".
  * **S18-R10:** The row chevrons and the sortable column headers are keyboard-focusable and activate on Enter/Space; a chevron exposes its expanded/collapsed state and a sortable header exposes its current sort state to assistive technology.
  * **S18-R11:** The subdued-grey used for the `(N)` count and the "(Inactive)" tag meets at least WCAG AA contrast (≥ 4.5:1) against the white body surface in light mode and against the dark surface in dark mode; the reduced font size does not drop it below that ratio.
  * **S18-R12:** No information is conveyed by color alone: Inv. Hrs carries its `+`/`-` sign, status badges carry their text label (S8-R6), and links carry a hover/focus underline (S12-R4/R5).
  * **S18-R13:** When shown (S21-R7), the **Location** column appears at the end of the leading identifier group — immediately after the **Status** column and before the first metric column (Inv. Hrs) — on every rep summary row and invoice detail row, matching the Location column's placement across the reports suite; it never displaces the pinned **Subtotal** column, which stays rightmost (S10-R1). The toolbar's **Location filter** control keeps a **constant width** regardless of the selected label (a single location name, several names, or "All Locations"), so the toolbar layout does not shift as the selection changes.



**Negative cases:**

  * **S18-N1:** The visual and accessibility rules apply unconditionally whenever the report is rendered.



* * *

### Story 19: Work Order Sales Rep assignment

**As a** service manager or writer, **I want** to assign a Sales Rep on a Work Order, **so that** invoices from that WO carry the correct rep credit without post-invoice correction.

**Design:** TBD **Jira:** TBD

**Prerequisites:** The user has an open Work Order or Part Sale WO.

**Requirements:**

  * **S19-R1:** The left panel includes a "Sales Rep" selector on both standard Work Orders and Part Sale WOs. It is hidden on imported Work Orders and in History mode.
  * **S19-R2:** The selector offers reps whose sales-rep toggle is currently on. Reps whose toggle is off are not offered as new selections.
  * **S19-R3:** A new Work Order or Part Sale WO opens with the Sales Rep field **unassigned** ; the user assigns it explicitly. (The report still credits correctly when the WO is left unassigned — S19-R6 — so pre-filling at creation is not required.)
  * **S19-R4:** Changing the Sales Rep persists immediately, with no separate Save step (save-on-change).
  * **S19-R5:** The selector is read-only (non-interactive) when the WO status is "Invoiced" or "Paid".
  * **S19-R6:** At invoice creation, the WO's Sales Rep is snapshotted onto the resulting invoice, and that snapshot is what the report reads. When the WO has no rep, the snapshot falls back to the **customer's** assigned rep; when that is also absent, the invoice is unassigned (appears only under the Unassigned row, Story 22).
  * **S19-R7:** The customer record's left-panel sidebar shows a single "Sales Rep" row with the customer's assigned rep; when none is assigned it renders "Unassigned".
  * **S19-R8:** The selector carries an accessible name "Sales Rep".



**Edge cases:**

  * **S19-E1:** If the rep bound to a WO has since had their toggle turned off, the selector renders that rep's name with an "(Inactive)" indicator so the current assignment is visible; that rep is not offered as a new selection.



**Negative cases:**

  * **S19-N1:** The selector is not present on imported Work Orders.
  * **S19-N2:** Changing a WO's Sales Rep does not retroactively alter invoices already created from it.



* * *

### Story 20: Column selector

**As a** user, **I want** to show or hide the metric columns, **so that** I can focus on the numbers I care about.

**Design:** TBD **Jira:** TBD

**Prerequisites:** The user is on the report.

**Requirements:**

  * **S20-R1:** The toolbar includes a column selector button opening a dropdown of the seven toggleable metric columns, each with a toggle switch.
  * **S20-R2:** The seven toggleable columns are: Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Margin, Margin %.
  * **S20-R3:** The five always-visible columns (Date, Invoice, Customer, Status, Subtotal) do not appear in the dropdown and cannot be hidden.
  * **S20-R4:** Toggling a switch immediately shows/hides that column — no confirm step.
  * **S20-R5:** Column visibility is persisted and restored per Story 23.
  * **S20-R6:** On first visit (no remembered preference), all seven metric columns are visible.
  * **S20-R7:** Hiding a metric column removes it from rep summary rows, invoice detail rows, and the grand Totals indicator simultaneously.
  * **S20-R8:** The column selector state does not affect any export; all four downloads always include all metric columns.
  * **S20-R9:** Hiding the column that is currently the active sort column does not clear the sort; rows stay ordered by that (now-hidden) metric until the user picks another sort or the A→Z default is restored (Story 23). Showing the column again reveals the sort indicator on it.



**Negative cases:**

  * **S20-N1:** With all seven metric columns hidden, the table still renders the five always-on columns and the grand Totals indicator; it is not an empty or error state.



* * *

### Story 21: Filter the report by location

**As a** user who works across more than one location, **I want** to scope the report to one, several, or all locations, **so that** I can review rep performance per shop or org-wide.

**Design:** TBD **Jira:** TBD

**Prerequisites:** The user is on the report and has access to more than one location.

**Requirements:**

  * **S21-R1:** A location filter is the **rightmost** control in the toolbar — a multi-select listing the locations the user has access to, plus an "All Locations" option.
  * **S21-R2:** On first load (no remembered setting — Story 23), the filter defaults to the user's **currently active location** only (the location currently selected in the application's location switcher). The default view is thus scoped to the one location the user is working in.
  * **S21-R3:** The user can select several specific locations or "All Locations." Changing the selection re-fetches and re-renders scoped to the chosen set.
  * **S21-R4:** Location is part of the contributor gate and cascades through every metric (like S3-R8): a rep appears only if they have ≥1 matching invoice at the selected location(s); rep totals, detail rows, the grand Totals indicator, and the (N)/# counts all reflect only invoices at those locations. An invoice's location is its originating work order's / parts sale's location (§3).
  * **S21-R5:** Scoping is always constrained to the user's accessible locations; "All Locations" means all locations the user can access, never beyond. A location the user cannot access is never included.
  * **S21-R6:** All four exports respect the active location filter.
  * **S21-R7:** A per-row **Location** column is shown on the report **only when the current view spans more than one location** — i.e., when more than one location is in scope (several locations selected, or "All Locations" resolving to more than one accessible location). When the view is scoped to a single location the column is **hidden** ; the one location is already unambiguous.
  * **S21-R8:** When the Location column is shown (S21-R7), its cell reads: on a **rep summary row** , that rep's single location name when all of the rep's matching invoices are at one location, or the literal **Multiple** when they span more than one location; on an **invoice detail row** , that invoice's own exact location (its originating work order's / parts sale's location, §3). "Multiple" is used verbatim. The Unassigned summary row (Story 22) follows the same rule as any rep summary row.



**Negative cases:**

  * **S21-N1:** A single-location user still sees the filter with one selectable location; behavior is unchanged from single-location use.
  * **S21-N2:** If the selected location(s) produce no matching invoices, the report shows the empty state (Story 16).



* * *

### Story 22: Show Unassigned invoices

**As a** manager, **I want** to optionally include invoices with no assigned sales rep, **so that** I can see uncredited revenue and follow up.

**Design:** TBD **Jira:** TBD

**Prerequisites:** The user is on the report.

**Requirements:**

  * **S22-R1:** A "Show Unassigned" toggle sits in the toolbar between the column selector and the date range picker (per the S18-R7.2 order). It is **off by default** (no remembered setting — Story 23).
  * **S22-R2:** When off, invoices with no assigned rep contribute to nothing — no row, not counted in any total.
  * **S22-R3:** When on, a single **" Unassigned"** summary row rolls up every matching invoice (respecting all other active filters) that has no assigned rep. The label is "Unassigned" verbatim.
  * **S22-R4:** The Unassigned row is **pinned to the top** of the table, above the A→Z reps, and stays pinned regardless of sort (S11-R2).
  * **S22-R5:** The Unassigned row behaves like any rep summary row: same metric columns, the `(N)` count, expandable (S6-R1) to its contributing invoices, and included in the grand Totals indicator. It never carries an "(Inactive)" tag.
  * **S22-R6:** Toggling Show Unassigned re-renders the report and recomputes the grand Totals indicator to include or exclude the Unassigned row accordingly.



**Negative cases:**

  * **S22-N1:** When the toggle is on but there are no matching unassigned invoices, no Unassigned row is shown (an empty Unassigned row is never rendered); if there are also no rep rows, the empty state applies (Story 16).



* * *

### Story 23: Remember filters and view

**As a** user, **I want** the report to remember how I set it up, **so that** I don't re-apply my filters and column choices every visit.

**Design:** TBD **Jira:** TBD

**Prerequisites:** The user is on the report.

**Requirements:**

  * **S23-R1:** The report remembers, per browser, the user's filter and view settings: date range (incl. custom start/end), product type, invoice status, location, Show Unassigned, column visibility, and the active column sort (column + direction). On the next visit — including after leaving and returning, or a page reload — these are restored before the first data fetch.
  * **S23-R2:** The report does **not** remember expansion state or scroll position; both reset on reload. (Browser back-navigation from a drilldown is the exception that restores everything — S12-R3a.)
  * **S23-R3:** Restoration is **defensive** : a remembered value that is no longer valid (a location the user can no longer access, a range or sort column that no longer exists, a hidden-but-sorted column) falls back to that setting's default rather than being sent to the server. A stale saved setting can never cause an error or an invalid request.
  * **S23-R4:** With no saved settings (first visit): date range This Month (S2-R7), Product Type "Parts & Service" (S3-R3), Invoice Status "All Statuses" (S4-R3), Location = active location (S21-R2), Show Unassigned off (S22-R1), all seven metric columns visible (S20-R6), sort = A→Z default (S11-R4).
  * **S23-R5:** The "A→Z default" is a distinct saved value from a financial-column sort; restoring a saved state with no active financial sort returns the report to the A→Z default (S11-R4), not to an arbitrary column.



**Negative cases:**

  * **S23-N1:** Clearing browser storage returns the report to first-visit defaults (S23-R4). No server-side profile is kept.



* * *

## 7. User Feedback Summary

Every message below is the exact, normative wording — no synonyms, no rephrasing.

Trigger | Message | Behavior
---|---|---
Report data fails to load (initial or re-fetch) | "Couldn't load the report. Please try again." | Inline message in the data area with a "Retry" action (S16-R5)
Report empty for current filters | "No sales activity matches the current filters." | Inline empty-state message in the data area (S16-R1)
Download Summary (PDF) fails | "Ooooops! An error occured" | Error toast, persists 120s (or until dismissed)
Download Expanded View (PDF) fails | "Ooooops! An error occured" | Error toast, persists 120s (or until dismissed)
Download Summary/Expanded (CSV) fails | "Ooooops! An error occured" | Error toast, persists 120s (or until dismissed)
Expanded View PDF export exceeds the row cap | "This export is too large to generate. Narrow the date range or filters and try again." | Error toast, persists 120s (or until dismissed) (S14-E2)
Sales Rep Assignments CSV export succeeds | "Success" with caption "Report downloaded." | Success toast, auto-fades after 5s
Sales Rep Assignments CSV export fails | "An error occurred while exporting the report. Please try again." | Error toast, auto-fades after 5s
Sales Rep Assignments — nothing to export | "There is no data to export for the selected report." | Dialog warning (S15-N2)
Deactivation succeeds | (No toast — the staff edit dialog closes.) | —
Deactivation fails (server error) | "Ooooops! An error occured" with caption "For more information, please contact support. Include your request ID: [{request-id}] when reaching out for faster assistance." | Error toast, persists 120s (or until dismissed)

The "Ooooops! An error occured" wording (typo-as-shipped) is the canonical ShopView fallback for system/generation errors, used for the four report-download failures and the deactivation server error. The **Sales Rep Assignments** export is the one deliberate exception: it is delivered through the shared Export Reports dialog and uses that dialog's own success/failure/empty strings (rows above), which auto-fade at 5s. The **Expanded View PDF row-cap guardrail** (S14-E2) is a second deliberate exception: it is a pre-generation refusal, not a generation failure, and carries its own specific message (row above) rather than the canonical fallback. All other error toasts on this report use the canonical string.

## 8. Change Log

Date | Reporter | Change
---|---|---
2026-07-11 | @claude | Report renamed to **" Sales By Representative"** (full word). S1-R1/R5/R6 updated; S1-R7 added (nav padding must fit the longer label). PDF title + export filenames → `sales-by-representative-*`.
2026-07-11 | @claude | Money-column labels standardized (Labor/Parts **Margin** , **Margin** , new **Margin %**). Concrete definitions added in §3 for Subtotal (Labor+Parts Invoiced, pre-tax), Margin (invoiced − cost), Margin % (Margin÷Subtotal, 1dp, "—" when ≤ 0, **recomputed on every aggregate, never summed**), Inv. Hrs (billed labor-line hours − technician clocked hours), payment status, invoice date, invoice location, reversed, and half-up rounding.
2026-07-11 | @claude | Filters: "Type" → **" Product Type"** (Story 3); added **" All Time"** (S2-R6/R8); added **Story 21 (Location filter)** ; added **Story 22 (Show Unassigned)** ; added **Story 23 (Remember filters/view)** ; §2 Out of Scope corrected (filters/columns/sort persist; expansion/scroll do not). Toolbar order locked (S18-R7.2).
2026-07-11 | @claude | **Rep universe = contributors-only + plain A →Z** (per owner decision). A rep appears only if ≥1 non-reversed invoice matches ALL active filters (S5-R1); no blank placeholder rows (removed the prior blank-zero-row rules); empty state when none (Story 16). Default sort plain A→Z, no active/inactive tiers (S11-R4). _(Build delta: current handler seeds all toggle reps + tiered sort → change to contributors-only + A→Z.)_
2026-07-11 | @claude | **Toggled-off contributors still appear, credited, marked "(Inactive)"** (S5-R9, §3, S13-R11) so grand Totals reconcile to the period's invoices.
2026-07-11 | @claude | **Single sales-rep model locked** (per owner decision, reaffirming the 2026-05-19 intent): one rep per customer/WO/invoice; snapshot = WO rep → customer rep → Unassigned (§3, Assumptions, S19-R6/R7, S13, S15). _(Build delta: shipped schema stores dual parts/service reps → collapse to one + rework invoice crediting.)_
2026-07-11 | @claude | Story 19: dropped the create-time "default to customer's rep" (ambiguous, redundant with the invoice-time fallback); field opens unassigned (S19-R3), invoice-time fallback stated (S19-R6). WO selector save-on-change (S19-R4) and read-only-when-Invoiced/Paid (S19-R5) now stated inline (no reference to another feature).
2026-07-11 | @claude | Exports hardened: server-rendered PDFs; totals-row Margin % recomputed (S14-R5/R6); font-tier scan includes totals values and clamps at the 8px floor (S14-R12/R14); Expanded CSV given the same three hours columns as the Summary CSV (S14-R16, build-delta noted); CSV numeric formatting rule added (S14-R17, plain numbers, `Margin %` empty when undefined); `# Invoices`/`# Customers` defined (S14-R18); on-screen invoice numbers not truncated (S14-R7).
2026-07-11 | @claude | Contradiction fixes from the 10-reviewer audit: desktop Totals merged cell spans **four** leading identifier columns, not five (S5-R10, S10-R5); Assignments "Rep is active?" value is **Yes/No** , not "Deactivated" (§3/S13-R11/S15-R6); §7 error-toast note scoped truthfully; deactivation dialog pluralizes "customer/customers" (S13-R4); sort direction/toggle/indicator + tie-break specified (S11-R5/R7); mobile totals-bar scroll behavior clarified (S10-R5); â‹¯/Location toolbar positions reconciled (S18-R1, S18-R7.2).
2026-07-11 | @claude | New: **Story 16 rewritten** to cover loading, empty, and error states with verbatim strings (§7); **Story 18 accessibility block** added (icon-control names, keyboard, focus trap, contrast, touch targets, no-color-only); §1 softened (no bulk-reassignment feature); §2 Feature Overview now lists the deactivation flow and the customer-record rep display.
2026-07-21 | @chris / @claude | Milan re-review resolution: **payment status** now maps all five canonical system states (`unpaid`, `prepaid`, `partially_paid`, `paid`, `overpaid`) to the three display values, with `prepaid` = **Paid** when balance owed is zero, else **Partially Paid** (`overpaid` = **Paid**); mapping made the single source of truth for both the status badge (S8-R2) and the Invoice Status filter predicate (S4-R4) (§3). Added an Expanded View PDF **row-cap guardrail** (10,000 data rows) with a verbatim "too large / narrow the date range or filters" message (S14-E2, §7). Added tech-plan context notes for per-rep detail page size and bounded expand-all (S6-R2). Verified the S14-R12 font-size tier table is intact (all four rows, 8px floor / 11px ceiling) — no loss found in local files, the 2026-07-16 snapshot, or live.
2026-07-16 | @chris / @claude | Removed **All Time** (D1); capped **Custom** at a **366-day** max span (D3); moved data fetching **server-side** — lazy per-rep invoice drill-down (S6-R2), all four exports server-generated against filters + sort (S14-R2a/R15/R16), server-side sort (S11-R5), server-computed grand totals over the full filtered set (S10-R5); removed the S14-N2 client-side failure mode; header cleanup (removed the loose Companion Video and status-badge paragraphs, unified to the 4-row header table). Per Milan Zivanovic's 2026-07-15 engineering review; the server-side model is the committed build target (spec ahead of current code by design).
2026-07-29| @chris / @claude| Added a per-row **Location** column, shown only when the current view spans more than one location: a rep summary row spanning more than one location reads **Multiple** , a single-location rep row reads that location's name, and each invoice detail row reads its exact location (§2, §3, §4, S21-R7/R8, S18-R13); the column is carried into all four exports and every export gains a "Locations:" line naming the scope (S14-R20); the Location filter control is constant-width (S18-R13). Padding watch: the report's display label "Sales By Representative" is longer than the "Sales By Rep" shorthand — verify the nav entry, toolbar title, and PDF header strip fit the full label without truncation (S1-R7).
