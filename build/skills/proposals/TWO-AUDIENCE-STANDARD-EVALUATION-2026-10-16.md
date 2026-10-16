# Proposed two-audience case standard (QA lead, 16 Oct 2026): what it changes, what could bite, safeguards

Not recorded as a rule. Rule 117 is LOCKED and Rule 63 requires the conflicts to be shown before anything changes.
The proposal (verbatim in the chat of 16 Oct 2026): the test case is for the manual tester and runnable on its own; the attached
setup file is for Claude and executable on its own; Preconditions = starting state only (3–6 bullets); Steps = actions under test
only (≤10); Expected = one observable check per step, with citations, versions and commentary moved to the setup file's
Traceability section; setup file with account slots, flags, data recipes, mapping table, dependencies, cleanup, traceability,
VIU status, open questions; a pre-handoff gate.

## Where it changes a recorded rule
| # | Rule today | Proposal | Risk if adopted as written | Safeguard proposed |
|---|---|---|---|---|
| 1 | 113, 117(4), 54: the verbatim quote and the Source line sit in the case's Expected results | quotes, source, versions move to the setup file (Traceability) | the anchor that stops a result drifting towards the build is out of the tester's sight; two places can drift apart | keep the quote per result in Traceability, and a checker refuses a case whose plain lines have no verbatim quote there |
| 2 | 61 + tools (`automation_markers.py`, `check_tester_readiness.py`, `verify_suite.py`, Vladimir's counter): one `AUTOMATION:` literal is the last line of Expected | not mentioned; "remove commentary" | removing it breaks the automation counts and Vladimir's tooling | keep the marker as the last line (it is a label, not commentary) |
| 3 | 61: EXPECT FAIL cases show the symptom and the three outcomes | build-vs-spec commentary is removed | a tester sees a known failure and raises a duplicate bug, or ignores a new one | keep one short line on the step: "Known problem SV-xxxxx: …; if you see exactly this, mark Failed" |
| 4 | 117 (5th–8th amendments): placeholders {Work-order-1} "(for example …)" | every record named explicitly (e.g. WO-QA-01) | work-order numbers are assigned by the system (Rule 111: a named number that cannot exist = false Failed); reused names collide with old ZZAUTOTEST data | name records by values the setup fixes and the case owns (customer "ZZAUTOTEST C614711 …"); find work orders by their customer, never by number |
| 5 | 117 (3rd/4th): Part 1 of the doc lets the tester build the state | the tester never builds it; Claude does | a tester with no Claude session done first is stuck | Preconditions end with: "If any record above is missing, mark the test Blocked: setup not done." |
| 6 | none (cases can be long) | ≤6 preconditions, ≤10 steps, else split | splitting an existing case changes its C-id, run history and automation link | never split an existing case without your approval on a list; never an Automated one without Vladimir |
| 7 | 117: one public doc per case | one setup file "for every case" with a mapping table | one file per feature is easier to keep consistent but long; one per case is easy to attach | your choice (question 2) |
| 8 | doc Part 2 holds the QA site URLs | no environment URL stored | none | remove the URLs; ask for them at session start |
| 9 | 56: divergence sentence in the case | moves to Traceability | none for the tester | keep it in Traceability |
| 10 | 122 (as amended today): ask full pass or a named set | converting all cases is a full rewrite | large change to ~280 cases at once | apply to new and touched cases first (the 21), convert the rest only on your decision |

Nothing else in the rule book conflicts: secrets stay out (82), expected results still come only from the spec (57), the tester
text stays in the build's labels (7/9), runs stay in step (123), foreign cases stay untouched (38).
