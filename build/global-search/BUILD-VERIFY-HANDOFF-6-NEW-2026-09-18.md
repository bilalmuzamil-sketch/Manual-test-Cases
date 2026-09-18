# HANDOFF → Build Verification: Global Search — 6 new cases (PERM-A..D + SL-1, SL-2) — 2026-09-18

**Source gate satisfied — clear to build-verify.** Evidence (Rule 86):
`build/global-search/FULL-COVERAGE-AUDIT-2026-09-18.md`,
`build/global-search/SOURCE-VERIFY-2026-09-16.md` (source-verify base).

**Spec:** PRD **576978945 v1.5** (Last Updated 2026-09-08), unchanged. §9 role-based access; §6.1/§6.2
ranking; §4 contact match; §7 fuzzy. Engineering decision log 2026-08-12 (permission filtering per the
Custom Roles & Permissions spec). Design: Claude Design `fac6efcf`.

**Run:** **R415** (Global Search V2 — Full Suite), now 186 cases; these 6 are in it.

---

## The 6 cases (all NEW, never build-verified; `AUTOMATION: READY`, marked "not yet build-verified")

| Case | Run test link | Folder |
|---|---|---|
| **C55718** — Typing the exact number of a record you cannot access does not surface it (no pinned top hit) | https://shopview.testrail.io/index.php?/tests/view/3073158 | Permissions and Role-Based Scoping (6734) |
| **C55719** — A contact-field match is hidden when you cannot access its parent company | https://shopview.testrail.io/index.php?/tests/view/3073159 | Permissions (6734) |
| **C55720** — A role missing several access areas hides all of them together and keeps the rest | https://shopview.testrail.io/index.php?/tests/view/3073160 | Permissions (6734) |
| **C55721** — A typo search does not leak a record you cannot access | https://shopview.testrail.io/index.php?/tests/view/3073161 | Permissions (6734) |
| **C55722** — A customer with more open work orders ranks above one with fewer | https://shopview.testrail.io/index.php?/tests/view/3073162 | Ranking and Prioritization (6726) |
| **C55723** — A result matched on its name ranks above one matched only on a secondary field | https://shopview.testrail.io/index.php?/tests/view/3073163 | Ranking (6726) |

For each: read the real on-screen labels/routes off the build and finalise (Rule 18/102); keep Expected
from the documents (Rule 57 — a build difference is a three-outcomes deviation, 62-b, not an Expected
rewrite); re-stamp the build line (Rule 54).

---

## Data seeding — REQUIRED (Rule 111 / Skill 20 / Rule 107; standing-authorised on QA/Staging)

- **C55718** — a role WITHOUT Work Orders access; one work order (visible to a permitted user) whose
  exact number you know. Confirm typing that exact number surfaces nothing for the restricted user.
- **C55719** — a customer that matches ONLY through a contact's phone/email (not the company name);
  a role WITHOUT Customers access. (Optionally a vendor contact match + no Vendor & Order Management.)
- **C55720** — a role missing MORE THAN ONE view bundle at once (e.g. no Work Orders AND no Vendor &
  Order Management); records of many types matching one keyword, spanning the missing and the kept areas.
- **C55721** — a part (visible to a permitted user) whose name a typo would match; a role WITHOUT
  Catalog & Inventory access.
- **C55722** — two customers matching one keyword equally by name, one with MANY open work orders, one
  with one/few. Use a unique keyword + a control so the order is unambiguous.
- **C55723** — two customers matching one keyword: one where the keyword is in the NAME, one where it
  matches only a secondary field (city/address), all else equal.

You are standing-authorised (Rule 107) to create/edit roles and permissions, seed/change/delete test
data, and switch between users on QA/Staging; tag `ZZAUTOTEST`, restore what is not the point of the test.

---

## Watch-outs on the build
- **OpenSearch index lag** — a newly seeded record takes a moment to become findable; allow the lag
  before asserting a MISS (matters for all 4 permission cases and both ranking cases).
- **Permission changes** — after editing a role, confirm the change has taken effect for the signed-in
  user (re-login if needed) before reading results.
- **Ranking is config-driven** (`search.yaml`) and can differ per environment — verify the ORDERING
  RULE (the right one is higher), not an absolute position or exact score (C55722, C55723).
- **Exact-ID pinned hit (C55718)** — check BOTH the pinned single row at the very top AND the groups;
  the leak this guards against is the pinned row specifically.
- **Contact match (C55719)** — the record matches on a contact field and returns the COMPANY row; the
  test is that the company row is hidden for the restricted user.

## OUT OF SCOPE for this pass (open questions, do NOT invent tests)
- Record-level "own records only" scoping (needs Custom Roles spec / PO).
- Page-search (in-page list) permission parity (ties to obsolete SV-9306 / open SV-9311).
- Quick-action button permission gating (§5.4, spec silent); location/workplace scoping
  (`OPEN-QUESTION-location-scope-2026-09-18.md`).

**No source blocker. Clear to proceed once seeding is in place.**
