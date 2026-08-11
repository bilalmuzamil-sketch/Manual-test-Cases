# The lesson: a rule about the build was applied one level too broadly — twice

**2026-08-11.** This is the second time a correct rule about the build has been stretched past the
thing it governs, so the distinction is written here plainly enough that it should not blur again.

---

## The two things, and they are not the same thing

| | **LABELS AND WORDINGS** | **BEHAVIOUR** |
|---|---|---|
| What it is | the button text, menu item, column heading, tab name, dialog title, screen name | what the control *does*, what the report *shows*, what the totals *say* |
| Where it comes from | **THE BUILD** | **THE DOCUMENT** — spec, epic story, PO answer, design, Figma |
| Which rule | Standing Rules **9** and **10**, and `build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md` | Standing Rule **57** |
| Why | so a **non-technical manual tester can find the control** | so the case **can still fail** |

**Both rules are right. Neither is a licence to do the other one's job.**

---

## The failure mode, in one sentence each

**2026-08-05 — Rule 57 was born because expected *behaviour* had been rewritten to match the build.**
Cases were carrying "the product behaves this way on purpose for now" over requirements the PRD
stated plainly. A test that bends to whatever shipped can no longer fail, and a test that cannot fail
is not a test.

**2026-08-10 — Rule 57 was then applied to the *label* layer as well, and 82 cases were frozen.**
The pass found 82 cases quoting a string not visible on screen, checked each against the
specification, and made **zero writes** — treating every one as a protected expectation. Some were.
**Some were step instructions telling a tester to click a menu item that does not exist.**

**The tell is identical in both directions: nobody set out to do the wrong thing.** The first pass
was resolving an ambiguity; the second was protecting expectations. In both, a good instinct ran one
level past its own scope.

---

## The test to apply, and it takes ten seconds

Ask **where the string sits** and **what it is doing there**:

1. **In Preconditions or Steps?** It is a **direction to a control**. → **Use the build's wording.**
   A step that names a control the tester cannot find is *our* defect, whatever the spec calls it.
2. **In Expected Results, and a numbered requirement states the wording** (*"the button reads X"*,
   *"the two menu items read exactly X and Y"*, *"a control labeled X"*)? → **Keep the spec's
   wording.** The build differing is a **deviation to record**, not a case to change.
3. **In Expected Results, but merely describing what the tester will see** — a tab named so you know
   where to look, a filter named so you know which one? → **Use the build's wording.** The assertion
   is unchanged; only the locator moves.

**Where a case needs both, do both.** The step names what is on screen; the expected result asserts
what the document requires. That is not a contradiction — it is the only shape that is *runnable*
and *falsifiable* at the same time.

---

## Two things that make the mistake likelier, both seen tonight

**1 · "Spec-backed" was asserted without quoting the spec.** The 2026-08-10 pass recorded
*"SBC S14-R1/R2, S15-R1/R2, S16-R1: the item reads 'Download (CSV)', 'Download (PDF)', and Print is
the third item"*. The specification says the exact opposite on all three counts: S14-R2 requires
*"Download Summary (CSV)"* and *"Download Expanded View (CSV)"*, S15-R2 the PDF equivalents, and
Story 16 reads **"(removed — Print retired)"**. **A verdict of "the spec pins this" is only worth
something with the requirement quoted beside the case text** — which is Rule 45(e) applied to labels.

**2 · A suite that disagrees with itself is the loudest possible signal.** Three SBC cases said
*"Download (CSV)"* while four of their own siblings in the same section — C30159, C30164, C38856 and
TU's C30434 — already carried the four-item wording and cited spec version 16 for it. **The
contradiction was inside our own suite before anyone looked at the build.** Rule 28's cross-case
sweep catches this for free; it was not run over the label layer.

---

## The sentence to remember

> **From the build we take the words on the screen. From the document we take what those words are
> supposed to do. Correcting a step to name a real button is not bending the expectation — refusing
> to correct it just leaves the tester stuck in front of a menu that does not contain the item we
> told them to click.**
