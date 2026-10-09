# 21 · REFINE TESTS — simplify a suite's Preconditions / Setup / Steps without breaking it

> **🛑 USE ONLY WHEN THE QA LEAD ASKS TO "REFINE THE TESTS" (QA lead, 2026-10-09).** Verbatim: *"Note even though
> this task is outside your lane, save it with a name called something 'Refine tests' so that we can use this again
> for other suites aswell. BUt do not use this by yourself unless I ask you to refine the tests, your primary lane is
> always BUild verification."* This is NOT part of build verification and is never started on this lane's own
> initiative, never offered as a side task, never folded into a build-verify pass.

First used: Dashboard group 12166, 2026-10-09 (`build/dashboard-simplify-2026-10-09/`). The QA lead's original ask:
*"I need the Preconditions and setup and steps to me simplified here while ensuring that the test remains RUNNABLE
for the manual QA tester, we are in a very crucial phase of release and we can not bear a mistake… If a certain
permission is needed just say the user should have the permission to do this and this. And the setup should relate
to the precondition and relate with the precondition's number and just tell the path from where assigning the
permission can be achieved and NOT the full recipe."* Then: *"make sure that you never break the RUNNABILITY of the
test case and your action does not cause the test cases to loose their BUILD verified status and the testers do not
complain that after the changes the tests can not be understood or can not be RUN because of something which is not
correct or true."*

## 1 · The target shape (Preconditions field)

```
Preconditions                         ← numbered list: WHAT MUST BE TRUE (no instructions)
1. You are signed in as <role> (<the permission(s) it needs, in the build's words>).
2. You are in a location (workplace) that <has / lacks …>.
3. <each record the test needs, with the values that matter; examples marked "for example">.
…
Setup                                 ← one line per precondition number that needs work: THE PATH ONLY
- For 1: profile icon (your initials, top right) > Settings > Roles & Permissions > open the role > <permission> on.
- For 2: to change location, click your profile icon > under Change Location: click the orange button > pick it.
- For 3: <menu> > <button> (<the required fields, in the build's labels>) > <save button>.
```

- **Permission example (his):** say *"the user should have the permission to do X"* and give the **path** to assign
  it — not the full recipe. The same applies to every other kind of precondition (settings, locations, staff,
  customers, records): state it, then give the path.
- **Setup keeps what a tester cannot guess** — a required field the screen refuses to save without, a dialog to close
  without paying, "do not send or pay", the number to write down. Short is the goal; **missing a blocker is a failure.**
- **Steps:** one action each, in the build's labels. **NEVER change the number of steps** (split or merge) — the
  tester's notes, run results and any Expected that says "step N" depend on the numbering. A first step that strands
  the tester ("Open the dashboard") becomes a route ("Click Dashboard in the top menu") — same step, same number.
- **Expected Results are not touched** (Rules 57/114) — nor the provenance/Source block, the build stamp, or the
  AUTOMATION marker. The ONE exception: a made-up name that does not exist on the build may be corrected to a real one
  (identifier only, Rule 112) when the QA lead has said so.

## 2 · Wording "already in the case" is NOT evidence it is true (L0056)

The first pass assumed that reusing the case's own wording was safe because the suite was "build-verified". It was
not: the Dashboard suite had been verified on the dashboard and report screens only, and its SETUP wording had never
been seen on any build. Found in one sweep of 88 cases: a location selector "at the top left (ShopHub)" in 21 and "at
the right of the top bar (e.g. QA Testing)" in 34 — both wrong; "Settings > …" with no word that Settings is under the
profile icon (76); "Clockable" where the staff screen says `Time Clock` (11); a location-creation recipe that skipped
seven required fields (18); staff names ("Tom Tech", "Alex Advisor", "Grace Sullivan", …) that exist on no site.

**So, before rewriting:**
1. **Find out which build the testers will run the suite on** — and that you can sign in to it. If you cannot, STOP
   and ask; never fall back to another build that lacks the feature.
2. **List every setup screen, label, menu, setting and name the cases rely on** (script it, Rule 88).
3. **Check what was actually observed for THIS build** (`build/<project>/OBSERVED-UI-LABELS-<env>.md`). Anything the
   cases use that is not there must be **seen on the build** (labels/routes/setup screens only — open, read, close;
   never run the test, never build hard data states — Rule 115 lane limit), or confirmed by the QA lead.
4. **Two cases describing the same control differently ⇒ at least one is wrong.** Settle it before reusing either.
5. **Names:** every person/location/customer a tester must PICK must exist in the list on the build. If the result
   does not depend on who it is, write "any name offered in the list"; if it does, use a real one (or one the setup
   creates).

## 3 · Guards (every write)

- Scope = cases created by us (`created_by == 3`). **Vladimir's (user 1): never.** **A case the manual tester last
  edited: never** (Rules 83/86 — check `updated_by`). **Automated (`custom_atmstatus == 3`): ask first (Rule 71)**,
  and if changed, tell Vlad (Rule 65).
- Snapshot every case before writing (`C<id>-before.json`); the writer re-reads `updated_on` and **skips** anything
  changed since the snapshot. Write only the fields you meant to change.
- **Pilot 3 cases first** and show the QA lead before/after; bulk only after his OK.

## 4 · Gates — baseline BEFORE, same-or-better AFTER

Run on the whole scope before touching anything, keep the outputs, and require no new failure afterwards:
`check_runnable_cases.py --cases …` · `check_tester_runnable.py --cases …` (and `--bodies` on drafts before
writing) · `check_precond_labels.py --cases … --observed <the build's labels file>` · after the write the
**served-page fr-view scan** (`/tmp/cln/served_scan_any.mjs`, env `CIDS`, `OUTF`) — a case is done only when the page
shows `fr-view`. Then confirm live that Expected is byte-identical to the snapshot. Commit after every batch
(path-scoped, secret scan first, Rules 29/82).

## 5 · HTML

Block tags only: `<p><strong>Preconditions</strong></p><ol><li>…</li></ol><p><strong>Setup</strong></p><ul><li>For
N: …</li></ul>`. `&gt;` for `>` in routes, `&amp;` for `&`. Never `<br>`.

## 6 · Report

Plain language (Rule 103, `plain_check.py`), five tables (Rule 98), every case id after `---REFERENCE---`; list
anything held (Automated, tester-edited, unverifiable screen, Expected naming something that does not exist) with
the question and options.
