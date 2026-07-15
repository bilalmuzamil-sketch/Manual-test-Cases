#!/usr/bin/env python3
"""
Custom Roles (SV-7388) — PRODUCTION vs STAGING role/permission gap generator.

STATUS OF DATA (2026-07-14/15):
  * STAGING side  = LIVE-VERIFIED. Captured read-only from api.staging.shopview.com
    (GET /api/organizations/{org}/roles + per-role GET /api/roles/{id}), 11 system
    roles, all HTTP 200. Source: compare-evidence-2026-07-14/staging-capability-matrix.json.
  * PRODUCTION side = *** SPEC-PREDICTED / UNVERIFIED ***. Production could NOT be
    authenticated (missing a valid production sv_sso_session; every prod API call
    returned 409 "Session has expired"; dev quick-login 500s on prod). NO live
    production role data was captured. The "Prod grants?" column is therefore taken
    ENTIRELY from the SPEC's own "Behavior Changes for Migrating Users" table
    (build/custom-roles-spec-update/updated-spec-source.md, "Loses ..." rows) — i.e.
    the reductions the SPEC ITSELF declares. These are PREDICTIONS of what production
    grants, NOT observations. Every prod cell is flagged NEEDS-REVIEW.

DO NOT treat this workbook as a completed prod-vs-staging compare. It is an INTERIM
scaffold: the staging half is real; the prod half must be re-run against live
production once a valid production sv_sso_session cookie is supplied.
"""
import json, os
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment

HERE = os.path.dirname(os.path.abspath(__file__))
EV = os.path.join(HERE, "compare-evidence-2026-07-14")
STG = json.load(open(os.path.join(EV, "staging-capability-matrix.json")))

# PROD->STAGING merge mapping (from PLAN §1a/§1b, sourced to spec migration table)
MERGE = {
    "Admin": "Owner + Administrator",
    "Service Manager": "Service Manager",
    "Senior Service Advisor": "Service Advisor + SA Technician + SA No Reports",
    "Service Advisor": "SA Limited View",
    "Foreman": "Foreman",
    "Technician": "Technician",
    "Parts Manager": "Parts Manager",
    "Parts Technician": "Parts Technician",
    "Office User": "Office",
    "Sales Representative": "Sales Representative + Reporting",
    "Time Clock User": "Time Clock",
}

# SPEC-DECLARED reductions = the spec's OWN "Loses ..." rows in the Behavior Changes
# table = the PROD-only capabilities the spec itself flags. (staging_has verified live.)
# fields: staging_role, prod_role_holding_extra, capability(plain), staging_code_or_gate,
#         severity, spec_evidence
SPEC_PROD_ONLY = [
    ("Service Manager", "Service Manager", "Reverse / delete an invoice (Invoicing Delete)",
     "invoicingPaymentsDelete", "High",
     "Spec Behavior-Changes: Service Manager 'Loses Invoicing Delete (cannot reverse)'"),
    ("Service Manager", "Service Manager", "Change Service settings",
     "settingsService", "Medium",
     "Spec Behavior-Changes: Service Manager 'Loses Settings: Service'"),
    ("Service Manager", "Service Manager", "Change Parts settings",
     "settingsParts", "Medium",
     "Spec Behavior-Changes: Service Manager 'Loses Settings: Parts'"),
    ("Service Manager", "Service Manager", "Change Finance settings",
     "settingsFinance", "Medium",
     "Spec Behavior-Changes: Service Manager 'Loses Settings: Finance'"),
    ("Service Manager", "Service Manager", "Use Data Import settings",
     "settingsDataImport", "Medium",
     "Spec Behavior-Changes: Service Manager 'Loses Settings: Data Import'"),
    ("Foreman", "Foreman", "Edit timesheets",
     "timesheetsCreateAndEdit", "Medium",
     "Spec Behavior-Changes: Foreman 'Loses Timesheets Edit'"),
    ("Technician", "Technician", "Send to Portal (send WO to customer portal)",
     "Send to Portal (view-mode + line-review gate; Tech View hides it)", "High",
     "Spec Behavior-Changes: Technician 'Lose Send to Portal'; staging Technician is tech-view (button hidden)"),
    ("Parts Manager", "Parts Manager", "Delete a work order",
     "workOrdersDelete", "High",
     "Spec Behavior-Changes: Parts Manager 'Loses WO ... Delete'"),
    ("Parts Manager", "Parts Manager", "Delete a work order line",
     "workOrderLinesDelete", "High",
     "Spec Behavior-Changes: Parts Manager 'Loses ... WOL Delete'"),
    ("Office User", "Office", "Create & Edit catalog / inventory items",
     "catalogInventoryCreateAndEdit", "Medium",
     "Spec Behavior-Changes: Office 'Catalog reduced to V only' (prod Office had Catalog Create&Edit)"),
]

