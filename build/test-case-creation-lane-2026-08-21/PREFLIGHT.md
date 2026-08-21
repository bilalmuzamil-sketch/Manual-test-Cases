# TEST-CASE CREATION LANE — SESSION PREFLIGHT, 2026-08-21

Session started 2026-08-21T05:43Z. Lane: **creation (authoring)**. Branch checked out:
`claude/test-case-creation-ud6cg6` at `1920deea`.
This file is the Rule-89 §0 record. **No project work has started; nothing has been written to
TestRail, Jira or any external system.**

---

## 0 · GIT CURRENCY (core §0 step 1, §9)

`git fetch origin` ran clean. **`claude/test-case-creation-ud6cg6` and
`origin/claude/slack-session-0sxnd9` are at the IDENTICAL commit `1920deea`** — measured
`git rev-list --left-right --count` = `0 0` in both directions. The ordered
`git rebase origin/claude/slack-session-0sxnd9` was therefore a **no-op**, not skipped. Nothing stale.

**⚠️ RULE-63 CONFLICT SURFACED — TWO BRANCH NAMES, NOT RECONCILED BY ME. See §6.**

## 1 · ACCESS PREFLIGHT (Rule 89 §0) — read 2026-08-21T05:44–05:47Z

| System | Path used | Verdict | Evidence |
|---|---|---|---|
| **TestRail** | REST API v2, unauthenticated probe | 🔴 **BLOCKED — no credentials held** | `get_case/29557` → **HTTP 401**. `/tmp/testrail/creds.json` **does not exist** (`/tmp` is a fresh container). Per core §17 this is an ASK, not a hunt — the file is deliberately absent from this PUBLIC repo. |
| **Jira** | Atlassian MCP | ✅ **PASS** | `getAccessibleAtlassianResources` → cloudId `19fdd96d-…`, scopes `read:jira-work` + `write:jira-work`. `getJiraIssue SV-8785` → HTTP 200, Epic "Filters", status Open, updated **2026-08-14T09:54-0500**. |
| **Confluence** | Atlassian MCP | ✅ **PASS for read / 🔴 version integers still blocked** | Scopes `read:page:confluence` present. See §2 — a new cheap path was found, and it does NOT solve R3. |
| **ShopView staging** | unauthenticated `GET /index.html` | ✅ reachable, ❌ **no session** | HTTP 200, build marker **`v3.10-49b5fe3`**. No cookies held, so no authenticated action is possible. |
| **ShopView `sv8785`** | same | ✅ reachable | HTTP 200, **`v3.7-6e2d301`** |
| **ShopView `sv8685`** | same | ✅ reachable | HTTP 200, **`v3.8-bc7508a`** |
| **ShopView `sv8582`** | same | 🔴 **UNREACHABLE** | **HTTP 000** (connection failure). Consistent with register row **R4** (recorded 502 ×3). **NO build marker was read for this host** — see the honesty note below. |
| **Figma** | — | ❌ **no token** | `/tmp/figma-token` absent. MCP tools present in the tool list but not called (nothing needed one this turn). |
| **Secret scanner** | `scan_secrets.py --selftest` | ✅ **PASS both ways** | "SELFTEST: ALL PASSED", including the fingerprint control. |
| **Secret fingerprints (FULL mode)** | `make_secret_fingerprints.py` | 🟠 **STRUCTURAL-ONLY** | *"NO credential files found in /tmp. Nothing to fingerprint … wrote 0 fingerprints"*. The gate is **narrower than full mode** and every commit of this session must say so. |

### 🛑 AN HONESTY CORRECTION ON MY OWN PROBE, RECORDED RATHER THAN QUIETLY FIXED (core §1.1)

My reachability loop reused one temp file and did not clear it between hosts. Because `sv8582`
returned **HTTP 000 with no body**, the marker printed on its row was the **leftover from the
previous iteration** (`v3.8-bc7508a`, which is `sv8685`'s). **No build marker exists for `sv8582`
from this session.** Reporting that leftover as an `sv8582` marker would have been a fabricated
observation (Rule 12) — logged here because a silently-repaired probe teaches nobody anything
(core §1.5a part 3).

## 2 · A NEW, CHEAP CONFLUENCE MOVEMENT DETECTOR — AND WHAT IT DOES **NOT** DO (register row R3)

Row R3 records that *"the only version-bearing MCP call returns the whole page body (~8k tokens
each)"*. I tested a cheaper path: **`searchConfluenceUsingCql` with `id in (...)` and
`expand=version`**, three pages in one call.

- ✅ **It returns `lastModified` per page, cheaply, in one batched call** — a genuine
  **movement detector** for the Rule-31 pre-flight, at a small fraction of a page-body fetch.
- 🔴 **It does NOT return the Confluence version integer**, even with `expand=version`. **Row R3
  stands unchanged.** A version pin for a Rule-42 `refs` entry or a Rule-54 provenance line still
  needs the expensive call or an API token.

**What it measured (read 2026-08-21T05:47Z), and all three confirm register row R5:**

| Page id | Title | Live `lastModified` | Note |
|---|---|---|---|
| **572030978** | Filters | **2026-08-20** (yesterday, 8:58 PM) | in-body reads "Version: 1.8" — the **trap (a)** decoy, not the version |
| **713031682** | Schedule | **2026-08-20** (yesterday, 3:43 PM) | in-body reads "Version 1.1" — same decoy |
| **720142338** | Inventory Value Report | **2026-08-13** | in-body has no version field (that is the fact, not a failed read) |

