# AUTOMATED CASES CHANGED — FOR VLAD — Schedule, 2026-08-11

**Standing Rule 65.** Any change to a case TestRail flags as Automated — an **update** as much as a
deletion — has to be reported so the automation engineer can adjust his automation. The section is
written every time a pass writes to cases, and it says "none" when the answer is none, because
omitting it costs the reader the ability to tell **clear** from **we forgot to look**.

---

# **None.**

**No case this pass touched is flagged Automated in TestRail.**

| Case | `custom_atmstatus` at write time | Meaning |
|---|---|---|
| **[C43582](https://shopview.testrail.io/index.php?/cases/view/43582)** | **1** | Not Automated |
| **[C43583](https://shopview.testrail.io/index.php?/cases/view/43583)** | **1** | Not Automated |
| **[C43584](https://shopview.testrail.io/index.php?/cases/view/43584)** | **1** | Not Automated |
| **[C43585](https://shopview.testrail.io/index.php?/cases/view/43585)** | **1** | Not Automated |
| **[C43586](https://shopview.testrail.io/index.php?/cases/view/43586)** | **1** | Not Automated |
| **[C43587](https://shopview.testrail.io/index.php?/cases/view/43587)** | **1** | Not Automated |
| **[C29998](https://shopview.testrail.io/index.php?/cases/view/29998)** | **1** | Not Automated |
| **[C38866](https://shopview.testrail.io/index.php?/cases/view/38866)** | **1** | Not Automated |
| **[C43588](https://shopview.testrail.io/index.php?/cases/view/43588)** — created | **1** | Not Automated, read back live after creation |
| **[C43589](https://shopview.testrail.io/index.php?/cases/view/43589)** — created | **1** | Not Automated, read back live after creation |

**So there is nothing for Vlad to adjust from this pass, either way.**

---

## The two things that make that answer trustworthy rather than merely convenient

**1. The value was captured AT WRITE TIME, not read from a document afterwards.** The flag moves
**both ways** — C29600 on another project went `1 → 3 → 1 → 3`, and C38877 went `3 → 1 → 3` — so a
value read yesterday, or read from the staged pack, is not evidence about the value at the moment of
the write. It came out of the same `get_case` snapshot the Rule-50 byte-check already takes, so it
cost nothing.

**2. The marker meant here is TestRail's OWN field `custom_atmstatus`, NOT our `AUTOMATION:` text
marker.** The two disagree, and the field is the one that answers the question (Rule 64, settled
2026-08-11). All ten cases carry the text marker `AUTOMATION: READY`; **that is our own note about
automatability and says nothing about whether anyone has automated them.** Reporting them to Vlad on
the strength of the text marker would pad the list and cost it credibility on the first reading.

---

## Context, so "none" is not read as an accident

**The whole Schedule suite reads `custom_atmstatus = 1`: 174 of 174 before this pass, 176 of 176
after.** That is not luck — it is the state left by the 2026-08-11 correction pass
(`build/automated-flag-and-c30041-2026-08-11/`), which set **31 Schedule cases from `3 → 1`** after
establishing from `get_history_for_case` that **nobody ever set them**: they came from our own
`add_case` tooling hardcoding `3` at creation, so they were never evidence that anything was
automated. Every case with a real `custom_atmstatus` history event across the three projects was set
by **user 1, Vladimir Tomovic**; the 31 Schedule ones had no such event at all.

**The two cases created today were born `1`**, from the canonical helper
`build/testing-tools/testrail_add_case.py`, which defaults to `1` and **raises** if a caller passes
`3`. The guard `build/testing-tools/check_add_case_payloads.py` was run before the push and **exited
0**. So this pass did not reintroduce the defect it inherited.

**Consequence for the tell-Vlad duty going forward on Schedule:** while the suite stays at `1`
throughout, a Schedule pass's Rule-65 section will legitimately read "none" every time. **That is
only true while it stays that way** — if Vlad marks Schedule cases Automated, the next pass that
edits one of them owes him a real entry, and it must be read off the field at write time rather than
assumed from this file.
