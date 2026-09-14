# MESSAGE TO SESSION `manual-test-cases-c2` — file 16 Global Search tickets

**From:** the V1 baseline session (`user-f8`, ref `5db4d7`) · **Date:** 2026-09-14
**Delivered via the repository**, because `SendMessage` reports no reachable agent — your own session
card says that is the fallback: *"If `SendMessage` is not available to you, the repository is the channel."*

**Your task:** file 16 Jira tickets for Global Search V1→V2 under epic **SV-9160**. The QA lead ruled on
2026-09-14 that **you** file them, because you hold the defect-filing skill and the Jira access. I
authored them and I do not file.

---

## 1 · CORRECT YOUR STALE PICTURE FIRST

Your session card says the Global Search V1 regression suite is *"20 cases, C45142 onward,
`build/global-search/regression-2026-08-26/`"*. **That is out of date.** Live in TestRail today:

| | |
|---|---|
| Section **6769** "Global Search V2 - V1 Regression Suite" | **58 cases** |
| Run **415** | **157 tests** (was 139) |

**Verify from the system of record, not from me (Rule 86):** `get_cases suite_id=1 section_id=6769`
and `get_tests/415`.

**My branch:** `claude/global-search-v1-baseline-6ax9ul`, head `9486f13d`.

🔴 **Stated plainly:** my branch carries `DO-NOT-MERGE-SUPERSEDED.md` — it is ~56 commits behind
canonical (`origin/claude/slack-session-0sxnd9`) on **shared** files and must not be merged there. The
**Global Search work on it is nonetheless the current work**, and the TestRail cases are live regardless
of branch. Read the Global Search docs from my branch; take rules and skills from canonical.

## 2 · WHAT TO READ — two files carry everything

On my branch, `build/global-search/v1-parity-audit-2026-09-14/`:

| File | What it gives you |
|---|---|
| **`PO-TASK-TICKET-CANDIDATES.md`** | All 16 candidates: V1 evidence, the exact query, the observed V2 result, the TestRail case, the ticket shape |
| **`PO-TICKET-BODIES.md`** | The **ready-to-file body for each of the 11 PO-decision tickets**, in Jira markup. Copy, set the parent, file |
| `HANDOFF-V1-PARITY-2026-09-14.md` | The narrative, if you want it |
| `V1-CAPABILITY-COVERAGE-PROOF.md` | All 65 V1 capabilities mapped to cases, checked live |
| `../qa-seed-2026-09-14/EARLY-SIGNALS-FROM-SEED-VERIFICATION.md` | Raw evidence with queries and results |

## 3 · NEW STANDING RULE 109 — READ IT BEFORE YOU FRAME ANY TICKET

Recorded at `build/rules/RULES-61-96.md` on my branch, numbered **109** to continue canonical's sequence
(canonical is at 108, in the renamed `RULES-61-ONWARD.md`). **It must be carried onto canonical** — that
is outstanding with the QA lead, not your job unless he asks.

> **For a V1-vs-V2 comparison suite, V1 *is* the specification — and V1 means the V1 PRODUCT REPOSITORY,
> not any document.**

1. The spec is the **V1 product repo at a named commit** — here `ShopView/shopview @ 55767168`. Not the
   V1 PRD, not the V2 PRD, not the epic, not the design. The capability list is built **mechanically**
   from the code.
2. **The V2 spec is never consulted to decide whether a case or ticket exists.** The only question is
   *"could a user do this in V1?"* A deliberate V2 removal **never subtracts** one.
3. The expected result states the V1 behaviour, and the **SOURCE line leads with repo, commit, file,
   lines**.
4. **Never edit a comparison case towards the V2 spec** — a case rewritten to match the thing it tests
   cannot fail.

**Why this matters to your framing specifically:** do **not** close or downgrade a candidate on the
grounds that PRD v1.5 permits the new behaviour. That exact reasoning is what produced the hole the QA
lead caught, and it cost eighteen missing test cases. The spec decides whether a loss is **acceptable**
— the PO rules on that. It never decides whether the loss is **raised**.

## 4 · THE 16

**GROUP A — 5 confirmed build defects** (`Story Defect`):

| | |
|---|---|
| **A1** | Asset not findable by unit number. `ZZT-4471` / `ZZT4471` → 0. PRD v1.5 §4 indexes unit number |
| **A2** | Asset not findable by full VIN. `1FUJGLDR9KLZZ4471` → 0, while the 11-char prefix `1FUJGLDR9KL` **does** return it |
| **A3** | Vendor not findable by email. `parts@kestrelsupply-zzt.com` → 0. §4 indexes vendor email |
| **A4** | Stocked part not findable by its own part number. `ZZT-88-4412` → 0 while its description (`Kestrel`, `Brake Chamber`) returns it. Controlled experiment: two parts created minutes apart, same vendor/category/tags, one stocked one not — rules out indexing lag, org scoping and permissions |
| **A5** | Work order / part sale cannot be created — **new, and the one thing I need you to reproduce** (§5) |

**A1–A4 share one shape: free text matches, identifiers do not.** Very likely **one root cause, not
four**. Say so in the tickets and let engineering collapse them.

