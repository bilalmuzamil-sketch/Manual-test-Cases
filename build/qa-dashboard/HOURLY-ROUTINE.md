# Making the dashboard update itself every hour

The dashboard is a published Artifact, so it does not poll Jira on its own — something has to
re-run the pull and republish the page. That something is a **Routine**: a scheduled Claude Code
session that runs the refresh and pushes to the same artifact URL.

**A Routine for this already exists — it is just switched off.**
Name: **"QA dashboard auto-refresh — SV project"** · schedule `8 3-15 * * 1-5`
(hourly at :08, 03:00–15:00 UTC = **08:08–20:08 Pakistan time, Mon–Fri**).
`list_triggers` shows it with **no `enabled` flag**, `next_run_at` **2026-07-27** (in the past) and
`last_fired_at` **2026-07-24T15:09Z** — which is exactly why the published page sat on 24 July data
for 13 days.

## Turning it on — two things, both required

1. **Enable it** (`update_trigger` with `enabled: true`, or the Routines screen in the Claude app).
2. **Replace its instructions.** The stored prompt is now wrong in three ways: it pulls
   **project-wide** QA tickets instead of the three epics, it alerts on **Custom Roles (SV-7388)**
   coverage (not in scope any more), and it commits to the **old branch**. Enabling it without
   replacing the prompt would overwrite the three-epic page with a project-wide one.

Paste the block below as the Routine's prompt.

## Schedule options

| Want | cron | Runs/day |
|---|---|---|
| Working hours, weekdays (recommended, current setting) | `8 3-15 * * 1-5` | 13 |
| Working hours, every day | `8 3-15 * * *` | 13 |
| Literally every hour, 24/7 | `8 * * * *` | 24 |

Off-hours runs cost API calls and find almost nothing — Jira activity on these epics is
concentrated in the PKT working day. Avoid `:00`; the fleet is already busy on the hour.

## The Routine prompt (copy verbatim)

```text
Refresh the ShopView QA dashboard (three-epic scope) with current Jira data.

Read build/qa-dashboard/REFRESH-RUNBOOK.md FIRST and follow it exactly — it is the
authoritative method, including the three Jira traps that will otherwise cost you the run.
This is a standalone scheduled run in a fresh session: the repo is cloned and the Atlassian
connector is available.

SCOPE — these three epics ONLY. Nothing outside them appears anywhere on the page:
  SV-8785 Filters · SV-8685 Schedule · SV-8582 Reporting Suite
Include EVERY story, defect, bug and task under them, whether or not a QA member is on it.

Key facts:
- Jira cloudId 19fdd96d-a135-46c4-83e7-d2cc218a4e63, project SV. QA Assignee = customfield_10385.
- QA team: Bilal Muzamil, Ayesha Khan, Mudassir Qamar, Viktoria Videnovic, Nebojsa Glavinic,
  Ahtasham Amjad.
- All dates are Pakistan time (PKT, UTC+5). "today" = the system clock in Asia/Karachi.
- Fixed artifact URL to republish, so the link never changes:
  https://claude.ai/code/artifact/db96d3fa-b068-4044-88d2-bdc5efa52544   (favicon 🧪)
- Branch for commits: claude/dashboard-update-4jbw2p

Steps:
1. Make a workdir. Copy build/qa-dashboard/epic-scope-tools/*.py and
   build/qa-dashboard/finish-dates.json into it, and cd there.
2. python3 fetch.py && python3 transform.py && python3 fetch_details.py <today>
   && python3 build_activity.py <today>
   (Pass <today> to fetch_details.py — without it, it reads all ~300 changelogs instead of
   the few dozen that can actually change the page.)
3. python3 <repo>/build/qa-dashboard/gen_data.py . <today>   → dash-data.json
4. Build the page: inject dash-data.json into build/qa-dashboard/qa-dashboard-template.html,
   replacing the literal "__DATA__".
5. VERIFY BEFORE PUBLISHING — if any check fails, do NOT republish; stop and report:
   - the built file contains no remaining "__DATA__";
   - DATA.tickets is non-empty and DATA.epics is exactly those three keys;
   - the ticket count is within ~20% of the committed build/qa-dashboard/dash-data.json
     (a large drop means a truncated pull, which is the failure mode that has bitten before).
6. Republish the Artifact at the fixed URL above with favicon 🧪.
7. Persist only on the FIRST run of each day: copy the built HTML plus dash-data.json,
   activity.json, finish-dates.json, tickets-unique.json and story-epic-map.json into
   build/qa-dashboard/ and commit/push to the branch above. Later runs the same day republish
   only — no commit, to avoid commit spam.
8. Notify only if a person would care. Compare the fresh dash-data.json against the committed
   one and send a PushNotification (status: proactive) in plain, non-technical words if an
   epic's QA testing coverage % moved, new bugs/defects were filed, or tickets were rejected
   back to dev. Example: "QA dashboard: Schedule coverage 26%→31% · 4 new defects filed ·
   1 rejected back to dev." Otherwise finish silently.

Rules:
- Jira is READ-ONLY. NEVER write to Jira. NEVER write to TestRail (cases, runs or results).
- Only touch files under build/qa-dashboard/.
- Keep the chat reply to ONE short line, e.g. "Dashboard refreshed · <PKT time> · Schedule 31%".
- On a Jira/MCP failure, skip silently — the next hour retries.
```

## What one run costs

A fresh run pulls the three epic trees (~10 search calls) and then reads changelogs only for
issues touched in the last two days plus any ticket in a finished status — **tens of calls on a
normal day, not hundreds** (295 issues existed on 6 Aug 2026; a quiet day needs ~34).
Roughly 1–2 minutes.

## If you would rather not schedule it

Just ask for a refresh in chat. The same runbook runs on demand and takes a couple of minutes.
The page's footer states plainly whether it auto-updates, so nobody reads a stale number as
current — keep that sentence honest if the Routine's status changes.
