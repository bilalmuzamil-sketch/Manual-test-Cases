# Everything I created or altered on QA branch `sv8685` — full record

**Branch:** `https://sv8685.qa.shopview.com` · builds `v3.5-d122eef` (batches 1–5) then **`v3.5-7ec992f`** (batches 6–9, redeployed 22:49:36 GMT — see `BUILD-MARKER-MOVED.md`) · org
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
| series **`20882de1-4a1a-42ae-bbaa-55ac970a49a0`** | **S-15681** Vuchester Retail | **William Johns** | 4 Nov 2026 → 16 Feb 2027 | **105 daily shifts**, 1h/day — created to prove the over-8-weeks confirmation. Renders as "37 Lines · Week 1 of 16". **(This row previously carried the id `89fd410a-…` by mistake — corrected 2026-08-06, see "Two corrections" at the end.)** |
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

## 3b. Items I ALTERED where the BEFORE value matters (batch 4)

| Item | BEFORE | AFTER | Restored? |
|---|---|---|---|
| Shift `b07bf2e7-b192-47f3-823b-e9fafb83ea47` (**mine**, S-15875 Vuchester Retail, Brittany Anderson, 25 Nov 2026) | `2026-11-25T15:00:00Z` → `16:00:00Z`, 60 min | `2026-11-25T14:30:00Z` → `17:45:00Z`, **195 min** | **No** — deliberately left moved and resized. It is a shift I created, so there is no original real value to lose. |
| Work-order line estimate — **S-15732** Xiriver Apparel, line "Auxiliary compressor - Top up compressor oil" (`7b237135-89c5-48ac-ab88-b579e2f463c7`) | **0.3 h (18m)** | set to **2.75 h**, then **set back to 0.3 h** | **YES** — verified: the modal reads "18m / 18m" again. This is real work-order data, so it was put back even though teardown is no longer required. |
| Shift `844a5ce1…`, the 5 Colleen Guerrero shifts, and the Kellie Ayers 10h shift | did not exist | created | **No** — left in place, listed above |
| A **note** on shift `45055358…` (S-15732) | none | added "ZZAUTOTEST note one", edited to "…EDITED", then **deleted** | **YES** — deleted; the modal shows an empty Notes section |
| **Event** `ac95c9e3-e880-45d2-a9e7-6dcb2a094ef9` "**ZZAUTOTEST Team meeting**", Brittany Anderson, 25 Nov 2026 16:00–18:00Z, colour `#f0f0f1` | did not exist | created | **No** — left in place |

## 3c. Batch 5 — events and conflict/capacity seeding (all LEFT IN PLACE)

| Item | Detail |
|---|---|
| Event `ac95c9e3-e880-45d2-a9e7-6dcb2a094ef9` **ZZAUTOTEST Team meeting** | Brittany Anderson, 25 Nov 2026 16:00–18:00Z, grey |
| Event **ZZAUTOTEST Timed meeting** | created on **Colleen Guerrero 9 Dec**, then **DRAGGED to William Johns 11 Dec** (that move was the test), then **recoloured Grey → Teal** (`#f0f0f1` → `#e6f4d7`). It was also deleted and immediately re-created once, to measure the capacity bar with and without it |
| Event **ZZAUTOTEST All day training** | Ayesha Khan, all day 10 Dec 2026 |
| Event **ZZAUTOTEST Day view preview** | Ayesha Khan, 11 Dec 2026 10:00–11:00Z |
| Shift `2ecf5d94…` | S-15807, **Ayesha Khan, Sunday 20 Dec** — deliberately on her non-working day, so it is **flagged "Not a working day" on purpose** |
| Shift `35762814…` | S-15807, **William Johns, Sunday 20 Dec** — the control: he has weekend hours so it is correctly NOT flagged |
| Shift `b0d4aee6…` | S-15807, Ayesha Khan, 21 Dec **4:00 AM** — deliberately **before hours** |
| Shift `f4d83d8e…` | S-15807, Ayesha Khan, 21 Dec **10:00 PM** — deliberately **after hours** |
| **17 shifts of 20 hours each, one per technician, all on Monday 28 December 2026** | S-15681. Created to push that day to **166% capacity (341h of 206h)** so the amber spill and the 100% tick could be observed. **Every one of the 17 is in overtime on purpose.** |
| Shift `b07bf2e7…` (mine, from batch 4) | **DELETED** at the end of batch 5, to prove the conflict count falls from 7 to 5 |

