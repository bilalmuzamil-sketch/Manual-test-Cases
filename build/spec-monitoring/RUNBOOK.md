# Spec Change Monitor — Runbook (hash-based)

**Schedule:** **hourly** at **:07 past every hour** = cron `7 * * * *` UTC. Routine id is recorded in `spec-sync-state.json` note / the Routines UI.

**Purpose:** Detect changes to two Confluence spec pages, and when one changes,
alert Bilal (bilal.muzamil@shopview.com) with a plain-English **before → after**,
say exactly **which test cases** to update and **from what to what**, regenerate
the affected project's **TestRail import (XML + ID-augmented CSV)**, and promote
the new baseline. These specs drive manual test-case maintenance.

**Pages** (authoritative list in `spec-sync-state.json`):

| Key | Page | pageId | Project | PO |
| --- | --- | --- | --- | --- |
| `fees-discounts` | Fees & Discounts V1 | 622297094 | Fees & Discounts | Chris Ward |
| `simple-flow` | Simple Mode — Streamlined WO Completion & Bulk Receiving | 646021121 | Simple Flow | Milos Vasic |

## Procedure — run EVERY scheduled fire, per page

1. **Sync the branch** (this session is a fresh clone):
   `git fetch origin claude/spec-change-monitoring-8w6rvc && git checkout claude/spec-change-monitoring-8w6rvc && git pull origin claude/spec-change-monitoring-8w6rvc`

2. **Fetch the page** (markdown):
   `mcp__Atlassian__getConfluencePage(cloudId="shopview.atlassian.net", pageId=<id>, contentFormat="markdown")`.
   Large bodies persist to a file — extract the body with
   `jq -r '.content.nodes[0].body'` and also capture `.lastModified`.

3. **Compute the hash** the SAME way the baseline was hashed:
   write the body to a temp file exactly as `jq -r '.content.nodes[0].body'`
   produces it, then `sha256sum`. Compare to `pages.<key>.body_sha256` in
   `build/spec-monitoring/spec-sync-state.json`.

4. **If the hash is IDENTICAL → no change.** Do nothing for that page: no diff,
   no commit, no alert. (If BOTH pages are identical, end the turn silently.)

5. **If the hash DIFFERS → the page changed.** For that page:
   a. **Determine what changed.** Read the page's **Change Log** section (the
      authoritative author summary of what/why) AND run `diff -u` of the new body
      vs `baselines/<key>.md`. Ignore encoding-only diff lines (re-encoded glyphs
      like "⋯"/"↳"); report only substantive spec deltas.
   b. **Map to test cases.** For each substantive change, identify the affected
      cases in `build/<project>/cases/*.json` and their TestRail IDs via
      `build/<project>/testrail-id-map.csv`. State BEFORE → AFTER per case.
   c. **Apply case edits** to `build/<project>/cases/*.json` (only where the spec
      genuinely changed; do not clobber cases already matching the new spec), then
      **regenerate the import** with `python3 build/spec-monitoring/gen_testrail_import.py`.
      This refreshes, per project: canonical CSV/XLSX +
      `testrail-import/<project>-v1-testrail-import.xml` (suite XML, `<id>C#####</id>`)
      + `testrail-import/<project>-v1-testrail-import-withIDs.csv` (Case ID + link).
   d. **Write a dated change report** to
      `build/spec-monitoring/history/<YYYY-MM-DD>-<HHMM>-<key>.md` (full before→after
      + affected TestRail IDs).
   e. **Append a one-line dated entry** to `build/spec-monitoring/CHANGELOG.md`.
   f. **Promote the baseline**: overwrite `baselines/<key>.md` with the new body.
   g. **Update `spec-sync-state.json`**: new `body_sha256`, `body_bytes`,
      `page_last_modified`, `latest_changelog_entry`, and top-level `last_synced`.
   h. **Commit & push** to `claude/spec-change-monitoring-8w6rvc`
      (message: `spec-monitor: <key> changed <date>`), with retry/backoff.
   i. **Alert** — send a `PushNotification` (status **proactive**) in plain,
      non-technical words: which spec changed, a one-line summary, how many cases
      changed, and the exact next step ("update N cases in TestRail via update-by-ID
      using the refreshed XML/CSV; M new cases import as new"). Also put the full
      before→after + per-case table in the chat reply.

## Rules
- The **Confluence spec page is the ONLY source** for what a case should assert.
- **Never write to TestRail** (the monitor only reads Confluence + writes this repo
  + regenerates the import files for the user to upload).
- **No secrets** in the repo. Do **not** add internal QA/VIU findings to the specs.
- Only touch files under `build/spec-monitoring/`, `build/<project>/cases/`, and
  `testrail-import/`.
- Baseline/hash promotion happens ONLY after a successful alert, so a failed run is
  re-caught next time.
- Keep alerts plain-English, but keep spec quotes EXACT inside BEFORE/AFTER.
