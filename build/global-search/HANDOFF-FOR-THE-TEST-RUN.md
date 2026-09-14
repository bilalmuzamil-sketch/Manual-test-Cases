# HANDOFF — Global Search V2: run the regression suite, then raise the findings

**For:** the session that will execute the tests · **From:** the V1 baseline session
**Date:** 2026-09-14 · **Epic:** SV-9160

---

## 1 · WHAT THIS SUITE IS FOR, IN ONE SENTENCE

**Everything a customer could do in V1, they must still be able to do in V2.**

That is the only question these tests ask. Every case is judged against **the V1 product itself** — its
shipped source code at commit `55767168` — and **not** against the V2 requirements document.

🔴 **This matters when you judge a result.** If a case fails and the V2 specification happens to allow
the new behaviour, that is **not** a reason to pass it or to close it. The specification decides whether
a loss is *acceptable* — the Product Owner rules on that, after the test has run. It never decides
whether the loss is *raised*. Every case opens with a line saying exactly this, so you will not have to
remember it.

## 2 · WHAT TO RUN

| | |
|---|---|
| **Test run** | **415** |
| Total tests in it | **162** |
| Of those, the V1 parity suite | **63** — section **6769** (62) plus section **8056** (1) |
| The rest | 99 tests covering V2's own new features — not this handoff's subject |

**Section 8056** holds cases derived from V1's *own automated test suite* rather than from reading the
V1 code. It is kept separate deliberately so the main suite stays one thing.

**Where to start reading:** `build/skills/16-TEST-EXECUTION-AND-DEFECTS.md` → `00-COMMON-CORE.md` →
`09-TEST-EXECUTION.md`.

## 3 · 🔴 THE THREE RULES THAT DECIDE HOW YOU MARK A RESULT

### Rule one — thirteen cases are Product Owner decisions. Run them, then mark **Blocked**. Never Failed.

These test something V1 could do that the V2 specification deliberately dropped. A failure is **not a
bug** — it is the evidence the Product Owner needs in order to rule. **Run the steps, write down the
exact words you typed and exactly what came back, then mark Blocked** and name the decision it feeds.

The QA lead was explicit: *"I still want to run those tests, we can move them to blocked, but the test
needs to be run."*

Each of the thirteen says so in its own Expected Results, so you do not need a list to work from.

### Rule two — two cases are expected to fail. Follow the three outcomes written on the case.

**C55666** (find a part by its part number) and **C55669** (find an asset by its VIN). Each names the
symptom you should see today.

1. **Exactly that** → mark **Failed**, raise nothing new. It is already reported.
2. **Fails differently** → that is a **new** problem. Report it.
3. **Passes** → the fix has shipped. Tell the QA lead.

### Rule three — verified means seen.

Mark **Passed** or **Failed** only for what you actually observed, with evidence captured on that run.
Anything else is **Blocked with the reason written out** — never a guess to make the run look complete.

## 4 · 🔴 THREE CORRECTIONS — READ BEFORE YOU FILE ANYTHING

**One finding was withdrawn, one was split, one was upgraded.** These were all corrected on the evening
of 14 September.

### WITHDRAWN — "a part you have in stock can't be found by its part number"

I had been chasing the wrong half. **In V1, a part sitting in the catalogue was searchable whether or
not the shop had ever stocked it.** So the question was never about stocked parts. **Do not file this.**

### UPGRADED, and now the strongest finding in the batch — "a catalogue part the shop never stocked can't be found"

Two parts, created minutes apart, the same way:

| Part | State | Searching its part number |
|---|---|---|
| `ZZT-88-4412` | catalogued **and** stocked, 25 on the shelf | ✅ **found** |
| `ZZT-77-3300` | catalogued only, never stocked | ❌ **nothing** |

One difference — stock — decides whether the part can be found. **In V1 both would have been found.**
This is the one most likely to reach a customer: a parts clerk searching for something the shop has
never carried. **C53601** covers it.

### SPLIT — "a work order or part sale can't be created"

