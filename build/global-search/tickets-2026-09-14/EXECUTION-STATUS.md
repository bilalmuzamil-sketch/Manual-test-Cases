# Global Search V2 — run 415 regression execution, status

**Branch:** sv9160 · **Run:** 415 · **Suite section:** 6769 · **Scope:** the **62** regression-flagged
cases in run 415 (reconciled live: 162 tests in the run, 62 flagged, matching the execution plan
exactly in both directions).

**Nothing has been written to TestRail yet.** The instruction was *"before writing anything on
testrail, RUN all the test cases and unblock yourself everywhere."*

---

## What is done

**50 of 62 judged** — 33 pass, 16 held for the Product Owner, **1 failed**. The shape of that is not
optimism: these are V1-regression cases and almost every one says, in its own text, that a capability
lost between versions is recorded **Blocked for a Product Owner ruling**, explicitly *not* Failed and
*not* a defect. Only where the new specification ALSO requires the behaviour is a miss a defect — and
exactly one case is in that position.

**The one real defect, and it is precise.** Searching a vehicle by its year together with anything
else returns nothing: `2019 Freightliner`, `2019 Cascadia` and `Cascadia 2019` all come back empty,
while `2019` alone returns twenty vehicles, `Freightliner` alone returns twenty, and
`Freightliner Cascadia` returns twenty including the seeded one. The year is indexed; combining it
with a second word empties the result, in either order. Six queries turned "a vehicle cannot be found
by its year" into something an engineer can act on.

| | Cases | State |
|---|---|---|
| Query-driven | 41 | Executed with the corrected instrument; judged against the full case text |
| Not query-driven | 9 | Executed with purpose-built probes, each carrying its own control |
| Role-gated | 12 | Route open (impersonating existing holders); the sweep is running |

## A seventh instrument fault, and the worst of them

The script that built the execution plan kept only the **first 420 characters** of each case's Expected
— enough to find the queries it was written to find. I then judged verdicts from that same file.
**Every one of the 62 cases is longer than that**, the longest eightfold, and the tail is exactly where
these cases keep their grading instruction:

> *"If it fails, mark the case BLOCKED … Do NOT mark it Failed and do NOT raise a defect until the
> Product Owner has ruled."*

Two verdicts were already wrong because of it. Both are corrected, the full text is now read live from
the source, and a check flags any verdict that contradicts its own case before results are written.

## Nothing was blocked. Two things were, and both are open now

**The twelve role cases.** They were carried as blocked because the branch's quick sign-in offers only
Admin and Tech. That is a fact about the sign-in panel, not about the branch: it carries **66 staff
across five real roles** (Admin, Technician, Foreman, Sales Representative, Senior Service Advisor),
and any of them can be impersonated — no user created, no role edited, nothing to restore. The recipe
was already in the playbook before this pass started.

**The part sale (C55665, and part of C45153/C45151).** Part sales still cannot be created on this
branch, so there is no part sale to search for. That one is genuinely outstanding.

## The instrument was wrong six times, and that is the main event of this pass

Every one of these produced, or would have produced, a "finding" that is not real. All are fixed, and
recorded in playbook **§GS/§GS.1** and learnings **L0082–L0094**.

1. **The modal remembers its scope tab across close/reopen**, so each case read the previous case's
   filter. `Marlene` read as one row beside a strip counting 16.
2. **The API cross-check fetched a relative path** — the API is on a different host — so it returned
   the app's own HTML and the comparison **failed open**, reporting agreement without comparing.
3. **Rows were filtered by on-screen position**, turning "further down a scrolling list" into
   "missing".
4. **The scoped view was read on a flat 2.5s wait** while counts settle at 4–5s, so a section still
   loading reads empty — which is exactly the failure four Story Defects were filed for. *Checked
   whether it had actually bitten: it had not, in any of the 15 candidates.*
5. **`+` is a space in a web address**, so any query containing one lost its cross-check silently.
6. **The three-widths case checked whether search had opened with no wait at all** — desktop passed by
   winning a race and both narrow widths reported search unreachable, which the case says to treat as
   a real capability loss for technicians on phones.

The recurring shape: **every false reading came from a check that could not run and did not say so.**

## Three "findings" were missing data, not product faults

The records did not carry what the cases search for. Found by reading each record's whole field set
and comparing it against the fixture that declares it:

| Field | Declared | Record held | Cases it made unrunnable |
|---|---|---|---|
| Customer state | Ohio | *(empty)* | C53582 |
| Customer address line 2 | Dock 7B | *(empty)* | C53604 |
| Customer phone | (419) 555-0143 | *(empty)* | C55662 |
| Vendor phone | (614) 555-0188 | *(empty)* | C55663 |
| **Asset model** | **Cascadia** | **1000HS** | C55664, C53605 |

The asset one had been visible all along — it renders as **"2019 Freightliner ????"** in every result
row. All are being repaired and the affected cases re-run.

## What the record DOES carry, so the miss is real

Checked individually, so none of these rests on an assumption: the asset's licence plate, the
customer's postal code and website, the vendor's postal code and state, the catalogue part's number,
and the contact's job title are all present on their records and search does not return them. Several
of those cases instruct that the miss be **held for the Product Owner** rather than treated as a
fault, and that instruction is being followed.

## For the QA lead

- **C55666 was written expecting to fail and now passes** — a part can be found by its number, with
  dashes and without. The fix appears to have shipped.
- **SV-10016** says the part `ZZT-88-4412` is counted but missing from the Parts section. With the
  corrected instrument it **does** appear there today. The data was rebuilt after that recording, so
  this may be different data rather than a fix. Reported, not touched, per instruction.
