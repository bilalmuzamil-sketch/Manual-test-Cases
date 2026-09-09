# Printer Friendly Work Orders (SV-9383, suite 6617) — FULL source re-verification

**Run date:** 2026-09-09 (READ-ONLY; no TestRail writes, no case edits)
**Spec:** Confluence page **519176194** "Printer Friendly Work Orders"
**Fetched live** via `getConfluencePage`, contentFormat=markdown.

## Spec metadata (as returned live 2026-09-09)

| Field | Value |
|---|---|
| Title | Printer Friendly Work Orders |
| Status | current |
| **Last Modified** | **Sep 07, 2026** |
| Author (last modifier) | **Sasha Grosman** |
| Space | ~7120207b… (Sasha Grosman personal space) |
| Owner (in body) | Milos Vasic / Branko Cicovic |
| Epic | SV-9383 |
| Newest change-log entry | **2026-04-19** — @sasha, "Print disabled tied to data loading" (the in-body Change Log has NOT been maintained past 2026-04-19, so it does not reflect the Aug/Sep edits; last-modified is the reliable currency signal) |

### Version integer — NOT directly readable (known repo blocker)
The `getConfluencePage` MCP call does **not** expose the Confluence version integer in any
content format (documented in `build/BLOCKED-confluence-version-integers.md`: "the only
version-bearing MCP call returns the whole page body"). What IS observable:

- The cases cite **"specification version 8"**, which was the spec as of case authoring (25 Aug 2026).
- The task baseline: verified 2026-09-07 against the spec **as last-modified 2026-09-06**.
- Live now: **last-modified 2026-09-07**. So the page **HAS moved by (at least) one save since
  the 9/6 baseline** — i.e. the spec is no longer at the exact revision the "version 8" label was
  attached to. A single Confluence save increments the integer by 1, so the live revision is
  most plausibly **version 9** (last-modified 9/7) but this cannot be *confirmed* from the
  available tooling.
- **Materially, the requirement text is byte-for-substance identical** to what the 44 cases
  encode. Every S#-R#/N#/E# below still matches. The move produced **no requirement change**
  detectable in the body — it appears to be a non-substantive edit (e.g. metadata/formatting).

### Recommended stamp (see final reply for the one-line answer)
Because the integer cannot be verified and the page has moved past the "version 8" revision,
the fragile absolute "version 8" should be replaced by the **page-id + read-date anchor** that
two cases (45088, 45116) already use — this is Rule-42 compliant (no absolute enumeration
without a verifiable version anchor). Proposed uniform stamp:
> "…the Printer Friendly Work Orders specification (Confluence page 519176194), section <S#-…>,
> read on 9 September 2026."

---

## Per-requirement verdict (Rule 43) — all 44 cases

Verdict legend: UNCHANGED = Expected still matches the current spec sentence quoted.

### Story 1 — Print Option in More Menu (SV-9384)

| C-id | Sec | Verdict | Confirming current-spec sentence |
|---|---|---|---|
| C45084 | S1-R1 | UNCHANGED | "A 'Print Work Order' option will appear in the More menu (the overflow/actions menu on the work order toolbar)". |
| C45085 | S1-R2 | UNCHANGED | "The menu item will display the label 'Print Work Order' (text only, no icon — consistent with other menu items)". |
| C45086 | S1-R3 | UNCHANGED | "The menu item will be positioned below the Timesheets option and above the Delete Work Order option". |
| C45087 | S1-R4 | UNCHANGED | "When the user selects 'Print Work Order,' the browser's native print dialog will open". |
| C45088 | S1-R5 | UNCHANGED | "The print option will be available on all work order statuses: Estimate, Approved, In Progress, Review, Complete, Invoiced, Paid, Declined." (exact 8-status list). |
| C45089 | S1-R6 | UNCHANGED | "The print option will be available on both desktop and mobile views". |
| C45090 | S1-N1 | UNCHANGED | "If the user does not have permission to view the work order, they cannot access the work order detail page and therefore cannot reach the print option (enforced by existing access control)". |
| C45091 | S1-E1 | UNCHANGED | S1-E1 "The option does not enable when the UI skeleton appears — it waits for the actual data to arrive." + Key Decision "disabled (grayed out) while line item data is being fetched … or when no line items exist". |

### Story 2 — Print Layout, Work Order Header (SV-9385)

| C-id | Sec | Verdict | Confirming current-spec sentence |
|---|---|---|---|
| C45092 | S2-R1 | UNCHANGED | "The printed page will display the work order number prominently at the top". |
| C45093 | S2-R2 | UNCHANGED | "The work order status will be displayed next to the work order number". |
| C45094 | S2-R3 | UNCHANGED | S2-R3 header list: customer name (+company if present); vehicle year/make/model/VIN/license plate/unit number (if present)/mileage/engine hours (if present); service advisor; lead technician; WO start date — matches case verbatim. |
| C45095 | S2-R4 | UNCHANGED | "Fields that have no value (e.g., no engine hours, no license plate) will be omitted from the printout rather than displayed as blank". |
| C45096 | S2-R5 | UNCHANGED | "The shop name or organization name will appear in the header area to identify the source of the printout". |
| C45097 | S2-N1 | UNCHANGED | "If the work order has no customer assigned, the customer section will display 'No customer assigned'". (case's Untested/HOLD note is a build fact, not a spec matter.) |
| C45098 | S2-N2 | UNCHANGED | "If the work order has no vehicle assigned, the vehicle section will display 'No vehicle assigned'". |

### Story 3 — Print Layout, Line Items (SV-9386)

| C-id | Sec | Verdict | Confirming current-spec sentence |
|---|---|---|---|
| C45099 | S3-R1 | UNCHANGED | S3-R1 line list: line number, description (name), status, actual/estimated time, tech story (if exists), assigned technician(s) (if assigned) — matches. |
| C45100 | S3-R2 | UNCHANGED | "Parts associated with each line will be listed, showing: Part description, Part number, Quantity". |
| C45101 | S3-R3 | UNCHANGED | "Pricing is never shown … no labor rates, margins, line totals, part sell prices, or part margins. The Rate, Margin, and Total columns are removed entirely". |
| C45102 | S3-R4 | UNCHANGED | "The Action column (Approve, Decline, Complete buttons) and Progress column (progress bars) are removed from the printout. The line status text column is sufficient". |
| C45103 | S3-R5 | UNCHANGED | "Lines will be printed in the same order they appear on screen (by line number)". |
| C45104 | S3-R6 | UNCHANGED | "Line items with a status of 'Cancelled' will still appear on the printout if they are visible on screen, with their status clearly indicated". (HOLD note is a build fact.) |
| C45105 | S3-R7 | UNCHANGED | "Each work order line group (main line + its sub-rows …) will be visually separated from the next line by a thick border and blank space below, giving technicians room to write notes per line". |
| C45106 | S3-R8/N3 | UNCHANGED | S3-R8 & S3-N3 "If a line has no tech story, the tech story row will be omitted entirely — no placeholder text (e.g., 'Add tech story for this line') will appear". |
| C45107 | S3-N1 | UNCHANGED | "If the work order has no line items, the line items section will display 'No lines on this work order'". (HOLD note is a build contradiction, not a spec change.) |
| C45108 | S3-N2 | UNCHANGED | "If a line has no parts, no parts section will appear for that line". |
| C45109 | S3-N4 | UNCHANGED | "If a line has no assigned technicians, the technician area will be omitted for that line". |
| C45110 | S3-E1 | UNCHANGED | "If a work order has a large number of lines (10+), the printout will flow across multiple pages … No line item will be split mid-way across a page break if avoidable". |
| C45111 | S3-E2 | UNCHANGED | "If a tech story is very long (500+ characters), it will wrap and print in full — it will not be truncated". |

### Story 4 — Print Layout, Summary and Footer (SV-9387)

| C-id | Sec | Verdict | Confirming current-spec sentence |
|---|---|---|---|
| C45112 | S4-R1 | UNCHANGED | "A summary section will appear after all line items, displaying: Total actual time / Total estimated time across all lines". |
| C45113 | S4-R2 | UNCHANGED | "Pricing is never shown in the summary — no parts subtotal, labor subtotal, shop supplies, tax, or grand total. Only time totals are displayed". |
| C45114 | S4-R3 | UNCHANGED | "The print timestamp (date and time of printing) will appear at the bottom of the printout". |
| C45115 | S4-R4 | UNCHANGED | "The work order number will repeat in the footer of each printed page for multi-page printouts". |
| C45116 | S4-N1 | UNCHANGED | "If there are no line items, the summary will show zero totals rather than being hidden, and the line items area shows a single placeholder row reading 'No lines on this work order'". |

### Story 5 — Print Formatting, Screen Elements Hidden (SV-9388)

| C-id | Sec | Verdict | Confirming current-spec sentence |
|---|---|---|---|
| C45117 | S5-R1 | UNCHANGED | S5-R1 hidden-elements list (app nav; all action buttons Print/New Line/Reviewed/Send to Portal; tab nav Lines/Part Requests/Notes/Time Sheets; context menus & dropdown triggers; status-change/workflow actions; clock in/out; Progress column & bars; Action column; floating UI) — matches case verbatim. |
| C45118 | S5-R2 | UNCHANGED | "The printout will use black text on a white background regardless of the user's theme (dark mode, etc.)". |
| C45119 | S5-R3 | UNCHANGED | "Text will be sized for comfortable reading on paper (no smaller than 10pt equivalent)". |
| C45120 | S5-R4 | UNCHANGED | "The layout will be optimized for portrait orientation on US Letter or A4 paper". |
| C45121 | S5-R5 | UNCHANGED | "Status badges will print as plain text labels (not colored chips) to ensure readability on black-and-white printers". |
| C45122 | S5-E1 | UNCHANGED | "If the user manually selects landscape orientation …, the layout will still be readable (content will not overflow or clip)". |

### Story 6 — Audit Trail (SV-9389)

| C-id | Sec | Verdict | Confirming current-spec sentence |
|---|---|---|---|
| C45123 | S6-R1 | UNCHANGED | "When the user selects the Print Work Order option, the system will log a 'Work Order Printed' event in the work order's audit history". (Case's extra build-observed detail — Line "-", Details "Total: $…" — is audit-window content the spec does not govern; not a printout-pricing conflict.) |
| C45124 | S6-R2 | UNCHANGED | "The audit log entry will record the user who triggered the print and the date/time". |
| C45125 | S6-R3 | UNCHANGED | "The audit log entry will be visible in the work order's History tab, consistent with how estimate and invoice print events are displayed today". |
| C45126 | S6-N1 | UNCHANGED | "If the user opens the browser print dialog but cancels without printing, the event will still be logged (the system cannot detect whether the user completed the print …)". |
| C45127 | S6-E1 | UNCHANGED | "If the user prints the same work order multiple times, each print action will create a separate audit log entry". |

---

## Summary

- **UNCHANGED: 44 / 44.** No requirement drift. The live spec body matches every case's Expected.
- **UPDATE: 0.**
- The spec has **moved since the "version 8" revision** (live last-modified 2026-09-07, one save
  past the 9/6 baseline), but the move carried **no substantive requirement change**. The only
  action indicated is the **provenance stamp**, not any Expected-Results content.
- No PO questions arise from this re-verification. The pre-existing HOLD items (C45097, C45098,
  C45104, C45107, C45116) remain build/PO contradictions, unaffected by the spec — their Expected
  still matches the spec verbatim.
