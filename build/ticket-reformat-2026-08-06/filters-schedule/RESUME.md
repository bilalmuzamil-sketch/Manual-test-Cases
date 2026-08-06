# Resume — ticket reformat, Filters and Schedule

**Status: COMPLETE for the scope given. Nothing is mid-flight, and no batch was left
part-run.**

## What is done

- The population was established live and reconciled three ways: **27** tickets we created
  in the SV-8785 and SV-8685 trees.
- **All 22 OPEN ones rewritten** into the five-part shape. 22 `PUT`s, 22 × `204`, every
  description byte-identical to its payload including `localId`, 277–656 other fields
  compared per ticket with **0 moved**.
- **All 5 closed ones skipped and proven untouched**, including `updated`.
- **All 33 requirement citations verified against the live specs** — Filters Confluence
  **v19**, Schedule **v25** — re-read at write start and unchanged (Standing Rule 59).
- Deliverables written: `README.md`, `TICKET-INVENTORY.md`, `execution-log.md`,
  `SOURCE-PROBLEMS.md`, `SKIPPED-CLOSED.md`, `IMAGES-OWED.md`, this file, and
  `snapshots/`.

## What is NOT done, and is not ours to do

| Thing | Whose | Why it was not done |
|---|---|---|
| The Report Suite tickets | a sibling worker | that is the other half of this job |
| The Schedule spec v23 → v25 diff | a sibling worker | explicitly out of scope; this pass read the **live** requirement text instead of the mirror |
| Reopening SV-8843 / SV-8847 | the QA lead | both still reproduce, but reopening another person's closure is his call |
| Converting any ticket's type or re-parenting | the QA lead | UI-only, silently wipes Product Area, and cuts across Mudassir Qamar's triage |
| Two small image jobs | needs a working QA sign-in | the estate-wide sign-in died at ~11:37Z; see `IMAGES-OWED.md` |
| Anything in TestRail | sibling workers are live in those cases | **0 TestRail calls were made** |

## If you need to re-verify without writing anything

```bash
cd build/ticket-reformat-2026-08-06/filters-schedule
python3 tools/final_audit.py          # re-reads all 27 live and re-checks everything
```

Expected tail: `population 27 = rewritten 22 + closed 5;  failures 0`.

It needs Jira session cookies at `/tmp/atlassian/cookies.json`. `/tmp` is ephemeral, so on
a fresh container ask the QA lead to re-supply them. Nothing else is needed — no QA-branch
sign-in, no Figma token, no TestRail key.

## If a ticket's wording needs changing

Edit the sentence in `tools/content_filters.py` or `tools/content_schedule.py`, then:

```bash
python3 tools/rewrite.py --dry-run SV-XXXX   # inspect the built payload
python3 tools/rewrite.py --write   SV-XXXX   # write it, verified, stops on any mismatch
python3 tools/final_audit.py                 # re-check everything
python3 tools/gen_docs.py                    # regenerate the markdown from the evidence
```

`--write` is the only writing path. It compares every field against
`snapshots/pre-edit/SV-XXXX.json` and **stops the batch** on any mismatch, which is what it
did once already on SV-8845.

## The one thing to know before touching this again

**`lastViewed` is excluded from the field comparison**, on proof recorded in
`snapshots/lastviewed-probe.json`: it is a per-user marker set by the Jira **web UI** and
never by our REST calls. If it moves on a ticket, somebody opened that ticket in a browser
under this shared account — that is a fact to report, not noise to absorb. It happened once
during this pass, on SV-8845 at 13:20:05Z.

**Do not add any other field to that exclusion list without proving it the same way.** A
field quietly excluded is indistinguishable from a silent write failure.
