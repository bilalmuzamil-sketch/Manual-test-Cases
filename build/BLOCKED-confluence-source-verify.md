# ✅ RESOLVED 2026-08-26 — Report Suite source verification (all six specs)

**Status: RESOLVED 2026-08-26. Atlassian login works; all six Report Suite specs were fetched live
and diffed — evidence in `build/report-suite/source-verify-2026-08-26/reports/`.**

**Cause:** an undismissed Atlassian **"Security review" interstitial** was swallowing the login — it
was never a credential problem, and the account has **no OTP** because two-step verification is off.
**Fix:** dismiss the "Security review" interstitial during login, then proceed normally (no OTP is
issued or needed). Recorded in commit `55b3e979`.

**Everything below is the ORIGINAL 2026-08-26 blocker text, kept verbatim and dated (never deleted).**

---

# BLOCKED — Report Suite source verification (all six specs) — 2026-08-26 *(original text, superseded)*

**Status: BLOCKED AT THE PREFLIGHT GATE. No spec body was fetched. No workaround was attempted
beyond the documented ladder in `build/skills/14-ACCESS-RESILIENCE.md` (Rule 89 — no retry loop).**

The order was: source-verify all six Report Suite specs so manual testers are not blocked by cases
carrying superseded expectations, gated on a Confluence preflight. **The preflight failed.**

---

## 1 · The access ladder, rung by rung — what was actually tried

