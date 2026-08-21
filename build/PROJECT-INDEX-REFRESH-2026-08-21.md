# PROJECT INDEX refresh — live re-derivation, 2026-08-21

**Why this exists.** The `CLAUDE.md` §3 PROJECT INDEX rows were **carried over** from the previous
CLAUDE.md and had **never been verified against the live systems**. A carried-over number reads
exactly like a measured one, which is the failure Rule 89 exists to stop. Every figure below was
**re-derived live today** or is **explicitly marked unverified with the exact thing needed** (Rule 12).

**Systems reached LIVE this pass:** TestRail API (HTTP 200) · Atlassian MCP — Confluence search +
Jira JQL (HTTP 200) · unauthenticated `index.html` reads on the QA/staging hosts.
**Systems BLOCKED:** the app's authenticated surface (all stored cookies return HTTP 401) · the
Report Suite QA branch host (HTTP 502) · Confluence **version integers** for 12 of 13 spec pages
(cost, see §5).

---

## 1 · TestRail case counts — LIVE, fully paged

Method: `build/testing-tools/tr_client.py` (`get_sections` and `get_cases`, project 1 / suite 1,
**both paged at limit 250** — an unpaged call returns 250 of 627 sections and silently finds zero
project sections, playbook §J). Whole estate read: **627 sections · 4,170 cases · `is_deleted` = 0
on all 4,170**. Counts are the section subtree under each project's group, split by `created_by`
(**we are user id 3**; id 1 = Vladimir Tomovic, id 7 = Ahtasham Amjad — Rule 38 foreign cases).

| Project | Group | Sections | Live TOTAL | Ours (u3) | Foreign | Local `testrail-id-map.csv` | CLAUDE.md said |
|---|---|---|---|---|---|---|---|
| Report Suite | 4281 | 96 | **523** | **509** | 14 (u1) | 508 | 476 |
| Schedule | 4254 | 31 | **195** | **195** | 0 | 195 | 168 |
| Filters | 4110 | 19 | **129** | **124** | 5 (u7) | 124 | 114 |
| Global Search | 4094 | 16 | **86** | **86** | 0 | 86 | "never pushed" |
| Simple Flow | 4058 | 36 | **187** | **185** | 2 (u1) | 189 | — |
| Fees & Discounts | 3894 | 79 | **202** | **200** | 2 (u1) | 203 | — |
| Custom Roles | 3527 | 58 | **714** | **515** | 199 (u1) | none | 254 (historic) |

**Three findings, all against our own record:**

1. **Global Search IS in TestRail.** All **86** cases exist live under group 4094, every one
   `created_by = 3`. CLAUDE.md said *"86 cases authored, never pushed"*. That sentence is false and
   is corrected in the index.
2. **Every active project's case count in CLAUDE.md was low** — Report Suite 476 → **509 ours**,
   Schedule 168 → **195**, Filters 114 → **124**. The local id-maps agree with LIVE (195 = 195,
   124 = 124, 508 ≈ 509), so **CLAUDE.md was stale, not TestRail** — the numbers were quoted from an
   older pass and never re-measured.
3. **Two id-maps disagree with live and the difference is unexplained by this pass**: Simple Flow
   local 189 vs live-ours 185 (**4 more locally**) and Fees & Discounts local 203 vs live-ours 200
   (**3 more locally**). Both are COMPLETED projects, so nothing is blocked; recorded, not resolved.

---

## 2 · Jira epic child counts — LIVE, verified TWO ways

Method: `parent = <epic>` and `"Epic Link" = <epic>`, `searchResultMode: count`. Both ways agree on
every epic and the batched totals reconcile exactly (114 + 368 = 482 = the `parent in (…)` aggregate),
so there is **no paging remainder**.

| Project | Epic | `parent =` | `"Epic Link" =` | Agree | Our last recorded count |
|---|---|---|---|---|---|
| Report Suite | **SV-8582** | **114** | **114** | ✅ | 105 (2026-08-06) → **grew by 9** |
| Schedule | **SV-8685** | **40** | **40** | ✅ | 24 (2026-08-11) → **grew by 16** |
| Filters | **SV-8785** | **34** | **34** | ✅ | 34 (2026-08-18) → unchanged |
| Custom Roles | **SV-7388** | **269** | **269** | ✅ | not recorded |
| Simple Flow | **SV-7301** | **25** | **25** | ✅ | not recorded |
| Global Search | **SV-9160** | **24** | **24** | ✅ | **NO EPIC RECORDED — see below** |
| Fees & Discounts | **SV-7387** | **24** | **24** | ✅ | **NO EPIC RECORDED — see below** |

**Two epic keys that our record said did not exist, and both do:**

