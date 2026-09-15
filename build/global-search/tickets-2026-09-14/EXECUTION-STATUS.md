# Global Search V2 — run 415 regression execution, status

**Branch:** sv9160 · **Build:** v26.36.4-7869ff2 · **Run:** 415 · **Sections:** 6769 **and 8056** ·
**Scope:** every case in run 415 that declares the V1 standard in its own Expected text — **65**,
counted live from the run, not from a snapshot.

**Updated 15 September 2026.** Superseded the 14 September version, which said 62 and said nothing
had been written to TestRail. Both are now out of date: the run holds 65 regression cases and every
verdict is written into it.

---

## Where it stands

| | Cases |
|---|---|
| Pass | 47 |
| Fail | 16 |
| Held, each waiting on one decision from the QA lead | 2 |
| **Total** | **65** |

The other 99 tests in run 415 are **feature** cases, judged against the V2 specification, and are
deliberately untouched — the QA lead will say when to start them. `which_standard.py` separates the
two by what each case says about itself, never by section.

## The two that are held

| Case | What it is | What would clear it |
|---|---|---|
| C45160 | Choosing a search result records no usage event. Measured and settled — the tracking call is in 17 of the app's components and not in the search one. | Permission to raise one new ticket. The moment it exists this becomes a Failed with its link. |
| C45159 | A person with no home branch cannot be signed in at all, so the case cannot be run. Proved through the blocker gate with all seven proofs. | Either the developers confirm the state can no longer exist (retire the case) or a sign-in is provided for one of the 27 active people who already have no branch. |

## What was found and fixed in the instruments today

* **The suite was 65, not 62.** The count came from `CASES-FULL.json`, a snapshot taken at the start
  of the pass, instead of from the run. Section **8056** was never in scope either. Three cases had
  never been executed: C55684, C55685, C55686 — now all three are.
* **Unchecking a permission does not always remove it.** Turning off *Work orders / View* on the
  Technician role removed three other permissions and left `workOrdersView` in place, swapping the
  technician view mode for the full one. Every stock role on this branch carries `workOrdersView`,
  including Time Clock User with three permissions in total. A user without work-orders access has to
  be **built from scratch** (Create Custom Role → Skip), which is what C45142 and C45143 now use.
* **A dialog can open the moment a checkbox is ticked.** Ticking *Part sales / View* asks
  "Enable See Financial Data? Part Sales requires it" — and while that is up every later click lands
  on the backdrop. Three clicks reported success and the screen showed none of them.
* **A toggle must be named the same way when it is clicked as when it is read**, or the script
  reports "no toggle starting Pick parts" about a toggle it has just printed.
* **Becoming one person and then another measures the FIRST person's session.** A technician may not
  impersonate, so four refusals looked like a rule about branchless people. One switch per run, from a
  fresh administrator session.
* **An empty branch column is not the app's view of a person** — an administrator is offered every
  branch regardless, so administrators must be excluded when looking for someone with none.

## The role built for the permission cases

`ZZAUTOTEST No Work Orders` — a custom role created from scratch, used for C45142 (one permission:
customers), C45143 (part sales + see financial data, as the screen requires both) and C45149. Clayton
Stephens was moved onto it for each check and put back on Technician afterwards, verified from his own
permission list each time. The Technician role itself was restored to its recorded baseline control by
control (`ROLE-BASELINE-Technician.json` vs `ROLE-AFTER-RESTORE-Technician.json`: no differences).

## Evidence

`UNRUN3-RESULTS.json` · `C45153-FINISH.json` · `C45149-RESULTS.json` · `C45159-RESULTS.json` ·
`C45159-ROUTES.json` · `C45159-SWITCH.json` · `C45159-BLOCKER-CLAIM.json` · `C45160-ANALYTICS.json` ·
`C45160-CODE-SCAN.json` · `ROLE-*.json` · screenshots in `unrun3-evidence/` and `roles-evidence/`.
