# Surface matrix — the Work In Progress line-state bucketing decision (Standing Rule 40)

**The requirement** (Work In Progress spec v11, §3 Key Decisions, added 2026-08-10 per SV-9027):

> *"Buckets are keyed on line state, not work-order status. Every line's value sits in exactly one
> bucket: an unapproved line counts in Estimates, an approved untouched line in Approved - not
> started, a started line in Approved - partially completed (split Earned/Remaining), and a
> completed not-invoiced line in Completed. The buckets are disjoint and always sum to the work
> order's total quoted value; approving one line never removes another line's value from the report.
> **A work order carrying lines in more than one state appears in each matching tab, showing only
> that tab's slice of its money**; the status column still shows the work order's true status. The
> Estimates tab count therefore reads "work orders carrying unapproved value," and an unapproved
> line ages from the line's creation date."*

**Why a matrix and not a case list**: the previous pass identified the exposure as *"the three cases
citing `S9-E1`"*. That handle is wrong twice over — `S9-E1` is about download column headings and
did not change, and the reach of a bucketing rule is far wider than any one anchor. A rule that
decides which rows exist in which tab touches every surface that renders a row, a count or a total.

**Status of the whole matrix: every verdict below is BLOCKED pending Chris Ward**, because the same
document still says a work order lands in exactly one tab chosen by its status (`S2-R4`, `S3-R1`,
`S3-R2`, `S3-R3`, `S3-R4` — all unchanged in v11). Nothing here is a defect claim; it is the list of
what must be re-verdicted once he rules, and what is already in place to carry that verdict.

