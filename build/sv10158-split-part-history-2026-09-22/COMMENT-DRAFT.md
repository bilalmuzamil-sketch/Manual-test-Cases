# SV-10158 — QA comment draft (not posted)

> Structure follows the standing Jira comment format: verdict first, plain summary, the
> before-and-after exhibit, the what-we-checked table, the remaining exhibits, what we deliberately
> did not treat as a fault, honest limits. **No "Technical details for developers" section** —
> Standing Rule 84 says it is posted only when the QA lead says yes for this specific ticket, and he
> has not been asked about this one yet.

---

**OVERALL QA STATUS: PASSED**  *(success panel)*

Tested on `sv10158.qa.shopview.com` (build `v26.36.9-58de7bb`) on 22 September 2026. All 5 checks
passed.

Splitting a work order now leaves a record on the part. Before the fix, a part could travel from one
work order to another during a split and its Part History said nothing about it at all — so anyone
looking at the part later could not tell where it had gone. It now writes the same kind of entry the
Move option already wrote, naming both work orders and the quantity.

### Before and after

*(exhibit EX1 — production vs the fix branch, same action)*

The same thing was done on both builds: a line carrying a picked inventory part was split onto a new
work order, then the part's Part History was opened. On the build customers are running today the
split adds nothing. On the fix branch it adds one entry naming both work orders.

### What we checked

| # | Check | Status |
|---|---|---|
| 1 | Splitting a work order writes a Part History entry naming the old and the new work order | PASSED |
| 2 | Exactly one entry per inventory part on the split line — never two, never none | PASSED |
| 3 | The work order's own "Split to" / "Split from" entries are unchanged | PASSED |
| 4 | The ordinary Move option still writes its entry (nothing broken by this change) | PASSED |
| 5 | The wording matches a Move, which is what the ticket asked for | PASSED |

### The evidence

*(EX2 — check 1: the entry after a split)*
*(EX3 — check 2: two different parts on one line, one entry each with its own quantity)*
*(EX4 — checks 4 and 5: the ordinary Move writes the same wording)*

### The open question on this ticket is answered

The ticket deliberately left one thing undecided — whether a split *should* record the same way a
move does, since nothing written down covered it. The developer has answered it in his comment: yes,
it should, and that is what the build now does.

### What we did not treat as a fault

The developer named three things as out of scope, each needing its own ticket, and we tested to that
scope rather than against them:

- the same gap for moving a part on a **part sale**;
- the same gap for **splitting** a part sale;
- a split still writes **no per-part entry on the work order's own history** — that one is waiting
  on SV-7884 to settle the format.

### Honest limits

- The split itself was driven entirely through the screen, as a user would. The Move check — which
  is a guard on a neighbouring feature, not the thing being fixed — was driven at the same place the
  Move dialog sends it.
- Two earlier attempts at this test were invalid and were re-run rather than reported: the part had
  not actually been picked, so nothing was due in Part History either way. Every result above comes
  from a run where the part was proven to be staged first.
