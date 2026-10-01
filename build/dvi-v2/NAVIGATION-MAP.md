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
| Inspection Templates (list) | Settings → sidebar "Inspection Templates" | list shows "New Template" · states "Draft" / "Published" / "Archived" | inspection-templates-list.txt |
| Template builder (new) | **`/inspection-templates/new`** (or Inspection Templates → "New Template") | the builder IS a top route with `/new`; bare `/inspection-templates` (list) is empty | template-builder-new.txt |
| Template builder (edit) | `/inspection-templates/<id>` (Edit from the list) | same builder | — |
| Work order (new) | top menu "Work Orders" → "New" (pick customer/unit) | referenced by cases for seeding an inspection | (cases) |
| Line Builder | Work Order → "Lines" → "Line Builder" | where findings become WO lines (to confirm) | (cases) |
| Inspection results (a run) | **`/inspections/<uuid>`** — from a WO line's inspection row, click "Open ›" | the filled checklist + findings + "Build lines"; bare `/inspections` (no id) is empty | inspection-results.png |
| ❌ `/inspections` (bare) | — | empty 232-char page — a run needs its <uuid> | inspections-route.txt |
| ❌ `/inspection-templates` (bare) | — | the LIST is under Settings; the builder is `/inspection-templates/new` | templates-route.txt |

## API ENDPOINTS (host sv8181api.qa.shopview.com)
General: /api/auth/me/fe-permissions · /api/work-orders (list, ?limit=N) · /api/work-orders/<uuid> ·
/api/global-search/fetch · /api/notes · /api/iam/view-profile/ · /api/technician-tasks/my-current-task.
**DVI (confirmed):**
- `GET /api/inspection-templates` → 200 `{data:{kpis, statusCounts, collection:[{id,name,status}...]}}`. Statuses
  are "active"/"draft"/"archived" (NOT "published" — `?status=published` 400s "Unsupported status").
- `GET /api/inspection-templates/<uuid>` → 200 `{inspectionTemplate:{...fields...}}` (full field definitions).
- `GET /api/work-orders/<uuid>/inspections` → 200 `{inspections:[...]}` — **an inspection run attaches to a WO LINE**
  (each run has `workOrderLineId`, `templateId`, `templateVersion`, `templateName`). Empty `[]` when none.
- No `/api/inspections`, `/api/inspection-runs`, `/.../runs` (all 404) — runs are reached via the owning WO.
# Current template ids on sv8181: LOF Inspection e1f79b42-d651-4c37-ac59-2844f00f6c4c · Air-Brake Inspection
#   222b63ec-5ddc-4ddd-a122-ce1b34c59ec7 · Large template e4ba4f69-37b3-4b10-9604-fc6e58732c4f (3 active, 3 runs/30d).
# Example RUN for observing results: WO **S2-16154** (3d78d797-ab9d-447e-a980-a4dbbd3f72bf) has a LOF Inspection
#   run (99b3c4d4-e143-46ca-bdbf-3419e381fed7) on line e20aed8a-6c3a-4652-9653-5a57f3873e71.
# ⚠️ The SPA code-splits: DVI feature label strings are in LAZY chunks, NOT in index.html's entry bundles —
#   grepping the entry chunks misses them (only generic "N/A"/"Flag" hit). OBSERVE labels on the screen.

## BUILD GLOSSARY — Template builder (route /inspection-templates/new)  — Evidence: template-builder-new.txt, field-editor-checkbox.txt
Header actions: "Preview" · "Save Draft" · "Publish" · "Unsaved changes" · back chevron "Admin · Inspection templates".
Left panel "OUTLINE": "Section 1" · "+ Add Section" · "TEMPLATE NAME" ("Untitled template") · "DESCRIPTION".
Template-level setting: "Require technician signature".
Start options: "Start from a template" (starters: "Class 8 Tractor PM Inspection", "DOT / Annual Federal Safety
  Inspection", "Air-Brake Inspection", "Trailer Inspection", "Light-Duty PM Inspection", "Equipment starter")
  · "Or build from scratch · Select a field type to begin".
A field row: "+ Add Field" · "+ Add Section" · drag_indicator · content_copy (duplicate) · delete_outline · more_horiz.
  A Checkbox field summarises as "Checkbox · OK / Monitor / Not OK / N/A".
Field properties panel: "Field properties" · "LABEL" · "TYPE" (options: "Checkbox" · "Text" · "Measurement" ·
  "Per axle" · "Photo") · "Instructions" · "RESPONSE OPTIONS" · "RESPONSE SETTINGS" · "Include Monitor option".
Response values on a Checkbox question: "OK" · "Monitor" · "Not OK" · "N/A". Per-response add-ons: "Note" · "Photo".
# NOTE: the cases carry both "-" and "—" dash variants in role labels (e.g. "Work Orders - View" vs "Work Orders — View").
#   Normalise to the ROLE EDITOR's actual label when that screen is observed (to do).

## STILL TO OBSERVE (will be filled as discovered)
# Inspection filling screen (responses, flag, note, photo per response) · findings → WO lines ("build action") ·
# asset record "Inspections" tab + history · customer-facing inspection report · per-axle entry (Drum/Disc/
# Single/Dual, unit selector) · conditional follow-up on a checkbox · ShopCoach draft.
