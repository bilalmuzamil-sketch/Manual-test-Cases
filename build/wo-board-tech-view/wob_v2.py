# -*- coding: utf-8 -*-
import importlib.util,json
spec=importlib.util.spec_from_file_location("wob_lib","build/wo-board-tech-view/wob_lib.py")
L=importlib.util.module_from_spec(spec); spec.loader.exec_module(L)
D=json.load(open("/tmp/claude-0/wob_cases.json"))
SEED_DEF=("On the Work Orders QA build (Board View / Tech View display options are on; the feature ships "
 "without a feature flag), ensure the current location has at least 3 eligible lead technicians "
 "(Clockable, Active, role not Office and not Time Clock User) and several work orders assigned to "
 "different lead technicians with some left Unassigned - create them via Work Orders > New and set the "
 "Lead Technician - then open the Work Orders page. Sign in with Work Orders view permission (add "
 "Work Orders create-and-edit where the case reassigns or drags).")
SEED_ANALYTICS=("On the Work Orders QA build with Google Analytics enabled for the org and a way to observe the "
 "events fired (browser devtools Network tab, or engineering/dev support). Ensure the location has "
 "eligible lead technicians and work orders so the displays and fields can be exercised.")
SEED_COUNTS=("On the Work Orders QA build, seed a KNOWN set of work orders across statuses (some Approved, "
 "In Progress, Ready for Review, and some in excluded statuses) and across several lead technicians, so "
 "the header counts and the N-open dialog count can be computed by hand (Rule 14, Rule 116).")
# Concise titles (<=80) only for the ones currently over ~80; others keep their title.
T={
96911:"Switching display re-lays out instantly, keeping filters and search",
96913:"All four filter tabs show; Work Orders is the default tab",
96920:"A failed preference save keeps the previous one and does not block retry",
96924:"Tech View groups the table by lead technician with a header and count",
96926:"Initial technician order: first name, last name, then earliest record",
96931:"Every eligible technician shows even with no work (No work orders)",
96940:"Board View: one column per eligible technician plus Unassigned",
96941:"Unassigned column is first and stays fixed on horizontal scroll",
96945:"Card more-actions overlay on hover/focus includes Reassign lead",
96950:"Empty eligible columns stay as drop targets, with no hide control",
96952:"Deactivated technician column keeps work, shows inactive, keeps pin",
96953:"Unassigned scrolls itself; technician columns never auto-hide",
96956:"Reassign dialog offers eligible techs plus Unassigned; confirm or cancel",
96962:"One audit entry per lead change; implicit moves add none",
96963:"Prohibited status blocks reassignment on every path, including non-UI",
96964:"Disabled reassignment explains the status and marks non-draggable",
96965:"Shift-clearing prompt on a Board/Tech lead change; clear vs keep",
96966:"Schedule and lead are independent; a lead change leaves time intact",
96971:"Concurrent reassignment: the later change wins after refresh",
96972:"A status turning prohibited mid-drag rejects the drop with a reason",
96973:"Reassign allows out-of-filter destinations; a non-matching WO leaves",
96974:"The N-open dialog count covers Approved, In Progress and Review",
96976:"Board View has its own Fields to display picker; saved everywhere",
96979:"Tech View defaults to the List default columns; saved kept",
96980:"Board View default field set (total price gated by financial perm)",
96982:"Turning off every optional field keeps mandatory and unit fallback",
96983:"Field prefs that fail to load fall back to defaults; next is saved",
96986:"Without see-financial-data, all dollar fields stay hidden",
96989:"One density selection is shared across the three displays",
96992:"Density applies only to WO List/Tech rows and Board cards",
96993:"Avatar group shows the lead plus distinct line technicians",
96995:"Overflow shows +N; every technician discoverable by hover",
96997:"The tech-story check mark is removed everywhere, incl. Simple Flow",
97002:"Between-tech drag reassigns the lead; to/from Unassigned toggles it",
97003:"View users can reorder tech groups/columns; Unassigned stays fixed",
97004:"Pinned technicians reorder only within the pinned area",
97005:"Saved manual order is used, shared across views, and persists",
97008:"Between-tech move uses Story 4 feedback; within-tech shows no toast",
97012:"Status/permission re-checked before a drop; unauthorized rejected",
97013:"Filtered reorder places by a visible anchor and keeps it on clear",
97021:"Keyboard focus, navigation and actions on cards/rows (design-pending)",
97022:"Keyboard focus recovers when a WO leaves the filter (design-pending)",
97023:"Display-view event fires after load and on each switch, not on refresh",
97024:"Field-exposure event fires once per available field; financial excluded",
97033:"Field selection rate is a pooled ratio (distinct selectors / exposed)",
97034:"Density and weekly usage counted by distinct users, no double count",
}
items=[]
for cid_s,v in D.items():
    cid=int(cid_s)
    sn=v["secname"]
    if sn.startswith("S12"): seed=SEED_ANALYTICS
    elif sn.startswith("Counts"): seed=SEED_COUNTS
    else: seed=SEED_DEF
    items.append((cid, T.get(cid), seed))
L.run_rt(items)
