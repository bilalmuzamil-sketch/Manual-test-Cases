import importlib.util
spec=importlib.util.spec_from_file_location("di_lib","build/digital-inspections-v2/di_lib.py")
L=importlib.util.module_from_spec(spec); spec.loader.exec_module(L)
SET='You are signed in as a user with "Settings - Service" enabled, on the build under test.'
def tmpl(cb=True,axle=True):
    parts=['A template with the fields below. Seed it: open Settings - Service > Inspection Templates, Edit a template (or New template), then use Add field:']
    if cb: parts.append('↳ Add a Checkbox field.')
    if axle: parts.append('↳ Add a Per-axle measurement field.')
    parts.append('↳ Save the template.')
    return parts
FILL='You are filling an inspection against that template: open a work order, start the inspection, with "Work Order Lines - Create & Edit" enabled.'

CASES=[
{"cid":88507,"title":"Note-required option on checkbox and per-axle fields, on by default",
 "pre":[SET]+tmpl(),
 "steps":['In the template builder, add a Checkbox field and open its authoring options.',
   'Add a Per-axle measurement field and open its authoring options.',
   'Read the "Note required if Monitor / Not OK" option and its default state on each.'],
 "results":[
   'A checkbox field\'s authoring options include an option, "Note required if Monitor / Not OK".',
   'That option is on by default for a newly added checkbox field.',
   'The same option is also available on a per-axle measurement field.']},
{"cid":88508,"title":"A required note is enforced on submit and listed as outstanding",
 "pre":[SET,'A template with a checkbox field that has "Note required if Monitor / Not OK" on, and a per-axle field with it on (seed via Settings - Service > Inspection Templates > Add field, turn the option on, Save).',FILL],
 "steps":['On the checkbox field, select Monitor or Not OK, leave the note empty, and try to Submit.',
   'Before submitting, open the outstanding-items list and look for the field.',
   'On the per-axle field, set a single position to Not OK and check whether a note is required.'],
 "results":[
   'With the option on, choosing Monitor or Not OK requires a note before the inspection can be submitted.',
   'The requirement is enforced at Submit, not only while filling the form.',
   'Before submit, the field appears in the outstanding-items list, so the technician is not rejected by an avoidable error.',
   'On a per-axle field the note requirement is driven by the verdicts on the positions, not a stored axle roll-up; a single Not OK position requires the note as soon as it is set, and the requirement triggers when any axle is marked Monitor or Not OK.']},
{"cid":88509,"title":"Note-required rule: negatives and edge cases",
 "pre":[SET,'Templates with the note option on and off, plus a template created before this release; you are filling inspections against them (seed the templates in Settings - Service > Inspection Templates).'],
 "steps":['With the option off, mark Monitor / Not OK with no note and Submit.',
   'Mark OK or N/A and Submit.',
   'Enter a note of only spaces on a flagged field.',
   'Write a note then change the response to OK.',
   'Open a pre-release template, then turn the option on mid-inspection.',
   'On an unlabelled field, read its outstanding-items row; and on a per-axle field with all positions OK but a stale flagged roll-up, check whether a note is required.'],
 "results":[
   'With the option off, a Monitor or Not OK response with no note submits successfully.',
   'An OK or N/A response never requires a note.',
   'A note containing only spaces counts as empty.',
   'Templates created before this release are unaffected until an author opens one and turns the option on.',
   'Turning the option on while an inspection is already in progress leaves that inspection on the rule it started with.',
   'A note written then abandoned (response changed to OK) is kept.',
   'An unlabelled field is identified in the outstanding-items list by its type and position, not shown as an empty row.',
   'A per-axle field whose positions all read OK requires no note, even if an axle carried a flagged roll-up from an earlier response shape.']},
{"cid":88510,"title":"Photo-required-if-Not-OK option, on by default, enforced on submit",
 "pre":[SET,'Photo upload is available to the technician; a template has a checkbox field (seed via Settings - Service > Inspection Templates > Add field > Checkbox).',FILL],
 "steps":['In the template builder, add a Checkbox field, open its options, and read the "Photo required if Not OK" option and its default.',
   'As technician, mark it Not OK with no photo and try to Submit.',
   'Check the outstanding-items list before submit.',
   'Check whether the option appears on a per-axle field.'],
 "results":[
   'A checkbox field\'s authoring options include an option, "Photo required if Not OK".',
   'That option is on by default for a newly added checkbox field.',
   'With the option on, choosing Not OK requires at least one photo before the inspection can be submitted, enforced at Submit (not only while filling).',
   'Before submit, the field appears in the outstanding-items list.',
   'The option applies to checkbox fields only; a per-axle field records a verdict per position, with no single position a field photo would belong to.']},
{"cid":88511,"title":"Photo rule vs unconditional Photo required; target and HEIC",
 "pre":[SET,'A template checkbox field with both "Photo required" and "Photo required if Not OK" available (seed and turn both on in Settings - Service > Inspection Templates).',FILL,'A phone camera that can produce a HEIC photo.'],
 "steps":['Turn both photo rules on and read the builder\'s summary sentence.',
   'On the field card footer, find Add Photo beside Add Note; mark Not OK and see the photo target.',
   'Upload a HEIC photo, then a format that cannot be rendered in place.'],
 "results":[
   'This option is separate from "Photo required" (which asks for a photo whatever the response); when both are on the technician is held to the unconditional rule, and the builder\'s summary sentence says so.',
   'The photo target is offered rather than always shown: Add Photo sits in the field card footer beside Add Note and opens the target, or opens on its own the moment a response makes a photo required.',
   'Inspection photos accept HEIC as well as JPEG and PNG; where a format cannot be shown in place, the viewer says so and offers the download.']},
{"cid":88512,"title":"Photo-required rule: negatives and edge cases",
 "pre":[SET,'Templates with the photo option on and off, plus a pre-release template; photo upload that can be made unavailable; you are filling inspections against them.'],
 "steps":['With the option off, mark Not OK with no photo and Submit.',
   'Mark OK, Monitor, N/A and Submit.',
   'Attach a photo then change the response to OK; then satisfy the rule, remove the photo, and try to Submit.',
   'Turn the option on mid-inspection; make photo upload unavailable.',
   'On an unlabelled field read the outstanding row; upload a rejected format.'],
 "results":[
   'With the option off, a Not OK response with no photo submits successfully.',
   'OK, Monitor and N/A never require a photo (Monitor requires a note, not a photograph).',
   'Templates created before this release are unaffected until an author opens one and turns the option on.',
   'A photo attached then abandoned (response changed to OK) is kept; satisfying the rule then removing the photo blocks submit again.',
   'Turning the option on mid-inspection leaves that inspection on the rule it started with.',
   'If photo upload is unavailable to the shop, the technician is told why rather than blocked with no visible cause.',
   'An unlabelled field is identified in the outstanding-items list by its type and position.',
   'A photo rejected for its format is met with a message naming the accepted formats at the point of failure, not a generic upload error.']},
]
L.run(CASES)
