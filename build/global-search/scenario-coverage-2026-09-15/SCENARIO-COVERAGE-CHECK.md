# Are the demonstrator's 42 scenarios all covered by the suite?

**Date:** 2026-09-15 · **Checked:** the 42 keyword scenarios on the demonstrator against the
**steps of all 64 cases** in section 6769 (committed snapshot, refreshed after today's edits).

**Result: 37 of 42 are covered. 3 are real gaps. 2 are false alarms.**

## The test I applied, and why

Not *"does a related case exist?"* — that question passes far too easily. The question was:

> **Do a case's STEPS actually tell a tester to type this?**

A capability with a case that never types the thing is coverage on paper only. That distinction is
what found all three gaps, and one of them my own capability register had been hiding.

---

## 🔴 GAP 1 · A contact's own phone number — nothing types it

| | |
|---|---|
| **Scenario** | Type a contact's own telephone number, `419-555-0177` |
| **Was it a V1 capability?** | **Yes** — `cu.telephone` sits in the customer's searchable text (`FetchDataQueryHandler.php:238-244`, commit `55767168`) |
| **Cases that type it** | **NONE** |

**How it hid.** My own capability register maps *"Customer — contact telephone"* to C55662 and C53603.
Neither exercises it:

- **C55662** types the **company's** number, `(419) 555-0143` — a different field on a different record.
- **C53603** types the contact's **job title** only.
- **C55670** types the contact's **first and last name** only.

So three cases sit near it and not one types it. **A register that maps a capability to a case which
does not exercise it is worse than an empty cell** — it reports green.

**Why it matters on a shop floor:** a contact's direct line is often the only number anyone has.

---

## 🔴 GAP 2 · The shop-prefixed job number — and this one is my own regression from this morning

| | |
|---|---|
| **Scenario** | Type a job number with the shop number in front, `S9160-17611` |
| **Case** | [C53579](https://shopview.testrail.io/index.php?/cases/view/53579) — *"A work order number with the shop number in front still finds it"* |

**What the steps say now:**

> 2. First get a real number: type ZZAUTOTEST … Now search that number exactly as shown.
> 3. Search it with no dash, **for example S1234**.
> 4. Search it with the shop number after the letter, **for example S12-1234**.
> 5. Search it with the shop number only, **for example 12-1234**.

Step 2 has the tester type the **plain** form. Steps 3 to 5 are **invented examples** — `S1234`,
`S12-1234`, `12-1234` — which match no record on the branch. So **the case no longer exercises its own
title.** A tester following it literally types three numbers that cannot match anything and has no way
to know that is wrong.

**🔴 I caused this today.** Replacing the hardcoded stale number with an on-screen lookup was right;
leaving steps 3 to 5 as made-up examples was not. The fix that removed one trap left another.

**What it should say:** derive the four real forms from the number the tester noted. From `S-17611`
at shop `9160` those are `S17611`, `S916017611`, `S9160-17611` and `9160-17611` — the four the old
query actually wrote.

---

## 🔴 GAP 3 · The vendor's second address line — named for the customer, not for the vendor

| | |
|---|---|
| **Scenario** | Type the vendor's second address line, `Bay 12C` |
| **Case** | [C53604](https://shopview.testrail.io/index.php?/cases/view/53604) — *"Finding a customer or vendor by address line 2"* |

**What the steps say:**

> 2. Type the customer's address line 2: **Dock 7B**
> 4. Clear the input and **search for the vendor's address line 2**.

The customer half names its value. **The vendor half does not** — the tester is sent to go and find
it. And until today the vendor had no second address line at all, so that half was unrunnable; I
seeded `Bay 12C` this morning and did not come back to the case.

For a non-technical tester, "go and look it up" is exactly the instruction that gets skipped.

---

## The two false alarms — covered, just not literally

| Scenario | Why it is fine |
|---|---|
| `Darlene` | The thing being tested is typing **Marlene** and *not* getting Darlene — which is precisely what [C55685](https://shopview.testrail.io/index.php?/cases/view/55685) does. Typing "Darlene" is a demonstrator convenience, not a missing test. |
| `zzzqqq` | [C55675](https://shopview.testrail.io/index.php?/cases/view/55675) and [C55679](https://shopview.testrail.io/index.php?/cases/view/55679) both run a no-match search using `ZZNOSUCHRECORD9999`. Same scenario, different string. |

---

## The transferable lesson

**"A case exists for this capability" and "a case types this" are different claims, and only the
second is coverage.** My coverage proof checks that every capability maps to a live case in the run —
it does not check that the case's steps exercise the thing. That is how Gap 1 sat green.

Worth adding to the proof tool: for every capability that names a searchable field, assert that some
case's steps contain a value from that field. It would have found Gap 1 without the demonstrator
being built at all.

## Nothing has been changed

These are three proposed corrections to live TestRail cases. **No case was edited** — TestRail writes
need the QA lead's explicit go-ahead, per standing rule 6.
