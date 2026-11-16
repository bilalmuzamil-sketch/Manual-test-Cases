import sys; sys.path.insert(0, 'po-answers-2026-11-16/v38/patches'); from _p import patch
PS = 'S("S6-R1", "Part Sale Matrix (its rules in short when the matrix has separate Part Sale pricing, otherwise \\"Same as work orders\\")")'
patch('authoring/cases_s6.py', [
# S6-02
('''        "Matrix A's Work Order Matrix shows Default's rules in short words.",
        "Matrix A's Part Sale Matrix reads Off (it has no separate Part Sale side).")''',
 '''        "Matrix A's Work Order Matrix shows Default's rules in short words.")
   + R(''' + PS + ''', "Matrix A's Part Sale Matrix reads \\"Same as work orders\\" (it has no separate Part Sale pricing).")'''),
# S6-03
('''C("S6-03", K, "Part Sale Matrix column reads On once a matrix has its own Part Sale side",
  [ADMIN, matrix("A", ", pricing a new category made for this test, category A, with Separate Part Sale pricing off"), DESK],
  [MATRICES, open_matrix("A"), "Click the Part Sale Matrix tab.", "Turn on Separate Part Sale pricing.", MATRICES],
  [LIST("Matrix A's Part Sale Matrix reads Off."), R(S("S3-R21"), "Matrix A's page opens."),
   R(S("S3-R21"), "The tab shows the Separate Part Sale pricing switch, off."), R(S("S3-R21"), "The switch is on and the Part Sale grid shows."),
   R(S("S6-R1", "Part Sale Matrix (On or Off)"), "Matrix A's Part Sale Matrix now reads On.", "Its Work Order Matrix still shows Default's rules in short.")],''',
 '''C("S6-03", K, "Part Sale Matrix column shows the Part Sale rules once the side is separate",
  [ADMIN, matrix("A", ", pricing a new category made for this test, category A, with one cost range whose Default rule is Markup % 40, and Separate Part Sale pricing off"), DESK],
  [MATRICES, open_matrix("A"), "Click the Part Sale Matrix tab.", "Turn on Separate Part Sale pricing.", MATRICES],
  [R(''' + PS + ''', "Matrix A's Part Sale Matrix reads \\"Same as work orders\\".")
   + R(S("S6-R1", "Work Order Matrix (Default's rules in short)"), "Matrix A's Work Order Matrix reads 40% markup."),
   R(S("S3-R21"), "Matrix A's page opens."),
   R(S("S3-R21"), "The tab shows the Separate Part Sale pricing switch, off."),
   R(S("S3-R31", "Switching it on saves at once: the Part Sale side starts as a copy of the Work Order Matrix's current rules"), "The switch is on and the Part Sale grid shows, Default reading 40% markup."),
   R(''' + PS + ''', "Matrix A's Part Sale Matrix no longer reads \\"Same as work orders\\".",
     "It shows its Part Sale rules in short, 40% markup, the same words its Work Order Matrix shows.")],'''),
# S6-07
('''     "Matrix A's Tiers value lists 1 (Default) and its Part Sale Matrix reads On.")],''',
 '''     "Matrix A's Tiers value lists 1 (Default).")
   + R(''' + PS + ''', "Matrix A's Part Sale Matrix shows its Part Sale rules in short, not \\"Same as work orders\\".")],'''),
# S6-08: New Category's button (answer 19, S8-R10 v38)
('''  [MATRICES, CATEGORIES, "Click New Category.", "Type a name no other category uses.", SAVE, "Open Settings › Pricing.", MATRICES,''',
 '''  [MATRICES, CATEGORIES, "Click New Category.", "Type a name no other category uses.", "Click Create Category.", "Open Settings › Pricing.", MATRICES,'''),
('''   R(S("S8-R10", "a Pricing Matrix (the General Matrix unless another is picked)"), "The category is created on the General Matrix."),
   R(S("S6-R11"), "Settings › Pricing opens."),
   R(S("S6-R8", "where n counts those categories now, Uncategorized included"), "The General Matrix's count is one higher (for example 9 + 1 = 10)."),''',
 '''   R([S("S8-R10", "a Pricing Matrix (the General Matrix unless another is picked)"), S("S8-R10", "nothing is created until Create Category (S19-R14)")],
     "The category is created on the General Matrix."),
   R(S("S6-R11"), "Settings › Pricing opens."),
   R(S("S6-R8", "where n counts those categories now, Uncategorized included"), "The General Matrix's count is one higher (for example 9 + 1 = 10)."),'''),
])
