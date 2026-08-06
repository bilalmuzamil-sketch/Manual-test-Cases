# The three closed tickets — not rewritten, and why. For the QA lead to overrule if he wants.

Three of the 65 Report Suite tickets we created are closed. **They were not rewritten, and not touched at
all** — all three are byte-identical to their pre-edit snapshots, including `updated_on`, proven by the
final live re-read (`snapshots/FINAL-VERIFICATION.json`).

| Ticket | Type | Status | Parent | Title |
|---|---|---|---|---|
| [SV-8819](https://shopview.atlassian.net/browse/SV-8819) | Bug | **Done / Done** | SV-8582 | Parts Velocity: Turns / Yr is overstated on the "This Year" preset — it divides by one day too few |
| [SV-8821](https://shopview.atlassian.net/browse/SV-8821) | Bug | **OBSOLETE / Done** | none | Creating an invoice from a completed work order fails with a server error |
| [SV-8822](https://shopview.atlassian.net/browse/SV-8822) | Bug | **OBSOLETE / Done** | none | Saving a customer returns a server error instead of a validation error when a sales-rep id is supplied |

## The reasoning, which is the QA lead's own

**Nobody is being asked to reproduce a closed ticket.** The complaint from the POs and from Stefan is that
the tickets are too big to understand and to replicate — that complaint cannot apply to a ticket nobody
is working. Rewriting them is churn: three more writes, three more audit rows, and no reader helped.

**And one of them he ruled on explicitly today**, about SV-8821: *"Marked it as AObsolete - ignore it for
now."* Reopening its description to reformat it would sit oddly beside that.

## Do I disagree? No — with one qualification about SV-8819

**SV-8819 is the only one worth a second thought**, because unlike the other two it is **Done rather than
obsolete** — it describes a real arithmetic fault that was accepted and fixed, so its description is the
record of what was fixed. If anyone ever needs to re-verify that fix, they will read this ticket, and its
current description is one of the longest in the set: a full technical appendix with an A/B probe, per-row
arithmetic and a warning that the fault is narrower than it looks.

**But that length is exactly what makes it useful for a re-verification**, and it is not a ticket anyone is
being asked to reproduce cold. So the recommendation stands: **leave it.** If you would rather it were
reformatted for consistency, it is one write and I can do it on a word from you.

**SV-8821 and SV-8822 should certainly be left alone.** Both are withdrawn — SV-8822 was withdrawn under
Standing Rule 51 as API-only — and both are among the two tickets in the whole estate with **no documented
source** (see `SOURCE-PROBLEMS.md` Part Three). Their descriptions already say so plainly. Rewriting a
withdrawn ticket to a defect-reporting format would make it look live again.

## What is owed if you overrule

If you want all three rewritten, the work is already prepared: the pre-edit snapshots are in
`snapshots/pre-edit/`, and the authoring for each would take the same five-part shape as the other 62.
Say the word and it is three writes.
