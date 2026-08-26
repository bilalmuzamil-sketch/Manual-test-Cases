#!/usr/bin/env python3
"""Author the Global Search V1->V2 REGRESSION suite (skill 17).

Each case protects a V1 behaviour the V2 PRD does NOT change (an invariant): if V2
breaks it, that is a regression. Written plain and runnable for a non-technical QA
tester (no code in the tester-facing body; the code fact + INV-id live in provenance).

Source of FACT: V1 baseline handoff (ShopView/shopview@5576716...), read 2026-08-26.
V2 standing: PRD 576978945 v1.2 (Confluence v12) - silent on / preserves each row below.
Rule 85: no QA build exercised yet -> deferred AUTOMATION marker (build-verifiable).
"""
import json, os

ROOT = "build/global-search/regression-2026-08-26"
os.makedirs(os.path.join(ROOT, "cases"), exist_ok=True)
AREA = "Global Search V2 - V1 Regression Suite"
BASELINE = "V1 baseline ShopView/shopview@5576716 (read 2026-08-26)"

def prov(inv, src, v2standing):
    # Rule 54 provenance for a regression case: state plainly that the expected
    # behaviour is the EXISTING (pre-V2) behaviour, with a short but traceable
    # source (invariant id + pinned commit + file:line) so it cannot be called imagined.
    return ("\n\n---\n"
            f"This is the expected behaviour based on the EXISTING behaviour BEFORE the V2 deployment "
            f"(the V1 regression baseline), not on assumption. "
            f"Traceable source: {inv} - ShopView/shopview@5576716 - {src}. "
            f"The V2 spec (Global Search Product Requirements v1.2, Confluence page 576978945, "
            f"version 12) {v2standing}, so this behaviour must still hold after V2; if it changes, "
            f"it is a regression to raise."
            "\n\nAUTOMATION: Not available on Build to test Yet - Last checked 8/26/2026")

def C(cid, title, pre, steps, expected, inv, src, v2, refs, priority="High", notes=""):
    assert len(title) <= 80, f"{cid} title {len(title)}"
    body = "\n".join(f"{i+1}. {l}" for i, l in enumerate(expected))
    return {"id": cid, "area": AREA, "title": title, "priority": priority, "type": "Regression",
            "permissions_required": "role/permission as stated in Preconditions",
            "preconditions": pre, "steps": steps,
            "expected": body + prov(inv, src, v2),
            "design_ref": "V1 behaviour baseline (fact); not a design artefact.",
            "spec_ref": f"regression-2026-08-26 invariant {inv}",
            "refs": refs, "viu_status": "source-verified-only", "notes": notes}

