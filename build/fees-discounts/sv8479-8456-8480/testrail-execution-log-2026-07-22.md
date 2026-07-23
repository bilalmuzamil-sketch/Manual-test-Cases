# Fees & Discounts — SV-8479 / SV-8480 TestRail Sync — EXECUTION LOG

**EXECUTED 2026-07-22** · Project 1 / suite 1 (Master) · Authorized by user 2026-07-22 (SV-8479/8480 push + retire 3).
Executor: `build/fees-discounts/exec_sync_2026-07-22.py`. Field mapping mirrors `testrail_viu_sync.py`/`gen_import.py`
(title, custom_preconds, custom_steps, custom_expected, refs; add_case also custom_atmstatus:3 + custom_automation_type:0).
**NO writes to any test run** (run 325 untouched). Creds from /tmp only (never committed).

## Result: 5 add_section + 18 add_case + 3 delete_case + 51 update_case — ALL HTTP 200, ALL re-GET verified.

### Sections created (prerequisite for the new parts-sale + API-calc cases; under group 3894 'Fees & Discounts')

| Section ID | Name |
|---|---|
| 4377 | Parts Sale — Fees & Discounts card |
| 4378 | Parts Sale — Financial Info card |
| 4379 | Part Sale — Fee/Discount dialog |
| 4380 | Parts Sale — Statistics tab |
| 4381 | API — Calculation contract |

### `add_case` — 18 net-new (all re-GET MATCH)

