# OBSERVED UI LABELS — sv8683.qa.shopview.com, build `v26.35.9-5700a76`, Simple Flow V2 (group 6665)

**What this file is for.** Same contract as `OBSERVED-UI-LABELS-sv9315.md`: the labels **actually seen on
the build, verbatim**, each with where it was seen and its committed evidence. `check_precond_labels.py`
compares a suite's quoted labels against this list. A label goes in **only** from a probe with committed
evidence — never from an API field name, a spec, or a repo note.

**🛑 NEVER change the Admin role** (it is the full-access build-verify login; on sv8683 Admin =
`fe_permissions` 43, template administrator). To test a specific role, change `TECH@shopview.com` —
reset-then-assign. (LEARNINGS-LOG L0006/L0008.)

## Top navigation and global chrome
| Label | Where | Evidence |
|---|---|---|
| `Work Orders` · `Schedule` · `Customers` · `Parts` · `Reports` | top menu | sf_walk1, wo-lines-sv8683.png |
| `Clock In` · `Notifications` | top menu | sf_walk1 |

## Work Orders list
| Label | Where | Evidence |
|---|---|---|
| `All` · `Estimates` · `Work Orders` · `Completed` | tabs on the Work Orders list | sf_walk1 |

## The work order detail — tabs
| Label | Where | Evidence |
|---|---|---|
| `Lines` · `Parts` · `Notes` · `Timesheets` · `History` · `Stats` · `Finance` | tabs on an open work order (counts in brackets, e.g. `Lines (1)`) | sf_walk1, wo-lines-sv8683.png |

## The work order Lines screen
| Label | Where | Evidence |
|---|---|---|
| `New Line` · `Complete` | line toolbar / line row | sf_walk1 |
| `Start` | a line's Labor row | sf_walk1 |
| `Pick` | a part row action | sf_walk1 |
| `more_vert` (aria `Part context menu`) | right end of a part row | sf_walk1 |
| `more_vert` (aria `Add labor fee or discount`) | a line's row | sf_walk1 |
| line status badge `Approved` | on the line | sf_walk1, BADGES |
| part status badge `In stock` | on a part row | sf_walk1, BADGES |

**Part status badges to confirm as seeded:** `In stock` (seen) · `Requested` · `Needs Approval` ·
`Ordered` / `Auth To Order` · `Received` — to be observed on seeded parts in the relevant states.

---

## TO CONFIRM (next probes) — screens the cases need
- **Settings** for completion rules: "Require receiving parts before completion", "Require Review",
  "Require Tech Story / Mileage / Engine Hours" (App Settings / Work Order Settings).
- **Receiving** flow (from a WO + Purchase Order pages + "Receive later").
- **Completion wizard** + **Finish** action.
- **Bulk action bar** (multi-select on Lines).
- **Part rows/menus** (the `Part context menu` items) + **Reordering**.
- **Permissions** (Owner/Admin, Pick Parts, Order Parts, See Financial Data, Order Mgmt).
