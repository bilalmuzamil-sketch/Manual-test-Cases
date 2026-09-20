# BUILD VERIFICATION → Global Search: same-record permission toggle (7 cases)

**Written 2026-09-20 by the seeding session.** Your job is to prove every precondition and step can
actually be **executed on the build**, finalise the on-screen wording, and re-stamp the build line —
**not** to record pass/fail. That is the run session's lane.

| | |
|---|---|
| **Scope** | **7 cases**, section **6734**: C55731, C55732, C55733, C55734, C55735, C55736, **C55737** |
| **What they all do** | Sign in **with** one access, run a search, see a record. Sign in **without that one access**, run the **same** search, and the **same** record must be gone. Nothing else changes between the two runs |
| **Run** | **R415** — <https://shopview.testrail.io/index.php?/runs/view/415> |
| **Build** | `https://sv9160.qa.shopview.com` — marker **`v26.36.8-d146c39`** |
| **Data** | ✅ Seeded and verified — **20/20 records, 0 field gaps**, every keyword proven to return **its own** record by name |
| **Ready** | **6 of 7.** **C55737 is held** — its second half needs a product decision (§3) |

> **This is one of three build-verification documents for Global Search.** The other two are
> `BUILD-VERIFICATION-Global-Search-Permissions-and-Role-Scoping-12-cases.md` and
> `BUILD-VERIFICATION-Global-Search-Access-Scoping-and-Search-Algorithm-13-cases.md`. No case
> appears in more than one. Together they cover **32** cases.

## 🔴 DO THESE THREE THINGS BEFORE ANYTHING ELSE

```bash
curl -s https://sv9160.qa.shopview.com/ | grep app-version          # has the branch moved?
cd build/global-search/seeding && python3 status.py                 # is the data still there?
cd build/global-search/seeding && python3 verify_toggle.py          # is it still CORRECT?
```

`status.py` is read-only and takes seconds; it names any missing record rather than giving you a
count. `verify_toggle.py` goes further and checks each keyword still returns **its own** record and
has not picked up new noise. **If anything is gone:** `./reseed_everything.sh qa` rebuilds every
universe and re-proves each one.

### 🔴 THE BRANCH SWITCHES ITSELF OFF, AND IT LOOKS EXACTLY LIKE A LOGIN FAILURE

It slept **twice in one session** on 2026-09-19, once minutes after a successful seeding run. Every
call comes back **403 `AccessDenied`** — which is not the API refusing you, it is a redirect to a
parking page. Signing in again will not help, and `quick-login` returns 403 too.

**The two-second test:** make the request **with no cookies at all**. If it fails identically,
credentials cannot be the cause.

```bash
curl -s -o /dev/null -D - https://sv9160api.qa.shopview.com/api/staff/my-workplaces | grep -i '^location:'
# -> sleep.qa.shopview.com  ⇒ the branch is ASLEEP, wake it:
curl -s -X POST https://fz4hhptxi8.execute-api.ca-central-1.amazonaws.com/default/toggleQaEnv \
  -H 'Content-Type: application/json' -d '{"action":"wake","env":"sv9160"}'
```

Takes about a minute and destroys nothing — the seeded data was all still there afterwards. Full
detail: `build/APP-ACTIONS-PLAYBOOK.md` §R.

---

## §1 · THE SIX RUNNABLE CASES — what to type, and who to be

**Every case is TWO runs of the SAME search.** Run the "with access" half first: if the record does
not appear there, stop — the data is the problem, not the build, and a missing record makes the
second half meaningless.

| Case | Type this | Sign in WITH access as | Then WITHOUT access as | What must change |
|---|---|---|---|---|
| **C55731** | `ZZTOGPART` | Admin | `ZZAUTOTEST No Parts View` | Part **`ZZTOGPART Brake Kit`** is in the Parts group, then the whole Parts group is gone |
| **C55732** | `ZZTOGWO` | Admin | `ZZAUTOTEST No Work Orders View` | Work order **`S9160-17699`** is in the Work Orders group, then gone |
| **C55733** | `ZZTOGCUST` | Admin | `ZZAUTOTEST No Customers View` | **Both** customer `ZZTOGCUST Freight` **and its vehicle** appear, then **both** go — one permission gates Customers *and* Assets |
| **C55734** | `ZZTOGPS` | Admin | `ZZAUTOTEST No Part Sales View` | Part sale **`P9160-265`** appears, then goes |
| **C55735** | `ZZTOGVEN` | Admin | `ZZAUTOTEST No Vendor Order View` | **All three** — vendor `ZZTOGVEN Supply`, purchase order **`I9160-1399`**, vendor invoice **`ZZT-INV-TOGGLE-ZZTOGV`** — appear, then **all three** go together |
| **C55736** | `ZZTOGPRICE` | Admin | `ZZAUTOTEST No Financial Data` | Part `ZZTOGPRICE Filter` shows a price of **137.45** on its row, then the **same row is still there** with the price hidden |

