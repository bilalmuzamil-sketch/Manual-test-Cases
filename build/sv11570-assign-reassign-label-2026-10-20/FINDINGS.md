# SV-11570 — Assign / Reassign lead technician label (Board View + Tech View)

## Scope (as ruled)
Chris Ward, SV-11570 comment 79141 (20 Oct 2026 12:29 CDT): *"this ticket is only the menu and dialog label,
"Assign lead technician" when the work order has no lead and "Reassign lead technician" when it has one
(S3-R14, S4-R4). Everything else moves to the fast follow in SV-11524."*

PRD (Work Orders — Board View & Tech View Display Options, page 845185030, change log to v71), read live 20 Oct 2026:
- S3-R14: "Include the lead technician action in the card's more-actions menu: "Assign lead technician" on a work order
  with no lead technician, "Reassign lead technician" on one that has a lead technician."
- S4-R4: "The card or row more-actions menu opens the lead technician dialog, titled "Assign lead technician" or
  "Reassign lead technician" to match the menu item it was opened from (S3-R14)."
Ruling and PRD agree (Rule 109).

## Staging — app.staging.shopview.com, build v26.40.20-0509710 (index.html last-modified 20 Oct 14:23:34 GMT), 1440x900
| View | Work order | Lead | Menu item | Dialog title |
|---|---|---|---|---|
| Board | S2-32218 (Approved) | none (Unassigned column) | Reassign lead technician | Reassign lead technician |
| Board | S2-33692 (Paid) | none | Reassign lead technician (disabled) | — |
| Board | S2-16176 (Estimate) | has lead | Reassign lead technician | Reassign lead technician |
| Tech | S2-32218 (Approved) | none (Unassigned group) | Reassign lead technician | Reassign lead technician |
| Tech | S2-35175 (Approved) | has lead | Reassign lead technician | Reassign lead technician |

Staging's deployed code (`WorkOrderMoreActions.NnbjQNxN.js`) contains only the fixed string "Reassign lead technician";
"Assign lead technician" appears in none of the 75 scripts the page loads. **The fix is not on staging.**
Staging was deployed 14:23 UTC, before Chris's scope comment (17:29 UTC).

## The fix is on the ticket's QA branch
sv11570.qa.shopview.com, build v26.40.20-c1e9c1b (last-modified 20 Oct 17:00:59 GMT). Its `WorkOrderMoreActions.Cn1Hducq.js`
picks the label from the lead state: `hasLead ? "Reassign lead technician" : "Assign lead technician"`. Sign-in to the
branch works. Live testing there is waiting on the QA lead's go-ahead (asked: test on branch instead of staging?).

Nothing posted to Jira. No data changed on staging (menus and dialogs were opened and closed with Cancel/close only).
