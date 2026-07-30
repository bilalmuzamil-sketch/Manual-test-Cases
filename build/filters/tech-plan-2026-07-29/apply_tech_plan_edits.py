#!/usr/bin/env python3
"""Apply the tech-plan-driven Filters case edits + new cases (LOCAL ONLY).

Source of truth for WHAT and WHY: TECH-PLAN-DELTAS.md (same folder).
Pre-edit backups: backup/ (same folder). NO TestRail writes here.
Run from anywhere: paths are resolved relative to this file.
"""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
CASES = os.path.join(os.path.dirname(HERE), "cases")

TP = "Tech plan 2026-07-29 (engineering intent - confirm live at the wording/behaviour pass): "


def load(name):
    return json.load(open(os.path.join(CASES, name)))


def save(name, data):
    with open(os.path.join(CASES, name), "w") as f:
        json.dump(data, f, indent=1, ensure_ascii=False)
        f.write("\n")


def add_note(case, note):
    old = (case.get("notes") or "").strip()
    case["notes"] = (old + (" " if old else "") + note).strip()


def by_id(data):
    return {c["id"]: c for c in data}

# ---------------------------------------------------------------- cases-A
A = load("cases-A-bar-status-collapse.json")
m = by_id(A)
add_note(m["FLT-STAT-03"], TP + "the Imported status may be MUTUALLY EXCLUSIVE with the other statuses/filters (G1) - see FLT-STAT-07; pending Branko confirmation (spec S2-R1 lists it as a plain status).")
A.append({
 "id": "FLT-STAT-07", "area": "Status Filter",
 "title": "Imported works alone: picking it greys out the other filters",
 "priority": "High", "type": "Functional",
 "permissions_required": "Any signed-in user with access to the Work Orders page (filter lists are role-independent per Branko Round-2 Q3=A).",
 "preconditions": [
  "1. You are signed in to the ShopView App on a desktop browser.",
  "2. Imported work orders exist, plus some normal work orders.",
  "3. You are on the Work Orders page, All tab, no filters applied."],
 "steps": [
  "1. Open the Status filter and tick Imported.",
  "2. Look at the other filter chips (Customer, Lead Technician, Service Advisor, Asset on site).",
  "3. Try to combine Imported with another status.",
  "4. Untick Imported."],
 "expected": [
  "1. The table switches to showing imported work orders only.",
  "2. While Imported is ticked, the other filter chips are greyed out and cannot be used.",
  "3. Imported cannot be combined with other statuses - selecting it works alone.",
  "4. Unticking Imported re-enables the other chips and the normal list returns."],
 "design_ref": "tech-plan-2026-07-29/TechPlan-AppWide-Filter-Redesign.md G1 / section 4-3.2",
 "spec_ref": "Filters (Epic key TBD); tech plan 2026-07-29 G1 (Imported exclusivity); spec S2-R1 (conflict raised with the author - export of spec v1.3 awaited)",
 "viu_status": "VIU-Pending",
 "notes": "PENDING BRANKO (Questions Q3 / deltas C2): spec S2-R1 lists Imported as a plain status; engineering G1 builds it mutually exclusive with all other chips disabled (byte-identical to today's behaviour - imported comes from a separate service without filters). Exact disabled look/tooltip to capture live. A saved or shared state combining imported with other filters must also normalize back to imported-only on load (tech plan risk 4).",
 "api_related": False})
save("cases-A-bar-status-collapse.json", A)