🔴 **The number on the row is `137.45`, and that is the one to watch.** The part also carries a
sell price of `305.44`, but the search row shows the **purchase price** — I had written the wrong
figure here until I checked what the row literally renders. If you see `305.44`, the row is showing
a different field than it did on 2026-09-20 and that is worth reporting.

🔴 **C55736 is the one where a disappearing row is the WRONG answer.** Every other case expects the
record to vanish. This one expects the row to stay and only the money to disappear. If the row
vanishes, that is a finding, not a pass.

🔴 **C55735 is all-or-nothing.** Two of the three vanishing is not a pass — the case exists to prove
one permission governs all three together. Check each group by name.

---

## §2 · 🔴 THREE THINGS THAT LOOK LIKE BUGS AND ARE NOT

**Measured on `v26.36.8-d146c39`. Without this section a tester will raise three false defects.**

**1 · `ZZTOGPART` also returns two unrelated brake parts.** The search deliberately matches close
spellings, and `ZZSTOCKPART` (a keyword belonging to a different set of tests) is close enough.
**Harmless:** removing Parts access hides *every* part, so the second half of C55731 still reads
correctly. In the first half, pick our row out by name — `ZZTOGPART Brake Kit`.

**2 · `ZZTOGWO` also returns a customer called "Stock Diesel Services Inc" and its vehicle — and
they STAY after the permission is removed.** This is the one most likely to be called a failure.
Those rows are in the **Customers** and **Assets** groups, which the Work Orders permission does not
govern, so they are *supposed* to remain. C55732 is about the **Work Orders** group only. **Read the
row, not the screen.**

**3 · `ZZTOGVEN` leaves a Parts row on screen after the permission is removed.** The vendor, the
purchase order and the vendor invoice all vanish correctly; the part that the purchase order was
raised for stays, because parts are governed by a different permission. **Correct behaviour, not a
leak.**

The general rule behind all three: **our test keywords are private enough to identify our records,
but the search is deliberately fuzzy, so a keyword can pull in near-spellings.** Always judge by
*"is OUR named record there?"*, never by *"how many rows came back?"*

---

## §3 · 🔴 C55737 IS HELD, AND HERE IS EXACTLY WHY

**C55737 — "A restricted record is not counted in any visible group's count."**

**Half of it is fixed and ready.** Its keyword was `ZZCOUNT`, which matched real catalogue parts
named *"Hi Count®"* — 23 unrelated rows — and this case turns on knowing the **exact** number the
role may see. On the QA lead's go-ahead (2026-09-20) the keyword was changed to **`ZZTALLYQ`**,
**identifier only**: the case was snapshotted first, the replacement was proven to return zero rows
before being proposed, and a read-back diff confirmed exactly one field and one token changed. It
now returns **2 rows ours, 0 foreign**.

**The other half is a product question, not a data gap.** The case needs a role that can see *some*
records of a type and is blocked from **one particular record of that same type**. Every permission
measured on this build is **per type, not per record** — a role sees all customers or none. Nothing
found so far can hide one customer from someone who sees the others.

**What that means for you:** the case's preconditions **cannot be executed on this build**, so mark
it **"not available on build"** (Rule 69) rather than passing or failing it. A PO question has been
drafted and is with the QA lead.

🔴 **Why this matters more than it looks.** The case asserts a **negative** — that a hidden record
is *not* counted. If no record can ever be hidden, the case passes every time while proving nothing.
That is the same false pass that already caught this project on the sound-alike case, where a record
was "correctly not returned" because it had never been findable at all.

---

## §4 · THINGS THAT WILL COST YOU TIME IF YOU DO NOT KNOW THEM

- **🔴 RESET A ROLE TO TEMPLATE BEFORE APPLYING IT** (QA lead, 2026-09-17). Manual testers edit the
  stock roles by hand, so a role's name tells you nothing about what it currently grants. Settings →
  Roles & Permissions → the role → Edit → **Reset To Template** → **Save** → *then* assign. **If
  Reset To Template leaves Save disabled, the role is already default** — that is the "already
  clean" signal, not a broken button. The seven `ZZAUTOTEST …` roles are rebuilt from the template
  by the seeder and do not need it.
