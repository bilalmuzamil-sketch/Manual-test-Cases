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
14 minutes in.

**And §2 establishes something that makes that blockage total rather than partial: the Schedule
specification contains NO requirement that pins a label's wording, so there are ZERO class-B labels
in this suite. Every one of the 85 asserted strings is class A or C, and the build decides all of
them.** There is no subset that could have been settled from the documents.

What *is* below is therefore everything decidable **from the documents alone**: mismatches **inside
our own suite** (real defects whichever way the build falls), and the rows worth checking first.
**Nothing here was written to TestRail.**

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
| **Class** | **C** for C30034/C30045 (Expected Results) and **A** for C30045's title/steps. **§9 does not PIN the name — it lists the toggle to identify it, which is a locator (see §2), so the build decides.** |
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

## 2 · OUR CAPITALISATION vs THE SPECIFICATION — 9 strings

### ⚠️ FIRST, A CORRECTION TO THIS FILE'S OWN EARLIER REASONING

These nine were initially written up as **class-B candidates**, on the test *"the string appears in a
numbered requirement, therefore the requirement pins it."* **That test is wrong, and the sibling
Filters pass has the right one** (`build/filters/build-verify-2026-08-11/CLASSIFICATION.md`):

> **A requirement that NAMES a control in order to IDENTIFY it, while asserting something else, is a
> LOCATOR — class A or C, and the build's wording wins. Only a requirement that ARGUES FOR its own
> string pins it — class B.**

Their worked contrast is the clearest statement of it: Filters **S12-R6** names an *"Apply filters"*
button while asserting *deferred apply* → **locator**; **S11-R7** says *"The label is deliberately
'my view' rather than 'my filters', since the action affects both filters and search"* → **pinned**.

**Applied to Schedule, the result is clean and it changes the answer:**

**Spec v27 was searched for any requirement that argues for a label's wording** — `deliberately`,
`rather than`, `the label is`, `labelled`, `must read`, `reads exactly`, `wording`, `is called`,
`named`. **Six passages matched, and NOT ONE of them defends a string.** They read *"labeled with the
line count and total hours"* (§4.3), *"labeled once at the start"* (§4.6), *"hidden rather than
discarded"* (§5.3) — all describing **behaviour or content**, never defending an exact wording.

> ## 🔴 **THERE ARE ZERO CLASS-B LABELS IN THE SCHEDULE SUITE.**
> **Every label mention in specification v27 is a locator, so all 85 asserted strings are class A or
> class C and THE BUILD DECIDES EVERY ONE OF THEM.** No label dispute in this suite can be settled
> from the documents — which means **all 85 need a live read, and none was possible this pass.**

**The nine below are therefore class A or C, not B** — our capitalisation is unsupported by any
pinning requirement, and if the build shows Title Case then **our cases are simply right and there is
nothing to change**. Kept in the table because they are the fastest rows to check first.

| Our text | The spec v27 text (a **locator** in every row) | § | Cases | Field | Class |
|---|---|---|---|---|---|
| `Create Event` | **`Create event`** — §4.10 *"opens a menu with 'Create event' and 'New work order'"*; §7 *"Create event, New work order"* | 4.10, 7 | **C30016, C30017, C30054, C30075** (expected) + C30018, C38855 (preconds), C30077 (steps) | mixed | **C** (expected) / **A** (steps, preconds) |
| `New Work Order` | **`New work order`** — same two passages | 4.10, 7 | **C30054, C30075, C38855** (expected) | expected | **B** |
| `VIN Number` | **`VIN`** (the toggle) | 9, 4.4 | C30034, C30045 | expected | **C** — see 1.2 |
| `2 Lines` | lower-case in §4.3 | 4.3 | C29992 | expected | **C** |
| `Reassign` | §4.10 / §14.1 wording | 4.10, 14.1 | C30015 | expected | **C** |
| `Work Order Lines` | §3.1 wording | 1, 3.1 | C30011 | expected | **C** |
| `Part of a series` | §8.1 wording | 8.1 | C43556 | preconds/steps | **A** |
| `how much to schedule` | §4.5 wording | 4.5 | C29979 | steps | **A** |
| `this shift only` | §7 | 7 | C30058 | steps | **A** |

**NOTHING IN THIS TABLE WAS CHANGED**, and under the corrected test the reason is simpler and
firmer than the one first written here: **these are class A and C rows, so the build's wording wins —
and the build was never read.** Changing them from the documents would have been asserting a
capitalisation no requirement defends.

**Note how the corrected test flips the likely outcome.** Under the original (wrong) class-B reading,
seven of our cases looked like defects to be corrected *to the spec's lower case*. Under the correct
reading, **if the build renders `Create Event` and `New Work Order` in Title Case, our cases are
already right and nothing needs to change at all.** That is a materially different answer, and it is
why the test matters rather than being a technicality.

**These nine are the fastest rows to check the moment a session lands** — one page, one menu.

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
