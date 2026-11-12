"""Design-vs-PRD differences for Internal Work Orders (design drive of 12 Nov 2026, Rule 130). Every prd_words string is checked word for
word against the saved PRD by build_all.py; every design_words string against the rendered boards, the notes or the board source.
HEADER = the PRD's own header sentence (Design row): "Where a frame and this text disagree, the text wins"."""
HEADER = 'Where a frame and this text disagree, the text wins'
IMG = 'images/'
D = []


def d(id, kind, boards, pictures, design_words, prd_code, prd_words, outcome, ruling_or_question, held_case='', note=''):
    D.append(dict(id=id, kind=kind, boards=boards, pictures=pictures, design_words=design_words, prd_code=prd_code, prd_words=prd_words,
                  outcome=outcome, ruling_or_question=ruling_or_question, held_case=held_case, note=note))


S = 'SETTLED-BY-PRD'
Q = 'QUESTION (drafted, not sent: the QA lead sends it)'
d('IWO-D01', 'wording', 'Flow 0 01, 02, 03, 2a…; Happy 01, 03; Review 1.1, 1.3', [IMG + 'iwo-flow0-01-01-settings-work-orders-setting-off.png'],
  ["Lets you flag your own company as an internal customer and mark a customer's work order as No Charge (warranty, goodwill, comeback). Both close without an invoice; their parts cost posts to the expense account of their category instead of Cost of Parts."],
  'S1-R1', ["mark a customer's work order, or a single line of a billable work order, as No Charge (warranty, goodwill, comeback). Internal and no-charge work orders close without an invoice"],
  S, 'S1-R1 gives the description word for word; PRD header: "%s". Cases quote S1-R1.' % HEADER)
d('IWO-D02', 'wording', 'Flow 0 02, 03; Happy 03; Review 1.3', [IMG + 'iwo-flow0-03-02-settings-setting-on.png'],
  ['Manage categories in Internal Work Orders (Administration > Service). Their expense accounts are set there or in Integrations > QuickBooks.'],
  'S1-R3', ['Manage categories in Internal Work Orders (Administration \\> Service). Their expense accounts are set on each category.'],
  S, 'S1-R3 quote; PRD header sentence.')
d('IWO-D03', 'missing state', 'Flow 0 "03 Settings · setting on, no flagged customer"', [IMG + 'iwo-flow0-09-03-settings-setting-on-no-flagged-customer.png'],
  ['The board is pixel-identical to "02 Settings · setting on": the two category/QuickBooks hints, no "No internal customer yet" line. The source holds "No internal customer yet. … No charge on customer work orders works now." behind a switch the board never reaches (and with "No charge" in lower case).'],
  'S1-R4', ['No internal customer yet. Work orders for your own equipment stay billable until you flag one: Edit Customer \\> Internal customer. No Charge on customer work orders works now.'],
  S, 'S1-R4 and §8 give the hint word for word; the case follows them (design-silent for the picture: no held case, Rule 130.5).')
d('IWO-D04', 'stale label', 'Flow 0 "12 Settings · turned off"', [IMG + 'iwo-flow0-19-12-settings-turned-off.png'],
  ['No-Charge Work Orders', 'Lets you flag internal customers and mark work orders as no charge. Both close without an invoice; parts cost posts to your expense accounts.'],
  'S1-R1', ['a toggle "Internal Work Orders" (Title Case like the other toggles on the tab)'], S, 'S1-R1 names the toggle; PRD header sentence.')
d('IWO-D05', 'wording and state', 'Flow 0 01b; Happy 02; Review 1.2', [IMG + 'iwo-flow0-02-01b-turn-on-pick-your-internal-customers.png'],
  ['parts cost posts to your Internal Work Orders Expense account when you use QuickBooks or AccountingHub', 'Save drawn enabled (blue) while no customer is ticked', 'customers drawn as an open list with checkboxes; no chips, no "Pick up to 50" hint'],
  'S1-R2', ['parts cost posts to the expense account of their category when you use QuickBooks or AccountingHub', 'Save is disabled until at least one customer is picked.'],
  S, 'S1-R2 (body, Save disabled, chips, 50 hint); PRD header sentence.')
d('IWO-D06', 'missing element', 'Flow 0 05, 08; Happy 08; Review 3.2 (and note c-rv-3-2); Flow 0 11', [IMG + 'iwo-flow0-11-05-customer-page-internal-customer.png', IMG + 'iwo-flow0-17-11-edit-customer-min-without.png'],
  ['Internal customer checkbox with an info icon and no helper text; ticked, with no "Default internal category" select on boards 05/08 and 3.2 (the select shows only on board 11). Note c-flow0-5: "The checkbox is the only place the flag is set."'],
  'S1-R7', ['with the helper "Work orders for this customer are internal: no prices, no invoice, parts cost posts to the expense account of the internal category." When ticked, the select "Default internal category" appears under it',
            'The checkbox and the modal are the only places the flag is set'],
  S, 'S1-R7 quote; PRD header sentence.')
