# Which test cases each filed defect touches — OUR RECORD, deliberately NOT in the Jira tickets

> **Why this file exists.** The organisation's ticket format forbids any reference to our test cases
> inside a Jira ticket — no internal case IDs, no C-ids, no TestRail links (QA lead's standing
> instruction, 2026-08-04). That mapping is still ours to keep, so it lives here instead of being lost.
> Every "QA test cases affected" / "QA test cases blocked" section was removed from the six tickets and
> its content is reproduced below verbatim.
>
> **Nothing here goes into a ticket.** If a developer needs to know the impact, it is described in the
> ticket in plain product terms ("a group of checks on invoiced hours cannot be run"), without ids.

| Defect | Jira | What it is |
| --- | --- | --- |
| 1 | [SV-8818](https://shopview.atlassian.net/browse/SV-8818) | PDF download fails with a server error at ordinary sizes, on 5 of 6 reports |
| 2 | [SV-8819](https://shopview.atlassian.net/browse/SV-8819) | Parts Velocity Turns/Yr overstated on the This Year preset |
| 3 | [SV-8820](https://shopview.atlassian.net/browse/SV-8820) | Inventory Value reports stock value one day after the date asked for |
| 4 | [SV-8821](https://shopview.atlassian.net/browse/SV-8821) | Creating an invoice from a completed work order fails with a server error |
| 5 | [SV-8822](https://shopview.atlassian.net/browse/SV-8822) | Customer save returns a server error instead of a validation error |
| 6 | [SV-8823](https://shopview.atlassian.net/browse/SV-8823) | Inventory Value spreadsheet: money as text, columns ignored and re-ordered |

---

## SV-8818 — PDF download 500 · cases affected

PV-EXP-11 = [C38885](https://shopview.testrail.io/index.php?/cases/view/38885) ·
TU-EXP-09 = [C38887](https://shopview.testrail.io/index.php?/cases/view/38887) ·
IV-EXP-07 = [C30593](https://shopview.testrail.io/index.php?/cases/view/30593) ·
IV-EXP-09 = [C30595](https://shopview.testrail.io/index.php?/cases/view/30595) ·
SBC-EXP-14 = [C30172](https://shopview.testrail.io/index.php?/cases/view/30172) ·
SBC-API-05 = [C30194](https://shopview.testrail.io/index.php?/cases/view/30194) ·
SBR-EXP-15 = [C30290](https://shopview.testrail.io/index.php?/cases/view/30290) ·
SBR-API-05 = [C30320](https://shopview.testrail.io/index.php?/cases/view/30320)

Plus **one new case proposed** to cover this failure specifically (not authored — needs authorisation).

## SV-8819 — Turns/Yr window · cases affected

PV-CALC-09 = [C30367](https://shopview.testrail.io/index.php?/cases/view/30367) ·
PV-CALC-16 = [C30374](https://shopview.testrail.io/index.php?/cases/view/30374)

**Both also need their own reproduction wording corrected to name the This Year preset**, since as
written they would not reproduce this. That is an authoring action on our side, awaiting authorisation.

## SV-8820 — Inventory Value as-of date · cases affected

IV-DATE-02 = [C30562](https://shopview.testrail.io/index.php?/cases/view/30562) ·
IV-DATE-04 = [C30564](https://shopview.testrail.io/index.php?/cases/view/30564) ·
IV-DATE-05 = [C30565](https://shopview.testrail.io/index.php?/cases/view/30565) ·
IV-DATE-06 = [C30566](https://shopview.testrail.io/index.php?/cases/view/30566)

## SV-8821 — Invoice create 500 · cases BLOCKED until it is fixed

**Nine blocked outright** — the sales-rep deactivation flow needs a rep who is a staff record *and*
holds customer assignments; the only rep carrying report credit on this org is not a staff record at
all, the reps that can be created hold no invoices, and invoices cannot be created:

| Case | TestRail |
| --- | --- |
| SBR-API-06 | [C30321](https://shopview.testrail.io/index.php?/cases/view/30321) |
| SBR-DEACT-02 | [C30253](https://shopview.testrail.io/index.php?/cases/view/30253) |
| SBR-DEACT-03 | [C30254](https://shopview.testrail.io/index.php?/cases/view/30254) |
| SBR-DEACT-04 | [C30255](https://shopview.testrail.io/index.php?/cases/view/30255) |
| SBR-DEACT-05 | [C30256](https://shopview.testrail.io/index.php?/cases/view/30256) |
| SBR-DEACT-06 | [C30257](https://shopview.testrail.io/index.php?/cases/view/30257) |
| SBR-DEACT-07 | [C30258](https://shopview.testrail.io/index.php?/cases/view/30258) |
| SBR-DEACT-08 | [C30259](https://shopview.testrail.io/index.php?/cases/view/30259) |
| SBR-DEACT-09 | [C30260](https://shopview.testrail.io/index.php?/cases/view/30260) |

**Five** whose arithmetic cannot be exercised while every hours value is `0.0`:

| Case | TestRail |
| --- | --- |
| SBC-CALC-03 | [C30151](https://shopview.testrail.io/index.php?/cases/view/30151) |
| SBR-CALC-01 | [C30229](https://shopview.testrail.io/index.php?/cases/view/30229) |
| SBR-CALC-02 | [C30230](https://shopview.testrail.io/index.php?/cases/view/30230) |
| SBR-CALC-03 | [C30231](https://shopview.testrail.io/index.php?/cases/view/30231) |
| SBR-CALC-09 | [C38894](https://shopview.testrail.io/index.php?/cases/view/38894) |

**One partially blocked:** SBR-WO-05 = [C30314](https://shopview.testrail.io/index.php?/cases/view/30314)
passes overall, but its customer-rep fallback leg only applies at invoice creation and so cannot be
exercised.

**Total: 15 cases blocked (9 + 5 + 1 partial).**

## SV-8822 — Customer save 500 · cases affected

**None.** This blocked one API-only shortcut during seeding, which was then completed successfully
through the shape the UI uses. It is filed on its own merits at Low severity. The load-bearing blocker
for the 15 cases above is SV-8821, not this.

## SV-8823 — Inventory Value spreadsheet · cases affected

IV-EXP-02 = [C30588](https://shopview.testrail.io/index.php?/cases/view/30588) ·
IV-EXP-03 = [C30589](https://shopview.testrail.io/index.php?/cases/view/30589)

---

## Internal re-check obligation — STILL STANDS (Standing Rule 49)

**Do not delete this section, and do not confuse it with the Jira-facing disclaimer that was removed.**

The QA-facing text in the tickets no longer says "this branch is not final, this finding is provisional"
— the QA lead's reasoning being that **every QA branch is always non-final, so saying so adds nothing,
and it is our job to keep the test cases accurate rather than the developer's job to caveat our
findings.** A defect hedged as provisional invites dismissal.

**That change is to the JIRA TEXT ONLY.** Internally, every one of these six findings was observed on
QA branch `sv8582`, build `v3.4.1-0ed4433`, and the Rule-49 re-check queue
`build/report-suite/viu-2026-08-03/RECHECK-QUEUE.md` stays **OPEN** and unchanged. When the build moves,
we re-check the findings and the affected cases above — that obligation is ours and is not weakened by
dropping the disclaimer from the tickets.
