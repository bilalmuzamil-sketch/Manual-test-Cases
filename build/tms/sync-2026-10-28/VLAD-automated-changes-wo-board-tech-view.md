# For Vlad — Automated cases changed in TMS, 2026-10-28

Suite: **WO Board and Tech View (Sep 2026)**. On the QA lead's go-ahead (*"Yes"*, 2026-10-28), these 12 cases
**marked Automated in TestRail** were updated **in TMS only** to match TestRail. **Nothing was changed in TestRail.**

| Case | TMS link | Title | What changed in TMS |
|---|---|---|---|
| C96953 | https://tms.shopview.com/cases/96953 | Each Board column scrolls on its own and technicians are never hidden | title; Automation status Not Automated -> Automated; Automation type Functional -> E2E |
| C96967 | https://tms.shopview.com/cases/96967 | A user without create and edit cannot drag or reassign work orders | title |
| C236979 | https://tms.shopview.com/cases/236979 | Owner cannot drag an Invoiced work order to another technician on Board View | steps |
| C368147 | https://tms.shopview.com/cases/368147 | A user without Work Orders create and edit cannot drag work orders | title |
| C674226 | https://tms.shopview.com/cases/674226 | A group's work orders made with their lead follow List's default order | references |
| C682419 | https://tms.shopview.com/cases/682419 | Board View's sideways scroll bar is thick and its handle is never tiny | references; Automation type: **NOT changed** — TMS kept E2E although TestRail says None (see note) |
| C682420 | https://tms.shopview.com/cases/682420 | Design- Tech View count bubbles sit on the status label as in List, any density | references; Automation type: **NOT changed** — TMS kept E2E although TestRail says None (see note) |
| C682421 | https://tms.shopview.com/cases/682421 | First Tab goes to the work order even when it is far down or off to the side | references; Automation type: **NOT changed** — TMS kept E2E although TestRail says None (see note) |
| C707079 | https://tms.shopview.com/cases/707079 | Escape closes the Technician list, also after clicking into its search box | title; Automation status Not Automated -> Automated; Automation type Functional -> Unit |
| C724216 | https://tms.shopview.com/cases/724216 | SV-11720 - Tech View with a wrapped toolbar fits the window and the page does not scroll | Automation status Not Automated -> Automated; steps |
| C724217 | https://tms.shopview.com/cases/724217 | SV-11710 - Tech View keeps Create Work Order on the tab row from 1440 px | Automation status Not Automated -> Automated |
| C724218 | https://tms.shopview.com/cases/724218 | SV-11710 - The filter bar scroll arrow goes away once the chips fit again | Automation status Not Automated -> Automated |

**Note:** for C682419, C682420 and C682421, TMS answered 200 to setting Automation type to None (0) but kept
E2E (1) — tried twice. The TMS API document does not describe this. It may be a TMS rule that an Automated case
must have a type; that is for whoever owns TMS to confirm.
