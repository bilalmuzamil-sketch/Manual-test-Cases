# RECHECK-QUEUE — Filters, opened 2026-08-05 (Standing Rules 49 + 60)

## STATUS: **OPEN**

The `sv8785` QA branch has **not** been declared final, and engineering has confirmed the branches
will not be declared final before release. Per Standing Rule 60 an open queue is therefore the
**normal steady state** of this project, not an embarrassment — it is a living work list.

**BUILD MARKER THESE 110 VERDICTS BELONG TO:** `v3.4.2-d00239b` · `index.html` last-modified
Tue 04 Aug 2026 22:51:02 GMT · etag `b9ab1d41718b5e871432064ed914e2e7` · read at 19:53Z, 21:00Z and
21:34Z and **byte-identical by sha256 all three times**.

## What is and is not provisional (Rule 60's layer split)

Only three things go stale when the build moves, and they are a far smaller surface than the suite:

| Layer | Stale on redeploy? | Where it lives here |
|---|---|---|
| 1. On-screen labels and the navigation path | **YES** | steps, preconditions, label text in expected results |
| 2. The pass / fail / deviation verdict | **YES** | `FINDINGS.md` verdict column |
| 3. Markers that assert a build fact — `READY - EXPECT FAIL` and any `HOLD` about absent product | **YES** | 14 expect-fail markers |
| The documented expectation, the requirement anchor, the spec version, the epic and story refs, the traceability, and the Rule-54 source sentence | **NO — survives a redeploy unchanged** | everything else |
| Plain `AUTOMATION: READY` | **NO** — it asserts *automatable*, not *currently passing* | 81 cases |

So a redeploy costs a re-check of **layers 1–3 on 110 rows**, not a re-derivation of the suite.

## Re-run trigger

Re-run when **any** of these happens: the app-version marker changes · a deploy is detected · the
sign-in dies early (cookies on this estate last about 24 hours **or until a deploy**) · the QA lead
asks. Check at every session start alongside the Rule-35 design-queue glob.

## Rows

All **110** cases are queued. Each one's row is its line in `FINDINGS.md`, which carries the internal
ID, the C-id and link, the verdict, the marker and the evidence observed on this marker. Rather than
duplicate 110 rows here, the obligation is stated per group:

| Group | Cases | What must be re-confirmed |
|---|---|---|
| The 14 expect-fail cases | C29557, C29606, C29607, C29613, C29616, C29618, C29619, C29620, C29624, C29625, C29628, C29634, C38889, C38897 | whether the defect still reproduces. **A marker that expects a failure which no longer happens is a defect in our own suite** — that is exactly what this pass found on five cases. |
| The 15 HOLD cases | C29615, C38880, C38881, C38891, C38895, C38901, C38904–C38908, C38882, C38909–C38911 | whether the blocker has lifted: Branko's Parts/Reports write-up (9), a second test login (2), the page-search rollout (2), a pre-redesign account (1), report-page search (1) |
| The 81 PASS cases | the remainder | labels and the verdict only. The documented expectation does not need re-deriving. |

## Also queued: the two closed tickets that still reproduce

**SV-8843** and **SV-8847** are both closed OBSOLETE yet both fail on this build. If either is
reopened and fixed, C29557, C29606, C29607 and C38897 all change. **SV-8845 has already been
reopened by the QA lead** and still reproduces.

## Honest limit

Every one of the 110 verdicts is **PROVISIONAL** because the branch is not final. That is not a
blanket caveat standing in for numbers: **110 of 110 were observed live on `v3.4.2-d00239b` in this
pass**, and the per-case record of when each was last checked is on the case itself, in the
Rule-54 provenance line.
