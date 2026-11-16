import sys; sys.path.insert(0, 'po-answers-2026-11-16/v38/patches'); from _p import patch
patch('authoring/cases_s2.py', [
# S2-31 (quote only; tester text unchanged): S2-R30 v38
('''   R(S("S2-R30", "If no tier follows it, the question is just \\"Archive <tier>?\\" (or \\"Delete <tier>?\\") with the same last line."),
     "A dialog titled \\"Archive\\" followed by tier A's name and \\"?\\" opens.", "Its only text reads \\"Parts already on work orders keep their prices.\\"", "Its buttons are Cancel and Archive."),''',
 '''   R([S("S2-R30", "If no tier follows it, the question is just \\"Archive <tier>?\\" or \\"Delete <tier>?\\" with its own last line."),
      S("S2-R30", "Archive says \\"Parts already on work orders keep their prices.\\"")],
     "A dialog titled \\"Archive\\" followed by tier A's name and \\"?\\" opens.", "Its only text reads \\"Parts already on work orders keep their prices.\\"", "Its buttons are Cancel and Archive."),'''),
# S2-32 (quote only)
('''   + R(S("S2-R30", "After the list: \\"Parts already on work orders keep their prices.\\""), "After the list the dialog reads \\"Parts already on work orders keep their prices.\\"")],''',
 '''   + R(S("S2-R30", "After the list, Archive says \\"Parts already on work orders keep their prices.\\""), "After the list the dialog reads \\"Parts already on work orders keep their prices.\\"")],'''),
# S2-35: Delete says "This can't be undone." (answer 2, PRD v38 S2-R30)
('''  [ADMIN, tier("A", " with no customers that has priced no line"), matrix("A"), DESK],
  [TIERS, "Open tier A's three-dot menu on the Tiers list.", "Click Delete.", "Click Delete in the dialog.", MATRICES, open_matrix("A")],
  [R(S("S2-R14"), "Tier A is listed."), R(S("S2-R26"), "Delete can be clicked (not grayed)."),
   R(S("S2-R30", "Archive and Delete ask first."), "A dialog titled \\"Delete\\" followed by tier A's name and \\"?\\" opens.", "It reads \\"Parts already on work orders keep their prices.\\"", "Its buttons are Cancel and Delete."),''',
 '''  [ADMIN, tier("A", " with no customers that has priced no line; no tier uses Same as previous tier after it (make tier A the last tier)"), matrix("A"), DESK],
  [TIERS, "Open tier A's three-dot menu on the Tiers list.", "Click Delete.", "Click Delete in the dialog.", MATRICES, open_matrix("A")],
  [R(S("S2-R14"), "Tier A is the last active tier."), R(S("S2-R26"), "Delete can be clicked (not grayed)."),
   R([S("S2-R30", "If no tier follows it, the question is just \\"Archive <tier>?\\" or \\"Delete <tier>?\\" with its own last line."),
      S("S2-R30", "Delete says \\"This can't be undone.\\"")],
     "A dialog titled \\"Delete\\" followed by tier A's name and \\"?\\" opens.", "Its only text reads \\"This can't be undone.\\"")
   + R(S("S2-R30", "After the list, Archive says \\"Parts already on work orders keep their prices.\\" and Delete says \\"This can't be undone.\\""),
       "The line \\"Parts already on work orders keep their prices.\\" is not in this dialog.")
   + R(S("S2-R30", "Buttons: Cancel and Archive (or Delete)."), "Its buttons are Cancel and Delete."),'''),
# S2-53 breadcrumb (answer 1, PRD v38 S2-R28)
('''   R(S("S2-R28", "Clicking an active or archived tier's row on the Tiers list opens its page on the Pricing tab, never a dialog, with the breadcrumb Settings › Pricing › Tiers › <tier>"),
     "A page opens, not a dialog, on the Pricing tab.", "The breadcrumb reads Settings › Pricing › Tiers › and tier A's name.")''',
 '''   R(S("S2-R28", "Clicking an active or archived tier's row on the Tiers list opens its page on the Pricing tab, never a dialog, with the breadcrumb Pricing › Tiers › <tier>"),
     "A page opens, not a dialog, on the Pricing tab.", "The breadcrumb reads Pricing › Tiers › and tier A's name, starting at Pricing with no Settings crumb before it.")'''),
# S2-54
('''  [R(S("S2-R28", "with the breadcrumb Settings › Pricing › Tiers › <tier>, also when opened from a link or bookmark"),
     "Tier A's page opens on the Pricing tab.", "The breadcrumb reads Settings › Pricing › Tiers › and tier A's name.")],''',
 '''  [R(S("S2-R28", "with the breadcrumb Pricing › Tiers › <tier>, also when opened from a link or bookmark"),
     "Tier A's page opens on the Pricing tab.", "The breadcrumb reads Pricing › Tiers › and tier A's name, starting at Pricing with no Settings crumb before it.")],'''),
# S2-58
('''   + R(S("S3-R26", "Settings › Pricing › Tiers › <tier> › <matrix> from a tier"), "The breadcrumb reads Settings › Pricing › Tiers › tier A's name › matrix A's name.")],''',
 '''   + R(S("S3-R26", "Pricing › Tiers › <tier> › <matrix> from a tier"), "The breadcrumb reads Pricing › Tiers › tier A's name › matrix A's name, starting at Pricing.")],'''),
])
