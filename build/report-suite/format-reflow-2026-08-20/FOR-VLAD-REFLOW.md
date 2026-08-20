# FOR VLAD — Report Suite reflow touches on Automated (atm=3) cases (2026-08-20)

These Automated cases were re-saved via the TestRail UI to fix the interim `<p>/<br>` render (hazard #6). The ONLY change is a single trailing "." added to the Preconditions field; steps/expected/marker/provenance unchanged.

- [C30162](https://shopview.testrail.io/index.php?/cases/view/30162) — ⚠️ DAMAGED by the reflow, NOT cleanly fixed. This case's Expected field was the `\n`-in-`<p>` variant (no `<br>`); the UI Save collapsed it to one line with the marker/provenance now inline. Needs a targeted Expected-field line-break restoration. See `DAMAGED-ATM3-CASES.md`. (atm=3 Automated.)
- [C30287](https://shopview.testrail.io/index.php?/cases/view/30287) — ⚠️ DAMAGED by the reflow, NOT cleanly fixed. Same `\n`-in-`<p>` variant; Expected field collapsed to one line, marker/provenance inline. Needs a targeted Expected-field line-break restoration. See `DAMAGED-ATM3-CASES.md`. (atm=3 Automated.)
- [C30398](https://shopview.testrail.io/index.php?/cases/view/30398) — preconditions gained a trailing '.' via the formatting reflow; no semantic change (atm=3 Automated).
- [C30604](https://shopview.testrail.io/index.php?/cases/view/30604) — preconditions gained a trailing '.' via the formatting reflow; no semantic change (atm=3 Automated).
- [C30603](https://shopview.testrail.io/index.php?/cases/view/30603) — preconditions gained a trailing '.' via the formatting reflow; no semantic change (atm=3 Automated).
