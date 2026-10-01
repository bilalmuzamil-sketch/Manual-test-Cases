# OBSERVED UI LABELS — DVI V2 on sv8181.qa.shopview.com · build v26.36.8-2a64085 · observed 2026-10-01
# RULE: a label enters here ONLY from a live probe with committed evidence (screenshot + text dump).
# Evidence dir: build/dvi-v2/build-verify-2026-10-01/

## Top nav
"Work Orders" · "Schedule" · "Customers" · "Parts" · "Reports"  (no top-level Inspections)

## Inspection Template builder  (route /inspection-templates/new · list under Settings → Service → "Inspection Templates")
Header: "Preview" · "Save Draft" · "Publish" · "Unsaved changes".
Left "OUTLINE": "Section 1" · "+ Add Section" · "TEMPLATE NAME" · "DESCRIPTION".
Template setting: "Require technician signature".
Starters: "Class 8 Tractor PM Inspection" · "DOT / Annual Federal Safety Inspection" · "Air-Brake Inspection" ·
  "Trailer Inspection" · "Light-Duty PM Inspection" · "Equipment starter". Else: "Or build from scratch".
Field row: "+ Add Field" · "+ Add Section". Field properties: "Field properties" · "LABEL" · "TYPE"
  (TYPE options: "Checkbox" · "Text" · "Measurement" · "Per axle" · "Photo") · "Instructions" ·
  "RESPONSE OPTIONS" · "RESPONSE SETTINGS" · "Include Monitor option".
A Checkbox field summarises as "Checkbox · OK / Monitor / Not OK / N/A".
# Evidence: template-builder-new.txt/png, field-editor-checkbox.txt/png

## Inspection results / filled inspection  (route /inspections/<uuid>; reached from a WO line's "Open ›")
Header: "Work order · v2" · the template name (e.g. "LOF Inspection") · status chip "Completed".
Lock banner: "Inspection completed & locked" · "Signed By <name>" · "WO Line Moved To Completed" · "PDF" (download).
ShopCoach banner: "ShopCoach can turn these N findings into work order lines with labor and parts. You review
  everything before it is added." + button **"Build lines"** (with a dropdown caret).
Left: "SECTIONS" · "N / M fields complete" · a section row with its name and "x/y" progress.
Body: "SECTION 1 OF 1 · <SECTION NAME>" · "Click any photo to view full size".
Each question card: the question LABEL · a response badge — **"OK" / "Monitor" / "Not OK" / "N/A"** · a type tag
  (e.g. "✓ CHECKBOX").
Footer: "Tech: <name>" · "Advisor: <name>" · "Started: <datetime>" · "Inspection locked · Completed <datetime>".
# 🔑 GLOSSARY ALIGNMENT for the cases: the build calls the findings→WO action **"Build lines"** (the cases say
#   "Add lines" / "build action" / "Built from inspection" — align step/precond wording to "Build lines"; the
#   Expected SUBSTANCE stays the source's words, Rule 114). Response badge is "Not OK" (two words).
# Evidence: inspection-results.png

## STILL TO OBSERVE
# "Build lines" draft flow (findings → WO lines: choose target WO / new WO, line source "Built from inspection") ·
# asset record "Inspections" tab + history ("View History Logs", "Inspection results", runs) · customer-facing
# report ("Require acknowledgement") · per-axle entry (Drum/Disc/Single/Dual, unit selector) · conditional
# follow-up on a checkbox · phone filling · roles editor exact labels.
