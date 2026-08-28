# Report Suite — the three approved WIP case extensions — 2026-08-28

**Two cases written and verified clean. One needed nothing — it already says what it was asked to
say. No case is Automated, so no Rule-65 register row arises from this job.**

Approved by the QA lead 2026-08-28. Requirement text read from the live WIP specification **version
28** (page last modified 2026-08-24) as captured on 2026-08-26 in
`build/report-suite/source-verify-2026-08-26/specs/wip.json`.

---

## C30457 — the "Declined" state added · WRITTEN

> S2-R2 (live v28): *"Work orders whose status is Invoiced, Paid, or Declined never appear, in any
> tab, any Totals row, the summary strip, or any download."*

Rule 41 — the whole case was re-verified, not just the one line, and **four things had to move for
the case to be internally consistent**:

| Field | Change |
|---|---|
| Title | *"Invoiced; Paid and part-sale…"* → **"Invoiced; Paid; Declined and part-sale work orders never appear"** (62 chars) |
| Preconditions | a **Declined** ZZAUTOTEST work order added to the seed list |
| Steps | step 2 now looks for the **Declined** work order too |
| Expected §1 | *"The Invoiced, Paid **and Declined** work orders do not appear…"* |
| `refs` + provenance | **re-anchored** — the case cited **S2-R5**, which in v28 is the LOADING requirement and is not what this case tests. Now **S2-R2; S2-R3** |

**It also fixed pre-existing render damage.** C30457's Expected Result was stored as `<p>` wrapping
raw newline characters — the same trap that hit C30451 today — so a tester was reading all three
expectations, the provenance line and the marker **run together in one paragraph**. This was NOT
caused by this pass; it was already on the case before anything was written today (it is visible in
the before-snapshot taken for the refs backfill). The rewrite stores the body with `<br>` line
breaks, so it now renders line by line. **See the follow-up below — other cases may be in the same
state.**

## C30528 — the missing snapshot fields added · WRITTEN

> S11-R2 (live v28): *"Each snapshot row captures, at minimum: the work order; the tab …; the work
> order's status; that tab's Earned and Remaining values, **with the underlying Labor and Parts
> earned/remaining amounts**; **its Adjustments value**; the location and organization …; and the
> snapshot's calendar date."*

Expected §5 listed the work order, the tab, its status, Earned, Remaining, location/organization and
the date — **the Labor and Parts earned/remaining breakdown and the Adjustments value were missing**.
Both are now in the list, with Adjustments cross-referenced to §3 so the case does not contradict
itself (§3 already says only the status-tab row carries an Adjustments value). **`refs` and the
provenance now cite S11-R2** alongside S11-R1 and S3-R6. Nothing else in the case changed.

## C43838 — the violet ruling · ALREADY SATISFIED, NOT WRITTEN

> S5-R14 (live v28): *"The highlight is a **soft violet** fill and ring on the figure; the active tab
> shows in the accent color at a bolder weight."*

Read live and read whole: **C43838 already asserts exactly this.** §4 reads *"The highlight is a soft
violet fill and ring on the figure"*, §5 reads *"The active tab itself shows in the accent colour at a
bolder weight"*, the provenance cites **specification version 28 (S5-R14)**, and the amber-vs-violet
question is explicitly **closed** in the case's own words: *"Specification version 28 states the
highlight is a soft violet fill and ring, which resolves the question in favour of violet — there is
no longer a colour discrepancy to raise."* Its `refs` already cite v28 S5-R14 too.

**So no write was made.** Re-writing it would have changed nothing a tester reads and would have
risked the case for no gain.

## Verification

`RENDERED-AFTER.json` — all three case pages re-read in a real browser after the writes. All three
show three `markdown fr-view` containers, line breaks intact, no literal tag, no visible entity,
provenance present and the `AUTOMATION:` marker present exactly once and **last**. `WRITE-LOG.json`
records, per case: the fields sent, the HTTP status, and the comparison proving every field NOT sent
came back unchanged (Rule 50).

## A NOTE ON THE PROVENANCE DATE

The instruction said to restamp provenance to *"v28 read 2026-08-28"*. **The v28 specification body
this pass read was captured on 2026-08-26 and no Confluence credentials were supplied to this
session, so it was not re-fetched today.** Stamping *"read on 28 August 2026"* would have claimed a
live read that did not happen (Rule 12). The cases therefore carry the honest two-part stamp already
established in this repo: **"specification version 28 …, read on 26 August 2026"** plus a dated
**"Re-checked against the live specification on 28 August 2026: …"** sentence saying exactly what was
re-read and what changed.

## OUTSTANDING — what I need from you

1. **A follow-up worth scheduling, not done here:** C30457 was found already carrying flattened
   render damage from an earlier pass. **Other Report Suite cases stored as `<p>` around raw newlines
   are in the same state and no one has counted them.** A read-only sweep would find them all in one
   run.
2. Confluence credentials, if you want provenance stamps to carry a same-day live read date rather
   than the capture date of the held spec body.
