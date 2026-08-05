# Schedule — READINESS, 5 August 2026

**Build observed: `v3.5-be42149`** · `index.html` last-modified Wed, 05 Aug 2026 08:09:19 GMT ·
etag `70e496609e155994b93f515db32d0289` — read at **13:24:01Z**, **13:49:34Z** and **14:11:22Z**,
**byte-identical all three times**, so nothing redeployed under this pass.

> **`READINESS-2026-08-04.md` is SUPERSEDED by this file.** It is kept, not deleted.

## LEGEND — read this before the table

- **Works correctly** — the case passes on this build.
- **Product is wrong** — **THIS IS A GOOD TEST CASE.** It asserts what the specification requires,
  the build does something else, and a developer ticket exists. **Its FAIL is the expected result
  until that ticket is fixed** — a tester marking it Failed is doing the right thing, and an
  automated run should expect the failure rather than treat it as a broken script.
- **Waiting on the product owner** — the specification answers the point two opposite ways and
  nobody has ruled, so the case refuses to assert either answer.
- **Not built yet** — the feature does not exist on this build. **Not a readiness shortfall** —
  absent product, not a bad case. Excluded from the ready-to-automate figure.
- **Cannot be set up here** — needs something this shared estate cannot provide.
- A case needing a tool (devtools, a viewport size, a seeded data state, reading a downloaded file)
  **IS runnable by a manual tester today** and IS automatable. It is not a shortfall and it appears
  in no column below.

## OUTCOMES — one column each, mutually exclusive, every row sums

| Area | Works correctly | Product is wrong (ticketed) | Waiting on the PO | Not built yet | Cannot be set up here | TOTAL |
|---|---:|---:|---:|---:|---:|---:|
| SCH-API | 3 | 0 | 0 | 1 | 0 | 4 |
| SCH-BLOCK | 3 | 0 | 0 | 0 | 0 | 3 |
| SCH-CAP | 4 | 0 | 0 | 0 | 0 | 4 |
| SCH-COLOR | 3 | 0 | 0 | 0 | 0 | 3 |
| SCH-CONF | 6 | 0 | 0 | 0 | 0 | 6 |
| SCH-DAY | 3 | 2 | 0 | 0 | 0 | 5 |
| SCH-DEL | 9 | 0 | 0 | 0 | 0 | 9 |
| SCH-DND | 7 | 1 | 0 | 0 | 0 | 8 |
| SCH-EDGE | 4 | 1 | 1 | 0 | 1 | 7 |
| SCH-EVT | 6 | 0 | 0 | 1 | 0 | 7 |
| SCH-FILT | 5 | 1 | 0 | 0 | 0 | 6 |
| SCH-HRS | 5 | 0 | 0 | 0 | 0 | 5 |
| SCH-KEY | 1 | 2 | 0 | 0 | 0 | 3 |
| SCH-LANE | 3 | 1 | 0 | 0 | 0 | 4 |
| SCH-LINE | 6 | 0 | 0 | 0 | 0 | 6 |
| SCH-MCAL | 4 | 0 | 0 | 0 | 0 | 4 |
| SCH-MODAL | 4 | 4 | 0 | 0 | 0 | 8 |
| SCH-NAV | 6 | 0 | 0 | 0 | 0 | 6 |
| SCH-PERM | 12 | 1 | 0 | 0 | 0 | 13 |
| SCH-REAS | 3 | 0 | 0 | 0 | 0 | 3 |
| SCH-REG | 5 | 0 | 0 | 0 | 0 | 5 |
| SCH-SCOPE | 3 | 1 | 0 | 0 | 0 | 4 |
| SCH-SER | 3 | 1 | 0 | 0 | 0 | 4 |
| SCH-SPREAD | 7 | 1 | 1 | 1 | 0 | 10 |
| SCH-START | 6 | 0 | 0 | 0 | 1 | 7 |
| SCH-TIP | 4 | 1 | 0 | 0 | 0 | 5 |
| SCH-TOOL | 2 | 1 | 0 | 0 | 0 | 3 |
| SCH-VIEW | 6 | 2 | 0 | 0 | 0 | 8 |
| SCH-WOL | 4 | 1 | 0 | 0 | 0 | 5 |
| **TOTAL** | **137** | **21** | **2** | **3** | **2** | **165** |

