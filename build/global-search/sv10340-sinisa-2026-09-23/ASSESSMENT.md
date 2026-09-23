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

## 2 · One thing in his framing is not right — the exact order, and what is NOT being claimed

**THE ORDER, all in UTC, each read live:**

| # | When | What |
|---|---|---|
| 1 | **22 Sep 13:40:02** | SV-10340 raised (by us) |
| 2 | **22 Sep 17:24:53** | Sinisa adds the note to the requirements page — **3h 44m after the report** |
| 3 | **23 Sep 06:55:17** | Sinisa comments on the ticket pointing at that note — **13h 30m after writing it** |

**⚠️ WHAT IS NOT BEING CLAIMED.** He did **not** add the note after commenting on the ticket — the
note came first, the ticket comment second. Nor is any of this an accusation of back-filling: a
developer writing up an explanation in response to a bug report is normal and useful, and the
explanation is a good one.

**AND THE SHARPER POINT: he did not update the PRD at all.** Page 576978945's own version history,
read live:

| version | when | note |
|---|---|---|
| **v17 (current)** | **2026-09-08 10:55** | v1.5 — engineering questions from #fs-global-search resolved |
| v16 | 2026-09-04 13:10 | v1.4 correction — result counts cap at 20 |

**No version exists after 8 September.** The requirement's text has not been touched. What was added
is an inline note in the margin against the sentence — which is why *"there is a comment in the PRD
explaining how this works"* is literally true and still does not dispose of the report.

**Why the timing matters at all:** only because his wording presents the note as pre-existing
documentation QA should have consulted. It was not available to consult when the report was written.

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

---

## 5 · Closed by the QA lead, 23 September — *"Ok leave it"*

No reply was drafted or posted to Sinisa, and none is to be. **Do not re-open this with him.**

State left as it stands: SV-10340 is **Open**, and **C55716 stays Failed** — measured against the
requirement, which is unchanged (page 576978945 still v17, 8 September). It flips if and when that
sentence changes, not on the strength of an unresolved margin note. The analysis above is kept as
the record of why, so a later session finding the check red can read it rather than ask him again.
