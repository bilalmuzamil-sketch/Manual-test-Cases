# How many defects are prepared and waiting on the Jira button? — counted live, 22 September 2026

**Counted from run 415 itself, not from a summary line** (Rule 100). Every one of the 203 tests was
read live, every non-passed test's latest comment was scanned for held-ticket wording, and every
ticket key found was checked live in Jira.

## The answer: **ONE.**

| # | Test | Heading the ticket would carry | State |
|---|---|---|---|
| 1 | **C53476** | *Global Search All Tab Counts Past the 20-Result Limit the Other Tabs Respect* | **PREPARED — body, picture, sources all written; nothing filed.** Needs his go-ahead **and** a decision on the owning story, because the natural owner **SV-9169 is OBSOLETE** |

Body: `TICKET-DRAFT-C53476.md`. Picture: `../rerun-2026-09-21/TICKET-53476-all-tab-count.png`.
Reconciliation: `DEFECT-READINESS-2026-09-21.md` §1.

## Four others LOOK like they are waiting, and are not. All four were checked again today.

| Test | Why it is not a prepared ticket | Where it actually sits |
|---|---|---|
| **C55716** — recency tie-break | Withdrawn 21 Sep: no customer record on this branch carries a last-changed date, so the precondition cannot be proved and *"the rule is ignored"* is indistinguishable from *"there is no date to read"* (Rule 104 proof 7) | **Product-owner question** |
| **C44861** — no count beside the persisted query | Withdrawn 21 Sep: the requirement as it reads today asks only for plain text. The count comes from a **July design capture the PRD has since replaced**. The product is right (Rule 106 outcome 4) | **Case-wording question with him** (Rule 114 bars me editing Expected) |
| **C45160** — no usage event on selecting a result | Withdrawn 21 Sep in `../run415-execution/close-out-2026-09-21/TICKET-DECISION-2026-09-21.md`: usage recording was deliberately removed from this version (§2 non-goals, the v1.5 change log, and SV-9167 cancelled). **Its run comment still said a ticket was written and waiting — corrected today.** | **PO register row PO-REG-4**, unanswered since August |
| **C55685** — a correct spelling returns unrelated records | **Already filed as [SV-10025](https://shopview.atlassian.net/browse/SV-10025), Ready to Fix.** Its run comment still said *"no report has been written for this yet"* — **corrected today**, so nobody raises a duplicate | **With development** |

## Everything else that failed already carries its report

Ten of the fourteen failures name a live ticket: SV-10159 (C44825) · SV-10163 (C44836, C55706) ·
SV-10181 (C44865) · SV-10001 (C45153, C53601) · SV-10055 (C53605) · SV-10060 (C55660) ·
SV-10061 (C55673) · SV-10025 (C55685).

## Two earlier-looking entries that are already closed out

`OUTSTANDING-ITEMS-REGISTER.md` §A still opens with *"Four bug reports, written and waiting on your
word"* (10 September, Inline Add/Edit Parts and Printer Friendly WO). **All four were filed** —
among them SV-9917 and SV-9918 — and have since been moved to OBSOLETE. That section is stale and is
not part of this count.

**Run 415 as it stands: 203 tests · 174 passed · 14 failed · 15 blocked · 0 untested.**
