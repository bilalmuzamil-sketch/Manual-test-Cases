# Handoff — three corrected cases need running again

**For:** the session running the test pass on run 415.
**From:** the main session, 15 September 2026.
**Why you are getting this:** three cases in run 415 were corrected today **after** they were marked
Passed. The steps now ask the tester to type things the old steps never asked for, so the Passed
results are stale. Nothing else in the run is affected.

**Run 415:** https://shopview.testrail.io/index.php?/runs/view/415
Branch `sv9160`, build `v26.36.4-7869ff2`.

---

## The three, and exactly what changed

| Case | Its test in run 415 | Status now | What changed, and what is newly typed |
|---|---|---|---|
| **C55670** — Finding a customer or vendor by a contact's name or phone number<br>https://shopview.testrail.io/index.php?/cases/view/55670 | [test 2980692](https://shopview.testrail.io/index.php?/tests/view/2980692) | Passed (stale) | **Steps 6–9 are new.** Types the contact's OWN number `419-555-0177`, then only the last part of it, `555-0177`. Both were findable in the old version. The case now also says plainly **not** to type it as plain digits or with brackets — the old version found neither, so those are not pass conditions. |
| **C53579** — A work order number with the shop number in front still finds it<br>https://shopview.testrail.io/index.php?/cases/view/53579 | [test 2959356](https://shopview.testrail.io/index.php?/tests/view/2959356) | Passed (stale) | Steps rewritten to search **five** real forms of the number, not one. You note a real job number and your own shop number first, then search all five shapes. The examples in the case show the SHAPE — use your own values. |
| **C53604** — Finding a customer or vendor by address line 2<br>https://shopview.testrail.io/index.php?/cases/view/53604 | [test 2959370](https://shopview.testrail.io/index.php?/tests/view/2959370) | Passed (stale) | Step 4 now names the actual value to type — `Bay 12C` — instead of saying "the second address line". It also warns that address line 2 is empty on most real records, so an empty field proves nothing and is not a pass. |

---

## Before you start

Open global search and type **ZZAUTOTEST**. You should get several groups of results — Work orders,
Customers, Assets, Parts, Vendors, Part sales.

**If you get nothing at all, a new build has wiped the test data.** Stop and ask for it to be put
back — it is one command and takes about a minute. Do not create the records by hand; a test that
passes against the wrong data is worse than one that fails.

**The data was checked live today and is complete** — 11 of 11 records present, every declared field
matching. So if ZZAUTOTEST returns nothing, that is a new wipe, not a known gap.

---

## How to record the results

Set a result on each of the three tests above. Normal rules — nothing special about these.

* **Passed** — every search in the case returned what the Expected Results say.
* **Failed** — a search returned nothing, or the wrong record. Put **the exact text you typed** and
  **what came back** in the comment. That is the whole value of the result.
* **Blocked** — you could not run it (data missing, branch down, cannot reach the screen). Say which.

**Do not pass a case because most of its searches worked.** C55670 and C53579 each make several
searches now, and one of them failing is a failing case — say which one.

**If C55670's steps 8 finds nothing** (`555-0177`, the part of the number): that is a real loss
against the old version, and it is the **same family** as the already-open SV-10057, which is about
part of a phone number not being found. Record it as Failed against this case and say it looks like
the same underlying problem — do not raise a new ticket.

---

## What is NOT in this handoff

Three coverage gaps are open and **no case exists for them yet**, so there is nothing for you to run:

* a customer found by only PART of its phone number;
* an asset found by its MAKE alone (`Freightliner`);
* an asset found by its YEAR alone (`2019`).

Who authors them is with the QA lead. Full working:
`build/global-search/scenario-coverage-2026-09-15/VERDICT-on-the-four-claimed-gaps.md`.

---

## OUTSTANDING — what I need from you

| # | What I need |
|---|---|
| **1** | Run the three tests above and set a result on each, with the typed text and what came back on anything that is not a Passed. |
| **2** | Nothing else. The data is seeded and verified; the cases are corrected and verified. |
