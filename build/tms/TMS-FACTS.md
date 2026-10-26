# Shopview TMS — facts for doing what we used to do in TestRail

**Written 2026-10-26.** Host: **https://tms.shopview.com** · API base: **`/api/v1`** · API reference:
**`GET https://tms.shopview.com/api/v1/docs`** (OpenAPI 3.1, public, no login). Snapshot:
`build/tms/tms-openapi-2026-10-26.json` (sha256 `71257fb2…dc1cc29e`). Client:
`build/testing-tools/tms_client.py` · key resolver: `build/testing-tools/load_creds.py` → `tms_key()`.

## 0 · How sure each fact is — read this before relying on anything below

| Mark | Means | Where it came from |
|---|---|---|
| **[API-DOC]** | Written in TMS's own OpenAPI document | `tms-openapi-2026-10-26.json` |
| **[LIVE]** | Observed from tms.shopview.com on 2026-10-26, **without logging in** | curl, logged below |
| **[UI-CODE]** | Read from the TMS front-end JavaScript, **not** confirmed by a live write | assets served on 2026-10-26 (build `index-BLs1hNAZ.js`) |
| **UNVERIFIED** | Not yet observed. The first session with a key must confirm it and update this file | — |

**Nothing below has been checked with a key yet.** No TMS API key existed in this session (env vars,
`/tmp/shopview-creds.env` and `/tmp/tms/creds.json` were all checked). So no read or write was made
as a signed-in user.

**Live observations (2026-10-26, unauthenticated):**
- `GET /api/v1/me` with no token → **401** `"JWT Token not found"`.
- With `Authorization: Bearer svtm_<invalid>` → **401** `"Invalid API key."` The API-key path exists.
- `GET /api/v1/docs` → **200**, OpenAPI 3.1, title *"Shopview Test Management Tool API"*.
- Errors are RFC 7807 `application/problem+json`, e.g. `"No route found for "GET …""`.

## 1 · Access

