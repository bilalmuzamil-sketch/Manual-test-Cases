# For the build verification session — new case layout for the WO Board & Tech View cases (8 Oct 2026)

**From the QA lead (8 Oct 2026):** the preconditions are too long for a manual tester to tell the required state from
the setup work. **While you verify each case, rewrite its Preconditions and Steps into the layout below.** You are the
only session writing to these cases (one writer); the authoring session will not touch them.

**Scope:** every case in run [498](https://shopview.testrail.io/index.php?/runs/view/498) created by us — 253 cases:
the feature folder 13204 (sections 13236–13248 and tech-plan 20449) and the regression folder 47109 (High 47110 ·
Medium 47111 · Low 47112). Not Vladimir Tomovic's 18 cases.

## The layout

**Preconditions field — two headed blocks:**

**1. "Preconditions" — the required starting state (no instructions here)**
- Environment (the build), user role and the permissions it needs, location, relevant configuration, browser and
  window width.
- The exact test data and how it relates: how many records, their statuses, who leads what, the relevant values.
- The starting value of every setting the expected result depends on (e.g. Customer field ON, Service Advisor OFF,
  Density Comfortable).
- Which names are only examples and which relationships and values must hold.

**2. "Setup" — numbered instructions that create that state**
- Navigation path, required fields, values and the save action, in the build's own labels.
- Reuse an existing record only after checking it meets every condition.
- Write down every number the system assigns (e.g. the work order number) and use it in the steps.
- End with **"Check the setup worked"**: what to look at, and what to do if it does not match.
- Never only a link to another setup; the essential instructions are in the case.

**Steps — only the behaviour being tested**
- Start from the prepared state; numbered, one action per line, the exact control and input value.
- No setup actions, nothing vague ("verify it works", "configure appropriately").

**Do not change:** the expected results, the Source line, the exact quotes, the build stamp you added, or the
AUTOMATION marker. Only the Preconditions and Steps are reorganised — keep every correction you have already made
word for word (Admin quick-login, Change Location, Time Clock, Department, Save & Close, Column Selection …).

## Worked example — C96950 "An empty column says 'Drag a work order here' only to users who can reassign"

**Preconditions**
- Build: the Work Orders QA build (sv10043), desktop browser, window at least 1024 px wide.
- User A: Owner/Admin (Work orders > View and Create & Edit).
- User B: a role with Work orders > View only (Create & Edit off), signed in in a second browser or a private window.
- One location for both users (e.g. "Staging Heavy Duty - 9919").
- Two eligible technicians at that location (active, Time Clock on, Role not Office User or Time Clock User): Technician
  1 (e.g. Esther Howard) leads exactly 1 work order for the customer below; Technician 2 (e.g. Jenny Wilson) leads none.
- Customer "ZZAUTOTEST Empty Columns": every one of its work orders has a lead technician (so Unassigned is empty for
  this customer).
- Names are examples; what must hold: one technician with work, one without, no unassigned work order for this customer.

**Setup**
1. Settings > Staff: confirm or add the two technicians (Role Technician, a Department, Location = this location, Time
   Clock on) > Save & Close.
2. Work Orders > New Work Order > customer "ZZAUTOTEST Empty Columns" (add it if missing) > any asset > create. Write
   down the work order number (e.g. S1-702).
3. On that work order set Lead Technician = Technician 1 > save.
4. Settings > Roles & Permissions > create role "ZZAUTOTEST WO view only": Work orders > View on, Create & Edit off > Save.
5. Settings > Staff > add User B with that role at this location > Save & Close; accept the invitation, set a password.
6. Check the setup worked: as User A, Work Orders > All > search "ZZAUTOTEST Empty Columns" — exactly your recorded
   work order shows, led by Technician 1. If any work order for this customer has no lead, set one before starting.

**Steps**
1. As User A, on Work Orders > All with the search applied, click Board View.
2. Read Technician 2's column and the Unassigned column.
3. As User B, in the second browser, open Work Orders > All and search "ZZAUTOTEST Empty Columns".
4. Click Board View.
5. Read the same two columns.

## Also from the developer's handoff (for your verdicts)
- C368160 and C368164 (Tech View Columns menu count / Show all / Reset to default / Find box) and C368162 (Collapse all /
  Expand all) test design details the developer says are not in this release — mark them **Blocked, not Failed**.
- The regression cases' "navigation to confirm on the build" list is in `REGRESSION-CASES-2026-10-08.md` (notes).
- `get_tests` returns at most 250 tests per call and run 498 has 253 — page with `&limit=250&offset=…` before any run
  update, or the union drops tests (L16).
