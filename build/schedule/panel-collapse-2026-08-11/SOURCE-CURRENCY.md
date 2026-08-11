# Schedule §5.3 Panel collapse — SOURCE CURRENCY (Standing Rule 31) — 2026-08-11

| | |
|---|---|
| **Sources read at pass start** | **2026-08-11 02:36Z** (build) · **03:14Z** (specification, epic) |
| **Sources RE-READ immediately before the writes began** | **2026-08-11 03:27Z** (Rule 59) |
| **Verdict of the second read** | **UNCHANGED.** Confluence still **version 27** (`version.when` 2026-08-07T15:01:20.801Z, byte-identical). Build still **`v3.5-af3a6e1`**, `index.html` **sha256 `3cb182af…` identical to the reading taken 51 minutes earlier**. Nothing this pass concluded rests on a source that moved while it was being written. |

---

## The five sources, per Rule 31

| # | Source | Identifier | Version / last-updated | Checked | Verdict |
|---|---|---|---|---|---|
| **A** | **The specification** | Confluence page **713031682** "Schedule" | **Confluence version 27**, `version.when` **2026-08-07T15:01:20.801Z**, by **Branko Cicovic**, version comment *"Add §5.3 Panel collapse; toolbar row and cross-references"* | 2026-08-11 | **CURRENT.** Read live over `/wiki/rest/api/content/713031682?expand=body.storage,version` (HTTP 200). §5.3, §6 and §3.1 extracted from the live body and **byte-compared against the verbatim text in `coverage-rederivation-2026-08-10/SPEC-DIFF.md` — identical**. |
| **B** | **The build** | `https://sv8685.qa.shopview.com` | **`v3.5-af3a6e1`**, `index.html` last-modified **Mon 10 Aug 2026 21:59:27 GMT**, etag `0708dbc8bc1fe805e835a2f86d05abfb`, sha256 `3cb182afbddefdaa4497c83daf5858d9d244fa3d26a746b86e250463c357cc09` | 2026-08-11, read at **02:36Z** and **03:27Z**, **byte-identical** | **CURRENT — and it has MOVED since every other Schedule verdict was taken.** The 168 pre-existing cases carry `v3.5-d122eef` (78) and `v3.5-7ec992f` (90); **neither exists any more.** Under Rule 60 that is the ordinary consequence of a branch never declared final, not an alarm. |
| **C** | **The epic and its stories** | Jira epic **SV-8685**, story **SV-8686** *Schedule Grid Layout & Navigation* | not re-enumerated this pass | 2026-08-11 | **CARRIED, and labelled as carried.** The owning story for §5.3 was established by the 2026-08-10 map (`GAPS.md` G1) and is used only to fill the `refs` field. **A Tier-1 epic currency check was NOT run this pass** (Rule 37) — no conclusion here depends on the child set. |
| **D** | **The designs** | Claude prototype `Schedule.dc.html`; the Fabian / Sasha design review of 5 August | prototype: **no version, no date**; review: **2026-08-05** | 2026-08-11 | **PARTIAL — unchanged and material.** §5.3 describes a *"panel-left icon"* and a specific left-gutter alignment, which is exactly the kind of thing a design pins. We hold no dated design for it. **This is why expected item 4 of SCH-PANEL-01 asserts the observable form of *"secondary text color"* rather than a token name** — see the honesty note in `NEW-CASES.md`. |
| **E** | **The engineering tech plan** | `build/schedule/tech-plan-2026-07-29/TechPlan-Schedule-Module-Rewrite.md` | **2026-07-29**, as supplied | 2026-08-11 | **PARTIAL — no newer version supplied and no way to fetch one.** It does not mention panel collapse; nothing in this pass rests on it. |
| **F** | **PO / stakeholder answers** | Branko's recorded answers; the 6 August question sheet; the 5 August design review | 6 August sheet **written and STILL NOT SENT** | 2026-08-11 | **CURRENT as a record — and the one item that bears on this pass is unanswered.** Item **S-2** (session-scoped vs across-sessions) is the open question cited on **SCH-PANEL-06 = C43587**. See `QUESTIONS-FOR-BRANKO.md`. |

---

## Trap (a), confirmed again on this page

The page body's own header table still reads **`Version | 1.0`** and **`Last Updated | July 15, 2026`**.
**The page is at Confluence version 27.** Only the Confluence version integer is a reliable currency
marker for this page, and it is the one every statement here and every new case's provenance line
cites.

## Trap (c) — the requirement's own date, not the page's

`Panel collapse`, `panel-left icon`, `Hide panel`, `Show panel`, `State preservation` and
`Session-scoped per user for build` were each dated against all 27 historical bodies by the
2026-08-10 pass (`coverage-rederivation-2026-08-10/evidence/string-dating-all-27-versions.json`) and
**every one first appears in v27**. So §5.3 is genuinely four days old, not a rediscovery of something
long-standing — **and this gap is therefore new, not a long-running miss.** That dating was carried,
not re-run; the strings themselves were re-read live and match.

## How Confluence was reached, stated plainly

The reusable fetcher `coverage-rederivation-2026-08-10/tools/fetch_spec.py` reads a cookie jar at
`/tmp/atlassian/cookies.json`, and `/tmp` is ephemeral. That jar **survived from an earlier session**
and still authenticates, so the live read succeeded. **An anonymous read returns HTTP 403
`"Current user not permitted to use Confluence"`** — so if that jar expires, the live spec check is
not possible from this container and the correct response is to stop and ask for access rather than
work off the mirror (Rule 31). Recorded because the next session will hit it.
