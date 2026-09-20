# SEQUENCED HANDOFF — Global Search new cases: STAGE 1 DATA SEEDING → STAGE 2 BUILD VERIFICATION (2026-09-20)

**New workflow (this supersedes the split handoffs):** the **Data-Seeding session runs FIRST**. Only when
its seed-verify passes for a group does that group move to the **Build-Verification session**. Nothing is
build-verified before its data is seeded AND confirmed findable in search.

**Scope:** 39 new cases authored this session, all in run **R415**, all `AUTOMATION: READY` but **not yet
build-verified**. All `created_by=3` (ours). Spec: PRD **576978945 v1.5** (§4/§6/§7/§9), engineering
decision log 2026-08-12. Environment: QA branch **sv9160** (customer-portal cases excluded — none here).

**Standing authorisation (Rule 107):** on QA/Staging the seeding session may create/change/delete test
data AND create/edit roles and assign them to users. Tag everything **`ZZAUTOTEST`**; restore what is not
the point of the test. **OpenSearch index lag:** after seeding, allow up to ~30s before a record is
findable — never call a MISS until it has indexed (Rule 104).

---

## STAGE 1 — DATA SEEDING (do this first, verify, then release each group)

### 1a. Roles (build these once — several cases reuse them)
Pairs of roles identical except ONE access bundle (or one user you can toggle):
full-access · minus **Catalog & Inventory: View** · minus **Work Orders: View** · minus **Customers: View**
· minus **Part Sales: View** · minus **Vendor & Order Management: View** · minus **See Financial Data** ·
a **TimeClock-only** user · a role that can see SOME but not all records of one type (for the count case).

### 1b. Records to seed, by group (unique `ZZ…` keyword per case; seed, then VERIFY findable)
| Group | Cases | Seed (summary — full detail in the per-group docs) |
|---|---|---|
| Permissions — positive | C55702–C55706 | one visible record per area (WO, customer+asset, part sale, vendor+PO+invoice, a priced row) findable by the WITH-access role |
| Permissions — recent list | C55717 | open a record as permitted, then remove that access |
| Permissions — edges | C55718–C55721 | forbidden record with known exact number; contact-only match; role missing ≥2 bundles; part matching a typo |
| Permissions — strict toggle | C55731–C55737 | ONE record per area + the role pair that differs by only that one access; plus a some-but-not-all set for the count case |
| Ranking signals | C55707–C55712, C55716 | per-signal record pairs (open-WO, recent, paid, mine, in-stock, count magnitude, tie-break) |
| Ranking edges | C55722, C55723, C55729, C55730 | count magnitude; name-vs-secondary; exact-ID + competing strong name; 20+ with one low-ranked target |
| Fuzzy | C55713–C55715, C55725–C55728 | short query; PO#/invoice# exact; description typo; unrelated word; accented name; dashed/apostrophe name; phonetic-on-a-part |
| Per-tab prefix | C72120, C72121, C72122 | THREE parts / vendors / vehicles each — begins-with / contains / typo, identical otherwise |

Detailed seed recipes already written and committed:
`DATA-SEEDING-HANDOFF-PERMISSIONS-2026-09-18.md`, `DATA-SEEDING-HANDOFF-ALGO-2026-09-18.md`,
`BUILD-VERIFY-HANDOFF-PER-TAB-2026-09-20.md` (seeding section), plus the shared seed universe in
`build/global-search/seeding/` (`seed-manifest-toggle.json`, `verify_toggle.py`, `reseed_everything.sh`).

### 1c. Seed-verify gate (per group) — REQUIRED before Stage 2
For every case: run the search once and confirm the seeded record(s) appear for the permitted role (and,
for negative/permission cases, do NOT appear for the restricted role) — before releasing the group. If a
record is missing for BOTH roles, it is a seed/index problem, not a finding — fix it here. Record exact
seeded identifiers (WO number for C55718/C55732; the sound-alike chosen for C55728) and correct ONLY the
identifier in the case if it differs (Rule 112).

**→ A group passes Stage 1 only when its seed-verify is green. Then it goes to Stage 2.**

---

## STAGE 2 — BUILD VERIFICATION (only after a group's Stage-1 gate is green)

For each case: read the real on-screen labels/routes off the build and finalise (Rule 18/102); keep
Expected from the documents — a build difference is a three-outcomes deviation (Rule 62-b), never an
Expected rewrite (Rule 57); re-stamp the build line (Rule 54). Ranking is config-driven, so verify the
ORDER RULE (the right one is higher), not an absolute score. Per-tab cases: open that entity's scope tab
and read the order there.

### Case list with run links
**Permissions (folder: Permissions and Role-Based Scoping)**
- C55702 /tests/view/3050562 · C55703 /3050563 · C55704 /3050564 · C55705 /3050565 · C55706 /3050566
- C55717 /3051909 · C55718 /3073158 · C55719 /3073159 · C55720 /3073160 · C55721 /3073161
- C55731 /3077889 · C55732 /3077890 · C55733 /3077891 · C55734 /3077892 · C55735 /3077893 · C55736 /3077894 · C55737 /3077895

**Search logic — Ranking (folder: Ranking and Prioritization)**
- C55707 /3050567 · C55708 /3050568 · C55709 /3050569 · C55710 /3050570 · C55711 /3050571 · C55712 /3050572
- C55716 /3051908 · C55722 /3073162 · C55723 /3073163 · C55724 /3075523 · C55729 /3075528 · C55730 /3075529
- C72120 /3088559 (Parts tab) · C72121 /3088560 (Vendors tab) · C72122 /3088561 (Assets tab)

**Search logic — Fuzzy (folder: Fuzzy Matching)**
- C55713 /3050573 · C55714 /3051906 · C55715 /3051907 · C55725 /3075524 · C55726 /3075525 · C55727 /3075526 · C55728 /3075527

(Full URL form: `https://shopview.testrail.io/index.php?/tests/view/<id>`.)

**Out of scope (open PO questions — do not invent tests):** own-records-only scoping; page-search
permission parity; quick-action permission gating; location/workplace scoping; open-WO-count "open"
definition. See the OPEN-QUESTION docs in `build/global-search/`.

**No source blocker. Seed first (Stage 1), gate, then build-verify (Stage 2).**
