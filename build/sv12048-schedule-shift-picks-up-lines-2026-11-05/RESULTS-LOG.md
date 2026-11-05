# SV-12048 running results (branch sv12048, build v26.45.0-747429d, 5 Nov 2026)
Tools: wo.mjs (seed WO), drag.mjs (book on screen), lineact.mjs (Lines-tab button on screen), st.mjs (same change-status request by API), addline.mjs, shifts.mjs (board + line-technicians), shiftview.mjs (Shift details on screen).
Data note: on this branch every staff record has one name on the Schedule and another on the work order screens (e.g. staff 0aac76eb = "Emily Madden" on Schedule, "Cameron Johnston" on WO Labor). Same staff id/user id — test-data naming, not this ticket. To check on production.

## B. Entire work order picks up lines approved later — PASSED
- WO S12048-17582 (ZZAUTOTEST SV12048 B 09260), 2 approved lines, dragged card onto staff 0aac76eb tomorrow 6 Nov, dialog "Entire work order", confirm "Create 1 shift" → POST /api/schedule/shifts 201; shift d1973683 coverage whole_work_order, 240 min, 2 lines.
- Line 3 added waiting (authorization_required) → approved on SCREEN (Lines tab Approve, button_action_authorized_line_…, sends lines/change-status) → shift 3 lines, 240 min; line 3 technician 0aac76eb/source shift; WO Labor row shows the technician.
- Line 4 added waiting → shift still 3 → approved (API, same request) → shift 4 lines, 240 min; Shift details on screen "Work Order Lines 4 · Est. 8h". Evidence ev/B-step4-shift-0.png, ev/B-step5-shift-0.png.

## C. Choose lines never grows — PASSED
- C2 S12048-17584: Choose lines + "Select all" (both ticked) → "Create shift · 2 lines · 4h", coverage chosen_lines, 240 min. Line 3 added+approved → shift still 2 lines; sidebar line panel "All 3 · Unscheduled 1", line 3 "Needs techs" (ev/C2-sidebar.png).
- C1 S12048-17583: Choose lines, 1 of 2 ticked → "Create shift · 1 line · 2h", chosen_lines. Line 3 added+approved → shift still 1 line.

## D. Single-line drops — PASSED
- D1 S12048-17585 (1 line): card dragged, no dialog, booked whole_work_order 120 min. New line added+approved → shift 2 lines, 120 min, technician 3ff0914b on it.
- D2 S12048-17586 (2 lines): one line dragged from the sidebar line panel, no dialog, booked chosen_lines. New line added+approved → shift still 1 line.

## E. Multi-day — PASSED
- E1 S12048-17587, 3 × 6h lines, Entire work order → "Create 2 shifts" (Full estimate 18h, Nov 6–7, Fri, Sat), series 48de7807, whole_work_order, 660 + 420 min. New line added+approved → BOTH days 4 lines, still 660 + 420 min, technician 656664d1 on the new line.
- E2 S12048-17588 (3 × 6h), Choose lines + Select all → "Create 2 shifts · 3 lines · 18h", series chosen_lines. New line approved → both days still 3 lines, new line no technician.

## F. Other ways of booking — PASSED (3/3)
- F1 Assign Work Order (S12048-17589): empty cell on Brent Avila 12 PM → menu "Assign Work Order" → picked the WO → Assign → the same drop dialog opens on "Entire work order" → "Create 1 shift" → whole_work_order 240 min. New line approved → 3 lines, technician 776696c4 added.
- F2 department lane (S12048-17590): card dropped on the SERVICE department row → no dialog, staffId null, departmentId SERVICE, whole_work_order. New line approved → 3 lines, NO technician on any line (correct). Re-homed (block dragged onto David Haynes) → PATCH reassign; another new line approved → 4 lines, technician 16469a2e on all 4.
- F3 parked single-line (S12048-17591): one line from the line panel dropped on the SERVICE row → chosen_lines. Re-homed onto Clayton Stephens → still chosen_lines; new line approved → still 1 line.

### Observation (for the QA lead, NOT a fail): re-homing a parked shift resizes it to the full estimate of its lines
- F2 parked shift 240 min (picked up a 3rd line while parked) → re-homed → screen sent durationMinutes 360 → shift now 6h, ends 7 PM (tech hours 6–5). Moving a technician-lane shift to another technician (B) sends no duration and keeps 240.
- Same re-home on a parked shift with NO auto-picked line (F4 S12048-17592, shortened to 120 by API) → re-homed → 240 (= its 2 lines). PRODUCTION v26.45.1-6505633 does the same: S2-198 parked shift shortened to 120 → re-homed → durationMinutes 300. So resizing on re-home is existing behaviour; what is new is that lines picked up while parked now count toward it. Bucket: (c) explained + question for the QA lead.
- Production test data left: S2-198 shift 00607e6b on staff 1370698b, 6 Nov (prod test org, test data left per ruling).

## BLOCKED 13:20 UTC: all .qa.shopview.com sign-ins expired (quick-login 401 sso_required; shared sv_sso_session saved 10:34 UTC). Builds unchanged (sv12048 v26.45.0-747429d). Remaining: G, H, I, J, K, L + A + regression hotspots + on-screen Shift-details captures for C/D/E/F.
