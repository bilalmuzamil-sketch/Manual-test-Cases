# Schedule — findings, 2026-08-12

Build `v3.5-65d6500`. Findings only; the numbers are in `COMPLETION-REPORT.md`.

## 1 · A permission change kills the session it is needed for — and it is one-way

The ten blocked permission cases were attacked directly rather than escalated, because Standing Rules
5, 14 and 26 authorise seeding roles. Editing the **role definition** the Technician holds — chosen
precisely because it does not touch a staff record — **invalidated the Technician session anyway**,
and **restoring the permissions did not bring it back.**

**So the change that creates the test user destroys the session you would test with**, and this
estate cannot sign in again: `quick-login` and `switch-user` are barred, and a new staff member needs
invite confirmation.

**The practical consequence is a precise ask replacing a vague one: create the three users, give them
their permissions, and only THEN sign each in and send the cookies.** Configure first, mint second.
Detail and the per-user table: `DIVERGENCES.md` §A.

## 2 · Two API behaviours worth keeping, both found the hard way

**A save that returns 200 and does half the write.** `PUT /api/roles/{id}` with snake_case field
names **applies additions and silently ignores removals**. The screen sends camelCase, and with those
names the same call replaces the set correctly. **The first restore attempt reported success and
changed nothing**, and only a field-by-field read-back caught it. Not raised as a defect — no user can
send snake_case from a screen — but it is exactly the class of thing that costs somebody a day.

**The permission tiers are enforced server-side and cascade upward.** Asking for `Schedule: Delete`
alone came back with `Schedule: Edit` and `Schedule: View` added automatically — the specification's
`Delete ⊇ Edit ⊇ View` tier, observed from the API side. **A good finding, and not a substitute for
observing it in the UI**, which is what the held cases exist to do.

## 3 · A false absence, caught before it was written down

Three separate attempts reported the empty-cell menu as not opening, across two views and three
gestures. **The menu exists.** The `.schedule-lane` elements are 199 px wide — the technician label
column — so every click landed outside the grid. Clicking at 35 %, 55 % and 80 % of the calendar width
opened it every time: **`Create Event`** and **`New Work Order`**, under a header like
`LARRY COLLINS · WED, AUG 12 · 06:45`.

**Five cases would have been wrongly marked as testing a feature that does not exist.** The project's
own standing warning — prove the state a control should appear in before recording it absent — is what
stopped it.

## 4 · What the walk confirmed

Seven cases were carried out step by step and **all seven work as written.** Two assertions were
positively confirmed rather than merely not contradicted: **there is no `Reassign` in the shift
modal** (C30015), and **tooltips do not appear on a fast mouse-over, appear on rest, and dismiss on
leave** (C30037). Two toggles were proven to do what their case says — Capacity Planning took the
capacity bars 1 → 0 → 1, and Events took the event blocks 2 → 0 → 2.

**`Clear all` exists but only once a filter is applied.** Worth knowing before hunting for it, and
worth an automation script knowing before asserting it.

## 5 · One observation deliberately left as an observation

Choosing the `Approved` status filter left the sidebar at **21 cards before and after** (C29944).
That is **not** evidence of a broken filter — the list is overwhelmingly Approved already and renders
a virtualised window. Settling it needs a status the list actually mixes, which is a seeding job.
**Recorded so nobody re-derives it; not a verdict.**

## 6 · A hazard in our own case text

**C30015 step 3 tells a tester to click Delete and cancel.** On a series shift that is safe. On a
**non-series** shift there is no confirmation and the shift is destroyed on the first click — which is
how **two workers destroyed a shift on this branch in two days.** The step is not wrong, and I have
not changed it, because adding a warning is a wording decision on the case's own assertion. **One
sentence would remove the hazard.**

## OUTSTANDING — what I need from you

1. **Three users for the permission cases**, configured before their cookies are minted — unblocks ten
   cases and the whole permission area. **The single highest-value item.**
2. **A fresh Technician sign-in**, if any further Technician-perspective work is wanted.
3. **A ruling on C30061** — align its expected result to the build's scope wording, or leave it.
4. **A ruling on C30015 step 3** — add the one-sentence warning, or leave it.
5. **Permission for a worker to update `build/APP-ACTIONS-PLAYBOOK.md`** with the shift create/delete
   contract. It has now cost two shifts in two days because it lives only in incident reports.
6. **Worker time on the remaining ~141 cases** — the method works and is cheap; nothing blocks it.

## 7 · Batch 2, and the three results I refused to bank

Twelve more cases were driven step by step and the structural claims all hold: the nav lands on a
sidebar-plus-grid; Day / Week / Month change the range label to `Wed, Aug 12` / `Aug 10 – 16, 2026` /
`August 2026`; lanes are grouped under department headers; the mini calendar moves the grid and folds
away; the sidebar has no tabs; a card's left border really is a 4 px status colour; and typing filters
the list live, **21 → 5 → 1**, without pressing Enter.

**Three results were NOT banked, and one of them is the most interesting thing in this pass.**

**C43554 would have been an attractive false positive.** `Day` carried `aria-pressed="true"` on
arrival — exactly what the case asserts, and it would have read as
[SV-8863](https://shopview.atlassian.net/browse/SV-8863) being fixed. **But an earlier probe in the
same session had already switched the view to Day**, and the view may be remembered per user. **A
result that flatters us is the one to check hardest.** It needs a session that has never touched the
view control.

**C29931** (no `Unassigned` lane visible) and **C29942** (no active-filter badge) are both
**inconclusive rather than negative** — the first because I never established that an unassigned shift
existed in view, the second because my click landed on a container rather than an option. Both are one
probe away, and seeding is now cheap.

## 8 · Two substantive divergences, found by driving rather than reading

**Neither case was rewritten, and neither ticket was filed** — the creation hold is active, so both
are written up ready to file in `DIVERGENCES.md` §E.

**The sidebar filter panel has no Priority group** — its entire text is `FILTERS · Clear all ·
Unassigned · Assigned · Approved · Declined · In Progress · Ready for Review`, with **no `High` /
`Medium` / `Low` and no group headings**, against `SV-8687 (§5.1)`. **C29945 cannot be run as
written** — its step 2 tells the tester to choose `High` under Priority, and there is nothing to
choose.

**No Unassigned lane exists in the grid**, against `SV-8686 (§3.2, §4.2)` — all 30 lane labels read,
none matches, and the word does not occur in the grid at all. **The precondition was proven first**:
the board holds 8 shifts with no technician across June–November and **three of them fall inside the
week on screen**. So the shifts exist, they are in view, and no lane holds them.

**And a warning about my own first attempt at that one:** it reported the same absence after checking
only the **first 22 of 30** lane labels. **It would have been a right answer resting on a broken
check**, which is worth as much of a warning as a wrong answer would be.
