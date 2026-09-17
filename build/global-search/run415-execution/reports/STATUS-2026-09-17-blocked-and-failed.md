## Where every unfinished check stands

Since you asked, three of the stuck ones got unstuck by doing the work rather than parking it, so the shape has changed a little: **134 checks pass. 17 fail. 14 are held.** One check was never mine to run.

Of the 17 that fail, **11 already have a report with the developers.** Of the remaining six, **three are reports I have written and am holding for your go-ahead**, and **three are questions for you, not faults.**

---

### The 17 that fail

**Already reported to the developers — nothing needed from you (11)**

| What the check looks at | Where it sits |
|---|---|
| The "Show all" link that should appear when a group has more than five matches | Reported |
| A vehicle line should show year, make, model and its owner | Reported |
| A part-sale line should show its number, the customer and the stage | Reported |
| A match on a contact's details should rank below a match on the record's own name | Reported |
| The wording when a single tab finds nothing | Reported |
| Six more from the other stream of work on the same list | Reported by that stream |

**Reports written and waiting for your go-ahead (3)**

| What a user sees | What I need |
|---|---|
| A job that is part-way through work shows **green** on the Work Orders list and **orange** in the search. Inside the search it is the same orange as two other stages, so three different points in a job's life look identical there | Your go-ahead to raise it |
| On a job's own page, a part already on that job is **not** lifted to the top of the search — it stays where it would be for anyone | Your go-ahead to raise it |
| Moving through the results with the Tab key stops dead on the row of tabs and never reaches the results themselves | Your go-ahead — **and please read the caution below** |

> **The caution on the last one.** Keeping the typing cursor in the box and using the up and down arrows for the list is a normal, deliberate way to build this kind of search, and that is exactly what the product does. Our own check may simply be asking for the wrong thing. I would rather look at the written requirement before we send anyone to change working behaviour.

**Not faults — questions for you (3)**

| What it is | The question |
|---|---|
| No number in the search reads higher than twenty | You already told me twenty is counted for each type, so the product is right and **our own check is worded too broadly.** I need your word to correct the check. |
| On a phone the prompt reads "Search work orders, parts…" | Our check says it should read "Search everything". I cannot tell which is right without the written requirement. |
| On a phone the arrow keys still move a highlight | Our check says they should not. Same question. |

---

### The 14 that are held

**Held because the piece of work behind them has been marked obsolete by the team (10)**

Eight of these are the hover shortcuts on a result line — hovering a job to add a line, hovering a vehicle to start a job, and so on. The ninth is the "Show all" handover to a full page. The tenth is moving the Work Orders, Parts and Customers page searches onto the main search.

**This is the thing in this report I would most like you to look at.** Those requirements are still written in the specification and still written into our checks, but the work that would build them is marked obsolete, and in one case the check that would confirm it has not been started. Either the work comes back and we re-run these, or the requirement is dropped and we retire the checks. Ten checks sit still until someone decides.

On the last of them I did the measuring anyway, so the decision can be made with facts: **the Work Orders page search and the main search behave differently today.** Typing *brake* into the main search brings back twenty jobs; typing the same word into the Work Orders page's own search says *"No work orders match the search brake."* A word with a typo in it, *Fibrige*, brings back twenty jobs from the main search and nothing from the page search. The same page search finds thirty-two rows for *Buda*, so it is working — it simply matches differently.

**Held for a reason outside the product (4)**

| What it checks | Why it is held, and what would clear it |
|---|---|
| Recent activity grouped under Today, Yesterday, Past week, Older | Only Today can be produced. The product always stamps a visit as happening now; I tried three ways to date one in the past and it refused all three. The other headings appear by themselves once the branch has been used for a few days. |
| Results stay inside the signed-in person's own organisation | **Moved forward today.** The branch had one organisation, so there was nothing to test against. It now has two — I created the second through the product's own "Register your organization" page. What is still missing is a customer or a job inside that second organisation, and there is no way from this branch to sign in as it. Give it one customer and one job and this runs in ten minutes. |
| A person with no home branch does not break the search | From the other stream. That person can no longer sign in at all. |
| Selecting a result records a usage event | From the other stream. The written requirements put this outside this release. |

