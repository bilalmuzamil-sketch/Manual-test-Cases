# Report Suite defect tickets reformatted to the five-part shape — 2026-08-06

**The ask:** the POs and Stefan said our tickets are too big to understand and to reproduce. The QA lead
ordered every ticket we created rewritten to a strict minimal format. **This folder is the Report Suite
half (epic SV-8582).** A sibling worker holds Filters and Schedule.

## In one line

**65 tickets are ours under epic SV-8582 and its stories. 62 were rewritten — every one byte-verified —
and 3 were left alone because they are closed.**

| | |
|---|---|
| population, established live five ways | **65** |
| **rewritten** | **62** |
| left alone (closed / obsolete) | 3 — SV-8819, SV-8821, SV-8822 |
| excluded by instruction | 1 — SV-8910 (ownership unconfirmed; also outside the epic by structure) |
| excluded as another project's | 1 — SV-8871 (parent SV-8795 is a Filters story) |
| Jira writes | **63 operations, every one HTTP 204** |
| collateral field changes | **0** |
| writes to anyone else's ticket | **0** |
| TestRail calls | **0** |
| source checks against the live specifications | **122 / 122 PASS** |
| final live re-read of the whole population | **65 read · 65 PASS · 0 FAIL** |

## The shape every rewritten ticket now has, and nothing else

1. **Description** — a few sentences saying what is happening.
2. **Steps to reproduce** — an Environment line naming the QA branch and who to sign in as, then numbered
   steps **with the exact test data named inside them** (Standing Rule 50), because that is the difference
   between a reproducible ticket and one closed as "cannot reproduce".
3. **Current behaviour** — plain words. Where a developer genuinely needs a locator, **one short plain line**
   carries it (a request id, an endpoint's answer) — never a separate technical section.
4. **Expected behaviour** — plain words.
5. **A rule, then Source** — the specification, its **Confluence version**, the requirement id, and the
   requirement **quoted verbatim**; or the PO's answer with its link and row.

**Deleted from all 62:** the severity/impact blocks, the technical appendices, the probe tables, the
"what was ruled out" lists, the "how often" and "how bad is it" sections, the evidence-file inventories,
the branch/environment tables, and the meta-sentence *"That is source type 2: the specification (PRD) in
Confluence."* Where a ruled-out fact was genuinely load-bearing — *"it is not the date range, the same
thing happens on three ranges"* — it survives as one clause inside *Current behaviour*.

## Files

| File | What it is |
|---|---|
| [`TICKET-INVENTORY.md`](TICKET-INVENTORY.md) | every ticket, its state, rewritten or skipped and why |
| [`execution-log.md`](execution-log.md) | one row per Jira write: operation, ticket, HTTP, fields compared, fields moved, verdict |
| [`SOURCE-PROBLEMS.md`](SOURCE-PROBLEMS.md) | **read this** — 5 tickets whose source is weaker than they implied, and 5 citation errors of our own that the live re-read caught |
| [`SKIPPED-CLOSED.md`](SKIPPED-CLOSED.md) | the 3 closed tickets, the reasoning, and my own view on whether to overrule it |
| [`IMAGES-OWED.md`](IMAGES-OWED.md) | what is inline now, and the one screenshot owed when a session returns |
| [`ATTACHMENT-LOSS-SV-8818.md`](ATTACHMENT-LOSS-SV-8818.md) | **the one irreversible thing this pass did** — a pasted image destroyed by the first write, and the durable lesson |
| [`RESUME.md`](RESUME.md) | how a cold session continues, mid-batch |
| `authored/` | the five parts of each ticket, as data — the source of truth for what was written |
| `snapshots/pre-edit/` | every description as it stood before this pass, text and raw ADF |
| `snapshots/pre-write/`, `post-write/` | the full issue either side of each write, all 56–59 fields |
| `snapshots/population.json` | the live enumeration, five routes and their union |
| `snapshots/quote-verification.json` | all 122 source checks |
| `snapshots/FINAL-VERIFICATION.json` | the final live re-read of all 65 |
| `specs/` | the six specifications as fetched live today, with their Confluence versions |
| `tools/` | every script |

## Reproduce

```bash
cd tools
python3 population.py     # enumerate the population live, five ways   (read-only)
python3 classify.py       # working set + snapshot every description    (read-only)
python3 specs.py          # fetch the six specs live                    (read-only)
python3 verify_quotes.py  # 122 source checks against those specs       (no network)
python3 write.py SV-xxxx  # THE ONLY WRITER. one ticket per argument
python3 final_verify.py   # re-read all 65 live and check the shape     (read-only)
```

Jira session cookies come from `/tmp/atlassian/cookies.json` — secrets, never committed.

## The three things worth knowing beyond the numbers

**1. The population is 65, not the 61 our own records implied.** The 2026-08-06 type audit listed 61 Report
Suite tickets; four more exist (SV-8780 from 30 July, and SV-8987/8988/8989 filed this morning). A first
enumeration also mis-classified the **7 Bugs parented directly to the epic** as requirement stories and
reported 58 — they are our own tickets under the pre-2026-08-05 convention. Counted five independent ways
and unioned, the answer is 65.

**2. A pasted image was destroyed, and Jira did not log it.** The first write dropped a media reference and
Jira deleted the file. The byte-check caught it, the batch stopped, and the method changed for the remaining
61. **The lesson belongs in `build/APP-ACTIONS-PLAYBOOK.md` § J** and is not written there because other
workers hold that file — see `ATTACHMENT-LOSS-SV-8818.md`.

**3. Re-verifying the quotes was not a formality.** Five of our citations were wrong against the live
specifications — one pointed at the dark-mode requirement instead of the long-text one, one measured
"44x44" where the page says "44×44", and one whole half of a ticket had no requirement behind it at all.
All corrected before writing. Details in `SOURCE-PROBLEMS.md`.

## Outstanding — what I need from you

1. **SV-8977** — do you want a sticky Totals row on Sales By Representative? No requirement asks for one, so
   it is a question for Chris Ward rather than a defect.
2. **SV-8951** — Chris Ward still owes what the second Technician Utilization spreadsheet should contain and
   what the four files should be called.
3. **One screenshot for SV-8818** when a QA session is available (exact steps in `IMAGES-OWED.md`), plus a
   view on whether the other 56 tickets should carry images at all.
4. **SV-8819** — confirm you are happy it stays as it is. It is closed and Done, so nobody must reproduce it,
   but it is the longest ticket left in the set.
5. **A line to Chris Ward** about the mangled character in the Sales By Representative specification
   (requirements S17-R6 and S18-R9 hold `â‹¯` where they mean the three-dot glyph).
6. **The playbook § J note** on attachment loss, from whoever holds that file next.
7. **SV-8910** — still waiting on your word about whose it is. It was skipped.
