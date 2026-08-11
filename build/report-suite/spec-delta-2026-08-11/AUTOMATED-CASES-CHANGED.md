# Cases carrying TestRail's "Automated" flag that this pass changed (Standing Rule 65)

`custom_atmstatus = 3` is how **Vladimir Tomovic** records what he has actually automated. Changing
such a case can break an automated check that was written against the old wording, so every one is
reported here with what moved, **captured at write time from the live record**, not inferred.

**4 of the 24 updated cases carry the flag. None was created by us with it** — all four new cases
were created at `custom_atmstatus = 1` (Not Automated).

| Case | Title now | What changed | Why it matters to an automated check |
|---|---|---|---|
| [C30107](https://shopview.testrail.io/index.php?/cases/view/30107) | Product Type multi-select: both toggles on by default; S/P prefix filtering | **Title, steps and expected 1–6 rewritten**, `refs` re-pinned to SBC v17 | **The highest-impact one.** Any automation asserting *"exactly three options: Parts & Service, Parts only, Service only"* on a single-select dropdown is now asserting a control that no longer exists — v17 replaced it with a multi-select carrying *"All products"* / *"Clear all"* action rows above *"Parts"* / *"Services"* toggles. **This check needs rewriting, not re-running.** |
| [C30352](https://shopview.testrail.io/index.php?/cases/view/30352) | First visit shows exactly the 14 default columns in the specified order | Expected item 3 reworded from location **scope** to location **access**; the stale *"has not been settled"* note replaced with the current one; provenance re-pinned to PV v6 | The **14-column assertion is unchanged**. What moved is only the condition under which a 15th (Location) column appears. If the check drives a single-location user it is unaffected; if it drives a multi-location user it should no longer expect the column to vanish when the selection narrows. **Parts Velocity's specification still contradicts itself here**, so this point is explicitly not to be failed. |
| [C30462](https://shopview.testrail.io/index.php?/cases/view/30462) | Status-to-tab mapping: Estimate, Complete, In Progress and Review work orders | **Assertions unchanged.** A tester note added and the marker moved `READY` → **`HOLD`** | **Nothing to rewrite, but do not trust the result yet.** WIP v11 added a Key Decision saying tabs are keyed on **line state**, not work-order status, which is what this check asserts. Until Chris rules, a failure here may mean the build is right and the check is wrong. **Suggest parking this check rather than acting on its result.** |
| [C30518](https://shopview.testrail.io/index.php?/cases/view/30518) | Export notifications: success caption, "Empty export" warning | **Assertions unchanged.** One word in the provenance line: *"version 10"* → *"version 11"* | **No impact.** The case body a check reads is byte-identical; only a source citation was corrected. |

## What is NOT claimed here

**No build was observed in this pass**, so nothing above says whether any of these currently pass or
fail. Two of the four are flagged as needing attention on the strength of the **documents** —
C30107 because the control it drives has been redesigned, and C30462 because the requirement it
asserts is now contradicted by its own specification.

## Suggested order for Vlad

1. **C30107** — rewrite. The control changed shape.
2. **C30462** — park until Chris Ward answers the tab-placement question.
3. **C30352** — re-check only the Location-column condition; the 14-column assertion stands.
4. **C30518** — no action.