d('IWO-D07', 'behaviour', 'Flow 0 2e (and note c-flow0-2e)', [IMG + 'iwo-flow0-08-2e-internal-work-orders-page-setting-off.png'],
  ['Internal Work Orders is off. Turn it on in Settings > Work Orders to use these categories; nothing here is deleted while it is off.', 'New Internal Category disabled and the lists greyed (read-only); the Internal Work Orders menu item greyed with the tooltip "Turn on Internal Work Orders in Settings > Work Orders." (the tooltip is cut by the sidebar edge on the board)'],
  'S1-R13', ['while the setting is off it shows the notice "Internal Work Orders is off. Turn it on in Settings \\> Work Orders." and the lists stay editable.'],
  S, 'S1-R13 quote (notice words, lists editable, the page reachable); PRD header sentence.')
d('IWO-D08', 'label', 'Flow 0 2a, 2e; Happy 04; Review 2.1', [IMG + 'iwo-flow0-04-2a-internal-work-orders-page-internal-categories.png'],
  ['Internal customers'], 'S1-R13', ['Internal customers using it'], S, 'S1-R13 column list; PRD header sentence.')
d('IWO-D09', 'wording that contradicts behaviour', 'Flow 0 2a/2c/2d/11; Happy 04, 06; Review 2.1, 2.3', [IMG + 'iwo-flow0-06-2c-new-no-charge-category.png', IMG + 'iwo-flow0-07-2d-new-internal-category.png', IMG + 'iwo-flow0-17-11-edit-customer-min-without.png'],
  ['Shown in the Category select when a work order is marked No Charge. It shows on the work order, the NO CHARGE document and the Internal Work Orders report.',
   'Where the cost of work on your own equipment goes. Each internal customer has a default category; a work order can change it.',
   'Preselected on every new work order for this customer; a work order can change it. New internal customers get General Internal.'],
  'S2-R16 / S2-R1 / KD', ['It is not shown on the work order detail or in lists; the badge is the only mark there.', 'it can be changed on the asset or the customer, never on the work order.'],
  Q, 'NEW-QUESTIONS.py question 1', 'DV-01', 'The PRD gives no text for these intro and helper sentences, so it cannot settle what they should say; it does settle the behaviour they describe wrongly.')
d('IWO-D10', 'wording', 'Flow 0 2c, 2d; Happy 06; Review 2.3', [IMG + 'iwo-flow0-07-2d-new-internal-category.png'],
  ['Not set at any location. Parts cost of this category posts to the ShopView Review account until you pick one.', 'The work order asks which earlier work order the job comes from, or "Not in ShopView". Optional when the work order is created, required at Close.'],
  'S1-R14', ['with the helper "One per connected location, picked from the chart that is already in QuickBooks. Parts cost of this category posts here instead of Cost of Parts. Empty: posts to the ShopView Review account until you pick one."',
             'The work order asks which earlier work order the job comes from, or Not in ShopView. Optional when the work order is created, required at Close.'],
  S, 'S1-R14 quote (helper on both dialogs; "Not in ShopView" without quote marks); PRD header sentence.')
d('IWO-D11', 'labels and hint', 'Flow 0 09, 10; Happy 10; Review 3.1', [IMG + 'iwo-flow0-15-09-settings-integrations-quickbooks.png', IMG + 'iwo-flow0-16-10-quickbooks-category-row-not-set.png'],
  ['Internal work orders · one row per category', 'No Charge work orders · one row per category', 'Not set. Parts cost of this category posts to the ShopView Review account until you pick one.', 'category rows without the QuickBooks mark; a Default badge on General Internal; board 10 has no shop supplies note'],
  'S5-R1 / S5-R4', ['grouped under the headers "Internal work orders" and "No Charge work orders", each row named after its category and carrying the QuickBooks mark', 'Not set. Parts cost of \\[category\\] work orders posts to the ShopView Review account until you pick one.'],
  S, 'S5-R1, S5-R4 quotes; PRD header sentence.')
d('IWO-D12', 'not drawn (hidden text stale)', 'Flow 1 02a (note c-flow1-2a "with the info tooltip"), 02e; Happy 20', [IMG + 'iwo-flow1-02-02a-new-work-order.png'],
  ['info icon with no tooltip drawn (the board source hides tooltips: SHOW_TIPS = false); the hidden text reads "Warranty, goodwill, policy or comeback work. Closes without an invoice; parts cost posts to Customer No-Charge Expense."'],
  'S2-R2', ['an info icon whose tooltip reads "Warranty, goodwill or comeback work. Closes without an invoice; parts cost posts to the expense account of the category."'],
  S, 'S2-R2 and §8 quote the tooltip; nothing drawn to compare (design-silent, no held case).')
