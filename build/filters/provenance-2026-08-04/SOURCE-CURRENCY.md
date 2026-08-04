# Filters — SOURCE-CURRENCY block (Standing Rule 31 pre-flight)

**Pass:** Standing Rule 54 provenance-line retrofit · **date checked 2026-08-04**

| # | Source | Identifier | Version / last-updated (LIVE) | Our baseline | Verdict |
|---|---|---|---|---|---|
| 1 | Spec | Confluence page **572030978** "Filters" | **Confluence version 14**, 2026-07-31T13:10:34.788Z, Branko Cicovic. Body "Version:" line = **1.6** | mirror `spec-current-2026-07-31/Filters-spec-current.md` = Confluence **v12** | **CURRENT for requirement text** — see the delta below |
| 2 | Epic + child stories | **SV-8785 "Filters"** (Epic, hierarchy 1, status Open) | created 2026-07-31T07:51:51-0500, updated 2026-07-31T08:07:04-0500; **14 children SV-8786→SV-8799** | **we recorded "NO epic exists"** | **STALE — CORRECTED THIS PASS** |
| 3 | Designs | Figma `DR4gEODShYgJqkozs3mF5q` | 73/85 boards fetched | Rule-35 queue `design-2026-07-31/PENDING-FIGMA-FETCH.md` | **PARTIAL — 12 of 85 boards still unfetched; queue OPEN** |
| 4 | Tech plan | `tech-plan-2026-07-29/` | ingested 2026-07-29 | same | CURRENT |
| 5 | PO answers | `branko-answers-2026-07-17/`, `branko-answers-round2-2026-07-20/`, `branko-answers-techplan-2026-07-31/`, `branko-answers-2026-07-31/` | latest 2026-07-31 | same | CURRENT |

## FINDING 1 (spec) — v12 → v14 changed NO requirement text

Live fetch: `GET /wiki/rest/api/content/572030978?expand=body.storage,version,history.lastUpdated`
→ HTTP 200, body **73,403 chars**, Confluence version **14**.

Two new versions landed **after** our 2026-07-31 pull (which captured v12):

| v | when (UTC) | comment |
|---|---|---|
| 13 | 2026-07-31T13:07:03.634Z | *(none)* |
| 14 | 2026-07-31T13:10:34.788Z | *(none)* |

**A full body diff of v12 vs v14 (tags stripped, whitespace-normalised) yields exactly
22 diff lines, ALL of them in the header link block:**

- four raw Figma URLs re-rendered as titled smart links (`Feature Design`,
  `Parts Filters Design`, `Reports Filters Design`, `Search Component Design`)
- **ADDED: `Jira epic: SV-8785`** (a Jira smart-link macro)

**Requirement text is UNCHANGED.** Proven by set equality, both directions, on the
requirement-anchor population:

```
filters: live anchors 131 · mirror anchors 131
  in LIVE not in MIRROR: none
  in MIRROR not in LIVE: none
  SET EQUAL BOTH WAYS: True
```

The body's own `Version:` line still reads **1.6**, so the spec-version constant used in
the provenance line is **1.6** — correct and unchanged. (Rule 31's staleness trap in
reverse: the Confluence version moved, the spec version legitimately did not, because
nothing normative changed.)

## FINDING 2 (epic) — Filters NOW HAS A JIRA EPIC: SV-8785

This is a **material correction to project memory.** CLAUDE.md and
`PROJECT-STATE.md` both record that Filters has **no** Jira epic, "proven by
enumerating all 170 SV epics" on 2026-07-31.

**That finding was true when it was made and is now stale.** The epic was created
**2026-07-31T07:51:51-0500 = 12:51 UTC**, and Branko linked it into the spec at 13:07 /
13:10 UTC — after our enumeration ran that morning.

Live verification (`GET /rest/api/3/issue/SV-8785`) → HTTP 200:

| Field | Value |
|---|---|
| summary | **Filters** |
| issuetype | **Epic** (hierarchy level 1) |
| status | Open |
| created | 2026-07-31T07:51:51.093-0500 |

**Tier-1 currency check (Rule 37) — child set verified two independent ways, no paging
remainder:** `parent = SV-8785` → **14**; `"Epic Link" = SV-8785` → **14**. Same 14 keys.

The 14 stories map **1:1, by title and in order,** onto the spec's 14 stories:

| Spec story | Epic key | Story summary | Status |
|---|---|---|---|
| Story 1 | SV-8786 | Filter Bar Layout & Visibility | Open |
| Story 2 | SV-8787 | Status Filter | Open |
| Story 3 | SV-8788 | Customer Filter | Open |
| Story 4 | SV-8789 | Lead Technician Filter | Open |
| Story 5 | SV-8790 | Service Advisor Filter | Open |
| Story 6 | SV-8791 | Asset on Site Filter | Open |
| Story 7 | SV-8792 | Active Filter Chip Appearance | Open |
| Story 8 | SV-8793 | Clearing Filters & Empty State | Open |
| Story 9 | SV-8794 | Tab Behaviour with Active Filters | Open |
| Story 10 | SV-8795 | Filter Persistence | **Ready for QA** |
| Story 11 | SV-8796 | URL State & Shareable Links | **Ready for QA** |
| Story 12 | SV-8797 | Mobile Filter Bar | Open |
| Story 13 | SV-8798 | Page Search | Open |
| Story 14 | SV-8799 | Remove Page Filtering from Global Search | Open |

So `Story n → SV-(8785 + n)`, deterministically.

### Consequences applied in this pass

1. **The provenance line names epic SV-8785.** The shape the coordinator specified —
   *"There is no Jira epic for this project yet."* — would now be a **false statement in
   tester-facing text**, and Rule 54's honesty clause is explicit that a provenance line
   asserting a source that does not hold is worse than none. So Filters gets the same
   two-source shape as Schedule.
2. **`refs` "Filters (no Jira epic)" is corrected in the same write.** Every one of the
   110 cases carries the literal string `Filters (no Jira epic)` in its References field.
   Leaving it while the Expected Results names SV-8785 would make each case contradict
   itself (a Rule-28 cross-case contradiction, introduced by us). It is replaced with the
   owning story key, giving Filters **Rule-20 ticket traceability for the first time**:
   - **66 cases** cite exactly ONE spec story → that story's key
   - **34 cases** cite TWO or THREE stories → cross-cutting → the epic key **SV-8785**
   - **10 cases** cite no `S<n>-R<n>` anchor at all (Parts / Reports / §-level) →
     **SV-8785**, stated as cross-cutting
3. **Two stories are Ready for QA (SV-8795 Filter Persistence, SV-8796 URL State).**
   Recorded as an outstanding item: it is the first sign a QA environment may be near for
   Filters. It does **not** make anything live-verified — no build has been observed, so
   every case stays at provenance **state 1** (no build date).

### Still OPEN (Rule 35)

`build/filters/design-2026-07-31/PENDING-FIGMA-FETCH.md` — 12 of 85 boards unfetched.
The design source is therefore **PARTIAL**, and this pass does not claim otherwise.
No case in this pass rests on an unfetched board.