# ---------------------------------------------------------------- cases-B
B = load("cases-B-people-asset-filters.json")
m = by_id(B)
add_note(m["FLT-CUST-05"], TP + "'Customer' here means the customer ACCOUNT/company shown in the grid's Customer column, not the contact person on the work order (G3) - seed test data accordingly.")
add_note(m["FLT-TECH-07"], TP + "the technician list shows only active, clockable staff for the CURRENT location; after switching location, selected technicians who are not in the new location silently drop from the chip (section 4-3.2).")
add_note(m["FLT-ADV-07"], TP + "mechanism = the filter dropdown requests active advisors only (activeOnly=1, G5). The advisor dropdown on the Work Order detail page and the Advisor Analysis report INTENTIONALLY still include inactive advisors - do not raise those as bugs. Advisor options are location-scoped and change on location switch.")
B.append({
 "id": "FLT-ASSET-07", "area": "Asset on Site Filter",
 "title": "Choosing No shows only work orders whose asset is not on site",
 "priority": "High", "type": "Functional",
 "permissions_required": "Any signed-in user with access to the Work Orders page (filter lists are role-independent per Branko Round-2 Q3=A).",
 "preconditions": [
  "1. You are signed in to the ShopView App on a desktop browser.",
  "2. Work orders exist both with the asset on site and with the asset not on site (create one of each if needed).",
  "3. You are on the Work Orders page."],
 "steps": [
  "1. Open the Asset on site filter.",
  "2. Choose No.",
  "3. Look at the table (and its On Site column)."],
 "expected": [
  "1. Only work orders whose asset is NOT on site remain in the list.",
  "2. Every work order with the asset on site is excluded.",
  "3. The chip shows the active No selection."],
 "design_ref": "design-notes.md (Asset on site dropdown 11880:12460); tech-plan-2026-07-29 G4 / section 4-1.6",
 "spec_ref": "requirements.md Story 6 S6-R2; Filters (Epic key TBD); tech plan 2026-07-29 G4 (filtering No is new capability)",
 "viu_status": "VIU-Pending",
 "notes": TP + "filtering by 'No' is BRAND-NEW (the old Asset Here toggle could only show on-site assets); engineering explicitly flags the No path for functional verification (section 4-1.6) - regression-watch this case.",
 "api_related": False})
save("cases-B-people-asset-filters.json", B)

# ---------------------------------------------------------------- cases-C
C = load("cases-C-chips-tabs-persistence-url.json")
m = by_id(C)
p2 = m["FLT-PERS-02"]
p2["steps"].append("6. On a different computer (or a different browser profile), sign in as the same person and open the Work Orders page.")
p2["expected"].append("3. The same filter selections are applied on the other computer too - the filters are saved to your account, not to one computer or browser (to confirm live once built).")
add_note(p2, TP + "persistence is server-side per user account - cross-device, survives logout, last-write-wins when two devices save (G6). NOTE the 2026-07-28 cross-squad decision: this account-level layer is also what the Report Suite will reuse for its reports.")
add_note(m["FLT-URL-02"], TP + "opening a filtered link is a VIEW-ONLY state - it must never overwrite your own saved filters (G7 runtime-only); see FLT-URL-05. Pending Branko: one spec sentence says the opposite ('URL wins on load, then persists') - Questions Q2 / deltas C1.")
add_note(m["FLT-EMPTY-01"], TP + "engineering copy for the filtered empty state is 'No work orders match your filters' with a clear-filters action shown only while filters are active (section 4-3.5) - capture the real on-screen text live, do not fail on wording before that.")
C.append({
 "id": "FLT-TAB-06", "area": "Tab Behaviour",
 "title": "First visit opens the Estimates tab; your last-used tab is remembered",
 "priority": "High", "type": "Functional",
 "permissions_required": "Any signed-in user with access to the Work Orders page (filter lists are role-independent per Branko Round-2 Q3=A).",
 "preconditions": [
  "1. You can sign in as a user who has never used the redesigned Work Orders page (no saved page choices for that account)."],
 "steps": [
  "1. Sign in as that fresh user and open the Work Orders page.",
  "2. Note which tab is selected and the tab order.",
  "3. Switch to the All tab.",
  "4. Go to another area of the app and come back to the Work Orders page."],
 "expected": [
  "1. On the very first visit the Estimates tab is the selected one, even though All is the FIRST tab in the row (order and default are different on purpose).",
  "2. After switching to All and returning, the All tab is selected - the app remembers your last-used tab per account."],
 "design_ref": "tech-plan-2026-07-29/TechPlan-AppWide-Filter-Redesign.md D10 / section 4-3.1",
 "spec_ref": "Filters (Epic key TBD); tech plan 2026-07-29 D10 (default tab = Estimates; last-used tab persists); not in the ratified product spec - confirmation requested",
 "viu_status": "VIU-Pending",
 "notes": "PENDING BRANKO (Questions Q5 / deltas C5): the Estimates-first-visit default is an ENGINEERING decision (D10, database-load driven), product-visible but not in any ratified spec we hold. If Branko rules the default should be All, flip expected 1.",
 "api_related": False})
