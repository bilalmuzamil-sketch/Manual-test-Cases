## The 14 held checks — why each one is held

**Eleven of the fourteen are held because the work behind them is not ready to be tested.** In every one of those cases the piece of work has been marked **obsolete** by the team — not "in progress", not "waiting" — so there is nothing coming that these checks could be run against as things stand. I read every status straight from the tracker today, not from any note.

### Held because the work is not ready for testing — 11

| What the check looks at | The work it belongs to | Its status today |
|---|---|---|
| Hovering a work order result offers *Add new line* | Shortcuts on a result line | **Obsolete** |
| Hovering a vehicle offers *New work order*, plus history and invoices | Shortcuts on a result line | **Obsolete** |
| Hovering a customer offers *New work order* and *New contact* | Shortcuts on a result line | **Obsolete** |
| Hovering a part offers only *View part history* | Shortcuts on a result line | **Obsolete** |
| Hovering a vendor offers *Add contact* | Shortcuts on a result line | **Obsolete** |
| A part still offers only *View part history* while a work order is being edited | Shortcuts on a result line | **Obsolete** |
| No hover shortcut ever destroys anything | Shortcuts on a result line | **Obsolete** |
| Every type that has a hover shortcut shows it | Shortcuts on a result line | **Obsolete** |
| Clicking *Show all* switches the search to that type's tab | The tab strip and its counts | **Obsolete** |
| The Work Orders, Parts and Customers page searches are served by the main search | Moving the page searches onto the main search | **Obsolete**, and the check that would confirm it has not been started |
| Selecting a result records a usage event | Recording how search is used | **Obsolete**, and the written requirement puts it outside this release |

**On the last two I did the measuring anyway**, so the decision can be made with facts rather than guesses:

- The Work Orders page search and the main search **behave differently today**. Typing *brake* into the main search brings back twenty work orders; the same word in the Work Orders page's own search says *"No work orders match the search brake."* The same page search finds thirty-two rows for *Buda*, so it works — it simply matches differently.
- The usage-recording one is not a gap at all: the requirement says plainly there is none in this version.

### Held for a reason that has nothing to do with the work being ready — 3

| What the check looks at | Why it is held | What would clear it |
|---|---|---|
| Recent activity grouped under Today, Yesterday, Past week, Past 30 days | Only *Today* can be produced. The product always stamps a visited record as visited **now** — I tried three different ways to date one in the past and it refused all three. The list also only holds twelve, so a day's testing pushes everything older out. | Leave the branch alone for a few days and re-run, or accept *Today* as the part that can be checked. The work behind this one **is** ready for testing — this is purely about the data. |
| Results stay inside the signed-in person's own organisation | The branch had one organisation, so there was nothing to test against. **It now has two** — I created the second through the product's own *Register your organization* page. What is still missing is a customer or a work order **inside** that second organisation, and there is no way from this branch to sign in as it. | One customer and one work order put into the second organisation, by a developer or by an operations tool. Ten minutes after that, this runs. |
| A person with no home branch does not break the search | **That person can no longer sign in at all** — the product refuses to open a session for them. Two people without a home branch were both refused, while one with a branch signed in normally. So there is no way to reach the screen this check is about. | A decision on whether this is still worth checking. If people without a home branch can no longer exist, the check should be retired. |

---

## What I need from you

**1. The eleven.** Those requirements are still written in the specification and still written into our checks, but the work that would build them has been marked obsolete. **Either the work comes back and we re-run these, or the requirement is dropped and we retire the checks.** This is the single biggest block of unfinished work on the list and it is not a decision I can take. Cost of leaving it: eleven checks sit still indefinitely and the run never reaches a clean finish.

**2. One customer and one work order inside the second organisation**, and the tenancy one runs the same day.

**3. Should the no-home-branch check be retired?** If the product no longer lets such a person sign in, the check is asking about something that cannot happen.

Nothing else on this list is waiting on you. The recent-activity one clears itself with time.

---

**One small thing while I have you.** Some of the notes written into these checks earlier today still say *job* where they should say *work order*. Correcting them means posting a fresh note onto each check, which leaves a second entry sitting under it. **Say the word and I will do it**; otherwise I will leave those alone and keep the right word from here on.

---REFERENCE---

Run 415 — https://shopview.testrail.io/index.php?/runs/view/415 · sv9160 · build v26.36.7-29ca209 · statuses read live from Jira 17 September 2026.

