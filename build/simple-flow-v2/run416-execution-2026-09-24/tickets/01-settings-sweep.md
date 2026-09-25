TITLE: Turning Require Ordering Parts Off Does Not Reach the Work Orders That Already Exist
ISSUE TYPE: Story Defect
PARENT / OWNING STORY: SV-9248 — Settings apply to every work order
PRIORITY: Medium
ALSO LINK: relates to SV-9248
PICTURE: pictures/sweep.png  (banner: "What the product says when a Work Orders setting is switched")
COVERS THE CHECKS: C44554 (the sweep), C44555 (the audit entries), C44559 (the progress indicator)

--- WIKI MARKUP BODY BELOW THIS LINE ---

h2. Description

A setting on the *Work Orders* settings page applies to the whole shop, not only to work created after
it is changed. Turning one on or off is meant to bring every open work order into line straight away —
and to say so in each record's history, naming the setting as the cause.

On the build it changes nothing at all. The setting saves, and every work order, line and part is left
exactly as it was.

For example, with *Require Ordering Parts* turned off:
* every part still waiting to be ordered should be placed on a purchase order and move to *Awaiting*,
  by the same route a person pressing *Order* would take, so a real purchase order exists for each;
* the *Order* action should then disappear from those parts;
* each record changed should gain a history entry naming the admin and the cause;
* while that is being applied, the *Work Orders* settings page should hold the admin with a progress
  indicator.

None of that happens. The product's own confirmation states it outright: {{No record is changed by this
switch.}}

h2. Steps to Reproduce

# Sign in as an Owner or Admin.
# Open *Settings* in the left sidebar, then the *Work Orders* tab.
# Note a work order that carries a part still waiting to be ordered.
# Turn *Require Ordering Parts* on, read the confirmation, press *Turn On*, then press *Save Settings*.
#* The confirmation reads: {{123 parts at this location are affected by this requirement today. No record is changed by this switch.}}
#* No progress indicator appears. The page returns at once.
# Turn the same setting back off and press *Save Settings*.
# Open the work orders again and look at their parts.
#* Every part is in the state it was in before. Nothing moved to *Awaiting*.
#* No purchase order was raised.
# Open the three-dot menu on one of those work orders and choose *Audit Log*.
#* There is no entry for the settings change. The newest entries are days old.

*Actual Result* — the switch saves and nothing else happens. 66 parts across 45 work orders were
recorded before and after the change and not one of them changed. No purchase order was created, no
history entry was written, and no progress indicator appeared.

*Expected Result* — every open work order is brought into line with the setting, each changed record
carries a history entry naming the admin and the cause, and the settings page holds the admin with a
progress indicator until the run is finished.

h2. Environment

Production, [https://app.shopview.com], build {{v26.39.0-07c719b}}, shop *Trucks Hill 2*, 24 September 2026.
Settings page: [https://app.shopview.com/administration/settings] → *Work Orders* tab.
A work order used in the run: [https://app.shopview.com/workorders/47abc3c7-93a1-401c-9344-547e1066a4a2/lines]

h2. Sources

Simple Flow V2 specification, Confluence page *771391574*, Story 2 — "Settings apply to every work order".
_[TO BE PASTED: the verbatim sentence from the live page. Needs one gated read of the source — see the
note to the QA lead; nothing is quoted here from memory.]_
