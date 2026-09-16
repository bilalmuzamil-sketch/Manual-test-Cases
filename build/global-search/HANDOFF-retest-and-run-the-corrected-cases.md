# Handoff — seven cases need running in run 415

**For:** the session running the test pass.

> ### ⚠️ IF YOU WERE SENT AN EARLIER COPY OF THIS FILE, DISCARD IT
> It has changed materially since it was first issued. Earlier copies said **six** cases, then
> **eight**; it is now **seven**. An earlier copy also told you to run **C55692**, which has since been
> **deleted from TestRail** — its ticket was withdrawn because the behaviour it asserted never existed
> in the old version. And no earlier copy warned that the build moved, which makes every result
> recorded before 16 September stale. **Always work from the link, not from a saved copy.**

**From:** the main session. **Last updated 16 September 2026** — this supersedes every earlier copy.
**Run 415:** https://shopview.testrail.io/index.php?/runs/view/415 — branch `sv9160`, build
**`v26.36.7-893d13a`** (it was `v26.36.4-7869ff2` until 16 September).

> ## 🔴 THE BUILD MOVED THREE PATCHES ON 16 SEPTEMBER, SO EVERY RESULT IN THE RUN IS STALE
>
> All 67 results were recorded against the **old** build, and at least four behaviours changed with
> the new one. **Results set before 16 September no longer describe this build.** The cases tied to
> SV-10002, SV-10003, SV-10005, SV-10006 and SV-10058 were Failed and should now **pass**.
>
> The branch was also wiped in the redeploy and has been reseeded — 11 of 11 records present,
> every field verified. Full account: `reseed-findings-2026-09-16/WHAT-CHANGED-BETWEEN-THE-TWO-BUILDS.md`.

**Why:** six cases were corrected today. They already carry results, and those results were set
against the OLD wording — the cases now ask you to type things the old steps never asked for, so those
results no longer mean anything. (Two further cases were written today and have already been run —
§1, nothing to do.)

The run went from 164 tests to 166. **Nothing was removed and all 65 existing results were kept** —
checked before and after.

---

## 1 · Two new cases — ALREADY RUN, both Passed

Run on 15 September 2026 on branch `sv9160`, build `v26.36.4-7869ff2`. **Nothing to do here** — this
section is for information.

| Case | Test | Typed | Result |
|---|---|---|---|
| **C55688** — Finding an asset by its make on its own<br>https://shopview.testrail.io/index.php?/cases/view/55688 | [2990626](https://shopview.testrail.io/index.php?/tests/view/2990626) | `Freightliner` | **Passed** — all 20 vehicles listed are Freightliners, so the make is searched. |
| **C55689** — Finding an asset by its year on its own<br>https://shopview.testrail.io/index.php?/cases/view/55689 | [2990627](https://shopview.testrail.io/index.php?/tests/view/2990627) | `2019` | **Passed** — 19 of 20 are 2019 vehicles and the seeded one is on row 10. |

> ⚠️ **Read the "what counts as a failure" part of these two cases before re-running them.** Both were
> re-worded after the first run. The first wording said the seeded vehicle "should come back", and
> that is wrong: there are more Freightliners and more 2019 vehicles in this data than the group can
> list, so the seeded one may sit below the last row. **Its absence is not a failure.** What proves the
> search used the field is that the vehicles listed all share the make (or the year) you typed. The old
> version showed only three rows per group, so "my vehicle must appear" was never its behaviour either.

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

## 3 · One more case to run — expected to FAIL, already ticketed

This is the one thing the old search could do that this build still cannot. **It already has a
ticket, so if it fails, record the failure and raise nothing new.**

> ### ⚠️ C55692 has been RETIRED — do not look for it
> *"Finding a vendor by their website still works"* was deleted from TestRail on 16 September. It
> asserted something **the old version never did**: the old vendor search had no website field at all.
> The evidence behind it was a match on the vendor's **email** (`parts@kestrelsupply-zzt.com`), which
> contains the website text. Its ticket SV-10110 has been withdrawn. If you have it open in a tab from
> before, close it — there is nothing to run and nothing to report.

| Case | Type this | What happens today | Ticket |
|---|---|---|---|
| **C53601** — a catalogue part that is not in inventory can still be found<br>https://shopview.testrail.io/index.php?/cases/view/53601 | `ZZT-77-3300` | nothing comes back | [SV-10001](https://shopview.atlassian.net/browse/SV-10001) |

**Put the ticket number in your result comment** so the next reader does not re-investigate something
already raised. If either one *passes*, that means a fix shipped — say so, because the ticket can then
be closed.

> A control to run beside it, so a failure is never mistaken for missing data: search
> **`ZZT-88-4412`** — a part that IS in stock, which comes back. If the control also returns nothing,
> the test data is missing and the case is **Blocked**, not Failed.

---

## 4 · The one thing that will trip you up

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

## 5 · You can now see the OLD search for yourself

The same records were seeded into the **production test account** on 15 September 2026 —
`https://app.shopview.com`, workplace **Trucks Hill 2**. **Production runs the old search.** So if you
are ever unsure what the old version did, you can go and type it there rather than argue about it.

**This is the reference the whole suite is judged against** (Standing Rule 109: the shipped old product
is the specification). It was measured on 15 September and agreed with the suite on **13 of 13**
behaviours, including every phone format above.

**Two things to hold on to when you compare:**

1. The old version shows **three rows per group**. The new one shows far more. So a common word — a
   make, a year — will surface our record in the new version and may not in the old one, and **that is
   not a difference in what is searched.** It is a difference in how many rows are shown.
2. The old version's search box needs **at least two characters** before it matches anything.

---

## 6 · Before you start

Open global search and type **ZZAUTOTEST**. You should get several groups — Work orders, Customers,
Assets, Parts, Vendors, Part sales.

**If you get nothing at all, a new build has wiped the test data.** Stop and ask for it to be put back
— it is one command and takes about a minute. Do not create the records by hand.

**The data was checked live today and is complete** — 11 of 11 records present, every field matching.
So nothing returning at all means a fresh wipe, not a known gap.

---

## 7 · Recording results

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
| **1** | Run the six tests in §2 **and the one in §3**, and set a result on each, with the typed text and what came back on anything that is not a Passed. |
| **1a** | **Re-run anything already marked Failed for SV-10002, SV-10003, SV-10005, SV-10006 or SV-10058** — those behaviours were fixed in this build and should now pass. |
| **2** | Nothing else. The data is seeded and verified; the cases are corrected and verified; C55688 and C55689 are already run and Passed. |
