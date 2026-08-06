# TestRail execution log — the zeros-row repair, 2026-08-06

**Authorised:** `update_case` on **C30173** only. No `add_case`, no `delete_case`, no section operation,
no run write, no result logged.

## Every TestRail call this pass made

| # | Call | Target | HTTP | Verification |
|---|---|---|---|---|
| 1 | `get_case` | 30173 | 200 | pre-write snapshot, `snapshots/case-30173-pre.json` and `snapshots/c30173-pre-write.json` |
| 2 | `get_case` | 30114 | 200 | read-only; **not written** — see below |
| 3 | **`update_case`** | **30173** | **200** | re-GET and byte-compared: **30 fields, 0 mismatches**. `custom_preconds`, `custom_steps`, `custom_expected`, `refs` all MATCH intended; every other field **byte-identical**; only `updated_on` moved (1786008455 → 1786022303) and `updated_by` stayed 3. Per-field table: `C30173-FIELD-COMPARE.json` |
| 4 | `get_case` | 30173 | 200 | post-write snapshot, `snapshots/c30173-post-write.json` |
| 5 | `get_run` · `get_tests` · `get_results_for_run` | run 359 | 200 | read-only courtesy check |

**All three text fields were sent explicitly on the payload**, because `update_case` re-renders any text
field omitted from it (the declared normalisation that wrapped fields in `<p>` and turned `\n` into
`\r\n` on the 5 August Filters pass). `refs` was verified under TestRail's declared normalisation
`','.join(p.strip() for p in s.split(','))`; the value is one comma-free entry of 50 characters, well
inside the 248-character per-entry limit.

**Payload shape was sanity-checked before sending, not only byte-checked after** — a byte-check proves we
wrote what we intended, never that the intention was right. Checked: exactly **one** provenance line, one
build line, one `AUTOMATION:` marker; the marker is the **last** content with a blank line before it; the
`---` separator present once; all three Rule-61 outcomes present; **no raw markup** (`<p>`, `<ol>`,
`<li>`, `<br>`).

## Run 359 — not written to, and it could not have been

The only write this pass made was `update_case/30173`. No run or result endpoint was called with a write
verb at any point. Read live afterwards for the record: run **359** "Reports Suite -
Nebojsa/Viktoria (VIU Pending)", **`include_all` still false**, **476 tests**, **535 result records**,
counters 6 Passed / 0 Failed / 0 Blocked / 470 Untested / 0 Retest. The test and result counts match the
last figures in `full-viu-2026-08-06/FINDINGS.md` exactly.

**Honest limit:** no pre-write snapshot of the run's 535 results was taken, because no run write was ever
intended, so the statement above is *"the counts match the last recorded figures"* and not *"every result
proven present by id against a snapshot taken minutes earlier"*.

## What changed on C30173

**Title unchanged** — *"A no-match export still downloads headers and a zero totals row"*. It already
asserted the zeros row, which is part of why the case was self-contradictory: the title asserted it while
the body had been talked out of it.

**Preconditions and steps unchanged**, byte-identical to what was live.

**Expected Results — the assertion RESTORED, not the build described (Rule 57).**

Before:

> 2. The file contains the column headers and no data rows.
> 2a. Note for the tester: the written description does not say whether a no-match download should also
> carry a totals row, so do not fail the test either way on that. Write down what you see - a totals row
> of zeros, or no totals row - and carry on. The product owner has been asked to settle it.

After:

> 2. The file contains the column headers, a totals row of zeros, and no data rows.
>
> What you should see today: the file downloads with the column headings and nothing after them - there is
> no totals row at all, of zeros or otherwise. This is a known problem and it is already reported - see
> https://shopview.atlassian.net/browse/SV-8991.
> - If you see exactly that, mark this test FAILED and do not raise anything new.
> - If it fails in a DIFFERENT way from what is described above - for example the download errors, or a
> totals row appears but the figures are not zeros - that is a NEW problem, so please report it.
> - If it PASSES, the fix has shipped: tell the QA lead so the ticket can be closed and this note removed.

**Note 2a was FALSE.** It told the tester the description is silent on a point the description states
plainly, and it did so directly above a provenance line citing **S18-R10**, the requirement that
contradicts it. Under Rule 57 the documented expectation stands and the case becomes a deviation.

**Marker: `AUTOMATION: READY` → `AUTOMATION: READY - EXPECT FAIL (SV-8991)`.**

**`refs`: `SV-8616 (SBC spec v13 2026-07-31 Story 18 S18-R10)` → `SV-8616 (SBC spec v15 2026-08-05 Story
18 S18-R10)`.** Not asked for in the brief, and done deliberately under Rules 41 and 42: the case's own
provenance line already said **version 15** while its `refs` pinned **v13**, so the case contradicted
itself about which document it answers to — and a version pin two releases stale is exactly the mechanism
Rule 42 exists to make work. The ticket key and the requirement anchor are unchanged.

**Provenance line unchanged, deliberately.** It already read *"…specification version 15 (S18-R10). Last
checked against build v3.5-7168d14 on 8/6/2026."* Nothing was re-observed today — the branch is
unreachable — so re-stamping the build line would have claimed an observation we did not make (Rule 12).

## C30114 — the same defect, NOT written, and it needs authorisation

**[C30114](https://shopview.testrail.io/index.php?/cases/view/30114)** *"Pinned control toggles All
customers and Clear all; clearing shows empty state"* carries the identical false note:

> 4a. Note for the tester: the written description does not say what the totals row should do when nothing
> matches, so do not fail the test on the totals row either way. Write down what you see - a row of zeros,
> or no totals row at all - and carry on. The product owner has been asked to settle it.

Its own `refs` cite **S18-N1** — the requirement that says *"the report shows the empty state (Story 17)
and the totals row shows zeros"*. So it, too, denies a requirement it cites, and it too reads
`AUTOMATION: READY` for behaviour the build fails. It is the **screen** half of SV-8991 where C30173 is
the **export** half.

**It was left exactly as it is** because the brief authorised C30173 only. What it needs, in one write:
restore *"and the totals row shows zeros"* to item 4, replace note 4a with the same Rule-61 symptom block
naming SV-8991, set the marker to `AUTOMATION: READY - EXPECT FAIL (SV-8991)`, and pin its `refs` to
v15 (they read `SBC spec v13 2026-07-31`). **This is the single most important follow-up from this pass**
— leaving it half-repaired means the screen half of a filed defect still cannot fail.
