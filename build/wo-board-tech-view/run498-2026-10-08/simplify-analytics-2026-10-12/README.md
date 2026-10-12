# Simplified C97026 / C97033 / C97034 (12 Oct 2026, QA lead's ask)
Preconditions and steps shortened; expected results NOT touched (Rule 114) — write-log.json proves custom_expected
byte-identical before/after. Copies of the earlier text: ../analytics-cases-before-simplify-2026-10-12.json.
All three were fr-view before writing (served-page scan), so the API write was safe; scan after: ALL CLEAN.
check_case_render.py flags <strong> headings: the same headings were already in the cases and in Expected, and the
served page shows them bold (fr-view), so the flag is about the stored text, not what the tester sees.
