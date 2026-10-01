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

## Build lines menu (ShopCoach findings → WO lines)  — Evidence: build-lines-flow.png
Clicking "Build lines" opens a menu headed "BUILD THE LINES ON" with the target options:
  - "A new work order" — subtitle "Seeded with this customer & unit"
  - (when the inspection's own WO is still open/eligible, an "add to the open work order" / "This work order"
    option also appears — this run's WO is Paid, so only "A new work order" showed.)
# Alignment: cases say "create a new work order" / "add to the open work order" / "add lines to the open work
#   order" — the build's menu is "BUILD THE LINES ON" → "A new work order". The build action button is "Build lines".

## ShopCoach line-builder draft (after choosing a build target)  — Evidence: build-lines-draft.png
Choosing "A new work order" creates a WO (seeded with the inspection's customer & unit) and opens the draft on
its Lines tab: panel "SHOPCOACH LINE BUILDER" · "Drafting lines from N findings" + the inspection name & datetime ·
columns "Title" / "Description" / "Labor" / "Parts" (checkbox per drafted line) · "Cancel" · footer
"Nothing is added until you press Add Lines." · confirm button **"Add Lines"**. (Lines draft asynchronously — AI.)
# Alignment: build confirm action is "Add Lines"; cases' "Lines added" / "3 lines added" are post-confirm states.
# NOTE (Rule 107): this created a throwaway Estimate WO (S8181-17..) on the disposable branch — harmless.

## Asset record → Inspections tab  (route /customers/vehicle/<uuid>)  — Evidence: asset-inspections-tab.png
Asset record tabs: "Work Orders" · "Invoices (N)" · "Notes" · "Inspections" (also a "Service"/"History" area).
Inspections tab subtitle: "N of M have findings with no lines yet".
Table columns: "Inspection" (name + version) · "Status" (e.g. "Completed") · "Completed" (date) · "Technician" ·
  "Issues" (badge e.g. "5 Not OK") · "Work Order" (number + state) · "Report" ("PDF") · "Action".
"SHOPCOACH ASSET HISTORY" panel: "Asset History" · a question box ("e.g. when did we work on the turbo?") · "View All History".
# Alignment: cases say "View History Logs" / "Inspection results" / "runs" — build uses "Inspections" tab,
#   the "Issues" column with "N Not OK", and "SHOPCOACH ASSET HISTORY → View All History".

## Roles & Permissions editor  (route /administration/roles-permissions → edit a role)  — Evidence: roles-editor.png
Group "Work orders": "View" · "Create & Edit" · "Delete" (plus more rows).
Group "Work order lines": "Create & Edit" · "Delete" · "View".
Group "Customers": "View" · "Create & Edit" · "Delete".
"See Financial Data" present. No standalone "Inspections" permission group observed (inspections ride on
Work order lines / Work orders perms; "Inspection Templates" is a Settings area, not a role atom).
# Alignment: cases write role perms as "Work Orders - Create & Edit" / "Work Order Lines - Create & Edit" /
#   "Customers - View" (hyphen AND em-dash variants). Build = the "Work orders" / "Work order lines" / "Customers"
#   GROUP + its "Create & Edit"/"View" toggle. Align case precond/step wording to the build group + toggle.

## Field properties → RESPONSE SETTINGS (full)  — Evidence: field-response-settings.txt
"Include Monitor option" · "Add follow-up to a response" · "Required to complete" · "Photo required" ·
"Photo required if Not OK" · "Note required if Monitor / Not OK".
"GENERAL REFERENCE FILE" section: "Attach File" (+ helper "Save the draft before attaching a file.").
# These confirm the cases' exact labels: "Note required if Monitor / Not OK", "Photo required if Not OK",
#   "Attach File", "General reference file", "Add follow-up to a response" — all present on the build as written.
