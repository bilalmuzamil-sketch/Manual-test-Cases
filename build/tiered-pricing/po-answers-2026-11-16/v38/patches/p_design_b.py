import sys; sys.path.insert(0, 'po-answers-2026-11-16/v38/patches'); from _p import patch
R24 = 'S("S19-R24", "Columns and fields keep their place and width when a screen changes state")'
NOMOVE = 'S("S19-R24", "Nothing moves sideways or down.")'
SET = 'S("S3-R26", "Breadcrumbs start at the Settings page the user is on, never at Settings")'
patch('authoring/cases_design_batch_a.py', [
('''Held "design version" cases (Rule 130) carry the design's own version where the PRD words it differently; each is
held on its question candidate in po_questions_batch_a.py.''',
 '''Held "design version" cases (Rule 130) carry the design's own version where the PRD words it differently; each was
held on its question. 16 Nov 2026 (Matt Barge's answers, PRD v38): D-129, D-162, D-165 released (the design won); D-179 rewritten to S19-R24
and released; D-130, D-147, D-168, D-171, D-172, D-185, D-211 and D-224 deleted (kept in po-answers-2026-11-16/v38/deleted-library-cases.py).'''),
('''from tp_lib import C, R, B, S, QP, QD, QT, QL
''', '''from tp_lib import C, R, B, S, QP, QD, QT, QL, QA
'''),
# D-123, D-149 refs gain S19-R24 (tester text unchanged)
('''   look("6.7", "S6-R2", "Compared with the first screenshot, the column headings Matrix, Status, Categories, Work Order Matrix, Part Sale Matrix and Tiers keep their places, as pictures 6.2 and 6.7 show.", "The rows below the headings change to the Inactive matrices.")],''',
 '''   R([QL("6.7", "S6-R2"), ''' + R24 + ''', S("S19-R24", "a filter chip changing")],
     "Compared with the first screenshot, the column headings Matrix, Status, Categories, Work Order Matrix, Part Sale Matrix and Tiers keep their places, as pictures 6.2 and 6.7 show.", "The rows below the headings change to the Inactive matrices.")],'''),
('''   look("7.5", "S7-R4", "Compared with the first screenshot, the column headings Category, Pricing Matrix, Default and the tiers keep their places, as pictures 7.3 and 7.5 show.", "The rows below them narrow to the matching categories.")],''',
 '''   R([QL("7.5", "S7-R4"), ''' + R24 + ''', S("S19-R24", "a search narrowing a list")],
     "Compared with the first screenshot, the column headings Category, Pricing Matrix, Default and the tiers keep their places, as pictures 7.3 and 7.5 show.", "The rows below them narrow to the matching categories.")],'''),
# D-129 release
('''  [R(QD("Same as work orders", "6.2", "S6-R1"), "Matrix A's Part Sale Matrix reads \\"Same as work orders\\" in gray.")
   + R(QD("2 rules · cost + $, margin", "6.2", "S6-R1"), "Matrix B's Part Sale Matrix shows its Part Sale rules in short words in the same form as the Work Order Matrix column (for example \\"2 rules · cost + $, margin\\"), as in picture 6.2.")],
  pics=["6.2"], held_on="Q16", flags=DV)''',
 '''  [R([QD("Same as work orders", "6.2", "S6-R1"), S("S6-R1", "otherwise \\"Same as work orders\\"")], "Matrix A's Part Sale Matrix reads \\"Same as work orders\\" in gray.")
   + R([QD("2 rules · cost + $, margin", "6.2", "S6-R1"), S("S6-R1", "its rules in short when the matrix has separate Part Sale pricing")],
       "Matrix B's Part Sale Matrix shows its Part Sale rules in short words in the same form as the Work Order Matrix column (for example \\"2 rules · cost + $, margin\\"), as in picture 6.2.")],
  pics=["6.2"])'''),
# D-162 release, QuickBooks picker can be changed (answer 21)
('''   R(QL("8.3", "S8-R4"), "A grayed Pricing Matrix box reading General Matrix and a grayed Tax Exempt checkbox show under the title.",
     "The QuickBooks Products And Services picker shows in its usual style, as in picture 8.3.")],
  pics=["8.2", "8.3"], held_on="Q21", flags=DV)''',
 '''   R([QL("8.3", "S8-R4"), S("S8-R4", "its Pricing Matrix and Tax Exempt show grayed and can't be changed")],
     "A grayed Pricing Matrix box reading General Matrix and a grayed Tax Exempt checkbox show under the title, as in picture 8.3.")
   + R(S("S8-R4", "Only QuickBooks Products and Services can be changed (when QuickBooks is connected, as today)"),
       "The QuickBooks Products And Services picker is not grayed: it shows like any field that can be changed.")],
  pics=["8.2", "8.3"])'''),
# D-165 release
('''   R(QD("Create Category", "8.6", "S8-R10"), "Cancel and a blue \\"Create Category\\" button sit at the top right, with no Save button, as in picture 8.6.")],
  pics=["8.5", "8.6", "8.8"], held_on="Q19", flags=DV)''',
 '''   R([QD("Create Category", "8.6", "S8-R10"), S("S8-R10", "It has Cancel and Create Category in the page head, like New Tier and New Matrix")],
     "Cancel and a blue \\"Create Category\\" button sit at the top right, with no Save button, as in picture 8.6.")],
  pics=["8.5", "8.6", "8.8"])'''),
# D-143 breadcrumb
('''   R(S("S7-R6", "with the breadcrumb Settings › Categories › <category>"), "The breadcrumb reads Settings › Categories › and category A's name.")''',
 '''   R(S("S7-R6", "with the breadcrumb Categories › <category>"), "The breadcrumb reads Categories › and category A's name, with no Settings crumb before it.")'''),
# D-144 breadcrumb
('''   R(S("S7-R13", "the breadcrumb leads back to the category"), "Matrix A's page opens in edit; the breadcrumb reads Settings › Categories › category A's name › matrix A's name.")''',
 '''   R([S("S7-R13", "the breadcrumb leads back to the category"), S("S3-R26", "Categories › <category> › <matrix> from a category (Uncategorized included)")],
     "Matrix A's page opens in edit; the breadcrumb reads Categories › category A's name › matrix A's name.")'''),
# D-145 breadcrumb
('''   + look("7.13", "S7-R11", "The breadcrumb reads Settings › Categories › category A's name › New Matrix, with a large empty \\"Matrix name\\" field, Cancel and a blue Create Matrix, as in picture 7.13.")],''',
 '''   + R([QL("7.13", "S7-R11"), ''' + SET + '''], "The breadcrumb reads Categories › category A's name › New Matrix, starting at Categories with no Settings crumb.")
   + look("7.13", "S7-R11", "A large empty \\"Matrix name\\" field, Cancel and a blue Create Matrix show, as in picture 7.13.")],'''),
# D-164 breadcrumb and button name
('''  [CATEGORIES, "Click New Category.", "Click the blue button at the top right.", "Type a name no other category uses.", "Click the blue button at the top right."],''',
 '''  [CATEGORIES, "Click New Category.", "Click Create Category.", "Type a name no other category uses.", "Click Create Category."],'''),
('''   look("8.6", "S8-R10", "The breadcrumb reads Settings › Categories › New Category; a large empty name field with the placeholder \\"Category name\\" holds the cursor.",''',
 '''   R([QL("8.6", "S8-R10"), ''' + SET + '''], "The breadcrumb reads Categories › New Category, starting at Categories with no Settings crumb.")
   + look("8.6", "S8-R10", "A large empty name field with the placeholder \\"Category name\\" holds the cursor; Cancel and a blue Create Category sit at the top right.",'''),
# D-179 rewrite
('''C("D-179", K, "Design: Manage Customers columns move when the search narrows the list",
  [ADMIN_CUST, tier("A"), "Have a new customer for this test, customer A, named for example Quokka One, so the search finds one row.", W1440],
  [TIERS, open_tier("A"), CTAB, MANAGE, "Take a screenshot of the dialog.", "Type quokka in the search.", "Replace the search with zzz."],
  [look("9.4", "S9-R10", "The Tiers list shows tier A."), look("9.4", "S9-R10", "Tier A's page opens."), look("9.4", "S9-R10", "The Customers tab shows."), look("9.4", "S9-R10", "The dialog opens."),
   look("9.4", "S9-R10", "The screenshot shows the column headings."),
   look("9.12", "S9-R10", "Compared with the screenshot, the Work Order Tier and Part Sales Tier headings sit slightly further left, as pictures 9.4 and 9.12 show."),
   look("9.13", "S9-R10", "With no match, the Work Order Tier heading sits clearly further left than in the screenshot, as picture 9.13 shows.")],
  pics=["9.4", "9.12", "9.13"], held_on="Q31", flags=DV + ["movement"])''',
 '''C("D-179", K, "Design: Manage Customers columns keep their place as the search narrows",
  [ADMIN_CUST, tier("A"), "Have a new customer for this test, customer A, named for example Quokka One, so the search finds one row.", W1440],
  [TIERS, open_tier("A"), CTAB, MANAGE, "Take a screenshot of the dialog.", "Type quokka in the search.", "Replace the search with zzz."],
  [look("9.4", "S9-R10", "The Tiers list shows tier A."), look("9.4", "S9-R10", "Tier A's page opens."), look("9.4", "S9-R10", "The Customers tab shows."), look("9.4", "S9-R10", "The dialog opens."),
   look("9.4", "S9-R10", "The screenshot shows the column headings."),
   R(S("S9-R10", "Its search matches the customer's name"), "Customer A's row is listed.")
   + R([''' + R24 + ''', S("S19-R24", "a search narrowing a list"), ''' + NOMOVE + '''],
       "Compared with the screenshot, the Work Order Tier and Part Sales Tier headings keep their place and width: nothing moves sideways or down."),
   R(S("S9-N6", "a search with no match, on a tier's Customers tab or in Manage Customers: 'No customer matches \\"…\\".'"), "A no-match message shows.")
   + R([''' + R24 + ''', S("S19-R24", "an empty list"), ''' + NOMOVE + '''],
       "The headings still keep the same place and width as in the screenshot.")],
  pics=["9.4", "9.12", "9.13"], flags=["movement"])'''),
])
