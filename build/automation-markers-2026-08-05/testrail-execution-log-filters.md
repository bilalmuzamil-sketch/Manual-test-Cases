# Filters — automation-marker pass, per-operation audit log (5 August 2026)

`update_case` ONLY. **0 add_case · 0 delete_case · 0 section writes · 0 run writes.**

Every operation: one `update_case` writing **`custom_expected` only**, then a re-GET and a
**field-by-field byte comparison of all 30 fields** against the intended payload, with every field
the pass did not intend to change **proven byte-identical** to its pre-write snapshot (Standing Rule 50).
`refs` was **not written on any operation**, so the declared comma-normalisation exception did not arise.

| # | Case | C-id | Field written | HTTP | Byte-verify | Fields compared | Text before the marker byte-identical | Marker written |
|---|---|---|---|---|---|---|---|---|
| 1 | FLT-BAR-01 | [C29557](https://shopview.testrail.io/index.php?/cases/view/29557) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY - EXPECT FAIL (SV-8843 - closed as accepted, will not be fixed)` |
| 2 | FLT-BAR-02 | [C29558](https://shopview.testrail.io/index.php?/cases/view/29558) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 3 | FLT-BAR-03 | [C29559](https://shopview.testrail.io/index.php?/cases/view/29559) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 4 | FLT-STAT-01 | [C29560](https://shopview.testrail.io/index.php?/cases/view/29560) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 5 | FLT-STAT-02 | [C29561](https://shopview.testrail.io/index.php?/cases/view/29561) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 6 | FLT-STAT-03 | [C29562](https://shopview.testrail.io/index.php?/cases/view/29562) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 7 | FLT-STAT-04 | [C29563](https://shopview.testrail.io/index.php?/cases/view/29563) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 8 | FLT-STAT-05 | [C29564](https://shopview.testrail.io/index.php?/cases/view/29564) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 9 | FLT-STAT-06 | [C29565](https://shopview.testrail.io/index.php?/cases/view/29565) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 10 | FLT-STAT-07 | [C38877](https://shopview.testrail.io/index.php?/cases/view/38877) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 11 | FLT-CUST-01 | [C29566](https://shopview.testrail.io/index.php?/cases/view/29566) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 12 | FLT-CUST-02 | [C29567](https://shopview.testrail.io/index.php?/cases/view/29567) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 13 | FLT-CUST-03 | [C29568](https://shopview.testrail.io/index.php?/cases/view/29568) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 14 | FLT-CUST-04 | [C29569](https://shopview.testrail.io/index.php?/cases/view/29569) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 15 | FLT-CUST-05 | [C29570](https://shopview.testrail.io/index.php?/cases/view/29570) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 16 | FLT-CUST-06 | [C29571](https://shopview.testrail.io/index.php?/cases/view/29571) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 17 | FLT-CUST-07 | [C29572](https://shopview.testrail.io/index.php?/cases/view/29572) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 18 | FLT-CUST-08 | [C29573](https://shopview.testrail.io/index.php?/cases/view/29573) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 19 | FLT-CUST-09 | [C29574](https://shopview.testrail.io/index.php?/cases/view/29574) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 20 | FLT-TECH-01 | [C29575](https://shopview.testrail.io/index.php?/cases/view/29575) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 21 | FLT-TECH-02 | [C29576](https://shopview.testrail.io/index.php?/cases/view/29576) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 22 | FLT-TECH-03 | [C29577](https://shopview.testrail.io/index.php?/cases/view/29577) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 23 | FLT-TECH-04 | [C29578](https://shopview.testrail.io/index.php?/cases/view/29578) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 24 | FLT-TECH-05 | [C29579](https://shopview.testrail.io/index.php?/cases/view/29579) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 25 | FLT-TECH-06 | [C29580](https://shopview.testrail.io/index.php?/cases/view/29580) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 26 | FLT-TECH-07 | [C29581](https://shopview.testrail.io/index.php?/cases/view/29581) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 27 | FLT-ADV-01 | [C29582](https://shopview.testrail.io/index.php?/cases/view/29582) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 28 | FLT-ADV-02 | [C29583](https://shopview.testrail.io/index.php?/cases/view/29583) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 29 | FLT-ADV-03 | [C29584](https://shopview.testrail.io/index.php?/cases/view/29584) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 30 | FLT-ADV-04 | [C29585](https://shopview.testrail.io/index.php?/cases/view/29585) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 31 | FLT-ADV-05 | [C29586](https://shopview.testrail.io/index.php?/cases/view/29586) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 32 | FLT-ADV-06 | [C29587](https://shopview.testrail.io/index.php?/cases/view/29587) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 33 | FLT-ADV-07 | [C29588](https://shopview.testrail.io/index.php?/cases/view/29588) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 34 | FLT-ASSET-01 | [C29589](https://shopview.testrail.io/index.php?/cases/view/29589) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 35 | FLT-ASSET-02 | [C29590](https://shopview.testrail.io/index.php?/cases/view/29590) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 36 | FLT-ASSET-03 | [C29591](https://shopview.testrail.io/index.php?/cases/view/29591) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 37 | FLT-ASSET-04 | [C29592](https://shopview.testrail.io/index.php?/cases/view/29592) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 38 | FLT-ASSET-05 | [C29593](https://shopview.testrail.io/index.php?/cases/view/29593) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 39 | FLT-ASSET-06 | [C29594](https://shopview.testrail.io/index.php?/cases/view/29594) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 40 | FLT-ASSET-07 | [C38878](https://shopview.testrail.io/index.php?/cases/view/38878) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 41 | FLT-CHIP-01 | [C29595](https://shopview.testrail.io/index.php?/cases/view/29595) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 42 | FLT-CHIP-02 | [C29596](https://shopview.testrail.io/index.php?/cases/view/29596) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 43 | FLT-CHIP-03 | [C29597](https://shopview.testrail.io/index.php?/cases/view/29597) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 44 | FLT-CHIP-04 | [C29598](https://shopview.testrail.io/index.php?/cases/view/29598) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 45 | FLT-CHIP-05 | [C29599](https://shopview.testrail.io/index.php?/cases/view/29599) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 46 | FLT-CHIP-06 | [C29600](https://shopview.testrail.io/index.php?/cases/view/29600) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 47 | FLT-COLL-01 | [C29601](https://shopview.testrail.io/index.php?/cases/view/29601) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 48 | FLT-COLL-02 | [C29602](https://shopview.testrail.io/index.php?/cases/view/29602) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY - EXPECT FAIL (SV-8843 - closed as accepted, will not be fixed)` |
| 49 | FLT-COLL-03 | [C29603](https://shopview.testrail.io/index.php?/cases/view/29603) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 50 | FLT-COLL-04 | [C29604](https://shopview.testrail.io/index.php?/cases/view/29604) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 51 | FLT-COLL-05 | [C29605](https://shopview.testrail.io/index.php?/cases/view/29605) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 52 | FLT-EMPTY-01 | [C29606](https://shopview.testrail.io/index.php?/cases/view/29606) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY - EXPECT FAIL (SV-8847 - closed as accepted, will not be fixed)` |
| 53 | FLT-EMPTY-02 | [C29607](https://shopview.testrail.io/index.php?/cases/view/29607) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY - EXPECT FAIL (SV-8847 - closed as accepted, will not be fixed)` |
| 54 | FLT-EMPTY-03 | [C38897](https://shopview.testrail.io/index.php?/cases/view/38897) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 55 | FLT-TAB-01 | [C29608](https://shopview.testrail.io/index.php?/cases/view/29608) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 56 | FLT-TAB-02 | [C29609](https://shopview.testrail.io/index.php?/cases/view/29609) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 57 | FLT-TAB-03 | [C29610](https://shopview.testrail.io/index.php?/cases/view/29610) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 58 | FLT-TAB-04 | [C29611](https://shopview.testrail.io/index.php?/cases/view/29611) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 59 | FLT-TAB-05 | [C29612](https://shopview.testrail.io/index.php?/cases/view/29612) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 60 | FLT-TAB-06 | [C38876](https://shopview.testrail.io/index.php?/cases/view/38876) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 61 | FLT-PERS-01 | [C29613](https://shopview.testrail.io/index.php?/cases/view/29613) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY - EXPECT FAIL (SV-8871)` |
| 62 | FLT-PERS-02 | [C29614](https://shopview.testrail.io/index.php?/cases/view/29614) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 63 | FLT-PERS-03 | [C29615](https://shopview.testrail.io/index.php?/cases/view/29615) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 64 | FLT-PERS-04 | [C29616](https://shopview.testrail.io/index.php?/cases/view/29616) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY - EXPECT FAIL (SV-8832)` |
| 65 | FLT-PERS-05 | [C38880](https://shopview.testrail.io/index.php?/cases/view/38880) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 66 | FLT-PERS-06 | [C38881](https://shopview.testrail.io/index.php?/cases/view/38881) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 67 | FLT-URL-01 | [C29617](https://shopview.testrail.io/index.php?/cases/view/29617) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 68 | FLT-URL-02 | [C29618](https://shopview.testrail.io/index.php?/cases/view/29618) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY - EXPECT FAIL (SV-8845, SV-8871)` |
| 69 | FLT-URL-03 | [C29619](https://shopview.testrail.io/index.php?/cases/view/29619) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY - EXPECT FAIL (SV-8832)` |
| 70 | FLT-URL-04 | [C29620](https://shopview.testrail.io/index.php?/cases/view/29620) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY - EXPECT FAIL (SV-8832)` |
| 71 | FLT-URL-05 | [C38879](https://shopview.testrail.io/index.php?/cases/view/38879) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY - EXPECT FAIL (SV-8828)` |
| 72 | FLT-URL-06 | [C38896](https://shopview.testrail.io/index.php?/cases/view/38896) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY - EXPECT FAIL (SV-8828)` |
| 73 | FLT-MOB-08 | [C29628](https://shopview.testrail.io/index.php?/cases/view/29628) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY - EXPECT FAIL (SV-8846)` |
| 74 | FLT-MOB-09 | [C29629](https://shopview.testrail.io/index.php?/cases/view/29629) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY - EXPECT FAIL (no ticket - reported to the QA lead as one design item, not filed)` |
| 75 | FLT-API-01 | [C29631](https://shopview.testrail.io/index.php?/cases/view/29631) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 76 | FLT-API-02 | [C29632](https://shopview.testrail.io/index.php?/cases/view/29632) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 77 | FLT-API-03 | [C29633](https://shopview.testrail.io/index.php?/cases/view/29633) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY - EXPECT FAIL (SV-8832)` |
| 78 | FLT-API-04 | [C29634](https://shopview.testrail.io/index.php?/cases/view/29634) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY - EXPECT FAIL (SV-8832)` |
| 79 | FLT-API-05 | [C29635](https://shopview.testrail.io/index.php?/cases/view/29635) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 80 | FLT-API-06 | [C38895](https://shopview.testrail.io/index.php?/cases/view/38895) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: HOLD - needs a second test login to prove one person's saved filters do not reach another` |
| 81 | FLT-PSRCH-01 | [C38883](https://shopview.testrail.io/index.php?/cases/view/38883) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY - EXPECT FAIL (no ticket - reported to the QA lead as one design item, not filed)` |
| 82 | FLT-PSRCH-02 | [C38884](https://shopview.testrail.io/index.php?/cases/view/38884) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY - EXPECT FAIL (no ticket - reported to the QA lead as one design item, not filed)` |
| 83 | FLT-PSRCH-03 | [C38886](https://shopview.testrail.io/index.php?/cases/view/38886) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 84 | FLT-PSRCH-04 | [C38888](https://shopview.testrail.io/index.php?/cases/view/38888) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 85 | FLT-PSRCH-05 | [C38889](https://shopview.testrail.io/index.php?/cases/view/38889) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 86 | FLT-PSRCH-06 | [C38891](https://shopview.testrail.io/index.php?/cases/view/38891) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 87 | FLT-PSRCH-07 | [C38893](https://shopview.testrail.io/index.php?/cases/view/38893) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 88 | FLT-PSRCH-08 | [C38898](https://shopview.testrail.io/index.php?/cases/view/38898) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY - EXPECT FAIL (no ticket - reported to the QA lead as one design item, not filed)` |
| 89 | FLT-PSRCH-09 | [C38899](https://shopview.testrail.io/index.php?/cases/view/38899) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY - EXPECT FAIL (SV-8847 - closed as accepted, will not be fixed)` |
| 90 | FLT-PSRCH-10 | [C38900](https://shopview.testrail.io/index.php?/cases/view/38900) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 91 | FLT-PSRCH-11 | [C38901](https://shopview.testrail.io/index.php?/cases/view/38901) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 92 | FLT-PSRCH-12 | [C38902](https://shopview.testrail.io/index.php?/cases/view/38902) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 93 | FLT-PSRCH-13 | [C38903](https://shopview.testrail.io/index.php?/cases/view/38903) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 94 | FLT-PARTS-01 | [C38904](https://shopview.testrail.io/index.php?/cases/view/38904) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: HOLD - the feature is not in the product yet` |
| 95 | FLT-PARTS-09 | [C38905](https://shopview.testrail.io/index.php?/cases/view/38905) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: HOLD - the feature is not in the product yet` |
| 96 | FLT-PARTS-11 | [C38906](https://shopview.testrail.io/index.php?/cases/view/38906) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: HOLD - the feature is not in the product yet` |
| 97 | FLT-PARTS-12 | [C38907](https://shopview.testrail.io/index.php?/cases/view/38907) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: HOLD - the feature is not in the product yet` |
| 98 | FLT-PARTS-13 | [C38908](https://shopview.testrail.io/index.php?/cases/view/38908) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: HOLD - the feature is not in the product yet` |
| 99 | FLT-RPTS-23 | [C38882](https://shopview.testrail.io/index.php?/cases/view/38882) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: READY` |
| 100 | FLT-RPTS-01 | [C38909](https://shopview.testrail.io/index.php?/cases/view/38909) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: HOLD - the feature is not in the product yet` |
| 101 | FLT-RPTS-21 | [C38910](https://shopview.testrail.io/index.php?/cases/view/38910) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: HOLD - the feature is not in the product yet` |
| 102 | FLT-RPTS-22 | [C38911](https://shopview.testrail.io/index.php?/cases/view/38911) | custom_expected | 200 | **MATCH** | 30 | yes | `AUTOMATION: HOLD - the feature is not in the product yet` |

**102 operations, every one HTTP 200 and byte-verified MATCH, 0 mismatches, 0 collateral changes.**

## The 8 cases deliberately NOT written

| Case | C-id | Why not written |
|---|---|---|
| FLT-MOB-01 | [C29621](https://shopview.testrail.io/index.php?/cases/view/29621) | product owner answered SV-8825 on 2026-08-05 - verdict now unknown, see SV-8825-ANSWERED.md |
| FLT-MOB-02 | [C29622](https://shopview.testrail.io/index.php?/cases/view/29622) | product owner answered SV-8825 on 2026-08-05 - verdict now unknown, see SV-8825-ANSWERED.md |
| FLT-MOB-03 | [C29623](https://shopview.testrail.io/index.php?/cases/view/29623) | product owner answered SV-8825 on 2026-08-05 - verdict now unknown, see SV-8825-ANSWERED.md |
| FLT-MOB-04 | [C29624](https://shopview.testrail.io/index.php?/cases/view/29624) | product owner answered SV-8825 on 2026-08-05 - verdict now unknown, see SV-8825-ANSWERED.md |
| FLT-MOB-05 | [C29625](https://shopview.testrail.io/index.php?/cases/view/29625) | product owner answered SV-8825 on 2026-08-05 - verdict now unknown, see SV-8825-ANSWERED.md |
| FLT-MOB-06 | [C29626](https://shopview.testrail.io/index.php?/cases/view/29626) | product owner answered SV-8825 on 2026-08-05 - verdict now unknown, see SV-8825-ANSWERED.md |
| FLT-MOB-07 | [C29627](https://shopview.testrail.io/index.php?/cases/view/29627) | product owner answered SV-8825 on 2026-08-05 - verdict now unknown, see SV-8825-ANSWERED.md |
| FLT-MOB-10 | [C29630](https://shopview.testrail.io/index.php?/cases/view/29630) | product owner answered SV-8825 on 2026-08-05 - verdict now unknown, see SV-8825-ANSWERED.md |

These 8 were proven **byte-identical before and after**, including `updated_on` and `updated_by` —
so the claim that they were not written is evidence, not an assertion.
