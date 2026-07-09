# ShopView Support Bot — Custom Roles and Permissions Release

A Claude-powered assistant for the support team, built for the **Custom Roles
and Permissions** release (Epic SV-7388). It is grounded in the official
Confluence specification so it answers accurately instead of guessing.

**Source of truth:** [Custom Roles and Permissions spec](https://shopview.atlassian.net/wiki/spaces/PM/pages/565116952/Custom+Roles+and+Permissions)
(snapshot taken 2026-07-09). When the spec changes, refresh
`knowledge-base.md` and `faq.md` from the page and re-upload.

---

## What's in this folder

| File | What it is | Where it goes |
| --- | --- | --- |
| `system-prompt.md` | The bot's instructions: its job, answer rules, escalation rules, response format | Paste into the Project's **custom instructions** (or the API `system` prompt) |
| `knowledge-base.md` | The full feature reference distilled from the spec, written for support use | Upload as **project knowledge** (or embed/RAG for an API bot) |
| `faq.md` | ~35 ready answers to the customer questions this release will actually generate (migration is the hotspot) | Upload as **project knowledge** alongside the KB |
| `SYNC.md` | How the automatic spec-sync works (daily Confluence check → auto-update + push) | Reference doc |
| `spec-sync-state.json` | Which spec version the current knowledge was built from (content hash + date) | Managed by the sync — don't edit by hand |

## Recommended rollout (important for a critical feature)

Run the bot as an **internal co-pilot first**: support agents ask it questions
and it drafts replies, but a human reviews every answer before it reaches a
customer. The system prompt is already written for this mode. After 1–2 weeks
of real tickets, review its accuracy and decide whether any part can go
customer-facing.

## Option A — claude.ai Project (no code, ~10 minutes)

1. In claude.ai (Team/Enterprise), create a new **Project**, e.g.
   "Support: Custom Roles Release".
2. Open the Project's **Instructions** and paste the full contents of
   `system-prompt.md`.
3. In **Project knowledge**, upload `knowledge-base.md` and `faq.md`.
4. Invite the support team to the Project.
5. Each agent workflow: paste the customer's question (or ticket text) →
   the bot drafts a reply + confidence + escalation flag → agent reviews,
   edits, and sends.

## Option B — Claude in Slack

If the team lives in Slack, install Claude for Slack and pin a support channel.
Use the same two knowledge files; put `system-prompt.md` content into the
channel/agent instructions. Agents @-mention the bot with the customer
question.

## Option C — Custom bot via the Claude API / Agent SDK (code)

For helpdesk integration (Zendesk/Intercom), build a small service that sends
the ticket text plus the two knowledge files to the API with
`system-prompt.md` as the system prompt. The knowledge here (~8k words) fits
comfortably in the context window — no vector database needed; just include
both files in every request and use prompt caching. Ask Claude Code to build
this when you're ready.

## Keeping it current — automatic spec sync

A scheduled Routine checks the Confluence page **daily at 06:00 UTC**; when
the spec changed, it updates `knowledge-base.md`/`faq.md`, logs the change in
`KB-CHANGELOG.md`, and pushes to this branch automatically. Full details and
the per-deployment update path in `SYNC.md`. Remaining manual step for a
claude.ai Project: re-upload the changed file(s) to project knowledge (the
sync commit tells you which).

Other notes:
- When support finds a real product bug, do NOT teach the bot to explain it
  away — log the bug, and add a short "Known issues" note to the KB only if
  support needs a holding statement.
- Open Question #11 in the spec ("Reset to Template") is still unanswered —
  the bot is instructed to escalate anything about resetting a role to its
  template.