**Proposed for the books (Rule 72 — PROPOSED, NOT RECORDED):** add this CQL call to skill `02`
step 2 as the cheap first stage of the spec-currency check, explicitly labelled *movement detector
only, not a version source*. **Not written into any skill until the QA lead approves.**

## 3 · A QUOTA TRAP WORTH RECORDING (Rule 27 / Rule 90)

**`mcp__Atlassian__getJiraIssue` returned the full `description` field even though `fields` was
restricted to `summary, status, issuetype, updated`.** The SV-8785 epic body alone was ~1.5k tokens
of unrequested payload. For an epic-child sweep, prefer `searchJiraIssuesUsingJql` with an explicit
narrow field list and verify what actually comes back before fanning out over 40+ children.
**Also PROPOSED, not recorded.**

## 4 · LANE LOCK (Rule 83)

`build/LOCKS/` contains **only `README.md`** — **no foreign claim exists on any project.**

**I have claimed NOTHING**, because the convention is one claim file per project slug and **no
project has been assigned to me yet**. A lock with no project and no pending write would be noise.
**I will claim, commit and push a lock file before the first write of any project pass**, per skill
`13` §2.

## 5 · FIGMA QUEUE (Rule 35)

One queue file exists — `build/filters/design-2026-07-31/PENDING-FIGMA-FETCH.md` — and it is
**✅ CLOSED, 85/85, since 2026-07-31T08:58:40Z. No DUE-AT is armed and no retry is owed.**

## 6 · 🛑 RULE-63 CONFLICT — WHICH BRANCH DO I PUSH TO?

Neither silent path is available (core §11.6), so this is surfaced **before** any work, not in a
closing summary.

- **What the session instruction says, verbatim:** *"You are the TEST-CASE CREATION session for the
  ShopView QA workspace, branch **claude/slack-session-0sxnd9**."* The workspace's own skill `13` §2
  agrees, naming `git rebase origin/claude/slack-session-0sxnd9` as the collision remedy.
- **What the standing harness instruction says, verbatim:** *"Develop on branch
  **claude/test-case-creation-ud6cg6**"* … *"**NEVER** push to a different branch without explicit
  permission."*
- **Why it is currently harmless, and why it will not stay that way:** the two refs are at the
  **identical commit** today, so nothing is lost either way. **The moment either branch takes a
  commit the other does not, the shared-brain channel splits** — and skill `13` §5 is explicit that
  a figure existing only outside the committed shared branch is unverifiable.
- **The ask:** **which branch do I push to?** I have pushed nothing and will hold this preflight
  commit on `claude/test-case-creation-ud6cg6` (the harness-designated branch, the conservative
  reading of the "never push elsewhere" instruction) until answered.

## 7 · THE JIRA HOLD — CHECKED, NOT ASSUMED (Rule 62 lift condition)

Rule 62 requires a session to **check** whether the 2026-08-10 hold has lifted rather than treat it
as standing law. **Checked against the committed record — it has NOT lifted**, and register row
**FR20-7 (2026-08-20)** still reads *"Jira ticket creation stays on hold (Rule 62) — nothing filed."*

**BUT ROW H1 CARRIES A CORRECTION THAT MATTERS TO THIS LANE, and a session could easily miss it.**
QA lead, verbatim **2026-08-20**: ***"SOrry new case creation is not held for any project at all,
see if you confused Hold on Jira ticket creation with Hold on New test case creation."*** So:

- **Jira ticket creation — BARRED.** Unchanged, until his explicit order.
- **TestRail `add_case` / `update_case` — NOT held by the hold.** The `add_case` bar was **our own
  over-broad reading** of his words, since corrected.
- **🔑 AND THAT IS NOT PERMISSION.** **Rule 6 is a separate gate and still governs every TestRail
  write, per ask.** The QA lead's instruction to this session says so in terms: *"no TestRail writes
  without my explicit permission (6)"*. **Hold-not-applicable ≠ authorised.** Nothing will be
  written until he says so, per ask.

## 8 · WHAT THIS SESSION HAS NOT DONE

No case authored, no source diffed, no coverage matrix derived, no TestRail read or write, no Jira
read beyond the two preflight calls above, no browser driven, no `quick-login`, no MCP config
touched (core §6 rule 1 of MCP hygiene). No project has been assigned yet, so **Rule 1 bars a start**.

## 9 · A MESSAGING DEFECT IN THE SECRET-SCAN GATE — reported, NOT patched

`make_secret_fingerprints.py` **did** write `/tmp/secret-fingerprints.json` (mode 600), containing
`"sha256": []` — zero fingerprints, because no credential files exist in `/tmp` to fingerprint.
`scan_secrets.py` then prints on every run:

> *"note: no /tmp/secret-fingerprints.json; structural patterns only."*

**The file exists.** `load_fingerprints()` (`scan_secrets.py:191`) returns an empty `set()` both when
the file is missing **and** when it holds zero fingerprints, and the caller cannot tell the two apart.

- **No protection is lost.** Zero fingerprints means full mode has nothing extra to match, so the
  gate genuinely IS structural-only. The **verdict** is right.
- **The message is wrong**, and it is wrong about the state of a guardrail — the exact class skill
  `13` §1 warns about (*"a guardrail that silently no-ops is worse than none, because it gets
  reported as having run"*), inverted: here it under-reports. A session reading it would conclude the
  session-start step was never run and run it again.
- **NOT PATCHED.** Shared tooling, and my lane is authoring. Suggested one-line fix for the QA lead's
  approval: distinguish *file absent* from *file present with 0 fingerprints* in the notice.
