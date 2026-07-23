# SV-8183 VIU — Role reset + drift + template-vs-spec finding (2026-07-23)

## Requirement
User asked to reset all 11 system roles to template (as they did for Tech), record before→after diff, and verify each template default against SV-8183 §9/§9.2.

## Result — NO RESET NEEDED (all 11 already at template)
Live comparison of each role's CURRENT fe_permissions vs its own template's fe_permissions
(GET /api/roles/{id} vs GET /api/role-templates/{template_id}/fe-permissions), org d55bc308:

| Role | current | template | drift |
|---|---|---|---|
| Admin | 42 | 42 | clean |
| Service Manager | 36 | 36 | clean |
| Senior Service Advisor | 31 | 31 | clean |
| Service Advisor | 25 | 25 | clean |
| Foreman | 23 | 23 | clean |
| Technician | 6 | 6 | clean (user reset earlier today) |
| Parts Manager | 31 | 31 | clean |
| Parts Technician | 19 | 19 | clean |
| Office User | 25 | 25 | clean |
| Sales Representative | 8 | 8 | clean |
| Time Clock User | 3 | 3 | clean |

All 11 roles' current permission sets are byte-identical to their template defaults (0 over-grant, 0 under-grant).
The ONLY role that had been over-granted was **Technician** (previously 19 perms incl. workOrdersCreateAndEdit + woFullViewMode + woReviewWorkOrders + seeFinancialData); the USER reset it via "Reset To Template" earlier today → now 6 canonical perms. No other role was drifted.
Therefore driving "Reset To Template" on the 10 others would be a NO-OP (identical result). No redundant writes were made to the shared env. Data source: role-current-vs-template.json.

## Template default vs SV-8183 §9.2 — 0 deviations
Derived each role's capability matrix from its TEMPLATE-default atoms using the SV-8183 action→atom map, and diffed against the §9.2 per-role matrix (truth-table method, Rule 15). Result: **all 11 roles MATCH §9.2 exactly** — see template-vs-spec92.json (findings: NONE).
Gates used: EditSet=settingsApp; Complete=workOrdersCreateAndEdit+woFullViewMode+workOrderLinesCreateAndEdit; Pick=woPickParts; Order=woOrderParts+seeFinancialData; RecvWO=woOrderParts; Bulk=vendorOrderManagementCreateAndEdit+seeFinancialData; AssignV=vendorOrderManagementCreateAndEdit; FixPN=catalogInventoryCreateAndEdit; AddVL=workOrderLinesCreateAndEdit+seeFinancialData; MarkRev=woReviewWorkOrders.

## Meaning for the VIU
The permission-COMPOSITION layer (which role holds which atoms) is now confirmed canonical (template=spec). NOTE per Rule 12: this atom-composition is NOT itself the FE-gate verdict — the actual per-role UI control behavior is observed separately (see per-role logs). This section establishes that the roles being observed carry the correct spec-default permissions.
