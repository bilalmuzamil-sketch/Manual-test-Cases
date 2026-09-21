# Skill 19 — HOW **NOT** TO TEST, AND HOW TO TEST INSTEAD

**Written 2026-09-21 on the QA lead's instruction:** *"I see you have made a lot of mistakes which
today you realized are the mistakes, learn from them as to how NOT to test and then HOW to test from
today's learning and make sure that you must not repeat the mistakes."*

This file is **not** a list of incidents — `build/LEARNINGS-LOG.md` already holds those
(L0168–L0180). This file names the **single root cause** underneath most of them and gives the
**drill that prevents it**. Read it before the first observation of any pass, alongside
`00-COMMON-CORE.md`.

---

## 1 · THE ROOT CAUSE — I JUDGED THE PRODUCT FROM A PROXY INSTEAD OF FROM THE SCREEN

Five separate wrong calls in two days. They look like five different mistakes. They are **one
mistake five times**: in each, the thing I measured was a **machine-readable stand-in** for the
behaviour, and the stand-in did not carry the behaviour.

| # | What I claimed | What I actually measured | Why the proxy could not carry it |
|---|---|---|---|
| **SV-10277** | The ranking is flattened, so the order is wrong | the `score` **number in the response** | The number is capped at 1.00; **the engine sorts on the real, uncapped value.** A capped number says nothing about order. |
| **SV-10279** | The begins-with credit is not applied to Parts | the **match label** on the row | An internal field no source defines. The credit **was** applied; only the label read differently. |
| **SV-10188** | Standing on a work order makes no difference to the order | two **direct calls to the search service** | The page context is attached **by the search box**, not by the URL. A direct call sends the query and nothing else, so the two lists were identical *by construction*. |
| **SV-10211** | The customer-tab fix has regressed | a **Vendors** example, from data whose other ranking signals differed | A ranking comparison is evidence **only** when every other signal is held equal. It was a different tab and a different fixture. |
| **SV-10278** | Disabling Financial Data wrongly removes Part Sales from search | the **permission list on the role record** | The list is data. The **dependencies between permissions live on the Roles and Permissions screen**, and there the dependency is deliberate and documented. |

**The pattern, stated once:** a response field, an internal label, a service call, a mismatched
fixture and a stored list are all **proxies**. A defect is a statement about **what a person sees
happen**. A proxy is admissible as *supporting* detail; it is never the observation.

### 1.1 · The second root cause — I answered a challenge instead of re-measuring

On SV-10277 the developer pushed back and I **conceded everything** before re-checking; the QA
lead's *"are you sure?"* caught it. Hours later on SV-10188 I did the mirror image — I **defended**
my finding and started drafting a rebuttal, and only a re-measurement showed the developer was
right and I was wrong.

**A challenge is neither a defeat nor an attack. It is a trigger to RE-MEASURE, on the screen,
today, before a single word of reply is written.** Conceding and defending are both answers given
without evidence; they just feel different.

---

## 2 · HOW **NOT** TO TEST — the eight forbidden moves

1. **Do not read a verdict out of a response field.** Not a score, not a rank, not a match kind, not
   a flag. If a source does not define the field, it cannot be a defect (L0179).
2. **Do not measure a page-dependent rule with a page-independent instrument.** Any requirement whose
   wording contains *"if the user is currently on …"*, *"in the context of …"*, *"depending on where
   you are"* is **untestable by a direct service call** (L0180).
3. **Do not compare two records to judge a ranking rule unless you built them.** Found data differs
   in signals you have not enumerated (L0174, L0164).
4. **Do not call a behaviour absent because your first attempt did not show it.** That is a fact
   about the attempt (Rule 104, Rule 97, L0036).
5. **Do not report a dependency between settings from a stored list.** Open the screen that governs
   it (L0171).
6. **Do not change the Expected to make a case runnable.** Ever. Cannot run it ⇒ Blocked with the
   reason (Rule 114, L0176/L0177).
7. **Do not call a case wrong against "the source" until you have read ALL of the sources.** I told
   the QA lead C55736's Expected contradicted the specification; it did not — the requirement was in
   the **story**, which I had not opened. The source list is Rule 57's whole list, not the PRD alone.