C.append({
 "id": "FLT-PERS-05", "area": "Persistence",
 "title": "Each page and tab remembers its own filters separately",
 "priority": "Medium", "type": "Functional",
 "permissions_required": "Any signed-in user with access to the Parts and Reports pages.",
 "preconditions": [
  "1. You are signed in to the ShopView App on a desktop browser.",
  "2. The new filter bar has rolled out to the Parts views and to a report that has tabs (part of the same programme as the Work Orders filters)."],
 "steps": [
  "1. On one Parts view (for example Inventory) apply a filter.",
  "2. Switch to a different Parts view (for example Purchase Orders).",
  "3. Return to the first Parts view.",
  "4. On a report with tabs, apply a filter on one tab, switch to another tab, then switch back."],
 "expected": [
  "1. The second Parts view does NOT show the first view's selections - each view keeps its own.",
  "2. Returning to the first view restores that view's own selections.",
  "3. Report tabs likewise keep separate filter choices, each remembered and restored on its own tab."],
 "design_ref": "tech-plan-2026-07-29/TechPlan-AppWide-Filter-Redesign.md D20",
 "spec_ref": "Filters (Epic key TBD); tech plan 2026-07-29 D20 (per-view/per-tab state scoping); spec v1.3 Key Decisions (export awaited)",
 "viu_status": "VIU-Pending",
 "notes": TP + "state is scoped per view AND per tab, not per route (saved under a per-view key). Applies once the Parts/Reports rollout ships - hold until then.",
 "api_related": False})
C.append({
 "id": "FLT-PERS-06", "area": "Persistence",
 "title": "Filters saved before the redesign carry over after the update",
 "priority": "High", "type": "Functional",
 "permissions_required": "Any signed-in user who used the OLD Work Orders page with saved choices before the redesign.",
 "preconditions": [
  "1. In one browser, the account was used on the OLD Work Orders page with choices saved there (a tab, status selections, the asset-here toggle, column choices, sorting) BEFORE the redesign was installed."],
 "steps": [
  "1. In that same browser, open the updated app and go to the Work Orders page.",
  "2. Check the selected tab, the filter chips, the table columns and the sorting.",
  "3. Sign in as the same person on a DIFFERENT computer or browser and open the Work Orders page."],
 "expected": [
  "1. The old saved choices appear in the new filter bar on the first visit - the update does not lose them (old status choices show in the Status chip, the old asset-here choice shows as Asset on site: Yes, the old My-Work-Orders toggle maps to the My Work Orders tab, columns and sorting stay).",
  "2. Those carried-over choices are now saved to the account: the other computer shows them too."],
 "design_ref": "tech-plan-2026-07-29/TechPlan-AppWide-Filter-Redesign.md section 4-3.3 (migration mapping table)",
 "spec_ref": "Filters (Epic key TBD); tech plan 2026-07-29 section 4-3.3 (one-time browser-storage to account-preference migration)",
 "viu_status": "VIU-Pending",
 "notes": TP + "one-time migration, release-critical (existing users must not lose saved filters). Needs a browser profile with pre-update saved state - prepare one BEFORE the build lands on the test environment, or seed the old-format saved state deliberately. Exact mapping per the tech plan 3.3 table.",
 "api_related": False})
