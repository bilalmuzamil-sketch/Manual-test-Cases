# HANDOFF → THE SESSION THAT RUNS 6726 · 6725 · 6734 AND POSTS RESULTS TO TESTRAIL

**Written 2026-09-17 by the seeding session.** The ranking and fuzzy data is on `sv9160` and
**proven by search, not merely created**. Read this whole page before you run anything; §0 tells you
what is NOT ready, and running those cases anyway is how a false Failed gets filed.

| | |
|---|---|
| **Suite** | Global Search — Enhancement (Aug 2026), epic **SV-9160** |
| **Run** | **R415** — <https://shopview.testrail.io/index.php?/runs/view/415> |
| **Scope** | **41 cases** — Ranking **6726** (15) · Fuzzy **6725** (14) · Permissions **6734** (12). All ours (`created_by = 3`), no foreign cases in any of the three |
| **Branch** | `https://sv9160.qa.shopview.com` — marker at seeding **`v26.36.7-29ca209`** |
| **🔴 First command** | `curl -s https://sv9160.qa.shopview.com/ \| grep app-version`. **Moved? The branch redeployed and your data may be gone — reseed before concluding anything** (§4) |

## 🛑 DO NOT TOUCH
- **Sections 6769, 6774, 8056**, **C45140**, and **Vladimir Tomovic's cases in section 49** — foreign
  or another lane's. Report, never edit.
- **No TestRail *case* writes.** You are writing **results**, which is a different thing.
- **No Jira tickets.** The creation hold stands; findings go in your report as candidates.

---

## §0 · 🔴 WHAT IS READY AND WHAT IS NOT — read this before you run a single case

| Folder | State | What you can do today |
|---|---|---|
| **Fuzzy 6725** | ✅ **Ready** — all 14 | Run it |
| **Ranking 6726** | ✅ **Ready** — all 15 | Run it. Every pair's differing signal is applied and proven |
| **Permissions 6734** | ✅ **Ready for 11 of 12** | Run them. **C44880 alone is Blocked** — it needs a second organisation that exists but is not yet reachable |

**All 41 cases are runnable except C44880.** Two verifiers prove it, and both passed on this build:
`verify_gsv2.py` (39 checks) and `verify_ranking.py` (10 checks).

**The five ranking signals are applied and verified:**

| Case | Keyword | The signal now in place |
|---|---|---|
| C55708 | `ZZCUSTOPEN` | one customer has an **open work order**, its twin has none |
| C55709 | `ZZASSETLIFT` | the **2019** asset is on an open work order; the newer 2025 is idle |
| C55710 | `ZZVENDORPO` | one vendor has an **open purchase order** (`I9160-1398`), its twin none |
| C55712 | `ZZPARTBUSY` | one part has **recent activity**; stock is identical on both, so activity is the only difference |
| C55716 | `ZZTIEBREAK` | Transport **Two** was re-saved last, so it must win the tie |

**Permissions 6734 — six role fixtures exist**, each read back after creation to prove the
permission actually came off: `ZZAUTOTEST No Work Orders View` · `No Customers View` (hides Customers
**and** Assets — one permission, two groups) · `No Parts View` · `No Part Sales View` ·
`No Vendor Order View` (hides Vendors, Purchase Orders **and** Vendor Invoices) · `No Financial Data`
(groups stay, **prices are masked** — a hidden group here would be the wrong outcome). The stock
**Technician**, **Sales Representative** and **Time Clock User** roles cover the rest.

### 🔴 BEFORE YOU APPLY ANY ROLE TO ANYONE — RESET IT TO TEMPLATE FIRST

**QA lead's standing instruction, 2026-09-17.** Manual testers edit these roles by hand. A role
called "Service Advisor" is not necessarily *the* Service Advisor any more, so a permission case run
against it proves nothing — and worse, it fails in a way that looks like a product defect.

**Every time, in this order:**

1. Open the role — **Settings → Roles & Permissions → the role → Edit**.
2. Click **Reset To Template**.
3. Click **Save**.
4. *Then* assign the role to the user and run the case.

**The diagnostic, which saves you a pointless save:** if clicking **Reset To Template** leaves the
**Save button disabled**, the role was already in its default state and there is nothing to write.
A disabled Save is the "already clean" signal, not a broken button.

**This applies to the stock roles you sign in as** — Technician, Sales Representative, Time Clock
User, Office User, Admin. **The six `ZZAUTOTEST …` fixtures are ours and are rebuilt from the
template by the seeder**, so they do not need it; if one ever looks wrong, re-run the seeder rather
than hand-editing it.

