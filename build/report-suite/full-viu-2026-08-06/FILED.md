# Jira — what was filed, and the new standing rule

## ⚠️ RULE CHANGE, 2026-08-06, mid-session — READ THIS FIRST

The QA lead withdrew the standing authorisation to file defects, verbatim:

> *"For now we need to create the test cases which are authentic, so that when Vlad does the
> automation or when the QA manual tester runs it he can find it and report the issue. However you
> can keep on sharing such things to me and ask me if I want to create a ticket for such things. Not
> stoping you for providing my such insights are deep testing just asking you to just ask me if I
> want to create a ticket for that or not."*

**From now: no ticket is filed. Every finding is brought to him as a question, with a ready-to-file
package below.** The deep testing does not change — establish the mechanism, duplicate-search, and
try to disprove it first.

## ⚠️ HONEST DISCLOSURE — SEVEN TICKETS WERE FILED AFTER THE EIGHT, BEFORE THE RULE REACHED ME

The rule change names **SV-8925–SV-8932** as the eight that stand. **Seven more had already been
filed by the time the message arrived** — during the Parts Velocity batches, under the standing
authorisation that was in force at that moment. They are listed below. **Nothing has been filed
since, and nothing further will be.**

**They have NOT been withdrawn.** Withdrawing them is the QA lead's call, not ours — a ticket
carrying its reasoning on the record is worth more than a deleted one (Rule 51's precedent), and
reversing his own systems unasked is exactly the mistake Rule 53 exists to prevent. **His decision
is needed on whether to keep or close these seven.**

| Key | Parent story | Summary |
|---|---|---|
| [SV-8934](https://shopview.atlassian.net/browse/SV-8934) | SV-8646 | Parts Velocity PDF prints Description, Category and Vendor in full instead of shortening them to 18 characters |
| [SV-8935](https://shopview.atlassian.net/browse/SV-8935) | SV-8646 | Parts Velocity spreadsheet prints Last Sale as the words "54 days" instead of a plain number |
| [SV-8936](https://shopview.atlassian.net/browse/SV-8936) | SV-8646 | Parts Velocity download success message is a general one and does not name the report or the file type |
| [SV-8937](https://shopview.atlassian.net/browse/SV-8937) | SV-8646 | Parts Velocity PDF heading shows an end date one day later than the range asked for, and is labelled "Start Date Range" |
| [SV-8938](https://shopview.atlassian.net/browse/SV-8938) | SV-8643 | Parts Velocity Location column sits sixth, after Vendor, instead of first before Type |
| [SV-8939](https://shopview.atlassian.net/browse/SV-8939) | SV-8642 | Parts Velocity opens on All locations instead of the location the user is working in |
| [SV-8940](https://shopview.atlassian.net/browse/SV-8940) | SV-8643 | Parts Velocity never shortens long Description, Category or Vendor text, so the table runs far wider than the window |

All seven are in the Rule-52 shape: issuetype **Story Defect (10007)** · parent = the **owning
story** · priority **Low** · `relates to` link to the same story · **no Product Area** · seven-section
body naming the exact test data. Every field was read back — **11 checks each, all PASS**. No
existing ticket was edited, commented on, transitioned or re-prioritised.

**Because these seven tickets DO exist, the seven cases that point at them correctly carry the
normal Rule-61 block naming the ticket** — per the coordinator's own instruction. If the QA lead
closes any of them, those blocks need rewording to the no-ticket variant in the same pass.

## CANDIDATES — AWAITING AUTHORISATION

**None outstanding.** Every deviation found on Inventory Value and Parts Velocity was filed before
the rule changed. The next report driven (Technician Utilization) will produce candidates here
instead of tickets.

### The package each future candidate must carry

1. The exact symptom, in plain words a non-technical reader can picture.
2. The **mechanism** — not just the symptom. What makes it happen, and at what boundary.
3. The specification requirement it breaches, **quoted verbatim** with its anchor and spec version.
4. The **duplicate search actually run**, and what it returned.
5. The **exact test data by on-screen name** — part number, customer, location, date range, role.
6. What was **tried and ruled out**, so the reader cannot dismiss it as a mis-set filter.
7. The **owning story** it would be parented to.
8. The **full seven-section body**, ready to submit unchanged.

One word from the QA lead is then enough to file it.

## Two candidates that were DISPROVEN and must never be filed

Recorded here so nobody re-raises them.

**(a) The ~10,000-row export refusal is deliberate, and it is in the epic.** Both export formats
return HTTP 400 on the Parts Velocity default view (10,064 rows) with *"This report is too large to
export. Narrow the date range or filters, then try again."* That is the **10k row-cap guard named in
epic story [SV-8591](https://shopview.atlassian.net/browse/SV-8591)** — *"[Reports Suite][A3] Export
contract + 10k row-cap guard"*. Under Rule 57 an epic story is a source of expected behaviour, so
this is **expected**. **What IS worth asking Chris Ward: none of the six specifications mentions the
cap**, and it means the Parts Velocity first-visit view cannot be exported at all.

**(b) The header-click sort is correct.** A snapshot taken four seconds after a click still showed
the previous order and the previous request, reading exactly like *"the second click does not
reverse the direction"*. Four clicks driven in sequence, reading the header's own sort class
alongside the rows, showed the real cycle: first click **ascending**, second **descending**, third
**ascending**. A stale read, and the same trap that nearly produced a false report on the previous
pass.

## Rule-61 block census, live over all 476

| | Count |
|---|---|
| `AUTOMATION: READY` | 385 |
| `AUTOMATION: READY - EXPECT FAIL (SV-xxxx)` | 45 |
| `AUTOMATION: HOLD` | 33 |
| no plain-text marker (the 13 raw-markup cases) | 13 |

Of the 45 expect-fail cases: **35 carry the ticketed Rule-61 three-outcome block**, **0 carry the
no-ticket variant** (every deviation found so far has a ticket), and **10 carry no block at all** —
C30500, C30510, C30512–C30518 and C38918, the Work In Progress export set. Those 10 are deliberately
blank: the failure has never been reproduced, and **a symptom nobody has seen must never be
written**.
