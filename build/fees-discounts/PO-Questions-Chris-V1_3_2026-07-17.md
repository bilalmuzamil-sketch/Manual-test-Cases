# Fees & Discounts — Two Quick Questions About Your Latest Update

Hi Chris! We have worked your latest write-up (the tax-area note and
the switch to "audit log" wording) into our checks. Two spots in the
write-up point in different directions, so we need your call.

There are **no wrong answers**. For each item, pick an option (or write
your own) on the **"Your answer"** line. It should take just a couple
of minutes.

---

## 1. Where exactly should the tax-area note appear?

**What happens now**
Your update says the tax-area note ("Fees may vary based on the customer's tax jurisdiction") is shown only to people who can see money amounts. But the write-up points to different places for the note itself: one part says it appears in the window where fee templates are created and edited, another part says it appears in the Processing-Fee window, and a third phrase says it sits below "every" place where Taxable can be chosen. These don't fully agree.

**The question**
Exactly where should this tax-area note appear?

**Options**
- A) Only the Processing-Fee window.
- B) Every window that has a Taxable choice - including the ordinary window where fee templates are created and edited.
- C) Somewhere else - please describe.

**Your answer:** ______________________________________________

---

## 2. Who would ever notice the note being hidden?

**What happens now**
People who cannot see money amounts also cannot open the fee window on a work order at all - so for the work-order window, hiding the note from them changes nothing anyone can see. The only place we can genuinely check the new "only people who can see money amounts" rule is the admin window where fee templates are created and edited.

**The question**
Is that expected?

**Options**
- A) Yes - the rule mainly matters in the admin window.
- B) No - there is another place where a person who cannot see money amounts would still see fees; please describe it.

**Your answer:** ______________________________________________

---

## Thank you!

That's everything for this round. Your answers will help us finish this
feature the way you want it. Feel free to add any notes alongside your
choices.

---
---

## Internal — QA-only mapping (NOT for the PO)

This section links each plain-English question above to its internal
bug/case refs, TestRail cases, spec refs and current status, so the
answers can be actioned. **Do not include this section (or any IDs/codes
in it) in the PO-facing copy or the "Questions for PO" tab.**

### Q1

- **Internal refs:** V1_3 §5-R15 note-placement inconsistency (spec-diff-v3-2026-07-17.md §H-a; spec inconsistent, flagged - do not resolve unilaterally). Affected cases: FD-WO-016 (WO Add/Edit dialog note, §5-R15 SFD-gate expected applied 2026-07-17) + FD-PROC-004 (Processing-Fee dialog folded §5-R15 note check). Answer decides whether the plain template dialog (S7-R12f Taxable control) also needs the note -> possible new case / FD-PROC-004-style fold.
- **TestRail cases:**
  - FD-WO-016 — [C29441](https://shopview.testrail.io/index.php?/cases/view/29441)
  - FD-PROC-004 — [C28522](https://shopview.testrail.io/index.php?/cases/view/28522)
- **Spec refs:** requirements.md §17 (V1_3): §5-R15 body names the WO Add/Edit dialog (S2-R26) + the Processing Fee dialog (S8-R11); the 2026-07-14 change-log entry says "the work-order Add / Edit dialog and the template dialog"; §5-R15 opens with "Below every Taxable control"; Story 7's own template dialog spec (S7-R12f) carries no §5-R15 reference. Three readings conflict.
- **Current status:** FD-WO-016 = VIU-Deviation (note absent in the build for an SFD user); FD-PROC-004 = Blocked-NotBuilt (Story-8 builder UI absent). A = FD-PROC-004 unchanged + no template-dialog case; B = add a template-dialog note case (area Templates - admin) + keep both existing; C = per description. No TestRail write until answered + authorized.

### Q2

- **Internal refs:** V1_3 SFD-gate testability caveat (spec-diff-v3-2026-07-17.md §H-b). Stories 1/2 prerequisites already require See Financial Data to open the WO Add/Edit dialog, so the no-SFD negative on the §5-R15 note is only independently observable at the admin template/Processing-Fee dialog (Story 7 prerequisites = administration access only, no SFD). Determines where the SFD-gate negative case (fold in FD-WO-016 vs standalone) must observe, and whether a WO-side negative is even meaningful.
- **TestRail cases:**
  - FD-WO-016 — [C29441](https://shopview.testrail.io/index.php?/cases/view/29441)
  - FD-PROC-004 — [C28522](https://shopview.testrail.io/index.php?/cases/view/28522)
- **Spec refs:** requirements.md §17 (V1_3): §5-R15 gate ("visible only to users with See Financial Data") + change-log rationale (restricted roles in admin shouldn't flag a missing note); Stories 1/2 prerequisites (SFD required to open the WO fee dialog) vs Story 7 prerequisites (admin access only).
- **Current status:** FD-WO-016 carries the folded SFD-negative expected (applied 2026-07-17, C29441 update 200); status VIU-Deviation until the note ships. A = admin dialog is the negative's observation point (current folding stands); B = author additional coverage at the described surface. No TestRail write until answered + authorized.

**Notes:** V1_3 follow-up questions sourced from the spec-diff FLAGS
section (`spec-v3-2026-07-17/spec-diff-v3-2026-07-17.md` §H a/b; V1_3
applied to cases + TestRail 2026-07-17 — see `testrail-update-log.md`
in the same folder). TestRail IDs sourced from `testrail-id-map.csv`
(standing rule 8). Round-1 (6 questions) answered by Chris Ward
2026-07-09; Round-2 (4 questions) answered by Chris Ward 2026-07-14 —
see `PO-Questions-SIMPLE.md` / `PO-Questions-Round2.md`. These 2 items
are genuine product decisions (the spec points in different
directions), not defect reports — bugs/defects stay OUT of the
PO-facing content (standing rule 7).
