import sys; sys.path.insert(0, 'po-answers-2026-11-16/v38/patches'); from _p import patch
patch('authoring/cases_s12.py', [
('''  ["Sign in as an Admin whose role has 'See Financial Data' and 'Part Sales — Create & Edit'.", tier("A"), MX, PART, customer("A", ", on tier A for Part Sales"),
   "Have a new Part Sale for this test, Part Sale 1, for customer A, with part A added.", DESK],
  ["Open Part Sale 1.", "Point at part A's Priced by."],''',
 '''  ["Sign in as an Admin whose role has 'See Financial Data' and 'Part Sales — Create & Edit'.", tier("A"), MX[:-1] + ", and Separate Part Sale pricing off.", PART,
   customer("A", ", on tier A for Part Sales"), "Have a new Part Sale for this test, Part Sale 1, for customer A, with part A added.", DESK],
  ["Open Part Sale 1.", "Point at part A's Priced by."],'''),
('''   R(S("S12-R3", "hovering or focusing it opens the price details too"), "Part A's price details open, naming tier A and matrix A's Work Order Matrix side.")],
  pics=["12.4"])''',
 '''   R(S("S12-R3", "hovering or focusing it opens the price details too"), "Part A's price details open, naming tier A and matrix A.")
   + R(S("S12-R2", "on a Part Sale whose matrix has no separate Part Sale pricing, the side reads \\"Same as work orders\\""),
       "The matrix's side reads \\"Same as work orders\\", as matrix A has no separate Part Sale pricing.")],
  pics=["12.4"])'''),
])
patch('authoring/cases_s16.py', [
('''  ["Open Settings › Pricing.", CATEGORIES, "Click New Category.", "Type a name no other category uses.", SAVE],''',
 '''  ["Open Settings › Pricing.", CATEGORIES, "Click New Category.", "Type a name no other category uses.", "Click Create Category."],'''),
('''  [CATEGORIES, "Click New Category.", "Type a name no other category uses.", SAVE, CATEGORIES, "Click category A's row.", "Click the category name at the top of the page.",''',
 '''  [CATEGORIES, "Click New Category.", "Type a name no other category uses.", "Click Create Category.", CATEGORIES, "Click category A's row.", "Click the category name at the top of the page.",'''),
])
patch('authoring/cases_inv_a.py', [
('''  [CATEGORIES, "Click New Category.", "Type category A's name in capitals.", SAVE, "Replace the name with ab.", SAVE],''',
 '''  [CATEGORIES, "Click New Category.", "Type category A's name in capitals.", "Click Create Category.", "Replace the name with ab.", "Click Create Category."],'''),
])
