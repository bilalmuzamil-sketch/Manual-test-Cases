# ROOT CAUSE — how ten requirements ended up with no case, and why an outsider asked again

**Date:** 2026-08-10 · Written for a non-technical reader (Standing Rule 7).
**Scope:** the 10 Class-A misses in `GAPS.md`, and the separate question of why Ahtasham could not
see coverage that existed.

---

## THE SHORT ANSWER

**There are two different failures here and they should not be told as one story.**

**The first is small and it is genuinely small: ten requirements out of roughly 1,000 have no test
case.** Three of the ten were created in the last four days by spec edits we had not yet ingested.
Two are low-value framework behaviour. That leaves **five substantive misses**, and **three of those
five are the same mechanical fault we have now made four times: a requirement that promises two
things gets tested on one of them.**

**The second failure is not about coverage at all, and it is the one that keeps costing us.** The
cases Ahtasham asked about **existed**. He could not find them because (a) his test run is frozen and
does not contain all our cases, and (b) **there has never been a published list for anyone outside
the team to check.** We knew both. The rule for (a) was written on 31 July after this exact thing
happened with this exact reviewer. The recommendation for (b) was written on 6 August. **Neither was
acted on, and eight days later the same person asked the same question.**

---

## FAILURE ONE — THE TEN MISSES

### Mechanism 1: one requirement, two promises, one verdict — **four occurrences, and it is a repeat**

This is Standing Rule 45(e): *"a requirement making two assertions gets one row PER ASSERTION."*

| Miss | The requirement promises | We tested | We did not test |
|---|---|---|---|
| **A8 · IV `S10-R8a`** | the "as of" line appears in the PDF header **and as the CSV's first line** | the PDF | **the CSV** |
| **A1 · Filters `S13-R25`** | the query lives in the tab session **and does not sync across devices** | the tab session | **the second device** |
| **A3 · Filters `S13-R16`** | mobile uses inline expansion **and tapping raises the keyboard** | the expansion | **focus and keyboard** |
| **A9 · SBR `S14-R14`** | the font tier shifts with the largest positive value **and stays at 11px when there is no positive value** | the shift | **the no-positive branch** |

**A8 is the same defect Vlad found in July, on a different report.** In July it was the SBR export
losing a Location column because the requirement covered screen *and* export and we verdicted the
screen. Today it is the IV export losing the "as of" line because the requirement covers PDF *and*
CSV and we verdicted the PDF.

**Rule 40 exists for exactly this** — trace a requirement across every surface and ship a surface
matrix. **Rule 45(e) exists for exactly this** — one row per assertion. **Both rules existed. Both
were written after the July incident. Neither fired.**

**Why not, honestly.** Both rules are enforced during an *authoring or delta* pass, when someone is
reading the requirement. Nothing enforces them *afterwards*. Our verification since then has been
anchor-level: does some case cite `S10-R8a`? That check would have caught a requirement nobody had
looked at, and it is what found these — but it **cannot** catch a requirement someone looked at,
tested half of, and cited. **A citation is not evidence of completeness, and we have been treating it
as though it were.**

### Mechanism 2: the map is only as current as the last time someone rebuilt it — **three occurrences**

**A5 (Schedule §5.3), and the two `F1` findings (PV `S6-R12`, TU `S7-R14`)** all arrived in specs
republished on **6 and 7 August**. Our baselines were older. Nobody had diffed since.

This is **Standing Rule 43** — *"coverage maps are RE-DERIVED PER SPEC VERSION, NEVER INCREMENTALLY
PATCHED"*. It is the same rule that was found un-run on 6 August in
`build/filters/vlad-gap-review-2026-08-06/ROOT-CAUSE.md`, where the Filters map had gone **three
weeks and eight spec versions** without a rebuild.

**Here is the difference, and it is worth saying because it is the one genuinely encouraging thing in
this document.** After that finding, the Filters map **was** rebuilt, against v19, on 6 August.
Filters is the only one of the eight specs still at the version our map was built against — and
Filters produced **four** Class-A misses that were already **known and written down** before today,
not discovered today. **The rebuilt map worked.** The three new misses are in **Schedule**, which has
**never had a requirement→case map built at all**, and in **PV and TU**, whose specs moved after our
last look.

**So Rule 43 did not fail. It was run once, in one project, and never extended to the other two.**

### Mechanism 3: two misses are honestly marginal

**A4** (keyboard and drag-selection inside a text input) and **A9** are close to framework behaviour.
Under Rule 28 they would score WEAK-KEEP. They are listed because the rule is to list everything, not
because they should necessarily be written. **Counting them in the headline would inflate our own
failure number, which is its own kind of dishonesty.**

---

## FAILURE TWO — WHY AN OUTSIDER HAD TO ASK AT ALL

**This is the more serious of the two, and it is entirely process, not craft.**

### (a) The run sync was not done — and the rule for it was written after this same reviewer, on this same project

