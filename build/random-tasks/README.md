# Random Tasks — Project Memory

Ad-hoc tickets the user hands over to test on the relevant environment. This is a
catch-all project for one-off requests (bug re-tests, quick verifications, small
investigations) that don't belong to the three standing projects (Custom Roles,
Fees & Discounts, Simple Flow).

## How this project works

- **One file per ticket.** Each ticket the user hands over gets its own findings
  file named after the ticket ID, e.g. `SV-8182.md`. That file captures the
  fetched ticket detail (or a blocked-fetch placeholder), the test plan, the
  live-verification findings, and the fixed / not-fixed verdict.
- **Separate memory (standing rule 3).** Keep this project's facts, scope, and
  findings under `build/random-tasks/` only. Do **not** mix them into the other
  projects' memory. Cross-USE shared knowledge freely, but don't cross-CONTAMINATE
  memory.
- **Reuse the shared harness + access knowledge.** Staging/QA access, the MITM
  bridge / boot2 hydration pattern, quick-login SSO, TestRail API patterns, and
  the self-service test-data/role-switch recipes are common infrastructure — reuse
  them from the other projects rather than re-deriving:
  - Staging topology + auth: `CLAUDE.md` "Durable key facts" + `build/TESTING-RUNBOOK.md`
  - App action recipes: `build/APP-ACTIONS-PLAYBOOK.md`
  - QA env auth/harness examples: `build/simple-flow/*`, `build/fees-discounts/viu-recon.md`

## Standing rules that apply here

All CLAUDE.md STANDING RULES apply, notably:
- **Never proceed without the complete set of info** — if the ticket detail is
  missing, STOP and ask the user to paste it before testing.
- **Everything except TestRail is a disposable TEST account** — act freely on
  staging/QA/integrations; tag throwaway data `ZZAUTOTEST`; restore any
  role/setting you change; **NEVER write to TestRail without explicit permission.**
- **No secrets in this repo — ever.** Cookies/tokens live in `/tmp` only.

## Ticket index

| Ticket | Type | Env | Status | File |
|--------|------|-----|--------|------|
| SV-8182 | Bug re-test | staging (app.staging.shopview.com) | ✅ FIXED — approval-request no longer 500s; send-to-portal verified end-to-end (2026-07-09) | `SV-8182.md` |
| SV-7388 (role-API cascade; bug key TBD) | Backend bug re-verify | staging (api.staging.shopview.com) | ✅ FIXED-by-cascade — role create (`POST /api/roles`) + update (`PUT /api/roles/{id}`) now auto-add parent perms server-side; invalid bundles no longer persisted verbatim. E2E guards C26569–C26573 assert 400/reject so stay red — realign to cascade (2026-07-09) | `customroles-role-api-cascade.md` |
