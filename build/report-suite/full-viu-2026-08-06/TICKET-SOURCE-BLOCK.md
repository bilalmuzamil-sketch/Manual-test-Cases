# MANDATORY: every ticket carries a SOURCE BLOCK at the bottom

QA lead's ruling, 2026-08-06, verbatim:

> "Make sure that if you create any ticket you MUST mention the source for the expected behavior in
> that ticket at the bottom of the ticket after a line break in clear and simple words for a layman
> to follow."

Refined the same day, verbatim:

> "Source can be the Story in Epic/Specs from PRD/Answer from the PO in an answer google spreadsheett,
> in case of google spreadsheet do provide the spreadsheet link and the row reference from that
> spreadseet"

## The rule

**EVERY ticket we file ends with a plain-English statement of WHERE the expected behaviour comes
from** — at the very BOTTOM, after a line break. Not the symptom, not the evidence: the **source that
makes the expectation legitimate**. A ticket that only describes what the build does gives a
developer no way to tell whether the expectation is real or merely our opinion. It is the same
failure the QA lead caught in our test cases — build behaviour presented as expected behaviour — and
it applies just as much to a ticket as to a case.

## The three valid source types, and the exact form of each

**1. A STORY IN THE EPIC**

> Where this expected behaviour comes from: the acceptance criteria on story SV-8591 in epic SV-8582,
> which say: "&lt;quoted&gt;".

**This is the one to use for the ~10,000-row export cap** — it appears in NO specification, only in
story SV-8591, so any ticket touching it names the STORY, never a spec.

**2. THE SPECIFICATION (PRD)**

> Where this expected behaviour comes from: the Technician Utilization report specification, version
> 6, requirement S10-R4, which says: "&lt;quoted&gt;".

Always the version number **and** the requirement reference. Use the **Confluence** version, never
the version written inside the page body — that field is a known trap (Rule 31a).

**3. A PO ANSWER IN A GOOGLE SPREADSHEET — needs BOTH the link and the row**

> Where this expected behaviour comes from: Chris Ward's answer in our questions spreadsheet —
> &lt;full link&gt; — tab "&lt;tab name&gt;", row &lt;N&gt; (question &lt;M&gt;), where he answered:
> "&lt;quoted&gt;".

**THE ROW REFERENCE IS MANDATORY.** A bare link to a multi-tab sheet with dozens of rows is not
checkable, and the whole point is that a developer can verify it **without asking us**. Give the tab
name and the row, the question number if the sheet uses them, and quote his actual words. Chris's
sheets do use tab names and item numbers — an earlier one had item 1.0 on the tab "Urgent - Location
column" at cell D6 — so use that same precision.

## Constraints that still apply

- **Quote the source's own words** wherever they are short enough.
- **Plain layman words** (Rule 7). A non-technical reader must be able to follow it.
- **NO case IDs and no "QA test cases affected" section.** Name the DOCUMENT, never our test case.
- **If a PO answer differs from the specification, SAY SO plainly** — "the specification says X, but
  Chris Ward's answer of &lt;date&gt; supersedes it" — never imply plain spec agreement where there
  is none.
- **If there is genuinely NO documented source, DO NOT INVENT ONE.** Say plainly that the
  specification is silent and what the expectation actually rests on — and reconsider whether it
  should be filed at all. **Rule 57: an unsourced expectation is not a defect, it is a question for
  the product owner.**
- Everything else is unchanged: seven-section body, Story Defect (10007), parent the owning story,
  priority Low, `relates to` link, no Product Area.

## Report duty

For every ticket filed, report **that the source block is present and which of the three types it
uses**.

## Retrofit

**Do NOT retrofit tickets already filed.** The QA lead is doing those in one pass, to avoid
collisions. The only already-filed ticket touched under this rule is **SV-8937**, and only because he
explicitly asked for it to be widened and given the block at the same time.
