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

**Keyed READS were made on 2026-10-26 — see §6, which overrides any UNVERIFIED below that it
covers. No WRITE has been made yet**, so request-body shapes are still UNVERIFIED.

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

## 6 · [LIVE] Confirmed with a key — 2026-10-26, READ-ONLY (no writes made)

Key holder: the QA lead's own key (TMS user **id 4**, role `user`). Stored only at `/tmp/tms/creds.json`.

- **Project:** `GET /projects` returns one project — **id 1 "ShopView"**, with **7,324 cases** (`meta.total`).
- **The TestRail estate IS imported, and ids ARE preserved.** The section tree (871 sections) carries
  TestRail's section numbers: **4110 = "Filters - (2026)"**, **3527 = "Custom Roles - (Revised)"**,
  **6769 / 6721** = the Global Search V2 sections. Group **4094** (Global Search) was **not** found as an id.
- **Case fields read back (C43841)** — exactly the §3 names: `title, template, preconditions, steps,
  steps_separated, expected, priority, type, refs, automation_status, automation_type, test_layer,
  is_deferred`, plus server fields `id, project_id, section_id, display_order, version_no, created_by,
  updated_by, created_at, updated_at, deleted_at`. **§3 field names are therefore [LIVE] for reads**;
  that the same names are accepted on create/patch is still to be confirmed by the first write.
- **Text is stored as HTML** (`<p>…<br />`, `&#039;`) — the same rendered-text comparison rule as
  TestRail applies (compare tags-stripped, entities-decoded, whitespace-collapsed).
- **`refs` came through the import re-split on spaces** (C43841: map `SV-9271 (S6a-R1; S6a-R2; S1-R6) [spec v21 2026-08-14]`
  → TMS `SV-9271, (S6a-R1;, S6a-R2;, S1-R6), [spec, v21, 2026-08-14]`). **Finding — ask before "fixing" (Rule 41/113 scope).**
- **Ours vs foreign:** imported cases written by us carry **`created_by: 4`** (our user). Candidate answer to §5 Q7 — confirm with the QA lead.
- **Cases created natively in TMS get high ids** — `sort=-id` (works; `sort=id` ascending) shows **724220** etc.,
  created **2026-10-23** by user 4 in section **84270**. **Some session is already writing to TMS** — find out which before writing (Rule 83 lane ownership).
- **Spot-check of our id-maps (3 cases per map: first, middle, last — a gate check, NOT a full reconciliation):**

| id-map | Result |
|---|---|
| filters · inline-add-edit-parts · printer-friendly-wo · report-suite · schedule | 3/3 present, title identical |
| invoice-ui-refresh | 2/3 identical; C53480 title differs |
| global-search | 3/3 present, **all 3 titles differ** from our id-map (e.g. C45140 now starts "SV-9167 Obsoleted - …") |
| simple-flow-v2 | C44549 / C44609 present but titles differ; **C44579 → 404** |
| digital-inspections-v2 | **all 3 → 404** (C44506, C44527, C44548) |
| fees-discounts · invoice-design-selection · simple-flow | id-map has no C-ids to check |

  **Not yet explained:** whether the 404s / title differences come from the import, from later TestRail edits
  our id-maps never picked up, or from deletions. **TestRail could not be read this session (no TestRail
  credentials present), so the cause is UNVERIFIED** — a full scripted reconciliation per project is the next step.

## 7 · [LIVE] TestRail group 91454 "Credit Terms" vs TMS — compared 2026-10-27 (read-only, every case)

- **Same folder, same ids.** TestRail 91454 = TMS 91454 (*Founder Mode (September 2026) > Credit Terms*), 15 sections both sides.
- **All 332 TestRail cases exist in TMS** (same ids C723865–C724209). **TMS also holds 12 cases TestRail does not**
  (C723891, C723892, C723935, C723963, C723964, C723994, C723998, C724023, C724025, C724125, C724126, C724185) —
  TestRail answers `400 "not a valid test case"` for each, i.e. they no longer exist there.
