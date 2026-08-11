# For Vlad — every test case we changed or deleted, 2026-08-11

**Forwarded by the QA lead so the automation can be adjusted.** One row per case, with what changed in
plain words and whether it changes what an automated check would conclude.

---

## ⚠️ Read this first — it is the short version

**Nothing in this list changes what any automated check should conclude. Not one case.**

- **No test was deleted.** One deletion was considered — [C30041](https://shopview.testrail.io/index.php?/cases/view/30041) — and **it was not carried out**.
- **No test's wording changed.** No title, no preconditions, no steps, no expected result, no
  references. **Not a single character of any test's content was altered today.**
- **The only thing that changed is a tick-box called "Automation status", on 31 tests that Vlad has
  never automated** — and it was **our own mistake** that put it there.

**If you are short of time, you can stop here. Nothing below needs an automation change.**

---

## 1. Cases that affect what an automated check would conclude

**None.**

---

## 2. Cases changed — Automation status corrected only (31 cases, all in Schedule)

### What happened, in plain words

When we create a test case through TestRail's API, our script fills in every field. One of those
fields is **"Automation status"**, and our script had been filling it in as **"Automated"** — on
every case it created, automatically, since the beginning. **That was wrong.** "Automated" is Vlad's
tick-box: it should say Automated only when he has actually automated the test.

**So 31 Schedule tests were sitting in TestRail claiming to be automated when nobody had automated
them.** They now correctly say **"Not Automated"**.

### What this means for the automation

**Nothing.** These 31 were never in Vlad's automation suite — that is the whole point, the tick-box
was wrong. **The test content is untouched**: same title, same steps, same expected result, same
references. If a script does happen to cover one of these, **it will behave exactly as it did
yesterday.**

The one real benefit is going forward: from now on the "Automated" tick-box in TestRail means what it
says, so **a list of "the automated tests" is finally trustworthy.**

| Case | Title | What changed | Changes what an automated check concludes? |
|---|---|---|---|
| [C30614](https://shopview.testrail.io/index.php?/cases/view/30614) | With Work Orders: View OFF, work order details on  | Automation status set to **Not Automated** (it should never have said Automated) | **No** |
| [C30615](https://shopview.testrail.io/index.php?/cases/view/30615) | An event's hours count toward the capacity bar but | Automation status set to **Not Automated** (it should never have said Automated) | **No** |
| [C38847](https://shopview.testrail.io/index.php?/cases/view/38847) | Business-hours toggle reveals a per-day (Mon-Sun)  | Automation status set to **Not Automated** (it should never have said Automated) | **No** |
| [C38848](https://shopview.testrail.io/index.php?/cases/view/38848) | Edit Staff has a 'Set custom hours for this techni | Automation status set to **Not Automated** (it should never have said Automated) | **No** |
| [C38849](https://shopview.testrail.io/index.php?/cases/view/38849) | A technician with no custom hours inherits the sho | Automation status set to **Not Automated** (it should never have said Automated) | **No** |
| [C38850](https://shopview.testrail.io/index.php?/cases/view/38850) | 'Add hours' appends a removable second range for s | Automation status set to **Not Automated** (it should never have said Automated) | **No** |
| [C38851](https://shopview.testrail.io/index.php?/cases/view/38851) | Overlapping hour ranges block Save; incomplete row | Automation status set to **Not Automated** (it should never have said Automated) | **No** |
| [C38855](https://shopview.testrail.io/index.php?/cases/view/38855) | 'New Work Order' in the cell menu points the user  | Automation status set to **Not Automated** (it should never have said Automated) | **No** |
| [C38863](https://shopview.testrail.io/index.php?/cases/view/38863) | Spread past 8 weeks asks to confirm; a series can  | Automation status set to **Not Automated** (it should never have said Automated) | **No** |
| [C38864](https://shopview.testrail.io/index.php?/cases/view/38864) | Schedule actions save immediately - Undo reverses  | Automation status set to **Not Automated** (it should never have said Automated) | **No** |
| [C38865](https://shopview.testrail.io/index.php?/cases/view/38865) | A multi-week series keeps the same local start tim | Automation status set to **Not Automated** (it should never have said Automated) | **No** |
| [C38866](https://shopview.testrail.io/index.php?/cases/view/38866) | Schedule and all its dialogs display correctly in  | Automation status set to **Not Automated** (it should never have said Automated) | **No** |
| [C38867](https://shopview.testrail.io/index.php?/cases/view/38867) | Shifts and events created before the Schedule rewr | Automation status set to **Not Automated** (it should never have said Automated) | **No** |
| [C38868](https://shopview.testrail.io/index.php?/cases/view/38868) | Dashboard shows one schedule row per work order ev | Automation status set to **Not Automated** (it should never have said Automated) | **No** |
| [C38869](https://shopview.testrail.io/index.php?/cases/view/38869) | A work order created with an appointment shows up  | Automation status set to **Not Automated** (it should never have said Automated) | **No** |
| [C38870](https://shopview.testrail.io/index.php?/cases/view/38870) | A multi-location technician's shift appears only o | Automation status set to **Not Automated** (it should never have said Automated) | **No** |
| [C38871](https://shopview.testrail.io/index.php?/cases/view/38871) | Work order form offers a Priority (High/Medium/Low | Automation status set to **Not Automated** (it should never have said Automated) | **No** |
| [C38872](https://shopview.testrail.io/index.php?/cases/view/38872) | API - Schedule reads need View; writes need Edit;  | Automation status set to **Not Automated** (it should never have said Automated) | **No** |
| [C38873](https://shopview.testrail.io/index.php?/cases/view/38873) | API - Series past 8 weeks returns 409 until acknow | Automation status set to **Not Automated** (it should never have said Automated) | **No** |
| [C38874](https://shopview.testrail.io/index.php?/cases/view/38874) | API - No pricing fields in Schedule responses; WO  | Automation status set to **Not Automated** (it should never have said Automated) | **No** |
| [C38875](https://shopview.testrail.io/index.php?/cases/view/38875) | API - A shift from another location returns 404, n | Automation status set to **Not Automated** (it should never have said Automated) | **No** |
| [C38926](https://shopview.testrail.io/index.php?/cases/view/38926) | Default roles start at the Schedule level the spec | Automation status set to **Not Automated** (it should never have said Automated) | **No** |
| [C43554](https://shopview.testrail.io/index.php?/cases/view/43554) | Schedule opens on Day view the first time you open | Automation status set to **Not Automated** (it should never have said Automated) | **No** |
| [C43555](https://shopview.testrail.io/index.php?/cases/view/43555) | Month view: dragging a work order onto a day creat | Automation status set to **Not Automated** (it should never have said Automated) | **No** |
| [C43556](https://shopview.testrail.io/index.php?/cases/view/43556) | Week view: a shift that is part of a repeating ser | Automation status set to **Not Automated** (it should never have said Automated) | **No** |
| [C43582](https://shopview.testrail.io/index.php?/cases/view/43582) | Panel button sits left of Today and its tooltip na | Automation status set to **Not Automated** (it should never have said Automated) | **No** |
| [C43583](https://shopview.testrail.io/index.php?/cases/view/43583) | Panel button hides the left panel and the grid wid | Automation status set to **Not Automated** (it should never have said Automated) | **No** |
| [C43584](https://shopview.testrail.io/index.php?/cases/view/43584) | What you had set up in the left panel survives hid | Automation status set to **Not Automated** (it should never have said Automated) | **No** |
| [C43585](https://shopview.testrail.io/index.php?/cases/view/43585) | On a narrow window the panel button still works an | Automation status set to **Not Automated** (it should never have said Automated) | **No** |
| [C43586](https://shopview.testrail.io/index.php?/cases/view/43586) | Menus and pop-up windows reposition when the left  | Automation status set to **Not Automated** (it should never have said Automated) | **No** |
| [C43587](https://shopview.testrail.io/index.php?/cases/view/43587) | Hiding the panel lasts for the rest of your sign-i | Automation status set to **Not Automated** (it should never have said Automated) | **No** |

### Cases we did **not** touch

**The 44 cases Vlad marked Automated himself are untouched** — 40 in the Report Suite and 4 in
Filters. We checked TestRail's own change history for every single one before touching anything, and
every one of those 44 shows Vlad's name against the tick-box. **We only corrected cases where the
history shows nobody ever set it — meaning it came from our script.**

---

## 3. Cases deleted

**None.**

### The one that was considered, and why it was kept

**[C30041](https://shopview.testrail.io/index.php?/cases/view/30041)** — *"Toolbar search highlights matching blocks and fades non-matching ones"*.

**The background in plain words.** The Schedule requirements document used to say that when you search
the schedule, shifts that do not match **fade out but stay on the grid**. On 6 August that sentence was
**deleted** from the document, because the design shows non-matching shifts **disappearing** instead.
The test still describes the fading, so it looked like a test for a requirement that no longer exists —
and the instruction was that such a test should be deleted.

**Why it was not deleted.** Two reasons, both checked live today:

1. **The requirement is still there in the Jira story.** **SV-8686** still says, word for word,
   *"Non-matching blocks fade; matching blocks highlight"* — in both its Requirements and its
   Acceptance Criteria. The sentence left the requirements document but **not** the story. So the
   requirement has not really been withdrawn; **two of our own documents now disagree with each
   other**, and that needs the product owner to settle it.
2. **Part of the test was never affected anyway.** The test also checks that the search matches on
   **customer name, work order number, unit number, technician name and line name** — and that is
   still in the live requirements document, word for word.

**So the test stays as it is for now.** Once the product owner confirms whether non-matching shifts
should fade or disappear, the test will be corrected to match — and **that change will be reported
here**, because it will genuinely change what a check should expect.

**For automation in the meantime:** this test is **not** marked Automated, and **nothing about it has
changed today.**

---

## 4. Anything else Vlad should know

- **A Jira ticket, SV-8874**, was raised about this same search behaviour and has since been closed.
  We checked every one of our 781 test cases across Filters, Schedule and the Report Suite: **no test
  refers to it any more**, so there is nothing pointing at a closed ticket.
- **Three test runs were checked before and after this work — run 352 (Filters), run 357 (Schedule)
  and run 359 (Report Suite).** All three are **completely unchanged**: same tests, same results, same
  counts, nothing added, nothing lost.

---

## 5. Where our judgement could be wrong

We have **never seen Vlad's automation scripts**, so *"this changes nothing for automation"* is our
reading of the test text, not of his code. **It is a strong reading in this case** — no test content
changed at all, only a tick-box — but if any script reads the **Automation status** field itself to
decide which tests to run, **those 31 Schedule tests will now be excluded from that list, correctly.**
That is the one place a script could notice today's change, and it is worth a glance.
