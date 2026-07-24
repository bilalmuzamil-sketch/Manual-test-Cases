# Custom-Roles / Permission-VIU Process (reusable, cross-project)

> **A repeatable method to run a COMPLETE Custom Roles & Permissions test for a feature/epic —
> live, against its CURRENT spec + all its Done tickets — and deliver a plain-English management
> report.** First proven end-to-end on **Simple Flow SV-8183** (2026-07-23; 11 permission cases,
> 11 roles, 110 role×permission combinations, 0 drift, 4-layer live verification, management report
> in `.md` + `.xlsx`). **Apply to any project WHEN THE USER ASKS** (per Standing Rule 11 always
> confirm which process(es) to run first). Ties to Standing Rules
> **6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 20, 22, 23, 26/26a**.
>
> This process **composes** three sibling methods — reuse them, don't duplicate:
> `build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md` (per-case wording + VIU + TestRail sync),
> `build/PROD-VS-STAGING-COMPARE-METHOD.md` (100%-live-observed, zero-NOT-VERIFIED discipline),
> `build/ATLASSIAN-JIRA-ACCESS-METHOD.md` (read Confluence/Jira live). It **is** the
> permission-testing specialisation of those.

---

## 1. Purpose (plain English)

ShopView gates every feature by a user's **role** (Admin, Service Advisor, Technician, Office, …).
Each role is a set of permission **atoms** (`settingsApp`, `workOrdersCreateAndEdit`,
`woReviewWorkOrders`, `seeFinancialData`, …). For any feature, there is a **permission ticket**
that says exactly which role/atom is allowed to do each action. This process **tests those role
controls on the real build** and produces a management-ready report answering two questions for
every action:

1. **Do the right roles have it, and the wrong roles not?** (composition)
2. **Does the system actually stop the wrong roles — on the screen and in the backend?**
   (front-end route guards + element gates + backend enforcement)

Every verdict is **LIVE-OBSERVED with evidence captured that run** — never inferred from atoms,
role definitions, `fe_permissions`, spec text, or source code (Standing Rules 10/12/13).

## 2. When to use it

- **RECURRING complete verification** of a feature/epic's permissions against the **current spec +
  ALL Done tickets** in the epic (newest-wins on conflict) — run on a cadence, not once.
- A **new permission ticket** lands for any project (each new ShopView project ships its own
  Custom-Roles permission ticket describing what each permission does for that feature) — that
  permission testing routes through this session and this process.