d('IWO-D13', 'board covers its own subject', 'Flow 1 02b; Happy 12; Review 3.4', [IMG + 'iwo-flow1-03-02b-new-work-order-internal-customer.png'],
  ['the open asset list covers the Internal badge and its tooltip that note c-flow1-2b describes; board 2b2 (Happy 13) shows them'],
  'S2-R1', ['picking a customer with the Internal customer flag shows the "Internal" badge next to the customer name with an info icon'],
  S, 'S2-R1 quote; the look case uses board 2b2 / Happy 13 for the badge and tooltip.', note='Look of the design board, not a product question.')
d('IWO-D14', 'look', 'every desktop work order detail board of an internal or no-charge work order (Flow 1 03…S2, Flow 2 03…06, Flow 3, Happy 14-18, 23-29, 36-37)', [IMG + 'iwo-flow1-08-03-work-order-in-progress.png', IMG + 'iwo-flow4-08-08-mobile-detail-header.png'],
  ['the header card is white with the normal border on desktop; only the mobile header (Flow 4 08) is drawn with an orange outline and light orange background'],
  'S2-R3', ['the header card of an internal or no-charge work order has an orange outline and a light orange background'], S, 'S2-R3 quote; PRD header sentence.')
d('IWO-D15', 'look', 'every board with both badges (lists, detail headers, cards, hub)', [IMG + 'iwo-flow1-01-01-work-orders-list.png'],
  ['the No Charge badge is drawn in the same orange square style as the Internal badge'], 'S2-R3', ['"No Charge" for a no-charge work order (a different style from Internal)'],
  S, 'S2-R3 quote; the case checks that the two badges look different, without naming a colour (the design authority names the token, S2-R3).')
d('IWO-D16', 'wrong badge', 'Flow 4 07, 08, 10 (and notes c-flow4-7/8/9); Flow 1 10b; Flow 5 03', [IMG + 'iwo-flow4-10-10-board-internal-card.png', IMG + 'iwo-flow4-07-07-mobile-list-card.png', IMG + 'iwo-flow1-24-10b-asset-invoices-tab.png', IMG + 'iwo-flow5-02-03-accountinghub-sales-invoices.png'],
  ['work orders of the internal customer Staging Heavy Duty Fleet (S2-34918, S2-34870, S2-33590) carry a "No Charge" badge on the Board, the mobile card and header, the asset Invoices tab and the AccountingHub Invoices list'],
  'TERM', ['On a flagged customer\'s work order the badge reads Internal, never No Charge.'], S, 'Terminology quote; PRD header sentence.')
d('IWO-D17', 'prices shown', 'internal detail boards (Flow 1 03-05, 3c, 3e, 2c, S2; Flow 3; Happy 14-17, 36-37)', [IMG + 'iwo-flow1-08-03-work-order-in-progress.png'],
  ['lines table keeps Rate ($0.00) and Total ($265.00, $410.00); Financial Info has a Value column (Parts $675.00, Labor $0.00, Total $675.00) and a Total row. The no-charge boards (Flow 2 03) already draw it cost-only (Rate and Total empty, "$180.00 cost", Parts cost / Labor hours only).'],
  'S2-R4', ['the Rate, Margin and Total columns of the lines table (a part\'s sell price sits in Rate) and the Sell price, Rate and Margin fields of the line and part dialogs are hidden and not required; there is no work order total'],
  S, 'S2-R4 quote; the design\'s own no-charge boards agree with it.')
d('IWO-D18', 'placement', 'Flow 1 03, 3c, 3e, 2c; Happy 14 (note c-flow1-3c says the opposite)', [IMG + 'iwo-flow1-09-3c-menu-internal.png'],
  ['Close Work Order is the header button while the lines are In Progress / Approved, and the three-dots menu (Audit Log, Timesheets, Print Work Order) does not hold it'],
  'S3-N2', ['With review off and open lines, Close Work Order sits in the three-dots menu exactly as Create invoice does today; once every line is Complete it is the header button and leaves the menu'],
  S, 'S3-N2 quote; the board note c-flow1-3c agrees with the PRD.')
d('IWO-D19', 'document', 'Flow 1 04, 3d; Happy 15 (open internal estimate); Flow 1 08 / Happy 18 (closed)', [IMG + 'iwo-happy-15-15-finance-tab.png', IMG + 'iwo-flow1-22-08-work-order-closed-invoice.png'],
  ['open internal estimate: "Estimate:" document with Labor $0.00 columns, "Line total", a Total and "No Charge." block; stamp INTERNAL with "Category: General Internal" (also on the closed internal document). Note c-flow1-8 says the document "is stamped NO CHARGE".'],
  'S2-R4 / S3-R5', ['The estimate and invoice documents for these work orders show the same and carry the NO CHARGE stamp and, on a no-charge work order, the line "Category: \\[Category\\]" under the stamp',
                    'the INTERNAL or NO CHARGE stamp with the line "Category: \\[name\\]"'],
  Q, 'Prices and totals on the estimate: settled by S2-R4. Stamp word and category line on an open internal estimate: NEW-QUESTIONS.py question 2 (S2-R4 and S3-R5 read differently).', 'DV-02')
