# 🔴 RULES 111 AND 112 NEED CARRYING ACROSS INTO THE CANONICAL RULE SEQUENCE

**The two branches run different rule numbering.** This branch's `build/rules/RULES-61-ONWARD.md` is
the CANONICAL sequence, and its **110** is *"never use a label, code or abbreviation without its
plain-words meaning beside it"* (QA lead, 2026-09-14). The parity branch
`claude/global-search-v1-baseline-6ax9ul` keeps `build/rules/RULES-61-96.md`, whose 110 and 111 are
different rules.

This is the same situation CLAUDE.md already records for Rule 109: *"it must be carried across, or
the next session will not have it."*

## The rule that needs a home in the canonical sequence

**Ordered by the QA lead on 2026-09-17, verbatim:**

> *"if you are seeding the data for any test case, and you see the number in the test case for the
> data you seeded differs, then you should also correct that NUMBER in the test case too. make sure
> that you correct the number ONLY and do not change anything else in the test case, and make it the
> rule."*

### Why it exists

**A case that names an identifier the environment does not hold is a FALSE FAILED waiting to happen.**
The tester types it, gets nothing, and records a defect against a product that is working perfectly.
C44843, C44847 and C44850 named work order `S2-15276`, which does not exist on `sv9160` and **cannot**
— work-order numbers are assigned by the branch.

### What you do

1. **Seed first, then read the REAL identifier back off the environment.** Never write the identifier
   you intended; most of them are server-assigned and unchoosable.
2. **Compare it with every identifier the case names** — preconditions, steps and expected results.
3. **Where they differ, change the identifier AND NOTHING ELSE.** Not the wording, not the ordering,
   not the provenance line, not the automation marker, not a helpful note. The identifier is a fact
   about the environment; everything else is the case's meaning.
4. **Read it back and prove the new identifier works.** Compare at WORD level — TestRail rewrites
   markup on every save (entities, a trailing newline, a relocated `</p>`), so a byte comparison
   reports a phantom change forever.
5. **Record what changed**, and snapshot the case body first (Rule 87).

### 🔴 The reachability clause — an identifier the SEARCH returns is not automatically usable

Written from the mistake made while applying the rule the first time. The replacement first chosen
for `S2-15276` was **`S2-15440`**, and it looked perfect: pinned, with every normalization variant
working. **It was wrong.** `GET /api/work-orders/view/<its id>` answers **`400 workOrderId Not found`**
at *both* workplaces the test login can reach — **the search index is organisation-scoped while the
record is WORKPLACE-scoped.** A case built on it passes step 1 and dies at step 2.

**Prove three things, not one:** the search returns it · the record **opens** as the tester at the
tester's workplace · the near miss is genuinely absent.

**And prefer an identifier that survives a reseed.** Our own seeded records get a new number every
wipe. `S2-15430` was chosen because it is pre-existing estate data that outlived the redeploy which
wiped every seeded record. **Consecutive seeded numbers are disqualified wherever a case needs a near
miss** — every neighbour of a seeded work order exists, so "returns nothing" can never pass.

### The boundary

- A **correction**, not a rewrite. Rule 62's creation hold is untouched.
- It **never** edits a case towards the build's behaviour — Rule 57 stands. It changes *which record
  the tester looks at*, never *what they should see*.
- Foreign cases stay hands-off; an Automated-flagged case is still reported (Rules 38, 65, 71).
- Rule 41 still applies: re-verify the WHOLE case afterwards.

**Worked example, false start included:** this folder — the pre-edit snapshot, the applier, and
`prove_still_runnable.py`, which shows the live cases are byte-identical to the originals once the
number alone is substituted.


---

# RULE 112 · VERIFY AGAINST THE REAL CASE TEXT, NEVER AGAINST A SUMMARY OF IT

**Ordered by the QA lead, 2026-09-17:** *"always verify against the real case text rather than
trusting the handoff's summary — make it your rule."*

## The failure it prevents

**A handoff, a task card, a spreadsheet and a previous session's report are all SUMMARIES.** They are
written by someone who read the cases once and they go stale the moment anything moves. The case body
in TestRail is the only thing the tester reads, so it is the only thing that decides whether the test
can be run.

**The failure it was written from.** The seeding handoff said of the eight Quick Actions cases:

> *"the data they need is the same core universe from §1 … so **no NEW records are required beyond
> §1.** Record this in the manifest so nobody re-investigates it."*

Confident, specific, and wrong. Reading the eight case bodies found **three named example records
that do not exist on the branch at all** — `Fisquare Farms`, `Adale Transport`, `Report Beverages` —
and one example term, `2025 Freightliner M2`, that returns **no assets whatsoever**, which turned out
to be a **product defect affecting every asset in the estate** rather than a data gap. A session that
trusted the summary would have seeded nothing, reported the section ready, and handed a tester four
dead ends.

## What you do

1. **Read the actual `custom_preconds`, `custom_steps` and `custom_expected` of every case in scope.**
   Script it (Rule 88) — but read the REAL fields.
2. **Extract what the tester will literally TYPE or LOOK FOR** and check each against the live
   environment. **A term named only as *"for example"* still gets typed by somebody.**
3. **Where the summary and the case disagree, THE CASE WINS** — and say so, so the summary gets fixed
   rather than quietly believed again.
4. **Quote the case, not the summary,** in anything you report.

## The boundary

This does not demote handoffs — a good one saves hours. It says a handoff is a **map, not the
territory**: use it to know where to look, then look. The same applies to your own earlier notes, to
a `PROJECT-STATE.md`, and to the index in `CLAUDE.md`, which already says of itself that the one-line
entry **is not the rule**.

🔴 **It applies to our own tooling too.** The seed verifier was still testing work order `S2-15440`
after the cases had been corrected to `S2-15430` — and it **passed**, because `S2-15440` is in the
search index. It was proving the wrong thing, confidently, and only re-reading the case bodies caught
it.

**Relation to other rules:** Rule 57's shape applied to our own artefacts; the honest trigger for
Rule 111; and the reading half of Rule 86.
