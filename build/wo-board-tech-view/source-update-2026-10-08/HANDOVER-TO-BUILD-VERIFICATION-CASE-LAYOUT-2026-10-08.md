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

## Four more rules for the same pass (QA lead, 8 Oct 2026)
- **"Needs" line first:** the Preconditions block starts with one line saying what the case needs, e.g.
  "Needs: 2 users · 2 browsers · Schedule access · about 10 minutes".
- **Named placeholders:** Setup records each value the case relies on once, in square brackets — e.g. "[WO-1] = the
  work order number shown", "[Tech-A] = the first technician", "[User-B] = the view-only user". Steps and Expected
  results use the placeholders, never "e.g." names (the example name may appear once, where the placeholder is defined).
- **Results tied to steps:** every expected result starts with the step it belongs to — "Step 2: …", "Steps 2 and 5: …".
  Leave the Source line, the exact quotes, the build stamp and the marker as they are.
- **Own data per case:** every case uses its own ZZAUTOTEST customer (or tag) named after the case's behaviour, so cases
  can run in any order, in parallel, on the shared QA build without changing each other's counts. Where two cases
  share a customer today, give one of them its own.

**Before you finish each case, check:** *"Can a tester or a fresh Claude session prepare the required state, execute
the test and determine pass/fail using this case alone?"* If not, the case is not finished.
**Keep every detail needed to run it:** remove repetition and ambiguity, never information needed for execution.

## Worked example — C96950 "An empty column says 'Drag a work order here' only to users who can reassign"

**Preconditions**
- Needs: 2 users · 2 browsers · about 10 minutes.
- Build: the Work Orders QA build (sv10043), desktop browser, window at least 1024 px wide.
- [User-A]: Owner/Admin (Work orders > View and Create & Edit).
- [User-B]: a role with Work orders > View only (Create & Edit off), signed in in a second browser or a private window.
- One location for both users (e.g. "Staging Heavy Duty - 9919").
- Two eligible technicians at that location (active, Time Clock on, Role not Office User or Time Clock User): [Tech-A]
  leads exactly 1 work order for the customer below; [Tech-B] leads none.
- Customer "ZZAUTOTEST Empty Columns" (used by this case only): every one of its work orders has a lead technician, so
  Unassigned is empty for this customer.
- What must hold: one technician with work, one without, no unassigned work order for this customer. Names are examples.

**Setup**
1. Settings > Staff: confirm or add two technicians (Role Technician, a Department, Location = this location, Time
   Clock on) > Save & Close. Record them as [Tech-A] (e.g. Esther Howard) and [Tech-B] (e.g. Jenny Wilson).
2. Work Orders > New Work Order > customer "ZZAUTOTEST Empty Columns" (add it if missing) > any asset > create. Record
   the number shown as [WO-1] (e.g. S1-702).
3. On [WO-1] set Lead Technician = [Tech-A] > save.
4. Settings > Roles & Permissions > create role "ZZAUTOTEST WO view only": Work orders > View on, Create & Edit off > Save.
5. Settings > Staff > add [User-B] with that role at this location > Save & Close; accept the invitation, set a password.
6. Check the setup worked: as [User-A], Work Orders > All > search "ZZAUTOTEST Empty Columns" — exactly [WO-1] shows,
   led by [Tech-A]. If any work order for this customer has no lead, set one before starting.

**Steps**
1. As [User-A], on Work Orders > All with the search applied, click Board View.
2. Read [Tech-B]'s column and the Unassigned column.
3. As [User-B], in the second browser, open Work Orders > All and search "ZZAUTOTEST Empty Columns".
4. Click Board View.
5. Read the same two columns.

**Expected results** (start of each line)
- Step 2: both empty columns read "Drag a work order here to assign it".
- Step 5: both empty columns read "No work orders".

## Also from the developer's handoff (for your verdicts)
- C368160 and C368164 (Tech View Columns menu count / Show all / Reset to default / Find box) and C368162 (Collapse all /
  Expand all) test design details the developer says are not in this release — mark them **Blocked, not Failed**.
- The regression cases' "navigation to confirm on the build" list is in `REGRESSION-CASES-2026-10-08.md` (notes).
- `get_tests` returns at most 250 tests per call and run 498 has 253 — page with `&limit=250&offset=…` before any run
  update, or the union drops tests (L16).
