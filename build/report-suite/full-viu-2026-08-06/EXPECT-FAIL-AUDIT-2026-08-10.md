# The expect-fail audit — checking whether the known failures are still failing

**Build:** `v3.5-4795eee` · last-modified Fri 07 Aug 2026 13:10:42 GMT · etag `a80113cf3856c5fedf63be893e8b41c7`.
**Marker reads:** start 16:14:25Z. **Moves so far: 0.**

**Population:** the three handed-off reports carry **53** cases with an `AUTOMATION: READY - EXPECT FAIL`
marker, across **33** tickets — counted live from TestRail, not from a file. Sales By Customer 17 ·
Technician Utilization 18 · Work In Progress 18.

## Why this is the first thing being done

An expect-fail marker is an **instruction to the automation engineer**: *expect this to fail, do not
raise it*. If the defect has since been fixed, that instruction actively **suppresses a real signal** —
a genuine pass gets written off as the known failure. That is worse than an unchecked case.

**Every case is observed WHOLE** (Rule 41), not just the one behaviour its ticket names. The previous
session was right to refuse to flip markers on a partial observation.

---

## A correction to the previous session's sample, and it matters

The previous session sampled four tickets and reported **SV-8945, SV-8946 and SV-8953 all "appear
FIXED"**. **On SV-8946 that reading was wrong**, and the cause is worth recording because it nearly
put a false "fixed" into the suite.

Its evidence was *"deselecting a technician fired 0 report requests"*. Driven properly today,
**deselecting a technician fires exactly 1 report request**. The zero came from a **click that never
registered** — the Technician Utilization table headers are **not** Quasar-sortable elements and the
filter rows need a real mouse click; a synthetic `.click()` returns cleanly and does nothing, so
"no request fired" reads identically to "nothing happened at all".

**The control that catches it: prove the UI actually CHANGED** (row count, row order, summary total)
before believing a request count. Every observation below carries that proof.

---

## Verdicts so far — Technician Utilization

| Case | C-id | Ticket | Outcome | Evidence |
|---|---|---|---|---|
| TU-SORT-01 | [C30410](https://shopview.testrail.io/index.php?/cases/view/30410) | SV-8945 | **NOW PASSES** | see below |
| TU-LOAD-02 | [C30450](https://shopview.testrail.io/index.php?/cases/view/30450) | SV-8945 | **item 4 now passes** — items 1–3 still to drive | partial |
| TU-FILT-02 | [C30424](https://shopview.testrail.io/index.php?/cases/view/30424) | SV-8946 | **STILL FAILS, same way** | 1 report request on deselect |
| TU-FILT-01 | [C30423](https://shopview.testrail.io/index.php?/cases/view/30423) | SV-8947 | **NOW PASSES** | label is "Filter By Technician" |
| TU-FILT-03 | [C30425](https://shopview.testrail.io/index.php?/cases/view/30425) | SV-8947 | **STILL FAILS, same way** | select-all reads "All technicians" |
| TU-EXP-01 | [C30418](https://shopview.testrail.io/index.php?/cases/view/30418) | SV-8953 | **STILL FAILS, same way** | no `aria-expanded` |
| TU-EXP-04 | [C30421](https://shopview.testrail.io/index.php?/cases/view/30421) | SV-8953 | **STILL FAILS, same way** (item 2 still to drive) | no `aria-expanded` |

### C30410 — every one of its five items passes

Driven by clicking `span.tu-sort-label` (`data-test-id="header_tu_total_hours"` and siblings), three
clicks per column, six columns:

- **Item 1** — Technician is the active sort ascending on load; the first click gives
  `Vladimir Tomovic, Tech ShopView, Nebojsa Glavinic, Alicia Campbell` = **Z to A**. ✅
- **Item 2** — click 1 and click 3 give an identical order, click 2 the reverse, on **all six**
  columns: it toggles ascending↔descending with **no third state**. ✅
- **Item 3** — all six columns sort. ✅ (*Location* has no sort control, and is correctly not one of
  the six.)
- **Item 4 — the one the ticket is about: `0` report requests fired across all 18 clicks.** Only the
  2 initial page-load requests appear in the whole log. ✅ **This is the fix.**
- **Item 5** — ascending WO Hours gives `Alexander Cohen (0.00), Alicia Campbell (0.00), …`: the two
  tied at zero come out **A to Z**. ✅

**SV-8945 has shipped a fix.** The marker must come off, or automation will discard a passing test.

### C30424 — still failing, and on exactly the stated symptom

Deselecting *Alicia Campbell*: row disappears (9 rows → 8) ✅, Summary recalculates
`71.29 → 70.29` and `50.00 → 49.00` — precisely her 1.00 hour ✅, re-selecting restores it ✅. **But
one `GET /api/reporting/reports/technician-utilization?…` fires on every tick.** Item 3 fails, exactly
as written. **Marker stays.**

### C30423 — the symptom is no longer true

Its symptom says *"the filter is labelled 'Technician' and not 'Filter by Technician'"*. Today the
toolbar reads **`Filter By Technician`** above the control, and the combobox carries
`aria-label="Filter by Technician"`.

**The trap that nearly produced a wrong answer:** the control's own `innerText` is **"All
technicians"**, which looks like a wrong label. It is not a label — it is the **value display** of the
multi-select. Deselecting technicians changes it to `5 technicians`, then `4 technicians`, then
`No technicians`, which is item 1's *"for example, 2 technicians"* behaving correctly.

All three items pass: every technician selected on a first visit ✅, all rows shown ✅.

### C30425 — still failing, same way

`item_select_all_tu_technician_filter` reads **"All technicians"**; the specification requires a
control *labeled "Select all"*. Behaviour is right — Clear all empties the list (`No technicians`,
0 rows), the select-all control restores all six — but the label deviates exactly as the symptom says.
**Marker stays.** Items 2–4 (deselection surviving a date-range change) still to drive.

### C30418 / C30421 — still failing, same way

The per-row control is keyboard-focusable (`tabindex="0"`), toggles on **Enter** and on **Space**
(rows 9→10→9), and its name flips between `Expand Alicia Campbell's daily breakdown` and
`Collapse Alicia Campbell's daily breakdown`. **`aria-expanded` is `null`** — the state is still not
exposed to assistive technology. The header control likewise reads `Expand all technicians` /
`Collapse all technicians` with no state. **Both markers stay.**

Worth noting the contrast that shows this is a real omission and not a harness blind spot: the
technician filter's own combobox input **does** carry `aria-expanded="false"` on the same page.
