# Filters — RE-CHECK QUEUE (Standing Rule 49)

> ## STATUS: **OPEN — but every row has been re-checked against the build now serving**
>
> The branch was redeployed overnight and **all 110 rows have been re-run against the new
> build**. The queue stays **OPEN** because **engineering has still not declared this branch
> final**, so every verdict below remains **PROVISIONAL** — observed live, with evidence, but
> limited in DURABILITY, not in rigour.
>
> | | 4 August verdicts were measured on | Re-checked on, 5 August |
> |---|---|---|
> | `<meta name="app-version">` | `v3.4.2-4f8211c` | **`v3.4.2-d00239b`** |
> | `index.html` last-modified | Mon, 03 Aug 2026 20:09:32 GMT | **Tue, 04 Aug 2026 22:51:02 GMT** |
> | `index.html` etag | `cf3ffbad546f569b2b86c36b53d87514` | **`b9ab1d41718b5e871432064ed914e2e7`** |
> | marker read | start / mid / end — identical | start 03:38 / mid 04:30 / end 04:42 UTC — **identical all three times, so no redeploy under us** |
>
> **Re-check outcome: 91 rows CONFIRMED · 19 rows CHANGED · 110 of 110 done, no sampling.**
> Every one of the 110 cases has had its provenance line re-stamped to name this build.

## What CHANGED, and why it matters

