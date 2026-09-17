# HANDOFF → DATA-SEEDING SESSION — Global Search: Permissions (6734) + Ranking (6726) + Fuzzy (6725)
### Seed the **sv9160 QA branch** so all 41 cases in these three folders can be RUN. 2026-09-17.

**You are the seeding session.** Build verification is done (41/41 runnable, stamped `v26.36.7-29ca209`, render
clean). What is missing is the **data each case needs to be executed**. Your job: create it on **`sv9160` and
nowhere else**, verify each search returns what the case expects, and **save a re-runnable seed script + manifest
so the data survives a branch redeploy.**

- **Scope:** 41 cases — Permissions & Role-Based Scoping (6734, 12) · Ranking & Prioritization (6726, 15) ·
  Fuzzy Matching (6725, 14). All `created_by=3`. Run **R415**.
- **EXCLUDE — do not touch:** 6769, 6774, 8056, Vladimir Tomovic's cases (section 49), C45140 (Rule 38).
- **Branch:** `https://sv9160.qa.shopview.com` **ONLY** — a dummy QA branch; you have **FULL CRUD authority**
  here (QA lead), including **creating roles and assigning them to staff** (Rule 107). Do NOT seed staging or
  production. Tag throwaway names `ZZAUTOTEST` where a name field allows it (Rule 6).
- **Access:** `source build/testing-tools/ensure_bridge.sh`; `sv_sso_session` in `/tmp/qa-cookies/sv9160-sso.txt`
  (chmod 600, /tmp only, NEVER committed — Rule 82); `node build/testing-tools/qa-branch-boot.mjs sv9160 <route> admin`.
  Reuse `build/global-search/probe_gs_surfaces.mjs`; labels in `build/OBSERVED-UI-LABELS-sv9160.md`.

## 🛑 READ FIRST
1. **Much of the base data already exists** (a seeding session has run: `ZZAUTOTEST` → 58 results across all 8
   groups; the 11 fuzzy records from the 9/16 pass are present). So **MEASURE THEN FILL** — search first, add only
   the delta. Do NOT re-create what is there.
2. **V2 search is OpenSearch** — a new record takes a moment to be findable; allow index lag before asserting.
3. **Every RANKING case needs its OWN unique keyword** (e.g. `ZZRANKA`, `ZZRANKB`…) shared ONLY by that case's
   2–3 control records, so the order is unambiguous and not polluted by other data. This is the single most
   important rule for the ranking folder — one shared distinctive token per case, nothing else matching it.
4. **Counts cap at 20**; ranking is about the ORDER of rows within a group, so 2–3 records per case is enough.

## §1 · PERMISSIONS (6734) — roles + users, one per bundle
Create named test roles (each missing exactly one View bundle) and **assign each to its own staff login**;
record login → role in the manifest. The POSITIVE new cases (C55702–06) are satisfied by any user who HAS the
bundle — the existing **admin** covers them — but seed the reduced users so the NEGATIVE cases run too.
| id | Role / user | Serves |
|---|---|---|
| **U-ALL** (admin) | every bundle incl. See Financial Data | C55702, C55703, C55704, C55705, C55706, C44877 (positives + prices) |
| **U-NO-WO** | role WITHOUT `Work Orders: View` | C44879 |
| **U-NO-PARTS** | technician WITHOUT `Catalog & Inventory: View` | C44878 |
| **U-NO-PARTSALES** | WITHOUT `Part Sales: View` | C44882 (one bundle removed in turn) |
| **U-NO-CUSTOMERS** | WITHOUT `Customers: View` (hides Customers AND Assets) | C44882 |
| **U-NO-VENDORORDER** | WITHOUT `Vendor & Order Management: View` (hides Vendors, POs, Vendor Invoices) | C44882 |
| **U-NO-FINANCIAL** | WITHOUT `See Financial Data` (prices masked) | C44882, and the inverse of C55706 |
| **U-TIMECLOCK-ONLY** | a TimeClock-only role (zero search bundles) | C44882 |
| **U-ZERO-TYPE** | a role/tenant with **zero accessible records of one type** (e.g. no Part Sales) | C44881 |
| **SECOND TENANT** | a second organisation carrying records with the **same searchable text** | C44880 (tenant isolation), and the per-tenant recent list (C44860, out of this scope) |
| **C55717 fixture** | a user who **opens a record, then loses access** to that record's area (remove the bundle, or use a comparable user who lacks it) | C55717 (recent list must drop it) |
> If the branch has only one organisation, **C44880's second tenant is not seedable** — say so plainly, don't fake it.