| # | Rung (per `14-ACCESS-RESILIENCE.md` §309 and `ATLASSIAN-JIRA-ACCESS-METHOD.md`) | Result |
|---|---|---|
| 1 | **Atlassian MCP tools** (`getConfluencePage`, `searchJiraIssuesUsingJql`, …) | **ABSENT from this session.** A `ToolSearch` for Confluence/Atlassian tools returns no `mcp__atlassian__*` tool of any kind — only GitHub and WebFetch. Not "erroring": **not connected.** |
| 2 | **Stored Atlassian session cookies** in `/tmp` (`/tmp/atlassian/cookies.txt`, `cloud.session.token`) | **ABSENT.** `/tmp/atlassian/` does not exist in this container. Secrets are ephemeral by design (Rule 82), so nothing carried over. |
| 3 | **Unauthenticated REST probe** — ONE attempt each, no loop | `GET https://shopview.atlassian.net/rest/api/3/myself` → **HTTP 401**.<br>`GET https://shopview.atlassian.net/wiki/api/v2/pages/720142338` → **HTTP 404** (Confluence's anonymous form of "no access"). |
| 4 | **Browser login + email OTP** (the documented fallback) | **NOT POSSIBLE UNATTENDED.** It needs (a) the Atlassian password, which was not supplied, and (b) a **6-character OTP relayed by a human in real time**. There is no human in this loop. Starting it would burn an OTP and stall. |
| 5 | `WebFetch` on the page URL | Not attempted — its own contract states it **fails on authenticated/private URLs**, and Confluence rung 3 already returned 401/404. |

**Note the change since 2026-08-21:** the index refresh that day recorded *"Atlassian MCP Confluence
+ Jira (200)"*. **The credential/tenant is not known to be broken — this SESSION simply has no
Atlassian MCP server attached.** That is the cheapest thing to fix.

---

## 2 · WHAT I NEED — exactly one of these three, and then the pass runs unattended

1. **RECONNECT THE ATLASSIAN MCP SERVER** to this session (the same one that answered 200 on
   2026-08-21). ← **cheapest, and the whole six-report pass then runs with no further asks.**
2. **AN ATLASSIAN API TOKEN** for a Confluence-read account, written by you to
   **`/tmp/atlassian/token.json`, `chmod 600`** — `{"email":"<you>@shopview.com","token":"<api token>"}`.
   Never in this repo (public, Rule 82). Basic auth `email:token` against
   `https://shopview.atlassian.net/wiki/api/v2/pages/<id>?body-format=storage` gives the body **and**
   the version integer in one call.
3. **A LIVE BROWSER LOGIN**: the Atlassian password plus **you relaying the emailed OTP** while the
   detached session waits at the prompt (`/tmp/atlassian/AWAITING_OTP`). Slowest, needs you present.

**The six pages needed (page ids are confirmed):**
SBC `577634305` · SBR `585629698` · PV `620888066` · TU `641400833` · WIP `703660034` ·
IV `720142338`.

---

## 3 · WHAT WAS ESTABLISHED ANYWAY, FROM LOCAL + TESTRAIL EVIDENCE (no Confluence needed)

Both columns below are **evidence-backed**; the LIVE column is the one Confluence owes us.
"Body held" = a spec body actually exported to disk. "Cited" = the version the live TestRail cases
name in their Rule-54 provenance line (read from all 509 cases this pass, fully paged).

| Report | Body HELD on disk (source-sync 2026-08-13 evidence XMLs) | Version CITED by our live cases (n) | LIVE version today |
|---|---|---|---|
| Inventory Value | **v6** (`Inventory-Value-v6.xml`) | **10** (69/69) | **UNKNOWN — blocked.** Measured **v10** on 2026-08-21 |
| Parts Velocity | **v8** (`Parts-Velocity-v8.xml`) | **10** (71/72; 1 cites none) | UNKNOWN — blocked |
| Technician Utilization | **v9** (`Technician-Utilization-v9.xml`) | **9** (61/61) | UNKNOWN — blocked |
| Sales By Customer | **v20** (`Sales-By-Customer-v20.xml`) | **20** (96/96) | UNKNOWN — blocked |
| Sales By Representative | **v22** (`Sales-By-Representative-v22.xml`) | **22** (118/118) | UNKNOWN — blocked |
| WIP | **v15** (`...v15` set, 2026-08-13) | **MIXED: 22 (60) · 24 (13) · 21 (9) · none (11)** | UNKNOWN — blocked |

### Three findings that do not depend on Confluence

- **🔴 CORRECTION TO CLAUDE.md §3 AND REGISTER ROW R3.** Both say Inventory Value is *"v10 live vs
  **our v5**"*. **Our v5 is stale bookkeeping**: the 2026-08-13 source sync fetched and stored
  **IV v6**, and **all 69 IV cases cite version 10**. So the gap is **at most v6 → v10 on the body**,
  not v5 → v10 — and the *cases* already name v10.
- **🔴 A CITED-BUT-NOT-INGESTED GAP — this is the real tester risk.** IV and PV cases cite **v10**
  while the newest body we hold is **v6 / v8**. A version pin is **not** evidence the requirements
  were re-read (Rule 54 honesty; the `spec-deltas-2026-08-19` pass explicitly barred stamping a
  version onto content known to be stale). **Up to 140 cases (69 IV + 71 PV) claim currency against a
  spec version nobody has diffed.** That cannot be resolved without the live bodies.
- **🟠 WIP IS INTERNALLY INCONSISTENT — 93 cases naming four different states** (v22 ×60, v24 ×13,
  v21 ×9, no version ×11). Whatever the live version turns out to be, at least three of those four
  groups are wrong. This is fixable **only** with the live WIP page.

**None of this is a coverage verdict.** Rule 43 verdicts and the tester-impact list require the
current requirement text, which is exactly what is blocked.

---

## 4 · WHAT WAS NOT DONE, AND WHAT IT WILL COST ONCE ACCESS EXISTS

Not done: any spec-body fetch, any diff, any per-requirement coverage verdict, any tester-impact
list, for **any** of the six. Nothing was guessed or inferred to fill the gap (Rule 12).

Estimate once one of the three access paths exists (bodies fetched to FILES, diffed by script,
summaries only ever read):

| Report | Cases | Held→live delta expected | Effort |
|---|---|---|---|
| Inventory Value | 69 | v6→v10, 4 versions | ~1 pass |
| Parts Velocity | 72 | v8→v10+, 2+ versions | ~1 pass |
| WIP | 93 | v15→v24+, and 4-way internal inconsistency | **~2 passes — the worst** |
| Sales By Representative | 118 | v22→? | ~1–1.5 passes |
| Sales By Customer | 96 | v20→? | ~1–1.5 passes |
| Technician Utilization | 61 | v9→? | ~1 pass |

Roughly **7–8 report-passes of work**, checkpoint-committed one report at a time, in the risk order
**IV → PV → WIP → SBR → SBC → TU**. **No TestRail write is included** — the output is a per-case
update list that stops at the button (Rule 6).

---

## OUTSTANDING — what I need from you

1. **One of the three access paths in §2** (reconnecting the Atlassian MCP server is the cheapest).
   Until then the six-report source verification cannot start.
2. **A decision on the cited-but-not-ingested gap** — do the ~140 IV/PV cases keep their "version 10"
   provenance while blocked, or should the pin be corrected to the version we can actually prove?
   Correcting it is a TestRail write and needs your go-ahead.
3. **Register rows R3 and R5 and the CLAUDE.md §3 "our v5" figure need correcting** to v6/cited-10 per
   §3 above. Say the word and I will edit them.
