# -*- coding: utf-8 -*-
import importlib.util
spec=importlib.util.spec_from_file_location("pl_lib","build/founder-mode/part-lifecycle/pl_lib.py")
L=importlib.util.module_from_spec(spec); spec.loader.exec_module(L)
Q=L.Q
def src(n,title): return (f'Epic SV-10647; "Parts Lifecycle Update" PRD (Confluence 829227015, IN REVIEW 2026-09-09), Story {n} ({title}); '
    f'design canvas Vz6rprcWyP16tYxzM1kdeE; read 30 Sep 2026.')
LIBPG='You are on the Parts -> Part Library page on the build under test, with "Part Library & Inventory - Create & Edit".'
EDITPG='You are editing an existing inventory part via the Edit Inventory Part dialog, with "Part Library & Inventory - Create & Edit".'

S11=[
{"anchors":["S11-R1","S11-R2"],"title":"The Part Library page has no create control (New Catalog Part removed)",
 "pre":[LIBPG],
 "steps":['Read the Part Library toolbar and confirm there is no control that creates a library entry (the "New Catalog Part" button is gone).','Confirm no create-a-library-entry dialog can be reached from the page.'],
 "results":['The Part Library page has no control that creates a library entry - the "New Catalog Part" button is removed from its toolbar - and no create dialog is reachable from the page.'],
 "source":src(11,"Part Library browse & edit only"),"quotes":Q("S11-R1","S11-R2")},
{"anchors":["S11-R3","S11-R4","S11-R5"],"title":"Part Library browse/edit behaviours are unchanged",
 "pre":[LIBPG],
 "steps":['Click a row and confirm it opens that library part\'s detail page where it can still be edited and deleted.','Confirm row selection and the bulk "Set category" action still work.','Confirm search, filtering, sorting and the column set are unchanged.'],
 "results":['Clicking a row opens that library part\'s detail page (edit and delete still available); row selection and the bulk "Set category" action are unchanged; search, filtering, sorting and the column set are unchanged.'],
 "source":src(11,"Part Library browse & edit only"),"quotes":Q("S11-R3","S11-R4","S11-R5")},
{"anchors":["S11-R6","S11-R7","S11-N1"],"title":"Library entries only created by find-or-create; toolbar role-independent",
 "pre":[LIBPG],
 "steps":['Confirm new library entries are created only by find-or-create against a part number (creating an inventory part, a part request, a delivery receipt, a core charge, the parts CSV import, the public API).','Confirm there is no interface route that produces a library entry with nothing behind it.','Compare the toolbar seen by a user with the create-and-edit setting and one without it.'],
 "results":['Every new library entry is created by find-or-create against a part number (inventory part, part request, delivery receipt, core charge, parts CSV import, public API), and there is no interface route that produces a library entry with no inventory part, part request, delivery receipt, core charge or import row behind it.',
   'Because the toolbar no longer holds a create control, a user with the create-and-edit setting and a user without it see the same Part Library toolbar.'],
 "source":src(11,"Part Library browse & edit only"),"quotes":Q("S11-R6","S11-R7","S11-N1")},
{"anchors":["S11-E1","S11-E2","S11-E3"],"title":"Existing orphan library entries are preserved, still editable and linkable",
 "pre":[LIBPG,'A library entry that has no inventory part behind it already exists.'],
 "steps":['Confirm existing entries (including ones nothing references) stay in the list and are not deleted or hidden.','Open such an orphan entry\'s detail page and edit it.','Create a new inventory part with that entry\'s number and confirm it links to the existing entry; confirm the public API create endpoint is unchanged.'],
 "results":['Library entries that already exist stay in the list, including ones nothing references (this spec does not delete or hide them); an orphan entry is still editable from its detail page and is still the entry a later part with that number links to.',
   'The public API create endpoint is a separate integration surface and is not changed by the removal of the standalone create.'],
 "source":src(11,"Part Library browse & edit only"),"quotes":Q("S11-E1","S11-E2","S11-E3")},
]

