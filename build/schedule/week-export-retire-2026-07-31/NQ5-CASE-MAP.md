# NQ-5 (the question Branko did NOT answer) — does it have a test case, and is it in a run?

**Date:** 2026-07-31 · **Read-only pass** (no TestRail writes, no case edits).
**Project:** Schedule (epic SV-8685) · TestRail project 1 / suite 1 / group 4254 / run **357**.

---

## 1. Which question this is

On the unsent TechPlan question sheet
(`build/schedule/tech-plan-2026-07-29/Questions-for-Branko-dev.md`) this is **NQ-5**:

> ## Question NQ-5 — May a technician change other technicians' shifts?
> **The question:** Should a technician-type user (with the "own data only" setting) be able to
> change only their OWN shifts, while seeing everyone's?
> A) Yes — such users can change only their own shifts (as the build plan says). We will then add a
> test for it. · B) No — anyone who can edit the schedule can change anyone's shifts. · C) Something
> else.

Branko's reply on this one was **"I'm not sure if this question is for me Bilal"** — i.e. declined,
now being **re-routed to engineering**. (It is the same item tracked as **C8 "Own-data write
scoping"** in `build/schedule/tech-plan-2026-07-29/TECH-PLAN-DELTAS.md`.)

**Subject in one line:** the engineering plan's `ManageShiftVoter` enforces **own-data scoping on
WRITES** for `isRestrictedToOwnData()` technician-template users (cross-tech write → **403**); the
product spec **§14 is silent on write scoping**.

---

## 2. Answer: **NO test case exists for this question.**

Both source docs say so explicitly, and they agree:

| Source | Verbatim |
|---|---|
| `Questions-for-Branko-dev.md`, QA Internal Mapping, NQ-5 row | "SCH-PERM-09 (C30082, /cases/view/30082) **context**; **a new negative case would be authored only on answer A**" |
| `TECH-PLAN-DELTAS.md`, C8 row | "SCH-PERM-09 (C30082) context; **no case asserts the 403**" … "Question NQ-5 (dev/PO confirm before authoring a negative case); **NOT authored.**" |

The own-data write-negative was deliberately **held un-authored** pending the answer — answer **A**
would have triggered authoring it (UI + API halves), answer **B** means no case is needed. Because
Branko declined, it is still un-authored.

Independent confirmation: a scan of **all** active case bodies in `build/schedule/cases/*.json` for
own-data / own-only / own-shifts language returns **exactly one** case — SCH-PERM-09 — and that one
is about viewing, not writing.

---

## 3. The one ADJACENT case (context only — it does NOT answer NQ-5)

| Internal ID | C-id | TestRail link | In run 357? |
|---|---|---|---|
| **SCH-PERM-09** | **C30082** | https://shopview.testrail.io/index.php?/cases/view/30082 | **YES** — test id 1845538, status **Untested** |

- **What it asserts (plain):** a low-tier Schedule: View user (e.g. Technician / Time Clock) **sees
  ALL** technicians' shifts and events — there is no role-based "own shifts only" restriction — and
  "My Shifts" in "Filter and Display" is only an optional personal convenience filter (off by
  default), not a security boundary.
- **Live state:** exists, `is_deleted 0`, section **4279** (Permissions), refs `SV-8685 (§14.3)`,
  `viu_status` VIU-Pending.
- **Exactly how it is adjacent, and why it is not an answer:** it covers the **READ/VIEW** half of
  own-data scoping only. NQ-5 is about the **WRITE** half — whether such a user may *create or
  change* another technician's shift, and whether the attempt is refused with a 403. SCH-PERM-09
  makes **no** assertion about creating, editing, moving or deleting another technician's shift, so
  it can neither pass nor fail on NQ-5's behaviour. There is **no contradiction** between the two
  (one is view, one is write) — but there is a genuine **coverage gap** on the write side.

**Run link (SCH-PERM-09 is in it):** https://shopview.testrail.io/index.php?/runs/view/357

---

## 4. What this means / what needs to be done (plain)

1. **The question is still open** — it needs an **engineering** answer (not Branko's), because it is
   a build-behaviour question: does the back end actually refuse a cross-technician shift write with
   a 403 for "own data only" users?
2. **If engineering says yes (A):** author the own-data write-negative case — a UI half (the user
   cannot save a change to someone else's shift) and an API half (cross-tech write → 403, which per
   Rule 4 belongs in an API-titled section). Then add it to run 357.
3. **If engineering says no (B):** no new case is needed; just confirm at VIU that no unexpected 403
   appears when an editor changes another technician's shift.
4. Either way, **SCH-PERM-09 (C30082) stands unchanged** — it is correct as written for the view
   side, and it is already in run 357 awaiting execution.

**Honesty note (Rule 12):** the live checks above (C30082 exists / is in run 357 / its status) were
made this run via the TestRail API. Nothing about the *build's* actual 403 behaviour was observed —
that is precisely what is unverified and what the question is for.
