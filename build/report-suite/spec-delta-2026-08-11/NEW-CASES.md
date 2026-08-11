# New cases — Report Suite spec-delta, 2026-08-11

Four created. Each fills a requirement with **no coverage at all**, established by searching the
live case text of the whole report, not by assuming.

| Internal | C-id | Section | Requirement | Coverage before |
|---|---|---|---|---|
| `SBC-TYPE-04` | [C43591](https://shopview.testrail.io/index.php?/cases/view/43591) | 4291 SBC — Product Type Filter | SBC v17 `S3-R6a` | **none** — the requirement is new in v17 |
| `WIP-CALC-11` | [C43592](https://shopview.testrail.io/index.php?/cases/view/43592) | 4354 WIP — Earned & Remaining | WIP v11 §3 — fixed-price lines valued at their fixed amounts | **none** |
| `WIP-CALC-12` | [C43593](https://shopview.testrail.io/index.php?/cases/view/43593) | 4354 WIP — Earned & Remaining | WIP v11 §3 — binary earning with no invoiced hours | **none** |
| `WIP-CALC-13` | [C43594](https://shopview.testrail.io/index.php?/cases/view/43594) | 4354 WIP — Earned & Remaining | WIP v11 §3 — core charge in parts value; core decision moves nothing | **partial** — [C30478](https://shopview.testrail.io/index.php?/cases/view/30478) covers Parts Remaining only |

## The fixed-price hole, stated plainly

**Not one of the 78 Work In Progress cases mentioned fixed-price work.** Searched for *fixed-price*,
*fixed labor*, *fixed line*, *fixed amount* and *flat rate* across every field of every case:
**zero matches.** WIP v11 added a rule saying such lines are valued at *"the numbers the customer is
billed - not at underlying picked parts or an hourly derivation"* and that with no invoiced hours
*"the full fixed amount stays in Remaining until the line is completed, then moves entirely to
Earned."* That is a rule about how the report computes money, with no test of any kind behind it.

Split into two cases because it makes two independently observable assertions (Rule 45(e)): **what
the value is**, and **when it moves**.

## The core half that was missing

[C30478](https://shopview.testrail.io/index.php?/cases/view/30478) already asserts that Parts
Remaining includes the core charge. What had no case is the **invariance**: *"Marking a returned
core OK or Not OK never changes WIP figures."* That is the more valuable half — a developer could
break it without anything on screen looking wrong, because the figures would simply be different,
not absent.

`WIP-CALC-13` deliberately does **not** assert the *"across all tabs, including Estimates"* clause:
which tabs a work order occupies is the open bucketing question, so asserting it would smuggle in a
side of a contradiction we have refused to pick.

## Conformance

| Requirement | Result |
|---|---|
| `custom_atmstatus` | **1 (Not Automated)** on all four, read back live |
| `check_add_case_payloads.py` | **exit 0** before any creation |
| Marker | **`AUTOMATION: READY`** on all four — never `EXPECT FAIL`, which would assert a build fact no one has observed |
| Rule 54 | **sentence 1 only**, each source carrying its own read-date. **No sentence 2** — these have never been checked against a build |
| `refs` | one comma-free entry, longest **244** of 248 (measured, not estimated) |
| Titles | longest **80** of 80 |
| Byte verification | every field re-GET and compared after creation; **10 fields each, 0 mismatches** |

## Internal IDs — checked three ways

`SBC-TYPE-04`, `WIP-CALC-11`, `WIP-CALC-12`, `WIP-CALC-13` were each checked against **every
internal ID mentioned anywhere in the repository**, not merely the id-map — which is the check that
catches a retired ID the id-map no longer lists. That sweep found **550** distinct IDs against the
id-map's 476, and it is what showed `SBC-TYPE-01` and `SBC-TYPE-03` are both spent, making
`SBC-TYPE-04` the first free number. A sibling project reused a retired ID and its resync overwrote
the retired record; this is the check that prevents it.
