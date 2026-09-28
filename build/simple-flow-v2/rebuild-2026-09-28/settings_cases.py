import sys, importlib.util
spec=importlib.util.spec_from_file_location("rebuild_lib","rebuild-2026-09-28/rebuild_lib.py")
L=importlib.util.module_from_spec(spec); spec.loader.exec_module(L)

ADMIN='You are signed in as an Owner or Admin (top-right shows your name and the shop "Trucks Hill 2").'
SETNAV=('Open the Work Orders settings page: in the left sidebar under "SETTINGS" click "Settings", then open the '
        '"Work Orders" tab at the top. The toggles are grouped under "WORKFLOW", "LINE REQUIREMENTS" and "PARTS", '
        'with a blue "Save Settings" button at the bottom right.')
S1='Epic SV-8683; story SV-9247 (Story 1, Work Order settings page); Simple Flow V2 spec (Confluence 771391574, revision of 11 Sep 2026), Story 1; read 28 Sep 2026.'
S2='Epic SV-8683; story SV-9248 (Story 2, Settings apply to every work order); Simple Flow V2 spec (Confluence 771391574, revision of 11 Sep 2026), Story 2; read 28 Sep 2026.'
S3='Epic SV-8683; story SV-9249 (Story 3, Confirmation before a settings change); Simple Flow V2 spec (Confluence 771391574, revision of 11 Sep 2026), Story 3; read 28 Sep 2026.'
S4='Epic SV-8683; story SV-9250 (Story 4, Applying a settings change at scale); Simple Flow V2 spec (Confluence 771391574, revision of 11 Sep 2026), Story 4; read 28 Sep 2026.'