| # | Case | C-id | 4 Aug | 5 Aug | What changed |
|---|---|---|---|---|---|
| 6 | FLT-STAT-03 | [C29562](https://shopview.testrail.io/index.php?/cases/view/29562) | DEVIATION | **PASS** | the dropdown now STAYS OPEN after a tick - SV-8824 is fixed on this build, so the line telling a tester to expect a failure was removed |
| 7 | FLT-STAT-04 | [C29563](https://shopview.testrail.io/index.php?/cases/view/29563) | DEVIATION | **PASS** | the dropdown now STAYS OPEN after a tick - SV-8824 is fixed on this build, so the line telling a tester to expect a failure was removed |
| 8 | FLT-STAT-05 | [C29564](https://shopview.testrail.io/index.php?/cases/view/29564) | DEVIATION | **PASS** | the dropdown now STAYS OPEN after a tick - SV-8824 is fixed on this build, so the line telling a tester to expect a failure was removed |
| 13 | FLT-CUST-03 | [C29568](https://shopview.testrail.io/index.php?/cases/view/29568) | DEVIATION | **PASS** | the dropdown now STAYS OPEN after a tick - SV-8824 is fixed on this build, so the line telling a tester to expect a failure was removed |
| 15 | FLT-CUST-05 | [C29570](https://shopview.testrail.io/index.php?/cases/view/29570) | DEVIATION | **PASS** | the dropdown now STAYS OPEN after a tick - SV-8824 is fixed on this build, so the line telling a tester to expect a failure was removed |
| 17 | FLT-CUST-07 | [C29572](https://shopview.testrail.io/index.php?/cases/view/29572) | DEVIATION | **PASS** | the dropdown now STAYS OPEN after a tick - SV-8824 is fixed on this build, so the line telling a tester to expect a failure was removed |
| 22 | FLT-TECH-03 | [C29577](https://shopview.testrail.io/index.php?/cases/view/29577) | DEVIATION | **PASS** | the dropdown now STAYS OPEN after a tick - SV-8824 is fixed on this build, so the line telling a tester to expect a failure was removed |
| 24 | FLT-TECH-05 | [C29579](https://shopview.testrail.io/index.php?/cases/view/29579) | DEVIATION | **PASS** | the dropdown now STAYS OPEN after a tick - SV-8824 is fixed on this build, so the line telling a tester to expect a failure was removed |
| 29 | FLT-ADV-03 | [C29584](https://shopview.testrail.io/index.php?/cases/view/29584) | DEVIATION | **PASS** | the dropdown now STAYS OPEN after a tick - SV-8824 is fixed on this build, so the line telling a tester to expect a failure was removed |
| 31 | FLT-ADV-05 | [C29586](https://shopview.testrail.io/index.php?/cases/view/29586) | DEVIATION | **PASS** | the dropdown now STAYS OPEN after a tick - SV-8824 is fixed on this build, so the line telling a tester to expect a failure was removed |
| 38 | FLT-ASSET-05 | [C29593](https://shopview.testrail.io/index.php?/cases/view/29593) | DEVIATION | **PASS** | the dropdown now STAYS OPEN after a tick - SV-8824 is fixed on this build, so the line telling a tester to expect a failure was removed |
| 41 | FLT-CHIP-01 | [C29595](https://shopview.testrail.io/index.php?/cases/view/29595) | DEVIATION | **PASS** | the dropdown now STAYS OPEN after a tick - SV-8824 is fixed on this build, so the line telling a tester to expect a failure was removed |
| 61 | FLT-PERS-01 | [C29613](https://shopview.testrail.io/index.php?/cases/view/29613) | PASS | **DEVIATION** | NEW defect SV-8871 - after leaving and returning, the Customer, Lead Technician and Service Advisor buttons come back switched on but without the value name, which breaches the case's "chips active with the same values" |
| 64 | FLT-PERS-04 | [C29616](https://shopview.testrail.io/index.php?/cases/view/29616) | PASS | **DEVIATION** | our 4 August PASS was an over-claim. With the deleted-customer state actually seeded, the deleted value is still applied to the table - Ahtasham's Failed result is right, ticket SV-8832 |
| 68 | FLT-URL-02 | [C29618](https://shopview.testrail.io/index.php?/cases/view/29618) | DEVIATION | **DEVIATION** | still a deviation, but for a SECOND reason as well - on desktop a shared link brings the Customer button back without its value name (SV-8871), on top of the phone problem (SV-8845) |
| 98 | FLT-PSRCH-10 | [C38900](https://shopview.testrail.io/index.php?/cases/view/38900) | DEVIATION | **PASS** | the page search is no longer saved to the account - SV-8844 is fixed, so the known-issue line was deleted outright |
| 99 | FLT-PSRCH-11 | [C38901](https://shopview.testrail.io/index.php?/cases/view/38901) | DEVIATION | **PASS** | the page search is no longer saved to the account - SV-8844 is fixed, so the known-issue line was deleted outright |
| 100 | FLT-PSRCH-12 | [C38902](https://shopview.testrail.io/index.php?/cases/view/38902) | DEVIATION | **PASS** | the page search is no longer saved to the account - SV-8844 is fixed, so the known-issue line was deleted outright |
| 107 | FLT-RPTS-23 | [C38882](https://shopview.testrail.io/index.php?/cases/view/38882) | NOTBUILT | **PASS** | the Reports date filter IS built and behaves exactly as the newer specification describes, so the case was rewritten to the new wording and is no longer "not built" |

## The five tickets, on the new build

| Ticket | Jira status now | Re-tested live on `v3.4.2-d00239b` | Our cases |
|---|---|---|---|
| [SV-8843](https://shopview.atlassian.net/browse/SV-8843) | OBSOLETE / Done, closed by the QA lead with the note *"Not Reproducible Anymore"* | **STILL HAPPENS.** The five filter buttons still sit on the tab row (buttons at y=90 height 30, tabs at y=85 height 40) and collapsing the bar still moves the table header by **0 pixels** — geometry byte-identical to 4 August | 2 cases now carry the accepted-behaviour note |
| [SV-8844](https://shopview.atlassian.net/browse/SV-8844) | Open, retitled by someone else to *"Page Search is not working Anymore"* | **FIXED.** The saved page preference holds **no `search` key at all**, and typing a word sends **no save request** (`putBodies` empty, where the old build sent `"search":"Lastone"`). A brand-new browser opens `/workorders` with a clean address and **30 rows**, where the old build restored `?search=ZZQQNOMATCHXX` and showed 0 | 3 cases lost the known-issue line outright |
| [SV-8845](https://shopview.atlassian.net/browse/SV-8845) | Open | **STILL HAPPENS** — mobile observations byte-identical to 4 August | 2 cases keep waiting for a fix |
| [SV-8846](https://shopview.atlassian.net/browse/SV-8846) | Open | **STILL HAPPENS** — byte-identical | 1 case keeps waiting for a fix |
| [SV-8847](https://shopview.atlassian.net/browse/SV-8847) | OBSOLETE / Done, closed with no reason recorded | **STILL HAPPENS** — the empty state reads `No work orders match your filters` with only a "Clear Filters" link; byte-identical | 3 cases now carry the accepted-behaviour note |

**Two more tickets moved, and neither is ours:** [SV-8824](https://shopview.atlassian.net/browse/SV-8824)
is now **Ready for QA** and our own live test agrees it is fixed; [SV-8832](https://shopview.atlassian.net/browse/SV-8832)
is still **Open** and we reproduced it with seeded data.

**One new ticket of ours:** [SV-8871](https://shopview.atlassian.net/browse/SV-8871).

## The full 110 rows

| # | Case | C-id | 4 Aug verdict | 5 Aug verdict | Re-check | What must be re-confirmed next time |
|---|---|---|---|---|---|---|
| 1 | FLT-BAR-01 | [C29557](https://shopview.testrail.io/index.php?/cases/view/29557) | DEVIATION | **DEVIATION** | CONFIRMED | whether the reported difference is fixed — if it is, the known-issue line comes off |
| 2 | FLT-BAR-02 | [C29558](https://shopview.testrail.io/index.php?/cases/view/29558) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 3 | FLT-BAR-03 | [C29559](https://shopview.testrail.io/index.php?/cases/view/29559) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 4 | FLT-STAT-01 | [C29560](https://shopview.testrail.io/index.php?/cases/view/29560) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 5 | FLT-STAT-02 | [C29561](https://shopview.testrail.io/index.php?/cases/view/29561) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 6 | FLT-STAT-03 | [C29562](https://shopview.testrail.io/index.php?/cases/view/29562) | DEVIATION | **PASS** | **CHANGED** | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 7 | FLT-STAT-04 | [C29563](https://shopview.testrail.io/index.php?/cases/view/29563) | DEVIATION | **PASS** | **CHANGED** | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 8 | FLT-STAT-05 | [C29564](https://shopview.testrail.io/index.php?/cases/view/29564) | DEVIATION | **PASS** | **CHANGED** | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 9 | FLT-STAT-06 | [C29565](https://shopview.testrail.io/index.php?/cases/view/29565) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 10 | FLT-STAT-07 | [C38877](https://shopview.testrail.io/index.php?/cases/view/38877) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 11 | FLT-CUST-01 | [C29566](https://shopview.testrail.io/index.php?/cases/view/29566) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 12 | FLT-CUST-02 | [C29567](https://shopview.testrail.io/index.php?/cases/view/29567) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 13 | FLT-CUST-03 | [C29568](https://shopview.testrail.io/index.php?/cases/view/29568) | DEVIATION | **PASS** | **CHANGED** | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 14 | FLT-CUST-04 | [C29569](https://shopview.testrail.io/index.php?/cases/view/29569) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 15 | FLT-CUST-05 | [C29570](https://shopview.testrail.io/index.php?/cases/view/29570) | DEVIATION | **PASS** | **CHANGED** | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 16 | FLT-CUST-06 | [C29571](https://shopview.testrail.io/index.php?/cases/view/29571) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 17 | FLT-CUST-07 | [C29572](https://shopview.testrail.io/index.php?/cases/view/29572) | DEVIATION | **PASS** | **CHANGED** | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 18 | FLT-CUST-08 | [C29573](https://shopview.testrail.io/index.php?/cases/view/29573) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 19 | FLT-CUST-09 | [C29574](https://shopview.testrail.io/index.php?/cases/view/29574) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 20 | FLT-TECH-01 | [C29575](https://shopview.testrail.io/index.php?/cases/view/29575) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 21 | FLT-TECH-02 | [C29576](https://shopview.testrail.io/index.php?/cases/view/29576) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 22 | FLT-TECH-03 | [C29577](https://shopview.testrail.io/index.php?/cases/view/29577) | DEVIATION | **PASS** | **CHANGED** | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 23 | FLT-TECH-04 | [C29578](https://shopview.testrail.io/index.php?/cases/view/29578) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 24 | FLT-TECH-05 | [C29579](https://shopview.testrail.io/index.php?/cases/view/29579) | DEVIATION | **PASS** | **CHANGED** | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 25 | FLT-TECH-06 | [C29580](https://shopview.testrail.io/index.php?/cases/view/29580) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 26 | FLT-TECH-07 | [C29581](https://shopview.testrail.io/index.php?/cases/view/29581) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 27 | FLT-ADV-01 | [C29582](https://shopview.testrail.io/index.php?/cases/view/29582) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 28 | FLT-ADV-02 | [C29583](https://shopview.testrail.io/index.php?/cases/view/29583) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 29 | FLT-ADV-03 | [C29584](https://shopview.testrail.io/index.php?/cases/view/29584) | DEVIATION | **PASS** | **CHANGED** | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 30 | FLT-ADV-04 | [C29585](https://shopview.testrail.io/index.php?/cases/view/29585) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 31 | FLT-ADV-05 | [C29586](https://shopview.testrail.io/index.php?/cases/view/29586) | DEVIATION | **PASS** | **CHANGED** | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 32 | FLT-ADV-06 | [C29587](https://shopview.testrail.io/index.php?/cases/view/29587) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 33 | FLT-ADV-07 | [C29588](https://shopview.testrail.io/index.php?/cases/view/29588) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 34 | FLT-ASSET-01 | [C29589](https://shopview.testrail.io/index.php?/cases/view/29589) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 35 | FLT-ASSET-02 | [C29590](https://shopview.testrail.io/index.php?/cases/view/29590) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 36 | FLT-ASSET-03 | [C29591](https://shopview.testrail.io/index.php?/cases/view/29591) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 37 | FLT-ASSET-04 | [C29592](https://shopview.testrail.io/index.php?/cases/view/29592) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 38 | FLT-ASSET-05 | [C29593](https://shopview.testrail.io/index.php?/cases/view/29593) | DEVIATION | **PASS** | **CHANGED** | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 39 | FLT-ASSET-06 | [C29594](https://shopview.testrail.io/index.php?/cases/view/29594) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 40 | FLT-ASSET-07 | [C38878](https://shopview.testrail.io/index.php?/cases/view/38878) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 41 | FLT-CHIP-01 | [C29595](https://shopview.testrail.io/index.php?/cases/view/29595) | DEVIATION | **PASS** | **CHANGED** | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 42 | FLT-CHIP-02 | [C29596](https://shopview.testrail.io/index.php?/cases/view/29596) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 43 | FLT-CHIP-03 | [C29597](https://shopview.testrail.io/index.php?/cases/view/29597) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 44 | FLT-CHIP-04 | [C29598](https://shopview.testrail.io/index.php?/cases/view/29598) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 45 | FLT-CHIP-05 | [C29599](https://shopview.testrail.io/index.php?/cases/view/29599) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 46 | FLT-CHIP-06 | [C29600](https://shopview.testrail.io/index.php?/cases/view/29600) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 47 | FLT-COLL-01 | [C29601](https://shopview.testrail.io/index.php?/cases/view/29601) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 48 | FLT-COLL-02 | [C29602](https://shopview.testrail.io/index.php?/cases/view/29602) | DEVIATION | **DEVIATION** | CONFIRMED | whether the reported difference is fixed — if it is, the known-issue line comes off |
| 49 | FLT-COLL-03 | [C29603](https://shopview.testrail.io/index.php?/cases/view/29603) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 50 | FLT-COLL-04 | [C29604](https://shopview.testrail.io/index.php?/cases/view/29604) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 51 | FLT-COLL-05 | [C29605](https://shopview.testrail.io/index.php?/cases/view/29605) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 52 | FLT-EMPTY-01 | [C29606](https://shopview.testrail.io/index.php?/cases/view/29606) | DEVIATION | **DEVIATION** | CONFIRMED | whether the reported difference is fixed — if it is, the known-issue line comes off |
| 53 | FLT-EMPTY-02 | [C29607](https://shopview.testrail.io/index.php?/cases/view/29607) | DEVIATION | **DEVIATION** | CONFIRMED | whether the reported difference is fixed — if it is, the known-issue line comes off |
| 54 | FLT-EMPTY-03 | [C38897](https://shopview.testrail.io/index.php?/cases/view/38897) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 55 | FLT-TAB-01 | [C29608](https://shopview.testrail.io/index.php?/cases/view/29608) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 56 | FLT-TAB-02 | [C29609](https://shopview.testrail.io/index.php?/cases/view/29609) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 57 | FLT-TAB-03 | [C29610](https://shopview.testrail.io/index.php?/cases/view/29610) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 58 | FLT-TAB-04 | [C29611](https://shopview.testrail.io/index.php?/cases/view/29611) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 59 | FLT-TAB-05 | [C29612](https://shopview.testrail.io/index.php?/cases/view/29612) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 60 | FLT-TAB-06 | [C38876](https://shopview.testrail.io/index.php?/cases/view/38876) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 61 | FLT-PERS-01 | [C29613](https://shopview.testrail.io/index.php?/cases/view/29613) | PASS | **DEVIATION** | **CHANGED** | whether the reported difference is fixed — if it is, the known-issue line comes off |
| 62 | FLT-PERS-02 | [C29614](https://shopview.testrail.io/index.php?/cases/view/29614) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 63 | FLT-PERS-03 | [C29615](https://shopview.testrail.io/index.php?/cases/view/29615) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 64 | FLT-PERS-04 | [C29616](https://shopview.testrail.io/index.php?/cases/view/29616) | PASS | **DEVIATION** | **CHANGED** | whether the reported difference is fixed — if it is, the known-issue line comes off |
| 65 | FLT-PERS-05 | [C38880](https://shopview.testrail.io/index.php?/cases/view/38880) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 66 | FLT-PERS-06 | [C38881](https://shopview.testrail.io/index.php?/cases/view/38881) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 67 | FLT-URL-01 | [C29617](https://shopview.testrail.io/index.php?/cases/view/29617) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 68 | FLT-URL-02 | [C29618](https://shopview.testrail.io/index.php?/cases/view/29618) | DEVIATION | **DEVIATION** | **CHANGED** | whether the reported difference is fixed — if it is, the known-issue line comes off |
| 69 | FLT-URL-03 | [C29619](https://shopview.testrail.io/index.php?/cases/view/29619) | DEVIATION | **DEVIATION** | CONFIRMED | whether the reported difference is fixed — if it is, the known-issue line comes off |
| 70 | FLT-URL-04 | [C29620](https://shopview.testrail.io/index.php?/cases/view/29620) | DEVIATION | **DEVIATION** | CONFIRMED | whether the reported difference is fixed — if it is, the known-issue line comes off |
| 71 | FLT-URL-05 | [C38879](https://shopview.testrail.io/index.php?/cases/view/38879) | DEVIATION | **DEVIATION** | CONFIRMED | whether the reported difference is fixed — if it is, the known-issue line comes off |
| 72 | FLT-URL-06 | [C38896](https://shopview.testrail.io/index.php?/cases/view/38896) | DEVIATION | **DEVIATION** | CONFIRMED | whether the reported difference is fixed — if it is, the known-issue line comes off |
| 73 | FLT-MOB-01 | [C29621](https://shopview.testrail.io/index.php?/cases/view/29621) | HELD | **HELD** | CONFIRMED | the product owner's answer to SV-8825 AND whether the build has changed to match it |
| 74 | FLT-MOB-02 | [C29622](https://shopview.testrail.io/index.php?/cases/view/29622) | HELD | **HELD** | CONFIRMED | the product owner's answer to SV-8825 AND whether the build has changed to match it |
| 75 | FLT-MOB-03 | [C29623](https://shopview.testrail.io/index.php?/cases/view/29623) | HELD | **HELD** | CONFIRMED | the product owner's answer to SV-8825 AND whether the build has changed to match it |
| 76 | FLT-MOB-04 | [C29624](https://shopview.testrail.io/index.php?/cases/view/29624) | HELD | **HELD** | CONFIRMED | the product owner's answer to SV-8825 AND whether the build has changed to match it |
| 77 | FLT-MOB-05 | [C29625](https://shopview.testrail.io/index.php?/cases/view/29625) | HELD | **HELD** | CONFIRMED | the product owner's answer to SV-8825 AND whether the build has changed to match it |
| 78 | FLT-MOB-06 | [C29626](https://shopview.testrail.io/index.php?/cases/view/29626) | HELD | **HELD** | CONFIRMED | the product owner's answer to SV-8825 AND whether the build has changed to match it |
| 79 | FLT-MOB-07 | [C29627](https://shopview.testrail.io/index.php?/cases/view/29627) | HELD | **HELD** | CONFIRMED | the product owner's answer to SV-8825 AND whether the build has changed to match it |
| 80 | FLT-MOB-08 | [C29628](https://shopview.testrail.io/index.php?/cases/view/29628) | DEVIATION | **DEVIATION** | CONFIRMED | whether the reported difference is fixed — if it is, the known-issue line comes off |
| 81 | FLT-MOB-09 | [C29629](https://shopview.testrail.io/index.php?/cases/view/29629) | DEVIATION | **DEVIATION** | CONFIRMED | whether the reported difference is fixed — if it is, the known-issue line comes off |
| 82 | FLT-MOB-10 | [C29630](https://shopview.testrail.io/index.php?/cases/view/29630) | HELD | **HELD** | CONFIRMED | the product owner's answer to SV-8825 AND whether the build has changed to match it |
| 83 | FLT-API-01 | [C29631](https://shopview.testrail.io/index.php?/cases/view/29631) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 84 | FLT-API-02 | [C29632](https://shopview.testrail.io/index.php?/cases/view/29632) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 85 | FLT-API-03 | [C29633](https://shopview.testrail.io/index.php?/cases/view/29633) | DEVIATION | **DEVIATION** | CONFIRMED | whether the reported difference is fixed — if it is, the known-issue line comes off |
| 86 | FLT-API-04 | [C29634](https://shopview.testrail.io/index.php?/cases/view/29634) | DEVIATION | **DEVIATION** | CONFIRMED | whether the reported difference is fixed — if it is, the known-issue line comes off |
| 87 | FLT-API-05 | [C29635](https://shopview.testrail.io/index.php?/cases/view/29635) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 88 | FLT-API-06 | [C38895](https://shopview.testrail.io/index.php?/cases/view/38895) | EXTDEP | **EXTDEP** | CONFIRMED | the one-user-does-not-see-another's-filters step, once a second sign-in exists |
| 89 | FLT-PSRCH-01 | [C38883](https://shopview.testrail.io/index.php?/cases/view/38883) | DEVIATION | **DEVIATION** | CONFIRMED | whether the reported difference is fixed — if it is, the known-issue line comes off |
| 90 | FLT-PSRCH-02 | [C38884](https://shopview.testrail.io/index.php?/cases/view/38884) | DEVIATION | **DEVIATION** | CONFIRMED | whether the reported difference is fixed — if it is, the known-issue line comes off |
| 91 | FLT-PSRCH-03 | [C38886](https://shopview.testrail.io/index.php?/cases/view/38886) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 92 | FLT-PSRCH-04 | [C38888](https://shopview.testrail.io/index.php?/cases/view/38888) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 93 | FLT-PSRCH-05 | [C38889](https://shopview.testrail.io/index.php?/cases/view/38889) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 94 | FLT-PSRCH-06 | [C38891](https://shopview.testrail.io/index.php?/cases/view/38891) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 95 | FLT-PSRCH-07 | [C38893](https://shopview.testrail.io/index.php?/cases/view/38893) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 96 | FLT-PSRCH-08 | [C38898](https://shopview.testrail.io/index.php?/cases/view/38898) | DEVIATION | **DEVIATION** | CONFIRMED | whether the reported difference is fixed — if it is, the known-issue line comes off |
| 97 | FLT-PSRCH-09 | [C38899](https://shopview.testrail.io/index.php?/cases/view/38899) | DEVIATION | **DEVIATION** | CONFIRMED | whether the reported difference is fixed — if it is, the known-issue line comes off |
| 98 | FLT-PSRCH-10 | [C38900](https://shopview.testrail.io/index.php?/cases/view/38900) | DEVIATION | **PASS** | **CHANGED** | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 99 | FLT-PSRCH-11 | [C38901](https://shopview.testrail.io/index.php?/cases/view/38901) | DEVIATION | **PASS** | **CHANGED** | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 100 | FLT-PSRCH-12 | [C38902](https://shopview.testrail.io/index.php?/cases/view/38902) | DEVIATION | **PASS** | **CHANGED** | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 101 | FLT-PSRCH-13 | [C38903](https://shopview.testrail.io/index.php?/cases/view/38903) | PASS | **PASS** | CONFIRMED | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 102 | FLT-PARTS-01 | [C38904](https://shopview.testrail.io/index.php?/cases/view/38904) | NOTBUILT | **NOTBUILT** | CONFIRMED | whether the filter bar / search control has since been built on this surface |
| 103 | FLT-PARTS-09 | [C38905](https://shopview.testrail.io/index.php?/cases/view/38905) | NOTBUILT | **NOTBUILT** | CONFIRMED | whether the filter bar / search control has since been built on this surface |
| 104 | FLT-PARTS-11 | [C38906](https://shopview.testrail.io/index.php?/cases/view/38906) | NOTBUILT | **NOTBUILT** | CONFIRMED | whether the filter bar / search control has since been built on this surface |
| 105 | FLT-PARTS-12 | [C38907](https://shopview.testrail.io/index.php?/cases/view/38907) | NOTBUILT | **NOTBUILT** | CONFIRMED | whether the filter bar / search control has since been built on this surface |
| 106 | FLT-PARTS-13 | [C38908](https://shopview.testrail.io/index.php?/cases/view/38908) | NOTBUILT | **NOTBUILT** | CONFIRMED | whether the filter bar / search control has since been built on this surface |
| 107 | FLT-RPTS-23 | [C38882](https://shopview.testrail.io/index.php?/cases/view/38882) | NOTBUILT | **PASS** | **CHANGED** | that the behaviour still matches, and that the labels quoted in the case are still the ones on screen |
| 108 | FLT-RPTS-01 | [C38909](https://shopview.testrail.io/index.php?/cases/view/38909) | NOTBUILT | **NOTBUILT** | CONFIRMED | whether the filter bar / search control has since been built on this surface |
| 109 | FLT-RPTS-21 | [C38910](https://shopview.testrail.io/index.php?/cases/view/38910) | NOTBUILT | **NOTBUILT** | CONFIRMED | whether the filter bar / search control has since been built on this surface |
| 110 | FLT-RPTS-22 | [C38911](https://shopview.testrail.io/index.php?/cases/view/38911) | NOTBUILT | **NOTBUILT** | CONFIRMED | whether the filter bar / search control has since been built on this surface |

**Rows: 110 — one per case, 100% of the suite. 91 CONFIRMED, 19 CHANGED.**
