# Surface matrix — Schedule §5.3 Panel collapse (Standing Rule 40) — 2026-08-11

**A requirement almost never lives on one screen, so every surface gets its own verdict.** "Not
applicable" is a permitted answer; **silence is not**, which is why the empty half of this table is
filled in with reasons rather than omitted.

**The trigger.** §5.3 is explicitly multi-surface in its own words — it names the **grid toolbar**,
the **left panel**, the **grid**, **popovers and modals**, **narrow viewports** and **persistence**,
and §3.1 and §6 both cross-reference it. Rule 40 treats a cross-reference as a surface link.

| Surface | Verdict | Covered by | Basis |
|---|---|---|---|
| **Grid toolbar** (the control itself) | **Covered by a new case** | **[C43582](https://shopview.testrail.io/index.php?/cases/view/43582)** | §5.3 first paragraph + Control bullet; §6 Panel toggle row |
| **Left panel / sidebar** (what is hidden and restored) | **Covered by new cases** | **[C43583](https://shopview.testrail.io/index.php?/cases/view/43583)** · **[C43584](https://shopview.testrail.io/index.php?/cases/view/43584)** | §5.3 Behavior + State preservation; §3.1 |
| **Grid** (what reclaims the width) | **Covered by a new case** | **[C43583](https://shopview.testrail.io/index.php?/cases/view/43583)** | §5.3 *"the grid reflows into the reclaimed space"* |
| **Modals and popovers** | **Covered by a new case** | **[C43586](https://shopview.testrail.io/index.php?/cases/view/43586)** | §5.3 Popovers and modals bullet |
| **Narrow viewport / mobile layout** | **Covered — split across a new case and an existing one** | **[C43585](https://shopview.testrail.io/index.php?/cases/view/43585)** (the toggle still works; the manual choice holds) + **[C30086](https://shopview.testrail.io/index.php?/cases/view/30086)** (the auto-collapse itself) | §5.3 Narrow viewports; §11 Responsiveness |
| **Session / per-user state** | **Covered by a new case** | **[C43587](https://shopview.testrail.io/index.php?/cases/view/43587)** | §5.3 Persistence bullet |
| **Mini calendar** (inside the panel) | **Covered — by an existing case, deliberately not re-asserted** | **[C43584](https://shopview.testrail.io/index.php?/cases/view/43584)** covers only that its selected date survives a cycle. Its own chevron is **[C29934](https://shopview.testrail.io/index.php?/cases/view/29934)** | §5.2 is a separate control; conflating the two is the near-miss named in `NEW-CASES.md` |
| **Line drill-down** (a panel mode) | **Covered by a new case** | **[C43584](https://shopview.testrail.io/index.php?/cases/view/43584)** | §5.3 *"reopening returns to whichever panel mode was active"*; §3.1 defines the two modes |
| **Tooltip** | **Covered by a new case** | **[C43582](https://shopview.testrail.io/index.php?/cases/view/43582)** | §5.3 *"the tooltip carries the meaning"* — and it is the **only** thing that distinguishes the two states, since the icon does not change |
| **Settings / View options** | **Not applicable** | — | §5.3 states the opposite in terms: *"a working-mode preference, **not a saved view**"*. It is deliberately **not** a view option, and the View options menu is C30046's ground |
| **Empty state** | **Not applicable** | — | §5.3 makes no assertion conditional on the panel being empty; the panel's own empty state is **[C29941](https://shopview.testrail.io/index.php?/cases/view/29941)** |
| **API / request payload** | **Not applicable** | — | §5.3 is presentation-only and session-scoped. **Verified live, not assumed: hiding the panel sends no request** — there is no endpoint to assert against, and Rule 51 would bar filing on one anyway |
| **PDF export** | **Not applicable** | — | The Schedule has no PDF export in V1; Week Export was descoped by the PO on 2026-07-31 |
| **CSV / other download** | **Not applicable** | — | same |
| **Print view** | **Not applicable** | — | same; §5.3 asserts nothing about print |
| **Email / scheduled delivery** | **Not applicable** | — | the Schedule module has no delivery surface |
| **Permissions** | **Not applicable as a distinct surface** | — | §14 gates the whole Schedule by the View tier, which C29925 and the SCH-PERM family cover. §5.3 adds no permission of its own, and all six new cases simply carry `Schedule: View` in their preconditions |

## Reconciliation

| | |
|---|---|
| Surfaces examined | **17** |
| Covered by a new case | **7** |
| Covered by an existing case, deliberately not duplicated | **2** (mini-calendar chevron; the 960px auto-collapse) |
| Not applicable, with the reason stated | **8** |
| **Examined but left without a verdict** | **0** |

**Nothing here is a coverage list dressed up as a matrix:** the two rows that say *covered by an
existing case* are the two places where authoring another case would have been duplicate coverage
under Rule 45(e), and both exclusions are written onto the new cases themselves so a future reader
does not mistake them for gaps.