**Monday 28 December 2026 is deliberately, absurdly over-booked. Sunday 20 December and
Monday 21 December carry deliberate working-hours conflicts. None of it is real.**

## 4. Settings, roles, staff, customers, assets

**NONE CHANGED SO FAR.** Specifically:

* **No role was created, edited or reset** up to this point, because no
  permission-dependent case had been observed yet. The Rule-26 reset still applies to
  the Permissions batch and its before/after will be recorded here.
* **No staff member** was created, edited or reassigned.
* **No customer, asset or work order** was created or deleted. **One work-order line
  ESTIMATE was edited and put back** — recorded in section 3b. Work-order line
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

* The **shop's working hours** and the **location business-hours toggle** — read only
  up to the end of batch 5. **Batch 7 opens the Working Hours settings screen; anything
  changed there is recorded in section 7 below.**
* Any **pre-existing shift's** technician, day, time, duration, colour or note — with the
  **one exception in section 2**, a pre-existing shift deleted by an over-wide clean-up and
  re-created field-for-field. No drag ever started from an existing block; every drag
  started from the sidebar, which creates new shifts.
* No **customer, asset, staff member, department or organisation setting** was created or
  changed. One work-order line **estimate** was edited and put back (section 3b).
* **TestRail**: no write of any kind up to the end of batch 5.
* **Jira**: no write of any kind up to the end of batch 5.

**⚠️ This section previously claimed "no event was created, moved, reassigned or deleted",
which was FALSE and is now removed — see "Two corrections" immediately below. Events WERE
created, one was dragged to another technician and recoloured, and one was deleted and
re-created. They are listed in sections 3b and 3c.**

---

## Two corrections to this document, made 2026-08-06 and proven live

This document contradicted itself in two places. Both were checked against the live board
rather than reasoned about, and both are corrected above.

### Correction 1 — section 6 was stale and denied the event work

**The claim:** section 6 said *"Any event. No event was created, moved, reassigned or
deleted."*
**Why it was wrong:** section 3b records event `ac95c9e3-e880-45d2-a9e7-6dcb2a094ef9`
"ZZAUTOTEST Team meeting" being **created**, and section 3c records **four** ZZAUTOTEST
events, one of which was **dragged from Colleen Guerrero 9 Dec to William Johns 11 Dec**,
then **recoloured grey → teal**, and separately **deleted and re-created** to measure a
capacity bar.
**Cause:** section 6 was written at the end of batch 3, when it was true, and was never
revisited when batches 4 and 5 created events. **Section 6 is the wrong row**, not 3b/3c.
**Fixed:** the false bullet is deleted and replaced with a pointer to the real record.

### Correction 2 — one series id was written into two rows that cannot both be true

**The claim:** series `89fd410a-18a8-403d-a09f-cde720de7aad` appeared in **section 1** as
*deleted*, on work order S-15683, **and** in **section 3** as *left in place*, on work
order S-15681. One of those had to be wrong.

**How it was settled — live, not by reasoning.** `GET /api/schedule/board` was read for
1–30 November 2026 (`board-nov-clean.json`, 45 shifts):

* **`89fd410a-…` returns ZERO shifts and does not appear in the board's `series` list at
  all.** It is genuinely gone. **Section 1 is CORRECT.**
* The 105-shift series that *is* still live has a **different id:
  `20882de1-4a1a-42ae-bbaa-55ac970a49a0`** — `shiftCount: 105`, `scheduledMinutes: 6259`,
  first start `2026-11-04T14:00:00Z`, last start `2027-02-16T14:00:00Z`, on **S-15681**,
  technician **William Johns**, 60-minute shifts. That matches section 3's description in
  every other particular.

