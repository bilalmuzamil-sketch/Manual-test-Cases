# Automatic Spec Sync — how the bot stays current with Confluence

The bot's knowledge (`knowledge-base.md`, `faq.md`) is derived from the
Confluence spec page **Custom Roles and Permissions** (page 565116952).
Because the spec changes frequently (see its Change Log), a scheduled sync
keeps the derived files current automatically.

## How it works

1. A **daily scheduled Routine** (Claude Code Remote trigger) wakes this
   Claude session every morning.
2. Claude re-fetches the Confluence page via the Atlassian connector and
   compares its content hash against `spec-sync-state.json`.
3. **No change** → nothing happens (no commit, no noise).
4. **Change detected** → Claude:
   - reads the spec's Change Log to identify what changed since the last sync,
   - updates `knowledge-base.md` (and `faq.md` where the change affects an
     answer),
   - appends the change to `KB-CHANGELOG.md` (created on first update),
   - updates `spec-sync-state.json` with the new hash and date,
   - commits and pushes to the `claude/support-bot-critical-feature-f1e8wd`
     branch with a message describing the spec change.

## How updates reach the running bot

This depends on which deployment option (README) you chose:

- **claude.ai Project (Option A):** project knowledge files are uploads, so
  someone must re-upload the changed file(s) after a sync. The sync commit
  message tells you exactly which file(s) changed. (One-minute task; the
  KB-CHANGELOG entry doubles as the "what changed" note for the support team.)
- **Slack (Option B):** same as A — refresh the attached knowledge.
- **API bot (Option C):** fully automatic — build the bot to fetch the two
  knowledge files from the GitHub raw URLs at startup (or per request with a
  short cache). Every sync push then updates the live bot with no human step.

## Operational notes

- The sync only ever touches files under `build/support-bot/`.
- The Routine fires into the existing Claude session; if the session has been
  reclaimed, re-create the Routine from a new session with the prompt below.
- To change the schedule or stop syncing, ask Claude in this session to
  update or delete the Routine (it's listed via `list_triggers`).

### Routine prompt (for reference / re-creation)

> Spec-sync check for the support bot. Fetch Confluence page 565116952
> (cloudId shopview.atlassian.net, markdown format) and compare the body's
> SHA-256 to `body_sha256` in `build/support-bot/spec-sync-state.json`. If
> identical, do nothing and end the turn. If different: identify what changed
> (use the page's Change Log plus a diff against the previous content),
> update `build/support-bot/knowledge-base.md` and `faq.md` accordingly,
> append an entry to `build/support-bot/KB-CHANGELOG.md`, update
> `spec-sync-state.json` (new hash, length, date, latest changelog entry),
> then commit and push to `claude/support-bot-critical-feature-f1e8wd`. Never
> add VIU/internal-QA content to the bot files; the spec page is the only
> source. Do not write to TestRail.
