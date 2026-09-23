# Retest now means exactly one thing — applied 23 September 2026

**QA lead:** *"I want the RETEST to ONLY contain those tickets which has the related story or ticket
marked as Obsolete, the rest should be in FAILED."*

## Moved Failed → Retest (5)

Each carries a comment naming the report or story, its link, **who** marked it obsolete and **when**,
what was actually observed so nothing is lost, and that the decision to retire or re-source the case
is his.

| Check | Its report / story | Marked obsolete by | On |
|---|---|---|---|
| C53476 a count reads 111 where 20 is the cap | SV-10320 | Bilal Muzamil | 21 Sep |
| C53601 a catalogue part not in stock is not found | SV-10001 | Milos Vasic | 23 Sep |
| C55660 part of a word from the middle does not find it | SV-10060 | Milos Vasic | 23 Sep |
| C55685 a correct name brings back other spellings | SV-10025 | Milos Vasic | 23 Sep |
| **C45160** no usage event is recorded | **SV-9167** | Sinisa Nogic | 16 Sep |

## Moved Retest → Failed: none

All eight hover cases (C44866–C44873) sit behind story **SV-9173**, read live today as **OBSOLETE**.
They already satisfied the rule, so none moved.

## ⚠️ One judgement call, flagged not hidden — C45160

**It does not name SV-9167 anywhere.** Its expectation comes from the previous version of the
product (V1 invariant INV-48, Rule 109), not from that story. It was moved on the *substance*: the
reason it fails is precisely that telemetry was dropped from this version, which is what SV-9167
covers, and its twin **C45140 was already retired citing "SV-9167 Obsoleted"**.

A strict reading — only cases whose *named* ticket is obsolete — would leave it in Failed. Moved
because leaving it there says the product is broken when the work was deliberately dropped, and that
is the worse error. **Reversible in one step if he disagrees; the note is on the case itself.**

## Verified in both directions, not assumed

Re-read every check in both columns afterwards and matched its named report or story against the
obsolete set:

- **Retest — 13, every one obsolete-backed.**
- **Failed — 5, none obsolete-backed:** C44825 (no report, he declined one) · C44848, C96844
  (SV-10346, In Progress) · C96845 (SV-10385, Open) · C55716 (SV-10340, Open).
- **Rule violations: 0.**

**Run 415: 202 checks — 184 passed, 5 failed, 13 retest, 0 blocked.**

## What this changes for reading the run

Failed now means *"the product is wrong and somebody is working on it"* — five checks, every one
with a live report. Retest means *"parked because the work was dropped"* — thirteen, none of which
is a defect claim. That is a much more honest picture than a Failed column mixing the two.