---

### Which folders were left out

Three, and none of them by accident.

| Folder | Why |
|---|---|
| **Out of V1 scope** — one check, on usage logging | The written requirements put it outside this release, and the handover excluded it. It is the one check on the list with no result at all. |
| **V1 regression** — sixty-six checks | The other stream's work. They ran it and reported their own faults; six of the seventeen failures above are theirs. |
| **V1 regression, derived** — one check | Already had a result before today. |

Every other folder — all seventeen of them — I ran end to end.

---

### Your count of nine — where all nine went

| | |
|---|---|
| Reported to the developers | **5** |
| Withdrawn, because the product was right and I was wrong | **1** — the empty search box. I had broken the connection and waited; in that gap the branch went to sleep and swapped the page for a sleeping notice. The product's own behaviour is correct. |
| Waiting on your decision, not on a report | **3** — the twenty, and the two phone ones |
| **Total** | **9** |

So the nine are accounted for. **I should have told you that plainly this morning** instead of handing you five and leaving you to work out where the other four went. Since then the work above has added **three more**, which is why the failing total moved from fourteen to seventeen.

---

### One thing worth a developer's eye, which is not a fault today

While signed in to one organisation, the service behind the people list and the company list hands back the **other** organisation's records — its administrator, with their address and role. **The screens themselves are fine:** the Staff screen does not show that person, so nothing reaches a user. But the service behind those screens is not filtering by organisation the way the search is. I have not raised anything; I am telling you because you would want to know.

---

## OUTSTANDING — what I need from you

**1. May I read the written requirement? This is the one that unblocks the most.** One read, covering six things: the twenty, the two phone ones, the Tab key — and the closing section of the two reports that are ready to go. Every report we send names the requirement it is measured against, quoted word for word; I will not write that section from our own check text, because that is how a report gets argued away. **If you would rather I did not read it**, tell me what the right behaviour is for the four checks and I will write the two reports without that closing section and say plainly why it is missing. **Cost of leaving it:** four checks sit looking like faults nobody wrote up, and two finished reports cannot be sent.

**2. Go-ahead for the first of the two ready reports** — the one about a job showing green on one screen and orange on the other. One at a time, as always. Both are now fully written, both have their picture, and both are attached to the right piece of work, which I checked today. **Cost of leaving it:** two faults the developers cannot see yet.

**3. The ten checks behind obsolete work.** Do those requirements come back, or do we retire the checks? This is the biggest single block of unfinished work and it is not something I can decide. **Cost of leaving it:** ten checks stay held indefinitely and the list never reaches a clean finish.

**4. One customer and one job inside the second organisation** — by a developer, by an operations tool, or by giving me a way to sign in as it. **Cost of leaving it:** one check stays held. Nothing else depends on it.

None of these block anything else. The work continues on everything that does not need you.

---REFERENCE---

Test run 415 — https://shopview.testrail.io/index.php?/runs/view/415 · QA branch sv9160, build v26.36.7-29ca209 · read live 17 September 2026.

**Failed (17)**

