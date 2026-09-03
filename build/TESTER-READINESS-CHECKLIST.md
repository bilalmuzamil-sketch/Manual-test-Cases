# TESTER-READINESS CHECKLIST — the pass/fail gate before ANY case set reaches a manual tester

> **Standing Rule 84.** Nothing is handed to a manual tester until this gate passes.
> **Scored over 100% of the set — no sampling (Rule 50)** — and the handover report
> **states the counts passed / failed**, never a verdict of "they look fine".
>
> **This gate is MECHANICAL and complements `build/skills/04-TESTER-READY.md`**, which
> owns the *judgement* half (the cold read, the cross-case contradiction sweep, the skip
> list, the tester brief). **Run this gate first** — a case that renders as an unreadable
> run-on paragraph cannot be usefully cold-read, so mechanical failures are cheaper to
> fix before anyone spends attention on coherence.
>
> **Mechanical subset checker:** `build/testing-tools/check_tester_readiness.py`
> (read-only; credentials from `/tmp`, never hardcoded).

## WHY THIS EXISTS — the failure it is built from

Two real incidents, both invisible to us until someone else paid for them:

- **Cases sat with bare `\n` line breaks that TestRail collapsed into a single
  run-on paragraph.** Numbered steps a tester was supposed to follow in order
  arrived as one wall of text. **We did not find it — a tester waited two days.**
- **~14 Filters cases still show raw `<ol>` / `<li>` markup to the tester**, and
  **11 of those 15 were last written by our own pass**, so this is ours, not drift.

Both are **invisible from the payload we send** and **only visible in what the tester
actually sees.** That is the whole point of the gate: it turns *"I think they're fine"*
into a **measured pass/fail**, checked against the rendered case rather than our intent.

---

## THE PER-CASE CHECKS

Every check names **how to check it**, because a check without a method is an opinion.

### 1 · LINE BREAKS RENDER AS SEPARATE LINES

**Requirement:** numbered Preconditions / Steps / Expected Results appear as
**separate lines** to the tester.

> **🛑 SUPERSEDED, 2026-08-28 — CORRECTED HERE 2026-09-02. THE TWO `<br>` INSTRUCTIONS BELOW ARE
> NO LONGER THE METHOD.** They are kept, struck through, because a recorded instruction is never
> silently deleted — but **do not follow them.**
>
> **`<br>` is ORIGIN-DEPENDENT: it renders from a UI edit but shows LITERALLY when written via the
> API** — so **never emit `<br>` (or any inline tag) in an API payload.** To put lines on their own
> rows use **separate `<p>` blocks** (wider gap) or a **`<ul><li>` list** (tight lines).
> **Format with block tags only: `<p>` per paragraph, `<ol>/<ul><li>` for lists, `<hr />` for a
> separator.** **STYLING inline tags (`<b>`, `<i>`, `<u>`, `<code>`, `<em>`, `<strong>`) show
> LITERALLY** and are never used for formatting. A `<br>` seen on a live case is normally a human's
> UI edit — **leave it; just never generate one.**
>
> **The bare `\n` half of the check below is STILL CORRECT and still a FAIL.**
>
> **CANONICAL AUTHORITY: `build/APP-ACTIONS-PLAYBOOK.md` §J** (round-trip evidence). Also
> `CLAUDE.md` §5 and Standing Rule 84's 2026-08-28 amendment in `build/rules/RULES-61-ONWARD.md`.
> **The measured damage:** a pass that followed the superseded instruction left **76 cases
> unreadable**.
>
> **AND THE SECOND STEP §J ADDS:** block HTML written via the API lands in an **escaping container**
> that `check_case_render.py` cannot see, so the post-write check is TWO steps — the stored-value
> check **and** a served-page scan requiring `<div class="markdown fr-view">`; repair an escaping
> case **through the UI editor**, never by another API write.

**How to check (PARTLY SUPERSEDED — see the box above):** the field must use ~~**`<br>`** (or~~
genuinely separate `<p>` blocks ~~)~~ **or a `<ul><li>`/`<ol><li>` list** —
**a bare `\n` inside an HTML-rendered field is COLLAPSED by TestRail and is a FAIL.**
Read the case back with `get_case` and inspect the stored text; ~~where the field
contains HTML tags at all, every intended break needs an explicit `<br>`.~~
**Current method: every intended break is a separate `<p>` block or a `<ul><li>`/`<ol><li>` item.**

**Why it is not obvious:** the payload we send looks perfectly well-formed. The defect
exists only in the rendering.

### 2 · NO RAW MARKUP VISIBLE TO THE TESTER

**Requirement:** the tester never sees literal `<ol>`, `<li>`, `<p>`, `<hr />` or `&nbsp;`.

**How to check:** search the live text of all three fields for those literals. Note the
trap that produced the Filters defect: **a case whose text is stored as raw HTML will
have plain-text patterns fail to match**, so a writer that greps for a plain-text
marker can silently **append a second one** instead of replacing it.

### 3 · EXACTLY ONE AUTOMATION MARKER, AND IT IS LAST

**Requirement:** exactly **one** of `AUTOMATION: READY` ·
`AUTOMATION: READY - EXPECT FAIL (SV-xxxx)` · `AUTOMATION: HOLD - <reason>`, as the
**LAST thing in Expected Results**, with a **blank line before it**.

