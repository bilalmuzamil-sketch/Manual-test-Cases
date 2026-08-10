# Defects found, written up, NOT filed — awaiting the QA lead's permission (Standing Rule 62)

**Nothing in this file has been filed in Jira.** Rule 62 is absolute as of 2026-08-10: no ticket is
created without the QA lead's explicit permission, however real the defect. Each entry below is
written to the organisation's 7-section ticket format and is ready to paste the moment permission
is given.

**Build:** `v3.5-4795eee` · last-modified Fri 07 Aug 2026 13:10:42 GMT · etag
`a80113cf3856c5fedf63be893e8b41c7`. Marker read at pass start, mid-pass and end — **the body was
byte-identical every time, so the build did not move during this pass.**

**Screenshots and export files:** `evidence/three-reports-2026-08-10/`.

---

## ⚠️ Read this first — three of these already have tickets, and those tickets are CLOSED

The tickets behind the 52 expect-fail cases on the three handed-off reports were read live in Jira
on 2026-08-10: **31 of the 33 are `OBSOLETE` with resolution `Done`**; only **SV-8818** and
**SV-8823** remain `Ready to Fix`.

**Three of those closed tickets describe defects that I reproduced today on `v3.5-4795eee`.** Under
Standing Rule 57 a closed ticket is a decision about whether to fix — it is not a specification
change and it does not make the behaviour correct. So these are not new defects; they are **closed
tickets that still reproduce**, and the decision to reopen is the QA lead's.

| Ticket | Closed as | Still reproduces today? | Entry |
|---|---|---|---|
| **SV-8954** *"The Technician Utilization Location column disappears when o…"* | OBSOLETE / Done | **Yes — proven live** | D1 |
| **SV-8943** *"Technician Utilization opens on All locations instead of the…"* | OBSOLETE / Done | **Yes — proven live** | D3 |
| **SV-8967** *"Work In Progress: the WO number is plain text even for a use…"* | OBSOLETE / Done | **Yes — proven live** | D4 |

**My recommendation: SV-8954 is the one worth reopening**, and it should be broadened, because the
same fault is on all three handed-off reports, not just Technician Utilization.

---

## D1 · The Location column ignores the ratified access rule, on all three handed-off reports

**Existing ticket:** SV-8954 (Technician Utilization only) — **closed OBSOLETE, still reproduces,
and under-scoped.**

**1. What it is, in plain words.**
The specifications say the Location column should be decided by *what locations a person can reach*.
Anyone who can reach more than one location should see the column, should see it switched on to
begin with, and should be able to switch it off and on again from the column-selection control.
Instead the report decides by *how many locations are currently ticked in the Location filter*. Tick
one location and the column vanishes — even though the person can still reach five. And the column
is not listed in the column-selection control at all, on any of the three reports, so nobody can
switch it on or off by hand.

**2. Steps to reproduce.** Signed in as **Admin ShopView** (`admin@shopview.com`) on organisation
`d55bc308-e61a-438d-b5f1-c7a73c89d49f`, which has access to **five** locations — *QB Location*,
*4th Loc*, *3rd Loc*, *Staging Heavy Duty - 9919*, *Staging Lethbridge - 4310*. Use a browser
profile with no saved settings for the report.
1. Open the report (repeat for Sales By Customer, Technician Utilization, Work In Progress).
2. With the Location filter on **All locations**, read the column headers — a **Location** column is there.
3. Open the **Column Selection** control and read the list.
4. Set the Location filter to the single location **3rd Loc**.
5. Read the column headers again.

**3. Current behaviour.**
- Step 3 — Location is **not in the column-selection list** on any of the three reports. The lists are:
  - Sales By Customer: Date · Inv. Hrs · Labor Invoiced · Labor Margin · Parts Invoiced · Parts Margin · Shop Supplies · Margin · Margin %
  - Technician Utilization: Total Hours · WO Hours · Internal Hours · Utilization % · Est. Lost Labor
  - Work In Progress: WO # · Status · Customer · Asset · VIN · Advisor · Days Open · Last Activity · Labor Earned · Labor Remaining · Parts Earned · Parts Remaining · Earned · Remaining · Inv. Hrs
