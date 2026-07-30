# Schedule — TestRail sync MANIFEST (closing authenticity pass, 2026-07-31)

**STATUS: EXECUTED 2026-07-31** — 84/84 `update_case` HTTP 200 + re-GET MATCH, 0 failures.
Audit log: `testrail-execution-log-2026-07-31.md`.

## SOURCE-CURRENCY BLOCK (Rule 31)

| Source | Identifier | Version / last-updated | Checked | Verdict |
|---|---|---|---|---|
| Spec | Confluence page **713031682** "Schedule" | **version 23**, 2026-07-30T10:40:32Z by Branko Cicovic | 2026-07-31, live `GET /wiki/rest/api/content/...?expand=version` → HTTP 200 | **CURRENT** — equals our `requirements.md` baseline |
| Epic + child stories | **SV-8685** + SV-8686..SV-8700 | **15 children, all `Open`**; newest child `updated` = 2026-07-27, i.e. *older* than our 2026-07-28 ingest | 2026-07-31, live `GET /rest/api/3/search/jql?jql=parent=SV-8685` → HTTP 200 (auth Bilal Muzamil) | **CURRENT** — 0 new / 0 removed / 0 renamed / 0 status changes |
| Designs | none for Schedule (spec-only project, user-confirmed 2026-07-21); Claude prototype `Schedule.dc.html` is the authoritative stand-in (Branko Q0) | `spec-v1-2026-07-22/design-notes-claude.md` | 2026-07-31 | **CURRENT** — no Figma file exists, so no Rule-35 fetch queue is open |
| Engineering tech plan | `build/schedule/tech-plan-2026-07-29/` | supplied 2026-07-30, reconciled 2026-07-30 | 2026-07-31 | **CURRENT** |
| PO / stakeholder answers | Branko, 6 answers | `branko-answers-2026-07-31/answers-ingested.md` (2026-07-31, newest product source) | 2026-07-31 | **CURRENT** — all folded in; nothing newer |

**No source is STALE. No source is PARTIAL.**

## Authorization + scope guard

- Authorized by the user's 2026-07-31 closing-authenticity directive, relayed in this task.
- **Scope: group 4254 only, run 357 only.**
- **0** `add_case` · **0** `delete_case` · **0** `add_section` · **0** result writes.
- Pre-write `get_case` snapshot for every case → `pre-push-snapshot/`.
- Each `update_case` re-GET verified field-by-field; the run **stops on any non-200 or MISMATCH**.
- Executor: `exec_sync_authenticity_2026-07-31.py` (`--dry` / `--exec`).

## ⚠️ FINDING FIRST — 16 cases were reformatted to HTML in TestRail by another actor

The pre-write diff showed **48 body-field differences across 16 cases that this pass never
touched**. Cause: those 16 cases' Preconditions / Steps / Expected have been converted **in
TestRail** into HTML ordered lists (`<ol><li>…</li></ol>`), while our local mirror holds the
plain `1. 2. 3.` convention. **The CONTENT is identical** — verified by normalizing markup away
and comparing: 48 / 48 are **markup-only**, 0 are content differences.

Affected (16): SCH-BLOCK-01 · SCH-COLOR-01 · SCH-CONF-01 · SCH-DEL-01 · SCH-DND-01 ·
SCH-MCAL-01 · SCH-MODAL-01 · SCH-NAV-04 · SCH-NAV-06 · SCH-NAV-07 · SCH-PERM-01 ·
SCH-REAS-01 · SCH-START-01 · SCH-TIP-01 · SCH-TOOL-01 · SCH-WOL-01.

**Decision: do NOT touch those body fields.** Pushing our plain-text version would silently
**revert another actor's formatting**, which is outside this task's scope. The executor therefore
sends **PARTIAL payloads** — only the fields this pass actually changed — and a markup-only
difference is treated as *no change* and never written. Consequence: **3 cases drop out of the
push entirely** (SCH-COLOR-01, SCH-MCAL-01, SCH-TOOL-01 — markup-only, nothing else changed),
taking the plan from 87 candidate cases to **84**. **Flagged for the coordinator, not resolved
unilaterally:** local and live now differ in markup for those 16, so any future *full-body* push
would revert them.

## The write plan — 84 `update_case`, 91 field changes

| Field | Cases | Source phase |
|---|---|---|
| `title` | **73** | Phase 2 — over-length titles trimmed to ≤80 |
| `refs` | **17** | Phase 1 — 2 per-story precision repairs + 15 epic cross-cutting statements |
| `custom_expected` | **1** | Phase 3 — contradiction X7 (SCH-CONF-02) |
| `custom_preconds` / `custom_steps` | **0** | — (markup-only diffs suppressed) |

### Per-case

