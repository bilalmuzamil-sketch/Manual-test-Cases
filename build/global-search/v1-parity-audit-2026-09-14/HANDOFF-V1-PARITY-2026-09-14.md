# HANDOFF — Global Search V1 regression suite, made V1-first

**Date:** 2026-09-14 · **To:** Bilal (QA lead) · **From:** the V1 baseline session
**Branch:** `claude/global-search-v1-baseline-6ax9ul` · **TestRail:** section **6769**, run **415**

---

## 1 · THE RULE YOU ASKED ME TO SAVE — now **Standing Rule 109**

Recorded at `build/rules/RULES-61-96.md`, numbered **109** so it continues the canonical branch's
sequence (canonical is at 108) and can be moved across without colliding.

> **FOR A V1-versus-V2 COMPARISON SUITE, V1 *IS* THE SPECIFICATION — AND V1 MEANS THE V1 PRODUCT
> REPOSITORY, NOT ANY DOCUMENT.**

Four things it requires, every time:

| | What it requires |
|---|---|
| **(a)** | **The specification is the V1 product repository** — the shipped code at a named commit, not the V1 PRD, not the V2 PRD, not the epic, not the design. Code is what actually decided what V1 could do. Build the capability list **mechanically** from the code, never from memory |
| **(b)** | **The V2 specification is not consulted to decide whether a case exists.** The only question is *"could a user do this in V1?"* Whether V2's document mentions it, omits it, or deliberately removes it changes nothing. It never subtracts a case |
| **(c)** | **The expected result states the V1 behaviour, and the SOURCE line says so** — leading with repo, commit, file and line range, naming the V2 document only afterwards as the thing that differs |
| **(d)** | **Never edit an existing comparison case towards the V2 spec.** A case rewritten to match the thing it tests cannot fail, and a case that cannot fail is worse than no case, because it reports safety |

**🔴 This rule lives on a superseded branch.** It must be carried onto
`origin/claude/slack-session-0sxnd9` (canonical) as Rule 109 in `build/rules/RULES-61-ONWARD.md`, or
the next session will not have it.

---

## 2 · WHAT WAS WRONG, IN ONE PARAGRAPH

I built the suite by taking each V1 capability, checking whether PRD v1.5 had deliberately changed it,
and where it had, writing it off as *"correctly excluded — not a gap."* That is using the thing under
test as the standard it is tested against. Eleven behaviours were excluded that way; **four were real
capability losses with no test anywhere.** A further **fourteen** had no case because I assumed a nearby
case covered them — including **finding a customer by company name**, the most basic search in the
product. And one case, **C45153**, I had actually **edited away from V1**: it originally required a Part
row to open the catalogue part, and on 9 September I rewrote it to require the inventory part because
spec v1.3 said so.

---

## 3 · WHAT THE SUITE LOOKS LIKE NOW

| | Before | Now |
|---|---|---|
| Cases in section 6769 | 40 | **58** |
| Tests in run 415 | 139 | **157** (0 lost across three union-only syncs) |
| V1 capabilities covered | not measured | **65 of 65** |
| Cases whose SOURCE line cites V1 | 28 of 58 | **58 of 58** |
| Cases serving no V1 capability | not measured | **0** |

### 18 cases added

**Wrongly excluded as "a deliberate V2 change" — these four are the heart of the problem:**