d('IWO-D20', 'wording', 'Flow 1 07, 7b, 7d, 7e, 7f; Happy 17; Review 5.2', [IMG + 'iwo-flow1-16-07-close-confirm.png'],
  ['This posts the parts cost and shop supplies to your books and marks the work order Closed · No Charge. You can reopen it later. (on internal work order S2-34918)'],
  'S3-R2', ['This posts the parts cost and shop supplies to your books and marks the work order Closed · Internal. You can reopen it later.'], S, 'S3-R2 quote; PRD header sentence.')
d('IWO-D21', 'wording and field', 'Flow 1 7c', [IMG + 'iwo-flow1-18-7c-close-no-accounting-integration.png'],
  ['This marks the work order Closed · No Charge. Parts cost and hours are in the Internal Work Orders report.', 'no Posting date field'],
  'S3-E4 / S3-R2', ['This marks the work order Closed · Internal (Closed · No Charge). Parts cost, shop supplies and hours are available in the Internal Work Orders report.', 'with a posting date field (default today'],
  S, 'S3-E4, S3-R2 quotes; PRD header sentence.')
d('IWO-D22', 'wording', 'Flow 1 7b (note c-flow1-6c "When Internal Work Orders Expense is not mapped")', [IMG + 'iwo-flow1-17-7b-close-no-account-set.png'],
  ['No account set for internal work orders. The entry posts to the ShopView Review account until you set one.', 'Special orders and Labor rows drawn without their notes'],
  'S3-N4', ['No account set for \\[category\\]. The entry posts to the ShopView Review account until you set one.'], S, 'S3-N4 quote; PRD header sentence.')
d('IWO-D23', 'stale elements', 'Flow 2 04, 4b; Happy 27, 28; Review 5.1 (the detail behind the dialog)', [IMG + 'iwo-flow2-11-4b-close-original-work-order-required.png'],
  ["No Charge checkbox on the customer card with \"A customer's free job: warranty, goodwill, policy, comeback or a category of your own. Closes without an invoice; parts cost posts to the category's expense account.\"",
   'No charge. This work order closes without an invoice. Parts cost posts to Customer No-Charge Expense.', 'no closing sentence under the rows on 4b'],
  'S2-R5 / S2-R3 / S3-R2', ['There is no checkbox on the work order detail.', 'there is no hint sentence under the header'], S, 'S2-R5, S2-R3, S3-R2 quotes; PRD header sentence.')
d('IWO-D24', 'missing element', 'Flow 1 02e; Flow 2 02, 3c; Flow 6 02, 06; Happy 20, 22, 25, 31', [IMG + 'iwo-flow2-04-02-confirm.png', IMG + 'iwo-flow6-02-02-mark-this-line-as-no-charge.png'],
  ['Original work order and Original line picked, no "Original technician:" line under the selects'],
  'S2-R2 / S12-R2', ['As soon as a work order or a line is picked, the line "Original technician: \\[names\\]" (or "Original technician: none") shows under the selects'],
  S, 'S2-R2 quote (S12-R2 repeats it); nothing drawn to compare: no held case.')
d('IWO-D25', 'letter case', 'Flow 2 02; Happy 22; Review 4.2', [IMG + 'iwo-flow2-04-02-confirm.png'],
  ['Convert work order S2-35102 to no charge?'], 'S2-R5', ['Convert work order \\[number\\] to No Charge?'], S, 'S2-R5 quote (letter case, lesson L-04); PRD header sentence.')
d('IWO-D26', 'wording', 'Flow 2 3b, 3e; Flow 6 04 note; Happy 26; Review 4.4', [IMG + 'iwo-flow2-06-3b-convert-to-billable-confirm.png', IMG + 'iwo-flow2-09-3e-notes-after-convert-to-billable.png'],
  ["Every line is priced at the customer's current pricing. You can convert it to no charge again until it is invoiced.", "Converted to Billable by Admin ShopView. Every line priced at the customer's current pricing. Category Warranty removed.",
   "Mark as Billable prices the line at the customer's current pricing and removes the category."],
  'S2-R6 / S2-R18 / S12-R5 / S12-R6', ['Every line is priced as a new line would be today. You can convert it to no charge again until it is invoiced.', 'Every line priced as a new line would be today. Category \\[name\\] removed.',
                                        'Priced as a new line would be today: $\\[price\\]. Category \\[name\\] removed.'],
  S, 'S2-R6, S2-R18, S12-R6 quotes; PRD header sentence.')
