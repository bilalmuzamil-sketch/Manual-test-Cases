# The 5 closed tickets that were deliberately NOT rewritten

**Reasoning, in one line: nobody is asked to reproduce a closed ticket, so rewriting one is
churn.** The complaint from the POs and from Stefan is that our tickets are hard to
understand and hard to replicate. That complaint can only bite on a ticket somebody is
actually being asked to work. All five below are closed, so none of them will be handed to
a developer to reproduce.

**All five were proven UNTOUCHED after the pass** — byte-compared against their pre-edit
snapshot including `updated`, which is the field that would move if we had written to them.
145 to 403 fields compared each, **0 moved on all five**
(`snapshots/final-audit.json` → `closed_untouched`).

Their full old descriptions are recoverable from `snapshots/pre-edit/` in this commit, the
same as the 22 that were rewritten.

| Ticket | Project | Status | `updated`, unchanged by us | Why it was skipped |
|---|---|---|---|---|
| [SV-8843](https://shopview.atlassian.net/browse/SV-8843) | Filters | OBSOLETE / Done | 2026-08-06T02:49:10-0500 | closed — and see the note below |
| [SV-8844](https://shopview.atlassian.net/browse/SV-8844) | Filters | OBSOLETE / Done | 2026-08-06T02:49:11-0500 | closed; the fault it reported is fixed |
| [SV-8847](https://shopview.atlassian.net/browse/SV-8847) | Filters | OBSOLETE / Done | 2026-08-06T02:49:15-0500 | closed — and see the note below |
| [SV-8902](https://shopview.atlassian.net/browse/SV-8902) | Schedule | OBSOLETE / Done | 2026-08-05T12:33:55-0500 | not a defect at all — a disposable `ZZAUTOTEST` probe |
| [SV-8923](https://shopview.atlassian.net/browse/SV-8923) | Schedule | OBSOLETE / Done | 2026-08-06T01:07:57-0500 | withdrawn by us as a **false defect** |

## The ones that need a word from you

### SV-8923 — withdrawn as a false defect. Leave it closed.

We raised it, then withdrew it, and that was right: it was raised against a shop that had
**no business hours configured**, which is precisely what the source test case's own
precondition required. The defect was ours, not the build's. Closed and untouched, and it
should stay that way.

### SV-8843 and SV-8847 — closed, but our records say they still reproduce

Both were closed as OBSOLETE, and our own live records say the behaviour they describe is
**still happening on the branch, byte-identically**. They have **not** been reopened here —
that is your call, not ours, and reopening somebody else's closure cuts across their triage
(Standing Rule 53's corollary).

They are listed so the decision is visible rather than lost. Note that they are **not**
symmetrical:

- **SV-8843** — its central claim is right (the filter bar does sit on the same row as the
  tabs) but **its own stated reason is wrong**: it says collapsing frees no space, and
  collapsing does free space. So reopening it as written would hand a developer a ticket
  that is half incorrect.
- **SV-8847** — both halves still reproduce, except that "clearing filters does not clear
  the query" now passes.

### SV-8845 — closed once, but it is OPEN again, so it WAS rewritten

Worth flagging so nobody trips over it: Ahtasham Amjad closed SV-8845 as OBSOLETE on
5 August, it was reopened, and today **Milos Vasic moved it to Ready to Fix and assigned
Dusan Radulovic**, and **Stefan Mitrovic raised its priority Low → Medium at 13:11Z**. It is
live development work, so it is in the rewritten 22 — and **only its description body was
changed**. Type, parent, priority, status, assignee, links, labels and attachments were all
byte-verified unchanged.

### SV-8845's third recommendation, unchanged

Separately from all of the above, our standing recommendation is that **SV-8845 is the one
worth reopening** among the closed set — which is now moot, because it already is open.

## Outstanding — what I need from you

1. **Reopen SV-8843 and/or SV-8847?** Both still reproduce. If you reopen SV-8843, its
   stated reason needs correcting first, or the developer gets a half-wrong ticket.
2. **Nothing else.** SV-8923 stays withdrawn, SV-8902 is a probe, SV-8844 is genuinely fixed.
