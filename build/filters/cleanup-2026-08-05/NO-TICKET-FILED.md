# The phone defect was NOT filed — for two independent reasons, either of which is enough

The pass was authorised to raise **one** Low-priority defect if the phone filters were seen applying as
you tap instead of waiting for an "Apply filters" button. **Nothing was filed.**

## Reason 1 — the ticket already exists, and it is not ours

**[SV-8875](https://shopview.atlassian.net/browse/SV-8875)** — *"Mobile individual filter sheets don't
support multi-select and have no "Apply filters" button (S12-R6 / S12-R2)"*

| | |
|---|---|
| Type | **Story Defect** |
| Status | **Open** |
| Priority | Medium *(not ours to change — it is his ticket)* |
| Parent | **SV-8797** — Mobile Filter Bar |
| Raised by | **Ahtasham Amjad** |
| Raised at | **2026-08-05T05:50:12-0500** — **32 minutes after Branko closed the question** |

His ticket reports exactly the thing we were sent to raise, and his reading of the specification is the
same as the one we reached on our own before we found his ticket: that **S12-R6 applies to individual
filter sheets, not only to the combined "All Filters" sheet.** He quotes it in his Expected Result:

> *"S12-R6: mobile stages selections and applies them when the user taps an "Apply filters" button
> within the sheet. This applies to individual filter sheets, not only the combined "All Filters"
> sheet."*

He even names our cases in the ticket — *"C29622 / C29623 (All Filters sheet — passing), C29624
(individual chip sheet — failing)"*. **Filing our own would have been a duplicate.**

**We did not touch his ticket** — not its priority, not its links, not a comment. It is another
author's record (Standing Rule 38), and its Medium priority is his call, not ours.

**What we did use it for:**
[C29624](https://shopview.testrail.io/index.php?/cases/view/29624) now carries a plain known-issue line
naming **SV-8875**, and its automation marker is
`AUTOMATION: READY - EXPECT FAIL (SV-8875)`. So the automation engineer gets a red result with a
ticket number attached instead of a mystery.

## Reason 2 — we could not witness it, and we do not file what we have not seen

Every cookie set on the machine returns **HTTP 401 `sso_required`**, and `quick-login` is gated by a
valid session, so it cannot bootstrap one. **We had no sign-in and observed nothing on the build**
(the detail is in `BUILD-MARKER.md`).

There **is** a live capture of this behaviour — taken this morning by the re-check pass, on the
**byte-identical** build, at a 390 × 844 phone viewport,
`../recheck-2026-08-05/evidence/raw/o-mob2.json`:

- key `S12R6_deferredApply` — tapping **Paid** in the Status sheet fired
  `GET /api/work-orders?…filters[0][value]=paid` **immediately** (HTTP 200), the address bar became
  `?status=paid&tab=all` straight away, and four seconds later `applyButtons: []` — **no Apply button in
  that single-filter sheet**;
- key `allFiltersSheet` — the **combined** sheet *does* have the footer button, on-screen text
  **"Apply Filters"**, and `callsBefore: 0` — nothing was requested until it was pressed.

**That is somebody else's run, not ours.** Under Standing Rule 12 a verdict has to be observed with
evidence captured *that run*, so we have used it only to understand the picture — never as the basis of
a ticket, and never as the basis of a "tested on the build" claim on a case.

## The label discrepancy this turned up — reported, not silently fixed

The capture above shows the button's on-screen text as **"Apply Filters"**, with a **capital F**
(`data-test-id="apply_filters"`). The specification writes it **"Apply filters"**, and so do our eight
phone cases.

**We did not change the casing.** Standing Rule 9 wants the label exactly as the build shows it, but the
only evidence for the capital F is another run's capture, and we could not confirm it ourselves. **It
needs one live look, then a one-line correction across the phone cases.** Logged as an outstanding item.

## Nothing here is API-only

Standing Rule 51 was considered and does not apply: this behaviour is on a screen a customer uses, so it
is user-facing, not an API-only finding. No `API-SPLIT.md` was needed and none was written.
