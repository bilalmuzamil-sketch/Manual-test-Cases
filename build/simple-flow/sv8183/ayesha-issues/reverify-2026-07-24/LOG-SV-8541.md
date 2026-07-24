# SV-8541 — LIVE re-verification log (2026-07-24)

Issue (Ayesha, CLARIFICATION, ticket Open): a user WITHOUT "Work Order Line: Create & Edit"
can (a) return a received special-order part and (b) resolve cores (OK/Not OK) for inventory +
special parts. Identical on Staging AND Production. Supersedes SV-8515's cancel/return half.

## Env / roles / state
- app/api.staging.shopview.com, org d55bc308, workplace Heavy Duty 9919 (b3c8c820).
- Role vehicles (impersonated via POST /api/switch-user on confirmed test acct henry.hess, restored to
  Technician after): Office User d704c465 (has woFullViewMode+workOrdersView; NO workOrderLinesCreateAndEdit,
  NO workOrdersCreateAndEdit) AND Time Clock e35b0211 (ONLY scheduleView+timesheetsView+workOrdersView).
- Drift RULED OUT (Rule 26): before=CLEAN (role-drift-before), after=CLEAN (role-drift-after); role
  DEFINITIONS never edited. Reproduced against clean template roles.

## Live observations (evidence in folder)
1. RESOLVE CORES — BE has NO permission gate at all:
   - As OFFICE (no WOL C&E): POST /api/work-orders/{id}/pre-resolve-cores {cores:[{partRequestId,isCoreOk:true}]}
     -> HTTP 201 {"resolvedCount":1}. Core RESOLVED. (WO 3996683a, corePR 985802c7)
   - As TIME CLOCK (only 3 view perms, NO woFullViewMode, NO WO-write atom): same call -> HTTP 201
     {"resolvedCount":1}. Core RESOLVED. (WO 1b6f0ae6, corePR 22c77317)
   => The endpoint enforces ZERO permission. Even the bare-minimum Time Clock role resolves cores.
2. PART-ACTION endpoints (perform-request-status-action / change-request / parts/delete): return the SAME
   parameter/STATE validation (400) for Office & Time Clock as for Admin — NO 403 permission gate. Errors
   observed were STATE errors ("can only be performed on authorized lines", "can't be modified once received"),
   not permission denials. change-request(requested part) returned 200 (form-load) identically for Admin & TC.
3. FE: the part ⋮ menu exposes "Return" to Time Clock (sv8516-tc-menus.json) and Office UI shows Return/Core/Edit
   (sv8541-office-wo-lines.png). So the low-priv roles ALSO see the controls in the UI (not merely API-possible).

## VERDICT
Ayesha's finding is REAL and reproduces on CLEAN template roles: a user without WO Line: Create & Edit CAN
resolve cores (proven 201, both Office and Time Clock) and the part/return actions carry no BE permission gate.
CATEGORY = pre-existing behavior / spec-interpretation, NOT a Simple-Flow regression (matches Production per
Ayesha; correctly raised as a CLARIFICATION awaiting Sasha).
- Honesty nuance vs the atom-collapse theory: §9.4 documents that woOrderParts/workOrderLinesCreateAndEdit/
  woFullViewMode/woTechViewMode/workOrdersCreateAndEdit COLLAPSE to ROLE_WORK_ORDER::VIEW+CREATE_AND_EDIT and
  are "conveniences, not BE-enforceable boundaries" (spec-sanctioned, SV-7864). That would explain Office
  (which HAS woFullViewMode). BUT Time Clock has NONE of those 5 atoms and STILL got 201 -> the pre-resolve-cores
  endpoint applies NO gate at all, EXCEEDING the documented atom-collapse. So it is a genuine missing-BE-check,
  though pre-existing (same on Prod) rather than Simple-Flow-introduced.
- Rule 24: not a pure FE-restricted-but-API-possible case, because the FE ALSO shows the controls to the low-priv
  roles; the action is doable in-UI by a role lacking the permission. Recommend PO/dev ruling (SV-8541 Open):
  if BE enforcement is required, add a permission check on pre-resolve-cores (+ part return/status-action).

## Spec wording deviated from (Rule 25)
- requirements.md §9.1: "Resolve inventory / special-order cores (Ok/Not OK) | 3/4/16 | WO Lines: Create & Edit."
  => spec REQUIRES WOL C&E; the build lets a role without it (even Time Clock) resolve cores.
- requirements.md §9.2: Time Clock = "No" across EVERY column (no access). => Time Clock resolving a core violates
  this row.
- COUNTERWEIGHT (Rule 25 honesty): requirements.md §9.4 explicitly states the BE atom-collapse is "a deliberate,
  spec-sanctioned low-privilege trade-off (SV-7864). FE distinctions ... are conveniences, not BE-enforceable
  boundaries." So the spec ITSELF anticipates BE non-enforcement of these sub-atoms — which is why this is a
  clarification, not a clean bug. The one part NOT covered by §9.4 is a role (Time Clock) holding NONE of the
  collapsing atoms still succeeding; that is the enforcement gap for Sasha to rule on.

## Our cases that missed it / coverage gap
- SF-REV-14 / C29399 (cases/view/29399) — "cores decided before receiving": touches core resolution but never
  tested a per-role permission-negative (a role lacking WOL C&E resolving a core). GAP.
- SF-PERM-09 / C29413 (cases/view/29413) — part-add financial gate: adjacent, not this action.
- No dedicated "WOL C&E gates core resolution / received-part return" permission-negative exists. Follow-up
  (needs user OK): add an SF-PERM negative asserting a role without WOL C&E (test Time Clock) cannot resolve
  cores / return a received part (pending Sasha's ruling on whether BE enforcement is required). refs:
  SV-8541 / SV-8183 (§9.1 resolve cores; §9.2 Time Clock row; §9.4 atom-collapse caveat).

## Data mutations made (disposable staging, Rule 6) — flagged for transparency
- Resolved 2 cores that were pending: WO S9-25393 (3996683a) PR 985802c7 set OK; WO S9-24706 (1b6f0ae6)
  PR 22c77317 set OK. Core resolution is not API-reversible; both are pre-existing S9- test WOs on the
  disposable shared staging org. No inventory receive/return was completed.
