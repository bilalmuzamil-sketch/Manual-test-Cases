# Reading record — tech plan pass, 22 Oct 2026 (Rules 119 and 134)

Nothing was skipped or sampled. Running notes, written after every chunk: `NOTES.md` (same folder).

## The tech plan (the source this pass is about)
| File | Bytes | Lines | sha256 (first 12) | Read |
|---|---|---|---|---|
| `sources/Tech-Plan-Splitting-Sales-Representatives-2026-10-19-upload.md` | 278,939 | 2,641 | d746040c88cf | 100% |
| `sources/tech-plan-2026-10-22/Tech-Plan-Splitting-Sales-Representatives-2026-10-22-upload.md` (today's upload) | 278,939 | 2,641 | d746040c88cf | byte-identical to the 19 Oct file (`cmp` exit 0, same hash), so reading one is reading both |

Chunks, every one followed by a note in NOTES.md (each at most 400 lines):

| Chunk | Lines | What it holds |
|---|---|---|
| 1a | 1-200 | Header, §0 Execution state, §1 PRD v8 copy (S1-R1 … S8-R5) |
| 1b | 201-400 | §1 end, NFR-001..004, clarifications, "what the code already does", §2 architecture, §3 decisions D1-D22, P-1..P-12, §3.2, §4 database, §5 0.1 |
| 2 | 401-800 | §5 0.1 end … 0.9, FE dependency map, §6 phase table and gates, Phase 1 (P0, P1, 8.3), Phase 2 header, §3.1, §3.2 start |
| 3 | 801-1200 | §3.2 end, §3.3-§3.7, §4.1-§4.2, Phase 2 gates and E2E, Phase 3 (P4) |
| 4 | 1201-1600 | Phase 4 (§5.1-§5.6), Phase 5 start (P2 types, state machine, field component, OrderStatusCard) |
| 5 | 1601-2000 | Phase 5 end (test ids, tests, P3 print and log, gates), Phase 6, Phase 7, Phase 8 §8.1-§8.2 (b) |
| 6 | 2001-2400 | §8.2 (c)-(f), §8.4, Phase 8 gates, Phase 9 (P5), §7 testing strategy (N1-N5, backlog, TestRail sync), §8 rollback, §9 security and risks, §10 start |
| 7 | 2401-2641 | §10 traceability table, §11 verification tickets (end of file) |

**Coverage: lines 1-2,641 of 2,641 = 100%.**

## The other sources, read in full for this pass
| File | Bytes | Lines | Read |
|---|---|---|---|
| `prd-v11-2026-10-22/CONFLUENCE-919928833-v11-2026-10-22.md` (PRD v11, current) | 50,716 | 425 | 100% (lines 1-200, 201-425) |
| `design-recheck-2026-10-20/chris-answers.json` (answers 1-40) | 42,998 | 367 | 100% (every question, the context we gave and every verbatim answer) |
| `report-specs/SBR-585629698-v28-2026-10-19.txt` | — | 518 | Searched for the export row limit (S14-E2) only; the quotes already in the cases are checked verbatim by build.py on every run. The whole spec was read in full on 19 Oct 2026 (`report-specs/REPORT-SPECS-REVIEW-2026-10-19.md`) and has not changed since. |
| `report-specs/SBC-577634305-v21-2026-10-19.txt` | — | 488 | Searched for S3-R1..R3 (the "Select all" row) only; read in full on 19 Oct 2026, unchanged since. |
| The six design-recheck case bodies `design-recheck-2026-10-20/applied/C690658/59/60/61/63/64-after.json` | — | — | 100% (every field, as text) |
| Every case of the library: `authoring/cases_s1_s2.py`, `cases_s3_s4.py`, `cases_s5_s8.py`, `cases_tp.py`, `cases_rs.py`, `cases_rel.py`, `cases_design.py` (129 cases at the start), plus `ssr_lib.py`, `common.py`, `build.py`, `render_setup.py` | 128,841 (the seven case files at the start) | — | 100% |
| `EXISTING-CASES-THAT-WILL-BREAK-2026-10-19.md` | 19,442 | 47 | 100% |
| `INTAKE-2026-10-19.md`, `PROJECT-STATE.md`, `WORKER-BRIEF.md` (this pass) | — | 27 / 63 / 45 | 100% |
| Rules 30, 41, 57, 96, 113, 114, 115, 116, 117 (all twelve amendments), 122, 130, 134; `LESSONS-REGISTER.md`; `skills/IDEAL-TEST-CASE-STANDARD.md`; skill 07 (§0, §0a, §0b, §4, §5, §6, the steps) | — | — | 100% of each named rule or section |
| `fees-discounts/spec-v1-source.md` | — | — | Searched only for the subtotal floor (S6-R10), as a fact check for new case S5-20. No quote is taken from it; S5-20 quotes PRD v11 S5-R6 and the tech plan. |

Not read again in this pass: the design export (2.47 MB viewer code, 68 board pictures). It was read and driven in full on 19, 20 and
22 Oct 2026 (`design-drive-2026-10-19/`, `design-recheck-2026-10-20/`), and the tech plan sends no design change. The QA lead decides
whether this pass needs a design re-drive (Rule 122 as amended: he chooses a full pass or a named set).
