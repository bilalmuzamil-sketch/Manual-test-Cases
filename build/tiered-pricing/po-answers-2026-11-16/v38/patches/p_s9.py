import sys; sys.path.insert(0, 'po-answers-2026-11-16/v38/patches'); from _p import patch
CH = 'S("S9-R9", "Work orders lists customers on the tier for work orders only, Part Sales for Part Sales only, and Both for both, so each customer matches one option")'
patch('authoring/cases_s9.py', [
('''The channel filter's options follow the PRD (Work orders, Part Sales, Both); the design's "Sales Type" rows are a held design case (Q22).''',
 '''The channel filter's options follow the PRD (Work orders, Part Sales, Both); PRD v38 S9-R9 (Matt Barge's answer 22, 16 Nov 2026) says each
option lists the customers on the tier for exactly that channel, so each customer matches one option (S9-26, S9-39).'''),
('''   R(S("S9-R9", "a channel filter (Work orders, Part Sales, Both)"), "Customer C is listed.", "Customer B (on tier A for work orders, Default for Part Sales) is hidden.")],
  pics=["9.1", "9.3"])''',
 '''   R(''' + CH + ''', "Customer C (on tier A for Part Sales only) is listed.", "Customer B (on tier A for work orders, Default for Part Sales) is hidden.",
     "Customer A (on tier A for work orders and Part Sales) is hidden: it matches Both, not Part Sales.")],
  pics=["9.1", "9.3"])

C("S9-39", K, "The Work orders and Both filters list only customers on exactly that channel",
  [ADMIN_CUST, tier("A"), onA("A", "tier A", "tier A"), onA("B", "tier A", "Default"), onA("C", "Default", "tier A"), DESK],
  [TIERS, open_tier("A"), CTAB, "Open the channel filter.", "Pick Work orders.", "Open the channel filter.", "Pick Both."],
  [R(S("S9-R9"), "The Tiers list shows tier A."), R(S("S9-R9"), "Tier A's page opens."), R(S("S9-R9"), "The tab lists customers A, B and C."),
   R(S("S9-R9", "a channel filter (Work orders, Part Sales, Both)"), "The filter offers Work orders, Part Sales and Both."),
   R(''' + CH + ''', "Customer B (on tier A for work orders, Default for Part Sales) is listed.",
     "Customers A and C are hidden: A is on tier A for both channels, C for Part Sales only."),
   R(S("S9-R9", "a channel filter (Work orders, Part Sales, Both)"), "The filter offers Work orders, Part Sales and Both."),
   R(''' + CH + ''', "Customer A (on tier A for work orders and Part Sales) is listed.", "Customers B and C are hidden: each is on tier A for one channel only.")],
  pics=["9.1", "9.3"])'''),
])
