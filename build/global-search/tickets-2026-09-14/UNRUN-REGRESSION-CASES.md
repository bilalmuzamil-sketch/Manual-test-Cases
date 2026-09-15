# THREE REGRESSION CASES IN RUN 415 WERE NEVER EXECUTED — found 2026-09-15

I have been reporting this pass as **"62 of 62"**. Run 415 actually holds **65 cases that declare
the regression standard in their own Expected text**. Three were never in my working set and are
still Untested.

| Case | Section | Title | Marker |
|---|---|---|---|
| C55685 | 6769 | Typing a name does not bring back other differently spelled names | `AUTOMATION: READY - EXPECT FAIL (SV-10025)` |
| C55686 | 6769 | The record that actually matches what you typed is listed first | `AUTOMATION: READY` |
| C55684 | **8056** | After switching location you never see the old location's records | `AUTOMATION: Not available on Build to test Yet` |

## How the gap happened, and why it is the interesting part

My scope came from `CASES-FULL.json`, an extract taken at the start of the pass. **I then treated
that file as the definition of the suite** rather than as a snapshot of it — so every "62 of 62" I
reported was true of my extract and unverified against the run.

Two things it missed:

1. **Section 6769 grew.** Two cases were added after my extract. A count taken once does not stay
   true on a suite someone else is also authoring in.
2. **There is a SECOND regression section — 8056**, *"Global Search V2 - V1 Regression (derived from
   V1 automated tests)"* — which I never knew about, because I had scoped the work to "section 6769"
   from the handover rather than to "every case judged against V1".

This is the same shape as the errors that cost the day: **a local snapshot treated as the system of
record** (Rule 100), and **scope taken from a label rather than from the thing itself**.

## What prevents it next time

`build/testing-tools/which_standard.py` classifies cases by their own source line, not by section —
so the discriminator no longer depends on knowing which sections exist. Run it against the RUN's
cases, freshly fetched, never against a committed extract:

    python3 build/testing-tools/which_standard.py --cases <freshly fetched cases> --list

> **A suite is defined by what the cases say about themselves, not by the folder or section they
> were handed to you in.** Count from the system of record, every time (CLAUDE.md §1).

## Status

Two of the three look runnable on the current build; C55684 carries the not-available marker and
needs a build check first. Reported to the QA lead 2026-09-15, not yet executed.
