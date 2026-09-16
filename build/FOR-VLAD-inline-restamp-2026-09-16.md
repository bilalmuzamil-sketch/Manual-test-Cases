# For Vlad — Automated Inline cases re-stamped during build verification (2026-09-16)

**Rule 65 notice.** During the full build-verification of **Inline Add and Edit Parts (section 6597)**
against **staging build `v26.36.7-20cfff7`** on **2026-09-16**, the build-check stamp (the "Last checked
against build … on …" line at the end of Expected Results) was refreshed on every case in the suite.
That refresh touched **9 cases that TestRail flags as Automated** (`custom_atmstatus = 3`). All are ours
(`created_by = 3`); all were re-stamped under the QA lead's standing go-ahead for these specific
Automated cases (recorded across the 2026-09-01 / 09-08 / 09-09 passes and their prior Rule-65 notices).

**What changed on those 9 cases:** ONLY the build-stamp text — from
`v26.36.0-f43b2fd on 9/9/2026` (or `v26.36.2-617d8d1 on 9/10/2026`) to
**`v26.36.7-20cfff7 on 9/16/2026`**. No steps, preconditions, expected behaviour, automation type,
section, or the Automated flag itself were changed.

| C-id | Link | Title (short) |
|---|---|---|
| C45005 | https://shopview.testrail.io/index.php?/cases/view/45005 | Saving adds the part at the top of the list |
| C45026 | https://shopview.testrail.io/index.php?/cases/view/45026 | Saving an edit updates the part line in place |
| C45223 | https://shopview.testrail.io/index.php?/cases/view/45223 | Selecting a part auto-allocates the full quantity |
| C45224 | https://shopview.testrail.io/index.php?/cases/view/45224 | Allocation is shown below the row as a Pulled-from line |
| C45227 | https://shopview.testrail.io/index.php?/cases/view/45227 | Choosing a bin from the picker moves the full quantity |
| C45237 | https://shopview.testrail.io/index.php?/cases/view/45237 | Allocation is stored on save and not shown on the row |
| C45252 | https://shopview.testrail.io/index.php?/cases/view/45252 | Add Part calculates the Sell Price from the cost matrix |
| C45253 | https://shopview.testrail.io/index.php?/cases/view/45253 | Changing the part category recalculates the Sell Price |
| C45254 | https://shopview.testrail.io/index.php?/cases/view/45254 | Add Part: cannot enter a custom Cost for an inventory part |

Vladimir Tomovic's 11 Inline cases (`created_by = 1`) were **not touched** at all (Rule 38).
