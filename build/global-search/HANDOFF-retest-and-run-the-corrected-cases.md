# Handoff — eight cases need running in run 415

**For:** the session running the test pass.
**From:** the main session, 15 September 2026.
**Run 415:** https://shopview.testrail.io/index.php?/runs/view/415 — branch `sv9160`, build `v26.36.4-7869ff2`.

**Why:** six cases were corrected today and two were newly written. The six corrected ones already
carry results, and those results were set against the OLD wording — the cases now ask the tester to
type things the old steps never asked for, so those results no longer mean anything. The two new ones
have never been run.

The run went from 164 tests to 166. **Nothing was removed and all 65 existing results were kept** —
checked before and after.

---

## 1 · Two new cases — never run

| Case | Test | Type this | What should happen |
|---|---|---|---|
| **C55688** — Finding an asset by its make on its own<br>https://shopview.testrail.io/index.php?/cases/view/55688 | [2990626](https://shopview.testrail.io/index.php?/tests/view/2990626) | `Freightliner` — the make, nothing else | The asset `2019 Freightliner Cascadia` comes back under Assets. **Unknown whether this works** — that is the point of the case. |
| **C55689** — Finding an asset by its year on its own<br>https://shopview.testrail.io/index.php?/cases/view/55689 | [2990627](https://shopview.testrail.io/index.php?/tests/view/2990627) | `2019` — the year, nothing else | Same asset comes back. **Unknown whether this works.** Do not assume it fails just because the year-and-make case fails. |

---

## 2 · Six corrected cases — the results on them are stale

| Case | Test | Status now | What changed |
|---|---|---|---|
| **C55662** — customer by the company's main phone number<br>https://shopview.testrail.io/index.php?/cases/view/55662 | [2977474](https://shopview.testrail.io/index.php?/tests/view/2977474) | Failed (stale) | **Both steps replaced.** It used to type `(419) 555-0143` and `4195550143`. The old version found **neither** of those, so it was testing something the old version could not do. It now types `419-555-0143` and then only the last part, `555-0143`. Marked **EXPECT FAIL (SV-10057)** with the three outcomes spelled out. |
| **C53605** — asset by year and make typed together<br>https://shopview.testrail.io/index.php?/cases/view/53605 | [2959371](https://shopview.testrail.io/index.php?/tests/view/2959371) | Failed (stale) | **Retitled.** It was called "Finding an asset by its year" but its one step types `2019 Freightliner` — the year **and** the make. Title now says what it types. Marked **EXPECT FAIL (SV-10055)** with the three outcomes. |
| **C55664** — asset by its model<br>https://shopview.testrail.io/index.php?/cases/view/55664 | [2977476](https://shopview.testrail.io/index.php?/tests/view/2977476) | Passed (stale) | Steps unchanged — **you may leave the Passed result if you prefer.** Its Expected used to claim another case proved the make was searchable; that case types a *misspelling*, sits in a different section and is judged against the new specification. It now points at C55688, which actually types the make. |
| **C55670** — customer or vendor by a contact's name or phone number<br>https://shopview.testrail.io/index.php?/cases/view/55670 | [2980692](https://shopview.testrail.io/index.php?/tests/view/2980692) | Passed (stale) | **Steps 6–9 are new.** Types the contact's own number `419-555-0177`, then only the last part `555-0177`. Says plainly not to type the plain-digit or bracketed forms — the old version found neither. |
| **C53579** — work order number with the shop number in front<br>https://shopview.testrail.io/index.php?/cases/view/53579 | [2959356](https://shopview.testrail.io/index.php?/tests/view/2959356) | Passed (stale) | Now searches **five** real forms of the number instead of one. Note a real job number and your own shop number first; the examples show the SHAPE, not values that exist. |
| **C53604** — customer or vendor by address line 2<br>https://shopview.testrail.io/index.php?/cases/view/53604 | [2959370](https://shopview.testrail.io/index.php?/tests/view/2959370) | Passed (stale) | Step 4 now names the value to type — `Bay 12C` — and warns that address line 2 is empty on most real records, so an empty field proves nothing. |

---

## 3 · The one thing that will trip you up

**A phone number in the old version only matched if you typed it with dashes, or typed part of it.**

The old version stored `(419) 555-0143` as `419-555-0143`, and what you typed had only its **spaces**
removed — nothing else. So:

| Typed | Old version found it? |
|---|---|
| `419-555-0143` | ✅ yes |
| `555-0143` — part of it | ✅ yes |
| `(419) 555-0143` — with brackets | ❌ no |
| `4195550143` — plain digits | ❌ no |

So **do not "helpfully" retype a number in a different format.** If a case says type it with dashes,
type it with dashes. The new version is more forgiving than the old one, and typing a format the old
version never supported turns the test into something that cannot fail.

---

## 4 · Before you start

Open global search and type **ZZAUTOTEST**. You should get several groups — Work orders, Customers,
Assets, Parts, Vendors, Part sales.

**If you get nothing at all, a new build has wiped the test data.** Stop and ask for it to be put back
— it is one command and takes about a minute. Do not create the records by hand.

**The data was checked live today and is complete** — 11 of 11 records present, every field matching.
So nothing returning at all means a fresh wipe, not a known gap.

---

## 5 · Recording results

* **Passed** — every search in the case returned what the Expected Results say.
* **Failed** — a search returned nothing, or the wrong record. **Put the exact text you typed and what
  came back in the comment.** That is the whole value of the result.
* **Blocked** — you could not run it. Say which part stopped you.

**Several of these cases now make more than one search, and one failing search is a failing case** —
say which one.

**The two EXPECT FAIL cases (C55662, C53605) tell you what you should see today and what to do in each
of three outcomes.** Read that part before you judge them. Short version: the expected symptom means
Failed and raise nothing new; a *different* failure is a new problem worth telling the QA lead about;
and if it passes, the fix has shipped and the ticket can be closed.

---

## OUTSTANDING — what I need from you

| # | What I need |
|---|---|
| **1** | Run the eight tests above and set a result on each, with the typed text and what came back on anything that is not a Passed. |
| **2** | Tell the QA lead what C55688 and C55689 do — nobody knows yet whether the make alone or the year alone works, and those two answers decide whether a new ticket is needed. |
| **3** | Nothing else. The data is seeded and verified; the cases are corrected and verified. |
