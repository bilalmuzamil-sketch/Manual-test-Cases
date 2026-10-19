#!/usr/bin/env python3
"""Build the consolidated PO question set for Splitting Sales Representatives (19 Oct 2026).
Writes questions.json, QUESTIONS-FOR-CHRIS-WARD-2026-10-19.md, QUESTION-MERGE-2026-10-19.md and sheet batches."""
import json, re, os, sys

OUT = '/home/user/Manual-test-Cases/build/splitting-sales-reps/po-questions'
SCR = os.path.dirname(os.path.abspath(__file__))
P = 'Splitting Sales Representatives: '
SUG = 'Suggested, as the newest document (the feature spec, version 8 of 14 Oct) says: '

ROWS = [
# ---------------- Work order card ----------------
dict(area='Work order card', covers=['TP-Q2'],
 topic=P+'work order card, height of the box around the Sales Representative field',
 q='When the mouse is over the Sales Representative field on the work order card, a box appears around it. How tall should the box be?\n'
   '(a) '+SUG+'exactly the height of the Lead Technician and Service Advisor boxes (the developers measure 42 px today). The 44 px in the Jira story is out of date.\n'
   '(b) 44 px, as the Jira story says.',
 know='Feature spec: the box sits "at the same height as those two fields and the same left edge". The Jira story still says "at the same 44px height". The tech plan builds to the existing 42 px.',
 where='PRD v8 (14 Oct 2026) S1-R4; Jira SV-11265 (Story 1); tech plan §0'),
dict(area='Work order card', covers=['DES-Q5', 'DES-C5'],
 topic=P+'work order card, space between the field and the + and remove x buttons',
 q='On the work order card, how much space should there be between the field\'s box and the column that holds the + and remove x buttons?\n'
   '(a) 16 px, as the feature spec says.\n'
   '(b) The spacing the design shows (about 22 px on the card; exactly 16 px in the customer window).',
 know='Feature spec: "The box ends 16px before the 32px column that holds the + and remove x buttons." Measured on the design pictures: about 22 px from the box border on the card, and exactly 16 px for the same gap in the customer window.',
 where='PRD v8 S1-R5; design boards 1.6, 1.7, 1.10, 1.13 (measured 19 Oct 2026, 1 px tolerance)'),
dict(area='Work order card', covers=['TP-Q12'],
 topic=P+'work order card, today\'s gap under Lead Technician (low priority)',
 q='The feature spec\'s background note says today\'s gap under Lead Technician measures 36 px. The developers measure 16 px on today\'s screens. The expected result after the change is 16 px either way.\n'
   '(a) Drop the background note.\n'
   '(b) Keep it, and please tell us on which screen you saw 36 px, so the tester can look there.',
 know='Feature spec note: "the gap to Service Advisor measured 36px while the others measured 16px". The tech plan records your reply that this is "a must-fix in this build" and "Today the gap under Lead Technician is wrong."',
 where='PRD v8 S1-R6 background note; tech plan §0'),
dict(area='Work order card', covers=['BL-Q10'],
 topic=P+'work order card, where Lead Technician\'s messages show',
 q='Every gap on the card becomes 16 px, which removes the 20 px strip Lead Technician kept for its messages. Where do Lead Technician\'s messages show now?\n'
   '(a) Below the field, pushing the fields under it down while the message shows.\n'
   '(b) Somewhere else (please describe).\n'
   '(c) Lead Technician no longer shows messages there.',
 know='Feature spec: before this change "Lead Technician reserved a 20px strip for messages under itself". It does not say where the messages go once the strip is gone.',
 where='PRD v8 S1-R6 and its background note'),
dict(area='Work order card', covers=['TP-Q5'],
 topic=P+'work order card and Audit Log, a person who no longer exists or belongs to another organization',
 q='If the person saved in a Sales Representative field no longer exists in the shop (or belongs to another organization), what should show?\n'
   'On the work order card:\n'
   '(a) "Unassigned".\n'
   '(b) "(Inactive)" with no name.\n'
   '(c) Nothing (an empty field).\n'
   'In the work order\'s Audit Log:\n'
   '(d) "Unassigned".\n'
   '(e) "Unknown".',
 know='The feature spec covers only the printout: "A side whose staff member no longer exists prints as Unassigned. A row never reads a bare "(Inactive)"." The tech plan has the card show "(Inactive)" with no name in one place and an empty field in another, and the log show "Unknown".',
 where='PRD v8 S1-E2, S6-N1, S7-R3; tech plan decision D4 and risk R-8'),
dict(area='Work order card', covers=['TP-Q8'],
 topic=P+'work order card, two people editing the same work order',
 q='Two people (or two browser tabs) have the same work order open. Tab A adds the Parts field. Tab B still shows one field and picks a person. What should happen?\n'
   '(a) Tab B\'s choice wins and the Parts field disappears (what the tech plan builds).\n'
   '(b) Tab B\'s choice changes only the Labor side, and the Parts field stays.\n'
   '(c) Tab B is told to reload the work order.',
 know='Feature spec: "A side is never refilled on its own." The tech plan says this holds for every user, "including a stale tab", and that the screen always says whether the work order is split when it saves.',
 where='PRD v8 S2-N1; tech plan §0.1'),
dict(area='Work order card', covers=['TP-Q6'],
 topic=P+'part sale card, does its Sales Representative field change at all',
 q='The tech plan rebuilds the Sales Representative field on the part sale card with the new work order field, and changes its label from "Sales representative" to "Sales Representative". Is that acceptable?\n'
   '(a) Yes: the label\'s capital letter and the hover look may change, as long as there is no + or remove x.\n'
   '(b) No: nothing about it may change; keep the label and the look exactly as Part Sales Update v1 built them.',
 know='Feature spec: "Visually nothing changes there: the part sale card keeps the field exactly as Part Sales Update v1 builds it, with no + button, no remove x and no change to how it looks." Tech plan: label "Sales representative" becomes "Sales Representative".',
 where='PRD v8 S2-N2 and its background note; tech plan decision D18; Part Sales Update v1 (SV-10266)'),
dict(area='Work order card', covers=['DES-Q11'],
 topic=P+'invoiced work order card, small and capital letters in the labels',
 q='On an invoiced (read-only) work order card, the design shows "Lead technician" and "Service advisor" (small letters) next to "Sales Representative - Labor" (capitals). Should the read-only labels:\n'
   '(a) stay as they are today, with small letters for Lead technician and Service advisor;\n'
   '(b) all use capitals, as on the editable card?',
 know='The feature spec asks for the "same label and wording" on the read-only card, but only for the Sales Representative fields. The tech plan leaves Lead technician and Service advisor as they are.',
 where='PRD v8 S2-R17; design board 1.17; tech plan (label case)'),
# ---------------- Phone ----------------
dict(area='Phone', covers=['TP-Q3'],
 topic=P+'phone, how the hidden fields on the work order card are opened',
 q='On a phone, how does the user open the hidden fields on the work order card?\n'
   '(a) '+SUG+'with the card\'s existing edit button, unchanged. The "Show Details" in the Jira story is out of date.\n'
   '(b) With a control named "Show Details", as the Jira story says.',
 know='Feature spec: "They show after the card is expanded with its edit button, as Lead Technician and Service Advisor do today. The expand control itself does not change." Jira story: "They show after Show Details".',
 where='PRD v8 S3-R6; Jira SV-11267 (Story 3)'),
dict(area='Phone', covers=['TP-Q11'],
 topic=P+'large touch tablet, how the work order card behaves',
 q='On a wide touch screen with no mouse (for example a large tablet), how should the work order card behave?\n'
   '(a) Open expanded, with the + and remove x always shown (what the tech plan builds: touch decides the buttons, screen width decides whether the card is collapsed).\n'
   '(b) Open collapsed, like a phone.',
 know='Feature spec: "The user is on a phone or tablet: a touch screen with no mouse pointer." The tech plan always shows the buttons on a touch screen, but collapses the card only on a narrow screen.',
 where='PRD v8 S3-R2, S3-R4, S3-R6; tech plan §0 and §6'),
dict(area='Phone', covers=['DES-Q4', 'DES-C3'],
 topic=P+'phone, dropdown arrow on the Sales Representative fields',
 q='On a phone, before the user taps, should the Sales Representative fields:\n'
   '(a) always show their dropdown arrow, as the feature spec says;\n'
   '(b) look like plain text until tapped, as the design shows?',
 know='Feature spec: "On a touch screen the Sales Representative fields always show their dropdown arrow, as the + and remove x buttons always do." The design shows no box and no arrow; its note says "At rest the rows read as plain text."',
 where='PRD v8 S3-R4; design page 6, boards 6.2 and 6.6'),
# ---------------- Customer ----------------
dict(area='Customer', covers=['BL-Q1', 'SBR-DIV S13-R4', 'SBR-DIV S13-R10', 'SBR-DIV S13-R11', 'SBR-DIV S13-E1', 'SBR-DIV S13-E3', 'SBR-DIV S15-R2', 'SBR-DIV S15-R6'],
 topic=P+'customer, deactivating a staff member who is a customer\'s sales representative',
 q='When a staff member\'s account is deactivated, what happens to the customers they are the sales representative for?\n'
   '(a) '+SUG+'they are removed from every customer field they hold; the customer\'s other fields keep their people; reactivating does not put them back. The warning line "Their customer assignments will stay where they are." must then change: please give the new wording.\n'
   '(b) Keep today\'s rule: they stay on their customers, the warning stays as it is, and the feature spec\'s rule is dropped.\n'
   '(c) Remove them, but put them back if the person is reactivated.',
 know='Feature spec: "Deactivating a staff member\'s account removes them from every customer field they hold." The Sales By Representative spec (12 Oct; this part unchanged since August) still says assignments "are not modified by deactivation", the warning says "Their customer assignments will stay where they are.", reactivating brings them back, and the Assignments export lists deactivated people with "Rep is active?" = "No". Today the product keeps them (checked on 4 Aug 2026).',
 where='PRD v8 S4-R20; Sales By Representative spec v28 (12 Oct 2026) S13-R4, S13-R10, S13-R11, S13-E1, S13-E3, S15-R2, S15-R6'),
dict(area='Customer', covers=['BL-Q2'],
 topic=P+'customer, which warning shows the new customer count',
 q='The warning shown before deactivating a sales representative will count every customer where they hold any field, each customer once. Today there are two warnings: "Turn Off Sales Representative" (when the switch is turned off) and the "Deactivate" window where you type YES (when the account is deactivated). Which one gets the new count?\n'
   '(a) Only the "Deactivate" window; the "Turn Off Sales Representative" warning stays as it is.\n'
   '(b) Both.\n'
   '(c) Only the "Turn Off Sales Representative" warning.',
 know='Feature spec: "The warning shown before deactivating a sales representative counts every customer where they are in the first field, Service Parts or Part Sales, and counts each customer once." The Sales By Representative spec describes only the "Deactivate" window, and shows no count when the person\'s switch is already off. Neither spec describes the "Turn Off Sales Representative" warning.',
 where='PRD v8 S4-R21; Sales By Representative spec v28 S13-R1, S13-N2'),
dict(area='Customer', covers=['TP-Q7'],
 topic=P+'customer, how a person whose Sales Representative switch is off reads',
 q='A person whose Sales Representative switch is off (account still active) stays in the customer fields they hold. In Edit Customer and on the customer page, how should their name read?\n'
   '(a) The plain name (what the tech plan builds).\n'
   '(b) "Name (Inactive)", as on a work order.\n'
   'Also: in the open dropdown no option is ticked while they hold the field. Is that right? (yes / no)',
 know='Feature spec: turning the switch off "leaves them in the customer fields they hold, as today." The spec\'s "(Inactive)" wording is given for the work order field. Tech plan: no "(Inactive)" on customer fields. The Sales By Representative spec gives the customer page labels but says nothing about "(Inactive)".',
 where='PRD v8 S4-N2, S4-R19, feedback table; tech plan decision D17; Sales By Representative spec v28 S19-R7'),
dict(area='Customer', covers=['DES-Q3', 'DES-C2'],
 topic=P+'customer, order of the names in the Sales Representative list',
 q='In Edit Customer, in what order should the names in the Sales Representative list appear?\n'
   '(a) "Unassigned" first, then A to Z by first name, then last name, as on the work order (the feature spec).\n'
   '(b) The order the design shows (Dylan Rush, Christian Wallace, Jason Garrison).',
 know='Feature spec: the list starts with "Unassigned", then every active sales representative "sorted by first name, then last name, A to Z, as on the work order". The design\'s note says the customer window\'s sample data shows login names rather than staff names, so the picture may simply be sorted by another name.',
 where='PRD v8 S4-R3, S1-R8; design boards 2.4, 2.11'),
dict(area='Customer', covers=['TP-Q15'],
 topic=P+'customer, New Customer opened from a part sale by a user who can only make part sales',
 q='A user who can only make part sales opens the New Customer window from a part sale. What should the Sales Representative field do?\n'
   '(a) Show and list the sales representatives, as when opened from a work order.\n'
   '(b) Show "Unassigned" only.\n'
   '(c) Be hidden.\n'
   '(d) Whatever happens today for that user.',
 know='The feature spec names only the work order window: the user needs \'Customers — Create & Edit\', or \'Work Orders — Create & Edit\' when the window is opened from the work order window. The tech plan says the window also opens from a part sale, and does not give a part-sales-only user permission to load the list of representatives.',
 where='PRD v8 Story 4 prerequisites; tech plan §9'),
dict(area='Customer', covers=['BL-Q7', 'SBR-DIV S15-R1', 'SBR-DIV S15-R4'],
 topic=P+'Sales Representative Assignments export, its name and column headings',
 q='The Sales Representative Assignments export gets a new column, Side. What should the export and its columns be called?\n'
   '(a) '+SUG+'the export is "Sales Representative Assignments" and Side comes after a column headed "Representative is active?". Please also confirm the file name (for example sales-representative-assignments.csv).\n'
   '(b) Keep today\'s names, as the Sales By Representative spec (12 Oct) says: "Sales Rep Assignments", file sales-rep-assignments.csv, columns Customer Name, Sales Rep, Rep is active?, Side.\n'
   '(c) Other (please give the names).',
 know='Today the export is "Sales Rep Assignments" and the column is "Rep is active?" (your ruling of 31 Jul 2026 and the export of 4 Aug 2026). The feature spec calls it "The Sales Representative Assignments export", with Side after "Representative is active?". The Sales By Representative spec of 12 Oct keeps every old name and adds Side at the end.',
 where='PRD v8 S4-R23; Sales By Representative spec v28 S15-R1, S15-R3, S15-R4'),
dict(area='Customer', covers=['SBR-DIV S15-R5'],
 topic=P+'Sales Representative Assignments export, how a Part Sales person is listed',
 q='In the Sales Representative Assignments export, how is the person in an added Part Sales field listed?\n'
   '(a) '+SUG+'"Part Sales" is listed for that person whether or not the customer is split; a person in several fields gets one row, for example "Parts and Service, Part Sales".\n'
   '(b) As the Sales By Representative spec (12 Oct) says: a customer that is not split always gives one row reading "Parts and Service", and "Part Sales" is listed only on a split customer, and only when a person (not "Unassigned") was picked for it.',
 know='Feature spec: ""Part Sales" is listed for the person in an added Part Sales field, split or not." Sales By Representative spec: "A customer that is not split produces one row with Side = "Parts and Service"" and ""Part Sales" is listed only when the person was picked for it".',
 where='PRD v8 S4-R23; Sales By Representative spec v28 S15-R5'),
# ---------------- Release day ----------------
dict(area='Release day', covers=['TP-Q4'],
 topic=P+'release day, about 10 customers whose representative is no longer a user',
 q='About 10 customers today have a sales representative who is no longer a user of the shop. The tech plan turns them into "Unassigned" on release day, and you accepted this as information. Should the feature spec say so?\n'
   '(a) Yes: add the exception ("...except about 10 customers whose representative is no longer a user, which read Unassigned").\n'
   '(b) No: keep the spec as written; every customer keeps its representative, and the release must keep it too.',
 know='Feature spec: "On release day every existing customer has the one "Sales Representative" field, with no Service Parts or Part Sales field, and keeps its one representative". Tech plan: those 10 customers are turned into "Unassigned" when the release runs, marked "Accepted by Product".',
 where='PRD v8 S4-E1 and Release day; tech plan §0'),
dict(area='Release day', covers=['SBR-DIV S20-R6a'],
 topic=P+'release day, saved column choices on Sales By Representative',
 q='On release day, what happens to each user\'s saved column choices and sort on Sales By Representative?\n'
   '(a) '+SUG+'all saved column choices and the sort reset once to the defaults (so Sales Type starts off).\n'
   '(b) As the Sales By Representative spec (12 Oct) says: only the new Sales Type column starts off; every other saved column choice and the sort are kept.',
 know='Feature spec, Release day: "Each user\'s saved column choices and sort on Sales By Representative reset once to the defaults." Sales By Representative spec: "Sales Type is off by default for every user, including users who saved their column choices before the release that adds it." Both agree that a user who turns Sales Type on keeps it on.',
 where='PRD v8 Release day, S5-R22; Sales By Representative spec v28 S20-R6a'),
# ---------------- Sales By Representative credit ----------------
dict(area='Sales By Representative credit', covers=['TP-Q1'],
 topic=P+'Sales By Representative, who gets the odd cent when a discount is shared',
 q='When a whole-invoice discount does not split evenly between the Labor and Parts rows, who gets the odd cent? Example: labor $100.00, parts $200.00, discount ($1.00); the exact parts share is ($0.666...).\n'
   '(a) Parts is rounded to the nearest cent, ($0.67), and Labor gets the rest, ($0.33); Labor gets an extra cent only on an exact half cent (what the tech plan builds).\n'
   '(b) Parts is rounded down to ($0.66) and the left-over cent goes to Labor, ($0.34).\n'
   '(c) Another rule (please describe).',
 know='Feature spec: "A cent left over by rounding the share goes to the Labor row." The tech plan rounds to the nearest cent and keeps only a tie cent with Labor. The Sales By Representative spec rounds displayed values half up, but that is about display, not about sharing. Both worked examples in the feature spec add up.',
 where='PRD v8 S5-R6, S5-R7; tech plan §8.2; Sales By Representative spec v28 §3 (rounding)'),
dict(area='Sales By Representative credit', covers=['BL-Q5', 'SBR-DIV S5-R11'],
 topic=P+'Sales By Representative, which column shows each row\'s share of a fee or discount',
 q='On a split invoice, whole-invoice fees and discounts are shared between the Labor row and the Parts row. In which column does each row show its share?\n'
   '(a) '+SUG+'in each row\'s Adjustments column, showing only that row\'s share (the feature spec\'s example points this way).\n'
   '(b) Another column (please name it).\n'
   'The Sales By Representative spec still defines Adjustments as the whole invoice\'s fees and discounts, which read literally would show the full amount on both rows. Should that definition change to the share? (yes / no)',
 know='Feature spec example: labor $600.00, parts $400.00, shop supplies $30.00, discount ($50.00): "The Labor row gets $30.00 supplies and ($30.00); the Parts row gets ($20.00)." Sales By Representative spec (unchanged since August): Adjustments is "the signed net of invoice-level fees and discounts across the row\'s invoices" and "an invoice-level amount is never allocated into the Labor or Parts columns".',
 where='PRD v8 S5-R6; Sales By Representative spec v28 S5-R11 and §3 Adjustments'),
dict(area='Sales By Representative credit', covers=['TP-Q9'],
 topic=P+'Sales By Representative, a fee on an invoice with no labor and no parts',
 q='An invoice has a whole-invoice fee but no labor and no parts dollars. The feature spec says "If the labor side is empty and the parts side is not, it goes to the parts representative." What does "the labor side is empty" mean?\n'
   '(a) The labor side has no sales representative (what the tech plan builds).\n'
   '(b) Something else (please describe).',
 know='Feature spec: "A whole-invoice amount on an invoice with no labor and no parts dollars goes to the labor representative. If the labor side is empty and the parts side is not, it goes to the parts representative. If both are empty, it is Unassigned." The Sales By Representative spec does not repeat this rule.',
 where='PRD v8 S5-R8; tech plan §8.2'),
# ---------------- Sales By Representative screen and exports ----------------
dict(area='Sales By Representative screen and exports', covers=['DES-Q1', 'DES-C1', 'SBR-DIV S9-N1'],
 topic=P+'Sales By Representative, what the Parts row shows in the labor columns',
 q='When a work order\'s labor and parts belong to two different people, the report shows a Labor row and a Parts row. On the Parts row, what should Labor Delta, the hours and Shop Supplies show?\n'
   '(a) '+SUG+'a dash on screen and in the PDF, and an empty cell in the CSV.\n'
   '(b) Zero, as the Sales By Representative spec and the design show: Labor Delta 0.0 and Shop Supplies $0.00 (0.00 in the CSV).',
 know='Feature spec: "on a Parts row the labor, hours and Shop Supplies columns show a dash, not $0.00", and in the Expanded downloads those cells "are blank in the CSV and show a dash in the PDF". Sales By Representative spec (unchanged since August): an invoice with no labor shows Labor Delta 0.0, "never blank, "N/A," or "—"". The design shows $0.00 for Devon\'s Parts row on screen, in the CSV and in the PDF, while its own PDF note says "An empty side shows a dash." The 0.0 rule would still apply to an invoice with one person on both sides.',
 where='PRD v8 S5-R15, S5-R23; Sales By Representative spec v28 S9-N1; design boards 4.5, 4.10, 4.11, 4.12'),
dict(area='Sales By Representative screen and exports', covers=['DES-Q2', 'DES-C4'],
 topic=P+'Sales By Representative, Shop Supplies on a part sale that has none',
 q='A part sale with no shop supplies appears on a Part Sales row. What should its Shop Supplies column show?\n'
   '(a) A dash.\n'
   '(b) $0.00, because $0.00 is its real amount.',
 know='Feature spec: "On a Part Sales row, Shop Supplies shows the part sale\'s shop supplies, or a dash when it has none." and "$0.00 is shown only for a real zero." The two sentences can be read either way. The design shows $0.00 (0.00 in the CSV) for three part sales.',
 where='PRD v8 S5-R15a, S5-R15; design boards 4.5, 4.10, 4.11, 4.12 (P1-9006, P1-4, P1-9005)'),
dict(area='Sales By Representative screen and exports', covers=['BL-Q4', 'SBR-DIV S18-R13'],
 topic=P+'Sales By Representative, order of the Sales Type and Location columns',
 q='When both the Sales Type column and the Location column are shown, in what order do they come, on screen and in the Expanded downloads?\n'
   '(a) Status, Sales Type, Location.\n'
   '(b) Status, Location, Sales Type.',
 know='Feature spec: Sales Type comes "after Status". The Sales By Representative spec (12 Oct) lists Sales Type right after Status, but its Location rule (unchanged since August) also puts Location "immediately after the Status column" and "at the end of the leading identifier group". The downloads follow the same Location rule.',
 where='PRD v8 S5-R19, S5-R23; Sales By Representative spec v28 S5-R2, S18-R13, S14-R20'),
dict(area='Sales By Representative screen and exports', covers=['SBR-DIV S3-R10', 'SBR-DIV S14-E3', 'SBC-DIV S3-R7', 'SBC-DIV S15-R10', 'SBC-DIV S18-R10'],
 topic=P+'Sales By Representative and Sales By Customer, Export with no Sales Type ticked',
 q='If the user unticks every Sales Type option and clicks Export, what should happen?\n'
   '(a) '+SUG+'on both reports, Export shows "Empty export" and no file is made.\n'
   '(b) A file is made anyway, with the filter line "Sales Type: None" (Sales By Representative) or "Sales Type: No sales" (Sales By Customer), as the two report specs say.\n'
   '(c) Different for each report (please say which).\n'
   'Other empty results (for example a date range with no invoices, or no customer selected) still download a file with headings and no rows, as the report specs say. Please tell us if that should change too.',
 know='Feature spec: "With no option selected there is nothing to export: Export shows "Empty export" and makes no file." (Sales By Representative), and the same for Sales By Customer. Sales By Representative spec (12 Oct): the filter line can read "Sales Type: None", and an empty export "still generates". Sales By Customer spec (6 Oct): the filter line can read "Sales Type: No sales", and an export matching no customers "still downloads".',
 where='PRD v8 S8-R4, S8-R9; Sales By Representative spec v28 S3-R10, S14-E3; Sales By Customer spec v21 (6 Oct 2026) S3-R7, S15-R10, S18-R10'),
# ---------------- Sales By Customer ----------------
dict(area='Sales By Customer', covers=['DES-Q6'],
 topic=P+'Sales By Customer, the names of the two filter options',
 q='The design\'s pictures of today\'s Sales By Customer show the options as "Parts" and "Services", while the design\'s notes say they already read "Part Sales" and "Service Sales". Is renaming the options part of this change?\n'
   '(a) Yes: both options are renamed to "Part Sales" and "Service Sales", and a saved choice keeps its options under the new names.\n'
   '(b) No: today\'s options already read "Part Sales" and "Service Sales"; only the filter\'s title changes from "Product Type" to "Sales Type".',
 know='Feature spec: "Its two options read "Part Sales" and "Service Sales"." and a choice remembered from before the release "opens with the same options selected, under the new names." Both point to (a). The design\'s notes for today\'s screens say the options already read "Part Sales" / "Service Sales", which the pictures do not show.',
 where='PRD v8 S8-R6, S8-R7, S8-E1; Sales By Customer spec v21 S3-R2; design boards 4.1, 5.0, 5.2'),
dict(area='Sales By Customer', covers=['BL-Q9'],
 topic=P+'Sales By Customer, what "remembered from before the release" means',
 q='The feature spec says "A Sales By Customer filter choice remembered from before the release opens with the same options selected, under the new names." Since 16 Sep 2026 report filters are kept only in the page link, not saved. What does "remembered" mean here?\n'
   '(a) A saved or bookmarked link with the old Product Type choice opens with the same options ticked, under the new names.\n'
   '(b) A setting saved in the browser (the Sales By Customer spec still describes one).\n'
   '(c) Both.',
 know='Since the change of 16 Sep 2026 report filters live in the page link. The Sales By Customer spec (6 Oct) still says the report "saves the user\'s view to the browser" and that the Sales Type selection "is remembered between visits".',
 where='PRD v8 S8-E1; Sales By Customer spec v21 S6-R1, S3-R8, S9-R3; Jira SV-9984 (16 Sep 2026)'),
# ---------------- Print ----------------
dict(area='Print', covers=['LANE-B'],
 topic=P+'printed work order, a staff member who no longer exists',
 q='The feature spec says "A side whose staff member no longer exists prints as Unassigned." As far as we know, staff cannot be deleted from the screens, only deactivated. Can a staff record stop existing?\n'
   '(a) Yes, it can happen: please tell us how, so a tester can set it up.\n'
   '(b) It only happens through a data repair, so the developers check it, not a manual tester.',
 know='Feature spec: "A side whose staff member no longer exists prints as Unassigned. A row never reads a bare "(Inactive)"." The Sales By Representative spec also mentions a staff record that "has been deleted", without saying how that happens.',
 where='PRD v8 S6-N1 (Story 6); Sales By Representative spec v28 S5-R9, S15-R6'),
# ---------------- Log ----------------
dict(area='Log', covers=['LANE-A'],
 topic=P+'Audit Log, adding the Parts field when both sides keep the same person',
 q='A work order has Ann Able as its sales representative. The user adds the Parts field and both sides keep Ann Able. Does the Audit Log get a "Sales representative changed" entry?\n'
   '(a) Yes, one entry, reading for example "Sales Representative: Ann Able → Ann Able (Parts) · Ann Able (Labor)".\n'
   '(b) No entry, because nobody\'s credit changed.',
 know='Feature spec: "Each change to a work order\'s representatives, including adding or removing the Parts field, writes one log entry" and "A change that leaves the representatives as they were writes no entry." Both sentences can apply here.',
 where='PRD v8 S7-R1, S7-R3, S7-R4 (Story 7)'),
dict(area='Log', covers=['TP-Q14'],
 topic=P+'Audit Log, who can open it',
 q='Who can open the work order\'s Audit Log?\n'
   '(a) '+SUG+'as today, users with \'Work Orders — View\' or \'View History Logs\'.\n'
   '(b) Only users with \'Work Orders — Create & Edit\', as the Jira story says.',
 know='Feature spec: "for users with history access (\'Work Orders — View\' or \'View History Logs\'), as today. Nothing here changes who can open it." Jira story: "The user needs the \'Work Orders — Create & Edit\' permission. The log opens from Audit Log in the work order\'s menu, which shows only to those users."',
 where='PRD v8 Story 7 prerequisites; Jira SV-11271 (Story 7)'),
# ---------------- Design only ----------------
dict(area='Design only', covers=['DES-Q7'],
 topic=P+'design, invoice dates differ between the screen and the downloads',
 q='In the design, the same invoices show Sep 28 2026 on the Sales By Representative screen and Sep 29 2026 in the CSV and the PDF. Is this:\n'
   '(a) expected (for example the download uses another time zone; please say which);\n'
   '(b) a mistake in the design\'s sample data, and the dates must match?',
 know='The feature spec does not cover this.',
 where='Design board 4.10 against boards 4.11 and 4.12'),
dict(area='Design only', covers=['DES-Q8'],
 topic=P+'design, the numbered decisions its notes refer to',
 q='The design\'s notes refer to numbered decisions (34, 37, 38, 40, 47, 48, 65, 66, 67, 69, 70, 71). Can we have that list?\n'
   '(a) Yes (please link it).\n'
   '(b) No; the feature spec (version 8) is the full record.',
 know='None of these numbers appears in the feature spec or the tech plan.',
 where='Design canvas notes, pages 1 to 6'),
dict(area='Design only', covers=['DES-Q9'],
 topic=P+'design, screens the feature spec describes but the design does not show',
 q='The design has no picture for these parts of the feature spec: the printed work order, a name with "(Inactive)", the message after a failed save, the collapsed card on a phone, the customer window on a phone, "Sales Type: None" and "Empty export", and the Sales By Customer downloads. Should we:\n'
   '(a) wait for design pictures (please say when);\n'
   '(b) test these from the feature spec\'s wording alone?',
 know='The feature spec\'s printout story points to design page 1, which has no printout.',
 where='Whole design canvas (6 pages, 68 boards); PRD v8 Story 6, S1-E2, S1-N3, S3-R5, S3-R6, S8-R3 to S8-R5, S8-R8, S8-R9'),
dict(area='Design only', covers=['DES-Q10'],
 topic=P+'design, the column picker tooltip hides the Sales Type switch',
 q='In the design, when the column picker opens on Sales By Representative, the "Column Selection" tooltip covers the Sales Type switch, so its "off" state cannot be seen. Is that:\n'
   '(a) to be fixed: the tooltip should close when the panel opens;\n'
   '(b) acceptable as shown (today\'s report does the same)?',
 know='Feature spec: the Sales Type column is off by default. The design\'s picture of today\'s report shows the same overlap.',
 where='PRD v8 S5-R21; design boards 4.2, 4.8'),
# ---------------- Documents out of date ----------------
dict(area='Documents out of date', covers=['TP-Q13'],
 topic=P+'Jira stories older than the feature spec',
 q='Eight requirement texts in the Jira stories are older than the feature spec (version 8). Two say something different (the 44 px box height and "Show Details", questions 1 and 9); six leave out sentences the feature spec added. Which wins?\n'
   '(a) Suggested: the feature spec (version 8, 14 Oct) wins; please refresh the stories.\n'
   '(b) The Jira stories win for some of them (please say which).',
 know='The six texts that leave out sentences: the arrow moving to the bottom-right corner when the field is split; the arrow always showing on a touch screen, with Lead Technician and Service Advisor keeping today\'s tap to show; the customer page rows and address rule; the report showing the current name, and the name captured on the invoice only when the staff record is gone; a side with no dollars still giving its representative a $0.00 row; and invoices before 29 Jul 2026 staying Unassigned. The other 130 of the 138 texts are identical.',
 where='PRD v8 S1-R4, S1-R11, S3-R4, S3-R6, S4-R19, S5-R2, S5-N1, S5-E2; Jira SV-11265, SV-11267, SV-11268, SV-11269 (compared 19 Oct 2026)'),
dict(area='Documents out of date', covers=['SBR-DIV line 36', 'SBR-DIV S19-R3', 'SBR-DIV S15-R9'],
 topic=P+'sentences in the Sales By Representative spec that were not updated',
 q='The Sales By Representative spec (12 Oct) still has three sentences from before this feature that disagree with the feature spec (14 Oct):\n'
   '1. "Each invoice appears under exactly one rep" (a split invoice now appears under both people).\n'
   '2. "A new Work Order or Part Sale WO opens with the Sales Rep field unassigned" (a new work order or part sale now starts with the customer\'s representatives).\n'
   '3. In the Assignments export, name changes never add rows, "still one row per customer" (the export now has one row per customer per person).\n'
   '(a) Suggested: the feature spec wins on all three; please update the Sales By Representative spec.\n'
   '(b) The report spec is right for some of them (please say which).',
 know='Feature spec: "Two different people on one work order are always two rows."; "A new work order for a customer that is not split starts with the customer\'s representative in its one Sales Representative field."; the Assignments export "lists one row per customer per person". The report spec\'s own updated rules already agree on 1 and 3: a split invoice "appears under both", and the export has "one row per customer per assigned person".',
 where='Sales By Representative spec v28 key decisions (line 36), S19-R3, S15-R9 (all unchanged since v24); PRD v8 S5-R11, S4-R23, S4-R24 to S4-R26; Sales By Representative spec v28 S6-R7, S15-R4'),
]

