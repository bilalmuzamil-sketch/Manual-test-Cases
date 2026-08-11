# Schedule labels-final — findings, 2026-08-11

**12 label corrections pushed and byte-verified. The observation work could not run — the app session
is dead. Release is Thursday and the branch is final.**

---

## F1 · The Rule-54 provenance line was deliberately NOT re-stamped, and this is the judgement call of the pass

**Every one of the 12 still says it was last checked against an OLDER build** — `v3.5-7ec992f on
8/6/2026` on ten of them, `v3.5-d122eef on 8/5/2026` on two — **while the branch is running
`v3.5-65d6500`.** That looks like an omission. It is not.

**Sentence 2 records the build a case was last CHECKED against.** This pass **observed nothing**: the
session returns 401 `sso_required`, and the label evidence it acted on was harvested by an **earlier**
pass. Stamping `v3.5-65d6500` would have asserted a check this pass did not perform — the precise
false claim Rule 54's amendment exists to prevent, and the reason the barred form *"as per the build
tested on…"* was removed from 748 cases last week.

**The honest position, stated so it is not mistaken for an oversight:** the **labels** on these 12 are
now correct for `v3.5-65d6500`, verified against a harvest taken from that exact build (sha256
`9348ca09…`, unmoved across six reads). The **behaviour verdicts** still rest on the older builds, and
say so on themselves. **Those are two different claims and the case text keeps them apart.**

**⚠️ The consequence, and it is worth the QA lead's eye before Thursday: NOT ONE of the 176 Schedule
cases has been checked against the build being released.** Measured across all 176, rather than
estimated: **90 carry `v3.5-7ec992f` · 78 carry `v3.5-d122eef` (a build that no longer exists) · 6
carry `v3.5-af3a6e1` · 2 carry no build stamp at all** (C43588 and C43589, created today and never
observed — which is exactly what Rule 60 requires them to say). **174 stamped, 0 of them
`v3.5-65d6500`.** Under Rule 60 that is the ordinary state of
a branch nobody re-drives daily, not an alarm — layer 1 (labels) and layer 2 (verdicts) are what a
redeploy invalidates. **But "the branch is final" changes what an unchecked verdict means:** a gap on
a final build is a **defect**, not an unfinished feature. **A re-drive is the highest-value thing a
session with a live sign-in could do before release.**

## F2 · The corrections were verified against the build BEFORE they were written, not merely applied

Every one of the 12 was checked against the **1,184 strings harvested from `v3.5-65d6500`** — not
taken on trust from the staged list. **`View Options` 0 hits · `Capacity Bars` 0 · `working hours` 0 ·
`Reassign` 0**, against **`View options`, `Capacity Planning`, `Show Saturday`, `Show Sunday`,
`VIN Number` present and `business hours` 65**. The staged pack was right on all twelve.

## F3 · A wrong quoted example is a worse defect than it looks — C30025

The case told the tester to expect *"Starts before **working hours**"*. **That phrase appears nowhere
in the build.** A tester searching the conflict panel for it finds nothing and has three bad options:
raise a false bug, mark it blocked, or quietly pass a test they could not verify. **The label was
wrong; the assertion was right** — and the assertion is untouched, because the build-VIU pass proved
live that the boundary really is each **technician's own** configured hours (two technicians, two
different quoted times).

## F4 · Replacing a closed list with another closed list would have re-armed the same bomb — C30015

*"and no other actions"* had become false: the modal also offers `Add Note`, `Change colour`,
`Edit estimated hours` and `Open work order … in a new tab`. **The obvious repair — list those six —
would break again the moment a seventh appears.** The case exists to assert the **absence of a
reassignment path**, so the repair says that positively and stops enumerating (Rule 42).
**`Reassign` appears 0 times in the harvest: the case's point is confirmed, not weakened.**

## F5 · Rule 41 earned its keep — a title was asserting labels the body no longer did

The staged pack listed **C30051**'s steps and expected results. The whole-case re-read Rule 41 requires
found its **title** — *"Saturday and Sunday toggles…"* — asserting the same two wrong labels. Left
alone, the case would have shipped with a title contradicting its own corrected steps. **Corrected,
and recorded as an addition rather than folded in silently** (`CHANGES-MADE.md`).