S12=[
{"anchors":["S12-R1","S12-R2","S12-R3"],"title":"Catalog renamed to Part Library in the menu, page title and edit dialog",
 "pre":['You are on the build under test with access to the Parts area.'],
 "steps":['Read the Parts left-menu entry.','Open that screen and read the page title.','Open the dialog for editing a library entry and read its title.'],
 "results":['The Parts left-menu entry reads "Part Library" (was "Catalog"); the page title on that screen reads "Part Library" (was "Catalog").',
   'The dialog for editing a library entry is titled "Edit Library Part" (was "Edit Catalog Part"); the "New Catalog Part" create title is gone with the control itself.'],
 "source":src(12,"Rename Catalog to Part Library"),"quotes":Q("S12-R1","S12-R2","S12-R3")},
{"anchors":["S12-R4","S12-R5","S12-R10"],"title":"Save-failure, delete-success and lookup-source text read Part Library",
 "pre":['You are on the build under test with access to the Part Library and a work order.'],
 "steps":['Trigger a save failure on a library entry and read the message.','Delete a library entry and read the success message.','On a work order part lookup, read the source label of a result that comes from the shared list.'],
 "results":['The save-failure message reads "Failed to save library part." (was "...catalog part."); the delete-success message reads "Library part deleted successfully." (was "Catalog part...").',
   'A part lookup result from the shared list shows its source as "Part Library" (was "Catalog").'],
 "source":src(12,"Rename Catalog to Part Library"),"quotes":Q("S12-R4","S12-R5","S12-R10")},
{"anchors":["S12-R6","S12-R7","S12-R8","S12-R9"],"title":"Roles & Permissions wording renamed from Catalog to Part Library",
 "pre":['You are on Administration -> Roles & Permissions -> Edit Role, on the build under test.'],
 "steps":['Read the permission group title and its description.','Read the Parts Department card description above that group.','Read the three permission labels in that group.'],
 "results":['The permission group is titled "Part Library and Inventory" (was "Catalog and Inventory") with description "Manage the parts library and inventory levels." (was "...catalog..."); the Parts Department card reads "Manage parts inventory, part library, sales, and vendor operations." (was "...catalog...").',
   'The three labels read "Part Library & Inventory - View / Create & Edit / Delete" (were "Catalog & Inventory - ...").'],
 "source":src(12,"Rename Catalog to Part Library"),"quotes":Q("S12-R6","S12-R7","S12-R8","S12-R9")},
{"anchors":["S12-N1","S12-N2","S12-N3"],"title":"The rename is display-only: no permission, URL or stored-data change",
 "pre":['You are on the build under test.'],
 "steps":['Compare every user\'s access on release day to the day before.','Open an existing bookmark / saved link to the Part Library page.','Confirm no stored data is renamed - only on-screen text changed.'],
 "results":['No permission is added, removed or re-keyed (every user\'s access is identical to the day before); the Part Library page address does not change so an existing bookmark still resolves.',
   'No stored data is renamed - the change is confined to text a user reads on screen.'],
 "source":src(12,"Rename Catalog to Part Library"),"quotes":Q("S12-N1","S12-N2","S12-N3")},
]

