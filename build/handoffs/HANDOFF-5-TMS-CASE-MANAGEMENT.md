# HANDOFF 5 — CASE MANAGEMENT IN SHOPVIEW TMS (everything we used to do in TestRail)

> **Paste this whole file into a fresh session.** Written 2026-10-26. It puts the session in the lane
> that **creates, reads, updates and deletes test cases, sections and sub-sections in Shopview TMS**
> (https://tms.shopview.com). Until now that work was done in TestRail. Lanes 1–4 still decide *what* a
> case says. This lane covers *where it is written and how*.

---

## §0 · WHY THIS EXISTS, AND THE STATE IT IS HANDED OVER IN

**The instruction (2026-10-26, verbatim):** *"the test cases and everything which we were pushing to
Testrail now needs to e pushed to this TMS. … all that we used to do in testrail now eeds to be done in TMS."*

| Item | State on 2026-10-26 |
|---|---|
| TMS API reference | ✅ Found and snapshotted: `GET https://tms.shopview.com/api/v1/docs` → `build/tms/tms-openapi-2026-10-26.json` |
| Fact sheet (TestRail → TMS operations and fields, ids, links, open questions) | ✅ `build/tms/TMS-FACTS.md` — **every fact is tagged [API-DOC] / [LIVE] / [UI-CODE] / UNVERIFIED** |
| Client | ✅ `build/testing-tools/tms_client.py`, tested **offline only** (payload guard, tree walk, 401 handling) |
| Key resolver | ✅ `build/testing-tools/load_creds.py` → `tms_key()` / `tms_host()` |
| **API key** | ❌ **None exists in any session yet.** A person signed in with Google must issue one (§3 step 0) |
| Signed-in read or write | ❌ **Never done.** Every case and section field name is UNVERIFIED until the §3 gate passes |
| Rule book | ✅ **Rule 115 (2026-10-27)** extends every TestRail protection to TMS. See §1 |

---

## §1 · 🔴 RULE 115 — TESTRAIL AND TMS ARE BOTH PRODUCTION SYSTEMS (ruled 2026-10-27)

**Resolved 2026-10-27.** The QA lead approved **Rule 115** (end of `build/rules/RULES-61-96.md` — **read it
in full before any TMS work**). It is an **overlay**: no rule was rewritten; every protection that covers
TestRail now covers TMS too. Rule 115 also settles four things the table below does not:
**syncs run only when he asks** · **a case in only one system is brought to him** (keep / edit / delete) ·
**results a session records itself stay Passed-only, results a sync copies mirror the human tester** ·
**never change TMS "Test layer" / "Deferred"**. Where this table and Rule 115 differ, **Rule 115 wins**.
The table shows how each TestRail rule applies in TMS:

| Rule | What it said about TestRail | How this lane applies it in TMS |
|---|---|---|
| **6** | TestRail is the only real production system: no write without explicit permission | **TMS is the production system.** No create / update / delete / run / result write without the QA lead's explicit go-ahead. Staging, QA and other test accounts stay disposable |
| **8** | Pair every internal id with its C-id and TestRail link | Pair it with its C-id and **`https://tms.shopview.com/cases/<id>`**. Imported cases keep their TestRail numbers ([API-DOC]) |
| **29** | Commit and push after every step | Unchanged |
| **34 / 47** | Keep runs 352 / 357 / 359 complete; union-only `case_ids` | **Hold run writes** until the QA lead says whether the runs move (FACTS §5 Q4). TMS adds run items additively; the TestRail "partial list deletes" trap does not apply there |
| **38** | Foreign cases are hands-off (found by `created_by = 3`) | Still hands-off. **How to tell ours from foreign in TMS is a QA-lead question** (FACTS §5 Q7). Until it is answered, treat every case **not in our own id-maps** as foreign |
| **41 / 50** | Re-verify the whole case; keep a per-case audit log | Unchanged. `TMS_OP_LOG=<file>` writes one JSON line per operation (op · id · HTTP status · verification). "200 OK" alone is non-compliant |
| **65 / 71** | `custom_atmstatus = 3` means Automated: hands off, tell Vlad | **`automation_status = 3`, the same values.** Same protection. `case_payload()` refuses 3 |
| **82** | Secrets in `/tmp`, `chmod 600`, never committed | The TMS key is a secret. Same treatment |
| **87** | Snapshot case bodies so a foreign edit is diffable | Still snapshot. TMS also keeps every version server-side (`GET /cases/{id}/versions`) |
| **113 / 57** | Expected Result quotes the source verbatim | **Unchanged. TMS changes where a case is stored, not what it says.** |

**Never take a rule from another session's copy (Rule 114).** If a rule is not in the table, apply it
with "TestRail" read as "TMS", and **ask** wherever that reading is not obvious.

---

## §1a · "I CANNOT DO THIS IN TMS YET" IS NOT "BLOCKED" — IN THIS LANE, MOST OF IT CHANGES SHAPE

| What you actually hit | The outcome already defined for it |
|---|---|
| **No API key** | This is the one real gate on **writes**. **Prove it** (run `tms_key()`; it reports all three places it looked), then report it once and say exactly what is needed. **Everything that needs no key still proceeds:** preparing payloads, mapping sections, `TMS_DRY_RUN=1` runs, checking id-maps |
| **A field or body shape marked UNVERIFIED** | Not a blocker. **Confirm it on one `ZZAUTOTEST` case** (§3 step 2), then update `TMS-FACTS.md` in the same pass |
| **The source behind a case is ambiguous** | **Rule 58** — hold the case and ask. Moving to TMS does not change this |
| **A case or section you expected is not in TMS** | First check that you are in the right project and that it is not soft-deleted. Then check whether the estate was imported (FACTS §5 Q2). It is a **finding to report**, not something to recreate on your own |
| **A 409 / 422** | Read the problem+json `detail`. It names the cause. Fix the request. It is not an outage |
| **429 / 503** | Documented rate limit / busy database. The client retries using `Retry-After`. Not a blocker |
| **It is your own unfinished work** | Say so plainly — **"MINE"** |

**Blocked is what is left over, and it is never the default.** Then **Rule 68**: split the work and name
exactly what is blocked. Fuller treatment: `build/skills/03-RUN-CHECK.md` §8.0-a.

---

## §2 · READING LIST — STARTUP ONLY, BOUNDED

1. `CLAUDE.md` (the index — it loads whole by design) → §1 critical core.
2. **`build/tms/TMS-FACTS.md` — in full.** It is short, and it is this lane's playbook.
3. `build/skills/TOKEN-DISCIPLINE-CHARTER.md` (also embedded below).
4. `build/skills/00-COMMON-CORE.md` — grep the parts about TestRail mechanics and the honesty bar. Do not read it whole.
5. The rule text, **in its file**, for every rule in the §1 table before you apply it.
6. `build/APP-ACTIONS-PLAYBOOK.md` §J (TestRail traps), **grepped**. Most traps do not carry over
   (paging, `&` versus `?`, the `custom_` prefix). Read it to know which old habits to drop.
7. The project's own `build/<project>/PROJECT-STATE.md` and `testrail-id-map.csv` for whatever project
   the QA lead gives you (Rule 92 — work only on the project you are given).

**Do not read** `tms-openapi-2026-10-26.json` into context (44 KB). Query it with a script, or read the
endpoint list in FACTS §2.

---

## §3 · THE FIRST-RUN GATE — DO THESE IN ORDER, ONCE, BEFORE ANY REAL WORK

**Step 0 — the key (needs a person).** Someone signed in to TMS with Google opens **Settings → API keys →
New API key**, names it (e.g. *"QA case management – Claude"*), and copies it. The key is shown only once.
They give it to the session, which stores it **only** like this:
```bash
mkdir -p /tmp/tms && umask 077 && printf '{"api_key":"%s"}' "<KEY>" > /tmp/tms/creds.json && chmod 600 /tmp/tms/creds.json
```
(Or set `TMS_API_KEY` in the environment settings so it survives restarts.) **Never echo it, log it or commit it.**

**Step 1 — read-only checks (no permission needed; reads change nothing):**
```bash
cd build/testing-tools
python3 tms_client.py whoami            # whose name will our writes carry?
python3 tms_client.py projects          # which project is ours?
python3 tms_client.py tree <project_id> > /tmp/tms/tree.txt; wc -l /tmp/tms/tree.txt; head -40 /tmp/tms/tree.txt
python3 tms_client.py case <a C-id from the project's testrail-id-map.csv, without the C>
```
**Pass when:** whoami answers · our project is identified · the section tree contains our project's
group · a known C-id opens with **the same title as in our id-map**. That last check confirms the import
kept TestRail ids. Compare a **specific record** (Rule 110), never a count.
Record the results, with the date, in `TMS-FACTS.md` (turn each UNVERIFIED you confirmed into [LIVE]).

**Step 2 — one write round-trip (needs the QA lead's explicit permission — Rule 6 as applied in §1):**
create a **`ZZAUTOTEST`** section, then the smoke case inside it, read it back, edit it, list its
versions, delete it, then delete the section:
```bash
TMS_OP_LOG=/tmp/tms/smoke-ops.jsonl python3 tms_client.py smoke <ZZAUTOTEST section id>
```
**Pass when:** every field sent reads back unchanged (`verify mismatches: []`) · the edit created a new
version · the delete returned 204. **Watch for silent rewriting:** TestRail rewrote some text on save
(playbook §J, normalisation #3a). Check whether TMS does too, and record what you find. Then update
`TMS-FACTS.md` §3 and §2 (mark each field [LIVE] or correct it) and commit.

**Only after steps 1 and 2 pass does real case work start.**

---

## §4 · DOING THE WORK — THE TESTRAIL HABITS, TRANSLATED

| Task | How (client method → endpoint) | Discipline that still applies |
|---|---|---|
| New folder / sub-folder | `create_section(project_id, name, parent_id)` | Find the parent in `tree` first. Never create a duplicate name under the same parent |
| Rename / describe a folder | `update_section(id, name=…, description=…)` | — |
| Move a folder | `POST /sections/{id}/move` (body UNVERIFIED — confirm on a ZZAUTOTEST section first) | Moves its whole subtree |
| Delete a folder | `delete_section(id, cascade=True)` | **Look at what is inside first.** Cascade takes the live cases with it. Our own folders only |
| New case | `create_case(section_id, case_payload(...))` | Expected Result = **the source's words verbatim** (113). Provenance line (54). Exactly one AUTOMATION marker (61) at the end of `expected`. `automation_status` 1 |
| Edit a case | `update_case(id, {only the fields you change})` then `verify_case` | Rule 41: re-verify the **whole** case. A real change creates a new version |
| Delete a case | `delete_case(id)` (soft; `restore` exists) | Ours only (38). Never one that is Automated (71) |
| Move / copy a case | `move_case` / `copy_case` | — |
| Many cases | **one script**, one per-op log line each (charter clause 6). `POST /cases/bulk` (≤ 1,000, all-or-nothing) only once its body has been confirmed | Never one tool call per case |
| Map files | Keep `testrail-id-map.csv` (do not rename it — other tools read it). Add a `tms_url` column. Record TMS ids for **new** cases | Rule 8 |

**Old TestRail habits that do NOT carry over:** paging `get_sections` (TMS has an unpaginated tree) ·
the `&limit=&offset=` URL form · the `custom_` prefix · `get_case_fields` · the
"partial `case_ids` deletes tests" fear. **Habits that DO carry over:** permission before writes · the
per-op log · read back after every write · never touch foreign or Automated cases · secrets in `/tmp`.

---

## §5 · DONE MEANS

- Every write in the pass has a per-op log line with its HTTP status **and** a read-back result.
- `TMS-FACTS.md` has been updated with anything newly confirmed or corrected, dated.
- The id-map carries the TMS link for every case touched.
- `python3 build/testing-tools/scan_secrets.py --staged` exits 0. Then path-scoped `git add -- <paths>`,
  commit, push (Rule 29).
- The report ends with **OUTSTANDING — what I need from you** (Rule 36).

---

## TOKEN DISCIPLINE CHARTER (mandatory — Rule 95)

Canonical: [`../skills/TOKEN-DISCIPLINE-CHARTER.md`](../skills/TOKEN-DISCIPLINE-CHARTER.md). Reproduced verbatim:

### THE TWELVE CLAUSES

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

## SEARCH BEFORE YOU GIVE UP

Before you report anything as impossible, blocked or unavailable, search the workspace for the **exact
error text** and the endpoint or symptom:
`grep -rn "<exact error string>" build/ --include=*.md` · `grep -rn "<endpoint>" build/tms/ build/APP-ACTIONS-PLAYBOOK.md build/skills/` ·
`ls build/BLOCKED-*.md` · `git log --oneline --grep="<keyword>"`. For TMS, the **API document answers most
questions**: `python3 -c "import json;d=json.load(open('build/tms/tms-openapi-2026-10-26.json'));print([p for p in d['paths'] if '<word>' in p])"`.
If the answer is genuinely not there, report the searches you ran. **When you solve something, write it
into `build/tms/TMS-FACTS.md` in the same pass.**

---

## OUTSTANDING AT HANDOFF — what the QA lead must answer (from `TMS-FACTS.md` §5)

1. **An API key** (§3 step 0), and whose name our writes should carry.
2. **Permission for the §3 step 2 smoke write**, a `ZZAUTOTEST` section and case that is deleted afterwards.
3. Has the TestRail estate been imported, and which TMS project is ours?
4. Is TestRail now read-only or retired? Do we write to TMS only?
5. Do runs 352 / 357 / 359 move to TMS?
6. Values for the new fields `test_layer` and `is_deferred` on our manual cases.
7. Are the TestRail-only custom fields (`custom_status`, `custom_mission`, `custom_goals`, AI fields) needed?
8. How do we tell our cases from foreign ones in TMS?
9. ~~The rule-book amendment~~ — **settled 2026-10-27 by Rule 115.**
