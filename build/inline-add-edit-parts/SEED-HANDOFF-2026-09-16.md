# HANDOFF → DATA-SEEDING SESSION — Inline Add & Edit Parts (section 6597)
### Seed the test environment so every one of the 123 build-verified cases can be run. 2026-09-16.

**You are the seeding session.** Build verification is done (123/123 runnable, stamped to
`v26.36.7-20cfff7`, render clean). What is missing is the *data* each case needs. Your job: create that
data, confirm each case's state is reachable in the UI, and **save a re-runnable seed manifest + script so
the data can be rebuilt after any redeploy.**

- **Suite:** Inline Add & Edit Parts (section 6597), **123 cases**, all `created_by=3`. Run **R418**.
- **DO NOT TOUCH:** Vladimir Tomovic's 11 cases (`created_by=1`): C45220, C45268, C53474, C53475, C53514,
  C53576, C53577, C53598, C53599, C53600, C55687 (Rule 38). They are not in this seed scope.
- **Environment:** this feature is tested on **STAGING** — `https://app.staging.shopview.com` (the sv9315 QA
  branch was destroyed when the feature merged, 2026-09-10). You have **full CRUD authority on staging test
  data** (Rule 6/107 — tag throwaway records `ZZAUTOTEST`, restore what is not the point of a test). **Do NOT
  treat production as a test environment.**
- **Access recipe:** `source build/testing-tools/ensure_bridge.sh`; put a live `sv_sso_session` in
  `/tmp/staging-cookie.txt` (chmod 600, /tmp only, NEVER committed — Rule 82); then
  `node build/testing-tools/staging-boot2.mjs /workorders` (admin: `SV_KEY=admin`). Seed off the build's real
  labels in `build/OBSERVED-UI-LABELS-staging.md`, and reuse `build/inline-add-edit-parts/probe_inline_surfaces.mjs`.

## 🛑 READ FIRST — the shape of this suite
Almost every case (117 of 123) needs the **same base state** and differs only by **role / view-mode** or by a
**specific part/inventory shape**. So you build a small set of reusable fixtures, not 123 separate ones. Two
things bite if ignored:
1. **The parent LINE's authorisation state changes what a part shows** (learning L0044): a part shows **"Auth
   to order"** only when its LINE is Authorized/Approved **and** the part Source = Vendor; an Inventory part on
   a non-authorized line shows "Awaiting". Seed both so the Requested/Auth-to-order cases are reachable.
