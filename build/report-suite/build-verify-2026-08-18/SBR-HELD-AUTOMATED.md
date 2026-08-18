# SBR — AUTOMATED CASES HELD (ask-first, Rule 71) — 2026-08-18, build v3.8-bd246fd

Per this pass's instruction and Standing Rule 71, any SBR case TestRail flags **Automated
(`custom_atmstatus = 3`)** was **verified LIVE but NOT written to**. Below are the 4 Automated SBR
cases with their C-id, current marker, the change this pass WOULD have made, and the live verdict —
for the QA lead's ask-first ratification. **`custom_atmstatus = 3` confirmed LIVE per case this pass.**
All 4 are `created_by = 3` (ours) but Automated-flagged. **NOT edited, markers untouched, not
re-stamped.**

| C-id | internal | current marker | live verdict on v3.8-bd246fd | intended change (NOT applied) | affects automation? |
|---|---|---|---|---|---|
| [C30217](https://shopview.testrail.io/index.php?/cases/view/30217) | SBR-ROW-01 | `AUTOMATION: READY` | Feature PRESENT. A rep/group summary row appears only with a matching invoice; the contributing-invoice **count shows in parentheses** after the name ("Unassigned(88)" observed). Runnable. | Optional: add Rule-54 sentence-2 build-check. Marker stays READY. | No — metadata only. |
| [C30221](https://shopview.testrail.io/index.php?/cases/view/30221) | SBR-TREE-05 | `AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026` | **Feature PRESENT** — expanding the Unassigned group loaded its invoice detail rows on demand (date, invoice #, customer, payment badge, money columns). Runnable. | **Lift marker → `AUTOMATION: READY`** + sentence-2 build-check. | **Yes** — the marker would change from "not available" to READY (the feature is now on the build). |
| [C30262](https://shopview.testrail.io/index.php?/cases/view/30262) | SBR-UNAS-02 | `AUTOMATION: READY` | **VERIFIED** — Show Unassigned adds a single top-pinned "Unassigned" row (verbatim label) rolling up all no-rep invoices; pinned above reps. Runnable. | Optional: add sentence-2 build-check. Marker stays READY. | No — metadata only. |
| [C30314](https://shopview.testrail.io/index.php?/cases/view/30314) | SBR-WO-05 | `AUTOMATION: READY` | Feature PRESENT. The **unassigned** credit path is confirmed (all org invoices are unassigned → appear under "Unassigned"). The WO-rep / customer-rep fallback paths need invoices with assigned reps (none exist in this org) to drive fully. | Optional: add sentence-2 build-check. Marker stays READY. | No — metadata only. |

**Recommendation for the QA lead:** ratify lifting **C30221** to `AUTOMATION: READY` (the expand-on-demand
tree is now built and runnable). The other three are already `READY` and correct; only a metadata build-check
stamp was withheld. If ratified, apply the edit COUPLED with the live verification recorded here (skill-03
§6.4) and hand the case numbers to Vladimir Tomovic (id 1) via
`build/fabian-review-2026-08-17-CONSOLIDATED/AUTOMATED-CASES-REGISTER.md`.