| FD ID | New TestRail Case | Detail | Timestamp (UTC) |
|---|---|---|---|
| FD-WO-017 | [C30618](https://shopview.testrail.io/index.php?/cases/view/30618) | section 3896 'Work Order — Labor-line Fee/Discount'; MATCH | 2026-07-23 07:00:18Z |
| FD-WO-018 | [C30619](https://shopview.testrail.io/index.php?/cases/view/30619) | section 3897 'Work Order / Parts — Part-line Fee/Discount'; MATCH | 2026-07-23 07:00:25Z |
| FD-WO-021 | [C30620](https://shopview.testrail.io/index.php?/cases/view/30620) | section 3901 'Work Order — Sidebar 'Work Order Fee / Discount' card'; MATCH | 2026-07-23 07:00:33Z |
| FD-WO-025 | [C30621](https://shopview.testrail.io/index.php?/cases/view/30621) | section 3895 'Work Order — Whole-WO Fee/Discount'; MATCH | 2026-07-23 07:00:40Z |
| FD-WO-028 | [C30622](https://shopview.testrail.io/index.php?/cases/view/30622) | section 3895 'Work Order — Whole-WO Fee/Discount'; MATCH | 2026-07-23 07:00:47Z |
| FD-PSALE-002 | [C30623](https://shopview.testrail.io/index.php?/cases/view/30623) | section 3902 'Parts page — 'FEES & DISCOUNTS' column'; MATCH | 2026-07-23 07:00:55Z |
| FD-PSALE-003 | [C30624](https://shopview.testrail.io/index.php?/cases/view/30624) | section 3902 'Parts page — 'FEES & DISCOUNTS' column'; MATCH | 2026-07-23 07:01:02Z |
| FD-PSALE-004 | [C30625](https://shopview.testrail.io/index.php?/cases/view/30625) | section 4377 'Parts Sale — Fees & Discounts card'; MATCH | 2026-07-23 07:01:09Z |
| FD-PSALE-006 | [C30626](https://shopview.testrail.io/index.php?/cases/view/30626) | section 4378 'Parts Sale — Financial Info card'; MATCH | 2026-07-23 07:01:16Z |
| FD-PSALE-008 | [C30627](https://shopview.testrail.io/index.php?/cases/view/30627) | section 4379 'Part Sale — Fee/Discount dialog'; MATCH | 2026-07-23 07:01:23Z |
| FD-PSALE-009 | [C30628](https://shopview.testrail.io/index.php?/cases/view/30628) | section 4380 'Parts Sale — Statistics tab'; MATCH | 2026-07-23 07:01:30Z |
| FD-CALC-018 | [C30629](https://shopview.testrail.io/index.php?/cases/view/30629) | section 3962 'Calculation contract'; MATCH | 2026-07-23 07:01:37Z |
| FD-CALC-019 | [C30630](https://shopview.testrail.io/index.php?/cases/view/30630) | section 3962 'Calculation contract'; MATCH | 2026-07-23 07:01:44Z |
| FD-CALC-020 | [C30631](https://shopview.testrail.io/index.php?/cases/view/30631) | section 3962 'Calculation contract'; MATCH | 2026-07-23 07:01:52Z |
| FD-CALC-021 | [C30632](https://shopview.testrail.io/index.php?/cases/view/30632) | section 3962 'Calculation contract'; MATCH | 2026-07-23 07:01:59Z |
| FD-CALC-022 | [C30633](https://shopview.testrail.io/index.php?/cases/view/30633) | section 3962 'Calculation contract'; MATCH | 2026-07-23 07:02:07Z |
| FD-CALC-023 | [C30634](https://shopview.testrail.io/index.php?/cases/view/30634) | section 3962 'Calculation contract'; MATCH | 2026-07-23 07:02:15Z |
| FD-CALC-024 | [C30635](https://shopview.testrail.io/index.php?/cases/view/30635) | section 4381 'API — Calculation contract'; MATCH | 2026-07-23 07:02:22Z |

### `delete_case` — 3 retired (verified gone)

| FD ID | Case | Detail | Timestamp (UTC) |
|---|---|---|---|
| FD-LABOR-003 | C28441 | deleted HTTP 200; re-GET HTTP 400 (gone) | 2026-07-23 07:02:28Z |
| FD-PCOL-003 | C28471 | deleted HTTP 200; re-GET HTTP 400 (gone) | 2026-07-23 07:02:35Z |
| FD-PCOL-007 | C28475 | deleted HTTP 200; re-GET HTTP 400 (gone) | 2026-07-23 07:02:42Z |

### `update_case` — 51 edited (all re-GET MATCH)

| FD ID | TestRail Case | Result | Timestamp (UTC) |
|---|---|---|---|
| FD-WO-001 | [C28424](https://shopview.testrail.io/index.php?/cases/view/28424) | MATCH | 2026-07-23 07:02:44Z |
| FD-WO-002 | [C28425](https://shopview.testrail.io/index.php?/cases/view/28425) | MATCH | 2026-07-23 07:02:45Z |
| FD-WO-003 | [C28426](https://shopview.testrail.io/index.php?/cases/view/28426) | MATCH | 2026-07-23 07:02:47Z |
| FD-WO-004 | [C28427](https://shopview.testrail.io/index.php?/cases/view/28427) | MATCH | 2026-07-23 07:02:49Z |
| FD-WO-005 | [C28428](https://shopview.testrail.io/index.php?/cases/view/28428) | MATCH | 2026-07-23 07:02:50Z |
| FD-WO-006 | [C28429](https://shopview.testrail.io/index.php?/cases/view/28429) | MATCH | 2026-07-23 07:02:52Z |
| FD-WO-007 | [C28430](https://shopview.testrail.io/index.php?/cases/view/28430) | MATCH | 2026-07-23 07:02:54Z |
| FD-WO-008 | [C28431](https://shopview.testrail.io/index.php?/cases/view/28431) | MATCH | 2026-07-23 07:02:56Z |
| FD-WO-009 | [C28432](https://shopview.testrail.io/index.php?/cases/view/28432) | MATCH | 2026-07-23 07:02:58Z |
| FD-WO-010 | [C28433](https://shopview.testrail.io/index.php?/cases/view/28433) | MATCH | 2026-07-23 07:02:59Z |
| FD-WO-011 | [C28434](https://shopview.testrail.io/index.php?/cases/view/28434) | MATCH | 2026-07-23 07:03:01Z |
| FD-WO-012 | [C28435](https://shopview.testrail.io/index.php?/cases/view/28435) | MATCH | 2026-07-23 07:03:03Z |
| FD-WO-013 | [C28436](https://shopview.testrail.io/index.php?/cases/view/28436) | MATCH | 2026-07-23 07:03:05Z |
| FD-WO-014 | [C28437](https://shopview.testrail.io/index.php?/cases/view/28437) | MATCH | 2026-07-23 07:03:07Z |
| FD-WO-015 | [C28438](https://shopview.testrail.io/index.php?/cases/view/28438) | MATCH | 2026-07-23 07:03:08Z |
| FD-LABOR-001 | [C28439](https://shopview.testrail.io/index.php?/cases/view/28439) | MATCH | 2026-07-23 07:03:11Z |
| FD-LABOR-002 | [C28440](https://shopview.testrail.io/index.php?/cases/view/28440) | MATCH | 2026-07-23 07:03:12Z |
| FD-LABOR-004 | [C28442](https://shopview.testrail.io/index.php?/cases/view/28442) | MATCH | 2026-07-23 07:03:14Z |
| FD-LABOR-007 | [C28445](https://shopview.testrail.io/index.php?/cases/view/28445) | MATCH | 2026-07-23 07:03:16Z |
| FD-PART-001 | [C28446](https://shopview.testrail.io/index.php?/cases/view/28446) | MATCH | 2026-07-23 07:03:18Z |
| FD-PART-002 | [C28447](https://shopview.testrail.io/index.php?/cases/view/28447) | MATCH | 2026-07-23 07:03:19Z |
| FD-PART-003 | [C28448](https://shopview.testrail.io/index.php?/cases/view/28448) | MATCH | 2026-07-23 07:03:21Z |
| FD-PART-004 | [C28449](https://shopview.testrail.io/index.php?/cases/view/28449) | MATCH | 2026-07-23 07:03:22Z |
| FD-INLINE-001 | [C28454](https://shopview.testrail.io/index.php?/cases/view/28454) | MATCH | 2026-07-23 07:03:24Z |
| FD-INLINE-002 | [C28455](https://shopview.testrail.io/index.php?/cases/view/28455) | MATCH | 2026-07-23 07:03:26Z |
| FD-INLINE-004 | [C28457](https://shopview.testrail.io/index.php?/cases/view/28457) | MATCH | 2026-07-23 07:03:27Z |
| FD-STATS-001 | [C28459](https://shopview.testrail.io/index.php?/cases/view/28459) | MATCH | 2026-07-23 07:03:29Z |
| FD-FIN-001 | [C28464](https://shopview.testrail.io/index.php?/cases/view/28464) | MATCH | 2026-07-23 07:03:31Z |
| FD-FIN-004 | [C28467](https://shopview.testrail.io/index.php?/cases/view/28467) | MATCH | 2026-07-23 07:03:33Z |
| FD-PCOL-002 | [C28470](https://shopview.testrail.io/index.php?/cases/view/28470) | MATCH | 2026-07-23 07:03:34Z |
| FD-PCOL-006 | [C28474](https://shopview.testrail.io/index.php?/cases/view/28474) | MATCH | 2026-07-23 07:03:36Z |
| FD-STACK-003 | [C28484](https://shopview.testrail.io/index.php?/cases/view/28484) | MATCH | 2026-07-23 07:03:38Z |
| FD-TMPL-010 | [C28511](https://shopview.testrail.io/index.php?/cases/view/28511) | MATCH | 2026-07-23 07:03:40Z |
| FD-PROC-005 | [C28523](https://shopview.testrail.io/index.php?/cases/view/28523) | MATCH | 2026-07-23 07:03:41Z |
| FD-CALC-001 | [C28568](https://shopview.testrail.io/index.php?/cases/view/28568) | MATCH | 2026-07-23 07:03:43Z |
| FD-CALC-002 | [C28569](https://shopview.testrail.io/index.php?/cases/view/28569) | MATCH | 2026-07-23 07:03:45Z |
| FD-CALC-003 | [C28570](https://shopview.testrail.io/index.php?/cases/view/28570) | MATCH | 2026-07-23 07:03:47Z |
| FD-CALC-004 | [C28571](https://shopview.testrail.io/index.php?/cases/view/28571) | MATCH | 2026-07-23 07:03:48Z |
| FD-CALC-005 | [C28572](https://shopview.testrail.io/index.php?/cases/view/28572) | MATCH | 2026-07-23 07:03:50Z |
| FD-CALC-006 | [C28573](https://shopview.testrail.io/index.php?/cases/view/28573) | MATCH | 2026-07-23 07:03:52Z |
| FD-CALC-007 | [C28574](https://shopview.testrail.io/index.php?/cases/view/28574) | MATCH | 2026-07-23 07:03:53Z |
| FD-CALC-008 | [C28575](https://shopview.testrail.io/index.php?/cases/view/28575) | MATCH | 2026-07-23 07:03:55Z |
| FD-PERM-011 | [C28595](https://shopview.testrail.io/index.php?/cases/view/28595) | MATCH | 2026-07-23 07:03:57Z |
| FD-VAL-001 | [C28599](https://shopview.testrail.io/index.php?/cases/view/28599) | MATCH | 2026-07-23 07:03:58Z |
| FD-VAL-002 | [C28600](https://shopview.testrail.io/index.php?/cases/view/28600) | MATCH | 2026-07-23 07:04:00Z |
| FD-VAL-003 | [C28601](https://shopview.testrail.io/index.php?/cases/view/28601) | MATCH | 2026-07-23 07:04:02Z |
| FD-VAL-004 | [C28602](https://shopview.testrail.io/index.php?/cases/view/28602) | MATCH | 2026-07-23 07:04:04Z |
| FD-VAL-005 | [C28603](https://shopview.testrail.io/index.php?/cases/view/28603) | MATCH | 2026-07-23 07:04:06Z |
| FD-VAL-006 | [C28604](https://shopview.testrail.io/index.php?/cases/view/28604) | MATCH | 2026-07-23 07:04:07Z |
| FD-WO-016 | [C29441](https://shopview.testrail.io/index.php?/cases/view/29441) | MATCH | 2026-07-23 07:04:09Z |
| FD-PSALE-001 | [C29918](https://shopview.testrail.io/index.php?/cases/view/29918) | MATCH | 2026-07-23 07:04:11Z |

## Post-sync tally (199 active authored)

- **165 VIU-Verified / 12 VIU-Deviation / 21 VIU-Blocked-Env / 1 VIU-Pending (FD-PART-005) = 199 ACTIVE.**
- (202 active pre-retire − 3 retired = 199; +2 dev-authored FD-PERM-012/013 = 201 in id-map; FD-CUST-016 + the 3 new retirements kept in JSON marked Retired, excluded from generators.)
- Deviation 13→12 (FD-LABOR-003 retired); Verified 167→165 (FD-PCOL-003/007 retired).
