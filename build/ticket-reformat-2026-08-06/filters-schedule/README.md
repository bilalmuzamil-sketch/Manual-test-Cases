# Ticket reformat — Filters (SV-8785) and Schedule (SV-8685) — 2026-08-06

**Read this first, then [`TICKET-INVENTORY.md`](TICKET-INVENTORY.md), then
[`execution-log.md`](execution-log.md).**

## In one line

**Every one of the 22 OPEN tickets we created against the Filters and Schedule epics has
been rewritten into the QA lead's five-part shape, and every write was byte-verified. The
5 closed ones were deliberately left alone and proven untouched.**

## Why

The POs and Stefan Mitrovic said our defect tickets are too big to understand and
reproduce. The QA lead ordered every ticket we created rewritten to a strict minimal
format containing **only** these five things, in this order:

1. **Description** — concise, explains what is happening, does not over-explain.
2. **Steps to reproduce**, numbered, with **one Environment line** immediately before them.
3. **Current behaviour**, in plain words a non-technical manual QA can follow.
4. **Expected behaviour**, in plain words.
5. **A line break, then the Source** — the epic story, the specification with its
   requirement, or the PO's answer sheet.

Everything else came out: the severity and impact blocks, the "Branch / Environment"
dumps, the "Technical details for developers" sections, the test-data appendices and the
"things checked and ruled out" lists.

## The numbers

| | |
|---|---|
| Population of tickets **we** created in the two epic trees | **27** |
| Rewritten (every OPEN one, including Ready to Fix / Ready for QA / TESTING QA) | **22** |
| Closed and deliberately skipped | **5** |
| `PUT` operations | **22**, one per ticket, `description` only |
| HTTP | **22 × 204** |
| Description byte-identical to the intended payload | **22 of 22**, raw, including `localId` |
| Other fields moved | **0**, across 277–656 fields compared per ticket |
| Closed tickets proven untouched incl. `updated` | **5 of 5** |
| Requirement citations verified against the **live** specs | **33 of 33** |
| Writes to anybody else's ticket | **0** |
| TestRail calls | **0** |
| Tickets reopened, retyped, re-parented, re-prioritised | **0** |

Descriptions went from **147,115 bytes to 94,716 — 35% shorter overall**. Honestly: that is
**19 shorter and 3 slightly longer**, not 22 shorter. The three Filters tickets that grew
already used a terse format, and their new Source section quotes more of the specification
than the old one did.

## Where the material went — nothing is lost

`snapshots/pre-edit/` holds every ticket's complete pre-edit state: the raw JSON of all 27
(`SV-XXXX.json`) and a readable rendering of the old description (`SV-XXXX.md`). So every
sentence removed is recoverable from git.

## The two judgement calls, and how they were taken

**Steps had to stay reproducible.** Standing Rule 50 wants the exact test data *named* —
SV-8821 was closed as "cannot reproduce" because our steps named no canned line. So the
named data was **folded into the numbered steps** rather than deleted with the appendix:
work order S-12876 / Pamill Paving / unit 713, technician Ayesha Khan's 7:00 AM–7:00 PM
hours, customer Iibay Landscaping, Bahampton Holdings' 6 work orders, Colleen Guerrero's
Sunday 2 August row. A step now reads as a step, with the data in it.

**A technical detail that genuinely locates the fault survived as one plain line inside
*Current behaviour***, prefixed *"For a developer:"* — no separate section, no jargon where
plain words work. **Twelve of the 22 carry one; ten needed none.**

## Files

| File | What it is |
|---|---|
| `README.md` | this |
| [`TICKET-INVENTORY.md`](TICKET-INVENTORY.md) | the 27, how the population was established three ways, and the per-ticket table |
| [`execution-log.md`](execution-log.md) | one row per operation, with what was compared and what it found |
| [`SOURCE-PROBLEMS.md`](SOURCE-PROBLEMS.md) | the 3 partly-supported sources, and SV-8916 which is not ours and has no requirement |
| [`SKIPPED-CLOSED.md`](SKIPPED-CLOSED.md) | the 5 closed ones, why each was skipped, and the reopen question |
| [`IMAGES-OWED.md`](IMAGES-OWED.md) | what images exist, which were made inline, and what a session with a sign-in owes |
| [`RESUME.md`](RESUME.md) | cold-resume: what is done, what is not, and the exact next command |
| `snapshots/pre-edit/` | all 27 tickets before the pass — the recoverable record |
| `snapshots/post-edit/` | all 22 after the pass, plus the exact payload sent |
| `snapshots/specs/` | the live Filters v19 and Schedule v25 bodies, and the 33-claim verification |
| `snapshots/final-audit.json` | the exhaustive re-check of all 22 and all 5 |
| `snapshots/lastviewed-probe.json` | the evidence behind the one excluded field |
| `tools/` | every script. All read-only except `rewrite.py --write`. |

## Reproduce

```bash
python3 tools/enumerate.py      # walk both epic trees          (read-only)
python3 tools/population.py     # reconcile the three sources   (read-only)
python3 tools/snapshot.py       # snapshot all 27 pre-edit      (read-only)
python3 tools/fetch_specs.py    # live spec bodies + versions   (read-only)
python3 tools/verify_sources.py # 33 claims vs the live text    (no network)
python3 tools/rewrite.py --dry-run     # build the 22 payloads  (no network)
python3 tools/rewrite.py --verify-only # re-verify, no writes   (read-only)
python3 tools/final_audit.py    # the exhaustive re-check       (read-only)
python3 tools/gen_docs.py       # regenerate the markdown       (no network)
# tools/rewrite.py --write is the ONLY writing path -- already run, do not re-run
```

Jira session cookies come from `/tmp/atlassian/cookies.json`. Secrets, never committed.

## Outstanding — what I need from you

1. **Approve the tone.** One complete rewritten ticket is quoted in the report; if the
   register is right, the other 21 match it.
2. **Branko owes two answers** — whether technician working hours are per-location
   (SV-8933) and which clock the Schedule board should show (SV-8848). Both are the only
   soft edges in the 22, and both are recorded on the tickets themselves.
3. **Reopen SV-8843 and/or SV-8847?** Both still reproduce despite being closed. Your call,
   and SV-8843's own stated reason needs correcting first.
4. **SV-8916 is Sasha Grosman's**, has no requirement behind it anywhere in the live spec,
   and Milos has blocked it for clarification. Not touched.
5. **A fresh QA sign-in** if you want the two small image jobs in `IMAGES-OWED.md` done.
6. **Nothing else is outstanding.**
