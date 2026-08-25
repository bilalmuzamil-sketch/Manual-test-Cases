# TESTRAIL ACCESS CHECK FOR THE SIX SUITES AUTHORED 2026-08-25

**Asked by the QA lead:** *"can you see if you have access to the testrail for all the projects for
which we created the test cases today."* **Answered 2026-08-25T09:57Z.** Build-verification lane.
Branch `claude/slack-session-0sxnd9` (confirmed correct by the QA lead, 2026-08-25).

---

## 1 · TESTRAIL ACCESS — **NO. Re-verified live today, not carried from memory.**

| Check | Result | Read at (UTC) |
|---|---|---|
| `/tmp/testrail/creds.json` | **ABSENT** — no `/tmp/testrail` path exists at all | 2026-08-25T09:56Z |
| `TESTRAIL_EMAIL` / `TESTRAIL_PASSWORD` / `TESTRAIL_USER` env | **UNSET** — `env \| grep -c '^TESTRAIL'` = **0** | 2026-08-25T09:56Z |
| Live API probe `get_case/29557` | **HTTP 401** — `{"error":"Authentication failed: invalid or missing user/password or session cookie."}` | 2026-08-25T09:56Z |
| Host reachability | **REACHABLE** — the refusal is authentication, not network | 2026-08-25T09:56Z |

**So access is credential-blocked, not blocked by the estate.** One file at
`/tmp/testrail/creds.json` (keys `email` / `host` / `password` / `user`, `chmod 600`, never committed —
this repo is PUBLIC) restores every read. Per core §17 that file is **asked for by name and never
hunted in the repository**, because by design it is not there.

## 2 · 🔴 THE BIGGER FINDING — THERE IS NOTHING IN TESTRAIL TO VERIFY YET

**Even with credentials, none of today's six suites could be build-verified against TestRail, because
none of them has been pushed to it.** Measured from the committed id-maps, not taken from any
session's summary (Rule 86):

| Project | group_id | Authored rows | **C-IDs set** | C-IDs blank | Build / env status |
|---|---|---|---|---|---|
| **Global Search V2** | 6720 | **97** | **0** | 97 | **NO BUILD** — feature-flagged, not on any QA env (OQ-5) |
| **Inline Add and Edit Parts** | 6597 | **96** | **0** | 96 | **NO BUILD** — Rule 85 source-verified only |
| **Invoice UI Refresh** | 6559 | **87** | **0** | 87 | **NO BUILD** — Rule 85 source-verified only |
| **Simple Flow V2** | 6665 | **61** | **0** | 61 | **NO BUILD** — Rule 85 source-verified only |
| **Printer Friendly Work Orders** | 6617 | **44** | **0** | 44 | **NO BUILD** — Rule 85 source-verified only |
| **Digital Inspections V2** | 6658 | **43** | **0** | 43 | `sv8181.qa.shopview.com` exists but is **"DO NOT TOUCH" (QA lead)** → treated as no-build |
| **TOTAL** | | **428** | **0** | **428** | |

**Method:** for each `build/<project>/testrail-id-map.csv`, counted rows and counted values in the
`testrail_case_id` column matching `^[0-9]+$`. **428 rows, 0 populated, in all six.** This
independently confirms `build/TESTRAIL-PARENT-FOLDERS.md`'s own closing line — *"All six suites above
are authored (nothing pushed to TestRail by us; C-IDs blank until the QA lead imports)"* — rather than
relying on it.

## 3 · WHAT THIS MEANS FOR THE BUILD-VERIFICATION PASS

Build verification needs **three** things. Today **none of the six has more than one of them.**

| Prerequisite | State |
|---|---|
| **1. Cases reachable in TestRail** (C-IDs exist, so a verdict can be recorded and Rule 8 satisfied) | **MISSING for all six** — 0 of 428 imported |
| **2. TestRail credentials** | **MISSING** — HTTP 401 today |
| **3. A running build with the feature present** | **MISSING for five**; the sixth (`sv8181`) is fenced off by explicit instruction |

**Under Rule 85 the honest label for all six today is: `SOURCE-VERIFIED ONLY — NO BUILD EXISTS YET`.**
Rule 91 badge for build verification on every one of the 428: **❌ NEVER BUILD-VERIFIED.**

**I did NOT probe `sv8181.qa.shopview.com`**, even read-only, because the committed record carries an
explicit QA-lead instruction to leave it alone. Whether an unauthenticated `index.html` marker read is
permitted there is an **ask**, not an assumption.

## 4 · WRITES THIS SESSION

**ZERO.** No TestRail write, no Jira ticket, no run write, no case touched, no lock claimed. This file
and the preflight are the only artefacts.