d('IWO-D27', 'control placement', 'Flow 1 08; Happy 18, 37; Flow 3 02 (dialog opened over the Lines tab)', [IMG + 'iwo-flow1-22-08-work-order-closed-invoice.png', IMG + 'iwo-flow3-02-02-reopen-dialog.png'],
  ['a "Reopen" button in the work order header of a closed internal work order; the closed internal document toolbar has no invoice menu'],
  'S4-R1 / S2-R9', ['It is the only place to reopen; the work order header carries the line of S2-R9 and no button.', 'There is no Reopen control on the work order itself (Story 4).'],
  S, 'S4-R1, S2-R9 quotes; Flow 2 05 already draws Reopen Work Order in the invoice menu.')
d('IWO-D28', 'missing dismiss control', 'Flow 1 08, S2; Happy 18 (note c-flow1-8 "X dismisses it")', [IMG + 'iwo-flow1-22-08-work-order-closed-invoice.png', IMG + 'iwo-flow1-25-s2-close-work-order-failed.png'],
  ['success alert "Work order S2-34918 is Closed · Internal." drawn without an X; the failed-close toast drawn without a dismiss control'],
  'S3-R3 / S3 Error Handling', ['with the X every alert in the app has', 'display "Could not close the work order. Try again." as an alert toast that must be dismissed'], S, 'S3-R3 and Story 3 error handling quotes.')
d('IWO-D29', 'element the PRD does not describe', 'Flow 1 08 (after the alert), Flow 3 02; Happy 36 frame-opened, 37', [IMG + 'iwo-flow3-02-02-reopen-dialog.png', 'render/full/hf-36-frame-opened.png'],
  ['Closed on Oct 22, 2026 by Admin ShopView', 'This work order is locked. Reopen it to change lines, hours or parts.', 'Reopening returns it from Closed · Internal to Complete.'],
  'S2-R9', ['the header card carries the line "Closed on \\[posting date\\]. To change it, reopen it from the Finance tab."'],
  Q, 'NEW-QUESTIONS.py question 3', 'DV-03', 'Note c-flow1-8: "then the locked note shows as on any closed work order". The PRD names only the header line.')
d('IWO-D30', 'wording', 'Flow 3 02; Happy 37', [IMG + 'iwo-flow3-02-02-reopen-dialog.png'],
  ['The work order leaves Closed · No Charge and goes back to Complete. (internal work order S2-34918; one sentence)'],
  'S4-R2', ['The work order leaves Closed · Internal and goes back to Complete. The parts cost and shop supplies entries are reversed in your books.'], S, 'S4-R2 quote; PRD header sentence.')
d('IWO-D31', 'message the PRD does not have', 'Flow 3 03', [IMG + 'iwo-flow3-03-03-work-order-complete-again.png'],
  ['Work order S2-34918 reopened'], 'S4-R3', ['sets the work order to Complete with its classification unchanged'], Q, 'NEW-QUESTIONS.py question 4', 'DV-04')
d('IWO-D32', 'labels on the document', 'Flow 1 08; Flow 2 05, 07; Happy 18, 29', [IMG + 'iwo-flow2-12-05-finance-tab-closed.png'],
  ['Summary row "Labor" (2.0 h)', 'original work order printed as plain text', 'Category: Warranty · Original work order S2-31207 (the convert boards picked S2-30455)'],
  'S3-R5', ['a Summary with Parts cost', 'Shop supplies (when above $0.00) and Labor hours', '"· Original work order \\[number\\]" (a link in ShopView, plain on the PDF)'],
  S, 'S3-R5 quote; the original number is demo data.')
d('IWO-D33', 'note text', 'Flow 2 3d; Flow 6 05; Happy 24, 34', [IMG + 'iwo-happy-34-34-notes-and-audit-log.png'],
  ['Line "Replace - Brake caliper" marked No Charge by Admin ShopView. Category Warranty, original work order S2-30455. Line price $559.95 removed; cost $410.00 and 1.00 h kept. The work order stays billable.', 'work order numbers in notes drawn as plain text'],
  'S12-R6 / S2-R18', ["Line '\\[title\\]' marked No Charge by \\[user\\]. Category \\[name\\], original work order \\[number\\], original line \\[number\\].", 'Work order numbers in notes are links.'],
  S, 'S12-R6 and S2-R18 quotes (single quote marks, original line part, links).')
