import sys; sys.path.insert(0, 'po-answers-2026-11-16/v38/patches'); from _p import patch
CC = 'S("S8-R10", "It has Cancel and Create Category in the page head, like New Tier and New Matrix")'
patch('authoring/cases_s8.py', [
('''New Category's buttons follow the PRD ("Save and Cancel"; the design writes "Create Category", held on Q19). The delete question follows the
PRD's full wording (the design drops one sentence, held on Q20).''',
 '''New Category's buttons are Cancel and Create Category (PRD v38 S8-R10, Matt Barge's answer 19, 16 Nov 2026). Uncategorized's page: Pricing Matrix
and Tax Exempt grayed, only QuickBooks Products and Services can be changed (v38 S8-R4, answer 21). The delete question follows the PRD's full
wording (answer 20: the PRD stays).'''),
# S8-02
('''   + R(S("S8-R10", "It has Save and Cancel"), "Save and Cancel show at the top right.")],''',
 '''   + R(''' + CC + ''', "Cancel and Create Category show in the page head, at the top right.")],'''),
# S8-03
('''C("S8-03", K, "New Category creates nothing until Save, and Cancel creates nothing",''',
 '''C("S8-03", K, "New Category creates nothing until Create Category, and Cancel nothing",'''),
('''   R(S("S8-R10", "nothing is created until Save (S19-R14)"), "The Categories list shows again.", "The count is still the noted number (17 = 17) and the typed name is not listed.")],''',
 '''   R(S("S8-R10", "nothing is created until Create Category (S19-R14)"), "The Categories list shows again.", "The count is still the noted number (17 = 17) and the typed name is not listed.")],'''),
# S8-04
('''  [CATEGORIES, "Click New Category.", "Type a name no other category uses.", SAVE, CATEGORIES],
  [R(S("S8-R10"), "The Categories list shows."), R(S("S8-R10"), "The New Category page opens."), R(S("S8-R10"), "The name shows in the field."),
   R(S("S8-R10", "It has Save and Cancel"), "The category is created and its page shows the General Matrix's grid."),''',
 '''  [CATEGORIES, "Click New Category.", "Type a name no other category uses.", "Click Create Category.", CATEGORIES],
  [R(S("S8-R10"), "The Categories list shows."), R(S("S8-R10"), "The New Category page opens."), R(S("S8-R10"), "The name shows in the field."),
   R([''' + CC + ''', S("S8-R10", "nothing is created until Create Category (S19-R14)")], "The category is created and its page shows the General Matrix's grid."),'''),
# S8-06 rewritten (answer 21, S8-R4 v38)
('''C("S8-06", K, "Uncategorized's page is read-only with a link to the General Matrix",
  [ADMIN, DESK],
  [CATEGORIES, "Click Uncategorized's row.", "Point at the grayed Edit."],
  [R(S("S8-R4"), "Uncategorized is the first row, on the General Matrix."),
   R(S("S8-R4", "Its page is read-only, with no rename, Delete or matrix picker."), "Uncategorized's page opens with the General Matrix's grid.",
     "Its title cannot be clicked to rename it.", "The page offers no Delete and no Pricing Matrix picker.")
   + R(S("S8-R4", "Its Edit is grayed with a link to the General Matrix, like any category on a shared matrix (S7-R13)."), "Edit is grayed, with a \\"Go to the General Matrix\\" link beside it."),
   R(S("S7-R13", "\\"The General Matrix prices <n> categories, …\\""), "A tooltip starts \\"Can't edit here. The General Matrix prices\\".")],
  pics=["8.2", "8.3"])''',
 '''C("S8-06", K, "Uncategorized's page is read-only with a link to the General Matrix",
  [ADMIN, DESK],
  [CATEGORIES, "Click Uncategorized's row.", "Click the Pricing Matrix box.", "Click the Tax Exempt checkbox.", "Point at the grayed Edit."],
  [R(S("S8-R4"), "Uncategorized is the first row, on the General Matrix."),
   R(S("S8-R4", "Its page is read-only: no rename and no Delete"), "Uncategorized's page opens with the General Matrix's grid.",
     "Its title cannot be clicked to rename it.", "The page offers no Delete.")
   + R(S("S8-R4", "its Pricing Matrix and Tax Exempt show grayed and can't be changed"), "The Pricing Matrix box shows, grayed, reading General Matrix.",
       "The Tax Exempt checkbox shows, grayed.")
   + R(S("S8-R4", "Its Edit is grayed with a link to the General Matrix, like any category on a shared matrix (S7-R13)."), "Edit is grayed, with a \\"Go to the General Matrix\\" link beside it."),
   R(S("S8-R4", "its Pricing Matrix and Tax Exempt show grayed and can't be changed"), "No matrix list opens; the box still reads General Matrix, grayed."),
   R(S("S8-R4", "its Pricing Matrix and Tax Exempt show grayed and can't be changed"), "The checkbox keeps the state it showed before the click, grayed."),
   R(S("S7-R13", "\\"The General Matrix prices <n> categories, …\\""), "A tooltip starts \\"Can't edit here. The General Matrix prices\\".")],
  pics=["8.2", "8.3"])

C("S8-13", K, "Uncategorized's QuickBooks Products and Services can be changed",
  [ADMIN, "Use a client connected to QuickBooks, so the QuickBooks Products and Services field shows.",
   "Note Uncategorized's QuickBooks Products and Services item (item P) and pick another item the client's QuickBooks has (item Q).", DESK],
  [CATEGORIES, "Click Uncategorized's row.", "Pick item Q in QuickBooks Products and Services.", RELOAD, "Pick item P in QuickBooks Products and Services."],
  [R(S("S8-R4"), "Uncategorized is the first row."),
   R(S("S8-R4", "its Pricing Matrix and Tax Exempt show grayed and can't be changed"), "Uncategorized's page opens; Pricing Matrix and Tax Exempt show grayed.")
   + R(S("S8-R4", "Only QuickBooks Products and Services can be changed (when QuickBooks is connected, as today)"),
       "QuickBooks Products and Services shows item P and can be clicked (it is not grayed)."),
   R(S("S7-R12", "The name, the QuickBooks Products and Services mapping, Tax Exempt and the Pricing Matrix pick each save as soon as they are changed (S7-R9)."),
     "QuickBooks Products and Services shows item Q, with no Save button needed."),
   R(S("S8-R4", "Only QuickBooks Products and Services can be changed (when QuickBooks is connected, as today), so a client can book Uncategorized to a specific P&L account."),
     "After the reload, QuickBooks Products and Services still shows item Q.", "Pricing Matrix still reads General Matrix, grayed."),
   R(S("S7-R12"), "QuickBooks Products and Services shows item P again, as it was before the test.")],
  pics=["8.3"])'''),
# S8-12
('''   CATEGORIES, "Click New Category.", "Type ab.", SAVE],''',
 '''   CATEGORIES, "Click New Category.", "Type ab.", "Click Create Category."],'''),
])
patch('authoring/cases_s7.py', [
('''     "The breadcrumb reads Settings › Categories › and category A's name.")''',
 '''     "The breadcrumb reads Categories › and category A's name, starting at Categories with no Settings crumb before it.")'''),
])
