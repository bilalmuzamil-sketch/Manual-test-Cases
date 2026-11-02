# Design visual inventory — Technician Toggle (2 Nov 2026)

Rule 126 point 3, skill 21 §4b. The design is six static boards of captioned 1440 x 900 screenshots (no drawn screens, no script, no
dark theme, no other width), so `design_visual_inventory.py` (which measures DOM screens) would see only the board frames. The look was
therefore inventoried **by eye from every picture at 100% zoom**, with zoomed crops in `crops/` (toggle rows, the three "New" pills, the
no-match message, the filter). Pixel sampling was tried and dropped: the screenshots are anti-aliased, so single pixels landed on glyph
edges and gave misleading colours; every attribute below is an eye comparison a manual tester can repeat.

Each row: what the design shows → what the PRD says → class and case. Classes: COVERED (design case id in `DESIGN-CASE-PLAN.md`),
LOOK-ONLY (design is the source, PRD silent), OUT-OF-SCOPE (unchanged production, with the picture that proves it), SPEC-CONFLICT
(register id), DATA. Zero unclassified.

## 1 · Staff list (page 1; pictures tt-p1-01 before, tt-p1-02, tt-p2-07)

| # | Element | Design shows | PRD | Class / case |
|---|---|---|---|---|
| V-01 | Notice place | Between the toolbar row (Staff, Search, Permissions, Locations, Departments, New Staff Member) and the Active/Deactivated tabs; the tabs move down by the notice's height (compare tt-p1-01) | S4-R4 "below the page toolbar and above the Active and Deactivated tabs" | COVERED DC-01 |
| V-02 | Notice look | Light blue box, thin blue border, rounded corners, blue (i) icon at the left, dark text in two lines at 1440, full width of the content area | §8 "Info notice" | COVERED DC-01 |
| V-03 | Notice close | No X, no button | S4-R5 "cannot be closed" | COVERED DC-01 |
| V-04 | Technician column place | Created, Confirmed Invitation, **Technician**, Billable, edit icon | S4-R1 "directly left of Billable" | COVERED DC-02 |
| V-05 | Header style | Bold dark header text like every other header | S4-R1 (column), PRD silent on header style | COVERED DC-02 (LOOK-ONLY attribute) |
| V-06 | "New" pill on the header | Small rounded pill, light blue fill, thin blue border, blue "New", at the top right of the word, left edge touching its end; inside the column, a clear gap before Billable (crops/staff-header-pill.png) | S4-R3 | COVERED DC-03, DC-05 |
| V-07 | Yes / No values | Green filled pill with white "Yes", red filled pill with white "No"; same size and shape as the Billable pills beside them | S4-R1 "Yes" (green) / "No" (red) "in the same style as the Billable column" | COVERED DC-04, DC-15 |
| V-08 | Read-only cell | Only the pill; no switch, link or dropdown | S4-R1 read-only, S4-E1 | COVERED DC-02 |
| V-09 | Table width at 1440 | Table already scrolls sideways in production (First Name out of view in tt-p1-01); with the new column it is scrolled further (Last Name out of view, emails cut at the left) | PRD silent | LOOK-ONLY: DC-05 checks no overlap or cut-off of the header and notice at 1440 and 1536 |
| V-10 | Deactivated tab | Not drawn | S4-R1 "on the Active and Deactivated tabs" | COVERED DC-06 (PRD words; TT-N15) |
| V-11 | Sort | Not drawn (caption "sortable") | S4-R2 | behaviour case (PRD worker); NOT SHOWN |
| V-12 | Header "New" pill above Dashboard | Present in every picture except tt-p2-03 | another feature's pill (production) | OUT-OF-SCOPE (DATA difference between pictures) |
| V-13 | Notice in the list-error state | Not drawn | S4-R4 error line between toolbar and notice | NOT SHOWN (TT-N16); a manual tester cannot make the list fail (L-14): no manual case, listed for the developers' checks |
| V-14 | After the end date | Not drawn | S4-N2, S1-R2 viewer's clock | COVERED DC-32 |

## 2 · New Staff Member and Edit Staff Member (pages 2–3; tt-p2-01…07, tt-p3-01, tt-p3-02, tt-p4-01)

