# Reading record: Internal Work Orders tech plan, 12 Nov 2026 (Rule 119)

Every source this pass relies on, with its size, the line ranges read and the coverage. Nothing was sampled or skipped.

## The tech plan

| | |
|---|---|
| Title | "Internal Work Orders — Technical Implementation Plan" |
| File | `build/founder-mode/internal-work-orders/sources/TECH-PLAN-Internal-Work-Orders-upload-2026-11-12.md` (uploaded by the QA lead; also at powertools md-viewer 48d32d68-…) |
| Size | 842,447 bytes, 5,398 lines, sha256 `bc32a6f061dd4db36ed772d3519821e5798b86e60805f3ca4c7b71b7cc14799d` |
| Date | 2026-10-28, rebuilt 2026-11-09 for PRD v0.21, updated 2026-11-09 for v0.22, updated 2026-11-10 for v1.0 (plan revision 5) |
| Author | Not named. The plan was built with engineering's `/implement` planner agents; verification tickets SV-11973 … SV-11981 and SV-12420 … SV-12422 are assigned to Dusan Radulovic |
| PRD it was written for | PRD v1.0, Confluence page version **39** (published 2026-11-09, "read in full 2026-11-10"), plus the child page "Review Decisions and Open Questions" (v2) |
| Design it names | Internal Work Orders, All flows v6.1 (artifact canvas, 2026-11-05); "where a frame and the text disagree, the text wins" |
| Code it was checked against | core `develop` 8a3ce526e4 (2026-11-09) and 733f03c6; hub `shopview-accounting` f302de49 (2026-11-05); portal `shopview-portal` 2f8d26ba (2026-11-02) |
| Status inside the plan | "Not started"; nothing pending from Product or the hub owner; two read-only production queries (Q20, Q21) owed by engineering |

### Line ranges read, in order (100%)

1-110, 110-259, 260-429, 429-498, 499-597, 597-705, 706-825, 826-945, 946-1070, 1068-1197, 1198-1307, 1308-1437, 1438-1557,
1558-1667, 1668-1809, 1808-1927, 1928-2047, 2048-2257, 2256-2300, 2301-2360, 2360-2449, 2450-2509, 2510-2549, 2550-2629,
2629-2668, 2668-2717, 2718-2757, 2757-2816, 2817-2886, 2887-2946, 2947-3006, 3007-3121, 3121-3170, 3171-3215, 3215-3259,
3260-3299, 3300-3334, 3335-3369, 3370-3404, 3405-3439, 3440-3469, 3469-3508, 3509-3538, 3538-3577, 3578-3617, 3618-3662,
3663-3702, 3703-3762, 3763-3822, 3819-3878, 3879-3948, 3948-4027, 4028-4117, 4118-4227, 4228-4347, 4347-4436, 4437-4546,
4547-4636, 4637-4716, 4717-4806, 4807-4886, 4887-5016, 5014-5083, 5084-5153, 5154-5223, 5224-5313, 5313-5398.

The eight lines longer than 1,900 characters (532, 2468, 2469, 2499, 2607, 2716, 3111 at 7,067, 3113) were checked to have been
seen to their last character.

**Sections covered:** header and §0 Execution State (PRD baseline, revision history 1-5, routing notes); §1 Requirements (the PRD
extract of all 205 ids, NFR-001 to NFR-011, clarifications Q1-Q67 and HQ1-HQ8); §2 Architecture; §3 Technical Decisions D1-D70;
§4 Database Changes; §5 API Changes and authorization; §6 Phases 1, 2, 2C, 3, 4, 4B, 5, 6, 7, 8, 9, 10, 11, 13; §7 Testing Strategy
(unit, integration, the 12-item manual checklist, the E2E pass with ground rules, specs per phase, reference breakage, backlog,
Dev and manual routing); §8 Rollback; §9 Performance and Security; §10 Requirement Traceability (FR, NFR and E2E rows); §11
Verification Tickets; Appendix A backend (corrections C1-C27, cross-cutting design §2.1-2.15, phases, API contract N1-N26,
consumer tables, risks, regression scenarios, engineering decisions, open items, files); Appendix B frontend (corrections
F1-F17, building blocks, phases FE-A to FE-G, contract rows 1-54, the Closed display, price surfaces, test ids, risks,
regression scenarios, E-1 to E-19, questions); Appendix C AccountingHub (facts 1-11, scope, release shape, phases A0-A3 and
B0-B8, migrations, gates, tests, scenario, cross-repo C1-C9, deploy order, T1-T14, port, R1-R16, open questions); Appendix D
customer portal (summary, how the portal renders, core coverage M1-M8, phases P1-P6, deploy order, risks, Q54-Q61, PE-8 to PE-14,
file index).

### What was classified out (read, not testable by a manual tester)

Code sketches, file paths, migrations, index and casing choices, CI gates, E2E factories and page objects, test-id lists, deploy
mechanics and rollback steps. Where one of these implied something a tester can see (a refusal message, a limit, an order, a
label, an account number), it is in `TECH-PLAN-TESTABLE.json`. Eight context lines that explain the plan but assert nothing a
tester can check are kept in the JSON under `context_not_testable`.

## The PRD (re-read in full for this pass)

| Source | Size | Lines | Read |
|---|---|---|---|
| PRD "Internal Work Orders (PRD)", Confluence 942243841, Final v1.0 (2026-11-09), Milos Vasic, `sources/CONFLUENCE-942243841-read-2026-11-12.md`, sha256 `1735d0b6…a5b2` | 179,770 bytes | 805 | 1-120, 120-229, 230-319, 320-399, 400-489, 490-569, 570-648, 649-728, 728-805: **100%** |

**Is the plan built on the PRD we hold?** Yes, as far as can be proved. The plan's §1 copies the first sentence of every PRD id.
`tools/check_extract.py` finds all 205 first sentences word for word in our PRD copy, and the id sets match exactly (205 = 205,
none missing either way). Our copy's status cell is the v1.0 cell with no v1.x change logged. The page version number itself is not
printed in our copy, so "page 39" is the plan's statement, not ours.

## Other files read for this pass

WORKER-BRIEF.md (full); INTAKE-2026-11-12.md and PROJECT-STATE.md (full); Rule 30 (`build/rules/RULES-21-40.md`), Rule 57 head,
Rule 96 head, Rules 113/115/116/119 headings and Rule 119 in full (`build/rules/RULES-61-96.md`); Skill 17 §2 and §4; the worked
example `build/ar-ap-report-sorting/tech-plan-pass-2026-10-22/` (READING-RECORD, NOTES) and `authoring/tech_plan.py` (head).

## How the outputs were checked

- `tools/assemble.py`: every one of the 688 candidate rows quotes the plan word for word at the cited line (a miss stops the build).
- `tools/build_json.py`: builds the JSON (680 statements plus 8 context lines).
- `tools/prd_quotes.py`: all 50 PRD sentences quoted in the .md files are found word for word in PRD v1.0.
- Running notes with every chunk and decision: `NOTES.md`; raw candidates: `cand/c01.tsv` … `cand/c64.tsv`.