## F6 · Our own verification cried wolf, and that is recorded rather than quietly re-run

A first ad-hoc post-write check reported **6 of 12 failing**. **The check was wrong, not the writes:**
it counted string occurrences across title + steps + expected concatenated, so the three cases whose
*titles* now legitimately contain the new label counted one extra each, and C30025 already contained
*"shop business hours"* in item 3. The authoritative check — every field compared against the intended
payload — returned **336 fields, 0 mismatches**.

**Why it is written down: a verification that produces confident false alarms is itself a defect.**
The next person to see six red lines should know they have been seen before and what caused them.

## F7 · The session failure is a DIFFERENT one from this morning's, and the distinction saves a wasted hour

This morning: **409 `Session has expired.`** — our own `PHPSESSID` invalidated by the QA lead editing
the `admin@shopview.com` staff record, while the shared token lived.
Now: **401 `sso_required`** — **the shared `sv_sso_session` itself is dead.** Ordinary ~24 h
estate-wide expiry; the only cookie file left on disk was minted 2026-08-10 22:44, about 19 hours ago,
and it is the **Reports** set — the Schedule set never existed in this container.

**Practical consequence: there is nothing to diagnose and no workaround to attempt.** A fresh sign-in
is the whole fix. **`quick-login` was not called** — it rotates the shared token and would sign the QA
lead out of his own browser mid-week.

## F8 · Fix the request bridge BEFORE the next harness attempt

The bridge calls **`route.abort()` on any `fetch` exception**, making a genuine failure
**indistinguishable from a request the app never sent**. Both admin pages log 12 × `net::ERR_FAILED`.
**Until that is fixed, every claim about "which requests the page sends" is unreliable — including the
finding that `/api/staff` is never requested**, which is the central clue in the Staff/Roles
diagnosis. It is not the presenting fault, but it is the higher-priority repair. See `HARNESS-FIX.md`.

---

## OUTSTANDING — what is needed from the QA lead

1. **🔴 A fresh sign-in for `sv8685.qa.shopview.com`** (`sv_sso_session`, `PHPSESSID`,
   `cf_clearance`). **The only blocker.** It unblocks: the 22 partly-checked cases, the five dialog
   labels, the two label corrections already visible in your screenshots, and — most valuable before
   Thursday — a re-drive of the 165 cases whose verdicts predate the build being released.
   **Finish any account configuration FIRST, then sign in and send the cookies** — editing a staff
   record invalidates the session immediately, so a set minted before the next edit will be dead on
   arrival.
2. **Run 357 needs 174 → 176** (**C43588**, **C43589** missing). Ayesha Khan's run, now **529** graded
   results including **71 logged by Mudassir Qamar this afternoon**. **STAGED, not executed** — Rule 6.
   **Re-snapshot first** (any earlier baseline is stale) and send the **FULL 176-case union**;
   `update_run` replaces the selection and a partial list destroys tests **and their results**.
3. **Two label corrections owed but not applied** — `Set working hours for this technician` (our cases
   say *"Set custom hours…"*) and **`Add Hours`** with a capital H (ours says *"Add hours"*), both
   visible in your 11 August screenshots. **Not applied because a screenshot is not our live capture**
   and the corrected cases could not honestly carry a `v3.5-65d6500` check stamp.
4. **`Adjust` is not in the shift modal under any wording** (**[C30014](https://shopview.testrail.io/index.php?/cases/view/30014)**)
   — a real open question, not a label fix. **Nothing filed** (Rule 62 creation hold).
5. **A specification defect, for the PO:** §7 calls the cell menu a **left**-click menu while §14.1 and
   §14.2 twice call it **right**-click. **The build is left-click and our case is right.** Documentation
   defect. **Nothing filed** (Rule 62).
6. **🔴 Unrelated to Schedule but outranking it — the repository is PUBLIC and 13 tracked files carry
   live-shaped JWTs**, four of them in `build/schedule/build-viu-2026-08-11/evidence/`. Redaction does
   **not** remove them from git history. **Rotation is the decision that matters.** Untouched by this
   pass; full list in `build/RECOVERY-2026-08-11/STATE.md` §F.
