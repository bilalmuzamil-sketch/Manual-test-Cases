# NEEDS-REFLOW (staging-verify pass) — cases written via API in the `<br>` interim format

While the TestRail API `update_case` wrap block (hazard #6) is active, edits store as a single
`<p>...<br>...</p>` block (raw markup shown literally to testers). These cases were edited via API
in that interim `<br>` format and must be reflowed to the clean house form (plain `1.\n2.\n3.`,
no `<p>`/`<br>`) once the API block lifts OR via a TestRail UI Edit→Save. DO NOT reflow now (another
worker owns the TestRail web-UI session).

| C-id | Report | Pass date | Reason |
|---|---|---|---|
| C43838 | Work In Progress | 2026-08-20 | HOLD→READY glow VIU; expected rewritten in <br> interim format |
| C43984 | Work In Progress | 2026-08-20 | HOLD→READY label-wrap VIU; expected rewritten in <br> interim format |