**Checked 2026-09-17:** the live `Office User` role was byte-identical to its template — all 26
permissions, same codes — so the six fixtures cloned from it are clean. The seeder now compares the
two on every run and says which baseline it is standing on.

**C44880 is the one Blocked case.** The second organisation exists — `ZZAUTOTEST Second Org Ltd` —
and is visible from this login, but working inside it needs its own session, which is not available.
**Block it, do not fail it.**

---|---|---|
| C55708 | `ZZCUSTOPEN` | neither customer has an open work order yet |
| C55709 | `ZZASSETLIFT` | neither asset is on an open work order yet |
| C55710 | `ZZVENDORPO` | neither vendor has a purchase order yet |
| C55712 | `ZZPARTBUSY` | neither part has been sold or viewed yet |
| C55716 | `ZZTIEBREAK` | both were last updated by the same seeding run |

🔴 **A ranking case whose two records are genuinely identical cannot pass or fail — it can only
mislead.** Mark these **Blocked — "the comparison records exist but the difference between them has
not been seeded yet"**, and say so plainly in the comment.

**Also not seeded:** **C55714** names purchase order **`S9-25987`**, and that number **does not exist
on this branch** (measured). Treat it as Blocked, not Failed — see §3.

---

## §1 · THE RANKING DATA — one private keyword per case

**The design rule:** each case has its **own distinctive keyword**, carried only by that case's 2–3
records, which differ in **exactly one signal**. That is what makes an ordering assertion readable:
with shared data you cannot tell whether an order is the ranking rule or the estate's noise.

| Case | Type this | You get | The ordering rule under test |
|---|---|---|---|
| C55707 | `ZZPREFIX` | **3 customers** | name *starts with* it > *whole word* mid-name > *typo* (`ZZPREFIXX`) |
| C55708 | `ZZCUSTOPEN` | 2 customers | open work order + recently viewed ranks higher ⚠️ *not yet differentiated* |
| C55709 | `ZZASSETLIFT` | **2 assets** | the 2019 on an open work order must outrank the newer 2025 ⚠️ *not yet* |
| C55710 | `ZZVENDORPO` | 2 vendors | open purchase orders rank higher ⚠️ *not yet* |
| C55712 | `ZZPARTBUSY` | 2 parts | recent activity ranks higher; stock is identical on purpose ⚠️ *not yet* |
| C55716 | `ZZTIEBREAK` | 2 customers | most recently updated wins the tie ⚠️ *not yet* |
| C44852 | `ZZSTOCKPART` | **2 parts** | in stock ranks above out of stock — 🔴 **and the out-of-stock row must STILL APPEAR.** A missing row is a different, reportable behaviour from a low one |
| C45139 | `ZZCONTACTONLY` | **1 customer** | the company name contains neither the keyword nor the phone; the only route in is its contact. Also try the contact's phone **`(264) 400-0199`** |
| C55713 | `ZZFUZZLEN` | **2 customers** | a 2-letter token (`Ab`) and a 5-letter one (`Abcde`). A one-edit query on the short one must **not** drag it in; on the long one it should |

**Run the verifier before you start:** `python3 build/global-search/seeding/verify_ranking.py` —
10 checks, under a minute. It proves each keyword is **private** (no other group answers) and the
counts are right. If it passes, any failure you then see is the product.

## §2 · THE FUZZY DATA — already proven

`python3 build/global-search/seeding/verify_gsv2.py` (39 checks) passed on this build **today**, and
covers C44839–C44849 by identity rather than row count:

`Petersn` → Peterson Hauling · `Abrige` → Aabridge Freight · `frieghtliner` → Freightliner assets ·
`Filbridge` → Fibridge · phone `(264) 328-6723` and `2643286723` · part number `65547` ·
`P2-58` found and **`P2-59` absent** · work order **`S2-15430`** pinned, variants `S215430` /
`S2 15430` / `15430` all returning it, **`S2-15431` absent**, and the record **opens**.

🔴 **`P2-59` is fragile.** Part-sale numbers match across shop prefixes, so any reseed of any suite
can create one and silently break C44849's precondition. **Re-check it immediately before running
that case.**

✅ **C55715 already works** — `Alternator` and the typo `Altenator` both return parts.

## §3 · ✅ C55714 IS CORRECTED — nothing for you to do

The case used to name purchase order **`PO-3241`** and vendor invoice **`S9-25987`**. **Neither
existed on this branch**, so the case would have failed against a product that was working.