ALL_SOURCES = (['TP-Q%d' % i for i in range(1, 16)] + ['BL-Q%d' % i for i in range(1, 11)] +
  ['SBR-DIV ' + x for x in ['line 36', 'S3-R10', 'S5-R11', 'S9-N1', 'S13-R4', 'S13-R10', 'S13-R11', 'S13-E1', 'S13-E3', 'S14-E3',
                            'S15-R1', 'S15-R2', 'S15-R4', 'S15-R5', 'S15-R6', 'S15-R9', 'S18-R13', 'S19-R3', 'S20-R6a']] +
  ['SBC-DIV ' + x for x in ['S3-R7', 'S15-R10', 'S18-R10']] +
  ['DES-Q%d' % i for i in range(1, 12)] + ['DES-C%d' % i for i in range(1, 6)] + ['LANE-A', 'LANE-B'])
DROPPED = ['BL-Q3', 'BL-Q6', 'BL-Q8', 'TP-Q10']
AREAS = ['Work order card', 'Phone', 'Customer', 'Release day', 'Sales By Representative credit',
         'Sales By Representative screen and exports', 'Sales By Customer', 'Print', 'Log', 'Design only', 'Documents out of date']

BANNED = [(re.compile(r'\bC\d+\b'), 'case-id-shaped'), (re.compile(r'\bS\d+-[RNE]\d+\b'), 'spec anchor'),
          (re.compile(r'/api/|\bHTTP\b|\bJSON\b|\bAPI\b'), 'API/HTTP term'),
          (re.compile(r'\b[a-z]+[A-Z][A-Za-z]*\b'), 'camelCase'), (re.compile(r'\bcustom_[a-z]+\b'), 'db field'),
          (re.compile(r'\bVIU\b|\bPRD\b|\bDIVERGE\b|\bCONFIRM\b|\bRule \d'), 'internal label')]

