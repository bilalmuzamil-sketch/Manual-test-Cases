# FILTERS — cases needing API rewrite BEFORE reflow (2026-08-20)

DANGER variant (coordinator warning 2026-08-20): flagged as storing line breaks as raw \n
INSIDE a <p> block with NO <br>, which the "." UI reflow would collapse into a run-on line.

## RESOLVED 2026-08-20 — all 3 checked via API, none needed a rewrite
C29603, C43590, C38876 were fetched live via the TestRail API and inspected field-by-field:
- All three have atmstatus=1 (Not Automated) — Rule 71 gate passed.
- Every field already uses `<br>` where a line break is needed (the multi-line
  preconds/steps/expected fields), and the ONLY newline in each field is a harmless
  trailing `\n` after the closing `</p>`. There are ZERO mid-text bare newlines.
- The original flag was a heuristic false positive: the flagged field in each case
  (steps for C29603/C43590, preconds for C38876) is a SINGLE-LINE `<p>…</p>\n`, which
  legitimately has no `<br>`.
- Byte-verified: fields render correctly as-is. No `update_case` was performed
  (a no-op write is unnecessary and a spurious `<br>` on the trailing `\n` would add a
  blank line). Recorded in DONE.jsonl with status "already-br-form".

None outstanding. Nothing to rewrite; these are safe and need no "." reflow.
