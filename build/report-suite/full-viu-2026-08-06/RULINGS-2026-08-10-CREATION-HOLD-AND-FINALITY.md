# Two rulings from the QA lead, 2026-08-10 — recorded before they are acted on

## Ruling 1 — CREATE NOTHING

Verbatim, answering the request to file the five prepared defects:

> **"Do not create anything until my next order."**

**Scope: broader than Standing Rule 62.** Rule 62 holds Jira ticket *creation*. This ruling holds
**creation as such** — no Jira ticket, **no new TestRail case (`add_case`)**, nothing created in any
external system, until he says otherwise.

**What is still permitted, and is what this pass does:** **`update_case` on cases that already
exist** — correcting, re-verdicting, re-stamping provenance, repairing markers. That is **correction,
not creation**, and it is what he authorised in requiring the three reports be *"100% authentic and
VIU'd"*.

**Where the line is genuinely unclear, the action stops and is written up instead of guessed.**

**Effect on this pass:** none on method. **Nothing has been created at any point** — no `add_case`,
no ticket. The five prepared defects in `DEFECTS-FOR-PERMISSION.md` stay prepared and wait, and
anything found today is added there in the same ticket-ready shape.

**Consequence to state plainly:** the three cases that sit on `AUTOMATION: HOLD` **only because an
expect-fail marker needs a ticket number that does not exist yet** stay on `HOLD`. They become
`READY - EXPECT FAIL` with one edit each once a ticket exists. That is now blocked by this ruling,
which is his to lift.

## Ruling 2 — the branch is FINAL, for these three reports only

Verbatim:

> **"they have released just those reports which I mentioned… so the branch is final for those
> reports only, the remaining reports are yet to be handed off to the QA. Once all 6 reports are
> handed off to the QA only then we can consider the branch as final."**

| Report | Status | What a deviation means now |
|---|---|---|
| **Work In Progress** | **handed off — final** | a **real defect in a finished feature** |
| **Technician Utilization** | **handed off — final** | as above |
| **Sales By Customer** | **handed off — final** | as above |
| Sales By Representative | not handed off | unchanged — still provisional |
| Parts Velocity | not handed off | unchanged — still provisional |
| Inventory Value | not handed off | unchanged — still provisional |

### The nuance, stated honestly rather than over-claimed

**"Final" here means HANDED OFF / feature-complete — NOT "the code will never change again."** The
branch can and will redeploy, not least to fix the very defects being reported. So:

- **A redeploy still invalidates the labels and the pass/fail verdict** (Standing Rule 60, layers 1
  and 2), **even on a final report.** The build marker on each case still has to be honest.
- **What finality removes is a different doubt entirely:** we no longer have to wonder whether a
  missing control is *an unfinished feature* or *a defect*. On these three it is a **defect**.

**This is why the distinction is worth the words:** the previous passes could not tell a gap from a
work-in-progress, so every verdict carried a hedge. On these three that hedge is now wrong, and
keeping it would understate real findings.

### What this changes in the deliverables

1. `THREE-REPORTS-STATUS.md` and `RECHECK-QUEUE.md` carry **per-report finality**.
2. Rule-49 queue rows **for these three only** close as each case is re-checked.
3. **No case on these three may still say its verdict is provisional pending development.**
4. **The other three reports' rows are not touched.**
