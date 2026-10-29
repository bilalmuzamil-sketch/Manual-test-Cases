# Custom Roles tracker — the scheduled update (runbook)

**Update now** on the page: the page's owner starts this task directly. Anyone else with edit access
sends the request to the **"Custom Roles tracker — Update now helper"** session
(`session_01LirJvBZEdKWdGSBQcYebEF`), which watches the page and starts this task. Nobody else watches
the page.

The tracker page must always show the data for the release that is live. A scheduled task runs
this runbook in a fresh session **on release days only: Monday, Tuesday, Thursday and Friday at 18:41
Pakistan time** (releases are usually tagged between 13:20 and 15:20 PKT). The QA lead chose release days
over hourly runs on 29 Oct 2026 to save tokens. The portal's **Update now** button starts it at once (for
the page's owner); anyone else's **Ask for an update** is picked up by the owner or the next scheduled run.

- Page: https://claude.ai/artifact/N7gowXrbJyzoBe94z6dL1E
- Branch: `claude/global-search-v1-baseline-6ax9ul` of `bilalmuzamil-sketch/Manual-test-Cases`
- Product code: `ShopView/shopview` at `/home/user/shopview` (read only)
- Everything happens through **one command**: `build/custom-roles-tracker/tools/auto_update.py`

## Steps

0. **Repositories.** If `/home/user/Manual-test-Cases` is missing, attach `bilalmuzamil-sketch/Manual-test-Cases`
   with `add_repo` (access push) and clone it there. If `/home/user/shopview` is missing, attach
   `ShopView/shopview` (read) and clone it with `--shallow-since=2026-05-01`.
1. **Branch.** `cd /home/user/Manual-test-Cases && git fetch origin claude/global-search-v1-baseline-6ax9ul &&
   git checkout -B claude/global-search-v1-baseline-6ax9ul origin/claude/global-search-v1-baseline-6ax9ul`
2. **What people asked for.** Load the `ArtifactData` tool (ToolSearch `select:ArtifactData`). On the page's URL:
   - `list` collection `scan_requests`. The open ones have `status` `requested` or `started`. Note their ids.
     A request whose `release` is a version tag (not `production`) is a request to check that release.
   - `list` collection `approvals`. Every doc id that starts with `review:` is an approval; the part
     after `review:` is the release to save.
3. **Run the update.**
   `python3 build/custom-roles-tracker/tools/auto_update.py --approved <ids, comma-separated> --approved-by "Approved in the portal" --requested <tags, comma-separated>`
   The last line of its output is JSON: `scanned`, `confirmed`, `skipped`, `problem`, `publish_needed`,
   `previous_page_built_at` and `status`.
4. **Republish, only when `publish_needed` is true.** `Artifact` `read` the page URL first, then
   `Artifact` publish with `url` = the page URL, `file_path` = `build/custom-roles-tracker/portal/dist/index.html`,
   `files` = `{"data.json": "build/custom-roles-tracker/portal/dist/data.json"}` (absolute paths). Leave out
   `capabilities` and `icon` so the page keeps them. When the publish succeeds, run
   `python3 build/custom-roles-tracker/tools/auto_update.py --mark-published`. Then STOP WATCHING the page
   (publishing starts a watch): load `ArtifactComments` and call action `watch` with the page `url` and
   `on: false`. Only the "Update now helper" session may watch the page; otherwise every update session
   would wake up, and cost tokens, each time someone presses Update now. If the publish fails, set
   `status.page_built_at` to `previous_page_built_at` and `status.problem` to
   `"The page could not be republished. Please tell Bilal."`
5. **Tell the page what was found.** `ArtifactData` `set` collection `status`, doc `freshness`, data = `status`.
   Do this on EVERY run, also when nothing changed: it is how the page knows it is up to date.
6. **Close the requests.** For each open `scan_requests` doc: `update` it with `status: "done"`,
   `done_at` (now, ISO) and `result` (one short plain sentence).
7. **Save the work.** If `git status --short -- build/custom-roles-tracker` shows changes: run
   `python3 build/testing-tools/scan_secrets.py --staged` after `git add -- build/custom-roles-tracker`
   (exit 1 = stop), commit with a plain message, and `git push -u origin claude/global-search-v1-baseline-6ax9ul`.
   If the push is refused because the branch moved, `git pull --rebase origin claude/global-search-v1-baseline-6ax9ul`
   and push again.
8. **Reply.** If `scanned` or `confirmed` is not empty, or `problem` is set: one or two plain sentences, for
   example *"Release v26.44.0 is live. It changed 3 things in Custom Roles & Permissions, and its retest
   checklist is on the tracker, waiting for approval."* Otherwise reply exactly `No change.`

## Hard rules

- Touch only `build/custom-roles-tracker/`. Never edit, move or delete anything else.
- Stage path-scoped only: `git add -- build/custom-roles-tracker`. Never `git add -A` or `git add .`.
- Never write to TestRail or Jira. Never post on Slack.
- Never edit a file in `snapshots/` by hand. Snapshots are saved only by `auto_update.py`, and only
  after someone approved them in the portal.
- If `auto_update.py` stops with an error, do not try to fix the code. Write `status` with `problem` set
  to a plain sentence (so the page tells people), and reply with that sentence.
