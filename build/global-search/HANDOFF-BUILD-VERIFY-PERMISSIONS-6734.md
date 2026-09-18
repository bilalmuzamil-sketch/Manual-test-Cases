# HANDOFF → BUILD-VERIFICATION SESSION · Permissions & Role-Based Scoping (6734), 12 cases

**Written 2026-09-18 by the seeding session.** Your job is to prove every precondition and step can
actually be **executed on the build**, finalise the on-screen wording, and re-stamp the build line —
**not** to record pass/fail. That is the run session's lane.

| | |
|---|---|
| **Scope** | **12 cases** in folder **6734 — Permissions & Role-Based Scoping**: C44877, C44878, C44879, **C44880**, C44881, C44882, C55702, C55703, C55704, C55705, C55706, C55717 |
| **Run** | **R415** — <https://shopview.testrail.io/index.php?/runs/view/415> |
| **Build** | `https://sv9160.qa.shopview.com` — marker at verification **`v26.36.7-069b8c2`** |
| **Ready** | **11 of 12.** **C44880 is Blocked** — it needs a second organisation's sign-in, which does not exist yet. Everything else has its fixture, live and checked |

> **This is a companion document, not a replacement.** The six newer permissions/scoping cases
> **C55718–C55723** are build-verified through
> `HANDOFF-BUILD-VERIFY-13-NEW-CASES.md`, together with the seven algorithm cases. Between the two
> documents all **18** permissions cases are covered. Neither supersedes the other.

## 🔴 DO THESE TWO THINGS BEFORE ANYTHING ELSE

```bash
curl -s https://sv9160.qa.shopview.com/ | grep app-version     # has the branch moved?
cd build/global-search/seeding && python3 status.py            # is the data still there?
```

**`status.py` is read-only and takes seconds.** It reports the marker, whether it changed since the
last run, and every universe as PRESENT / PARTIAL / GONE with missing records **named**. If the
session is not live it stops rather than reporting good data as missing.

**If anything is gone:** `./reseed_everything.sh qa` rebuilds every universe and runs each one's own
verifier. Safe to run repeatedly — every step measures first and creates only the difference.

🔴 **A redeploy does not always wipe.** One took 32 of 33 records; the one on 2026-09-18 took none.
Do not assume either way — read the per-universe result.

---

## §0 · 🔴 WHAT I COULD NOT DO THIS PASS, AND WHAT IT MEANS FOR YOU

**TestRail is answering HTTP 401 to every credential pair in `/tmp/testrail/creds.json`** — I tried
all four combinations of the stored user/email against the stored password/key at 2026-09-18, and
all four were rejected. So **I did not re-read the 12 case bodies while writing this**, and the
per-case table in §2 is built from the seeding handoff plus my own live checks — **not** from the
case text.

Under Rule 112 that makes §2 a **summary, and the case body wins wherever they disagree.** Open each
case and read it before you check it; that is your job anyway. Where this document and the case
disagree, follow the case and **tell me**, so the document gets corrected rather than quietly
carried forward.

You will hit the same 401 if you use the API. The credentials need refreshing — it is in OUTSTANDING.

---

## §1 · THE FIXTURES — ALL THIRTEEN ROLES CONFIRMED LIVE

Read off `/api/iam/list-roles` on `v26.36.7-069b8c2`, by name, not by count:

| Role | Origin | Sees | Serves |
|---|---|---|---|
| **Admin** | stock | everything, including financial data | C44877, C55702–C55706 |
| **Technician** | stock | work orders, customers, assets only | C44878, C44881 |
| **Sales Representative** | stock | no parts, no vendor management | C44882 |
| **Time Clock User** | stock | **nothing at all** | C44882 |
| **Office User**, **Foreman** | stock | everything | spare positives |
| **ZZAUTOTEST No Work Orders View** | seeded | all but work orders | C44879, C44882 |
| **ZZAUTOTEST No Customers View** | seeded | all but customers **and assets** | C44882 |
| **ZZAUTOTEST No Parts View** | seeded | all but parts | C44878, C44882 |
| **ZZAUTOTEST No Part Sales View** | seeded | all but part sales | C44882 |
| **ZZAUTOTEST No Vendor Order View** | seeded | all but vendors, POs, vendor invoices | C44882 |
| **ZZAUTOTEST No Financial Data** | seeded | every group, **prices masked** | C44882 |
| **ZZAUTOTEST No Work Orders Or Vendors** | seeded | four groups gone at once | C55720 (other doc) |

**Only seven roles had to be created.** The other six ship with the product — do not seed
replacements for them, and do not edit them.

🔴 **The Time Clock template sees nothing at all, whatever its bundles say.** Do not read its empty
result as a broken fixture.

---

## §2 · WHAT TO CHECK, PER CASE

**Derived, not quoted — see §0. The case body is the authority.**

| Case | Sign in as | The shape the build must show |
|---|---|---|
| **C44877** | Admin | Every group is reachable and prices are visible. The all-permissions baseline the negatives are measured against |
| **C44878** | Technician (or `ZZAUTOTEST No Parts View`) | The **Parts** group is absent — no group, no count, no scope tab. Work orders, customers and assets stay |
| **C44879** | `ZZAUTOTEST No Work Orders View` | The **Work Orders** group is absent, and a work order is **not pinned** even on an exact number. Check the pin separately — it is a different code path from the group |
| **C44880** | 🔴 **BLOCKED** | Tenant isolation: a second organisation holding records with the **same searchable text** must return nothing to this org's user. `ZZAUTOTEST Second Org Ltd` exists but has no usable sign-in. **Mark "not available on build" — do not fake it and do not fail it** |
| **C44881** | Technician | A record **type with zero accessible rows**. Prove the group's empty state, not an error. Distinguish "no permission" from "permitted but empty" — they must not look the same |
| **C44882** | each role in turn | One bundle removed at a time: Part Sales · Customers (takes Assets too) · Vendor & Order Management (takes Vendors, POs, Vendor Invoices) · Financial Data (prices masked, groups stay) · Time Clock (nothing at all). **Six sign-ins, not one** |
| **C55702–C55706** | Admin | The positives — each group present and correct for a fully-permitted user. These are the control for every negative above |
| **C55717** | a user who loses access after viewing | Open a record, then remove that area's bundle, then re-check the recent list — the record must **drop off**. Needs a role edit between two observations, so plan the order before you start |

