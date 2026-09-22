# SV-10158 — QA comment draft (NOT posted)

> Two things are needed before this goes anywhere: the QA lead's go-ahead to post, and his answer on
> whether he wants a **"Technical details for developers"** section on *this* ticket (Standing Rule 84
> — asked fresh every ticket; the "No" on SV-8447 does not carry over). The draft below is written
> **without** that section.
>
> Exhibits: `ev/EX1-before-after.png`, `ev/EX2-one-per-part.png`, `ev/EX3-move-regression.png`.
> They are uploaded as real Jira attachments (playbook §V.0), not external links.

---

**OVERALL QA STATUS: PASSED**  *(success panel, first line)*

Tested on `sv10158.qa.shopview.com` (build `v26.36.9-58de7bb`) on 22 September 2026. All 5 checks
passed.

Splitting a work order now leaves a trace on the part. Before this fix a part could travel from one
work order to another during a split and its Part History said nothing about it at all, so anyone
looking at the part afterwards had no way to tell where it had gone. It now writes the same kind of
entry the Move option already wrote — naming the work order it left, the work order it went to, and
the quantity.

### Before and after

*(EX1-before-after.png)*

The same thing was done on both builds: a line carrying a picked inventory part was split onto a new
work order, then the part's Part History was opened. On the build customers are running today the
split adds nothing at all. On the fix branch it adds one entry naming both work orders.

### What we checked

| # | Check | Status |
|---|---|---|
| 1 | Splitting a work order writes a Part History entry naming the old and the new work order | PASSED |
| 2 | Exactly one entry per inventory part on the split line — never two, never none, each with its own quantity | PASSED |
| 3 | The work order's own "Split to" and "Split from" entries are unchanged | PASSED |
| 4 | The ordinary Move option still writes its entry — nothing broken by this change | PASSED |
| 5 | The wording matches a Move, which is what this ticket asked for | PASSED |

### The evidence

*(EX2-one-per-part.png)* — checks 1 and 2. One line was given two different inventory parts, MD668D
at quantity 3 and 2208H476 at quantity 1, and then split. Each part got exactly one entry carrying
its own quantity. MD668D, which had been split once before, shows both of its moves separately, so
repeated splits build up rather than overwrite each other.

*(EX3-move-regression.png)* — checks 4 and 5. A part moved with the Move option produces
*"Moved 1 from WO # S2-17435 to WO # S10158-17581"* — word for word the shape a split now produces,
which is what the ticket asked for.

On check 3, the work order's own history was read on all three work orders involved: the original
carries three **Split to** entries, one for each split performed, and each new work order carries one
**Split from**. Nothing there changed.

### The open question on this ticket is answered

The ticket deliberately left one thing undecided — whether a split *should* record the same way a
move does, because nothing written down covered it. The developer has answered it: yes, it should,
and that is what the build now does.

### What we did not treat as a fault

Three things were named as out of scope, each needing its own ticket, and we tested to that scope
rather than against it:

- the same gap when moving a part on a **part sale**;
- the same gap when **splitting** a part sale;
- a split still writes **no per-part entry on the work order's own history**, which is waiting on
  SV-7884 to settle the format.

### Honest limits

- The split itself — the thing being fixed — was driven entirely through the screen, hover, tick,
  menu and all, because that is what a user does. The Move check is a guard on a neighbouring
  feature rather than the fix, and was driven at the same place the Move dialog sends it.
- Two earlier attempts at this test were thrown away rather than reported. In both, the part had
  never actually been picked, so no Part History entry was due either way and "nothing was written"
  would have meant nothing. Every result above comes from a run where the part was proven to be
  staged first.
