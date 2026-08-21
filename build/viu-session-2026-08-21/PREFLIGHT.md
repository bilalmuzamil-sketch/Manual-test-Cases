# VIU LANE — SESSION-START PREFLIGHT, 2026-08-21

**Lane:** VIU (handoff 3). **Branch:** `claude/slack-session-0sxnd9` (checked out, fast-forwarded
clean from `origin`, HEAD `1920deea`). **No project named yet by the QA lead — Rule 2 ask is open.**
**Zero writes performed:** 0 TestRail, 0 Jira, 0 application driving, 0 lock claimed.

## Read, in the ordered sequence (Rule 88 — nothing bulk-read)

`build/handoffs/HANDOFF-3-VIU.md` (full) · `build/skills/12-VIU.md` (full — thin router) ·
`build/skills/00-COMMON-CORE.md` (CONTENTS + §0 + §1 + §14 + §15 + §16.0/16.1 + §17 + appendix;
132 KB, so read by section per Rule 88, not end-to-end) · `build/skills/13-CROSS-SESSION-SAFETY.md`
(full) · `build/skills/14-ACCESS-RESILIENCE.md` (full) · `build/PROJECT-INDEX-REFRESH-2026-08-21.md`
(full) · `build/OUTSTANDING-ITEMS-REGISTER.md` head (grep/head only — 452 KB).

## §0 access preflight (Rule 89 §0) — all timestamps UTC 2026-08-21

| System | Path used | Verdict | Detail |
|---|---|---|---|
| Secret scanner | `make_secret_fingerprints.py` | **STRUCTURAL-ONLY** | 0 credential files in `/tmp` ⇒ 0 fingerprints. `--selftest` **ALL PASSED**. `pre-commit` hook installed this container. |
| TestRail | REST v2, unauthenticated probe | **REACHABLE / NO CREDENTIALS** | `get_case/1` → **HTTP 401**. `/tmp/testrail/creds.json` **absent** (fresh container). Core §17 says ASK for it by that path-name. |
| Jira | Atlassian MCP `getJiraIssue` | **PASS** | SV-8785 → HTTP 200, Epic "Filters", status Open, updated **2026-08-14T09:54:12-05:00**. cloudId `19fdd96d-…4e63`. |
| Confluence | Atlassian MCP (same estate) | **PASS for search; version integers still costly** | register **R3** stands — the only version-bearing call returns the whole page body. |
| ShopView — staging | unauth `GET /index.html` 05:58Z | **PASS** | `v3.10-49b5fe3` · last-mod Thu 20 Aug 2026 14:25:38 GMT · etag `7d2ccef0fe56bf88a0c14b30a063d09a` · sha256 `bed393b44321a7b9…` |
| ShopView — `sv8685` (Schedule) | unauth `GET /index.html` 05:58Z | **PASS** | `v3.8-bc7508a` · last-mod Tue 18 Aug 2026 08:52:42 GMT · etag `cae721e3195a314b25bf9e6b26477246` · sha256 `e21bf8213d52812d…` |
| ShopView — `sv8785` (Filters) | unauth `GET /index.html` 05:58Z | **PASS** | `v3.7-6e2d301` · last-mod Tue 18 Aug 2026 12:33:36 GMT · etag `81b49881d0d38f64898c179dc29ff4d8` · sha256 `537690ae19f77083…` |
| ShopView — `sv8582` (Report Suite) | unauth `GET /index.html` ×3 | **FAIL — HTTP 502** | CONNECT tunnel failed, **0 bytes**, three attempts. Register **R4**. |
| ShopView — authenticated surface | — | **BLOCKED** | no `sv_sso_session` / `PHPSESSID` / `cf_clearance` in `/tmp`. Register **R1**. |
| Figma | MCP `whoami` | **PASS** | handle Bilal Muzamil, plan `team::1570887137799529764`, seat **View**. REST fallback token `/tmp/figma-token` **absent**. |

### 🛑 A FALSE READING CAUGHT AND DISCARDED — recorded so nobody repeats it
The first `sv8582` probe appeared to return `app-version v3.7-6e2d301`. **It did not.** The 502 is
raised at the proxy **CONNECT** stage, so curl wrote **no body** and the output file still held the
previous host's (`sv8785`) bytes — identical sha256 `537690ae19f77083…` proves it. Re-probed with a
freshly deleted file: **HTTP 502, 0 bytes, ×3.** `sv8582`'s build marker is **UNVERIFIED**, not
`v3.7-6e2d301`. *(Rule 12: a reading whose provenance is a stale buffer is not an observation.)*

