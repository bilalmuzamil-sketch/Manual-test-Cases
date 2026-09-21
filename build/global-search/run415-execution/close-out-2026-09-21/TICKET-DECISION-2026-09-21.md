# Both proposed tickets were withdrawn BEFORE filing — the pre-flight that SV-10277 and SV-10279 did not get

**Date** 21 September 2026 · the QA lead gave the go-ahead (*"Yes create with annotated screenshots
and make sure the tickets you create does not bite me the way it did this morning"*). Applying
skill 19 and Rules 62-c, 106 and 112 **before** writing either one killed both. **Nothing was filed.**

---

## TICKET 1 — C45160, "selecting a result no longer records the usage event" → **NOT A DEFECT, IT IS AN UNANSWERED PO QUESTION**

The observation is sound and stands: selecting a result sends no usage event, proved against a
working positive control (`page_search` fires from the work orders list on the same branch).

**What kills the ticket is the BASIS, not the observation.** Our own regression analysis already
recorded this as an open product-owner decision and **never got an answer**:

`build/global-search/regression-2026-08-26/PO-DECISION-REGISTER.md`, row **PO-REG-4**:

> | PO-REG-4 | Selecting a result fires a **Google Analytics `global_search_use`** event (INV-48). |
> §6.4 defines a **new** telemetry schema (impressions/clicks). | (a) keep GA event AND add new
> telemetry; (b) replace GA with new telemetry. | Confirm whether the existing GA event remains
> alongside §6.4 telemetry. | **— (answer column empty)** |

And `REGRESSION-IMPACT-MATRIX.md` line 33 classes it **"SILENT vs new telemetry §6.4"**, MED risk —
i.e. **we recorded from the start that the V2 specification does not say whether this survives.**

Three more things a developer would say within an hour, all correct:

1. **The telemetry story SV-9173's sibling SV-9167 is OBSOLETE** (read live 21 Sep, resolved Done) —
   telemetry was cancelled, so "no event fires" is the expected consequence of a decision, not a bug.
2. **PRD §2 non-goals** name *"the search telemetry that would feed [an ML model] — no impression or
   click logging in v1"*, and the **v1.5 change log** says *"Telemetry removed entirely — §6.4
   deleted, impression/click logging dropped from §8"*. A reasonable reader takes that as covering
   this event.
3. **The case's own stated authority does not exist.** C45160's Expected cites *"Standing Rule 109 —
   the shipped V1 product IS the specification"*. **Rule 109 has no text in `RULES-61-ONWARD.md`** —
   recorded as a gap on 2026-09-16 (rule 110's note). Our basis is weaker than the case claims.

**Rule 58** — an ambiguous source is never resolved by looking at the build; hold and ask. **Rule 96**
— a V2 code-vs-document conflict is *"a PO DECISION ITEM, never a silent invariant"*. This is
textbook both. **⇒ It goes on the product-owner question sheet (PO-REG-4 is already there, awaiting
an answer), not into Jira.** The run result stays Failed with the reason; no ticket.

## TICKET 2 — C55706, "prices not shown to a user allowed to see them" → **ALREADY FILED; A SECOND ONE WOULD BE A DUPLICATE**

Re-read the case and the recorded result rather than trusting the summary line "no ticket named".
The actual failure is **one field**: a **part sale line shows no total price**. Everything else the
specification puts on a search line — purchase order totals, vendor invoice totals — shows in full.

That exact fault is **already raised**:

> **SV-10163** — *Global Search – Part Sale Rows Do Not Show a Total Price* — status **Ready to Fix**,
> unresolved, parent **SV-9170** (TESTING QA). Read live 21 September 2026.

**⇒ No new ticket.** The run result has been rewritten to carry SV-10163's number and link, so the
run is traceable to the report that already exists (Rule 113's append step, applied to a ticket that
was already open).

---

## WHY THIS IS THE POINT

SV-10277 and SV-10279 were both filed on a sound-looking observation with an unsound basis, and both
had to be marked obsolete within a day. The difference here is only that the basis was checked
**before** the button, not after. The checks that caught it, in the order they fired:

1. **Rule 106** — reconcile the case's Expected against the source **as it reads today**. C45160's
   cited authority turned out not to exist; C55706's Expected turned out to describe a narrower
   fault than the title suggests.
2. **Rule 112** — read the owning story live. SV-9167 cancelled; SV-9170 in Testing QA.
3. **Rule 62-c** — reproduce on the build as it stands today. Both reproduce; that was never the issue.
4. **Search the repo before claiming anything new (Rule 97).** `PO-DECISION-REGISTER.md` and
   `REGRESSION-IMPACT-MATRIX.md` had already answered the first question in August, and
   **SV-10163 had already answered the second**.

**Step 4 is the one that would have saved this morning as well.** Both withdrawn tickets were things
the repo, or Jira, already knew.
