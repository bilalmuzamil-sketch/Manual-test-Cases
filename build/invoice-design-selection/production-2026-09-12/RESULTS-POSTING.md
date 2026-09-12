# How the production results go into run 446 (QA lead's instruction, 12 September 2026)

> *"You will use the same test RUN and the results for production will be posted in the same test case
> run In a NEW comment. This way the old result will stay there for the QA branch the the new results
> will have their own Marker letting the reader know that its the test result from Production account now."*

## It works, and here is the proof it works

Results in TestRail are **append-only**. A new result on a test does not replace the old one — it is
added underneath, and both stay on the test's page with their own dates. This was confirmed live on
this very run: test `2924652` currently shows **two** result comments, the 11 September QA-branch one
and the 12 September Staging one, each in its own `markdown fr-view` block.

## The marker

`push_results_to_run.py --lead "<sentence>"` puts one paragraph at the **very top of every comment**,
above the environment/build/date header. That is the marker. For this run it reads:

```
PRODUCTION RUN — this result is from the live Production account (app.shopview.com), NOT the QA
branch and NOT Staging. The earlier comment on this test is the QA-branch result and still stands
for that environment.
```

The line under it is generated from the flags and repeats the environment in the reader's own terms:

```
Tested on the Production account (app.shopview.com), build <marker>, on <date>.
```

## The command

```bash
python3 build/testing-tools/push_results_to_run.py \
  --run 446 \
  --results build/invoice-design-selection/production-2026-09-12/PR-<nn>.json \
  --build-marker "<the production build marker, read live that day>" \
  --date "<D Month 2026>" \
  --env "the Production account (app.shopview.com)" \
  --lead "PRODUCTION RUN — this result is from the live Production account (app.shopview.com), NOT the QA branch and NOT Staging. The earlier comment on this test is the QA-branch result and still stands for that environment." \
  [--allow-non-passed]   # only if he lifts the Passed-only limit
  --dry-run              # ALWAYS first; results cannot be edited once written
```

## The one consequence he should know about

Both **comments** stay, exactly as he wants. But a test carries **one status**, and TestRail takes the
**latest** result as that status. So once a production result is posted, the test's badge — and the
run's headline counts — describe **production**, not the QA branch. The QA-branch verdict is still
readable in its own comment, with its own date and environment line; it is just no longer what the
counter counts.

That is almost certainly what he wants (production is the environment that matters at release), and it
is stated here so nobody is surprised by the run's totals changing.

## House rules that still bind this posting

- **Dry-run first, every time.** A written result cannot be edited.
- **A non-Passed result must carry a `todo`** saying what needs to be done, in plain words a
  non-technical QA can act on.
- **Union-only sync.** The run holds 45 tests; the results file covers a subset, and the tool unions
  rather than replacing — a partial `case_ids` list on `update_run` would DELETE tests and their
  results.
- **Verify the rendering after the write**, on the served page, not from the 200: the comment must sit
  in `markdown fr-view` with real paragraphs and no literal tags.
- Every case keeps its own evidence file under `evidence/`, named for the case.
