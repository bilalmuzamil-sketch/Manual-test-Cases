# EXPECT-FAIL cases must carry a three-outcome block (QA lead, 2026-08-06)

**Applies to EVERY case written with `AUTOMATION: READY - EXPECT FAIL (SV-xxxx)`** — the 42 newly
observed, the 25 re-checked stale deviations, and any new ones.

## Why

`AUTOMATION: READY - EXPECT FAIL (SV-xxxx)` on its own is a **PREDICTION about the build**.
Predictions go stale, and re-verifying every one on every redeploy is unwinnable — **this branch
redeployed four times in two days**. Ticket status is not a usable proxy either, and this project
proves it three separate ways:

* **SV-8851** is still **Open** while its fix has shipped — C30050 now passes.
* **SV-8843** and **SV-8847** are **closed** and still reproduce.
* **SV-8827** is **half wrong about the very failure it describes** (it claims Tech Hours defaults
  ON; it defaults OFF, correctly).

So the marker becomes an **INSTRUCTION**, and the automated suite becomes the **monitor**.

## The block — copy this wording

Plain layman English, in Expected Results, **with the deviation note and BEFORE the Rule-54
provenance line**. The `AUTOMATION:` marker still goes **LAST**, blank line before, line break after.

```
What you should see today: <the exact symptom, in plain words>. This is a known problem and it is already reported - see https://shopview.atlassian.net/browse/SV-xxxx
· If you see exactly that, mark this test FAILED and do not raise anything new.
· If it fails in a DIFFERENT way from what is described above, that is a NEW problem - please report it.
· If it PASSES, the fix has shipped: tell the QA lead so the ticket can be closed and this note removed.
```

## Why each line earns its place — none may be dropped

* **The SYMPTOM** is what separates *the known defect* from *a NEW defect hiding behind it*.
  Nothing in the old scheme could catch that.
* **The PASSES line** makes the automation run itself the detector. A fix shipping while its ticket
  sits Open — **exactly SV-8851** — is caught by the very run that would otherwise be confused by
  it, free and continuously.
* Where the ticket is **CLOSED-AS-ACCEPTED**, keep the existing qualifier **alongside** the symptom
  so nobody waits for a fix that is not coming.

## The standard for the symptom

It must be **the symptom WE OBSERVED**, in the tester's words, specific enough that a different
failure would not match it.

* Useless: *"the filter does not work"*.
* The standard: *"every status link returns the same 30 Estimates while the chip reads Status (1)"*.

## Honesty limit — unchanged

This changes what we **MONITOR**, not what we may **ASSERT**. An unobserved case is still
unobserved and still says so. The wording must never imply a verdict we did not observe.

**Report the count of cases that received the block.**
