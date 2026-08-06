# Source problems found while rewriting the eight closed tickets

**For the QA lead.** His standing ruling: *"Any ticket which do not have any source you need to
give them to me."* Three things below need his eye. **Nothing had a source invented for it.**

Every requirement quoted in the eight rewritten bodies was read from the **live** Confluence page,
and the page versions were re-checked immediately before the writes (Standing Rule 59) —
**Filters 19, Schedule 25, Parts Velocity 5**, none moved.

---

## 1 · A citation on SV-8923 quoted a sentence that is not in the specification

**Found, corrected in the rewrite, and worth knowing about because it is the kind of error the
source block exists to catch.**

The old body of [SV-8923](https://shopview.atlassian.net/browse/SV-8923) quoted the Schedule
specification as saying:

> *"With the toggle on, the hours OUTSIDE the working day are shaded with a grey overlay."*

**That sentence does not appear anywhere in the live page.** Searched the whole of version 25:
`hours OUTSIDE the working day` returns nothing. The old body also cited *"version 23, section 9
and section 4.8"*, and the live page is at **version 25**.

What the specification actually says, read live and now quoted on the ticket:

| Where | What it says |
|---|---|
| section 4.8, *Day view: timeline interactions* | *"Business-hours shading. An optional grey overlay outside working hours."* |
| section 9, *View options and customization*, the View Options table | *"Business Hours … Off … Shades non-working hours in day view."* |

The **meaning** was right, so no verdict changes. But it was a paraphrase presented inside
quotation marks as the specification's own words, and it named the wrong version. Both are fixed.

**Nothing needed from you.**

---

## 2 · Two tickets have no documented source at all, and their bodies now say so

Both are Report Suite tickets, both closed, and both were already flagged this way by the
source-block pass. **Their rewritten bodies state it in plain words instead of implying a
requirement exists.**

| Ticket | Why there is no source | What the expectation rests on instead |
|---|---|---|
| [SV-8821](https://shopview.atlassian.net/browse/SV-8821) | creating an invoice is not a reporting feature, and none of the six report descriptions mentions it | ordinary robustness — a missing contact should produce a clear message, not a general server error |
| [SV-8822](https://shopview.atlassian.net/browse/SV-8822) | saving a customer is not a reporting feature either, and none of the six descriptions mentions it | ordinary robustness — an unrecognised field should produce a validation message |

Both bodies say the specification is silent, say what the expectation actually rests on, and — in
SV-8822's case — say that if the team's view is that it does not matter, that is a reasonable
answer, which is why it is closed.

**Nothing needed from you unless you disagree with leaving them closed.**

---

## 3 · SV-8902 has no source because it is not a defect

[SV-8902](https://shopview.atlassian.net/browse/SV-8902) is a throwaway probe we created to
establish whether Jira permits a ticket of this kind to be parented to a Story. Its Source line
says plainly: no product requirement stands behind it, and none is claimed.

It exists at all only because our account **cannot delete a Jira issue** — `DELETE` returns
HTTP 403 — so a probe leaves a permanent closed record. Worth knowing before anyone probes again.

**Nothing needed from you.**

---

## OUTSTANDING — what I need from you

1. **A decision on [SV-8843](https://shopview.atlassian.net/browse/SV-8843) and
   [SV-8847](https://shopview.atlassian.net/browse/SV-8847).** Both are closed as OBSOLETE and our
   own live records say the behaviour still happens. Nothing was reopened — reopening another
   person's closure is yours to decide. Note SV-8843 is **not** a clean reopen: half of its own
   stated reason is wrong, and the rewritten body now says which half.
2. **A word on [SV-8902](https://shopview.atlassian.net/browse/SV-8902)** if you would rather the
   probe carried the five headings like everything else. It is one write. My reading was that
   giving a probe "Steps to reproduce" and "Expected behaviour" would dress it up as a defect.
3. **Nothing else is outstanding on sources for these eight.** Every requirement they quote was
   read live today and every quotation was checked against the page text.