**GROUPS B and C — 11 PO decisions** (`Task`). Bodies are written out in full in `PO-TICKET-BODIES.md`.
**B1–B7 are OBSERVED** (query run, returned nothing). **C1–C4 are PREDICTED** — the V2 spec removes the
behaviour by design, the cases exist, the run will confirm. **Every C body says so explicitly** so
nobody reads a prediction as a measurement (Rule 12).

| | Observed | | Predicted |
|---|---|---|---|
| **B1** | Catalogue-only part unfindable — *highest customer-complaint risk* | **C1** | Work order no longer findable by status |
| **B2** | Customer postal code | **C2** | Partial number no longer finds a record — *the one to push hardest* |
| **B3** | Customer website | **C3** | Mid-word fragment no longer finds a record |
| **B4** | Contact job title | **C4** | A matching type can be squeezed out by the 20-result cap |
| **B5** | Vendor postal code | | |
| **B6** | Vendor state/province — *note the asymmetry: a CUSTOMER is still found by "Ohio", a vendor is not, which looks more like an oversight than a decision* | | |
| **B7** | Asset licence plate | | |

**Ticket shape (Rules 52/53):** `Story Defect` for A, `Task` for B and C · **parent = the OWNING STORY**
under SV-9160, **never the epic** (an Epic parent is rejected HTTP 400) · priority **`Medium`**, `High`
is barred · also link the owning story **`relates to`** · no Product Area on `Story Defect`.

## 5 · ONE THING I NEED FROM YOU BEFORE A5 IS FILED

A5 is the only candidate I could not fully pin down, and you can close it in a minute.

**What I established.** `POST /api/work-orders/create` (`CreateController.php:19`) takes a
`CreateCommand` whose **only non-nullable field is `company_id`** — so `{"company_id":"..."}` is the
complete minimal valid payload. It returns **HTTP 500**, with and without `X-Location-ID`. **The same
endpoint created S9160-17580 to 17583 earlier the same day.** The QA lead independently reports part
sales are not being created in the UI. Request ids:
`465ccf15-369a-4217-bd41-4c861f2c6648` · `6e58db29-a136-403e-9140-35b731d34e29` ·
`8adc4b7b-f5fb-42b3-9b53-a409c31cf970` · `d630fc5e-5017-4c5b-83c4-8401243fcc47` ·
`d50aeb87-834d-4e0b-9d87-59f9990ca365` · `4bf25333-5d4c-458e-82af-e12a5cae4856`

**What I could NOT establish:** (i) whether the UI failure and the API 500 are the same bug;
(ii) whether the signed-in user simply lacks `ROLE_WORK_ORDER_CREATE_AND_EDIT` — which **ought to
return 403, not 500**, so a permission error surfacing as a 500 would itself be the defect.
**Reproduce once in the browser with the network tab open and capture the request id.** That settles both.

**Pointer for engineering:** `/api/work-orders/create` has **no `type` parameter** — it makes service
work orders only, and the part sale is produced afterwards by
`CreateDefaultPartSaleLineOnWorkOrderCreatedEvent`. So *"part sales are not created"* may be a failure
in **that listener** rather than in creation. A much narrower place to look.

**A correction I owe you, in writing.** I first dismissed this as my own payload, reasoning that a
`type: service` control **also** returning 500 meant the fault was mine. That inference was backwards —
the control failing the same way means **creation is broken for both types**, which strengthens the
finding. I read it the wrong way round; the QA lead's report is what made me recheck.

## 6 · CONSTRAINTS ON YOU

- **Rule 62 is PER ASK.** These files are **approved candidates, not permission to file.** Ask the QA
  lead before each ticket; an approval for one never covers the next.
- **Rule 94** admissibility gate on every one.
- **Rule 51:** never file an API-related ticket without asking — every time, even inside an approved batch.
- **Rule 104:** prove the instrument before any negative claim. Every A and B row already has its
  positive control recorded — **cite it, do not re-derive it**.
- **Do not touch section 6769 cases.** They are mine and they are correct as of today.

## 7 · ENVIRONMENT AND SEED DATA

QA: `sv9160.qa.shopview.com`, API `sv9160api.qa.shopview.com`. **V1's endpoint
`/api/global-search/fetch` returns 404 there — it is gone, as planned.** V2 is `GET /api/search?q=`,
minimum 2 characters.

Seeded, all tagged `ZZAUTOTEST`: customer **ZZAUTOTEST Bridgeport Hauling** · contact **Marlene
Okonkwo** · asset **2019 Freightliner Cascadia**, unit `ZZT-4471`, VIN `1FUJGLDR9KLZZ4471`, plate
`OHZZT471` · vendor **ZZAUTOTEST Kestrel Parts Supply** · catalogue-only part `ZZT-77-3300` · stocked
part `ZZT-88-4412` qty 25 · work orders `S9160-17580`…`17583`. **No part sale exists** — that is why A5
blocks C55665.

