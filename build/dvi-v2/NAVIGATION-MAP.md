# DVI V2 — NAVIGATION MAP (observed, reusable — Rule 27 / skill 03 §9)
# Env: sv8181.qa.shopview.com (QA branch) · build v26.36.8-2a64085 · first observed 2026-10-01
# PERMANENT: every UI route + API endpoint discovered goes here the moment it is confirmed live, so it is
# never rediscovered. Each row: what it is · how to reach it · evidence file. Update IN THE SAME PASS you learn it.

## ACCESS RECIPE (QA branch behind Cloudflare — needs THREE cookies, unlike CloudFront-only branches)
- App  : https://sv8181.qa.shopview.com      API : https://sv8181api.qa.shopview.com  ("api" has NO dot, per qa-branch-boot)
- Cookies (SECRETS, /tmp only, chmod 600, NEVER committed): sv_sso_session + PHPSESSID + cf_clearance
  in /tmp/cln/sv8181-cookies.json; sso-only file for boot at /tmp/qa-cookies/sv8181-sso.txt.
- Browser boot: `node build/testing-tools/qa-branch-boot.mjs sv8181 <route> admin`  (import { boot } from it).
  cf_clearance is UA-bound → Chrome-131 UA. node fetch needs NODE_USE_ENV_PROXY=1; refresh MITM bridge via
  `source build/testing-tools/ensure_bridge.sh`. Judge session by template_slug/perm count, not role.name.
- fe-permissions read: GET https://sv8181api.qa.shopview.com/api/auth/me/fe-permissions  (→ 200, {data:{fe_permissions:[...]}}).

## TOP NAVIGATION (observed on landing)
"Work Orders" · "Schedule" · "Customers" · "Parts" · "Reports"  — NO top-level "Inspections" link.
# Evidence: build-verify-2026-10-01/landing-nav.txt

## UI ROUTES
| What | Route / how to reach | Notes | Evidence |
|---|---|---|---|
| Settings landing | `/administration/settings` | left sidebar; SERVICE section holds "Inspection Templates" | settings-landing.txt |
| Inspection Templates (list) | Settings → sidebar "Inspection Templates" | list shows "New Template" · tabs/filters "Draft" / "Published" / "Archived" | inspection-templates-list.txt |
| Template builder | Inspection Templates → "New Template" or "Edit" | field types + responses — see Glossary below | template-builder.txt |
| Work order (new) | top menu "Work Orders" → "New" (pick customer/unit) | referenced by cases for seeding an inspection | (cases) |
| ❌ `/inspections` | — | DOES NOT EXIST on this build (empty 232-char page) — do not retry | inspections-route.txt |
| ❌ `/inspection-templates` | — | DOES NOT EXIST as a top route (empty) — templates are under Settings | templates-route.txt |

## API ENDPOINTS (host sv8181api.qa.shopview.com, observed during boot)
/api/auth/me/fe-permissions · /api/work-orders · /api/global-search/fetch · /api/notes ·
/api/iam/view-profile/ · /api/technician-tasks/my-current-task · /api/users/me/preferences/work-orders-list ·
/api/notifications/subscribe-token · /api/reporting/individual-punch-clock/today
# (DVI-specific endpoints — inspections, templates — to be captured from the network tab as screens are driven.)

## BUILD GLOSSARY — Template builder (Settings → Inspection Templates)
Templates list: "New Template" · states "Draft" / "Published" / "Archived".
Builder field types: "Checkbox" · "Text" · "Number" · "Measurement" · "Per axle" · "Photo".
Response options on a question: "OK" · "Monitor" · "Not OK". Field attribute: "Required".
# Evidence: template-builder.txt, inspection-templates-list.txt

## STILL TO OBSERVE (will be filled as discovered)
# Inspection filling screen (responses, flag, note, photo per response) · findings → WO lines ("build action") ·
# asset record "Inspections" tab + history · customer-facing inspection report · per-axle entry (Drum/Disc/
# Single/Dual, unit selector) · conditional follow-up on a checkbox · ShopCoach draft.
