# Verdict — are the other session's four coverage gaps real?

**Asked:** 15 September 2026, by the QA lead — *"the other session is telling me that there are 4
coverage gaps, can you confirm if the other session is wrong?"*

**Short answer: they are not wrong.** All four were genuine gaps when they measured them. Three are
still open. One was closed by me a few hours after their card was written, so their card is not wrong,
it is just out of date on that one row.

**And they under-counted.** Checking their four turned up a fault in an existing case that their card
does not mention, and a fault in the wording of their own Case 2 — both the same underlying mistake.
Details in §3.

---

## 1 · The verdict, row by row

| # | Their claim | Verdict | Evidence |
|---|---|---|---|
| **1** | A customer cannot be found by only PART of its phone number — no case types a fragment | ✅ **REAL, STILL OPEN** | C55662 is the only case that types the company number, and it types it **whole**, twice. Nothing anywhere types a fragment of it. |
| **2** | A customer cannot be found by its CONTACT's own phone number — no case types it | ⚠️ **WAS REAL — NOW CLOSED** | I added it to C55670 at 13:05 today, before their card reached me. Steps 6–9 now type the contact's own number. |
| **3** | An asset cannot be found by its MAKE alone — no case types `Freightliner` on its own | ✅ **REAL, STILL OPEN** | C53605 types `2019 Freightliner` (year **and** make). C55664 types `Cascadia` (the model). Nothing types the make by itself. |
| **4** | An asset cannot be found by its YEAR alone — no case types `2019` on its own | ✅ **REAL, STILL OPEN** | Same case, same single step. Nothing types the year by itself. |

Method: every line in all 65 cases in sections 6769 and 8056 that tells a tester what to type was
pulled from TestRail live and read. Not sampled. The dump is reproducible with
`steps_exercise_proof.py` in this folder.

---

## 2 · Why my own earlier count said three, not four

My first pass over the same ground reported **three** gaps and gave the make and the year a clean
bill. That was a bug in my checking tool, not a difference of judgement.

The tool asked *"does this value appear anywhere in the steps text?"*. `Freightliner` appears inside
`2019 Freightliner`. So does `2019`. A case that only ever typed the two **together** satisfied the
check for each of them **separately**, and both gaps reported green.

**"A case mentions this value" and "a case types this value on its own" are different claims, and only
the second is coverage.** The tool now extracts what the tester is literally told to type and compares
the whole thing, and it reports a third bucket — *appears only inside a longer query* — which has to
be ruled on in writing instead of being counted either way. That bucket is what would have caught the
make and the year the first time.

---

## 3 · What neither card caught — and it matters more than the four

**In the old version, a phone number did NOT match if you typed it with brackets, or as plain digits.**

The old version stored the number with the brackets stripped and the `)` turned into a dash, so
`(419) 555-0143` was stored as `419-555-0143`. What the user typed had **only its spaces** removed —
nothing else. So:

| Typed | Did the OLD version find it? |
|---|---|
| `419-555-0143` | ✅ yes |
| `555-0143` — part of it | ✅ yes |
| `(419) 555-0143` — as shown on the record | ❌ **no** |
| `4195550143` — plain digits | ❌ **no** |

Verified two ways: read from the product source at commit `55767168`
(`FetchDataQueryHandler.php:235` for the storing, `useGlobalSearch.ts:92` for the typing — the query
normalisation there is literally `normalizedSearch.replace(/\s+/g, '')`, spaces and nothing else), and
then re-run through the rebuilt old-version engine in
`../v1-capability-evidence/v1_search.py`. SV-10057 already carries this same table, independently.

### Three consequences

1. **C55662 is testing the two forms the old version never supported.** Its only two steps type
   `(419) 555-0143` and `4195550143`. This is a **V1-regression** case, where the old version is the
   standard (Standing Rule 109) — so as written it asserts a capability the old version did not have,
   and it leaves untested the one it did (the fragment). **This is the correction their Case 1 should
   be folded into, not a separate case.** Needs your go-ahead — it is tied to an open ticket.

2. **Their Case 2 as specified repeats the same mistake.** Its step 4 is *"type the same number as
   plain digits: `4195550177`"*. The old version would not have found that. If it is written as
   specified it cannot fail honestly.

3. **I made that exact mistake myself today, in C55670, and have fixed it.** My step 8 typed
   `4195550177`. It now types `555-0177` — the last part of the contact's number, which the old
   version **did** find — and the case says plainly that the bracketed and plain-digit forms were not
   old-version behaviour, so finding them is an improvement and not a pass condition.

---

## 4 · Does any of it need data seeded? No.

Checked live today with `build/global-search/seeding/seed.py --check`:

```
records present : 11/11
needing action  : 0
field gaps      : 0
NOT COMPARED    : 0
cases at risk   : 0
```

All three records the four cases rely on are present with every declared field matching:

| Record | Fact the cases need | State |
|---|---|---|
| ZZAUTOTEST Bridgeport Hauling | company telephone `(419) 555-0143` | ✅ present, matches |
| Its contact Marlene Okonkwo | contact telephone `(419) 555-0177` | ✅ present, matches |
| Asset 2019 Freightliner Cascadia | unit `ZZT-4471`, year 2019, make Freightliner | ✅ present, matches |

**Nothing to seed.** The task card's warning *"if the contact's number is blank the case proves
nothing"* is a fair warning and it does not apply — the number is set and was read back from the
record, not assumed.

---

## 5 · What the cases should type, if they are written

Taken from the old version's own behaviour, so they can fail honestly.

| Case | Type this | Do NOT type this, and say why in the case |
|---|---|---|
| Company phone, part of it | `555-0143`, then `0143` | `(419) 555-0143` and `4195550143` — the old version found neither |
| Contact phone | `419-555-0177`, then `555-0177` | `4195550177` — same reason. **Already done in C55670** |
| Asset make alone | `Freightliner` | — |
| Asset year alone | `2019` | `2019 Freightliner` — that is C53605's job and its own finding (SV-10055) |

---

## 6 · CLOSED — what was done, 15 September 2026

The QA lead approved correcting the cases and assigned the writing to this session. All of it is done
and verified live.

| Action | Case | Verified |
|---|---|---|
| **Created** — types `Freightliner`, the make on its own | [C55688](https://shopview.testrail.io/index.php?/cases/view/55688) | ✅ fields, marker, V1 source block, title length, no duplicate title |
| **Created** — types `2019`, the year on its own | [C55689](https://shopview.testrail.io/index.php?/cases/view/55689) | ✅ same checks |
| **Corrected** — steps now type `419-555-0143` then `555-0143`; was typing the two forms V1 never supported. Now EXPECT FAIL (SV-10057) with the three outcomes | [C55662](https://shopview.testrail.io/index.php?/cases/view/55662) | ✅ exactly two typing steps, dashed then partial; the forbidden forms appear only inside the "do NOT type" warning |
| **Corrected** — retitled to *"Finding an asset by its year and make typed together"*, which is what its one step types. Now EXPECT FAIL (SV-10055) with the three outcomes | [C53605](https://shopview.testrail.io/index.php?/cases/view/53605) | ✅ title, steps, marker, pointer to C55689 |
| **Corrected** — the false claim that a misspelling case proved the make was searchable now points at C55688; a mangled source sentence repaired | [C55664](https://shopview.testrail.io/index.php?/cases/view/55664) | ✅ old sentence gone, new one present, source sentence reads correctly |
| **Added to run 415 by union** | C55688, C55689 | ✅ 164 → 166 tests, **nothing lost, all 65 existing results preserved** |

**Coverage proof now passes.** `steps_exercise_proof.py`: 42 scenarios — **39 typed by a case, 3 waved
with a written reason, 0 not typed.** It was failing on three before this work.

### Gap 1 was folded into C55662 rather than made a new case

The other session's card proposed a separate case for "part of a phone number". C55662 already exists
for that field, with the same record and the same preconditions, and its steps were wrong — so the
honest fix was to correct it rather than leave a wrong case beside a new right one. A separate case
would have duplicated it and left the wrong one in the suite.

### Two things worth recording for next time

1. **`delete_case` with `soft=1` is NOT a dry run on this TestRail.** It deleted. I used it expecting a
   preview. No harm done — what it removed were two duplicates I had just created by accident and
   which were in no run — but nobody should reach for it as a safe check.
2. **`(value or "")` in a verification comparator silently destroys a legitimate `0`**, and TestRail
   appends a trailing newline and sometimes a stray `</p>` to text fields. Three "the write did not
   land" alarms today were all the comparator, not the data. A verification that cries wolf gets
   ignored, so these are now compared at content level — every sentence asserted present, the old text
   asserted absent, and every untouched field asserted byte-identical.

---

## OUTSTANDING — what I need from you

| # | What I need | Why it is waiting on you |
|---|---|---|
| **1** | **Tell the other session to stand down on their four cases.** All four are now handled — two written, one folded into C55662, one already in C55670. If they create theirs as well the suite gets four duplicates. | They are working from a card that predates this, so they will write them unless told. |
| **2** | **Which `custom_automation_type` should new cases in this suite carry?** I used **0**, matching all 66 siblings and all three skill files. Their card says a ruling of yours on 2026-09-02 requires **2** for new cases — I could not find that ruling in anything committed, so I did not follow it on your behalf. | If the ruling is real, C55688 and C55689 need changing to 2, and so do the other 66. If it is not, their card needs correcting. Either way it is one word from you. |
| **3** | **Nobody knows yet whether the make alone or the year alone actually works** on this build. C55688 and C55689 are written and in the run but have never been executed. | Those two results decide whether a new ticket is needed. The execution session has the handoff. |
| **4** | Nothing else. Seeding needs nothing, all eight cases are verified, and the run is intact. | — |
