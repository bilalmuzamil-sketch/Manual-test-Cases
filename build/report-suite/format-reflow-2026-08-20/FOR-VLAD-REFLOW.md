# FOR VLAD — Report Suite reflow touches on Automated (atm=3) cases (2026-08-20)

These Automated cases were re-saved via the TestRail UI to fix the interim `<p>/<br>` render (hazard #6). The ONLY change is a single trailing "." added to the Preconditions field; steps/expected/marker/provenance unchanged.

- [C30162](https://shopview.testrail.io/index.php?/cases/view/30162) — preconditions gained a trailing '.' via the formatting reflow; no semantic change (atm=3 Automated).
