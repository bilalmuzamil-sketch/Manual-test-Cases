# Label differences — 2026-08-12

## Scope, stated first: NO LABEL WAS READ FROM THE BUILD THIS SESSION

Both sign-ins are dead (`BUILD-VERIFICATION.md`), so **no on-screen label was observed**, no
`text-transform` casing was checked, and **nothing here is a fresh build claim**.

**The one label change made this session is sourced from the SPECIFICATION, not from the build** —
which is why it could be made at all.

---

## The change: C43561 step 5

| | |
|---|---|
| Case | **[C43561](https://shopview.testrail.io/index.php?/cases/view/43561)** — FLT-PSRCH-14 |
| Before | *"5. Open the **Sales Tax** report, choose the **Collected** tab, and look at the button row."* |
| After | *"5. Open the **Sales Tax Collected** report and look at the button row."* |

**The source is the case's own governing requirement.** `S13-R19`, read live from Confluence on
2026-08-12 (page 572030978, last modified 6 August 2026 — unchanged since our records), says
verbatim:

> **S13-R19:** Where a page has more than one icon-only action in its toolbar, those actions collapse
> into a single "more" kebab on mobile. This applies to Inventory, Purchase Orders, Timesheet
> Activities, both Technician Efficiency reports, **Sales Tax (Collected)**, and any other page
> carrying two or more icon actions

**The spec names ONE surface, "Sales Tax (Collected)". Our case had turned it into a report called
"Sales Tax" with a tab called "Collected" — a structure the requirement does not describe.** The
case's own `refs` field already quoted the anchor correctly (*"…Sales Tax Collected"*), so the case
was inconsistent with its own recorded traceability.

**It is corroborated, independently, by a live observation we did not make:** yesterday's pass
recorded the nav item reading `Sales Tax Collected` with **no tabs at all**
(`build/filters/build-verify-2026-08-11/CLASSIFICATION.md`). Spec and build agree; only our case
differed.

### Why this was corrected when yesterday's pass deliberately left it

Yesterday grouped C43561 with **[C38909](https://shopview.testrail.io/index.php?/cases/view/38909)**
and declined to rename, on the reasoning that *"renaming the step would silently convert a coverage
finding into a test of a different control"*. **That reasoning is right for C38909 and does not
transfer to C43561, and the difference is whether the tab is load-bearing:**

- **C38909 asserts different filter buttons on two different tabs.** The tab structure IS its
  assertion. Renaming would destroy a real finding. **Left untouched.**
- **C43561 asserts that two or more icon buttons collapse into one "more" menu on a phone.** Which
  page you are standing on is pure navigation; the tab carries none of the assertion. Correcting the
  route changes nothing about what is tested.

**No expectation was altered** (Rule 57). Only the navigation route in a step — the Rule-9 layer.

### And it is belt-and-braces

Because this session could not open the build, C43561 also gained a plain instruction so that a
tester who still cannot find the page records the right thing:

> *"7. If you cannot find a report named Sales Tax Collected, or the page you open does not have two
> or more small icon buttons to gather together, mark this test BLOCKED - do not mark it failed - and
> write down which page you tried."*

**Left deliberately in place: `AUTOMATION: READY`** — the case is automatable, and the marker asserts
automatability, not that it currently passes (Rule 60, layer 3).

---

## Not done, and owed: C38891's ~42 surface names

**[C38891](https://shopview.testrail.io/index.php?/cases/view/38891)** names roughly 42 surfaces, and
**two are known wrong** — it says `IBS Batch Transactions` and `Sales Tax Invoices` where the build's
nav reads `IBS Batches` and `Sales Tax Collected`.

**They were not corrected, for the reason yesterday's pass gave and this session agrees with:**
correcting two names inside a list of forty would make the case *look* freshly verified while the
other ~40 remain unchecked, and the case still could not be run end to end.

**What it needs is one pass that walks all 42 surfaces at once, with a working session.** The live
spec's own `S14-R6` surface list — fetched today and reproduced in the source record — is the
checklist to walk it against, and it carries an explicit naming warning that matters here:

> *Naming note for QA:* seven surfaces are named differently in code than in the UI … **Locate
> surfaces by URL rather than by name.**
