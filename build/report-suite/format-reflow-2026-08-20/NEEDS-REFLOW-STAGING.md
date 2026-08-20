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
| C30398 | Technician Utilization | 2026-08-20 | HOLD→READY reports-access VIU (role-swap negative); all 3 fields written in <br> interim format |
| C30604 | Inventory Value | 2026-08-20 | HOLD→READY reports-access VIU (role-swap negative); all 3 fields written in <br> interim format |
| C30603 | Inventory Value | 2026-08-20 | HOLD→READY reports-access VIU (switch-user positive); all 3 fields written in <br> interim format (em-dash stored as &mdash;) |
| C30162 | Sales By Customer | 2026-08-20 | ⚠️ `\n`-VARIANT REPAIR (atm=3 Automated). Was the `\n`-in-`<p>` damaged variant; Expected rebuilt via API in the `<br>` interim format (line breaks restored, word-identical, no wording change). Em-dash stored as `&mdash;`. |
| C30287 | Sales By Representative | 2026-08-20 | ⚠️ `\n`-VARIANT REPAIR (atm=3 Automated). Was the `\n`-in-`<p>` damaged variant; Expected rebuilt via API in the `<br>` interim format (line breaks restored, word-identical, no wording change). Em-dash stored as `&mdash;`, `≤` as `&le;`. |

**⚠️ NOTE for the reflow pass on C30162 / C30287 (the `\n`-variant repairs):** these two are the
`\n`-in-`<p>` variant that the plain Edit→"."→Save trick previously MADE WORSE (it collapsed the raw
`\n`s to one run-on line — see `DAMAGED-ATM3-CASES.md`). They have now been rebuilt into the `<br>`
interim form, so a UI render-reflow SHOULD work on them like the other 161 atm=1 cases. **But because
of that history, whoever runs the reflow MUST re-render-VERIFY these two specifically** (confirm the
Expected renders multi-line, the marker/provenance survive, and no run-on reappears) rather than
trusting the "." trick blind. Also note each ends with a pre-existing SV-9069 note **after** the
`AUTOMATION: READY` marker (preserved as-is; not reflow damage — see FOR-VLAD-CONSOLIDATED note).
