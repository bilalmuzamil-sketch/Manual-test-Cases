# SV-8923 is invalid — it was filed against an unmet precondition. Recommend withdrawal.

**Reported, not actioned.** The ticket is ours, but withdrawing it is the QA lead's call, so nothing
has been changed on it. This file is the evidence.

**Ticket:** [SV-8923](https://shopview.atlassian.net/browse/SV-8923) — *"Schedule: the Business Hours
switch shades nothing - out-of-hours time looks identical to the working day"*. Story Defect, Low,
parent SV-8700, filed by us earlier today.

**The case it came from:** `SCH-VIEW-06` =
[C30047](https://shopview.testrail.io/index.php?/cases/view/30047) — *"Business Hours toggle shades
non-working hours in day view"*.

---

## What went wrong

**C30047's own precondition 2 reads: *"The shop has working hours set."*** When the observation was
taken, **the shop had no business hours at all** — the Edit Location toggle *"Set business hours for
this shop"* was OFF, and the previous session recorded exactly that in
[C29970](https://shopview.testrail.io/index.php?/cases/view/29970)'s text: *"the shop has NO business
hours set (the Edit Location toggle is off, and turning it on would change a shared setting…)"*.

**With no business hours configured there is no out-of-hours period to shade, so shading nothing is
the correct behaviour.** The switch was working the whole time.

The two facts were in our own notes on the same day and were never put side by side. The precondition
was not checked before the deviation was called.

---

## The proof that it works, taken today on the same build

Shop business hours were set to **06:00–18:00, Monday to Friday** (`startMinute 360`,
`endMinute 1080`, saved and read back), and the same day view was re-driven on **`v3.5-7ec992f`**:

| Business Hours toggle | Elements carrying `fc-non-business` |
|---|---|
| **ON** | **40** |
| **OFF** | **0** |
| **ON again** | **40** |

The 40 elements are visibly rendered — `background rgb(248, 250, 252)`, `display block`,
`opacity 1` — and they sit in **two bands**: `x=524 w=289` and `x=1390 w=289`.

**The arithmetic confirms they are the right bands, not just some shading.** The day grid spans
x 524 → 1679, i.e. **1155px for 24 hours = 48.1 px/hour**. Each band is `289 / 48.1 = 6.0 hours`.
So the shaded regions are **00:00–06:00** and **18:00–24:00** — precisely the hours outside the
06:00–18:00 business day, with the working day itself left unshaded.

That satisfies all three of C30047's expected results, so **C30047 is a PASS**.

Evidence: `evidence/batch8/` (`b8m.json`, `b8n.json`, `b8d.json`), screenshots `b8m-day-bh-on`,
`b8n-shading`.

---

## What we recommend, and what it costs if ignored

1. **Withdraw SV-8923** — close it with a plain comment explaining it was raised against a shop with
   no business hours configured. Per the standing rule, **close it, never delete it**: the reasoning
   is worth more on the record than the ticket is worth gone.
2. **Do not put an expect-fail marker on C30047.** It passes.

If the ticket stands, a developer will spend time looking for a fault in shading code that is
working correctly — and the next tester to read C30047 will be told to expect a failure that will not
happen, which is the precise failure mode Standing Rule 61 exists to prevent.

**The wider lesson, which is the useful part:** the deviation was called without checking the case's
own preconditions. *"The shop has working hours set"* was written at the top of the case and was
false at the time of the observation. **A precondition that is not satisfied does not produce a
defect — it produces a case that could not be run.**
