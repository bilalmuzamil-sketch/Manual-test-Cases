# INTEGRITY — CLAUDE.md archive + rule split, 2026-08-21

Standing Rule 50 (exhaustive then exact) byte-verification record for the split of
CLAUDE.md into `build/rules/`. Nothing was deleted; the whole former file is archived.

## The archive

- `build/rules/CLAUDE-FULL-ARCHIVE-2026-08-21.md` — sha256 `2d715d75530c41fecbfed34120f5891b8fae02959c2d2c7d1d9d0a2e4718ba9c`
- byte-identical to the CLAUDE.md it was taken from: **YES** (738210 bytes)

## Rule extraction byte-verify

- rule blocks found: **88** (expected 88); numbering exactly 1..88: **YES**
- rules region sliced from the archive — sha256 `9f48f1bd61a1ff970e842f9856646c985670bbc67719a2052e15450c4e505f01`
- the 88 extracted blocks re-concatenated in order — sha256 `9f48f1bd61a1ff970e842f9856646c985670bbc67719a2052e15450c4e505f01`
- **VERDICT: MATCH — nothing lost, nothing altered**

## Project-narrative extraction byte-verify

- project entries found: **7** ([1, 2, 3, 4, 5, 6, 7])
- project region sliced from the archive — sha256 `a0cf28b52db37b755957a0fb1e7a513d6fd9d7d08786dda398b754757eb69782`
- the extracted entries re-concatenated in order — sha256 `a0cf28b52db37b755957a0fb1e7a513d6fd9d7d08786dda398b754757eb69782`
- **VERDICT: MATCH — nothing lost, nothing altered**

## Where the text now lives

- `build/rules/RULES-01-20.md` — rules 1-20 (20 rules)
- `build/rules/RULES-21-40.md` — rules 21-40 (20 rules)
- `build/rules/RULES-41-60.md` — rules 41-60 (20 rules)
- `build/rules/RULES-61-99.md` — **rules 61-100 (40 rules) as of 2026-09-03**; 89-90 added 2026-08-21, 91-93 added 2026-08-21, **94 and 95 added 2026-08-26, 96 added 2026-08-26, 97 added 2026-08-28, 98 added 2026-09-01 (`924ee158`), 99 added 2026-09-02 (`5b6f0f8d`)**). **The file has been renamed on every rule addition and has carried, in order, the filenames `RULES-61-93.md` → `-94` → `-95` → `-96` → `-97` → `-98` → `RULES-61-99.md` (current since 2026-09-02).** On each occasion the new rule was appended and the file renamed by `git mv`, and every reference in the repo was updated in the same commit, so **a grep for any of those old filenames must return no LIVE POINTER**. Two classes of hit are expected and must NOT be "fixed": **(i) this rename-history line itself**, which names `RULES-61-93.md` on purpose, and **(ii) dated evidence artefacts and archives** (`CLAUDE-FULL-ARCHIVE-2026-08-21.md`, `CLAUDE-MD-SIZE-DIAGNOSIS-2026-09-02.md`, `SECTION1-AND-AMENDMENT-AUDIT-2026-09-02.md`, `PROJECT-HISTORY-ARCHIVE.md`), which record what was true on their date. Anything else is a broken pointer. Re-derive, do not trust: `git grep -noE "RULES-61-[0-9]+" -- . | grep -v "RULES-61-99"` — verified 2026-09-02, only the two expected classes remain.
  **🔴 2026-09-03 — RULE 100 WAS ADDED AND THE FILE WAS *NOT* RENAMED. THE RENAME TO `RULES-61-100.md`
  IS DEFERRED, DELIBERATELY, AND IS OUTSTANDING.** The convention above (rename on every addition, fix
  every pointer in the same commit) was **not met and could not be met in that pass**: the session that
  appended rule 100 was scope-fenced out of the files holding **22 of the ~40 live pointers** —
  `build/skills/00-COMMON-CORE.md` (2), the four `build/handoffs/HANDOFF-*.md` (19) and
  `build/testing-tools/automation_markers.py` (1) — because parallel workers were editing them at that
  moment (Rule 83 lane ownership). **A rename that leaves 22 pointers dangling is strictly worse than a
  filename that lags by one number**, so the rename was held rather than half-done. **⇒ THE FILE NAMED
  `RULES-61-99.md` CONTAINS RULES 61–100. Do not conclude rule 100 is missing because the filename stops
  at 99.** **TO CLEAR THIS**, in one commit, when no lane holds those files:
  `git mv build/rules/RULES-61-99.md build/rules/RULES-61-100.md` · then rewrite every live pointer
  (`git grep -ln "RULES-61-99" -- .`, excluding the two expected classes above **plus**
  `SECTION1-AND-AMENDMENT-AUDIT-2026-09-02.md`) · then update this rename-history line to
  `… → -99 → RULES-61-100.md` · then re-run the no-loss assertion below and the
  `git grep -noE "RULES-61-[0-9]+"` re-derivation.
