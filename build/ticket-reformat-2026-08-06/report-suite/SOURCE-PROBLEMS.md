# SOURCE PROBLEMS — the tickets whose source needed a decision, and the errors found in our own citations

**For the QA lead.** His standing ruling: *"Any ticket which do not have any source you need to give them
to me."* This is that list, plus the citation errors this pass found and corrected.

**Headline: every one of the 62 rewritten tickets now carries a source quoted verbatim from a
specification read live today, and all 122 source checks pass** (`snapshots/quote-verification.json`).
**Nothing had a source invented for it.** But five things below need your eye.

---

## PART ONE — five tickets whose source is weaker than the ticket used to imply

### 1 · [SV-8977](https://shopview.atlassian.net/browse/SV-8977) — half of it had no requirement at all

The ticket reported **two** things: the column heading row not staying stuck to the top, and the Totals
row not staying stuck to the bottom. Read live today, **only the first half has a requirement.** SBR
version 17 requirement **S10-R6** asks for the header row to be sticky and says nothing about the Totals
row; requirement **S10-R5** describes the desktop Totals row merely as *"a Totals row as the last row
inside the table."*

**What I did:** the rewritten ticket claims only the heading row, and its Source section says plainly
that the sticky-Totals half has no written requirement behind it and is not being claimed.
**Nothing was deleted from Jira** — the ticket still exists and still reports a real defect.

**Your call:** if a sticky Totals row is wanted, it needs to go to Chris Ward as a requirement question,
not to engineering as a defect.

### 2 · [SV-8879](https://shopview.atlassian.net/browse/SV-8879) — the specifications have caught up, and the old note is now wrong

When this was filed, its expectation rested on **Chris Ward's answer alone**, and it said so, adding that
*"four of the six specifications currently say the opposite."* **That is no longer true.** Read live
today, **four descriptions now require it in the same words** — Parts Velocity **S2-E4**, Technician
Utilization **S9-N1**, Inventory Value **S7-N1**, Sales By Representative **S21-N1**.

**Sales By Customer and Work In Progress still say nothing either way about the chooser** for a
single-location user, so for those two reports his answer remains the only source. The rewritten ticket
says exactly that.

### 3 · [SV-8966](https://shopview.atlassian.net/browse/SV-8966) — the customer half rests on a requirement about something slightly different

The location and date-range halves are squarely covered by SBC **S6-R5** and **S6-R6**. The customer half
was cited to **S18-R9**, and the ticket quoted it as *"in a subset selection, a selected customer that is
no longer present is dropped from the selection and must be re-selected to appear."* **The live S18-R9
does not say that.** It reads: *"When a date-range, Product Type, or location change re-loads the results,
the selection reconciles against the new set of present customers … ids no longer present are dropped."*
That is about a **reload**, not about restoring a remembered view.

**What I did:** quoted the live text and said in the ticket that the customer half is the weaker of the
two claims.

### 4 · [SV-8969](https://shopview.atlassian.net/browse/SV-8969) — the Advisor half is an inference from the other two

The Clear-action half is covered plainly by WIP **S7-R3** and **S7-R5**. The claim that the Advisor filter
should offer an *"All advisors"* item is not written anywhere: **S7-R1** describes the Advisor filter as
the same kind of multi-select as the other two but never names such an item. Stated as such in the ticket.

### 5 · [SV-8951](https://shopview.atlassian.net/browse/SV-8951) — a product question sits behind the defect

The requirement (TU **S7-R7**, **S7-R12**) is clear about what the spreadsheet holds and what the files are
called. But the **second spreadsheet option exists only because of Chris Ward's answer of 5 August 2026
(item T2-6, option B)**, and that answer did not settle whether the second spreadsheet should hold the
per-day rows or the same summary content, nor what the two files should be called. Carried into the
rewritten ticket as an honest caveat.

---

## PART TWO — five citation errors in our own tickets, found by re-reading the specs live and corrected

**Every one would have survived unnoticed if the quotes had not been re-verified against the live pages.**

| Ticket | What it cited | What the live specification says | Fixed how |
|---|---|---|---|
| [SV-8932](https://shopview.atlassian.net/browse/SV-8932) | Inventory Value **S12-R7** for the long-text rule | **S12-R7 is the dark-mode requirement.** The long-text rule is **S12-R6** | cited S12-R6, with a line in the ticket saying the reference was corrected |
| [SV-8963](https://shopview.atlassian.net/browse/SV-8963) | SBC S10-R3, quoted without its cross-reference | live text carries **"(S7-R12)"** inside it | quote corrected to the live text |
| [SV-8965](https://shopview.atlassian.net/browse/SV-8965) | SBC S20-R14, quoted with a clause missing | live text includes *"(their chevron and vehicle icon sit in from the customer)"* | quote corrected |
| [SV-8908](https://shopview.atlassian.net/browse/SV-8908) | WIP S7-R4 with *"vehicle identification number"* substituted | live text says exactly that in v9 — but the ticket's version had also dropped the closing sentence | quote corrected to the live text |
| [SV-8979](https://shopview.atlassian.net/browse/SV-8979) | SBR S17-R6 as **"44x44 px"** | live text is **"44×44 px"** with a multiplication sign | quote corrected |

**Also worth your eye, and it is the specification's own defect rather than ours:** the **Sales By
Representative page contains a mangled character**. Where it means the three-dot glyph, requirements
**S17-R6** and **S18-R9** hold `â‹¯` — the storage format literally contains `&acirc;&lsaquo;&macr;`. Our
tickets quote around it with an ellipsis rather than reproduce the mojibake to a reader. **Chris Ward may
want to fix the page.**

---

## PART THREE — the two tickets with no documented source at all: both closed, both untouched

The 2026-08-06 source-block pass flagged **[SV-8821](https://shopview.atlassian.net/browse/SV-8821)** and
**[SV-8822](https://shopview.atlassian.net/browse/SV-8822)** as having no documented source — invoicing
and customer-saving are not reporting features, and none of the six descriptions covers them.

**Both are closed (OBSOLETE / Done), so neither was rewritten and neither was touched.** SV-8821 is the one
you ruled on today — *"Marked it as AObsolete - ignore it for now."* Their existing descriptions already
say plainly that the specification is silent, so the record is honest as it stands.

---

## What I need from you

1. **SV-8977** — do you want a sticky Totals row? If yes it is a question for Chris Ward, not a defect.
2. **SV-8951** — Chris Ward still owes an answer on what the second spreadsheet should contain and what the
   files should be called.
3. **SV-8879** — nothing needed from you; recorded here only because the ticket's old *"four specifications
   say the opposite"* note was stale and has been corrected.
4. **The mangled character in the Sales By Representative specification** — worth a line to Chris Ward.
5. **Nothing else is outstanding on sources.** All 62 rewritten tickets carry a live-verified source.
