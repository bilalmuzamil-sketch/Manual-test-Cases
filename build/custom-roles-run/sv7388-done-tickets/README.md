# SV-7388 DONE-tickets — ingestion drop-folder

Paste/export the **DONE** Jira tickets for the Custom Roles epic (SV-7388) here so
they drop straight into the spec-recheck + VIU reconciliation. **Atlassian is
login-walled in this environment — we CANNOT fetch Jira; the user must export/paste.**

## What to provide
For **every DONE / Resolved / Closed** ticket under SV-7388 (stories, bugs, defects,
sub-tasks), create **one file** named `SV-XXXXX.md` in this folder using the template
below. **Include the FULL comment thread** — comments often carry the final behavior
decision that never made it into the Confluence page body.

## Per-ticket file template (`SV-XXXXX.md`)

```
# SV-XXXXX — <Title>

- **Type:** Bug | Story | Defect | Sub-task | Task
- **Status:** DONE   (only DONE/Resolved/Closed tickets belong here)
- **Resolution:** Fixed | Done | Won't Do | Duplicate | ...
- **Fix version / sprint:** <if any>
- **Linked:** <parent/blocks/relates SV-#### keys>

## Description
<full ticket description, verbatim>

## Acceptance criteria (if present)
<verbatim>

## Resolution / what shipped
<what the dev actually changed / final behavior>

## Comments (FULL thread, chronological — author + date + text)
- YYYY-MM-DD <author>: <comment>
- YYYY-MM-DD <author>: <comment>
- ...
```

## Why the full comments matter
The Change Log in the Confluence page summarizes decisions tersely (e.g. "Reverse
Invoice moved to WO Delete"), but the **exact edge-case behavior** (who is gated, what
prompt appears, which HTTP status is expected) is frequently negotiated in ticket
comments. Vlad's nightly asserts the shipped behavior, so ticket comments are often the
missing link between a failing case and the "correct" expected result.

## After tickets land
Fill `ticket-behavior-map.md` (this folder): map each ticket to any behavior that is
**outside / newer than** our on-file spec (`../../custom-roles-spec-update/updated-spec-source.md`,
exported 09 Jul 2026) and to the affected local case(s) in
`../cases-2026-07-13/C<id>.json`. That table drives the reconciliation edits.
