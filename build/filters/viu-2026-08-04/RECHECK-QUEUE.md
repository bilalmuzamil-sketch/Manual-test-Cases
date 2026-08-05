# Filters — RE-CHECK QUEUE (Standing Rule 49)

> ## STATUS: **OPEN — AND THE TRIGGER HAS NOW FIRED (2026-08-05)**
>
> **THE BRANCH WAS REDEPLOYED OVERNIGHT.** The app-version marker changed, which is exactly the
> condition that forces this queue to be re-run. So **all 110 rows below are now stale**: they
> record verdicts against a build that no longer exists, and **every case's provenance line still
> names the old build**.
>
> | | Verdicts below were measured on | The branch is serving now |
> |---|---|---|
> | `<meta name="app-version">` | `v3.4.2-4f8211c` | **`v3.4.2-d00239b`** |
> | `index.html` last-modified | Mon, 03 Aug 2026 20:09:32 GMT | **Tue, 04 Aug 2026 22:51:02 GMT** |
> | `index.html` etag | `cf3ffbad546f569b2b86c36b53d87514` | **`b9ab1d41718b5e871432064ed914e2e7`** |
>
> **3 of the 110 rows have been re-checked on the new build so far** (the three dismissed-ticket
> defects — see the dismissal block below). **107 have not.** A full re-run needs the QA lead's
> go-ahead; it is logged as an outstanding item.
>
> The Filters QA branch has still **not been declared final by engineering**, so every finding here
> remains **PROVISIONAL**: observed live, with evidence, but limited in DURABILITY, not in rigour.

## THE QA LEAD'S DISMISSAL OF THREE TICKETS (2026-08-04) — what these rows now mean

> **"Note for filters the following tickets are valid others can be ignored by you."** — links to
> **SV-8845** and **SV-8846** only.

So **SV-8843, SV-8844 and SV-8847 are dismissed**. The eight rows below that were "waiting for a
fix" on those tickets are **no longer waiting for a fix**. Re-checked live on `v3.4.2-d00239b`:

