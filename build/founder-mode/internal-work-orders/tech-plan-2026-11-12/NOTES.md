# Running notes — Internal Work Orders tech plan reading (worker, 12 Nov 2026)

Restart rule: read this file first; resume from the last "READ" line. Candidate statements go in cand/*.tsv (line<TAB>verdict<TAB>prd<TAB>quote<TAB>note).

- Started 12 Nov 2026. Read WORKER-BRIEF.md (full), INTAKE, PROJECT-STATE; Rules 30, 57 (head), 96 (head), 119; Skill 17 §2, §4.
- Sources: tech plan sha256 bc32a6f0…4799d (842,447 B, 5,398 lines); PRD sha256 1735d0b6…a5b2 (179,770 B, 805 lines).
- Tech plan top-level map: §0 Exec state 12 · §1 Req 58 · §2 Arch 426 · §3 Decisions 459 · §4 DB 538 · §5 API 578 · §6 Phases 597 ·
  §7 Testing 1068 · §8 Rollback 1779 · §9 Perf/Sec 1788 · §10 Traceability 1808 · §11 Verif tickets 2233 · App A backend 2256 ·
  App B frontend 3121 · App C AccountingHub 3819 · App D portal 5014-5398.
- READ PRD lines 1-399 (header/status, §1 business case, §2 overview, out of scope, §3 goals, §4 key decisions + permission matrix
  (120-138), §5 terminology, §6 assumptions, Story 1 S1-R1..R16 N1-N6 E1-E4 errors; Story 2 S2-R1..R22 N1-N5 E1-E7 errors;
  Story 3 S3-R1..R7 N1-N5 E1-E5 errors; Story 4 S4-R1..R4 N1-N2 E1-E4 errors; Story 5 start).
  PRD key facts: Closed = 3rd invoice state; WO stays Invoiced underneath; no $0 payment; GA4 events out of scope; no feature flag
  (setting off by default; deploy switch S13-R5); 403 server enforcement; Open API outside matrix (S11-R4 refuses classification writes
  for every key); categories seeded at release; 100 active cap; name 60 chars; Make internal list 10 rows; modal 50 picks.
- READ PRD lines 400-805 (Stories 5-13, §8 User Feedback table, §9 change log). PRD 100% read (1-120, 120-229, 230-319, 320-399,
  400-489, 490-569, 570-648, 649-727, 728-805).
- READ PLAN 1-429 (header; §0 exec state, PRD baseline = page 39 published 2026-11-09, read 2026-11-10; revision history rev 1-5;
  §1 PRD extract S1..S13 first sentences (to verify by script vs PRD v1.0); NFR-001..011; clarifications Q1-Q67, HQ1-HQ8).
  Candidates in cand/c01.tsv. Note: plan built on PRD v1.0 page 39; our PRD copy = Final v1.0 (2026-11-09), last modified 10 Nov:
  check page version (if >39, plan baseline may be behind).
- READ PLAN 429-498 (§2 architecture diagram, bounded contexts; §3 D1-D36). Candidates cand/c02.tsv.
- READ PLAN 499-597 (D37-D70; new deps; §4 DB changes core+hub; data migrations; §5 API changes + authorization). cand/c03.tsv. Open: does ROLE_ORGANIZATION_CREATE_AND_EDIT = 'Settings — App'? (check App A).
- READ PLAN 597-705 (§6 phase map/release order; Phase 1; Phase 2). cand/c04.tsv (INV = invariant rows, verdict decided at assembly).
- READ PLAN 706-825 (Phase 2C, Phase 3, Phase 4 to browser-walk). cand/c05.tsv.
- READ PLAN 826-945 (Phase 4B, Phase 5, Phase 6, Phase 7 header). cand/c06.tsv.
- READ PLAN 946-1067 (Phase 7 body, Phase 8, Phase 9, Phase 10, Phase 11, Phase 13 runbook). cand/c07.tsv.
- READ PLAN 1068-1197 (§7 unit/integration tests, manual checklist 1-12, E2E intro, ground rules, factories, page objects, Phase 1/2 regression lists). cand/c08.tsv.
- READ PLAN 1198-1307 (Phase 1/2 regression lists end; E2E Phase 2C specs 2C-A/2C-B; Phase 3 specs 3A-3C). cand/c09.tsv.
- READ PLAN 1308-1437 (E2E 3C-3E, tightening, Phase 4 specs 4A-4D). cand/c10.tsv.
- READ PLAN 1438-1557 (E2E 4E, Phase 4B specs, Phase 5 5A-5C start). cand/c11.tsv.
- READ PLAN 1558-1667 (E2E 5C-5E, Phase 6 QB specs 6B-6F, Phase 9 hub specs 9A-9E, Phase 10 10A). cand/c12.tsv.
- READ PLAN 1668-1808 (E2E 10A setup, phases 7/8/11/13 notes, reference breakage R1-R4, checked-no-breakage, backlog 1-12, dev-layer routing, manual routing, §8 rollback, §9 perf/security). cand/c13.tsv.
- READ PLAN 1808-1927 (§10 traceability S1-R1..S7-N2). cand/c14.tsv.
- READ PLAN 1928-2047 (§10 traceability S7-N3..NFR-011; E2E rows S1). cand/c15.tsv.
- READ PLAN 2048-2255 (E2E rows S1-R16..S13-N1, S3-N5; §11 verification tickets SV-11973..SV-11981, SV-12420..12422, assignee Dusan Radulovic). MAIN BODY 1-2255 DONE. cand/c16.tsv.
- READ PLAN 2256-2300 (App A header: code read on develop 8a3ce526e4 2026-11-09; §0 corrections C1-C27). cand/c17.tsv.
- READ PLAN 2301-2449 (App A §1 goal/contexts; §2.1-2.8; start §2.9). cand/c18.tsv.
- READ PLAN 2450-2509 (App A §2.9 price model, §2.10 statements/snapshot/stamps/S12-R9/S12-E7, §2.11 cost entries + QuickBooks, §2.12 start). cand/c19.tsv.
- READ PLAN 2510-2549 (App A §2.12 contracts, hub provides H1-H8, §2.13 shop supplies, §2.14 predicates, §2.15 release gate/seeding, §3 phases intro). cand/c20.tsv.
- READ PLAN 2550-2629 (App A Phase 1, 2, 2C, 3). cand/c21.tsv. NOTE: enable atom check -> see 2619/N1 in §4.
- READ PLAN 2629-2668 (App A Phase 4, 4B, Phase 5 start). cand/c22.tsv.
- READ PLAN 2668-2717 (App A Phase 5 Close handler, locks, Reopen, documents, Open API pins, surfaces; Phase 6 migrations/files/Issue Credit). cand/c23.tsv.
- READ PLAN 2718-2757 (App A Phase 6 tests, Phases 7-9, Phase 10 report/TE/dashboard/Customers Spending/WIP/export, Phase 13; §4 conventions start). cand/c24.tsv.
- READ PLAN 2757-2816 (App A §4 conventions, §4.1 changed endpoints, §4.2 N1-N3). cand/c25.tsv. RESOLVED: enable atom = today's Settings save atom (ROLE_ORGANIZATION_CREATE_AND_EDIT) -> CONFIRM; categories voter = 'Settings — Service' bundle + org atom per Administration precedent (C26) -> CONFIRM, not DIVERGE.
- READ PLAN 2817-2886 (App A §4.2 N4-N19). cand/c26.tsv.
- READ PLAN 2887-2946 (App A N20-N26, §4.3 log events/notes, §5 consumer table start). cand/c27.tsv.
- READ PLAN 2947-3006 (App A §5 rest, §5.1 payment_status readers, §6 perf/security per phase, §7 risks 1-4). cand/c28.tsv.
- READ PLAN 3007-3120 (App A §7 risks 5-16, regression scenarios table, §8 engineering decisions, §9 open items, round 4, §10 order, §11 files, portal additions). APPENDIX A DONE. cand/c29.tsv.
- READ PLAN 3121-3170 (App B header + known design-vs-PRD divergences; §0 corrections F1-F17; §1 building blocks start). cand/c30.tsv (DESIGN = design vs PRD rows, plan follows PRD).
- READ PLAN 3171-3214 (App B §1 rest, §2 phase order, gates, FE-A). cand/c31.tsv.
- READ PLAN 3215-3259 (App B FE-C1, FE-K). cand/c32.tsv.
- READ PLAN 3260-3299 (App B FE-K2, FE-B1 start). cand/c33.tsv.
- READ PLAN 3300-3334 (App B FE-B1 rest, FE-B2 start). cand/c34.tsv.
- READ PLAN 3335-3369 (App B FE-B2 rest, FE-B3, FE-B4 start). cand/c35.tsv. RESOLVED 2638 -> CONFIRM (FE hides IBS on all non-billable).
- READ PLAN 3370-3404 (App B FE-B4 rest, FE-C Close/Reopen/closed display/credit hold). cand/c36.tsv.
- READ PLAN 3405-3439 (App B FE-C tests/walk, FE-L1, FE-L2 start). cand/c37.tsv.
- READ PLAN 3440-3469 (App B FE-L2 dialogs, Edit Line door, S12-R9 refusal, Issue Credit; FE-D start). cand/c38.tsv.
- READ PLAN 3469-3508 (App B FE-D, FE-M, FE-E). cand/c39.tsv.
- READ PLAN 3509-3537 (App B FE-E rest, FE-F). cand/c40.tsv.
- READ PLAN 3538-3577 (App B FE-G, §3 contract rows 1-27). cand/c41.tsv.
- READ PLAN 3578-3617 (App B §3 rows 28-54; §4.1 status surfaces start). cand/c42.tsv.
- READ PLAN 3618-3662 (App B §4.1 surfaces, §4.2 lock sites, §5 price surfaces start). cand/c43.tsv.
- READ PLAN 3663-3702 (App B §5 rest, §6 data-test-ids). cand/c44.tsv.
- READ PLAN 3703-3762 (App B §7 risks 1-16, regression table, §8 E-1..E-9). cand/c45.tsv.
- READ PLAN 3763-3818 (App B §8 E-10..E-19, §9 questions Q30-Q67, P-4/P-8/P-12). APPENDIX B DONE. cand/c46.tsv.
- READ PLAN 3819-3878 (App C header: hub f302de49, core 733f03c6; contract state; §0 facts 1-6). cand/c47.tsv.
- READ PLAN 3879-3948 (App C §0 facts 7-11, §1 scope, §2 release shape). cand/c48.tsv. RESOLVED 948 (hub blocks deactivating a mapped account; S6-E1 defensive only) -> 3884 ADD + FYI.
- READ PLAN 3948-4027 (App C Phase A0, A1 enums incl. hold reasons/messages). cand/c49.tsv.
- READ PLAN 4028-4117 (App C Phase A2 migrations 1-5). cand/c50.tsv.
- READ PLAN 4118-4227 (App C A2 migrations 5-7, models, A3 category catalog, B0, B1 start). cand/c51.tsv.
- READ PLAN 4228-4347 (App C B1 closed path/tests, B2 cost entries). cand/c52.tsv.
- READ PLAN 4347-4436 (App C B2b vendor bill/credit lines, deferred moves; B3 start). cand/c53.tsv.
- READ PLAN 4437-4546 (App C B3 Held machinery, B4 release). cand/c54.tsv.
- READ PLAN 4547-4636 (App C B4 rest, B5 withdraw, B6 read side, B7 start). cand/c55.tsv.
- READ PLAN 4637-4716 (App C B7, B8 seeding, §4 migrations summary, §5 gates, tests for B start). cand/c56.tsv.
- READ PLAN 4717-4806 (App C tests for B, §6 scenario steps 1-7). cand/c57.tsv.
- READ PLAN 4807-4886 (App C scenario 7-9, §7 cross-repo C1-C9, deploy order start). cand/c58.tsv.
- READ PLAN 4887-5013 (App C deploy order, release run, QA lanes, Jira; §8 T1-T14; §9 port; §10 R1-R16; §11 questions/HQ1-HQ8). APPENDIX C DONE. cand/c59.tsv.
- READ PLAN 5014-5083 (App D header, sources (design 7b gap), §1 summary, §2 estimate/invoice flows). cand/c60.tsv.
- READ PLAN 5084-5153 (App D §2 rest, §3 core coverage M1-M8, §3.3, §4 P1 start). cand/c61.tsv.
- READ PLAN 5154-5223 (App D P1 tests, P2, P3, P4). cand/c62.tsv. RESOLVED 5068 -> CONFIRM (stamp header rendered on every breakpoint, 5208).
- READ PLAN 5224-5313 (App D P4 rest, P5 deposits, P6 verification, gates, §5 deploy order, §6 risks 1-11, §7 Q54 start). cand/c63.tsv. 5102 -> INFO (P5 refuses before charging; race remains = 5298 CHECK -> question).
- READ PLAN 5313-5398 (App D Q54-Q61, PE-8..PE-14, §8 file index). APPENDIX D DONE. cand/c64.tsv.
- ** TECH PLAN 100% READ: lines 1-5398 in order (chunk list in this file). Next: verify §1 PRD extract vs PRD v1.0 by script;
  assemble JSON (tools/assemble.py) with verbatim quote check; write the 5 deliverables. **
- CHECKS: tools/check_extract.py -> plan §1 extract = PRD v1.0 (205/205 ids, all first sentences verbatim). tools/assemble.py -> 688
  candidate quotes verbatim. tools/build_json.py -> 680 statements (CONFIRM 539, ADD 131, DIVERGE 10) + 8 context lines; 74 invariant
  rows; 8 design-vs-PRD rows; DIVERGE rows carry the PRD quote. tools/prd_quotes.py -> 50 PRD quotes verbatim.
- DECISIONS: enable atom = today's Settings save atom (CONFIRM); categories voter = bundle + org atom per Administration precedent
  (CONFIRM); IBS hidden on all non-billable in FE (CONFIRM); S6-E1 unreachable (hub refuses deactivation) -> question 6;
  S2-E3 no import -> DIVERGE + question 4; portal deposit race -> question 5; line marks after convert -> question 7.
- DONE: TECH-PLAN-READING-RECORD.md, TECH-PLAN-TESTABLE.json, TECH-PLAN-DIVERGENCES.md, INVARIANTS-FROM-PLAN.md, QUESTIONS-DRAFT.md.
  No TestRail/Jira/Slack/Google writes, no commits. Nothing written outside tech-plan-2026-11-12/.