## READY TO AUTOMATE — one written formula

```
  cases                            165
  − waiting on the product owner    2
  − cannot be set up here           2
  − not built yet                   3
  ------------------------------------
  READY TO AUTOMATE               158
```

**Cross-check against the markers actually written to TestRail:** `AUTOMATION: READY` = **137**,
`AUTOMATION: READY - EXPECT FAIL` = **21**, and 137 + 21 = **158**.
**The two figures agree, so the arithmetic gate PASSES.**

Movement since 4 August: the figure was **157**. It is **158** because **click-to-arm turned out to
be BUILT** on this build (one case out of *not built*), while **two cases moved from *works
correctly* to *product is wrong*** — which does not change the total, because a product-is-wrong
case is still automatable.

## FLAGS — enumerated separately, never mixed into the outcome columns

Every case below already appears in exactly one outcome column above. These lists are cross-cuts,
so they deliberately do **not** sum to 165.

### Waiting on the product owner (2) — and the ask is OURS, not his
- **SCH-SPREAD-07** = [C29983](https://shopview.testrail.io/index.php?/cases/view/29983)
- **SCH-EDGE-05** = [C30089](https://shopview.testrail.io/index.php?/cases/view/30089)

The specification says shop closures **do not** block the multi-day spread (§4.5) and also that they
**do** block it (§12). Both sentences are still in version 23. The question was drafted on
**22 July 2026** and **has never been sent to Branko** — so these two are blocked on us sending it,
not on him answering. Their HOLD markers say exactly that.

### Not built yet (3)
- **SCH-EVT-02** = [C30017](https://shopview.testrail.io/index.php?/cases/view/30017)
- **SCH-SPREAD-11** = [C38863](https://shopview.testrail.io/index.php?/cases/view/38863)
- **SCH-API-02** = [C38873](https://shopview.testrail.io/index.php?/cases/view/38873)

**One left this list today: SCH-DND-08** = [C29962](https://shopview.testrail.io/index.php?/cases/view/29962) — the click-to-arm alternative required by
§11 **is built** on `v3.5-be42149`. Proven live: every sidebar card carries a control labelled
*"Schedule S-12876 by click"*, `aria-pressed` flips to `true`, the label becomes *"Stop placing
S-12876"*, and clicking a technician cell opens the same scope picker a drag would.

### Cannot be set up here (2)
- **SCH-EDGE-07** = [C38865](https://shopview.testrail.io/index.php?/cases/view/38865) — needs a real daylight-saving clock change; the next Mountain one is **1 November 2026**.
- **SCH-START-02** = [C29970](https://shopview.testrail.io/index.php?/cases/view/29970) — needs shop business hours switched on, which is a shared setting on this estate.

### Product is wrong (21) — each with the ticket a tester should NOT re-raise

| Case | C-id | Ticket |
|---|---|---|
| SCH-DAY-01 | [C30001](https://shopview.testrail.io/index.php?/cases/view/30001) | [SV-8837](https://shopview.atlassian.net/browse/SV-8837) |
| SCH-DAY-04 | [C30004](https://shopview.testrail.io/index.php?/cases/view/30004) | [SV-8856](https://shopview.atlassian.net/browse/SV-8856) |
| SCH-DND-06 | [C29960](https://shopview.testrail.io/index.php?/cases/view/29960) | [SV-8840](https://shopview.atlassian.net/browse/SV-8840) |
| SCH-EDGE-02 | [C30086](https://shopview.testrail.io/index.php?/cases/view/30086) | **no ticket — accepted, see the decisions register** |
| SCH-FILT-05 | [C29946](https://shopview.testrail.io/index.php?/cases/view/29946) | [SV-8857](https://shopview.atlassian.net/browse/SV-8857) |
| SCH-KEY-01 | [C30066](https://shopview.testrail.io/index.php?/cases/view/30066) | [SV-8853](https://shopview.atlassian.net/browse/SV-8853) |
| SCH-KEY-03 | [C30068](https://shopview.testrail.io/index.php?/cases/view/30068) | [SV-8853](https://shopview.atlassian.net/browse/SV-8853) |
| SCH-LANE-04 | [C29999](https://shopview.testrail.io/index.php?/cases/view/29999) | [SV-8850](https://shopview.atlassian.net/browse/SV-8850) |
| SCH-MODAL-02 | [C30009](https://shopview.testrail.io/index.php?/cases/view/30009) | [SV-8833](https://shopview.atlassian.net/browse/SV-8833) |
| SCH-MODAL-03 | [C30010](https://shopview.testrail.io/index.php?/cases/view/30010) | [SV-8834](https://shopview.atlassian.net/browse/SV-8834) |
| SCH-MODAL-05 | [C30012](https://shopview.testrail.io/index.php?/cases/view/30012) | [SV-8829](https://shopview.atlassian.net/browse/SV-8829) |
| SCH-MODAL-07 | [C30014](https://shopview.testrail.io/index.php?/cases/view/30014) | [SV-8852](https://shopview.atlassian.net/browse/SV-8852) |
| SCH-PERM-08 | [C30081](https://shopview.testrail.io/index.php?/cases/view/30081) | [SV-8854](https://shopview.atlassian.net/browse/SV-8854) |
| SCH-SCOPE-05 | [C29967](https://shopview.testrail.io/index.php?/cases/view/29967) | [SV-8886](https://shopview.atlassian.net/browse/SV-8886) |
| SCH-SER-02 | [C29988](https://shopview.testrail.io/index.php?/cases/view/29988) | [SV-8849](https://shopview.atlassian.net/browse/SV-8849) |
| SCH-SPREAD-06 | [C29982](https://shopview.testrail.io/index.php?/cases/view/29982) | [SV-8855](https://shopview.atlassian.net/browse/SV-8855) |
| SCH-TIP-01 | [C30034](https://shopview.testrail.io/index.php?/cases/view/30034) | **no ticket — accepted, see the decisions register** |
| SCH-TOOL-03 | [C30041](https://shopview.testrail.io/index.php?/cases/view/30041) | [SV-8874](https://shopview.atlassian.net/browse/SV-8874) |
| SCH-VIEW-05 | [C30046](https://shopview.testrail.io/index.php?/cases/view/30046) | [SV-8827](https://shopview.atlassian.net/browse/SV-8827) |
| SCH-VIEW-09 | [C30050](https://shopview.testrail.io/index.php?/cases/view/30050) | [SV-8851](https://shopview.atlassian.net/browse/SV-8851) |
| SCH-WOL-04 | [C29939](https://shopview.testrail.io/index.php?/cases/view/29939) | [SV-8873](https://shopview.atlassian.net/browse/SV-8873) |

**Two joined this list today, both because our own earlier verdict was wrong:**
- **SCH-WOL-04** = [C29939](https://shopview.testrail.io/index.php?/cases/view/29939) — typing a technician's FULL name finds nothing.
- **SCH-SCOPE-05** = [C29967](https://shopview.testrail.io/index.php?/cases/view/29967) — the scope picker has no *Select all* and no *Cancel*; **SV-8886 filed today.**

### Cases needing a tool — runnable today, listed only so nobody mistakes them for a shortfall (3)
- **SCH-EDGE-02** = [C30086](https://shopview.testrail.io/index.php?/cases/view/30086) — a forced narrow window width.
- **SCH-EDGE-04** = [C30088](https://shopview.testrail.io/index.php?/cases/view/30088) — a seeded busy week.
- **SCH-EDGE-08** = [C38866](https://shopview.testrail.io/index.php?/cases/view/38866) — the app's own dark-mode switch.

**None of these is a HOLD.** A tool flag never justifies HOLD — only a genuinely unobtainable thing
does, and no Schedule case needs one.

## THE HONEST LIMIT OF THIS PASS

**8 of the 165 were re-observed live today** on `v3.5-be42149`: SCH-WOL-04, SCH-FILT-03, SCH-FILT-04,
SCH-FILT-06, SCH-LINE-03, SCH-DND-08, SCH-SCOPE-05 and the scope-picker contents. **The other 157
carry verdicts measured on `v3.5-4873abe` on 4 August and have NOT been re-observed against the
rebuilt branch** — every one of them says so, in words, on the case itself.

So this readiness figure is **honest about its own basis**: the outcome columns are 8 rows of
fresh observation and 157 rows of carried-forward observation, and the Standing Rule 49 re-check
queue stays **OPEN** for the 157. It is not a claim that all 165 were re-verified today.

**The branch has still not been declared final, so every verdict here is PROVISIONAL.**