Both identifiers are corrected — **the numbers only, every other word byte-identical**, proved by
reading the case back and substituting the new numbers for the old to get the original exactly:

| | Was | Now | Proven |
|---|---|---|---|
| Purchase order | `PO-3241` | **`I9160-1398`** | found and pinned; `I9160-1399` returns nothing; `I-1398` and `I91601398` both normalise to it |
| Vendor invoice | `S9-25987` | **`ZZT-INV-3`** | found and pinned; `ZZT-INV-4` returns nothing |

🔴 **A note on the earlier draft of this handoff:** it said the case named `S9-25987` as its
*purchase order*. It does not — that was the *vendor invoice* example, and the purchase order was
`PO-3241`. I had read an extracted literal without its sentence. That is precisely the mistake the
"read the case body, not a summary" rule exists to prevent, and I made it while writing the rule's
own handoff. **Open the case.**

## §4 · IF THE BRANCH WAS REDEPLOYED

**First ask what is actually there — do not reseed on a hunch:**

```bash
cd build/global-search/seeding && python3 status.py
```

Read-only, a few seconds. It names the build marker, says whether it changed since the last run,
and reports every universe as PRESENT / PARTIAL / GONE with the missing records named. If the
session is not live it stops rather than reporting your data as missing.

**Then, only if something is actually gone:**

```bash
./reseed_everything.sh qa
```

One command rebuilds **all three universes** in dependency order and runs **each one's own verifier**:
the V1-regression records, the Fibridge 39 checks, and the ranking 10. It is safe to run repeatedly —
every step measures first and creates only the difference.

**A reseed is finished when the verifiers pass, never when a seeder prints its count.** Two failures
on this very universe were invisible to the seeder and obvious to the verifier: keywords one edit
apart that fuzzy-matched each other, and catalogue parts that are not searchable without a stock row.

**Two things that will mislead you:** the search **indexes asynchronously**, so a new record is not
findable the instant it is saved — wait and re-search before concluding anything is absent; and the
search service can be down while the rest of the app is fine — if *nothing at all* returns, that is
the service, not your data.

## §5 · HOW TO RECORD A RESULT

1. **Passed / Failed / Blocked — never Skipped, never a guess.** Anything not observed is **Blocked
   with the reason**, and a Blocked case names what would unblock it.
2. **Every result carries the build marker** you read in step one, and the date.
3. **Every Failed or Blocked comment carries a plain "what needs to be done"** a non-technical QA can
   act on. Never a bare status.
4. 🔴 **Open the case body before you run it — never this handoff's summary of it.** Where the two
   disagree, **the case wins**, and say so. This document is a map, not the territory: writing it
   found that the previous handoff still asked for a work-order number that had been corrected.
5. 🔴 **Before calling anything a regression:** is it really the field you think (blank it and search
   again)? Is **our** record in the list — a count is never a verdict? Which build? Then **search
   Jira for an existing ticket before reporting any loss.**
6. **Union-only when syncing the run:** a partial `case_ids` list **deletes** tests and their results.
7. **Report `ours N / live total M`** wherever you quote a case count.

## §6 · WHAT IS STILL OWED — one item

| # | Item | Blocks |
|---|---|---|
| 1 | The **second organisation's session**. `ZZAUTOTEST Second Org Ltd` exists and is visible, but working inside it needs its own sign-in, which the QA lead is supplying. | **C44880 only** |

Everything else the three folders need is seeded, and both verifiers pass on this build.

## §7 · THE TOKEN-DISCIPLINE CHARTER — EMBEDDED VERBATIM, BINDING FROM YOUR FIRST TURN

**Standing Rule 95 requires every handoff to carry these twelve clauses verbatim; a handoff without
them is non-compliant and must not be issued.** Canonical copy:
`build/skills/TOKEN-DISCIPLINE-CHARTER.md`. Clause 12 is the one to read twice — **the savings come
from HOW the work is executed, never from doing less of it.**

**For THIS run specifically:** 41 cases is a lot of reading — **script the case fetch and read a
section at a time** rather than pulling 41 bodies into context (clause 2). **One session, not a
subagent per folder** (clause 4). **Do not poll the reseed** (clause 5) — it prints its own progress.
And the two verifiers already exist, so **do not re-derive what they prove** (clause 8): run them
once, read the summary, start testing.

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
| 1 | Run Fuzzy 6725 and the six ready Ranking cases; **Block** the five undifferentiated ones, C55714, and all of Permissions 6734, each with its reason | you |
| 2 | Re-check `P2-59` returns nothing immediately before C44849 | you |
| 3 | The four items in §6 | the seeding session |
