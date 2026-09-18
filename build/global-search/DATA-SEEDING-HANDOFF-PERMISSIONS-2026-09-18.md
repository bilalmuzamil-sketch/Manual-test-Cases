# DATA-SEEDING HANDOFF — Global Search strict permission cases (7 new, 2026-09-18)

For the 7 strict permission cases (C55731–C55737) in run **R415**. Method: `build/skills/20-FEATURE-DATA-SEEDING.md`
+ Rule 111. Standing-authorised on QA/Staging (Rule 107): create/change/delete test data AND
create/edit roles and assign them to users; tag everything **`ZZAUTOTEST`**; restore what is not the
point of the test. **OpenSearch index lag: after seeding, allow up to ~30s before a record is findable —
never call a MISS until the record has had time to index (Rule 104).**

## The core seeding job here is ROLES, not just records
These cases turn on flipping ONE permission with everything else identical. So the key artefact is a
**pair of roles that differ by exactly one access bundle** (or one user whose single bundle you can turn
off between runs). Build a reusable set:

| Role pair needed | Differ ONLY by | Serves |
|---|---|---|
| Full-access role vs. same minus **Catalog & Inventory: View** | Parts view | C55731 |
| Full-access vs. same minus **Work Orders: View** | Work Orders view | C55732 |
| Full-access vs. same minus **Customers: View** | Customers+Assets view | C55733 |
| Full-access vs. same minus **Part Sales: View** | Part Sales view | C55734 |
| Full-access vs. same minus **Vendor & Order Management: View** | Vendors+POs+VIs view | C55735 |
| Full-access vs. same minus **See Financial Data** | price visibility | C55736 |
| A role that can see SOME but not ALL matching records of one type | (record-level restriction) | C55737 |

Give each pair the SAME everything else; change only the one bundle. Name them clearly, e.g.
`ZZAUTOTEST full` and `ZZAUTOTEST no-parts`, so the tester knows which is which.

## Records to seed (one distinctive keyword each, tagged ZZAUTOTEST)
| Case | Record(s) | Query | The check |
|---|---|---|---|
| C55731 | one part `ZZTOGPART Brake Kit` | `ZZTOGPART` | appears with Parts view, gone without — SAME part |
| C55732 | one work order with a known number, customer `ZZTOGWO` on it | `ZZTOGWO` (or the WO number) | appears with WO view, gone without |
| C55733 | one customer `ZZTOGCUST Freight` that owns one vehicle (asset) `ZZTOGCUST` | `ZZTOGCUST` | customer AND vehicle both appear with Customers view, both gone without |
| C55734 | one part sale for a customer `ZZTOGPS` | `ZZTOGPS` | appears with Part Sales view, gone without |
| C55735 | one vendor `ZZTOGVEN` that has one purchase order and one vendor invoice | `ZZTOGVEN` | vendor + PO + invoice all appear with Vendor & Order Mgmt view, all gone without |
| C55736 | one part `ZZTOGPRICE Filter` with a real price set | `ZZTOGPRICE` | price shown with See Financial Data, masked without; the ROW still shows both times |
| C55737 | several parts on `ZZCOUNT` where the chosen role can see some but not one of them (put the restricted one behind a bundle the role lacks, or a record-level limit) | `ZZCOUNT` | the group/tab count equals only what the role may see; the restricted one is neither shown nor counted |

## After seeding — verify before running (Rule 104)
- For each toggle case, FIRST confirm the record appears for the WITH-access role (positive control),
  THEN confirm the same record is gone for the WITHOUT-access role. If it is missing for BOTH, the seed
  or the index is the problem, not permission — fix that before recording a result.
- For C55736 confirm the ROW appears in both runs and only the price differs.
- For C55737 count the rows and compare to the shown count for the restricted role.
- Record the exact seeded identifiers (the WO number for C55732) and correct only the identifier in the
  case if the seeded value differs (Rule 112).

## Scope note
This covers the 7 strict permission cases (C55731–C55737). The other permission cases (C44877–C44882,
C55702–C55706, C55717–C55721) are described in `BUILD-VERIFY-HANDOFF-PERMS-SEARCHLOGIC-2026-09-18.md`
and `BUILD-VERIFY-HANDOFF-6-NEW-2026-09-18.md`; the 7 search-algorithm cases in
`DATA-SEEDING-HANDOFF-ALGO-2026-09-18.md`.
