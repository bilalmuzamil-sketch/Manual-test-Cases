import sys; sys.path.insert(0, 'po-answers-2026-11-16/v38/patches'); from _p import patch
patch('authoring/cases_s7.py', [
('''   R(S("S7-R6", "Clicking anywhere on a category's row opens its page, never a dialog, with the breadcrumb Settings › Categories › <category>."),
     "Category A's page opens as a page, not a dialog.", "The breadcrumb reads Settings › Categories › and category A's name.")''',
 '''   R(S("S7-R6", "Clicking anywhere on a category's row opens its page, never a dialog, with the breadcrumb Categories › <category>."),
     "Category A's page opens as a page, not a dialog.", "The breadcrumb reads Categories › and category A's name, starting at Categories with no Settings crumb before it.")'''),
])
