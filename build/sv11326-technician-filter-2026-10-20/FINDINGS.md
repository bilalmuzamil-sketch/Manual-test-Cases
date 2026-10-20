# SV-11326 — Tech View / Board View Technician filter (staging, 20 Oct 2026)

Final build **v26.40.20-0509710** (staging redeployed 14:23:34 GMT mid-pass; every check re-run on it). Admin at Staging Heavy
Duty - 9919 (account was on QB Location; switched for the test, switched back). PRD v68 S1-R15/R15a/R15b, S1-R9a (wrench, Chris 78812).

## Results (scripts `sv11326c/d/e.mjs`, data `ev/rerun.log`, `ev/te.json`, `ev/opts-vs-groups.json`)
1. Chip `filter_chip_lead_technician` "Technician" after Assigned to me in Tech + Board; absent in List. PASS
2. Icon = Lucide wrench path. PASS
3. Options: search box, Unassigned first, 327 technicians sorted first then last name (case-insensitive) = every active+eligible group. PASS
4. Aaron Baker → only his column/group (22 = API lead-filtered count 22, all lead Aaron); pinned Brandi hidden. PASS (Board + Tech, Tech checked with Collapse all)
5. Aaron + Brandi + Unassigned → exactly those 3; chip "Technician: Aaron Baker, +2". PASS
6. Lead only: S2-37620 (no lead, Aaron set as line technician via PUT lines/{id}/technicians) not shown with Aaron chosen. PASS
7. + Assigned to me: 19 = API showMyWorkOrders=1 & lead Aaron (19). PASS
8. + Asset on Site Yes: 3 = API lead Aaron & vehicleHere=1 (3, all on site). PASS
9. No match (Aaron + search S2-37620): S1-N1a text + Clear all filters; button clears Technician. PASS
10. List with Aaron chosen: 30 rows, none led by Aaron (unfiltered); back → choice restored. PASS
11. Reload keeps it; state lives in URL `?lead_technician=` like other filters. PASS

## Asked Chris (comment 79133; QA lead: "PASSED + ask Chris both")
- 11 deactivated technicians (active=false, eligibleInLocation=false, still have columns, e.g. Darrell Martinez 113) are not in the list.
  S1-R15 "same people who get a group or column, S9-R4" vs S9-R4 active-only.
- "This change would exceed the 50-value limit across all filters" shows on opening with nothing ticked (limit itself = SV-9478 decision).

## Posted
79132 PASSED (4 exhibits, 11 rows), 79133 question (1 exhibit). Gate: marker 0509710, ticket TESTING STAGE 2 comments, PRD 68, text scanned.
State: prefs restored identical every run; location restored to QB Location. S2-37620 now has Aaron Baker as line technician (test data).
