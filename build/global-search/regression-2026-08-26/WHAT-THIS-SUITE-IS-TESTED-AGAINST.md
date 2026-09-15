# What this suite is tested against — AND WHERE THAT STOPS

**Scope of this file: the Global Search V1→V2 REGRESSION suite only** (section 6769, run 415, the
62 regression-flagged cases). **QA lead, 2026-09-15, in as many words: this condition is for THIS
folder ONLY — do not make it a general rule for other testing suites.**

---

## The rule, for this suite

**The standard is what V1 does ON PRODUCTION TODAY.** The question every case in this suite asks is:
*a person can do this today on production — can they still do it in V2?*

So for these 62 cases:

- **V1 on production is the authority.** If production does it and V2 does not, that is a finding,
  whatever the V2 requirements say.
- **The V2 requirements document is CONTEXT, never the authority.** A V2 requirement that permits
  the new behaviour does not make a lost capability acceptable — it makes it a decision for the
  Product Owner (Standing Rules 96 and 58), and he ruled on ten of them on 2026-09-15.
- This is what the cases mean when they cite **Standing Rule 109** in their own source line:
  *"For this V1 regression suite the shipped V1 product IS the specification."*

## Where it stops — READ THIS BEFORE CARRYING IT ANYWHERE ELSE

**Standing Rule 57 is unchanged for every other suite and every other project:** expected behaviour
comes from the DOCUMENTS — the spec/PRD, the epic's stories, the PO's verified answers, the design,
Figma, the technical design — and **never from the build**. From the build we take exactly two
things: the on-screen labels, and the pass/fail verdict.

**Do not carry "the live product is the standard" into:**

- any other project in `build/` — Report Suite, Schedule, Filters, Custom Roles, Invoice UI Refresh,
  Inline Add and Edit Parts, Printer Friendly WO, or any new one;
- the **non-regression** cases of Global Search itself — the V2 feature cases in run 415 outside
  section 6769 are tested against the V2 requirements in the ordinary way;
- any future V1→V2 suite, unless the QA lead says the same thing about that suite.

A regression suite asks "did we lose something?" and only a regression suite gets to answer that
from the shipped product. Everything else asks "does it do what was specified?", and that is
answered from the documents.

## What this means in practice, and the gap it exposed

If V1-on-production is the standard, then **a claim about what V1 does must be an OBSERVATION of
production** — not a reading of the V1 source, not a sentence in our own case text, not the V2
requirements' description of the old search (Rule 12: verified means observed; Rule 100: a
remembered or quoted copy is not evidence about the thing).

**As of 2026-09-15 that observation has not been made**, and four tickets rest on it:

| Ticket | Rests on the claim that V1 … |
|---|---|
| SV-10058 | finds a vehicle by PART of its chassis number |
| SV-10059 | brings the recently-viewed list back after a search that finds nothing |
| SV-10060 | matches a fragment from the middle of a word |
| SV-10061 | highlights the first result, so Enter opens it |

The V2 requirements' own §1 describes V1 as having *"no fuzzy/typo tolerance"* and *"no recent
searches, no quick actions, no keyboard navigation"*. That description **contradicts the premise of
three of those four**. It is not authority either — it is the V2 document describing V1 — which is
exactly why production has to be watched rather than argued about.

**The check is written and has NOT been run:** this session's environment refuses production reads,
and refused to commit the script, so it is held outside the repository and will be lost with the
session. Re-create it as: sign in to production read-only, run those four searches against the live
V1 search box, record what happens. **Until then, hold SV-10058–SV-10061.**

The other three tickets from 2026-09-15 do not depend on this and stand on their own: **SV-10055**
(year with make/model), **SV-10056** (new job findable within 30 seconds), **SV-10057** (customer's
own telephone) — each is required by the V2 requirements in its own right, so it is a defect whether
or not V1 did it.
