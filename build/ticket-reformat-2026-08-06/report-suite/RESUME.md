# RESUME — how a cold session continues this, including mid-batch

**State as of the last commit: the Report Suite half is COMPLETE.** 62 of 62 open tickets rewritten and
byte-verified; 3 closed tickets deliberately untouched. `final_verify.py` reads all 65 live and returns
**65 PASS / 0 FAIL**. There is no unfinished batch.

If you are resuming to do more work, this is the ground truth and the machinery.

## First, prove nothing has moved under you

```bash
cd build/ticket-reformat-2026-08-06/report-suite/tools
python3 population.py      # is the population still 65? new tickets appear in "new_since_audit"
python3 specs.py           # are the six specs still SBC 15 / SBR 17 / PV 5 / TU 6 / WIP 9 / IV 4?
python3 final_verify.py     # are all 65 still in the required shape?
```

**If `specs.py` reports a different Confluence version for any report, STOP and re-diff before touching a
ticket** (Standing Rules 31 and 59). Every Source section names a version number, so a moved spec makes 62
tickets' citations stale. The quotes are all in `authored/*.json`, so re-verifying is one command:
`python3 verify_quotes.py`.

**If `population.py` lists anything under `new_since_audit`, those are tickets filed since this pass** —
they will not be in `authored/` and will still carry the long format.

## To rewrite one more ticket

1. Read its current description: `snapshots/pre-edit/<KEY>.txt` if it is in the population, otherwise
   `python3 -c "import extract; print(extract.compact('<KEY>'))"` after re-running `classify.py`.
2. Write `authored/<KEY>.json` with these keys — copy any existing file as the template:
   `description`, `steps` (list), `current`, `expected`, `source` (list of tuples), optional `env`,
   optional `images`.
   The `source` entry kinds are documented at the top of `tools/render.py`.
3. **Check the shape before writing:** `python3 render.py <KEY>` prints it as plain text.
4. **Verify every quote against the live spec:** `python3 verify_quotes.py <KEY>` — it must say 0 FAIL.
   **A quote that cannot be found is not written to a ticket.**
5. Write it: `python3 write.py <KEY>`. It snapshots all 56–59 fields first, writes, re-reads, and
   byte-compares. Expect `moved ['description', 'updated']` and nothing else.
6. `python3 final_verify.py` and commit.

## The three traps this pass hit, so you do not hit them again

**1. A pasted image is destroyed if you drop its media node.** Before rewriting any description, list the
media nodes in the current ADF and carry every one into the new body:

```bash
python3 -c "import json,adf; d=json.load(open('../snapshots/pre-edit/SV-8818.adf.json')); print(adf.flatten(d).count('[IMAGE'))"
```

The media id is **not** the attachment id and is only exposed on the redirect from
`/rest/api/3/attachment/content/{id}` — `python3 media.py <attachment id>` resolves it and stores only the
UUID, never the signed token. Jira does **not** log the deletion, so the `attachment` field comparison in
`write.py` is the only thing that will tell you. Full account in `ATTACHMENT-LOSS-SV-8818.md`.

**2. Quotes carried forward from an old ticket are not trustworthy.** Five were wrong. Always re-quote from
`specs/<slug>-v<N>.txt`, which is a live fetch, using `python3 q.py <slug> '<pattern>'`.

**3. The Sales By Representative page holds a mangled character** (`â‹¯` where it means the three-dot glyph,
in S17-R6 and S18-R9). Quote around it with ` ... ` — `verify_quotes.py` verifies each fragment separately.

## What is deliberately NOT done, and must not be done casually

- **No field but the description has been touched on any ticket** — not type, parent, priority, status,
  links, labels, assignee or Product Area. Several were converted to Story Defect by Mudassir Qamar and
  Ahtasham Amjad; Standing Rule 53's corollary means we never reverse another person's field change, and on
  this shared account their edits look exactly like ours.
- **The three foreign tickets (SV-8960, SV-8961, SV-8984, by Nebojsa Glavinic) were read and left alone.**
- **SV-8910 is skipped** pending the QA lead's word on whose it is.
- **Zero TestRail calls.** A sibling worker is editing cases.
- **No new tickets, comments or transitions.**

## Where the answers live

`README.md` for the headline · `TICKET-INVENTORY.md` for any single ticket's fate ·
`SOURCE-PROBLEMS.md` for the five weak sources and the five citation errors ·
`execution-log.md` for the per-write audit · `SKIPPED-CLOSED.md` and `IMAGES-OWED.md` for the two open asks.
