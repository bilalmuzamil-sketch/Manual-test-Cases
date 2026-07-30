# Filters — TestRail sync MANIFEST — closing-authenticity pass, 2026-07-31

**STATUS: EXECUTED** (see `testrail-execution-log-2026-07-31.md` for the per-op log.)

Scope of authorization: project **1** / suite **1** / group **4110** and run **352**
only. Nothing else in TestRail is touched.

## Operations

| Op | Count | Detail |
|---|---|---|
| `update_case` | **110** | every active case — `refs` on all 110, `title` on 40, plus 2 single-field body repairs |
| `add_case` | **0** | no gap emerged that needed a new case |
| `delete_case` | **0** | the 26 merge members + 1 duplicate stay ACTIVE as recommendations only (Rule 6) |
| `add_section` / `move_cases_to_section` | **0** | section layout unchanged (17 children of 4110) |
| run `352` | **union-add only if a case were missing** | verified equal both ways first — see §Run 352 |
| result writes | **0** | run 352's 395 result records are never written |

### Field breakdown of the 110 `update_case`

| Field | Cases | Why |
|---|---|---|
| `refs` | **110** | Phase 2 traceability repair — 76 stale `requirements.md` (v1.0) citations re-pointed to v1.6 anchors, 2 stale `spec v1.3` citations resolved, 1 internal-id leak removed, 1 missing no-anchor statement added, 5 stale annotations repaired, and the ticket half normalised to the honest `Filters (no Jira epic)` |
| `title` | **40** | Phase 3 (37 titles over the 80-char display limit, longest 179) + Phase 4 (6 re-worded for vocabulary drift / plainness), 3 of which overlap |
| `custom_steps` | **1** | FLT-PSRCH-06 = C38891 — steps 1–5 were verb-less lists (Rule-28 fail condition 6) |
| `custom_expected` | **1** | FLT-MOB-01 = C29621 — removed `(per the design variant)` design jargon from a tester-facing line |

## DELIBERATELY EXCLUDED — a markup-only difference on 7 cases, reported not "fixed"

Diffing local against live turned up a **pre-existing** difference on
**FLT-BAR-01 = C29557, FLT-STAT-01 = C29560, FLT-CUST-01 = C29566,
FLT-CUST-03 = C29568, FLT-CUST-08 = C29573, FLT-TECH-01 = C29575,
FLT-ADV-01 = C29582**: in TestRail these 7 store Preconditions / Steps / Expected as
**HTML `<ol><li>` markup**, while the other **103** store the house-standard plain
numbered lines (`1. …`).

**The text content is byte-identical** — machine-verified after stripping the tags and
the numbering, on all 21 field pairs (7 cases × 3 fields).

**Not pushed, on purpose.** Rewriting them is a *presentation* change to 7 live cases
that is outside this pass's brief, and its effect cannot be confirmed from a desk: if
TestRail renders those fields as Markdown the tester currently sees literal
`<ol><li>` tags (bad, worth fixing); if it renders HTML they look fine today and the
rewrite would be churn. **Deciding needs one look at a TestRail case page.** Carried as
a named follow-up in `PROJECT-STATE.md` rather than silently changed or silently
ignored.

## Guardrails asserted before and during execution

1. Payload carries **only** the fields that genuinely differ from the live body — no
   blind whole-body overwrite.
2. **Pre-write `get_case` snapshot** taken for every one of the 110 immediately before
   its write (`pre-write-snapshot/`), plus a whole-group snapshot at pass start.
3. Every op is followed by a **re-GET and a field-by-field diff**; a mismatch fails the
   run loudly.
4. `refs` invariants re-asserted on every string: **≤ 250 chars** (TestRail's hard cap —
   over it returns a misleading `does not match the required pattern` 400),
   **comma-free** (TestRail strips the space after a comma, which would make the
   re-GET verify falsely MISMATCH), no internal case id, ticket-situation stated.
5. `section_id`, `type_id`, `priority_id`, `custom_atmstatus`, `custom_automation_type`
   are **never** sent, so nothing moves or changes class.
6. Per-op log flushed + `fsync`'d to disk after every call, so a killed run is resumable
   against live state (Rule 29).

## Run 352 (Rule 34)

Run **352** = "Filters - Ahtasham (Awaiting QA- ENV)". Pre-write state: **110 tests,
395 result records, `include_all` false**. The run is verified equal to the active set
**both ways** (0 active-not-in-run, 0 run-not-active). No case was added, so **no run
write was needed**; the result count must remain **395**.
