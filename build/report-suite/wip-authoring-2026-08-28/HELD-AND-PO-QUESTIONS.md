# WIP authoring 2026-08-28 — HELD items and the PO questions they need

Rule 58: an ambiguous source is never resolved by looking at the build. Rule 1: never proceed on a
half-answer. Nothing below was guessed into a case.

---

## HELD 1 — `S10-R2` · what shape is the summary strip? **NEEDS A PO DECISION**

**Plain question for Chris Ward:** *On the Work In Progress report, is the row of headline totals at
the top drawn as one bold band with a line above and below it, or as two grouped boxes joined by "+"
and "=" signs with the Estimates figure sitting apart? The written description says both.*

| | |
|---|---|
| **The conflict** | WIP spec **v28** (page last modified 2026-08-24) says at **S10-R2**: *"The summary strip is shown as a bold band delineated by a top and bottom rule, above the tabs — not as separate cards."* The **same version**, at **S5-R1**, says: *"Each group is drawn as one box showing its parts, the plus and equals signs between them, and its result."* |
| **Why latest-wins does not settle it** | Both statements are in the **same document at the same version**. Rule 32 has nothing to choose between |
| **What our suite currently says** | **C30520** — https://shopview.testrail.io/index.php?/cases/view/30520 — follows the 13 August 2026 design review (grouped equations) and **discloses the divergence in its own provenance**, which is Rule-56 correct |
| **What we did NOT do** | We did not author a case for S10-R2, because it would directly contradict C30520 and a suite may not ship with an unresolved contradiction (Rule 28 cross-case consistency sweep) |
| **Who can close it** | Chris Ward (PO) |
| **Risk if left open** | LOW-MEDIUM — a tester following C30520 will pass a build that S10-R2 would fail. Visual only; no money figure is affected |

---

## HELD 2 — `S7-R7a` · the anchor does not exist. **NO PO QUESTION NEEDED — TOOLING FIX**

`S7-R7a` has **no `S7-R7a:` definition** anywhere in WIP spec v28. Its single occurrence is inside the
§5 change-log narrative: *"…S7-R7a and reworded the §3 Key Decision + the Story 7 context note…"*.

`source-verify-2026-08-26/tools/verify.py` builds its live-anchor set from a bare regex match
(`ANCHOR.finditer`), so a change-log **mention** is scored as a live requirement and then reported
NOT COVERED. **There is no requirement to test.**

**Recommended fix (not applied — outside this pass's scope):** in `verify.py`, score an anchor as a
live requirement only when `definition()` returns non-`None` — the function already exists and is
already used for the changed/unchanged split.

---

## HELD 3 — `S9-E2` · the anchor does not exist. **NO PO QUESTION NEEDED — SAME TOOLING FIX**

Identical to HELD 2. `S9-E2`'s only occurrence in v28 is change-log prose
(*"…S9-E2 and its Known-Limitations entry). Code-verified; front-end + back-end updated…"*). There is
no `S9-E2:` requirement. Story 9's real exceptions end at **S9-E1** (the "Unit"/"Branch" heading
limitation), which **is** covered, by **C30516**.

---

## NOT HELD, BUT RAISED — spec-hygiene item for the PO, no case impact

**`S5-R9` still names retired figures.** It reads *"The Estimates figure is excluded from **Total
Earned** and from **Total Remaining**."* Those two figure names were replaced on 2026-08-13 by
**Total Completed Work** and **Remaining Work**, and **S5-R1 in the same version** lists the seven
current names with no "Total Earned" among them. Our case **C30491** already asserts the rule using
the current names. Suggested to Chris Ward as a wording correction; **no test-case change is needed**,
so this is not a blocker.

---

## OUTSTANDING — what I need from you

See the report; this file is the detail behind items 1–3.