**How to check:** count occurrences (must be **1**, never 0 and never 2) and confirm
nothing follows it. **The automation engineer needs ONE machine-findable string per
case** — so it is a fixed literal, never reworded, never abbreviated.

### 4 · A RULE-54 PROVENANCE LINE, PRESENT EXACTLY ONCE

**Requirement:** present **exactly once**, and **sentence 1 names DOCUMENTS ONLY** —
the spec + version + requirement reference, the epic/story, a PO answer file, the
design/Figma. **The build is NEVER named as the source of an expectation.**

**How to check:** count the provenance line (must be 1 — a doubled line is a real
defect we have shipped before) and confirm sentence 1 contains **no build marker** and
**not the barred phrase `as per the build tested on`**. A build may appear only in
sentence 2, as *"Last checked against build … on …"* (Rules 54 / 57).

### 5 · TITLE ≤ 80 CHARACTERS

**How to check:** measure it. Longer titles truncate on the TestRail case page, so the
tester cannot read what the case is for. Detail belongs in the body, never the title.

### 6 · THE C-ID APPEARS IN EVERY DELIVERABLE THAT NAMES THE CASE

**Requirement (Rule 8):** any deliverable listing cases carries the **TestRail Case ID
(C#####)** and, where practical, the link
`https://shopview.testrail.io/index.php?/cases/view/<id>` — alongside any internal ID.

**How to check:** a bare internal ID (`FLT-…`, `SCH-…`) with no C-id is a **FAIL**. A
case not yet in TestRail is stated as *"new, no C-ID yet"* — never left ambiguous.

### 7 · NO JARGON OR §-ANCHORS IN TESTER-FACING TEXT

**Requirement (Rules 7 / 9):** no HTTP verbs or status codes, endpoint names, enum or
internal field names, ticket keys, bug codes, feature-flag names, or the word **"VIU"**
in Title / Preconditions / Steps / Expected.

**The authorised exceptions, listed so a future pass does not strip them:** the
**requirement reference in parentheses** inside the provenance line, and a **source-file
link** where that file is genuinely load-bearing (Rule 54).

### 8 · PRECONDITIONS REACHABLE, STEPS EXECUTABLE IN ORDER

**Requirement (Rule 28 dimension 2):** a non-technical tester can reach the starting
state and execute the steps in the written order, and the expected result **follows
from those steps**.

**How to check:** this one is a **COLD READ, not a regex** — it is the judgement half,
owned by `04-TESTER-READY.md`. It is listed here because the gate is not passed
without it, and because **the cold read is not a sample: every case is cold-read**
(Rule 50), with the deliverable stating the exact number read out of the exact
population.

### 9 · EVERY NON-PASSED ROW CARRIES A PLAIN "WHAT NEEDS TO BE DONE"

**Requirement:** in the handover sheet, every **DEVIATION / Failed / Blocked / HOLD**
row is paired with a plain-English next step a non-technical QA can act on.

**How to check:** no bare status without the note. A `HOLD` says **what it is waiting
on and from whom**.

### 10 · A NO-BUILD-YET SET SAYS SO, IN THOSE WORDS

**Requirement (Rule 85):** where no QA build exists, the set is reported as
**"SOURCE-VERIFIED ONLY — NO BUILD EXISTS YET"**, its cases carry Rule-54 **state 1**
(no build sentence), and they are **never** described as build-verified or simply
"verified".

**How to check:** confirm no case in such a set carries a build marker, and confirm the
handover report carries the sentence verbatim.

---

## SCORING AND THE REPORT

- **100% of the set is scored. No sampling, no "the important ones"** (Rule 50).
- The handover report states **counts passed / failed**, per check, out of the exact
  population — e.g. *"114 scored · 100 passed · 14 failed (all check 2, raw markup)"*.
- **A FAILED CHECK IS A FINDING, NOT A BLOCKER TO HIDE.** Report it with the C-ids.
  Repairing cases is a **TestRail write** and needs the QA lead's go-ahead (Rule 6) —
  **and while Standing Rule 62's creation hold is active, `update_case` correction
  continues but nothing new is created.**
- **The gate does not certify correctness.** It certifies the set is *runnable and
  readable*. A case can pass all ten checks and still assert the wrong thing —
  that is Rules 43 / 45 / 57 territory, not this gate's.

## HONESTY NOTE

Checks 1–7 and 10 are **mechanically checkable and are checked by the script**.
**Checks 8 and 9 are human**, and the script cannot substitute for them — a run of the
script is therefore reported as *"the mechanical subset passed"*, **never** as *"the
readiness gate passed"*. Claiming the latter from the former is exactly the kind of
overstated verification this workspace has been bitten by before.

**Ties to Standing Rules** 6 (no TestRail write without permission), 7 (plain layman
wording), 8 (the C-id, always), 9 (build-accurate labels), 12 (observed, never
inferred — check the rendered case, not the payload), 17 (complete data in/out), 28
(the cold read and the contradiction sweep), 42 (scope-conditional wording), 50
(exhaustive then exact), 54 (the provenance line), 57 (the build is not the source),
61 (the expect-fail symptom), 62 (the creation hold), 84 (this gate) and 85 (no-build
honesty).
