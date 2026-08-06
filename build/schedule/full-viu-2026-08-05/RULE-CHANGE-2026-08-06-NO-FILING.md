# Rule change, 2026-08-06: no ticket is filed without the QA lead's word

**His instruction, verbatim:**

> "For now we need to create the test cases which are authentic, so that when Vlad does the
> automation or when the QA manual tester runs it he can find it and report the issue. However you
> can keep on sharing such things to me and ask me if I want to create a ticket for such things. Not
> stoping you for providing my such insights are deep testing just asking you to just ask me if I
> want to create a ticket for that or not."

## What changed

**The standing authorisation to file defects is withdrawn.** Every finding is now handed over as a
ready-to-file package in `FILED.md` under **CANDIDATES — AWAITING AUTHORISATION**, and nothing is
raised in Jira until he says so.

## What did NOT change, and this is the important half

**The deep testing continues exactly as before.** He was explicit that he is not discouraging the
findings — only the unilateral filing. So every candidate still carries:

* the **mechanism**, not just the symptom;
* a **duplicate search**, with the queries stated and what they returned;
* the **exact test data by on-screen name**, plus what was tried and ruled out;
* the **spec requirement quoted verbatim**;
* an honest attempt to **DISPROVE it first** — which today killed two candidates outright.

**A candidate handed over half-established is worth nothing**, so an unfinished one is marked
unfinished rather than dressed up (see C2).

## The priority he stated: authentic test cases come first

**A missing ticket must never soften a case.** Where a deviation has no ticket, the case still:

* keeps the **documented** expectation (Rule 57) — never the build's behaviour;
* records the deviation plainly;
* tells the tester exactly what to do.

## The no-ticket wording

Rule 61's block assumes a ticket exists. Where filing is pending, the case carries this instead,
with the marker `AUTOMATION: READY - EXPECT FAIL (no ticket yet)`:

```
What you should see today: <the exact symptom, in plain words>. This does not match what the specification requires. It has been reported to the QA lead and a decision on raising a ticket is pending.
· If you see exactly that, mark this test FAILED.
· If it fails in a DIFFERENT way from what is described above, that is a NEW problem - please report it.
· If it PASSES, tell the QA lead - the behaviour may have been fixed.
```

Where a ticket **does** exist (SV-8851, SV-8923, SV-8924, SV-8848 and the rest), the normal Rule-61
block naming that ticket is used.

**Placement is identical in both variants:** with the deviation note, **before** the Rule-54
provenance line; the `AUTOMATION:` marker stays **last**, blank line before, line break after.

## One honest exception, declared

**SV-8933 was filed roughly forty minutes BEFORE this instruction arrived**, under the previous
authorisation. It has not been touched since. It is flagged at the top of `FILED.md` for his
decision, with the full package beside it, and it will be closed with a plain withdrawal comment if
he would rather it had not been raised.