| Case | Section | Jira |
|---|---|---|
| [C44825](https://shopview.testrail.io/index.php?/cases/view/44825) · [in the run](https://shopview.testrail.io/index.php?/tests/view/2723895) | Grouped Results and Counts | [SV-10159](https://shopview.atlassian.net/browse/SV-10159) |
| [C44829](https://shopview.testrail.io/index.php?/cases/view/44829) · [in the run](https://shopview.testrail.io/index.php?/tests/view/2723899) | Grouped Results and Counts | — |
| [C53476](https://shopview.testrail.io/index.php?/cases/view/53476) · [in the run](https://shopview.testrail.io/index.php?/tests/view/2868064) | Grouped Results and Counts | — |
| [C44833](https://shopview.testrail.io/index.php?/cases/view/44833) · [in the run](https://shopview.testrail.io/index.php?/tests/view/2723903) | Per-Entity Result Shape | [SV-10178](https://shopview.atlassian.net/browse/SV-10178) |
| [C44836](https://shopview.testrail.io/index.php?/cases/view/44836) · [in the run](https://shopview.testrail.io/index.php?/tests/view/2723906) | Per-Entity Result Shape | [SV-10163](https://shopview.atlassian.net/browse/SV-10163) |
| [C44838](https://shopview.testrail.io/index.php?/cases/view/44838) · [in the run](https://shopview.testrail.io/index.php?/tests/view/2723908) | Per-Entity Result Shape | — |
| [C44854](https://shopview.testrail.io/index.php?/cases/view/44854) · [in the run](https://shopview.testrail.io/index.php?/tests/view/2723924) | Ranking and Prioritization | — |
| [C45139](https://shopview.testrail.io/index.php?/cases/view/45139) · [in the run](https://shopview.testrail.io/index.php?/tests/view/2728117) | Ranking and Prioritization | [SV-10161](https://shopview.atlassian.net/browse/SV-10161) |
| [C44865](https://shopview.testrail.io/index.php?/cases/view/44865) · [in the run](https://shopview.testrail.io/index.php?/tests/view/2723935) | No-Results State | [SV-10181](https://shopview.atlassian.net/browse/SV-10181) |
| [C45132](https://shopview.testrail.io/index.php?/cases/view/45132) · [in the run](https://shopview.testrail.io/index.php?/tests/view/2728110) | Mobile Global Search (v2) | — |
| [C45136](https://shopview.testrail.io/index.php?/cases/view/45136) · [in the run](https://shopview.testrail.io/index.php?/tests/view/2728114) | Mobile Global Search (v2) | — |
| [C45153](https://shopview.testrail.io/index.php?/cases/view/45153) · [in the run](https://shopview.testrail.io/index.php?/tests/view/2738734) | Global Search V2 - V1 Regression Suite | [SV-10001](https://shopview.atlassian.net/browse/SV-10001) |
| [C53601](https://shopview.testrail.io/index.php?/cases/view/53601) · [in the run](https://shopview.testrail.io/index.php?/tests/view/2959367) | Global Search V2 - V1 Regression Suite | [SV-10001](https://shopview.atlassian.net/browse/SV-10001) |
| [C53605](https://shopview.testrail.io/index.php?/cases/view/53605) · [in the run](https://shopview.testrail.io/index.php?/tests/view/2959371) | Global Search V2 - V1 Regression Suite | [SV-10055](https://shopview.atlassian.net/browse/SV-10055) |
| [C55660](https://shopview.testrail.io/index.php?/cases/view/55660) · [in the run](https://shopview.testrail.io/index.php?/tests/view/2977472) | Global Search V2 - V1 Regression Suite | [SV-10025](https://shopview.atlassian.net/browse/SV-10025), [SV-10060](https://shopview.atlassian.net/browse/SV-10060) |
| [C55673](https://shopview.testrail.io/index.php?/cases/view/55673) · [in the run](https://shopview.testrail.io/index.php?/tests/view/2980695) | Global Search V2 - V1 Regression Suite | [SV-10061](https://shopview.atlassian.net/browse/SV-10061) |
| [C55685](https://shopview.testrail.io/index.php?/cases/view/55685) · [in the run](https://shopview.testrail.io/index.php?/tests/view/2984234) | Global Search V2 - V1 Regression Suite | [SV-10025](https://shopview.atlassian.net/browse/SV-10025) |

**Blocked (14)**

| Case | Section | Jira |
|---|---|---|
| [C44826](https://shopview.testrail.io/index.php?/cases/view/44826) · [in the run](https://shopview.testrail.io/index.php?/tests/view/2723896) | Grouped Results and Counts | [SV-10159](https://shopview.atlassian.net/browse/SV-10159) |
| [C44857](https://shopview.testrail.io/index.php?/cases/view/44857) · [in the run](https://shopview.testrail.io/index.php?/tests/view/2723927) | Recent Activity Default State | — |
| [C44880](https://shopview.testrail.io/index.php?/cases/view/44880) · [in the run](https://shopview.testrail.io/index.php?/tests/view/2723950) | Permissions and Role-Based Scoping | — |
| [C44896](https://shopview.testrail.io/index.php?/cases/view/44896) · [in the run](https://shopview.testrail.io/index.php?/tests/view/2723966) | Page-Search Cutover (v2) | [SV-9306](https://shopview.atlassian.net/browse/SV-9306), [SV-9311](https://shopview.atlassian.net/browse/SV-9311) |
| [C45159](https://shopview.testrail.io/index.php?/cases/view/45159) · [in the run](https://shopview.testrail.io/index.php?/tests/view/2738740) | Global Search V2 - V1 Regression Suite | — |
| [C45160](https://shopview.testrail.io/index.php?/cases/view/45160) · [in the run](https://shopview.testrail.io/index.php?/tests/view/2738741) | Global Search V2 - V1 Regression Suite | [SV-9167](https://shopview.atlassian.net/browse/SV-9167) |
| [C44866](https://shopview.testrail.io/index.php?/cases/view/44866) · [in the run](https://shopview.testrail.io/index.php?/tests/view/2723936) | Quick Actions on Hover (v1) | — |
| [C44867](https://shopview.testrail.io/index.php?/cases/view/44867) · [in the run](https://shopview.testrail.io/index.php?/tests/view/2723937) | Quick Actions on Hover (v1) | — |
| [C44868](https://shopview.testrail.io/index.php?/cases/view/44868) · [in the run](https://shopview.testrail.io/index.php?/tests/view/2723938) | Quick Actions on Hover (v1) | — |
| [C44869](https://shopview.testrail.io/index.php?/cases/view/44869) · [in the run](https://shopview.testrail.io/index.php?/tests/view/2723939) | Quick Actions on Hover (v1) | — |
| [C44870](https://shopview.testrail.io/index.php?/cases/view/44870) · [in the run](https://shopview.testrail.io/index.php?/tests/view/2723940) | Quick Actions on Hover (v1) | — |
| [C44871](https://shopview.testrail.io/index.php?/cases/view/44871) · [in the run](https://shopview.testrail.io/index.php?/tests/view/2723941) | Quick Actions on Hover (v1) | — |
| [C44872](https://shopview.testrail.io/index.php?/cases/view/44872) · [in the run](https://shopview.testrail.io/index.php?/tests/view/2723942) | Quick Actions on Hover (v1) | — |
| [C44873](https://shopview.testrail.io/index.php?/cases/view/44873) · [in the run](https://shopview.testrail.io/index.php?/tests/view/2723943) | Quick Actions on Hover (v1) | — |

**Untested (1)**

| Case | Section | Jira |
|---|---|---|
| [C45140](https://shopview.testrail.io/index.php?/cases/view/45140) · [in the run](https://shopview.testrail.io/index.php?/tests/view/2728118) | Global Search - Out of V1 Scope (not tested this release) | — |

**Stories read live in Jira on 17 September 2026:** SV-9306 OBSOLETE · SV-9311 Board Backlog · SV-9173 OBSOLETE · SV-9169 OBSOLETE · SV-9162 Ready for QA.

**Filed today:** SV-10159 · SV-10161 · SV-10163 · SV-10178 · SV-10181. **Withdrawn:** C44876 (false failure — branch sleep during a 5 s wait).

**Excluded sections:** 6767 (C45140, handoff-excluded, out of V1 scope) · 6769 (66 cases, other lane) · 8056 (1 case, already resulted).

**Prepared, awaiting per-ticket go-ahead:** C44838 (status colour), C44854 (contextual bias). **Awaiting source read:** C53476, C45132, C45136, C44829.