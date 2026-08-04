# Schedule — the one API-related finding, queued as a question (Standing Rule 51)

**Nothing here has been filed.** Standing Rule 51: an API-related defect is never raised on our own
initiative, and **a batch approval does not cover an API item** — so this is asked separately even
though ten non-API Schedule tickets were filed today.

## The finding

**A very long multi-day spread is neither capped nor confirmed.**

Scheduling the whole of work order **S-14527 Qispring Rentals** (5 lines, 40h 19m) and then
**S-14531 Wuwick Apparel** (26 lines, 76h 36m) each went straight through: 4 shifts and 7 shifts
created, no confirmation prompt, no limit. The request carries a flag that exists precisely to
acknowledge a long series (`acknowledgeLongSeries: false`) and the server never asked for it. Nothing
on this build returns a "please confirm" or a "too many shifts" response.

## Why this is API-related

**Judged by reachability from the product, not by how we happened to capture it** (the Rule-51 test):

- The **8-week confirmation** and the **120-shift ceiling** appear only in the **engineering technical
  plan**. **No numbered requirement in the Schedule specification version 23 mentions either.**
- A user cannot reach the fault from any screen: the spread window offers Full estimate, 1 week,
  2 weeks, "Until a date…" and "Specific hours…", and **none of them can produce a series long enough
  to hit an 8-week or 120-shift limit** from a single work order's estimate on this data.
- So the only way to demonstrate it is to call the create endpoint directly with a span the product's
  own screens never generate. **Invisible to a user and to a manual tester ⇒ API-related.**

**Contrast, so the test is visible in practice:** the ten tickets filed today are all reachable from a
screen. SV-8848 (times six hours out) is a technical fault but a user sees it on every block, so it is
user-facing and it was filed.

## The question for the QA lead

**Do you want a ticket for this, or not?**

Two honest sub-questions before anyone builds anything:

1. **Is the 8-week / 120-shift limit even a product requirement?** It is engineering text; Branko's
   specification does not mention it. If it is not a requirement, there is no defect — and the right
   fix is to our two cases, not to the code.
2. **If it IS a requirement**, it belongs in the specification first, and the two cases should be
   re-derived from that wording rather than from the engineering plan.

Affected cases, both currently marked NOT-BUILT with a plain "mark this BLOCKED, not failed" note:
**SCH-SPREAD-11 = [C38863](https://shopview.testrail.io/index.php?/cases/view/38863)** and
**SCH-API-02 = [C38873](https://shopview.testrail.io/index.php?/cases/view/38873)**.
