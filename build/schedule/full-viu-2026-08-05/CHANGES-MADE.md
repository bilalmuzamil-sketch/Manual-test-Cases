# Everything I created or altered on QA branch `sv8685` — full record

**Branch:** `https://sv8685.qa.shopview.com` · build `v3.5-d122eef` · org
`d55bc308-e61a-438d-b5f1-c7a73c89d49f` (Staging Heavy Duty - 9919, America/Edmonton)
**Signed in as:** the shared admin account. **`POST /api/quick-login` was never called.**

Per the QA lead's ruling of 2026-08-05 (*"You do not need to delete any test data from
those QA branches they are just the temporary branches which get deleted after the
feature is moved to the staging environment"*), throwaway data created after that ruling
is **left in place and recorded here** rather than deleted.

**Nothing outside the Schedule module was touched.** No customer, asset, staff member,
role, department or organisation setting was created or changed at any point (see
"Things I did NOT change" at the end).

---

## 1. Shifts CREATED (all on work orders that already existed)

All shifts were created by dragging from the Schedule sidebar or by the click-to-arm
button — i.e. through the product, the way a user would. Every one landed in a
**deliberately empty part of the calendar** so it could never be confused with real data.

| When (UTC) | What | Where | Now |
|---|---|---|---|
| 20:05–20:15 | 2 shifts on **S-15847** "Fuline Enterprises", line " Service - Perform LOF and inspection" | Brittany Anderson 9 Sep 2026; William Johns 10 Sep 2026 | **deleted** |
| 20:20–20:35 | 5 shifts on **S-15824** "Uemill Excavating" — a 2-line subset, a 3-line whole order, two single-line, one via click-to-arm | Brittany Anderson / Colleen Guerrero / Ayesha Khan, 8–11 Sep 2026 | **deleted** |
| 20:35 | 1 shift on **S-15847** via click-to-arm | Ayesha Khan 8 Sep 2026 | **deleted** |
| 20:40 | 1 shift on **S-15683** "Vuchester Retail", line "Repair - Right side fender/Brackets" | William Johns 4 Nov 2026 | **deleted** |
| 20:55 | 1 shift on **S-15824** (Month-view drag attempt — nothing was created; the drag did nothing) | — | n/a |
| 21:05–21:20 | **105-shift linked series** on **S-15683**, series id `89fd410a-18a8-403d-a09f-cde720de7aad`, 4 Nov 2026 → 16 Feb 2027, 1h/day | William Johns | **deleted** |

Those deletions happened **before** the QA lead's ruling arrived. From that point on,
data is left in place — see section 3.

## 2. ⚠️ ONE PRE-EXISTING SHIFT WAS DELETED AND RE-CREATED — the only item where a BEFORE value matters

This is the one thing nobody could reconstruct later, so it is recorded in full.

**Deleted by mistake** (my clean-up window was wider than the empty week I was working in):

| Field | BEFORE (the record I deleted) |
|---|---|
| `id` | `f3fd6c4c-a632-4830-83c9-b07174b44d3d` |
| Work order | **S-15855** · Vuchester Retail · unit **10123073** · VIN F070075685 · Approved |
| Line | `bb215192-6425-4725-af09-5dcad36e8d8a` " Service - Mobile service call made by George Donald 403-369-7067" |
| Technician | **Ayesha Khan** (`1e81b8a0-9a45-4f16-89e3-209bf240990a`) |
| Starts / ends | `2026-09-01T13:00:00Z` → `2026-09-01T14:00:00Z` (7:00–8:00 local) |
| Duration | 60 minutes · not all-day · colour `#e2effe` · note null · seriesId null · no conflict |

**AFTER — re-created through the application, identical in every scheduling field:**
new id `f15145ce-5774-46f0-886a-dfbd604c2bdd`, same work order, same line, same
technician, same start, same end, same 60 minutes, same colour, same null note, same
null series, same conflict state. **All 14 fields compared one by one** — see
`BOARD-RESTORE-PROOF.md`. The only difference is the server-generated `id`, which the
API gives a caller no way to choose. **The work-order line roster it feeds was also
verified restored**: all 91 work orders and all 533 of their lines came back
byte-identical to the pre-batch snapshot.

## 3. Shifts and series LEFT IN PLACE (created after the ruling)

