# Filters — provenance re-stamp, per-operation audit log (2026-08-05)

Standing Rule 50: one line per operation with the operation, the C-id, the HTTP status and the
verification result. `200 OK` alone is non-compliant, so every row carries the byte-verification
verdict and the number of fields compared.

**Sources read at pass start:** 2026-08-05T17:11:10Z (build) / 17:11:5xZ (spec) — Rule 31.
**Sources RE-READ at write start:** 2026-08-05T17:17:26Z — Rule 59. **Verdict: UNCHANGED**
(build `v3.4.2-d00239b`, `index.html` byte-identical; spec Confluence version 18).

**Write phase:** 2026-08-05T17:17:49Z → 17:20:21Z. **110 × `update_case`, 0 add / 0 delete /
0 section / 0 run writes, no result logged anywhere.**

**Payload composition (playbook §J declared normalisation #3):** every payload carried ALL THREE
text fields — `custom_expected` (the change) plus `custom_preconds` and `custom_steps` at their
exact pre-write bytes — because `update_case` re-renders any text field you OMIT. `refs` was
deliberately NOT sent on any operation; it was not being changed, and it is proven byte-identical
to the pre-write snapshot on all 110.

| # | Op | C-id | Internal ID | HTTP | Fields compared | Verification | Rewrite group |
|---|---|---|---|---|---|---|---|
| 1 | `update_case` | [C29557](https://shopview.testrail.io/index.php?/cases/view/29557) | FLT-BAR-01 | 200 | 28 | byte-verified MATCH | B — already documents-first; sentence 2 normalised, failure fact kept |
| 2 | `update_case` | [C29558](https://shopview.testrail.io/index.php?/cases/view/29558) | FLT-BAR-02 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 3 | `update_case` | [C29559](https://shopview.testrail.io/index.php?/cases/view/29559) | FLT-BAR-03 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 4 | `update_case` | [C29560](https://shopview.testrail.io/index.php?/cases/view/29560) | FLT-STAT-01 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 5 | `update_case` | [C29561](https://shopview.testrail.io/index.php?/cases/view/29561) | FLT-STAT-02 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 6 | `update_case` | [C29562](https://shopview.testrail.io/index.php?/cases/view/29562) | FLT-STAT-03 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 7 | `update_case` | [C29563](https://shopview.testrail.io/index.php?/cases/view/29563) | FLT-STAT-04 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 8 | `update_case` | [C29564](https://shopview.testrail.io/index.php?/cases/view/29564) | FLT-STAT-05 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 9 | `update_case` | [C29565](https://shopview.testrail.io/index.php?/cases/view/29565) | FLT-STAT-06 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 10 | `update_case` | [C38877](https://shopview.testrail.io/index.php?/cases/view/38877) | FLT-STAT-07 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 11 | `update_case` | [C29566](https://shopview.testrail.io/index.php?/cases/view/29566) | FLT-CUST-01 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 12 | `update_case` | [C29567](https://shopview.testrail.io/index.php?/cases/view/29567) | FLT-CUST-02 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 13 | `update_case` | [C29568](https://shopview.testrail.io/index.php?/cases/view/29568) | FLT-CUST-03 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 14 | `update_case` | [C29569](https://shopview.testrail.io/index.php?/cases/view/29569) | FLT-CUST-04 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 15 | `update_case` | [C29570](https://shopview.testrail.io/index.php?/cases/view/29570) | FLT-CUST-05 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 16 | `update_case` | [C29571](https://shopview.testrail.io/index.php?/cases/view/29571) | FLT-CUST-06 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 17 | `update_case` | [C29572](https://shopview.testrail.io/index.php?/cases/view/29572) | FLT-CUST-07 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 18 | `update_case` | [C29573](https://shopview.testrail.io/index.php?/cases/view/29573) | FLT-CUST-08 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 19 | `update_case` | [C29574](https://shopview.testrail.io/index.php?/cases/view/29574) | FLT-CUST-09 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 20 | `update_case` | [C29575](https://shopview.testrail.io/index.php?/cases/view/29575) | FLT-TECH-01 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 21 | `update_case` | [C29576](https://shopview.testrail.io/index.php?/cases/view/29576) | FLT-TECH-02 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 22 | `update_case` | [C29577](https://shopview.testrail.io/index.php?/cases/view/29577) | FLT-TECH-03 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 23 | `update_case` | [C29578](https://shopview.testrail.io/index.php?/cases/view/29578) | FLT-TECH-04 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 24 | `update_case` | [C29579](https://shopview.testrail.io/index.php?/cases/view/29579) | FLT-TECH-05 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 25 | `update_case` | [C29580](https://shopview.testrail.io/index.php?/cases/view/29580) | FLT-TECH-06 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 26 | `update_case` | [C29581](https://shopview.testrail.io/index.php?/cases/view/29581) | FLT-TECH-07 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 27 | `update_case` | [C29582](https://shopview.testrail.io/index.php?/cases/view/29582) | FLT-ADV-01 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 28 | `update_case` | [C29583](https://shopview.testrail.io/index.php?/cases/view/29583) | FLT-ADV-02 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 29 | `update_case` | [C29584](https://shopview.testrail.io/index.php?/cases/view/29584) | FLT-ADV-03 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 30 | `update_case` | [C29585](https://shopview.testrail.io/index.php?/cases/view/29585) | FLT-ADV-04 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 31 | `update_case` | [C29586](https://shopview.testrail.io/index.php?/cases/view/29586) | FLT-ADV-05 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 32 | `update_case` | [C29587](https://shopview.testrail.io/index.php?/cases/view/29587) | FLT-ADV-06 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 33 | `update_case` | [C29588](https://shopview.testrail.io/index.php?/cases/view/29588) | FLT-ADV-07 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 34 | `update_case` | [C29589](https://shopview.testrail.io/index.php?/cases/view/29589) | FLT-ASSET-01 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 35 | `update_case` | [C29590](https://shopview.testrail.io/index.php?/cases/view/29590) | FLT-ASSET-02 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 36 | `update_case` | [C29591](https://shopview.testrail.io/index.php?/cases/view/29591) | FLT-ASSET-03 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 37 | `update_case` | [C29592](https://shopview.testrail.io/index.php?/cases/view/29592) | FLT-ASSET-04 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 38 | `update_case` | [C29593](https://shopview.testrail.io/index.php?/cases/view/29593) | FLT-ASSET-05 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 39 | `update_case` | [C29594](https://shopview.testrail.io/index.php?/cases/view/29594) | FLT-ASSET-06 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 40 | `update_case` | [C38878](https://shopview.testrail.io/index.php?/cases/view/38878) | FLT-ASSET-07 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 41 | `update_case` | [C29595](https://shopview.testrail.io/index.php?/cases/view/29595) | FLT-CHIP-01 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 42 | `update_case` | [C29596](https://shopview.testrail.io/index.php?/cases/view/29596) | FLT-CHIP-02 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 43 | `update_case` | [C29597](https://shopview.testrail.io/index.php?/cases/view/29597) | FLT-CHIP-03 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 44 | `update_case` | [C29598](https://shopview.testrail.io/index.php?/cases/view/29598) | FLT-CHIP-04 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 45 | `update_case` | [C29599](https://shopview.testrail.io/index.php?/cases/view/29599) | FLT-CHIP-05 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 46 | `update_case` | [C29600](https://shopview.testrail.io/index.php?/cases/view/29600) | FLT-CHIP-06 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 47 | `update_case` | [C29601](https://shopview.testrail.io/index.php?/cases/view/29601) | FLT-COLL-01 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 48 | `update_case` | [C29602](https://shopview.testrail.io/index.php?/cases/view/29602) | FLT-COLL-02 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 49 | `update_case` | [C29603](https://shopview.testrail.io/index.php?/cases/view/29603) | FLT-COLL-03 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 50 | `update_case` | [C29604](https://shopview.testrail.io/index.php?/cases/view/29604) | FLT-COLL-04 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 51 | `update_case` | [C29605](https://shopview.testrail.io/index.php?/cases/view/29605) | FLT-COLL-05 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 52 | `update_case` | [C29606](https://shopview.testrail.io/index.php?/cases/view/29606) | FLT-EMPTY-01 | 200 | 28 | byte-verified MATCH | B — already documents-first; sentence 2 normalised, failure fact kept |
| 53 | `update_case` | [C29607](https://shopview.testrail.io/index.php?/cases/view/29607) | FLT-EMPTY-02 | 200 | 28 | byte-verified MATCH | B — already documents-first; sentence 2 normalised, failure fact kept |
| 54 | `update_case` | [C38897](https://shopview.testrail.io/index.php?/cases/view/38897) | FLT-EMPTY-03 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 55 | `update_case` | [C29608](https://shopview.testrail.io/index.php?/cases/view/29608) | FLT-TAB-01 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 56 | `update_case` | [C29609](https://shopview.testrail.io/index.php?/cases/view/29609) | FLT-TAB-02 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 57 | `update_case` | [C29610](https://shopview.testrail.io/index.php?/cases/view/29610) | FLT-TAB-03 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 58 | `update_case` | [C29611](https://shopview.testrail.io/index.php?/cases/view/29611) | FLT-TAB-04 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 59 | `update_case` | [C29612](https://shopview.testrail.io/index.php?/cases/view/29612) | FLT-TAB-05 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 60 | `update_case` | [C38876](https://shopview.testrail.io/index.php?/cases/view/38876) | FLT-TAB-06 | 200 | 28 | byte-verified MATCH | C — no numbered requirement; build clause removed from sentence 1 |
| 61 | `update_case` | [C29613](https://shopview.testrail.io/index.php?/cases/view/29613) | FLT-PERS-01 | 200 | 28 | byte-verified MATCH | B — already documents-first; sentence 2 normalised, failure fact kept |
| 62 | `update_case` | [C29614](https://shopview.testrail.io/index.php?/cases/view/29614) | FLT-PERS-02 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 63 | `update_case` | [C29615](https://shopview.testrail.io/index.php?/cases/view/29615) | FLT-PERS-03 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 64 | `update_case` | [C29616](https://shopview.testrail.io/index.php?/cases/view/29616) | FLT-PERS-04 | 200 | 28 | byte-verified MATCH | B — already documents-first; sentence 2 normalised, failure fact kept |
| 65 | `update_case` | [C38880](https://shopview.testrail.io/index.php?/cases/view/38880) | FLT-PERS-05 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 66 | `update_case` | [C38881](https://shopview.testrail.io/index.php?/cases/view/38881) | FLT-PERS-06 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 67 | `update_case` | [C29617](https://shopview.testrail.io/index.php?/cases/view/29617) | FLT-URL-01 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 68 | `update_case` | [C29618](https://shopview.testrail.io/index.php?/cases/view/29618) | FLT-URL-02 | 200 | 28 | byte-verified MATCH | B — already documents-first; sentence 2 normalised, failure fact kept |
| 69 | `update_case` | [C29619](https://shopview.testrail.io/index.php?/cases/view/29619) | FLT-URL-03 | 200 | 28 | byte-verified MATCH | B — already documents-first; sentence 2 normalised, failure fact kept |
| 70 | `update_case` | [C29620](https://shopview.testrail.io/index.php?/cases/view/29620) | FLT-URL-04 | 200 | 28 | byte-verified MATCH | B — already documents-first; sentence 2 normalised, failure fact kept |
| 71 | `update_case` | [C38879](https://shopview.testrail.io/index.php?/cases/view/38879) | FLT-URL-05 | 200 | 28 | byte-verified MATCH | B — already documents-first; sentence 2 normalised, failure fact kept |
| 72 | `update_case` | [C38896](https://shopview.testrail.io/index.php?/cases/view/38896) | FLT-URL-06 | 200 | 28 | byte-verified MATCH | B — already documents-first; sentence 2 normalised, failure fact kept |
| 73 | `update_case` | [C29621](https://shopview.testrail.io/index.php?/cases/view/29621) | FLT-MOB-01 | 200 | 28 | byte-verified MATCH | B — mobile; Branko ruling kept, sentence 2 normalised |
| 74 | `update_case` | [C29622](https://shopview.testrail.io/index.php?/cases/view/29622) | FLT-MOB-02 | 200 | 28 | byte-verified MATCH | B — mobile; Branko ruling kept, sentence 2 normalised |
| 75 | `update_case` | [C29623](https://shopview.testrail.io/index.php?/cases/view/29623) | FLT-MOB-03 | 200 | 28 | byte-verified MATCH | B — mobile; Branko ruling kept, sentence 2 normalised |
| 76 | `update_case` | [C29624](https://shopview.testrail.io/index.php?/cases/view/29624) | FLT-MOB-04 | 200 | 28 | byte-verified MATCH | B — mobile; Branko ruling kept, sentence 2 normalised |
| 77 | `update_case` | [C29625](https://shopview.testrail.io/index.php?/cases/view/29625) | FLT-MOB-05 | 200 | 28 | byte-verified MATCH | B — mobile; Branko ruling kept, sentence 2 normalised |
| 78 | `update_case` | [C29626](https://shopview.testrail.io/index.php?/cases/view/29626) | FLT-MOB-06 | 200 | 28 | byte-verified MATCH | B — mobile; Branko ruling kept, sentence 2 normalised |
| 79 | `update_case` | [C29627](https://shopview.testrail.io/index.php?/cases/view/29627) | FLT-MOB-07 | 200 | 28 | byte-verified MATCH | B — mobile; Branko ruling kept, sentence 2 normalised |
| 80 | `update_case` | [C29628](https://shopview.testrail.io/index.php?/cases/view/29628) | FLT-MOB-08 | 200 | 28 | byte-verified MATCH | B — already documents-first; sentence 2 normalised, failure fact kept |
| 81 | `update_case` | [C29629](https://shopview.testrail.io/index.php?/cases/view/29629) | FLT-MOB-09 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 82 | `update_case` | [C29630](https://shopview.testrail.io/index.php?/cases/view/29630) | FLT-MOB-10 | 200 | 28 | byte-verified MATCH | B — mobile; Branko ruling kept, sentence 2 normalised |
| 83 | `update_case` | [C29631](https://shopview.testrail.io/index.php?/cases/view/29631) | FLT-API-01 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 84 | `update_case` | [C29632](https://shopview.testrail.io/index.php?/cases/view/29632) | FLT-API-02 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 85 | `update_case` | [C29633](https://shopview.testrail.io/index.php?/cases/view/29633) | FLT-API-03 | 200 | 28 | byte-verified MATCH | B — already documents-first; sentence 2 normalised, failure fact kept |
| 86 | `update_case` | [C29634](https://shopview.testrail.io/index.php?/cases/view/29634) | FLT-API-04 | 200 | 28 | byte-verified MATCH | B — already documents-first; sentence 2 normalised, failure fact kept |
| 87 | `update_case` | [C29635](https://shopview.testrail.io/index.php?/cases/view/29635) | FLT-API-05 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 88 | `update_case` | [C38895](https://shopview.testrail.io/index.php?/cases/view/38895) | FLT-API-06 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 89 | `update_case` | [C38883](https://shopview.testrail.io/index.php?/cases/view/38883) | FLT-PSRCH-01 | 200 | 28 | byte-verified MATCH | B — already documents-first; sentence 2 normalised, failure fact kept |
| 90 | `update_case` | [C38884](https://shopview.testrail.io/index.php?/cases/view/38884) | FLT-PSRCH-02 | 200 | 28 | byte-verified MATCH | B — already documents-first; sentence 2 normalised, failure fact kept |
| 91 | `update_case` | [C38886](https://shopview.testrail.io/index.php?/cases/view/38886) | FLT-PSRCH-03 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 92 | `update_case` | [C38888](https://shopview.testrail.io/index.php?/cases/view/38888) | FLT-PSRCH-04 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 93 | `update_case` | [C38889](https://shopview.testrail.io/index.php?/cases/view/38889) | FLT-PSRCH-05 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 94 | `update_case` | [C38891](https://shopview.testrail.io/index.php?/cases/view/38891) | FLT-PSRCH-06 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 95 | `update_case` | [C38893](https://shopview.testrail.io/index.php?/cases/view/38893) | FLT-PSRCH-07 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 96 | `update_case` | [C38898](https://shopview.testrail.io/index.php?/cases/view/38898) | FLT-PSRCH-08 | 200 | 28 | byte-verified MATCH | B — already documents-first; sentence 2 normalised, failure fact kept |
| 97 | `update_case` | [C38899](https://shopview.testrail.io/index.php?/cases/view/38899) | FLT-PSRCH-09 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 98 | `update_case` | [C38900](https://shopview.testrail.io/index.php?/cases/view/38900) | FLT-PSRCH-10 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 99 | `update_case` | [C38901](https://shopview.testrail.io/index.php?/cases/view/38901) | FLT-PSRCH-11 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 100 | `update_case` | [C38902](https://shopview.testrail.io/index.php?/cases/view/38902) | FLT-PSRCH-12 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 101 | `update_case` | [C38903](https://shopview.testrail.io/index.php?/cases/view/38903) | FLT-PSRCH-13 | 200 | 28 | byte-verified MATCH | A — build named first as the source (BARRED) |
| 102 | `update_case` | [C38904](https://shopview.testrail.io/index.php?/cases/view/38904) | FLT-PARTS-01 | 200 | 28 | byte-verified MATCH | C — not built; build moved out of sentence 1 into the checking sentence |
| 103 | `update_case` | [C38905](https://shopview.testrail.io/index.php?/cases/view/38905) | FLT-PARTS-09 | 200 | 28 | byte-verified MATCH | C — not built; build moved out of sentence 1 into the checking sentence |
| 104 | `update_case` | [C38906](https://shopview.testrail.io/index.php?/cases/view/38906) | FLT-PARTS-11 | 200 | 28 | byte-verified MATCH | C — not built; build moved out of sentence 1 into the checking sentence |
| 105 | `update_case` | [C38907](https://shopview.testrail.io/index.php?/cases/view/38907) | FLT-PARTS-12 | 200 | 28 | byte-verified MATCH | C — not built; build moved out of sentence 1 into the checking sentence |
| 106 | `update_case` | [C38908](https://shopview.testrail.io/index.php?/cases/view/38908) | FLT-PARTS-13 | 200 | 28 | byte-verified MATCH | C — not built; build moved out of sentence 1 into the checking sentence |
| 107 | `update_case` | [C38882](https://shopview.testrail.io/index.php?/cases/view/38882) | FLT-RPTS-23 | 200 | 28 | byte-verified MATCH | C — no numbered requirement; build clause removed from sentence 1 |
| 108 | `update_case` | [C38909](https://shopview.testrail.io/index.php?/cases/view/38909) | FLT-RPTS-01 | 200 | 28 | byte-verified MATCH | C — not built; build moved out of sentence 1 into the checking sentence |
| 109 | `update_case` | [C38910](https://shopview.testrail.io/index.php?/cases/view/38910) | FLT-RPTS-21 | 200 | 28 | byte-verified MATCH | C — not built; build moved out of sentence 1 into the checking sentence |
| 110 | `update_case` | [C38911](https://shopview.testrail.io/index.php?/cases/view/38911) | FLT-RPTS-22 | 200 | 28 | byte-verified MATCH | C — not built; build moved out of sentence 1 into the checking sentence |

**Total: 110 operations, 110 HTTP 200 + byte-verified MATCH, 0 failures, 0 mismatches.**
Every field not intended to change is proven byte-identical to the committed pre-write snapshot
(`snapshots/cases-PRE.json`, committed in 55ba6f6 before the first write).

## Did the omit-field re-render fire?

**No — 0 occurrences of 110.** `custom_preconds` and `custom_steps` came back byte-identical on
every one of the 110 re-GETs. That is the expected outcome of sending them explicitly; it is not
evidence that the normalisation has gone away, and the next pass must still send all three.
