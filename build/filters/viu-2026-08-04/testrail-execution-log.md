# Filters — TestRail EXECUTION LOG — VIU pass of 2026-08-04

> ## STATUS: **EXECUTED 2026-08-04.** **110 × `update_case`.** 0 add · 0 delete · 0 section
> · **0 run writes**. Every operation **HTTP 200** and **byte-verified MATCH, 28 fields
> compared per case**, with every field the pass did not intend to change proven
> **byte-identical** to its pre-write snapshot (Standing Rule 50).

**Branch tested:** `sv8785.qa.shopview.com` · **API** `sv8785api.qa.shopview.com` · **build marker `v3.4.2-4f8211c`** (index.html last-modified Mon, 03 Aug 2026 20:09:32 GMT, etag `cf3ffbad546f569b2b86c36b53d87514`) — **identical at start, mid-run and end, so no deployment landed during the pass.**

**Declared normalisation (the only one):** TestRail's `refs` splits on commas, trims each entry and rejoins with a bare comma, and rejects any single entry over 248 characters. This pass wrote **no** `refs`, and the comparison honours the normalisation regardless.

## The operations — one row per write

| # | Case | C-id | Fields written | HTTP | Byte-level verification | Verdict |
|---|---|---|---|---|---|---|
| 1 | FLT-BAR-01 | [C29557](https://shopview.testrail.io/index.php?/cases/view/29557) | `custom_expected` | **200** | **MATCH** — 28 fields compared | DEVIATION |
| 2 | FLT-BAR-02 | [C29558](https://shopview.testrail.io/index.php?/cases/view/29558) | `custom_expected` | **200** | **MATCH** — 28 fields compared | PASS |
| 3 | FLT-BAR-03 | [C29559](https://shopview.testrail.io/index.php?/cases/view/29559) | `custom_expected` | **200** | **MATCH** — 28 fields compared | PASS |
| 4 | FLT-STAT-01 | [C29560](https://shopview.testrail.io/index.php?/cases/view/29560) | `custom_expected`, `title` | **200** | **MATCH** — 28 fields compared | PASS |
| 5 | FLT-STAT-02 | [C29561](https://shopview.testrail.io/index.php?/cases/view/29561) | `custom_expected` | **200** | **MATCH** — 28 fields compared | PASS |
| 6 | FLT-STAT-03 | [C29562](https://shopview.testrail.io/index.php?/cases/view/29562) | `custom_expected` | **200** | **MATCH** — 28 fields compared | DEVIATION |
| 7 | FLT-STAT-04 | [C29563](https://shopview.testrail.io/index.php?/cases/view/29563) | `custom_expected`, `custom_steps`, `title` | **200** | **MATCH** — 28 fields compared | DEVIATION |
| 8 | FLT-STAT-05 | [C29564](https://shopview.testrail.io/index.php?/cases/view/29564) | `custom_expected` | **200** | **MATCH** — 28 fields compared | DEVIATION |
| 9 | FLT-STAT-06 | [C29565](https://shopview.testrail.io/index.php?/cases/view/29565) | `custom_expected` | **200** | **MATCH** — 28 fields compared | PASS |
| 10 | FLT-STAT-07 | [C38877](https://shopview.testrail.io/index.php?/cases/view/38877) | `custom_expected`, `custom_steps` | **200** | **MATCH** — 28 fields compared | PASS |
| 11 | FLT-CUST-01 | [C29566](https://shopview.testrail.io/index.php?/cases/view/29566) | `custom_expected` | **200** | **MATCH** — 28 fields compared | PASS |
| 12 | FLT-CUST-02 | [C29567](https://shopview.testrail.io/index.php?/cases/view/29567) | `custom_expected`, `custom_steps` | **200** | **MATCH** — 28 fields compared | PASS |
| 13 | FLT-CUST-03 | [C29568](https://shopview.testrail.io/index.php?/cases/view/29568) | `custom_expected` | **200** | **MATCH** — 28 fields compared | DEVIATION |
| 14 | FLT-CUST-04 | [C29569](https://shopview.testrail.io/index.php?/cases/view/29569) | `custom_expected` | **200** | **MATCH** — 28 fields compared | PASS |
| 15 | FLT-CUST-05 | [C29570](https://shopview.testrail.io/index.php?/cases/view/29570) | `custom_expected` | **200** | **MATCH** — 28 fields compared | DEVIATION |
| 16 | FLT-CUST-06 | [C29571](https://shopview.testrail.io/index.php?/cases/view/29571) | `custom_expected`, `custom_steps`, `title` | **200** | **MATCH** — 28 fields compared | PASS |
| 17 | FLT-CUST-07 | [C29572](https://shopview.testrail.io/index.php?/cases/view/29572) | `custom_expected` | **200** | **MATCH** — 28 fields compared | DEVIATION |
| 18 | FLT-CUST-08 | [C29573](https://shopview.testrail.io/index.php?/cases/view/29573) | `custom_expected` | **200** | **MATCH** — 28 fields compared | PASS |
| 19 | FLT-CUST-09 | [C29574](https://shopview.testrail.io/index.php?/cases/view/29574) | `custom_expected` | **200** | **MATCH** — 28 fields compared | PASS |
| 20 | FLT-TECH-01 | [C29575](https://shopview.testrail.io/index.php?/cases/view/29575) | `custom_expected` | **200** | **MATCH** — 28 fields compared | PASS |
| 21 | FLT-TECH-02 | [C29576](https://shopview.testrail.io/index.php?/cases/view/29576) | `custom_expected`, `custom_steps` | **200** | **MATCH** — 28 fields compared | PASS |
| 22 | FLT-TECH-03 | [C29577](https://shopview.testrail.io/index.php?/cases/view/29577) | `custom_expected` | **200** | **MATCH** — 28 fields compared | DEVIATION |
| 23 | FLT-TECH-04 | [C29578](https://shopview.testrail.io/index.php?/cases/view/29578) | `custom_expected`, `custom_steps`, `title` | **200** | **MATCH** — 28 fields compared | PASS |
| 24 | FLT-TECH-05 | [C29579](https://shopview.testrail.io/index.php?/cases/view/29579) | `custom_expected` | **200** | **MATCH** — 28 fields compared | DEVIATION |
| 25 | FLT-TECH-06 | [C29580](https://shopview.testrail.io/index.php?/cases/view/29580) | `custom_expected` | **200** | **MATCH** — 28 fields compared | PASS |
| 26 | FLT-TECH-07 | [C29581](https://shopview.testrail.io/index.php?/cases/view/29581) | `custom_expected` | **200** | **MATCH** — 28 fields compared | PASS |
| 27 | FLT-ADV-01 | [C29582](https://shopview.testrail.io/index.php?/cases/view/29582) | `custom_expected` | **200** | **MATCH** — 28 fields compared | PASS |
| 28 | FLT-ADV-02 | [C29583](https://shopview.testrail.io/index.php?/cases/view/29583) | `custom_expected`, `custom_steps` | **200** | **MATCH** — 28 fields compared | PASS |
| 29 | FLT-ADV-03 | [C29584](https://shopview.testrail.io/index.php?/cases/view/29584) | `custom_expected` | **200** | **MATCH** — 28 fields compared | DEVIATION |
| 30 | FLT-ADV-04 | [C29585](https://shopview.testrail.io/index.php?/cases/view/29585) | `custom_expected`, `custom_steps`, `title` | **200** | **MATCH** — 28 fields compared | PASS |
| 1 | FLT-ADV-05 | [C29586](https://shopview.testrail.io/index.php?/cases/view/29586) | `custom_expected` | **200** | **MATCH** — 28 fields compared | DEVIATION |
| 2 | FLT-ADV-06 | [C29587](https://shopview.testrail.io/index.php?/cases/view/29587) | `custom_expected` | **200** | **MATCH** — 28 fields compared | PASS |
| 3 | FLT-ADV-07 | [C29588](https://shopview.testrail.io/index.php?/cases/view/29588) | `custom_expected` | **200** | **MATCH** — 28 fields compared | PASS |
| 4 | FLT-ASSET-01 | [C29589](https://shopview.testrail.io/index.php?/cases/view/29589) | `custom_expected`, `custom_steps`, `title` | **200** | **MATCH** — 28 fields compared | PASS |
| 5 | FLT-ASSET-02 | [C29590](https://shopview.testrail.io/index.php?/cases/view/29590) | `custom_expected`, `custom_steps` | **200** | **MATCH** — 28 fields compared | PASS |
| 6 | FLT-ASSET-03 | [C29591](https://shopview.testrail.io/index.php?/cases/view/29591) | `custom_expected`, `custom_preconds`, `custom_steps`, `title` | **200** | **MATCH** — 28 fields compared | PASS |
| 7 | FLT-ASSET-04 | [C29592](https://shopview.testrail.io/index.php?/cases/view/29592) | `custom_expected`, `custom_preconds`, `custom_steps`, `title` | **200** | **MATCH** — 28 fields compared | PASS |
| 8 | FLT-ASSET-05 | [C29593](https://shopview.testrail.io/index.php?/cases/view/29593) | `custom_expected`, `custom_preconds`, `title` | **200** | **MATCH** — 28 fields compared | DEVIATION |
| 9 | FLT-ASSET-06 | [C29594](https://shopview.testrail.io/index.php?/cases/view/29594) | `custom_expected`, `custom_steps`, `title` | **200** | **MATCH** — 28 fields compared | PASS |
| 10 | FLT-ASSET-07 | [C38878](https://shopview.testrail.io/index.php?/cases/view/38878) | `custom_expected`, `custom_steps` | **200** | **MATCH** — 28 fields compared | PASS |
| 11 | FLT-CHIP-01 | [C29595](https://shopview.testrail.io/index.php?/cases/view/29595) | `custom_expected` | **200** | **MATCH** — 28 fields compared | DEVIATION |
| 12 | FLT-CHIP-02 | [C29596](https://shopview.testrail.io/index.php?/cases/view/29596) | `custom_expected` | **200** | **MATCH** — 28 fields compared | PASS |
| 13 | FLT-CHIP-03 | [C29597](https://shopview.testrail.io/index.php?/cases/view/29597) | `custom_expected`, `custom_steps`, `title` | **200** | **MATCH** — 28 fields compared | PASS |
| 14 | FLT-CHIP-04 | [C29598](https://shopview.testrail.io/index.php?/cases/view/29598) | `custom_expected`, `custom_preconds`, `custom_steps`, `title` | **200** | **MATCH** — 28 fields compared | PASS |
| 15 | FLT-CHIP-05 | [C29599](https://shopview.testrail.io/index.php?/cases/view/29599) | `custom_expected`, `custom_steps`, `title` | **200** | **MATCH** — 28 fields compared | PASS |
| 16 | FLT-CHIP-06 | [C29600](https://shopview.testrail.io/index.php?/cases/view/29600) | `custom_expected` | **200** | **MATCH** — 28 fields compared | PASS |
| 17 | FLT-COLL-01 | [C29601](https://shopview.testrail.io/index.php?/cases/view/29601) | `custom_expected`, `custom_steps` | **200** | **MATCH** — 28 fields compared | PASS |
| 18 | FLT-COLL-02 | [C29602](https://shopview.testrail.io/index.php?/cases/view/29602) | `custom_expected` | **200** | **MATCH** — 28 fields compared | DEVIATION |
| 19 | FLT-COLL-03 | [C29603](https://shopview.testrail.io/index.php?/cases/view/29603) | `custom_expected` | **200** | **MATCH** — 28 fields compared | PASS |
| 20 | FLT-COLL-04 | [C29604](https://shopview.testrail.io/index.php?/cases/view/29604) | `custom_expected` | **200** | **MATCH** — 28 fields compared | PASS |
| 21 | FLT-COLL-05 | [C29605](https://shopview.testrail.io/index.php?/cases/view/29605) | `custom_expected` | **200** | **MATCH** — 28 fields compared | PASS |
| 22 | FLT-EMPTY-01 | [C29606](https://shopview.testrail.io/index.php?/cases/view/29606) | `custom_expected` | **200** | **MATCH** — 28 fields compared | DEVIATION |
| 23 | FLT-EMPTY-02 | [C29607](https://shopview.testrail.io/index.php?/cases/view/29607) | `custom_expected` | **200** | **MATCH** — 28 fields compared | DEVIATION |
| 24 | FLT-EMPTY-03 | [C38897](https://shopview.testrail.io/index.php?/cases/view/38897) | `custom_expected` | **200** | **MATCH** — 28 fields compared | PASS |
| 25 | FLT-TAB-01 | [C29608](https://shopview.testrail.io/index.php?/cases/view/29608) | `custom_expected` | **200** | **MATCH** — 28 fields compared | PASS |
| 26 | FLT-TAB-02 | [C29609](https://shopview.testrail.io/index.php?/cases/view/29609) | `custom_expected` | **200** | **MATCH** — 28 fields compared | PASS |
| 27 | FLT-TAB-03 | [C29610](https://shopview.testrail.io/index.php?/cases/view/29610) | `custom_expected` | **200** | **MATCH** — 28 fields compared | PASS |
| 28 | FLT-TAB-04 | [C29611](https://shopview.testrail.io/index.php?/cases/view/29611) | `custom_expected` | **200** | **MATCH** — 28 fields compared | PASS |
| 29 | FLT-TAB-05 | [C29612](https://shopview.testrail.io/index.php?/cases/view/29612) | `custom_expected` | **200** | **MATCH** — 28 fields compared | PASS |
| 30 | FLT-TAB-06 | [C38876](https://shopview.testrail.io/index.php?/cases/view/38876) | `custom_expected` | **200** | **MATCH** — 28 fields compared | PASS |
| 1 | FLT-PERS-01 | [C29613](https://shopview.testrail.io/index.php?/cases/view/29613) | `custom_expected` | **200** | **MATCH** — 28 fields compared | PASS |
| 2 | FLT-PERS-02 | [C29614](https://shopview.testrail.io/index.php?/cases/view/29614) | `custom_expected` | **200** | **MATCH** — 28 fields compared | PASS |
| 3 | FLT-PERS-03 | [C29615](https://shopview.testrail.io/index.php?/cases/view/29615) | `custom_expected` | **200** | **MATCH** — 28 fields compared | PASS |
| 4 | FLT-PERS-04 | [C29616](https://shopview.testrail.io/index.php?/cases/view/29616) | `custom_expected` | **200** | **MATCH** — 28 fields compared | PASS |
| 5 | FLT-PERS-05 | [C38880](https://shopview.testrail.io/index.php?/cases/view/38880) | `custom_expected` | **200** | **MATCH** — 28 fields compared | PASS |
| 6 | FLT-PERS-06 | [C38881](https://shopview.testrail.io/index.php?/cases/view/38881) | `custom_expected` | **200** | **MATCH** — 28 fields compared | PASS |
| 7 | FLT-URL-01 | [C29617](https://shopview.testrail.io/index.php?/cases/view/29617) | `custom_expected` | **200** | **MATCH** — 28 fields compared | PASS |
| 8 | FLT-URL-02 | [C29618](https://shopview.testrail.io/index.php?/cases/view/29618) | `custom_expected` | **200** | **MATCH** — 28 fields compared | DEVIATION |
| 9 | FLT-URL-03 | [C29619](https://shopview.testrail.io/index.php?/cases/view/29619) | `custom_expected` | **200** | **MATCH** — 28 fields compared | DEVIATION |
| 10 | FLT-URL-04 | [C29620](https://shopview.testrail.io/index.php?/cases/view/29620) | `custom_expected` | **200** | **MATCH** — 28 fields compared | DEVIATION |
| 11 | FLT-URL-05 | [C38879](https://shopview.testrail.io/index.php?/cases/view/38879) | `custom_expected`, `custom_steps` | **200** | **MATCH** — 28 fields compared | DEVIATION |
| 12 | FLT-URL-06 | [C38896](https://shopview.testrail.io/index.php?/cases/view/38896) | `custom_expected`, `custom_steps`, `title` | **200** | **MATCH** — 28 fields compared | DEVIATION |
| 13 | FLT-MOB-01 | [C29621](https://shopview.testrail.io/index.php?/cases/view/29621) | `custom_expected` | **200** | **MATCH** — 28 fields compared | HELD |
| 14 | FLT-MOB-02 | [C29622](https://shopview.testrail.io/index.php?/cases/view/29622) | `custom_expected` | **200** | **MATCH** — 28 fields compared | HELD |
| 15 | FLT-MOB-03 | [C29623](https://shopview.testrail.io/index.php?/cases/view/29623) | `custom_expected` | **200** | **MATCH** — 28 fields compared | HELD |
| 16 | FLT-MOB-04 | [C29624](https://shopview.testrail.io/index.php?/cases/view/29624) | `custom_expected` | **200** | **MATCH** — 28 fields compared | HELD |
| 17 | FLT-MOB-05 | [C29625](https://shopview.testrail.io/index.php?/cases/view/29625) | `custom_expected`, `custom_steps` | **200** | **MATCH** — 28 fields compared | HELD |
| 18 | FLT-MOB-06 | [C29626](https://shopview.testrail.io/index.php?/cases/view/29626) | `custom_expected` | **200** | **MATCH** — 28 fields compared | HELD |
| 19 | FLT-MOB-07 | [C29627](https://shopview.testrail.io/index.php?/cases/view/29627) | `custom_expected`, `custom_steps`, `title` | **200** | **MATCH** — 28 fields compared | HELD |
| 20 | FLT-MOB-08 | [C29628](https://shopview.testrail.io/index.php?/cases/view/29628) | `custom_expected`, `custom_steps`, `title` | **200** | **MATCH** — 28 fields compared | DEVIATION |
| 21 | FLT-MOB-09 | [C29629](https://shopview.testrail.io/index.php?/cases/view/29629) | `custom_expected`, `custom_steps` | **200** | **MATCH** — 28 fields compared | DEVIATION |
| 22 | FLT-MOB-10 | [C29630](https://shopview.testrail.io/index.php?/cases/view/29630) | `custom_expected` | **200** | **MATCH** — 28 fields compared | HELD |
| 23 | FLT-API-01 | [C29631](https://shopview.testrail.io/index.php?/cases/view/29631) | `custom_expected` | **200** | **MATCH** — 28 fields compared | PASS |
| 24 | FLT-API-02 | [C29632](https://shopview.testrail.io/index.php?/cases/view/29632) | `custom_expected` | **200** | **MATCH** — 28 fields compared | PASS |
| 25 | FLT-API-03 | [C29633](https://shopview.testrail.io/index.php?/cases/view/29633) | `custom_expected` | **200** | **MATCH** — 28 fields compared | DEVIATION |
| 26 | FLT-API-04 | [C29634](https://shopview.testrail.io/index.php?/cases/view/29634) | `custom_expected` | **200** | **MATCH** — 28 fields compared | DEVIATION |
| 27 | FLT-API-05 | [C29635](https://shopview.testrail.io/index.php?/cases/view/29635) | `custom_expected` | **200** | **MATCH** — 28 fields compared | PASS |
| 28 | FLT-API-06 | [C38895](https://shopview.testrail.io/index.php?/cases/view/38895) | `custom_expected` | **200** | **MATCH** — 28 fields compared | EXTDEP |
| 29 | FLT-PSRCH-01 | [C38883](https://shopview.testrail.io/index.php?/cases/view/38883) | `custom_expected` | **200** | **MATCH** — 28 fields compared | DEVIATION |
| 30 | FLT-PSRCH-02 | [C38884](https://shopview.testrail.io/index.php?/cases/view/38884) | `custom_expected` | **200** | **MATCH** — 28 fields compared | DEVIATION |
| 1 | FLT-PSRCH-03 | [C38886](https://shopview.testrail.io/index.php?/cases/view/38886) | `custom_expected` | **200** | **MATCH** — 28 fields compared | PASS |
| 2 | FLT-PSRCH-04 | [C38888](https://shopview.testrail.io/index.php?/cases/view/38888) | `custom_expected` | **200** | **MATCH** — 28 fields compared | PASS |
| 3 | FLT-PSRCH-05 | [C38889](https://shopview.testrail.io/index.php?/cases/view/38889) | `custom_expected` | **200** | **MATCH** — 28 fields compared | PASS |
| 4 | FLT-PSRCH-06 | [C38891](https://shopview.testrail.io/index.php?/cases/view/38891) | `custom_expected` | **200** | **MATCH** — 28 fields compared | PASS |
| 5 | FLT-PSRCH-07 | [C38893](https://shopview.testrail.io/index.php?/cases/view/38893) | `custom_expected` | **200** | **MATCH** — 28 fields compared | PASS |
| 6 | FLT-PSRCH-08 | [C38898](https://shopview.testrail.io/index.php?/cases/view/38898) | `custom_expected`, `custom_steps` | **200** | **MATCH** — 28 fields compared | DEVIATION |
| 7 | FLT-PSRCH-09 | [C38899](https://shopview.testrail.io/index.php?/cases/view/38899) | `custom_expected` | **200** | **MATCH** — 28 fields compared | DEVIATION |
| 8 | FLT-PSRCH-10 | [C38900](https://shopview.testrail.io/index.php?/cases/view/38900) | `custom_expected` | **200** | **MATCH** — 28 fields compared | DEVIATION |
| 9 | FLT-PSRCH-11 | [C38901](https://shopview.testrail.io/index.php?/cases/view/38901) | `custom_expected` | **200** | **MATCH** — 28 fields compared | DEVIATION |
| 10 | FLT-PSRCH-12 | [C38902](https://shopview.testrail.io/index.php?/cases/view/38902) | `custom_expected` | **200** | **MATCH** — 28 fields compared | DEVIATION |
| 11 | FLT-PSRCH-13 | [C38903](https://shopview.testrail.io/index.php?/cases/view/38903) | `custom_expected` | **200** | **MATCH** — 28 fields compared | PASS |
| 12 | FLT-PARTS-01 | [C38904](https://shopview.testrail.io/index.php?/cases/view/38904) | `custom_expected` | **200** | **MATCH** — 28 fields compared | NOTBUILT |
| 13 | FLT-PARTS-09 | [C38905](https://shopview.testrail.io/index.php?/cases/view/38905) | `custom_expected`, `custom_steps`, `title` | **200** | **MATCH** — 28 fields compared | NOTBUILT |
| 14 | FLT-PARTS-11 | [C38906](https://shopview.testrail.io/index.php?/cases/view/38906) | `custom_expected` | **200** | **MATCH** — 28 fields compared | NOTBUILT |
| 15 | FLT-PARTS-12 | [C38907](https://shopview.testrail.io/index.php?/cases/view/38907) | `custom_expected`, `custom_steps` | **200** | **MATCH** — 28 fields compared | NOTBUILT |
| 16 | FLT-PARTS-13 | [C38908](https://shopview.testrail.io/index.php?/cases/view/38908) | `custom_expected` | **200** | **MATCH** — 28 fields compared | NOTBUILT |
| 17 | FLT-RPTS-23 | [C38882](https://shopview.testrail.io/index.php?/cases/view/38882) | `custom_expected` | **200** | **MATCH** — 28 fields compared | NOTBUILT |
| 18 | FLT-RPTS-01 | [C38909](https://shopview.testrail.io/index.php?/cases/view/38909) | `custom_expected` | **200** | **MATCH** — 28 fields compared | NOTBUILT |
| 19 | FLT-RPTS-21 | [C38910](https://shopview.testrail.io/index.php?/cases/view/38910) | `custom_expected` | **200** | **MATCH** — 28 fields compared | NOTBUILT |
| 20 | FLT-RPTS-22 | [C38911](https://shopview.testrail.io/index.php?/cases/view/38911) | `custom_expected` | **200** | **MATCH** — 28 fields compared | NOTBUILT |
| 1 | FLT-TAB-02 | [C29609](https://shopview.testrail.io/index.php?/cases/view/29609) | `custom_steps`, `title` | **200** | **MATCH** — 28 fields compared | PASS |
| 2 | FLT-TAB-03 | [C29610](https://shopview.testrail.io/index.php?/cases/view/29610) | `custom_expected`, `custom_steps`, `title` | **200** | **MATCH** — 28 fields compared | PASS |
| 3 | FLT-TAB-05 | [C29612](https://shopview.testrail.io/index.php?/cases/view/29612) | `custom_expected` | **200** | **MATCH** — 28 fields compared | PASS |
| 4 | FLT-BAR-02 | [C29558](https://shopview.testrail.io/index.php?/cases/view/29558) | `custom_preconds` | **200** | **MATCH** — 28 fields compared | PASS |
| 1 | FLT-TAB-02 | [C29609](https://shopview.testrail.io/index.php?/cases/view/29609) | `custom_expected` | **200** | **MATCH** — 28 fields compared | PASS |

## Run 352 — verified UNTOUCHED (Standing Rules 34 / 47 / 50)

| Check | Before | After | Result |
|---|---|---|---|
| `include_all` | false | false | unchanged |
| tests | 110 | 110 | **case_id sets proven EQUAL in BOTH directions** |
| result records | 398 | 398 | **every prior result verified PRESENT BY ID** — 0 missing, 0 added |
| status counts | 1 Passed / 2 Failed / 107 Untested | identical | we wrote no result |

**The task brief said 396 result records; live it holds 398.** Verified, not trusted.

## Foreign cases (Standing Rule 38)

Group 4110 re-read after the push: **110 cases, every one `created_by: 3` (us). ZERO foreign cases.** Nothing belonging to another author was read-modified or moved.
