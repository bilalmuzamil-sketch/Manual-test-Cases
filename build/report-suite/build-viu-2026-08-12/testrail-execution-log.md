# TestRail execution log — Report Suite, 12 August 2026

**Build `v3.6-8c28eed`** · **8 `update_case` ops over 8 distinct cases** · **every one HTTP 200 + byte-verified MATCH, 30 fields compared each, 0 collateral changes.**

`0 add_case` · `0 delete_case` · `0` section writes · `0` run writes · `0` results logged · `0` Jira calls of any kind.

All three text fields (`custom_preconds`, `custom_steps`, `custom_expected`) were sent on every payload, because TestRail re-renders any text field omitted from the payload into `<p>`-wrapped HTML with CRLF. Verification is by CONTENT, never by `updated_on`.

| # | Case | Title | HTTP | Verify | Fields | Collateral | What changed |
|---:|---|---|---:|---|---:|---:|---|
| 1 | [C30510](https://shopview.testrail.io/index.php?/cases/view/30510) | Work In Progress: a three-dot menu holds Download (PDF) and Download (CSV) | 200 | **MATCH** | 30 | 0 | build line: v3.5-4795eee -> v3.6-8c28eed / 12 August 2026 |
| 2 | [C30511](https://shopview.testrail.io/index.php?/cases/view/30511) | Downloads keep shown columns, honor filters, include the tab's Totals row | 200 | **MATCH** | 30 | 0 | dropped: What you should see today: the download fails outright whene<br>dropped: · If you see exactly that, mark this test FAILED and do not <br>dropped: · If it fails in a DIFFERENT way from what is described abov<br>dropped: · If it PASSES, the fix has shipped: tell the QA lead so the<br>build line: v3.5-f77875c -> v3.6-8c28eed / 12 August 2026<br>marker: EXPECT FAIL (SV-8907) -> READY |
| 3 | [C30512](https://shopview.testrail.io/index.php?/cases/view/30512) | Downloaded money and Inv. Hrs values keep the on-screen formats | 200 | **MATCH** | 30 | 0 | dropped: What you should see today: Nothing downloads. Both Download <br>dropped: - If you see exactly that, mark this test FAILED and do not <br>dropped: - If it fails in a DIFFERENT way from what is described abov<br>dropped: - If it PASSES, the fix has shipped: tell the QA lead so the<br>build line: v3.5-16cf83f -> v3.6-8c28eed / 12 August 2026<br>marker: EXPECT FAIL (SV-8907) -> READY |
| 4 | [C30513](https://shopview.testrail.io/index.php?/cases/view/30513) | Inv. Hrs green/red coloring appears on screen and in the PDF; not the CSV | 200 | **MATCH** | 30 | 0 | dropped: What you should see today: Nothing downloads. Both Download <br>dropped: - If you see exactly that, mark this test FAILED and do not <br>dropped: - If it fails in a DIFFERENT way from what is described abov<br>dropped: - If it PASSES, the fix has shipped: tell the QA lead so the<br>build line: v3.5-16cf83f -> v3.6-8c28eed / 12 August 2026<br>marker: EXPECT FAIL (SV-8907) -> READY |
| 5 | [C30514](https://shopview.testrail.io/index.php?/cases/view/30514) | Days Open in a download is frozen at the moment the file is generated | 200 | **MATCH** | 30 | 0 | dropped: What you should see today: Nothing downloads. Both Download <br>dropped: - If you see exactly that, mark this test FAILED and do not <br>dropped: - If it fails in a DIFFERENT way from what is described abov<br>dropped: - If it PASSES, the fix has shipped: tell the QA lead so the<br>build line: v3.5-16cf83f -> v3.6-8c28eed / 12 August 2026<br>marker: EXPECT FAIL (SV-8907) -> READY |
| 6 | [C30515](https://shopview.testrail.io/index.php?/cases/view/30515) | The downloaded files are named "wip-2-report.pdf" and "wip-2-report.csv" | 200 | **MATCH** | 30 | 0 | build line: v3.5-16cf83f -> v3.6-8c28eed / 12 August 2026 |
| 7 | [C30516](https://shopview.testrail.io/index.php?/cases/view/30516) | Export headers read "Unit" and "Branch" — documented limitation, do not file | 200 | **MATCH** | 30 | 0 | build line: v3.5-16cf83f -> v3.6-8c28eed / 12 August 2026 |
| 8 | [C30518](https://shopview.testrail.io/index.php?/cases/view/30518) | Export notifications: success caption, "Empty export" warning | 200 | **MATCH** | 30 | 0 | dropped: What you should see today: Nothing downloads. Both Download <br>dropped: - If you see exactly that, mark this test FAILED and do not <br>dropped: - If it fails in a DIFFERENT way from what is described abov<br>dropped: - If it PASSES, the fix has shipped: tell the QA lead so the<br>build line: v3.5-16cf83f -> v3.6-8c28eed / 12 August 2026<br>marker: EXPECT FAIL (SV-8907) -> READY |

## C30517 was deliberately NOT written

[C30517](https://shopview.testrail.io/index.php?/cases/view/30517) (*The PDF shows the shop logo at the top when one is set*) is the ninth member of the family and is **absent from the write plan on purpose**. The downloaded PDF carries **exactly one embedded image** (`/Subtype /Image`, DCTDecode/JPEG) — consistent with a logo, but **an embedded image is not an observed logo**. Its Rule-54 sentence 2 is therefore **left exactly as found**. Inventing a build line for something that was not observed is the one thing that would make every other line in this table worthless.

## Run 359 — PROVEN UNDAMAGED, by content

| check | before | after |
|---|---|---|
| `include_all` | false | false |
| tests | 480 | 480 |
| test-id sets | — | **equal in both directions** |
| case_id sets | — | **equal in both directions** |
| result records | 535 | 535, **all present BY ID** |
| new results during the write window | — | **0** |
| graded or derived fields moved on any of the 535 | — | **0** — not even the declared `case_title` / `case_refs` read-time echoes, because no title and no `refs` was written |
| counters (passed/failed/blocked/untested) | 6/0/0/474 | 6/0/0/474 |

## The 12 foreign cases — PROVEN UNTOUCHED

Vladimir Tomovic's **C38919–C38923** and **C43567–C43573** were re-read after the batch and are **byte-identical including `updated_on` and `updated_by`** (Standing Rules 38/50: *we did not write to it* is an assertion; a byte-identical snapshot is evidence).

**Ours 480 / live 492.** Both numbers are stated so our count stays honest without claiming or hiding anyone else’s work.

## `custom_atmstatus` was never sent

No payload carried `custom_atmstatus`. The 40 flagged Report Suite cases were set by Vladimir Tomovic himself and are his alone.