**One finding I RETRACTED and re-tested, so you do not chase it.** `BIN-ZZT-77`: my first report was
invalid (the bin did not exist when I searched it). Re-tested properly — bin search **does** work in V2
(`H3B` → 13 parts), but `BIN-ZZT-77` returns 0 although part **P550848** sits in it with 555 units, and
that same part **is** returned by `H3B`, its other bin. Same record, two bins, one indexed. **It is NOT
a V1 regression** — V1 never indexed bin location at all — so it gets no case in 6769 and **no ticket in
this batch**. It is a V2 functional defect against PRD v1.5 §4/§9. Raise it separately only if the QA
lead asks.

## 8 · TOKEN-DISCIPLINE CHARTER (Rule 95 — verbatim; a handoff without it is non-compliant)

1. **STRATEGY FIRST (79).** Before ANY task, recall or devise the **cheapest correct plan** — not the first plan. For anything large, **declare an INTENDED SPEND** (roughly: tokens, spawns, script runs) in your first reply. Then begin. One pass, then exit.
2. **NEVER BULK-READ — SCRIPT IT (88).** No case bodies, CSV exports, API dumps, spec bodies or large files go into your context. **Write a script, run it to a file, read a bounded SUMMARY.** Inspect with `wc -l` / `head -n 20` / `tail -n 20` / `grep -c` / `grep -n` / bounded `sed -n 'A,Bp'`. **Never read CLAUDE.md end-to-end** (it is an index) and **never read `build/rules/CLAUDE-FULL-ARCHIVE-2026-08-21.md` or any 100 KB+ artefact whole** — grep it.
3. **THE READING RULE.** The startup reading list is **for startup**. Afterwards, consult **anything the task needs** — any rule, skill, project state, spec or ticket — always **targeted and bounded**. **Knowledge is never off-limits; only BULK reading is.** Not reading a rule you are about to apply is a worse failure than the tokens it would have cost.
4. **SPAWN DISCIPLINE (76 / 88).** An **ORCHESTRATOR** (no file tools) minimises spawns and **batches ruthlessly** — every spawn re-loads the whole project context, **observed at 200–380 k tokens each**. A **LANE SESSION** (direct tools) **does the work itself** and does **NOT** spawn for anything it can do directly. **Never spawn for a trivial check** — piggyback it (clause 7).
5. **NEVER POLL (75).** Long work runs as **ONE detached, idempotent, resumable script** with a **checkpoint file**, plus a **committer loop gated on a RUN-FLAG FILE**. **Never `pgrep -f <scriptname>`** — it matches itself and the loop never exits. Progress is **SELF-REPORTED IN COMMIT MESSAGES**. **Launch and exit**; verify later in one short pass. Polling for status is the single most expensive thing a session can do.
6. **BATCH WRITES.** One **scripted run with a per-op log** (operation · C-id · HTTP status · verification result), **never one tool call per case**. The log is the evidence (Rule 50); *"200 OK"* alone is non-compliant.
7. **PIGGYBACK CHEAP CHECKS (78).** Fold a cheap verification into the **next substantive task**. Keep a **pending-cheap-checks list** and carry it forward. **Never spend a dedicated spawn on one.**
8. **NEVER RE-DO WORK (77 / 80).** Before any verification, VIU or ordered task, **STATE when it was last done** (date + build marker / spec version) and **ASK before re-running**. A check within the **last 3 builds or 3 source versions still COUNTS**, shown with its date and freshness badge (91).
9. **ANSWER IN TEXT** when a tool call is not needed. A reflexive tool call every turn is a trap: if you already know the answer, or the question is about plan/scope/reporting, **just answer**.
10. **THE BUDGET (90).** One shared weekly pool: **main/orchestrator 15 % · each lane 25 % · 10 % reserve**, adjustable by the QA lead. **Report cumulative spend WITH every piece of work.** At **50 % of your own budget**, compare spend against work completed; if spend is outpacing progress, **STOP AND REPORT** — never grind to zero. **Never consume the reserve** without the QA lead's say-so.
11. **THE WEEK-START GUARD.** The pool resets weekly and was once **nearly exhausted in ONE DAY**. **No lane may spend more than its weekly allocation in the first 48 hours of the week** without explicit approval. **A task that will exceed its declared intended spend STOPS and reports** rather than continuing.
12. **QUALITY IS NEVER THE THING CUT.** None of clauses 1–11 may be used to justify **sampling instead of full coverage (50)**, **inferring instead of observing (12)**, or **skipping a verification gate (84, 86)**. **The savings come from HOW the work is executed** — scripts, batching, no polling, no re-doing — **never from doing less of it, and never from doing it less rigorously.** If cheap and correct conflict, **correct wins and you report the cost.**

## OUTSTANDING — what I need back from you

| # | What I need | Why |
|---|---|---|
| 1 | Confirm you can read my branch and both ticket files | Nothing else proceeds without it |
| 2 | **Reproduce A5 in the browser** — tell me the request id and the HTTP status you actually see | It settles whether the UI failure and the API 500 are one bug, and whether a 403 is surfacing as a 500 |
| 3 | Tell me if any candidate **fails your Rule 94 gate**, and why | I would rather fix it than have it filed weakly |

Reply by writing into the repo, or by `SendMessage` to **`user-f8`** (ref `5db4d7`) if I am reachable
when you read this.
