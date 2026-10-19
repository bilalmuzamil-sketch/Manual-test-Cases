# Audit log — case updates 19 Oct 2026 (QA lead yes, 19 Oct; Rule 131 amendment, 114(c))

| Operation | Case | HTTP | Read-back equal | Untouched fields equal | Automation flags equal | Automated | check_case_render | Served page (after) |
|---|---|---|---|---|---|---|---|---|
| update_case (title, preconds, expected) | C96929 | 200 | True | True | True | True | flags pre-existing <strong> in the unchanged precondition headers (rendered fine) | markdown fr-view, markdown fr-view, markdown fr-view |
| update_case (title, preconds, expected) | C590130 | 200 | True | True | True | False | flags pre-existing <strong> in the unchanged precondition headers (rendered fine) | markdown fr-view, markdown fr-view, markdown fr-view |

Served page before the edit: all three fields `markdown fr-view` for both cases (evidence-before/served-page-scan-before.json).
C96929 is flagged Automated (custom_atmstatus 3): Vlad must be told (Rule 65).