- **After changing a role, confirm it took effect for the signed-in user** — re-login if needed —
  before reading any result. A stale session shows the old permissions and gives a clean, wrong
  answer. **On these cases that is the single likeliest way to get a false pass.**
- **🔴 A dropped permission can come back on its own.** The server keeps a `View` permission that
  another permission still depends on: the save answers **success** and reads back with the
  permission **intact**. If a "without access" run behaves exactly like a "with access" run, **read
  the role back** before blaming the search.
- **🔴 `See Financial Data` is a separate toggle**, not an ordinary permission in the list. Removing
  it from the permission list alone does nothing.
- **Part Sales needs TWO things** — `Part Sales: View` **and** `See Financial Data`. A user can lose
  that group by either route, so on C55734 confirm which one you actually changed.
- **Index lag is real but short.** A new record is not findable the instant it is saved. Re-search
  before calling anything absent.
- **A work order is read at `/api/work-orders/view/{id}`, NOT `/api/work-orders/{id}`.** The wrong
  path returns **404**, which reads exactly like "this record is not reachable for you". Always open
  a record you *know* you own through the same path before concluding another is unreachable.
- **Counts cap at 20** in every group, and a scope tab shows at most 20 rows with no pagination.

## §5 · WHAT BUILD VERIFICATION MEANS HERE

From the build take **exactly two things**: the on-screen labels/navigation, and whether the step can
be executed. **Expected Results come from the documents** — PRD 576978945 v1.5 §9, the epic, the PO's
answers. If the build differs, the case **keeps** the documented expectation and becomes a deviation
with the three outcomes named; it is never rewritten to match the build.

Re-stamp the build line on every case you check (*"Last checked against build … on …"*), and mark
anything whose preconditions cannot yet be executed as **not available on build** rather than failed.
**C55737 is exactly that case.**

🔴 **Open the case body — never this document's summary of it.** §1 was built from the case text on
2026-09-20, but a case can be edited after this was written. Where this document and the case
disagree, **the case wins** — and say so, so this gets corrected.

---
## §6 · THE TOKEN-DISCIPLINE CHARTER — EMBEDDED VERBATIM, BINDING FROM YOUR FIRST TURN

**Standing Rule 95 requires every handoff to carry these twelve clauses verbatim; a handoff without
them is non-compliant and must not be issued.** Canonical copy:
`build/skills/TOKEN-DISCIPLINE-CHARTER.md`. Clause 12 is the one to read twice — **the savings come
from HOW the work is executed, never from doing less of it.**

**For THIS pass:** there are only seven cases, so read all seven bodies in one bounded pass rather
than a call each (clause 2). One session, not a subagent per case (clause 4). **Six of the seven are
two sign-ins apiece — plan the role order once and sweep through, rather than re-logging in between
attempts** (clause 1); that single decision is most of the cost of this pass. The seeding verifier
already exists — run `verify_toggle.py` once and read its summary rather than re-deriving what it
proves (clause 8). And **do not poll a long job**: nine wait loops that matched their own command
line and never exited cost this project hours, which is the exact failure clause 5 names.

## THE TWELVE CLAUSES

1. **STRATEGY FIRST (79).** Before ANY task, recall or devise the **cheapest correct plan** — not the
   first plan. For anything large, **declare an INTENDED SPEND** (roughly: tokens, spawns, script runs)
   in your first reply. Then begin. One pass, then exit.

2. **NEVER BULK-READ — SCRIPT IT (88).** No case bodies, CSV exports, API dumps, spec bodies or large
   files go into your context. **Write a script, run it to a file, read a bounded SUMMARY.** Inspect
   with `wc -l` / `head -n 20` / `tail -n 20` / `grep -c` / `grep -n` / bounded `sed -n 'A,Bp'`. **Never
   read CLAUDE.md end-to-end** (it is an index) and **never read
   `build/rules/CLAUDE-FULL-ARCHIVE-2026-08-21.md` or any 100 KB+ artefact whole** — grep it.

3. **THE READING RULE.** The startup reading list is **for startup**. Afterwards, consult **anything the
   task needs** — any rule, skill, project state, spec or ticket — always **targeted and bounded**.
   **Knowledge is never off-limits; only BULK reading is.** Not reading a rule you are about to apply is
   a worse failure than the tokens it would have cost.

