# Report Suite — questions for Chris Ward, round 2
### Raised 2026-08-05, after reading all six specifications live

**Every row names the project and the report** (Standing Rule 55 — Chris owns both the Report Suite and
Fees & Discounts, so "the date filter" on its own is ambiguous). **Plain words only, no test IDs, no
technical terms** (Rule 7). The QA-only mapping is in §9 and is not part of what Chris reads.

**Why round 2 exists:** Chris updated **Sales By Customer** and **Parts Velocity** on 2026-08-05, applying
our earlier review workbook. That is very welcome and it settled several things. It also left the six
reports describing the same behaviour in two different ways, and two documents now disagree with
themselves. These are the leftovers.

---

## Q1 · Report Suite — ALL SIX REPORTS · the Location column: who sees it, and can they switch it off?

**What happens now.** Your updated Sales By Customer description says the Location column is for anyone
who can reach more than one branch, that they see it straight away, and that **they can switch it off in
the column list**. The other five reports' descriptions say the opposite: the column **appears and
disappears on its own** depending on how many branches are being looked at, and **is never in the column
list at all**.

**The question.** Which one is right for the whole suite?

- **A** — Anyone who can reach more than one branch sees the column, and can switch it off in the column list. (What Sales By Customer now says.)
- **B** — The column appears on its own only while more than one branch is being looked at, and is never in the column list. (What the other five say.)
- **C** — Something else — please describe it.

**Your answer:** ______

---

## Q2 · Report Suite — SALES BY CUSTOMER · your document disagrees with itself about the column list

**What happens now.** One part of the Sales By Customer description says the Location column can be
switched on and off in the column list. Another part lists the switches in that list and says there are
**exactly nine**, and Location is **not one of them**.

**The question.** Which should the tester expect to see in the column list?

- **A** — Nine switches, no Location.
- **B** — Ten switches, including Location.

**Your answer:** ______

---

## Q3 · Report Suite — PARTS VELOCITY and TECHNICIAN UTILIZATION · where does the branch line go in a download?

**What happens now.** For Sales By Representative your description says exactly where the line naming the
branches sits: in the header area of a PDF, and as one of the short summary lines above the column
headings in a spreadsheet. Parts Velocity and Technician Utilization do not say.

**The question.** Should those two reports put it in the same places?

- **A** — Yes, the same as Sales By Representative.
- **B** — No — please say where.

**Your answer:** ______

---

## Q4 · Report Suite — ALL SIX REPORTS · is there anything on screen that tells you which branches you are looking at?

**What happens now.** Our tests told the tester to look for something on the page naming the branches
currently being shown. **We checked all six of your descriptions and none of them mentions such a thing.**
We have removed it from the tests rather than leave the tester hunting for something that may not be
meant to exist.

**The question.** Should there be one?

- **A** — No, nothing beyond the branch chooser itself.
- **B** — Yes — please say what it should say and where it should sit.

**Your answer:** ______

---

## Q5 · Report Suite — SALES BY CUSTOMER · the date list no longer has Today or Yesterday, but the file names still do

**What happens now.** Your update changed the date list to nine choices and removed **Today** and
**Yesterday**. Another part of the same description still explains what the downloaded file should be
called for a **Today** range and a **Yesterday** range.

**The question.** Can that leftover be removed, or are Today and Yesterday still meant to exist somewhere?

- **A** — Remove the leftover; Today and Yesterday are gone.
- **B** — They are still meant to exist — please say where.

**Your answer:** ______

---

## Q6 · Report Suite — TECHNICIAN UTILIZATION · what should the column button say for a screen reader?

**What happens now.** Your description says hovering the column button shows the words "Column Selection".
It does not say what a screen reader should read out for it.

**The question.** Should the screen reader read the same words, "Column Selection"?

- **A** — Yes, the same words.
- **B** — Something else — please say what.

**Your answer:** ______

---

## Q7 · Report Suite — TECHNICIAN UTILIZATION · are there meant to be two spreadsheet downloads?

**What happens now.** We wrote a test for two different spreadsheet downloads on this report. The build
offers only one, and your description does not mention a second.

**The question.** Should there be two?

- **A** — No, one spreadsheet is correct — we will delete the test.
- **B** — Yes, two — please say what each should contain.

**Your answer:** ______

---

## 8 · One thing we did NOT ask, because you already answered it

Your Sales By Customer update settled the logo rule: the ShopView logo stands in **only when a logo has
been uploaded but will not load**, and when no logo has been uploaded at all **no logo is printed** and
the text fills the space. That is exactly what four of our tests already expected, and we have re-pointed
them at your description instead of at your earlier message. **Nothing needed from you here.**

---

## 9 · QA-ONLY — question to case mapping (not part of what Chris reads)

| Q | Cases blocked | C-ids |
|---|---|---|
| Q1 | 13 Location cases + SBC-LOC-04 | C30352, C38914, C30401, C30437, C38915, C30467, C30511, C38916, C30551, C30554, C30588, C38917, C38913, C38912 |
| Q2 | SBC-COL-01, SBC-LOC-04 | C30156, C38912 |
| Q3 | PV-EXP-02, TU-EXP-04 | C30376, C30437 |
| Q4 | 6 cases repaired by removal | C30111, C30215, C30337, C30443, C30503, C30575 |
| Q5 | SBC-EXP-02 | C30160 |
| Q6 | TU-COL-01 | C38859 |
| Q7 | TU-EXP-10 | C43552 |

Links: `https://shopview.testrail.io/index.php?/cases/view/<id>`