d('IWO-D34', 'account names', 'Flow 1 2c, 2d (and notes)', [IMG + 'iwo-flow1-05-2c-change-customer-bill-already-posted.png'],
  ['…was posted to Internal Work Orders Expense…', '…that cost moves to Internal Work Orders Expense…', 'notes: the vendor-bill dialog "also says: Shop supplies resets to Staging Heavy Duty Fleet\'s minimum ($25.00)."'],
  'S2-R8 / S2-R7', ['The account names are the shop\'s own mapping rows (Cost of Parts, or the expense account of a category)', 'The Change Customer dialog says what will happen to the prices and, when the work order stays internal or no charge, adds "Shop supplies resets to \\[customer\\]\'s minimum ($\\[amount\\])."'],
  S, 'S2-R8, S2-R7 quotes ("Internal Work Orders Expense" is the fixed row of v0.17, replaced by the category rows: Terminology).')
d('IWO-D35', 'placement', 'every work orders list board (Flow 1 01, 09; Flow 4 01-03; Happy 11, 19, 38)', [IMG + 'iwo-flow1-01-01-work-orders-list.png'],
  ['the Internal / No Charge badge sits after the customer name in the Customer column; the Status column holds only the status pill'],
  'S2-R10', ['The work orders list shows the badge in the status column for internal and no-charge work orders in every tab'], S, 'S2-R10 quote; PRD header sentence.')
d('IWO-D36', 'filter meaning', 'Flow 4 02, 03; Happy 38; Review 7.1 (note c-flow4-2)', [IMG + 'iwo-flow4-02-02-list-no-charge.png'],
  ['board titled "02 List · No Charge" shows "Classification: Internal" with internal rows; note: "Classification: No Charge (internal and customer no-charge work)"'],
  'S2-R14', ['a chip "Classification: All / Billable / Internal / No Charge"'], S, 'S2-R14 quote: Internal and No Charge are separate values.')
d('IWO-D37', 'superseded component defaults', 'Shared screens (the four component boards at their default props)', [IMG + 'iwo-components-03-wo-settings-artboard-v6.png', IMG + 'iwo-components-04-new-wo-dialog-v6.png', IMG + 'iwo-components-01-wo-detail-artboard-v6.png', IMG + 'iwo-components-02-wo-list-artboard-v6.png'],
  ['Internal work orders', 'Adds an Internal option when creating work orders. Creates the system customer Staging Heavy Duty Internal for your own trucks and equipment.', 'Internal work order', 'System customer for your own trucks and equipment.', 'an "Internal" toggle chip on the list'],
  'KD / TERM', ['Internal is a flag on the customer, not on the work order, not a work order type and not a new status.', 'Not a system customer: ShopView creates nothing.'],
  S, 'Key Decisions and Terminology quotes; the Shared screens page is the components at their oldest defaults, not a screen of the feature.')
d('IWO-D38', 'look (library)', 'Flow 6 01, 04; Happy 30, 33; Review 6.1, 6.4', [IMG + 'iwo-flow6-01-01-line-menu-mark-as-no-charge.png'],
  ['Mark as No Charge and Change category drawn with an empty icon slot: the icons "badge-dollar-sign" and "pencil-line" are not in the design library (console: "do not ship an empty box")'],
  'S12-R1', ['the three-dots menu of every line offers "Mark as No Charge" between Edit line and Delete line'], S,
  'S12-R1 quote for the item and its place; the look case does not check an icon the design does not have.', note='No question: no verdict depends on the icon.')
d('IWO-D39', 'state not drawn', 'Flow 6 07; Happy 35; Review 6.6 (title "Invoice · the line at $0.00, Warranty")', [IMG + 'iwo-flow6-07-07-invoice-the-line-at-0-00-warranty.png'],
  ['the board draws the Estimate (Estimate EST-S2-34918, Create invoice still in the header), not the invoice'],
  'S12-R7 / S12-R4', ['The invoice (preview, PDF, email, portal) shows the no-charge line with its hours and parts at $0.00 and the category name as a line under the title ("Warranty"); no stamp, no badge, no "No Charge" wording elsewhere on the document.'],
  S, 'S12-R7 quote for the invoice; the estimate drawn matches S12-R4. Design-silent for the invoice picture: no held case.')
d('IWO-D40', 'states not drawn', 'Flow 6 (line), Flow 2 1b/6', [],
  ['not drawn: the Mark line as billable confirmation, the deposit message and the all-lines hint of the Mark as No Charge dialog, the "Reverse the invoice first." tooltip, the "Reverse the deposit first" and "Reopen the work order to change the customer." tooltips (hidden in the source: SHOW_TIPS = false)'],
  'S12-R5 / S12-R4 / S12-R10 / S12-N3 / S2-N4 / S2-R9', ['Mark line as billable?', 'Reverse the invoice first.', 'Reverse the deposit first'], S, 'The PRD words stand alone (DESIGN-SILENT, Rule 130.5).')
d('IWO-D41', 'label', 'Flow 4 04', [IMG + 'iwo-flow4-04-04-technician-efficiency-show-all.png'],
  ['No-charge work orders: Show all', 'Hide / Only no-charge / Show all'], 'S9-R3', ['a filter chip "Internal work orders: Hide / Only internal / Show all"'], S, 'S9-R3 quote; PRD header sentence.')