**Verdict: section 3 had copied the deleted series' id.** The id is corrected to
`20882de1-…`. The neighbouring row was checked at the same time and is right:
`2d145d7e-e318-45b7-ae30-8015ca548001` really is 10 shifts of 120 minutes on **S-15683**
for **Ayesha Khan AK**, 4 → 17 Nov 2026.

**Why this mattered enough to chase:** a wrong id in a change record is the one kind of
error nobody downstream can detect. Anyone auditing the branch would have searched for
`89fd410a-…`, found nothing, and concluded the record was fiction — while the real
105-shift series sat on the board unexplained.

---

## 7. Batch 6 onwards — changes recorded as they are made

*(appended per batch; see the batch sections below)*

### Batch 6 (2026-08-06, build `v3.5-7ec992f`) — all in an empty part of March 2027

**March 2027 held ZERO shifts, ZERO events and ZERO series before this batch** (proven by a
board read over 1–31 Mar 2027). Everything below is therefore unmistakably test data. All of
it is on **work order S-15868 "Joshore Farms" unit 70**, which already existed; no customer,
asset, work order or line was created.

| Item | What | State now |
|---|---|---|
| Series `9d634574-618d-40bd-9559-ba68d7f2a3ee` | 5 daily shifts, **Brittany Anderson**, 1–5 Mar 2027, 1h30 each, line "Service - Perform LOF and inspection" | **deleted** by the whole-series scope test |
| Series `23b071a1-31d0-42fe-b89a-5c0cf8421841` | 5 daily shifts, **Andrew Wade**, 1–5 Mar 2027, 30m each, line "Service - Air filter" | **2 shifts remain** (1–2 Mar); 3–5 Mar removed by the "this and all later" test |
| Series `d45ba499-942e-4c66-9c15-9a63b14b0a74` | an accidental duplicate of the Brittany series, created when a seeding script re-ran its first block | **deleted immediately**, all 5 shifts, before any test used it |
| Series `dae00378-d9ca-416e-908a-a4b4808e56d3` | 3 daily shifts, Brittany Anderson, 15–17 Mar 2027 | **deleted** by the whole-series toast test |
| Shift `1241a85c-4680-4b9f-b5be-9b589515deb5` | standalone, Brittany Anderson, 10 Mar 2027 | **deleted** by the standalone-delete test |
| Shift `969e2202-5a35-4470-ac49-5dd033415aad` | standalone, 22 Mar 2027, 2h, line "Diagnose - Clutch" | **left in place**, back on **Brittany Anderson** at its original 22 Mar 15:00Z after the reassign was undone |
| Shift `59f997f2-cc65-4781-a0fe-f4dbe9ef269c` | created by dragging **S-12876 Pamill Paving** from the sidebar, 30 Mar 2027 | **deleted** by the immediate-save test |
| Shifts `9fa241be-…` and `5c41bd79-…` | standalone, Brittany Anderson, 23 and 24 Mar 2027 | `9fa241be` **deleted** by the toast-hover test; **`5c41bd79` left in place** |

**Items ALTERED where a BEFORE value matters — none outside my own test data.** The one
pre-existing thing touched was the **work-order line roster** of S-15868 line
"Diagnose - Clutch" (`7a854816-…`), which the product itself updates when a shift is
reassigned:

| Item | BEFORE | AFTER the test | State now |
|---|---|---|---|
| S-15868 line "Diagnose - Clutch" roster | `["Brittany Anderson"]` | `["Ayesha Khan AK"]` after the reassign | **`["Brittany Anderson"]` — restored by the product's own Undo**, verified by re-reading `/api/schedule/work-orders` |

**Nothing else was changed in batch 6.** No role, staff member, setting, department,
customer, asset or work order was created or edited. No event was created, moved or deleted
in this batch.