- Step 5 — the **Location column disappears** on all three, although the signed-in person still has
  access to five locations.
- The same gate is enforced server-side in the downloads: on Technician Utilization, asking for the
  column explicitly with `columns=technician,location,total_hours` while one location is selected
  returns a file headed `Technician,"Total Hours"` — **the request for `location` is silently dropped.**

**4. Expected behaviour, quoted from the ratified documents.**
- **Sales By Customer, Confluence v16, S4-R12:** *"The Location column applies only to a user who
  **has access to** more than one location… the column is **shown by default** and can be toggled on
  or off from the column selector, **regardless of how many locations are currently selected**."*
- **Technician Utilization, Confluence v7, S10-R4:** *"The per-row Location column is one of the
  toggleable columns for a user with access to more than one location: it is shown by default and can
  be toggled on or off from the column selector."*
- **Work In Progress, Confluence v10, S4-R3:** *"The **Location** column is offered in the column
  selector to any user with access to more than one location; for that user it is shown by default and
  can be toggled on or off."*
- **Chris Ward's answer of 2026-08-10** (Tab 1 item 1 = **A**) ratifies this same access-gated,
  toggleable model. Spec and product owner agree; the build does not follow either.

**5. Evidence.** `evidence/three-reports-2026-08-10/` — `tu-all.csv` vs `tu-one.csv`, `s1.csv` vs
`s2.csv`, and the screenshots `tu-singleloc.png`, `sales-by-customer-singleloc.png`,
`work-in-progress-singleloc.png`.

**6. Controls run before writing this up.** A fresh browser context was used for every run with only
the sign-in payload seeded, so a remembered column choice cannot explain it (the playbook records
that trap). The column-selection list was also read **while the Location column was on screen**, and
it still did not contain Location — so "not listed" is not a side effect of the column being hidden.
Multi-location access was confirmed twice, from `my-workplaces` and from the filter's own list.

