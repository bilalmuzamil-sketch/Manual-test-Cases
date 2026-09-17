# HANDOFF → Build Verification: Global Search — Permissions + Search Logic — 2026-09-17

**Source gate is satisfied — clear to build-verify.** Confirm from committed evidence (Rule 86):
`build/global-search/source-verify-2026-09-16/SOURCE-VERIFY-2026-09-16.md`,
`build/global-search/algorithm-and-perms-coverage-2026-09-17.md`,
`build/global-search/permissions-coverage-2026-09-17.md`.

**Spec:** PRD **576978945 v1.5** (Last Updated 2026-09-08), unchanged. §9 role-based access + tenant
isolation; §6 Ranking; §7 Fuzzy Matching. Design: Claude Design `fac6efcf`.

**Run:** **R415** (Global Search V2 — Full Suite), now 181 cases, holds all cases below.

---

## Scope — three folders under "Global Search - Enhancement (Aug 2026)" (6720)

| Folder (section) | Cases | Of which NEW (first build-verify) |
|---|---|---|
| **Permissions and Role-Based Scoping** (6734) | 12 | C55702, C55703, C55704, C55705, C55706, C55717 |
| **Ranking and Prioritization** (6726) | 15 | C55707, C55708, C55709, C55710, C55711, C55712, C55716 |
| **Fuzzy Matching** (6725) | 14 | C55713, C55714, C55715 |

**16 cases are freshly authored (2026-09-17) and have NEVER been build-verified** — they carry
`AUTOMATION: READY` with a provenance note "not yet build-verified". These are the priority: read the
real on-screen labels/routes off the build and finalise them (Rule 18/102). The other 25 cases were
build-checked 2026-09-16 (`v26.36.7-21b4db9`); re-verify them too if doing a full pass (Rule 101 — no
delta), and **re-stamp the build line on every case you verify** (Rule 54).

**EXCLUDE — do not verify or touch:** 6769 V1 Regression Suite · 6774 Quick Actions on Hover (v1) ·
8056 V1 Regression derived. Vladimir's cases in parent section 49 are hands-off (Rule 38).

---

## Data seeding — REQUIRED before these can be verified (Rule 111 / Skill 20 / Rule 107)

Most of these cases need seeded state that does not exist by default. You are standing-authorised to
create it on QA/Staging (Rule 107): create/change/delete test data, **edit roles and permissions and
assign them to staff**, tag `ZZAUTOTEST`, restore what is not the point of the test.

- **Permissions cases need roles/users per bundle.** You need users whose role has (and separately
  lacks) each view bundle: Work Orders: View · Part Sales: View · Customers: View (gates Customers AND
  Assets) · Catalog & Inventory: View (Parts) · Vendor & Order Management: View (gates Vendors, POs AND
  Vendor Invoices) · See Financial Data (gates prices). And a TimeClock-only user (C44882).
- **C55717 (recent-searches access)** needs: open a record as a permitted user, then remove that access
  (or use a comparable user who lacks it) and check the recent list.
- **Ranking cases need controlled records** — two/several records that match one query where only ONE
  signal differs (open work order vs none; recently viewed vs not; recent vs old; Paid vs not;
  created-by-you vs not; in-stock vs out; prefix vs whole-word vs typo match). Seed with a unique
  keyword and a control record so the ordering is unambiguous.
- **Fuzzy cases** need records with the specific names/numbers/descriptions the steps name (a PO number,
  a vendor-invoice number, a part whose description carries a distinctive word).

---

## Watch-outs on the build

- **No QA build was observed during source verification**, so on-screen labels/routes on the new cases
  are PROVISIONAL — read the real labels off the build and finalise (Rule 18/102).
- **V2 search runs on OpenSearch**, not the app DB — records are copied in, so a newly seeded record
  takes a moment to become findable, and search can be down while the rest of the app works. Seed, then
  allow index lag before asserting a miss (this matters especially for the ranking/permission cases).
- **Ranking is a set of environment switches** (`search.yaml`) so two environments can rank
  legitimately differently — verify the ORDERING RULE holds (the right one is higher), not an absolute
  position, and treat the weights as the spec states them (§6.1), not the build's exact scores.
- **Prices (C55706 / C44882)** — confirm the "See Financial Data" permission is what gates price
  fields, and read the masked vs shown treatment off the build.
- **Expected Results still come from the documents (Rule 57).** If the build differs, keep the
  documented expectation and raise it as a three-outcomes deviation (Rule 62-b) — do not rewrite Expected
  to match the build.

---

## One item NOT in scope — a product-owner question, not a test

Quick-action buttons on a result row (e.g. "New work order", "Receive") — the spec (§5.4) does not
define which permission gates which quick action, nor whether search re-checks action permissions. No
case was written (Rule 58); it is held as a PO question. Do not invent a test for it during this pass.

**No source blocker. Clear to proceed once seeding is in place.**
