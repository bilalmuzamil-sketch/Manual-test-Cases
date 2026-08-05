# Schedule — tickets filed on 5 August 2026

## Filed: NONE

**Zero tickets were created, edited, transitioned or re-parented in Jira this pass.**

A defect ticket may only be raised from a fault **observed live** (Standing Rules 12 and 13). There is
no session on the redeployed build, so nothing was observed, so nothing could honestly be filed. No
ticket was raised "on the strength of yesterday's observation" — yesterday's observation was on a build
that is no longer served.

## Deliberately NOT filed, and why

### 1. The eleventh ticket for SCH-MODAL-03 — NOT NEEDED, someone else already filed it

The 4 August readiness report's outstanding item 5 asked whether to raise an eleventh ticket for
**SCH-MODAL-03 = [C30010](https://shopview.testrail.io/index.php?/cases/view/30010)** — the shift
window's time-logged bar reading fully worked when nothing had been clocked.

**Duplicate search run first** (Standing Rule 52 practice): every `Story Defect` under the 15 Schedule
stories was enumerated (22 of them) and every ticket in the `SV-8826`-`SV-8841` range was read in full.

**Result: [SV-8834](https://shopview.atlassian.net/browse/SV-8834) already covers it exactly.** Raised
by **Mudassir Qamar on 04 Aug 08:39**, parented to story `SV-8695`, status **Open**. His description:

> *"The shift tooltip and shift detail modal show TIME LOGGED as 1h / 1h with a full progress bar, but
> the work order shows Actual 0.00 of 1.00 and Progress 0%. No time has been clocked against the line,
> so the schedule is reporting work that never happened."*

C30010's own known-issue block records the same symptom and the same `1h / 1h` figure. **Filing ours
would be a duplicate of another tester's ticket.** Rule 38 keeps us hands-off his ticket; we do not
edit it, and we do not shadow it.

**Action owed instead (staged, not executed):** C30010's text currently tells the tester the fault
*"has no developer ticket yet"*. **That sentence is now false** and must be replaced with SV-8834 and
its link. Queued in `WRITE-PLAN.md`.

### 2. SCH-TOOL-03's deviation — also already filed by someone else

**SCH-TOOL-03 = [C30041](https://shopview.testrail.io/index.php?/cases/view/30041)** (the toolbar
search removes non-matching blocks instead of fading them) was a documented deliberate non-filing —
decisions register entry 8, on the grounds that it is *"arguably the better behaviour, so it is a
product question for Branko rather than a bug for a developer"*.

**[SV-8874](https://shopview.atlassian.net/browse/SV-8874)** (Mudassir Qamar, **05 Aug 05:26**, status
Open, story `SV-8686`) now files it as a defect: *"Grid search hides non-matching shifts instead of
fading them."* Our reasoning stands as reasoning, but the omission is no longer an omission. **Nothing
to file; the register entry needs updating.**

### 3. The API-only finding — still not filed, still waiting on the QA lead

**SCH-API-02 = [C38873](https://shopview.testrail.io/index.php?/cases/view/38873)** — a 76-hour spread
over 26 lines produced 7 shifts with no confirmation prompt and no cap. It is written up in
`build/schedule/viu-2026-08-04/API-ASK.md` and **has not been filed**, because Standing Rule 51 says an
API-only defect is never raised without the QA lead's explicit say-so — **and a batch approval never
covers it**. That ask is unchanged and still open. No new API-only finding arose this pass (nothing was
observed), so there is no new `API-ASK.md`; the 4 August one stands.

### 4. The two contradictions with other testers' tickets — questions, not tickets

Two of our PASS verdicts are contradicted by other testers' **Ready to Fix** defects
(`FINDINGS.md` finding 4): **[SV-8873](https://shopview.atlassian.net/browse/SV-8873)** against
[C29939](https://shopview.testrail.io/index.php?/cases/view/29939), and
**[SV-8868](https://shopview.atlassian.net/browse/SV-8868)** against
[C29944](https://shopview.testrail.io/index.php?/cases/view/29944). In both, **the likelier reading is
that they are right and our verdict is wrong** — we appear to have tested the passing half. That is a
correction owed to **our own cases**, not a ticket, and it needs the build to settle. **Their tickets
were not touched.**

### 5. The three candidate coverage gaps — cases, not tickets, and not authored

**[SV-8863](https://shopview.atlassian.net/browse/SV-8863)** (which view the Schedule opens on),
**[SV-8870](https://shopview.atlassian.net/browse/SV-8870)** (drag-create in Month view) and
**[SV-8867](https://shopview.atlassian.net/browse/SV-8867)** (reassigning a series member by drag) have
no counterpart among our 165. These are **their** defects, already filed by them — we owe **test
cases**, not tickets. New cases need the QA lead's authorisation (Rule 6) and live observation first.

## Our ten existing tickets: read back from Jira, unchanged and correctly shaped

All ten `SV-8848`-`SV-8857` read live this pass: **status Open**, **resolution none**, **priority
Low**, **parent SV-8685** (the epic, never a story), owning story attached with **relates to**. The only
changelog entry since we filed them is Mudassir Qamar adding the label `FS-Schedule` to all ten
(05 Aug 03:21-04:02). Full table in `SOURCE-CURRENCY.md` section 4, raw payloads in
`evidence/our-tickets.json`.
