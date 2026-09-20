# Re-run on build v26.36.8-d146c39 — 20 September 2026

## 1 · The twelve permission checks and the four behaviour checks

Driver: `perm_driver.mjs` — eight phases, the technician's role changed one bundle at a time, the same
five queries measured each phase, checkpointed after every phase, **Technician restored and read back**
(`"restored": true`). Raw: `perm-results.json`.

Groups returned for `ZZAUTOTEST Fibridge` (`-` = the heading is not returned at all):

| phase | WO | Cust | Asset | Parts | Vend | PartSale | PO | VendInv |
|---|---|---|---|---|---|---|---|---|
| full access | 20 | 4 | 6 | 3 | 1 | 1 | 4 | 4 |
| Parts removed | 20 | 4 | 6 | **-** | 1 | 1 | 4 | 4 |
| Work Orders removed | **-** | 4 | 6 | 3 | 1 | 1 | 4 | 4 |
| Customers removed | 20 | **-** | **-** | 3 | 1 | 1 | 4 | 4 |
| WO + Vendor&Order removed | **-** | 4 | 6 | 3 | **-** | 1 | **-** | **-** |
| Financial Data removed | 20 | 4 | 6 | 3 | 1 | **-** | 4 | 4 |
| Part Sales removed | 20 | 4 | 6 | 3 | 1 | **-** | 4 | 4 |
| Vendor&Order removed | 20 | 4 | 6 | 3 | **-** | 1 | **-** | **-** |

The §4 bundle mapping holds in every row except one (below). Price presence with Financial Data removed
drops to **0** on parts (3→0), purchase orders (4→0) and vendor invoices (4→0).

**Recorded Passed:** C44877 · C44878 · C44879 · C44881 · C44882 · C55702 · C55703 · C55704 · C55705 ·
C55719 · C55721. **Recorded Failed:** C55706 (a Part sale row still carries no price — SV-10163, open).

## 2 · NEW, UNREPORTED — the Part sales heading disappears with the financial permission

`nofin.json`, measured by reading the role's own permission list back:

| role | holds `partSalesView` | holds `seeFinancialData` | Part sales heading |
|---|---|---|---|
| `ZZAUTOTEST No Financial Data` | **YES** | no | **MISSING** |
| `ZZAUTOTEST No Part Sales View` | no | YES | missing (correct) |

So a person who **is** allowed to see Part Sales but **not** financial data cannot see Part Sales in
search at all. §4/§6 make the heading's visibility a matter of *Part Sales: View*; *See Financial Data*
is supposed to mask the price, not remove the record. Positive control: with full access the heading is
present (1 row). **Not yet put to the QA lead — a report is held under Rule 62.**

## 3 · Quick actions on result rows do not exist on this build

Real pointer hover (`hover2.mjs`), with the instrument proved: the row **does** react (it gains
`search-row--selected`), so hover is registered. Buttons counted per row: **Work order 0 · Part 0 ·
Customer 0 · Vendor 0**, unchanged before and after, and the row's HTML does not change size.

Story **SV-9173** read live: **OBSOLETE**. PRD v1.5 (via the v1.3 entry) still lists quick actions as
in v1 scope for every entity, *"with View part history added to Part rows"*. Document and story
contradict each other, so Rule 112 forbids a defect and Rule 12 forbids a pass.
**C44866–C44873 recorded Blocked**, each naming the story, its live status, the read date, what was
observed, and the decision needed.

## 4 · C44854 re-checked after SV-10188 was marked QA Complete — still Failed

Work order `S9160-17671` carries a brake shoe kit and two transmission lines. Searching `Brake Shoe`
and `Transmission filter` from that work order page returns **the identical six rows, all scoring
1.00**, exactly as from a Customers page. §6.3's −0.10 demotion cannot show, because the rows are
already at the maximum and the subtraction happens before the clamp. **Same root cause as SV-10277.**

## 5 · Still to measure

| Check | Why not yet done |
|---|---|
| C44880 tenant isolation | needs a record belonging to a second tenant to prove absence against (Rule 104 — no positive control yet) |
| C55717 recent searches respect current access | needs a search made under full access, then the role narrowed, then the recents list read |
| C55718 an exact record number does not surface a record you cannot reach | needs the Work Orders bundle removed and `S9160-17670` typed |