- A **role/permission regression** re-test after a spec change, a Done ticket, or a reported drift.
- Any *"test the roles/permissions live"* request where the deliverable is a **management report**
  (not just corrected case wording — for wording-only use sibling #1).

## 3. Trigger phrases (how to call it)

> *"Run the **Custom-Roles / Permission-VIU** for **[project]**."*
> *"Test the custom roles permissions for **[project]**."*
> *"VIU the permissions for **[project]**."*
> *"Test **[project]**'s permission ticket **[key]** live."*
> *"Do the recurring Custom Roles permission test against the current spec + Done tickets."*

Add specifics if I don't already have them: the permission ticket key, the epic key, the spec
page, the env/branch, the feature-flag state.

## 4. Kickoff / ask-first checklist (do BEFORE any work — Rules 11/22/23/6)

Fill the brackets and confirm every line with the user before proceeding:

1. **Which process(es)?** (Rule 11) — confirm this Custom-Roles/Permission-VIU is the one wanted,
   and whether to ALSO run `SPEC-RELEVANCE-RECONCILIATION` (which cases should exist) or
   `BUILD-ACCURATE-WORDING-VIU` (wording sweep) alongside.
2. **Confluence spec check?** (Rule 23) — the local `requirements.md` can lag. ASK the user whether
   to read the **CURRENT Confluence spec**: via Atlassian MCP `getConfluencePage` when available
   (Custom Roles pageId **565116952**; each project's canonical page in CLAUDE.md), else
   export/paste. Never assume the local copy is current; never silently skip.
3. **Live-build check + access?** (Rule 22) — EVERYTHING substantive here needs observing the LIVE
   build (role composition, backend 403/200, FE route guards, element gates). ASK the user to
   confirm the live check and supply **fresh staging cookies** (in `/tmp` only) + the **env/branch**
   + the **feature-flag/settings state**. If declined, LABEL every affected item "not live-verified
   this run" (Rule 12) — do not substitute inference.
4. **Epic / permission-ticket key?** — ASK for the Epic key + the permission ticket key if unknown;
   never invent (Custom Roles = **SV-7388**; new projects' keys ask-at-VIU).
5. **TestRail write authorization is SEPARATE** (Rule 6) — this process **reads/refines** cases and
   builds a report; it does **NOT** write to TestRail (or any run) without **explicit, fresh
   one-day** authorization. Confirm read-only vs authorized-push up front. Run 325 and any QA run:
   never touched without permission.

## 5. Inputs (enumerate the FULL set — Rule 17)

- **The permission ticket(s)** for the feature (e.g. SV-8183) + **ALL Done tickets in the epic**
  that touch roles/atoms (newest-wins on conflict). Read them live per the Atlassian method or from
  the ingested source-of-truth doc; capture every action→atom row + the per-role matrix + dev
  comments (the SV-8183 dev comment on the BE atom-collapse is load-bearing).
- **The canonical spec permission matrix** — build a **VERBATIM role×permission/atom TRUTH TABLE**
  from the canonical spec document itself (Rule 15), every cell cited to its exact table row, ALL
  change-log entries applied (latest-wins) so no stale column survives. This is the single source of
  truth every verdict is re-derived from. (SV-8183 example: `sv8183/requirements-SV8183_1.md` — the
  17-row action→atom table + the 11-role × 10-permission §9.2 matrix.)
- **The existing test cases + `testrail-id-map.csv`** for the permission area (the C-ids every
  deliverable row must carry, Rule 8) and each case's `refs` (ticket + spec anchor, Rule 20).

## 6. The 4-layer LIVE method (the core — from SV-8183)

Reset first, then observe every layer live per role. **Reset every in-scope role to its
TEMPLATE/DEFAULT before observing** ('Reset To Template') so you test the intended rules, not
drift/over-grants left by prior or parallel sessions on the shared org (**Rule 26**); record each
role's before→after (the diff is itself a finding). If a role **re-drifts mid-run** (a concurrent
actor re-adds atoms on the shared org), **reset it AGAIN and continue — persistently, no small
retry cap** (**Rule 26a**); only record a genuine blocker if reset itself fails or drift recurs so
fast no observation can complete even with immediate re-reset+observe.

**(a) COMPOSITION — does each role hold exactly the right atoms?**
Read each role's LIVE atoms (`GET /api/roles/{id}`) and its template default
(`GET /api/role-templates/{template_id}/fe-permissions`); diff live-vs-template (drift) and
template-vs-spec-matrix (spec conformance). **0 drift + template==spec is the expected pass;** any
difference is a finding, flagged explicitly (never silently accepted, Rule 15). Save the raw diffs
(`role-current-vs-template.json`, `template-vs-spec92.json`).

**(b) BACKEND enforcement — would the system stop the wrong role even off-screen?**
Hit each gated endpoint **AS each role** (via switch-user impersonation of a real holder — see
tooling) with an idempotent/no-side-effect call, record **200 (allowed) vs 403 (denied)**. Note the
**atom-FAMILY nuance**: several WO atoms collapse to one BE check (`ROLE_WORK_ORDER::VIEW +
CREATE_AND_EDIT`), and settings endpoints gate on the whole settings family — so e.g. a clean Parts
Manager gets **200** on `settings/change` while no-settings roles get **403**. That is a documented
design trade-off, **not a bug** (Rule 24: FE-restricted-but-API-possible is flagged, not a defect).
Do NOT force-drive calls that mutate real data (completing/reviewing a real WO) — record the screen
gate live and document the BE-collapse rather than side-effecting. Save `be-*-probe.json`.

**(c) FRONT-END route guards — is the page reachable per role?**
Navigate each gated route **AS each role** (boot2 hydration) and record the final URL: stayed =
ALLOWED, router-redirected (e.g. `->workorders`) = denied. Save `fe-route-probe.jsonl` + a redirect
screenshot. Beware direct-URL timing false-positives (re-confirm with the canonical route).

**(d) ELEMENT-LEVEL controls — is the actual button/field present/enabled/absent?**
Render the real screen **AS each role** and OBSERVE the specific control (Complete/Send-to-Review
cluster, Mark Reviewed enabled/disabled, sell-price field present/absent) with a **screenshot per
role**. Use genuine holder impersonation where a holder exists; render the role's exact live
template atoms (admin session + role fe_permissions) for roles with no live holder; state which
method was used per role. **The element gap must be RE-DRIVEN, never accepted** — unblock any
missing data-state by seeding + the location fix (Rule 14; §9 below), then observe. Save
`element-matrix.json` + `complete-<role>.png` / `markrev-<role>.png` / dialog screenshots.

**Every verdict is VIU-Verified only when the control/behaviour was directly observed live with
evidence THIS RUN** (Rules 10/12/13). Anything not observed is **Blocked / NOT VERIFIED with the
precise reason** (e.g. "Technician role concurrently drifted, clean-baseline negative not
observable this window") — never inferred and passed off as done, never bare "NOT VERIFIED"
(characterise it, Rule 14).

## 7. Traceability = authenticity (Rule 20)

Every case tested/refined must be provably linked to (a) its Jira ticket(s) and (b) its exact spec
anchor, kept in the **metadata layer, never tester-facing fields**. TestRail `refs` = **both
together**, `<TICKET(S)> (<spec-anchor>)` (e.g. `SV-7696 (S1 AC / §8 Permissions)`), mirrored into
`testrail-id-map.csv` + the report's case-results tab. Ticket-only is never acceptable — the spec
anchor must never be dropped. Every change cites its driving ticket (Done/Not-Done) + spec section
in the audit log.

## 8. Deliverable format (mirror 1:1 — Rule 16)

**Canonical worked example (copy its shape exactly):**
`build/simple-flow/sv8183/SimpleFlow_SV-8183_Permission-Test-Report_2026-07-23.md` + `.xlsx`,
generated by `build/simple-flow/sv8183/gen_report_2026-07-23.py`.

The **management report** ships as **BOTH `.md` and `.xlsx`**, human-readable filename (Rule 19):
`<Project>_<TICKET>_Permission-Test-Report_<date>.{md,xlsx}`. Layman-first for non-technical
management AND detailed for engineers (Rule 7 — plain names in the reader-facing text; atom keys /
§-refs / HTTP terms only in labelled engineer columns). **Seven tabs/sections:**

1. **Executive Summary** — plain English: what this is, what "testing permissions" means, how we
   made it fair (reset-to-template), the headline result (N permissions × M roles = K combinations,
   X cases, pass/fail/blocked), and a one-line **Verdict**.
2. **How We Tested** — the 4 layers in plain terms (composition / backend / front-end route /
   element), "observed live with screenshots, nothing assumed".
3. **Permission-by-Permission** — one row per gated action: plain name · what it lets a user do ·
   atom key · spec requirement · roles that SHOULD/should NOT have it · what we observed live ·
   Result · Evidence · related test case (**with C-id + TestRail link**).
4. **Role × Permission Matrix** — all roles × all core permissions (Yes/No), spec-expected vs
   observed, with the reset-first note.
5. **Test Case Results** — one row per formal case: internal ID · **TestRail C-id · TestRail link**
   (`https://shopview.testrail.io/index.php?/cases/view/<id>`) · what it checks (plain) · verdict ·
   how verified · evidence (Rule 8 — every case row carries C-id + link).
6. **Findings & clarifications** — design points (e.g. BE atom-family, screen-is-the-gate,
   reviewer≠completer not-yet-built) stated as **flags, not bugs** where FE-gated/API-possible
   (Rule 24); each deviation cites the spec/ticket reference **and the verbatim wording** it
   deviates from (Rule 25).
7. **Scorecard** (at-a-glance) — feature/story, date, env, core permissions tested, roles, combos
   checked vs spec (+ drift count), cases, passed/failed/blocked, overall verdict.

Keep the same column headers/order, tab structure, and evidence-folder pointer as the canonical
example. Point the report's footer at the evidence folder + the spec + the TestRail change log.

## 9. Self-seed to unblock — never stay blocked on data (Rule 14)

Never leave a cell NOT-VERIFIED for a missing data-state — seed it and observe. Playbook:
- **Role-testing on staging:** to test an arbitrary role live, either (i) `POST /api/switch-user
  {user_id}` to **IMPERSONATE an existing holder** (user_id = staff `id` from `GET
  /api/staff?limit=200`, which lists `role_label` per staff; end with a fresh admin `login()`), or
  (ii) `POST /api/iam/create {email, firstName, lastName, roleId, departments, workplaceId}` a fresh
  staff then self-login — but on staging a fresh staff needs invite-confirmation, so **PREFER
  switch-user impersonation**. For a role with **no live holder**, render its exact live template
  atoms (admin backend session + role fe_permissions via boot2) and label it "render" (composition
  still confirmed against spec).
- **NEVER role-swap Tech mid-session** (causes the `/no-location` SPA bounce = technique artifact,
  not a permission result). Use the location fix: `POST /api/iam/change-location {workplace_id,
  workplace_timezone}` and open a WO in the session's own location.
- **Seed any state you need** (WOs/lines/parts/adjustments/customer-defaults, a review-ready WO,
  etc.); discover endpoints by probing validation errors; switch UI↔API when either is flaky; for
  Quasar UI click by element-center coordinate (`page.mouse.click`). Reset roles to template first
  (Rule 26) and re-reset on drift (Rule 26a).
- **Clean up** (delete ZZAUTOTEST data, restore roles to template) after. Only a genuinely
  un-provisionable dependency (server 500 on create, external device, email-invite-gated staff with
  no impersonable holder) is a real blocker — **fully characterised with evidence** (endpoint +
  requestId + why), never bare "NOT VERIFIED"; then hand the user a layman data-setup sheet (Rule 7)
  for the one thing only a human/dev can supply.

## 10. Guardrails

- **NEVER write to TestRail** (create/update/delete cases, sections, runs, or results) **without
  explicit, fresh user authorization** (Rule 6). This process is read/refine + report by default.
- **NEVER write run 325 or ANY QA run** (results, status) without explicit permission — those runs
  are QA's, not ours.
- **Secrets in `/tmp` only** (cookies/tokens/TestRail creds), `chmod 600`, never committed —
  grep the staged diff for secrets before every commit.
- **Adversarial self-audit before delivery** (Rule 15): re-derive every role×permission verdict from
  the verbatim truth table independently and diff against what the report says; ship only when the
  diff is empty. For release-critical work audit the full population, not a sample.
- **Complete coverage** (Rule 17): all roles × all permissions × all cases — no "top N", no silent
  caps; state total in scope / verified / blocked-with-reason in the completion report.
- **Observed, not inferred** (Rules 10/12/13): a green cell means a screenshot/API-response captured
  THIS run. If access is lost mid-run, STOP and say what could not be verified — do not backfill
  with inference.

## 11. Originating instructions + corrections behind this process (Rule 18)

Captured from the full history that produced the SV-8183 pass and the standing rules it enforces —
apply these by default:

- **The trust rule (observed-not-inferred).** Born from the **2026-07-14** prod-vs-staging incident:
  a permission comparison presented FE-gated capabilities as results when they were **inferred from
  role definitions/code** and the session had expired mid-run — this broke user trust. Permissions
  are **only** verified by logging in / driving the UI AS the role and OBSERVING the control, per
  role, per environment, with evidence that run (Rules 10/12/13).
- **Zero-NOT-VERIFIED / seed-don't-block.** "There is nothing like 'require seeding data' — you can
  make everything in the build; do not find an excuse to keep yourself blocked." Seed the state,
  impersonate a holder, render template atoms — never fall back to NOT-VERIFIED (Rule 14).
- **Reset-to-template first + persistent re-reset on drift.** On the SHARED org, roles drift from
  prior/parallel testing; reset every in-scope role to template before observing (the before→after
  diff is a finding), and if a role re-drifts mid-run reset it AGAIN and continue — persistently
  (Rules 26/26a). Leave roles at template afterwards (benefits every session).
- **The element gap must be RE-DRIVEN, not accepted.** An earlier pass carried element-level
  verdicts from prior runs; the user required the actual control re-observed live against a
  verified-clean baseline (the 2026-07-23 element re-observe closed exactly this gap).
- **Layman management-report requirement.** The deliverable is a report a non-technical manager
  reads — plain English first, atoms/§-refs/HTTP only in labelled engineer columns (Rule 7); every
  case row carries its TestRail C-id + link (Rule 8); human-readable filename (Rule 19).
- **Verbatim truth table + adversarial audit.** Never judge from a prose summary — build the
  role×atom table from the canonical spec, latest-wins on change-log, and diff-audit before delivery
  (Rule 15). A deviation call cites the spec/ticket reference AND the verbatim wording (Rule 25);
  FE-restricted-but-API-possible is a flag, not a bug (Rule 24).

## 12. Reusable tooling

- **Staging admin/role helper:** `build/testing-tools/staging-admin.mjs` — login, `changeLocation()`,
  role read/reset, WO/adjustment seeding (see CLAUDE.md durable facts for endpoints).
- **UI harness (boot2 + TLS-terminating MITM):** per `viu-sv8183-2026-07-23/HARNESS-NOTES.md` —
  a fresh local MITM bridge per run (Chromium's TLS is blocked by the egress proxy; undici passes),
  boot2 localStorage hydration (`user` + `fe_permissions_wrapper` + `organization_features`), the
  location-desync fix.
- **Role atom read/reset:** `GET /api/organizations/{org}/roles`, `GET /api/roles/{id}`,
  `GET /api/role-templates/{template_id}/fe-permissions`, 'Reset To Template' in the UI.
- **Switch-user impersonation:** `POST /api/switch-user {user_id}` (user_id from `GET
  /api/staff?limit=200`), end with a fresh admin `login()`.
- **Report generator:** clone `build/simple-flow/sv8183/gen_report_2026-07-23.py` — parameterise the
  ROLES list, the verbatim SPEC matrix, the action→atom rows, the per-case C-ids; it emits the
  7-tab `.md` + `.xlsx` in the canonical shape. Keep the id-map C-ids/links (Rule 8).
- **Evidence layout:** `build/<project>/viu-<ticket>-<date>/` (role-current-vs-template.json,
  template-vs-spec.json, be-*-probe.json, fe-route-probe.jsonl, element-matrix.json, screenshots/)
  + `build/<project>/<ticket>/` for the report + `testrail-sync-manifest.md` +
  `testrail-execution-log-<date>.md` (if a push is authorized).

## 13. How to resume / step list

1. **Kickoff/ask-first** (§4): confirm process(es), Confluence-spec check, live-build check + fresh
   cookies + env/flags, Epic/ticket key, TestRail authorization (separate).
2. **Ingest inputs** (§5): read the permission ticket + all Done epic tickets (live, newest-wins);
   build the **verbatim role×atom truth table** from the canonical spec; load the cases + id-map.
3. **Reset roles to template** (Rule 26); capture before→after; re-reset on drift (Rule 26a).
4. **Layer (a) composition:** live atoms vs template vs spec; save diffs; flag any drift/deviation.
5. **Layer (b) backend:** per-role 403/200 on gated endpoints (no side-effects); note atom-family.
6. **Layer (c) front-end routes:** per-role allowed/redirected; screenshots.
7. **Layer (d) element controls:** per-role button/field present/enabled/absent; screenshots;
   seed/impersonate/render to unblock (§9); re-drive the element gap.
8. **Set per-case verdicts** (VIU-Verified only if observed live; else Blocked-with-reason);
   update `viu_status`/evidence/`fresh_run`; keep `refs` = ticket + spec (Rule 20).
9. **Adversarial self-audit** (Rule 15): re-derive all verdicts from the truth table, diff, fix.
10. **Generate the 7-tab management report** (`.md` + `.xlsx`) from the parameterised generator
    (§8/§12); every case row carries C-id + link.
11. **TestRail sync ONLY if authorized** — via the sibling wording process (`update_case`,
    GET→diff→update→200/re-GET-MATCH), a `testrail-sync-manifest.md` + dated execution log; else
    state explicitly "no TestRail write (not authorized)".
12. **Commit by explicit pathspec**; report counts (total in scope / verified / blocked-with-reason)
    + the deliverable paths + the TestRail status explicitly.

## 14. One-page checklist

1. Ask-first: which process(es) · Confluence-spec check · live-build + fresh cookies + env/flags ·
   Epic/ticket key · TestRail auth (separate). (Rules 11/22/23/6)
2. Verbatim role×atom truth table from the canonical spec (latest-wins, Rule 15). Load cases +
   id-map (C-ids, Rule 8).
3. Reset all in-scope roles to template; record before→after; re-reset on drift. (Rules 26/26a)
4. Observe LIVE all 4 layers per role — composition / backend 403-200 / FE route / element control —
   with evidence that run; seed/impersonate/render to unblock; never infer. (Rules 10/12/13/14)
5. Verdicts: VIU-Verified only if observed live, else Blocked-with-reason (characterised). refs =
   ticket + spec (Rule 20).
6. Adversarial self-audit vs the truth table; ship only when the diff is empty. (Rule 15)
7. Deliver the 7-tab management report (`.md` + `.xlsx`), layman + detailed, C-id + link per case,
   human-readable filename. (Rules 7/8/16/19)
8. No TestRail/run write without explicit auth; secrets in `/tmp`; grep diff for secrets; state the
   TestRail status explicitly. (Rule 6)
