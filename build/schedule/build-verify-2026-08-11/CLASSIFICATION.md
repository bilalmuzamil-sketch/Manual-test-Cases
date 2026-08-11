# Classification — every label mismatch, both texts side by side

**Rule 45(e): a verdict with no quoted text is unfalsifiable. Every row below quotes both.**

## The three classes (the rule this pass runs on)

| Class | Where the label sits | Who wins | Why |
|---|---|---|---|
| **A** | Preconditions or Steps | **the build** | These are directions to a control. If our step names something the screen does not, the tester is stuck and that is **our** defect. |
| **B** | Expected Results, **and a numbered requirement pins the wording** | **the spec** | The document states what it must read. A build that differs is a **deviation to record, not a case to change** (Rule 57). |
| **C** | Expected Results, merely describing what the tester will see | **the build** | The assertion is untouched; only the description of the screen changes. |

**⚠️ The trap, and it cuts both ways.** Filters C29596 had followed a spec **example** against the
spec's own **rule**, which would have made a tester fail a conforming build; the fix was to move the
case onto the **rule**, *not* onto the build. **That shape cannot occur here — spec v27 contains no
examples at all** (0 hits for `e.g.` / `for example` / `such as` / `i.e.` across 345 blocks).

---

## 🔴 STATUS OF THIS FILE

**No build/case mismatch could be assessed, because the build was never observed** — the session died
14 minutes in. **Classes A and C cannot be decided at all without a live read.**

What *is* below is everything decidable **from the documents alone**: mismatches inside our own suite,
and mismatches between our cases and the specification. **Nothing here was written to TestRail.**

---

## 1 · CLASHES INSIDE OUR OWN SUITE — a defect no matter what the build shows

At most one spelling of a control can be right, so **at least one case is sending the tester after
something that does not exist under that name.**

### 1.1 The grid-toolbar dropdown: `Filter & Display` vs `Filter and Display`

| | |
|---|---|
| **Our text (1 case)** | **C30042** — title: *"**'Filter & Display'** dropdown combines department toggles, My Shifts, and VIN"*; step 1: *"Open the **'Filter & Display'** dropdown in the grid toolbar."* |
| **Our text (5 cases)** | **C29930** *"…the department toggles in the **'Filter and Display'** dropdown."* · **C30043** *"In **'Filter and Display'**, turn OFF one department's toggle."* · **C30044** *"In **'Filter and Display'**, turn ON 'My Shifts'."* · **C30045** *"Turn 'VIN Number' ON in **'Filter and Display'**."* · **C30082** *"Check 'My Shifts' in **'Filter and Display'** is OFF (default)."* |
| **The document — spec v27 pins it THREE times, always with the word "and"** | **§6 Grid toolbar**, verbatim heading: *"**Filter and Display**"* · **§9**: *"**Filter and Display** dropdown (checkbox style, §6):"* · **§4.4**: *"visible only when the VIN toggle is on in **Filter and Display** (§6)"* |
| **Class** | **A** — C30042's mentions are in its **title and steps**, so the **build** decides the wording. |
| **Verdict** | **PENDING A LIVE READ.** The spec's three-fold *"Filter and Display"* and five sibling cases both point at C30042 being our typo — but class A means the build settles it, and the build was not seen. **If the build shows `Filter & Display`, then five cases are wrong and C30042 is right.** Not guessed. |