C.append({
 "id": "FLT-URL-05", "area": "URL State and Shareable Links",
 "title": "Opening a filtered link never overwrites your saved filters",
 "priority": "High", "type": "Functional",
 "permissions_required": "Any signed-in user with access to the Work Orders page (filter lists are role-independent per Branko Round-2 Q3=A).",
 "preconditions": [
  "1. You are signed in and have your OWN filters saved on the Work Orders page (for example one customer).",
  "2. You have a Work Orders link that carries a DIFFERENT filter state (made by another user or another browser)."],
 "steps": [
  "1. Note your own saved filters on the Work Orders page.",
  "2. Open the shared link.",
  "3. While on the link view, change one more filter.",
  "4. Use the on-screen option to go back to your own saved filters.",
  "5. Leave the page and return to Work Orders normally (via the menu)."],
 "expected": [
  "1. The link's filters apply for viewing only - the page shows the shared view.",
  "2. Changes made during the link visit are also NOT saved to your account.",
  "3. The go-back option restores your own saved filters and removes the filter part from the address bar.",
  "4. Returning normally later still shows your own saved filters, untouched by the link visit."],
 "design_ref": "tech-plan-2026-07-29/TechPlan-AppWide-Filter-Redesign.md G7 / section 4-3.4",
 "spec_ref": "Filters (Epic key TBD); tech plan 2026-07-29 G7 (URL state runtime-only + back-to-saved affordance); spec closing-note conflict raised with the author (spec v1.3 export awaited)",
 "viu_status": "VIU-Pending",
 "notes": "PENDING BRANKO (Questions Q2 / deltas C1): one spec sentence floats 'URL wins on load, then persists'; engineering builds runtime-only and reports the spec author agreed in page comments. The 'back to my saved filters' control name is engineering intent - capture the real on-screen text live.",
 "api_related": False})
save("cases-C-chips-tabs-persistence-url.json", C)

# ---------------------------------------------------------------- cases-D
D = load("cases-D-mobile-api.json")
m = by_id(D)
add_note(m["FLT-MOB-04"], "CONFLICT - PENDING BRANKO/DEV (Questions Q4 / deltas C4): the design frames show an 'Apply filter' button, but the tech plan (D15) builds INDIVIDUAL filter sheets as real-time (no button) - only the combined All Filters sheet batch-applies. Verify live which one ships before failing this case.")
add_note(m["FLT-API-01"], TP + "the list request sends each selected value as its own repeated filter entry (filters[N][field]/filters[N][value], one per value - no 'in' lists); field names: status, company_id, tech_assigned_id, service_advisor_id, vehicleHere. Imported is different: it switches to a separate imported-work-orders request with no filters (G1). Tabs do not send a status= parameter.")
add_note(m["FLT-API-02"], TP + "values within one field combine as OR (repeated entries on the same field); different fields combine as AND. Field names as in FLT-API-01.")
add_note(m["FLT-API-03"], TP + "deleted/unknown selected values are silently dropped by the page itself when options load (the saved/shared value simply never reaches the request) - so the check here is: no error AND the bad value is absent from the request.")
add_note(m["FLT-API-04"], TP + "a filter field the backend does not allow is REJECTED with a controlled error response (not silently ignored) - a controlled rejection is fine; a server crash (HTTP 500) is the bug.")
D.append({
 "id": "FLT-API-06", "area": "API - Work Orders List Filtering",
 "title": "Saved-filters service round-trip: save, reload, and per-user isolation",
 "priority": "High", "type": "Functional",
 "permissions_required": "Two signed-in user accounts; browser developer tools or an API client.",
 "preconditions": [
  "1. You are signed in to the ShopView App on a desktop browser with developer tools open on the Network tab.",
  "2. A second user account is available."],
 "steps": [
  "1. On the Work Orders page, change a filter and watch the Network tab for the save request the page sends shortly after.",
  "2. Reload the page and find the load request for the saved page state.",
  "3. Sign in as the second user (different browser/profile) and open the Work Orders page.",
  "4. With an API client (or by editing the request), ask the saved-state service for a page key that was never saved."],
 "expected": [
  "1. Changing a filter sends a save (PUT) to the per-user page-preferences service carrying the page's state, and it succeeds (HTTP 200).",
  "2. On reload the page requests the saved state back (GET, HTTP 200) and applies it - the filters return without you redoing them.",
  "3. The second user does NOT receive the first user's saved state - each account's saved filters are isolated.",
  "4. Asking for a never-saved key returns success with an empty value, not an error page."],
 "design_ref": "tech-plan-2026-07-29/TechPlan-AppWide-Filter-Redesign.md section 4-1.3 (endpoint contract)",
 "spec_ref": "Filters (Epic key TBD); tech plan 2026-07-29 section 4-1.3 (GET/PUT /api/users/me/preferences/{pageKey}); spec v1.3 S10 per-user persistence (export awaited)",
 "viu_status": "VIU-Pending",
 "notes": TP + "contract: GET/PUT /api/users/me/preferences/{pageKey}; Work Orders pageKey = work-orders-list; unset pref returns value:null (200, not 404); 400 on a malformed page key or a value over 16 KB; last-write-wins across devices. Endpoint shape is engineering intent until observed live.",
 "api_related": True})