| # | Case | TestRail | Fields |
|---|---|---|---|
| 1 | SCH-API-01 | C38872 | `refs` |
| 2 | SCH-API-03 | C38874 | `refs` |
| 3 | SCH-API-04 | C38875 | `refs` |
| 4 | SCH-BLOCK-01 | C29991 | `title` |
| 5 | SCH-BLOCK-02 | C29992 | `title` |
| 6 | SCH-BLOCK-05 | C29995 | `title` |
| 7 | SCH-CAP-02 | C30031 | `title` |
| 8 | SCH-CAP-03 | C30032 | `title` |
| 9 | SCH-CAP-04 | C30033 | `title` |
| 10 | SCH-CONF-01 | C30023 | `title` |
| 11 | SCH-CONF-02 | C30024 | `title`, `custom_expected` |
| 12 | SCH-CONF-05 | C30027 | `title` |
| 13 | SCH-CONF-07 | C30029 | `title` |
| 14 | SCH-DAY-03 | C30003 | `title` |
| 15 | SCH-DAY-04 | C30004 | `title` |
| 16 | SCH-DEL-01 | C30057 | `title` |
| 17 | SCH-DEL-02 | C30058 | `title` |
| 18 | SCH-DEL-03 | C30059 | `title` |
| 19 | SCH-DEL-05 | C30061 | `title` |
| 20 | SCH-DND-01 | C29955 | `title` |
| 21 | SCH-DND-03 | C29957 | `title` |
| 22 | SCH-DND-04 | C29958 | `title` |
| 23 | SCH-DND-05 | C29959 | `title` |
| 24 | SCH-DND-06 | C29960 | `title` |
| 25 | SCH-DND-07 | C29961 | `title` |
| 26 | SCH-EDGE-02 | C30086 | `title`, `refs` |
| 27 | SCH-EDGE-03 | C30087 | `refs` |
| 28 | SCH-EDGE-04 | C30088 | `title` |
| 29 | SCH-EDGE-06 | C30090 | `title` |
| 30 | SCH-EVT-06 | C30021 | `title` |
| 31 | SCH-EVT-07 | C30022 | `title` |
| 32 | SCH-LANE-03 | C29998 | `title` |
| 33 | SCH-LINE-03 | C29950 | `title` |
| 34 | SCH-LINE-04 | C29951 | `title` |
| 35 | SCH-LINE-07 | C29954 | `title` |
| 36 | SCH-MCAL-02 | C29933 | `title` |
| 37 | SCH-MCAL-04 | C29935 | `title` |
| 38 | SCH-MODAL-01 | C30008 | `title` |
| 39 | SCH-MODAL-04 | C30011 | `title` |
| 40 | SCH-NAV-04 | C29928 | `title` |
| 41 | SCH-NAV-05 | C29929 | `title` |
| 42 | SCH-NAV-06 | C29930 | `title` |
| 43 | SCH-NAV-07 | C29931 | `title` |
| 44 | SCH-PERM-01 | C30074 | `title`, `refs` |
| 45 | SCH-PERM-02 | C30075 | `refs` |
| 46 | SCH-PERM-03 | C30076 | `refs` |
| 47 | SCH-PERM-04 | C30077 | `refs` |
| 48 | SCH-PERM-05 | C30078 | `title`, `refs` |
| 49 | SCH-PERM-06 | C30079 | `title`, `refs` |
| 50 | SCH-PERM-07 | C30080 | `title`, `refs` |
| 51 | SCH-PERM-08 | C30081 | `title` |
| 52 | SCH-PERM-09 | C30082 | `title`, `refs` |
| 53 | SCH-PERM-10 | C30083 | `title` |
| 54 | SCH-PERM-11 | C30084 | `title` |
| 55 | SCH-PERM-12 | C30614 | `title` |
| 56 | SCH-REAS-01 | C30052 | `title` |
| 57 | SCH-REG-01 | C38867 | `refs` |
| 58 | SCH-REG-02 | C38868 | `refs` |
| 59 | SCH-REG-03 | C38869 | `refs` |
| 60 | SCH-REG-04 | C38870 | `refs` |
| 61 | SCH-SCOPE-02 | C29964 | `title` |
| 62 | SCH-SCOPE-03 | C29965 | `title` |
| 63 | SCH-SER-03 | C29989 | `title` |
| 64 | SCH-SER-04 | C29990 | `title` |
| 65 | SCH-SPREAD-03 | C29979 | `title` |
| 66 | SCH-SPREAD-06 | C29982 | `title` |
| 67 | SCH-SPREAD-08 | C29984 | `title` |
| 68 | SCH-SPREAD-10 | C29986 | `title` |
| 69 | SCH-START-01 | C29969 | `title` |
| 70 | SCH-START-02 | C29970 | `title` |
| 71 | SCH-START-04 | C29972 | `title` |
| 72 | SCH-START-05 | C29973 | `title` |
| 73 | SCH-START-06 | C29974 | `title` |
| 74 | SCH-START-07 | C29975 | `title` |
| 75 | SCH-TIP-01 | C30034 | `title` |
| 76 | SCH-TIP-02 | C30035 | `title` |
| 77 | SCH-TIP-03 | C30036 | `title` |
| 78 | SCH-TIP-04 | C30037 | `title` |
| 79 | SCH-TIP-05 | C30038 | `title` |
| 80 | SCH-TOOL-02 | C30040 | `title` |
| 81 | SCH-TOOL-03 | C30041 | `title` |
| 82 | SCH-VIEW-03 | C30044 | `title` |
| 83 | SCH-WOL-01 | C29936 | `title` |
| 84 | SCH-WOL-02 | C29937 | `title` |

## Rule-34 run-357 sync (after the writes)

Verify run **357** equals the full active set **both ways** — every active case present as a
test, and no test for a non-active case. Expected: **164 tests**, **429 results unchanged**.
Any missing case is **union-added** via `update_run` with `include_all:false` + the union of
existing and missing case ids, so **no existing test or result is dropped**. If the run already
matches, **no `update_run` is issued at all.**

## Reconcile (after the run sync)

id-map + import regenerated over 164; hygiene re-verified (import header byte-identical, 0
VIU/flag words, API cases in an `API`-titled section per Rule 4, no duplicate titles); live count
under group 4254 == id-map == import, stated explicitly.
