import importlib.util
spec=importlib.util.spec_from_file_location("di_lib","build/digital-inspections-v2/di_lib.py")
L=importlib.util.module_from_spec(spec); spec.loader.exec_module(L)
LINES="You are signed in with 'Work Order Lines - Create & Edit' and 'Work Orders - Create & Edit', on the build under test; ShopCoach is enabled and the shop has at least one labour type."
def compl(extra=None):
    s=['A completed inspection with at least one Monitor or Not OK finding, run on a work order. Seed it:',
       '↳ Open a work order for a customer and asset (Work Orders > New, pick the customer/unit).',
       '↳ Start an inspection from a template that has a checkbox field; mark one field Not OK and one Monitor.',
       '↳ Complete and sign the inspection so it is in its read-only completed view.']
    if extra: s+=extra
    return s

CASES=[
# ---- S2 ----
{"cid":88513,"title":"Choose the target work order before drafting; eligibility and new WO",
 "pre":[LINES]+compl(['↳ For eligibility: have one inspection whose run-on work order is Estimate/Approved/In Progress/Review, and one whose work order is Complete/Invoiced/Paid/Declined (or already invoiced).'])},
{"cid":88514,"title":"A generated line behaves as an ordinary approved line",
 "pre":[LINES]+compl(['↳ Note the shop\'s "automatically approve work order lines" setting and its default labour type (Settings - Service).'])},
{"cid":88515,"title":"Landing on Lines tab, actioned state, and a second-build confirm",
 "pre":[LINES]+compl(['↳ Have one inspection you will draft-then-abandon, and one you will fully add lines from twice.'])},
{"cid":88516,"title":"Permissions gate the build; the server enforces withheld actions",
 "pre":[LINES,'Test users (set roles under Settings - Staff / Roles): one without "Work Order Lines - Create & Edit"; one without "Work Orders - Create & Edit"; one without "See Financial Data".']+compl()},
{"cid":88517,"title":"The build is not offered when its preconditions are not met",
 "pre":[LINES,'Seed three states: (a) an inspection that is not completed; (b) a completed inspection with only OK/N/A findings (no Monitor or Not OK); (c) a shop configured with no labour types.']},
{"cid":88518,"title":"Edge cases: long notes, many findings, concurrent/deleted WOs",
 "pre":[LINES,'Two completed inspections to build from: one with a very long technician note, one with about thirty Monitor or Not OK findings (seed via a template with ~30 checkbox fields all marked Not OK).','A second browser (or private window) signed in as another user who can close, delete or reopen the work order or the inspection.']},
# ---- S3 ----
{"cid":88519,"title":"Build lines from the completed inspection screen, incl. on a phone",
 "pre":[LINES]+compl(['↳ Have a phone (or a narrow browser window) available to repeat the flow.'])},
{"cid":88520,"title":"The summary card, per-verdict counts, and the section review",
 "pre":[LINES,'A completed inspection with a mix of OK, Monitor and Not OK findings, and at least one verdict with no findings (seed a template with several checkbox fields and set the mix). Test both with ShopCoach enabled and with it disabled.']},
{"cid":88521,"title":"Build lines is absent (not disabled) unless preconditions met",
 "pre":[LINES,'Seed cases covering: a completed inspection with no Monitor/Not OK findings; a user without "Work Order Lines - Create & Edit"; an inspection that is not completed; and an organisation without ShopCoach.']},
{"cid":88522,"title":"Edge cases: deleted work order, concurrent build, reopening",
 "pre":[LINES]+compl(['↳ Be able to delete the run-on work order; and have a second user (second browser) who can build from or reopen the inspection concurrently.'])},
# ---- S4 ----
{"cid":88523,"title":"Build lines from the report note, incl. phone and ineligible WO",
 "pre":[LINES,'A work order carrying an inspection report note whose report recorded at least one Monitor/Not OK finding. Seed it: run and complete an inspection with a Not OK finding on a work order, which posts the inspection report note to that work order.','Have one such note on an eligible work order (Estimate/Approved/In Progress/Review) and one on an ineligible work order (Complete/Invoiced/Paid/Declined). A phone (or narrow window) available.']},
{"cid":88524,"title":"Re-build confirmation is judged on the inspection's current state",
 "pre":[LINES,'An inspection already built from through another entry point (e.g. its completed screen), whose report note is still on the work order.']},
{"cid":88525,"title":"The note's Build lines action is absent unless preconditions met",
 "pre":[LINES,'Seed cases covering: a report note whose report recorded only passes; a note whose inspection was deleted; a user without line rights; the work order\'s history view; and an organisation without ShopCoach.']},
# ---- S5 ----
{"cid":88526,"title":"The Inspections tab appears on the asset and lists every inspection",
 "pre":["You are signed in with 'Customers - View' and 'Work Orders - View', on the build under test.",'An asset reachable from a customer record, with several inspections including repeated runs of the same template. Seed: run several inspections on one asset (some from the same template) and complete them.']},
{"cid":88527,"title":"Each column behaves as specified: status, findings, WO, report, action",
 "pre":["You are signed in with 'Customers - View' and 'Work Orders - View'; ShopCoach enabled.",'An asset with inspections in mixed states: some with Monitor/Not OK findings, some built (one where a WO was created, one where lines were added), some with nothing to do, some with reports. Seed by running inspections and building lines from some of them.']},
{"cid":88528,"title":"Filters, summary line, 'needs action' definition, counts across perms",
 "pre":["You are signed in with 'Customers - View' and 'Work Orders - View'.",'An asset whose inspections include: completed-after-release with a Monitor/Not OK finding not yet built; completed-before-release with issues; not-started; already built.','Two users to sign in as: one who can build lines and one who cannot (set under Settings - Staff / Roles).']},
{"cid":88529,"title":"Links vs buttons, phone usability, and the asset on the inspection",
 "pre":["You are signed in with 'Customers - View' and 'Work Orders - View'.",'An asset with inspections; a phone (or narrow viewport); at least one pre-release inspection backfilled at migration; and an inspection whose work order\'s asset was later changed.']},
{"cid":88530,"title":"How findings are counted: the single definition, per axle",
 "pre":["You are signed in with 'Customers - View' and 'Work Orders - View'.",'Inspections containing checkbox and per-axle measurement fields with: some responses N/A or unanswered; a per-axle field with three axles marked OK, Monitor and Not OK; and some hidden fields. Seed a template with these field types and set the responses.']},
{"cid":88531,"title":"The tab and its actions are withheld by permission and configuration",
 "pre":['Test users (Settings - Staff / Roles): one without "Work Orders - View"; one with "Work Orders - View" but not "Customers - View"; a user who cannot build; and an organisation without ShopCoach.','An asset with no inspections, and an asset with inspections.']},
{"cid":88532,"title":"Edge cases: not-started, all-N/A, deletions, moves, archives, ties, volume",
 "pre":["You are signed in with 'Customers - View' and 'Work Orders - View'.",'An asset with: a not-started inspection; an all-N/A completed inspection; an inspection whose run-on work order is deleted; an inspection whose lines went onto a different work order then deleted.','An asset moved between customers; an archived/deleted template; two inspections sharing a completion time; and an asset with about 150 inspections (seed in bulk).']},
]
L.run_light(CASES)