- **⚠️ THE FILENAME AND THE COUNTS IN THIS FILE GO STALE EVERY TIME A RULE IS ADDED.** They went stale on **2026-09-01** the moment rule 98 landed and were still stale on 2026-09-02 (this file said "rules 61-97, 37 rules" while 98 and 99 existed), which meant **the no-loss assertion below would have PASSED while silently missing two rules** — the same class of failure as the 2026-08-21 truncation. **Whoever appends rule N must update this section in the same commit**, and any session relying on the numbers must re-derive them rather than trust them: `grep -cE '^[0-9]+\. \*\*' build/rules/RULES-*.md`.
- `build/rules/PROJECT-HISTORY-ARCHIVE.md` — the 7 per-project narrative blocks
- `CLAUDE.md` — rewritten as a loadable INDEX (see its READ THIS FIRST header)

---

## RULE-BODY RESTRUCTURING, 2026-09-03 — FOUR RULES COLLAPSED INTO RULE 62 (`d1879102`)

**WHAT HAPPENED.** The QA lead's 2026-09-01 ruling — *"You are never supposed to create defect, you are
supposed to make the tests RUNNABLE"* — was live in Rule 62 and in `CLAUDE.md` §1, but **four rule
bodies still gave the opposite answer to a session that read only them.** Commit **`d1879102`**
(2026-09-03) propagated the ruling into those bodies. **No rule was deleted and no rule was renumbered;
the index stayed complete with no gaps or duplicates.**

| Rule | Disposition | Where its substance now lives | What STAYED, still live |
|---|---|---|---|
| **51** | RETIRED IN PART / subsumed | the **filing half** → Rule 62 **§62-T1** | the **API-reachability test** stays in rule 51 |
| **52** | RETIRED / subsumed | the **whole ticket-shape recipe + the eight-item evidence bar** (~27 KB, which read as a standing instruction to build a ticket) → Rule 62 **§62-T2** | — |
| **53** | RETIRED IN PART / subsumed | the **priority half** → Rule 62 **§62-T3** | ***never "restore" a field the QA lead has changed*** stays in rule 53 |
| **94** | RETIRED / subsumed | the **ten admissibility checks A1–A10** → Rule 62 **§62-T4** | — |
| **73** | RE-TITLED, not retired | headline is now *"WHEN THE HOLD LIFTS, THE GO-AHEAD IS PERMISSION TO RE-VERIFY — NOT TO FILE"* | the one-at-a-time discipline and the quality checklist, now gated to after gate (3) |

**WHAT MOVED vs WHAT STAYED, precisely.** The recipes moved **VERBATIM** into a new Rule 62 subsection
headed **"IF AND ONLY IF HE DIRECTS A TICKET: THE SHAPE"**. Each source rule **keeps its number**, its
**original headline preserved verbatim, marked superseded and dated**, a one-line summary of what it
used to require, and an **exact pointer** to its 62-T anchor. The still-live halves were left where
they were. Nothing was deleted.

**🛑 THE FAILURE MODE THIS CREATES, AND WHY THE ASSERTION CANNOT SEE IT.** The no-loss assertion below
**compares RULE NUMBERS ONLY** — it proves every number in a body has an index row and vice versa. It
is **completely blind to a row whose TEXT no longer matches its rule body's headline.** That is exactly
what `d1879102` produced: rules **51, 52, 53, 73 and 94** were re-titled in their bodies while
`CLAUDE.md` §2 still carried their **pre-2026-09-01 headlines**, so a session reading only the index —
which is what the index is FOR — got the retired answer and would have gone off to build a ticket. **The
assertion passed the whole time.** **⇒ WHOEVER RE-TITLES A RULE BODY MUST UPDATE ITS `CLAUDE.md` §2 ROW
IN THE SAME COMMIT**, and a headline sweep is a separate check from the number assertion:

```sh
# rows whose text has drifted from their rule body's headline — the assertion cannot find these
python3 - <<'PY'
import re
md=open("CLAUDE.md",encoding="utf-8").read()
rows={int(m.group(1)):m.group(2) for m in re.finditer(r"^\| \*\*(\d+)\*\* \| (.*?) \|$",md,re.M)}
for f in ["RULES-01-20","RULES-21-40","RULES-41-60","RULES-61-99"]:
    L=open("build/rules/%s.md"%f,encoding="utf-8").read().split("\n")
    for i,l in enumerate(L):
        m=re.match(r"^(\d+)\. \*\*(.*)$",l)
        if not m: continue
        n=int(m.group(1)); h=m.group(2); j=i
        while not h.rstrip().endswith("**") and j+1<len(L): j+=1; h+=" "+L[j].strip()
        k=re.sub(r"[^a-z0-9]","",rows.get(n,"").lower())[:35]
        if not k or k not in re.sub(r"[^a-z0-9]","",h.lower()): print("DRIFT",n,"|",rows.get(n,"<no row>")[:80])
PY
```

**RAN 2026-09-03 after fixing the five rows: clean — 100 rows checked, 0 drifted.**

---

## SIZE GUARD — CLAUDE.md is an INDEX; the TRIPWIRE is 72,000 bytes (raised from 60,000 on 2026-09-02)

### 🔴 FIRST, THE THING THAT MATTERS MOST: **THIS IS NOT A TRUNCATION LIMIT.**

**The measured auto-load truncation cliff is ~534 KB — roughly EIGHT TIMES this tripwire.** The
2026-08-21 failure that created this index was real (the 738 KB CLAUDE.md truncated on auto-load and
rules 63-88 were silently absent), and because the pre-split file is preserved byte-for-byte the cliff
is measurable:

| Fact | Measurement |
|---|---|
| `CLAUDE-FULL-ARCHIVE-2026-08-21.md` | **738,210 bytes** |
| byte offset of Rule 62's body (the last rule that loaded) | **534,488** |
| byte offset of Rule 63's body (the first that did not) | **548,807** |
| ⇒ observed truncation point | **between ~534 KB and ~549 KB** |

*(Offsets obtained with `grep -bo` on the rule titles; the archive was not read whole — never read it
whole.)* **So a `CLAUDE.md` of 60-70 KB is nowhere near the 2026-08-21 failure, and 60,000 was NEVER a
truncation limit** — it was a 50 % tolerance band above the intended ~40 KB, chosen as a **re-inflation
tripwire**. **A session that says "we are near the truncation point" is wrong by an order of magnitude,
and that error is dangerous in its own right: it invites a panic trim of load-bearing text. DO NOT
PANIC-TRIM. Nothing in §1 CRITICAL CORE is ever eligible for a size trim** — that section exists so a
session that reads nothing else is still safe.

### What the tripwire IS for, and the number

Two jobs, both still valid: **(1) it keeps CLAUDE.md an INDEX** — the moment rule bodies live in two
places they drift, and this repo has already paid that bill twice (the `10`/`11`/`12` routers, and the
duplicated TestRail-formatting bullets merged on 2026-09-02); **(2) it is a per-session token tax**,
because CLAUDE.md loads on every turn of every session (~17,000 tokens at 67 KB), which Rule 95's
Token-Discipline Charter makes a cost the project manages deliberately.

**TRIPWIRE = 72,000 bytes** (raised from 60,000, QA lead 2026-09-02). Legitimate target is still
**~28-40 KB for the index part**, with §1 CRITICAL CORE accounted separately below.
**🛑 A NUMBER ALONE ONLY DEFERS A BREACH.** Growth measured over 2026-08-31 → 2026-09-02 was
**+11.7 KB/day**, so any tripwire is reached again within days. **The actual control is the §1
ADMISSION GATE below** — the number is the alarm, the gate is the mechanism. Raising the number again
without tightening the gate is theatre.

### If the tripwire trips

