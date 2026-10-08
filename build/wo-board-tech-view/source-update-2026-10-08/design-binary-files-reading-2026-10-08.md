# Design export — binary files read in full, 8 October 2026 (QA lead: "1. Read")

| File(s) | How read | Content | For the cases |
|---|---|---|---|
| 36 fonts `_ds/…/fonts/Inter_18pt-*.ttf`, `Inter_28pt-*.ttf` | every font's name table and glyph count, by script (fontTools) | Inter 4.001 (git-66647c0bb), 18 pt and 28 pt optical sizes, Thin to Black, roman and italic; 2,926 glyphs (roman) / 2,890 (italic); © The Inter Project Authors, SIL Open Font License | No screen content. Typeface only; no case asserts a font |
| `assets/avatars/{aaron,danny,jackie,mia}.png` (identical to the 4 in `uploads/`, md5-checked) | each image viewed in full | stock photos of technicians (cap, headphones, hard hat, plaid shirt); no text | The design shows a technician's photo where one exists and initials otherwise (thumbnail: "Esther Howard" photo, "TW"/"KW"/"JW" initials). Cases on lead-technician avatars and the line-technician avatar group already describe "photo or initials" (Story 7) |
| `.thumbnail` | viewed | the List screen: All / Work Orders / Estimates / Completed tabs, Search, Status, Assigned to me, Asset on site, the Columns and display controls, New Work Order, rows with On Site, Status, Waiting On Parts, Number, Customer, Unit #, Asset, VIN/Serial #, Progress, Lead Technician | Labels already used by the cases |