All of these are on **work orders that already existed**; nothing here creates a customer,
asset or work order. Everything sits in **November and December 2026**, which held
**zero** shifts and **zero** events before this pass, so nothing here can be confused
with real data.

| Series / shift | Work order | Technician | Dates | Detail |
|---|---|---|---|---|
| series `89fd410a-18a8-403d-a09f-cde720de7aad` | **S-15681** Vuchester Retail | **William Johns** | 4 Nov 2026 → 16 Feb 2027 | **105 daily shifts**, 1h/day — created to prove the over-8-weeks confirmation. Renders as "37 Lines · Week 1 of 16" |
| series `2d145d7e-e318-45b7-ae30-8015ca548001` | **S-15683** Vuchester Retail | **Ayesha Khan** | 4 → 17 Nov 2026 | **10 daily shifts**, 2h/day, Mon–Fri. Renders as "11 Lines · Week 1 of 3" |
| series (4 shifts) | **S-15683** Vuchester Retail | **Brittany Anderson** | from 16 Dec 2026 | 5h/day — created to test the confirm toast |
| shift `b07bf2e7-b192-47f3-823b-e9fafb83ea47` | **S-15875** Vuchester Retail | Brittany Anderson | 25 Nov 2026 08:00–09:00 | back-to-back pair, same lane |
| shift `45055358-1a55-436b-99da-85fcee4c69f3` | **S-15732** Xiriver Apparel | Brittany Anderson | 25 Nov 2026 09:00–10:00 | the other half of that pair |
| **5 overlapping shifts** | S-15875, S-15732, S-15599, S-15807, S-15847 | **Colleen Guerrero** | 26 Nov 2026, all 10:00–12:00 | created to exceed the 3-lane cap; four of them are flagged double-booked **on purpose** |
| shift `844a5ce1-2e79-4ea8-af2f-35ed9de5c7fa` | **S-15875** Vuchester Retail | Ayesha Khan | 11 Nov 2026 07:30–08:30 | deliberately overlaps her series day, to prove a series member conflicts like any shift |
| shift (10h) | **S-15683** Vuchester Retail | **Kellie Ayers** | 2 Dec 2026 | a 2-line subset, created to prove a second technician gets the full estimate again |

**Anyone reading the board later should know: every double-booked conflict on Colleen
Guerrero on 26 November 2026 and on Ayesha Khan on 11 November 2026 was created
deliberately by this test pass. They are not real scheduling problems.**

## 4. Settings, roles, staff, customers, assets

**NONE CHANGED SO FAR.** Specifically:

* **No role was created, edited or reset** up to this point, because no
  permission-dependent case had been observed yet. The Rule-26 reset still applies to
  the Permissions batch and its before/after will be recorded here.
* **No staff member** was created, edited or reassigned.
* **No customer, asset or work order** was created, edited or deleted. Work-order line
  **rosters** did change as a side effect of creating and deleting shifts — that is the
  product's own behaviour, not a separate edit — and they were verified byte-identical
  afterwards.
* **No organisation or location setting** was changed. The Working Hours settings screen
  was read only.

## 5. View-only toggles I flipped and put back

These are per-user display preferences, not shop data, but they are recorded for
completeness:

* **View Options → Show Sunday** and **Show Saturday**: both switched off to observe the
  weekend columns, then **both switched back on**. Verified: the week returned to seven
  columns Sunday…Saturday.
* **Mini calendar collapse**: collapsed and re-expanded (verified back to 42 day
  buttons).
* **Department group Service/Parts**: collapsed and re-expanded (verified back to 19
  technician rows).
* **Sidebar filters and searches**: applied and cleared many times; verified back to the
  unfiltered list of 18 cards with no active-count badge.
* **Mini calendar month**: left showing whatever month the last batch navigated to. This
  is a transient view state that resets on reload.

## 6. Things I did NOT change, stated so nobody has to wonder

* The **shop's working hours** and the **location business-hours toggle** — read only.
* Any **pre-existing shift's** technician, day, time, duration, colour or note. No drag
  ever started from an existing block; every drag started from the sidebar, which creates
  new shifts.
* Any **event**. No event was created, moved, reassigned or deleted.
* **TestRail**: no write of any kind at the time of writing this section.
* **Jira**: no write of any kind at the time of writing this section.
