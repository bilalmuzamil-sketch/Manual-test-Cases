# TestRail sync — VIU-Verified Fees & Discounts master cases

- **Run:** 2026-07-09 19:34:06Z (DRY-RUN (no writes))
- **Authorization:** explicit user authorization 2026-07-09 — update F&D master cases that are VIU-Verified; nothing else touched.
- **Scope:** `update_case` on title / custom_preconds / custom_steps / custom_expected / refs, built by the gen_import.py rules (VIU-word-free, feature-flag-free). No section moves needed — the two API-flagged verified cases already sit in API-titled sections.
- **Snapshot commit of cases/*.json:** `33272337f7bb0752a3b2e570f97d822a5bac1909`

**Summary:** 108 VIU-Verified cases processed — 40 updated, 68 no-op, 0 failed. API-section rule verified OK on 2 api-flagged case(s); 0 section moves.

| TestRail Case | FD ID | Action | Timestamp (UTC) |
|---|---|---|---|
| [C28425](https://shopview.testrail.io/index.php?/cases/view/28425) | FD-WO-002 | DRY-RUN would update: custom_expected, custom_preconds, custom_steps | 2026-07-09 19:32:32Z |
| [C28426](https://shopview.testrail.io/index.php?/cases/view/28426) | FD-WO-003 | DRY-RUN would update: custom_expected, custom_preconds, custom_steps | 2026-07-09 19:32:33Z |
| [C28427](https://shopview.testrail.io/index.php?/cases/view/28427) | FD-WO-004 | DRY-RUN would update: custom_expected, custom_preconds, custom_steps | 2026-07-09 19:32:34Z |
| [C28429](https://shopview.testrail.io/index.php?/cases/view/28429) | FD-WO-006 | no-op (already in sync) | 2026-07-09 19:32:35Z |
| [C28430](https://shopview.testrail.io/index.php?/cases/view/28430) | FD-WO-007 | no-op (already in sync) | 2026-07-09 19:32:36Z |
| [C28431](https://shopview.testrail.io/index.php?/cases/view/28431) | FD-WO-008 | no-op (already in sync) | 2026-07-09 19:32:37Z |
| [C28432](https://shopview.testrail.io/index.php?/cases/view/28432) | FD-WO-009 | no-op (already in sync) | 2026-07-09 19:32:38Z |
| [C28433](https://shopview.testrail.io/index.php?/cases/view/28433) | FD-WO-010 | no-op (already in sync) | 2026-07-09 19:32:38Z |
| [C28434](https://shopview.testrail.io/index.php?/cases/view/28434) | FD-WO-011 | no-op (already in sync) | 2026-07-09 19:32:39Z |
| [C28435](https://shopview.testrail.io/index.php?/cases/view/28435) | FD-WO-012 | no-op (already in sync) | 2026-07-09 19:32:40Z |
| [C28437](https://shopview.testrail.io/index.php?/cases/view/28437) | FD-WO-014 | no-op (already in sync) | 2026-07-09 19:32:41Z |
| [C28438](https://shopview.testrail.io/index.php?/cases/view/28438) | FD-WO-015 | no-op (already in sync) | 2026-07-09 19:32:42Z |
| [C28440](https://shopview.testrail.io/index.php?/cases/view/28440) | FD-LABOR-002 | no-op (already in sync) | 2026-07-09 19:32:43Z |
| [C28441](https://shopview.testrail.io/index.php?/cases/view/28441) | FD-LABOR-003 | no-op (already in sync) | 2026-07-09 19:32:43Z |
| [C28442](https://shopview.testrail.io/index.php?/cases/view/28442) | FD-LABOR-004 | no-op (already in sync) | 2026-07-09 19:32:44Z |
| [C28443](https://shopview.testrail.io/index.php?/cases/view/28443) | FD-LABOR-005 | no-op (already in sync) | 2026-07-09 19:32:45Z |
| [C28444](https://shopview.testrail.io/index.php?/cases/view/28444) | FD-LABOR-006 | no-op (already in sync) | 2026-07-09 19:32:46Z |
| [C28445](https://shopview.testrail.io/index.php?/cases/view/28445) | FD-LABOR-007 | no-op (already in sync) | 2026-07-09 19:32:47Z |
| [C28447](https://shopview.testrail.io/index.php?/cases/view/28447) | FD-PART-002 | no-op (already in sync) | 2026-07-09 19:32:47Z |
| [C28448](https://shopview.testrail.io/index.php?/cases/view/28448) | FD-PART-003 | no-op (already in sync) | 2026-07-09 19:32:48Z |
| [C28449](https://shopview.testrail.io/index.php?/cases/view/28449) | FD-PART-004 | no-op (already in sync) | 2026-07-09 19:32:49Z |
| [C28451](https://shopview.testrail.io/index.php?/cases/view/28451) | FD-PART-006 | no-op (already in sync) | 2026-07-09 19:32:50Z |
| [C28452](https://shopview.testrail.io/index.php?/cases/view/28452) | FD-PART-007 | no-op (already in sync) | 2026-07-09 19:32:51Z |
| [C28453](https://shopview.testrail.io/index.php?/cases/view/28453) | FD-PART-008 | no-op (already in sync) | 2026-07-09 19:32:51Z |
| [C28454](https://shopview.testrail.io/index.php?/cases/view/28454) | FD-INLINE-001 | DRY-RUN would update: custom_expected, custom_preconds, custom_steps | 2026-07-09 19:32:52Z |
| [C28455](https://shopview.testrail.io/index.php?/cases/view/28455) | FD-INLINE-002 | no-op (already in sync) | 2026-07-09 19:32:53Z |
| [C28457](https://shopview.testrail.io/index.php?/cases/view/28457) | FD-INLINE-004 | no-op (already in sync) | 2026-07-09 19:32:54Z |
| [C28458](https://shopview.testrail.io/index.php?/cases/view/28458) | FD-INLINE-005 | no-op (already in sync) | 2026-07-09 19:32:55Z |
| [C28461](https://shopview.testrail.io/index.php?/cases/view/28461) | FD-STATS-003 | no-op (already in sync) | 2026-07-09 19:32:55Z |
| [C28463](https://shopview.testrail.io/index.php?/cases/view/28463) | FD-STATS-005 | no-op (already in sync) | 2026-07-09 19:32:56Z |
| [C28464](https://shopview.testrail.io/index.php?/cases/view/28464) | FD-FIN-001 | no-op (already in sync) | 2026-07-09 19:32:57Z |
| [C28465](https://shopview.testrail.io/index.php?/cases/view/28465) | FD-FIN-002 | no-op (already in sync) | 2026-07-09 19:32:58Z |
| [C28466](https://shopview.testrail.io/index.php?/cases/view/28466) | FD-FIN-003 | no-op (already in sync) | 2026-07-09 19:32:59Z |
| [C28468](https://shopview.testrail.io/index.php?/cases/view/28468) | FD-FIN-005 | no-op (already in sync) | 2026-07-09 19:32:59Z |
| [C28476](https://shopview.testrail.io/index.php?/cases/view/28476) | FD-EDIT-001 | no-op (already in sync) | 2026-07-09 19:33:00Z |
| [C28477](https://shopview.testrail.io/index.php?/cases/view/28477) | FD-EDIT-002 | no-op (already in sync) | 2026-07-09 19:33:01Z |
| [C28478](https://shopview.testrail.io/index.php?/cases/view/28478) | FD-EDIT-003 | no-op (already in sync) | 2026-07-09 19:33:02Z |
| [C28480](https://shopview.testrail.io/index.php?/cases/view/28480) | FD-REMOVE-002 | no-op (already in sync) | 2026-07-09 19:33:03Z |
| [C28481](https://shopview.testrail.io/index.php?/cases/view/28481) | FD-REMOVE-003 | no-op (already in sync) | 2026-07-09 19:33:04Z |
| [C28482](https://shopview.testrail.io/index.php?/cases/view/28482) | FD-STACK-001 | no-op (already in sync) | 2026-07-09 19:33:05Z |
| [C28483](https://shopview.testrail.io/index.php?/cases/view/28483) | FD-STACK-002 | no-op (already in sync) | 2026-07-09 19:33:06Z |
| [C28484](https://shopview.testrail.io/index.php?/cases/view/28484) | FD-STACK-003 | no-op (already in sync) | 2026-07-09 19:33:07Z |
| [C28485](https://shopview.testrail.io/index.php?/cases/view/28485) | FD-CUST-001 | no-op (already in sync) | 2026-07-09 19:33:08Z |
| [C28486](https://shopview.testrail.io/index.php?/cases/view/28486) | FD-CUST-002 | DRY-RUN would update: refs | 2026-07-09 19:33:09Z |
| [C28492](https://shopview.testrail.io/index.php?/cases/view/28492) | FD-CUST-008 | no-op (already in sync) | 2026-07-09 19:33:10Z |
| [C28493](https://shopview.testrail.io/index.php?/cases/view/28493) | FD-CUST-009 | DRY-RUN would update: custom_expected, custom_preconds, custom_steps, refs | 2026-07-09 19:33:11Z |
| [C28494](https://shopview.testrail.io/index.php?/cases/view/28494) | FD-CUST-010 | DRY-RUN would update: refs | 2026-07-09 19:33:12Z |
| [C28495](https://shopview.testrail.io/index.php?/cases/view/28495) | FD-CUST-011 | no-op (already in sync) | 2026-07-09 19:33:13Z |
| [C28496](https://shopview.testrail.io/index.php?/cases/view/28496) | FD-CUST-012 | DRY-RUN would update: refs | 2026-07-09 19:33:14Z |
| [C28497](https://shopview.testrail.io/index.php?/cases/view/28497) | FD-CUST-013 | no-op (already in sync) | 2026-07-09 19:33:15Z |
| [C28498](https://shopview.testrail.io/index.php?/cases/view/28498) | FD-CUST-014 | no-op (already in sync) | 2026-07-09 19:33:16Z |
| [C28499](https://shopview.testrail.io/index.php?/cases/view/28499) | FD-CUST-015 | DRY-RUN would update: refs | 2026-07-09 19:33:17Z |
| [C28500](https://shopview.testrail.io/index.php?/cases/view/28500) | FD-CUST-016 | no-op (already in sync) | 2026-07-09 19:33:18Z |
| [C28501](https://shopview.testrail.io/index.php?/cases/view/28501) | FD-CUST-017 | DRY-RUN would update: custom_expected, custom_preconds, custom_steps; API-section rule OK (section 'API — Customer Fees & Discounts tab — negative') | 2026-07-09 19:33:18Z |
| [C28503](https://shopview.testrail.io/index.php?/cases/view/28503) | FD-TMPL-002 | DRY-RUN would update: custom_expected, custom_preconds, custom_steps, refs | 2026-07-09 19:33:20Z |
| [C28506](https://shopview.testrail.io/index.php?/cases/view/28506) | FD-TMPL-005 | DRY-RUN would update: custom_expected, custom_preconds, custom_steps, refs | 2026-07-09 19:33:21Z |
| [C28508](https://shopview.testrail.io/index.php?/cases/view/28508) | FD-TMPL-007 | no-op (already in sync) | 2026-07-09 19:33:22Z |
| [C28510](https://shopview.testrail.io/index.php?/cases/view/28510) | FD-TMPL-009 | DRY-RUN would update: refs | 2026-07-09 19:33:23Z |
| [C28514](https://shopview.testrail.io/index.php?/cases/view/28514) | FD-TMPL-013 | DRY-RUN would update: refs | 2026-07-09 19:33:24Z |
| [C28515](https://shopview.testrail.io/index.php?/cases/view/28515) | FD-TMPL-014 | DRY-RUN would update: refs | 2026-07-09 19:33:25Z |
| [C28516](https://shopview.testrail.io/index.php?/cases/view/28516) | FD-TMPL-015 | no-op (already in sync) | 2026-07-09 19:33:26Z |
| [C28517](https://shopview.testrail.io/index.php?/cases/view/28517) | FD-TMPL-016 | DRY-RUN would update: refs | 2026-07-09 19:33:27Z |
| [C28518](https://shopview.testrail.io/index.php?/cases/view/28518) | FD-TMPL-017 | no-op (already in sync) | 2026-07-09 19:33:29Z |
| [C28523](https://shopview.testrail.io/index.php?/cases/view/28523) | FD-PROC-005 | DRY-RUN would update: refs | 2026-07-09 19:33:30Z |
| [C28524](https://shopview.testrail.io/index.php?/cases/view/28524) | FD-PROC-006 | DRY-RUN would update: refs | 2026-07-09 19:33:31Z |
| [C28525](https://shopview.testrail.io/index.php?/cases/view/28525) | FD-PROC-007 | DRY-RUN would update: refs | 2026-07-09 19:33:32Z |
| [C28528](https://shopview.testrail.io/index.php?/cases/view/28528) | FD-PROC-010 | DRY-RUN would update: custom_expected, custom_preconds, custom_steps; API-section rule OK (section 'API — Processing Fee — negative') | 2026-07-09 19:33:33Z |
| [C28529](https://shopview.testrail.io/index.php?/cases/view/28529) | FD-PROC-011 | no-op (already in sync) | 2026-07-09 19:33:33Z |
| [C28530](https://shopview.testrail.io/index.php?/cases/view/28530) | FD-PROC-012 | DRY-RUN would update: refs | 2026-07-09 19:33:34Z |
| [C28533](https://shopview.testrail.io/index.php?/cases/view/28533) | FD-DOC-001 | no-op (already in sync) | 2026-07-09 19:33:35Z |
| [C28534](https://shopview.testrail.io/index.php?/cases/view/28534) | FD-DOC-002 | DRY-RUN would update: refs | 2026-07-09 19:33:36Z |
| [C28535](https://shopview.testrail.io/index.php?/cases/view/28535) | FD-DOC-003 | DRY-RUN would update: refs | 2026-07-09 19:33:36Z |
| [C28536](https://shopview.testrail.io/index.php?/cases/view/28536) | FD-DOC-004 | DRY-RUN would update: refs | 2026-07-09 19:33:37Z |
| [C28537](https://shopview.testrail.io/index.php?/cases/view/28537) | FD-DOC-005 | DRY-RUN would update: refs | 2026-07-09 19:33:38Z |
| [C28538](https://shopview.testrail.io/index.php?/cases/view/28538) | FD-DOC-006 | DRY-RUN would update: refs | 2026-07-09 19:33:39Z |
| [C28539](https://shopview.testrail.io/index.php?/cases/view/28539) | FD-DOC-007 | DRY-RUN would update: refs | 2026-07-09 19:33:40Z |
| [C28540](https://shopview.testrail.io/index.php?/cases/view/28540) | FD-DOC-008 | no-op (already in sync) | 2026-07-09 19:33:40Z |
| [C28541](https://shopview.testrail.io/index.php?/cases/view/28541) | FD-DOC-009 | no-op (already in sync) | 2026-07-09 19:33:41Z |
| [C28542](https://shopview.testrail.io/index.php?/cases/view/28542) | FD-DOC-010 | DRY-RUN would update: custom_expected, custom_preconds, custom_steps | 2026-07-09 19:33:42Z |
| [C28562](https://shopview.testrail.io/index.php?/cases/view/28562) | FD-HIST-003 | DRY-RUN would update: refs | 2026-07-09 19:33:43Z |
| [C28564](https://shopview.testrail.io/index.php?/cases/view/28564) | FD-HIST-005 | DRY-RUN would update: refs | 2026-07-09 19:33:44Z |
| [C28565](https://shopview.testrail.io/index.php?/cases/view/28565) | FD-HIST-006 | no-op (already in sync) | 2026-07-09 19:33:44Z |
| [C28567](https://shopview.testrail.io/index.php?/cases/view/28567) | FD-HIST-008 | DRY-RUN would update: refs | 2026-07-09 19:33:45Z |
| [C28568](https://shopview.testrail.io/index.php?/cases/view/28568) | FD-CALC-001 | no-op (already in sync) | 2026-07-09 19:33:46Z |
| [C28569](https://shopview.testrail.io/index.php?/cases/view/28569) | FD-CALC-002 | no-op (already in sync) | 2026-07-09 19:33:47Z |
| [C28570](https://shopview.testrail.io/index.php?/cases/view/28570) | FD-CALC-003 | no-op (already in sync) | 2026-07-09 19:33:48Z |
| [C28571](https://shopview.testrail.io/index.php?/cases/view/28571) | FD-CALC-004 | no-op (already in sync) | 2026-07-09 19:33:48Z |
| [C28572](https://shopview.testrail.io/index.php?/cases/view/28572) | FD-CALC-005 | no-op (already in sync) | 2026-07-09 19:33:49Z |
| [C28574](https://shopview.testrail.io/index.php?/cases/view/28574) | FD-CALC-007 | no-op (already in sync) | 2026-07-09 19:33:50Z |
| [C28576](https://shopview.testrail.io/index.php?/cases/view/28576) | FD-CALC-009 | no-op (already in sync) | 2026-07-09 19:33:51Z |
| [C28577](https://shopview.testrail.io/index.php?/cases/view/28577) | FD-CALC-010 | DRY-RUN would update: refs | 2026-07-09 19:33:52Z |
| [C28578](https://shopview.testrail.io/index.php?/cases/view/28578) | FD-CALC-011 | no-op (already in sync) | 2026-07-09 19:33:52Z |
| [C28579](https://shopview.testrail.io/index.php?/cases/view/28579) | FD-CALC-012 | no-op (already in sync) | 2026-07-09 19:33:53Z |
| [C28581](https://shopview.testrail.io/index.php?/cases/view/28581) | FD-CALC-014 | DRY-RUN would update: refs | 2026-07-09 19:33:54Z |
| [C28585](https://shopview.testrail.io/index.php?/cases/view/28585) | FD-PERM-001 | DRY-RUN would update: refs | 2026-07-09 19:33:55Z |
| [C28587](https://shopview.testrail.io/index.php?/cases/view/28587) | FD-PERM-003 | no-op (already in sync) | 2026-07-09 19:33:56Z |
| [C28589](https://shopview.testrail.io/index.php?/cases/view/28589) | FD-PERM-005 | no-op (already in sync) | 2026-07-09 19:33:56Z |
| [C28590](https://shopview.testrail.io/index.php?/cases/view/28590) | FD-PERM-006 | no-op (already in sync) | 2026-07-09 19:33:57Z |
| [C28591](https://shopview.testrail.io/index.php?/cases/view/28591) | FD-PERM-007 | no-op (already in sync) | 2026-07-09 19:33:58Z |
| [C28592](https://shopview.testrail.io/index.php?/cases/view/28592) | FD-PERM-008 | DRY-RUN would update: refs | 2026-07-09 19:33:59Z |
| [C28593](https://shopview.testrail.io/index.php?/cases/view/28593) | FD-PERM-009 | no-op (already in sync) | 2026-07-09 19:33:59Z |
| [C28594](https://shopview.testrail.io/index.php?/cases/view/28594) | FD-PERM-010 | DRY-RUN would update: refs | 2026-07-09 19:34:00Z |
| [C28595](https://shopview.testrail.io/index.php?/cases/view/28595) | FD-PERM-011 | DRY-RUN would update: refs | 2026-07-09 19:34:01Z |
| [C28600](https://shopview.testrail.io/index.php?/cases/view/28600) | FD-VAL-002 | DRY-RUN would update: refs | 2026-07-09 19:34:02Z |
| [C28601](https://shopview.testrail.io/index.php?/cases/view/28601) | FD-VAL-003 | DRY-RUN would update: refs | 2026-07-09 19:34:03Z |
| [C28602](https://shopview.testrail.io/index.php?/cases/view/28602) | FD-VAL-004 | no-op (already in sync) | 2026-07-09 19:34:04Z |
| [C28603](https://shopview.testrail.io/index.php?/cases/view/28603) | FD-VAL-005 | no-op (already in sync) | 2026-07-09 19:34:04Z |
| [C28605](https://shopview.testrail.io/index.php?/cases/view/28605) | FD-VAL-007 | DRY-RUN would update: refs | 2026-07-09 19:34:05Z |