## §2 · RANKING (6726) — controlled records, ONE unique keyword each
For each case, seed the 2–3 records below so they **all match one distinctive keyword and differ in exactly one
signal**. Verify the ORDERING RULE (the right row is higher), not an absolute position (§6.1 weights are
environment-switchable). Suggested keywords in brackets — use any token nothing else matches.
| Case | Seed (one shared keyword) | The one signal that differs |
|---|---|---|
| **C55707** [`ZZRANKQ`] | 3 records SAME entity type: one whose name **starts** with the keyword; one with the keyword as a **whole word** mid-name; one that is a **typo** of the keyword | prefix > whole-word > fuzzy |
| **C55708** [`ZZRANKC`] | 2 customers: one **with an open work order** and **opened by you recently**; one with neither | open-WO + recently-viewed lift |
| **C55709** [`ZZRANKV`] | 2 assets (vehicles): one **attached to an open work order** (and viewed recently); one not (even if newer model year) | open-WO lift beats model-year tiebreak |
| **C55710** [`ZZRANKN`] | 2 vendors: one **with open purchase orders** (used recently); one with none | open-PO + recent-use lift |
| **C55711** [`ZZRANKS`] | several part sales: a **recent** one, an **old** one (>~1 week), one **you created**, one **Paid** | recency dominates; +small lift for yours and for Paid |
| **C55712** [`ZZRANKP`] | 2 **in-stock** parts: one **sold/used or viewed recently** (and/or with a bin location); one with no recent activity | recent-activity (and bin) lift — separate from in-stock-vs-out |
| **C55716** [`ZZRANKT`] | 2 records SAME type, **otherwise identical** matches; **update one more recently** than the other | most-recently-updated wins the tie |
| C44850 [exact id] | a Work Order whose **number equals the query** (exact identifier) | exact id pins as a single row at the very top |
| C44851 [`ZZRANKW`] | ≥2 Work Orders: one **open/active + recently updated**; one **old + Completed/Invoiced** | active+recent ranks first |
| C44852 [`ZZRANKI`] | 2 parts: one **in stock**, one **out of stock** | in-stock ranks above out-of-stock (out not hidden) |
| C44853 | a Customer that **owns assets + work orders**, plus other customers with similar-matching assets/WOs; open that customer's page | on a customer page, their records are boosted |
| C44854 | a Work Order that **already has parts on it**, plus other matching parts (some same category); open that WO's page | parts already on the WO are pushed down |
| C45137 [`ZZRANKO`] | ≥2 Purchase Orders: one **Ordered** (not received), one **Received**; one recent, one weeks old | Ordered + recency rank higher |
| C45138 [`ZZRANKU`] | ≥2 Vendor Invoices: one **Unpaid**, one **Paid**; one recent, one older | Unpaid first, then recency |
| C45139 [`ZZRANKF`] | a customer matched ONLY by a **contact's** phone/email (its company name does NOT contain the value) | contact-field match scores as a secondary-field match on the company |

## §3 · FUZZY (6725) — specific records (most already exist; verify then fill)
| Case | Record needed | Search the tester types |
|---|---|---|
| C44839 | a customer/vendor named containing **Peterson** | `Petersn` |
| C44840 | a record containing **Aabridge** | `Abrige` |
| C44841 | an asset/part text containing **Freightliner** | `frieghtliner` |
| C44842 | a record containing **Fibridge** | `Filbridge` |
| C44843, C44847, C44850 | Work Order **S2-15276** exists; **NO S2-15286 / S2-15266** | `S2-15276`, `S2 15276`, `S2-15286` |
| C44844 | an asset with a **known VIN/serial** (record it) | the exact VIN, and one char off |
| C44845 | a customer with telephone **(264) 328-6723** | `2643286723` |
| C44846 | a part with part number **65547** | `65547` |
| C44848 | any record reachable only by fuzzy (e.g. Peterson) | `Petersn` → the `≈close match` indicator |
| C44849 | Part Sale **P2-58**; **NO P2-59** | `P2-58`, `P2-59` |
| **C55713** [`ZZFZ`] | a record with a **short name 2–3 letters** one letter off a query, AND a **longer name 4+ letters** one edit off | the 2–3-letter query (no noisy match) vs the 4+ query (does match) |
| **C55714** | a **Purchase Order with a known number** AND a **Vendor Invoice with a known number** (an INV already exists, e.g. INV-0000097; provide a real PO number) | exact number → found; one char off → NOT found |
| **C55715** | a part whose **description carries a distinctive word** (e.g. **Alternator**; one already exists) | `Altenator` (typo) → still finds it, matched text highlighted |

## §4 · PER-CASE COVERAGE — every one of the 41, its fixture
**6734 Permissions (12):** C44877→U-ALL(+parts) · C44878→U-NO-PARTS · C44879→U-NO-WO · C44880→SECOND TENANT ·
C44881→U-ZERO-TYPE · C44882→U-NO-PARTSALES/CUSTOMERS/VENDORORDER/FINANCIAL/TIMECLOCK (each bundle in turn) ·
C55702/C55703/C55704/C55705/C55706→U-ALL (positives) · C55717→C55717 fixture.
**6726 Ranking (15):** each case → its §2 row (C44850, C44851, C44852, C44853, C44854, C45137, C45138, C45139,
C55707, C55708, C55709, C55710, C55711, C55712, C55716).
**6725 Fuzzy (14):** each case → its §3 row (C44839–C44849, C55713, C55714, C55715).

## §5 · 🛑 SAVE THE SEED SO IT SURVIVES A REDEPLOY
1. **Idempotent seed script** — `build/global-search/seed/seed_perms_ranking_fuzzy.mjs` — **measure then fill**
   through the app's real create flows on `sv9160`; tag `ZZAUTOTEST`; one unique keyword per ranking case.
2. **Manifest** — `build/global-search/seed/SEED-MANIFEST-PERMS-RANKING-FUZZY.md` — list every created record and
   role by the **real id/number/keyword the branch assigned** (the role→login map, each ranking keyword + its
   records + the differing signal, each fuzzy record + its number/VIN/phone, the second-tenant status).
3. **Commit both** to `claude/slack-session-0sxnd9` after each chunk (Rule 29, path-scoped). Secret-scan first
   (`python3 build/testing-tools/scan_secrets.py --staged`). **Never commit a cookie or token.**
4. **After a redeploy:** re-run the script, allow OpenSearch to index, re-verify a sample per folder, update the
   manifest with new ids.

## §6 · DONE means
Every §4 case's search returns what its case expects on `sv9160` (allowing index lag); the ranking orders are
unambiguous because each uses its own keyword; the manifest lists everything by real id; the script rebuilds it
idempotently; both are committed; and the non-seedable items (second tenant if only one org exists) are named
plainly, not faked.

**Standing holds still apply:** no Jira/external artefact, no TestRail *case* writes without the QA lead,
Vladimir's cases never, secrets never committed, production is not a test environment. All on `sv9160` only.
