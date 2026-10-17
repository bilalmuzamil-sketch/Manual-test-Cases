# SV-11409 — Tech View and Board View: technician names behind avatars reachable by keyboard

- **Verdict: PASSED (6 of 6)** — Jira comment 78924, posted 17 Oct 2026.
- Staging `v26.40.19-754919e`, admin quick-login, window 1440 x 900, keyboard only for every check.
- Source: PRD 845185030 v64 S11-R2 (quoted), S5-R11b (names = staff record name); ticket "How to check" (2 bullets).

## Matrix (scripts k09*.mjs, data/*.json)
| Cell | Result |
|---|---|
| Tech View Tab order (k09a): toolbar → first row → row's own controls → out | row → On Site toggle → Copy VIN → avatars (when present) → More actions → leaves view (S11-R3 order) |
| Tech View S2-33043, 1 avatar | Tab stops on `avatar_technician_*`, aria-label "Admin ShopView", tooltip "Admin ShopView" |
| Tech View S2-15322, 4 avatars + "+1" | 5 stops, tooltips David Haynes / Karen Peck / Jason Johnson / Julie Olson / "Felicia Wang"; overflow aria-label "1 more: Felicia Wang" |
| Tech View S2-12718, "+3" | tooltip "Nicole Mitchell, Emily Madden, Karen Peck" |
| Board View S2-15322 / S2-12718 cards | same stops and names |
| Names vs staff records (k09j) | 11 technicians across 48 avatars in 13 rows (search "Lamkin"), all equal to the staff record first + last name; 5 "+N" labels list names |
| Columns menu, Tech View (k09d) | Enter opens; Tab reaches `toggle_tech_view_column_*` (role switch); Space off/on and Enter off/on change the table headers (Unit gone / back); Escape closes, focus returns to `button_tech_view_column_selection` |
| Fields to display, Board View | same with `toggle_board_field_*`; card loses / regains "Asset" |
| Status chip x, both views, Enter and Space (k09e) | `filter_chip_clear_status` (aria "Clear Status filter") reached by Tab; clears the filter (rows 110 → 305 Tech View; Board back to 669) |
| Asset on Site chip x, Tech Enter / Board Space (k09f) | `filter_chip_clear_vehicleHere` reached and clears |

## Side observation — to ask the QA lead (not in the comment, Rule 97d)
After the chip x clears the filter, the x disappears and keyboard focus falls to the page body (next Tab starts at "Skip to main content"). No requirement covers where focus goes after a chip is removed (S11-R6 is about menus and dialogs). Steps: Tech View → Tab to the Status chip → Enter → Tab to a status → Space → Escape → Tab to the x → Enter → press Tab once more: focus is on "Skip to main content" at the top of the page.

## State
Admin `tab`, `display`, `filters`, `collapsedGroups` preferences snapshot before each run and put back after. Two probe runs opened a New Work Order / New Line dialog by mistake; nothing was saved (no Save pressed).

## Evidence
`ev/sv11409-01-avatar-names.png`, `ev/sv11409-02-columns-and-chip.png` (build_exhibits.py from cap-*.png + data/cap.json). Film `ev/sv11409-keyboard-names-staging-recording-voiceover.mp4`: 99.5 s → 53.5 s, idle removed 46.3 s (13 stretches); offsets n1 0.5, n2 12.16, n3 24.7, n4 33.26, n5 45.86; frame grid checked. First take had the focused avatar under the caption box (row at the screen bottom) and a lingering caption across the view switch; fixed by scrolling the row to mid-screen and adding bridging captions.

## Gate
build identical · ticket TESTING STAGE, 1 comment · PRD v64 · text scan clean · steps 2 and 5 walked live (k09k: Tech View button + Tab x3 → first row; Board View button + Tab x2 → first card) · posted 78924 · read back: PASSED panel, media 1024x443, 1024x467, video; table 7 rows; steps 5.
