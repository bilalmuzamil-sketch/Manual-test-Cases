# Traceability backfill — per-case audit log (2026-07-22)

Backfill of the TestRail **References (`refs`)** field with the authentic **per-story** Jira ticket key(s) for every Simple Flow and Fees & Discounts case (Standing Rule 20). Tester-facing fields were **not** touched. Method: `getCase` (before) → `update_case {refs}` only when the normalised value differs → `getCase` (verify). Creds/secrets in `/tmp` only.

## Fees & Discounts — 186 cases (all live-verified)

- Cases in scope: **186**
- Newly set / changed: **26**
- Already correct (no-op): **160**
- Could not write (case absent in live TestRail): **0**

| Case | Internal ID | Before refs | After refs | Result |
|---|---|---|---|---|
| [C28424](https://shopview.testrail.io/index.php?/cases/view/28424) | FD-WO-001 | SV-8277,SV-8278 | SV-8277,SV-8278 | already-correct |
| [C28425](https://shopview.testrail.io/index.php?/cases/view/28425) | FD-WO-002 | SV-8278 | SV-8278 | already-correct |
| [C28426](https://shopview.testrail.io/index.php?/cases/view/28426) | FD-WO-003 | SV-8278 | SV-8278 | already-correct |
| [C28427](https://shopview.testrail.io/index.php?/cases/view/28427) | FD-WO-004 | SV-8278 | SV-8278 | already-correct |
| [C28428](https://shopview.testrail.io/index.php?/cases/view/28428) | FD-WO-005 | SV-8278 | SV-8278 | already-correct |
| [C28429](https://shopview.testrail.io/index.php?/cases/view/28429) | FD-WO-006 | SV-8278 | SV-8278 | already-correct |
| [C28430](https://shopview.testrail.io/index.php?/cases/view/28430) | FD-WO-007 | SV-8278 | SV-8278 | already-correct |
| [C28431](https://shopview.testrail.io/index.php?/cases/view/28431) | FD-WO-008 | SV-8278 | SV-8278 | already-correct |
| [C28432](https://shopview.testrail.io/index.php?/cases/view/28432) | FD-WO-009 | SV-8278 | SV-8278 | already-correct |
| [C28433](https://shopview.testrail.io/index.php?/cases/view/28433) | FD-WO-010 | SV-8279 | SV-8279 | already-correct |
| [C28434](https://shopview.testrail.io/index.php?/cases/view/28434) | FD-WO-011 | SV-8278 | SV-8278 | already-correct |
| [C28435](https://shopview.testrail.io/index.php?/cases/view/28435) | FD-WO-012 | SV-8277,SV-8279 | SV-8277,SV-8279 | already-correct |
| [C28436](https://shopview.testrail.io/index.php?/cases/view/28436) | FD-WO-013 | SV-8277,SV-8289 | SV-8277,SV-8289 | already-correct |
| [C28437](https://shopview.testrail.io/index.php?/cases/view/28437) | FD-WO-014 | SV-8278 | SV-8278 | already-correct |
| [C28438](https://shopview.testrail.io/index.php?/cases/view/28438) | FD-WO-015 | SV-8278,SV-8288 | SV-8278,SV-8288 | already-correct |
| [C28439](https://shopview.testrail.io/index.php?/cases/view/28439) | FD-LABOR-001 | SV-8277,SV-8278 | SV-8277,SV-8278 | already-correct |
| [C28440](https://shopview.testrail.io/index.php?/cases/view/28440) | FD-LABOR-002 | SV-8278 | SV-8278 | already-correct |
| [C28441](https://shopview.testrail.io/index.php?/cases/view/28441) | FD-LABOR-003 | SV-8277 | SV-8277 | already-correct |
| [C28442](https://shopview.testrail.io/index.php?/cases/view/28442) | FD-LABOR-004 | SV-8278 | SV-8278 | already-correct |
| [C28443](https://shopview.testrail.io/index.php?/cases/view/28443) | FD-LABOR-005 | SV-7387 | SV-7865 | set |
| [C28444](https://shopview.testrail.io/index.php?/cases/view/28444) | FD-LABOR-006 | SV-8279 | SV-8279 | already-correct |
| [C28445](https://shopview.testrail.io/index.php?/cases/view/28445) | FD-LABOR-007 | SV-8289 | SV-8289 | already-correct |
| [C28446](https://shopview.testrail.io/index.php?/cases/view/28446) | FD-PART-001 | SV-8277,SV-8278 | SV-8277,SV-8278 | already-correct |
| [C28447](https://shopview.testrail.io/index.php?/cases/view/28447) | FD-PART-002 | SV-7387 | SV-7865 | set |
| [C28448](https://shopview.testrail.io/index.php?/cases/view/28448) | FD-PART-003 | SV-8277 | SV-8277 | already-correct |
| [C28449](https://shopview.testrail.io/index.php?/cases/view/28449) | FD-PART-004 | SV-7387 | SV-7865 | set |
| [C28450](https://shopview.testrail.io/index.php?/cases/view/28450) | FD-PART-005 | SV-7387 | SV-8279 | set |
| [C28451](https://shopview.testrail.io/index.php?/cases/view/28451) | FD-PART-006 | SV-7387 | SV-7865 | set |
| [C28452](https://shopview.testrail.io/index.php?/cases/view/28452) | FD-PART-007 | SV-8279 | SV-8279 | already-correct |
| [C28453](https://shopview.testrail.io/index.php?/cases/view/28453) | FD-PART-008 | SV-7387 | SV-7865 | set |
| [C28454](https://shopview.testrail.io/index.php?/cases/view/28454) | FD-INLINE-001 | SV-8279,SV-8288 | SV-8279,SV-8288 | already-correct |
| [C28455](https://shopview.testrail.io/index.php?/cases/view/28455) | FD-INLINE-002 | SV-8279 | SV-8279 | already-correct |
| [C28456](https://shopview.testrail.io/index.php?/cases/view/28456) | FD-INLINE-003 | SV-8279,SV-8288 | SV-8279,SV-8288 | already-correct |
| [C28457](https://shopview.testrail.io/index.php?/cases/view/28457) | FD-INLINE-004 | SV-8279 | SV-8279 | already-correct |
| [C28458](https://shopview.testrail.io/index.php?/cases/view/28458) | FD-INLINE-005 | SV-8279,SV-8288 | SV-8279,SV-8288 | already-correct |
| [C28459](https://shopview.testrail.io/index.php?/cases/view/28459) | FD-STATS-001 | SV-8280 | SV-8280 | already-correct |
| [C28460](https://shopview.testrail.io/index.php?/cases/view/28460) | FD-STATS-002 | SV-8280 | SV-8280 | already-correct |
| [C28461](https://shopview.testrail.io/index.php?/cases/view/28461) | FD-STATS-003 | SV-8280 | SV-8280 | already-correct |
| [C28462](https://shopview.testrail.io/index.php?/cases/view/28462) | FD-STATS-004 | SV-7387 | SV-8280 | set |
| [C28463](https://shopview.testrail.io/index.php?/cases/view/28463) | FD-STATS-005 | SV-8280 | SV-8280 | already-correct |
| [C28464](https://shopview.testrail.io/index.php?/cases/view/28464) | FD-FIN-001 | SV-8279 | SV-8279 | already-correct |
| [C28465](https://shopview.testrail.io/index.php?/cases/view/28465) | FD-FIN-002 | SV-8279 | SV-8279 | already-correct |
| [C28466](https://shopview.testrail.io/index.php?/cases/view/28466) | FD-FIN-003 | SV-8279 | SV-8279 | already-correct |
| [C28467](https://shopview.testrail.io/index.php?/cases/view/28467) | FD-FIN-004 | SV-8279 | SV-8279 | already-correct |
| [C28468](https://shopview.testrail.io/index.php?/cases/view/28468) | FD-FIN-005 | SV-8279 | SV-8279 | already-correct |
| [C28469](https://shopview.testrail.io/index.php?/cases/view/28469) | FD-PCOL-001 | SV-8287 | SV-8287 | already-correct |
| [C28470](https://shopview.testrail.io/index.php?/cases/view/28470) | FD-PCOL-002 | SV-8287 | SV-8287 | already-correct |
| [C28471](https://shopview.testrail.io/index.php?/cases/view/28471) | FD-PCOL-003 | SV-8287 | SV-8287 | already-correct |
| [C28472](https://shopview.testrail.io/index.php?/cases/view/28472) | FD-PCOL-004 | SV-8287 | SV-8287 | already-correct |
| [C28473](https://shopview.testrail.io/index.php?/cases/view/28473) | FD-PCOL-005 | SV-8287 | SV-8287 | already-correct |
| [C28474](https://shopview.testrail.io/index.php?/cases/view/28474) | FD-PCOL-006 | SV-8287 | SV-8287 | already-correct |
| [C28475](https://shopview.testrail.io/index.php?/cases/view/28475) | FD-PCOL-007 | SV-8279,SV-8287 | SV-8279,SV-8287 | already-correct |
| [C28476](https://shopview.testrail.io/index.php?/cases/view/28476) | FD-EDIT-001 | SV-8278 | SV-8278 | already-correct |
| [C28477](https://shopview.testrail.io/index.php?/cases/view/28477) | FD-EDIT-002 | SV-8278 | SV-8278 | already-correct |
| [C28478](https://shopview.testrail.io/index.php?/cases/view/28478) | FD-EDIT-003 | SV-8278 | SV-8278 | already-correct |
| [C28479](https://shopview.testrail.io/index.php?/cases/view/28479) | FD-REMOVE-001 | SV-8279 | SV-8279 | already-correct |
| [C28480](https://shopview.testrail.io/index.php?/cases/view/28480) | FD-REMOVE-002 | SV-8289 | SV-8289 | already-correct |
| [C28481](https://shopview.testrail.io/index.php?/cases/view/28481) | FD-REMOVE-003 | SV-8279 | SV-8279 | already-correct |
| [C28482](https://shopview.testrail.io/index.php?/cases/view/28482) | FD-STACK-001 | SV-8279,SV-8287 | SV-8279,SV-8287 | already-correct |
| [C28483](https://shopview.testrail.io/index.php?/cases/view/28483) | FD-STACK-002 | SV-7387 | SV-7865 | set |
| [C28484](https://shopview.testrail.io/index.php?/cases/view/28484) | FD-STACK-003 | SV-7387 | SV-8283 | set |
| [C28485](https://shopview.testrail.io/index.php?/cases/view/28485) | FD-CUST-001 | SV-8285 | SV-8285 | already-correct |
| [C28486](https://shopview.testrail.io/index.php?/cases/view/28486) | FD-CUST-002 | SV-8285,SV-8288 | SV-8285,SV-8288 | already-correct |
| [C28487](https://shopview.testrail.io/index.php?/cases/view/28487) | FD-CUST-003 | SV-8285 | SV-8285 | already-correct |
| [C28488](https://shopview.testrail.io/index.php?/cases/view/28488) | FD-CUST-004 | SV-8285 | SV-8285 | already-correct |
| [C28489](https://shopview.testrail.io/index.php?/cases/view/28489) | FD-CUST-005 | SV-8284,SV-8285 | SV-8284,SV-8285 | already-correct |
| [C28490](https://shopview.testrail.io/index.php?/cases/view/28490) | FD-CUST-006 | SV-8285 | SV-8285 | already-correct |
| [C28491](https://shopview.testrail.io/index.php?/cases/view/28491) | FD-CUST-007 | SV-8285 | SV-8285 | already-correct |
| [C28492](https://shopview.testrail.io/index.php?/cases/view/28492) | FD-CUST-008 | SV-8285 | SV-8285 | already-correct |
| [C28493](https://shopview.testrail.io/index.php?/cases/view/28493) | FD-CUST-009 | SV-8285 | SV-8285 | already-correct |
| [C28494](https://shopview.testrail.io/index.php?/cases/view/28494) | FD-CUST-010 | SV-8285 | SV-8285 | already-correct |
| [C28495](https://shopview.testrail.io/index.php?/cases/view/28495) | FD-CUST-011 | SV-8285 | SV-8285 | already-correct |
| [C28496](https://shopview.testrail.io/index.php?/cases/view/28496) | FD-CUST-012 | SV-8283,SV-8285 | SV-8283,SV-8285 | already-correct |
| [C28497](https://shopview.testrail.io/index.php?/cases/view/28497) | FD-CUST-013 | SV-8285 | SV-8285 | already-correct |
| [C28498](https://shopview.testrail.io/index.php?/cases/view/28498) | FD-CUST-014 | SV-8285 | SV-8285 | already-correct |
| [C28499](https://shopview.testrail.io/index.php?/cases/view/28499) | FD-CUST-015 | SV-8289 | SV-8289 | already-correct |
| [C28501](https://shopview.testrail.io/index.php?/cases/view/28501) | FD-CUST-017 | SV-8285 | SV-8285 | already-correct |
| [C28502](https://shopview.testrail.io/index.php?/cases/view/28502) | FD-TMPL-001 | SV-8283 | SV-8283 | already-correct |
| [C28503](https://shopview.testrail.io/index.php?/cases/view/28503) | FD-TMPL-002 | SV-8283,SV-8288 | SV-8283,SV-8288 | already-correct |
| [C28504](https://shopview.testrail.io/index.php?/cases/view/28504) | FD-TMPL-003 | SV-8283 | SV-8283 | already-correct |
| [C28505](https://shopview.testrail.io/index.php?/cases/view/28505) | FD-TMPL-004 | SV-8283 | SV-8283 | already-correct |
| [C28506](https://shopview.testrail.io/index.php?/cases/view/28506) | FD-TMPL-005 | SV-8283 | SV-8283 | already-correct |
| [C28507](https://shopview.testrail.io/index.php?/cases/view/28507) | FD-TMPL-006 | SV-8283 | SV-8283 | already-correct |
| [C28508](https://shopview.testrail.io/index.php?/cases/view/28508) | FD-TMPL-007 | SV-8283 | SV-8283 | already-correct |
| [C28509](https://shopview.testrail.io/index.php?/cases/view/28509) | FD-TMPL-008 | SV-8283 | SV-8283 | already-correct |
| [C28510](https://shopview.testrail.io/index.php?/cases/view/28510) | FD-TMPL-009 | SV-8283 | SV-8283 | already-correct |
| [C28511](https://shopview.testrail.io/index.php?/cases/view/28511) | FD-TMPL-010 | SV-8278,SV-8281 | SV-8278,SV-8281 | already-correct |
| [C28512](https://shopview.testrail.io/index.php?/cases/view/28512) | FD-TMPL-011 | SV-8283 | SV-8283 | already-correct |
| [C28513](https://shopview.testrail.io/index.php?/cases/view/28513) | FD-TMPL-012 | SV-8283 | SV-8283 | already-correct |
| [C28514](https://shopview.testrail.io/index.php?/cases/view/28514) | FD-TMPL-013 | SV-8283 | SV-8283 | already-correct |
| [C28515](https://shopview.testrail.io/index.php?/cases/view/28515) | FD-TMPL-014 | SV-8283 | SV-8283 | already-correct |
| [C28516](https://shopview.testrail.io/index.php?/cases/view/28516) | FD-TMPL-015 | SV-8283 | SV-8283 | already-correct |
| [C28517](https://shopview.testrail.io/index.php?/cases/view/28517) | FD-TMPL-016 | SV-8283,SV-8289 | SV-8283,SV-8289 | already-correct |
| [C28518](https://shopview.testrail.io/index.php?/cases/view/28518) | FD-TMPL-017 | SV-8283 | SV-8283 | already-correct |
| [C28519](https://shopview.testrail.io/index.php?/cases/view/28519) | FD-PROC-001 | SV-8283,SV-8284 | SV-8283,SV-8284 | already-correct |
| [C28520](https://shopview.testrail.io/index.php?/cases/view/28520) | FD-PROC-002 | SV-8284 | SV-8284 | already-correct |
| [C28521](https://shopview.testrail.io/index.php?/cases/view/28521) | FD-PROC-003 | SV-8283,SV-8284 | SV-8283,SV-8284 | already-correct |
| [C28522](https://shopview.testrail.io/index.php?/cases/view/28522) | FD-PROC-004 | SV-8284 | SV-8284 | already-correct |
| [C28523](https://shopview.testrail.io/index.php?/cases/view/28523) | FD-PROC-005 | SV-8284 | SV-8284 | already-correct |
| [C28524](https://shopview.testrail.io/index.php?/cases/view/28524) | FD-PROC-006 | SV-8283,SV-8284 | SV-8283,SV-8284 | already-correct |
| [C28525](https://shopview.testrail.io/index.php?/cases/view/28525) | FD-PROC-007 | SV-8284,SV-8285 | SV-8284,SV-8285 | already-correct |
| [C28526](https://shopview.testrail.io/index.php?/cases/view/28526) | FD-PROC-008 | SV-8279,SV-8284 | SV-8279,SV-8284 | already-correct |
| [C28527](https://shopview.testrail.io/index.php?/cases/view/28527) | FD-PROC-009 | SV-8284 | SV-8284 | already-correct |
| [C28528](https://shopview.testrail.io/index.php?/cases/view/28528) | FD-PROC-010 | SV-8284 | SV-8284 | already-correct |
| [C28529](https://shopview.testrail.io/index.php?/cases/view/28529) | FD-PROC-011 | SV-8284 | SV-8284 | already-correct |
| [C28530](https://shopview.testrail.io/index.php?/cases/view/28530) | FD-PROC-012 | SV-8284 | SV-8284 | already-correct |
| [C28531](https://shopview.testrail.io/index.php?/cases/view/28531) | FD-PROC-013 | SV-7387 | SV-8284 | set |
| [C28532](https://shopview.testrail.io/index.php?/cases/view/28532) | FD-PROC-014 | SV-8284 | SV-8284 | already-correct |
| [C28533](https://shopview.testrail.io/index.php?/cases/view/28533) | FD-DOC-001 | SV-8281 | SV-8281 | already-correct |
| [C28534](https://shopview.testrail.io/index.php?/cases/view/28534) | FD-DOC-002 | SV-8281,SV-8288 | SV-8281,SV-8288 | already-correct |
| [C28535](https://shopview.testrail.io/index.php?/cases/view/28535) | FD-DOC-003 | SV-8281 | SV-8281 | already-correct |
| [C28536](https://shopview.testrail.io/index.php?/cases/view/28536) | FD-DOC-004 | SV-8281,SV-8288 | SV-8281,SV-8288 | already-correct |
| [C28537](https://shopview.testrail.io/index.php?/cases/view/28537) | FD-DOC-005 | SV-8281 | SV-8281 | already-correct |
| [C28538](https://shopview.testrail.io/index.php?/cases/view/28538) | FD-DOC-006 | SV-8281 | SV-8281 | already-correct |
| [C28539](https://shopview.testrail.io/index.php?/cases/view/28539) | FD-DOC-007 | SV-8281,SV-8284 | SV-8281,SV-8284 | already-correct |
| [C28540](https://shopview.testrail.io/index.php?/cases/view/28540) | FD-DOC-008 | SV-8290 | SV-8290 | already-correct |
| [C28541](https://shopview.testrail.io/index.php?/cases/view/28541) | FD-DOC-009 | SV-8290 | SV-8290 | already-correct |
| [C28542](https://shopview.testrail.io/index.php?/cases/view/28542) | FD-DOC-010 | SV-7387 | SV-8281 | set |
| [C28543](https://shopview.testrail.io/index.php?/cases/view/28543) | FD-DOC-011 | SV-8281 | SV-8281 | already-correct |
| [C28544](https://shopview.testrail.io/index.php?/cases/view/28544) | FD-QB-001 | SV-8282 | SV-8282 | already-correct |
| [C28545](https://shopview.testrail.io/index.php?/cases/view/28545) | FD-QB-002 | SV-8282 | SV-8282 | already-correct |
| [C28546](https://shopview.testrail.io/index.php?/cases/view/28546) | FD-QB-003 | SV-8282 | SV-8282 | already-correct |
| [C28547](https://shopview.testrail.io/index.php?/cases/view/28547) | FD-QB-004 | SV-8282 | SV-8282 | already-correct |
| [C28548](https://shopview.testrail.io/index.php?/cases/view/28548) | FD-QB-005 | SV-8282 | SV-8282 | already-correct |
| [C28549](https://shopview.testrail.io/index.php?/cases/view/28549) | FD-QB-006 | SV-8282 | SV-8282 | already-correct |
| [C28550](https://shopview.testrail.io/index.php?/cases/view/28550) | FD-QB-007 | SV-8282 | SV-8282 | already-correct |
| [C28551](https://shopview.testrail.io/index.php?/cases/view/28551) | FD-QB-008 | SV-8282 | SV-8282 | already-correct |
| [C28552](https://shopview.testrail.io/index.php?/cases/view/28552) | FD-QB-009 | SV-8282 | SV-8282 | already-correct |
| [C28553](https://shopview.testrail.io/index.php?/cases/view/28553) | FD-QB-010 | SV-8282 | SV-8282 | already-correct |
| [C28554](https://shopview.testrail.io/index.php?/cases/view/28554) | FD-QB-011 | SV-8282 | SV-8282 | already-correct |
| [C28555](https://shopview.testrail.io/index.php?/cases/view/28555) | FD-QB-012 | SV-8282 | SV-8282 | already-correct |
| [C28556](https://shopview.testrail.io/index.php?/cases/view/28556) | FD-QB-013 | SV-8282 | SV-8282 | already-correct |
| [C28557](https://shopview.testrail.io/index.php?/cases/view/28557) | FD-QB-014 | SV-8282 | SV-8282 | already-correct |
| [C28558](https://shopview.testrail.io/index.php?/cases/view/28558) | FD-QB-015 | SV-8282 | SV-8282 | already-correct |
| [C28559](https://shopview.testrail.io/index.php?/cases/view/28559) | FD-QB-016 | SV-8282 | SV-8282 | already-correct |
| [C28560](https://shopview.testrail.io/index.php?/cases/view/28560) | FD-HIST-001 | SV-8286 | SV-8286 | already-correct |
| [C28561](https://shopview.testrail.io/index.php?/cases/view/28561) | FD-HIST-002 | SV-8286 | SV-8286 | already-correct |
| [C28562](https://shopview.testrail.io/index.php?/cases/view/28562) | FD-HIST-003 | SV-8286 | SV-8286 | already-correct |
| [C28563](https://shopview.testrail.io/index.php?/cases/view/28563) | FD-HIST-004 | SV-8286 | SV-8286 | already-correct |
| [C28564](https://shopview.testrail.io/index.php?/cases/view/28564) | FD-HIST-005 | SV-8286,SV-8289 | SV-8286,SV-8289 | already-correct |
| [C28565](https://shopview.testrail.io/index.php?/cases/view/28565) | FD-HIST-006 | SV-8289 | SV-8289 | already-correct |
| [C28566](https://shopview.testrail.io/index.php?/cases/view/28566) | FD-HIST-007 | SV-8284,SV-8286 | SV-8284,SV-8286 | already-correct |
| [C28567](https://shopview.testrail.io/index.php?/cases/view/28567) | FD-HIST-008 | SV-8278,SV-8286 | SV-8278,SV-8286 | already-correct |
| [C28568](https://shopview.testrail.io/index.php?/cases/view/28568) | FD-CALC-001 | SV-7387 | SV-7865 | set |
| [C28569](https://shopview.testrail.io/index.php?/cases/view/28569) | FD-CALC-002 | SV-7387 | SV-7865 | set |
| [C28570](https://shopview.testrail.io/index.php?/cases/view/28570) | FD-CALC-003 | SV-7387 | SV-7865 | set |
| [C28571](https://shopview.testrail.io/index.php?/cases/view/28571) | FD-CALC-004 | SV-7387 | SV-7865 | set |
| [C28572](https://shopview.testrail.io/index.php?/cases/view/28572) | FD-CALC-005 | SV-7387 | SV-7865 | set |
| [C28573](https://shopview.testrail.io/index.php?/cases/view/28573) | FD-CALC-006 | SV-7387 | SV-7865 | set |
| [C28574](https://shopview.testrail.io/index.php?/cases/view/28574) | FD-CALC-007 | SV-7387 | SV-7865 | set |
| [C28575](https://shopview.testrail.io/index.php?/cases/view/28575) | FD-CALC-008 | SV-7387 | SV-7865 | set |
| [C28576](https://shopview.testrail.io/index.php?/cases/view/28576) | FD-CALC-009 | SV-7387 | SV-7865 | set |
| [C28577](https://shopview.testrail.io/index.php?/cases/view/28577) | FD-CALC-010 | SV-7387 | SV-7865 | set |
| [C28578](https://shopview.testrail.io/index.php?/cases/view/28578) | FD-CALC-011 | SV-7387 | SV-7865 | set |
| [C28579](https://shopview.testrail.io/index.php?/cases/view/28579) | FD-CALC-012 | SV-7387 | SV-7865 | set |
| [C28580](https://shopview.testrail.io/index.php?/cases/view/28580) | FD-CALC-013 | SV-7387 | SV-7865 | set |
| [C28581](https://shopview.testrail.io/index.php?/cases/view/28581) | FD-CALC-014 | SV-8284 | SV-8284 | already-correct |
| [C28582](https://shopview.testrail.io/index.php?/cases/view/28582) | FD-CALC-015 | SV-8282 | SV-8282 | already-correct |
| [C28583](https://shopview.testrail.io/index.php?/cases/view/28583) | FD-CALC-016 | SV-8282 | SV-8282 | already-correct |
| [C28584](https://shopview.testrail.io/index.php?/cases/view/28584) | FD-CALC-017 | SV-8282 | SV-8282 | already-correct |
| [C28585](https://shopview.testrail.io/index.php?/cases/view/28585) | FD-PERM-001 | SV-8289 | SV-8289 | already-correct |
| [C28586](https://shopview.testrail.io/index.php?/cases/view/28586) | FD-PERM-002 | SV-8289 | SV-8289 | already-correct |
| [C28587](https://shopview.testrail.io/index.php?/cases/view/28587) | FD-PERM-003 | SV-8289 | SV-8289 | already-correct |
| [C28588](https://shopview.testrail.io/index.php?/cases/view/28588) | FD-PERM-004 | SV-8289 | SV-8289 | already-correct |
| [C28589](https://shopview.testrail.io/index.php?/cases/view/28589) | FD-PERM-005 | SV-8289 | SV-8289 | already-correct |
| [C28590](https://shopview.testrail.io/index.php?/cases/view/28590) | FD-PERM-006 | SV-8289 | SV-8289 | already-correct |
| [C28591](https://shopview.testrail.io/index.php?/cases/view/28591) | FD-PERM-007 | SV-8289 | SV-8289 | already-correct |
| [C28592](https://shopview.testrail.io/index.php?/cases/view/28592) | FD-PERM-008 | SV-8289 | SV-8289 | already-correct |
| [C28593](https://shopview.testrail.io/index.php?/cases/view/28593) | FD-PERM-009 | SV-8289 | SV-8289 | already-correct |
| [C28594](https://shopview.testrail.io/index.php?/cases/view/28594) | FD-PERM-010 | SV-8289 | SV-8289 | already-correct |
| [C28595](https://shopview.testrail.io/index.php?/cases/view/28595) | FD-PERM-011 | SV-8277,SV-8279 | SV-8277,SV-8279 | already-correct |
| [C28596](https://shopview.testrail.io/index.php?/cases/view/28596) | FD-FLAG-001 | SV-8289 | SV-8289 | already-correct |
| [C28597](https://shopview.testrail.io/index.php?/cases/view/28597) | FD-FLAG-002 | SV-8286 | SV-8286 | already-correct |
| [C28598](https://shopview.testrail.io/index.php?/cases/view/28598) | FD-FLAG-003 | SV-8289 | SV-8289 | already-correct |
| [C28599](https://shopview.testrail.io/index.php?/cases/view/28599) | FD-VAL-001 | SV-8278 | SV-8278 | already-correct |
| [C28600](https://shopview.testrail.io/index.php?/cases/view/28600) | FD-VAL-002 | SV-8278 | SV-8278 | already-correct |
| [C28601](https://shopview.testrail.io/index.php?/cases/view/28601) | FD-VAL-003 | SV-8278 | SV-8278 | already-correct |
| [C28602](https://shopview.testrail.io/index.php?/cases/view/28602) | FD-VAL-004 | SV-7387 | SV-8278 | set |
| [C28603](https://shopview.testrail.io/index.php?/cases/view/28603) | FD-VAL-005 | SV-7387 | SV-8278 | set |
| [C28604](https://shopview.testrail.io/index.php?/cases/view/28604) | FD-VAL-006 | SV-8278 | SV-8278 | already-correct |
| [C28605](https://shopview.testrail.io/index.php?/cases/view/28605) | FD-VAL-007 | SV-8283,SV-8285 | SV-8283,SV-8285 | already-correct |
| [C29441](https://shopview.testrail.io/index.php?/cases/view/29441) | FD-WO-016 | SV-8278 | SV-8278 | already-correct |
| [C29917](https://shopview.testrail.io/index.php?/cases/view/29917) | FD-TMPL-018 | SV-8283 | SV-8283 | already-correct |
| [C29918](https://shopview.testrail.io/index.php?/cases/view/29918) | FD-PSALE-001 | SV-8287 | SV-8287 | already-correct |
| [C29922](https://shopview.testrail.io/index.php?/cases/view/29922) | FD-PERM-012 | SV-8289 | SV-8289 | already-correct |
| [C29923](https://shopview.testrail.io/index.php?/cases/view/29923) | FD-PERM-013 | SV-8289 | SV-8289 | already-correct |

## Simple Flow — 184 cases (180 live-verified + 4 flagged)

- Cases in scope: **184**
- Newly set / changed: **56**
- Already correct (no-op): **124**
- Could not write (case absent in live TestRail): **4**

| Case | Internal ID | Before refs | After refs | Result |
|---|---|---|---|---|
| [C29275](https://shopview.testrail.io/index.php?/cases/view/29275) | SF-SET-01 | SV-7696 | SV-7696 | already-correct |
| [C29276](https://shopview.testrail.io/index.php?/cases/view/29276) | SF-SET-02 | SV-7696 | SV-7696 | already-correct |
| [C29277](https://shopview.testrail.io/index.php?/cases/view/29277) | SF-SET-03 | — | SV-7696 | **ABSENT in TestRail — refs recorded locally only** |
| [C29278](https://shopview.testrail.io/index.php?/cases/view/29278) | SF-SET-04 | SV-7696 | SV-7696 | already-correct |
| [C29279](https://shopview.testrail.io/index.php?/cases/view/29279) | SF-SET-05 | SV-7696 | SV-7696 | already-correct |
| [C29280](https://shopview.testrail.io/index.php?/cases/view/29280) | SF-SET-06 | SV-7696 | SV-7696 | already-correct |
| [C29281](https://shopview.testrail.io/index.php?/cases/view/29281) | SF-SET-07 | SV-7696 | SV-7696 | already-correct |
| [C29282](https://shopview.testrail.io/index.php?/cases/view/29282) | SF-SET-08 | — | SV-7696 | **ABSENT in TestRail — refs recorded locally only** |
| [C29283](https://shopview.testrail.io/index.php?/cases/view/29283) | SF-SET-09 | SV-7696 | SV-7696 | already-correct |
| [C29284](https://shopview.testrail.io/index.php?/cases/view/29284) | SF-SET-10 | SV-7696 | SV-7696 | already-correct |
| [C29285](https://shopview.testrail.io/index.php?/cases/view/29285) | SF-SET-11 | SV-7696 | SV-7696 | already-correct |
| [C29286](https://shopview.testrail.io/index.php?/cases/view/29286) | SF-SET-12 | SV-7696 | SV-7696 | already-correct |
| [C29287](https://shopview.testrail.io/index.php?/cases/view/29287) | SF-SET-13 | SV-7696 | SV-7696 | already-correct |
| [C29288](https://shopview.testrail.io/index.php?/cases/view/29288) | SF-SET-14 | SV-7696 | SV-7696 | already-correct |
| [C29289](https://shopview.testrail.io/index.php?/cases/view/29289) | SF-SET-15 | SV-7696 | SV-7696 | already-correct |
| [C29290](https://shopview.testrail.io/index.php?/cases/view/29290) | SF-COMP-01 | SV-7697 | SV-7697 | already-correct |
| [C29291](https://shopview.testrail.io/index.php?/cases/view/29291) | SF-COMP-02 | SV-7697 | SV-7697 | already-correct |
| [C29292](https://shopview.testrail.io/index.php?/cases/view/29292) | SF-COMP-03 | SV-7697,SV-7710 | SV-7697,SV-7710 | already-correct |
| [C29293](https://shopview.testrail.io/index.php?/cases/view/29293) | SF-COMP-04 | SV-7697,SV-7710 | SV-7697,SV-7710 | already-correct |
| [C29294](https://shopview.testrail.io/index.php?/cases/view/29294) | SF-COMP-05 | SV-7697 | SV-7697 | already-correct |
| [C29295](https://shopview.testrail.io/index.php?/cases/view/29295) | SF-COMP-06 | — | SV-7697 | **ABSENT in TestRail — refs recorded locally only** |
| [C29296](https://shopview.testrail.io/index.php?/cases/view/29296) | SF-COMP-07 | SV-7697 | SV-7697 | already-correct |
| [C29297](https://shopview.testrail.io/index.php?/cases/view/29297) | SF-COMP-08 | SV-7697 | SV-7697 | already-correct |
| [C29298](https://shopview.testrail.io/index.php?/cases/view/29298) | SF-COMP-09 | SV-7697,SV-7870 | SV-7697,SV-7870 | already-correct |
| [C29299](https://shopview.testrail.io/index.php?/cases/view/29299) | SF-COMP-10 | SV-7697 | SV-7697 | already-correct |
| [C29300](https://shopview.testrail.io/index.php?/cases/view/29300) | SF-COMP-11 | SV-7698 | SV-7698 | already-correct |
| [C29301](https://shopview.testrail.io/index.php?/cases/view/29301) | SF-COMP-12 | SV-7698 | SV-7698 | already-correct |
| [C29302](https://shopview.testrail.io/index.php?/cases/view/29302) | SF-COMP-13 | SV-7698 | SV-7698 | already-correct |
| [C29303](https://shopview.testrail.io/index.php?/cases/view/29303) | SF-COMP-14 | SV-7698 | SV-7698 | already-correct |
| [C29304](https://shopview.testrail.io/index.php?/cases/view/29304) | SF-COMP-15 | SV-7698 | SV-7698 | already-correct |
| [C29305](https://shopview.testrail.io/index.php?/cases/view/29305) | SF-COMP-16 | SV-7698 | SV-7698 | already-correct |
| [C29306](https://shopview.testrail.io/index.php?/cases/view/29306) | SF-COMP-17 | SV-7698 | SV-7698 | already-correct |
| [C29307](https://shopview.testrail.io/index.php?/cases/view/29307) | SF-COMP-18 | SV-7699 | SV-7699 | already-correct |
| [C29308](https://shopview.testrail.io/index.php?/cases/view/29308) | SF-COMP-19 | SV-7699 | SV-7699 | already-correct |
| [C29309](https://shopview.testrail.io/index.php?/cases/view/29309) | SF-COMP-20 | SV-7699 | SV-7699 | already-correct |
| [C29310](https://shopview.testrail.io/index.php?/cases/view/29310) | SF-COMP-21 | SV-7698,SV-7699 | SV-7698,SV-7699 | already-correct |
| [C29311](https://shopview.testrail.io/index.php?/cases/view/29311) | SF-COMP-22 | SV-7699 | SV-7699 | already-correct |
| [C29312](https://shopview.testrail.io/index.php?/cases/view/29312) | SF-COMP-23 | SV-7698 | SV-7698 | already-correct |
| [C29313](https://shopview.testrail.io/index.php?/cases/view/29313) | SF-CORE-01 | SV-7698,SV-7699 | SV-7698,SV-7699 | already-correct |
| [C29314](https://shopview.testrail.io/index.php?/cases/view/29314) | SF-CORE-02 | SV-7698 | SV-7698 | already-correct |
| [C29315](https://shopview.testrail.io/index.php?/cases/view/29315) | SF-CORE-03 | SV-8353 | SV-8353 | already-correct |
| [C29316](https://shopview.testrail.io/index.php?/cases/view/29316) | SF-CORE-04 | SV-8353 | SV-8353 | already-correct |
| [C29319](https://shopview.testrail.io/index.php?/cases/view/29319) | SF-CORE-07 | SV-8353 | SV-8353 | already-correct |
| [C29320](https://shopview.testrail.io/index.php?/cases/view/29320) | SF-CORE-08 | SV-8353 | SV-8353 | already-correct |
| [C29322](https://shopview.testrail.io/index.php?/cases/view/29322) | SF-CORE-10 | SV-7301 | SV-8353 | set |
| [C29323](https://shopview.testrail.io/index.php?/cases/view/29323) | SF-TECH-01 | SV-7876 | SV-7876 | already-correct |
| [C29324](https://shopview.testrail.io/index.php?/cases/view/29324) | SF-TECH-02 | SV-7876 | SV-7876 | already-correct |
| [C29325](https://shopview.testrail.io/index.php?/cases/view/29325) | SF-TECH-03 | SV-7876 | SV-7876 | already-correct |
| [C29326](https://shopview.testrail.io/index.php?/cases/view/29326) | SF-TECH-04 | SV-7876 | SV-7876 | already-correct |
| [C29327](https://shopview.testrail.io/index.php?/cases/view/29327) | SF-TECH-05 | SV-7876 | SV-7876 | already-correct |
| [C29328](https://shopview.testrail.io/index.php?/cases/view/29328) | SF-TECH-06 | SV-7876 | SV-7876 | already-correct |
| [C29329](https://shopview.testrail.io/index.php?/cases/view/29329) | SF-TECH-07 | SV-7876 | SV-7876 | already-correct |
| [C29330](https://shopview.testrail.io/index.php?/cases/view/29330) | SF-TECH-08 | SV-7710 | SV-7710 | already-correct |
| [C29331](https://shopview.testrail.io/index.php?/cases/view/29331) | SF-VPART-01 | SV-7700 | SV-7700 | already-correct |
| [C29332](https://shopview.testrail.io/index.php?/cases/view/29332) | SF-VPART-02 | SV-7700 | SV-7700 | already-correct |
| [C29333](https://shopview.testrail.io/index.php?/cases/view/29333) | SF-VPART-03 | SV-7700 | SV-7700 | already-correct |
| [C29334](https://shopview.testrail.io/index.php?/cases/view/29334) | SF-VPART-04 | SV-7700 | SV-7700 | already-correct |
| [C29335](https://shopview.testrail.io/index.php?/cases/view/29335) | SF-VPART-05 | SV-7700 | SV-7700 | already-correct |
| [C29336](https://shopview.testrail.io/index.php?/cases/view/29336) | SF-VPART-06 | SV-7700 | SV-7700 | already-correct |
| [C29337](https://shopview.testrail.io/index.php?/cases/view/29337) | SF-VPART-07 | SV-7700 | SV-7700 | already-correct |
| [C29338](https://shopview.testrail.io/index.php?/cases/view/29338) | SF-VMIS-01 | SV-7701 | SV-7701 | already-correct |
| [C29339](https://shopview.testrail.io/index.php?/cases/view/29339) | SF-VMIS-02 | SV-7701 | SV-7701 | already-correct |
| [C29340](https://shopview.testrail.io/index.php?/cases/view/29340) | SF-VMIS-03 | SV-7701 | SV-7701 | already-correct |
| [C29341](https://shopview.testrail.io/index.php?/cases/view/29341) | SF-VMIS-04 | SV-7701 | SV-7701 | already-correct |
| [C29342](https://shopview.testrail.io/index.php?/cases/view/29342) | SF-VMIS-05 | SV-7701 | SV-7701 | already-correct |
| [C29343](https://shopview.testrail.io/index.php?/cases/view/29343) | SF-VMIS-06 | SV-7701 | SV-7701 | already-correct |
| [C29344](https://shopview.testrail.io/index.php?/cases/view/29344) | SF-POSEL-01 | SV-7702 | SV-7702 | already-correct |
| [C29345](https://shopview.testrail.io/index.php?/cases/view/29345) | SF-POSEL-02 | SV-7702 | SV-7702 | already-correct |
| [C29346](https://shopview.testrail.io/index.php?/cases/view/29346) | SF-POSEL-03 | SV-7702 | SV-7702 | already-correct |
| [C29347](https://shopview.testrail.io/index.php?/cases/view/29347) | SF-POSEL-04 | SV-7702 | SV-7702 | already-correct |
| [C29348](https://shopview.testrail.io/index.php?/cases/view/29348) | SF-POSEL-05 | SV-7702 | SV-7702 | already-correct |
| [C29349](https://shopview.testrail.io/index.php?/cases/view/29349) | SF-POSEL-06 | SV-7702 | SV-7702 | already-correct |
| [C29350](https://shopview.testrail.io/index.php?/cases/view/29350) | SF-BULK-01 | SV-7703 | SV-7703 | already-correct |
| [C29351](https://shopview.testrail.io/index.php?/cases/view/29351) | SF-BULK-02 | SV-7703 | SV-7703 | already-correct |
| [C29352](https://shopview.testrail.io/index.php?/cases/view/29352) | SF-BULK-03 | SV-7703 | SV-7703 | already-correct |
| [C29353](https://shopview.testrail.io/index.php?/cases/view/29353) | SF-BULK-04 | SV-7703 | SV-7703 | already-correct |
| [C29354](https://shopview.testrail.io/index.php?/cases/view/29354) | SF-BULK-05 | SV-7703 | SV-7703 | already-correct |
| [C29355](https://shopview.testrail.io/index.php?/cases/view/29355) | SF-BULK-06 | SV-7703,SV-7705 | SV-7703,SV-7705 | already-correct |
| [C29356](https://shopview.testrail.io/index.php?/cases/view/29356) | SF-BULK-07 | SV-7703 | SV-7703 | already-correct |
| [C29357](https://shopview.testrail.io/index.php?/cases/view/29357) | SF-BULK-08 | SV-7703 | SV-7703 | already-correct |
| [C29358](https://shopview.testrail.io/index.php?/cases/view/29358) | SF-BULK-09 | SV-7703 | SV-7703 | already-correct |
| [C29359](https://shopview.testrail.io/index.php?/cases/view/29359) | SF-BULK-10 | SV-8353 | SV-8353 | already-correct |
| [C29360](https://shopview.testrail.io/index.php?/cases/view/29360) | SF-INV-01 | SV-7704 | SV-7704 | already-correct |
| [C29361](https://shopview.testrail.io/index.php?/cases/view/29361) | SF-INV-02 | SV-7704 | SV-7704 | already-correct |
| [C29362](https://shopview.testrail.io/index.php?/cases/view/29362) | SF-INV-03 | SV-7704 | SV-7704 | already-correct |
| [C29363](https://shopview.testrail.io/index.php?/cases/view/29363) | SF-PNFIX-01 | SV-7705 | SV-7705 | already-correct |
| [C29364](https://shopview.testrail.io/index.php?/cases/view/29364) | SF-PNFIX-02 | SV-7705 | SV-7705 | already-correct |
| [C29365](https://shopview.testrail.io/index.php?/cases/view/29365) | SF-PNFIX-03 | SV-7705 | SV-7705 | already-correct |
| [C29366](https://shopview.testrail.io/index.php?/cases/view/29366) | SF-PNFIX-04 | SV-7703,SV-7705 | SV-7703,SV-7705 | already-correct |
| [C29367](https://shopview.testrail.io/index.php?/cases/view/29367) | SF-PNFIX-05 | SV-7705,SV-7708 | SV-7705,SV-7708 | already-correct |
| [C29368](https://shopview.testrail.io/index.php?/cases/view/29368) | SF-PNFIX-06 | SV-7705 | SV-7705 | already-correct |
| [C29369](https://shopview.testrail.io/index.php?/cases/view/29369) | SF-RCV-01 | SV-7706 | SV-7706 | already-correct |
| [C29370](https://shopview.testrail.io/index.php?/cases/view/29370) | SF-RCV-02 | SV-7706 | SV-7706 | already-correct |
| [C29371](https://shopview.testrail.io/index.php?/cases/view/29371) | SF-RCV-03 | SV-7706 | SV-7706 | already-correct |
| [C29372](https://shopview.testrail.io/index.php?/cases/view/29372) | SF-RCV-04 | SV-7707 | SV-7707 | already-correct |
| [C29373](https://shopview.testrail.io/index.php?/cases/view/29373) | SF-RCV-05 | SV-7707 | SV-7707 | already-correct |
| [C29374](https://shopview.testrail.io/index.php?/cases/view/29374) | SF-RCV-06 | SV-7707,SV-7708 | SV-7707,SV-7708 | already-correct |
| [C29375](https://shopview.testrail.io/index.php?/cases/view/29375) | SF-RCV-07 | SV-7707 | SV-7707 | already-correct |
| [C29376](https://shopview.testrail.io/index.php?/cases/view/29376) | SF-RCV-08 | SV-7707 | SV-7707 | already-correct |
| [C29377](https://shopview.testrail.io/index.php?/cases/view/29377) | SF-RCV-09 | SV-7707 | SV-7707 | already-correct |
| [C29378](https://shopview.testrail.io/index.php?/cases/view/29378) | SF-VEND-01 | SV-7708 | SV-7708 | already-correct |
| [C29379](https://shopview.testrail.io/index.php?/cases/view/29379) | SF-VEND-02 | SV-7708 | SV-7708 | already-correct |
| [C29380](https://shopview.testrail.io/index.php?/cases/view/29380) | SF-VEND-03 | SV-7708 | SV-7708 | already-correct |
| [C29381](https://shopview.testrail.io/index.php?/cases/view/29381) | SF-VEND-04 | SV-7708 | SV-7708 | already-correct |
| [C29382](https://shopview.testrail.io/index.php?/cases/view/29382) | SF-VEND-05 | SV-7708 | SV-7708 | already-correct |
| [C29383](https://shopview.testrail.io/index.php?/cases/view/29383) | SF-WOP-01 | SV-7709 | SV-7709 | already-correct |
| [C29384](https://shopview.testrail.io/index.php?/cases/view/29384) | SF-WOP-02 | SV-7709 | SV-7709 | already-correct |
| [C29385](https://shopview.testrail.io/index.php?/cases/view/29385) | SF-WOP-03 | SV-7709 | SV-7709 | already-correct |
| [C29386](https://shopview.testrail.io/index.php?/cases/view/29386) | SF-REV-01 | SV-7870 | SV-7870 | already-correct |
| [C29387](https://shopview.testrail.io/index.php?/cases/view/29387) | SF-REV-02 | SV-7870 | SV-7870 | already-correct |
| [C29388](https://shopview.testrail.io/index.php?/cases/view/29388) | SF-REV-03 | SV-7870 | SV-7870 | already-correct |
| [C29389](https://shopview.testrail.io/index.php?/cases/view/29389) | SF-REV-04 | SV-7870 | SV-7870 | already-correct |
| [C29390](https://shopview.testrail.io/index.php?/cases/view/29390) | SF-REV-05 | SV-7870 | SV-7870 | already-correct |
| [C29391](https://shopview.testrail.io/index.php?/cases/view/29391) | SF-REV-06 | SV-7870 | SV-7870 | already-correct |
| [C29392](https://shopview.testrail.io/index.php?/cases/view/29392) | SF-REV-07 | SV-7870 | SV-7870 | already-correct |
| [C29393](https://shopview.testrail.io/index.php?/cases/view/29393) | SF-REV-08 | SV-7870 | SV-7870 | already-correct |
| [C29394](https://shopview.testrail.io/index.php?/cases/view/29394) | SF-REV-09 | SV-7870 | SV-7870 | already-correct |
| [C29395](https://shopview.testrail.io/index.php?/cases/view/29395) | SF-REV-10 | SV-7870 | SV-7870 | already-correct |
| [C29396](https://shopview.testrail.io/index.php?/cases/view/29396) | SF-REV-11 | SV-7870 | SV-7870 | already-correct |
| [C29397](https://shopview.testrail.io/index.php?/cases/view/29397) | SF-REV-12 | SV-7870 | SV-7870 | already-correct |
| [C29398](https://shopview.testrail.io/index.php?/cases/view/29398) | SF-REV-13 | SV-7870 | SV-7870 | already-correct |
| [C29399](https://shopview.testrail.io/index.php?/cases/view/29399) | SF-REV-14 | SV-7870,SV-8353 | SV-7870,SV-8353 | already-correct |
| [C29400](https://shopview.testrail.io/index.php?/cases/view/29400) | SF-REV-15 | SV-7870 | SV-7870 | already-correct |
| [C29401](https://shopview.testrail.io/index.php?/cases/view/29401) | SF-UX-01 | SV-7710 | SV-7710 | already-correct |
| [C29402](https://shopview.testrail.io/index.php?/cases/view/29402) | SF-UX-02 | SV-7710 | SV-7710 | already-correct |
| [C29403](https://shopview.testrail.io/index.php?/cases/view/29403) | SF-UX-03 | SV-7710 | SV-7710 | already-correct |
| [C29404](https://shopview.testrail.io/index.php?/cases/view/29404) | SF-UX-04 | SV-7710 | SV-7710 | already-correct |
| [C29405](https://shopview.testrail.io/index.php?/cases/view/29405) | SF-PERM-01 | SV-7696 | SV-7696 | already-correct |
| [C29406](https://shopview.testrail.io/index.php?/cases/view/29406) | SF-PERM-02 | §8 Permissions | SV-8183 | set |
| [C29407](https://shopview.testrail.io/index.php?/cases/view/29407) | SF-PERM-03 | §8 Permissions | SV-8183 | set |
| [C29408](https://shopview.testrail.io/index.php?/cases/view/29408) | SF-PERM-04 | SV-7870 (R7 / §8 role-gating review) | SV-8183 | set |
| [C29409](https://shopview.testrail.io/index.php?/cases/view/29409) | SF-PERM-05 | SV-7706 (S11-R3) | SV-7706 | set |
| [C29410](https://shopview.testrail.io/index.php?/cases/view/29410) | SF-PERM-06 | §8 BE enforcement | SV-8183 | set |
| [C29411](https://shopview.testrail.io/index.php?/cases/view/29411) | SF-PERM-07 | §8 role-gating review | SV-8183 | set |
| [C29412](https://shopview.testrail.io/index.php?/cases/view/29412) | SF-PERM-08 | SV-7870 (R7 (review sign-off) — self-review permission-gated (identity rule NOT in v1)) | SV-8183 | set |
| [C29413](https://shopview.testrail.io/index.php?/cases/view/29413) | SF-PERM-09 | SV-7700 (S5 / §9 (See Financial Data gate)) | SV-7700 | set |
| [C29414](https://shopview.testrail.io/index.php?/cases/view/29414) | SF-PERM-10 | §9 per-role completion matrix | SV-8183 | set |
| [C29415](https://shopview.testrail.io/index.php?/cases/view/29415) | SF-VAL-01 | SV-7697,SV-7698,SV-7699 (S2-R2 / S3-R3 / S4-R3) | SV-7697,SV-7698,SV-7699 | set |
| [C29416](https://shopview.testrail.io/index.php?/cases/view/29416) | SF-VAL-02 | SV-7698,SV-7699,SV-7710 (S15-R2 / S3-R3 / S4-R3) | SV-7698,SV-7699,SV-7710 | set |
| [C29417](https://shopview.testrail.io/index.php?/cases/view/29417) | SF-VAL-03 | SV-7698,SV-7699 (S3-R3 / S4-R3) | SV-7698,SV-7699 | set |
| [C29418](https://shopview.testrail.io/index.php?/cases/view/29418) | SF-VAL-04 | SV-7876 (TS-R4) | SV-7876 | set |
| [C29419](https://shopview.testrail.io/index.php?/cases/view/29419) | SF-VAL-05 | SV-7698,SV-7699 (S3-R3 / S4-R5 / §4) | SV-7698,SV-7699 | set |
| [C29420](https://shopview.testrail.io/index.php?/cases/view/29420) | SF-VAL-06 | SV-7705,SV-7707,SV-7708 (S10 / S12-R2 / S13-R6 / S13-R7) | SV-7705,SV-7707,SV-7708 | set |
| [C29421](https://shopview.testrail.io/index.php?/cases/view/29421) | SF-VAL-07 | SV-7870 (R7) | SV-7870 | set |
| [C29422](https://shopview.testrail.io/index.php?/cases/view/29422) | SF-VAL-08 | SV-7698 (S3-R9 (idempotency)) | SV-7698 | set |
| [C29423](https://shopview.testrail.io/index.php?/cases/view/29423) | SF-VAL-09 | SV-7703 (S8-R7 / §4 field locking) | SV-7703 | set |
| [C29424](https://shopview.testrail.io/index.php?/cases/view/29424) | SF-VAL-10 | SV-7704 (S9-R3 / §4 (uniqueness relaxed)) | SV-7704 | set |
| [C29425](https://shopview.testrail.io/index.php?/cases/view/29425) | SF-VAL-11 | SV-7698,SV-7699 (S4-R8 / S3-R9 / Key Decision (line approval)) | SV-7698,SV-7699 | set |
| [C29426](https://shopview.testrail.io/index.php?/cases/view/29426) | SF-QB-01 | §5 invariant 1 | SV-7301 | set |
| [C29427](https://shopview.testrail.io/index.php?/cases/view/29427) | SF-QB-02 | — | SV-7696 | **ABSENT in TestRail — refs recorded locally only** |
| [C29428](https://shopview.testrail.io/index.php?/cases/view/29428) | SF-QB-03 | §5 invariant 2 | SV-7301 | set |
| [C29429](https://shopview.testrail.io/index.php?/cases/view/29429) | SF-QB-04 | §5 (vendorless/no-PN) | SV-7701 | set |
| [C29430](https://shopview.testrail.io/index.php?/cases/view/29430) | SF-QB-05 | SV-7701 (§5 / S6-R3) | SV-7701 | set |
| [C29431](https://shopview.testrail.io/index.php?/cases/view/29431) | SF-QB-06 | §8 (cost at completion) | SV-7301 | set |
| [C29432](https://shopview.testrail.io/index.php?/cases/view/29432) | SF-QB-07 | §5 (Journal Entry / Inventory → QBO) | SV-7301 | set |
| [C29433](https://shopview.testrail.io/index.php?/cases/view/29433) | SF-QB-08 | §5 invariant 3 | SV-7705 | set |
| [C29439](https://shopview.testrail.io/index.php?/cases/view/29439) | SF-VMIS-07 | SV-7701 (S6-R7) | SV-7701 | set |
| [C29440](https://shopview.testrail.io/index.php?/cases/view/29440) | SF-RCV-10 | SV-7707 (S12-R5) | SV-7707 | set |
| [C29442](https://shopview.testrail.io/index.php?/cases/view/29442) | SF-VEND-06 | SV-7708 (S13-R7) | SV-7708 | set |
| [C29461](https://shopview.testrail.io/index.php?/cases/view/29461) | SF-AUTO-01 | SV-7870 (Story 16 R12/R13) | SV-7870 | set |
| [C29462](https://shopview.testrail.io/index.php?/cases/view/29462) | SF-AUTO-02 | SV-7870 (Story 16 R12/R13) | SV-7870 | set |
| [C29463](https://shopview.testrail.io/index.php?/cases/view/29463) | SF-AUTO-03 | SV-7870 (Story 16 R12/R13) | SV-7870 | set |
| [C29464](https://shopview.testrail.io/index.php?/cases/view/29464) | SF-AUTO-04 | SV-7870 (Story 16 R12/R13) | SV-7870 | set |
| [C29465](https://shopview.testrail.io/index.php?/cases/view/29465) | SF-AUTO-05 | SV-7870 (Story 16 R12/R13) | SV-7870 | set |
| [C29466](https://shopview.testrail.io/index.php?/cases/view/29466) | SF-AUTO-06 | SV-7870 (Story 16 R12/R13) | SV-7870 | set |
| [C29467](https://shopview.testrail.io/index.php?/cases/view/29467) | SF-AUTO-07 | SV-7870 (Story 16 R12/R13) | SV-7870 | set |
| [C29892](https://shopview.testrail.io/index.php?/cases/view/29892) | SF-CORE-11 | SV-8353 (S18 C-R1) | SV-8353 | set |
| [C29893](https://shopview.testrail.io/index.php?/cases/view/29893) | SF-CORE-12 | SV-8353 (S18 C-R3) | SV-8353 | set |
| [C29894](https://shopview.testrail.io/index.php?/cases/view/29894) | SF-CORE-13 | SV-8353 (S18 C-R4) | SV-8353 | set |
| [C29895](https://shopview.testrail.io/index.php?/cases/view/29895) | SF-CORE-14 | SV-8353 (S18 C-R5) | SV-8353 | set |
| [C29896](https://shopview.testrail.io/index.php?/cases/view/29896) | SF-CORE-15 | SV-8353 (S18 C-R8) | SV-8353 | set |
| [C29897](https://shopview.testrail.io/index.php?/cases/view/29897) | SF-CORE-16 | SV-8353 (S18 C-R9) | SV-8353 | set |
| [C29898](https://shopview.testrail.io/index.php?/cases/view/29898) | SF-CORE-17 | SV-8353 (S18 AC — resolution immutable with active invoice) | SV-8353 | set |
| [C29899](https://shopview.testrail.io/index.php?/cases/view/29899) | SF-CORE-18 | SV-8353 (S18 C-R2 / technical plan) | SV-8353 | set |
| [C29900](https://shopview.testrail.io/index.php?/cases/view/29900) | SF-CORE-19 | SV-8353 (S18 C-R10) | SV-8353 | set |
| [C29901](https://shopview.testrail.io/index.php?/cases/view/29901) | SF-RCV-11 | SV-7706 (S11-R4) | SV-7698,SV-7706 | set |
| [C29902](https://shopview.testrail.io/index.php?/cases/view/29902) | SF-RCV-12 | SV-7707 (S12-R6) | SV-7707 | set |
| [C29903](https://shopview.testrail.io/index.php?/cases/view/29903) | SF-RCV-13 | SV-7707 (S12-R6) | SV-7707 | set |
| [C29904](https://shopview.testrail.io/index.php?/cases/view/29904) | SF-VEND-07 | SV-7708 (S13-R8) | SV-7708 | set |
| [C29905](https://shopview.testrail.io/index.php?/cases/view/29905) | SF-VEND-08 | SV-7708 (S13-R8) | SV-7708 | set |
| [C29906](https://shopview.testrail.io/index.php?/cases/view/29906) | SF-POSEL-07 | SV-7702 (Story 7 AC — part-sale POs) | SV-7702 | set |
| [C29907](https://shopview.testrail.io/index.php?/cases/view/29907) | SF-BULK-11 | SV-7703 (Story 8 AC — part-sale POs) | SV-7703 | set |
| [C29908](https://shopview.testrail.io/index.php?/cases/view/29908) | SF-WOP-04 | SV-7709 (§8 Part Sales — confirmed) | SV-7709 | set |
| [C29909](https://shopview.testrail.io/index.php?/cases/view/29909) | SF-QB-09 | SV-7702,SV-7703 (§8 Part Sales — confirmed) | SV-7702,SV-7703 | set |

## Data-integrity flag — 4 Simple Flow id-map C-IDs absent in live TestRail

These four cases are **active in the local suite** (viu_status Deviation / awaiting-Milos) but their id-map C-IDs return HTTP 400 *"Field :case_id is not a valid test case"* — the case numbers are gaps between present neighbours, i.e. they were created then **deleted** from TestRail. Their authentic per-story refs are recorded in the id-map `refs` column; they cannot be pushed until the cases exist. **Decision needed:** re-create in TestRail (then push refs) or drop from the local id-map.

| id-map C-ID | Internal ID | Title | Authentic ticket | Spec anchor |
|---|---|---|---|---|
| C29277 | SF-SET-03 | Verify a 'Create Purchase Orders' toggle exists on the Work Orders tab and controls the Vendor Invoice setting | SV-7696 | Story 1 (S1-R2 Create Purchase Orders toggle) |
| C29282 | SF-SET-08 | Verify first-use defaults on a brand-new org (auto-approve OFF, create POs ON, vendor invoice REQUIRED) | SV-7696 | Story 1 (first-use defaults / §4) |
| C29295 | SF-COMP-06 | Verify with Create POs OFF a work order with vendor parts completes with no PO, no vendor bill and no AP sync | SV-7697 | Story 2 (S2-R6 Create-POs-OFF completion) |
| C29427 | SF-QB-02 | Verify Create POs OFF produces no PO, vendor bill or AP sync and no catalog/inventory sync | SV-7696 | Story 1 (S1-R2 Create-POs-OFF) / §5 integrity |
