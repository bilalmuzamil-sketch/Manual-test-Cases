# HANDOFF → BUILD-VERIFICATION SESSION · 13 new Global Search cases

**Written 2026-09-18 by the seeding session.** Your job is to prove every precondition and step can
actually be **executed on the build**, finalise the on-screen wording, and re-stamp the build line —
**not** to record pass/fail. That is the run session's lane.

| | |
|---|---|
| **Scope** | **13 cases.** Permissions & scoping: **C55718–C55723** (6734, 6726). Search algorithm: **C55724–C55730** (6726, 6725) |
| **Run** | **R415** — <https://shopview.testrail.io/index.php?/runs/view/415> |
| **Build** | `https://sv9160.qa.shopview.com` — marker at seeding **`v26.36.7-069b8c2`** |
| **Data** | ✅ Seeded and verified. `build/global-search/SEED-NOTE-6-NEW-CASES-2026-09-18.md` and `SEED-NOTE-7-ALGORITHM-CASES-2026-09-18.md` carry the per-case detail |

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

## §1 · WHAT TO TYPE, PER CASE

### Permissions (C55718–C55723)

| Case | Sign in as | Type | What the build must show |
|---|---|---|---|
| **C55718** | `ZZAUTOTEST No Work Orders View` | `S2-15430` | The work order is **not pinned** and **not in any group**. A permitted user gets it pinned — check both |
| **C55719** | `ZZAUTOTEST No Customers View` | `(264) 400-0199` | No customer row. The value matches **Northgate Cartage Company** only through its contact — the company name contains neither the phone nor the token |
| **C55720** | `ZZAUTOTEST No Work Orders Or Vendors` | `Fib` | **Four groups vanish** (Work Orders, Vendors, Purchase Orders, Vendor Invoices) — no group, **no count**, no scope tab. Customers, Assets, Parts, Part Sales stay |
| **C55721** | `ZZAUTOTEST No Parts View` | `Altenator` | The part is not returned. Records you *can* see still fuzzy-match |
| **C55722** | Admin | `ZZOPENCOUNT` | `Freight Busy` (5 open jobs) above `Freight Quiet` (1) |
| **C55723** | Admin | `ZZNAMEBONUS` | `ZZNAMEBONUS Cartage` (name match) above `Sterling Brothers Freight` (address match) |

### Algorithm (C55724–C55730)

| Case | Type | What the build must show |
|---|---|---|
| **C55724** | `ZZPREFIX` | Three customers, identical in every other respect: `ZZPREFIX Freight Ltd` → `Bolton ZZPREFIX Services` → `ZZPREFIY Cartage` |
| **C55725** | `Zqwxpol` | Nothing. **Control:** `Aabridge` must return Aabridge Freight first — otherwise the miss proves nothing |
| **C55726** | `ZZACC Jose Martinez` then `ZZACC José Martínez` | Both find the one customer `ZZACC José Martínez` |
| **C55727** | `ZZPUNC OBrien` · `ZZPUNC Smith Jones`, then the punctuated forms | `ZZPUNC O'Brien Haulage` and `ZZPUNC Smith-Jones Motors` |
| **C55728** | **`Olternaytor`** | The **customer** `ZZPHON Alternator Co` returns; the **part** `ZZPHON Alternator Assembly` does **not**. The customer is the control |
| **C55729** | `S2-15430` | The work order pins as the single top row **above** customer `S2-15430 Holdings`, whose name begins with the same text |
| **C55730** | `ZZBROAD`, then `ZZBROAD Target` | 22 parts match; the tab shows **20**; `ZZBROAD Target Widget` is not among them. Narrowing surfaces it |

**The sound-alike was discovered on this build, not guessed** — four candidates tried; all four match
the customer and miss the part. Use **`Olternaytor`**.

---

## §2 · 🔴 TWO CASES ARE EXPECTED TO FAIL, AND THE DATA IS CORRECT

Do **not** spend time re-diagnosing these, and do not treat them as bad seeding.