d('IWO-D42', 'label and note', 'Flow 4 06; Happy 39b; Review 7.5', [IMG + 'iwo-flow4-06-06-internal-work-orders-report-by-technician.png'],
  ['Not in ShopView / no technician', 'Comeback rate = comeback lines attributed to the technician / lines the technician completed in the date range. Redo hours and parts cost are what the comeback and warranty work cost the shop; the dollar cost of labor comes with labor posting (V2).'],
  'S9-R2', ['A row "Unassigned" holds the work without an original technician', 'a note under the table says so'], S, 'S9-R2 quote (row name; the note must state the several-technicians rule).')
d('IWO-D43', 'number', 'Flow 4 05, 06; Happy 39, 39b; Review 7.2, 7.5', [IMG + 'iwo-flow4-05-05-internal-work-orders-report.png'],
  ['Company Vehicle Maintenance card $700.00 = parts cost $675.00 + shop supplies $25.00 (the Warranty card $590.00 is parts only)'],
  'S9-R2', ['Above the table a summary strip shows one card per category in the range: parts cost, count of work orders and lines, hours.'], S, 'S9-R2 quote (Rule 116: the card is the parts cost).')
d('IWO-D44', 'look (library rule)', 'Flow 4 05; Happy 39; Review 7.2', [IMG + 'iwo-flow4-05-05-internal-work-orders-report.png'],
  ['empty Original work order and Original technician cells on the whole internal work order row'],
  'S9-R2', ['Original work order (link, with the original line number when set), Original technician'], Q, 'NEW-QUESTIONS.py question 5', 'DV-05',
  'Design library (work-orders.jsx, the dash cell): "Nothing. Always this, never an empty cell or a bare hyphen in text."; the asset Invoices tab already uses the dash.')
d('IWO-D45', 'wrapping at 1440/1536', 'Flow 4 05, 06; Happy 39, 39b; Review 7.2, 7.5', [IMG + 'iwo-flow4-05-05-internal-work-orders-report.png', 'render/widths/hf-39-1536.png'],
  ['work order numbers break onto two lines ("S2-" / "34918") and dates wrap, at 1280 px and still at 1536 px'], 'S9-R2', ['Work order (link)'], Q,
  'NEW-QUESTIONS.py question 6', 'DV-06')
d('IWO-D46', 'label', 'Flow 5 01; Happy 40', [IMG + 'iwo-flow5-01-01-qb-unexported-held-entry.png'],
  ['Type "Journal Entry" on the work order rows'], 'S7-N3', ['(type "Internal Work Order Close", "Internal Work Order Reopen" or "No Charge line")'], S, 'S7-N3 quote; PRD header sentence.')
d('IWO-D47', 'wording', 'Flow 5 04; Happy 42; Review 7.4', [IMG + 'iwo-flow5-04-04-accountinghub-held-event.png'],
  ['General Internal: expense account is not mapped'], 'S8-N2', ['"Internal: \\[Category\\] row not mapped"'], S, 'S8-N2 quote; PRD header sentence.')
d('IWO-D48', 'board cuts content', 'Flow 5 3c; Happy 41b; Review 7.6', [IMG + 'iwo-flow5-05-3c-accountinghub-invoice-record-with-one-no-charge.png', 'render/full/hf-41b-frame-opened.png'],
  ['the 840 px frame squeezes the No Charge lines card: its row and the two no-charge journal rows are not visible on the board (read from the source and the frame-opened render)'],
  'S8-R7', ['The record carries a "No Charge lines" block: line number and title, category, original work order and line, original technician, hours, parts cost, expense account.'],
  S, 'S8-R7 quote; the look case uses the frame-opened render.', note='Board look, not a product question.')
d('IWO-D49', 'stale page text', 'Flow 2 page description; Flow 6 page name in the dropdown', [],
  ['One free line on a paid job is moved to its own No Charge work order (Flow 6); marking a line No Charge in place is V2 and reuses these categories.', 'Flow 6 · Move one line off a billable work order'],
  'S12 / OOS', ['Moving a line to a separate work order from the line menu.', 'A no-charge line stays on its billable work order and shows $0.00 on one invoice, instead of moving to a separate work order.'],
  S, 'Out of Scope and Key Decisions quotes; the Flow 6 boards, its title note and the Review page already follow the PRD.')
d('IWO-D50', 'open review remarks', 'Review 1.1 (two paragraphs below the 1000 px frame, not visible on the canvas)', ['render/full/rv-1-1-frame-opened.png'],
  ["Move this tooltip text. It's fine to be just this tag here, which is fine, but let's bring back the explanation a little, just one sentence.", "Badge here, we agree, is not no-charge warranty. It's no charge, just that the badge itself"],
  'S1-R1 / S2-R3', ['"No Charge" for a no-charge work order (a different style from Internal)'], Q, 'NEW-QUESTIONS.py question 7', '', 'No case depends on it until the answer says what changes.')