# ---- open-questions / needs-review items (from PLAN §1c) ----
OPEN_Q = [
    ("Production data NOT captured", "Production could not be authenticated. Missing a valid "
     "production sv_sso_session (64-hex). Every prod GET returned 409 'Session has expired'; "
     "dev quick-login returns 500 on prod. cf_clearance / Cloudflare is NOT the blocker (409 "
     "returns even with no cookies). Host confirmed: SPA app.shopview.com, API api.shopview.com. "
     "NEED: a valid production sv_sso_session cookie (and confirmation prod org UUID)."),
    ("Naming trap", "Legacy 'Service Advisor' -> staging 'Senior Service Advisor' (renamed+expanded); "
     "staging 'Service Advisor' comes from legacy 'SA Limited View'. Do NOT match on name."),
    ("Spec vs migration-case contradiction", "Section-3549 migration cases C26514/C26515 were "
     "authored as 1:1 same-name mappings, contradicting the authoritative spec migration table. "
     "NEEDS USER CONFIRMATION which is authoritative for the compare (recommend the spec table)."),
    ("Prod role inventory unknown", "The 15 legacy roles are the program-wide catalog; the target "
     "prod org may hold a subset and/or shop-specific custom roles. Enumerate live before mapping."),
    ("Prod permission representation unknown", "Old-model API shape not yet observed (fe-permissions "
     "route 404s on prod). Discover live: GET /api/roles/{id}, /api/auth/me, /api/staff/{id}."),
    ("Send-to-Terminal not in spec reduction list", "Send to Terminal (take-payment) is gated in "
     "staging on invoicingPaymentsCreateAndEdit AND customerPortalPageAccess. Not on the spec's "
     "'Loses' list; must be diffed live per prod role once prod data is available."),
]

HDR = ["Staging Role", "Production role(s) mapped", "Capability", "Prod grants?",
       "Staging grants?", "Delta", "Severity", "Evidence", "Confidence / Needs-review"]

def style_header(ws, ncols):
    fill = PatternFill("solid", fgColor="1F4E78")
    for c in range(1, ncols + 1):
        cell = ws.cell(row=1, column=c)
        cell.font = Font(bold=True, color="FFFFFF")
        cell.fill = fill
        cell.alignment = Alignment(vertical="top", wrap_text=True)

def has(role, code):
    return code in STG[role]["codes"]

wb = Workbook()

# ---- Tab 0: READ ME (data-status banner) ----
ws0 = wb.active
ws0.title = "READ ME - DATA STATUS"
banner = [
    ["CUSTOM ROLES (SV-7388) - PROD vs STAGING permission gaps - INTERIM 2026-07-14/15"],
    [""],
    ["*** PRODUCTION SIDE IS SPEC-PREDICTED, NOT LIVE-VERIFIED ***"],
    ["Production could NOT be authenticated. Missing a valid production sv_sso_session."],
    ["Every prod API call returned 409 'Session has expired'. Dev quick-login 500s on prod."],
    ["cf_clearance / Cloudflare is NOT the blocker (409 returns even with no cookies)."],
    ["Host confirmed correct: SPA app.shopview.com / API api.shopview.com."],
    [""],
    ["STAGING SIDE = LIVE-VERIFIED (read-only, 11 system roles, all HTTP 200)."],
    ["The 'Prod grants?' column is taken from the SPEC's own 'Behavior Changes for"],
    ["Migrating Users' table ('Loses ...' rows) - i.e. reductions the spec DECLARES,"],
    ["NOT observations of production. Every prod cell is flagged NEEDS-REVIEW."],
    [""],
    ["TO COMPLETE: obtain a valid production sv_sso_session, capture prod role model"],
    ["live, then re-run gen_prod_vs_staging.py with the prod capture wired in."],
]
for r in banner:
    ws0.append(r)
