# Spec Change Monitor — Runbook

**Schedule:** twice daily at **08:07 and 20:07 Pakistan time (PKT, UTC+5)** =
cron `7 3,15 * * *` UTC. Routine id `trig_01Pt5R7xUFZSGe1gtB8k2Lkq`.

**Purpose:** Twice-daily watch on two Confluence spec pages. On each run, fetch
the live page, diff it against the stored baseline, and if anything changed,
**alert Bilal** (bilal.muzamil@shopview.com) with a clear **before → after** for
every change and a call-out of anything **newly added** or **removed**. Then
promote the fresh version to the new baseline so the next run diffs against it.

These pages drive manual test-case maintenance for two projects, so the alert
must be precise enough that Bilal can update the affected test cases.

## Pages watched (see `baselines/meta.json` for the authoritative list)

| Key | Page | Project | PO |
| --- | --- | --- | --- |
| `fees-discounts` | Fees & Discounts V1 (pageId 622297094) | Fees and Discount | Chris Ward |
| `simple-flow` | Simple Mode — Streamlined WO Completion & Bulk Receiving (pageId 646021121) | Simple Flow | Milos Vasic |

## Procedure (run this on every scheduled fire)

1. **Sync the branch.** This session's repo is a fresh clone. Baselines live on
   branch `claude/spec-change-monitoring-8w6rvc`.
   `git fetch origin claude/spec-change-monitoring-8w6rvc && git checkout claude/spec-change-monitoring-8w6rvc && git pull origin claude/spec-change-monitoring-8w6rvc`

2. **Fetch both pages live** (markdown) via
   `mcp__Atlassian__getConfluencePage(cloudId="shopview.atlassian.net", pageId=<id>, contentFormat="markdown")`.
   Results may exceed the token cap and be persisted to a file — extract the body
   with `jq -r '.content.nodes[0].body'`. Also capture `.lastModified`.

3. **Diff** each fresh body against `build/spec-monitoring/baselines/<key>.md`.
   Use `diff -u` for the mechanical delta, but write the ALERT in plain English:
   - group changes by the section/heading they fall under;
   - for each change show **BEFORE:** (old text) and **AFTER:** (new text);
   - label each as **Modified**, **Newly added**, or **Removed**;
   - a `lastModified` change with an identical body = no content change (say so).

4. **If there are content changes:**
   - Write a dated report to `build/spec-monitoring/history/<YYYY-MM-DD>-<HHMM>-<key>.md`
     (one file per page that changed) containing the full before→after breakdown.
   - **Alert Bilal.** Primary channel = this session's chat reply (push/email is
     configured on the Routine so it reaches his phone/inbox). Lead with a
     one-line summary per page (e.g. "Fees & Discounts: 2 sections modified, 1
     new subsection"), then the detailed before→after.
   - **Regenerate the TestRail import files** for the affected project so Bilal
     can review + upload (he does NOT want the monitor to write to TestRail
     directly). If the change implies new/edited test cases, update the source
     cases under `build/<project>/cases/*.json` first, then run
     `python3 build/spec-monitoring/gen_testrail_import.py`. This refreshes, for
     each project, the canonical CSV/XLSX plus:
       - `testrail-import/<project>-v1-testrail-import.xml` (TestRail suite XML)
       - `testrail-import/<project>-v1-testrail-import-withIDs.csv` (Case ID + link)
     Call out in the alert exactly which cases were added/edited and that the
     import files are refreshed.
   - **Overwrite the baseline** file(s) with the fresh body and update
     `baseline_lastModified` in `meta.json`.
   - `git add -A && git commit && git push -u origin claude/spec-change-monitoring-8w6rvc`
     (commit message: `spec-monitor: <page(s)> changed <date>`).

5. **If nothing changed on either page:** do NOT alert, do NOT commit. Stay
   silent. (Optional: a single low-noise line in chat is fine, but no email/push.)

## Rules
- Never write to TestRail. This monitor only reads Confluence + writes to this repo.
- No secrets in the repo.
- Keep the alert in plain, layman English per the project's standing rules — but
  DO preserve exact spec wording inside the BEFORE/AFTER quotes (that precision is
  what lets Bilal update the test cases).
- Baseline promotion happens ONLY after a successful alert, so a missed/failed
  alert run will still be caught on the next run.