| Rows | Ticket | Re-checked live 2026-08-05 | What the row now means |
|---|---|---|---|
| 1 (FLT-BAR-01 [C29557](https://shopview.testrail.io/index.php?/cases/view/29557)), 48 (FLT-COLL-02 [C29602](https://shopview.testrail.io/index.php?/cases/view/29602)) | SV-8843 — **dismissed**, ticket OBSOLETE | **CONFIRMED still present** — chips still share the tab row; collapsing frees 0px | **ACCEPTED, not awaiting a fix.** Re-check only whether the layout itself changes |
| 98 (FLT-PSRCH-10 [C38900](https://shopview.testrail.io/index.php?/cases/view/38900)), 99 (FLT-PSRCH-11 [C38901](https://shopview.testrail.io/index.php?/cases/view/38901)), 100 (FLT-PSRCH-12 [C38902](https://shopview.testrail.io/index.php?/cases/view/38902)) | SV-8844 — **dismissed**, ticket still Open + retitled | **CHANGED → the defect is FIXED.** The saved preference no longer stores a search term | **the deviation is resolved.** These three should become straight passes and lose their known-issue line |
| 52 (FLT-EMPTY-01 [C29606](https://shopview.testrail.io/index.php?/cases/view/29606)), 53 (FLT-EMPTY-02 [C29607](https://shopview.testrail.io/index.php?/cases/view/29607)), 97 (FLT-PSRCH-09 [C38899](https://shopview.testrail.io/index.php?/cases/view/38899)) | SV-8847 — **dismissed**, ticket OBSOLETE | **CONFIRMED still present** — empty state names filters and offers only "Clear Filters" | **ACCEPTED, not awaiting a fix** |

**SV-8845 and SV-8846 are VALID and unchanged**, so their rows keep waiting for a fix as before:
FLT-URL-04 [C29618](https://shopview.testrail.io/index.php?/cases/view/29618), FLT-MOB-10
[C29630](https://shopview.testrail.io/index.php?/cases/view/29630), FLT-MOB-08
[C29628](https://shopview.testrail.io/index.php?/cases/view/29628).

**BUILD MARKER — the thing that makes a re-check meaningful:**

| Field | Value the rows below were measured on | Value now (2026-08-05) |
|---|---|---|
| branch | `sv8785.qa.shopview.com` | same |
| API host | `sv8785api.qa.shopview.com` (verified live — previously only inferred from the naming pattern) | same, still answering |
| `<meta name="app-version">` | **`v3.4.2-4f8211c`** | **`v3.4.2-d00239b`** |
| `index.html` last-modified | Mon, 03 Aug 2026 20:09:32 GMT | Tue, 04 Aug 2026 22:51:02 GMT |
| `index.html` etag | `cf3ffbad546f569b2b86c36b53d87514` | `b9ab1d41718b5e871432064ed914e2e7` |
| observed | 2026-08-04, start / mid-run / end — **all three identical** | 2026-08-05, twice — identical |

**RE-RUN THIS QUEUE** at every session start for Filters, before and after any Filters work, and immediately if the app-version marker changes, a deploy is detected, or engineering declares the branch final. A row that flips to CHANGED is a finding in its own right and is reported, not quietly corrected. The queue closes only when **100% of rows** are re-verified.

| # | Case | C-id | Verdict on this build | What must be re-confirmed |
|---|---|---|---|---|
| 1 | FLT-BAR-01 | [C29557](https://shopview.testrail.io/index.php?/cases/view/29557) | DEVIATION | whether the reported defect is fixed — if it is, remove the known-issue line and the ticket link |
| 2 | FLT-BAR-02 | [C29558](https://shopview.testrail.io/index.php?/cases/view/29558) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 3 | FLT-BAR-03 | [C29559](https://shopview.testrail.io/index.php?/cases/view/29559) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 4 | FLT-STAT-01 | [C29560](https://shopview.testrail.io/index.php?/cases/view/29560) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 5 | FLT-STAT-02 | [C29561](https://shopview.testrail.io/index.php?/cases/view/29561) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 6 | FLT-STAT-03 | [C29562](https://shopview.testrail.io/index.php?/cases/view/29562) | DEVIATION | whether the reported defect is fixed — if it is, remove the known-issue line and the ticket link |
| 7 | FLT-STAT-04 | [C29563](https://shopview.testrail.io/index.php?/cases/view/29563) | DEVIATION | whether the reported defect is fixed — if it is, remove the known-issue line and the ticket link |
| 8 | FLT-STAT-05 | [C29564](https://shopview.testrail.io/index.php?/cases/view/29564) | DEVIATION | whether the reported defect is fixed — if it is, remove the known-issue line and the ticket link |
| 9 | FLT-STAT-06 | [C29565](https://shopview.testrail.io/index.php?/cases/view/29565) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 10 | FLT-STAT-07 | [C38877](https://shopview.testrail.io/index.php?/cases/view/38877) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 11 | FLT-CUST-01 | [C29566](https://shopview.testrail.io/index.php?/cases/view/29566) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 12 | FLT-CUST-02 | [C29567](https://shopview.testrail.io/index.php?/cases/view/29567) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 13 | FLT-CUST-03 | [C29568](https://shopview.testrail.io/index.php?/cases/view/29568) | DEVIATION | whether the reported defect is fixed — if it is, remove the known-issue line and the ticket link |
| 14 | FLT-CUST-04 | [C29569](https://shopview.testrail.io/index.php?/cases/view/29569) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 15 | FLT-CUST-05 | [C29570](https://shopview.testrail.io/index.php?/cases/view/29570) | DEVIATION | whether the reported defect is fixed — if it is, remove the known-issue line and the ticket link |
| 16 | FLT-CUST-06 | [C29571](https://shopview.testrail.io/index.php?/cases/view/29571) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 17 | FLT-CUST-07 | [C29572](https://shopview.testrail.io/index.php?/cases/view/29572) | DEVIATION | whether the reported defect is fixed — if it is, remove the known-issue line and the ticket link |
| 18 | FLT-CUST-08 | [C29573](https://shopview.testrail.io/index.php?/cases/view/29573) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 19 | FLT-CUST-09 | [C29574](https://shopview.testrail.io/index.php?/cases/view/29574) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 20 | FLT-TECH-01 | [C29575](https://shopview.testrail.io/index.php?/cases/view/29575) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 21 | FLT-TECH-02 | [C29576](https://shopview.testrail.io/index.php?/cases/view/29576) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 22 | FLT-TECH-03 | [C29577](https://shopview.testrail.io/index.php?/cases/view/29577) | DEVIATION | whether the reported defect is fixed — if it is, remove the known-issue line and the ticket link |
| 23 | FLT-TECH-04 | [C29578](https://shopview.testrail.io/index.php?/cases/view/29578) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 24 | FLT-TECH-05 | [C29579](https://shopview.testrail.io/index.php?/cases/view/29579) | DEVIATION | whether the reported defect is fixed — if it is, remove the known-issue line and the ticket link |
| 25 | FLT-TECH-06 | [C29580](https://shopview.testrail.io/index.php?/cases/view/29580) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 26 | FLT-TECH-07 | [C29581](https://shopview.testrail.io/index.php?/cases/view/29581) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 27 | FLT-ADV-01 | [C29582](https://shopview.testrail.io/index.php?/cases/view/29582) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 28 | FLT-ADV-02 | [C29583](https://shopview.testrail.io/index.php?/cases/view/29583) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 29 | FLT-ADV-03 | [C29584](https://shopview.testrail.io/index.php?/cases/view/29584) | DEVIATION | whether the reported defect is fixed — if it is, remove the known-issue line and the ticket link |
| 30 | FLT-ADV-04 | [C29585](https://shopview.testrail.io/index.php?/cases/view/29585) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 31 | FLT-ADV-05 | [C29586](https://shopview.testrail.io/index.php?/cases/view/29586) | DEVIATION | whether the reported defect is fixed — if it is, remove the known-issue line and the ticket link |
| 32 | FLT-ADV-06 | [C29587](https://shopview.testrail.io/index.php?/cases/view/29587) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 33 | FLT-ADV-07 | [C29588](https://shopview.testrail.io/index.php?/cases/view/29588) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 34 | FLT-ASSET-01 | [C29589](https://shopview.testrail.io/index.php?/cases/view/29589) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 35 | FLT-ASSET-02 | [C29590](https://shopview.testrail.io/index.php?/cases/view/29590) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 36 | FLT-ASSET-03 | [C29591](https://shopview.testrail.io/index.php?/cases/view/29591) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 37 | FLT-ASSET-04 | [C29592](https://shopview.testrail.io/index.php?/cases/view/29592) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 38 | FLT-ASSET-05 | [C29593](https://shopview.testrail.io/index.php?/cases/view/29593) | DEVIATION | whether the reported defect is fixed — if it is, remove the known-issue line and the ticket link |
| 39 | FLT-ASSET-06 | [C29594](https://shopview.testrail.io/index.php?/cases/view/29594) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 40 | FLT-ASSET-07 | [C38878](https://shopview.testrail.io/index.php?/cases/view/38878) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 41 | FLT-CHIP-01 | [C29595](https://shopview.testrail.io/index.php?/cases/view/29595) | DEVIATION | whether the reported defect is fixed — if it is, remove the known-issue line and the ticket link |
| 42 | FLT-CHIP-02 | [C29596](https://shopview.testrail.io/index.php?/cases/view/29596) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 43 | FLT-CHIP-03 | [C29597](https://shopview.testrail.io/index.php?/cases/view/29597) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 44 | FLT-CHIP-04 | [C29598](https://shopview.testrail.io/index.php?/cases/view/29598) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 45 | FLT-CHIP-05 | [C29599](https://shopview.testrail.io/index.php?/cases/view/29599) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 46 | FLT-CHIP-06 | [C29600](https://shopview.testrail.io/index.php?/cases/view/29600) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 47 | FLT-COLL-01 | [C29601](https://shopview.testrail.io/index.php?/cases/view/29601) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 48 | FLT-COLL-02 | [C29602](https://shopview.testrail.io/index.php?/cases/view/29602) | DEVIATION | whether the reported defect is fixed — if it is, remove the known-issue line and the ticket link |
| 49 | FLT-COLL-03 | [C29603](https://shopview.testrail.io/index.php?/cases/view/29603) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 50 | FLT-COLL-04 | [C29604](https://shopview.testrail.io/index.php?/cases/view/29604) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 51 | FLT-COLL-05 | [C29605](https://shopview.testrail.io/index.php?/cases/view/29605) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 52 | FLT-EMPTY-01 | [C29606](https://shopview.testrail.io/index.php?/cases/view/29606) | DEVIATION | whether the reported defect is fixed — if it is, remove the known-issue line and the ticket link |
| 53 | FLT-EMPTY-02 | [C29607](https://shopview.testrail.io/index.php?/cases/view/29607) | DEVIATION | whether the reported defect is fixed — if it is, remove the known-issue line and the ticket link |
| 54 | FLT-EMPTY-03 | [C38897](https://shopview.testrail.io/index.php?/cases/view/38897) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 55 | FLT-TAB-01 | [C29608](https://shopview.testrail.io/index.php?/cases/view/29608) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 56 | FLT-TAB-02 | [C29609](https://shopview.testrail.io/index.php?/cases/view/29609) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 57 | FLT-TAB-03 | [C29610](https://shopview.testrail.io/index.php?/cases/view/29610) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 58 | FLT-TAB-04 | [C29611](https://shopview.testrail.io/index.php?/cases/view/29611) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 59 | FLT-TAB-05 | [C29612](https://shopview.testrail.io/index.php?/cases/view/29612) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 60 | FLT-TAB-06 | [C38876](https://shopview.testrail.io/index.php?/cases/view/38876) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 61 | FLT-PERS-01 | [C29613](https://shopview.testrail.io/index.php?/cases/view/29613) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 62 | FLT-PERS-02 | [C29614](https://shopview.testrail.io/index.php?/cases/view/29614) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 63 | FLT-PERS-03 | [C29615](https://shopview.testrail.io/index.php?/cases/view/29615) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 64 | FLT-PERS-04 | [C29616](https://shopview.testrail.io/index.php?/cases/view/29616) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 65 | FLT-PERS-05 | [C38880](https://shopview.testrail.io/index.php?/cases/view/38880) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 66 | FLT-PERS-06 | [C38881](https://shopview.testrail.io/index.php?/cases/view/38881) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 67 | FLT-URL-01 | [C29617](https://shopview.testrail.io/index.php?/cases/view/29617) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 68 | FLT-URL-02 | [C29618](https://shopview.testrail.io/index.php?/cases/view/29618) | DEVIATION | whether the reported defect is fixed — if it is, remove the known-issue line and the ticket link |
| 69 | FLT-URL-03 | [C29619](https://shopview.testrail.io/index.php?/cases/view/29619) | DEVIATION | whether the reported defect is fixed — if it is, remove the known-issue line and the ticket link |
| 70 | FLT-URL-04 | [C29620](https://shopview.testrail.io/index.php?/cases/view/29620) | DEVIATION | whether the reported defect is fixed — if it is, remove the known-issue line and the ticket link |
| 71 | FLT-URL-05 | [C38879](https://shopview.testrail.io/index.php?/cases/view/38879) | DEVIATION | whether the reported defect is fixed — if it is, remove the known-issue line and the ticket link |
| 72 | FLT-URL-06 | [C38896](https://shopview.testrail.io/index.php?/cases/view/38896) | DEVIATION | whether the reported defect is fixed — if it is, remove the known-issue line and the ticket link |
| 73 | FLT-MOB-01 | [C29621](https://shopview.testrail.io/index.php?/cases/view/29621) | HELD | the product owner's answer to SV-8825 AND whether the build has changed to match it |
| 74 | FLT-MOB-02 | [C29622](https://shopview.testrail.io/index.php?/cases/view/29622) | HELD | the product owner's answer to SV-8825 AND whether the build has changed to match it |
| 75 | FLT-MOB-03 | [C29623](https://shopview.testrail.io/index.php?/cases/view/29623) | HELD | the product owner's answer to SV-8825 AND whether the build has changed to match it |
| 76 | FLT-MOB-04 | [C29624](https://shopview.testrail.io/index.php?/cases/view/29624) | HELD | the product owner's answer to SV-8825 AND whether the build has changed to match it |
| 77 | FLT-MOB-05 | [C29625](https://shopview.testrail.io/index.php?/cases/view/29625) | HELD | the product owner's answer to SV-8825 AND whether the build has changed to match it |
| 78 | FLT-MOB-06 | [C29626](https://shopview.testrail.io/index.php?/cases/view/29626) | HELD | the product owner's answer to SV-8825 AND whether the build has changed to match it |
| 79 | FLT-MOB-07 | [C29627](https://shopview.testrail.io/index.php?/cases/view/29627) | HELD | the product owner's answer to SV-8825 AND whether the build has changed to match it |
| 80 | FLT-MOB-08 | [C29628](https://shopview.testrail.io/index.php?/cases/view/29628) | DEVIATION | whether the reported defect is fixed — if it is, remove the known-issue line and the ticket link |
| 81 | FLT-MOB-09 | [C29629](https://shopview.testrail.io/index.php?/cases/view/29629) | DEVIATION | whether the reported defect is fixed — if it is, remove the known-issue line and the ticket link |
| 82 | FLT-MOB-10 | [C29630](https://shopview.testrail.io/index.php?/cases/view/29630) | HELD | the product owner's answer to SV-8825 AND whether the build has changed to match it |
| 83 | FLT-API-01 | [C29631](https://shopview.testrail.io/index.php?/cases/view/29631) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 84 | FLT-API-02 | [C29632](https://shopview.testrail.io/index.php?/cases/view/29632) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 85 | FLT-API-03 | [C29633](https://shopview.testrail.io/index.php?/cases/view/29633) | DEVIATION | whether the reported defect is fixed — if it is, remove the known-issue line and the ticket link |
| 86 | FLT-API-04 | [C29634](https://shopview.testrail.io/index.php?/cases/view/29634) | DEVIATION | whether the reported defect is fixed — if it is, remove the known-issue line and the ticket link |
| 87 | FLT-API-05 | [C29635](https://shopview.testrail.io/index.php?/cases/view/29635) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 88 | FLT-API-06 | [C38895](https://shopview.testrail.io/index.php?/cases/view/38895) | EXTDEP | the per-user isolation step, once a second sign-in is available |
| 89 | FLT-PSRCH-01 | [C38883](https://shopview.testrail.io/index.php?/cases/view/38883) | DEVIATION | whether the reported defect is fixed — if it is, remove the known-issue line and the ticket link |
| 90 | FLT-PSRCH-02 | [C38884](https://shopview.testrail.io/index.php?/cases/view/38884) | DEVIATION | whether the reported defect is fixed — if it is, remove the known-issue line and the ticket link |
| 91 | FLT-PSRCH-03 | [C38886](https://shopview.testrail.io/index.php?/cases/view/38886) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 92 | FLT-PSRCH-04 | [C38888](https://shopview.testrail.io/index.php?/cases/view/38888) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 93 | FLT-PSRCH-05 | [C38889](https://shopview.testrail.io/index.php?/cases/view/38889) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 94 | FLT-PSRCH-06 | [C38891](https://shopview.testrail.io/index.php?/cases/view/38891) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 95 | FLT-PSRCH-07 | [C38893](https://shopview.testrail.io/index.php?/cases/view/38893) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 96 | FLT-PSRCH-08 | [C38898](https://shopview.testrail.io/index.php?/cases/view/38898) | DEVIATION | whether the reported defect is fixed — if it is, remove the known-issue line and the ticket link |
| 97 | FLT-PSRCH-09 | [C38899](https://shopview.testrail.io/index.php?/cases/view/38899) | DEVIATION | whether the reported defect is fixed — if it is, remove the known-issue line and the ticket link |
| 98 | FLT-PSRCH-10 | [C38900](https://shopview.testrail.io/index.php?/cases/view/38900) | DEVIATION | whether the reported defect is fixed — if it is, remove the known-issue line and the ticket link |
| 99 | FLT-PSRCH-11 | [C38901](https://shopview.testrail.io/index.php?/cases/view/38901) | DEVIATION | whether the reported defect is fixed — if it is, remove the known-issue line and the ticket link |
| 100 | FLT-PSRCH-12 | [C38902](https://shopview.testrail.io/index.php?/cases/view/38902) | DEVIATION | whether the reported defect is fixed — if it is, remove the known-issue line and the ticket link |
| 101 | FLT-PSRCH-13 | [C38903](https://shopview.testrail.io/index.php?/cases/view/38903) | PASS | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 102 | FLT-PARTS-01 | [C38904](https://shopview.testrail.io/index.php?/cases/view/38904) | NOTBUILT | whether the filter bar / search control has since been built on this surface |
| 103 | FLT-PARTS-09 | [C38905](https://shopview.testrail.io/index.php?/cases/view/38905) | NOTBUILT | whether the filter bar / search control has since been built on this surface |
| 104 | FLT-PARTS-11 | [C38906](https://shopview.testrail.io/index.php?/cases/view/38906) | NOTBUILT | whether the filter bar / search control has since been built on this surface |
| 105 | FLT-PARTS-12 | [C38907](https://shopview.testrail.io/index.php?/cases/view/38907) | NOTBUILT | whether the filter bar / search control has since been built on this surface |
| 106 | FLT-PARTS-13 | [C38908](https://shopview.testrail.io/index.php?/cases/view/38908) | NOTBUILT | whether the filter bar / search control has since been built on this surface |
| 107 | FLT-RPTS-23 | [C38882](https://shopview.testrail.io/index.php?/cases/view/38882) | NOTBUILT | whether the filter bar / search control has since been built on this surface |
| 108 | FLT-RPTS-01 | [C38909](https://shopview.testrail.io/index.php?/cases/view/38909) | NOTBUILT | whether the filter bar / search control has since been built on this surface |
| 109 | FLT-RPTS-21 | [C38910](https://shopview.testrail.io/index.php?/cases/view/38910) | NOTBUILT | whether the filter bar / search control has since been built on this surface |
| 110 | FLT-RPTS-22 | [C38911](https://shopview.testrail.io/index.php?/cases/view/38911) | NOTBUILT | whether the filter bar / search control has since been built on this surface |

**Rows: 110 — one per case, 100% of the suite.**
