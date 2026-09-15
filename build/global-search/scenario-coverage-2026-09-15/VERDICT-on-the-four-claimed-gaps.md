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

## OUTSTANDING — what I need from you

| # | What I need | Why it is waiting on you |
|---|---|---|
| **1** | **May I correct C55662?** Its two steps type the two phone forms the old version never supported, and miss the one it did. | It is an EXPECT-FAIL case tied to open ticket SV-10057, so changing what it tests changes what that ticket is judged against. I will not touch it without your word. |
| **2** | **Shall I tell the other session about §3** before they write their Case 1 and Case 2? | Their Case 2 as specified types a form the old version could not find. If it goes in as written it cannot fail honestly, and it will read as a passing case that proves nothing. |
| **3** | **Who writes the three open cases** — them or me? | Their card assigns them to the authoring lane. I have the old-version behaviour verified and can write them, but I am not going to duplicate their work by accident. |
| **4** | Nothing else. Seeding needs nothing, and the three cases I fixed are verified. | — |
