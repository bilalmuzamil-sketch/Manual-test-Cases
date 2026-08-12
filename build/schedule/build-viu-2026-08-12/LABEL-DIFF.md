# Schedule — label diff, 2026-08-12

**Build `v3.5-65d6500`**, byte-identical at start, mid-run and end.
**Location `Staging Heavy Duty - 9919`**, confirmed on screen before every observation.

Every label below was read as a **RAW TEXT NODE** with the CSS `text-transform` in force recorded
beside it. **A screenshot cannot settle casing on these panels** — the 11 August pass proved it, and
today's staff dialog proves it again: the stored string is `Dev Tools`, `First name`, `active(96)`;
the screen paints `DEV TOOLS`, `First Name`, `Active(96)`.

---

## 1 · THE FIVE DIALOGS THE HARNESS FAULT HAD BLOCKED — all five now read

| Our case said | **The build ships** | Verdict | Cases |
|---|---|---|---|
| `Set custom hours for this technician` | **`Set working hours for this technician`** | **CORRECTED** | C38848 · C38849 |
| `Add hours` | **`Add Hours`** (capital H) | **CORRECTED** | C38850 |
| `Reset To Template` | **`Reset to template`** — *and it is on a different screen* | **CORRECTED** | C38926 |
| `Set business hours for this shop` | `Set business hours for this shop` | **CONFIRMED EXACT** | C38847 |
| `Time Clock` | `Time Clock` | **CONFIRMED PRESENT** | C30084 |

**The QA lead's 11 August screenshots were right on both counts** — `Set working hours…` and the
capital H. They were correctly **not acted on** yesterday, because a screenshot is not our capture;
they are acted on now because we have read them ourselves.

### The `Reset to template` finding is a NAVIGATION defect, not just a casing one

C38926 step 2 told the tester to *"open the roles screen where each role's permissions are listed"*
and *"use 'Reset To Template'"*. **There is no such control on that screen.** Measured, not inferred:

- the row menu was opened on **Technician** and on **Parts Manager** — both System roles with an edit
  action, i.e. exactly the rows where a reset belongs — and **both offer only `View Permissions`**
- the menu read is the **LAST** `.q-menu` in the DOM, not the first, because Quasar leaves earlier
  menus mounted and reading the first one reports a stale menu as the live one
- the control lives on the **role's own screen**, `/administration/roles-permissions/<id>/edit`,
  as a button `data-test-id="reset_template_edit"` reading **`Reset to template`**

**A tester following the old step would have opened the three-dot menu, found nothing, and been
stuck** — on a case whose whole purpose is to reset roles before testing permissions.

### Exact strings captured — Edit Staff Member (MQ Test Tech, nothing saved)

```
"Time Clock"                                  (no transform)
"Technician Hours"                            [uppercase]
"Set working hours for this technician"       (no transform)
"Monday" … "Sunday"   ·   "Not working"   ·   "to"
"Add Hours"                                   [capitalize]
"Resend Invitation"  "Deactivate account"  "Delete"  "Save & close"
```

### Exact strings captured — Edit Location (Staging Heavy Duty - 9919, nothing saved)

```
"Business hours"                              [uppercase]
"Set business hours for this shop"    data-test-id="toggle_business_hours"
"Monday" … "Sunday"   ·   "to"   ·   "Add Hours"   [capitalize]
```

## 2 · THE TWO CASE GROUPS WHOSE MARKER WAS WRONG

**C29962 — the click alternative to dragging is gone, and the case said nothing about it.**
Before recording it absent, the state was proven to be one where it must appear: **21 work orders in
the sidebar, approved lines present, the grid rendered, Schedule: Edit held.** Then looked for
**three** times — on load, on hover, and inside an expanded line list. Result: **no
`button_sidebar_arm_<id>`, no arming wording, and the only `aria-pressed` elements in the entire
document are the three view buttons Day / Week / Month.** The sidebar carries exactly
`schedule_sidebar`, `input_sidebar_search`, `button_sidebar_filters`, `sidebar_work_order_list`,
`sidebar_work_order_card`, `sidebar_wo_status_<id>` — and nothing else.