2. **Inventory + bins is the hard part.** The 22 bin-allocation cases need parts stocked across bins in
   specific shapes (multi-bin, default-doesn't-cover, negative on-hand, no-bins, non-catalog). Build these
   deliberately; they cannot be improvised at test time.

## §1 · THE FIXTURES (build these once; they serve the whole suite)

### Roles / view modes  (Settings → Roles & Permissions → the role → pencil)
| id | Role setup | Serves |
|---|---|---|
| **R-TECH** | View mode **Tech view**, "Work order lines" **Create & Edit ON** | all Tech-View add/edit cases (6756, 6757) |
| **R-FULL** | View mode **Full View**, Create & Edit **ON** | all Full-View add/edit cases (6758, 6759) |
| **R-FULL-NOFIN** | Full View, Create & Edit ON, **See Financial Data OFF** | C53477, C45054, C45232 (no-financial branch) |
| **R-NOEDIT** | Create & Edit **OFF** (either view) | C44995, C45032, C45066 (controls must be hidden) |
> Assign each role to a named test staff login; record login → role in the manifest. A tester switches login
> (or you seed one WO per role) to reach each view.

### Work orders by status  (Work Orders → Create Work Order)
| id | Status | Must have | Serves |
|---|---|---|---|
| **WO-EDIT** | Estimate / Approved / In Progress / Review (one of each is ideal; at least one) | ≥1 line, and on that line ≥1 **already-saved part** (so the "edit control on an existing part" cases work) | the ~110 standard add/edit/allocation/guard cases |
| **WO-MULTILINE** | any editable status | **≥2 lines**, each with its Parts section | C44997, C45068, C45074, C45075 (open a row on one line, act on another) |
| **WO-COMPLETE** | **Complete** | ≥1 line with a part; and a **Complete LINE with a part at quantity 5** | C44993, C44994, C45250, C45251 |
| **WO-INVOICED** | **Invoiced** | ≥1 line with a part | C44993, C44994 |
| **WO-PAID** | **Paid** | ≥1 line with a part | C44993, C44994 |
| **WO-DECLINED** | **Declined** | ≥1 line with a part | C44993, C44994 (controls must be SHOWN here) |
> Invoiced/Paid/Declined may not be hand-settable from the WO screen — reach them through the real workflow
> (invoice the WO, record payment, decline a line/WO). Record HOW you reached each, so the tester can too.

### Parts / inventory  (Parts → inventory; and the part's bin/stock setup)
| id | Part shape | Serves |
|---|---|---|
| **P-BINS** | an **inventory (catalog) part** with **named bins**, each with an on-hand quantity, exactly **one flagged Default** | C45221, C45222, C45223, C45224, C45226, C45227, C45237, C45238 |
| **P-MULTIBIN** | an inventory part stocked across **≥2 bins**, total on-hand high enough that a test quantity **spans two+ bins** (forces a split) | C45225, C45228, C45231, C45232, C45233, C45234, C45236, C45243 |
| **P-DEFAULT-SHORT** | an inventory part whose **Default bin on-hand is LESS than a typical test quantity** (so allocation must auto-switch off the Default) — and confirm a smaller quantity the Default DOES cover | C45230 (auto-off note), C45242 (no note when Default covers) |
| **P-NEGBIN** | an inventory part with **a bin already at a negative on-hand** | C45229, C45235, C45243 (takes-negative / already-negative styling) |
| **P-NOBINS** | an inventory part with **no bins at all** | C45239 |
| **P-NONCATALOG** | a **free-typed part not linked to the catalog** (add by typing a description, no catalog match) | C45013, C45054, C45240 |
| **P-FOUND** | a part whose **Source = Found** (cost read-only) | C45039 |
| **P-INV-COST** | an **inventory** part (cost read-only; cannot enter a custom cost) | C45254, C45039 |
| **P-NOPRICE** | a **catalog part with no price of its own** (can be saved at 0.00) | C45060 |
| **P-PRICEMATRIX** | a **part category that carries a cost→sell pricing rule/matrix**, so entering Cost auto-calculates Sell Price; and a second category with a different rule | C45252 (sell from cost), C45253 (change category recalculates) |
| **P-VENDOR-AUTH** | a **Vendor-source (special-order) part on an Authorized/Approved line** so its status shows **"Auth to order"** (L0044) | C45013, C45054 (the Requested / Auth-to-order flow) |

## §2 · PER-CASE COVERAGE — every C-id, its fixture, and what to seed
> The DEFAULT for a case is **WO-EDIT + the role for its section** (Tech or Full) with an existing part on the
> line. Only the non-default needs are called out. Every in-scope C-id appears exactly once.

**6755 Add Part Button & Edit Control (14):**
C44988, C44989, C44990, C44991, C44992 — WO-EDIT (990/992 need BOTH R-TECH and R-FULL to see view-mode routing).
C44993, C44994 — WO-COMPLETE + WO-INVOICED + WO-PAID + WO-DECLINED (all four statuses).
C44995 — **R-NOEDIT** (controls hidden). C44997 — **WO-MULTILINE**. C45250, C45251 — **WO-COMPLETE with a
Complete line carrying a part (qty 5)**. C45252 — **P-PRICEMATRIX**. C45253 — **P-PRICEMATRIX** (two categories).
C45254 — **P-INV-COST** (inventory part, cost read-only).

**6756 Tech View Inline Add (25):** all → **R-TECH** + WO-EDIT. Extras:
C45005, C45026 — role Create&Edit ON (as R-TECH). C45013 — **P-NONCATALOG + P-VENDOR-AUTH** (free-typed →
Requested/Auth-to-order). C45020 — add the **same part twice** (any catalog part). C45021 — *tester technique*:
WO becomes non-editable mid-save (change its status in another tab). Others (C44998–C45019, C45022) → base R-TECH.

**6757 Tech View Inline Edit (13):** all → **R-TECH** + WO-EDIT with **an existing part on the line to edit**.
C45028 — a part with hidden pricing/category set (so it can be checked as preserved). C45030 — a **second
catalog part** to re-link to. C45032 — **R-NOEDIT** (edit control hidden). C45035 — *tester technique* (WO
non-editable mid-edit). Others (C45023–C45027, C45029, C45031, C45033, C45034) → base R-TECH.

**6758 Full View Inline Add (28):** all → **R-FULL** + WO-EDIT. Extras:
C45038 — a **catalog part** (populates cost + sell). C45039 — **P-FOUND + P-INV-COST** (cost read-only vs
editable). C45040 — a **part category** select. C45054 — **R-FULL + P-NONCATALOG + P-VENDOR-AUTH** (Requested in
Full View). C45055 — a **typeahead miss** (type a description that matches no catalog part → "Create as new").
C45060 — **P-NOPRICE** (catalog part, no own price, saves at 0.00). C45061 — *tester technique* (WO non-editable
mid-add). C53477 — **R-FULL-NOFIN** (Full View without See Financial Data → three-field row). Others
(C45036, C45037, C45041–C45053, C45056–C45059, C45062) → base R-FULL.

**6759 Full View Edit (6):** all → **R-FULL** + WO-EDIT with **an existing part to edit**.
C45066 — **R-NOEDIT** (edit control hidden). C45068 — **WO-MULTILINE** (open an add row, then edit on another
line → guard). Others (C45063, C45064, C45065, C45067) → base R-FULL.

**6760 Unsaved Data Protection (15):** all → WO-EDIT (either view; discard/guard behaviour is view-agnostic).
C45074, C45075 — **WO-MULTILINE** (open a second row / only one row at a time). C45070, C45072, C45078 — need
**an existing part to edit** (changed-edit-row guard). Others (C45069, C45071, C45073, C45076, C45077, C45079,
C45080, C45081, C45082, C45083) → base WO-EDIT with a populated add row.

**6771 Bin Allocation (22):** all → WO-EDIT + a role that can add parts (R-TECH covers Tech-View allocation,
R-FULL the Full-View path; C45236 explicitly needs **Tech View**). Part fixtures:
C45221, C45222 — **P-BINS**. C45223, C45224, C45237, C45238 — **P-BINS** (single-bin auto-allocation + chip).
C45225, C45226, C45227, C45228, C45231, C45232, C45233, C45234, C45236, C45243 — **P-MULTIBIN** (open the
picker, split across bins). C45229, C45235 — **P-NEGBIN**. C45230, C45242 — **P-DEFAULT-SHORT**. C45239 —
**P-NOBINS**. C45240 — **P-NONCATALOG**. (C45232 also needs **R-FULL-NOFIN** and R-FULL to prove the modal
routes differently by financial access.)

## §3 · PRECONDS THAT ARE NOT SEEDABLE DATA — set up per note, don't fake
- **"Work order becomes non-editable during save" (C45021, C45035, C45061):** a **race** — the tester (or a
  second session) flips the WO to a non-editable status while an add/edit row is open, then saves. Provide the
  WO and the second-session/tab recipe; there is no static record that produces this. C45035/C45061 are
  **EXPECT-FAIL against SV-9917** — expected to fail today; that is the documented outcome, not a seed gap.
- **"Other save failure keeps the row open" (C45022, C45062):** a forced back-end failure (block the save
  endpoint). Tester technique; no data.

## §4 · 🛑 SAVE THE SEED SO IT SURVIVES A REDEPLOY
Whatever environment this runs on can be rebuilt and wiped. Make the seed reproducible and **commit** it:
1. **Idempotent seed script** — `build/inline-add-edit-parts/seed/seed_inline.mjs` — **measure then fill**:
   check whether each fixture already exists, create only what's missing, tag `ZZAUTOTEST`. Drive it through
   the app's real create flows via the staging boot recipe.
2. **Seed manifest** — `build/inline-add-edit-parts/seed/SEED-MANIFEST.md` — list **every fixture created with
   the real id the app assigned** (each WO number + status, the roles→login map, each seeded part with its
   bins + on-hand + Default flag, the pricing-matrix category, the negative-bin part). This is what the tester
   reads and what lets you confirm the set is intact after a redeploy.
3. **Commit both** to `claude/slack-session-0sxnd9` after each chunk (Rule 29, path-scoped). Run the secret
   scan first (`python3 build/testing-tools/scan_secrets.py --staged`). **Never commit a cookie or token.**
4. **After a redeploy:** re-run `seed_inline.mjs`, then spot-check a case from each section in the UI, and
   update the manifest with any new ids.

## §5 · DONE means
Every §2 case's state is reachable in the staging UI by a tester following its steps; the manifest lists every
fixture by its real id; `seed_inline.mjs` rebuilds them idempotently; both are committed; and the non-seedable
items in §3 are named plainly as tester-technique, not faked.

**Standing holds still apply (Rule 107 does not move them):** no Jira/external artefact, no TestRail *case*
writes without the QA lead, **Vladimir's 11 cases never touched**, secrets never committed, production is not a
test environment.
