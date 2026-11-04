# Custom Roles tracker — updating it by hand (runbook)

**Update now button (since 3 Nov 2026):** the QA lead presses **Update now** on the page. It starts the
task **"Custom Roles tracker — Update now (manual)"** (`trig_01AuzwtpLUeUTjsjUEUZStv9`, trigger: API only, no schedule; created by the QA lead in claude.ai → Scheduled tasks on 4 Nov 2026), which runs
this runbook in a fresh session. The routine has both repositories attached in its settings (set by the
QA lead in claude.ai → Routines), so nothing needs approving at run time. Only the page's owner can start
it; everyone else sees "please tell Bilal".

**The tracker is updated BY HAND after each release.** The QA lead chose this on 3 Nov 2026 and asked for
all automation to stop. The keyword is:

> **UPDATE THE CUSTOM ROLES TRACKER**

When the QA lead says it (any wording of it), run this runbook in a Claude session that has BOTH
repositories attached: `ShopView/shopview` (the app's code) and `bilalmuzamil-sketch/Manual-test-Cases`
(the tracker). A session without them cannot do it: attaching the private app code needs a person's
approval, so ask the QA lead to attach it rather than reporting a missing release (that mistake is what
the 2 Nov 2026 failure looked like).

What was tried and removed (for the record): a release-day scheduled task in fresh sessions (failed
because those sessions could not attach the app's code without approval), and a permanent worker session
woken by a scheduled task (the scheduled messages never reached it). Both were removed on 3 Nov 2026, with
the page's Update now button.

- Page: https://claude.ai/artifact/N7gowXrbJyzoBe94z6dL1E
- Branch: `claude/global-search-v1-baseline-6ax9ul` of `bilalmuzamil-sketch/Manual-test-Cases`
- Product code: `ShopView/shopview` at `/home/user/shopview` (read only)
- Everything happens through **one command**: `build/custom-roles-tracker/tools/auto_update.py`

## Steps

0. **Repositories.** (`auto_update.py` also looks for the product code in other folders and downloads it
   itself when it is missing, so a skipped clone no longer looks like a missing release. A missing
   product repository was the cause of the 2 Nov 2026 failure.) If `/home/user/Manual-test-Cases` is missing, attach `bilalmuzamil-sketch/Manual-test-Cases`
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
   `python3 build/custom-roles-tracker/tools/auto_update.py --mark-published`. Then stop watching the page
   (publishing starts a watch, and nothing needs it): `ArtifactComments` `watch`, page `url`, `on: false`. If the publish fails, set
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
