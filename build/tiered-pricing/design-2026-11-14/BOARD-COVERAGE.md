# Board coverage — Tiered Pricing design v1794631438-539a (driven 14 Nov 2026)

One row per canvas board, in canvas order (page, then row by row, left to right). Texts = visible text pieces read from the rendered board; attrs = tooltip (data-tip), aria-label, title, placeholder, alt, value and option texts; candidates = interactive elements found (button, link, input, select, label, role, tabindex, tooltip, pointer cursor); every candidate was hovered and clicked from a fresh known state. "Exposed" = hover or click changed something (text, element count, page, or the element's own colour/border/opacity/shadow). Failures = actions that could not be performed.

| Page | # | Board (canvas title) | Picture | W×H | Texts | Attrs | Cand. | Hovered | Clicked | Exposed (hover style / text / click) | Failed | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 01 | 0.0 Overview | `page-00-board-01-0-0-overview.png` | 1440×1600 | 116 | 0 | 41 | 41 | 41 | 41 (41 / 0 / 16) | 0 | 16 clicks follow a link out of the design (Jira/Confluence/canvas page), blocked |
| 1 | 01 | 1.1 Release day: Settings › Pricing opens on Tiers | `page-01-board-01-1-1-release-day-settings-pricing-opens-on-tiers.png` | 1455×1050 | 54 | 40 | 39 | 39 | 39 | 37 (37 / 0 / 0) | 0 |  |
| 1 | 02 | 1.2 Release day: Matrices tab | `page-01-board-02-1-2-release-day-matrices-tab.png` | 1455×1050 | 88 | 64 | 60 | 60 | 60 | 52 (52 / 0 / 0) | 0 |  |
| 1 | 03 | 1.3 Click a matrix | `page-01-board-03-1-3-click-a-matrix.png` | 1455×1050 | 88 | 64 | 60 | 60 | 60 | 52 (52 / 0 / 0) | 0 |  |
| 1 | 04 | 1.4 Result: Opening a matrix shows today's rules as the Default column | `page-01-board-04-1-4-result-opening-a-matrix-shows-todays-rules-as-the-defaul.png` | 1455×1050 | 61 | 43 | 40 | 40 | 40 | 38 (38 / 0 / 0) | 0 |  |
| 2 | 01 | 2.1 Today: the Pricing page | `page-02-board-01-2-1-today-the-pricing-page.png` | 1440×699 | 2 | 1 | 0 | 0 | 0 | 0 (0 / 0 / 0) | 0 | image not available: 404 _blob/d1175e1635cfdc31a9ed11b0b59188b7 |
| 2 | 02 | 2.2 Tiers list | `page-02-board-02-2-2-tiers-list.png` | 1455×1050 | 84 | 64 | 57 | 57 | 57 | 55 (55 / 0 / 0) | 0 |  |
| 2 | 03 | 2.3 Hover the # info icon | `page-02-board-03-2-3-hover-the-info-icon.png` | 1455×1050 | 85 | 64 | 58 | 58 | 58 | 55 (55 / 0 / 0) | 0 |  |
| 2 | 04 | 2.4 Click the three-dot menu beside New Tier | `page-02-board-04-2-4-click-the-three-dot-menu-beside-new-tier.png` | 1455×1050 | 85 | 64 | 58 | 58 | 58 | 55 (55 / 0 / 0) | 0 |  |
| 2 | 05 | 2.5 Click Audit Log | `page-02-board-05-2-5-click-audit-log.png` | 1455×1050 | 85 | 64 | 58 | 58 | 58 | 55 (55 / 0 / 0) | 0 |  |
| 2 | 06 | 2.6 Result: "Audit Log: Tiers": every tier's changes, newest first | `page-02-board-06-2-6-result-audit-log-tiers-every-tiers-changes-newest-first.png` | 1455×1050 | 169 | 66 | 59 | 59 | 59 | 2 (2 / 0 / 0) | 0 |  |
| 2 | 07 | 2.7 Click a tier's three-dot menu (never used) | `page-02-board-07-2-7-click-a-tiers-three-dot-menu-never-used.png` | 1455×1050 | 87 | 64 | 61 | 61 | 61 | 52 (52 / 0 / 0) | 0 |  |
| 2 | 08 | 2.8 Hover the greyed Delete | `page-02-board-08-2-8-hover-the-greyed-delete.png` | 1455×1050 | 88 | 66 | 62 | 62 | 62 | 51 (51 / 0 / 0) | 0 |  |
| 2 | 09 | 2.9 The last row's menu opens upward | `page-02-board-09-2-9-the-last-rows-menu-opens-upward.png` | 1455×1050 | 87 | 64 | 61 | 61 | 61 | 52 (52 / 0 / 0) | 0 |  |
| 2 | 10 | 2.10 Click New Tier | `page-02-board-10-2-10-click-new-tier.png` | 1455×1050 | 84 | 64 | 57 | 57 | 57 | 55 (55 / 0 / 0) | 0 |  |
| 2 | 11 | 2.11 Result: The new tier's page opens, no dialog, with the cursor in the name and Cancel / Create Tier | `page-02-board-11-2-11-result-the-new-tiers-page-opens-no-dialog-with-the-curs.png` | 1455×1050 | 71 | 33 | 36 | 36 | 36 | 33 (33 / 0 / 0) | 0 |  |
| 2 | 12 | 2.12 Click Create Tier with no name | `page-02-board-12-2-12-click-create-tier-with-no-name.png` | 1455×1050 | 71 | 33 | 36 | 36 | 36 | 33 (33 / 0 / 0) | 0 |  |
| 2 | 13 | 2.13 Type a name another tier uses | `page-02-board-13-2-13-type-a-name-another-tier-uses.png` | 1455×1050 | 71 | 34 | 36 | 36 | 36 | 33 (33 / 0 / 0) | 0 |  |
| 2 | 14 | 2.14 Type an archived tier's name | `page-02-board-14-2-14-type-an-archived-tiers-name.png` | 1455×1050 | 71 | 34 | 36 | 36 | 36 | 33 (33 / 0 / 0) | 0 |  |
| 2 | 15 | 2.15 Type a name the reports use | `page-02-board-15-2-15-type-a-name-the-reports-use.png` | 1455×1050 | 71 | 34 | 36 | 36 | 36 | 33 (33 / 0 / 0) | 0 |  |
| 2 | 16 | 2.16 Type "Fleet Plus" and click Create Tier | `page-02-board-16-2-16-type-fleet-plus-and-click-create-tier.png` | 1455×1050 | 71 | 34 | 36 | 36 | 36 | 33 (33 / 0 / 0) | 0 |  |
| 2 | 17 | 2.17 Result: The tier is created and its page stays open | `page-02-board-17-2-17-result-the-tier-is-created-and-its-page-stays-open.png` | 1455×1050 | 79 | 53 | 59 | 59 | 59 | 49 (49 / 0 / 0) | 0 |  |
| 2 | 18 | 2.18 Archive a tier that has customers | `page-02-board-18-2-18-archive-a-tier-that-has-customers.png` | 1455×1050 | 87 | 66 | 61 | 61 | 61 | 51 (51 / 0 / 0) | 0 |  |
| 2 | 19 | 2.19 Click "Remove Customers" in the blocked dialog | `page-02-board-19-2-19-click-remove-customers-in-the-blocked-dialog.png` | 1455×1050 | 99 | 66 | 60 | 60 | 60 | 3 (3 / 0 / 0) | 0 |  |
| 2 | 20 | 2.20 Result: Manage Customers opens on the Remove tab, so the customers can be taken off and the tier archived | `page-02-board-20-2-20-result-manage-customers-opens-on-the-remove-tab-so-the-.png` | 1455×1050 | 111 | 76 | 69 | 69 | 69 | 8 (8 / 0 / 0) | 0 |  |
| 2 | 21 | 2.21 Archive a tier with no customers | `page-02-board-21-2-21-archive-a-tier-with-no-customers.png` | 1455×1050 | 87 | 64 | 61 | 61 | 61 | 52 (52 / 0 / 0) | 0 |  |
| 2 | 22 | 2.22 Result: The dialog lists, one per line, every tier that follows it through Same as previous tier | `page-02-board-22-2-22-result-the-dialog-lists-one-per-line-every-tier-that-fo.png` | 1455×1050 | 90 | 66 | 60 | 60 | 60 | 3 (3 / 0 / 0) | 0 |  |
| 2 | 23 | 2.23 Click Archive | `page-02-board-23-2-23-click-archive.png` | 1455×1050 | 88 | 66 | 60 | 60 | 60 | 3 (3 / 0 / 0) | 0 |  |
| 2 | 24 | 2.24 Result: Tier 5 moves to the archived rows; the tiers after it move up one number | `page-02-board-24-2-24-result-tier-5-moves-to-the-archived-rows-the-tiers-afte.png` | 1455×1050 | 86 | 64 | 57 | 57 | 57 | 55 (55 / 0 / 0) | 0 |  |
| 2 | 25 | 2.25 An archived tier's menu | `page-02-board-25-2-25-an-archived-tiers-menu.png` | 1455×1050 | 87 | 64 | 61 | 61 | 61 | 52 (52 / 0 / 0) | 0 |  |
| 2 | 26 | 2.26 Click Reactivate | `page-02-board-26-2-26-click-reactivate.png` | 1455×1050 | 87 | 64 | 61 | 61 | 61 | 52 (52 / 0 / 0) | 0 |  |
| 2 | 27 | 2.27 Result: No confirmation | `page-02-board-27-2-27-result-no-confirmation.png` | 1455×1050 | 85 | 64 | 57 | 57 | 57 | 55 (55 / 0 / 0) | 0 |  |
| 2 | 28 | 2.28 Delete a tier that priced nothing | `page-02-board-28-2-28-delete-a-tier-that-priced-nothing.png` | 1455×1050 | 87 | 64 | 61 | 61 | 61 | 52 (52 / 0 / 0) | 0 |  |
| 2 | 29 | 2.29 Click Delete | `page-02-board-29-2-29-click-delete.png` | 1455×1050 | 89 | 66 | 60 | 60 | 60 | 3 (3 / 0 / 0) | 0 |  |
| 2 | 30 | 2.30 Result: The tier and its column in every matrix are gone | `page-02-board-30-2-30-result-the-tier-and-its-column-in-every-matrix-are-gone.png` | 1455×1050 | 80 | 60 | 54 | 54 | 54 | 52 (52 / 0 / 0) | 0 |  |
| 2 | 31 | 2.31 Click a tier (Tier 2) | `page-02-board-31-2-31-click-a-tier-tier-2.png` | 1455×1050 | 84 | 64 | 57 | 57 | 57 | 55 (55 / 0 / 0) | 0 |  |
| 2 | 32 | 2.32 Result: The tier's page opens on Pricing: every matrix and how it prices this tier, in the grid's words | `page-02-board-32-2-32-result-the-tiers-page-opens-on-pricing-every-matrix-and.png` | 1455×1050 | 77 | 47 | 53 | 53 | 53 | 49 (49 / 0 / 0) | 0 |  |
| 2 | 33 | 2.33 Point at the name | `page-02-board-33-2-33-point-at-the-name.png` | 1455×1050 | 77 | 47 | 53 | 53 | 53 | 49 (49 / 0 / 0) | 0 |  |
| 2 | 34 | 2.34 Click the pencil | `page-02-board-34-2-34-click-the-pencil.png` | 1455×1050 | 77 | 47 | 53 | 53 | 53 | 49 (49 / 0 / 0) | 0 |  |
| 2 | 35 | 2.35 Result: The name is edited in place | `page-02-board-35-2-35-result-the-name-is-edited-in-place.png` | 1455×1050 | 76 | 47 | 53 | 53 | 53 | 48 (48 / 0 / 0) | 0 |  |
| 2 | 36 | 2.36 Type a taken name and press Enter | `page-02-board-36-2-36-type-a-taken-name-and-press-enter.png` | 1455×1050 | 76 | 47 | 53 | 53 | 53 | 48 (48 / 0 / 0) | 0 |  |
| 2 | 37 | 2.37 Type "Fleet" and press Enter | `page-02-board-37-2-37-type-fleet-and-press-enter.png` | 1455×1050 | 78 | 47 | 53 | 53 | 53 | 49 (49 / 0 / 0) | 0 |  |
| 2 | 38 | 2.38 Click the page's three-dot menu | `page-02-board-38-2-38-click-the-pages-three-dot-menu.png` | 1455×1050 | 80 | 49 | 57 | 57 | 57 | 51 (51 / 0 / 0) | 0 |  |
| 2 | 39 | 2.39 Click Audit Log | `page-02-board-39-2-39-click-audit-log.png` | 1455×1050 | 80 | 49 | 57 | 57 | 57 | 51 (51 / 0 / 0) | 0 |  |
| 2 | 40 | 2.40 Result: "Audit Log: Tier 2": Event, User, Details (old → new), Date, Time | `page-02-board-40-2-40-result-audit-log-tier-2-event-user-details-old-new-date.png` | 1455×1050 | 96 | 49 | 55 | 55 | 55 | 2 (2 / 0 / 0) | 0 |  |
| 2 | 41 | 2.41 Default's page | `page-02-board-41-2-41-defaults-page.png` | 1455×1050 | 84 | 64 | 57 | 57 | 57 | 55 (55 / 0 / 0) | 0 |  |
| 2 | 42 | 2.42 Result: Default is priced by each matrix's Default column, so its page has no checkboxes and no Set Rule | `page-02-board-42-2-42-result-default-is-priced-by-each-matrixs-default-column.png` | 1455×1050 | 61 | 37 | 43 | 43 | 43 | 41 (41 / 0 / 0) | 0 |  |
| 2 | 43 | 2.43 An archived tier's page | `page-02-board-43-2-43-an-archived-tiers-page.png` | 1455×1050 | 84 | 64 | 57 | 57 | 57 | 55 (55 / 0 / 0) | 0 |  |
| 2 | 44 | 2.44 Result: Archived shows as plain text | `page-02-board-44-2-44-result-archived-shows-as-plain-text.png` | 1455×1050 | 77 | 50 | 56 | 56 | 56 | 49 (49 / 0 / 0) | 0 |  |
| 2 | 45 | 2.45 Click a matrix on the tier's page | `page-02-board-45-2-45-click-a-matrix-on-the-tiers-page.png` | 1455×1050 | 77 | 47 | 53 | 53 | 53 | 49 (49 / 0 / 0) | 0 |  |
| 2 | 46 | 2.46 Result: The matrix opens in edit with Tier 2's column in view; the breadcrumb leads back to the tier | `page-02-board-46-2-46-result-the-matrix-opens-in-edit-with-tier-2s-column-in-.png` | 1455×1050 | 115 | 188 | 88 | 88 | 88 | 70 (70 / 0 / 0) | 0 |  |
| 2 | 47 | 2.47 Check a matrix | `page-02-board-47-2-47-check-a-matrix.png` | 1455×1050 | 82 | 59 | 57 | 57 | 57 | 50 (50 / 0 / 0) | 0 |  |
| 2 | 48 | 2.48 Click select-all | `page-02-board-48-2-48-click-select-all.png` | 1455×1050 | 82 | 59 | 57 | 57 | 57 | 38 (38 / 0 / 0) | 0 |  |
| 2 | 49 | 2.49 Uncheck two | `page-02-board-49-2-49-uncheck-two.png` | 1455×1050 | 82 | 59 | 57 | 57 | 57 | 42 (42 / 0 / 0) | 0 |  |
| 2 | 50 | 2.50 Type 35 | `page-02-board-50-2-50-type-35.png` | 1455×1050 | 82 | 60 | 57 | 57 | 57 | 38 (38 / 0 / 0) | 0 |  |
| 2 | 51 | 2.51 Click Set Rule with no value | `page-02-board-51-2-51-click-set-rule-with-no-value.png` | 1455×1050 | 83 | 59 | 58 | 58 | 58 | 38 (38 / 0 / 0) | 0 |  |
| 2 | 52 | 2.52 Pick Margin %, type 120, click Set Rule | `page-02-board-52-2-52-pick-margin-type-120-click-set-rule.png` | 1455×1050 | 83 | 60 | 58 | 58 | 58 | 50 (50 / 0 / 0) | 0 |  |
| 2 | 53 | 2.53 Click Set Rule (every matrix checked) | `page-02-board-53-2-53-click-set-rule-every-matrix-checked.png` | 1455×1050 | 86 | 62 | 60 | 60 | 60 | 3 (3 / 0 / 0) | 0 |  |
| 2 | 54 | 2.54 Click Set Rule (some checked) | `page-02-board-54-2-54-click-set-rule-some-checked.png` | 1455×1050 | 86 | 62 | 60 | 60 | 60 | 3 (3 / 0 / 0) | 0 |  |
| 2 | 55 | 2.55 Click Set Rule in the dialog | `page-02-board-55-2-55-click-set-rule-in-the-dialog.png` | 1455×1050 | 86 | 62 | 60 | 60 | 60 | 3 (3 / 0 / 0) | 0 |  |
| 2 | 56 | 2.56 Result: The checks clear | `page-02-board-56-2-56-result-the-checks-clear.png` | 1455×1050 | 80 | 47 | 54 | 54 | 54 | 50 (50 / 0 / 0) | 0 |  |
| 2 | 57 | 2.57 Click Undo | `page-02-board-57-2-57-click-undo.png` | 1455×1050 | 80 | 48 | 55 | 55 | 55 | 50 (50 / 0 / 0) | 0 |  |
| 2 | 58 | 2.58 Result: Exactly what the tier had comes back | `page-02-board-58-2-58-result-exactly-what-the-tier-had-comes-back.png` | 1455×1050 | 79 | 47 | 53 | 53 | 53 | 49 (49 / 0 / 0) | 0 |  |
| 2 | 59 | 2.59 Set a rule it already has | `page-02-board-59-2-59-set-a-rule-it-already-has.png` | 1455×1050 | 82 | 60 | 57 | 57 | 57 | 50 (50 / 0 / 0) | 0 |  |
| 2 | 60 | 2.60 Result: Nothing is asked; a toast says so | `page-02-board-60-2-60-result-nothing-is-asked-a-toast-says-so.png` | 1455×1050 | 78 | 47 | 53 | 53 | 53 | 49 (49 / 0 / 0) | 0 |  |
| 3 | 01 | 3.1 Click a matrix (Stop 40) | `page-03-board-01-3-1-click-a-matrix-stop-40.png` | 1455×1050 | 94 | 74 | 69 | 69 | 69 | 55 (55 / 0 / 0) | 0 |  |
| 3 | 02 | 3.2 Result: The matrix page: Categories, Work Order / Part Sale tabs, the tier grid (Default and every active tier) and the Price Part Simulator | `page-03-board-02-3-2-result-the-matrix-page-categories-work-order-part-sale-t.png` | 1455×1050 | 106 | 49 | 46 | 46 | 46 | 38 (38 / 0 / 0) | 0 |  |
| 3 | 03 | 3.3 Point at the name | `page-03-board-03-3-3-point-at-the-name.png` | 1455×1050 | 106 | 49 | 46 | 46 | 46 | 38 (38 / 0 / 0) | 0 |  |
| 3 | 04 | 3.4 Click the pencil | `page-03-board-04-3-4-click-the-pencil.png` | 1455×1050 | 106 | 49 | 46 | 46 | 46 | 38 (38 / 0 / 0) | 0 |  |
| 3 | 05 | 3.5 Result: Enter or clicking away saves at once; Esc cancels | `page-03-board-05-3-5-result-enter-or-clicking-away-saves-at-once-esc-cancels.png` | 1455×1050 | 106 | 50 | 46 | 46 | 46 | 37 (37 / 0 / 0) | 0 |  |
| 3 | 06 | 3.6 Click the page's three-dot menu | `page-03-board-06-3-6-click-the-pages-three-dot-menu.png` | 1455×1050 | 107 | 49 | 47 | 47 | 47 | 39 (39 / 0 / 0) | 0 |  |
| 3 | 07 | 3.7 Click Audit Log | `page-03-board-07-3-7-click-audit-log.png` | 1455×1050 | 115 | 51 | 50 | 50 | 50 | 3 (3 / 0 / 0) | 0 |  |
| 3 | 08 | 3.8 Result: Newest first: each save, then every rule it changed | `page-03-board-08-3-8-result-newest-first-each-save-then-every-rule-it-changed.png` | 1455×1050 | 131 | 51 | 48 | 48 | 48 | 2 (2 / 0 / 0) | 0 |  |
| 3 | 09 | 3.9 An Inactive matrix | `page-03-board-09-3-9-an-inactive-matrix.png` | 1455×1050 | 94 | 74 | 69 | 69 | 69 | 55 (55 / 0 / 0) | 0 |  |
| 3 | 10 | 3.10 Result: No badge on the page; the reason shows as plain text | `page-03-board-10-3-10-result-no-badge-on-the-page-the-reason-shows-as-plain-t.png` | 1455×1050 | 107 | 49 | 46 | 46 | 46 | 38 (38 / 0 / 0) | 0 |  |
| 3 | 11 | 3.11 Save a matrix that prices one category | `page-03-board-11-3-11-save-a-matrix-that-prices-one-category.png` | 1455×1050 | 114 | 188 | 87 | 87 | 87 | 69 (69 / 0 / 0) | 0 |  |
| 3 | 12 | 3.12 Result: Saved without asking; a toast confirms | `page-03-board-12-3-12-result-saved-without-asking-a-toast-confirms.png` | 1455×1050 | 101 | 47 | 44 | 44 | 44 | 38 (38 / 0 / 0) | 0 |  |
| 3 | 13 | 3.13 Save a matrix that prices several categories | `page-03-board-13-3-13-save-a-matrix-that-prices-several-categories.png` | 1455×1050 | 117 | 189 | 85 | 85 | 85 | 3 (3 / 0 / 0) | 0 |  |
| 3 | 14 | 3.14 Save the General Matrix | `page-03-board-14-3-14-save-the-general-matrix.png` | 1455×1050 | 140 | 301 | 120 | 120 | 120 | 3 (3 / 0 / 0) | 0 |  |
| 3 | 15 | 3.15 Type 120 in a % Off column and click Save | `page-03-board-15-3-15-type-120-in-a-off-column-and-click-save.png` | 1455×1050 | 116 | 188 | 87 | 87 | 87 | 69 (69 / 0 / 0) | 0 |  |
| 3 | 16 | 3.16 Change a value, then click the Part Sale Matrix tab | `page-03-board-16-3-16-change-a-value-then-click-the-part-sale-matrix-tab.png` | 1455×1050 | 118 | 190 | 90 | 90 | 90 | 3 (3 / 0 / 0) | 0 |  |
| 3 | 17 | 3.17 Click the Part Sale Matrix tab (off) | `page-03-board-17-3-17-click-the-part-sale-matrix-tab-off.png` | 1455×1050 | 48 | 40 | 38 | 38 | 38 | 36 (36 / 0 / 0) | 0 |  |
| 3 | 18 | 3.18 Turn on separate Part Sale pricing | `page-03-board-18-3-18-turn-on-separate-part-sale-pricing.png` | 1455×1050 | 110 | 52 | 48 | 48 | 48 | 40 (40 / 0 / 0) | 0 |  |
| 3 | 19 | 3.19 A matrix with its own Part Sale prices | `page-03-board-19-3-19-a-matrix-with-its-own-part-sale-prices.png` | 1455×1050 | 108 | 49 | 45 | 45 | 45 | 40 (40 / 0 / 0) | 0 |  |
| 3 | 20 | 3.20 Turn it off | `page-03-board-20-3-20-turn-it-off.png` | 1455×1050 | 112 | 51 | 48 | 48 | 48 | 3 (3 / 0 / 0) | 0 |  |
| 3 | 21 | 3.21 Click New Matrix | `page-03-board-21-3-21-click-new-matrix.png` | 1455×1050 | 94 | 74 | 69 | 69 | 69 | 55 (55 / 0 / 0) | 0 |  |
| 3 | 22 | 3.22 Result: Name, categories and the grid ready to fill; Cancel and Create Matrix in the page head, as on New Tier and New Category | `page-03-board-22-3-22-result-name-categories-and-the-grid-ready-to-fill-cance.png` | 1455×1050 | 95 | 133 | 67 | 67 | 67 | 51 (51 / 0 / 0) | 0 |  |
| 3 | 23 | 3.23 Open Categories | `page-03-board-23-3-23-open-categories.png` | 1455×1050 | 120 | 135 | 85 | 85 | 85 | 67 (67 / 0 / 0) | 0 |  |
| 3 | 24 | 3.24 Click Create Matrix with no name | `page-03-board-24-3-24-click-create-matrix-with-no-name.png` | 1455×1050 | 99 | 133 | 67 | 67 | 67 | 51 (51 / 0 / 0) | 0 |  |
| 3 | 25 | 3.25 Type a taken name and click Create Matrix | `page-03-board-25-3-25-type-a-taken-name-and-click-create-matrix.png` | 1455×1050 | 98 | 134 | 67 | 67 | 67 | 51 (51 / 0 / 0) | 0 |  |
| 3 | 26 | 3.26 Duplicate a matrix | `page-03-board-26-3-26-duplicate-a-matrix.png` | 1455×1050 | 96 | 74 | 72 | 72 | 72 | 53 (53 / 0 / 0) | 0 |  |
| 3 | 27 | 3.27 Result: A copy of its rules, ready to name | `page-03-board-27-3-27-result-a-copy-of-its-rules-ready-to-name.png` | 1455×1050 | 113 | 187 | 86 | 86 | 86 | 67 (67 / 0 / 0) | 0 |  |
| 3 | 28 | 3.28 Delete a matrix | `page-03-board-28-3-28-delete-a-matrix.png` | 1455×1050 | 96 | 74 | 72 | 72 | 72 | 53 (53 / 0 / 0) | 0 |  |
| 3 | 29 | 3.29 Result: "Delete Stop 40?" names the matrix | `page-03-board-29-3-29-result-delete-stop-40-names-the-matrix.png` | 1455×1050 | 99 | 76 | 72 | 72 | 72 | 3 (3 / 0 / 0) | 0 |  |
| 4 | 01 | 4.1 Hover the Cost Range info icon | `page-04-board-01-4-1-hover-the-cost-range-info-icon.png` | 1455×1050 | 107 | 49 | 47 | 47 | 47 | 38 (38 / 0 / 0) | 0 |  |
| 4 | 02 | 4.2 Hover a "Uses previous tier" cell | `page-04-board-02-4-2-hover-a-uses-previous-tier-cell.png` | 1455×1050 | 100 | 51 | 49 | 49 | 49 | 38 (38 / 0 / 0) | 0 |  |
| 4 | 03 | 4.3 A column that mixes rule types | `page-04-board-03-4-3-a-column-that-mixes-rule-types.png` | 1455×1050 | 94 | 74 | 69 | 69 | 69 | 55 (55 / 0 / 0) | 0 |  |
| 4 | 04 | 4.4 Result: Tread Plus Default: + $45 up to $300, then 15% margin | `page-04-board-04-4-4-result-tread-plus-default-45-up-to-300-then-15-margin.png` | 1455×1050 | 106 | 46 | 43 | 43 | 43 | 38 (38 / 0 / 0) | 0 |  |
| 4 | 05 | 4.5 Click Edit | `page-04-board-05-4-5-click-edit.png` | 1455×1050 | 106 | 49 | 46 | 46 | 46 | 38 (38 / 0 / 0) | 0 |  |
| 4 | 06 | 4.6 Result: Every cell is editable | `page-04-board-06-4-6-result-every-cell-is-editable.png` | 1455×1050 | 114 | 188 | 87 | 87 | 87 | 69 (69 / 0 / 0) | 0 |  |
| 4 | 07 | 4.7 Type in a range | `page-04-board-07-4-7-type-in-a-range.png` | 1455×1050 | 115 | 173 | 84 | 84 | 84 | 69 (69 / 0 / 0) | 0 |  |
| 4 | 08 | 4.8 Change range 2 to Markup % and type 45 | `page-04-board-08-4-8-change-range-2-to-markup-and-type-45.png` | 1455×1050 | 115 | 173 | 84 | 84 | 84 | 69 (69 / 0 / 0) | 0 |  |
| 4 | 09 | 4.9 A column's rule picker | `page-04-board-09-4-9-a-columns-rule-picker.png` | 1455×1050 | 114 | 188 | 87 | 87 | 87 | 69 (69 / 0 / 0) | 0 |  |
| 4 | 10 | 4.10 Default's rule picker | `page-04-board-10-4-10-defaults-rule-picker.png` | 1455×1050 | 114 | 188 | 87 | 87 | 87 | 69 (69 / 0 / 0) | 0 |  |
| 4 | 11 | 4.11 Pick % Off for Tier 5 | `page-04-board-11-4-11-pick-off-for-tier-5.png` | 1455×1050 | 114 | 188 | 87 | 87 | 87 | 69 (69 / 0 / 0) | 0 |  |
| 4 | 12 | 4.12 Pick "Previous tier" for Tier 2 | `page-04-board-12-4-12-pick-previous-tier-for-tier-2.png` | 1455×1050 | 114 | 188 | 87 | 87 | 87 | 69 (69 / 0 / 0) | 0 |  |
| 4 | 13 | 4.13 A From cost cell's symbol | `page-04-board-13-4-13-a-from-cost-cells-symbol.png` | 1455×1050 | 114 | 188 | 87 | 87 | 87 | 68 (68 / 0 / 0) | 0 |  |
| 4 | 14 | 4.14 Ranges with different types | `page-04-board-14-4-14-ranges-with-different-types.png` | 1455×1050 | 106 | 46 | 43 | 43 | 43 | 38 (38 / 0 / 0) | 0 |  |
| 4 | 15 | 4.15 Result: The column header reads "Mixed rules"; cells spell out % markup / % margin | `page-04-board-15-4-15-result-the-column-header-reads-mixed-rules-cells-spell-.png` | 1455×1050 | 114 | 204 | 90 | 90 | 90 | 67 (67 / 0 / 0) | 0 |  |
| 4 | 16 | 4.16 Same as previous tier, in edit | `page-04-board-16-4-16-same-as-previous-tier-in-edit.png` | 1455×1050 | 99 | 51 | 48 | 48 | 48 | 38 (38 / 0 / 0) | 0 |  |
| 4 | 17 | 4.17 Result: The cells show the previous tier's values, muted, and can be typed over to give the tier its own copy | `page-04-board-17-4-17-result-the-cells-show-the-previous-tiers-values-muted-a.png` | 1455×1050 | 105 | 187 | 82 | 82 | 82 | 61 (61 / 0 / 0) | 0 |  |
| 4 | 18 | 4.18 Type a bad value and click Save | `page-04-board-18-4-18-type-a-bad-value-and-click-save.png` | 1455×1050 | 116 | 188 | 87 | 87 | 87 | 69 (69 / 0 / 0) | 0 |  |
| 4 | 19 | 4.19 Change a range end | `page-04-board-19-4-19-change-a-range-end.png` | 1455×1050 | 114 | 188 | 87 | 87 | 87 | 69 (69 / 0 / 0) | 0 |  |
| 4 | 20 | 4.20 Click Add Range | `page-04-board-20-4-20-click-add-range.png` | 1455×1050 | 123 | 219 | 98 | 98 | 98 | 77 (77 / 0 / 0) | 0 |  |
| 4 | 21 | 4.21 Click a range's delete | `page-04-board-21-4-21-click-a-ranges-delete.png` | 1455×1050 | 105 | 157 | 76 | 76 | 76 | 61 (61 / 0 / 0) | 0 |  |
| 4 | 22 | 4.22 After a few edits | `page-04-board-22-4-22-after-a-few-edits.png` | 1455×1050 | 114 | 188 | 87 | 87 | 87 | 69 (69 / 0 / 0) | 0 |  |
| 4 | 23 | 4.23 Click Cancel with changes | `page-04-board-23-4-23-click-cancel-with-changes.png` | 1455×1050 | 118 | 190 | 90 | 90 | 90 | 3 (3 / 0 / 0) | 0 |  |
| 4 | 24 | 4.24 Change Default's rules | `page-04-board-24-4-24-change-defaults-rules.png` | 1455×1050 | 136 | 201 | 97 | 97 | 97 | 3 (3 / 0 / 0) | 0 |  |
| 4 | 25 | 4.25 Edit from an archived tier | `page-04-board-25-4-25-edit-from-an-archived-tier.png` | 1455×1050 | 77 | 50 | 56 | 56 | 56 | 49 (49 / 0 / 0) | 0 |  |
| 4 | 26 | 4.26 Result: The archived view: Default plus archived tiers, with a notice; only the archived columns can change | `page-04-board-26-4-26-result-the-archived-view-default-plus-archived-tiers-wi.png` | 1455×1050 | 72 | 75 | 52 | 52 | 52 | 43 (43 / 0 / 0) | 0 |  |
| 4 | 27 | 4.27 Hover Default's column in the archived view | `page-04-board-27-4-27-hover-defaults-column-in-the-archived-view.png` | 1455×1050 | 73 | 75 | 53 | 53 | 53 | 43 (43 / 0 / 0) | 0 |  |
| 5 | 01 | 5.1 Type a part cost in the Price Part Simulator | `page-05-board-01-5-1-type-a-part-cost-in-the-price-part-simulator.png` | 1455×1050 | 106 | 49 | 46 | 46 | 46 | 38 (38 / 0 / 0) | 0 |  |
| 5 | 02 | 5.2 A cost a tier sells below | `page-05-board-02-5-2-a-cost-a-tier-sells-below.png` | 1455×1050 | 106 | 54 | 47 | 47 | 47 | 38 (38 / 0 / 0) | 0 |  |
| 5 | 03 | 5.3 Type 0 as the part cost | `page-05-board-03-5-3-type-0-as-the-part-cost.png` | 1455×1050 | 100 | 49 | 46 | 46 | 46 | 38 (38 / 0 / 0) | 0 |  |
| 5 | 04 | 5.4 Type a cost while editing the grid | `page-05-board-04-5-4-type-a-cost-while-editing-the-grid.png` | 1455×1050 | 114 | 188 | 87 | 87 | 87 | 69 (69 / 0 / 0) | 0 |  |
| 6 | 01 | 6.1 Today: the matrices list | `page-06-board-01-6-1-today-the-matrices-list.png` | 1440×699 | 2 | 1 | 0 | 0 | 0 | 0 (0 / 0 / 0) | 0 | image not available: 404 _blob/d1175e1635cfdc31a9ed11b0b59188b7 |
| 6 | 02 | 6.2 Click the Matrices tab | `page-06-board-02-6-2-click-the-matrices-tab.png` | 1455×1050 | 94 | 74 | 69 | 69 | 69 | 55 (55 / 0 / 0) | 0 |  |
| 6 | 03 | 6.3 Hover the Tiers info icon | `page-06-board-03-6-3-hover-the-tiers-info-icon.png` | 1455×1050 | 95 | 74 | 70 | 70 | 70 | 55 (55 / 0 / 0) | 0 |  |
| 6 | 04 | 6.4 Hover the tier numbers in the Tiers column | `page-06-board-04-6-4-hover-the-tier-numbers-in-the-tiers-column.png` | 1455×1050 | 95 | 74 | 70 | 70 | 70 | 55 (55 / 0 / 0) | 0 |  |
| 6 | 05 | 6.5 Click the Status filter | `page-06-board-05-6-5-click-the-status-filter.png` | 1455×1050 | 99 | 75 | 72 | 72 | 72 | 58 (58 / 0 / 0) | 0 |  |
| 6 | 06 | 6.6 Pick Inactive | `page-06-board-06-6-6-pick-inactive.png` | 1455×1050 | 99 | 75 | 72 | 72 | 72 | 58 (58 / 0 / 0) | 0 |  |
| 6 | 07 | 6.7 Result: The chip turns blue with the selection | `page-06-board-07-6-7-result-the-chip-turns-blue-with-the-selection.png` | 1455×1050 | 64 | 50 | 50 | 50 | 50 | 39 (39 / 0 / 0) | 0 |  |
| 6 | 08 | 6.8 Hover an Inactive status | `page-06-board-08-6-8-hover-an-inactive-status.png` | 1455×1050 | 95 | 74 | 70 | 70 | 70 | 55 (55 / 0 / 0) | 0 |  |
| 6 | 09 | 6.9 Search "tread" | `page-06-board-09-6-9-search-tread.png` | 1455×1050 | 57 | 43 | 45 | 45 | 45 | 37 (37 / 0 / 0) | 0 |  |
| 6 | 10 | 6.10 A search with no match | `page-06-board-10-6-10-a-search-with-no-match.png` | 1455×1050 | 47 | 36 | 39 | 39 | 39 | 34 (34 / 0 / 0) | 0 |  |
| 6 | 11 | 6.11 Click a matrix's three-dot menu | `page-06-board-11-6-11-click-a-matrixs-three-dot-menu.png` | 1455×1050 | 96 | 74 | 72 | 72 | 72 | 53 (53 / 0 / 0) | 0 |  |
| 6 | 12 | 6.12 The General Matrix's menu | `page-06-board-12-6-12-the-general-matrixs-menu.png` | 1455×1050 | 97 | 75 | 73 | 73 | 73 | 52 (52 / 0 / 0) | 0 |  |
| 6 | 13 | 6.13 Audit Log beside New Matrix | `page-06-board-13-6-13-audit-log-beside-new-matrix.png` | 1455×1050 | 95 | 74 | 70 | 70 | 70 | 55 (55 / 0 / 0) | 0 |  |
| 6 | 14 | 6.14 Result: "Audit Log: Matrices": every matrix's changes, deleted ones included | `page-06-board-14-6-14-result-audit-log-matrices-every-matrixs-changes-deleted.png` | 1455×1050 | 251 | 76 | 71 | 71 | 71 | 2 (2 / 0 / 0) | 0 |  |
| 7 | 01 | 7.1 Today: the Categories list | `page-07-board-01-7-1-today-the-categories-list.png` | 1440×1074 | 70 | 8 | 46 | 46 | 46 | 36 (36 / 0 / 0) | 0 |  |
| 7 | 02 | 7.2 Today: Edit Category | `page-07-board-02-7-2-today-edit-category.png` | 1440×1074 | 77 | 13 | 54 | 54 | 54 | 7 (7 / 0 / 0) | 0 |  |
| 7 | 03 | 7.3 Settings › Categories | `page-07-board-03-7-3-settings-categories.png` | 1455×1050 | 199 | 138 | 155 | 155 | 155 | 48 (48 / 0 / 0) | 0 |  |
| 7 | 04 | 7.4 Hover a "Uses previous tier" cell | `page-07-board-04-7-4-hover-a-uses-previous-tier-cell.png` | 1455×1050 | 200 | 138 | 156 | 156 | 156 | 48 (48 / 0 / 0) | 0 |  |
| 7 | 05 | 7.5 Search "tire" | `page-07-board-05-7-5-search-tire.png` | 1455×1050 | 69 | 48 | 50 | 50 | 50 | 32 (32 / 0 / 0) | 0 |  |
| 7 | 06 | 7.6 A search with no match | `page-07-board-06-7-6-a-search-with-no-match.png` | 1455×1050 | 41 | 36 | 35 | 35 | 35 | 31 (31 / 0 / 0) | 0 |  |
| 7 | 07 | 7.7 Click a category (Brakes) | `page-07-board-07-7-7-click-a-category-brakes.png` | 1455×1050 | 199 | 138 | 155 | 155 | 155 | 48 (48 / 0 / 0) | 0 |  |
| 7 | 08 | 7.8 Result: The category page: name, Tax Exempt, QuickBooks mapping, its matrix and that matrix's grid (read only), Edit | `page-07-board-08-7-8-result-the-category-page-name-tax-exempt-quickbooks-mapp.png` | 1455×1050 | 80 | 55 | 49 | 49 | 49 | 39 (39 / 0 / 0) | 0 |  |
| 7 | 09 | 7.9 A category whose matrix prices others | `page-07-board-09-7-9-a-category-whose-matrix-prices-others.png` | 1455×1050 | 75 | 59 | 55 | 55 | 55 | 40 (40 / 0 / 0) | 0 |  |
| 7 | 10 | 7.10 Hover the grayed Edit | `page-07-board-10-7-10-hover-the-grayed-edit.png` | 1455×1050 | 75 | 59 | 55 | 55 | 55 | 40 (40 / 0 / 0) | 0 |  |
| 7 | 11 | 7.11 Click "Go to the Fluids 30 matrix" | `page-07-board-11-7-11-click-go-to-the-fluids-30-matrix.png` | 1455×1050 | 106 | 187 | 83 | 83 | 83 | 62 (62 / 0 / 0) | 0 |  |
| 7 | 12 | 7.12 Click New Matrix on a category's page | `page-07-board-12-7-12-click-new-matrix-on-a-categorys-page.png` | 1455×1050 | 80 | 55 | 49 | 49 | 49 | 39 (39 / 0 / 0) | 0 |  |
| 7 | 13 | 7.13 Result: The new matrix opens with this category already picked; the breadcrumb leads back to the category | `page-07-board-13-7-13-result-the-new-matrix-opens-with-this-category-already-.png` | 1455×1050 | 95 | 133 | 68 | 68 | 68 | 52 (52 / 0 / 0) | 0 |  |
| 7 | 14 | 7.14 Audit Log beside New Category | `page-07-board-14-7-14-audit-log-beside-new-category.png` | 1455×1050 | 200 | 138 | 156 | 156 | 156 | 49 (49 / 0 / 0) | 0 |  |
| 7 | 15 | 7.15 Result: "Audit Log: Categories" | `page-07-board-15-7-15-result-audit-log-categories.png` | 1455×1050 | 238 | 140 | 157 | 157 | 157 | 2 (2 / 0 / 0) | 0 |  |
| 8 | 01 | 8.1 Pick another matrix for the category | `page-08-board-01-8-1-pick-another-matrix-for-the-category.png` | 1455×1050 | 83 | 54 | 49 | 49 | 49 | 40 (40 / 0 / 0) | 0 |  |
| 8 | 02 | 8.2 Uncategorized | `page-08-board-02-8-2-uncategorized.png` | 1455×1050 | 199 | 138 | 155 | 155 | 155 | 48 (48 / 0 / 0) | 0 |  |
| 8 | 03 | 8.3 Result: A system category: it can't be renamed, moved or deleted, and always uses the General Matrix | `page-08-board-03-8-3-result-a-system-category-it-cant-be-renamed-moved-or-del.png` | 1455×1050 | 95 | 44 | 44 | 44 | 44 | 35 (35 / 0 / 0) | 0 |  |
| 8 | 04 | 8.4 Rename Brakes to a taken name | `page-08-board-04-8-4-rename-brakes-to-a-taken-name.png` | 1455×1050 | 80 | 56 | 49 | 49 | 49 | 38 (38 / 0 / 0) | 0 |  |
| 8 | 05 | 8.5 Click New Category | `page-08-board-05-8-5-click-new-category.png` | 1455×1050 | 199 | 138 | 155 | 155 | 155 | 48 (48 / 0 / 0) | 0 |  |
| 8 | 06 | 8.6 Result: Name (cursor in it), matrix, Cancel / Create Category | `page-08-board-06-8-6-result-name-cursor-in-it-matrix-cancel-create-category.png` | 1455×1050 | 94 | 48 | 43 | 43 | 43 | 38 (38 / 0 / 0) | 0 |  |
| 8 | 07 | 8.7 Click Create Category with no name | `page-08-board-07-8-7-click-create-category-with-no-name.png` | 1455×1050 | 95 | 48 | 43 | 43 | 43 | 38 (38 / 0 / 0) | 0 |  |
| 8 | 08 | 8.8 Type "Wheel Seals" and click Create Category | `page-08-board-08-8-8-type-wheel-seals-and-click-create-category.png` | 1455×1050 | 94 | 49 | 43 | 43 | 43 | 38 (38 / 0 / 0) | 0 |  |
| 8 | 09 | 8.9 Result: Created on the General Matrix; the toast says so | `page-08-board-09-8-9-result-created-on-the-general-matrix-the-toast-says-so.png` | 1455×1050 | 98 | 51 | 46 | 46 | 46 | 40 (40 / 0 / 0) | 0 |  |
| 8 | 10 | 8.10 Click Delete in the three-dot menu | `page-08-board-10-8-10-click-delete-in-the-three-dot-menu.png` | 1455×1050 | 98 | 51 | 49 | 49 | 49 | 42 (42 / 0 / 0) | 0 |  |
| 8 | 11 | 8.11 Click Delete in the delete dialog | `page-08-board-11-8-11-click-delete-in-the-delete-dialog.png` | 1455×1050 | 100 | 53 | 49 | 49 | 49 | 3 (3 / 0 / 0) | 0 |  |
| 8 | 12 | 8.12 Result: The category is gone; its parts and past lines are in Uncategorized | `page-08-board-12-8-12-result-the-category-is-gone-its-parts-and-past-lines-ar.png` | 1455×1050 | 191 | 132 | 148 | 148 | 148 | 47 (47 / 0 / 0) | 0 |  |
| 9 | 01 | 9.1 Click the tier's Customers tab | `page-09-board-01-9-1-click-the-tiers-customers-tab.png` | 1455×1050 | 57 | 37 | 41 | 41 | 41 | 35 (35 / 0 / 0) | 0 |  |
| 9 | 02 | 9.2 Search a tier's Customers tab with no match | `page-09-board-02-9-2-search-a-tiers-customers-tab-with-no-match.png` | 1455×1050 | 49 | 39 | 41 | 41 | 41 | 36 (36 / 0 / 0) | 0 |  |
| 9 | 03 | 9.3 Open the Customers tab's channel filter | `page-09-board-03-9-3-open-the-customers-tabs-channel-filter.png` | 1455×1050 | 62 | 38 | 44 | 44 | 44 | 38 (38 / 0 / 0) | 0 |  |
| 9 | 04 | 9.4 Click Manage Customers | `page-09-board-04-9-4-click-manage-customers.png` | 1455×1050 | 131 | 66 | 70 | 70 | 70 | 25 (25 / 0 / 0) | 0 |  |
| 9 | 05 | 9.5 Hover the Add Customers tab | `page-09-board-05-9-5-hover-the-add-customers-tab.png` | 1455×1050 | 152 | 76 | 83 | 83 | 83 | 25 (25 / 0 / 0) | 0 |  |
| 9 | 06 | 9.6 Check two customers | `page-09-board-06-9-6-check-two-customers.png` | 1455×1050 | 160 | 85 | 96 | 96 | 96 | 25 (25 / 0 / 0) | 0 |  |
| 9 | 07 | 9.7 Uncheck Part Sales on one row | `page-09-board-07-9-7-uncheck-part-sales-on-one-row.png` | 1455×1050 | 160 | 85 | 96 | 96 | 96 | 26 (26 / 0 / 0) | 0 |  |
| 9 | 08 | 9.8 Uncheck both Work Orders and Part Sales on a row | `page-09-board-08-9-8-uncheck-both-work-orders-and-part-sales-on-a-row.png` | 1455×1050 | 139 | 73 | 80 | 80 | 80 | 29 (29 / 0 / 0) | 0 |  |
| 9 | 09 | 9.9 Click Select All | `page-09-board-09-9-9-click-select-all.png` | 1455×1050 | 197 | 123 | 171 | 171 | 171 | 5 (5 / 0 / 0) | 0 |  |
| 9 | 10 | 9.10 Uncheck Part Sales in the bar, then Select All | `page-09-board-10-9-10-uncheck-part-sales-in-the-bar-then-select-all.png` | 1455×1050 | 138 | 73 | 80 | 80 | 80 | 28 (28 / 0 / 0) | 0 |  |
| 9 | 11 | 9.11 Result: Customers already on Tier 2 for the picked channel are skipped, and the footer says how many | `page-09-board-11-9-11-result-customers-already-on-tier-2-for-the-picked-chann.png` | 1455×1050 | 175 | 111 | 155 | 155 | 155 | 27 (27 / 0 / 0) | 0 |  |
| 9 | 12 | 9.12 Search customers | `page-09-board-12-9-12-search-customers.png` | 1455×1050 | 103 | 62 | 67 | 67 | 67 | 9 (9 / 0 / 0) | 0 |  |
| 9 | 13 | 9.13 A search with no match | `page-09-board-13-9-13-a-search-with-no-match.png` | 1455×1050 | 90 | 57 | 63 | 63 | 63 | 5 (5 / 0 / 0) | 0 |  |
| 9 | 14 | 9.14 Click Add to Tier 2 | `page-09-board-14-9-14-click-add-to-tier-2.png` | 1455×1050 | 140 | 75 | 84 | 84 | 84 | 25 (25 / 0 / 0) | 0 |  |
| 9 | 15 | 9.15 Result: New work orders and Part Sales use Tier 2 | `page-09-board-15-9-15-result-new-work-orders-and-part-sales-use-tier-2.png` | 1455×1050 | 63 | 37 | 41 | 41 | 41 | 35 (35 / 0 / 0) | 0 |  |
| 9 | 16 | 9.16 Click the Remove Customers tab | `page-09-board-16-9-16-click-the-remove-customers-tab.png` | 1455×1050 | 104 | 59 | 65 | 65 | 65 | 8 (8 / 0 / 0) | 0 |  |
| 9 | 17 | 9.17 Check one and click Remove | `page-09-board-17-9-17-check-one-and-click-remove.png` | 1455×1050 | 110 | 66 | 75 | 75 | 75 | 9 (9 / 0 / 0) | 0 |  |
| 9 | 18 | 9.18 Result: "Remove 1 Customer?" They go back to Default for the channels picked | `page-09-board-18-9-18-result-remove-1-customer-they-go-back-to-default-for-th.png` | 1455×1050 | 82 | 49 | 56 | 56 | 56 | 3 (3 / 0 / 0) | 0 |  |
| 9 | 19 | 9.19 Click Remove | `page-09-board-19-9-19-click-remove.png` | 1455×1050 | 62 | 39 | 44 | 44 | 44 | 3 (3 / 0 / 0) | 0 |  |
| 9 | 20 | 9.20 Result: They are back on Default | `page-09-board-20-9-20-result-they-are-back-on-default.png` | 1455×1050 | 57 | 37 | 41 | 41 | 41 | 35 (35 / 0 / 0) | 0 |  |
| 9 | 21 | 9.21 An archived tier's Customers tab | `page-09-board-21-9-21-an-archived-tiers-customers-tab.png` | 1455×1050 | 47 | 35 | 36 | 36 | 36 | 34 (34 / 0 / 0) | 0 |  |
| 9 | 22 | 9.22 Click Reactivate Tier | `page-09-board-22-9-22-click-reactivate-tier.png` | 1455×1050 | 47 | 35 | 36 | 36 | 36 | 34 (34 / 0 / 0) | 0 |  |
| 9 | 23 | 9.23 Result: No confirmation | `page-09-board-23-9-23-result-no-confirmation.png` | 1455×1050 | 48 | 35 | 36 | 36 | 36 | 34 (34 / 0 / 0) | 0 |  |
| 9 | 24 | 9.24 Remove tab of a tier with no customers | `page-09-board-24-9-24-remove-tab-of-a-tier-with-no-customers.png` | 1455×1050 | 59 | 43 | 44 | 44 | 44 | 4 (4 / 0 / 0) | 0 |  |
| 9 | 25 | 9.25 Today: the Customers list | `page-09-board-25-9-25-today-the-customers-list.png` | 1440×826 | 2 | 1 | 0 | 0 | 0 | 0 (0 / 0 / 0) | 0 | image not available: 404 _blob/72af1c1afcc9e3c3e35b0debf032a759 |
| 9 | 26 | 9.26 Today: a customer's page | `page-09-board-26-9-26-today-a-customers-page.png` | 1440×832 | 2 | 1 | 0 | 0 | 0 | 0 (0 / 0 / 0) | 0 | image not available: 404 _blob/b508ea5515569b9aa353cad62df40db0 |
| 9 | 27 | 9.27 Today: Edit Customer | `page-09-board-27-9-27-today-edit-customer.png` | 1440×827 | 2 | 1 | 0 | 0 | 0 | 0 (0 / 0 / 0) | 0 | image not available: 404 _blob/105ccbfb8cb199fbda5c1f83c414a7b7 |
| 9 | 28 | 9.28 Customers | `page-09-board-28-9-28-customers.png` | 1455×1111 | 74 | 15 | 40 | 40 | 40 | 33 (33 / 0 / 0) | 0 | content 1211 px tall, canvas frame 1111 px: bottom cut on the canvas; full-height picture saved |
| 9 | 29 | 9.29 Open a customer | `page-09-board-29-9-29-open-a-customer.png` | 1455×1111 | 74 | 15 | 40 | 40 | 40 | 33 (33 / 0 / 0) | 0 | content 1211 px tall, canvas frame 1111 px: bottom cut on the canvas; full-height picture saved |
| 9 | 30 | 9.30 Result: The customer card's Pricing group: labor rate, shop supplies, tax, Work Order tier, Part Sales tier | `page-09-board-30-9-30-result-the-customer-cards-pricing-group-labor-rate-shop.png` | 1455×1088 | 208 | 18 | 20 | 20 | 20 | 15 (15 / 0 / 0) | 0 | content 1185 px tall, canvas frame 1088 px: bottom cut on the canvas; full-height picture saved |
| 9 | 31 | 9.31 Click Edit | `page-09-board-31-9-31-click-edit.png` | 1455×1088 | 220 | 32 | 38 | 38 | 38 | 18 (18 / 0 / 0) | 0 | content 1185 px tall, canvas frame 1088 px: bottom cut on the canvas; full-height picture saved |
| 9 | 32 | 9.32 Click Work Order Tier and type 3 | `page-09-board-32-9-32-click-work-order-tier-and-type-3.png` | 1455×1088 | 221 | 37 | 43 | 43 | 43 | 17 (17 / 0 / 0) | 0 | content 1185 px tall, canvas frame 1088 px: bottom cut on the canvas; full-height picture saved |
| 9 | 33 | 9.33 Pick 3 · Tier 3 | `page-09-board-33-9-33-pick-3-tier-3.png` | 1455×1088 | 226 | 35 | 47 | 47 | 47 | 20 (20 / 0 / 0) | 0 | content 1185 px tall, canvas frame 1088 px: bottom cut on the canvas; full-height picture saved |
| 9 | 34 | 9.34 Click Save | `page-09-board-34-9-34-click-save.png` | 1455×1088 | 220 | 32 | 38 | 38 | 38 | 18 (18 / 0 / 0) | 0 | content 1185 px tall, canvas frame 1088 px: bottom cut on the canvas; full-height picture saved |
| 9 | 35 | 9.35 Result: The card shows the new tier | `page-09-board-35-9-35-result-the-card-shows-the-new-tier.png` | 1455×1088 | 210 | 18 | 20 | 20 | 20 | 15 (15 / 0 / 0) | 0 | content 1185 px tall, canvas frame 1088 px: bottom cut on the canvas; full-height picture saved |
| 9 | 36 | 9.36 Edit the Counter Sale customer | `page-09-board-36-9-36-edit-the-counter-sale-customer.png` | 1455×900 | 72 | 29 | 38 | 38 | 38 | 18 (18 / 0 / 0) | 0 |  |
| 9 | 37 | 9.37 Edit Customer with only Default | `page-09-board-37-9-37-edit-customer-with-only-default.png` | 1455×1088 | 212 | 30 | 34 | 34 | 34 | 14 (14 / 0 / 0) | 0 | content 1185 px tall, canvas frame 1088 px: bottom cut on the canvas; full-height picture saved |
| 9 | 38 | 9.38 Today: Edit Customer on a phone | `page-09-board-38-9-38-today-edit-customer-on-a-phone.png` | 390×794 | 2 | 1 | 0 | 0 | 0 | 0 (0 / 0 / 0) | 0 | image not available: 404 _blob/bdff3723c67e1c9b6c40feddfac5f019 |
| 9 | 39 | 9.39 On a phone: Edit Customer | `page-09-board-39-9-39-on-a-phone-edit-customer.png` | 390×844 | 14 | 13 | 20 | 20 | 20 | 18 (18 / 0 / 0) | 0 |  |
| 9 | 40 | 9.40 On a phone: tap Work Order Tier | `page-09-board-40-9-40-on-a-phone-tap-work-order-tier.png` | 390×844 | 20 | 16 | 29 | 29 | 29 | 20 (20 / 0 / 0) | 0 |  |
| 9 | 41 | 9.41 On a phone: pick 3 · Tier 3 | `page-09-board-41-9-41-on-a-phone-pick-3-tier-3.png` | 390×844 | 14 | 13 | 20 | 20 | 20 | 18 (18 / 0 / 0) | 0 |  |
| 10 | 01 | 10.1 Today: a work order | `page-10-board-01-10-1-today-a-work-order.png` | 1440×823 | 2 | 1 | 0 | 0 | 0 | 0 (0 / 0 / 0) | 0 | image not available: 404 _blob/129e47c2eb8d305c300eb3c65d0f227f |
| 10 | 02 | 10.2 Today: Add Part, quick-add row | `page-10-board-02-10-2-today-add-part-quick-add-row.png` | 1440×822 | 2 | 1 | 0 | 0 | 0 | 0 (0 / 0 / 0) | 0 | image not available: 404 _blob/8d543c2f468b4f0070e275609b7f35d9 |
| 10 | 03 | 10.3 Today: cost fills the sell price | `page-10-board-03-10-3-today-cost-fills-the-sell-price.png` | 1440×819 | 2 | 1 | 0 | 0 | 0 | 0 (0 / 0 / 0) | 0 | image not available: 404 _blob/adff8707f3280c90fb71ffb85fed88af |
| 10 | 04 | 10.4 Open a work order (S1-2671) | `page-10-board-04-10-4-open-a-work-order-s1-2671.png` | 1455×876 | 67 | 13 | 21 | 21 | 21 | 17 (17 / 0 / 0) | 0 |  |
| 10 | 05 | 10.5 Result: Parts are priced by the work order's tier | `page-10-board-05-10-5-result-parts-are-priced-by-the-work-orders-tier.png` | 1455×876 | 113 | 28 | 30 | 30 | 30 | 23 (23 / 0 / 0) | 0 |  |
| 10 | 06 | 10.6 Quick Add a part with a cost | `page-10-board-06-10-6-quick-add-a-part-with-a-cost.png` | 1455×895 | 124 | 72 | 45 | 45 | 45 | 38 (38 / 0 / 0) | 0 | content 973 px tall, canvas frame 895 px: bottom cut on the canvas; full-height picture saved |
| 10 | 07 | 10.7 Save it | `page-10-board-07-10-7-save-it.png` | 1455×895 | 124 | 72 | 45 | 45 | 45 | 38 (38 / 0 / 0) | 0 | content 973 px tall, canvas frame 895 px: bottom cut on the canvas; full-height picture saved |
| 10 | 08 | 10.8 Result: Priced by the work order's tier | `page-10-board-08-10-8-result-priced-by-the-work-orders-tier.png` | 1455×876 | 123 | 30 | 32 | 32 | 32 | 24 (24 / 0 / 0) | 0 |  |
| 10 | 09 | 10.9 Quick Add with a sell price of -5 | `page-10-board-09-10-9-quick-add-with-a-sell-price-of-5.png` | 1455×935 | 125 | 72 | 45 | 45 | 45 | 37 (37 / 0 / 0) | 0 | content 1023 px tall, canvas frame 935 px: bottom cut on the canvas; full-height picture saved |
| 10 | 10 | 10.10 A part with no cost | `page-10-board-10-10-10-a-part-with-no-cost.png` | 1455×876 | 67 | 13 | 21 | 21 | 21 | 17 (17 / 0 / 0) | 0 |  |
| 10 | 11 | 10.11 Result: No rule prices it: $0.00, logged under the work order's tier | `page-10-board-11-10-11-result-no-rule-prices-it-0-00-logged-under-the-work-or.png` | 1455×876 | 113 | 28 | 30 | 30 | 30 | 23 (23 / 0 / 0) | 0 |  |
| 10 | 12 | 10.12 Click the Fixed Rules tab | `page-10-board-12-10-12-click-the-fixed-rules-tab.png` | 1455×1050 | 54 | 32 | 33 | 33 | 33 | 31 (31 / 0 / 0) | 0 |  |
| 11 | 01 | 11.1 Click a part | `page-11-board-01-11-1-click-a-part.png` | 1455×876 | 131 | 78 | 54 | 54 | 54 | 20 (20 / 0 / 0) | 0 |  |
| 11 | 02 | 11.2 Type a sell price | `page-11-board-02-11-2-type-a-sell-price.png` | 1455×876 | 131 | 78 | 54 | 54 | 54 | 20 (20 / 0 / 0) | 0 |  |
| 11 | 03 | 11.3 Split Work Order (works as today) | `page-11-board-03-11-3-split-work-order-works-as-today.png` | 1455×876 | 121 | 32 | 37 | 37 | 37 | 4 (4 / 0 / 0) | 0 |  |
| 11 | 04 | 11.4 After the split | `page-11-board-04-11-4-after-the-split.png` | 1455×876 | 121 | 32 | 37 | 37 | 37 | 4 (4 / 0 / 0) | 0 |  |
| 11 | 05 | 11.5 Result: The new work order, priced by the customer's current tier | `page-11-board-05-11-5-result-the-new-work-order-priced-by-the-customers-curre.png` | 1455×876 | 85 | 24 | 25 | 25 | 25 | 20 (20 / 0 / 0) | 0 |  |
| 11 | 06 | 11.6 Receive a part | `page-11-board-06-11-6-receive-a-part.png` | 1455×876 | 119 | 31 | 35 | 35 | 35 | 5 (5 / 0 / 0) | 0 |  |
| 11 | 07 | 11.7 Receive a tier-priced part at a new cost, then hover its price | `page-11-board-07-11-7-receive-a-tier-priced-part-at-a-new-cost-then-hover-its.png` | 1455×876 | 133 | 29 | 30 | 30 | 30 | 23 (23 / 0 / 0) | 0 |  |
| 12 | 01 | 12.1 Hover a price | `page-12-board-01-12-1-hover-a-price.png` | 1455×876 | 131 | 29 | 30 | 30 | 30 | 23 (23 / 0 / 0) | 0 |  |
| 12 | 02 | 12.2 Hover a part priced through Same as previous tier | `page-12-board-02-12-2-hover-a-part-priced-through-same-as-previous-tier.png` | 1455×876 | 143 | 31 | 32 | 32 | 32 | 24 (24 / 0 / 0) | 0 |  |
| 12 | 03 | 12.3 Hover a typed price | `page-12-board-03-12-3-hover-a-typed-price.png` | 1455×906 | 125 | 29 | 30 | 30 | 30 | 23 (23 / 0 / 0) | 0 |  |
| 12 | 04 | 12.4 Click the Parts tab | `page-12-board-04-12-4-click-the-parts-tab.png` | 1455×876 | 157 | 43 | 77 | 77 | 77 | 70 (70 / 0 / 0) | 0 |  |
| 12 | 05 | 12.5 A line priced before tiers | `page-12-board-05-12-5-a-line-priced-before-tiers.png` | 1455×876 | 77 | 21 | 22 | 22 | 22 | 18 (18 / 0 / 0) | 0 |  |
| 12 | 06 | 12.6 The customer has moved tier since | `page-12-board-06-12-6-the-customer-has-moved-tier-since.png` | 1455×876 | 93 | 23 | 24 | 24 | 24 | 19 (19 / 0 / 0) | 0 |  |
| 12 | 07 | 12.7 A canned line part on a Default work order | `page-12-board-07-12-7-a-canned-line-part-on-a-default-work-order.png` | 1455×876 | 126 | 29 | 31 | 31 | 31 | 23 (23 / 0 / 0) | 0 |  |
| 12 | 08 | 12.8 A part on a fixed line total | `page-12-board-08-12-8-a-part-on-a-fixed-line-total.png` | 1455×949 | 126 | 29 | 31 | 31 | 31 | 23 (23 / 0 / 0) | 0 |  |
| 12 | 09 | 12.9 Hover a line priced for the previous customer | `page-12-board-09-12-9-hover-a-line-priced-for-the-previous-customer.png` | 1455×876 | 139 | 30 | 34 | 34 | 34 | 26 (26 / 0 / 0) | 0 | content 902 px tall, canvas frame 876 px: bottom cut on the canvas; full-height picture saved |
| 13 | 01 | 13.1 Today: a Part Sale | `page-13-board-01-13-1-today-a-part-sale.png` | 1440×822 | 2 | 1 | 0 | 0 | 0 | 0 (0 / 0 / 0) | 0 | image not available: 404 _blob/10ddd902cbe42fc21e4989d147a493a0 |
| 13 | 02 | 13.2 Open a Part Sale (P1-1131) | `page-13-board-02-13-2-open-a-part-sale-p1-1131.png` | 1455×876 | 39 | 13 | 17 | 17 | 17 | 13 (13 / 0 / 0) | 0 |  |
| 13 | 03 | 13.3 Result: Priced by the Part Sale's tier, from the Part Sale Matrix side when it is on | `page-13-board-03-13-3-result-priced-by-the-part-sales-tier-from-the-part-sale.png` | 1455×876 | 90 | 28 | 41 | 41 | 41 | 37 (37 / 0 / 0) | 0 |  |
| 13 | 04 | 13.4 Hover a price | `page-13-board-04-13-4-hover-a-price.png` | 1455×876 | 108 | 29 | 41 | 41 | 41 | 33 (33 / 0 / 0) | 0 |  |
| 14 | 01 | 14.1 Today: Change Customer | `page-14-board-01-14-1-today-change-customer.png` | 1440×821 | 2 | 1 | 0 | 0 | 0 | 0 (0 / 0 / 0) | 0 | image not available: 404 _blob/67e677c5973a4990cce0c734bb6ccd54 |
| 14 | 02 | 14.2 Click the work order's three-dot menu | `page-14-board-02-14-2-click-the-work-orders-three-dot-menu.png` | 1455×876 | 116 | 28 | 33 | 33 | 33 | 26 (26 / 0 / 0) | 0 |  |
| 14 | 03 | 14.3 Change Customer | `page-14-board-03-14-3-change-customer.png` | 1455×876 | 123 | 55 | 40 | 40 | 40 | 4 (4 / 0 / 0) | 0 |  |
| 14 | 04 | 14.4 Pick a customer on another tier | `page-14-board-04-14-4-pick-a-customer-on-another-tier.png` | 1455×876 | 124 | 55 | 40 | 40 | 40 | 5 (5 / 0 / 0) | 0 |  |
| 14 | 05 | 14.5 Change Customer on a Part Sale | `page-14-board-05-14-5-change-customer-on-a-part-sale.png` | 1455×876 | 101 | 55 | 51 | 51 | 51 | 5 (5 / 0 / 0) | 0 |  |
| 14 | 06 | 14.6 Pick a customer on the same tier | `page-14-board-06-14-6-pick-a-customer-on-the-same-tier.png` | 1455×876 | 123 | 55 | 40 | 40 | 40 | 5 (5 / 0 / 0) | 0 |  |
| 14 | 07 | 14.7 Click Update Customer | `page-14-board-07-14-7-click-update-customer.png` | 1455×876 | 124 | 55 | 40 | 40 | 40 | 5 (5 / 0 / 0) | 0 |  |
| 14 | 08 | 14.8 Result: A notice counts the lines priced for the previous customer | `page-14-board-08-14-8-result-a-notice-counts-the-lines-priced-for-the-previou.png` | 1455×876 | 118 | 29 | 34 | 34 | 34 | 26 (26 / 0 / 0) | 0 | content 902 px tall, canvas frame 876 px: bottom cut on the canvas; full-height picture saved |
| 15 | 01 | 15.1 Hover the below-cost warning | `page-15-board-01-15-1-hover-the-below-cost-warning.png` | 1455×1050 | 107 | 54 | 48 | 48 | 48 | 38 (38 / 0 / 0) | 0 |  |
| 15 | 02 | 15.2 Type 95 in Tier 5 while editing | `page-15-board-02-15-2-type-95-in-tier-5-while-editing.png` | 1455×1050 | 114 | 192 | 89 | 89 | 89 | 69 (69 / 0 / 0) | 0 |  |
| 20 | 01 | 20.1 Today: Sales By Customer, unchanged | `page-20-board-01-20-1-today-sales-by-customer-unchanged.png` | 1440×822 | 2 | 1 | 0 | 0 | 0 | 0 (0 / 0 / 0) | 0 | image not available: 404 _blob/34bdd250e87731c8bcb43db44d9cd754 |
| 20 | 02 | 20.2 Reports › Sales by Tier | `page-20-board-02-20-2-reports-sales-by-tier.png` | 1455×876 | 108 | 41 | 44 | 44 | 44 | 41 (41 / 0 / 0) | 0 |  |
| 20 | 03 | 20.3 Open a tier's row | `page-20-board-03-20-3-open-a-tiers-row.png` | 1455×907 | 172 | 57 | 52 | 52 | 52 | 47 (47 / 0 / 0) | 0 |  |
| 20 | 04 | 20.4 Open a customer's row | `page-20-board-04-20-4-open-a-customers-row.png` | 1455×912 | 190 | 57 | 54 | 54 | 54 | 48 (48 / 0 / 0) | 0 |  |
| 20 | 05 | 20.5 Open Priced By | `page-20-board-05-20-5-open-priced-by.png` | 1455×876 | 120 | 42 | 56 | 56 | 56 | 51 (51 / 0 / 0) | 0 |  |
| 20 | 06 | 20.6 Open the Customer filter | `page-20-board-06-20-6-open-the-customer-filter.png` | 1455×876 | 131 | 44 | 69 | 69 | 69 | 62 (62 / 0 / 0) | 0 |  |
| 20 | 07 | 20.7 Open the Category filter | `page-20-board-07-20-7-open-the-category-filter.png` | 1455×876 | 126 | 44 | 64 | 64 | 64 | 57 (57 / 0 / 0) | 0 |  |
| 20 | 08 | 20.8 Open the Location filter | `page-20-board-08-20-8-open-the-location-filter.png` | 1455×876 | 111 | 42 | 47 | 47 | 47 | 42 (42 / 0 / 0) | 0 |  |
| 20 | 09 | 20.9 Sales Type: Work Orders only | `page-20-board-09-20-9-sales-type-work-orders-only.png` | 1455×876 | 111 | 42 | 46 | 46 | 46 | 41 (41 / 0 / 0) | 0 |  |
| 20 | 10 | 20.10 Pick a custom range over one year | `page-20-board-10-20-10-pick-a-custom-range-over-one-year.png` | 1455×876 | 117 | 44 | 54 | 54 | 54 | 46 (46 / 0 / 0) | 0 |  |
| 20 | 11 | 20.11 Pick a range with no sales | `page-20-board-11-20-11-pick-a-range-with-no-sales.png` | 1455×876 | 54 | 30 | 46 | 46 | 46 | 41 (41 / 0 / 0) | 0 |  |
| 20 | 12 | 20.12 Sort by Parts Margin | `page-20-board-12-20-12-sort-by-parts-margin.png` | 1455×876 | 108 | 41 | 44 | 44 | 44 | 41 (41 / 0 / 0) | 0 |  |
| 20 | 13 | 20.13 Result: First click on a number column puts the biggest on top (Parts Credits: the largest credit first); the second reverses; the third returns to the first-load order | `page-20-board-13-20-13-result-first-click-on-a-number-column-puts-the-biggest.png` | 1455×876 | 108 | 41 | 44 | 44 | 44 | 40 (40 / 0 / 0) | 0 |  |
| 20 | 14 | 20.14 Click the Columns icon | `page-20-board-14-20-14-click-the-columns-icon.png` | 1455×876 | 114 | 42 | 50 | 50 | 50 | 43 (43 / 0 / 0) | 0 |  |
| 20 | 15 | 20.15 Hide Parts Margin | `page-20-board-15-20-15-hide-parts-margin.png` | 1455×876 | 105 | 42 | 49 | 49 | 49 | 42 (42 / 0 / 0) | 0 |  |
| 20 | 16 | 20.16 Sales by Category | `page-20-board-16-20-16-sales-by-category.png` | 1455×876 | 148 | 51 | 49 | 49 | 49 | 45 (45 / 0 / 0) | 0 |  |
| 20 | 17 | 20.17 Open a category's row | `page-20-board-17-20-17-open-a-categorys-row.png` | 1455×912 | 180 | 59 | 53 | 53 | 53 | 48 (48 / 0 / 0) | 0 |  |
| 20 | 18 | 20.18 Click Download | `page-20-board-18-20-18-click-download.png` | 1455×876 | 112 | 43 | 49 | 49 | 49 | 39 (39 / 0 / 0) | 0 |  |
| 20 | 19 | 20.19 Click Download Summary (CSV) | `page-20-board-19-20-19-click-download-summary-csv.png` | 1455×876 | 112 | 43 | 49 | 49 | 49 | 39 (39 / 0 / 0) | 0 |  |
| 20 | 20 | 20.20 Result: Prototype stand-in (see the info icon): the real menu item downloads the file | `page-20-board-20-20-20-result-prototype-stand-in-see-the-info-icon-the-real-m.png` | 1455×876 | 113 | 47 | 49 | 49 | 49 | 4 (4 / 0 / 0) | 0 |  |
| 20 | 21 | 20.21 Download with no rows | `page-20-board-21-20-21-download-with-no-rows.png` | 1455×876 | 52 | 29 | 43 | 43 | 43 | 33 (33 / 0 / 0) | 0 |  |
| 20 | 22 | 20.22 Result: "Empty export." | `page-20-board-22-20-22-result-empty-export.png` | 1455×876 | 49 | 27 | 38 | 38 | 38 | 35 (35 / 0 / 0) | 0 |  |
| 20 | 23 | 20.23 Filters that match nothing | `page-20-board-23-20-23-filters-that-match-nothing.png` | 1455×876 | 50 | 28 | 40 | 40 | 40 | 35 (35 / 0 / 0) | 0 |  |
