# SV-12048 running results (branch sv12048, build v26.45.0-747429d, 5 Nov 2026)
Tools: wo.mjs (seed WO), drag.mjs (book on screen), lineact.mjs (Lines-tab button on screen), st.mjs (same change-status request by API), addline.mjs, shifts.mjs (board + line-technicians), shiftview.mjs (Shift details on screen).
Data note: on this branch every staff record has one name on the Schedule and another on the work order screens (e.g. staff 0aac76eb = "Emily Madden" on Schedule, "Cameron Johnston" on WO Labor). Same staff id/user id — test-data naming, not this ticket. To check on production.

## B. Entire work order picks up lines approved later — PASSED
- WO S12048-17582 (ZZAUTOTEST SV12048 B 09260), 2 approved lines, dragged card onto staff 0aac76eb tomorrow 6 Nov, dialog "Entire work order", confirm "Create 1 shift" → POST /api/schedule/shifts 201; shift d1973683 coverage whole_work_order, 240 min, 2 lines.
- Line 3 added waiting (authorization_required) → approved on SCREEN (Lines tab Approve, button_action_authorized_line_…, sends lines/change-status) → shift 3 lines, 240 min; line 3 technician 0aac76eb/source shift; WO Labor row shows the technician.
- Line 4 added waiting → shift still 3 → approved (API, same request) → shift 4 lines, 240 min; Shift details on screen "Work Order Lines 4 · Est. 8h". Evidence ev/B-step4-shift-0.png, ev/B-step5-shift-0.png.