| Half | Verdict |
|---|---|
| **Part sales cannot be created** | Real, and **already filed by the QA lead as [SV-10031](https://shopview.atlassian.net/browse/SV-10031)**. **Do not re-report it.** |
| **Work orders cannot be created** | **Wrong — that was my mistake.** The request was missing one field. Four work orders are now seeded and search finds all four |

## 5 · THE TEST DATA — seeded, and re-creatable in minutes

**The QA branch is redeployed regularly and our data is wiped every time.** There is a system for this:

```
cd build/global-search/seeding
python3 seed.py --check      # report only, writes nothing
python3 seed.py --confirm    # creates only what is missing
```

It logs itself in, sets the location, checks what exists, creates only the gaps, and writes the live
record ids to `seed-state-live.json`. **Run `--check` before the run starts and after any redeploy.**

**Seeded and verified right now — 6 of 7:**

| | |
|---|---|
| Customer `ZZAUTOTEST Bridgeport Hauling` | ✅ |
| Asset, unit `ZZT-4471`, a 2019 Freightliner Cascadia | ✅ |
| Vendor `ZZAUTOTEST Kestrel Parts Supply` | ✅ |
| Catalogue-only part `ZZT-77-3300` | ✅ |
| Stocked part `ZZT-88-4412` — 25 at Heavy Duty, 7 at Lethbridge | ✅ |
| Four work orders, `S9160-17597` to `S9160-17600` | ✅ |
| A part sale | 🔴 **blocked by SV-10031** — three cases wait on it |

**If a new case needs data:** add one entry to `seed-manifest.json` and re-run. Never edit the seeder.

## 6 · 🔴 SIX TRAPS THAT COST ME REAL TIME — do not repeat them

| Trap | What you will see | What is actually happening |
|---|---|---|
| **A newly created record looks missing** | You search for something you just made and get nothing | **Indexing takes up to ~35 seconds.** Wait and search again before concluding anything |
| **Everything suddenly fails with a session error** | Every request fails after a login | The session **rotates**; capture the new one. It is not "the environment expires in minutes" — that was my wrong diagnosis |
| **A whole area looks empty** | Parts or inventory return nothing at all | You have not set the **location**. Without it, location-scoped data is invisible — and it looks exactly like missing data |
| **A list search finds nothing** | Searching a list page returns an empty result for a record you can see | On some pages the search box genuinely matches nothing. **Always search for a record you KNOW exists first**, as a control |
| **The same record appears twice** | Search shows two identical rows | Check the ids. **Two real records** from a double-run seeder is not a de-duplication bug |
| **The keyboard shortcut "does not work"** | Automated Ctrl+K appears to do nothing | A capital `K` sends Ctrl+**Shift**+K, which the app correctly ignores. Use lower case |

## 7 · WHAT TO RAISE, AND HOW

`v1-parity-audit-2026-09-14/PO-TASK-TICKET-CANDIDATES.md` holds **fifteen candidates**, each with its
V1 evidence, the exact query, the observed result, and the test case it maps to. **Its first section is
a plain-words key** — every code is explained, so nothing needs decoding.

`PO-TICKET-BODIES.md` holds the **ready-to-file body** for each Product Owner question.

**The shape (Rules 52 and 53):** a defect is a `Story Defect`; a Product Owner question is a `Task`.
Parent is **the owning story**, never the epic — an epic parent is rejected. Priority **Medium**; High
is barred. Also link the owning story as "relates to".

🔴 **Permission to file is per ask (Rule 62).** Those files are **approved candidates, not permission**.
Ask the QA lead before each ticket; approval for one never covers the next. Every one must also clear
the Rule 94 admissibility gate. And **never file an API-related ticket without asking, every time**
(Rule 51).

## 8 · THINGS THAT WILL SAVE YOU AN ARGUMENT

- **Do not edit the cases in sections 6769 or 8056.** If one looks wrong, say so and I will fix it —
  touching a case means re-verifying the whole case, and all 63 were verified on 14 September.
- **Union-only when syncing the run.** A partial case list on an update **deletes tests and their
  results**. The run went 139 → 162 across several syncs with nothing lost; keep it that way.
- **A part is only findable if it is STOCKED**, not merely catalogued. That is the single most
  important thing to know before judging any parts result.
- **Parts follow the location in V2.** A part stocked only at the other branch will not be found from
  where you are. In V1 parts were company-wide — **C45151 tests exactly this and is expected to fail on
  its parts half.**

## 9 · THE ENVIRONMENT

QA `sv9160.qa.shopview.com`, API `sv9160api.qa.shopview.com`. Two locations exist: **Staging Heavy Duty
– 9919** and **Staging Lethbridge – 4310**.

Search opens as a **centred window** from a button in the header, or with the keyboard shortcut. It has
a row of tabs across the top with a count on each, then results grouped by type. Escape closes it. **If
a group looks empty, click that type's tab to confirm it really is zero** rather than scrolling. All 63
sets of preconditions were rewritten against this real screen on 14 September.

## 10 · HOW TO REACH ME

**Write your reply into the repository**, on branch `claude/global-search-v1-baseline-6ax9ul`, next to
this file — and name it in the commit message. A session address changes between runs, so the repo is
the only reliable channel. The QA lead reads it too, which is the point.

## OUTSTANDING — what I need back from you

| # | What | Why it matters |
|---|---|---|
| 1 | **Run the four never-yet-run cases early** — C55658, C55659, C55660, C55661 — and tell me what they actually do | Their tickets are written as *predictions*. Your run turns them into measurements, and a wrong prediction must be corrected before it is filed |
| 2 | Tell me if any candidate **fails the admissibility gate**, and why | I would rather fix it than have it filed weakly |
| 3 | Re-run `seed.py --check` **after any redeploy** and tell me if anything cannot be restored | Six cases would otherwise fail for a data reason and produce false defects |
