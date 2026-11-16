import sys; sys.path.insert(0, 'po-answers-2026-11-16/v38/patches'); from _p import patch
R24 = 'S("S19-R24", "Columns and fields keep their place and width when a screen changes state")'
NOMOVE = 'S("S19-R24", "Nothing moves sideways or down.")'
A31 = 'QA("Columns and boxes keep their place: nothing moves sideways or down", 31, "S19-R24")'
def src(state): return f'[{R24}, S("S19-R24", "{state}"), {NOMOVE}, {A31}]'
patch('authoring/cases_design_batch_b.py', [
('''from tp_lib import C, R, B, S, QP, QD, QT, QL, HOLD''', '''from tp_lib import C, R, B, S, QP, QD, QT, QL, QA, HOLD'''),
('''C("D-450", K, "Design: Sales by Tier columns move when a row is opened",''', '''C("D-450", K, "Design: Sales by Tier columns keep their place when a row opens",'''),
('''   R(QL("20.4", "RPT-S2-R2"), "Compared with the first screenshot, Priced By widens and the number columns move right by about 60-95 pixels, as pictures 20.3 and 20.4 show against 20.2.")],
  pics=["20.2", "20.3", "20.4"], held_on="Q31", flags=["design-version", "movement"])''',
 '''   R(''' + src("a row opening or closing") + ''', "Compared with the first screenshot, Priced By and the number columns keep their place and width: nothing moves sideways or down.")
   + R(S("RPT-S2-R2"), "Customer A's invoices show under customer A's row.")],
  pics=["20.2", "20.3", "20.4"], flags=["movement"])'''),
('''C("D-451", K, "Design: Sales by Tier headings move on the empty states",''', '''C("D-451", K, "Design: Sales by Tier headings keep their place on the empty states",'''),
('''   R(QL("20.23", "RPT-S3-N1"), "Compared with the first screenshot, the headings sit about 20-36 pixels further left, as picture 20.23 shows against 20.2.")],
  pics=["20.2", "20.23", "20.11"], held_on="Q31", flags=["design-version", "movement"])''',
 '''   R(''' + src("an empty list") + ''', "Compared with the first screenshot, the headings keep their place and width: nothing moves sideways or down.")
   + R(S("RPT-S3-N1", "show \\"No record matches these filters\\""), "The no-match message \\"No record matches these filters\\" shows under the headings.")],
  pics=["20.2", "20.23", "20.11"], flags=["movement"])'''),
('''C("D-452", K, "Design: Sales by Category columns move when a category opens",''', '''C("D-452", K, "Design: Sales by Category columns keep their place when a category opens",'''),
('''   R(QL("20.17", "RPT-S5-R2"), "Compared with the first screenshot, Category widens and the number columns move right by about 5-10 pixels, as picture 20.17 shows against 20.16.")],
  pics=["20.16", "20.17"], held_on="Q31", flags=["design-version", "movement"])''',
 '''   R(''' + src("a row opening or closing") + ''', "Compared with the first screenshot, Category and the number columns keep their place and width: nothing moves sideways or down.")
   + R(S("RPT-S5-R2", "A category opens to its Priced By rows"), "Category A's Priced By rows show under it.")],
  pics=["20.16", "20.17"], flags=["movement"])'''),
('''C("D-453", K, "Design: the lines table's columns move while Quick Add is open",''', '''C("D-453", K, "Design: the lines table's columns keep their place while Add Part is open",'''),
('''   R(QL("10.6", "S10-R1"), "The Quick Add row opens."),
   R(QL("10.6", "S10-R1"), "Compared with the first screenshot, Name/Description narrows and Actual/Estimate, Progress, Status, Action and Rate move left by about 20-70 pixels, as pictures 10.6, 10.7 and 10.9 show against 10.5."),
   R(QL("10.5", "S10-R1"), "The Quick Add row closes."),
   R(QL("10.5", "S10-R1"), "The headings are back in the same place as the first screenshot.")],
  pics=["10.5", "10.6", "10.7", "10.9"], held_on="Q31", flags=["design-version", "movement"])''',
 '''   R(QL("10.6", "S10-R1"), "The Add Part row opens under line 1."),
   R(''' + src("the Add Part row opening") + ''', "Compared with the first screenshot, Name/Description, Actual/Estimate, Progress, Status, Action and Rate keep their place and width: nothing moves sideways or down.")
   + R(QL("10.6", "S10-R1"), "The Add Part row shows its boxes under line 1."),
   R(QL("10.5", "S10-R1"), "The Add Part row closes."),
   R(''' + src("a row opening or closing") + ''', "The headings are in the same place as the first screenshot.")],
  pics=["10.5", "10.6", "10.7", "10.9"], flags=["movement"])'''),
('''C("D-454", K, "Design: the filter chips shift left as a picked chip widens",''', '''C("D-454", K, "Design: the filter chips keep their place as a picked chip changes",'''),
('''   R(QL("20.9", "RPT-S3-R12"), "Compared with the first screenshot, the Date and Sales Type chips sit further left (Date by about 90 pixels), as picture 20.9 shows against 20.2.")],
  pics=["20.2", "20.9"], held_on="Q31", flags=["design-version", "movement"])''',
 '''   R(''' + src("a filter chip changing") + ''', "Compared with the first screenshot, the Date and Sales Type chips keep their place: nothing moves sideways or down.")
   + R(QL("20.9", "RPT-S3-R12"), "The Sales Type chip still reads Sales Type: Work Orders.")],
  pics=["20.2", "20.9"], flags=["movement"])'''),
])
patch('authoring/cases_rpt.py', [
('''   + R(QD("Priced By: All", "20.20", "RPT-S4-R7"), "The Priced By line comes after the Category line (picture 20.20 shows the two the other way round).")],
  pics=["20.20"], held_on="Q30")''',
 '''   + R(QD("Priced By: All", "20.20", "RPT-S4-R7"), "The Priced By line comes after the Category line (picture 20.20 shows the two the other way round).")],
  pics=["20.20"])'''),
])
