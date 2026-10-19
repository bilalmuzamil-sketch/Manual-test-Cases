# Case updates 19 Oct 2026 (QA lead's "A" on all three, same day)
| Case | Automated | Field(s) | Change | Write | Served page |
|---|---|---|---|---|---|
| C368131 | no | custom_steps | step 3: after the Location change, remove the old enrolment via Settings > Staff > Department(s) > Manage staff enrollments | 200, read-back equal, untouched equal, flags equal | fr-view, clean |
| C368167 | YES (tell Vlad) | custom_steps | step 2: leave the New Customer Payment window open (X takes the invoice back off, staging and production) | 200, equal, equal, equal | fr-view, clean |
| C96936 | YES (tell Vlad) | custom_preconds, custom_steps, custom_expected | "Ralph Edwards" → "Aaron Baker" everywhere (5 + 1 + 2), one reason line in the preconditions, one dated decision line after the expected results (114(c), named by the QA lead); the one existing `<br>` in Expected turned into `</p><p>` (text unchanged) because an API write shows `<br>` literally | 200, equal, equal, equal | fr-view, clean |
Inputs: C*-raw.json (before), C*-new.json (sent); safe_case_edit snapshots C*-before.json / C*-after.json; write-log.jsonl; scan/evidence/served-page-scan.json.
check_case_render.py flags the `<strong>` headers these fields already carried (pre-existing, rendered fine in fr-view — L0447).
