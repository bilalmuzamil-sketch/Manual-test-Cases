# DEFECTS WITH NO IDENTIFIABLE SOURCE — for the QA lead to decide

QA lead's ruling: *"Any ticket which do not have any source you need to give them to me."* A defect whose
expected behaviour cannot be traced to the PRD, a story in the epic, or a verified answer from Chris Ward
is **not filed**. It comes here.

## STATUS: **3 items, none filed**

---

## 1 · Sales By Customer — the Location column is not sortable, and it may not be meant to be

**What we saw.** Every column heading sorts except two: the little arrow column at the far left, which is
correct, and **Location**, which has no sort arrow and does not respond.

**Why this one is NOT in the "no source" bucket, and is filed.** `S10-R1` says "Every column is sortable
except the chevron column", which covers it plainly. **Filed as
[SV-8963](https://shopview.atlassian.net/browse/SV-8963).** Listed here only so the record shows it was
considered against this test and passed it.

---

## 2 · Sales By Customer — the totals line vanishes when nothing matches

**What we saw.** Narrow the report until nothing matches and there is **no totals line at all** — not a
line of zeros. The same in a downloaded spreadsheet: headings and nothing else.

**Why it is NOT filed.** **No requirement says what the totals line should do when nothing matches.** Two
of our own tests claimed "a totals row of zeros"; that claim came from us, not from any document, and it
has been taken out (Rule 42/57). The underlying data is there — the server returns zero totals — so the
report *could* show a zeros line if that is what is wanted.

**What we need.** Chris's answer to Q2 in `QUESTIONS-FOR-CHRIS.md`. If he says a zeros line should show,
this becomes a filed defect immediately.

**Affected cases:** [C30114](https://shopview.testrail.io/index.php?/cases/view/30114) ·
[C30173](https://shopview.testrail.io/index.php?/cases/view/30173)

---

## 3 · Sales By Customer sits under a "SALES" heading, not under "Performance"

**What we saw.** Sales By Customer is on its own under a **SALES** heading. Parts Velocity and Inventory
Value are under **PARTS**. Only Work In Progress, Technician Utilization and Sales By Representative are
under **PERFORMANCE**.

**Why it is NOT filed.** **The specification is silent on the heading.** `S1-R1` says only that the report
"appears in the Reports left-side navigation" — which it does. Our test's "Performance group" claim traced
to a walkthrough video of 30 July, and the specification has been revised twice since without ever naming
a group. **Filing this would mean asserting a requirement no current document contains** (Rule 57).

**What we need.** Chris's answer to Q1.

**Affected case:** [C30096](https://shopview.testrail.io/index.php?/cases/view/30096) — repaired to assert
only what the specification asserts, with a note telling the tester to record the heading and not fail on
it.

---

## 4 · The PDF heading joins its two dates with the wrong kind of dash

**What we saw.** The Sales By Customer PDF heading reads *"Date Range: Aug 1, 2026 – Aug 7, 2026"* using an
**en dash (U+2013)**. `S15-R11` asks for the dates to be "joined by an **em dash**" and gives an em-dash
example.

**Why it is NOT filed.** It **is** sourced, and it **is** a difference — but it is a single wrong character
on a line that already carries a **real** fault (the end date is a day late, which is
[SV-8937](https://shopview.atlassian.net/browse/SV-8937)). Filing a second ticket for the dash on the same
line would be noise, and quietly folding it into someone else's ticket is not ours to do.

**What we need.** A one-word ruling: fold it into SV-8937, file it separately, or drop it. Our
recommendation is to **fold it into SV-8937** when that ticket is next touched.