CASES=[
{"id":44549,"title":"Work Orders settings page — the four SFV2 settings appear, named and grouped",
 "pre":[ADMIN,SETNAV],
 "steps":['Read the toggle labels and how the page is split into groups.'],
 "results":[
   '"Require ordering parts" (new), "Require picking inventory parts" (the renamed auto-pick setting), "Require receiving parts before completion" and "Require approval for new lines" all appear, each reading in the "Require..." form.',
   'They sit under the WORKFLOW / LINE REQUIREMENTS / PARTS groups, separated by dividers.',
   'The page also still shows its other existing Work Order settings, unchanged: "Require Review Before Completion" (Workflow) and "Require Tech Story", "Require Mileage", "Require Engine Hours" (Line requirements). The page is NOT reduced to only these four.'],
 "source":S1,
 "quotes":[("Story 1","The page is grouped into Workflow, Line requirements and Parts, with dividers"),
           ("Story 1","Two settings on the page are already correct and are not touched. Require Approval for New Lines and Require Receiving Parts Before Completion already carry those exact names")]},

{"id":44550,"title":'Auto-pick renamed to "Require picking inventory parts" — value inverted, behaviour unchanged',
 "pre":[ADMIN,SETNAV,'Know today\'s behaviour: before this release the setting read "Automatically pick inventory parts" and was OFF by default (so picking was already effectively required).'],
 "steps":['Find the picking setting in the PARTS group.','Read its label, and its default on/off state on a shop that has just upgraded.'],
 "results":[
   'The setting now reads "Require picking inventory parts"; the old "Automatically pick inventory parts" label is gone.',
   'The value is the inverse of the old one: "Require picking" ON equals the old "Auto-pick" OFF. A freshly upgraded shop shows it ON and picking behaves exactly as before.',
   'It is a deliberate inversion, not just a text change — the toggle never reads the opposite of what it does.'],
 "source":S1,
 "quotes":[("Story 1","One setting is renamed. Automatically pick inventory parts becomes Require picking inventory parts"),
           ("Story 1","The new wording means the opposite of the value behind it: auto-pick off is picking required. So this is a deliberate inversion, not a text change")]},

{"id":44551,"title":'"Require ordering parts" is the one new setting; its default reproduces today',
 "pre":[ADMIN,SETNAV],
 "steps":['Find "Require ordering parts" in the PARTS group.','Read its default state on a freshly upgraded shop and the helper text under it.'],
 "results":[
   '"Require ordering parts" is present in the PARTS group and is the only setting this release adds.',
   'It defaults to ON, reproducing today\'s behaviour (nothing orders parts automatically today).',
   'Its helper text reads: "When on, you click Order on each part to record that you\'ve ordered it. When off, parts are marked as ordered automatically."'],
 "source":S1,
 "quotes":[("Story 1","One setting is new. Require ordering parts does not exist in the product in any form, so the toggle and the behaviour behind it are both built here. This is the only setting this release adds"),
           ("Story 1","When on, you click Order on each part to record that you've ordered it. When off, parts are marked as ordered automatically")]},

{"id":44552,"title":"Require picking and Require receiving — what each controls, on and off",
 "pre":[ADMIN,SETNAV,'A work order with an in-stock inventory part and an outstanding orderable part, so the on/off effects show on the line.'],
 "steps":['With "Require picking inventory parts" ON, look at an inventory part; turn it OFF, save, and look again.','With "Require receiving parts before completion" ON, note where the Receive control sits and whether outstanding parts block invoicing; turn it OFF, save, and look again.'],
 "results":[
   'Require picking ON: a "Pick" action appears on each inventory and found part (and in the bulk bar). OFF: those parts are marked picked automatically and no "Pick" action appears.',
   'Require receiving ON: outstanding parts block invoicing and a "Receive" button sits on each part row. OFF: outstanding parts do not block invoicing and "Receive" moves into the part\'s ... menu.'],
 "source":S1,
 "quotes":[("Story 1","Require picking inventory parts. When on, you click Pick on each inventory and found part to record that it's been pulled. When off, these parts are ready as soon as the line is approved"),
           ("Story 1","Require receiving parts before completion. When on, each part must be recorded as received before the work order can be invoiced. When off, you can finish the work order and receive later")]},

{"id":44553,"title":"Turning Require ordering / picking ON later does not retro-act on existing parts",
 "pre":[ADMIN,SETNAV,'A work order that already has some parts recorded as ordered and some inventory parts already picked, with both settings currently OFF.'],
 "steps":['Turn "Require ordering parts" ON, save, and re-open the work order.','Turn "Require picking inventory parts" ON, save, and re-open the work order.'],
 "results":[
   'Parts already recorded as ordered stay ordered; only parts added after the change need the Order press.',
   'Parts already picked stay picked; only parts added after the change need the Pick press.',
   'No existing work changes at the moment the setting is turned on.'],
 "source":S1,
 "quotes":[("Story 1","Switching Require ordering on later does not un-order anything. Parts already recorded as ordered stay ordered, and only parts added afterwards need the press"),
           ("Story 1","Switching Require picking on later does not un-pick anything. Parts already picked stay picked")]},

{"id":44554,"title":"A settings change applies to every open work order — except approval (new lines only)",
 "pre":[ADMIN,SETNAV,'Several open work orders with outstanding orderable and pickable parts, plus one existing line you can watch.'],
 "steps":['Turn "Require ordering parts" OFF, save, and check the open work orders\' parts.','Turn "Require picking inventory parts" OFF, save, and check the parts and stock levels.','Toggle "Require approval for new lines" and compare an existing line with a newly added line.'],
 "results":[
   'Turning Require ordering OFF places already-outstanding parts on purchase orders and moves them to Awaiting (a real PO per vendor); the Order action then disappears.',
   'Turning Require picking OFF marks inventory/found parts picked and DEDUCTS them from stock (one stock movement + one inventory-history entry per part); the Pick action disappears.',
   'Require approval for new lines changes NOTHING on existing lines (an estimate stays an estimate, an approved line stays approved); it only sets the status of a line added afterwards.'],
 "source":S2,
 "quotes":[("Story 2","A settings change applies to work already on the floor"),
           ("Story 2","Require approval for new lines governs new lines only. Turning it on or off never changes the status of a line that already exists"),
           ("Story 2","Marking a part picked deducts it from stock, so this change moves real inventory")]},

{"id":44555,"title":"A settings change is written to the audit log, attributed to the admin, with the cause",
 "pre":[ADMIN,'A settings change that will alter existing parts (e.g. Require ordering OFF). Know how to open the audit log: on a work order open the three-dot (more) menu and choose "Audit Log".'],
 "steps":['Make the settings change and save.','Open the audit log on an affected work order and on a changed line/part.'],
 "results":[
   'Every changed record is written to the audit log — on the work order and on each changed line or part.',
   'Each entry is attributed to the admin who made the change (no system actor), with the cause named, e.g. "Part ordered because Require ordering parts was turned off".'],
 "source":S2,
 "quotes":[("Story 2","Every record changed is written to the audit log, on the work order and on each line or part changed, attributed to the admin who made the change, with the cause named"),
           ("Story 2","There is no system actor in the audit log")]},

{"id":44556,"title":"Settings-change sweeps skip invoiced/paid work orders and declined lines",
 "pre":[ADMIN,SETNAV,'At least one Invoiced or Paid work order, and one open work order that has a Declined line carrying parts.'],
 "steps":['Make a settings change that would otherwise touch parts (e.g. Require ordering OFF) and save.','Check the Invoiced/Paid work order and the declined line afterwards.'],
 "results":[
   'Invoiced and Paid work orders are never touched by the change.',
   'A declined line and its parts are excluded from the change.'],
 "source":S2,
 "quotes":[("Story 2","Invoiced and paid work orders are never touched by any of these changes"),
           ("Story 2","A declined line and its parts are excluded from every one of these changes")]},

{"id":44557,"title":"Only ordering and picking ask to confirm; turning picking OFF warns about stock",
 "pre":[ADMIN,SETNAV,'Open work orders holding outstanding orderable parts and outstanding inventory parts, so the confirmation counts are non-zero.'],
 "steps":['Change "Require ordering parts" and watch for a confirmation before it saves.','Change "Require picking inventory parts" to OFF and read the confirmation text.','Change "Require approval for new lines" and "Require receiving parts before completion" and watch whether any confirmation appears.'],
 "results":[
   'Changing Require ordering parts or Require picking inventory parts opens a confirmation BEFORE saving; it names the setting and direction in the title and states the consequence with the number of records affected.',
   'Turning Require picking OFF is shown as a warning that names the stock deduction, e.g. "N inventory parts on open work orders will be marked as picked and deducted from stock."',
   'Changing Require approval for new lines or Require receiving parts before completion does NOT ask for confirmation (neither writes to an existing record).'],
 "source":S3,
 "quotes":[("Story 3","Only the two settings that change existing records ask for confirmation"),
           ("Story 3","N inventory parts on open work orders will be marked as picked and deducted from stock"),
           ("Story 3","Changing Require approval for new lines or Require receiving parts before completion does not")]},

{"id":44558,"title":"Cancelling a settings-change confirmation changes nothing; a zero count saves directly",
 "pre":[ADMIN,SETNAV,'One change that affects several records (non-zero) and one that affects none (zero).'],
 "steps":['Open the confirmation for a non-zero change and press Cancel.','Make a change whose count is zero and save.'],
 "results":[
   'Cancelling leaves the setting as it was and changes no records.',
   'A count of zero shows no confirmation — the setting saves directly.',
   'No confirmation claims a consequence it cannot count; where the number cannot be established it states the consequence without a figure.'],
 "source":S3,
 "quotes":[("Story 3","Cancelling leaves the setting as it was and changes no records"),
           ("Story 3","A count of zero shows no confirmation; the setting saves directly")]},

{"id":44559,"title":"Applying a large settings change blocks only the acting admin, never the whole shop",
 "pre":[ADMIN,SETNAV,'A settings change large enough to apply in the background, and a second user signed in on a work order in the same shop.'],
 "steps":['As the admin, confirm a large change and watch the settings page while it applies.','As the second user, keep working on a work order during the run.'],
 "results":[
   'While the change applies, the admin who made it is blocked (the settings page shows a progress indicator and does not return until every affected record is changed); every other user keeps working normally.',
   'The organization is never locked — technicians are not stopped by a settings toggle.',
   'If the run fails part way, the admin is told whether the change completed or the setting reverted; a half-applied change is never left visible.'],
 "source":S4,
 "quotes":[("Story 4","the admin who made it is blocked and nobody else is"),
           ("Story 4","The organization is never locked"),
           ("Story 4","A partially applied change is never left visible to the admin. If the run fails, either the change completes or the setting reverts, and the admin is told which")]},
]
L.run(CASES,"rebuild-2026-09-28/update-log.jsonl")