S13=[
{"anchors":["S13-R1","S13-R2","S13-R3"],"title":"Edit dialog shows the part number as text with a status pill and edit button",
 "pre":[EDITPG],
 "steps":['Read the top of the dialog: the "Part Number" label row, the status badge beside it, and the part number below.','Read the status pill wording and colour on an active part and on an inactive part.','Find the edit button beside the number and note its icon, tooltip and alignment.'],
 "results":['The part number is shown as text (not an input): a "Part Number" label row followed by the status badge, and under it the part number in bold 18px text with an edit button beside it.',
   'The status badge is a rounded pill reading "Active" (green) on an active part and "Inactive" (grey) on an inactive one; the edit button is a blue 24px square-and-pen icon with no tooltip, screen-reader label "Edit part number", vertically centred on the number.'],
 "source":src(13,"Edit the part number of an existing part"),"quotes":Q("S13-R1","S13-R2","S13-R3")},
{"anchors":["S13-R4","S13-R5","S13-R6","S13-R7"],"title":"The edit button opens an inline field with Cancel/Confirm and a hint",
 "pre":[EDITPG],
 "steps":['Click the edit button and read what replaces the label row (the "Part Number" field with the current number focused, plus X and blue check buttons).','Read the hint under the field.','Type a new number and press the check (or Enter); observe the label.','Reopen, type, and press X (or Esc); observe the label.'],
 "results":['Clicking the edit button replaces the label row with a focused "Part Number" field holding the current number and two 40px buttons - an X ("Cancel") and a blue check ("Confirm") - with the hint "Enter to apply, Esc to cancel. Saved with the rest of the part." beneath.',
   'The check or Enter puts the typed number back into the label with leading/trailing spaces removed (nothing saved yet); the X or Esc discards the typed number and shows the number the part had.'],
 "source":src(13,"Edit the part number of an existing part"),"quotes":Q("S13-R4","S13-R5","S13-R6","S13-R7")},
{"anchors":["S13-R8","S13-R9","S13-R10"],"title":"Saving a new number renames the part and its library entry in place",
 "pre":[EDITPG,'The part has history and sits on at least one work order / invoice / purchase order line.'],
 "steps":['Edit the number, leave the inline field open, and press Save; confirm the typed number is applied first.','Confirm the part keeps its identity, history and every line that uses it, and its own Part Library entry is renamed (no new entry created).','Save again with the number unchanged and confirm nothing about the number or the entry changes.'],
 "results":['Save sends the part number with the rest of the part (if the inline field is still open it is applied first, not dropped); saving a new number renames the part in place - it keeps its identity, history and every work order, invoice and purchase order line, and its own Part Library entry is renamed with it (no new entry created).',
   'Saving with the number unchanged changes nothing about the number or the Part Library entry.'],
 "source":src(13,"Edit the part number of an existing part"),"quotes":Q("S13-R8","S13-R9","S13-R10")},
{"anchors":["S13-R11","S13-R12","S13-R13","S13-R14"],"title":"Create unchanged; a rename spans all locations with a hint and history",
 "pre":[EDITPG,'The part\'s Part Library entry is also stocked at other locations.'],
 "steps":['Confirm New Inventory Part still has the plain Part Number field of Story 7.','Open the inline field and read any multi-location note.','Save a new number and check where the new vs old number shows (documents vs reports/list/history).'],
 "results":['Creating a part is unchanged (New Inventory Part keeps the plain Part Number field); a Part Library entry is shared by every location, so a new number applies at every location that stocks the part.',
   'While the field is open, if at least one other location stocks the same entry the dialog shows "This also changes the part number at {n} other locations." ("1 other location." for one; counts active and inactive), and nothing when no other location stocks it; existing work orders/estimates/invoices/part sales/purchase orders/receipts/returns keep the number they were saved with, while reports, the Inventory list and Part History show the new number.'],
 "source":src(13,"Edit the part number of an existing part"),"quotes":Q("S13-R11","S13-R12","S13-R13","S13-R14")},
{"anchors":["S13-N1","S13-N2","S13-N3"],"title":"Rename errors: duplicate number, empty field, and empty by another route",
 "pre":[EDITPG,'Another part in the Part Library already has the number "ZZAUTOTEST-DUP-1".'],
 "steps":['Edit the number to one another part already holds (try case/punctuation variants) and Save; read the message and confirm the dialog stays open.','Empty the field and press the check or Enter; read the message.','Confirm an empty part number reaching the system by another route is refused.'],
 "results":['If another part already has the typed number the save is refused, the dialog stays open, and the message reads "Part number {number} already belongs to another part in the Part Library." (the match ignores case and hyphens/asterisks/periods/spaces).',
   'If the field is empty the check and Enter do nothing and it shows "Part number is a required field"; an empty part number reaching the system by any other route is refused with "Part number is required."'],
 "source":src(13,"Edit the part number of an existing part"),"quotes":Q("S13-N1","S13-N2","S13-N3")},
]
L.run("S11",S11); L.run("S12",S12); L.run("S13",S13)