**If `wc -c CLAUDE.md` exceeds 72,000 bytes, first work out WHICH kind of growth it is.**
**(a) RE-INFLATION** — a rebase or merge resurrecting pre-restructure content, a worker re-appending
full rule bodies into the index instead of editing `build/rules/`, or a project-index refresh rewriting
the whole file from a stale copy. **This is a defect: do not commit it.** Repair from `build/rules/`:
the full rule texts live in `RULES-01-20.md` / `RULES-21-40.md` / `RULES-41-60.md` / `RULES-61-99.md`
(**rules 1..99** — re-derive the range, do not trust this line), the per-project narratives in
`PROJECT-HISTORY-ARCHIVE.md`, and the verbatim pre-split file in `CLAUDE-FULL-ARCHIVE-2026-08-21.md`
(sha256 recorded above — verify it before relying on it).
**(b) LEGITIMATE ACCUMULATION** — real QA-lead rulings arriving as new §1 bullets. This is what
happened on 2026-09-02 and **none of the three (a) causes was present.** The rulings are not the
problem; the FORM they arrive in is. **Do not delete a ruling to make a number. Apply the §1 admission
gate: move the evidence to its rule/skill, verify by grep that it landed, then shorten §1's text.**

**Before overwriting CLAUDE.md, assert first that nothing would be lost:** every rule in the CURRENT
range has a body in a `RULES-*.md` file, in both directions, and the archive's sha256 still matches the
value recorded above. If either check fails, STOP and report rather than overwrite.

**🛑 THE ASSERTION MUST DERIVE ITS OWN RANGE. NEVER HARD-CODE ONE — a hard-coded range PASSES while
silently ignoring every rule added after it was written**, which is exactly how "rules 1..97" certified
completeness on 2026-09-02 while rules 98 and 99 existed. **N is whatever the rule bodies say it is, and
it is read fresh every time.** Run this — it takes the max rule number from the bodies, never from any
number written in this file or in CLAUDE.md:

```sh
git fetch origin                                   # Rule 97 step 0 — never measure from a stale checkout
BODIES=$(grep -hoE '^[0-9]+\. \*\*' build/rules/RULES-*.md | grep -oE '^[0-9]+' | sort -n)
INDEX=$(grep -oE '^\| \*\*[0-9]+\*\*' CLAUDE.md      | grep -oE '[0-9]+'      | sort -n)
N=$(echo "$BODIES" | tail -1)
echo "rule bodies: $(echo "$BODIES" | wc -l)  highest: $N"
echo "gaps/dupes in bodies : $(echo "$BODIES" | uniq -c | awk '$1!=1 || $2!=++e {print $2}' | tr '\n' ' ')"
echo "in bodies, NOT in CLAUDE.md §2 : $(comm -23 <(echo "$BODIES") <(echo "$INDEX") | tr '\n' ' ')"
echo "in CLAUDE.md §2, NOT in bodies : $(comm -13 <(echo "$BODIES") <(echo "$INDEX") | tr '\n' ' ')"
sha256sum build/rules/CLAUDE-FULL-ARCHIVE-2026-08-21.md
```

**PASS requires ALL of:** body count == N · no gaps or duplicates · **both `comm` lines EMPTY** · the
sha256 equal to the value recorded above. **A non-empty "in bodies, NOT in CLAUDE.md §2" line is the
truncation failure of 2026-08-21 in its quiet form: the rule exists but no session can find it.**

**⚠️ EVERY COUNT AND RANGE WRITTEN IN THIS FILE — including `N = 99` and "rules 61-99" above — GOES
STALE THE MOMENT A RULE IS ADDED.** They are a dated record of the last run, **not the check**. The
check is the block above, and it must be **RE-RUN, never trusted**: a session that reads a number here
and reports it as current is reporting history. Whoever appends rule N+1 updates this file **and** adds
its §2 index row in the same commit, then re-runs the block to prove both landed.

---

## §1 ADMISSION GATE — approved by the QA lead 2026-09-02 (Rule 72)

**The defect this fixes:** §1 CRITICAL CORE had **no entry criterion**, so every new QA-lead ruling
arrived as a fresh, self-contained ~1.2 KB bullet carrying its own verbatim quote and worked example.
Each was individually correct and individually defensible; **twenty in a row breached the guard.** On
2026-09-02 alone, six commits added **+8,576 bytes, every byte of it into §1.**

**THE GATE — five clauses:**

