#!/usr/bin/env python3
"""Phase 5 - author the 3 gaps: 1 NEW case (G2+G3) + 1 EXTENSION (G1). Idempotent."""
import json, pathlib

NEW = {
 "id": "SCH-PERM-13",
 "area": "Permissions",
 "title": "Default roles start at the Schedule level the spec names (view-only vs edit)",
 "priority": "High",
 "type": "Functional",
 "permissions_required": "Admin access to the roles screen (to read each role's default Schedule permissions) and the ability to sign in as a user holding one of those roles.",
 "preconditions": [
  "1. You are signed in as an admin who can view and edit the roles and their permissions.",
  "2. You can sign in (or switch) to a user who holds each role you need to check.",
  "3. Write down each role's current Schedule permissions before you change anything, and put them back afterwards."
 ],
 "steps": [
  "1. Open the roles screen where each role's permissions are listed.",
  "2. Take these roles one at a time - Technician, Parts Manager, Parts Tech, Office, Time Clock - use 'Reset To Template' so the role is back at its default, then read its Schedule permissions (View, Edit, Delete).",
  "3. Do the same for these roles - Service Manager, Senior Service Advisor, Service Advisor, Foreman - and read their Schedule permissions.",
  "4. Sign in as a user with one of the roles from step 2 and try to drag a work order onto the grid.",
  "5. Sign in as a user with one of the roles from step 3 and try the same drag.",
  "6. Put every role's permissions back the way you found them."
 ],
 "expected": [
  "1. Technician, Parts Manager, Parts Tech, Office and Time Clock each have Schedule View turned ON and Schedule Edit and Schedule Delete turned OFF.",
  "2. Service Manager, Senior Service Advisor, Service Advisor and Foreman each have Schedule Edit turned ON (so they also have View).",
  "3. The user from step 4 gets the read-only schedule - nothing can be dragged onto the grid and no shift can be created.",
  "4. The user from step 5 can drag a work order onto the grid and create a shift."
 ],
 "design_ref": "Claude design (authoritative, Branko Q0): build/schedule/spec-v1-2026-07-22/design-notes-claude.md (prototype Schedule.dc.html). spec_1 added the Design link to the doc.",
 "spec_ref": "requirements.md §14.1 (default role tiers - the view-only role list and the edit role list)",
 "refs": "SV-8685 [epic - cross-cutting - no single-story owner] (§14.1 default role tiers - view-only role list + edit role list; spec v23 2026-07-30)",
 "viu_status": "VIU-Pending",
 "notes": ("NEW 2026-07-31 (coverage re-derivation vs Confluence v23) - closes gaps G2 + G3. §14.1 names the roles at each "
   "level (\"This is the experience for roles like Technician, Parts Manager, Parts Tech, Office, and Time Clock\" / \"This is "
   "the level for Service Manager, Senior Service Advisor, Service Advisor, and Foreman roles\") but NO case asserted the "
   "role-to-level mapping - SCH-PERM-01..06 test the levels abstractly, so a default that gave Technicians edit rights would "
   "have passed the whole permission set. | SCOPE LIMITS stated on purpose: (a) the spec says \"roles like\", so roles it does "
   "not name (for example Admin and Sales Representative) are NOT asserted here - record what they show and raise a question if "
   "it looks wrong; (b) the spec does not say which roles get Schedule Delete, so nothing is asserted about Delete for the edit "
   "roles - record what you see; (c) permissions are configurable per shop, so this checks the role DEFAULTS after 'Reset To "
   "Template' (Standing Rule 26). | VIU-confirm live: the exact roles-screen path and the exact on-screen wording of the three "
   "Schedule permission toggles and of the reset control. | Epic key used because §14 permissions have no single owning story "
   "among SV-8686..SV-8700 (same as SCH-PERM-01..07 and SCH-PERM-09).")
 ,
 "api_related": False,
}

base = pathlib.Path('build/schedule/cases')
# ---- G2 + G3: add the new case to the Permissions file ----
pf = base / 'cases-F-permissions-edge.json'
data = json.load(open(pf))
assert isinstance(data, list), type(data)
if not any(c['id'] == NEW['id'] for c in data):
    idx = max(i for i, c in enumerate(data) if c['id'].startswith('SCH-PERM-'))
    data.insert(idx + 1, NEW)
    json.dump(data, open(pf, 'w'), indent=1, ensure_ascii=False)
    print('added', NEW['id'], 'to', pf.name, '-> file now', len(data), 'cases')
else:
    print(NEW['id'], 'already present')

# ---- G1: extend SCH-DND-07 ----
bf = base / 'cases-B-dnd-scope-spread-series.json'
data = json.load(open(bf))
c = next(x for x in data if x['id'] == 'SCH-DND-07')
NEW_STEPS = ["3. Drag the SAME line onto a different technician's cell and create a second shift.",
             "4. Look at that line's technician roster again."]
NEW_EXP = ["4. Dragging the same line onto a second technician adds that technician to the line's roster as well - the technician who was already there stays on it.",
           "5. Nothing asks you to swap or replace the technician who was already there, and no limit is reached on how many technicians a line can have."]
if NEW_STEPS[0] not in c['steps']:
    c['steps'] += NEW_STEPS
    c['expected'] += NEW_EXP
    c['refs'] = "SV-8688 (§1.2 Goals - roster sync · §4.3 roster add + no swap flow · §7; spec v23 2026-07-30)"
    c['spec_ref'] = "requirements.md §1.2 (Goals - roster sync) · §4.3 (roster add + no swap flow) · §7"
    c['notes'] = ("EXTENDED 2026-07-31 (coverage re-derivation vs Confluence v23) - closes gap G1. §4.3 says \"There is no technician "
      "cap and no swap flow. Scheduling a technician onto a line simply adds them to that line's roster.\" The 'no cap' half was "
      "already covered (SCH-LINE-04 / SCH-SCOPE-01 avatar stack 'no cap'), but NO case observed that a SECOND technician is ADDED "
      "alongside the first rather than replacing them or prompting a swap - a build that silently replaced the incumbent would have "
      "passed every case. Steps 3-4 and expected 4-5 close that. Extended rather than authored as a new case because it is the same "
      "observable behaviour as the roster sync this case already covers (Rule 28 - no near-duplicates).")
    json.dump(data, open(bf, 'w'), indent=1, ensure_ascii=False)
    print('extended SCH-DND-07 ->', len(c['steps']), 'steps /', len(c['expected']), 'expected')
else:
    print('SCH-DND-07 already extended')

# tally
tot = act = 0
for f in sorted(base.glob('*.json')):
    d = json.load(open(f)); cs = d if isinstance(d, list) else d.get('cases', d)
    tot += len(cs); act += sum(1 for x in cs if not str(x.get('viu_status','')).startswith('Retired'))
print('cases total', tot, '| ACTIVE', act)
for k, v in NEW.items():
    if k == 'title': print('title len', len(v))
print('refs len new', len(NEW['refs']))