| Case | What V1 could do | What V2 does instead |
|---|---|---|
| [C55658](https://shopview.testrail.io/index.php?/cases/view/55658) | Find a work order by typing its status (`Estimate`, `In Progress`) | Status was dropped from the index at spec v12 |
| [C55659](https://shopview.testrail.io/index.php?/cases/view/55659) | Find a record by typing only **part** of its number | §7 makes identifiers exact-match-only |
| [C55660](https://shopview.testrail.io/index.php?/cases/view/55660) | Find a record by a fragment from the **middle of a word** | Similarity scoring against a threshold |
| [C55661](https://shopview.testrail.io/index.php?/cases/view/55661) | See **every** matching type — V1 gave each its own slots with no overall cap | A 20-result total cap can squeeze a type out entirely |

**Simply missed — a nearby case had been assumed to cover them:**

C55662 customer's own main phone · C55663 vendor phone · C55664 asset model · C55665 part sale by
customer name · C55666 part by part number · C55667 **customer by company name** · C55668 vendor by name ·
C55669 VIN in full and in part · C55670 contact first/last name · C55671 case-insensitivity ·
C55672 plain work order number · C55673 Enter opens the top result · C55674 reachable on phone and
tablet · C55675 a no-results message

### 50 cases corrected

- **C45153 restored** to the V1 expectation (a Part row opened the **catalogue** part —
  `routingService.ts:75`), and it now tests a catalogue-only part explicitly. The V2 difference is a
  finding, not the expectation.
- **30 SOURCE lines rewritten** so V1 leads. Each now opens *"SOURCE — THIS CASE IS TESTED AGAINST V1,
  NOT AGAINST THE V2 SPECIFICATION"*, names the commit, file and lines, cites Rule 109, and mentions
  the V2 document only as information.
- **C45159 is the one deliberate exception**, and it is recorded on the case: in V1 a user with no
  default workplace got **no search at all**. V2 giving them a working search is a gain, not a loss, so
  the case keeps the V2 expectation.

---

## 4 · HOW I KNOW THE COVERAGE IS COMPLETE

Not by asserting it. `coverage_proof.py` in this folder:

1. Takes the V1 capability list built **mechanically** from the V1 SQL — every `COALESCE(...)` column
   in every fetcher's search expression at commit `55767168` (37 searchable fields), plus the 28
   behavioural invariants.
2. Maps each to case IDs.
3. Checks **live against TestRail** that every mapped case exists, and that every one sits in run 415.
4. Checks the reverse direction too — that no case in 6769 serves no V1 capability.

Result: **0 uncovered, 0 missing from the run, 0 dead cases.** `audit_sources.py` then checks all 58
SOURCE lines and reports **58 of 58 compliant**. Both are re-runnable, so this is checkable rather than
something you have to take my word for.

Full mapping, row by row, with the code citation against each: **`V1-CAPABILITY-COVERAGE-PROOF.md`**.
That file also lists, in §3, the V1 behaviours I judged **not** to be a losable capability and exactly
why — so you can overrule any of them rather than have the judgement made invisibly.

---

## 5 · THE 15 TICKETS, WRITTEN AND WAITING

`PO-TASK-TICKET-CANDIDATES.md` — **nothing filed.** Rule 62 makes Jira permission per-ask.

- **4 observed defects**, all reproduced live on the QA branch: asset unit number, full VIN (the
  11-character prefix works while the complete VIN fails), vendor email, and a stocked part's own part
  number. They share one shape — **free text matches, identifiers do not** — and are very likely one
  root cause rather than four bugs.
- **11 PO decisions**: catalogue-only parts, customer postal code and website, contact job title,
  vendor postal code and state, licence plate, plus the four in the table above.

**The highest-risk one is the identifier cluster.** A fleet user searching a unit number is the single
most common search in this product.

---

## 6 · YOUR FOUR QUESTIONS, ANSWERED

**1. "Are you referring to file those tickets in Jira?" — Yes.** Fifteen tickets in Jira under epic
SV-9160: four `Story Defect` for the confirmed build defects, eleven `Task` for the PO to rule on. Each
parented to its owning story (never the epic — an Epic parent is rejected HTTP 400), priority `Medium`,
`relates to` the owning story. They are written; I have filed none, because Rule 62 makes the permission
per-ask.

**2. Cookies — received and used.** Stored at `/tmp/qa/cookies.json`, `chmod 600`, never committed
(Rule 82). They work: `GET /api/search` returns 200, and V1's old endpoint
`/api/global-search/fetch` returns 404 — gone, as planned.

**3. Bin locations are grid locations — thank you, that closes the question,** and it changes the
answer. See §6a below.

**4. Yes, the rule section is for your information** — it is recorded in the repo, and the only thing I
need from you on it is item 5 in the outstanding table.

### 6a · THE BIN-LOCATION RETEST — now proved, and the answer is not what I expected

With the bin actually existing, I checked the instrument **before** drawing any conclusion (Rule 104):

| Check | Result |
|---|---|
| Does `BIN-ZZT-77` exist? | **Yes** — id `972733fe…`, 555 units, 1 part |
| Is a part really in it? | **Yes** — part **P550848**, *FUEL/WATER SEPARATOR*, 555 units |
| Does bin search work at all in V2? | **Yes** — `H3B` → 13 parts, `General Storage` → 19 |

Then the decisive comparison. **P550848 sits in two bins at once** — `H3B` (999, default) and
`BIN-ZZT-77` (555):

| Query | Rows | Contains P550848 |
|---|---|---|
| `H3B` | 13 | **YES** |
| `BIN-ZZT-77` | **0** | no |

**Same record, same field, two values — one indexed, one not.** That rules out permissions, org scoping,
the part being missing from the index, and bin search being unbuilt. What is left is that **the index
holds a stale copy of that part's bin list**: the newly added bin was never indexed.

🔴 **But this is NOT a V1 regression, and I have deliberately given it no case in your regression
suite.** V1 never indexed bin or grid location at all — V1's part search text was the part name and the
part number, nothing else (`FetchDataQueryHandler.php:324-328`). Nobody could search a bin in V1, so
nothing was lost. It **is** a V2 defect against V2's own spec (§4 indexes bin location, §9 requires a
30-second index refresh), so it belongs to the **V2 functional suite** — not mine. Recorded in full at
`qa-seed-2026-09-14/EARLY-SIGNALS-FROM-SEED-VERIFICATION.md` so it does not get lost between the two.

**One thing I deliberately did NOT report.** Creating the part sale C55665 needs, via
`POST /api/work-orders/create`, returned HTTP 500. I ran a control with `type: service` — **also 500**.
So the failure is not part-sale-specific and is most likely my payload missing a field, not a build
defect. **No finding claimed.** The part sale needs creating through the UI; the case already says so.

---

## 7 · ONE FINDING RETRACTED

I had reported `BIN-ZZT-77` returning nothing as a signal. **Withdrawn** — the bin location did not
exist when I searched it; only the free-text `grid_location` field on one part carried that string.
Finding nothing for a record that was never created proves nothing. You have since created it, so the
check is now meaningful and needs running — **twice**, because your screenshot shows "bin location" is
two different things: a selectable **Bin Location record**, and the part's free-text **grid location**.
PRD v1.5 §4 does not say which it indexes.

---

## OUTSTANDING — what I need from you

| # | What I need | Why it matters | Blocks |
|---|---|---|---|
| 1 | **One word to file the 15 tickets** | Rule 62 permission is per-ask; they are written and ready to go one at a time | The PO cannot rule on what has not been raised |
| 2 | **Create one part sale** for `ZZAUTOTEST Bridgeport Hauling` through the UI | The API path returns 500 for me on every work-order type, so it is my payload, not a bug worth chasing | C55665 only |
| 3 | ~~The bin-location ruling~~ — **answered: bin = grid location.** Question closed, retest done | — | — |
| 4 | **Tell the execution session run 415 is now 157 tests**, not 139 | It is mid-handoff and will otherwise work from a stale count and think cases are missing | Its run |
| 5 | **Carry Rule 109 onto the canonical branch** | This branch is superseded; a rule that lives only here is a rule the next session never sees | Every future V1→V2 comparison |