- **[API-DOC]** People sign in to the website with **Google Workspace only**; there is **no password login**.
- **[API-DOC]** Scripts use an **API key `svtm_…`**: `Authorization: Bearer svtm_…`, or Basic `email:svtm_…`.
  Keys are issued in the UI at **Settings → API keys** ([UI-CODE] labels: *"New API key"*, *"Copy your key
  now"*, *"It is shown only once. Store it in your CI secrets."*). A key belongs to the person who made it,
  and its actions are recorded under that person.
- **[API-DOC]** *"API keys never manage users or API keys."*
- **Secrets rule (82) applies unchanged:** the key lives in `TMS_API_KEY` (env var), or in
  `/tmp/shopview-creds.env` as `TMS_API_KEY=…`, or in `/tmp/tms/creds.json` as `{"api_key": "…"}`.
  Use `chmod 600`. **Never commit it.** Run `scan_secrets.py --staged` before every commit.
- **[API-DOC] Rate limit:** 1,200-token bucket per key, refilled at 20/second. A **429** carries
  `Retry-After` (usually 1 s). A **503** with `Retry-After` means the database was busy; retry. The client
  handles both.

## 2 · TestRail operation → TMS operation

| We used to (TestRail API v2) | In TMS (`/api/v1`) | Notes |
|---|---|---|
| `get_projects` | `GET /projects` | [API-DOC] Lists active (non-archived) projects only |
| `get_sections` + **manual paging (250 trap)** | `GET /projects/{id}/sections/tree` | [API-DOC] *"the one unpaginated list"*, nested `children`. **The 250-row silent truncation trap does not exist here.** |
| `add_section` | `POST /projects/{id}/sections` | [API-DOC] *"Create a root or child section"*. Body fields `name`, `description`, `parent_id` are **[UI-CODE], UNVERIFIED** |
| `update_section` | `PATCH /sections/{id}` | [API-DOC] name, description (`null` clears description) |
| `move_section` | `POST /sections/{id}/move` | [API-DOC] moves the subtree too. **Body UNVERIFIED** |
| `delete_section` | `DELETE /sections/{id}?cascade=true` | [API-DOC] cascade needed when it has children or live cases. ([UI-CODE] sends `cascade=1`) |
| `get_case` | `GET /cases/{id}` | [API-DOC] current version |
| `get_cases` (paged `&limit&offset`) | `GET /projects/{id}/cases?page=N&per_page=250` | [API-DOC] returns `{data, meta:{page,per_page,total}}`. Filter/search/sort parameter names are **not in the doc — UNVERIFIED** |
| `add_case/{section_id}` | `POST /sections/{id}/cases` | [API-DOC] 201. **Body fields are [UI-CODE]** — see §3 |
| `update_case` | `PATCH /cases/{id}` | [API-DOC] *"writing a new version when its content changes"*; can return **409** (cause not documented — UNVERIFIED) |
| `delete_case` | `DELETE /cases/{id}` | [API-DOC] **soft delete**; `POST /cases/{id}/restore` brings it back (optionally into another section) |
| `move_cases_to_section` | `POST /cases/{id}/move` `{section_id, position?}` | [API-DOC] + [UI-CODE] body |
| `copy_cases_to_section` | `POST /cases/{id}/copy` `{section_id}` | [API-DOC] + [UI-CODE] body |
| bulk updates | `POST /cases/bulk` | [API-DOC] edit / move / soft-delete **up to 1,000 cases, all-or-nothing**. **Body UNVERIFIED** |
| `get_history_for_case` | `GET /cases/{id}/versions` · `GET /cases/{id}/versions/{n}` | [API-DOC] **full content at every version.** This gives Rule 87 (snapshot and diff) a server-side record |
| `get_case_fields` | — | No such endpoint. The case fields are fixed (§3) |
| `add_run` | `POST /projects/{id}/runs` | [API-DOC] `name`* · `selection`* · `milestone_id` · `assigned_to` · `external_key` (idempotency) |
| `update_run` with `case_ids` | `POST /runs/{id}/items` (add) · `DELETE /runs/{id}/items` (remove) | [API-DOC] **Adding is additive.** TestRail's "a partial `case_ids` list deletes tests" trap does not apply. Removing needs `confirm=true` once any item has results |
| `add_result_for_case` | `POST /run-items/{id}/results` · batch `POST /runs/{id}/results` (≤ 500) | [API-DOC] |
| `close_run` | `POST /runs/{id}/close` · `/reopen` | [API-DOC] |
| milestones | `/projects/{id}/milestones`, `/milestones/{id}` | [API-DOC] |
| — | `POST /projects/{id}/imports/testrail` · `/imports/file` · `GET /imports/{id}` | [API-DOC] Pulls from a live TestRail or from export files |

**Run `selection` ([API-DOC] `Selection` schema):** `{"mode":"all"}` · `{"mode":"ids","case_ids":[…≤10,000]}` ·
`{"mode":"filter","section_ids":[…],"priority":[…],"type":[…],"automation_status":[…],"test_layer":[…],"ref":"…"}`.

**Result status ids ([API-DOC], same as TestRail's):** 1 Passed · 2 Blocked · 3 Untested (*"never
recordable"*) · 4 Retest · 5 Failed · 6 Skipped.

## 3 · Case fields — TestRail field → TMS field

Field names: **[UI-CODE]** (the `CaseEditor` payload). Numeric ranges: **[API-DOC]**. Labels: **[UI-CODE]**.
**UNVERIFIED until the first live create is read back.**

| TestRail | TMS | Values |
|---|---|---|
| `title` | `title` (required) | text |
| `template_id` | `template` | 1 Text · 2 Steps |
| `custom_preconds` | `preconditions` | text / null |
| `custom_steps` | `steps` | text / null (Text template) |
| `custom_steps_separated` | `steps_separated` | `[{"content": "…", "expected": "…"}]` / null (Steps template) |
| `custom_expected` | `expected` | text / null |
| `priority_id` | `priority` | 1 Low · 2 Medium · 3 High · 4 Critical |
| `type_id` | `type` | 1 Acceptance · 2 Accessibility · 3 Automated · 4 Compatibility · 5 Destructive · 6 Functional · 7 Other · 8 Performance · 9 Regression · 10 Security · 11 Smoke & Sanity · 12 Usability |
| `refs` | `refs` | text |
| `custom_atmstatus` | `automation_status` | 1 Not Automated · 2 Cannot be automated · **3 Automated** · 4 Pending (**the same values as TestRail**) |
| `custom_automation_type` | `automation_type` | 0 None · 1 E2E · 2 Functional · 3 Unit |
| *(none)* | `test_layer` | 1 Unclassified · 2 E2E · 3 Dev · 4 Manual — **new; which value our manual cases carry is a QA-lead question** |
| *(none)* | `is_deferred` | true/false (UI label *"Deferred"*) — **new; meaning not documented — QA-lead question** |
| `custom_status`, `custom_mission`, `custom_goals`, `custom_ai_type`, `custom_ai_model`, `custom_testrail_bdd_scenario`, … | **no TMS field** | The import screen reports *"Unknown: …"* and *"Discarded: …"* ([UI-CODE]). **Whether any of our data was dropped on import is UNVERIFIED** |

**🛑 Carried-over guard:** `automation_status` **3 = Automated** is the automation owner's own flag
(Rules 65/71). We send **1**. `tms_client.case_payload()` refuses 3, the same way `testrail_add_case.py` did.

**Case editor defaults ([UI-CODE]):** template 1 · priority 2 · type 7 · automation_status 1 ·
automation_type 0 · test_layer 1 · is_deferred false.

## 4 · IDs and links (Rule 8)

- **[API-DOC]** *"ids are TestRail's where they came from (cases, sections, milestones)."* An imported
  case keeps its TestRail number, so **C12345 in TestRail = case 12345 in TMS**. Whether our estate has
  actually been imported, and into which TMS project, is **UNVERIFIED**.
- **[UI-CODE]** The case-id box accepts *"C1943, 1944 C2001"*, so the C-prefix is still the display form.
- **Case link: `https://tms.shopview.com/cases/<id>`** ([UI-CODE] route `cases/:caseId`). Run link:
  `https://tms.shopview.com/runs/<id>`. **UNVERIFIED** that these open directly after Google sign-in.
- How TMS numbers a **new** case (above the highest imported TestRail id, or otherwise) is **UNVERIFIED**.

## 5 · Open questions — first live session, or the QA lead

1. **The key.** Someone signed in with Google issues a key (Settings → API keys) and puts it in `/tmp`.
   Whose name should our writes carry?
2. **Has the TestRail estate been imported?** Which TMS project is ours (the URL used was
   `/projects/1/dashboard`), and does the group/section tree match TestRail's?
3. **Is TestRail now read-only, or retired?** Are we writing to TMS only, or to both during a changeover?
4. **Do the active runs 352 / 357 / 359 move**, and do they keep the same numbers?
5. **Values for the two new fields:** `test_layer` (Manual = 4?) and `is_deferred`.
6. **Dropped custom fields** — `custom_status`, `custom_mission`, `custom_goals`, AI fields: needed or not?
7. **"Foreign" cases (Rule 38)** were identified by TestRail's `created_by = 3`. What is the TMS
   equivalent — the creator on case version 1?