| # | Element | Design shows | PRD | Class / case |
|---|---|---|---|---|
| V-15 | Toggle row place (New) | Billable alone on its row; below it one row: Time Clock, Sales Representative, Technician; then the orange billing line and Save & Add Next / Save & Close (before: toggles beside Billable, tt-p2-01) | S1-R1 | COVERED DC-07 |
| V-16 | Toggle row place (Edit) | Location and Billable side by side; below them the toggle row; then TECHNICIAN HOURS, the orange line and Resend Invitation / Deactivate Account / Delete / Save & Close | S1-R1 "so New and Edit look the same" | COVERED DC-13 |
| V-17 | Toggle order | Time Clock, Sales Representative, Technician, left to right, one line | S1-R1 | COVERED DC-07, DC-13, DC-16 |
| V-18 | Toggle style | Same size and shape as the other two (pill track, round white knob) | S1-R1 "in the same style as the window's other toggles" | COVERED DC-07 |
| V-19 | "New" pill on the toggle | Top right of the word Technician, left edge touching its end; light blue fill, blue border, blue text (crops/after-new-staff-toggles.png) | S1-R2 | COVERED DC-07, DC-17 |
| V-20 | Pill looks like the switcher pill | Switcher pill above the Work Orders display switcher (crops/switcher-new-pill-techview.png): same fill, border, text, size | S1-R2 "looks the same as the pill on the Work Orders display switcher" | COVERED DC-03, DC-17 |
| V-21 | Off, not grayed | Grey track, white knob left, dark label (tt-p2-05) | S1-R4 (Time Clock on) | COVERED DC-13 |
| V-22 | Off and grayed | Lighter grey track than the other off toggles, white knob left, grey label (crops/after-new-staff-toggles.png, after-greyed-*) | S1-R4, S1-N1 "off and grayed out" | COVERED DC-08, DC-11 |
| V-23 | On | Blue track and knob at the right, same blue as Time Clock on, dark label (crops/after-new-staff-prefill-toggles.png, tt-p2-06) | S1-R3 | COVERED DC-09, DC-14 |
| V-24 | Tooltip (Time Clock) | Dark grey box, white regular text on one line, no arrow, opens below the toggle row centred under Technician, overlapping the orange billing line | S1-R4 text; position PRD silent | COVERED DC-10 (position LOOK-ONLY) |
| V-25 | Tooltip (role) | Same box, "This role can't be a technician.", below Technician | S1-N1 | COVERED DC-11, DC-12 |
| V-26 | Time Clock User role | Not drawn (caption only) | S1-N1 | COVERED DC-12 (TT-N03) |
| V-27 | No role and Time Clock off on open | Role empty, Time Clock off (as production, tt-p2-01) | S1-R3, S1-R4 | COVERED DC-08 |
| V-28 | Field positions | Every other field in its production place ("Nothing else moves.") | PRD silent | LOOK-ONLY, COVERED DC-07, DC-13 |
| V-29 | Width | Only 1440 drawn; row fits on one line with room to spare | PRD silent | COVERED DC-16 (1440 and 1536) |
| V-30 | Save buttons | Save & Add Next (outlined blue) and Save & Close (blue) in New; Save & Close in Edit | S1-R6 "the window's existing Save" | LOOK-ONLY (TT-D05 settled; TT-D06 question 4 for Save & Add Next) |
| V-31 | TECHNICIAN HOURS section | Still shown in Edit for a person with Technician off (tt-p2-05) | PRD silent | OUT-OF-SCOPE (production, before tt-p2-04); V2 invariant noted in NOTES |
| V-32 | Delete button for Emily Madden | Pale red (looks disabled) in tt-p4-01, red for Olivia | PRD silent | OUT-OF-SCOPE (production behaviour for a person with work) |
| V-33 | Time Clock back on in New | Caption only | S1-R5 | SPEC-CONFLICT TT-D01 → DV-01 (held), question 1 |

## 3 · Turn Off Technician warning (page 4; tt-p4-02)