## Standing queue checks

- **Rule 35 (Figma):** `build/filters/design-2026-07-31/PENDING-FIGMA-FETCH.md` — **CLOSED 85/85**
  at 2026-07-31T08:58:40Z. No DUE-AT armed, nothing to retry.
- **Rule 49 (re-check queues):** **18 queue files; 10 carry OPEN**, 1 CLOSED (Schedule
  `recheck-2026-08-05`), 7 have no status token on the first match. Under core §16.0 an OPEN queue is
  again the ordinary steady state, not a failure.
- **Rule 83 (locks):** `build/LOCKS/` holds **only `README.md`** — no live foreign claim on any
  project. **Nothing claimed by this session**; a claim will be written, committed and pushed before
  any first write, once a project and a go-ahead exist.
- **Rule 62 (Jira creation hold):** **STILL ACTIVE, NOT LIFTED** — register row **FR20-7**, dated
  2026-08-10, restated in the 2026-08-20 block. Nothing created.

## 🔴 A CORRECTION OWED TO `CLAUDE.md` §3 AND TO THIS MORNING'S OWN REFRESH

`CLAUDE.md` §3 and `build/PROJECT-INDEX-REFRESH-2026-08-21.md` §3/§5 both give the **source**
baseline as **2026-08-11** for Report Suite and Schedule. **That is stale by six days.** A whole-case
currency pass ran on **2026-08-17** for all three projects and re-pinned live-fetched versions:

| Project | Pass | Live spec version(s) established 2026-08-17 | Cases touched |
|---|---|---|---|
| Filters | `build/filters/currency-2026-08-17/` | Confluence **v21** | 124 re-stamped v19 → v21 |
| Schedule | `build/schedule/currency-2026-08-17/` | Confluence **v30** (not v27) | 148 touched · 47 already current |
| Report Suite | `build/report-suite/currency-2026-08-17/` | SBC **v20** · SBR **v22** · PV **v10** · TU **v9** · WIP **v21** · IV **v10** | 423 of 507 |

Later source work on top: Filters **SV-9279** reconciliation **2026-08-18**; Report Suite WIP **v22**
mirror 2026-08-18 and **v24** reconciliation 2026-08-19; PV + WIP spec-delta 2026-08-19/20.
**So the refresh's own §3 "our recorded baseline" column understated every active project**, which
changes the source badges from 🟠 to ✅ — while leaving §3's substantive finding untouched: the pages
**moved again on 2026-08-20** and that movement is **uningested**.

## Rule-91 badges recomputed with `--today 2026-08-21` (tool `--selftest`: PASSED)

| Project | Build badge | Source badge | Last **full VIU** |
|---|---|---|---|
| Filters | ✅ **2026-08-19** (2 d, staging `v3.8-d0e135e`) | ✅ **2026-08-18** (3 d, spec **v21**) — *page moved 2026-08-20, uningested* | 🟠 **2026-08-12** (9 d, `v3.6-3e9dd6d`) |
| Schedule | ✅ **2026-08-20** (1 d, staging `v3.8-d0e135e`) | ✅ **2026-08-17** (4 d, spec **v30**) — *page moved 2026-08-20, uningested* | 🟠 **2026-08-12** (9 d, `v3.5-65d6500`) |
| Report Suite | ✅ **2026-08-20** (1 d, staging `v3.8-d0e135e`) | ✅ **2026-08-17** (4 d, six specs above) — *PV + WIP moved 2026-08-20* | 🟠 **2026-08-12** (9 d, `v3.6-8c28eed`) |
| Global Search | ❌ **never build-verified** (no QA branch; `sv9160` → 502) | 🔴 **2026-07-16** (36 d) — *PRD moved 2026-08-20* | ❌ never |

**Every one of those verdicts is PROVISIONAL (core §16.0 — the branches are NOT final until release
day).** And **staging has since moved to `v3.10-49b5fe3`** (2026-08-20 14:25:38 GMT), so even the
1-day-old build verifications predate the build now running — Rule 60 layers 1 and 2 only; no
expectation is touched, because expectations come from documents (Rule 57).

## Honest limits of this preflight

- **Nothing was observed inside the application.** No cookies ⇒ no authenticated surface.
- **No spec was diffed.** The 2026-08-20 page movements are proven to exist and **not** characterised.
- **No case body was read** — the counts above are quoted from committed evidence, not re-derived
  live, because TestRail credentials are absent. Rule 86 applies: they are claims until re-derived.
