# SV-11564 — Timesheet dialogs block unreadable dates (NaN fix)
Result: PASSED — comment 79169 (21 Oct 2026). Separate finding filed: SV-11590 (Clock Out from a WO's Timesheets prefills Start 6 h late; also on production).
No recording / no technical section (QA lead's instruction for this batch).

- Branch sv11564 v26.40.20-0509710 (last-mod 20 Oct 14:37:16 GMT); bundle contains the new strict regex and "Jan 5, 2026 09:30 AM". Staging (v26.40.20-b1e205d) and production (aada856) do not.
- Test data (left in place): Carol Ramos (tech id bd9a5aa1…) entries Oct 12/13/14/20 on dept Shop Time and WOs S2-17579/S2-17578; Stephen Grimes changed Technician → Office User (staff 21bb7388…) with an Oct 15 dept entry (seeded by API — the New dialog only lists technicians).
- Office User role: the role editor on this build has no Reset to Template control (Rule 105 could not be applied; noted).
- Results files: ev/a.json (Edit validation matrix), b.json (pickers), c.json (overlap confirm), d.json (New, Clock Out both openers), g768/g900 logs (narrow), h/k (Office User).
- Observed (reported in table, as the handoff asked "report any odd time"): calendar after garbage → 12:00 AM; clock after garbage → today's date.
- Office User entry: the Work Order select was still shown in the Edit dialog (code hides it for ROLE_TIME_CLOCK_USER / ROLE_OFFICE_USER by the entry's employee_role_code); department shown as a raw id because the API-seeded department is not one of his. Validation itself passed. Not claimed in the comment.
- Production before: Edit Timesheet on S2-861 entry, typed 8:00 AM → "Start date is invalid", Save enabled; NOT clicked (handoff: do not reproduce on production). 0 timesheet writes.
- SV-11590 evidence: branch S2-17578 Carol Active from Oct 20 06:00 PM → WO-tab Clock Out Start "Oct 21, 2026 12:00 AM" (report opener: 06:00 PM); an 08:00 AM entry clocked out from WO tab saved as 02:00 PM–05:00 PM. Production: Trucks Hill 2 temporarily America/Edmonton, Ayesha Test running entry on S2-984 from 06:00 PM → same 12:00 AM; timezone restored (0 field diffs). The Ayesha Test running entry is left on production (test data).
