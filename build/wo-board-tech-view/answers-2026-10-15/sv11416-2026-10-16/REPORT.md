# SV-11416: new case C614711 (16 Oct 2026)

QA lead, verbatim: "Create a test case for this if not already created and mark it as failed and attach this ticket to the comment
as a ticket to follow: https://shopview.atlassian.net/browse/SV-11416"

- **Existing coverage:** none. All 272 tests in run 498 were searched for a deleted technician or "Unknown Technician"; the only hit,
  C368191, is about line labor reading "Deleted user", not the Board View column.
- **Source currency:** the PRD had moved from version 54 to **version 58** (15 Oct 2026, 21:33 UTC). Saved verbatim as
  `../CONFLUENCE-845185030-v58-2026-10-16.md`. The quoted rules (S5-R11b, S3-R3, S3-N2, S3-N4, the 2026-09-13 decision) are the same
  in v54 and v58.
- **Case:** [C614711](https://shopview.testrail.io/index.php?/cases/view/614711) "Deleting a lead technician leaves no Unknown
  Technician column in Board View", section 13238 (Board View, beside the deactivated-technician cases C96952 and C368131),
  Rule 117 layout, own setup Doc ([doc](https://docs.google.com/document/d/1SR2QvFurbK38NQioUAqAJ82mlrbEbUCC3f1gO16OUNw/edit)).
  Expected: no column headed "Unknown Technician"; a technician column's header shows the same name as List's Lead Technician
  (S5-R11b, S3-R3, quoted word for word). The spec is silent on deletion: S3-N2, S3-N4 and the deactivation decision are quoted as
  the nearest rules, and the open PO question in SV-11416 is stated in the case. Marker `AUTOMATION: READY - EXPECT FAIL (SV-11416)`
  with the symptom and the three outcomes (Rule 61; SV-11416 is open and describes the failure).
- **Checks:** 5/5 quotes verbatim in v58; add_case 200, link_doc 200; read-back OK (marker unique and last, rendered link OK);
  runnable gate 1/1.
- **Run 498:** union only, 272 → 273 tests, none dropped, no other status changed. Test
  [T4004397](https://shopview.testrail.io/index.php?/tests/view/4004397) = **Failed**, comment names SV-11416 as the ticket to follow,
  Defects field SV-11416.
