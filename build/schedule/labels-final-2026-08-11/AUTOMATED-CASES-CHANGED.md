# AUTOMATED CASES CHANGED — FOR VLAD — Schedule labels-final, 2026-08-11

**Standing Rule 65.** Any change to a case TestRail flags as Automated — an **update** as much as a
deletion — has to be reported so the automation engineer can adjust his automation. The section is
written every time a pass writes to cases, and it says "none" when the answer is none, because
omitting it costs the reader the ability to tell **clear** from **we forgot to look**.

---

# **None.**

**No case this pass touched is flagged Automated in TestRail.**

| Case | `custom_atmstatus` at write time | After the write | Meaning |
|---|---|---|---|
| [C30042](https://shopview.testrail.io/index.php?/cases/view/30042) | **1** | 1 | Not Automated |
| [C30046](https://shopview.testrail.io/index.php?/cases/view/30046) | **1** | 1 | Not Automated |
| [C30047](https://shopview.testrail.io/index.php?/cases/view/30047) | **1** | 1 | Not Automated |
| [C30050](https://shopview.testrail.io/index.php?/cases/view/30050) | **1** | 1 | Not Automated |
| [C30051](https://shopview.testrail.io/index.php?/cases/view/30051) | **1** | 1 | Not Automated |
| [C29930](https://shopview.testrail.io/index.php?/cases/view/29930) | **1** | 1 | Not Automated |
| [C30043](https://shopview.testrail.io/index.php?/cases/view/30043) | **1** | 1 | Not Automated |
| [C30044](https://shopview.testrail.io/index.php?/cases/view/30044) | **1** | 1 | Not Automated |
| [C30045](https://shopview.testrail.io/index.php?/cases/view/30045) | **1** | 1 | Not Automated |
| [C30082](https://shopview.testrail.io/index.php?/cases/view/30082) | **1** | 1 | Not Automated |
| [C30025](https://shopview.testrail.io/index.php?/cases/view/30025) | **1** | 1 | Not Automated |
| [C30015](https://shopview.testrail.io/index.php?/cases/view/30015) | **1** | 1 | Not Automated |

**So there is nothing for Vlad to adjust from this pass, either way.**

---

## Two things that make that answer trustworthy rather than merely convenient

**1. The value was captured AT WRITE TIME, not read from a document afterwards.** It came out of the
same `get_case` snapshot the Rule-50 byte-check already takes (`snapshots/PRE-C*.json`), so it cost
nothing. This matters because **the flag moves both ways** — C29600 on another project went
`1 → 3 → 1 → 3` — so a value read yesterday, or read from a staged pack, is not evidence about the
value at the moment of the write.

**2. The marker meant here is TestRail's OWN field `custom_atmstatus`, NOT our `AUTOMATION:` text
marker.** The two disagree, and the field is the one that answers the question. **Ten of these twelve
carry the text marker `AUTOMATION: READY` while their `custom_atmstatus` is `1` (Not Automated)** —
which is exactly the disagreement to expect: our text marker asserts *automatable*, TestRail's field
records *automated*.

## And a note on what a label change would have meant if any HAD been automated

Every one of these 12 edits changes **strings a test would assert or select on** — `View options`,
`Filter & display`, `VIN Number`, `Capacity Planning`, `Show Saturday`, `Show Sunday`. **On an
automated case that is precisely the kind of change that silently breaks a selector**, which is why
Rule 65 exists. **It happens that none of the twelve is automated** — but the answer was measured,
not assumed.