| # | Element | Design shows | PRD | Class / case |
|---|---|---|---|---|
| V-34 | Window | Centred over the dimmed Edit Staff Member window, white body, rounded corners | S2-R2 "a warning window" | COVERED DC-18 |
| V-35 | Header | Yellow band, title "Turn Off Technician" large bold dark text, blue X at the right | S2-R2 title, S2-R4 "the X" | COVERED DC-18 (colours LOOK-ONLY) |
| V-36 | Text | Three lines at 1440 ("… on anything" / "new."), dark regular text | S2-R2 pattern | COVERED DC-18 |
| V-37 | Buttons | Bottom right: Cancel (grey fill, white text) then Save (blue fill, white text) | S2-R4 "Cancel and Save" | COVERED DC-18 |
| V-38 | Library modal spec | components.css MODAL: white title header 68 px with a hairline; the picture's warning uses a yellow header | not an always/never rule; the picture (this build, made the design by Chris) is the source of the look (Rule 126.5) | LOOK-ONLY |
| V-39 | Loading state, other text forms | Not drawn | S2-R3, S2-R4 | NOT SHOWN (TT-N04, TT-N05); text forms are behaviour cases (PRD worker) |

## 4 · Board View and Tech View (page 5; tt-p5-01…08)

| # | Element | Design shows | PRD | Class / case |
|---|---|---|---|---|
| V-40 | Board columns | Unassigned first, then one column per technician in name order; header: six-dot grip, round grey avatar with initials, name, pin icon, divider, clipboard icon and count; empty column with dashed box "Drag a work order here to assign it" | S3-R2 (who); look unchanged from production (tt-p5-01) | COVERED DC-19 |
| V-41 | Column removed | Parth Fadadu directly after Nikola Milosevic; no gap or placeholder | S3-N1 | COVERED DC-19 |
| V-42 | Inactive pill | Grey "Inactive" pill after a deactivated lead's name (column and group) | S3-R2 "plus everyone who leads work shown" | OUT-OF-SCOPE (production) |
| V-43 | Tech View groups | One row per technician: grip, chevron, avatar, name, pin, count; collapsed | S3-R2 | COVERED DC-20 |
| V-44 | Technician filter | Dropdown under the Technician button: search box with blue border, magnifier and clear icon; rows with checkboxes; divider; "Clear selection" | S3-R3 | COVERED DC-21 |
| V-45 | Filter no match | "No results", grey, centred where rows were; Clear selection stays | PRD silent on words | COVERED DC-21 (LOOK-ONLY words) |
| V-46 | Reassign window | Title "Reassign lead technician", grey subtitle "S2-15934 · Buda Truck Repair", blue X; search box (blue border); Unassigned row first (person icon); rows with avatar, name, "0 open"; Cancel (grey) and Reassign (blue) | S3-R4 (who) | COVERED DC-22 (rest unchanged production, tt-p5-07) |
| V-47 | Reassign no match | Unassigned row stays; centred grey "No technicians match “Oli”" with curly quotes (crops/no-tech-match-quotes.png) | S3-R4 | COVERED DC-22 |
| V-48 | Former lead entry | Not drawn | S3-R4 "Current · no longer assignable" | COVERED DC-31 (TT-N08) |
| V-49 | Switcher tooltip | "Board View" tooltip under the switcher covers part of its "New" pill while hovering | PRD silent | OUT-OF-SCOPE (production hover) |
| V-50 | Empty states | Not drawn | S3-R10 | COVERED DC-29, DC-30 (TT-N12); library rule SPEC-CONFLICT TT-D04, question 3 |
| V-51 | Pinned non-technician column | Not drawn | S3-E2 | NOT SHOWN (TT-N13); behaviour case (PRD worker) |

## 5 · Work order (page 6; tt-p6-01…04)

| # | Element | Design shows | PRD | Class / case |
|---|---|---|---|---|
| V-52 | Lead Technician dropdown | Opens below the field in the left card; one name per row, alphabetical; current lead first with a blue check and blue text, highlighted (before) | S3-R5 | COVERED DC-23 |
| V-53 | Non-technician left out | Parth Fadadu after Nikola Milosevic | S3-R5 | COVERED DC-23 |
| V-54 | Former lead grayed last with check | Caption only (after picture has no lead) | S3-R7 | COVERED DC-24 (TT-N07) |
| V-55 | Read-only Lead Technician | Label "Lead Technician", value "Unassigned", no border (left card behind the Edit Line window) | S3-R7a "Lead technician" … "as it does today" | COVERED DC-28 (TT-D07 settled) |
| V-56 | Add Technician (Edit Line) | List opens above the field, alphabetical, plain rows; field label "Add Technician" floating, blue border; Labor Rate, Estimated Time, Tech Time; Delete (red), Save & Close (blue) | S3-R6 | COVERED DC-25 |
| V-57 | Non-technician chip in Edit Line | Caption "shows grayed out"; not drawn | S3-R8 ordinary chip | SPEC-CONFLICT TT-D02 → DC-27 (PRD), DV-02 (held), question 2 |
| V-58 | Edit Labor list | Not drawn ("Add Labor uses the same list") | S3-R8 grayed, name order | COVERED DC-26; wording TT-D03 settled |
| V-59 | Part sales | Note only | S3-R6a | behaviour (PRD worker) |