ws0["A1"].font = Font(bold=True, size=13)
ws0["A3"].font = Font(bold=True, color="C00000", size=12)
ws0["A9"].font = Font(bold=True, color="1F6F1F")
ws0.column_dimensions["A"].width = 95

# ---- Tab 1: PROD-ONLY Deltas ----
ws1 = wb.create_sheet("PROD-ONLY Deltas (spec-pred)")
ws1.append(HDR)
style_header(ws1, len(HDR))
for srole, prole, cap, code, sev, ev in SPEC_PROD_ONLY:
    # staging grant: for atom codes, check live; for gated capabilities, note the gate
    if code in {c for r in STG.values() for c in r["codes"]} or code.startswith(("invoicing","settings","timesheets","workOrders","workOrder","catalog")):
        sg = "Yes" if has(srole, code) else "No"
    else:
        sg = "No (view-mode/line gate; hidden in staging for this role)"
    ws1.append([
        srole, MERGE[srole], cap, "Yes (SPEC-PREDICTED)", sg, "PROD-ONLY", sev,
        ev, "NEEDS REVIEW - prod side unverified (no live prod data)"
    ])
for col, w in zip("ABCDEFGHI", [22, 34, 42, 20, 34, 12, 10, 60, 42]):
    ws1.column_dimensions[col].width = w

# ---- Tab 2: Summary per role ----
ws2 = wb.create_sheet("Summary per role")
ws2.append(["Staging Role", "Merged?", "Production role(s) mapped",
            "# spec-predicted PROD-only", "Highest severity", "Needs-review"])
style_header(ws2, 6)
order = ["Admin", "Service Manager", "Senior Service Advisor", "Service Advisor",
         "Foreman", "Technician", "Parts Manager", "Parts Technician",
         "Office User", "Sales Representative", "Time Clock User"]
sevrank = {"High": 3, "Medium": 2, "Low": 1}
for role in order:
    items = [x for x in SPEC_PROD_ONLY if x[0] == role]
    merged = "YES" if "+" in MERGE[role] else "no"
    hs = max([x[4] for x in items], key=lambda s: sevrank[s], default="-")
    ws2.append([role, merged, MERGE[role], len(items), hs,
                "YES - all prod cells unverified"])
for col, w in zip("ABCDEF", [22, 8, 34, 26, 16, 30]):
    ws2.column_dimensions[col].width = w

# ---- Tab 3: Full staging capability matrix (LIVE) ----
ws3 = wb.create_sheet("Staging capability matrix LIVE")
allcodes = sorted({c for r in STG.values() for c in r["codes"]})
ws3.append(["Capability code"] + order)
style_header(ws3, len(order) + 1)
extra_rows = [("view_mode", lambda r: STG[r]["view_mode"]),
              ("seeFinancialData", lambda r: STG[r]["ct"].get("seeFinancialData")),
              ("seeApArData", lambda r: STG[r]["ct"].get("seeApArData")),
              ("viewHistoryLogs", lambda r: STG[r]["ct"].get("viewHistoryLogs"))]
for label, fn in extra_rows:
    ws3.append([label] + [str(fn(r)) for r in order])
for code in allcodes:
    ws3.append([code] + ["Y" if code in STG[r]["codes"] else "" for r in order])
ws3.column_dimensions["A"].width = 34
for col in "BCDEFGHIJKL":
    ws3.column_dimensions[col].width = 10

# ---- Tab 4: Open questions / confirmations ----
ws4 = wb.create_sheet("Open questions - NEEDS REVIEW")
ws4.append(["Item", "Detail"])
style_header(ws4, 2)
for item, detail in OPEN_Q:
    ws4.append([item, detail])
ws4.column_dimensions["A"].width = 38
ws4.column_dimensions["B"].width = 100
for row in ws4.iter_rows(min_row=2):
    row[1].alignment = Alignment(wrap_text=True, vertical="top")

out_xlsx = os.path.join(HERE, "Prod-vs-Staging-Permission-Gaps_2026-07-14.xlsx")
wb.save(out_xlsx)
print("wrote", out_xlsx)