save("cases-D-mobile-api.json", D)

# ---------------------------------------------------------------- cases-E
E = load("cases-E-parts-filters.json")
m = by_id(E)
add_note(m["FLT-PARTS-08"], "CONFLICT - PENDING DESIGN (Questions Q6 / deltas C7): engineering found NO Figma frame for the Parts Vendors view (they read frame 11903:10461 as Vendor Invoices, not a Vendors typo) and will NOT build Vendors filters until a design is delivered. This case's chip set may change - hold against the requested design + PRD.")
for cid in ("FLT-PARTS-11", "FLT-PARTS-12"):
    add_note(m[cid], TP + "rollout rule - every Parts page gets all three together: the chip design, shareable links, and per-user remembered filters, with NO change to what is filterable; date columns use the date-range chip (see FLT-RPTS-23) and each view keeps its own state (see FLT-PERS-05). Pending Branko's PRD ratification (spec v1.3 export awaited).")
save("cases-E-parts-filters.json", E)

# ---------------------------------------------------------------- cases-F
F = load("cases-F-reports-filters.json")
m = by_id(F)
for cid in ("FLT-RPTS-21", "FLT-RPTS-22"):
    add_note(m[cid], TP + "rollout rule - every report page gets the chip design + shareable links + per-user remembered filters with NO change to what is filterable; nearly every report leads with the date-range chip (see FLT-RPTS-23); sub-report tabs keep separate state per tab (see FLT-PERS-05). Pending Branko's PRD ratification (spec v1.3 export awaited).")
F.append({
 "id": "FLT-RPTS-23", "area": "Reports Page Filters",
 "title": "Date range filter: results update when both start and end dates are picked",
 "priority": "Medium", "type": "Functional",
 "permissions_required": "Any signed-in user with access to the Reports pages.",
 "preconditions": [
  "1. You are signed in to the ShopView App on a desktop browser.",
  "2. The new filter bar has rolled out to a page with a Date filter chip (a report, or a Parts page with a date column).",
  "3. Records exist inside and outside the date range you will pick."],
 "steps": [
  "1. Click the Date filter chip.",
  "2. Look at the panel that opens.",
  "3. Pick a start date only, and watch the results.",
  "4. Pick the end date.",
  "5. Look at the results and the chip."],
 "expected": [
  "1. A start/end date picker opens - there are NO preset ranges (no 'Last 30 days' shortcuts) and NO pre-filled default range.",
  "2. After only the start date, the results do not change yet.",
  "3. As soon as the second date is picked, the results update immediately to show only records inside the range.",
  "4. Only one date range can be active at a time on that chip, and the chip shows the active range."],
 "design_ref": "tech-plan-2026-07-29/TechPlan-AppWide-Filter-Redesign.md D19",
 "spec_ref": "Filters (Epic key TBD); tech plan 2026-07-29 D19 (date-range chip: no presets, no default, applies on second date); spec v1.3 Parts + Reports sections (export awaited)",
 "viu_status": "VIU-Pending",
 "notes": TP + "one new chip type used by nearly every report and by Parts date columns (Date, Invoice date, Date received). In the page link the range appears as range=custom&from=YYYY-MM-DD&to=YYYY-MM-DD - check when driving the URL cases. Exact panel labels to capture live.",
 "api_related": False})
save("cases-F-reports-filters.json", F)