1. **A §1 bullet is ≤ 400 bytes PER SUBJECT and states the IMPERATIVE ONLY.**
   **🔴 CLAUSE 1 AMENDED BY THE QA LEAD ON 2026-09-03 — READ "≤ 400 BYTES" AS *PER SUBJECT*, AND ALLOW
   A LABELLED MULTI-PART BULLET.** **Why it had to be ruled on:** §1's own preamble promises that
   *"Every **imperative** here is stated in full"*, and four subjects — **runnability**, the
   **permission/defect regime**, the **search-before-you-give-up drill** and the **report shape** —
   carry ten or more imperatives each, 1.2–2.4 KB of imperative alone. **Both clauses could not hold**
   (`SECTION1-AND-AMENDMENT-AUDIT-2026-09-02.md` §A-GATE measured it), and the enforcement reading
   would have pushed §1 to ~9,000 B **by deleting imperatives**, which is the exact failure §1 exists
   to prevent. **THE RULING:** where one subject is a compound standard whose imperatives exceed 400 B,
   it is written as **ONE bullet with LABELLED PARTS** — `(a)` / `(b)` / `(c)` — never as two bullets
   and never as a trimmed ruling. This is the precedent the QA lead set on **2026-09-02**, when the
   TestRail case-field formatting bullet and the API-write escaping-container bullet were merged into
   **one bullet with two labelled halves, "(i) WHAT TO EMIT" and "(ii) WHERE IT LANDS"** (still live in
   `CLAUDE.md` §5). **400 IS A BUDGET PER SUBJECT, NOT A CEILING ON A MERGED BULLET.**
   **🛑 AN IMPERATIVE IS NEVER DROPPED TO MEET A BYTE BUDGET — Rule 95 clause 12, quality is never the
   thing cut.** A subject that will not fit is fixed by **demoting its evidence to the rule/skill
   (clause 5) and merging its duplicate bullets (clause 3)**, never by cutting the instruction. **A §1
   that is honest at 20 KB beats a §1 that hits 18 KB with a ruling weakened.**
2. **The verbatim quote, the worked example and the incident history live in the rule or the skill**,
   reached by the pointer the bullet carries. **§1 carries the instruction; the authority carries the
   evidence.**
3. **A refinement AMENDS the existing bullet** on that subject — it never adds a second bullet about
   the same thing. (Two bullets on one subject drift: that is exactly how the TestRail case-field
   formatting bullet and the API-write escaping-container bullet ended up disagreeing.)
4. **§1 is hard-capped at 20,000 bytes.** At the cap, **the next admission requires demoting something
   first** — a consolidation pass, not an exception.
5. **NOTHING IS DELETED BY THIS GATE.** Content is **MOVED** to its rule/skill and pointed at, **and
   the move is verified by grep for a distinctive phrase BEFORE the §1 text is shortened.** **A gate
   that loses a ruling has failed** — a ruling that exists in neither place is a worse outcome than an
   oversized file. This is Rule 95 clause 12 applied to CLAUDE.md itself: **quality and authenticity
   are never what gets cut.**

**Applied 2026-09-02 to the seven bullets added that day: 8,678 B → 2,711 B (every one now ≤ 400 B),
with every verbatim quote and worked example verified present in its destination file BEFORE the §1 text
was shortened.** `CLAUDE.md` went **68,624 → 61,205 bytes** in the same pass (which also merged the two
duplicated TestRail-formatting bullets and replaced §2's trailing rule-provenance narrative with a
pointer to this file).

**✅ LIVE STATE, 2026-09-03 — LATEST READING: §1 measures 19,953 bytes and `CLAUDE.md` measures 61,324
bytes, after the `textContent` contradiction was resolved (below). THE CAP IS STILL MET, with 47 bytes
of headroom — which is thin; the next admission should expect to demote something.**