**C55724 (and the existing C55707) — whole-word outranks prefix.** Both expect
prefix > whole-word > typo. The typo ranks last correctly, but `Bolton ZZPREFIX Services` outranks
`ZZPREFIX Freight Ltd`. **Isolated before reporting:** the three records are identical in address,
telephone, contacts and open work orders, and re-saving the pair in **both** orders gave the **same**
ranking — so it is not the recency tiebreak. Under Rule 57 the Expected stays as the document says;
this is a **three-outcomes deviation**, not an Expected rewrite.

**A deleted record can still be returned by the search.** `ZZPREFOX Cartage` was deleted:
`/api/customers` returned three ZZPREF customers while `/api/search` returned four, **at the same
moment, for over a minute**. If a count looks one too high, **check the list endpoint before touching
any data.**

---

## §3 · THINGS THAT WILL COST YOU TIME IF YOU DO NOT KNOW THEM

- **🔴 RESET A ROLE TO TEMPLATE BEFORE APPLYING IT** (QA lead, 2026-09-17). Manual testers edit the
  stock roles by hand. Settings → Roles & Permissions → the role → Edit → **Reset To Template** →
  **Save** → *then* assign. **If Reset To Template leaves Save disabled, the role is already
  default** — that is the "already clean" signal, not a broken button. The seven `ZZAUTOTEST …` roles
  are rebuilt from the template by the seeder and do not need it.
- **After changing a role, confirm it took effect for the signed-in user** (re-login if needed)
  before reading any result.
- **Index lag is real but short.** A new record is not findable the instant it is saved. Re-search
  before calling anything absent.
- **Something on this branch drives work orders to terminal states.** Five of C55722's were found at
  `Complete`, which cannot be reopened. `apply_ranking_signals.py --confirm` counts what is genuinely
  open and creates the shortfall — run it if C55722 or C55708/09 look wrong.
- **Ranking is config-driven** (`search.yaml`) and can differ per environment. Verify the **ordering
  rule**, never an absolute position or score.
- **Counts cap at 20** in every group, and a scope tab shows at most 20 rows with no pagination.

## §4 · WHAT BUILD VERIFICATION MEANS HERE

From the build take **exactly two things**: the on-screen labels/navigation, and whether the step can
be executed. **Expected Results come from the documents** — PRD 576978945 v1.5, the epic, the PO's
answers. If the build differs, the case **keeps** the documented expectation and becomes a deviation
with the three outcomes named; it is never rewritten to match the build.

Re-stamp the build line on every case you check (*"Last checked against build … on …"*), and mark
anything whose preconditions cannot yet be executed as **not available on build** rather than failed.

🔴 **Open the case body — never this handoff's summary of it.** Writing these notes twice found a
handoff that still asked for a corrected work-order number, and once had me read an extracted literal
without its sentence and attribute it to the wrong field. Where this document and the case disagree,
**the case wins** — and say so, so the document gets fixed.

---

## §5 · THE TOKEN-DISCIPLINE CHARTER — EMBEDDED VERBATIM, BINDING FROM YOUR FIRST TURN

**Standing Rule 95 requires every handoff to carry these twelve clauses verbatim; a handoff without
them is non-compliant and must not be issued.** Canonical copy:
`build/skills/TOKEN-DISCIPLINE-CHARTER.md`. Clause 12 is the one to read twice — **the savings come
from HOW the work is executed, never from doing less of it.**

**For THIS pass:** script the fetch of the 13 case bodies and read them a folder at a time rather
than pulling all of them into context (clause 2). One session, not a subagent per folder (clause 4).
The seeding verifiers already exist — run them once and read the summary rather than re-deriving
what they prove (clause 8). And **do not poll a long job**: I lost hours this week to nine wait loops
that matched their own command line and never exited, which is the exact failure clause 5 names.

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
| 1 | **Nothing blocks you.** All 13 cases have their data, seeded and verified on `v26.36.7-069b8c2` | — |
| 2 | C55724's prefix-vs-whole-word deviation and the stale-index-after-delete behaviour are **candidate findings** — record them as deviations; filing tickets is the run session's lane under its own rules | you → run session |
| 3 | C44880 (an earlier case, not in this 13) still needs a second organisation's session | QA lead |
