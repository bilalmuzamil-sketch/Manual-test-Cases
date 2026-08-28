# SV-9500 — QA: schedule blocked when actual hours exceed estimated hours

**Ticket:** SV-9500 — *Cannot schedule work order when actual hours exceed estimated hours (toaster error; 1.5 actual vs 1.0 estimated blocks scheduling)*
**Status:** Code Review · Labels: QA_validation_required, bug-report, source-intercom
**QA branch (fix):** https://sv9500.qa.shopview.com  ·  **Production (bug):** https://app.shopview.com
**Related:** SV-9497 (allow scheduling when remaining estimated hours are 0/negative without changing the original line estimate). Dipesh: "May be linked ticket could solve with this."

## What the ticket reports (source of truth = the DESCRIPTION, Rule 66)
On the Schedule, a work order whose **actual (clocked) hours are greater than its estimated hours** cannot be placed on the calendar — a toaster error appears and blocks scheduling. Example: 1.5h actual vs 1.0h estimated. Expected: scheduling should be allowed even when actual exceeds estimated.

## The mechanic (learned live)
- A work-order **labor line** carries an **Estimated time** (`time_estimate`, stored in minutes) and an **Actual** figure = the technician's **clocked** time (start/stop clock → check-in/check-out punches; the schedule uses the real clocked hours).
- Placing a WO on the Schedule creates a shift sized to the **remaining** estimated time = `estimate − actual`.
- **Bug:** when actual ≥ estimate, remaining ≤ 0, and the client blocks the drop with the toaster **"Nothing left to schedule — there's no estimated time left to book."** — no shift is created.

## Production reproduction (UNFIXED build) — CONFIRMED
Steps (Trucks Hill 2, test org 72b2cc90):
1. Created WO **S-861** (customer Ahsan) with a General Labor line, **Estimated time 1.0h**.
2. Clocked real time on the line (technician start/stop) → **actual ≈ 0.2h**.
3. To force actual > estimate (without waiting hours), lowered the line **estimate to 0.1h** (`POST /api/work-orders/lines/change`, `time_estimate:6` min). Line now reads **Actual 0.2h / Estimate 0.1h**.
4. On the Schedule, searched the sidebar for the WO and dragged it onto a technician's time slot.

**Result — BUG REPRODUCED:** no `POST /api/schedule/shifts` fires; toaster **"Nothing left to schedule — there's no estimated time left to book."**; the WO is **not** placed on the calendar. Evidence: `evidence/PROD-repro-toaster.png`.

Control check (same WO earlier, when actual 0.2h < estimate 1.0h): drag → `POST /api/schedule/shifts` → **201**, shift created normally. So the block is specifically the actual-≥-estimate condition.

## QA branch fix verification (sv9500) — FIX CONFIRMED (deployed-code diff)

The QA-branch UI could **not** be driven live from the test environment (the automated cookie session does not complete the app's SSO login handshake — `/api/auth/me/fe-permissions` returns "Session has expired", so every route bounces to `/login`; the user's own browser is unaffected). Instead the fix was verified **in the deployed frontend code**, which is the actual shipped artifact, and diffed against production.

The scheduling drop handler (chunk `Schedule.*.js`, function `sn`) is identical on both builds:
```
sn = a => { ...; const r = Xt(a); if(X.value && Qi(a.totalMinutes)){Vr(a);return}  // estimate==0 → "Estimate required"
            if(r < ga){ Br(); return }  // ga=15; Br() shows the "Nothing left to schedule" toaster
            ...create shift... }
```
The difference is entirely in **`Xt`** (how the remaining schedulable minutes `r` are computed):

| | Production (`Schedule.BrEsg7Ge.js`) — BUG | QA branch (`Schedule.8MUSjh2I.js`) — FIX |
|---|---|---|
| `Xt` | `a => Math.round(tu(a.totalMinutes, a.clockedMinutes, Ha(a)))` | `a => Math.round(su(tu(a.totalMinutes, a.clockedMinutes, Ya(a)), a.totalMinutes))` |
| `su` | — (not applied) | `su = (e,t) => t<=0 ? 0 : Math.max(e>0?e:t, ga)` |
| `tu` (both) | `(e,t,s) => … Math.max(e - clocked, 0)` | same |

- **Production:** `tu` returns `max(estimate − actual, 0)` = **0** when actual ≥ estimate → `r = 0` → `r < 15` true → `Br()` → **toaster, blocked** (reproduced live above).
- **QA branch:** the new **`su` wrapper** turns a 0/negative remaining into the **full estimate**: `su(0, estimate) = max(estimate, 15)` → `r = estimate` (≥15) → `r < 15` false → **no toaster, the shift is scheduled** — using the original estimate as the shift size, exactly SV-9497's "allow scheduling when remaining estimated hours are 0/negative **without changing the original line estimate**."

**Verdict: the fix is present in the QA build and absent in production.** Evidence: `evidence/QA-vs-PROD-code-comparison.json`, `evidence/QA-Schedule.8MUSjh2I.js`.

**Live UI confirmation (optional):** on `sv9500`, drag WO `32487af5` (Actual > Estimate) onto a technician's slot on the Schedule → expected: it schedules with a "Shift scheduled." toast and **no** "Nothing left to schedule" toaster.

## Key endpoints / recipe (also added to APP-ACTIONS-PLAYBOOK.md)
- New Line dialog fields: `select_line_canned_line`, `input_line_description`, `select_line_roster_add_technician`, `input_time_estimate` (estimate), `input_tech_time`, `button_save_close`.
- Line create from canned: `POST /api/work-orders/{wo}/lines/create-from-canned-line`.
- Line edit / set estimate: `POST /api/work-orders/lines/change` (send the line object; `time_estimate` in **minutes**).
- Line data (incl. `time_estimate`, `total_labour_time`, `tech_times`): `GET /api/work-orders/lines/{wo}`.
- Clock in (actual time): line button `button_clock_toggle_task_{lineId}` → `POST /api/work-orders/tasks/create` + `POST /api/technician-tasks/check-in`.
- Clock out: click the line clock toggle → "Stop working" dialog → **Clock Out** → `POST /api/technician-tasks/check-out {task_id, tech_story, complete_line, work_order_id}`.
- Schedule an existing WO: drag `sidebar_work_order_card` → tech row (`data-staff-id`) → `POST /api/schedule/shifts {workOrderId, lineIds, staffId, startDate, startTime, spreadMode, totalMinutes, ...}` where `totalMinutes` = remaining estimate (estimate − actual). **When ≤ 0, the client blocks with the toaster instead of POSTing.**
- Deterministic repro without waiting hours: clock a little real time, then lower the line estimate below the clocked actual via `lines/change`.