**[SV-8957](https://shopview.atlassian.net/browse/SV-8957) is CLOSED as OBSOLETE / Done and the
defect still reproduces.** A closed ticket is a decision about whether to fix, never an amendment to
the specification (Rule 57), so the case **keeps** its documented expectation — §7 and §11 both
require a click-to-arm alternative — and gains the Rule-61 symptom and three outcomes.

**C43582–C43587 — the panel-collapse feature has no interface at all.** Measured with the state first
established: Schedule loaded, **left panel visible at 275 px** (so a control to hide it is
meaningful), toolbar rendered, **viewport 1680 px — well above the 960 px the cases themselves name
as the auto-fold point**, `Department` column header present.

**`Today` is the leftmost control in that row at x=325. Nothing sits to its left.** The toolbar holds
only `button_schedule_today`, `button_schedule_prev`, `button_schedule_next`,
`button_schedule_conflicts`. The **only** panel-like control anywhere on the page is
`button_mini_calendar_collapse`, `aria-label="Hide the calendar"` — **that folds away the month
calendar inside the panel; it is a different control and it does not hide the panel.**

**No Jira ticket covers this** (searched; [SV-8942](https://shopview.atlassian.net/browse/SV-8942)
is about sideways scrolling at ≤960 px and is closed OBSOLETE), so the honest marker is
**`AUTOMATION: HOLD - the panel button does not exist in this build`**, not `READY - EXPECT FAIL`,
which would need a ticket number to name.

## 3 · LABELS CLOSED TODAY BY REACHING THE STATE THEY LIVE IN

The work-order drill-down was opened on a **6-line** card (S8685-13014, Fuline Enterprises):

| Case | Label | Verdict |
|---|---|---|
| C29954 | `All` / `Unscheduled` chips with counts | **CONFIRMED** — rendered `All 6` / `Unscheduled 0`, `button_sidebar_line_scope_all` / `_unscheduled` |
| C29950 | `Authorized` and `Complete` line badges | **CONFIRMED** — both present on the line rows |
| C29939·C29940·C29941·C29947 | `Search work orders` | **CONFIRMED** — it is the input's **placeholder**, which the tester does see |

The sidebar Filters panel was opened by test-id and holds exactly:
`Unassigned 22`, `Assigned 71`, `Approved 92`, `Declined 0`, `In Progress 0`, `Ready for Review 1`.

The conflicts panel header reads **`Schedule issues`** (painted uppercase), with reasons
`Extends past business hours`, `Starts before business hours (7:00 AM)`, `Double-booked with …`.

## 4 · STILL NOT CHECKED — and why, honestly

**These are NOT reported as absent. They were not reached, which is a different thing.**

| Labels | Cases | Why not reached today |
|---|---|---|
| `Change scope`, `Full estimate` | C29978 · C29979 · C29983 · C29986 | Sit past the scope picker's confirm button. The drag was attempted; **our tooling computed a drop target at y=2095 in a 1080-tall viewport, so the drag landed nowhere and no picker opened.** A tooling miss, not a build finding. |
| `Filter & display`, `View options`, `VIN Number`, `Show Saturday`, `Show Sunday`, `My Shifts`, `Capacity Planning` | C30042 · C30043 · C30044 · C30045 · C30046 · C30047 · C30050 · C30051 · C30082 · C29930 · C30034 | The two toolbar menus **did not open** under today's sweep — both anchor lookups resolved to the same non-clickable `DIV`. **All of these were CONFIRMED and pushed on 11 August against this same build marker**, so they stand; they simply were not re-read today. |
| `Needs techs` | C29952 · C29961 | Every line on every card we opened already has a technician. Needs a line with **none** — a data state, not an absence. |
| `Clear all` | C29946 | The Filters panel was opened with **no filter applied**; this control plausibly appears only when one is. Not looked for in the right state. |
| `Adjust` | C30014 | Carried forward from 11 August as a genuine open question, unchanged. |
| `Create Event`, `New Work Order` | C30016 · C30017 · C30018 · C30054 · C30075 · C30077 | The grid cell menu was not opened today. **C30054 was fully confirmed on 11 August**, including that the menu holds exactly these two. |

**⚠️ A NOTE ON THE MACHINE DIFF.** `tools/label_diff.py` reports **90 NOT-FOUND** across 117 quoted
labels. **That number is not a defect count and must not be read as one.** It reflects the surfaces
this pass reached; it also catches prose fragments the quote regex mistakes for labels
(`'how much to schedule'`, `'.\n3. A'`), our own placeholder wording (`'N Lines'`, `'+N more'`), and
**labels the case asserts are ABSENT** (`'View Day'`, `'New Shift'`, `'Reassign'`, `'Cancel'`) —
where a string search cannot tell an assertion from a negation. It is kept as a worklist for the next
pass, not as a finding.
