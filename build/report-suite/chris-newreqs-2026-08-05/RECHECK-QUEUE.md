# RECHECK-QUEUE — Chris Ward's new requirement items, 2026-08-05

**STATUS: OPEN.**

**Standing Rule 49.** The QA branch `sv8582` has **not been declared final**, so every observation in
this pass is **PROVISIONAL**. Re-run this queue when the build is declared final, when the app-version
marker changes, or when the sign-in blocker in row 4 is cleared.

**Build marker to compare against:** `app-version` **`v3.5-16cf83f`** · `index.html` last-modified
**Wed, 05 Aug 2026 06:40:32 GMT** · etag **`177c59546701e7810b894492dabc1423`** · read
**2026-08-05 18:41Z and again at 19:06Z, identical**.

**Check this queue at every session start** for this project, and before and after any Report Suite work,
alongside the older `viu-2026-08-03/RECHECK-QUEUE.md` and `final-viu-2026-08-05/RECHECK-QUEUE.md`, both
of which remain OPEN.

| # | What was observed | Cases | What was concluded | Build + date | What must be re-confirmed |
|---|---|---|---|---|---|
| 1 | The Work In Progress filter option lists are the **exact union** across all 392 rows of all four tabs — advisors 15 = 15, customers 215 = 215, unit numbers 172 = 172, set-equal both directions — served by `…/work-in-progress/filters` | **WIP-FLT-01 = [C30498](https://shopview.testrail.io/index.php?/cases/view/30498)** · **WIP-FLT-02 = [C30499](https://shopview.testrail.io/index.php?/cases/view/30499)** | The new S7-R1 / S7-R2 scope requirement is **met**; both cases rewritten to the new wording | `v3.5-16cf83f`, 2026-08-05 | Re-run `tools/wip_probe.py` and confirm the four set comparisons are still empty in both directions |
| 2 | The asset option list holds **one entry per unit number**, so **six vehicles** on open jobs are absent and their identification numbers match nothing | **WIP-FLT-03 = [C30500](https://shopview.testrail.io/index.php?/cases/view/30500)** | **DEVIATION** — filed as [SV-8908](https://shopview.atlassian.net/browse/SV-8908); case marked `READY - EXPECT FAIL (SV-8908)` | `v3.5-16cf83f`, 2026-08-05 | Re-run the same probe. If the six identification numbers now appear, the ticket is fixed and the marker must go back to `READY` |
| 3 | The Work In Progress download returns a **server error on every non-empty tab**, both formats, while the other five reports export normally | **C30510 · C30512 · C30513 · C30514 · C30515 · C30516 · C30517 · C30518 · [C38918](https://shopview.testrail.io/index.php?/cases/view/38918)** | **DEVIATION** — filed as [SV-8907](https://shopview.atlassian.net/browse/SV-8907); nine cases marked `READY - EXPECT FAIL (SV-8907)` | `v3.5-16cf83f`, 2026-08-05 | Re-run the eight range/tab combinations in `evidence/wip-probe-result.json`. If a non-empty tab produces a file, clear the marker on all nine |
| 4 | **NOT OBSERVED — the negative half of the link-permission rule, on any report.** No user holds reports access without work-order access, and no route to such a sign-in is open from this container | **WIP-COL-09 = [C43557](https://shopview.testrail.io/index.php?/cases/view/43557)** · **SBC-LINK-05 = [C43558](https://shopview.testrail.io/index.php?/cases/view/43558)** · **SBR-LINK-06 = [C43559](https://shopview.testrail.io/index.php?/cases/view/43559)** · **SBC-PERM-04 = [C30100](https://shopview.testrail.io/index.php?/cases/view/30100)** | Authored from the documents only; all four `AUTOMATION: HOLD`. **No verdict exists** | no build — never checked | Drive it on screen as a user with reports access and without work-order / part-sale / customer access, with the positive control alongside. **This is the highest-value row in the queue** |
| 5 | A report PDF contains **no hyperlink of any kind** — `/URI` × 0, `/Link` × 0, `/Annots` × 0 in a live 268,586-byte file | none — this is what makes the PDF surface N/A | The link rule cannot apply to the PDF surface | `v3.5-16cf83f`, 2026-08-05 | Re-check if a future build adds clickable PDFs; the N/A verdict would then need revisiting |
| 6 | Every drill-down payload returns its target ids (`work_order_id`, `work_order_type`, `customer_id`) **unconditionally**, so the link decision is client-side | none — Rule 24 says this is not a defect | Not a defect; recorded so nobody files it | `v3.5-16cf83f`, 2026-08-05 | Re-check only if the server starts withholding ids, which would move the gate to the back end |
| 7 | All eleven roles read; **`reportsPageAccess` is a single atom** held by Admin, Service Manager, Office User, Parts Manager and Sales Representative | none | Confirms the one-permission model in every spec; contradicts **PV S1-N1**, reported not fixed | `v3.5-16cf83f`, 2026-08-05 | Re-read if a role is added or a spec changes the permission model |

## Closing condition

This queue closes when **rows 1, 2, 3, 5, 6 and 7 are re-confirmed on a build declared final** *and*
**row 4 has been observed for the first time**. Row 4 cannot be closed by re-checking — **it has never
been checked at all**, and it is the row that carries the coverage Chris asked for.