Run **352** is Ahtasham's, built with `include_all: false`, frozen at **110** cases. There are now
**114**. One of the four he cannot see — [C43561](https://shopview.testrail.io/index.php?/cases/view/43561)
— **is one of the six SV-8798 cases he says do not exist.**

**Standing Rule 34 was written on 31 July**, and its rationale sentence reads: *"a junior QA's review
of Filters run 352 reported 'no case exists' for requirements we HAD already authored and pushed —
the cases simply were not in his run."* Same rule, same run, same reviewer, ten days later.

The checker exists (`build/testrail-run-sync-2026-07-31/run_sync_audit.py`). It was not run after
C43560–C43563 were added. **The rule did not fail; it was not applied.**

### (b) There was no map, and we had already been told that

The Vlad root-cause of 6 August ends with three suggested rule changes. Number two reads: **"Publish
the rule → case map with every suite… It turns an outsider's review from archaeology into a one-page
check."** It was a recommendation awaiting the QA lead's decision. **Four days later the archaeology
happened again.**

There is a sharper version of this. Our cases *do* record which story they belong to — in the
References field. **A reviewer working inside a test run does not see that field.** So the
traceability we are proud of, and which satisfies Rule 20, is invisible to precisely the people who
would use it to check us. **Rule 20 gets us auditability. It does not get us reviewability, and we
have been assuming it does.**

---

## WHICH RULES SHOULD HAVE CAUGHT EACH ONE

| What went wrong | Rule that covers it | Did it exist? | Did it fire? |
|---|---|---|---|
| A8 — as-of line in PDF but not CSV | **40** (every surface) + **45(e)** (one row per assertion) | Yes, both, since July | **No.** Both are authoring-time rules; nothing re-checks afterwards |
| A1, A3, A9 — half a two-part promise | **45(e)** | Yes | **No.** Same reason |
| A5 — Schedule §5.3 | **43** (re-derive per spec version) + **31** (source currency) | Yes | **No — never run for Schedule.** No map has ever existed |
| A6, A7, A10 — negative cases nobody had mapped | **43** (both directions) | Yes | **No.** These are plain never-mapped requirements; the anchor diff run today is what found them |
| F1 — PV/TU cases resting on a tech plan | **30** / **57** (a tech plan is not a source of expected behaviour) | Yes | **Fired correctly at the time** — the cases say honestly that the spec was silent. What is missing is a re-check when the spec catches up |
| Cases invisible in his run | **34** / **47** (keep the active runs complete) | Yes, since 31 July, written about this exact run | **No — not applied** |
| No published map | — | **No rule.** Recommended 6 Aug, undecided | n/a |
| Confusing "unbuilt" with "uncovered" | — | **No rule** | n/a — and it nearly bit this pass, see below |

---

## THE NEAR-MISS IN THIS PASS ITSELF, RECORDED HONESTLY

Before the engineering handover and the design review arrived mid-pass, **this document was going to
report roughly twenty gaps rather than ten.** Six Filters items would have been counted as our
misses when they are things engineering **deliberately did not build** ("adopt-only-existing") or
**deliberately has not polished yet** (the components are not pixel-perfect). Four Schedule items
would have been counted when they are **explicitly out of V1**.

**That would have been a false confession** — and a false confession is not humility, it is a
different way of being wrong. It would have sent the QA lead to Branko and Fabian asking why we had
no cases for things they had already decided not to build.

**The reason it nearly happened is structural, and it is the fourth mechanism:** our coverage checks
compare the **spec** to the **cases**, and the spec describes the *intended* product while the build
scope is decided elsewhere — in a handover document, a design review, a decision recorded in a
meeting. **We had no third column.** Two documents arriving by chance supplied it.

**This is the one thing I would propose as a new rule, if the QA lead wants one:** a coverage
verdict of "uncovered" is not final until it has been checked against the **build-scope decisions**
— the handover, the tech plan's scope section, the design review's in-scope column. Otherwise every
descoped requirement reads as a QA failure.

---

## WHAT WOULD ACTUALLY PREVENT THE NEXT ONE

Ranked by how much they would have prevented, not by effort.

1. **Sync the three active runs, and make it the last line of every push.** It is the only item here
   that has now caused the identical incident twice with the same reviewer. **Rule 34 already says
   this; it needs doing, not writing.**
2. **Publish the story→case map** (`STORY-COVERAGE.md`) and send it to Ahtasham and Vlad. Reviewers
   currently have no way to check us except by reading case bodies, and they keep doing it, and they
   keep finding things.
3. **Run a requirement→case re-derivation for Schedule.** It is the only one of the three projects
   that has never had one, and it produced a genuine miss today.
4. **Add an assertion-split check to the anchor diff.** Today's diff answers *"is this anchor cited
   by anyone?"*. It needs to also answer *"does the citing case assert everything the requirement
   promises?"* — that single upgrade would have caught A1, A3, A8, A9 **and** the July Location
   column.
5. **Re-check a case when the source it rests on gets better**, not only when the source changes.
   F1 is two cases that correctly said "the spec is silent" and are now quietly wrong because the
   spec spoke.

---

## OUTSTANDING — what I need from you

1. **A decision on the run sync** (item 1) — it is one authorised `update_run` per project and it
   stops this recurring.
2. **A decision on publishing the map** (item 2) — it was recommended on 6 August and is still
   undecided.
3. **A decision on the proposed new rule** — that an "uncovered" verdict must be checked against the
   build-scope decisions before it is reported. **This pass would have over-reported by ten items
   without it.**
4. **Go-ahead for the Schedule re-derivation** (item 3).