# ---------------------------------------------------------------- cases-G
G = load("cases-G-page-search.json")
m = by_id(G)
srch_note = ("OWNERSHIP (tech plan 2026-07-29 G8/D22, deltas C6): this spotlight/command palette component is the separate "
             "Global Search v2 project, NOT the Filters programme - Filters ships a small page-toolbar search instead "
             "(see the Page Search Toolbar section, FLT-PSRCH-01..07). Recommend transferring/retiring this case from the "
             "Filters suite once Branko answers the page-search-scope question (PO Q6, sent 2026-07-27).")
for i in range(1, 9):
    add_note(m[f"FLT-SRCH-0{i}"], srch_note)
s9 = m["FLT-SRCH-09"]
add_note(s9, "UPDATE 2026-07-29: the ENGINEERING answer is now on record (tech plan G8/D22) - the page-local toolbar search (spec v1.3 Story 13) belongs to the Filters programme; the spotlight/command-K palette is the separate Global Search v2 project with its own PRD, and the nav search additionally STOPS filtering page lists (Story 14). Pending Branko's product ratification (PO Q6); once ratified, transfer/retire FLT-SRCH-01..08 to Global Search and keep FLT-PSRCH-01..07 here.")
save("cases-G-page-search.json", G)

# ---------------------------------------------------------------- cases-H (NEW)
PSR_PERM = "Any signed-in user with access to the page being searched."
H = [
{
 "id": "FLT-PSRCH-01", "area": "Page Search Toolbar",
 "title": "Page toolbar Search expands in place and narrows the list as you type",
 "priority": "High", "type": "Functional",
 "permissions_required": PSR_PERM,
 "preconditions": [
  "1. You are signed in to the ShopView App on a desktop browser.",
  "2. You are on the Work Orders page with several work orders listed."],
 "steps": [
  "1. Find the Search control in the page toolbar (a magnifier icon with the word Search).",
  "2. Click it.",
  "3. Type part of a work order's text (for example part of a customer or asset name).",
  "4. Clear the text with the round x in the box.",
  "5. Click somewhere else on the page while the box is EMPTY.",
  "6. Expand it again, type text, and click somewhere else."],
 "expected": [
  "1. The control expands in place into a small search box inviting you to type (engineering copy: 'Type to search').",
  "2. The list narrows as you type, after a brief pause - and ONLY this page's list changes, nothing else in the app.",
  "3. The round x clears the text and the full list returns.",
  "4. Clicking away with an empty box collapses it back to the Search button; with text in it, the box stays open."],
 "design_ref": "tech-plan-2026-07-29/TechPlan-AppWide-Filter-Redesign.md D18; Figma 11829:8908 (page search component, 4 states)",
 "spec_ref": "Filters (Epic key TBD); tech plan 2026-07-29 D18; spec v1.3 S13-R1..R7, S13-R9, S13-R15 (export awaited)",
 "viu_status": "VIU-Pending",
 "notes": TP + "typing is debounced about 300 ms (some pages differ, e.g. Inventory 750 ms); the box sends the page's own existing search request; exact copy/placeholder to capture live.",
 "api_related": False},
{
 "id": "FLT-PSRCH-02", "area": "Page Search Toolbar",
 "title": "Page search combines with filters and is cleared separately",
 "priority": "High", "type": "Functional",
 "permissions_required": PSR_PERM,
 "preconditions": [
  "1. You are signed in to the ShopView App on a desktop browser.",
  "2. You are on the Work Orders page with work orders for several customers and statuses."],
 "steps": [
  "1. Apply one filter (for example a Status).",
  "2. Type a search term in the page search box.",
  "3. Clear ONLY the search (the round x).",
  "4. Re-type the search, then clear ONLY the filter."],
 "expected": [
  "1. With both active, the results match the filter AND the search together (both narrow the list at once).",
  "2. Clearing the search keeps the filter applied.",
  "3. Clearing the filter keeps the search applied - each is cleared by its own control without wiping the other."],
 "design_ref": "tech-plan-2026-07-29/TechPlan-AppWide-Filter-Redesign.md D18",
 "spec_ref": "Filters (Epic key TBD); tech plan 2026-07-29 D18; spec v1.3 S13-R10/R13 + S8-R5 (export awaited)",
 "viu_status": "VIU-Pending",
 "notes": TP + "whether the bar's 'Clear filters' link ALSO clears the search box is not yet readable from our spec copy (S8-R5 text awaited) - observe live and tighten expected 3 then.",
 "api_related": False},
{
 "id": "FLT-PSRCH-03", "area": "Page Search Toolbar",
 "title": "The page search text is remembered and restored like filters",
 "priority": "High", "type": "Functional",
 "permissions_required": PSR_PERM,
 "preconditions": [
  "1. You are signed in to the ShopView App on a desktop browser.",
  "2. You are on the Work Orders page."],
 "steps": [
  "1. Type a search term that matches some work orders.",
  "2. Go to another area of the app and come back to the Work Orders page.",
  "3. Now type a search term that matches NOTHING, leave the page, and come back again."],
 "expected": [
  "1. The search box comes back with your text still in it and the list still narrowed by it - just like the filters.",
  "2. A remembered search that matches nothing shows the no-results empty state - the remembered text is NOT silently thrown away."],
 "design_ref": "tech-plan-2026-07-29/TechPlan-AppWide-Filter-Redesign.md D18",
 "spec_ref": "Filters (Epic key TBD); tech plan 2026-07-29 D18; spec v1.3 S10-R4/R5, S10-N2 (export awaited)",
 "viu_status": "VIU-Pending",
 "notes": TP + "the search text is saved per user exactly like the filters (account-level). Whether the text carries across a page's tabs follows that page's filter scoping - shared across the Work Orders tabs, separate per tab where filters are per tab (spec self-conflict flagged to the author; deltas C8) - observe live.",
 "api_related": False},
{
 "id": "FLT-PSRCH-04", "area": "Page Search Toolbar",
 "title": "The search term is part of the shareable page link",
 "priority": "Medium", "type": "Functional",
 "permissions_required": PSR_PERM,
 "preconditions": [
  "1. You are signed in to the ShopView App on a desktop browser.",
  "2. You are on the Work Orders page."],
 "steps": [
  "1. Type a search term and copy the page address.",
  "2. Open the copied address in a fresh tab.",
  "3. Hand-edit the search part of the address into something malformed and load it."],
 "expected": [
  "1. The address contains the search term after step 1.",
  "2. The fresh tab opens with the search box filled and the list already narrowed.",
  "3. The malformed part is ignored - the page loads cleanly without an error.",
  "4. A search arriving via a link is view-only, the same as filters from a link - it does not overwrite your own remembered search."],
 "design_ref": "tech-plan-2026-07-29/TechPlan-AppWide-Filter-Redesign.md D18 / G7",
 "spec_ref": "Filters (Epic key TBD); tech plan 2026-07-29 D18 + G7; spec v1.3 S11-R4/R5, S11-N2 (export awaited)",
 "viu_status": "VIU-Pending",
 "notes": TP + "the view-only rule (expected 4) follows G7 which is pending Branko's spec-text ratification (deltas C1) - same caveat as FLT-URL-05.",
 "api_related": False},
{
 "id": "FLT-PSRCH-05", "area": "Page Search Toolbar",
 "title": "On mobile the search expands in the toolbar and buttons make room",
 "priority": "Medium", "type": "Functional",
 "permissions_required": PSR_PERM,
 "preconditions": [
  "1. You are signed in to the ShopView App on a mobile device.",
  "2. You are on the Work Orders page."],
 "steps": [
  "1. Tap the Search control in the page toolbar.",
  "2. Type a term and watch the list.",
  "3. Visit a page that has several small icon-only toolbar buttons (for example Parts Inventory or Purchase Orders) and look at its toolbar."],
 "expected": [
  "1. The search expands inline inside the toolbar - no separate popup window opens.",
  "2. The list narrows as you type, same as desktop.",
  "3. To make room, the page's main button no longer stretches full-width, and pages with two or more small icon buttons collapse them into a single 'more' menu."],
 "design_ref": "tech-plan-2026-07-29/TechPlan-AppWide-Filter-Redesign.md D18 / D21",
 "spec_ref": "Filters (Epic key TBD); tech plan 2026-07-29 D21; spec v1.3 S13-R16..R21 (export awaited)",
 "viu_status": "VIU-Pending",
 "notes": TP + "pages named for the icon-collapse: Inventory, Purchase Orders, Timesheet Activities, both Technician Efficiency reports, Sales Tax (Collected), plus any page with 2+ icon actions. Exact mobile layout to capture live.",
 "api_related": False},
{
 "id": "FLT-PSRCH-06", "area": "Page Search Toolbar",
 "title": "Every list page keeps its own search box (Parts, Reports, detail tabs)",
 "priority": "Medium", "type": "Functional",
 "permissions_required": PSR_PERM,
 "preconditions": [
  "1. You are signed in to the ShopView App on a desktop browser.",
  "2. The page-search rollout has shipped (same programme as the Work Orders filters)."],
 "steps": [
  "1. Visit several list surfaces: a Parts view (for example Inventory), a report, a customer's Notes tab on the customer page, and any pop-up list that used to be searchable.",
  "2. On each, look for that surface's own search box and use it."],
 "expected": [
  "1. Every list surface that could be text-searched before still offers its own search control - no list silently lost its search.",
  "2. Each search box narrows only its own list, not any other page."],
 "design_ref": "tech-plan-2026-07-29/TechPlan-AppWide-Filter-Redesign.md Phase 9.1 / risk 9",
 "spec_ref": "Filters (Epic key TBD); tech plan 2026-07-29 Phase 9.1 (built-in table search, opt-out); spec v1.3 S13-R22 + S14-R5/R6 (export awaited)",
 "viu_status": "VIU-Pending",
 "notes": TP + "engineering's safety net is a built-in search on every list table (opt-out) precisely so nothing is forgotten - this case is the release sweep for it. Pull the exact page list (S13-R22) from the spec v1.3 export when it arrives.",
 "api_related": False},
{
 "id": "FLT-PSRCH-07", "area": "Page Search Toolbar",
 "title": "The top navigation search no longer filters page lists",
 "priority": "High", "type": "Functional",
 "permissions_required": PSR_PERM,
 "preconditions": [
  "1. You are signed in to the ShopView App on a desktop browser.",
  "2. You are on the Work Orders page with several work orders listed."],
 "steps": [
  "1. Type a term into the TOP NAVIGATION search (the app-wide search at the top), not the page's own search box.",
  "2. Watch the Work Orders list while typing.",
  "3. Repeat on the Parts Inventory page.",
  "4. Pick one of the results offered in the navigation search's dropdown."],
 "expected": [
  "1. The page list does NOT narrow while you type in the navigation search - only its dropdown of matching records appears.",
  "2. The same holds on the other pages checked.",
  "3. Picking a dropdown result still takes you to that record - the navigation search keeps its find-and-open role."],
 "design_ref": "tech-plan-2026-07-29/TechPlan-AppWide-Filter-Redesign.md Phase 9 / D22",
 "spec_ref": "Filters (Epic key TBD); tech plan 2026-07-29 Phase 9 (search decoupling); spec v1.3 Story 14 S14-R2/R3 (export awaited)",
 "viu_status": "VIU-Pending",
 "notes": TP + "the old behaviour (nav search silently filtering the open page's list) is REMOVED for real, app-wide. Its replacement on each page is the page's own search box (FLT-PSRCH-01/06). Do not run before the pages have their own boxes - engineering lands the page boxes first.",
 "api_related": False},
]
with open(os.path.join(CASES, "cases-H-page-search-toolbar.json"), "w") as f:
    json.dump(H, f, indent=1, ensure_ascii=False)
    f.write("\n")

print("Edits + new cases applied.")
total = 0
import glob
for fn in sorted(glob.glob(os.path.join(CASES, "cases-*.json"))):
    n = len(json.load(open(fn)))
    total += n
    print(os.path.basename(fn), n)
print("TOTAL:", total)