**7. Affected test cases.** SBC-LOC-04 [C38912](https://shopview.testrail.io/index.php?/cases/view/38912) ·
TU-LOC-06 [C38915](https://shopview.testrail.io/index.php?/cases/view/38915) ·
WIP-COL-02 [C30467](https://shopview.testrail.io/index.php?/cases/view/30467) ·
WIP-FLT-09 [C38916](https://shopview.testrail.io/index.php?/cases/view/38916) ·
WIP-PERS-05 [C43551](https://shopview.testrail.io/index.php?/cases/view/43551) ·
SBC-COL-04 [C43550](https://shopview.testrail.io/index.php?/cases/view/43550).

---

## D2 · Technician Utilization puts the Location column in the wrong place

**1. What it is.** On Technician Utilization the Location column is drawn **second, after
Technician**. The specification requires it **first, before Technician**.

**2. Steps.** Open Technician Utilization with **All locations** selected and read the headers.

**3. Current behaviour.** `Technician · Location · Total Hours · WO Hours · Internal Hours ·
Utilization % · Est. Lost Labor` — on screen and in the downloaded CSV alike.

**4. Expected, quoted.** **TU v7, S2-R1:** *"When shown (per S9-R9), the per-row **Location** column
precedes them all as the leftmost column."* **S8-R15:** *"the per-row **Location** column renders as
the **leftmost** column, before Technician."*

**5. Evidence.** `evidence/three-reports-2026-08-10/tu-all.csv` (header row) and `tu-screen.png`.

**6. Note.** Sales By Customer and Work In Progress place their Location column consistently with
their own specifications; this one is Technician Utilization only.

**7. Affected cases.** TU-LOC-06 [C38915](https://shopview.testrail.io/index.php?/cases/view/38915) ·
TU-COL-01 [C30401](https://shopview.testrail.io/index.php?/cases/view/30401).

---

## D3 · Technician Utilization opens on "All locations", not the user's active location

**Existing ticket:** **SV-8943** — closed **OBSOLETE / Done**, still reproduces.

**1. What it is.** On a first visit the report should open scoped to the location the user is
currently working in. It opens on **All locations** instead.

**2. Steps.** Fresh browser profile, no saved settings. The application's location switcher reads
**Staging Heavy Duty - 9919**. Open Technician Utilization and read the Location filter.

**3. Current behaviour.** The filter reads **"All locations"**, with *All locations* ticked in the
list, and the report's own data request carries **no location parameter at all**.

**4. Expected, quoted.** **TU v7, S9-R2:** *"On a first visit (no saved selection — §3), it defaults
to the user's **currently active location** (the location currently selected in the application's
global location switcher)."*

**5. Evidence.** Captured request:
`GET /api/reporting/reports/technician-utilization?range=custom&start_date=2026-08-01&end_date=2026-08-10&pagination…`
— no `locations=`. Screenshot `tu-screen.png` shows the header location and the filter together.

**6. Control.** The browser context was fresh on every run, so this is a genuine first visit, not a
restored selection.

**7. Affected case.** TU-DISP-01 [C30394](https://shopview.testrail.io/index.php?/cases/view/30394).

---

## D4 · Work In Progress shows the WO number as plain text for a user who has Work Order permission

**Existing ticket:** **SV-8967** — closed **OBSOLETE / Done**, still reproduces.

**1. What it is.** The work-order number in the first column should be a link that opens the work
order. For a signed-in administrator — who plainly has Work Orders permission — it is plain text.

**2. Steps.** Open Work In Progress as **Admin ShopView** and try to click a WO number, for example
**S8582-16328** on the *Approved - Partially Completed* tab.

**3. Current behaviour.** The cell renders as
`<span data-test-id="text_wip_wo_91361601-cd63-41f6-b85e-8b27b4be8817">S8582-16328</span>`. There is
**no link element anywhere in the table body**, the mouse cursor stays as a normal arrow, and the
build's own test identifier calls the element **`text_wip_wo`** — text, not a link.

**4. Expected, quoted.** **WIP v10, S4-R5:** *"WO # is shown as a link that opens the work order in
the same browser tab… **only when the user has permission to access Work Orders**. A user without
Work Order permission sees the WO # as plain text, not a link."*

**5. Evidence.** `evidence/three-reports-2026-08-10/wip-checks.png` plus the captured element markup
above.

**6. Controls.** Three independent signals agree — no anchor element, cursor `auto` rather than
`pointer`, and the build's own `text_…` test identifier. Work Orders permission was confirmed from
the signed-in permission list.

**7. Affected cases.** WIP-COL-03 [C30468](https://shopview.testrail.io/index.php?/cases/view/30468) ·
WIP-A11Y-02 [C30523](https://shopview.testrail.io/index.php?/cases/view/30523) ·
WIP-PERM-02 [C43557](https://shopview.testrail.io/index.php?/cases/view/43557) *(the negative half —
this one may now pass for the wrong reason, since the number is plain text for everybody)*.

---

## D5 · Work In Progress tab labels are in Title Case; the specification writes them in sentence case

**1. What it is.** A wording difference in the four tab labels.

**2. Current behaviour.** *"Approved - Partially Completed (1)"* · *"Approved - Not Started (1)"* ·
*"Completed (0)"* · *"Estimates (0)"*.

**3. Expected, quoted.** **WIP v10, S1-R2:** *"…labeled (in order) "Approved - partially completed",
"Approved - not started", "Completed", and "Estimates"."*

**4. Honest assessment.** This is cosmetic and it is the kind of thing that is often the
specification's error rather than the build's. **It is listed for the QA lead's judgement and I do
not recommend a ticket for it on its own** — it is better handled as a wording correction to the
document, or rolled into another ticket if one is opened for this report.

**5. Affected case.** WIP-TAB-01 [C30455](https://shopview.testrail.io/index.php?/cases/view/30455)
*(title match only — not separately re-verified this pass)*.