4. **SPAWN DISCIPLINE (76 / 88).** An **ORCHESTRATOR** (no file tools) minimises spawns and **batches
   ruthlessly** — every spawn re-loads the whole project context, **observed at 200–380 k tokens each**.
   A **LANE SESSION** (direct tools) **does the work itself** and does **NOT** spawn for anything it can
   do directly. **Never spawn for a trivial check** — piggyback it (clause 7).

5. **NEVER POLL (75).** Long work runs as **ONE detached, idempotent, resumable script** with a
   **checkpoint file**, plus a **committer loop gated on a RUN-FLAG FILE**. **Never `pgrep -f
   <scriptname>`** — it matches itself and the loop never exits. Progress is **SELF-REPORTED IN COMMIT
   MESSAGES**. **Launch and exit**; verify later in one short pass. Polling for status is the single
   most expensive thing a session can do.

6. **BATCH WRITES.** One **scripted run with a per-op log** (operation · C-id · HTTP status ·
   verification result), **never one tool call per case**. The log is the evidence (Rule 50); *"200 OK"*
   alone is non-compliant.

7. **PIGGYBACK CHEAP CHECKS (78).** Fold a cheap verification into the **next substantive task**. Keep a
   **pending-cheap-checks list** and carry it forward. **Never spend a dedicated spawn on one.**

8. **NEVER RE-DO WORK (77 / 80).** Before any verification, VIU or ordered task, **STATE when it was
   last done** (date + build marker / spec version) and **ASK before re-running**. A check within the
   **last 3 builds or 3 source versions still COUNTS**, shown with its date and freshness badge (91).

9. **ANSWER IN TEXT** when a tool call is not needed. A reflexive tool call every turn is a trap: if you
   already know the answer, or the question is about plan/scope/reporting, **just answer**.

10. **THE BUDGET (90).** One shared weekly pool: **main/orchestrator 15 % · each lane 25 % · 10 %
    reserve**, adjustable by the QA lead. **Report cumulative spend WITH every piece of work.** At
    **50 % of your own budget**, compare spend against work completed; if spend is outpacing progress,
    **STOP AND REPORT** — never grind to zero. **Never consume the reserve** without the QA lead's
    say-so.

11. **THE WEEK-START GUARD.** The pool resets weekly and was once **nearly exhausted in ONE DAY**. **No
    lane may spend more than its weekly allocation in the first 48 hours of the week** without explicit
    approval. **A task that will exceed its declared intended spend STOPS and reports** rather than
    continuing.

12. **QUALITY IS NEVER THE THING CUT.** None of clauses 1–11 may be used to justify **sampling instead
    of full coverage (50)**, **inferring instead of observing (12)**, or **skipping a verification gate
    (84, 86)**. **The savings come from HOW the work is executed** — scripts, batching, no polling, no
    re-doing — **never from doing less of it, and never from doing it less rigorously.** If cheap and
    correct conflict, **correct wins and you report the cost.**

---

## THE THIRTY-SECOND SELF-CHECK — run it at session start and before any large task

| Ask | If the answer is wrong |
|---|---|
| Do I have the cheapest correct plan, and have I declared an intended spend? | Stop; plan first (1) |
| Am I about to pull a large file or many records into context? | Script it; read a summary (2) |
| Do I actually need to spawn, or can I do this myself / piggyback it? | Do it yourself (4, 7) |
| Am I about to check on a running job? | Don't — it self-reports in commits (5) |
| Has this verification already been done within 3 builds / 3 source versions? | Say the date and ask (8) |
| What is my cumulative spend, and am I past 50 % of my budget? | Compare against progress; report (10, 11) |
| Is any of this saving tokens by lowering rigour? | Forbidden — revert to the full method (12) |

---


## OUTSTANDING — what I need from you

| # | Item | Who |
|---|---|---|
| 1 | **6 of 7 are ready and nothing blocks them.** Data verified on `v26.36.8-d146c39`: 20/20 records, 0 field gaps, every keyword proven to return its own record by name | — |
| 2 | **C55737 is held** — its preconditions need a role that can see some records of a type but not one specific record, and permissions on this build are per *type*, not per *record*. Mark **"not available on build"**; a PO question is drafted and with the QA lead | you → PO |
| 3 | **Three harmless oddities are written up in §2** — two stray brake parts, a customer that stays on screen after the flip, and a parts row that survives C55735. Read §2 before raising any defect on these three cases | build-verify session |
| 4 | **The branch sleeps.** A `403 AccessDenied` here usually means the environment is switched off, not that your login expired. The two-second test and the wake command are in the header | — |