| Case | In the run | Section | Owning story | Story status | Block class |
|---|---|---|---|---|---|
| [C44880](https://shopview.testrail.io/index.php?/cases/view/44880) | [test](https://shopview.testrail.io/index.php?/tests/view/2723950) | Permissions and Role-Based Scoping (6734) | [SV-9162](https://shopview.atlassian.net/browse/SV-9162) | **Ready for QA** | environment / data |
| [C45160](https://shopview.testrail.io/index.php?/cases/view/45160) | [test](https://shopview.testrail.io/index.php?/tests/view/2738741) | Global Search V2 - V1 Regression Suite (6769) | [SV-9167](https://shopview.atlassian.net/browse/SV-9167) | **OBSOLETE** | story not ready (Rule 112) |
| [C44826](https://shopview.testrail.io/index.php?/cases/view/44826) | [test](https://shopview.testrail.io/index.php?/tests/view/2723896) | Grouped Results and Counts (6723) | [SV-9169](https://shopview.atlassian.net/browse/SV-9169) | **OBSOLETE** | story not ready (Rule 112) |
| [C44857](https://shopview.testrail.io/index.php?/cases/view/44857) | [test](https://shopview.testrail.io/index.php?/tests/view/2723927) | Recent Activity Default State (6728) | [SV-9172](https://shopview.atlassian.net/browse/SV-9172) | **Ready for QA** | environment / data |
| [C44866](https://shopview.testrail.io/index.php?/cases/view/44866) | [test](https://shopview.testrail.io/index.php?/tests/view/2723936) | Quick Actions on Hover (v1) (6774) | [SV-9173](https://shopview.atlassian.net/browse/SV-9173) | **OBSOLETE** | story not ready (Rule 112) |
| [C44867](https://shopview.testrail.io/index.php?/cases/view/44867) | [test](https://shopview.testrail.io/index.php?/tests/view/2723937) | Quick Actions on Hover (v1) (6774) | [SV-9173](https://shopview.atlassian.net/browse/SV-9173) | **OBSOLETE** | story not ready (Rule 112) |
| [C44868](https://shopview.testrail.io/index.php?/cases/view/44868) | [test](https://shopview.testrail.io/index.php?/tests/view/2723938) | Quick Actions on Hover (v1) (6774) | [SV-9173](https://shopview.atlassian.net/browse/SV-9173) | **OBSOLETE** | story not ready (Rule 112) |
| [C44869](https://shopview.testrail.io/index.php?/cases/view/44869) | [test](https://shopview.testrail.io/index.php?/tests/view/2723939) | Quick Actions on Hover (v1) (6774) | [SV-9173](https://shopview.atlassian.net/browse/SV-9173) | **OBSOLETE** | story not ready (Rule 112) |
| [C44870](https://shopview.testrail.io/index.php?/cases/view/44870) | [test](https://shopview.testrail.io/index.php?/tests/view/2723940) | Quick Actions on Hover (v1) (6774) | [SV-9173](https://shopview.atlassian.net/browse/SV-9173) | **OBSOLETE** | story not ready (Rule 112) |
| [C44871](https://shopview.testrail.io/index.php?/cases/view/44871) | [test](https://shopview.testrail.io/index.php?/tests/view/2723941) | Quick Actions on Hover (v1) (6774) | [SV-9173](https://shopview.atlassian.net/browse/SV-9173) | **OBSOLETE** | story not ready (Rule 112) |
| [C44872](https://shopview.testrail.io/index.php?/cases/view/44872) | [test](https://shopview.testrail.io/index.php?/tests/view/2723942) | Quick Actions on Hover (v1) (6774) | [SV-9173](https://shopview.atlassian.net/browse/SV-9173) | **OBSOLETE** | story not ready (Rule 112) |
| [C44873](https://shopview.testrail.io/index.php?/cases/view/44873) | [test](https://shopview.testrail.io/index.php?/tests/view/2723943) | Quick Actions on Hover (v1) (6774) | [SV-9173](https://shopview.atlassian.net/browse/SV-9173) | **OBSOLETE** | story not ready (Rule 112) |
| [C44896](https://shopview.testrail.io/index.php?/cases/view/44896) | [test](https://shopview.testrail.io/index.php?/tests/view/2723966) | Page-Search Cutover (v2) (6737) | [SV-9306](https://shopview.atlassian.net/browse/SV-9306) | **OBSOLETE** | story not ready (Rule 112) |
| [C45159](https://shopview.testrail.io/index.php?/cases/view/45159) | [test](https://shopview.testrail.io/index.php?/tests/view/2738740) | Global Search V2 - V1 Regression Suite (6769) | — | **no single owning story** | environment / data |

**Also read live:** SV-9311 (Verify Phase 5 — page-search cutover parity) **Board Backlog**; SV-9163 / SV-9165 / SV-9168 **Ready for QA**.

**Tally:** 11 blocked by Rule 112 (owning story OBSOLETE) · 3 blocked by environment or data (C44857, C44880, C45159) — their owning stories are Ready for QA, so Rule 112 is not the reason.

**Related tickets:** C44826 depends on [SV-10159](https://shopview.atlassian.net/browse/SV-10159). C44896 measured in full; evidence in the run comment.

Full table: `build/global-search/run415-execution/reports/BLOCKED-CASES-2026-09-17.md`.