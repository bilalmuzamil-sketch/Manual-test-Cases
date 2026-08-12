# Changes made — Filters, 2026-08-12

**5 cases changed, all build-independent. No expectation was altered. No build stamp was written.**

Every change is one of two kinds: a **navigation route corrected against the specification**, or a
**plain instruction telling a manual tester to mark BLOCKED rather than FAILED** when the case cannot
be run. The second kind is not new wording — it is the convention **already carried by 11 of the 15
held cases**, applied to the 4 that lacked it.

---

## 1. [C43561](https://shopview.testrail.io/index.php?/cases/view/43561) — FLT-PSRCH-14

**Why it mattered most: this case is `READY`, it is UNTESTED in run 352, and a tester will open it
tomorrow** — and its step 5 sent them to a report and a tab that the specification does not describe.

| Field | Change |
|---|---|
| Steps | *"Open the **Sales Tax** report, choose the **Collected** tab"* → *"Open the **Sales Tax Collected** report"* |
| Expected | added item 7 — mark BLOCKED, not failed, if that page cannot be found |

Sourced from **`S13-R19`** read live today, which names **"Sales Tax (Collected)"** as one surface.
Full reasoning, including why yesterday's pass rightly left it and why that reasoning does not
transfer: `LABEL-DIFF.md`.

---

## 2. Four held cases gained the instruction the other eleven already had

None of these four could be run tomorrow as things stand, and **none of them told the tester so in
words they would read.** The `AUTOMATION: HOLD` marker is the last line of Expected Results and is
labelled *AUTOMATION* — a manual tester reasonably takes it as somebody else's concern. **We know
that is what happens, because five held cases already carry Passed results** (`FINDINGS.md` §2).

| Case | Added to Expected Results | Why |
|---|---|---|
| [C38880](https://shopview.testrail.io/index.php?/cases/view/38880) | if you cannot find two Parts views, or a report with tabs, that both show the new filter bar → **BLOCKED, not failed** | its precondition needs a rollout that has not reached every view |
| [C38881](https://shopview.testrail.io/index.php?/cases/view/38881) | if you do not have an account whose filters were saved before the redesign → **BLOCKED, not failed**, and do not recreate the old state by hand | the case's own marker says no such account exists |
| [C38891](https://shopview.testrail.io/index.php?/cases/view/38891) | if any listed page still has no Search box → **BLOCKED, not failed**, and write down which | its precondition is that the page-search rollout has finished everywhere; it has not |
| [C38901](https://shopview.testrail.io/index.php?/cases/view/38901) | if the report you open has no Search box → **BLOCKED, not failed**; the Parts-view half can still be run | **the real trap of the four** — its preconditions ARE satisfiable, so a tester runs it, finds no search box on report tabs, and fails a build that simply has not shipped that yet |

**C38901 is the one worth the write on its own.** The other three announce themselves through
preconditions a tester cannot meet; C38901 lets the tester all the way in and then produces a false
FAIL.

Each note describes the shortfall **as recorded on the case itself**, and where it refers to build
behaviour it is attributed to the last recorded check — **not presented as something seen today.**

---

## What was deliberately NOT changed

- **No `Last checked against build` line** on any case. Nothing was observed; a stamp would be a
  fabricated claim. The ~89 cases whose stamps understate their real check date are written up as
  outstanding work, not quietly fixed.
- **No expectation, anywhere.** The build did not supply a single assertion in this pass — it could
  not, and under Rule 57 it would not be allowed to anyway.
- **No `AUTOMATION` marker changed.** The distribution is identical before and after: 88 / 7 / 20.
  In particular C43561 stays `READY`, because the marker asserts automatability, not that the case
  currently passes.
- **C38891's other ~40 surface names**, including the two known to be wrong — correcting two of forty
  would make an unrunnable case look freshly verified. See `LABEL-DIFF.md`.
- **The 5 foreign cases** C43576–C43580 — proven byte-identical, untouched (Rule 38).
- **The 5 held-but-Passed results**, including C29615's. Another author's results are reported, never
  edited.
- **`custom_atmstatus` on any case** — in particular the four Vladimir Tomovic set to `3` by hand.