**🔀 THE `textContent` CONTRADICTION — RESOLVED 2026-09-03 UNDER CLAUSE 3 (a refinement AMENDS the
bullet on that subject).** Two §1 bullets read as a direct clash side by side: the label-reading bullet
said *"`cells[i]` per column header, `value` for an input, **`textContent` otherwise**"*, while the
**FIND A ROUTE BY WALKING THE UI** bullet said *"Quote the DISPLAYED label, never `textContent`"*. Both
were correct in their own context — the first is about **WHICH ELEMENT** to read, the second about
**`text-transform` making the DOM lie** — but a session had no way to tell which governed. **The
`text-transform` caveat was MERGED INTO THE LABEL-READING BULLET**, which is the bullet that owns "how
to read a label", and the conflicting clause was **removed from the route bullet**, whose own
imperatives (never guess an endpoint · a failed guess proves nothing · the `route_registry.mjs` →
`qa-branch-boot.mjs` → `find_ui_route.mjs` → `RECORD_AS=` drill · API only to SEED or READ a full set ·
the skill-03 pointer) are **all intact** — the route bullet went 520 B → **442 B**, now under the 400 B
budget only if its drill is read as a single subject; reported honestly either way.
The merged label bullet is **602 B** in the clause-1 labelled-parts form: **(a) WHICH ELEMENT = 190 B ·
(b) WHICH STRING = 307 B**, both under the 400 B per-subject budget. **NOTHING WAS DROPPED TO FIT** —
every imperative from both bullets survives, and the full technique was **grep-verified present in
`build/skills/03-RUN-CHECK.md` §4.1 BEFORE the §1 text changed** (clause 5). Skill 03's
*"READ A LABEL FROM THE SMALLEST ELEMENT THAT OWNS IT"* section also gained a cross-reference to §4.1,
because its capitalisation point sat ~900 lines away from the `text-transform` treatment and could be
read as licensing a `textContent` quote — **the same "the pointer misdirected the reader" failure that
made the 2026-09-02 audit call rule 57 empty when it was not.**