| # | Surface | Does the rule reach it? | Existing coverage | Verdict |
|---|---|---|---|---|
| 1 | **On screen — tab placement** | **Yes, directly** | [C30458](https://shopview.testrail.io/index.php?/cases/view/30458) · [C30462](https://shopview.testrail.io/index.php?/cases/view/30462) (Automated) · [C30464](https://shopview.testrail.io/index.php?/cases/view/30464) | **HELD** — assertions preserved, note added, marker `HOLD` |
| 2 | **On screen — the four tabs and their order** | Yes — a multi-tab work order changes what each tab contains | [C30452](https://shopview.testrail.io/index.php?/cases/view/30452) (Automated) · [C30455](https://shopview.testrail.io/index.php?/cases/view/30455) | **covered; re-verdict when he rules** — tab identity/order is unaffected either way |
| 3 | **On screen — money columns per row** | Yes — *"showing only that tab's slice of its money"* means one work order shows different money in different tabs | [C30474](https://shopview.testrail.io/index.php?/cases/view/30474)–[C30482](https://shopview.testrail.io/index.php?/cases/view/30482), [C38890](https://shopview.testrail.io/index.php?/cases/view/38890) | **covered for the single-tab case; the per-tab slice has NO case** — authoring blocked on the ruling |
| 4 | **On screen — the summary strip** | Yes — seven figures derived from bucket membership | [C30487](https://shopview.testrail.io/index.php?/cases/view/30487)–[C30493](https://shopview.testrail.io/index.php?/cases/view/30493) | **covered; C30491's Estimates figure holds under both readings** |
| 5 | **On screen — the Totals row** | Yes — each tab's Totals sums that tab's rows | [C30494](https://shopview.testrail.io/index.php?/cases/view/30494) · [C30495](https://shopview.testrail.io/index.php?/cases/view/30495) | **covered; re-verdict when he rules** |
| 6 | **On screen — the Status column** | Yes, and the decision is explicit: *"the status column still shows the work order's true status"* | [C30469](https://shopview.testrail.io/index.php?/cases/view/30469) | **covered** — asserts the badge label, which the decision confirms |
| 7 | **On screen — Days Open / ageing** | Yes — *"an unapproved line ages from the line's creation date"*, not the work order's | [C30472](https://shopview.testrail.io/index.php?/cases/view/30472) (*"whole days since creation"*) | **case needs extending** — no case distinguishes line creation from work-order creation. Blocked on the ruling |
| 8 | **PDF export** | Yes — a download carries the active tab's rows | [C30510](https://shopview.testrail.io/index.php?/cases/view/30510) · [C30511](https://shopview.testrail.io/index.php?/cases/view/30511) (*"include the tab's Totals"*) · [C30513](https://shopview.testrail.io/index.php?/cases/view/30513) · [C30517](https://shopview.testrail.io/index.php?/cases/view/30517) | **covered; re-verdict when he rules** |
| 9 | **CSV export** | Yes, as above | [C30511](https://shopview.testrail.io/index.php?/cases/view/30511) · [C30512](https://shopview.testrail.io/index.php?/cases/view/30512) · [C30514](https://shopview.testrail.io/index.php?/cases/view/30514) · [C30516](https://shopview.testrail.io/index.php?/cases/view/30516) | **covered; re-verdict when he rules** |
| 10 | **Print** | **N/A** — the Report Suite removed the Print leg; downloads are PDF and CSV only (SBC §7 records the removal, and no WIP requirement mentions print) | — | **not applicable** |
| 11 | **API — the nightly snapshot** | **Yes, and it is the least obvious one.** The snapshot records *"one row per then-open job per calendar day"*; if a job now occupies several buckets, "one row per job" is exactly the shape the decision changes | [C30528](https://shopview.testrail.io/index.php?/cases/view/30528) · [C30530](https://shopview.testrail.io/index.php?/cases/view/30530) · [C30531](https://shopview.testrail.io/index.php?/cases/view/30531) · [C30533](https://shopview.testrail.io/index.php?/cases/view/30533) | **HELD in effect — C30528 asserts one row per job per day, which the new reading may contradict.** Not edited: it cites its own unchanged requirement, same position as surface 1. **Flagged to Chris** |
| 12 | **Mobile / responsive** | Marginal — same rows, narrower layout | no WIP mobile case | **not applicable** — no WIP requirement covers a phone layout; recorded rather than skipped |
| 13 | **Column selector** | No — bucketing decides which *rows* exist, not which columns | [C30506](https://shopview.testrail.io/index.php?/cases/view/30506)–[C30509](https://shopview.testrail.io/index.php?/cases/view/30509) | **not applicable** |
| 14 | **Filters (advisor / customer / asset / date / location)** | Yes, indirectly — the summary strip *"recomputes from the jobs currently visible"*, so filtering interacts with multi-tab membership | [C30498](https://shopview.testrail.io/index.php?/cases/view/30498)–[C30505](https://shopview.testrail.io/index.php?/cases/view/30505) | **covered; re-verdict when he rules** |
| 15 | **Sorting** | Yes, weakly — *"Sorting reorders only the active tab's rows"* stays true under both readings | [C30483](https://shopview.testrail.io/index.php?/cases/view/30483)–[C30486](https://shopview.testrail.io/index.php?/cases/view/30486) | **covered — holds either way** |
| 16 | **Empty / zero state** | Yes — *"No qualifying work orders: every tab shows the no-data message"* | [C30460](https://shopview.testrail.io/index.php?/cases/view/30460) (Automated) | **covered — holds either way** |
| 17 | **Permissions** | No | [C30526](https://shopview.testrail.io/index.php?/cases/view/30526) · [C30527](https://shopview.testrail.io/index.php?/cases/view/30527) | **not applicable** |

## What the matrix found that a case list would not

**Two surfaces nobody was looking at:**

- **Surface 11, the nightly snapshot.** [C30528](https://shopview.testrail.io/index.php?/cases/view/30528)
  asserts *"one row per then-open job per calendar day"*. If a job's value is split across buckets,
  that shape is exactly what changes — and the snapshot feeds trend history, so a wrong shape there
  is not visible on screen at all. It sits in the API section and cites its own unchanged
  requirement, so it was **not edited**; it is flagged to Chris alongside the tab-placement question.

- **Surface 7, ageing.** The decision says an unapproved line *"ages from the line's creation
  date"*. [C30472](https://shopview.testrail.io/index.php?/cases/view/30472) asserts Days Open counts
  *"whole days since creation"* without saying whose creation. Under the new reading a work order
  could show one age in one tab and a different one in another. **No case covers that**, and one
  cannot be written until the ruling lands.

**Two surfaces confirmed genuinely out of scope**, marked N/A explicitly rather than skipped:
**Print** (removed from the suite) and **mobile** (no WIP requirement).