* **Global Search = [SV-9160](https://shopview.atlassian.net/browse/SV-9160)** — *"Global Search v2 —
  spotlight search with fuzzy matching, ranking and quick actions"*, **Epic**, status **Open**,
  **created 2026-08-12**, **24 children**. CLAUDE.md carried *"Epic/Jira key: NOT AVAILABLE YET"*.
  It became available nine days ago. **This is the second time a proven-absent epic went stale within
  days** (the first was Filters SV-8785 on 2026-07-31), which is exactly Rule 31's lesson: a
  proven-absence finding has a shelf life — re-check it, never cache it.
  Its description also carries **four open questions** and **two PRD corrections** (the PRD prescribes
  PostgreSQL `pg_trgm`/`levenshtein`/`metaphone` — ShopView is **MySQL on Aurora**; and §10 Phase 3
  says *"a React context"* when the app is **Vue 3 + Quasar**). Not ingested this pass — recorded as
  outstanding.
* **Fees & Discounts = [SV-7387](https://shopview.atlassian.net/browse/SV-7387)** — Epic, status
  **Done**, **24 children**, owner Chris Ward. Project is COMPLETED, so this is a record correction
  only.

---

## 3 · Spec pages — LIVE last-modified (Confluence via Atlassian MCP)

Read with `searchConfluenceUsingCql` (cheap — no page body). **Every project's spec page has moved
since our last recorded source check.**

| Project | Page | Live last modified | Our recorded baseline | Verdict |
|---|---|---|---|---|
| Filters | **572030978** "Filters" | **2026-08-20** (yesterday, 8:58 PM) | Confluence **v21**, checked 2026-08-18 | **MOVED — uningested** |
| Schedule | 713031682 | **2026-08-20** (yesterday, 3:43 PM) | Confluence **v27**, checked 2026-08-11 | **MOVED — uningested** |
| Global Search | 576978945 | **2026-08-20** (yesterday, 10:54 PM) | ingested 2026-07-16 | **MOVED — uningested** |
| Report Suite — SBC | 577634305 | **2026-08-13** | v17 (2026-08-11) | **MOVED** |
| Report Suite — SBR | 585629698 | **2026-08-13** | v18 (2026-08-11) | **MOVED** |
| Report Suite — Parts Velocity | 620888066 | **2026-08-20** | v6 (2026-08-11) | **MOVED** |
| Report Suite — Tech Utilization | 641400833 | **2026-08-13** | v7 (2026-08-11) | **MOVED** |
| Report Suite — WIP | 703660034 | **2026-08-20** | v11 (2026-08-11) | **MOVED** |
| Report Suite — Inventory Value | 720142338 | **2026-08-13** | v5 (2026-08-11) | **MOVED — now Confluence v10 (measured)** |
| Simple Flow | 646021121 | 2026-07-16 | V2.6, ingested 2026-07-17 | unchanged |
| Fees & Discounts | 622297094 | 2026-07-14 | V1_3, 2026-07-17 | unchanged |
| Custom Roles | 565116952 | 2026-07-17 | 2026-07-27 | unchanged |

**THE FILTERS SPEC PAGE ID IS NOW KNOWN: `572030978`**, space `SHOPVIEW`, URL
`https://shopview.atlassian.net/wiki/spaces/shopviewapp/pages/572030978/Filters`. CLAUDE.md and
`build/filters/PROJECT-STATE.md` have carried *"canonical spec URL: TO CONFIRM"* since 2026-07-16.
Its in-body field reads **"Version: 1.8"** — the Rule-31(a) trap; the real Confluence integer was
**21** at our last check and has since moved.

**One version integer was measured: Inventory Value = Confluence version 10** (our baseline: v5).
Its change log carries **2026-08-12** and **2026-08-13** entries we have never ingested (a suite-wide
CSV filter-summary rule `S10-R15a`, the export size-cap re-wording, and the replacement of the
date-range control by a single "as of" date). **If one of six report specs is five versions ahead,
the other five must be assumed to have moved too until diffed.**

---

## 4 · Build markers — LIVE `index.html` reads (unauthenticated)

| Host | HTTP | `app-version` | last-modified | etag |
|---|---|---|---|---|
| `app.staging.shopview.com` | 200 | **v3.10-49b5fe3** | Thu 20 Aug 2026 14:25:38 GMT | `7d2ccef0fe56bf88a0c14b30a063d09a` |
| `sv8685.qa.shopview.com` (Schedule) | 200 | v3.8-bc7508a | Tue 18 Aug 2026 08:52:42 GMT | `cae721e3195a314b25bf9e6b26477246` |
| `sv8785.qa.shopview.com` (Filters) | 200 | v3.7-6e2d301 | Tue 18 Aug 2026 12:33:36 GMT | `81b49881d0d38f64898c179dc29ff4d8` |
| `sv7301.qa.shopview.com` (Simple Flow) | 200 | v2.320-44e5b70 | Fri 17 Jul 2026 12:18:49 GMT | `3f42781e7911ba581116917f75189674` |
| `qb.qa.shopview.com` (Fees & Discounts) | 200 | v3.1-4eaa076 | Mon 03 Aug 2026 10:15:32 GMT | `792ca733c188fb9a22674f5bde5e8402` |
| `sv8582.qa.shopview.com` (Report Suite) | **502 ×3** | **unverified 2026-08-21** | — | — |
| `sv9160.qa.shopview.com` (Global Search) | **502** | **no QA branch** | — | — |

**The active three are verified on STAGING, not on their own QA branches.** The newest evidence
(`build/{report-suite,schedule}/staging-verify-2026-08-20/`, `build/filters/build-verify-2026-08-19/`)
records **`v3.8-d0e135e`**, last-mod Wed 19 Aug 2026 13:27:07 GMT, on `app.staging.shopview.com`.
**Staging is now `v3.10-49b5fe3`, so even yesterday's verifications predate the build now running** —
under Rule 60 that is the ordinary consequence of a branch that is never declared final (layer 1
labels + layer 2 verdicts go stale; expectations do not, because they come from documents).

---

## 5 · Rule-91 badges (`--today 2026-08-21`, thresholds ≤7 GREEN · 8–14 ORANGE · >14 RED · never ✕)

Computed with `build/testing-tools/verification_badge.py`'s own `badge_for_age`, not by hand
(`--selftest` re-run today: **PASSED**).

| Project | Build badge | Source badge | Basis |
|---|---|---|---|
| Report Suite | ✅ GREEN (1 d) | 🟠 ORANGE (10 d) | build 2026-08-20 · source 2026-08-11 |
| Schedule | ✅ GREEN (1 d) | 🟠 ORANGE (10 d) | build 2026-08-20 · source 2026-08-11 |
| Filters | ✅ GREEN (2 d) | ✅ GREEN (3 d) | build 2026-08-19 · source 2026-08-18 |
| Global Search | ❌ CROSS (never) | 🔴 RED (36 d) | never build-verified · source 2026-07-16 |
| Simple Flow | 🔴 RED (23 d) | 🔴 RED (35 d) | build 2026-07-29 · source 2026-07-17 |
| Fees & Discounts | 🔴 RED (30 d) | 🔴 RED (32 d) | build 2026-07-22 · source 2026-07-20 |
| Custom Roles | 🔴 RED (25 d) | 🔴 RED (25 d) | both 2026-07-27 |

**The badge is a date arithmetic, not a judgement — read it with §3.** Filters shows a GREEN source
badge because its last *check* was 3 days ago; the live read today proves its spec **moved
yesterday**, so the badge is fresh and the source is nonetheless behind. **A GREEN badge is not a
statement that the source is current** (this is the honest limit of Rule 91 and is stated in the
index row too).

---

## 6 · What was BLOCKED, and exactly what each needs

| Blocked | Evidence | File |
|---|---|---|
| The app's authenticated surface (all projects) | stored cookie → `GET /api/auth/me/fe-permissions` **HTTP 401** | `build/BLOCKED-shopview-app-session.md` |
| Report Suite QA branch host | `sv8582.qa.shopview.com/index.html` → **HTTP 502**, three attempts | `build/BLOCKED-qa-branch-sv8582.md` |
| Confluence version integers, 12 of 13 pages | the only version-bearing MCP call returns the whole page body (~8k tokens each) | `build/BLOCKED-confluence-version-integers.md` |
| Global Search build verification | no QA branch host; feature not deployed anywhere we can reach | `build/BLOCKED-global-search-build.md` |

Each has a row in `build/OUTSTANDING-ITEMS-REGISTER.md`.

---

## 7 · Honest limits of this pass

* **No spec was DIFFED.** §3 proves the pages moved; it does not say what changed. Per-requirement
  reconciliation (Rule 43) is not done and is not claimed.
* **No case was opened, edited or verdicted.** Zero TestRail writes, zero Jira writes, zero
  application driving. Everything here is a read.
* **The 12 unread version integers** mean §3's "MOVED" verdicts rest on `lastModified` dates, which
  is sufficient to prove movement but not to name the version to pin in `refs` (Rule 42).
* **The two id-map/live mismatches** (Simple Flow 189 vs 185, Fees & Discounts 203 vs 200) are
  reported, not investigated.
* **Custom Roles has no `testrail-id-map.csv`**, so its 515 ours-cases cannot be reconciled against a
  local source at all; the 714 live total is measured, the split into current scope is not.
