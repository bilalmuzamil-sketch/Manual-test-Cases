# TestRail parent-folder (group) links — per project

**Convention (QA lead, restated 2026-08-25):** the link points at the **PARENT FOLDER (group)** in
TestRail suite 1. **The test cases are NOT in that folder — they live in the sub-sections inside it.**
So any tool that counts or reads a project's cases must **walk the whole descendant subtree of
`group_id`**, never just the group itself. `group_id` is the parent group id. Suite is always
**1 ("Master")**, project **1**.

**All six links below were supplied by the QA lead on 2026-08-25 and VERIFIED LIVE the same day**
(read-only `get_sections` + `get_cases`, both paged). Verification evidence:
`build/build-verify-session-2026-08-21/parent-folder-verification.json` ·
`build/build-verify-session-2026-08-21/evidence/reconcile-summary.json` · tools alongside them.

| Project | group_id | Live section name | Sub-sections | Cases live (all ours) | C-ID range | Parent-folder link |
|---|---|---|---|---|---|---|
| **Digital Inspections V2** | **6658** | `Digital Inspection V2 (Aug 2026)` | 6 | **43** | 44506–44548 | https://shopview.testrail.io/index.php?/suites/view/1&group_by=cases:section_id&group_order=asc&display=compact&display_deleted_cases=0&group_id=6658 |
| **Global Search V2** | **6720** | `Global Search V2 (Aug 2026)` | 20 | **97** | 44804–44900 | https://shopview.testrail.io/index.php?/suites/view/1&group_by=cases:section_id&group_order=asc&display=compact&display_deleted_cases=0&group_id=6720 |
| **Simple Flow V2** | **6665** | `Simple Flow V2 (Aug 2026)` | 12 | **61** | 44549–44609 | https://shopview.testrail.io/index.php?/suites/view/1&group_by=cases:section_id&group_order=asc&display=compact&display_deleted_cases=0&group_id=6665 |
| **Invoice Refresh** (Invoice UI Refresh) | **6559** | `Invoice Refresh (Aug 2026)` | 14 | **87** | 44901–44987 | https://shopview.testrail.io/index.php?/suites/view/1&group_by=cases:section_id&group_order=asc&display=compact&display_deleted_cases=0&group_id=6559 |
| **Inline Add and Edit Parts** | **6597** | `Inline Add and Edit Parts (Aug 2026)` | 6 | **96** | 44988–45083 | https://shopview.testrail.io/index.php?/suites/view/1&group_by=cases:section_id&group_order=asc&display=compact&display_deleted_cases=0&group_id=6597 |
| **Printer Friendly Work Orders** | **6617** | `Printer Friendly WO (Aug 2026)` | 6 | **44** | 45084–45127 | https://shopview.testrail.io/index.php?/suites/view/1&group_by=cases:section_id&group_order=asc&display=compact&display_deleted_cases=0&group_id=6617 |
| **TOTAL** | | | **64** | **428** | 44506–45127 | |

**Every one of the 428 is ours** (`created_by = 3`) — **0 foreign cases** and **0 flagged Automated**
(`custom_atmstatus = 3`) in any of the six groups, so **no Rule 38 exclusion and no Rule 71 ask-first
gate applies to these suites today.** Every one carries the marker
`AUTOMATION: Not available on Build to test Yet` — 43 / 97 / 61 / 87 / 96 / 44, summing to 428, which
gates the total both ways (Rule 50).

---

## 🔴 CORRECTION — 2026-08-25: the previous closing line of this file was WRONG

**Superseded text, kept visible and dated rather than deleted** (the Rules 32/33 pattern, so nobody
re-derives it):

> *"All six suites above are authored (nothing pushed to TestRail by us; C-IDs blank until the QA lead
> imports)."*

**That is FALSE as of 2026-08-25.** All **428 cases are LIVE in TestRail** with C-IDs in the range
**44506–45127**, verified by a paged read of the estate (681 sections / 4,522 cases) walking each
group's full descendant subtree.

**What was actually true — and it is a different, narrower fact:** the **LOCAL `testrail-id-map.csv`
files still carry a BLANK `testrail_case_id` column — 0 of 428 populated in all six.** So the cases
exist in TestRail while **our local maps cannot name their C-IDs.** That is the known `gen_import.py`
behaviour (core §3.6: the generator blanks the C-id column and drops `refs` on every rerun, and both
must be **re-merged from live** afterwards) — the re-merge has **not been run** for these six.

**Why the distinction matters:** "not pushed" would mean there is nothing to verify; "pushed but
unmapped" means the cases are verifiable and only our own bookkeeping is behind. **A blank column in
our CSV is not evidence about TestRail's contents** — the same class of error as trusting `updated_on`
(core §2.5). The lesson: **read the live estate before making a claim about it.**
