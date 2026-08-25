# Source Snapshot & Change-Only Delta Tracking — Process (reusable, any project)

> **Plain-English purpose:** for a tracked project, take ONE full snapshot of every source
> (spec, epic + stories, designs, tech plan, PO answers) and commit it. On every later run,
> re-pull the same sources, DIFF against the snapshot, and report **ONLY what changed — with
> complete references** (source · version/date · exact anchor · old→new text · the affected
> test-case IDs). The other Claude session then corrects the test cases by looking at **just
> those changes**, not the whole suite. Then update the snapshot. This is the runner's
> steady-state tracking loop.
>
> Builds on Rule 31 (source currency — the currency identifiers this snapshot records), Rule 37
> (epic Tier-1 currency check), Rule 43 (per-requirement coverage → which case a change hits),
> Rule 59 (re-read sources before any write), and the two-session shared brain (Rule 20 — this
> session reports the delta, the OTHER session corrects the cases from it).

## When to run
- **Onboarding run (once per project):** build the first snapshot.
- **Tracking run (every time after):** diff → change-report → refresh snapshot.
- Trigger phrases: "track <project>", "check <project> for changes", "what changed on <project>".

## The snapshot — what it records (per project: `build/<slug>/SOURCE-SNAPSHOT.json`)
One entry per source, each with a stable **currency identifier** (NOT a surface date — Rule 31
staleness traps):
- **Spec** — Confluence pageId + **Confluence version number** + last-updated + a content hash of
  the ingested body (and, where practical, per-requirement anchors→hash so a moved requirement is
  pinpointable).
- **Epic + stories** — epic key + child-story key set + each story's **status** + the epic
  **changelog** high-water mark (Rule 37 Tier-1: verify child count two ways).
- **Designs** — Figma file key + node ids + each node's version/hash (or the Claude-design link +
  its captured state); if a Rule-35 fetch queue is OPEN, record it (source is PARTIAL).
- **Tech plan** — doc id/name + version/date (Rule 30).
- **PO/stakeholder answers, messages, videos** — file/link + date (newest authoritative wins,
  Rule 32).
- **Build marker** (if a QA env exists) — app-version + etag + date (Rule 49).
Each entry: `{source, identifier, version, last_checked, hash, status: CURRENT|STALE|PARTIAL}`.

## The tracking run — the 5 steps
1. **Re-pull every source LIVE** (Confluence via MCP, Jira epic+stories+changelog, Figma, tech
   plan, PO answers, build marker). Never trust a surface date — use the version number / changelog
   / content hash (Rule 31 traps a/b).
2. **Diff against the snapshot.** For each source, compute what changed: spec requirement
   added/changed/removed (with the exact §-anchor + verbatim old→new); story added/removed or
   status-changed; design node changed; tech-plan delta; new/newer PO answer.
3. **Map each change to the affected test cases** (internal ID + TestRail C-id + link, Rule 8) via
   the per-project `testrail-id-map.csv` refs + coverage matrix. A change with no mapped case is a
   **coverage gap** — list it as "no case yet".
4. **Emit the CHANGE-ONLY report** — the ONLY deliverable of a tracking run (see format below). If
   nothing changed, say exactly that ("no changes since <snapshot date>"). **Do NOT re-list
   unchanged items, and do NOT edit any test case** — the other session does the corrections from
   this report.
5. **Refresh the snapshot** (commit the new `SOURCE-SNAPSHOT.json`) so the next run diffs from here.

## The change-report format (`build/<slug>/CHANGES-<date>.md`)
One row per change, complete references so another session can act on it alone:

| # | Source | Reference (verbatim) | Change (old → new) | Affected cases (internal + C-id + link) | Action for the other session |
|---|---|---|---|---|---|
| 1 | Spec vX→vY | §<anchor>: "…verbatim old…" → "…verbatim new…" | added/changed/removed | SF-XX-01 = C##### (link) | update expected / author / retire |
| 2 | Epic <KEY> | story <KEY> status Done→Reopened | … | … | re-verify |

Rules for the report: every reference is **verbatim** (Rule 25); every case is paired with its
**C-id + link** (Rule 8); a change with no mapped case is flagged **"coverage gap — author"**;
nothing else is included. Keep it plain (Rule 7).

## Guardrails
- **Snapshot lives in git** (the only durable store; Rule 29) — the diff is only as good as the
  committed snapshot.
- **Change-only** — a tracking run's job is the delta, not a re-audit; never re-report unchanged
  sources or re-verify the whole suite.
- **No test-case edits on a tracking run** — this session reports; the OTHER session corrects from
  the report (two-session split, Rule 20). Unless the user explicitly asks THIS session to also
  apply them (then Rule 6 authorization + Rule 50 verification apply).
- **Currency identifiers, not surface dates** (Rule 31 traps) — Confluence version number, Jira
  changelog, content hash; never the in-body "Version" field or the epic "updated" timestamp.
- **Completeness** (Rule 17) — every source is re-pulled every run; a source that can't be fetched
  is reported as STALE/PARTIAL with what's missing, never silently skipped.