**⚠️ THE SUPERSEDED READING, PRESERVED VERBATIM AND DATED (true earlier on 2026-09-03):**
**✅ LIVE STATE, 2026-09-03 (LATER THE SAME DAY — SUPERSEDES THE 21,013 B READING PRESERVED BELOW):
§1 measures 19,797 bytes and `CLAUDE.md` measures 61,168 bytes. THE 20,000-BYTE CAP IS MET, AND
CLAUSE 4 IS NO LONGER ACTIVE** — a §1 admission no longer has to demote something first, though
clauses 1, 2, 3 and 5 govern its FORM exactly as before. **Measure it the same way every time:**
`awk '/^## 1 · CRITICAL CORE/,/^## 2 · THE RULE INDEX/' CLAUDE.md | head -n -1 | wc -c` — that is the
command the 21,013 B figure came from, so the two numbers are comparable.
**HOW IT CAME DOWN — BY DEMOTING EVIDENCE, NOT BY CUTTING A RULING (clause 5, executed in order).**
The **"FIND A ROUTE BY WALKING THE UI"** bullet went **1,736 B → 520 B (−1,216 B)**. The two evidence
strings named as blockers below were **backfilled into `build/skills/03-RUN-CHECK.md` FIRST and
grep-verified present BEFORE the §1 text was shortened** — *"is not rendered on this branch"* now at
skill 03 line **1252** (generalised into an admissibility test: a "not rendered / not present on this
branch" finding is **UNPROVEN** until the UI has been walked) and `GET /api/credit-memos/{id}/pdf` at
line **1266** (with the `{id}` ≡ `{creditMemoId}` equivalence and the suffix/download lessons).
**EVERY IMPERATIVE IN THE BULLET WAS KEPT** — the drill, the SEED/READ-only API exception, the
displayed-label instruction and the never-guess prohibition all survive; **only evidence moved.** At
**520 B the bullet is still above the 400 B per-subject budget, and that is reported honestly rather
than closed by dropping an imperative** (clause 1's 2026-09-03 amendment, Rule 95 clause 12).
**⚠️ THE SUPERSEDED READING, PRESERVED VERBATIM AND DATED (it was true earlier on 2026-09-03):**
**🟠 LIVE STATE, 2026-09-03: §1 measures 21,013 bytes — still ABOVE the 20,000 cap, and this is the
honest number.** It came down from **24,259 B** that day by applying the consolidation audit's six
ranked merges (`SECTION1-AND-AMENDMENT-AUDIT-2026-09-02.md` Part A, proposals **A1–A6**), each one
demoting evidence that was **grep-verified present in its destination file BEFORE** the §1 text was
shortened, then re-admitting a 409 B bullet for the new **Rule 100**. **It is still over because §1 is
not eligible for a substance trim (clause 5, clause 1's 2026-09-03 amendment, and the QA lead's
instruction), so the cap is not met by cutting: clause 4 is therefore ACTIVE — the next §1 admission
must demote an existing bullet to its rule/skill first.** Report this state; do not resolve it by
deleting a ruling. **A §1 that is honest at 21 KB beats a §1 that hits 18 KB with a ruling weakened.**
**NEXT DEMOTION CANDIDATE, already identified:** the **2026-09-02 "FIND A ROUTE BY WALKING THE UI"**
bullet (~1.4 KB, the largest remaining) → `build/skills/03-RUN-CHECK.md`. It is **not yet eligible**:
two of its evidence strings — the thirteen guessed routes' conclusion *"is not rendered on this
branch"* and the discovered route `GET /api/credit-memos/{id}/pdf` — **are not in skill 03 yet**, and
clause 5 forbids shortening §1 before they land there. **Backfill them into skill 03 first, verify by
grep, then demote.** Two further candidates the audit measured but did not recommend are in its
**A-EXTRA** table; note that `CLAUDE.md` §1's **eight-source open-ended list (57)** is **NOT** demotable
as things stand — **rule 57's body still lists only FIVE sources (a)–(e)** and does not carry the
"OPEN-ENDED: a new document type counts without a rule amendment" ruling at all, so moving it would
lose substance. **Amend rule 57's body first; that gap is itself outstanding.**

**✅ BOTH ITEMS IN THE SUPERSEDED BLOCK ABOVE WERE ACTIONED ON 2026-09-03 — AND ONE OF THEM WAS
MIS-DIAGNOSED, WHICH IS WORTH RECORDING:**
**(1) THE DEMOTION IS DONE** — evidence backfilled to skill 03, grep-verified, then §1 shortened.
**(2) RULE 57's BODY DID *NOT* "LIST ONLY FIVE SOURCES AND NOT CARRY THE OPEN-ENDED RULING AT ALL".
THAT SENTENCE ABOVE IS WRONG, AND IT IS LEFT STANDING (dated) BECAUSE THE CORRECTION IS THE LESSON.**
The body has carried the widening to **SEVEN, (a)–(g), AND THE EXPLICIT "OPEN-ENDED … a new document
type counts without a rule amendment" ruling since 2026-08-10** — verifiable by
`grep -c "OPEN-ENDED" build/rules/RULES-41-60.md`. All three companion clauses were present too
(*"FROM THE BUILD WE TAKE EXACTLY TWO THINGS"*, *"A CLOSED TICKET DOES NOT CHANGE THE EXPECTED
BEHAVIOUR"*, and Rule 58's hold-and-ask). **THE REAL DEFECT WAS READING ORDER, NOT ABSENCE:** the
pointer at the TOP of rule 57 said *"IT IS NOW FIVE"* and sent the reader to the **2026-08-06** block,
while the amendment that actually governs sits **~180 lines further down** — so a session doing exactly
what §1 instructs could take FIVE as the live list and stop. **Fixed 2026-09-03** by putting a live
eight-item/(a)–(g) open-ended block at the top of the rule, mapping §1's eight to the body's seven
letters (§1 names the **technical design** in its own right; it is **(d3)**), and preserving the old
pointer and the *"FIVE PLACES, AND NOWHERE ELSE"* headline verbatim, both marked superseded and dated.
**⇒ THE GENERALISABLE LESSON: "the rule does not say X" is a claim about the WHOLE body, so grep the
whole body before writing it down.** A long rule can carry its governing amendment far below a stale
pointer, and an audit that reads only the rule's opening will report a gap that does not exist while
missing the one that does. Same shape as Rule 38's missing-amendment miss, one level up.

### Diagnosis of 2026-08-21 (the "459,549 bytes" report)

**There was no re-inflation.** A session reported `CLAUDE.md` as 459,549 bytes; the file in the working
tree, at `HEAD` and on `origin` was **34,164 bytes** in correct index form (0 full rule bodies, 91 index
rows). 459,549 is the exact size of `CLAUDE.md` at commit **`c044768d` (2026-08-10, "Record three QA-lead
rulings of 2026-08-10")** — pre-restructure, 69 full rule bodies, highest rule 62, and **693 commits
behind `HEAD`** — i.e. the figure came from a **stale session-context snapshot of the file, not from the
repository.** **Lesson: measure `CLAUDE.md` with `wc -c` on disk before concluding it has grown** — an
injected or cached copy of the file is not evidence about its current state, and "repairing" on that
basis would have discarded 693 commits of legitimate work.