- **🔴 TMS holds STALE text for all 332.** Every case in TMS is still version 1, timestamped
  2026-10-23 03:34–06:39 UTC (TestRail's creation times). **All 332 were then edited in TestRail on
  2026-10-26 17:07–17:35 UTC** (by our TestRail user, id 3), and **none of those edits reached TMS**:
  preconditions differ on 332, expected on 332, steps on 224. Example: TMS still has the
  *"Setup file (for Claude sessions…)"* block and `{Location-A}` / `{Term-A}` placeholders in all 332;
  TestRail has neither.
- **⇒ The import is a ONE-TIME SNAPSHOT, not a sync.** Any TestRail write after the import date is
  missing from TMS until it is re-imported or re-written there.
- **🛑 TRAP — `GET /projects/{id}/cases` (the list) does NOT return case text:** `preconditions`,
  `steps` and `expected` come back `null` in the list. Read text only with `GET /cases/{id}`. A compare
  built on the list reports every case as blank (this one did, and was caught on re-check — Rule 110).
- **`GET /projects/{id}/cases?section_id=N` works** as a filter (one section, no subsections).
- `refs` differ only by spaces after commas (`SV-11670,SV-11680` vs `SV-11670, SV-11680`).

## 8 · [LIVE] Milestone 5 and its runs — synced TestRail → TMS 2026-10-27

- **Milestone ids are preserved by the import**: TestRail milestone 5 = TMS milestone 5 (*"Next Release -
  More Test Runs To Be Added (Oct 2026)"*). TMS description was missing *"on the QA lead's order: the next
  milestone;"* — the only phrase containing an apostrophe (possible import defect, seen once). Synced from TestRail.
- **Run ids are NOT preserved** — TMS numbers runs 1, 2, 3… **Run map (TestRail → TMS):**

| TestRail run | TMS run | Cases | Note |
|---|---|---|---|
| 547 Splitting Sales Representatives - Execution | **6** | 176/176 | created 2026-10-27, `external_key` `testrail-run-547` |
| 549 A/R and A/P Report Sorting, Export and Location Filter - Execution | **7** | 349/356 | **7 cases not in TMS** (C797940–C797946) — add once those cases exist |
| 551 Credit terms - Execution | **8** | 323/323 | created 2026-10-27 |
| 552 Maintenance reminder (Chunk1 and 2) | **4** "Mantenence Reminders" | 299/299 same set | pre-existing TMS-native run; **TMS holds results (38 P / 34 F / 2 B) that TestRail does not** |

- Runs are created with `external_key = testrail-run-<id>` so a re-run returns the existing run (idempotent, [API-DOC]).
- TestRail user 3 = TMS user 4 (same email).
- Text the API stores is HTML-entity-encoded (`'` → `&#039;`); compare rendered text.

## 9 · Decisions executed 2026-10-27 (QA lead: "1. Delete · 2. Option A · 3. Yes")

- **Deleted (soft) 23 TMS-only cases** in Splitting Sales Representatives (5), A/R and A/P (6), Credit Terms (12).
  Each was only in the nightly runs 1/2/3/5, Untested, no results. Restorable with `POST /cases/{id}/restore`.
- **Created 7 TestRail-only A/R and A/P cases in TMS** (C797940–C797946 → **TMS C10000000–C10000006**),
  read back identical, and added to TMS run 7 (now 356 = TestRail run 549).
  **TMS-native case numbers start at 10,000,000.** Mapping kept in `build/tms/tr-tms-case-map.csv`; `tms_sync.py` reads it.
- **First TMS → TestRail sync: 74 results** from TMS run 4 (recorded by **Nebojsa Glavinic**, TMS user 3)
  copied to TestRail run 552 with `add_results_for_cases`. Run 552 now reads 38 Passed · 34 Failed · 2 Blocked ·
  225 Untested — identical to TMS run 4, every case checked. TestRail shows the API-key owner (Bilal) as author,
  so each comment names the real tester and TMS timestamp. **This overrides, by the QA lead's explicit
  instruction, the older playbook §J line "Log ONLY Passed cases to a run"** — that line is TestRail-era
  guidance and should be reviewed under the TMS changeover (Rule 72 proposal pending).

## 10 · 2026-10-28 — What/Why (20437), Part Lifecycle (20439), and the What/Why run

- **What/Why:** 37 cases updated TestRail → TMS, re-check 37/37 SAME. **Waiting on the QA lead:** 31 TestRail-only
  cases, 17 of them in the TestRail-only folder **105855 "Design — how it looks"**.
- **Part Lifecycle:** 267 updates (running at time of writing). **Waiting:** 96 TestRail-only cases, 49 in the
  TestRail-only folder **105854 "Design — how it looks"**; **19 TMS-only cases** (each checked with `get_case`:
  none exists anywhere in TestRail) and the **TMS-only folder 54275 "Retire OR retest"** (12 of the 19).
- **Run: TMS run 10 "What/Why - Execution"** in milestone 5, 37 items (the 31 TestRail-only cases join once created).
  **Not yet assigned:** TMS answered `422 "User 6 can't be assigned: only active, real users can."`
- **🛑 TRAP — imported people are PLACEHOLDERS until they sign in.** TMS created users from TestRail history
  (`is_placeholder: true`, `is_active: false`) — e.g. **Mudassir Qamar = TMS user 6** (TestRail user 6).
  A placeholder **cannot be assigned** a run or run item. Fix: the person signs in to TMS once with Google,
  then a TMS **admin** merges the placeholder into the real account (`POST /users/{id}/merge`, admins only —
  our key's user is role `user`). Only then assign.
- **No What/Why run exists in TestRail.** Creating one there was NOT done — it was outside the instruction
  (TMS), and the write was stopped by the session's permission guard. Asked the QA lead.
- **tms_sync.py** now walks **both** folder trees (a folder missing on either side is reported, never skipped).