**Links:** [C30042](https://shopview.testrail.io/index.php?/cases/view/30042) ·
[C29930](https://shopview.testrail.io/index.php?/cases/view/29930) ·
[C30043](https://shopview.testrail.io/index.php?/cases/view/30043) ·
[C30044](https://shopview.testrail.io/index.php?/cases/view/30044) ·
[C30045](https://shopview.testrail.io/index.php?/cases/view/30045) ·
[C30082](https://shopview.testrail.io/index.php?/cases/view/30082)

### 1.2 The block toggle: `VIN` vs `VIN Number`

| | |
|---|---|
| **Our text** | **C30042** (expected): *"the dropdown … contains: a toggle per department, 'My Shifts', and **'VIN'**"*; *"Defaults: … **'VIN'** OFF."* |
| **Our text** | **C30045** (title + steps + expected): *"**'VIN Number'** toggle gates the block VIN only"* · **C30034** (expected): *"regardless of the **'VIN Number'** toggle"* |
| **The document** | **§9 View options** lists the toggle as **`VIN`** (bare). **§6**: *"combining department visibility toggles, My Shifts, and **VIN**."* — **§4.4 uses "VIN number" for the LINE CONTENT, not the toggle**: *"Line 3 (optional): **VIN number**, visible only when the **VIN** toggle is on…"* |
| **Class** | **B candidate** for C30034/C30045 (both assert it in **Expected Results**, and §9 pins the toggle's name). |
| **Verdict** | **PENDING.** On the document, **C30042 matches the spec** and **C30034/C30045 do not**. But CLAUDE.md records a **design** pin — *"VIEW-04 'VIN Number' toggle = block-only"* from the 2026-07-22 design reconciliation — and since 2026-08-06 **the design is an authoritative source too (Rule 57 as amended)**. **So this is a PRD-vs-design divergence, which Rule 57 says is RAISED, not silently resolved.** Dating it needs the §9 text diffed across versions (Rule 31 trap (c)) — **not done, and not guessed.** |

**Links:** [C30034](https://shopview.testrail.io/index.php?/cases/view/30034) ·
[C30042](https://shopview.testrail.io/index.php?/cases/view/30042) ·
[C30045](https://shopview.testrail.io/index.php?/cases/view/30045)

### 1.3 One case spelling itself two ways

**C30058** ([link](https://shopview.testrail.io/index.php?/cases/view/30058)) — title says
**`'This shift only'`**, its own step says **`'this shift only'`**. Spec **§7** writes
**`this shift only`**. Cosmetic, but it is our text disagreeing with itself. **Class A** (the step is a
direction) → build decides. **Not changed.**

---

## 2 · OUR CAPITALISATION vs THE SPECIFICATION — 9 strings, class-B candidates

These are the **Report Suite C30452 shape**: our case asserts a capitalisation the document does not
use. **Where the string sits in Expected Results and a requirement pins it, the spec governs and the
case is the thing that is wrong.**

| Our text | The spec v27 text | § | Cases | Field | Class |
|---|---|---|---|---|---|
| `Create Event` | **`Create event`** — §4.10 *"opens a menu with 'Create event' and 'New work order'"*; §7 *"Create event, New work order"* | 4.10, 7 | **C30016, C30017, C30054, C30075** (expected) + C30018, C38855 (preconds), C30077 (steps) | mixed | **B** for the 4 in expected |
| `New Work Order` | **`New work order`** — same two passages | 4.10, 7 | **C30054, C30075, C38855** (expected) | expected | **B** |
| `VIN Number` | **`VIN`** (the toggle) | 9, 4.4 | C30034, C30045 | expected | **B** — see 1.2 |
| `2 Lines` | lower-case in §4.3 | 4.3 | C29992 | expected | **B** |
| `Reassign` | §4.10 / §14.1 wording | 4.10, 14.1 | C30015 | expected | **B** |
| `Work Order Lines` | §3.1 wording | 1, 3.1 | C30011 | expected | **B** |
| `Part of a series` | §8.1 wording | 8.1 | C43556 | preconds/steps | **A** |
| `how much to schedule` | §4.5 wording | 4.5 | C29979 | steps | **A** |
| `this shift only` | §7 | 7 | C30058 | steps | **A** |

**NOTHING IN THIS TABLE WAS CHANGED, and that is deliberate.** The direct precedent is Report Suite
**C30452**, which asserted the build's Title Case against the specification's lower case, contradicted
five sibling cases, and **was left alone** — *"moving it means changing an expectation, which is his
call."* The same reasoning holds here, with one addition: **a class-B repair needs the build read to
confirm the build is what differs**, and that read did not happen.

**These 7 class-B rows are the single largest ready-to-execute item waiting on a session.**

---

## 3 · The 27 strings no document pins — the build decides outright

Listed in `evidence/partition.json`. **None can be settled from documents; every one needs a live
read.** The genuinely build-decided labels among them include `+N more`, `+N more lines`,
`New Shift`, `View Day`, `Reset To Template`, `Week 1 of 2`, `Starts before working hours`,
`Extends past working hours`, `series too long`, and the empty-state sentence
*"Nothing is scheduled in this range. Drag a work order from the list to book it."* (C43555).

**Six are test-data names, not labels** — `Vuchester Retail`, `Andrew Wade`, `zzzxq999`,
`ZZAUTOTEST Rush`, `ZZAUTOTEST note`, `ZZAUTOTEST stand-up` — and need an **existence** check under
Rule 50 (the exact on-screen name must be findable), which is also blocked.