d('IWO-D51', 'notes that disagree with their boards', 'c-flow1-3c, c-rv-3-2, c-flow4-9, c-flow4-2, c-flow1-8, c-flow1-2a', [],
  ['notes describe the PRD behaviour while the board draws something else (Close in the menu; Default internal category; No Charge badge on an internal card; No Charge filter; X on the alert; tooltip)'],
  'see D18, D06, D16, D36, D28, D12', ['see those rows'], S, 'Closed with the rows named.')
d('IWO-D52', 'seeding time', 'notes c-flow0-2a / c-hf-04 and d-flow0', [],
  ['The starting set is seeded when the setting is first turned on', 'and gets the starting categories'],
  'S1-R13 / S13-R1', ['The starting set is seeded for every organization when this release ships', 'turning the setting on seeds nothing'], S, 'S1-R13 quote.')

QUESTIONS = {1: 'IWO-D09', 2: 'IWO-D19', 3: 'IWO-D29', 4: 'IWO-D31', 5: 'IWO-D44', 6: 'IWO-D45', 7: 'IWO-D50'}

# PRD words the design does not show at all (DESIGN-SILENT): no held case (Rule 130.5); the PRD-following case stands alone.
NOT_SHOWN = [
    ('S1-R2', 'Pick up to 50 customers here. Flag more from Edit Customer.'), ('S1-R11', 'and [n] more'), ('S1-N6', 'OK (one button without Work Orders — Create & Edit)'),
    ('S1-R12', 'Remove flag dialog without open internal work orders (first sentence omitted)'), ('S1-R3', 'AccountingHub, both and neither variants of the second hint'),
    ('S1-R8', 'Internal badge on the customers list mobile card'), ('S1-R13', 'You can have up to 100 active categories in this list. Archive one to add another.'),
    ('S1-R14', 'A category with this name is archived. Restore it instead.'), ('S1-R14', 'Set in Integrations > QuickBooks (read-only pickers)'),
    ('S1-R16', '[n] internal customers and [m] assets use this category as their default. Their new work orders will use the next category in line.'),
    ('S1-R16', '[name] (archived) / Archived. Pick an active category.'), ('S1-R13', 'Show archived list with Restore'), ('S1-EH', 'Could not save the internal customer. Try again.'),
    ('S1-EH', '[n] work orders could not be made internal. Open Edit Customer and save to try again.'),
    ('S2-R2', 'Pick a category (field message)'), ('S2-R7', 'Change Customer dialog with "Shop supplies resets to [customer]\'s minimum ($[amount])."'),
    ('S2-R8', 'The vendor bills for [n] parts ($[total]) were posted to [account]. (several bills; two category accounts)'),
    ('S2-R10', 'badge on the customer and asset Work Orders tabs and in global search'), ('S2-R14', 'Classification chip in the mobile filter sheet'),
    ('S2-R19', 'Internal work order: cost only, no sell price / No Charge work order: cost only, no sell price / No Charge line: cost only'),
    ('S2-E6', 'This estimate changed after it was sent. The lines above are current.'), ('S1-R11', 'This estimate is no longer available.'),
    ('S2-EH', 'Could not change the work order. Try again.'), ('S3-R1', 'mobile Close Work Order icon button'),
    ('S3-R2', '"Moved from [account] to [account]" and "Posts to [account] when the vendor bill is entered" notes; includes $[core amount] core cost'),
    ('S3-N4', 'AccountingHub variant: No account set for [category]. The entry is held in Accounting Events until you set one.'), ('S3-R5', 'Email dialog'),
    ('S3-E1', 'Parts cost $0.00'), ('S4-EH', 'Could not reopen the work order. Try again.'), ('S7-R8', 'Create invoice [number]? with Moved from rows'),
    ('S8-R6', 'Invoice list report with Closed unselected'), ('S6-R1', 'Account Mappings rows (Internal: General Internal, No Charge: Warranty)'),
    ('S9-R6', 'Export Reports option "Include internal and no-charge work orders" with "For your records only. Do not import these rows as invoices."'),
    ('S9-N1', 'report empty state'), ('S12-R4', 'Deposit $[amount] exceeds the new total $[total]. …'), ('S12-R9', "Line '[title]' needs its original work order (or Not in ShopView) before the invoice."),
    ('S12-R10', 'All lines are No Charge. To close without an invoice and get the NO CHARGE document, convert the work order instead.'),
    ('S12-EH', 'Could not change the line. Try again.'), ('S5-R1', 'archived category row, greyed'), ('S2-R11', 'Approval Required email'),
]
