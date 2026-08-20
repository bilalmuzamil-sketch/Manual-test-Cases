# TASK B — Schedule staff working-hours (C38848, C38849) — 2026-08-20

Both cases atm=3 (Automated), created_by=3 (ours), section 5405 (Schedule / Working Hours, SV-8699).
Build **v3.8-d0e135e** (app.staging.shopview.com), org d55bc308-…, observed 2026-08-20 ~07:1x–07:2xZ.

## VERDICT ON THE PRIOR "Something went wrong loading this section" ERROR

**(ii) HEADLESS / TOOLING ARTIFACT — NOT a real build defect.** The New/Edit Staff form and its
**"TECHNICIAN HOURS"** section **load cleanly with NO error** in this session. Opened the Edit Staff
dialog for two technicians (Ahtasham Amjad and Henry Hess) via a real coordinate click on the row
`edit_note` icon — both rendered the full form (Salary Type, Role, Location, Billable, Time Clock /
Sales Representative toggles, TECHNICIAN HOURS section, Deactivate/Delete/Save & Close) with **no
"Something went wrong loading this section" message anywhere**.

Root cause of the prior failure (per the 2026-08-20 EXECUTION.md pass): the staff admin table is gated
by the app's active **Location**; in headless the table rendered empty/errored under the default
workplace. Fixing the session workplace (`POST /api/iam/change-location` to the staff's location) makes
the table populate and the Edit Staff form open normally. → tooling/headless, not a build defect. No
STAFF-FORM-DEFECT.md is written (there is no defect).

## Working-hours reached ANOTHER WAY — the API is fully functional (LIVE-observed)
`GET/PUT /api/staff/{staff_id}/working-hours` (scope the session to the staff's workplace first; use
**staff_id**, not the staff-list `id` — the `id` form 404s). Confirmed on Henry Hess
(staff_id 21bb7388-…, workplace QB Location - Automation d5366a95, restored to original after):
- `GET` (no custom hours) → `200 {"workingHours":{"ranges":null}}` — toggle OFF / inherits shop hours.
- `PUT {"ranges":[{"dayOfWeek":1,"startMinute":540,"endMinute":900}]}` → `200`; `GET` returns exactly
  that = **Monday 09:00–15:00 (9:00 AM – 3:00 PM)** — the C38848 "Monday holds exactly 9:00 AM – 3:00 PM"
  data. `dayOfWeek 1 = Monday`, `startMinute 540 = 9:00`, `endMinute 900 = 3:00 PM`.
- `PUT {"ranges":[]}` → `200`; `GET` → `{"ranges":[]}` = **empty list → inherits shop business hours**
  = exactly the C38849 expected result ("GET … returns an empty list — back to inheriting shop hours").
- `PUT {"ranges":null}` → `200`; `GET` → `null` — used to **restore** Henry to the original state.
- Payload validation (from the 400): each range requires `dayOfWeek`, `startMinute`, `endMinute`;
  `day`/`start`/`end` are rejected.

So the underlying **data model of both cases is confirmed live** and the exact API contract is handed
to automation below.

## What could NOT be observed this session (Rule 12 — not inferred)
The FE **"Set working hours for this technician" toggle** did not render editably in headless. For
BOTH Ahtasham (not enrolled here) AND Henry (enrolled here, session on his location, in-form Location
field = "QB Location - Automation"), the TECHNICIAN HOURS section showed:
> "Working hours are set per location. Switch to one of this technician's locations to edit them."
This is unexpected for Henry (he IS enrolled at the session location) and is likely a headless
location-context hydration limit of the boot2 harness (it sets location via API + localStorage rather
than the interactive top-nav location switcher). **It is NOT the section-load error** (that is gone).
Whether the per-location message is a genuine build gate or purely a headless quirk was **not resolved**
— it needs an interactive, location-switched browser session to confirm, which Vlad's real-browser
automation harness can do.

## Case status
- **C38848** ("Set working hours for this technician" toggle, off by default; ON → Monday 9:00 AM–3:00 PM)
  → **HELD (observation-limited)**. Not the old defect: the form loads. Data model confirmed via API
  (toggle-off = ranges:null; the Monday-9-3 seed = dayOfWeek 1 / 540 / 900). The FE toggle default/seed
  itself was not observed (headless per-location gate). No TestRail write, no verdict flip (Rule 12).
- **C38849** (no custom hours → inherit shop hours; GET returns empty list) → **HELD (observation-limited)**.
  The API half of the expected result IS observed (PUT `[]`/`null` → GET empty → inherit). The FE
  toggle-off state + the scheduling-conflict-against-shop-hours half were not driven (headless gate).
  No TestRail write, no verdict flip.

Both remain atm=3 → carried on FOR-VLAD with the exact API contract so the real-browser harness can
finish the FE observation and flip them.

## For Vlad (automation contract)
- Endpoint: `GET/PUT https://api.staging.shopview.com/api/staff/{staff_id}/working-hours`
  (switch session to the staff's workplace first via `POST /api/iam/change-location {workplace_id, workplace_timezone}`).
- Range shape: `{"ranges":[{"dayOfWeek":<0-6>,"startMinute":<0-1439>,"endMinute":<0-1439>}]}`.
  Monday 9–3 = `{"dayOfWeek":1,"startMinute":540,"endMinute":900}`. Inherit = `ranges:[]` or `null`.
- FE toggle path: Administration → Staff → (row) edit_note → Edit Staff dialog → TECHNICIAN HOURS.
  Needs the app actively on one of the technician's locations (use the top-nav location switcher, not
  just the API) for the editable toggle to appear.

## Constraints honoured
- 0 TestRail writes (both HELD, no observed verdict to write). 0 Jira (creation hold + Rule 51/62).
  Henry Hess working-hours mutated for characterization then **restored to original `ranges:null`**
  (verified). No role change. Runs 357/359/352 untouched.
