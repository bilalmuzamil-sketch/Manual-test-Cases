# Filters — tickets, 5 August 2026: what was filed and what deliberately was not

## Filed: NOTHING

**No new defect ticket was created by this pass.** Every user-facing fault observed live already has a
ticket, and Standing Rule 38 forbids touching another author's ticket. A duplicate would be worse than
nothing — it splits the conversation and inflates the defect count.

## Every fault observed live, and the ticket that already covers it

| Observed live this pass | Existing ticket | State | Why nothing was filed |
|---|---|---|---|
| A single filter's own sheet on a phone applies on tap and has **no Apply Filters button**, contradicting S12-R6 | **[SV-8875](https://shopview.atlassian.net/browse/SV-8875)** | Story Defect, **Open**, Medium, parent SV-8797, Ahtasham Amjad | Covers it exactly, and **names our own C29622 / C29623 / C29624** in its own text. Filing again would duplicate it. Not touched. |
| **No Clear Filters control on a phone** while filters are active | **[SV-8846](https://shopview.atlassian.net/browse/SV-8846)** | Story Defect, **Open**, Low, parent SV-8797, **ours** | Still open, still accurate. The QA lead's standing ruling names SV-8846 as one of the two valid Filters tickets. |
| The filter bar sits **beside** the tabs, not below (S1-R1) | **[SV-8843](https://shopview.atlassian.net/browse/SV-8843)** | Bug, **OBSOLETE / Done** | Already reported. **Closed under our own account on 4 Aug 21:41:31-0500.** Re-filing a ticket the QA lead closed would be presumptuous; the contradiction is reported instead. |
| The empty-state message never mentions the search, and there is no way to clear the query (S8-R3, S8-R4) | **[SV-8847](https://shopview.atlassian.net/browse/SV-8847)** | Bug, **OBSOLETE / Done** | Same — closed under our own account on 4 Aug 22:02:41-0500. |
| On a phone **every** filter link is ignored and `estimate` is sent instead | **[SV-8845](https://shopview.atlassian.net/browse/SV-8845)** | Bug, **OBSOLETE / Done**, closed by **Ahtasham 5 Aug 04:41:58-0500** | **This pass proved it still reproduces**, and on three different statuses. Reopening is the QA lead's call, not ours. Reported here and qualified on the cases. |
| A restored Customer / Lead Technician / Service Advisor button comes back without its value name | **[SV-8871](https://shopview.atlassian.net/browse/SV-8871)** | Bug, **Open**, Low, parent SV-8785, **ours** | Already filed 5 Aug. |
| A remembered filter value that was deleted is still sent to the server | **[SV-8832](https://shopview.atlassian.net/browse/SV-8832)** | Story Defect, **Open**, Ahtasham | Already filed. |
| Saved filters do not auto-restore after closing the tab | **[SV-8828](https://shopview.atlassian.net/browse/SV-8828)** | Story Defect, **Open**, Ahtasham | Already filed. |

## The three closed-but-still-reproducing tickets — the contradiction, stated plainly

**SV-8843, SV-8845 and SV-8847 are all closed, and all three still reproduce on `v3.4.2-d00239b`.**

That is a contradiction between the ticket state and the build, and it is being **reported, not
resolved**, because closing and reopening tickets is the QA lead's decision. Two of the three were
closed under **our own shared account**; the third by Ahtasham.

**What was done instead:** each affected case keeps the documented expectation, carries a plain note
naming the ticket, and its marker reads
`AUTOMATION: READY - EXPECT FAIL (SV-88xx - reported, closed without a fix)` — so an automation
engineer knows to expect the failure and **no tester waits for a fix that is not coming**.

**What is needed from the QA lead:** a decision on whether to reopen any of the three. Our recommendation
is that **SV-8845 is the one worth reopening** — the phone ignores every shared filter link entirely,
which is a functional data-correctness fault, not a layout preference.

## A ticket about our own work, which we did not touch

**[SV-8876](https://shopview.atlassian.net/browse/SV-8876)** — Ahtasham Amjad, 5 Aug 06:17:01-0500,
status **Ready** — *"Clarification Required: Filter bar on same row as tabs contradicts S1-R1 (below
tabs) and the design — not recorded in PRD"*. It quotes **C29557's waiver note back at us** and says
*"a test case has waived it without the PRD being updated"*.

**He was right, and he found it before we did.** The waiver is now gone from all five cases. His ticket
is a clarification request for **Branko** and it is the correct vehicle, so it stands untouched
(Rule 38). It is the one genuinely open product question left on Filters.

## Rule 51 — API-related faults

**None.** Every fault above is reachable from the product's own screens by an ordinary user on a phone
or a desktop browser. Nothing here required calling an endpoint with a request the screens never send,
so there is no API ticket to ask about. `API-ASK.md` is therefore not needed this pass.