8. **Do not switch sides when challenged.** Neither direction. Re-measure first (§1.1).

---

## 3 · HOW TO TEST — the drill, in order

**Before the first observation**

1. **Name the claim in behaviour terms** — what would a person at the counter see, and on which
   screen? If the sentence needs a field name to make sense, it is not a claim about the product
   yet.
2. **Quote the source sentence that the claim is measured against**, verbatim, read live this pass,
   with its document, version and section (Rules 106, 114). No quote ⇒ no defect and no pass.
3. **List every other signal that could produce the same observation**, from the source's own list.
   Write them down before looking. This is what makes a later comparison admissible.

**Taking the observation**

4. **Observe it on the screen**, through the control a person uses — the search box, the button, the
   tab — never through a call that bypasses it. The screen carries context the service never sees.
5. **Hold every listed signal equal**, by **building** the fixture rather than finding one. Two
   records identical in everything but the one thing under test.
6. **Make the fixture discriminating.** If the record that should move is already at the top, a lift
   has nowhere to show and the run proves nothing. Three fixtures failed this way on 2026-09-21
   before the fourth worked; a non-discriminating run is **not evidence either way**, and must be
   labelled as such rather than read as a negative.
7. **Take it at least twice, alternating the conditions** (A, B, A, B) and require both rounds to
   agree. One pass each way is a coincidence.
8. **Run the positive control** — prove the instrument can see this kind of thing at all. For a
   context rule the control is: *does this output EVER differ between the two states?* For a list,
   a narrower query must return fewer rows.
9. **Read the precondition back off the screen.** A 200 is not proof a write landed; the part being
   "on the work order" is read from the work order's own Parts tab.
10. **Record the build marker** (`meta[name=app-version]`) in the same run. "It changed" and "my
    method changed" are only separable if the marker is written down both times.

**Before it leaves the session**

11. **Ask the seventh proof out loud: "what would make this MY fault, and how did I rule it out?"**
    (Rule 104). On SV-10188 the honest answer existed and I never asked the question.
12. **If the answer is "nothing ever differs, under any condition" — suspect the instrument first.**
    A product that ignores a rule completely and an instrument that cannot see the rule produce the
    identical reading.
13. **Gate it:** `python3 build/testing-tools/blocker_gate.py --check "<claim>"` for anything
    negative, and `assertBehaviour(...)` from `build/testing-tools/probe_guard.mjs` for any ordering
    or behaviour claim that is going into a ticket or a Failed result.

---

## 4 · WHAT A CHALLENGE TRIGGERS

A developer's push-back, the QA lead's *"are you sure?"*, or my own second thought all trigger the
**same three steps, in this order**:

1. **Re-measure on today's build, on the screen**, with the build marker recorded.
2. **Ask whether the challenger's specific point is right on its own terms** — Sinisa's *"there are
   0 of them available, it does not get the +0.2"* was correct and separable from whether the
   ticket stood.
3. **Only then write.** If I was wrong, say so plainly in one sentence, name the mechanism, close
   the ticket and correct the record. If I was right, show the controlled pair, not the argument.

**Never reply to a challenge in the same turn it arrives.** The re-measurement comes first, always.

---

## 5 · WHAT A WRONG CALL COSTS, SO THE COST IS NOT ABSTRACT

The QA lead, 2026-09-21: *"your mistakes are costing me a lot."* A false defect costs a developer's
afternoon and the QA lead's credibility in the room. A **false pass costs more** and is discovered
later, or never (Rule 106's four outcomes). Both come from the same place — an observation taken
from a proxy instead of the screen. **Quality is never the thing cut (Rule 95 clause 12); the
savings come from how the work is executed, and this drill is faster than one retraction.**

---

## 6 · CARRIED BY

`build/skills/03-RUN-CHECK.md` (probe design) · `build/skills/06-DEFECT-PREP.md` (before any defect
is put to him) · `build/skills/09-TEST-EXECUTION.md` (before any Failed result) ·
`build/testing-tools/probe_guard.mjs` (`assertBehaviour`, `assertNegative`) ·
`build/LEARNINGS-LOG.md` L0168–L0181 · Rules 12, 57, 97, 104, 106, 114.
