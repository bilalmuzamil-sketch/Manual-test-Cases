# VIU LANE — SESSION-START PREFLIGHT (second VIU session of 2026-08-21, 06:50Z)

**Lane:** VIU (handoff 3). **Branch:** `claude/slack-session-0sxnd9` — fetched, checked out,
fast-forwarded 11 commits from `origin`, HEAD `2a004e93`, tree clean, 0 ahead / 0 behind.
**No project named yet by the QA lead — the Rule 2 / Rule 92 scope gate is CLOSED.**
**Zero writes performed: 0 TestRail, 0 Jira, 0 application driving, 0 lock claimed.**

> **This is a SECOND VIU-lane preflight today.** The first is `PREFLIGHT.md` in this folder,
> committed `f822c336` at **06:02Z** — 48 minutes before this one. Its findings are treated as
> committed evidence (Rule 86), and the live-moving parts below were **re-probed independently**
> rather than carried forward.

## Read, in the ordered startup sequence (Rule 88 — nothing bulk-read beyond the list)

`build/handoffs/HANDOFF-3-VIU.md` (full) · `build/skills/12-VIU.md` (full — thin router) ·
`build/skills/00-COMMON-CORE.md` (full, in bounded 240-line slices — 1,914 lines) ·
`build/skills/02-SOURCE-CHECK.md` (full) · `build/skills/03-RUN-CHECK.md` (full) ·
`build/skills/01-CASE-BUILD.md` (full) · `build/skills/04-TESTER-READY.md` (§6 + §6.1 +
guardrails, as the router directs) · `build/skills/06-DEFECT-PREP.md` (full) ·
`build/skills/13-CROSS-SESSION-SAFETY.md` (full) · `build/skills/14-ACCESS-RESILIENCE.md` (full) ·
`build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md` (full).
**`CLAUDE.md` NOT read end-to-end** (Rule 88) — the auto-loaded index only.

## §0 ACCESS PREFLIGHT (Rule 89 §0) — probed by THIS session, all times UTC 2026-08-21

| System | Path used | Verdict | Detail |
|---|---|---|---|
| Secret scanner | `make_secret_fingerprints.py` 06:49Z | **STRUCTURAL-ONLY** | 0 credential files in `/tmp` ⇒ **0 fingerprints**. `--selftest` **ALL PASSED** (both directions). `pre-commit` hook **installed into this container** at 06:50Z (it was absent). |
| TestRail | REST v2 unauth probe `get_case/1` 06:50Z | **REACHABLE / NO CREDENTIALS** | **HTTP 401**. `/tmp/testrail/creds.json` **absent** (fresh container). Core §17: ask for it by that path-name — do not hunt the repo. |
| Jira | Atlassian MCP `getJiraIssue` 06:52Z | **PASS** | `SV-8785` → HTTP 200, Epic "Filters", status **Open**, updated **2026-08-14T09:54:12-05:00**, PRD link pins in-body **v1.7**. cloudId `19fdd96d-a135-46c4-83e7-d2cc218a4e63`. |
| Confluence | same estate as Jira | **PASS BY INHERITANCE — deliberately not probed** | The only version-bearing MCP call returns the **whole page body** (register **R3**), so a preflight probe costs a full spec body for no new information. Auth is the same Atlassian session Jira just proved. |
| ShopView — staging | unauth `GET /index.html` 06:50Z | **PASS** | `v3.10-49b5fe3` · last-mod **Thu 20 Aug 2026 14:25:38 GMT** · etag `7d2ccef0fe56bf88a0c14b30a063d09a` · sha256 `bed393b44321a7b9…` · 3,544 bytes |
| ShopView — `sv8685` (Schedule) | unauth `GET /index.html` 06:50Z | **PASS** | `v3.8-bc7508a` · last-mod **Tue 18 Aug 2026 08:52:42 GMT** · etag `cae721e3195a314b25bf9e6b26477246` · sha256 `e21bf8213d52812d…` · 3,543 bytes |
| ShopView — `sv8785` (Filters) | unauth `GET /index.html` 06:50Z | **PASS** | `v3.7-6e2d301` · last-mod **Tue 18 Aug 2026 12:33:36 GMT** · etag `81b49881d0d38f64898c179dc29ff4d8` · sha256 `537690ae19f77083…` · 3,694 bytes |
| ShopView — `sv8582` (Report Suite) | unauth `GET /index.html` ×3 (06:50Z, 06:51Z ×2) | **FAIL — HTTP 502** | `curl (56) CONNECT tunnel failed, response 502`, **0 bytes every time**. The build marker is **UNVERIFIED** — not carried over from a neighbouring host. Register **R4**. |
| ShopView — authenticated surface | — | **BLOCKED** | no `sv_sso_session` / `PHPSESSID` / `cf_clearance` anywhere in `/tmp`. Register **R1**. Nothing can be VIU'd live until these arrive. |
| Figma | MCP `whoami` 06:52Z | **PASS** | handle Bilal Muzamil, plan `team::1570887137799529764`, seat **View**. REST fallback token `/tmp/figma-token` **absent**. |

