# Spec-Recheck Process (reusable, any project/feature)

> **Plain-English purpose:** make sure a feature's TestRail test cases still match (a) the
> CURRENT spec and (b) the FINISHED Jira tickets — then hand the user a **simple list of only
> the cases that need a change or a decision**, each tagged with the driving ticket, and (only
> after the user approves) apply the agreed edits in TestRail.
>
> This is the method proven on **Custom Roles (SV-7388), 2026-07-20** ("Vlad's spec-recheck").
> Apply it to any project **WHEN THE USER ASKS**. It combines the two existing process docs
> (`BUILD-ACCURATE-WORDING-VIU-PROCESS.md` + `SPEC-RELEVANCE-RECONCILIATION-PROCESS.md`) with
> Jira-ticket ingestion and a simple change-list deliverable.

## When the user asks for it
Trigger phrases: "spec-recheck", "re-check the cases against the spec/tickets", "the nightly is
failing because cases don't match the build", "reconcile <feature> test cases".

## Kickoff prompt (reusable — fill the brackets)
> "Run the spec-recheck for **[project/feature]**: read the current Confluence spec + all Done
> Jira tickets under **[epic key]** (with comments; on any conflict, newest wins), compare every
> TestRail case in scope, and give me a **simple change list** — only the cases that need a
> change or a decision, each with the driving **ticket number** and whether that ticket is Done.
> **Live-verify** labels/behaviour on the build before proposing. **Don't touch TestRail until I
> approve**, then change only the cases I clear."

## The 6 steps
1. **Confirm inputs are complete** (Standing Rule 1). Get: current spec (Confluence pageId), the
   epic key, TestRail project/suite + section scope, and the local case source. If anything is
   missing, STOP and ask.
2. **Ingest the truth.** Pull the current spec and EVERY Done/Obsolete ticket under the epic
   **with full comments** (Atlassian MCP). Build a ticket→behaviour map. **Contradiction rule =
   last-update-wins** (newest timestamp wins, whether spec-vs-spec, comment-vs-comment, or
   comment-vs-spec).
3. **Reconcile every case** against spec + rulings → one verdict each: **OK** (fine) /
   **UPDATE** (wording/expected drifted; propose the fix + cite the ticket/spec) /
   **OPEN-QUESTION** (spec silent or self-contradictory, or a PO/dev decision missing — flag,
   don't guess). Cover 100% of cases (Standing Rule 17).
4. **Live-verify on the build** (Standing Rules 12/13): observe the real labels/behaviour/role
   sets in staging BEFORE proposing — never infer from spec/source. This catches "spec is ahead
   of the build" (keep the case build-accurate + flag the gap) and role drift on shared orgs.
5. **Deliver the SIMPLE change list** (this is what the user wants first): one row per changed
   case — Case ID + TestRail link, Area, plain "what needs to change", **driving ticket +
   whether it's Done**, and Action (Apply update / Decision). Add a second tab highlighting cases
   **waiting on a NOT-DONE ticket** (they must not be finalised until the ticket ships).
   Omit the 240 "OK" cases from the change list (mention the count only).
6. **Apply only after explicit go-ahead** (Standing Rule 6 — never write TestRail without
   permission). For each approved case: `get_case` → `update_case` (only the changed fields) →
   `get_case` again to verify the save → per-case **audit log** (before→after + citation). Honor
   any "do not change" freeze list exactly. Never commit TestRail creds or cookies (— /tmp only).

## Deliverable format (keep it simple — Standing Rule 16)
- File: `CustomRoles_SpecRecheck_ChangeList_<date>.xlsx` (+ `.md`), tabs: **Change list** +
  **Waiting on open tickets**. Columns: Case ID | TestRail link | Area | What needs to change |
  Driving ticket | Ticket status (DONE / NOT DONE(state) / OBSOLETE / none) | Action.
- A fuller proposed-corrections workbook (current→proposed text + citation + live-check) is
  optional backup; the simple change list is the primary sign-off view.

## Reusable tooling (already in the repo)
- Staging login / live UI: `build/testing-tools/staging-boot2.mjs` (+ `staging-admin.mjs`,
  `staging-api.mjs`, `staging-bridge.mjs`) — boot2 hydration; read `$HTTPS_PROXY` live.
- TestRail read/write: `build/testing-tools/testrail-api.mjs` — `getCase`, and `api('update_case/<id>',
  {method:'POST',body})` for edits. Creds in `/tmp/testrail/creds.json` (never committed).
- Both need fresh secrets in `/tmp` each session (staging cookies incl. cf_clearance; TestRail
  email + API key/password) — the user supplies these per run.

## Guardrails (the ones that mattered)
- **Traceability = authenticity (Standing Rule 20).** Every case must trace to (a) its Jira
  ticket(s) and (b) its spec section — kept in the metadata layer (TestRail `refs` field +
  id-map + findings `citation`/audit log), NOT in the tester-facing wording. Every change in
  the change-list cites the driving ticket (with Done/Not-Done status) + spec section. A case
  with no ticket AND no spec anchor is flagged missing-traceability, never left unsourced.
- **Never touch TestRail without explicit per-run permission**; honor the freeze list literally.
- **Observe, don't infer** — a proposed change that the live build contradicts gets withdrawn
  (e.g. a spec label rename the build hasn't shipped → keep the case build-accurate, flag the gap).
- **Cite the ticket** on every ticket-driven change; if the ticket isn't Done, mark the case as
  "waiting" and don't finalise it.
- **No secrets in git** — cookies/passwords live only under `/tmp`.
