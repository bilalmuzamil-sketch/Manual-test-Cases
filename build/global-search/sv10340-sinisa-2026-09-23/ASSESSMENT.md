# Is Sinisa right on SV-10340? — checked 23 September 2026

His comment, 23 Sep 01:55 (Jira):

> This was discussed in yesterday's SU. There is also a comment in the PRD explaining how this works.
> "Nothing has an "updated at" — no source table carries one. Actual tie-breaks after score:
> • Customers — none, `company` has no date column at all → falls to id order
> • Assets — created date · • Vendors — created date
> • Parts — last sold date, but only 8.9% have one → rest falls to id order
> • Work orders / part sales / purchase orders / vendor invoices — id only, but ties are rare:
> recency is already in the score, decayed over start date / creation date / invoice date"

## 1 · Everything he states as fact checks out

**The PRD comment exists.** Inline comment **879427609** on page 576978945, anchored to exactly the
sentence `ties are broken by recency (most recently updated wins)`. Body matches his quote word for
word. Author: **Sinisa Nogic**. Status: **open — not resolved**.

**The page itself corroborates the customers claim, independently of him.** The v1.5 change-log entry
in the body — written before his comment — reads:

> The Customer "created in last 90 days" ranking signal is dropped — no creation date exists on the
> company table and none is added

**His account predicts every reading I took.** That is the strongest point in his favour: my three
measurements and his explanation agree about the behaviour.

| Tab | What he says the tie-break is | What I measured on 22 Sep | Agrees? |
|---|---|---|---|
| Customers | none → id order | renamed the second-listed one; it stayed second | yes |
| Vendors | created date | two created seconds apart, renamed one; order unchanged | yes |
| Parts | last sold date, else id order | two fresh parts with no sales, renamed one; stayed second | yes |
| Assets | created date | could not be proved by renaming | consistent |

**"Recency is already in the score" is also true** — §6.1 carries per-entity recency decay (e.g.
*"recency of invoice date, exponential decay with 30-day half-life, up to +0.20"*).

## 2 · One thing in his framing is not right, and it matters

> *"There is also a comment in the PRD explaining how this works."*

That reads as pre-existing documentation QA should have read. It is not.

| | |
|---|---|
| SV-10340 raised | **22 Sep, 08:40** (−0500) = 13:40 UTC |
| The PRD comment written | **22 Sep, 12:24** (−0500) = 17:24 UTC |

**The comment was written three hours and forty-four minutes AFTER the ticket was raised, by him.**
It could not have been read beforehand. Nothing was missed.

## 3 · Where it leaves the ticket — it does not dispose of it

**The requirement is unchanged.** Page 576978945 is still **version 17**, last edited **8 September**
— before any of this. §6.1 still reads, word for word:

> The score is clamped to a sane range; ties are broken by recency (most recently updated wins).

An **unresolved inline comment is not an amendment.** The document is the source (Rule 57); a note
recording an implementation constraint does not rewrite the requirement, and a code-vs-document
conflict is a product decision, never a silent invariant (Rule 96).

**But the ticket's framing is now wrong and should change.** It reads as *"the tie-break was not
implemented"*, which implies a coding oversight and a central fix. What is actually true:

- the product **does** break ties by recency where a date exists — created date, last sold date;
- what it cannot do is the **parenthetical**: *most recently **updated** wins*. No table carries an
  updated-at;
- so this is **a requirement the data cannot satisfy**, not a defect against a buildable requirement.

## 4 · What we do, and what is his to decide

**Ours:** nothing changes on the test case. **C55716 stays Failed** — it is measured against the
document, and the document still says what it says. Rule 114: the Expected is never edited, not even
to match a developer's comment. It flips when the PRD sentence changes, not before.

**His / the Product Owner's** — three ways, and the ticket should be re-pointed at whichever he picks:

| Option | What happens | Cost |
|---|---|---|
| **Amend the PRD sentence** to describe what the data supports (created date / last sold date / id) and resolve the inline comment | the ticket closes as "specification corrected", C55716 is re-run against the new wording and passes | none beyond the edit — it is the honest description of the product |
| **Keep the requirement and add an updated-at** to the source tables | genuine development work across several tables plus a re-index | real, and nobody has asked for it |
| **Split it** — keep "most recently updated" only where a date already exists | partial | leaves the rule inconsistent between tabs, which is what makes ranking hard to reason about |

**Recommended:** the first. The requirement was written without knowing the data could not carry it;
the product's behaviour is reasonable; the document should say what is true.

**No comment has been posted on the ticket.** The QA lead said not to without his permission.