**The 502-buffer trap was avoided deliberately.** The first VIU preflight recorded that a `sv8582`
probe once appeared to return `v3.7-6e2d301` because curl wrote no body and the output file still
held the previous host's bytes. This session wrote each host to its own freshly-deleted file and
checked the byte count, so the three PASS rows carry three **distinct** sizes and sha256 prefixes and
the sv8582 row carries **0 bytes** rather than a borrowed marker.

## Standing queue checks

- **Rule 35 (Figma):** `build/filters/design-2026-07-31/PENDING-FIGMA-FETCH.md` is the only queue file
  and it is **CLOSED — 85/85 at 2026-07-31T08:58:40Z**, no DUE-AT armed. Nothing to retry.
  *(Its body still contains a historical `STATUS: STILL OPEN — 79/85` line below the closing note; a
  grep that stops at the first match will misread it. It is the audit trail, not the state.)*
- **Rule 49 (re-check queues):** **18** `RECHECK-QUEUE.md` files across Filters / Schedule / Report
  Suite. Under core §16.0 an OPEN queue is again the ordinary steady state of an active project.
  **All 18 belong to other sessions' projects and are REFERENCE ONLY (Rule 92) — not this session's
  backlog.**
- **Rule 83 (locks):** `build/LOCKS/` holds **only `README.md`** — no live foreign claim on any
  project, and **no `browser.lock.md`**. Nothing claimed by this session.
- **Rule 62 (Jira creation hold):** **STILL ACTIVE, NOT LIFTED.** Nothing created, nothing proposed
  for creation.

## Concurrency note (Rule 83) — stated rather than assumed

Three lane preflights landed within two minutes this morning — build-verify `a106e9e2` 06:00Z,
test-case-creation `8a2e70cb` 06:00Z, VIU `f822c336` 06:02Z — so **other lane sessions have been
active in this workspace today.** Whether any is still alive **cannot be determined from git**, and
there is no live message bus. No lock file is held by any of them, so there is no write-lock conflict.
**The practical consequence for this lane:** `POST /api/quick-login` and `POST /api/switch-user`
rotate the shared `sv_sso_session` and would evict a live sibling (core §6 trap 5), so this session
will **claim `build/LOCKS/browser.lock.md` before driving the browser at all**, and will say so.

## Two findings for the QA lead — reported, not acted on (Rule 72: propose before recording)

1. **`build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md` carries wording Rule 54 now BARS.** Its step
   **(4b)** quotes the provenance shape as *"This is the expected behaviour as per the build tested on
   8/4/2026, and as per the Sales By Customer report specification version 13 (S4-R13)."* — a single
   merged sentence that **names the build as a source of the expectation.** Rule 54 as amended
   2026-08-11 (core §14) requires **two sentences never merged**, sentence 1 naming **documents only**,
   and explicitly **bars** *"as per the build tested on …"*. The process document is the one this lane
   executes, so a session following it literally would reproduce the 748-case failure.
   **Proposed fix: rewrite (4b) to the two-sentence form and keep the old text visible and dated.**
   Not edited — Rule 72 says propose first.
2. **The same document's step (2a) still prescribes the superseded HOLD default.** It says a
   substantive divergence gets *"normally `AUTOMATION: HOLD`"*; skill `03` and core §15.1a **corrected
   that on 2026-08-13** — a HOLD on a case whose steps run **disarms it**, and the corrected default is
   plain `READY` (or `READY - EXPECT FAIL` where a live ticket backs it). **Proposed fix: point (2a) at
   core §15.1a's four-row table instead of restating a stale default.**

## OUTSTANDING — what I need from you

| # | What it is, in plain words | What YOU do | What it blocks | Since |
|---|---|---|---|---|
| 1 | **Which project this session works on.** I am a project-agnostic engine with no backlog until you name one. | Name one project. | Everything. | now |
| 2 | **Which process to run** — the build-accurate wording + VIU, the whole-suite spec-relevance reconciliation, or both (Rule 11). | Say which. | The pass's shape. | now |
| 3 | **Fresh ShopView session cookies** — `sv_sso_session`, `PHPSESSID`, `cf_clearance` for the target branch. Nothing is in `/tmp`. | Supply them into `/tmp` (they die at ~24 h or on a deploy). | **Every live observation.** A VIU cannot be run at all without them. | this container |
| 4 | **TestRail credentials at `/tmp/testrail/creds.json`.** The API answers 401 without them. | Supply them at that path. | Reading case bodies; any authorised push. | this container |
| 5 | **Permission to write to TestRail** (Rule 6), asked before the pass rather than after the rewrite. | Say yes or no, per pass. | The push half of the VIU. | on assignment |
| 6 | **The branch-name conflict** — see the report; two instructions name two different branches, both of which exist. | Confirm `claude/slack-session-0sxnd9`. | Where the work is pushed. | now |
| 7 | **The two process-document corrections above.** | Approve, amend or decline. | Nothing today; a later session following the doc literally. | now |
| 8 | **`sv8582` is unreachable (HTTP 502 ×3).** | Nothing yet — informational unless the Report Suite is named. | Report Suite live work only. | 2026-08-21 |

**Nothing else outstanding.** All six Rule-36 categories were swept: missing sources (n/a until a
project is named) · unanswered PO/dev questions (none owned by this session) · missing go-aheads
(rows 2, 5) · access/credentials (rows 3, 4, 8) · deferred/HELD decisions (row 7; the Rule-62 hold
stands) · what another team owes (nothing).
