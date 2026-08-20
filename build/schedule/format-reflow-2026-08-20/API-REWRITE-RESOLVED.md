# Schedule \n-variant API rewrite — RESOLVED 2026-08-20

API-only pass (no Playwright/TestRail UI). Replaced mid-text `\r\n` (numbered-list
collapse inside `<p>`) with `<br>`, WORD-FOR-WORD (only line breaks changed). All four
text fields sent explicitly on each update_case; re-GET byte-verified per field
(mid-text newlines gone, visible words identical). Trailing `\n` after `</p>` is
TestRail's own normalization and is the harmless canonical form on every Schedule case.

## Candidate list (15 unique = 11 needs-api-rewrite + 4 FAIL hardskips; 29930 in both)

REWRITTEN + byte-verified PASS (10):
- C29946 (steps)
- C29948, C29950, C29951, C29952, C29953, C29954, C29955, C29963, C29969 (preconds, steps)

ALREADY-OK / false-positive, no write (5) — already use `<br>`, only harmless trailing `\n`:
- C29930, C29991, C29997, C30031, C30032

AUTOMATED-HOLD (custom_atmstatus==3) for QA lead: NONE.
(Note: C29948/29950/29951/29952/29954 are atm==4 "Pending", NOT "Automated" — editable; Rule 71 gates only atm==3.)