## 6 · Design-library always / never / must sentences (Rule 126 point 4)

Every such sentence in `ds/shopview/*.css` and `tokens.json` (grep of always / never / must / should / only, all read):

| # | Sentence (file:line) | Relevant to this feature's screens? | Class |
|---|---|---|---|
| L-1 | "Spec: disabled-on and disabled-off are the same colour. Only the thumb moves." (components.css:225) | Yes: the grayed Technician toggle. PRD makes a grayed Technician always off (S1-R4, S1-N1), so disabled-on never occurs; the drawn disabled-off track is lighter than a normal off track, as the library's disabled colour | COVERED DC-08 (grayed = lighter track) |
| L-2 | "One rule for every empty state in the product: ONE icon from the set, a title, at most one sentence, and the action that fills it." (components.css:878) | Yes: S3-R10 "No technicians yet" has two sentences | SPEC-CONFLICT TT-D04, question 3; DC-29 |
| L-3 | "Count badges are parenthesised text, NOT chips." (components.css:279–281, tabs) | Staff list tabs "Active(94)" already follow it | OUT-OF-SCOPE (production tabs, unchanged) |
| L-4 | "Never hardcode a header height; change the token instead." (components.css:521) | No header change in this feature | OUT-OF-SCOPE |
| L-5 | "danger rows recolour the text only — no red hover background" (components.css:411) | No menu in this feature | OUT-OF-SCOPE |
| L-6 | "Extension, not on the spec card. Use only for delete / remove / reset." (components.css:77, danger button) | Edit Staff Member's Delete is production | OUT-OF-SCOPE |
| L-7 | "What's New and its articles only … Never in app screens" (components.css:711); "Product screens never use it" (colors_and_type.css:97–98); tokens.json "Never inside product screens." | No public page | OUT-OF-SCOPE |
| L-8 | "Never consumed by components directly"; "Dark greys, never pure black; off-whites, never pure white"; "Never reference primitives or hex from a component" (colors_and_type.css:158–169) | Token-layer rules for implementers; no dark theme drawn | OUT-OF-SCOPE (code rule, not visible) |
| L-9 | "the input must carry placeholder=\" \" … or it never floats"; "must come BEFORE the <label>"; "inner buttons must be fully transparent"; "right-align must be set on the th AND the td"; "radius only survives with overflow:hidden"; "must follow the tone rules"; "can never fight an artboard's own CSS"; "the ONLY source of tokens" (components.css) | CSS authoring rules, nothing a screen shows differently | OUT-OF-SCOPE (code rule) |
| L-10 | "violet — Deposit on invoices, so it never reads as Invoice (info) or Credit (warning)." (components.css:261) | Not on these screens | OUT-OF-SCOPE |

**Counts:** 69 rows (59 screen rows V-01 … V-59, 10 library rows L-1 … L-10), each counted once under its first class: COVERED by a
design case 45 · LOOK-ONLY 3 (V-09, V-30, V-38) · SPEC-CONFLICT 3 (V-33, V-57, L-2) · OUT-OF-SCOPE 13 (V-12, V-31, V-32, V-42, V-49,
L-3 … L-10) · NOT SHOWN and left to the PRD worker's behaviour cases 5 (V-11, V-13, V-39, V-51, V-59; V-13 has no manual case, L-14).
Unclassified: 0. Questions behind these rows: 4 drafted in `NEW-QUESTIONS.py` (TT-D01, TT-D02, TT-D04, TT-D06), not sent: the QA lead
sends them, so the unsent count is 4 until he does (Rule 126 point 6).