cases = [
# ---- Permission gating (V2 §9 explicitly preserves RBAC) ----
 C("GSREG-PERM-01","Work Orders results appear only for users with Work Orders access",
   ["Two test users: User A whose role includes 'Work Orders - View'; User B whose role does NOT include it.",
    "At least one Work Order exists whose number or customer matches the search word you will type."],
   ["Sign in as User A and open global search.","Type a word that matches an existing Work Order.","Note whether Work Order results appear.",
    "Sign out, sign in as User B, and repeat the same search."],
   ["User A sees Work Order results.","User B sees NO Work Order results (the Work Orders group does not appear for them).",
    "No other change to what each user can otherwise see."],
   "INV-72 (WO)","FetchDataQueryHandler.php:42-67","preserves existing role-based access (section 9)",
   "SV-9160 (INV-72; V1 baseline 5576716)"),
 C("GSREG-PERM-02","A Part-Sales-only role sees Part Sales but not catalog Parts or Vendors",
   ["A user whose role grants Part Sales access only (no Catalog & Inventory access, no Vendor access).",
    "Data exists that would match a Part Sale, a catalog Part, and a Vendor for the word you search."],
   ["Sign in as this user and open global search.","Search a word that matches a Part Sale, a catalog Part, and a Vendor.","Look at which groups appear."],
   ["Part Sale results appear.","NO catalog Part results appear.","NO Vendor results appear."],
   "INV-73 (SV-8412)","FetchDataQueryHandler.php:47-53; routingService.ts:84-85","preserves existing role-based access (section 9)",
   "SV-9160 (INV-73; V1 baseline 5576716)"),
 C("GSREG-PERM-03","Catalog Part results appear only with Catalog & Inventory access",
   ["User A with 'Catalog & Inventory - View'; User B without it.","A catalog part exists that matches the search word."],
   ["As User A, search a word matching a catalog part; note if Part results appear.","As User B, repeat the same search."],
   ["User A sees catalog Part results.","User B sees NO Part results."],
   "INV-72 / INV-73 (Part)","FetchDataQueryHandler.php:47-53","preserves existing role-based access (section 9)",
   "SV-9160 (INV-72; V1 baseline 5576716)"),
 C("GSREG-PERM-04","Vendor results appear only with Vendor & Order Management access",
   ["User A with 'Vendor & Order Management - View'; User B without it.","A vendor exists that matches the search word."],
   ["As User A, search a word matching a vendor; note if Vendor results appear.","As User B, repeat the same search."],
   ["User A sees Vendor results.","User B sees NO Vendor results."],
   "INV-72 (Vendor)","FetchDataQueryHandler.php:42-67","preserves existing role-based access (section 9)",
   "SV-9160 (INV-72; V1 baseline 5576716)"),
 C("GSREG-PERM-05","Customer and Asset results both require Customers access",
   ["User A with 'Customers - View'; User B without it.","A customer and one of its vehicles/assets match the search word."],
   ["As User A, search a word matching a customer and its asset; note if Customer and Asset results appear.","As User B, repeat the same search."],
   ["User A sees Customer results and Asset results.","User B sees NEITHER Customer nor Asset results."],
   "INV-72 (Customer+Vehicle)","FetchDataQueryHandler.php:42-67","preserves existing role-based access (section 9)",
   "SV-9160 (INV-72; V1 baseline 5576716)"),
 C("GSREG-PERM-06","A Time Clock role gets no global search results at all",
   ["A user whose role is Time Clock.","Data exists that would match the search word for a normal user."],
   ["Sign in as the Time Clock user and open global search.","Search any word that returns results for a normal user."],
   ["No results of any type are shown to the Time Clock user - the result set is entirely empty."],
   "INV-71","FetchDataController.php:50-51","is SILENT on this (a dangerous silence - see PO register)",
   "SV-9160 (INV-71; V1 baseline 5576716)","PO-REG-2: confirm Time Clock stays excluded in V2."),
 C("GSREG-PERM-07","An unrecognised result type is hidden unless explicitly permitted",
   ["A build where the search can return a result type the permission list does not explicitly allow (ask a developer to confirm/seed, or verify via the new-entity rollout)."],
   ["Open global search and run a search that could surface an unrecognised/new result type."],
   ["Any result type that is not explicitly permitted is NOT shown (the default is hide, not show)."],
   "INV-74","routingService.ts:78-99; useGlobalSearch.ts:146-150","preserves the fail-safe (permission default) (section 9)",
   "SV-9160 (INV-74; V1 baseline 5576716)","Fail-safe: new V2 entities must be explicitly permitted to appear."),
 C("GSREG-PERM-08","Recent items the user can no longer access are hidden",
   ["A user who previously opened a record (so it is in recent activity) and whose access to that record has since been removed."],
   ["Sign in as this user and open global search so recent activity shows.","Look for the record the user can no longer access."],
   ["The no-longer-permitted record does NOT appear in recent activity."],
   "INV-64","useGlobalSearch.ts:21-29","preserves permission filtering of recents (section 9)",
   "SV-9160 (INV-64; V1 baseline 5576716)"),
# ---- Tenant / location scoping ----
 C("GSREG-SCOPE-01","Results never include another organization's records",
   ["A user in Organization X.","A matching record exists in a different Organization Y for the same search word."],
   ["Sign in as the Org X user and open global search.","Search a word that matches records in both Org X and Org Y."],
   ["Only Org X records appear.","No Org Y record is ever shown."],
   "INV-80","FetchDataQueryHandler.php:127-335 (OrganizationDecorator)","preserves tenant isolation (section 9)",
   "SV-9160 (INV-80; V1 baseline 5576716)"),
 C("GSREG-SCOPE-02","Work Orders and Part Sales are limited to the current location",
   ["A user with access to two locations.","A Work Order and a Part Sale exist at another location (not the current one), matching the search word; and a Customer/Vendor exists org-wide."],
   ["While on Location 1, search the word matching those records.","Note which Work Order / Part Sale results appear."],
   ["Work Order and Part Sale results are limited to the CURRENT location (Location 1).",
    "Customer, Asset, Vendor and Part results are org-wide (not limited to the current location)."],
   "INV-81","FetchDataQueryHandler.php:130","preserves location scoping (section 9)",
   "SV-9160 (INV-81; V1 baseline 5576716)"),
 C("GSREG-SCOPE-03","Switching location refreshes results to the new location",
   ["A user with access to two locations, each with location-specific Work Orders matching the search word."],
   ["Search the word while on Location 1 and note the Work Order results.","Switch to Location 2.","Run the same search again."],
   ["After switching, the Work Order / Part Sale results reflect Location 2, not Location 1."],
   "INV-82","useGlobalSearch.ts:286-299","preserves location-switch behaviour (section 9)",
   "SV-9160 (INV-82; V1 baseline 5576716)"),
# ---- Navigation & core UX invariants ----
 C("GSREG-NAV-01","Selecting each existing result type opens the correct record",
   ["Data exists for each type: Work Order, Part Sale, Customer, Asset (vehicle), Vendor, catalog Part.","A user permitted to see all of them."],
   ["For each type in turn: search a word that matches that record and select it.","Confirm which page opens."],
   ["Work Order opens the Work Order page; Part Sale opens the Part Sale page; Customer opens the customer's work-orders page; Asset opens the vehicle's work-orders page; Vendor opens the Vendor page; catalog Part opens the catalogue part page.",
    "For an Asset, the correct owning customer is used."],
   "INV-46","GlobalSearch.vue:208-235; useGlobalSearch.ts:95-139","preserves navigation for existing types; new V2 entities add routes (section 5)",
   "SV-9160 (INV-46; V1 baseline 5576716)"),
 C("GSREG-NAV-02","Selecting the record you are already on does not re-navigate",
   ["A user viewing a specific record (for example a Work Order you already have open)."],
   ["With that record open, open global search and select the SAME record from the results."],
   ["The page does not navigate/reload to the same record again (and it is not re-added to recent activity)."],
   "INV-47","GlobalSearch.vue:223-234","is SILENT on this (invariant)",
   "SV-9160 (INV-47; V1 baseline 5576716)"),
 C("GSREG-LABEL-01","The vehicles group is shown to users as 'Assets'",
   ["Data exists for a vehicle/asset that matches the search word."],
   ["Search a word matching a vehicle and look at the group heading it appears under."],
   ["The group is labelled 'Assets' to the user (never the internal name 'Vehicles')."],
   "INV-20","GlobalSearch.vue:60","preserves the 'Assets' label (section 4 uses 'Assets')",
   "SV-9160 (INV-20; V1 baseline 5576716)"),
 C("GSREG-KEY-01","The keyboard shortcut opens global search",
   ["A signed-in user on any page, with the cursor NOT in a text field."],
   ["Press Ctrl+K on Windows (or Command+K on Mac)."],
   ["Global search opens / the search field is focused, ready to type."],
   "INV-40","GlobalSearch.vue:243-254","preserves the shortcut (section 5.1 uses the same shortcut)",
   "SV-9160 (INV-40; V1 baseline 5576716)"),
 C("GSREG-DEDUP-01","A record that matches more than once appears only once",
   ["A record whose name and another field both match the same search word."],
   ["Search a word that matches that record in more than one way.","Count how many times the record appears."],
   ["The record appears only once in the results (it is not listed twice)."],
   "INV-16","useGlobalSearch.ts:182-184","is SILENT on this (invariant)",
   "SV-9160 (INV-16; V1 baseline 5576716)"),
 C("GSREG-FLAG-01","Global search is available with no feature-flag toggle",
   ["Any permitted signed-in user."],
   ["Open global search normally, without enabling any setting or flag."],
   ["Global search is available to every permitted user - there is no feature flag or toggle gating it."],
   "INV-90","(no feature flag in code)","confirms no feature flag (section 2 / 10)",
   "SV-9160 (INV-90; V1 baseline 5576716)"),
 C("GSREG-FETCH-01","A user with no default workplace does not break search",
   ["A user who has NO default workplace set."],
   ["Sign in as this user and open global search."],
   ["Global search does not error; it simply does not load a result collection for this user (it degrades gracefully)."],
   "INV-34","GlobalSearch.vue:131-137","is SILENT on this (invariant)",
   "SV-9160 (INV-34; V1 baseline 5576716)"),
 C("GSREG-ANALYTICS-01","Selecting a result records a usage analytics event",
   ["Analytics capture is available for verification (ask a developer or use the analytics console)."],
   ["Open global search, run a search, and select a result.","Check that a global-search-usage analytics event was recorded."],
   ["A usage analytics event is recorded when a result is selected."],
   "INV-48","GlobalSearch.vue:211-217","is SILENT on this vs the new telemetry (section 6.4) - see PO register",
   "SV-9160 (INV-48; V1 baseline 5576716)","PO-REG-4: confirm the existing analytics event remains alongside V2 telemetry.", ),
 C("GSREG-MINCHAR-01","Search needs at least two characters before it matches",
   ["Any permitted user with data that would match a single letter."],
   ["Open global search and type a single character.","Then type a second character."],
   ["With one character, no matching search runs (recent activity may show instead).","Matching begins at two characters."],
   "INV-10","useGlobalSearch.ts:69-71","is SILENT on the minimum-character threshold - see PO register",
   "SV-9160 (INV-10; V1 baseline 5576716)","PO-REG-3: confirm the 2-character minimum for V2.",),
]

with open(os.path.join(ROOT, "cases", "regression-cases.json"), "w") as f:
    json.dump(cases, f, indent=2, ensure_ascii=False); f.write("\n")
print("regression cases:", len(cases))