def main():
    errs = []
    covered = [c for r in ROWS for c in r['covers']]
    dup = sorted({c for c in covered if covered.count(c) > 1})
    missing = sorted(set(ALL_SOURCES) - set(covered) - set(DROPPED))
    extra = sorted(set(covered) - set(ALL_SOURCES))
    if dup or missing or extra or set(DROPPED) & set(covered):
        errs.append(f'coverage dup={dup} missing={missing} extra={extra}')
    # area order
    idx = [AREAS.index(r['area']) for r in ROWS]
    if idx != sorted(idx): errs.append('area order wrong')
    for n, r in enumerate(ROWS, 1):
        for col in ('topic', 'q', 'know'):
            for rx, why in BANNED:
                m = rx.search(r[col])
                if m: errs.append(f'row {n} {col}: {why} {m.group(0)!r}')
        if not r['topic'].startswith('Splitting Sales Representatives: '): errs.append(f'row {n} project not named')
        if '(a)' not in r['q'] or '(b)' not in r['q']: errs.append(f'row {n} no options')
    if errs:
        print('\n'.join(errs)); sys.exit(1)

    title = 'Splitting Sales Representatives – questions for Chris Ward (19 Oct 2026)'
    greeting = ('Hi Chris, we are writing the Splitting Sales Representatives test cases from the feature spec (PRD version 8, 14 Oct), '
                'the tech plan, the design and the two updated report specs (Sales By Representative and Sales By Customer), and found '
                'the points below that only you can decide. Please write your answer in the yellow column (a letter such as (a) is enough); '
                'an option marked "Suggested" is what the newest document says.')
    grid = [[title, '', '', '', '', ''], [greeting, '', '', '', '', ''],
            ['Colour guide:', 'Yellow = please write your answer here', 'Blue = the topic', 'Grey = where we found it', '', ''],
            ['', '', '', '', '', ''],
            ['#', 'Topic', 'Question for you', 'What we know today', 'Your answer', 'Where we found it']]
    for n, r in enumerate(ROWS, 1):
        grid.append([n, r['topic'], r['q'], r['know'], '', r['where']])

    def safe(v):
        if isinstance(v, str) and v[:1] in ('=', '+', '-', '@') : return "'" + v
        if isinstance(v, str) and re.match(r'^\d', v): return "'" + v
        return v
    sheet_values = [[safe(v) for v in row] for row in grid]

    data = dict(title='Splitting Sales Representatives – Questions for Chris Ward (19 Oct 2026)', tab='Questions for Chris',
                prepared='2026-10-19', grid_expected_display=grid, rows=[dict(n=n, **r) for n, r in enumerate(ROWS, 1)],
                dropped_as_answered=DROPPED)
    json.dump(data, open(os.path.join(OUT, 'questions.json'), 'w'), ensure_ascii=False, indent=1)

    # batches of ~14 KB for update_values
    batches, cur, start, size = [], [], 1, 0
    for i, row in enumerate(sheet_values, 1):
        s = len(json.dumps(row, ensure_ascii=False).encode())
        if cur and size + s > 14000:
            batches.append((start, cur)); cur, size, start = [], 0, i
        cur.append(row); size += s
    if cur: batches.append((start, cur))
    for k, (st, rows) in enumerate(batches, 1):
        rng = f"'Questions for Chris'!A{st}:F{st + len(rows) - 1}"
        json.dump(dict(range=rng, values=rows), open(os.path.join(SCR, f'batch{k}.json'), 'w'), ensure_ascii=False)
        print(k, rng, len(json.dumps(rows, ensure_ascii=False).encode()), 'bytes')

    # readable md
    L = [f'# {title}', '', 'Prepared 19 Oct 2026 for the QA lead. **Not sent to anyone.** Google Sheet: see SHEET-VERIFY-2026-10-19.md.', '',
         greeting, '', f'{len(ROWS)} questions, grouped by area.', '']
    cur_area = None
    for n, r in enumerate(ROWS, 1):
        if r['area'] != cur_area:
            cur_area = r['area']; L += [f'## {cur_area}', '']
        L += [f'### {n}. {r["topic"]}', '', '**Question for you**', '', r['q'].replace('\n', '  \n'), '',
              '**What we know today**', '', r['know'], '', '**Your answer:** ', '', f'<sub>Where we found it: {r["where"]}</sub>', '']
    open(os.path.join(OUT, 'QUESTIONS-FOR-CHRIS-WARD-2026-10-19.md'), 'w').write('\n'.join(L))

    # merge record
    names = {'TP': 'review/TECHPLAN-JIRA-REVIEW.md §e', 'BL': 'baseline/V1-BASELINE-AND-INVARIANTS.md §d',
             'SBR-DIV': 'report-specs/REPORT-SPECS-REVIEW-2026-10-19.md §b1 (DIVERGE)', 'SBC-DIV': 'report-specs/REPORT-SPECS-REVIEW-2026-10-19.md §b2 (DIVERGE)',
             'DES-Q': 'design-drive-2026-10-19/DESIGN-REVIEW-2026-10-19.md §8', 'DES-C': 'design-drive-2026-10-19/DESIGN-REVIEW-2026-10-19.md §6 (SPEC-CONFLICT)',
             'LANE': 'lane session, 19 Oct 2026'}
    by = {c: n for n, r in enumerate(ROWS, 1) for c in r['covers']}
    M = ['# Splitting Sales Representatives: how the PO questions were merged (19 Oct 2026)', '',
         'Every source question, where it went, and which were dropped as already answered. Built by script; the script fails if any source item is missing, duplicated or unknown.', '',
         f'- Source items: **{len(ALL_SOURCES)}** (tech plan review Q1-Q15, baseline Q1-Q10, 19 Sales By Representative v28 DIVERGE rows, 3 Sales By Customer v21 DIVERGE rows, design Q1-Q11, design SPEC-CONFLICT C1-C5, lane questions A and B).',
         f'- Dropped as answered: **{len(DROPPED)}**. Merged into the sheet: **{len(covered)}** source items into **{len(ROWS)}** rows.', '',
         'Source files: ' + '; '.join(f'{k} = {v}' for k, v in names.items()) + '.', '',
         '## Final rows and the source items each covers', '', '| Row | Area | Topic | Source items covered |', '|---|---|---|---|']
    for n, r in enumerate(ROWS, 1):
        M.append(f'| {n} | {r["area"]} | {r["topic"].replace(P, "")} | {", ".join(r["covers"])} |')
    M += ['', '## Every source item, in source order', '', '| Source item | Sheet row |', '|---|---|']
    for c in ALL_SOURCES:
        M.append(f'| {c} | {by.get(c, "dropped (answered)")} |')
    M += ['', '## Dropped as answered (with the answering sentence)', '',
          '| Source item | Answered by | Answering sentence (verbatim) |', '|---|---|---|',
          '| BL-Q3 (Sales By Representative Summary downloads) | SBR v28 S14-R5, S14-R15, S20-R8 | "S20-R8: The column selector state does not affect any export; all four downloads always include all metric columns, and both Expanded downloads always include Sales Type, whether or not it is shown on screen." The Summary column lists (S14-R5, S14-R15) have no Sales Type: option A, Summary unchanged. |',
          '| BL-Q6 (Sales By Customer filter menu rows) | SBC v21 S3-R2 | "S3-R2: Its menu offers two options, each with a checkbox, "Part Sales" and "Service Sales", under a "Select all" row, with "Clear selection" at the bottom." |',
          '| BL-Q8 (the field on a work order opened from its history) | SBR v28 S19-R1 | "The field is hidden on imported Work Orders and read-only in History mode." (agrees with PRD v8 S1-N1 and S2-R17: option A) |',
          '| TP-Q10 (where "Sales Type column on" is remembered) | SBR v28 S23-R1, S23-N1 | "S23-R1: The report remembers, per browser, the user\'s filter and view settings: ... column visibility ..." and "S23-N1: Clearing browser storage returns the report to first-visit defaults (S23-R4). No server-side profile is kept." (option a, this browser only) |',
          '', 'Kept although "answered": **BL-Q7** (Assignments export headings). SBR v28 answers it (option B, keep "Rep is active?"), but PRD v8 S4-R23 says "Representative is active?", so it stays open as row ' + str(by['BL-Q7']) + '.', '',
          '## Notes on the merge', '',
          '- "Suggested" is put first only where PRD v8 (14 Oct 2026) disagrees with an older document: Sales By Representative v28 (12 Oct), Sales By Customer v21 (6 Oct) or the Jira stories. Where the disagreement is with the tech plan (dated 14 Oct, re-checked 15 Oct) or the undated design, no option is marked suggested.',
          '- Rows 3 and 4 (Lead Technician) are kept apart: one asks about a background note, the other about where messages go.',
          '- Row 27 joins the empty-export questions for both reports (one decision, with option (c) if he wants them to differ).',
          '- Row 37 refers to rows 1 and 9 by number; the script checks that those rows are the Jira 44 px and "Show Details" questions.',
          '- Codes, ticket numbers and board numbers appear only in the grey "Where we found it" column (checked by script).']
    open(os.path.join(OUT, 'QUESTION-MERGE-2026-10-19.md'), 'w').write('\n'.join(M) + '\n')
    assert ROWS[0]['covers'] == ['TP-Q2'] and ROWS[8]['covers'] == ['TP-Q3']
    from collections import Counter
    print('rows', len(ROWS), 'covered', len(covered), 'dropped', len(DROPPED), 'sources', len(ALL_SOURCES))
    print(Counter(r['area'] for r in ROWS))

main()
