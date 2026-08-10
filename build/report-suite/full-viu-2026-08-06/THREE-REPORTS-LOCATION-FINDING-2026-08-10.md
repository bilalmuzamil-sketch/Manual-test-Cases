# The Location column across all three handed-off reports — live finding, 2026-08-10

**Build observed:** `v3.5-4795eee` · `index.html` last-modified Fri 07 Aug 2026 13:10:42 GMT ·
etag `a80113cf3856c5fedf63be893e8b41c7`. Read at pass start (15:44Z) and mid-pass — **body
byte-identical, so the build did not move under this pass.**

**Sources (read live this pass, Rule 59):** Sales By Customer **Confluence v16** · Technician
Utilization **v7** · Work In Progress **v10** — version numbers taken from the Confluence
`metadata.version` field, not the in-body "Version" text (Rule 31(a)).

---

## What the documents require

All three specs were changed on **2026-08-06** to the **access-gated, toggleable** model, and
Chris Ward's answer of **2026-08-10** (Tab 1 item 1 = `A`) ratifies exactly that.

| Report | Requirement | Verbatim |
|---|---|---|
| SBC | **S4-R12** | *"The Location column applies only to a user who **has access to** more than one location… the column is **shown by default** and can be toggled on or off from the column selector, **regardless of how many locations are currently selected**."* |
| TU | **S9-R9** / **S10-R4** | *"…shown by default and can be toggled on or off from the column selector, and a user with access to only one location never sees it."* |
| WIP | **S4-R3** / **S7-R13** | *"The **Location** column is offered in the column selector to any user with access to more than one location; for that user it is shown by default and can be toggled on or off."* |

TU additionally pins the **position**: **S2-R1** *"the per-row Location column precedes them all as
the leftmost column"*; **S8-R15** *"renders as the **leftmost** column, before Technician"*.

---

## What the build does — observed live on screen, all three reports

The signed-in user has access to **five** locations (`/api/staff/my-workplaces` returns 5, and every
report's Location filter lists all five). So the access gate is satisfied in every case below.

| Report | Location filter = *All locations* | Location filter = *3rd Loc* (one) | Offered in column selector? |
|---|---|---|---|
| Sales By Customer | column **shown** (3rd, after Customer/Date) | column **GONE** | **No** — selector offers Date, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Margin, Margin % |
| Technician Utilization | column **shown**, but **2nd — after Technician** | column **GONE** | **No** — selector offers Total Hours, WO Hours, Internal Hours, Utilization %, Est. Lost Labor |
| Work In Progress | column **shown** (correct slot per S4-R1) | column **GONE** | **No** — selector offers WO #, Status, Customer, Asset, VIN, Advisor, Days Open, Last Activity, Labor Earned, Labor Remaining, Parts Earned, Parts Remaining, Earned, Remaining, Inv. Hrs |

### Three distinct deviations

1. **Visibility is gated on how many locations are SELECTED, not on what the user can ACCESS** — all
   three reports. This is the superseded *scope* model (option **B**, which Chris rejected).
2. **The Location column is not offered in the column selector at all** — all three reports — so it
   cannot be toggled on or off by anyone.
3. **Technician Utilization renders it second, after Technician**, where S2-R1 and S8-R15 both
   require leftmost. (SBC and WIP positions are consistent with their own specs.)

### The same gating is enforced server-side in the exports

- **TU**, one location selected, `columns=technician,location,total_hours` → the file comes back
  `Technician,"Total Hours"`. **`location` was requested explicitly and silently dropped.**
- **SBC**, one location selected → no Location column; `columns=` is ignored entirely by that endpoint.
- **WIP** honours an explicit `columns=…location…` at one location, so WIP's *export* is not gated —
  only its screen is.

Evidence files: `evidence/three-reports-2026-08-10/` (`tu-all.csv` vs `tu-one.csv`, `s1.csv` vs
`s2.csv`, `w1.csv` vs `w2.csv`, and the three `*-singleloc.png` screenshots).

---

## Controls run before calling this a defect

- **Persisted column selection ruled out.** The playbook warns a re-hydrated profile can fake a
  Location column. Every run above used a **fresh browser context** with only `user` and
  `fe_permissions_wrapper` seeded, so the selector contents are the build's defaults. The same result
  reproduced on three separate reports in three separate runs.
- **"Not toggleable" is not an artefact of the column being hidden.** The selector was opened while
  *All locations* was selected and the Location column **was on screen** — and it still was not listed.
- **Multi-location access confirmed two ways** — `my-workplaces` = 5, and each report's own filter
  lists 5.
- **A wrong first reading was caught and discarded.** `/api/labour-types` first appeared to show four
  of five locations with no default labor rate; switching the active workplace and re-reading proved
  the endpoint is **scoped to the active workplace**, and every one of the five does have a default
  rate. That would have been a false defect had the control not been run.

---

## Consequence for the three cases that were staged to come off hold

The staged plan was to unhold them to `AUTOMATION: READY`. **That would have been wrong** — under
Rule 57 the case keeps the documented expectation, and the build fails it.

| Case | C-id | Correct outcome |
|---|---|---|
| SBC-LOC-04 | C38912 | Rewrite to the access model, then **READY - EXPECT FAIL** |
| WIP-COL-02 | C30467 | Correct to on-by-default for multi-location access, then **READY - EXPECT FAIL** |
| WIP-PERS-05 | C43551 | It asserts the Location **toggle choice** is remembered. There is **no toggle**, so the case cannot pass → **READY - EXPECT FAIL** |

**No ticket has been filed** (Rule 62). The defect is written up ready to go in
`DEFECTS-FOR-PERMISSION.md`.
