## B. Environment / location
- **QA-BRANCH SESSION TRAPS live in §A** (the five that produce a false "dead session": expired
  `cf_clearance` mistaken for a dead sign-in · the app host answering 200 on any path · `paste -sd`
  corrupting the cookie header · per-branch session stores returning 409 · `quick-login`/`switch-user`
  rotating the shared token out from under a sibling worker). Read them with the cookie-scope note below.
- **QA-BRANCH HOST NAMING — now proven on three data points (2026-08-04), so never re-derive it:**
  a per-epic QA branch is served at **`sv<epic-number>.qa.shopview.com`**, and its API host follows
  the **`sv<number>api.qa.shopview.com`** shape — **`api` glued on with NO dot**. The three points:
  `sv8582` → Report Suite epic **SV-8582** · `sv8785` → Filters epic **SV-8785** · `sv8685` →
  Schedule epic **SV-8685**. (Same shape as the older per-ticket envs `sv7301api…`, `sv7387api…`.)
  ⚠️ **Only the Report Suite pair is VERIFIED** (`sv8582api.qa.shopview.com` answered live
  2026-08-03). For **`sv8785api`** and **`sv8685api`** the API host is **INFERRED from the pattern
  and NOT YET VERIFIED** — those two branches have deliberately had **zero requests** made to them,
  because the QA lead reserved VIU permission on both until Report Suite is finished. So: given an
  epic number you can predict the hosts, but **state the API host as inferred until it answers.**
- **QA-BRANCH COOKIES — which cookie is shared and which is per-branch (observed 2026-08-04 across
  three branches; values are SECRETS, `/tmp` only, never in repo):** the **`sv_sso_session`** token
  and the **`cf_clearance`** token appear to be **SHARED across branches** (byte-identical for
  `sv8582`, `sv8785` and `sv8685` — single sign-on plus one Cloudflare clearance for the whole
  `.qa.shopview.com` domain), while **`PHPSESSID` is PER-BRANCH** (a different value for each).
  Practical consequence: **you still need a per-branch set**, one file per branch — the convention
  is `/tmp/<project>-viu/cookies.json` (`chmod 600`, dir `chmod 700`), same JSON shape for all, so
  the helper scripts work unchanged. **These cookies live roughly 24 hours** (or until a deployment,
  per §A), and **`/tmp` is ephemeral**, so on any resumed or newly-authorised VIU **ask the QA lead
  for a fresh set** rather than assuming a stored one is still good.
- **Org ID (staging, shared):** `d55bc308-...` (shared across Custom Roles + Simple Flow + F&D staging).
- **🏢 DEFAULT LOCATION = `Staging Heavy Duty - 9919` — CONFIRM IT BEFORE ANY OBSERVATION, ON ALL
  THREE PROJECTS (QA lead's standing convention, 2026-08-11):** *"Make sure to use Staging Heavy Duty
  Location for all projects and change it only / When needed."* Switch away **only** where a case
  genuinely requires it (only two known exceptions: a case needing **several locations in scope**, or
  one pinned to a **specific shop's data**), **say so on the case's own record, and switch back.**
  **Record the location alongside the build marker in every verification deliverable.** **Two real
  near-misses drove this: an endpoint scoped to the ACTIVE WORKPLACE ONLY nearly produced a false
  finding, and a pass that SEEDED a default workplace to escape the `/no-location` bounce then
  observed links its own setup had created — report the bounce, never engineer around it (Rule 14
  permits seeding DATA, not manufacturing the condition under test).** *Full convention + both
  incidents with sources: CLAUDE.md "Durable key facts".*
- **Change active workplace/location (self-unblock — required before reading/writing a WO in a
  non-default workplace, else `work-orders/view/{id}` returns 400/no-data):**
  `POST /api/iam/change-location {workplace_id, workplace_timezone}` → 200. Helper:
  `changeLocation(sessCookie, workplaceId, timezone)` in `staging-admin.mjs`; boot2 accepts
  `{workplaceId}` / env `SV_WORKPLACE`+`SV_TZ`. **On qb, AVOID `change-location`** (suspected
  500-incident trigger; admin default is already Lethbridge = the QB location). *Source: CLAUDE.md.*
- **Workplaces (`GET /api/staff/my-workplaces`):** Heavy Duty 9919 =
  `b3c8c820-f815-4cf1-8938-10956c5ee71a` (America/Edmonton); Lethbridge 4310 =
  `f8a8b802-7780-4b16-bf10-343caeb616b2`; QB Location = `d5366a95-582d-4a06-96e2-20f8cb937866`.
- **qb (SV-7387) env sleep/wake:** env auto-sleeps. Wake:
  `POST https://fz4hhptxi8.execute-api.ca-central-1.amazonaws.com/default/toggleQaEnv
  {"action":"wake","env":"sv7387"}`, then poll API ROOT `https://sv7387api.qa.shopview.com/` until
  200 (~60s; 503 while booting). *Source: FEES & DISCOUNTS appendix below.*

