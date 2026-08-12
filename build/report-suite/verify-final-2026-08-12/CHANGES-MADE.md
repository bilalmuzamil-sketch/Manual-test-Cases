# CHANGES MADE — none

**This pass changed no test case.** It was stood down at the 5-hour usage limit before its write
phase began, with the QA lead directing the remaining budget to Schedule.

Three changes were **prepared and NOT executed**. They are specified exactly in `RESUME.md` §4 so a
fresh worker can apply them without re-deriving anything, and each is justified in `DIVERGENCES.md`.

| Case | Report | Change prepared | Why |
|---|---|---|---|
| [C30107](https://shopview.testrail.io/index.php?/cases/view/30107) | Sales By Customer (**final**) | `AUTOMATION: READY` → `HOLD`, plus a "mark BLOCKED, not failed" line | Its steps use a `Product Type` multi-select that the specification requires and the build does not yet have (SV-9074, Ready to Fix) |
| [C43591](https://shopview.testrail.io/index.php?/cases/view/43591) | Sales By Customer (**final**) | same | same |
| [C38913](https://shopview.testrail.io/index.php?/cases/view/38913) | Sales By Representative | `AUTOMATION: READY` → `HOLD` | It asserts a toggleable Location column that five of six reports do not offer. Its two siblings (C38912, C43551) already carry exactly this hold; this one was inconsistent with them |

**Deliberately NOT changed, and this is the important half:**

- **The steps of C30107 and C43591 were not rewritten to match the build.** They are correct against
  the specification as amended on 10 August. Rewriting them would have deleted our only coverage of a
  requirement two days old and turned a real gap into a passing test.
- **No `EXPECT FAIL` marker was changed on the strength of a ticket status**, even though 57 of the
  60 tickets they point at were closed in a two-minute sweep on 9 August. A closed ticket is not
  evidence about the build — and one of those closed tickets demonstrably still reproduces.
- **The four Work In Progress tab names were not "corrected."** They read as title case to a tester;
  our cases already say so.