🔴 **C44882 is six checks wearing one case number.** Budget for it accordingly; it is the single
most expensive case in the folder.

🔴 **"Absent" means absent four ways** — no group, no count, no scope tab, and not pinned. A group
that is merely empty is a different result from a group that is gone, and the cases distinguish them.

---

## §3 · THINGS THAT WILL COST YOU TIME IF YOU DO NOT KNOW THEM

- **🔴 RESET A ROLE TO TEMPLATE BEFORE APPLYING IT** (QA lead, 2026-09-17). Manual testers edit the
  stock roles by hand, so a role's name tells you nothing about what it currently grants. Settings →
  Roles & Permissions → the role → Edit → **Reset To Template** → **Save** → *then* assign. **If
  Reset To Template leaves Save disabled, the role is already default** — that is the "already
  clean" signal, not a broken button. The seven `ZZAUTOTEST …` roles are rebuilt from the template
  by the seeder and do not need it; **the six stock roles do**, and this folder leans on them
  heavily.
- **After changing a role, confirm it took effect for the signed-in user** — re-login if needed —
  before reading any result. A stale session shows the old permissions and produces a clean, wrong
  answer.
- **🔴 A dropped permission can come back on its own.** The server keeps a `View` permission that
  another permission still depends on: the create answers **201**, and reads back with the
  permission **intact**. Removing `customersView` alone did exactly that. The whole family has to
  go — `customersView` + `customersCreateAndEdit` + `customersDelete`. If a negative case behaves
  like a positive, **read the role back** before blaming the search.
- **🔴 `seeFinancialData` is a crossToggle, not an ordinary permission.** Dropping it from the
  permission list alone does nothing; the toggle has to go False too. Same for `seeApArData` and
  `viewHistoryLogs`.
- **Part Sales needs TWO conditions** — `partSalesView` **and** `seeFinancialData`. A user can lose
  the group by either route, which is why two different roles both serve C44882.
- **One permission, three groups:** `vendorOrderManagementView` hides Vendors, Purchase Orders and
  Vendor Invoices together. **One permission, two groups:** `customersView` hides Customers and
  Assets together. Expect the collateral, and check it.
- **Index lag is real but short.** A new record is not findable the instant it is saved. Re-search
  before calling anything absent.
- **Counts cap at 20** in every group, and a scope tab shows at most 20 rows with no pagination.

## §4 · WHAT BUILD VERIFICATION MEANS HERE

From the build take **exactly two things**: the on-screen labels/navigation, and whether the step can
be executed. **Expected Results come from the documents** — PRD 576978945 v1.5, the epic, the PO's
answers. If the build differs, the case **keeps** the documented expectation and becomes a deviation
with the three outcomes named; it is never rewritten to match the build.

Re-stamp the build line on every case you check (*"Last checked against build … on …"*), and mark
anything whose preconditions cannot yet be executed as **not available on build** rather than failed.
**C44880 is exactly that case** — blocked, not failed.

🔴 **Open the case body — never this handoff's summary of it.** §0 says why that matters more than
usual this time. Where this document and the case disagree, **the case wins** — and say so, so the
document gets fixed.

---
## §5 · THE TOKEN-DISCIPLINE CHARTER — EMBEDDED VERBATIM, BINDING FROM YOUR FIRST TURN

**Standing Rule 95 requires every handoff to carry these twelve clauses verbatim; a handoff without
them is non-compliant and must not be issued.** Canonical copy:
`build/skills/TOKEN-DISCIPLINE-CHARTER.md`. Clause 12 is the one to read twice — **the savings come
from HOW the work is executed, never from doing less of it.**

**For THIS pass:** script the fetch of the 12 case bodies and read them in one bounded pass rather
than pulling all of them into context (clause 2) — and note that TestRail is currently 401, so fixing
the credentials is the first thing, not a workaround. One session, not a subagent per case (clause 4).
C44882 is six sign-ins; plan the role order once and do it in a single sweep rather than re-logging in
between attempts (clause 1). The seeding verifiers already exist — run them once and read the summary
rather than re-deriving what they prove (clause 8). And **do not poll a long job**: I lost hours this
week to nine wait loops that matched their own command line and never exited, which is the exact
failure clause 5 names.

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
| 1 | **11 of 12 cases are ready.** Every role fixture is live and confirmed by name on `v26.36.7-069b8c2` — 6 stock, 7 seeded | — |
| 2 | **C44880 is Blocked, and legitimately so.** `ZZAUTOTEST Second Org Ltd` exists but there is no working sign-in inside it. It needs a `PHPSESSID` captured **while signed in to that organisation** — the SSO token is shared, the PHPSESSID is what carries the org. Mark the case "not available on build" until then | QA lead |
| 3 | **TestRail is 401** on every stored credential pair, so I could not re-read the 12 case bodies while writing this (§0). The build-verify session will hit the same wall. Credentials need refreshing | QA lead |
| 4 | The six newer permissions cases **C55718–C55723** are covered by the other handoff, not this one. If you want the 18 in a single document, say so and I will merge them | you |
